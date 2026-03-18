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
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell } from "recharts";
import { formatMoney, parseNumberLabel } from "@/lib/utils";
import type { ReportePorZonaDetalle } from "@/api/types";
import { FileText } from "lucide-react";

const DOCUMENTO_COLORS = [
  "var(--palette-0)",
  "var(--palette-secondary-blue)",
  "var(--palette-secondary-green)",
  "var(--palette-secondary-orange)",
];

const chartConfig = {
  valor: {
    label: "Cobro",
    color: "var(--palette-0)",
  },
} satisfies ChartConfig;

type MixDocumentosChartProps = {
  reportePorTipoDocumento: ReportePorZonaDetalle | null;
};

export function MixDocumentosChart({ reportePorTipoDocumento }: MixDocumentosChartProps) {
  const datos = reportePorTipoDocumento?.datos ?? [];
  const chartData = datos
    .map((d, i) => ({
      name: d.Etiqueta,
      value: parseNumberLabel(d.Valor),
      fill: DOCUMENTO_COLORS[i % DOCUMENTO_COLORS.length],
    }))
    .sort((a, b) => b.value - a.value);

  const total = chartData.reduce((s, d) => s + d.value, 0);
  const facPct = chartData.find(d => d.name === "FAC")?.value ?? 0;
  const facPorcentaje = total > 0 ? (facPct / total) * 100 : 0;

  return (
    <Card className="flex h-full flex-col gap-3 overflow-hidden py-4">
      <CardHeader className="px-4 pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <FileText className="h-5 w-5 text-palette-0" />
          {reportePorTipoDocumento?.titulo_reporte ?? "Mix de Documentos"}
        </CardTitle>
        <CardDescription className="text-xs">
          Distribución por tipo de documento · Total {formatMoney(total)}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4 px-4 pt-0">
        {chartData.length > 0 ? (
          <>
            <div className="h-[280px] w-full shrink-0">
              <ChartContainer config={chartConfig} className="h-full w-full">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.3} />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                    tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value) => formatMoney(Number(value))}
                      />
                    }
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            </div>

            <div className="rounded-lg border border-border/60 bg-muted/40 overflow-hidden">
              <div className="border-b border-border/60 bg-muted/80 px-3 py-2 text-xs font-semibold text-muted-foreground flex gap-2">
                <span className="flex-1">Tipo</span>
                <span className="w-28 text-right">Monto</span>
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
                      <span className="w-28 text-right text-sm font-mono font-semibold tabular-nums">
                        {formatMoney(d.value)}
                      </span>
                      <span className="w-12 text-right text-xs font-mono tabular-nums text-muted-foreground">
                        {pct.toFixed(1)}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {facPorcentaje > 90 && (
              <div className="rounded-lg bg-palette-0/10 border border-palette-0/30 p-3">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-palette-0" />
                  <p className="text-xs font-medium">
                    FAC representa {facPorcentaje.toFixed(1)}% del total de cobros
                  </p>
                </div>
              </div>
            )}
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
