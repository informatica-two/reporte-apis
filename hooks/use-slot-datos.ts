"use client";

import * as React from "react";
import type { DatoGrafica, FilaTabla, SlotConfig } from "@/config/dashboard-personalizable";
import type { FechasParams } from "@/api/types";

export type EstadoSlot = "idle" | "loading" | "success" | "error";

export type DatosSlot =
  | { tipo: "grafica"; datos: DatoGrafica[] }
  | { tipo: "tabla"; columnas: string[]; filas: FilaTabla[] };

export type UseSlotDatosResult = {
  datos: DatosSlot | null;
  estado: EstadoSlot;
  error: string | null;
};

/**
 * Hook que obtiene los datos de un slot del dashboard personalizable.
 * Si el slot tiene endpoint, hace fetch a esa URL con las fechas del período.
 * Si no tiene endpoint, usa los datosEstaticos.
 */
export function useSlotDatos(
  slot: SlotConfig,
  fechas: FechasParams | null
): UseSlotDatosResult {
  const [datos, setDatos] = React.useState<DatosSlot | null>(null);
  const [estado, setEstado] = React.useState<EstadoSlot>("idle");
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    // Sin endpoint: usar datos estáticos directamente
    if (!slot.endpoint) {
      if (!slot.datosEstaticos) {
        setEstado("success");
        setDatos(null);
        return;
      }
      if (slot.tipo === "tabla") {
        const estaticos = slot.datosEstaticos as { columnas: string[]; filas: FilaTabla[] };
        setDatos({ tipo: "tabla", columnas: estaticos.columnas, filas: estaticos.filas });
      } else {
        setDatos({ tipo: "grafica", datos: slot.datosEstaticos as DatoGrafica[] });
      }
      setEstado("success");
      return;
    }

    // Con endpoint pero sin fechas: esperar
    if (!fechas) {
      setEstado("idle");
      return;
    }

    let cancelado = false;

    async function cargarDatos() {
      setEstado("loading");
      setError(null);

      try {
        const res = await fetch(slot.endpoint!, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fecha_inicio: fechas!.fecha_inicio,
            fecha_fin: fechas!.fecha_fin,
          }),
        });

        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }

        const respuestaApi = await res.json();
        if (cancelado) return;

        if (slot.mapearDatos) {
          const datosMapeados = slot.mapearDatos(respuestaApi);
          if (slot.tipo === "tabla") {
            const filas = datosMapeados as FilaTabla[];
            const columnas = filas.length > 0 ? Object.keys(filas[0]) : [];
            setDatos({ tipo: "tabla", columnas, filas });
          } else {
            setDatos({ tipo: "grafica", datos: datosMapeados as DatoGrafica[] });
          }
        } else if (Array.isArray(respuestaApi)) {
          setDatos({ tipo: "grafica", datos: respuestaApi as DatoGrafica[] });
        } else {
          throw new Error(
            "La respuesta de la API no es un arreglo. Define mapearDatos en tu configuración."
          );
        }

        setEstado("success");
      } catch (err) {
        if (cancelado) return;
        setError(err instanceof Error ? err.message : "Error al cargar los datos");
        setEstado("error");
      }
    }

    cargarDatos();
    return () => { cancelado = true; };
  }, [slot, fechas]);

  return { datos, estado, error };
}
