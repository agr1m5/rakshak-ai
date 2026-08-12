/**
 * ChatPage — AI Chat interface (ChatGPT-style).
 *
 * Current state (Step 2): structural shell.
 * Full implementation: Step 7 (Chat UI) + Step 8 (AI integration).
 *
 * Layout:
 *   Left panel  — conversation list
 *   Right panel — active conversation messages + input bar
 */
import PageWrapper from '@/components/layout/PageWrapper';
import { MessageSquare, Plus } from 'lucide-react';

export default function ChatPage() {
  return (
    <PageWrapper title="AI Chat" subtitle="Ask anything about security">
      <div className="flex h-[calc(100vh-10rem)] gap-4">

        {/* Conversation list */}
        <div className="w-64 shrink-0 glass-card glow-border flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
            <span className="text-xs font-semibold text-slate-400">Conversations</span>
            <button className="btn-ghost py-1 px-2 text-xs" aria-label="New chat">
              <Plus className="w-3.5 h-3.5" /> New
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <p className="text-xs text-slate-700 text-center px-4">
              Conversations appear here.<br />Implemented in Step 7.
            </p>
          </div>
        </div>

        {/* Chat window */}
        <div className="flex-1 glass-card glow-border flex flex-col">
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-accent-400/10 border border-accent-400/20
                            flex items-center justify-center">
              <MessageSquare className="w-7 h-7 text-accent-400" />
            </div>
            <p className="text-sm font-semibold text-slate-400">Start a conversation</p>
            <p className="text-xs text-slate-600 max-w-xs text-center">
              Ask about threat types, CVEs, attack techniques, or how to mitigate specific vulnerabilities.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              {['What is SQL Injection?', 'Explain MITRE ATT&CK', 'How to mitigate XSS'].map(q => (
                <span key={q}
                  className="text-xs px-3 py-1.5 rounded-full bg-surface-700/60
                             border border-white/5 text-slate-500 cursor-pointer
                             hover:border-accent-400/30 hover:text-slate-300 transition-colors">
                  {q}
                </span>
              ))}
            </div>
          </div>

          {/* Input bar placeholder */}
          <div className="p-4 border-t border-white/5">
            <div className="flex gap-2">
              <input
                className="input flex-1"
                placeholder="Ask a security question… (available in Step 8)"
                disabled
              />
              <button className="btn-primary" disabled>Send</button>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
