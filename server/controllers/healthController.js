import mongoose from "mongoose";
import { env } from "../config/env.js";

const READY_STATES = ["disconnected", "connected", "connecting", "disconnecting"];

// Controllers stay thin: parse the request, call a service if there's
// business logic, shape the response. Health check has no business logic,
// so it lives entirely here.
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
