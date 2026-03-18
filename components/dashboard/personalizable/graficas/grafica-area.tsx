"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import type { DatoGrafica, FormatoValor } from "@/config/dashboard-personalizable";
import { formatearValor } from "../formato-valor";

type GraficaAreaProps = {
  datos: DatoGrafica[];
  formatoValor?: FormatoValor;
  etiquetaValor?: string;
  etiquetaValor2?: string;
};

export function GraficaArea({
  datos,
  formatoValor = "numero",
  etiquetaValor = "Valor",
  etiquetaValor2,
}: GraficaAreaProps) {
  const tieneDosSeries = datos.some((d) => d.valor2 !== undefined);

  const chartConfig: ChartConfig = {
    valor: { label: etiquetaValor, color: "var(--chart-1)" },
    ...(tieneDosSeries
      ? { valor2: { label: etiquetaValor2 ?? "Valor 2", color: "var(--chart-2)" } }
      : {}),
  };

  return (
    <ChartContainer config={chartConfig} className="h-[220px] w-full">
      <AreaChart
        accessibilityLayer
        data={datos}
        margin={{ left: 8, right: 8, top: 8, bottom: 8 }}
      >
        <defs>
          <linearGradient id="gradValor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0.05} />
          </linearGradient>
          {tieneDosSeries && (
            <linearGradient id="gradValor2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0.05} />
            </linearGradient>
          )}
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="etiqueta"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tick={{ fontSize: 11 }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tick={{ fontSize: 11 }}
          tickFormatter={(v) => formatearValor(v, formatoValor, true)}
          width={60}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value) => formatearValor(Number(value), formatoValor)}
            />
          }
        />
        <Area
          type="monotone"
          dataKey="valor"
          stroke="var(--chart-1)"
          strokeWidth={2}
          fill="url(#gradValor)"
          name={etiquetaValor}
          dot={{ r: 3, fill: "var(--chart-1)" }}
          activeDot={{ r: 5 }}
        />
        {tieneDosSeries && (
          <Area
            type="monotone"
            dataKey="valor2"
            stroke="var(--chart-2)"
            strokeWidth={2}
            fill="url(#gradValor2)"
            name={etiquetaValor2 ?? "Valor 2"}
            dot={{ r: 3, fill: "var(--chart-2)" }}
            activeDot={{ r: 5 }}
          />
        )}
      </AreaChart>
    </ChartContainer>
  );
}
