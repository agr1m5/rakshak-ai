// Usage: router.get("/", asyncHandler(async (req, res) => { ... }))
// Any throw or rejected promise inside the handler is passed to next(),
// which routes it to the centralized error handler middleware.
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
