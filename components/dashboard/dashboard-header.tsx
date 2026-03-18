"use client";

import * as React from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useDateRange } from "@/hooks/use-date-range";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { PeriodSelector } from "./period-selector";
import { Button } from "@/components/ui/button";
import { Moon, Sun, RefreshCw } from "lucide-react";
import type { FechasParams } from "@/api/types";

export type DashboardHeaderProps = {
  onDateChange?: (params: FechasParams) => void;
  onRefresh?: () => void;
};

export function DashboardHeader({ onDateChange, onRefresh }: DashboardHeaderProps) {
  const {
    period,
    dateRange,
    periodLabel,
    periods,
    applyPeriod,
    onDateRangeChange,
  } = useDateRange(onDateChange);

  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <header className="flex flex-col gap-4 border-b border-border bg-card px-5 py-5 md:flex-row md:items-center md:justify-between">
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
        <div className="flex items-center gap-1 border-l border-border pl-2">
          {onRefresh && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onRefresh}
              title="Actualizar datos"
              className="h-8 w-8"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            title={isDark ? "Modo claro" : "Modo oscuro"}
            className="h-8 w-8"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </header>
  );
}
