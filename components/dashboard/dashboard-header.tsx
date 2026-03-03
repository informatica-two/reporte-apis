"use client";

import Image from "next/image";
import { useDateRange } from "@/hooks/use-date-range";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { PeriodSelector } from "./period-selector";
import type { FechasParams } from "@/api/types";

export type DashboardHeaderProps = {
  onDateChange?: (params: FechasParams) => void;
};

export function DashboardHeader({ onDateChange }: DashboardHeaderProps) {
  const {
    period,
    dateRange,
    periodLabel,
    periods,
    applyPeriod,
    onDateRangeChange,
  } = useDateRange(onDateChange);

  return (
    <header className="flex flex-col gap-4 border-b border-border bg-card px-4 py-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-3">
        <Image
          src="/vogue_logo.svg"
          alt="Vogue"
          width={73}
          height={44}
          className="block h-11 shrink-0 object-contain"
        />
        <div>
          <h1 className="text-xl font-bold text-foreground">
            Vogue dashboard ejecutivo
          </h1>
          <p className="text-sm text-muted-foreground">
            Período: {periodLabel}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <PeriodSelector
          period={period}
          periods={periods}
          onPeriodChange={applyPeriod}
        />
        <div className="flex items-center gap-2 border-l border-border pl-2">
          <DateRangePicker
            dateRange={dateRange}
            onDateRangeChange={onDateRangeChange}
            numberOfMonths={2}
          />
        </div>
      </div>
    </header>
  );
}
