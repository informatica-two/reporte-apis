"use client";

import { ReporteBarrasCard } from "./reporte-barras-card";
import type { ReportePorZonaDetalle } from "@/api/types";

type ReportePorZonaCardProps = {
  reportePorZona: ReportePorZonaDetalle | null;
};

export function ReportePorZonaCard({ reportePorZona }: ReportePorZonaCardProps) {
  return (
    <ReporteBarrasCard
      reporte={reportePorZona}
      tituloFallback="Reporte por zona"
      columnaEtiqueta="Zona"
    />
  );
}
