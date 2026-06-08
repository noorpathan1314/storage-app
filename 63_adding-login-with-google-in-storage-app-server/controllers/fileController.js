// controllers/fileController.js
import { Types } from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import multer from "multer";
import path from "path";
import Directory from "../models/directoryModel.js";
import File from "../models/fileModel.js";

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log("Cloudinary configured with:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY ? "present" : "missing",
  api_secret: process.env.CLOUDINARY_API_SECRET ? "present" : "missing",
});

const memoryStorage = multer.memoryStorage();
const uploadMiddleware = multer({ storage: memoryStorage }).single("file");

const uploadToCloudinary = (buffer, options) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

// ---------- Upload File (stores resourceType) ----------
export const uploadFile = async (req, res, next) => {
  uploadMiddleware(req, res, async (err) => {
    if (err) {
      console.error("Multer error:", err);
      return res.status(400).json({ error: "File upload error" });
    }

    const parentDirId = req.params.parentDirId || req.user.rootDirId;
    try {
      const parentDirData = await Directory.findOne({
        _id: parentDirId,
        userId: req.user._id,
      });
      if (!parentDirData) {
        return res.status(404).json({ error: "Parent directory not found!" });
      }
      if (!req.file) {
        return res.status(400).json({ error: "No file provided" });
      }

      const filename = req.headers.filename || req.file.originalname || "untitled";
      const extension = path.extname(filename);
      const buffer = req.file.buffer;

      const publicId = `${req.user._id}/${Date.now()}_${Math.round(Math.random() * 1e9)}`;
      const result = await uploadToCloudinary(buffer, {
        folder: `users/${req.user._id}`,
        public_id: publicId,
        resource_type: "auto",
      });

      const fileDoc = await File.create({
        extension,
        name: filename,
        parentDirId: parentDirData._id,
        userId: req.user._id,
        cloudinaryPublicId: result.public_id,
        url: result.secure_url,
        resourceType: result.resource_type,   // ✅ store resource type
      });

      return res.status(201).json({ message: "File Uploaded", fileId: fileDoc._id });
    } catch (err) {
      console.error("Upload error:", err);
      next(err);
    }
  });
};

// ---------- Get / Download File ----------
export const getFile = async (req, res) => {
  const { id } = req.params;
  const fileData = await File.findOne({
    _id: id,
    userId: req.user._id,
  }).lean();
  if (!fileData) {
    return res.status(404).json({ error: "File not found!" });
  }

  const fileUrl = fileData.url;

  if (req.query.action === "download") {
    return res.redirect(fileUrl);
  }
  return res.redirect(fileUrl);
};

// ---------- Rename File ----------
export const renameFile = async (req, res, next) => {
  const { id } = req.params;
  const file = await File.findOne({ _id: id, userId: req.user._id });
  if (!file) {
    return res.status(404).json({ error: "File not found!" });
  }
  file.name = req.body.newFilename;
  await file.save();
  return res.status(200).json({ message: "Renamed" });
};

// ---------- Soft delete (move to trash) ----------
export const deleteFile = async (req, res, next) => {
  const { id } = req.params;
  const file = await File.findOne({ _id: id, userId: req.user._id });
  if (!file) {
    return res.status(404).json({ error: "File not found!" });
  }
  file.isDeleted = true;
  file.deletedAt = new Date();
  await file.save();
  return res.status(200).json({ message: "File moved to trash" });
};

// ---------- Restore from trash ----------
export const restoreFile = async (req, res, next) => {
  const { id } = req.params;
  const file = await File.findOne({ _id: id, userId: req.user._id, isDeleted: true });
  if (!file) {
    return res.status(404).json({ error: "File not found in trash" });
  }
  file.isDeleted = false;
  file.deletedAt = null;
  await file.save();
  res.json({ message: "File restored successfully" });
};

// ---------- Permanently delete (uses stored resourceType) ----------
export const permanentDeleteFile = async (req, res, next) => {
  const { id } = req.params;
  const file = await File.findOne({ _id: id, userId: req.user._id, isDeleted: true });
  if (!file) {
    return res.status(404).json({ error: "File not found in trash" });
  }
  try {
    if (file.cloudinaryPublicId) {
      // Use the stored resourceType (fallback to "raw" if missing)
      const resourceType = file.resourceType || "raw";
      await cloudinary.uploader.destroy(file.cloudinaryPublicId, { resource_type: resourceType });
    } else {
      console.log("⚠️ No cloudinaryPublicId found, skipping Cloudinary deletion");
    }
    await file.deleteOne();
    res.json({ message: "File permanently deleted" });
  } catch (err) {
    console.error("Cloudinary deletion error:", err);
    next(err);
  }
};

// ---------- Get all trashed files ----------
export const getTrashedFiles = async (req, res, next) => {
  try {
    const files = await File.find({
      userId: req.user._id,
      isDeleted: true,
    }).lean();
    res.json(files);
  } catch (err) {
    next(err);
  }
};

// ---------- Copy File (stores resourceType) ----------
export const copyFile = async (req, res, next) => {
  const { itemId, destinationDirId } = req.body;
  const userId = req.user._id;
  try {
    const originalFile = await File.findOne({ _id: itemId, userId }).lean();
    if (!originalFile) {
      return res.status(404).json({ error: "File not found" });
    }

    const destDir = await Directory.findOne({ _id: destinationDirId, userId });
    if (!destDir) {
      return res.status(404).json({ error: "Destination directory not found" });
    }

    const result = await cloudinary.uploader.upload(originalFile.url, {
      folder: `users/${userId}`,
      public_id: `${userId}/${Date.now()}_${Math.round(Math.random() * 1e9)}`,
      resource_type: "auto",
    });

    const newFile = new File({
      name: originalFile.name,
      extension: originalFile.extension,
      parentDirId: destinationDirId,
      userId,
      cloudinaryPublicId: result.public_id,
      url: result.secure_url,
      resourceType: result.resource_type,   // ✅ store resource type
    });
    await newFile.save();

    res.status(201).json({ message: "File copied successfully" });
  } catch (err) {
    console.error("Copy error:", err);
    next(err);
  }
};

// ---------- Move File ----------
export const moveFile = async (req, res, next) => {
  const { itemId, destinationDirId } = req.body;
  const userId = req.user._id;
  try {
    const file = await File.findOne({ _id: itemId, userId });
    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }
    const destDir = await Directory.findOne({ _id: destinationDirId, userId });
    if (!destDir) {
      return res.status(404).json({ error: "Destination directory not found" });
    }
    file.parentDirId = destinationDirId;
    await file.save();
    res.json({ message: "File moved successfully" });
  } catch (err) {
    console.error(err);
    next(err);
  }
};