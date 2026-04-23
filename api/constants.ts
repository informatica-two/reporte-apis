export const API_CONFIG = {
  baseUrl: process.env.VOGUE_API_BASE_URL ?? "https://mivogue.com:83/APIs",
  auth: {
    username: process.env.VOGUE_API_USER ?? "",
    password: process.env.VOGUE_API_PASSWORD ?? "",
  },
  frontendSource: process.env.NEXT_PUBLIC_FRONTEND_SOURCE ?? "",
  timeout: 600000,
} as const;

export const API_ENDPOINTS = {
  reporteVisual: {
    activos: "/reporte_visual/activos",
    activosDetalle1: "/reporte_visual/activos/detalle_1",
    activosDetalle2: "/reporte_visual/activos/detalle_2",
    activosDetalle3: "/reporte_visual/activos/detalle_3",
    activosDetalle4: "/reporte_visual/activos/detalle_4",
    cobros: "/reporte_visual/cobros",
    cobrosDetalle1: "/reporte_visual/cobros/detalle_1",
    cobrosDetalle2: "/reporte_visual/cobros/detalle_2",
    cobrosDetalle3: "/reporte_visual/cobros/detalle_3",
    cobrosDetalle4: "/reporte_visual/cobros/detalle_4",
    venta: "/reporte_visual/venta",
    ventaDetalle1: "/reporte_visual/venta/detalle_1",
    ventaDetalle2: "/reporte_visual/venta/detalle_2",
    ventaDetalle3: "/reporte_visual/venta/detalle_3",
    ventaDetalle4: "/reporte_visual/venta/detalle_4",
    ventaDetalle5: "/reporte_visual/venta/detalle_5",
    reclutamientos: "/reporte_visual/reclutamientos",
    reclutamientosDetalle1: "/reporte_visual/reclutamientos/detalle_1",
    reclutamientosDetalle2: "/reporte_visual/reclutamientos/detalle_2",
    reclutamientosDetalle3: "/reporte_visual/reclutamientos/detalle_3",
    reclutamientosDetalle4: "/reporte_visual/reclutamientos/detalle_4",
  },
} as const;

/** Formato para fecha_inicio y fecha_fin: YYYY-MM-DD (ej: 2026-02-01) */
export const DATE_FORMAT = "YYYY-MM-DD";
