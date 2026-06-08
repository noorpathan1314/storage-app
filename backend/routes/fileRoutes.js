import express from "express";
import validateIdMiddleware from "../middlewares/validateIdMiddleware.js";
import {
  deleteFile,
  getFile,
  renameFile,
  uploadFile,
  copyFile,
  moveFile,
  restoreFile,               // 👈 new
  permanentDeleteFile,       // 👈 new
  getTrashedFiles,          // 👈 new
} from "../controllers/fileController.js";

const router = express.Router();

router.param("parentDirId", validateIdMiddleware);
router.param("id", validateIdMiddleware);

// Copy / move routes
router.post("/copy", copyFile);
router.post("/move", moveFile);

// 👇 Trash / Restore / Permanent delete routes
router.get("/trash", getTrashedFiles);                    // list all trashed files
router.patch("/restore/:id", restoreFile);                // restore a file from trash
router.delete("/permanent/:id", permanentDeleteFile);      // permanently delete a file

// Existing routes
router.post("/:parentDirId?", uploadFile);
router.get("/:id", getFile);
router.patch("/:id", renameFile);
router.delete("/:id", deleteFile);   // now does soft delete (move to trash)

export default router;