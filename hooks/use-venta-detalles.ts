"use client";

import { useQuery } from "@tanstack/react-query";
import { getVentaDetalle1, getVentaDetalle2, getVentaDetalle3, getVentaDetalle4 } from "@/api/reporteVisual";
import type { FechasParams, ReportePorZonaDetalle } from "@/api/types";
import { queryKeys } from "./query-keys";

type VentaDetalles = {
  reportePorZona: ReportePorZonaDetalle | null;
  reportePorImpulsadora: ReportePorZonaDetalle | null;
  reporteDetalle3: ReportePorZonaDetalle | null;
  reportePorTipoCredito: ReportePorZonaDetalle | null;
};

type UseVentaDetallesOptions = {
  initialReportePorZona?: ReportePorZonaDetalle | null;
  initialReportePorImpulsadora?: ReportePorZonaDetalle | null;
  initialReporteDetalle3?: ReportePorZonaDetalle | null;
  initialReportePorTipoCredito?: ReportePorZonaDetalle | null;
};

async function fetchVentaDetalles(
  params: FechasParams,
  signal: AbortSignal,
): Promise<VentaDetalles> {
  const [ventaDetalle1Res, ventaDetalle2Res, ventaDetalle3Res, ventaDetalle4Res] = await Promise.all([
    getVentaDetalle1(params, signal),
    getVentaDetalle2(params, signal),
    getVentaDetalle3(params, signal),
    getVentaDetalle4(params, signal),
  ]);

  if (!ventaDetalle1Res.success) {
    throw new Error(ventaDetalle1Res.error.message);
  }
  if (!ventaDetalle2Res.success) {
    throw new Error(ventaDetalle2Res.error.message);
  }
  if (!ventaDetalle3Res.success) {
    throw new Error(ventaDetalle3Res.error.message);
  }
  if (!ventaDetalle4Res.success) {
    throw new Error(ventaDetalle4Res.error.message);
  }

  const reportePorZona =
    "data" in ventaDetalle1Res ? ventaDetalle1Res.data.detalle : null;
  const reportePorImpulsadora =
    "data" in ventaDetalle2Res ? ventaDetalle2Res.data.detalle : null;
  const reporteDetalle3 =
    "data" in ventaDetalle3Res ? ventaDetalle3Res.data.detalle : null;
  const reportePorTipoCredito =
    "data" in ventaDetalle4Res ? ventaDetalle4Res.data.detalle : null;

  if (!reportePorZona || !Array.isArray(reportePorZona.datos)) {
    throw new Error("Datos de zona inválidos");
  }
  if (!reportePorImpulsadora || !Array.isArray(reportePorImpulsadora.datos)) {
    throw new Error("Datos de impulsadora inválidos");
  }
  if (!reporteDetalle3 || !Array.isArray(reporteDetalle3.datos)) {
    throw new Error("Datos de detalle 3 inválidos");
  }
  if (!reportePorTipoCredito || !Array.isArray(reportePorTipoCredito.datos)) {
    throw new Error("Datos de tipo de crédito inválidos");
  }

  return { reportePorZona, reportePorImpulsadora, reporteDetalle3, reportePorTipoCredito };
}

export function useVentaDetalles(
  fechas: FechasParams | null,
  options: UseVentaDetallesOptions = {},
) {
  const { initialReportePorZona, initialReportePorImpulsadora, initialReporteDetalle3, initialReportePorTipoCredito } = options;
  const initialData =
    initialReportePorZona || initialReportePorImpulsadora || initialReporteDetalle3 || initialReportePorTipoCredito
      ? {
          reportePorZona: initialReportePorZona,
          reportePorImpulsadora: initialReportePorImpulsadora,
          reporteDetalle3: initialReporteDetalle3,
          reportePorTipoCredito: initialReportePorTipoCredito,
        }
      : undefined;

  const query = useQuery({
    queryKey: queryKeys.ventaDetalles(fechas),
    queryFn: ({ signal }) => {
      if (!fechas) throw new Error("Fechas requeridas");
      return fetchVentaDetalles(fechas, signal);
    },
    enabled: !!fechas,
    initialData,
    staleTime: 5 * 60 * 1000,
  });

  return {
    reportePorZona: query.data?.reportePorZona ?? null,
    reportePorImpulsadora: query.data?.reportePorImpulsadora ?? null,
    reporteDetalle3: query.data?.reporteDetalle3 ?? null,
    reportePorTipoCredito: query.data?.reportePorTipoCredito ?? null,
    state: query.isLoading
      ? "loading"
      : query.isError
        ? "error"
        : query.isSuccess
          ? "success"
          : "idle",
    error: query.error instanceof Error ? query.error.message : null,
    retry: query.refetch,
    lastUpdated: query.dataUpdatedAt ? new Date(query.dataUpdatedAt) : null,
  };
}
