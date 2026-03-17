"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  getActivos,
  getCobros,
  getVenta,
  getVentaDetalle1,
  getVentaDetalle2,
  getReclutamientos,
} from "@/api/reporteVisual";
import type { FechasParams, ReportePorZonaDetalle } from "@/api/types";
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
  const [reportePorZona, setReportePorZona] =
    useState<ReportePorZonaDetalle | null>(null);
  const [reportePorImpulsadora, setReportePorImpulsadora] =
    useState<ReportePorZonaDetalle | null>(null);
  const [state, setState] = useState<LoadingState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const cache = useRef<
    Map<
      string,
      {
        kpis: ReporteKpis;
        reportePorZona: ReportePorZonaDetalle | null;
        reportePorImpulsadora: ReportePorZonaDetalle | null;
      }
    >
  >(new Map());

  const fetchData = useCallback(async (params: FechasParams, signal: AbortSignal) => {
    const cacheKey = `${params.fecha_inicio}_${params.fecha_fin}`;
    const cached = cache.current.get(cacheKey);
    if (cached) {
      setKpis(cached.kpis);
      setReportePorZona(cached.reportePorZona);
      setReportePorImpulsadora(cached.reportePorImpulsadora);
      setState("success");
      setLastUpdated(new Date());
      return;
    }

    setState("loading");
    setError(null);

    try {
      const [
        activosRes,
        cobrosRes,
        ventaRes,
        ventaDetalle1Res,
        ventaDetalle2Res,
        reclutamientosRes,
      ] = await Promise.all([
        getActivos(params, signal),
        getCobros(params, signal),
        getVenta(params, signal),
        getVentaDetalle1(params, signal),
        getVentaDetalle2(params, signal),
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

      const ventaPorZonaDetalle =
        ventaDetalle1Res.success && "data" in ventaDetalle1Res
          ? ventaDetalle1Res.data.detalle
          : null;
      const reportePorZonaData =
        ventaPorZonaDetalle &&
        Array.isArray(ventaPorZonaDetalle.datos)
          ? ventaPorZonaDetalle
          : null;

      const ventaPorImpulsadoraDetalle =
        ventaDetalle2Res.success && "data" in ventaDetalle2Res
          ? ventaDetalle2Res.data.detalle
          : null;
      const reportePorImpulsadoraData =
        ventaPorImpulsadoraDetalle &&
        Array.isArray(ventaPorImpulsadoraDetalle.datos)
          ? ventaPorImpulsadoraDetalle
          : null;

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

      cache.current.set(cacheKey, {
        kpis: data,
        reportePorZona: reportePorZonaData,
        reportePorImpulsadora: reportePorImpulsadoraData,
      });
      setKpis(data);
      setReportePorZona(reportePorZonaData);
      setReportePorImpulsadora(reportePorImpulsadoraData);
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
      setReportePorZona(null);
      setReportePorImpulsadora(null);
      setState("idle");
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
    reportePorZona,
    reportePorImpulsadora,
    state,
    error,
    retry,
    lastUpdated,
  };
}
