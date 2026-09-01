# HANDOVER — ERP QUIMICORP — Contexto Detalladísimo para Siguiente Agente/Chat

> **Rama:** `feature/Desarrollo` — **Último push:** `ab8e4f3` (fix antidoble-clic + dedup lotes) sobre `c1bccaf` (docs) — Todo ya en `origin/feature/Desarrollo`.
> **Stack:** Next.js 14 (App Router) + TypeScript estricto + Tailwind + NestJS 10 + Prisma 5 + PostgreSQL 16 (Docker `quimicorp_postgres`) + Socket.IO 4.8 + Docker Compose.
> **Despliegue local:** `docker compose up -d --build --no-deps <svc>` (¡con `--build` obligatorio! `quimicorp_backend` en `:3001/api/v1`, `quimicorp_frontend` en `:3000`). `npx.cmd tsc --noEmit` para validar. PowerShell 5.1 en `C:\Users\Lenovo\Documents\GitHub\ERP-QUIMICORP`.
> **Credenciales dev:** `gerencia@quimicorp.pe` / `Quimicorp2026!` (`produccion@quimicorp.pe` también). `DATABASE_URL=postgresql://quimicorp:quimicorp_dev_password@localhost:5432/quimicorp_erp?schema=public`.

## 1. Objetivo General
ERP industrial para QUIMICORP PERÚ SAC (2 sucursales) — Producción, Fórmulas, Inventario/Kardex/Etiquetas/Sub-almacén, Comercial (Pedidos/Cotizaciones), Clientes/Cobranzas, RRHH/Biometría, con tiempo real, trazabilidad y RBAC Enterprise. Trabajar **solo con datos reales**, sin mocks permanentes, y **no tocar git sin orden** (ya autorizado y pusheado hasta `ab8e4f3`).

## 2. Arquitectura y Convenciones Clave
- **Monorepo:** `backend/src` (NestJS), `frontend/app` (Next.js), `prisma/schema.prisma` (raíz, output a `backend/node_modules/.prisma/client`), `worker/` (Python ZKTeco).
- **Auth:** JWT en `localStorage:quimicorp_jwt` (a migrar a httpOnly), `apiFetch` en `frontend/lib/apiClient.ts` con `getApiBaseUrl()`/`getSocketUrl()` dinámico por hostname. `JwtAuthGuard` + `RolesGuard` + `ServiceTokenGuard` (para worker biometría `X-Service-Token` vs `ASISTENCIA_SERVICE_TOKEN`).
- **Socket centralizado:** `frontend/lib/socketContext.tsx` (`SocketProvider` único, `auth:{token}`, reconexión) envuelto en `app/providers.tsx` (dentro de `AuthProvider`). Antes había 6× `io('http://localhost:3001')` con polling/storage — eliminado. Eventos: `order:created_to_plant`, `order:status_updated`, `order:accepted_by_plant`, `order:devolucion`, `lote:estado_actualizado`, `inventario:actualizado`, `inventario:alerta_stock_critico`.
- **RBAC:** `Role` enum con 13 roles (GERENCIA, ADMINISTRACION, PRODUCCION_ALMACEN, etc.), `adminSidebarItems` en `frontend/components/sidebar.tsx` filtra por `hasPermission`.
- **Prisma:** 243 `FormulaMaster`, 2054 `FormulaDetalle` (tras vaciado, `insumoId` huérfano hasta re-vincular), 0 `Insumo` (vacío para respaldo real, antes 511 y 231), 0 `KardexMovimiento`/`KardexInmutable`, `ColaDespacho` con `numeroGuia`, `SubAlmacenSobrante`, `Asistencia`/`Turno`/`Sucursal`/`MarcacionPendiente` para biometría.

## 3. Estado Detallado por Módulo

### 3.1 Producción — Pedidos Entrantes (`frontend/app/produccion/pedidos/page.tsx`, `backend/src/pedidos-admin/*`, `backend/src/produccion/produccion.service.ts:crearOrden`)
- Flujo: `Pedidos Comerciales (Administración)` → `Aprobar & Enviar a Reactores` → `POST /pedidos-admin/:id/aprobar` + `POST /produccion/ordenes {formulaId, cantidadPlanificada, supervisorId, clienteNombre}` → `OrdenProduccion` + `ProduccionGateway.emitirEstadoActualizado`. **Idempotencia 30s** en `crearOrden` (evita doble clic duplicado) y `useRef` guard en frontend (`ab8e4f3`). Antes creaba 2 lotes por pedido (LOTE- + LOT-), dedupilado (borrados `LOT-2024-7226-1`, `LOT-2024-7939-1`, `LOT-2024-7857-1`, `LOT-2024-5386-1`). **Validado:** 2026-09-01 ahora 3 lotes (no 6).

### 3.2 Control de Producción & QA (`frontend/app/produccion/qa/page.tsx`, `backend/src/produccion/produccion.service.ts:listar/obtenerProgramacionDiaria/obtenerMergeReceta`)
- Fuente de verdad: `GET /produccion/ordenes?fecha` y `/programacion-diaria?fecha` ahora incluyen `formula { detalles { insumo { familia } } }` (antes `formula:true` solo → fallback dummy de detergente). **Sin dummy** (`INS-001..004` eliminado). La “Receta Unificada” usa `formulaItems` reales con `%` y `gramos = cantidadKg*1000*(%/100)` para **cualquier cantidad X** (50/100/200 KG). El dropdown “Ver Fórmula Completa” ya no expande inline sino que abre **modal izquierda fórmula / derecha pasos** vía `GET /produccion/ordenes/:id/receta` (merge base + `pedidoAditivos` + `pasosElaboracion` de `FormulaVariant` o `FormulaMaster`). Pasos son solo lectura en Planta. **Validado:** `LOTE-000006 | ACEITE DE BATANA | 50 KG → 5 insumos reales` (VASELINA 98.849% etc.) con `totalGramos`.

### 3.3 Fórmulas (`FormulaMaster`, `FormulaDetalle`, `FormulaVariant`)
- 243 fórmulas prediseñadas intactas. `FormulaDetalle.insumoId` nullable con `SetNull` — tras vaciar inventario quedan huérfanos. **Plan acordado:** nuevo inventario se registra en **Gestión de Inventario** (ver 3.6) con `codigo` canónico, luego se revinculan detalles por `codigo` normalizado (ya hecho una vez: 1340 revinculados, 3 genéricos `INS-999/998/997` creados para BATANA). Nombres de fórmula con typos se toleran por `codigoFormula` (`FM-0337`), no por texto.

### 3.4 Inventario, Kardex, Etiquetas, Sub-almacén
- **Inventario vaciado:** `insumos:0`, `kardex:0`, `familias:5` (MATERIAS PRIMAS FORMULACIÓN, MATERIA_PRIMA_BASE, FRAGANCIAS_Y_ACEITES, PIGMENTOS_Y_COLORANTES, ADITIVOS_Y_AUXILIARES) — listo para respaldo real. Antes 511/231 para capacitación. **Gestión de Inventario** (`/administracion/gestion-inventario`, añadida a sidebar `5. ALMACÉN Y LOGÍSTICA`) con tabla FK (`insumo.id` uuid + `codigo` SKU visible), búsqueda, filtro categoría, crear insumo (`POST /inventario/insumos` con `tipo` BASE/FRAGANCIA/PIGMENTO/ENVASE/OTRO), crear categoría (`POST /inventario/familias`), eliminar (borrado físico si no usado, sino `INACTIVO`), edición inline, socket `inventario:actualizado`.
- **Kardex:** `KardexMovimiento` con `categoriaKardex` tipificada por `insumo.tipo` (BASE→MATERIA_PRIMA, FRAGANCIA/PIGMENTO→INSUMO, ENVASE→ENVASE, OTRO+embalaje→EMBALAJE) — antes por `familia.nombre.includes('ácido')`. `aprobarLote` crea salidas por consumo y entrada producto terminado en misma transacción. Blindaje KG/L: `KardexService.registrarMovimiento` valida `dto.unidadMedida` vs `insumo.unidadMedida` y lanza `400: No se puede ingresar en LITROS y dar salida en KG`. Documento respaldo tipificado: calle→`Guía de Remisión`, almacén→`Orden LOTE-...`. Badges: verde `ENTRADA PRODUCCIÓN`, naranja `SALIDA POR CONSUMO`, rojo `MERMA/DESCARTE`.
- **Etiquetas (`frontend/app/produccion/etiquetas/page.tsx`):** conectada a cola real `GET /produccion/etiquetas/cola` (filtra `LISTO_PARA_IMPRIMIR`), `POST /produccion/etiquetas/despachar {colaId, numeroGuia}` marca `DESPACHADO` + `numeroGuia` y propaga a `OrdenProduccion.DESPACHADO` y `PedidoComercial.ENTREGADO`, desaparece de cola y queda en historial cliente. **KG/L validado sin densidad:** `Peso Real (Balanza) — Kg` editable manual, `Cant.: 16 LITROS` muestra `14.555 kg = (16,000ml)` y `Bruto 15.475 kg` (Tara 920 g). ZPL Zebra ZT411 con ambos. **Materia Prima vs Insumo:** explicado, ya tipificado.
- **Sub-almacén (`frontend/app/produccion/inventario/page.tsx` + `backend/src/sub-almacen/*`):** ahora **producto sobrante + %** (no insumo), ej. `LOTE-000006 | 5 KG (10%) | Estante A1 - Producto (10%)` con `Reaplicar a Lote` (`PATCH /sub-almacen/:id/reusar`, socket). Modelo `SubAlmacenSobrante` con `loteOrigenId`, `insumoSubproductoId` (proxy), `pesoDisponible`, `ubicacion`, `estado`.

### 3.5 Biometría & Turnos (`prisma` Sucursal/Turno/MarcacionPendiente, `backend/src/asistencia/*`, `worker/asistencia_worker.py`, `frontend/app/administracion/asistencia/page.tsx`)
- Esquema: `Sucursal {dispositivoId, ip, port 4370}`, `Turno {horaInicio, horaFin, toleranciaMinutos, almuerzoTope 14:00}`, `Usuario {sucursalId, turnoId, cargo, codigoBiometrico}`, `Asistencia {turnoId, horaEntrada, horaSalida, estadoAlmuerzo, horasTrabajadas}`, `MarcacionPendiente` (huellas sin vincular). Migración `20260831010000_add_biometrico_multi_sucursal` aplicada. Endpoints: `POST /asistencia/marcaciones` (ServiceTokenGuard), `GET /asistencia/hoy|marcaciones|cola|sucursales|turnos`, `POST /asistencia/usuarios/:id/vincular`. Worker Python genérico ZK TCP 4370, autodetecta serial, deduplica por `seen.json`, sube por HTTPS. Frontend wirado a `GET /asistencia/hoy` + cola pendientes. **Pendiente físico:** IP fija de ZKTeco Sucursal A, mini-PC por sucursal con `.env` (ZK_IP, API_URL, SERVICE_TOKEN).

### 3.6 Gestión de Inventario (Nuevo)
- Ver 3.4 y sidebar. Clave: FK front es `insumo.id` (uuid), `codigo` es DNI legible. Todo el sistema (fórmulas, kardex, comparador) consume por `id`, no por texto, para evitar typos. Proveedor vacío por ahora, se mapeará a `proveedores` de Administración.

### 3.7 Comercial y Clientes (`pedidos-admin`, `clientes`, `cobranzas`, `cotizaciones-proveedores`)
- Flujo `COT → OP` con `pedidoAditivos`, `FormulaVariant` por cliente (un `FM-0337` puede llamarse `FEROMONAS LUCKY` para ALFALION). Kardex y etiquetas ya reflejan provenance real.

## 4. Sincronización Tiempo Real (Fase 5)
Antes: 6× `io('http://localhost:3001')` + `localStorage quimicorp_produccion_lotes_custom|quimicorp_etiquetas_cola_custom|quimicorp_kardex_custom|quimicorp_sync_event` + `setInterval 3000/5000` + `storage` event — solo 1 navegador. Ahora: `SocketProvider` único con `getSocketUrl()` + `auth:{token}`; `produccion.service` emite `lote:estado_actualizado` en `crearOrden`, `asignarOperarios`, `cambiarPaso`, `aprobarLote`, `despacharEtiqueta`, `rechazarLote`. Frontend hace `socket.on/off` + `apiFetch` y no hay polling.

## 5. Trabajo Validado End-to-End (curl/BD)
- Despacho: `POST etiquetas/despachar` → `DESPACHADO` + `numeroGuia` + `fechaCierre`; `control-producción` ve `ENTREGADO`.
- Asistencia: `POST /asistencia/marcaciones` con `guest-99` → `pendiente:true` → `GET /asistencia/cola` 1 → borrado; `GET /asistencia/hoy` 1 empleado real.
- Fórmulas: `GET /produccion/ordenes?fecha=2026-08-31` → `LOTE-000006 detalles=5` → `GET /ordenes/:id/receta` → 5 ingredientes con `%` y `pasosElaboracion`.
- Inventario vaciado: `insumos 0` (antes 511/231), `kardex 0`, `formulas 243` intactas.

## 6. Próximos Pasos Acordados
1. Registrar nuevo inventario en **Gestión de Inventario** (con FK y categorías precisas).
2. Mandar Excel de fórmulas → yo valido typos por `codigo` normalizado y revinculo `FormulaDetalle.insumoId`.
3. Configurar `Sucursal`/`Turno`/`codigoBiometrico` por empleado y desplegar `worker` por sucursal (K20 Pro + ZKTeco).
4. Retocar `proveedor` (vacío) y `Sub-almacén` producto+ % según uso real.
5. Commit/push ya hecho hasta `ab8e4f3`; no hay deuda de git pendiente salvo este HANDOVER.

## 7. Archivos Relevantes
- `prisma/schema.prisma` (Sucursal, Turno, MarcacionPendiente, ColaDespacho.numeroGuia, Usuario.sucursalId/turnoId/cargo, Asistencia.turnoId/horaEntrada/horaSalida/estadoAlmuerzo, SubAlmacenSobrante)
- `prisma/migrations/20260831000000_add_numero_guia`, `20260831010000_add_biometrico_multi_sucursal`
- `backend/src/produccion/produccion.service.ts` (crearOrden idempotente 30s, listar/programacion con detalles, aprobarLote kardex categorizado, despacharEtiqueta, obtenerMergeReceta)
- `backend/src/produccion/produccion.gateway.ts` (emitirEstadoActualizado)
- `backend/src/asistencia/*` (service, controller, dto, guard)
- `backend/src/inventario/*` (inventario.service con crearFamilia/actualizar/eliminarInsumo con INACTIVO)
- `backend/src/sub-almacen/*`, `backend/src/kardex/kardex.service.ts` (validación KG/L)
- `frontend/lib/apiClient.ts` (getApiBaseUrl/getSocketUrl), `frontend/lib/socketContext.tsx` (SocketProvider), `frontend/lib/AuthContext.tsx`, `frontend/components/sidebar.tsx` (Gestión de Inventario en 5. ALMACÉN)
- `frontend/app/produccion/pedidos/page.tsx` (apiFetch, useSocket, antidoble-clic ref), `frontend/app/produccion/qa/page.tsx` (modal izquierda fórmula/derecha pasos, sin dummy), `frontend/app/produccion/etiquetas/page.tsx` (cola real, Peso Real Balanza, ZPL KG/L), `frontend/app/produccion/inventario/page.tsx` (kardex badges, sub-almacén producto+%), `frontend/app/administracion/gestion-inventario/page.tsx` (maestro), `frontend/app/administracion/asistencia/page.tsx` (hoy+cola), `frontend/app/administracion/control-produccion/page.tsx`
- `worker/asistencia_worker.py`, `worker/Dockerfile`, `worker/requirements.txt`, `worker/.env.example`, `worker/README.md`
- `docker-compose.yml` (backend 3001, frontend 3000, postgres 5432)

## 8. Notas Operativas para Siguiente Chat
- **Rol dual:** Auditor Senior (Next.js/TS/Tailwind) + Ing. Senior (NestJS/Prisma/Docker) — formato obligatorio: Tipo de Hallazgo / Archivo y Líneas Afectadas / Diagnóstico Técnico / Solución Propuesta.
- **Reglas:** solo datos reales, `npx.cmd tsc --noEmit` antes de cada deploy, `docker compose up -d --build --no-deps <svc>`, solo 1 `in_progress` en TodoWrite, no usar `any`.
- **Para retomar:** dile al siguiente agente: “Continuamos desde HANDOVER.md, rama feature/Desarrollo en ab8e4f3, inventario vacío listo para registro, fórmulas huérfanas pendientes de revincular tras Excel”.

---
*Generado: 2026-09-01 — Para decirle al siguiente: pega este archivo como contexto inicial.*
