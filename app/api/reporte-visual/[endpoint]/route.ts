import { NextRequest, NextResponse } from "next/server";

const VALID_ENDPOINTS = [
  "activos",
  "cobros",
  "venta",
  "reclutamientos",
] as const;

const BASE_URL =
  process.env.VOGUE_API_BASE_URL ?? "https://mivogue.com:83/APIs";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ endpoint: string }> }
) {
  const { endpoint } = await params;
  if (!VALID_ENDPOINTS.includes(endpoint as (typeof VALID_ENDPOINTS)[number])) {
    return NextResponse.json(
      { success: false, detalle: "Endpoint inválido" },
      { status: 400 }
    );
  }

  let fecha_inicio: string;
  let fecha_fin: string;

  const contentType = request.headers.get("content-type") ?? "";
  
  try {
    if (contentType.includes("application/json")) {
      const body = await request.json();
      fecha_inicio = body.fecha_inicio ?? "";
      fecha_fin = body.fecha_fin ?? "";
    } else if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      fecha_inicio = (formData.get("fecha_inicio") as string) ?? "";
      fecha_fin = (formData.get("fecha_fin") as string) ?? "";
    } else {
      // Intenta JSON por defecto
      const body = await request.json();
      fecha_inicio = body.fecha_inicio ?? "";
      fecha_fin = body.fecha_fin ?? "";
    }
  } catch (parseError) {
    return NextResponse.json(
      { success: false, detalle: "Error al parsear el body de la petición" },
      { status: 400 }
    );
  }

  if (!fecha_inicio || !fecha_fin) {
    return NextResponse.json(
      { success: false, detalle: "fecha_inicio y fecha_fin son requeridos" },
      { status: 400 }
    );
  }

  const url = `${BASE_URL}/reporte_visual/${endpoint}`;
  const formData = new FormData();
  formData.append("fecha_inicio", fecha_inicio);
  formData.append("fecha_fin", fecha_fin);

  const auth = Buffer.from(
    `${process.env.VOGUE_API_USER ?? ""}:${process.env.VOGUE_API_PASSWORD ?? ""}`
  ).toString("base64");

  try {
    const start = performance.now();
    const res = await fetch(url, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Basic ${auth}`,
        "x-frontend-source":
          process.env.NEXT_PUBLIC_FRONTEND_SOURCE ?? "vogue-web",
      },
    });
    const data = await res.json();
    const ms = Math.round(performance.now() - start);
    if (process.env.NODE_ENV === "development") {
      console.log(`[API Proxy] ${endpoint}: ${ms}ms`);
    }
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error(`[API Proxy] ${endpoint}:`, error);
    return NextResponse.json(
      {
        success: false,
        detalle:
          error instanceof Error ? error.message : "Error de conexión",
      },
      { status: 500 }
    );
  }
}
