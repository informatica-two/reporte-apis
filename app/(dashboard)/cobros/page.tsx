import { fetchCobrosDetallesServer, getDefaultFechas } from "@/lib/server-data";
import { CobrosContent } from "@/components/dashboard/cobros-content";

export default async function CobrosPage() {
  const initialFechas = getDefaultFechas();
  const { reportePorMedio, reportePorTipoDocumento, reportePorMunicipio, reportePorZona, cobrosData, error } =
    await fetchCobrosDetallesServer(initialFechas);

  return (
    <CobrosContent
      initialReportePorMedio={reportePorMedio}
      initialReportePorTipoDocumento={reportePorTipoDocumento}
      initialReportePorMunicipio={reportePorMunicipio}
      initialReportePorZona={reportePorZona}
      initialCobrosData={cobrosData}
      initialFechas={initialFechas}
      initialError={error}
    />
  );
}
