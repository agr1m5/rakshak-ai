import fs from "fs/promises";
import path from "path";
import { logger } from "../../utils/logger.js";

const ATTACK_BUNDLE_URL =
  "https://raw.githubusercontent.com/mitre/cti/master/enterprise-attack/enterprise-attack.json";
const CACHE_PATH = path.resolve("cache", "mitre-technique-index.json");
const CACHE_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000; // 30 days — ATT&CK updates a few times a year
const FETCH_TIMEOUT_MS = 30_000;

let inMemoryIndex = null; // { [techniqueId]: { id, name, description, url } }

function extractTechniqueIndex(bundle) {
  const index = {};
  for (const obj of bundle.objects) {
    if (obj.type !== "attack-pattern" || obj.revoked || obj.x_mitre_deprecated) continue;

    const ref = (obj.external_references || []).find((r) => r.source_name === "mitre-attack");
    if (!ref?.external_id) continue;

    index[ref.external_id] = {
      id: ref.external_id,
      name: obj.name,
      // Truncate — we only need enough for a threat-detail summary, not the full doc.
      description: (obj.description || "").slice(0, 500),
      url: ref.url,
    };
  }
  return index;
}

async function loadFromDisk() {
  try {
    const stat = await fs.stat(CACHE_PATH);
    if (Date.now() - stat.mtimeMs > CACHE_MAX_AGE_MS) return null; // stale, refetch
    const raw = await fs.readFile(CACHE_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return null; // no cache yet, or unreadable — fetch fresh
  }
}

async function fetchAndBuildIndex() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const res = await fetch(ATTACK_BUNDLE_URL, { signal: controller.signal });
    if (!res.ok) throw new Error(`MITRE ATT&CK bundle fetch failed: ${res.status}`);

    const bundle = await res.json(); // ~46MB parsed — held only for the duration of this function
    const index = extractTechniqueIndex(bundle);

    await fs.mkdir(path.dirname(CACHE_PATH), { recursive: true });
    await fs.writeFile(CACHE_PATH, JSON.stringify(index));

    logger.info(`MITRE ATT&CK technique index built: ${Object.keys(index).length} techniques`);
    return index;
  } finally {
    clearTimeout(timeout);
  }
}

async function getIndex() {
  if (inMemoryIndex) return inMemoryIndex;

  const cached = await loadFromDisk();
  if (cached) {
    inMemoryIndex = cached;
    return inMemoryIndex;
  }

  inMemoryIndex = await fetchAndBuildIndex();
  return inMemoryIndex;
}

export async function lookupTechnique(techniqueId) {
  const index = await getIndex();
  return index[techniqueId.toUpperCase()] || null;
}
