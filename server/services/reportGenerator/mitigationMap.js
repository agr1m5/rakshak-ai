// Hand-curated, standard mitigations per attack type. Kept static and
// deterministic (unlike the AI-generated executive summary) so a report
// always has solid recommendations even if the AI provider is down —
// and because these don't really change often enough to need generation.
export const MITIGATION_MAP = {
  sql_injection: [
    "Use parameterized queries / prepared statements for all database access — never build SQL via string concatenation.",
    "Apply the principle of least privilege to database accounts used by the application.",
    "Add input validation and a web application firewall (WAF) rule set as a defense-in-depth layer.",
  ],
  command_injection: [
    "Avoid passing user input to shell commands; use language-native APIs instead of shell invocation where possible.",
    "If shell execution is unavoidable, use strict allow-lists and proper argument escaping (never string concatenation).",
    "Run the application process with the minimum OS privileges required.",
  ],
  xss: [
    "Encode all user-supplied output based on context (HTML, attribute, JS, URL).",
    "Adopt a strict Content-Security-Policy (CSP) header to limit script execution sources.",
    "Use a framework that auto-escapes output by default (React, etc.) and avoid raw HTML injection APIs.",
  ],
  directory_traversal: [
    "Validate and normalize file paths server-side; reject any path containing '..' segments.",
    "Serve user-accessible files from a dedicated directory with no access to the rest of the filesystem.",
    "Run the file-serving process with restricted filesystem permissions.",
  ],
  brute_force: [
    "Enforce account lockout or exponential backoff after repeated failed login attempts.",
    "Require multi-factor authentication (MFA), especially for privileged accounts.",
    "Rate-limit authentication endpoints by IP and by account.",
  ],
  anomalous_pattern: [
    "Manually review the flagged log lines — this was a structural-rarity signal, not a confirmed attack signature.",
    "If confirmed benign, consider whether it represents a legitimate but rare workflow worth documenting.",
    "If suspicious, cross-reference the source IP and timing against other activity in the same window.",
  ],
  other: [
    "Review the evidence manually and cross-reference against your organization's incident response playbook.",
  ],
};

export function getMitigations(threatType) {
  return MITIGATION_MAP[threatType] || MITIGATION_MAP.other;
}
