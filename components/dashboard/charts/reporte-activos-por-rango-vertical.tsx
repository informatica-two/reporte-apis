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
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell } from "recharts";
import { formatNumber, parseNumberLabel } from "@/lib/utils";
import type { ReportePorZonaDetalle } from "@/api/types";
import { BarChart3 } from "lucide-react";

const RANGO_COLORS = [
  "var(--palette-secondary-green)",
  "var(--palette-secondary-blue)",
  "var(--palette-1)",
  "var(--palette-0)",
  "var(--palette-4)",
];

const chartConfig = {
  valor: {
    label: "Activos",
    color: "var(--palette-0)",
  },
} satisfies ChartConfig;

type ReporteActivosPorRangoVerticalProps = {
  reportePorRango: ReportePorZonaDetalle | null;
};

export function ReporteActivosPorRangoVertical({
  reportePorRango,
}: ReporteActivosPorRangoVerticalProps) {
  const datos = reportePorRango?.datos ?? [];
  const chartData = datos
    .map((d, i) => ({
      name: d.Etiqueta.replace(/^\d+\.\s*/, ""),
      value: parseNumberLabel(d.Valor),
      fill: RANGO_COLORS[i % RANGO_COLORS.length],
      originalName: d.Etiqueta,
    }))
    .filter(d => !d.originalName.includes("EMP"));

  const total = chartData.reduce((s, d) => s + d.value, 0);
  const maxValue = Math.max(...chartData.map(d => d.value), 0);

  return (
    <Card className="flex h-full flex-col gap-3 overflow-hidden py-4">
      <CardHeader className="px-4 pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-palette-0" />
          {reportePorRango?.titulo_reporte ?? "Activos por Rango"}
        </CardTitle>
        <CardDescription className="text-xs">
          Distribución por rango de monto · Total {formatNumber(total)} activos
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4 px-4 pt-0">
        {chartData.length > 0 ? (
          <>
            <div className="h-[280px] w-full shrink-0">
              <ChartContainer config={chartConfig} className="h-full w-full">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.3} />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                    angle={-15}
                    textAnchor="end"
                    height={60}
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
                        formatter={(value) => `${formatNumber(Number(value))} activos`}
                      />
                    }
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            </div>

            <div className="rounded-lg border border-border/60 bg-muted/40 overflow-hidden">
              <div className="border-b border-border/60 bg-muted/80 px-3 py-2 text-xs font-semibold text-muted-foreground flex gap-2">
                <span className="flex-1">Rango</span>
                <span className="w-24 text-right">Cantidad</span>
                <span className="w-12 text-right">%</span>
              </div>
              <div className="p-2 space-y-1.5">
                {chartData.map((d, i) => {
                  const pct = total > 0 ? (d.value / total) * 100 : 0;
                  return (
                    <div
                      key={i}
                      className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-muted/60 transition-colors"
                    >
                      <div
                        className="h-3 w-3 rounded-sm shrink-0"
                        style={{ backgroundColor: d.fill }}
                      />
                      <span className="flex-1 text-sm font-medium">{d.originalName}</span>
                      <span className="w-24 text-right text-sm font-mono font-semibold tabular-nums">
                        {formatNumber(d.value)}
                      </span>
                      <span className="w-12 text-right text-xs font-mono tabular-nums text-muted-foreground">
                        {pct.toFixed(1)}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {maxValue > 0 && (
              <div className="rounded-lg bg-muted/40 border border-border/60 p-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Rango predominante:</span>
                  <span className="font-semibold">
                    {chartData[0]?.originalName} ({formatNumber(chartData[0]?.value ?? 0)} activos)
                  </span>
                </div>
              </div>
            )}
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
