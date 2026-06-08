import express from "express";
import checkAuth from "../middlewares/authMiddleware.js";
import {
  getCurrentUser,
  login,
  logout,
  logoutAll,
  register,
  changePassword,
  updateName,
  sendChangeEmailOtp,
  verifyChangeEmail,
  uploadAvatar  
} from "../controllers/userController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/", checkAuth, getCurrentUser);
router.post("/logout", logout);
router.post("/logout-all", logoutAll);
router.post("/change-email-request", checkAuth, sendChangeEmailOtp);
router.post("/change-email-verify", checkAuth, verifyChangeEmail);
// Add this route (protected)
router.post("/avatar", checkAuth, uploadAvatar);
// 👇 Add change password route (protected)
router.post("/change-password", checkAuth, changePassword);
// Add this route (after authentication middleware)
router.patch("/update-name", checkAuth, updateName);

export default router;