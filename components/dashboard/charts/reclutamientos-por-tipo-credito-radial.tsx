"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadialBarChart, RadialBar } from "recharts";
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
  percentage: {
    label: "Porcentaje",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

type ReclutamientosPorTipoCreditoRadialProps = {
  reportePorTipoCredito: ReportePorZonaDetalle | null;
};

export function ReclutamientosPorTipoCreditoRadial({ reportePorTipoCredito }: ReclutamientosPorTipoCreditoRadialProps) {
  if (!reportePorTipoCredito) return null;

  const rawData = reportePorTipoCredito.datos
    .map((d) => ({
      name: LABELS[d.Etiqueta] ?? d.Etiqueta,
      value: parseNumberLabel(d.Valor),
      etiqueta: d.Etiqueta,
    }))
    .filter((d) => d.value > 0)
    .sort((a, b) => b.value - a.value);

  const total = rawData.reduce((sum, d) => sum + d.value, 0);

  const chartData = rawData.map((d) => ({
    ...d,
    fill: CREDITO_COLORS[d.etiqueta] ?? "var(--chart-4)",
    percentage: total > 0 ? (d.value / total) * 100 : 0,
  }));

  return (
    <Card className="flex h-full flex-col gap-3 overflow-hidden py-4">
      <CardHeader className="px-4 pb-2">
        <CardTitle className="text-base">Tipo de Crédito</CardTitle>
        <CardDescription className="text-xs">
          Distribución de {formatNumber(total)} reclutamientos por tipo de crédito
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4 px-4 pt-0">
        {chartData.length > 0 && (
          <div className="h-[280px] w-full shrink-0">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="10%"
                outerRadius="80%"
                data={chartData}
                startAngle={90}
                endAngle={-270}
              >
                <RadialBar
                  label={{
                    position: "insideStart",
                    fill: "var(--card)",
                    formatter: (value: number) => `${value.toFixed(0)}%`,
                  }}
                  background
                  dataKey="percentage"
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value, name, props) => [
                        `${formatNumber(props.payload.value)} (${Number(value).toFixed(1)}%)`,
                        name,
                      ]}
                    />
                  }
                />
              </RadialBarChart>
            </ChartContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
