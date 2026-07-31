import { Router } from "express";
import healthRoutes from "./healthRoutes.js";
import authRoutes from "./authRoutes.js";
import dashboardRoutes from "./dashboardRoutes.js";
import chatRoutes from "./chatRoutes.js";
import logRoutes from "./logRoutes.js";
import threatRoutes from "./threatRoutes.js";

const router = Router();

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/chat", chatRoutes);
router.use("/logs", logRoutes);
router.use("/threats", threatRoutes);

// Future steps register here, e.g.:
// router.use("/reports", reportRoutes);  // Step 13

export default router;
