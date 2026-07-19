import { FileText } from "lucide-react";

export default function Reports() {
  return (
    <div>
      <div className="mb-6">
        <p className="text-xs font-mono text-sentinel-400 mb-1 uppercase tracking-wide">
          Reporting
        </p>
        <h1 className="font-display text-2xl text-ink-50">Incident reports</h1>
        <p className="text-ink-400 text-sm mt-1">
          Report generation and PDF export land in Step 13.
        </p>
      </div>
      <div className="rounded-lg border border-ink-700 bg-ink-900 p-10 flex flex-col items-center gap-2 text-ink-600">
        <FileText size={22} strokeWidth={1.5} />
        <span className="text-sm">No reports yet</span>
      </div>
    </div>
  );
}
