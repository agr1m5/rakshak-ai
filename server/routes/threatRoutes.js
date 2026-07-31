import { Router } from "express";
import { listThreats, getThreat } from "../controllers/threatController.js";
import { protect } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.use(protect);

router.get("/", asyncHandler(listThreats));
router.get("/:id", asyncHandler(getThreat));

export default router;
