import { API_ENDPOINTS } from "./constants";
import { apiPostFormData } from "./client";
import type {
  FechasParams,
  ReporteVisualResponse,
  ActivosDetalle,
  CobrosDetalle,
  VentaDetalle,
  ReportePorZonaDetalle,
} from "./types";
import type { ApiResult } from "./types";
import { validateFechasParams } from "./types";

/** Usa el proxy de Next.js en el navegador para evitar CORS y exponer credenciales */
async function fetchViaProxy<T>(
  endpoint: string,
  params: FechasParams,
  signal?: AbortSignal
): Promise<ApiResult<ReporteVisualResponse<T>>> {
  const res = await fetch(`/api/reporte-visual/${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fecha_inicio: params.fecha_inicio,
      fecha_fin: params.fecha_fin,
    }),
    signal,
  });
  const data = await res.json();

  if (!res.ok) {
    return {
      success: false,
      error: {
        message: data.detalle ?? data.message ?? "Error de conexión",
        statusCode: res.status,
      },
    };
  }
  // La API puede devolver 200 con success: false (ej: credenciales incorrectas)
  if (data.success === false) {
    return {
      success: false,
      error: {
        message:
          typeof data.detalle === "string"
            ? data.detalle
            : "Error en la respuesta de la API",
      },
    };
  }
  return { success: true, data };
}

function getEndpointName(path: string): string {
  return path.replace(/^\/reporte_visual\//, "") || path;
}

function createReporteFetcher<T>(endpointPath: string) {
  const endpointName = getEndpointName(endpointPath);
  return async (params: FechasParams, signal?: AbortSignal) => {
    const validation = validateFechasParams(params);
    if (!validation.valid) {
      return {
        success: false,
        error: {
          message: validation.error ?? "Parámetros inválidos",
          code: "VALIDATION_ERROR",
        },
      };
    }
    // En el navegador usar proxy; en Node (scripts) usar API directa
    if (typeof window !== "undefined") {
      return fetchViaProxy<T>(endpointName, params, signal);
    }
    return apiPostFormData<ReporteVisualResponse<T>>(endpointPath, params);
  };
}

/**
 * Obtiene el reporte de activos para el rango de fechas indicado.
 */
export const getActivos =
  createReporteFetcher<ActivosDetalle>(API_ENDPOINTS.reporteVisual.activos);

/**
 * Obtiene el reporte de cobros para el rango de fechas indicado.
 */
export const getCobros =
  createReporteFetcher<CobrosDetalle>(API_ENDPOINTS.reporteVisual.cobros);

/**
 * Obtiene el reporte de venta para el rango de fechas indicado.
 */
export const getVenta =
  createReporteFetcher<VentaDetalle>(API_ENDPOINTS.reporteVisual.venta);

/**
 * Obtiene el reporte de reclutamientos para el rango de fechas indicado.
 * detalle es un número.
 */
export const getReclutamientos = createReporteFetcher<number>(
  API_ENDPOINTS.reporteVisual.reclutamientos
);

/**
 * Obtiene el reporte por zona (venta/detalle_1) para el rango de fechas indicado.
 * Incluye titulo_reporte y datos con Etiqueta (zona) y Valor (monto).
 */
export const getVentaDetalle1 =
  createReporteFetcher<ReportePorZonaDetalle>(
    API_ENDPOINTS.reporteVisual.ventaDetalle1
  );

/**
 * Obtiene el reporte por impulsadora (venta/detalle_2) para el rango de fechas indicado.
 * Misma estructura que detalle_1: titulo_reporte y datos (Etiqueta, Valor).
 */
export const getVentaDetalle2 =
  createReporteFetcher<ReportePorZonaDetalle>(
    API_ENDPOINTS.reporteVisual.ventaDetalle2
  );

/**
 * Obtiene el reporte detalle_3 para el rango de fechas indicado.
 * Misma estructura: titulo_reporte y datos (Etiqueta, Valor).
 */
export const getVentaDetalle3 =
  createReporteFetcher<ReportePorZonaDetalle>(
    API_ENDPOINTS.reporteVisual.ventaDetalle3
  );

/**
 * Obtiene el reporte por tipo de crédito (venta/detalle_4) para el rango de fechas indicado.
 * Misma estructura: titulo_reporte y datos (Etiqueta, Valor).
 */
export const getVentaDetalle4 =
  createReporteFetcher<ReportePorZonaDetalle>(
    API_ENDPOINTS.reporteVisual.ventaDetalle4
  );

/**
 * Obtiene el reporte por tipo de crédito (venta/detalle_5) para el rango de fechas indicado.
 * Misma estructura: titulo_reporte y datos (Etiqueta, Valor).
 */
  export const getVentaDetalle5 =
  createReporteFetcher<ReportePorZonaDetalle>(
    API_ENDPOINTS.reporteVisual.ventaDetalle5
  );

/**
 * Obtiene el reporte de cobros por medio (cobros/detalle_1) para el rango de fechas indicado.
 * Incluye titulo_reporte y datos con Etiqueta (medio) y Valor (monto).
 */
export const getCobrosDetalle1 =
  createReporteFetcher<ReportePorZonaDetalle>(
    API_ENDPOINTS.reporteVisual.cobrosDetalle1
  );

/**
 * Obtiene el reporte de cobros por tipo documento (cobros/detalle_2) para el rango de fechas indicado.
 * Misma estructura: titulo_reporte y datos (Etiqueta, Valor).
 */
export const getCobrosDetalle2 =
  createReporteFetcher<ReportePorZonaDetalle>(
    API_ENDPOINTS.reporteVisual.cobrosDetalle2
  );

/**
 * Obtiene el reporte de cobros por municipio (cobros/detalle_3) para el rango de fechas indicado.
 * Misma estructura: titulo_reporte y datos (Etiqueta, Valor).
 */
export const getCobrosDetalle3 =
  createReporteFetcher<ReportePorZonaDetalle>(
    API_ENDPOINTS.reporteVisual.cobrosDetalle3
  );

/**
 * Obtiene el reporte de cobros por zona (cobros/detalle_4) para el rango de fechas indicado.
 * Misma estructura: titulo_reporte y datos (Etiqueta, Valor).
 */
export const getCobrosDetalle4 =
  createReporteFetcher<ReportePorZonaDetalle>(
    API_ENDPOINTS.reporteVisual.cobrosDetalle4
  );

/**
 * Obtiene el reporte de activos por zona (activos/detalle_1) para el rango de fechas indicado.
 * Misma estructura: titulo_reporte y datos (Etiqueta, Valor).
 */
export const getActivosDetalle1 =
  createReporteFetcher<ReportePorZonaDetalle>(
    API_ENDPOINTS.reporteVisual.activosDetalle1
  );

/**
 * Obtiene el reporte de activos por tipo de crédito (activos/detalle_2) para el rango de fechas indicado.
 * Misma estructura: titulo_reporte y datos (Etiqueta, Valor).
 */
export const getActivosDetalle2 =
  createReporteFetcher<ReportePorZonaDetalle>(
    API_ENDPOINTS.reporteVisual.activosDetalle2
  );

/**
 * Obtiene el reporte de activos por rango (activos/detalle_3) para el rango de fechas indicado.
 * Misma estructura: titulo_reporte y datos (Etiqueta, Valor).
 */
export const getActivosDetalle3 =
  createReporteFetcher<ReportePorZonaDetalle>(
    API_ENDPOINTS.reporteVisual.activosDetalle3
  );

/**
 * Obtiene el reporte de activos por año (activos/detalle_4) para el rango de fechas indicado.
 * Misma estructura: titulo_reporte y datos (Etiqueta, Valor).
 */
export const getActivosDetalle4 =
  createReporteFetcher<ReportePorZonaDetalle>(
    API_ENDPOINTS.reporteVisual.activosDetalle4
  );

/**
 * Obtiene el reporte de reclutamientos por tipo (reclutamientos/detalle_1).
 * Incluye titulo_reporte y datos con Etiqueta (tipo) y Valor (cantidad).
 */
export const getReclutamientosDetalle1 =
  createReporteFetcher<ReportePorZonaDetalle>(
    API_ENDPOINTS.reporteVisual.reclutamientosDetalle1
  );

/**
 * Obtiene el reporte de reclutamientos por estatus (reclutamientos/detalle_2).
 * Incluye titulo_reporte y datos con Etiqueta (estatus) y Valor (cantidad).
 */
export const getReclutamientosDetalle2 =
  createReporteFetcher<ReportePorZonaDetalle>(
    API_ENDPOINTS.reporteVisual.reclutamientosDetalle2
  );

/**
 * Obtiene el reporte de reclutamientos por estatus (reclutamientos/detalle_3).
 * Incluye titulo_reporte y datos con Etiqueta (estatus) y Valor (cantidad).
 */
export const getReclutamientosDetalle3 =
  createReporteFetcher<ReportePorZonaDetalle>(
    API_ENDPOINTS.reporteVisual.reclutamientosDetalle3
  );

/**
 * Obtiene el reporte de reclutamientos por tipo de crédito (reclutamientos/detalle_4).
 * Incluye titulo_reporte y datos con Etiqueta (tipo crédito) y Valor (cantidad).
 */
export const getReclutamientosDetalle4 =
  createReporteFetcher<ReportePorZonaDetalle>(
    API_ENDPOINTS.reporteVisual.reclutamientosDetalle4
  );
