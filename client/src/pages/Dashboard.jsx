import { FileSearch, FileText, ShieldAlert, MessageSquare } from "lucide-react";
import SeverityBadge from "../components/ui/SeverityBadge";

const stats = [
  { label: "Uploaded logs", value: "—", icon: FileSearch },
  { label: "Reports", value: "—", icon: FileText },
  { label: "Threats detected", value: "—", icon: ShieldAlert },
  { label: "Conversations", value: "—", icon: MessageSquare },
];

export default function Dashboard() {
  return (
    <div>
      <div className="mb-6">
        <p className="text-xs font-mono text-sentinel-400 mb-1 uppercase tracking-wide">
          Overview
        </p>
        <h1 className="font-display text-2xl text-ink-50">Dashboard</h1>
        <p className="text-ink-400 text-sm mt-1">
          Threat stats, severity charts, and recent activity land in Step 6.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="rounded-lg border border-ink-700 bg-ink-900 p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-ink-400">{label}</span>
              <Icon size={15} className="text-sentinel-400" strokeWidth={1.75} />
            </div>
            <div className="font-mono text-2xl text-ink-50">{value}</div>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-ink-700 bg-ink-900 p-5">
        <h2 className="font-display text-sm text-ink-50 mb-4">
          Severity legend
        </h2>
        <div className="flex flex-wrap gap-2">
          <SeverityBadge level="low" />
          <SeverityBadge level="medium" />
          <SeverityBadge level="high" />
          <SeverityBadge level="critical" />
        </div>
      </div>
    </div>
  );
}
