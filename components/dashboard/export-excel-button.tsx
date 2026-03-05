"use client";

import * as XLSX from "xlsx-js-style";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import type { ReporteKpis } from "@/hooks/use-reporte-data";
import type { FechasParams } from "@/api/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Cell = any;

const WINE  = "9C182F";
const DARK  = "1A1A1A";
const GRAY  = "888888";
const LIGHT = "F5F5F5";
const WHITE = "FFFFFF";

const bottomBorder = (rgb = WINE) => ({
  bottom: { style: "thin", color: { rgb } },
});
const allBorders = () => ({
  top:    { style: "thin", color: { rgb: "E0E0E0" } },
  bottom: { style: "thin", color: { rgb: "E0E0E0" } },
  left:   { style: "thin", color: { rgb: "E0E0E0" } },
  right:  { style: "thin", color: { rgb: "E0E0E0" } },
});

const cell = (v: string | number, s: object, t?: string, z?: string): Cell =>
  ({ v, t: t ?? (typeof v === "number" ? "n" : "s"), ...(z ? { z } : {}), s });

const blank = (): Cell =>
  cell("", { fill: { fgColor: { rgb: WHITE }, patternType: "solid" } });

function exportToExcel(kpis: ReporteKpis, fechas: FechasParams) {
  const sections = [
    { label: "Período", rows: [
      ["Inicio",               fechas.fecha_inicio,         undefined         ],
      ["Fin",                  fechas.fecha_fin,             undefined         ],
      ["Días",                 kpis.dias,                   "#,##0"           ],
    ]},
    { label: "Red", rows: [
      ["Activos netos",        kpis.activoNeto,             "#,##0"           ],
      ["Reclutamientos",       kpis.reclutamientos,         "#,##0"           ],
      ["Reclutamientos / día", kpis.reclutamientosDia,      "#,##0.00"        ],
    ]},
    { label: "Ventas", rows: [
      ["Venta bruta",          kpis.ventaBruta,             '"$"#,##0.00'     ],
      ["Devoluciones",         kpis.devoluciones,           '"$"#,##0.00'     ],
      ["Venta neta",           kpis.ventaNeta,              '"$"#,##0.00'     ],
      ["% Devoluciones",       kpis.pctDevoluciones / 100,  "0.00%"           ],
      ["Venta promedio / día", kpis.ventaPromedioDia,       '"$"#,##0.00'     ],
    ]},
    { label: "Cobros", rows: [
      ["Cobro bruto",          kpis.cobroBruto,             '"$"#,##0.00'     ],
      ["Anulaciones",          kpis.anulaciones,            '"$"#,##0.00'     ],
      ["Cobro neto",           kpis.cobroNeto,              '"$"#,##0.00'     ],
      ["% Anulaciones",        kpis.pctAnulaciones / 100,   "0.00%"           ],
      ["Cobro promedio / día", kpis.cobroPromedioDia,       '"$"#,##0.00'     ],
    ]},
    { label: "Indicadores", rows: [
      ["ARPU",                  kpis.arpu,                  '"$"#,##0.00'     ],
      ["Ratio Cobros / Ventas", kpis.ratioCobrosVentas,     "0.00%"           ],
    ]},
  ];

  const rows: Cell[][] = [];
  const merges: XLSX.Range[] = [];
  const merge = (r: number) => merges.push({ s: { r, c: 0 }, e: { r, c: 1 } });

  // Title
  rows.push([
    cell("Vogue", { font: { bold: true, sz: 16, color: { rgb: WINE } }, alignment: { horizontal: "left" } }),
    blank(),
  ]);
  merge(0);

  // Subtitle
  rows.push([
    cell(`Reporte ejecutivo  ·  ${fechas.fecha_inicio} — ${fechas.fecha_fin}`, {
      font: { sz: 10, color: { rgb: GRAY } },
      alignment: { horizontal: "left" },
    }),
    blank(),
  ]);
  merge(1);

  rows.push([blank(), blank()]);

  // Column headers
  rows.push([
    cell("Métrica", { font: { bold: true, sz: 10, color: { rgb: DARK } }, alignment: { horizontal: "left" },  border: bottomBorder() }),
    cell("Valor",   { font: { bold: true, sz: 10, color: { rgb: DARK } }, alignment: { horizontal: "right" }, border: bottomBorder() }),
  ]);

  for (const section of sections) {
    const sr = rows.length;
    rows.push([
      cell(section.label.toUpperCase(), {
        font: { bold: true, sz: 9, color: { rgb: GRAY } },
        fill: { fgColor: { rgb: LIGHT }, patternType: "solid" },
        alignment: { horizontal: "left" },
        border: allBorders(),
      }),
      cell("", {
        fill: { fgColor: { rgb: LIGHT }, patternType: "solid" },
        border: allBorders(),
      }),
    ]);
    merge(sr);

    section.rows.forEach(([label, value, fmt]) => {
      rows.push([
        cell(label as string, {
          font: { sz: 10, color: { rgb: DARK } },
          alignment: { horizontal: "left" },
          border: allBorders(),
        }),
        cell(value as string | number, {
          font: { sz: 10, color: { rgb: DARK } },
          alignment: { horizontal: "right" },
          border: allBorders(),
        }, undefined, fmt as string | undefined),
      ]);
    });
  }

  const ws: XLSX.WorkSheet = {};
  rows.forEach((row, r) =>
    row.forEach((c, col) => {
      ws[XLSX.utils.encode_cell({ r, c: col })] = c;
    })
  );
  ws["!ref"]    = XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: rows.length - 1, c: 1 } });
  ws["!cols"]   = [{ wch: 32 }, { wch: 20 }];
  ws["!rows"]   = [{ hpt: 28 }, { hpt: 16 }];
  ws["!merges"] = merges;

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
