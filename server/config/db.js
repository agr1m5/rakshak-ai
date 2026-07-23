import mongoose from "mongoose";
import { env } from "./env.js";
import { logger } from "../utils/logger.js";

// Fail fast: if Mongo isn't reachable, the server should refuse to
// start rather than accept requests it can't actually serve.
export async function connectDB() {
  if (!env.mongoUri) {
    throw new Error(
      "MONGO_URI is not set. Copy .env.example to .env and add your Atlas connection string."
    );
  }

  mongoose.set("strictQuery", true);

  // Mongoose 8 defaults are sane; these are the two worth being explicit
  // about so a slow/unreachable cluster fails within a bounded time
  // instead of hanging the boot process indefinitely.
  await mongoose.connect(env.mongoUri, {
    serverSelectionTimeoutMS: 8000,
  });

  const { host, name } = mongoose.connection;
  logger.info(`MongoDB connected -> host=${host} db=${name}`);

  mongoose.connection.on("error", (err) => {
    logger.error("MongoDB connection error:", err);
  });
  mongoose.connection.on("disconnected", () => {
    logger.warn("MongoDB disconnected");
  });
}

export async function disconnectDB() {
  await mongoose.disconnect();
}
