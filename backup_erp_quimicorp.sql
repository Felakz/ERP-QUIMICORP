--
-- PostgreSQL database dump
--

\restrict MYbdSMBPaomtg9OM3ZBdzT0Pni3ynxtL2ahcXZv1jGiQl1JrnAdm7KQ3Aqb3upy

-- Dumped from database version 16.15
-- Dumped by pg_dump version 16.15

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.ventanas_almuerzo_qa DROP CONSTRAINT IF EXISTS "ventanas_almuerzo_qa_aprobadoPorQAId_fkey";
ALTER TABLE IF EXISTS ONLY public.usuarios DROP CONSTRAINT IF EXISTS usuarios_turno_id_fkey;
ALTER TABLE IF EXISTS ONLY public.usuarios DROP CONSTRAINT IF EXISTS usuarios_sucursal_id_fkey;
ALTER TABLE IF EXISTS ONLY public.usuarios DROP CONSTRAINT IF EXISTS "usuarios_rolId_fkey";
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS "users_rolId_fkey";
ALTER TABLE IF EXISTS ONLY public.tickets_despacho DROP CONSTRAINT IF EXISTS "tickets_despacho_ordenProduccionId_fkey";
ALTER TABLE IF EXISTS ONLY public.sub_almacen_sobrantes DROP CONSTRAINT IF EXISTS "sub_almacen_sobrantes_loteOrigenId_fkey";
ALTER TABLE IF EXISTS ONLY public.sub_almacen_sobrantes DROP CONSTRAINT IF EXISTS "sub_almacen_sobrantes_insumoSubproductoId_fkey";
ALTER TABLE IF EXISTS ONLY public.rol_permisos DROP CONSTRAINT IF EXISTS "rol_permisos_rolId_fkey";
ALTER TABLE IF EXISTS ONLY public.rol_permisos DROP CONSTRAINT IF EXISTS "rol_permisos_permisoId_fkey";
ALTER TABLE IF EXISTS ONLY public.pedidos_comerciales DROP CONSTRAINT IF EXISTS pedidos_comerciales_variante_id_fkey;
ALTER TABLE IF EXISTS ONLY public.pedidos_comerciales DROP CONSTRAINT IF EXISTS pedidos_comerciales_formula_id_fkey;
ALTER TABLE IF EXISTS ONLY public.pedidos_comerciales DROP CONSTRAINT IF EXISTS pedidos_comerciales_cliente_id_fkey;
ALTER TABLE IF EXISTS ONLY public.pedido_aditivos DROP CONSTRAINT IF EXISTS pedido_aditivos_pedido_id_fkey;
ALTER TABLE IF EXISTS ONLY public.pedido_aditivos DROP CONSTRAINT IF EXISTS pedido_aditivos_insumo_id_fkey;
ALTER TABLE IF EXISTS ONLY public.pagos_abonos DROP CONSTRAINT IF EXISTS pagos_abonos_cuenta_cobrar_id_fkey;
ALTER TABLE IF EXISTS ONLY public.ordenes_produccion DROP CONSTRAINT IF EXISTS "ordenes_produccion_supervisorId_fkey";
ALTER TABLE IF EXISTS ONLY public.ordenes_produccion DROP CONSTRAINT IF EXISTS "ordenes_produccion_formulaId_fkey";
ALTER TABLE IF EXISTS ONLY public.marcaciones_biometrico DROP CONSTRAINT IF EXISTS "marcaciones_biometrico_usuarioId_fkey";
ALTER TABLE IF EXISTS ONLY public.kardex_movimientos DROP CONSTRAINT IF EXISTS kardex_movimientos_usuario_id_fkey;
ALTER TABLE IF EXISTS ONLY public.kardex_movimientos DROP CONSTRAINT IF EXISTS kardex_movimientos_insumo_id_fkey;
ALTER TABLE IF EXISTS ONLY public.kardex_inmutable DROP CONSTRAINT IF EXISTS "kardex_inmutable_usuarioId_fkey";
ALTER TABLE IF EXISTS ONLY public.kardex_inmutable DROP CONSTRAINT IF EXISTS "kardex_inmutable_insumoId_fkey";
ALTER TABLE IF EXISTS ONLY public.insumos DROP CONSTRAINT IF EXISTS "insumos_familiaId_fkey";
ALTER TABLE IF EXISTS ONLY public.incidencias_lote DROP CONSTRAINT IF EXISTS "incidencias_lote_reportadoPorId_fkey";
ALTER TABLE IF EXISTS ONLY public.incidencias_lote DROP CONSTRAINT IF EXISTS "incidencias_lote_loteProduccionId_fkey";
ALTER TABLE IF EXISTS ONLY public.formula_variants DROP CONSTRAINT IF EXISTS formula_variants_formula_id_fkey;
ALTER TABLE IF EXISTS ONLY public.formula_variants DROP CONSTRAINT IF EXISTS formula_variants_cliente_id_fkey;
ALTER TABLE IF EXISTS ONLY public.formula_detalles DROP CONSTRAINT IF EXISTS "formula_detalles_insumoId_fkey";
ALTER TABLE IF EXISTS ONLY public.formula_detalles DROP CONSTRAINT IF EXISTS "formula_detalles_formulaId_fkey";
ALTER TABLE IF EXISTS ONLY public.etiquetas_impresas DROP CONSTRAINT IF EXISTS "etiquetas_impresas_loteProduccionId_fkey";
ALTER TABLE IF EXISTS ONLY public.etiquetas_impresas DROP CONSTRAINT IF EXISTS "etiquetas_impresas_impresoPorId_fkey";
ALTER TABLE IF EXISTS ONLY public.cuentas_cobrar DROP CONSTRAINT IF EXISTS cuentas_cobrar_cliente_id_fkey;
ALTER TABLE IF EXISTS ONLY public.cuentas_bancarias_proveedores DROP CONSTRAINT IF EXISTS cuentas_bancarias_proveedores_proveedor_id_fkey;
ALTER TABLE IF EXISTS ONLY public.cotizaciones_proveedores DROP CONSTRAINT IF EXISTS cotizaciones_proveedores_proveedor_id_fkey;
ALTER TABLE IF EXISTS ONLY public.cotizaciones_proveedores DROP CONSTRAINT IF EXISTS cotizaciones_proveedores_insumo_id_fkey;
ALTER TABLE IF EXISTS ONLY public.contacto_representantes DROP CONSTRAINT IF EXISTS contacto_representantes_cliente_id_fkey;
ALTER TABLE IF EXISTS ONLY public.calificaciones_operario DROP CONSTRAINT IF EXISTS "calificaciones_operario_usuarioId_fkey";
ALTER TABLE IF EXISTS ONLY public.calificaciones_operario DROP CONSTRAINT IF EXISTS "calificaciones_operario_ordenProduccionId_fkey";
ALTER TABLE IF EXISTS ONLY public.audit_logs DROP CONSTRAINT IF EXISTS "audit_logs_usuarioId_fkey";
ALTER TABLE IF EXISTS ONLY public.asistencias DROP CONSTRAINT IF EXISTS "asistencias_usuarioId_fkey";
ALTER TABLE IF EXISTS ONLY public.asistencias DROP CONSTRAINT IF EXISTS asistencias_turno_id_fkey;
ALTER TABLE IF EXISTS ONLY public.ajustes_finos DROP CONSTRAINT IF EXISTS "ajustes_finos_registradoPorId_fkey";
ALTER TABLE IF EXISTS ONLY public.ajustes_finos DROP CONSTRAINT IF EXISTS "ajustes_finos_ordenProduccionId_fkey";
ALTER TABLE IF EXISTS ONLY public.ajustes_finos DROP CONSTRAINT IF EXISTS "ajustes_finos_insumoId_fkey";
DROP INDEX IF EXISTS public."valorizacion_inventario_fechaCierre_key";
DROP INDEX IF EXISTS public.usuarios_turno_id_idx;
DROP INDEX IF EXISTS public.usuarios_sucursal_id_idx;
DROP INDEX IF EXISTS public."usuarios_rolId_idx";
DROP INDEX IF EXISTS public.usuarios_dni_key;
DROP INDEX IF EXISTS public."usuarios_codigoBiometrico_key";
DROP INDEX IF EXISTS public.users_email_key;
DROP INDEX IF EXISTS public.turnos_nombre_key;
DROP INDEX IF EXISTS public."tickets_despacho_codigoTicket_key";
DROP INDEX IF EXISTS public.sucursales_nombre_key;
DROP INDEX IF EXISTS public.sucursales_dispositivo_id_key;
DROP INDEX IF EXISTS public.sub_almacen_sobrantes_estado_idx;
DROP INDEX IF EXISTS public.roles_nombre_key;
DROP INDEX IF EXISTS public.proveedores_ruc_key;
DROP INDEX IF EXISTS public.permisos_modulo_accion_key;
DROP INDEX IF EXISTS public.pedidos_comerciales_estado_idx;
DROP INDEX IF EXISTS public.pedidos_comerciales_doc_type_idx;
DROP INDEX IF EXISTS public.pedidos_comerciales_codigo_orden_key;
DROP INDEX IF EXISTS public.pedidos_comerciales_cliente_ruc_idx;
DROP INDEX IF EXISTS public.pedido_aditivos_tipo_idx;
DROP INDEX IF EXISTS public.pedido_aditivos_pedido_id_idx;
DROP INDEX IF EXISTS public.pedido_aditivos_insumo_id_idx;
DROP INDEX IF EXISTS public.pagos_abonos_cuenta_cobrar_id_idx;
DROP INDEX IF EXISTS public."ordenes_produccion_formulaId_idx";
DROP INDEX IF EXISTS public.ordenes_produccion_estado_idx;
DROP INDEX IF EXISTS public."ordenes_produccion_codigoLote_key";
DROP INDEX IF EXISTS public.metricas_produccion_diaria_fecha_key;
DROP INDEX IF EXISTS public.marcaciones_pendientes_procesada_idx;
DROP INDEX IF EXISTS public.marcaciones_pendientes_dispositivo_id_timestamp_idx;
DROP INDEX IF EXISTS public."marcaciones_biometrico_usuarioId_timestamp_idx";
DROP INDEX IF EXISTS public.kardex_movimientos_producto_nombre_idx;
DROP INDEX IF EXISTS public.kardex_movimientos_fecha_idx;
DROP INDEX IF EXISTS public.kardex_movimientos_categoria_kardex_idx;
DROP INDEX IF EXISTS public."kardex_inmutable_tipoMovimiento_idx";
DROP INDEX IF EXISTS public."kardex_inmutable_insumoId_idx";
DROP INDEX IF EXISTS public."kardex_inmutable_createdAt_idx";
DROP INDEX IF EXISTS public.insumos_tipo_idx;
DROP INDEX IF EXISTS public."insumos_familiaId_idx";
DROP INDEX IF EXISTS public.insumos_estado_idx;
DROP INDEX IF EXISTS public.insumos_codigo_key;
DROP INDEX IF EXISTS public.formulas_master_estado_idx;
DROP INDEX IF EXISTS public."formulas_master_codigoFormula_key";
DROP INDEX IF EXISTS public.formula_variants_formula_id_idx;
DROP INDEX IF EXISTS public.formula_variants_cliente_id_idx;
DROP INDEX IF EXISTS public."formula_detalles_insumoId_idx";
DROP INDEX IF EXISTS public."formula_detalles_formulaId_idx";
DROP INDEX IF EXISTS public.familias_insumo_nombre_key;
DROP INDEX IF EXISTS public."etiquetas_impresas_loteProduccionId_idx";
DROP INDEX IF EXISTS public."etiquetas_impresas_codigoEtiqueta_key";
DROP INDEX IF EXISTS public.cuentas_cobrar_fecha_vencimiento_idx;
DROP INDEX IF EXISTS public.cuentas_cobrar_estado_idx;
DROP INDEX IF EXISTS public.cuentas_cobrar_codigo_doc_key;
DROP INDEX IF EXISTS public.cuentas_cobrar_cliente_ruc_idx;
DROP INDEX IF EXISTS public.cuentas_bancarias_proveedores_proveedor_id_idx;
DROP INDEX IF EXISTS public.cotizaciones_proveedores_proveedor_id_idx;
DROP INDEX IF EXISTS public.cotizaciones_proveedores_insumo_id_idx;
DROP INDEX IF EXISTS public.cotizaciones_proveedores_fecha_cotizacion_idx;
DROP INDEX IF EXISTS public.contacto_representantes_cliente_id_idx;
DROP INDEX IF EXISTS public.cola_despacho_lote_codigo_idx;
DROP INDEX IF EXISTS public.cola_despacho_estado_idx;
DROP INDEX IF EXISTS public.clientes_ruc_key;
DROP INDEX IF EXISTS public.clientes_ruc_idx;
DROP INDEX IF EXISTS public."audit_logs_usuarioId_idx";
DROP INDEX IF EXISTS public."audit_logs_tablaAfectada_registroId_idx";
DROP INDEX IF EXISTS public."asistencias_usuarioId_fecha_key";
DROP INDEX IF EXISTS public.asistencias_turno_id_idx;
DROP INDEX IF EXISTS public.asistencias_fecha_idx;
DROP INDEX IF EXISTS public."ajustes_finos_ordenProduccionId_idx";
ALTER TABLE IF EXISTS ONLY public.ventanas_almuerzo_qa DROP CONSTRAINT IF EXISTS ventanas_almuerzo_qa_pkey;
ALTER TABLE IF EXISTS ONLY public.valorizacion_inventario DROP CONSTRAINT IF EXISTS valorizacion_inventario_pkey;
ALTER TABLE IF EXISTS ONLY public.usuarios DROP CONSTRAINT IF EXISTS usuarios_pkey;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_pkey;
ALTER TABLE IF EXISTS ONLY public.turnos DROP CONSTRAINT IF EXISTS turnos_pkey;
ALTER TABLE IF EXISTS ONLY public.tickets_despacho DROP CONSTRAINT IF EXISTS tickets_despacho_pkey;
ALTER TABLE IF EXISTS ONLY public.sucursales DROP CONSTRAINT IF EXISTS sucursales_pkey;
ALTER TABLE IF EXISTS ONLY public.sub_almacen_sobrantes DROP CONSTRAINT IF EXISTS sub_almacen_sobrantes_pkey;
ALTER TABLE IF EXISTS ONLY public.solicitudes_autorizacion DROP CONSTRAINT IF EXISTS solicitudes_autorizacion_pkey;
ALTER TABLE IF EXISTS ONLY public.roles DROP CONSTRAINT IF EXISTS roles_pkey;
ALTER TABLE IF EXISTS ONLY public.rol_permisos DROP CONSTRAINT IF EXISTS rol_permisos_pkey;
ALTER TABLE IF EXISTS ONLY public.proveedores DROP CONSTRAINT IF EXISTS proveedores_pkey;
ALTER TABLE IF EXISTS ONLY public.permisos DROP CONSTRAINT IF EXISTS permisos_pkey;
ALTER TABLE IF EXISTS ONLY public.pedidos_comerciales DROP CONSTRAINT IF EXISTS pedidos_comerciales_pkey;
ALTER TABLE IF EXISTS ONLY public.pedido_aditivos DROP CONSTRAINT IF EXISTS pedido_aditivos_pkey;
ALTER TABLE IF EXISTS ONLY public.pagos_abonos DROP CONSTRAINT IF EXISTS pagos_abonos_pkey;
ALTER TABLE IF EXISTS ONLY public.ordenes_produccion DROP CONSTRAINT IF EXISTS ordenes_produccion_pkey;
ALTER TABLE IF EXISTS ONLY public.metricas_produccion_diaria DROP CONSTRAINT IF EXISTS metricas_produccion_diaria_pkey;
ALTER TABLE IF EXISTS ONLY public.marcaciones_pendientes DROP CONSTRAINT IF EXISTS marcaciones_pendientes_pkey;
ALTER TABLE IF EXISTS ONLY public.marcaciones_biometrico DROP CONSTRAINT IF EXISTS marcaciones_biometrico_pkey;
ALTER TABLE IF EXISTS ONLY public.kardex_movimientos DROP CONSTRAINT IF EXISTS kardex_movimientos_pkey;
ALTER TABLE IF EXISTS ONLY public.kardex_inmutable DROP CONSTRAINT IF EXISTS kardex_inmutable_pkey;
ALTER TABLE IF EXISTS ONLY public.insumos DROP CONSTRAINT IF EXISTS insumos_pkey;
ALTER TABLE IF EXISTS ONLY public.incidencias_lote DROP CONSTRAINT IF EXISTS incidencias_lote_pkey;
ALTER TABLE IF EXISTS ONLY public.formulas_master DROP CONSTRAINT IF EXISTS formulas_master_pkey;
ALTER TABLE IF EXISTS ONLY public.formula_variants DROP CONSTRAINT IF EXISTS formula_variants_pkey;
ALTER TABLE IF EXISTS ONLY public.formula_detalles DROP CONSTRAINT IF EXISTS formula_detalles_pkey;
ALTER TABLE IF EXISTS ONLY public.familias_insumo DROP CONSTRAINT IF EXISTS familias_insumo_pkey;
ALTER TABLE IF EXISTS ONLY public.etiquetas_impresas DROP CONSTRAINT IF EXISTS etiquetas_impresas_pkey;
ALTER TABLE IF EXISTS ONLY public.cuentas_cobrar DROP CONSTRAINT IF EXISTS cuentas_cobrar_pkey;
ALTER TABLE IF EXISTS ONLY public.cuentas_bancarias_proveedores DROP CONSTRAINT IF EXISTS cuentas_bancarias_proveedores_pkey;
ALTER TABLE IF EXISTS ONLY public.cotizaciones_proveedores DROP CONSTRAINT IF EXISTS cotizaciones_proveedores_pkey;
ALTER TABLE IF EXISTS ONLY public.contacto_representantes DROP CONSTRAINT IF EXISTS contacto_representantes_pkey;
ALTER TABLE IF EXISTS ONLY public.cola_despacho DROP CONSTRAINT IF EXISTS cola_despacho_pkey;
ALTER TABLE IF EXISTS ONLY public.clientes DROP CONSTRAINT IF EXISTS clientes_pkey;
ALTER TABLE IF EXISTS ONLY public.calificaciones_operario DROP CONSTRAINT IF EXISTS calificaciones_operario_pkey;
ALTER TABLE IF EXISTS ONLY public.audit_logs DROP CONSTRAINT IF EXISTS audit_logs_pkey;
ALTER TABLE IF EXISTS ONLY public.asistencias DROP CONSTRAINT IF EXISTS asistencias_pkey;
ALTER TABLE IF EXISTS ONLY public.ajustes_finos DROP CONSTRAINT IF EXISTS ajustes_finos_pkey;
ALTER TABLE IF EXISTS ONLY public._prisma_migrations DROP CONSTRAINT IF EXISTS _prisma_migrations_pkey;
DROP TABLE IF EXISTS public.ventanas_almuerzo_qa;
DROP TABLE IF EXISTS public.valorizacion_inventario;
DROP TABLE IF EXISTS public.usuarios;
DROP TABLE IF EXISTS public.users;
DROP TABLE IF EXISTS public.turnos;
DROP TABLE IF EXISTS public.tickets_despacho;
DROP TABLE IF EXISTS public.sucursales;
DROP TABLE IF EXISTS public.sub_almacen_sobrantes;
DROP TABLE IF EXISTS public.solicitudes_autorizacion;
DROP TABLE IF EXISTS public.roles;
DROP TABLE IF EXISTS public.rol_permisos;
DROP TABLE IF EXISTS public.proveedores;
DROP TABLE IF EXISTS public.permisos;
DROP TABLE IF EXISTS public.pedidos_comerciales;
DROP TABLE IF EXISTS public.pedido_aditivos;
DROP TABLE IF EXISTS public.pagos_abonos;
DROP TABLE IF EXISTS public.ordenes_produccion;
DROP TABLE IF EXISTS public.metricas_produccion_diaria;
DROP TABLE IF EXISTS public.marcaciones_pendientes;
DROP TABLE IF EXISTS public.marcaciones_biometrico;
DROP TABLE IF EXISTS public.kardex_movimientos;
DROP TABLE IF EXISTS public.kardex_inmutable;
DROP TABLE IF EXISTS public.insumos;
DROP TABLE IF EXISTS public.incidencias_lote;
DROP TABLE IF EXISTS public.formulas_master;
DROP TABLE IF EXISTS public.formula_variants;
DROP TABLE IF EXISTS public.formula_detalles;
DROP TABLE IF EXISTS public.familias_insumo;
DROP TABLE IF EXISTS public.etiquetas_impresas;
DROP TABLE IF EXISTS public.cuentas_cobrar;
DROP TABLE IF EXISTS public.cuentas_bancarias_proveedores;
DROP TABLE IF EXISTS public.cotizaciones_proveedores;
DROP TABLE IF EXISTS public.contacto_representantes;
DROP TABLE IF EXISTS public.cola_despacho;
DROP TABLE IF EXISTS public.clientes;
DROP TABLE IF EXISTS public.calificaciones_operario;
DROP TABLE IF EXISTS public.audit_logs;
DROP TABLE IF EXISTS public.asistencias;
DROP TABLE IF EXISTS public.ajustes_finos;
DROP TABLE IF EXISTS public._prisma_migrations;
DROP TYPE IF EXISTS public."UnidadMedida";
DROP TYPE IF EXISTS public."TipoMovimientoKardex";
DROP TYPE IF EXISTS public."TipoMovimiento";
DROP TYPE IF EXISTS public."TipoMarcacion";
DROP TYPE IF EXISTS public."TipoInsumo";
DROP TYPE IF EXISTS public."TipoEtiqueta";
DROP TYPE IF EXISTS public."Role";
DROP TYPE IF EXISTS public."PrioridadPedidoComercial";
DROP TYPE IF EXISTS public."EstadoSubAlmacen";
DROP TYPE IF EXISTS public."EstadoPedidoComercial";
DROP TYPE IF EXISTS public."EstadoOrdenProduccion";
DROP TYPE IF EXISTS public."EstadoGenerico";
DROP TYPE IF EXISTS public."EstadoFormula";
DROP TYPE IF EXISTS public."EstadoDespacho";
DROP TYPE IF EXISTS public."EstadoAsistencia";
DROP TYPE IF EXISTS public."CategoriaKardex";
DROP TYPE IF EXISTS public."AccionPermiso";
--
-- Name: AccionPermiso; Type: TYPE; Schema: public; Owner: quimicorp
--

CREATE TYPE public."AccionPermiso" AS ENUM (
    'CREATE',
    'READ',
    'UPDATE',
    'DELETE'
);


ALTER TYPE public."AccionPermiso" OWNER TO quimicorp;

--
-- Name: CategoriaKardex; Type: TYPE; Schema: public; Owner: quimicorp
--

CREATE TYPE public."CategoriaKardex" AS ENUM (
    'PRODUCTO_TERMINADO',
    'MATERIA_PRIMA',
    'INSUMO',
    'ENVASE',
    'EMBALAJE'
);


ALTER TYPE public."CategoriaKardex" OWNER TO quimicorp;

--
-- Name: EstadoAsistencia; Type: TYPE; Schema: public; Owner: quimicorp
--

CREATE TYPE public."EstadoAsistencia" AS ENUM (
    'PUNTUAL',
    'TARDANZA',
    'FALTA',
    'JUSTIFICADO'
);


ALTER TYPE public."EstadoAsistencia" OWNER TO quimicorp;

--
-- Name: EstadoDespacho; Type: TYPE; Schema: public; Owner: quimicorp
--

CREATE TYPE public."EstadoDespacho" AS ENUM (
    'PENDIENTE',
    'EN_RUTA',
    'ENTREGADO',
    'DEVUELTO'
);


ALTER TYPE public."EstadoDespacho" OWNER TO quimicorp;

--
-- Name: EstadoFormula; Type: TYPE; Schema: public; Owner: quimicorp
--

CREATE TYPE public."EstadoFormula" AS ENUM (
    'ACTIVA',
    'INACTIVA',
    'EN_REVISION'
);


ALTER TYPE public."EstadoFormula" OWNER TO quimicorp;

--
-- Name: EstadoGenerico; Type: TYPE; Schema: public; Owner: quimicorp
--

CREATE TYPE public."EstadoGenerico" AS ENUM (
    'ACTIVO',
    'INACTIVO'
);


ALTER TYPE public."EstadoGenerico" OWNER TO quimicorp;

--
-- Name: EstadoOrdenProduccion; Type: TYPE; Schema: public; Owner: quimicorp
--

CREATE TYPE public."EstadoOrdenProduccion" AS ENUM (
    'PENDIENTE',
    'EN_PROCESO',
    'QA_PENDIENTE',
    'APROBADO',
    'EN_ETIQUETADO',
    'ETIQUETADO',
    'RECHAZADO',
    'DESPACHADO'
);


ALTER TYPE public."EstadoOrdenProduccion" OWNER TO quimicorp;

--
-- Name: EstadoPedidoComercial; Type: TYPE; Schema: public; Owner: quimicorp
--

CREATE TYPE public."EstadoPedidoComercial" AS ENUM (
    'NUEVO',
    'PENDIENTE_REVISION',
    'VALIDANDO',
    'APROBADO',
    'EN_PRODUCCION',
    'DEVUELTO',
    'RECHAZADO',
    'ENTREGADO'
);


ALTER TYPE public."EstadoPedidoComercial" OWNER TO quimicorp;

--
-- Name: EstadoSubAlmacen; Type: TYPE; Schema: public; Owner: quimicorp
--

CREATE TYPE public."EstadoSubAlmacen" AS ENUM (
    'DISPONIBLE',
    'REUSADO',
    'DESCARTADO'
);


ALTER TYPE public."EstadoSubAlmacen" OWNER TO quimicorp;

--
-- Name: PrioridadPedidoComercial; Type: TYPE; Schema: public; Owner: quimicorp
--

CREATE TYPE public."PrioridadPedidoComercial" AS ENUM (
    'URGENTE',
    'NORMAL',
    'PROGRAMADO'
);


ALTER TYPE public."PrioridadPedidoComercial" OWNER TO quimicorp;

--
-- Name: Role; Type: TYPE; Schema: public; Owner: quimicorp
--

CREATE TYPE public."Role" AS ENUM (
    'GERENCIA',
    'ADMINISTRACION',
    'GERENTE_ADMINISTRATIVO',
    'ASISTENTE_ADMINISTRATIVO',
    'FINANZAS',
    'VENTAS_ATENCION_DIGITAL',
    'ECOMMERCE_MARKETING',
    'PRODUCCION_ALMACEN',
    'COMPRAS_PROVEEDORES',
    'RECURSOS_HUMANOS',
    'SISTEMAS_TI',
    'DISENO_MULTIMEDIA',
    'ARCHIVO_HISTORICO'
);


ALTER TYPE public."Role" OWNER TO quimicorp;

--
-- Name: TipoEtiqueta; Type: TYPE; Schema: public; Owner: quimicorp
--

CREATE TYPE public."TipoEtiqueta" AS ENUM (
    'INSUMO',
    'GALON',
    'BARRIL',
    'FRASCO'
);


ALTER TYPE public."TipoEtiqueta" OWNER TO quimicorp;

--
-- Name: TipoInsumo; Type: TYPE; Schema: public; Owner: quimicorp
--

CREATE TYPE public."TipoInsumo" AS ENUM (
    'BASE',
    'FRAGANCIA',
    'PIGMENTO',
    'ENVASE',
    'OTRO'
);


ALTER TYPE public."TipoInsumo" OWNER TO quimicorp;

--
-- Name: TipoMarcacion; Type: TYPE; Schema: public; Owner: quimicorp
--

CREATE TYPE public."TipoMarcacion" AS ENUM (
    'ENTRADA',
    'SALIDA_ALMUERZO',
    'RETORNO_ALMUERZO',
    'SALIDA'
);


ALTER TYPE public."TipoMarcacion" OWNER TO quimicorp;

--
-- Name: TipoMovimiento; Type: TYPE; Schema: public; Owner: quimicorp
--

CREATE TYPE public."TipoMovimiento" AS ENUM (
    'ENTRADA_COMPRA',
    'ENTRADA_PRODUCCION',
    'ENTRADA_AJUSTE',
    'SALIDA_VENTA',
    'SALIDA_CONSUMO_PRODUCCION',
    'SALIDA_MERMA'
);


ALTER TYPE public."TipoMovimiento" OWNER TO quimicorp;

--
-- Name: TipoMovimientoKardex; Type: TYPE; Schema: public; Owner: quimicorp
--

CREATE TYPE public."TipoMovimientoKardex" AS ENUM (
    'ENTRADA',
    'SALIDA',
    'AJUSTE_FINO',
    'MERMA',
    'REAPROVECHAMIENTO'
);


ALTER TYPE public."TipoMovimientoKardex" OWNER TO quimicorp;

--
-- Name: UnidadMedida; Type: TYPE; Schema: public; Owner: quimicorp
--

CREATE TYPE public."UnidadMedida" AS ENUM (
    'KG',
    'L',
    'GR',
    'UN'
);


ALTER TYPE public."UnidadMedida" OWNER TO quimicorp;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: quimicorp
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO quimicorp;

--
-- Name: ajustes_finos; Type: TABLE; Schema: public; Owner: quimicorp
--

CREATE TABLE public.ajustes_finos (
    id text NOT NULL,
    "ordenProduccionId" text NOT NULL,
    "insumoId" text NOT NULL,
    "cantidadAgregada" numeric(14,4) NOT NULL,
    observacion text,
    "registradoPorId" text NOT NULL,
    "timestamp" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.ajustes_finos OWNER TO quimicorp;

--
-- Name: asistencias; Type: TABLE; Schema: public; Owner: quimicorp
--

CREATE TABLE public.asistencias (
    id text NOT NULL,
    "usuarioId" text NOT NULL,
    fecha date NOT NULL,
    "horasTrabajadas" numeric(5,2) NOT NULL,
    "minutosTardanza" integer DEFAULT 0 NOT NULL,
    "estadoAsistencia" public."EstadoAsistencia" DEFAULT 'PUNTUAL'::public."EstadoAsistencia" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    turno_id text,
    hora_entrada text,
    hora_salida text,
    estado_almuerzo text DEFAULT 'PENDIENTE'::text NOT NULL
);


ALTER TABLE public.asistencias OWNER TO quimicorp;

--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: quimicorp
--

CREATE TABLE public.audit_logs (
    id text NOT NULL,
    "usuarioId" text NOT NULL,
    accion text NOT NULL,
    "tablaAfectada" text NOT NULL,
    "registroId" text NOT NULL,
    "datosAnteriores" jsonb,
    "datosNuevos" jsonb,
    "ipOrigen" text,
    "timestamp" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.audit_logs OWNER TO quimicorp;

--
-- Name: calificaciones_operario; Type: TABLE; Schema: public; Owner: quimicorp
--

CREATE TABLE public.calificaciones_operario (
    id text NOT NULL,
    "usuarioId" text NOT NULL,
    "ordenProduccionId" text NOT NULL,
    "puntajeEficiencia" numeric(5,2) NOT NULL,
    comentarios text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.calificaciones_operario OWNER TO quimicorp;

--
-- Name: clientes; Type: TABLE; Schema: public; Owner: quimicorp
--

CREATE TABLE public.clientes (
    id text NOT NULL,
    "razonSocial" text NOT NULL,
    ruc text NOT NULL,
    telefono text,
    direccion text,
    contacto text,
    "metodoEnvio" text,
    "condicionPago" text DEFAULT 'Contado'::text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.clientes OWNER TO quimicorp;

--
-- Name: cola_despacho; Type: TABLE; Schema: public; Owner: quimicorp
--

CREATE TABLE public.cola_despacho (
    id text NOT NULL,
    lote_codigo text NOT NULL,
    producto_nombre text NOT NULL,
    cliente_nombre text NOT NULL,
    cantidad text NOT NULL,
    fecha_fabricacion timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    codigo_qr text NOT NULL,
    codigo_barras text NOT NULL,
    estado text DEFAULT 'LISTO_PARA_IMPRIMIR'::text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    numero_guia text
);


ALTER TABLE public.cola_despacho OWNER TO quimicorp;

--
-- Name: contacto_representantes; Type: TABLE; Schema: public; Owner: quimicorp
--

CREATE TABLE public.contacto_representantes (
    id text NOT NULL,
    cliente_id text NOT NULL,
    nombre text NOT NULL,
    cargo text,
    telefono text,
    email text,
    es_principal boolean DEFAULT false NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.contacto_representantes OWNER TO quimicorp;

--
-- Name: cotizaciones_proveedores; Type: TABLE; Schema: public; Owner: quimicorp
--

CREATE TABLE public.cotizaciones_proveedores (
    id text NOT NULL,
    proveedor_id text NOT NULL,
    insumo_id text NOT NULL,
    precio_unitario numeric(14,4) NOT NULL,
    moneda text DEFAULT 'SOLES'::text NOT NULL,
    unidad_medida text DEFAULT 'KG'::text NOT NULL,
    num_cotizacion text,
    fecha_cotizacion timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    variacion_porcentual numeric(8,2),
    observaciones text,
    estado text DEFAULT 'VIGENTE'::text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.cotizaciones_proveedores OWNER TO quimicorp;

--
-- Name: cuentas_bancarias_proveedores; Type: TABLE; Schema: public; Owner: quimicorp
--

CREATE TABLE public.cuentas_bancarias_proveedores (
    id text NOT NULL,
    proveedor_id text NOT NULL,
    banco text NOT NULL,
    moneda text DEFAULT 'SOLES'::text NOT NULL,
    numero_cuenta text NOT NULL,
    cci text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.cuentas_bancarias_proveedores OWNER TO quimicorp;

--
-- Name: cuentas_cobrar; Type: TABLE; Schema: public; Owner: quimicorp
--

CREATE TABLE public.cuentas_cobrar (
    id text NOT NULL,
    codigo_doc text NOT NULL,
    cliente_id text,
    cliente_nombre text NOT NULL,
    cliente_ruc text NOT NULL,
    pedido_id text,
    orden_prod text,
    producto text,
    monto_total numeric(14,2) NOT NULL,
    saldo_pendiente numeric(14,2) NOT NULL,
    condicion_pago text DEFAULT 'Contado'::text NOT NULL,
    dias_plazo integer DEFAULT 0 NOT NULL,
    fecha_emision timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    fecha_vencimiento timestamp(3) without time zone NOT NULL,
    fecha_pago timestamp(3) without time zone,
    estado text DEFAULT 'PENDIENTE'::text NOT NULL,
    medio_pago text,
    canal_banco text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.cuentas_cobrar OWNER TO quimicorp;

--
-- Name: etiquetas_impresas; Type: TABLE; Schema: public; Owner: quimicorp
--

CREATE TABLE public.etiquetas_impresas (
    id text NOT NULL,
    "codigoEtiqueta" text NOT NULL,
    "loteProduccionId" text NOT NULL,
    "tipoEtiqueta" public."TipoEtiqueta" NOT NULL,
    "impresoPorId" text NOT NULL,
    "timestamp" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.etiquetas_impresas OWNER TO quimicorp;

--
-- Name: familias_insumo; Type: TABLE; Schema: public; Owner: quimicorp
--

CREATE TABLE public.familias_insumo (
    id text NOT NULL,
    nombre text NOT NULL,
    descripcion text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.familias_insumo OWNER TO quimicorp;

--
-- Name: formula_detalles; Type: TABLE; Schema: public; Owner: quimicorp
--

CREATE TABLE public.formula_detalles (
    id text NOT NULL,
    "formulaId" text NOT NULL,
    "insumoId" text,
    "nombreComponente" text,
    "skuComponente" text,
    porcentaje numeric(6,3) NOT NULL,
    "pesoMasaTeorico" numeric(14,4) NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.formula_detalles OWNER TO quimicorp;

--
-- Name: formula_variants; Type: TABLE; Schema: public; Owner: quimicorp
--

CREATE TABLE public.formula_variants (
    id text NOT NULL,
    nombre text NOT NULL,
    formula_id text NOT NULL,
    cliente_id text,
    nombre_marca text,
    aroma text,
    color text,
    ph_objetivo double precision,
    viscosidad text,
    instrucciones text,
    notas text,
    ajustes_json jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    pasos_elaboracion jsonb
);


ALTER TABLE public.formula_variants OWNER TO quimicorp;

--
-- Name: formulas_master; Type: TABLE; Schema: public; Owner: quimicorp
--

CREATE TABLE public.formulas_master (
    id text NOT NULL,
    "codigoFormula" text NOT NULL,
    "nombreProducto" text NOT NULL,
    version integer DEFAULT 1 NOT NULL,
    "densidadTeorica" numeric(10,4) NOT NULL,
    estado public."EstadoFormula" DEFAULT 'EN_REVISION'::public."EstadoFormula" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    pasos_elaboracion jsonb
);


ALTER TABLE public.formulas_master OWNER TO quimicorp;

--
-- Name: incidencias_lote; Type: TABLE; Schema: public; Owner: quimicorp
--

CREATE TABLE public.incidencias_lote (
    id text NOT NULL,
    "loteProduccionId" text NOT NULL,
    "reportadoPorId" text NOT NULL,
    "tipoIncidencia" text NOT NULL,
    descripcion text NOT NULL,
    "impactoMerma" numeric(14,4),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.incidencias_lote OWNER TO quimicorp;

--
-- Name: insumos; Type: TABLE; Schema: public; Owner: quimicorp
--

CREATE TABLE public.insumos (
    id text NOT NULL,
    codigo text NOT NULL,
    nombre text NOT NULL,
    "familiaId" text NOT NULL,
    "unidadMedida" public."UnidadMedida" NOT NULL,
    "unidadMedidaVisual" text,
    categoria text,
    "proveedorHistorico" text,
    "stockTeorico" numeric(14,4) DEFAULT 0 NOT NULL,
    "stockReal" numeric(14,4) DEFAULT 0 NOT NULL,
    "stockMinimo" numeric(14,4) DEFAULT 0 NOT NULL,
    "costoUnitario" numeric(14,4) DEFAULT 0 NOT NULL,
    estado public."EstadoGenerico" DEFAULT 'ACTIVO'::public."EstadoGenerico" NOT NULL,
    tipo public."TipoInsumo" DEFAULT 'OTRO'::public."TipoInsumo",
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    estado_fisico text
);


ALTER TABLE public.insumos OWNER TO quimicorp;

--
-- Name: kardex_inmutable; Type: TABLE; Schema: public; Owner: quimicorp
--

CREATE TABLE public.kardex_inmutable (
    id text NOT NULL,
    "insumoId" text NOT NULL,
    "tipoMovimiento" public."TipoMovimientoKardex" NOT NULL,
    cantidad numeric(14,4) NOT NULL,
    "stockAnterior" numeric(14,4) NOT NULL,
    "stockNuevo" numeric(14,4) NOT NULL,
    "documentoReferencia" text,
    "usuarioId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.kardex_inmutable OWNER TO quimicorp;

--
-- Name: kardex_movimientos; Type: TABLE; Schema: public; Owner: quimicorp
--

CREATE TABLE public.kardex_movimientos (
    id text NOT NULL,
    categoria_kardex public."CategoriaKardex" NOT NULL,
    producto_nombre text NOT NULL,
    familia text,
    categoria_nombre text,
    proveedor_cliente text,
    unidad_medida text NOT NULL,
    fecha timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    tipo_doc text,
    serie text,
    numero text,
    otp text,
    tipo_operacion public."TipoMovimiento" NOT NULL,
    cantidad_entrada double precision DEFAULT 0 NOT NULL,
    cantidad_salida double precision DEFAULT 0 NOT NULL,
    saldo_final double precision NOT NULL,
    costo_unitario double precision DEFAULT 0,
    monto_entrada_pen double precision DEFAULT 0,
    monto_salida_pen double precision DEFAULT 0,
    monto_saldo_pen double precision DEFAULT 0,
    insumo_id text,
    usuario_id text,
    sede_id text DEFAULT 'SEDE-LIMA'::text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.kardex_movimientos OWNER TO quimicorp;

--
-- Name: marcaciones_biometrico; Type: TABLE; Schema: public; Owner: quimicorp
--

CREATE TABLE public.marcaciones_biometrico (
    id text NOT NULL,
    "usuarioId" text NOT NULL,
    "tipoMarcacion" public."TipoMarcacion" NOT NULL,
    "timestamp" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "dispositivoId" text NOT NULL
);


ALTER TABLE public.marcaciones_biometrico OWNER TO quimicorp;

--
-- Name: marcaciones_pendientes; Type: TABLE; Schema: public; Owner: quimicorp
--

CREATE TABLE public.marcaciones_pendientes (
    id text NOT NULL,
    dispositivo_id text NOT NULL,
    codigo_biometrico text NOT NULL,
    tipo_marcacion text NOT NULL,
    "timestamp" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    procesada boolean DEFAULT false NOT NULL,
    vinculado_a_id text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.marcaciones_pendientes OWNER TO quimicorp;

--
-- Name: metricas_produccion_diaria; Type: TABLE; Schema: public; Owner: quimicorp
--

CREATE TABLE public.metricas_produccion_diaria (
    id text NOT NULL,
    fecha date NOT NULL,
    "volumenTotalLitros" numeric(14,4) NOT NULL,
    "mermaTotalKg" numeric(14,4) NOT NULL,
    "eficienciaPromedio" numeric(5,2) NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.metricas_produccion_diaria OWNER TO quimicorp;

--
-- Name: ordenes_produccion; Type: TABLE; Schema: public; Owner: quimicorp
--

CREATE TABLE public.ordenes_produccion (
    id text NOT NULL,
    "codigoLote" text NOT NULL,
    "clienteNombre" text DEFAULT 'Cliente Quimicorp SAC'::text,
    "operariosAsignados" text,
    "colorEspecificado" text,
    "fraganciaEspecificada" text,
    prioridad text DEFAULT 'NORMAL'::text,
    "observacionesQA" text,
    "motivoRechazo" text,
    "pasoProceso" text DEFAULT 'PENDIENTE_ASIGNACION'::text,
    "formulaId" text NOT NULL,
    "cantidadPlanificada" numeric(14,4) NOT NULL,
    "cantidadObtenida" numeric(14,4),
    "mermaCalculada" numeric(14,4),
    estado public."EstadoOrdenProduccion" DEFAULT 'PENDIENTE'::public."EstadoOrdenProduccion" NOT NULL,
    "supervisorId" text NOT NULL,
    "fechaCierre" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.ordenes_produccion OWNER TO quimicorp;

--
-- Name: pagos_abonos; Type: TABLE; Schema: public; Owner: quimicorp
--

CREATE TABLE public.pagos_abonos (
    id text NOT NULL,
    cuenta_cobrar_id text NOT NULL,
    monto_abonado numeric(14,2) NOT NULL,
    fecha_abono timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    medio text,
    banco text,
    num_operacion text,
    observaciones text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.pagos_abonos OWNER TO quimicorp;

--
-- Name: pedido_aditivos; Type: TABLE; Schema: public; Owner: quimicorp
--

CREATE TABLE public.pedido_aditivos (
    id text NOT NULL,
    pedido_id text NOT NULL,
    insumo_id text NOT NULL,
    tipo public."TipoInsumo" NOT NULL,
    porcentaje numeric(5,2) DEFAULT 1.00 NOT NULL,
    gramos_calculados numeric(14,4),
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.pedido_aditivos OWNER TO quimicorp;

--
-- Name: pedidos_comerciales; Type: TABLE; Schema: public; Owner: quimicorp
--

CREATE TABLE public.pedidos_comerciales (
    id text NOT NULL,
    codigo_orden text NOT NULL,
    codigo_ref_admin text,
    cliente_nombre text NOT NULL,
    cliente_ruc text NOT NULL,
    contacto_nombre text,
    contacto_telefono text,
    direccion_despacho text,
    rep_comercial text,
    condicion_pago text,
    producto_nombre text NOT NULL,
    cantidad_solicitada numeric(14,4) NOT NULL,
    unidad_medida text DEFAULT 'KG'::text NOT NULL,
    lotes_requeridos integer DEFAULT 1 NOT NULL,
    monto_total numeric(14,2) NOT NULL,
    fecha_prometida timestamp(3) without time zone NOT NULL,
    prioridad public."PrioridadPedidoComercial" DEFAULT 'NORMAL'::public."PrioridadPedidoComercial" NOT NULL,
    estado public."EstadoPedidoComercial" DEFAULT 'NUEVO'::public."EstadoPedidoComercial" NOT NULL,
    formula_id text,
    notas_admin text,
    motivo_devolucion text,
    doc_type text DEFAULT 'OP'::text,
    aroma text,
    color text,
    aroma_text text,
    color_text text,
    variante_id text,
    cliente_id text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    tipo_comprobante character varying(20)
);


ALTER TABLE public.pedidos_comerciales OWNER TO quimicorp;

--
-- Name: permisos; Type: TABLE; Schema: public; Owner: quimicorp
--

CREATE TABLE public.permisos (
    id text NOT NULL,
    modulo text NOT NULL,
    accion public."AccionPermiso" NOT NULL
);


ALTER TABLE public.permisos OWNER TO quimicorp;

--
-- Name: proveedores; Type: TABLE; Schema: public; Owner: quimicorp
--

CREATE TABLE public.proveedores (
    id text NOT NULL,
    ruc text NOT NULL,
    razon_social text NOT NULL,
    contacto text,
    telefono text,
    correo text,
    direccion text,
    insumo_principal text,
    calificacion double precision DEFAULT 5.0 NOT NULL,
    estado text DEFAULT 'HOMOLOGADO'::text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.proveedores OWNER TO quimicorp;

--
-- Name: rol_permisos; Type: TABLE; Schema: public; Owner: quimicorp
--

CREATE TABLE public.rol_permisos (
    "rolId" text NOT NULL,
    "permisoId" text NOT NULL
);


ALTER TABLE public.rol_permisos OWNER TO quimicorp;

--
-- Name: roles; Type: TABLE; Schema: public; Owner: quimicorp
--

CREATE TABLE public.roles (
    id text NOT NULL,
    nombre text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.roles OWNER TO quimicorp;

--
-- Name: solicitudes_autorizacion; Type: TABLE; Schema: public; Owner: quimicorp
--

CREATE TABLE public.solicitudes_autorizacion (
    id text NOT NULL,
    solicitante_id text NOT NULL,
    solicitante_email text NOT NULL,
    solicitante_nombre text NOT NULL,
    modulo text NOT NULL,
    accion text NOT NULL,
    recurso_id text,
    recurso_nombre text,
    motivo text,
    estado text DEFAULT 'PENDIENTE'::text NOT NULL,
    aprobador_email text,
    respuesta_motivo text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.solicitudes_autorizacion OWNER TO quimicorp;

--
-- Name: sub_almacen_sobrantes; Type: TABLE; Schema: public; Owner: quimicorp
--

CREATE TABLE public.sub_almacen_sobrantes (
    id text NOT NULL,
    "loteOrigenId" text NOT NULL,
    "insumoSubproductoId" text NOT NULL,
    "pesoDisponible" numeric(14,4) NOT NULL,
    ubicacion text NOT NULL,
    estado public."EstadoSubAlmacen" DEFAULT 'DISPONIBLE'::public."EstadoSubAlmacen" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.sub_almacen_sobrantes OWNER TO quimicorp;

--
-- Name: sucursales; Type: TABLE; Schema: public; Owner: quimicorp
--

CREATE TABLE public.sucursales (
    id text NOT NULL,
    nombre text NOT NULL,
    direccion text,
    dispositivo_id text,
    ip text,
    port integer DEFAULT 4370 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.sucursales OWNER TO quimicorp;

--
-- Name: tickets_despacho; Type: TABLE; Schema: public; Owner: quimicorp
--

CREATE TABLE public.tickets_despacho (
    id text NOT NULL,
    "codigoTicket" text NOT NULL,
    "ordenProduccionId" text NOT NULL,
    "clienteDestino" text NOT NULL,
    "cantidadCajas" integer NOT NULL,
    "estadoDespacho" public."EstadoDespacho" DEFAULT 'PENDIENTE'::public."EstadoDespacho" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.tickets_despacho OWNER TO quimicorp;

--
-- Name: turnos; Type: TABLE; Schema: public; Owner: quimicorp
--

CREATE TABLE public.turnos (
    id text NOT NULL,
    nombre text NOT NULL,
    hora_inicio text NOT NULL,
    hora_fin text NOT NULL,
    tolerancia_minutos integer DEFAULT 15 NOT NULL,
    almuerzo_tope text DEFAULT '14:00'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.turnos OWNER TO quimicorp;

--
-- Name: users; Type: TABLE; Schema: public; Owner: quimicorp
--

CREATE TABLE public.users (
    id text NOT NULL,
    email text NOT NULL,
    nombre text NOT NULL,
    password text NOT NULL,
    role public."Role" DEFAULT 'PRODUCCION_ALMACEN'::public."Role" NOT NULL,
    "rolId" text,
    active boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.users OWNER TO quimicorp;

--
-- Name: usuarios; Type: TABLE; Schema: public; Owner: quimicorp
--

CREATE TABLE public.usuarios (
    id text NOT NULL,
    dni text NOT NULL,
    nombres text NOT NULL,
    apellidos text NOT NULL,
    "rolId" text NOT NULL,
    "passwordHash" text NOT NULL,
    "codigoBiometrico" text,
    estado public."EstadoGenerico" DEFAULT 'ACTIVO'::public."EstadoGenerico" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    cargo text,
    sucursal_id text,
    turno_id text
);


ALTER TABLE public.usuarios OWNER TO quimicorp;

--
-- Name: valorizacion_inventario; Type: TABLE; Schema: public; Owner: quimicorp
--

CREATE TABLE public.valorizacion_inventario (
    id text NOT NULL,
    "fechaCierre" date NOT NULL,
    "materiaPrimaValorizada" numeric(16,4) NOT NULL,
    "productoTerminadoValorizado" numeric(16,4) NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.valorizacion_inventario OWNER TO quimicorp;

--
-- Name: ventanas_almuerzo_qa; Type: TABLE; Schema: public; Owner: quimicorp
--

CREATE TABLE public.ventanas_almuerzo_qa (
    id text NOT NULL,
    fecha date NOT NULL,
    "horaInicioAprobada" timestamp(3) without time zone NOT NULL,
    "horaFinMinima" timestamp(3) without time zone NOT NULL,
    "aprobadoPorQAId" text NOT NULL,
    "operariosHabilitadosIds" text[],
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.ventanas_almuerzo_qa OWNER TO quimicorp;

--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: quimicorp
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
dcd2679f-2db2-48ee-9cb8-f2bc54a94107	2f1e5ccced68e6f0ef43aba0f8da68e5be6d034682485b4f84eefc9c5935f62e	2026-09-02 13:59:54.292888+00	0_init	\N	\N	2026-09-02 13:59:53.877337+00	1
197c2166-07ec-4c83-9204-ea09fe7b8387	20bc2ad004d1afd103d121c82cd9bba052dca3b72f04b31491d3f0f2419a4cef	2026-09-02 13:59:54.299745+00	20260828210000_add_despachado_estado_orden	\N	\N	2026-09-02 13:59:54.294463+00	1
eae6ce5b-b4dd-4f94-9ced-a0af5dbffbba	4f7568526adfded9e9a4629fd51ee44d95c9dca60da35614605c4bd092cc6a69	2026-09-02 13:59:54.306034+00	20260828210500_add_entregado_estado_pedido	\N	\N	2026-09-02 13:59:54.301033+00	1
9a2de871-bec6-4a24-80b9-943c72beb065	ed5b2b253c6077d6406815073bdad44698af896c9c1e9457b40b2d8e2b3735bd	2026-09-02 13:59:54.31306+00	20260828211000_add_pasos_elaboracion	\N	\N	2026-09-02 13:59:54.307605+00	1
f428d260-8941-46c5-b29d-ae40c2119634	60bb8d9b7c299a6290bcd63efdb7cbf3f108c1357a1413271a8279dbdc3627aa	2026-09-02 13:59:54.319636+00	20260831000000_add_numero_guia	\N	\N	2026-09-02 13:59:54.314834+00	1
57cd32fb-885a-4ea1-9300-8cc955b7238d	499d34474b805391401e00733c944eed1753410a3086a50301f48cde40702a9d	2026-09-02 13:59:54.378662+00	20260831010000_add_biometrico_multi_sucursal	\N	\N	2026-09-02 13:59:54.321132+00	1
0da38130-77b1-4804-859a-96f1a942d601	27c8f0359878ff9e027007992e453bf95d1f94b9eb9b37cbb4b369f360a3a4f4	2026-09-02 13:59:54.385685+00	add_pasos_elaboracion_variant	\N	\N	2026-09-02 13:59:54.380251+00	1
a4682364-0d5a-4921-baa9-91a658c02ccb	e785181bfcaf3140e16bacf7dc9b9a23c54611ec4b69f8db249b91c0a29b8c38	2026-09-02 13:59:54.392486+00	add_tipo_comprobante	\N	\N	2026-09-02 13:59:54.387039+00	1
1afeb0ca-a280-4e66-8b91-a3a3fbc815ed	80e9ea98ac03cf046b190370aa2a485fc15b8eeef00b794641a687695160ea7e	2026-09-04 17:58:31.415032+00	20260904090000_add_estado_fisico	\N	\N	2026-09-04 17:58:31.415032+00	1
\.


--
-- Data for Name: ajustes_finos; Type: TABLE DATA; Schema: public; Owner: quimicorp
--

COPY public.ajustes_finos (id, "ordenProduccionId", "insumoId", "cantidadAgregada", observacion, "registradoPorId", "timestamp") FROM stdin;
\.


--
-- Data for Name: asistencias; Type: TABLE DATA; Schema: public; Owner: quimicorp
--

COPY public.asistencias (id, "usuarioId", fecha, "horasTrabajadas", "minutosTardanza", "estadoAsistencia", "createdAt", "updatedAt", turno_id, hora_entrada, hora_salida, estado_almuerzo) FROM stdin;
\.


--
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: quimicorp
--

COPY public.audit_logs (id, "usuarioId", accion, "tablaAfectada", "registroId", "datosAnteriores", "datosNuevos", "ipOrigen", "timestamp") FROM stdin;
\.


--
-- Data for Name: calificaciones_operario; Type: TABLE DATA; Schema: public; Owner: quimicorp
--

COPY public.calificaciones_operario (id, "usuarioId", "ordenProduccionId", "puntajeEficiencia", comentarios, "createdAt") FROM stdin;
\.


--
-- Data for Name: clientes; Type: TABLE DATA; Schema: public; Owner: quimicorp
--

COPY public.clientes (id, "razonSocial", ruc, telefono, direccion, contacto, "metodoEnvio", "condicionPago", "createdAt", "updatedAt") FROM stdin;
4128ab29-1b8f-402b-b4f7-e1d479495ae3	KELLY PEÑA	CLI-030	999999999	Lima, Perú	Kelly Peña	INDRIVER	Contado	2026-09-02 14:06:59.747	2026-09-04 15:33:19.984
fb0a2ed4-aa43-4e8a-87aa-dc14b4b75502	JEAN	CLI-031	999999999	Lima, Perú	Jean	INDRIVER	Contado	2026-09-02 14:06:59.649	2026-09-04 15:33:19.99
a823d8c0-4727-4f2c-b5ce-7fdd0e4fb528	VENTAS MOSTRADOR / BOLETAS DNI	00000000	999999999	Planta / Tienda Quimicorp - Lima	Atención al Cliente	ENTREGA EN PLANTA	Contado	2026-09-02 14:06:34.975	2026-09-04 15:33:19.996
ae6b7139-1b14-4b8d-8752-1eb9812b7211	ALFALION INVESTMENT S.A.C.	20612434124	951166256	CALLE MOCHICAS 175 - SAN MIGUEL	Angie	INDRIVER Y SR CESAR	Contado	2026-09-02 14:06:34.954	2026-09-04 15:33:19.803
4cf61e66-b049-4e9a-a942-ccc5e781a6b8	FENIX G EXPRESS S.A.C.	20613316184	949348085	AV LA PAZ 506	Luis Marín	INDRIVER Y SR CESAR	Credito 07 dias	2026-09-02 14:06:34.964	2026-09-04 15:33:19.823
14ef77f4-4829-4e5a-9f90-9560d51a947b	IMPORT MERAKI HOGAR S.A.C.	20614181444	948124738	PJ NEPTUNO 192 - RIMAC	Jairo Ochoa	INDRIVER	Contado	2026-09-02 14:06:34.997	2026-09-04 15:33:19.83
cb5a0ac6-8e6e-4123-b996-0c51e3700682	MULTIPLAZA PERU S.A.C.	20611510315	939353078	AV. CANADA 3721 - SAN LUIS	Geyma Novillo	SR CESAR	Contado	2026-09-02 14:06:34.96	2026-09-04 15:33:19.837
ba6d7134-92a2-4570-8539-80b8208992a3	GARB CORP PERU S.A.C.	20613225995	939353078	AV. CANADA 3721 - SAN LUIS	Geyma Novillo	SR CESAR	Credito 15 dias	2026-09-02 14:06:34.993	2026-09-04 15:33:19.858
23d7f5d1-d0fa-48f7-95d8-09985dcf3e42	JHON ROBERT CCANTO PEREZ	73940637	910425618	AV. FERROCARRIL CON LAS CASCADAS (DELIFRUT,WAFFLES, CREPES Y JUGOS) - SANTA ANITA	Jhon Ccanto	INDRIVER Y SR CESAR	Credito 07 dias	2026-09-02 14:06:34.989	2026-09-04 15:33:19.862
249292bf-df1e-46b5-808c-af61c0bc1afc	DANIEL MEZA	CLI-010	994663345	BODEGA - YUVA - ATE	Daniel Meza	INDRIVER Y SR CESAR	Contado	2026-09-02 14:06:59.645	2026-09-04 15:33:19.87
152c3943-b0fa-41d1-bce5-b7511d660dc4	DAVID JUNIOR SARMIENTO CARDENAS	77231684	900955714	Lima, Perú	David Sarmiento	INDRIVER	Contado	2026-09-02 14:06:35.01	2026-09-04 15:33:19.877
a2d4abc0-5c0a-4f6a-ada6-41f4266d4e7c	RORY ALFREDO SERPA FLORES	48558440	965371878	AV MICHEL FORT 172 - SMP	Austin Santos	INDRIVER Y SR CESAR	Contado	2026-09-02 14:06:34.971	2026-09-04 15:33:19.883
a5a2423e-1c0f-4545-8121-1853976d8fb7	NEXARA CORP S.A.C.	20615778207	950186349	URB. SANTA MARINA DEL PINAR 4 E MZA. B LOTE 04 - PIURA	Nicol	SHALOM	Contado	2026-09-02 14:06:34.985	2026-09-04 15:33:19.888
82a76af1-11b4-461b-941e-8f28ec07a5f8	JHON ERIC AVILA RAMIREZ	75129824	999999999	Lima, Perú	Jhon Ávila	INDRIVER	Contado	2026-09-02 14:06:35.017	2026-09-04 15:33:19.895
485ed2cb-6f03-4c1b-9b44-245d7be06bd5	SHOPPERANG GROUP S.A.C.	20614915189	939353078	AV. CANADA 3721 - SAN LUIS	Geyma Novillo	SR CESAR	Contado	2026-09-03 20:13:04.646	2026-09-04 15:33:19.843
dfe72165-b710-459e-b6f5-a66a7baeb9d9	LUCIAALEXANDRA SERNAQUE BAYONA	10719389533	939353078	AV. CANADA 3721 - SAN LUIS	Geyma Novillo	SR CESAR	Contado	2026-09-03 20:13:04.651	2026-09-04 15:33:19.848
2a553b92-34fb-4629-bd85-0ca70ff03143	GARABITO SAMANIEGO JONATAN MARTIN	10751305511	939353078	AV. CANADA 3721 - SAN LUIS	Geyma Novillo	SR CESAR	Credito 07 dias	2026-09-02 14:06:35.013	2026-09-04 15:33:19.853
e8c10f2c-6357-4c61-8153-790e7b8a6966	RENZO MARCELO SALSAVILCA ESTRADA	70042804	958483996	CALLE SANTA MARIA AL FRENTE DE LA LOZA DEPORTIVA TG. ZAVALETA - SANTA ANITA	Renzo Salsavilca	INDRIVER Y SR CESAR	Contado	2026-09-02 14:06:34.978	2026-09-04 15:33:19.905
22ca8b6e-78cf-4f2f-b3b7-910968d68f5d	LEO HIDALGO	CLI-018	924091032	Lima, Perú	Leo Hidalgo	INDRIVER	Contado	2026-09-02 14:06:59.701	2026-09-04 15:33:19.919
d6c5ebd5-7538-499e-9e29-7958f10ecd3b	ALONSO CHUNGA	CLI-019	901495303	Lima, Perú	Alonso Chunga	INDRIVER	Contado	2026-09-02 14:06:59.689	2026-09-04 15:33:19.924
95cc251a-1217-49f4-97ce-b9600e147729	LUIS JURADO	CLI-024	970368128	CALLE PADRE IZAGUIRRE 290 -Ñ RIMAC	Luis Jurado	INDRIVER	Contado	2026-09-02 14:06:59.598	2026-09-04 15:33:19.951
1d4c93a7-c5e1-4dfa-9e73-6e36fdee7800	GRUPO DEUS S.A.C.	20612838489	999999999	Lima, Perú	Área de Compras / Administración	INDRIVER Y SR CESAR	Contado	2026-09-02 14:06:35.001	2026-09-04 15:33:19.97
ffb82269-bc8f-4d30-9938-c1ae9d346dd3	CARLA PATRICIA RIVERA RAMOS	10711935725	999999999	Lima, Perú	Carla Rivera	INDRIVER	Contado	2026-09-02 14:06:35.006	2026-09-04 15:33:19.974
a64e74e1-bf12-4109-b6ca-f62948dc4911	JUAN PABLO CASSANA RAMON	42816216	999999999	Lima, Perú	Juan Pablo Cassana	INDRIVER	Contado	2026-09-02 14:06:34.982	2026-09-04 15:33:19.979
485645c4-bcdb-47b2-b4da-0254928ef985	BRYAN FIESTAS	CLI-015	945741365	Lima, Perú	Bryan Fiestas	MOVILIDAD PROPIA	Contado	2026-09-03 21:08:48.831	2026-09-04 15:33:19.899
469c90ef-d060-49da-9e1a-6a5f68b759ca	EDSON ÑAUPARI	CLI-017	943595898	AV. PACTO ANDINO 684 - VILLA EL SALVADOR	Edson Ñaupari	INDRIVER Y SR CESAR	Contado	2026-09-03 21:08:48.855	2026-09-04 15:33:19.913
76a900d1-1756-483a-a49e-7ad3114b7e06	ERICK CHAVEZ	CLI-020	9958835633	MZ B LOTE 28 URB CABO LINARES - SMP	Erick Chávez	INDRIVER	Contado	2026-09-02 14:06:59.601	2026-09-04 15:33:19.929
8786dc25-5680-44fb-9b60-4aca565d8272	ANGIE CRUZ (CHAVEZ)	CLI-021	914727861	JR JUPITER MZ F LOTE 24 - SMP	Angie Cruz	INDRIVER	Contado	2026-09-03 21:08:48.895	2026-09-04 15:33:19.935
1d88344b-406e-4709-8477-febdd0229302	MARLEX	CLI-022	955282478	Lima, Perú	Katherin	MOVILIDAD PROPIA	Contado	2026-09-03 20:13:04.713	2026-09-04 15:33:19.94
20061e97-1d42-427c-90c3-2a2fa05c04bb	JUANA VASQUEZ	CLI-023	961273061	AV. HUARA MZ B2 LOTE 18 MI PERU - VENTANILLA	Juana Vásquez	INDRIVER	Contado	2026-09-03 20:13:04.717	2026-09-04 15:33:19.945
24a5b778-a3ca-43c2-a50d-85faa45aa744	TAINTY CORPORACION	CLI-025	932491316	Lima, Perú	Carlos Esparza	INDRIVER	Contado	2026-09-03 20:13:04.723	2026-09-04 15:33:19.957
65755eba-be76-4948-8764-1d86cca32905	STARHOME PERU S.A.C.	20612436062	937283433	JR JORGE CHAVEZ 460 URB. CHACRA COLORADA - BREÑA	Daniel Espinoza	INDRIVER Y SR CESAR	Credito 07 dias	2026-09-02 14:06:34.967	2026-09-04 15:33:19.963
750ba4ab-b91b-49ba-a791-821752f7017a	RENZO ADRIAN AVILA GUTIERREZ	72768719	\N	Lima, Perú	Renzo Adrián Ávila Gutiérrez	INDRIVER	Contado	2026-09-04 15:33:20.001	2026-09-04 15:33:20.001
\.


--
-- Data for Name: cola_despacho; Type: TABLE DATA; Schema: public; Owner: quimicorp
--

COPY public.cola_despacho (id, lote_codigo, producto_nombre, cliente_nombre, cantidad, fecha_fabricacion, codigo_qr, codigo_barras, estado, created_at, updated_at, numero_guia) FROM stdin;
\.


--
-- Data for Name: contacto_representantes; Type: TABLE DATA; Schema: public; Owner: quimicorp
--

COPY public.contacto_representantes (id, cliente_id, nombre, cargo, telefono, email, es_principal, created_at, updated_at) FROM stdin;
67556d6c-229a-46d4-8e91-3373c9c8a0a2	ae6b7139-1b14-4b8d-8752-1eb9812b7211	Angie	Pedidos	951166256	\N	t	2026-09-04 15:33:19.812	2026-09-04 15:33:19.812
0aa2e055-f1c5-48a4-8d9f-66408a05857f	ae6b7139-1b14-4b8d-8752-1eb9812b7211	Miguel Enríquez	Supervisión	955361128	\N	f	2026-09-04 15:33:19.815	2026-09-04 15:33:19.815
b370324e-3248-4eff-bb18-5246fc10e5ac	ae6b7139-1b14-4b8d-8752-1eb9812b7211	Miguel Marcos	Dueño 1	944245458	\N	f	2026-09-04 15:33:19.817	2026-09-04 15:33:19.817
62631cc2-cc0c-416e-926b-8a24e8e95ea9	ae6b7139-1b14-4b8d-8752-1eb9812b7211	Daniel Espinoza	Dueño 2	937283433	\N	f	2026-09-04 15:33:19.818	2026-09-04 15:33:19.818
bc82fbc8-953e-4361-baaf-d3502e0fec8e	4cf61e66-b049-4e9a-a942-ccc5e781a6b8	Luis Marín	Dueño	949348085	\N	t	2026-09-04 15:33:19.826	2026-09-04 15:33:19.826
78884b8a-5a3c-44d4-a403-efc097b914aa	4cf61e66-b049-4e9a-a942-ccc5e781a6b8	Jhosep	Asistente	912195363	\N	f	2026-09-04 15:33:19.828	2026-09-04 15:33:19.828
9db116ea-feb8-449e-bafe-d6b2b88e74d4	14ef77f4-4829-4e5a-9f90-9560d51a947b	Jairo Ochoa	Titular / Compras	948124738	\N	t	2026-09-04 15:33:19.835	2026-09-04 15:33:19.835
7903a0c8-6aa4-4aaf-a916-ccfd70933933	cb5a0ac6-8e6e-4123-b996-0c51e3700682	Geyma Novillo	Compras	939353078	\N	t	2026-09-04 15:33:19.841	2026-09-04 15:33:19.841
bb7c1502-904a-487c-9e6e-929499134d16	485ed2cb-6f03-4c1b-9b44-245d7be06bd5	Geyma Novillo	Compras	939353078	\N	t	2026-09-04 15:33:19.846	2026-09-04 15:33:19.846
8cd1c083-0514-4c92-b8f6-a437cd6ad971	dfe72165-b710-459e-b6f5-a66a7baeb9d9	Geyma Novillo	Compras	939353078	\N	t	2026-09-04 15:33:19.851	2026-09-04 15:33:19.851
7d0e48b3-0319-4107-8635-09e66270f1a4	2a553b92-34fb-4629-bd85-0ca70ff03143	Geyma Novillo	Compras	939353078	\N	t	2026-09-04 15:33:19.856	2026-09-04 15:33:19.856
f079f211-4e57-44f3-bc83-71ae145fc03d	ba6d7134-92a2-4570-8539-80b8208992a3	Geyma Novillo	Compras	939353078	\N	t	2026-09-04 15:33:19.86	2026-09-04 15:33:19.86
f1932b38-aae7-45ea-b5f8-9f00836b96b3	23d7f5d1-d0fa-48f7-95d8-09985dcf3e42	Jhon Ccanto	Titular	910425618	\N	t	2026-09-04 15:33:19.867	2026-09-04 15:33:19.867
2c014567-c146-48b9-bee0-49285c0dfda8	249292bf-df1e-46b5-808c-af61c0bc1afc	Daniel Meza	Dueño	994663345	\N	t	2026-09-04 15:33:19.873	2026-09-04 15:33:19.873
f7295e0a-a022-4cef-8361-c45d3be60f5a	249292bf-df1e-46b5-808c-af61c0bc1afc	Alexis	Asistente	955475499	\N	f	2026-09-04 15:33:19.875	2026-09-04 15:33:19.875
966f576c-cf13-4f42-a218-48904566a3d6	152c3943-b0fa-41d1-bce5-b7511d660dc4	David Sarmiento	Titular	900955714	\N	t	2026-09-04 15:33:19.88	2026-09-04 15:33:19.88
d7400ee3-8594-4b9a-8848-0eeabc64f2d7	152c3943-b0fa-41d1-bce5-b7511d660dc4	Diego	Asistente	972645769	\N	f	2026-09-04 15:33:19.881	2026-09-04 15:33:19.881
3f7bb871-26e1-488b-b71c-310ba0706a18	a2d4abc0-5c0a-4f6a-ada6-41f4266d4e7c	Austin Santos	Titular / Compras	965371878	\N	t	2026-09-04 15:33:19.886	2026-09-04 15:33:19.886
98d40db9-958a-402a-b2cb-2ab025960412	a5a2423e-1c0f-4545-8121-1853976d8fb7	Nicol	Compras	950186349	\N	t	2026-09-04 15:33:19.891	2026-09-04 15:33:19.891
0ca2b99a-7530-48c6-a5b9-7ecca9d8ac6e	a5a2423e-1c0f-4545-8121-1853976d8fb7	José Gerardo	Dueño	947602825	\N	f	2026-09-04 15:33:19.892	2026-09-04 15:33:19.892
5f206808-a9ed-4295-aa29-55724a23254c	82a76af1-11b4-461b-941e-8f28ec07a5f8	Jhon Ávila	Titular	999999999	\N	t	2026-09-04 15:33:19.897	2026-09-04 15:33:19.897
cd472e42-ec01-48dc-b6ef-f2b2b5152694	485645c4-bcdb-47b2-b4da-0254928ef985	Bryan Fiestas	Titular	945741365	\N	t	2026-09-04 15:33:19.903	2026-09-04 15:33:19.903
b460d79d-fb64-426c-b01d-a36ef06039ea	e8c10f2c-6357-4c61-8153-790e7b8a6966	Renzo Salsavilca	Dueño	958483996	\N	t	2026-09-04 15:33:19.909	2026-09-04 15:33:19.909
b2266201-0111-4b06-a6f7-ce9d39e3b82c	e8c10f2c-6357-4c61-8153-790e7b8a6966	Laura	Asistente	902608957	\N	f	2026-09-04 15:33:19.91	2026-09-04 15:33:19.91
4023d95b-469f-4610-8b1f-3db210235110	e8c10f2c-6357-4c61-8153-790e7b8a6966	Roberto	Recepción	952896929	\N	f	2026-09-04 15:33:19.911	2026-09-04 15:33:19.911
9e72d57e-afc8-4080-9789-5d28a49b46a3	469c90ef-d060-49da-9e1a-6a5f68b759ca	Edson Ñaupari	Titular	943595898	\N	t	2026-09-04 15:33:19.916	2026-09-04 15:33:19.916
30952d5b-72f9-47dd-9cf9-8d9e1143b54e	469c90ef-d060-49da-9e1a-6a5f68b759ca	Luz	Asistente	960817853	\N	f	2026-09-04 15:33:19.917	2026-09-04 15:33:19.917
d0c28d24-cc82-4744-aca3-a69304a9443b	22ca8b6e-78cf-4f2f-b3b7-910968d68f5d	Leo Hidalgo	Titular	924091032	\N	t	2026-09-04 15:33:19.922	2026-09-04 15:33:19.922
fb641bb7-4dd8-4f1f-857c-8a3a729ddc64	d6c5ebd5-7538-499e-9e29-7958f10ecd3b	Alonso Chunga	Titular	901495303	\N	t	2026-09-04 15:33:19.927	2026-09-04 15:33:19.927
e3f46522-0db9-438a-a0f8-cf9dd5a8f128	76a900d1-1756-483a-a49e-7ad3114b7e06	Erick Chávez	Titular	9958835633	\N	t	2026-09-04 15:33:19.933	2026-09-04 15:33:19.933
59ad1535-bca4-4393-a999-3b5ffbbb4427	8786dc25-5680-44fb-9b60-4aca565d8272	Angie Cruz	Titular	914727861	\N	t	2026-09-04 15:33:19.938	2026-09-04 15:33:19.938
038382dc-718c-483c-a133-a2d57f75a9ea	1d88344b-406e-4709-8477-febdd0229302	Katherin	Titular / Compras	955282478	\N	t	2026-09-04 15:33:19.943	2026-09-04 15:33:19.943
a6ddffc9-e158-4555-b336-174d1b0ffdfd	20061e97-1d42-427c-90c3-2a2fa05c04bb	Juana Vásquez	Titular	961273061	\N	t	2026-09-04 15:33:19.949	2026-09-04 15:33:19.949
88d05204-920f-40d1-9a4a-21dd870e0589	95cc251a-1217-49f4-97ce-b9600e147729	Luis Jurado	Titular	970368128	\N	t	2026-09-04 15:33:19.955	2026-09-04 15:33:19.955
9d2f5686-b9e9-4aeb-a717-3db1b2a5a9f6	24a5b778-a3ca-43c2-a50d-85faa45aa744	Carlos Esparza	Titular / Compras	932491316	\N	t	2026-09-04 15:33:19.961	2026-09-04 15:33:19.961
7767c2c3-ce9c-4ad2-a0ce-d712e8aae85e	65755eba-be76-4948-8764-1d86cca32905	Daniel Espinoza	Dueño / Compras	937283433	\N	t	2026-09-04 15:33:19.967	2026-09-04 15:33:19.967
e43b890e-0d27-4703-8b11-5264b974c5de	1d4c93a7-c5e1-4dfa-9e73-6e36fdee7800	Área de Compras / Administración	Compras	999999999	\N	t	2026-09-04 15:33:19.972	2026-09-04 15:33:19.972
e441c526-02fa-47a7-8eda-c0d9d4f2faca	ffb82269-bc8f-4d30-9938-c1ae9d346dd3	Carla Rivera	Titular	999999999	\N	t	2026-09-04 15:33:19.977	2026-09-04 15:33:19.977
24931a3f-f069-4e61-a9b1-a133f63550dd	a64e74e1-bf12-4109-b6ca-f62948dc4911	Juan Pablo Cassana	Titular	999999999	\N	t	2026-09-04 15:33:19.982	2026-09-04 15:33:19.982
66421424-2a75-4686-a336-987d6b4ed6bd	4128ab29-1b8f-402b-b4f7-e1d479495ae3	Kelly Peña	Titular	999999999	\N	t	2026-09-04 15:33:19.988	2026-09-04 15:33:19.988
d20de2cd-90c3-4bce-9b83-81885c9f4b65	fb0a2ed4-aa43-4e8a-87aa-dc14b4b75502	Jean	Titular	999999999	\N	t	2026-09-04 15:33:19.993	2026-09-04 15:33:19.993
8fc626f6-e0f3-4a37-ac53-dabc84ad92c5	a823d8c0-4727-4f2c-b5ce-7fdd0e4fb528	Atención al Cliente	Ventas Directas	999999999	\N	t	2026-09-04 15:33:19.998	2026-09-04 15:33:19.998
848dfdc1-38ac-4665-8b12-35fe1ed4716d	750ba4ab-b91b-49ba-a791-821752f7017a	Renzo Adrián Ávila Gutiérrez	Titular	\N	\N	t	2026-09-04 15:33:20.003	2026-09-04 15:33:20.003
\.


--
-- Data for Name: cotizaciones_proveedores; Type: TABLE DATA; Schema: public; Owner: quimicorp
--

COPY public.cotizaciones_proveedores (id, proveedor_id, insumo_id, precio_unitario, moneda, unidad_medida, num_cotizacion, fecha_cotizacion, variacion_porcentual, observaciones, estado, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: cuentas_bancarias_proveedores; Type: TABLE DATA; Schema: public; Owner: quimicorp
--

COPY public.cuentas_bancarias_proveedores (id, proveedor_id, banco, moneda, numero_cuenta, cci, created_at, updated_at) FROM stdin;
556aba04-6e61-4e0b-9a6e-a7b9bb893e1a	d8649cbb-2d99-4d62-90cc-0c1bfa9c84a0	BCP	SOLES	1932648200094	219300264820008992	2026-09-02 14:06:26.032	2026-09-02 14:06:26.032
f57eff2f-818c-41f0-9638-63ba0d949fca	ac268d9a-d25f-404a-8dc3-047bb3d735e4	BCP	USD	1930844579109	219300084457910016	2026-09-02 14:06:26.04	2026-09-02 14:06:26.04
85e9a757-0a0e-4ddc-bdf3-c5558dbf6037	ab62fe49-2e7d-413f-8306-af8e0dafd820	INTERBANK	USD	0413000302553	304100300030254976	2026-09-02 14:06:26.045	2026-09-02 14:06:26.045
984f79ee-9d29-4704-ad9f-8c4b02304437	f61db636-35a0-4ad4-a319-834a8bf37a7a	BCP	USD	1912355614189	219100235561417984	2026-09-02 14:06:26.049	2026-09-02 14:06:26.049
b9df8f7a-d5eb-4d73-90a1-89a43aeafc02	66f2b852-96c1-4986-9bdd-b35e954349ba	INTERBANK	SOLES	2003006799386	320000300679937984	2026-09-02 14:06:26.054	2026-09-02 14:06:26.054
e56b16c6-2005-41c9-a0f8-b5d8b1252fa3	8cf8763f-3ce8-4262-9cb1-805440f4a088	BCP	USD	1916884656187	219100688465617984	2026-09-02 14:06:26.059	2026-09-02 14:06:26.059
d698ef59-d5b8-48cf-8b7f-63f887676c5d	718680b5-afae-456f-938b-49bb65c3bdbc	BCP	SOLES	1919862429092	219100986242908992	2026-09-02 14:06:26.064	2026-09-02 14:06:26.064
935327e7-2c36-40dc-9ff5-5a4208edb49c	718680b5-afae-456f-938b-49bb65c3bdbc	BCP	USD	1919846699113	219100984669911008	2026-09-02 14:06:26.064	2026-09-02 14:06:26.064
5e744ac5-db14-417f-ae06-7c304c57a2b4	2f3ab071-4de8-4b2d-bfde-20ba3070456f	BCP	SOLES	1919044565040	219100904456504000	2026-09-02 14:06:26.07	2026-09-02 14:06:26.07
7707e52d-6205-453c-a601-c3b5fc486882	2f3ab071-4de8-4b2d-bfde-20ba3070456f	INTERBANK	SOLES	2003008577704	320000300857769984	2026-09-02 14:06:26.07	2026-09-02 14:06:26.07
c0b7682b-edcd-4cc8-9e2f-d02b573293af	5fac166a-9843-4ad3-94a6-e34003af70a6	BCP	SOLES	1932329478079	219300232947807008	2026-09-02 14:06:26.076	2026-09-02 14:06:26.076
8fe958c7-077f-4cce-8234-94ed4ad83232	55cb7078-ef85-49cd-a3fc-5bebdcb56f72	BCP	SOLES	1910076803086	219100007680308000	2026-09-02 14:06:26.082	2026-09-02 14:06:26.082
648b0c82-43d4-442c-a8f3-9724d4ca9095	55cb7078-ef85-49cd-a3fc-5bebdcb56f72	BCP	USD	1911800217119	219100180021711008	2026-09-02 14:06:26.082	2026-09-02 14:06:26.082
db15bc50-fd4b-4a36-a539-f233394c23f0	aafb5cc7-d5f8-4e96-925d-9bcb05cdee5c	BCP	SOLES	1941971566006	21940019756600600	2026-09-02 14:06:26.101	2026-09-02 14:06:26.101
feef96dd-3ed9-43e0-b4a8-2ad2ec39d340	aafb5cc7-d5f8-4e96-925d-9bcb05cdee5c	INTERBANK	SOLES	2003002113218	320000300211321024	2026-09-02 14:06:26.101	2026-09-02 14:06:26.101
b380cd42-76fb-4e44-89c7-544f898d0d0e	1b90766c-4f80-43a1-af4a-c2de57732318	BCP	SOLES	19272949670032	21921794967003200	2026-09-02 14:06:26.108	2026-09-02 14:06:26.108
03ab78fe-3941-4c28-a6e6-a08c28b5b32f	ae630474-bde4-450d-b8ba-c33dd3d4dd47	BCP	USD	1912193110135	219100219311012992	2026-09-02 14:06:26.113	2026-09-02 14:06:26.113
032c8a83-b36d-4592-876e-3a0b43f9a0a7	ae630474-bde4-450d-b8ba-c33dd3d4dd47	BCP	SOLES	1912173613085	219100217361308000	2026-09-02 14:06:26.113	2026-09-02 14:06:26.113
f69e3a09-0d34-4e81-a9da-6a4bb7eae35e	1d98fc8a-9beb-4a2f-833c-29cc3e1df8b7	BCP	SOLES	1911990860095	21910019986009500	2026-09-02 14:06:26.119	2026-09-02 14:06:26.119
47b58cd8-ff6a-4b20-9a3c-34ab29e81d4f	1d98fc8a-9beb-4a2f-833c-29cc3e1df8b7	INTERBANK	SOLES	2003005128119	\N	2026-09-02 14:06:26.119	2026-09-02 14:06:26.119
f4a7a7fe-c637-456d-aff6-9a604f1b05ab	55b3464f-d4a6-42f1-8ae2-009686414191	BCP	SOLES	1911429336036	219100142933603008	2026-09-02 14:06:26.128	2026-09-02 14:06:26.128
236a4bf0-089e-4c0d-92f3-287672ca3dfb	55b3464f-d4a6-42f1-8ae2-009686414191	INTERBANK	SOLES	1293000476374	312900300047636992	2026-09-02 14:06:26.128	2026-09-02 14:06:26.128
5a28a279-32ee-47af-aef3-4cae232bd607	93df78e4-5ee9-411b-83fd-b9453f89946a	BCP	SOLES	2003006750107	320000300675009984	2026-09-02 14:06:26.133	2026-09-02 14:06:26.133
a4df67aa-4960-455e-a484-4d91227b3b77	35e76b81-9fda-4f61-85f7-647eab584c87	BCP	SOLES	1919400248098	1	2026-09-02 14:06:26.137	2026-09-02 14:06:26.137
1c94fc21-4d9f-4415-891f-cd4ed775e8f4	d195723d-fb6a-4ba0-a4c6-5aa4dc05ad27	BCP	SOLES	1912294804036	219100229480403008	2026-09-02 14:06:26.142	2026-09-02 14:06:26.142
8c9c2fbe-1458-4e81-8039-603e23d46e9b	d195723d-fb6a-4ba0-a4c6-5aa4dc05ad27	BCP	USD	1932315261184	219300231526118016	2026-09-02 14:06:26.142	2026-09-02 14:06:26.142
ae189aaa-f3a4-4214-ac25-439e657eb3bd	fac1cb82-ef10-46a1-93df-ca833ab67af5	BCP	SOLES	1910331329056	219100033132904992	2026-09-02 14:06:26.148	2026-09-02 14:06:26.148
ad34c37d-f586-483e-94b5-99544057d4e0	bcb8e26e-f677-47f5-b186-98662c62c01f	BCP	SOLES	1917289368077	219100728936807008	2026-09-02 14:06:26.153	2026-09-02 14:06:26.153
2e358ea7-23ab-4b50-bd0b-7cbba71fd550	50ee55df-f449-4d81-a426-74f9658bceea	BCP	USD	1938966754180	00219300896675418012	2026-09-02 14:06:26.159	2026-09-02 14:06:26.159
a3e4fec0-2b6c-4cbd-8c35-82b004c5597c	ed688845-4072-495e-be03-0c962aa2b9ef	BCP	SOLES	1912591815047	219100259181504000	2026-09-02 14:06:26.164	2026-09-02 14:06:26.164
97efc4b5-be58-419f-af92-4968d4f42cba	293d2fb9-e16c-4c44-8b47-55e5725de587	BCP	SOLES	19103051689013	219110305168900992	2026-09-02 14:06:26.169	2026-09-02 14:06:26.169
40fc9d46-ff27-449e-9c85-38338369eaf9	019a07a6-7a8c-4582-bb74-8df80ea4237d	BCP	SOLES	1912252638017	219100225263800992	2026-09-02 14:06:26.174	2026-09-02 14:06:26.174
2d42261d-e1e9-4053-899b-046170bcfe9b	9e31f0a9-19eb-4ac3-a866-5311f93ab0d5	INTERBANK	SOLES	0573006174663	305700300617465984	2026-09-02 14:06:26.179	2026-09-02 14:06:26.179
05885ac5-397d-42ed-b15b-5bfeaeb57790	9e31f0a9-19eb-4ac3-a866-5311f93ab0d5	INTERBANK	USD	0573006174670	305700300617467008	2026-09-02 14:06:26.179	2026-09-02 14:06:26.179
9f30e1db-3270-480a-b462-e175fb9f9e81	5d958052-b98f-4888-8419-c3403da968bb	BCP	SOLES	1922335920050	219200233592004992	2026-09-02 14:06:26.185	2026-09-02 14:06:26.185
f9de07d2-b734-4bef-9ea6-ce74a5c9165b	afabb951-d1dd-4d30-8f23-1e228a749931	BCP	SOLES	1912567152027	219100256715201984	2026-09-02 14:06:26.19	2026-09-02 14:06:26.19
aa82242c-6053-46ad-85f5-1174a20d1a63	8738a654-222d-4f16-ba06-8e77eb59529d	BCP	SOLES	1911423061053	\N	2026-09-02 14:06:26.195	2026-09-02 14:06:26.195
95d3a773-1322-4cb6-ab58-364da3a5dbc2	9291f69f-6805-4c4f-a020-28411b31149d	BCP	USD	1917113810175	21910071138107500	2026-09-02 14:06:26.199	2026-09-02 14:06:26.199
d04e5be8-d301-4944-b5fe-42cb9f42a5ce	9291f69f-6805-4c4f-a020-28411b31149d	BCP	SOLES	1917113812085	219100711381208000	2026-09-02 14:06:26.199	2026-09-02 14:06:26.199
\.


--
-- Data for Name: cuentas_cobrar; Type: TABLE DATA; Schema: public; Owner: quimicorp
--

COPY public.cuentas_cobrar (id, codigo_doc, cliente_id, cliente_nombre, cliente_ruc, pedido_id, orden_prod, producto, monto_total, saldo_pendiente, condicion_pago, dias_plazo, fecha_emision, fecha_vencimiento, fecha_pago, estado, medio_pago, canal_banco, created_at, updated_at) FROM stdin;
2e758381-42e5-4b34-a0d4-ab77c0f13a8e	E001-209	a5a2423e-1c0f-4545-8121-1853976d8fb7	NEXARA CORP S.A.C.	20615778207	\N	OP-20260815-01	SRM ALO AUTOM	247.80	0.00	Contado	0	2026-08-15 00:00:00	2026-08-15 00:00:00	2026-08-15 00:00:00	PAGADO	Deposito en cuenta	Interbank	2026-09-02 14:06:35.091	2026-09-04 15:33:57.24
22e1853d-f4a5-4d6e-af26-a0466bd1746d	E001-210	ae6b7139-1b14-4b8d-8752-1eb9812b7211	ALFALION INVESTMENT S.A.C.	20612434124	\N	OP-20260817-01	CRM HDT CENT Y HIAL AUTOM	1078.00	0.00	Contado	0	2026-08-18 00:00:00	2026-08-18 00:00:00	2026-08-18 00:00:00	PAGADO	Deposito en cuenta	Interbank	2026-09-02 14:06:35.073	2026-09-04 15:33:57.249
3b95a817-8a38-4db7-8e4e-a423ce17e141	E001-211	ae6b7139-1b14-4b8d-8752-1eb9812b7211	ALFALION INVESTMENT S.A.C.	20612434124	\N		IMPERMEABILIZANTE	1650.00	0.00	Contado	0	2026-08-18 00:00:00	2026-08-18 00:00:00	2026-08-18 00:00:00	PAGADO	Deposito en cuenta	Interbank	2026-09-02 14:06:35.07	2026-09-04 15:33:57.253
fc1557a2-9ad1-45e9-bc56-317dd8a6d470	E001-212	ae6b7139-1b14-4b8d-8752-1eb9812b7211	ALFALION INVESTMENT S.A.C.	20612434124	\N	OP-20260818-02	STK CKTS AUTOM	388.00	0.00	Contado	0	2026-08-18 00:00:00	2026-08-18 00:00:00	2026-08-18 00:00:00	PAGADO	Deposito en cuenta	Interbank	2026-09-02 14:06:35.067	2026-09-04 15:33:57.257
c1d429a3-25d7-4868-831c-d77273facde6	E001-213	4cf61e66-b049-4e9a-a942-ccc5e781a6b8	FENIX G EXPRESS S.A.C.	20613316184	\N	OP-20260817-03	JBON LIQ TBNF AUTOM	600.00	600.00	Credito 07 dias	7	2026-08-18 00:00:00	2026-08-25 00:00:00	\N	PENDIENTE	\N	\N	2026-09-02 14:06:35.064	2026-09-04 15:33:57.26
8bbeec26-6325-44dc-aeb8-3af64c083488	EB01-119	a823d8c0-4727-4f2c-b5ce-7fdd0e4fb528	VENTAS MOSTRADOR / BOLETAS DNI	00000000	\N	OP-20260817-02	CREMA MUSC AUT	605.00	0.00	Contado	0	2026-08-18 00:00:00	2026-08-18 00:00:00	2026-08-18 00:00:00	PAGADO	Deposito en cuenta	Interbank	2026-09-02 14:06:35.058	2026-09-04 15:33:57.269
5e6f3c49-6806-408a-8762-bec11537fa3d	EB01-121	a823d8c0-4727-4f2c-b5ce-7fdd0e4fb528	VENTAS MOSTRADOR / BOLETAS DNI	00000000	\N	OP-20260817-02	CREMA MUSC AUT	660.00	0.00	Contado	0	2026-08-18 00:00:00	2026-08-18 00:00:00	2026-08-18 00:00:00	PAGADO	Deposito en cuenta	Interbank	2026-09-02 14:06:35.052	2026-09-04 15:33:57.278
0e684d60-2774-4d59-a514-0c5797d70cbc	EB01-122	a823d8c0-4727-4f2c-b5ce-7fdd0e4fb528	VENTAS MOSTRADOR / BOLETAS DNI	00000000	\N	OP-20260817-02	CREMA MUSC AUT	605.00	0.00	Contado	0	2026-08-18 00:00:00	2026-08-18 00:00:00	2026-08-18 00:00:00	PAGADO	Deposito en cuenta	Interbank	2026-09-02 14:06:35.049	2026-09-04 15:33:57.283
6f0fcb6d-7b62-49d4-a6f4-6edef957c3d5	EB01-123	a823d8c0-4727-4f2c-b5ce-7fdd0e4fb528	VENTAS MOSTRADOR / BOLETAS DNI	00000000	\N	OP-20260817-02	CREMA MUSC AUT	660.00	0.00	Contado	0	2026-08-18 00:00:00	2026-08-18 00:00:00	2026-08-18 00:00:00	PAGADO	Deposito en cuenta	Interbank	2026-09-02 14:06:35.084	2026-09-04 15:33:57.287
f9c58e37-668e-4146-9d2c-d3f2acdbf3e8	EB01-124	a823d8c0-4727-4f2c-b5ce-7fdd0e4fb528	VENTAS MOSTRADOR / BOLETAS DNI	00000000	\N	OP-20260817-02	CREMA MUSC AUT	660.00	0.00	Contado	0	2026-08-18 00:00:00	2026-08-18 00:00:00	2026-08-18 00:00:00	PAGADO	Deposito en cuenta	Interbank	2026-09-02 14:06:35.081	2026-09-04 15:33:57.291
ee214999-8a10-4012-852f-6e724846dd1e	EB01-125	a823d8c0-4727-4f2c-b5ce-7fdd0e4fb528	VENTAS MOSTRADOR / BOLETAS DNI	00000000	\N	OP-20260817-02	CREMA MUSC AUT	660.00	0.00	Contado	0	2026-08-18 00:00:00	2026-08-18 00:00:00	2026-08-18 00:00:00	PAGADO	Deposito en cuenta	Interbank	2026-09-02 14:06:35.078	2026-09-04 15:33:57.296
1ac98465-3995-4f4f-9691-4fc21eadfa12	EB01-126	a823d8c0-4727-4f2c-b5ce-7fdd0e4fb528	VENTAS MOSTRADOR / BOLETAS DNI	00000000	\N	OP-20260817-02	CREMA MUSC AUT	330.00	0.00	Contado	0	2026-08-18 00:00:00	2026-08-18 00:00:00	2026-08-18 00:00:00	PAGADO	Deposito en cuenta	Interbank	2026-09-02 14:06:35.076	2026-09-04 15:33:57.3
3f87f6c2-db7d-485b-9781-524a31d85b3b	EB01-127	750ba4ab-b91b-49ba-a791-821752f7017a	RENZO ADRIAN AVILA GUTIERREZ	72768719	\N	OP-20260818-03	GEL CSM INT. AUTOM	174.00	0.00	Contado	0	2026-08-18 00:00:00	2026-08-18 00:00:00	2026-08-18 00:00:00	PAGADO	Deposito en cuenta	Interbank	2026-09-02 14:06:35.061	2026-09-04 15:33:57.304
51505689-224a-4a44-bc33-ec29e317be57	E001-214	ae6b7139-1b14-4b8d-8752-1eb9812b7211	ALFALION INVESTMENT S.A.C.	20612434124	\N	OP-20260819-03, OP-20260819-04	ACEITE CRP AUT / SPR ANT DE AUTOMOTRIZ	1914.00	0.00	Contado	0	2026-08-19 00:00:00	2026-08-19 00:00:00	2026-08-19 00:00:00	PAGADO	Deposito en cuenta	Interbank	2026-09-02 14:06:35.04	2026-09-04 15:33:57.308
f7c9fee9-e071-47be-8a25-150cc07c7ef9	E001-215	65755eba-be76-4948-8764-1d86cca32905	STARHOME PERU S.A.C.	20612436062	\N	OP-20260818-01	DIAMANTEX	2530.00	2530.00	Credito 15 dias	15	2026-08-19 00:00:00	2026-08-26 00:00:00	\N	PENDIENTE	\N	\N	2026-09-02 14:06:35.043	2026-09-04 15:33:57.312
70586695-a402-4675-8be9-322ca0763900	EB01-128	a2d4abc0-5c0a-4f6a-ada6-41f4266d4e7c	RORY ALFREDO SERPA FLORES	48558440	\N	OP-20260819-05	GEL RTD AUT / BALDE DE 20 KG	384.00	0.00	Contado	0	2026-08-19 00:00:00	2026-08-19 00:00:00	2026-08-19 00:00:00	PAGADO	Deposito en cuenta	Interbank	2026-09-02 14:06:35.046	2026-09-04 15:33:57.314
ef0bd167-f538-4124-8e39-ffd4199b3bba	E001-216	4cf61e66-b049-4e9a-a942-ccc5e781a6b8	FENIX G EXPRESS S.A.C.	20613316184	\N	OP-20260819-01	JBON LIQ TBNF AUTOM	4950.00	4950.00	Credito 07 dias	7	2026-08-20 00:00:00	2026-08-27 00:00:00	\N	PENDIENTE	\N	\N	2026-09-02 14:06:35.037	2026-09-04 15:33:57.319
f8cf71f1-b56d-4485-a3d2-2bd8a48d93fb	E001-206	ba6d7134-92a2-4570-8539-80b8208992a3	GARB CORP PERU S.A.C.	20613225995	\N	OP-20260813-05	CREAM HDT CRO	9000.00	9000.00	Credito 07 dias	7	2026-08-14 00:00:00	2026-08-21 00:00:00	\N	PENDIENTE	\N	\N	2026-09-02 14:06:35.099	2026-09-04 15:33:57.229
47f63e03-6368-43b5-8098-f08940aefcba	E001-207	ae6b7139-1b14-4b8d-8752-1eb9812b7211	ALFALION INVESTMENT S.A.C.	20612434124	\N	OP-20260813-08	PARFUM AROM AUTOMOT	1890.00	0.00	Contado	0	2026-08-14 00:00:00	2026-08-14 00:00:00	2026-08-14 00:00:00	PAGADO	Deposito en cuenta	Interbank	2026-09-02 14:06:35.097	2026-09-04 15:33:57.231
d86634e2-ce01-42b3-816b-df0a88cfcaf5	EB01-108	23d7f5d1-d0fa-48f7-95d8-09985dcf3e42	JHON ROBERT CCANTO PEREZ	73940637	\N	OP-20260814-02	CREAM ART AUT	2100.00	2100.00	Credito 20 días	20	2026-08-15 00:00:00	2026-08-22 00:00:00	\N	PENDIENTE	\N	\N	2026-09-02 14:06:35.094	2026-09-04 15:33:57.243
0dc3f70c-b6e5-4e8f-8191-3b174167d137	EB01-109	a64e74e1-bf12-4109-b6ca-f62948dc4911	JUAN PABLO CASSANA RAMON	42816216	\N	OP-20260811-03	PARFUM FRM AMT LUCKY	240.00	0.00	Contado	0	2026-08-17 00:00:00	2026-08-17 00:00:00	2026-08-17 00:00:00	PAGADO	Deposito en cuenta	Interbank	2026-09-02 14:06:35.088	2026-09-04 15:33:57.245
66cc58b3-8c97-414d-9172-778d6bdfcd73	EB01-118	a823d8c0-4727-4f2c-b5ce-7fdd0e4fb528	VENTAS MOSTRADOR / BOLETAS DNI	00000000	\N	OP-20260817-02	CREMA MUSC AUT	660.00	0.00	Contado	0	2026-08-18 00:00:00	2026-08-18 00:00:00	2026-08-18 00:00:00	PAGADO	Deposito en cuenta	Interbank	2026-09-02 14:06:35.086	2026-09-04 15:33:57.264
ee7464e7-c42d-418a-8667-b93dcf782235	E001-208	ae6b7139-1b14-4b8d-8752-1eb9812b7211	ALFALION INVESTMENT S.A.C.	20612434124	\N	OP-20260814-01	CREAM BLOQ ABRILL AUT	2345.00	0.00	Contado	0	2026-08-14 00:00:00	2026-08-14 00:00:00	2026-08-14 00:00:00	PAGADO	Deposito en cuenta	Interbank	2026-09-02 14:06:35.101	2026-09-04 15:33:57.236
52fe6e51-1864-4e83-9861-8fc8fb770776	E001-185	ba6d7134-92a2-4570-8539-80b8208992a3	GARB CORP PERU S.A.C.	20613225995	\N	OP-20260710-03	CREAM HDT CRO	10172.50	10172.50	Contado	0	2026-08-05 00:00:00	2026-08-05 00:00:00	\N	PENDIENTE	\N	\N	2026-09-02 14:06:35.176	2026-09-04 15:33:57.134
c8e861ff-7259-48f0-a9b0-a62e1294d659	E001-186	1d4c93a7-c5e1-4dfa-9e73-6e36fdee7800	GRUPO DEUS S.A.C.	20612838489	\N	OP-20260801-01	CREAM MUSC MG AUT	3000.00	0.00	Contado	0	2026-08-07 00:00:00	2026-08-07 00:00:00	2026-07-31 00:00:00	PAGADO	Deposito en cuenta	Interbank	2026-09-02 14:06:35.17	2026-09-04 15:33:57.136
2f47f75d-d2ee-40ad-aed5-ef7d1f5dfbb4	E001-188	2a553b92-34fb-4629-bd85-0ca70ff03143	GARABITO SAMANIEGO JONATAN MARTIN	10751305511	\N	OP-20260804-04	CREAM HDT CRO	9000.00	9000.00	Credito 07 dias	7	2026-08-07 00:00:00	2026-08-14 00:00:00	\N	PENDIENTE	\N	\N	2026-09-02 14:06:35.168	2026-09-04 15:33:57.141
7f9410db-9fc5-415e-8045-74c54aa9781d	E001-189	1d4c93a7-c5e1-4dfa-9e73-6e36fdee7800	GRUPO DEUS S.A.C.	20612838489	\N	OP-20260807-01, OP-20260807-02	CREAM VRC AUT / CREAM MUSC AUT	11800.00	0.00	Contado	0	2026-08-07 00:00:00	2026-08-07 00:00:00	2026-08-05 00:00:00	PAGADO	Deposito en cuenta	Interbank	2026-09-02 14:06:35.154	2026-09-04 15:33:57.143
d4b758a6-cebe-464b-a391-60e74784b834	E001-190	ae6b7139-1b14-4b8d-8752-1eb9812b7211	ALFALION INVESTMENT S.A.C.	20612434124	\N	OP-20260807-03	CREAM LBS CUERO	1700.00	0.00	Contado	0	2026-08-07 00:00:00	2026-08-07 00:00:00	2026-08-07 00:00:00	PAGADO	Deposito en cuenta	Interbank	2026-09-02 14:06:35.165	2026-09-04 15:33:57.146
f1c3673c-f8cd-4888-a84c-04c76fd7a84c	E001-191	14ef77f4-4829-4e5a-9f90-9560d51a947b	IMPORT MERAKI HOGAR S.A.C.	20614181444	\N	OP-20260807-05	DESOD CREAM AUT	150.00	0.00	Contado	0	2026-08-07 00:00:00	2026-08-07 00:00:00	2026-08-07 00:00:00	PAGADO	Deposito en cuenta	Interbank	2026-09-02 14:06:35.163	2026-09-04 15:33:57.151
c277c4e0-5fe7-418b-9ed9-d0fb323521d3	EB01-102	152c3943-b0fa-41d1-bce5-b7511d660dc4	DAVID JUNIOR SARMIENTO CARDENAS	77231684	\N	OP-20260805-01	GEL MUSC AUT	1302.00	0.00	Contado	0	2026-08-07 00:00:00	2026-08-07 00:00:00	2026-08-04 00:00:00	PAGADO	Deposito en cuenta	Interbank	2026-09-02 14:06:35.16	2026-09-04 15:33:57.155
06251866-63c1-46be-be48-8bee22534d6e	EB01-103	e8c10f2c-6357-4c61-8153-790e7b8a6966	RENZO MARCELO SALSAVILCA ESTRADA	70042804	\N	OP0008	CREAM NEUR AUT	2350.00	0.00	Contado	0	2026-08-07 00:00:00	2026-08-07 00:00:00	2026-08-05 00:00:00	PAGADO	Deposito en cuenta	Interbank	2026-09-02 14:06:35.157	2026-09-04 15:33:57.158
f5785be2-e298-4ca9-9a23-53d0ca201a6a	E001-192	ae6b7139-1b14-4b8d-8752-1eb9812b7211	ALFALION INVESTMENT S.A.C.	20612434124	\N	2026-08-14	SRM VRR OP MEUM	1350.00	0.00	Contado	0	2026-08-08 00:00:00	2026-08-08 00:00:00	2026-08-07 00:00:00	PAGADO	Deposito en cuenta	Interbank	2026-09-02 14:06:35.151	2026-09-04 15:33:57.162
cef5c4b0-5279-430c-9c08-37e72c61388e	E001-193	ae6b7139-1b14-4b8d-8752-1eb9812b7211	ALFALION INVESTMENT S.A.C.	20612434124	\N	OP-20260810-03	IMPERMEABILIZANTE	1650.00	0.00	Contado	0	2026-08-10 00:00:00	2026-08-10 00:00:00	2026-08-10 00:00:00	PAGADO	Deposito en cuenta	Interbank	2026-09-02 14:06:35.141	2026-09-04 15:33:57.167
21f995ad-10a1-4de6-b0ad-d9bb8bf5a4f6	E001-194	ae6b7139-1b14-4b8d-8752-1eb9812b7211	ALFALION INVESTMENT S.A.C.	20612434124	\N	OP-20260810-04	ANTI BAC SPR HONGOS	1170.00	0.00	Contado	0	2026-08-10 00:00:00	2026-08-10 00:00:00	2026-08-10 00:00:00	PAGADO	Deposito en cuenta	Interbank	2026-09-02 14:06:35.148	2026-09-04 15:33:57.171
d8202da4-0691-4143-a3f9-ce3e1fa2ceac	EB01-104	152c3943-b0fa-41d1-bce5-b7511d660dc4	DAVID JUNIOR SARMIENTO CARDENAS	77231684	\N	OP-20260811-01, OP-20260811-02	GEL MUSC AUT / ANTI BAC SPR HONGOS	1934.00	0.00	Contado	0	2026-08-10 00:00:00	2026-08-10 00:00:00	2026-08-10 00:00:00	PAGADO	Deposito en cuenta	Interbank	2026-09-02 14:06:35.138	2026-09-04 15:33:57.175
d661dfbf-3ad2-461f-9bdd-b99b64047c20	EB01-105	a2d4abc0-5c0a-4f6a-ada6-41f4266d4e7c	RORY ALFREDO SERPA FLORES	48558440	\N	OP-20260808-01	AUT DRM BEE	1875.00	0.00	Contado	0	2026-08-10 00:00:00	2026-08-10 00:00:00	2026-08-10 00:00:00	PAGADO	Deposito en cuenta	Interbank	2026-09-02 14:06:35.145	2026-09-04 15:33:57.178
dc7e265a-710a-4165-9326-fa6bac576756	E001-195	ffb82269-bc8f-4d30-9938-c1ae9d346dd3	CARLA PATRICIA RIVERA RAMOS	10711935725	\N	OP-20260811-04	SRM PES BIO / BALDE DE 20 KG	374.00	0.00	Contado	0	2026-08-11 00:00:00	2026-08-11 00:00:00	2026-08-11 00:00:00	PAGADO	Deposito en cuenta	Interbank	2026-09-02 14:06:35.125	2026-09-04 15:33:57.182
2f752cc1-d34b-4a03-b8a5-ae15fdf4d9cc	EB01-106	152c3943-b0fa-41d1-bce5-b7511d660dc4	DAVID JUNIOR SARMIENTO CARDENAS	77231684	\N	OP-20260811-09	ANTI BAC SPR HONGOS	184.00	0.00	Contado	0	2026-08-11 00:00:00	2026-08-11 00:00:00	2026-08-11 00:00:00	PAGADO	Deposito en cuenta	Interbank	2026-09-02 14:06:35.135	2026-09-04 15:33:57.19
27526a24-fac3-4d10-b0b0-1bd319d0334a	E001-197	ae6b7139-1b14-4b8d-8752-1eb9812b7211	ALFALION INVESTMENT S.A.C.	20612434124	\N	OP-20260811-11	SRM RENOV CRO / BALDE DE 20 KG	384.00	0.00	Contado	0	2026-08-11 00:00:00	2026-08-11 00:00:00	2026-08-11 00:00:00	PAGADO	Deposito en cuenta	Interbank	2026-09-02 14:06:35.131	2026-09-04 15:33:57.194
481604c9-f93d-4a5c-9b1a-d3055eac317e	E001-198	ae6b7139-1b14-4b8d-8752-1eb9812b7211	ALFALION INVESTMENT S.A.C.	20612434124	\N	OP-20260811-10	LCN TOP CREAM AUTOM	1640.00	0.00	Contado	0	2026-08-11 00:00:00	2026-08-11 00:00:00	2026-08-11 00:00:00	PAGADO	Deposito en cuenta	Interbank	2026-09-02 14:06:35.128	2026-09-04 15:33:57.197
6df925b4-af25-4661-8b27-99f44e92258c	E001-199	ba6d7134-92a2-4570-8539-80b8208992a3	GARB CORP PERU S.A.C.	20613225995	\N	OP-20260810-02	CRM MNDX AUT	6600.00	6600.00	Credito 07 dias	7	2026-08-12 00:00:00	2026-08-19 00:00:00	\N	PENDIENTE	\N	\N	2026-09-02 14:06:35.112	2026-09-04 15:33:57.203
41a3c1da-7b6f-4ec7-b1e2-d0a9b778cab9	E001-200	4cf61e66-b049-4e9a-a942-ccc5e781a6b8	FENIX G EXPRESS S.A.C.	20613316184	\N	OP-20260812-02	CRM BEE AUT	5700.00	5700.00	Credito 07 dias	7	2026-08-12 00:00:00	2026-08-19 00:00:00	\N	PENDIENTE	\N	\N	2026-09-02 14:06:35.115	2026-09-04 15:33:57.206
07709ace-3a14-4532-b19d-c96255e8dc82	E001-201	1d4c93a7-c5e1-4dfa-9e73-6e36fdee7800	GRUPO DEUS S.A.C.	20612838489	\N	OP-20260813-01	CREAM MUSC	11200.00	0.00	Contado	0	2026-08-12 00:00:00	2026-08-12 00:00:00	2026-08-12 00:00:00	PAGADO	Deposito en cuenta	Interbank	2026-09-02 14:06:35.117	2026-09-04 15:33:57.208
68b62188-d84a-4e16-b3a8-0457afa3f20f	E001-202	1d4c93a7-c5e1-4dfa-9e73-6e36fdee7800	GRUPO DEUS S.A.C.	20612838489	\N	OP-20260813-02	CREAM MUSC MG AUT	3000.00	0.00	Contado	0	2026-08-12 00:00:00	2026-08-12 00:00:00	2026-08-12 00:00:00	PAGADO	Deposito en cuenta	Interbank	2026-09-02 14:06:35.119	2026-09-04 15:33:57.212
2c130e55-f2b1-4c27-9ee6-27ea60ceb497	E001-203	14ef77f4-4829-4e5a-9f90-9560d51a947b	IMPORT MERAKI HOGAR S.A.C.	20614181444	\N	OP-20260812-01	DESOD SPRY CHL AUT	8400.00	0.00	Contado	0	2026-08-12 00:00:00	2026-08-12 00:00:00	2026-08-12 00:00:00	PAGADO	Deposito en cuenta	Interbank	2026-09-02 14:06:35.122	2026-09-04 15:33:57.215
0885f736-32f4-4b03-8ee4-b1e599a7b99a	EB01-107	23d7f5d1-d0fa-48f7-95d8-09985dcf3e42	JHON ROBERT CCANTO PEREZ	73940637	\N	OP-20260811-06, OP-20260811-05, OP-20260811-07	CREAM TENS A.H. AUT / CREAM HMRR AUT / GEL MUS AUT	7799.00	7799.00	Credito 20 días	20	2026-08-12 00:00:00	2026-08-19 00:00:00	\N	PENDIENTE	\N	\N	2026-09-02 14:06:35.11	2026-09-04 15:33:57.22
da2e1be6-4f04-48fb-bdf7-3f6ae2622ad3	E001-204	14ef77f4-4829-4e5a-9f90-9560d51a947b	IMPORT MERAKI HOGAR S.A.C.	20614181444	\N	OP-20260813-07	DESOD SPRY AUT	800.00	0.00	Contado	0	2026-08-13 00:00:00	2026-08-13 00:00:00	2026-08-13 00:00:00	PAGADO	Deposito en cuenta	Interbank	2026-09-02 14:06:35.107	2026-09-04 15:33:57.222
1ad167c6-3082-47ec-9258-cb3b6e4b734f	E001-183	14ef77f4-4829-4e5a-9f90-9560d51a947b	IMPORT MERAKI HOGAR S.A.C.	20614181444	\N	OP-20260804-01, OP-20260804-02	DESOD SPRY CHL AUT / DESOD SPRY AUT	5000.00	0.00	Contado	0	2026-08-04 00:00:00	2026-08-04 00:00:00	2026-08-04 00:00:00	PAGADO	Deposito en cuenta	Interbank	2026-09-02 14:06:35.181	2026-09-04 15:33:57.121
44933b45-914f-4d66-a53f-55f0070a493d	E001-184	4cf61e66-b049-4e9a-a942-ccc5e781a6b8	FENIX G EXPRESS S.A.C.	20613316184	\N	OP-20260803-04, OP-20260803-05	SPRY VRR MEUM / ANTI BAC SPR HONGOS	1325.00	0.00	Credito 07 dias	7	2026-08-05 00:00:00	2026-08-12 00:00:00	2026-08-07 00:00:00	PAGADO	Deposito en cuenta	Interbank	2026-09-02 14:06:35.173	2026-09-04 15:33:57.129
cb1c8fae-3b69-403e-8679-da21e75a04b8	E001-180	ae6b7139-1b14-4b8d-8752-1eb9812b7211	ALFALION INVESTMENT S.A.C.	20612434124	\N	OP-20260803-01	SRM PPT PROP AUT	1386.00	0.00	Contado	0	2026-08-03 00:00:00	2026-08-03 00:00:00	2026-08-03 00:00:00	PAGADO	Deposito en cuenta	Interbank	2026-09-02 14:06:35.187	2026-09-04 15:33:57.098
ba26cd78-2fc5-48eb-a6d5-76348c8bb377	E001-181	a5a2423e-1c0f-4545-8121-1853976d8fb7	NEXARA CORP S.A.C.	20615778207	\N	OP-20260803-06	SRM ALO AUTOM	247.80	0.00	Contado	0	2026-08-03 00:00:00	2026-08-03 00:00:00	2026-08-03 00:00:00	PAGADO	Deposito en cuenta	Interbank	2026-09-02 14:06:35.19	2026-09-04 15:33:57.106
fa7f906c-80c4-411e-9ad0-6cdea48e21fe	EB01-100	a2d4abc0-5c0a-4f6a-ada6-41f4266d4e7c	RORY ALFREDO SERPA FLORES	48558440	\N	OP-20260803-03	PARFUM FRM AMT LUCKY	1350.00	0.00	Contado	0	2026-08-03 00:00:00	2026-08-03 00:00:00	2026-08-03 00:00:00	PAGADO	Deposito en cuenta	Interbank	2026-09-02 14:06:35.193	2026-09-04 15:33:57.111
3678650f-a343-4086-bad8-b00afa41e107	E001-182	ae6b7139-1b14-4b8d-8752-1eb9812b7211	ALFALION INVESTMENT S.A.C.	20612434124	\N	OP-20260804-03	CREMA ACLD AUT	624.00	0.00	Contado	0	2026-08-04 00:00:00	2026-08-04 00:00:00	2026-08-04 00:00:00	PAGADO	Deposito en cuenta	Interbank	2026-09-02 14:06:35.179	2026-09-04 15:33:57.116
67c3d636-0482-4cfb-9142-cfd515a31c77	EB01-101	82a76af1-11b4-461b-941e-8f28ec07a5f8	JHON ERIC AVILA RAMIREZ	75129824	\N	OP-20260803-02	LIQ RTD AUT	750.00	0.00	Contado	0	2026-08-04 00:00:00	2026-08-04 00:00:00	2026-08-04 00:00:00	PAGADO	Deposito en cuenta	Interbank	2026-09-02 14:06:35.184	2026-09-04 15:33:57.125
ffd2d0c9-1c49-4edb-b2f5-1336b760db3c	E001-196	1d4c93a7-c5e1-4dfa-9e73-6e36fdee7800	GRUPO DEUS S.A.C.	20612838489	\N	OP-20260811-08	CREAM MUSC MG AUT	3000.00	0.00	Contado	0	2026-08-11 00:00:00	2026-08-11 00:00:00	2026-08-11 00:00:00	PAGADO	Deposito en cuenta	Interbank	2026-09-02 14:06:35.133	2026-09-04 15:33:57.186
f2ec2913-fafd-4689-8a1f-ff5179842ea0	E001-205	ae6b7139-1b14-4b8d-8752-1eb9812b7211	ALFALION INVESTMENT S.A.C.	20612434124	\N	OP-20260813-03	PARFUM FRM AMT LUCKY	1100.00	0.00	Contado	0	2026-08-13 00:00:00	2026-08-13 00:00:00	2026-08-13 00:00:00	PAGADO	Deposito en cuenta	Interbank	2026-09-02 14:06:35.104	2026-09-04 15:33:57.226
61f0e790-6161-4df1-95f9-99d3c797e193	EB01-120	a823d8c0-4727-4f2c-b5ce-7fdd0e4fb528	VENTAS MOSTRADOR / BOLETAS DNI	00000000	\N	OP-20260817-02	CREMA MUSC AUT	660.00	0.00	Contado	0	2026-08-18 00:00:00	2026-08-18 00:00:00	2026-08-18 00:00:00	PAGADO	Deposito en cuenta	Interbank	2026-09-02 14:06:35.055	2026-09-04 15:33:57.273
c7623313-5ede-413c-a99f-62f86a8c3874	E001-217	cb5a0ac6-8e6e-4123-b996-0c51e3700682	MULTIPLAZA PERU S.A.C.	20611510315	\N		SHAMP CREC AUT / VARONEX ART	9567.02	0.00	Credito 60 días	0	2026-08-20 00:00:00	2026-08-27 00:00:00	2026-08-20 00:00:00	PAGADO	Deposito en cuenta	Interbank	2026-09-04 13:33:53.852	2026-09-04 15:33:57.321
4de988ee-c315-4658-8176-541599f63348	E001-218	ae6b7139-1b14-4b8d-8752-1eb9812b7211	ALFALION INVESTMENT S.A.C.	20612434124	\N	OP-20260821-01		324.00	0.00	Contado	0	2026-08-21 00:00:00	2026-08-21 00:00:00	2026-08-21 00:00:00	PAGADO	Deposito en cuenta	Interbank	2026-09-04 13:33:53.856	2026-09-04 15:33:57.325
e8537c19-a374-4a79-baef-4827be29b212	E001-219	ae6b7139-1b14-4b8d-8752-1eb9812b7211	ALFALION INVESTMENT S.A.C.	20612434124	\N	OP-20260822-02		1260.00	0.00	Contado	0	2026-08-22 00:00:00	2026-08-22 00:00:00	2026-08-22 00:00:00	PAGADO	Deposito en cuenta	Interbank	2026-09-04 13:33:53.859	2026-09-04 15:33:57.328
be04b264-f18d-433e-bd3c-625868c9552e	E001-220	ae6b7139-1b14-4b8d-8752-1eb9812b7211	ALFALION INVESTMENT S.A.C.	20612434124	\N	OP-20260822-03		204.00	0.00	Contado	0	2026-08-22 00:00:00	2026-08-22 00:00:00	2026-08-22 00:00:00	PAGADO	Deposito en cuenta	Interbank	2026-09-04 13:33:53.862	2026-09-04 15:33:57.332
\.


--
-- Data for Name: etiquetas_impresas; Type: TABLE DATA; Schema: public; Owner: quimicorp
--

COPY public.etiquetas_impresas (id, "codigoEtiqueta", "loteProduccionId", "tipoEtiqueta", "impresoPorId", "timestamp") FROM stdin;
\.


--
-- Data for Name: familias_insumo; Type: TABLE DATA; Schema: public; Owner: quimicorp
--

COPY public.familias_insumo (id, nombre, descripcion, "createdAt", "updatedAt") FROM stdin;
e7ad66ee-0383-41bb-b71e-6c7a98a72b8e	MATERIAS PRIMAS FORMULACIÓN	Materias primas principales para formulación química	2026-09-02 14:07:46.517	2026-09-02 14:07:46.517
4fe85d88-3899-4cf2-b739-972e941f3379	MATERIA_PRIMA_BASE	Materia Prima Base e Insumos Principales	2026-09-02 14:07:46.517	2026-09-02 14:07:46.517
074d0183-07b8-4990-8831-099afe6e58e7	FRAGANCIAS_Y_ACEITES	Fragancias, Esencias y Aceites Esenciales	2026-09-02 14:07:46.517	2026-09-02 14:07:46.517
c3b864c3-585c-403e-b7b7-b0392e7d7b46	PIGMENTOS_Y_COLORANTES	Pigmentos, Colorantes y Anilinas	2026-09-02 14:07:46.517	2026-09-02 14:07:46.517
762b11c4-ec62-4e9a-862a-57edcb227583	ADITIVOS_Y_AUXILIARES	Extractos, Saborizantes y Aditivos Auxiliares	2026-09-02 14:07:46.517	2026-09-02 14:07:46.517
\.


--
-- Data for Name: formula_detalles; Type: TABLE DATA; Schema: public; Owner: quimicorp
--

COPY public.formula_detalles (id, "formulaId", "insumoId", "nombreComponente", "skuComponente", porcentaje, "pesoMasaTeorico", "createdAt", "updatedAt") FROM stdin;
bf2fa660-3fe2-4da9-b77d-3889ad6a0f07	82f2e66d-a61d-44ae-9121-4b79ed9cb59a	\N	AGUA DESIONIZADA	QC-SER-001	86.000	860.0000	2026-09-02 14:06:13.42	2026-09-02 14:06:13.42
e9159201-28a5-4093-9663-47b69c10ca8b	82f2e66d-a61d-44ae-9121-4b79ed9cb59a	\N	GLICERINA VEGETAL	QC-SER-002	4.000	40.0000	2026-09-02 14:06:13.424	2026-09-02 14:06:13.424
1c74094e-81da-4df9-8038-07d945983a73	82f2e66d-a61d-44ae-9121-4b79ed9cb59a	\N	NIACINAMIDA	QC-SER-003	4.000	40.0000	2026-09-02 14:06:13.426	2026-09-02 14:06:13.426
f8f2ec94-949c-4b18-b439-ac48a789fc91	82f2e66d-a61d-44ae-9121-4b79ed9cb59a	\N	PROPILENGLICOL	QC-SER-004	3.000	30.0000	2026-09-02 14:06:13.429	2026-09-02 14:06:13.429
0004bdbd-6d0a-46bf-b813-8e1b74a12c6a	82f2e66d-a61d-44ae-9121-4b79ed9cb59a	\N	CAFEINA	QC-SER-005	0.500	5.0000	2026-09-02 14:06:13.431	2026-09-02 14:06:13.431
e38e526f-4cc7-4912-84c8-418f456e5108	82f2e66d-a61d-44ae-9121-4b79ed9cb59a	\N	ACIDO HIALURONICO	QC-SER-006	0.200	2.0000	2026-09-02 14:06:13.434	2026-09-02 14:06:13.434
bc618607-c6a5-4c2b-bd67-761343a3f34d	82f2e66d-a61d-44ae-9121-4b79ed9cb59a	\N	CELLOSIZE	QC-SER-007	0.800	8.0000	2026-09-02 14:06:13.437	2026-09-02 14:06:13.437
67b508ee-3156-47bd-9fcf-f406e97e8025	82f2e66d-a61d-44ae-9121-4b79ed9cb59a	\N	PROCIDE CG (CONSERVANTE)	QC-SER-008	0.800	8.0000	2026-09-02 14:06:13.439	2026-09-02 14:06:13.439
45e3e035-e520-4efa-9203-f25343686b5f	82f2e66d-a61d-44ae-9121-4b79ed9cb59a	\N	COLAGENO HIDROLIZADO	QC-SER-009	0.700	7.0000	2026-09-02 14:06:13.442	2026-09-02 14:06:13.442
89184adc-86c5-4f32-986a-3bcbdcf7535c	7c2fdff6-a4f9-4c6f-8489-60cfb912bf2f	\N	AGUA DESIONIZADA	QC-SER-001	88.570	889.0000	2026-09-02 14:06:13.455	2026-09-02 14:06:13.455
5ca54513-28ca-4e94-8839-d1c0aee0676b	7c2fdff6-a4f9-4c6f-8489-60cfb912bf2f	\N	GLICERINA VEGETAL	QC-SER-002	4.980	50.0000	2026-09-02 14:06:13.457	2026-09-02 14:06:13.457
9a16cc16-85f9-4f71-a4f1-dfeaa5828465	7c2fdff6-a4f9-4c6f-8489-60cfb912bf2f	\N	PROPILENGLICOL	QC-SER-003	2.990	30.0000	2026-09-02 14:06:13.46	2026-09-02 14:06:13.46
fc560df2-694a-41d4-8f57-efd4f035f3ce	7c2fdff6-a4f9-4c6f-8489-60cfb912bf2f	\N	PANTENOL (VITAMINA B5)	QC-SER-004	0.100	1.0000	2026-09-02 14:06:13.462	2026-09-02 14:06:13.462
2fa3d00a-74ad-4514-9f5a-9d93cdb85bd9	7c2fdff6-a4f9-4c6f-8489-60cfb912bf2f	\N	EXTRACTO DE ALOE VERA	QC-SER-005	1.000	10.0000	2026-09-02 14:06:13.464	2026-09-02 14:06:13.464
90bd3114-cf37-4c12-9d24-654c309c2bd2	7c2fdff6-a4f9-4c6f-8489-60cfb912bf2f	\N	NIACINAMIDA	QC-SER-006	0.100	1.0000	2026-09-02 14:06:13.468	2026-09-02 14:06:13.468
ced2f8fb-169e-4569-bf8e-bca957e4feba	7c2fdff6-a4f9-4c6f-8489-60cfb912bf2f	\N	CELLOSIZE	QC-SER-007	1.100	11.0000	2026-09-02 14:06:13.469	2026-09-02 14:06:13.469
2c38e4e7-cba0-45e3-ae12-7b3a8851d0b6	7c2fdff6-a4f9-4c6f-8489-60cfb912bf2f	\N	TRIETANOLAMINA	QC-SER-008	1.000	10.0000	2026-09-02 14:06:13.471	2026-09-02 14:06:13.471
ee258575-d96a-423c-beb2-098e11e962f5	7c2fdff6-a4f9-4c6f-8489-60cfb912bf2f	\N	FRAGANCIA	QC-SER-009	0.020	0.2000	2026-09-02 14:06:13.474	2026-09-02 14:06:13.474
9f749693-6bf0-4e5b-8e8c-5385e776d06e	7c2fdff6-a4f9-4c6f-8489-60cfb912bf2f	\N	BENZOATO DE SODIO	QC-SER-010	0.100	1.0000	2026-09-02 14:06:13.476	2026-09-02 14:06:13.476
2843aa83-1211-4400-8ecf-0bf0807cfa5a	7c2fdff6-a4f9-4c6f-8489-60cfb912bf2f	\N	SORBATO DE POTASIO	QC-SER-011	0.050	0.5000	2026-09-02 14:06:13.478	2026-09-02 14:06:13.478
5bc5342f-5442-4d00-afa8-ce1a2b8d6b8f	8afd746d-1947-4852-89ec-4d14cd6880e6	\N	AGUA DESIONIZADA	QC-SER-001	89.440	894.0000	2026-09-02 14:06:13.485	2026-09-02 14:06:13.485
ae2b9379-026a-4142-a82e-6b4eba1b2672	8afd746d-1947-4852-89ec-4d14cd6880e6	\N	CELLOSIZE	QC-SER-002	0.800	8.0000	2026-09-02 14:06:13.488	2026-09-02 14:06:13.488
0839c53e-1242-4d12-bbee-78c1dfbd93a9	8afd746d-1947-4852-89ec-4d14cd6880e6	\N	PROPILENGLICOL	QC-SER-003	5.000	50.0000	2026-09-02 14:06:13.49	2026-09-02 14:06:13.49
9fba7e01-c2f0-44c4-b30f-97ed46656998	8afd746d-1947-4852-89ec-4d14cd6880e6	\N	CAFEINA	QC-SER-004	3.000	30.0000	2026-09-02 14:06:13.492	2026-09-02 14:06:13.492
fdf844f9-ecb2-4088-b075-b7be0a1c87af	8afd746d-1947-4852-89ec-4d14cd6880e6	\N	COLAGENO HIDROLIZADO	QC-SER-005	1.000	10.0000	2026-09-02 14:06:13.495	2026-09-02 14:06:13.495
4dcdb63f-a9a4-4680-b5f0-c7fbfaa441f4	8afd746d-1947-4852-89ec-4d14cd6880e6	\N	ACIDO ASCORBICO	QC-SER-006	0.500	5.0000	2026-09-02 14:06:13.497	2026-09-02 14:06:13.497
c79fa0cd-c403-43d5-a225-966c8f96f8a7	8afd746d-1947-4852-89ec-4d14cd6880e6	\N	MENTOL EN CRISTALES	QC-SER-007	0.100	1.0000	2026-09-02 14:06:13.499	2026-09-02 14:06:13.499
31f69afb-8a95-4826-aa7a-52040f25e36f	8afd746d-1947-4852-89ec-4d14cd6880e6	\N	BENZOATO DE SODIO	QC-SER-008	0.100	1.0000	2026-09-02 14:06:13.502	2026-09-02 14:06:13.502
867ac114-2d46-456d-abe4-3b556978015b	8afd746d-1947-4852-89ec-4d14cd6880e6	\N	SORBATO DE POTASIO	QC-SER-009	0.050	0.5000	2026-09-02 14:06:13.504	2026-09-02 14:06:13.504
dae92998-b13e-4a3e-9aed-95687ccfe4bc	26748fef-8be7-4faf-9801-7c2f935b7802	\N	AGUA DESIONIZADA	QC-SER-001	86.300	863.0000	2026-09-02 14:06:13.512	2026-09-02 14:06:13.512
3a6347b5-0248-4239-b35c-b9cb0e194f1a	26748fef-8be7-4faf-9801-7c2f935b7802	\N	GLICERINA	QC-SER-002	4.000	40.0000	2026-09-02 14:06:13.515	2026-09-02 14:06:13.515
a112f769-3d57-40d0-9787-074eee13aa9d	26748fef-8be7-4faf-9801-7c2f935b7802	\N	PROPILENGLICOL	QC-SER-003	3.000	30.0000	2026-09-02 14:06:13.518	2026-09-02 14:06:13.518
3cfae2e0-3788-4a28-ac75-9c203f05a9a5	26748fef-8be7-4faf-9801-7c2f935b7802	\N	UREA	QC-SER-004	2.000	20.0000	2026-09-02 14:06:13.52	2026-09-02 14:06:13.52
31ae6cb1-9c9c-45f6-b3c1-d24744def9e9	26748fef-8be7-4faf-9801-7c2f935b7802	\N	EXTRACTO DE ALOE VERA	QC-SER-005	1.000	10.0000	2026-09-02 14:06:13.523	2026-09-02 14:06:13.523
ba8d66f9-9e5d-4875-a0c3-349046328860	26748fef-8be7-4faf-9801-7c2f935b7802	\N	NIACINAMIDA	QC-SER-006	2.000	20.0000	2026-09-02 14:06:13.525	2026-09-02 14:06:13.525
7f52307e-0ba5-4697-b3c0-32a24b996db1	26748fef-8be7-4faf-9801-7c2f935b7802	\N	PANTENOL	QC-SER-007	0.100	1.0000	2026-09-02 14:06:13.527	2026-09-02 14:06:13.527
22935cfa-ddf6-46a0-8ccb-10d35799e55d	26748fef-8be7-4faf-9801-7c2f935b7802	\N	ALANTOINA	QC-SER-008	0.300	3.0000	2026-09-02 14:06:13.53	2026-09-02 14:06:13.53
7de6da61-6e07-4db6-a4a7-64d5e8a6bf2a	26748fef-8be7-4faf-9801-7c2f935b7802	\N	CELLOSIZE	QC-SER-009	0.800	8.0000	2026-09-02 14:06:13.532	2026-09-02 14:06:13.532
9c68bc53-37c1-42dc-a1b4-d160eaa46d76	26748fef-8be7-4faf-9801-7c2f935b7802	\N	BENZOATO DE SODIO	QC-SER-010	0.100	1.0000	2026-09-02 14:06:13.534	2026-09-02 14:06:13.534
09e14cae-3bf7-4c09-82a6-cf793df9623c	26748fef-8be7-4faf-9801-7c2f935b7802	\N	SORBATO DE POTASIO	QC-SER-011	0.100	1.0000	2026-09-02 14:06:13.537	2026-09-02 14:06:13.537
db7dc423-accf-4a42-9717-2ad937c06920	26748fef-8be7-4faf-9801-7c2f935b7802	\N	ACIDO CITRICO	QC-SER-012	0.100	1.0000	2026-09-02 14:06:13.539	2026-09-02 14:06:13.539
a6d7fae3-cb87-4738-a5f3-5cdf92b6e16f	26748fef-8be7-4faf-9801-7c2f935b7802	\N	ACIDO HIALURONICO	QC-SER-013	0.200	2.0000	2026-09-02 14:06:13.541	2026-09-02 14:06:13.541
2e226ca4-77cb-40c7-a1a3-c48c7e685744	76aa7bc3-917e-41ea-8130-789c6d382d84	\N	AGUA DESIONIZADA	QC-SER-001	90.250	902.5000	2026-09-02 14:06:13.551	2026-09-02 14:06:13.551
e6276edc-4039-482e-a6f6-15782a968db5	76aa7bc3-917e-41ea-8130-789c6d382d84	\N	GLICERINA	QC-SER-002	3.000	30.0000	2026-09-02 14:06:13.553	2026-09-02 14:06:13.553
f4440008-40ba-4d56-bb9a-2a95bcf86983	76aa7bc3-917e-41ea-8130-789c6d382d84	\N	D - PANTENOL	QC-SER-003	0.500	5.0000	2026-09-02 14:06:13.555	2026-09-02 14:06:13.555
0725fd6d-4d94-4aa0-9e1e-4d987c80a9ba	76aa7bc3-917e-41ea-8130-789c6d382d84	\N	COLAGENO HIDROLIZADO	QC-SER-004	0.100	1.0000	2026-09-02 14:06:13.558	2026-09-02 14:06:13.558
ef2ffb16-ca0f-4be9-94e0-a542595f1e76	76aa7bc3-917e-41ea-8130-789c6d382d84	\N	ACIDO HIALURONICO	QC-SER-005	0.150	1.5000	2026-09-02 14:06:13.56	2026-09-02 14:06:13.56
0b1cccf0-aa4b-46b1-9931-97c4036d0112	76aa7bc3-917e-41ea-8130-789c6d382d84	\N	NIACINAMIDA	QC-SER-006	2.000	20.0000	2026-09-02 14:06:13.562	2026-09-02 14:06:13.562
83a04b3a-6f6e-4e17-ab55-acfd91e26b91	76aa7bc3-917e-41ea-8130-789c6d382d84	\N	EXTRACTO DE ALOE VERA	QC-SER-007	2.000	20.0000	2026-09-02 14:06:13.565	2026-09-02 14:06:13.565
c58a8b7b-b073-48db-9c6e-3e8129f8e426	76aa7bc3-917e-41ea-8130-789c6d382d84	\N	ALANTOINA	QC-SER-008	0.200	2.0000	2026-09-02 14:06:13.567	2026-09-02 14:06:13.567
500c077b-b9ac-40ae-9a4d-682997ae880f	76aa7bc3-917e-41ea-8130-789c6d382d84	\N	CARPOBOL	QC-SER-009	0.900	9.0000	2026-09-02 14:06:13.57	2026-09-02 14:06:13.57
e801103f-70b6-4dad-a9de-9e91d1c27d9c	76aa7bc3-917e-41ea-8130-789c6d382d84	\N	PROCIDE CG	QC-SER-010	0.200	2.0000	2026-09-02 14:06:13.572	2026-09-02 14:06:13.572
4636053b-3467-4a49-a8ce-cafb0a0c1efd	76aa7bc3-917e-41ea-8130-789c6d382d84	\N	FRAGANCIA	QC-SER-011	0.100	1.0000	2026-09-02 14:06:13.574	2026-09-02 14:06:13.574
8317df0f-dd0e-4294-80d1-4b4e8a6772b5	76aa7bc3-917e-41ea-8130-789c6d382d84	\N	POLISORBATO 20	QC-SER-012	0.600	6.0000	2026-09-02 14:06:13.578	2026-09-02 14:06:13.578
d4ba439b-156e-4664-b9e1-ad4b3270de82	a5a0165f-e571-4667-a6bd-ab1c65539451	\N	AGUA DESIONIZADA	QC-SER-001	91.250	912.0000	2026-09-02 14:06:13.587	2026-09-02 14:06:13.587
4c0f56c7-0237-406b-a459-cf97ed955c3a	a5a0165f-e571-4667-a6bd-ab1c65539451	\N	ACIDO HIALURONICO	QC-SER-002	0.600	6.0000	2026-09-02 14:06:13.589	2026-09-02 14:06:13.589
bb721fd7-c88f-4400-b0ed-b1e1073be273	a5a0165f-e571-4667-a6bd-ab1c65539451	\N	COLAGENO HIDROLIZADO	QC-SER-003	2.000	20.0000	2026-09-02 14:06:13.592	2026-09-02 14:06:13.592
3836d656-c886-4577-b1de-58822bbd5704	a5a0165f-e571-4667-a6bd-ab1c65539451	\N	EXTRACTO DE CENTELLA ASIATICA	QC-SER-004	1.000	10.0000	2026-09-02 14:06:13.594	2026-09-02 14:06:13.594
a2a14fbd-06b4-49b2-840d-809ffb77fbce	a5a0165f-e571-4667-a6bd-ab1c65539451	\N	GLICERINA	QC-SER-005	3.000	30.0000	2026-09-02 14:06:13.596	2026-09-02 14:06:13.596
df660be9-3ce0-4dce-a54c-6c32c810db16	a5a0165f-e571-4667-a6bd-ab1c65539451	\N	NIACINAMIDA (VITAMINA B3)	QC-SER-006	0.500	5.0000	2026-09-02 14:06:13.599	2026-09-02 14:06:13.599
18f7e08d-30a1-49e5-9d24-686a93498b1f	a5a0165f-e571-4667-a6bd-ab1c65539451	\N	D- PANTENOL	QC-SER-007	0.500	5.0000	2026-09-02 14:06:13.601	2026-09-02 14:06:13.601
94e7089f-05b5-4688-96a1-1bf4b851e4eb	a5a0165f-e571-4667-a6bd-ab1c65539451	\N	CELLOSIZE	QC-SER-008	0.900	9.0000	2026-09-02 14:06:13.603	2026-09-02 14:06:13.603
51bf7d97-af67-4ea6-96b8-9ddcb8b32e20	a5a0165f-e571-4667-a6bd-ab1c65539451	\N	BENZOATO DE SODIO	QC-SER-009	0.100	1.0000	2026-09-02 14:06:13.605	2026-09-02 14:06:13.605
8248ba9d-fe52-4ce6-940f-7228f88bcf44	a5a0165f-e571-4667-a6bd-ab1c65539451	\N	SORBATO DE SODIO	QC-SER-010	0.050	0.5000	2026-09-02 14:06:13.607	2026-09-02 14:06:13.607
183ecf36-1f55-4e91-809d-aa82824f752a	a5a0165f-e571-4667-a6bd-ab1c65539451	\N	FRAGANCIA MANZANILLA	QC-SER-011	0.100	1.0000	2026-09-02 14:06:13.61	2026-09-02 14:06:13.61
eeafd53a-ba17-4844-b3f7-6e3a1bf94f6f	6f203893-fd85-43c9-8d5d-41ea905163f2	\N	ACIDO SALICILICO	QC-SER-001	5.000	50.0000	2026-09-02 14:06:13.619	2026-09-02 14:06:13.619
32168aad-6f1b-48b1-9d07-b6811cdc7120	6f203893-fd85-43c9-8d5d-41ea905163f2	\N	ALLCOHOL EXTRA NEUTRO	QC-SER-002	14.990	150.0000	2026-09-02 14:06:13.621	2026-09-02 14:06:13.621
f1c54f13-ab18-4e08-b557-49ec85e096c8	6f203893-fd85-43c9-8d5d-41ea905163f2	\N	PROPILENGLICOL	QC-SER-003	14.990	150.0000	2026-09-02 14:06:13.623	2026-09-02 14:06:13.623
c98e5b9a-7397-43ca-96aa-325d071ad564	6f203893-fd85-43c9-8d5d-41ea905163f2	\N	GLICERINA	QC-SER-004	0.500	5.0000	2026-09-02 14:06:13.626	2026-09-02 14:06:13.626
ecca61a7-ddfa-4390-b633-f6f879b450d6	6f203893-fd85-43c9-8d5d-41ea905163f2	\N	EXTRACTO DE ALOE VERA	QC-SER-005	0.500	5.0000	2026-09-02 14:06:13.628	2026-09-02 14:06:13.628
b4b33563-ed99-47ef-a66a-5186cfa2eebd	6f203893-fd85-43c9-8d5d-41ea905163f2	\N	AGUA DESIONIZADA	QC-SER-006	62.170	622.0000	2026-09-02 14:06:13.63	2026-09-02 14:06:13.63
aa162804-da6c-4d98-a229-93d05331e585	6f203893-fd85-43c9-8d5d-41ea905163f2	\N	PROCIDE CG	QC-SER-007	0.050	0.5000	2026-09-02 14:06:13.632	2026-09-02 14:06:13.632
5fdd7058-4fee-4e10-9768-b4a655250460	6f203893-fd85-43c9-8d5d-41ea905163f2	\N	CELLOSIZE	QC-SER-008	0.900	9.0000	2026-09-02 14:06:13.635	2026-09-02 14:06:13.635
fd7a2443-ad7f-473f-b064-bb7a5ac522a4	6f203893-fd85-43c9-8d5d-41ea905163f2	\N	TRIETANOLAMINA	QC-SER-009	0.900	9.0000	2026-09-02 14:06:13.637	2026-09-02 14:06:13.637
54eb1488-fd30-4af5-b5b9-1ec286b537ea	077daf29-d2ca-439b-b52e-080fd1e3dbd1	\N	AGUA DESIONIZADA	QC-SER-001	92.510	927.0000	2026-09-02 14:06:13.645	2026-09-02 14:06:13.645
e1908e2c-eda9-4b7b-bf57-775585cc49fe	077daf29-d2ca-439b-b52e-080fd1e3dbd1	\N	COLAGENO	QC-SER-002	1.000	10.0000	2026-09-02 14:06:13.648	2026-09-02 14:06:13.648
819bddc9-86a8-420a-9e19-60263b106762	077daf29-d2ca-439b-b52e-080fd1e3dbd1	\N	ACIDO ASCORBICO	QC-SER-003	0.500	5.0000	2026-09-02 14:06:13.65	2026-09-02 14:06:13.65
17b6c85f-91ce-46b4-aea4-08c87f06cb9e	077daf29-d2ca-439b-b52e-080fd1e3dbd1	\N	GLICERINA	QC-SER-004	4.990	50.0000	2026-09-02 14:06:13.652	2026-09-02 14:06:13.652
34b5bc3b-423d-4c77-a1a8-e4468b77bbed	077daf29-d2ca-439b-b52e-080fd1e3dbd1	\N	TRIETANOLAMINA	QC-SER-005	0.800	8.0000	2026-09-02 14:06:13.655	2026-09-02 14:06:13.655
d25de1c4-57e8-419c-809e-ea2dcb283c00	077daf29-d2ca-439b-b52e-080fd1e3dbd1	\N	PROCIDE CG	QC-SER-006	0.100	1.0000	2026-09-02 14:06:13.657	2026-09-02 14:06:13.657
770ebd91-c2a2-4ed6-920e-e3f8050fe151	077daf29-d2ca-439b-b52e-080fd1e3dbd1	\N	FRAGANCIA	QC-SER-007	0.100	1.0000	2026-09-02 14:06:13.659	2026-09-02 14:06:13.659
781ad5d2-5787-43d4-8b8e-6b58e726f848	b60a49ef-7661-4b40-b92f-0d2c54d045b4	\N	AGUA DESIONIZADA	QC-SER-001	77.010	770.0000	2026-09-02 14:06:13.668	2026-09-02 14:06:13.668
32d7507d-3b70-4318-b81e-8456ecfaeeda	b60a49ef-7661-4b40-b92f-0d2c54d045b4	\N	EXTRACTO DE HAMAMELIS	QC-SER-002	10.000	100.0000	2026-09-02 14:06:13.67	2026-09-02 14:06:13.67
9f796efa-98f2-41f1-b808-5c5486875e22	b60a49ef-7661-4b40-b92f-0d2c54d045b4	\N	CELLOSIZE	QC-SER-003	0.900	9.0000	2026-09-02 14:06:13.672	2026-09-02 14:06:13.672
d2b030af-a8bf-48ce-8e50-b9a1616089b3	b60a49ef-7661-4b40-b92f-0d2c54d045b4	\N	TRIETANOLAMINA	QC-SER-004	0.900	9.0000	2026-09-02 14:06:13.675	2026-09-02 14:06:13.675
acc38e9e-cd08-4681-b0c2-f44e9b94fdae	b60a49ef-7661-4b40-b92f-0d2c54d045b4	\N	GLICERINA	QC-SER-005	3.000	30.0000	2026-09-02 14:06:13.677	2026-09-02 14:06:13.677
5ed1ea57-f861-4272-8698-769c40b63602	b60a49ef-7661-4b40-b92f-0d2c54d045b4	\N	LIDOCAINA	QC-SER-006	2.000	20.0000	2026-09-02 14:06:13.679	2026-09-02 14:06:13.679
38d5c0a8-8566-46e3-abd9-9001f66265d5	b60a49ef-7661-4b40-b92f-0d2c54d045b4	\N	EXTACTO DE MANZANILLA	QC-SER-007	2.000	20.0000	2026-09-02 14:06:13.681	2026-09-02 14:06:13.681
3fadb1b7-d2c4-4e4b-b9cf-ee2c10888661	b60a49ef-7661-4b40-b92f-0d2c54d045b4	\N	EXTRACTO DE CALENDULA	QC-SER-008	2.000	20.0000	2026-09-02 14:06:13.684	2026-09-02 14:06:13.684
0bc56d15-a34f-42d9-8aee-a27eff4d5b52	b60a49ef-7661-4b40-b92f-0d2c54d045b4	\N	EXTRACTO DE CASTAÑA DE INDIAS	QC-SER-009	2.000	20.0000	2026-09-02 14:06:13.688	2026-09-02 14:06:13.688
666adae6-0360-4a19-ba4b-7166cdd18b69	b60a49ef-7661-4b40-b92f-0d2c54d045b4	\N	CLORURO DE BENZALCONIO	QC-SER-010	0.010	0.1200	2026-09-02 14:06:13.69	2026-09-02 14:06:13.69
35dfb52d-2698-4808-ac41-a7c0d8960f69	b60a49ef-7661-4b40-b92f-0d2c54d045b4	\N	BENZOATO DE SODIO	QC-SER-011	0.100	1.0000	2026-09-02 14:06:13.693	2026-09-02 14:06:13.693
c4c9a374-fb50-4e88-abf4-c95119a60c58	b60a49ef-7661-4b40-b92f-0d2c54d045b4	\N	SORBATO DE POTASIO	QC-SER-012	0.050	0.5000	2026-09-02 14:06:13.697	2026-09-02 14:06:13.697
0a57e3bc-84aa-4f5c-9c6b-7ef4fd6f7fe0	b60a49ef-7661-4b40-b92f-0d2c54d045b4	\N	ACIDO CITRICO	QC-SER-013	0.030	0.3000	2026-09-02 14:06:13.7	2026-09-02 14:06:13.7
cd8845b6-ac98-4cd7-b941-d94041738ea7	fdb68e4c-911c-4015-8235-fb33830a959d	\N	ACIDO SALICILICO	QC-SER-001	2.000	20.0000	2026-09-02 14:06:13.715	2026-09-02 14:06:13.715
a67622a3-140e-47b6-bf64-1cf5f14c4988	fdb68e4c-911c-4015-8235-fb33830a959d	\N	ACIDO LACTICO	QC-SER-002	1.000	10.0000	2026-09-02 14:06:13.718	2026-09-02 14:06:13.718
9e29f225-8882-46be-9a09-043ecd79e86e	fdb68e4c-911c-4015-8235-fb33830a959d	\N	ALCOHOL EXTRA NEUTRO	QC-SER-003	5.000	50.0000	2026-09-02 14:06:13.721	2026-09-02 14:06:13.721
d2e1e885-a51b-460e-8570-a8b59fb4be87	fdb68e4c-911c-4015-8235-fb33830a959d	\N	GLICERINA	QC-SER-004	2.000	20.0000	2026-09-02 14:06:13.724	2026-09-02 14:06:13.724
6f996381-ded6-4ee9-a078-8068beaaf5a8	fdb68e4c-911c-4015-8235-fb33830a959d	\N	PROPILENGLICOL	QC-SER-005	5.000	50.0000	2026-09-02 14:06:13.727	2026-09-02 14:06:13.727
035d7a61-0858-443d-8d4e-6281ad149d5d	fdb68e4c-911c-4015-8235-fb33830a959d	\N	CELLOZISE	QC-SER-006	0.600	6.0000	2026-09-02 14:06:13.73	2026-09-02 14:06:13.73
fef19396-f7c6-4e31-ba6e-ce4d1ba5192c	fdb68e4c-911c-4015-8235-fb33830a959d	\N	BENZOATO  DE SODIO	QC-SER-007	0.100	1.0000	2026-09-02 14:06:13.733	2026-09-02 14:06:13.733
5ef21303-b518-48a6-8068-b4dec6c40fd9	fdb68e4c-911c-4015-8235-fb33830a959d	\N	SORBATO DE POTASIO	QC-SER-008	0.050	0.5000	2026-09-02 14:06:13.736	2026-09-02 14:06:13.736
5500bace-6ab1-4ff0-a1f9-45b753cee344	fdb68e4c-911c-4015-8235-fb33830a959d	\N	AGUA DESTILADA	QC-SER-009	63.290	633.5000	2026-09-02 14:06:13.739	2026-09-02 14:06:13.739
89cc5765-5f14-42f8-8390-0f90c0a867a9	fdb68e4c-911c-4015-8235-fb33830a959d	\N	UREA	QC-SER-010	19.980	200.0000	2026-09-02 14:06:13.741	2026-09-02 14:06:13.741
99639630-3c4c-4127-ae9b-bee4656e67cc	fdb68e4c-911c-4015-8235-fb33830a959d	\N	ACEITE ESENCIAL ARBOL DEL TE	QC-SER-011	1.000	10.0000	2026-09-02 14:06:13.744	2026-09-02 14:06:13.744
d59c5162-f4b7-4e3a-880f-b208183dfa08	11c5b517-d6b3-4b50-b928-cd9b3cf7126e	\N	ACIDO KOJICO	QC-SER-001	0.500	5.0000	2026-09-02 14:06:13.76	2026-09-02 14:06:13.76
7e8cd60f-c024-4d92-9b1c-0a1be57a1e48	11c5b517-d6b3-4b50-b928-cd9b3cf7126e	\N	NIACINAMIDA (VITAMINA B3)	QC-SER-002	1.000	10.0000	2026-09-02 14:06:13.763	2026-09-02 14:06:13.763
f2e74a0e-314c-41b2-a0e3-f4b769ea7876	11c5b517-d6b3-4b50-b928-cd9b3cf7126e	\N	PROPILENGLICOL	QC-SER-003	2.990	30.0000	2026-09-02 14:06:13.766	2026-09-02 14:06:13.766
4d5b20f4-cf5a-41c4-8a9f-89c92a29bacf	11c5b517-d6b3-4b50-b928-cd9b3cf7126e	\N	GLICERINA	QC-SER-004	2.000	20.0000	2026-09-02 14:06:13.768	2026-09-02 14:06:13.768
eb4abb71-51f5-4f57-aed0-2d76e4421000	11c5b517-d6b3-4b50-b928-cd9b3cf7126e	\N	PANTENOL (PRO VITAMINA B5)	QC-SER-005	1.000	10.0000	2026-09-02 14:06:13.77	2026-09-02 14:06:13.77
9f923031-ef2c-473a-929c-2548a36e5ba4	11c5b517-d6b3-4b50-b928-cd9b3cf7126e	\N	CELLOSIZE	QC-SER-006	0.800	8.0000	2026-09-02 14:06:13.772	2026-09-02 14:06:13.772
245211df-b18d-4a6b-85da-5cbdcd1f1275	11c5b517-d6b3-4b50-b928-cd9b3cf7126e	\N	BENZOATO DE SODIO	QC-SER-007	0.100	1.0000	2026-09-02 14:06:13.775	2026-09-02 14:06:13.775
0c3054a3-2ec7-4986-ac07-1dce878e997f	11c5b517-d6b3-4b50-b928-cd9b3cf7126e	\N	SORBATO DE POTASIO	QC-SER-008	0.050	0.5000	2026-09-02 14:06:13.777	2026-09-02 14:06:13.777
a10722b0-f7f1-4c63-bbb1-eec02589e491	11c5b517-d6b3-4b50-b928-cd9b3cf7126e	\N	AGUA DESTILADA	QC-SER-009	91.570	918.0000	2026-09-02 14:06:13.78	2026-09-02 14:06:13.78
967a9778-b5ff-4983-9c66-93675fad2f8a	88143e6e-dcd4-491b-80b5-3164c1a158d0	\N	AGUA DESIONIZADA	QC-SER-001	92.190	927.0000	2026-09-02 14:06:13.787	2026-09-02 14:06:13.787
f8b1254e-d5a2-450d-84b6-461d7518669a	88143e6e-dcd4-491b-80b5-3164c1a158d0	\N	CELLOZICE	QC-SER-002	0.990	10.0000	2026-09-02 14:06:13.79	2026-09-02 14:06:13.79
8034eb90-a95c-4fe6-8a21-dd77393394a2	88143e6e-dcd4-491b-80b5-3164c1a158d0	\N	ACIDO ASCORBICO CON POCA AGUA	QC-SER-003	0.500	5.0000	2026-09-02 14:06:13.792	2026-09-02 14:06:13.792
197c76bc-7637-4046-a0fc-70342837043f	88143e6e-dcd4-491b-80b5-3164c1a158d0	\N	GLICERINA	QC-SER-004	4.970	50.0000	2026-09-02 14:06:13.795	2026-09-02 14:06:13.795
5488578f-8a01-4c2f-b9f3-dd693bccf5e7	88143e6e-dcd4-491b-80b5-3164c1a158d0	\N	TRIETANOLAMINA (TEA)	QC-SER-005	0.990	10.0000	2026-09-02 14:06:13.797	2026-09-02 14:06:13.797
14099d8d-728b-453a-95e5-494e73a6f480	88143e6e-dcd4-491b-80b5-3164c1a158d0	\N	CONSERVANTE PROCIDE CG	QC-SER-006	0.100	1.0000	2026-09-02 14:06:13.799	2026-09-02 14:06:13.799
63248c2e-638f-4dbb-9f67-9ff0708ba289	88143e6e-dcd4-491b-80b5-3164c1a158d0	\N	FRAGANCIA	QC-SER-007	0.050	0.5000	2026-09-02 14:06:13.801	2026-09-02 14:06:13.801
51f98c5f-1494-4f24-8505-a1c3a8095602	88143e6e-dcd4-491b-80b5-3164c1a158d0	\N	ACIDO HIALURONICO	QC-SER-008	0.200	2.0000	2026-09-02 14:06:13.803	2026-09-02 14:06:13.803
19ffe770-db9b-4a70-91dc-c08a1715b4ab	90090e0c-a7d2-45ed-a76c-250104d9653d	\N	AGUA DESIONIZADA	QC-SER-001	82.730	860.0000	2026-09-02 14:06:13.814	2026-09-02 14:06:13.814
8e6f8cd0-125b-42b4-a052-4ced6e396120	90090e0c-a7d2-45ed-a76c-250104d9653d	\N	COLAGENO	QC-SER-002	4.810	50.0000	2026-09-02 14:06:13.818	2026-09-02 14:06:13.818
55f381ec-48b4-4b5a-a728-447293c230fa	90090e0c-a7d2-45ed-a76c-250104d9653d	\N	VITAMINA C (ACIDO ASCORBICO)	QC-SER-003	0.480	5.0000	2026-09-02 14:06:13.82	2026-09-02 14:06:13.82
3c730e33-08d6-4a41-9f8b-05e9138b37b4	90090e0c-a7d2-45ed-a76c-250104d9653d	\N	CAFEINA	QC-SER-004	1.920	20.0000	2026-09-02 14:06:13.822	2026-09-02 14:06:13.822
3267274f-a267-4230-a093-8593c2dd912d	90090e0c-a7d2-45ed-a76c-250104d9653d	\N	GLICERINA	QC-SER-005	4.810	50.0000	2026-09-02 14:06:13.824	2026-09-02 14:06:13.824
ca40677b-c4a5-4857-9d69-22538c2cdb97	90090e0c-a7d2-45ed-a76c-250104d9653d	\N	EXTRACTO DE ALOE VERA	QC-SER-006	0.480	5.0000	2026-09-02 14:06:13.827	2026-09-02 14:06:13.827
a1210698-d61b-4cf1-90cd-651d541c55c8	90090e0c-a7d2-45ed-a76c-250104d9653d	\N	VITAMINA E	QC-SER-007	0.100	1.0000	2026-09-02 14:06:13.829	2026-09-02 14:06:13.829
e7498268-cb1a-4114-aefb-05742f6d5630	90090e0c-a7d2-45ed-a76c-250104d9653d	\N	CONSERVANTE PROCIDE CG	QC-SER-008	0.100	1.0000	2026-09-02 14:06:13.831	2026-09-02 14:06:13.831
daa69bc6-bcf0-443c-88ee-c7eb7f0f449a	90090e0c-a7d2-45ed-a76c-250104d9653d	\N	FRAGANCIA MANZANILLA	QC-SER-009	0.240	2.5000	2026-09-02 14:06:13.833	2026-09-02 14:06:13.833
77fedc57-13d4-4b61-8807-2b967b26f174	90090e0c-a7d2-45ed-a76c-250104d9653d	\N	POLISORBATO 20	QC-SER-010	3.560	37.0000	2026-09-02 14:06:13.835	2026-09-02 14:06:13.835
45ea0639-7549-427b-9a0a-663c7ccdd270	90090e0c-a7d2-45ed-a76c-250104d9653d	\N	CELLOSIZE	QC-SER-011	0.770	8.0000	2026-09-02 14:06:13.837	2026-09-02 14:06:13.837
5cae8fe0-00e9-40ff-a00c-ef8ba005346a	31bf4bc2-bbab-49d6-8fd6-607b59cd97d9	\N	ACIDO KOJICO	QC-SER-001	0.700	7.0000	2026-09-02 14:06:13.845	2026-09-02 14:06:13.845
f2804d6d-aedb-47ed-9ca8-86acbead3b11	31bf4bc2-bbab-49d6-8fd6-607b59cd97d9	\N	CELLOSIZE	QC-SER-002	0.800	8.0000	2026-09-02 14:06:13.847	2026-09-02 14:06:13.847
5ae19efd-8ff4-40e2-959a-9647c4bfcf45	31bf4bc2-bbab-49d6-8fd6-607b59cd97d9	\N	GLICERINA	QC-SER-003	3.000	30.0000	2026-09-02 14:06:13.849	2026-09-02 14:06:13.849
8a9cc9c4-081a-44ac-9201-fb624a311dc9	31bf4bc2-bbab-49d6-8fd6-607b59cd97d9	\N	PROPILENGLICOL	QC-SER-004	2.000	20.0000	2026-09-02 14:06:13.852	2026-09-02 14:06:13.852
082d0792-9f94-4cda-bfe1-387c059a60da	31bf4bc2-bbab-49d6-8fd6-607b59cd97d9	\N	EDTA	QC-SER-005	0.050	0.5000	2026-09-02 14:06:13.854	2026-09-02 14:06:13.854
1c3b5bb8-0707-4cb1-a76b-2321a3e7211e	31bf4bc2-bbab-49d6-8fd6-607b59cd97d9	\N	VITAMINA E	QC-SER-006	0.050	0.5000	2026-09-02 14:06:13.856	2026-09-02 14:06:13.856
539409aa-c73b-487b-836e-3a229ff5817c	31bf4bc2-bbab-49d6-8fd6-607b59cd97d9	\N	PROCIDE CG	QC-SER-007	0.200	2.0000	2026-09-02 14:06:13.858	2026-09-02 14:06:13.858
c321935e-a58d-4454-8086-acebea146e62	31bf4bc2-bbab-49d6-8fd6-607b59cd97d9	\N	FRAGANCIA	QC-SER-008	0.100	1.0000	2026-09-02 14:06:13.861	2026-09-02 14:06:13.861
71323a16-3527-41e0-b571-a28a9adfe7f8	31bf4bc2-bbab-49d6-8fd6-607b59cd97d9	\N	TRIETANOLAMINA	QC-SER-009	0.250	2.5000	2026-09-02 14:06:13.863	2026-09-02 14:06:13.863
867e535b-76ad-4600-b573-bf6b73371bc1	31bf4bc2-bbab-49d6-8fd6-607b59cd97d9	\N	AGUA DESIONIZADA	QC-SER-010	92.850	928.0000	2026-09-02 14:06:13.865	2026-09-02 14:06:13.865
88cba075-de50-4eeb-8ada-f4ff59e684c6	36b0b7a3-4c34-4a5b-b989-3b38de34367b	\N	AGUA DESIONIZADA	QC-SER-001	91.050	911.0000	2026-09-02 14:06:13.872	2026-09-02 14:06:13.872
87c60a20-abe9-44b4-a053-8531cec533bb	36b0b7a3-4c34-4a5b-b989-3b38de34367b	\N	CELLOZICE	QC-SER-002	0.800	8.0000	2026-09-02 14:06:13.874	2026-09-02 14:06:13.874
f6177a90-41a7-4c2d-a9ca-c4c0e915f6f9	36b0b7a3-4c34-4a5b-b989-3b38de34367b	\N	POLYQUATERNIUM 7	QC-SER-003	2.000	20.0000	2026-09-02 14:06:13.877	2026-09-02 14:06:13.877
88e9cc1f-11b6-45ca-b986-bf3ad6019d99	36b0b7a3-4c34-4a5b-b989-3b38de34367b	\N	GLICERINA	QC-SER-004	5.000	50.0000	2026-09-02 14:06:13.879	2026-09-02 14:06:13.879
0fe66108-528a-4899-a5bc-bc1383d1b403	36b0b7a3-4c34-4a5b-b989-3b38de34367b	\N	TRIETANOLAMINA	QC-SER-005	0.800	8.0000	2026-09-02 14:06:13.881	2026-09-02 14:06:13.881
52e8ab4c-1ee8-44ca-acc9-6eda659a9dc3	36b0b7a3-4c34-4a5b-b989-3b38de34367b	\N	BENZOATO DE SODIO	QC-SER-006	0.100	1.0000	2026-09-02 14:06:13.883	2026-09-02 14:06:13.883
8c11a28d-dba0-4e21-9cc8-d31bcfbf176a	36b0b7a3-4c34-4a5b-b989-3b38de34367b	\N	SORBATO DE POTASIO	QC-SER-007	0.050	0.5000	2026-09-02 14:06:13.886	2026-09-02 14:06:13.886
c5888123-5a33-48d2-aa0a-e4b13f48c41a	36b0b7a3-4c34-4a5b-b989-3b38de34367b	\N	FRAGANCIA	QC-SER-008	0.100	1.0000	2026-09-02 14:06:13.888	2026-09-02 14:06:13.888
6bde72fd-f3ef-4377-8acf-4a0ade13b7c5	36b0b7a3-4c34-4a5b-b989-3b38de34367b	\N	ALCOHOL	QC-SER-009	0.100	1.0000	2026-09-02 14:06:13.89	2026-09-02 14:06:13.89
509f6b92-a546-438d-b16b-02476f7b4eeb	766bf635-ca22-4a7f-aa7b-b4f23ac53296	\N	AGUA DESIONIZADA	QC-SER-001	85.840	858.0000	2026-09-02 14:06:13.899	2026-09-02 14:06:13.899
fb10dc6f-c9bb-4ac1-8890-60b42cc23f36	766bf635-ca22-4a7f-aa7b-b4f23ac53296	\N	GLICERINA	QC-SER-002	4.000	40.0000	2026-09-02 14:06:13.901	2026-09-02 14:06:13.901
5d0b11ea-48d1-456b-b50a-020c0287a3e1	766bf635-ca22-4a7f-aa7b-b4f23ac53296	\N	PROPILENGLICOL	QC-SER-003	3.000	30.0000	2026-09-02 14:06:13.904	2026-09-02 14:06:13.904
1b45f74f-4a84-4369-ac08-a4e03df9434a	766bf635-ca22-4a7f-aa7b-b4f23ac53296	\N	CELLOSIZE	QC-SER-004	0.800	8.0000	2026-09-02 14:06:13.906	2026-09-02 14:06:13.906
f037398a-7b9b-4afd-b1e2-2a7027e8e0a6	766bf635-ca22-4a7f-aa7b-b4f23ac53296	\N	TRIETANOLAMINA	QC-SER-005	0.800	8.0000	2026-09-02 14:06:13.908	2026-09-02 14:06:13.908
e4ce6130-5d17-4d6e-90c4-0e31cb03e816	766bf635-ca22-4a7f-aa7b-b4f23ac53296	\N	COLAGENO HIDROLIZADO	QC-SER-006	2.000	20.0000	2026-09-02 14:06:13.91	2026-09-02 14:06:13.91
d667d0a2-5319-4f00-8947-f31f7ef6c433	766bf635-ca22-4a7f-aa7b-b4f23ac53296	\N	PANTENOL	QC-SER-007	1.000	10.0000	2026-09-02 14:06:13.912	2026-09-02 14:06:13.912
d07027cc-53b7-4844-a4de-fac5b21ddfa4	766bf635-ca22-4a7f-aa7b-b4f23ac53296	\N	NIACINAMIDA	QC-SER-008	2.000	20.0000	2026-09-02 14:06:13.914	2026-09-02 14:06:13.914
b6b45d32-8ca5-4897-8acc-1f7eda86d773	766bf635-ca22-4a7f-aa7b-b4f23ac53296	\N	BENZOATO DE SODIO	QC-SER-009	0.200	2.0000	2026-09-02 14:06:13.916	2026-09-02 14:06:13.916
089e3db5-1537-4d89-a22c-e145a937c6b1	766bf635-ca22-4a7f-aa7b-b4f23ac53296	\N	SORBATO DE POTASIO	QC-SER-010	0.100	1.0000	2026-09-02 14:06:13.918	2026-09-02 14:06:13.918
7ee5e292-c28f-4684-b6d4-3b15e2d16ecb	766bf635-ca22-4a7f-aa7b-b4f23ac53296	\N	POLISORBATO 20	QC-SER-011	0.100	1.0000	2026-09-02 14:06:13.919	2026-09-02 14:06:13.919
0c7277f7-e320-402f-9312-868a8c77b1d5	766bf635-ca22-4a7f-aa7b-b4f23ac53296	\N	FRAGANCIA	QC-SER-012	0.050	0.5000	2026-09-02 14:06:13.921	2026-09-02 14:06:13.921
d9fb632f-d938-4ca7-8216-27d12a5cdba7	766bf635-ca22-4a7f-aa7b-b4f23ac53296	\N	ACIDO CITRICO	QC-SER-013	0.100	1.0000	2026-09-02 14:06:13.923	2026-09-02 14:06:13.923
c1b0b020-9597-41ba-8336-0e281fbb4c06	f8d03bcc-578f-4ba2-aafc-78626f970221	\N	AGUA DESIONIZADA	QC-SER-001	86.140	867.0000	2026-09-02 14:06:13.931	2026-09-02 14:06:13.931
ed315147-a731-430e-b751-452a752d4b9a	f8d03bcc-578f-4ba2-aafc-78626f970221	\N	GLICERINA	QC-SER-002	3.970	40.0000	2026-09-02 14:06:13.933	2026-09-02 14:06:13.933
5e7a4451-b445-4adb-b5de-6ab86cc2a9aa	f8d03bcc-578f-4ba2-aafc-78626f970221	\N	PROPILENGLICOL	QC-SER-003	2.980	30.0000	2026-09-02 14:06:13.935	2026-09-02 14:06:13.935
4474bd18-14ba-48b0-8019-0ca46f8074e8	f8d03bcc-578f-4ba2-aafc-78626f970221	\N	UREA	QC-SER-004	1.990	20.0000	2026-09-02 14:06:13.937	2026-09-02 14:06:13.937
5db5ff39-7dc5-4527-a15e-677e756e77a1	f8d03bcc-578f-4ba2-aafc-78626f970221	\N	EXTRACTO DE ALOE VERA	QC-SER-005	0.990	10.0000	2026-09-02 14:06:13.939	2026-09-02 14:06:13.939
a0325df5-88ec-477a-8459-4466c5643ae3	f8d03bcc-578f-4ba2-aafc-78626f970221	\N	NIACINAMIDA	QC-SER-006	1.990	20.0000	2026-09-02 14:06:13.941	2026-09-02 14:06:13.941
5a1e50c5-7abd-4c85-b7ab-b02b33743228	f8d03bcc-578f-4ba2-aafc-78626f970221	\N	PANTENOL	QC-SER-007	0.100	1.0000	2026-09-02 14:06:13.943	2026-09-02 14:06:13.943
091481b2-ff28-4e63-8bba-48741f139c5a	f8d03bcc-578f-4ba2-aafc-78626f970221	\N	ALANTOINA	QC-SER-008	0.300	3.0000	2026-09-02 14:06:13.945	2026-09-02 14:06:13.945
6c44c907-0218-40c6-b201-71ac4dbaac3b	f8d03bcc-578f-4ba2-aafc-78626f970221	\N	CELLOSIZE	QC-SER-009	0.790	8.0000	2026-09-02 14:06:13.947	2026-09-02 14:06:13.947
b33caa0e-0fac-49d8-87c8-b0e33ceda807	f8d03bcc-578f-4ba2-aafc-78626f970221	\N	BENZOATO DE SODIO	QC-SER-010	0.100	1.0000	2026-09-02 14:06:13.95	2026-09-02 14:06:13.95
590f64f1-9f31-4efc-90c9-9e7f8f87004e	f8d03bcc-578f-4ba2-aafc-78626f970221	\N	SORBATO DE POTASIO	QC-SER-011	0.050	0.5000	2026-09-02 14:06:13.952	2026-09-02 14:06:13.952
821c901d-a7f4-46c9-b6d4-2ace32efee71	f8d03bcc-578f-4ba2-aafc-78626f970221	\N	ACIDO CITRICO	QC-SER-012	0.200	2.0000	2026-09-02 14:06:13.953	2026-09-02 14:06:13.953
342f822e-e907-475d-ac4f-9fd404649f15	f8d03bcc-578f-4ba2-aafc-78626f970221	\N	ACIDO HIALURONICO	QC-SER-013	0.200	2.0000	2026-09-02 14:06:13.955	2026-09-02 14:06:13.955
a11c6aaa-3051-412a-aadf-3e3763f73a73	f8d03bcc-578f-4ba2-aafc-78626f970221	\N	EXTRACTO DE CENTELLA ASIATICA	QC-SER-014	0.200	2.0000	2026-09-02 14:06:13.957	2026-09-02 14:06:13.957
b4757a31-b638-4ff1-bb1c-cb34a44195c4	aebfa2cb-752a-42d5-a0af-53f996f3aa0f	\N	AGUA DESIONIZADA	QC-SER-001	97.500	975.0000	2026-09-02 14:06:13.964	2026-09-02 14:06:13.964
a39721a2-9d87-4284-a546-d66039f803eb	aebfa2cb-752a-42d5-a0af-53f996f3aa0f	\N	GLICERINA	QC-SER-002	0.300	3.0000	2026-09-02 14:06:13.967	2026-09-02 14:06:13.967
1e8b8817-d338-4390-ab1c-db72a7d88f26	aebfa2cb-752a-42d5-a0af-53f996f3aa0f	\N	ACIDO HIALURONICO	QC-SER-003	0.200	2.0000	2026-09-02 14:06:13.969	2026-09-02 14:06:13.969
72212e43-40c3-40a9-9acb-5e15bc274fd2	aebfa2cb-752a-42d5-a0af-53f996f3aa0f	\N	CELLOSIZE	QC-SER-004	0.900	9.0000	2026-09-02 14:06:13.971	2026-09-02 14:06:13.971
fb1a8ecb-83d1-4b8c-bcbc-fb616da64bb6	aebfa2cb-752a-42d5-a0af-53f996f3aa0f	\N	TRIETANOLAMINA	QC-SER-005	0.200	2.0000	2026-09-02 14:06:13.973	2026-09-02 14:06:13.973
cc544b14-e931-4c2e-86ab-9adb80e2fe64	aebfa2cb-752a-42d5-a0af-53f996f3aa0f	\N	ACIDO LACTICO	QC-SER-006	0.500	5.0000	2026-09-02 14:06:13.975	2026-09-02 14:06:13.975
aff76eb3-01ba-4a15-914c-af68463a44ca	aebfa2cb-752a-42d5-a0af-53f996f3aa0f	\N	EXTRACTO DE AVENA	QC-SER-007	0.100	1.0000	2026-09-02 14:06:13.977	2026-09-02 14:06:13.977
e284e9d0-d5a5-4c20-a9fd-e791a2db79cd	aebfa2cb-752a-42d5-a0af-53f996f3aa0f	\N	PANTENOL	QC-SER-008	0.100	1.0000	2026-09-02 14:06:13.98	2026-09-02 14:06:13.98
3959bb04-4f72-4d1a-ace4-40ad223985ed	aebfa2cb-752a-42d5-a0af-53f996f3aa0f	\N	VITAMINA E	QC-SER-009	0.050	0.5000	2026-09-02 14:06:13.981	2026-09-02 14:06:13.981
12230af6-eb9e-476c-a55a-74f0550f87c2	aebfa2cb-752a-42d5-a0af-53f996f3aa0f	\N	BENZOATO DE SODIO	QC-SER-010	0.100	1.0000	2026-09-02 14:06:13.983	2026-09-02 14:06:13.983
37eb9ddc-757a-4c6e-8a80-36b3852044ce	aebfa2cb-752a-42d5-a0af-53f996f3aa0f	\N	SORBATO DE POTASIO	QC-SER-011	0.050	0.5000	2026-09-02 14:06:13.985	2026-09-02 14:06:13.985
c9c1185f-9b13-4d59-bdcb-9b1f8def8c4b	ffea9f38-a8a8-461e-88bc-aca360979aa0	\N	AGUA DESIONIZADA	QC-GEL-001	26.850	268.5000	2026-09-02 14:06:13.991	2026-09-02 14:06:13.991
b3e0c38b-e1ed-41be-ae22-f6e4813b084e	ffea9f38-a8a8-461e-88bc-aca360979aa0	\N	BENZOATO DE SODIO	QC-GEL-002	0.100	1.0000	2026-09-02 14:06:13.993	2026-09-02 14:06:13.993
5a60ed96-2f43-4b8b-88fa-1ad1f485ea46	ffea9f38-a8a8-461e-88bc-aca360979aa0	\N	SORBATO DE POTASIO	QC-GEL-003	0.050	0.5000	2026-09-02 14:06:13.995	2026-09-02 14:06:13.995
ad1205e7-30cb-4798-b0bb-429ba0c09df7	ffea9f38-a8a8-461e-88bc-aca360979aa0	\N	SACARINA SODICA	QC-GEL-004	0.300	3.0000	2026-09-02 14:06:13.997	2026-09-02 14:06:13.997
90e2343d-d186-4bad-b94b-e0ac9d49d6ee	ffea9f38-a8a8-461e-88bc-aca360979aa0	\N	SORBITOL	QC-GEL-005	10.000	100.0000	2026-09-02 14:06:14	2026-09-02 14:06:14
78c3bb17-e890-4439-aca0-5dbfb51c5e10	ffea9f38-a8a8-461e-88bc-aca360979aa0	\N	ALCOHOL EXTRA NUETRO	QC-GEL-006	60.000	600.0000	2026-09-02 14:06:14.002	2026-09-02 14:06:14.002
ee8ab435-d8d2-400c-92fb-080a11cbc792	ffea9f38-a8a8-461e-88bc-aca360979aa0	\N	SABORIZANTE CANELA	QC-GEL-007	1.000	10.0000	2026-09-02 14:06:14.004	2026-09-02 14:06:14.004
d203f98d-7ed7-405e-89d8-a5120c8f94a7	ffea9f38-a8a8-461e-88bc-aca360979aa0	\N	MENTOL EN CRISTAL	QC-GEL-008	0.100	1.0000	2026-09-02 14:06:14.006	2026-09-02 14:06:14.006
b372c488-f430-4163-b220-fc6e6712768b	ffea9f38-a8a8-461e-88bc-aca360979aa0	\N	COLORANTE ALIMENTICIO	QC-GEL-009	0.000	0.0200	2026-09-02 14:06:14.008	2026-09-02 14:06:14.008
6a0df87a-0d95-4c44-a313-2cdd32e069af	ffea9f38-a8a8-461e-88bc-aca360979aa0	\N	CELLOSIZE	QC-GEL-010	0.800	8.0000	2026-09-02 14:06:14.011	2026-09-02 14:06:14.011
733f3b82-7ad1-44db-bae5-b23ebf47e071	ffea9f38-a8a8-461e-88bc-aca360979aa0	\N	TRIETANOLAMINA	QC-GEL-011	0.800	8.0000	2026-09-02 14:06:14.013	2026-09-02 14:06:14.013
5469897d-d317-4c37-971c-1e27aa487a03	af5770ae-205b-4ae7-a0bd-98fbac504a80	\N	AGUA DESIONIZADA	QC-GEL-001	80.490	805.0000	2026-09-02 14:06:14.021	2026-09-02 14:06:14.021
010a6ca8-a867-486a-878f-61878ec45b91	af5770ae-205b-4ae7-a0bd-98fbac504a80	\N	GLICERINA	QC-GEL-002	10.000	100.0000	2026-09-02 14:06:14.022	2026-09-02 14:06:14.022
6230a69a-ee29-47f9-a275-7101fef15863	af5770ae-205b-4ae7-a0bd-98fbac504a80	\N	CELLOSIZE	QC-GEL-003	1.200	12.0000	2026-09-02 14:06:14.024	2026-09-02 14:06:14.024
d428c8cd-783e-445f-9abe-97d20719d414	af5770ae-205b-4ae7-a0bd-98fbac504a80	\N	CARBOPOL	QC-GEL-004	0.200	2.0000	2026-09-02 14:06:14.027	2026-09-02 14:06:14.027
5ca5c226-bfb2-47f0-893c-7e6079a9bac3	af5770ae-205b-4ae7-a0bd-98fbac504a80	\N	TRIETANOLAMINA	QC-GEL-005	0.250	2.5000	2026-09-02 14:06:14.029	2026-09-02 14:06:14.029
8cd500a5-5ad6-4e79-811a-9a47a2fdab5c	af5770ae-205b-4ae7-a0bd-98fbac504a80	\N	EXTRACTO DE ALOE VERA	QC-GEL-006	3.000	30.0000	2026-09-02 14:06:14.031	2026-09-02 14:06:14.031
356cc31a-0473-456b-ad29-e3c5e27ad9bb	af5770ae-205b-4ae7-a0bd-98fbac504a80	\N	EXTRACTO DE HAMAMELIS	QC-GEL-007	2.000	20.0000	2026-09-02 14:06:14.034	2026-09-02 14:06:14.034
062df997-b58d-44d6-992a-afb3217cdc92	af5770ae-205b-4ae7-a0bd-98fbac504a80	\N	EXTRACTO DE TÉ VERDE	QC-GEL-008	2.000	20.0000	2026-09-02 14:06:14.036	2026-09-02 14:06:14.036
293b7860-9c4d-4e0c-9fad-da34ce2fc025	af5770ae-205b-4ae7-a0bd-98fbac504a80	\N	ACIDO HIALURONICO	QC-GEL-009	0.010	0.1000	2026-09-02 14:06:14.038	2026-09-02 14:06:14.038
b8d858c6-b721-43b9-9f2b-904def73d9f2	af5770ae-205b-4ae7-a0bd-98fbac504a80	\N	BENZOATO DE SODIO	QC-GEL-010	0.300	3.0000	2026-09-02 14:06:14.041	2026-09-02 14:06:14.041
f194d325-d2de-4f27-bbe4-8fe1a8805709	af5770ae-205b-4ae7-a0bd-98fbac504a80	\N	SORBATO DE POTASIO	QC-GEL-011	0.200	2.0000	2026-09-02 14:06:14.043	2026-09-02 14:06:14.043
cffe5cb1-dd2e-4e44-a60f-60fa234e5d68	af5770ae-205b-4ae7-a0bd-98fbac504a80	\N	ACIDO CITRICO	QC-GEL-012	0.150	1.5000	2026-09-02 14:06:14.045	2026-09-02 14:06:14.045
226185c2-9062-4af3-9fde-ea470b2f8361	af5770ae-205b-4ae7-a0bd-98fbac504a80	\N	FRAGANCIA	QC-GEL-013	0.200	2.0000	2026-09-02 14:06:14.047	2026-09-02 14:06:14.047
c910d8fb-b86a-47a9-ae28-1d575f8aa59a	af5770ae-205b-4ae7-a0bd-98fbac504a80	\N	COLORANTE (OPCIONAL)	QC-GEL-014	0.000	0.0200	2026-09-02 14:06:14.049	2026-09-02 14:06:14.049
ea079200-a0b5-4bbc-89a9-f7daed22dd3f	5a64dacd-8395-406e-8171-ec8b0e05ceb7	\N	ALCANFOR	QC-GEL-001	1.000	10.0000	2026-09-02 14:06:14.06	2026-09-02 14:06:14.06
419d47e7-10d0-44a7-ae4a-abf4613f3ca2	5a64dacd-8395-406e-8171-ec8b0e05ceb7	\N	MENTOL EN CRISTAL	QC-GEL-002	1.000	10.0000	2026-09-02 14:06:14.062	2026-09-02 14:06:14.062
698fea5e-5dff-4b8e-8fa2-d71538faf3b1	5a64dacd-8395-406e-8171-ec8b0e05ceb7	\N	ALCOHOL EXTRA NEUTRO	QC-GEL-003	57.530	575.0000	2026-09-02 14:06:14.064	2026-09-02 14:06:14.064
46a139fc-0fab-4ea0-b3bf-5f6c46158b84	5a64dacd-8395-406e-8171-ec8b0e05ceb7	\N	AGUA DESIONIZADA	QC-GEL-004	37.620	376.0000	2026-09-02 14:06:14.066	2026-09-02 14:06:14.066
66eaeec0-0623-4be0-bfc3-98cd57f42f28	5a64dacd-8395-406e-8171-ec8b0e05ceb7	\N	CARBOPOL	QC-GEL-005	1.200	12.0000	2026-09-02 14:06:14.068	2026-09-02 14:06:14.068
572ed9f3-f7c6-45a1-8756-7729515506b2	5a64dacd-8395-406e-8171-ec8b0e05ceb7	\N	BENZOATO DE SODIO	QC-GEL-006	0.100	1.0000	2026-09-02 14:06:14.07	2026-09-02 14:06:14.07
3bd9932c-87e0-4adb-897f-0e93e392beeb	5a64dacd-8395-406e-8171-ec8b0e05ceb7	\N	SORBATO DE POTASIO	QC-GEL-007	0.100	1.0000	2026-09-02 14:06:14.072	2026-09-02 14:06:14.072
58e9850d-0fd2-42e6-bd53-568f3f85be3d	5a64dacd-8395-406e-8171-ec8b0e05ceb7	\N	TRIETANOLAMINA	QC-GEL-008	1.200	12.0000	2026-09-02 14:06:14.075	2026-09-02 14:06:14.075
2141ba72-c289-4aef-9b9c-39710c15ffb2	5a64dacd-8395-406e-8171-ec8b0e05ceb7	\N	ACEITE ESENCIAL ROMERO	QC-GEL-009	0.250	2.5000	2026-09-02 14:06:14.077	2026-09-02 14:06:14.077
b1b75ed2-4c9a-45eb-b64d-04b22f273f18	cb8c5ca5-8e19-4389-8ad7-7bf90503e27f	\N	CARBOPOL	QC-GEL-001	1.000	10.0000	2026-09-02 14:06:14.084	2026-09-02 14:06:14.084
983fb51b-2917-433e-be48-df4c62ba97de	cb8c5ca5-8e19-4389-8ad7-7bf90503e27f	\N	TRIETANOLAMINA	QC-GEL-002	1.000	10.0000	2026-09-02 14:06:14.086	2026-09-02 14:06:14.086
94683181-4585-488f-9485-e06661b387b4	cb8c5ca5-8e19-4389-8ad7-7bf90503e27f	\N	SILICATO DE SODIO	QC-GEL-003	5.000	50.0000	2026-09-02 14:06:14.088	2026-09-02 14:06:14.088
456bd671-698c-4d34-8cae-4372075cde2d	cb8c5ca5-8e19-4389-8ad7-7bf90503e27f	\N	COLAGENO HIDROLIZADO	QC-GEL-004	2.000	20.0000	2026-09-02 14:06:14.09	2026-09-02 14:06:14.09
89e9ef5d-0cd6-42c0-aaef-96cc0dd7d035	cb8c5ca5-8e19-4389-8ad7-7bf90503e27f	\N	CAFEINA	QC-GEL-005	1.000	10.0000	2026-09-02 14:06:14.092	2026-09-02 14:06:14.092
51ae3b1d-b2cf-4290-9b6d-e3dd5717a5ff	cb8c5ca5-8e19-4389-8ad7-7bf90503e27f	\N	ACIDO HIALURONICO	QC-GEL-006	0.500	5.0000	2026-09-02 14:06:14.094	2026-09-02 14:06:14.094
9fb7b316-a092-4f2c-b7aa-ca05ed5d9fa1	cb8c5ca5-8e19-4389-8ad7-7bf90503e27f	\N	GLICERINA	QC-GEL-007	3.000	30.0000	2026-09-02 14:06:14.096	2026-09-02 14:06:14.096
314b5167-0977-4d25-bdce-563dc8bbcb34	cb8c5ca5-8e19-4389-8ad7-7bf90503e27f	\N	PROCIDE CG	QC-GEL-008	0.200	2.0000	2026-09-02 14:06:14.099	2026-09-02 14:06:14.099
8c4e411a-2a13-4646-b63c-895bb43e23a5	cb8c5ca5-8e19-4389-8ad7-7bf90503e27f	\N	AGUA DESIONIZADA	QC-GEL-009	86.300	863.0000	2026-09-02 14:06:14.101	2026-09-02 14:06:14.101
71c592db-49f6-431d-9028-779e31ad15ce	f7bc40b4-dc03-4d23-935d-4eaf3c6b227d	\N	AGUA DESIONIZADA	QC-GEL-001	86.740	870.0000	2026-09-02 14:06:14.108	2026-09-02 14:06:14.108
9b278fff-f215-4d2c-98f6-b8e931e7fc07	f7bc40b4-dc03-4d23-935d-4eaf3c6b227d	\N	CARBOPOL	QC-GEL-002	1.200	12.0000	2026-09-02 14:06:14.11	2026-09-02 14:06:14.11
70905f38-180e-4eca-b2ce-f1a640cc01a9	f7bc40b4-dc03-4d23-935d-4eaf3c6b227d	\N	ACIDO LACTICO	QC-GEL-003	0.200	2.0000	2026-09-02 14:06:14.112	2026-09-02 14:06:14.112
4f461624-e2f7-4b0f-86e7-22a659144ad7	f7bc40b4-dc03-4d23-935d-4eaf3c6b227d	\N	BENZOATO DE SODIO	QC-GEL-004	0.100	1.0000	2026-09-02 14:06:14.114	2026-09-02 14:06:14.114
f38e2f3c-c870-4c94-a700-f2770b51c288	f7bc40b4-dc03-4d23-935d-4eaf3c6b227d	\N	SORBATO DE POTASIO	QC-GEL-005	0.050	0.5000	2026-09-02 14:06:14.116	2026-09-02 14:06:14.116
2d7113d1-1f2f-4d4e-ac2c-121fedbf6eff	f7bc40b4-dc03-4d23-935d-4eaf3c6b227d	\N	EDTA	QC-GEL-006	0.050	0.5000	2026-09-02 14:06:14.119	2026-09-02 14:06:14.119
6582058e-c72a-4f9b-a62d-1dc0e82acff0	f7bc40b4-dc03-4d23-935d-4eaf3c6b227d	\N	TRIETANOLAMINA	QC-GEL-007	1.200	12.0000	2026-09-02 14:06:14.121	2026-09-02 14:06:14.121
54d2e548-a401-4821-9e94-e4ce0810b951	f7bc40b4-dc03-4d23-935d-4eaf3c6b227d	\N	COLORANTE	QC-GEL-008	0.000	0.0200	2026-09-02 14:06:14.123	2026-09-02 14:06:14.123
868d76e0-5ade-4f1a-af3e-d87c42c29834	f7bc40b4-dc03-4d23-935d-4eaf3c6b227d	\N	GLICERINA	QC-GEL-009	4.980	50.0000	2026-09-02 14:06:14.125	2026-09-02 14:06:14.125
6e450e6d-4262-4947-996c-633271702bc7	f7bc40b4-dc03-4d23-935d-4eaf3c6b227d	\N	ACIDO CITRICO	QC-GEL-010	0.300	3.0000	2026-09-02 14:06:14.127	2026-09-02 14:06:14.127
e3b2d609-5c6c-4a05-8ad1-1a5e21cda92e	f7bc40b4-dc03-4d23-935d-4eaf3c6b227d	\N	LIDOCAINA	QC-GEL-011	1.990	20.0000	2026-09-02 14:06:14.129	2026-09-02 14:06:14.129
7536219d-2fbe-4abc-b734-49bcf6cab697	f7bc40b4-dc03-4d23-935d-4eaf3c6b227d	\N	EXTRACTO DE ARNICA	QC-GEL-012	1.500	15.0000	2026-09-02 14:06:14.131	2026-09-02 14:06:14.131
b44c1933-ce67-495a-9944-63ae0888bbb1	f7bc40b4-dc03-4d23-935d-4eaf3c6b227d	\N	EXTRACTO DE JENGIBRE	QC-GEL-013	1.500	15.0000	2026-09-02 14:06:14.133	2026-09-02 14:06:14.133
00d8206b-87ff-4b02-9e91-22420b15c390	f7bc40b4-dc03-4d23-935d-4eaf3c6b227d	\N	ACEITE ESENCIAL LAVANDA	QC-GEL-014	0.200	2.0000	2026-09-02 14:06:14.135	2026-09-02 14:06:14.135
09400e39-5c38-4998-a98a-07320a6f1dc2	abfa6d15-3aa3-4137-95e2-1513ea218edb	\N	ACIDO KOJICO	QC-GEL-001	0.200	2.0000	2026-09-02 14:06:14.142	2026-09-02 14:06:14.142
e2594f4b-30d4-42f1-835a-6985920c3e0d	abfa6d15-3aa3-4137-95e2-1513ea218edb	\N	CARBOPOL	QC-GEL-002	0.800	8.0000	2026-09-02 14:06:14.144	2026-09-02 14:06:14.144
865332b5-ef97-4ec4-963e-bfa305fad6c2	abfa6d15-3aa3-4137-95e2-1513ea218edb	\N	GLICERINA	QC-GEL-003	3.000	30.0000	2026-09-02 14:06:14.146	2026-09-02 14:06:14.146
3b359f04-8bc8-4efa-b78c-a8193fc9d636	abfa6d15-3aa3-4137-95e2-1513ea218edb	\N	PROPILENGLICOL	QC-GEL-004	2.000	20.0000	2026-09-02 14:06:14.149	2026-09-02 14:06:14.149
965bc802-d4e8-4618-94b3-ef72fe6a81cb	abfa6d15-3aa3-4137-95e2-1513ea218edb	\N	TRIETANOLAMINA	QC-GEL-005	0.800	8.0000	2026-09-02 14:06:14.151	2026-09-02 14:06:14.151
2c55d055-2280-47e4-bf1a-4a66953e99ce	abfa6d15-3aa3-4137-95e2-1513ea218edb	\N	PROCIDE CG	QC-GEL-006	0.200	2.0000	2026-09-02 14:06:14.153	2026-09-02 14:06:14.153
1240deac-8b1f-41a0-aff3-97bdc815c587	abfa6d15-3aa3-4137-95e2-1513ea218edb	\N	FRAGANCIA COCO	QC-GEL-007	0.250	2.5000	2026-09-02 14:06:14.155	2026-09-02 14:06:14.155
fc90d097-871d-47c9-aa95-58b7e84f32f9	abfa6d15-3aa3-4137-95e2-1513ea218edb	\N	AGUA DESIONIZADA	QC-GEL-008	92.750	928.0000	2026-09-02 14:06:14.158	2026-09-02 14:06:14.158
b52df669-df49-4a4f-97e6-1455d3d3a078	20a347ce-c963-49a9-95d5-086924751ad2	\N	AGUA DESIONIZADA	QC-GEL-001	90.850	918.0000	2026-09-02 14:06:14.165	2026-09-02 14:06:14.165
02ccd43b-3297-423a-b089-523639da9749	20a347ce-c963-49a9-95d5-086924751ad2	\N	CARBOPOL	QC-GEL-002	1.190	12.0000	2026-09-02 14:06:14.168	2026-09-02 14:06:14.168
fdf6f9f8-a8e4-4fd0-ae76-a088f3b6e2c7	20a347ce-c963-49a9-95d5-086924751ad2	\N	BENZOATO DE SODIO	QC-GEL-003	0.200	2.0000	2026-09-02 14:06:14.17	2026-09-02 14:06:14.17
2451b458-eb7d-453b-8acd-ae8010bbc085	20a347ce-c963-49a9-95d5-086924751ad2	\N	SORBATO DE POTASIO	QC-GEL-004	0.200	2.0000	2026-09-02 14:06:14.172	2026-09-02 14:06:14.172
07ac1801-349c-45a5-9027-30b18cd799a1	20a347ce-c963-49a9-95d5-086924751ad2	\N	TRIETANOLAMINA	QC-GEL-005	1.190	12.0000	2026-09-02 14:06:14.175	2026-09-02 14:06:14.175
30258228-c145-4850-99da-54f7a0024e19	20a347ce-c963-49a9-95d5-086924751ad2	\N	FRAGANCIA	QC-GEL-006	0.250	2.5000	2026-09-02 14:06:14.177	2026-09-02 14:06:14.177
92a2df90-e7b7-416d-a99d-f6d36c331fe4	20a347ce-c963-49a9-95d5-086924751ad2	\N	GLICERINA	QC-GEL-007	4.950	50.0000	2026-09-02 14:06:14.179	2026-09-02 14:06:14.179
8bf6a92e-8359-4683-b438-8dc72e76bde6	20a347ce-c963-49a9-95d5-086924751ad2	\N	PROCIDE CG	QC-GEL-008	0.200	2.0000	2026-09-02 14:06:14.181	2026-09-02 14:06:14.181
d89764dd-feca-45b5-8133-32121a0eef9f	20a347ce-c963-49a9-95d5-086924751ad2	\N	DIOXIDO DE TITANIO	QC-GEL-009	0.990	10.0000	2026-09-02 14:06:14.183	2026-09-02 14:06:14.183
91a2bfa2-9f38-4f77-8330-e6460d3acc7e	9454995f-d03f-4198-9f7e-23ff3f2c0fa0	\N	AGUA DESIONIZADA	QC-GEL-001	88.000	880.0000	2026-09-02 14:06:14.19	2026-09-02 14:06:14.19
253b0ceb-fdb1-462e-9532-31bccc221cba	9454995f-d03f-4198-9f7e-23ff3f2c0fa0	\N	CELLOSIZE	QC-GEL-002	1.100	11.0000	2026-09-02 14:06:14.192	2026-09-02 14:06:14.192
26e9b037-baac-4775-b408-0da317e4d7d2	9454995f-d03f-4198-9f7e-23ff3f2c0fa0	\N	ACIDO LACTICO	QC-GEL-003	0.200	2.0000	2026-09-02 14:06:14.195	2026-09-02 14:06:14.195
01bea7f3-5f1e-4893-a9f7-f35de33cd89b	9454995f-d03f-4198-9f7e-23ff3f2c0fa0	\N	BENZOATO DE SODIO	QC-GEL-004	0.100	1.0000	2026-09-02 14:06:14.197	2026-09-02 14:06:14.197
0b286dd0-e275-44a1-aaa5-e7c97344babe	9454995f-d03f-4198-9f7e-23ff3f2c0fa0	\N	SORBATO DE POTASIO	QC-GEL-005	0.050	0.5000	2026-09-02 14:06:14.199	2026-09-02 14:06:14.199
bd57c75b-ef04-4af6-9716-889a5344b4df	9454995f-d03f-4198-9f7e-23ff3f2c0fa0	\N	EDTA	QC-GEL-006	0.050	0.5000	2026-09-02 14:06:14.201	2026-09-02 14:06:14.201
1edc8421-f0a6-4644-9ef9-604b3b347352	9454995f-d03f-4198-9f7e-23ff3f2c0fa0	\N	TRIETANOLAMINA	QC-GEL-007	1.100	11.0000	2026-09-02 14:06:14.203	2026-09-02 14:06:14.203
b8a79414-ed21-47a1-98e3-7fb05463fc71	9454995f-d03f-4198-9f7e-23ff3f2c0fa0	\N	COLORANTE NEGRO	QC-GEL-008	0.100	1.0000	2026-09-02 14:06:14.205	2026-09-02 14:06:14.205
e9ebc3ee-c5d0-4579-9020-b5d59f1f7b71	9454995f-d03f-4198-9f7e-23ff3f2c0fa0	\N	GLICERINA	QC-GEL-009	5.000	50.0000	2026-09-02 14:06:14.208	2026-09-02 14:06:14.208
895e5e0d-1424-454a-b84b-74f3a5d8facb	9454995f-d03f-4198-9f7e-23ff3f2c0fa0	\N	ACIDO CITRICO	QC-GEL-010	0.300	3.0000	2026-09-02 14:06:14.21	2026-09-02 14:06:14.21
8ef97b6a-d53d-453e-8638-aebca498ede5	9454995f-d03f-4198-9f7e-23ff3f2c0fa0	\N	LIDOCAINA	QC-GEL-011	4.000	40.0000	2026-09-02 14:06:14.212	2026-09-02 14:06:14.212
937dd9a0-905c-49be-bf78-d8ec7cb16112	21854509-e9c1-4fb7-9c44-81ca4f046462	\N	AGUA DESIONIZADA	QC-GEL-001	89.910	904.0000	2026-09-02 14:06:14.219	2026-09-02 14:06:14.219
2662028e-d460-490d-b0f5-3c8a96538f69	21854509-e9c1-4fb7-9c44-81ca4f046462	\N	GLICERINA	QC-GEL-002	1.990	20.0000	2026-09-02 14:06:14.221	2026-09-02 14:06:14.221
1ca95e20-01c7-415d-985d-cfa2c425d73c	21854509-e9c1-4fb7-9c44-81ca4f046462	\N	SORBITOL	QC-GEL-003	1.990	20.0000	2026-09-02 14:06:14.223	2026-09-02 14:06:14.223
b6b3bb8b-4fde-4c02-973f-34d3bdae7fb3	21854509-e9c1-4fb7-9c44-81ca4f046462	\N	CELLOSIZE	QC-GEL-004	1.990	20.0000	2026-09-02 14:06:14.226	2026-09-02 14:06:14.226
e949ac87-0640-4bae-bb81-c6ad3150c8cb	21854509-e9c1-4fb7-9c44-81ca4f046462	\N	TRIETANOLAMINA	QC-GEL-005	0.990	10.0000	2026-09-02 14:06:14.228	2026-09-02 14:06:14.228
f11b71ca-0a5f-48e8-9dc5-ca14fc26489f	21854509-e9c1-4fb7-9c44-81ca4f046462	\N	BETAINA	QC-GEL-006	0.500	5.0000	2026-09-02 14:06:14.23	2026-09-02 14:06:14.23
1832adfc-6a2f-489e-aabb-98dbcc028acd	21854509-e9c1-4fb7-9c44-81ca4f046462	\N	COLORANTE VIOLETA DISPERSANTE	QC-GEL-007	0.990	10.0000	2026-09-02 14:06:14.232	2026-09-02 14:06:14.232
d4a413cd-a391-49fc-9113-ba8227870614	21854509-e9c1-4fb7-9c44-81ca4f046462	\N	SABORIZANTE MENTA	QC-GEL-008	0.500	5.0000	2026-09-02 14:06:14.234	2026-09-02 14:06:14.234
200e4c2c-43c8-4ce5-9082-326dd6709395	21854509-e9c1-4fb7-9c44-81ca4f046462	\N	MENTOL EN CRISTALES	QC-GEL-009	0.050	0.5000	2026-09-02 14:06:14.236	2026-09-02 14:06:14.236
ef039154-6a22-4640-851b-a32ae54955d3	21854509-e9c1-4fb7-9c44-81ca4f046462	\N	SACARINA	QC-GEL-010	0.100	1.0000	2026-09-02 14:06:14.239	2026-09-02 14:06:14.239
e9e474d6-af0c-46e3-9995-9fa2ccde4414	21854509-e9c1-4fb7-9c44-81ca4f046462	\N	PROCIDE CG	QC-GEL-011	0.990	10.0000	2026-09-02 14:06:14.241	2026-09-02 14:06:14.241
bf3cbfff-d43d-4c51-8021-b4188b6d29e8	9129c87c-35e8-4ff5-a6da-e15899eb8f35	\N	CARBOPOL	QC-GEL-001	1.000	10.0000	2026-09-02 14:06:14.249	2026-09-02 14:06:14.249
9d717e5d-cff2-48d2-8bdd-54e060328eb6	9129c87c-35e8-4ff5-a6da-e15899eb8f35	\N	TRIETANOLAMINA	QC-GEL-002	1.000	10.0000	2026-09-02 14:06:14.251	2026-09-02 14:06:14.251
f3023935-e68d-46b4-9b1f-c0128f84afff	9129c87c-35e8-4ff5-a6da-e15899eb8f35	\N	SILICATO DE SODIO	QC-GEL-003	5.000	50.0000	2026-09-02 14:06:14.253	2026-09-02 14:06:14.253
6e3c0315-9e34-42b3-bc69-6c5645774dec	9129c87c-35e8-4ff5-a6da-e15899eb8f35	\N	COLAGENO	QC-GEL-004	2.000	20.0000	2026-09-02 14:06:14.255	2026-09-02 14:06:14.255
fe25ea0a-08ee-4bd1-bbc3-88ebbc484b5c	9129c87c-35e8-4ff5-a6da-e15899eb8f35	\N	CAFEINA	QC-GEL-005	1.000	10.0000	2026-09-02 14:06:14.257	2026-09-02 14:06:14.257
9a16cf0b-0a74-4aa6-8be1-a1c74325b438	9129c87c-35e8-4ff5-a6da-e15899eb8f35	\N	ACIDO HIALURONICO	QC-GEL-006	0.500	5.0000	2026-09-02 14:06:14.26	2026-09-02 14:06:14.26
afa0d0ea-6855-41a4-90be-95fd66d92f47	9129c87c-35e8-4ff5-a6da-e15899eb8f35	\N	GLICERINA	QC-GEL-007	3.000	30.0000	2026-09-02 14:06:14.262	2026-09-02 14:06:14.262
4aa24f2f-2d29-4257-a7ea-0b402c371fcd	9129c87c-35e8-4ff5-a6da-e15899eb8f35	\N	PROCIDE CG	QC-GEL-008	0.200	2.0000	2026-09-02 14:06:14.264	2026-09-02 14:06:14.264
93f5c658-246a-4728-be06-f15a4a88f201	9129c87c-35e8-4ff5-a6da-e15899eb8f35	\N	AGUA DESIONIZADA	QC-GEL-009	86.300	863.0000	2026-09-02 14:06:14.266	2026-09-02 14:06:14.266
aacf3eb6-86df-44b3-a092-4646526c6235	d5787078-4b7f-49d2-b507-b5c084d46f96	\N	AGUA DESIONIZADA	QC-CRE-001	77.500	775.0000	2026-09-02 14:06:14.273	2026-09-02 14:06:14.273
deed9f4b-72a7-47d5-9b02-9b297ca094c6	d5787078-4b7f-49d2-b507-b5c084d46f96	\N	ALCOHOL CETILICO	QC-CRE-002	7.000	70.0000	2026-09-02 14:06:14.276	2026-09-02 14:06:14.276
28d9868b-7643-43a4-9d15-75711fd4a1bb	d5787078-4b7f-49d2-b507-b5c084d46f96	\N	DEHYCUART	QC-CRE-003	7.000	70.0000	2026-09-02 14:06:14.278	2026-09-02 14:06:14.278
9d65e14e-386b-49b8-a7e4-91eebd72a4a7	d5787078-4b7f-49d2-b507-b5c084d46f96	\N	CAFEINA	QC-CRE-004	3.000	30.0000	2026-09-02 14:06:14.28	2026-09-02 14:06:14.28
55dd261f-b7e6-4f11-baeb-ce913a138fb3	d5787078-4b7f-49d2-b507-b5c084d46f96	\N	COLAGENO	QC-CRE-005	3.000	30.0000	2026-09-02 14:06:14.282	2026-09-02 14:06:14.282
241eb8eb-cc49-4af2-832c-38b4f102c8e1	d5787078-4b7f-49d2-b507-b5c084d46f96	\N	GLICERINA	QC-CRE-006	1.000	10.0000	2026-09-02 14:06:14.284	2026-09-02 14:06:14.284
92538bc4-53cb-4fbb-a1fd-4f807565d6fc	d5787078-4b7f-49d2-b507-b5c084d46f96	\N	EXTRACTO DE CENTELLA ASIATICA	QC-CRE-007	1.000	10.0000	2026-09-02 14:06:14.286	2026-09-02 14:06:14.286
61ff38f1-52bc-4fdc-a81d-dfab8f08407c	d5787078-4b7f-49d2-b507-b5c084d46f96	\N	FRAGANCIA	QC-CRE-008	0.250	2.5000	2026-09-02 14:06:14.288	2026-09-02 14:06:14.288
d7f8dbb4-f3a2-4029-bca9-db60fcfcc86d	d5787078-4b7f-49d2-b507-b5c084d46f96	\N	PROCIDE  CG	QC-CRE-009	0.250	2.5000	2026-09-02 14:06:14.29	2026-09-02 14:06:14.29
e4724864-44d7-4a21-a351-b3fdfc05af7b	41c6f994-255a-451b-8574-481989ec137d	\N	EMULGADE	QC-CRE-001	6.000	60.0000	2026-09-02 14:06:14.297	2026-09-02 14:06:14.297
f02bf95d-401d-4ad1-91ed-4f16f6e038fd	41c6f994-255a-451b-8574-481989ec137d	\N	DIMETICONA (SILICONA 1501)	QC-CRE-002	3.000	30.0000	2026-09-02 14:06:14.299	2026-09-02 14:06:14.299
9f1199b2-1801-40d5-884d-9ca81873a7d8	41c6f994-255a-451b-8574-481989ec137d	\N	AGUA DESIONIZADA	QC-CRE-003	69.270	693.0000	2026-09-02 14:06:14.301	2026-09-02 14:06:14.301
5c523113-467b-4cdc-adf4-abf182ebc0e4	41c6f994-255a-451b-8574-481989ec137d	\N	GLICERINA VEGETAL	QC-CRE-004	12.090	121.0000	2026-09-02 14:06:14.304	2026-09-02 14:06:14.304
764cd5dd-093c-4107-9a4e-40751fedd357	41c6f994-255a-451b-8574-481989ec137d	\N	PROCIDE CG	QC-CRE-005	0.200	2.0000	2026-09-02 14:06:14.306	2026-09-02 14:06:14.306
753a5b05-a50e-4fad-8824-0201aad8b9dc	41c6f994-255a-451b-8574-481989ec137d	\N	ARCILLA BLANCA	QC-CRE-006	1.800	18.0000	2026-09-02 14:06:14.308	2026-09-02 14:06:14.308
32aeb642-b99c-463c-96bc-210797983ab2	41c6f994-255a-451b-8574-481989ec137d	\N	DIOXIDO DE TITANIO	QC-CRE-007	1.800	18.0000	2026-09-02 14:06:14.31	2026-09-02 14:06:14.31
2ed708f3-2e15-46f7-8f98-cbdcd72365e1	41c6f994-255a-451b-8574-481989ec137d	\N	OXIDO DE ZINC	QC-CRE-008	1.800	18.0000	2026-09-02 14:06:14.312	2026-09-02 14:06:14.312
3c361516-a994-41ce-826c-433d2fd1dfdc	41c6f994-255a-451b-8574-481989ec137d	\N	VITAMINA E	QC-CRE-009	0.200	2.0000	2026-09-02 14:06:14.315	2026-09-02 14:06:14.315
41188a25-9665-4cfe-858d-c5fd8cec7750	41c6f994-255a-451b-8574-481989ec137d	\N	TALCO	QC-CRE-010	3.850	38.5000	2026-09-02 14:06:14.317	2026-09-02 14:06:14.317
86e9678f-2358-40c2-993e-fad63d2c264b	d7314864-bb03-4141-aa29-7ad8f99d598a	\N	ALCOHOL CETILICO	QC-CRE-001	5.500	55.0000	2026-09-02 14:06:14.323	2026-09-02 14:06:14.323
44247172-25b9-4a21-b400-ab20f821e71a	d7314864-bb03-4141-aa29-7ad8f99d598a	\N	DEHYQUART	QC-CRE-002	5.500	55.0000	2026-09-02 14:06:14.326	2026-09-02 14:06:14.326
8c7d0042-3730-4735-8182-3281bf241442	d7314864-bb03-4141-aa29-7ad8f99d598a	\N	ACEITE DE RICINO	QC-CRE-003	2.000	20.0000	2026-09-02 14:06:14.328	2026-09-02 14:06:14.328
39579134-65c4-4c6e-8c76-3a30f601201c	d7314864-bb03-4141-aa29-7ad8f99d598a	\N	COLAGENO HIDROLIZADO	QC-CRE-004	1.000	10.0000	2026-09-02 14:06:14.33	2026-09-02 14:06:14.33
c1393721-3a41-49f4-b2c0-26cbc9044b53	d7314864-bb03-4141-aa29-7ad8f99d598a	\N	EXTRACTO DE CENTELLA ASIATICA	QC-CRE-005	0.500	5.0000	2026-09-02 14:06:14.332	2026-09-02 14:06:14.332
39e36155-965a-4176-87dd-23004d99ae13	d7314864-bb03-4141-aa29-7ad8f99d598a	\N	ACIDO HIALURONICO	QC-CRE-006	0.050	0.5000	2026-09-02 14:06:14.334	2026-09-02 14:06:14.334
c6877364-733d-4218-a57e-b06c86ec7807	d7314864-bb03-4141-aa29-7ad8f99d598a	\N	GLICERINA	QC-CRE-007	2.000	20.0000	2026-09-02 14:06:14.336	2026-09-02 14:06:14.336
a875803a-4396-4af4-9607-ffb669e3e192	d7314864-bb03-4141-aa29-7ad8f99d598a	\N	PROCIDE CG	QC-CRE-008	0.200	2.0000	2026-09-02 14:06:14.338	2026-09-02 14:06:14.338
c6304c1d-f18b-4ba7-9f03-c1bbb688b5af	d7314864-bb03-4141-aa29-7ad8f99d598a	\N	FRAGANCIA  VAINILLA	QC-CRE-009	0.200	2.0000	2026-09-02 14:06:14.34	2026-09-02 14:06:14.34
be989e49-dfe4-44c5-b615-78c5449d4085	d7314864-bb03-4141-aa29-7ad8f99d598a	\N	AGUA DEIONIZADA	QC-CRE-010	83.040	830.0000	2026-09-02 14:06:14.342	2026-09-02 14:06:14.342
8b2c8472-bdca-4e43-800f-f0c8056a54cc	c677d242-7dd1-4e76-b9a9-b474cbe1668c	\N	AGUA DESIONIZADA	QC-CRE-001	80.500	805.0000	2026-09-02 14:06:14.349	2026-09-02 14:06:14.349
ca4c366f-a0e3-4f42-ae19-0c5f6aa9df42	c677d242-7dd1-4e76-b9a9-b474cbe1668c	\N	ALCOHOL CETILICO	QC-CRE-002	7.000	70.0000	2026-09-02 14:06:14.351	2026-09-02 14:06:14.351
dafa2425-9838-4521-91a0-996de97dbbec	c677d242-7dd1-4e76-b9a9-b474cbe1668c	\N	DEHYCUART	QC-CRE-003	7.000	70.0000	2026-09-02 14:06:14.353	2026-09-02 14:06:14.353
1eb9d7bc-7ee5-42ee-9054-4a2d1b854816	c677d242-7dd1-4e76-b9a9-b474cbe1668c	\N	CAFEINA	QC-CRE-004	3.000	30.0000	2026-09-02 14:06:14.355	2026-09-02 14:06:14.355
4a6e7a2d-4969-49a5-9af5-f21aae330f2c	c677d242-7dd1-4e76-b9a9-b474cbe1668c	\N	COLAGENO	QC-CRE-005	1.000	10.0000	2026-09-02 14:06:14.357	2026-09-02 14:06:14.357
c4483b2d-95b4-4e1e-ac1a-f277cd761e47	c677d242-7dd1-4e76-b9a9-b474cbe1668c	\N	GLICERINA	QC-CRE-006	1.000	10.0000	2026-09-02 14:06:14.36	2026-09-02 14:06:14.36
db417f10-f51b-4e72-97c1-774f29f907a5	c677d242-7dd1-4e76-b9a9-b474cbe1668c	\N	PROCIDE CG	QC-CRE-007	0.250	2.5000	2026-09-02 14:06:14.362	2026-09-02 14:06:14.362
1aa7f20d-67dd-42d4-a533-3b43070d9289	c677d242-7dd1-4e76-b9a9-b474cbe1668c	\N	FRAGANCIA MANZANILLA	QC-CRE-008	0.250	2.5000	2026-09-02 14:06:14.364	2026-09-02 14:06:14.364
e80f4454-22a8-4235-8c35-499dbda1aa9e	4969ca62-91e9-4fd5-8d28-968d7589c959	\N	AGUA DESIONIZADA	QC-CRE-001	73.820	750.0000	2026-09-02 14:06:14.371	2026-09-02 14:06:14.371
041814f1-8fc4-405f-a021-db06061d420e	4969ca62-91e9-4fd5-8d28-968d7589c959	\N	ALCOHOL CETILICO	QC-CRE-002	6.890	70.0000	2026-09-02 14:06:14.373	2026-09-02 14:06:14.373
2b31c7ed-1fa2-444c-9fe9-b11b44f7f012	4969ca62-91e9-4fd5-8d28-968d7589c959	\N	DEHYCUART	QC-CRE-003	6.890	70.0000	2026-09-02 14:06:14.375	2026-09-02 14:06:14.375
f482799d-294d-4c2e-9e5f-0dacb839280f	4969ca62-91e9-4fd5-8d28-968d7589c959	\N	GLICERINA	QC-CRE-004	2.950	30.0000	2026-09-02 14:06:14.377	2026-09-02 14:06:14.377
0d68f88c-2f0f-471c-9367-821e0328f11c	4969ca62-91e9-4fd5-8d28-968d7589c959	\N	PROPILENGLICOL	QC-CRE-005	1.970	20.0000	2026-09-02 14:06:14.379	2026-09-02 14:06:14.379
d9b3a171-4b30-4797-8923-e008f5aa57d5	4969ca62-91e9-4fd5-8d28-968d7589c959	\N	NIACINAMIDA	QC-CRE-006	3.940	40.0000	2026-09-02 14:06:14.382	2026-09-02 14:06:14.382
786c1111-229f-4b11-a28a-07448bda4c6b	4969ca62-91e9-4fd5-8d28-968d7589c959	\N	D - PANTENOL	QC-CRE-007	1.480	15.0000	2026-09-02 14:06:14.384	2026-09-02 14:06:14.384
1d98db96-a1bd-4903-a4c0-e9a8b8b92aa1	4969ca62-91e9-4fd5-8d28-968d7589c959	\N	ALANTOINA	QC-CRE-008	0.300	3.0000	2026-09-02 14:06:14.386	2026-09-02 14:06:14.386
f02b08b0-c7aa-49be-adfa-dcc95bdea2c2	4969ca62-91e9-4fd5-8d28-968d7589c959	\N	ACIDO HIALURONICO	QC-CRE-009	0.050	0.5000	2026-09-02 14:06:14.388	2026-09-02 14:06:14.388
132a3fe4-09e5-4594-abb7-210aebc67499	4969ca62-91e9-4fd5-8d28-968d7589c959	\N	EXTRACTO DE CENTELLA ASIATICA	QC-CRE-010	0.980	10.0000	2026-09-02 14:06:14.391	2026-09-02 14:06:14.391
8291acdc-c913-41e9-b79a-b7231b5482a0	4969ca62-91e9-4fd5-8d28-968d7589c959	\N	COLAGENO HIDROLIZADO	QC-CRE-011	0.490	5.0000	2026-09-02 14:06:14.393	2026-09-02 14:06:14.393
e27002d6-6984-460e-abb5-43f1041a7bc5	4969ca62-91e9-4fd5-8d28-968d7589c959	\N	PROCIDE CG	QC-CRE-012	0.250	2.5000	2026-09-02 14:06:14.395	2026-09-02 14:06:14.395
6f139d52-ef88-4502-b473-171a2d6d49cc	608ad73c-03b6-4950-8a59-7b9f03ccef38	\N	AGUA DESIONIZADA	QC-CRE-001	66.610	666.0000	2026-09-02 14:06:14.402	2026-09-02 14:06:14.402
eac5346a-7028-44a1-ab66-18910f206818	608ad73c-03b6-4950-8a59-7b9f03ccef38	\N	EXTRACTO DE HAMAMELIS	QC-CRE-002	2.000	20.0000	2026-09-02 14:06:14.404	2026-09-02 14:06:14.404
99d77a8f-d07f-4a8b-9740-d7c80b6bdd61	608ad73c-03b6-4950-8a59-7b9f03ccef38	\N	GLICERINA	QC-CRE-003	3.000	30.0000	2026-09-02 14:06:14.406	2026-09-02 14:06:14.406
70a62c98-2a21-4621-90f4-39c4ef3900a8	608ad73c-03b6-4950-8a59-7b9f03ccef38	\N	LIDOCAINA	QC-CRE-004	2.000	20.0000	2026-09-02 14:06:14.408	2026-09-02 14:06:14.408
14de5fda-9924-447e-b809-836c0e3ec09e	608ad73c-03b6-4950-8a59-7b9f03ccef38	\N	EXTRACTO DE MANZANILLA	QC-CRE-005	2.000	20.0000	2026-09-02 14:06:14.41	2026-09-02 14:06:14.41
69b8bc5d-e96a-4301-81f0-b1fb2651490f	608ad73c-03b6-4950-8a59-7b9f03ccef38	\N	EXTRACTO DE CALENDULA	QC-CRE-006	2.000	20.0000	2026-09-02 14:06:14.412	2026-09-02 14:06:14.412
3c9dd9ad-2233-4c45-bf1d-c9ec21ed1ea3	608ad73c-03b6-4950-8a59-7b9f03ccef38	\N	EXTRACTO DE CASTAÑA DE INDIAS	QC-CRE-007	2.000	20.0000	2026-09-02 14:06:14.414	2026-09-02 14:06:14.414
5d819bdf-0638-464b-91a6-84e8e9181f09	608ad73c-03b6-4950-8a59-7b9f03ccef38	\N	ALCOHOL CETILICO	QC-CRE-008	10.000	100.0000	2026-09-02 14:06:14.416	2026-09-02 14:06:14.416
677c3016-39d0-444e-888b-8503eb49e7a9	608ad73c-03b6-4950-8a59-7b9f03ccef38	\N	DEHYCUART	QC-CRE-009	10.000	100.0000	2026-09-02 14:06:14.418	2026-09-02 14:06:14.418
4ea10da9-a726-44f8-85f5-489e51d24d2b	608ad73c-03b6-4950-8a59-7b9f03ccef38	\N	CLORURO DE BENZALCONIO	QC-CRE-010	0.100	1.0000	2026-09-02 14:06:14.42	2026-09-02 14:06:14.42
1838a220-b5a1-4a83-b9c0-d94436295690	608ad73c-03b6-4950-8a59-7b9f03ccef38	\N	PROCIDE CG	QC-CRE-011	0.250	2.5000	2026-09-02 14:06:14.423	2026-09-02 14:06:14.423
c72ceb35-26ec-4466-8d05-03bab37ae250	608ad73c-03b6-4950-8a59-7b9f03ccef38	\N	ACIDO CITRICO	QC-CRE-012	0.030	0.3000	2026-09-02 14:06:14.425	2026-09-02 14:06:14.425
969b7ee4-d731-4f75-a7c6-6316a53ed144	2db36797-c425-4713-baee-a6237a042fba	\N	UREA	QC-CRE-001	3.330	33.3000	2026-09-02 14:06:14.432	2026-09-02 14:06:14.432
467a145e-225e-4cf9-aa5b-5e13ab864d55	2db36797-c425-4713-baee-a6237a042fba	\N	ACIDO LACTICO	QC-CRE-002	2.000	20.0000	2026-09-02 14:06:14.434	2026-09-02 14:06:14.434
10b14649-7821-44d4-8e9c-fd56c6fbb6b1	2db36797-c425-4713-baee-a6237a042fba	\N	ACIDO SALICILICO	QC-CRE-003	1.000	10.0000	2026-09-02 14:06:14.436	2026-09-02 14:06:14.436
16eaa095-58e8-4e4e-a0ae-da9258ca1b93	2db36797-c425-4713-baee-a6237a042fba	\N	ALCOHOL CETILICO	QC-CRE-004	7.000	70.0000	2026-09-02 14:06:14.438	2026-09-02 14:06:14.438
3728691e-a3dc-4d0c-a223-d06848bf23b6	2db36797-c425-4713-baee-a6237a042fba	\N	DEHYCUART	QC-CRE-005	7.000	70.0000	2026-09-02 14:06:14.44	2026-09-02 14:06:14.44
86bec57b-5616-4bfb-9484-733074c39894	2db36797-c425-4713-baee-a6237a042fba	\N	EXTRACTO DE ALOE VERA	QC-CRE-006	1.000	10.0000	2026-09-02 14:06:14.443	2026-09-02 14:06:14.443
ff1c9d13-50ab-4f68-ba5f-3819804bb397	2db36797-c425-4713-baee-a6237a042fba	\N	ACEITE ESENIAL TEA TREE	QC-CRE-007	0.100	1.0000	2026-09-02 14:06:14.445	2026-09-02 14:06:14.445
ee6b451f-8585-46e7-bfd5-e0a41d445a1d	2db36797-c425-4713-baee-a6237a042fba	\N	GLICERINA VEGETAL	QC-CRE-008	5.000	50.0000	2026-09-02 14:06:14.447	2026-09-02 14:06:14.447
6532a663-f8d2-4620-be7d-c89770a1a5c5	2db36797-c425-4713-baee-a6237a042fba	\N	BENZOATO DE SODIO	QC-CRE-009	0.200	2.0000	2026-09-02 14:06:14.449	2026-09-02 14:06:14.449
4470290f-c98a-4330-8f60-675324f67414	2db36797-c425-4713-baee-a6237a042fba	\N	SORBATO DE POTASIO	QC-CRE-010	0.100	1.0000	2026-09-02 14:06:14.452	2026-09-02 14:06:14.452
d2ae33fa-3906-47bb-9d12-5e239cd10420	2db36797-c425-4713-baee-a6237a042fba	\N	AGUA	QC-CRE-011	73.280	733.0000	2026-09-02 14:06:14.454	2026-09-02 14:06:14.454
6b856701-4ff1-48bb-8b67-fdbbda7aa973	51684c3e-c663-4a84-b423-33d55d1490da	\N	ACIDO MANDELICO	QC-CRE-001	5.000	50.0000	2026-09-02 14:06:14.461	2026-09-02 14:06:14.461
43b7a3ab-9c70-4224-87d1-bd2ded34b743	51684c3e-c663-4a84-b423-33d55d1490da	\N	NIACINAMIDA	QC-CRE-002	0.500	5.0000	2026-09-02 14:06:14.463	2026-09-02 14:06:14.463
6f4cd1ca-da63-4103-9fdd-5ffada055dff	51684c3e-c663-4a84-b423-33d55d1490da	\N	EXTRACTO DE ALOE VERA	QC-CRE-003	5.000	50.0000	2026-09-02 14:06:14.465	2026-09-02 14:06:14.465
b2a5471e-16fc-4347-a760-2e6835dccd91	51684c3e-c663-4a84-b423-33d55d1490da	\N	ALCOHOL CETILICO	QC-CRE-004	7.000	70.0000	2026-09-02 14:06:14.467	2026-09-02 14:06:14.467
a0c0e63d-a21f-4c41-981f-4625ca8e9f1f	51684c3e-c663-4a84-b423-33d55d1490da	\N	DEHYCUARTH	QC-CRE-005	7.000	70.0000	2026-09-02 14:06:14.469	2026-09-02 14:06:14.469
fdcb5af6-d320-4857-9295-8eb05a88abaa	51684c3e-c663-4a84-b423-33d55d1490da	\N	ACIDO CITRICO	QC-CRE-006	0.300	3.0000	2026-09-02 14:06:14.471	2026-09-02 14:06:14.471
b2a5c790-21dc-4d03-a3f1-21c708765dae	51684c3e-c663-4a84-b423-33d55d1490da	\N	PROCIDE CG	QC-CRE-007	0.250	2.5000	2026-09-02 14:06:14.473	2026-09-02 14:06:14.473
9e8d88fe-a7ab-4aea-aee6-f13876b5041b	51684c3e-c663-4a84-b423-33d55d1490da	\N	AGUA DESTILADA	QC-CRE-008	74.960	750.0000	2026-09-02 14:06:14.475	2026-09-02 14:06:14.475
520a594c-c110-4230-b97c-04a7874bdc76	3a8974f6-aaf2-4de6-ad96-cc1f6932829c	\N	AGUA DESTILADA	QC-CRE-001	81.960	820.0000	2026-09-02 14:06:14.482	2026-09-02 14:06:14.482
ff6e91a1-0523-458a-94fa-65a754867ba1	3a8974f6-aaf2-4de6-ad96-cc1f6932829c	\N	ALCOHOL CETILICO	QC-CRE-002	7.000	70.0000	2026-09-02 14:06:14.484	2026-09-02 14:06:14.484
d84ef9c3-d2e5-43f7-9e2f-bcddb31a2223	3a8974f6-aaf2-4de6-ad96-cc1f6932829c	\N	DEHYCUARTH	QC-CRE-003	7.000	70.0000	2026-09-02 14:06:14.486	2026-09-02 14:06:14.486
2709933f-d7e0-4741-a961-72cf6d21aa9e	3a8974f6-aaf2-4de6-ad96-cc1f6932829c	\N	GLICERINA	QC-CRE-004	1.000	10.0000	2026-09-02 14:06:14.488	2026-09-02 14:06:14.488
fa88ead2-3c95-4489-af0d-02d28e923dad	3a8974f6-aaf2-4de6-ad96-cc1f6932829c	\N	EXTRACTO DE CENTELLLA ASIATICA	QC-CRE-005	1.000	10.0000	2026-09-02 14:06:14.49	2026-09-02 14:06:14.49
70089fba-4459-4f67-a242-45bd5df87201	3a8974f6-aaf2-4de6-ad96-cc1f6932829c	\N	EXTRACTO DE CASTAÑA DE INDIAS	QC-CRE-006	1.000	10.0000	2026-09-02 14:06:14.493	2026-09-02 14:06:14.493
001ce7c4-7594-4fd5-bf21-003f418bffd1	3a8974f6-aaf2-4de6-ad96-cc1f6932829c	\N	EXTRACTO DE HAMAMELIS	QC-CRE-007	0.500	5.0000	2026-09-02 14:06:14.495	2026-09-02 14:06:14.495
810f1d2d-1b06-4867-96bd-be0fd539b900	3a8974f6-aaf2-4de6-ad96-cc1f6932829c	\N	PROCIDE CG	QC-CRE-008	0.250	2.5000	2026-09-02 14:06:14.497	2026-09-02 14:06:14.497
0fcd848f-20a9-4743-bb3d-530cbab4259d	3a8974f6-aaf2-4de6-ad96-cc1f6932829c	\N	ACIDO CITRICO	QC-CRE-009	0.100	1.0000	2026-09-02 14:06:14.499	2026-09-02 14:06:14.499
05023a33-5b59-4947-8229-b9ddbae85c5e	3a8974f6-aaf2-4de6-ad96-cc1f6932829c	\N	FRAGANCIA MIEL	QC-CRE-010	0.200	2.0000	2026-09-02 14:06:14.501	2026-09-02 14:06:14.501
da306752-1af9-4df2-8a5b-0df13310e42c	71cf973c-9a35-4b03-846e-68f3b41c4da6	\N	AGUA DESTILADA	QC-CRE-001	81.200	812.0000	2026-09-02 14:06:14.509	2026-09-02 14:06:14.509
d4b79be9-f575-4a3e-b0ea-e185ed71ccbf	71cf973c-9a35-4b03-846e-68f3b41c4da6	\N	ALCOHOL CETILICO	QC-CRE-002	7.000	70.0000	2026-09-02 14:06:14.511	2026-09-02 14:06:14.511
a8ae735a-0b9d-4c38-aac2-be5bdefe914d	71cf973c-9a35-4b03-846e-68f3b41c4da6	\N	DEHYCUARTH	QC-CRE-003	7.000	70.0000	2026-09-02 14:06:14.513	2026-09-02 14:06:14.513
0ad76aa9-c7f4-411b-9214-6664c4bcd5f1	71cf973c-9a35-4b03-846e-68f3b41c4da6	\N	PVP K30	QC-CRE-004	1.500	15.0000	2026-09-02 14:06:14.515	2026-09-02 14:06:14.515
b6213d5e-df98-4d00-9ef8-868bb215b051	71cf973c-9a35-4b03-846e-68f3b41c4da6	\N	FRAGANCIA	QC-CRE-005	0.500	5.0000	2026-09-02 14:06:14.517	2026-09-02 14:06:14.517
efb2f5c2-03b5-4b31-a9f2-37e107fd2cee	71cf973c-9a35-4b03-846e-68f3b41c4da6	\N	SILICONA A LA GRASA 1000	QC-CRE-006	1.500	15.0000	2026-09-02 14:06:14.519	2026-09-02 14:06:14.519
d64e38c0-0d96-454f-9873-8822cb66f1d5	71cf973c-9a35-4b03-846e-68f3b41c4da6	\N	ACEITE DE RICINO	QC-CRE-007	1.000	10.0000	2026-09-02 14:06:14.521	2026-09-02 14:06:14.521
9b5f7c6a-9597-45e9-9d4e-e62181745032	71cf973c-9a35-4b03-846e-68f3b41c4da6	\N	COLORANTE	QC-CRE-008	0.000	0.0200	2026-09-02 14:06:14.523	2026-09-02 14:06:14.523
ba74db06-7d34-4cd5-b9b4-41adc467d97b	71cf973c-9a35-4b03-846e-68f3b41c4da6	\N	ACIDO CITRICO	QC-CRE-009	0.200	2.0000	2026-09-02 14:06:14.526	2026-09-02 14:06:14.526
bae476e5-7d72-4e5a-b577-2ea71274bdc5	71cf973c-9a35-4b03-846e-68f3b41c4da6	\N	ACTICIDE	QC-CRE-010	0.100	1.0000	2026-09-02 14:06:14.528	2026-09-02 14:06:14.528
ef6ca203-6e51-47ea-80ca-a2d68adf03c3	00e3bd70-80ff-44df-ab85-902ad4f176fe	\N	AGUA DESTILADA	QC-CRE-001	82.700	827.0000	2026-09-02 14:06:14.534	2026-09-02 14:06:14.534
ab4b2a66-a5f7-4033-b55e-d17a8cc2b1a5	00e3bd70-80ff-44df-ab85-902ad4f176fe	\N	ALCOHOL CETILICO	QC-CRE-002	7.000	70.0000	2026-09-02 14:06:14.537	2026-09-02 14:06:14.537
7385fb77-7905-42d8-b3e0-b97200ad8199	00e3bd70-80ff-44df-ab85-902ad4f176fe	\N	DEHYCUARTH	QC-CRE-003	7.000	70.0000	2026-09-02 14:06:14.539	2026-09-02 14:06:14.539
190c873b-9bac-4759-8ef8-6be6e83498f9	00e3bd70-80ff-44df-ab85-902ad4f176fe	\N	FRAGANCIA	QC-CRE-004	0.500	5.0000	2026-09-02 14:06:14.541	2026-09-02 14:06:14.541
3be619ab-47c3-42e8-9bcd-814d0522fad9	00e3bd70-80ff-44df-ab85-902ad4f176fe	\N	SILICONA A LA GRASA 1000	QC-CRE-005	1.500	15.0000	2026-09-02 14:06:14.543	2026-09-02 14:06:14.543
8629ae5d-c8aa-4f4e-8423-a7b674dd6069	00e3bd70-80ff-44df-ab85-902ad4f176fe	\N	ACEITE DE RICINO	QC-CRE-006	1.000	10.0000	2026-09-02 14:06:14.546	2026-09-02 14:06:14.546
66df761a-497a-439c-80e3-6b0b3e317655	00e3bd70-80ff-44df-ab85-902ad4f176fe	\N	COLORANTE	QC-CRE-007	0.000	0.0200	2026-09-02 14:06:14.547	2026-09-02 14:06:14.547
0aa98057-352b-481e-9396-a6b484fc9eff	00e3bd70-80ff-44df-ab85-902ad4f176fe	\N	ACIDO CITRICO	QC-CRE-008	0.200	2.0000	2026-09-02 14:06:14.55	2026-09-02 14:06:14.55
18ca5462-89f2-4097-ae06-f6ebe23f29c3	00e3bd70-80ff-44df-ab85-902ad4f176fe	\N	ACTICIDE	QC-CRE-009	0.100	1.0000	2026-09-02 14:06:14.552	2026-09-02 14:06:14.552
8a6d7b88-da78-4b29-8021-ce99038293d7	edcd15b3-ed98-49ac-9c24-6ab1197f17d1	\N	AGUA DESTILADA	QC-CRE-001	71.640	716.0000	2026-09-02 14:06:14.559	2026-09-02 14:06:14.559
da66e2e0-6205-4dd7-85c8-76b8183b4ee1	edcd15b3-ed98-49ac-9c24-6ab1197f17d1	\N	GLICERINA	QC-CRE-002	4.000	40.0000	2026-09-02 14:06:14.561	2026-09-02 14:06:14.561
dc759536-0fca-4b76-868e-f4bdcdab3130	edcd15b3-ed98-49ac-9c24-6ab1197f17d1	\N	PROPILENGLICOL	QC-CRE-003	3.000	30.0000	2026-09-02 14:06:14.563	2026-09-02 14:06:14.563
d0dbdc6f-3ca3-41a8-9b7f-9eff7562440a	edcd15b3-ed98-49ac-9c24-6ab1197f17d1	\N	EXTRACTO DE ALOE VERA	QC-CRE-004	5.000	50.0000	2026-09-02 14:06:14.565	2026-09-02 14:06:14.565
c22c8d42-a74d-4233-b714-732cfc892c3b	edcd15b3-ed98-49ac-9c24-6ab1197f17d1	\N	PANTENOL	QC-CRE-005	2.000	20.0000	2026-09-02 14:06:14.567	2026-09-02 14:06:14.567
6053ee7a-7028-4e83-9516-8d4c743903fc	edcd15b3-ed98-49ac-9c24-6ab1197f17d1	\N	ALANTOINA	QC-CRE-006	0.500	5.0000	2026-09-02 14:06:14.57	2026-09-02 14:06:14.57
dd2f6062-d8c2-41ff-8b91-5dd82680ab91	edcd15b3-ed98-49ac-9c24-6ab1197f17d1	\N	EMULGADE 1000	QC-CRE-007	6.000	60.0000	2026-09-02 14:06:14.572	2026-09-02 14:06:14.572
1d9ab2de-3561-44e6-8918-da38d1dee457	edcd15b3-ed98-49ac-9c24-6ab1197f17d1	\N	ALCOHOL CETILICO	QC-CRE-008	5.000	50.0000	2026-09-02 14:06:14.574	2026-09-02 14:06:14.574
c19ef67d-a906-4e5b-8805-abc5a9ae7172	edcd15b3-ed98-49ac-9c24-6ab1197f17d1	\N	ACEITE DE ALMENDRAS	QC-CRE-009	2.000	20.0000	2026-09-02 14:06:14.576	2026-09-02 14:06:14.576
70d449ac-932b-448e-8e80-69d59d25d2a7	edcd15b3-ed98-49ac-9c24-6ab1197f17d1	\N	VITAMINA E	QC-CRE-010	0.300	3.0000	2026-09-02 14:06:14.579	2026-09-02 14:06:14.579
e49618b8-afa5-49b2-bdca-781ca384dc45	edcd15b3-ed98-49ac-9c24-6ab1197f17d1	\N	PROCIDE CG	QC-CRE-011	0.250	2.5000	2026-09-02 14:06:14.581	2026-09-02 14:06:14.581
e4e98ad0-d20f-46d7-8bfb-0c1a8e59e373	edcd15b3-ed98-49ac-9c24-6ab1197f17d1	\N	FRAGANCIA	QC-CRE-012	0.100	1.0000	2026-09-02 14:06:14.583	2026-09-02 14:06:14.583
078a99db-79ee-495d-8164-4da3920d046c	edcd15b3-ed98-49ac-9c24-6ab1197f17d1	\N	ACIDO CITRICO	QC-CRE-013	0.200	2.0000	2026-09-02 14:06:14.585	2026-09-02 14:06:14.585
ca33ea15-c880-48db-8bc7-3a35260614dc	865abe9b-40f8-4e44-9622-2959b2bbd744	\N	PROCIDE CG	QC-CRE-001	0.250	2.5000	2026-09-02 14:06:14.593	2026-09-02 14:06:14.593
845f0644-4a0c-4aba-b094-1908df789254	865abe9b-40f8-4e44-9622-2959b2bbd744	\N	ALCANFOR EN CRISTALES	QC-CRE-002	1.000	10.0000	2026-09-02 14:06:14.596	2026-09-02 14:06:14.596
30fd4a78-897b-4b7b-be26-c58eb48ed8e4	865abe9b-40f8-4e44-9622-2959b2bbd744	\N	ALCOHOL CETILICO	QC-CRE-003	8.000	80.0000	2026-09-02 14:06:14.598	2026-09-02 14:06:14.598
730a8f91-6381-47a2-95db-d10d438900d5	865abe9b-40f8-4e44-9622-2959b2bbd744	\N	DEHYQUART	QC-CRE-004	8.000	80.0000	2026-09-02 14:06:14.6	2026-09-02 14:06:14.6
6499f7ea-a004-49c8-bea0-4bf7a1e38594	865abe9b-40f8-4e44-9622-2959b2bbd744	\N	MENTOL EN CRISTALES	QC-CRE-005	1.000	10.0000	2026-09-02 14:06:14.603	2026-09-02 14:06:14.603
7a168b29-9c28-48b8-8ee4-b22d2e4ef9bd	865abe9b-40f8-4e44-9622-2959b2bbd744	\N	ACEITE ESENCIAL DE ROMERO	QC-CRE-006	0.500	5.0000	2026-09-02 14:06:14.605	2026-09-02 14:06:14.605
c433f756-00aa-4e88-a5e2-72a99bc018b2	865abe9b-40f8-4e44-9622-2959b2bbd744	\N	ACEITE DE CALENDULA	QC-CRE-007	0.500	5.0000	2026-09-02 14:06:14.607	2026-09-02 14:06:14.607
69050875-a689-461e-aed5-9869c91ed834	865abe9b-40f8-4e44-9622-2959b2bbd744	\N	VITAMINA E	QC-CRE-008	0.100	1.0000	2026-09-02 14:06:14.61	2026-09-02 14:06:14.61
5d788cf6-717b-4d70-9433-558670143fc9	865abe9b-40f8-4e44-9622-2959b2bbd744	\N	EXTRAXTO DE CENTELLA ASIATICA	QC-CRE-009	0.500	5.0000	2026-09-02 14:06:14.612	2026-09-02 14:06:14.612
287c008b-9ed7-4c4a-a0a4-1fe59f3c13f4	865abe9b-40f8-4e44-9622-2959b2bbd744	\N	EXTRAXTO DE ARNICA	QC-CRE-010	0.300	3.0000	2026-09-02 14:06:14.614	2026-09-02 14:06:14.614
de30819d-5bde-4b39-b12f-a7b4c848a151	865abe9b-40f8-4e44-9622-2959b2bbd744	\N	EXTRACTO DE ALOE VERA	QC-CRE-011	0.500	5.0000	2026-09-02 14:06:14.616	2026-09-02 14:06:14.616
c4a41f10-75bc-4b1b-b936-229467048c02	865abe9b-40f8-4e44-9622-2959b2bbd744	\N	ACIDO LACTICO	QC-CRE-012	0.200	2.0000	2026-09-02 14:06:14.619	2026-09-02 14:06:14.619
41576fd4-24ff-4141-8ce7-4b863beab2d4	865abe9b-40f8-4e44-9622-2959b2bbd744	\N	AGUA DESIONIZADA	QC-CRE-013	79.140	791.0000	2026-09-02 14:06:14.621	2026-09-02 14:06:14.621
37250587-c7bc-4eab-b580-71783211593d	084c7afd-2488-4cc4-9e8e-afba348e97a9	\N	ALCOHOL CETILICO	QC-CRE-001	7.000	70.0000	2026-09-02 14:06:14.629	2026-09-02 14:06:14.629
8770740e-732f-4b74-a79b-5ae8f0bcca4e	084c7afd-2488-4cc4-9e8e-afba348e97a9	\N	DEHYQUART	QC-CRE-002	7.000	70.0000	2026-09-02 14:06:14.632	2026-09-02 14:06:14.632
25af92bc-32e7-4472-ab68-d464a7c2c11f	084c7afd-2488-4cc4-9e8e-afba348e97a9	\N	ACIDO HIALURONICO	QC-CRE-003	0.100	1.0000	2026-09-02 14:06:14.634	2026-09-02 14:06:14.634
d0fa83fc-f37c-4ecb-83e8-a22ba4af68ab	084c7afd-2488-4cc4-9e8e-afba348e97a9	\N	FRAGANCIA	QC-CRE-004	0.250	2.5000	2026-09-02 14:06:14.637	2026-09-02 14:06:14.637
b6fc2350-6935-4db6-b084-da2e31ee9d28	084c7afd-2488-4cc4-9e8e-afba348e97a9	\N	ACIDO KOJICO	QC-CRE-005	0.500	5.0000	2026-09-02 14:06:14.639	2026-09-02 14:06:14.639
062faf1e-4ae8-4e25-856a-eb1ca1f8a52e	084c7afd-2488-4cc4-9e8e-afba348e97a9	\N	ACIDO LACTICO	QC-CRE-006	1.000	10.0000	2026-09-02 14:06:14.642	2026-09-02 14:06:14.642
ee16f377-2c8e-4083-b861-e403ee765f4d	084c7afd-2488-4cc4-9e8e-afba348e97a9	\N	AGUA DESIONIZADA	QC-CRE-007	84.040	840.0000	2026-09-02 14:06:14.644	2026-09-02 14:06:14.644
d9ead6f6-1078-43d1-a996-0901f44bb0fc	084c7afd-2488-4cc4-9e8e-afba348e97a9	\N	PROCIDE CG	QC-CRE-008	0.100	1.0000	2026-09-02 14:06:14.646	2026-09-02 14:06:14.646
2a4ef013-c8bc-4382-9b43-2dbcf94b7153	706db1a8-ee44-4401-b17c-ef5e055ee996	\N	ALCOHOL CETILICO	QC-CRE-001	5.000	50.0000	2026-09-02 14:06:14.654	2026-09-02 14:06:14.654
595ce121-3304-430c-88a8-5244dbfa1a23	706db1a8-ee44-4401-b17c-ef5e055ee996	\N	DEHYQUART	QC-CRE-002	5.000	50.0000	2026-09-02 14:06:14.656	2026-09-02 14:06:14.656
4ca07f51-e904-4ac6-8a27-97a485edf672	706db1a8-ee44-4401-b17c-ef5e055ee996	\N	ALCANFOR	QC-CRE-003	1.000	10.0000	2026-09-02 14:06:14.658	2026-09-02 14:06:14.658
1c084a0f-99e3-4310-b319-20cf864b776c	706db1a8-ee44-4401-b17c-ef5e055ee996	\N	MENTOL EN CRISTALES	QC-CRE-004	1.000	10.0000	2026-09-02 14:06:14.66	2026-09-02 14:06:14.66
6ad5a9e3-0563-44e5-b95f-45628830a8d7	706db1a8-ee44-4401-b17c-ef5e055ee996	\N	ACEITE ESENCIAL DE ROMERO	QC-CRE-005	0.500	5.0000	2026-09-02 14:06:14.662	2026-09-02 14:06:14.662
efa0fc64-3854-457f-8916-5e7d529561a2	706db1a8-ee44-4401-b17c-ef5e055ee996	\N	AGUA DESIONIZADA	QC-CRE-006	87.040	870.0000	2026-09-02 14:06:14.664	2026-09-02 14:06:14.664
7da79d7a-0572-4c45-9036-6f0e23986c59	706db1a8-ee44-4401-b17c-ef5e055ee996	\N	PROCIDE CG	QC-CRE-007	0.250	2.5000	2026-09-02 14:06:14.667	2026-09-02 14:06:14.667
28b6a3f0-3914-4d0d-903d-5259263ce9f5	706db1a8-ee44-4401-b17c-ef5e055ee996	\N	COLORANTE VERDE	QC-CRE-008	0.200	2.0000	2026-09-02 14:06:14.669	2026-09-02 14:06:14.669
67e18dbc-584e-430d-9a24-dd806cc2e578	2c5c096c-a322-4778-abe0-2582177ee72b	\N	ALCOHOL CETILICO	QC-CRE-001	7.000	70.0000	2026-09-02 14:06:14.675	2026-09-02 14:06:14.675
bef6bfc6-2785-4ad0-9eaf-5eb8d42c12e6	2c5c096c-a322-4778-abe0-2582177ee72b	\N	DEHYQUART	QC-CRE-002	7.000	70.0000	2026-09-02 14:06:14.678	2026-09-02 14:06:14.678
f5e0d6ef-eb17-4f32-bb9f-44ed589deac8	2c5c096c-a322-4778-abe0-2582177ee72b	\N	COLAGENO	QC-CRE-003	3.000	30.0000	2026-09-02 14:06:14.68	2026-09-02 14:06:14.68
624ab07a-2eb0-4a42-be48-b70b3bbf46a0	2c5c096c-a322-4778-abe0-2582177ee72b	\N	CAFEINA	QC-CRE-004	3.000	30.0000	2026-09-02 14:06:14.682	2026-09-02 14:06:14.682
b9213fef-e85d-4215-b8b6-6c167faa61e9	2c5c096c-a322-4778-abe0-2582177ee72b	\N	ACIDO HIALURONICO	QC-CRE-005	0.050	0.5000	2026-09-02 14:06:14.684	2026-09-02 14:06:14.684
c2ed84e6-0888-4d42-87bc-499c1038a6e5	2c5c096c-a322-4778-abe0-2582177ee72b	\N	GLICERINA	QC-CRE-006	2.000	20.0000	2026-09-02 14:06:14.686	2026-09-02 14:06:14.686
c48a0380-ba77-448b-bff5-fd033d3eafe2	2c5c096c-a322-4778-abe0-2582177ee72b	\N	AGUA DESIONIZADA	QC-CRE-007	77.240	772.0000	2026-09-02 14:06:14.688	2026-09-02 14:06:14.688
915b1029-8774-4d49-aea8-b1e8c96cb522	2c5c096c-a322-4778-abe0-2582177ee72b	\N	PROCIDE CG	QC-CRE-008	0.500	5.0000	2026-09-02 14:06:14.691	2026-09-02 14:06:14.691
0abcb938-0c17-478f-af5c-c4dcbe4d91a4	2c5c096c-a322-4778-abe0-2582177ee72b	\N	FRAGANCIA	QC-CRE-009	0.200	2.0000	2026-09-02 14:06:14.693	2026-09-02 14:06:14.693
d99eb28c-047b-4d08-a998-959069020771	d301f931-4e18-49f2-a285-eeb29ae0d875	\N	ALCOHOL CETILICO	QC-CRE-001	6.000	60.0000	2026-09-02 14:06:14.699	2026-09-02 14:06:14.699
e0d68cad-9c53-4e86-b071-3dd1df2164de	d301f931-4e18-49f2-a285-eeb29ae0d875	\N	DEHYQUART	QC-CRE-002	6.000	60.0000	2026-09-02 14:06:14.701	2026-09-02 14:06:14.701
7e2b5296-4609-4d68-902e-9dda2c5b64ef	d301f931-4e18-49f2-a285-eeb29ae0d875	\N	ACIDO SALICILICO	QC-CRE-003	5.000	50.0000	2026-09-02 14:06:14.703	2026-09-02 14:06:14.703
dd71f970-c26e-4619-b6a7-ca04caf15896	d301f931-4e18-49f2-a285-eeb29ae0d875	\N	TERBINAFINA	QC-CRE-004	1.500	15.0000	2026-09-02 14:06:14.705	2026-09-02 14:06:14.705
c08c3d93-9bb3-4356-9ac5-77afae75a7ba	d301f931-4e18-49f2-a285-eeb29ae0d875	\N	MENTOL EN  CRISTAL	QC-CRE-005	0.200	2.0000	2026-09-02 14:06:14.708	2026-09-02 14:06:14.708
e1bab153-51f8-409a-bb7c-279091dc2050	d301f931-4e18-49f2-a285-eeb29ae0d875	\N	GLICERINA	QC-CRE-006	3.400	34.0000	2026-09-02 14:06:14.71	2026-09-02 14:06:14.71
da233805-1ec4-433a-abb3-ce3ad7f5d3fa	d301f931-4e18-49f2-a285-eeb29ae0d875	\N	AGUA DESIONIZADA	QC-CRE-007	77.140	771.0000	2026-09-02 14:06:14.712	2026-09-02 14:06:14.712
19b618ee-9f2a-4444-ad98-2db7354064dd	d301f931-4e18-49f2-a285-eeb29ae0d875	\N	PROCIDE CG	QC-CRE-008	0.250	2.5000	2026-09-02 14:06:14.714	2026-09-02 14:06:14.714
44364037-2d91-45fb-ba30-0c4bdd5c38bf	d301f931-4e18-49f2-a285-eeb29ae0d875	\N	ACEITE ESENSIAL DE ARBOL DEL TÉ	QC-CRE-009	0.500	5.0000	2026-09-02 14:06:14.716	2026-09-02 14:06:14.716
f94b1644-c696-4744-b13a-1de2e193e40e	1def0793-ff79-4508-bb11-4f4e5de9d7fb	\N	ALCOHOL CETILICO	QC-CRE-001	7.000	70.0000	2026-09-02 14:06:14.723	2026-09-02 14:06:14.723
906fa66b-4427-4659-bb36-b1287c9e9602	1def0793-ff79-4508-bb11-4f4e5de9d7fb	\N	DEHYQUART	QC-CRE-002	7.000	70.0000	2026-09-02 14:06:14.725	2026-09-02 14:06:14.725
db29ca53-6b00-4c92-90b7-8a5c7f11b542	1def0793-ff79-4508-bb11-4f4e5de9d7fb	\N	CAFEINA	QC-CRE-003	2.000	20.0000	2026-09-02 14:06:14.727	2026-09-02 14:06:14.727
ab8a90b1-abca-48c4-aa59-1631ab068300	1def0793-ff79-4508-bb11-4f4e5de9d7fb	\N	COLAGENO	QC-CRE-004	1.000	10.0000	2026-09-02 14:06:14.73	2026-09-02 14:06:14.73
2e76d7c0-55f1-4673-af93-355a92c257fd	1def0793-ff79-4508-bb11-4f4e5de9d7fb	\N	EXTRACTO DE CASTAÑA DE INDIAS	QC-CRE-005	1.500	15.0000	2026-09-02 14:06:14.732	2026-09-02 14:06:14.732
ab04e9ae-de6d-4616-8a7d-5be436fb2b22	1def0793-ff79-4508-bb11-4f4e5de9d7fb	\N	EXTRACTO DE ARNICA	QC-CRE-006	1.000	10.0000	2026-09-02 14:06:14.734	2026-09-02 14:06:14.734
8b8b25dd-1a85-4e89-87cb-6afdfeea5612	1def0793-ff79-4508-bb11-4f4e5de9d7fb	\N	GLICERINA	QC-CRE-007	3.000	30.0000	2026-09-02 14:06:14.736	2026-09-02 14:06:14.736
e6f403da-bd52-444d-bba1-5de37dfdf3b5	1def0793-ff79-4508-bb11-4f4e5de9d7fb	\N	SILICONA A LA GRASA 1000	QC-CRE-008	2.000	20.0000	2026-09-02 14:06:14.738	2026-09-02 14:06:14.738
7cbfabe3-3ef4-4932-9d93-e09bedd6e86c	1def0793-ff79-4508-bb11-4f4e5de9d7fb	\N	AGUA DESIONIZADA	QC-CRE-009	75.040	750.0000	2026-09-02 14:06:14.74	2026-09-02 14:06:14.74
62633c9e-51fa-4fdf-9649-c2223167fac6	1def0793-ff79-4508-bb11-4f4e5de9d7fb	\N	PROCIDE CG	QC-CRE-010	0.250	2.5000	2026-09-02 14:06:14.742	2026-09-02 14:06:14.742
9bdff675-f21d-4577-ac61-30a4cd79e3fd	1def0793-ff79-4508-bb11-4f4e5de9d7fb	\N	FRAGANCIA	QC-CRE-011	0.200	2.0000	2026-09-02 14:06:14.744	2026-09-02 14:06:14.744
eaae7ccc-7f44-4ca9-89f9-f20fce9049c3	1de09b72-72ca-40c1-b974-ce60f86600a9	\N	ALCOHOL CETILICO	QC-CRE-001	7.000	70.0000	2026-09-02 14:06:14.751	2026-09-02 14:06:14.751
2bb33cd5-bfc7-41ed-85d8-6cb636d73b1a	1de09b72-72ca-40c1-b974-ce60f86600a9	\N	DEHYQUART	QC-CRE-002	7.000	70.0000	2026-09-02 14:06:14.763	2026-09-02 14:06:14.763
fc11ed77-18d6-4bf8-b9c5-32da0d32cf38	1de09b72-72ca-40c1-b974-ce60f86600a9	\N	CAFEINA	QC-CRE-003	2.000	20.0000	2026-09-02 14:06:14.765	2026-09-02 14:06:14.765
199efa2b-2d3b-45ad-96e9-af615a9d95d2	1de09b72-72ca-40c1-b974-ce60f86600a9	\N	COLAGENO	QC-CRE-004	1.000	10.0000	2026-09-02 14:06:14.767	2026-09-02 14:06:14.767
6263caee-c01a-4f70-9a02-abfdaab0cacd	1de09b72-72ca-40c1-b974-ce60f86600a9	\N	EXTRACTO DE CASTAÑA DE INDIAS	QC-CRE-005	1.500	15.0000	2026-09-02 14:06:14.769	2026-09-02 14:06:14.769
1b0e55ff-0962-45b1-909c-417926fd73c5	1de09b72-72ca-40c1-b974-ce60f86600a9	\N	EXTRACTO DE ARNICA	QC-CRE-006	1.000	10.0000	2026-09-02 14:06:14.771	2026-09-02 14:06:14.771
15e23411-3b01-424d-a039-c78559eef2b6	1de09b72-72ca-40c1-b974-ce60f86600a9	\N	GLICERINA	QC-CRE-007	3.000	30.0000	2026-09-02 14:06:14.773	2026-09-02 14:06:14.773
901f23be-6d5b-4b90-81a2-2b5c1f39a163	1de09b72-72ca-40c1-b974-ce60f86600a9	\N	SILICONA A LA GRASA 1000	QC-CRE-008	2.000	20.0000	2026-09-02 14:06:14.775	2026-09-02 14:06:14.775
4a3fff42-308e-49c0-8d3e-71c1e04d4cdf	1de09b72-72ca-40c1-b974-ce60f86600a9	\N	AGUA DESIONIZADA	QC-CRE-009	75.040	750.0000	2026-09-02 14:06:14.776	2026-09-02 14:06:14.776
854a41a2-7298-4be2-829c-540cb9bbf3c9	1de09b72-72ca-40c1-b974-ce60f86600a9	\N	PROCIDE CG	QC-CRE-010	0.250	2.5000	2026-09-02 14:06:14.778	2026-09-02 14:06:14.778
f8995863-be92-42cc-b58b-909017b6a301	1de09b72-72ca-40c1-b974-ce60f86600a9	\N	FRAGANCIA	QC-CRE-011	0.200	2.0000	2026-09-02 14:06:14.781	2026-09-02 14:06:14.781
5a642460-4863-4697-9bee-d9943dee224e	871df356-4f5b-483c-b5f1-5e21d0bf6eb7	\N	ALCOHOL CETILICO	QC-CRE-001	8.000	80.0000	2026-09-02 14:06:14.787	2026-09-02 14:06:14.787
6797003f-04d7-42c5-9861-ab0e1134c2f4	871df356-4f5b-483c-b5f1-5e21d0bf6eb7	\N	DEHYQUART	QC-CRE-002	8.000	80.0000	2026-09-02 14:06:14.789	2026-09-02 14:06:14.789
210a5e2d-8c10-4dfa-9ba5-7d12a487153f	871df356-4f5b-483c-b5f1-5e21d0bf6eb7	\N	ALCANFOR	QC-CRE-003	1.000	10.0000	2026-09-02 14:06:14.791	2026-09-02 14:06:14.791
00605ecc-86ae-4b90-9abc-6010e681007a	871df356-4f5b-483c-b5f1-5e21d0bf6eb7	\N	MENTOL EN CRISTALES	QC-CRE-004	1.000	10.0000	2026-09-02 14:06:14.794	2026-09-02 14:06:14.794
4a0b2f99-72c3-49fb-8035-f85207b56587	871df356-4f5b-483c-b5f1-5e21d0bf6eb7	\N	ACEITE ESENCIAL DE ROMERO	QC-CRE-005	0.500	5.0000	2026-09-02 14:06:14.796	2026-09-02 14:06:14.796
5c287887-db4c-4db8-9ce9-185fd7f32600	871df356-4f5b-483c-b5f1-5e21d0bf6eb7	\N	CLORURO DE MAGNESIO	QC-CRE-006	2.000	20.0000	2026-09-02 14:06:14.798	2026-09-02 14:06:14.798
0a2df291-3d00-4faf-bc65-a65d8ec06b0b	871df356-4f5b-483c-b5f1-5e21d0bf6eb7	\N	AGUA DESIONIZADA	QC-CRE-007	79.240	792.0000	2026-09-02 14:06:14.8	2026-09-02 14:06:14.8
42906e32-7599-4bbd-90ac-8dba998a2e13	871df356-4f5b-483c-b5f1-5e21d0bf6eb7	\N	PROCIDE CG	QC-CRE-008	0.250	2.5000	2026-09-02 14:06:14.802	2026-09-02 14:06:14.802
f2306af4-66cf-4373-9124-99a163dc31ee	5ec0194c-0b20-4832-8e5c-5929e342ee9b	\N	AGUA DESIONIZADA	QC-CRE-001	76.070	717.0000	2026-09-02 14:06:14.808	2026-09-02 14:06:14.808
c73c0c65-850d-47c5-b8f9-8784cd8761ce	5ec0194c-0b20-4832-8e5c-5929e342ee9b	\N	GLICERINA	QC-CRE-002	3.180	30.0000	2026-09-02 14:06:14.811	2026-09-02 14:06:14.811
398fd14a-1615-4da0-b53a-53b7e8810ac8	5ec0194c-0b20-4832-8e5c-5929e342ee9b	\N	COLAGENO	QC-CRE-003	1.060	10.0000	2026-09-02 14:06:14.813	2026-09-02 14:06:14.813
a7ee7557-db0c-46f2-a509-98585ce80ef2	5ec0194c-0b20-4832-8e5c-5929e342ee9b	\N	ACIDO HIALURONICO	QC-CRE-004	0.110	1.0000	2026-09-02 14:06:14.815	2026-09-02 14:06:14.815
da3b2791-0648-48d7-b2ad-fc6f75b21e77	5ec0194c-0b20-4832-8e5c-5929e342ee9b	\N	VITAMINA C	QC-CRE-005	0.320	3.0000	2026-09-02 14:06:14.817	2026-09-02 14:06:14.817
7056d3d7-dbbf-4c3f-94bf-a2bf3c9a56b2	5ec0194c-0b20-4832-8e5c-5929e342ee9b	\N	VITAMINA E	QC-CRE-006	0.210	2.0000	2026-09-02 14:06:14.819	2026-09-02 14:06:14.819
b2ad44d4-a5dc-49f7-bc4c-8d1962051606	5ec0194c-0b20-4832-8e5c-5929e342ee9b	\N	EXTRAXTO DE ALOE VERA	QC-CRE-007	1.060	10.0000	2026-09-02 14:06:14.821	2026-09-02 14:06:14.821
ea6ca4a9-6128-4bb3-8320-ecd340710bc9	5ec0194c-0b20-4832-8e5c-5929e342ee9b	\N	EXTRAXTO DE TE VERDE	QC-CRE-008	0.530	5.0000	2026-09-02 14:06:14.823	2026-09-02 14:06:14.823
17aa7169-9a00-4121-8d8b-446b5c828bce	5ec0194c-0b20-4832-8e5c-5929e342ee9b	\N	ACEITE DE RICINO	QC-CRE-009	1.060	10.0000	2026-09-02 14:06:14.825	2026-09-02 14:06:14.825
7f648f30-2abb-4cc3-a877-82af24882512	5ec0194c-0b20-4832-8e5c-5929e342ee9b	\N	DIMETICONA	QC-CRE-010	1.060	10.0000	2026-09-02 14:06:14.827	2026-09-02 14:06:14.827
0ab74db0-8b06-47fd-b849-72de3af5a404	5ec0194c-0b20-4832-8e5c-5929e342ee9b	\N	PROCIDE CG	QC-CRE-011	0.270	2.5000	2026-09-02 14:06:14.829	2026-09-02 14:06:14.829
ea392049-99ce-44ba-b44e-ac708746b8f4	5ec0194c-0b20-4832-8e5c-5929e342ee9b	\N	FRAGANCIA	QC-CRE-012	0.210	2.0000	2026-09-02 14:06:14.831	2026-09-02 14:06:14.831
0f596b13-c127-4ea6-8993-6d1b0ebba827	5ec0194c-0b20-4832-8e5c-5929e342ee9b	\N	ALCOHOL CETLICO	QC-CRE-013	7.430	70.0000	2026-09-02 14:06:14.833	2026-09-02 14:06:14.833
4043bddf-4b53-458d-9577-c78ec5b2c351	5ec0194c-0b20-4832-8e5c-5929e342ee9b	\N	DEHYCUART	QC-CRE-014	7.430	70.0000	2026-09-02 14:06:14.835	2026-09-02 14:06:14.835
c1845e4e-10cd-4cdc-b327-038a23545571	439d0975-3402-485e-a122-2cea9dec16f6	\N	ALCOHOL CETILICO	QC-CRE-001	7.000	70.0000	2026-09-02 14:06:14.844	2026-09-02 14:06:14.844
df3c9ca0-353f-4f63-800b-367ffcdd6980	439d0975-3402-485e-a122-2cea9dec16f6	\N	DEHYQUART	QC-CRE-002	7.000	70.0000	2026-09-02 14:06:14.847	2026-09-02 14:06:14.847
f7763b06-5a73-4aab-9281-def0dec45d7a	439d0975-3402-485e-a122-2cea9dec16f6	\N	ACEITE DE RICINO	QC-CRE-003	1.000	10.0000	2026-09-02 14:06:14.849	2026-09-02 14:06:14.849
4bd41f5d-4fc1-443f-beb8-137e214f81a1	439d0975-3402-485e-a122-2cea9dec16f6	\N	DIOXIDO DE TITANIO	QC-CRE-004	1.000	10.0000	2026-09-02 14:06:14.851	2026-09-02 14:06:14.851
49d2d0e6-c404-47f9-bbd4-b90136f6d6ef	439d0975-3402-485e-a122-2cea9dec16f6	\N	OXIDO DE ZINC	QC-CRE-005	1.500	15.0000	2026-09-02 14:06:14.854	2026-09-02 14:06:14.854
dbda2030-adf5-4b63-81ea-f50e5340ad1f	439d0975-3402-485e-a122-2cea9dec16f6	\N	VITAMINA E	QC-CRE-006	0.100	1.0000	2026-09-02 14:06:14.856	2026-09-02 14:06:14.856
f53db2b4-fd2d-4cfe-9414-f571cd60ca78	439d0975-3402-485e-a122-2cea9dec16f6	\N	PANTENOL	QC-CRE-007	0.100	1.0000	2026-09-02 14:06:14.858	2026-09-02 14:06:14.858
b4c5a9d6-5170-44f6-912f-cc628a29ae43	439d0975-3402-485e-a122-2cea9dec16f6	\N	ACIDO CITRICO	QC-CRE-008	0.200	2.0000	2026-09-02 14:06:14.862	2026-09-02 14:06:14.862
080ef27e-a04d-4899-9abf-bad1362a1a39	439d0975-3402-485e-a122-2cea9dec16f6	\N	FRAGANCIA	QC-CRE-009	0.500	5.0000	2026-09-02 14:06:14.865	2026-09-02 14:06:14.865
7275c526-ab87-4a5c-82e1-2695f420aab6	439d0975-3402-485e-a122-2cea9dec16f6	\N	PROCIDE CG	QC-CRE-010	0.200	2.0000	2026-09-02 14:06:14.868	2026-09-02 14:06:14.868
ff393984-a4ba-475b-b83c-67a620f2e9b6	439d0975-3402-485e-a122-2cea9dec16f6	\N	AGUA DESIONIZADA	QC-CRE-011	0.200	2.0000	2026-09-02 14:06:14.871	2026-09-02 14:06:14.871
4adb6b56-20bc-448c-8eb2-0cffe3574dbc	439d0975-3402-485e-a122-2cea9dec16f6	\N	PROCIDE CG	QC-CRE-012	81.200	812.0000	2026-09-02 14:06:14.874	2026-09-02 14:06:14.874
71e73377-1308-44cf-8f94-c97a9f0de92d	26319221-83f5-4b08-8e3f-2ec3a906c1ba	\N	AGUA DESIONIZADA	QC-CRE-001	85.100	851.0000	2026-09-02 14:06:14.885	2026-09-02 14:06:14.885
380fce68-2252-4f79-831f-c99db494bb24	26319221-83f5-4b08-8e3f-2ec3a906c1ba	\N	ALCOHOL CETILICO	QC-CRE-002	7.000	70.0000	2026-09-02 14:06:14.888	2026-09-02 14:06:14.888
49cfcd85-0847-4236-94d9-233aae222183	26319221-83f5-4b08-8e3f-2ec3a906c1ba	\N	DEHYQUART	QC-CRE-003	7.000	70.0000	2026-09-02 14:06:14.892	2026-09-02 14:06:14.892
68bfc28b-3256-4b5b-9e6b-4966c1c6f9a3	26319221-83f5-4b08-8e3f-2ec3a906c1ba	\N	ACEITE ESENCIAL ROMERO	QC-CRE-004	0.250	2.5000	2026-09-02 14:06:14.895	2026-09-02 14:06:14.895
9f13494a-def7-4c32-90d5-ef0bf4070c95	26319221-83f5-4b08-8e3f-2ec3a906c1ba	\N	MINOXIDIL	QC-CRE-005	0.400	4.0000	2026-09-02 14:06:14.898	2026-09-02 14:06:14.898
ebfc729d-c8e8-4a66-8746-e9bcd4a170e9	26319221-83f5-4b08-8e3f-2ec3a906c1ba	\N	PROCIDE CG	QC-CRE-006	0.250	2.5000	2026-09-02 14:06:14.901	2026-09-02 14:06:14.901
45faa271-7d77-4dbb-8929-3c9635b8aa6c	ec5535c7-c614-432c-9a51-1e82bd9f62c0	\N	VASELINA LIQUIDA	QC-BAL-001	77.910	790.0000	2026-09-02 14:06:14.909	2026-09-02 14:06:14.909
c05309c8-2c95-4978-b7d2-bbfca0eefeba	ec5535c7-c614-432c-9a51-1e82bd9f62c0	\N	CERA DE ABEJA VIRGEN	QC-BAL-002	11.830	120.0000	2026-09-02 14:06:14.912	2026-09-02 14:06:14.912
fb5804dc-7052-48f7-b6ff-d95b0870742e	ec5535c7-c614-432c-9a51-1e82bd9f62c0	\N	CERA CARNAUBA	QC-BAL-003	0.990	10.0000	2026-09-02 14:06:14.915	2026-09-02 14:06:14.915
5c936da6-3d31-4d5a-baee-bb3c024e94b5	ec5535c7-c614-432c-9a51-1e82bd9f62c0	\N	ALCOHOL CETILICO	QC-BAL-004	7.890	80.0000	2026-09-02 14:06:14.918	2026-09-02 14:06:14.918
aab1b20b-213c-4205-a29a-e3dd0b6358a9	ec5535c7-c614-432c-9a51-1e82bd9f62c0	\N	VITAMINA E	QC-BAL-005	0.990	10.0000	2026-09-02 14:06:14.92	2026-09-02 14:06:14.92
d45a308e-9681-4252-b0c3-9639ac834c50	ec5535c7-c614-432c-9a51-1e82bd9f62c0	\N	DIOXIDO DE TITANIO	QC-BAL-006	0.200	2.0000	2026-09-02 14:06:14.922	2026-09-02 14:06:14.922
137f8bb1-ca5a-4be6-a64d-f7611fd30d79	ec5535c7-c614-432c-9a51-1e82bd9f62c0	\N	FRAGANCIA ROSAS	QC-BAL-007	0.200	2.0000	2026-09-02 14:06:14.925	2026-09-02 14:06:14.925
44dcadbc-0f77-4ba9-9a0f-ff147be05c8a	fcd05db5-1f19-4a83-b47b-e76278dd6bd2	\N	POLISORBATO 20	QC-LIQ-013	2.000	20.0000	2026-09-02 14:06:15.139	2026-09-02 14:06:15.139
fc7944a3-c3b2-4d28-8af0-42a541a875d4	23e048f3-728d-4c9a-a563-6e72c07df54c	\N	VASELINA SOLIDA	QC-BAL-001	97.800	978.0000	2026-09-02 14:06:14.936	2026-09-02 14:06:14.936
020e9fea-57cd-4d22-9ab8-bca72f87221e	23e048f3-728d-4c9a-a563-6e72c07df54c	\N	ACEITE ESENCIAL ARNICA	QC-BAL-002	0.500	5.0000	2026-09-02 14:06:14.939	2026-09-02 14:06:14.939
292abe93-066c-45e6-a19f-616345b4f0d8	23e048f3-728d-4c9a-a563-6e72c07df54c	\N	ACEITE ESENCIAL LAVANDA	QC-BAL-003	0.500	5.0000	2026-09-02 14:06:14.941	2026-09-02 14:06:14.941
f2fa025a-bd3b-4971-8dc3-57d369e9ab8c	23e048f3-728d-4c9a-a563-6e72c07df54c	\N	MENTOL EN CRISTALES	QC-BAL-004	1.000	10.0000	2026-09-02 14:06:14.946	2026-09-02 14:06:14.946
823cb3e8-8adf-43b7-ad5b-821e3f5193b5	23e048f3-728d-4c9a-a563-6e72c07df54c	\N	VITAMINA E	QC-BAL-005	0.200	2.0000	2026-09-02 14:06:14.949	2026-09-02 14:06:14.949
d8dd9984-d6cb-48a5-916e-c9857cbbdf5f	9df7edc6-244b-43f9-9ac1-1c6f1c20fb4f	\N	VASELINA LIQUIDA	QC-ACE-001	96.100	961.0000	2026-09-02 14:06:14.956	2026-09-02 14:06:14.956
0b64d4cb-bb07-40de-95ae-528ae24d8516	9df7edc6-244b-43f9-9ac1-1c6f1c20fb4f	\N	MIRITATO DE ISOPROPILO	QC-ACE-002	3.000	30.0000	2026-09-02 14:06:14.96	2026-09-02 14:06:14.96
3ac30e1e-dc8a-4877-bf0c-679109cedaa4	9df7edc6-244b-43f9-9ac1-1c6f1c20fb4f	\N	VITAMINA E	QC-ACE-003	0.100	1.0000	2026-09-02 14:06:14.963	2026-09-02 14:06:14.963
e0c1ae1b-6c11-4e33-b600-880931c0f088	9df7edc6-244b-43f9-9ac1-1c6f1c20fb4f	\N	ACEITE ESENCIAL ROMERO	QC-ACE-004	0.200	2.0000	2026-09-02 14:06:14.966	2026-09-02 14:06:14.966
bae39d79-6159-4fdc-b8d4-d959fc19475b	9df7edc6-244b-43f9-9ac1-1c6f1c20fb4f	\N	ACEITE ESENCIAL MENTA	QC-ACE-005	0.200	2.0000	2026-09-02 14:06:14.968	2026-09-02 14:06:14.968
645018a6-3dc1-4d24-a42f-b8f5bdd6cc61	9df7edc6-244b-43f9-9ac1-1c6f1c20fb4f	\N	ACEITE ESENCIAL EUCALIPTO	QC-ACE-006	0.200	2.0000	2026-09-02 14:06:14.971	2026-09-02 14:06:14.971
b3427d1f-098c-43af-89a6-daa028abb073	9df7edc6-244b-43f9-9ac1-1c6f1c20fb4f	\N	ACEITE ESENCIAL LIMON	QC-ACE-007	0.200	2.0000	2026-09-02 14:06:14.973	2026-09-02 14:06:14.973
8c883f97-01db-4156-afd4-81631781d530	373354e6-a9ce-4e74-8082-4bf30e742b42	\N	VASELINA LIQUIDA	QC-ACE-001	88.300	883.0000	2026-09-02 14:06:14.985	2026-09-02 14:06:14.985
3c1e44e6-2432-4a54-81f4-03cc656fdd5e	373354e6-a9ce-4e74-8082-4bf30e742b42	\N	ACEITE DE ALMENDRAS	QC-ACE-002	5.000	50.0000	2026-09-02 14:06:14.988	2026-09-02 14:06:14.988
a7629566-9ab3-47d8-8e5a-25305e4ca57f	373354e6-a9ce-4e74-8082-4bf30e742b42	\N	ACEITE DE JOJOBA	QC-ACE-003	3.500	35.0000	2026-09-02 14:06:14.992	2026-09-02 14:06:14.992
9450f2ca-cc60-46dd-9e44-2c9f25d5b6d1	373354e6-a9ce-4e74-8082-4bf30e742b42	\N	ACEITE DE ROSA MOSQUETA	QC-ACE-004	2.000	20.0000	2026-09-02 14:06:14.998	2026-09-02 14:06:14.998
ab0fbd83-baa5-4db0-b69f-ec59be7fac34	373354e6-a9ce-4e74-8082-4bf30e742b42	\N	VITAMINA E	QC-ACE-005	0.500	5.0000	2026-09-02 14:06:15.002	2026-09-02 14:06:15.002
136f2512-6dae-476e-88f4-619947d4eb19	373354e6-a9ce-4e74-8082-4bf30e742b42	\N	ACEITE ESENCIAL ÁRBOL DEL TÉ	QC-ACE-006	0.700	7.0000	2026-09-02 14:06:15.006	2026-09-02 14:06:15.006
733f42f2-78da-4d02-b103-f124c44026f4	e97a196a-ef4d-4cb1-b11c-e2644da078da	\N	VASELINA LIQUIDA	QC-ACE-001	97.600	977.0000	2026-09-02 14:06:15.018	2026-09-02 14:06:15.018
5ca6f870-65f5-4d4c-b26c-954b25a6db21	e97a196a-ef4d-4cb1-b11c-e2644da078da	\N	ACEITE DE JOJOBA	QC-ACE-002	1.500	15.0000	2026-09-02 14:06:15.02	2026-09-02 14:06:15.02
109e6787-16b6-419d-9259-3d80cd8341cd	e97a196a-ef4d-4cb1-b11c-e2644da078da	\N	FRAGANCIA FRESA	QC-ACE-003	0.500	5.0000	2026-09-02 14:06:15.023	2026-09-02 14:06:15.023
4f329ad9-949a-4289-8d68-b0d0268f71e1	e97a196a-ef4d-4cb1-b11c-e2644da078da	\N	VITAMINA E	QC-ACE-004	0.200	2.0000	2026-09-02 14:06:15.027	2026-09-02 14:06:15.027
90ecd70f-5f80-4b08-879a-53d6e23064a0	e97a196a-ef4d-4cb1-b11c-e2644da078da	\N	COLORANTE ROJO	QC-ACE-005	0.200	2.0000	2026-09-02 14:06:15.032	2026-09-02 14:06:15.032
af4a332e-1cf7-4b9e-be6f-f19497672dfe	09b09657-6380-4601-ae92-8ec5657d9a7e	\N	VASELINA LIQUIDA	QC-ACE-001	99.000	990.0000	2026-09-02 14:06:15.047	2026-09-02 14:06:15.047
9d8da556-e8c4-493b-9b13-caab8c2345f0	09b09657-6380-4601-ae92-8ec5657d9a7e	\N	FRAGANCIA TEA TREE	QC-ACE-002	0.500	5.0000	2026-09-02 14:06:15.051	2026-09-02 14:06:15.051
01f6c79b-1766-41c5-a0cb-7b1dc6d28cb5	09b09657-6380-4601-ae92-8ec5657d9a7e	\N	ACEITE ESENCIAL DE ROMERO	QC-ACE-003	0.500	5.0000	2026-09-02 14:06:15.054	2026-09-02 14:06:15.054
a6e8e947-b322-49a6-a54e-fdce13f4d74f	0d81416b-050b-4144-b129-9aa2b7ae8679	\N	VASELINA LIQUIDO	QC-ACE-001	64.680	650.0000	2026-09-02 14:06:15.066	2026-09-02 14:06:15.066
97854cd3-f458-4c84-88cf-50d897de8c58	0d81416b-050b-4144-b129-9aa2b7ae8679	\N	MIRISTATO DE ISOPROPOLICO	QC-ACE-002	24.880	250.0000	2026-09-02 14:06:15.069	2026-09-02 14:06:15.069
ae358f99-e589-44a3-9188-3055ab58a187	0d81416b-050b-4144-b129-9aa2b7ae8679	\N	FRAGANCIA	QC-ACE-003	9.950	100.0000	2026-09-02 14:06:15.071	2026-09-02 14:06:15.071
246d277c-a43e-4702-a60c-a096a0dd1d43	0d81416b-050b-4144-b129-9aa2b7ae8679	\N	VITAMINA E	QC-ACE-004	0.500	5.0000	2026-09-02 14:06:15.074	2026-09-02 14:06:15.074
3af920ac-ee00-48a3-8c44-640c6af55b60	887ff0a0-dc22-413a-bc04-397cc690b4ca	\N	VASELINA LIQUIDA	QC-ACE-001	97.700	977.0000	2026-09-02 14:06:15.087	2026-09-02 14:06:15.087
afe32267-f7b3-438f-bca7-e52678768494	887ff0a0-dc22-413a-bc04-397cc690b4ca	\N	ACEITE DE JOJOBA	QC-ACE-002	1.500	15.0000	2026-09-02 14:06:15.089	2026-09-02 14:06:15.089
5268ad6f-3b0e-42f7-8758-3ddebf7848de	887ff0a0-dc22-413a-bc04-397cc690b4ca	\N	FRAGANCIA VAINILLA	QC-ACE-003	0.500	5.0000	2026-09-02 14:06:15.093	2026-09-02 14:06:15.093
52817d43-96b0-4f0e-aac6-5ed6ee89fead	887ff0a0-dc22-413a-bc04-397cc690b4ca	\N	VITAMINA E	QC-ACE-004	0.200	2.0000	2026-09-02 14:06:15.097	2026-09-02 14:06:15.097
b05dff60-f253-494f-aa90-ce3c3db68c32	887ff0a0-dc22-413a-bc04-397cc690b4ca	\N	COLORANTE A LA GRASA	QC-ACE-005	0.100	1.0000	2026-09-02 14:06:15.099	2026-09-02 14:06:15.099
2544f755-386f-4faf-bb24-96428f88d5a0	fcd05db5-1f19-4a83-b47b-e76278dd6bd2	\N	AGUA DESTILADA	QC-LIQ-001	81.040	810.0000	2026-09-02 14:06:15.108	2026-09-02 14:06:15.108
f7e18fcf-99f8-4295-8a7d-904cb503897c	fcd05db5-1f19-4a83-b47b-e76278dd6bd2	\N	ALCOHOL CETILICO	QC-LIQ-002	10.010	100.0000	2026-09-02 14:06:15.11	2026-09-02 14:06:15.11
4458b44f-82cd-42c4-ae91-377dfcb5e3a4	fcd05db5-1f19-4a83-b47b-e76278dd6bd2	\N	VINAGRE DE MANZANA	QC-LIQ-003	5.000	50.0000	2026-09-02 14:06:15.113	2026-09-02 14:06:15.113
5dc2aac8-fb20-47dd-8d3c-5f6e409938cc	fcd05db5-1f19-4a83-b47b-e76278dd6bd2	\N	ACEITE DE NEEM	QC-LIQ-004	0.200	2.0000	2026-09-02 14:06:15.115	2026-09-02 14:06:15.115
8f4f73bd-0895-4ee4-9c1a-ccdd2aa409c3	fcd05db5-1f19-4a83-b47b-e76278dd6bd2	\N	ACEITE ESENCIAL DE LAVANDA	QC-LIQ-005	0.100	1.0000	2026-09-02 14:06:15.117	2026-09-02 14:06:15.117
a1154b63-9d37-4271-af0d-3241fa3a260d	fcd05db5-1f19-4a83-b47b-e76278dd6bd2	\N	ACEITE ESENCIAL DE EUCALIPTO	QC-LIQ-006	0.100	1.0000	2026-09-02 14:06:15.12	2026-09-02 14:06:15.12
bd875dc8-9da5-4a7d-a6c3-3b772c0cd047	fcd05db5-1f19-4a83-b47b-e76278dd6bd2	\N	ACEITE ESENCIAL DE ROMERO	QC-LIQ-007	0.100	1.0000	2026-09-02 14:06:15.122	2026-09-02 14:06:15.122
cf6b59b1-3a63-4483-b9c6-e520e318dbfc	fcd05db5-1f19-4a83-b47b-e76278dd6bd2	\N	ACEITE ESENCIAL DE CITRONELLA	QC-LIQ-008	0.100	1.0000	2026-09-02 14:06:15.125	2026-09-02 14:06:15.125
8321e19e-5656-4c03-ace3-00be089077f4	fcd05db5-1f19-4a83-b47b-e76278dd6bd2	\N	GLICERINA	QC-LIQ-009	1.000	10.0000	2026-09-02 14:06:15.128	2026-09-02 14:06:15.128
3dd780e0-0bea-4e78-b4bf-bd4a6d32053e	fcd05db5-1f19-4a83-b47b-e76278dd6bd2	\N	BENZOATO DE SODIO	QC-LIQ-010	0.100	1.0000	2026-09-02 14:06:15.131	2026-09-02 14:06:15.131
b873e3f9-8d4f-4a4e-a599-e5c63f5fc74f	fcd05db5-1f19-4a83-b47b-e76278dd6bd2	\N	SORBATO DE POTASIO	QC-LIQ-011	0.050	0.5000	2026-09-02 14:06:15.134	2026-09-02 14:06:15.134
fce080aa-7143-42d8-acf1-fa82a7a03c9d	fcd05db5-1f19-4a83-b47b-e76278dd6bd2	\N	ACIDO CITRICO	QC-LIQ-012	0.200	2.0000	2026-09-02 14:06:15.137	2026-09-02 14:06:15.137
72ee8a4a-a32b-486c-a552-4942f81385e2	1207caaa-eb92-440f-8255-fc66d0ed68b9	\N	AGUA DESTILADA	QC-LIQ-001	90.300	903.0000	2026-09-02 14:06:15.148	2026-09-02 14:06:15.148
636be732-1f2a-41f7-bbbf-c60e0748a973	1207caaa-eb92-440f-8255-fc66d0ed68b9	\N	ACIDO LACTICO	QC-LIQ-002	0.200	2.0000	2026-09-02 14:06:15.151	2026-09-02 14:06:15.151
f9330813-ee3d-4020-a138-3c481bb5e871	1207caaa-eb92-440f-8255-fc66d0ed68b9	\N	BENZOATO DE SODIO	QC-LIQ-003	0.100	1.0000	2026-09-02 14:06:15.154	2026-09-02 14:06:15.154
f0c160dc-bf6a-4664-af28-2277029a214d	1207caaa-eb92-440f-8255-fc66d0ed68b9	\N	SORBATO DE POTASIO	QC-LIQ-004	0.050	0.5000	2026-09-02 14:06:15.157	2026-09-02 14:06:15.157
7d075f8b-4fb0-484d-bf60-b699b24e2955	1207caaa-eb92-440f-8255-fc66d0ed68b9	\N	EDTA TETRASODICO	QC-LIQ-005	0.050	0.5000	2026-09-02 14:06:15.161	2026-09-02 14:06:15.161
955f5681-f012-4acc-981e-ddde8c6374fb	1207caaa-eb92-440f-8255-fc66d0ed68b9	\N	GLICERINA	QC-LIQ-006	5.000	50.0000	2026-09-02 14:06:15.164	2026-09-02 14:06:15.164
15b53659-e76a-4ccd-93d6-53da0e1a5ac2	1207caaa-eb92-440f-8255-fc66d0ed68b9	\N	ACIDO CITRICO	QC-LIQ-007	0.300	3.0000	2026-09-02 14:06:15.166	2026-09-02 14:06:15.166
b904f1f0-b530-4228-aa30-549875fb152a	1207caaa-eb92-440f-8255-fc66d0ed68b9	\N	LIDOCAINA	QC-LIQ-008	4.000	40.0000	2026-09-02 14:06:15.169	2026-09-02 14:06:15.169
3fe32f91-d983-4f3d-8522-08062f008e65	276b0780-f0aa-4eb4-a1be-6ec9791e05a0	\N	AGUA DESTILADA	QC-LIQ-001	18.810	188.0000	2026-09-02 14:06:15.178	2026-09-02 14:06:15.178
1ea38a29-7d19-46fb-8315-d7c417c94cb9	276b0780-f0aa-4eb4-a1be-6ec9791e05a0	\N	BENZOATO DE SODIO	QC-LIQ-002	0.100	1.0000	2026-09-02 14:06:15.181	2026-09-02 14:06:15.181
216c9828-b0bc-44da-91d8-38a77fa18e12	276b0780-f0aa-4eb4-a1be-6ec9791e05a0	\N	SORBATO DE POTASIO	QC-LIQ-003	0.050	0.5000	2026-09-02 14:06:15.183	2026-09-02 14:06:15.183
180c4cec-73d5-4ec1-874b-4ebf99e4b17e	276b0780-f0aa-4eb4-a1be-6ec9791e05a0	\N	SACARINA SODICA	QC-LIQ-004	0.300	3.0000	2026-09-02 14:06:15.185	2026-09-02 14:06:15.185
65e6ad2f-6130-4696-b1cf-9fe8c45b6cb1	276b0780-f0aa-4eb4-a1be-6ec9791e05a0	\N	SORBITOL	QC-LIQ-005	10.010	100.0000	2026-09-02 14:06:15.188	2026-09-02 14:06:15.188
5b1b78fa-78cb-4e45-9625-1d0eda2be270	276b0780-f0aa-4eb4-a1be-6ec9791e05a0	\N	ALCOHOL EXTRANEUTRO	QC-LIQ-006	69.630	696.0000	2026-09-02 14:06:15.191	2026-09-02 14:06:15.191
1757df82-8c6a-4e4e-bbba-36f774dd9b71	276b0780-f0aa-4eb4-a1be-6ec9791e05a0	\N	SABORIZANTE  MENTA	QC-LIQ-007	1.000	10.0000	2026-09-02 14:06:15.193	2026-09-02 14:06:15.193
76420050-162f-4de7-9ddc-7ee76dbc8331	276b0780-f0aa-4eb4-a1be-6ec9791e05a0	\N	MENTOL EN CRISTALES	QC-LIQ-008	0.100	1.0000	2026-09-02 14:06:15.196	2026-09-02 14:06:15.196
b92971a8-2d44-459c-8386-d8838baab9f0	276b0780-f0aa-4eb4-a1be-6ec9791e05a0	\N	COLOR AL GUSTO SIN COLOR	QC-LIQ-009	0.000	0.0000	2026-09-02 14:06:15.198	2026-09-02 14:06:15.198
f71e9672-10ab-431e-8cbe-4f852feb434d	51c7e144-5777-4b07-8f9c-24d1cbf78fa5	\N	ACEITE ESENCIAL LAVANDA	QC-LIQ-001	0.500	5.0000	2026-09-02 14:06:15.206	2026-09-02 14:06:15.206
eaf6a048-2f79-4455-a6b9-b4b449dc44a2	51c7e144-5777-4b07-8f9c-24d1cbf78fa5	\N	ACEITE ESENCIAL ARBOL DEL TE	QC-LIQ-002	0.500	5.0000	2026-09-02 14:06:15.209	2026-09-02 14:06:15.209
6ec4f360-4e16-4de4-b85b-8015c664cd9b	51c7e144-5777-4b07-8f9c-24d1cbf78fa5	\N	POLISORBATO 20	QC-LIQ-003	4.000	40.0000	2026-09-02 14:06:15.211	2026-09-02 14:06:15.211
4901d57e-4f70-43af-b339-01c13380d0a8	51c7e144-5777-4b07-8f9c-24d1cbf78fa5	\N	AGUA DESIONIZADA	QC-LIQ-004	86.900	869.0000	2026-09-02 14:06:15.214	2026-09-02 14:06:15.214
07c7384b-0720-4375-a324-8786644f94c7	51c7e144-5777-4b07-8f9c-24d1cbf78fa5	\N	CLORHEXIDINA 20%	QC-LIQ-005	1.000	10.0000	2026-09-02 14:06:15.216	2026-09-02 14:06:15.216
dab5dec6-c4b8-413c-a470-1abb915fd83f	51c7e144-5777-4b07-8f9c-24d1cbf78fa5	\N	EXTRACTO DE CALENDULA	QC-LIQ-006	2.000	20.0000	2026-09-02 14:06:15.218	2026-09-02 14:06:15.218
6f815973-643a-439a-bad7-aa33f1bb8bbb	51c7e144-5777-4b07-8f9c-24d1cbf78fa5	\N	GLICERINA	QC-LIQ-007	3.000	30.0000	2026-09-02 14:06:15.22	2026-09-02 14:06:15.22
ca0a81dd-8d8f-493e-96c9-c81be099a2aa	51c7e144-5777-4b07-8f9c-24d1cbf78fa5	\N	D- PANTENOL	QC-LIQ-008	1.000	10.0000	2026-09-02 14:06:15.223	2026-09-02 14:06:15.223
28e58e6d-cbeb-464e-b583-4770e61b4bca	51c7e144-5777-4b07-8f9c-24d1cbf78fa5	\N	PROPILENGLICOL	QC-LIQ-009	1.000	10.0000	2026-09-02 14:06:15.225	2026-09-02 14:06:15.225
b06ddb48-af81-4ddb-af32-fce64b39eef4	51c7e144-5777-4b07-8f9c-24d1cbf78fa5	\N	BENZOATO DE SODIO	QC-LIQ-010	0.050	0.5000	2026-09-02 14:06:15.227	2026-09-02 14:06:15.227
87a2a747-fbac-4596-a640-1ed822bf9f58	51c7e144-5777-4b07-8f9c-24d1cbf78fa5	\N	SORBATO DE SODIO	QC-LIQ-011	0.050	0.5000	2026-09-02 14:06:15.23	2026-09-02 14:06:15.23
4b0b2ba4-100f-4ec3-a197-179bcb5be242	73af24d4-966e-4f9d-b32a-77b07da4b4e5	\N	MINOXIDIL	QC-LIQ-001	4.000	40.0000	2026-09-02 14:06:15.238	2026-09-02 14:06:15.238
4b075aa8-bb14-4717-81e9-462e15939eed	73af24d4-966e-4f9d-b32a-77b07da4b4e5	\N	ALCOHOL EXTRANEUTRO DE 96%	QC-LIQ-002	50.000	500.0000	2026-09-02 14:06:15.24	2026-09-02 14:06:15.24
2e58dff6-6523-487c-a994-5296a676e6dd	73af24d4-966e-4f9d-b32a-77b07da4b4e5	\N	PROPILENGLICOL	QC-LIQ-003	45.750	457.5000	2026-09-02 14:06:15.243	2026-09-02 14:06:15.243
e79ed1a0-3677-4e14-a744-a682309b907d	73af24d4-966e-4f9d-b32a-77b07da4b4e5	\N	ACEITE ESENCIAL DE ROMERO	QC-LIQ-004	0.250	2.5000	2026-09-02 14:06:15.246	2026-09-02 14:06:15.246
4c42bb29-2eb8-455f-ab2e-d4d552403ee9	31a6edb3-573a-46c9-9bbd-bfe09b908576	\N	MINOXIDIL	QC-LIQ-001	0.300	3.0000	2026-09-02 14:06:15.256	2026-09-02 14:06:15.256
de62b9c4-db0e-4d18-a51e-112efea8cfdd	31a6edb3-573a-46c9-9bbd-bfe09b908576	\N	ALCOHOL EXTRA NEUTRO	QC-LIQ-002	84.460	845.0000	2026-09-02 14:06:15.259	2026-09-02 14:06:15.259
f6955591-0c16-4559-9870-2e5d1fc9d726	31a6edb3-573a-46c9-9bbd-bfe09b908576	\N	PROPILENGLICOL	QC-LIQ-003	5.000	50.0000	2026-09-02 14:06:15.261	2026-09-02 14:06:15.261
80a6c6fc-581f-485c-8747-1e644996df0a	31a6edb3-573a-46c9-9bbd-bfe09b908576	\N	ACEITE ESENCIAL DE ROMERO	QC-LIQ-004	0.250	2.5000	2026-09-02 14:06:15.264	2026-09-02 14:06:15.264
8a546868-04c4-41ef-b8a9-1e687cada4cd	31a6edb3-573a-46c9-9bbd-bfe09b908576	\N	AGUA	QC-LIQ-005	10.000	100.0000	2026-09-02 14:06:15.267	2026-09-02 14:06:15.267
c535287b-d598-4649-a1cb-2180d0f15a90	783954c6-35e9-4b24-bee6-cc4217cadc67	\N	AGUA DESIONIZADA	QC-LIQ-001	89.320	920.0000	2026-09-02 14:06:15.274	2026-09-02 14:06:15.274
46763faf-d2bc-4206-bc7e-a792a5f5ee74	783954c6-35e9-4b24-bee6-cc4217cadc67	\N	GLICERINA VEGETAL	QC-LIQ-002	3.880	40.0000	2026-09-02 14:06:15.277	2026-09-02 14:06:15.277
153c50ae-c4ee-45e9-a263-680a70e7b2c6	783954c6-35e9-4b24-bee6-cc4217cadc67	\N	NIACINAMIDA	QC-LIQ-003	0.970	10.0000	2026-09-02 14:06:15.279	2026-09-02 14:06:15.279
00180d5b-c20f-489a-882a-151f292de19b	783954c6-35e9-4b24-bee6-cc4217cadc67	\N	PROPILENGLICOL	QC-LIQ-004	2.430	25.0000	2026-09-02 14:06:15.281	2026-09-02 14:06:15.281
4cf86a39-6ba5-42cc-af54-f2922f6a0f76	783954c6-35e9-4b24-bee6-cc4217cadc67	\N	ACIDO KOJICO	QC-LIQ-005	0.490	5.0000	2026-09-02 14:06:15.284	2026-09-02 14:06:15.284
1598e347-725b-4ac5-bdf1-62a3dd9f519a	783954c6-35e9-4b24-bee6-cc4217cadc67	\N	ACIDO LACTICO	QC-LIQ-006	1.460	15.0000	2026-09-02 14:06:15.286	2026-09-02 14:06:15.286
187af8fb-f1fc-4ff1-b65b-25bb25323b2f	783954c6-35e9-4b24-bee6-cc4217cadc67	\N	ACIDO SALICILICO	QC-LIQ-007	0.490	5.0000	2026-09-02 14:06:15.289	2026-09-02 14:06:15.289
f5c74413-00b4-4b63-8315-f78758f24a97	783954c6-35e9-4b24-bee6-cc4217cadc67	\N	ALANTOINA	QC-LIQ-008	0.290	3.0000	2026-09-02 14:06:15.291	2026-09-02 14:06:15.291
3512d65c-e69b-4709-8c08-0f094b44a5e0	783954c6-35e9-4b24-bee6-cc4217cadc67	\N	TRIETANOLAMINA	QC-LIQ-009	0.190	2.0000	2026-09-02 14:06:15.293	2026-09-02 14:06:15.293
cbac1c8f-43cb-4d7b-9cce-7b3def213dcf	783954c6-35e9-4b24-bee6-cc4217cadc67	\N	BENZOATO DE SODIO	QC-LIQ-010	0.190	2.0000	2026-09-02 14:06:15.296	2026-09-02 14:06:15.296
1a454437-29bd-4f23-829e-129720ab43bb	783954c6-35e9-4b24-bee6-cc4217cadc67	\N	SORBATO DE POTASIO	QC-LIQ-011	0.100	1.0000	2026-09-02 14:06:15.298	2026-09-02 14:06:15.298
337c9639-ef67-4198-9cae-cb49c932040a	783954c6-35e9-4b24-bee6-cc4217cadc67	\N	FRAGANCIA	QC-LIQ-012	0.190	2.0000	2026-09-02 14:06:15.3	2026-09-02 14:06:15.3
27c4b6d5-7a18-4da8-b563-add4e39bb369	783954c6-35e9-4b24-bee6-cc4217cadc67	\N	COLORANTE	QC-LIQ-013	0.000	0.0500	2026-09-02 14:06:15.303	2026-09-02 14:06:15.303
d0caf063-22e1-402d-92c4-9c0d42691b7b	e4d50ada-7943-4705-a2e9-9900c784b5d3	\N	PARAFINA	QC-LIQ-001	2.000	20.0000	2026-09-02 14:06:15.311	2026-09-02 14:06:15.311
26df5cbf-6ff1-4bbe-a683-6e076a533581	e4d50ada-7943-4705-a2e9-9900c784b5d3	\N	CERA CARNAUBA	QC-LIQ-002	1.500	15.0000	2026-09-02 14:06:15.313	2026-09-02 14:06:15.313
3c757951-4500-4f15-80cb-5b088bd37f7a	e4d50ada-7943-4705-a2e9-9900c784b5d3	\N	CERA DE ABEJA	QC-LIQ-003	1.000	10.0000	2026-09-02 14:06:15.316	2026-09-02 14:06:15.316
590c1dab-9008-4617-8db6-16868ab76d0c	e4d50ada-7943-4705-a2e9-9900c784b5d3	\N	EMULGADOR	QC-LIQ-004	1.000	10.0000	2026-09-02 14:06:15.318	2026-09-02 14:06:15.318
3776f165-d3a1-4851-9177-817ea3e76121	e4d50ada-7943-4705-a2e9-9900c784b5d3	\N	FORMOL	QC-LIQ-005	0.100	1.0000	2026-09-02 14:06:15.32	2026-09-02 14:06:15.32
35a87218-0e30-49e0-9939-5740feca615b	e4d50ada-7943-4705-a2e9-9900c784b5d3	\N	FRAGANCIA	QC-LIQ-006	0.150	1.5000	2026-09-02 14:06:15.323	2026-09-02 14:06:15.323
71d74a97-1728-4fbb-ad03-132b0f3f89ab	e4d50ada-7943-4705-a2e9-9900c784b5d3	\N	COLORANTE AZUL	QC-LIQ-007	0.000	0.0200	2026-09-02 14:06:15.325	2026-09-02 14:06:15.325
8f0982be-e1cb-4260-859d-b7be7a396318	e4d50ada-7943-4705-a2e9-9900c784b5d3	\N	AGUA DESIONIZADA	QC-LIQ-008	94.250	942.0000	2026-09-02 14:06:15.328	2026-09-02 14:06:15.328
14a4575b-e427-4519-8d71-51f519d0b329	a918f475-860f-4f76-9772-3b7d7916355d	\N	TERBINAFINA	QC-LIQ-001	8.000	80.0000	2026-09-02 14:06:15.336	2026-09-02 14:06:15.336
008849d9-6c36-4ce8-9917-20c95a0eaf5a	a918f475-860f-4f76-9772-3b7d7916355d	\N	ALCOHOL EXTRA NEUTRO	QC-LIQ-002	70.000	700.0000	2026-09-02 14:06:15.338	2026-09-02 14:06:15.338
44c18900-4c12-4c0c-9d6f-4b4725c917de	a918f475-860f-4f76-9772-3b7d7916355d	\N	PROPILENGLICOL	QC-LIQ-003	20.000	200.0000	2026-09-02 14:06:15.341	2026-09-02 14:06:15.341
635e732b-7f43-455c-b04f-afcc59fa0761	a918f475-860f-4f76-9772-3b7d7916355d	\N	AGUA DESIONIZADA	QC-LIQ-004	1.500	15.0000	2026-09-02 14:06:15.344	2026-09-02 14:06:15.344
b5d29394-7ad5-4f19-b3b0-7f59fc7685e0	a918f475-860f-4f76-9772-3b7d7916355d	\N	EXTRACTO DE ALOE VERA	QC-LIQ-005	0.500	5.0000	2026-09-02 14:06:15.346	2026-09-02 14:06:15.346
77ae4527-431d-46f8-b7e8-14f866252949	edd1a8d3-ba70-4f76-ae37-2f54863d5ad8	\N	AGUA DESIONIZADA	QC-LIQ-001	95.360	955.0000	2026-09-02 14:06:15.354	2026-09-02 14:06:15.354
a7f6c577-f982-4ed5-bfa4-ecd802b7f0cf	edd1a8d3-ba70-4f76-ae37-2f54863d5ad8	\N	GLICERINA	QC-LIQ-002	1.000	10.0000	2026-09-02 14:06:15.356	2026-09-02 14:06:15.356
7c2eade9-98fa-43aa-969f-89ec1edc0071	edd1a8d3-ba70-4f76-ae37-2f54863d5ad8	\N	EXTRACTO DE ALOE VERA	QC-LIQ-003	2.000	20.0000	2026-09-02 14:06:15.358	2026-09-02 14:06:15.358
742fcd75-3b02-4964-99ba-933e025dc236	edd1a8d3-ba70-4f76-ae37-2f54863d5ad8	\N	PANTENOL	QC-LIQ-004	0.500	5.0000	2026-09-02 14:06:15.361	2026-09-02 14:06:15.361
dd5ecfab-b302-45db-80d7-fa929b7b0ca8	edd1a8d3-ba70-4f76-ae37-2f54863d5ad8	\N	PROTEINA HIDROLIZADA DE SOYA	QC-LIQ-005	0.500	5.0000	2026-09-02 14:06:15.363	2026-09-02 14:06:15.363
38b40f89-0c68-4618-b484-33c77884dca3	edd1a8d3-ba70-4f76-ae37-2f54863d5ad8	\N	ACIDO CITRICO	QC-LIQ-006	0.200	2.0000	2026-09-02 14:06:15.366	2026-09-02 14:06:15.366
9aeded2b-d0e7-4396-b3b0-e8078feb7760	edd1a8d3-ba70-4f76-ae37-2f54863d5ad8	\N	BENZOATO DE SODIO	QC-LIQ-007	0.100	1.0000	2026-09-02 14:06:15.368	2026-09-02 14:06:15.368
bc843cb0-1af0-4e81-aee5-d080c18f0da4	edd1a8d3-ba70-4f76-ae37-2f54863d5ad8	\N	SORBATO DE SODIO	QC-LIQ-008	0.050	0.5000	2026-09-02 14:06:15.37	2026-09-02 14:06:15.37
8ca6f10b-8907-4ba5-bf3e-8ed43b19357d	edd1a8d3-ba70-4f76-ae37-2f54863d5ad8	\N	FRAGANCIA	QC-LIQ-009	0.100	1.0000	2026-09-02 14:06:15.373	2026-09-02 14:06:15.373
8c0a1f2c-20a0-4ed7-a6fe-42e83ee80cae	edd1a8d3-ba70-4f76-ae37-2f54863d5ad8	\N	CELLOSIZE	QC-LIQ-010	0.100	1.0000	2026-09-02 14:06:15.376	2026-09-02 14:06:15.376
058fb9d4-8b0d-4006-bb6b-7d04968d7415	edd1a8d3-ba70-4f76-ae37-2f54863d5ad8	\N	COLORANTE AMARILLO, MARRON Y NARANJA	QC-LIQ-011	0.100	1.0000	2026-09-02 14:06:15.378	2026-09-02 14:06:15.378
ebb7cec4-ebd7-48d0-b78e-1766077e5873	857befbd-9b54-4af7-b1a2-0843a6de4c07	\N	AGUA DESIONIZADA	QC-LIQ-001	83.500	835.0000	2026-09-02 14:06:15.386	2026-09-02 14:06:15.386
d826a491-d4cf-4b31-a279-c440e06fce34	857befbd-9b54-4af7-b1a2-0843a6de4c07	\N	CLORHIDRATO DE ALUMINIO	QC-LIQ-002	2.500	25.0000	2026-09-02 14:06:15.388	2026-09-02 14:06:15.388
657127bf-a220-4c02-b737-6d44187eab9d	857befbd-9b54-4af7-b1a2-0843a6de4c07	\N	PROPILENGLICOL	QC-LIQ-003	3.500	35.0000	2026-09-02 14:06:15.391	2026-09-02 14:06:15.391
85147c93-7780-45b1-8396-84d918d3831c	857befbd-9b54-4af7-b1a2-0843a6de4c07	\N	GLICERINA	QC-LIQ-004	2.000	20.0000	2026-09-02 14:06:15.393	2026-09-02 14:06:15.393
6b8017fe-b65e-49f6-8265-e3acc936322e	857befbd-9b54-4af7-b1a2-0843a6de4c07	\N	EXTRACTO DE ALOE VERA	QC-LIQ-005	2.500	25.0000	2026-09-02 14:06:15.395	2026-09-02 14:06:15.395
d6d912ce-6358-4af7-be05-bef758a28c5b	857befbd-9b54-4af7-b1a2-0843a6de4c07	\N	PANTENOL	QC-LIQ-006	1.000	10.0000	2026-09-02 14:06:15.398	2026-09-02 14:06:15.398
c5174264-d730-4c96-b069-cef05fe0436d	857befbd-9b54-4af7-b1a2-0843a6de4c07	\N	TRIETIL CITRATO	QC-LIQ-007	0.500	5.0000	2026-09-02 14:06:15.4	2026-09-02 14:06:15.4
dea7acf9-6572-4068-a590-00205b3dab86	857befbd-9b54-4af7-b1a2-0843a6de4c07	\N	POLISORBATO 20 PARA EL TRIETIL CITRATO	QC-LIQ-008	2.500	25.0000	2026-09-02 14:06:15.402	2026-09-02 14:06:15.402
77961e12-f1b7-423c-85ce-b410f9798fb8	857befbd-9b54-4af7-b1a2-0843a6de4c07	\N	PROCIDE CG	QC-LIQ-009	1.000	10.0000	2026-09-02 14:06:15.405	2026-09-02 14:06:15.405
6dc8ea2c-3916-442f-af61-fc241057f7ca	857befbd-9b54-4af7-b1a2-0843a6de4c07	\N	ACIDO CITRICO	QC-LIQ-010	0.200	2.0000	2026-09-02 14:06:15.407	2026-09-02 14:06:15.407
61865fbb-e9e9-437e-ba2a-b6c8007af6bf	857befbd-9b54-4af7-b1a2-0843a6de4c07	\N	FRAGANCIA	QC-LIQ-011	0.100	1.0000	2026-09-02 14:06:15.41	2026-09-02 14:06:15.41
4ca52897-3649-4c36-a2e6-456ec90a8e4e	857befbd-9b54-4af7-b1a2-0843a6de4c07	\N	POLISORBATO 20 PARA LA FRAGANCIA	QC-LIQ-012	0.700	7.0000	2026-09-02 14:06:15.412	2026-09-02 14:06:15.412
ca892d62-150e-45e2-86df-b714dc608c09	b3d74b75-46d2-42a4-8cd7-0e022cff3e5f	\N	AGUA DESIONIZADA	QC-LIQ-001	81.000	810.0000	2026-09-02 14:06:15.42	2026-09-02 14:06:15.42
59b2cb62-b834-49d1-8e3e-dff6fe2556bf	b3d74b75-46d2-42a4-8cd7-0e022cff3e5f	\N	CLORHIDRATO DE ALUMINIO	QC-LIQ-002	5.000	50.0000	2026-09-02 14:06:15.422	2026-09-02 14:06:15.422
5304e7f0-63f2-4ddd-b91a-6a289c215854	b3d74b75-46d2-42a4-8cd7-0e022cff3e5f	\N	PROPILENGLICOL	QC-LIQ-003	4.000	40.0000	2026-09-02 14:06:15.425	2026-09-02 14:06:15.425
d7e3a8cb-7a06-482b-b360-aea10a2671ac	b3d74b75-46d2-42a4-8cd7-0e022cff3e5f	\N	GLICERINA	QC-LIQ-004	2.000	20.0000	2026-09-02 14:06:15.427	2026-09-02 14:06:15.427
54238d52-177a-4038-885e-22e890f582d4	b3d74b75-46d2-42a4-8cd7-0e022cff3e5f	\N	EXTRACTO DE ALOE VERA	QC-LIQ-005	2.000	20.0000	2026-09-02 14:06:15.429	2026-09-02 14:06:15.429
09820c0f-a220-4e09-8072-a93c67797ef2	b3d74b75-46d2-42a4-8cd7-0e022cff3e5f	\N	PANTENOL	QC-LIQ-006	0.500	5.0000	2026-09-02 14:06:15.432	2026-09-02 14:06:15.432
24d83cdd-31cc-4a74-9476-cae60d158709	b3d74b75-46d2-42a4-8cd7-0e022cff3e5f	\N	TRIETIL CITRATO	QC-LIQ-007	0.500	5.0000	2026-09-02 14:06:15.434	2026-09-02 14:06:15.434
ed0d3b13-36d3-41f7-94ed-16dc0b2f9a1b	b3d74b75-46d2-42a4-8cd7-0e022cff3e5f	\N	POLISORBATO 20 PARA EL TRIETIL CITRATO	QC-LIQ-008	3.000	30.0000	2026-09-02 14:06:15.437	2026-09-02 14:06:15.437
cbc05ca3-18ca-4011-bb5d-45ecef50e506	b3d74b75-46d2-42a4-8cd7-0e022cff3e5f	\N	PROCIDE CG	QC-LIQ-009	1.000	10.0000	2026-09-02 14:06:15.439	2026-09-02 14:06:15.439
68be34f8-7247-4225-87d2-4542a9d5e896	b3d74b75-46d2-42a4-8cd7-0e022cff3e5f	\N	ACIDO CITRICO	QC-LIQ-010	0.200	2.0000	2026-09-02 14:06:15.441	2026-09-02 14:06:15.441
cb4fade9-70ba-4654-adcf-35ca0b9df279	b3d74b75-46d2-42a4-8cd7-0e022cff3e5f	\N	FRAGANCIA	QC-LIQ-011	0.200	2.0000	2026-09-02 14:06:15.444	2026-09-02 14:06:15.444
b9667881-5829-4328-92de-fdba68d078d3	b3d74b75-46d2-42a4-8cd7-0e022cff3e5f	\N	POLISORBATO 20 PARA LA FRAGANCIA	QC-LIQ-012	0.600	6.0000	2026-09-02 14:06:15.446	2026-09-02 14:06:15.446
f9a98ab5-6579-45e4-be0b-f78cb1c504a7	dc881952-2ee6-4862-9ae1-98a1bb2b21ad	\N	ACIDO SALICILICO	QC-LIQ-001	5.000	50.0000	2026-09-02 14:06:15.455	2026-09-02 14:06:15.455
53c4e3d3-f49f-4b5c-b0dd-4649f116c60c	dc881952-2ee6-4862-9ae1-98a1bb2b21ad	\N	AGUA DESIONIZADA	QC-LIQ-002	20.500	205.0000	2026-09-02 14:06:15.457	2026-09-02 14:06:15.457
caac69b4-80b5-413c-96ef-c4cbe3951a27	dc881952-2ee6-4862-9ae1-98a1bb2b21ad	\N	ACEITE ESENCIAL DE ARBOL DE TÉ	QC-LIQ-003	0.500	5.0000	2026-09-02 14:06:15.46	2026-09-02 14:06:15.46
ac746cc8-bbe8-4bc7-a1b7-4b270d73588b	dc881952-2ee6-4862-9ae1-98a1bb2b21ad	\N	GLICERINA	QC-LIQ-004	3.400	34.0000	2026-09-02 14:06:15.463	2026-09-02 14:06:15.463
2ef84a69-f0d0-45a9-999c-22fb8d1e7dc1	dc881952-2ee6-4862-9ae1-98a1bb2b21ad	\N	ALCOHOL EXTRA NEUTRO	QC-LIQ-005	70.600	706.0000	2026-09-02 14:06:15.465	2026-09-02 14:06:15.465
09981486-ae6c-4102-9e1f-6a242827e8de	dc881952-2ee6-4862-9ae1-98a1bb2b21ad	\N	COLORANTE ROJO	QC-LIQ-006	0.000	0.0200	2026-09-02 14:06:15.468	2026-09-02 14:06:15.468
41d85275-6a4b-4f84-84bc-84ab18333a3a	ece80350-3939-49e5-9f14-77fef6ab8705	\N	AGUA DESIONIZADA	QC-LIQ-001	90.010	901.0000	2026-09-02 14:06:15.475	2026-09-02 14:06:15.475
69fec7c0-c9fe-4e2d-a5d0-4fcae37891d7	ece80350-3939-49e5-9f14-77fef6ab8705	\N	GLICERINA	QC-LIQ-002	2.000	20.0000	2026-09-02 14:06:15.477	2026-09-02 14:06:15.477
c0f8049a-9e71-41d9-9d36-1609133cf65d	ece80350-3939-49e5-9f14-77fef6ab8705	\N	EXTRACTO DE ALOE VERA	QC-LIQ-003	2.000	20.0000	2026-09-02 14:06:15.48	2026-09-02 14:06:15.48
1f1ad66b-69e5-41cb-863f-0095d60aa3ad	ece80350-3939-49e5-9f14-77fef6ab8705	\N	EXTRACTO DE CALENDULA	QC-LIQ-004	1.000	10.0000	2026-09-02 14:06:15.482	2026-09-02 14:06:15.482
78866dbc-4ea6-4cfa-a68a-ddbd4c52b7d0	ece80350-3939-49e5-9f14-77fef6ab8705	\N	EXTRACTO DE MANZANILLA	QC-LIQ-005	1.000	10.0000	2026-09-02 14:06:15.485	2026-09-02 14:06:15.485
842b4ecb-364f-4725-942a-1c463eba6ab7	ece80350-3939-49e5-9f14-77fef6ab8705	\N	PANTENOL	QC-LIQ-006	1.000	10.0000	2026-09-02 14:06:15.487	2026-09-02 14:06:15.487
4af2475b-1481-44b2-be58-885930f2719c	ece80350-3939-49e5-9f14-77fef6ab8705	\N	UREA	QC-LIQ-007	1.500	15.0000	2026-09-02 14:06:15.489	2026-09-02 14:06:15.489
5ce27868-7eee-49e4-bf1f-a227d9727161	ece80350-3939-49e5-9f14-77fef6ab8705	\N	ALANTOINA	QC-LIQ-008	0.300	3.0000	2026-09-02 14:06:15.492	2026-09-02 14:06:15.492
2512145c-b60c-40a3-84b6-a709425b5214	ece80350-3939-49e5-9f14-77fef6ab8705	\N	ACIDO HIALURONICO	QC-LIQ-009	0.300	3.0000	2026-09-02 14:06:15.495	2026-09-02 14:06:15.495
a394bbcf-5cbf-4bed-9a9c-ff9dd6591352	ece80350-3939-49e5-9f14-77fef6ab8705	\N	BENZOATO DE SODIO	QC-LIQ-010	0.300	3.0000	2026-09-02 14:06:15.497	2026-09-02 14:06:15.497
354a96d6-ab3e-42da-9917-7127ce05883e	ece80350-3939-49e5-9f14-77fef6ab8705	\N	SORBATO DE SODIO	QC-LIQ-011	0.200	2.0000	2026-09-02 14:06:15.499	2026-09-02 14:06:15.499
c3b7f26e-d7db-4b0a-8017-7da62d90932c	ece80350-3939-49e5-9f14-77fef6ab8705	\N	FRAGANCIA	QC-LIQ-012	0.200	2.0000	2026-09-02 14:06:15.502	2026-09-02 14:06:15.502
2f31d363-2061-4757-ab98-294727c7899b	ece80350-3939-49e5-9f14-77fef6ab8705	\N	ACIDO CITRICO	QC-LIQ-013	0.200	2.0000	2026-09-02 14:06:15.504	2026-09-02 14:06:15.504
ca3f733b-5b52-4219-823f-34332415d603	7d5e3f17-f2b4-4cd1-bc05-7cb420ab2050	\N	CLORURO DE MANGNESIO	QC-LIQ-001	50.000	500.0000	2026-09-02 14:06:15.513	2026-09-02 14:06:15.513
9600a36e-89b5-4db1-aac3-3e7d1eadaf91	7d5e3f17-f2b4-4cd1-bc05-7cb420ab2050	\N	AGUA DESIONIXADA	QC-LIQ-002	50.000	500.0000	2026-09-02 14:06:15.516	2026-09-02 14:06:15.516
50c36a80-8cc0-4141-a683-594fea97c975	9bdb10ed-c7c9-4a8a-aff8-fb8d454796a7	\N	AGUA DESIONIZADA	QC-LIQ-001	77.960	720.0000	2026-09-02 14:06:15.523	2026-09-02 14:06:15.523
eea04fe0-ba67-45b1-9b0a-9e79609fbd5f	9bdb10ed-c7c9-4a8a-aff8-fb8d454796a7	\N	NONIL FENOL 10 M	QC-LIQ-002	8.660	80.0000	2026-09-02 14:06:15.525	2026-09-02 14:06:15.525
3a0b8021-738c-42db-94c0-1876e11a0763	9bdb10ed-c7c9-4a8a-aff8-fb8d454796a7	\N	TEXAPON	QC-LIQ-003	2.170	20.0000	2026-09-02 14:06:15.528	2026-09-02 14:06:15.528
7e4b684c-db6d-462f-b153-b1ab3624b881	9bdb10ed-c7c9-4a8a-aff8-fb8d454796a7	\N	BUTILGLICOL	QC-LIQ-004	5.410	50.0000	2026-09-02 14:06:15.53	2026-09-02 14:06:15.53
3074b60e-7da6-4963-a6d7-195370827339	9bdb10ed-c7c9-4a8a-aff8-fb8d454796a7	\N	CARBONATO DE SODIO	QC-LIQ-005	3.250	30.0000	2026-09-02 14:06:15.532	2026-09-02 14:06:15.532
27ff7a49-5a83-4759-a2e0-c37dd8f6d811	9bdb10ed-c7c9-4a8a-aff8-fb8d454796a7	\N	EDTA TETRASODICO	QC-LIQ-006	0.220	2.0000	2026-09-02 14:06:15.535	2026-09-02 14:06:15.535
2df4f60a-8b32-4ed7-95e6-fb2350e425f7	9bdb10ed-c7c9-4a8a-aff8-fb8d454796a7	\N	BETAINA	QC-LIQ-007	2.170	20.0000	2026-09-02 14:06:15.537	2026-09-02 14:06:15.537
35542614-01b7-414c-b66c-853ba012f806	9bdb10ed-c7c9-4a8a-aff8-fb8d454796a7	\N	FRAGANCIA	QC-LIQ-008	0.050	0.5000	2026-09-02 14:06:15.539	2026-09-02 14:06:15.539
3d969c9e-ce8a-4af8-9634-500b98211cfd	9bdb10ed-c7c9-4a8a-aff8-fb8d454796a7	\N	ACTICIDE	QC-LIQ-009	0.110	1.0000	2026-09-02 14:06:15.542	2026-09-02 14:06:15.542
4e34dde3-0988-4cc8-a6c0-34944c66f545	9bdb10ed-c7c9-4a8a-aff8-fb8d454796a7	\N	COLORANTE ALCALINO	QC-LIQ-010	0.010	0.0500	2026-09-02 14:06:15.544	2026-09-02 14:06:15.544
63554bbc-60bf-4837-ba5a-3bc891ba03fb	e39c0e0d-1379-4776-aeb5-dae435df2dc9	\N	AGUA DESIONIZADA	QC-LIQ-001	87.310	874.0000	2026-09-02 14:06:15.551	2026-09-02 14:06:15.551
c3bbd1ee-7cb8-460f-9d9c-fad7daeb4953	e39c0e0d-1379-4776-aeb5-dae435df2dc9	\N	TETRACAINA	QC-LIQ-002	1.000	10.0000	2026-09-02 14:06:15.554	2026-09-02 14:06:15.554
10e37657-00b1-4c03-8fb7-67951ba7b82d	e39c0e0d-1379-4776-aeb5-dae435df2dc9	\N	PRILOCAINA	QC-LIQ-003	2.000	20.0000	2026-09-02 14:06:15.556	2026-09-02 14:06:15.556
50a0f59b-04ff-4c4f-a056-a14e677d8058	e39c0e0d-1379-4776-aeb5-dae435df2dc9	\N	ACIDO LACTICO	QC-LIQ-004	0.200	2.0000	2026-09-02 14:06:15.558	2026-09-02 14:06:15.558
3eeb06d3-c5c2-4036-8255-409dc2e2dfc4	e39c0e0d-1379-4776-aeb5-dae435df2dc9	\N	BENZOATO DE SODIO	QC-LIQ-005	0.100	1.0000	2026-09-02 14:06:15.561	2026-09-02 14:06:15.561
2c94b3d9-cde8-4978-a29f-b69e4ddb4111	e39c0e0d-1379-4776-aeb5-dae435df2dc9	\N	SORBATO DE POTASIO	QC-LIQ-006	0.050	0.5000	2026-09-02 14:06:15.563	2026-09-02 14:06:15.563
6f698f6c-8322-48be-a104-2d233e5087cf	e39c0e0d-1379-4776-aeb5-dae435df2dc9	\N	EDTA TETRASODICO	QC-LIQ-007	0.050	0.5000	2026-09-02 14:06:15.565	2026-09-02 14:06:15.565
2de8e47f-f4a5-4d1b-a164-a5b4b990c63a	e39c0e0d-1379-4776-aeb5-dae435df2dc9	\N	GLICERINA	QC-LIQ-008	5.000	50.0000	2026-09-02 14:06:15.568	2026-09-02 14:06:15.568
0dd7c746-4cd3-4213-9e83-49e54179bfd9	e39c0e0d-1379-4776-aeb5-dae435df2dc9	\N	ACIDO CITRICO	QC-LIQ-009	0.300	3.0000	2026-09-02 14:06:15.571	2026-09-02 14:06:15.571
e97a4f77-d106-48cc-b280-55b625bb709b	e39c0e0d-1379-4776-aeb5-dae435df2dc9	\N	LIDOCAINA	QC-LIQ-010	4.000	40.0000	2026-09-02 14:06:15.573	2026-09-02 14:06:15.573
a241af84-a15b-4f05-b65b-065714ca4613	8e8851c7-33c2-46b6-8cc4-030fcd106e79	\N	ALCOHOL EXTRA NEUTRO	QC-LIQ-001	62.000	620.0000	2026-09-02 14:06:15.581	2026-09-02 14:06:15.581
90dea705-87ba-419c-9217-b01795a2c96d	8e8851c7-33c2-46b6-8cc4-030fcd106e79	\N	GLICERINA	QC-LIQ-002	8.000	80.0000	2026-09-02 14:06:15.584	2026-09-02 14:06:15.584
77528177-6065-472a-8bcd-97fa9a330c1c	8e8851c7-33c2-46b6-8cc4-030fcd106e79	\N	GALAXOLIDE	QC-LIQ-003	0.200	2.0000	2026-09-02 14:06:15.586	2026-09-02 14:06:15.586
72b77d98-ba34-4a55-9d9b-b7bf64936e47	8e8851c7-33c2-46b6-8cc4-030fcd106e79	\N	VAINILLINA	QC-LIQ-004	0.200	2.0000	2026-09-02 14:06:15.588	2026-09-02 14:06:15.588
a7892756-3ab6-443f-9a25-48d980cb8064	8e8851c7-33c2-46b6-8cc4-030fcd106e79	\N	COUMARINA	QC-LIQ-005	0.200	2.0000	2026-09-02 14:06:15.591	2026-09-02 14:06:15.591
7c48244a-5deb-4e07-b991-751c816451fb	8e8851c7-33c2-46b6-8cc4-030fcd106e79	\N	FRAGANCIA PACO RABANNE	QC-LIQ-006	15.000	150.0000	2026-09-02 14:06:15.593	2026-09-02 14:06:15.593
f9d89011-2c5c-42a4-88fa-bf0fd195935d	8e8851c7-33c2-46b6-8cc4-030fcd106e79	\N	AGUA DESIONIZADA	QC-LIQ-007	14.400	144.0000	2026-09-02 14:06:15.596	2026-09-02 14:06:15.596
a8c11242-83fc-449e-81ff-90c4992d966d	dfcce3b5-5fef-4939-9532-983bc11af826	\N	PEROXIDO DE HIDROGENO	QC-LIQ-001	2.910	30.0000	2026-09-02 14:06:15.604	2026-09-02 14:06:15.604
5840163f-3acd-44f2-832b-caa5c270e863	dfcce3b5-5fef-4939-9532-983bc11af826	\N	AGUA DESIONIZADA	QC-LIQ-002	93.950	970.0000	2026-09-02 14:06:15.606	2026-09-02 14:06:15.606
580de263-0ad1-4b24-ba8d-5b19cbae4bd9	dfcce3b5-5fef-4939-9532-983bc11af826	\N	GLICERINA	QC-LIQ-003	2.910	30.0000	2026-09-02 14:06:15.609	2026-09-02 14:06:15.609
d9577a5d-65cf-41de-80f1-8023dcb9582b	dfcce3b5-5fef-4939-9532-983bc11af826	\N	CLORURO DE BENZALCONIO	QC-LIQ-004	0.190	2.0000	2026-09-02 14:06:15.611	2026-09-02 14:06:15.611
e1fbe5b0-1729-4951-a024-9ca73d59743e	dfcce3b5-5fef-4939-9532-983bc11af826	\N	ACIDO LACTICO	QC-LIQ-005	0.050	0.5000	2026-09-02 14:06:15.614	2026-09-02 14:06:15.614
7128afdf-4f85-41ba-9469-a6f2f4a44d57	5b3545ca-ce48-488d-80be-238b065b16ed	\N	PEROXIDO DE HIDROGENO	QC-LIQ-001	6.000	60.0000	2026-09-02 14:06:15.623	2026-09-02 14:06:15.623
8553aace-d809-4cd2-8566-1544170e71b0	5b3545ca-ce48-488d-80be-238b065b16ed	\N	AGUA DESIONIZADA	QC-LIQ-002	83.500	835.0000	2026-09-02 14:06:15.625	2026-09-02 14:06:15.625
003e2d61-7466-4936-9856-b551912c42d6	5b3545ca-ce48-488d-80be-238b065b16ed	\N	GLICERINA	QC-LIQ-003	10.000	100.0000	2026-09-02 14:06:15.627	2026-09-02 14:06:15.627
10776159-2cea-4b69-877c-8870a9e43303	5b3545ca-ce48-488d-80be-238b065b16ed	\N	CLORURO DE BENZALCONIO	QC-LIQ-004	0.500	5.0000	2026-09-02 14:06:15.63	2026-09-02 14:06:15.63
9d5ae325-c028-4d77-be3d-fb0802e81061	38c0e681-46c6-41c9-901e-4d1086ac8076	\N	SILICONA A LA GRASA 1000	QC-LIQ-001	10.000	100.0000	2026-09-02 14:06:15.637	2026-09-02 14:06:15.637
531c1937-c4b9-4929-9663-14756fcfaefd	38c0e681-46c6-41c9-901e-4d1086ac8076	\N	SILICONA 3031	QC-LIQ-002	5.000	50.0000	2026-09-02 14:06:15.64	2026-09-02 14:06:15.64
3f59b126-b574-49b7-b025-ed78e62feeb8	38c0e681-46c6-41c9-901e-4d1086ac8076	\N	VARSOL	QC-LIQ-003	85.000	850.0000	2026-09-02 14:06:15.642	2026-09-02 14:06:15.642
3d61778c-3076-42bb-a2a0-0ad8b1588a8b	41fd3709-15c7-4070-9f9a-aa09e2bb6189	\N	AGUA DESIONIZADA	QC-LIQ-001	18.880	189.0000	2026-09-02 14:06:15.649	2026-09-02 14:06:15.649
8c296716-cb86-4671-8cd7-f11213758592	41fd3709-15c7-4070-9f9a-aa09e2bb6189	\N	BENZOATO DE SODIO	QC-LIQ-002	0.100	1.0000	2026-09-02 14:06:15.652	2026-09-02 14:06:15.652
bfc4e6ef-3e86-4cc4-ad64-a4cfda17cc58	41fd3709-15c7-4070-9f9a-aa09e2bb6189	\N	SORBATO DE POTASIO	QC-LIQ-003	0.050	0.5000	2026-09-02 14:06:15.654	2026-09-02 14:06:15.654
997d1759-fe79-4115-a961-9e67551084c2	41fd3709-15c7-4070-9f9a-aa09e2bb6189	\N	SACARINA SODICA	QC-LIQ-004	0.300	3.0000	2026-09-02 14:06:15.657	2026-09-02 14:06:15.657
5720e736-31f9-4903-9143-8e3443a46158	41fd3709-15c7-4070-9f9a-aa09e2bb6189	\N	SORBITOL	QC-LIQ-005	9.990	100.0000	2026-09-02 14:06:15.659	2026-09-02 14:06:15.659
4278eed4-0a34-4c04-aea3-1fa44004af35	41fd3709-15c7-4070-9f9a-aa09e2bb6189	\N	ALCOHOL EXTRA NEUTRO	QC-LIQ-006	69.530	696.0000	2026-09-02 14:06:15.661	2026-09-02 14:06:15.661
e866125d-6b74-4269-b04c-5b00a01844fe	41fd3709-15c7-4070-9f9a-aa09e2bb6189	\N	SABORIZANTE MENTA	QC-LIQ-007	1.000	10.0000	2026-09-02 14:06:15.664	2026-09-02 14:06:15.664
990eea00-a5a7-4360-adaf-31ed6e9a98e5	41fd3709-15c7-4070-9f9a-aa09e2bb6189	\N	MENTOL EN CRISTAL	QC-LIQ-008	0.100	1.0000	2026-09-02 14:06:15.666	2026-09-02 14:06:15.666
c6f3197f-86ff-4153-8c2f-ffab95391540	41fd3709-15c7-4070-9f9a-aa09e2bb6189	\N	COLOR VERDE	QC-LIQ-009	0.050	0.5000	2026-09-02 14:06:15.669	2026-09-02 14:06:15.669
055f491c-cd37-437d-813b-0d3991535710	c86eabce-1e2f-4dc7-8da4-4b705160e0c7	\N	TERBINAFINA	QC-LIQ-001	8.000	80.0000	2026-09-02 14:06:15.677	2026-09-02 14:06:15.677
201707b6-bf93-4cf8-a1de-8cd9d3f2186a	c86eabce-1e2f-4dc7-8da4-4b705160e0c7	\N	ALCOHOL EXTRA NEUTRO	QC-LIQ-002	70.000	700.0000	2026-09-02 14:06:15.68	2026-09-02 14:06:15.68
edbb17e4-1eb2-492c-90de-a93a87a77654	c86eabce-1e2f-4dc7-8da4-4b705160e0c7	\N	PROPILENGLICOL	QC-LIQ-003	20.000	200.0000	2026-09-02 14:06:15.683	2026-09-02 14:06:15.683
61aff3e9-be08-46cf-851f-be263c529634	c86eabce-1e2f-4dc7-8da4-4b705160e0c7	\N	AGUA DESIONIZADA	QC-LIQ-004	1.500	15.0000	2026-09-02 14:06:15.685	2026-09-02 14:06:15.685
f334b9a6-8e55-40e9-ba76-de195a8707f1	c86eabce-1e2f-4dc7-8da4-4b705160e0c7	\N	EXTRACTO DE ALOE VERA	QC-LIQ-005	0.500	5.0000	2026-09-02 14:06:15.687	2026-09-02 14:06:15.687
bceab869-bbaa-4f66-8657-4792f34dd623	b0be1da3-26c2-4637-b1ca-a346148578e5	\N	AGUA DESIONIZADA	QC-LIQ-001	88.300	883.0000	2026-09-02 14:06:15.696	2026-09-02 14:06:15.696
1eefb490-e66b-4de3-b1d5-dfe4a269209c	b0be1da3-26c2-4637-b1ca-a346148578e5	\N	GLICERINA	QC-LIQ-002	3.000	30.0000	2026-09-02 14:06:15.698	2026-09-02 14:06:15.698
48a644b7-3c13-4782-8ed6-e814d3de1798	b0be1da3-26c2-4637-b1ca-a346148578e5	\N	PROPILENGLICOL	QC-LIQ-003	3.000	30.0000	2026-09-02 14:06:15.7	2026-09-02 14:06:15.7
b7be179c-508a-4523-ac7a-07d18a92c64b	b0be1da3-26c2-4637-b1ca-a346148578e5	\N	PANTENOL	QC-LIQ-004	1.000	10.0000	2026-09-02 14:06:15.702	2026-09-02 14:06:15.702
9b3cb5ba-2579-4e82-9071-280cd62ca2d8	b0be1da3-26c2-4637-b1ca-a346148578e5	\N	ALANTOINA	QC-LIQ-005	0.200	2.0000	2026-09-02 14:06:15.704	2026-09-02 14:06:15.704
c7d0f46b-1fbc-45a5-87c0-2b5739decec3	b0be1da3-26c2-4637-b1ca-a346148578e5	\N	EXTRACTO DE ALOE VERA	QC-LIQ-006	2.000	20.0000	2026-09-02 14:06:15.707	2026-09-02 14:06:15.707
bbff74be-8826-49ce-8c77-e93fcc9bd5d9	b0be1da3-26c2-4637-b1ca-a346148578e5	\N	EXTRACTO DE AVENA	QC-LIQ-007	1.000	10.0000	2026-09-02 14:06:15.71	2026-09-02 14:06:15.71
c5cad7f8-a9a1-461c-bd29-f501ddf5b90f	b0be1da3-26c2-4637-b1ca-a346148578e5	\N	EXTRACTO DE CALENDULA	QC-LIQ-008	0.500	5.0000	2026-09-02 14:06:15.713	2026-09-02 14:06:15.713
4ae0ee4f-34a5-4463-9b9f-a3745bbafa8b	b0be1da3-26c2-4637-b1ca-a346148578e5	\N	GLUCONATO DE CLORHEXIDINA	QC-LIQ-009	0.500	5.0000	2026-09-02 14:06:15.715	2026-09-02 14:06:15.715
b6e71e2b-4e15-4a95-bb65-85c96905ee13	b0be1da3-26c2-4637-b1ca-a346148578e5	\N	BENZOATO DE SODIO	QC-LIQ-010	0.300	3.0000	2026-09-02 14:06:15.718	2026-09-02 14:06:15.718
95eb5df0-9bf8-4222-80a9-57737c741bb3	b0be1da3-26c2-4637-b1ca-a346148578e5	\N	SORBATO DE POTASIO	QC-LIQ-011	0.200	2.0000	2026-09-02 14:06:15.72	2026-09-02 14:06:15.72
a3d3cd2f-07b0-4c7b-9fcc-23341ce38ca6	b0be1da3-26c2-4637-b1ca-a346148578e5	\N	ACIDO CITRICO	QC-LIQ-012	0.000	0.0300	2026-09-02 14:06:15.722	2026-09-02 14:06:15.722
7dc1b3e7-a6bb-4d36-81d5-d2089ba3ad3a	56da5faa-4c15-4e1d-b7a7-9c75b1b3c8b8	\N	AGUA DESIONIZADA	QC-LIQ-001	84.500	845.0000	2026-09-02 14:06:15.731	2026-09-02 14:06:15.731
ee605afe-1c70-43a4-80bd-c574a71c7326	56da5faa-4c15-4e1d-b7a7-9c75b1b3c8b8	\N	ALCOHOL LAURICO ETOXILADO	QC-LIQ-002	5.000	50.0000	2026-09-02 14:06:15.733	2026-09-02 14:06:15.733
7334f632-53f7-4740-98d6-624c7be727f0	56da5faa-4c15-4e1d-b7a7-9c75b1b3c8b8	\N	FRAGANCIA PACO LUCKY	QC-LIQ-003	2.500	25.0000	2026-09-02 14:06:15.735	2026-09-02 14:06:15.735
7a8f5ddc-0805-42aa-8ec7-8ce685ef962f	56da5faa-4c15-4e1d-b7a7-9c75b1b3c8b8	\N	GLICERINA	QC-LIQ-004	3.000	30.0000	2026-09-02 14:06:15.738	2026-09-02 14:06:15.738
15bf818d-a592-4629-b920-154b3fd852e9	56da5faa-4c15-4e1d-b7a7-9c75b1b3c8b8	\N	ALCOHOL EXTRA NEUTRO	QC-LIQ-005	5.000	50.0000	2026-09-02 14:06:15.74	2026-09-02 14:06:15.74
01d651d6-790b-440c-994b-b189ac81cac1	56da5faa-4c15-4e1d-b7a7-9c75b1b3c8b8	\N	COLORANTE	QC-LIQ-006	0.000	0.0200	2026-09-02 14:06:15.742	2026-09-02 14:06:15.742
cf4a4929-6507-4fb0-a585-69a5945785b6	d14bd429-0a26-452e-b1c5-75a9ae200a52	\N	ALCOHOL EXTRA NEUTRO	QC-LIQ-001	62.000	620.0000	2026-09-02 14:06:15.75	2026-09-02 14:06:15.75
f68bf9a1-c77c-493a-96c0-363379211490	d14bd429-0a26-452e-b1c5-75a9ae200a52	\N	GLICERINA	QC-LIQ-002	8.000	80.0000	2026-09-02 14:06:15.752	2026-09-02 14:06:15.752
f0adf669-27a0-4b51-805d-40d6294b6fd9	d14bd429-0a26-452e-b1c5-75a9ae200a52	\N	GALAXOLIDE	QC-LIQ-003	0.200	2.0000	2026-09-02 14:06:15.755	2026-09-02 14:06:15.755
03dba6a7-a3e7-473a-9d0c-31d9e3e43c0e	d14bd429-0a26-452e-b1c5-75a9ae200a52	\N	VAINILLINA	QC-LIQ-004	0.200	2.0000	2026-09-02 14:06:15.757	2026-09-02 14:06:15.757
9defb7fc-17dd-41a3-acac-e4446a26d424	d14bd429-0a26-452e-b1c5-75a9ae200a52	\N	COUMARINA	QC-LIQ-005	0.200	2.0000	2026-09-02 14:06:15.76	2026-09-02 14:06:15.76
33a8e94d-caeb-44a3-88dd-12ea3579d292	d14bd429-0a26-452e-b1c5-75a9ae200a52	\N	FRAGANCIA PACO LUCKY	QC-LIQ-006	15.000	150.0000	2026-09-02 14:06:15.763	2026-09-02 14:06:15.763
ccca12db-498d-48a2-869d-0d452e3accb9	d14bd429-0a26-452e-b1c5-75a9ae200a52	\N	AGUA DESIONIZADA	QC-LIQ-007	14.400	144.0000	2026-09-02 14:06:15.766	2026-09-02 14:06:15.766
40fdf798-d0b1-4203-ac9c-ed1eaeec616a	ab9d67f4-05e6-4228-9aa5-5aad2537f87c	\N	ALCOHOL EXTRA NEUTRO	QC-LIQ-001	62.000	620.0000	2026-09-02 14:06:15.774	2026-09-02 14:06:15.774
e99eae99-c225-443c-adf4-7363578db865	ab9d67f4-05e6-4228-9aa5-5aad2537f87c	\N	GLICERINA	QC-LIQ-002	8.000	80.0000	2026-09-02 14:06:15.776	2026-09-02 14:06:15.776
b41d4500-dd61-415b-ab03-f42decf99038	ab9d67f4-05e6-4228-9aa5-5aad2537f87c	\N	GALAXOLIDE	QC-LIQ-003	0.200	2.0000	2026-09-02 14:06:15.778	2026-09-02 14:06:15.778
7a60c328-6409-4345-98fa-908f1296f5d2	ab9d67f4-05e6-4228-9aa5-5aad2537f87c	\N	VAINILLINA	QC-LIQ-004	0.200	2.0000	2026-09-02 14:06:15.781	2026-09-02 14:06:15.781
5cdc7aad-4056-4d93-b63b-48c6e4da7fbe	ab9d67f4-05e6-4228-9aa5-5aad2537f87c	\N	COUMARINA	QC-LIQ-005	0.200	2.0000	2026-09-02 14:06:15.783	2026-09-02 14:06:15.783
b36cc8af-c6f0-4907-a3cb-fa3af05495dd	ab9d67f4-05e6-4228-9aa5-5aad2537f87c	\N	FRAGANCIA PACO LUCKY	QC-LIQ-006	15.000	150.0000	2026-09-02 14:06:15.785	2026-09-02 14:06:15.785
ac813a59-d675-49b9-bfcc-7afe21f9abda	ab9d67f4-05e6-4228-9aa5-5aad2537f87c	\N	AGUA DESIONIZADA	QC-LIQ-007	14.400	144.0000	2026-09-02 14:06:15.787	2026-09-02 14:06:15.787
7b9574f1-1fc5-4be0-9076-08aaf844b8e2	bd726427-a14e-4900-99ed-90a239e15af5	\N	ALCOHOL EXTRA NEUTRO	QC-LIQ-001	87.500	875.0000	2026-09-02 14:06:15.795	2026-09-02 14:06:15.795
3af96034-6d6a-4779-af5e-d624d6e64f18	bd726427-a14e-4900-99ed-90a239e15af5	\N	ALCANFOR	QC-LIQ-002	1.000	10.0000	2026-09-02 14:06:15.797	2026-09-02 14:06:15.797
2694e0d8-dac5-4f14-8ec5-6222d4f6e9a3	bd726427-a14e-4900-99ed-90a239e15af5	\N	MENTOL EN CRISTALES	QC-LIQ-003	1.000	10.0000	2026-09-02 14:06:15.799	2026-09-02 14:06:15.799
5f98cdbb-7dd6-48e6-b6b9-18fff55e138a	bd726427-a14e-4900-99ed-90a239e15af5	\N	ACEITE ESENCIAL ROMERO	QC-LIQ-004	0.500	5.0000	2026-09-02 14:06:15.801	2026-09-02 14:06:15.801
be5ccf66-a1fd-4ce9-86ee-5651d53daa4f	bd726427-a14e-4900-99ed-90a239e15af5	\N	AGUA DESIONIZADA	QC-LIQ-005	10.000	100.0000	2026-09-02 14:06:15.802	2026-09-02 14:06:15.802
0f95152c-dc5b-4b28-a522-4334fd69de12	f29bfbd6-a49f-40db-ae02-54c35bf7da17	\N	TEXAPON	QC-CHA-001	10.010	100.0000	2026-09-02 14:06:15.81	2026-09-02 14:06:15.81
25f197c4-51a9-4d81-baa6-581918432d96	f29bfbd6-a49f-40db-ae02-54c35bf7da17	\N	EDTA	QC-CHA-002	0.100	1.0000	2026-09-02 14:06:15.812	2026-09-02 14:06:15.812
14896d0c-3ec6-41e4-9c55-1517ce90ff72	f29bfbd6-a49f-40db-ae02-54c35bf7da17	\N	COPERLAND	QC-CHA-003	1.000	10.0000	2026-09-02 14:06:15.814	2026-09-02 14:06:15.814
91b235c3-7dd3-4741-9eb2-09a3feff8048	f29bfbd6-a49f-40db-ae02-54c35bf7da17	\N	BETAINA	QC-CHA-004	5.000	50.0000	2026-09-02 14:06:15.816	2026-09-02 14:06:15.816
8954f5e0-9588-4f29-a0dc-7c1d3b7f5b79	f29bfbd6-a49f-40db-ae02-54c35bf7da17	\N	ACIDO SALICILICO	QC-CHA-005	0.050	0.5000	2026-09-02 14:06:15.818	2026-09-02 14:06:15.818
752c5184-89f6-408c-a5f6-2b7b0cd9b2c0	f29bfbd6-a49f-40db-ae02-54c35bf7da17	\N	SAL	QC-CHA-006	2.000	20.0000	2026-09-02 14:06:15.82	2026-09-02 14:06:15.82
31ac8ffb-dd9e-415e-8b73-810bc976e91f	f29bfbd6-a49f-40db-ae02-54c35bf7da17	\N	ACIDO CITRICO	QC-CHA-007	0.100	1.0000	2026-09-02 14:06:15.822	2026-09-02 14:06:15.822
9233128d-be91-43d2-96fd-1fcba00cd3bf	f29bfbd6-a49f-40db-ae02-54c35bf7da17	\N	PANTENOL	QC-CHA-008	0.500	5.0000	2026-09-02 14:06:15.824	2026-09-02 14:06:15.824
05534826-5064-469e-bc3f-3c745156286a	f29bfbd6-a49f-40db-ae02-54c35bf7da17	\N	EXTRACTO DE ROMERO	QC-CHA-009	0.500	5.0000	2026-09-02 14:06:15.827	2026-09-02 14:06:15.827
0cfb74a8-cc66-48a4-aaca-044cbb943ced	f29bfbd6-a49f-40db-ae02-54c35bf7da17	\N	EXTRACTO DE ORTIGA	QC-CHA-010	0.500	5.0000	2026-09-02 14:06:15.829	2026-09-02 14:06:15.829
1c880767-f392-47ba-8156-41b4e40afb5b	f29bfbd6-a49f-40db-ae02-54c35bf7da17	\N	DEHYCUART	QC-CHA-011	0.500	5.0000	2026-09-02 14:06:15.83	2026-09-02 14:06:15.83
4db353df-ae1f-40b9-a4fa-fde0d5b992d7	f29bfbd6-a49f-40db-ae02-54c35bf7da17	\N	AGUA DESIONIZADA	QC-CHA-012	79.740	797.0000	2026-09-02 14:06:15.832	2026-09-02 14:06:15.832
\.


--
-- Data for Name: formula_variants; Type: TABLE DATA; Schema: public; Owner: quimicorp
--

COPY public.formula_variants (id, nombre, formula_id, cliente_id, nombre_marca, aroma, color, ph_objetivo, viscosidad, instrucciones, notas, ajustes_json, "createdAt", "updatedAt", pasos_elaboracion) FROM stdin;
e5841588-53be-4abf-8def-a34d1e06bf37	SERUM DE PESTAÑA	36b0b7a3-4c34-4a5b-b989-3b38de34367b	ffb82269-bc8f-4d30-9938-c1ae9d346dd3	\N	\N	\N	\N	\N	\N	Extraído de la pestaña "CARLA RIVERA" (Fila 1)	\N	2026-09-02 14:06:59.734	2026-09-03 20:13:04.732	\N
aa0a9263-43a7-4d58-b4ba-20fa047b2f98	TONICO PARA MASCOTAS (MASCOTAS)	51c7e144-5777-4b07-8f9c-24d1cbf78fa5	152c3943-b0fa-41d1-bce5-b7511d660dc4	\N	\N	\N	\N	\N	\N	Extraído de la pestaña "DAVID SARMIENTO" (Fila 21)	\N	2026-09-02 14:06:59.623	2026-09-03 20:13:04.74	\N
85d96a9a-972a-40c0-abe7-0acbd020bdcc	CREMA CON MINOXIDIL  8 KILOS	26319221-83f5-4b08-8e3f-2ec3a906c1ba	152c3943-b0fa-41d1-bce5-b7511d660dc4	\N	\N	\N	\N	\N	\N	Extraído de la pestaña "DAVID SARMIENTO" (Fila 38)	\N	2026-09-02 14:06:59.626	2026-09-03 20:13:04.74	\N
2b45abb7-ea09-4aee-b83e-0ff16c75bf2e	CREMA REGENERADOR DE CICATRICES	4969ca62-91e9-4fd5-8d28-968d7589c959	152c3943-b0fa-41d1-bce5-b7511d660dc4	\N	\N	\N	\N	\N	\N	Extraído de la pestaña "DAVID SARMIENTO" (Fila 77)	\N	2026-09-02 14:06:59.629	2026-09-03 20:13:04.74	\N
4d346196-3309-470d-a6f9-08a02e9a29bd	GEL MUSCULAR	5a64dacd-8395-406e-8171-ec8b0e05ceb7	152c3943-b0fa-41d1-bce5-b7511d660dc4	\N	\N	\N	\N	\N	\N	Extraído de la pestaña "DAVID SARMIENTO" (Fila 93)	\N	2026-09-02 14:06:59.633	2026-09-03 20:13:04.74	\N
63af6d3e-1763-4119-93f9-ddb9620ce0d6	CREMA DE CICATRICES	4969ca62-91e9-4fd5-8d28-968d7589c959	152c3943-b0fa-41d1-bce5-b7511d660dc4	\N	\N	\N	\N	\N	\N	Extraído de la pestaña "DAVID SARMIENTO" (Fila 108)	\N	2026-09-02 14:06:59.636	2026-09-03 20:13:04.74	\N
0de424d9-e851-485b-8ba0-0d431adb93ab	CERA LIQUIDA SELLADOR HIDROFOBICO DE PINTURA DE AUTOS	38c0e681-46c6-41c9-901e-4d1086ac8076	152c3943-b0fa-41d1-bce5-b7511d660dc4	\N	\N	\N	\N	\N	\N	Extraído de la pestaña "DAVID SARMIENTO" (Fila 155)	\N	2026-09-02 14:06:59.639	2026-09-03 20:13:04.74	\N
8c217b97-fb4b-437c-8992-034b9f31711c	ANTIMICOTICO EN SPRAY PARA HONGOS DE UÑAS	dc881952-2ee6-4862-9ae1-98a1bb2b21ad	152c3943-b0fa-41d1-bce5-b7511d660dc4	\N	\N	\N	\N	\N	\N	Extraído de la pestaña "DAVID SARMIENTO" (Fila 166)	\N	2026-09-02 14:06:59.643	2026-09-03 20:13:04.74	\N
a0d58b87-8393-4b1f-a3ec-54f08d39a6eb	SPRAY ALIVIO PARA PSORIASIS	ece80350-3939-49e5-9f14-77fef6ab8705	23d7f5d1-d0fa-48f7-95d8-09985dcf3e42	\N	\N	\N	\N	\N	\N	Extraído de la pestaña "JHON CANTO" (Fila 134)	\N	2026-09-02 14:06:59.549	2026-09-03 20:13:04.746	\N
df43994f-9694-428f-949a-4816ca1bd912	CREMA BLANQUEADORA CON ACIDO HIALURONICO	084c7afd-2488-4cc4-9e8e-afba348e97a9	23d7f5d1-d0fa-48f7-95d8-09985dcf3e42	\N	\N	\N	\N	\N	\N	Extraído de la pestaña "JHON CANTO" (Fila 151)	\N	2026-09-02 14:06:59.552	2026-09-03 20:13:04.746	\N
4ece7705-82fa-4539-8534-254ef34d5608	CREMA PARA HEMORROIDES	608ad73c-03b6-4950-8a59-7b9f03ccef38	23d7f5d1-d0fa-48f7-95d8-09985dcf3e42	\N	\N	\N	\N	\N	\N	Extraído de la pestaña "JHON CANTO" (Fila 163)	\N	2026-09-02 14:06:59.554	2026-09-03 20:13:04.746	\N
93086889-5599-49ea-b270-882b1c76eb7f	PERFUME ECONOMICO	56da5faa-4c15-4e1d-b7a7-9c75b1b3c8b8	23d7f5d1-d0fa-48f7-95d8-09985dcf3e42	\N	\N	\N	\N	\N	\N	Extraído de la pestaña "JHON CANTO" (Fila 180)	\N	2026-09-02 14:06:59.556	2026-09-03 20:13:04.746	\N
3b574e0c-be86-4bdb-aaa9-90b05034b33a	ACEITE DE MASAJE ANTICELULITICO	9df7edc6-244b-43f9-9ac1-1c6f1c20fb4f	23d7f5d1-d0fa-48f7-95d8-09985dcf3e42	\N	\N	\N	\N	\N	\N	Extraído de la pestaña "JHON CANTO" (Fila 189)	\N	2026-09-02 14:06:59.559	2026-09-03 20:13:04.746	\N
662e8cb8-4ef7-4aad-ac9e-b1d823bc15d7	CREMA TENSOR  CON ACIDO HIALURONICO - JHON CANTO	2c5c096c-a322-4778-abe0-2582177ee72b	23d7f5d1-d0fa-48f7-95d8-09985dcf3e42	\N	\N	\N	\N	\N	\N	Extraído de la pestaña "JHON CANTO" (Fila 202)	\N	2026-09-02 14:06:59.561	2026-09-03 20:13:04.746	\N
a2110e59-a2a2-441a-a76d-134d5471e52a	GEL EXFOLIANTE FACIAL	af5770ae-205b-4ae7-a0bd-98fbac504a80	23d7f5d1-d0fa-48f7-95d8-09985dcf3e42	\N	\N	\N	\N	\N	\N	Extraído de la pestaña "JHON CANTO" (Fila 251)	\N	2026-09-02 14:06:59.564	2026-09-03 20:13:04.746	\N
47e6003b-d46e-4ea7-8d47-ec875d411382	GEL MUSCULAR	5a64dacd-8395-406e-8171-ec8b0e05ceb7	23d7f5d1-d0fa-48f7-95d8-09985dcf3e42	\N	\N	\N	\N	\N	\N	Extraído de la pestaña "JHON CANTO" (Fila 268)	\N	2026-09-02 14:06:59.567	2026-09-03 20:13:04.746	\N
26bf2a19-6b8b-454d-9a4b-98f9a0cb50e1	CREMA DOLOR MUSCULAR CON CURCUMA	706db1a8-ee44-4401-b17c-ef5e055ee996	23d7f5d1-d0fa-48f7-95d8-09985dcf3e42	\N	\N	\N	\N	\N	\N	Extraído de la pestaña "JHON CANTO" (Fila 282)	\N	2026-09-02 14:06:59.57	2026-09-03 20:13:04.746	\N
0e1990d0-cc45-4fad-a8e3-5d625c43a20c	SPRAY DE MAGNESIO	7d5e3f17-f2b4-4cd1-bc05-7cb420ab2050	23d7f5d1-d0fa-48f7-95d8-09985dcf3e42	\N	\N	\N	\N	\N	\N	Extraído de la pestaña "JHON CANTO" (Fila 295)	\N	2026-09-02 14:06:59.574	2026-09-03 20:13:04.746	\N
0d9c7793-80de-4df1-a83c-17e34248178a	SPRAY ALIVIO PARA PSORIASIS	ece80350-3939-49e5-9f14-77fef6ab8705	23d7f5d1-d0fa-48f7-95d8-09985dcf3e42	\N	\N	\N	\N	\N	\N	Extraído de la pestaña "JHON CANTO" (Fila 303)	\N	2026-09-02 14:06:59.577	2026-09-03 20:13:04.746	\N
9f1489f2-b744-425d-92ad-1fd6d76d1a94	CREMA FACIAL	d7314864-bb03-4141-aa29-7ad8f99d598a	\N	\N	\N	\N	\N	\N	\N	Extraído de la pestaña "ROBERTO CASTILLO" (Fila 16)	\N	2026-09-02 14:06:59.583	2026-09-03 21:08:49.022	\N
5b2dd062-2e45-4784-b733-575ec7816761	SERUM NAD C/N COLAGENO	766bf635-ca22-4a7f-aa7b-b4f23ac53296	\N	\N	\N	\N	\N	\N	\N	Extraído de la pestaña "ROBERTO CASTILLO" (Fila 30)	\N	2026-09-02 14:06:59.585	2026-09-03 21:08:49.022	\N
b6118170-0d2a-4b53-89a0-274b39243037	CREMA DE PEINAR Ph 5 (100 kilos) KARSSEL	00e3bd70-80ff-44df-ab85-902ad4f176fe	23d7f5d1-d0fa-48f7-95d8-09985dcf3e42	\N	\N	\N	\N	\N	\N	Extraído de la pestaña "JHON CANTO" (Fila 1)	\N	2026-09-02 14:06:59.532	2026-09-03 20:13:04.746	\N
80873057-88fa-42e1-aed8-61b3df9bc7ab	CREMA DE PEINAR PARA RIZOS Ph 5 (150 kilos)	71cf973c-9a35-4b03-846e-68f3b41c4da6	23d7f5d1-d0fa-48f7-95d8-09985dcf3e42	\N	\N	\N	\N	\N	\N	Extraído de la pestaña "JHON CANTO" (Fila 13)	\N	2026-09-02 14:06:59.534	2026-09-03 20:13:04.746	\N
98a0d49b-21ce-4c93-aa40-72c2b8c1aad2	TONICO LIQUIDO PARA DOLORES MUSCULARES 100L	bd726427-a14e-4900-99ed-90a239e15af5	23d7f5d1-d0fa-48f7-95d8-09985dcf3e42	\N	\N	\N	\N	\N	\N	Extraído de la pestaña "JHON CANTO" (Fila 40)	\N	2026-09-02 14:06:59.537	2026-09-03 20:13:04.746	\N
55f59e49-e033-4ece-b938-c494f4628706	DIAMANTEX	e4d50ada-7943-4705-a2e9-9900c784b5d3	65755eba-be76-4948-8764-1d86cca32905	\N	\N	\N	\N	\N	\N	Extraído de la pestaña "DANIEL ESPINOZA." (Fila 21)	\N	2026-09-02 14:06:59.517	2026-09-03 20:13:04.768	\N
7fa9fa61-de51-4811-85c0-753f3adc4582	CREMA PARA ESTRIAS	c677d242-7dd1-4e76-b9a9-b474cbe1668c	23d7f5d1-d0fa-48f7-95d8-09985dcf3e42	\N	\N	\N	\N	\N	\N	Extraído de la pestaña "JHON CANTO" (Fila 70)	\N	2026-09-02 14:06:59.54	2026-09-03 20:13:04.746	\N
116ba314-1b4e-4c71-8a17-0b999b18f6fc	CREMA BLANQUEADORA	084c7afd-2488-4cc4-9e8e-afba348e97a9	23d7f5d1-d0fa-48f7-95d8-09985dcf3e42	\N	\N	\N	\N	\N	\N	Extraído de la pestaña "JHON CANTO" (Fila 94)	\N	2026-09-02 14:06:59.542	2026-09-03 20:13:04.746	\N
bcf54c92-11ee-4ac2-ae17-13a433637393	GEL BLANQUEADOR CON KOJICO	abfa6d15-3aa3-4137-95e2-1513ea218edb	23d7f5d1-d0fa-48f7-95d8-09985dcf3e42	\N	\N	\N	\N	\N	\N	Extraído de la pestaña "JHON CANTO" (Fila 105)	\N	2026-09-02 14:06:59.545	2026-09-03 20:13:04.746	\N
806e6faa-478c-4419-ba96-871528af116a	GEL EXFOLIANTE FACIAL  EFECTO BORRA	af5770ae-205b-4ae7-a0bd-98fbac504a80	23d7f5d1-d0fa-48f7-95d8-09985dcf3e42	\N	\N	\N	\N	\N	\N	Extraído de la pestaña "JHON CANTO" (Fila 117)	\N	2026-09-02 14:06:59.547	2026-09-03 20:13:04.746	\N
bb2f55b5-2cde-4daf-b166-0cf912ed7b11	SELLADOR NANOCERAMICO	38c0e681-46c6-41c9-901e-4d1086ac8076	65755eba-be76-4948-8764-1d86cca32905	\N	\N	\N	\N	\N	\N	Extraído de la pestaña "DANIEL ESPINOZA." (Fila 1)	\N	2026-09-02 14:06:59.511	2026-09-03 20:13:04.768	\N
c1d06d19-ee6a-448c-868e-2201af7b2c10	SPRAY DE OIDOS - TRINNIDROP	dfcce3b5-5fef-4939-9532-983bc11af826	65755eba-be76-4948-8764-1d86cca32905	\N	\N	\N	\N	\N	\N	Extraído de la pestaña "DANIEL ESPINOZA." (Fila 10)	\N	2026-09-02 14:06:59.515	2026-09-03 20:13:04.768	\N
094195c4-7c81-45d5-b684-92317488ec58	RETARDANTE EN GEL COLOR NEGRO 20 KILOS	9454995f-d03f-4198-9f7e-23ff3f2c0fa0	76a900d1-1756-483a-a49e-7ad3114b7e06	\N	\N	\N	\N	\N	\N	Extraído de la pestaña "ERICK CHAVEZ" (Fila 1)	\N	2026-09-02 14:06:59.604	2026-09-02 14:06:59.604	\N
5028beb5-aa99-4832-bf25-92ad512c3c8e	CREMA ALOE VERA Y ACIDO HIALURONICO	084c7afd-2488-4cc4-9e8e-afba348e97a9	76a900d1-1756-483a-a49e-7ad3114b7e06	\N	\N	\N	\N	\N	\N	Extraído de la pestaña "ERICK CHAVEZ" (Fila 18)	\N	2026-09-02 14:06:59.608	2026-09-02 14:06:59.608	\N
4913615f-054e-40d9-a447-920d75860e6a	RETARDANTE LIQUIDO	1207caaa-eb92-440f-8255-fc66d0ed68b9	76a900d1-1756-483a-a49e-7ad3114b7e06	\N	\N	\N	\N	\N	\N	Extraído de la pestaña "ERICK CHAVEZ" (Fila 43)	\N	2026-09-02 14:06:59.611	2026-09-02 14:06:59.611	\N
5b32347d-0078-4172-b075-719bbb0248bd	CREMA DERMA BEE	c677d242-7dd1-4e76-b9a9-b474cbe1668c	fb0a2ed4-aa43-4e8a-87aa-dc14b4b75502	\N	\N	\N	\N	\N	\N	Extraído de la pestaña "JEAN" (Fila 36)	\N	2026-09-02 14:06:59.653	2026-09-02 14:06:59.653	\N
f4736985-bed4-479e-96d8-b353ec342b78	RETARDANTE LIQUIDO NORMAL	1207caaa-eb92-440f-8255-fc66d0ed68b9	fb0a2ed4-aa43-4e8a-87aa-dc14b4b75502	\N	\N	\N	\N	\N	\N	Extraído de la pestaña "JEAN" (Fila 48)	\N	2026-09-02 14:06:59.655	2026-09-02 14:06:59.655	\N
ee70f42a-99bc-4dd9-8dd8-49c166767b99	CREMA BEE VENOM	3a8974f6-aaf2-4de6-ad96-cc1f6932829c	d6c5ebd5-7538-499e-9e29-7958f10ecd3b	\N	\N	\N	\N	\N	\N	Extraído de la pestaña "ALONSO CHUNGA" (Fila 17)	\N	2026-09-02 14:06:59.692	2026-09-02 14:06:59.692	\N
17103efe-0042-44bf-9117-840839246801	CREMA BEE VENOM MUSCULAR	3a8974f6-aaf2-4de6-ad96-cc1f6932829c	d6c5ebd5-7538-499e-9e29-7958f10ecd3b	\N	\N	\N	\N	\N	\N	Extraído de la pestaña "ALONSO CHUNGA" (Fila 31)	\N	2026-09-02 14:06:59.695	2026-09-02 14:06:59.695	\N
b0be8abe-8393-4420-b070-105974d65f15	CREMA BEE VENOM	3a8974f6-aaf2-4de6-ad96-cc1f6932829c	22ca8b6e-78cf-4f2f-b3b7-910968d68f5d	\N	\N	\N	\N	\N	\N	Extraído de la pestaña "LEO HIDALGO" (Fila 1)	\N	2026-09-02 14:06:59.703	2026-09-02 14:06:59.703	\N
9c7f7025-eaca-4bab-b8cc-fa1de25221fc	CREMA BEE VENOM MUSCULAR	3a8974f6-aaf2-4de6-ad96-cc1f6932829c	22ca8b6e-78cf-4f2f-b3b7-910968d68f5d	\N	\N	\N	\N	\N	\N	Extraído de la pestaña "LEO HIDALGO" (Fila 16)	\N	2026-09-02 14:06:59.706	2026-09-02 14:06:59.706	\N
7aebcd26-3ef7-4450-9f72-9cb1153f900a	SPRAY DE OIDOS - 20 LITROS	5b3545ca-ce48-488d-80be-238b065b16ed	152c3943-b0fa-41d1-bce5-b7511d660dc4	\N	\N	\N	\N	\N	\N	Extraído de la pestaña "DAVID SARMIENTO" (Fila 12)	\N	2026-09-02 14:06:59.619	2026-09-03 20:13:04.74	\N
e77ef4c4-9093-4e4e-a2ee-029a9776567b	SPRAY BUCAL  5 LITROS  SANDIA	41fd3709-15c7-4070-9f9a-aa09e2bb6189	e8c10f2c-6357-4c61-8153-790e7b8a6966	\N	\N	\N	\N	\N	\N	Extraído de la pestaña "RENZO" (Fila 1)	\N	2026-09-02 14:06:59.679	2026-09-03 20:13:04.756	\N
b1f891bd-cc13-4fe3-baab-317366aa35b5	SPRAY BUCAL  5 LITROS  MENTA	41fd3709-15c7-4070-9f9a-aa09e2bb6189	e8c10f2c-6357-4c61-8153-790e7b8a6966	\N	\N	\N	\N	\N	\N	Extraído de la pestaña "RENZO" (Fila 15)	\N	2026-09-02 14:06:59.682	2026-09-03 20:13:04.756	\N
6185f2df-f687-4791-b978-194d5881fa3d	SPRAY BUCAL  5 LITROS CANELA	41fd3709-15c7-4070-9f9a-aa09e2bb6189	e8c10f2c-6357-4c61-8153-790e7b8a6966	\N	\N	\N	\N	\N	\N	Extraído de la pestaña "RENZO" (Fila 29)	\N	2026-09-02 14:06:59.684	2026-09-03 20:13:04.756	\N
7555b1b7-79a3-4d27-9a45-fb79cf18ed3a	SERUM DE ALOE VERA	7c2fdff6-a4f9-4c6f-8489-60cfb912bf2f	a5a2423e-1c0f-4545-8121-1853976d8fb7	\N	\N	\N	\N	\N	\N	Extraído de la pestaña "NEXARA SAC" (Fila 1)	\N	2026-09-02 14:06:59.73	2026-09-03 20:13:04.76	\N
d31611af-e2c2-40bb-88fd-7a3c687f6962	DESODORANTE DE ADULTOS	b3d74b75-46d2-42a4-8cd7-0e022cff3e5f	14ef77f4-4829-4e5a-9f90-9560d51a947b	\N	\N	\N	\N	\N	\N	Extraído de la pestaña "JAIRO OCHOA" (Fila 16)	\N	2026-09-02 14:06:59.72	2026-09-03 20:13:04.773	\N
9b8eac3b-149c-4293-bd7c-f1d001e26dc5	DESODORANTE DE NIÑOS	857befbd-9b54-4af7-b1a2-0843a6de4c07	14ef77f4-4829-4e5a-9f90-9560d51a947b	\N	\N	\N	\N	\N	\N	Extraído de la pestaña "JAIRO OCHOA" (Fila 32)	\N	2026-09-02 14:06:59.722	2026-09-03 20:13:04.773	\N
442e2d5b-a9c8-4ae8-87f3-5ec35f95180e	CHAMPU DE JENGIBRE, CANELA, CLAVO DE OLOR Y CEBOLLA	f29bfbd6-a49f-40db-ae02-54c35bf7da17	14ef77f4-4829-4e5a-9f90-9560d51a947b	\N	\N	\N	\N	\N	\N	Extraído de la pestaña "JAIRO OCHOA" (Fila 48)	\N	2026-09-02 14:06:59.725	2026-09-03 20:13:04.773	\N
d96375d4-c87a-40f1-8ee5-e589419cb4c7	RETARDANTE  EN GEL	9454995f-d03f-4198-9f7e-23ff3f2c0fa0	a2d4abc0-5c0a-4f6a-ada6-41f4266d4e7c	\N	\N	\N	\N	\N	\N	Extraído de la pestaña "AUSTIN SANTOS" (Fila 1)	\N	2026-09-02 14:06:59.664	2026-09-03 20:13:04.784	\N
a31a38a7-dafb-4dfb-a0a0-b797fd3bcb66	CREMA DERMA BEE	c677d242-7dd1-4e76-b9a9-b474cbe1668c	a2d4abc0-5c0a-4f6a-ada6-41f4266d4e7c	\N	\N	\N	\N	\N	\N	Extraído de la pestaña "AUSTIN SANTOS" (Fila 17)	\N	2026-09-02 14:06:59.666	2026-09-03 20:13:04.784	\N
08af34e2-e5b5-4a44-b3be-760e1c13abb0	PERFUME ECONOMICO	56da5faa-4c15-4e1d-b7a7-9c75b1b3c8b8	a2d4abc0-5c0a-4f6a-ada6-41f4266d4e7c	\N	\N	\N	\N	\N	\N	Extraído de la pestaña "AUSTIN SANTOS" (Fila 29)	\N	2026-09-02 14:06:59.669	2026-09-03 20:13:04.784	\N
71dc2c3f-5527-4d59-be7c-3e0cc4190098	RETARDANTE LIQUIDO NORMAL	1207caaa-eb92-440f-8255-fc66d0ed68b9	a2d4abc0-5c0a-4f6a-ada6-41f4266d4e7c	\N	\N	\N	\N	\N	\N	Extraído de la pestaña "AUSTIN SANTOS" (Fila 39)	\N	2026-09-02 14:06:59.672	2026-09-03 20:13:04.784	\N
a792fb5c-a81c-4525-b54c-43cd50ebe383	SERUM DE OJERAS	8afd746d-1947-4852-89ec-4d14cd6880e6	485645c4-bcdb-47b2-b4da-0254928ef985	\N	\N	\N	\N	\N	\N	Extraído de la pestaña "FIESTAS" (Fila 17)	\N	2026-09-02 14:06:59.713	2026-09-03 21:08:48.833	\N
b6d3f2b6-09e5-4364-ade1-42d32bba0f99	SPRAY EXFOLIANTE	783954c6-35e9-4b24-bee6-cc4217cadc67	485645c4-bcdb-47b2-b4da-0254928ef985	\N	\N	\N	\N	\N	\N	Extraído de la pestaña "FIESTAS" (Fila 31)	\N	2026-09-02 14:06:59.715	2026-09-03 21:08:48.833	\N
4bd3430c-2b3a-49ad-810f-f72d868caa10	TONICO EN CREMA PARA DOLORES MUSCULARES	bd726427-a14e-4900-99ed-90a239e15af5	469c90ef-d060-49da-9e1a-6a5f68b759ca	\N	\N	\N	\N	\N	\N	Extraído de la pestaña "ÑAUPARI" (Fila 1)	\N	2026-09-02 14:06:59.596	2026-09-03 21:08:48.858	\N
f43ca7a0-b9f0-4ffd-b01a-402326120e84	GEL TENSOR	cb8c5ca5-8e19-4389-8ad7-7bf90503e27f	\N	\N	\N	\N	\N	\N	\N	Extraído de la pestaña "ROBERTO CASTILLO" (Fila 48)	\N	2026-09-02 14:06:59.587	2026-09-03 21:08:49.022	\N
42be512a-75f9-4fa7-8391-91b563d1841b	SERUM ELIMINADOR DE ACNE ACTIVO	fdb68e4c-911c-4015-8235-fb33830a959d	4128ab29-1b8f-402b-b4f7-e1d479495ae3	\N	\N	\N	\N	\N	\N	Extraído de la pestaña "KELLY PEÑA" (Fila 1)	\N	2026-09-02 14:06:59.75	2026-09-02 14:06:59.75	\N
e4fe1e56-cc33-4f4c-b0db-b122b496ed3b	CREMA PARA TATTO CARE	edcd15b3-ed98-49ac-9c24-6ab1197f17d1	ffb82269-bc8f-4d30-9938-c1ae9d346dd3	\N	\N	\N	\N	\N	\N	Extraído de la pestaña "CARLA RIVERA" (Fila 14)	\N	2026-09-02 14:06:59.736	2026-09-03 20:13:04.732	\N
62be438f-4d6f-45c5-9ce1-f0ff86230756	RETARDANTE LIQUIDO 10% OPTIMIZADO	e39c0e0d-1379-4776-aeb5-dae435df2dc9	82a76af1-11b4-461b-941e-8f28ec07a5f8	\N	\N	\N	\N	\N	\N	Extraído de la pestaña "JHON AVILA" (Fila 1)	\N	2026-09-02 14:06:59.741	2026-09-03 20:13:04.751	\N
d5417723-9993-4a54-a843-2525ae4029f0	KOREAN SILK COLLAGEN AMPOULE	76aa7bc3-917e-41ea-8130-789c6d382d84	8786dc25-5680-44fb-9b60-4aca565d8272	\N	\N	\N	\N	\N	\N	Extraído de la pestaña "ANGIE CRUZ" (Fila 1)	\N	2026-09-02 14:06:59.745	2026-09-03 21:08:48.898	\N
\.


--
-- Data for Name: formulas_master; Type: TABLE DATA; Schema: public; Owner: quimicorp
--

COPY public.formulas_master (id, "codigoFormula", "nombreProducto", version, "densidadTeorica", estado, "createdAt", "updatedAt", pasos_elaboracion) FROM stdin;
82f2e66d-a61d-44ae-9121-4b79ed9cb59a	FM-0001	SERUM DE SALMON	1	1.0000	ACTIVA	2026-09-02 14:06:13.415	2026-09-02 14:06:13.415	\N
7c2fdff6-a4f9-4c6f-8489-60cfb912bf2f	FM-0002	SERUM DE ALOE VERA	1	1.0000	ACTIVA	2026-09-02 14:06:13.453	2026-09-02 14:06:13.453	\N
8afd746d-1947-4852-89ec-4d14cd6880e6	FM-0003	SERUM DE OJERAS	1	1.0000	ACTIVA	2026-09-02 14:06:13.483	2026-09-02 14:06:13.483	\N
26748fef-8be7-4faf-9801-7c2f935b7802	FM-0004	SERUM DE HIDRATANTE	1	1.0000	ACTIVA	2026-09-02 14:06:13.51	2026-09-02 14:06:13.51	\N
76aa7bc3-917e-41ea-8130-789c6d382d84	FM-0005	KOREAN SILK COLLAGEN AMPOULE	1	1.0000	ACTIVA	2026-09-02 14:06:13.548	2026-09-02 14:06:13.548	\N
a5a0165f-e571-4667-a6bd-ab1c65539451	FM-0006	SERUM DE ESTRIAS	1	1.0000	ACTIVA	2026-09-02 14:06:13.584	2026-09-02 14:06:13.584	\N
6f203893-fd85-43c9-8d5d-41ea905163f2	FM-0007	SERUM PARA VERRUGAS BLANCO	1	1.0000	ACTIVA	2026-09-02 14:06:13.616	2026-09-02 14:06:13.616	\N
077daf29-d2ca-439b-b52e-080fd1e3dbd1	FM-0008	SERUM ANTIARRUGAS	1	1.0000	ACTIVA	2026-09-02 14:06:13.643	2026-09-02 14:06:13.643	\N
b60a49ef-7661-4b40-b92f-0d2c54d045b4	FM-0009	SERUM DE HEMORROIDES	1	1.0000	ACTIVA	2026-09-02 14:06:13.665	2026-09-02 14:06:13.665	\N
fdb68e4c-911c-4015-8235-fb33830a959d	FM-0010	SERUM ELIMINADOR DE ACNE ACTIVO	1	1.0000	ACTIVA	2026-09-02 14:06:13.71	2026-09-02 14:06:13.71	\N
11c5b517-d6b3-4b50-b928-cd9b3cf7126e	FM-0011	SERUM CLAREADOR	1	1.0000	ACTIVA	2026-09-02 14:06:13.756	2026-09-02 14:06:13.756	\N
88143e6e-dcd4-491b-80b5-3164c1a158d0	FM-0012	SERUM CON VITAMINA C (4.5 A 5.5 PH)	1	1.0000	ACTIVA	2026-09-02 14:06:13.786	2026-09-02 14:06:13.786	\N
90090e0c-a7d2-45ed-a76c-250104d9653d	FM-0013	SERUM ANTIARRUGAS O REAFIRMANTE	1	1.0000	ACTIVA	2026-09-02 14:06:13.812	2026-09-02 14:06:13.812	\N
31bf4bc2-bbab-49d6-8fd6-607b59cd97d9	FM-0014	SERUM BLANQUEADOR CON ACIDO KOJICO	1	1.0000	ACTIVA	2026-09-02 14:06:13.843	2026-09-02 14:06:13.843	\N
36b0b7a3-4c34-4a5b-b989-3b38de34367b	FM-0015	SERUM DE PESTAÑA	1	1.0000	ACTIVA	2026-09-02 14:06:13.87	2026-09-02 14:06:13.87	\N
766bf635-ca22-4a7f-aa7b-b4f23ac53296	FM-0016	SERUM FACIAL DE COLAGENO	1	1.0000	ACTIVA	2026-09-02 14:06:13.896	2026-09-02 14:06:13.896	\N
f8d03bcc-578f-4ba2-aafc-78626f970221	FM-0017	SERUM DE HIDRATANTE CON CENTELLA ASIATICA	1	1.0000	ACTIVA	2026-09-02 14:06:13.929	2026-09-02 14:06:13.929	\N
aebfa2cb-752a-42d5-a0af-53f996f3aa0f	FM-0018	SERUM DE MIXSOON	1	1.0000	ACTIVA	2026-09-02 14:06:13.962	2026-09-02 14:06:13.962	\N
ffea9f38-a8a8-461e-88bc-aca360979aa0	FM-0019	BREATIFY	1	1.0000	ACTIVA	2026-09-02 14:06:13.99	2026-09-02 14:06:13.99	\N
af5770ae-205b-4ae7-a0bd-98fbac504a80	FM-0020	GEL EXFOLIANTE	1	1.0000	ACTIVA	2026-09-02 14:06:14.019	2026-09-02 14:06:14.019	\N
5a64dacd-8395-406e-8171-ec8b0e05ceb7	FM-0021	GEL MUSCULAR	1	1.0000	ACTIVA	2026-09-02 14:06:14.057	2026-09-02 14:06:14.057	\N
cb8c5ca5-8e19-4389-8ad7-7bf90503e27f	FM-0022	GEL TENSOR FACIAL	1	1.0000	ACTIVA	2026-09-02 14:06:14.082	2026-09-02 14:06:14.082	\N
f7bc40b4-dc03-4d23-935d-4eaf3c6b227d	FM-0023	GEL ANTIDOLOR	1	1.0000	ACTIVA	2026-09-02 14:06:14.106	2026-09-02 14:06:14.106	\N
abfa6d15-3aa3-4137-95e2-1513ea218edb	FM-0024	GEL BLANQUEADOR	1	1.0000	ACTIVA	2026-09-02 14:06:14.14	2026-09-02 14:06:14.14	\N
20a347ce-c963-49a9-95d5-086924751ad2	FM-0025	GEL DE DRAGON	1	1.0000	ACTIVA	2026-09-02 14:06:14.163	2026-09-02 14:06:14.163	\N
9454995f-d03f-4198-9f7e-23ff3f2c0fa0	FM-0026	RETARDANTE EN GEL	1	1.0000	ACTIVA	2026-09-02 14:06:14.188	2026-09-02 14:06:14.188	\N
21854509-e9c1-4fb7-9c44-81ca4f046462	FM-0027	BLANQUEADOR DENTAL EN GEL 10 KILOS	1	1.0000	ACTIVA	2026-09-02 14:06:14.217	2026-09-02 14:06:14.217	\N
9129c87c-35e8-4ff5-a6da-e15899eb8f35	FM-0028	GEL TENSOR	1	1.0000	ACTIVA	2026-09-02 14:06:14.247	2026-09-02 14:06:14.247	\N
d5787078-4b7f-49d2-b507-b5c084d46f96	FM-0029	CREMA MICROTGHT	1	1.0000	ACTIVA	2026-09-02 14:06:14.271	2026-09-02 14:06:14.271	\N
41c6f994-255a-451b-8574-481989ec137d	FM-0030	BASE MAQUILLAJE CON DIMETICONA - BLANCO	1	1.0000	ACTIVA	2026-09-02 14:06:14.295	2026-09-02 14:06:14.295	\N
d7314864-bb03-4141-aa29-7ad8f99d598a	FM-0031	CREMA FACIAL HIDRATANTE	1	1.0000	ACTIVA	2026-09-02 14:06:14.321	2026-09-02 14:06:14.321	\N
c677d242-7dd1-4e76-b9a9-b474cbe1668c	FM-0032	CREMA DERMA BEE, ESTRIAS Y REAFIRMANTE	1	1.0000	ACTIVA	2026-09-02 14:06:14.347	2026-09-02 14:06:14.347	\N
4969ca62-91e9-4fd5-8d28-968d7589c959	FM-0033	CREMA DE CICATRICES	1	1.0000	ACTIVA	2026-09-02 14:06:14.369	2026-09-02 14:06:14.369	\N
608ad73c-03b6-4950-8a59-7b9f03ccef38	FM-0034	CREMA PARA HEMORROIDES	1	1.0000	ACTIVA	2026-09-02 14:06:14.4	2026-09-02 14:06:14.4	\N
2db36797-c425-4713-baee-a6237a042fba	FM-0035	CREMA PARA CALLOS	1	1.0000	ACTIVA	2026-09-02 14:06:14.43	2026-09-02 14:06:14.43	\N
51684c3e-c663-4a84-b423-33d55d1490da	FM-0036	CREMA DE ELIMINADOR DE ACNE ACTIVO	1	1.0000	ACTIVA	2026-09-02 14:06:14.459	2026-09-02 14:06:14.459	\N
3a8974f6-aaf2-4de6-ad96-cc1f6932829c	FM-0037	CREMA BEE VENOM	1	1.0000	ACTIVA	2026-09-02 14:06:14.48	2026-09-02 14:06:14.48	\N
71cf973c-9a35-4b03-846e-68f3b41c4da6	FM-0038	CREMA PARA RIZOS	1	1.0000	ACTIVA	2026-09-02 14:06:14.506	2026-09-02 14:06:14.506	\N
00e3bd70-80ff-44df-ab85-902ad4f176fe	FM-0039	CREMA PARA PEINAR	1	1.0000	ACTIVA	2026-09-02 14:06:14.532	2026-09-02 14:06:14.532	\N
edcd15b3-ed98-49ac-9c24-6ab1197f17d1	FM-0040	CREMA PARA TATTO CARE	1	1.0000	ACTIVA	2026-09-02 14:06:14.557	2026-09-02 14:06:14.557	\N
865abe9b-40f8-4e44-9622-2959b2bbd744	FM-0041	CREMA NEUROPATICA	1	1.0000	ACTIVA	2026-09-02 14:06:14.591	2026-09-02 14:06:14.591	\N
084c7afd-2488-4cc4-9e8e-afba348e97a9	FM-0042	CREMA BLANQUEADORA CON ACIDO HIALURONICO	1	1.0000	ACTIVA	2026-09-02 14:06:14.627	2026-09-02 14:06:14.627	\N
706db1a8-ee44-4401-b17c-ef5e055ee996	FM-0043	CREMA PARA DOLOR MUSCULAR	1	1.0000	ACTIVA	2026-09-02 14:06:14.652	2026-09-02 14:06:14.652	\N
2c5c096c-a322-4778-abe0-2582177ee72b	FM-0044	CREMA TENSOR CON ACIDO HIALURONICO	1	1.0000	ACTIVA	2026-09-02 14:06:14.673	2026-09-02 14:06:14.673	\N
d301f931-4e18-49f2-a285-eeb29ae0d875	FM-0045	CREMA ANTIMICOTICA PARA HONGOS (EFECTO RAPIDO)	1	1.0000	ACTIVA	2026-09-02 14:06:14.698	2026-09-02 14:06:14.698	\N
1def0793-ff79-4508-bb11-4f4e5de9d7fb	FM-0046	CREMA ANTICELULITIS, ESTRIAS	1	1.0000	ACTIVA	2026-09-02 14:06:14.721	2026-09-02 14:06:14.721	\N
1de09b72-72ca-40c1-b974-ce60f86600a9	FM-0047	CREMA PARA VARICES	1	1.0000	ACTIVA	2026-09-02 14:06:14.749	2026-09-02 14:06:14.749	\N
871df356-4f5b-483c-b5f1-5e21d0bf6eb7	FM-0048	CREMA PARA DOLOR MUSCULAR CON MAGNESIO	1	1.0000	ACTIVA	2026-09-02 14:06:14.785	2026-09-02 14:06:14.785	\N
5ec0194c-0b20-4832-8e5c-5929e342ee9b	FM-0049	CREMA BOTOX VENENO DE ABEJA	1	1.0000	ACTIVA	2026-09-02 14:06:14.807	2026-09-02 14:06:14.807	\N
439d0975-3402-485e-a122-2cea9dec16f6	FM-0050	BLOQUEADOR	1	1.0000	ACTIVA	2026-09-02 14:06:14.842	2026-09-02 14:06:14.842	\N
26319221-83f5-4b08-8e3f-2ec3a906c1ba	FM-0051	CREMA CON MINOXIDIL 5%	1	1.0000	ACTIVA	2026-09-02 14:06:14.882	2026-09-02 14:06:14.882	\N
ec5535c7-c614-432c-9a51-1e82bd9f62c0	FM-0052	BALSAMO DE ARRUGAS	1	1.0000	ACTIVA	2026-09-02 14:06:14.906	2026-09-02 14:06:14.906	\N
23e048f3-728d-4c9a-a563-6e72c07df54c	FM-0053	POMODA DE ARNICA	1	1.0000	ACTIVA	2026-09-02 14:06:14.934	2026-09-02 14:06:14.934	\N
9df7edc6-244b-43f9-9ac1-1c6f1c20fb4f	FM-0054	ACEITE ANTICELULITICO	1	1.0000	ACTIVA	2026-09-02 14:06:14.954	2026-09-02 14:06:14.954	\N
373354e6-a9ce-4e74-8082-4bf30e742b42	FM-0055	ACEITE ANTIVELLO CORPORAL	1	1.0000	ACTIVA	2026-09-02 14:06:14.981	2026-09-02 14:06:14.981	\N
e97a196a-ef4d-4cb1-b11c-e2644da078da	FM-0056	SERUM ACEITOSO	1	1.0000	ACTIVA	2026-09-02 14:06:15.015	2026-09-02 14:06:15.015	\N
09b09657-6380-4601-ae92-8ec5657d9a7e	FM-0057	ACEITE PARA CABELLO	1	1.0000	ACTIVA	2026-09-02 14:06:15.042	2026-09-02 14:06:15.042	\N
0d81416b-050b-4144-b129-9aa2b7ae8679	FM-0058	EXTRACTO PERFUMADOR DE CABELLO OLEOSO	1	1.0000	ACTIVA	2026-09-02 14:06:15.063	2026-09-02 14:06:15.063	\N
887ff0a0-dc22-413a-bc04-397cc690b4ca	FM-0059	ACEITE CORPORAL REAFIRMANTE	1	1.0000	ACTIVA	2026-09-02 14:06:15.084	2026-09-02 14:06:15.084	\N
fcd05db5-1f19-4a83-b47b-e76278dd6bd2	FM-0060	SPRAY ANTIPARASITO PARA PERROS	1	1.0000	ACTIVA	2026-09-02 14:06:15.105	2026-09-02 14:06:15.105	\N
1207caaa-eb92-440f-8255-fc66d0ed68b9	FM-0061	RETARDANTE LIQUIDO NORMAL	1	1.0000	ACTIVA	2026-09-02 14:06:15.146	2026-09-02 14:06:15.146	\N
276b0780-f0aa-4eb4-a1be-6ec9791e05a0	FM-0062	SPRAY BUCAL MENTA	1	1.0000	ACTIVA	2026-09-02 14:06:15.175	2026-09-02 14:06:15.175	\N
51c7e144-5777-4b07-8f9c-24d1cbf78fa5	FM-0063	TONICO DE MASCOTAS (RENOVAPET)	1	1.0000	ACTIVA	2026-09-02 14:06:15.204	2026-09-02 14:06:15.204	\N
73af24d4-966e-4f9d-b32a-77b07da4b4e5	FM-0064	ELHOE 4%	1	1.0000	ACTIVA	2026-09-02 14:06:15.235	2026-09-02 14:06:15.235	\N
31a6edb3-573a-46c9-9bbd-bfe09b908576	FM-0065	ELHOE 0.03%	1	1.0000	ACTIVA	2026-09-02 14:06:15.254	2026-09-02 14:06:15.254	\N
783954c6-35e9-4b24-bee6-cc4217cadc67	FM-0066	SPRAY EXFOLIANTE	1	1.0000	ACTIVA	2026-09-02 14:06:15.272	2026-09-02 14:06:15.272	\N
e4d50ada-7943-4705-a2e9-9900c784b5d3	FM-0067	DIAMANTEX	1	1.0000	ACTIVA	2026-09-02 14:06:15.309	2026-09-02 14:06:15.309	\N
a918f475-860f-4f76-9772-3b7d7916355d	FM-0068	SPRAY TERBINAFINA AL 8%	1	1.0000	ACTIVA	2026-09-02 14:06:15.333	2026-09-02 14:06:15.333	\N
edd1a8d3-ba70-4f76-ae37-2f54863d5ad8	FM-0069	SPRAY ALISADOR, ANTI FRIZZ	1	1.0000	ACTIVA	2026-09-02 14:06:15.351	2026-09-02 14:06:15.351	\N
857befbd-9b54-4af7-b1a2-0843a6de4c07	FM-0070	DESODORANTE DE NIÑOS	1	1.0000	ACTIVA	2026-09-02 14:06:15.384	2026-09-02 14:06:15.384	\N
b3d74b75-46d2-42a4-8cd7-0e022cff3e5f	FM-0071	DESODORANTE DE ADULTOS	1	1.0000	ACTIVA	2026-09-02 14:06:15.418	2026-09-02 14:06:15.418	\N
dc881952-2ee6-4862-9ae1-98a1bb2b21ad	FM-0072	ANTIMICOTICO EN SPRAY PARA HONGOS DE UÑAS	1	1.0000	ACTIVA	2026-09-02 14:06:15.453	2026-09-02 14:06:15.453	\N
ece80350-3939-49e5-9f14-77fef6ab8705	FM-0073	SPRAY ALIVIO PARA PSORIASIS	1	1.0000	ACTIVA	2026-09-02 14:06:15.473	2026-09-02 14:06:15.473	\N
7d5e3f17-f2b4-4cd1-bc05-7cb420ab2050	FM-0074	SPRAY DE MAGNESIO	1	1.0000	ACTIVA	2026-09-02 14:06:15.511	2026-09-02 14:06:15.511	\N
9bdb10ed-c7c9-4a8a-aff8-fb8d454796a7	FM-0075	DESENGRASANTE O QUITA OXIDO	1	1.0000	ACTIVA	2026-09-02 14:06:15.521	2026-09-02 14:06:15.521	\N
e39c0e0d-1379-4776-aeb5-dae435df2dc9	FM-0076	RETARDANTE LIQUIDO OPTIMIZADO	1	1.0000	ACTIVA	2026-09-02 14:06:15.549	2026-09-02 14:06:15.549	\N
8e8851c7-33c2-46b6-8cc4-030fcd106e79	FM-0077	PERFUME PACO RABANNE LUCKY	1	1.0000	ACTIVA	2026-09-02 14:06:15.579	2026-09-02 14:06:15.579	\N
dfcce3b5-5fef-4939-9532-983bc11af826	FM-0078	SPRAY DE OIDOS - TRINNIDROP	1	1.0000	ACTIVA	2026-09-02 14:06:15.601	2026-09-02 14:06:15.601	\N
5b3545ca-ce48-488d-80be-238b065b16ed	FM-0079	SPRAY DE OIDOS	1	1.0000	ACTIVA	2026-09-02 14:06:15.62	2026-09-02 14:06:15.62	\N
38c0e681-46c6-41c9-901e-4d1086ac8076	FM-0080	SELLADOR NANOCERAMICO	1	1.0000	ACTIVA	2026-09-02 14:06:15.635	2026-09-02 14:06:15.635	\N
41fd3709-15c7-4070-9f9a-aa09e2bb6189	FM-0081	SPRAY BUCAL	1	1.0000	ACTIVA	2026-09-02 14:06:15.647	2026-09-02 14:06:15.647	\N
c86eabce-1e2f-4dc7-8da4-4b705160e0c7	FM-0082	SPRAY TERBINAFINA 8%	1	1.0000	ACTIVA	2026-09-02 14:06:15.675	2026-09-02 14:06:15.675	\N
b0be1da3-26c2-4637-b1ca-a346148578e5	FM-0083	PET SKIN SOOTHING SPRAY	1	1.0000	ACTIVA	2026-09-02 14:06:15.693	2026-09-02 14:06:15.693	\N
56da5faa-4c15-4e1d-b7a7-9c75b1b3c8b8	FM-0084	PERFUME ECONOMICO	1	1.0000	ACTIVA	2026-09-02 14:06:15.728	2026-09-02 14:06:15.728	\N
d14bd429-0a26-452e-b1c5-75a9ae200a52	FM-0085	PERFUME ESTANDAR ALTO	1	1.0000	ACTIVA	2026-09-02 14:06:15.747	2026-09-02 14:06:15.747	\N
ab9d67f4-05e6-4228-9aa5-5aad2537f87c	FM-0086	SPRAY DE HEMORROIDES	1	1.0000	ACTIVA	2026-09-02 14:06:15.771	2026-09-02 14:06:15.771	\N
bd726427-a14e-4900-99ed-90a239e15af5	FM-0087	SPRAY DOLORES MUSCULARES	1	1.0000	ACTIVA	2026-09-02 14:06:15.793	2026-09-02 14:06:15.793	\N
f29bfbd6-a49f-40db-ae02-54c35bf7da17	FM-0088	CHAMPU DE JENGIBRE, CANELA, CLAVO DE OLOR Y CEBOLLA	1	1.0000	ACTIVA	2026-09-02 14:06:15.808	2026-09-02 14:06:15.808	\N
\.


--
-- Data for Name: incidencias_lote; Type: TABLE DATA; Schema: public; Owner: quimicorp
--

COPY public.incidencias_lote (id, "loteProduccionId", "reportadoPorId", "tipoIncidencia", descripcion, "impactoMerma", "createdAt") FROM stdin;
\.


--
-- Data for Name: insumos; Type: TABLE DATA; Schema: public; Owner: quimicorp
--

COPY public.insumos (id, codigo, nombre, "familiaId", "unidadMedida", "unidadMedidaVisual", categoria, "proveedorHistorico", "stockTeorico", "stockReal", "stockMinimo", "costoUnitario", estado, tipo, "createdAt", "updatedAt", estado_fisico) FROM stdin;
\.


--
-- Data for Name: kardex_inmutable; Type: TABLE DATA; Schema: public; Owner: quimicorp
--

COPY public.kardex_inmutable (id, "insumoId", "tipoMovimiento", cantidad, "stockAnterior", "stockNuevo", "documentoReferencia", "usuarioId", "createdAt") FROM stdin;
\.


--
-- Data for Name: kardex_movimientos; Type: TABLE DATA; Schema: public; Owner: quimicorp
--

COPY public.kardex_movimientos (id, categoria_kardex, producto_nombre, familia, categoria_nombre, proveedor_cliente, unidad_medida, fecha, tipo_doc, serie, numero, otp, tipo_operacion, cantidad_entrada, cantidad_salida, saldo_final, costo_unitario, monto_entrada_pen, monto_salida_pen, monto_saldo_pen, insumo_id, usuario_id, sede_id, created_at) FROM stdin;
\.


--
-- Data for Name: marcaciones_biometrico; Type: TABLE DATA; Schema: public; Owner: quimicorp
--

COPY public.marcaciones_biometrico (id, "usuarioId", "tipoMarcacion", "timestamp", "dispositivoId") FROM stdin;
\.


--
-- Data for Name: marcaciones_pendientes; Type: TABLE DATA; Schema: public; Owner: quimicorp
--

COPY public.marcaciones_pendientes (id, dispositivo_id, codigo_biometrico, tipo_marcacion, "timestamp", procesada, vinculado_a_id, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: metricas_produccion_diaria; Type: TABLE DATA; Schema: public; Owner: quimicorp
--

COPY public.metricas_produccion_diaria (id, fecha, "volumenTotalLitros", "mermaTotalKg", "eficienciaPromedio", "createdAt") FROM stdin;
\.


--
-- Data for Name: ordenes_produccion; Type: TABLE DATA; Schema: public; Owner: quimicorp
--

COPY public.ordenes_produccion (id, "codigoLote", "clienteNombre", "operariosAsignados", "colorEspecificado", "fraganciaEspecificada", prioridad, "observacionesQA", "motivoRechazo", "pasoProceso", "formulaId", "cantidadPlanificada", "cantidadObtenida", "mermaCalculada", estado, "supervisorId", "fechaCierre", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: pagos_abonos; Type: TABLE DATA; Schema: public; Owner: quimicorp
--

COPY public.pagos_abonos (id, cuenta_cobrar_id, monto_abonado, fecha_abono, medio, banco, num_operacion, observaciones, created_at) FROM stdin;
26f9f8e5-5729-40d4-909b-95b3016f3717	cb1c8fae-3b69-403e-8679-da21e75a04b8	1386.00	2026-08-03 00:00:00	Deposito en cuenta	Interbank	OP-E001-180	Pago total registrado según control de ventas y cobranzas	2026-09-04 15:33:57.104
1e21405f-f6d6-4751-9376-3bbf7290969b	ba26cd78-2fc5-48eb-a6d5-76348c8bb377	247.80	2026-08-03 00:00:00	Deposito en cuenta	Interbank	OP-E001-181	Pago total registrado según control de ventas y cobranzas	2026-09-04 15:33:57.11
a2a30a61-ec9a-45b1-8509-4439666832e0	fa7f906c-80c4-411e-9ad0-6cdea48e21fe	1350.00	2026-08-03 00:00:00	Deposito en cuenta	Interbank	OP-EB01-100	Pago total registrado según control de ventas y cobranzas	2026-09-04 15:33:57.114
ff071405-6547-4b61-91bf-932bd381b3df	3678650f-a343-4086-bad8-b00afa41e107	624.00	2026-08-04 00:00:00	Deposito en cuenta	Interbank	OP-E001-182	Pago total registrado según control de ventas y cobranzas	2026-09-04 15:33:57.119
6aae2a7a-9b02-42e4-8fd2-f12e0cd59b1b	1ad167c6-3082-47ec-9258-cb3b6e4b734f	5000.00	2026-08-04 00:00:00	Deposito en cuenta	Interbank	OP-E001-183	Pago total registrado según control de ventas y cobranzas	2026-09-04 15:33:57.124
f273a87e-e141-4b39-9c63-059498fd5183	67c3d636-0482-4cfb-9142-cfd515a31c77	750.00	2026-08-04 00:00:00	Deposito en cuenta	Interbank	OP-EB01-101	Pago total registrado según control de ventas y cobranzas	2026-09-04 15:33:57.128
418be371-ec16-489f-9c4a-12ddad7e59d1	44933b45-914f-4d66-a53f-55f0070a493d	1325.00	2026-08-07 00:00:00	Deposito en cuenta	Interbank	OP-E001-184	Pago total registrado según control de ventas y cobranzas	2026-09-04 15:33:57.132
0f340455-e59e-4ab9-a021-10fdc3b00215	c8e861ff-7259-48f0-a9b0-a62e1294d659	3000.00	2026-07-31 00:00:00	Deposito en cuenta	Interbank	OP-E001-186	Pago total registrado según control de ventas y cobranzas	2026-09-04 15:33:57.139
4f9fbab9-353c-4a3f-ae94-9297c21432c7	7f9410db-9fc5-415e-8045-74c54aa9781d	11800.00	2026-08-05 00:00:00	Deposito en cuenta	Interbank	OP-E001-189	Pago total registrado según control de ventas y cobranzas	2026-09-04 15:33:57.145
ad57828f-b190-407b-8d9f-664aaf5dab51	d4b758a6-cebe-464b-a391-60e74784b834	1700.00	2026-08-07 00:00:00	Deposito en cuenta	Interbank	OP-E001-190	Pago total registrado según control de ventas y cobranzas	2026-09-04 15:33:57.149
df884c09-4dfe-483c-bfa5-86f0be56b15a	f1c3673c-f8cd-4888-a84c-04c76fd7a84c	150.00	2026-08-07 00:00:00	Deposito en cuenta	Interbank	OP-E001-191	Pago total registrado según control de ventas y cobranzas	2026-09-04 15:33:57.153
7e5cd23d-f31d-47dd-8ab1-79d902805c61	c277c4e0-5fe7-418b-9ed9-d0fb323521d3	1302.00	2026-08-04 00:00:00	Deposito en cuenta	Interbank	OP-EB01-102	Pago total registrado según control de ventas y cobranzas	2026-09-04 15:33:57.157
3eee9d13-da8a-48e8-8c69-f343f67593a1	06251866-63c1-46be-be48-8bee22534d6e	2350.00	2026-08-05 00:00:00	Deposito en cuenta	Interbank	OP-EB01-103	Pago total registrado según control de ventas y cobranzas	2026-09-04 15:33:57.161
c940d6ad-8753-4bb0-b802-bd10165baf5e	f5785be2-e298-4ca9-9a23-53d0ca201a6a	1350.00	2026-08-07 00:00:00	Deposito en cuenta	Interbank	OP-E001-192	Pago total registrado según control de ventas y cobranzas	2026-09-04 15:33:57.164
6df975ce-df88-4e51-82fb-34c843ddb3ac	cef5c4b0-5279-430c-9c08-37e72c61388e	1650.00	2026-08-10 00:00:00	Deposito en cuenta	Interbank	OP-E001-193	Pago total registrado según control de ventas y cobranzas	2026-09-04 15:33:57.17
6c9018af-7838-4552-91fb-1ea9d0b483f6	21f995ad-10a1-4de6-b0ad-d9bb8bf5a4f6	1170.00	2026-08-10 00:00:00	Deposito en cuenta	Interbank	OP-E001-194	Pago total registrado según control de ventas y cobranzas	2026-09-04 15:33:57.174
0114c1bf-c7f4-412c-bffb-c2bccaf9953f	d8202da4-0691-4143-a3f9-ce3e1fa2ceac	1934.00	2026-08-10 00:00:00	Deposito en cuenta	Interbank	OP-EB01-104	Pago total registrado según control de ventas y cobranzas	2026-09-04 15:33:57.177
a44c90db-322a-4909-affd-cdf15bf1ca70	d661dfbf-3ad2-461f-9bdd-b99b64047c20	1875.00	2026-08-10 00:00:00	Deposito en cuenta	Interbank	OP-EB01-105	Pago total registrado según control de ventas y cobranzas	2026-09-04 15:33:57.181
16c30f96-2e86-4f04-85e3-05cb324e2867	dc7e265a-710a-4165-9326-fa6bac576756	374.00	2026-08-11 00:00:00	Deposito en cuenta	Interbank	OP-E001-195	Pago total registrado según control de ventas y cobranzas	2026-09-04 15:33:57.185
31c61d7f-573d-4d61-903e-5ed030a2fd65	ffd2d0c9-1c49-4edb-b2f5-1336b760db3c	3000.00	2026-08-11 00:00:00	Deposito en cuenta	Interbank	OP-E001-196	Pago total registrado según control de ventas y cobranzas	2026-09-04 15:33:57.189
b1d502d8-2b95-44a9-989f-53afb2cca5d1	2f752cc1-d34b-4a03-b8a5-ae15fdf4d9cc	184.00	2026-08-11 00:00:00	Deposito en cuenta	Interbank	OP-EB01-106	Pago total registrado según control de ventas y cobranzas	2026-09-04 15:33:57.193
570556a8-eac7-4ac1-8b50-236123154f40	27526a24-fac3-4d10-b0b0-1bd319d0334a	384.00	2026-08-11 00:00:00	Deposito en cuenta	Interbank	OP-E001-197	Pago total registrado según control de ventas y cobranzas	2026-09-04 15:33:57.196
a974289c-5b6c-491e-90a9-9b56db3cfc58	481604c9-f93d-4a5c-9b1a-d3055eac317e	1640.00	2026-08-11 00:00:00	Deposito en cuenta	Interbank	OP-E001-198	Pago total registrado según control de ventas y cobranzas	2026-09-04 15:33:57.202
fb6315b4-a7f8-4418-93e0-bec9c27f3710	07709ace-3a14-4532-b19d-c96255e8dc82	11200.00	2026-08-12 00:00:00	Deposito en cuenta	Interbank	OP-E001-201	Pago total registrado según control de ventas y cobranzas	2026-09-04 15:33:57.21
192efd9f-8137-4145-b01b-8b27e3db5555	68b62188-d84a-4e16-b3a8-0457afa3f20f	3000.00	2026-08-12 00:00:00	Deposito en cuenta	Interbank	OP-E001-202	Pago total registrado según control de ventas y cobranzas	2026-09-04 15:33:57.214
0ec2f7b0-4b44-4aa2-9c21-1c65b570efe9	2c130e55-f2b1-4c27-9ee6-27ea60ceb497	8400.00	2026-08-12 00:00:00	Deposito en cuenta	Interbank	OP-E001-203	Pago total registrado según control de ventas y cobranzas	2026-09-04 15:33:57.219
d4574321-11bb-418c-9e25-90afb8b31867	da2e1be6-4f04-48fb-bdf7-3f6ae2622ad3	800.00	2026-08-13 00:00:00	Deposito en cuenta	Interbank	OP-E001-204	Pago total registrado según control de ventas y cobranzas	2026-09-04 15:33:57.225
b4f31fc9-f15f-414e-91a3-6366afa5f255	f2ec2913-fafd-4689-8a1f-ff5179842ea0	1100.00	2026-08-13 00:00:00	Deposito en cuenta	Interbank	OP-E001-205	Pago total registrado según control de ventas y cobranzas	2026-09-04 15:33:57.228
8307b906-ada5-430c-b7dd-06b2828a1bc3	47f63e03-6368-43b5-8098-f08940aefcba	1890.00	2026-08-14 00:00:00	Deposito en cuenta	Interbank	OP-E001-207	Pago total registrado según control de ventas y cobranzas	2026-09-04 15:33:57.235
b07c2210-9f2c-4693-a915-f2f4c415608c	ee7464e7-c42d-418a-8667-b93dcf782235	2345.00	2026-08-14 00:00:00	Deposito en cuenta	Interbank	OP-E001-208	Pago total registrado según control de ventas y cobranzas	2026-09-04 15:33:57.239
65b6ea6a-5ea9-4345-940d-c117e4283490	2e758381-42e5-4b34-a0d4-ab77c0f13a8e	247.80	2026-08-15 00:00:00	Deposito en cuenta	Interbank	OP-E001-209	Pago total registrado según control de ventas y cobranzas	2026-09-04 15:33:57.242
ba15db33-68b7-4e72-bae1-750e49cdb620	0dc3f70c-b6e5-4e8f-8191-3b174167d137	240.00	2026-08-17 00:00:00	Deposito en cuenta	Interbank	OP-EB01-109	Pago total registrado según control de ventas y cobranzas	2026-09-04 15:33:57.248
8532df42-adf4-4c4e-8655-e1ed90d27690	22e1853d-f4a5-4d6e-af26-a0466bd1746d	1078.00	2026-08-18 00:00:00	Deposito en cuenta	Interbank	OP-E001-210	Pago total registrado según control de ventas y cobranzas	2026-09-04 15:33:57.252
aef1d25b-804f-4a79-a463-3e955f56cbf7	3b95a817-8a38-4db7-8e4e-a423ce17e141	1650.00	2026-08-18 00:00:00	Deposito en cuenta	Interbank	OP-E001-211	Pago total registrado según control de ventas y cobranzas	2026-09-04 15:33:57.256
83e2cb96-bf1b-4e80-b317-cd85fae5074c	fc1557a2-9ad1-45e9-bc56-317dd8a6d470	388.00	2026-08-18 00:00:00	Deposito en cuenta	Interbank	OP-E001-212	Pago total registrado según control de ventas y cobranzas	2026-09-04 15:33:57.259
26f230bc-6cf1-418c-8852-b4e37ed09183	66cc58b3-8c97-414d-9172-778d6bdfcd73	660.00	2026-08-18 00:00:00	Deposito en cuenta	Interbank	OP-EB01-118	Pago total registrado según control de ventas y cobranzas	2026-09-04 15:33:57.267
26f11744-e191-4c8d-900e-39d57050736b	8bbeec26-6325-44dc-aeb8-3af64c083488	605.00	2026-08-18 00:00:00	Deposito en cuenta	Interbank	OP-EB01-119	Pago total registrado según control de ventas y cobranzas	2026-09-04 15:33:57.272
bce40c89-4ccc-4526-b5eb-15690a1c01fc	61f0e790-6161-4df1-95f9-99d3c797e193	660.00	2026-08-18 00:00:00	Deposito en cuenta	Interbank	OP-EB01-120	Pago total registrado según control de ventas y cobranzas	2026-09-04 15:33:57.276
256fb023-a19a-441e-b57e-6f140ab26b63	5e6f3c49-6806-408a-8762-bec11537fa3d	660.00	2026-08-18 00:00:00	Deposito en cuenta	Interbank	OP-EB01-121	Pago total registrado según control de ventas y cobranzas	2026-09-04 15:33:57.28
c63d7fd2-d7fa-4783-916f-ea1c46441426	0e684d60-2774-4d59-a514-0c5797d70cbc	605.00	2026-08-18 00:00:00	Deposito en cuenta	Interbank	OP-EB01-122	Pago total registrado según control de ventas y cobranzas	2026-09-04 15:33:57.285
57ea2345-3246-4349-8b95-307bf3171076	6f0fcb6d-7b62-49d4-a6f4-6edef957c3d5	660.00	2026-08-18 00:00:00	Deposito en cuenta	Interbank	OP-EB01-123	Pago total registrado según control de ventas y cobranzas	2026-09-04 15:33:57.289
e6630d8c-0e66-4a04-8d75-d85fb6f8605f	f9c58e37-668e-4146-9d2c-d3f2acdbf3e8	660.00	2026-08-18 00:00:00	Deposito en cuenta	Interbank	OP-EB01-124	Pago total registrado según control de ventas y cobranzas	2026-09-04 15:33:57.294
cda0a0e6-a669-431a-a7b4-a320550f9c11	ee214999-8a10-4012-852f-6e724846dd1e	660.00	2026-08-18 00:00:00	Deposito en cuenta	Interbank	OP-EB01-125	Pago total registrado según control de ventas y cobranzas	2026-09-04 15:33:57.298
f2657df8-bdb1-4ad4-8850-90157a2cebc8	1ac98465-3995-4f4f-9691-4fc21eadfa12	330.00	2026-08-18 00:00:00	Deposito en cuenta	Interbank	OP-EB01-126	Pago total registrado según control de ventas y cobranzas	2026-09-04 15:33:57.303
94fbdb4e-0d93-4f94-9440-7345b8e00b87	3f87f6c2-db7d-485b-9781-524a31d85b3b	174.00	2026-08-18 00:00:00	Deposito en cuenta	Interbank	OP-EB01-127	Pago total registrado según control de ventas y cobranzas	2026-09-04 15:33:57.307
92af692c-ac64-466a-a778-194d952d1e4d	51505689-224a-4a44-bc33-ec29e317be57	1914.00	2026-08-19 00:00:00	Deposito en cuenta	Interbank	OP-E001-214	Pago total registrado según control de ventas y cobranzas	2026-09-04 15:33:57.311
9e254741-5749-47a8-ad7f-942edb03eb54	70586695-a402-4675-8be9-322ca0763900	384.00	2026-08-19 00:00:00	Deposito en cuenta	Interbank	OP-EB01-128	Pago total registrado según control de ventas y cobranzas	2026-09-04 15:33:57.317
2994556c-c174-4976-a33b-f18d3ccfbc25	c7623313-5ede-413c-a99f-62f86a8c3874	9567.02	2026-08-20 00:00:00	Deposito en cuenta	Interbank	OP-E001-217	Pago total registrado según control de ventas y cobranzas	2026-09-04 15:33:57.323
acf8d14d-1b50-401d-b60b-6f0fa2ef209d	4de988ee-c315-4658-8176-541599f63348	324.00	2026-08-21 00:00:00	Deposito en cuenta	Interbank	OP-E001-218	Pago total registrado según control de ventas y cobranzas	2026-09-04 15:33:57.327
1736e5c6-99cf-43ee-8e32-7267fd9043cc	e8537c19-a374-4a79-baef-4827be29b212	1260.00	2026-08-22 00:00:00	Deposito en cuenta	Interbank	OP-E001-219	Pago total registrado según control de ventas y cobranzas	2026-09-04 15:33:57.331
05325075-c9c7-44be-a381-df52258699f6	be04b264-f18d-433e-bd3c-625868c9552e	204.00	2026-08-22 00:00:00	Deposito en cuenta	Interbank	OP-E001-220	Pago total registrado según control de ventas y cobranzas	2026-09-04 15:33:57.335
\.


--
-- Data for Name: pedido_aditivos; Type: TABLE DATA; Schema: public; Owner: quimicorp
--

COPY public.pedido_aditivos (id, pedido_id, insumo_id, tipo, porcentaje, gramos_calculados, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: pedidos_comerciales; Type: TABLE DATA; Schema: public; Owner: quimicorp
--

COPY public.pedidos_comerciales (id, codigo_orden, codigo_ref_admin, cliente_nombre, cliente_ruc, contacto_nombre, contacto_telefono, direccion_despacho, rep_comercial, condicion_pago, producto_nombre, cantidad_solicitada, unidad_medida, lotes_requeridos, monto_total, fecha_prometida, prioridad, estado, formula_id, notas_admin, motivo_devolucion, doc_type, aroma, color, aroma_text, color_text, variante_id, cliente_id, created_at, updated_at, tipo_comprobante) FROM stdin;
\.


--
-- Data for Name: permisos; Type: TABLE DATA; Schema: public; Owner: quimicorp
--

COPY public.permisos (id, modulo, accion) FROM stdin;
3a44867a-9be6-471c-890a-44acfd4ee70d	inventario	CREATE
df8bb125-b215-4ae4-8e31-4169b0243445	inventario	READ
39e4f14d-81c1-4a87-9b0a-58a36471b2a2	inventario	UPDATE
c9b22f55-a86d-40c6-bec9-0ed3c5ba8426	inventario	DELETE
29207157-4c63-4db7-8016-17bb497093e8	formulas	CREATE
ec0a26df-bb28-4622-a6fe-ecc6ddfae675	formulas	READ
6339fcb1-f627-4e0a-8307-3aac126233db	formulas	UPDATE
c31a9c9e-b52e-49bf-ba92-e61336f1f6d5	formulas	DELETE
c6446f47-18c1-42fc-8f32-ddbb5d1b33df	produccion	CREATE
6f48958b-3856-40bb-a231-31a8ad028001	produccion	READ
880ae36c-c87e-4fe0-a03a-e2ef05493252	produccion	UPDATE
04803d18-9235-453a-8e24-bce45022fdd8	produccion	DELETE
5e88d310-32b5-4aba-af34-47366d329750	kardex	CREATE
33e5d214-6bb1-4b3f-bc33-50775f63686d	kardex	READ
1b0a8be7-14de-4fc8-9abd-1cf26c0d5142	kardex	UPDATE
ed220083-dfc8-43db-84e0-dccff2730dda	kardex	DELETE
2edcae65-d74a-4e23-9614-6dfc102f66ec	qa	CREATE
14dccbf7-3069-42c7-9928-007cedb93fe9	qa	READ
2a3c79ad-7ee7-46e5-b78c-1e8a9616be51	qa	UPDATE
1e4e1ff0-a626-4582-a3b3-e96ef8b35366	qa	DELETE
a309006c-dfbf-4620-93d4-038d86c756b3	pedidos-admin	CREATE
8c47362f-1069-4222-94d2-3ea4ad13c0e0	pedidos-admin	READ
e0322823-d2b0-48ea-b17e-320b55856e49	pedidos-admin	UPDATE
403e9754-c7be-4696-b4a0-673c9a6796ca	pedidos-admin	DELETE
e8d111f3-1606-40a4-af9b-f69d17014b5b	usuarios	CREATE
94a97a21-bdfb-4d7a-9459-efdc22582938	usuarios	READ
5daee4ac-bfcb-4527-8f70-249f29b6378c	usuarios	UPDATE
72480f23-8d49-44f1-80d5-ee31d86af7d2	usuarios	DELETE
74f730e5-f063-4c4c-837e-2d661b299cc4	audit	CREATE
51ca55a1-d265-4820-9fcf-b4e6c56fe241	audit	READ
a899f9ca-b5a6-4d54-bf57-eb7d8e92cf16	audit	UPDATE
b5848a29-6392-400f-9d75-0a3528c78064	audit	DELETE
\.


--
-- Data for Name: proveedores; Type: TABLE DATA; Schema: public; Owner: quimicorp
--

COPY public.proveedores (id, ruc, razon_social, contacto, telefono, correo, direccion, insumo_principal, calificacion, estado, created_at, updated_at) FROM stdin;
d8649cbb-2d99-4d62-90cc-0c1bfa9c84a0	20604222339	HIDROPONIKA SAC	\N	993744417	\N	AV. RAUL FERRERO 126 - LA MOLINA	Materia Prima / Insumos Químicos	5	HOMOLOGADO	2026-09-02 14:06:26.032	2026-09-02 14:06:26.032
ac268d9a-d25f-404a-8dc3-047bb3d735e4	20100860351	DROCERSA S.A.	LUIS CABALLERO	998112661	ventas@drocersa.com.pe	AV. LOS EUCALIPTOS, PARECLA 6 SUB LOTE B-2 - LURIN	Materia Prima / Insumos Químicos	5	HOMOLOGADO	2026-09-02 14:06:26.04	2026-09-02 14:06:26.04
ab62fe49-2e7d-413f-8306-af8e0dafd820	20211040352	QUIMICOS GOICOCHEA SAC	BRENDA JARA PEREZ	986631240	qgventas@quimicosgoicochea.com	AV. NESTOR GAMBETA 150 - CALLAO	Materia Prima / Insumos Químicos	5	HOMOLOGADO	2026-09-02 14:06:26.045	2026-09-02 14:06:26.045
f61db636-35a0-4ad4-a319-834a8bf37a7a	20601134226	LIMACHEM SAC	\N	998588457	mayelimv@gmail.com	JR PANCHO FIERRO 3583 - LOS OLIVOS	Materia Prima / Insumos Químicos	5	HOMOLOGADO	2026-09-02 14:06:26.049	2026-09-02 14:06:26.049
66f2b852-96c1-4986-9bdd-b35e954349ba	20545840597	SG QUIMICOS DEL PERU SAC	JEAN CARLO	979633620	ventas@sgquimicos.com	AV 2 DE OCTUBRE MZ B LOTE 7 - LOS OLIVOS	Materia Prima / Insumos Químicos	5	HOMOLOGADO	2026-09-02 14:06:26.054	2026-09-02 14:06:26.054
8cf8763f-3ce8-4262-9cb1-805440f4a088	20268214284	QUIMICA EXPRESS SAC	MILENE RIVERA	908886509	fuerzadeventas@quimicaexpress.com	AV SANTA ELVIRA N° 6172 - LOS OLIVOS	Materia Prima / Insumos Químicos	5	HOMOLOGADO	2026-09-02 14:06:26.059	2026-09-02 14:06:26.059
718680b5-afae-456f-938b-49bb65c3bdbc	20606967145	QUIMICOS NORPERU E.I.R.L.	CRISTINA CCARI	923691618	quimicos_norperu@hotmail.com	AV. 2 DE  OCTUBRE MZ B LOTE 6 - LOS OLIVOS	Materia Prima / Insumos Químicos	5	HOMOLOGADO	2026-09-02 14:06:26.064	2026-09-02 14:06:26.064
2f3ab071-4de8-4b2d-bfde-20ba3070456f	20602435041	SOLUCIONES QUIMICAS GK E.I.R.L.	ROCIO	934206137	quimicas.gk@outlook.com	CALLE C MZ B LOTE 44 URB INDUSTRIAL. INDEPENDENCIA	Materia Prima / Insumos Químicos	5	HOMOLOGADO	2026-09-02 14:06:26.07	2026-09-02 14:06:26.07
5fac166a-9843-4ad3-94a6-e34003af70a6	20101209181	MARVA SAC	ROCIO	934206137	ventas@marva.com.pe	CALLE C N° 190 URB INDUSTRIAL. INDEPENDENCIA	Materia Prima / Insumos Químicos	5	HOMOLOGADO	2026-09-02 14:06:26.076	2026-09-02 14:06:26.076
55cb7078-ef85-49cd-a3fc-5bebdcb56f72	20294249428	FRAPECO SRL	ROCIO	934206137	\N	JJR MANUEL GONZALES PRADA N° 400 - INDEPENDENCIA	Materia Prima / Insumos Químicos	5	HOMOLOGADO	2026-09-02 14:06:26.082	2026-09-02 14:06:26.082
5db434fb-9f2b-420b-adec-d77eae861466	20513315911	QUIMICA SKR EIRL	\N	998316395	ventas@quimicaskr.com	JR IQUITOS 803 - SAN MARTIN DE PORRES	Materia Prima / Insumos Químicos	5	HOMOLOGADO	2026-09-02 14:06:26.088	2026-09-02 14:06:26.088
55b3e3e5-bb7e-4a1b-b24c-476a0047cc28	20614797496	QUIMICOS GOMBAQUI EIRL	\N	902848858	gonbaquim@gmail.com	URB. SAN VALENTIN MZ F LT 29 II ETAPA - SMP	Materia Prima / Insumos Químicos	5	HOMOLOGADO	2026-09-02 14:06:26.093	2026-09-02 14:06:26.093
24268bd0-7a2a-4636-9912-20e22c58a053	20604539383	OREGOM CHEM GROUP SAC	\N	933 634 055	contacto@quimicaindustrial.pe	JR DANTE 236 - SURQUILLO	Materia Prima / Insumos Químicos	5	HOMOLOGADO	2026-09-02 14:06:26.097	2026-09-02 14:06:26.097
aafb5cc7-d5f8-4e96-925d-9bcb05cdee5c	20461948881	OMNICHEM SAC	FLOR GARAY	919649202	\N	AV. SANTA ROSA DE LLANAVILLA MZ M LOTE 3 -	Materia Prima / Insumos Químicos	5	HOMOLOGADO	2026-09-02 14:06:26.101	2026-09-02 14:06:26.101
1b90766c-4f80-43a1-af4a-c2de57732318	20609766116	CH PLAST SAC	JOSE LOZANO	986307493	\N	AV 29 DE SEPTIEMBRE 208 A.H. VILLA SEÑOR DE LOS MILAGROS - CALLAO	Materia Prima / Insumos Químicos	5	HOMOLOGADO	2026-09-02 14:06:26.108	2026-09-02 14:06:26.108
ae630474-bde4-450d-b8ba-c33dd3d4dd47	20566571693	NOVAQUIMICOS EIRL	\N	960453801	\N	MZA 109 LOTE 4 A.H. ENRIQUE MILLA OCHOA - LOS OLIVOS	Materia Prima / Insumos Químicos	5	HOMOLOGADO	2026-09-02 14:06:26.113	2026-09-02 14:06:26.113
1d98fc8a-9beb-4a2f-833c-29cc3e1df8b7	22544568834	MAPRIAL SAC	\N	946455916	\N	AV. CARLOS IZAGUIRRE 1137 - LOS OLIVOS	Materia Prima / Insumos Químicos	5	HOMOLOGADO	2026-09-02 14:06:26.119	2026-09-02 14:06:26.119
0719fc15-2ccf-4d0b-8ba4-d8d327bae3e6	20609678811	INSUMASTER SAC	EFFRAIN	997895056	\N	CALLE LOS ARTESANOS MZ A 1 LOTE 78 - PUENTE PIEDRA	Materia Prima / Insumos Químicos	5	HOMOLOGADO	2026-09-02 14:06:26.124	2026-09-02 14:06:26.124
55b3464f-d4a6-42f1-8ae2-009686414191	20117949983	ALKOHLER EIRL	LUCERO CHECMAPOCCO	992366378	\N	PROLONGACION CANGALLO N°1263 - LA VICTORIA.	Materia Prima / Insumos Químicos	5	HOMOLOGADO	2026-09-02 14:06:26.128	2026-09-02 14:06:26.128
93df78e4-5ee9-411b-83fd-b9453f89946a	20609553241	QUIMICA CABANILLAS JULCA SAC	\N	982042823	\N	AV. BETANCOURT MZA 96 LOTE 04 A.H. JUAN PABLO II - LOS OLIVOS	Materia Prima / Insumos Químicos	5	HOMOLOGADO	2026-09-02 14:06:26.133	2026-09-02 14:06:26.133
35e76b81-9fda-4f61-85f7-647eab584c87	20608014773	INSUQUIMICA	MIRELLA GRAU	993523033	\N	AV. ALFREDO MENDIOLA 6466 - SMP	Materia Prima / Insumos Químicos	5	HOMOLOGADO	2026-09-02 14:06:26.137	2026-09-02 14:06:26.137
d195723d-fb6a-4ba0-a4c6-5aa4dc05ad27	20600765052	SMART CHEM EIRL	JOSE SANCHEZ	933341721	\N	AV TAHUANTINSUYO 220 - SAN JUAN DE LURIGANCHO	Materia Prima / Insumos Químicos	5	HOMOLOGADO	2026-09-02 14:06:26.142	2026-09-02 14:06:26.142
fac1cb82-ef10-46a1-93df-ca833ab67af5	20100704065	PFLUCKER E HIJOS S.A	\N	998377301	pfluckerehijossa@gmail.com	JR LORETA 630 - BREÑA	Materia Prima / Insumos Químicos	5	HOMOLOGADO	2026-09-02 14:06:26.148	2026-09-02 14:06:26.148
bcb8e26e-f677-47f5-b186-98662c62c01f	20614767881	NORQUIMICOS DEL PERU	CRISTINA CCARI	923691618	norquimicos@hotmail.com	AV. 2 DE  OCTUBRE MZ B LOTE 6 - LOS OLIVOS	Materia Prima / Insumos Químicos	5	HOMOLOGADO	2026-09-02 14:06:26.153	2026-09-02 14:06:26.153
50ee55df-f449-4d81-a426-74f9658bceea	20607231452	COMERCIALIZADORA MARIFE SAC	GLORIA HUAMAN	988676667	ventas@insumosmarife.com	AV LOS VIRREYES MZ. D LOTE 13 FORTALEZA DE ATE VITARTE	Materia Prima / Insumos Químicos	5	HOMOLOGADO	2026-09-02 14:06:26.159	2026-09-02 14:06:26.159
ed688845-4072-495e-be03-0c962aa2b9ef	20603268505	ECOMAFER SOLUCIONES SAC	\N	939126936	ventas.ecomafer@gmail.com	AV. ZARAGOZA URB. PUERTA DE PRO MZA 4	Materia Prima / Insumos Químicos	5	HOMOLOGADO	2026-09-02 14:06:26.164	2026-09-02 14:06:26.164
293d2fb9-e16c-4c44-8b47-55e5725de587	10770194348	EFRAIN ESQUEN CARRERA	EFRAIN ESQUEN	938436908	efrainesquen1234@gmail.com	PANAMERICANA NORTE 33.5 INT H42 MERCADO 3 REGIONES	Materia Prima / Insumos Químicos	5	HOMOLOGADO	2026-09-02 14:06:26.169	2026-09-02 14:06:26.169
019a07a6-7a8c-4582-bb74-8df80ea4237d	20549652141	INVERSIONES AGO SAC	\N	940438049	\N	AV. METROPOLITANA 711 - COMAS	Materia Prima / Insumos Químicos	5	HOMOLOGADO	2026-09-02 14:06:26.174	2026-09-02 14:06:26.174
9e31f0a9-19eb-4ac3-a866-5311f93ab0d5	20609558726	FLORESINTESI FRAGANCIAS Y AROMAS PERU SAC	\N	908846672	\N	AV. MANUEL OLGUIN N° 335 INT 505 URB LOS GRANADOS - SURCO	Materia Prima / Insumos Químicos	5	HOMOLOGADO	2026-09-02 14:06:26.179	2026-09-02 14:06:26.179
5d958052-b98f-4888-8419-c3403da968bb	20521023245	INDUSTRIAS EIZAPLAST S.R.L.	\N	994063570	ventas@eizaplast.com	AV. CHACRA CERRO N° B INT 15 - COMAS	Materia Prima / Insumos Químicos	5	HOMOLOGADO	2026-09-02 14:06:26.185	2026-09-02 14:06:26.185
afabb951-d1dd-4d30-8f23-1e228a749931	20604114960	INDUSTRIAS PET SAC	\N	994063570	\N	CALLE MARIANO MELGAR MZA E LOTE 01 - CARABAYLLO	Materia Prima / Insumos Químicos	5	HOMOLOGADO	2026-09-02 14:06:26.19	2026-09-02 14:06:26.19
8738a654-222d-4f16-ba06-8e77eb59529d	20101216391	INDUSTRIAS DERIVADOS DEL ALCOHOL S.A.	LILIANA HUAMAN	915232865	ventas@inderal.com.pe	CALLE LOS MARTILLOS N° 5033 URB INDUSTRIAL EL NARANJA	Materia Prima / Insumos Químicos	5	HOMOLOGADO	2026-09-02 14:06:26.195	2026-09-02 14:06:26.195
9291f69f-6805-4c4f-a020-28411b31149d	20100459672	AROMAS DEL PERU S.A.	INGRID MAMANI	981014391	ventas_olivos@aromasdelperu.com	AV ALFREDO MENDIOLA N°3915	Materia Prima / Insumos Químicos	5	HOMOLOGADO	2026-09-02 14:06:26.199	2026-09-02 14:06:26.199
\.


--
-- Data for Name: rol_permisos; Type: TABLE DATA; Schema: public; Owner: quimicorp
--

COPY public.rol_permisos ("rolId", "permisoId") FROM stdin;
7926b010-1131-4f5b-94df-a961a1f3c4fb	3a44867a-9be6-471c-890a-44acfd4ee70d
7926b010-1131-4f5b-94df-a961a1f3c4fb	df8bb125-b215-4ae4-8e31-4169b0243445
7926b010-1131-4f5b-94df-a961a1f3c4fb	39e4f14d-81c1-4a87-9b0a-58a36471b2a2
7926b010-1131-4f5b-94df-a961a1f3c4fb	c9b22f55-a86d-40c6-bec9-0ed3c5ba8426
7926b010-1131-4f5b-94df-a961a1f3c4fb	29207157-4c63-4db7-8016-17bb497093e8
7926b010-1131-4f5b-94df-a961a1f3c4fb	ec0a26df-bb28-4622-a6fe-ecc6ddfae675
7926b010-1131-4f5b-94df-a961a1f3c4fb	6339fcb1-f627-4e0a-8307-3aac126233db
7926b010-1131-4f5b-94df-a961a1f3c4fb	c31a9c9e-b52e-49bf-ba92-e61336f1f6d5
7926b010-1131-4f5b-94df-a961a1f3c4fb	c6446f47-18c1-42fc-8f32-ddbb5d1b33df
7926b010-1131-4f5b-94df-a961a1f3c4fb	6f48958b-3856-40bb-a231-31a8ad028001
7926b010-1131-4f5b-94df-a961a1f3c4fb	880ae36c-c87e-4fe0-a03a-e2ef05493252
7926b010-1131-4f5b-94df-a961a1f3c4fb	04803d18-9235-453a-8e24-bce45022fdd8
7926b010-1131-4f5b-94df-a961a1f3c4fb	5e88d310-32b5-4aba-af34-47366d329750
7926b010-1131-4f5b-94df-a961a1f3c4fb	33e5d214-6bb1-4b3f-bc33-50775f63686d
7926b010-1131-4f5b-94df-a961a1f3c4fb	1b0a8be7-14de-4fc8-9abd-1cf26c0d5142
7926b010-1131-4f5b-94df-a961a1f3c4fb	ed220083-dfc8-43db-84e0-dccff2730dda
7926b010-1131-4f5b-94df-a961a1f3c4fb	2edcae65-d74a-4e23-9614-6dfc102f66ec
7926b010-1131-4f5b-94df-a961a1f3c4fb	14dccbf7-3069-42c7-9928-007cedb93fe9
7926b010-1131-4f5b-94df-a961a1f3c4fb	2a3c79ad-7ee7-46e5-b78c-1e8a9616be51
7926b010-1131-4f5b-94df-a961a1f3c4fb	1e4e1ff0-a626-4582-a3b3-e96ef8b35366
7926b010-1131-4f5b-94df-a961a1f3c4fb	a309006c-dfbf-4620-93d4-038d86c756b3
7926b010-1131-4f5b-94df-a961a1f3c4fb	8c47362f-1069-4222-94d2-3ea4ad13c0e0
7926b010-1131-4f5b-94df-a961a1f3c4fb	e0322823-d2b0-48ea-b17e-320b55856e49
7926b010-1131-4f5b-94df-a961a1f3c4fb	403e9754-c7be-4696-b4a0-673c9a6796ca
7926b010-1131-4f5b-94df-a961a1f3c4fb	e8d111f3-1606-40a4-af9b-f69d17014b5b
7926b010-1131-4f5b-94df-a961a1f3c4fb	94a97a21-bdfb-4d7a-9459-efdc22582938
7926b010-1131-4f5b-94df-a961a1f3c4fb	5daee4ac-bfcb-4527-8f70-249f29b6378c
7926b010-1131-4f5b-94df-a961a1f3c4fb	72480f23-8d49-44f1-80d5-ee31d86af7d2
7926b010-1131-4f5b-94df-a961a1f3c4fb	74f730e5-f063-4c4c-837e-2d661b299cc4
7926b010-1131-4f5b-94df-a961a1f3c4fb	51ca55a1-d265-4820-9fcf-b4e6c56fe241
7926b010-1131-4f5b-94df-a961a1f3c4fb	a899f9ca-b5a6-4d54-bf57-eb7d8e92cf16
7926b010-1131-4f5b-94df-a961a1f3c4fb	b5848a29-6392-400f-9d75-0a3528c78064
733876ba-e574-46f7-87fd-327545c0c8af	3a44867a-9be6-471c-890a-44acfd4ee70d
733876ba-e574-46f7-87fd-327545c0c8af	df8bb125-b215-4ae4-8e31-4169b0243445
733876ba-e574-46f7-87fd-327545c0c8af	39e4f14d-81c1-4a87-9b0a-58a36471b2a2
733876ba-e574-46f7-87fd-327545c0c8af	c9b22f55-a86d-40c6-bec9-0ed3c5ba8426
733876ba-e574-46f7-87fd-327545c0c8af	29207157-4c63-4db7-8016-17bb497093e8
733876ba-e574-46f7-87fd-327545c0c8af	ec0a26df-bb28-4622-a6fe-ecc6ddfae675
733876ba-e574-46f7-87fd-327545c0c8af	6339fcb1-f627-4e0a-8307-3aac126233db
733876ba-e574-46f7-87fd-327545c0c8af	c31a9c9e-b52e-49bf-ba92-e61336f1f6d5
733876ba-e574-46f7-87fd-327545c0c8af	c6446f47-18c1-42fc-8f32-ddbb5d1b33df
733876ba-e574-46f7-87fd-327545c0c8af	6f48958b-3856-40bb-a231-31a8ad028001
733876ba-e574-46f7-87fd-327545c0c8af	880ae36c-c87e-4fe0-a03a-e2ef05493252
733876ba-e574-46f7-87fd-327545c0c8af	04803d18-9235-453a-8e24-bce45022fdd8
733876ba-e574-46f7-87fd-327545c0c8af	5e88d310-32b5-4aba-af34-47366d329750
733876ba-e574-46f7-87fd-327545c0c8af	33e5d214-6bb1-4b3f-bc33-50775f63686d
733876ba-e574-46f7-87fd-327545c0c8af	1b0a8be7-14de-4fc8-9abd-1cf26c0d5142
733876ba-e574-46f7-87fd-327545c0c8af	ed220083-dfc8-43db-84e0-dccff2730dda
733876ba-e574-46f7-87fd-327545c0c8af	2edcae65-d74a-4e23-9614-6dfc102f66ec
733876ba-e574-46f7-87fd-327545c0c8af	14dccbf7-3069-42c7-9928-007cedb93fe9
733876ba-e574-46f7-87fd-327545c0c8af	2a3c79ad-7ee7-46e5-b78c-1e8a9616be51
733876ba-e574-46f7-87fd-327545c0c8af	1e4e1ff0-a626-4582-a3b3-e96ef8b35366
733876ba-e574-46f7-87fd-327545c0c8af	a309006c-dfbf-4620-93d4-038d86c756b3
733876ba-e574-46f7-87fd-327545c0c8af	8c47362f-1069-4222-94d2-3ea4ad13c0e0
733876ba-e574-46f7-87fd-327545c0c8af	e0322823-d2b0-48ea-b17e-320b55856e49
733876ba-e574-46f7-87fd-327545c0c8af	403e9754-c7be-4696-b4a0-673c9a6796ca
733876ba-e574-46f7-87fd-327545c0c8af	e8d111f3-1606-40a4-af9b-f69d17014b5b
733876ba-e574-46f7-87fd-327545c0c8af	94a97a21-bdfb-4d7a-9459-efdc22582938
733876ba-e574-46f7-87fd-327545c0c8af	5daee4ac-bfcb-4527-8f70-249f29b6378c
733876ba-e574-46f7-87fd-327545c0c8af	72480f23-8d49-44f1-80d5-ee31d86af7d2
733876ba-e574-46f7-87fd-327545c0c8af	74f730e5-f063-4c4c-837e-2d661b299cc4
733876ba-e574-46f7-87fd-327545c0c8af	51ca55a1-d265-4820-9fcf-b4e6c56fe241
733876ba-e574-46f7-87fd-327545c0c8af	a899f9ca-b5a6-4d54-bf57-eb7d8e92cf16
733876ba-e574-46f7-87fd-327545c0c8af	b5848a29-6392-400f-9d75-0a3528c78064
21d28e02-ee8a-456a-8c61-97ccdb346daa	df8bb125-b215-4ae4-8e31-4169b0243445
21d28e02-ee8a-456a-8c61-97ccdb346daa	39e4f14d-81c1-4a87-9b0a-58a36471b2a2
21d28e02-ee8a-456a-8c61-97ccdb346daa	ec0a26df-bb28-4622-a6fe-ecc6ddfae675
21d28e02-ee8a-456a-8c61-97ccdb346daa	6f48958b-3856-40bb-a231-31a8ad028001
21d28e02-ee8a-456a-8c61-97ccdb346daa	33e5d214-6bb1-4b3f-bc33-50775f63686d
21d28e02-ee8a-456a-8c61-97ccdb346daa	14dccbf7-3069-42c7-9928-007cedb93fe9
21d28e02-ee8a-456a-8c61-97ccdb346daa	a309006c-dfbf-4620-93d4-038d86c756b3
21d28e02-ee8a-456a-8c61-97ccdb346daa	8c47362f-1069-4222-94d2-3ea4ad13c0e0
21d28e02-ee8a-456a-8c61-97ccdb346daa	e0322823-d2b0-48ea-b17e-320b55856e49
21d28e02-ee8a-456a-8c61-97ccdb346daa	403e9754-c7be-4696-b4a0-673c9a6796ca
21d28e02-ee8a-456a-8c61-97ccdb346daa	94a97a21-bdfb-4d7a-9459-efdc22582938
21d28e02-ee8a-456a-8c61-97ccdb346daa	5daee4ac-bfcb-4527-8f70-249f29b6378c
21d28e02-ee8a-456a-8c61-97ccdb346daa	51ca55a1-d265-4820-9fcf-b4e6c56fe241
42710b15-7dbe-43ca-9302-d952ae89546c	df8bb125-b215-4ae4-8e31-4169b0243445
42710b15-7dbe-43ca-9302-d952ae89546c	ec0a26df-bb28-4622-a6fe-ecc6ddfae675
42710b15-7dbe-43ca-9302-d952ae89546c	a309006c-dfbf-4620-93d4-038d86c756b3
42710b15-7dbe-43ca-9302-d952ae89546c	8c47362f-1069-4222-94d2-3ea4ad13c0e0
42710b15-7dbe-43ca-9302-d952ae89546c	94a97a21-bdfb-4d7a-9459-efdc22582938
0a518c8e-fec0-41e4-90c4-15af2237c410	3a44867a-9be6-471c-890a-44acfd4ee70d
0a518c8e-fec0-41e4-90c4-15af2237c410	df8bb125-b215-4ae4-8e31-4169b0243445
0a518c8e-fec0-41e4-90c4-15af2237c410	39e4f14d-81c1-4a87-9b0a-58a36471b2a2
0a518c8e-fec0-41e4-90c4-15af2237c410	ec0a26df-bb28-4622-a6fe-ecc6ddfae675
0a518c8e-fec0-41e4-90c4-15af2237c410	c6446f47-18c1-42fc-8f32-ddbb5d1b33df
0a518c8e-fec0-41e4-90c4-15af2237c410	6f48958b-3856-40bb-a231-31a8ad028001
0a518c8e-fec0-41e4-90c4-15af2237c410	880ae36c-c87e-4fe0-a03a-e2ef05493252
0a518c8e-fec0-41e4-90c4-15af2237c410	5e88d310-32b5-4aba-af34-47366d329750
0a518c8e-fec0-41e4-90c4-15af2237c410	33e5d214-6bb1-4b3f-bc33-50775f63686d
0a518c8e-fec0-41e4-90c4-15af2237c410	14dccbf7-3069-42c7-9928-007cedb93fe9
0a518c8e-fec0-41e4-90c4-15af2237c410	2a3c79ad-7ee7-46e5-b78c-1e8a9616be51
d8e12134-bfe1-4053-ae2e-45f262b23db1	df8bb125-b215-4ae4-8e31-4169b0243445
d8e12134-bfe1-4053-ae2e-45f262b23db1	33e5d214-6bb1-4b3f-bc33-50775f63686d
d8e12134-bfe1-4053-ae2e-45f262b23db1	8c47362f-1069-4222-94d2-3ea4ad13c0e0
d8e12134-bfe1-4053-ae2e-45f262b23db1	51ca55a1-d265-4820-9fcf-b4e6c56fe241
b86bd6d9-df19-4e7b-aa0a-4964eb64fc50	df8bb125-b215-4ae4-8e31-4169b0243445
b86bd6d9-df19-4e7b-aa0a-4964eb64fc50	a309006c-dfbf-4620-93d4-038d86c756b3
b86bd6d9-df19-4e7b-aa0a-4964eb64fc50	8c47362f-1069-4222-94d2-3ea4ad13c0e0
81cf1982-4c57-43b7-bdc5-945f096e2305	df8bb125-b215-4ae4-8e31-4169b0243445
81cf1982-4c57-43b7-bdc5-945f096e2305	8c47362f-1069-4222-94d2-3ea4ad13c0e0
dfd05f76-27b9-4283-8877-aa37da479ad0	3a44867a-9be6-471c-890a-44acfd4ee70d
dfd05f76-27b9-4283-8877-aa37da479ad0	df8bb125-b215-4ae4-8e31-4169b0243445
dfd05f76-27b9-4283-8877-aa37da479ad0	39e4f14d-81c1-4a87-9b0a-58a36471b2a2
dfd05f76-27b9-4283-8877-aa37da479ad0	5e88d310-32b5-4aba-af34-47366d329750
dfd05f76-27b9-4283-8877-aa37da479ad0	33e5d214-6bb1-4b3f-bc33-50775f63686d
62d0e1ef-35d5-4857-86f6-c6bf50fb0e49	e8d111f3-1606-40a4-af9b-f69d17014b5b
62d0e1ef-35d5-4857-86f6-c6bf50fb0e49	94a97a21-bdfb-4d7a-9459-efdc22582938
62d0e1ef-35d5-4857-86f6-c6bf50fb0e49	5daee4ac-bfcb-4527-8f70-249f29b6378c
3a647229-d593-4bfb-a816-7a4cce2433ec	3a44867a-9be6-471c-890a-44acfd4ee70d
3a647229-d593-4bfb-a816-7a4cce2433ec	df8bb125-b215-4ae4-8e31-4169b0243445
3a647229-d593-4bfb-a816-7a4cce2433ec	39e4f14d-81c1-4a87-9b0a-58a36471b2a2
3a647229-d593-4bfb-a816-7a4cce2433ec	c9b22f55-a86d-40c6-bec9-0ed3c5ba8426
3a647229-d593-4bfb-a816-7a4cce2433ec	29207157-4c63-4db7-8016-17bb497093e8
3a647229-d593-4bfb-a816-7a4cce2433ec	ec0a26df-bb28-4622-a6fe-ecc6ddfae675
3a647229-d593-4bfb-a816-7a4cce2433ec	6339fcb1-f627-4e0a-8307-3aac126233db
3a647229-d593-4bfb-a816-7a4cce2433ec	c31a9c9e-b52e-49bf-ba92-e61336f1f6d5
3a647229-d593-4bfb-a816-7a4cce2433ec	c6446f47-18c1-42fc-8f32-ddbb5d1b33df
3a647229-d593-4bfb-a816-7a4cce2433ec	6f48958b-3856-40bb-a231-31a8ad028001
3a647229-d593-4bfb-a816-7a4cce2433ec	880ae36c-c87e-4fe0-a03a-e2ef05493252
3a647229-d593-4bfb-a816-7a4cce2433ec	04803d18-9235-453a-8e24-bce45022fdd8
3a647229-d593-4bfb-a816-7a4cce2433ec	5e88d310-32b5-4aba-af34-47366d329750
3a647229-d593-4bfb-a816-7a4cce2433ec	33e5d214-6bb1-4b3f-bc33-50775f63686d
3a647229-d593-4bfb-a816-7a4cce2433ec	1b0a8be7-14de-4fc8-9abd-1cf26c0d5142
3a647229-d593-4bfb-a816-7a4cce2433ec	ed220083-dfc8-43db-84e0-dccff2730dda
3a647229-d593-4bfb-a816-7a4cce2433ec	2edcae65-d74a-4e23-9614-6dfc102f66ec
3a647229-d593-4bfb-a816-7a4cce2433ec	14dccbf7-3069-42c7-9928-007cedb93fe9
3a647229-d593-4bfb-a816-7a4cce2433ec	2a3c79ad-7ee7-46e5-b78c-1e8a9616be51
3a647229-d593-4bfb-a816-7a4cce2433ec	1e4e1ff0-a626-4582-a3b3-e96ef8b35366
3a647229-d593-4bfb-a816-7a4cce2433ec	a309006c-dfbf-4620-93d4-038d86c756b3
3a647229-d593-4bfb-a816-7a4cce2433ec	8c47362f-1069-4222-94d2-3ea4ad13c0e0
3a647229-d593-4bfb-a816-7a4cce2433ec	e0322823-d2b0-48ea-b17e-320b55856e49
3a647229-d593-4bfb-a816-7a4cce2433ec	403e9754-c7be-4696-b4a0-673c9a6796ca
3a647229-d593-4bfb-a816-7a4cce2433ec	e8d111f3-1606-40a4-af9b-f69d17014b5b
3a647229-d593-4bfb-a816-7a4cce2433ec	94a97a21-bdfb-4d7a-9459-efdc22582938
3a647229-d593-4bfb-a816-7a4cce2433ec	5daee4ac-bfcb-4527-8f70-249f29b6378c
3a647229-d593-4bfb-a816-7a4cce2433ec	72480f23-8d49-44f1-80d5-ee31d86af7d2
3a647229-d593-4bfb-a816-7a4cce2433ec	74f730e5-f063-4c4c-837e-2d661b299cc4
3a647229-d593-4bfb-a816-7a4cce2433ec	51ca55a1-d265-4820-9fcf-b4e6c56fe241
3a647229-d593-4bfb-a816-7a4cce2433ec	a899f9ca-b5a6-4d54-bf57-eb7d8e92cf16
3a647229-d593-4bfb-a816-7a4cce2433ec	b5848a29-6392-400f-9d75-0a3528c78064
e6652bde-a02e-401a-98fe-2edd3612c63c	ec0a26df-bb28-4622-a6fe-ecc6ddfae675
0723d733-7286-4d82-8da2-83ec2ff6e0c3	51ca55a1-d265-4820-9fcf-b4e6c56fe241
0723d733-7286-4d82-8da2-83ec2ff6e0c3	33e5d214-6bb1-4b3f-bc33-50775f63686d
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: quimicorp
--

COPY public.roles (id, nombre, "createdAt", "updatedAt") FROM stdin;
7926b010-1131-4f5b-94df-a961a1f3c4fb	GERENCIA	2026-09-02 14:02:10.486	2026-09-02 14:02:10.486
21d28e02-ee8a-456a-8c61-97ccdb346daa	ADMINISTRACION	2026-09-02 14:02:10.489	2026-09-02 14:02:10.489
733876ba-e574-46f7-87fd-327545c0c8af	GERENTE_ADMINISTRATIVO	2026-09-02 14:02:10.491	2026-09-02 14:02:10.491
42710b15-7dbe-43ca-9302-d952ae89546c	ASISTENTE_ADMINISTRATIVO	2026-09-02 14:02:10.493	2026-09-02 14:02:10.493
d8e12134-bfe1-4053-ae2e-45f262b23db1	FINANZAS	2026-09-02 14:02:10.495	2026-09-02 14:02:10.495
b86bd6d9-df19-4e7b-aa0a-4964eb64fc50	VENTAS_ATENCION_DIGITAL	2026-09-02 14:02:10.497	2026-09-02 14:02:10.497
81cf1982-4c57-43b7-bdc5-945f096e2305	ECOMMERCE_MARKETING	2026-09-02 14:02:10.499	2026-09-02 14:02:10.499
0a518c8e-fec0-41e4-90c4-15af2237c410	PRODUCCION_ALMACEN	2026-09-02 14:02:10.5	2026-09-02 14:02:10.5
dfd05f76-27b9-4283-8877-aa37da479ad0	COMPRAS_PROVEEDORES	2026-09-02 14:02:10.502	2026-09-02 14:02:10.502
62d0e1ef-35d5-4857-86f6-c6bf50fb0e49	RECURSOS_HUMANOS	2026-09-02 14:02:10.504	2026-09-02 14:02:10.504
3a647229-d593-4bfb-a816-7a4cce2433ec	SISTEMAS_TI	2026-09-02 14:02:10.506	2026-09-02 14:02:10.506
e6652bde-a02e-401a-98fe-2edd3612c63c	DISENO_MULTIMEDIA	2026-09-02 14:02:10.508	2026-09-02 14:02:10.508
0723d733-7286-4d82-8da2-83ec2ff6e0c3	ARCHIVO_HISTORICO	2026-09-02 14:02:10.51	2026-09-02 14:02:10.51
\.


--
-- Data for Name: solicitudes_autorizacion; Type: TABLE DATA; Schema: public; Owner: quimicorp
--

COPY public.solicitudes_autorizacion (id, solicitante_id, solicitante_email, solicitante_nombre, modulo, accion, recurso_id, recurso_nombre, motivo, estado, aprobador_email, respuesta_motivo, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: sub_almacen_sobrantes; Type: TABLE DATA; Schema: public; Owner: quimicorp
--

COPY public.sub_almacen_sobrantes (id, "loteOrigenId", "insumoSubproductoId", "pesoDisponible", ubicacion, estado, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: sucursales; Type: TABLE DATA; Schema: public; Owner: quimicorp
--

COPY public.sucursales (id, nombre, direccion, dispositivo_id, ip, port, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: tickets_despacho; Type: TABLE DATA; Schema: public; Owner: quimicorp
--

COPY public.tickets_despacho (id, "codigoTicket", "ordenProduccionId", "clienteDestino", "cantidadCajas", "estadoDespacho", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: turnos; Type: TABLE DATA; Schema: public; Owner: quimicorp
--

COPY public.turnos (id, nombre, hora_inicio, hora_fin, tolerancia_minutos, almuerzo_tope, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: quimicorp
--

COPY public.users (id, email, nombre, password, role, "rolId", active, "createdAt", "updatedAt") FROM stdin;
d5cef80f-62b2-4c8c-9412-a91028131a3b	administracion@grupoquimicorp.pe	Elvis Edwin Yarleque Arrunategui	$2b$10$TGbT08L0snOBamxM4nZyyudMmdHDIGAyj9c6TSRoMDzhSpqxuWnoK	GERENTE_ADMINISTRATIVO	733876ba-e574-46f7-87fd-327545c0c8af	t	2026-09-02 14:02:11.14	2026-09-04 18:04:04.265
bfb51949-8536-4878-936d-9c34ad87f663	asistentedeadministracion@grupoquimicorp.pe	Mishelle Barrera Quispe	$2b$10$66UPthMgJfMBCSU7QY1gxuouVUL.P9l7zCTaSzQVTT8Eeqn8n0Tq2	ASISTENTE_ADMINISTRATIVO	42710b15-7dbe-43ca-9302-d952ae89546c	t	2026-09-02 14:02:11.228	2026-09-04 18:04:04.337
1e2dba26-8683-4cdb-940f-83d94d467758	produccion@grupoquimicorp.pe	Supervisor de Producción	$2b$10$hgy3eTllNnJ3Djv3odJ7o.9AGrb7BiAMghFuyDHlWcomDFacYAZAm	PRODUCCION_ALMACEN	0a518c8e-fec0-41e4-90c4-15af2237c410	t	2026-09-02 14:02:11.314	2026-09-04 18:04:04.422
24076757-4260-4fa3-82a3-d4ad11694f84	gerencia@quimicorp.pe	Carlos Mendoza (Gerente General)	$2b$10$WFvjxJ6R.psC/fVNIJIttOgDdTUwr2uwCZ9YpjrfcxLgo45cQQHfW	GERENCIA	7926b010-1131-4f5b-94df-a961a1f3c4fb	t	2026-09-02 14:02:11.407	2026-09-04 18:04:04.497
7720cf48-0b1a-4760-b6ad-97cfb178415c	administracion@quimicorp.pe	Ana Torres (Admin)	$2b$10$ZjwEUpjBpmzkXjXur/fIM.k3NhsUEDYPzQH8PaZcXlmcw7qA0FIQK	GERENTE_ADMINISTRATIVO	733876ba-e574-46f7-87fd-327545c0c8af	t	2026-09-02 14:02:11.499	2026-09-04 18:04:04.572
25308d12-ee38-4e91-8053-0f55e3475c04	finanzas@quimicorp.pe	Roberto Silva (Finanzas)	$2b$10$buF3ifGbAdw1Ivdm5pllk.i6fu7kWAkTiQq3Y.sbPN2.oST3u.Dje	FINANZAS	d8e12134-bfe1-4053-ae2e-45f262b23db1	t	2026-09-02 14:02:11.585	2026-09-04 18:04:04.641
4624ae43-6f28-44ce-bdee-04ef30c01446	ventas@quimicorp.pe	Elena Gómez (Ventas)	$2b$10$3VIKPCOAoZdM6PHwNHn8TOTDph9vknfUs58Fbc4g.dxw4/RWsB.Ca	VENTAS_ATENCION_DIGITAL	b86bd6d9-df19-4e7b-aa0a-4964eb64fc50	t	2026-09-02 14:02:11.675	2026-09-04 18:04:04.713
7b415210-c6d5-4e9d-94de-94178f63f545	compras@quimicorp.pe	Laura Paredes (Compras)	$2b$10$cqR5cVjuvi21Q4/S4ljdO.hT6/FdRreh0RLM0yKEsiT5m6E7olK9e	COMPRAS_PROVEEDORES	dfd05f76-27b9-4283-8877-aa37da479ad0	t	2026-09-02 14:02:11.761	2026-09-04 18:04:04.794
\.


--
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: quimicorp
--

COPY public.usuarios (id, dni, nombres, apellidos, "rolId", "passwordHash", "codigoBiometrico", estado, "createdAt", "updatedAt", cargo, sucursal_id, turno_id) FROM stdin;
\.


--
-- Data for Name: valorizacion_inventario; Type: TABLE DATA; Schema: public; Owner: quimicorp
--

COPY public.valorizacion_inventario (id, "fechaCierre", "materiaPrimaValorizada", "productoTerminadoValorizado", "createdAt") FROM stdin;
\.


--
-- Data for Name: ventanas_almuerzo_qa; Type: TABLE DATA; Schema: public; Owner: quimicorp
--

COPY public.ventanas_almuerzo_qa (id, fecha, "horaInicioAprobada", "horaFinMinima", "aprobadoPorQAId", "operariosHabilitadosIds", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: quimicorp
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: ajustes_finos ajustes_finos_pkey; Type: CONSTRAINT; Schema: public; Owner: quimicorp
--

ALTER TABLE ONLY public.ajustes_finos
    ADD CONSTRAINT ajustes_finos_pkey PRIMARY KEY (id);


--
-- Name: asistencias asistencias_pkey; Type: CONSTRAINT; Schema: public; Owner: quimicorp
--

ALTER TABLE ONLY public.asistencias
    ADD CONSTRAINT asistencias_pkey PRIMARY KEY (id);


--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: quimicorp
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- Name: calificaciones_operario calificaciones_operario_pkey; Type: CONSTRAINT; Schema: public; Owner: quimicorp
--

ALTER TABLE ONLY public.calificaciones_operario
    ADD CONSTRAINT calificaciones_operario_pkey PRIMARY KEY (id);


--
-- Name: clientes clientes_pkey; Type: CONSTRAINT; Schema: public; Owner: quimicorp
--

ALTER TABLE ONLY public.clientes
    ADD CONSTRAINT clientes_pkey PRIMARY KEY (id);


--
-- Name: cola_despacho cola_despacho_pkey; Type: CONSTRAINT; Schema: public; Owner: quimicorp
--

ALTER TABLE ONLY public.cola_despacho
    ADD CONSTRAINT cola_despacho_pkey PRIMARY KEY (id);


--
-- Name: contacto_representantes contacto_representantes_pkey; Type: CONSTRAINT; Schema: public; Owner: quimicorp
--

ALTER TABLE ONLY public.contacto_representantes
    ADD CONSTRAINT contacto_representantes_pkey PRIMARY KEY (id);


--
-- Name: cotizaciones_proveedores cotizaciones_proveedores_pkey; Type: CONSTRAINT; Schema: public; Owner: quimicorp
--

ALTER TABLE ONLY public.cotizaciones_proveedores
    ADD CONSTRAINT cotizaciones_proveedores_pkey PRIMARY KEY (id);


--
-- Name: cuentas_bancarias_proveedores cuentas_bancarias_proveedores_pkey; Type: CONSTRAINT; Schema: public; Owner: quimicorp
--

ALTER TABLE ONLY public.cuentas_bancarias_proveedores
    ADD CONSTRAINT cuentas_bancarias_proveedores_pkey PRIMARY KEY (id);


--
-- Name: cuentas_cobrar cuentas_cobrar_pkey; Type: CONSTRAINT; Schema: public; Owner: quimicorp
--

ALTER TABLE ONLY public.cuentas_cobrar
    ADD CONSTRAINT cuentas_cobrar_pkey PRIMARY KEY (id);


--
-- Name: etiquetas_impresas etiquetas_impresas_pkey; Type: CONSTRAINT; Schema: public; Owner: quimicorp
--

ALTER TABLE ONLY public.etiquetas_impresas
    ADD CONSTRAINT etiquetas_impresas_pkey PRIMARY KEY (id);


--
-- Name: familias_insumo familias_insumo_pkey; Type: CONSTRAINT; Schema: public; Owner: quimicorp
--

ALTER TABLE ONLY public.familias_insumo
    ADD CONSTRAINT familias_insumo_pkey PRIMARY KEY (id);


--
-- Name: formula_detalles formula_detalles_pkey; Type: CONSTRAINT; Schema: public; Owner: quimicorp
--

ALTER TABLE ONLY public.formula_detalles
    ADD CONSTRAINT formula_detalles_pkey PRIMARY KEY (id);


--
-- Name: formula_variants formula_variants_pkey; Type: CONSTRAINT; Schema: public; Owner: quimicorp
--

ALTER TABLE ONLY public.formula_variants
    ADD CONSTRAINT formula_variants_pkey PRIMARY KEY (id);


--
-- Name: formulas_master formulas_master_pkey; Type: CONSTRAINT; Schema: public; Owner: quimicorp
--

ALTER TABLE ONLY public.formulas_master
    ADD CONSTRAINT formulas_master_pkey PRIMARY KEY (id);


--
-- Name: incidencias_lote incidencias_lote_pkey; Type: CONSTRAINT; Schema: public; Owner: quimicorp
--

ALTER TABLE ONLY public.incidencias_lote
    ADD CONSTRAINT incidencias_lote_pkey PRIMARY KEY (id);


--
-- Name: insumos insumos_pkey; Type: CONSTRAINT; Schema: public; Owner: quimicorp
--

ALTER TABLE ONLY public.insumos
    ADD CONSTRAINT insumos_pkey PRIMARY KEY (id);


--
-- Name: kardex_inmutable kardex_inmutable_pkey; Type: CONSTRAINT; Schema: public; Owner: quimicorp
--

ALTER TABLE ONLY public.kardex_inmutable
    ADD CONSTRAINT kardex_inmutable_pkey PRIMARY KEY (id);


--
-- Name: kardex_movimientos kardex_movimientos_pkey; Type: CONSTRAINT; Schema: public; Owner: quimicorp
--

ALTER TABLE ONLY public.kardex_movimientos
    ADD CONSTRAINT kardex_movimientos_pkey PRIMARY KEY (id);


--
-- Name: marcaciones_biometrico marcaciones_biometrico_pkey; Type: CONSTRAINT; Schema: public; Owner: quimicorp
--

ALTER TABLE ONLY public.marcaciones_biometrico
    ADD CONSTRAINT marcaciones_biometrico_pkey PRIMARY KEY (id);


--
-- Name: marcaciones_pendientes marcaciones_pendientes_pkey; Type: CONSTRAINT; Schema: public; Owner: quimicorp
--

ALTER TABLE ONLY public.marcaciones_pendientes
    ADD CONSTRAINT marcaciones_pendientes_pkey PRIMARY KEY (id);


--
-- Name: metricas_produccion_diaria metricas_produccion_diaria_pkey; Type: CONSTRAINT; Schema: public; Owner: quimicorp
--

ALTER TABLE ONLY public.metricas_produccion_diaria
    ADD CONSTRAINT metricas_produccion_diaria_pkey PRIMARY KEY (id);


--
-- Name: ordenes_produccion ordenes_produccion_pkey; Type: CONSTRAINT; Schema: public; Owner: quimicorp
--

ALTER TABLE ONLY public.ordenes_produccion
    ADD CONSTRAINT ordenes_produccion_pkey PRIMARY KEY (id);


--
-- Name: pagos_abonos pagos_abonos_pkey; Type: CONSTRAINT; Schema: public; Owner: quimicorp
--

ALTER TABLE ONLY public.pagos_abonos
    ADD CONSTRAINT pagos_abonos_pkey PRIMARY KEY (id);


--
-- Name: pedido_aditivos pedido_aditivos_pkey; Type: CONSTRAINT; Schema: public; Owner: quimicorp
--

ALTER TABLE ONLY public.pedido_aditivos
    ADD CONSTRAINT pedido_aditivos_pkey PRIMARY KEY (id);


--
-- Name: pedidos_comerciales pedidos_comerciales_pkey; Type: CONSTRAINT; Schema: public; Owner: quimicorp
--

ALTER TABLE ONLY public.pedidos_comerciales
    ADD CONSTRAINT pedidos_comerciales_pkey PRIMARY KEY (id);


--
-- Name: permisos permisos_pkey; Type: CONSTRAINT; Schema: public; Owner: quimicorp
--

ALTER TABLE ONLY public.permisos
    ADD CONSTRAINT permisos_pkey PRIMARY KEY (id);


--
-- Name: proveedores proveedores_pkey; Type: CONSTRAINT; Schema: public; Owner: quimicorp
--

ALTER TABLE ONLY public.proveedores
    ADD CONSTRAINT proveedores_pkey PRIMARY KEY (id);


--
-- Name: rol_permisos rol_permisos_pkey; Type: CONSTRAINT; Schema: public; Owner: quimicorp
--

ALTER TABLE ONLY public.rol_permisos
    ADD CONSTRAINT rol_permisos_pkey PRIMARY KEY ("rolId", "permisoId");


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: quimicorp
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: solicitudes_autorizacion solicitudes_autorizacion_pkey; Type: CONSTRAINT; Schema: public; Owner: quimicorp
--

ALTER TABLE ONLY public.solicitudes_autorizacion
    ADD CONSTRAINT solicitudes_autorizacion_pkey PRIMARY KEY (id);


--
-- Name: sub_almacen_sobrantes sub_almacen_sobrantes_pkey; Type: CONSTRAINT; Schema: public; Owner: quimicorp
--

ALTER TABLE ONLY public.sub_almacen_sobrantes
    ADD CONSTRAINT sub_almacen_sobrantes_pkey PRIMARY KEY (id);


--
-- Name: sucursales sucursales_pkey; Type: CONSTRAINT; Schema: public; Owner: quimicorp
--

ALTER TABLE ONLY public.sucursales
    ADD CONSTRAINT sucursales_pkey PRIMARY KEY (id);


--
-- Name: tickets_despacho tickets_despacho_pkey; Type: CONSTRAINT; Schema: public; Owner: quimicorp
--

ALTER TABLE ONLY public.tickets_despacho
    ADD CONSTRAINT tickets_despacho_pkey PRIMARY KEY (id);


--
-- Name: turnos turnos_pkey; Type: CONSTRAINT; Schema: public; Owner: quimicorp
--

ALTER TABLE ONLY public.turnos
    ADD CONSTRAINT turnos_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: quimicorp
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: quimicorp
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- Name: valorizacion_inventario valorizacion_inventario_pkey; Type: CONSTRAINT; Schema: public; Owner: quimicorp
--

ALTER TABLE ONLY public.valorizacion_inventario
    ADD CONSTRAINT valorizacion_inventario_pkey PRIMARY KEY (id);


--
-- Name: ventanas_almuerzo_qa ventanas_almuerzo_qa_pkey; Type: CONSTRAINT; Schema: public; Owner: quimicorp
--

ALTER TABLE ONLY public.ventanas_almuerzo_qa
    ADD CONSTRAINT ventanas_almuerzo_qa_pkey PRIMARY KEY (id);


--
-- Name: ajustes_finos_ordenProduccionId_idx; Type: INDEX; Schema: public; Owner: quimicorp
--

CREATE INDEX "ajustes_finos_ordenProduccionId_idx" ON public.ajustes_finos USING btree ("ordenProduccionId");


--
-- Name: asistencias_fecha_idx; Type: INDEX; Schema: public; Owner: quimicorp
--

CREATE INDEX asistencias_fecha_idx ON public.asistencias USING btree (fecha);


--
-- Name: asistencias_turno_id_idx; Type: INDEX; Schema: public; Owner: quimicorp
--

CREATE INDEX asistencias_turno_id_idx ON public.asistencias USING btree (turno_id);


--
-- Name: asistencias_usuarioId_fecha_key; Type: INDEX; Schema: public; Owner: quimicorp
--

CREATE UNIQUE INDEX "asistencias_usuarioId_fecha_key" ON public.asistencias USING btree ("usuarioId", fecha);


--
-- Name: audit_logs_tablaAfectada_registroId_idx; Type: INDEX; Schema: public; Owner: quimicorp
--

CREATE INDEX "audit_logs_tablaAfectada_registroId_idx" ON public.audit_logs USING btree ("tablaAfectada", "registroId");


--
-- Name: audit_logs_usuarioId_idx; Type: INDEX; Schema: public; Owner: quimicorp
--

CREATE INDEX "audit_logs_usuarioId_idx" ON public.audit_logs USING btree ("usuarioId");


--
-- Name: clientes_ruc_idx; Type: INDEX; Schema: public; Owner: quimicorp
--

CREATE INDEX clientes_ruc_idx ON public.clientes USING btree (ruc);


--
-- Name: clientes_ruc_key; Type: INDEX; Schema: public; Owner: quimicorp
--

CREATE UNIQUE INDEX clientes_ruc_key ON public.clientes USING btree (ruc);


--
-- Name: cola_despacho_estado_idx; Type: INDEX; Schema: public; Owner: quimicorp
--

CREATE INDEX cola_despacho_estado_idx ON public.cola_despacho USING btree (estado);


--
-- Name: cola_despacho_lote_codigo_idx; Type: INDEX; Schema: public; Owner: quimicorp
--

CREATE INDEX cola_despacho_lote_codigo_idx ON public.cola_despacho USING btree (lote_codigo);


--
-- Name: contacto_representantes_cliente_id_idx; Type: INDEX; Schema: public; Owner: quimicorp
--

CREATE INDEX contacto_representantes_cliente_id_idx ON public.contacto_representantes USING btree (cliente_id);


--
-- Name: cotizaciones_proveedores_fecha_cotizacion_idx; Type: INDEX; Schema: public; Owner: quimicorp
--

CREATE INDEX cotizaciones_proveedores_fecha_cotizacion_idx ON public.cotizaciones_proveedores USING btree (fecha_cotizacion);


--
-- Name: cotizaciones_proveedores_insumo_id_idx; Type: INDEX; Schema: public; Owner: quimicorp
--

CREATE INDEX cotizaciones_proveedores_insumo_id_idx ON public.cotizaciones_proveedores USING btree (insumo_id);


--
-- Name: cotizaciones_proveedores_proveedor_id_idx; Type: INDEX; Schema: public; Owner: quimicorp
--

CREATE INDEX cotizaciones_proveedores_proveedor_id_idx ON public.cotizaciones_proveedores USING btree (proveedor_id);


--
-- Name: cuentas_bancarias_proveedores_proveedor_id_idx; Type: INDEX; Schema: public; Owner: quimicorp
--

CREATE INDEX cuentas_bancarias_proveedores_proveedor_id_idx ON public.cuentas_bancarias_proveedores USING btree (proveedor_id);


--
-- Name: cuentas_cobrar_cliente_ruc_idx; Type: INDEX; Schema: public; Owner: quimicorp
--

CREATE INDEX cuentas_cobrar_cliente_ruc_idx ON public.cuentas_cobrar USING btree (cliente_ruc);


--
-- Name: cuentas_cobrar_codigo_doc_key; Type: INDEX; Schema: public; Owner: quimicorp
--

CREATE UNIQUE INDEX cuentas_cobrar_codigo_doc_key ON public.cuentas_cobrar USING btree (codigo_doc);


--
-- Name: cuentas_cobrar_estado_idx; Type: INDEX; Schema: public; Owner: quimicorp
--

CREATE INDEX cuentas_cobrar_estado_idx ON public.cuentas_cobrar USING btree (estado);


--
-- Name: cuentas_cobrar_fecha_vencimiento_idx; Type: INDEX; Schema: public; Owner: quimicorp
--

CREATE INDEX cuentas_cobrar_fecha_vencimiento_idx ON public.cuentas_cobrar USING btree (fecha_vencimiento);


--
-- Name: etiquetas_impresas_codigoEtiqueta_key; Type: INDEX; Schema: public; Owner: quimicorp
--

CREATE UNIQUE INDEX "etiquetas_impresas_codigoEtiqueta_key" ON public.etiquetas_impresas USING btree ("codigoEtiqueta");


--
-- Name: etiquetas_impresas_loteProduccionId_idx; Type: INDEX; Schema: public; Owner: quimicorp
--

CREATE INDEX "etiquetas_impresas_loteProduccionId_idx" ON public.etiquetas_impresas USING btree ("loteProduccionId");


--
-- Name: familias_insumo_nombre_key; Type: INDEX; Schema: public; Owner: quimicorp
--

CREATE UNIQUE INDEX familias_insumo_nombre_key ON public.familias_insumo USING btree (nombre);


--
-- Name: formula_detalles_formulaId_idx; Type: INDEX; Schema: public; Owner: quimicorp
--

CREATE INDEX "formula_detalles_formulaId_idx" ON public.formula_detalles USING btree ("formulaId");


--
-- Name: formula_detalles_insumoId_idx; Type: INDEX; Schema: public; Owner: quimicorp
--

CREATE INDEX "formula_detalles_insumoId_idx" ON public.formula_detalles USING btree ("insumoId");


--
-- Name: formula_variants_cliente_id_idx; Type: INDEX; Schema: public; Owner: quimicorp
--

CREATE INDEX formula_variants_cliente_id_idx ON public.formula_variants USING btree (cliente_id);


--
-- Name: formula_variants_formula_id_idx; Type: INDEX; Schema: public; Owner: quimicorp
--

CREATE INDEX formula_variants_formula_id_idx ON public.formula_variants USING btree (formula_id);


--
-- Name: formulas_master_codigoFormula_key; Type: INDEX; Schema: public; Owner: quimicorp
--

CREATE UNIQUE INDEX "formulas_master_codigoFormula_key" ON public.formulas_master USING btree ("codigoFormula");


--
-- Name: formulas_master_estado_idx; Type: INDEX; Schema: public; Owner: quimicorp
--

CREATE INDEX formulas_master_estado_idx ON public.formulas_master USING btree (estado);


--
-- Name: insumos_codigo_key; Type: INDEX; Schema: public; Owner: quimicorp
--

CREATE UNIQUE INDEX insumos_codigo_key ON public.insumos USING btree (codigo);


--
-- Name: insumos_estado_idx; Type: INDEX; Schema: public; Owner: quimicorp
--

CREATE INDEX insumos_estado_idx ON public.insumos USING btree (estado);


--
-- Name: insumos_familiaId_idx; Type: INDEX; Schema: public; Owner: quimicorp
--

CREATE INDEX "insumos_familiaId_idx" ON public.insumos USING btree ("familiaId");


--
-- Name: insumos_tipo_idx; Type: INDEX; Schema: public; Owner: quimicorp
--

CREATE INDEX insumos_tipo_idx ON public.insumos USING btree (tipo);


--
-- Name: kardex_inmutable_createdAt_idx; Type: INDEX; Schema: public; Owner: quimicorp
--

CREATE INDEX "kardex_inmutable_createdAt_idx" ON public.kardex_inmutable USING btree ("createdAt");


--
-- Name: kardex_inmutable_insumoId_idx; Type: INDEX; Schema: public; Owner: quimicorp
--

CREATE INDEX "kardex_inmutable_insumoId_idx" ON public.kardex_inmutable USING btree ("insumoId");


--
-- Name: kardex_inmutable_tipoMovimiento_idx; Type: INDEX; Schema: public; Owner: quimicorp
--

CREATE INDEX "kardex_inmutable_tipoMovimiento_idx" ON public.kardex_inmutable USING btree ("tipoMovimiento");


--
-- Name: kardex_movimientos_categoria_kardex_idx; Type: INDEX; Schema: public; Owner: quimicorp
--

CREATE INDEX kardex_movimientos_categoria_kardex_idx ON public.kardex_movimientos USING btree (categoria_kardex);


--
-- Name: kardex_movimientos_fecha_idx; Type: INDEX; Schema: public; Owner: quimicorp
--

CREATE INDEX kardex_movimientos_fecha_idx ON public.kardex_movimientos USING btree (fecha);


--
-- Name: kardex_movimientos_producto_nombre_idx; Type: INDEX; Schema: public; Owner: quimicorp
--

CREATE INDEX kardex_movimientos_producto_nombre_idx ON public.kardex_movimientos USING btree (producto_nombre);


--
-- Name: marcaciones_biometrico_usuarioId_timestamp_idx; Type: INDEX; Schema: public; Owner: quimicorp
--

CREATE INDEX "marcaciones_biometrico_usuarioId_timestamp_idx" ON public.marcaciones_biometrico USING btree ("usuarioId", "timestamp");


--
-- Name: marcaciones_pendientes_dispositivo_id_timestamp_idx; Type: INDEX; Schema: public; Owner: quimicorp
--

CREATE INDEX marcaciones_pendientes_dispositivo_id_timestamp_idx ON public.marcaciones_pendientes USING btree (dispositivo_id, "timestamp");


--
-- Name: marcaciones_pendientes_procesada_idx; Type: INDEX; Schema: public; Owner: quimicorp
--

CREATE INDEX marcaciones_pendientes_procesada_idx ON public.marcaciones_pendientes USING btree (procesada);


--
-- Name: metricas_produccion_diaria_fecha_key; Type: INDEX; Schema: public; Owner: quimicorp
--

CREATE UNIQUE INDEX metricas_produccion_diaria_fecha_key ON public.metricas_produccion_diaria USING btree (fecha);


--
-- Name: ordenes_produccion_codigoLote_key; Type: INDEX; Schema: public; Owner: quimicorp
--

CREATE UNIQUE INDEX "ordenes_produccion_codigoLote_key" ON public.ordenes_produccion USING btree ("codigoLote");


--
-- Name: ordenes_produccion_estado_idx; Type: INDEX; Schema: public; Owner: quimicorp
--

CREATE INDEX ordenes_produccion_estado_idx ON public.ordenes_produccion USING btree (estado);


--
-- Name: ordenes_produccion_formulaId_idx; Type: INDEX; Schema: public; Owner: quimicorp
--

CREATE INDEX "ordenes_produccion_formulaId_idx" ON public.ordenes_produccion USING btree ("formulaId");


--
-- Name: pagos_abonos_cuenta_cobrar_id_idx; Type: INDEX; Schema: public; Owner: quimicorp
--

CREATE INDEX pagos_abonos_cuenta_cobrar_id_idx ON public.pagos_abonos USING btree (cuenta_cobrar_id);


--
-- Name: pedido_aditivos_insumo_id_idx; Type: INDEX; Schema: public; Owner: quimicorp
--

CREATE INDEX pedido_aditivos_insumo_id_idx ON public.pedido_aditivos USING btree (insumo_id);


--
-- Name: pedido_aditivos_pedido_id_idx; Type: INDEX; Schema: public; Owner: quimicorp
--

CREATE INDEX pedido_aditivos_pedido_id_idx ON public.pedido_aditivos USING btree (pedido_id);


--
-- Name: pedido_aditivos_tipo_idx; Type: INDEX; Schema: public; Owner: quimicorp
--

CREATE INDEX pedido_aditivos_tipo_idx ON public.pedido_aditivos USING btree (tipo);


--
-- Name: pedidos_comerciales_cliente_ruc_idx; Type: INDEX; Schema: public; Owner: quimicorp
--

CREATE INDEX pedidos_comerciales_cliente_ruc_idx ON public.pedidos_comerciales USING btree (cliente_ruc);


--
-- Name: pedidos_comerciales_codigo_orden_key; Type: INDEX; Schema: public; Owner: quimicorp
--

CREATE UNIQUE INDEX pedidos_comerciales_codigo_orden_key ON public.pedidos_comerciales USING btree (codigo_orden);


--
-- Name: pedidos_comerciales_doc_type_idx; Type: INDEX; Schema: public; Owner: quimicorp
--

CREATE INDEX pedidos_comerciales_doc_type_idx ON public.pedidos_comerciales USING btree (doc_type);


--
-- Name: pedidos_comerciales_estado_idx; Type: INDEX; Schema: public; Owner: quimicorp
--

CREATE INDEX pedidos_comerciales_estado_idx ON public.pedidos_comerciales USING btree (estado);


--
-- Name: permisos_modulo_accion_key; Type: INDEX; Schema: public; Owner: quimicorp
--

CREATE UNIQUE INDEX permisos_modulo_accion_key ON public.permisos USING btree (modulo, accion);


--
-- Name: proveedores_ruc_key; Type: INDEX; Schema: public; Owner: quimicorp
--

CREATE UNIQUE INDEX proveedores_ruc_key ON public.proveedores USING btree (ruc);


--
-- Name: roles_nombre_key; Type: INDEX; Schema: public; Owner: quimicorp
--

CREATE UNIQUE INDEX roles_nombre_key ON public.roles USING btree (nombre);


--
-- Name: sub_almacen_sobrantes_estado_idx; Type: INDEX; Schema: public; Owner: quimicorp
--

CREATE INDEX sub_almacen_sobrantes_estado_idx ON public.sub_almacen_sobrantes USING btree (estado);


--
-- Name: sucursales_dispositivo_id_key; Type: INDEX; Schema: public; Owner: quimicorp
--

CREATE UNIQUE INDEX sucursales_dispositivo_id_key ON public.sucursales USING btree (dispositivo_id);


--
-- Name: sucursales_nombre_key; Type: INDEX; Schema: public; Owner: quimicorp
--

CREATE UNIQUE INDEX sucursales_nombre_key ON public.sucursales USING btree (nombre);


--
-- Name: tickets_despacho_codigoTicket_key; Type: INDEX; Schema: public; Owner: quimicorp
--

CREATE UNIQUE INDEX "tickets_despacho_codigoTicket_key" ON public.tickets_despacho USING btree ("codigoTicket");


--
-- Name: turnos_nombre_key; Type: INDEX; Schema: public; Owner: quimicorp
--

CREATE UNIQUE INDEX turnos_nombre_key ON public.turnos USING btree (nombre);


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: quimicorp
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: usuarios_codigoBiometrico_key; Type: INDEX; Schema: public; Owner: quimicorp
--

CREATE UNIQUE INDEX "usuarios_codigoBiometrico_key" ON public.usuarios USING btree ("codigoBiometrico");


--
-- Name: usuarios_dni_key; Type: INDEX; Schema: public; Owner: quimicorp
--

CREATE UNIQUE INDEX usuarios_dni_key ON public.usuarios USING btree (dni);


--
-- Name: usuarios_rolId_idx; Type: INDEX; Schema: public; Owner: quimicorp
--

CREATE INDEX "usuarios_rolId_idx" ON public.usuarios USING btree ("rolId");


--
-- Name: usuarios_sucursal_id_idx; Type: INDEX; Schema: public; Owner: quimicorp
--

CREATE INDEX usuarios_sucursal_id_idx ON public.usuarios USING btree (sucursal_id);


--
-- Name: usuarios_turno_id_idx; Type: INDEX; Schema: public; Owner: quimicorp
--

CREATE INDEX usuarios_turno_id_idx ON public.usuarios USING btree (turno_id);


--
-- Name: valorizacion_inventario_fechaCierre_key; Type: INDEX; Schema: public; Owner: quimicorp
--

CREATE UNIQUE INDEX "valorizacion_inventario_fechaCierre_key" ON public.valorizacion_inventario USING btree ("fechaCierre");


--
-- Name: ajustes_finos ajustes_finos_insumoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: quimicorp
--

ALTER TABLE ONLY public.ajustes_finos
    ADD CONSTRAINT "ajustes_finos_insumoId_fkey" FOREIGN KEY ("insumoId") REFERENCES public.insumos(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ajustes_finos ajustes_finos_ordenProduccionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: quimicorp
--

ALTER TABLE ONLY public.ajustes_finos
    ADD CONSTRAINT "ajustes_finos_ordenProduccionId_fkey" FOREIGN KEY ("ordenProduccionId") REFERENCES public.ordenes_produccion(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ajustes_finos ajustes_finos_registradoPorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: quimicorp
--

ALTER TABLE ONLY public.ajustes_finos
    ADD CONSTRAINT "ajustes_finos_registradoPorId_fkey" FOREIGN KEY ("registradoPorId") REFERENCES public.usuarios(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: asistencias asistencias_turno_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: quimicorp
--

ALTER TABLE ONLY public.asistencias
    ADD CONSTRAINT asistencias_turno_id_fkey FOREIGN KEY (turno_id) REFERENCES public.turnos(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: asistencias asistencias_usuarioId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: quimicorp
--

ALTER TABLE ONLY public.asistencias
    ADD CONSTRAINT "asistencias_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES public.usuarios(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: audit_logs audit_logs_usuarioId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: quimicorp
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT "audit_logs_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES public.usuarios(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: calificaciones_operario calificaciones_operario_ordenProduccionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: quimicorp
--

ALTER TABLE ONLY public.calificaciones_operario
    ADD CONSTRAINT "calificaciones_operario_ordenProduccionId_fkey" FOREIGN KEY ("ordenProduccionId") REFERENCES public.ordenes_produccion(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: calificaciones_operario calificaciones_operario_usuarioId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: quimicorp
--

ALTER TABLE ONLY public.calificaciones_operario
    ADD CONSTRAINT "calificaciones_operario_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES public.usuarios(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: contacto_representantes contacto_representantes_cliente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: quimicorp
--

ALTER TABLE ONLY public.contacto_representantes
    ADD CONSTRAINT contacto_representantes_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: cotizaciones_proveedores cotizaciones_proveedores_insumo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: quimicorp
--

ALTER TABLE ONLY public.cotizaciones_proveedores
    ADD CONSTRAINT cotizaciones_proveedores_insumo_id_fkey FOREIGN KEY (insumo_id) REFERENCES public.insumos(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: cotizaciones_proveedores cotizaciones_proveedores_proveedor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: quimicorp
--

ALTER TABLE ONLY public.cotizaciones_proveedores
    ADD CONSTRAINT cotizaciones_proveedores_proveedor_id_fkey FOREIGN KEY (proveedor_id) REFERENCES public.proveedores(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: cuentas_bancarias_proveedores cuentas_bancarias_proveedores_proveedor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: quimicorp
--

ALTER TABLE ONLY public.cuentas_bancarias_proveedores
    ADD CONSTRAINT cuentas_bancarias_proveedores_proveedor_id_fkey FOREIGN KEY (proveedor_id) REFERENCES public.proveedores(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: cuentas_cobrar cuentas_cobrar_cliente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: quimicorp
--

ALTER TABLE ONLY public.cuentas_cobrar
    ADD CONSTRAINT cuentas_cobrar_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: etiquetas_impresas etiquetas_impresas_impresoPorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: quimicorp
--

ALTER TABLE ONLY public.etiquetas_impresas
    ADD CONSTRAINT "etiquetas_impresas_impresoPorId_fkey" FOREIGN KEY ("impresoPorId") REFERENCES public.usuarios(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: etiquetas_impresas etiquetas_impresas_loteProduccionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: quimicorp
--

ALTER TABLE ONLY public.etiquetas_impresas
    ADD CONSTRAINT "etiquetas_impresas_loteProduccionId_fkey" FOREIGN KEY ("loteProduccionId") REFERENCES public.ordenes_produccion(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: formula_detalles formula_detalles_formulaId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: quimicorp
--

ALTER TABLE ONLY public.formula_detalles
    ADD CONSTRAINT "formula_detalles_formulaId_fkey" FOREIGN KEY ("formulaId") REFERENCES public.formulas_master(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: formula_detalles formula_detalles_insumoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: quimicorp
--

ALTER TABLE ONLY public.formula_detalles
    ADD CONSTRAINT "formula_detalles_insumoId_fkey" FOREIGN KEY ("insumoId") REFERENCES public.insumos(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: formula_variants formula_variants_cliente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: quimicorp
--

ALTER TABLE ONLY public.formula_variants
    ADD CONSTRAINT formula_variants_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: formula_variants formula_variants_formula_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: quimicorp
--

ALTER TABLE ONLY public.formula_variants
    ADD CONSTRAINT formula_variants_formula_id_fkey FOREIGN KEY (formula_id) REFERENCES public.formulas_master(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: incidencias_lote incidencias_lote_loteProduccionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: quimicorp
--

ALTER TABLE ONLY public.incidencias_lote
    ADD CONSTRAINT "incidencias_lote_loteProduccionId_fkey" FOREIGN KEY ("loteProduccionId") REFERENCES public.ordenes_produccion(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: incidencias_lote incidencias_lote_reportadoPorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: quimicorp
--

ALTER TABLE ONLY public.incidencias_lote
    ADD CONSTRAINT "incidencias_lote_reportadoPorId_fkey" FOREIGN KEY ("reportadoPorId") REFERENCES public.usuarios(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: insumos insumos_familiaId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: quimicorp
--

ALTER TABLE ONLY public.insumos
    ADD CONSTRAINT "insumos_familiaId_fkey" FOREIGN KEY ("familiaId") REFERENCES public.familias_insumo(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: kardex_inmutable kardex_inmutable_insumoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: quimicorp
--

ALTER TABLE ONLY public.kardex_inmutable
    ADD CONSTRAINT "kardex_inmutable_insumoId_fkey" FOREIGN KEY ("insumoId") REFERENCES public.insumos(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: kardex_inmutable kardex_inmutable_usuarioId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: quimicorp
--

ALTER TABLE ONLY public.kardex_inmutable
    ADD CONSTRAINT "kardex_inmutable_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES public.usuarios(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: kardex_movimientos kardex_movimientos_insumo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: quimicorp
--

ALTER TABLE ONLY public.kardex_movimientos
    ADD CONSTRAINT kardex_movimientos_insumo_id_fkey FOREIGN KEY (insumo_id) REFERENCES public.insumos(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: kardex_movimientos kardex_movimientos_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: quimicorp
--

ALTER TABLE ONLY public.kardex_movimientos
    ADD CONSTRAINT kardex_movimientos_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: marcaciones_biometrico marcaciones_biometrico_usuarioId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: quimicorp
--

ALTER TABLE ONLY public.marcaciones_biometrico
    ADD CONSTRAINT "marcaciones_biometrico_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES public.usuarios(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ordenes_produccion ordenes_produccion_formulaId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: quimicorp
--

ALTER TABLE ONLY public.ordenes_produccion
    ADD CONSTRAINT "ordenes_produccion_formulaId_fkey" FOREIGN KEY ("formulaId") REFERENCES public.formulas_master(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ordenes_produccion ordenes_produccion_supervisorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: quimicorp
--

ALTER TABLE ONLY public.ordenes_produccion
    ADD CONSTRAINT "ordenes_produccion_supervisorId_fkey" FOREIGN KEY ("supervisorId") REFERENCES public.usuarios(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: pagos_abonos pagos_abonos_cuenta_cobrar_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: quimicorp
--

ALTER TABLE ONLY public.pagos_abonos
    ADD CONSTRAINT pagos_abonos_cuenta_cobrar_id_fkey FOREIGN KEY (cuenta_cobrar_id) REFERENCES public.cuentas_cobrar(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: pedido_aditivos pedido_aditivos_insumo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: quimicorp
--

ALTER TABLE ONLY public.pedido_aditivos
    ADD CONSTRAINT pedido_aditivos_insumo_id_fkey FOREIGN KEY (insumo_id) REFERENCES public.insumos(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: pedido_aditivos pedido_aditivos_pedido_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: quimicorp
--

ALTER TABLE ONLY public.pedido_aditivos
    ADD CONSTRAINT pedido_aditivos_pedido_id_fkey FOREIGN KEY (pedido_id) REFERENCES public.pedidos_comerciales(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: pedidos_comerciales pedidos_comerciales_cliente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: quimicorp
--

ALTER TABLE ONLY public.pedidos_comerciales
    ADD CONSTRAINT pedidos_comerciales_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: pedidos_comerciales pedidos_comerciales_formula_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: quimicorp
--

ALTER TABLE ONLY public.pedidos_comerciales
    ADD CONSTRAINT pedidos_comerciales_formula_id_fkey FOREIGN KEY (formula_id) REFERENCES public.formulas_master(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: pedidos_comerciales pedidos_comerciales_variante_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: quimicorp
--

ALTER TABLE ONLY public.pedidos_comerciales
    ADD CONSTRAINT pedidos_comerciales_variante_id_fkey FOREIGN KEY (variante_id) REFERENCES public.formula_variants(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: rol_permisos rol_permisos_permisoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: quimicorp
--

ALTER TABLE ONLY public.rol_permisos
    ADD CONSTRAINT "rol_permisos_permisoId_fkey" FOREIGN KEY ("permisoId") REFERENCES public.permisos(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: rol_permisos rol_permisos_rolId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: quimicorp
--

ALTER TABLE ONLY public.rol_permisos
    ADD CONSTRAINT "rol_permisos_rolId_fkey" FOREIGN KEY ("rolId") REFERENCES public.roles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: sub_almacen_sobrantes sub_almacen_sobrantes_insumoSubproductoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: quimicorp
--

ALTER TABLE ONLY public.sub_almacen_sobrantes
    ADD CONSTRAINT "sub_almacen_sobrantes_insumoSubproductoId_fkey" FOREIGN KEY ("insumoSubproductoId") REFERENCES public.insumos(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: sub_almacen_sobrantes sub_almacen_sobrantes_loteOrigenId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: quimicorp
--

ALTER TABLE ONLY public.sub_almacen_sobrantes
    ADD CONSTRAINT "sub_almacen_sobrantes_loteOrigenId_fkey" FOREIGN KEY ("loteOrigenId") REFERENCES public.ordenes_produccion(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: tickets_despacho tickets_despacho_ordenProduccionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: quimicorp
--

ALTER TABLE ONLY public.tickets_despacho
    ADD CONSTRAINT "tickets_despacho_ordenProduccionId_fkey" FOREIGN KEY ("ordenProduccionId") REFERENCES public.ordenes_produccion(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: users users_rolId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: quimicorp
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_rolId_fkey" FOREIGN KEY ("rolId") REFERENCES public.roles(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: usuarios usuarios_rolId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: quimicorp
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT "usuarios_rolId_fkey" FOREIGN KEY ("rolId") REFERENCES public.roles(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: usuarios usuarios_sucursal_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: quimicorp
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_sucursal_id_fkey FOREIGN KEY (sucursal_id) REFERENCES public.sucursales(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: usuarios usuarios_turno_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: quimicorp
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_turno_id_fkey FOREIGN KEY (turno_id) REFERENCES public.turnos(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ventanas_almuerzo_qa ventanas_almuerzo_qa_aprobadoPorQAId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: quimicorp
--

ALTER TABLE ONLY public.ventanas_almuerzo_qa
    ADD CONSTRAINT "ventanas_almuerzo_qa_aprobadoPorQAId_fkey" FOREIGN KEY ("aprobadoPorQAId") REFERENCES public.usuarios(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

\unrestrict MYbdSMBPaomtg9OM3ZBdzT0Pni3ynxtL2ahcXZv1jGiQl1JrnAdm7KQ3Aqb3upy

