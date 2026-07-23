import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { FileSearch, FileText, ShieldAlert, MessageSquare } from "lucide-react";
import SeverityBadge from "../components/ui/SeverityBadge";
import { fetchDashboardStats } from "../services/dashboardService";

ChartJS.register(ArcElement, Tooltip, Legend);

// Matches the severity.* colors in tailwind.config.js — Chart.js can't
// read Tailwind classes, so the hex values are duplicated here deliberately.
const SEVERITY_COLORS = {
  low: "#22C55E",
  medium: "#F59E0B",
  high: "#F97316",
  critical: "#EF4444",
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats()
      .then(setStats)
      .catch((err) => setError(err.message || "Failed to load dashboard"))
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    { label: "Uploaded logs", value: stats?.totals.logs, icon: FileSearch },
    { label: "Reports", value: stats?.totals.reports, icon: FileText },
    { label: "Threats detected", value: stats?.totals.threats, icon: ShieldAlert },
    { label: "Conversations", value: stats?.totals.conversations, icon: MessageSquare },
  ];

  const severityEntries = stats
    ? Object.entries(stats.severityDistribution)
    : [];
  const totalThreats = severityEntries.reduce((sum, [, v]) => sum + v, 0);

  const chartData = {
    labels: severityEntries.map(([level]) => level),
    datasets: [
      {
        data: severityEntries.map(([, count]) => count),
        backgroundColor: severityEntries.map(([level]) => SEVERITY_COLORS[level]),
        borderColor: "#111827", // ink-900 — separates slices against the dark card
        borderWidth: 2,
      },
    ],
  };

  return (
    <div>
      <div className="mb-6">
        <p className="text-xs font-mono text-sentinel-400 mb-1 uppercase tracking-wide">
          Overview
        </p>
        <h1 className="font-display text-2xl text-ink-50">Dashboard</h1>
        <p className="text-ink-400 text-sm mt-1">
          Live counts from your account. Threats populate once log analysis
          (Steps 9-11) is built.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-md border border-severity-critical/30 bg-severity-critical/10 px-4 py-3 text-sm text-severity-critical">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-lg border border-ink-700 bg-ink-900 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-ink-400">{label}</span>
              <Icon size={15} className="text-sentinel-400" strokeWidth={1.75} />
            </div>
            <div className="font-mono text-2xl text-ink-50">
              {loading ? "—" : value}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-lg border border-ink-700 bg-ink-900 p-5">
          <h2 className="font-display text-sm text-ink-50 mb-4">
            Severity distribution
          </h2>
          {loading ? (
            <div className="h-48 flex items-center justify-center text-ink-600 text-sm">
              Loading…
            </div>
          ) : totalThreats === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center gap-3 text-ink-600 text-sm">
              <div className="flex gap-2">
                <SeverityBadge level="low" />
                <SeverityBadge level="medium" />
                <SeverityBadge level="high" />
                <SeverityBadge level="critical" />
              </div>
              No threats detected yet
            </div>
          ) : (
            <div className="h-48">
              <Doughnut
                data={chartData}
                options={{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "right",
                      labels: { color: "#8B95A7", boxWidth: 12, font: { family: "JetBrains Mono", size: 11 } },
                    },
                  },
                }}
              />
            </div>
          )}
        </div>

        <div className="rounded-lg border border-ink-700 bg-ink-900 p-5">
          <h2 className="font-display text-sm text-ink-50 mb-4">
            Recent conversations
          </h2>
          {loading ? (
            <div className="h-48 flex items-center justify-center text-ink-600 text-sm">
              Loading…
            </div>
          ) : stats?.recentConversations.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-ink-600 text-sm">
              No conversations yet — try the AI chat
            </div>
          ) : (
            <ul className="space-y-2">
              {stats?.recentConversations.map((c) => (
                <li
                  key={c.id}
                  className="flex items-center justify-between rounded-md border border-ink-700 px-3 py-2 text-sm"
                >
                  <span className="text-ink-50 truncate">{c.title}</span>
                  <span className="text-xs font-mono text-ink-400 shrink-0 ml-3">
                    {new Date(c.updatedAt).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
