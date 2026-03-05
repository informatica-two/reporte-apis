"use client";

import * as XLSX from "xlsx";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import type { ReporteKpis } from "@/hooks/use-reporte-data";
import type { FechasParams } from "@/api/types";

function exportToExcel(kpis: ReporteKpis, fechas: FechasParams) {
  const sections = [
    {
      label: "Período",
      rows: [
        ["Inicio", fechas.fecha_inicio],
        ["Fin", fechas.fecha_fin],
        ["Días", kpis.dias],
      ],
    },
    {
      label: "Red",
      rows: [
        ["Activos netos", kpis.activoNeto],
        ["Reclutamientos", kpis.reclutamientos],
        ["Reclutamientos / día", parseFloat(kpis.reclutamientosDia.toFixed(2))],
      ],
    },
    {
      label: "Ventas",
      rows: [
        ["Venta bruta", kpis.ventaBruta],
        ["Venta neta", kpis.ventaNeta],
        ["Devoluciones", kpis.devoluciones],
        ["% Devoluciones", parseFloat(kpis.pctDevoluciones.toFixed(2))],
        ["Venta promedio / día", parseFloat(kpis.ventaPromedioDia.toFixed(2))],
      ],
    },
    {
      label: "Cobros",
      rows: [
        ["Cobro bruto", kpis.cobroBruto],
        ["Cobro neto", kpis.cobroNeto],
        ["Anulaciones", kpis.anulaciones],
        ["% Anulaciones", parseFloat(kpis.pctAnulaciones.toFixed(2))],
        ["Cobro promedio / día", parseFloat(kpis.cobroPromedioDia.toFixed(2))],
      ],
    },
    {
      label: "Indicadores",
      rows: [
        ["ARPU", parseFloat(kpis.arpu.toFixed(2))],
        ["Ratio Cobros/Ventas", parseFloat(kpis.ratioCobrosVentas.toFixed(4))],
      ],
    },
  ];

  const sheetData: (string | number)[][] = [["Métrica", "Valor"]];
  for (const section of sections) {
    sheetData.push([`— ${section.label} —`, ""]);
    for (const row of section.rows) sheetData.push(row);
    sheetData.push(["", ""]);
  }

  const ws = XLSX.utils.aoa_to_sheet(sheetData);
  ws["!cols"] = [{ wch: 30 }, { wch: 20 }];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Reporte");
  XLSX.writeFile(wb, `vogue_${fechas.fecha_inicio}_${fechas.fecha_fin}.xlsx`);
  toast.success("Archivo descargado", {
    description: `vogue_${fechas.fecha_inicio}_${fechas.fecha_fin}.xlsx`,
  });
}

type ExportExcelButtonProps = {
  kpis: ReporteKpis;
  fechas: FechasParams | null;
};

export function ExportExcelButton({ kpis, fechas }: ExportExcelButtonProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => fechas && exportToExcel(kpis, fechas)}
    >
      <Download className="mr-2 h-4 w-4" />
      Exportar
    </Button>
  );
}
