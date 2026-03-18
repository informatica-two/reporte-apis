import { useState, useMemo, useCallback } from "react";
import type { FechasParams } from "@/api/types";

type UseFechasStateOptions = {
  initialFechas: FechasParams;
};

export function useFechasState({ initialFechas }: UseFechasStateOptions) {
  const [fechas, setFechas] = useState<FechasParams | null>(initialFechas);
  
  const initialDataTimestamp = useMemo(() => Date.now(), []);
  
  const isInitialFechas = 
    fechas?.fecha_inicio === initialFechas.fecha_inicio &&
    fechas?.fecha_fin === initialFechas.fecha_fin;

  const handleDateChange = useCallback((newFechas: FechasParams) => {
    setFechas(newFechas);
  }, []);

  return {
    fechas,
    isInitialFechas,
    initialDataTimestamp,
    onDateChange: handleDateChange,
  };
}
