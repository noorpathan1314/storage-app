import { Types } from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import Directory from "../models/directoryModel.js";
import File from "../models/fileModel.js";

// Cloudinary configuration (env variables should be already loaded)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const getDirectory = async (req, res) => {
  const user = req.user;
  const _id = req.params.id || user.rootDirId.toString();
  const directoryData = await Directory.findOne({ _id }).lean();
  if (!directoryData) {
    return res
      .status(404)
      .json({ error: "Directory not found or you do not have access to it!" });
  }

  const files = await File.find({ parentDirId: directoryData._id, isDeleted: false }).lean();
  const directories = await Directory.find({ parentDirId: _id, isDeleted: false }).lean();
  return res.status(200).json({
    ...directoryData,
    files: files.map((dir) => ({ ...dir, id: dir._id })),
    directories: directories.map((dir) => ({ ...dir, id: dir._id })),
  });
};

export const createDirectory = async (req, res, next) => {
  const user = req.user;
  const parentDirId = req.params.parentDirId || user.rootDirId.toString();
  const dirname = req.headers.dirname || "New Folder";

  try {
    const parentDir = await Directory.findOne({ _id: parentDirId });
    if (!parentDir) {
      return res.status(404).json({ message: "Parent Directory does not exist!" });
    }

    const newDir = await Directory.create({
      name: dirname,
      parentDirId,
      userId: user._id,
    });

    return res.status(201).json({ message: "Directory Created!", directory: newDir });
  } catch (err) {
    console.error("Create directory error:", err);
    if (err.name === "ValidationError" || err.code === 121) {
      return res.status(400).json({ error: "Invalid input, please enter valid details" });
    }
    next(err);
  }
};

export const renameDirectory = async (req, res, next) => {
  const user = req.user;
  const { id } = req.params;
  const { newDirName } = req.body;
  try {
    await Directory.findOneAndUpdate(
      { _id: id, userId: user._id },
      { name: newDirName }
    );
    res.status(200).json({ message: "Directory Renamed!" });
  } catch (err) {
    next(err);
  }
};

// ---------- Soft delete (move to trash) – recursively mark all children ----------
export const deleteDirectory = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;
  const now = new Date();

  try {
    async function softDeleteRecursive(dirId) {
      await File.updateMany(
        { parentDirId: dirId, userId },
        { isDeleted: true, deletedAt: now }
      );
      const subDirs = await Directory.find({ parentDirId: dirId, userId });
      for (const subDir of subDirs) {
        await softDeleteRecursive(subDir._id);
      }
      await Directory.updateOne(
        { _id: dirId, userId },
        { isDeleted: true, deletedAt: now }
      );
    }
    await softDeleteRecursive(id);
    res.status(200).json({ message: "Directory moved to trash" });
  } catch (err) {
    next(err);
  }
};

// ---------- Restore from trash (recursively) ----------
export const restoreDirectory = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;

  try {
    async function restoreRecursive(dirId) {
      await File.updateMany(
        { parentDirId: dirId, userId, isDeleted: true },
        { isDeleted: false, deletedAt: null }
      );
      const subDirs = await Directory.find({ parentDirId: dirId, userId, isDeleted: true });
      for (const subDir of subDirs) {
        await restoreRecursive(subDir._id);
      }
      await Directory.updateOne(
        { _id: dirId, userId, isDeleted: true },
        { isDeleted: false, deletedAt: null }
      );
    }
    await restoreRecursive(id);
    res.json({ message: "Directory restored from trash" });
  } catch (err) {
    next(err);
  }
};

// ---------- Permanently delete (remove from Cloudinary + database) – only for trashed items ----------
export const permanentDeleteDirectory = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;

  try {
    async function permanentDeleteRecursive(dirId) {
      // Delete all soft‑deleted files in this directory from Cloudinary and DB
      const files = await File.find({ parentDirId: dirId, userId, isDeleted: true }).lean();
      for (const file of files) {
        if (file.cloudinaryPublicId) {
          const resourceType = file.resourceType || "raw";
          await cloudinary.uploader.destroy(file.cloudinaryPublicId, { resource_type: resourceType }).catch(e => console.warn(e));
        }
        await File.deleteOne({ _id: file._id });
      }
      // Recursively delete subdirectories
      const subDirs = await Directory.find({ parentDirId: dirId, userId, isDeleted: true });
      for (const subDir of subDirs) {
        await permanentDeleteRecursive(subDir._id);
      }
      // Delete the directory itself
      await Directory.deleteOne({ _id: dirId, userId, isDeleted: true });
    }

    await permanentDeleteRecursive(id);
    res.json({ message: "Directory permanently deleted" });
  } catch (err) {
    next(err);
  }
};

// ---------- Get all trashed directories ----------
export const getTrashedDirectories = async (req, res, next) => {
  try {
    const directories = await Directory.find({
      userId: req.user._id,
      isDeleted: true,
    }).lean();
    res.json(directories);
  } catch (err) {
    next(err);
  }
};

// ---------- Helper: get ancestors for breadcrumb ----------
export const getAncestors = async (dirId, userId) => {
  const ancestors = [];
  let currentId = dirId;
  while (currentId) {
    const dir = await Directory.findOne({ _id: currentId, userId }).lean();
    if (!dir) break;
    const name = dir.parentDirId === null ? "My Drive" : dir.name;
    ancestors.unshift({ id: dir._id, name });
    currentId = dir.parentDirId;
  }
  if (ancestors.length === 0) {
    ancestors.push({ id: null, name: "My Drive" });
  } else if (ancestors[0].name.startsWith("root-")) {
    ancestors[0].name = "My Drive";
  }
  return ancestors;
};

// ---------- Get all directories (non‑deleted) ----------
export const getAllDirectories = async (req, res) => {
  try {
    const directories = await Directory.find({ userId: req.user._id, isDeleted: false }).lean();
    res.json(directories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch directories" });
  }
};

// ---------- Copy directory recursively (using Cloudinary re‑upload) ----------
async function copyDirectoryRecursive(sourceDirId, newParentId, userId) {
  const sourceDir = await Directory.findOne({ _id: sourceDirId, userId }).lean();
  if (!sourceDir) throw new Error("Source directory not found");

  const newDirId = new Types.ObjectId();
  const newDir = new Directory({
    _id: newDirId,
    name: sourceDir.name,
    parentDirId: newParentId,
    userId,
  });
  await newDir.save();

  // Copy files inside this directory
  const files = await File.find({ parentDirId: sourceDirId, userId, isDeleted: false }).lean();
  for (const file of files) {
    // Re‑upload from existing Cloudinary URL to create a new copy
    const result = await cloudinary.uploader.upload(file.url, {
      folder: `users/${userId}`,
      public_id: `${userId}/${Date.now()}_${Math.round(Math.random() * 1e9)}`,
      resource_type: "auto",
    });
    const newFile = new File({
      name: file.name,
      extension: file.extension,
      parentDirId: newDirId,
      userId,
      cloudinaryPublicId: result.public_id,
      url: result.secure_url,
      resourceType: result.resource_type,
    });
    await newFile.save();
  }

  // Recursively copy subdirectories
  const subDirs = await Directory.find({ parentDirId: sourceDirId, userId, isDeleted: false }).lean();
  for (const subDir of subDirs) {
    await copyDirectoryRecursive(subDir._id, newDirId, userId);
  }
  return newDirId;
}

export const copyDirectory = async (req, res, next) => {
  const { itemId, destinationDirId } = req.body;
  const userId = req.user._id;
  try {
    const sourceDir = await Directory.findOne({ _id: itemId, userId });
    if (!sourceDir) return res.status(404).json({ error: "Source directory not found" });
    const destDir = await Directory.findOne({ _id: destinationDirId, userId });
    if (!destDir) return res.status(404).json({ error: "Destination directory not found" });
    if (itemId === destinationDirId) return res.status(400).json({ error: "Cannot copy a directory into itself" });
    await copyDirectoryRecursive(itemId, destinationDirId, userId);
    res.status(201).json({ message: "Directory copied successfully" });
  } catch (err) {
    console.error("Copy directory error:", err);
    next(err);
  }
};

// ---------- Move directory (just update parentDirId) ----------
export const moveDirectory = async (req, res, next) => {
  const { itemId, destinationDirId } = req.body;
  const userId = req.user._id;
  try {
    const dir = await Directory.findOne({ _id: itemId, userId });
    if (!dir) return res.status(404).json({ error: "Directory not found" });
    const destDir = await Directory.findOne({ _id: destinationDirId, userId });
    if (!destDir) return res.status(404).json({ error: "Destination directory not found" });
    if (itemId === destinationDirId) return res.status(400).json({ error: "Cannot move a directory into itself" });
    dir.parentDirId = destinationDirId;
    await dir.save();
    res.json({ message: "Directory moved successfully" });
  } catch (err) {
    next(err);
  }
};