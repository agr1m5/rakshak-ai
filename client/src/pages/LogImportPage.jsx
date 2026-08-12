/**
 * LogImportPage — secondary manual log import path.
 *
 * Accepts .log / .txt / .json / .csv files for offline analysis.
 * Fully implemented in Step 14.
 * Shell shows the drag-and-drop zone structure.
 */
import PageWrapper from '@/components/layout/PageWrapper';
import { Upload, FileUp } from 'lucide-react';

export default function LogImportPage() {
  return (
    <PageWrapper
      title="Log Import"
      subtitle="Secondary path — analyze an existing log file"
    >
      {/* Note banner */}
      <div className="mb-6 px-4 py-3 rounded-lg bg-accent-400/5 border border-accent-400/15
                      text-xs text-accent-300 flex items-start gap-2">
        <Upload className="w-4 h-4 shrink-0 mt-0.5" />
        <span>
          The primary flow is the live agent. This import path is for analyzing
          existing log files — server logs, exported event logs, etc. — using the
          same detection pipeline.
        </span>
      </div>

      {/* Drop zone */}
      <div className="glass-card glow-border border-dashed border-2 border-white/10
                      hover:border-accent-400/30 transition-colors duration-300
                      flex flex-col items-center justify-center py-20 cursor-pointer">
        <FileUp className="w-10 h-10 text-slate-600 mb-4" />
        <p className="text-sm font-semibold text-slate-400 mb-1">
          Drop a log file here
        </p>
        <p className="text-xs text-slate-600">
          Supports .log · .txt · .json · .csv
        </p>
        <p className="text-[10px] text-slate-700 mt-4">
          Upload implemented in Step 14
        </p>
      </div>
    </PageWrapper>
  );
}
