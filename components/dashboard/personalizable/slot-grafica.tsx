"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import type { SlotConfig, DatoGrafica } from "@/config/dashboard-personalizable";
import type { FechasParams } from "@/api/types";
import { useSlotDatos } from "@/hooks/use-slot-datos";
import { GraficaBarras } from "./graficas/grafica-barras";
import { GraficaLinea } from "./graficas/grafica-linea";
import { GraficaPastel } from "./graficas/grafica-pastel";
import { GraficaArea } from "./graficas/grafica-area";
import { GraficaCascada } from "./graficas/grafica-cascada";
import { GraficaTabla } from "./graficas/grafica-tabla";

type SlotGraficaProps = {
  slot: SlotConfig;
  fechas: FechasParams | null;
};

export function SlotGrafica({ slot, fechas }: SlotGraficaProps) {
  const { datos, estado, error } = useSlotDatos(slot, fechas);

  function renderContenido() {
    if (estado === "loading" || estado === "idle") {
      return (
        <div className="flex h-[220px] items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      );
    }

    if (estado === "error") {
      return (
        <div className="flex h-[220px] flex-col items-center justify-center gap-2 text-center">
          <p className="text-sm text-destructive">{error}</p>
          <p className="text-xs text-muted-foreground">
            Revisa el endpoint en{" "}
            <code className="rounded bg-muted px-1 py-0.5">
              config/dashboard-personalizable.ts
            </code>
          </p>
        </div>
      );
    }

    if (!datos) {
      return (
        <div className="flex h-[220px] items-center justify-center">
          <p className="text-sm text-muted-foreground">Sin datos configurados</p>
        </div>
      );
    }

    if (datos.tipo === "tabla") {
      return <GraficaTabla columnas={datos.columnas} filas={datos.filas} />;
    }

    const graficaDatos = datos.datos as DatoGrafica[];

    switch (slot.tipo) {
      case "barras":
        return (
          <GraficaBarras
            datos={graficaDatos}
            formatoValor={slot.formatoValor}
            etiquetaValor={slot.etiquetaValor}
            etiquetaValor2={slot.etiquetaValor2}
          />
        );
      case "linea":
        return (
          <GraficaLinea
            datos={graficaDatos}
            formatoValor={slot.formatoValor}
            etiquetaValor={slot.etiquetaValor}
            etiquetaValor2={slot.etiquetaValor2}
          />
        );
      case "pastel":
        return (
          <GraficaPastel datos={graficaDatos} formatoValor={slot.formatoValor} />
        );
      case "area":
        return (
          <GraficaArea
            datos={graficaDatos}
            formatoValor={slot.formatoValor}
            etiquetaValor={slot.etiquetaValor}
            etiquetaValor2={slot.etiquetaValor2}
          />
        );
      case "cascada":
        return (
          <GraficaCascada datos={graficaDatos} formatoValor={slot.formatoValor} />
        );
      default:
        return null;
    }
  }

  return (
    <Card className="flex h-full flex-col overflow-hidden py-4">
      <CardHeader className="px-4 pb-2">
        <CardTitle className="text-base">{slot.titulo}</CardTitle>
        {slot.descripcion && (
          <CardDescription className="text-xs">{slot.descripcion}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3 px-4 pt-0">
        {renderContenido()}
      </CardContent>
    </Card>
  );
}
