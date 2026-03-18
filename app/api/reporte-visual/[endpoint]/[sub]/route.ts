import { NextRequest, NextResponse } from "next/server";

const BASE_URL =
  process.env.VOGUE_API_BASE_URL ?? "https://mivogue.com:83/APIs";

const VALID_SUB_ENDPOINTS: [string, string][] = [
  ["activos", "detalle_1"],
  ["activos", "detalle_2"],
  ["activos", "detalle_3"],
  ["activos", "detalle_4"],
  ["cobros", "detalle_1"],
  ["cobros", "detalle_2"],
  ["cobros", "detalle_3"],
  ["cobros", "detalle_4"],
  ["venta", "detalle_1"],
  ["venta", "detalle_2"],
  ["venta", "detalle_3"],
  ["venta", "detalle_4"],
];

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ endpoint: string; sub: string }> }
) {
  const { endpoint, sub } = await params;
  const valid = VALID_SUB_ENDPOINTS.some(
    ([e, s]) => e === endpoint && s === sub
  );
  if (!valid) {
    return NextResponse.json(
      { success: false, detalle: "Endpoint inválido" },
      { status: 400 }
    );
  }

  let fecha_inicio: string;
  let fecha_fin: string;

  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    fecha_inicio = (formData.get("fecha_inicio") as string) ?? "";
    fecha_fin = (formData.get("fecha_fin") as string) ?? "";
  } else {
    const body = await request.json();
    fecha_inicio = body.fecha_inicio ?? "";
    fecha_fin = body.fecha_fin ?? "";
  }

  if (!fecha_inicio || !fecha_fin) {
    return NextResponse.json(
      { success: false, detalle: "fecha_inicio y fecha_fin son requeridos" },
      { status: 400 }
    );
  }

  const pathSegment = `${endpoint}/${sub}`;
  const url = `${BASE_URL}/reporte_visual/${pathSegment}`;
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
      console.log(`[API Proxy] ${pathSegment}: ${ms}ms`);
    }
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error(`[API Proxy] ${pathSegment}:`, error);
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
