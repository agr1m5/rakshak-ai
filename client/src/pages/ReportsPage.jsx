/**
 * ReportsPage — list of generated PDF incident reports.
 * Fully implemented in Step 13.
 */
import PageWrapper from '@/components/layout/PageWrapper';
import EmptyState from '@/components/common/EmptyState';
import { FileText, Plus } from 'lucide-react';

export default function ReportsPage() {
  return (
    <PageWrapper
      title="Reports"
      subtitle="AI-generated PDF incident reports"
      actions={
        <button className="btn-primary" disabled>
          <Plus className="w-4 h-4" /> Generate Report
        </button>
      }
    >
      <EmptyState
        icon={FileText}
        title="No reports yet"
        message="Generate a PDF report from a time range or specific correlated incident. Available in Step 13."
      />
    </PageWrapper>
  );
}
