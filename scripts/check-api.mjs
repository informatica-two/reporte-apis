/**
 * Script para verificar que todos los endpoints de la API responden.
 * Ejecutar: node scripts/check-api.mjs
 * (o yarn check-api si tsx está instalado)
 *
 * Carga variables de .env.local y .env
 */
import { config } from "dotenv";
import { resolve } from "path";
import axios from "axios";

// Cargar env antes de crear el cliente
config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

const baseUrl = process.env.VOGUE_API_BASE_URL ?? "https://mivogue.com:83/APIs";
const auth = {
  username: process.env.VOGUE_API_USER ?? "",
  password: process.env.VOGUE_API_PASSWORD ?? "",
};

const ENDPOINTS = [
  { name: "activos", path: "/reporte_visual/activos" },
  { name: "activos/detalle_1 (reporte por zona)", path: "/reporte_visual/activos/detalle_1" },
  { name: "activos/detalle_2 (reporte por tipo crédito)", path: "/reporte_visual/activos/detalle_2" },
  { name: "activos/detalle_3 (reporte por rango)", path: "/reporte_visual/activos/detalle_3" },
  { name: "activos/detalle_4 (reporte por año)", path: "/reporte_visual/activos/detalle_4" },
  { name: "cobros", path: "/reporte_visual/cobros" },
  { name: "cobros/detalle_1 (reporte por medio)", path: "/reporte_visual/cobros/detalle_1" },
  { name: "cobros/detalle_2 (reporte por tipo documento)", path: "/reporte_visual/cobros/detalle_2" },
  { name: "cobros/detalle_3 (reporte por municipio)", path: "/reporte_visual/cobros/detalle_3" },
  { name: "cobros/detalle_4 (reporte por zona)", path: "/reporte_visual/cobros/detalle_4" },
  { name: "venta", path: "/reporte_visual/venta" },
  { name: "venta/detalle_1 (reporte por zona)", path: "/reporte_visual/venta/detalle_1" },
  { name: "venta/detalle_2 (reporte por impulsadora)", path: "/reporte_visual/venta/detalle_2" },
  { name: "venta/detalle_3 (reporte por línea)", path: "/reporte_visual/venta/detalle_3" },
  { name: "venta/detalle_4 (reporte por tipo crédito)", path: "/reporte_visual/venta/detalle_4" },
  { name: "reclutamientos", path: "/reporte_visual/reclutamientos" },
];

function formatDate(d) {
  return d.toISOString().slice(0, 10);
}

function getDefaultDateRange() {
  const today = new Date();
  const start = new Date(today);
  start.setDate(start.getDate() - 6); // 7 días: hoy + 6 anteriores
  return {
    fecha_inicio: formatDate(start),
    fecha_fin: formatDate(today),
  };
}

function buildFullUrl(path) {
  const base = baseUrl.replace(/\/$/, "");
  const pathClean = path.startsWith("/") ? path : "/" + path;
  return `${base}${pathClean}`;
}

async function checkEndpoint(name, path) {
  const params = getDefaultDateRange();
  const fullUrl = buildFullUrl(path);
  const formData = new FormData();
  formData.append("fecha_inicio", params.fecha_inicio);
  formData.append("fecha_fin", params.fecha_fin);

  const start = performance.now();
  try {
    const res = await axios.post(baseUrl + path, formData, {
      auth,
      timeout: 60000,
    });
    const ms = Math.round(performance.now() - start);
    return {
      name,
      fullUrl,
      ok: res.status >= 200 && res.status < 300,
      status: res.status,
      ms,
      data: res.data,
    };
  } catch (err) {
    const ms = Math.round(performance.now() - start);
    const msg = err?.message ?? "Error desconocido";
    const status = err?.response?.status;
    const data = err?.response?.data;
    return { name, fullUrl, ok: false, status, error: msg, ms, data };
  }
}

async function main() {
  const hasAuth = Boolean(auth.username) && Boolean(auth.password);

  const params = getDefaultDateRange();
  console.log("\n🔍 Verificando endpoints de la API Vogue\n");
  console.log(`Base URL: ${baseUrl}`);
  console.log(`Auth configurada: ${hasAuth ? "Sí" : "No"}`);
  console.log(`Usuario: ${auth.username || "(vacío)"}`);
  console.log(`Password: ${auth.password ? "***" : "(vacío)"}`);
  console.log(`Rango (multipart/form-data): ${params.fecha_inicio} → ${params.fecha_fin}`);
  console.log("");

  const results = await Promise.all(
    ENDPOINTS.map(({ name, path }) => checkEndpoint(name, path))
  );

  let allOk = true;
  for (const r of results) {
    const icon = r.ok ? "✅" : "❌";
    const status = r.status != null ? ` (${r.status})` : "";
    const time = r.ms != null ? ` ${r.ms}ms` : "";
    const err = r.error ? `: ${r.error}` : "";
    console.log(`${icon} ${r.name}${status}${time}${err}`);
    if (r.fullUrl) console.log(`   POST ${r.fullUrl} (multipart: fecha_inicio, fecha_fin)`);
    if (!r.ok) allOk = false;

    // Mostrar data
    const data = r.data;
    if (data !== undefined) {
      const json = JSON.stringify(data, null, 2);
      const preview = json.length > 800 ? json.slice(0, 800) + "\n... (truncado)" : json;
      console.log(`   Data:\n${preview.split("\n").map((l) => "   " + l).join("\n")}`);
    }
    console.log("");
  }
  if (allOk) {
    console.log("Todos los endpoints responden correctamente.\n");
    process.exit(0);
  } else {
    console.log(
      "Algunos endpoints fallaron. Revisa VOGUE_API_BASE_URL, VOGUE_API_USER y VOGUE_API_PASSWORD en .env.local\n"
    );
    process.exit(1);
  }
}

main();
