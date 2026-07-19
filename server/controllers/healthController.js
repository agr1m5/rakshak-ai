import mongoose from "mongoose";
import { env } from "../config/env.js";

const READY_STATES = ["disconnected", "connected", "connecting", "disconnecting"];

export function getHealth(req, res) {
  res.json({
    success: true,
    service: "rakshak-server",
    status: "ok",
    environment: env.nodeEnv,
    uptimeSeconds: Math.round(process.uptime()),
    database: READY_STATES[mongoose.connection.readyState] || "unknown",
    timestamp: new Date().toISOString(),
  });
}