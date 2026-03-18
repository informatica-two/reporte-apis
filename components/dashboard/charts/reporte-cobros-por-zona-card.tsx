"use client";

import { ReporteBarrasCard } from "./reporte-barras-card";
import type { ReportePorZonaDetalle } from "@/api/types";

type ReporteCobrosZonaCardProps = {
  reportePorZona: ReportePorZonaDetalle | null;
};

export function ReporteCobrosZonaCard({ reportePorZona }: ReporteCobrosZonaCardProps) {
  return (
    <ReporteBarrasCard
      reporte={reportePorZona}
      tituloFallback="Reporte por Zona"
      columnaEtiqueta="Zona"
    />
  );
}
