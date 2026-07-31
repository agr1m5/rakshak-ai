import { isProduction } from "../config/env.js";
import { logger } from "../utils/logger.js";

// Must be registered LAST, after all routes — Express recognizes it as
// an error handler by its 4-argument signature (err, req, res, next).
export function errorHandler(err, req, res, _next) {
  // Multer throws its own error class for things like exceeding the size
  // limit; it doesn't carry a statusCode, so translate it here rather
  // than letting it fall through to a generic 500.
  if (err.name === "MulterError") {
    err.statusCode = 400;
    if (err.code === "LIMIT_FILE_SIZE") {
      err.message = "File is too large";
    }
  }

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
