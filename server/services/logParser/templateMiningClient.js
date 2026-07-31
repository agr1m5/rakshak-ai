import { env } from "../../config/env.js";
import { logger } from "../../utils/logger.js";

const REQUEST_TIMEOUT_MS = 15_000;

// Returns { lineClusters, clusters, truncated } aligned index-for-index
// with the input lines, or null if the service is disabled, unreachable,
// or errors — callers must treat null as "no template data available"
// and continue without it, not as a failure.
export async function mineTemplates(lines) {
  if (!env.logTemplateServiceEnabled || lines.length === 0) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const res = await fetch(`${env.logTemplateServiceUrl}/mine`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lines }),
      signal: controller.signal,
    });

    if (!res.ok) {
      logger.warn(`Log template service returned ${res.status}`);
      return null;
    }
    return await res.json();
  } catch (err) {
    // Service not running, wrong port, timeout, etc. Template mining is
    // a supplementary signal on top of the regex extractors from Step 10
    // — the whole parse should never fail just because this is down.
    logger.warn("Log template service unreachable:", err.message);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

// A line is "rare" if its cluster is small relative to the log — these
// are lines that don't match the log's common structural patterns, which
// is a useful complement to regex matching: it catches attack variants
// the hand-written patterns don't know to look for, at the cost of also
// surfacing rare-but-benign lines (one-off errors, unusual but valid
// requests). Treat rareness as "worth a look", not a verdict.
const MIN_ENTRIES_FOR_ANOMALY_DETECTION = 20;
const RARITY_RATIO = 0.03; // clusters smaller than 3% of the log are "rare"
const RARITY_FLOOR = 2; // ...but never flag clusters of size > 2 just because the log is huge

export function findRareEntries(entries, miningResult) {
  if (!miningResult || entries.length < MIN_ENTRIES_FOR_ANOMALY_DETECTION) return [];

  const threshold = Math.max(RARITY_FLOOR, Math.floor(entries.length * RARITY_RATIO));
  const rareClusterIds = new Set(
    miningResult.clusters.filter((c) => c.size <= threshold).map((c) => c.clusterId)
  );

  const clusterById = Object.fromEntries(miningResult.clusters.map((c) => [c.clusterId, c]));

  return entries
    .map((entry, i) => ({ entry, clusterId: miningResult.lineClusters[i] }))
    .filter(({ clusterId }) => rareClusterIds.has(clusterId))
    .map(({ entry, clusterId }) => ({
      ip: entry.ip,
      raw: entry.raw.slice(0, 300),
      template: clusterById[clusterId]?.template,
      clusterSize: clusterById[clusterId]?.size,
    }));
}
