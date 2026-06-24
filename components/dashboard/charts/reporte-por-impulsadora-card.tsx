"use client";

import { ReporteVentaCobroBarrasCard } from "./reporte-venta-cobro-barras-card";
import type { VentaCobroPorZonaDetalle } from "@/api/types";

type ReportePorImpulsadoraCardProps = {
  reportePorImpulsadora: VentaCobroPorZonaDetalle | null;
};

export function ReportePorImpulsadoraCard({
  reportePorImpulsadora,
}: ReportePorImpulsadoraCardProps) {
  return (
    <ReporteVentaCobroBarrasCard
      reporte={reportePorImpulsadora}
      tituloFallback="Reporte por venta y recuperación por división"
      columnaEtiqueta="División"
    />
  );
}
