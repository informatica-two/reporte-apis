import type { ReporteKpis } from "@/hooks/use-reporte-data";

export type ComposicionCobrosPieItem = {
  name: string;
  value: number;
  fill: string;
};

export type ComposicionCobrosData = {
  pieData: ComposicionCobrosPieItem[];
  displayData: ComposicionCobrosPieItem[];
  emptyData: boolean;
  cobroBruto: number;
  cobroNeto: number;
  anulaciones: number;
  pctAnulaciones: number;
  hasAnulaciones: boolean;
};

export function getComposicionCobrosData(kpis: ReporteKpis): ComposicionCobrosData {
  const { cobroBruto, cobroNeto, anulaciones, pctAnulaciones } = kpis;

  const pieData: ComposicionCobrosPieItem[] = [
    { name: "Cobro neto", value: cobroNeto, fill: "var(--palette-6)" },
    { name: "Anulaciones", value: anulaciones, fill: "var(--chart-5)" },
  ].filter((d) => d.value > 0);

  const emptyData = pieData.length === 0;
  const displayData = emptyData
    ? [{ name: "Sin datos", value: 1, fill: "var(--muted)" }]
    : pieData;

  return {
    pieData,
    displayData,
    emptyData,
    cobroBruto,
    cobroNeto,
    anulaciones,
    pctAnulaciones,
    hasAnulaciones: anulaciones > 0,
  };
}
