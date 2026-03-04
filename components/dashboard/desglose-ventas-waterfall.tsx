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
import { Cell, Pie, PieChart } from "recharts";
import { formatMoney } from "@/lib/utils";
import { getComposicionVentasData } from "@/lib/charts/composicion-ventas";
import type { ReporteKpis } from "@/hooks/use-reporte-data";
import { RotateCcw } from "lucide-react";

const chartConfig = {
  ventaNeta: {
    label: "Venta neta",
    color: "var(--chart-4)",
  },
  devoluciones: {
    label: "Devoluciones",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

type DesgloseVentasWaterfallProps = {
  kpis: ReporteKpis;
};

export function DesgloseVentasWaterfall({ kpis }: DesgloseVentasWaterfallProps) {
  const {
    displayData,
    emptyData,
    ventaBruta,
    ventaNeta,
    devoluciones,
    pctDevoluciones,
    hasDevoluciones,
  } = getComposicionVentasData(kpis);

  return (
    <Card className="flex h-full flex-col gap-3 overflow-hidden py-4">
      <CardHeader className="px-4 pb-2">
        <CardTitle className="text-base">Composición de ventas</CardTitle>
        <CardDescription className="text-xs">
          Venta bruta − Devoluciones = Venta neta
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3 px-4 pt-0">
        <ChartContainer config={chartConfig} className="h-[180px] w-full shrink-0">
          <PieChart>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => formatMoney(Number(value))}
                />
              }
            />
            <Pie
              data={displayData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={emptyData ? 0 : 2}
              stroke="var(--background)"
              strokeWidth={2}
            >
              {displayData.map((entry, i) => (
                <Cell key={i} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>

        <div className="flex flex-col items-center gap-0.5 text-center">
          <span className="text-[10px] text-muted-foreground">Venta bruta</span>
          <span className="font-mono text-sm font-semibold">
            {formatMoney(ventaBruta)}
          </span>
        </div>

        <div className="rounded-lg border border-border/60 bg-muted/40 p-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5">
              <div
                className="h-2.5 w-2.5 shrink-0 rounded-sm"
                style={{ backgroundColor: "var(--chart-4)" }}
              />
              <span className="text-muted-foreground">Venta neta:</span>
              <span className="font-mono font-medium">
                {formatMoney(ventaNeta)}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <RotateCcw className="h-3.5 w-3.5 text-chart-2" />
              <span className="text-muted-foreground">Devoluciones:</span>
              <span className="font-mono font-semibold text-chart-2">
                {formatMoney(devoluciones)}
              </span>
              {hasDevoluciones && (
                <span className="text-muted-foreground">
                  ({pctDevoluciones.toFixed(1)}%)
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
