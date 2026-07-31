import { FAILED_LOGIN_KEYWORDS, SUSPICIOUS_PATTERNS } from "./patterns.js";

const TOP_N = 20;
const SAMPLE_LIMIT = 10;

function topEntries(counts, limit) {
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([value, count]) => ({ value, count }));
}

export function aggregateEntries(entries) {
  const ipCounts = {};
  const urlCounts = {};
  const statusCounts = {};
  const failedLoginSamples = [];
  const failedLoginsByIp = {};
  const suspiciousSamples = [];

  for (const entry of entries) {
    if (entry.ip) ipCounts[entry.ip] = (ipCounts[entry.ip] || 0) + 1;
    if (entry.path) urlCounts[entry.path] = (urlCounts[entry.path] || 0) + 1;
    if (entry.status) statusCounts[entry.status] = (statusCounts[entry.status] || 0) + 1;

    const searchable = [entry.raw, entry.message].filter(Boolean).join(" ");

    const looksLikeFailedLogin =
      entry.status === "401" ||
      entry.status === "403" ||
      FAILED_LOGIN_KEYWORDS.test(searchable);

    if (looksLikeFailedLogin) {
      if (entry.ip) failedLoginsByIp[entry.ip] = (failedLoginsByIp[entry.ip] || 0) + 1;
      if (failedLoginSamples.length < SAMPLE_LIMIT) {
        failedLoginSamples.push({ ip: entry.ip, raw: entry.raw.slice(0, 300) });
      }
    }

    for (const { pattern, tag } of SUSPICIOUS_PATTERNS) {
      if (pattern.test(searchable) && suspiciousSamples.length < TOP_N) {
        suspiciousSamples.push({ tag, ip: entry.ip, raw: entry.raw.slice(0, 300) });
        break; // one tag per line is enough for a Step 10 flag
      }
    }
  }

  const failedLoginTotal = entries.filter((e) => {
    const searchable = [e.raw, e.message].filter(Boolean).join(" ");
    return e.status === "401" || e.status === "403" || FAILED_LOGIN_KEYWORDS.test(searchable);
  }).length;

  return {
    totalEntries: entries.length,
    ipAddresses: topEntries(ipCounts, TOP_N),
    urls: topEntries(urlCounts, TOP_N),
    statusCodes: statusCounts,
    failedLogins: { count: failedLoginTotal, samples: failedLoginSamples, byIp: failedLoginsByIp },
    suspiciousRequests: suspiciousSamples,
    parsedAt: new Date().toISOString(),
  };
}
