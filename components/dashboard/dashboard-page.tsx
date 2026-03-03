"use client";

import * as React from "react";
import { DashboardHeader } from "./dashboard-header";
import type { FechasParams } from "@/api/types";

export function DashboardPage() {
  const [fechas, setFechas] = React.useState<FechasParams | null>(null);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <DashboardHeader onDateChange={setFechas} />
      <main className="flex-1 p-6" />
    </div>
  );
}
