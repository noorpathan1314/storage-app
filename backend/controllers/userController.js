import Directory from "../models/directoryModel.js";
import User from "../models/userModel.js";
import mongoose, { Types } from "mongoose";
import Session from "../models/sessionModel.js";
import OTP from "../models/otpModel.js";
import nodemailer from "nodemailer";
import multer from "multer";
import path from "path";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

// Cloudinary configuration (env variables already loaded)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const register = async (req, res, next) => {
  const { name, email, password, otp } = req.body;
  const otpRecord = await OTP.findOne({ email, otp });

  if (!otpRecord) {
    return res.status(400).json({ error: "Invalid or Expired OTP!" });
  }

  await otpRecord.deleteOne();

  const session = await mongoose.startSession();

  try {
    const rootDirId = new Types.ObjectId();
    const userId = new Types.ObjectId();

    session.startTransaction();

    await Directory.insertOne(
      {
        _id: rootDirId,
        name: `root-${email}`,
        parentDirId: null,
        userId,
      },
      { session }
    );

    await User.insertOne(
      {
        _id: userId,
        name,
        email,
        password,
        rootDirId,
      },
      { session }
    );

    session.commitTransaction();

    res.status(201).json({ message: "User Registered" });
  } catch (err) {
    session.abortTransaction();
    console.log(err);
    if (err.code === 121) {
      res
        .status(400)
        .json({ error: "Invalid input, please enter valid details" });
    } else if (err.code === 11000) {
      if (err.keyValue.email) {
        return res.status(409).json({
          error: "This email already exists",
          message:
            "A user with this email address already exists. Please try logging in or use a different email.",
        });
      }
    } else {
      next(err);
    }
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ error: "Invalid Credentials" });
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    return res.status(404).json({ error: "Invalid Credentials" });
  }

  const allSessions = await Session.find({ userId: user.id });

  if (allSessions.length >= 2) {
    await allSessions[0].deleteOne();
  }

  const session = await Session.create({ userId: user._id });

  res.cookie("sid", session.id, {
    httpOnly: true,
    signed: true,
    maxAge: 60 * 1000 * 60 * 24 * 7,
  });
  res.json({ message: "logged in" });
};

export const getCurrentUser = (req, res) => {
  res.status(200).json({
    name: req.user.name,
    email: req.user.email,
    picture: req.user.picture,
  });
};

export const logout = async (req, res) => {
  const { sid } = req.signedCookies;
  await Session.findByIdAndDelete(sid);
  res.clearCookie("sid");
  res.status(204).end();
};

export const logoutAll = async (req, res) => {
  const { sid } = req.signedCookies;
  const session = await Session.findById(sid);
  await Session.deleteMany({ userId: session.userId });
  res.clearCookie("sid");
  res.status(204).end();
};

export const changePassword = async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ error: "Old password and new password are required" });
  }
  if (newPassword.length < 4) {
    return res.status(400).json({ error: "Password must be at least 4 characters" });
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(401).json({ error: "Old password is incorrect" });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    next(err);
  }
};

export const updateName = async (req, res, next) => {
  const { name } = req.body;

  if (!name || name.trim().length < 3) {
    return res.status(400).json({ error: "Name must be at least 3 characters" });
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.name = name.trim();
    await user.save();

    res.json({ message: "Name updated successfully", user: { name: user.name, email: user.email } });
  } catch (err) {
    next(err);
  }
};

// Step 1: Send OTP to new email
export const sendChangeEmailOtp = async (req, res, next) => {
  const { newEmail } = req.body;
  const userId = req.user._id;

  if (!newEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
    return res.status(400).json({ error: "Valid email is required" });
  }

  const existingUser = await User.findOne({ email: newEmail, _id: { $ne: userId } });
  if (existingUser) {
    return res.status(409).json({ error: "Email already in use by another account" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  await OTP.findOneAndUpdate(
    { email: newEmail },
    { otp, createdAt: new Date() },
    { upsert: true }
  );

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASS,
    },
  });

  const html = `
    <div style="font-family: sans-serif;">
      <h2>Email Change Request</h2>
      <p>Your OTP to change your email address is: <strong>${otp}</strong></p>
      <p>This OTP is valid for 10 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"Storage App" <${process.env.GMAIL_USER}>`,
    to: newEmail,
    subject: "Email Change OTP",
    html,
  });

  res.json({ message: "OTP sent to new email address" });
};

// Step 2: Verify OTP and change email
export const verifyChangeEmail = async (req, res, next) => {
  const { newEmail, otp } = req.body;
  const userId = req.user._id;

  if (!newEmail || !otp) {
    return res.status(400).json({ error: "Email and OTP are required" });
  }

  const otpRecord = await OTP.findOne({ email: newEmail, otp });
  if (!otpRecord) {
    return res.status(400).json({ error: "Invalid or expired OTP" });
  }

  const existingUser = await User.findOne({ email: newEmail, _id: { $ne: userId } });
  if (existingUser) {
    return res.status(409).json({ error: "Email already in use by another account" });
  }

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ error: "User not found" });
  user.email = newEmail;
  await user.save();

  await otpRecord.deleteOne();

  res.json({ message: "Email changed successfully" });
};

// ---------- Cloudinary Avatar Upload (updated) ----------
const memoryStorage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Only image files are allowed"), false);
};

const uploadAvatarMiddleware = multer({
  storage: memoryStorage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
}).single("avatar");

export const uploadAvatar = (req, res, next) => {
  uploadAvatarMiddleware(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    try {
      const user = await User.findById(req.user._id);
      if (!user) return res.status(404).json({ error: "User not found" });

      // Delete old Cloudinary avatar if exists
      if (user.picture && user.picture.includes("cloudinary.com")) {
        try {
          // Extract public_id from URL (e.g., .../users/ID/avatar/avatar_123456)
          const parts = user.picture.split("/");
          const publicId = parts.slice(-2).join("/").split(".")[0];
          await cloudinary.uploader.destroy(publicId);
        } catch (delErr) {
          console.warn("Could not delete old avatar:", delErr.message);
        }
      }

      // Upload new avatar to Cloudinary
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: `users/${req.user._id}/avatar`,
            public_id: `avatar_${Date.now()}`,
            transformation: [{ width: 200, height: 200, crop: "fill" }],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
      });

      user.picture = result.secure_url;
      await user.save();

      res.json({ message: "Avatar updated successfully", picture: user.picture });
    } catch (error) {
      console.error("Avatar upload error:", error);
      next(error);
    }
  });
};