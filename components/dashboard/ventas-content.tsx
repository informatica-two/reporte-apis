"use client";

import * as React from "react";
import { useVentaDetalles } from "@/hooks/use-venta-detalles";
import type { ReportePorZonaDetalle, FechasParams } from "@/api/types";
import { DashboardHeader } from "./dashboard-header";
import { ReportePorZonaCard } from "./charts/reporte-por-zona-card";
import { ReportePorImpulsadoraCard } from "./charts/reporte-por-impulsadora-card";
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
  initialFechas: FechasParams;
  initialError: string | null;
};

export function VentasContent({
  initialReportePorZona,
  initialReportePorImpulsadora,
  initialFechas,
  initialError,
}: VentasContentProps) {
  const [fechas, setFechas] = React.useState<FechasParams | null>(initialFechas);
  const { reportePorZona, reportePorImpulsadora, state, error, retry } =
    useVentaDetalles(fechas, {
      initialReportePorZona,
      initialReportePorImpulsadora,
      initialFechas,
    });

  const displayError = error ?? initialError;

  return (
    <>
      <DashboardHeader onDateChange={setFechas} onRefresh={retry} />
      <div className="flex-1 p-6">
        {(state === "idle" || state === "loading") && (
          <div className="grid items-stretch gap-5 lg:grid-cols-2">
            <ReporteBarrasCardSkeleton />
            <ReporteBarrasCardSkeleton />
          </div>
        )}
        {state === "error" && displayError && (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <p className="text-destructive">{displayError}</p>
            <Button variant="outline" size="sm" onClick={retry}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Reintentar
            </Button>
          </div>
        )}
        {state === "success" && (
          <div className="grid items-stretch gap-5 lg:grid-cols-2">
            <ReportePorZonaCard reportePorZona={reportePorZona} />
            <ReportePorImpulsadoraCard reportePorImpulsadora={reportePorImpulsadora} />
          </div>
        )}
      </div>
    </>
  );
}
