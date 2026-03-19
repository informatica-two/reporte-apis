"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, Cell, XAxis, YAxis } from "recharts";
import type { ReportePorZonaDetalle } from "@/api/types";
import { parseNumberLabel, formatNumber } from "@/lib/utils";

const CREDITO_COLORS: Record<string, string> = {
  CRE: "var(--chart-1)",
  CON: "var(--chart-2)",
};

const LABELS: Record<string, string> = {
  CRE: "Crédito",
  CON: "Contado",
};

const chartConfig = {
  reclutamientos: {
    label: "Reclutamientos",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

type ReclutamientosPorTipoCreditoBarProps = {
  reportePorTipoCredito: ReportePorZonaDetalle | null;
};

export function ReclutamientosPorTipoCreditoBar({ reportePorTipoCredito }: ReclutamientosPorTipoCreditoBarProps) {
  if (!reportePorTipoCredito) return null;

  const chartData = reportePorTipoCredito.datos
    .map((d) => ({
      name: LABELS[d.Etiqueta] ?? d.Etiqueta,
      reclutamientos: parseNumberLabel(d.Valor),
      etiqueta: d.Etiqueta,
      fill: CREDITO_COLORS[d.Etiqueta] ?? "var(--chart-4)",
    }))
    .filter((d) => d.reclutamientos > 0)
    .sort((a, b) => b.reclutamientos - a.reclutamientos);

  const total = chartData.reduce((sum, d) => sum + d.reclutamientos, 0);

  return (
    <Card className="flex h-full flex-col gap-3 overflow-hidden py-4">
      <CardHeader className="px-4 pb-2">
        <CardTitle className="text-base">Reclutamientos por Tipo de Crédito</CardTitle>
        <CardDescription className="text-xs">
          Crédito vs Contado · {formatNumber(total)} total
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4 px-4 pt-0">
        {chartData.length > 0 && (
          <div className="h-[140px] w-full shrink-0">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ left: 8, right: 16, top: 4, bottom: 4 }}
              >
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={72}
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value) => formatNumber(Number(value))}
                      labelFormatter={(label) => {
                        const item = chartData.find((d) => d.name === label);
                        const pct = item && total > 0 ? ((item.reclutamientos / total) * 100).toFixed(1) : "0";
                        return `${label} (${pct}%)`;
                      }}
                    />
                  }
                />
                <Bar
                  dataKey="reclutamientos"
                  name={chartConfig.reclutamientos.label}
                  fill="var(--chart-1)"
                  radius={[0, 4, 4, 0]}
                  maxBarSize={32}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
