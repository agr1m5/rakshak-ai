import path from "path";
import {
  generateReportForLog,
  listReportsForUser,
  getReportForUser,
  deleteReportForUser,
} from "../services/reportGenerator/index.js";
import { ApiError } from "../utils/ApiError.js";

export async function createReport(req, res) {
  const { logId } = req.body;
  if (!logId) {
    throw ApiError.badRequest("logId is required");
  }
  const report = await generateReportForLog(req.user._id, logId);
  res.status(201).json({ success: true, data: { report } });
}

export async function listReports(req, res) {
  const reports = await listReportsForUser(req.user._id);
  res.json({ success: true, data: { reports } });
}

export async function getReport(req, res) {
  const report = await getReportForUser(req.user._id, req.params.id);
  res.json({ success: true, data: { report } });
}

export async function deleteReport(req, res) {
  await deleteReportForUser(req.user._id, req.params.id);
  res.status(204).send();
}

export async function downloadReport(req, res) {
  const report = await getReportForUser(req.user._id, req.params.id);
  if (!report.pdfPath) {
    throw ApiError.notFound("PDF not available for this report");
  }
  const filename = `${report.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.pdf`;
  res.download(path.resolve(report.pdfPath), filename);
}
