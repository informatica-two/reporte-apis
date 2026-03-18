"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Cell, Pie, PieChart } from "recharts";
import type { DatoGrafica, FormatoValor } from "@/config/dashboard-personalizable";
import { formatearValor } from "../formato-valor";

const COLORES = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

type GraficaPastelProps = {
  datos: DatoGrafica[];
  formatoValor?: FormatoValor;
};

export function GraficaPastel({ datos, formatoValor = "numero" }: GraficaPastelProps) {
  const chartConfig: ChartConfig = Object.fromEntries(
    datos.map((d, i) => [
      d.etiqueta,
      { label: d.etiqueta, color: d.color ?? COLORES[i % COLORES.length] },
    ])
  );

  const datosConColor = datos.map((d, i) => ({
    ...d,
    fill: d.color ?? COLORES[i % COLORES.length],
    name: d.etiqueta,
    value: d.valor,
  }));

  const total = datos.reduce((sum, d) => sum + d.valor, 0);

  return (
    <div className="flex flex-col gap-3">
      <ChartContainer config={chartConfig} className="h-[200px] w-full">
        <PieChart>
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value) => formatearValor(Number(value), formatoValor)}
              />
            }
          />
          <Pie
            data={datosConColor}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={2}
            stroke="var(--background)"
            strokeWidth={2}
            labelLine={false}
          >
            {datosConColor.map((entry, i) => (
              <Cell key={i} fill={entry.fill} />
            ))}
          </Pie>
        </PieChart>
      </ChartContainer>

      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-xs">
        {datos.map((d, i) => {
          const pct = total > 0 ? ((d.valor / total) * 100).toFixed(1) : "0.0";
          return (
            <div key={i} className="flex items-center gap-1.5">
              <div
                className="h-2.5 w-2.5 shrink-0 rounded-sm"
                style={{ backgroundColor: d.color ?? COLORES[i % COLORES.length] }}
              />
              <span className="text-muted-foreground">{d.etiqueta}:</span>
              <span className="font-mono font-medium">
                {formatearValor(d.valor, formatoValor)}
              </span>
              <span className="text-muted-foreground">({pct}%)</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
