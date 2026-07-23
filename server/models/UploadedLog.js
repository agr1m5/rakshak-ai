import mongoose from "mongoose";

const uploadedLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    // Path on disk under server/uploads/ (or object storage key, later).
    storagePath: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      enum: ["txt", "log", "json", "csv"],
      required: true,
    },
    sizeBytes: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "parsed", "failed"],
      default: "pending",
    },
    // Populated by the log parser service (Step 10): extracted IPs,
    // URLs, status codes, failed logins, etc. Shape intentionally
    // flexible (Mixed) since it evolves as parsers are added.
    parsedSummary: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    errorMessage: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export const UploadedLog = mongoose.model("UploadedLog", uploadedLogSchema);
