import { isProduction } from "../config/env.js";
import { logger } from "../utils/logger.js";

// Must be registered LAST, after all routes — Express recognizes it as
// an error handler by its 4-argument signature (err, req, res, next).
export function errorHandler(err, req, res, _next) {
  const statusCode = err.statusCode && err.statusCode >= 400 ? err.statusCode : 500;
  const message = err.message || "Internal server error";

  if (statusCode >= 500) {
    logger.error(`${req.method} ${req.originalUrl} ->`, err);
  } else {
    logger.warn(`${req.method} ${req.originalUrl} -> ${statusCode} ${message}`);
  }

  res.status(statusCode).json({
    success: false,
    message,
    details: err.details,
    // Never leak stack traces once deployed.
    stack: isProduction ? undefined : err.stack,
  });
}
