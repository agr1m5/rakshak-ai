/**
 * Centralized express error handling middleware.
 */
import { config } from '../config/env.js';

export function errorHandler(err, req, res, next) {
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : (err.status || 500);

  console.error(`[API Error] ${req.method} ${req.originalUrl}:`, err.message);
  if (config.env === 'development' && err.stack) {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
    ...(config.env === 'development' && { stack: err.stack }),
  });
}
