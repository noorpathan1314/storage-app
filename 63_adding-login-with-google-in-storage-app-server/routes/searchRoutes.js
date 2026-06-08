import express from "express";
import { searchItems } from "../controllers/searchController.js";
import checkAuth from "../middlewares/authMiddleware.js";   // ✅ correct path & export name

const router = express.Router();

router.get("/", checkAuth, searchItems);

export default router;