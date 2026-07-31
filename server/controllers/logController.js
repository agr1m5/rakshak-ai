import {
  createLogRecord,
  listLogsForUser,
  getLogForUser,
  deleteLogForUser,
  reparseLogForUser,
} from "../services/logService.js";
import { detectThreatsForLog } from "../services/threatDetectionService.js";
import { ApiError } from "../utils/ApiError.js";

export async function uploadLog(req, res) {
  // Multer populates req.file only if a file was actually attached under
  // the expected field name ("file") — missing entirely is a 400, not
  // a silent no-op.
  if (!req.file) {
    throw ApiError.badRequest('No file attached. Expected a "file" field.');
  }

  const log = await createLogRecord(req.user._id, req.file);
  res.status(201).json({ success: true, data: { log } });
}

export async function listLogs(req, res) {
  const logs = await listLogsForUser(req.user._id);
  res.json({ success: true, data: { logs } });
}

export async function getLog(req, res) {
  const log = await getLogForUser(req.user._id, req.params.id);
  res.json({ success: true, data: { log } });
}

export async function deleteLog(req, res) {
  await deleteLogForUser(req.user._id, req.params.id);
  res.status(204).send();
}

export async function reparseLog(req, res) {
  const log = await reparseLogForUser(req.user._id, req.params.id);
  res.json({ success: true, data: { log } });
}

export async function detectThreats(req, res) {
  const log = await getLogForUser(req.user._id, req.params.id);
  const threats = await detectThreatsForLog(req.user._id, log);
  res.json({ success: true, data: { threats } });
}
