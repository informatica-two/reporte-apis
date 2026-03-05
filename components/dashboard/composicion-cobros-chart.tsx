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
import type { PieLabelRenderProps } from "recharts";
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

const CENTER_LABEL_LINE_HEIGHT = 12;

function renderCenterLabel(pct: number, label: string, fillClass: string) {
  return function CenterLabel(props: PieLabelRenderProps) {
    const { cx, cy, index } = props;
    if (cx == null || cy == null || index !== 0) return null;
    const cxy = Number(cy);
    return (
      <g>
        <text
          x={cx}
          y={cxy - CENTER_LABEL_LINE_HEIGHT / 2}
          textAnchor="middle"
          dominantBaseline="central"
          className={`font-mono text-lg font-semibold tabular-nums ${fillClass}`}
        >
          {pct.toFixed(1)}%
        </text>
        <text
          x={cx}
          y={cxy + CENTER_LABEL_LINE_HEIGHT / 2}
          textAnchor="middle"
          dominantBaseline="central"
          className="text-[10px]"
          style={{ fill: "var(--muted-foreground)" }}
        >
          {label}
        </text>
      </g>
    );
  };
}

export function ComposicionCobrosChart({ kpis }: ComposicionCobrosChartProps) {
  const {
    displayData,
    emptyData,
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
        <div className="relative h-[180px] w-full shrink-0">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <PieChart>
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, _name, item) => {
                      const actual = (item?.payload as { actualValue?: number })
                        ?.actualValue;
                      return formatMoney(actual ?? Number(value));
                    }}
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
                label={
                  !emptyData
                    ? renderCenterLabel(
                        pctAnulaciones,
                        "anulaciones",
                        "fill-chart-5"
                      )
                    : false
                }
                labelLine={false}
              >
                {displayData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
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
