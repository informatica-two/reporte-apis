import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { ProgressBar } from "@/components/progress-bar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <ProgressBar />
      <div className="flex flex-1">
        <DashboardSidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="flex min-h-full flex-col">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
