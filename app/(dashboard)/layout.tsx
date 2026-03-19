import { DashboardSidebarWrapper } from "@/components/dashboard/dashboard-sidebar-wrapper";
import { ProgressBar } from "@/components/progress-bar";

/** Live report APIs: prerender at build would block on slow/unreachable backends (60s limit). */
export const dynamic = "force-dynamic";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <ProgressBar />
      <div className="flex flex-1">
        <DashboardSidebarWrapper />
        <main className="flex-1 overflow-y-auto">
          <div className="flex min-h-full flex-col">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
