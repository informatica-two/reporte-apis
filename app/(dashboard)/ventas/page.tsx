import { fetchVentaDetallesServer, getDefaultFechas } from "@/lib/server-data";
import { VentasContent } from "@/components/dashboard/ventas-content";

export default async function VentasPage() {
  const initialFechas = getDefaultFechas();
  const { reportePorZona, reportePorImpulsadora, reporteDetalle3, reportePorTipoCredito, reporteVentaPorDivision, ventaData, error } =
    await fetchVentaDetallesServer(initialFechas);

  return (
    <VentasContent
      initialReportePorZona={reportePorZona}
      initialReportePorImpulsadora={reportePorImpulsadora}
      initialReporteDetalle3={reporteDetalle3}
      initialReportePorTipoCredito={reportePorTipoCredito}
      initialReporteVentaPorDivision={reporteVentaPorDivision}
      initialVentaData={ventaData}
      initialFechas={initialFechas}
      initialError={error}
    />
  );
}
