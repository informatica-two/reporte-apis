import { API_ENDPOINTS } from "./constants";
import { apiPostFormData } from "./client";
import type {
  FechasParams,
  ReporteVisualResponse,
  ActivosDetalle,
  CobrosDetalle,
  VentaDetalle,
} from "./types";
import { validateFechasParams } from "./types";

function createReporteFetcher<T>(endpoint: string) {
  return async (params: FechasParams) => {
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
    return apiPostFormData<ReporteVisualResponse<T>>(endpoint, params);
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
