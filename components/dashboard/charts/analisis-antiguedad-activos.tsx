"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatNumber, parseNumberLabel } from "@/lib/utils";
import type { ReportePorZonaDetalle } from "@/api/types";
import { Clock, AlertTriangle, CheckCircle, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";

type AnalisisAntiguedadActivosProps = {
  reportePorAnio: ReportePorZonaDetalle | null;
};

export function AnalisisAntiguedadActivos({ reportePorAnio }: AnalisisAntiguedadActivosProps) {
  const datos = reportePorAnio?.datos ?? [];
  const anios = datos
    .filter(d => !d.Etiqueta.includes("EMP") && !d.Etiqueta.includes("OTR"))
    .map(d => ({
      anio: parseInt(d.Etiqueta),
      count: parseNumberLabel(d.Valor),
    }))
    .filter(d => !isNaN(d.anio))
    .sort((a, b) => a.anio - b.anio);

  const total = anios.reduce((s, d) => s + d.count, 0);
  const currentYear = new Date().getFullYear();

  const recientes = anios.filter(d => d.anio >= currentYear - 3).reduce((s, d) => s + d.count, 0);
  const medios = anios.filter(d => d.anio >= currentYear - 5 && d.anio < currentYear - 3).reduce((s, d) => s + d.count, 0);
  const antiguos = anios.filter(d => d.anio < currentYear - 5).reduce((s, d) => s + d.count, 0);

  const pctRecientes = total > 0 ? (recientes / total) * 100 : 0;
  const pctMedios = total > 0 ? (medios / total) * 100 : 0;
  const pctAntiguos = total > 0 ? (antiguos / total) * 100 : 0;

  const edadPromedio = anios.length > 0
    ? anios.reduce((sum, d) => sum + ((currentYear - d.anio) * d.count), 0) / total
    : 0;

  const necesitaAtencion = pctAntiguos > 30;

  return (
    <Card className="flex h-full flex-col gap-3 overflow-hidden py-4">
      <CardHeader className="px-4 pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Clock className="h-5 w-5 text-palette-0" />
          Análisis de Antigüedad de Cartera
        </CardTitle>
        <CardDescription className="text-xs">
          Distribución por edad de activos · Total {formatNumber(total)} activos
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4 px-4 pt-0">
        {anios.length > 0 ? (
          <>
            {/* Edad promedio */}
            <div className="rounded-lg border-2 border-palette-0/30 bg-palette-0/5 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Edad Promedio de Cartera</p>
                  <p className="text-3xl font-bold text-palette-0">{edadPromedio.toFixed(1)} años</p>
                </div>
                <Clock className="h-10 w-10 text-palette-0/40" />
              </div>
            </div>

            {/* Distribución por antigüedad */}
            <div className="space-y-3">
              {/* Recientes */}
              <div className="rounded-lg border border-secondary-green/40 bg-secondary-green/5 p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-secondary-green" />
                    <span className="text-sm font-semibold">Recientes (0-3 años)</span>
                  </div>
                  <span className="text-sm font-bold text-secondary-green">{formatNumber(recientes)}</span>
                </div>
                <Progress value={pctRecientes} className="h-2 mb-1" />
                <p className="text-xs text-muted-foreground">{pctRecientes.toFixed(1)}% del total</p>
              </div>

              {/* Medios */}
              <div className="rounded-lg border border-palette-1/40 bg-palette-1/5 p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-palette-1" />
                    <span className="text-sm font-semibold">Medios (3-5 años)</span>
                  </div>
                  <span className="text-sm font-bold text-palette-1">{formatNumber(medios)}</span>
                </div>
                <Progress value={pctMedios} className="h-2 mb-1" />
                <p className="text-xs text-muted-foreground">{pctMedios.toFixed(1)}% del total</p>
              </div>

              {/* Antiguos */}
              <div className="rounded-lg border border-secondary-orange/40 bg-secondary-orange/5 p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-secondary-orange" />
                    <span className="text-sm font-semibold">Antiguos (&gt;5 años)</span>
                  </div>
                  <span className="text-sm font-bold text-secondary-orange">{formatNumber(antiguos)}</span>
                </div>
                <Progress value={pctAntiguos} className="h-2 mb-1" />
                <p className="text-xs text-muted-foreground">{pctAntiguos.toFixed(1)}% del total</p>
              </div>
            </div>

            {/* Alerta si hay muchos antiguos */}
            {necesitaAtencion && (
              <div className="rounded-lg bg-secondary-orange/10 border border-secondary-orange/30 p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-secondary-orange shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-secondary-orange">
                      Cartera con alta antigüedad
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {pctAntiguos.toFixed(1)}% de los activos tienen más de 5 años. Considera estrategias de renovación o cobro.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {!necesitaAtencion && pctRecientes > 50 && (
              <div className="rounded-lg bg-secondary-green/10 border border-secondary-green/30 p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-secondary-green shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-secondary-green">
                      Cartera saludable
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {pctRecientes.toFixed(1)}% de los activos son recientes (0-3 años). Buena renovación de cartera.
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
