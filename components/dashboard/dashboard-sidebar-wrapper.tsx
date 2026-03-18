"use client";

import { useRouter } from "next/navigation";
import { DashboardSidebar } from "./dashboard-sidebar";

export function DashboardSidebarWrapper() {
  const router = useRouter();

  const handleRefresh = () => {
    router.refresh();
  };

  return <DashboardSidebar onRefresh={handleRefresh} />;
}
