import { formatMoney } from "@/lib/utils";
import type { ReporteKpis } from "@/hooks/use-reporte-data";

export type VentasVsCobrosBarItem = {
  name: string;
  valor: number;
};

export function formatRatio(n: number): string {
  return (Math.round(n * 100) / 100).toFixed(2) + "×";
}

export function getVentasVsCobrosChartData(kpis: ReporteKpis): VentasVsCobrosBarItem[] {
  return [
    { name: "Venta neta", valor: kpis.ventaNeta },
    { name: "Cobro neto", valor: kpis.cobroNeto },
  ];
}

export function getVentasVsCobrosInsights(kpis: ReporteKpis): string[] {
  const insights: string[] = [];
  const { ratioCobrosVentas, pctDevoluciones, pctAnulaciones } = kpis;

  if (ratioCobrosVentas > 1.1) {
    insights.push(
      "Se está cobrando más de lo vendido en el período. Puede incluir cobros de ventas anteriores."
    );
  } else if (ratioCobrosVentas < 0.9) {
    insights.push(
      "Hay ventas pendientes de cobro. Flujo de caja puede verse afectado."
    );
  } else if (ratioCobrosVentas >= 0.95 && ratioCobrosVentas <= 1.05) {
    insights.push("Ventas y cobros bien alineados en el período.");
  }

  if (pctDevoluciones > 5) {
    insights.push(
      `El ${pctDevoluciones.toFixed(1)}% de devoluciones reduce la venta neta vs cobro.`
    );
  }

  if (pctAnulaciones > 3) {
    insights.push(
      `El ${pctAnulaciones.toFixed(1)}% de anulaciones en cobros impacta el ingreso efectivo.`
    );
  }

  const diff = kpis.cobroNeto - kpis.ventaNeta;
  if (Math.abs(diff) > kpis.ventaNeta * 0.1 && insights.length === 0) {
    if (diff > 0) {
      insights.push(
        `${formatMoney(diff)} más en cobros que en ventas del período.`
      );
    } else {
      insights.push(
        `${formatMoney(-diff)} en ventas aún pendientes de cobro.`
      );
    }
  }

  if (insights.length === 0) {
    insights.push("Ratio saludable. Ventas y cobros coherentes con el período.");
  }

  return insights;
}

export type RatioVariant = "up" | "down" | "neutral";

export function getRatioVariant(ratio: number): RatioVariant {
  if (ratio > 1.05) return "up";
  if (ratio < 0.95) return "down";
  return "neutral";
}
