import fs from "fs/promises";
import path from "path";
import { UploadedLog } from "../models/UploadedLog.js";
import { Threat } from "../models/Threat.js";
import { ApiError } from "../utils/ApiError.js";
import { logger } from "../utils/logger.js";
import { parseLogFile } from "./logParser/index.js";
import { detectThreatsForLog } from "./threatDetectionService.js";

function extToFileType(ext) {
  return ext.replace(".", "").toLowerCase(); // ".txt" -> "txt"
}

// Runs the parser and updates status — shared by initial upload and manual
// re-parse, so both paths handle a parse failure identically (status
// flips to "failed" with a message, never leaves the request hanging).
async function parseAndUpdate(log) {
  try {
    const parsedSummary = await parseLogFile(log);
    log.status = "parsed";
    log.parsedSummary = parsedSummary;
    log.errorMessage = null;
  } catch (err) {
    logger.warn(`Log parsing failed for ${log._id}:`, err.message);
    log.status = "failed";
    log.errorMessage = err.message;
  }
  await log.save();

  // Threat detection (Step 11) runs right after a successful parse, but
  // failing here doesn't undo the parse — the log is still usable, it
  // just won't have threats until detection is retried.
  if (log.status === "parsed") {
    try {
      await detectThreatsForLog(log.userId, log);
    } catch (err) {
      logger.warn(`Threat detection failed for log ${log._id}:`, err.message);
    }
  }

  return log;
}

export async function createLogRecord(userId, file) {
  const ext = path.extname(file.originalname).toLowerCase();

  const log = await UploadedLog.create({
    userId,
    originalName: file.originalname,
    storagePath: file.path,
    fileType: extToFileType(ext),
    sizeBytes: file.size,
    status: "pending",
  });

  // Synchronous for now — fine at this file-size ceiling (MAX_UPLOAD_MB).
  // A background job queue would be the production evolution for large
  // files, but adds real infra (Redis/BullMQ) this project doesn't need yet.
  return parseAndUpdate(log);
}

export async function reparseLogForUser(userId, logId) {
  const log = await getLogForUser(userId, logId);
  return parseAndUpdate(log);
}

export async function listLogsForUser(userId) {
  return UploadedLog.find({ userId })
    .sort({ createdAt: -1 })
    .select("originalName fileType sizeBytes status createdAt");
}

export async function getLogForUser(userId, logId) {
  const log = await UploadedLog.findOne({ _id: logId, userId });
  if (!log) {
    throw ApiError.notFound("Log not found");
  }
  return log;
}

export async function deleteLogForUser(userId, logId) {
  const log = await UploadedLog.findOneAndDelete({ _id: logId, userId });
  if (!log) {
    throw ApiError.notFound("Log not found");
  }

  await Threat.deleteMany({ logId: log._id, userId });

  // Best-effort file cleanup — if the file's already gone for some reason,
  // don't fail the whole delete over it, just log it and move on.
  try {
    await fs.unlink(log.storagePath);
  } catch (err) {
    logger.warn(`Could not delete file on disk for log ${logId}:`, err.message);
  }
}
