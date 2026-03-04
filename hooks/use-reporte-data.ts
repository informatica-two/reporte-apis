"use client";

import { useEffect, useState, useCallback } from "react";
import {
  getActivos,
  getCobros,
  getVenta,
  getReclutamientos,
} from "@/api/reporteVisual";
import type { FechasParams } from "@/api/types";
import { parseNumberLabel } from "@/lib/utils";

export type ReporteKpis = {
  activoNeto: number;
  cobroBruto: number;
  cobroNeto: number;
  ventaBruta: number;
  ventaNeta: number;
  devoluciones: number;
  anulaciones: number;
  reclutamientos: number;
  arpu: number;
  cobroPromedioDia: number;
  ventaPromedioDia: number;
  pctDevoluciones: number;
  pctAnulaciones: number;
  ratioCobrosVentas: number;
  reclutamientosDia: number;
  dias: number;
};

type LoadingState = "idle" | "loading" | "success" | "error";

export function useReporteData(fechas: FechasParams | null) {
  const [kpis, setKpis] = useState<ReporteKpis | null>(null);
  const [state, setState] = useState<LoadingState>("idle");
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (params: FechasParams) => {
    setState("loading");
    setError(null);
    const start = performance.now();
    const timings: Record<string, number> = {};

    try {
      const [activosRes, cobrosRes, ventaRes, reclutamientosRes] =
        await Promise.all([
          getActivos(params).then((r) => {
            timings.activos = Math.round(performance.now() - start);
            return r;
          }),
          getCobros(params).then((r) => {
            timings.cobros = Math.round(performance.now() - start);
            return r;
          }),
          getVenta(params).then((r) => {
            timings.venta = Math.round(performance.now() - start);
            return r;
          }),
          getReclutamientos(params).then((r) => {
            timings.reclutamientos = Math.round(performance.now() - start);
            return r;
          }),
        ]);

      const totalMs = Math.round(performance.now() - start);
      console.log("[Reporte] Tiempos por endpoint (ms):", timings);
      console.log("[Reporte] Total:", totalMs, "ms");

      if (!activosRes.success) {
        setError(activosRes.error.message);
        setState("error");
        return;
      }
      if (!cobrosRes.success) {
        setError(cobrosRes.error.message);
        setState("error");
        return;
      }
      if (!ventaRes.success) {
        setError(ventaRes.error.message);
        setState("error");
        return;
      }
      if (!reclutamientosRes.success) {
        setError(reclutamientosRes.error.message);
        setState("error");
        return;
      }

      const a = "data" in activosRes ? activosRes.data.detalle : null;
      const c = "data" in cobrosRes ? cobrosRes.data.detalle : null;
      const v = "data" in ventaRes ? ventaRes.data.detalle : null;
      const r = "data" in reclutamientosRes ? reclutamientosRes.data.detalle : 0;
      if (!a || !c || !v) {
        setError("Datos incompletos");
        setState("error");
        return;
      }
      const dias = a.dias || c.dias || v.dias || 1;

      const devoluciones = parseNumberLabel(v.devoluciones_label);
      const anulaciones = parseNumberLabel(c.anulaciones_label);

      const data: ReporteKpis = {
        activoNeto: a.activo_neto,
        cobroBruto: c.cobro_bruto,
        cobroNeto: c.cobro_neto,
        ventaBruta: v.venta_bruta,
        ventaNeta: v.venta_neta,
        devoluciones,
        anulaciones,
        reclutamientos: r,
        arpu: a.activo_neto > 0 ? c.cobro_neto / a.activo_neto : 0,
        cobroPromedioDia: dias > 0 ? c.cobro_neto / dias : 0,
        ventaPromedioDia: dias > 0 ? v.venta_neta / dias : 0,
        pctDevoluciones:
          v.venta_bruta > 0 ? (devoluciones / v.venta_bruta) * 100 : 0,
        pctAnulaciones:
          c.cobro_bruto > 0 ? (anulaciones / c.cobro_bruto) * 100 : 0,
        ratioCobrosVentas:
          v.venta_neta > 0 ? c.cobro_neto / v.venta_neta : 0,
        reclutamientosDia: dias > 0 ? r / dias : 0,
        dias,
      };
      setKpis(data);
      setState("success");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar datos");
      setState("error");
    }
  }, []);

  useEffect(() => {
    if (fechas) fetchData(fechas);
    else {
      setKpis(null);
      setState("idle");
    }
  }, [fechas, fetchData]);

  return { kpis, state, error };
}
