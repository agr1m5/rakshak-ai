import { Router } from "express";
import healthRoutes from "./healthRoutes.js";

const router = Router();

router.use("/health", healthRoutes);

// Future steps register here, e.g.:
// router.use("/auth", authRoutes);       // Step 5
// router.use("/chat", chatRoutes);       // Step 7-8
// router.use("/logs", logRoutes);        // Step 9-11
// router.use("/reports", reportRoutes);  // Step 13

export default router;
