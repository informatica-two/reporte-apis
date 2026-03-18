"use client";

import { useQuery } from "@tanstack/react-query";
import { getCobrosDetalle1, getCobrosDetalle2, getCobrosDetalle3, getCobrosDetalle4 } from "@/api/reporteVisual";
import type { FechasParams, ReportePorZonaDetalle } from "@/api/types";
import { queryKeys } from "./query-keys";

type CobrosDetalles = {
  reportePorMedio: ReportePorZonaDetalle | null;
  reportePorTipoDocumento: ReportePorZonaDetalle | null;
  reportePorMunicipio: ReportePorZonaDetalle | null;
  reportePorZona: ReportePorZonaDetalle | null;
};

type UseCobrosDetallesOptions = {
  initialReportePorMedio?: ReportePorZonaDetalle | null;
  initialReportePorTipoDocumento?: ReportePorZonaDetalle | null;
  initialReportePorMunicipio?: ReportePorZonaDetalle | null;
  initialReportePorZona?: ReportePorZonaDetalle | null;
  initialDataUpdatedAt?: number;
};

async function fetchCobrosDetalles(
  params: FechasParams,
  signal: AbortSignal,
): Promise<CobrosDetalles> {
  const [cobrosDetalle1Res, cobrosDetalle2Res, cobrosDetalle3Res, cobrosDetalle4Res] = await Promise.all([
    getCobrosDetalle1(params, signal),
    getCobrosDetalle2(params, signal),
    getCobrosDetalle3(params, signal),
    getCobrosDetalle4(params, signal),
  ]);

  if (!cobrosDetalle1Res.success) {
    throw new Error(cobrosDetalle1Res.error.message);
  }
  if (!cobrosDetalle2Res.success) {
    throw new Error(cobrosDetalle2Res.error.message);
  }
  if (!cobrosDetalle3Res.success) {
    throw new Error(cobrosDetalle3Res.error.message);
  }
  if (!cobrosDetalle4Res.success) {
    throw new Error(cobrosDetalle4Res.error.message);
  }

  const reportePorMedio =
    "data" in cobrosDetalle1Res ? cobrosDetalle1Res.data.detalle : null;
  const reportePorTipoDocumento =
    "data" in cobrosDetalle2Res ? cobrosDetalle2Res.data.detalle : null;
  const reportePorMunicipio =
    "data" in cobrosDetalle3Res ? cobrosDetalle3Res.data.detalle : null;
  const reportePorZona =
    "data" in cobrosDetalle4Res ? cobrosDetalle4Res.data.detalle : null;

  if (!reportePorMedio || !Array.isArray(reportePorMedio.datos)) {
    throw new Error("Datos de medio inválidos");
  }
  if (!reportePorTipoDocumento || !Array.isArray(reportePorTipoDocumento.datos)) {
    throw new Error("Datos de tipo documento inválidos");
  }
  if (!reportePorMunicipio || !Array.isArray(reportePorMunicipio.datos)) {
    throw new Error("Datos de municipio inválidos");
  }
  if (!reportePorZona || !Array.isArray(reportePorZona.datos)) {
    throw new Error("Datos de zona inválidos");
  }

  return { reportePorMedio, reportePorTipoDocumento, reportePorMunicipio, reportePorZona };
}

export function useCobrosDetalles(
  fechas: FechasParams | null,
  options: UseCobrosDetallesOptions = {},
) {
  const { initialReportePorMedio, initialReportePorTipoDocumento, initialReportePorMunicipio, initialReportePorZona } = options;
  const initialData =
    initialReportePorMedio || initialReportePorTipoDocumento || initialReportePorMunicipio || initialReportePorZona
      ? {
          reportePorMedio: initialReportePorMedio,
          reportePorTipoDocumento: initialReportePorTipoDocumento,
          reportePorMunicipio: initialReportePorMunicipio,
          reportePorZona: initialReportePorZona,
        }
      : undefined;

  const query = useQuery({
    queryKey: queryKeys.cobrosDetalles(fechas),
    queryFn: ({ signal }) => {
      if (!fechas) throw new Error("Fechas requeridas");
      return fetchCobrosDetalles(fechas, signal);
    },
    enabled: !!fechas,
    initialData,
    initialDataUpdatedAt: options.initialDataUpdatedAt,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
  });

  return {
    reportePorMedio: query.data?.reportePorMedio ?? null,
    reportePorTipoDocumento: query.data?.reportePorTipoDocumento ?? null,
    reportePorMunicipio: query.data?.reportePorMunicipio ?? null,
    reportePorZona: query.data?.reportePorZona ?? null,
    state: query.isFetching || query.isLoading
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
