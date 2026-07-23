import { Plus, MessageSquare, Trash2 } from "lucide-react";

export default function ChatSidebar({
  chats,
  activeChatId,
  onSelect,
  onNewChat,
  onDelete,
  loading,
}) {
  return (
    <div className="w-64 shrink-0 border-r border-ink-700 flex flex-col h-full">
      <div className="p-3 border-b border-ink-700">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 rounded-md bg-sentinel-400/10 border border-sentinel-400/30 text-sentinel-300 text-sm px-3 py-2 hover:bg-sentinel-400/20 transition-colors"
        >
          <Plus size={15} strokeWidth={2} />
          New chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {loading && (
          <div className="text-xs font-mono text-ink-600 px-2 py-3">Loading…</div>
        )}

        {!loading && chats.length === 0 && (
          <div className="text-xs text-ink-600 px-2 py-3">
            No conversations yet
          </div>
        )}

        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`group flex items-center gap-2 rounded-md px-2.5 py-2 text-sm cursor-pointer ${
              chat.id === activeChatId
                ? "bg-ink-800 text-ink-50"
                : "text-ink-400 hover:bg-ink-800/60 hover:text-ink-50"
            }`}
            onClick={() => onSelect(chat.id)}
          >
            <MessageSquare size={14} className="shrink-0" strokeWidth={1.75} />
            <span className="truncate flex-1">{chat.title}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(chat.id);
              }}
              className="opacity-0 group-hover:opacity-100 text-ink-600 hover:text-severity-critical shrink-0"
              aria-label="Delete conversation"
            >
              <Trash2 size={13} strokeWidth={1.75} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
