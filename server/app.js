import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import { env, isProduction } from "./config/env.js";
import routes from "./routes/index.js";
import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

// --- Security & parsing middleware -----------------------------------
app.use(helmet());
app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// Skip noisy request logs in test env; use dev-friendly format otherwise.
if (!isProduction) {
  app.use(morgan("dev"));
}

// Rate limit every /api/* route as a baseline. Auth routes get a
// stricter, dedicated limiter once Step 5 adds login/signup.
app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// --- Routes -------------------------------------------------------------
app.use("/api", routes);

// --- 404 + centralized error handling -----------------------------------
// Order matters: notFound must come after all real routes,
// errorHandler must come last of all.
app.use(notFound);
app.use(errorHandler);

export default app;
