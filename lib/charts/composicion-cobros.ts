import type { ReporteKpis } from "@/hooks/use-reporte-data";

export type ComposicionCobrosPieItem = {
  name: string;
  value: number;
  fill: string;
  /** Valor real para tooltip cuando value está inflado para visibilidad */
  actualValue?: number;
};

/** Mínimo % del total para que un segmento sea visible en el donut */
const MIN_VISIBLE_PCT = 0.02;

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

  const total = cobroBruto || cobroNeto + anulaciones || 1;
  const pctAnul = anulaciones / total;

  let displayCobroNeto = cobroNeto;
  let displayAnulaciones = anulaciones;

  if (anulaciones > 0 && pctAnul < MIN_VISIBLE_PCT) {
    displayAnulaciones = total * MIN_VISIBLE_PCT;
    displayCobroNeto = total - displayAnulaciones;
  }

  const pieData: ComposicionCobrosPieItem[] = [
    { name: "Cobro neto", value: displayCobroNeto, fill: "var(--palette-6)" },
    {
      name: "Anulaciones",
      value: displayAnulaciones,
      fill: "var(--chart-5)",
      ...(displayAnulaciones !== anulaciones && { actualValue: anulaciones }),
    },
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
