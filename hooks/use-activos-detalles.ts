import { useQuery } from "@tanstack/react-query";
import type { FechasParams, ReportePorZonaDetalle } from "@/api/types";
import {
  getActivosDetalle1,
  getActivosDetalle2,
  getActivosDetalle3,
  getActivosDetalle4,
} from "@/api/reporteVisual";
import { queryKeys } from "./query-keys";

export type ActivosDetalles = {
  reportePorZona: ReportePorZonaDetalle | null;
  reportePorTipoCredito: ReportePorZonaDetalle | null;
  reportePorRango: ReportePorZonaDetalle | null;
  reportePorAnio: ReportePorZonaDetalle | null;
};

export type UseActivosDetallesOptions = {
  initialReportePorZona?: ReportePorZonaDetalle | null;
  initialReportePorTipoCredito?: ReportePorZonaDetalle | null;
  initialReportePorRango?: ReportePorZonaDetalle | null;
  initialReportePorAnio?: ReportePorZonaDetalle | null;
  initialDataUpdatedAt?: number;
};

async function fetchActivosDetalles(
  fechas: FechasParams | null
): Promise<ActivosDetalles> {
  if (!fechas) {
    return {
      reportePorZona: null,
      reportePorTipoCredito: null,
      reportePorRango: null,
      reportePorAnio: null,
    };
  }

  const [d1, d2, d3, d4] = await Promise.all([
    getActivosDetalle1(fechas),
    getActivosDetalle2(fechas),
    getActivosDetalle3(fechas),
    getActivosDetalle4(fechas),
  ]);

  return {
    reportePorZona: d1.success && "data" in d1 ? d1.data.detalle : null,
    reportePorTipoCredito: d2.success && "data" in d2 ? d2.data.detalle : null,
    reportePorRango: d3.success && "data" in d3 ? d3.data.detalle : null,
    reportePorAnio: d4.success && "data" in d4 ? d4.data.detalle : null,
  };
}

export function useActivosDetalles(
  fechas: FechasParams | null,
  options?: UseActivosDetallesOptions
) {
  const query = useQuery({
    queryKey: queryKeys.activosDetalles(fechas),
    queryFn: () => fetchActivosDetalles(fechas),
    enabled: !!fechas,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    initialData: options
      ? {
          reportePorZona: options.initialReportePorZona ?? null,
          reportePorTipoCredito: options.initialReportePorTipoCredito ?? null,
          reportePorRango: options.initialReportePorRango ?? null,
          reportePorAnio: options.initialReportePorAnio ?? null,
        }
      : undefined,
    initialDataUpdatedAt: options?.initialDataUpdatedAt,
  });

  return {
    reportePorZona: query.data?.reportePorZona ?? null,
    reportePorTipoCredito: query.data?.reportePorTipoCredito ?? null,
    reportePorRango: query.data?.reportePorRango ?? null,
    reportePorAnio: query.data?.reportePorAnio ?? null,
    state: query.isFetching || query.isLoading ? "loading" : query.isError ? "error" : "success",
    error: query.error instanceof Error ? query.error.message : null,
    retry: query.refetch,
  };
}
