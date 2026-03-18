"use client";

import * as React from "react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { PersonalizablePage } from "@/components/dashboard/personalizable/personalizable-page";
import { getDefaultFechas } from "@/lib/server-data";
import type { FechasParams } from "@/api/types";

export default function PersonalizableDashboardPage() {
  const [fechas, setFechas] = React.useState<FechasParams | null>(getDefaultFechas());

  return (
    <>
      <DashboardHeader onDateChange={setFechas} />
      <div className="flex-1 p-6">
        <PersonalizablePage fechas={fechas} />
      </div>
    </>
  );
}
