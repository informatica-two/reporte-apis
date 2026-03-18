"use client";

import { ReporteBarrasCard } from "./reporte-barras-card";
import type { ReportePorZonaDetalle } from "@/api/types";

type ReportePorMedioCardProps = {
  reportePorMedio: ReportePorZonaDetalle | null;
};

export function ReportePorMedioCard({ reportePorMedio }: ReportePorMedioCardProps) {
  return (
    <ReporteBarrasCard
      reporte={reportePorMedio}
      tituloFallback="Reporte por Medio"
      columnaEtiqueta="Medio"
    />
  );
}
