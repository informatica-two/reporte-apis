"use client";

import { useQuery } from "@tanstack/react-query";
import { getCobros, getVenta } from "@/api/reporteVisual";
import type { FechasParams, ReportePorZonaDetalle } from "@/api/types";
import { queryKeys } from "./query-keys";
import { parseNumberLabel } from "@/lib/utils";

export type CobrosKpis = {
  cobroBruto: number;
  cobroNeto: number;
  // Cobrado del mes actual correspondiente a lo vendido el mes anterior
  // (mismo dato que se muestra en el reporte "Ventas vs Cobros" del inicio:
  // "Venta Mes Anterior" / "Cobro Mes Actual").
  cobroNetoMesAnterior: number;
  ventaNetaMesAnterior: number;
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
  initialVentaData?: any | null;
  reportePorMedio?: ReportePorZonaDetalle | null;
  reportePorTipoDocumento?: ReportePorZonaDetalle | null;
  reportePorMunicipio?: ReportePorZonaDetalle | null;
  reportePorZona?: ReportePorZonaDetalle | null;
  initialDataUpdatedAt?: number;
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
  initialCobrosData?: any | null,
  initialVentaData?: any | null
): Promise<CobrosKpis> {
  let c = initialCobrosData;
  let v = initialVentaData;

  // Si no hay datos iniciales, hacer fetch (en paralelo si faltan ambos)
  if (!c && !v) {
    const [cobrosRes, ventaRes] = await Promise.all([
      getCobros(params, signal),
      getVenta(params, signal),
    ]);
    if (!cobrosRes.success) throw new Error(cobrosRes.error.message);
    if (!ventaRes.success) throw new Error(ventaRes.error.message);
    c = "data" in cobrosRes ? cobrosRes.data.detalle : null;
    v = "data" in ventaRes ? ventaRes.data.detalle : null;
  } else if (!c) {
    const cobrosRes = await getCobros(params, signal);
    if (!cobrosRes.success) throw new Error(cobrosRes.error.message);
    c = "data" in cobrosRes ? cobrosRes.data.detalle : null;
  } else if (!v) {
    const ventaRes = await getVenta(params, signal);
    if (!ventaRes.success) throw new Error(ventaRes.error.message);
    v = "data" in ventaRes ? ventaRes.data.detalle : null;
  }

  if (!c) throw new Error("Datos de cobros incompletos");
  if (!v) throw new Error("Datos de venta incompletos");

  const anulaciones = c.cobro_bruto - c.cobro_neto;
  const pctAnulaciones = c.cobro_bruto > 0 ? (anulaciones / c.cobro_bruto) * 100 : 0;
  const cobroPromedioDia = c.dias > 0 ? c.cobro_neto / c.dias : 0;
  const cumplimientoMeta = c.meta_diaria_mes > 0 ? (c.cobro_neto / c.meta_diaria_mes) * 100 : 0;

  return {
    cobroBruto: c.cobro_bruto,
    cobroNeto: c.cobro_neto,
    cobroNetoMesAnterior: v.cobrado,
    ventaNetaMesAnterior: v.venta_neta_nueva,
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
    initialVentaData,
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
      }, initialCobrosData, initialVentaData);
    },
    enabled: !!fechas,
    initialData: initialData ?? undefined,
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
