"use client";

import { ReporteBarrasCard } from "./reporte-barras-card";
import type { ReportePorZonaDetalle } from "@/api/types";

type ReporteDetalle3CardProps = {
  reporteDetalle3: ReportePorZonaDetalle | null;
};

export function ReporteDetalle3Card({ reporteDetalle3 }: ReporteDetalle3CardProps) {
  return (
    <ReporteBarrasCard
      reporte={reporteDetalle3}
      tituloFallback="Reporte por Línea"
      columnaEtiqueta="Línea"
    />
  );
}
