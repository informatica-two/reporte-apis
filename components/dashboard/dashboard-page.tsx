"use client";

import * as React from "react";
import { DashboardHeader } from "./dashboard-header";
import type { VistaActiva } from "./dashboard-header";
import { DashboardSkeleton } from "./dashboard-skeleton";
import { KpiCards } from "./kpis/kpi-cards";
import { VentasVsCobrosChart } from "./charts/ventas-vs-cobros-chart";
import { DesgloseVentasWaterfall } from "./charts/desglose-ventas-waterfall";
import { ComposicionCobrosChart } from "./charts/composicion-cobros-chart";
import { ReclutamientosCard } from "./charts/reclutamientos-card";
import { ReportePorZonaCard } from "./charts/reporte-por-zona-card";
import { ReportePorImpulsadoraCard } from "./charts/reporte-por-impulsadora-card";
import { ExportExcelButton } from "./export-excel-button";
import { PersonalizablePage } from "./personalizable/personalizable-page";
import { useReporteData } from "@/hooks/use-reporte-data";
import type { FechasParams } from "@/api/types";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export function DashboardPage() {
  const [fechas, setFechas] = React.useState<FechasParams | null>(null);
  const [vistaActiva, setVistaActiva] = React.useState<VistaActiva>("principal");
  const { kpis, reportePorZona, reportePorImpulsadora, state, error, retry, lastUpdated } = useReporteData(fechas);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <DashboardHeader
        onDateChange={setFechas}
        onRefresh={retry}
        lastUpdated={lastUpdated}
        vistaActiva={vistaActiva}
        onVistaChange={setVistaActiva}
      />
      <main className="flex-1 p-6">
        {vistaActiva === "principal" && (
          <>
            {(state === "idle" || state === "loading") && <DashboardSkeleton />}
            {state === "error" && (
              <div className="flex flex-col items-center gap-4 py-16 text-center">
                <p className="text-destructive">{error}</p>
                <Button variant="outline" size="sm" onClick={retry}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reintentar
                </Button>
              </div>
            )}
            {state === "success" && kpis && (
              <div className="flex flex-col gap-5">
                <div className="no-print flex justify-end gap-2">
                  <ExportExcelButton kpis={kpis} fechas={fechas} />
                </div>
                <KpiCards kpis={kpis} />
                <div className="grid items-stretch gap-5 lg:grid-cols-4">
                  <VentasVsCobrosChart kpis={kpis} />
                  <DesgloseVentasWaterfall kpis={kpis} />
                  <ComposicionCobrosChart kpis={kpis} />
                  <ReclutamientosCard kpis={kpis} />
                </div>
                <div className="grid items-stretch gap-5 lg:grid-cols-2">
                  <ReportePorZonaCard reportePorZona={reportePorZona} />
                  <ReportePorImpulsadoraCard reportePorImpulsadora={reportePorImpulsadora} />
                </div>
              </div>
            )}
          </>
        )}

        {vistaActiva === "personalizable" && (
          <PersonalizablePage fechas={fechas} />
        )}
      </main>
    </div>
  );
}
