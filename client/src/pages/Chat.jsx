import { MessageSquare } from "lucide-react";

export default function Chat() {
  return (
    <div>
      <div className="mb-6">
        <p className="text-xs font-mono text-sentinel-400 mb-1 uppercase tracking-wide">
          Assistant
        </p>
        <h1 className="font-display text-2xl text-ink-50">AI chat</h1>
        <p className="text-ink-400 text-sm mt-1">
          ChatGPT-style interface lands in Step 7, AI integration in Step 8.
        </p>
      </div>
      <div className="rounded-lg border border-ink-700 bg-ink-900 h-96 flex flex-col items-center justify-center gap-2 text-ink-600">
        <MessageSquare size={22} strokeWidth={1.5} />
        <span className="text-sm">Chat interface placeholder</span>
      </div>
    </div>
  );
}
