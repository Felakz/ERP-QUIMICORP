# MANUAL DE ARQUITECTURA Y DOCUMENTACIÓN INTEGRAL DEL SISTEMA
## ERP INDUSTRIAL QUIMICORP PERÚ S.A.C.
**Versión del Sistema:** 1.0.0 Enterprise  
**Fecha de Publicación:** 2026-09-01  
**Autoría Técnica:** Lead Fullstack Engineer & Principal System Architect  
**Stack Base:** Next.js 14 (App Router) + NestJS + Prisma ORM + PostgreSQL 16 + Docker  

---

## TABLA DE CONTENIDOS
1. [Visión General y Objetivos del Negocio](#1-visión-general-y-objetivos-del-negocio)
2. [Arquitectura Global del Sistema](#2-arquitectura-global-del-sistema)
3. [Stack Tecnológico y Dependencias](#3-stack-tecnológico-y-dependencias)
4. [Modelo de Base de Datos y Diccionario Relacional (Prisma)](#4-modelo-de-base-de-datos-y-diccionario-relacional-prisma)
5. [Módulos del Sistema: Backend (NestJS) y Frontend (Next.js)](#5-módulos-del-sistema-backend-y-frontend)
   - 5.1 [Módulo de Producción & Planta](#51-módulo-de-producción--planta)
   - 5.2 [Módulo de Fórmulas & Dosificación Metrológica](#52-módulo-de-fórmulas--dosificación-metrológica)
   - 5.3 [Módulo de Control de Calidad (QA) & Liberación](#53-módulo-de-control-de-calidad-qa--liberación)
   - 5.4 [Módulo de Etiquetado Térmico & Trazabilidad QR](#54-módulo-de-etiquetado-térmico--trazabilidad-qr)
   - 5.5 [Módulo de Kardex Multi-Almacén e Inventarios](#55-módulo-de-kardex-multi-almacén-e-inventarios)
   - 5.6 [Módulo de Clientes & Expediente Comercial 360°](#56-módulo-de-clientes--expediente-comercial-360)
   - 5.7 [Módulo de Pedidos, Facturación & Cobranzas](#57-módulo-de-pedidos-facturación--cobranzas)
   - 5.8 [Módulo de Asistencia Biométrica Multi-Sucursal](#58-módulo-de-asistencia-biométrica-multi-sucursal)
   - 5.9 [Dashboard Administrativo & Panel Gerencial](#59-dashboard-administrativo--panel-gerencial)
6. [Seguridad, Autenticación y Control de Acceso (RBAC)](#6-seguridad-autenticación-y-control-de-acceso-rbac)
7. [Worker de Biometría & Servicios Satélite](#7-worker-de-biometría--servicios-satélite)
8. [Guía de Despliegue, Dockerización y Mantenimiento](#8-guía-de-despliegue-dockerización-y-mantenimiento)
9. [Políticas de Desarrollo y Cero Mocks](#9-políticas-de-desarrollo-y-cero-mocks)

---

## 1. Visión General y Objetivos del Negocio

**QUIMICORP PERÚ S.A.C.** es una empresa química industrial dedicada a la formulación, fabricación, envasado y comercialización de productos cosméticos, de higiene personal, limpieza industrial y soluciones químicas a medida.

### Objetivos Clave del ERP:
1. **Trazabilidad Integral de Lotes:** Seguimiento desde la materia prima ingresada a almacén hasta la entrega final al cliente, registrando mermas, sub-almacenes de sobrantes y adiciones de ajuste fino.
2. **Precisión Metrológica en Planta:** Control de formulación en gramos y kilogramos con hasta 4 decimales ($0.001\text{ kg} = 1\text{ g}$), garantizando balance de masas exacto.
3. **Flujos Financieros Reales:** Gestión contable con diferenciación estricta de montos Netos vs Con IGV (18%), estados crediticios de clientes y conciliación bancaria.
4. **Aislamiento Operativo:** Separación de roles entre la operativa de fábrica (Producción y QA) y la gestión corporativa (Administración, Finanzas y Sistemas).
5. **Cero Datos Falsos:** Integración directa con base de datos PostgreSQL, sin datos simulados en ninguna capa.

---

## 2. Arquitectura Global del Sistema

El sistema implementa una arquitectura desacoplada y orientada a microservicios/módulos contenerizados:

```
                  ┌──────────────────────────────────────────────────────────┐
                  │                 CLIENTES / NAVEGADORES                   │
                  │   (Planta Industrial / Oficinas Administrativas / TI)   │
                  └─────────────┬──────────────────────────────┬─────────────┘
                                │ HTTP / REST                  │ WebSockets (WS)
                                ▼                              ▼
                  ┌──────────────────────────────────────────────────────────┐
                  │            FRONTEND: Next.js 14 (App Router)             │
                  │  - React 18 + TailwindCSS + Recharts                     │
                  │  - Impresión Térmica Aislada (Iframe 10x15cm) & ZPL      │
                  │  - Client State: ThemeContext, AuthContext, SocketCtx    │
                  └─────────────┬────────────────────────────────────────────┘
                                │ Proxy / API Client (Port 3001)
                                ▼
                  ┌──────────────────────────────────────────────────────────┐
                  │               BACKEND: NestJS Enterprise                 │
                  │  - Auth Guard (JWT) + RBAC Permissions Guard             │
                  │  - Modulos: Produccion, Kardex, Inventario, Clientes...  │
                  │  - WebSockets Gateway (Eventos de Planta en Vivo)        │
                  │  - Service Token Guard (Worker Biométrico)               │
                  └─────────────┬──────────────────────────────▲─────────────┘
                                │ Prisma ORM                   │ Ingesta de Marcaciones
                                ▼                              │
                  ┌───────────────────────────┐  ┌─────────────┴─────────────┐
                  │   BASE DE DATOS RELACIONAL│  │  WORKER BIOMÉTRICO PYTHON │
                  │      PostgreSQL 16        │  │  - pyzk (ZKTeco Protocol) │
                  │  - Esquema Relacional     │  │  - Multi-Sucursal Daemon  │
                  │  - Transacciones ACID     │  │  - Fallback Offline Buffer│
                  └───────────────────────────┘  └───────────────────────────┘
```

---

## 3. Stack Tecnológico y Dependencias

### Frontend (`/frontend`)
* **Framework:** Next.js 14.2.35 (App Router, Server Components y Client Components).
* **Librería UI:** React 18, TailwindCSS, Lucide React (iconografía industrial).
* **Gráficos & Visualización:** Recharts (Radar, Area, Bar, Pie Charts).
* **Trazabilidad QR:** `qrcode` (generación de DataURLs dinámicos).
* **Exportación & PDFs:** `jspdf`, `jspdf-autotable`, `xlsx`.
* **Comunicación en Tiempo Real:** `socket.io-client`.

### Backend (`/backend`)
* **Framework:** NestJS 10.x (TypeScript modular con inyección de dependencias).
* **ORM:** Prisma Client (`@prisma/client` con generación tipada).
* **Base de Datos:** PostgreSQL 16 (con soporte de tipos `Decimal(14,4)`).
* **Seguridad & Criptografía:** `@nestjs/jwt`, `@nestjs/passport`, `bcryptjs`.
* **WebSockets:** `@nestjs/websockets`, `@nestjs/platform-socket.io`.
* **Procesamiento de Archivos:** `xlsx`, `multer`.

### Worker Satélite (`/worker`)
* **Lenguaje:** Python 3.11.
* **Librerías:** `pyzk` (protocolo nativo ZKTeco Standalone SDK), `requests`.

---

## 4. Modelo de Base de Datos y Diccionario Relacional (Prisma)

El esquema de base de datos (`prisma/schema.prisma`) cuenta con más de 30 modelos interrelacionados:

### Entidades Maestras y Producción
| Modelo | Tabla | Descripción |
| :--- | :--- | :--- |
| `User` | `users` | Usuarios del sistema con correo, hash y asignación de `Role`. |
| `Rol` / `Permiso` | `roles` / `permisos` | Matriz de control de acceso basada en roles (RBAC) con acciones `CREATE`, `READ`, `UPDATE`, `DELETE`. |
| `FamiliaInsumo` | `familias_insumo` | 4 Familias maestras: *Materia Prima Base*, *Fragancias y Aceites*, *Pigmentos y Colorantes*, *Aditivos y Auxiliares*. |
| `Insumo` | `insumos` | Materia prima con código SKU, unidad (`KG`, `L`, `GR`, `UN`), stock teórico, stock real y costo unitario. |
| `FormulaMaster` | `formulas_master` | Fórmulas maestras versionadas con densidad teórica, pasos de elaboración y estado (`ACTIVA`, `INACTIVA`, `EN_REVISION`). |
| `FormulaDetalle` | `formula_detalles` | Porcentajes exactos de insumos (% Dosis) por cada fórmula. |
| `OrdenProduccion` | `ordenes_produccion` | Órdenes de producción con número de batch, estado de flujo y operarios asignados. |
| `LoteProduccion` | `lotes_produccion` | Registro de lotes fabricados con trazabilidad de fechas, pH medido, viscosidad, densidad y dictamen QA. |
| `AjusteFino` | `ajustes_finos` | Dosificaciones correctivas realizadas en reactor para compensar mermas o especificaciones físico-químicas. |
| `SubAlmacenSobrante` | `sub_almacenes_sobrantes` | Gestión de sobrantes químicos para reaprovechamiento en batches posteriores sin generar desecho. |
| `ColaImpresionEtiqueta` | `cola_impresion_etiquetas` | Lotes finalizados en QA listos para emisión de etiqueta metrológica y despacho. |

### Entidades Comerciales y Financieras
| Modelo | Tabla | Descripción |
| :--- | :--- | :--- |
| `Cliente` | `clientes` | Directorio de clientes con RUC, Razón Social, límite de crédito, condición comercial y clasificación de riesgo. |
| `PedidoComercial` | `pedidos_comerciales` | Pedidos emitidos por Administración con detalle de productos, litros/kilos y vinculación a lote de planta. |
| `CuentaPorCobrar` | `cuentas_por_cobrar` | Cuentas por cobrar originadas de facturas comerciales, con control de saldo pendiente, fecha de vencimiento y estado (`PENDIENTE`, `PAGADO`, `VENCIDO`). |
| `Abono` | `abonos` | Pagos parciales o totales registrados contra una cuenta por cobrar, con número de operación bancaria y medio de pago. |
| `Factura` | `facturas` | Registro tributario/comercial con subtotal, monto de IGV (18%) y total general. |
| `CotizacionProveedor` | `cotizaciones_proveedores` | Matriz de comparación de precios de insumos entre proveedores para optimización de compras. |

### Entidades de Biometría y Auditoría
| Modelo | Tabla | Descripción |
| :--- | :--- | :--- |
| `Empleado` | `empleados` | Personal de planta y oficina con DNI, huella/tarjeta ID y horario de turno asignado. |
| `MarcacionBiometrica` | `marcaciones_biometricas` | Registro inmutable de eventos de asistencia (`ENTRADA`, `SALIDA_ALMUERZO`, `RETORNO_ALMUERZO`, `SALIDA`). |
| `DispositivoBiometrico` | `dispositivos_biometricos` | Terminales biométricos registrados por sucursal / IP. |
| `SolicitudAutorizacion` | `solicitudes_autorizacion` | Auditoría y control para cambios sensibles (edición de fórmulas maestras, modificación de clientes o eliminación). |

---

## 5. Módulos del Sistema: Backend y Frontend

### 5.1 Módulo de Producción & Planta
* **Rutas Frontend:** `/produccion/pedidos`, `/produccion/inventario`, `/produccion/formulas`, `/produccion/qa`, `/produccion/kardex`, `/produccion/etiquetas`, `/produccion/biometria`.
* **Servicios Backend:** `ProduccionService`, `InventarioService`, `KardexService`.
* **Funcionalidad Principal:**
  - Recepción de pedidos comerciales autorizados por Administración.
  - Creación de lotes de fabricación vinculados al pedido o para stock de planta.
  - Asignación obligatoria de operarios de planta previa al inicio de fabricación.
  - Deducción automática de insumos en Kardex mediante balance de masas estequiométrico.

### 5.2 Módulo de Fórmulas & Dosificación Metrológica
* **Calculadora de Balanza Decimal:**
  - Admite tamaños de lote decimales ($0.250\text{ kg}$, $0.500\text{ kg}$, $1\text{ kg}$, $20\text{ kg}$, $500\text{ kg}$, etc.).
  - Visualización dual en **Kilogramos** (con hasta 4 decimales) y **Gramos** ($g$).
  - Modales de Ficha Técnica estandarizados (`ModalFichaTecnicaInsumos`) para consulta rápida de operarios sin saturar las vistas.

### 5.3 Módulo de Control de Calidad (QA) & Liberación
* **Ciclo de 4 Pasos del Reactor:**
  1. `PASO 1: PENDIENTE OPERARIOS` (Bloqueo inteligente si no hay personal asignado).
  2. `PASO 2: ELABORANDO MEZCLA` (Agitación y dispersión en reactores).
  3. `PASO 3: EN MUESTREO QA` (Extracción de alícuotas para laboratorio).
  4. `PASO 4: FINALIZADO & LIBERADO` (Aprobación fisicoquímica y pase a etiquetado).
* **Parámetros Fisicoquímicos Auditados:** pH, Viscosidad (cP), Densidad ($g/ml$), Aspecto, Color y Olor.
* **Gestión de Rechazos:** Modal de Parada Técnica con justificación obligatoria que marca el lote como `RECHAZADO` y bloquea su despacho.

### 5.4 Módulo de Etiquetado Térmico & Trazabilidad QR
* **Aislamiento de Impresión Térmica:**
  - Generador de impresión web mediante `iframe` aislado con CSS `@media print` de dimensiones exactas de $10\times15\text{ cm}$ (4x6 pulgadas).
  - Generador de código nativo **ZPL II (Zebra Programming Language)** para impresoras industriales (Zebra ZT411 / ZD421).
* **Código QR Dinámico de Trazabilidad:**
  - Cada lote y producto genera un QR único y escaneable que contiene los metadatos técnicos: RUC, Cliente, Lote, Producto, Cantidad, Control Metrológico de Balanza (Tara, Peso Neto y Peso Bruto) y Validación de QA.
  - Eliminación de códigos de barra lineales obsoletos, optimizando el área física de la etiqueta.

### 5.5 Módulo de Kardex Multi-Almacén e Inventarios
* **Control de Existencias:**
  - Clasificación en 4 categorías: Materia Prima, Fragancias, Pigmentos y Envases.
  - Kardex inmutable que registra cada entrada por compra, consumo por lote de producción, merma de reactor o ajuste fino.
  - Alertas automáticas de stock crítico y reposición hacia Compras.

### 5.6 Módulo de Clientes & Expediente Comercial 360°
* **Rutas Frontend:** `/administracion/clientes`, `/administracion/clientes/[id]`.
* **Vista 360° del Cliente:**
  - Historial de pedidos e invoices emitidas.
  - Saldo pendiente por cobrar vs límite de crédito asignado.
  - Calificación de riesgo crediticio (*Excelente*, *Regular*, *Crítico*).
  - Estado de cuenta exportable a PDF / Excel.

### 5.7 Módulo de Pedidos, Facturación & Cobranzas
* **Rutas Frontend:** `/administracion/pedidos`, `/administracion/cobranzas`, `/administracion/cotizador`.
* **Lógica Financiera:**
  - Switch global de visualización: **Neto** vs **Con IGV (18%)**.
  - Switch de moneda: **PEN (S/)** vs **USD ($)** con tipo de cambio dinámico.
  - Conciliación de abonos parciales y liquidación automática de facturas.

### 5.8 Módulo de Asistencia Biométrica Multi-Sucursal
* **Rutas Frontend:** `/administracion/asistencia`, `/produccion/biometria`.
* **Control de Asistencia:**
  - Sincronización automática de marcaciones desde dispositivos biométricos ZKTeco.
  - Cálculo de puntualidad, tardanzas justificadas y horas trabajadas por turno.

### 5.9 Dashboard Administrativo & Panel Gerencial
* **Rutas Frontend:** `/administracion/dashboard`, `/gerencia/dashboard`.
* **Estructura Visual Cuadrada y Simétrica:**
  - **Fila Superior:** KPIs de ventas netas, cobranzas del mes, volumen de producción y margen operativo.
  - **Fila Analítica:** Gráficos de tendencias de ventas y plazos de facturas (Recharts).
  - **Fila Media Ecualizada:** Top 10 Clientes Frecuentes, 4 Tarjetas de Métricas Rápidas con navegación directa y Gráfico Radar de Métodos de Pago con desglose bancario al pie (sin espacios vacíos).
  - **Fila Inferior:** Tablas de documentos comerciales recientes y órdenes de producción.

---

## 6. Seguridad, Autenticación y Control de Acceso (RBAC)

### 13 Roles Enterprise Definidos:
1. `GERENCIA`: Acceso total directivo y aprobación de solicitudes sensibles.
2. `ADMINISTRACION` / `GERENTE_ADMINISTRATIVO`: Gestión integral administrativa, comercial y financiera.
3. `ASISTENTE_ADMINISTRATIVO`: Emisión de pedidos, cotizaciones y seguimiento de cobranzas.
4. `FINANZAS`: Conciliación bancaria, liquidación de facturas y reportes contables.
5. `VENTAS_ATENCION_DIGITAL`: Atención a clientes y registro de pedidos.
6. `ECOMMERCE_MARKETING`: Análisis de catálogo y campañas comerciales.
7. `PRODUCCION_ALMACEN`: Operativa de fábrica, kardex de insumos, reactores y etiquetado.
8. `COMPRAS_PROVEEDORES`: Gestión de órdenes de compra y comparador de precios de insumos.
9. `RECURSOS_HUMANOS`: Gestión de personal, turnos y asistencia biométrica.
10. `SISTEMAS_TI`: Seguridad, RBAC, auditoría de sesiones y configuración de servidores.
11. `DISENO_MULTIMEDIA`: Fichas técnicas, diseño de empaques y etiquetas.
12. `ARCHIVO_HISTORICO`: Consulta de trazabilidad histórica de lotes antiguos.

### Campana de Autorizaciones Gerenciales (`SolicitudAutorizacion`):
* Cualquier intento de modificar o clonar una fórmula maestra activa, o de alterar datos sensibles de un cliente, genera un ticket de autorización en tiempo real.
* La Gerencia recibe la notificación en la campana interactiva y puede `APROBAR` o `RECHAZAR` con justificación registrada en auditoría ACID.

---

## 7. Worker de Biometría & Servicios Satélite

Ubicado en `/worker/asistencia_worker.py`:
* Se conecta mediante el protocolo nativo ZKTeco a los relojes biométricos de cada sucursal (ej. Planta Principal, Almacén Callao, Oficinas Administrativas).
* Extrae las nuevas marcaciones y las envía al endpoint de ingesta del backend NestJS (`POST /asistencia/ingesta`) validado mediante un **Service Token** seguro.
* Cuenta con buffer local en caso de caída temporal del enlace de internet, reintentando el envío automáticamente.

---

## 8. Guía de Despliegue, Dockerización y Mantenimiento

### 8.1 Requisitos Previos
* Docker Engine 24+ y Docker Compose v2.
* Node.js 18+ (para desarrollo local).
* PostgreSQL 16.

### 8.2 Variables de Entorno Clave
#### Backend (`backend/.env`):
```env
DATABASE_URL="postgresql://quimicorp:quimicorp_dev_password@postgres:5432/quimicorp_erp?schema=public"
DIRECT_URL="postgresql://quimicorp:quimicorp_dev_password@postgres:5432/quimicorp_erp?schema=public"
JWT_SECRET="quimicorp_super_secret_jwt_key_2026"
PORT=3001
FRONTEND_URL="http://localhost:3000"
SERVICE_TOKEN_BIOMETRICO="quimicorp_biometric_worker_token_2026"
```

#### Frontend (`frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL="http://localhost:3001"
NEXT_PUBLIC_SOCKET_URL="http://localhost:3001"
```

### 8.3 Despliegue con Docker Compose
Para iniciar todos los servicios del ERP en producción/staging:
```bash
# 1. Construir e iniciar contenedores en segundo plano
docker compose up -d --build

# 2. Ejecutar migraciones de base de datos dentro del contenedor
docker compose exec backend npx prisma migrate deploy

# 3. Verificar estado de los servicios
docker compose ps
```

### 8.4 Puertos Expuestos
* **Frontend Web:** `http://localhost:3000`
* **Backend API REST & WS:** `http://localhost:3001`
* **PostgreSQL:** `localhost:5432`

---

## 9. Políticas de Desarrollo y Cero Mocks

1. **Persistencia Real:** Todo dato que se visualice o edite en el frontend proviene y se guarda exclusivamente en PostgreSQL a través de NestJS y Prisma.
2. **Tipado Estricto:** Prohibido el uso del tipo `any` en TypeScript. Todas las interfaces deben coincidir entre los DTOs del backend y los tipos del cliente.
3. **Control de Versiones (Git):** Ninguna operación de `git commit` o `git push` se ejecuta de forma automática sin la instrucción directa y explícita del usuario.
4. **Verificación de Compilación:** Todo cambio debe validar que la suite completa (`npm run build` en frontend y backend) compile con **0 errores**.

---
*Fin del Manual de Documentación Integral — QUIMICORP PERÚ S.A.C.*
