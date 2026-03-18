"use client";

import type { FilaTabla } from "@/config/dashboard-personalizable";

type GraficaTablaProps = {
  columnas: string[];
  filas: FilaTabla[];
};

export function GraficaTabla({ columnas, filas }: GraficaTablaProps) {
  if (filas.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        Sin datos para mostrar
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-md border border-border">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            {columnas.map((col) => (
              <th
                key={col}
                className="px-3 py-2 text-left font-medium text-muted-foreground"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filas.map((fila, i) => (
            <tr
              key={i}
              className="border-b border-border/50 last:border-0 transition-colors hover:bg-muted/30"
            >
              {columnas.map((col) => (
                <td key={col} className="px-3 py-2 font-mono tabular-nums">
                  {fila[col] ?? "—"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
