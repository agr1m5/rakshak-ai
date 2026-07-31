import { Router } from "express";
import { uploadLog, listLogs, getLog, deleteLog, reparseLog, detectThreats } from "../controllers/logController.js";
import { protect } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.use(protect);

router.get("/", asyncHandler(listLogs));
router.post("/", upload.single("file"), asyncHandler(uploadLog));
router.get("/:id", asyncHandler(getLog));
router.delete("/:id", asyncHandler(deleteLog));
router.post("/:id/parse", asyncHandler(reparseLog));
router.post("/:id/detect-threats", asyncHandler(detectThreats));

export default router;
