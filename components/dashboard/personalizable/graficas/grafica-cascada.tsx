"use client";

import {
  ChartContainer,
  type ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";
import type { DatoGrafica, FormatoValor } from "@/config/dashboard-personalizable";
import { formatearValor } from "../formato-valor";

type DatoCascada = {
  etiqueta: string;
  base: number;
  arriba: number;
  abajo: number;
  valorOriginal: number;
  positivo: boolean;
};

function construirCascada(datos: DatoGrafica[]): DatoCascada[] {
  let acumulado = 0;
  return datos.map((d) => {
    const positivo = d.valor >= 0;
    const base = positivo ? acumulado : acumulado + d.valor;
    const resultado: DatoCascada = {
      etiqueta: d.etiqueta,
      base,
      arriba: positivo ? d.valor : 0,
      abajo: positivo ? 0 : Math.abs(d.valor),
      valorOriginal: d.valor,
      positivo,
    };
    acumulado += d.valor;
    return resultado;
  });
}

const chartConfig = {
  arriba: { label: "Positivo", color: "var(--chart-1)" },
  abajo: { label: "Negativo", color: "var(--chart-5)" },
} satisfies ChartConfig;

type GraficaCascadaProps = {
  datos: DatoGrafica[];
  formatoValor?: FormatoValor;
};

export function GraficaCascada({ datos, formatoValor = "moneda" }: GraficaCascadaProps) {
  const datosCascada = construirCascada(datos);

  return (
    <ChartContainer config={chartConfig} className="h-[220px] w-full">
      <BarChart
        accessibilityLayer
        data={datosCascada}
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
        {/* Tooltip personalizado */}
        <Bar
          dataKey="base"
          stackId="cascada"
          fill="transparent"
          radius={0}
          legendType="none"
        />
        <Bar dataKey="arriba" stackId="cascada" radius={[4, 4, 0, 0]}>
          {datosCascada.map((d, i) => (
            <Cell key={`up-${i}`} fill={d.positivo ? "var(--chart-1)" : "transparent"} />
          ))}
        </Bar>
        <Bar dataKey="abajo" stackId="abajo" radius={[4, 4, 0, 0]}>
          {datosCascada.map((d, i) => (
            <Cell key={`down-${i}`} fill={!d.positivo ? "var(--chart-5)" : "transparent"} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
