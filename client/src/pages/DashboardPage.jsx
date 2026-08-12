/**
 * DashboardPage — Live Operations Dashboard.
 *
 * This page is the heart of Rakshak Live.
 * Current state (Step 2): structural shell with stat cards and panel
 * placeholders. Real data arrives in Step 6 (Socket.IO wiring) and
 * Step 11 (findings ingestion from the agent).
 *
 * Panel layout:
 *   ┌───────────────────────────────────────────┐
 *   │  4 stat cards (threats, incidents, …)     │
 *   ├──────────────────────┬────────────────────┤
 *   │  Live Event Feed     │  Severity Chart    │
 *   ├──────────────────────┴────────────────────┤
 *   │  Process Panel  │  Network Panel          │
 *   └───────────────────────────────────────────┘
 */
import PageWrapper from '@/components/layout/PageWrapper';
import { Activity, Skull, GitBranch, ShieldOff } from 'lucide-react';

function StatCard({ icon: Icon, label, value, color = 'text-accent-400', subtext }) {
  return (
    <div className="stat-card accent-top">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-slate-500">{label}</span>
        <div className={`p-1.5 rounded-lg bg-surface-700/60 ${color}`}>
          <Icon className="w-3.5 h-3.5" />
        </div>
      </div>
      <span className={`text-3xl font-bold ${color}`}>{value}</span>
      {subtext && <p className="text-xs text-slate-600 mt-1">{subtext}</p>}
    </div>
  );
}

function PanelPlaceholder({ title, height = 'h-64' }) {
  return (
    <div className={`glass-card glow-border ${height} flex flex-col`}>
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
        <span className="text-xs font-semibold text-slate-400">{title}</span>
        <span className="text-[10px] text-slate-600 ml-auto">Step 6 wires live data</span>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <p className="text-xs text-slate-700">Awaiting Socket.IO connection…</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <PageWrapper
      title="Live Dashboard"
      subtitle="Real-time security monitoring · local agent"
    >
      {/* Stat row */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Skull}     label="Threats Detected" value="—" color="text-red-400"    subtext="live count" />
        <StatCard icon={GitBranch} label="Open Incidents"   value="—" color="text-orange-400" subtext="correlated" />
        <StatCard icon={Activity}  label="Events / min"     value="—" color="text-accent-400"  subtext="from agent" />
        <StatCard icon={ShieldOff} label="Agent Status"     value="—" color="text-slate-400"   subtext="connect agent" />
      </div>

      {/* Main panels */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-4">
        <div className="xl:col-span-2">
          <PanelPlaceholder title="⚡ Live Event Feed" height="h-80" />
        </div>
        <PanelPlaceholder title="📊 Severity Distribution" height="h-80" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <PanelPlaceholder title="🔄 Process Monitor" height="h-60" />
        <PanelPlaceholder title="🌐 Network Connections" height="h-60" />
      </div>
    </PageWrapper>
  );
}
