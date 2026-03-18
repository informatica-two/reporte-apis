import { ActivosContent } from "@/components/dashboard/activos-content";
import { fetchActivosDetallesServer, getDefaultFechas } from "@/lib/server-data";

export default async function ActivosPage() {
  const fechas = getDefaultFechas();
  const { reportePorZona, reportePorTipoCredito, reportePorRango, reportePorAnio, activosData, error } =
    await fetchActivosDetallesServer(fechas);

  return (
    <ActivosContent
      initialReportePorZona={reportePorZona}
      initialReportePorTipoCredito={reportePorTipoCredito}
      initialReportePorRango={reportePorRango}
      initialReportePorAnio={reportePorAnio}
      initialActivosData={activosData}
      initialFechas={fechas}
      initialError={error}
    />
  );
}
