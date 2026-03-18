import type { FormatoValor } from "@/config/dashboard-personalizable";

export function formatearValor(
  valor: number,
  formato: FormatoValor = "numero",
  abreviado = false
): string {
  if (abreviado && Math.abs(valor) >= 1_000_000) {
    const abrev = (valor / 1_000_000).toFixed(1);
    return formato === "moneda" ? `$${abrev}M` : `${abrev}M`;
  }
  if (abreviado && Math.abs(valor) >= 1_000) {
    const abrev = (valor / 1_000).toFixed(0);
    return formato === "moneda" ? `$${abrev}K` : `${abrev}K`;
  }
  if (formato === "moneda") {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(valor);
  }
  if (formato === "porcentaje") {
    return `${valor.toFixed(1)}%`;
  }
  return new Intl.NumberFormat("es-MX").format(valor);
}
