import { env } from "../../config/env.js";
import { RAKSHAK_SYSTEM_PROMPT } from "./systemPrompt.js";
import { generateOllamaReply } from "./ollamaService.js";
import { generateOpenAIReply } from "./openaiService.js";

// The one dispatch point every AI feature routes through — chat replies
// (Step 8) and threat explanations (Step 11) both call this, each with
// their own system prompt. Swapping providers is a single env var
// (AI_PROVIDER=ollama|openai); nothing above this file needs to change.
async function dispatch(chatMessages) {
  switch (env.aiProvider) {
    case "openai":
      return generateOpenAIReply(chatMessages);
    case "ollama":
      return generateOllamaReply(chatMessages);
    default:
      throw new Error(
        `Unknown AI_PROVIDER "${env.aiProvider}" — expected "ollama" or "openai".`
      );
  }
}

export async function generateAIReply(messages) {
  const chatMessages = [
    { role: "system", content: RAKSHAK_SYSTEM_PROMPT },
    ...messages.map((m) => ({ role: m.role, content: m.content })),
  ];
  return dispatch(chatMessages);
}

const THREAT_EXPLANATION_SYSTEM_PROMPT = `You are Rakshak, an AI cybersecurity assistant. You will be given details of a detected threat found in a log file: its type, severity, source IP, and raw evidence lines.

Special case: if the threat type is "anomalous_pattern", this was NOT matched against a known attack signature — it was flagged because these log lines are structurally rare compared to the rest of the file (via template clustering, e.g. Drain3). Do not claim it's a specific named attack. Instead, describe what makes the lines structurally unusual and why that's worth a human review, and note it could be benign (a rare-but-legitimate event) or an early sign of something not covered by the standard attack patterns.

For all other types, write a concise explanation (3-5 sentences) covering:
1. What this attack type is and how the evidence indicates it occurred here.
2. Why it matters at this severity level.
3. One or two concrete, actionable mitigation steps.

Be direct and specific to the evidence given — do not pad with generic disclaimers.`;

export async function generateThreatExplanation({ type, severity, sourceIp, evidence }) {
  const userPrompt = [
    `Threat type: ${type}`,
    `Severity: ${severity}`,
    sourceIp ? `Source IP: ${sourceIp}` : null,
    `Evidence (raw log lines):`,
    ...evidence.map((line) => `- ${line}`),
  ]
    .filter(Boolean)
    .join("\n");

  return dispatch([
    { role: "system", content: THREAT_EXPLANATION_SYSTEM_PROMPT },
    { role: "user", content: userPrompt },
  ]);
}

const EXECUTIVE_SUMMARY_SYSTEM_PROMPT = `You are Rakshak, an AI cybersecurity assistant writing the executive summary section of an incident report for a non-technical stakeholder (e.g. a manager or client).

You will be given a list of threats detected in one log file: their types, severities, and source IPs.

Write 3-5 sentences that:
1. State plainly what was found and how serious it is overall.
2. Mention the most significant threat(s) by type and severity.
3. Give one clear top-line recommendation or next step.

Avoid jargon where possible, avoid bullet points (this is prose), and do not repeat raw log lines or evidence — that level of detail belongs elsewhere in the report.`;

export async function generateExecutiveSummary({ threats, logName }) {
  if (threats.length === 0) {
    // No AI call needed — this is a deterministic, always-correct case.
    return `No threats were detected in ${logName}. The log was analyzed for common indicators (brute force, SQL injection, XSS, directory traversal, command injection, and structurally anomalous patterns) and none were found above the detection threshold.`;
  }

  const threatSummaryLines = threats.map(
    (t) => `- ${t.type} (severity: ${t.severity})${t.sourceIp ? ` from ${t.sourceIp}` : ""}`
  );

  const userPrompt = [
    `Log file: ${logName}`,
    `${threats.length} threat(s) detected:`,
    ...threatSummaryLines,
  ].join("\n");

  return dispatch([
    { role: "system", content: EXECUTIVE_SUMMARY_SYSTEM_PROMPT },
    { role: "user", content: userPrompt },
  ]);
}
