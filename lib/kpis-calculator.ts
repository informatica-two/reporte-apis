import type { ActivosDetalle, CobrosDetalle, VentaDetalle } from "@/api/types";
import { parseNumberLabel } from "@/lib/utils";
import type { ReporteKpis } from "@/hooks/use-reporte-data";

/**
 * Calcula todos los KPIs derivados a partir de los datos de activos, cobros y venta.
 * Esta función pura se usa tanto en server-side como client-side.
 */
export function calculateKpis(
  activos: ActivosDetalle,
  cobros: CobrosDetalle,
  venta: VentaDetalle,
  reclutamientos: number
): ReporteKpis {
  const dias = activos.dias || cobros.dias || venta.dias || 1;
  const devoluciones = parseNumberLabel(venta.devoluciones_label);
  const anulaciones = parseNumberLabel(cobros.anulaciones_label);

  return {
    activoNeto: activos.activo_neto,
    cobroBruto: cobros.cobro_bruto,
    cobroNeto: cobros.cobro_neto,
    ventaBruta: venta.venta_bruta,
    ventaNeta: venta.venta_neta,
    devoluciones,
    anulaciones,
    reclutamientos,
    arpu: activos.activo_neto > 0 ? cobros.cobro_neto / activos.activo_neto : 0,
    cobroPromedioDia: dias > 0 ? cobros.cobro_neto / dias : 0,
    ventaPromedioDia: dias > 0 ? venta.venta_neta / dias : 0,
    pctDevoluciones:
      venta.venta_bruta > 0 ? (devoluciones / venta.venta_bruta) * 100 : 0,
    pctAnulaciones:
      cobros.cobro_bruto > 0 ? (anulaciones / cobros.cobro_bruto) * 100 : 0,
    ratioCobrosVentas:
      venta.venta_neta > 0 ? cobros.cobro_neto / venta.venta_neta : 0,
    reclutamientosDia: dias > 0 ? reclutamientos / dias : 0,
    dias,
  };
}
