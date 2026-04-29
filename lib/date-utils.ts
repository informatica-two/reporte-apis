import type { FechasParams } from "@/api/types";

/**
 * Formatea una fecha para mostrar en UI (ej: "01 feb 2026")
 */
export function formatDateDisplay(date: Date): string {
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/**
 * Formatea un rango de fechas para mostrar en UI (ej: "01 feb 2026 – 03 mar 2026")
 */
export function formatDateRangeDisplay(from?: Date, to?: Date): string {
  if (!from) return "Seleccionar fechas";
  if (!to || from.getTime() === to.getTime()) return formatDateDisplay(from);
  return `${formatDateDisplay(from)} – ${formatDateDisplay(to)}`;
}

/**
 * Formatea una fecha para la API (YYYY-MM-DD) usando fecha local (evita desfase por timezone)
 */
export function formatDateApi(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Parsea YYYY-MM-DD como fecha local (evita desfase por timezone) */
export function parseLocalDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

/**
 * Obtiene el rango de fechas según el período seleccionado
 */
export function getDateRangeByPeriod(period: "hoy" | "7dias" | "30dias" | "mesActual"): {
  fecha_inicio: string;
  fecha_fin: string;
} {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  let start: Date;
  let end: Date = new Date(today);

  switch (period) {
    case "hoy":
      start = new Date(today);
      end = new Date(today);
      break;
    case "7dias":
      start = new Date(today);
      start.setDate(start.getDate() - 6);
      break;
    case "30dias":
      /* 30 días inclusivos con hoy como último día (ej: 2 feb – 3 mar) */
      start = new Date(today);
      start.setDate(start.getDate() - 29);
      break;
    case "mesActual":
      start = new Date(today.getFullYear(), today.getMonth(), 1);
      /* Fin = hoy (no permitir fechas futuras) */
      end = new Date(today);
      break;
    default:
      start = new Date(today);
      start.setDate(start.getDate() - 29);
  }

  return {
    fecha_inicio: formatDateApi(start),
    fecha_fin: formatDateApi(end),
  };
}

/**
 * Rango por defecto del dashboard: mismos 30 días inclusivos que el preset "30 días"
 * del selector (fecha local + formatDateApi, alineado con SSR y cliente).
 */
export function getDefaultFechas(): FechasParams {
  return getDateRangeByPeriod("mesActual");
}

export function getPeriodLabel(period: "hoy" | "7dias" | "30dias" | "mesActual"): string {
  const labels = {
    hoy: "Hoy",
    "7dias": "7 días",
    "30dias": "30 días",
    mesActual: "Mes actual",
  };
  return labels[period];
}
