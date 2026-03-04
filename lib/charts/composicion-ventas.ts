import type { ReporteKpis } from "@/hooks/use-reporte-data";

export type ComposicionVentasPieItem = {
  name: string;
  value: number;
  fill: string;
};

export type ComposicionVentasData = {
  pieData: ComposicionVentasPieItem[];
  displayData: ComposicionVentasPieItem[];
  emptyData: boolean;
  ventaBruta: number;
  ventaNeta: number;
  devoluciones: number;
  pctDevoluciones: number;
  hasDevoluciones: boolean;
};

export function getComposicionVentasData(kpis: ReporteKpis): ComposicionVentasData {
  const { ventaBruta, devoluciones, ventaNeta, pctDevoluciones } = kpis;

  const pieData: ComposicionVentasPieItem[] = [
    { name: "Venta neta", value: ventaNeta, fill: "var(--chart-4)" },
    { name: "Devoluciones", value: devoluciones, fill: "var(--chart-2)" },
  ].filter((d) => d.value > 0);

  const emptyData = pieData.length === 0;
  const displayData = emptyData
    ? [{ name: "Sin datos", value: 1, fill: "var(--muted)" }]
    : pieData;

  return {
    pieData,
    displayData,
    emptyData,
    ventaBruta,
    ventaNeta,
    devoluciones,
    pctDevoluciones,
    hasDevoluciones: devoluciones > 0,
  };
}
