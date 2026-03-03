"use client";

import { Button } from "@/components/ui/button";
import type { PeriodKey } from "@/hooks/use-date-range";

type PeriodOption = { key: PeriodKey; label: string };

type PeriodSelectorProps = {
  period: PeriodKey;
  periods: PeriodOption[];
  onPeriodChange: (period: PeriodKey) => void;
};

export function PeriodSelector({
  period,
  periods,
  onPeriodChange,
}: PeriodSelectorProps) {
  return (
    <>
      {periods.map(({ key, label }) => (
        <Button
          key={key}
          variant={period === key ? "default" : "outline"}
          size="sm"
          onClick={() => onPeriodChange(key)}
        >
          {label}
        </Button>
      ))}
    </>
  );
}
