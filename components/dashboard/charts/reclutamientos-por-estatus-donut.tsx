"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell } from "recharts";
import type { ReportePorZonaDetalle } from "@/api/types";
import { parseNumberLabel, formatNumber } from "@/lib/utils";

const ESTATUS_COLORS: Record<string, string> = {
  APR: "var(--chart-2)",
  PRO: "var(--chart-4)",
  DEN: "var(--palette-0)",
};

const LABELS: Record<string, string> = {
  APR: "Aprobados",
  PRO: "En Proceso",
  DEN: "Denegados",
};

const chartConfig = {
  value: {
    label: "Solicitudes",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

type ReclutamientosPorEstatusDonutProps = {
  reportePorEstatus: ReportePorZonaDetalle | null;
};

export function ReclutamientosPorEstatusDonut({ reportePorEstatus }: ReclutamientosPorEstatusDonutProps) {
  if (!reportePorEstatus) return null;

  const chartData = reportePorEstatus.datos
    .map((d) => ({
      name: LABELS[d.Etiqueta] ?? d.Etiqueta,
      value: parseNumberLabel(d.Valor),
      etiqueta: d.Etiqueta,
      fill: ESTATUS_COLORS[d.Etiqueta] ?? "var(--chart-3)",
    }))
    .filter((d) => d.value > 0)
    .sort((a, b) => b.value - a.value);

  const total = chartData.reduce((sum, d) => sum + d.value, 0);

  return (
    <Card className="flex h-full flex-col gap-3 overflow-hidden py-4">
      <CardHeader className="px-4 pb-2">
        <CardTitle className="text-base">Estado de Reclutamientos</CardTitle>
        <CardDescription className="text-xs">
          Distribución por estatus de {formatNumber(total)} solicitudes
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4 px-4 pt-0">
        {chartData.length > 0 && (
          <div className="h-[280px] w-full shrink-0">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <PieChart>
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value) => formatNumber(Number(value))}
                    />
                  }
                />
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={8}
                  minAngle={4}
                  stroke="var(--card)"
                  strokeWidth={2}
                  cornerRadius={6}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={{ stroke: "var(--muted-foreground)", strokeWidth: 1 }}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
