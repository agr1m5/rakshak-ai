import path from "path";
import fs from "fs/promises";
import { IncidentReport } from "../../models/IncidentReport.js";
import { UploadedLog } from "../../models/UploadedLog.js";
import { Threat } from "../../models/Threat.js";
import { ApiError } from "../../utils/ApiError.js";
import { logger } from "../../utils/logger.js";
import { generateExecutiveSummary } from "../ai/aiProvider.js";
import { getMitigations } from "./mitigationMap.js";
import { buildIncidentReportPdf } from "./pdfBuilder.js";

const REPORTS_ROOT = path.resolve("reports");

const SEVERITY_RANK = { low: 1, medium: 2, high: 3, critical: 4 };

function computeOverallSeverity(threats) {
  if (threats.length === 0) return "low";
  return threats.reduce(
    (worst, t) => (SEVERITY_RANK[t.severity] > SEVERITY_RANK[worst] ? t.severity : worst),
    "low"
  );
}

function buildMitigations(threats) {
  const seenTypes = new Set();
  const mitigations = [];
  for (const t of threats) {
    if (seenTypes.has(t.type)) continue;
    seenTypes.add(t.type);
    mitigations.push(...getMitigations(t.type));
  }
  return [...new Set(mitigations)]; // de-dupe exact-duplicate strings across types, just in case
}

function buildTimeline(log, threats) {
  const events = [{ label: `Log "${log.originalName}" uploaded`, timestamp: log.createdAt }];
  for (const t of threats) {
    events.push({
      label: `${t.severity.toUpperCase()} severity ${t.type.replace(/_/g, " ")} threat detected${t.sourceIp ? ` from ${t.sourceIp}` : ""}`,
      timestamp: t.createdAt,
    });
  }
  return events.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
}

export async function generateReportForLog(userId, logId) {
  const log = await UploadedLog.findOne({ _id: logId, userId });
  if (!log) {
    throw ApiError.notFound("Log not found");
  }
  if (log.status !== "parsed") {
    throw ApiError.badRequest(
      `Log must be parsed before generating a report (current status: "${log.status}")`
    );
  }

  const threats = await Threat.find({ logId, userId }).sort({ createdAt: 1 });
  const overallSeverity = computeOverallSeverity(threats);

  let executiveSummary;
  try {
    executiveSummary = await generateExecutiveSummary({ threats, logName: log.originalName });
  } catch (err) {
    // AI summary is valuable but not load-bearing — a templated fallback
    // keeps the report generation itself from failing over an AI hiccup.
    logger.warn("AI executive summary failed, using fallback:", err.message);
    executiveSummary =
      threats.length === 0
        ? `No threats were detected in ${log.originalName}.`
        : `${threats.length} threat(s) were detected in ${log.originalName}, with an overall severity of ${overallSeverity}. See the Detected Threats section below for details.`;
  }

  const report = await IncidentReport.create({
    userId,
    relatedLogId: log._id,
    title: `Incident Report — ${log.originalName}`,
    executiveSummary,
    threats: threats.map((t) => t._id),
    overallSeverity,
    recommendedMitigations: buildMitigations(threats),
    timeline: buildTimeline(log, threats),
  });

  await fs.mkdir(path.join(REPORTS_ROOT, userId.toString()), { recursive: true });
  const pdfPath = path.join(REPORTS_ROOT, userId.toString(), `${report._id}.pdf`);

  await buildIncidentReportPdf({ report, threats, log, outputPath: pdfPath });

  report.pdfPath = pdfPath;
  await report.save();

  return report;
}

export async function listReportsForUser(userId) {
  return IncidentReport.find({ userId })
    .sort({ createdAt: -1 })
    .select("title overallSeverity createdAt relatedLogId");
}

export async function getReportForUser(userId, reportId) {
  const report = await IncidentReport.findOne({ _id: reportId, userId }).populate("threats");
  if (!report) {
    throw ApiError.notFound("Report not found");
  }
  return report;
}

export async function deleteReportForUser(userId, reportId) {
  const report = await IncidentReport.findOneAndDelete({ _id: reportId, userId });
  if (!report) {
    throw ApiError.notFound("Report not found");
  }
  if (report.pdfPath) {
    try {
      await fs.unlink(report.pdfPath);
    } catch (err) {
      logger.warn(`Could not delete PDF for report ${reportId}:`, err.message);
    }
  }
}
