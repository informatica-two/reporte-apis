"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";
import type { DatoGrafica, FormatoValor } from "@/config/dashboard-personalizable";
import { formatearValor } from "../formato-valor";

type GraficaBarrasProps = {
  datos: DatoGrafica[];
  formatoValor?: FormatoValor;
  etiquetaValor?: string;
  etiquetaValor2?: string;
};

export function GraficaBarras({
  datos,
  formatoValor = "numero",
  etiquetaValor = "Valor",
  etiquetaValor2,
}: GraficaBarrasProps) {
  const tieneDosSeries = datos.some((d) => d.valor2 !== undefined);

  const chartConfig: ChartConfig = {
    valor: { label: etiquetaValor, color: "var(--chart-1)" },
    ...(tieneDosSeries
      ? { valor2: { label: etiquetaValor2 ?? "Valor 2", color: "var(--chart-2)" } }
      : {}),
  };

  return (
    <ChartContainer config={chartConfig} className="h-[220px] w-full">
      <BarChart
        accessibilityLayer
        data={datos}
        margin={{ left: 8, right: 8, top: 8, bottom: 8 }}
      >
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
        <Bar dataKey="valor" radius={[4, 4, 0, 0]} name={etiquetaValor}>
          {datos.map((d, i) => (
            <Cell key={i} fill={d.color ?? (i % 2 === 0 ? "var(--chart-1)" : "var(--chart-2)")} />
          ))}
        </Bar>
        {tieneDosSeries && (
          <Bar
            dataKey="valor2"
            radius={[4, 4, 0, 0]}
            name={etiquetaValor2 ?? "Valor 2"}
            fill="var(--chart-2)"
          />
        )}
      </BarChart>
    </ChartContainer>
  );
}
