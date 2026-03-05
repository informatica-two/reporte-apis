"use client";

import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const PALETTE = [
  "var(--palette-1)",
  "var(--palette-2)",
  "var(--palette-3)",
  "var(--palette-4)",
  "var(--palette-5)",
  "var(--palette-6)",
  "var(--palette-7)",
  "var(--palette-8)",
  "var(--palette-9)",
] as const;

type KpiCardProps = {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description: string;
  size?: "compact" | "default" | "lg";
  variant?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  className?: string;
};

function KpiCard({
  title,
  value,
  icon: Icon,
  description,
  size = "default",
  variant = 0,
  className,
}: KpiCardProps) {
  const color = PALETTE[variant % 9];
  return (
    <Card
      className={cn(
        "group relative py-0 transition-all hover:bg-muted/30 hover:shadow-sm border-l-4",
        className
      )}
      style={{ borderLeftColor: color }}
    >
      <CardContent
        className={cn(
          "flex items-center gap-2",
          size === "lg" && "p-5 gap-3",
          size === "default" && "p-4 gap-3",
          size === "compact" && "p-3 gap-2"
        )}
      >
        <div
          className={cn(
            "rounded-md transition-colors shrink-0 group-hover:opacity-90",
            size === "compact" ? "p-2" : "p-2.5"
          )}
          style={{
            backgroundColor: `color-mix(in srgb, ${color} 20%, transparent)`,
            color,
          }}
        >
          <Icon
            className={cn(
              size === "lg" && "size-6",
              size === "default" && "size-5",
              size === "compact" && "size-4"
            )}
          />
        </div>
        <div className="flex-1 min-w-0">
          <p
            className={cn(
              "font-medium text-muted-foreground",
              size === "compact" ? "text-xs" : "text-sm"
            )}
          >
            {title}
          </p>
          <p
            className={cn(
              "mt-1 font-bold tabular-nums",
              size === "lg" && "text-3xl",
              size === "default" && "text-2xl",
              size === "compact" && "text-lg"
            )}
          >
            {value}
          </p>
        </div>
      </CardContent>
      <div
        className="pointer-events-none absolute top-full left-1/2 z-10 mt-2 -translate-x-1/2 px-3 py-2 rounded-lg bg-popover text-popover-foreground text-xs font-normal shadow-lg border max-w-[220px] opacity-0 invisible transition-all duration-150 group-hover:opacity-100 group-hover:visible"
        role="tooltip"
      >
        {description}
      </div>
    </Card>
  );
}

export { KpiCard };
