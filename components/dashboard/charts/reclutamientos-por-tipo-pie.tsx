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

const TIPO_COLORS: Record<string, string> = {
  PRO: "var(--chart-1)",
  OFI: "var(--chart-2)",
  RDS: "var(--palette-2)",
  EMP: "var(--muted-foreground)",
};

const LABELS: Record<string, string> = {
  PRO: "Promotores",
  OFI: "Oficinistas",
  RDS: "RDS",
  EMP: "Empleados",
};

const chartConfig = {
  value: {
    label: "Reclutamientos",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

type ReclutamientosPorTipoPieProps = {
  reportePorTipo: ReportePorZonaDetalle | null;
};

export function ReclutamientosPorTipoPie({ reportePorTipo }: ReclutamientosPorTipoPieProps) {
  if (!reportePorTipo) return null;

  const chartData = reportePorTipo.datos
    .map((d) => ({
      name: LABELS[d.Etiqueta] ?? d.Etiqueta,
      value: parseNumberLabel(d.Valor),
      etiqueta: d.Etiqueta,
      fill: TIPO_COLORS[d.Etiqueta] ?? "var(--chart-4)",
    }))
    .filter((d) => d.value > 0)
    .sort((a, b) => b.value - a.value);

  const total = chartData.reduce((sum, d) => sum + d.value, 0);

  return (
    <Card className="flex h-full flex-col gap-3 overflow-hidden py-4">
      <CardHeader className="px-4 pb-2">
        <CardTitle className="text-base">Reclutamientos por Tipo</CardTitle>
        <CardDescription className="text-xs">
          Distribución de {formatNumber(total)} reclutamientos por tipo de colaborador
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
