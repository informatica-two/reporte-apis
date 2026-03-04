"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

function ChartCardSkeleton() {
  return (
    <Card className="flex h-full flex-col gap-3 overflow-hidden py-4">
      <CardHeader className="px-4 pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
          <Skeleton className="h-6 w-12 shrink-0 rounded-md" />
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3 px-4 pt-0">
        <Skeleton className="h-[180px] w-full shrink-0 rounded-lg" />
        <div className="flex flex-wrap gap-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="space-y-2 rounded-lg border border-border/60 bg-muted/40 p-2.5">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-4 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}

/** Skeleton del contenido (KPI cards + charts). Coincide con el layout real. */
export function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      {/* KPI cards */}
      <div className="flex flex-col gap-3">
        <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="py-0 border-l-4">
              <CardContent className="flex items-center gap-2 p-3">
                <Skeleton className="size-8 shrink-0 rounded-md" />
                <div className="flex-1 space-y-2 min-w-0">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-2 grid-cols-1 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="py-0 border-l-4">
              <CardContent className="flex items-center gap-2 p-2">
                <Skeleton className="size-6 shrink-0 rounded-md" />
                <div className="flex-1 space-y-1.5 min-w-0">
                  <Skeleton className="h-2.5 w-24" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Chart skeletons */}
      <div className="grid items-stretch gap-4 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <ChartCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
