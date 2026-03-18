"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Bar, Line, ComposedChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { formatNumber, parseNumberLabel } from "@/lib/utils";
import type { ReportePorZonaDetalle } from "@/api/types";
import { TrendingUp, Calendar } from "lucide-react";

const chartConfig = {
  cantidad: {
    label: "Cantidad",
    color: "var(--palette-1)",
  },
  tendencia: {
    label: "Tendencia",
    color: "var(--palette-0)",
  },
} satisfies ChartConfig;

type ReporteActivosPorAnioLineProps = {
  reportePorAnio: ReportePorZonaDetalle | null;
};

export function ReporteActivosPorAnioLine({
  reportePorAnio,
}: ReporteActivosPorAnioLineProps) {
  const datos = reportePorAnio?.datos ?? [];
  const chartData = datos
    .map((d) => ({
      name: d.Etiqueta,
      cantidad: parseNumberLabel(d.Valor),
      tendencia: parseNumberLabel(d.Valor),
      year: d.Etiqueta,
    }))
    .filter(d => !d.name.includes("EMP") && !d.name.includes("OTR"))
    .sort((a, b) => a.name.localeCompare(b.name));

  const total = chartData.reduce((s, d) => s + d.cantidad, 0);
  const maxYear = chartData.length > 0 ? chartData[chartData.length - 1] : null;
  const minYear = chartData.length > 0 ? chartData[0] : null;
  
  const crecimiento = minYear && maxYear && minYear.cantidad > 0
    ? ((maxYear.cantidad - minYear.cantidad) / minYear.cantidad) * 100
    : 0;

  return (
    <Card className="flex h-full flex-col gap-3 overflow-hidden py-4">
      <CardHeader className="px-4 pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Calendar className="h-5 w-5 text-palette-0" />
          {reportePorAnio?.titulo_reporte ?? "Evolución de Activos por Año"}
        </CardTitle>
        <CardDescription className="text-xs">
          Tendencia histórica · Total {formatNumber(total)} activos
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4 px-4 pt-0">
        {chartData.length > 0 ? (
          <>
            <div className="h-[280px] w-full shrink-0">
              <ChartContainer config={chartConfig} className="h-full w-full">
                <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.3} />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                    tickFormatter={(v) => formatNumber(v)}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value, name) => {
                          return `${formatNumber(Number(value))} activos`;
                        }}
                      />
                    }
                  />
                  <Bar
                    dataKey="cantidad"
                    fill="var(--palette-1)"
                    radius={[8, 8, 0, 0]}
                    fillOpacity={0.6}
                    name="Cantidad"
                  />
                  <Line
                    type="monotone"
                    dataKey="tendencia"
                    stroke="var(--palette-0)"
                    strokeWidth={3}
                    dot={{ fill: "var(--palette-0)", r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Tendencia"
                  />
                </ComposedChart>
              </ChartContainer>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-2 w-2 rounded-full bg-palette-secondary-green" />
                  <span className="text-xs font-medium text-muted-foreground">Primer año</span>
                </div>
                <p className="text-sm font-bold">{minYear?.name}</p>
                <p className="text-xs text-muted-foreground">{formatNumber(minYear?.cantidad ?? 0)} activos</p>
              </div>

              <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-2 w-2 rounded-full bg-palette-0" />
                  <span className="text-xs font-medium text-muted-foreground">Último año</span>
                </div>
                <p className="text-sm font-bold">{maxYear?.name}</p>
                <p className="text-xs text-muted-foreground">{formatNumber(maxYear?.cantidad ?? 0)} activos</p>
              </div>

              <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="h-3 w-3 text-palette-1" />
                  <span className="text-xs font-medium text-muted-foreground">Crecimiento</span>
                </div>
                <p className="text-sm font-bold">{crecimiento > 0 ? '+' : ''}{crecimiento.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground">vs {minYear?.name}</p>
              </div>
            </div>

            <div className="rounded-lg border border-border/60 bg-muted/40 overflow-hidden">
              <div className="border-b border-border/60 bg-muted/80 px-3 py-2 text-xs font-semibold text-muted-foreground flex gap-2">
                <span className="flex-1">Año</span>
                <span className="w-24 text-right">Cantidad</span>
                <span className="w-12 text-right">%</span>
              </div>
              <div className="p-2 space-y-1.5">
                {chartData.map((d, i) => {
                  const pct = total > 0 ? (d.cantidad / total) * 100 : 0;
                  return (
                    <div
                      key={i}
                      className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-muted/60 transition-colors"
                    >
                      <span className="flex-1 text-sm font-medium">{d.name}</span>
                      <span className="w-24 text-right text-sm font-mono font-semibold tabular-nums">
                        {formatNumber(d.cantidad)}
                      </span>
                      <span className="w-12 text-right text-xs font-mono tabular-nums text-muted-foreground">
                        {pct.toFixed(1)}%
                      </span>
                    </div>
                  );
                })}
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
