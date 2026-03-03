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
 * Formatea una fecha para la API (YYYY-MM-DD)
 */
export function formatDateApi(date: Date): string {
  return date.toISOString().split("T")[0] ?? "";
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
      start = new Date(today);
      start.setDate(start.getDate() - 29);
      break;
    case "mesActual":
      start = new Date(today.getFullYear(), today.getMonth(), 1);
      end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
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

export function getPeriodLabel(period: "hoy" | "7dias" | "30dias" | "mesActual"): string {
  const labels = {
    hoy: "Hoy",
    "7dias": "7 días",
    "30dias": "30 días",
    mesActual: "Mes actual",
  };
  return labels[period];
}
