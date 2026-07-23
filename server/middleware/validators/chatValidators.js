import { body } from "express-validator";

export const sendMessageValidators = [
  body("content")
    .trim()
    .notEmpty()
    .withMessage("Message content is required")
    .isLength({ max: 8000 })
    .withMessage("Message is too long (max 8000 characters)"),
];
