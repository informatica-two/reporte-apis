"use client";

import { ReporteBarrasCard } from "./reporte-barras-card";
import type { ReportePorZonaDetalle } from "@/api/types";

type ReporteActivosPorZonaCardProps = {
  reportePorZona: ReportePorZonaDetalle | null;
};

export function ReporteActivosPorZonaCard({
  reportePorZona,
}: ReporteActivosPorZonaCardProps) {
  return (
    <ReporteBarrasCard
      reporte={reportePorZona}
      tituloFallback="Reporte Activos por Zona"
      columnaEtiqueta="Zona"
    />
  );
}
