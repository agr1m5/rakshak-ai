// Static, hand-curated mapping — these associations don't change often
// enough to warrant a live lookup. Chosen for reasonable real-world
// accuracy, not exhaustiveness (each attack type can span multiple
// techniques; this is "the one most representative reference," not
// a complete taxonomy).
export const THREAT_TYPE_INTEL_MAP = {
  sql_injection: { mitreId: "T1190", owaspId: "A03" },
  command_injection: { mitreId: "T1059", owaspId: "A03" },
  xss: { mitreId: "T1059.007", owaspId: "A03" },
  directory_traversal: { mitreId: "T1083", owaspId: "A01" },
  brute_force: { mitreId: "T1110", owaspId: "A07" },
  // anomalous_pattern has no fixed mapping — it's not a named attack type,
  // just a structural rarity signal (see threatDetectionService.js).
};
