// OWASP Top 10:2021 — https://owasp.org/Top10/
// Static by design: this list changes roughly every 3-4 years (2017, 2021),
// not something worth a live API call for. If OWASP publishes a 2025 list,
// this is the one place to update.
const OWASP_TOP_10_2021 = {
  A01: {
    id: "A01",
    name: "Broken Access Control",
    summary:
      "Restrictions on what authenticated users are allowed to do are not properly enforced, letting attackers act outside their intended permissions.",
    url: "https://owasp.org/Top10/A01_2021-Broken_Access_Control/",
  },
  A02: {
    id: "A02",
    name: "Cryptographic Failures",
    summary:
      "Sensitive data is exposed due to weak, missing, or misconfigured cryptography — often the root cause behind data breaches involving credentials or financial data.",
    url: "https://owasp.org/Top10/A02_2021-Cryptographic_Failures/",
  },
  A03: {
    id: "A03",
    name: "Injection",
    summary:
      "Untrusted data is sent to an interpreter as part of a command or query, letting an attacker alter its execution — SQL, NoSQL, OS command, and LDAP injection all fall here.",
    url: "https://owasp.org/Top10/A03_2021-Injection/",
  },
  A04: {
    id: "A04",
    name: "Insecure Design",
    summary:
      "Missing or ineffective security controls at the design stage, distinct from implementation bugs — a flaw in the architecture itself, not the code.",
    url: "https://owasp.org/Top10/A04_2021-Insecure_Design/",
  },
  A05: {
    id: "A05",
    name: "Security Misconfiguration",
    summary:
      "Insecure default configurations, incomplete setups, open cloud storage, verbose error messages, or unpatched frameworks/software.",
    url: "https://owasp.org/Top10/A05_2021-Security_Misconfiguration/",
  },
  A06: {
    id: "A06",
    name: "Vulnerable and Outdated Components",
    summary:
      "Using libraries, frameworks, or other software modules with known vulnerabilities, or without knowing their versions at all.",
    url: "https://owasp.org/Top10/A06_2021-Vulnerable_and_Outdated_Components/",
  },
  A07: {
    id: "A07",
    name: "Identification and Authentication Failures",
    summary:
      "Weaknesses in confirming a user's identity, authentication, or session management — credential stuffing, weak passwords, and session fixation fall here.",
    url: "https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/",
  },
  A08: {
    id: "A08",
    name: "Software and Data Integrity Failures",
    summary:
      "Code and infrastructure that don't protect against integrity violations — insecure CI/CD pipelines, auto-update mechanisms without signature verification, insecure deserialization.",
    url: "https://owasp.org/Top10/A08_2021-Software_and_Data_Integrity_Failures/",
  },
  A09: {
    id: "A09",
    name: "Security Logging and Monitoring Failures",
    summary:
      "Insufficient logging, detection, monitoring, and incident response — breaches often go undetected for long periods without this.",
    url: "https://owasp.org/Top10/A09_2021-Security_Logging_and_Monitoring_Failures/",
  },
  A10: {
    id: "A10",
    name: "Server-Side Request Forgery (SSRF)",
    summary:
      "A web application fetches a remote resource without validating the user-supplied URL, letting an attacker coerce the server into requesting unintended destinations.",
    url: "https://owasp.org/Top10/A10_2021-Server-Side_Request_Forgery_%28SSRF%29/",
  },
};

export function lookupCategory(categoryId) {
  return OWASP_TOP_10_2021[categoryId.toUpperCase()] || null;
}

export function listCategories() {
  return Object.values(OWASP_TOP_10_2021);
}
