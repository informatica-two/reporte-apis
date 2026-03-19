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
import { Cell, Pie, PieChart, Legend } from "recharts";
import { formatNumber, parseNumberLabel } from "@/lib/utils";
import type { ReportePorZonaDetalle } from "@/api/types";
import { CreditCard } from "lucide-react";

const CREDITO_COLORS = [
  "var(--palette-0)",
  "var(--palette-1)",
  "var(--palette-secondary-blue)",
  "var(--palette-secondary-green)",
];

const chartConfig = {
  valor: {
    label: "Activos",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

type ReporteActivosTipoCreditoPieProps = {
  reportePorTipoCredito: ReportePorZonaDetalle | null;
};

export function ReporteActivosTipoCreditoPie({
  reportePorTipoCredito,
}: ReporteActivosTipoCreditoPieProps) {
  const datos = reportePorTipoCredito?.datos ?? [];
  const chartData = datos
    .map((d, i) => ({
      name: d.Etiqueta,
      value: parseNumberLabel(d.Valor),
      fill: CREDITO_COLORS[i % CREDITO_COLORS.length],
    }))
    .filter(d => !d.name.includes("EMP"))
    .sort((a, b) => b.value - a.value);

  const total = chartData.reduce((s, d) => s + d.value, 0);

  return (
    <Card className="flex h-full flex-col gap-3 overflow-hidden py-4">
      <CardHeader className="px-4 pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-palette-0" />
          {reportePorTipoCredito?.titulo_reporte ?? "Activos por Tipo de Crédito"}
        </CardTitle>
        <CardDescription className="text-xs">
          Distribución por tipo de crédito · Total {formatNumber(total)} activos
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4 px-4 pt-0">
        {chartData.length > 0 ? (
          <>
            <div className="h-[280px] w-full shrink-0">
              <ChartContainer config={chartConfig} className="h-full w-full">
                <PieChart>
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value) => `${formatNumber(Number(value))} activos`}
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
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
            </div>

            <div className="rounded-lg border border-border/60 bg-muted/40 overflow-hidden">
              <div className="border-b border-border/60 bg-muted/80 px-3 py-2 text-xs font-semibold text-muted-foreground flex gap-2">
                <span className="flex-1">Tipo</span>
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
                      <span className="flex-1 text-sm font-medium">{d.name}</span>
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
