import { useCallback, useEffect, useMemo, useState } from "react";
import type { DateRange } from "react-day-picker";
import {
  formatDateApi,
  getDateRangeByPeriod,
} from "@/lib/date-utils";
import type { FechasParams } from "@/api/types";

export type PeriodKey = "hoy" | "7dias" | "30dias" | "mesActual";

const PERIODS: { key: PeriodKey; label: string }[] = [
  { key: "hoy", label: "Hoy" },
  { key: "7dias", label: "7 días" },
  { key: "30dias", label: "30 días" },
  { key: "mesActual", label: "Mes actual" },
];

const DEFAULT_PERIOD: PeriodKey = "30dias";

function getInitialDateRange(): DateRange {
  const range = getDateRangeByPeriod(DEFAULT_PERIOD);
  return {
    from: new Date(range.fecha_inicio),
    to: new Date(range.fecha_fin),
  };
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

export function useDateRange(onDateChange?: (params: FechasParams) => void) {
  const initial = useMemo(() => getInitialDateRange(), []);
  const [period, setPeriod] = useState<PeriodKey>(DEFAULT_PERIOD);
  const [dateRange, setDateRange] = useState<DateRange>(initial);

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
        from: new Date(range.fecha_inicio),
        to: new Date(range.fecha_fin),
      };
      setDateRange(newRange);
      onDateChange?.(range);
    },
    [onDateChange],
  );

  const handleDateRangeChange = useCallback(
    (range: DateRange | undefined) => {
      setDateRange(range?.from ? range : initial);
      if (range?.from && range?.to) {
        notifyDateChange(range);
      }
    },
    [initial, notifyDateChange],
  );

  useEffect(() => {
    onDateChange?.(getDateRangeByPeriod(DEFAULT_PERIOD));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Solo al montar
  }, []);

  const periodLabel = getPeriodLabel(dateRange);

  return {
    period,
    dateRange,
    periodLabel,
    periods: PERIODS,
    applyPeriod,
    onDateRangeChange: handleDateRangeChange,
  };
}
