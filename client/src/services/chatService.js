import api from "./api";

export async function listChats() {
  const { data } = await api.get("/chat");
  return data.data.chats;
}

export async function createChat() {
  const { data } = await api.post("/chat");
  return data.data.chat;
}

export async function getChat(chatId) {
  const { data } = await api.get(`/chat/${chatId}`);
  return data.data.chat;
}

export async function deleteChat(chatId) {
  await api.delete(`/chat/${chatId}`);
}

export async function sendMessage(chatId, content) {
  const { data } = await api.post(`/chat/${chatId}/messages`, { content });
  return data.data.chat;
}
