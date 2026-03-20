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
  fechas: FechasParams | null,
  signal: AbortSignal,
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
    getActivosDetalle1(fechas, signal),
    getActivosDetalle2(fechas, signal),
    getActivosDetalle3(fechas, signal),
    getActivosDetalle4(fechas, signal),
  ]);

  if (!d1.success) throw new Error(d1.error.message);
  if (!d2.success) throw new Error(d2.error.message);
  if (!d3.success) throw new Error(d3.error.message);
  if (!d4.success) throw new Error(d4.error.message);

  const reportePorZona = "data" in d1 ? d1.data.detalle : null;
  const reportePorTipoCredito = "data" in d2 ? d2.data.detalle : null;
  const reportePorRango = "data" in d3 ? d3.data.detalle : null;
  const reportePorAnio = "data" in d4 ? d4.data.detalle : null;

  if (!reportePorZona?.datos || !Array.isArray(reportePorZona.datos)) {
    throw new Error("Datos de zona inválidos");
  }
  if (!reportePorTipoCredito?.datos || !Array.isArray(reportePorTipoCredito.datos)) {
    throw new Error("Datos de tipo de crédito inválidos");
  }
  if (!reportePorRango?.datos || !Array.isArray(reportePorRango.datos)) {
    throw new Error("Datos de rango inválidos");
  }
  if (!reportePorAnio?.datos || !Array.isArray(reportePorAnio.datos)) {
    throw new Error("Datos por año inválidos");
  }

  return {
    reportePorZona,
    reportePorTipoCredito,
    reportePorRango,
    reportePorAnio,
  };
}

export function useActivosDetalles(
  fechas: FechasParams | null,
  options?: UseActivosDetallesOptions
) {
  const {
    initialReportePorZona,
    initialReportePorTipoCredito,
    initialReportePorRango,
    initialReportePorAnio,
  } = options ?? {};

  /** Sin esto, al cambiar fechas `initialData` queda en todo null y TanStack Query no fetchea (staleTime). */
  const initialData =
    initialReportePorZona ||
    initialReportePorTipoCredito ||
    initialReportePorRango ||
    initialReportePorAnio
      ? {
          reportePorZona: initialReportePorZona ?? null,
          reportePorTipoCredito: initialReportePorTipoCredito ?? null,
          reportePorRango: initialReportePorRango ?? null,
          reportePorAnio: initialReportePorAnio ?? null,
        }
      : undefined;

  const query = useQuery({
    queryKey: queryKeys.activosDetalles(fechas),
    queryFn: ({ signal }) => {
      if (!fechas) throw new Error("Fechas requeridas");
      return fetchActivosDetalles(fechas, signal);
    },
    enabled: !!fechas,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    initialData,
    initialDataUpdatedAt: options?.initialDataUpdatedAt,
    /** Evita pantalla vacía o mezcla rara: se muestran datos del rango anterior hasta que llegue el nuevo. */
    placeholderData: (previousData) => previousData,
  });

  /** Con placeholder, `isFetching` es true pero `data` sigue siendo el lote anterior → no ocultar todo el dashboard. */
  const isLoadingNoDataYet = query.isFetching && query.data === undefined;

  return {
    reportePorZona: query.data?.reportePorZona ?? null,
    reportePorTipoCredito: query.data?.reportePorTipoCredito ?? null,
    reportePorRango: query.data?.reportePorRango ?? null,
    reportePorAnio: query.data?.reportePorAnio ?? null,
    isPlaceholderData: query.isPlaceholderData,
    state: isLoadingNoDataYet ? "loading" : query.isError ? "error" : "success",
    error: query.error instanceof Error ? query.error.message : null,
    retry: query.refetch,
  };
}
