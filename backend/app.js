import 'dotenv/config';

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import directoryRoutes from "./routes/directoryRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import checkAuth from "./middlewares/authMiddleware.js";
import { connectDB } from "./config/db.js";
import contactRoutes from "./routes/contactRoutes.js";

console.log('GOOGLE_CLIENT_ID from env:', process.env.GOOGLE_CLIENT_ID);
console.log('CLOUDINARY_CLOUD_NAME from env:', process.env.CLOUDINARY_CLOUD_NAME);

const mySecretKey = "ProCodrr-storageApp-123$#";

await connectDB();

const app = express();
app.use(cookieParser(mySecretKey));
app.use(express.json());

// ✅ Dynamic CORS origin (from environment variable)
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
app.use(
  cors({
    origin: frontendUrl,
    credentials: true,
  })
);

// Static storage (for local development, optional)
app.use("/storage", express.static("storage"));

// Routes
app.use("/directory", checkAuth, directoryRoutes);
app.use("/file", checkAuth, fileRoutes);
app.use("/user", userRoutes);
app.use("/auth", authRoutes);
app.use("/api/search", checkAuth, searchRoutes);
app.use("/contact", contactRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.log(err);
  res.json(err);
});

// Dynamic port (from environment variable or fallback to 4000)
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server Started on port ${PORT}`);
});