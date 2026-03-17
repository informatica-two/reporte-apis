export { vogueApi } from "./axios";
export {
  getActivos,
  getCobros,
  getVenta,
  getVentaDetalle1,
  getVentaDetalle2,
  getReclutamientos,
} from "./reporteVisual";
export type {
  FechasParams,
  ApiResult,
  ApiError,
} from "./types";
export { isValidDateFormat, validateFechasParams } from "./types";
export { API_CONFIG, API_ENDPOINTS, DATE_FORMAT } from "./constants";
