import { env } from "../../config/env.js";
import { ApiError } from "../../utils/ApiError.js";

export async function generateOllamaReply(messages) {
  let response;
  try {
    response = await fetch(`${env.ollamaBaseUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: env.ollamaModel,
        messages,
        stream: false,
      }),
    });
  } catch (err) {
    // Ollama not running, wrong port, etc. — surface a clear message
    // instead of a raw ECONNREFUSED bubbling up to the client.
    throw new ApiError(
      502,
      `Could not reach Ollama at ${env.ollamaBaseUrl}. Is "ollama serve" running?`
    );
  }

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new ApiError(502, `Ollama request failed (${response.status}): ${text}`);
  }

  const data = await response.json();
  return data?.message?.content ?? "";
}
