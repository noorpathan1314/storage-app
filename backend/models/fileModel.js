import { model, Schema } from "mongoose";

const fileSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    extension: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    parentDirId: {
      type: Schema.Types.ObjectId,
      ref: "Directory",
    },
    // Soft delete fields
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    // Cloudinary specific fields
    cloudinaryPublicId: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    // 👇 Add resourceType field (image, video, raw, etc.)
    resourceType: {
      type: String,
      default: "raw",   // fallback for old files
    },
  },
  {
    strict: "throw",
  }
);

// Index for faster queries (filtering trashed files by user)
fileSchema.index({ userId: 1, isDeleted: 1 });

const File = model("File", fileSchema);
export default File;