import { THREAT_TYPE_INTEL_MAP } from "./threatTypeMapping.js";
import { lookupTechnique } from "./mitreAttackService.js";
import { lookupCategory } from "./owaspService.js";
import { logger } from "../../utils/logger.js";

// Returns { mitre: {id,name,url} | null, owasp: {id,name,url} | null }.
// Never throws — enrichment failing (e.g. MITRE service's first-ever
// fetch hitting a network hiccup) should never block a threat from
// being saved; the threat itself is already valid without this context.
export async function enrichThreatType(type) {
  const mapping = THREAT_TYPE_INTEL_MAP[type];
  if (!mapping) return { mitre: null, owasp: null };

  let mitre = null;
  try {
    const technique = await lookupTechnique(mapping.mitreId);
    if (technique) {
      mitre = { id: technique.id, name: technique.name, url: technique.url };
    }
  } catch (err) {
    logger.warn(`MITRE enrichment failed for ${type}:`, err.message);
  }

  const owaspCategory = lookupCategory(mapping.owaspId); // static, can't fail
  const owasp = owaspCategory
    ? { id: owaspCategory.id, name: owaspCategory.name, url: owaspCategory.url }
    : null;

  return { mitre, owasp };
}
