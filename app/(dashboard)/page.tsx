import { fetchKpisServer, getDefaultFechas } from "@/lib/server-data";
import { DashboardContent } from "@/components/dashboard/dashboard-content";

export default async function HomePage() {
  const initialFechas = getDefaultFechas();
  const { kpis, error } = await fetchKpisServer(initialFechas);

  return (
    <DashboardContent
      initialKpis={kpis}
      initialFechas={initialFechas}
      initialError={error}
    />
  );
}
