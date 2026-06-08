import nodemailer from "nodemailer";
import OTP from "../models/otpModel.js";

// Create transporter using Gmail SMTP (aapka purana wala code)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // 465 ke liye true
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASS,
  },
});

export async function sendOtpService(email) {
  // OTP generate karo (4-digit)
  const otp = Math.floor(1000 + Math.random() * 9000).toString();

  // Database mein save/update karo (same as teacher)
  await OTP.findOneAndUpdate(
    { email },
    { otp, createdAt: new Date() },
    { upsert: true }
  );

  // Email ka HTML content
  const html = `
    <div style="font-family:sans-serif;">
      <h2>Your OTP is: ${otp}</h2>
      <p>This OTP is valid for 10 minutes.</p>
    </div>
  `;

  // Email bhejo (aapka purana wala sendMail pattern)
  await transporter.sendMail({
    from: `"Storage App" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: "Storage App OTP",
    html,
  });

  return { success: true, message: `OTP sent successfully on ${email}` };
}