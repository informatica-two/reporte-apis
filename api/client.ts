import type { AxiosError } from "axios";
import { vogueApi } from "./axios";
import type { ApiError, ApiResult } from "./types";

function normalizeError(error: unknown): ApiError {
  if (error && typeof error === "object" && "isAxiosError" in error) {
    const axiosError = error as AxiosError<{ message?: string; detalle?: string }>;
    const data = axiosError.response?.data;
    const msg = data?.detalle ?? data?.message;
    return {
      message: msg ?? axiosError.message ?? "Error de conexión",
      statusCode: axiosError.response?.status,
      code: axiosError.code,
      originalError: error,
    };
  }
  if (error instanceof Error) {
    return {
      message: error.message,
      originalError: error,
    };
  }
  return {
    message: "Error desconocido",
    originalError: error,
  };
}

/**
 * Ejecuta una petición POST con multipart/form-data (fecha_inicio, fecha_fin).
 * Usado por los endpoints de reporte_visual.
 */
export async function apiPostFormData<T>(
  url: string,
  params: Record<string, string>
): Promise<ApiResult<T>> {
  try {
    if (process.env.NODE_ENV === "development") {
      console.log(`[API] 🌐 POST ${url}`, params);
    }
    const startTime = performance.now();
    
    const formData = new FormData();
    for (const [key, value] of Object.entries(params)) {
      formData.append(key, value);
    }
    const response = await vogueApi.post<T>(url, formData);
    
    const duration = Math.round(performance.now() - startTime);
    if (process.env.NODE_ENV === "development") {
      console.log(`[API] ✅ ${url} completed in ${duration}ms`);
    }
    
    return { success: true, data: response.data };
  } catch (error) {
    const apiError = normalizeError(error);
    if (process.env.NODE_ENV === "development") {
      const err = error as { response?: { status?: number; data?: unknown } };
      console.error(
        `[API Error] ❌ ${url}:`,
        apiError.message,
        apiError.statusCode ?? err.response?.status,
        err.response?.data
      );
    }
    return { success: false, error: apiError };
  }
}
