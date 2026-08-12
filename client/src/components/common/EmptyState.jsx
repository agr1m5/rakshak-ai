/**
 * EmptyState — shown when a list/feed has no items.
 *
 * Props:
 *   icon     — Lucide icon component
 *   title    — short heading
 *   message  — longer description
 *   action   — optional ReactNode (e.g. a button)
 */
export default function EmptyState({ icon: Icon, title, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-full bg-surface-700/60 border border-white/5
                      flex items-center justify-center mb-4">
        {Icon && <Icon className="w-7 h-7 text-slate-600" />}
      </div>
      <h3 className="text-sm font-semibold text-slate-400 mb-1">{title}</h3>
      <p className="text-xs text-slate-600 max-w-xs">{message}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
