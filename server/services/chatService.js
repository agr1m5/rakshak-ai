import { Chat } from "../models/Chat.js";
import { ApiError } from "../utils/ApiError.js";
import { generateAIReply } from "./ai/aiProvider.js";

const DEFAULT_TITLE = "New conversation";
const TITLE_MAX_LEN = 60;

export async function listChatsForUser(userId) {
  return Chat.find({ userId })
    .sort({ updatedAt: -1 })
    .select("title createdAt updatedAt");
}

export async function createChatForUser(userId) {
  return Chat.create({ userId, title: DEFAULT_TITLE, messages: [] });
}

export async function getChatForUser(userId, chatId) {
  const chat = await Chat.findOne({ _id: chatId, userId });
  if (!chat) {
    throw ApiError.notFound("Conversation not found");
  }
  return chat;
}

export async function deleteChatForUser(userId, chatId) {
  const chat = await Chat.findOneAndDelete({ _id: chatId, userId });
  if (!chat) {
    throw ApiError.notFound("Conversation not found");
  }
}

function deriveTitle(firstMessage) {
  const trimmed = firstMessage.trim();
  return trimmed.length > TITLE_MAX_LEN
    ? `${trimmed.slice(0, TITLE_MAX_LEN)}…`
    : trimmed;
}

export async function appendUserMessage(userId, chatId, content) {
  const chat = await getChatForUser(userId, chatId);

  const isFirstMessage = chat.messages.length === 0;
  chat.messages.push({ role: "user", content, timestamp: new Date() });

  if (isFirstMessage && chat.title === DEFAULT_TITLE) {
    chat.title = deriveTitle(content);
  }

  // Step 8 swaps this call for a real Ollama/OpenAI request — everything
  // else in this function (persistence, title derivation) stays the same.
  const replyText = await generateAIReply(chat.messages);
  chat.messages.push({ role: "assistant", content: replyText, timestamp: new Date() });

  await chat.save();
  return chat;
}
