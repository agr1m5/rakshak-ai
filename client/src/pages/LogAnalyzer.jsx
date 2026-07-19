import { UploadCloud } from "lucide-react";

export default function LogAnalyzer() {
  return (
    <div>
      <div className="mb-6">
        <p className="text-xs font-mono text-sentinel-400 mb-1 uppercase tracking-wide">
          Analysis
        </p>
        <h1 className="font-display text-2xl text-ink-50">Log analyzer</h1>
        <p className="text-ink-400 text-sm mt-1">
          Upload, parsing, and threat detection land in Steps 9-11.
        </p>
      </div>
      <div className="rounded-lg border-2 border-dashed border-ink-700 bg-ink-900 p-12 text-center text-ink-600 flex flex-col items-center gap-3">
        <UploadCloud size={22} strokeWidth={1.5} />
        <span className="text-sm">
          Drag &amp; drop <span className="font-mono text-ink-400">.txt · .log · .json · .csv</span>
        </span>
        <span className="text-xs text-ink-600">Upload wiring not built yet</span>
      </div>
    </div>
  );
}
