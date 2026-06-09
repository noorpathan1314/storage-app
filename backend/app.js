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

// ✅ CORS – allow multiple origins (main Vercel + any preview)
const allowedOrigins = [
  'https://storage-app-vert.vercel.app',   // tumhara main frontend domain
  /\.vercel\.app$/                         // sab Vercel preview domains (regex)
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.some(allowed => allowed === origin || (allowed instanceof RegExp && allowed.test(origin)))) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// Static storage (optional)
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

// Dynamic port
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server Started on port ${PORT}`);
});