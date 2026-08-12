import rateLimit from "express-rate-limit";

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 attempts per IP per window — generous for real users, tight for brute force
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many attempts, please try again later" },
});

// Threat intel (Step 12) — tighter than the baseline /api limiter, since
// these calls hit external free-tier APIs (VirusTotal, NVD) with their
// own rate limits that our backend shouldn't blow through.
export const threatIntelLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many threat intel lookups, please slow down" },
});
