/**
 * ThreatsPage — paginated list of detected threats (findings).
 * Fully implemented in Step 11. This shell shows the table structure.
 */
import PageWrapper from '@/components/layout/PageWrapper';
import EmptyState from '@/components/common/EmptyState';
import { Skull } from 'lucide-react';

export default function ThreatsPage() {
  return (
    <PageWrapper title="Threats" subtitle="All detected findings">
      <div className="glass-card glow-border">
        {/* Table header */}
        <div className="grid grid-cols-12 px-4 py-3 border-b border-white/5
                        text-[10px] font-semibold uppercase tracking-widest text-slate-600">
          <span className="col-span-1">Severity</span>
          <span className="col-span-3">Type</span>
          <span className="col-span-3">Source</span>
          <span className="col-span-3">Detected</span>
          <span className="col-span-2 text-right">Actions</span>
        </div>

        <EmptyState
          icon={Skull}
          title="No threats yet"
          message="Threats appear here once the local agent is running and detects suspicious activity."
        />
      </div>
    </PageWrapper>
  );
}
