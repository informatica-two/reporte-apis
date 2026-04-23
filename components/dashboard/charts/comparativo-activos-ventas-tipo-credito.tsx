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
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { formatMoney, formatNumber, parseNumberLabel } from "@/lib/utils";
import type { ReportePorZonaDetalle } from "@/api/types";

const TIPO_CREDITO_LABELS: Record<string, string> = {
  CRE_30: "Crédito 30",
  CRE: "Crédito",
  CON: "Contado",
  EMP: "Empleados",
  OTR: "Otros",
};

const chartConfig = {
  activosPct: {
    label: "Activos %",
    color: "var(--chart-1)",
  },
  ventaPct: {
    label: "Venta %",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

type ComparativoActivosVentasTipoCreditoProps = {
  activosPorTipoCredito: ReportePorZonaDetalle | null;
  ventaPorTipoCredito: ReportePorZonaDetalle | null;
};

export function ComparativoActivosVentasTipoCredito({
  activosPorTipoCredito,
  ventaPorTipoCredito,
}: ComparativoActivosVentasTipoCreditoProps) {
  const activosMap = new Map(
    (activosPorTipoCredito?.datos ?? []).map((d) => [
      d.Etiqueta,
      parseNumberLabel(d.Valor),
    ])
  );
  const ventaMap = new Map(
    (ventaPorTipoCredito?.datos ?? []).map((d) => [
      d.Etiqueta,
      parseNumberLabel(d.Valor),
    ])
  );

  const totalActivos = [...activosMap.values()].reduce((a, b) => a + b, 0);
  const totalVenta = [...ventaMap.values()].reduce((a, b) => a + b, 0);

  const tipos = Array.from(
    new Set([...activosMap.keys(), ...ventaMap.keys()])
  ).filter((t) => !t.includes("#EMP") && !t.includes("#OTR"));

  const chartData = tipos
    .map((tipo) => {
      const activos = activosMap.get(tipo) ?? 0;
      const venta = ventaMap.get(tipo) ?? 0;
      return {
        name: TIPO_CREDITO_LABELS[tipo] ?? tipo,
        tipo,
        activos,
        venta,
        activosPct: totalActivos > 0 ? (activos / totalActivos) * 100 : 0,
        ventaPct: totalVenta > 0 ? (venta / totalVenta) * 100 : 0,
      };
    })
    .filter((d) => d.activos > 0 || d.venta > 0)
    .sort((a, b) => b.activosPct - a.activosPct);

  if (chartData.length === 0) return null;

  return (
    <Card className="flex h-full flex-col gap-3 overflow-hidden py-4">
      <CardHeader className="px-4 pb-2">
        <CardTitle className="text-base">
          Comparativo activos vs ventas por tipo de crédito
        </CardTitle>
        <CardDescription className="text-xs">
          Concentración en cartera y en venta. Si Crédito 30 domina en ambos,
          la operación está muy concentrada.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4 px-4 pt-0">
        <div className="h-[300px] w-full shrink-0">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <BarChart
              data={chartData}
              margin={{ top: 8, right: 8, left: 8, bottom: 24 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name) => [
                      `${Number(value).toFixed(1)}%`,
                      name === "activosPct" ? "Activos" : "Venta",
                    ]}
                  />
                }
              />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(v) => `${v}%`}
                domain={[0, 100]}
                tick={{ fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={36}
              />
              <Bar
                dataKey="activosPct"
                name="Activos %"
                fill="var(--chart-1)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="ventaPct"
                name="Venta %"
                fill="var(--chart-2)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </div>
        <div className="rounded-lg border border-border/60 bg-muted/40 overflow-hidden">
          <div className="max-h-[140px] overflow-y-auto">
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-muted/80 backdrop-blur">
                <tr className="border-b border-border/60">
                  <th className="px-3 py-2 text-left font-medium text-muted-foreground">
                    Tipo
                  </th>
                  <th className="px-3 py-2 text-right font-medium text-muted-foreground">
                    Activos
                  </th>
                  <th className="px-3 py-2 text-right font-medium text-muted-foreground">
                    Venta
                  </th>
                  <th className="px-3 py-2 text-right font-medium text-muted-foreground">
                    % Activos
                  </th>
                  <th className="px-3 py-2 text-right font-medium text-muted-foreground">
                    % Venta
                  </th>
                </tr>
              </thead>
              <tbody>
                {chartData.map((d) => (
                  <tr
                    key={d.tipo}
                    className="border-b border-border/40 last:border-0 hover:bg-muted/60"
                  >
                    <td className="px-3 py-1.5 font-medium">{d.name}</td>
                    <td className="px-3 py-1.5 text-right tabular-nums">
                      {formatNumber(d.activos)}
                    </td>
                    <td className="px-3 py-1.5 text-right tabular-nums">
                      {formatMoney(d.venta)}
                    </td>
                    <td className="px-3 py-1.5 text-right tabular-nums text-chart-1">
                      {d.activosPct.toFixed(1)}%
                    </td>
                    <td className="px-3 py-1.5 text-right tabular-nums text-chart-2">
                      {d.ventaPct.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
