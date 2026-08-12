/**
 * SettingsPage — user and agent configuration.
 *
 * Sections:
 *  - Account (email, password change)
 *  - Agent Pairing (issue / revoke agent token)
 *  - AI Provider (Ollama / OpenAI toggle)
 *  - Data & Privacy
 *
 * Agent pairing section is the most security-critical UI here —
 * it's where the user gets their agent token to paste into agent/.env
 */
import PageWrapper from '@/components/layout/PageWrapper';
import { Settings, ShieldCheck, Bot, Database, User } from 'lucide-react';

function Section({ icon: Icon, title, children }) {
  return (
    <div className="glass-card glow-border p-6 space-y-4">
      <div className="flex items-center gap-2 border-b border-white/5 pb-4">
        <Icon className="w-4 h-4 text-accent-400" />
        <h3 className="text-sm font-semibold text-slate-200">{title}</h3>
      </div>
      {children}
    </div>
  );
}

export default function SettingsPage() {
  return (
    <PageWrapper title="Settings" subtitle="Account, agent, and AI configuration">
      <div className="max-w-2xl space-y-6">

        <Section icon={User} title="Account">
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Email</label>
              <input className="input" disabled placeholder="Implemented in Step 5" />
            </div>
            <button className="btn-ghost text-xs" disabled>Change password</button>
          </div>
        </Section>

        <Section icon={ShieldCheck} title="Agent Pairing">
          <p className="text-xs text-slate-500">
            Issue a dedicated token for your local agent. This token is stored as a
            bcrypt hash — it is shown only once. Copy it to <code className="mono
            text-accent-400 bg-surface-700/60 px-1 py-0.5 rounded">agent/.env</code> as{' '}
            <code className="mono text-accent-400 bg-surface-700/60 px-1 py-0.5 rounded">AGENT_TOKEN</code>.
          </p>
          <div className="flex gap-2">
            <button className="btn-primary text-xs" disabled>
              <ShieldCheck className="w-3.5 h-3.5" />
              Issue Agent Token
            </button>
            <button className="btn-danger text-xs" disabled>
              Revoke Token
            </button>
          </div>
          <p className="text-[10px] text-slate-700">Agent pairing implemented in Step 5.</p>
        </Section>

        <Section icon={Bot} title="AI Provider">
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Provider</label>
              <select className="input bg-surface-700/60" disabled>
                <option>Ollama (local — default)</option>
                <option>OpenAI</option>
              </select>
            </div>
            <p className="text-[10px] text-slate-700">AI provider toggle implemented in Step 8.</p>
          </div>
        </Section>

        <Section icon={Database} title="Data &amp; Privacy">
          <p className="text-xs text-slate-500">
            Raw system logs, process lists, and network connection data <strong className="text-slate-300">never
            leave your machine</strong>. Only classified findings (threat type, severity, a short
            evidence excerpt) are transmitted to the backend.
          </p>
          <div className="p-3 rounded-lg bg-accent-400/5 border border-accent-400/15">
            <p className="text-xs text-accent-300 font-medium">Privacy guarantee</p>
            <p className="text-xs text-slate-500 mt-0.5">
              All detection runs inside the local agent process on this Mac.
              The backend stores only distilled findings.
            </p>
          </div>
        </Section>

      </div>
    </PageWrapper>
  );
}
