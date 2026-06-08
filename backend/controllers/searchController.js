import Directory from "../models/directoryModel.js";
import File from "../models/fileModel.js";

export const searchItems = async (req, res) => {
  try {
    const { q } = req.query;
    const userId = req.user._id;

    if (!q || q.trim() === "") {
      return res.status(400).json({ error: "Search query is required" });
    }

    const regex = new RegExp(q, "i");

    // Exclude root folder (parentDirId === null)
    let directories = await Directory.find({
      userId,
      name: { $regex: regex },
      parentDirId: { $ne: null },
    }).lean();

    let files = await File.find({
      userId,
      name: { $regex: regex },
    }).lean();

    // Add `id` field (same as `_id`) for frontend compatibility
    directories = directories.map(d => ({ ...d, id: d._id }));
    files = files.map(f => ({ ...f, id: f._id }));

    res.json({ directories, files });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "Server error while searching" });
  }
};