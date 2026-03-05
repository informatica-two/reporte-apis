"use client";

import * as React from "react";
import { DashboardHeader } from "./dashboard-header";
import { DashboardSkeleton } from "./dashboard-skeleton";
import { KpiCards } from "./kpi-cards";
import { VentasVsCobrosChart } from "./ventas-vs-cobros-chart";
import { DesgloseVentasWaterfall } from "./desglose-ventas-waterfall";
import { ComposicionCobrosChart } from "./composicion-cobros-chart";
import { ReclutamientosCard } from "./reclutamientos-card";
import { useReporteData } from "@/hooks/use-reporte-data";
import type { ReporteKpis } from "@/hooks/use-reporte-data";
import type { FechasParams } from "@/api/types";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw } from "lucide-react";

function exportToExcel(kpis: ReporteKpis, fechas: FechasParams) {
  const sections = [
    { label: "Período", rows: [
      ["Inicio", fechas.fecha_inicio],
      ["Fin", fechas.fecha_fin],
      ["Días", kpis.dias],
    ]},
    { label: "Red", rows: [
      ["Activos netos", kpis.activoNeto],
      ["Reclutamientos", kpis.reclutamientos],
      ["Reclutamientos / día", parseFloat(kpis.reclutamientosDia.toFixed(2))],
    ]},
    { label: "Ventas", rows: [
      ["Venta bruta", kpis.ventaBruta],
      ["Venta neta", kpis.ventaNeta],
      ["Devoluciones", kpis.devoluciones],
      ["% Devoluciones", parseFloat(kpis.pctDevoluciones.toFixed(2))],
      ["Venta promedio / día", parseFloat(kpis.ventaPromedioDia.toFixed(2))],
    ]},
    { label: "Cobros", rows: [
      ["Cobro bruto", kpis.cobroBruto],
      ["Cobro neto", kpis.cobroNeto],
      ["Anulaciones", kpis.anulaciones],
      ["% Anulaciones", parseFloat(kpis.pctAnulaciones.toFixed(2))],
      ["Cobro promedio / día", parseFloat(kpis.cobroPromedioDia.toFixed(2))],
    ]},
    { label: "Indicadores", rows: [
      ["ARPU", parseFloat(kpis.arpu.toFixed(2))],
      ["Ratio Cobros/Ventas", parseFloat(kpis.ratioCobrosVentas.toFixed(4))],
    ]},
  ];

  const sheetData: (string | number)[][] = [["Métrica", "Valor"]];
  for (const section of sections) {
    sheetData.push([`— ${section.label} —`, ""]);
    for (const row of section.rows) sheetData.push(row);
    sheetData.push(["", ""]);
  }

  const ws = XLSX.utils.aoa_to_sheet(sheetData);

  // Column widths
  ws["!cols"] = [{ wch: 30 }, { wch: 20 }];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Reporte");
  XLSX.writeFile(wb, `vogue_${fechas.fecha_inicio}_${fechas.fecha_fin}.xlsx`);
  toast.success("Archivo descargado", {
    description: `vogue_${fechas.fecha_inicio}_${fechas.fecha_fin}.xlsx`,
  });
}

export function DashboardPage() {
  const [fechas, setFechas] = React.useState<FechasParams | null>(null);
  const { kpis, state, error, retry, lastUpdated } = useReporteData(fechas);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <DashboardHeader
        onDateChange={setFechas}
        onRefresh={retry}
        lastUpdated={lastUpdated}
      />
      <main className="flex-1 p-6">
        {(state === "idle" || state === "loading") && <DashboardSkeleton />}
        {state === "error" && (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <p className="text-destructive">{error}</p>
            <Button variant="outline" size="sm" onClick={retry}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Reintentar
            </Button>
          </div>
        )}
        {state === "success" && kpis && (
          <div className="flex flex-col gap-5">
            <div className="no-print flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fechas && exportToExcel(kpis, fechas)}
              >
                <Download className="mr-2 h-4 w-4" />
                Exportar Excel
              </Button>
            </div>
            <KpiCards kpis={kpis} />
            <div className="grid items-stretch gap-5 lg:grid-cols-4">
              <VentasVsCobrosChart kpis={kpis} />
              <DesgloseVentasWaterfall kpis={kpis} />
              <ComposicionCobrosChart kpis={kpis} />
              <ReclutamientosCard kpis={kpis} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
