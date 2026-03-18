"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import type { DatoGrafica, FormatoValor } from "@/config/dashboard-personalizable";
import { formatearValor } from "../formato-valor";

type GraficaLineaProps = {
  datos: DatoGrafica[];
  formatoValor?: FormatoValor;
  etiquetaValor?: string;
  etiquetaValor2?: string;
};

export function GraficaLinea({
  datos,
  formatoValor = "numero",
  etiquetaValor = "Valor",
  etiquetaValor2,
}: GraficaLineaProps) {
  const tieneDosSeries = datos.some((d) => d.valor2 !== undefined);

  const chartConfig: ChartConfig = {
    valor: { label: etiquetaValor, color: "var(--chart-1)" },
    ...(tieneDosSeries
      ? { valor2: { label: etiquetaValor2 ?? "Valor 2", color: "var(--chart-2)" } }
      : {}),
  };

  return (
    <ChartContainer config={chartConfig} className="h-[220px] w-full">
      <LineChart
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
        <Line
          type="monotone"
          dataKey="valor"
          stroke="var(--chart-1)"
          strokeWidth={2}
          dot={{ r: 3, fill: "var(--chart-1)" }}
          activeDot={{ r: 5 }}
          name={etiquetaValor}
        />
        {tieneDosSeries && (
          <Line
            type="monotone"
            dataKey="valor2"
            stroke="var(--chart-2)"
            strokeWidth={2}
            dot={{ r: 3, fill: "var(--chart-2)" }}
            activeDot={{ r: 5 }}
            name={etiquetaValor2 ?? "Valor 2"}
          />
        )}
      </LineChart>
    </ChartContainer>
  );
}
