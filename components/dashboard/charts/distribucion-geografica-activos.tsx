"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatNumber, parseNumberLabel } from "@/lib/utils";
import type { ReportePorZonaDetalle } from "@/api/types";
import { MapPin, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

type DistribucionGeograficaActivosProps = {
  reportePorZona: ReportePorZonaDetalle | null;
};

export function DistribucionGeograficaActivos({ reportePorZona }: DistribucionGeograficaActivosProps) {
  const datos = reportePorZona?.datos ?? [];
  const sorted = datos
    .map((d) => ({
      name: d.Etiqueta,
      value: parseNumberLabel(d.Valor),
    }))
    .filter(d => !d.name.includes("#OTR") && !d.name.includes("#EMP"))
    .sort((a, b) => b.value - a.value);

  const total = sorted.reduce((s, d) => s + d.value, 0);
  const promedio = sorted.length > 0 ? total / sorted.length : 0;
  const max = sorted.length > 0 ? sorted[0].value : 1;
  const min = sorted.length > 0 ? sorted[sorted.length - 1].value : 0;

  const top5 = sorted.slice(0, 5);
  const top5Total = top5.reduce((s, d) => s + d.value, 0);
  const top5Pct = total > 0 ? (top5Total / total) * 100 : 0;

  const getIntensity = (value: number): number => {
    if (max === min) return 1;
    return (value - min) / (max - min);
  };

  const getColorClass = (intensity: number): string => {
    if (intensity >= 0.8) return "bg-palette-0 text-white border-palette-0";
    if (intensity >= 0.6) return "bg-palette-1 text-white border-palette-1";
    if (intensity >= 0.4) return "bg-palette-2/70 text-foreground border-palette-2";
    if (intensity >= 0.2) return "bg-palette-3/50 text-foreground border-palette-3";
    return "bg-muted/60 text-muted-foreground border-border";
  };

  return (
    <Card className="flex h-full flex-col gap-3 overflow-hidden py-4">
      <CardHeader className="px-4 pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <MapPin className="h-5 w-5 text-palette-0" />
          Distribución Geográfica de Activos
        </CardTitle>
        <CardDescription className="text-xs">
          Concentración por zona · {sorted.length} zonas activas · Promedio: {formatNumber(promedio)} activos/zona
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4 px-4 pt-0">
        {sorted.length > 0 ? (
          <>
            {/* Mapa de calor */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
              {sorted.map((d, i) => {
                const intensity = getIntensity(d.value);
                const pct = total > 0 ? (d.value / total) * 100 : 0;
                return (
                  <div
                    key={i}
                    className={cn(
                      "rounded-lg border-2 p-2.5 transition-all hover:scale-105 cursor-pointer",
                      getColorClass(intensity)
                    )}
                    title={`${d.name}: ${formatNumber(d.value)} activos (${pct.toFixed(1)}%)`}
                  >
                    <p className="text-xs font-bold mb-1">{d.name}</p>
                    <p className="text-lg font-bold">{formatNumber(d.value)}</p>
                  </div>
                );
              })}
            </div>

            {/* Top 5 */}
            <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-4 w-4 text-secondary-green" />
                <span className="text-xs font-semibold">Top 5 Zonas</span>
                <span className="text-xs text-muted-foreground ml-auto">
                  {top5Pct.toFixed(1)}% del total
                </span>
              </div>
              <div className="space-y-2">
                {top5.map((d, i) => {
                  const pct = total > 0 ? (d.value / total) * 100 : 0;
                  const esSobrePromedio = d.value > promedio;
                  return (
                    <div key={i} className="flex items-center gap-2">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-secondary-green/20 text-secondary-green font-bold text-xs shrink-0">
                        {i + 1}
                      </div>
                      <span className="text-sm font-semibold flex-1">{d.name}</span>
                      <span className="text-sm font-mono font-bold tabular-nums">
                        {formatNumber(d.value)}
                      </span>
                      <span className="text-xs font-mono tabular-nums text-muted-foreground w-12 text-right">
                        {pct.toFixed(1)}%
                      </span>
                      {esSobrePromedio && (
                        <TrendingUp className="h-3 w-3 text-secondary-green" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Estadísticas */}
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
                <p className="text-xs font-medium text-muted-foreground mb-1">Promedio/zona</p>
                <p className="text-lg font-bold">{formatNumber(promedio)}</p>
              </div>
              <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
                <p className="text-xs font-medium text-muted-foreground mb-1">Zona más alta</p>
                <p className="text-lg font-bold text-secondary-green">{formatNumber(max)}</p>
              </div>
              <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
                <p className="text-xs font-medium text-muted-foreground mb-1">Zona más baja</p>
                <p className="text-lg font-bold text-secondary-orange">{formatNumber(min)}</p>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center py-8 text-sm text-muted-foreground">
            No hay datos para el período seleccionado
          </div>
        )}
      </CardContent>
    </Card>
  );
}
