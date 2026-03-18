"use client";

import { ReporteBarrasCard } from "./reporte-barras-card";
import type { ReportePorZonaDetalle } from "@/api/types";

type ReportePorMunicipioCardProps = {
  reportePorMunicipio: ReportePorZonaDetalle | null;
};

export function ReportePorMunicipioCard({ reportePorMunicipio }: ReportePorMunicipioCardProps) {
  return (
    <ReporteBarrasCard
      reporte={reportePorMunicipio}
      tituloFallback="Reporte por Municipio"
      columnaEtiqueta="Municipio"
    />
  );
}
