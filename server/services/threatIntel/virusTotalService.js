import { env } from "../../config/env.js";
import { ApiError } from "../../utils/ApiError.js";

const VT_BASE_URL = "https://www.virustotal.com/api/v3";
const FETCH_TIMEOUT_MS = 15_000;

function summarizeAnalysisStats(stats) {
  const malicious = stats?.malicious ?? 0;
  const suspicious = stats?.suspicious ?? 0;
  const total = Object.values(stats || {}).reduce((a, b) => a + b, 0);
  return { malicious, suspicious, total, stats };
}

async function vtRequest(path) {
  if (!env.virusTotalApiKey) {
    throw new ApiError(
      500,
      "VT_API_KEY is not set. Get a free key at virustotal.com and add it to .env to enable this lookup."
    );
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const res = await fetch(`${VT_BASE_URL}${path}`, {
      headers: { "x-apikey": env.virusTotalApiKey },
      signal: controller.signal,
    });

    if (res.status === 404) return null;
    if (!res.ok) {
      throw new ApiError(502, `VirusTotal request failed (${res.status})`);
    }
    return res.json();
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(502, `Could not reach VirusTotal: ${err.message}`);
  } finally {
    clearTimeout(timeout);
  }
}

export async function lookupIp(ip) {
  const data = await vtRequest(`/ip_addresses/${encodeURIComponent(ip)}`);
  if (!data) return null;

  const attrs = data.data.attributes;
  return {
    ip,
    ...summarizeAnalysisStats(attrs.last_analysis_stats),
    country: attrs.country || null,
    asOwner: attrs.as_owner || null,
    url: `https://www.virustotal.com/gui/ip-address/${ip}`,
  };
}

export async function lookupFileHash(hash) {
  const data = await vtRequest(`/files/${encodeURIComponent(hash)}`);
  if (!data) return null;

  const attrs = data.data.attributes;
  return {
    hash,
    ...summarizeAnalysisStats(attrs.last_analysis_stats),
    fileType: attrs.type_description || null,
    names: (attrs.names || []).slice(0, 5),
    url: `https://www.virustotal.com/gui/file/${hash}`,
  };
}
