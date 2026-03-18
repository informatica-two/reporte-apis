import type { FechasParams } from "@/api/types";

/**
 * Centraliza todas las query keys para mantener consistencia
 * y facilitar invalidación de caché.
 */
export const queryKeys = {
  /**
   * Key para los KPIs del reporte principal
   * @example ["reporte", "kpis", { fecha_inicio: "2026-03-01", fecha_fin: "2026-03-31" }]
   */
  reporteKpis: (fechas: FechasParams | null) => 
    ["reporte", "kpis", fechas] as const,
  
  /**
   * Key para los detalles de venta (zona + impulsadora + línea + tipo crédito)
   * @example ["venta", "detalles", { fecha_inicio: "2026-03-01", fecha_fin: "2026-03-31" }]
   */
  ventaDetalles: (fechas: FechasParams | null) => 
    ["venta", "detalles", fechas] as const,
  
  /**
   * Key para los detalles de cobros (medio + tipo documento + municipio + zona)
   * @example ["cobros", "detalles", { fecha_inicio: "2026-03-01", fecha_fin: "2026-03-31" }]
   */
  cobrosDetalles: (fechas: FechasParams | null) => 
    ["cobros", "detalles", fechas] as const,
  
  /**
   * Key para los detalles de activos (zona + tipo crédito + rango + año)
   * @example ["activos", "detalles", { fecha_inicio: "2026-03-01", fecha_fin: "2026-03-31" }]
   */
  activosDetalles: (fechas: FechasParams | null) => 
    ["activos", "detalles", fechas] as const,
};
