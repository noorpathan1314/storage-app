import express from "express";
import validateIdMiddleware from "../middlewares/validateIdMiddleware.js";
import checkAuth from "../middlewares/authMiddleware.js";
import {
  createDirectory,
  deleteDirectory,
  getDirectory,
  renameDirectory,
  getAncestors,
  copyDirectory,
  moveDirectory,
  getAllDirectories,
  restoreDirectory,               // 👈 new
  permanentDeleteDirectory,       // 👈 new
  getTrashedDirectories,          // 👈 new
} from "../controllers/directoryController.js";

const router = express.Router();

router.param("parentDirId", validateIdMiddleware);
router.param("id", validateIdMiddleware);

// Breadcrumb route
router.get("/breadcrumb/:dirId?", checkAuth, async (req, res) => {
  const { dirId } = req.params;
  const userId = req.user._id;
  try {
    const ancestors = await getAncestors(dirId, userId);
    res.json(ancestors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get breadcrumb" });
  }
});

// Routes for copy/move and all directories
router.get("/all", checkAuth, getAllDirectories);
router.post("/copy", checkAuth, copyDirectory);
router.post("/move", checkAuth, moveDirectory);

// 👇 Trash / Restore / Permanent delete routes
router.get("/trash", checkAuth, getTrashedDirectories);           // get all trashed directories (top‑level)
router.patch("/restore/:id", checkAuth, restoreDirectory);        // restore a directory (and its children)
router.delete("/permanent/:id", checkAuth, permanentDeleteDirectory); // permanently delete a trashed directory

// Existing routes
router.get("/:id?", getDirectory);
router.post("/:parentDirId?", createDirectory);
router.patch("/:id", renameDirectory);
router.delete("/:id", deleteDirectory);   // now does soft delete (move to trash)

export default router;