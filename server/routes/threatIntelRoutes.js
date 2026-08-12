import { Router } from "express";
import {
  virusTotalIpLookup,
  virusTotalHashLookup,
  cveLookup,
  mitreLookup,
  owaspLookup,
  owaspList,
} from "../controllers/threatIntelController.js";
import { protect } from "../middleware/auth.js";
import { threatIntelLimiter } from "../middleware/rateLimiters.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.use(protect);
router.use(threatIntelLimiter);

router.get("/virustotal/ip/:ip", asyncHandler(virusTotalIpLookup));
router.get("/virustotal/hash/:hash", asyncHandler(virusTotalHashLookup));
router.get("/cve/:cveId", asyncHandler(cveLookup));
router.get("/mitre/:techniqueId", asyncHandler(mitreLookup));
router.get("/owasp", asyncHandler(owaspList));
router.get("/owasp/:categoryId", asyncHandler(owaspLookup));

export default router;
