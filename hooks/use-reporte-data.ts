"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getActivos,
  getCobros,
  getVenta,
  getReclutamientos,
} from "@/api/reporteVisual";
import type { FechasParams } from "@/api/types";
import { calculateKpis } from "@/lib/kpis-calculator";
import { queryKeys } from "./query-keys";

export type ReporteKpis = {
  activoNeto: number;
  cobroBruto: number;
  cobroNeto: number;
  ventaBruta: number;
  ventaNeta: number;
  devoluciones: number;
  anulaciones: number;
  reclutamientos: number;
  arpu: number;
  cobroPromedioDia: number;
  ventaPromedioDia: number;
  pctDevoluciones: number;
  pctAnulaciones: number;
  ratioCobrosVentas: number;
  reclutamientosDia: number;
  dias: number;
};

type UseReporteDataOptions = {
  initialData?: ReporteKpis | null;
  initialDataUpdatedAt?: number;
};

async function fetchKpis(
  params: FechasParams,
  signal: AbortSignal,
): Promise<ReporteKpis> {
  const [activosRes, cobrosRes, ventaRes, reclutamientosRes] =
    await Promise.all([
      getActivos(params, signal),
      getCobros(params, signal),
      getVenta(params, signal),
      getReclutamientos(params, signal),
    ]);

  if (!activosRes.success) throw new Error(activosRes.error.message);
  if (!cobrosRes.success) throw new Error(cobrosRes.error.message);
  if (!ventaRes.success) throw new Error(ventaRes.error.message);
  if (!reclutamientosRes.success)
    throw new Error(reclutamientosRes.error.message);

  const a = "data" in activosRes ? activosRes.data.detalle : null;
  const c = "data" in cobrosRes ? cobrosRes.data.detalle : null;
  const v = "data" in ventaRes ? ventaRes.data.detalle : null;
  const r = "data" in reclutamientosRes ? reclutamientosRes.data.detalle : 0;

  if (!a || !c || !v) throw new Error("Datos incompletos");

  return calculateKpis(a, c, v, r);
}

export function useReporteData(
  fechas: FechasParams | null,
  options: UseReporteDataOptions = {},
) {
  const queryKey = queryKeys.reporteKpis(fechas);
  
  const query = useQuery({
    queryKey,
    queryFn: ({ signal }) => {
      if (!fechas) throw new Error("Fechas requeridas");
      return fetchKpis(fechas, signal);
    },
    enabled: !!fechas,
    initialData: options.initialData ?? undefined,
    initialDataUpdatedAt: options.initialDataUpdatedAt,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
  });

  return {
    kpis: query.data ?? null,
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
