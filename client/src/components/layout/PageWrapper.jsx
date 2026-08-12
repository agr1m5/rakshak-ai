/**
 * PageWrapper — wraps every authenticated page with Sidebar + TopBar.
 *
 * Usage:
 *   <PageWrapper title="Dashboard" subtitle="Real-time threat monitoring">
 *     <YourPageContent />
 *   </PageWrapper>
 *
 * Keeps the app-level chrome (sidebar, header) co-located and avoids
 * repeating the layout boilerplate in every page component.
 */
import Sidebar from './Sidebar';
import TopBar from './TopBar';

export default function PageWrapper({ title, subtitle, actions, children }) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Fixed-width navigation rail */}
      <Sidebar />

      {/* Scrollable main area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar title={title} subtitle={subtitle} actions={actions} />
        <main className="flex-1 overflow-y-auto p-6 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
