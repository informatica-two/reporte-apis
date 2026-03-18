"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatMoney, formatPercent } from "@/lib/utils";
import type { CobrosKpis } from "@/hooks/use-cobros-kpis";
import { TrendingUp, TrendingDown, Target, Calendar, Zap, AlertCircle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type AnalisisEficienciaCobrosProps = {
  kpis: CobrosKpis;
};

export function AnalisisEficienciaCobros({ kpis }: AnalisisEficienciaCobrosProps) {
  const tasaEfectividad = kpis.cobroBruto > 0 ? (kpis.cobroNeto / kpis.cobroBruto) * 100 : 0;
  const brechaMeta = kpis.metaMes - kpis.cobroNeto;
  const diasRestantes = kpis.dias > 0 ? Math.max(0, 30 - kpis.dias) : 0;
  const cobroDiarioNecesario = diasRestantes > 0 ? brechaMeta / diasRestantes : 0;
  const ritmoActual = kpis.cobroPromedioDia;
  const proyeccionFinal = kpis.cobroNeto + (ritmoActual * diasRestantes);
  const alcanzaraMeta = proyeccionFinal >= kpis.metaMes;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Zap className="h-5 w-5 text-palette-0" />
          Análisis de Eficiencia
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Tasa de Efectividad */}
        <div className="rounded-lg border border-border/60 bg-muted/20 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">Tasa de Efectividad</span>
            <div className={cn(
              "text-2xl font-bold",
              tasaEfectividad >= 95 ? "text-secondary-green" : tasaEfectividad >= 90 ? "text-secondary-orange" : "text-palette-2"
            )}>
              {formatPercent(tasaEfectividad)}
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="h-1.5 flex-1 bg-muted rounded-full overflow-hidden">
              <div 
                className={cn(
                  "h-full transition-all",
                  tasaEfectividad >= 95 ? "bg-secondary-green" : tasaEfectividad >= 90 ? "bg-secondary-orange" : "bg-palette-2"
                )}
                style={{ width: `${Math.min(tasaEfectividad, 100)}%` }}
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            De cada {formatMoney(kpis.cobroBruto)} bruto, se cobran efectivamente {formatMoney(kpis.cobroNeto)}
          </p>
        </div>

        {/* Brecha vs Meta */}
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-palette-1" />
              <span className="text-xs font-medium text-muted-foreground">Brecha vs Meta</span>
            </div>
            {brechaMeta > 0 ? (
              <>
                <p className="text-xl font-bold text-palette-0">{formatMoney(brechaMeta)}</p>
                <p className="text-xs text-muted-foreground mt-1">Falta por cobrar</p>
              </>
            ) : (
              <>
                <p className="text-xl font-bold text-secondary-green">{formatMoney(Math.abs(brechaMeta))}</p>
                <p className="text-xs text-muted-foreground mt-1">Superó la meta</p>
              </>
            )}
          </div>

          <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-palette-1" />
              <span className="text-xs font-medium text-muted-foreground">Días Restantes</span>
            </div>
            <p className="text-xl font-bold text-foreground">{diasRestantes} días</p>
            <p className="text-xs text-muted-foreground mt-1">
              De {kpis.dias} días transcurridos
            </p>
          </div>
        </div>

        {/* Proyección */}
        {diasRestantes > 0 && brechaMeta > 0 && (
          <div className={cn(
            "rounded-lg p-4",
            alcanzaraMeta 
              ? "bg-secondary-green/10 border border-secondary-green/30" 
              : "bg-secondary-orange/10 border border-secondary-orange/30"
          )}>
            <div className="flex items-start gap-3">
              {alcanzaraMeta ? (
                <TrendingUp className="h-5 w-5 text-secondary-green shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="h-5 w-5 text-secondary-orange shrink-0 mt-0.5" />
              )}
              <div className="space-y-2 flex-1">
                <div>
                  <p className={cn(
                    "text-sm font-semibold",
                    alcanzaraMeta ? "text-secondary-green" : "text-secondary-orange"
                  )}>
                    {alcanzaraMeta ? "Proyección positiva" : "Meta en riesgo"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Al ritmo actual ({formatMoney(ritmoActual)}/día), se proyecta: {formatMoney(proyeccionFinal)}
                  </p>
                </div>
                
                {!alcanzaraMeta && (
                  <div className="pt-2 border-t border-border/40">
                    <p className="text-xs text-muted-foreground">
                      Se necesita cobrar <span className="font-semibold text-foreground">{formatMoney(cobroDiarioNecesario)}/día</span> para alcanzar la meta
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-muted-foreground">Ritmo actual:</span>
                      <span className="text-xs font-semibold">{formatMoney(ritmoActual)}/día</span>
                      {ritmoActual < cobroDiarioNecesario && (
                        <span className="text-xs text-secondary-orange flex items-center gap-1">
                          <TrendingDown className="h-3 w-3" />
                          {formatPercent((ritmoActual / cobroDiarioNecesario) * 100)} del necesario
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {brechaMeta <= 0 && (
          <div className="rounded-lg bg-secondary-green/10 border border-secondary-green/30 p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-secondary-green shrink-0" />
              <div>
                <p className="text-sm font-semibold text-secondary-green">
                  Meta alcanzada
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Se superó la meta en {formatMoney(Math.abs(brechaMeta))} ({formatPercent(kpis.cumplimientoMeta - 100)} adicional)
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
