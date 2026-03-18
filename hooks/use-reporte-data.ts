"use client";

import { useEffect, useState, useCallback, useRef } from "react";
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

type UseReporteDataOptions = {
  initialData?: ReporteKpis | null;
  initialFechas?: FechasParams | null;
};

export function useReporteData(
  fechas: FechasParams | null,
  options: UseReporteDataOptions = {}
) {
  const { initialData = null, initialFechas = null } = options;
  const [kpis, setKpis] = useState<ReporteKpis | null>(initialData);
  const [state, setState] = useState<LoadingState>(initialData ? "success" : "idle");
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(
    initialData ? new Date() : null
  );
  const cache = useRef<Map<string, ReporteKpis>>(new Map());
  const isInitialized = useRef(false);

  useEffect(() => {
    if (initialData && initialFechas && !isInitialized.current) {
      const cacheKey = `${initialFechas.fecha_inicio}_${initialFechas.fecha_fin}`;
      cache.current.set(cacheKey, initialData);
      isInitialized.current = true;
    }
  }, [initialData, initialFechas]);

  const fetchData = useCallback(async (params: FechasParams, signal: AbortSignal) => {
    const cacheKey = `${params.fecha_inicio}_${params.fecha_fin}`;
    const cached = cache.current.get(cacheKey);
    if (cached) {
      setKpis(cached);
      setState("success");
      setLastUpdated(new Date());
      return;
    }

    setState("loading");
    setError(null);

    try {
      const [activosRes, cobrosRes, ventaRes, reclutamientosRes] =
        await Promise.all([
          getActivos(params, signal),
          getCobros(params, signal),
          getVenta(params, signal),
          getReclutamientos(params, signal),
        ]);

      if (signal.aborted) return;

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

      cache.current.set(cacheKey, data);
      setKpis(data);
      setState("success");
      setLastUpdated(new Date());
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") return;
      setError(e instanceof Error ? e.message : "Error al cargar datos");
      setState("error");
    }
  }, []);

  useEffect(() => {
    if (!fechas) {
      setKpis(null);
      setState("idle");
      return;
    }
    const cacheKey = `${fechas.fecha_inicio}_${fechas.fecha_fin}`;
    if (cache.current.has(cacheKey)) {
      return;
    }
    const controller = new AbortController();
    fetchData(fechas, controller.signal);
    return () => controller.abort();
  }, [fechas, fetchData]);

  const retry = useCallback(() => {
    if (!fechas) return;
    const cacheKey = `${fechas.fecha_inicio}_${fechas.fecha_fin}`;
    cache.current.delete(cacheKey);
    const controller = new AbortController();
    fetchData(fechas, controller.signal);
  }, [fechas, fetchData]);

  return {
    kpis,
    state,
    error,
    retry,
    lastUpdated,
  };
}
