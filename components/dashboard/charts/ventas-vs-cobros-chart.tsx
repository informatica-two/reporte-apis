"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  XAxis,
  YAxis,
} from "recharts";
import { formatMoney } from "@/lib/utils";
import {
  formatRatio,
  getVentasVsCobrosChartData,
  getVentasVsCobrosInsights,
  getRatioVariant,
} from "@/lib/charts/ventas-vs-cobros";
import type { ReporteKpis } from "@/hooks/use-reporte-data";
import { TrendingUp, TrendingDown, Minus, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

const chartConfig = {
  valor: {
    label: "Monto",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

const RATIO_ICONS = {
  up: TrendingUp,
  down: TrendingDown,
  neutral: Minus,
} as const;

type VentasVsCobrosChartProps = {
  kpis: ReporteKpis;
};

export function VentasVsCobrosChart({ kpis }: VentasVsCobrosChartProps) {
  const chartData = getVentasVsCobrosChartData(kpis);
  const insights = getVentasVsCobrosInsights(kpis);
  const ratio = kpis.ratioCobrosVentas;
  const variant = getRatioVariant(ratio);
  const RatioIcon = RATIO_ICONS[variant];

  return (
    <Card className="flex h-full flex-col gap-3 overflow-hidden py-4">
      <CardHeader className="px-4 pb-2">
        <CardTitle className="text-base">Ventas vs Cobros</CardTitle>
        <CardDescription className="text-xs">
          Venta neta vs cobro neto y ratio del período
        </CardDescription>
        <CardAction
          className={cn(
            "flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs",
            variant === "up" && "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
            variant === "down" && "bg-amber-500/10 text-amber-700 dark:text-amber-400",
            variant === "neutral" && "bg-muted text-muted-foreground"
          )}
        >
          <RatioIcon className="h-3 w-3" />
          <span className="font-mono font-medium tabular-nums">
            {formatRatio(ratio)}
          </span>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3 px-4 pt-0">
        <ChartContainer config={chartConfig} className="h-[180px] w-full shrink-0">
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12, top: 12, bottom: 12 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(v) => formatMoney(v)}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => formatMoney(Number(value))}
                />
              }
            />
            <Bar dataKey="valor" radius={[4, 4, 0, 0]} name="Monto">
              {chartData.map((_, i) => (
                <Cell
                  key={i}
                  fill={i === 0 ? "var(--chart-1)" : "var(--chart-2)"}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>

        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div
              className="h-2.5 w-2.5 shrink-0 rounded-sm"
              style={{ backgroundColor: "var(--chart-1)" }}
            />
            <span className="text-muted-foreground">Venta neta:</span>
            <span className="font-mono font-medium">
              {formatMoney(kpis.ventaNeta)}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div
              className="h-2.5 w-2.5 shrink-0 rounded-sm"
              style={{ backgroundColor: "var(--chart-2)" }}
            />
            <span className="text-muted-foreground">Cobro neto:</span>
            <span className="font-mono font-medium">
              {formatMoney(kpis.cobroNeto)}
            </span>
          </div>
        </div>

        <div className="rounded-lg border border-border/60 bg-muted/40 p-2.5">
          <div className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-foreground">
            <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
            Insights
          </div>
          <ul className="space-y-0.5 text-xs text-muted-foreground">
            {insights.map((insight, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-amber-500/80">•</span>
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
