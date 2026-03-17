"use client";

import { ReporteBarrasCard } from "./reporte-barras-card";
import type { ReportePorZonaDetalle } from "@/api/types";

type ReportePorImpulsadoraCardProps = {
  reportePorImpulsadora: ReportePorZonaDetalle | null;
};

export function ReportePorImpulsadoraCard({
  reportePorImpulsadora,
}: ReportePorImpulsadoraCardProps) {
  return (
    <ReporteBarrasCard
      reporte={reportePorImpulsadora}
      tituloFallback="Reporte por impulsadora"
      columnaEtiqueta="Impulsadora"
    />
  );
}
