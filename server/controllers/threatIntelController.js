import { lookupIp, lookupFileHash } from "../services/threatIntel/virusTotalService.js";
import { lookupCve } from "../services/threatIntel/cveService.js";
import { lookupTechnique } from "../services/threatIntel/mitreAttackService.js";
import { lookupCategory, listCategories } from "../services/threatIntel/owaspService.js";
import { ApiError } from "../utils/ApiError.js";

export async function virusTotalIpLookup(req, res) {
  const result = await lookupIp(req.params.ip);
  if (!result) throw ApiError.notFound("No VirusTotal data found for this IP");
  res.json({ success: true, data: { result } });
}

export async function virusTotalHashLookup(req, res) {
  const result = await lookupFileHash(req.params.hash);
  if (!result) throw ApiError.notFound("No VirusTotal data found for this hash");
  res.json({ success: true, data: { result } });
}

export async function cveLookup(req, res) {
  const result = await lookupCve(req.params.cveId);
  if (!result) throw ApiError.notFound(`${req.params.cveId} not found in the NVD`);
  res.json({ success: true, data: { result } });
}

export async function mitreLookup(req, res) {
  const result = await lookupTechnique(req.params.techniqueId);
  if (!result) throw ApiError.notFound(`Unknown MITRE ATT&CK technique: ${req.params.techniqueId}`);
  res.json({ success: true, data: { result } });
}

export async function owaspLookup(req, res) {
  const result = lookupCategory(req.params.categoryId);
  if (!result) throw ApiError.notFound(`Unknown OWASP category: ${req.params.categoryId}`);
  res.json({ success: true, data: { result } });
}

export async function owaspList(req, res) {
  res.json({ success: true, data: { categories: listCategories() } });
}
