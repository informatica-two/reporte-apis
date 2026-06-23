"use client";

import * as React from "react";
import { useReporteData } from "@/hooks/use-reporte-data";
import { useFechasState } from "@/hooks/use-fechas-state";
import { useDashboardDetalles } from "@/hooks/use-dashboard-detalles";
import type { ReporteKpis } from "@/hooks/use-reporte-data";
import type { FechasParams } from "@/api/types";
import type { DashboardDetalles } from "@/lib/server-data";
import { DashboardHeader } from "./dashboard-header";
import { DashboardSkeleton } from "./dashboard-skeleton";
import { KpiCards } from "./kpis/kpi-cards";
import { VentasVsCobrosChart } from "./charts/ventas-vs-cobros-chart";
import { DesgloseVentasWaterfall } from "./charts/desglose-ventas-waterfall";
import { ComposicionCobrosChart } from "./charts/composicion-cobros-chart";
import { ReclutamientosCard } from "./charts/reclutamientos-card";
import { ComparativoVentasCobrosPorZona } from "./charts/comparativo-ventas-cobros-por-zona";
import { ComparativoActivosVentasTipoCredito } from "./charts/comparativo-activos-ventas-tipo-credito";
import { ExportExcelButton } from "./export-excel-button";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

type DashboardContentProps = {
  initialKpis: ReporteKpis | null;
  initialFechas: FechasParams;
  initialError: string | null;
  initialDashboardDetalles?: DashboardDetalles | null;
  initialDashboardDetallesError?: string | null;
};

export function DashboardContent({
  initialKpis,
  initialFechas,
  initialError,
  initialDashboardDetalles = null,
  initialDashboardDetallesError = null,
}: DashboardContentProps) {
  const { fechas, isInitialFechas, initialDataTimestamp, onDateChange } =
    useFechasState({ initialFechas });

  const { kpis, state, error, retry } = useReporteData(fechas, {
    initialData: isInitialFechas ? initialKpis : undefined,
    initialDataUpdatedAt: isInitialFechas ? initialDataTimestamp : undefined,
  });

  const {
    ventaCobroPorZona,
    activosPorTipoCredito,
    ventaPorTipoCredito,
    state: detallesState,
  } = useDashboardDetalles(fechas, {
    initialData: isInitialFechas ? initialDashboardDetalles ?? undefined : undefined,
    initialDataUpdatedAt: isInitialFechas ? initialDataTimestamp : undefined,
  });

  const displayError = error ?? initialError;
  const showComparativos =
    detallesState === "success" &&
    ventaCobroPorZona &&
    activosPorTipoCredito &&
    ventaPorTipoCredito;

  return (
    <>
      <DashboardHeader
        initialFechas={initialFechas}
        onDateChange={onDateChange}
      />
      <div className="flex-1 p-6">
        {(state === "idle" || state === "loading") && <DashboardSkeleton />}
        {state === "error" && displayError && (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <p className="text-destructive">{displayError}</p>
            <Button variant="outline" size="sm" onClick={() => retry()}>
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
            {showComparativos && (
              <div className="grid items-stretch gap-5 lg:grid-cols-2">
                <ComparativoVentasCobrosPorZona
                  ventaCobroPorZona={ventaCobroPorZona}
                />
                <ComparativoActivosVentasTipoCredito
                  activosPorTipoCredito={activosPorTipoCredito}
                  ventaPorTipoCredito={ventaPorTipoCredito}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
