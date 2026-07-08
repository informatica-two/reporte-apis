"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn, esEtiquetaOtros, formatMoney } from "@/lib/utils";
import type { VentaCobroPorZonaDetalle } from "@/api/types";
import { MapPin, Flame } from "lucide-react";

type MapaCalorMunicipiosProps = {
  ventaCobroPorZona: VentaCobroPorZonaDetalle | null;
};

type ZonaIntensidad = {
  name: string;
  venta: number;
  cobro: number;
  /** % de cobro del mes actual sobre la venta del mes anterior. null si no hay venta con qué comparar. */
  pct: number | null;
};

export function MapaCalorMunicipios({ ventaCobroPorZona }: MapaCalorMunicipiosProps) {
  const datos = ventaCobroPorZona?.datos ?? [];

  const zonas: ZonaIntensidad[] = datos
    .map((d) => {
      const venta = d.venta_neta;
      const cobro = d.cobrado;
      const pct = venta > 0 ? (cobro / venta) * 100 : null;
      return { name: d.Etiqueta, venta, cobro, pct };
    })
    .filter((d) => d.name && !esEtiquetaOtros(d.name) && !d.name.includes("#EMP"))
    .filter((d) => d.venta > 0 || d.cobro > 0);

  // Las zonas con % calculable van primero, ordenadas de mejor a peor.
  // Las que no tienen venta del mes anterior con qué comparar van al final.
  const sorted = [...zonas].sort((a, b) => {
    if (a.pct === null && b.pct === null) return b.cobro - a.cobro;
    if (a.pct === null) return 1;
    if (b.pct === null) return -1;
    return b.pct - a.pct;
  });

  const getColorClass = (pct: number | null): string => {
    if (pct === null) return "bg-muted/60 text-muted-foreground border-border";
    if (pct >= 100) return "bg-palette-0 text-white border-palette-0";
    if (pct >= 80) return "bg-palette-1 text-white border-palette-1";
    if (pct >= 60) return "bg-palette-2/70 text-foreground border-palette-2";
    if (pct >= 40) return "bg-palette-3/50 text-foreground border-palette-3";
    return "bg-muted/60 text-muted-foreground border-border";
  };

  return (
    <Card className="flex h-full flex-col gap-3 overflow-hidden py-4">
      <CardHeader className="px-4 pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <MapPin className="h-5 w-5 text-palette-0" />
          {ventaCobroPorZona?.titulo_reporte ?? "Intensidad de Cobro por Zona"}
        </CardTitle>
        <CardDescription className="text-xs">
          % de cobro del mes actual sobre la venta del mes anterior · {sorted.length} zonas activas
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4 px-4 pt-0">
        {sorted.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {sorted.map((d, i) => (
                <div
                  key={i}
                  className={cn(
                    "rounded-lg border-2 p-3 transition-all hover:scale-105 cursor-pointer",
                    getColorClass(d.pct)
                  )}
                  title={
                    d.pct !== null
                      ? `${d.name}: ${d.pct.toFixed(1)}% cobrado (Cobro ${formatMoney(d.cobro)} / Venta mes anterior ${formatMoney(d.venta)})`
                      : `${d.name}: sin venta del mes anterior para comparar (Cobro ${formatMoney(d.cobro)})`
                  }
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    {d.pct !== null && d.pct >= 100 && <Flame className="h-3 w-3" />}
                    <span className="text-xs font-bold">{d.name}</span>
                  </div>
                  <p className="text-sm font-mono font-semibold tabular-nums">
                    {d.pct !== null ? `${d.pct.toFixed(1)}%` : "N/D"}
                  </p>
                  <p className="text-xs font-mono tabular-nums opacity-80 mt-0.5">
                    {formatMoney(d.cobro)} / {formatMoney(d.venta)}
                  </p>
                </div>
              ))}
            </div>

            {/* Leyenda */}
            <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
              <div className="flex items-center gap-2 mb-2">
                <Flame className="h-4 w-4 text-palette-0" />
                <span className="text-xs font-semibold">Escala de Intensidad (% cobrado vs. venta mes anterior)</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded bg-palette-0 border-2 border-palette-0" />
                  <span className="text-xs text-muted-foreground">≥ 100%</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded bg-palette-1 border-2 border-palette-1" />
                  <span className="text-xs text-muted-foreground">80% - 99%</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded bg-palette-2/70 border-2 border-palette-2" />
                  <span className="text-xs text-muted-foreground">60% - 79%</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded bg-palette-3/50 border-2 border-palette-3" />
                  <span className="text-xs text-muted-foreground">40% - 59%</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded bg-muted/60 border-2 border-border" />
                  <span className="text-xs text-muted-foreground">&lt; 40% / N-D</span>
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
