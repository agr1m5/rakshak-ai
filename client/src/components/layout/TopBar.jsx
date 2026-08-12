/**
 * TopBar — the persistent header above the main content area.
 *
 * Shows:
 *  - Current page title (passed as `title` prop)
 *  - Live Socket.IO connection indicator
 *  - Logged-in user email / avatar chip
 *  - Optional right-side action slot (e.g., "Generate Report" button)
 */
import { useAuth } from '@/context/AuthContext';
import { useSocket } from '@/context/SocketContext';
import { Wifi, WifiOff } from 'lucide-react';

export default function TopBar({ title, subtitle, actions }) {
  const { user } = useAuth();
  const { connected } = useSocket();

  // Derive initials from email for the avatar
  const initials = user?.email
    ? user.email.substring(0, 2).toUpperCase()
    : '??';

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between
                       h-16 px-6 bg-surface-900/80 backdrop-blur-md
                       border-b border-white/5">

      {/* ── Left: page title ────────────────────────────────── */}
      <div>
        <h2 className="text-base font-semibold text-slate-100">{title}</h2>
        {subtitle && (
          <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
        )}
      </div>

      {/* ── Right: actions + status + avatar ────────────────── */}
      <div className="flex items-center gap-3">

        {/* Optional slot for page-specific actions */}
        {actions}

        {/* WebSocket connection indicator */}
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs
                        font-medium border
                        ${connected
                          ? 'bg-accent-400/10 text-accent-400 border-accent-400/20'
                          : 'bg-slate-800 text-slate-500 border-slate-700'}`}>
          {connected
            ? <Wifi className="w-3 h-3" />
            : <WifiOff className="w-3 h-3" />}
          <span>{connected ? 'Live' : 'Offline'}</span>
        </div>

        {/* User avatar chip */}
        <div className="flex items-center gap-2 pl-3 border-l border-white/10">
          <div className="w-7 h-7 rounded-full bg-accent-400/20 border border-accent-400/30
                          flex items-center justify-center text-xs font-bold text-accent-400">
            {initials}
          </div>
          <span className="text-xs text-slate-400 hidden sm:block">
            {user?.email}
          </span>
        </div>
      </div>
    </header>
  );
}
