# Vogue Dashboard

Dashboard de reportes visuales para Vogue. Muestra KPIs, ventas vs cobros, composición de ventas y composición de cobros con filtro por rango de fechas.

## Stack

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS 4**
- **Recharts** (gráficos)
- **shadcn/ui** (componentes)
- **date-fns** (fechas)

## Requisitos

- Node.js 18+
- Cuenta API Vogue (usuario y contraseña)

## Instalación

```bash
# Instalar dependencias
yarn install
# o
npm install
```

## Configuración

1. Copia el archivo de ejemplo de variables de entorno:

```bash
cp .env.example .env
```

2. Edita `.env` con tus credenciales:

```env
VOGUE_API_BASE_URL=https://mivogue.com:83/APIs
VOGUE_API_USER=tu_usuario
VOGUE_API_PASSWORD=tu_password
NEXT_PUBLIC_FRONTEND_SOURCE=vogue-web
```

## Scripts

| Comando | Descripción |
|---------|-------------|
| `yarn dev` | Servidor de desarrollo en [http://localhost:3000](http://localhost:3000) |
| `yarn build` | Build de producción |
| `yarn start` | Servidor de producción |
| `yarn lint` | Ejecutar ESLint |
| `yarn check-api` | Verificar conexión con la API |

## Estructura del proyecto

```
├── app/                    # App Router (Next.js)
│   ├── api/                # API routes (proxy a Vogue)
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── api/                    # Cliente y tipos de la API
│   ├── reporteVisual.ts
│   ├── constants.ts
│   └── types.ts
├── components/
│   ├── dashboard/          # Dashboard y gráficos
│   │   ├── dashboard-page.tsx
│   │   ├── dashboard-header.tsx
│   │   ├── dashboard-skeleton.tsx
│   │   ├── kpi-cards.tsx
│   │   ├── ventas-vs-cobros-chart.tsx
│   │   ├── desglose-ventas-waterfall.tsx  # Composición ventas
│   │   └── composicion-cobros-chart.tsx
│   └── ui/                 # Componentes reutilizables
├── hooks/
│   ├── use-reporte-data.ts # Fetch y estado de KPIs
│   └── use-date-range.ts
├── lib/
│   ├── charts/             # Lógica de gráficos (separada de UI)
│   │   ├── ventas-vs-cobros.ts
│   │   ├── composicion-ventas.ts
│   │   └── composicion-cobros.ts
│   ├── utils.ts
│   └── date-utils.ts
└── scripts/
    └── check-api.mjs       # Script para probar la API
```

## Funcionalidades

### KPIs
- **Activos netos** – Tamaño de la red de usuarios activos
- **Reclutamientos** – Nuevos integrantes en el período
- **Venta neta** – Dinero vendido menos devoluciones
- **Cobro neto** – Dinero efectivamente cobrado
- **ARPU** – Ingreso promedio por activo
- **Venta promedio diaria** – Ritmo diario de ventas
- **Cobro promedio diario** – Flujo de caja diario

### Gráficos
1. **Ventas vs Cobros** – Barras comparativas con ratio e insights
2. **Composición de ventas** – Donut: Venta bruta − Devoluciones = Venta neta
3. **Composición de cobros** – Donut: Cobro bruto − Anulaciones = Cobro neto

### Filtros
- Selector de rango de fechas (Date Range Picker)
- Presets: Hoy, 7 días, 30 días, Este mes, Mes anterior

## API

La app usa un proxy en `/api/reporte-visual/[endpoint]` para evitar CORS y no exponer credenciales en el cliente. Los endpoints consumidos son:

- `activos` – Activos netos y metas
- `cobros` – Cobros brutos, netos y anulaciones
- `venta` – Ventas brutas, netas y devoluciones
- `reclutamientos` – Cantidad de reclutamientos

## Licencia

Proyecto privado.
