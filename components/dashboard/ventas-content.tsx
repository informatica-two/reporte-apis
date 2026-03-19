"use client";

import * as React from "react";
import { useVentaDetalles } from "@/hooks/use-venta-detalles";
import { useVentasKpis } from "@/hooks/use-ventas-kpis";
import { useFechasState } from "@/hooks/use-fechas-state";
import type { ReportePorZonaDetalle, FechasParams } from "@/api/types";
import { DashboardHeader } from "./dashboard-header";
import { ReportePorZonaCard } from "./charts/reporte-por-zona-card";
import { ReportePorImpulsadoraCard } from "./charts/reporte-por-impulsadora-card";
import { ReporteDetalle3Card } from "./charts/reporte-detalle3-card";
import { VentaPorTipoCreditoPie } from "./charts/venta-por-tipo-credito-pie";
import { VentasKpiCards } from "./kpis/ventas-kpi-cards";
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

type VentasContentProps = {
  initialReportePorZona: ReportePorZonaDetalle | null;
  initialReportePorImpulsadora: ReportePorZonaDetalle | null;
  initialReporteDetalle3: ReportePorZonaDetalle | null;
  initialReportePorTipoCredito: ReportePorZonaDetalle | null;
  initialVentaData: any | null;
  initialFechas: FechasParams;
  initialError: string | null;
};

export function VentasContent({
  initialReportePorZona,
  initialReportePorImpulsadora,
  initialReporteDetalle3,
  initialReportePorTipoCredito,
  initialVentaData,
  initialFechas,
  initialError,
}: VentasContentProps) {
  const { fechas, isInitialFechas, initialDataTimestamp, onDateChange } = 
    useFechasState({ initialFechas });
  
  const { reportePorZona, reportePorImpulsadora, reporteDetalle3, reportePorTipoCredito, state, error, retry } =
    useVentaDetalles(fechas, {
      initialReportePorZona: isInitialFechas ? initialReportePorZona : undefined,
      initialReportePorImpulsadora: isInitialFechas ? initialReportePorImpulsadora : undefined,
      initialReporteDetalle3: isInitialFechas ? initialReporteDetalle3 : undefined,
      initialReportePorTipoCredito: isInitialFechas ? initialReportePorTipoCredito : undefined,
      initialDataUpdatedAt: isInitialFechas ? initialDataTimestamp : undefined,
    });

  const { kpis: ventasKpis, state: kpisState } = useVentasKpis(fechas, {
    reportePorZona,
    reportePorImpulsadora,
    reporteDetalle3,
    reportePorTipoCredito,
    initialVentaData: isInitialFechas ? initialVentaData : undefined,
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
                  <Skeleton className="h-2 w-full" />
                </CardContent>
              </Card>
              
              {/* Secondary metrics skeleton */}
              <div className="grid gap-4 md:grid-cols-3">
                <Skeleton className="h-28 w-full" />
                <Skeleton className="h-28 w-full" />
                <Skeleton className="h-28 w-full" />
              </div>
              
              {/* Top performers skeleton */}
              <Card>
                <CardHeader>
                  <Skeleton className="h-5 w-32" />
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
            {kpisState === "success" && ventasKpis && (
              <VentasKpiCards kpis={ventasKpis} />
            )}
            <div className="grid items-stretch gap-5 lg:grid-cols-2">
              <ReportePorZonaCard reportePorZona={reportePorZona} />
              <ReportePorImpulsadoraCard
                reportePorImpulsadora={reportePorImpulsadora}
              />
              <ReporteDetalle3Card reporteDetalle3={reporteDetalle3} />
              <VentaPorTipoCreditoPie reportePorTipoCredito={reportePorTipoCredito} />
            </div>
          </>
        )}
      </div>
    </>
  );
}
