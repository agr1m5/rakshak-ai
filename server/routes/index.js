import { Router } from "express";
import healthRoutes from "./healthRoutes.js";
import authRoutes from "./authRoutes.js";
import dashboardRoutes from "./dashboardRoutes.js";
import chatRoutes from "./chatRoutes.js";

const router = Router();

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/chat", chatRoutes);

// Future steps register here, e.g.:
// router.use("/logs", logRoutes);        // Step 9-11
// router.use("/reports", reportRoutes);  // Step 13

export default router;
