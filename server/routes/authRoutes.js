import { Router } from "express";
import { signup, login, me } from "../controllers/authController.js";
import { signupValidators, loginValidators } from "../middleware/validators/authValidators.js";
import { validate } from "../middleware/validate.js";
import { protect } from "../middleware/auth.js";
import { authLimiter } from "../middleware/rateLimiters.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.post("/signup", authLimiter, signupValidators, validate, asyncHandler(signup));
router.post("/login", authLimiter, loginValidators, validate, asyncHandler(login));
router.get("/me", protect, asyncHandler(me));

export default router;
