"use client";

import * as React from "react";
import { DashboardHeader } from "./dashboard-header";
import { DashboardSkeleton } from "./dashboard-skeleton";
import { KpiCards } from "./kpi-cards";
import { VentasVsCobrosChart } from "./ventas-vs-cobros-chart";
import { DesgloseVentasWaterfall } from "./desglose-ventas-waterfall";
import { ComposicionCobrosChart } from "./composicion-cobros-chart";
import { useReporteData } from "@/hooks/use-reporte-data";
import type { FechasParams } from "@/api/types";

export function DashboardPage() {
  const [fechas, setFechas] = React.useState<FechasParams | null>(null);
  const { kpis, state, error } = useReporteData(fechas);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <DashboardHeader onDateChange={setFechas} />
      <main className="flex-1 p-6">
        {state === "loading" && <DashboardSkeleton />}
        {state === "error" && (
          <p className="text-destructive py-8 text-center">{error}</p>
        )}
        {state === "success" && kpis && (
          <div className="flex flex-col gap-6">
            <KpiCards kpis={kpis} />
            <div className="grid items-stretch gap-4 lg:grid-cols-3">
              <VentasVsCobrosChart kpis={kpis} />
              <DesgloseVentasWaterfall kpis={kpis} />
              <ComposicionCobrosChart kpis={kpis} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
