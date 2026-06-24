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
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { formatMoney } from "@/lib/utils";
import type { VentaCobroPorZonaDetalle } from "@/api/types";

const chartConfig = {
  venta: {
    label: "Venta (facturado)",
    color: "var(--chart-1)",
  },
  cobro: {
    label: "Cobro (recaudado)",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export type ReporteVentaCobroBarrasCardProps = {
  reporte: VentaCobroPorZonaDetalle | null;
  tituloFallback: string;
  /** Nombre de la columna de la tabla (ej. "División", "Zona") */
  columnaEtiqueta?: string;
};

/**
 * Tarjeta genérica para reportes con estructura Etiqueta + venta_neta + cobrado
 * (ej. venta/detalle_6 por zona, venta/detalle_7 por división).
 * Muestra barras comparativas Venta vs Cobro y una tabla con la diferencia.
 */
export function ReporteVentaCobroBarrasCard({
  reporte,
  tituloFallback,
  columnaEtiqueta = "Etiqueta",
}: ReporteVentaCobroBarrasCardProps) {
  const datos = reporte?.datos ?? [];

  const chartData = datos
    .map((d) => ({
      name: d.Etiqueta,
      venta: d.venta_neta,
      cobro: d.cobrado,
      diferencia: d.venta_neta - d.cobrado,
    }))
    .filter((d) => d.venta > 0 || d.cobro > 0)
    .sort((a, b) => b.venta - a.venta);

  const totalVenta = chartData.reduce((s, d) => s + d.venta, 0);
  const totalCobro = chartData.reduce((s, d) => s + d.cobro, 0);

  return (
    <Card className="flex h-full flex-col gap-3 overflow-hidden py-4">
      <CardHeader className="px-4 pb-2">
        <CardTitle className="text-base">
          {reporte?.titulo_reporte ?? tituloFallback}
        </CardTitle>
        <div className="mt-2 flex flex-wrap items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5">
            <span
              className="h-3 w-3 shrink-0 rounded-sm"
              style={{ backgroundColor: "var(--chart-1)" }}
              aria-hidden
            />
            <span className="text-muted-foreground">
              <strong className="text-foreground">Venta</strong> (facturado)
            </span>
            <span className="tabular-nums text-foreground">
              {formatMoney(totalVenta)}
            </span>
          </span>
          <span className="flex items-center gap-1.5">
            <span
              className="h-3 w-3 shrink-0 rounded-sm"
              style={{ backgroundColor: "var(--chart-2)" }}
              aria-hidden
            />
            <span className="text-muted-foreground">
              <strong className="text-foreground">Cobro</strong> (recaudado)
            </span>
            <span className="tabular-nums text-foreground">
              {formatMoney(totalCobro)}
            </span>
          </span>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4 px-4 pt-0">
        {chartData.length > 0 ? (
          <>
            <div className="h-[280px] w-full shrink-0">
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
                          formatMoney(Number(value)),
                          name === "venta" ? "Venta (facturado)" : "Cobro (recaudado)",
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
                    tickFormatter={(v) => formatMoney(v)}
                    tick={{ fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    width={72}
                  />
                  <Bar
                    dataKey="venta"
                    name="Venta (facturado)"
                    fill="var(--chart-1)"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="cobro"
                    name="Cobro (recaudado)"
                    fill="var(--chart-2)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/40 overflow-hidden">
              <div className="max-h-[180px] overflow-y-auto">
                <table className="w-full text-xs">
                  <thead className="sticky top-0 bg-muted/80 backdrop-blur">
                    <tr className="border-b border-border/60">
                      <th className="px-3 py-2 text-left font-medium text-muted-foreground">
                        {columnaEtiqueta}
                      </th>
                      <th className="px-3 py-2 text-right font-medium text-muted-foreground">
                        Venta (facturado)
                      </th>
                      <th className="px-3 py-2 text-right font-medium text-muted-foreground">
                        Cobro (recaudado)
                      </th>
                      <th
                        className="px-3 py-2 text-right font-medium text-muted-foreground"
                        title="Venta − Cobro: positivo = falta por cobrar"
                      >
                        Diferencia
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {chartData.map((d) => (
                      <tr
                        key={d.name}
                        className="border-b border-border/40 last:border-0 hover:bg-muted/60"
                      >
                        <td className="px-3 py-1.5 font-medium">{d.name}</td>
                        <td className="px-3 py-1.5 text-right tabular-nums">
                          {formatMoney(d.venta)}
                        </td>
                        <td className="px-3 py-1.5 text-right tabular-nums">
                          {formatMoney(d.cobro)}
                        </td>
                        <td
                          className={`px-3 py-1.5 text-right tabular-nums ${
                            d.diferencia > 0
                              ? "text-palette-0"
                              : d.diferencia < 0
                                ? "text-secondary-green"
                                : "text-muted-foreground"
                          }`}
                        >
                          {formatMoney(d.diferencia)}
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
