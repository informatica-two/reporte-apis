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
