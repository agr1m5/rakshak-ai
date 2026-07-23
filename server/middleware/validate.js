import { validationResult } from "express-validator";
import { ApiError } from "../utils/ApiError.js";

// Usage: router.post("/signup", signupValidators, validate, asyncHandler(signup))
// `signupValidators` is an array of express-validator chains that only
// collect errors; this middleware is what actually stops the request.
export function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const details = errors.array().map((e) => ({ field: e.path, message: e.msg }));
    return next(ApiError.badRequest("Validation failed", details));
  }
  next();
}
