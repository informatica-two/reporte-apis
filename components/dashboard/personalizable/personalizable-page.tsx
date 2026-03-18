"use client";

import type { FechasParams } from "@/api/types";
import { CONFIGURACION_DASHBOARD } from "@/config/dashboard-personalizable";
import { SlotGrafica } from "./slot-grafica";
import { LayoutDashboard } from "lucide-react";

type PersonalizablePageProps = {
  fechas: FechasParams | null;
};

const CLASES_TAMANO = {
  normal: "col-span-1",
  ancho: "col-span-1 lg:col-span-2",
  completo: "col-span-1 lg:col-span-3",
} as const;

export function PersonalizablePage({ fechas }: PersonalizablePageProps) {
  const slotsActivos = CONFIGURACION_DASHBOARD.filter((s) => s.titulo);

  if (slotsActivos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <LayoutDashboard className="h-12 w-12 text-muted-foreground/40" />
        <div>
          <p className="text-base font-medium text-foreground">
            Dashboard personalizable listo para configurar
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Abre{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
              config/dashboard-personalizable.ts
            </code>{" "}
            y descomenta los slots que quieres mostrar.
          </p>
          <p className="mt-1 text-xs text-muted-foreground/70">
            Puedes activar hasta 6 gráficas: barras, línea, pastel, área, cascada o tabla.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
      {slotsActivos.map((slot, i) => (
        <div key={i} className={CLASES_TAMANO[slot.tamano ?? "normal"]}>
          <SlotGrafica slot={slot} fechas={fechas} />
        </div>
      ))}
    </div>
  );
}
