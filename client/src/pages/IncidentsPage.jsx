/**
 * IncidentsPage — correlated incident list.
 * Fully implemented in Step 11.
 */
import PageWrapper from '@/components/layout/PageWrapper';
import EmptyState from '@/components/common/EmptyState';
import { GitBranch } from 'lucide-react';

export default function IncidentsPage() {
  return (
    <PageWrapper title="Incidents" subtitle="Correlated threat clusters">
      <EmptyState
        icon={GitBranch}
        title="No incidents yet"
        message="The agent correlates related threats into incidents automatically. Start the agent to see them here."
      />
    </PageWrapper>
  );
}
