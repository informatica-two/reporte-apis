"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { getVentaDetalle1, getVentaDetalle2 } from "@/api/reporteVisual";
import type { FechasParams, ReportePorZonaDetalle } from "@/api/types";

type LoadingState = "idle" | "loading" | "success" | "error";

type UseVentaDetallesOptions = {
  initialReportePorZona?: ReportePorZonaDetalle | null;
  initialReportePorImpulsadora?: ReportePorZonaDetalle | null;
  initialFechas?: FechasParams | null;
};

export function useVentaDetalles(
  fechas: FechasParams | null,
  options: UseVentaDetallesOptions = {}
) {
  const { initialReportePorZona = null, initialReportePorImpulsadora = null, initialFechas = null } = options;
  const hasInitialData = initialReportePorZona !== null || initialReportePorImpulsadora !== null;

  const [reportePorZona, setReportePorZona] =
    useState<ReportePorZonaDetalle | null>(initialReportePorZona);
  const [reportePorImpulsadora, setReportePorImpulsadora] =
    useState<ReportePorZonaDetalle | null>(initialReportePorImpulsadora);
  const [state, setState] = useState<LoadingState>(hasInitialData ? "success" : "idle");
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(
    hasInitialData ? new Date() : null
  );
  const cache = useRef<
    Map<
      string,
      {
        reportePorZona: ReportePorZonaDetalle | null;
        reportePorImpulsadora: ReportePorZonaDetalle | null;
      }
    >
  >(new Map());
  const isInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialData && initialFechas && !isInitialized.current) {
      const cacheKey = `${initialFechas.fecha_inicio}_${initialFechas.fecha_fin}`;
      cache.current.set(cacheKey, {
        reportePorZona: initialReportePorZona,
        reportePorImpulsadora: initialReportePorImpulsadora,
      });
      isInitialized.current = true;
    }
  }, [hasInitialData, initialFechas, initialReportePorZona, initialReportePorImpulsadora]);

  const fetchData = useCallback(
    async (params: FechasParams, signal: AbortSignal) => {
      const cacheKey = `${params.fecha_inicio}_${params.fecha_fin}`;
      const cached = cache.current.get(cacheKey);
      if (cached) {
        setReportePorZona(cached.reportePorZona);
        setReportePorImpulsadora(cached.reportePorImpulsadora);
        setState("success");
        setLastUpdated(new Date());
        return;
      }

      setState("loading");
      setError(null);

      try {
        const [ventaDetalle1Res, ventaDetalle2Res] = await Promise.all([
          getVentaDetalle1(params, signal),
          getVentaDetalle2(params, signal),
        ]);

        if (signal.aborted) return;

        let reportePorZonaData: ReportePorZonaDetalle | null = null;
        let reportePorImpulsadoraData: ReportePorZonaDetalle | null = null;

        if (ventaDetalle1Res.success && "data" in ventaDetalle1Res) {
          const detalle = ventaDetalle1Res.data.detalle;
          reportePorZonaData =
            detalle && Array.isArray(detalle.datos) ? detalle : null;
        } else {
          setError(ventaDetalle1Res.error.message);
          setState("error");
          return;
        }

        if (ventaDetalle2Res.success && "data" in ventaDetalle2Res) {
          const detalle = ventaDetalle2Res.data.detalle;
          reportePorImpulsadoraData =
            detalle && Array.isArray(detalle.datos) ? detalle : null;
        } else {
          setError(ventaDetalle2Res.error.message);
          setState("error");
          return;
        }

        cache.current.set(cacheKey, {
          reportePorZona: reportePorZonaData,
          reportePorImpulsadora: reportePorImpulsadoraData,
        });
        setReportePorZona(reportePorZonaData);
        setReportePorImpulsadora(reportePorImpulsadoraData);
        setState("success");
        setLastUpdated(new Date());
      } catch (e) {
        if (e instanceof DOMException && e.name === "AbortError") return;
        setError(e instanceof Error ? e.message : "Error al cargar datos");
        setState("error");
      }
    },
    []
  );

  useEffect(() => {
    if (!fechas) {
      setReportePorZona(null);
      setReportePorImpulsadora(null);
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
    reportePorZona,
    reportePorImpulsadora,
    state,
    error,
    retry,
    lastUpdated,
  };
}
