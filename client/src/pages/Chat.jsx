import { useEffect, useRef, useState } from "react";
import { MessageSquare } from "lucide-react";
import ChatSidebar from "../components/chat/ChatSidebar";
import MessageBubble from "../components/chat/MessageBubble";
import ChatInput from "../components/chat/ChatInput";
import SentinelMark from "../components/ui/SentinelMark";
import * as chatService from "../services/chatService";

export default function Chat() {
  const [chats, setChats] = useState([]);
  const [chatsLoading, setChatsLoading] = useState(true);
  const [activeChat, setActiveChat] = useState(null); // full chat doc incl. messages
  const [activeChatLoading, setActiveChatLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  const scrollRef = useRef(null);

  const loadChats = () => {
    setChatsLoading(true);
    return chatService
      .listChats()
      .then(setChats)
      .catch((err) => setError(err.message))
      .finally(() => setChatsLoading(false));
  };

  useEffect(() => {
    loadChats();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [activeChat?.messages?.length]);

  const handleSelect = async (chatId) => {
    setError(null);
    setActiveChatLoading(true);
    try {
      const chat = await chatService.getChat(chatId);
      setActiveChat(chat);
    } catch (err) {
      setError(err.message);
    } finally {
      setActiveChatLoading(false);
    }
  };

  const handleNewChat = async () => {
    setError(null);
    try {
      const chat = await chatService.createChat();
      setChats((prev) => [{ id: chat._id, title: chat.title, updatedAt: chat.updatedAt }, ...prev]);
      setActiveChat(chat);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (chatId) => {
    try {
      await chatService.deleteChat(chatId);
      setChats((prev) => prev.filter((c) => c.id !== chatId));
      if (activeChat?._id === chatId) setActiveChat(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSend = async (content) => {
    if (!activeChat) return;
    setError(null);

    // Optimistic update: show the user's message immediately, before the
    // (currently placeholder, real from Step 8) AI reply comes back.
    const optimisticChat = {
      ...activeChat,
      messages: [...activeChat.messages, { role: "user", content, timestamp: new Date().toISOString() }],
    };
    setActiveChat(optimisticChat);
    setSending(true);

    try {
      const updatedChat = await chatService.sendMessage(activeChat._id, content);
      setActiveChat(updatedChat);
      setChats((prev) =>
        prev.map((c) => (c.id === updatedChat._id ? { ...c, title: updatedChat.title } : c))
      );
    } catch (err) {
      setError(err.message);
      setActiveChat(activeChat); // revert optimistic update on failure
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="-m-6 flex h-[calc(100vh-4rem)]">
      <ChatSidebar
        chats={chats.map((c) => ({ id: c._id || c.id, title: c.title }))}
        activeChatId={activeChat?._id}
        onSelect={handleSelect}
        onNewChat={handleNewChat}
        onDelete={handleDelete}
        loading={chatsLoading}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {error && (
          <div className="m-4 rounded-md border border-severity-critical/30 bg-severity-critical/10 px-4 py-2 text-sm text-severity-critical">
            {error}
          </div>
        )}

        {!activeChat && !activeChatLoading && (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-ink-600">
            <SentinelMark size={40} animated={false} />
            <p className="text-sm">Select a conversation or start a new one</p>
          </div>
        )}

        {activeChatLoading && (
          <div className="flex-1 flex items-center justify-center text-ink-600 text-sm font-mono">
            Loading…
          </div>
        )}

        {activeChat && !activeChatLoading && (
          <>
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
              {activeChat.messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center gap-2 text-ink-600">
                  <MessageSquare size={22} strokeWidth={1.5} />
                  <p className="text-sm">Ask a security question to get started</p>
                </div>
              )}
              {activeChat.messages.map((m, i) => (
                <MessageBubble key={i} role={m.role} content={m.content} />
              ))}
              {sending && (
                <MessageBubble role="assistant" content="Thinking…" />
              )}
            </div>
            <ChatInput onSend={handleSend} disabled={sending} />
          </>
        )}
      </div>
    </div>
  );
}
