"use client";

import { ReporteBarrasCard } from "./reporte-barras-card";
import type { ReportePorZonaDetalle } from "@/api/types";

type ReportePorTipoDocumentoCardProps = {
  reportePorTipoDocumento: ReportePorZonaDetalle | null;
};

export function ReportePorTipoDocumentoCard({ reportePorTipoDocumento }: ReportePorTipoDocumentoCardProps) {
  return (
    <ReporteBarrasCard
      reporte={reportePorTipoDocumento}
      tituloFallback="Reporte por Tipo Documento"
      columnaEtiqueta="Tipo"
    />
  );
}
