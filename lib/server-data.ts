import {
  getActivos,
  getCobros,
  getVenta,
  getReclutamientos,
  getVentaDetalle1,
  getVentaDetalle2,
} from "@/api/reporteVisual";
import type { FechasParams, ReportePorZonaDetalle } from "@/api/types";
import { parseNumberLabel } from "@/lib/utils";
import { getDateRangeByPeriod } from "@/lib/date-utils";
import type { ReporteKpis } from "@/hooks/use-reporte-data";

const DEFAULT_PERIOD = "30dias";

export function getDefaultFechas(): FechasParams {
  return getDateRangeByPeriod(DEFAULT_PERIOD);
}

/**
 * Fetch inicial de KPIs desde el servidor (sin detalles de venta).
 * Se ejecuta en Server Component para SSR.
 */
export async function fetchKpisServer(
  fechas: FechasParams = getDefaultFechas()
): Promise<{ kpis: ReporteKpis | null; error: string | null }> {
  try {
    const [activosRes, cobrosRes, ventaRes, reclutamientosRes] =
      await Promise.all([
        getActivos(fechas),
        getCobros(fechas),
        getVenta(fechas),
        getReclutamientos(fechas),
      ]);

    if (!activosRes.success) {
      return { kpis: null, error: activosRes.error.message };
    }
    if (!cobrosRes.success) {
      return { kpis: null, error: cobrosRes.error.message };
    }
    if (!ventaRes.success) {
      return { kpis: null, error: ventaRes.error.message };
    }
    if (!reclutamientosRes.success) {
      return { kpis: null, error: reclutamientosRes.error.message };
    }

    const a = "data" in activosRes ? activosRes.data.detalle : null;
    const c = "data" in cobrosRes ? cobrosRes.data.detalle : null;
    const v = "data" in ventaRes ? ventaRes.data.detalle : null;
    const r = "data" in reclutamientosRes ? reclutamientosRes.data.detalle : 0;

    if (!a || !c || !v) {
      return { kpis: null, error: "Datos incompletos" };
    }

    const dias = a.dias || c.dias || v.dias || 1;
    const devoluciones = parseNumberLabel(v.devoluciones_label);
    const anulaciones = parseNumberLabel(c.anulaciones_label);

    const kpis: ReporteKpis = {
      activoNeto: a.activo_neto,
      cobroBruto: c.cobro_bruto,
      cobroNeto: c.cobro_neto,
      ventaBruta: v.venta_bruta,
      ventaNeta: v.venta_neta,
      devoluciones,
      anulaciones,
      reclutamientos: r,
      arpu: a.activo_neto > 0 ? c.cobro_neto / a.activo_neto : 0,
      cobroPromedioDia: dias > 0 ? c.cobro_neto / dias : 0,
      ventaPromedioDia: dias > 0 ? v.venta_neta / dias : 0,
      pctDevoluciones:
        v.venta_bruta > 0 ? (devoluciones / v.venta_bruta) * 100 : 0,
      pctAnulaciones: c.cobro_bruto > 0 ? (anulaciones / c.cobro_bruto) * 100 : 0,
      ratioCobrosVentas: v.venta_neta > 0 ? c.cobro_neto / v.venta_neta : 0,
      reclutamientosDia: dias > 0 ? r / dias : 0,
      dias,
    };

    return { kpis, error: null };
  } catch (e) {
    return {
      kpis: null,
      error: e instanceof Error ? e.message : "Error al cargar datos",
    };
  }
}

/**
 * Fetch inicial de detalles de venta desde el servidor.
 * Se ejecuta en Server Component para SSR.
 */
export async function fetchVentaDetallesServer(
  fechas: FechasParams = getDefaultFechas()
): Promise<{
  reportePorZona: ReportePorZonaDetalle | null;
  reportePorImpulsadora: ReportePorZonaDetalle | null;
  error: string | null;
}> {
  try {
    const [ventaDetalle1Res, ventaDetalle2Res] = await Promise.all([
      getVentaDetalle1(fechas),
      getVentaDetalle2(fechas),
    ]);

    let reportePorZona: ReportePorZonaDetalle | null = null;
    let reportePorImpulsadora: ReportePorZonaDetalle | null = null;

    if (ventaDetalle1Res.success && "data" in ventaDetalle1Res) {
      const detalle = ventaDetalle1Res.data.detalle;
      reportePorZona = detalle && Array.isArray(detalle.datos) ? detalle : null;
    } else {
      return {
        reportePorZona: null,
        reportePorImpulsadora: null,
        error: ventaDetalle1Res.error.message,
      };
    }

    if (ventaDetalle2Res.success && "data" in ventaDetalle2Res) {
      const detalle = ventaDetalle2Res.data.detalle;
      reportePorImpulsadora =
        detalle && Array.isArray(detalle.datos) ? detalle : null;
    } else {
      return {
        reportePorZona: null,
        reportePorImpulsadora: null,
        error: ventaDetalle2Res.error.message,
      };
    }

    return { reportePorZona, reportePorImpulsadora, error: null };
  } catch (e) {
    return {
      reportePorZona: null,
      reportePorImpulsadora: null,
      error: e instanceof Error ? e.message : "Error al cargar datos",
    };
  }
}
