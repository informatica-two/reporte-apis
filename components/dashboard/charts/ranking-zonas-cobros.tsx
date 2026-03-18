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
import { TrendingUp, TrendingDown, Trophy, AlertTriangle } from "lucide-react";

type RankingZonasCobrosProps = {
  reportePorZona: ReportePorZonaDetalle | null;
};

export function RankingZonasCobros({ reportePorZona }: RankingZonasCobrosProps) {
  const datos = reportePorZona?.datos ?? [];
  const sorted = datos
    .map((d) => ({
      name: d.Etiqueta,
      value: parseNumberLabel(d.Valor),
    }))
    .filter(d => !d.name.includes("#OTR") && !d.name.includes("#EMP"))
    .sort((a, b) => b.value - a.value);

  const top5 = sorted.slice(0, 5);
  const bottom5 = sorted.slice(-5).reverse();
  const total = sorted.reduce((s, d) => s + d.value, 0);
  const promedio = sorted.length > 0 ? total / sorted.length : 0;

  return (
    <Card className="flex h-full flex-col gap-3 overflow-hidden py-4">
      <CardHeader className="px-4 pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Trophy className="h-5 w-5 text-palette-0" />
          Ranking de Zonas
        </CardTitle>
        <CardDescription className="text-xs">
          Top 5 y Bottom 5 zonas por cobro · Promedio: {formatMoney(promedio)}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4 px-4 pt-0">
        {sorted.length > 0 ? (
          <div className="space-y-4">
            {/* Top 5 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 px-2">
                <TrendingUp className="h-4 w-4 text-secondary-green" />
                <span className="text-xs font-semibold text-muted-foreground">Top 5 Zonas</span>
              </div>
              <div className="rounded-lg border border-secondary-green/30 bg-secondary-green/5 overflow-hidden">
                <table className="w-full text-xs">
                  <tbody>
                    {top5.map((d, i) => {
                      const pct = total > 0 ? (d.value / total) * 100 : 0;
                      const esSobrePromedio = d.value > promedio;
                      return (
                        <tr
                          key={`top-${i}`}
                          className="border-b border-border/40 last:border-0 hover:bg-secondary-green/10 transition-colors"
                        >
                          <td className="px-3 py-2 w-8">
                            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-secondary-green/20 text-secondary-green font-bold text-xs">
                              {i + 1}
                            </div>
                          </td>
                          <td className="px-3 py-2 font-semibold">{d.name}</td>
                          <td className="px-3 py-2 text-right font-mono tabular-nums font-semibold">
                            {formatMoney(d.value)}
                          </td>
                          <td className="px-3 py-2 text-right font-mono tabular-nums text-muted-foreground">
                            {pct.toFixed(1)}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bottom 5 */}
            {bottom5.length > 0 && sorted.length > 5 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 px-2">
                  <AlertTriangle className="h-4 w-4 text-secondary-orange" />
                  <span className="text-xs font-semibold text-muted-foreground">Bottom 5 Zonas</span>
                </div>
                <div className="rounded-lg border border-secondary-orange/30 bg-secondary-orange/5 overflow-hidden">
                  <table className="w-full text-xs">
                    <tbody>
                      {bottom5.map((d, i) => {
                        const pct = total > 0 ? (d.value / total) * 100 : 0;
                        const realIndex = sorted.length - bottom5.length + i;
                        return (
                          <tr
                            key={`bottom-${i}`}
                            className="border-b border-border/40 last:border-0 hover:bg-secondary-orange/10 transition-colors"
                          >
                            <td className="px-3 py-2 w-8">
                              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-secondary-orange/20 text-secondary-orange font-bold text-xs">
                                {realIndex + 1}
                              </div>
                            </td>
                            <td className="px-3 py-2 font-medium">{d.name}</td>
                            <td className="px-3 py-2 text-right font-mono tabular-nums">
                              {formatMoney(d.value)}
                            </td>
                            <td className="px-3 py-2 text-right font-mono tabular-nums text-muted-foreground">
                              {pct.toFixed(1)}%
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Estadísticas */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-2 w-2 rounded-full bg-palette-0" />
                  <span className="text-xs font-medium text-muted-foreground">Promedio por zona</span>
                </div>
                <p className="text-lg font-bold">{formatMoney(promedio)}</p>
              </div>

              <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-2 w-2 rounded-full bg-palette-1" />
                  <span className="text-xs font-medium text-muted-foreground">Zonas activas</span>
                </div>
                <p className="text-lg font-bold">{sorted.length}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center py-8 text-sm text-muted-foreground">
            No hay datos para el período seleccionado
          </div>
        )}
      </CardContent>
    </Card>
  );
}
