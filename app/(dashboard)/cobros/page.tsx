import { fetchCobrosDetallesServer, getDefaultFechas } from "@/lib/server-data";
import { CobrosContent } from "@/components/dashboard/cobros-content";

export default async function CobrosPage() {
  const initialFechas = getDefaultFechas();
  const { reportePorMedio, reportePorTipoDocumento, reportePorMunicipio, reportePorZona, ventaCobroPorZona, cobrosData, ventaData, error } =
    await fetchCobrosDetallesServer(initialFechas);

  return (
    <CobrosContent
      initialReportePorMedio={reportePorMedio}
      initialReportePorTipoDocumento={reportePorTipoDocumento}
      initialReportePorMunicipio={reportePorMunicipio}
      initialReportePorZona={reportePorZona}
      initialVentaCobroPorZona={ventaCobroPorZona}
      initialCobrosData={cobrosData}
      initialVentaData={ventaData}
      initialFechas={initialFechas}
      initialError={error}
    />
  );
}
