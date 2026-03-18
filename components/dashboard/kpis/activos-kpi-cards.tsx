"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatNumber } from "@/lib/utils";
import type { ActivosKpis } from "@/hooks/use-activos-kpis";
import { 
  LayoutDashboard, 
  TrendingUp, 
  MapPin, 
  Calendar,
  AlertTriangle,
  CreditCard,
  BarChart3,
  Target
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

type ActivosKpiCardsProps = {
  kpis: ActivosKpis;
};

export function ActivosKpiCards({ kpis }: ActivosKpiCardsProps) {
  return (
    <div className="space-y-6">
      {/* Hero Card - Total Activos */}
      <Card className="overflow-hidden border-2 border-palette-1/20 bg-linear-to-br from-palette-1/20 to-palette-neutral dark:from-palette-1/10 dark:to-transparent">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-palette-1/20 p-3">
                  <LayoutDashboard className="h-8 w-8 text-palette-1" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total de Activos</p>
                  <p className="text-4xl font-bold text-palette-1">{formatNumber(kpis.totalActivos)}</p>
                </div>
              </div>
              <div className="flex gap-6 text-sm">
                <div>
                  <span className="text-muted-foreground">Promedio diario: </span>
                  <span className="font-semibold">{formatNumber(kpis.activosPorDia)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Período: </span>
                  <span className="font-semibold">{kpis.dias} días</span>
                </div>
              </div>
            </div>
            <div className="rounded-lg bg-background/80 px-4 py-2 text-center">
              <p className="text-xs text-muted-foreground">Zonas activas</p>
              <p className="text-2xl font-bold text-palette-1">{kpis.zonasActivas}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Secondary Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Tipo de Crédito Dominante */}
        <Card className="border-l-4 border-l-palette-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-palette-0" />
              Tipo de Crédito
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">CRE_30</span>
                <span className="text-sm font-bold">{formatNumber(kpis.cre30Count)}</span>
              </div>
              <Progress value={kpis.cre30Pct} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">{kpis.cre30Pct.toFixed(1)}% del total</p>
            </div>
            <div className="pt-2 border-t border-border/40">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">CON:</span>
                <span className="font-semibold">{formatNumber(kpis.conCount)} ({kpis.conPct.toFixed(1)}%)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Distribución por Ticket */}
        <Card className="border-l-4 border-l-secondary-blue">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-secondary-blue" />
              Distribución por Ticket
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">Bajo ticket (&lt;$125)</span>
                <span className="text-sm font-bold">{formatNumber(kpis.rangosMenores125)}</span>
              </div>
              <Progress value={kpis.pctBajoTicket} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">{kpis.pctBajoTicket.toFixed(1)}% del total</p>
            </div>
            <div className="pt-2 border-t border-border/40">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Alto ticket (&gt;$125):</span>
                <span className="font-semibold">{formatNumber(kpis.rangosMayores125)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Concentración Geográfica */}
        <Card className="border-l-4 border-l-secondary-green">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4 text-secondary-green" />
              Zona Principal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-2xl font-bold text-secondary-green">{kpis.zonaTop.zona}</p>
              <p className="text-xs text-muted-foreground">{formatNumber(kpis.zonaTop.count)} activos</p>
            </div>
            <div className="pt-2 border-t border-border/40">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Top 3 zonas:</span>
                <span className="font-semibold">{kpis.concentracionTop3Zonas.toFixed(1)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Análisis Temporal */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Calendar className="h-5 w-5 text-palette-0" />
            Análisis Temporal de Cartera
          </CardTitle>
          <CardDescription className="text-xs">
            Distribución de activos por antigüedad
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Año más reciente */}
            <div className="rounded-lg border-2 border-secondary-green/30 bg-secondary-green/5 p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-secondary-green" />
                <span className="text-xs font-medium text-muted-foreground">Año Pico</span>
              </div>
              <p className="text-2xl font-bold text-secondary-green">{kpis.anioMasReciente.anio}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatNumber(kpis.anioMasReciente.count)} activos
              </p>
            </div>

            {/* Activos recientes */}
            <div className="rounded-lg border-2 border-palette-0/30 bg-palette-0/5 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-palette-0" />
                <span className="text-xs font-medium text-muted-foreground">Recientes (3 años)</span>
              </div>
              <p className="text-2xl font-bold text-palette-0">{formatNumber(kpis.activosRecientes)}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {kpis.totalActivos > 0 ? ((kpis.activosRecientes / kpis.totalActivos) * 100).toFixed(1) : 0}% del total
              </p>
            </div>

            {/* Activos antiguos */}
            <div className="rounded-lg border-2 border-secondary-orange/30 bg-secondary-orange/5 p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-secondary-orange" />
                <span className="text-xs font-medium text-muted-foreground">Antiguos (&gt;5 años)</span>
              </div>
              <p className="text-2xl font-bold text-secondary-orange">{formatNumber(kpis.activosAntiguos)}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {kpis.totalActivos > 0 ? ((kpis.activosAntiguos / kpis.totalActivos) * 100).toFixed(1) : 0}% del total
              </p>
            </div>

            {/* Rango predominante */}
            <div className="rounded-lg border-2 border-palette-1/30 bg-palette-1/5 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-palette-1" />
                <span className="text-xs font-medium text-muted-foreground">Rango Principal</span>
              </div>
              <p className="text-sm font-bold text-palette-1 leading-tight">{kpis.rangoMayor.rango}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatNumber(kpis.rangoMayor.count)} ({kpis.rangoMayor.pct.toFixed(1)}%)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
