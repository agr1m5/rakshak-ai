import { useState } from "react";
import { Send } from "lucide-react";

export default function ChatInput({ onSend, disabled, placeholder }) {
  const [value, setValue] = useState("");

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-ink-700 p-4">
      <div className="flex items-end gap-2 rounded-lg border border-ink-700 bg-ink-900 px-3 py-2 focus-within:ring-1 focus-within:ring-sentinel-400">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={placeholder || "Ask about a threat, CVE, or mitigation…"}
          rows={1}
          className="flex-1 resize-none bg-transparent text-sm text-ink-50 placeholder:text-ink-600 focus:outline-none py-1 max-h-40"
        />
        <button
          onClick={handleSend}
          disabled={disabled || !value.trim()}
          className="shrink-0 rounded-md bg-sentinel-400 p-2 text-ink-950 disabled:opacity-40 transition-opacity"
          aria-label="Send message"
        >
          <Send size={15} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
