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
import { formatNumber, parseNumberLabel } from "@/lib/utils";
import type { ReportePorZonaDetalle } from "@/api/types";
import { Shield, AlertCircle, CheckCircle } from "lucide-react";

const chartConfig = {
  valor: {
    label: "Activos",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

type PerfilRiesgoActivosProps = {
  reportePorRango: ReportePorZonaDetalle | null;
};

export function PerfilRiesgoActivos({ reportePorRango }: PerfilRiesgoActivosProps) {
  const datos = reportePorRango?.datos ?? [];
  
  const bajoRiesgo = datos
    .filter(d => d.Etiqueta.includes("<= a $30") || d.Etiqueta.includes("<= a $125"))
    .reduce((s, d) => s + parseNumberLabel(d.Valor), 0);
  
  const medioRiesgo = datos
    .filter(d => d.Etiqueta.includes("<= a $250"))
    .reduce((s, d) => s + parseNumberLabel(d.Valor), 0);
  
  const altoRiesgo = datos
    .filter(d => d.Etiqueta.includes("> a $250"))
    .reduce((s, d) => s + parseNumberLabel(d.Valor), 0);

  const total = bajoRiesgo + medioRiesgo + altoRiesgo;

  const chartData = [
    {
      name: "Bajo Riesgo (<$125)",
      value: bajoRiesgo,
      fill: "var(--palette-secondary-green)",
      descripcion: "Tickets pequeños, fácil recuperación",
    },
    {
      name: "Medio Riesgo ($125-$250)",
      value: medioRiesgo,
      fill: "var(--palette-secondary-blue)",
      descripcion: "Tickets medianos, seguimiento estándar",
    },
    {
      name: "Alto Riesgo (>$250)",
      value: altoRiesgo,
      fill: "var(--palette-secondary-orange)",
      descripcion: "Tickets grandes, requiere atención",
    },
  ].filter(d => d.value > 0);

  const pctBajoRiesgo = total > 0 ? (bajoRiesgo / total) * 100 : 0;
  const perfilSaludable = pctBajoRiesgo > 70;

  return (
    <Card className="flex h-full flex-col gap-3 overflow-hidden py-4">
      <CardHeader className="px-4 pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Shield className="h-5 w-5 text-palette-0" />
          Perfil de Riesgo por Ticket
        </CardTitle>
        <CardDescription className="text-xs">
          Clasificación de activos por monto · Total {formatNumber(total)} activos
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4 px-4 pt-0">
        {chartData.length > 0 ? (
          <>
            <div className="h-[240px] w-full shrink-0">
              <ChartContainer config={chartConfig} className="h-full w-full">
                <PieChart>
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value) => `${formatNumber(Number(value))} activos`}
                      />
                    }
                  />
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={85}
                    paddingAngle={4}
                    stroke="var(--background)"
                    strokeWidth={2}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
            </div>

            <div className="space-y-2">
              {chartData.map((d, i) => {
                const pct = total > 0 ? (d.value / total) * 100 : 0;
                return (
                  <div
                    key={i}
                    className="rounded-lg border border-border/40 bg-muted/20 p-3"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full shrink-0"
                          style={{ backgroundColor: d.fill }}
                        />
                        <span className="text-sm font-semibold">{d.name}</span>
                      </div>
                      <span className="text-sm font-bold">{formatNumber(d.value)}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{d.descripcion}</span>
                      <span className="font-mono tabular-nums text-muted-foreground">{pct.toFixed(1)}%</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Evaluación del perfil */}
            {perfilSaludable ? (
              <div className="rounded-lg bg-secondary-green/10 border border-secondary-green/30 p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-secondary-green shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-secondary-green">
                      Perfil de bajo riesgo
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {pctBajoRiesgo.toFixed(1)}% de los activos son de bajo riesgo. Cartera bien diversificada con tickets manejables.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-lg bg-secondary-orange/10 border border-secondary-orange/30 p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-secondary-orange shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-secondary-orange">
                      Perfil de riesgo elevado
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatNumber(altoRiesgo)} activos de alto riesgo (&gt;$250). Considera estrategias de cobro prioritario.
                    </p>
                  </div>
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
