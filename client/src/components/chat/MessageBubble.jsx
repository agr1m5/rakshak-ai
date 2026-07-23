import SentinelMark from "../ui/SentinelMark";

export default function MessageBubble({ role, content }) {
  const isUser = role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="shrink-0 mt-0.5">
          <SentinelMark size={24} animated={false} />
        </div>
      )}
      <div
        className={`max-w-[70%] rounded-lg px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? "bg-sentinel-400 text-ink-950"
            : "bg-ink-800 text-ink-50 border border-ink-700"
        }`}
      >
        {content}
      </div>
    </div>
  );
}
