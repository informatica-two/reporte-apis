"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { type DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatDateRangeDisplay } from "@/lib/date-utils";

type DateRangePickerProps = {
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  disabledAfter?: Date;
  numberOfMonths?: number;
};

export function DateRangePicker({
  dateRange,
  onDateRangeChange,
  disabledAfter = new Date(),
  numberOfMonths = 2,
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [month, setMonth] = React.useState<Date | undefined>(dateRange?.from);

  React.useEffect(() => {
    if (open && dateRange?.from) setMonth(dateRange.from);
  }, [open, dateRange?.from]);

  const handleSelect = React.useCallback(
    (range: DateRange | undefined) => {
      if (typeof onDateRangeChange === "function") {
        onDateRangeChange(range);
      }
      if (range?.from && range?.to) setOpen(false);
    },
    [onDateRangeChange],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="min-w-[240px] justify-start gap-2 font-normal"
        >
          <CalendarIcon className="size-4" />
          {formatDateRangeDisplay(dateRange?.from, dateRange?.to)}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto bg-white p-0" align="start">
        <Calendar
          mode="range"
          selected={dateRange}
          onSelect={handleSelect}
          disabled={{ after: disabledAfter }}
          numberOfMonths={numberOfMonths}
          month={month}
          onMonthChange={setMonth}
          defaultMonth={dateRange?.from}
        />
      </PopoverContent>
    </Popover>
  );
}
