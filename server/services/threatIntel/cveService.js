import { env } from "../../config/env.js";
import { ApiError } from "../../utils/ApiError.js";

const NVD_BASE_URL = "https://services.nvd.nist.gov/rest/json/cves/2.0";
const FETCH_TIMEOUT_MS = 15_000;
const CVE_ID_PATTERN = /^CVE-\d{4}-\d{4,}$/i;

function summarize(cveItem) {
  const cve = cveItem.cve;
  const description =
    cve.descriptions?.find((d) => d.lang === "en")?.value || "No description available.";
  const metrics = cve.metrics || {};
  const cvssData =
    metrics.cvssMetricV31?.[0]?.cvssData ||
    metrics.cvssMetricV30?.[0]?.cvssData ||
    metrics.cvssMetricV2?.[0]?.cvssData ||
    null;

  return {
    id: cve.id,
    description,
    severity: cvssData?.baseSeverity || null,
    cvssScore: cvssData?.baseScore ?? null,
    published: cve.published,
    lastModified: cve.lastModified,
    url: `https://nvd.nist.gov/vuln/detail/${cve.id}`,
  };
}

export async function lookupCve(cveId) {
  if (!CVE_ID_PATTERN.test(cveId)) {
    throw ApiError.badRequest(`Invalid CVE ID format: "${cveId}" (expected e.g. CVE-2024-12345)`);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const headers = env.nvdApiKey ? { apiKey: env.nvdApiKey } : {};
    const res = await fetch(`${NVD_BASE_URL}?cveId=${encodeURIComponent(cveId.toUpperCase())}`, {
      headers,
      signal: controller.signal,
    });

    if (res.status === 404) return null;
    if (!res.ok) {
      throw new ApiError(502, `NVD request failed (${res.status})`);
    }

    const data = await res.json();
    if (!data.vulnerabilities || data.vulnerabilities.length === 0) return null;

    return summarize(data.vulnerabilities[0]);
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(502, `Could not reach the NVD CVE API: ${err.message}`);
  } finally {
    clearTimeout(timeout);
  }
}
