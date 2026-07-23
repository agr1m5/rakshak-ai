import { Router } from "express";
import {
  listChats,
  createChat,
  getChat,
  deleteChat,
  sendMessage,
} from "../controllers/chatController.js";
import { sendMessageValidators } from "../middleware/validators/chatValidators.js";
import { validate } from "../middleware/validate.js";
import { protect } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.use(protect);

router.get("/", asyncHandler(listChats));
router.post("/", asyncHandler(createChat));
router.get("/:id", asyncHandler(getChat));
router.delete("/:id", asyncHandler(deleteChat));
router.post("/:id/messages", sendMessageValidators, validate, asyncHandler(sendMessage));

export default router;
