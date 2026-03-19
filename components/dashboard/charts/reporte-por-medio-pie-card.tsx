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
import { Cell, Pie, PieChart, Legend, ResponsiveContainer } from "recharts";
import { formatMoney, parseNumberLabel } from "@/lib/utils";
import type { ReportePorZonaDetalle } from "@/api/types";

const MEDIO_COLORS = [
  "var(--palette-0)",
  "var(--palette-1)",
  "var(--palette-2)",
  "var(--palette-secondary-blue)",
  "var(--palette-secondary-green)",
  "var(--palette-secondary-orange)",
  "var(--palette-3)",
  "var(--palette-4)",
];

const chartConfig = {
  valor: {
    label: "Cobro",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

type ReportePorMedioPieCardProps = {
  reportePorMedio: ReportePorZonaDetalle | null;
};

export function ReportePorMedioPieCard({ reportePorMedio }: ReportePorMedioPieCardProps) {
  const datos = reportePorMedio?.datos ?? [];
  const chartData = datos
    .map((d, i) => ({
      name: d.Etiqueta,
      value: parseNumberLabel(d.Valor),
      fill: MEDIO_COLORS[i % MEDIO_COLORS.length],
    }))
    .sort((a, b) => b.value - a.value);

  const total = chartData.reduce((s, d) => s + d.value, 0);

  return (
    <Card className="flex h-full flex-col gap-3 overflow-hidden py-4">
      <CardHeader className="px-4 pb-2">
        <CardTitle className="text-base">
          {reportePorMedio?.titulo_reporte ?? "Reporte por Medio"}
        </CardTitle>
        <CardDescription className="text-xs">
          Distribución de cobros por medio de pago · Total {formatMoney(total)}
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
                        formatter={(value) => formatMoney(Number(value))}
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
                    label={({ name, percent }) => 
                      `${name} ${(percent * 100).toFixed(1)}%`
                    }
                    labelLine={{ stroke: "var(--muted-foreground)", strokeWidth: 1 }}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/40 overflow-hidden">
              <div className="max-h-[180px] overflow-y-auto">
                <table className="w-full text-xs">
                  <thead className="sticky top-0 bg-muted/80 backdrop-blur">
                    <tr className="border-b border-border/60">
                      <th className="px-3 py-2 text-left font-medium text-muted-foreground">
                        Medio
                      </th>
                      <th className="px-3 py-2 text-right font-medium text-muted-foreground">
                        Cobro
                      </th>
                      <th className="px-3 py-2 text-right font-medium text-muted-foreground">
                        %
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {chartData.map((d, i) => {
                      const pct = total > 0 ? (d.value / total) * 100 : 0;
                      return (
                        <tr
                          key={`${d.name}-${i}`}
                          className="border-b border-border/40 last:border-0"
                        >
                          <td className="px-3 py-1.5 flex items-center gap-2">
                            <div
                              className="h-2.5 w-2.5 rounded-sm shrink-0"
                              style={{ backgroundColor: d.fill }}
                            />
                            <span className="font-medium">{d.name}</span>
                          </td>
                          <td className="px-3 py-1.5 text-right font-mono tabular-nums">
                            {formatMoney(d.value)}
                          </td>
                          <td className="px-3 py-1.5 text-right font-mono tabular-nums text-muted-foreground">
                            {pct.toFixed(1)}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
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
