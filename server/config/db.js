import mongoose from "mongoose";
import { env } from "./env.js";
import { logger } from "../utils/logger.js";

export async function connectDB() {
  if (!env.mongoUri) {
    throw new Error(
      "MONGO_URI is not set. Copy .env.example to .env and add your Atlas connection string."
    );
  }

  mongoose.set("strictQuery", true);

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