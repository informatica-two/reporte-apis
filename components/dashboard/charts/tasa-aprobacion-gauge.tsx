"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber } from "@/lib/utils";
import { cn } from "@/lib/utils";

type TasaAprobacionGaugeProps = {
  aprobados: number;
  denegados: number;
  procesando: number;
};

export function TasaAprobacionGauge({ aprobados, denegados, procesando }: TasaAprobacionGaugeProps) {
  const tasaAprobacion =
    aprobados + denegados > 0
      ? (aprobados / (aprobados + denegados)) * 100
      : 0;

  const getColorClass = (tasa: number) => {
    if (tasa >= 90) return "text-secondary-green";
    if (tasa >= 75) return "text-chart-1";
    if (tasa >= 60) return "text-secondary-orange";
    return "text-palette-0";
  };

  const getStrokeColor = (tasa: number) => {
    if (tasa >= 90) return "var(--palette-secondary-green)";
    if (tasa >= 75) return "var(--chart-1)";
    if (tasa >= 60) return "var(--palette-secondary-orange)";
    return "var(--palette-0)";
  };

  return (
    <Card className="flex h-full flex-col gap-3 overflow-hidden py-4">
      <CardHeader className="px-4 pb-2">
        <CardTitle className="text-base">Tasa de Aprobación</CardTitle>
        <CardDescription className="text-xs">
          Porcentaje de solicitudes aprobadas vs denegadas
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col items-center justify-center pb-4">
        <div className="relative h-64 w-64">
          <svg className="h-full w-full -rotate-90 transform">
            <circle
              cx="128"
              cy="128"
              r="100"
              fill="none"
              stroke="var(--muted)"
              strokeWidth="20"
            />
            <circle
              cx="128"
              cy="128"
              r="100"
              fill="none"
              stroke={getStrokeColor(tasaAprobacion)}
              strokeWidth="20"
              strokeDasharray={`${(tasaAprobacion / 100) * 628} 628`}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className={cn("text-5xl font-bold", getColorClass(tasaAprobacion))}>
              {tasaAprobacion.toFixed(1)}%
            </p>
            <p className="mt-2 text-sm text-muted-foreground">Tasa de Aprobación</p>
          </div>
        </div>

        <div className="mt-6 grid w-full grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-secondary-green">
              {formatNumber(aprobados)}
            </p>
            <p className="text-xs text-muted-foreground">Aprobados</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-secondary-orange">
              {formatNumber(procesando)}
            </p>
            <p className="text-xs text-muted-foreground">En Proceso</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-palette-0">
              {formatNumber(denegados)}
            </p>
            <p className="text-xs text-muted-foreground">Denegados</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
