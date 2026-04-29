import { useCallback, useMemo, useState } from "react";
import type { DateRange } from "react-day-picker";
import {
  formatDateApi,
  getDateRangeByPeriod,
  parseLocalDate,
} from "@/lib/date-utils";
import type { FechasParams } from "@/api/types";

export type PeriodKey = "hoy" | "7dias" | "30dias" | "mesActual";

const PERIODS: { key: PeriodKey; label: string }[] = [
  { key: "hoy", label: "Hoy" },
  { key: "7dias", label: "7 días" },
  { key: "30dias", label: "30 días" },
  { key: "mesActual", label: "Mes actual" },
];

const DEFAULT_PERIOD: PeriodKey = "mesActual";

export type UseDateRangeOptions = {
  /** Fechas con las que hidrató el servidor; alinea el calendario y evita onDateChange fantasma al montar. */
  initialFechas?: FechasParams;
};

function matchPeriodKey(fechas: FechasParams): PeriodKey | null {
  const keys: PeriodKey[] = ["hoy", "7dias", "30dias", "mesActual"];
  for (const key of keys) {
    const p = getDateRangeByPeriod(key);
    if (
      p.fecha_inicio === fechas.fecha_inicio &&
      p.fecha_fin === fechas.fecha_fin
    ) {
      return key;
    }
  }
  return null;
}

function getPeriodLabel(dateRange: DateRange | undefined): string {
  const from = dateRange?.from;
  const to = dateRange?.to ?? from;
  if (!from) return "Hoy";
  const daysDiff = to
    ? Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24))
    : 0;
  return daysDiff === 0 ? "Hoy" : `${daysDiff + 1} días`;
}

function dateRangeToFechasParams(range: DateRange | undefined): FechasParams | null {
  if (!range?.from) return null;
  const to = range.to ?? range.from;
  return {
    fecha_inicio: formatDateApi(range.from),
    fecha_fin: formatDateApi(to),
  };
}

export function useDateRange(
  onDateChange?: (params: FechasParams) => void,
  options?: UseDateRangeOptions,
) {
  const bootstrap = useMemo(() => {
    if (options?.initialFechas) {
      const f = options.initialFechas;
      const range: DateRange = {
        from: parseLocalDate(f.fecha_inicio),
        to: parseLocalDate(f.fecha_fin),
      };
      return { range, period: matchPeriodKey(f) };
    }
    const r = getDateRangeByPeriod(DEFAULT_PERIOD);
    return {
      range: {
        from: parseLocalDate(r.fecha_inicio),
        to: parseLocalDate(r.fecha_fin),
      } satisfies DateRange,
      period: DEFAULT_PERIOD as PeriodKey,
    };
  }, [options?.initialFechas?.fecha_inicio, options?.initialFechas?.fecha_fin]);

  const [period, setPeriod] = useState<PeriodKey | null>(() => bootstrap.period);
  const [dateRange, setDateRange] = useState<DateRange>(() => bootstrap.range);

  const resetRange = bootstrap.range;

  const notifyDateChange = useCallback(
    (range: DateRange | undefined) => {
      const params = dateRangeToFechasParams(range);
      if (params) onDateChange?.(params);
    },
    [onDateChange],
  );

  const applyPeriod = useCallback(
    (p: PeriodKey) => {
      setPeriod(p);
      const range = getDateRangeByPeriod(p);
      const newRange: DateRange = {
        from: parseLocalDate(range.fecha_inicio),
        to: parseLocalDate(range.fecha_fin),
      };
      setDateRange(newRange);
      onDateChange?.(range);
    },
    [onDateChange],
  );

  const handleDateRangeChange = useCallback(
    (range: DateRange | undefined) => {
      setDateRange(range?.from ? range : resetRange);
      if (range?.from && range?.to) {
        setPeriod(null);
        notifyDateChange(range);
      }
    },
    [notifyDateChange, resetRange],
  );

  const periodLabel =
    period === null ? "Personalizado" : getPeriodLabel(dateRange);

  return {
    period,
    dateRange,
    periodLabel,
    periods: PERIODS,
    applyPeriod,
    onDateRangeChange: handleDateRangeChange,
  };
}
