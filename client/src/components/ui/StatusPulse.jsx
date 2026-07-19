export default function StatusPulse({ label = "Monitoring" }) {
  return (
    <div className="flex items-center gap-2 text-xs font-mono text-ink-400">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full rounded-full bg-sentinel-400 opacity-60 animate-ping" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-sentinel-400" />
      </span>
      {label}
    </div>
  );
}
