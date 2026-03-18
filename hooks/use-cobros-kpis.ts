"use client";

import { useQuery } from "@tanstack/react-query";
import { getCobros } from "@/api/reporteVisual";
import type { FechasParams, ReportePorZonaDetalle } from "@/api/types";
import { queryKeys } from "./query-keys";
import { parseNumberLabel } from "@/lib/utils";

export type CobrosKpis = {
  cobroBruto: number;
  cobroNeto: number;
  anulaciones: number;
  pctAnulaciones: number;
  cobroPromedioDia: number;
  metaDiaria: number;
  metaMes: number;
  cumplimientoMeta: number;
  dias: number;
  medioTop: { nombre: string; valor: number } | null;
  tipoDocumentoTop: { nombre: string; valor: number } | null;
  municipioTop: { nombre: string; valor: number } | null;
  zonaTop: { nombre: string; valor: number } | null;
  totalMedios: number;
  totalTiposDocumento: number;
  totalMunicipios: number;
  totalZonas: number;
};

type UseCobrosKpisOptions = {
  initialData?: CobrosKpis | null;
  initialCobrosData?: any | null;
  reportePorMedio?: ReportePorZonaDetalle | null;
  reportePorTipoDocumento?: ReportePorZonaDetalle | null;
  reportePorMunicipio?: ReportePorZonaDetalle | null;
  reportePorZona?: ReportePorZonaDetalle | null;
};

function getTopItem(reporte: ReportePorZonaDetalle | null): { nombre: string; valor: number } | null {
  if (!reporte || !reporte.datos || reporte.datos.length === 0) return null;
  
  const sorted = [...reporte.datos]
    .map(d => ({ nombre: d.Etiqueta, valor: parseNumberLabel(d.Valor) }))
    .sort((a, b) => b.valor - a.valor);
  
  return sorted[0];
}

async function fetchCobrosKpis(
  params: FechasParams,
  signal: AbortSignal,
  detalles: {
    reportePorMedio?: ReportePorZonaDetalle | null;
    reportePorTipoDocumento?: ReportePorZonaDetalle | null;
    reportePorMunicipio?: ReportePorZonaDetalle | null;
    reportePorZona?: ReportePorZonaDetalle | null;
  },
  initialCobrosData?: any | null
): Promise<CobrosKpis> {
  let c = initialCobrosData;
  
  // Si no hay datos iniciales, hacer fetch
  if (!c) {
    const cobrosRes = await getCobros(params, signal);
    if (!cobrosRes.success) throw new Error(cobrosRes.error.message);
    c = "data" in cobrosRes ? cobrosRes.data.detalle : null;
  }
  
  if (!c) throw new Error("Datos de cobros incompletos");

  const anulaciones = c.cobro_bruto - c.cobro_neto;
  const pctAnulaciones = c.cobro_bruto > 0 ? (anulaciones / c.cobro_bruto) * 100 : 0;
  const cobroPromedioDia = c.dias > 0 ? c.cobro_neto / c.dias : 0;
  const cumplimientoMeta = c.meta_diaria_mes > 0 ? (c.cobro_neto / c.meta_diaria_mes) * 100 : 0;

  return {
    cobroBruto: c.cobro_bruto,
    cobroNeto: c.cobro_neto,
    anulaciones,
    pctAnulaciones,
    cobroPromedioDia,
    metaDiaria: c.meta_diaria,
    metaMes: c.meta_diaria_mes,
    cumplimientoMeta,
    dias: c.dias,
    medioTop: getTopItem(detalles.reportePorMedio ?? null),
    tipoDocumentoTop: getTopItem(detalles.reportePorTipoDocumento ?? null),
    municipioTop: getTopItem(detalles.reportePorMunicipio ?? null),
    zonaTop: getTopItem(detalles.reportePorZona ?? null),
    totalMedios: detalles.reportePorMedio?.datos?.length ?? 0,
    totalTiposDocumento: detalles.reportePorTipoDocumento?.datos?.length ?? 0,
    totalMunicipios: detalles.reportePorMunicipio?.datos?.length ?? 0,
    totalZonas: detalles.reportePorZona?.datos?.length ?? 0,
  };
}

export function useCobrosKpis(
  fechas: FechasParams | null,
  options: UseCobrosKpisOptions = {},
) {
  const { 
    initialData,
    initialCobrosData,
    reportePorMedio,
    reportePorTipoDocumento,
    reportePorMunicipio,
    reportePorZona,
  } = options;

  const query = useQuery({
    queryKey: [...queryKeys.cobrosDetalles(fechas), 'kpis'],
    queryFn: ({ signal }) => {
      if (!fechas) throw new Error("Fechas requeridas");
      return fetchCobrosKpis(fechas, signal, {
        reportePorMedio,
        reportePorTipoDocumento,
        reportePorMunicipio,
        reportePorZona,
      }, initialCobrosData);
    },
    enabled: !!fechas,
    initialData: initialData ?? undefined,
    staleTime: 5 * 60 * 1000,
  });

  return {
    kpis: query.data ?? null,
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
