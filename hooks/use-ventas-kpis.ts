"use client";

import { useQuery } from "@tanstack/react-query";
import { getVenta } from "@/api/reporteVisual";
import type { FechasParams, ReportePorZonaDetalle } from "@/api/types";
import { queryKeys } from "./query-keys";
import { parseNumberLabel } from "@/lib/utils";

export type VentasKpis = {
  ventaBruta: number;
  ventaNeta: number;
  devoluciones: number;
  pctDevoluciones: number;
  ventaPromedioDia: number;
  metaDiaria: number;
  metaMes: number;
  cumplimientoMeta: number;
  dias: number;
  zonaTop: { nombre: string; valor: number } | null;
  impulsadoraTop: { nombre: string; valor: number } | null;
  lineaTop: { nombre: string; valor: number } | null;
  tipoCreditoTop: { nombre: string; valor: number } | null;
  totalZonas: number;
  totalImpulsadoras: number;
  totalLineas: number;
  totalTiposCredito: number;
};

type UseVentasKpisOptions = {
  initialData?: VentasKpis | null;
  initialVentaData?: any | null;
  reportePorZona?: ReportePorZonaDetalle | null;
  reportePorImpulsadora?: ReportePorZonaDetalle | null;
  reporteDetalle3?: ReportePorZonaDetalle | null;
  reportePorTipoCredito?: ReportePorZonaDetalle | null;
};

function getTopItem(reporte: ReportePorZonaDetalle | null): { nombre: string; valor: number } | null {
  if (!reporte || !reporte.datos || reporte.datos.length === 0) return null;
  
  const sorted = [...reporte.datos]
    .map(d => ({ nombre: d.Etiqueta, valor: parseNumberLabel(d.Valor) }))
    .sort((a, b) => b.valor - a.valor);
  
  return sorted[0];
}

async function fetchVentasKpis(
  params: FechasParams,
  signal: AbortSignal,
  detalles: {
    reportePorZona?: ReportePorZonaDetalle | null;
    reportePorImpulsadora?: ReportePorZonaDetalle | null;
    reporteDetalle3?: ReportePorZonaDetalle | null;
    reportePorTipoCredito?: ReportePorZonaDetalle | null;
  },
  initialVentaData?: any | null
): Promise<VentasKpis> {
  let v = initialVentaData;
  
  // Si no hay datos iniciales, hacer fetch
  if (!v) {
    const ventaRes = await getVenta(params, signal);
    if (!ventaRes.success) throw new Error(ventaRes.error.message);
    v = "data" in ventaRes ? ventaRes.data.detalle : null;
  }
  
  if (!v) throw new Error("Datos de venta incompletos");

  const devoluciones = v.venta_bruta - v.venta_neta;
  const pctDevoluciones = v.venta_bruta > 0 ? (devoluciones / v.venta_bruta) * 100 : 0;
  const ventaPromedioDia = v.dias > 0 ? v.venta_neta / v.dias : 0;
  const cumplimientoMeta = v.meta_diaria_mes > 0 ? (v.venta_neta / v.meta_diaria_mes) * 100 : 0;

  return {
    ventaBruta: v.venta_bruta,
    ventaNeta: v.venta_neta,
    devoluciones,
    pctDevoluciones,
    ventaPromedioDia,
    metaDiaria: v.meta_diaria,
    metaMes: v.meta_diaria_mes,
    cumplimientoMeta,
    dias: v.dias,
    zonaTop: getTopItem(detalles.reportePorZona ?? null),
    impulsadoraTop: getTopItem(detalles.reportePorImpulsadora ?? null),
    lineaTop: getTopItem(detalles.reporteDetalle3 ?? null),
    tipoCreditoTop: getTopItem(detalles.reportePorTipoCredito ?? null),
    totalZonas: detalles.reportePorZona?.datos?.length ?? 0,
    totalImpulsadoras: detalles.reportePorImpulsadora?.datos?.length ?? 0,
    totalLineas: detalles.reporteDetalle3?.datos?.length ?? 0,
    totalTiposCredito: detalles.reportePorTipoCredito?.datos?.length ?? 0,
  };
}

export function useVentasKpis(
  fechas: FechasParams | null,
  options: UseVentasKpisOptions = {},
) {
  const { 
    initialData,
    initialVentaData,
    reportePorZona,
    reportePorImpulsadora,
    reporteDetalle3,
    reportePorTipoCredito,
  } = options;

  const query = useQuery({
    queryKey: [...queryKeys.ventaDetalles(fechas), 'kpis'],
    queryFn: ({ signal }) => {
      if (!fechas) throw new Error("Fechas requeridas");
      return fetchVentasKpis(fechas, signal, {
        reportePorZona,
        reportePorImpulsadora,
        reporteDetalle3,
        reportePorTipoCredito,
      }, initialVentaData);
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
