import dotenv from "dotenv";

dotenv.config();

// Fail fast on boot if a required variable is missing, instead of
// discovering it later as an obscure runtime error (e.g. "undefined"
// Mongo URI three requests in). Kept short for Step 3 — grows as
// later steps add JWT secrets, AI provider keys, etc.
// PORT has a safe default and just warns if missing. JWT_SECRET is
// security-critical — booting with an empty secret would mean anyone
// could forge valid tokens, so that one throws and stops the server.
const softRequired = ["PORT"];
const hardRequired = ["JWT_SECRET"];

const missingSoft = softRequired.filter((key) => !process.env[key]);
if (missingSoft.length > 0) {
  // eslint-disable-next-line no-console
  console.warn(
    `[config] Missing env vars, falling back to defaults: ${missingSoft.join(", ")}`
  );
}

const missingHard = hardRequired.filter((key) => !process.env[key]);
if (missingHard.length > 0) {
  throw new Error(
    `[config] Missing required env vars: ${missingHard.join(", ")}. Copy .env.example to .env and set them.`
  );
}

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 5000,
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",

  // Placeholders wired up in later steps — declared now so every module
  // that will need them imports from this single source from day one.
  mongoUri: process.env.MONGO_URI || "",
  jwtSecret: process.env.JWT_SECRET || "",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  aiProvider: process.env.AI_PROVIDER || "ollama", // "ollama" | "openai"
  ollamaBaseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
  ollamaModel: process.env.OLLAMA_MODEL || "llama3.2",
  openaiApiKey: process.env.OPENAI_API_KEY || "",
  openaiModel: process.env.OPENAI_MODEL || "gpt-4o-mini",
};

export const isProduction = env.nodeEnv === "production";
