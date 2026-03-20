import { useQuery } from "@tanstack/react-query";
import type { FechasParams, ReportePorZonaDetalle } from "@/api/types";
import { getActivos } from "@/api/reporteVisual";
import { parseNumberLabel } from "@/lib/utils";

export type ActivosKpis = {
  totalActivos: number;
  activosPorDia: number;
  dias: number;
  
  // Distribución por tipo de crédito
  cre30Count: number;
  cre30Pct: number;
  conCount: number;
  conPct: number;
  
  // Distribución por rango
  rangoMayor: { rango: string; count: number; pct: number };
  rangosMenores125: number;
  rangosMayores125: number;
  pctBajoTicket: number;
  
  // Distribución geográfica
  zonasActivas: number;
  zonaTop: { zona: string; count: number; pct: number };
  concentracionTop3Zonas: number;
  
  // Análisis temporal
  anioMasReciente: { anio: string; count: number };
  aniosPico: { anio: string; count: number }[];
  activosAntiguos: number;
  activosRecientes: number;
};

type UseActivosKpisOptions = {
  reportePorZona?: ReportePorZonaDetalle | null;
  reportePorTipoCredito?: ReportePorZonaDetalle | null;
  reportePorRango?: ReportePorZonaDetalle | null;
  reportePorAnio?: ReportePorZonaDetalle | null;
  initialActivosData?: any | null;
  initialDataUpdatedAt?: number;
  /** Detalles aún son del rango anterior (placeholder) → no mezclar con fechas nuevas ni getActivos nuevo. */
  detallesSonPlaceholder?: boolean;
};

function calculateActivosKpis(
  activosData: any,
  reportePorZona: ReportePorZonaDetalle | null,
  reportePorTipoCredito: ReportePorZonaDetalle | null,
  reportePorRango: ReportePorZonaDetalle | null,
  reportePorAnio: ReportePorZonaDetalle | null,
  fechas: FechasParams
): ActivosKpis {
  const totalActivos = activosData?.total_activos ?? 0;
  
  const fechaInicio = new Date(fechas.fecha_inicio);
  const fechaFin = new Date(fechas.fecha_fin);
  const dias = Math.max(1, Math.ceil((fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24)) + 1);
  const activosPorDia = totalActivos / dias;

  // Tipo de crédito
  const tipoCredito = reportePorTipoCredito?.datos ?? [];
  const cre30 = tipoCredito.find(d => d.Etiqueta === "CRE_30");
  const con = tipoCredito.find(d => d.Etiqueta === "CON");
  const cre30Count = cre30 ? parseNumberLabel(cre30.Valor) : 0;
  const conCount = con ? parseNumberLabel(con.Valor) : 0;
  const totalTipoCredito = tipoCredito
    .filter(d => !d.Etiqueta.includes("EMP"))
    .reduce((s, d) => s + parseNumberLabel(d.Valor), 0);
  const cre30Pct = totalTipoCredito > 0 ? (cre30Count / totalTipoCredito) * 100 : 0;
  const conPct = totalTipoCredito > 0 ? (conCount / totalTipoCredito) * 100 : 0;

  // Rangos
  const rangos = reportePorRango?.datos ?? [];
  const rangosSorted = rangos
    .filter(d => !d.Etiqueta.includes("EMP"))
    .map(d => ({
      rango: d.Etiqueta,
      count: parseNumberLabel(d.Valor),
    }))
    .sort((a, b) => b.count - a.count);
  
  const totalRangos = rangosSorted.reduce((s, d) => s + d.count, 0);
  const rangoMayorBase = rangosSorted[0] ?? { rango: "N/A", count: 0 };
  const rangoMayor = {
    ...rangoMayorBase,
    pct: totalRangos > 0 ? (rangoMayorBase.count / totalRangos) * 100 : 0,
  };
  
  const rangosMenores125 = rangos
    .filter(d => d.Etiqueta.includes("<= a $30") || d.Etiqueta.includes("<= a $125"))
    .reduce((s, d) => s + parseNumberLabel(d.Valor), 0);
  const rangosMayores125 = rangos
    .filter(d => d.Etiqueta.includes("<= a $250") || d.Etiqueta.includes("> a $250"))
    .reduce((s, d) => s + parseNumberLabel(d.Valor), 0);
  const pctBajoTicket = totalRangos > 0 ? (rangosMenores125 / totalRangos) * 100 : 0;

  // Zonas
  const zonas = reportePorZona?.datos ?? [];
  const zonasSorted = zonas
    .filter(d => !d.Etiqueta.includes("#OTR") && !d.Etiqueta.includes("#EMP"))
    .map(d => ({
      zona: d.Etiqueta,
      count: parseNumberLabel(d.Valor),
    }))
    .sort((a, b) => b.count - a.count);
  
  const zonasActivas = zonasSorted.length;
  const totalZonas = zonasSorted.reduce((s, d) => s + d.count, 0);
  const zonaTopBase = zonasSorted[0] ?? { zona: "N/A", count: 0 };
  const zonaTop = {
    ...zonaTopBase,
    pct: totalZonas > 0 ? (zonaTopBase.count / totalZonas) * 100 : 0,
  };
  
  const top3Zonas = zonasSorted.slice(0, 3).reduce((s, d) => s + d.count, 0);
  const concentracionTop3Zonas = totalZonas > 0 ? (top3Zonas / totalZonas) * 100 : 0;

  // Años
  const anios = reportePorAnio?.datos ?? [];
  const aniosSorted = anios
    .filter(d => !d.Etiqueta.includes("EMP") && !d.Etiqueta.includes("OTR"))
    .map(d => ({
      anio: d.Etiqueta,
      count: parseNumberLabel(d.Valor),
    }))
    .sort((a, b) => b.count - a.count);
  
  const anioMasReciente = aniosSorted[0] ?? { anio: "N/A", count: 0 };
  const aniosPico = aniosSorted.slice(0, 3);
  
  const currentYear = new Date().getFullYear();
  const activosRecientes = anios
    .filter(d => {
      const year = parseInt(d.Etiqueta);
      return !isNaN(year) && year >= currentYear - 3;
    })
    .reduce((s, d) => s + parseNumberLabel(d.Valor), 0);
  
  const activosAntiguos = anios
    .filter(d => {
      const year = parseInt(d.Etiqueta);
      return !isNaN(year) && year < currentYear - 5;
    })
    .reduce((s, d) => s + parseNumberLabel(d.Valor), 0);

  return {
    totalActivos,
    activosPorDia,
    dias,
    cre30Count,
    cre30Pct,
    conCount,
    conPct,
    rangoMayor,
    rangosMenores125,
    rangosMayores125,
    pctBajoTicket,
    zonasActivas,
    zonaTop,
    concentracionTop3Zonas,
    anioMasReciente,
    aniosPico,
    activosAntiguos,
    activosRecientes,
  };
}

export function useActivosKpis(
  fechas: FechasParams | null,
  options?: UseActivosKpisOptions
) {
  const {
    reportePorZona,
    reportePorTipoCredito,
    reportePorRango,
    reportePorAnio,
    initialActivosData,
    initialDataUpdatedAt,
    detallesSonPlaceholder,
  } = options ?? {};

  const hasSsrHydration =
    fechas != null &&
    initialActivosData != null &&
    reportePorZona != null &&
    reportePorTipoCredito != null &&
    reportePorRango != null &&
    reportePorAnio != null;

  const initialData = hasSsrHydration
    ? calculateActivosKpis(
        initialActivosData,
        reportePorZona,
        reportePorTipoCredito,
        reportePorRango,
        reportePorAnio,
        fechas
      )
    : undefined;

  const detallesListos =
    reportePorZona != null &&
    reportePorTipoCredito != null &&
    reportePorRango != null &&
    reportePorAnio != null;

  const query = useQuery({
    queryKey: ["activos", "kpis", fechas],
    queryFn: async ({ signal }) => {
      if (!fechas) throw new Error("Fechas requeridas");
      const activosRes = await getActivos(fechas, signal);
      if (!activosRes.success) {
        throw new Error(activosRes.error.message);
      }
      const activosData = "data" in activosRes ? activosRes.data.detalle : null;
      if (!activosData) {
        throw new Error("Datos de activos principal inválidos");
      }
      return calculateActivosKpis(
        activosData,
        reportePorZona!,
        reportePorTipoCredito!,
        reportePorRango!,
        reportePorAnio!,
        fechas
      );
    },
    enabled: !!fechas && detallesListos && !detallesSonPlaceholder,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
    initialData,
    initialDataUpdatedAt,
  });

  return {
    kpis: query.data,
    state: query.isFetching || query.isLoading ? "loading" : query.isError ? "error" : "success",
    error: query.error instanceof Error ? query.error.message : null,
  };
}
