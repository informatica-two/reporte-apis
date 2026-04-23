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
import { Bar, BarChart, Cell, XAxis, YAxis } from "recharts";
import { formatMoney } from "@/lib/utils";
import { parseNumberLabel } from "@/lib/utils";
import type { ReportePorZonaDetalle } from "@/api/types";

/** Paleta por barra (orden mayor → menor): la primera destaca. */
const BAR_COLORS = [
  "var(--palette-0)",
  "var(--palette-1)",
  "var(--palette-2)",
  "var(--palette-3)",
  "var(--palette-4)",
  "var(--palette-6)",
  "var(--palette-7)",
  "var(--palette-secondary-blue)",
  "var(--palette-secondary-green)",
  "var(--palette-secondary-orange)",
];

const chartConfig = {
  valor: {
    label: "Venta",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export type ReporteBarrasCardProps = {
  reporte: ReportePorZonaDetalle | null;
  tituloFallback: string;
  columnaEtiqueta?: string;
};

export function ReporteBarrasCard({
  reporte,
  tituloFallback,
  columnaEtiqueta = "Zona",
}: ReporteBarrasCardProps) {
  const datos = reporte?.datos ?? [];
  const chartData = datos
    .map((d) => ({
      name: d.Etiqueta,
      valor: parseNumberLabel(d.Valor),
    }))
    .sort((a, b) => b.valor - a.valor);

  const total = chartData.reduce((s, d) => s + d.valor, 0);

  const barColor = (index: number) =>
    BAR_COLORS[index % BAR_COLORS.length];

  return (
    <Card className="flex h-full flex-col gap-3 overflow-hidden py-4">
      <CardHeader className="px-4 pb-2">
        <CardTitle className="text-base">
          {reporte?.titulo_reporte ?? tituloFallback}
        </CardTitle>
        <CardDescription className="text-xs">
          Venta en el período · Total {formatMoney(total)}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4 px-4 pt-0">
        {chartData.length > 0 ? (
          <>
            <div className="h-[280px] w-full shrink-0">
              <ChartContainer config={chartConfig} className="h-full w-full">
                <BarChart
                  data={chartData}
                  layout="vertical"
                  margin={{ left: 4, right: 16, top: 4, bottom: 4 }}
                >
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value) => formatMoney(Number(value))}
                      />
                    }
                  />
                  <XAxis type="number" tickFormatter={(v) => formatMoney(v)} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={100}
                    tick={{ fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Bar dataKey="valor" name="Venta" radius={[0, 4, 4, 0]}>
                    {chartData.map((_, i) => (
                      <Cell key={i} fill={barColor(i)} />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/40 overflow-hidden">
              <div className="max-h-[180px] overflow-y-auto">
                <table className="w-full text-xs">
                  <thead className="sticky top-0 bg-muted/80 backdrop-blur">
                    <tr className="border-b border-border/60">
                    <th className="px-3 py-2 text-left font-medium text-muted-foreground text-xs">
                      {columnaEtiqueta?.replace(/#/g, '') || ''}
                    </th>
                      <th className="px-3 py-2 text-right font-medium text-muted-foreground">
                        Venta
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {chartData.map((d, i) => (
                      <tr
                        key={`${d.name}-${i}`}
                        className="border-b border-border/40 last:border-0"
                      >
                        <td className="px-3 py-1.5 font-medium text-xs">
                          {d.name.replace(/#/g, '')}
                        </td>
                        <td className="px-3 py-1.5 text-right font-mono tabular-nums">
                          {formatMoney(d.valor)}
                        </td>
                      </tr>
                    ))}
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
