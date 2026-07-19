import mongoose from "mongoose";

const threatSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    logId: { type: mongoose.Schema.Types.ObjectId, ref: "UploadedLog", required: true, index: true },
    type: {
      type: String,
      enum: ["brute_force", "sql_injection", "xss", "directory_traversal", "command_injection", "other"],
      required: true,
    },
    severity: { type: String, enum: ["low", "medium", "high", "critical"], required: true },
    sourceIp: { type: String, default: null },
    evidence: { type: [String], default: [] },
    explanation: { type: String, default: null },
  },
  { timestamps: true }
);

threatSchema.index({ logId: 1, severity: 1 });

export const Threat = mongoose.model("Threat", threatSchema);