"use client";

import { ReporteBarrasCard } from "./reporte-barras-card";
import type { ReportePorZonaDetalle } from "@/api/types";

type ReportePorTipoCreditoCardProps = {
  reportePorTipoCredito: ReportePorZonaDetalle | null;
};

export function ReportePorTipoCreditoCard({ reportePorTipoCredito }: ReportePorTipoCreditoCardProps) {
  return (
    <ReporteBarrasCard
      reporte={reportePorTipoCredito}
      tituloFallback="Reporte por Tipo de Crédito"
      columnaEtiqueta="Tipo"
    />
  );
}
