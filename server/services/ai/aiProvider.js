import { env } from "../../config/env.js";
import { RAKSHAK_SYSTEM_PROMPT } from "./systemPrompt.js";
import { generateOllamaReply } from "./ollamaService.js";
import { generateOpenAIReply } from "./openaiService.js";

// The seam from Step 1: chatService only ever calls this one function.
// Swapping providers is a single env var (AI_PROVIDER=ollama|openai) —
// nothing above this file needs to know or care which one is active.
export async function generateAIReply(messages) {
  const chatMessages = [
    { role: "system", content: RAKSHAK_SYSTEM_PROMPT },
    ...messages.map((m) => ({ role: m.role, content: m.content })),
  ];

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
