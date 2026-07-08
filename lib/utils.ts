import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Formato dinero: $2,000.00 (comas miles, punto decimales, 2 decimales) */
export function formatMoney(n: number): string {
  return (
    "$" +
    n.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  )
}

/** Formato número entero: 2,000 (comas miles, sin decimales) */
export function formatNumber(n: number): string {
  return n.toLocaleString("en-US", {
    maximumFractionDigits: 0,
  })
}

/** Formato porcentaje: 25.5% (1 decimal) */
export function formatPercent(n: number): string {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }) + "%"
}

/** Parsea label de la API (ej: "1,234" o "$1.234") a número */
export function parseNumberLabel(label: string | undefined): number {
  if (label == null || typeof label !== "string") return 0;
  const cleaned = label.replace(/[^\d.,-]/g, "").replace(/,/g, "");
  const n = parseFloat(cleaned);
  return Number.isNaN(n) ? 0 : n;
}

/**
 * Determina si una etiqueta/nombre corresponde a un valor tipo "Otros"/"Otras"
 * que no debe mostrarse en ninguna gráfica, KPI o tabla del dashboard.
 * Cubre variantes como "Otros", "Otras", "#OTR", "OTR" (código corto usado por
 * la API para agrupar zonas/municipios/categorías residuales) y frases como
 * "Otras zonas" u "Otros municipios".
 */
export function esEtiquetaOtros(valor: unknown): boolean {
  if (typeof valor !== "string") return false;
  // Quita "#" inicial (la API antepone "#" a algunos códigos de agrupación)
  // y espacios sobrantes, y pasa a minúsculas.
  const normalizado = valor.trim().toLowerCase().replace(/^#+/, "").trim();
  if (!normalizado) return false;

  if (normalizado === "otros" || normalizado === "otras" || normalizado === "otr") {
    return true;
  }

  // "otras zonas", "otros municipios", "otra categoría", etc.
  if (/^otr[oa]s?(\b|_)/.test(normalizado)) {
    return true;
  }

  return false;
}

/**
 * Filtra de un arreglo de datos cualquier elemento cuya etiqueta sea
 * "Otros" u "Otras" (en cualquier variante de mayúsculas/espacios).
 * `getEtiqueta` extrae el texto de la etiqueta de cada elemento.
 */
export function filtrarDatosOtros<T>(
  datos: T[] | undefined | null,
  getEtiqueta: (item: T) => unknown
): T[] {
  if (!datos || !Array.isArray(datos)) return datos ?? [];
  return datos.filter((item) => !esEtiquetaOtros(getEtiqueta(item)));
}
