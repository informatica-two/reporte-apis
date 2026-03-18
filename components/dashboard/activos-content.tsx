"use client";

import * as React from "react";
import { useActivosDetalles } from "@/hooks/use-activos-detalles";
import { useActivosKpis } from "@/hooks/use-activos-kpis";
import { useFechasState } from "@/hooks/use-fechas-state";
import type { ReportePorZonaDetalle, FechasParams } from "@/api/types";
import { DashboardHeader } from "./dashboard-header";
import { ReporteActivosPorZonaCard } from "./charts/reporte-activos-por-zona-card";
import { ReporteActivosTipoCreditoPie } from "./charts/reporte-activos-tipo-credito-pie";
import { ReporteActivosPorRangoVertical } from "./charts/reporte-activos-por-rango-vertical";
import { ReporteActivosPorAnioLine } from "./charts/reporte-activos-por-anio-line";
import { ActivosKpiCards } from "./kpis/activos-kpi-cards";
import { AnalisisAntiguedadActivos } from "./charts/analisis-antiguedad-activos";
import { DistribucionGeograficaActivos } from "./charts/distribucion-geografica-activos";
import { PerfilRiesgoActivos } from "./charts/perfil-riesgo-activos";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

function ReporteBarrasCardSkeleton() {
  return (
    <Card className="flex h-full flex-col gap-3 overflow-hidden py-4">
      <CardHeader className="px-4 pb-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="mt-1 h-3 w-56" />
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4 px-4 pt-0">
        <Skeleton className="h-[280px] w-full shrink-0 rounded-lg" />
        <div className="rounded-lg border border-border/60 bg-muted/40 overflow-hidden">
          <div className="border-b border-border/60 bg-muted/80 px-3 py-2 flex gap-2">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-3 w-14 ml-auto" />
          </div>
          <div className="p-2 space-y-1.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between gap-2">
                <Skeleton className="h-3.5 w-16" />
                <Skeleton className="h-3.5 w-20" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

type ActivosContentProps = {
  initialReportePorZona: ReportePorZonaDetalle | null;
  initialReportePorTipoCredito: ReportePorZonaDetalle | null;
  initialReportePorRango: ReportePorZonaDetalle | null;
  initialReportePorAnio: ReportePorZonaDetalle | null;
  initialActivosData: any | null;
  initialFechas: FechasParams;
  initialError: string | null;
};

export function ActivosContent({
  initialReportePorZona,
  initialReportePorTipoCredito,
  initialReportePorRango,
  initialReportePorAnio,
  initialActivosData,
  initialFechas,
  initialError,
}: ActivosContentProps) {
  const { fechas, isInitialFechas, initialDataTimestamp, onDateChange } = 
    useFechasState({ initialFechas });
  
  const { reportePorZona, reportePorTipoCredito, reportePorRango, reportePorAnio, state, error, retry } =
    useActivosDetalles(fechas, {
      initialReportePorZona: isInitialFechas ? initialReportePorZona : undefined,
      initialReportePorTipoCredito: isInitialFechas ? initialReportePorTipoCredito : undefined,
      initialReportePorRango: isInitialFechas ? initialReportePorRango : undefined,
      initialReportePorAnio: isInitialFechas ? initialReportePorAnio : undefined,
      initialDataUpdatedAt: isInitialFechas ? initialDataTimestamp : undefined,
    });

  const { kpis: activosKpis, state: kpisState } = useActivosKpis(fechas, {
    reportePorZona,
    reportePorTipoCredito,
    reportePorRango,
    reportePorAnio,
    initialActivosData: isInitialFechas ? initialActivosData : undefined,
    initialDataUpdatedAt: isInitialFechas ? initialDataTimestamp : undefined,
  });

  const displayError = error ?? initialError;

  return (
    <>
      <DashboardHeader onDateChange={onDateChange} />
      <div className="flex-1 p-6 space-y-6">
        {(state === "idle" || state === "loading") && (
          <>
            <div className="space-y-6">
              {/* Hero card skeleton */}
              <Card className="overflow-hidden border-2">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3 flex-1">
                      <Skeleton className="h-6 w-48" />
                      <Skeleton className="h-10 w-64" />
                      <div className="flex gap-4">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </div>
                    <Skeleton className="h-12 w-24" />
                  </div>
                </CardContent>
              </Card>
              
              {/* Secondary metrics skeleton */}
              <div className="grid gap-4 md:grid-cols-3">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
              
              {/* Temporal analysis skeleton */}
              <Card>
                <CardHeader>
                  <Skeleton className="h-5 w-48" />
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid items-stretch gap-5 lg:grid-cols-2">
              <ReporteBarrasCardSkeleton />
              <ReporteBarrasCardSkeleton />
              <ReporteBarrasCardSkeleton />
              <ReporteBarrasCardSkeleton />
            </div>
          </>
        )}
        {state === "error" && displayError && (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <p className="text-destructive">{displayError}</p>
            <Button variant="outline" size="sm" onClick={() => retry()}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Reintentar
            </Button>
          </div>
        )}
        {state === "success" && (
          <>
            {kpisState === "success" && activosKpis && (
              <ActivosKpiCards kpis={activosKpis} />
            )}
            
            {/* Gráficos principales */}
            <div className="grid items-stretch gap-5 lg:grid-cols-2">
              <ReporteActivosTipoCreditoPie
                reportePorTipoCredito={reportePorTipoCredito}
              />
              <PerfilRiesgoActivos reportePorRango={reportePorRango} />
            </div>

            {/* Análisis temporal - ancho completo */}
            <ReporteActivosPorAnioLine reportePorAnio={reportePorAnio} />

            {/* Análisis adicionales */}
            <div className="grid items-stretch gap-5 lg:grid-cols-2">
              <AnalisisAntiguedadActivos reportePorAnio={reportePorAnio} />
              <DistribucionGeograficaActivos reportePorZona={reportePorZona} />
            </div>

            {/* Gráfico de barras original de zonas */}
            <ReporteActivosPorZonaCard reportePorZona={reportePorZona} />
            
            {/* Gráfico de barras vertical de rangos */}
            <ReporteActivosPorRangoVertical reportePorRango={reportePorRango} />
          </>
        )}
      </div>
    </>
  );
}
