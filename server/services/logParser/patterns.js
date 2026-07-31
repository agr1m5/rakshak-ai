// IPv4 — deliberately loose (doesn't validate 0-255 ranges) since log
// data is the input, not user-facing validation; good enough to extract
// candidates from free-form text.
export const IP_REGEX = /\b(?:\d{1,3}\.){3}\d{1,3}\b/g;

// Apache/Nginx "combined" access log format:
// IP - - [date] "METHOD path HTTP/1.1" status size
export const COMBINED_LOG_REGEX =
  /^(\S+)\s+\S+\s+\S+\s+\[([^\]]+)\]\s+"([A-Z]+)\s+(\S+)\s+[^"]*"\s+(\d{3})\s+(\S+)/;

export const FAILED_LOGIN_KEYWORDS =
  /failed login|authentication failed|invalid password|login failure|unauthorized|auth failure/i;

// Lightweight, descriptive tags only — not a severity/attack classification.
// Step 11 turns a subset of these into real Threat documents.
export const SUSPICIOUS_PATTERNS = [
  { pattern: /\bunion\b.*\bselect\b|\bor\b\s*'?\d+'?\s*=\s*'?\d+|;--|\bdrop\s+table\b/i, tag: "sql-like" },
  { pattern: /<script|onerror=|javascript:/i, tag: "xss-like" },
  { pattern: /\.\.\/|\.\.\\|%2e%2e%2f/i, tag: "path-traversal-like" },
  {
    pattern: /(?=.*[;|&])(?=.*\b(?:cat|ls|wget|curl|nc|bash|sh|rm|chmod|whoami|id)\b)/i,
    tag: "command-injection-like",
  },
];
