# QUIMICORP PERÚ S.A.C. — ERP Industrial

Arquitectura base + Sprint 1 (Producción, Fórmulas e Inventario).

## Stack

- **Frontend:** Next.js 14 (App Router) + TypeScript strict + Tailwind + Shadcn/Radix + TanStack Table v8 + React Hook Form + Zod + TanStack Query v5 + Zustand
- **Backend:** NestJS + TypeScript, modular, REST + WebSockets (base lista)
- **DB/Caché:** PostgreSQL 16 (Supabase) + Prisma ORM + Upstash Redis
- **Storage/Monitoreo:** Cloudflare R2 + Sentry + Docker Compose

## Árbol de carpetas

```
quimicorp-erp/
├── docker-compose.yml
├── prisma/
│   └── schema.prisma                 # 20+ entidades, Sprints 1-5
├── backend/                          # NestJS
│   ├── package.json
│   ├── .env.example
│   └── src/
│       ├── main.ts
│       ├── app.module.ts
│       ├── common/
│       │   └── prisma/
│       │       ├── prisma.service.ts
│       │       └── prisma.module.ts
│       ├── kardex/                   # Kardex Inmutable (ACID)
│       │   ├── dto/registrar-movimiento.dto.ts
│       │   ├── kardex.service.ts
│       │   ├── kardex.controller.ts
│       │   └── kardex.module.ts
│       ├── inventario/               # Insumos y Familias
│       │   ├── dto/crear-insumo.dto.ts
│       │   ├── inventario.service.ts
│       │   ├── inventario.controller.ts
│       │   └── inventario.module.ts
│       ├── formulas/                 # Fórmula Máster
│       │   ├── dto/crear-formula.dto.ts
│       │   ├── formulas.service.ts
│       │   ├── formulas.controller.ts
│       │   └── formulas.module.ts
│       ├── produccion/               # Órdenes, validación de stock, QA
│       │   ├── dto/crear-orden.dto.ts
│       │   ├── produccion.service.ts
│       │   ├── produccion.controller.ts
│       │   └── produccion.module.ts
│       └── sub-almacen/              # Sobrantes reaprovechables
│           ├── sub-almacen.service.ts
│           ├── sub-almacen.controller.ts
│           └── sub-almacen.module.ts
└── frontend/                         # Next.js
    ├── package.json
    ├── tailwind.config.ts
    ├── next.config.js
    ├── tsconfig.json
    ├── .env.local.example
    ├── app/
    │   ├── layout.tsx
    │   ├── page.tsx                  # redirige a /dashboard/inventario
    │   ├── providers.tsx             # TanStack Query provider
    │   ├── globals.css
    │   └── dashboard/
    │       ├── layout.tsx            # sidebar de navegación
    │       ├── inventario/page.tsx
    │       ├── formulas/page.tsx
    │       ├── produccion/page.tsx
    │       ├── kardex/page.tsx
    │       └── qa/page.tsx
    ├── components/
    │   ├── ui/                       # Button, Input, Badge, Card (Shadcn-style)
    │   ├── inventario/InventoryTable.tsx
    │   ├── formulas/FormulaMasterForm.tsx
    │   ├── produccion/
    │   │   ├── ValidarStockPanel.tsx
    │   │   ├── AjusteFinoForm.tsx
    │   │   └── SubAlmacenPanel.tsx
    │   ├── kardex/KardexTable.tsx
    │   └── qa/QAApprovalTray.tsx
    └── lib/
        ├── api.ts
        ├── types.ts
        └── utils.ts
```

## Entidades del schema.prisma (Sprints 1-5)

| Módulo | Entidades |
|---|---|
| 1. Producción/Inventario | Insumo, FamiliaInsumo, FormulaMaster, FormulaDetalle, OrdenProduccion, AjusteFino, SubAlmacenSobrante, KardexInmutable |
| 2. Personal/Biométrico | Usuario, Rol, MarcacionBiometrico, Asistencia, VentanaAlmuerzoQA, CalificacionOperario |
| 3. Trazabilidad/Despacho | EtiquetaImpresa, TicketDespacho, IncidenciaLote |
| 4. Analytics/KPIs | MetricaProduccionDiaria, ValorizacionInventario |
| 5. Seguridad/Audit | Permiso, RolPermiso, AuditLog |

Total: **22 entidades** relacionadas, todas con `id` UUID (`@default(uuid())`), timestamps (`createdAt`/`updatedAt` donde aplica — `KardexInmutable` y `AuditLog` son intencionalmente append-only sin `updatedAt`), enums tipados y `@@index` en las columnas de consulta frecuente.

## Decisiones clave del Sprint 1

1. **Kardex 100% ACID e inmutable**: `KardexService.registrarMovimiento` corre en una transacción `SERIALIZABLE`, bloquea la fila del insumo con `SELECT ... FOR UPDATE`, calcula `stockAnterior`/`stockNuevo` en servidor y nunca permite `UPDATE`/`DELETE` sobre `kardex_inmutable`. Cualquier corrección se hace con un nuevo movimiento.
2. **Validación previa de stock** (`POST /produccion/ordenes/validar-stock`): calcula el requerimiento real de cada insumo a partir de los porcentajes de `FormulaDetalle` × `cantidadPlanificada`, y lo compara contra `stockReal`. `crearOrden` reutiliza esta misma validación y rechaza la creación (400) si algún insumo es insuficiente.
3. **Ajuste Fino** sincronizado: registrar un ajuste crea el registro de negocio (`AjusteFino`) y dispara automáticamente un movimiento `AJUSTE_FINO` en el Kardex, dentro de la misma transacción.

## Cómo levantar el proyecto

```bash
# 1) Infra local
docker compose up -d postgres

# 2) Backend
cd backend
cp .env.example .env
npm install
npx prisma migrate dev --name init
npm run start:dev   # http://localhost:3001/api/v1

# 3) Frontend
cd ../frontend
cp .env.local.example .env.local
npm install
npm run dev          # http://localhost:3000
```

## Pendiente para Sprint 2+ (fuera de alcance de este entregable)

- Autenticación/JWT y guard de permisos por rol (`Rol`/`Permiso`/`RolPermiso` ya modelados).
- Módulo de biométrico y asistencia (entidades listas en el schema).
- WebSockets para actualización en vivo del Kardex y la bandeja QA.
- Integración real con Cloudflare R2 (fichas técnicas/certificados) y Upstash Redis (rate-limiting distribuido, hoy solo local vía `ThrottlerModule`).
