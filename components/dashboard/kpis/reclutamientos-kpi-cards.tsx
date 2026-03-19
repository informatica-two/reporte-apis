import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Users, CheckCircle, Clock } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import type { ReclutamientosKpis } from "@/hooks/use-reclutamientos-kpis";

type ReclutamientosKpiCardsProps = {
  kpis: ReclutamientosKpis;
};

export function ReclutamientosKpiCards({ kpis }: ReclutamientosKpiCardsProps) {
  const barPct = Math.min(
    100,
    kpis.dias > 0 ? (kpis.totalReclutamientos / (kpis.dias * 10)) * 100 : 0
  );

  return (
    <div className="space-y-6">
      {/* Hero Card */}
      <Card className="overflow-hidden border-2 border-palette-0/20 bg-linear-to-br from-palette-5/30 to-palette-neutral dark:from-palette-0/10 dark:to-transparent">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-palette-0" />
                <h3 className="text-sm font-medium text-muted-foreground">
                  Total Reclutamientos
                </h3>
              </div>
              <p className="text-4xl font-bold tracking-tight text-palette-0">
                {formatNumber(kpis.totalReclutamientos)}
              </p>
              <div className="flex gap-4 text-sm text-muted-foreground">
                <span>{kpis.reclutamientosPorDia.toFixed(1)} por día</span>
                <span>•</span>
                <span>{kpis.dias} días</span>
              </div>
            </div>
            <div className="rounded-full bg-palette-0/10 p-3">
              <Users className="h-8 w-8 text-palette-0" />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progreso del período</span>
              <span>{kpis.dias} días</span>
            </div>
            <Progress value={barPct} className="h-2 bg-palette-5" />
          </div>
        </CardContent>
      </Card>

      {/* Secondary Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-secondary-green/20 p-2.5">
                <CheckCircle className="h-5 w-5 text-secondary-green" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Tasa de Aprobación
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {kpis.tasaAprobacion.toFixed(1)}%
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatNumber(kpis.aprobadosCount)} aprobados
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-chart-1/20 p-2.5">
                <Users className="h-5 w-5 text-chart-1" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Promotores (PRO)
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {formatNumber(kpis.proCount)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {kpis.proPct.toFixed(1)}% del total
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-secondary-orange/20 p-2.5">
                <Clock className="h-5 w-5 text-secondary-orange" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">
                  En Proceso
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {formatNumber(kpis.procesandoCount)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {kpis.procesandoPct.toFixed(1)}% del total
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Destacados */}
      <Card>
        <CardHeader className="pb-3">
          <h3 className="text-lg font-semibold">Destacados</h3>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-border bg-muted/40 p-4">
              <p className="mb-1 text-xs font-medium text-muted-foreground">Tipo Principal</p>
              <p className="text-lg font-bold text-foreground">
                {kpis.tipoTop?.nombre ?? "N/A"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {formatNumber(kpis.tipoTop?.valor ?? 0)} reclutamientos
              </p>
            </div>
            <div className="rounded-lg border border-border bg-muted/40 p-4">
              <p className="mb-1 text-xs font-medium text-muted-foreground">Oficinistas</p>
              <p className="text-lg font-bold text-foreground">
                {formatNumber(kpis.ofiCount)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {kpis.ofiPct.toFixed(1)}% del total
              </p>
            </div>
            <div className="rounded-lg border border-border bg-muted/40 p-4">
              <p className="mb-1 text-xs font-medium text-muted-foreground">RDS</p>
              <p className="text-lg font-bold text-foreground">
                {formatNumber(kpis.rdsCount)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {kpis.rdsPct.toFixed(1)}% del total
              </p>
            </div>
            <div className="rounded-lg border border-border bg-muted/40 p-4">
              <p className="mb-1 text-xs font-medium text-muted-foreground">Crédito (CRE)</p>
              <p className="text-lg font-bold text-foreground">
                {formatNumber(kpis.creCount)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {kpis.crePct.toFixed(1)}% del total
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
