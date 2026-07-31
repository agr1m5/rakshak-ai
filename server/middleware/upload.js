import multer from "multer";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";

const UPLOAD_ROOT = path.resolve("uploads");

// Only these are meaningful to the log parser (Step 10) — reject
// anything else before it ever touches disk.
const ALLOWED_EXTENSIONS = new Set([".txt", ".log", ".json", ".csv"]);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Per-user subfolder — keeps uploads isolated and makes bulk cleanup
    // for a deleted account a single rm -rf away, later.
    const userDir = path.join(UPLOAD_ROOT, req.user._id.toString());
    fs.mkdirSync(userDir, { recursive: true });
    cb(null, userDir);
  },
  filename: (req, file, cb) => {
    // Never trust the client's filename for the actual storage path —
    // generate a random name, keep the original name only as metadata.
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = `${Date.now()}-${crypto.randomUUID()}${ext}`;
    cb(null, uniqueName);
  },
});

function fileFilter(req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    return cb(
      ApiError.badRequest(
        `Unsupported file type "${ext || "unknown"}". Allowed: .txt, .log, .json, .csv`
      )
    );
  }
  cb(null, true);
}

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: env.maxUploadMb * 1024 * 1024,
  },
});

export { UPLOAD_ROOT, ALLOWED_EXTENSIONS };
