import {
  listChatsForUser,
  createChatForUser,
  getChatForUser,
  deleteChatForUser,
  appendUserMessage,
} from "../services/chatService.js";

export async function listChats(req, res) {
  const chats = await listChatsForUser(req.user._id);
  res.json({ success: true, data: { chats } });
}

export async function createChat(req, res) {
  const chat = await createChatForUser(req.user._id);
  res.status(201).json({ success: true, data: { chat } });
}

export async function getChat(req, res) {
  const chat = await getChatForUser(req.user._id, req.params.id);
  res.json({ success: true, data: { chat } });
}

export async function deleteChat(req, res) {
  await deleteChatForUser(req.user._id, req.params.id);
  res.status(204).send();
}

export async function sendMessage(req, res) {
  const chat = await appendUserMessage(req.user._id, req.params.id, req.body.content);
  res.status(201).json({ success: true, data: { chat } });
}
