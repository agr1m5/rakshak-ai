/**
 * SeverityBadge — renders a colour-coded pill for threat severity levels.
 *
 * Severity: 'critical' | 'high' | 'medium' | 'low' | 'info'
 *
 * Used in: ThreatTable, IncidentAlertCard, LiveEventFeed, ReportCard
 */
import { AlertOctagon, AlertTriangle, Info, ShieldAlert, Minus } from 'lucide-react';

const CONFIG = {
  critical: { cls: 'badge-critical', Icon: AlertOctagon,  label: 'Critical' },
  high:     { cls: 'badge-high',     Icon: AlertTriangle,  label: 'High'     },
  medium:   { cls: 'badge-medium',   Icon: ShieldAlert,    label: 'Medium'   },
  low:      { cls: 'badge-low',      Icon: Info,           label: 'Low'      },
  info:     { cls: 'badge-info',     Icon: Minus,          label: 'Info'     },
};

export default function SeverityBadge({ severity, showIcon = true }) {
  const cfg = CONFIG[severity?.toLowerCase()] ?? CONFIG.info;
  return (
    <span className={cfg.cls}>
      {showIcon && <cfg.Icon className="w-3 h-3" />}
      {cfg.label}
    </span>
  );
}
