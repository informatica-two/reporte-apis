import { fetchVentaDetallesServer, getDefaultFechas } from "@/lib/server-data";
import { VentasContent } from "@/components/dashboard/ventas-content";

export default async function VentasPage() {
  const initialFechas = getDefaultFechas();
  const { reportePorZona, reportePorImpulsadora, error } =
    await fetchVentaDetallesServer(initialFechas);

  return (
    <VentasContent
      initialReportePorZona={reportePorZona}
      initialReportePorImpulsadora={reportePorImpulsadora}
      initialFechas={initialFechas}
      initialError={error}
    />
  );
}

