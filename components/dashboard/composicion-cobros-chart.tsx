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
import { getComposicionCobrosData } from "@/lib/charts/composicion-cobros";
import type { ReporteKpis } from "@/hooks/use-reporte-data";
import { XCircle } from "lucide-react";

const chartConfig = {
  cobroNeto: {
    label: "Cobro neto",
    color: "var(--palette-6)",
  },
  anulaciones: {
    label: "Anulaciones",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;

type ComposicionCobrosChartProps = {
  kpis: ReporteKpis;
};

export function ComposicionCobrosChart({ kpis }: ComposicionCobrosChartProps) {
  const {
    displayData,
    emptyData,
    cobroBruto,
    cobroNeto,
    anulaciones,
    pctAnulaciones,
    hasAnulaciones,
  } = getComposicionCobrosData(kpis);

  return (
    <Card className="flex h-full flex-col gap-3 overflow-hidden py-4">
      <CardHeader className="px-4 pb-2">
        <CardTitle className="text-base">Composición de cobros</CardTitle>
        <CardDescription className="text-xs">
          Cobro bruto − Anulaciones = Cobro neto
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
          <span className="text-[10px] text-muted-foreground">Cobro bruto</span>
          <span className="font-mono text-sm font-semibold">
            {formatMoney(cobroBruto)}
          </span>
        </div>

        <div className="rounded-lg border border-border/60 bg-muted/40 p-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5">
              <div
                className="h-2.5 w-2.5 shrink-0 rounded-sm"
                style={{ backgroundColor: "var(--palette-6)" }}
              />
              <span className="text-muted-foreground">Cobro neto:</span>
              <span className="font-mono font-medium">
                {formatMoney(cobroNeto)}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <XCircle className="h-3.5 w-3.5 text-chart-5" />
              <span className="text-muted-foreground">Anulaciones:</span>
              <span className="font-mono font-semibold text-chart-5">
                {formatMoney(anulaciones)}
              </span>
              {hasAnulaciones && (
                <span className="text-muted-foreground">
                  ({pctAnulaciones.toFixed(1)}%)
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
