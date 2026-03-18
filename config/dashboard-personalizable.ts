// =============================================================================
// ARCHIVO DE CONFIGURACIÓN DEL DASHBOARD PERSONALIZABLE
// =============================================================================
//
// Este es el único archivo que necesitas modificar para personalizar el
// dashboard. Sigue las instrucciones paso a paso en cada sección.
//
// TIPOS DE GRÁFICA DISPONIBLES:
//   "barras"    → Gráfica de barras verticales  (comparar categorías)
//   "linea"     → Gráfica de línea              (tendencias en el tiempo)
//   "pastel"    → Gráfica de pastel / dona      (composición o porcentajes)
//   "area"      → Gráfica de área               (volumen acumulado)
//   "cascada"   → Gráfica de cascada/waterfall  (desglose de variaciones)
//   "tabla"     → Tabla de datos                (información en filas)
//
// FORMATO DE VALOR EN TOOLTIPS Y ETIQUETAS:
//   "moneda"     → $1,234,567
//   "numero"     → 1,234,567
//   "porcentaje" → 12.3%
//
// TAMAÑO DE CADA TARJETA EN EL GRID:
//   "normal"   → Ocupa 1 columna
//   "ancho"    → Ocupa 2 columnas
//   "completo" → Ocupa todo el ancho
//
// =============================================================================

// -----------------------------------------------------------------------------
// TIPOS — No necesitas modificar esta sección
// -----------------------------------------------------------------------------

export type TipoGrafica = "barras" | "linea" | "pastel" | "area" | "cascada" | "tabla";

export type FormatoValor = "moneda" | "numero" | "porcentaje";

export type TamanoSlot = "normal" | "ancho" | "completo";

/**
 * Formato que esperan las gráficas de barras, línea, área y cascada.
 * Cada objeto representa un punto o barra en la gráfica.
 */
export type DatoGrafica = {
  /** Texto que aparece en el eje X o en la leyenda */
  etiqueta: string;
  /** Valor numérico principal (eje Y) */
  valor: number;
  /** Valor secundario opcional (para gráficas con dos series) */
  valor2?: number;
  /** Color personalizado opcional, ej: "#FF5733" */
  color?: string;
};

/**
 * Formato para la gráfica de tipo "tabla".
 * Cada objeto es una fila; las llaves son los nombres de columna.
 */
export type FilaTabla = Record<string, string | number>;

/** Configuración de un slot (posición en el dashboard) */
export type SlotConfig = {
  /** Título que aparece en la parte superior de la tarjeta */
  titulo: string;

  /** Descripción breve que aparece debajo del título (opcional) */
  descripcion?: string;

  /** Tipo de gráfica a mostrar */
  tipo: TipoGrafica;

  /**
   * Tamaño de la tarjeta en el grid (opcional, por defecto "normal").
   * "normal"   → 1 columna
   * "ancho"    → 2 columnas
   * "completo" → todo el ancho
   */
  tamano?: TamanoSlot;

  /**
   * URL del endpoint de tu API que devuelve los datos.
   *
   * OPCIONES:
   *   - Ruta relativa de tu propia API de Next.js: "/api/mi-endpoint"
   *   - URL absoluta de una API externa: "https://mi-servidor.com/datos"
   *
   * Tu API debe aceptar una solicitud POST con este cuerpo JSON:
   *   { "fecha_inicio": "YYYY-MM-DD", "fecha_fin": "YYYY-MM-DD" }
   *
   * Si tu API no necesita fechas, ignora los parámetros que reciba.
   * Si no necesitas un endpoint, usa "datosEstaticos" en su lugar.
   */
  endpoint?: string;

  /**
   * Función que transforma la respuesta de tu API al formato que espera la gráfica.
   *
   * Para gráficas de barras, línea, área, cascada y pastel debe devolver DatoGrafica[].
   * Para la tabla debe devolver FilaTabla[].
   *
   * EJEMPLO — si tu API devuelve: [{ mes: "Enero", total: 150000 }, ...]
   *
   *   mapearDatos: (respuesta) =>
   *     (respuesta as Array<{ mes: string; total: number }>).map((item) => ({
   *       etiqueta: item.mes,    // ← nombre del campo que va en el eje X
   *       valor: item.total,     // ← nombre del campo numérico principal
   *     }))
   *
   * EJEMPLO — si tu API devuelve: { success: true, detalle: [...] }
   *
   *   mapearDatos: (respuesta) => {
   *     const r = respuesta as { detalle: Array<{ fecha: string; monto: number }> };
   *     return r.detalle.map((item) => ({
   *       etiqueta: item.fecha,
   *       valor: item.monto,
   *     }));
   *   }
   */
  mapearDatos?: (respuestaApi: unknown) => DatoGrafica[] | FilaTabla[];

  /**
   * Datos estáticos para pruebas o cuando no hay endpoint disponible.
   * Si defines tanto "endpoint" como "datosEstaticos", se usan los del endpoint.
   *
   * Para gráficas (barras, línea, etc.) usa un arreglo de DatoGrafica:
   *   datosEstaticos: [
   *     { etiqueta: "Enero", valor: 100000 },
   *     { etiqueta: "Febrero", valor: 120000 },
   *   ]
   *
   * Para tabla usa un objeto con columnas y filas:
   *   datosEstaticos: {
   *     columnas: ["Mes", "Ventas", "Cobros"],
   *     filas: [
   *       { Mes: "Enero", Ventas: 100000, Cobros: 90000 },
   *     ]
   *   }
   */
  datosEstaticos?: DatoGrafica[] | { columnas: string[]; filas: FilaTabla[] };

  /** Formato de los números en tooltips y etiquetas (opcional, por defecto "numero") */
  formatoValor?: FormatoValor;

  /**
   * Etiquetas de las series para gráficas de doble serie (opcionales).
   * Ejemplo: si valor = ventas y valor2 = cobros:
   *   etiquetaValor: "Ventas", etiquetaValor2: "Cobros"
   */
  etiquetaValor?: string;
  etiquetaValor2?: string;
};

// =============================================================================
// ╔═══════════════════════════════════════════════════════════════════════════╗
// ║          CONFIGURACIÓN DE LOS SLOTS — MODIFICA ESTA SECCIÓN             ║
// ╚═══════════════════════════════════════════════════════════════════════════╝
//
// Puedes activar entre 1 y 6 slots. Para activar un slot, descomenta
// su bloque (elimina los // al inicio de cada línea) y llena sus datos.
//
// Para desactivar un slot, vuelve a comentarlo o elimina su bloque.
// =============================================================================

export const CONFIGURACION_DASHBOARD: SlotConfig[] = [
  // ── SLOT 1 ──────────────────────────────────────────────────────────────────
  // INSTRUCCIONES:
  //   1. Cambia "titulo" por el nombre que quieres mostrar en la tarjeta
  //   2. Elige el "tipo" de gráfica (barras, linea, pastel, area, cascada, tabla)
  //   3. En "endpoint" pon la ruta de tu API
  //   4. En "mapearDatos" explícale cómo leer la respuesta de tu API
  //
  // {
  //   titulo: "Ventas por Mes",
  //   descripcion: "Total de ventas agrupado por mes del período",
  //   tipo: "barras",
  //   tamano: "normal",
  //   formatoValor: "moneda",
  //   etiquetaValor: "Ventas",
  //
  //   // Ruta de tu API (debe ser una ruta de Next.js o URL externa)
  //   endpoint: "/api/ventas-mensuales",
  //
  //   // Transforma la respuesta de tu API al formato de la gráfica.
  //   // Cambia "item.mes" y "item.total" por los campos reales de tu API.
  //   mapearDatos: (respuesta) =>
  //     (respuesta as Array<{ mes: string; total: number }>).map((item) => ({
  //       etiqueta: item.mes,
  //       valor: item.total,
  //     })),
  // },

  // ── SLOT 2 ──────────────────────────────────────────────────────────────────
  // {
  //   titulo: "Tendencia de Cobros",
  //   descripcion: "Evolución de cobros en el período seleccionado",
  //   tipo: "linea",
  //   tamano: "ancho",
  //   formatoValor: "moneda",
  //   etiquetaValor: "Cobros",
  //   endpoint: "/api/cobros-tendencia",
  //
  //   // Ejemplo: si tu API devuelve { success: true, detalle: [...] }
  //   mapearDatos: (respuesta) => {
  //     const r = respuesta as { detalle: Array<{ fecha: string; cobros: number }> };
  //     return r.detalle.map((item) => ({
  //       etiqueta: item.fecha,
  //       valor: item.cobros,
  //     }));
  //   },
  // },

  // ── SLOT 3 ──────────────────────────────────────────────────────────────────
  // {
  //   titulo: "Composición de Ventas",
  //   descripcion: "Distribución porcentual por categoría",
  //   tipo: "pastel",
  //   tamano: "normal",
  //   formatoValor: "porcentaje",
  //   endpoint: "/api/composicion-categorias",
  //
  //   mapearDatos: (respuesta) =>
  //     (respuesta as Array<{ categoria: string; porcentaje: number }>).map((item) => ({
  //       etiqueta: item.categoria,
  //       valor: item.porcentaje,
  //     })),
  // },

  // ── SLOT 4 ──────────────────────────────────────────────────────────────────
  // {
  //   titulo: "Acumulado del Período",
  //   descripcion: "Crecimiento acumulado semana a semana",
  //   tipo: "area",
  //   tamano: "normal",
  //   formatoValor: "numero",
  //   etiquetaValor: "Acumulado",
  //   endpoint: "/api/acumulado-semanal",
  //
  //   mapearDatos: (respuesta) =>
  //     (respuesta as Array<{ semana: string; acumulado: number }>).map((item) => ({
  //       etiqueta: item.semana,
  //       valor: item.acumulado,
  //     })),
  // },

  // ── SLOT 5 ──────────────────────────────────────────────────────────────────
  // {
  //   titulo: "Desglose de Resultado",
  //   descripcion: "Variaciones positivas y negativas del período",
  //   tipo: "cascada",
  //   tamano: "ancho",
  //   formatoValor: "moneda",
  //   endpoint: "/api/desglose-resultado",
  //
  //   mapearDatos: (respuesta) =>
  //     (respuesta as Array<{ concepto: string; monto: number }>).map((item) => ({
  //       etiqueta: item.concepto,
  //       valor: item.monto,
  //     })),
  // },

  // ── SLOT 6 ──────────────────────────────────────────────────────────────────
  // {
  //   titulo: "Detalle de Operaciones",
  //   descripcion: "Listado completo de operaciones del período",
  //   tipo: "tabla",
  //   tamano: "completo",
  //   endpoint: "/api/operaciones-detalle",
  //
  //   // Para la tabla, mapearDatos debe devolver un arreglo de objetos planos.
  //   // Las llaves del primer objeto se usan como nombres de columna.
  //   mapearDatos: (respuesta) =>
  //     (respuesta as { filas: Array<Record<string, string | number>> }).filas,
  //
  //   // Alternativa: si no tienes endpoint aún, usa datosEstaticos para probar:
  //   // datosEstaticos: {
  //   //   columnas: ["Fecha", "Concepto", "Monto"],
  //   //   filas: [
  //   //     { Fecha: "2026-01-01", Concepto: "Venta", Monto: 50000 },
  //   //     { Fecha: "2026-01-02", Concepto: "Cobro", Monto: 45000 },
  //   //   ],
  //   // },
  // },
];
