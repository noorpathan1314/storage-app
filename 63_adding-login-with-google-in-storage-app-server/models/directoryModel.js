import { model, Schema } from "mongoose";

const directorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    parentDirId: {
      type: Schema.Types.ObjectId,
      default: null,
      ref: "Directory",
    },
    // 👇 New fields for soft delete (Trash)
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    strict: "throw",
  }
);

// Optional index for faster queries
directorySchema.index({ userId: 1, isDeleted: 1 });

const Directory = model("Directory", directorySchema);
export default Directory;