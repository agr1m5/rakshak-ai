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
