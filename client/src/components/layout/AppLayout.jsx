import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  MessageSquare,
  FileSearch,
  FileText,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import SentinelMark from "../ui/SentinelMark";
import StatusPulse from "../ui/StatusPulse";
import ErrorBoundary from "../ErrorBoundary";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/chat", label: "AI chat", icon: MessageSquare },
  { to: "/logs", label: "Log analyzer", icon: FileSearch },
  { to: "/reports", label: "Incident reports", icon: FileText },
];

export default function AppLayout() {
  const { logout } = useAuth();
  const location = useLocation();

  return (
    <div className="flex h-screen bg-ink-950">
      <aside className="w-64 shrink-0 bg-ink-900 border-r border-ink-700 flex flex-col">
        <div className="flex items-center gap-3 px-5 h-16 border-b border-ink-700">
          <SentinelMark size={32} />
          <div className="leading-tight">
            <div className="font-display font-semibold text-ink-50 text-[15px]">
              Rakshak
            </div>
            <div className="text-[11px] font-mono text-ink-400">
              cyber assistant
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? "bg-sentinel-400/10 text-sentinel-300 border border-sentinel-400/20"
                    : "text-ink-400 border border-transparent hover:bg-ink-800 hover:text-ink-50"
                }`
              }
            >
              <Icon size={16} strokeWidth={1.75} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-ink-700">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-ink-400 hover:bg-ink-800 hover:text-ink-50 transition-colors"
          >
            <LogOut size={16} strokeWidth={1.75} />
            Log out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 shrink-0 border-b border-ink-700 flex items-center justify-between px-6">
          <StatusPulse label="Monitoring active" />
          <div className="text-xs font-mono text-ink-400">v0.1.0</div>
        </header>
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            <ErrorBoundary key={location.pathname}>
              <Outlet />
            </ErrorBoundary>
          </div>
        </main>
      </div>
    </div>
  );
}
