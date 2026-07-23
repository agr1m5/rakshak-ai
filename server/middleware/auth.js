import { verifyToken, getUserById } from "../services/authService.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Usage: router.get("/me", protect, asyncHandler(me))
export const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    throw ApiError.unauthorized("Missing or malformed Authorization header");
  }

  let payload;
  try {
    payload = verifyToken(token);
  } catch (err) {
    throw ApiError.unauthorized(
      err.name === "TokenExpiredError" ? "Session expired, please log in again" : "Invalid token"
    );
  }

  // Re-fetch the user rather than trusting the token payload alone —
  // covers the case where the account was deleted after the token was issued.
  req.user = await getUserById(payload.sub);
  next();
});
