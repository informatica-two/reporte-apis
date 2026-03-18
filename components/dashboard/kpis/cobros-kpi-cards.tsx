"use client";

import {
  Banknote,
  TrendingUp,
  TrendingDown,
  Target,
  Award,
  CreditCard,
  MapPin,
  FileText,
  Building2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatMoney, formatPercent } from "@/lib/utils";
import type { CobrosKpis } from "@/hooks/use-cobros-kpis";
import { cn } from "@/lib/utils";

type CobrosKpiCardsProps = {
  kpis: CobrosKpis;
};

export function CobrosKpiCards({ kpis }: CobrosKpiCardsProps) {
  const cumplimientoColor =
    kpis.cumplimientoMeta >= 100
      ? "text-secondary-green"
      : kpis.cumplimientoMeta >= 80
        ? "text-secondary-orange"
        : "text-palette-0";

  return (
    <div className="space-y-6">
      {/* Hero Card - Cobro Neto con progreso de meta */}
      <Card className="overflow-hidden border-2 border-palette-0/20 bg-linear-to-br from-palette-5/30 to-palette-neutral dark:from-palette-0/10 dark:to-transparent">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-palette-0/10 p-2">
                  <Banknote className="h-6 w-6 text-palette-0" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">
                  Cobro Neto del Período
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-4xl font-bold tracking-tight text-palette-0">
                  {formatMoney(kpis.cobroNeto)}
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-muted-foreground">
                    Bruto:{" "}
                    <span className="font-semibold text-foreground">
                      {formatMoney(kpis.cobroBruto)}
                    </span>
                  </span>
                  <span className="flex items-center gap-1 text-palette-2">
                    <TrendingDown className="h-3.5 w-3.5" />
                    {formatMoney(kpis.anulaciones)} (
                    {formatPercent(kpis.pctAnulaciones)})
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
        {/* Cobro Promedio Diario */}
        <Card className="border-l-4 border-l-secondary-green">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">
                  Cobro Promedio Diario
                </p>
                <p className="text-2xl font-bold text-secondary-green">
                  {formatMoney(kpis.cobroPromedioDia)}
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

        {/* Anulaciones */}
        <Card className="border-l-4 border-l-palette-2">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">
                  Anulaciones
                </p>
                <p className="text-2xl font-bold text-palette-2">
                  {formatMoney(kpis.anulaciones)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatPercent(kpis.pctAnulaciones)} del total
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
            {kpis.medioTop && (
              <div className="space-y-2 rounded-lg border border-secondary-blue/30 bg-secondary-blue/5 p-3">
                <div className="flex items-center gap-2">
                  <div className="rounded-md bg-secondary-blue/20 p-1.5">
                    <CreditCard className="h-4 w-4 text-secondary-blue" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">
                    Medio
                  </span>
                </div>
                <div>
                  <p className="font-bold text-lg text-palette-0">
                    {kpis.medioTop.nombre}
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    {formatMoney(kpis.medioTop.valor)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {kpis.totalMedios} medios activos
                  </p>
                </div>
              </div>
            )}

            {kpis.tipoDocumentoTop && (
              <div className="space-y-2 rounded-lg border border-secondary-green/30 bg-secondary-green/5 p-3">
                <div className="flex items-center gap-2">
                  <div className="rounded-md bg-secondary-green/20 p-1.5">
                    <FileText className="h-4 w-4 text-secondary-green" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">
                    Tipo Documento
                  </span>
                </div>
                <div>
                  <p className="font-bold text-lg text-palette-0">
                    {kpis.tipoDocumentoTop.nombre}
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    {formatMoney(kpis.tipoDocumentoTop.valor)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {kpis.totalTiposDocumento} tipos
                  </p>
                </div>
              </div>
            )}

            {kpis.municipioTop && (
              <div className="space-y-2 rounded-lg border border-palette-1/30 bg-palette-1/5 p-3">
                <div className="flex items-center gap-2">
                  <div className="rounded-md bg-palette-1/20 p-1.5">
                    <Building2 className="h-4 w-4 text-palette-1" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">
                    Municipio
                  </span>
                </div>
                <div>
                  <p className="font-bold text-lg text-palette-0">
                    {kpis.municipioTop.nombre}
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    {formatMoney(kpis.municipioTop.valor)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {kpis.totalMunicipios} municipios
                  </p>
                </div>
              </div>
            )}

            {kpis.zonaTop && (
              <div className="space-y-2 rounded-lg border border-secondary-orange/30 bg-secondary-orange/5 p-3">
                <div className="flex items-center gap-2">
                  <div className="rounded-md bg-secondary-orange/20 p-1.5">
                    <MapPin className="h-4 w-4 text-secondary-orange" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">
                    Zona
                  </span>
                </div>
                <div>
                  <p className="font-bold text-lg text-palette-0">
                    {kpis.zonaTop.nombre}
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    {formatMoney(kpis.zonaTop.valor)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {kpis.totalZonas} zonas activas
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
