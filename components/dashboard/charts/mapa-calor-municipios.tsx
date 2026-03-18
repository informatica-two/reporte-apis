"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatMoney, parseNumberLabel } from "@/lib/utils";
import type { ReportePorZonaDetalle } from "@/api/types";
import { MapPin, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

type MapaCalorMunicipiosProps = {
  reportePorMunicipio: ReportePorZonaDetalle | null;
};

export function MapaCalorMunicipios({ reportePorMunicipio }: MapaCalorMunicipiosProps) {
  const datos = reportePorMunicipio?.datos ?? [];
  const sorted = datos
    .map((d) => ({
      name: d.Etiqueta,
      value: parseNumberLabel(d.Valor),
    }))
    .filter(d => !d.name.includes("#OTR") && !d.name.includes("#EMP"))
    .sort((a, b) => b.value - a.value);

  const total = sorted.reduce((s, d) => s + d.value, 0);
  const max = sorted.length > 0 ? sorted[0].value : 1;
  const min = sorted.length > 0 ? sorted[sorted.length - 1].value : 0;

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
          {reportePorMunicipio?.titulo_reporte ?? "Mapa de Calor - Municipios"}
        </CardTitle>
        <CardDescription className="text-xs">
          Intensidad de cobro por municipio · {sorted.length} municipios activos
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4 px-4 pt-0">
        {sorted.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {sorted.map((d, i) => {
                const intensity = getIntensity(d.value);
                const pct = total > 0 ? (d.value / total) * 100 : 0;
                return (
                  <div
                    key={i}
                    className={cn(
                      "rounded-lg border-2 p-3 transition-all hover:scale-105 cursor-pointer",
                      getColorClass(intensity)
                    )}
                    title={`${d.name}: ${formatMoney(d.value)} (${pct.toFixed(1)}%)`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      {intensity >= 0.8 && <Flame className="h-3 w-3" />}
                      <span className="text-xs font-bold">{d.name}</span>
                    </div>
                    <p className="text-sm font-mono font-semibold tabular-nums">
                      {formatMoney(d.value)}
                    </p>
                    <p className="text-xs font-mono tabular-nums opacity-80 mt-0.5">
                      {pct.toFixed(1)}%
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Leyenda */}
            <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
              <div className="flex items-center gap-2 mb-2">
                <Flame className="h-4 w-4 text-palette-0" />
                <span className="text-xs font-semibold">Escala de Intensidad</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded bg-palette-0 border-2 border-palette-0" />
                  <span className="text-xs text-muted-foreground">Muy alta</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded bg-palette-1 border-2 border-palette-1" />
                  <span className="text-xs text-muted-foreground">Alta</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded bg-palette-2/70 border-2 border-palette-2" />
                  <span className="text-xs text-muted-foreground">Media</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded bg-palette-3/50 border-2 border-palette-3" />
                  <span className="text-xs text-muted-foreground">Baja</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded bg-muted/60 border-2 border-border" />
                  <span className="text-xs text-muted-foreground">Muy baja</span>
                </div>
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
