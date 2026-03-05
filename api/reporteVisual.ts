import { API_ENDPOINTS } from "./constants";
import { apiPostFormData } from "./client";
import type {
  FechasParams,
  ReporteVisualResponse,
  ActivosDetalle,
  CobrosDetalle,
  VentaDetalle,
} from "./types";
import type { ApiResult } from "./types";
import { validateFechasParams } from "./types";

/** Usa el proxy de Next.js en el navegador para evitar CORS y exponer credenciales */
async function fetchViaProxy<T>(
  endpoint: string,
  params: FechasParams,
  signal?: AbortSignal
): Promise<ApiResult<ReporteVisualResponse<T>>> {
  const formData = new FormData();
  formData.append("fecha_inicio", params.fecha_inicio);
  formData.append("fecha_fin", params.fecha_fin);

  const res = await fetch(`/api/reporte-visual/${endpoint}`, {
    method: "POST",
    body: formData,
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
