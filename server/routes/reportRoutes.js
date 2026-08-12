import { Router } from "express";
import {
  createReport,
  listReports,
  getReport,
  deleteReport,
  downloadReport,
} from "../controllers/reportController.js";
import { protect } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.use(protect);

router.get("/", asyncHandler(listReports));
router.post("/", asyncHandler(createReport));
router.get("/:id", asyncHandler(getReport));
router.delete("/:id", asyncHandler(deleteReport));
router.get("/:id/download", asyncHandler(downloadReport));

export default router;
