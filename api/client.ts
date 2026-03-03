import type { AxiosError } from "axios";
import { vogueApi } from "./axios";
import type { ApiError, ApiResult } from "./types";

function normalizeError(error: unknown): ApiError {
  if (error && typeof error === "object" && "isAxiosError" in error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    return {
      message:
        axiosError.response?.data?.message ??
        axiosError.message ??
        "Error de conexión",
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
 * Ejecuta una petición GET y retorna un ApiResult tipado.
 * Centraliza el manejo de errores y la estructura de respuesta.
 */
export async function apiGet<T>(url: string, params?: Record<string, string>): Promise<ApiResult<T>> {
  try {
    const response = await vogueApi.get<T>(url, { params });
    return { success: true, data: response.data };
  } catch (error) {
    const apiError = normalizeError(error);
    if (process.env.NODE_ENV === "development") {
      console.error(`[API Error] ${url}:`, apiError);
    }
    return { success: false, error: apiError };
  }
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
    const formData = new FormData();
    for (const [key, value] of Object.entries(params)) {
      formData.append(key, value);
    }
    const response = await vogueApi.post<T>(url, formData);
    return { success: true, data: response.data };
  } catch (error) {
    const apiError = normalizeError(error);
    if (process.env.NODE_ENV === "development") {
      console.error(`[API Error] ${url}:`, apiError);
    }
    return { success: false, error: apiError };
  }
}
