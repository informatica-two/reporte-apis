"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

function ChartCardSkeleton() {
  return (
    <Card className="flex h-full flex-col gap-3 overflow-hidden py-4">
      <CardHeader className="px-4 pb-2">
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-48" />
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3 px-4 pt-0">
        <Skeleton className="h-[180px] w-full shrink-0 rounded-lg" />
        <div className="flex flex-col items-center py-2 text-center">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="mt-1 h-8 w-28" />
        </div>
        <div className="rounded-lg border border-border/60 bg-muted/40 p-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ReclutamientosCardSkeleton() {
  return (
    <Card className="flex h-full flex-col gap-3 overflow-hidden py-4">
      <CardHeader className="px-4 pb-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="mt-1 h-3 w-48" />
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-between gap-4 px-4 pt-0">
        <div className="flex items-center gap-3 rounded-lg bg-muted/40 p-4">
          <Skeleton className="size-12 shrink-0 rounded-md" />
          <div className="flex-1 space-y-1">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center gap-2 rounded-md border border-border/60 px-3 py-2"
            >
              <Skeleton className="size-4 shrink-0" />
              <div className="flex flex-1 items-center justify-between">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-4 w-12" />
              </div>
            </div>
          ))}
        </div>
        <Skeleton className="mx-auto h-3 w-24" />
      </CardContent>
    </Card>
  );
}

/** Skeleton para Reporte por zona / Reporte por impulsadora (barras + tabla). */
function ReporteBarrasCardSkeleton() {
  return (
    <Card className="flex h-full flex-col gap-3 overflow-hidden py-4">
      <CardHeader className="px-4 pb-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="mt-1 h-3 w-56" />
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4 px-4 pt-0">
        <Skeleton className="h-[280px] w-full shrink-0 rounded-lg" />
        <div className="rounded-lg border border-border/60 bg-muted/40 overflow-hidden">
          <div className="border-b border-border/60 bg-muted/80 px-3 py-2 flex gap-2">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-3 w-14 ml-auto" />
          </div>
          <div className="p-2 space-y-1.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between gap-2">
                <Skeleton className="h-3.5 w-16" />
                <Skeleton className="h-3.5 w-20" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/** Skeleton del contenido (export + KPI cards + charts). Coincide con el layout real. */
export function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      {/* Export button */}
      <div className="flex justify-end">
        <Skeleton className="h-9 w-[140px] rounded-md" />
      </div>

      {/* KPI cards */}
      <div className="flex flex-col gap-5">
        <div className="grid gap-5 grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="py-0 border-l-4">
              <CardContent className="flex items-center gap-3 p-4">
                <Skeleton className="size-10 shrink-0 rounded-md" />
                <div className="flex-1 space-y-2 min-w-0">
                  <Skeleton className="h-3.5 w-24" />
                  <Skeleton className="h-7 w-28" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-5 grid-cols-1 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="py-0 border-l-4">
              <CardContent className="flex items-center gap-2 p-3">
                <Skeleton className="size-8 shrink-0 rounded-md" />
                <div className="flex-1 space-y-1.5 min-w-0">
                  <Skeleton className="h-3 w-28" />
                  <Skeleton className="h-5 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Chart skeletons */}
      <div className="grid items-stretch gap-5 lg:grid-cols-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <ChartCardSkeleton key={i} />
        ))}
        <ReclutamientosCardSkeleton />
      </div>

      {/* Reporte por zona / Reporte por impulsadora skeletons */}
      <div className="grid items-stretch gap-5 lg:grid-cols-2">
        <ReporteBarrasCardSkeleton />
        <ReporteBarrasCardSkeleton />
      </div>
    </div>
  );
}
