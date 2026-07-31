import { Threat } from "../models/Threat.js";
import { ApiError } from "../utils/ApiError.js";
import { generateThreatExplanation } from "./ai/aiProvider.js";
import { logger } from "../utils/logger.js";

const TAG_TO_TYPE = {
  "sql-like": "sql_injection",
  "xss-like": "xss",
  "path-traversal-like": "directory_traversal",
  "command-injection-like": "command_injection",
};

// Baseline severity per attack type. Brute force is scored dynamically
// below, based on how many failures actually occurred.
const BASE_SEVERITY = {
  sql_injection: "high",
  command_injection: "critical",
  directory_traversal: "high",
  xss: "medium",
  anomalous_pattern: "low",
};

const BRUTE_FORCE_THRESHOLD = 5; // failed logins from one IP, within one log, to count as an incident
const BRUTE_FORCE_HIGH_THRESHOLD = 10;

function bruteForceSeverity(count) {
  return count >= BRUTE_FORCE_HIGH_THRESHOLD ? "high" : "medium";
}

// Groups Step 10's pattern-flagged samples by (type, sourceIp) so multiple
// flagged lines from the same IP for the same attack type become ONE
// Threat document with combined evidence — not N near-duplicate documents.
export function buildCandidates(parsedSummary) {
  const candidates = new Map();

  for (const { tag, ip, raw } of parsedSummary.suspiciousRequests || []) {
    const type = TAG_TO_TYPE[tag];
    if (!type) continue; // unrecognized tag — skip rather than guess a type
    const key = `${type}::${ip || "unknown"}`;
    if (!candidates.has(key)) {
      candidates.set(key, { type, severity: BASE_SEVERITY[type], sourceIp: ip || null, evidence: [] });
    }
    candidates.get(key).evidence.push(raw);
  }

  const failedLoginsByIp = parsedSummary.failedLogins?.byIp || {};
  for (const [ip, count] of Object.entries(failedLoginsByIp)) {
    if (count < BRUTE_FORCE_THRESHOLD) continue;
    const evidence = (parsedSummary.failedLogins.samples || [])
      .filter((s) => s.ip === ip)
      .map((s) => s.raw);
    candidates.set(`brute_force::${ip}`, {
      type: "brute_force",
      severity: bruteForceSeverity(count),
      sourceIp: ip,
      evidence: evidence.length > 0 ? evidence : [`${count} failed login attempts from ${ip}`],
    });
  }

  // Drain3-flagged rare/anomalous lines (structural outliers relative to
  // the rest of this log) — a supplementary signal on top of the regex
  // matches above, catching attack variants the hand-written patterns
  // don't recognize. Deliberately low base severity: rarity alone isn't
  // a confirmed attack, just something worth a human's attention.
  for (const rare of parsedSummary.templateAnomalies?.rareLines || []) {
    const key = `anomalous_pattern::${rare.ip || "unknown"}`;
    if (!candidates.has(key)) {
      candidates.set(key, {
        type: "anomalous_pattern",
        severity: BASE_SEVERITY.anomalous_pattern,
        sourceIp: rare.ip || null,
        evidence: [],
      });
    }
    candidates.get(key).evidence.push(rare.raw);
  }

  return [...candidates.values()];
}

export async function detectThreatsForLog(userId, log) {
  // Re-running detection (e.g. after a re-parse) replaces prior results
  // for this log rather than accumulating duplicates.
  await Threat.deleteMany({ logId: log._id, userId });

  if (!log.parsedSummary) return [];

  const candidates = buildCandidates(log.parsedSummary);
  const threats = [];

  for (const candidate of candidates) {
    let explanation = null;
    try {
      explanation = await generateThreatExplanation(candidate);
    } catch (err) {
      // AI explanation is a nice-to-have, not a blocker — the threat
      // itself (type, severity, evidence) is still valid and gets saved
      // even if the AI provider is unreachable.
      logger.warn(`AI explanation failed for a ${candidate.type} threat:`, err.message);
    }

    const threat = await Threat.create({
      userId,
      logId: log._id,
      type: candidate.type,
      severity: candidate.severity,
      sourceIp: candidate.sourceIp,
      evidence: candidate.evidence.slice(0, 10),
      explanation,
    });
    threats.push(threat);
  }

  return threats;
}

export async function listThreatsForUser(userId, { logId } = {}) {
  const query = { userId };
  if (logId) query.logId = logId;
  return Threat.find(query).sort({ createdAt: -1 });
}

export async function getThreatForUser(userId, threatId) {
  const threat = await Threat.findOne({ _id: threatId, userId });
  if (!threat) {
    throw ApiError.notFound("Threat not found");
  }
  return threat;
}
