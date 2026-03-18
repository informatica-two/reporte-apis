"use client";

import {
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  Target,
  Award,
  Package,
  CreditCard,
  MapPin,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatMoney, formatPercent } from "@/lib/utils";
import type { VentasKpis } from "@/hooks/use-ventas-kpis";
import { cn } from "@/lib/utils";

type VentasKpiCardsProps = {
  kpis: VentasKpis;
};

export function VentasKpiCards({ kpis }: VentasKpiCardsProps) {
  const cumplimientoColor =
    kpis.cumplimientoMeta >= 100
      ? "text-secondary-green"
      : kpis.cumplimientoMeta >= 80
        ? "text-secondary-orange"
        : "text-palette-0";

  return (
    <div className="space-y-6">
      {/* Hero Card - Venta Neta con progreso de meta */}
      <Card className="overflow-hidden border-2 border-palette-0/20 bg-linear-to-br from-palette-5/30 to-palette-neutral dark:from-palette-0/10 dark:to-transparent">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Venta Neta del Período
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-4xl font-bold tracking-tight text-palette-0">
                  {formatMoney(kpis.ventaNeta)}
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-muted-foreground">
                    Bruta:{" "}
                    <span className="font-semibold text-foreground">
                      {formatMoney(kpis.ventaBruta)}
                    </span>
                  </span>
                  <span className="flex items-center gap-1 text-palette-2">
                    <TrendingDown className="h-3.5 w-3.5" />
                    {formatMoney(kpis.devoluciones)} (
                    {formatPercent(kpis.pctDevoluciones)})
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className={cn("text-3xl font-bold", cumplimientoColor)}>
                {formatPercent(kpis.cumplimientoMeta)}
              </div>
              <p className="text-xs text-muted-foreground">de la meta</p>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Progreso hacia meta: {formatMoney(kpis.metaMes)}</span>
              <span>{kpis.dias} días</span>
            </div>
            <Progress
              value={Math.min(kpis.cumplimientoMeta, 100)}
              className="h-2 bg-palette-5"
            />
          </div>
        </CardContent>
      </Card>

      {/* Grid de métricas secundarias */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Venta Promedio Diaria */}
        <Card className="border-l-4 border-l-secondary-green">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">
                  Venta Promedio Diaria
                </p>
                <p className="text-2xl font-bold text-secondary-green">
                  {formatMoney(kpis.ventaPromedioDia)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Meta:{" "}
                  <span className="font-semibold">
                    {formatMoney(kpis.metaDiaria)}
                  </span>
                </p>
              </div>
              <div className="rounded-full bg-secondary-green/10 p-3">
                <TrendingUp className="h-6 w-6 text-secondary-green" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Devoluciones */}
        <Card className="border-l-4 border-l-palette-2">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">
                  Devoluciones
                </p>
                <p className="text-2xl font-bold text-palette-2">
                  {formatMoney(kpis.devoluciones)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatPercent(kpis.pctDevoluciones)} del total
                </p>
              </div>
              <div className="rounded-full bg-palette-2/10 p-3">
                <TrendingDown className="h-6 w-6 text-palette-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cumplimiento */}
        <Card className="border-l-4 border-l-palette-1">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">
                  Cumplimiento Meta
                </p>
                <p className={cn("text-2xl font-bold", cumplimientoColor)}>
                  {formatPercent(kpis.cumplimientoMeta)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {kpis.cumplimientoMeta >= 100
                    ? "Meta alcanzada"
                    : "En progreso"}
                </p>
              </div>
              <div className="rounded-full bg-palette-1/10 p-3">
                <Target className="h-6 w-6 text-palette-1" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performers */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Award className="h-5 w-5 text-palette-0" />
            Top Performers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {kpis.zonaTop && (
              <div className="space-y-2 rounded-lg border border-secondary-blue/30 bg-secondary-blue/5 p-3">
                <div className="flex items-center gap-2">
                  <div className="rounded-md bg-secondary-blue/20 p-1.5">
                    <MapPin className="h-4 w-4 text-secondary-blue" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">
                    Zona
                  </span>
                </div>
                <div>
                  <p className="font-bold text-lg text-palette-0">{kpis.zonaTop.nombre}</p>
                  <p className="text-sm font-semibold text-foreground">
                    {formatMoney(kpis.zonaTop.valor)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {kpis.totalZonas} zonas activas
                  </p>
                </div>
              </div>
            )}

            {kpis.impulsadoraTop && (
              <div className="space-y-2 rounded-lg border border-secondary-green/30 bg-secondary-green/5 p-3">
                <div className="flex items-center gap-2">
                  <div className="rounded-md bg-secondary-green/20 p-1.5">
                    <Award className="h-4 w-4 text-secondary-green" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">
                    Impulsadora
                  </span>
                </div>
                <div>
                  <p className="font-bold text-lg text-palette-0">
                    {kpis.impulsadoraTop.nombre}
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    {formatMoney(kpis.impulsadoraTop.valor)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {kpis.totalImpulsadoras} impulsadoras
                  </p>
                </div>
              </div>
            )}

            {kpis.lineaTop && (
              <div className="space-y-2 rounded-lg border border-palette-1/30 bg-palette-1/5 p-3">
                <div className="flex items-center gap-2">
                  <div className="rounded-md bg-palette-1/20 p-1.5">
                    <Package className="h-4 w-4 text-palette-1" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">
                    Línea
                  </span>
                </div>
                <div>
                  <p className="font-bold text-lg text-palette-0">{kpis.lineaTop.nombre}</p>
                  <p className="text-sm font-semibold text-foreground">
                    {formatMoney(kpis.lineaTop.valor)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {kpis.totalLineas} líneas
                  </p>
                </div>
              </div>
            )}

            {kpis.tipoCreditoTop && (
              <div className="space-y-2 rounded-lg border border-secondary-orange/30 bg-secondary-orange/5 p-3">
                <div className="flex items-center gap-2">
                  <div className="rounded-md bg-secondary-orange/20 p-1.5">
                    <CreditCard className="h-4 w-4 text-secondary-orange" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">
                    Tipo Crédito
                  </span>
                </div>
                <div>
                  <p className="font-bold text-lg text-palette-0">
                    {kpis.tipoCreditoTop.nombre}
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    {formatMoney(kpis.tipoCreditoTop.valor)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {kpis.totalTiposCredito} tipos
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
