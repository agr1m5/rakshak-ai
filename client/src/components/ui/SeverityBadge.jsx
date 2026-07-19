const styles = {
  low: "bg-severity-low/10 text-severity-low border-severity-low/30",
  medium: "bg-severity-medium/10 text-severity-medium border-severity-medium/30",
  high: "bg-severity-high/10 text-severity-high border-severity-high/30",
  critical: "bg-severity-critical/10 text-severity-critical border-severity-critical/30",
};

export default function SeverityBadge({ level = "low" }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-mono uppercase tracking-wide ${styles[level]}`}
    >
      {level}
    </span>
  );
}
