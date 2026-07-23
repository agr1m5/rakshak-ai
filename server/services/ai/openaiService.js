import { env } from "../../config/env.js";
import { ApiError } from "../../utils/ApiError.js";

export async function generateOpenAIReply(messages) {
  if (!env.openaiApiKey) {
    throw new ApiError(
      500,
      "OPENAI_API_KEY is not set. Add it to .env or switch AI_PROVIDER back to \"ollama\"."
    );
  }

  let response;
  try {
    response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.openaiApiKey}`,
      },
      body: JSON.stringify({
        model: env.openaiModel,
        messages,
      }),
    });
  } catch (err) {
    throw new ApiError(502, "Could not reach the OpenAI API.");
  }

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new ApiError(502, `OpenAI request failed (${response.status}): ${text}`);
  }

  const data = await response.json();
  return data?.choices?.[0]?.message?.content ?? "";
}
