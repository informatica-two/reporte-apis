"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserPlus, Users, CalendarDays, TrendingUp } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import type { ReporteKpis } from "@/hooks/use-reporte-data";

type ReclutamientosCardProps = {
  kpis: ReporteKpis;
};

export function ReclutamientosCard({ kpis }: ReclutamientosCardProps) {
  const { reclutamientos, reclutamientosDia, activoNeto, dias } = kpis;
  const pctCrecimiento =
    activoNeto > 0 ? (reclutamientos / activoNeto) * 100 : 0;

  return (
    <Card className="flex h-full flex-col gap-3 overflow-hidden py-4">
      <CardHeader className="px-4 pb-2">
        <CardTitle className="text-base">Reclutamientos</CardTitle>
        <CardDescription className="text-xs">
          Nuevos integrantes en el período
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-between gap-4 px-4 pt-0">
        {/* Main stat */}
        <div className="flex items-center gap-3 rounded-lg bg-muted/40 p-4">
          <div
            className="rounded-md p-3"
            style={{
              backgroundColor: "color-mix(in srgb, var(--palette-2) 20%, transparent)",
              color: "var(--palette-2)",
            }}
          >
            <UserPlus className="size-6" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total reclutados</p>
            <p className="text-3xl font-bold tabular-nums">
              {formatNumber(reclutamientos)}
            </p>
          </div>
        </div>

        {/* Secondary stats */}
        <div className="grid grid-cols-1 gap-2">
          <div className="flex items-center gap-2 rounded-md border border-border/60 px-3 py-2">
            <CalendarDays className="size-4 shrink-0 text-muted-foreground" />
            <div className="flex flex-1 items-center justify-between">
              <span className="text-xs text-muted-foreground">
                Promedio / día
              </span>
              <span className="font-mono text-sm font-semibold">
                {reclutamientosDia.toFixed(1)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-md border border-border/60 px-3 py-2">
            <Users className="size-4 shrink-0 text-muted-foreground" />
            <div className="flex flex-1 items-center justify-between">
              <span className="text-xs text-muted-foreground">
                Activos totales
              </span>
              <span className="font-mono text-sm font-semibold">
                {formatNumber(activoNeto)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-md border border-border/60 px-3 py-2">
            <TrendingUp className="size-4 shrink-0 text-muted-foreground" />
            <div className="flex flex-1 items-center justify-between">
              <span className="text-xs text-muted-foreground">
                Crecimiento neto
              </span>
              <span className="font-mono text-sm font-semibold">
                {pctCrecimiento.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        <p className="text-center text-[10px] text-muted-foreground">
          En {dias} {dias === 1 ? "día" : "días"} del período
        </p>
      </CardContent>
    </Card>
  );
}
