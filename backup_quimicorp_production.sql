--
-- PostgreSQL database dump
--

\restrict hVwbJwhIK8vLaVM1Z7ZEgdTEHQVgXIA22cFyxeazvifZ2wMJuuclbC39LGP9DhR

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
ALTER TABLE IF EXISTS ONLY public.ordenes_produccion DROP CONSTRAINT IF EXISTS ordenes_produccion_pedido_comercial_id_fkey;
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
DROP INDEX IF EXISTS public.ordenes_produccion_pedido_comercial_id_idx;
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
-- Name: AccionPermiso; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."AccionPermiso" AS ENUM (
    'CREATE',
    'READ',
    'UPDATE',
    'DELETE'
);


--
-- Name: CategoriaKardex; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."CategoriaKardex" AS ENUM (
    'PRODUCTO_TERMINADO',
    'MATERIA_PRIMA',
    'INSUMO',
    'ENVASE',
    'EMBALAJE'
);


--
-- Name: EstadoAsistencia; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."EstadoAsistencia" AS ENUM (
    'PUNTUAL',
    'TARDANZA',
    'FALTA',
    'JUSTIFICADO'
);


--
-- Name: EstadoDespacho; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."EstadoDespacho" AS ENUM (
    'PENDIENTE',
    'EN_RUTA',
    'ENTREGADO',
    'DEVUELTO'
);


--
-- Name: EstadoFormula; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."EstadoFormula" AS ENUM (
    'ACTIVA',
    'INACTIVA',
    'EN_REVISION'
);


--
-- Name: EstadoGenerico; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."EstadoGenerico" AS ENUM (
    'ACTIVO',
    'INACTIVO'
);


--
-- Name: EstadoOrdenProduccion; Type: TYPE; Schema: public; Owner: -
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


--
-- Name: EstadoPedidoComercial; Type: TYPE; Schema: public; Owner: -
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


--
-- Name: EstadoSubAlmacen; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."EstadoSubAlmacen" AS ENUM (
    'DISPONIBLE',
    'REUSADO',
    'DESCARTADO'
);


--
-- Name: PrioridadPedidoComercial; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."PrioridadPedidoComercial" AS ENUM (
    'URGENTE',
    'NORMAL',
    'PROGRAMADO'
);


--
-- Name: Role; Type: TYPE; Schema: public; Owner: -
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


--
-- Name: TipoEtiqueta; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."TipoEtiqueta" AS ENUM (
    'INSUMO',
    'GALON',
    'BARRIL',
    'FRASCO'
);


--
-- Name: TipoInsumo; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."TipoInsumo" AS ENUM (
    'BASE',
    'FRAGANCIA',
    'PIGMENTO',
    'ENVASE',
    'OTRO'
);


--
-- Name: TipoMarcacion; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."TipoMarcacion" AS ENUM (
    'ENTRADA',
    'SALIDA_ALMUERZO',
    'RETORNO_ALMUERZO',
    'SALIDA'
);


--
-- Name: TipoMovimiento; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."TipoMovimiento" AS ENUM (
    'ENTRADA_COMPRA',
    'ENTRADA_PRODUCCION',
    'ENTRADA_AJUSTE',
    'SALIDA_VENTA',
    'SALIDA_CONSUMO_PRODUCCION',
    'SALIDA_MERMA'
);


--
-- Name: TipoMovimientoKardex; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."TipoMovimientoKardex" AS ENUM (
    'ENTRADA',
    'SALIDA',
    'AJUSTE_FINO',
    'MERMA',
    'REAPROVECHAMIENTO'
);


--
-- Name: UnidadMedida; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."UnidadMedida" AS ENUM (
    'KG',
    'L',
    'GR',
    'UN',
    'ML'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: ajustes_finos; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: asistencias; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: calificaciones_operario; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.calificaciones_operario (
    id text NOT NULL,
    "usuarioId" text NOT NULL,
    "ordenProduccionId" text NOT NULL,
    "puntajeEficiencia" numeric(5,2) NOT NULL,
    comentarios text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: clientes; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: cola_despacho; Type: TABLE; Schema: public; Owner: -
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
    numero_guia text,
    ruc text,
    sku text,
    advertencia_ghs text,
    codigo_ghs text,
    tipo_peligro text,
    tipo_envase text,
    tara_gramos integer
);


--
-- Name: contacto_representantes; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: cotizaciones_proveedores; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: cuentas_bancarias_proveedores; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: cuentas_cobrar; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: etiquetas_impresas; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.etiquetas_impresas (
    id text NOT NULL,
    "codigoEtiqueta" text NOT NULL,
    "loteProduccionId" text NOT NULL,
    "tipoEtiqueta" public."TipoEtiqueta" NOT NULL,
    "impresoPorId" text NOT NULL,
    "timestamp" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: familias_insumo; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.familias_insumo (
    id text NOT NULL,
    nombre text NOT NULL,
    descripcion text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: formula_detalles; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: formula_variants; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: formulas_master; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: incidencias_lote; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: insumos; Type: TABLE; Schema: public; Owner: -
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
    estado_fisico text,
    es_solo_formula boolean DEFAULT false NOT NULL
);


--
-- Name: kardex_inmutable; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: kardex_movimientos; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: marcaciones_biometrico; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.marcaciones_biometrico (
    id text NOT NULL,
    "usuarioId" text NOT NULL,
    "tipoMarcacion" public."TipoMarcacion" NOT NULL,
    "timestamp" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "dispositivoId" text NOT NULL
);


--
-- Name: marcaciones_pendientes; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: metricas_produccion_diaria; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.metricas_produccion_diaria (
    id text NOT NULL,
    fecha date NOT NULL,
    "volumenTotalLitros" numeric(14,4) NOT NULL,
    "mermaTotalKg" numeric(14,4) NOT NULL,
    "eficienciaPromedio" numeric(5,2) NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: ordenes_produccion; Type: TABLE; Schema: public; Owner: -
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
    "updatedAt" timestamp(3) without time zone NOT NULL,
    pedido_comercial_id text
);


--
-- Name: pagos_abonos; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: pedido_aditivos; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: pedidos_comerciales; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: permisos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.permisos (
    id text NOT NULL,
    modulo text NOT NULL,
    accion public."AccionPermiso" NOT NULL
);


--
-- Name: proveedores; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: rol_permisos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.rol_permisos (
    "rolId" text NOT NULL,
    "permisoId" text NOT NULL
);


--
-- Name: roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.roles (
    id text NOT NULL,
    nombre text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: solicitudes_autorizacion; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: sub_almacen_sobrantes; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: sucursales; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: tickets_despacho; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: turnos; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: usuarios; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: valorizacion_inventario; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.valorizacion_inventario (
    id text NOT NULL,
    "fechaCierre" date NOT NULL,
    "materiaPrimaValorizada" numeric(16,4) NOT NULL,
    "productoTerminadoValorizado" numeric(16,4) NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: ventanas_almuerzo_qa; Type: TABLE; Schema: public; Owner: -
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


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: -
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
7680339d-4e51-4e2c-bcf9-85e5f38fca67	02045e1fd978e244d90f83adc58c6158b08cbdbce6e06252af6fe23c1f4f93e4	2026-09-04 19:33:55.303657+00	20260903100000_add_pedido_comercial_fk_orden	\N	\N	2026-09-04 19:33:55.303657+00	1
3b1ef3c0-91c4-4174-b542-bee5021c9851	1df3430d3fcdba31b3b8588acb517f537dff45565aefed25e7ea32a41683e85e	2026-09-04 19:33:55.306554+00	20260903110000_add_regulatory_cols_cola	\N	\N	2026-09-04 19:33:55.306554+00	1
f416658a-9b28-4b6c-bd58-f4e97f3e069a	b4ea3e67faee9479d2953c47e8b1eadd54d5ba9e410fcdb32d592dd4baf5ce85	2026-09-07 19:23:41.476431+00	20260907142100_add_es_solo_formula	\N	\N	2026-09-07 19:23:41.451341+00	1
\.


--
-- Data for Name: ajustes_finos; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.ajustes_finos (id, "ordenProduccionId", "insumoId", "cantidadAgregada", observacion, "registradoPorId", "timestamp") FROM stdin;
\.


--
-- Data for Name: asistencias; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.asistencias (id, "usuarioId", fecha, "horasTrabajadas", "minutosTardanza", "estadoAsistencia", "createdAt", "updatedAt", turno_id, hora_entrada, hora_salida, estado_almuerzo) FROM stdin;
\.


--
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.audit_logs (id, "usuarioId", accion, "tablaAfectada", "registroId", "datosAnteriores", "datosNuevos", "ipOrigen", "timestamp") FROM stdin;
\.


--
-- Data for Name: calificaciones_operario; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.calificaciones_operario (id, "usuarioId", "ordenProduccionId", "puntajeEficiencia", comentarios, "createdAt") FROM stdin;
\.


--
-- Data for Name: clientes; Type: TABLE DATA; Schema: public; Owner: -
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
-- Data for Name: cola_despacho; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.cola_despacho (id, lote_codigo, producto_nombre, cliente_nombre, cantidad, fecha_fabricacion, codigo_qr, codigo_barras, estado, created_at, updated_at, numero_guia, ruc, sku, advertencia_ghs, codigo_ghs, tipo_peligro, tipo_envase, tara_gramos) FROM stdin;
\.


--
-- Data for Name: contacto_representantes; Type: TABLE DATA; Schema: public; Owner: -
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
-- Data for Name: cotizaciones_proveedores; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.cotizaciones_proveedores (id, proveedor_id, insumo_id, precio_unitario, moneda, unidad_medida, num_cotizacion, fecha_cotizacion, variacion_porcentual, observaciones, estado, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: cuentas_bancarias_proveedores; Type: TABLE DATA; Schema: public; Owner: -
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
-- Data for Name: cuentas_cobrar; Type: TABLE DATA; Schema: public; Owner: -
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
a7da588a-e924-4c7f-91d6-eccf2a4f1a0e	E001-227	ae6b7139-1b14-4b8d-8752-1eb9812b7211	ALFALION INVESTMENT S.A.C.	20612434124	\N	OP-20260831-06, OP-20260831-07	CREAM LBS CUERO / BARRA RDX ARR AUTOMOTRIZ	1260.00	0.00	Contado	0	2026-08-31 00:00:00	2026-08-31 00:00:00	2026-08-31 00:00:00	PAGADO	\N	\N	2026-09-09 13:49:28.685	2026-09-09 13:49:28.685
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
-- Data for Name: etiquetas_impresas; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.etiquetas_impresas (id, "codigoEtiqueta", "loteProduccionId", "tipoEtiqueta", "impresoPorId", "timestamp") FROM stdin;
\.


--
-- Data for Name: familias_insumo; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.familias_insumo (id, nombre, descripcion, "createdAt", "updatedAt") FROM stdin;
e76cf865-819b-47d0-9e60-fbcbed29f2dc	ACTIVOS Y ACIDOS	Categoria oficial de insumos	2026-09-07 19:25:50.829	2026-09-07 19:25:50.829
f3d25455-ed0b-4167-93e1-b03b5200e551	ACEITES Y ESENCIAS	Categoria oficial de insumos	2026-09-07 19:25:50.838	2026-09-07 19:25:50.838
5e122e5f-f303-42ac-baab-586f4ec650d4	TENSOACTIVOS	Categoria oficial de insumos	2026-09-07 19:25:50.842	2026-09-07 19:25:50.842
8df3c4e0-4b0b-4531-9812-4500d79438a2	ESPESANTES	Categoria oficial de insumos	2026-09-07 19:25:50.845	2026-09-07 19:25:50.845
4e3404d0-f57c-4447-b1cf-fd2f645f40c2	EMULSIONANTES Y CERAS	Categoria oficial de insumos	2026-09-07 19:25:50.849	2026-09-07 19:25:50.849
e666504d-be2a-4cef-bb50-81d4f6c141f6	SILICONAS Y EMOLIENTES	Categoria oficial de insumos	2026-09-07 19:25:50.853	2026-09-07 19:25:50.853
459481c9-5211-48c8-94e6-932065ffdcd1	HUMECTANTES Y SOLVENTES	Categoria oficial de insumos	2026-09-07 19:25:50.857	2026-09-07 19:25:50.857
1883d81b-c0f6-4499-9a76-c0d7b3133987	EXTRACTOS NATURALES	Categoria oficial de insumos	2026-09-07 19:25:50.861	2026-09-07 19:25:50.861
7aecccbf-3f81-4d96-b5df-86efbb1d5169	MINERALES Y CARGAS	Categoria oficial de insumos	2026-09-07 19:25:50.865	2026-09-07 19:25:50.865
90b57950-0d6f-416c-9b55-eecdd7816fcd	CONSERVANTES Y REGULADORES	Categoria oficial de insumos	2026-09-07 19:25:50.869	2026-09-07 19:25:50.869
ca259fab-2ab9-427a-b134-eb3a7b0cc8a1	FRAGANCIAS	Categoria oficial de insumos	2026-09-07 19:25:50.873	2026-09-07 19:25:50.873
f468a444-11d2-489c-a981-a6d5efbb85d3	COLORANTES Y PIGMENTOS	Categoria oficial de insumos	2026-09-07 19:25:50.876	2026-09-07 19:25:50.876
a854aaba-1041-483d-a506-4e9e2fb44d65	ENVASES Y EMBALAJES	\N	2026-09-07 20:26:19.523	2026-09-07 20:26:19.523
\.


--
-- Data for Name: formula_detalles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.formula_detalles (id, "formulaId", "insumoId", "nombreComponente", "skuComponente", porcentaje, "pesoMasaTeorico", "createdAt", "updatedAt") FROM stdin;
b6496a4f-792c-48f6-9eb3-b7a2b1a61346	fc39b789-a0bd-486d-8201-67e815f04d2b	ff2e578a-4456-4d54-8bc2-1f9ec6c8cc7c	Agua destilada	\N	18.250	182.5000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
4628b412-b4ed-4088-9dd0-43c37443e975	fc39b789-a0bd-486d-8201-67e815f04d2b	503a47d1-8230-410a-bbd1-b76b0a91ba24	Benzoato de sodio	\N	0.100	1.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
5ca395c5-9bb2-406f-966e-f64f8be93200	fc39b789-a0bd-486d-8201-67e815f04d2b	3b682c2c-c7a5-426b-b223-32e792196c98	Sorbato de potasio	\N	0.050	0.5000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
7aae58db-b55f-4f13-8ed3-5f9ef676f03c	fc39b789-a0bd-486d-8201-67e815f04d2b	cc105e5c-84f1-4fa5-ae8f-835919d15bb3	Sacarina sodica	\N	0.300	3.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
842087d5-8cfb-4a75-bae5-7c03302345dd	fc39b789-a0bd-486d-8201-67e815f04d2b	afff08d5-96ed-441c-b6d0-d3e8b162edcb	Sorbitol	\N	10.000	100.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
4a5fc2bb-0eaa-4caa-ab09-6c3f712b4c26	fc39b789-a0bd-486d-8201-67e815f04d2b	9c3c9b3b-7eef-4d3c-bc51-df944f79b354	Alcohol extra neutro 96%	\N	69.600	696.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
37ce0646-8404-4499-8be7-8b0e0c099b50	fc39b789-a0bd-486d-8201-67e815f04d2b	af9c6776-36ae-46e8-9851-3e53387f8e55	Saborizante limon	\N	0.500	5.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
e5858595-5081-474e-81ae-2e70caf14efa	fc39b789-a0bd-486d-8201-67e815f04d2b	fe94b3d9-b108-4d75-8849-64a2af654d59	Saborizante clavo de olor	\N	1.000	10.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
730aba56-5879-4d6f-b61f-f90f599f7203	fc39b789-a0bd-486d-8201-67e815f04d2b	12b82ba7-09a5-43b6-a754-56abcb77a4cc	Mentol en cristales	\N	0.100	1.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
56d57f77-6c00-4c95-bafa-e94ae66d1c97	ea7f4752-e231-4974-9b27-d269afd4b898	ff2e578a-4456-4d54-8bc2-1f9ec6c8cc7c	Agua destilada	\N	18.800	188.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
66c5e376-67c9-43f6-9475-bd5dbd379af0	ea7f4752-e231-4974-9b27-d269afd4b898	503a47d1-8230-410a-bbd1-b76b0a91ba24	Benzoato de sodio	\N	0.100	1.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
fca80c76-a916-46b4-860a-6dee4b570349	ea7f4752-e231-4974-9b27-d269afd4b898	3b682c2c-c7a5-426b-b223-32e792196c98	Sorbato de potasio	\N	0.050	0.5000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
03a60c28-6b47-469b-85ea-3a87f3680602	ea7f4752-e231-4974-9b27-d269afd4b898	cc105e5c-84f1-4fa5-ae8f-835919d15bb3	Sacarina sodica	\N	0.300	3.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
f675355f-a60a-448b-832d-2549d9ce4968	ea7f4752-e231-4974-9b27-d269afd4b898	afff08d5-96ed-441c-b6d0-d3e8b162edcb	Sorbitol	\N	10.000	100.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
d200f066-7fd4-4f42-972e-dc00263b28d8	ea7f4752-e231-4974-9b27-d269afd4b898	9c3c9b3b-7eef-4d3c-bc51-df944f79b354	Alcohol extra neutro 96%	\N	69.600	696.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
35bd1664-6e6b-44c1-bdfc-a58acaed9340	ea7f4752-e231-4974-9b27-d269afd4b898	88b2929d-ccba-4bb7-a053-234873f49a84	Saborizante sandia	\N	1.000	10.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
60f967d0-269d-4317-a0c4-b29f7a6ef886	ea7f4752-e231-4974-9b27-d269afd4b898	12b82ba7-09a5-43b6-a754-56abcb77a4cc	Mentol en cristales	\N	0.100	1.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
d51a9444-cb4b-470a-98ab-6a5205e9919a	1ba4894e-5696-4a4d-8415-b1b29c8dff70	c2cce8b2-2bdb-4752-b8a0-946e94b14e19	Agua desionizada	\N	88.700	887.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
37a7237d-5f9e-4c01-96ae-181a72d83a2b	1ba4894e-5696-4a4d-8415-b1b29c8dff70	4b5b2284-c252-486b-a8cd-0e2cb39c9928	Cellosize	\N	0.800	8.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
b7117f44-0af5-49ad-8d02-55a526f427f8	1ba4894e-5696-4a4d-8415-b1b29c8dff70	644113e7-6761-492f-a55e-a359c795c5f8	Propilenglicol	\N	5.000	50.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
881901fa-7f6d-4417-b169-3c1c5ec2bd8a	1ba4894e-5696-4a4d-8415-b1b29c8dff70	0b0e329a-b9ae-48f1-9d13-65ffb8295b6e	Cafeina	\N	3.000	30.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
af2861cc-b5b1-45db-a8fe-976be626a245	1ba4894e-5696-4a4d-8415-b1b29c8dff70	af5ed9d6-a35f-4f15-bad4-9f834901d8c0	Colageno hidrolizado	\N	1.000	10.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
e44a3c9a-c1e7-48ad-b205-9caed286e132	1ba4894e-5696-4a4d-8415-b1b29c8dff70	59b5bd63-1199-4880-90d9-519213f9b67d	Acido ascorbico	\N	0.500	5.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
cf24ddf3-5521-4967-b724-9d385d90d161	1ba4894e-5696-4a4d-8415-b1b29c8dff70	12b82ba7-09a5-43b6-a754-56abcb77a4cc	Mentol en cristales	\N	0.050	0.5000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
1c6ca178-bc15-4f2d-943b-08bf35a5044c	1ba4894e-5696-4a4d-8415-b1b29c8dff70	84c02891-72ff-44f5-8767-75e1b79ec02e	Trietanolamina (TEA)	\N	0.800	8.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
5d8d8e3e-20f9-4156-89aa-16a7d77c116a	1ba4894e-5696-4a4d-8415-b1b29c8dff70	503a47d1-8230-410a-bbd1-b76b0a91ba24	Benzoato de sodio	\N	0.100	1.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
99a00790-a69e-423d-a1fb-e5c12f734517	1ba4894e-5696-4a4d-8415-b1b29c8dff70	3b682c2c-c7a5-426b-b223-32e792196c98	Sorbato de potasio	\N	0.050	0.5000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
18e8792e-f2a5-45d8-ad50-112318ef3af5	535de50d-08be-43d1-8153-220a99332e2a	7270809e-5f98-48a2-aa46-a99bf4455bb3	Glicerina	\N	2.000	20.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
66081e59-c3d8-468c-bfe4-162b1dcb66d4	535de50d-08be-43d1-8153-220a99332e2a	afff08d5-96ed-441c-b6d0-d3e8b162edcb	Sorbitol	\N	2.000	20.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
b6870b74-c7a5-4bde-b4dd-eb1d4e8ae6c5	535de50d-08be-43d1-8153-220a99332e2a	4b5b2284-c252-486b-a8cd-0e2cb39c9928	Cellosize	\N	2.000	20.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
1e7c5c28-7e66-4040-aea4-eb22589d6951	535de50d-08be-43d1-8153-220a99332e2a	84c02891-72ff-44f5-8767-75e1b79ec02e	Trietanolamina (TEA)	\N	1.000	10.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
a16f7ae6-9f93-4cb2-b63c-1ab568fc5eb3	535de50d-08be-43d1-8153-220a99332e2a	e83bff71-bddb-43a6-9c99-28021f004e94	Colorante dispersante morado	\N	1.000	10.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
4c4dcf84-6d46-417a-a530-50453350e437	535de50d-08be-43d1-8153-220a99332e2a	cb79f8a4-0b14-4203-8144-d00af9c5dc64	Saborizante chicle	\N	0.500	5.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
91a22fea-e23d-4216-9fd9-dbeed59ef941	535de50d-08be-43d1-8153-220a99332e2a	22fabeae-a648-4909-8618-c6e6704ba256	Betaina	\N	0.500	5.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
c2bef130-9b95-400e-b739-4baae250f966	535de50d-08be-43d1-8153-220a99332e2a	cc105e5c-84f1-4fa5-ae8f-835919d15bb3	Sacarina sodica	\N	0.100	1.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
38bfa6e6-b772-49cd-a828-33896e712459	535de50d-08be-43d1-8153-220a99332e2a	d84cba5d-96a8-432f-a27c-650a3da49cd1	Procide CG	\N	1.000	10.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
27f2747c-7f80-4108-a313-1bc7a1db5350	535de50d-08be-43d1-8153-220a99332e2a	12b82ba7-09a5-43b6-a754-56abcb77a4cc	Mentol en cristales	\N	0.050	0.5000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
30354a63-a812-4a1e-9a32-dd5812546786	535de50d-08be-43d1-8153-220a99332e2a	c2cce8b2-2bdb-4752-b8a0-946e94b14e19	Agua desionizada	\N	89.800	898.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
eb912702-69b2-44d4-8b83-6ae05e038159	bbcf2157-0fbd-4eb5-9903-dae3aa077a8e	f0cbaabe-0290-42b3-a5a2-d637cb5c584f	Alcanfor	\N	1.000	10.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
c168797f-f3e9-4c1d-8455-5765ef8d190e	bbcf2157-0fbd-4eb5-9903-dae3aa077a8e	12b82ba7-09a5-43b6-a754-56abcb77a4cc	Mentol en cristales	\N	1.000	10.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
04c2105a-cc03-4bba-8570-364cb638d6b9	bbcf2157-0fbd-4eb5-9903-dae3aa077a8e	9c3c9b3b-7eef-4d3c-bc51-df944f79b354	Alcohol extra neutro 96%	\N	57.500	575.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
9a87e9a4-4359-48df-b2ab-e5ac0414a3e6	bbcf2157-0fbd-4eb5-9903-dae3aa077a8e	c2cce8b2-2bdb-4752-b8a0-946e94b14e19	Agua desionizada	\N	37.600	376.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
2ea82001-b45a-4698-94ee-4649b6cf6f09	bbcf2157-0fbd-4eb5-9903-dae3aa077a8e	2556b4df-e535-47b5-bfcb-a34622f6f0fe	Carbopol	\N	1.200	12.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
a1b72c24-6ea4-4b8f-874a-d3eec92b4875	bbcf2157-0fbd-4eb5-9903-dae3aa077a8e	503a47d1-8230-410a-bbd1-b76b0a91ba24	Benzoato de sodio	\N	0.100	1.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
5a88c822-0cfd-43f3-80c6-e388310aea9d	bbcf2157-0fbd-4eb5-9903-dae3aa077a8e	3b682c2c-c7a5-426b-b223-32e792196c98	Sorbato de potasio	\N	0.100	1.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
1a6164d2-24d1-4135-8379-7d7b7ffeef95	bbcf2157-0fbd-4eb5-9903-dae3aa077a8e	84c02891-72ff-44f5-8767-75e1b79ec02e	Trietanolamina (TEA)	\N	1.200	12.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
557fc087-52f9-4556-8cac-385df3ea5c7b	877c7f9a-6407-42f3-baf4-679c30f11acb	c2cce8b2-2bdb-4752-b8a0-946e94b14e19	Agua desionizada	\N	86.000	860.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
57eed055-3e14-43a5-83cd-06cc8f466a56	877c7f9a-6407-42f3-baf4-679c30f11acb	af5ed9d6-a35f-4f15-bad4-9f834901d8c0	Colageno	\N	5.000	50.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
7792fcea-6da5-4b54-b5eb-81a2e3296887	877c7f9a-6407-42f3-baf4-679c30f11acb	59b5bd63-1199-4880-90d9-519213f9b67d	Acido ascorbico (Vit C)	\N	0.500	5.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
91761d97-2610-463d-bd78-ee1c2cf0d248	877c7f9a-6407-42f3-baf4-679c30f11acb	0b0e329a-b9ae-48f1-9d13-65ffb8295b6e	Cafeina	\N	2.000	20.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
4dfa6d0f-b545-45c3-9b3e-1116bf4efcac	877c7f9a-6407-42f3-baf4-679c30f11acb	7270809e-5f98-48a2-aa46-a99bf4455bb3	Glicerina	\N	5.000	50.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
18e2b545-7a12-49e0-ab1d-24feee395c27	877c7f9a-6407-42f3-baf4-679c30f11acb	876f54db-7e02-40f9-917d-94ac8bd2d198	Extracto de aloe vera	\N	0.500	5.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
a9187d50-cbfc-47c2-82dc-05102375cc57	877c7f9a-6407-42f3-baf4-679c30f11acb	ebfcccbb-22c9-468d-8ee7-f7cdb8cacdb8	Vitamina E	\N	0.500	5.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
24c54960-9e08-4e79-8142-13040544a059	877c7f9a-6407-42f3-baf4-679c30f11acb	d84cba5d-96a8-432f-a27c-650a3da49cd1	Procide CG	\N	0.100	1.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
505f6cce-5f3f-47a9-ab1f-790d1d18076a	877c7f9a-6407-42f3-baf4-679c30f11acb	b0e49e23-1edc-4ec2-b265-189ebe472eac	Polisorbato 20	\N	2.000	20.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
d21eb91d-8732-4d83-aace-27df7746642e	f1a31a6e-f657-48ac-884c-c57388b7a7eb	6f4a88eb-353d-4c06-8725-7fe107f32668	Texapon 70%	\N	12.000	120.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
6741961a-8762-449a-9cde-9d22a7cbfd47	f1a31a6e-f657-48ac-884c-c57388b7a7eb	22fabeae-a648-4909-8618-c6e6704ba256	Betaina	\N	0.100	1.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
3de6c685-cd5e-4981-b624-17fe8a52b01f	f1a31a6e-f657-48ac-884c-c57388b7a7eb	7270809e-5f98-48a2-aa46-a99bf4455bb3	Glicerina	\N	2.000	20.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
20e17299-73e0-4707-abf4-eb5336a5b790	f1a31a6e-f657-48ac-884c-c57388b7a7eb	f5c778e9-bbfc-4fef-aa32-9b32a6db83c7	Aceite de ricino	\N	1.000	10.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
3b92a0c2-c1b1-4da2-ad16-e9dcb655a4b5	f1a31a6e-f657-48ac-884c-c57388b7a7eb	dc1761ba-bf39-41fc-bc4d-e48b3e2e1114	Aceite esencial de romero	\N	0.200	2.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
493a0ef8-e412-49d5-91ab-b3438a0f1923	f1a31a6e-f657-48ac-884c-c57388b7a7eb	7fc5e7e8-2a80-41a4-b513-58adf03367a6	Extracto de romero	\N	1.000	10.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
8255e06c-82ac-4d02-9d6f-7ef94185a2b9	f1a31a6e-f657-48ac-884c-c57388b7a7eb	eed50ae4-682c-4b3a-9fc6-27b3f992b26e	D-Pantenol / Pantenol	\N	0.500	5.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
0849a3cf-bc39-463b-9063-3f8af5c072ee	f1a31a6e-f657-48ac-884c-c57388b7a7eb	9970b88d-ccef-460e-8724-41f331750fa8	Proteina de trigo hidrolizada	\N	0.500	5.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
5d0d6d9b-0a30-45a0-85be-29eba578f662	f1a31a6e-f657-48ac-884c-c57388b7a7eb	2585af84-0476-44c1-bddd-6569609dea26	Acido citrico	\N	0.200	2.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
c0eb7d60-7a23-43c2-8298-41136f1f9e8a	f1a31a6e-f657-48ac-884c-c57388b7a7eb	6e4a171c-6eb7-4f4d-b3af-b2d380335061	Cloruro de sodio (sal)	\N	0.400	4.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
7e4e249b-4d7f-48c4-a47d-0d48a45659e5	f1a31a6e-f657-48ac-884c-c57388b7a7eb	d84cba5d-96a8-432f-a27c-650a3da49cd1	Procide CG	\N	0.200	2.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
7beb1d62-8284-4f7e-bd01-33a54d40a1c4	f1a31a6e-f657-48ac-884c-c57388b7a7eb	c2cce8b2-2bdb-4752-b8a0-946e94b14e19	Agua desionizada	\N	81.800	818.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
d5f933a3-7351-4673-97ff-d175538567fb	8a1792cf-f2f2-492c-917c-472cab09d40d	c2cce8b2-2bdb-4752-b8a0-946e94b14e19	Agua desionizada	\N	84.500	845.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
7eae8295-18bd-488e-9ca2-ce3b7af7c642	8a1792cf-f2f2-492c-917c-472cab09d40d	c488a9b9-fe87-4cf8-91be-2eceb65198ac	Cloruro de benzalconio	\N	1.000	10.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
2ca07c86-3644-42e2-8cf7-4ad11ea1c6de	8a1792cf-f2f2-492c-917c-472cab09d40d	f2d1ddc3-d6e7-49a9-9372-92b32f951d92	Clorhexidina	\N	2.000	20.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
3c3426f4-0dc1-467d-bab6-bb5046613c9c	8a1792cf-f2f2-492c-917c-472cab09d40d	876f54db-7e02-40f9-917d-94ac8bd2d198	Extracto de aloe vera	\N	3.000	30.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
b46dd5e5-f72f-4a3d-b36a-25191f40fe41	8a1792cf-f2f2-492c-917c-472cab09d40d	eed50ae4-682c-4b3a-9fc6-27b3f992b26e	D-Pantenol / Pantenol	\N	0.500	5.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
d15156e8-cc47-4262-8a12-ce282f9a23b7	8a1792cf-f2f2-492c-917c-472cab09d40d	7270809e-5f98-48a2-aa46-a99bf4455bb3	Glicerina	\N	2.000	20.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
f6eaf347-6018-4637-bb26-fe213c256697	8a1792cf-f2f2-492c-917c-472cab09d40d	64534917-1fa8-4ad6-aef5-58254449a729	Acido salicilico	\N	0.500	5.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
f275e987-a0c9-4407-9af2-81add0fe35ae	8a1792cf-f2f2-492c-917c-472cab09d40d	644113e7-6761-492f-a55e-a359c795c5f8	Propilenglicol	\N	1.000	10.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
cbdc23e8-6c9f-4146-9a9e-7be331c294ec	8a1792cf-f2f2-492c-917c-472cab09d40d	8587e682-2575-4153-9ad6-ebd98e42db27	EDTA tetrasodico	\N	0.200	2.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
4cdad18e-469d-4e61-bc06-f4c0ade1cd90	8a1792cf-f2f2-492c-917c-472cab09d40d	3b682c2c-c7a5-426b-b223-32e792196c98	Sorbato de potasio	\N	0.300	3.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
abbd906d-93b9-4364-a7f5-e4a774890d9a	8a1792cf-f2f2-492c-917c-472cab09d40d	503a47d1-8230-410a-bbd1-b76b0a91ba24	Benzoato de sodio	\N	0.300	3.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
c136a8b1-d3d2-4463-977c-8ae9f51feae1	8a1792cf-f2f2-492c-917c-472cab09d40d	2585af84-0476-44c1-bddd-6569609dea26	Acido citrico	\N	0.100	1.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
f542a8dd-382f-4609-9593-923310b129f7	387fe6a3-d575-4a05-9fda-38be4c10bfe5	c2cce8b2-2bdb-4752-b8a0-946e94b14e19	Agua desionizada	\N	83.400	834.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
c8b8b6d8-1750-49b2-80b3-a626c7614c74	387fe6a3-d575-4a05-9fda-38be4c10bfe5	7270809e-5f98-48a2-aa46-a99bf4455bb3	Glicerina	\N	5.000	50.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
3b92a57b-1889-40cb-aaf7-4f85196d0220	387fe6a3-d575-4a05-9fda-38be4c10bfe5	97f87364-f00c-472b-a9dd-5ce36244afb4	Niacinamida	\N	2.000	20.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
6c6c8f05-ec1f-4607-aa06-951234c37aed	387fe6a3-d575-4a05-9fda-38be4c10bfe5	876f54db-7e02-40f9-917d-94ac8bd2d198	Extracto de aloe vera	\N	1.000	10.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
90addcd8-ccdf-41c2-a6a2-1bbf0497c94a	387fe6a3-d575-4a05-9fda-38be4c10bfe5	dce8fe7c-faae-4471-b425-9ad83b9914e8	Extracto de te verde	\N	1.000	10.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
cf0105db-5e28-48d9-83de-835b9d2d428f	387fe6a3-d575-4a05-9fda-38be4c10bfe5	22fabeae-a648-4909-8618-c6e6704ba256	Betaina	\N	3.000	30.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
3f4ed171-a761-4a81-a0c1-facd12b2d4ca	387fe6a3-d575-4a05-9fda-38be4c10bfe5	eed50ae4-682c-4b3a-9fc6-27b3f992b26e	D-Pantenol / Pantenol	\N	0.500	5.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
d0e8ff64-fe79-4eff-a329-29750d80eb31	387fe6a3-d575-4a05-9fda-38be4c10bfe5	6f4a88eb-353d-4c06-8725-7fe107f32668	Texapon 70%	\N	1.000	10.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
16177fc9-30b5-49c9-9306-39861ae8f9b7	387fe6a3-d575-4a05-9fda-38be4c10bfe5	4b5b2284-c252-486b-a8cd-0e2cb39c9928	Cellosize	\N	0.700	7.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
0c89c886-dbd1-4ef8-9281-43cdd504b22f	387fe6a3-d575-4a05-9fda-38be4c10bfe5	84c02891-72ff-44f5-8767-75e1b79ec02e	Trietanolamina (TEA)	\N	0.700	7.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
5532a76c-3cf3-4312-bbb9-19c4ea16d932	387fe6a3-d575-4a05-9fda-38be4c10bfe5	becf6944-0163-4bed-a3a5-25908da5ecd1	Acido lactico	\N	0.200	2.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
3af37235-7b62-4c1e-b5a8-d1c076286131	387fe6a3-d575-4a05-9fda-38be4c10bfe5	2585af84-0476-44c1-bddd-6569609dea26	Acido citrico	\N	0.300	3.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
97d7556e-e1a1-410f-886d-2ccb6d60fe62	387fe6a3-d575-4a05-9fda-38be4c10bfe5	503a47d1-8230-410a-bbd1-b76b0a91ba24	Benzoato de sodio	\N	0.500	5.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
74fb3ffc-5de9-41f7-b341-cf64c6b33f04	387fe6a3-d575-4a05-9fda-38be4c10bfe5	3b682c2c-c7a5-426b-b223-32e792196c98	Sorbato de potasio	\N	0.300	3.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
0266c249-b2ef-4f74-ba76-2f2013d342a2	3eac95a0-c2a9-44e1-9a0d-0d12654d44ea	f5c778e9-bbfc-4fef-aa32-9b32a6db83c7	Aceite de ricino	\N	83.800	838.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
c2679bf3-d67d-4536-8d62-9bb8ab4c18bc	3eac95a0-c2a9-44e1-9a0d-0d12654d44ea	4dd73445-63fb-44cd-9d92-54166b5118fe	Aceite de coco extra virgen	\N	10.000	100.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
833b0b8b-d42d-4011-85bb-cc75c3138c94	3eac95a0-c2a9-44e1-9a0d-0d12654d44ea	3d1b2079-8e4f-455f-ba1d-71ed13bb38ed	Aceite de jojoba	\N	5.000	50.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
2eb8cb0d-4b7a-4a9d-a3e1-f581235e9376	3eac95a0-c2a9-44e1-9a0d-0d12654d44ea	dc1761ba-bf39-41fc-bc4d-e48b3e2e1114	Aceite esencial de romero	\N	0.500	5.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
b195b6a8-2a05-4c74-8f71-08933bb5d47c	3eac95a0-c2a9-44e1-9a0d-0d12654d44ea	ebfcccbb-22c9-468d-8ee7-f7cdb8cacdb8	Vitamina E	\N	0.200	2.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
01d3e8d2-49f0-42e0-9deb-8b30c73c3d34	641d562c-5d86-4365-9add-fb105edbdea1	c2cce8b2-2bdb-4752-b8a0-946e94b14e19	Agua desionizada	\N	88.200	882.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
92417e61-7e6b-4971-826c-d89e184dbab5	641d562c-5d86-4365-9add-fb105edbdea1	644113e7-6761-492f-a55e-a359c795c5f8	Propilenglicol	\N	3.000	30.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
29597e6d-5cf3-4294-b241-e1f9b21a648d	641d562c-5d86-4365-9add-fb105edbdea1	7270809e-5f98-48a2-aa46-a99bf4455bb3	Glicerina	\N	3.000	30.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
b4fa0b9f-8bb5-48d5-9454-086a0a5ab342	641d562c-5d86-4365-9add-fb105edbdea1	07786a0b-ba83-4789-a413-21d6c1e1f419	Lipocol 40 (PEG-40)	\N	2.000	20.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
66df8fd4-b45c-4d80-b35d-a81f81de8f77	641d562c-5d86-4365-9add-fb105edbdea1	f2d1ddc3-d6e7-49a9-9372-92b32f951d92	Clorhexidina	\N	0.500	5.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
53806380-a85e-4f14-97bf-fa8765dcc07b	641d562c-5d86-4365-9add-fb105edbdea1	503a47d1-8230-410a-bbd1-b76b0a91ba24	Benzoato de sodio	\N	0.200	2.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
e53819a4-dff1-458f-9966-353c6feac231	641d562c-5d86-4365-9add-fb105edbdea1	3b682c2c-c7a5-426b-b223-32e792196c98	Sorbato de potasio	\N	0.100	1.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
d0395813-b781-4493-9666-97a00a8c46ca	641d562c-5d86-4365-9add-fb105edbdea1	9a703458-3a72-4274-81b2-061090483c85	Extracto de calendula	\N	2.000	20.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
4bd9eb64-d72f-40a1-a2ea-1b1465428c6d	641d562c-5d86-4365-9add-fb105edbdea1	1c8fe2f4-1435-4a5f-a9fc-8de4b5d9bbe0	Aceite de semillas de uva	\N	1.000	10.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
6299c419-f25f-45e7-8fa9-2b5f18342d36	959e93ed-f308-432c-9cd1-cdfb391cdca8	c2cce8b2-2bdb-4752-b8a0-946e94b14e19	Agua desionizada	\N	86.800	868.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
ecba1b41-7a48-4f10-b8b7-a5536967fb59	959e93ed-f308-432c-9cd1-cdfb391cdca8	7270809e-5f98-48a2-aa46-a99bf4455bb3	Glicerina	\N	5.000	50.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
7b85b480-625f-464e-8ecc-ff86be84eb4c	959e93ed-f308-432c-9cd1-cdfb391cdca8	5e4bece3-960e-4857-99c6-2bffe32518a2	Palmitato de isopropilo	\N	3.000	30.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
7be3b9b5-89cd-44d3-9abb-eb8a78b04a74	959e93ed-f308-432c-9cd1-cdfb391cdca8	dce8fe7c-faae-4471-b425-9ad83b9914e8	Extracto de te verde	\N	1.000	10.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
3710f977-a2c7-4513-939a-e7c5c90c02b9	959e93ed-f308-432c-9cd1-cdfb391cdca8	680bb3f2-3b9d-47d4-aaad-f024b910bb89	Extracto de algas marinas	\N	1.000	10.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
b139fea6-682c-4688-9bec-ed69b88064f5	959e93ed-f308-432c-9cd1-cdfb391cdca8	59b5bd63-1199-4880-90d9-519213f9b67d	Acido ascorbico (Vit C)	\N	0.200	2.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
e3c8b388-8d86-4407-947d-4dd89c2e3eb7	959e93ed-f308-432c-9cd1-cdfb391cdca8	af5ed9d6-a35f-4f15-bad4-9f834901d8c0	Colageno hidrolizado	\N	1.000	10.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
f7c76525-ed53-40ac-a3da-27b70049db8b	959e93ed-f308-432c-9cd1-cdfb391cdca8	4b5b2284-c252-486b-a8cd-0e2cb39c9928	Cellosize	\N	0.700	7.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
037e66fa-87e1-4b17-a917-3f981a5b423a	959e93ed-f308-432c-9cd1-cdfb391cdca8	84c02891-72ff-44f5-8767-75e1b79ec02e	Trietanolamina (TEA)	\N	0.700	7.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
5f07b399-54a7-4ebd-ab00-1a7f6c3367c2	959e93ed-f308-432c-9cd1-cdfb391cdca8	503a47d1-8230-410a-bbd1-b76b0a91ba24	Benzoato de sodio	\N	0.200	2.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
00914be0-dd72-4cdb-a018-268c1fb72247	959e93ed-f308-432c-9cd1-cdfb391cdca8	3b682c2c-c7a5-426b-b223-32e792196c98	Sorbato de potasio	\N	0.100	1.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
6acc2913-de40-40c1-826a-353c568d3c5b	959e93ed-f308-432c-9cd1-cdfb391cdca8	2585af84-0476-44c1-bddd-6569609dea26	Acido citrico	\N	0.200	2.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
f9b624f1-8167-4a24-a087-8c025791cec3	4489baaa-e5b3-45c4-881a-510bb69428c1	c2cce8b2-2bdb-4752-b8a0-946e94b14e19	Agua desionizada	\N	71.600	716.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
d30a99b1-be0c-47c7-8bf9-7b599c5792cf	4489baaa-e5b3-45c4-881a-510bb69428c1	6f597885-c511-429f-a9c9-e44f858f6ce5	Clorhidrato de aluminio	\N	10.000	100.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
48fe479a-64c5-42d3-90cf-071f8a37f034	4489baaa-e5b3-45c4-881a-510bb69428c1	7270809e-5f98-48a2-aa46-a99bf4455bb3	Glicerina	\N	4.000	40.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
8f928566-bd1e-43a0-ba30-e54c8c39a56a	4489baaa-e5b3-45c4-881a-510bb69428c1	9c452016-ddf6-4271-bedc-b9bd5ee69ad8	Alantoina	\N	0.200	2.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
976e1514-151d-4a05-b990-77d402140c2e	4489baaa-e5b3-45c4-881a-510bb69428c1	e5c39f4b-b2ee-4e21-ab5d-6b2ae5a3b0d5	Emulgade 1000	\N	5.000	50.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
4cf65190-a0b8-4f62-93eb-4b8d79c3d0c5	4489baaa-e5b3-45c4-881a-510bb69428c1	8849ff42-8f1d-4bb7-9b63-154fb2a329d3	Alcohol cetilico	\N	1.500	15.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
c78ea1ed-fdb0-4357-b2a5-99c9fde45944	4489baaa-e5b3-45c4-881a-510bb69428c1	d197d1dd-8efb-4724-9acf-fcb315a27269	Trietil citrato	\N	2.000	20.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
18639d65-b2be-4581-a1aa-6f7fac3c316d	4489baaa-e5b3-45c4-881a-510bb69428c1	97f87364-f00c-472b-a9dd-5ce36244afb4	Niacinamida	\N	3.000	30.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
3e98d7fa-8f4b-4d87-b427-459ffd4e3e96	4489baaa-e5b3-45c4-881a-510bb69428c1	876f54db-7e02-40f9-917d-94ac8bd2d198	Extracto de aloe vera	\N	1.000	10.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
f40a2768-588a-4556-a2ed-e293bbb87298	4489baaa-e5b3-45c4-881a-510bb69428c1	aa9c5892-6798-4a68-b4cc-3538f410ab2a	Extracto de manzanilla	\N	0.300	3.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
18b2a5b7-d5e6-40c3-960b-d9c5edd040ee	4489baaa-e5b3-45c4-881a-510bb69428c1	ebfcccbb-22c9-468d-8ee7-f7cdb8cacdb8	Vitamina E	\N	0.200	2.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
7c776eb9-95a1-4b7f-b772-59c205720f59	4489baaa-e5b3-45c4-881a-510bb69428c1	503a47d1-8230-410a-bbd1-b76b0a91ba24	Benzoato de sodio	\N	0.400	4.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
9a98a6b3-aabe-4789-bd6c-3a4b894f438b	4489baaa-e5b3-45c4-881a-510bb69428c1	3b682c2c-c7a5-426b-b223-32e792196c98	Sorbato de potasio	\N	0.200	2.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
f9ff4374-f671-45ab-9faf-0732338bcbb7	e202a2f1-f630-48da-b990-b2d570fddcb0	ab9438b3-e9d8-4b33-a5c8-da547e7b5024	Vaselina liquida	\N	88.300	883.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
df04a0bd-439e-4637-8206-13847b8018f7	e202a2f1-f630-48da-b990-b2d570fddcb0	82bbbad6-cce9-48ef-90e1-e3db6d129421	Aceite de almendras	\N	5.000	50.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
76a385f7-c20d-4754-b3c4-b57e9d36a1d4	e202a2f1-f630-48da-b990-b2d570fddcb0	3d1b2079-8e4f-455f-ba1d-71ed13bb38ed	Aceite de jojoba	\N	3.500	35.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
196fcf76-21b7-44e2-9ea4-42bd97459f7c	e202a2f1-f630-48da-b990-b2d570fddcb0	21e40a49-e4d9-43f0-b94d-dbba64570dd4	Aceite de rosa mosqueta	\N	2.000	20.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
ab18c266-beef-4edc-a5d6-21fddefb0854	e202a2f1-f630-48da-b990-b2d570fddcb0	ebfcccbb-22c9-468d-8ee7-f7cdb8cacdb8	Vitamina E	\N	0.500	5.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
1d478eb0-90a2-4ab4-a973-3bc7a8333044	e202a2f1-f630-48da-b990-b2d570fddcb0	5bb3d411-d5be-462a-8d26-11725b5d41e5	Aceite esencial de arbol del te	\N	0.700	7.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
d7357d02-272f-4f95-b82f-48b4bde4ad04	5a80ac43-d378-4f7e-b48f-9d79d9ac6eee	e0f68e13-c50d-4a87-80f3-53424aad3a74	Lidocaina	\N	2.000	20.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
d18b110d-b409-475b-b04e-4d193d906008	5a80ac43-d378-4f7e-b48f-9d79d9ac6eee	be820686-1b6b-47e3-9780-7308bdf7a88b	Tetracaina	\N	1.000	10.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
551ad051-0844-4e6a-a662-9e0fe8c7a46b	5a80ac43-d378-4f7e-b48f-9d79d9ac6eee	a27907cc-b24a-4206-9c65-d413aa4b5563	Prilocaina	\N	2.000	20.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
b25863e2-89e6-462d-99a0-595212c51533	5a80ac43-d378-4f7e-b48f-9d79d9ac6eee	8849ff42-8f1d-4bb7-9b63-154fb2a329d3	Alcohol cetilico	\N	7.000	70.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
60ef12fd-efc7-4d02-b6fa-9f2b6465c3d7	5a80ac43-d378-4f7e-b48f-9d79d9ac6eee	a7931626-b6ab-450d-b7e8-484d773cf1aa	Dehyquart	\N	7.000	70.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
53cd37d7-8072-4f38-924d-ce28cc6d03d9	5a80ac43-d378-4f7e-b48f-9d79d9ac6eee	05f1df06-27d0-41ce-9dc4-12f2c6085189	Vaselina solida	\N	6.700	67.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
33c7db67-ea76-46b9-b119-04ec960ead7d	5a80ac43-d378-4f7e-b48f-9d79d9ac6eee	644113e7-6761-492f-a55e-a359c795c5f8	Propilenglicol	\N	6.700	67.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
1e95772d-40a6-448e-b510-4c37966660d2	5a80ac43-d378-4f7e-b48f-9d79d9ac6eee	7270809e-5f98-48a2-aa46-a99bf4455bb3	Glicerina	\N	3.000	30.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
96cd1cf1-47a4-495d-a9b2-1ab4449bdb0c	5a80ac43-d378-4f7e-b48f-9d79d9ac6eee	d84cba5d-96a8-432f-a27c-650a3da49cd1	Procide CG	\N	0.800	8.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
5374448b-667a-49f5-b3f9-a603c32822fb	5a80ac43-d378-4f7e-b48f-9d79d9ac6eee	8587e682-2575-4153-9ad6-ebd98e42db27	EDTA tetrasodico	\N	0.050	0.5000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
af24323d-3ab9-46cb-9174-a9dac60f4e2a	5a80ac43-d378-4f7e-b48f-9d79d9ac6eee	c2cce8b2-2bdb-4752-b8a0-946e94b14e19	Agua desionizada	\N	67.800	678.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
25ab8ba9-39e0-40f1-b4da-d0adbbc14018	3403329c-8bac-486c-9471-49cbbcdd591c	ab9438b3-e9d8-4b33-a5c8-da547e7b5024	Vaselina liquida	\N	55.000	550.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
be388732-2538-4ab7-9be7-fc52073b47d2	3403329c-8bac-486c-9471-49cbbcdd591c	3d1b2079-8e4f-455f-ba1d-71ed13bb38ed	Aceite de jojoba	\N	25.000	250.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
1185ff4e-43fe-4121-a3ab-3d69c9208654	3403329c-8bac-486c-9471-49cbbcdd591c	82bbbad6-cce9-48ef-90e1-e3db6d129421	Aceite de almendras	\N	15.000	150.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
cfa070ce-07f6-4bed-93f6-ee68f8a4c417	3403329c-8bac-486c-9471-49cbbcdd591c	dc1761ba-bf39-41fc-bc4d-e48b3e2e1114	Aceite esencial de romero	\N	1.500	15.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
632897fa-0fd7-4abd-846f-20db78b4ec10	3403329c-8bac-486c-9471-49cbbcdd591c	5480454e-c3c6-476d-b99e-8a7788757e7a	Aceite esencial de cipres	\N	1.000	10.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
237269a8-b09c-4da6-9ce6-68bf944ec6d0	3403329c-8bac-486c-9471-49cbbcdd591c	fa33e7f3-d81e-41f9-9949-678a92eff8e6	Aceite esencial de lavanda	\N	1.000	10.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
880e3f63-25d9-4d64-a146-b8aafbfb908b	3403329c-8bac-486c-9471-49cbbcdd591c	ad8d4fcd-8173-4bab-a6d8-221fc45396a6	Aceite esencial de menta	\N	0.500	5.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
d1f1c581-eee0-4c09-8a6d-8f3f05fbd503	3403329c-8bac-486c-9471-49cbbcdd591c	ebfcccbb-22c9-468d-8ee7-f7cdb8cacdb8	Vitamina E	\N	1.000	10.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
9d1b5bf5-3337-46d9-a600-7aabc3b6f11d	0a1bb771-0aa4-471b-891b-9822ed8ef8fd	c488a9b9-fe87-4cf8-91be-2eceb65198ac	Cloruro de benzalconio	\N	0.100	1.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
d180b741-6a07-4943-894c-a6e853ee8e40	0a1bb771-0aa4-471b-891b-9822ed8ef8fd	2be1c138-5b1e-459d-bb39-ab0e210b426c	Acido benzoico	\N	0.300	3.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
375fdccf-5e81-446f-aeec-71cd316dc124	0a1bb771-0aa4-471b-891b-9822ed8ef8fd	1a65b0df-716d-4352-8e1d-506dfbf946fd	Acido borico	\N	0.500	5.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
30774991-e8c3-4c45-8de4-cdb79390e6ef	0a1bb771-0aa4-471b-891b-9822ed8ef8fd	e0f68e13-c50d-4a87-80f3-53424aad3a74	Lidocaina	\N	0.500	5.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
358c834b-626a-4f5e-9f91-0854fe6f8382	0a1bb771-0aa4-471b-891b-9822ed8ef8fd	27ddf750-d66d-4836-8d58-f080b8d9daf7	Propionato de sodio	\N	1.000	10.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
924dddd9-225c-4186-8b3b-22f642d20f80	0a1bb771-0aa4-471b-891b-9822ed8ef8fd	e4261caf-b4e8-4fff-8349-48d8d21c89f5	Acido undecilenico	\N	3.000	30.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
20be4a67-1077-4a3c-91f0-f9e157f124c4	0a1bb771-0aa4-471b-891b-9822ed8ef8fd	ff2e578a-4456-4d54-8bc2-1f9ec6c8cc7c	Agua destilada	\N	10.000	100.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
90b900f4-a88b-438f-a403-d0983d9db596	0a1bb771-0aa4-471b-891b-9822ed8ef8fd	9c3c9b3b-7eef-4d3c-bc51-df944f79b354	Alcohol extra neutro 96%	\N	44.800	448.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
e79727fc-151e-48ed-8cf1-061da76e0f6a	0a1bb771-0aa4-471b-891b-9822ed8ef8fd	644113e7-6761-492f-a55e-a359c795c5f8	Propilenglicol	\N	39.800	398.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
ffb35f0c-b431-49fb-babd-8fbf0fa33f1c	1fd70156-cb41-4301-9eb1-748fb6fbd7b1	5bb3d411-d5be-462a-8d26-11725b5d41e5	Aceite esencial de arbol del te	\N	0.500	5.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
ecc090fa-a891-4878-8ee0-4d7f3fcb4d79	1fd70156-cb41-4301-9eb1-748fb6fbd7b1	fa33e7f3-d81e-41f9-9949-678a92eff8e6	Aceite esencial de lavanda	\N	0.500	5.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
2f0f4590-e3bb-4c59-ae07-bb0bc157cfe5	1fd70156-cb41-4301-9eb1-748fb6fbd7b1	b0e49e23-1edc-4ec2-b265-189ebe472eac	Polisorbato 20	\N	4.000	40.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
ef1c0313-96c7-42b5-859b-9a58e410c8c9	1fd70156-cb41-4301-9eb1-748fb6fbd7b1	9a703458-3a72-4274-81b2-061090483c85	Extracto de calendula	\N	2.000	20.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
d02bfb57-45d7-4f76-83b9-e4a8df74edf7	1fd70156-cb41-4301-9eb1-748fb6fbd7b1	f2d1ddc3-d6e7-49a9-9372-92b32f951d92	Clorhexidina (20% sol.)	\N	1.000	10.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
d5bbab5a-4dd1-4afc-b1c8-082dbab45e91	1fd70156-cb41-4301-9eb1-748fb6fbd7b1	7270809e-5f98-48a2-aa46-a99bf4455bb3	Glicerina vegetal	\N	3.000	30.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
11136f9c-4978-46a4-9ee2-c233172417fe	1fd70156-cb41-4301-9eb1-748fb6fbd7b1	eed50ae4-682c-4b3a-9fc6-27b3f992b26e	D-Pantenol	\N	1.000	10.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
c63e5bd1-2570-46ab-a77a-b2c8023c07f6	1fd70156-cb41-4301-9eb1-748fb6fbd7b1	644113e7-6761-492f-a55e-a359c795c5f8	Propilenglicol	\N	1.000	10.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
c86a7a3c-d9a3-42f2-ae5b-d2a235e523f3	1fd70156-cb41-4301-9eb1-748fb6fbd7b1	503a47d1-8230-410a-bbd1-b76b0a91ba24	Benzoato de sodio	\N	0.100	1.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
5197f8aa-aa8c-4a5c-9210-238f25ffcf58	1fd70156-cb41-4301-9eb1-748fb6fbd7b1	3b682c2c-c7a5-426b-b223-32e792196c98	Sorbato de potasio	\N	0.050	0.5000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
71c1679f-f311-4a32-adb8-bc90c9e41599	1fd70156-cb41-4301-9eb1-748fb6fbd7b1	c2cce8b2-2bdb-4752-b8a0-946e94b14e19	Agua desionizada	\N	87.850	878.5000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
3cc788c0-2c24-4b07-9035-34d507911e28	420a89ef-8365-4c22-94d1-cefde9803adb	64534917-1fa8-4ad6-aef5-58254449a729	Acido salicilico	\N	2.000	20.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
2a9c8f5c-70fa-4c6e-ad2b-75a30c593931	420a89ef-8365-4c22-94d1-cefde9803adb	becf6944-0163-4bed-a3a5-25908da5ecd1	Acido lactico	\N	1.000	10.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
0bdea909-65cb-44c0-a85f-659d9c34d3dd	420a89ef-8365-4c22-94d1-cefde9803adb	9c3c9b3b-7eef-4d3c-bc51-df944f79b354	Alcohol extra neutro 96%	\N	5.000	50.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
1544c37c-f19b-4372-8f3b-4473f65ad761	420a89ef-8365-4c22-94d1-cefde9803adb	7270809e-5f98-48a2-aa46-a99bf4455bb3	Glicerina	\N	2.000	20.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
c748c38a-de9e-43f4-90f8-3f5919ad8399	420a89ef-8365-4c22-94d1-cefde9803adb	644113e7-6761-492f-a55e-a359c795c5f8	Propilenglicol	\N	5.000	50.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
d7f001cb-f987-4c79-86ca-86f07aebefa5	420a89ef-8365-4c22-94d1-cefde9803adb	4b5b2284-c252-486b-a8cd-0e2cb39c9928	Cellosize	\N	0.900	9.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
7a83bbac-f174-4ffe-94be-79af5daeed4f	420a89ef-8365-4c22-94d1-cefde9803adb	503a47d1-8230-410a-bbd1-b76b0a91ba24	Benzoato de sodio	\N	0.100	1.0000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
5e90943d-b158-4844-a0d4-f73ad8db14f0	420a89ef-8365-4c22-94d1-cefde9803adb	3b682c2c-c7a5-426b-b223-32e792196c98	Sorbato de potasio	\N	0.050	0.5000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
2adf6e8a-eddb-4761-84c8-5b468bacfefc	420a89ef-8365-4c22-94d1-cefde9803adb	c2cce8b2-2bdb-4752-b8a0-946e94b14e19	Agua desionizada	\N	84.350	843.5000	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419
65ce624a-1ebe-4a8f-bf70-44f8400574b6	2adedd85-03ee-4c05-8e12-a16db63abe0b	8849ff42-8f1d-4bb7-9b63-154fb2a329d3	Alcohol cetilico	\N	5.000	50.0000	2026-09-08 21:05:02.314	2026-09-08 21:05:02.314
d39515f9-7c6e-4d25-bfad-43450c5ac3b5	2adedd85-03ee-4c05-8e12-a16db63abe0b	a7931626-b6ab-450d-b7e8-484d773cf1aa	Dehyquart	\N	5.000	50.0000	2026-09-08 21:05:02.314	2026-09-08 21:05:02.314
be8dc7fb-4e88-483c-ba2c-b70ebddb3394	2adedd85-03ee-4c05-8e12-a16db63abe0b	f0cbaabe-0290-42b3-a5a2-d637cb5c584f	Alcanfor	\N	1.000	10.0000	2026-09-08 21:05:02.314	2026-09-08 21:05:02.314
0e670953-45ae-4e63-ab51-1fec16a5925f	2adedd85-03ee-4c05-8e12-a16db63abe0b	12b82ba7-09a5-43b6-a754-56abcb77a4cc	Mentol en cristales	\N	1.000	10.0000	2026-09-08 21:05:02.314	2026-09-08 21:05:02.314
fa160197-0628-432f-963a-b4a90a89494c	2adedd85-03ee-4c05-8e12-a16db63abe0b	dc1761ba-bf39-41fc-bc4d-e48b3e2e1114	Aceite esencial de romero	\N	0.500	5.0000	2026-09-08 21:05:02.314	2026-09-08 21:05:02.314
223c5598-84f0-4a7b-9ca3-60f15b514140	2adedd85-03ee-4c05-8e12-a16db63abe0b	c2cce8b2-2bdb-4752-b8a0-946e94b14e19	Agua desionizada	\N	87.040	870.0000	2026-09-08 21:05:02.314	2026-09-08 21:05:02.314
dc2dc79b-dcbd-4f8a-ab35-b927634edf20	2adedd85-03ee-4c05-8e12-a16db63abe0b	d84cba5d-96a8-432f-a27c-650a3da49cd1	Procide CG	\N	0.250	2.5000	2026-09-08 21:05:02.314	2026-09-08 21:05:02.314
e0ddb089-43b4-4a0c-bd4a-994cc4f017c3	2adedd85-03ee-4c05-8e12-a16db63abe0b	f0d037dc-e1bf-4ca0-a093-7fdf254d457b	Colorante verde	\N	0.200	2.0000	2026-09-08 21:05:02.314	2026-09-08 21:05:02.314
ba8863ae-ad4c-4817-bf11-4b7f4a3a01d6	1ef772af-2d57-4378-a172-bbde20b2f26d	8849ff42-8f1d-4bb7-9b63-154fb2a329d3	Alcohol cetilico	\N	8.000	80.0000	2026-09-08 21:05:02.314	2026-09-08 21:05:02.314
c941165f-8061-4632-a6ca-8391509a36a1	1ef772af-2d57-4378-a172-bbde20b2f26d	a7931626-b6ab-450d-b7e8-484d773cf1aa	Dehyquart	\N	8.000	80.0000	2026-09-08 21:05:02.314	2026-09-08 21:05:02.314
4b1a2aac-3724-4e18-b24e-1be8debfc050	1ef772af-2d57-4378-a172-bbde20b2f26d	f0cbaabe-0290-42b3-a5a2-d637cb5c584f	Alcanfor	\N	1.000	10.0000	2026-09-08 21:05:02.314	2026-09-08 21:05:02.314
ca119678-9496-4ae0-926b-233293b45f88	1ef772af-2d57-4378-a172-bbde20b2f26d	12b82ba7-09a5-43b6-a754-56abcb77a4cc	Mentol en cristales	\N	1.000	10.0000	2026-09-08 21:05:02.314	2026-09-08 21:05:02.314
9c02b797-dbbf-4f6c-ba06-acf53557ef5f	1ef772af-2d57-4378-a172-bbde20b2f26d	dc1761ba-bf39-41fc-bc4d-e48b3e2e1114	Aceite esencial de romero	\N	0.500	5.0000	2026-09-08 21:05:02.314	2026-09-08 21:05:02.314
804a54ce-b960-4171-96b8-080566a7b0f7	1ef772af-2d57-4378-a172-bbde20b2f26d	6ebc3b68-7093-4e6b-9db3-2319895dc64b	Cloruro de magnesio	\N	2.000	20.0000	2026-09-08 21:05:02.314	2026-09-08 21:05:02.314
b1616193-af95-434d-ba9f-c6e9cc2ca750	1ef772af-2d57-4378-a172-bbde20b2f26d	c2cce8b2-2bdb-4752-b8a0-946e94b14e19	Agua desionizada	\N	79.240	792.0000	2026-09-08 21:05:02.314	2026-09-08 21:05:02.314
2e5489fd-d2aa-4038-b486-088c85b1e30c	1ef772af-2d57-4378-a172-bbde20b2f26d	d84cba5d-96a8-432f-a27c-650a3da49cd1	Procide CG	\N	0.250	2.5000	2026-09-08 21:05:02.314	2026-09-08 21:05:02.314
54442c11-e465-4d7a-810d-33b688cab6db	09f4deb9-88c4-4f62-a1a1-759db5bc2840	c2cce8b2-2bdb-4752-b8a0-946e94b14e19	Agua desionizada	\N	84.500	4225.0000	2026-09-08 21:05:02.314	2026-09-08 21:05:02.314
45d3af26-d2f5-4795-87e5-a7d115202c42	09f4deb9-88c4-4f62-a1a1-759db5bc2840	ff28dc8d-0d58-44b5-9c30-d752cae50a6b	Alcohol laurico etoxilado	\N	5.000	250.0000	2026-09-08 21:05:02.314	2026-09-08 21:05:02.314
00a2d295-4e12-458f-8153-9c4e47db1a91	09f4deb9-88c4-4f62-a1a1-759db5bc2840	541a4b55-f363-44a4-b5a6-0af56e20b172	Fragancia Paco Lucky	\N	2.500	125.0000	2026-09-08 21:05:02.314	2026-09-08 21:05:02.314
395b1725-2206-411b-920a-d9eea53ce79f	09f4deb9-88c4-4f62-a1a1-759db5bc2840	7270809e-5f98-48a2-aa46-a99bf4455bb3	Glicerina	\N	3.000	150.0000	2026-09-08 21:05:02.314	2026-09-08 21:05:02.314
5078ca3c-e851-4d1b-afab-b5a7cdf14812	09f4deb9-88c4-4f62-a1a1-759db5bc2840	9c3c9b3b-7eef-4d3c-bc51-df944f79b354	Alcohol extra neutro 96%	\N	5.000	250.0000	2026-09-08 21:05:02.314	2026-09-08 21:05:02.314
c8d8116d-5dfe-4ecb-8726-995253a87eca	1767f862-c56e-4d0e-8741-ed284ab0a975	c2cce8b2-2bdb-4752-b8a0-946e94b14e19	Agua desionizada	\N	83.050	11627.0000	2026-09-08 21:05:02.314	2026-09-08 21:05:02.314
7f827acd-505b-45da-8a23-be9d36a1f006	1767f862-c56e-4d0e-8741-ed284ab0a975	8849ff42-8f1d-4bb7-9b63-154fb2a329d3	Alcohol cetilico	\N	5.500	770.0000	2026-09-08 21:05:02.314	2026-09-08 21:05:02.314
4dd697b7-1a14-4f95-8fea-e7e99d807d3c	1767f862-c56e-4d0e-8741-ed284ab0a975	a7931626-b6ab-450d-b7e8-484d773cf1aa	Dehyquart	\N	5.500	770.0000	2026-09-08 21:05:02.314	2026-09-08 21:05:02.314
9d869c06-fca7-419a-9bd9-4c97a22d819c	1767f862-c56e-4d0e-8741-ed284ab0a975	f5c778e9-bbfc-4fef-aa32-9b32a6db83c7	Aceite de ricino	\N	2.000	280.0000	2026-09-08 21:05:02.314	2026-09-08 21:05:02.314
ef4625fc-c3a8-401e-8204-3d7296aa2767	1767f862-c56e-4d0e-8741-ed284ab0a975	af5ed9d6-a35f-4f15-bad4-9f834901d8c0	Colageno hidrolizado	\N	1.000	140.0000	2026-09-08 21:05:02.314	2026-09-08 21:05:02.314
c13e252e-5b19-4b97-9e36-272e2664fd2e	1767f862-c56e-4d0e-8741-ed284ab0a975	2f50dca2-668f-4a53-975e-e95116d7442f	Extracto de centella asiatica	\N	0.500	70.0000	2026-09-08 21:05:02.314	2026-09-08 21:05:02.314
5d63242c-918a-4cb3-a3f6-7e55dd7c6988	1767f862-c56e-4d0e-8741-ed284ab0a975	dd11ade7-d444-49e4-9490-35179c4132cc	Acido hialuronico	\N	0.050	7.0000	2026-09-08 21:05:02.314	2026-09-08 21:05:02.314
7cd7f335-6b91-48ec-a528-38f84918deb0	1767f862-c56e-4d0e-8741-ed284ab0a975	7270809e-5f98-48a2-aa46-a99bf4455bb3	Glicerina	\N	2.000	280.0000	2026-09-08 21:05:02.314	2026-09-08 21:05:02.314
d538504d-0e4c-4989-9c97-cbb836f21e9c	1767f862-c56e-4d0e-8741-ed284ab0a975	d84cba5d-96a8-432f-a27c-650a3da49cd1	Procide CG	\N	0.200	28.0000	2026-09-08 21:05:02.314	2026-09-08 21:05:02.314
aefcf93d-b3bc-4298-994e-7aae5bb2858a	1767f862-c56e-4d0e-8741-ed284ab0a975	2ba29423-debf-4d28-ba08-1f42cbb64ace	Fragancia vainilla	\N	0.200	28.0000	2026-09-08 21:05:02.314	2026-09-08 21:05:02.314
2be99be9-052b-4917-a5bc-b4b788841947	3efa86f9-0038-4e71-8b81-06027b636880	ab9438b3-e9d8-4b33-a5c8-da547e7b5024	Vaselina liquida	\N	78.500	3925.0000	2026-09-08 21:05:02.314	2026-09-08 21:05:02.314
2ad1f8e3-8624-468b-88d1-b2b00185f81b	3efa86f9-0038-4e71-8b81-06027b636880	fe8c6e9a-f4ee-4a9a-ba58-d91f49425757	Cera de abeja virgen	\N	10.000	500.0000	2026-09-08 21:05:02.314	2026-09-08 21:05:02.314
cdc7d2f4-b1d3-4224-bb9d-efba77bb08c1	3efa86f9-0038-4e71-8b81-06027b636880	23e5d25d-db99-47d2-8c2b-788174388397	Cera carnauba	\N	8.000	400.0000	2026-09-08 21:05:02.314	2026-09-08 21:05:02.314
0b0585c7-af29-4dbe-99c9-eaca8f3e0c74	3efa86f9-0038-4e71-8b81-06027b636880	8849ff42-8f1d-4bb7-9b63-154fb2a329d3	Alcohol cetilico	\N	3.000	150.0000	2026-09-08 21:05:02.314	2026-09-08 21:05:02.314
0b25cf5b-e963-4fab-b452-ac01e327fea7	3efa86f9-0038-4e71-8b81-06027b636880	ebfcccbb-22c9-468d-8ee7-f7cdb8cacdb8	Vitamina E	\N	0.100	5.0000	2026-09-08 21:05:02.314	2026-09-08 21:05:02.314
814aa985-d2f9-49da-b3de-464b3e639f9c	3efa86f9-0038-4e71-8b81-06027b636880	cdf61ea3-02c1-4b78-94c4-178398121a4a	Dioxido de titanio	\N	0.200	10.0000	2026-09-08 21:05:02.314	2026-09-08 21:05:02.314
33cf135c-bcc2-4e90-88f7-61d29e1ec612	3efa86f9-0038-4e71-8b81-06027b636880	c2ffefaf-b4c6-4846-94f3-3ecc4f91c466	Fragancia rosas	\N	0.200	10.0000	2026-09-08 21:05:02.314	2026-09-08 21:05:02.314
05d6821f-5df8-4da9-9771-5fe0e3562606	df60ec2d-029b-4188-866d-15bd8bbe4742	c2cce8b2-2bdb-4752-b8a0-946e94b14e19	Agua desionizada	\N	88.483	6223.0000	2026-09-08 21:05:02.314	2026-09-08 21:05:02.314
d66430af-b7a9-42fb-9a54-23641ad6b055	df60ec2d-029b-4188-866d-15bd8bbe4742	7270809e-5f98-48a2-aa46-a99bf4455bb3	Glicerina	\N	4.977	350.0000	2026-09-08 21:05:02.314	2026-09-08 21:05:02.314
1406a6a1-5a99-4c32-8388-004b53724183	df60ec2d-029b-4188-866d-15bd8bbe4742	644113e7-6761-492f-a55e-a359c795c5f8	Propilenglicol	\N	2.986	210.0000	2026-09-08 21:05:02.314	2026-09-08 21:05:02.314
0525c8ec-eabe-41a0-a3de-6a3dab06cff5	df60ec2d-029b-4188-866d-15bd8bbe4742	eed50ae4-682c-4b3a-9fc6-27b3f992b26e	D-Pantenol o Pantenol	\N	0.100	7.0000	2026-09-08 21:05:02.314	2026-09-08 21:05:02.314
46cfa26d-153d-4dfa-b240-93c3eacd0673	df60ec2d-029b-4188-866d-15bd8bbe4742	876f54db-7e02-40f9-917d-94ac8bd2d198	Extracto de aloe vera	\N	0.995	70.0000	2026-09-08 21:05:02.314	2026-09-08 21:05:02.314
14d44bda-3613-4de4-adcf-0e6b211cf7d5	df60ec2d-029b-4188-866d-15bd8bbe4742	97f87364-f00c-472b-a9dd-5ce36244afb4	Niacinamida vitamina B3	\N	0.100	7.0000	2026-09-08 21:05:02.314	2026-09-08 21:05:02.314
5936f4b3-d9b6-4ea3-895b-9b36b5f20852	df60ec2d-029b-4188-866d-15bd8bbe4742	4b5b2284-c252-486b-a8cd-0e2cb39c9928	Cellosize	\N	1.095	77.0000	2026-09-08 21:05:02.314	2026-09-08 21:05:02.314
8c95787a-f79d-4cee-bb91-f23478faa772	df60ec2d-029b-4188-866d-15bd8bbe4742	84c02891-72ff-44f5-8767-75e1b79ec02e	Trietanolamina (TEA)	\N	1.095	77.0000	2026-09-08 21:05:02.314	2026-09-08 21:05:02.314
f53697dd-b5bd-424b-aa5b-ee7cdf245914	df60ec2d-029b-4188-866d-15bd8bbe4742	70b59b91-2a38-4cb5-956f-93204a095553	Fragancia mil flores	\N	0.014	1.0000	2026-09-08 21:05:02.314	2026-09-08 21:05:02.314
c1b6f7e0-407d-4b2e-9dce-22f43b5b3545	df60ec2d-029b-4188-866d-15bd8bbe4742	503a47d1-8230-410a-bbd1-b76b0a91ba24	Benzoato	\N	0.100	7.0000	2026-09-08 21:05:02.314	2026-09-08 21:05:02.314
e6fc42bb-9898-4e0e-b315-8259e06c4fb8	df60ec2d-029b-4188-866d-15bd8bbe4742	3b682c2c-c7a5-426b-b223-32e792196c98	Sorbato de potasio	\N	0.057	4.0000	2026-09-08 21:05:02.314	2026-09-08 21:05:02.314
6e148741-61c1-4b80-9031-5345c47b3304	bb3c0eee-185e-4555-865d-db3d233b795e	c2cce8b2-2bdb-4752-b8a0-946e94b14e19	Agua desionizada	\N	85.800	4290.0000	2026-09-09 17:07:02.376	2026-09-09 17:07:02.376
eee54dd1-0cff-4dbb-8248-d4de7d7572b1	bb3c0eee-185e-4555-865d-db3d233b795e	7270809e-5f98-48a2-aa46-a99bf4455bb3	Glicerina	\N	4.000	200.0000	2026-09-09 17:07:02.376	2026-09-09 17:07:02.376
b714fbd5-3300-4652-99e9-e318f188c969	bb3c0eee-185e-4555-865d-db3d233b795e	644113e7-6761-492f-a55e-a359c795c5f8	Propilenglicol	\N	3.000	150.0000	2026-09-09 17:07:02.376	2026-09-09 17:07:02.376
13642187-de2f-40ee-bd91-0cea7de6adfc	bb3c0eee-185e-4555-865d-db3d233b795e	4b5b2284-c252-486b-a8cd-0e2cb39c9928	Cellosize	\N	0.800	40.0000	2026-09-09 17:07:02.376	2026-09-09 17:07:02.376
e42398e4-4c4b-4616-8f72-30c6ce9dc786	bb3c0eee-185e-4555-865d-db3d233b795e	84c02891-72ff-44f5-8767-75e1b79ec02e	Trietanolamina (TEA)	\N	0.800	40.0000	2026-09-09 17:07:02.376	2026-09-09 17:07:02.376
a18703a3-a898-41e4-ae31-0b7957969950	bb3c0eee-185e-4555-865d-db3d233b795e	af5ed9d6-a35f-4f15-bad4-9f834901d8c0	Colageno hidrolizado	\N	2.000	100.0000	2026-09-09 17:07:02.376	2026-09-09 17:07:02.376
96b24daa-c5bd-4df9-88a6-b17b39ac8cc0	bb3c0eee-185e-4555-865d-db3d233b795e	eed50ae4-682c-4b3a-9fc6-27b3f992b26e	Pantenol	\N	1.000	50.0000	2026-09-09 17:07:02.376	2026-09-09 17:07:02.376
fda3509d-9aa9-4895-a763-c329d78120b3	bb3c0eee-185e-4555-865d-db3d233b795e	97f87364-f00c-472b-a9dd-5ce36244afb4	Niacinamida	\N	2.000	100.0000	2026-09-09 17:07:02.376	2026-09-09 17:07:02.376
71aefc4a-4649-48cb-bbee-a6573f684d2d	bb3c0eee-185e-4555-865d-db3d233b795e	503a47d1-8230-410a-bbd1-b76b0a91ba24	Benzoato de sodio	\N	0.200	10.0000	2026-09-09 17:07:02.376	2026-09-09 17:07:02.376
0197cfe5-7276-4df3-a2dd-48b1f9a817c7	bb3c0eee-185e-4555-865d-db3d233b795e	3b682c2c-c7a5-426b-b223-32e792196c98	Sorbato de potasio	\N	0.100	5.0000	2026-09-09 17:07:02.376	2026-09-09 17:07:02.376
cf214e0f-8f33-45af-bc0f-bfb1ab13b68b	bb3c0eee-185e-4555-865d-db3d233b795e	b0e49e23-1edc-4ec2-b265-189ebe472eac	Polisorbato 20	\N	0.100	5.0000	2026-09-09 17:07:02.376	2026-09-09 17:07:02.376
29071e80-fc04-4761-89a8-6f85f2ee6c8e	bb3c0eee-185e-4555-865d-db3d233b795e	2ba29423-debf-4d28-ba08-1f42cbb64ace	Fragancia vainilla	\N	0.050	2.5000	2026-09-09 17:07:02.376	2026-09-09 17:07:02.376
d0bb4f40-1313-4056-b5c4-3daed9695295	bb3c0eee-185e-4555-865d-db3d233b795e	2585af84-0476-44c1-bddd-6569609dea26	Acido citrico	\N	0.100	5.0000	2026-09-09 17:07:02.376	2026-09-09 17:07:02.376
7be94ea0-f467-49a8-b03c-39f6d85cd4b7	2fcd4746-8c81-4b18-a513-6933fc66784c	c2cce8b2-2bdb-4752-b8a0-946e94b14e19	\N	\N	91.100	911.0000	2026-09-07 19:25:53.708	2026-09-07 19:25:53.708
4bb4c851-c3eb-4c71-a08f-3a653c1be349	2fcd4746-8c81-4b18-a513-6933fc66784c	4b5b2284-c252-486b-a8cd-0e2cb39c9928	\N	\N	0.800	8.0000	2026-09-07 19:25:53.714	2026-09-07 19:25:53.714
93a2cbae-b636-40bd-988f-f3fffe419d15	2fcd4746-8c81-4b18-a513-6933fc66784c	38e6de16-a266-4f3f-9a75-b9c059a0531a	\N	\N	2.000	20.0000	2026-09-07 19:25:53.717	2026-09-07 19:25:53.717
db820379-932b-40fa-8251-9080384f81dc	2fcd4746-8c81-4b18-a513-6933fc66784c	7270809e-5f98-48a2-aa46-a99bf4455bb3	\N	\N	5.000	50.0000	2026-09-07 19:25:53.722	2026-09-07 19:25:53.722
6a3509fc-c4c0-48a3-ad99-2733bf6ad31e	2fcd4746-8c81-4b18-a513-6933fc66784c	84c02891-72ff-44f5-8767-75e1b79ec02e	\N	\N	0.800	8.0000	2026-09-07 19:25:53.727	2026-09-07 19:25:53.727
91c18e9d-2bb2-4262-9846-83f8890ed745	2fcd4746-8c81-4b18-a513-6933fc66784c	503a47d1-8230-410a-bbd1-b76b0a91ba24	\N	\N	0.100	1.0000	2026-09-07 19:25:53.732	2026-09-07 19:25:53.732
5e33773e-d99b-4ed5-a77d-183821c9bd4b	2fcd4746-8c81-4b18-a513-6933fc66784c	3b682c2c-c7a5-426b-b223-32e792196c98	\N	\N	0.050	0.5000	2026-09-07 19:25:53.737	2026-09-07 19:25:53.737
2f5903ae-38b1-4d2b-b017-daf8d239758f	2fcd4746-8c81-4b18-a513-6933fc66784c	9c3c9b3b-7eef-4d3c-bc51-df944f79b354	\N	\N	0.100	1.0000	2026-09-07 19:25:53.741	2026-09-07 19:25:53.741
211ed25d-7114-4d92-8959-5617ab59ca4d	281140ac-def3-4db6-964c-a7bad6a2ca74	c2cce8b2-2bdb-4752-b8a0-946e94b14e19	\N	\N	92.000	920.0000	2026-09-07 19:25:53.79	2026-09-07 19:25:53.79
e811c239-892a-40f0-ac62-6dd77df0e4c8	281140ac-def3-4db6-964c-a7bad6a2ca74	2556b4df-e535-47b5-bfcb-a34622f6f0fe	\N	\N	1.200	12.0000	2026-09-07 19:25:53.794	2026-09-07 19:25:53.794
a5790c58-b5bb-4cb0-a3ca-58d691feec31	281140ac-def3-4db6-964c-a7bad6a2ca74	503a47d1-8230-410a-bbd1-b76b0a91ba24	\N	\N	0.200	2.0000	2026-09-07 19:25:53.797	2026-09-07 19:25:53.797
3690eab1-0385-44cf-a11c-a91eea4b1837	281140ac-def3-4db6-964c-a7bad6a2ca74	3b682c2c-c7a5-426b-b223-32e792196c98	\N	\N	0.200	2.0000	2026-09-07 19:25:53.802	2026-09-07 19:25:53.802
7480e749-97fc-46dc-a94f-2d791def25ec	281140ac-def3-4db6-964c-a7bad6a2ca74	84c02891-72ff-44f5-8767-75e1b79ec02e	\N	\N	1.200	12.0000	2026-09-07 19:25:53.806	2026-09-07 19:25:53.806
df3483e1-8332-4a62-87e2-a5c9cc88761c	281140ac-def3-4db6-964c-a7bad6a2ca74	7270809e-5f98-48a2-aa46-a99bf4455bb3	\N	\N	5.000	50.0000	2026-09-07 19:25:53.81	2026-09-07 19:25:53.81
021e0173-a1d8-408f-b462-30b638dc6dfa	281140ac-def3-4db6-964c-a7bad6a2ca74	d84cba5d-96a8-432f-a27c-650a3da49cd1	\N	\N	0.200	2.0000	2026-09-07 19:25:53.813	2026-09-07 19:25:53.813
39bebd50-0c85-46ee-9eba-5bbd0ea421eb	281140ac-def3-4db6-964c-a7bad6a2ca74	205dcb75-c01e-4312-9fc8-05d1cce9081d	\N	\N	25.000	250.0000	2026-09-07 19:25:53.818	2026-09-07 19:25:53.818
304c62da-1023-478f-85e2-73a4636eee8b	3754d35c-a138-4a18-9544-78120075ee59	c2cce8b2-2bdb-4752-b8a0-946e94b14e19	\N	\N	97.000	970.0000	2026-09-07 19:25:53.825	2026-09-07 19:25:53.825
b622cd23-6736-4dd3-bd31-5b17237362b6	3754d35c-a138-4a18-9544-78120075ee59	13b13800-6679-4749-96e9-bc034236f7a9	\N	\N	3.000	30.0000	2026-09-07 19:25:53.828	2026-09-07 19:25:53.828
41c20558-e81a-4ad3-a1a1-bc851153ad11	3754d35c-a138-4a18-9544-78120075ee59	7270809e-5f98-48a2-aa46-a99bf4455bb3	\N	\N	3.000	30.0000	2026-09-07 19:25:53.832	2026-09-07 19:25:53.832
70e905da-c948-448e-a01c-d92dcfb076fc	3754d35c-a138-4a18-9544-78120075ee59	c488a9b9-fe87-4cf8-91be-2eceb65198ac	\N	\N	0.200	2.0000	2026-09-07 19:25:53.837	2026-09-07 19:25:53.837
83865df7-3166-4595-af2a-76093f5a58f1	9406a8fa-3e2e-4542-87d2-bd67ecfe72ea	ab9438b3-e9d8-4b33-a5c8-da547e7b5024	\N	\N	99.000	990.0000	2026-09-07 19:25:53.845	2026-09-07 19:25:53.845
cb0135f7-a8d3-4298-b5a6-29f4198f04c3	9406a8fa-3e2e-4542-87d2-bd67ecfe72ea	6b741b7a-554a-4624-966a-1e311d24e2b5	\N	\N	0.500	5.0000	2026-09-07 19:25:53.849	2026-09-07 19:25:53.849
ba8a2d3b-c4ff-4b61-a149-276ac31a205e	9406a8fa-3e2e-4542-87d2-bd67ecfe72ea	dc1761ba-bf39-41fc-bc4d-e48b3e2e1114	\N	\N	0.500	5.0000	2026-09-07 19:25:53.854	2026-09-07 19:25:53.854
e0ead4c1-82ba-4da3-9a81-cc33c528ff48	23fc0017-6691-46ac-a72d-7727d5b615bd	0f97527f-a304-4d88-b05d-69992d0c3d10	\N	\N	10.000	100.0000	2026-09-07 19:25:53.932	2026-09-07 19:25:53.932
37e89e43-ce6f-464f-8957-c294acc4cc81	23fc0017-6691-46ac-a72d-7727d5b615bd	d8e03fdc-63d8-4b9f-b5b1-0a18bf5eeca2	\N	\N	5.000	50.0000	2026-09-07 19:25:53.935	2026-09-07 19:25:53.935
b21a39b0-b6b1-43dd-90aa-706f71cbeebf	23fc0017-6691-46ac-a72d-7727d5b615bd	5e2bd04b-d8b5-4cf2-a30b-b7bc690f5b38	\N	\N	84.700	847.0000	2026-09-07 19:25:53.939	2026-09-07 19:25:53.939
4dc8f0e9-d655-4218-9b21-a4f2dddc74ec	9df24ff9-f7ed-471d-98a7-a6e64e6b3da2	9c3c9b3b-7eef-4d3c-bc51-df944f79b354	\N	\N	62.000	620.0000	2026-09-07 19:25:53.944	2026-09-07 19:25:53.944
ef069c74-1093-4ffd-8839-f8e7680d5b43	9df24ff9-f7ed-471d-98a7-a6e64e6b3da2	7270809e-5f98-48a2-aa46-a99bf4455bb3	\N	\N	8.000	80.0000	2026-09-07 19:25:53.947	2026-09-07 19:25:53.947
3c3db107-7423-4c75-b5cb-3dfa04123888	9df24ff9-f7ed-471d-98a7-a6e64e6b3da2	7d898dec-8922-4f4f-9155-4e18489b1c18	\N	\N	0.200	2.0000	2026-09-07 19:25:53.95	2026-09-07 19:25:53.95
990e394e-fed1-40e6-a8d3-8c6f5dfd1b92	9df24ff9-f7ed-471d-98a7-a6e64e6b3da2	eb1bf31e-ba99-443b-aa07-7410e56da07f	\N	\N	0.200	2.0000	2026-09-07 19:25:53.954	2026-09-07 19:25:53.954
7c562177-f04f-4464-8cc9-a3accce24e6b	9df24ff9-f7ed-471d-98a7-a6e64e6b3da2	d43e9dda-d68f-4b16-b725-9deb616065eb	\N	\N	0.200	2.0000	2026-09-07 19:25:53.958	2026-09-07 19:25:53.958
b55c10f0-1b09-401f-b01b-5358e677ecdd	9df24ff9-f7ed-471d-98a7-a6e64e6b3da2	7daf0270-a064-4bea-9618-c3df739cc6d0	\N	\N	15.000	150.0000	2026-09-07 19:25:53.962	2026-09-07 19:25:53.962
6a638420-74a7-4212-a5e5-9fde8dafb234	9df24ff9-f7ed-471d-98a7-a6e64e6b3da2	c2cce8b2-2bdb-4752-b8a0-946e94b14e19	\N	\N	14.400	144.0000	2026-09-07 19:25:53.966	2026-09-07 19:25:53.966
3589b8fa-cbe3-4000-975f-3b2f07ed84f5	199fed75-1305-4e0c-acd8-4dc190b78213	30cf86b6-2954-426c-b4b7-8cb60d97af51	\N	\N	2.000	20.0000	2026-09-07 19:25:53.99	2026-09-07 19:25:53.99
d03ef9a4-5752-45d4-afb6-310b1506e620	199fed75-1305-4e0c-acd8-4dc190b78213	23e5d25d-db99-47d2-8c2b-788174388397	\N	\N	1.500	15.0000	2026-09-07 19:25:53.994	2026-09-07 19:25:53.994
2667ae3c-231f-4b86-8860-b03ffae288aa	199fed75-1305-4e0c-acd8-4dc190b78213	fe8c6e9a-f4ee-4a9a-ba58-d91f49425757	\N	\N	1.000	10.0000	2026-09-07 19:25:53.997	2026-09-07 19:25:53.997
837a7717-bea4-4ba8-bcaf-3ec59a2b5bd0	199fed75-1305-4e0c-acd8-4dc190b78213	e5c39f4b-b2ee-4e21-ab5d-6b2ae5a3b0d5	\N	\N	1.000	10.0000	2026-09-07 19:25:54.001	2026-09-07 19:25:54.001
0cf43872-db5f-40de-930b-42c62983d471	199fed75-1305-4e0c-acd8-4dc190b78213	5e8073ff-fb40-4c07-be68-aaefc8201395	\N	\N	0.100	1.0000	2026-09-07 19:25:54.006	2026-09-07 19:25:54.006
df777a15-dac0-4659-96a0-7e1476e4fdfd	199fed75-1305-4e0c-acd8-4dc190b78213	c2cce8b2-2bdb-4752-b8a0-946e94b14e19	\N	\N	94.150	941.5000	2026-09-07 19:25:54.01	2026-09-07 19:25:54.01
b0968470-55ef-4ea9-ad47-487c6a6c1dd4	195d42cd-b05b-48f4-b4d6-4583a604ab29	58e3cd43-5211-4861-8e62-a3e6b4440b70	\N	\N	3.000	30.0000	2026-09-07 19:25:54.015	2026-09-07 19:25:54.015
65d4cd57-14a9-443f-9e3d-ec6ef4e02adb	195d42cd-b05b-48f4-b4d6-4583a604ab29	94c02ea6-ae0e-4013-aaca-a846e02c8659	\N	\N	0.500	5.0000	2026-09-07 19:25:54.02	2026-09-07 19:25:54.02
828887fe-f141-467b-990f-30dda2797c2a	195d42cd-b05b-48f4-b4d6-4583a604ab29	c2cce8b2-2bdb-4752-b8a0-946e94b14e19	\N	\N	95.150	951.5000	2026-09-07 19:25:54.024	2026-09-07 19:25:54.024
ef364ff2-7fed-4deb-ac19-143caa33c152	195d42cd-b05b-48f4-b4d6-4583a604ab29	7454fb85-f4a4-4987-8d95-053d98414a77	\N	\N	0.900	9.0000	2026-09-07 19:25:54.027	2026-09-07 19:25:54.027
52b17cc0-3bd2-4ead-8b8b-8c1838ea2bdd	195d42cd-b05b-48f4-b4d6-4583a604ab29	503a47d1-8230-410a-bbd1-b76b0a91ba24	\N	\N	0.100	1.0000	2026-09-07 19:25:54.031	2026-09-07 19:25:54.031
4f0e1606-a188-4d3c-a87a-e67dc867b527	195d42cd-b05b-48f4-b4d6-4583a604ab29	3b682c2c-c7a5-426b-b223-32e792196c98	\N	\N	0.050	0.5000	2026-09-07 19:25:54.034	2026-09-07 19:25:54.034
8fc20bb7-7671-4391-82ea-19a95f949e14	30615099-25ff-46c8-bf72-f8d5ac474851	c2cce8b2-2bdb-4752-b8a0-946e94b14e19	\N	\N	80.750	807.5000	2026-09-07 19:25:54.041	2026-09-07 19:25:54.041
6bbe091c-717c-401d-a689-3804f45a2d16	30615099-25ff-46c8-bf72-f8d5ac474851	8849ff42-8f1d-4bb7-9b63-154fb2a329d3	\N	\N	7.000	70.0000	2026-09-07 19:25:54.045	2026-09-07 19:25:54.045
9101ae1e-eb63-4c96-85e7-6fe68d7f9dca	30615099-25ff-46c8-bf72-f8d5ac474851	a7931626-b6ab-450d-b7e8-484d773cf1aa	\N	\N	7.000	70.0000	2026-09-07 19:25:54.048	2026-09-07 19:25:54.048
0236a6dd-8420-4614-ac61-5f8ac7b413c9	30615099-25ff-46c8-bf72-f8d5ac474851	0b0e329a-b9ae-48f1-9d13-65ffb8295b6e	\N	\N	3.000	30.0000	2026-09-07 19:25:54.052	2026-09-07 19:25:54.052
16051c04-8f2c-4ab4-8485-f2d08fcd5493	30615099-25ff-46c8-bf72-f8d5ac474851	af5ed9d6-a35f-4f15-bad4-9f834901d8c0	\N	\N	1.000	10.0000	2026-09-07 19:25:54.056	2026-09-07 19:25:54.056
6d8feff6-b7aa-45ab-bbf7-b3129896b3f2	30615099-25ff-46c8-bf72-f8d5ac474851	59b5bd63-1199-4880-90d9-519213f9b67d	\N	\N	0.100	1.0000	2026-09-07 19:25:54.06	2026-09-07 19:25:54.06
a5beb154-07e7-4dee-bf4f-134145d1b7e1	30615099-25ff-46c8-bf72-f8d5ac474851	7270809e-5f98-48a2-aa46-a99bf4455bb3	\N	\N	1.000	10.0000	2026-09-07 19:25:54.064	2026-09-07 19:25:54.064
98391138-3a18-4a4c-9bc7-04c84e35d7dc	30615099-25ff-46c8-bf72-f8d5ac474851	503a47d1-8230-410a-bbd1-b76b0a91ba24	\N	\N	0.100	1.0000	2026-09-07 19:25:54.068	2026-09-07 19:25:54.068
9d9524ce-dcf2-48d2-afcb-b83ef2fa64a0	30615099-25ff-46c8-bf72-f8d5ac474851	3b682c2c-c7a5-426b-b223-32e792196c98	\N	\N	0.050	0.5000	2026-09-07 19:25:54.072	2026-09-07 19:25:54.072
866423ca-fe1f-4998-a8da-7d5392d76bcb	0c2eaddd-088e-49a5-be6d-30ed489f1d4e	9c3c9b3b-7eef-4d3c-bc51-df944f79b354	\N	\N	87.500	875.0000	2026-09-07 19:25:54.077	2026-09-07 19:25:54.077
7179e80c-2973-42b0-958c-2f59ee939d41	0c2eaddd-088e-49a5-be6d-30ed489f1d4e	f0cbaabe-0290-42b3-a5a2-d637cb5c584f	\N	\N	1.000	10.0000	2026-09-07 19:25:54.081	2026-09-07 19:25:54.081
5ac17720-06af-473b-93bd-de40a14e2775	0c2eaddd-088e-49a5-be6d-30ed489f1d4e	12b82ba7-09a5-43b6-a754-56abcb77a4cc	\N	\N	1.000	10.0000	2026-09-07 19:25:54.085	2026-09-07 19:25:54.085
877d9d95-4175-4cd0-852b-89ae689f413b	0c2eaddd-088e-49a5-be6d-30ed489f1d4e	2a7330af-31b4-4c6f-acf7-ba076bc22aab	\N	\N	0.500	5.0000	2026-09-07 19:25:54.089	2026-09-07 19:25:54.089
c9031d7e-91da-47b9-b5bb-0ebfff5233c1	0c2eaddd-088e-49a5-be6d-30ed489f1d4e	c2cce8b2-2bdb-4752-b8a0-946e94b14e19	\N	\N	10.000	100.0000	2026-09-07 19:25:54.093	2026-09-07 19:25:54.093
d1f4fc72-50b1-4fa9-b27f-7c298e117bcb	1cdda722-2d1e-4f9d-b4e9-8234dfbef6a3	8587e682-2575-4153-9ad6-ebd98e42db27	\N	\N	0.100	1.0000	2026-09-07 19:25:54.098	2026-09-07 19:25:54.098
f7f49b34-5629-4011-bdbd-e001f265a119	1cdda722-2d1e-4f9d-b4e9-8234dfbef6a3	6f4a88eb-353d-4c06-8725-7fe107f32668	\N	\N	10.000	100.0000	2026-09-07 19:25:54.103	2026-09-07 19:25:54.103
2816804d-69da-46cb-892b-adc95386b2ec	1cdda722-2d1e-4f9d-b4e9-8234dfbef6a3	d84cba5d-96a8-432f-a27c-650a3da49cd1	\N	\N	0.100	1.0000	2026-09-07 19:25:54.107	2026-09-07 19:25:54.107
0a11ad5a-0601-4ba5-85ad-d49a570d6639	1cdda722-2d1e-4f9d-b4e9-8234dfbef6a3	22fabeae-a648-4909-8618-c6e6704ba256	\N	\N	5.000	50.0000	2026-09-07 19:25:54.11	2026-09-07 19:25:54.11
30a7663b-0c0f-4d66-9a1a-d307aac7f472	1cdda722-2d1e-4f9d-b4e9-8234dfbef6a3	2585af84-0476-44c1-bddd-6569609dea26	\N	\N	0.400	4.0000	2026-09-07 19:25:54.113	2026-09-07 19:25:54.113
daee33f4-af76-4377-883b-ad5a7c772243	1cdda722-2d1e-4f9d-b4e9-8234dfbef6a3	6e4a171c-6eb7-4f4d-b3af-b2d380335061	\N	\N	3.000	30.0000	2026-09-07 19:25:54.117	2026-09-07 19:25:54.117
3e4cfb1b-ab91-4c84-a4f0-8fa8b429ec99	1cdda722-2d1e-4f9d-b4e9-8234dfbef6a3	c2cce8b2-2bdb-4752-b8a0-946e94b14e19	\N	\N	81.300	813.0000	2026-09-07 19:25:54.121	2026-09-07 19:25:54.121
140d3619-e448-43ce-8f37-df9dde9a51f9	c37e5ccc-3f42-42d9-9ba2-0e1b648962ef	13b13800-6679-4749-96e9-bc034236f7a9	\N	\N	3.000	30.0000	2026-09-07 19:25:54.126	2026-09-07 19:25:54.126
fc219408-ac00-49f8-a194-bf55d85a7853	c37e5ccc-3f42-42d9-9ba2-0e1b648962ef	c2cce8b2-2bdb-4752-b8a0-946e94b14e19	\N	\N	97.000	970.0000	2026-09-07 19:25:54.129	2026-09-07 19:25:54.129
1a585c0d-aefb-45be-bdf5-70ba0c98607d	c37e5ccc-3f42-42d9-9ba2-0e1b648962ef	7270809e-5f98-48a2-aa46-a99bf4455bb3	\N	\N	3.000	30.0000	2026-09-07 19:25:54.132	2026-09-07 19:25:54.132
11a36e7e-4a52-4e29-a1bc-f427f7e08172	c37e5ccc-3f42-42d9-9ba2-0e1b648962ef	c488a9b9-fe87-4cf8-91be-2eceb65198ac	\N	\N	0.200	2.0000	2026-09-07 19:25:54.137	2026-09-07 19:25:54.137
652e47ae-06f9-47a6-8903-3e8cedf110b5	21a73464-7053-4414-97c2-20b27ff83606	ab9438b3-e9d8-4b33-a5c8-da547e7b5024	\N	\N	98.300	983.0000	2026-09-07 19:25:54.178	2026-09-07 19:25:54.178
8d2bdb8f-4f78-438d-a996-786ae8d710ce	21a73464-7053-4414-97c2-20b27ff83606	3d1b2079-8e4f-455f-ba1d-71ed13bb38ed	\N	\N	1.500	15.0000	2026-09-07 19:25:54.181	2026-09-07 19:25:54.181
a5219d2b-a0dc-42cf-8b2e-af90f11fd7e1	21a73464-7053-4414-97c2-20b27ff83606	ebfcccbb-22c9-468d-8ee7-f7cdb8cacdb8	\N	\N	0.200	2.0000	2026-09-07 19:25:54.185	2026-09-07 19:25:54.185
232ce3b8-30f4-4693-8a89-8738f30ac241	b8fd598f-5641-4fc3-b3a1-58d5441f1112	9c3c9b3b-7eef-4d3c-bc51-df944f79b354	\N	\N	62.000	620.0000	2026-09-07 19:25:54.191	2026-09-07 19:25:54.191
e02034ab-0e17-4aaf-8897-edbd25e87d31	b8fd598f-5641-4fc3-b3a1-58d5441f1112	7270809e-5f98-48a2-aa46-a99bf4455bb3	\N	\N	8.000	80.0000	2026-09-07 19:25:54.195	2026-09-07 19:25:54.195
9f25c6bb-ef10-4aea-869a-033ef4eaf70c	b8fd598f-5641-4fc3-b3a1-58d5441f1112	7d898dec-8922-4f4f-9155-4e18489b1c18	\N	\N	0.200	2.0000	2026-09-07 19:25:54.198	2026-09-07 19:25:54.198
a6f2a19d-a66f-4d12-8ac5-13550465cee9	b8fd598f-5641-4fc3-b3a1-58d5441f1112	eb1bf31e-ba99-443b-aa07-7410e56da07f	\N	\N	0.200	2.0000	2026-09-07 19:25:54.202	2026-09-07 19:25:54.202
f36e9a3e-2ec1-4656-abf1-dbaefb550ffa	b8fd598f-5641-4fc3-b3a1-58d5441f1112	d43e9dda-d68f-4b16-b725-9deb616065eb	\N	\N	0.200	2.0000	2026-09-07 19:25:54.206	2026-09-07 19:25:54.206
5b3af7bb-1c92-4976-aa5a-0cbae2aa5329	b8fd598f-5641-4fc3-b3a1-58d5441f1112	81695ca9-b07a-4264-9e64-f007fa8f6c42	\N	\N	15.000	150.0000	2026-09-07 19:25:54.209	2026-09-07 19:25:54.209
1230e5c8-b928-4411-abdf-9da4c4f34cb7	b8fd598f-5641-4fc3-b3a1-58d5441f1112	c2cce8b2-2bdb-4752-b8a0-946e94b14e19	\N	\N	14.400	144.0000	2026-09-07 19:25:54.212	2026-09-07 19:25:54.212
6c44feb2-827e-4ad4-9807-b85862039c1e	04d5fe44-9f1a-4dd8-9e0b-261153744151	c2cce8b2-2bdb-4752-b8a0-946e94b14e19	\N	\N	82.200	822.0000	2026-09-07 19:25:54.217	2026-09-07 19:25:54.217
5b5d94fe-0037-419e-9a6b-24405c60d080	04d5fe44-9f1a-4dd8-9e0b-261153744151	8849ff42-8f1d-4bb7-9b63-154fb2a329d3	\N	\N	7.000	70.0000	2026-09-07 19:25:54.222	2026-09-07 19:25:54.222
3b3f6e75-e4ed-41bc-92a3-f5b0c377d725	04d5fe44-9f1a-4dd8-9e0b-261153744151	a7931626-b6ab-450d-b7e8-484d773cf1aa	\N	\N	7.000	70.0000	2026-09-07 19:25:54.226	2026-09-07 19:25:54.226
742f76a0-3de7-44a4-991d-6e6dd1e9fd95	04d5fe44-9f1a-4dd8-9e0b-261153744151	0f97527f-a304-4d88-b05d-69992d0c3d10	\N	\N	3.000	30.0000	2026-09-07 19:25:54.229	2026-09-07 19:25:54.229
b3e4b6f2-69b5-40f4-a8bd-f5aae5239eb4	04d5fe44-9f1a-4dd8-9e0b-261153744151	f5c778e9-bbfc-4fef-aa32-9b32a6db83c7	\N	\N	1.000	10.0000	2026-09-07 19:25:54.233	2026-09-07 19:25:54.233
5102a727-1ed8-488f-81e9-22586600ac24	04d5fe44-9f1a-4dd8-9e0b-261153744151	75b39f53-1ef6-4055-b004-1cbd437ec397	\N	\N	0.100	1.0000	2026-09-07 19:25:54.237	2026-09-07 19:25:54.237
5d70d6b1-8988-45dc-a177-9e4bee9d8c42	04d5fe44-9f1a-4dd8-9e0b-261153744151	2585af84-0476-44c1-bddd-6569609dea26	\N	\N	1.000	10.0000	2026-09-07 19:25:54.241	2026-09-07 19:25:54.241
d1c262db-37e3-4149-a0e5-521810423da6	04d5fe44-9f1a-4dd8-9e0b-261153744151	4ae04ce7-69dc-4aa3-b91f-38227df1ccc1	\N	\N	0.100	1.0000	2026-09-07 19:25:54.245	2026-09-07 19:25:54.245
0d7ff1dd-4d1f-4cd0-9fb9-05325df02f9b	3ee7396b-c388-41d6-b376-3b4de70db28c	2556b4df-e535-47b5-bfcb-a34622f6f0fe	\N	\N	1.000	10.0000	2026-09-07 19:25:54.25	2026-09-07 19:25:54.25
e347185a-3939-4e35-8aae-679c3271279e	3ee7396b-c388-41d6-b376-3b4de70db28c	84c02891-72ff-44f5-8767-75e1b79ec02e	\N	\N	1.000	10.0000	2026-09-07 19:25:54.254	2026-09-07 19:25:54.254
9c1eb8a0-db9c-4f18-b85c-7eb02e4d5251	3ee7396b-c388-41d6-b376-3b4de70db28c	a54b052c-6b6e-4210-b286-f9666dbf6e20	\N	\N	5.000	50.0000	2026-09-07 19:25:54.258	2026-09-07 19:25:54.258
3c925ae5-1672-4d85-83d6-91a38f05674a	3ee7396b-c388-41d6-b376-3b4de70db28c	af5ed9d6-a35f-4f15-bad4-9f834901d8c0	\N	\N	2.000	20.0000	2026-09-07 19:25:54.261	2026-09-07 19:25:54.261
cd98a969-e60f-4267-a74d-82cf6e73224e	3ee7396b-c388-41d6-b376-3b4de70db28c	0b0e329a-b9ae-48f1-9d13-65ffb8295b6e	\N	\N	1.000	10.0000	2026-09-07 19:25:54.264	2026-09-07 19:25:54.264
9b5db2d7-457f-431c-9d58-5c4675fa5ffd	3ee7396b-c388-41d6-b376-3b4de70db28c	dd11ade7-d444-49e4-9490-35179c4132cc	\N	\N	0.500	5.0000	2026-09-07 19:25:54.267	2026-09-07 19:25:54.267
142d9408-dd69-42ae-8c45-3f8b6c636c07	3ee7396b-c388-41d6-b376-3b4de70db28c	7270809e-5f98-48a2-aa46-a99bf4455bb3	\N	\N	3.000	30.0000	2026-09-07 19:25:54.272	2026-09-07 19:25:54.272
2558f37e-84dc-4470-a6c5-a6a986491fe6	3ee7396b-c388-41d6-b376-3b4de70db28c	d84cba5d-96a8-432f-a27c-650a3da49cd1	\N	\N	0.200	2.0000	2026-09-07 19:25:54.276	2026-09-07 19:25:54.276
8470b384-0e6c-48aa-b142-2df80e3c74f4	3ee7396b-c388-41d6-b376-3b4de70db28c	ff2e578a-4456-4d54-8bc2-1f9ec6c8cc7c	\N	\N	86.300	863.0000	2026-09-07 19:25:54.28	2026-09-07 19:25:54.28
d650c23a-ecb2-45c5-ad83-c2e960d6277e	2cefd3e0-2c69-40be-8554-6c3e45e27f28	c2cce8b2-2bdb-4752-b8a0-946e94b14e19	\N	\N	82.200	822.0000	2026-09-07 19:25:54.307	2026-09-07 19:25:54.307
6d4038fd-474d-4645-860b-5c2dabf8fe3b	2cefd3e0-2c69-40be-8554-6c3e45e27f28	8849ff42-8f1d-4bb7-9b63-154fb2a329d3	\N	\N	7.000	70.0000	2026-09-07 19:25:54.31	2026-09-07 19:25:54.31
a4f23e3b-1245-4420-949a-8d0e92e80896	2cefd3e0-2c69-40be-8554-6c3e45e27f28	a7931626-b6ab-450d-b7e8-484d773cf1aa	\N	\N	7.000	70.0000	2026-09-07 19:25:54.313	2026-09-07 19:25:54.313
052612e7-7bbe-4840-91ed-5b43965c3ffe	2cefd3e0-2c69-40be-8554-6c3e45e27f28	af5ed9d6-a35f-4f15-bad4-9f834901d8c0	\N	\N	1.500	15.0000	2026-09-07 19:25:54.316	2026-09-07 19:25:54.316
e4d22239-f1b0-499b-aff4-971fe5b3bc33	2cefd3e0-2c69-40be-8554-6c3e45e27f28	3cd5338f-4077-4313-975c-26d1e5c24de0	\N	\N	1.000	10.0000	2026-09-07 19:25:54.321	2026-09-07 19:25:54.321
8e5815fa-dd08-4b73-a176-d48e6c1c304b	2cefd3e0-2c69-40be-8554-6c3e45e27f28	2f50dca2-668f-4a53-975e-e95116d7442f	\N	\N	1.500	15.0000	2026-09-07 19:25:54.324	2026-09-07 19:25:54.324
cd25fcd4-0cd0-44a3-99e7-f96033d08117	2cefd3e0-2c69-40be-8554-6c3e45e27f28	7270809e-5f98-48a2-aa46-a99bf4455bb3	\N	\N	1.000	10.0000	2026-09-07 19:25:54.328	2026-09-07 19:25:54.328
01ca91ee-b0b7-4a5e-9376-49a756fd8c2c	2cefd3e0-2c69-40be-8554-6c3e45e27f28	4ae04ce7-69dc-4aa3-b91f-38227df1ccc1	\N	\N	0.100	1.0000	2026-09-07 19:25:54.331	2026-09-07 19:25:54.331
8d6fdd7e-2a3d-4e3a-82ba-d8f22f58df28	70f3baf6-f3f8-4617-8611-5d00114e68e7	9c3c9b3b-7eef-4d3c-bc51-df944f79b354	\N	\N	62.000	620.0000	2026-09-07 19:25:54.429	2026-09-07 19:25:54.429
756aee7b-071c-417c-9af9-c4a41eac9f25	70f3baf6-f3f8-4617-8611-5d00114e68e7	7270809e-5f98-48a2-aa46-a99bf4455bb3	\N	\N	8.000	80.0000	2026-09-07 19:25:54.434	2026-09-07 19:25:54.434
10599da7-6cf8-4321-8179-79934754a54f	70f3baf6-f3f8-4617-8611-5d00114e68e7	7d898dec-8922-4f4f-9155-4e18489b1c18	\N	\N	0.200	2.0000	2026-09-07 19:25:54.441	2026-09-07 19:25:54.441
c7530366-abf3-44f1-92f3-7cbe0d68b0d7	70f3baf6-f3f8-4617-8611-5d00114e68e7	eb1bf31e-ba99-443b-aa07-7410e56da07f	\N	\N	0.200	2.0000	2026-09-07 19:25:54.445	2026-09-07 19:25:54.445
552e0237-0f54-4e31-bf31-a0b6b06743ca	70f3baf6-f3f8-4617-8611-5d00114e68e7	d43e9dda-d68f-4b16-b725-9deb616065eb	\N	\N	0.200	2.0000	2026-09-07 19:25:54.448	2026-09-07 19:25:54.448
cad2b5a9-6ddd-4014-876a-9ae68bf1f4c7	70f3baf6-f3f8-4617-8611-5d00114e68e7	ac8b254d-0844-47d1-93a8-78ba9a4376bb	\N	\N	15.000	150.0000	2026-09-07 19:25:54.452	2026-09-07 19:25:54.452
0bad9d3f-7ac3-4fc0-9898-b4c685a234c8	70f3baf6-f3f8-4617-8611-5d00114e68e7	c2cce8b2-2bdb-4752-b8a0-946e94b14e19	\N	\N	14.400	144.0000	2026-09-07 19:25:54.456	2026-09-07 19:25:54.456
a196dc91-6419-424c-850f-0d32a91740fb	0de88a42-6a50-461f-8bc8-d26716e66807	c2cce8b2-2bdb-4752-b8a0-946e94b14e19	\N	\N	80.800	808.0000	2026-09-07 19:25:54.543	2026-09-07 19:25:54.543
81769be2-84a5-44e8-b517-5c83bbf974c3	0de88a42-6a50-461f-8bc8-d26716e66807	8849ff42-8f1d-4bb7-9b63-154fb2a329d3	\N	\N	7.000	70.0000	2026-09-07 19:25:54.546	2026-09-07 19:25:54.546
6d7391c7-4b72-4d44-8a8a-d19b52e71d7a	0de88a42-6a50-461f-8bc8-d26716e66807	a7931626-b6ab-450d-b7e8-484d773cf1aa	\N	\N	7.000	70.0000	2026-09-07 19:25:54.549	2026-09-07 19:25:54.549
11ceebfd-c6cc-4847-bae9-6152dacd263a	0de88a42-6a50-461f-8bc8-d26716e66807	876f54db-7e02-40f9-917d-94ac8bd2d198	\N	\N	1.000	10.0000	2026-09-07 19:25:54.553	2026-09-07 19:25:54.553
19052cd7-973c-484b-814a-3c149ce22428	0de88a42-6a50-461f-8bc8-d26716e66807	644113e7-6761-492f-a55e-a359c795c5f8	\N	\N	2.000	20.0000	2026-09-07 19:25:54.557	2026-09-07 19:25:54.557
7aaa8edf-6648-4d2e-aeda-b05982815937	0de88a42-6a50-461f-8bc8-d26716e66807	7270809e-5f98-48a2-aa46-a99bf4455bb3	\N	\N	2.000	20.0000	2026-09-07 19:25:54.56	2026-09-07 19:25:54.56
c1e642ab-5926-4de6-a84e-3f63a9197831	0de88a42-6a50-461f-8bc8-d26716e66807	d84cba5d-96a8-432f-a27c-650a3da49cd1	\N	\N	0.250	2.5000	2026-09-07 19:25:54.563	2026-09-07 19:25:54.563
e4eac6a4-4902-4ebb-8391-f43a0f5a5a9e	0de88a42-6a50-461f-8bc8-d26716e66807	1bd04830-09a6-43ba-8ed5-428e44cbbc51	\N	\N	40.000	400.0000	2026-09-07 19:25:54.566	2026-09-07 19:25:54.566
d100f531-117c-4a2c-b3c4-36ca2a63dfe7	e09d08f7-f9f2-4caf-a5a5-8f00fb54acfa	7270809e-5f98-48a2-aa46-a99bf4455bb3	\N	\N	6.000	60.0000	2026-09-07 19:25:54.573	2026-09-07 19:25:54.573
b56d263e-b8de-4894-a7c4-7f530557cca0	e09d08f7-f9f2-4caf-a5a5-8f00fb54acfa	22fabeae-a648-4909-8618-c6e6704ba256	\N	\N	6.000	60.0000	2026-09-07 19:25:54.577	2026-09-07 19:25:54.577
4d38087f-3377-41c8-a01a-c5db3ec10b54	e09d08f7-f9f2-4caf-a5a5-8f00fb54acfa	82bbbad6-cce9-48ef-90e1-e3db6d129421	\N	\N	6.000	60.0000	2026-09-07 19:25:54.58	2026-09-07 19:25:54.58
202dacab-01f4-48e8-947c-99df94f46ed2	e09d08f7-f9f2-4caf-a5a5-8f00fb54acfa	00854e61-4efa-4d19-8de8-134ae16968c3	\N	\N	0.200	2.0000	2026-09-07 19:25:54.586	2026-09-07 19:25:54.586
d1abaefa-53df-47ab-be7b-dc246c0b4806	e09d08f7-f9f2-4caf-a5a5-8f00fb54acfa	c2cce8b2-2bdb-4752-b8a0-946e94b14e19	\N	\N	10.000	100.0000	2026-09-07 19:25:54.592	2026-09-07 19:25:54.592
874924bd-4add-4108-82dc-686ee5a0195b	e09d08f7-f9f2-4caf-a5a5-8f00fb54acfa	28e143aa-6b1e-4802-8c0e-fa24fb835a27	\N	\N	71.200	712.0000	2026-09-07 19:25:54.596	2026-09-07 19:25:54.596
9632963f-5bc4-4522-a62f-2c09155ed914	e09d08f7-f9f2-4caf-a5a5-8f00fb54acfa	68df4e31-dcd6-4776-99f2-cf707a7288a6	\N	\N	0.250	2.5000	2026-09-07 19:25:54.599	2026-09-07 19:25:54.599
731b0a1f-e0ab-4f27-b80b-1a93d4e4dea8	e09d08f7-f9f2-4caf-a5a5-8f00fb54acfa	ebfcccbb-22c9-468d-8ee7-f7cdb8cacdb8	\N	\N	0.200	2.0000	2026-09-07 19:25:54.603	2026-09-07 19:25:54.603
c2b022c3-0bf2-486e-9eab-6a901df777b5	2b5d9e14-6b19-4f32-a141-d5c400d5dab8	\N	FRAGANCIA (REFERENCIA)	COMODIN-FRAGANCIA	10.000	100.0000	2026-09-07 19:25:54.607	2026-09-07 19:25:54.607
fa60b911-3b5b-4fe1-94fb-8ef217a6602b	2b5d9e14-6b19-4f32-a141-d5c400d5dab8	7933f07a-a446-4894-b0da-c791c262fd09	\N	\N	80.000	800.0000	2026-09-07 19:25:54.61	2026-09-07 19:25:54.61
986b69d2-0a3e-4cbc-8721-ef0328e8eac5	2b5d9e14-6b19-4f32-a141-d5c400d5dab8	d64c14fa-3514-42c2-a2c3-9089724e50e3	\N	\N	10.000	100.0000	2026-09-07 19:25:54.613	2026-09-07 19:25:54.613
c73672b8-af2c-422b-ae90-71bfc250962d	5f47c58f-48ab-4fce-8d58-5b9381e2bf94	3195b8a3-32f9-4739-a0e9-fab3748f4c15	\N	\N	7.000	70.0000	2026-09-07 19:25:54.619	2026-09-07 19:25:54.619
7c57e157-f384-464a-bcb2-2e4dd48bbc44	5f47c58f-48ab-4fce-8d58-5b9381e2bf94	bcbc8cc8-10e5-4c24-84a9-e267492364bb	\N	\N	6.000	60.0000	2026-09-07 19:25:54.623	2026-09-07 19:25:54.623
5ae8776f-4fee-422b-8959-8b2d4653dc7a	5f47c58f-48ab-4fce-8d58-5b9381e2bf94	b735de2e-97a4-43f4-91f0-0b7b0e3e4f57	\N	\N	5.000	50.0000	2026-09-07 19:25:54.626	2026-09-07 19:25:54.626
16311bef-4d25-4c95-a6a4-792473fa8306	5f47c58f-48ab-4fce-8d58-5b9381e2bf94	15d72f0a-f093-4dd2-9645-ffba442e9de7	\N	\N	82.000	820.0000	2026-09-07 19:25:54.63	2026-09-07 19:25:54.63
3f7c99dc-3763-4f5c-9d85-4214b8dabda2	5f47c58f-48ab-4fce-8d58-5b9381e2bf94	8587e682-2575-4153-9ad6-ebd98e42db27	\N	\N	0.100	1.0000	2026-09-07 19:25:54.633	2026-09-07 19:25:54.633
97613ecc-625a-4142-84fb-c1ab93414fc9	1f2c6748-1665-49a4-a5eb-471248fedd23	c2cce8b2-2bdb-4752-b8a0-946e94b14e19	\N	\N	80.800	808.0000	2026-09-07 19:25:54.639	2026-09-07 19:25:54.639
550330f7-60fe-4575-964b-085eafa664bb	1f2c6748-1665-49a4-a5eb-471248fedd23	8849ff42-8f1d-4bb7-9b63-154fb2a329d3	\N	\N	7.000	70.0000	2026-09-07 19:25:54.642	2026-09-07 19:25:54.642
7a5af499-0e0a-46fd-bfa6-1e7a9c2d270e	1f2c6748-1665-49a4-a5eb-471248fedd23	a7931626-b6ab-450d-b7e8-484d773cf1aa	\N	\N	7.000	70.0000	2026-09-07 19:25:54.646	2026-09-07 19:25:54.646
83b1a709-e003-4e21-8b1f-4a6c9ae4dc0f	1f2c6748-1665-49a4-a5eb-471248fedd23	7270809e-5f98-48a2-aa46-a99bf4455bb3	\N	\N	1.000	10.0000	2026-09-07 19:25:54.649	2026-09-07 19:25:54.649
84f5dd76-076b-41f6-866a-064785e2bb1c	1f2c6748-1665-49a4-a5eb-471248fedd23	644113e7-6761-492f-a55e-a359c795c5f8	\N	\N	2.000	20.0000	2026-09-07 19:25:54.653	2026-09-07 19:25:54.653
d0129c3b-f744-42dd-b371-575064d15243	1f2c6748-1665-49a4-a5eb-471248fedd23	97f87364-f00c-472b-a9dd-5ce36244afb4	\N	\N	2.000	20.0000	2026-09-07 19:25:54.656	2026-09-07 19:25:54.656
dfefd7e3-af59-4bb2-ad91-5c1cb949fa74	69642105-98cb-4bb6-b7ee-f7fb34f102b9	75b39f53-1ef6-4055-b004-1cbd437ec397	\N	\N	4.000	40.0000	2026-09-07 19:25:54.662	2026-09-07 19:25:54.662
b3b5bfd7-b011-4468-b35d-887e9cc89a34	69642105-98cb-4bb6-b7ee-f7fb34f102b9	9c3c9b3b-7eef-4d3c-bc51-df944f79b354	\N	\N	50.000	500.0000	2026-09-07 19:25:54.666	2026-09-07 19:25:54.666
dadfc5d1-516b-4ce0-99b4-f8b12c82a0b7	69642105-98cb-4bb6-b7ee-f7fb34f102b9	644113e7-6761-492f-a55e-a359c795c5f8	\N	\N	45.750	457.5000	2026-09-07 19:25:54.67	2026-09-07 19:25:54.67
35357163-1c7b-4083-8201-52f96406b604	69642105-98cb-4bb6-b7ee-f7fb34f102b9	dc1761ba-bf39-41fc-bc4d-e48b3e2e1114	\N	\N	0.250	2.5000	2026-09-07 19:25:54.674	2026-09-07 19:25:54.674
76666b66-41b2-4cb2-94f6-bc1e69dd07bb	42303345-79c9-4268-86d9-24c93f0786cb	ab9438b3-e9d8-4b33-a5c8-da547e7b5024	\N	\N	99.000	990.0000	2026-09-07 19:25:54.689	2026-09-07 19:25:54.689
1874c7c6-18b0-4e4c-a567-2e24d0605005	42303345-79c9-4268-86d9-24c93f0786cb	6b741b7a-554a-4624-966a-1e311d24e2b5	\N	\N	0.500	5.0000	2026-09-07 19:25:54.692	2026-09-07 19:25:54.692
b34e524f-ab18-4e2b-87e6-cda84761dbc8	42303345-79c9-4268-86d9-24c93f0786cb	dc1761ba-bf39-41fc-bc4d-e48b3e2e1114	\N	\N	0.500	5.0000	2026-09-07 19:25:54.696	2026-09-07 19:25:54.696
9de3fce6-e7ea-4e05-99ec-c1cfa3d2312b	f9259e6c-a178-4f5d-8b44-4de6fe904855	c2cce8b2-2bdb-4752-b8a0-946e94b14e19	\N	\N	78.600	786.0000	2026-09-07 19:25:54.701	2026-09-07 19:25:54.701
ea239bc5-bc26-49e7-babe-a3f96673df37	f9259e6c-a178-4f5d-8b44-4de6fe904855	8849ff42-8f1d-4bb7-9b63-154fb2a329d3	\N	\N	7.000	70.0000	2026-09-07 19:25:54.705	2026-09-07 19:25:54.705
631ef51d-f259-4139-b069-98208016c59b	f9259e6c-a178-4f5d-8b44-4de6fe904855	a7931626-b6ab-450d-b7e8-484d773cf1aa	\N	\N	7.000	70.0000	2026-09-07 19:25:54.709	2026-09-07 19:25:54.709
630b61bb-3f65-409a-8d0a-bfa1391ab4a8	f9259e6c-a178-4f5d-8b44-4de6fe904855	0b0e329a-b9ae-48f1-9d13-65ffb8295b6e	\N	\N	3.000	30.0000	2026-09-07 19:25:54.712	2026-09-07 19:25:54.712
2b3b55d1-7ae2-42a4-a669-04fcf760e554	f9259e6c-a178-4f5d-8b44-4de6fe904855	af5ed9d6-a35f-4f15-bad4-9f834901d8c0	\N	\N	3.000	30.0000	2026-09-07 19:25:54.716	2026-09-07 19:25:54.716
7da9e42f-3401-4a44-8a57-571cd4f5e16b	f9259e6c-a178-4f5d-8b44-4de6fe904855	7270809e-5f98-48a2-aa46-a99bf4455bb3	\N	\N	1.000	10.0000	2026-09-07 19:25:54.72	2026-09-07 19:25:54.72
0eee4191-b279-41f3-845a-53a7a22fe1b0	f9259e6c-a178-4f5d-8b44-4de6fe904855	503a47d1-8230-410a-bbd1-b76b0a91ba24	\N	\N	0.100	1.0000	2026-09-07 19:25:54.724	2026-09-07 19:25:54.724
05006b37-1ebf-4641-956c-23d0bd6161e7	f9259e6c-a178-4f5d-8b44-4de6fe904855	3b682c2c-c7a5-426b-b223-32e792196c98	\N	\N	0.050	0.5000	2026-09-07 19:25:54.727	2026-09-07 19:25:54.727
9f81d84f-9dda-4c00-8427-388d28d505b9	783e8a87-7897-4631-ae0e-1fee3f129ff1	c2cce8b2-2bdb-4752-b8a0-946e94b14e19	\N	\N	78.600	786.0000	2026-09-07 19:25:54.814	2026-09-07 19:25:54.814
b44cf116-6326-4092-bfdf-9898b541928e	783e8a87-7897-4631-ae0e-1fee3f129ff1	8849ff42-8f1d-4bb7-9b63-154fb2a329d3	\N	\N	7.000	70.0000	2026-09-07 19:25:54.819	2026-09-07 19:25:54.819
07738734-df86-435a-923b-1b812db83bad	783e8a87-7897-4631-ae0e-1fee3f129ff1	a7931626-b6ab-450d-b7e8-484d773cf1aa	\N	\N	7.000	70.0000	2026-09-07 19:25:54.823	2026-09-07 19:25:54.823
c98293f4-d0e4-49e7-83ef-24d27dcdd6e5	783e8a87-7897-4631-ae0e-1fee3f129ff1	0b0e329a-b9ae-48f1-9d13-65ffb8295b6e	\N	\N	3.000	30.0000	2026-09-07 19:25:54.828	2026-09-07 19:25:54.828
37d505ee-4e09-41fb-b181-ff7a6bac5e3c	783e8a87-7897-4631-ae0e-1fee3f129ff1	af5ed9d6-a35f-4f15-bad4-9f834901d8c0	\N	\N	3.000	30.0000	2026-09-07 19:25:54.832	2026-09-07 19:25:54.832
28fda02b-f88a-4e72-8c37-dc4a0cea563b	783e8a87-7897-4631-ae0e-1fee3f129ff1	7270809e-5f98-48a2-aa46-a99bf4455bb3	\N	\N	1.000	10.0000	2026-09-07 19:25:54.838	2026-09-07 19:25:54.838
c7e8d68f-3350-4da9-88ee-d7a07511f30d	783e8a87-7897-4631-ae0e-1fee3f129ff1	503a47d1-8230-410a-bbd1-b76b0a91ba24	\N	\N	0.100	1.0000	2026-09-07 19:25:54.842	2026-09-07 19:25:54.842
e982022b-e6fc-4d6c-9578-c6c3906ea33d	783e8a87-7897-4631-ae0e-1fee3f129ff1	3b682c2c-c7a5-426b-b223-32e792196c98	\N	\N	0.050	0.5000	2026-09-07 19:25:54.845	2026-09-07 19:25:54.845
87e38259-1b01-4ddc-a540-8611a63cf6b9	93b33c9b-3ee3-44d5-beb7-1adb90616626	75b39f53-1ef6-4055-b004-1cbd437ec397	\N	\N	0.300	3.0000	2026-09-07 19:25:54.85	2026-09-07 19:25:54.85
0bb1a9a1-42c1-42d3-8c88-10609eaffee0	93b33c9b-3ee3-44d5-beb7-1adb90616626	9c3c9b3b-7eef-4d3c-bc51-df944f79b354	\N	\N	84.500	845.0000	2026-09-07 19:25:54.855	2026-09-07 19:25:54.855
be40e826-2f84-47c5-996c-ddfec102dbdb	93b33c9b-3ee3-44d5-beb7-1adb90616626	644113e7-6761-492f-a55e-a359c795c5f8	\N	\N	5.000	50.0000	2026-09-07 19:25:54.859	2026-09-07 19:25:54.859
c756e576-52aa-4f88-9db1-16edc762d5b1	93b33c9b-3ee3-44d5-beb7-1adb90616626	dc1761ba-bf39-41fc-bc4d-e48b3e2e1114	\N	\N	0.250	2.5000	2026-09-07 19:25:54.862	2026-09-07 19:25:54.862
7209c5f2-8473-4788-81eb-a4502cecd6a8	93b33c9b-3ee3-44d5-beb7-1adb90616626	c2cce8b2-2bdb-4752-b8a0-946e94b14e19	\N	\N	10.000	100.0000	2026-09-07 19:25:54.866	2026-09-07 19:25:54.866
ed09ff9e-7fd6-4290-9c57-5d75b5be4e9a	56b7d557-6a88-4ee4-96a7-30d0c70a5f2b	64534917-1fa8-4ad6-aef5-58254449a729	\N	\N	17.000	170.0000	2026-09-07 19:25:54.872	2026-09-07 19:25:54.872
d375d2d1-7a2f-495c-9c7e-3ed2dc048eb8	56b7d557-6a88-4ee4-96a7-30d0c70a5f2b	9c3c9b3b-7eef-4d3c-bc51-df944f79b354	\N	\N	40.000	400.0000	2026-09-07 19:25:54.876	2026-09-07 19:25:54.876
ce641e77-d3ac-4f96-b835-ee537b23ee69	56b7d557-6a88-4ee4-96a7-30d0c70a5f2b	644113e7-6761-492f-a55e-a359c795c5f8	\N	\N	40.000	400.0000	2026-09-07 19:25:54.879	2026-09-07 19:25:54.879
3bf1bfa3-df55-488a-85ed-d4634a344e6b	56b7d557-6a88-4ee4-96a7-30d0c70a5f2b	6b1e6d35-4100-45ab-bef7-91f43803549d	\N	\N	0.500	5.0000	2026-09-07 19:25:54.883	2026-09-07 19:25:54.883
dfd444ed-c0fd-42b4-9bfd-6cdb79bef575	56b7d557-6a88-4ee4-96a7-30d0c70a5f2b	c2cce8b2-2bdb-4752-b8a0-946e94b14e19	\N	\N	2.500	25.0000	2026-09-07 19:25:54.889	2026-09-07 19:25:54.889
a748a0de-cb15-41d8-b758-0d36159ee6d4	c0a33a39-fb99-496f-a878-029100720c3d	ab9438b3-e9d8-4b33-a5c8-da547e7b5024	\N	\N	99.000	990.0000	2026-09-07 19:25:54.894	2026-09-07 19:25:54.894
b6260037-1061-4ccc-b6b3-7bb39f756ea6	c0a33a39-fb99-496f-a878-029100720c3d	6b741b7a-554a-4624-966a-1e311d24e2b5	\N	\N	0.500	5.0000	2026-09-07 19:25:54.898	2026-09-07 19:25:54.898
75fdb21f-83a2-423f-9787-7695151c8e80	c0a33a39-fb99-496f-a878-029100720c3d	dc1761ba-bf39-41fc-bc4d-e48b3e2e1114	\N	\N	0.500	5.0000	2026-09-07 19:25:54.903	2026-09-07 19:25:54.903
1704ee55-4512-4133-b311-4c4502187312	6be6cad0-e881-4131-9247-46cb5b05053b	c2cce8b2-2bdb-4752-b8a0-946e94b14e19	\N	\N	92.700	927.0000	2026-09-07 19:25:54.91	2026-09-07 19:25:54.91
b6b4136f-4c49-43b7-a088-8655ae56743c	6be6cad0-e881-4131-9247-46cb5b05053b	4b5b2284-c252-486b-a8cd-0e2cb39c9928	\N	\N	0.800	8.0000	2026-09-07 19:25:54.914	2026-09-07 19:25:54.914
c1098e04-dd81-41a9-82cc-5423e1f867c6	6be6cad0-e881-4131-9247-46cb5b05053b	59b5bd63-1199-4880-90d9-519213f9b67d	\N	\N	0.250	2.5000	2026-09-07 19:25:54.92	2026-09-07 19:25:54.92
936ec22d-73d4-46fb-931a-e4963c229423	6be6cad0-e881-4131-9247-46cb5b05053b	7270809e-5f98-48a2-aa46-a99bf4455bb3	\N	\N	5.000	50.0000	2026-09-07 19:25:54.924	2026-09-07 19:25:54.924
948d9828-620d-41d1-9a69-f5b7f6e31b02	6be6cad0-e881-4131-9247-46cb5b05053b	84c02891-72ff-44f5-8767-75e1b79ec02e	\N	\N	0.800	8.0000	2026-09-07 19:25:54.928	2026-09-07 19:25:54.928
6cf7c4e6-55e8-4105-865c-2b4172bdb584	6be6cad0-e881-4131-9247-46cb5b05053b	d84cba5d-96a8-432f-a27c-650a3da49cd1	\N	\N	0.100	1.0000	2026-09-07 19:25:54.932	2026-09-07 19:25:54.932
9d839a3e-3fc1-4a19-9547-297871d19c8f	6bcbd4d2-7d46-490a-a82f-6cbc025d5950	c2cce8b2-2bdb-4752-b8a0-946e94b14e19	\N	\N	92.700	927.0000	2026-09-07 19:25:54.939	2026-09-07 19:25:54.939
ea881131-6118-4f46-a5dc-2eba2d5bd3ad	6bcbd4d2-7d46-490a-a82f-6cbc025d5950	af5ed9d6-a35f-4f15-bad4-9f834901d8c0	\N	\N	0.800	8.0000	2026-09-07 19:25:54.943	2026-09-07 19:25:54.943
7e2af512-834a-4f7f-8258-ae46f212ed96	6bcbd4d2-7d46-490a-a82f-6cbc025d5950	fb2d954f-be02-4ae5-a4e4-dedca6cddb05	\N	\N	0.500	5.0000	2026-09-07 19:25:54.947	2026-09-07 19:25:54.947
40606bc6-f705-469f-9f6c-4f4e85976596	6bcbd4d2-7d46-490a-a82f-6cbc025d5950	59b5bd63-1199-4880-90d9-519213f9b67d	\N	\N	5.000	50.0000	2026-09-07 19:25:54.951	2026-09-07 19:25:54.951
806e2f55-5338-4391-8679-1ce6eb473a6c	6bcbd4d2-7d46-490a-a82f-6cbc025d5950	84c02891-72ff-44f5-8767-75e1b79ec02e	\N	\N	0.800	8.0000	2026-09-07 19:25:54.956	2026-09-07 19:25:54.956
61d47a95-294d-4f32-8dd6-37582d289001	6bcbd4d2-7d46-490a-a82f-6cbc025d5950	d84cba5d-96a8-432f-a27c-650a3da49cd1	\N	\N	0.100	1.0000	2026-09-07 19:25:54.96	2026-09-07 19:25:54.96
64f8868a-7077-41de-9db3-8bcd5f4c49f8	20781650-1f04-4024-b160-eeaf427ab8b2	84f19242-2248-4ff3-b333-abb36b715f2a	\N	\N	0.500	5.0000	2026-09-07 19:25:54.966	2026-09-07 19:25:54.966
35fdba6d-5214-46d8-8d2b-76acbf240354	20781650-1f04-4024-b160-eeaf427ab8b2	97f87364-f00c-472b-a9dd-5ce36244afb4	\N	\N	1.000	10.0000	2026-09-07 19:25:54.973	2026-09-07 19:25:54.973
0f1a3e39-46c2-43e0-9a2e-80a3df4f8c95	20781650-1f04-4024-b160-eeaf427ab8b2	644113e7-6761-492f-a55e-a359c795c5f8	\N	\N	3.000	30.0000	2026-09-07 19:25:54.978	2026-09-07 19:25:54.978
833f47b5-dc44-4a04-b2f7-ab3d89474ee0	20781650-1f04-4024-b160-eeaf427ab8b2	7270809e-5f98-48a2-aa46-a99bf4455bb3	\N	\N	2.000	20.0000	2026-09-07 19:25:54.983	2026-09-07 19:25:54.983
7e01fc52-48d3-40f7-8d54-cf35bee47ee3	20781650-1f04-4024-b160-eeaf427ab8b2	eed50ae4-682c-4b3a-9fc6-27b3f992b26e	\N	\N	1.000	10.0000	2026-09-07 19:25:54.988	2026-09-07 19:25:54.988
607c44b0-53b7-48aa-8745-330d6d220252	20781650-1f04-4024-b160-eeaf427ab8b2	4b5b2284-c252-486b-a8cd-0e2cb39c9928	\N	\N	0.500	5.0000	2026-09-07 19:25:54.993	2026-09-07 19:25:54.993
a518c7c2-94a5-4afd-b200-2c14c7dcd039	20781650-1f04-4024-b160-eeaf427ab8b2	503a47d1-8230-410a-bbd1-b76b0a91ba24	\N	\N	0.100	1.0000	2026-09-07 19:25:54.996	2026-09-07 19:25:54.996
61ff9531-7dc7-4725-b51e-238582b3f081	20781650-1f04-4024-b160-eeaf427ab8b2	3b682c2c-c7a5-426b-b223-32e792196c98	\N	\N	0.050	0.5000	2026-09-07 19:25:55.002	2026-09-07 19:25:55.002
5246bd95-60f5-453f-8fad-4b96afd06d00	20781650-1f04-4024-b160-eeaf427ab8b2	ff2e578a-4456-4d54-8bc2-1f9ec6c8cc7c	\N	\N	91.800	918.0000	2026-09-07 19:25:55.006	2026-09-07 19:25:55.006
05356e95-724a-4b34-840a-6243ce7d85a3	0ed4c5e2-a367-450c-8b74-c5618d6c6d0e	ff2e578a-4456-4d54-8bc2-1f9ec6c8cc7c	\N	\N	78.500	785.0000	2026-09-07 19:25:55.015	2026-09-07 19:25:55.015
7717249f-3754-4c13-b4a6-da266c0c4e07	0ed4c5e2-a367-450c-8b74-c5618d6c6d0e	7270809e-5f98-48a2-aa46-a99bf4455bb3	\N	\N	3.000	30.0000	2026-09-07 19:25:55.021	2026-09-07 19:25:55.021
3f0721da-4489-4ccb-90ec-76ca240d39a9	0ed4c5e2-a367-450c-8b74-c5618d6c6d0e	eed50ae4-682c-4b3a-9fc6-27b3f992b26e	\N	\N	1.000	10.0000	2026-09-07 19:25:55.025	2026-09-07 19:25:55.025
37bc419b-8c92-4570-8419-29345fb43cbe	0ed4c5e2-a367-450c-8b74-c5618d6c6d0e	9c452016-ddf6-4271-bedc-b9bd5ee69ad8	\N	\N	0.300	3.0000	2026-09-07 19:25:55.031	2026-09-07 19:25:55.031
845bb117-4d01-47ed-83c5-e251c52a15fe	0ed4c5e2-a367-450c-8b74-c5618d6c6d0e	ea75d924-a8cb-41f7-99b1-dd3b2f803085	\N	\N	3.000	30.0000	2026-09-07 19:25:55.036	2026-09-07 19:25:55.036
d67f0cfe-4044-4870-9874-9178ec5c3d2c	0ed4c5e2-a367-450c-8b74-c5618d6c6d0e	e5c39f4b-b2ee-4e21-ab5d-6b2ae5a3b0d5	\N	\N	6.000	60.0000	2026-09-07 19:25:55.041	2026-09-07 19:25:55.041
a94b0625-4373-43bb-853a-c927baffca96	0ed4c5e2-a367-450c-8b74-c5618d6c6d0e	8849ff42-8f1d-4bb7-9b63-154fb2a329d3	\N	\N	7.000	70.0000	2026-09-07 19:25:55.045	2026-09-07 19:25:55.045
6ea446b4-e8c2-4aef-a762-f4055aba2e2d	0ed4c5e2-a367-450c-8b74-c5618d6c6d0e	ebfcccbb-22c9-468d-8ee7-f7cdb8cacdb8	\N	\N	0.500	5.0000	2026-09-07 19:25:55.049	2026-09-07 19:25:55.049
daef9a4b-284a-47d0-881b-45cf92df4c1d	74705cab-531b-484d-ac69-7915ea330150	c2cce8b2-2bdb-4752-b8a0-946e94b14e19	\N	\N	80.700	807.0000	2026-09-07 19:25:55.055	2026-09-07 19:25:55.055
c779d987-abe6-4b08-a28c-3c90413aba2f	74705cab-531b-484d-ac69-7915ea330150	8849ff42-8f1d-4bb7-9b63-154fb2a329d3	\N	\N	7.000	70.0000	2026-09-07 19:25:55.059	2026-09-07 19:25:55.059
5936288c-6738-4583-9258-2a70b8fe4b48	74705cab-531b-484d-ac69-7915ea330150	a7931626-b6ab-450d-b7e8-484d773cf1aa	\N	\N	7.000	70.0000	2026-09-07 19:25:55.062	2026-09-07 19:25:55.062
0d6bee39-fe1f-440b-9c1b-af4169747e1a	74705cab-531b-484d-ac69-7915ea330150	0b0e329a-b9ae-48f1-9d13-65ffb8295b6e	\N	\N	3.000	30.0000	2026-09-07 19:25:55.065	2026-09-07 19:25:55.065
30980fe8-dc2c-41ad-b7b2-02bfdc8d9c66	74705cab-531b-484d-ac69-7915ea330150	af5ed9d6-a35f-4f15-bad4-9f834901d8c0	\N	\N	1.000	10.0000	2026-09-07 19:25:55.069	2026-09-07 19:25:55.069
30d1fa66-b0ed-4a5a-b079-ff55e5962b95	74705cab-531b-484d-ac69-7915ea330150	7270809e-5f98-48a2-aa46-a99bf4455bb3	\N	\N	1.000	10.0000	2026-09-07 19:25:55.073	2026-09-07 19:25:55.073
f5e51b54-2b50-4029-bb19-7635aa75cff5	74705cab-531b-484d-ac69-7915ea330150	d84cba5d-96a8-432f-a27c-650a3da49cd1	\N	\N	0.250	2.5000	2026-09-07 19:25:55.076	2026-09-07 19:25:55.076
0591df7b-e632-47da-b8bb-7b5bc2c82067	7e50e177-ea3f-4957-883e-dafc4111bd74	73cbd1de-ffb9-4024-90e3-b1709c8dbbfb	\N	\N	1.000	10.0000	2026-09-07 19:25:55.081	2026-09-07 19:25:55.081
9b232a69-a041-4e2b-b595-ca6e0420636c	7e50e177-ea3f-4957-883e-dafc4111bd74	64534917-1fa8-4ad6-aef5-58254449a729	\N	\N	5.000	50.0000	2026-09-07 19:25:55.085	2026-09-07 19:25:55.085
4c3d09f3-74ec-45ee-9a3c-052fc5d571c0	7e50e177-ea3f-4957-883e-dafc4111bd74	fc3eaf1c-3fc4-4d01-80a4-ec5b98e23143	\N	\N	100.000	1000.0000	2026-09-07 19:25:55.09	2026-09-07 19:25:55.09
5b445f30-a8bd-4394-bd0c-a381fdef0295	a4b86189-0d2c-4786-8f85-a552b5203bb8	c2cce8b2-2bdb-4752-b8a0-946e94b14e19	\N	\N	68.898	688.9800	2026-09-07 19:25:55.095	2026-09-07 19:25:55.095
b49c60a2-8377-474f-98d9-eee5cae63969	a4b86189-0d2c-4786-8f85-a552b5203bb8	ff28dc8d-0d58-44b5-9c30-d752cae50a6b	\N	\N	7.000	70.0000	2026-09-07 19:25:55.098	2026-09-07 19:25:55.098
61d22b21-25ec-4898-b1f4-a9f6dde4e252	a4b86189-0d2c-4786-8f85-a552b5203bb8	f444c430-fd70-4ad6-95e4-575599a408be	\N	\N	3.500	35.0000	2026-09-07 19:25:55.102	2026-09-07 19:25:55.102
2c981e45-5b2a-46d4-b9b7-ccbae4fa109f	a4b86189-0d2c-4786-8f85-a552b5203bb8	d43e9dda-d68f-4b16-b725-9deb616065eb	\N	\N	0.200	2.0000	2026-09-07 19:25:55.106	2026-09-07 19:25:55.106
64c9c7a2-5246-41cb-90f9-53e254eef3d7	a4b86189-0d2c-4786-8f85-a552b5203bb8	7d898dec-8922-4f4f-9155-4e18489b1c18	\N	\N	0.200	2.0000	2026-09-07 19:25:55.109	2026-09-07 19:25:55.109
221d9157-9e17-4277-86c2-a26393fae6eb	a4b86189-0d2c-4786-8f85-a552b5203bb8	eb1bf31e-ba99-443b-aa07-7410e56da07f	\N	\N	0.200	2.0000	2026-09-07 19:25:55.112	2026-09-07 19:25:55.112
466116be-3f76-4dfe-8d09-bb91d9f4199e	a4b86189-0d2c-4786-8f85-a552b5203bb8	7270809e-5f98-48a2-aa46-a99bf4455bb3	\N	\N	5.000	50.0000	2026-09-07 19:25:55.116	2026-09-07 19:25:55.116
e3633a03-4be5-4891-ae2e-ec4b7bcb26fe	a4b86189-0d2c-4786-8f85-a552b5203bb8	9c3c9b3b-7eef-4d3c-bc51-df944f79b354	\N	\N	15.000	150.0000	2026-09-07 19:25:55.12	2026-09-07 19:25:55.12
bb359f8f-2c20-4c3c-8940-49a64f513bfd	a4b86189-0d2c-4786-8f85-a552b5203bb8	648259d4-9890-4835-9b82-4505863f0a70	\N	\N	0.002	0.0200	2026-09-07 19:25:55.124	2026-09-07 19:25:55.124
a5801529-0261-4c26-b54b-e1db00874418	586fd5b3-e7f3-4288-9df4-53ecf6d29dbf	f89c2bc3-1e48-4a60-b326-270864dad5ca	\N	\N	30.000	300.0000	2026-09-07 19:25:55.132	2026-09-07 19:25:55.132
72121a5b-f6e3-421f-9656-4360deda83c9	586fd5b3-e7f3-4288-9df4-53ecf6d29dbf	c2cce8b2-2bdb-4752-b8a0-946e94b14e19	\N	\N	66.800	668.0000	2026-09-07 19:25:55.136	2026-09-07 19:25:55.136
bc10cafe-7b10-4170-ba28-ffa53f086c9a	586fd5b3-e7f3-4288-9df4-53ecf6d29dbf	9f73b776-f31c-4aaa-824f-2d10b9332f3e	\N	\N	2.000	20.0000	2026-09-07 19:25:55.14	2026-09-07 19:25:55.14
0943e05e-0810-486a-a1d2-6ce6e3d190bf	586fd5b3-e7f3-4288-9df4-53ecf6d29dbf	3195b8a3-32f9-4739-a0e9-fab3748f4c15	\N	\N	0.500	5.0000	2026-09-07 19:25:55.144	2026-09-07 19:25:55.144
8e6f8122-63d9-4140-abf2-8e81b6e46123	586fd5b3-e7f3-4288-9df4-53ecf6d29dbf	4ae04ce7-69dc-4aa3-b91f-38227df1ccc1	\N	\N	0.200	2.0000	2026-09-07 19:25:55.147	2026-09-07 19:25:55.147
3ad91563-fc06-4fb3-88da-ee260606d9c3	586fd5b3-e7f3-4288-9df4-53ecf6d29dbf	8176c9a8-6276-4fb3-abaa-8cd62dea89b0	\N	\N	0.200	2.0000	2026-09-07 19:25:55.15	2026-09-07 19:25:55.15
10ec1e8a-5bb7-4609-b754-9524229f5992	586fd5b3-e7f3-4288-9df4-53ecf6d29dbf	503a47d1-8230-410a-bbd1-b76b0a91ba24	\N	\N	0.150	1.5000	2026-09-07 19:25:55.155	2026-09-07 19:25:55.155
8619daf6-ce1c-4a54-9095-e5f2d898fc36	586fd5b3-e7f3-4288-9df4-53ecf6d29dbf	3b682c2c-c7a5-426b-b223-32e792196c98	\N	\N	0.100	1.0000	2026-09-07 19:25:55.158	2026-09-07 19:25:55.158
aa36b203-1848-4e36-8922-523c53935513	63f30c2d-ed70-4402-8287-9b567c067680	c2cce8b2-2bdb-4752-b8a0-946e94b14e19	\N	\N	91.800	918.0000	2026-09-07 19:25:55.18	2026-09-07 19:25:55.18
8b9341e7-b429-4627-a27b-deda9d3ee50d	63f30c2d-ed70-4402-8287-9b567c067680	2556b4df-e535-47b5-bfcb-a34622f6f0fe	\N	\N	1.200	12.0000	2026-09-07 19:25:55.184	2026-09-07 19:25:55.184
52fed2d9-5d84-439e-b72d-792f96203206	63f30c2d-ed70-4402-8287-9b567c067680	503a47d1-8230-410a-bbd1-b76b0a91ba24	\N	\N	0.200	2.0000	2026-09-07 19:25:55.189	2026-09-07 19:25:55.189
3410d244-2508-479f-8dce-33cb7375e7cf	63f30c2d-ed70-4402-8287-9b567c067680	3b682c2c-c7a5-426b-b223-32e792196c98	\N	\N	0.200	2.0000	2026-09-07 19:25:55.192	2026-09-07 19:25:55.192
8a0910f6-8597-4d4a-834e-24d4a15db050	63f30c2d-ed70-4402-8287-9b567c067680	84c02891-72ff-44f5-8767-75e1b79ec02e	\N	\N	1.200	12.0000	2026-09-07 19:25:55.196	2026-09-07 19:25:55.196
6ed7e2d9-b716-4026-8a3b-5290ebd2ad60	63f30c2d-ed70-4402-8287-9b567c067680	7270809e-5f98-48a2-aa46-a99bf4455bb3	\N	\N	5.000	50.0000	2026-09-07 19:25:55.199	2026-09-07 19:25:55.199
6c6d00f7-b5bd-4c5f-b306-78479e6df6e0	63f30c2d-ed70-4402-8287-9b567c067680	d84cba5d-96a8-432f-a27c-650a3da49cd1	\N	\N	0.200	2.0000	2026-09-07 19:25:55.203	2026-09-07 19:25:55.203
0f21a7bd-bee0-4cb5-8e52-452558066d50	63f30c2d-ed70-4402-8287-9b567c067680	205dcb75-c01e-4312-9fc8-05d1cce9081d	\N	\N	25.000	250.0000	2026-09-07 19:25:55.208	2026-09-07 19:25:55.208
ecf97b74-b229-4969-ab8b-ab000c6476ed	a51c4155-8ed6-4579-8e5c-f111a3b4fb51	c2cce8b2-2bdb-4752-b8a0-946e94b14e19	\N	\N	88.900	889.0000	2026-09-07 19:25:55.214	2026-09-07 19:25:55.214
36725225-25f8-4484-ac80-9d9a84d64cc4	a51c4155-8ed6-4579-8e5c-f111a3b4fb51	7270809e-5f98-48a2-aa46-a99bf4455bb3	\N	\N	5.000	50.0000	2026-09-07 19:25:55.218	2026-09-07 19:25:55.218
0c4ecd10-febc-493c-82e0-2361de4c5940	a51c4155-8ed6-4579-8e5c-f111a3b4fb51	644113e7-6761-492f-a55e-a359c795c5f8	\N	\N	3.000	30.0000	2026-09-07 19:25:55.223	2026-09-07 19:25:55.223
23820498-dfd1-4811-b638-8d6c48d73584	a51c4155-8ed6-4579-8e5c-f111a3b4fb51	eed50ae4-682c-4b3a-9fc6-27b3f992b26e	\N	\N	0.100	1.0000	2026-09-07 19:25:55.227	2026-09-07 19:25:55.227
e7bf5d3a-f61d-46ea-a6a1-1b51ec3e7a5d	a51c4155-8ed6-4579-8e5c-f111a3b4fb51	876f54db-7e02-40f9-917d-94ac8bd2d198	\N	\N	1.000	10.0000	2026-09-07 19:25:55.231	2026-09-07 19:25:55.231
e34c0213-b2f9-4731-8e15-a3f5b3b0e7b1	a51c4155-8ed6-4579-8e5c-f111a3b4fb51	97f87364-f00c-472b-a9dd-5ce36244afb4	\N	\N	0.100	1.0000	2026-09-07 19:25:55.235	2026-09-07 19:25:55.235
7e3c6e95-261e-4a87-9c23-a33471a61027	a51c4155-8ed6-4579-8e5c-f111a3b4fb51	4b5b2284-c252-486b-a8cd-0e2cb39c9928	\N	\N	0.900	9.0000	2026-09-07 19:25:55.239	2026-09-07 19:25:55.239
3646d083-257d-4c59-b915-5e2e7570992c	a51c4155-8ed6-4579-8e5c-f111a3b4fb51	84c02891-72ff-44f5-8767-75e1b79ec02e	\N	\N	1.000	10.0000	2026-09-07 19:25:55.243	2026-09-07 19:25:55.243
f044d8a5-b965-4c01-a7fb-1352982ecbbc	a51c4155-8ed6-4579-8e5c-f111a3b4fb51	503a47d1-8230-410a-bbd1-b76b0a91ba24	\N	\N	0.100	1.0000	2026-09-07 19:25:55.246	2026-09-07 19:25:55.246
fce4bbb2-ddef-4298-b4d6-ae08e609c297	a51c4155-8ed6-4579-8e5c-f111a3b4fb51	3b682c2c-c7a5-426b-b223-32e792196c98	\N	\N	0.050	0.5000	2026-09-07 19:25:55.249	2026-09-07 19:25:55.249
263ba154-c9e5-4916-acdf-a794d006d6b2	7d2a67df-cebd-4a89-8b2d-3fa4503c648d	8849ff42-8f1d-4bb7-9b63-154fb2a329d3	\N	\N	5.000	50.0000	2026-09-07 19:25:55.256	2026-09-07 19:25:55.256
86fb545e-8a05-4ec9-b1fa-e741ed977347	7d2a67df-cebd-4a89-8b2d-3fa4503c648d	a7931626-b6ab-450d-b7e8-484d773cf1aa	\N	\N	5.000	50.0000	2026-09-07 19:25:55.259	2026-09-07 19:25:55.259
492a0f6d-07a6-4483-86f5-9c100be1a505	7d2a67df-cebd-4a89-8b2d-3fa4503c648d	7454fb85-f4a4-4987-8d95-053d98414a77	\N	\N	0.800	8.0000	2026-09-07 19:25:55.262	2026-09-07 19:25:55.262
52b764bf-ab56-464d-98c6-a48fcbb31f87	7d2a67df-cebd-4a89-8b2d-3fa4503c648d	205dcb75-c01e-4312-9fc8-05d1cce9081d	\N	\N	1.000	10.0000	2026-09-07 19:25:55.266	2026-09-07 19:25:55.266
5010e159-4469-483f-8b09-91eb5dd3b548	7d2a67df-cebd-4a89-8b2d-3fa4503c648d	c2cce8b2-2bdb-4752-b8a0-946e94b14e19	\N	\N	87.500	875.0000	2026-09-07 19:25:55.27	2026-09-07 19:25:55.27
e2b0d530-7e45-4e31-9acd-b327b0e0fe45	7d2a67df-cebd-4a89-8b2d-3fa4503c648d	503a47d1-8230-410a-bbd1-b76b0a91ba24	\N	\N	0.100	1.0000	2026-09-07 19:25:55.274	2026-09-07 19:25:55.274
47c37ce0-04a3-449c-8614-910c2eb6f125	7d2a67df-cebd-4a89-8b2d-3fa4503c648d	2585af84-0476-44c1-bddd-6569609dea26	\N	\N	0.200	2.0000	2026-09-07 19:25:55.277	2026-09-07 19:25:55.277
8100ae5d-a6b5-4a30-8d4a-951aad3874a1	7d2a67df-cebd-4a89-8b2d-3fa4503c648d	3b682c2c-c7a5-426b-b223-32e792196c98	\N	\N	0.100	1.0000	2026-09-07 19:25:55.28	2026-09-07 19:25:55.28
42a0ade9-1a24-43dd-9d4c-3831ff1cec63	a645cfea-e95f-4d37-90dd-11e350ad7a84	8849ff42-8f1d-4bb7-9b63-154fb2a329d3	\N	\N	7.000	70.0000	2026-09-07 19:25:55.285	2026-09-07 19:25:55.285
6ed40ddd-9828-4292-b112-d385a3dcf01d	a645cfea-e95f-4d37-90dd-11e350ad7a84	a7931626-b6ab-450d-b7e8-484d773cf1aa	\N	\N	7.000	70.0000	2026-09-07 19:25:55.289	2026-09-07 19:25:55.289
a7b08c84-fa64-4808-a268-4e653011b461	a645cfea-e95f-4d37-90dd-11e350ad7a84	0f97527f-a304-4d88-b05d-69992d0c3d10	\N	\N	1.500	15.0000	2026-09-07 19:25:55.293	2026-09-07 19:25:55.293
4d9ab9ad-3192-49c2-8e7f-90cb41662b60	a645cfea-e95f-4d37-90dd-11e350ad7a84	f5c778e9-bbfc-4fef-aa32-9b32a6db83c7	\N	\N	1.000	10.0000	2026-09-07 19:25:55.296	2026-09-07 19:25:55.296
07a8ea07-b39f-45a7-b877-d41a93d92049	a645cfea-e95f-4d37-90dd-11e350ad7a84	c2cce8b2-2bdb-4752-b8a0-946e94b14e19	\N	\N	82.698	826.9800	2026-09-07 19:25:55.299	2026-09-07 19:25:55.299
d1fe14fd-ba69-439c-866f-3392209f0db2	a645cfea-e95f-4d37-90dd-11e350ad7a84	2585af84-0476-44c1-bddd-6569609dea26	\N	\N	0.200	2.0000	2026-09-07 19:25:55.304	2026-09-07 19:25:55.304
d3ea7235-669b-422f-b58e-a8d0645644ad	a645cfea-e95f-4d37-90dd-11e350ad7a84	4ae04ce7-69dc-4aa3-b91f-38227df1ccc1	\N	\N	0.100	1.0000	2026-09-07 19:25:55.308	2026-09-07 19:25:55.308
c6958f02-e784-4ce7-8a46-4c4cde6de5f3	f83a5612-3ca2-45f4-948b-1fdc5bd9e7fe	c2cce8b2-2bdb-4752-b8a0-946e94b14e19	\N	\N	80.900	809.0000	2026-09-07 19:25:55.313	2026-09-07 19:25:55.313
2485641c-87b4-4702-890a-503f75ba836e	f83a5612-3ca2-45f4-948b-1fdc5bd9e7fe	8849ff42-8f1d-4bb7-9b63-154fb2a329d3	\N	\N	7.000	70.0000	2026-09-07 19:25:55.316	2026-09-07 19:25:55.316
08af24a6-bb6c-40d7-9f8d-36eeef97c9ba	f83a5612-3ca2-45f4-948b-1fdc5bd9e7fe	a7931626-b6ab-450d-b7e8-484d773cf1aa	\N	\N	7.000	70.0000	2026-09-07 19:25:55.32	2026-09-07 19:25:55.32
e27a7999-f1c5-44f6-811d-0e16fbd037e0	f83a5612-3ca2-45f4-948b-1fdc5bd9e7fe	0b0e329a-b9ae-48f1-9d13-65ffb8295b6e	\N	\N	3.000	30.0000	2026-09-07 19:25:55.323	2026-09-07 19:25:55.323
81ca9542-6ee1-4d36-b596-80a460648661	f83a5612-3ca2-45f4-948b-1fdc5bd9e7fe	af5ed9d6-a35f-4f15-bad4-9f834901d8c0	\N	\N	1.000	10.0000	2026-09-07 19:25:55.327	2026-09-07 19:25:55.327
9e118ee5-9aef-41fe-becc-a0a32dcb6271	f83a5612-3ca2-45f4-948b-1fdc5bd9e7fe	7270809e-5f98-48a2-aa46-a99bf4455bb3	\N	\N	1.000	10.0000	2026-09-07 19:25:55.33	2026-09-07 19:25:55.33
e2e05125-ab0d-40ca-af39-94397d37898a	f83a5612-3ca2-45f4-948b-1fdc5bd9e7fe	503a47d1-8230-410a-bbd1-b76b0a91ba24	\N	\N	0.100	1.0000	2026-09-07 19:25:55.334	2026-09-07 19:25:55.334
50de8175-3789-489f-ae8f-d7bb0ee80b9a	f83a5612-3ca2-45f4-948b-1fdc5bd9e7fe	3b682c2c-c7a5-426b-b223-32e792196c98	\N	\N	0.050	0.5000	2026-09-07 19:25:55.34	2026-09-07 19:25:55.34
62301586-5da1-448f-89ea-4c2e2e3a0147	c4413292-1737-45d9-9517-7b127fee38bd	ab9438b3-e9d8-4b33-a5c8-da547e7b5024	\N	\N	78.500	785.0000	2026-09-07 19:25:55.346	2026-09-07 19:25:55.346
e55e6927-c484-4c77-970e-5af1e2e96963	c4413292-1737-45d9-9517-7b127fee38bd	fe8c6e9a-f4ee-4a9a-ba58-d91f49425757	\N	\N	10.000	100.0000	2026-09-07 19:25:55.349	2026-09-07 19:25:55.349
b8ade6fc-9b72-4067-987a-f4ccea36361b	c4413292-1737-45d9-9517-7b127fee38bd	23e5d25d-db99-47d2-8c2b-788174388397	\N	\N	8.000	80.0000	2026-09-07 19:25:55.354	2026-09-07 19:25:55.354
db71ba0e-6755-4d9c-8d4e-09c9faf0c751	c4413292-1737-45d9-9517-7b127fee38bd	8849ff42-8f1d-4bb7-9b63-154fb2a329d3	\N	\N	3.000	30.0000	2026-09-07 19:25:55.357	2026-09-07 19:25:55.357
82f68a29-f141-48e6-ad96-3d53fc4d2ae8	c4413292-1737-45d9-9517-7b127fee38bd	ebfcccbb-22c9-468d-8ee7-f7cdb8cacdb8	\N	\N	0.200	2.0000	2026-09-07 19:25:55.361	2026-09-07 19:25:55.361
ca50815d-ce5a-4d3d-998b-9f51dff927c1	c4413292-1737-45d9-9517-7b127fee38bd	205dcb75-c01e-4312-9fc8-05d1cce9081d	\N	\N	0.100	1.0000	2026-09-07 19:25:55.364	2026-09-07 19:25:55.364
2890ce84-6230-4a8c-9bdc-f389eff99b8c	c4413292-1737-45d9-9517-7b127fee38bd	c2ffefaf-b4c6-4846-94f3-3ecc4f91c466	\N	\N	0.200	2.0000	2026-09-07 19:25:55.367	2026-09-07 19:25:55.367
064996d4-4596-4f9d-b0f0-0744a6c82b1c	e0c6ceee-99db-4c45-8456-bc5af5193ce4	05f1df06-27d0-41ce-9dc4-12f2c6085189	\N	\N	97.800	978.0000	2026-09-07 19:25:55.373	2026-09-07 19:25:55.373
d269ae88-a97a-4997-bfda-ce883863bc6c	e0c6ceee-99db-4c45-8456-bc5af5193ce4	bd88641b-9136-4d77-a681-5862e23a8a74	\N	\N	0.500	5.0000	2026-09-07 19:25:55.377	2026-09-07 19:25:55.377
06e30c01-3a03-438f-90db-94c1f22296be	e0c6ceee-99db-4c45-8456-bc5af5193ce4	fa33e7f3-d81e-41f9-9949-678a92eff8e6	\N	\N	0.500	5.0000	2026-09-07 19:25:55.38	2026-09-07 19:25:55.38
386801ce-6e97-42c3-8a9f-42979389d33f	e0c6ceee-99db-4c45-8456-bc5af5193ce4	12b82ba7-09a5-43b6-a754-56abcb77a4cc	\N	\N	1.000	10.0000	2026-09-07 19:25:55.383	2026-09-07 19:25:55.383
97394591-904a-449d-b947-493680c7ce6c	e0c6ceee-99db-4c45-8456-bc5af5193ce4	ebfcccbb-22c9-468d-8ee7-f7cdb8cacdb8	\N	\N	0.200	2.0000	2026-09-07 19:25:55.387	2026-09-07 19:25:55.387
d4dccd11-ee68-4032-977d-735d9da7307d	e5d7f71c-93be-49ff-bd71-1d0c23958b3f	a5dc8d7c-4590-4800-9638-db8fedc01221	\N	\N	25.000	250.0000	2026-09-07 19:25:55.392	2026-09-07 19:25:55.392
0f0c2fb4-0478-4f90-bfa4-e3c728a59881	e5d7f71c-93be-49ff-bd71-1d0c23958b3f	23e5d25d-db99-47d2-8c2b-788174388397	\N	\N	5.000	50.0000	2026-09-07 19:25:55.395	2026-09-07 19:25:55.395
fa89c65c-42de-420b-9cba-d3b3f9dd775a	e5d7f71c-93be-49ff-bd71-1d0c23958b3f	8849ff42-8f1d-4bb7-9b63-154fb2a329d3	\N	\N	8.000	80.0000	2026-09-07 19:25:55.399	2026-09-07 19:25:55.399
464f0436-1d42-49f2-afff-fb025543e31c	e5d7f71c-93be-49ff-bd71-1d0c23958b3f	a3e414f6-c9f9-4680-933d-3b9c33096a4c	\N	\N	2.000	20.0000	2026-09-07 19:25:55.402	2026-09-07 19:25:55.402
4b757460-bca8-42cc-9e43-27d8ad82a369	e5d7f71c-93be-49ff-bd71-1d0c23958b3f	3d1b2079-8e4f-455f-ba1d-71ed13bb38ed	\N	\N	1.000	10.0000	2026-09-07 19:25:55.406	2026-09-07 19:25:55.406
0b790b3c-8846-435f-be7d-f2f6aab6988f	e5d7f71c-93be-49ff-bd71-1d0c23958b3f	82bbbad6-cce9-48ef-90e1-e3db6d129421	\N	\N	1.000	10.0000	2026-09-07 19:25:55.41	2026-09-07 19:25:55.41
5d6d8deb-9aac-40bf-ab7e-c1d0666d15b5	e5d7f71c-93be-49ff-bd71-1d0c23958b3f	ebfcccbb-22c9-468d-8ee7-f7cdb8cacdb8	\N	\N	0.200	2.0000	2026-09-07 19:25:55.413	2026-09-07 19:25:55.413
d6fddfff-b232-4960-acc0-a98eb6ee97da	e5d7f71c-93be-49ff-bd71-1d0c23958b3f	5bb3d411-d5be-462a-8d26-11725b5d41e5	\N	\N	0.100	1.0000	2026-09-07 19:25:55.416	2026-09-07 19:25:55.416
7e3ea577-da41-4347-a0b6-a266ae6db942	e5d7f71c-93be-49ff-bd71-1d0c23958b3f	ab9438b3-e9d8-4b33-a5c8-da547e7b5024	\N	\N	57.500	575.0000	2026-09-07 19:25:55.421	2026-09-07 19:25:55.421
3c9cb891-9ca9-4075-bed1-9f659dd99e5b	ab424b0e-acc1-4711-a953-a5a9bbd96fd7	ff2e578a-4456-4d54-8bc2-1f9ec6c8cc7c	\N	\N	88.200	882.0000	2026-09-07 19:25:55.426	2026-09-07 19:25:55.426
051420dd-c5f2-4b30-86f9-0be8f9ab82ec	ab424b0e-acc1-4711-a953-a5a9bbd96fd7	7fc5e7e8-2a80-41a4-b513-58adf03367a6	\N	\N	3.000	30.0000	2026-09-07 19:25:55.429	2026-09-07 19:25:55.429
fe89b21a-c78a-46bb-b84c-e03e4416d26f	ab424b0e-acc1-4711-a953-a5a9bbd96fd7	3d83ac6f-b1b9-46dd-8226-77863f5f21e7	\N	\N	3.000	30.0000	2026-09-07 19:25:55.433	2026-09-07 19:25:55.433
463f0a73-9a95-4335-a084-331b7db530ff	ab424b0e-acc1-4711-a953-a5a9bbd96fd7	1773217b-37f1-4d97-a9aa-874c4f539524	\N	\N	0.500	5.0000	2026-09-07 19:25:55.437	2026-09-07 19:25:55.437
e0f28aca-1320-4897-bd62-5481fc16dea9	ab424b0e-acc1-4711-a953-a5a9bbd96fd7	97f87364-f00c-472b-a9dd-5ce36244afb4	\N	\N	0.500	5.0000	2026-09-07 19:25:55.441	2026-09-07 19:25:55.441
e458fab7-f66b-4f37-801c-0427add9de13	ab424b0e-acc1-4711-a953-a5a9bbd96fd7	eed50ae4-682c-4b3a-9fc6-27b3f992b26e	\N	\N	0.100	1.0000	2026-09-07 19:25:55.444	2026-09-07 19:25:55.444
ae098493-0833-4aee-96ab-42eb6c86aa7b	ab424b0e-acc1-4711-a953-a5a9bbd96fd7	0b0e329a-b9ae-48f1-9d13-65ffb8295b6e	\N	\N	1.000	10.0000	2026-09-07 19:25:55.448	2026-09-07 19:25:55.448
8ebe7dd0-1b56-4436-93d1-bb67821ef9bc	ab424b0e-acc1-4711-a953-a5a9bbd96fd7	7270809e-5f98-48a2-aa46-a99bf4455bb3	\N	\N	1.500	15.0000	2026-09-07 19:25:55.451	2026-09-07 19:25:55.451
34f32425-d37c-4933-9b27-98e65165fc0e	ab424b0e-acc1-4711-a953-a5a9bbd96fd7	644113e7-6761-492f-a55e-a359c795c5f8	\N	\N	1.000	10.0000	2026-09-07 19:25:55.455	2026-09-07 19:25:55.455
8b8de426-2b0f-498b-884a-d2cbd5a98a75	ab424b0e-acc1-4711-a953-a5a9bbd96fd7	c0c0e5c8-e317-4103-b8e6-916f73b52026	\N	\N	0.100	1.0000	2026-09-07 19:25:55.459	2026-09-07 19:25:55.459
1885b50d-2453-48a7-bed3-5cde21d56c36	ab424b0e-acc1-4711-a953-a5a9bbd96fd7	4b5b2284-c252-486b-a8cd-0e2cb39c9928	\N	\N	0.800	8.0000	2026-09-07 19:25:55.462	2026-09-07 19:25:55.462
55813ed0-2e3e-4a5e-96d1-9f9d5195609b	ab424b0e-acc1-4711-a953-a5a9bbd96fd7	d84cba5d-96a8-432f-a27c-650a3da49cd1	\N	\N	0.300	3.0000	2026-09-07 19:25:55.465	2026-09-07 19:25:55.465
526244cc-1fc1-4289-90e5-285b69ab436b	ab424b0e-acc1-4711-a953-a5a9bbd96fd7	84c02891-72ff-44f5-8767-75e1b79ec02e	\N	\N	0.100	1.0000	2026-09-07 19:25:55.469	2026-09-07 19:25:55.469
39352eaf-f3c9-4a4d-91c3-9195cde41f0e	bd0545ef-5356-4869-a71f-ff42e94aad6d	c2cce8b2-2bdb-4752-b8a0-946e94b14e19	\N	\N	72.000	720.0000	2026-09-07 19:25:55.475	2026-09-07 19:25:55.475
ca274e6b-ba82-4ba7-88cb-e0e4547f0fa2	bd0545ef-5356-4869-a71f-ff42e94aad6d	6f4a88eb-353d-4c06-8725-7fe107f32668	\N	\N	25.000	250.0000	2026-09-07 19:25:55.479	2026-09-07 19:25:55.479
23637028-e294-4388-afbc-ad6645583436	bd0545ef-5356-4869-a71f-ff42e94aad6d	22fabeae-a648-4909-8618-c6e6704ba256	\N	\N	5.000	50.0000	2026-09-07 19:25:55.483	2026-09-07 19:25:55.483
d4621bf0-4e7f-4a0e-9ddc-d1ceaa09ab07	bd0545ef-5356-4869-a71f-ff42e94aad6d	644113e7-6761-492f-a55e-a359c795c5f8	\N	\N	3.000	30.0000	2026-09-07 19:25:55.487	2026-09-07 19:25:55.487
4aabd517-fb72-4ece-a6c8-e6182305cde5	bd0545ef-5356-4869-a71f-ff42e94aad6d	16dd3cae-f6e5-402f-b187-f841193216e1	\N	\N	1.500	15.0000	2026-09-07 19:25:55.492	2026-09-07 19:25:55.492
c4cbf33d-fd50-49fb-8035-d3d3169b5b8c	bd0545ef-5356-4869-a71f-ff42e94aad6d	73cbd1de-ffb9-4024-90e3-b1709c8dbbfb	\N	\N	1.000	10.0000	2026-09-07 19:25:55.495	2026-09-07 19:25:55.495
73c41df2-22e3-4983-9cfb-eb915bce52c7	bd0545ef-5356-4869-a71f-ff42e94aad6d	7270809e-5f98-48a2-aa46-a99bf4455bb3	\N	\N	0.800	8.0000	2026-09-07 19:25:55.498	2026-09-07 19:25:55.498
9017a3be-4219-4c23-b7a3-9c0fc9767513	bd0545ef-5356-4869-a71f-ff42e94aad6d	8587e682-2575-4153-9ad6-ebd98e42db27	\N	\N	0.100	1.0000	2026-09-07 19:25:55.504	2026-09-07 19:25:55.504
d6f562f3-c965-44b7-adc5-974361971d46	bd0545ef-5356-4869-a71f-ff42e94aad6d	d84cba5d-96a8-432f-a27c-650a3da49cd1	\N	\N	0.200	2.0000	2026-09-07 19:25:55.507	2026-09-07 19:25:55.507
2445d156-6cc3-4a9f-9b37-5dd9abc1020c	bd0545ef-5356-4869-a71f-ff42e94aad6d	6b741b7a-554a-4624-966a-1e311d24e2b5	\N	\N	0.200	2.0000	2026-09-07 19:25:55.511	2026-09-07 19:25:55.511
fba93284-91d2-4f56-af83-eff5c262072f	bd0545ef-5356-4869-a71f-ff42e94aad6d	6e4a171c-6eb7-4f4d-b3af-b2d380335061	\N	\N	2.500	25.0000	2026-09-07 19:25:55.514	2026-09-07 19:25:55.514
295a6d8a-fc37-4839-994b-e17133074b6c	cbc2005a-9781-4ea6-ba80-833467111ae1	c2cce8b2-2bdb-4752-b8a0-946e94b14e19	\N	\N	92.800	928.0000	2026-09-07 19:25:55.52	2026-09-07 19:25:55.52
aaa5a3dc-3111-4e52-9992-64ff14047d62	cbc2005a-9781-4ea6-ba80-833467111ae1	876f54db-7e02-40f9-917d-94ac8bd2d198	\N	\N	3.000	30.0000	2026-09-07 19:25:55.524	2026-09-07 19:25:55.524
0148b0f1-c60b-48c7-a41c-3537c4a63b81	cbc2005a-9781-4ea6-ba80-833467111ae1	7270809e-5f98-48a2-aa46-a99bf4455bb3	\N	\N	2.300	23.0000	2026-09-07 19:25:55.527	2026-09-07 19:25:55.527
7477aca7-6be2-42e0-b894-3d9f8b71848a	cbc2005a-9781-4ea6-ba80-833467111ae1	4b5b2284-c252-486b-a8cd-0e2cb39c9928	\N	\N	0.900	9.0000	2026-09-07 19:25:55.531	2026-09-07 19:25:55.531
f3436c6f-222b-49ec-be5b-c2354f7073f4	cbc2005a-9781-4ea6-ba80-833467111ae1	dd11ade7-d444-49e4-9490-35179c4132cc	\N	\N	0.100	1.0000	2026-09-07 19:25:55.535	2026-09-07 19:25:55.535
832f844e-df21-4e4b-8074-081db2484828	cbc2005a-9781-4ea6-ba80-833467111ae1	8587e682-2575-4153-9ad6-ebd98e42db27	\N	\N	0.500	5.0000	2026-09-07 19:25:55.539	2026-09-07 19:25:55.539
3bfd093e-4dc8-4a82-9a04-322a6a374032	cbc2005a-9781-4ea6-ba80-833467111ae1	3b682c2c-c7a5-426b-b223-32e792196c98	\N	\N	0.200	2.0000	2026-09-07 19:25:55.545	2026-09-07 19:25:55.545
c4bec63c-a94e-47c7-bb4d-454f233cdf14	62f75fd3-9938-4a48-9d13-5ccb7ff36358	7270809e-5f98-48a2-aa46-a99bf4455bb3	\N	\N	5.000	50.0000	2026-09-07 19:25:55.559	2026-09-07 19:25:55.559
5fc832c7-e78a-433f-b50e-b4f126c3bd3a	62f75fd3-9938-4a48-9d13-5ccb7ff36358	644113e7-6761-492f-a55e-a359c795c5f8	\N	\N	3.000	30.0000	2026-09-07 19:25:55.562	2026-09-07 19:25:55.562
b2d22702-8992-4535-9aaa-bec963903018	62f75fd3-9938-4a48-9d13-5ccb7ff36358	05f1df06-27d0-41ce-9dc4-12f2c6085189	\N	\N	8.000	80.0000	2026-09-07 19:25:55.565	2026-09-07 19:25:55.565
c4457f85-9a1c-48af-a1cf-10b0d057e85b	62f75fd3-9938-4a48-9d13-5ccb7ff36358	ab9438b3-e9d8-4b33-a5c8-da547e7b5024	\N	\N	6.000	60.0000	2026-09-07 19:25:55.571	2026-09-07 19:25:55.571
dee5dd88-c77f-4c2c-a0ab-78ae5aed9492	62f75fd3-9938-4a48-9d13-5ccb7ff36358	e5c39f4b-b2ee-4e21-ab5d-6b2ae5a3b0d5	\N	\N	5.000	50.0000	2026-09-07 19:25:55.575	2026-09-07 19:25:55.575
0c97a94b-5623-4f6f-90d7-728f2497fc2a	62f75fd3-9938-4a48-9d13-5ccb7ff36358	8849ff42-8f1d-4bb7-9b63-154fb2a329d3	\N	\N	7.000	70.0000	2026-09-07 19:25:55.578	2026-09-07 19:25:55.578
5b01d94a-2292-4e2a-a3fb-5f15d373d94e	62f75fd3-9938-4a48-9d13-5ccb7ff36358	eed50ae4-682c-4b3a-9fc6-27b3f992b26e	\N	\N	2.000	20.0000	2026-09-07 19:25:55.582	2026-09-07 19:25:55.582
83674112-508e-4d3b-a1fb-d0ceba470d91	62f75fd3-9938-4a48-9d13-5ccb7ff36358	e8f137a2-1f0c-4f32-892d-143497884a7a	\N	\N	2.000	20.0000	2026-09-07 19:25:55.586	2026-09-07 19:25:55.586
02086840-9430-4c68-8e6b-184c4db13a96	62f75fd3-9938-4a48-9d13-5ccb7ff36358	d84cba5d-96a8-432f-a27c-650a3da49cd1	\N	\N	0.250	2.5000	2026-09-07 19:25:55.589	2026-09-07 19:25:55.589
bf7217cf-5fa1-40da-be33-aace3effaaa1	62f75fd3-9938-4a48-9d13-5ccb7ff36358	c2cce8b2-2bdb-4752-b8a0-946e94b14e19	\N	\N	61.750	617.5000	2026-09-07 19:25:55.556	2026-09-08 21:05:02.314
659b4bea-0d66-4cf9-8c74-5e969305b079	cbc2005a-9781-4ea6-ba80-833467111ae1	503a47d1-8230-410a-bbd1-b76b0a91ba24	\N	\N	0.250	2.5000	2026-09-07 19:25:55.542	2026-09-08 21:05:02.314
\.


--
-- Data for Name: formula_variants; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.formula_variants (id, nombre, formula_id, cliente_id, nombre_marca, aroma, color, ph_objetivo, viscosidad, instrucciones, notas, ajustes_json, "createdAt", "updatedAt", pasos_elaboracion) FROM stdin;
\.


--
-- Data for Name: formulas_master; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.formulas_master (id, "codigoFormula", "nombreProducto", version, "densidadTeorica", estado, "createdAt", "updatedAt", pasos_elaboracion) FROM stdin;
2adedd85-03ee-4c05-8e12-a16db63abe0b	FM-0043	CREMA PARA DOLOR MUSCULAR	1	1.0000	ACTIVA	2026-09-08 21:05:02.314	2026-09-08 21:05:02.314	\N
1ef772af-2d57-4378-a172-bbde20b2f26d	FM-0048	CREMA PARA DOLOR MUSCULAR CON MAGNESIO	1	1.0000	ACTIVA	2026-09-08 21:05:02.314	2026-09-08 21:05:02.314	\N
09f4deb9-88c4-4f62-a1a1-759db5bc2840	FM-0074	PERFUME PACO RABANNE LUCKY ECONOMICO	1	1.0000	ACTIVA	2026-09-08 21:05:02.314	2026-09-08 21:05:02.314	\N
1767f862-c56e-4d0e-8741-ed284ab0a975	FM-0075	CREMA HIDRATANTE DE CENTELLA ASIATICA	1	1.0000	ACTIVA	2026-09-08 21:05:02.314	2026-09-08 21:05:02.314	\N
bb3c0eee-185e-4555-865d-db3d233b795e	FM-0076	SERUM FACIAL DE COLAGENO	1	1.0000	ACTIVA	2026-09-09 17:07:02.376	2026-09-09 17:07:02.376	\N
2fcd4746-8c81-4b18-a513-6933fc66784c	FM-0001	SERUM DE  PESTAÑAS 	1	1.0000	ACTIVA	2026-09-07 19:25:53.701	2026-09-07 19:25:53.701	\N
fc39b789-a0bd-486d-8201-67e815f04d2b	FM-0002	SPRAY BUCAL  11 LITROS LIMON Y CLAVO DE OLOR	1	1.0000	ACTIVA	2026-09-07 19:25:53.743	2026-09-07 19:25:53.743	\N
ea7f4752-e231-4974-9b27-d269afd4b898	FM-0003	SPRAY BUCAL  5 LITROS  SANDIA	1	1.0000	ACTIVA	2026-09-07 19:25:53.764	2026-09-07 19:25:53.764	\N
281140ac-def3-4db6-964c-a7bad6a2ca74	FM-0004	GEL SANGRE DE DRAGON - ROJO	1	1.0000	ACTIVA	2026-09-07 19:25:53.786	2026-09-07 19:25:53.786	\N
3754d35c-a138-4a18-9544-78120075ee59	FM-0005	TRINNIDROP 	1	1.0000	ACTIVA	2026-09-07 19:25:53.821	2026-09-07 19:25:53.821	\N
9406a8fa-3e2e-4542-87d2-bd67ecfe72ea	FM-0006	ACEITE PARA CABELLO 10 LITROS 	1	1.0000	ACTIVA	2026-09-07 19:25:53.84	2026-09-07 19:25:53.84	\N
1ba4894e-5696-4a4d-8415-b1b29c8dff70	FM-0007	SERUM PARA OJERAS  (4.5 a 5.5 pH)  20 LITROS	1	1.0000	ACTIVA	2026-09-07 19:25:53.857	2026-09-07 19:25:53.857	\N
535de50d-08be-43d1-8153-220a99332e2a	FM-0008	BLANQUEADOR DENTAL EN GEL 10 KILOS	1	1.0000	ACTIVA	2026-09-07 19:25:53.89	2026-09-07 19:25:53.89	\N
23fc0017-6691-46ac-a72d-7727d5b615bd	FM-0009	SELLADOR NANO CERAMICO  10 LITROS	1	1.0000	ACTIVA	2026-09-07 19:25:53.928	2026-09-07 19:25:53.928	\N
9df24ff9-f7ed-471d-98a7-a6e64e6b3da2	FM-0010	PERFUME PACO RABANNE LUCKY - MARRON	1	1.0000	ACTIVA	2026-09-07 19:25:53.941	2026-09-07 19:25:53.941	\N
bbcf2157-0fbd-4eb5-9903-dae3aa077a8e	FM-0011	GEL MUSCULAR 	1	1.0000	ACTIVA	2026-09-07 19:25:53.969	2026-09-07 19:25:53.969	\N
199fed75-1305-4e0c-acd8-4dc190b78213	FM-0012	DIAMANTEX- AZUL	1	1.0000	ACTIVA	2026-09-07 19:25:53.986	2026-09-07 19:25:53.986	\N
195d42cd-b05b-48f4-b4d6-4583a604ab29	FM-0013	ACEITE SERUM PARA CANAS PARA CABELLO 15 LITROS	1	1.0000	ACTIVA	2026-09-07 19:25:54.012	2026-09-07 19:25:54.012	\N
30615099-25ff-46c8-bf72-f8d5ac474851	FM-0014	CREMA REAFIRMANTE  (4.5 a 5.5 pH)  60 LITROS	1	1.0000	ACTIVA	2026-09-07 19:25:54.037	2026-09-07 19:25:54.037	\N
0c2eaddd-088e-49a5-be6d-30ed489f1d4e	FM-0015	SPRAY DOLORES MUSCULARES	1	1.0000	ACTIVA	2026-09-07 19:25:54.074	2026-09-07 19:25:54.074	\N
1cdda722-2d1e-4f9d-b4e9-8234dfbef6a3	FM-0016	SHAMPOO CON MINOXIDIL - EROS  	1	1.0000	ACTIVA	2026-09-07 19:25:54.095	2026-09-07 19:25:54.095	\N
c37e5ccc-3f42-42d9-9ba2-0e1b648962ef	FM-0017	SPRAY DE OIDOS - ALFALION - LUIS MARIN	1	1.0000	ACTIVA	2026-09-07 19:25:54.123	2026-09-07 19:25:54.123	\N
df60ec2d-029b-4188-866d-15bd8bbe4742	FM-0018	SERUM LIQUIDO DE ALOE VERA  	1	1.0000	ACTIVA	2026-09-07 19:25:54.139	2026-09-07 19:25:54.139	\N
21a73464-7053-4414-97c2-20b27ff83606	FM-0019	SERUM ACEITOSO	1	1.0000	ACTIVA	2026-09-07 19:25:54.175	2026-09-07 19:25:54.175	\N
b8fd598f-5641-4fc3-b3a1-58d5441f1112	FM-0020	PERFUME GOOD GIRL  - ROJO	1	1.0000	ACTIVA	2026-09-07 19:25:54.187	2026-09-07 19:25:54.187	\N
04d5fe44-9f1a-4dd8-9e0b-261153744151	FM-0021	CREMA PARA CRECIMIENTO DE CABELLO 	1	1.0000	ACTIVA	2026-09-07 19:25:54.214	2026-09-07 19:25:54.214	\N
3ee7396b-c388-41d6-b376-3b4de70db28c	FM-0022	GEL TENSOR INSTANTANEO TRANSPARENTE	1	1.0000	ACTIVA	2026-09-07 19:25:54.247	2026-09-07 19:25:54.247	\N
877c7f9a-6407-42f3-baf4-679c30f11acb	FM-0023	SPRAY ANTIARRUGAS REAFIRMANTE O ANTIARUGAS   20 LITROS	1	1.0000	ACTIVA	2026-09-07 19:25:54.283	2026-09-07 19:25:54.283	\N
2cefd3e0-2c69-40be-8554-6c3e45e27f28	FM-0024	CREMA PARA CELULITIS	1	1.0000	ACTIVA	2026-09-07 19:25:54.303	2026-09-07 19:25:54.303	\N
f1a31a6e-f657-48ac-884c-c57388b7a7eb	FM-0025	SHAMPOO CON DE RICINO 	1	1.0000	ACTIVA	2026-09-07 19:25:54.333	2026-09-07 19:25:54.333	\N
8a1792cf-f2f2-492c-917c-472cab09d40d	FM-0026	SOLUCION UÑAS SANAS	1	1.0000	ACTIVA	2026-09-07 19:25:54.352	2026-09-07 19:25:54.352	\N
387fe6a3-d575-4a05-9fda-38be4c10bfe5	FM-0027	ACEITE LIMPIADOR FACIAL 	1	1.0000	ACTIVA	2026-09-07 19:25:54.372	2026-09-07 19:25:54.372	\N
3eac95a0-c2a9-44e1-9a0d-0d12654d44ea	FM-0028	ACEITE CAPILAR	1	1.0000	ACTIVA	2026-09-07 19:25:54.388	2026-09-07 19:25:54.388	\N
641d562c-5d86-4365-9add-fb105edbdea1	FM-0029	SOLUCION TOPICA LIMPIADORA PARA MASCOTAS	1	1.0000	ACTIVA	2026-09-07 19:25:54.396	2026-09-07 19:25:54.396	\N
959e93ed-f308-432c-9cd1-cdfb391cdca8	FM-0030	SERUM POST AFEITADO CALMANTE E ILUMINADOR 	1	1.0000	ACTIVA	2026-09-07 19:25:54.408	2026-09-07 19:25:54.408	\N
70f3baf6-f3f8-4617-8611-5d00114e68e7	FM-0031	PERFUME BORN IN ROMA VALENTINO 	1	1.0000	ACTIVA	2026-09-07 19:25:54.425	2026-09-07 19:25:54.425	\N
4489baaa-e5b3-45c4-881a-510bb69428c1	FM-0032	DESODORANTE ROLL ON	1	1.0000	ACTIVA	2026-09-07 19:25:54.458	2026-09-07 19:25:54.458	\N
e202a2f1-f630-48da-b990-b2d570fddcb0	FM-0033	ACEITE ANTIVELLO CORPORAL	1	1.0000	ACTIVA	2026-09-07 19:25:54.481	2026-09-07 19:25:54.481	\N
3efa86f9-0038-4e71-8b81-06027b636880	FM-0034	BARRA DE ARRUGA 	1	1.0000	ACTIVA	2026-09-07 19:25:54.494	2026-09-07 19:25:54.494	\N
5a80ac43-d378-4f7e-b48f-9d79d9ac6eee	FM-0035	CREMA ANALGESICA TRIPLE	1	1.0000	ACTIVA	2026-09-07 19:25:54.499	2026-09-07 19:25:54.499	\N
3403329c-8bac-486c-9471-49cbbcdd591c	FM-0036	ACEITE DE VARICES	1	1.0000	ACTIVA	2026-09-07 19:25:54.519	2026-09-07 19:25:54.519	\N
0de88a42-6a50-461f-8bc8-d26716e66807	FM-0037	CREMA EXFOLIANTE	1	1.0000	ACTIVA	2026-09-07 19:25:54.539	2026-09-07 19:25:54.539	\N
e09d08f7-f9f2-4caf-a5a5-8f00fb54acfa	FM-0038	SUGAR BODY SCRUB	1	1.0000	ACTIVA	2026-09-07 19:25:54.569	2026-09-07 19:25:54.569	\N
2b5d9e14-6b19-4f32-a141-d5c400d5dab8	FM-0039	PERFUMADOR ACEITOSO PARA AUTOS 	1	1.0000	ACTIVA	2026-09-07 19:25:54.605	2026-09-07 19:25:54.605	\N
5f47c58f-48ab-4fce-8d58-5b9381e2bf94	FM-0040	LIMPIADOR QUITAGRASA MULTIUSOS	1	1.0000	ACTIVA	2026-09-07 19:25:54.615	2026-09-07 19:25:54.615	\N
1f2c6748-1665-49a4-a5eb-471248fedd23	FM-0041	CREMA DE CICATRICES 	1	1.0000	ACTIVA	2026-09-07 19:25:54.635	2026-09-07 19:25:54.635	\N
69642105-98cb-4bb6-b7ee-f7fb34f102b9	FM-0042	ELHOE 4%  10 LITROS - AZUL	1	1.0000	ACTIVA	2026-09-07 19:25:54.658	2026-09-07 19:25:54.658	\N
42303345-79c9-4268-86d9-24c93f0786cb	FM-0044	ACEITE PARA CABELLO 10 LITROS - SIN COLOR	1	1.0000	ACTIVA	2026-09-07 19:25:54.685	2026-09-07 19:25:54.685	\N
f9259e6c-a178-4f5d-8b44-4de6fe904855	FM-0045	CREMA VENENO DE ABEJA     	1	1.0000	ACTIVA	2026-09-07 19:25:54.698	2026-09-07 19:25:54.698	\N
0a1bb771-0aa4-471b-891b-9822ed8ef8fd	FM-0046	TONICO  PARA UÑAS 	1	1.0000	ACTIVA	2026-09-07 19:25:54.729	2026-09-07 19:25:54.729	\N
1fd70156-cb41-4301-9eb1-748fb6fbd7b1	FM-0047	TONICO DE MASCOTAS (RENOVAPET) - GEYMA	1	1.0000	ACTIVA	2026-09-07 19:25:54.76	2026-09-07 19:25:54.76	\N
783e8a87-7897-4631-ae0e-1fee3f129ff1	FM-0049	CREMA PARA ESTRIAS     20 KILOS	1	1.0000	ACTIVA	2026-09-07 19:25:54.81	2026-09-07 19:25:54.81	\N
93b33c9b-3ee3-44d5-beb7-1adb90616626	FM-0050	ELHOE 0.3% - 60 LITROS	1	1.0000	ACTIVA	2026-09-07 19:25:54.847	2026-09-07 19:25:54.847	\N
56b7d557-6a88-4ee4-96a7-30d0c70a5f2b	FM-0051	TONICO VERRUGA  20 LITROS - COLOR ROJO	1	1.0000	ACTIVA	2026-09-07 19:25:54.868	2026-09-07 19:25:54.868	\N
c0a33a39-fb99-496f-a878-029100720c3d	FM-0052	ACEITE PARA CABELLO 10 LITROS - COLOR VERDE AMARILLO	1	1.0000	ACTIVA	2026-09-07 19:25:54.891	2026-09-07 19:25:54.891	\N
6be6cad0-e881-4131-9247-46cb5b05053b	FM-0053	SERUM CON VITAMINA C  (4.5 a 5.5 pH)  20 LITROS	1	1.0000	ACTIVA	2026-09-07 19:25:54.906	2026-09-07 19:25:54.906	\N
6bcbd4d2-7d46-490a-a82f-6cbc025d5950	FM-0054	SPRAY ANTIARRUGAS   5.5 Ph -  20 LITROS	1	1.0000	ACTIVA	2026-09-07 19:25:54.934	2026-09-07 19:25:54.934	\N
20781650-1f04-4024-b160-eeaf427ab8b2	FM-0055	SERUM CLAREADOR 	1	1.0000	ACTIVA	2026-09-07 19:25:54.962	2026-09-07 19:25:54.962	\N
0ed4c5e2-a367-450c-8b74-c5618d6c6d0e	FM-0056	CREMA REPARADORA CON VITAMINA E	1	1.0000	ACTIVA	2026-09-07 19:25:55.009	2026-09-07 19:25:55.009	\N
74705cab-531b-484d-ac69-7915ea330150	FM-0057	CREMA DERMA BEE	1	1.0000	ACTIVA	2026-09-07 19:25:55.051	2026-09-07 19:25:55.051	\N
7e50e177-ea3f-4957-883e-dafc4111bd74	FM-0058	LACA ANTOMICOTICA 	1	1.0000	ACTIVA	2026-09-07 19:25:55.078	2026-09-07 19:25:55.078	\N
a4b86189-0d2c-4786-8f85-a552b5203bb8	FM-0059	PERFUME PARA AUTOS MIX FRUTAS 65 LITROS	1	1.0000	ACTIVA	2026-09-07 19:25:55.091	2026-09-07 19:25:55.091	\N
586fd5b3-e7f3-4288-9df4-53ecf6d29dbf	FM-0060	SILICONA PARA TABLERO 	1	1.0000	ACTIVA	2026-09-07 19:25:55.127	2026-09-07 19:25:55.127	\N
420a89ef-8365-4c22-94d1-cefde9803adb	FM-0061	SERUM PARA VERRUGA  - DIEGO MENA	1	1.0000	ACTIVA	2026-09-07 19:25:55.16	2026-09-07 19:25:55.16	\N
63f30c2d-ed70-4402-8287-9b567c067680	FM-0062	GEL SANGRE DE DRAGON - CORAL	1	1.0000	ACTIVA	2026-09-07 19:25:55.177	2026-09-07 19:25:55.177	\N
7d2a67df-cebd-4a89-8b2d-3fa4503c648d	FM-0064	CREMA FACIAL PRIMER ANTES DE LA BASE ( dioxido de titanio) 	1	1.0000	ACTIVA	2026-09-07 19:25:55.252	2026-09-07 19:25:55.252	\N
a645cfea-e95f-4d37-90dd-11e350ad7a84	FM-0065	CREMA DE PEINAR Ph 5 (100 kilos) KARSSEL	1	1.0000	ACTIVA	2026-09-07 19:25:55.282	2026-09-07 19:25:55.282	\N
f83a5612-3ca2-45f4-948b-1fdc5bd9e7fe	FM-0066	CREMA REAFIRMANTE  (VENENO DE ABEJA)   70 KILOS	1	1.0000	ACTIVA	2026-09-07 19:25:55.309	2026-09-07 19:25:55.309	\N
c4413292-1737-45d9-9517-7b127fee38bd	FM-0067	BALSAMO DE ARRUGAS	1	1.0000	ACTIVA	2026-09-07 19:25:55.343	2026-09-07 19:25:55.343	\N
e0c6ceee-99db-4c45-8456-bc5af5193ce4	FM-0068	POMADA DE ARNICA	1	1.0000	ACTIVA	2026-09-07 19:25:55.369	2026-09-07 19:25:55.369	\N
e5d7f71c-93be-49ff-bd71-1d0c23958b3f	FM-0069	BALSAMO DE CICATRICES	1	1.0000	ACTIVA	2026-09-07 19:25:55.388	2026-09-07 19:25:55.388	\N
ab424b0e-acc1-4711-a953-a5a9bbd96fd7	FM-0070	SERUM ANTI CAIDA DE CABELLO	1	1.0000	ACTIVA	2026-09-07 19:25:55.423	2026-09-07 19:25:55.423	\N
bd0545ef-5356-4869-a71f-ff42e94aad6d	FM-0071	JABON LIQUIDO CON TERBINAFINA	1	1.0000	ACTIVA	2026-09-07 19:25:55.471	2026-09-07 19:25:55.471	\N
cbc2005a-9781-4ea6-ba80-833467111ae1	FM-0072	GEL INTIMO HIDRATANTE	1	1.0000	ACTIVA	2026-09-07 19:25:55.516	2026-09-07 19:25:55.516	\N
62f75fd3-9938-4a48-9d13-5ccb7ff36358	FM-0073	CREMA CORRECTORA PARA LABIOS	1	1.0000	ACTIVA	2026-09-07 19:25:55.551	2026-09-07 19:25:55.551	\N
a51c4155-8ed6-4579-8e5c-f111a3b4fb51	FM-0063	SERUM LIQUIDO DE ALOE VERA 	1	1.0000	INACTIVA	2026-09-07 19:25:55.21	2026-09-08 21:05:02.314	\N
\.


--
-- Data for Name: incidencias_lote; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.incidencias_lote (id, "loteProduccionId", "reportadoPorId", "tipoIncidencia", descripcion, "impactoMerma", "createdAt") FROM stdin;
\.


--
-- Data for Name: insumos; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.insumos (id, codigo, nombre, "familiaId", "unidadMedida", "unidadMedidaVisual", categoria, "proveedorHistorico", "stockTeorico", "stockReal", "stockMinimo", "costoUnitario", estado, tipo, "createdAt", "updatedAt", estado_fisico, es_solo_formula) FROM stdin;
e254d18a-5a27-49d8-ac93-7b001a124930	INS-002	ACEITE DE CALENDULA	f3d25455-ed0b-4167-93e1-b03b5200e551	GR	\N	\N	\N	7081.0000	7081.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:50.889	2026-09-07 19:25:50.889	ACEITE ESENCIAL	f
3d1b2079-8e4f-455f-ba1d-71ed13bb38ed	INS-003	ACEITE DE JOJOBA	f3d25455-ed0b-4167-93e1-b03b5200e551	GR	\N	\N	\N	6123.0000	6123.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:50.892	2026-09-07 19:25:50.892	ACEITE ESENCIAL	f
5caf121a-99a7-4ead-b8df-7c48a02818db	INS-004	ACEITE DE NEEM	f3d25455-ed0b-4167-93e1-b03b5200e551	GR	\N	\N	\N	1924.0000	1924.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:50.895	2026-09-07 19:25:50.895	LIQUIDO	f
f5c778e9-bbfc-4fef-aa32-9b32a6db83c7	INS-005	ACEITE DE RICINO	f3d25455-ed0b-4167-93e1-b03b5200e551	GR	\N	\N	\N	60694.0000	60694.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:50.898	2026-09-07 19:25:50.898	LIQUIDO	f
dc1761ba-bf39-41fc-bc4d-e48b3e2e1114	INS-006	ACEITE DE ROMERO	f3d25455-ed0b-4167-93e1-b03b5200e551	GR	\N	\N	\N	9935.0000	9935.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:50.9	2026-09-07 19:25:50.9	LIQUIDO	f
6b1e6d35-4100-45ab-bef7-91f43803549d	INS-007	ACEITE ESENCIAL DE CITRONELA	f3d25455-ed0b-4167-93e1-b03b5200e551	GR	\N	\N	\N	105.0000	105.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:50.903	2026-09-07 19:25:50.903	LIQUIDO / ESENCIA	f
2a7330af-31b4-4c6f-acf7-ba076bc22aab	INS-008	ACEITE ESENCIAL EUCALIPTO	f3d25455-ed0b-4167-93e1-b03b5200e551	GR	\N	\N	\N	1133.0000	1133.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:50.906	2026-09-07 19:25:50.906	ACEITE ESENCIAL	f
82bbbad6-cce9-48ef-90e1-e3db6d129421	INS-001	ACEITE DE ALMENDRAS	f3d25455-ed0b-4167-93e1-b03b5200e551	GR	\N	\N	\N	6530.0000	6530.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:50.88	2026-09-09 13:21:17.7	ACEITE ESENCIAL	f
fa33e7f3-d81e-41f9-9949-678a92eff8e6	INS-009	ACEITE ESENCIAL LAVANDA	f3d25455-ed0b-4167-93e1-b03b5200e551	GR	\N	\N	\N	9706.0000	9706.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:50.909	2026-09-07 19:25:50.909	ACEITE ESENCIAL	f
ad8d4fcd-8173-4bab-a6d8-221fc45396a6	INS-010	ACEITE ESENCIAL MENTA	f3d25455-ed0b-4167-93e1-b03b5200e551	GR	\N	\N	\N	1452.0000	1452.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:50.912	2026-09-07 19:25:50.912	ACEITE ESENCIAL (LT)	f
d8ea939d-a926-4883-aa59-1447b492e135	INS-052	CARBONATO 400	7aecccbf-3f81-4d96-b5df-86efbb1d5169	GR	\N	\N	\N	42247.0000	42247.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.034	2026-09-07 19:25:51.034	POLVO	f
5bb3d411-d5be-462a-8d26-11725b5d41e5	INS-011	ACEITE ESENCIAL TEA TREE	f3d25455-ed0b-4167-93e1-b03b5200e551	GR	\N	\N	\N	21519.0000	21519.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:50.914	2026-09-07 19:25:50.914	LIQUIDO	f
21e40a49-e4d9-43f0-b94d-dbba64570dd4	INS-012	ACEITE ROSA MOSQUETA	f3d25455-ed0b-4167-93e1-b03b5200e551	GR	\N	\N	\N	4258.0000	4258.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:50.922	2026-09-07 19:25:50.922	ACEITE ESENCIAL	f
f74e5cd9-0d3f-425f-b46e-904fd7669650	INS-013	ACIDO ACETICO	e76cf865-819b-47d0-9e60-fbcbed29f2dc	GR	\N	\N	\N	12686.0000	12686.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:50.925	2026-09-07 19:25:50.925	LIQUIDO	f
59b5bd63-1199-4880-90d9-519213f9b67d	INS-014	ACIDO ASCORBICO	e76cf865-819b-47d0-9e60-fbcbed29f2dc	GR	\N	\N	\N	7350.0000	7350.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:50.928	2026-09-07 19:25:50.928	POLVO	f
2be1c138-5b1e-459d-bb39-ab0e210b426c	INS-015	ACIDO BENZOICO	e76cf865-819b-47d0-9e60-fbcbed29f2dc	GR	\N	\N	\N	727.0000	727.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:50.93	2026-09-07 19:25:50.93	POLVO	f
1a65b0df-716d-4352-8e1d-506dfbf946fd	INS-016	ACIDO BORICO	e76cf865-819b-47d0-9e60-fbcbed29f2dc	GR	\N	\N	\N	6440.0000	6440.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:50.933	2026-09-07 19:25:50.933	POLVO	f
2585af84-0476-44c1-bddd-6569609dea26	INS-017	ACIDO CITRICO	e76cf865-819b-47d0-9e60-fbcbed29f2dc	GR	\N	\N	\N	17161.0000	17161.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:50.937	2026-09-07 19:25:50.937	POLVO	f
8c976f06-4a53-4784-8b2d-c1648fa3a3b8	INS-018	ACIDO ESTEARICO	e76cf865-819b-47d0-9e60-fbcbed29f2dc	GR	\N	\N	\N	75255.0000	75255.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:50.94	2026-09-07 19:25:50.94	POLVO	f
7f2576a8-7dfc-4bb4-8a4f-04170492a8e5	INS-019	ACIDO FOSFORICO	e76cf865-819b-47d0-9e60-fbcbed29f2dc	GR	\N	\N	\N	446.0000	446.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:50.942	2026-09-07 19:25:50.942	LIQUIDO	f
dd11ade7-d444-49e4-9490-35179c4132cc	INS-020	ACIDO HIALURONICO	e76cf865-819b-47d0-9e60-fbcbed29f2dc	GR	\N	\N	\N	3642.0000	3642.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:50.945	2026-09-07 19:25:50.945	POLVO	f
84f19242-2248-4ff3-b333-abb36b715f2a	INS-021	ACIDO KOJICO	e76cf865-819b-47d0-9e60-fbcbed29f2dc	GR	\N	\N	\N	7266.0000	7266.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:50.947	2026-09-07 19:25:50.947	POLVO	f
becf6944-0163-4bed-a3a5-25908da5ecd1	INS-022	ACIDO LACTICO	e76cf865-819b-47d0-9e60-fbcbed29f2dc	GR	\N	\N	\N	10835.0000	10835.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:50.949	2026-09-07 19:25:50.949	LIQUIDO	f
c569a318-267a-4315-9bd0-7b6fe75ff45e	INS-023	ACIDO MANDELICO	e76cf865-819b-47d0-9e60-fbcbed29f2dc	GR	\N	\N	\N	1872.0000	1872.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:50.953	2026-09-07 19:25:50.953	POLVO (USP)	f
8778c09f-3f10-46ae-b4a6-950c62775a8b	INS-024	ACIDO OLEICO	e76cf865-819b-47d0-9e60-fbcbed29f2dc	GR	\N	\N	\N	820.0000	820.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:50.956	2026-09-07 19:25:50.956	LIQUIDO	f
64534917-1fa8-4ad6-aef5-58254449a729	INS-025	ACIDO SALICILICO	e76cf865-819b-47d0-9e60-fbcbed29f2dc	GR	\N	\N	\N	47776.0000	47776.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:50.959	2026-09-07 19:25:50.959	POLVO	f
6a8ce5ca-c130-42b9-9ebb-5eeb00e76eab	INS-026	ACIDO SULFONICO	e76cf865-819b-47d0-9e60-fbcbed29f2dc	GR	\N	\N	\N	12028.0000	12028.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:50.961	2026-09-07 19:25:50.961	LIQUIDO	f
1ee9c4ca-13cb-4386-a480-9e35c6a6484c	INS-027	ACIDO TIOGLICOLICO	e76cf865-819b-47d0-9e60-fbcbed29f2dc	GR	\N	\N	\N	4515.0000	4515.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:50.963	2026-09-07 19:25:50.963	LIQUIDO	f
e4261caf-b4e8-4fff-8349-48d8d21c89f5	INS-028	ACIDO UNDECILEICO	e76cf865-819b-47d0-9e60-fbcbed29f2dc	GR	\N	\N	\N	285.0000	285.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:50.966	2026-09-07 19:25:50.966	LIQUIDO	f
4ae04ce7-69dc-4aa3-b91f-38227df1ccc1	INS-029	ACTICIDE	90b57950-0d6f-416c-9b55-eecdd7816fcd	GR	\N	\N	\N	4941.0000	4941.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:50.969	2026-09-07 19:25:50.969	LIQUIDO	f
c2cce8b2-2bdb-4752-b8a0-946e94b14e19	INS-030	AGUA DESIONIZADA	459481c9-5211-48c8-94e6-932065ffdcd1	GR	\N	\N	\N	364568.0000	364568.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:50.972	2026-09-07 19:25:50.972	LIQUIDO	f
ff2e578a-4456-4d54-8bc2-1f9ec6c8cc7c	INS-031	AGUA DESTILADA	459481c9-5211-48c8-94e6-932065ffdcd1	GR	\N	\N	\N	15576.0000	15576.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:50.975	2026-09-07 19:25:50.975	LIQUIDO	f
9c452016-ddf6-4271-bedc-b9bd5ee69ad8	INS-032	ALANTOINA	e76cf865-819b-47d0-9e60-fbcbed29f2dc	GR	\N	\N	\N	4110.0000	4110.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:50.978	2026-09-07 19:25:50.978	POLVO	f
f0cbaabe-0290-42b3-a5a2-d637cb5c584f	INS-033	ALCANFOR	e76cf865-819b-47d0-9e60-fbcbed29f2dc	GR	\N	\N	\N	13516.0000	13516.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:50.98	2026-09-07 19:25:50.98	POLVO	f
8849ff42-8f1d-4bb7-9b63-154fb2a329d3	INS-034	ALCOHOL CETILICO	4e3404d0-f57c-4447-b1cf-fd2f645f40c2	GR	\N	\N	\N	7499.0000	7499.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:50.983	2026-09-07 19:25:50.983	GRANO	f
9c3c9b3b-7eef-4d3c-bc51-df944f79b354	INS-035	ALCOHOL EXTRA NEUTRO 96%	459481c9-5211-48c8-94e6-932065ffdcd1	GR	\N	\N	\N	200000.0000	200000.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:50.986	2026-09-07 19:25:50.986	LIQUIDO (L)	f
9f73b776-f31c-4aaa-824f-2d10b9332f3e	INS-036	ALCOHOL ISOPROPILICO	459481c9-5211-48c8-94e6-932065ffdcd1	GR	\N	\N	\N	47870.0000	47870.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:50.99	2026-09-07 19:25:50.99	LIQUIDO (L)	f
ff28dc8d-0d58-44b5-9c30-d752cae50a6b	INS-037	ALCOHOL LAURICO	459481c9-5211-48c8-94e6-932065ffdcd1	GR	\N	\N	\N	200829.0000	200829.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:50.993	2026-09-07 19:25:50.993	LIQUIDO	f
2dc9f7e8-8312-4397-a326-01c576bb5474	INS-038	ANTIESPUMANTE BLANCO	90b57950-0d6f-416c-9b55-eecdd7816fcd	GR	\N	\N	\N	1216.0000	1216.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:50.995	2026-09-07 19:25:50.995	LIQUIDO	f
ed9dcb9b-ee3c-45e0-b439-c211c2c076c2	INS-039	ANTIESPUMANTE INDUSTRIAL	90b57950-0d6f-416c-9b55-eecdd7816fcd	GR	\N	\N	\N	1893.0000	1893.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:50.998	2026-09-07 19:25:50.998	LIQUIDO	f
c8637838-5f01-4fc6-8683-627af2319ab0	INS-040	ARCILLA BLANCA	7aecccbf-3f81-4d96-b5df-86efbb1d5169	GR	\N	\N	\N	23660.0000	23660.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.001	2026-09-07 19:25:51.001	POLVO	f
9efb8c66-684a-4022-86fb-df9deebc5148	INS-041	AUROL NACARANTE SDS	90b57950-0d6f-416c-9b55-eecdd7816fcd	GR	\N	\N	\N	812.0000	812.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.004	2026-09-07 19:25:51.004	LIQUIDO	f
bb068fc4-e4e9-4ee5-92ab-2cd315ad8cc7	INS-042	BENCINA	459481c9-5211-48c8-94e6-932065ffdcd1	GR	\N	\N	\N	22700.0000	22700.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.007	2026-09-07 19:25:51.007	LIQUIDO (L)	f
503a47d1-8230-410a-bbd1-b76b0a91ba24	INS-043	BENZOATO	90b57950-0d6f-416c-9b55-eecdd7816fcd	GR	\N	\N	\N	16149.0000	16149.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.009	2026-09-07 19:25:51.009	POLVO	f
22fabeae-a648-4909-8618-c6e6704ba256	INS-044	BETAINA	5e122e5f-f303-42ac-baab-586f4ec650d4	GR	\N	\N	\N	172001.0000	172001.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.012	2026-09-07 19:25:51.012	LIQUIDO	f
e388eb54-9f5e-405f-8d20-496024c952fb	INS-045	BICARBONATO FOOD GRADE	7aecccbf-3f81-4d96-b5df-86efbb1d5169	GR	\N	\N	\N	18019.0000	18019.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.014	2026-09-07 19:25:51.014	POLVO	f
c0c0e5c8-e317-4103-b8e6-916f73b52026	INS-046	BIOTINA	e76cf865-819b-47d0-9e60-fbcbed29f2dc	GR	\N	\N	\N	984.0000	984.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.017	2026-09-07 19:25:51.017	POLVO	f
259a5b05-d82a-4099-a642-61b2231d6ead	INS-047	BIOTINA 2%	e76cf865-819b-47d0-9e60-fbcbed29f2dc	GR	\N	\N	\N	510.0000	510.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.021	2026-09-07 19:25:51.021	POLVO	f
bcbc8cc8-10e5-4c24-84a9-e267492364bb	INS-048	BUTIL (BUTILGLICOL)	459481c9-5211-48c8-94e6-932065ffdcd1	GR	\N	\N	\N	24490.0000	24490.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.023	2026-09-07 19:25:51.023	LIQUIDO	f
0b0e329a-b9ae-48f1-9d13-65ffb8295b6e	INS-049	CAFEINA	e76cf865-819b-47d0-9e60-fbcbed29f2dc	GR	\N	\N	\N	36600.0000	36600.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.026	2026-09-07 19:25:51.026	POLVO	f
71b6405e-25d0-4545-820a-30364ac4c89e	INS-050	CAL	7aecccbf-3f81-4d96-b5df-86efbb1d5169	GR	\N	\N	\N	26131.0000	26131.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.029	2026-09-07 19:25:51.029	POLVO	f
adaf4fa9-589b-4440-b3c4-8c20568d4b49	INS-051	CARBONATO 1000	7aecccbf-3f81-4d96-b5df-86efbb1d5169	GR	\N	\N	\N	48310.0000	48310.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.031	2026-09-07 19:25:51.031	POLVO	f
2556b4df-e535-47b5-bfcb-a34622f6f0fe	INS-053	CARBOPOL	8df3c4e0-4b0b-4531-9812-4500d79438a2	GR	\N	\N	\N	27300.0000	27300.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.037	2026-09-07 19:25:51.037	POLVO	f
4b5b2284-c252-486b-a8cd-0e2cb39c9928	INS-054	CELLOSIZE	8df3c4e0-4b0b-4531-9812-4500d79438a2	GR	\N	\N	\N	8194.0000	8194.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.039	2026-09-07 19:25:51.039	POLVO	f
23e5d25d-db99-47d2-8c2b-788174388397	INS-055	CERA CARNAUBA	4e3404d0-f57c-4447-b1cf-fd2f645f40c2	GR	\N	\N	\N	32900.0000	32900.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.042	2026-09-07 19:25:51.042	GRANO	f
a5dc8d7c-4590-4800-9638-db8fedc01221	INS-056	CERA DE ABEJA REFINADA (TRANSPARENTE)	4e3404d0-f57c-4447-b1cf-fd2f645f40c2	GR	\N	\N	\N	18750.0000	18750.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.044	2026-09-07 19:25:51.044	BLOQUE	f
fe8c6e9a-f4ee-4a9a-ba58-d91f49425757	INS-057	CERA DE ABEJA VIRGEN	4e3404d0-f57c-4447-b1cf-fd2f645f40c2	GR	\N	\N	\N	78677.0000	78677.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.046	2026-09-07 19:25:51.046	BLOQUE	f
77266003-61c5-4631-b9fe-7533eb7f7beb	INS-058	CICLOMETICONA	e666504d-be2a-4cef-bb50-81d4f6c141f6	GR	\N	\N	\N	6321.0000	6321.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.048	2026-09-07 19:25:51.048	LIQUIDO / LIQUIDO (1 Litro)	f
6f597885-c511-429f-a9c9-e44f858f6ce5	INS-059	CLORHIDRATO DE ALUMINIO	7aecccbf-3f81-4d96-b5df-86efbb1d5169	GR	\N	\N	\N	25000.0000	25000.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.051	2026-09-07 19:25:51.051	POLVO	f
c488a9b9-fe87-4cf8-91be-2eceb65198ac	INS-060	CLORURO DE BENZALCONIO	90b57950-0d6f-416c-9b55-eecdd7816fcd	GR	\N	\N	\N	1226.0000	1226.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.054	2026-09-07 19:25:51.054	LIQUIDO	f
6ebc3b68-7093-4e6b-9db3-2319895dc64b	INS-061	CLORURO DE MAGNESIO	7aecccbf-3f81-4d96-b5df-86efbb1d5169	GR	\N	\N	\N	17050.0000	17050.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.056	2026-09-07 19:25:51.056	POLVO	f
8176c9a8-6276-4fb3-abaa-8cd62dea89b0	INS-062	CMC	8df3c4e0-4b0b-4531-9812-4500d79438a2	GR	\N	\N	\N	4243.0000	4243.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.059	2026-09-07 19:25:51.059	POLVO	f
af5ed9d6-a35f-4f15-bad4-9f834901d8c0	INS-063	COLAGENO HIDROLIZADO	e76cf865-819b-47d0-9e60-fbcbed29f2dc	GR	\N	\N	\N	32662.0000	32662.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.061	2026-09-07 19:25:51.061	POLVO	f
8f35e8ac-189c-47ef-b6c2-9f29a665fccc	INS-064	COPERLAND	5e122e5f-f303-42ac-baab-586f4ec650d4	GR	\N	\N	\N	9375.0000	9375.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.063	2026-09-07 19:25:51.063	POLVO	f
d43e9dda-d68f-4b16-b725-9deb616065eb	INS-065	COUMARINA	e76cf865-819b-47d0-9e60-fbcbed29f2dc	GR	\N	\N	\N	3472.0000	3472.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.065	2026-09-07 19:25:51.065	GRANO	f
b38a0c8f-a8e7-4e30-9f26-5352f349ce69	INS-066	CURCUMA	e76cf865-819b-47d0-9e60-fbcbed29f2dc	GR	\N	\N	\N	3284.0000	3284.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.068	2026-09-07 19:25:51.068	POLVO	f
eed50ae4-682c-4b3a-9fc6-27b3f992b26e	INS-067	D-PANTENOL O PANTENOL	e76cf865-819b-47d0-9e60-fbcbed29f2dc	GR	\N	\N	\N	13385.0000	13385.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.071	2026-09-07 19:25:51.071	LIQUIDO	f
a7931626-b6ab-450d-b7e8-484d773cf1aa	INS-069	DEHYQUART	5e122e5f-f303-42ac-baab-586f4ec650d4	GR	\N	\N	\N	80000.0000	80000.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.076	2026-09-07 19:25:51.076	LIQUIDO	f
cdf61ea3-02c1-4b78-94c4-178398121a4a	INS-070	DIOXIDO DE TITANIO FOOD GRADE	7aecccbf-3f81-4d96-b5df-86efbb1d5169	GR	\N	\N	\N	23000.0000	23000.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.079	2026-09-07 19:25:51.079	POLVO	f
205dcb75-c01e-4312-9fc8-05d1cce9081d	INS-071	DIOXIDO DE TITANIO INDUSTRIAL	7aecccbf-3f81-4d96-b5df-86efbb1d5169	GR	\N	\N	\N	50000.0000	50000.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.081	2026-09-07 19:25:51.081	POLVO	f
8587e682-2575-4153-9ad6-ebd98e42db27	INS-073	EDTA TETRASODICO	90b57950-0d6f-416c-9b55-eecdd7816fcd	GR	\N	\N	\N	9404.0000	9404.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.087	2026-09-07 19:25:51.087	POLVO	f
e5c39f4b-b2ee-4e21-ab5d-6b2ae5a3b0d5	INS-074	EMULGADE 1000	4e3404d0-f57c-4447-b1cf-fd2f645f40c2	GR	\N	\N	\N	71310.0000	71310.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.089	2026-09-07 19:25:51.089	GRANO	f
e328b7f4-e06e-4c7e-9eb9-200a27bb979c	INS-075	ESPESANTE ACRILICO	8df3c4e0-4b0b-4531-9812-4500d79438a2	GR	\N	\N	\N	4594.0000	4594.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.091	2026-09-07 19:25:51.091	LIQUIDO	f
6eb3dd35-3293-4619-99b2-e3d0e2dec277	INS-076	ESTABILIZADOR DE PEROXIDO	90b57950-0d6f-416c-9b55-eecdd7816fcd	GR	\N	\N	\N	5829.0000	5829.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.094	2026-09-07 19:25:51.094	LIQUIDO	f
876f54db-7e02-40f9-917d-94ac8bd2d198	INS-077	EXTRACTO DE ALOE VERA	1883d81b-c0f6-4499-9a76-c0d7b3133987	GR	\N	\N	\N	20667.0000	20667.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.096	2026-09-07 19:25:51.096	EXTRACTO LIQUIDO	f
9a703458-3a72-4274-81b2-061090483c85	INS-078	EXTRACTO DE CALENDULA	1883d81b-c0f6-4499-9a76-c0d7b3133987	GR	\N	\N	\N	11280.0000	11280.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.098	2026-09-07 19:25:51.098	EXTRACTO LIQUIDO	f
3cd5338f-4077-4313-975c-26d1e5c24de0	INS-079	EXTRACTO DE CASTAÑA DE INDIAS	1883d81b-c0f6-4499-9a76-c0d7b3133987	GR	\N	\N	\N	12156.0000	12156.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.101	2026-09-07 19:25:51.101	EXTRACTO LIQUIDO	f
2f50dca2-668f-4a53-975e-e95116d7442f	INS-080	EXTRACTO DE CENTELLA ASIATICA	1883d81b-c0f6-4499-9a76-c0d7b3133987	GR	\N	\N	\N	11671.0000	11671.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.104	2026-09-07 19:25:51.104	EXTRACTO LIQUIDO	f
1773217b-37f1-4d97-a9aa-874c4f539524	INS-081	EXTRACTO DE GINSENG	1883d81b-c0f6-4499-9a76-c0d7b3133987	GR	\N	\N	\N	6173.0000	6173.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.106	2026-09-07 19:25:51.106	EXTRACTO LIQUIDO	f
080edd87-fb19-49bb-9fe2-0dca420a276c	INS-082	EXTRACTO DE HAMAMELIS	1883d81b-c0f6-4499-9a76-c0d7b3133987	GR	\N	\N	\N	14871.0000	14871.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.109	2026-09-07 19:25:51.109	EXTRACTO LIQUIDO	f
cddb24a5-0b89-4cca-b5dc-721c2b4c64d5	INS-083	EXTRACTO DE JENGIBRE	1883d81b-c0f6-4499-9a76-c0d7b3133987	GR	\N	\N	\N	16001.0000	16001.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.111	2026-09-07 19:25:51.111	EXTRACTO LIQUIDO	f
aa9c5892-6798-4a68-b4cc-3538f410ab2a	INS-084	EXTRACTO DE MANZANILLA	1883d81b-c0f6-4499-9a76-c0d7b3133987	GR	\N	\N	\N	12182.0000	12182.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.114	2026-09-07 19:25:51.114	EXTRACTO LIQUIDO	f
3d83ac6f-b1b9-46dd-8226-77863f5f21e7	INS-085	EXTRACTO DE ORTIGA	1883d81b-c0f6-4499-9a76-c0d7b3133987	GR	\N	\N	\N	8991.0000	8991.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.116	2026-09-07 19:25:51.116	EXTRACTO LIQUIDO	f
7fc5e7e8-2a80-41a4-b513-58adf03367a6	INS-086	EXTRACTO DE ROMERO	1883d81b-c0f6-4499-9a76-c0d7b3133987	GR	\N	\N	\N	11755.0000	11755.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.12	2026-09-07 19:25:51.12	EXTRACTO LIQUIDO	f
80629f08-64ad-4e47-a07c-be8b90eb9928	INS-087	EXTRACTO NATURAL DE ARNICA	1883d81b-c0f6-4499-9a76-c0d7b3133987	GR	\N	\N	\N	9736.0000	9736.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.123	2026-09-07 19:25:51.123	EXTRACTO LIQUIDO	f
e8f137a2-1f0c-4f32-892d-143497884a7a	INS-088	EXTRACTO NATURAL DE AVENA	1883d81b-c0f6-4499-9a76-c0d7b3133987	GR	\N	\N	\N	10945.0000	10945.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.125	2026-09-07 19:25:51.125	EXTRACTO LIQUIDO	f
dce8fe7c-faae-4471-b425-9ad83b9914e8	INS-089	EXTRACTO TE VERDE	1883d81b-c0f6-4499-9a76-c0d7b3133987	GR	\N	\N	\N	9882.0000	9882.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.128	2026-09-07 19:25:51.128	EXTRACTO LIQUIDO	f
6f9d6ca6-a017-478b-987b-51f6042b4769	INS-090	EXXOL	459481c9-5211-48c8-94e6-932065ffdcd1	GR	\N	\N	\N	1754.0000	1754.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.13	2026-09-07 19:25:51.13	LIQUIDO	f
1ec7fe49-d4bf-4ae5-9fc2-8920310d3d6f	INS-091	FENOXIETANOL	90b57950-0d6f-416c-9b55-eecdd7816fcd	GR	\N	\N	\N	1000.0000	1000.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.133	2026-09-07 19:25:51.133	LIQUIDO	f
8fa59c7e-efaa-440b-9bc9-ab8994980c98	INS-092	FIPRONIL	e76cf865-819b-47d0-9e60-fbcbed29f2dc	GR	\N	\N	\N	1000.0000	1000.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.136	2026-09-07 19:25:51.136	ACTIVO (POLVO)	f
eb30f874-6891-40aa-9a99-8090f0dddf5b	INS-068	DECYL GLUCOCIDE	5e122e5f-f303-42ac-baab-586f4ec650d4	GR	\N	\N	\N	2945.0000	2945.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.074	2026-09-09 15:27:46.641	LIQUIDO / PASTA / LIQUIDO	f
5e8073ff-fb40-4c07-be68-aaefc8201395	INS-093	FORMOL	90b57950-0d6f-416c-9b55-eecdd7816fcd	GR	\N	\N	\N	2928.0000	2928.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.139	2026-09-07 19:25:51.139	LIQUIDO	f
7d898dec-8922-4f4f-9155-4e18489b1c18	INS-094	GALAXOLIDE	e76cf865-819b-47d0-9e60-fbcbed29f2dc	GR	\N	\N	\N	3147.0000	3147.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.141	2026-09-07 19:25:51.141	LIQUIDO	f
7270809e-5f98-48a2-aa46-a99bf4455bb3	INS-095	GLICERINA	459481c9-5211-48c8-94e6-932065ffdcd1	GR	\N	\N	\N	8210.0000	8210.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.144	2026-09-07 19:25:51.144	LIQUIDO	f
39c61577-d486-4bbc-bd5a-ed740a1a5ac7	INS-096	GLUCONATO	e76cf865-819b-47d0-9e60-fbcbed29f2dc	GR	\N	\N	\N	1988.0000	1988.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.146	2026-09-07 19:25:51.146	POLVO	f
f2d1ddc3-d6e7-49a9-9372-92b32f951d92	INS-097	GLUCONATO DE CLORHEXIDINA	90b57950-0d6f-416c-9b55-eecdd7816fcd	GR	\N	\N	\N	278.0000	278.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.149	2026-09-07 19:25:51.149	LIQUIDO	f
00854e61-4efa-4d19-8de8-134ae16968c3	INS-098	GOMA XANTANA	8df3c4e0-4b0b-4531-9812-4500d79438a2	GR	\N	\N	\N	2250.0000	2250.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.151	2026-09-07 19:25:51.151	POLVO	f
8edf98e5-4416-41b9-8519-cadc684d3a16	INS-099	HIPOCLORITO DE SODIO	e76cf865-819b-47d0-9e60-fbcbed29f2dc	GR	\N	\N	\N	873.0000	873.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.154	2026-09-07 19:25:51.154	POLVO	f
5a770f82-699b-4ed3-87d7-0e288e187154	INS-100	IMPERMEABILIZANTE	e76cf865-819b-47d0-9e60-fbcbed29f2dc	GR	\N	\N	\N	197637.0000	197637.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.157	2026-09-07 19:25:51.157	LIQUIDO	f
916775bf-c680-47e7-a235-463725cb9bd5	INS-102	KETOCONAZOL	e76cf865-819b-47d0-9e60-fbcbed29f2dc	GR	\N	\N	\N	398.0000	398.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.162	2026-09-07 19:25:51.162	POLVO	f
b310f96a-8248-485f-91ab-73cb2eb76e1d	INS-103	KION EN POLVO	e76cf865-819b-47d0-9e60-fbcbed29f2dc	GR	\N	\N	\N	12800.0000	12800.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.164	2026-09-07 19:25:51.164	POLVO	f
fc3eaf1c-3fc4-4d01-80a4-ec5b98e23143	INS-104	LACA CSP	e666504d-be2a-4cef-bb50-81d4f6c141f6	GR	\N	\N	\N	1489.0000	1489.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.167	2026-09-07 19:25:51.167	LIQUIDO	f
179d9904-a167-4142-a57c-1fc413a294c0	INS-105	LAURIL SULFATO DE SODIO (96%)	5e122e5f-f303-42ac-baab-586f4ec650d4	GR	\N	\N	\N	245.0000	245.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.17	2026-09-07 19:25:51.17	POLVO	f
e0f68e13-c50d-4a87-80f3-53424aad3a74	INS-106	LIDOCAINA HCL	e76cf865-819b-47d0-9e60-fbcbed29f2dc	GR	\N	\N	\N	11064.0000	11064.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.172	2026-09-07 19:25:51.172	POLVO	f
a3e414f6-c9f9-4680-933d-3b9c33096a4c	INS-107	MANTECA DE KARITE	e666504d-be2a-4cef-bb50-81d4f6c141f6	GR	\N	\N	\N	62850.0000	62850.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.175	2026-09-07 19:25:51.175	BLOQUE	f
f77f398d-46cd-4e85-92ec-438ac24328c4	INS-108	MAQBLEND	e76cf865-819b-47d0-9e60-fbcbed29f2dc	GR	\N	\N	\N	845.0000	845.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.177	2026-09-07 19:25:51.177	LIQUIDO	f
7454fb85-f4a4-4987-8d95-053d98414a77	INS-109	MECELLOSE	8df3c4e0-4b0b-4531-9812-4500d79438a2	GR	\N	\N	\N	25837.0000	25837.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.179	2026-09-07 19:25:51.179	POLVO	f
12b82ba7-09a5-43b6-a754-56abcb77a4cc	INS-110	MENTOL CRISTAL	e76cf865-819b-47d0-9e60-fbcbed29f2dc	GR	\N	\N	\N	13913.0000	13913.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.181	2026-09-07 19:25:51.181	CRISTAL	f
75b39f53-1ef6-4055-b004-1cbd437ec397	INS-111	MINOXIDIL	e76cf865-819b-47d0-9e60-fbcbed29f2dc	GR	\N	\N	\N	7286.0000	7286.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.184	2026-09-07 19:25:51.184	POLVO	f
aafc3a6a-2061-447d-9dfa-2c08e6f7d626	INS-112	MONO (MONOPROPILENGLICOL)	459481c9-5211-48c8-94e6-932065ffdcd1	GR	\N	\N	\N	9930.0000	9930.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.186	2026-09-07 19:25:51.186	LIQUIDO	f
1f480a54-7767-45e5-811a-b2faccafb3df	INS-113	NEUTRADOR ALCOHOL	90b57950-0d6f-416c-9b55-eecdd7816fcd	GR	\N	\N	\N	203.0000	203.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.189	2026-09-07 19:25:51.189	LIQUIDO	f
34b45784-a267-4a7d-844a-7684692459b8	INS-114	NEUTRADOR AMONIACO	90b57950-0d6f-416c-9b55-eecdd7816fcd	GR	\N	\N	\N	307.0000	307.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.191	2026-09-07 19:25:51.191	LIQUIDO	f
10508e94-26aa-4e04-bb53-9561b5304ec9	INS-115	NEUTRADOR FRESCURA AMARILLA	90b57950-0d6f-416c-9b55-eecdd7816fcd	GR	\N	\N	\N	295.0000	295.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.193	2026-09-07 19:25:51.193	LIQUIDO	f
4819e2a6-392b-465e-86fc-d61c348afd4f	INS-116	NEUTRADOR FRESCURA NARANJA	90b57950-0d6f-416c-9b55-eecdd7816fcd	GR	\N	\N	\N	313.0000	313.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.196	2026-09-07 19:25:51.196	LIQUIDO	f
2a80550b-0ded-4464-b6e3-ba13a3cc0bb3	INS-117	NEUTRADOR MASCOTAS	90b57950-0d6f-416c-9b55-eecdd7816fcd	GR	\N	\N	\N	305.0000	305.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.198	2026-09-07 19:25:51.198	LIQUIDO	f
d8c5d0d5-f737-41d1-8e60-22bbc308b083	INS-118	NEUTRADOR NEW B.	90b57950-0d6f-416c-9b55-eecdd7816fcd	GR	\N	\N	\N	300.0000	300.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.201	2026-09-07 19:25:51.201	LIQUIDO	f
768c4b1c-12ae-4015-941e-dec56662f92a	INS-119	NEUTRADOR ORINE DE MASCOTAS	90b57950-0d6f-416c-9b55-eecdd7816fcd	GR	\N	\N	\N	313.0000	313.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.204	2026-09-07 19:25:51.204	LIQUIDO	f
7b7629e0-8ff3-4dbd-bde3-30be46d9b6b5	INS-120	NEUTRADOR VAM	90b57950-0d6f-416c-9b55-eecdd7816fcd	GR	\N	\N	\N	309.0000	309.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.206	2026-09-07 19:25:51.206	LIQUIDO	f
94be1b4e-4f4f-4d12-ba03-26c913d74839	INS-121	NEUTRALIZADOR QP700	90b57950-0d6f-416c-9b55-eecdd7816fcd	GR	\N	\N	\N	38850.0000	38850.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.208	2026-09-07 19:25:51.208	LIQUIDO	f
97f87364-f00c-472b-a9dd-5ce36244afb4	INS-122	NIACINAMIDA VITAMINA B3	e76cf865-819b-47d0-9e60-fbcbed29f2dc	GR	\N	\N	\N	15800.0000	15800.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.211	2026-09-07 19:25:51.211	POLVO	f
3195b8a3-32f9-4739-a0e9-fab3748f4c15	INS-123	NP10	e76cf865-819b-47d0-9e60-fbcbed29f2dc	GR	\N	\N	\N	46954.0000	46954.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.213	2026-09-07 19:25:51.213	LIQUIDO	f
312846a1-a2e2-41ec-9004-0c70dd074e4b	INS-124	OXIDO DE ZINC	7aecccbf-3f81-4d96-b5df-86efbb1d5169	GR	\N	\N	\N	15241.0000	15241.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.215	2026-09-07 19:25:51.215	POLVO	f
37245474-cf09-4fc7-a24a-5dffa5ac1dc5	INS-125	PARAFINA LIQUIDA	e666504d-be2a-4cef-bb50-81d4f6c141f6	GR	\N	\N	\N	1160.0000	1160.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.218	2026-09-07 19:25:51.218	LIQUIDO	f
30cf86b6-2954-426c-b4b7-8cb60d97af51	INS-126	PARAFINA SOLIDA	e666504d-be2a-4cef-bb50-81d4f6c141f6	GR	\N	\N	\N	10080.0000	10080.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.221	2026-09-07 19:25:51.221	BLOQUE	f
13b13800-6679-4749-96e9-bc034236f7a9	INS-127	PEROXIDO	e76cf865-819b-47d0-9e60-fbcbed29f2dc	GR	\N	\N	\N	15000.0000	15000.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.224	2026-09-07 19:25:51.224	LIQUIDO	f
b0e49e23-1edc-4ec2-b265-189ebe472eac	INS-128	POLISORBATO 20	90b57950-0d6f-416c-9b55-eecdd7816fcd	GR	\N	\N	\N	42930.0000	42930.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.226	2026-09-07 19:25:51.226	LIQUIDO	f
16dd3cae-f6e5-402f-b187-f841193216e1	INS-129	POLISORBATO 80	90b57950-0d6f-416c-9b55-eecdd7816fcd	GR	\N	\N	\N	8452.0000	8452.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.229	2026-09-07 19:25:51.229	LIQUIDO	f
38e6de16-a266-4f3f-9a75-b9c059a0531a	INS-130	POLYQUATERNARIUM 7	e76cf865-819b-47d0-9e60-fbcbed29f2dc	GR	\N	\N	\N	10966.0000	10966.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.231	2026-09-07 19:25:51.231	LIQUIDO	f
a27907cc-b24a-4206-9c65-d413aa4b5563	INS-131	PRILOCAINA HCL	e76cf865-819b-47d0-9e60-fbcbed29f2dc	GR	\N	\N	\N	70.0000	70.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.233	2026-09-07 19:25:51.233	POLVO (USP)	f
06e10795-05e4-4665-8edb-211bce140aaf	INS-132	PROCIDE 1.5	90b57950-0d6f-416c-9b55-eecdd7816fcd	GR	\N	\N	\N	864.0000	864.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.236	2026-09-07 19:25:51.236	LIQUIDO	f
d84cba5d-96a8-432f-a27c-650a3da49cd1	INS-133	PROCIDE CG	90b57950-0d6f-416c-9b55-eecdd7816fcd	GR	\N	\N	\N	18654.0000	18654.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.24	2026-09-07 19:25:51.24	LIQUIDO	f
644113e7-6761-492f-a55e-a359c795c5f8	INS-134	PROPILENGLICOL	459481c9-5211-48c8-94e6-932065ffdcd1	GR	\N	\N	\N	120.0000	120.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.242	2026-09-07 19:25:51.242	LIQUIDO	f
27ddf750-d66d-4836-8d58-f080b8d9daf7	INS-135	PROPIONATO DE SODIO	90b57950-0d6f-416c-9b55-eecdd7816fcd	GR	\N	\N	\N	102.0000	102.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.244	2026-09-07 19:25:51.244	POLVO	f
36893586-cabc-431f-9065-6c781546257e	INS-136	PROTEINA HIDROLIZADA DE SOYA	e76cf865-819b-47d0-9e60-fbcbed29f2dc	GR	\N	\N	\N	3325.0000	3325.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.246	2026-09-07 19:25:51.246	POLVO	f
0330295c-4387-4bf3-9a68-0a5551077dab	INS-137	RESINOX	90b57950-0d6f-416c-9b55-eecdd7816fcd	GR	\N	\N	\N	40000.0000	40000.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.248	2026-09-07 19:25:51.248	LIQUIDO	f
6e4a171c-6eb7-4f4d-b3af-b2d380335061	INS-138	SAL	7aecccbf-3f81-4d96-b5df-86efbb1d5169	GR	\N	\N	\N	6000.0000	6000.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.251	2026-09-07 19:25:51.251	POLVO	f
a54b052c-6b6e-4210-b286-f9666dbf6e20	INS-139	SILICATO DE SODIO	7aecccbf-3f81-4d96-b5df-86efbb1d5169	GR	\N	\N	\N	2882.0000	2882.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.254	2026-09-07 19:25:51.254	LIQUIDO	f
0f97527f-a304-4d88-b05d-69992d0c3d10	INS-140	SILICONA 1000	e666504d-be2a-4cef-bb50-81d4f6c141f6	GR	\N	\N	\N	18906.0000	18906.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.257	2026-09-07 19:25:51.257	LIQUIDO	f
95f3ea2b-c424-42fa-aa6c-6c4deb76e4f6	INS-141	SILICONA 1501	e666504d-be2a-4cef-bb50-81d4f6c141f6	GR	\N	\N	\N	9216.0000	9216.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.259	2026-09-07 19:25:51.259	LIQUIDO	f
d8e03fdc-63d8-4b9f-b5b1-0a18bf5eeca2	INS-142	SILICONA 3031	e666504d-be2a-4cef-bb50-81d4f6c141f6	GR	\N	\N	\N	73092.0000	73092.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.261	2026-09-07 19:25:51.261	LIQUIDO	f
b41e4ce5-2ab8-4ded-a0e9-1b821c16e315	INS-143	SILICONA 350	e666504d-be2a-4cef-bb50-81d4f6c141f6	GR	\N	\N	\N	3943.0000	3943.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.263	2026-09-07 19:25:51.263	LIQUIDO	f
2169a3b1-b8fd-4052-a61b-25d7d0ae8820	INS-144	SILICONA A LA GRASA	e666504d-be2a-4cef-bb50-81d4f6c141f6	GR	\N	\N	\N	51790.0000	51790.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.265	2026-09-07 19:25:51.265	GRASA / PASTA	f
f89c2bc3-1e48-4a60-b326-270864dad5ca	INS-145	SILICONA EMULSIONADA	e666504d-be2a-4cef-bb50-81d4f6c141f6	GR	\N	\N	\N	1600.0000	1600.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.269	2026-09-07 19:25:51.269	LIQUIDO	f
d600024d-7db6-498e-954d-038871958395	INS-146	SILICONA XIAMETER	e666504d-be2a-4cef-bb50-81d4f6c141f6	GR	\N	\N	\N	1000.0000	1000.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.272	2026-09-07 19:25:51.272	LIQUIDO / SILICONA	f
3b682c2c-c7a5-426b-b223-32e792196c98	INS-147	SORBATO DE POTASIO	90b57950-0d6f-416c-9b55-eecdd7816fcd	GR	\N	\N	\N	4301.0000	4301.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.275	2026-09-07 19:25:51.275	GRANO	f
afff08d5-96ed-441c-b6d0-d3e8b162edcb	INS-148	SORBITOL	459481c9-5211-48c8-94e6-932065ffdcd1	GR	\N	\N	\N	4984.0000	4984.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.277	2026-09-07 19:25:51.277	LIQUIDO	f
79df9088-e4d9-4704-89ec-29a3607867e0	INS-149	TALCO	7aecccbf-3f81-4d96-b5df-86efbb1d5169	GR	\N	\N	\N	24130.0000	24130.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.279	2026-09-07 19:25:51.279	POLVO	f
b2528fff-6c79-459f-b9df-555b1690a008	INS-150	TAURINA	e76cf865-819b-47d0-9e60-fbcbed29f2dc	GR	\N	\N	\N	486.0000	486.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.281	2026-09-07 19:25:51.281	POLVO	f
73cbd1de-ffb9-4024-90e3-b1709c8dbbfb	INS-151	TERBINAFINA HCL	e76cf865-819b-47d0-9e60-fbcbed29f2dc	GR	\N	\N	\N	514.0000	514.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.284	2026-09-07 19:25:51.284	POLVO	f
be820686-1b6b-47e3-9780-7308bdf7a88b	INS-152	TETRACAINA HCL	e76cf865-819b-47d0-9e60-fbcbed29f2dc	GR	\N	\N	\N	1031.0000	1031.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.286	2026-09-07 19:25:51.286	POLVO	f
6f4a88eb-353d-4c06-8725-7fe107f32668	INS-153	TEXAPON (TEXAPON 70%)	5e122e5f-f303-42ac-baab-586f4ec650d4	GR	\N	\N	\N	85000.0000	85000.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.289	2026-09-07 19:25:51.289	PASTA / LIQUIDO	f
84c02891-72ff-44f5-8767-75e1b79ec02e	INS-154	TRIETANOLAMINA (TEA)	90b57950-0d6f-416c-9b55-eecdd7816fcd	GR	\N	\N	\N	1086.0000	1086.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.292	2026-09-07 19:25:51.292	LIQUIDO	f
d197d1dd-8efb-4724-9acf-fcb315a27269	INS-155	TRIETIL CITRATO	e76cf865-819b-47d0-9e60-fbcbed29f2dc	GR	\N	\N	\N	4015.0000	4015.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.294	2026-09-07 19:25:51.294	LIQUIDO	f
6a713e5b-57ac-4846-a1e7-97c59fd2a770	INS-156	UREA	e76cf865-819b-47d0-9e60-fbcbed29f2dc	GR	\N	\N	\N	9500.0000	9500.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.296	2026-09-07 19:25:51.296	POLVO	f
eb1bf31e-ba99-443b-aa07-7410e56da07f	INS-157	VAINILLINA	e76cf865-819b-47d0-9e60-fbcbed29f2dc	GR	\N	\N	\N	2218.0000	2218.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.298	2026-09-07 19:25:51.298	POLVO	f
5e2bd04b-d8b5-4cf2-a30b-b7bc690f5b38	INS-158	VARSOL	459481c9-5211-48c8-94e6-932065ffdcd1	GR	\N	\N	\N	1490.7900	1490.7900	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.301	2026-09-07 19:25:51.301	LIQUIDO / LIQUIDO (L)	f
ab9438b3-e9d8-4b33-a5c8-da547e7b5024	INS-159	VASELINA LIQUIDA	e666504d-be2a-4cef-bb50-81d4f6c141f6	GR	\N	\N	\N	100000.0000	100000.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.304	2026-09-07 19:25:51.304	LIQUIDO	f
05f1df06-27d0-41ce-9dc4-12f2c6085189	INS-160	VASELINA SOLIDA	e666504d-be2a-4cef-bb50-81d4f6c141f6	GR	\N	\N	\N	82500.0000	82500.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.306	2026-09-07 19:25:51.306	BLOQUE / PASTA	f
e7acfca1-c924-4983-acda-231ef8c696ac	INS-161	VINAGRE DE MANZANA	e76cf865-819b-47d0-9e60-fbcbed29f2dc	GR	\N	\N	\N	6617.0000	6617.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.309	2026-09-07 19:25:51.309	LIQUIDO	f
ebfcccbb-22c9-468d-8ee7-f7cdb8cacdb8	INS-162	VITAMINA E	e76cf865-819b-47d0-9e60-fbcbed29f2dc	GR	\N	\N	\N	2378.0000	2378.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.311	2026-09-07 19:25:51.311	LIQUIDO	f
e1b7e246-0945-495a-b9d3-063f8a53c2b3	INS-163	VITAMINA E EN POLVO	e76cf865-819b-47d0-9e60-fbcbed29f2dc	GR	\N	\N	\N	1000.0000	1000.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.313	2026-09-07 19:25:51.313	POLVO	f
cc105e5c-84f1-4fa5-ae8f-835919d15bb3	INS-164	ZACARINA (SACARINA)	e76cf865-819b-47d0-9e60-fbcbed29f2dc	GR	\N	\N	\N	1586.0000	1586.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.315	2026-09-07 19:25:51.315	GRANO	f
8d49df61-358f-42f1-aabe-92f4c1c581b9	FRAG-001	FRAGANCIA ALOE VERA	ca259fab-2ab9-427a-b134-eb3a7b0cc8a1	GR	\N	\N	\N	383.0000	383.0000	0.0000	0.0000	ACTIVO	FRAGANCIA	2026-09-07 19:25:51.318	2026-09-07 19:25:51.318	FRAGANCIA LIQUIDA	f
a2474d06-41eb-4600-9bea-58584dc232a2	FRAG-002	FRAGANCIA ARIEL INTENSE	ca259fab-2ab9-427a-b134-eb3a7b0cc8a1	GR	\N	\N	\N	317.0000	317.0000	0.0000	0.0000	ACTIVO	FRAGANCIA	2026-09-07 19:25:51.321	2026-09-07 19:25:51.321	LIQUIDO	f
022d1935-2cc8-45c4-aaa5-0ae26c5ef29c	FRAG-003	FRAGANCIA ARIS ACTIFIT	ca259fab-2ab9-427a-b134-eb3a7b0cc8a1	GR	\N	\N	\N	634.0000	634.0000	0.0000	0.0000	ACTIVO	FRAGANCIA	2026-09-07 19:25:51.324	2026-09-07 19:25:51.324	FRAGANCIA LIQUIDA	f
4aed5e8d-c640-460a-908f-7bd004755df1	FRAG-004	FRAGANCIA AVENA Y MIEL	ca259fab-2ab9-427a-b134-eb3a7b0cc8a1	GR	\N	\N	\N	1627.0000	1627.0000	0.0000	0.0000	ACTIVO	FRAGANCIA	2026-09-07 19:25:51.326	2026-09-07 19:25:51.326	LIQUIDO	f
17b7f942-74a0-4316-b1a0-5030b290c838	FRAG-005	FRAGANCIA B INTENSE	ca259fab-2ab9-427a-b134-eb3a7b0cc8a1	GR	\N	\N	\N	1076.0000	1076.0000	0.0000	0.0000	ACTIVO	FRAGANCIA	2026-09-07 19:25:51.328	2026-09-07 19:25:51.328	FRAGANCIA LIQUIDA	f
677f2936-c853-44cc-94b9-9d9c41501003	FRAG-006	FRAGANCIA BABY AMERICA SOL	ca259fab-2ab9-427a-b134-eb3a7b0cc8a1	GR	\N	\N	\N	9.0000	9.0000	0.0000	0.0000	ACTIVO	FRAGANCIA	2026-09-07 19:25:51.33	2026-09-07 19:25:51.33	FRAGANCIA LIQUIDA	f
1461e478-d0c1-417a-8530-d370c40ec373	FRAG-007	FRAGANCIA BABY POWERS	ca259fab-2ab9-427a-b134-eb3a7b0cc8a1	GR	\N	\N	\N	200.0000	200.0000	0.0000	0.0000	ACTIVO	FRAGANCIA	2026-09-07 19:25:51.333	2026-09-07 19:25:51.333	LIQUIDO	f
f2d83c73-bd6c-4ceb-abf8-daac3c660322	FRAG-008	FRAGANCIA BELLE	ca259fab-2ab9-427a-b134-eb3a7b0cc8a1	GR	\N	\N	\N	57.0000	57.0000	0.0000	0.0000	ACTIVO	FRAGANCIA	2026-09-07 19:25:51.336	2026-09-07 19:25:51.336	FRAGANCIA LIQUIDA	f
a5c77376-9bf0-4ddc-8f85-b8fafbba89b0	FRAG-009	FRAGANCIA BLUE CHANEL	ca259fab-2ab9-427a-b134-eb3a7b0cc8a1	GR	\N	\N	\N	184.0000	184.0000	0.0000	0.0000	ACTIVO	FRAGANCIA	2026-09-07 19:25:51.339	2026-09-07 19:25:51.339	LIQUIDO	f
ac8b254d-0844-47d1-93a8-78ba9a4376bb	FRAG-010	FRAGANCIA BORN IN ROMA	ca259fab-2ab9-427a-b134-eb3a7b0cc8a1	GR	\N	\N	\N	188.0000	188.0000	0.0000	0.0000	ACTIVO	FRAGANCIA	2026-09-07 19:25:51.341	2026-09-07 19:25:51.341	LIQUIDO	f
862da131-0f95-465a-9678-24aaec9b80a2	FRAG-011	FRAGANCIA BOSMAN	ca259fab-2ab9-427a-b134-eb3a7b0cc8a1	GR	\N	\N	\N	100.0000	100.0000	0.0000	0.0000	ACTIVO	FRAGANCIA	2026-09-07 19:25:51.343	2026-09-07 19:25:51.343	FRAGANCIA LIQUIDA	f
3855df57-5f0c-45c0-963c-20d418832ae4	FRAG-012	FRAGANCIA BOSQUE BAMBU	ca259fab-2ab9-427a-b134-eb3a7b0cc8a1	GR	\N	\N	\N	179.0000	179.0000	0.0000	0.0000	ACTIVO	FRAGANCIA	2026-09-07 19:25:51.345	2026-09-07 19:25:51.345	FRAGANCIA LIQUIDA	f
80779948-8d3f-4c44-8056-ab959f25c41b	FRAG-013	FRAGANCIA BRITNEY SPEARS	ca259fab-2ab9-427a-b134-eb3a7b0cc8a1	GR	\N	\N	\N	4219.0000	4219.0000	0.0000	0.0000	ACTIVO	FRAGANCIA	2026-09-07 19:25:51.348	2026-09-07 19:25:51.348	LIQUIDO	f
1af114af-0ec8-4144-a73e-6f186c2ae070	FRAG-014	FRAGANCIA CALVIN KLEIN	ca259fab-2ab9-427a-b134-eb3a7b0cc8a1	GR	\N	\N	\N	4720.0000	4720.0000	0.0000	0.0000	ACTIVO	FRAGANCIA	2026-09-07 19:25:51.35	2026-09-07 19:25:51.35	LIQUIDO	f
c5ec0b04-03f9-4eeb-8d9d-5942dc9222aa	FRAG-015	FRAGANCIA CANELA Y MANZANA	ca259fab-2ab9-427a-b134-eb3a7b0cc8a1	GR	\N	\N	\N	2307.0000	2307.0000	0.0000	0.0000	ACTIVO	FRAGANCIA	2026-09-07 19:25:51.353	2026-09-07 19:25:51.353	LIQUIDO	f
4e04bec0-74c2-4fb3-9914-da6b05ef19f3	FRAG-016	FRAGANCIA CARO LA ROSE	ca259fab-2ab9-427a-b134-eb3a7b0cc8a1	GR	\N	\N	\N	100.0000	100.0000	0.0000	0.0000	ACTIVO	FRAGANCIA	2026-09-07 19:25:51.356	2026-09-07 19:25:51.356	FRAGANCIA LIQUIDA	f
c05cbc7c-d557-44a4-98fb-a653891d4e6c	FRAG-017	FRAGANCIA CHERRY	ca259fab-2ab9-427a-b134-eb3a7b0cc8a1	GR	\N	\N	\N	226.0000	226.0000	0.0000	0.0000	ACTIVO	FRAGANCIA	2026-09-07 19:25:51.358	2026-09-07 19:25:51.358	FRAGANCIA LIQUIDA	f
a78bca6c-15d7-437c-9f3d-e98ce83772b1	FRAG-018	FRAGANCIA CHICLE MIX	ca259fab-2ab9-427a-b134-eb3a7b0cc8a1	GR	\N	\N	\N	69.0000	69.0000	0.0000	0.0000	ACTIVO	FRAGANCIA	2026-09-07 19:25:51.36	2026-09-07 19:25:51.36	FRAGANCIA LIQUIDA	f
df48fb6b-3feb-4060-b60c-05af9023b39e	FRAG-019	FRAGANCIA COCO INTENSE	ca259fab-2ab9-427a-b134-eb3a7b0cc8a1	GR	\N	\N	\N	3553.0000	3553.0000	0.0000	0.0000	ACTIVO	FRAGANCIA	2026-09-07 19:25:51.362	2026-09-07 19:25:51.362	FRAGANCIA LIQUIDA	f
30399dfc-06c5-4f73-91b5-d2a0ee2cae65	FRAG-020	FRAGANCIA COCO PASION	ca259fab-2ab9-427a-b134-eb3a7b0cc8a1	GR	\N	\N	\N	100.0000	100.0000	0.0000	0.0000	ACTIVO	FRAGANCIA	2026-09-07 19:25:51.364	2026-09-07 19:25:51.364	FRAGANCIA LIQUIDA	f
0c6e6070-ca76-46a6-a243-7d98f13b4c2d	FRAG-021	FRAGANCIA DELICATE FLOWERS	ca259fab-2ab9-427a-b134-eb3a7b0cc8a1	GR	\N	\N	\N	513.0000	513.0000	0.0000	0.0000	ACTIVO	FRAGANCIA	2026-09-07 19:25:51.366	2026-09-07 19:25:51.366	LIQUIDO	f
1df4ebe7-aef6-46f0-afb8-a8e1502a23f7	FRAG-022	FRAGANCIA DESIRE MAGNET	ca259fab-2ab9-427a-b134-eb3a7b0cc8a1	GR	\N	\N	\N	60.0000	60.0000	0.0000	0.0000	ACTIVO	FRAGANCIA	2026-09-07 19:25:51.369	2026-09-07 19:25:51.369	FRAGANCIA LIQUIDA	f
1c19f93c-a2f4-44f2-aa68-7df7dc83162b	FRAG-023	FRAGANCIA DIGIOMEN	ca259fab-2ab9-427a-b134-eb3a7b0cc8a1	GR	\N	\N	\N	44.0000	44.0000	0.0000	0.0000	ACTIVO	FRAGANCIA	2026-09-07 19:25:51.371	2026-09-07 19:25:51.371	FRAGANCIA LIQUIDA	f
d9d56bfa-4ca2-4e92-8eb1-cfc4ea257a18	FRAG-024	FRAGANCIA DRAKYA	ca259fab-2ab9-427a-b134-eb3a7b0cc8a1	GR	\N	\N	\N	94.0000	94.0000	0.0000	0.0000	ACTIVO	FRAGANCIA	2026-09-07 19:25:51.374	2026-09-07 19:25:51.374	FRAGANCIA LIQUIDA	f
06bcffa4-cacf-4755-9359-53e76c496134	FRAG-025	FRAGANCIA ENCAPSULADO	ca259fab-2ab9-427a-b134-eb3a7b0cc8a1	GR	\N	\N	\N	660.0000	660.0000	0.0000	0.0000	ACTIVO	FRAGANCIA	2026-09-07 19:25:51.376	2026-09-07 19:25:51.376	FRAGANCIA LIQUIDA	f
6690bb3d-9867-43e2-bcaf-acd671010b32	FRAG-026	FRAGANCIA EUCALIPTO	ca259fab-2ab9-427a-b134-eb3a7b0cc8a1	GR	\N	\N	\N	981.0000	981.0000	0.0000	0.0000	ACTIVO	FRAGANCIA	2026-09-07 19:25:51.378	2026-09-07 19:25:51.378	LIQUIDO	f
c7b11aba-bc3c-4e39-991a-5a1786124a1b	FRAG-027	FRAGANCIA FANTASY PF. (NORPERU)	ca259fab-2ab9-427a-b134-eb3a7b0cc8a1	GR	\N	\N	\N	47.0000	47.0000	0.0000	0.0000	ACTIVO	FRAGANCIA	2026-09-07 19:25:51.38	2026-09-07 19:25:51.38	FRAGANCIA LIQUIDA	f
740297b9-e83b-4a9f-845f-a43c12897d1b	FRAG-028	FRAGANCIA FLOREX	ca259fab-2ab9-427a-b134-eb3a7b0cc8a1	GR	\N	\N	\N	2.0000	2.0000	0.0000	0.0000	ACTIVO	FRAGANCIA	2026-09-07 19:25:51.383	2026-09-07 19:25:51.383	FRAGANCIA LIQUIDA	f
a0eeb7ad-1709-41e4-8cb3-5898b0942f5f	FRAG-029	FRAGANCIA FRESA	ca259fab-2ab9-427a-b134-eb3a7b0cc8a1	GR	\N	\N	\N	3966.0000	3966.0000	0.0000	0.0000	ACTIVO	FRAGANCIA	2026-09-07 19:25:51.385	2026-09-07 19:25:51.385	LIQUIDO	f
8b619bab-5037-4f82-a819-babf97d95221	FRAG-030	FRAGANCIA FRUTOS ROJOS	ca259fab-2ab9-427a-b134-eb3a7b0cc8a1	GR	\N	\N	\N	400.0000	400.0000	0.0000	0.0000	ACTIVO	FRAGANCIA	2026-09-07 19:25:51.388	2026-09-07 19:25:51.388	FRAGANCIA LIQUIDA	f
b4c6bee5-e068-47af-a2e6-67b8b628262a	FRAG-031	FRAGANCIA FUN MINISTRY	ca259fab-2ab9-427a-b134-eb3a7b0cc8a1	GR	\N	\N	\N	99.0000	99.0000	0.0000	0.0000	ACTIVO	FRAGANCIA	2026-09-07 19:25:51.39	2026-09-07 19:25:51.39	FRAGANCIA LIQUIDA	f
7466e50e-87d8-410e-b3a5-9a8ac67e1127	FRAG-032	FRAGANCIA GODINA	ca259fab-2ab9-427a-b134-eb3a7b0cc8a1	GR	\N	\N	\N	4462.0000	4462.0000	0.0000	0.0000	ACTIVO	FRAGANCIA	2026-09-07 19:25:51.393	2026-09-07 19:25:51.393	FRAGANCIA LIQUIDA	f
174be3f7-1fc7-4b44-80d5-3509ea79f55b	FRAG-033	FRAGANCIA GREEN TEA	ca259fab-2ab9-427a-b134-eb3a7b0cc8a1	GR	\N	\N	\N	2394.0000	2394.0000	0.0000	0.0000	ACTIVO	FRAGANCIA	2026-09-07 19:25:51.395	2026-09-07 19:25:51.395	LIQUIDO	f
1ce96d00-2c76-4854-b443-c05f50a2d4c9	FRAG-034	FRAGANCIA INVICTUS	ca259fab-2ab9-427a-b134-eb3a7b0cc8a1	GR	\N	\N	\N	98.0000	98.0000	0.0000	0.0000	ACTIVO	FRAGANCIA	2026-09-07 19:25:51.397	2026-09-07 19:25:51.397	FRAGANCIA LIQUIDA	f
87050f88-7f5e-4529-b41e-838730eac13e	FRAG-035	FRAGANCIA INVICTUS INTENSE	ca259fab-2ab9-427a-b134-eb3a7b0cc8a1	GR	\N	\N	\N	46.0000	46.0000	0.0000	0.0000	ACTIVO	FRAGANCIA	2026-09-07 19:25:51.399	2026-09-07 19:25:51.399	FRAGANCIA LIQUIDA	f
47226bca-7152-44d1-b7f7-bde21b4155c8	FRAG-036	FRAGANCIA JAZMIN	ca259fab-2ab9-427a-b134-eb3a7b0cc8a1	GR	\N	\N	\N	5734.0000	5734.0000	0.0000	0.0000	ACTIVO	FRAGANCIA	2026-09-07 19:25:51.403	2026-09-07 19:25:51.403	LIQUIDO	f
eed12f68-7231-47bd-95eb-4477f41662a5	FRAG-037	FRAGANCIA KING OF PARTIES	ca259fab-2ab9-427a-b134-eb3a7b0cc8a1	GR	\N	\N	\N	100.0000	100.0000	0.0000	0.0000	ACTIVO	FRAGANCIA	2026-09-07 19:25:51.405	2026-09-07 19:25:51.405	FRAGANCIA LIQUIDA	f
1f06b1b4-1ebc-49c2-acfa-21e5fb744e98	FRAG-038	FRAGANCIA LAVANDA INTENSE	ca259fab-2ab9-427a-b134-eb3a7b0cc8a1	GR	\N	\N	\N	66.0000	66.0000	0.0000	0.0000	ACTIVO	FRAGANCIA	2026-09-07 19:25:51.407	2026-09-07 19:25:51.407	FRAGANCIA LIQUIDA	f
6475b81b-64cf-4f77-a105-93f56c7ed7dc	FRAG-039	FRAGANCIA LIMACHEN	ca259fab-2ab9-427a-b134-eb3a7b0cc8a1	GR	\N	\N	\N	100.0000	100.0000	0.0000	0.0000	ACTIVO	FRAGANCIA	2026-09-07 19:25:51.409	2026-09-07 19:25:51.409	FRAGANCIA LIQUIDA	f
af9c6776-36ae-46e8-9851-3e53387f8e55	FRAG-040	FRAGANCIA LIMON CITRUS	ca259fab-2ab9-427a-b134-eb3a7b0cc8a1	GR	\N	\N	\N	62.0000	62.0000	0.0000	0.0000	ACTIVO	FRAGANCIA	2026-09-07 19:25:51.411	2026-09-07 19:25:51.411	FRAGANCIA LIQUIDA	f
2e58baf8-4611-48a1-8bf1-a1f0f7df2084	FRAG-041	FRAGANCIA LIMON INTENSE	ca259fab-2ab9-427a-b134-eb3a7b0cc8a1	GR	\N	\N	\N	100.0000	100.0000	0.0000	0.0000	ACTIVO	FRAGANCIA	2026-09-07 19:25:51.413	2026-09-07 19:25:51.413	FRAGANCIA LIQUIDA	f
33cad24e-4c26-4d9a-9a22-f74a59b3973c	FRAG-042	FRAGANCIA LRV FRESH	ca259fab-2ab9-427a-b134-eb3a7b0cc8a1	GR	\N	\N	\N	929.0000	929.0000	0.0000	0.0000	ACTIVO	FRAGANCIA	2026-09-07 19:25:51.415	2026-09-07 19:25:51.415	FRAGANCIA LIQUIDA	f
19e614d8-e94a-4ea0-b09e-ea292f9f0eba	FRAG-043	FRAGANCIA MANZANA	ca259fab-2ab9-427a-b134-eb3a7b0cc8a1	GR	\N	\N	\N	4627.0000	4627.0000	0.0000	0.0000	ACTIVO	FRAGANCIA	2026-09-07 19:25:51.418	2026-09-07 19:25:51.418	FRAGANCIA LIQUIDA	f
acbcaa8c-c0a1-4eea-b5ea-67dc6e4c7243	FRAG-044	FRAGANCIA MANZANA INTENSE	ca259fab-2ab9-427a-b134-eb3a7b0cc8a1	GR	\N	\N	\N	12.0000	12.0000	0.0000	0.0000	ACTIVO	FRAGANCIA	2026-09-07 19:25:51.421	2026-09-07 19:25:51.421	FRAGANCIA LIQUIDA	f
b50f30cb-0282-4d8f-b4ee-386df54c8450	FRAG-045	FRAGANCIA MANZANILLA	ca259fab-2ab9-427a-b134-eb3a7b0cc8a1	GR	\N	\N	\N	4404.0000	4404.0000	0.0000	0.0000	ACTIVO	FRAGANCIA	2026-09-07 19:25:51.423	2026-09-07 19:25:51.423	FRAGANCIA LIQUIDA	f
893d33f0-64ce-40bc-856f-362820ed3c45	FRAG-046	FRAGANCIA MARACUYA	ca259fab-2ab9-427a-b134-eb3a7b0cc8a1	GR	\N	\N	\N	1620.0000	1620.0000	0.0000	0.0000	ACTIVO	FRAGANCIA	2026-09-07 19:25:51.425	2026-09-07 19:25:51.425	LIQUIDO	f
1136e1fe-b6b4-441e-9917-ba7e2f975961	FRAG-047	FRAGANCIA MENTA	ca259fab-2ab9-427a-b134-eb3a7b0cc8a1	GR	\N	\N	\N	5165.0000	5165.0000	0.0000	0.0000	ACTIVO	FRAGANCIA	2026-09-07 19:25:51.428	2026-09-07 19:25:51.428	LIQUIDO	f
04a662cf-cb8d-487a-a02b-a4094cd9f9f7	FRAG-048	FRAGANCIA MIEL	ca259fab-2ab9-427a-b134-eb3a7b0cc8a1	GR	\N	\N	\N	1143.0000	1143.0000	0.0000	0.0000	ACTIVO	FRAGANCIA	2026-09-07 19:25:51.43	2026-09-07 19:25:51.43	LIQUIDO	f
70b59b91-2a38-4cb5-956f-93204a095553	FRAG-049	FRAGANCIA MIL FLORES	ca259fab-2ab9-427a-b134-eb3a7b0cc8a1	GR	\N	\N	\N	635.0000	635.0000	0.0000	0.0000	ACTIVO	FRAGANCIA	2026-09-07 19:25:51.432	2026-09-07 19:25:51.432	FRAGANCIA LIQUIDA	f
d6c440a9-e644-4121-b3bf-f6154b506505	FRAG-050	FRAGANCIA NARANJA	ca259fab-2ab9-427a-b134-eb3a7b0cc8a1	GR	\N	\N	\N	3982.0000	3982.0000	0.0000	0.0000	ACTIVO	FRAGANCIA	2026-09-07 19:25:51.435	2026-09-07 19:25:51.435	LIQUIDO	f
c0079a30-fe2c-45da-b1b8-4ea247b36aa6	FRAG-051	FRAGANCIA NEW CAR	ca259fab-2ab9-427a-b134-eb3a7b0cc8a1	GR	\N	\N	\N	965.0000	965.0000	0.0000	0.0000	ACTIVO	FRAGANCIA	2026-09-07 19:25:51.438	2026-09-07 19:25:51.438	FRAGANCIA LIQUIDA	f
7333a9b8-aab6-41df-8f3b-67c5c5c5fe6a	FRAG-052	FRAGANCIA NEW CARE	ca259fab-2ab9-427a-b134-eb3a7b0cc8a1	GR	\N	\N	\N	374.0000	374.0000	0.0000	0.0000	ACTIVO	FRAGANCIA	2026-09-07 19:25:51.44	2026-09-07 19:25:51.44	FRAGANCIA LIQUIDA	f
1e7843c8-03cc-4282-b52a-38b9b4ea809b	FRAG-053	FRAGANCIA ONE MILLION LUCKY	ca259fab-2ab9-427a-b134-eb3a7b0cc8a1	GR	\N	\N	\N	37.0000	37.0000	0.0000	0.0000	ACTIVO	FRAGANCIA	2026-09-07 19:25:51.443	2026-09-07 19:25:51.443	FRAGANCIA LIQUIDA	f
7daf0270-a064-4bea-9618-c3df739cc6d0	FRAG-054	FRAGANCIA PACO 212	ca259fab-2ab9-427a-b134-eb3a7b0cc8a1	GR	\N	\N	\N	42.0000	42.0000	0.0000	0.0000	ACTIVO	FRAGANCIA	2026-09-07 19:25:51.445	2026-09-07 19:25:51.445	FRAGANCIA LIQUIDA	f
541a4b55-f363-44a4-b5a6-0af56e20b172	FRAG-055	FRAGANCIA PACO LUCKY	ca259fab-2ab9-427a-b134-eb3a7b0cc8a1	GR	\N	\N	\N	11948.0000	11948.0000	0.0000	0.0000	ACTIVO	FRAGANCIA	2026-09-07 19:25:51.447	2026-09-07 19:25:51.447	LIQUIDO	f
6f04f29b-8890-4f4b-99da-341046be7a9d	FRAG-056	FRAGANCIA PACO RABAN (ANTIGUO)	ca259fab-2ab9-427a-b134-eb3a7b0cc8a1	GR	\N	\N	\N	826.0000	826.0000	0.0000	0.0000	ACTIVO	FRAGANCIA	2026-09-07 19:25:51.449	2026-09-07 19:25:51.449	LIQUIDO	f
86421574-214d-4938-a8d4-757eecc12ed0	FRAG-057	FRAGANCIA PACO RABAN (ANTO - INVICTO)	ca259fab-2ab9-427a-b134-eb3a7b0cc8a1	GR	\N	\N	\N	433.0000	433.0000	0.0000	0.0000	ACTIVO	FRAGANCIA	2026-09-07 19:25:51.453	2026-09-07 19:25:51.453	FRAGANCIA LIQUIDA	f
1c1dc238-52a3-41c7-b3d6-1c62a0a3a7bb	FRAG-058	FRAGANCIA PRO CUIDADO	ca259fab-2ab9-427a-b134-eb3a7b0cc8a1	GR	\N	\N	\N	250.0000	250.0000	0.0000	0.0000	ACTIVO	FRAGANCIA	2026-09-07 19:25:51.456	2026-09-07 19:25:51.456	FRAGANCIA LIQUIDA	f
9f33a048-f795-4755-b8d4-17048ff8ed49	FRAG-059	FRAGANCIA PURE FREEDOM 212	ca259fab-2ab9-427a-b134-eb3a7b0cc8a1	GR	\N	\N	\N	849.0000	849.0000	0.0000	0.0000	ACTIVO	FRAGANCIA	2026-09-07 19:25:51.459	2026-09-07 19:25:51.459	LIQUIDO	f
92cd8662-a9e4-4aa0-82d6-e09c15d55b5f	FRAG-060	FRAGANCIA PURE SEDUCTION	ca259fab-2ab9-427a-b134-eb3a7b0cc8a1	GR	\N	\N	\N	1001.0000	1001.0000	0.0000	0.0000	ACTIVO	FRAGANCIA	2026-09-07 19:25:51.462	2026-09-07 19:25:51.462	FRAGANCIA LIQUIDA	f
714844bc-a296-49c3-8305-1eb86f15e325	FRAG-061	FRAGANCIA RITCHIE CHANNE	ca259fab-2ab9-427a-b134-eb3a7b0cc8a1	GR	\N	\N	\N	228.0000	228.0000	0.0000	0.0000	ACTIVO	FRAGANCIA	2026-09-07 19:25:51.465	2026-09-07 19:25:51.465	LIQUIDO	f
c2ffefaf-b4c6-4846-94f3-3ecc4f91c466	FRAG-062	FRAGANCIA ROSAS	ca259fab-2ab9-427a-b134-eb3a7b0cc8a1	GR	\N	\N	\N	606.0000	606.0000	0.0000	0.0000	ACTIVO	FRAGANCIA	2026-09-07 19:25:51.469	2026-09-07 19:25:51.469	LIQUIDO	f
f002c8c0-96ae-45f9-8ca7-51383d0911d3	FRAG-063	FRAGANCIA SAUVAGE ELIXIR DIOR	ca259fab-2ab9-427a-b134-eb3a7b0cc8a1	GR	\N	\N	\N	3169.0000	3169.0000	0.0000	0.0000	ACTIVO	FRAGANCIA	2026-09-07 19:25:51.473	2026-09-07 19:25:51.473	FRAGANCIA LIQUIDA	f
6b741b7a-554a-4624-966a-1e311d24e2b5	FRAG-064	FRAGANCIA TEA TREE	ca259fab-2ab9-427a-b134-eb3a7b0cc8a1	GR	\N	\N	\N	1944.0000	1944.0000	0.0000	0.0000	ACTIVO	FRAGANCIA	2026-09-07 19:25:51.476	2026-09-07 19:25:51.476	FRAGANCIA LIQUIDA	f
9798ab89-377f-43c9-8fd4-8df072e63538	FRAG-065	FRAGANCIA ULTRAMAN	ca259fab-2ab9-427a-b134-eb3a7b0cc8a1	GR	\N	\N	\N	100.0000	100.0000	0.0000	0.0000	ACTIVO	FRAGANCIA	2026-09-07 19:25:51.478	2026-09-07 19:25:51.478	FRAGANCIA LIQUIDA	f
2ba29423-debf-4d28-ba08-1f42cbb64ace	FRAG-066	FRAGANCIA VAINILLA	ca259fab-2ab9-427a-b134-eb3a7b0cc8a1	GR	\N	\N	\N	2637.0000	2637.0000	0.0000	0.0000	ACTIVO	FRAGANCIA	2026-09-07 19:25:51.481	2026-09-07 19:25:51.481	LIQUIDO	f
dcf4a45a-b000-4a2d-9075-297ef4eb5b92	FRAG-067	FRAGANCIA VICARO	ca259fab-2ab9-427a-b134-eb3a7b0cc8a1	GR	\N	\N	\N	100.0000	100.0000	0.0000	0.0000	ACTIVO	FRAGANCIA	2026-09-07 19:25:51.483	2026-09-07 19:25:51.483	FRAGANCIA LIQUIDA	f
142683ed-234a-4d69-b4cb-2893937d1526	COL-001	COLORANTE A LA GRASA AMARILLO	f468a444-11d2-489c-a981-a6d5efbb85d3	GR	\N	\N	\N	36.0000	36.0000	0.0000	0.0000	ACTIVO	PIGMENTO	2026-09-07 19:25:51.486	2026-09-07 19:25:51.486	COLORANTE A LA GRASA	f
e7695b50-f7b0-42ce-9e24-2e0aacae691a	COL-002	COLORANTE A LA GRASA AZUL	f468a444-11d2-489c-a981-a6d5efbb85d3	GR	\N	\N	\N	14.0000	14.0000	0.0000	0.0000	ACTIVO	PIGMENTO	2026-09-07 19:25:51.489	2026-09-07 19:25:51.489	COLORANTE A LA GRASA	f
5089e9dc-9571-4224-96fb-9afb3e195435	COL-003	COLORANTE A LA GRASA NARANJA	f468a444-11d2-489c-a981-a6d5efbb85d3	GR	\N	\N	\N	812.0000	812.0000	0.0000	0.0000	ACTIVO	PIGMENTO	2026-09-07 19:25:51.491	2026-09-07 19:25:51.491	COLORANTE A LA GRASA	f
94c02ea6-ae0e-4013-aaca-a846e02c8659	COL-004	COLORANTE A LA GRASA NEGRO	f468a444-11d2-489c-a981-a6d5efbb85d3	GR	\N	\N	\N	100.0000	100.0000	0.0000	0.0000	ACTIVO	PIGMENTO	2026-09-07 19:25:51.494	2026-09-07 19:25:51.494	COLORANTE A LA GRASA	f
2d58274d-5a9a-4017-badb-a1de1ae19bb2	COL-005	COLORANTE A LA GRASA ROJO	f468a444-11d2-489c-a981-a6d5efbb85d3	GR	\N	\N	\N	103.0000	103.0000	0.0000	0.0000	ACTIVO	PIGMENTO	2026-09-07 19:25:51.496	2026-09-07 19:25:51.496	COLORANTE A LA GRASA	f
b7239408-5861-4542-8198-6e8ed987d8b4	COL-006	COLORANTE ACIDO AMARILLO	f468a444-11d2-489c-a981-a6d5efbb85d3	GR	\N	\N	\N	209.0000	209.0000	0.0000	0.0000	ACTIVO	PIGMENTO	2026-09-07 19:25:51.498	2026-09-07 19:25:51.498	COLORANTE (POLVO)	f
a8cbd4f1-8916-4168-be71-8060c5f8cff0	COL-007	COLORANTE ACIDO AZUL	f468a444-11d2-489c-a981-a6d5efbb85d3	GR	\N	\N	\N	495.0000	495.0000	0.0000	0.0000	ACTIVO	PIGMENTO	2026-09-07 19:25:51.501	2026-09-07 19:25:51.501	COLORANTE (POLVO)	f
e96366b8-a247-42d0-b618-48da51f435de	COL-008	COLORANTE ACIDO MARRON CROMO	f468a444-11d2-489c-a981-a6d5efbb85d3	GR	\N	\N	\N	258.0000	258.0000	0.0000	0.0000	ACTIVO	PIGMENTO	2026-09-07 19:25:51.504	2026-09-07 19:25:51.504	COLORANTE (POLVO)	f
610d3456-c42f-406f-85b8-07d7d6dded34	COL-009	COLORANTE ACIDO NARANJA II	f468a444-11d2-489c-a981-a6d5efbb85d3	GR	\N	\N	\N	108.0000	108.0000	0.0000	0.0000	ACTIVO	PIGMENTO	2026-09-07 19:25:51.506	2026-09-07 19:25:51.506	COLORANTE (POLVO)	f
6b259095-9792-4b58-b829-2604e670c4a7	COL-010	COLORANTE ACIDO NEGRO	f468a444-11d2-489c-a981-a6d5efbb85d3	GR	\N	\N	\N	115.0000	115.0000	0.0000	0.0000	ACTIVO	PIGMENTO	2026-09-07 19:25:51.509	2026-09-07 19:25:51.509	COLORANTE (POLVO)	f
1c82b66a-6f3b-4110-a2c9-fff7f2ff28ea	COL-011	COLORANTE ACIDO ROJO (RODAMINA B)	f468a444-11d2-489c-a981-a6d5efbb85d3	GR	\N	\N	\N	112.0000	112.0000	0.0000	0.0000	ACTIVO	PIGMENTO	2026-09-07 19:25:51.511	2026-09-07 19:25:51.511	COLORANTE (POLVO)	f
1e050492-ba1c-4e23-9c66-7f8b9cd699b6	COL-012	COLORANTE ACIDO ROJO AMARANTO	f468a444-11d2-489c-a981-a6d5efbb85d3	GR	\N	\N	\N	91.0000	91.0000	0.0000	0.0000	ACTIVO	PIGMENTO	2026-09-07 19:25:51.513	2026-09-07 19:25:51.513	COLORANTE (POLVO)	f
0caaf7c3-2644-4140-a2a7-1a83cc89f788	COL-013	COLORANTE ACIDO ROJO ESCARLATA	f468a444-11d2-489c-a981-a6d5efbb85d3	GR	\N	\N	\N	238.0000	238.0000	0.0000	0.0000	ACTIVO	PIGMENTO	2026-09-07 19:25:51.515	2026-09-07 19:25:51.515	COLORANTE (POLVO)	f
80531160-5ad1-43ae-a539-51e729553bb6	COL-014	COLORANTE ACIDO VERDE BRILLANTE	f468a444-11d2-489c-a981-a6d5efbb85d3	GR	\N	\N	\N	129.0000	129.0000	0.0000	0.0000	ACTIVO	PIGMENTO	2026-09-07 19:25:51.517	2026-09-07 19:25:51.517	COLORANTE (POLVO)	f
2b190c4b-a7d1-4559-878f-8078d818b709	COL-015	COLORANTE ACIDO VIOLETA	f468a444-11d2-489c-a981-a6d5efbb85d3	GR	\N	\N	\N	88.0000	88.0000	0.0000	0.0000	ACTIVO	PIGMENTO	2026-09-07 19:25:51.52	2026-09-07 19:25:51.52	COLORANTE (POLVO)	f
648259d4-9890-4835-9b82-4505863f0a70	COL-016	COLORANTE AL AGUA NARANJA	f468a444-11d2-489c-a981-a6d5efbb85d3	GR	\N	\N	\N	244.0000	244.0000	0.0000	0.0000	ACTIVO	PIGMENTO	2026-09-07 19:25:51.523	2026-09-07 19:25:51.523	COLORANTE (LIQUIDO)	f
4f9ee6a7-4c2a-4df0-a62e-bdfcc513081c	COL-017	COLORANTE AMARILLO	f468a444-11d2-489c-a981-a6d5efbb85d3	GR	\N	\N	\N	96.0000	96.0000	0.0000	0.0000	ACTIVO	PIGMENTO	2026-09-07 19:25:51.525	2026-09-07 19:25:51.525	COLORANTE (POLVO)	f
dcc50b47-aa99-442f-afc9-72d778d78548	COL-018	COLORANTE AMARILLO CLARO AL AGUA	f468a444-11d2-489c-a981-a6d5efbb85d3	GR	\N	\N	\N	114.0000	114.0000	0.0000	0.0000	ACTIVO	PIGMENTO	2026-09-07 19:25:51.527	2026-09-07 19:25:51.527	COLORANTE (LIQUIDO)	f
45a743d6-01d5-4749-b7dc-f96e51142b19	COL-019	COLORANTE AMARILLO DISPERSANTE	f468a444-11d2-489c-a981-a6d5efbb85d3	GR	\N	\N	\N	936.0000	936.0000	0.0000	0.0000	ACTIVO	PIGMENTO	2026-09-07 19:25:51.529	2026-09-07 19:25:51.529	LIQUIDO	f
8415b543-797e-4acb-bac8-71bfba84253f	COL-020	COLORANTE AZUL CRISTAL	f468a444-11d2-489c-a981-a6d5efbb85d3	GR	\N	\N	\N	109.0000	109.0000	0.0000	0.0000	ACTIVO	PIGMENTO	2026-09-07 19:25:51.531	2026-09-07 19:25:51.531	COLORANTE (POLVO)	f
1067e017-380d-4bac-9cbc-56f83b854e41	COL-021	COLORANTE AZUL DISPERSANTE	f468a444-11d2-489c-a981-a6d5efbb85d3	GR	\N	\N	\N	940.0000	940.0000	0.0000	0.0000	ACTIVO	PIGMENTO	2026-09-07 19:25:51.534	2026-09-07 19:25:51.534	LIQUIDO	f
6fa5c3a9-acd3-4318-a1c6-a67ef1b5b3a7	COL-022	COLORANTE AZUL OSCURO	f468a444-11d2-489c-a981-a6d5efbb85d3	GR	\N	\N	\N	1572.0000	1572.0000	0.0000	0.0000	ACTIVO	PIGMENTO	2026-09-07 19:25:51.537	2026-09-07 19:25:51.537	COLORANTE (POLVO)	f
e1af31c7-8b9c-48ba-9ce0-b568be2651cb	COL-023	COLORANTE B AMARILLO ORO	f468a444-11d2-489c-a981-a6d5efbb85d3	GR	\N	\N	\N	5225.0000	5225.0000	0.0000	0.0000	ACTIVO	PIGMENTO	2026-09-07 19:25:51.54	2026-09-07 19:25:51.54	COLORANTE (POLVO)	f
6efdfe36-2522-46b8-a935-a966cf863c23	COL-024	COLORANTE MARRON CROMO	f468a444-11d2-489c-a981-a6d5efbb85d3	GR	\N	\N	\N	250.0000	250.0000	0.0000	0.0000	ACTIVO	PIGMENTO	2026-09-07 19:25:51.542	2026-09-07 19:25:51.542	COLORANTE (POLVO)	f
223f13bb-0c56-4a16-b586-d56f942b9d35	COL-025	COLORANTE NARANJA	f468a444-11d2-489c-a981-a6d5efbb85d3	GR	\N	\N	\N	115.0000	115.0000	0.0000	0.0000	ACTIVO	PIGMENTO	2026-09-07 19:25:51.544	2026-09-07 19:25:51.544	COLORANTE (POLVO)	f
92113ec3-30a8-40e7-9447-270fb5551954	COL-026	COLORANTE OXIDO DE HIERRO AMARILLO	f468a444-11d2-489c-a981-a6d5efbb85d3	GR	\N	\N	\N	202.0000	202.0000	0.0000	0.0000	ACTIVO	PIGMENTO	2026-09-07 19:25:51.546	2026-09-07 19:25:51.546	POLVO	f
86a9857f-fb77-4d74-bf42-a9f35bd4a590	COL-027	COLORANTE OXIDO DE HIERRO ROJO	f468a444-11d2-489c-a981-a6d5efbb85d3	GR	\N	\N	\N	146.0000	146.0000	0.0000	0.0000	ACTIVO	PIGMENTO	2026-09-07 19:25:51.548	2026-09-07 19:25:51.548	POLVO	f
a042e5d4-c843-43dc-905d-9088009aebe1	COL-028	COLORANTE ROJO CLARO	f468a444-11d2-489c-a981-a6d5efbb85d3	GR	\N	\N	\N	245.0000	245.0000	0.0000	0.0000	ACTIVO	PIGMENTO	2026-09-07 19:25:51.55	2026-09-07 19:25:51.55	COLORANTE (POLVO)	f
2a2102ec-cc83-42de-bd0f-069467259d33	COL-029	COLORANTE ROJO DISPERSANTE	f468a444-11d2-489c-a981-a6d5efbb85d3	GR	\N	\N	\N	572.0000	572.0000	0.0000	0.0000	ACTIVO	PIGMENTO	2026-09-07 19:25:51.553	2026-09-07 19:25:51.553	LIQUIDO	f
31ca8952-a581-465a-b0ae-498d8d7f9273	COL-030	COLORANTE ROJO PULSO	f468a444-11d2-489c-a981-a6d5efbb85d3	GR	\N	\N	\N	476.0000	476.0000	0.0000	0.0000	ACTIVO	PIGMENTO	2026-09-07 19:25:51.556	2026-09-07 19:25:51.556	COLORANTE (POLVO)	f
b09e3481-4e24-4a78-ba02-0b6a9da6386c	COL-031	COLORANTE ROJO RODAMIDA (RODAMINA)	f468a444-11d2-489c-a981-a6d5efbb85d3	GR	\N	\N	\N	238.0000	238.0000	0.0000	0.0000	ACTIVO	PIGMENTO	2026-09-07 19:25:51.558	2026-09-07 19:25:51.558	COLORANTE (POLVO)	f
34f9e0a3-8b23-4ce5-9589-4cdaa86c0371	COL-032	COLORANTE ROJO SANGRE	f468a444-11d2-489c-a981-a6d5efbb85d3	GR	\N	\N	\N	134.0000	134.0000	0.0000	0.0000	ACTIVO	PIGMENTO	2026-09-07 19:25:51.56	2026-09-07 19:25:51.56	COLORANTE (POLVO)	f
29b7d881-8e1d-497f-ac28-ab78cbd19402	COL-033	COLORANTE S-NEGRO	f468a444-11d2-489c-a981-a6d5efbb85d3	GR	\N	\N	\N	1004.0000	1004.0000	0.0000	0.0000	ACTIVO	PIGMENTO	2026-09-07 19:25:51.563	2026-09-07 19:25:51.563	COLORANTE (POLVO)	f
f0d037dc-e1bf-4ca0-a093-7fdf254d457b	COL-034	COLORANTE VERDE	f468a444-11d2-489c-a981-a6d5efbb85d3	GR	\N	\N	\N	135.0000	135.0000	0.0000	0.0000	ACTIVO	PIGMENTO	2026-09-07 19:25:51.565	2026-09-07 19:25:51.565	COLORANTE (POLVO)	f
5338a08c-82a3-4bea-a78f-b517e0369954	COL-035	COLORANTE VERDE DISPERSANTE	f468a444-11d2-489c-a981-a6d5efbb85d3	GR	\N	\N	\N	1211.0000	1211.0000	0.0000	0.0000	ACTIVO	PIGMENTO	2026-09-07 19:25:51.567	2026-09-07 19:25:51.567	LIQUIDO	f
97f9bed7-7d4d-4080-997f-176d5e488b52	COL-036	COLORANTE VERDE FLUORESCENTE	f468a444-11d2-489c-a981-a6d5efbb85d3	GR	\N	\N	\N	132.0000	132.0000	0.0000	0.0000	ACTIVO	PIGMENTO	2026-09-07 19:25:51.579	2026-09-07 19:25:51.579	COLORANTE POLVO	f
3b44b715-f1e3-4eb2-9ab9-e35cdcfb0b53	COL-037	COLORANTE VERDE LAVAVAJILLAS	f468a444-11d2-489c-a981-a6d5efbb85d3	GR	\N	\N	\N	102.0000	102.0000	0.0000	0.0000	ACTIVO	PIGMENTO	2026-09-07 19:25:51.581	2026-09-07 19:25:51.581	COLORANTE (POLVO)	f
71a9caa6-2047-40dc-a1a8-d6905ad72d0b	COL-038	COLORANTE VIOLETA	f468a444-11d2-489c-a981-a6d5efbb85d3	GR	\N	\N	\N	43.0000	43.0000	0.0000	0.0000	ACTIVO	PIGMENTO	2026-09-07 19:25:51.583	2026-09-07 19:25:51.583	COLORANTE (POLVO)	f
6a3c567f-7bd3-411d-8aaf-f750a46b11c2	COL-039	COLORANTE VIOLETA MORADO	f468a444-11d2-489c-a981-a6d5efbb85d3	GR	\N	\N	\N	361.0000	361.0000	0.0000	0.0000	ACTIVO	PIGMENTO	2026-09-07 19:25:51.586	2026-09-07 19:25:51.586	COLORANTE (POLVO)	f
b9c1ea64-810e-4dcd-a590-e494005b01dc	COL-040	DISPERSANTE BLANCO CONCENTRADO	f468a444-11d2-489c-a981-a6d5efbb85d3	GR	\N	\N	\N	5000.0000	5000.0000	0.0000	0.0000	ACTIVO	PIGMENTO	2026-09-07 19:25:51.589	2026-09-07 19:25:51.589	CREMA	f
e83bff71-bddb-43a6-9c99-28021f004e94	COL-041	DISPERSANTE MORADO	f468a444-11d2-489c-a981-a6d5efbb85d3	GR	\N	\N	\N	5964.0000	5964.0000	0.0000	0.0000	ACTIVO	PIGMENTO	2026-09-07 19:25:51.591	2026-09-07 19:25:51.591	CREMA	f
88dd160b-f23a-4228-85f5-97c7e6e0b05d	COL-042	DISPERSANTE NEGRO	f468a444-11d2-489c-a981-a6d5efbb85d3	GR	\N	\N	\N	11278.0000	11278.0000	0.0000	0.0000	ACTIVO	PIGMENTO	2026-09-07 19:25:51.593	2026-09-07 19:25:51.593	LIQUIDO	f
c9dbac8e-9510-4e60-a9c6-7ec9a6849ac5	COL-043	OXIDO DE HIERRO AZUL (AZUL MILORI)	f468a444-11d2-489c-a981-a6d5efbb85d3	GR	\N	\N	\N	240.0000	240.0000	0.0000	0.0000	ACTIVO	PIGMENTO	2026-09-07 19:25:51.595	2026-09-07 19:25:51.595	POLVO	f
8d1168b6-9bbf-48e5-aecd-d797475f55cd	COL-044	OXIDO DE HIERRO AZUL ULTRAMAR 462	f468a444-11d2-489c-a981-a6d5efbb85d3	GR	\N	\N	\N	482.0000	482.0000	0.0000	0.0000	ACTIVO	PIGMENTO	2026-09-07 19:25:51.597	2026-09-07 19:25:51.597	POLVO	f
48cf50a8-34a2-457a-a8c0-ce76d47c2c84	COL-045	OXIDO DE HIERRO MARRON 610 (PARDO)	f468a444-11d2-489c-a981-a6d5efbb85d3	GR	\N	\N	\N	254.0000	254.0000	0.0000	0.0000	ACTIVO	PIGMENTO	2026-09-07 19:25:51.599	2026-09-07 19:25:51.599	PIGMENTO / OXIDO	f
59fc14b9-088d-4fc9-964a-241878f527bf	COL-046	OXIDO DE HIERRO NARANJA MOLIBDEN NL	f468a444-11d2-489c-a981-a6d5efbb85d3	GR	\N	\N	\N	146.0000	146.0000	0.0000	0.0000	ACTIVO	PIGMENTO	2026-09-07 19:25:51.603	2026-09-07 19:25:51.603	PIGMENTO / OXIDO	f
0ed6a508-1186-4522-9fe5-d25f0d4f52ed	COL-047	OXIDO DE HIERRO VERDE	f468a444-11d2-489c-a981-a6d5efbb85d3	GR	\N	\N	\N	232.0000	232.0000	0.0000	0.0000	ACTIVO	PIGMENTO	2026-09-07 19:25:51.605	2026-09-07 19:25:51.605	POLVO	f
4cf766e4-3483-45e8-acfa-09a36d81ee9f	COL-048	PERLADO DORADO RC-300	f468a444-11d2-489c-a981-a6d5efbb85d3	GR	\N	\N	\N	249.0000	249.0000	0.0000	0.0000	ACTIVO	PIGMENTO	2026-09-07 19:25:51.607	2026-09-07 19:25:51.607	POLVO	f
0d064da8-a5cc-4369-a68e-133f294f41de	COL-049	PERLADO DORADO RC-303	f468a444-11d2-489c-a981-a6d5efbb85d3	GR	\N	\N	\N	183.0000	183.0000	0.0000	0.0000	ACTIVO	PIGMENTO	2026-09-07 19:25:51.609	2026-09-07 19:25:51.609	POLVO	f
5aabe2ff-b334-4b47-9a0d-12fa87511f70	COL-050	POLVO DORADO DE BRONCE RPG	f468a444-11d2-489c-a981-a6d5efbb85d3	GR	\N	\N	\N	249.0000	249.0000	0.0000	0.0000	ACTIVO	PIGMENTO	2026-09-07 19:25:51.612	2026-09-07 19:25:51.612	POLVO	f
ea75d924-a8cb-41f7-99b1-dd3b2f803085	ESP-002	ACEITE DE COPAIBA	f3d25455-ed0b-4167-93e1-b03b5200e551	GR	\N	\N	\N	0.0000	0.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.616	2026-09-07 19:25:51.616	LIQUIDO	t
7c9b13f6-8fd9-4b35-ab82-f4ba8c756289	ESP-003	ACEITE DE MACADAMIA	f3d25455-ed0b-4167-93e1-b03b5200e551	GR	\N	\N	\N	0.0000	0.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.62	2026-09-07 19:25:51.62	LIQUIDO	t
1c8fe2f4-1435-4a5f-a9fc-8de4b5d9bbe0	ESP-004	ACEITE DE SEMILLAS DE UVA	f3d25455-ed0b-4167-93e1-b03b5200e551	GR	\N	\N	\N	0.0000	0.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.623	2026-09-07 19:25:51.623	LIQUIDO	t
bd88641b-9136-4d77-a681-5862e23a8a74	ESP-005	ACEITE ESENCIAL DE ARNICA	f3d25455-ed0b-4167-93e1-b03b5200e551	GR	\N	\N	\N	0.0000	0.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.625	2026-09-07 19:25:51.625	LIQUIDO	t
b76c22b6-364e-484e-919c-699c198605e5	ESP-006	AGUA DE ROSAS	459481c9-5211-48c8-94e6-932065ffdcd1	GR	\N	\N	\N	0.0000	0.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.628	2026-09-07 19:25:51.628	LIQUIDO	t
15d72f0a-f093-4dd2-9645-ffba442e9de7	ESP-007	AGUA MEJORADA	459481c9-5211-48c8-94e6-932065ffdcd1	GR	\N	\N	\N	0.0000	0.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.63	2026-09-07 19:25:51.63	LIQUIDO	t
28e143aa-6b1e-4802-8c0e-fa24fb835a27	ESP-008	AZUCAR BLANCA	e76cf865-819b-47d0-9e60-fbcbed29f2dc	GR	\N	\N	\N	0.0000	0.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.632	2026-09-07 19:25:51.632	GRANO	t
1bd04830-09a6-43ba-8ed5-428e44cbbc51	ESP-009	AZUCAR RUBIA	e76cf865-819b-47d0-9e60-fbcbed29f2dc	GR	\N	\N	\N	0.0000	0.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.635	2026-09-07 19:25:51.635	GRANO	t
8dffe7ac-a8d4-4e4a-91a5-bf4355526b23	ESP-010	BASE GLICERINA	459481c9-5211-48c8-94e6-932065ffdcd1	GR	\N	\N	\N	0.0000	0.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.638	2026-09-07 19:25:51.638	BLOQUE	t
68df4e31-dcd6-4776-99f2-cf707a7288a6	ESP-011	BRONIDOX	90b57950-0d6f-416c-9b55-eecdd7816fcd	GR	\N	\N	\N	0.0000	0.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.641	2026-09-07 19:25:51.641	LIQUIDO	t
92d8d3aa-f847-44f8-92d5-e75ccda229ab	ESP-012	ESTEARATO GLICERILO SE	4e3404d0-f57c-4447-b1cf-fd2f645f40c2	GR	\N	\N	\N	0.0000	0.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.643	2026-09-07 19:25:51.643	SOLIDO	t
680bb3f2-3b9d-47d4-aaad-f024b910bb89	ESP-013	EXTRACTO DE ALGAS	1883d81b-c0f6-4499-9a76-c0d7b3133987	GR	\N	\N	\N	0.0000	0.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.646	2026-09-07 19:25:51.646	EXTRACTO LIQUIDO	t
07786a0b-ba83-4789-a413-21d6c1e1f419	ESP-014	LIPOCOL 40	4e3404d0-f57c-4447-b1cf-fd2f645f40c2	GR	\N	\N	\N	0.0000	0.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.648	2026-09-07 19:25:51.648	LIQUIDO	t
58e3cd43-5211-4861-8e62-a3e6b4440b70	ESP-015	NEGRO DE METILENO	f468a444-11d2-489c-a981-a6d5efbb85d3	GR	\N	\N	\N	0.0000	0.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.65	2026-09-07 19:25:51.65	POLVO	t
67579fb8-432a-4139-afce-545553fed748	ESP-016	PIRITIONATO DE ZINC	e76cf865-819b-47d0-9e60-fbcbed29f2dc	GR	\N	\N	\N	0.0000	0.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.653	2026-09-07 19:25:51.653	LIQUIDO	t
8ba45eae-36af-4b82-9cf1-9072879844b3	ESP-017	QUERATINA	e76cf865-819b-47d0-9e60-fbcbed29f2dc	GR	\N	\N	\N	0.0000	0.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.656	2026-09-07 19:25:51.656	LIQUIDO	t
fb2d954f-be02-4ae5-a4e4-dedca6cddb05	ESP-018	RETINOL	e76cf865-819b-47d0-9e60-fbcbed29f2dc	GR	\N	\N	\N	0.0000	0.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.658	2026-09-07 19:25:51.658	LIQUIDO	t
c7f5105c-6bbb-46f1-911d-192ad99a39c8	ESP-019	SABORIZANTE CANELA	ca259fab-2ab9-427a-b134-eb3a7b0cc8a1	GR	\N	\N	\N	0.0000	0.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.66	2026-09-07 19:25:51.66	LIQUIDO	t
88b2929d-ccba-4bb7-a053-234873f49a84	ESP-020	SABORIZANTE SANDIA	ca259fab-2ab9-427a-b134-eb3a7b0cc8a1	GR	\N	\N	\N	0.0000	0.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.663	2026-09-07 19:25:51.663	LIQUIDO	t
279276a3-5acc-466e-b494-7f1340d85ec4	ESP-021	TENSOACTIVO SCI	5e122e5f-f303-42ac-baab-586f4ec650d4	GR	\N	\N	\N	0.0000	0.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.665	2026-09-07 19:25:51.665	POLVO	t
4dd73445-63fb-44cd-9d92-54166b5118fe	ESP-022	ACEITE DE COCO EXTRA VIRGEN	f3d25455-ed0b-4167-93e1-b03b5200e551	GR	\N	\N	\N	0.0000	0.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.668	2026-09-07 19:25:51.668	LIQUIDO	t
b735de2e-97a4-43f4-91f0-0b7b0e3e4f57	ESP-023	HIDROXIDO DE SODIO	e76cf865-819b-47d0-9e60-fbcbed29f2dc	GR	\N	\N	\N	0.0000	0.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.671	2026-09-07 19:25:51.671	GRANO	t
81695ca9-b07a-4264-9e64-f007fa8f6c42	VENC-001	FRAGANCIA GOOD GIRL	ca259fab-2ab9-427a-b134-eb3a7b0cc8a1	GR	\N	\N	\N	0.0000	0.0000	0.0000	0.0000	INACTIVO	FRAGANCIA	2026-09-07 19:25:51.673	2026-09-07 19:25:51.673	LIQUIDO	f
f444c430-fd70-4ad6-95e4-575599a408be	VENC-002	FRAGANCIA MIX FRUTAS	ca259fab-2ab9-427a-b134-eb3a7b0cc8a1	GR	\N	\N	\N	0.0000	0.0000	0.0000	0.0000	INACTIVO	FRAGANCIA	2026-09-07 19:25:51.676	2026-09-07 19:25:51.676	LIQUIDO	f
cb79f8a4-0b14-4203-8144-d00af9c5dc64	VENC-003	SABORIZANTE CHICLE	ca259fab-2ab9-427a-b134-eb3a7b0cc8a1	GR	\N	\N	\N	0.0000	0.0000	0.0000	0.0000	INACTIVO	FRAGANCIA	2026-09-07 19:25:51.678	2026-09-07 19:25:51.678	LIQUIDO	f
fe94b3d9-b108-4d75-8849-64a2af654d59	VENC-004	SABORIZANTE CLAVO DE OLOR	ca259fab-2ab9-427a-b134-eb3a7b0cc8a1	GR	\N	\N	\N	0.0000	0.0000	0.0000	0.0000	INACTIVO	FRAGANCIA	2026-09-07 19:25:51.681	2026-09-07 19:25:51.681	LIQUIDO	f
efec6b4b-6d09-46fc-902c-c9c173f8d347	ESP-001	ACEITE DE AGUACATE	f3d25455-ed0b-4167-93e1-b03b5200e551	GR	\N	\N	\N	0.0000	0.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.614	2026-09-07 20:47:21.797	LIQUIDO	t
6925c9ab-da76-4077-864c-7a35dd36e1ab	ENV-002	GALONERA / BIDON DE 120 LITROS	a854aaba-1041-483d-a506-4e9e2fb44d65	UN	\N	\N	\N	159.0000	159.0000	0.0000	0.0000	ACTIVO	ENVASE	2026-09-07 20:26:19.554	2026-09-07 21:00:43.443	GALONERA	f
22abc39c-3137-4112-949a-3e993f7976c8	ENV-001	BALDE DE 20 LITROS CON TAPA	a854aaba-1041-483d-a506-4e9e2fb44d65	UN	\N	\N	\N	141.0000	141.0000	0.0000	0.0000	ACTIVO	ENVASE	2026-09-07 20:26:19.534	2026-09-07 21:14:50.553	BALDE	f
7933f07a-a446-4894-b0da-c791c262fd09	INS-072	DIPROPILENGLICOL	459481c9-5211-48c8-94e6-932065ffdcd1	GR	\N	\N	\N	20000.0000	20000.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.084	2026-09-08 13:34:36.312	LIQUIDO	f
d64c14fa-3514-42c2-a2c3-9089724e50e3	INS-101	ISOPROPILO DE MIRISTATO	e666504d-be2a-4cef-bb50-81d4f6c141f6	GR	\N	\N	\N	498792.0000	498792.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-07 19:25:51.159	2026-09-08 13:34:36.333	LIQUIDO	f
9970b88d-ccef-460e-8724-41f331750fa8	ESP-024	PROTEINA DE TRIGO HIDROLIZADA	1883d81b-c0f6-4499-9a76-c0d7b3133987	GR	\N	\N	\N	0.0000	0.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419	\N	t
5e4bece3-960e-4857-99c6-2bffe32518a2	ESP-025	PALMITATO DE ISOPROPILO	e666504d-be2a-4cef-bb50-81d4f6c141f6	GR	\N	\N	\N	0.0000	0.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419	\N	t
5480454e-c3c6-476d-b99e-8a7788757e7a	ESP-026	ACEITE ESENCIAL DE CIPRES	f3d25455-ed0b-4167-93e1-b03b5200e551	GR	\N	\N	\N	0.0000	0.0000	0.0000	0.0000	ACTIVO	OTRO	2026-09-08 17:31:13.419	2026-09-08 17:31:13.419	\N	t
\.


--
-- Data for Name: kardex_inmutable; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.kardex_inmutable (id, "insumoId", "tipoMovimiento", cantidad, "stockAnterior", "stockNuevo", "documentoReferencia", "usuarioId", "createdAt") FROM stdin;
a6c9aa6b-7e2c-418a-91b4-eb73914c6780	82bbbad6-cce9-48ef-90e1-e3db6d129421	ENTRADA	6530.0000	0.0000	6530.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:51.697
634bce2c-1d6f-44d6-8b87-a4eeef3a2b2f	e254d18a-5a27-49d8-ac93-7b001a124930	ENTRADA	7081.0000	0.0000	7081.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:51.708
6440a4ed-db42-4bd7-bf14-9146dd87cff0	3d1b2079-8e4f-455f-ba1d-71ed13bb38ed	ENTRADA	6123.0000	0.0000	6123.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:51.718
f8bc78bc-051e-42e2-b6f8-29513e3f5eff	5caf121a-99a7-4ead-b8df-7c48a02818db	ENTRADA	1924.0000	0.0000	1924.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:51.726
c119c965-2ddb-4d30-be63-a705880a41e6	f5c778e9-bbfc-4fef-aa32-9b32a6db83c7	ENTRADA	60694.0000	0.0000	60694.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:51.732
7bef1544-8f7d-4145-95c5-c3cd6b13c1fc	dc1761ba-bf39-41fc-bc4d-e48b3e2e1114	ENTRADA	9935.0000	0.0000	9935.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:51.74
daa8ecd6-85f2-4ca2-a1ec-8635c7b8aa87	6b1e6d35-4100-45ab-bef7-91f43803549d	ENTRADA	105.0000	0.0000	105.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:51.747
de1d126f-1b4e-4186-a120-a9768f9f1e7f	2a7330af-31b4-4c6f-acf7-ba076bc22aab	ENTRADA	1133.0000	0.0000	1133.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:51.754
c3a279b7-3708-49cb-a8a3-e84c5d0e2b42	fa33e7f3-d81e-41f9-9949-678a92eff8e6	ENTRADA	9706.0000	0.0000	9706.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:51.76
8f3e5766-f9c3-4db7-81b9-c77d0d900034	ad8d4fcd-8173-4bab-a6d8-221fc45396a6	ENTRADA	1452.0000	0.0000	1452.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:51.766
2ad3b5b7-cbf8-4451-970f-5fc0efba7afd	5bb3d411-d5be-462a-8d26-11725b5d41e5	ENTRADA	21519.0000	0.0000	21519.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:51.773
6688e8b6-3dae-4815-8e6d-2da0cc8bb664	21e40a49-e4d9-43f0-b94d-dbba64570dd4	ENTRADA	4258.0000	0.0000	4258.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:51.779
dd815201-bc43-4307-a43b-adb9ce96461b	f74e5cd9-0d3f-425f-b46e-904fd7669650	ENTRADA	12686.0000	0.0000	12686.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:51.786
3f116d07-a89a-4d8e-b313-0b56f767bffe	59b5bd63-1199-4880-90d9-519213f9b67d	ENTRADA	7350.0000	0.0000	7350.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:51.793
4dbecb11-1091-45e2-9a64-8c4db5c340ad	2be1c138-5b1e-459d-bb39-ab0e210b426c	ENTRADA	727.0000	0.0000	727.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:51.799
b4e63821-377b-4684-adee-6a64844d97b6	1a65b0df-716d-4352-8e1d-506dfbf946fd	ENTRADA	6440.0000	0.0000	6440.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:51.807
b0d8670f-e79a-4405-8d33-8a15dde751b7	2585af84-0476-44c1-bddd-6569609dea26	ENTRADA	17161.0000	0.0000	17161.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:51.813
0f4621e2-7e79-4059-90e7-a30c47db3ec6	8c976f06-4a53-4784-8b2d-c1648fa3a3b8	ENTRADA	75255.0000	0.0000	75255.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:51.82
672a2fee-bb22-4bd5-91a8-07149b10c7ef	7f2576a8-7dfc-4bb4-8a4f-04170492a8e5	ENTRADA	446.0000	0.0000	446.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:51.826
d34aaa32-d8e8-42d3-9d5c-3dc74e9578b4	dd11ade7-d444-49e4-9490-35179c4132cc	ENTRADA	3642.0000	0.0000	3642.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:51.832
19817e88-b46b-409d-8f96-b40cdb57b3b1	84f19242-2248-4ff3-b333-abb36b715f2a	ENTRADA	7266.0000	0.0000	7266.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:51.84
adf14fb6-8017-425b-8e7f-fd22ece25f00	becf6944-0163-4bed-a3a5-25908da5ecd1	ENTRADA	10835.0000	0.0000	10835.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:51.847
c9b223cd-c67f-408a-a41f-c1cdf52d2304	c569a318-267a-4315-9bd0-7b6fe75ff45e	ENTRADA	1872.0000	0.0000	1872.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:51.854
c8667813-2400-4a62-ab00-f5f395cabb89	8778c09f-3f10-46ae-b4a6-950c62775a8b	ENTRADA	820.0000	0.0000	820.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:51.861
14c2c970-94e3-40cc-ae9e-81bffe7dcd03	64534917-1fa8-4ad6-aef5-58254449a729	ENTRADA	47776.0000	0.0000	47776.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:51.869
9773a107-7e83-4fac-addf-2c789b324af2	6a8ce5ca-c130-42b9-9ebb-5eeb00e76eab	ENTRADA	12028.0000	0.0000	12028.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:51.877
0b91bfb8-f96b-4a12-a7cb-a8f43956de00	1ee9c4ca-13cb-4386-a480-9e35c6a6484c	ENTRADA	4515.0000	0.0000	4515.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:51.885
343fc3ce-cd87-4e94-b118-d049db45e25b	e4261caf-b4e8-4fff-8349-48d8d21c89f5	ENTRADA	285.0000	0.0000	285.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:51.893
f826de8d-e99e-4673-8b83-f53801ecb5ae	4ae04ce7-69dc-4aa3-b91f-38227df1ccc1	ENTRADA	4941.0000	0.0000	4941.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:51.9
f65f8732-aa3f-4252-8d61-cad1b39b015f	c2cce8b2-2bdb-4752-b8a0-946e94b14e19	ENTRADA	364568.0000	0.0000	364568.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:51.909
dc190787-4f92-4137-9097-25c16b207e72	ff2e578a-4456-4d54-8bc2-1f9ec6c8cc7c	ENTRADA	15576.0000	0.0000	15576.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:51.916
122c6985-7081-4e6d-b1cf-764b0f437d20	9c452016-ddf6-4271-bedc-b9bd5ee69ad8	ENTRADA	4110.0000	0.0000	4110.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:51.924
0880a649-3866-490e-b561-bee3076c9294	f0cbaabe-0290-42b3-a5a2-d637cb5c584f	ENTRADA	13516.0000	0.0000	13516.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:51.93
5c80ffb4-51b1-4586-902a-b39a688482ab	8849ff42-8f1d-4bb7-9b63-154fb2a329d3	ENTRADA	7499.0000	0.0000	7499.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:51.938
88f2cba9-5ea1-4c0f-8c83-7138bbe9c796	9c3c9b3b-7eef-4d3c-bc51-df944f79b354	ENTRADA	200000.0000	0.0000	200000.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:51.945
3aea09b6-326a-4f24-8d66-345b6afdc976	9f73b776-f31c-4aaa-824f-2d10b9332f3e	ENTRADA	47870.0000	0.0000	47870.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:51.951
0e7a24be-fe48-4a0c-b403-4d5cc7296975	ff28dc8d-0d58-44b5-9c30-d752cae50a6b	ENTRADA	200829.0000	0.0000	200829.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:51.959
6700cd4f-2980-4184-becd-61f965904305	2dc9f7e8-8312-4397-a326-01c576bb5474	ENTRADA	1216.0000	0.0000	1216.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:51.965
fee08897-6a81-4756-a2a1-0124ac2e3550	ed9dcb9b-ee3c-45e0-b439-c211c2c076c2	ENTRADA	1893.0000	0.0000	1893.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:51.973
84c1c9ae-a6cb-4f0f-b0f7-a7fa95b0fa34	c8637838-5f01-4fc6-8683-627af2319ab0	ENTRADA	23660.0000	0.0000	23660.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:51.98
30103ffa-6985-442a-a575-5a5e558a566d	9efb8c66-684a-4022-86fb-df9deebc5148	ENTRADA	812.0000	0.0000	812.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:51.988
3e9bdfc3-0d32-4420-83ce-1879b17e0f33	bb068fc4-e4e9-4ee5-92ab-2cd315ad8cc7	ENTRADA	22700.0000	0.0000	22700.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:51.996
ad30bad4-3218-47f1-81d1-2d82c2997878	503a47d1-8230-410a-bbd1-b76b0a91ba24	ENTRADA	16149.0000	0.0000	16149.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.004
aba7c189-6e53-4b5e-9747-2a2894a688d1	22fabeae-a648-4909-8618-c6e6704ba256	ENTRADA	172001.0000	0.0000	172001.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.011
f147500b-4e9a-4a93-852e-f60595d0b522	e388eb54-9f5e-405f-8d20-496024c952fb	ENTRADA	18019.0000	0.0000	18019.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.018
f6a2af68-ff12-4157-ba11-2b6d1028e5a6	c0c0e5c8-e317-4103-b8e6-916f73b52026	ENTRADA	984.0000	0.0000	984.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.026
f395f7cf-4bf3-4dae-b3bf-2826ffa6367f	259a5b05-d82a-4099-a642-61b2231d6ead	ENTRADA	510.0000	0.0000	510.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.033
2fc57182-4ba6-4279-ba32-26214414e097	bcbc8cc8-10e5-4c24-84a9-e267492364bb	ENTRADA	24490.0000	0.0000	24490.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.044
3047e6ec-6653-44de-9a43-f180476d4e96	0b0e329a-b9ae-48f1-9d13-65ffb8295b6e	ENTRADA	36600.0000	0.0000	36600.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.054
91d91ace-84dc-4bbd-a032-8a6288979d7e	71b6405e-25d0-4545-820a-30364ac4c89e	ENTRADA	26131.0000	0.0000	26131.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.062
c7a45e9e-4a99-4dc6-a117-fa2a9bd3e369	adaf4fa9-589b-4440-b3c4-8c20568d4b49	ENTRADA	48310.0000	0.0000	48310.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.073
058f8a5a-998e-4f97-8ee2-22e50358c13f	d8ea939d-a926-4883-aa59-1447b492e135	ENTRADA	42247.0000	0.0000	42247.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.082
01528355-cf1b-4e43-8c07-35e19547eebb	2556b4df-e535-47b5-bfcb-a34622f6f0fe	ENTRADA	27300.0000	0.0000	27300.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.093
440b9845-7a67-45fd-9c92-dc234146f7d2	4b5b2284-c252-486b-a8cd-0e2cb39c9928	ENTRADA	8194.0000	0.0000	8194.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.101
71f31779-2781-429c-a837-23a829aeebb5	23e5d25d-db99-47d2-8c2b-788174388397	ENTRADA	32900.0000	0.0000	32900.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.109
3fc35160-6edf-4c90-ac79-affea00061fc	a5dc8d7c-4590-4800-9638-db8fedc01221	ENTRADA	18750.0000	0.0000	18750.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.117
d8b12da7-2637-4d8a-9890-d0f7720483b9	fe8c6e9a-f4ee-4a9a-ba58-d91f49425757	ENTRADA	78677.0000	0.0000	78677.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.124
4d49521c-0d63-464e-b6c5-31539eff9f11	77266003-61c5-4631-b9fe-7533eb7f7beb	ENTRADA	6321.0000	0.0000	6321.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.131
5985194d-2b97-4ca6-91b2-7569abca47a7	6f597885-c511-429f-a9c9-e44f858f6ce5	ENTRADA	25000.0000	0.0000	25000.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.138
9540163b-22de-4f49-833d-e373fc9e22f0	c488a9b9-fe87-4cf8-91be-2eceb65198ac	ENTRADA	1226.0000	0.0000	1226.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.144
032df122-9ecc-4eec-a46c-56f975f74521	6ebc3b68-7093-4e6b-9db3-2319895dc64b	ENTRADA	17050.0000	0.0000	17050.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.15
5b6d8135-d289-4033-9ddb-b98f1ea2e0f1	8176c9a8-6276-4fb3-abaa-8cd62dea89b0	ENTRADA	4243.0000	0.0000	4243.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.156
c28ce22f-a1c2-4658-92db-1337857fbd83	af5ed9d6-a35f-4f15-bad4-9f834901d8c0	ENTRADA	32662.0000	0.0000	32662.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.162
74965b5a-348b-4ffe-ad69-aa64785fcf17	8f35e8ac-189c-47ef-b6c2-9f29a665fccc	ENTRADA	9375.0000	0.0000	9375.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.168
84369152-9332-4ad0-b145-61c9ccef0674	d43e9dda-d68f-4b16-b725-9deb616065eb	ENTRADA	3472.0000	0.0000	3472.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.175
d925f35f-3bdf-41cb-823d-82ac13d952e3	b38a0c8f-a8e7-4e30-9f26-5352f349ce69	ENTRADA	3284.0000	0.0000	3284.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.18
6d5d59d9-42d5-41f9-9978-2ffcf88aa0f2	eed50ae4-682c-4b3a-9fc6-27b3f992b26e	ENTRADA	13385.0000	0.0000	13385.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.187
75cd41b3-43d1-4350-9d92-b235819c0a44	eb30f874-6891-40aa-9a99-8090f0dddf5b	ENTRADA	12935.0000	0.0000	12935.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.193
cfa76c1b-f06c-4667-be6f-15138265287f	a7931626-b6ab-450d-b7e8-484d773cf1aa	ENTRADA	80000.0000	0.0000	80000.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.199
0fe733c6-e978-4665-8347-4cdb56f3019a	cdf61ea3-02c1-4b78-94c4-178398121a4a	ENTRADA	23000.0000	0.0000	23000.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.207
fcabf84c-cb3f-46d2-bdaf-d9c806c83c52	205dcb75-c01e-4312-9fc8-05d1cce9081d	ENTRADA	50000.0000	0.0000	50000.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.213
5d94160b-f9b9-4286-af94-3e6045ec7a6e	7933f07a-a446-4894-b0da-c791c262fd09	ENTRADA	20000.0000	0.0000	20000.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.22
205eb6de-b6ba-4092-8cff-1f8893aa1ad9	8587e682-2575-4153-9ad6-ebd98e42db27	ENTRADA	9404.0000	0.0000	9404.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.227
576b6a38-094c-42bd-878e-3a2f1516f66f	e5c39f4b-b2ee-4e21-ab5d-6b2ae5a3b0d5	ENTRADA	71310.0000	0.0000	71310.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.234
8cc43662-1831-401a-a1c4-bce279f99e16	e328b7f4-e06e-4c7e-9eb9-200a27bb979c	ENTRADA	4594.0000	0.0000	4594.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.242
480ad562-f283-477a-ad76-473fc931edde	6eb3dd35-3293-4619-99b2-e3d0e2dec277	ENTRADA	5829.0000	0.0000	5829.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.249
4a7ae680-16d1-4e8e-9aa1-7de42f807938	876f54db-7e02-40f9-917d-94ac8bd2d198	ENTRADA	20667.0000	0.0000	20667.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.257
ce1bd0a8-33a6-4f66-b36c-61a3b0fe41c6	9a703458-3a72-4274-81b2-061090483c85	ENTRADA	11280.0000	0.0000	11280.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.263
f7c65688-444a-4f98-b152-cdd9405910cb	3cd5338f-4077-4313-975c-26d1e5c24de0	ENTRADA	12156.0000	0.0000	12156.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.271
005e7551-558c-4250-8985-36b0cfad743e	2f50dca2-668f-4a53-975e-e95116d7442f	ENTRADA	11671.0000	0.0000	11671.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.278
02e58b99-2239-42b5-b729-cac72cebb195	1773217b-37f1-4d97-a9aa-874c4f539524	ENTRADA	6173.0000	0.0000	6173.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.286
51f4c5e3-8555-4a28-8132-74a0dfb97701	080edd87-fb19-49bb-9fe2-0dca420a276c	ENTRADA	14871.0000	0.0000	14871.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.293
77d863ab-4abf-4561-9c3c-b7f1938d3668	cddb24a5-0b89-4cca-b5dc-721c2b4c64d5	ENTRADA	16001.0000	0.0000	16001.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.299
e646dfcd-7f88-453a-9682-e720a9e09443	aa9c5892-6798-4a68-b4cc-3538f410ab2a	ENTRADA	12182.0000	0.0000	12182.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.307
0d9c4d74-d04a-4b7b-a681-98c01b443388	3d83ac6f-b1b9-46dd-8226-77863f5f21e7	ENTRADA	8991.0000	0.0000	8991.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.313
18d22045-6aa5-4436-98da-639535f5bff3	7fc5e7e8-2a80-41a4-b513-58adf03367a6	ENTRADA	11755.0000	0.0000	11755.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.32
8b56281b-ab38-4144-9a4e-df40ec34f6e8	80629f08-64ad-4e47-a07c-be8b90eb9928	ENTRADA	9736.0000	0.0000	9736.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.327
58d89611-caa0-437a-bac1-175f8d55db7e	e8f137a2-1f0c-4f32-892d-143497884a7a	ENTRADA	10945.0000	0.0000	10945.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.334
c5912cf6-2972-4588-b488-4f60a2bfdaff	dce8fe7c-faae-4471-b425-9ad83b9914e8	ENTRADA	9882.0000	0.0000	9882.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.341
b4b5cf30-4dc8-48f7-b352-5d82617d369d	6f9d6ca6-a017-478b-987b-51f6042b4769	ENTRADA	1754.0000	0.0000	1754.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.347
cc92f743-517b-467a-aaaf-866baeb503ae	1ec7fe49-d4bf-4ae5-9fc2-8920310d3d6f	ENTRADA	1000.0000	0.0000	1000.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.354
5fca8953-6230-4f33-849c-d86fc65693ed	8fa59c7e-efaa-440b-9bc9-ab8994980c98	ENTRADA	1000.0000	0.0000	1000.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.36
e60b241e-0b24-4cfb-ae88-7ed7b17cd552	5e8073ff-fb40-4c07-be68-aaefc8201395	ENTRADA	2928.0000	0.0000	2928.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.367
03f94cd1-1bb6-4198-a3d9-2e7ed386261e	7d898dec-8922-4f4f-9155-4e18489b1c18	ENTRADA	3147.0000	0.0000	3147.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.374
5addc516-b3e0-46f9-95af-09c00569a055	7270809e-5f98-48a2-aa46-a99bf4455bb3	ENTRADA	8210.0000	0.0000	8210.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.38
9fbd865e-5904-4b9e-97fc-0ab1c3eeccf6	39c61577-d486-4bbc-bd5a-ed740a1a5ac7	ENTRADA	1988.0000	0.0000	1988.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.387
584102d4-2e75-4788-b559-1dadcdf01248	f2d1ddc3-d6e7-49a9-9372-92b32f951d92	ENTRADA	278.0000	0.0000	278.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.393
34141dee-e882-4b91-9218-f2f12ec7e575	00854e61-4efa-4d19-8de8-134ae16968c3	ENTRADA	2250.0000	0.0000	2250.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.402
c0e902e4-85a6-499d-a500-831ea76e3381	8edf98e5-4416-41b9-8519-cadc684d3a16	ENTRADA	873.0000	0.0000	873.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.409
40b9a71e-8068-4a48-a4f1-bc1e1e757dd3	5a770f82-699b-4ed3-87d7-0e288e187154	ENTRADA	197637.0000	0.0000	197637.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.416
ed8c2671-8542-41b6-8cc1-f035b3a48695	d64c14fa-3514-42c2-a2c3-9089724e50e3	ENTRADA	498792.0000	0.0000	498792.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.423
1afc6feb-6ac4-439a-a589-9639b8d27cd0	916775bf-c680-47e7-a235-463725cb9bd5	ENTRADA	398.0000	0.0000	398.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.429
e931ff5b-8a96-49aa-a97a-08a425c2f3f3	b310f96a-8248-485f-91ab-73cb2eb76e1d	ENTRADA	12800.0000	0.0000	12800.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.435
0bff3f9f-65ea-481f-b645-a6bc2fc4cfa7	fc3eaf1c-3fc4-4d01-80a4-ec5b98e23143	ENTRADA	1489.0000	0.0000	1489.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.442
d5120697-f616-430b-b829-861698baafff	179d9904-a167-4142-a57c-1fc413a294c0	ENTRADA	245.0000	0.0000	245.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.447
50cbdfef-33b7-40b8-85c8-7bdfa830b2c6	e0f68e13-c50d-4a87-80f3-53424aad3a74	ENTRADA	11064.0000	0.0000	11064.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.454
b683aed1-356d-44bc-8fac-8a5da99d1136	a3e414f6-c9f9-4680-933d-3b9c33096a4c	ENTRADA	62850.0000	0.0000	62850.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.461
7adf1f44-6b27-41d7-b7e6-9bd3e40b9f13	f77f398d-46cd-4e85-92ec-438ac24328c4	ENTRADA	845.0000	0.0000	845.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.467
48e49464-d9fb-4e38-93e1-5b185f2b5ae5	7454fb85-f4a4-4987-8d95-053d98414a77	ENTRADA	25837.0000	0.0000	25837.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.475
ef03796b-1284-47e4-80c0-b4ae4ef7bcb7	12b82ba7-09a5-43b6-a754-56abcb77a4cc	ENTRADA	13913.0000	0.0000	13913.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.481
c629dd86-39e2-41e2-86dc-6715f9794c34	75b39f53-1ef6-4055-b004-1cbd437ec397	ENTRADA	7286.0000	0.0000	7286.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.489
f61fe12c-8499-45f9-9471-91eca9d1e9d6	aafc3a6a-2061-447d-9dfa-2c08e6f7d626	ENTRADA	9930.0000	0.0000	9930.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.495
88d28ff5-4113-403f-b350-adadb6dc9343	1f480a54-7767-45e5-811a-b2faccafb3df	ENTRADA	203.0000	0.0000	203.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.501
81e7ca61-f7d7-423f-8079-bf7a84d488d4	34b45784-a267-4a7d-844a-7684692459b8	ENTRADA	307.0000	0.0000	307.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.508
e55fda65-38e1-4434-8d78-cb7c7b3471e2	10508e94-26aa-4e04-bb53-9561b5304ec9	ENTRADA	295.0000	0.0000	295.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.514
2edf3116-1dde-49a2-8f55-adb1bd38146c	4819e2a6-392b-465e-86fc-d61c348afd4f	ENTRADA	313.0000	0.0000	313.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.521
580cc421-82d9-406b-9cfe-83d2ba93901b	2a80550b-0ded-4464-b6e3-ba13a3cc0bb3	ENTRADA	305.0000	0.0000	305.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.527
fee2daea-1346-4675-8b86-e1e03552a32d	d8c5d0d5-f737-41d1-8e60-22bbc308b083	ENTRADA	300.0000	0.0000	300.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.533
627fce2d-d732-4cf7-89bf-f4c3763e6693	768c4b1c-12ae-4015-941e-dec56662f92a	ENTRADA	313.0000	0.0000	313.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.54
314b3df6-6574-4e04-b5d5-4202d1b102a0	7b7629e0-8ff3-4dbd-bde3-30be46d9b6b5	ENTRADA	309.0000	0.0000	309.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.545
fa20ad0d-800e-44ce-aa5a-9c2991553cff	94be1b4e-4f4f-4d12-ba03-26c913d74839	ENTRADA	38850.0000	0.0000	38850.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.551
d618cb42-31ae-49a5-beca-1b3de102889e	97f87364-f00c-472b-a9dd-5ce36244afb4	ENTRADA	15800.0000	0.0000	15800.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.557
c455001f-30cb-448e-9ffa-330601b769c7	3195b8a3-32f9-4739-a0e9-fab3748f4c15	ENTRADA	46954.0000	0.0000	46954.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.563
a79516e5-efc1-45b5-b86c-3c2aaa216eff	312846a1-a2e2-41ec-9004-0c70dd074e4b	ENTRADA	15241.0000	0.0000	15241.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.57
c9e8b59f-990e-42a2-8cd8-8e3343cff8f2	37245474-cf09-4fc7-a24a-5dffa5ac1dc5	ENTRADA	1160.0000	0.0000	1160.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.576
88eada07-a769-4d52-9fe9-ffbdfd497911	30cf86b6-2954-426c-b4b7-8cb60d97af51	ENTRADA	10080.0000	0.0000	10080.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.582
9a789466-5693-4aaf-bcdc-b8544d0e8e24	13b13800-6679-4749-96e9-bc034236f7a9	ENTRADA	15000.0000	0.0000	15000.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.589
7761cee3-7ac1-4b65-b601-8ee5e673f29a	b0e49e23-1edc-4ec2-b265-189ebe472eac	ENTRADA	42930.0000	0.0000	42930.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.596
b4095642-ce16-4265-b407-4272207d7382	16dd3cae-f6e5-402f-b187-f841193216e1	ENTRADA	8452.0000	0.0000	8452.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.602
45c5cf95-75f8-4337-b880-0524aa88ac65	38e6de16-a266-4f3f-9a75-b9c059a0531a	ENTRADA	10966.0000	0.0000	10966.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.609
7db53e49-4491-44af-8bfd-817a1ffa595d	a27907cc-b24a-4206-9c65-d413aa4b5563	ENTRADA	70.0000	0.0000	70.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.614
20991a1f-7907-4907-8a65-52b0d209e859	06e10795-05e4-4665-8edb-211bce140aaf	ENTRADA	864.0000	0.0000	864.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.621
c927c9c0-7271-4bc3-8ed2-78282583728b	d84cba5d-96a8-432f-a27c-650a3da49cd1	ENTRADA	18654.0000	0.0000	18654.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.627
89f9b418-56eb-45e5-8f69-5077fe893b8d	644113e7-6761-492f-a55e-a359c795c5f8	ENTRADA	120.0000	0.0000	120.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.633
34f5f20a-048a-4883-8e76-1831dd8f31cb	27ddf750-d66d-4836-8d58-f080b8d9daf7	ENTRADA	102.0000	0.0000	102.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.639
8a8691dd-cdc5-4c16-96db-9c32fe7747ee	36893586-cabc-431f-9065-6c781546257e	ENTRADA	3325.0000	0.0000	3325.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.645
32f4d432-ea35-4e08-abbc-ee9e4103e2af	0330295c-4387-4bf3-9a68-0a5551077dab	ENTRADA	40000.0000	0.0000	40000.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.653
99d14867-f218-4d26-b489-f488e291a9f6	6e4a171c-6eb7-4f4d-b3af-b2d380335061	ENTRADA	6000.0000	0.0000	6000.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.663
d5c7f11d-79c9-4e87-9e84-1e48fd90c275	a54b052c-6b6e-4210-b286-f9666dbf6e20	ENTRADA	2882.0000	0.0000	2882.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.672
ec195920-2222-43d3-bceb-06c411e3fd78	0f97527f-a304-4d88-b05d-69992d0c3d10	ENTRADA	18906.0000	0.0000	18906.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.678
4dc7023f-1613-4e14-873b-69c34048d93c	95f3ea2b-c424-42fa-aa6c-6c4deb76e4f6	ENTRADA	9216.0000	0.0000	9216.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.686
57fb21ed-298d-4456-a92a-fc8a294e9a8f	d8e03fdc-63d8-4b9f-b5b1-0a18bf5eeca2	ENTRADA	73092.0000	0.0000	73092.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.695
8faf5310-7f78-4593-a782-7a1c475845ef	b41e4ce5-2ab8-4ded-a0e9-1b821c16e315	ENTRADA	3943.0000	0.0000	3943.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.708
3a76ab3f-acca-4a02-9178-cbb49d11eea3	2169a3b1-b8fd-4052-a61b-25d7d0ae8820	ENTRADA	51790.0000	0.0000	51790.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.716
db4024ac-47b8-4aa6-b1a1-868f57126404	f89c2bc3-1e48-4a60-b326-270864dad5ca	ENTRADA	1600.0000	0.0000	1600.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.723
85004cf8-8cd2-4c09-9a17-811c26061902	d600024d-7db6-498e-954d-038871958395	ENTRADA	1000.0000	0.0000	1000.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.729
c99efe23-da76-456d-9d8c-732fcf6efda2	3b682c2c-c7a5-426b-b223-32e792196c98	ENTRADA	4301.0000	0.0000	4301.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.736
38bbf6ac-a590-4fd0-8c03-e2fd2ac3aabe	afff08d5-96ed-441c-b6d0-d3e8b162edcb	ENTRADA	4984.0000	0.0000	4984.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.743
8a96366e-16c9-40ee-bf6f-a646eddb64d4	79df9088-e4d9-4704-89ec-29a3607867e0	ENTRADA	24130.0000	0.0000	24130.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.749
c9b5b480-b021-42c5-b7cc-69c6809c8505	b2528fff-6c79-459f-b9df-555b1690a008	ENTRADA	486.0000	0.0000	486.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.757
a3594300-2162-4ded-8b05-3ed098733cc4	73cbd1de-ffb9-4024-90e3-b1709c8dbbfb	ENTRADA	514.0000	0.0000	514.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.763
f84eb9e8-6cd3-4868-914f-4510f7337fd6	be820686-1b6b-47e3-9780-7308bdf7a88b	ENTRADA	1031.0000	0.0000	1031.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.77
afba2a78-5e6c-451e-8967-4c8def7c5666	6f4a88eb-353d-4c06-8725-7fe107f32668	ENTRADA	85000.0000	0.0000	85000.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.776
579a9a18-0cf0-4847-bb40-64ec42e0b626	84c02891-72ff-44f5-8767-75e1b79ec02e	ENTRADA	1086.0000	0.0000	1086.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.783
38c2f1b6-6ada-45e9-8728-af727b45fbe8	d197d1dd-8efb-4724-9acf-fcb315a27269	ENTRADA	4015.0000	0.0000	4015.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.791
d8805feb-2847-4c79-ba54-bc54a0ea8d01	6a713e5b-57ac-4846-a1e7-97c59fd2a770	ENTRADA	9500.0000	0.0000	9500.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.797
2989e16f-8bac-4ce6-9342-d85eccb1b155	eb1bf31e-ba99-443b-aa07-7410e56da07f	ENTRADA	2218.0000	0.0000	2218.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.804
232e43b3-9ce5-4739-af26-fa5ffcfdd753	5e2bd04b-d8b5-4cf2-a30b-b7bc690f5b38	ENTRADA	1490.7900	0.0000	1490.7900	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.812
5583c219-5d24-4e7a-8891-f870c3d3f594	ab9438b3-e9d8-4b33-a5c8-da547e7b5024	ENTRADA	100000.0000	0.0000	100000.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.818
dae3b7d7-fa77-451f-ad06-863675aad03d	05f1df06-27d0-41ce-9dc4-12f2c6085189	ENTRADA	82500.0000	0.0000	82500.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.824
6da56d48-3842-4d5f-b274-9017d6fea0cb	e7acfca1-c924-4983-acda-231ef8c696ac	ENTRADA	6617.0000	0.0000	6617.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.83
35fd56e2-77ce-4cf3-a898-72bab30c94c1	ebfcccbb-22c9-468d-8ee7-f7cdb8cacdb8	ENTRADA	2378.0000	0.0000	2378.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.838
ff4fa48f-03b5-449a-b7c9-8540593376a5	e1b7e246-0945-495a-b9d3-063f8a53c2b3	ENTRADA	1000.0000	0.0000	1000.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.845
e722e5c5-948b-425d-b0f9-1dba0812d3ba	cc105e5c-84f1-4fa5-ae8f-835919d15bb3	ENTRADA	1586.0000	0.0000	1586.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.851
bcd4b9c6-9442-4da7-867b-4b4339a160c1	8d49df61-358f-42f1-aabe-92f4c1c581b9	ENTRADA	383.0000	0.0000	383.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.859
a07f1d26-e3f8-42a8-ab7f-39e291f0826b	a2474d06-41eb-4600-9bea-58584dc232a2	ENTRADA	317.0000	0.0000	317.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.865
5bf58142-4ae4-4e7c-b73a-76f5e57a37ab	022d1935-2cc8-45c4-aaa5-0ae26c5ef29c	ENTRADA	634.0000	0.0000	634.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.874
982d5445-19bc-4de2-9311-c7d8306d1e2b	4aed5e8d-c640-460a-908f-7bd004755df1	ENTRADA	1627.0000	0.0000	1627.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.88
94a70246-f696-4f76-8a73-3ac93dd837e2	17b7f942-74a0-4316-b1a0-5030b290c838	ENTRADA	1076.0000	0.0000	1076.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.886
9b4ed287-fdc7-416a-94d5-9a584b38d27f	677f2936-c853-44cc-94b9-9d9c41501003	ENTRADA	9.0000	0.0000	9.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.892
c60846e2-e516-479a-88da-2f8ed34316cb	1461e478-d0c1-417a-8530-d370c40ec373	ENTRADA	200.0000	0.0000	200.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.899
2a3300be-c122-46cd-971e-822f976b3432	f2d83c73-bd6c-4ceb-abf8-daac3c660322	ENTRADA	57.0000	0.0000	57.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.905
6c26e961-c299-44e4-a35c-c5bb83bfa43a	a5c77376-9bf0-4ddc-8f85-b8fafbba89b0	ENTRADA	184.0000	0.0000	184.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.911
d0953f3c-2d81-4ebe-8cbe-96300b194e78	ac8b254d-0844-47d1-93a8-78ba9a4376bb	ENTRADA	188.0000	0.0000	188.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.917
109feb51-96e1-4633-983e-4db256bf4aa7	862da131-0f95-465a-9678-24aaec9b80a2	ENTRADA	100.0000	0.0000	100.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.924
a799d403-a0a2-478b-a6de-f5ab819f55c3	3855df57-5f0c-45c0-963c-20d418832ae4	ENTRADA	179.0000	0.0000	179.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.93
ecc91af6-3632-4320-b7bb-4ece37ef4e63	80779948-8d3f-4c44-8056-ab959f25c41b	ENTRADA	4219.0000	0.0000	4219.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.938
73f91e1b-7fba-4025-beda-4004c952c8cd	1af114af-0ec8-4144-a73e-6f186c2ae070	ENTRADA	4720.0000	0.0000	4720.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.943
3905d9c8-62f1-4ef5-aada-bc03164c798f	c5ec0b04-03f9-4eeb-8d9d-5942dc9222aa	ENTRADA	2307.0000	0.0000	2307.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.949
1a75b4df-1dda-4d86-95bf-e93667562b10	4e04bec0-74c2-4fb3-9914-da6b05ef19f3	ENTRADA	100.0000	0.0000	100.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.956
03dce74c-3344-4e11-8208-daa4536fceab	c05cbc7c-d557-44a4-98fb-a653891d4e6c	ENTRADA	226.0000	0.0000	226.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.961
2b923964-6f72-46fa-abe4-9a4c8b494168	a78bca6c-15d7-437c-9f3d-e98ce83772b1	ENTRADA	69.0000	0.0000	69.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.967
865c2ada-5bc8-425b-9493-b0a9a873aba4	df48fb6b-3feb-4060-b60c-05af9023b39e	ENTRADA	3553.0000	0.0000	3553.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.974
7e44551d-117e-4c6c-80ec-8660e1cf8d5b	30399dfc-06c5-4f73-91b5-d2a0ee2cae65	ENTRADA	100.0000	0.0000	100.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.98
bff1277e-b187-4986-b2ee-deed0f4a5ca3	0c6e6070-ca76-46a6-a243-7d98f13b4c2d	ENTRADA	513.0000	0.0000	513.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.987
00640796-5610-41db-9a31-1a207af4f02f	1df4ebe7-aef6-46f0-afb8-a8e1502a23f7	ENTRADA	60.0000	0.0000	60.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.993
b3de2ce3-27d3-49e9-a8e6-1654b6923e42	1c19f93c-a2f4-44f2-aa68-7df7dc83162b	ENTRADA	44.0000	0.0000	44.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:52.999
3b699fb7-536f-4831-bea4-7a4282c2f446	d9d56bfa-4ca2-4e92-8eb1-cfc4ea257a18	ENTRADA	94.0000	0.0000	94.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:53.007
d79f532a-2aee-4d68-bee3-d9350ea1bd98	06bcffa4-cacf-4755-9359-53e76c496134	ENTRADA	660.0000	0.0000	660.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:53.012
7ffb533d-3299-4cf9-acd7-49d0748e33d6	6690bb3d-9867-43e2-bcaf-acd671010b32	ENTRADA	981.0000	0.0000	981.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:53.018
83919283-7aa0-47bd-b6b7-24ace2f15a37	c7b11aba-bc3c-4e39-991a-5a1786124a1b	ENTRADA	47.0000	0.0000	47.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:53.026
45e9499c-be96-40bb-8fe0-28d42938b9de	740297b9-e83b-4a9f-845f-a43c12897d1b	ENTRADA	2.0000	0.0000	2.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:53.032
51e3d073-35e1-4484-8cb5-6543530c1d3a	a0eeb7ad-1709-41e4-8cb3-5898b0942f5f	ENTRADA	3966.0000	0.0000	3966.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:53.041
029afba0-1ccd-4e6b-8e53-fa470f724108	8b619bab-5037-4f82-a819-babf97d95221	ENTRADA	400.0000	0.0000	400.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:53.047
45aea088-f751-46e9-9177-80fe817c0223	b4c6bee5-e068-47af-a2e6-67b8b628262a	ENTRADA	99.0000	0.0000	99.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:53.055
fc4ae311-5a76-4cba-90cf-459eb96d4ab7	7466e50e-87d8-410e-b3a5-9a8ac67e1127	ENTRADA	4462.0000	0.0000	4462.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:53.061
0bf728f6-99e7-4a57-b8a9-2f0f0a512660	174be3f7-1fc7-4b44-80d5-3509ea79f55b	ENTRADA	2394.0000	0.0000	2394.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:53.068
6aea6f36-996d-46c9-878a-b46e5b01cd27	1ce96d00-2c76-4854-b443-c05f50a2d4c9	ENTRADA	98.0000	0.0000	98.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:53.075
13c57348-26d2-4bed-9130-f6833d9b4656	87050f88-7f5e-4529-b41e-838730eac13e	ENTRADA	46.0000	0.0000	46.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:53.081
ab064fb7-8cf1-4295-92e6-1d385170932f	47226bca-7152-44d1-b7f7-bde21b4155c8	ENTRADA	5734.0000	0.0000	5734.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:53.088
590e1044-5964-46bf-afdc-e438ed0091c2	eed12f68-7231-47bd-95eb-4477f41662a5	ENTRADA	100.0000	0.0000	100.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:53.094
ed52dd16-57ad-4b00-a49f-fe3079c90797	1f06b1b4-1ebc-49c2-acfa-21e5fb744e98	ENTRADA	66.0000	0.0000	66.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:53.1
905c835b-7fea-4abd-9bc1-c58823cc143f	6475b81b-64cf-4f77-a105-93f56c7ed7dc	ENTRADA	100.0000	0.0000	100.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:53.108
43b61489-026e-4c8d-8f61-268bae1e1a31	af9c6776-36ae-46e8-9851-3e53387f8e55	ENTRADA	62.0000	0.0000	62.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:53.115
a8643353-0ce9-430e-9688-fb2370d20f4b	2e58baf8-4611-48a1-8bf1-a1f0f7df2084	ENTRADA	100.0000	0.0000	100.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:53.122
627f0c1f-4f11-4ece-86b4-514d418510fb	33cad24e-4c26-4d9a-9a22-f74a59b3973c	ENTRADA	929.0000	0.0000	929.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:53.129
86022829-19da-4a48-a72b-b2ec8e10ad1a	19e614d8-e94a-4ea0-b09e-ea292f9f0eba	ENTRADA	4627.0000	0.0000	4627.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:53.135
689922cf-1e2c-4efe-976a-1366ba55ccb9	acbcaa8c-c0a1-4eea-b5ea-67dc6e4c7243	ENTRADA	12.0000	0.0000	12.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:53.142
01e30790-efd1-4642-bfd0-db1ae111065d	b50f30cb-0282-4d8f-b4ee-386df54c8450	ENTRADA	4404.0000	0.0000	4404.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:53.149
2e2aaf77-1d9d-4dfc-bced-af35a1e4de14	893d33f0-64ce-40bc-856f-362820ed3c45	ENTRADA	1620.0000	0.0000	1620.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:53.158
8087cbb5-a2c3-48c3-886b-05eb665f939c	1136e1fe-b6b4-441e-9917-ba7e2f975961	ENTRADA	5165.0000	0.0000	5165.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:53.166
c5de8ba8-c668-42c8-89b4-7bb57f394701	04a662cf-cb8d-487a-a02b-a4094cd9f9f7	ENTRADA	1143.0000	0.0000	1143.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:53.174
18513098-89d3-497d-957f-3ff03994a1f5	70b59b91-2a38-4cb5-956f-93204a095553	ENTRADA	635.0000	0.0000	635.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:53.181
90981c67-8767-432e-b234-f6e64ce181a2	d6c440a9-e644-4121-b3bf-f6154b506505	ENTRADA	3982.0000	0.0000	3982.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:53.189
0ff01df6-e322-44db-b4bf-3b8cecc076f3	c0079a30-fe2c-45da-b1b8-4ea247b36aa6	ENTRADA	965.0000	0.0000	965.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:53.195
f437ff67-008f-4221-8b87-fb962d6179f7	7333a9b8-aab6-41df-8f3b-67c5c5c5fe6a	ENTRADA	374.0000	0.0000	374.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:53.201
359d5538-8726-4c8d-a267-bc7ae11f5c7b	1e7843c8-03cc-4282-b52a-38b9b4ea809b	ENTRADA	37.0000	0.0000	37.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:53.208
0681675c-2e02-4f32-bc83-d8b32f0ad956	7daf0270-a064-4bea-9618-c3df739cc6d0	ENTRADA	42.0000	0.0000	42.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:53.214
49fcc435-312b-488c-86bb-9259afe1486c	541a4b55-f363-44a4-b5a6-0af56e20b172	ENTRADA	11948.0000	0.0000	11948.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:53.221
aa34a931-cc12-4483-8561-fd2e66ce88dd	6f04f29b-8890-4f4b-99da-341046be7a9d	ENTRADA	826.0000	0.0000	826.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:53.228
aaad4a66-5dd6-401d-8dbb-2c2d06d7d2eb	86421574-214d-4938-a8d4-757eecc12ed0	ENTRADA	433.0000	0.0000	433.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:53.236
6f13ce72-bec1-4a20-b236-3efd3142ce3a	1c1dc238-52a3-41c7-b3d6-1c62a0a3a7bb	ENTRADA	250.0000	0.0000	250.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:53.242
9e49b3c7-37ca-4e6e-9526-4ff987f6efaa	9f33a048-f795-4755-b8d4-17048ff8ed49	ENTRADA	849.0000	0.0000	849.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:53.248
4a141a5c-2177-4321-a7ff-70b6172dfbe3	92cd8662-a9e4-4aa0-82d6-e09c15d55b5f	ENTRADA	1001.0000	0.0000	1001.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:53.254
6cafb5c1-4ce5-428d-893e-9687786d400f	714844bc-a296-49c3-8305-1eb86f15e325	ENTRADA	228.0000	0.0000	228.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:53.261
7028678e-06f7-4198-aec3-fc5ee84942f4	c2ffefaf-b4c6-4846-94f3-3ecc4f91c466	ENTRADA	606.0000	0.0000	606.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:53.267
8811053c-f4ca-4739-b47a-f6c74ebe3536	f002c8c0-96ae-45f9-8ca7-51383d0911d3	ENTRADA	3169.0000	0.0000	3169.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:53.274
17795132-30af-437a-8019-0b0f199c01f9	6b741b7a-554a-4624-966a-1e311d24e2b5	ENTRADA	1944.0000	0.0000	1944.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:53.28
5f6bd2d9-5be1-480a-83ba-8a64b9bfedbe	9798ab89-377f-43c9-8fd4-8df072e63538	ENTRADA	100.0000	0.0000	100.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:53.286
1993ad27-f45c-49f9-9392-34ed3d4b6e6e	2ba29423-debf-4d28-ba08-1f42cbb64ace	ENTRADA	2637.0000	0.0000	2637.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:53.292
ab3a1482-9daa-4fd7-adf4-1c69798cd42b	dcf4a45a-b000-4a2d-9075-297ef4eb5b92	ENTRADA	100.0000	0.0000	100.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:53.297
2a64887e-4d3a-4a4e-bd05-c9413377c66e	142683ed-234a-4d69-b4cb-2893937d1526	ENTRADA	36.0000	0.0000	36.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:53.304
ef3a3aad-5c35-441d-aeac-fe79c8bde974	e7695b50-f7b0-42ce-9e24-2e0aacae691a	ENTRADA	14.0000	0.0000	14.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:53.311
f8eb49e6-b0b1-4973-b5fd-92d84f39247b	5089e9dc-9571-4224-96fb-9afb3e195435	ENTRADA	812.0000	0.0000	812.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:53.317
9db4f05b-4cbf-483d-b2a7-4bb58f15a6f3	94c02ea6-ae0e-4013-aaca-a846e02c8659	ENTRADA	100.0000	0.0000	100.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:53.324
93753901-3fc7-41ea-9215-524eb50166ea	2d58274d-5a9a-4017-badb-a1de1ae19bb2	ENTRADA	103.0000	0.0000	103.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:53.33
990d3e0c-8369-4688-b00a-6db531a60094	b7239408-5861-4542-8198-6e8ed987d8b4	ENTRADA	209.0000	0.0000	209.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:53.338
b2ae9502-bc28-475a-b1dc-a0bb1f0908a6	a8cbd4f1-8916-4168-be71-8060c5f8cff0	ENTRADA	495.0000	0.0000	495.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:53.344
81aa73fb-a097-41f2-b214-081ceab47b45	e96366b8-a247-42d0-b618-48da51f435de	ENTRADA	258.0000	0.0000	258.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:53.352
694c7b54-9b9f-4aa0-9c8f-21d60176f2ec	610d3456-c42f-406f-85b8-07d7d6dded34	ENTRADA	108.0000	0.0000	108.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:53.36
63f08125-a532-44d3-8f24-54fdf51ee9ac	6b259095-9792-4b58-b829-2604e670c4a7	ENTRADA	115.0000	0.0000	115.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:53.366
4614afc0-42f2-4fe6-a750-8b6867f29e19	1c82b66a-6f3b-4110-a2c9-fff7f2ff28ea	ENTRADA	112.0000	0.0000	112.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:53.374
c3656b53-7123-438c-bd39-7074aebe7908	1e050492-ba1c-4e23-9c66-7f8b9cd699b6	ENTRADA	91.0000	0.0000	91.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:53.381
f2501e70-3af9-4084-bd6e-91e1eb286234	0caaf7c3-2644-4140-a2a7-1a83cc89f788	ENTRADA	238.0000	0.0000	238.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:53.389
9214a504-83f7-4805-81d6-b14369740b4d	80531160-5ad1-43ae-a539-51e729553bb6	ENTRADA	129.0000	0.0000	129.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:53.397
6f7794f5-9c33-44bd-abcb-6c9777a22173	2b190c4b-a7d1-4559-878f-8078d818b709	ENTRADA	88.0000	0.0000	88.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:53.406
d40c8815-0792-4ee8-842c-579d083d1e8b	648259d4-9890-4835-9b82-4505863f0a70	ENTRADA	244.0000	0.0000	244.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:53.416
a30e4820-9c63-4360-8ea3-6db24166f670	4f9ee6a7-4c2a-4df0-a62e-bdfcc513081c	ENTRADA	96.0000	0.0000	96.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:53.426
698cb441-0f2b-4791-81f6-e865914900c0	dcc50b47-aa99-442f-afc9-72d778d78548	ENTRADA	114.0000	0.0000	114.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:53.438
d3540df2-e6e0-468b-a209-26bc8a505260	45a743d6-01d5-4749-b7dc-f96e51142b19	ENTRADA	936.0000	0.0000	936.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:53.449
655b2dd9-c0c0-4826-b55a-a9eabc81ff60	8415b543-797e-4acb-bac8-71bfba84253f	ENTRADA	109.0000	0.0000	109.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:53.462
e56831d5-390c-4e2d-9b55-9ec4732fb17b	1067e017-380d-4bac-9cbc-56f83b854e41	ENTRADA	940.0000	0.0000	940.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:53.473
f2318666-69be-4900-ada0-9b4b00b64ee8	6fa5c3a9-acd3-4318-a1c6-a67ef1b5b3a7	ENTRADA	1572.0000	0.0000	1572.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:53.48
fd0ebef3-6f0e-4818-9def-56f614ff6a5e	e1af31c7-8b9c-48ba-9ce0-b568be2651cb	ENTRADA	5225.0000	0.0000	5225.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:53.49
982a5a0b-cb18-4ced-8614-1c5eeddda71f	6efdfe36-2522-46b8-a935-a966cf863c23	ENTRADA	250.0000	0.0000	250.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:53.497
a2e08b89-db37-48da-be91-e3f002bfe9c9	223f13bb-0c56-4a16-b586-d56f942b9d35	ENTRADA	115.0000	0.0000	115.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:53.504
54d0c50b-d896-4f5f-96de-ba9115bd0320	92113ec3-30a8-40e7-9447-270fb5551954	ENTRADA	202.0000	0.0000	202.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:53.511
8360c2aa-f445-4cba-8843-93fc3dea86e3	86a9857f-fb77-4d74-bf42-a9f35bd4a590	ENTRADA	146.0000	0.0000	146.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:53.517
608e4c2f-f42c-424e-8866-3a9a68bfe62a	a042e5d4-c843-43dc-905d-9088009aebe1	ENTRADA	245.0000	0.0000	245.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:53.525
508d4418-833a-4430-b121-2083803b63dc	2a2102ec-cc83-42de-bd0f-069467259d33	ENTRADA	572.0000	0.0000	572.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:53.531
591314b3-9231-43ec-8a1a-f04b0b54404d	31ca8952-a581-465a-b0ae-498d8d7f9273	ENTRADA	476.0000	0.0000	476.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:53.539
c8189bd0-59cd-47c9-a924-df6763cfe241	b09e3481-4e24-4a78-ba02-0b6a9da6386c	ENTRADA	238.0000	0.0000	238.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:53.545
721a96b4-9b9f-4670-a343-2f4118ab118f	34f9e0a3-8b23-4ce5-9589-4cdaa86c0371	ENTRADA	134.0000	0.0000	134.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:53.551
7c9b94fa-ea96-4e4d-a4df-1f85c7c02a63	29b7d881-8e1d-497f-ac28-ab78cbd19402	ENTRADA	1004.0000	0.0000	1004.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:53.558
e2205e0c-96cf-4a3b-9e64-718ad3660f31	f0d037dc-e1bf-4ca0-a093-7fdf254d457b	ENTRADA	135.0000	0.0000	135.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:53.564
eadf9db3-919d-4e66-8eb0-60ffc33b7729	5338a08c-82a3-4bea-a78f-b517e0369954	ENTRADA	1211.0000	0.0000	1211.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:53.573
3d19ae1d-03b3-4412-bc04-dbbbbab4c43c	97f9bed7-7d4d-4080-997f-176d5e488b52	ENTRADA	132.0000	0.0000	132.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:53.58
b52cb77e-9873-4ea8-a3d8-14e4c468b7a0	3b44b715-f1e3-4eb2-9ab9-e35cdcfb0b53	ENTRADA	102.0000	0.0000	102.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:53.587
e82d1087-bf03-4484-afc9-f2a2c4090733	71a9caa6-2047-40dc-a1a8-d6905ad72d0b	ENTRADA	43.0000	0.0000	43.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:53.594
3835a7fd-05b3-498c-8cc6-91ee7e7b9e2c	6a3c567f-7bd3-411d-8aaf-f750a46b11c2	ENTRADA	361.0000	0.0000	361.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:53.6
a0e181fb-6adf-44f8-b72c-b0a5da3c7008	b9c1ea64-810e-4dcd-a590-e494005b01dc	ENTRADA	5000.0000	0.0000	5000.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:53.607
3fff1d5a-f219-43ce-8b9d-a52366ff7a43	e83bff71-bddb-43a6-9c99-28021f004e94	ENTRADA	5964.0000	0.0000	5964.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:53.612
35c412be-bccf-4571-b185-a25b4d094e35	88dd160b-f23a-4228-85f5-97c7e6e0b05d	ENTRADA	11278.0000	0.0000	11278.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:53.619
155a8df3-8761-4d20-a0bb-5f807849fa04	c9dbac8e-9510-4e60-a9c6-7ec9a6849ac5	ENTRADA	240.0000	0.0000	240.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:53.627
96f901b2-a405-4d27-b160-c30d1d4c5c74	8d1168b6-9bbf-48e5-aecd-d797475f55cd	ENTRADA	482.0000	0.0000	482.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:53.632
ecb0b372-b045-4bf3-9d67-eff58fe1aed8	48cf50a8-34a2-457a-a8c0-ce76d47c2c84	ENTRADA	254.0000	0.0000	254.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:53.64
a62c8807-95da-42ce-a8cc-6ba4d1958be2	59fc14b9-088d-4fc9-964a-241878f527bf	ENTRADA	146.0000	0.0000	146.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:53.646
2d25dec7-feca-4eaa-b723-d76b3a9f402c	0ed6a508-1186-4522-9fe5-d25f0d4f52ed	ENTRADA	232.0000	0.0000	232.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:53.654
f67090d1-185c-470d-9332-92b56db70b81	4cf766e4-3483-45e8-acfa-09a36d81ee9f	ENTRADA	249.0000	0.0000	249.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:53.661
af3e7a99-aebe-4177-a808-c290af1bc5f6	0d064da8-a5cc-4369-a68e-133f294f41de	ENTRADA	183.0000	0.0000	183.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:53.668
4f6b6914-864e-459b-973e-11db9b51bcb1	5aabe2ff-b334-4b47-9a0d-12fa87511f70	ENTRADA	249.0000	0.0000	249.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 19:25:53.676
8e269d5e-25e6-4de5-a10f-c3b079fd87f0	22abc39c-3137-4112-949a-3e993f7976c8	ENTRADA	141.0000	0.0000	141.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 20:26:19.55
02323f7c-26f3-4e8b-b0dc-4d57126d13f5	6925c9ab-da76-4077-864c-7a35dd36e1ab	ENTRADA	159.0000	0.0000	159.0000	APERTURA 02/09/2026	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-07 20:26:19.563
823654df-efe5-4436-81bf-707600cf38c8	eb30f874-6891-40aa-9a99-8090f0dddf5b	ENTRADA	10.0000	2935.0000	2945.0000	REPOSICION STOCK - ADMINISTRACION	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	2026-09-09 15:27:13.682
\.


--
-- Data for Name: kardex_movimientos; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.kardex_movimientos (id, categoria_kardex, producto_nombre, familia, categoria_nombre, proveedor_cliente, unidad_medida, fecha, tipo_doc, serie, numero, otp, tipo_operacion, cantidad_entrada, cantidad_salida, saldo_final, costo_unitario, monto_entrada_pen, monto_salida_pen, monto_saldo_pen, insumo_id, usuario_id, sede_id, created_at) FROM stdin;
3c8fd93c-5096-4855-9af2-0f7e0ae23f8a	MATERIA_PRIMA	ACEITE DE ALMENDRAS	ACEITES Y ESENCIAS	ACEITES Y ESENCIAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:51.687	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	6530	0	6530	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:51.688
5b9c5f98-4c68-4b2f-8d2c-8589d10aabfe	MATERIA_PRIMA	ACEITE DE CALENDULA	ACEITES Y ESENCIAS	ACEITES Y ESENCIAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:51.703	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	7081	0	7081	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:51.704
d5f05e04-c81c-4b72-b517-54edeab2cd20	MATERIA_PRIMA	ACEITE DE JOJOBA	ACEITES Y ESENCIAS	ACEITES Y ESENCIAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:51.71	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	6123	0	6123	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:51.711
89117b91-eea5-4037-afad-b765b1a345ab	MATERIA_PRIMA	ACEITE DE NEEM	ACEITES Y ESENCIAS	ACEITES Y ESENCIAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:51.72	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	1924	0	1924	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:51.721
8ff7eda4-24e2-4ffd-a8d8-3a166d5023ae	MATERIA_PRIMA	ACEITE DE RICINO	ACEITES Y ESENCIAS	ACEITES Y ESENCIAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:51.727	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	60694	0	60694	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:51.728
a0149857-3293-4cfe-b532-2aba90387f92	MATERIA_PRIMA	ACEITE DE ROMERO	ACEITES Y ESENCIAS	ACEITES Y ESENCIAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:51.734	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	9935	0	9935	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:51.735
ba4f05ed-11e3-4a54-95d8-0115bcbd1c68	MATERIA_PRIMA	ACEITE ESENCIAL DE CITRONELA	ACEITES Y ESENCIAS	ACEITES Y ESENCIAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:51.742	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	105	0	105	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:51.743
f3e5da0d-8f62-46c7-982e-b135255b550d	MATERIA_PRIMA	ACEITE ESENCIAL EUCALIPTO	ACEITES Y ESENCIAS	ACEITES Y ESENCIAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:51.748	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	1133	0	1133	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:51.749
abfe64e4-6d22-4250-bf71-97a76e24a2d0	MATERIA_PRIMA	ACEITE ESENCIAL LAVANDA	ACEITES Y ESENCIAS	ACEITES Y ESENCIAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:51.756	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	9706	0	9706	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:51.756
a49eee4d-00e0-4a3b-b9c2-2a0097bec4c8	MATERIA_PRIMA	ACEITE ESENCIAL MENTA	ACEITES Y ESENCIAS	ACEITES Y ESENCIAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:51.762	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	1452	0	1452	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:51.762
749001dc-2f7c-4d70-9ba4-1ecaa69e3cb9	MATERIA_PRIMA	ACEITE ESENCIAL TEA TREE	ACEITES Y ESENCIAS	ACEITES Y ESENCIAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:51.768	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	21519	0	21519	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:51.769
2abb3b05-98a7-4df7-8d66-e22a68614706	MATERIA_PRIMA	ACEITE ROSA MOSQUETA	ACEITES Y ESENCIAS	ACEITES Y ESENCIAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:51.774	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	4258	0	4258	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:51.775
d7eda1e8-9e19-4767-95b6-1640f1da3e7f	MATERIA_PRIMA	ACIDO ACETICO	ACTIVOS Y ACIDOS	ACTIVOS Y ACIDOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:51.78	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	12686	0	12686	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:51.781
9d428520-d2e4-48ae-bf24-480b617215fd	MATERIA_PRIMA	ACIDO ASCORBICO	ACTIVOS Y ACIDOS	ACTIVOS Y ACIDOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:51.788	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	7350	0	7350	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:51.789
6e91c5d9-8507-4cc0-b711-689c11458bed	MATERIA_PRIMA	ACIDO BENZOICO	ACTIVOS Y ACIDOS	ACTIVOS Y ACIDOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:51.794	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	727	0	727	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:51.795
df462988-0dd2-4f85-b909-34a6a32104cc	MATERIA_PRIMA	ACIDO BORICO	ACTIVOS Y ACIDOS	ACTIVOS Y ACIDOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:51.801	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	6440	0	6440	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:51.802
bf93a3c3-6d15-4300-a352-36fe1665e29f	MATERIA_PRIMA	ACIDO CITRICO	ACTIVOS Y ACIDOS	ACTIVOS Y ACIDOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:51.808	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	17161	0	17161	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:51.809
bcbd21c3-3456-4340-87fa-b6de2c041a48	MATERIA_PRIMA	ACIDO ESTEARICO	ACTIVOS Y ACIDOS	ACTIVOS Y ACIDOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:51.814	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	75255	0	75255	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:51.815
6c557101-8559-4acf-a249-0615931e266d	MATERIA_PRIMA	ACIDO FOSFORICO	ACTIVOS Y ACIDOS	ACTIVOS Y ACIDOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:51.821	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	446	0	446	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:51.822
3c72b53e-9911-4f36-91f5-59542e4b4428	MATERIA_PRIMA	ACIDO HIALURONICO	ACTIVOS Y ACIDOS	ACTIVOS Y ACIDOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:51.828	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	3642	0	3642	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:51.828
7cd972c6-be50-46eb-945f-f9c71efbdac2	MATERIA_PRIMA	ACIDO KOJICO	ACTIVOS Y ACIDOS	ACTIVOS Y ACIDOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:51.834	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	7266	0	7266	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:51.835
9099ac36-8b89-4999-9bcd-7740f89dbed6	MATERIA_PRIMA	ACIDO LACTICO	ACTIVOS Y ACIDOS	ACTIVOS Y ACIDOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:51.842	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	10835	0	10835	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:51.842
65504952-4b22-4553-8332-1189495bc5f6	MATERIA_PRIMA	ACIDO MANDELICO	ACTIVOS Y ACIDOS	ACTIVOS Y ACIDOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:51.848	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	1872	0	1872	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:51.849
d16c5dd2-cb44-4ffd-ada9-d2e495fd7059	MATERIA_PRIMA	ACIDO OLEICO	ACTIVOS Y ACIDOS	ACTIVOS Y ACIDOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:51.856	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	820	0	820	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:51.857
1037fc01-060f-4a40-8bd4-afa7160ab230	MATERIA_PRIMA	ACIDO SALICILICO	ACTIVOS Y ACIDOS	ACTIVOS Y ACIDOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:51.863	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	47776	0	47776	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:51.864
fd784403-584a-42a0-b6f2-61df3bed5677	MATERIA_PRIMA	ACIDO SULFONICO	ACTIVOS Y ACIDOS	ACTIVOS Y ACIDOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:51.871	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	12028	0	12028	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:51.872
ecd59e20-dc46-49a4-8351-c1d0f357daaf	MATERIA_PRIMA	ACIDO TIOGLICOLICO	ACTIVOS Y ACIDOS	ACTIVOS Y ACIDOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:51.878	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	4515	0	4515	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:51.879
33989317-c9ce-48d2-9e26-51fab24e763f	MATERIA_PRIMA	ACIDO UNDECILEICO	ACTIVOS Y ACIDOS	ACTIVOS Y ACIDOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:51.887	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	285	0	285	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:51.888
765279dd-9461-4b88-bf58-eda02ab83192	MATERIA_PRIMA	ACTICIDE	CONSERVANTES Y REGULADORES	CONSERVANTES Y REGULADORES	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:51.894	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	4941	0	4941	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:51.895
f803806e-932a-4f94-8064-bff14f976b04	MATERIA_PRIMA	AGUA DESIONIZADA	HUMECTANTES Y SOLVENTES	HUMECTANTES Y SOLVENTES	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:51.903	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	364568	0	364568	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:51.904
4c690cd5-e5dd-40ce-965c-ffd3120e8606	MATERIA_PRIMA	AGUA DESTILADA	HUMECTANTES Y SOLVENTES	HUMECTANTES Y SOLVENTES	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:51.91	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	15576	0	15576	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:51.911
8bad9deb-fc42-45ba-ab43-ea11d06c5203	MATERIA_PRIMA	ALANTOINA	ACTIVOS Y ACIDOS	ACTIVOS Y ACIDOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:51.918	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	4110	0	4110	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:51.919
520e0772-8e4e-449a-871d-186fe8e3379a	MATERIA_PRIMA	ALCANFOR	ACTIVOS Y ACIDOS	ACTIVOS Y ACIDOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:51.925	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	13516	0	13516	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:51.926
ab2ee568-91ef-4d6d-84ed-889ef61c1b97	MATERIA_PRIMA	ALCOHOL CETILICO	EMULSIONANTES Y CERAS	EMULSIONANTES Y CERAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:51.932	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	7499	0	7499	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:51.933
fa19f0e9-53cd-43d1-94ba-038e2439bf3d	MATERIA_PRIMA	ALCOHOL EXTRA NEUTRO 96%	HUMECTANTES Y SOLVENTES	HUMECTANTES Y SOLVENTES	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:51.94	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	200000	0	200000	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:51.94
4e3d7aa8-3e9b-4d33-b74d-53bfd5c1c7c8	MATERIA_PRIMA	ALCOHOL ISOPROPILICO	HUMECTANTES Y SOLVENTES	HUMECTANTES Y SOLVENTES	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:51.946	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	47870	0	47870	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:51.947
d526b886-034e-465d-8b38-0e9dafa8d1d8	MATERIA_PRIMA	ALCOHOL LAURICO	HUMECTANTES Y SOLVENTES	HUMECTANTES Y SOLVENTES	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:51.953	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	200829	0	200829	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:51.954
b7a576c0-1b6f-4375-b977-8107392677d1	MATERIA_PRIMA	ANTIESPUMANTE BLANCO	CONSERVANTES Y REGULADORES	CONSERVANTES Y REGULADORES	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:51.96	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	1216	0	1216	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:51.961
405644db-3bbe-43de-bbb7-3b21b6d7ea6c	MATERIA_PRIMA	ANTIESPUMANTE INDUSTRIAL	CONSERVANTES Y REGULADORES	CONSERVANTES Y REGULADORES	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:51.966	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	1893	0	1893	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:51.967
53cdf504-0ef9-444d-8318-60830d86eee1	MATERIA_PRIMA	ARCILLA BLANCA	MINERALES Y CARGAS	MINERALES Y CARGAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:51.975	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	23660	0	23660	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:51.975
eea15a82-0572-4524-b602-8b53f17e308f	MATERIA_PRIMA	AUROL NACARANTE SDS	CONSERVANTES Y REGULADORES	CONSERVANTES Y REGULADORES	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:51.982	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	812	0	812	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:51.983
f833abbf-26a5-4ed2-9365-2107fa01f002	MATERIA_PRIMA	BENCINA	HUMECTANTES Y SOLVENTES	HUMECTANTES Y SOLVENTES	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:51.989	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	22700	0	22700	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:51.99
683ddcb6-c6ce-48f4-b18b-fc1d1b526a1c	MATERIA_PRIMA	BENZOATO	CONSERVANTES Y REGULADORES	CONSERVANTES Y REGULADORES	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:51.997	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	16149	0	16149	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:51.998
4a5dde94-7c63-4d0c-af60-6c2f169462f5	MATERIA_PRIMA	BETAINA	TENSOACTIVOS	TENSOACTIVOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.006	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	172001	0	172001	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.007
4d8947f2-3e8c-461e-82d2-f950fe4bae7a	MATERIA_PRIMA	BICARBONATO FOOD GRADE	MINERALES Y CARGAS	MINERALES Y CARGAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.012	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	18019	0	18019	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.013
599e3d79-beb9-4646-81d9-5aec932f5f15	MATERIA_PRIMA	BIOTINA	ACTIVOS Y ACIDOS	ACTIVOS Y ACIDOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.02	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	984	0	984	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.021
84536113-68ed-431e-8781-29911d3903be	MATERIA_PRIMA	BIOTINA 2%	ACTIVOS Y ACIDOS	ACTIVOS Y ACIDOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.027	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	510	0	510	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.028
4d6cf252-acf6-48d9-8ebe-f1e365084aba	MATERIA_PRIMA	BUTIL (BUTILGLICOL)	HUMECTANTES Y SOLVENTES	HUMECTANTES Y SOLVENTES	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.036	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	24490	0	24490	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.037
b41aabc2-a7b9-4d63-9437-019db8fcae37	MATERIA_PRIMA	CAFEINA	ACTIVOS Y ACIDOS	ACTIVOS Y ACIDOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.045	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	36600	0	36600	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.046
8d395fb5-d976-40f8-913f-958ad8e32ed3	MATERIA_PRIMA	CAL	MINERALES Y CARGAS	MINERALES Y CARGAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.057	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	26131	0	26131	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.058
e83e8797-3612-4945-b88a-aab540590b92	MATERIA_PRIMA	CARBONATO 1000	MINERALES Y CARGAS	MINERALES Y CARGAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.064	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	48310	0	48310	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.065
106a850a-0e72-45c6-9eea-20dfe9689218	MATERIA_PRIMA	CARBONATO 400	MINERALES Y CARGAS	MINERALES Y CARGAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.075	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	42247	0	42247	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.076
711836ee-4870-4736-9685-c9b9b1a4ce38	MATERIA_PRIMA	CARBOPOL	ESPESANTES	ESPESANTES	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.086	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	27300	0	27300	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.087
1509ec6c-93fa-4819-bfb5-121366f21c86	MATERIA_PRIMA	CELLOSIZE	ESPESANTES	ESPESANTES	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.095	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	8194	0	8194	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.096
a70fcea0-e653-430a-9e1f-f93bb6e8482e	MATERIA_PRIMA	CERA CARNAUBA	EMULSIONANTES Y CERAS	EMULSIONANTES Y CERAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.103	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	32900	0	32900	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.104
f32b5658-c2d4-4f91-ab5d-566784ddbf14	MATERIA_PRIMA	CERA DE ABEJA REFINADA (TRANSPARENTE)	EMULSIONANTES Y CERAS	EMULSIONANTES Y CERAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.11	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	18750	0	18750	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.111
47913e66-6b39-4673-8b48-e466a55d6a12	MATERIA_PRIMA	CERA DE ABEJA VIRGEN	EMULSIONANTES Y CERAS	EMULSIONANTES Y CERAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.119	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	78677	0	78677	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.12
3109c6cf-9948-40e5-b6d7-cfc2b6de3146	MATERIA_PRIMA	CICLOMETICONA	SILICONAS Y EMOLIENTES	SILICONAS Y EMOLIENTES	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.126	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	6321	0	6321	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.126
3d094414-b98d-47f3-aff9-41547986a1eb	MATERIA_PRIMA	CLORHIDRATO DE ALUMINIO	MINERALES Y CARGAS	MINERALES Y CARGAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.132	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	25000	0	25000	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.133
abeb52e2-fb29-413b-8724-32cb49f0f78a	MATERIA_PRIMA	CLORURO DE BENZALCONIO	CONSERVANTES Y REGULADORES	CONSERVANTES Y REGULADORES	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.139	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	1226	0	1226	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.14
6441e8cf-4ce0-48fa-ac43-0f9e7fc892a9	MATERIA_PRIMA	CLORURO DE MAGNESIO	MINERALES Y CARGAS	MINERALES Y CARGAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.145	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	17050	0	17050	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.146
b8e2fa54-b55d-48a2-9179-f39b13817318	MATERIA_PRIMA	CMC	ESPESANTES	ESPESANTES	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.151	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	4243	0	4243	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.152
220eeae6-5e3c-4c7f-adde-e151fd6f934d	MATERIA_PRIMA	COLAGENO HIDROLIZADO	ACTIVOS Y ACIDOS	ACTIVOS Y ACIDOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.157	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	32662	0	32662	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.158
d4a4bb17-cf5e-4c3e-a7ae-60aeda163578	MATERIA_PRIMA	COPERLAND	TENSOACTIVOS	TENSOACTIVOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.163	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	9375	0	9375	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.164
293549bc-fd47-4c46-b24b-655708062081	MATERIA_PRIMA	COUMARINA	ACTIVOS Y ACIDOS	ACTIVOS Y ACIDOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.17	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	3472	0	3472	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.171
98773833-601c-4f15-b289-d31e85e5f2af	MATERIA_PRIMA	CURCUMA	ACTIVOS Y ACIDOS	ACTIVOS Y ACIDOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.176	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	3284	0	3284	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.177
75322715-3451-4840-8d5b-aff519c38b85	MATERIA_PRIMA	D-PANTENOL O PANTENOL	ACTIVOS Y ACIDOS	ACTIVOS Y ACIDOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.182	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	13385	0	13385	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.182
fa9f88e0-3c15-45a7-8080-9ae0f76d8e13	MATERIA_PRIMA	DECYL GLUCIDE	TENSOACTIVOS	TENSOACTIVOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.189	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	12935	0	12935	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.189
2e705dab-2eb0-44bc-bf4b-cbed9135de7d	MATERIA_PRIMA	DEHYQUART	TENSOACTIVOS	TENSOACTIVOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.194	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	80000	0	80000	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.195
63a2eb23-da8c-4607-b528-0f0e517899ac	MATERIA_PRIMA	DIOXIDO DE TITANIO FOOD GRADE	MINERALES Y CARGAS	MINERALES Y CARGAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.201	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	23000	0	23000	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.202
498f2b67-a77c-470f-88f7-91a7017f0615	MATERIA_PRIMA	DIOXIDO DE TITANIO INDUSTRIAL	MINERALES Y CARGAS	MINERALES Y CARGAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.208	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	50000	0	50000	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.209
9fc439e3-d252-4620-ae7b-5ad30a04a598	MATERIA_PRIMA	DIPROPILENGLICOL	HUMECTANTES Y SOLVENTES	HUMECTANTES Y SOLVENTES	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.214	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	20000	0	20000	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.215
7685bfa2-d193-4d3e-91ba-37208133d9fd	MATERIA_PRIMA	EDTA TETRASODICO	CONSERVANTES Y REGULADORES	CONSERVANTES Y REGULADORES	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.221	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	9404	0	9404	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.222
9ee4e8d6-f24f-4982-b8c7-f501668a76fd	MATERIA_PRIMA	EMULGADE 1000	EMULSIONANTES Y CERAS	EMULSIONANTES Y CERAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.228	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	71310	0	71310	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.229
0f2da70b-721c-4456-b2b6-50548ab7e755	MATERIA_PRIMA	ESPESANTE ACRILICO	ESPESANTES	ESPESANTES	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.236	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	4594	0	4594	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.237
25702a11-f428-4846-bc17-5e2d342d2e99	MATERIA_PRIMA	ESTABILIZADOR DE PEROXIDO	CONSERVANTES Y REGULADORES	CONSERVANTES Y REGULADORES	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.244	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	5829	0	5829	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.245
7f50e707-c813-4543-9e9c-a307abeb933f	MATERIA_PRIMA	EXTRACTO DE ALOE VERA	EXTRACTOS NATURALES	EXTRACTOS NATURALES	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.251	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	20667	0	20667	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.252
77880a36-bb8d-4032-917c-7007461bdc69	MATERIA_PRIMA	EXTRACTO DE CALENDULA	EXTRACTOS NATURALES	EXTRACTOS NATURALES	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.258	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	11280	0	11280	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.259
b10fdcf3-b628-443b-acaf-f50044b7aa39	MATERIA_PRIMA	EXTRACTO DE CASTAÑA DE INDIAS	EXTRACTOS NATURALES	EXTRACTOS NATURALES	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.265	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	12156	0	12156	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.266
2b6d655e-053f-4625-91d5-a48a93df2051	MATERIA_PRIMA	EXTRACTO DE CENTELLA ASIATICA	EXTRACTOS NATURALES	EXTRACTOS NATURALES	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.273	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	11671	0	11671	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.273
514526fe-0c4f-40ea-8527-1562fa835028	MATERIA_PRIMA	EXTRACTO DE GINSENG	EXTRACTOS NATURALES	EXTRACTOS NATURALES	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.28	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	6173	0	6173	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.281
7d8b18f4-21d8-41a4-acd3-acd48a786bb0	MATERIA_PRIMA	EXTRACTO DE HAMAMELIS	EXTRACTOS NATURALES	EXTRACTOS NATURALES	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.287	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	14871	0	14871	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.288
73c6b287-1a5e-437c-89d5-50fc92ab3903	MATERIA_PRIMA	EXTRACTO DE JENGIBRE	EXTRACTOS NATURALES	EXTRACTOS NATURALES	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.294	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	16001	0	16001	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.295
c1e3d62b-7d01-4674-b375-3828d6d5ef5f	MATERIA_PRIMA	EXTRACTO DE MANZANILLA	EXTRACTOS NATURALES	EXTRACTOS NATURALES	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.302	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	12182	0	12182	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.303
919a8838-ebbb-4150-bf25-52ee802df934	MATERIA_PRIMA	EXTRACTO DE ORTIGA	EXTRACTOS NATURALES	EXTRACTOS NATURALES	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.308	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	8991	0	8991	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.309
97e20f17-bbc8-4643-afd8-3e0dd310877a	MATERIA_PRIMA	EXTRACTO DE ROMERO	EXTRACTOS NATURALES	EXTRACTOS NATURALES	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.315	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	11755	0	11755	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.315
e1897c80-2c58-4484-bed5-7dda3347775e	MATERIA_PRIMA	EXTRACTO NATURAL DE ARNICA	EXTRACTOS NATURALES	EXTRACTOS NATURALES	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.322	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	9736	0	9736	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.323
e11f43f5-fbdb-41b5-9388-51c6d32414ee	MATERIA_PRIMA	EXTRACTO NATURAL DE AVENA	EXTRACTOS NATURALES	EXTRACTOS NATURALES	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.328	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	10945	0	10945	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.329
843588c8-2098-4967-ad76-24cf523e336d	MATERIA_PRIMA	EXTRACTO TE VERDE	EXTRACTOS NATURALES	EXTRACTOS NATURALES	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.336	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	9882	0	9882	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.337
aae59e60-30c1-4d52-a60a-39754022c443	MATERIA_PRIMA	EXXOL	HUMECTANTES Y SOLVENTES	HUMECTANTES Y SOLVENTES	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.343	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	1754	0	1754	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.343
93e22c7e-d30d-4360-abf1-ecf247cb9b4c	MATERIA_PRIMA	FENOXIETANOL	CONSERVANTES Y REGULADORES	CONSERVANTES Y REGULADORES	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.348	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	1000	0	1000	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.349
49858785-c877-418e-ac6d-0a852814a18d	MATERIA_PRIMA	FIPRONIL	ACTIVOS Y ACIDOS	ACTIVOS Y ACIDOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.355	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	1000	0	1000	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.356
b63fd6d0-d437-4871-a7fe-27f18bbdab0c	MATERIA_PRIMA	FORMOL	CONSERVANTES Y REGULADORES	CONSERVANTES Y REGULADORES	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.361	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	2928	0	2928	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.362
7eba1430-da49-47cb-b8ce-d7f7542d88a6	MATERIA_PRIMA	GALAXOLIDE	ACTIVOS Y ACIDOS	ACTIVOS Y ACIDOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.369	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	3147	0	3147	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.37
854a83b9-b964-4f4e-ace0-89d3629a0540	MATERIA_PRIMA	GLICERINA	HUMECTANTES Y SOLVENTES	HUMECTANTES Y SOLVENTES	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.376	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	8210	0	8210	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.376
66bdceeb-4c04-4c4a-b17a-5a3fe1d27843	MATERIA_PRIMA	GLUCONATO	ACTIVOS Y ACIDOS	ACTIVOS Y ACIDOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.381	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	1988	0	1988	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.382
6bfe68a6-5d68-4c12-ad96-d3d33e04a211	MATERIA_PRIMA	GLUCONATO DE CLORHEXIDINA	CONSERVANTES Y REGULADORES	CONSERVANTES Y REGULADORES	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.388	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	278	0	278	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.389
ee7509d3-60dc-4f40-9b56-ce7261dcff16	MATERIA_PRIMA	GOMA XANTANA	ESPESANTES	ESPESANTES	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.395	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	2250	0	2250	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.395
c2a04f16-8b77-4e43-921a-8eea3332e495	MATERIA_PRIMA	HIPOCLORITO DE SODIO	ACTIVOS Y ACIDOS	ACTIVOS Y ACIDOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.404	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	873	0	873	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.405
b8456cf4-35be-487a-af87-37373c17bdf5	MATERIA_PRIMA	IMPERMEABILIZANTE	ACTIVOS Y ACIDOS	ACTIVOS Y ACIDOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.411	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	197637	0	197637	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.412
6e467072-a313-44c3-85ba-ce1608cf95ec	MATERIA_PRIMA	ISOPROPILO DE MIRISTATO	SILICONAS Y EMOLIENTES	SILICONAS Y EMOLIENTES	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.417	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	498792	0	498792	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.418
41d05f15-651b-481f-b862-d6c31c0f3947	MATERIA_PRIMA	KETOCONAZOL	ACTIVOS Y ACIDOS	ACTIVOS Y ACIDOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.424	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	398	0	398	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.425
3d68e454-56fd-4d54-8a51-178e15c9cd00	MATERIA_PRIMA	KION EN POLVO	ACTIVOS Y ACIDOS	ACTIVOS Y ACIDOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.43	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	12800	0	12800	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.431
06513378-7ded-4039-9208-ef13df890266	MATERIA_PRIMA	LACA CSP	SILICONAS Y EMOLIENTES	SILICONAS Y EMOLIENTES	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.437	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	1489	0	1489	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.438
7e1ca395-e548-4564-a101-0c498114b034	MATERIA_PRIMA	LAURIL SULFATO DE SODIO (96%)	TENSOACTIVOS	TENSOACTIVOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.443	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	245	0	245	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.444
17026850-b9aa-4c95-a2c3-6d86fba6d51a	MATERIA_PRIMA	LIDOCAINA HCL	ACTIVOS Y ACIDOS	ACTIVOS Y ACIDOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.449	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	11064	0	11064	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.449
8fa73c6f-4c1f-4804-9d4d-50523cd83a78	MATERIA_PRIMA	MANTECA DE KARITE	SILICONAS Y EMOLIENTES	SILICONAS Y EMOLIENTES	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.456	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	62850	0	62850	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.456
665fdf3b-c4aa-4e7e-b05d-2e9e3fe8076f	MATERIA_PRIMA	MAQBLEND	ACTIVOS Y ACIDOS	ACTIVOS Y ACIDOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.462	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	845	0	845	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.463
88d25b54-1705-4ea8-b63d-4af23e236659	MATERIA_PRIMA	MECELLOSE	ESPESANTES	ESPESANTES	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.469	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	25837	0	25837	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.47
5f531d70-9628-4e91-8e02-9bea432dc39c	MATERIA_PRIMA	MENTOL CRISTAL	ACTIVOS Y ACIDOS	ACTIVOS Y ACIDOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.476	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	13913	0	13913	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.477
07785f34-f7ba-446d-baed-1b1bbbc0a1a1	MATERIA_PRIMA	MINOXIDIL	ACTIVOS Y ACIDOS	ACTIVOS Y ACIDOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.482	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	7286	0	7286	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.483
fd3ca2be-c091-41e6-9d97-f2e5bb1e3aef	MATERIA_PRIMA	MONO (MONOPROPILENGLICOL)	HUMECTANTES Y SOLVENTES	HUMECTANTES Y SOLVENTES	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.49	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	9930	0	9930	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.491
3ea51484-2958-49e8-bf38-071f8f0a670c	MATERIA_PRIMA	NEUTRADOR ALCOHOL	CONSERVANTES Y REGULADORES	CONSERVANTES Y REGULADORES	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.496	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	203	0	203	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.497
71170872-3313-4333-adbe-20e44d6b7280	MATERIA_PRIMA	NEUTRADOR AMONIACO	CONSERVANTES Y REGULADORES	CONSERVANTES Y REGULADORES	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.503	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	307	0	307	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.504
4cbde3de-16ea-4ee4-9577-c3145b392611	MATERIA_PRIMA	NEUTRADOR FRESCURA AMARILLA	CONSERVANTES Y REGULADORES	CONSERVANTES Y REGULADORES	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.509	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	295	0	295	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.51
d9ad19f5-833d-4f80-a5bb-d3791c9438a4	MATERIA_PRIMA	NEUTRADOR FRESCURA NARANJA	CONSERVANTES Y REGULADORES	CONSERVANTES Y REGULADORES	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.515	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	313	0	313	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.516
9212c4ce-532a-4e07-a794-02d03c468838	MATERIA_PRIMA	NEUTRADOR MASCOTAS	CONSERVANTES Y REGULADORES	CONSERVANTES Y REGULADORES	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.522	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	305	0	305	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.523
da15ed0b-fc97-4414-961d-63a571ec4ddc	MATERIA_PRIMA	NEUTRADOR NEW B.	CONSERVANTES Y REGULADORES	CONSERVANTES Y REGULADORES	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.528	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	300	0	300	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.529
3c3bec24-6197-40ce-89df-b3cf3bd7f652	MATERIA_PRIMA	NEUTRADOR ORINE DE MASCOTAS	CONSERVANTES Y REGULADORES	CONSERVANTES Y REGULADORES	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.535	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	313	0	313	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.535
49cc61ac-f452-4305-a2ce-1f48996c97be	MATERIA_PRIMA	NEUTRADOR VAM	CONSERVANTES Y REGULADORES	CONSERVANTES Y REGULADORES	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.541	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	309	0	309	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.541
d17d901b-a0bb-4784-8bdd-0cc401b7c195	MATERIA_PRIMA	NEUTRALIZADOR QP700	CONSERVANTES Y REGULADORES	CONSERVANTES Y REGULADORES	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.546	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	38850	0	38850	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.547
f53a4302-5acc-4d7f-9c09-8f0e3bba1889	MATERIA_PRIMA	NIACINAMIDA VITAMINA B3	ACTIVOS Y ACIDOS	ACTIVOS Y ACIDOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.553	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	15800	0	15800	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.553
53954fb8-1594-4758-9e46-21d2916eba54	MATERIA_PRIMA	NP10	ACTIVOS Y ACIDOS	ACTIVOS Y ACIDOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.559	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	46954	0	46954	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.56
3872920e-53d4-4aa9-8d80-87ec5a4f4532	MATERIA_PRIMA	OXIDO DE ZINC	MINERALES Y CARGAS	MINERALES Y CARGAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.565	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	15241	0	15241	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.565
52bfa257-fbcd-4d0e-87a3-cd6da71c02e6	MATERIA_PRIMA	PARAFINA LIQUIDA	SILICONAS Y EMOLIENTES	SILICONAS Y EMOLIENTES	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.572	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	1160	0	1160	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.572
9bf5012e-e483-42e0-bd04-784b118d100d	MATERIA_PRIMA	PARAFINA SOLIDA	SILICONAS Y EMOLIENTES	SILICONAS Y EMOLIENTES	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.577	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	10080	0	10080	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.578
46573a61-0cac-4205-b257-739419fc34ef	MATERIA_PRIMA	PEROXIDO	ACTIVOS Y ACIDOS	ACTIVOS Y ACIDOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.583	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	15000	0	15000	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.584
4cb449e1-0660-4074-8751-4422b798cec9	MATERIA_PRIMA	POLISORBATO 20	CONSERVANTES Y REGULADORES	CONSERVANTES Y REGULADORES	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.591	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	42930	0	42930	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.592
02b81d02-fa4c-41f2-8f80-3ce6c95b6d22	MATERIA_PRIMA	POLISORBATO 80	CONSERVANTES Y REGULADORES	CONSERVANTES Y REGULADORES	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.597	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	8452	0	8452	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.598
296cbce1-61e1-4ffc-8e88-aa9497eb97c6	MATERIA_PRIMA	POLYQUATERNARIUM 7	ACTIVOS Y ACIDOS	ACTIVOS Y ACIDOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.603	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	10966	0	10966	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.604
b58bb5af-a186-4b92-82c6-882635f38b6d	MATERIA_PRIMA	PRILOCAINA HCL	ACTIVOS Y ACIDOS	ACTIVOS Y ACIDOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.61	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	70	0	70	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.611
3fabf10d-4424-41b0-a9d9-ceea0b015bc0	MATERIA_PRIMA	PROCIDE 1.5	CONSERVANTES Y REGULADORES	CONSERVANTES Y REGULADORES	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.616	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	864	0	864	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.616
2a3ee8f2-1dbe-4293-9e4b-4417d5f20790	MATERIA_PRIMA	PROCIDE CG	CONSERVANTES Y REGULADORES	CONSERVANTES Y REGULADORES	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.623	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	18654	0	18654	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.623
9d31a535-ccf8-434c-901a-ddd76df5ca91	MATERIA_PRIMA	PROPILENGLICOL	HUMECTANTES Y SOLVENTES	HUMECTANTES Y SOLVENTES	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.628	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	120	0	120	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.629
c4f99f67-9a2d-46ac-afa0-c7495aa0e31b	MATERIA_PRIMA	PROPIONATO DE SODIO	CONSERVANTES Y REGULADORES	CONSERVANTES Y REGULADORES	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.634	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	102	0	102	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.635
b7ec40b1-ade5-4154-8bd9-83cfe60ee5b7	MATERIA_PRIMA	PROTEINA HIDROLIZADA DE SOYA	ACTIVOS Y ACIDOS	ACTIVOS Y ACIDOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.64	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	3325	0	3325	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.641
f627d760-ec5a-45c7-bb90-db8340ed6cc7	MATERIA_PRIMA	RESINOX	CONSERVANTES Y REGULADORES	CONSERVANTES Y REGULADORES	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.646	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	40000	0	40000	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.647
50e0ec8e-7352-49eb-9389-abcefe92430f	MATERIA_PRIMA	SAL	MINERALES Y CARGAS	MINERALES Y CARGAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.655	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	6000	0	6000	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.656
04a15a7f-1fbb-4f95-bbb4-340e590803da	MATERIA_PRIMA	SILICATO DE SODIO	MINERALES Y CARGAS	MINERALES Y CARGAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.666	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	2882	0	2882	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.667
be7e01d9-2903-45c9-be52-e46c22a03427	MATERIA_PRIMA	SILICONA 1000	SILICONAS Y EMOLIENTES	SILICONAS Y EMOLIENTES	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.674	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	18906	0	18906	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.674
1fa83567-fef9-4fa4-a6a0-d954e36b4922	MATERIA_PRIMA	SILICONA 1501	SILICONAS Y EMOLIENTES	SILICONAS Y EMOLIENTES	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.679	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	9216	0	9216	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.68
7bd56a53-5965-4537-bae0-9bfa66e78527	MATERIA_PRIMA	SILICONA 3031	SILICONAS Y EMOLIENTES	SILICONAS Y EMOLIENTES	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.689	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	73092	0	73092	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.69
adda07f4-46d9-4800-a515-83208c79bf50	MATERIA_PRIMA	SILICONA 350	SILICONAS Y EMOLIENTES	SILICONAS Y EMOLIENTES	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.698	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	3943	0	3943	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.699
f59075a9-d3d7-4e9b-a227-1e0d7c0ca3e2	MATERIA_PRIMA	SILICONA A LA GRASA	SILICONAS Y EMOLIENTES	SILICONAS Y EMOLIENTES	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.709	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	51790	0	51790	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.71
d00064e8-5883-4b25-9889-452b8ebf0fa4	MATERIA_PRIMA	SILICONA EMULSIONADA	SILICONAS Y EMOLIENTES	SILICONAS Y EMOLIENTES	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.717	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	1600	0	1600	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.718
f7240a98-0487-4182-8505-4695197948fb	MATERIA_PRIMA	SILICONA XIAMETER	SILICONAS Y EMOLIENTES	SILICONAS Y EMOLIENTES	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.724	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	1000	0	1000	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.725
355f3eb9-9c02-4ad5-8077-c417e084d391	MATERIA_PRIMA	SORBATO DE POTASIO	CONSERVANTES Y REGULADORES	CONSERVANTES Y REGULADORES	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.73	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	4301	0	4301	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.731
ed362c46-1b19-4ff2-874a-355699250e72	MATERIA_PRIMA	SORBITOL	HUMECTANTES Y SOLVENTES	HUMECTANTES Y SOLVENTES	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.738	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	4984	0	4984	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.739
b342600b-af8f-4f30-85e7-cd527e5583ea	MATERIA_PRIMA	TALCO	MINERALES Y CARGAS	MINERALES Y CARGAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.744	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	24130	0	24130	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.745
40b0c615-931e-4e47-9fd1-7672c69129bd	MATERIA_PRIMA	TAURINA	ACTIVOS Y ACIDOS	ACTIVOS Y ACIDOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.751	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	486	0	486	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.752
5092286a-c90f-4e2e-88fb-8c820445b7f9	MATERIA_PRIMA	TERBINAFINA HCL	ACTIVOS Y ACIDOS	ACTIVOS Y ACIDOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.758	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	514	0	514	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.759
9e4e5ee9-feb7-4b2e-91a5-49c35fcd3293	MATERIA_PRIMA	TETRACAINA HCL	ACTIVOS Y ACIDOS	ACTIVOS Y ACIDOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.764	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	1031	0	1031	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.765
7f47b1af-d047-48f6-ad27-b7299e4005c4	MATERIA_PRIMA	TEXAPON (TEXAPON 70%)	TENSOACTIVOS	TENSOACTIVOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.771	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	85000	0	85000	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.772
bed26c96-adec-48e0-8c26-c15eb71cc0fc	MATERIA_PRIMA	TRIETANOLAMINA (TEA)	CONSERVANTES Y REGULADORES	CONSERVANTES Y REGULADORES	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.778	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	1086	0	1086	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.779
ef76395e-0234-481b-8b7d-ac490acf6993	MATERIA_PRIMA	TRIETIL CITRATO	ACTIVOS Y ACIDOS	ACTIVOS Y ACIDOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.785	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	4015	0	4015	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.786
d44f7faf-3701-412f-aeaf-24fc486aa0ec	MATERIA_PRIMA	UREA	ACTIVOS Y ACIDOS	ACTIVOS Y ACIDOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.792	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	9500	0	9500	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.793
d04d9703-50f4-43e6-8099-1cc2af2ac80d	MATERIA_PRIMA	VAINILLINA	ACTIVOS Y ACIDOS	ACTIVOS Y ACIDOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.798	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	2218	0	2218	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.799
cba936b9-6cf2-4da1-9998-9fc021a1329f	MATERIA_PRIMA	VARSOL	HUMECTANTES Y SOLVENTES	HUMECTANTES Y SOLVENTES	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.807	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	1490.79	0	1490.79	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.808
ebe1a7f5-631d-430b-8ef9-a523aca299bb	MATERIA_PRIMA	VASELINA LIQUIDA	SILICONAS Y EMOLIENTES	SILICONAS Y EMOLIENTES	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.813	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	100000	0	100000	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.814
684add3c-91c9-45fe-a1f8-21af9f192dbf	MATERIA_PRIMA	VASELINA SOLIDA	SILICONAS Y EMOLIENTES	SILICONAS Y EMOLIENTES	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.819	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	82500	0	82500	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.82
09517486-b7be-45d0-9b78-cc551e706be8	MATERIA_PRIMA	VINAGRE DE MANZANA	ACTIVOS Y ACIDOS	ACTIVOS Y ACIDOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.825	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	6617	0	6617	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.826
1bb8a5c2-ddaa-4237-bc17-a0cc9e4bae6b	MATERIA_PRIMA	VITAMINA E	ACTIVOS Y ACIDOS	ACTIVOS Y ACIDOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.831	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	2378	0	2378	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.832
bc9ac200-9f46-4264-92d1-419b5c617d5e	MATERIA_PRIMA	VITAMINA E EN POLVO	ACTIVOS Y ACIDOS	ACTIVOS Y ACIDOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.84	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	1000	0	1000	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.841
5817142b-eab5-4513-a3ba-306b59af9686	MATERIA_PRIMA	ZACARINA (SACARINA)	ACTIVOS Y ACIDOS	ACTIVOS Y ACIDOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.846	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	1586	0	1586	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.847
0f91a1e9-436b-4907-a172-7a5fdb838286	INSUMO	FRAGANCIA ALOE VERA	FRAGANCIAS	FRAGANCIAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.853	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	383	0	383	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.854
8ef75508-b680-4f75-a723-06ca6071182d	INSUMO	FRAGANCIA ARIEL INTENSE	FRAGANCIAS	FRAGANCIAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.861	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	317	0	317	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.861
d8d74be3-60ce-4ccf-a682-d91aab925012	INSUMO	FRAGANCIA ARIS ACTIFIT	FRAGANCIAS	FRAGANCIAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.866	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	634	0	634	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.868
32a4ce20-70ce-423f-8aae-6bed7a9fed3b	INSUMO	FRAGANCIA AVENA Y MIEL	FRAGANCIAS	FRAGANCIAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.875	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	1627	0	1627	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.876
6d5b5ce5-2d4a-479d-91e1-9cf47fc97e5f	INSUMO	FRAGANCIA B INTENSE	FRAGANCIAS	FRAGANCIAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.881	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	1076	0	1076	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.882
5de218a8-c84a-41f8-929d-0ae2d584e59f	INSUMO	FRAGANCIA BABY AMERICA SOL	FRAGANCIAS	FRAGANCIAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.888	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	9	0	9	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.888
5b94b0bc-7aa2-4e0d-8fc9-8c86d0f0adc5	INSUMO	FRAGANCIA BABY POWERS	FRAGANCIAS	FRAGANCIAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.894	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	200	0	200	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.895
42f605bb-aab3-45b1-9a91-e8a877828275	INSUMO	FRAGANCIA BELLE	FRAGANCIAS	FRAGANCIAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.9	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	57	0	57	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.901
26df21fb-4c9c-4d8d-9598-606cf08cb9b8	INSUMO	FRAGANCIA BLUE CHANEL	FRAGANCIAS	FRAGANCIAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.907	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	184	0	184	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.907
0cac470b-a8fc-4e53-b5b3-a5296ae1d8b5	INSUMO	FRAGANCIA BORN IN ROMA	FRAGANCIAS	FRAGANCIAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.913	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	188	0	188	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.913
7e0dd6c7-c382-4681-9492-3f8e53881265	INSUMO	FRAGANCIA BOSMAN	FRAGANCIAS	FRAGANCIAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.919	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	100	0	100	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.92
1cf6fe8a-e345-49d9-9dd3-3092537b0d57	INSUMO	FRAGANCIA BOSQUE BAMBU	FRAGANCIAS	FRAGANCIAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.926	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	179	0	179	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.926
ddf47ab8-52c5-4903-94e1-e5b3182dcbe0	INSUMO	FRAGANCIA BRITNEY SPEARS	FRAGANCIAS	FRAGANCIAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.932	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	4219	0	4219	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.932
68ef4ada-bb92-431d-917f-8b000e5a5961	INSUMO	FRAGANCIA CALVIN KLEIN	FRAGANCIAS	FRAGANCIAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.939	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	4720	0	4720	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.94
1f15c8cb-343d-4f71-b654-087e17a6c510	INSUMO	FRAGANCIA CANELA Y MANZANA	FRAGANCIAS	FRAGANCIAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.944	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	2307	0	2307	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.945
1543ab0e-95ec-48f1-880a-4e908ffe6dd0	INSUMO	FRAGANCIA CARO LA ROSE	FRAGANCIAS	FRAGANCIAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.95	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	100	0	100	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.951
ec951536-422b-4928-a1bf-aafbfa30787f	INSUMO	FRAGANCIA CHERRY	FRAGANCIAS	FRAGANCIAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.957	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	226	0	226	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.958
93b3dc95-d98c-4ac7-ad70-e6d6b34f86b4	INSUMO	FRAGANCIA CHICLE MIX	FRAGANCIAS	FRAGANCIAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.963	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	69	0	69	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.963
dd054b62-d24c-4fd1-90ff-60a158e5553a	INSUMO	FRAGANCIA COCO INTENSE	FRAGANCIAS	FRAGANCIAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.969	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	3553	0	3553	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.97
03f82c8b-d1a7-40c7-9f8a-e1d9c9f81fbb	INSUMO	FRAGANCIA COCO PASION	FRAGANCIAS	FRAGANCIAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.975	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	100	0	100	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.976
a008b05d-2d05-4b2b-b3e7-f94483086a05	INSUMO	FRAGANCIA DELICATE FLOWERS	FRAGANCIAS	FRAGANCIAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.981	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	513	0	513	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.982
57f400a2-2fca-4323-8dde-0298bfe67406	INSUMO	FRAGANCIA DESIRE MAGNET	FRAGANCIAS	FRAGANCIAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.989	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	60	0	60	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.99
67c7a9af-acd9-4b8b-909b-a9172826ce24	INSUMO	FRAGANCIA DIGIOMEN	FRAGANCIAS	FRAGANCIAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:52.995	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	44	0	44	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:52.995
1de2877b-25f3-4fdb-97b5-1329aac36717	INSUMO	FRAGANCIA DRAKYA	FRAGANCIAS	FRAGANCIAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:53.001	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	94	0	94	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:53.002
edfd2abe-3c21-4ed9-9b4e-ef7b86e721c4	INSUMO	FRAGANCIA ENCAPSULADO	FRAGANCIAS	FRAGANCIAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:53.008	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	660	0	660	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:53.009
a1cac3cb-cee9-4e23-9bbf-a45893e8af61	INSUMO	FRAGANCIA EUCALIPTO	FRAGANCIAS	FRAGANCIAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:53.014	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	981	0	981	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:53.014
6e447046-8f7b-482d-b76e-16c5dbd0e0d6	INSUMO	FRAGANCIA FANTASY PF. (NORPERU)	FRAGANCIAS	FRAGANCIAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:53.02	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	47	0	47	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:53.021
ed7aa7c3-c32d-418f-a496-a2083c6877a9	INSUMO	FRAGANCIA FLOREX	FRAGANCIAS	FRAGANCIAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:53.028	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	2	0	2	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:53.028
16cdcf39-4f78-444a-a86d-e696053da23e	INSUMO	FRAGANCIA FRESA	FRAGANCIAS	FRAGANCIAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:53.035	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	3966	0	3966	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:53.036
af5b36c6-bbd7-4588-9470-e89e1ef2dc37	INSUMO	FRAGANCIA FRUTOS ROJOS	FRAGANCIAS	FRAGANCIAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:53.042	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	400	0	400	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:53.043
c9c7d93f-a3e7-48c2-8783-1994109492f2	INSUMO	FRAGANCIA FUN MINISTRY	FRAGANCIAS	FRAGANCIAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:53.049	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	99	0	99	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:53.049
07711106-fc9b-4f27-81e2-f9d4cb8dbad1	INSUMO	FRAGANCIA GODINA	FRAGANCIAS	FRAGANCIAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:53.057	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	4462	0	4462	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:53.057
3e35aa2f-4f6c-4c72-bab4-1f72bf5c1467	INSUMO	FRAGANCIA GREEN TEA	FRAGANCIAS	FRAGANCIAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:53.063	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	2394	0	2394	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:53.064
0e3895f9-531d-40b2-904e-7eec500d5b9d	INSUMO	FRAGANCIA INVICTUS	FRAGANCIAS	FRAGANCIAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:53.07	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	98	0	98	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:53.071
924609e6-a717-4e08-9d10-9bfca3d3e03c	INSUMO	FRAGANCIA INVICTUS INTENSE	FRAGANCIAS	FRAGANCIAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:53.076	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	46	0	46	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:53.077
78956f12-c52c-4a80-82a0-5d53ac52eb49	INSUMO	FRAGANCIA JAZMIN	FRAGANCIAS	FRAGANCIAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:53.082	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	5734	0	5734	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:53.083
12aed07f-c54b-4ba7-9f83-77422f075cc3	INSUMO	FRAGANCIA KING OF PARTIES	FRAGANCIAS	FRAGANCIAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:53.09	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	100	0	100	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:53.091
06c923e9-5a08-4e7a-aaa4-b0b0ffb4ab09	INSUMO	FRAGANCIA LAVANDA INTENSE	FRAGANCIAS	FRAGANCIAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:53.095	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	66	0	66	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:53.096
3e8a3d88-a754-4c2e-b7f0-c9f18f40a580	INSUMO	FRAGANCIA LIMACHEN	FRAGANCIAS	FRAGANCIAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:53.102	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	100	0	100	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:53.103
88540561-a701-4222-aa19-587f8435b26a	INSUMO	FRAGANCIA LIMON CITRUS	FRAGANCIAS	FRAGANCIAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:53.11	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	62	0	62	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:53.111
ee4ce440-7902-4af8-bacd-2f2c771985ac	INSUMO	FRAGANCIA LIMON INTENSE	FRAGANCIAS	FRAGANCIAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:53.116	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	100	0	100	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:53.117
c8d530af-5e45-4b9f-b307-9fb04f223054	INSUMO	FRAGANCIA LRV FRESH	FRAGANCIAS	FRAGANCIAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:53.124	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	929	0	929	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:53.125
2c54f35f-c9bb-4b5f-b77a-9fa55cf7d12a	INSUMO	FRAGANCIA MANZANA	FRAGANCIAS	FRAGANCIAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:53.13	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	4627	0	4627	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:53.131
5b53ef02-b7c6-44e5-9d41-7025342ea1fc	INSUMO	FRAGANCIA MANZANA INTENSE	FRAGANCIAS	FRAGANCIAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:53.137	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	12	0	12	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:53.138
38c2249f-2d00-4541-993a-5a252f068f35	INSUMO	FRAGANCIA MANZANILLA	FRAGANCIAS	FRAGANCIAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:53.143	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	4404	0	4404	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:53.144
cff8745a-e3e7-49cf-9e4f-183fd52ff592	INSUMO	FRAGANCIA MARACUYA	FRAGANCIAS	FRAGANCIAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:53.151	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	1620	0	1620	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:53.152
323d1d9a-749a-4df7-bb5e-c0c7fe884214	INSUMO	FRAGANCIA MENTA	FRAGANCIAS	FRAGANCIAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:53.16	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	5165	0	5165	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:53.161
b3e56d6d-65ef-4f7a-8cf4-470d0b2d734b	INSUMO	FRAGANCIA MIEL	FRAGANCIAS	FRAGANCIAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:53.169	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	1143	0	1143	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:53.17
79573eab-8750-4e66-bdf2-8bbf93637f97	INSUMO	FRAGANCIA MIL FLORES	FRAGANCIAS	FRAGANCIAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:53.176	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	635	0	635	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:53.177
34ae16ef-d24b-4a8b-80b8-797664a6b78a	INSUMO	FRAGANCIA NARANJA	FRAGANCIAS	FRAGANCIAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:53.182	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	3982	0	3982	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:53.183
686eaa76-580c-48b9-ae5d-1cb3869335c5	INSUMO	FRAGANCIA NEW CAR	FRAGANCIAS	FRAGANCIAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:53.19	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	965	0	965	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:53.191
728b5d49-f5e4-4485-a251-bed125120e0e	INSUMO	FRAGANCIA NEW CARE	FRAGANCIAS	FRAGANCIAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:53.196	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	374	0	374	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:53.197
7d3a20ac-2819-445d-99ea-ec2fa82c601d	INSUMO	FRAGANCIA ONE MILLION LUCKY	FRAGANCIAS	FRAGANCIAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:53.203	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	37	0	37	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:53.203
963a544b-c43a-4ab8-b4ad-966ace43c8b4	INSUMO	FRAGANCIA PACO 212	FRAGANCIAS	FRAGANCIAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:53.209	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	42	0	42	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:53.21
9faedb3c-3641-4345-aa1b-765f4d70b7bf	INSUMO	FRAGANCIA PACO LUCKY	FRAGANCIAS	FRAGANCIAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:53.215	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	11948	0	11948	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:53.216
13ad5259-f517-4423-bb0f-aee2457eb3a8	INSUMO	FRAGANCIA PACO RABAN (ANTIGUO)	FRAGANCIAS	FRAGANCIAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:53.223	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	826	0	826	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:53.224
39280567-2bde-455d-be82-154245bced66	INSUMO	FRAGANCIA PACO RABAN (ANTO - INVICTO)	FRAGANCIAS	FRAGANCIAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:53.229	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	433	0	433	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:53.23
7cd9d289-e931-4f03-8579-8e51c609d00c	INSUMO	FRAGANCIA PRO CUIDADO	FRAGANCIAS	FRAGANCIAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:53.237	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	250	0	250	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:53.238
1970d4e3-98e1-4f96-aad8-38d9e69fd87b	INSUMO	FRAGANCIA PURE FREEDOM 212	FRAGANCIAS	FRAGANCIAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:53.243	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	849	0	849	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:53.244
15acc21a-3ef5-415d-a4bc-8488584e5264	INSUMO	FRAGANCIA PURE SEDUCTION	FRAGANCIAS	FRAGANCIAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:53.249	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	1001	0	1001	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:53.25
f7f015fc-9a9a-4cd5-a961-716be44ac741	INSUMO	FRAGANCIA RITCHIE CHANNE	FRAGANCIAS	FRAGANCIAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:53.256	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	228	0	228	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:53.257
939dcec7-12d6-48cb-997e-6f906b2815b6	INSUMO	FRAGANCIA ROSAS	FRAGANCIAS	FRAGANCIAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:53.262	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	606	0	606	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:53.263
ab803808-f120-4bde-8b5c-f5edce4ed4c1	INSUMO	FRAGANCIA SAUVAGE ELIXIR DIOR	FRAGANCIAS	FRAGANCIAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:53.269	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	3169	0	3169	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:53.27
a901c387-dbe6-4adb-9702-d6b1883b3fca	INSUMO	FRAGANCIA TEA TREE	FRAGANCIAS	FRAGANCIAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:53.276	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	1944	0	1944	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:53.276
589b76bb-9484-460d-8d33-9bf2dcf4d8f2	INSUMO	FRAGANCIA ULTRAMAN	FRAGANCIAS	FRAGANCIAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:53.281	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	100	0	100	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:53.282
f19b179b-c10c-41a2-8ec8-6b4dba3d9560	INSUMO	FRAGANCIA VAINILLA	FRAGANCIAS	FRAGANCIAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:53.287	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	2637	0	2637	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:53.288
bb649bb3-ac1e-4836-9273-e6e17b710a65	INSUMO	FRAGANCIA VICARO	FRAGANCIAS	FRAGANCIAS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:53.293	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	100	0	100	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:53.294
261426f1-095d-4975-8594-d93c7abff371	INSUMO	COLORANTE A LA GRASA AMARILLO	COLORANTES Y PIGMENTOS	COLORANTES Y PIGMENTOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:53.299	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	36	0	36	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:53.3
4f09635b-46e7-47e4-b1f8-74d3bc594c4d	INSUMO	COLORANTE A LA GRASA AZUL	COLORANTES Y PIGMENTOS	COLORANTES Y PIGMENTOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:53.306	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	14	0	14	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:53.307
310a8ef6-1c6a-4dd4-b815-96332e85ddac	INSUMO	COLORANTE A LA GRASA NARANJA	COLORANTES Y PIGMENTOS	COLORANTES Y PIGMENTOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:53.312	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	812	0	812	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:53.313
020edd19-1399-4ba0-9c6f-4671d8da49da	INSUMO	COLORANTE A LA GRASA NEGRO	COLORANTES Y PIGMENTOS	COLORANTES Y PIGMENTOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:53.319	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	100	0	100	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:53.32
cff508b8-308e-4d6a-9fb9-e2ca24ecd62b	INSUMO	COLORANTE A LA GRASA ROJO	COLORANTES Y PIGMENTOS	COLORANTES Y PIGMENTOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:53.326	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	103	0	103	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:53.326
07866cef-2d97-4d93-ba09-1ca1de31081c	INSUMO	COLORANTE ACIDO AMARILLO	COLORANTES Y PIGMENTOS	COLORANTES Y PIGMENTOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:53.332	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	209	0	209	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:53.332
776475bb-4a42-4e04-a365-b5864536465c	INSUMO	COLORANTE ACIDO AZUL	COLORANTES Y PIGMENTOS	COLORANTES Y PIGMENTOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:53.339	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	495	0	495	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:53.34
2a939cc9-1dd2-4bc2-acb2-f1e289ddee4f	INSUMO	COLORANTE ACIDO MARRON CROMO	COLORANTES Y PIGMENTOS	COLORANTES Y PIGMENTOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:53.346	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	258	0	258	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:53.347
e4d48c11-21ad-4102-b774-ccf6279c6d5d	INSUMO	COLORANTE ACIDO NARANJA II	COLORANTES Y PIGMENTOS	COLORANTES Y PIGMENTOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:53.354	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	108	0	108	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:53.355
be307b01-26fa-4f50-bd84-259179ac9bea	INSUMO	COLORANTE ACIDO NEGRO	COLORANTES Y PIGMENTOS	COLORANTES Y PIGMENTOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:53.361	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	115	0	115	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:53.362
f314018f-a7d1-43b2-b729-859a3ea3395c	INSUMO	COLORANTE ACIDO ROJO (RODAMINA B)	COLORANTES Y PIGMENTOS	COLORANTES Y PIGMENTOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:53.368	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	112	0	112	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:53.369
dc6c94d9-cee7-482e-aa87-44b42e5e5eda	INSUMO	COLORANTE ACIDO ROJO AMARANTO	COLORANTES Y PIGMENTOS	COLORANTES Y PIGMENTOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:53.376	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	91	0	91	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:53.376
bd008af4-fea1-4334-a389-5a8428d821bd	INSUMO	COLORANTE ACIDO ROJO ESCARLATA	COLORANTES Y PIGMENTOS	COLORANTES Y PIGMENTOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:53.383	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	238	0	238	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:53.384
698aa0a0-208a-4b5e-84ee-b06de485ec5b	INSUMO	COLORANTE ACIDO VERDE BRILLANTE	COLORANTES Y PIGMENTOS	COLORANTES Y PIGMENTOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:53.391	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	129	0	129	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:53.391
e2cd4c0d-03d1-4569-9fdd-681ca98ece13	INSUMO	COLORANTE ACIDO VIOLETA	COLORANTES Y PIGMENTOS	COLORANTES Y PIGMENTOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:53.399	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	88	0	88	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:53.4
0edf3273-ae42-4e21-ad6e-ce24d1b0de46	INSUMO	COLORANTE AL AGUA NARANJA	COLORANTES Y PIGMENTOS	COLORANTES Y PIGMENTOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:53.409	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	244	0	244	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:53.41
581cafc8-20da-4e1c-b051-a936293e6a83	INSUMO	COLORANTE AMARILLO	COLORANTES Y PIGMENTOS	COLORANTES Y PIGMENTOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:53.418	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	96	0	96	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:53.419
5578a1c4-228b-46e8-9962-6532dfa13980	INSUMO	COLORANTE AMARILLO CLARO AL AGUA	COLORANTES Y PIGMENTOS	COLORANTES Y PIGMENTOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:53.429	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	114	0	114	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:53.43
abe44e79-492a-4e37-a28e-c8afdb25c33a	INSUMO	COLORANTE AMARILLO DISPERSANTE	COLORANTES Y PIGMENTOS	COLORANTES Y PIGMENTOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:53.44	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	936	0	936	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:53.442
6d965b4d-3a08-47c0-b299-5092758a70c7	INSUMO	COLORANTE AZUL CRISTAL	COLORANTES Y PIGMENTOS	COLORANTES Y PIGMENTOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:53.453	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	109	0	109	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:53.454
ceb29460-8e06-428a-9abe-dc789021e48d	INSUMO	COLORANTE AZUL DISPERSANTE	COLORANTES Y PIGMENTOS	COLORANTES Y PIGMENTOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:53.464	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	940	0	940	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:53.465
95e16f28-3cc3-4d34-b265-9c12463f45d3	INSUMO	COLORANTE AZUL OSCURO	COLORANTES Y PIGMENTOS	COLORANTES Y PIGMENTOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:53.475	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	1572	0	1572	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:53.475
3c2d1264-47ff-4d22-86d5-edfaee26ae8d	INSUMO	COLORANTE B AMARILLO ORO	COLORANTES Y PIGMENTOS	COLORANTES Y PIGMENTOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:53.482	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	5225	0	5225	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:53.483
31dcbc18-3809-46c9-b31f-fc87977b14ea	INSUMO	COLORANTE MARRON CROMO	COLORANTES Y PIGMENTOS	COLORANTES Y PIGMENTOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:53.492	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	250	0	250	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:53.493
4fdbea91-aab9-44b6-9a7e-a50c21cbcd15	INSUMO	COLORANTE NARANJA	COLORANTES Y PIGMENTOS	COLORANTES Y PIGMENTOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:53.499	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	115	0	115	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:53.499
c2d91bf6-c5d6-49e9-96c6-2052f5093586	INSUMO	COLORANTE OXIDO DE HIERRO AMARILLO	COLORANTES Y PIGMENTOS	COLORANTES Y PIGMENTOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:53.506	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	202	0	202	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:53.507
53e7c526-cebd-4d1a-be15-574eafba7353	INSUMO	COLORANTE OXIDO DE HIERRO ROJO	COLORANTES Y PIGMENTOS	COLORANTES Y PIGMENTOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:53.512	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	146	0	146	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:53.513
3abaaf8c-6014-4501-a51e-1ed6eafbd8e0	INSUMO	COLORANTE ROJO CLARO	COLORANTES Y PIGMENTOS	COLORANTES Y PIGMENTOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:53.519	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	245	0	245	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:53.52
adc3b379-aec3-4238-b268-461a874c01c8	INSUMO	COLORANTE ROJO DISPERSANTE	COLORANTES Y PIGMENTOS	COLORANTES Y PIGMENTOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:53.526	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	572	0	572	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:53.527
fcc70544-6372-45fe-978b-0f28847363f5	INSUMO	COLORANTE ROJO PULSO	COLORANTES Y PIGMENTOS	COLORANTES Y PIGMENTOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:53.533	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	476	0	476	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:53.533
d55cccb9-e396-4aaa-9160-1619080a2f17	INSUMO	COLORANTE ROJO RODAMIDA (RODAMINA)	COLORANTES Y PIGMENTOS	COLORANTES Y PIGMENTOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:53.54	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	238	0	238	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:53.541
21d8208b-9d4f-4426-9452-d1475ddf7508	INSUMO	COLORANTE ROJO SANGRE	COLORANTES Y PIGMENTOS	COLORANTES Y PIGMENTOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:53.546	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	134	0	134	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:53.547
f1405d2a-ed1d-4179-b398-b384a3310802	INSUMO	COLORANTE S-NEGRO	COLORANTES Y PIGMENTOS	COLORANTES Y PIGMENTOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:53.553	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	1004	0	1004	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:53.554
cf7ebb12-fd30-46a4-941f-d87279041996	INSUMO	COLORANTE VERDE	COLORANTES Y PIGMENTOS	COLORANTES Y PIGMENTOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:53.56	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	135	0	135	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:53.56
e2e4267f-9457-474c-a220-f2dadb24bf37	INSUMO	COLORANTE VERDE DISPERSANTE	COLORANTES Y PIGMENTOS	COLORANTES Y PIGMENTOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:53.565	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	1211	0	1211	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:53.566
8dd61179-d0ed-4cc5-bc1a-ec5e433af865	INSUMO	COLORANTE VERDE FLUORESCENTE	COLORANTES Y PIGMENTOS	COLORANTES Y PIGMENTOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:53.575	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	132	0	132	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:53.576
0d39f731-1b34-4226-a5c7-767ced5f01dc	INSUMO	COLORANTE VERDE LAVAVAJILLAS	COLORANTES Y PIGMENTOS	COLORANTES Y PIGMENTOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:53.581	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	102	0	102	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:53.582
4991bfe1-85ec-4de5-b183-6a21059001c8	INSUMO	COLORANTE VIOLETA	COLORANTES Y PIGMENTOS	COLORANTES Y PIGMENTOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:53.589	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	43	0	43	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:53.59
9a10841b-2057-40e6-92e1-e4a978771336	INSUMO	COLORANTE VIOLETA MORADO	COLORANTES Y PIGMENTOS	COLORANTES Y PIGMENTOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:53.595	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	361	0	361	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:53.596
0941bba6-a794-448a-99ad-8b75da68b9ee	INSUMO	DISPERSANTE BLANCO CONCENTRADO	COLORANTES Y PIGMENTOS	COLORANTES Y PIGMENTOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:53.601	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	5000	0	5000	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:53.602
f4dc664c-3d36-40d1-a883-edce3f48ce8c	INSUMO	DISPERSANTE MORADO	COLORANTES Y PIGMENTOS	COLORANTES Y PIGMENTOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:53.608	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	5964	0	5964	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:53.609
15875005-d587-4f68-9f76-3170b93904aa	INSUMO	DISPERSANTE NEGRO	COLORANTES Y PIGMENTOS	COLORANTES Y PIGMENTOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:53.614	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	11278	0	11278	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:53.614
00facd4b-c2c3-472a-9cd4-a0a3b3748693	INSUMO	OXIDO DE HIERRO AZUL (AZUL MILORI)	COLORANTES Y PIGMENTOS	COLORANTES Y PIGMENTOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:53.62	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	240	0	240	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:53.621
92bad72a-6d43-4d9e-b472-b694a82c96d9	INSUMO	OXIDO DE HIERRO AZUL ULTRAMAR 462	COLORANTES Y PIGMENTOS	COLORANTES Y PIGMENTOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:53.628	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	482	0	482	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:53.629
0585274d-30bf-4ebe-82e9-d8182734cc55	INSUMO	OXIDO DE HIERRO MARRON 610 (PARDO)	COLORANTES Y PIGMENTOS	COLORANTES Y PIGMENTOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:53.634	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	254	0	254	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:53.635
2930adf2-0a64-47f4-80c1-dc82e00c4b17	INSUMO	OXIDO DE HIERRO NARANJA MOLIBDEN NL	COLORANTES Y PIGMENTOS	COLORANTES Y PIGMENTOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:53.642	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	146	0	146	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:53.642
9a97ee90-3bc8-4f3c-9bac-bc542d810d84	INSUMO	OXIDO DE HIERRO VERDE	COLORANTES Y PIGMENTOS	COLORANTES Y PIGMENTOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:53.648	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	232	0	232	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:53.648
956c0aae-7f73-4604-ab61-8198ec0ea5a6	INSUMO	PERLADO DORADO RC-300	COLORANTES Y PIGMENTOS	COLORANTES Y PIGMENTOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:53.656	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	249	0	249	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:53.656
439a4d3b-e8db-4bbb-9af8-4a704c1a1ccd	INSUMO	PERLADO DORADO RC-303	COLORANTES Y PIGMENTOS	COLORANTES Y PIGMENTOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:53.663	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	183	0	183	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:53.664
e2c71990-cf53-4689-80b6-ee7b15fd28b3	INSUMO	POLVO DORADO DE BRONCE RPG	COLORANTES Y PIGMENTOS	COLORANTES Y PIGMENTOS	APERTURA INVENTARIO FISICO 02/09/2026	GR	2026-09-07 19:25:53.67	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	249	0	249	0	0	0	0	\N	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 19:25:53.671
e116469e-17ba-45b1-802e-1139ab47ce38	ENVASE	BALDE DE 20 LITROS CON TAPA	ENVASES Y EMBALAJES	ENVASES Y EMBALAJES	APERTURA INVENTARIO FISICO 02/09/2026	UN	2026-09-07 20:26:19.543	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	141	0	141	0	0	0	0	22abc39c-3137-4112-949a-3e993f7976c8	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 20:26:19.545
d5fb4ebe-cbf3-4aef-abf7-8eb3d75d0149	ENVASE	GALONERA / BIDON DE 120 LITROS	ENVASES Y EMBALAJES	ENVASES Y EMBALAJES	APERTURA INVENTARIO FISICO 02/09/2026	UN	2026-09-07 20:26:19.558	INVENTARIO	\N	\N	\N	ENTRADA_COMPRA	159	0	159	0	0	0	0	6925c9ab-da76-4077-864c-7a35dd36e1ab	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-07 20:26:19.559
530fe271-4cde-4abe-93a4-6b078e077c8a	MATERIA_PRIMA	DECYL GLUCOCIDE	TENSOACTIVOS	TENSOACTIVOS	REPOSICION STOCK - ADMINISTRACION	GR	2026-09-09 15:27:13.671	REPO	\N	\N	\N	ENTRADA_COMPRA	10	0	2945	0	0	0	0	eb30f874-6891-40aa-9a99-8090f0dddf5b	76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	SEDE-LIMA	2026-09-09 15:27:13.672
\.


--
-- Data for Name: marcaciones_biometrico; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.marcaciones_biometrico (id, "usuarioId", "tipoMarcacion", "timestamp", "dispositivoId") FROM stdin;
\.


--
-- Data for Name: marcaciones_pendientes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.marcaciones_pendientes (id, dispositivo_id, codigo_biometrico, tipo_marcacion, "timestamp", procesada, vinculado_a_id, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: metricas_produccion_diaria; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.metricas_produccion_diaria (id, fecha, "volumenTotalLitros", "mermaTotalKg", "eficienciaPromedio", "createdAt") FROM stdin;
\.


--
-- Data for Name: ordenes_produccion; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.ordenes_produccion (id, "codigoLote", "clienteNombre", "operariosAsignados", "colorEspecificado", "fraganciaEspecificada", prioridad, "observacionesQA", "motivoRechazo", "pasoProceso", "formulaId", "cantidadPlanificada", "cantidadObtenida", "mermaCalculada", estado, "supervisorId", "fechaCierre", "createdAt", "updatedAt", pedido_comercial_id) FROM stdin;
\.


--
-- Data for Name: pagos_abonos; Type: TABLE DATA; Schema: public; Owner: -
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
-- Data for Name: pedido_aditivos; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.pedido_aditivos (id, pedido_id, insumo_id, tipo, porcentaje, gramos_calculados, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: pedidos_comerciales; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.pedidos_comerciales (id, codigo_orden, codigo_ref_admin, cliente_nombre, cliente_ruc, contacto_nombre, contacto_telefono, direccion_despacho, rep_comercial, condicion_pago, producto_nombre, cantidad_solicitada, unidad_medida, lotes_requeridos, monto_total, fecha_prometida, prioridad, estado, formula_id, notas_admin, motivo_devolucion, doc_type, aroma, color, aroma_text, color_text, variante_id, cliente_id, created_at, updated_at, tipo_comprobante) FROM stdin;
c44a9651-e0bb-4ba9-b668-32d9082ca49f	OP-20260831-06	E001-227	ALFALION INVESTMENT S.A.C.	20612434124	\N	\N	\N	\N	Contado	CREMA CORRECTORA PARA LABIOS	11.0000	KG	1	935.00	2026-08-31 00:00:00	NORMAL	APROBADO	62f75fd3-9938-4a48-9d13-5ccb7ff36358	\N	\N	OP	\N	\N	\N	\N	\N	ae6b7139-1b14-4b8d-8752-1eb9812b7211	2026-09-09 13:49:28.685	2026-09-09 13:49:28.685	FACTURA
691764d0-977f-49a7-a71d-8dba2a0f2bb5	OP-20260831-07	E001-227	ALFALION INVESTMENT S.A.C.	20612434124	\N	\N	\N	\N	Contado	BARRA REDUCCION DE ARRUGAS	5.0000	LT	1	325.00	2026-08-31 00:00:00	NORMAL	APROBADO	3efa86f9-0038-4e71-8b81-06027b636880	\N	\N	OP	\N	\N	\N	\N	\N	ae6b7139-1b14-4b8d-8752-1eb9812b7211	2026-09-09 13:49:28.685	2026-09-09 13:49:28.685	FACTURA
c5a1a808-7754-4462-a56c-530ecfebc77c	OP-20260901-01	\N	GRUPO DEUS S.A.C.	20612838489	\N	\N	\N	\N	Contado	CREMA MUSCULAR CON MAGNESIO	50.0000	KG	1	3000.00	2026-09-01 00:00:00	NORMAL	APROBADO	1ef772af-2d57-4378-a172-bbde20b2f26d	\N	\N	OP	\N	\N	\N	\N	\N	1d4c93a7-c5e1-4dfa-9e73-6e36fdee7800	2026-09-09 17:10:20.98	2026-09-09 17:10:20.98	FACTURA
4370cbc9-03a9-4724-932f-0b219f005d24	OP-20260901-02	\N	ALFALION INVESTMENT S.A.C.	20612434124	\N	\N	\N	\N	Contado	CREMA HIDRATANTE CON CENTELLA ASIATICA Y ACIDO HIALURONICO	14.0000	KG	1	1078.00	2026-09-01 00:00:00	NORMAL	APROBADO	1767f862-c56e-4d0e-8741-ed284ab0a975	\N	\N	OP	\N	\N	\N	\N	\N	ae6b7139-1b14-4b8d-8752-1eb9812b7211	2026-09-09 17:10:20.98	2026-09-09 17:10:20.98	FACTURA
a87c9b2f-0d38-438c-9349-5303cdc66d26	OP-20260901-03	\N	ALFALION INVESTMENT S.A.C.	20612434124	\N	\N	\N	\N	Contado	BARRA REDUCCION DE ARRUGAS	6.0000	LT	1	390.00	2026-09-01 00:00:00	NORMAL	APROBADO	3efa86f9-0038-4e71-8b81-06027b636880	\N	\N	OP	\N	\N	\N	\N	\N	ae6b7139-1b14-4b8d-8752-1eb9812b7211	2026-09-09 17:10:20.98	2026-09-09 17:10:20.98	FACTURA
6623ecc9-4b18-47a4-99df-23e0bfa4c567	OP-20260901-04	\N	ALFALION INVESTMENT S.A.C.	20612434124	\N	\N	\N	\N	Contado	GEL INTIMO	18.0000	KG	1	1116.00	2026-09-01 00:00:00	NORMAL	APROBADO	cbc2005a-9781-4ea6-ba80-833467111ae1	\N	\N	OP	\N	\N	\N	\N	\N	ae6b7139-1b14-4b8d-8752-1eb9812b7211	2026-09-09 17:10:20.98	2026-09-09 17:10:20.98	FACTURA
ff73f6c0-f8d5-4170-90c9-06c4dd6c1387	OP-20260903-01	\N	ALFALION INVESTMENT S.A.C.	20612434124	\N	\N	\N	\N	Contado	STICK DE CICATRICES	4.0000	LT	1	388.00	2026-09-03 00:00:00	NORMAL	APROBADO	e5d7f71c-93be-49ff-bd71-1d0c23958b3f	\N	\N	OP	\N	\N	\N	\N	\N	ae6b7139-1b14-4b8d-8752-1eb9812b7211	2026-09-09 17:10:20.98	2026-09-09 17:10:20.98	FACTURA
93566f64-6eb1-45c8-8b1a-048ff9c3cb62	OP-20260903-02	\N	ALFALION INVESTMENT S.A.C.	20612434124	\N	\N	\N	\N	Contado	BARRA REDUCCION DE ARRUGAS	10.0000	LT	1	650.00	2026-09-03 00:00:00	NORMAL	APROBADO	3efa86f9-0038-4e71-8b81-06027b636880	\N	\N	OP	\N	\N	\N	\N	\N	ae6b7139-1b14-4b8d-8752-1eb9812b7211	2026-09-09 17:10:20.98	2026-09-09 17:10:20.98	FACTURA
b63e1de3-5603-4676-865c-0961a96c5b1b	OP-20260903-03	\N	ALFALION INVESTMENT S.A.C.	20612434124	\N	\N	\N	\N	Contado	ACEITE ANTIVELLO CORPORAL REAFIRMANTE	12.0000	LT	1	744.00	2026-09-03 00:00:00	NORMAL	APROBADO	e202a2f1-f630-48da-b990-b2d570fddcb0	\N	\N	OP	\N	\N	\N	\N	\N	ae6b7139-1b14-4b8d-8752-1eb9812b7211	2026-09-09 17:10:20.98	2026-09-09 17:10:20.98	FACTURA
a4b5cdfe-d09f-442e-af79-ec0fa19e73f0	OP-20260905-01	\N	FENIX G EXPRESS S.A.C.	20613316184	\N	\N	\N	\N	Credito 07 dias	ELHOE	15.0000	LT	1	480.00	2026-09-05 00:00:00	NORMAL	PENDIENTE_REVISION	69642105-98cb-4bb6-b7ee-f7fb34f102b9	\N	\N	OP	\N	\N	\N	\N	\N	4cf61e66-b049-4e9a-a942-ccc5e781a6b8	2026-09-09 17:10:20.98	2026-09-09 17:10:20.98	\N
cf10b0e2-ac77-4b45-83b9-0a51948052f7	OP-20260905-02	\N	RORY ALFREDO SERPA FLORES	48558440	\N	\N	\N	\N	Contado	FEROMONAS PACO RABANNE ECONOMICO	5.0000	LT	1	225.00	2026-09-05 00:00:00	NORMAL	APROBADO	09f4deb9-88c4-4f62-a1a1-759db5bc2840	\N	\N	OP	\N	\N	\N	\N	\N	a2d4abc0-5c0a-4f6a-ada6-41f4266d4e7c	2026-09-09 17:10:20.98	2026-09-09 17:10:20.98	FACTURA
f24af357-3d1b-4770-ae82-edc2c781fce9	OP-20260907-02	\N	NEXARA CORP S.A.C.	20615778207	\N	\N	\N	\N	Contado	SERUM DE ALOE VERA	7.0000	KG	1	289.10	2026-09-07 00:00:00	NORMAL	APROBADO	df60ec2d-029b-4188-866d-15bd8bbe4742	\N	\N	OP	\N	\N	\N	\N	\N	a5a2423e-1c0f-4545-8121-1853976d8fb7	2026-09-09 17:10:20.98	2026-09-09 17:10:20.98	FACTURA
891f0b4c-3ea2-4c2c-a6ec-bd8f82ecad2e	OP-20260907-03	\N	ALFALION INVESTMENT S.A.C.	20612434124	\N	\N	\N	\N	Contado	SERUM DE PESTAÑA	35.0000	KG	1	2275.00	2026-09-07 00:00:00	NORMAL	APROBADO	2fcd4746-8c81-4b18-a513-6933fc66784c	\N	\N	OP	\N	\N	\N	\N	\N	ae6b7139-1b14-4b8d-8752-1eb9812b7211	2026-09-09 17:10:20.98	2026-09-09 17:10:20.98	FACTURA
36887536-23ee-4ef3-acb6-608f879fbda2	OP-20260907-01	\N	VENTAS MOSTRADOR / BOLETAS DNI	00000000	\N	\N	\N	\N	Contado	CREMA MUSCULAR	100.0000	KG	1	0.00	2026-09-07 00:00:00	NORMAL	PENDIENTE_REVISION	2adedd85-03ee-4c05-8e12-a16db63abe0b	\N	\N	OP	\N	\N	\N	\N	\N	a823d8c0-4727-4f2c-b5ce-7fdd0e4fb528	2026-09-09 17:10:20.98	2026-09-09 17:10:20.98	BOLETA
934214c0-ae59-40bc-88fe-b4386e8d091a	OP-20260908-01	\N	FENIX G EXPRESS S.A.C.	20613316184	\N	\N	\N	\N	Contado	CREMA DERMA BEE	40.0000	KG	1	0.00	2026-09-08 00:00:00	NORMAL	PENDIENTE_REVISION	74705cab-531b-484d-ac69-7915ea330150	\N	\N	OP	\N	\N	\N	\N	\N	4cf61e66-b049-4e9a-a942-ccc5e781a6b8	2026-09-09 17:10:20.98	2026-09-09 17:10:20.98	\N
f23f2418-7095-4b40-9f78-9eef8723096f	OP-20260908-02	\N	FENIX G EXPRESS S.A.C.	20613316184	\N	\N	\N	\N	Contado	SPRAY DE VERRUGAS	20.0000	LT	1	0.00	2026-09-08 00:00:00	NORMAL	PENDIENTE_REVISION	56b7d557-6a88-4ee4-96a7-30d0c70a5f2b	\N	\N	OP	\N	\N	\N	\N	\N	4cf61e66-b049-4e9a-a942-ccc5e781a6b8	2026-09-09 17:10:20.98	2026-09-09 17:10:20.98	\N
caba81e4-5b73-4258-b3cc-8844cbdbe608	OP-20260908-03	\N	FENIX G EXPRESS S.A.C.	20613316184	\N	\N	\N	\N	Contado	SERUM CLAREADOR	5.0000	KG	1	0.00	2026-09-08 00:00:00	NORMAL	PENDIENTE_REVISION	20781650-1f04-4024-b160-eeaf427ab8b2	\N	\N	OP	\N	\N	\N	\N	\N	4cf61e66-b049-4e9a-a942-ccc5e781a6b8	2026-09-09 17:10:20.98	2026-09-09 17:10:20.98	\N
d562547b-7e21-4fed-8ee9-4e3229ea630f	OP-20260908-04	\N	FENIX G EXPRESS S.A.C.	20613316184	\N	\N	\N	\N	Contado	SERUM DE COLAGENO	5.0000	KG	1	0.00	2026-09-08 00:00:00	NORMAL	PENDIENTE_REVISION	bb3c0eee-185e-4555-865d-db3d233b795e	\N	\N	OP	\N	\N	\N	\N	\N	4cf61e66-b049-4e9a-a942-ccc5e781a6b8	2026-09-09 17:10:20.98	2026-09-09 17:10:20.98	\N
971f3e53-0a07-41fd-abf7-d7ae2f11d590	OP-20260908-05	\N	ANTONY SAUCEDO	00000000	\N	\N	\N	\N	Contado	STICK HERBEATY (BALSAMO CICATRICES)	8.0000	LT	1	0.00	2026-09-08 00:00:00	NORMAL	PENDIENTE_REVISION	e5d7f71c-93be-49ff-bd71-1d0c23958b3f	\N	\N	OP	\N	\N	\N	\N	\N	a823d8c0-4727-4f2c-b5ce-7fdd0e4fb528	2026-09-09 17:10:20.98	2026-09-09 17:10:20.98	\N
ced9e0b3-9cf8-40dc-a0f1-79a54477153d	OP-20260908-06	\N	AUSTIN SANTOS	00000000	\N	\N	\N	\N	Contado	CREMA DERMA BEE	10.0000	KG	1	0.00	2026-09-08 00:00:00	NORMAL	PENDIENTE_REVISION	74705cab-531b-484d-ac69-7915ea330150	\N	\N	OP	\N	\N	\N	\N	\N	a823d8c0-4727-4f2c-b5ce-7fdd0e4fb528	2026-09-09 17:10:20.98	2026-09-09 17:10:20.98	\N
\.


--
-- Data for Name: permisos; Type: TABLE DATA; Schema: public; Owner: -
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
-- Data for Name: proveedores; Type: TABLE DATA; Schema: public; Owner: -
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
-- Data for Name: rol_permisos; Type: TABLE DATA; Schema: public; Owner: -
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
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: -
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
-- Data for Name: solicitudes_autorizacion; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.solicitudes_autorizacion (id, solicitante_id, solicitante_email, solicitante_nombre, modulo, accion, recurso_id, recurso_nombre, motivo, estado, aprobador_email, respuesta_motivo, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: sub_almacen_sobrantes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sub_almacen_sobrantes (id, "loteOrigenId", "insumoSubproductoId", "pesoDisponible", ubicacion, estado, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: sucursales; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sucursales (id, nombre, direccion, dispositivo_id, ip, port, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: tickets_despacho; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tickets_despacho (id, "codigoTicket", "ordenProduccionId", "clienteDestino", "cantidadCajas", "estadoDespacho", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: turnos; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.turnos (id, nombre, hora_inicio, hora_fin, tolerancia_minutos, almuerzo_tope, "createdAt", "updatedAt") FROM stdin;
bbbbbbbb-0001-4000-8000-000000000001	LUNES A VIERNES	08:00	17:00	15	13:00	2026-09-08 14:34:22.203	2026-09-08 14:34:22.203
bbbbbbbb-0002-4000-8000-000000000002	SABADO	08:00	13:00	15	23:59	2026-09-08 14:34:22.203	2026-09-08 14:34:22.203
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, email, nombre, password, role, "rolId", active, "createdAt", "updatedAt") FROM stdin;
d5cef80f-62b2-4c8c-9412-a91028131a3b	administracion@grupoquimicorp.pe	Elvis Edwin Yarleque Arrunategui	$2b$10$lRBAMuScLry5EgLT5Mcs.eZ1KIK8tsi15Zm5N1GcWtMkJawajl9km	GERENTE_ADMINISTRATIVO	733876ba-e574-46f7-87fd-327545c0c8af	t	2026-09-02 14:02:11.14	2026-09-09 15:46:09.267
bfb51949-8536-4878-936d-9c34ad87f663	asistentedeadministracion@grupoquimicorp.pe	Mishelle Barrera Quispe	$2b$10$Y.JsRO3va3cu0Up/5DZe8u4oMVgfVfR07cqDpAL3XTJ41Po6cUahO	ASISTENTE_ADMINISTRATIVO	42710b15-7dbe-43ca-9302-d952ae89546c	t	2026-09-02 14:02:11.228	2026-09-09 15:46:09.345
1e2dba26-8683-4cdb-940f-83d94d467758	produccion@grupoquimicorp.pe	Supervisor de Producción	$2b$10$.McQLJ9lwMaukJ4.lU1TW.5fKm42EPdPCzyPcqgUbiNqjShRFzeey	PRODUCCION_ALMACEN	0a518c8e-fec0-41e4-90c4-15af2237c410	t	2026-09-02 14:02:11.314	2026-09-09 15:46:09.419
24076757-4260-4fa3-82a3-d4ad11694f84	gerencia@quimicorp.pe	Carlos Mendoza (Gerente General)	$2b$10$E7gf08FKaAH0slfBIY8.d.tQwoBenlGixCFDWTT7p.0.W0zePvKEC	GERENCIA	7926b010-1131-4f5b-94df-a961a1f3c4fb	t	2026-09-02 14:02:11.407	2026-09-09 15:46:09.492
7720cf48-0b1a-4760-b6ad-97cfb178415c	administracion@quimicorp.pe	Ana Torres (Admin)	$2b$10$Mnt/2XSH8qi/m9HVnt3WV.I1WTdy6WLYMmFpaRk.F8QYYezbXbrfu	GERENTE_ADMINISTRATIVO	733876ba-e574-46f7-87fd-327545c0c8af	t	2026-09-02 14:02:11.499	2026-09-09 15:46:09.565
25308d12-ee38-4e91-8053-0f55e3475c04	finanzas@quimicorp.pe	Roberto Silva (Finanzas)	$2b$10$vm9pdZ5DuQSprdc2BQmwau09C3TGtAHxcQCaflpGoc0fu3hO48zyS	FINANZAS	d8e12134-bfe1-4053-ae2e-45f262b23db1	t	2026-09-02 14:02:11.585	2026-09-09 15:46:09.637
4624ae43-6f28-44ce-bdee-04ef30c01446	ventas@quimicorp.pe	Elena Gómez (Ventas)	$2b$10$HP1z9BkXOjMKRhhRl6U0uuTGkTr0SCGlVd2K8VUys4HaHfc06zsya	VENTAS_ATENCION_DIGITAL	b86bd6d9-df19-4e7b-aa0a-4964eb64fc50	t	2026-09-02 14:02:11.675	2026-09-09 15:46:09.712
7b415210-c6d5-4e9d-94de-94178f63f545	compras@quimicorp.pe	Laura Paredes (Compras)	$2b$10$M1qahJ3tRWLI9XDHJ8JVXuaM3WVIi0Bg9ERiEcg/za15ELmSw.Ec6	COMPRAS_PROVEEDORES	dfd05f76-27b9-4283-8877-aa37da479ad0	t	2026-09-02 14:02:11.761	2026-09-09 15:46:09.785
\.


--
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.usuarios (id, dni, nombres, apellidos, "rolId", "passwordHash", "codigoBiometrico", estado, "createdAt", "updatedAt", cargo, sucursal_id, turno_id) FROM stdin;
76d2e2ff-978c-4a43-8cdb-4cb09ea7062f	70000000	SISTEMA	IMPORTACION	3a647229-d593-4bfb-a816-7a4cce2433ec	$2a$10$7EqJtq98hPqEX7fNZaFWoOhiJ5gY6eZ8qXg0b9C5vLdYlS8m4KxKq	\N	ACTIVO	2026-09-07 19:25:30.604	2026-09-07 19:25:30.604	SISTEMAS	\N	\N
aaaaaaaa-0002-4000-8000-000000000002	75447632	Miguel Angel	Roldan Gomez	0a518c8e-fec0-41e4-90c4-15af2237c410	$2b$10$GewqfNLNc0rVelW2CL8e/u4sZ4nSKaLKjWx.x4eZeNVE3APqfArLq	\N	ACTIVO	2026-09-08 14:19:39.069	2026-09-08 14:19:39.069	OPERARIO	\N	bbbbbbbb-0001-4000-8000-000000000001
aaaaaaaa-0003-4000-8000-000000000003	73634569	Edy Daniel	Leon Fernandez	0a518c8e-fec0-41e4-90c4-15af2237c410	$2b$10$GewqfNLNc0rVelW2CL8e/u4sZ4nSKaLKjWx.x4eZeNVE3APqfArLq	\N	ACTIVO	2026-09-08 14:19:39.069	2026-09-08 14:19:39.069	OPERARIO	\N	bbbbbbbb-0001-4000-8000-000000000001
aaaaaaaa-0004-4000-8000-000000000004	44541701	Lizet	Vega Cuadros	0a518c8e-fec0-41e4-90c4-15af2237c410	$2b$10$GewqfNLNc0rVelW2CL8e/u4sZ4nSKaLKjWx.x4eZeNVE3APqfArLq	\N	ACTIVO	2026-09-08 14:19:39.069	2026-09-08 14:19:39.069	OPERARIO	\N	bbbbbbbb-0001-4000-8000-000000000001
aaaaaaaa-0001-4000-8000-000000000001	72157187	Ricardo	Ayala Aldave	0a518c8e-fec0-41e4-90c4-15af2237c410	$2b$10$GewqfNLNc0rVelW2CL8e/u4sZ4nSKaLKjWx.x4eZeNVE3APqfArLq	\N	ACTIVO	2026-09-08 14:19:39.069	2026-09-08 14:36:55.387	SUPERVISOR DE PLANTA	\N	bbbbbbbb-0001-4000-8000-000000000001
\.


--
-- Data for Name: valorizacion_inventario; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.valorizacion_inventario (id, "fechaCierre", "materiaPrimaValorizada", "productoTerminadoValorizado", "createdAt") FROM stdin;
\.


--
-- Data for Name: ventanas_almuerzo_qa; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.ventanas_almuerzo_qa (id, fecha, "horaInicioAprobada", "horaFinMinima", "aprobadoPorQAId", "operariosHabilitadosIds", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: ajustes_finos ajustes_finos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ajustes_finos
    ADD CONSTRAINT ajustes_finos_pkey PRIMARY KEY (id);


--
-- Name: asistencias asistencias_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.asistencias
    ADD CONSTRAINT asistencias_pkey PRIMARY KEY (id);


--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- Name: calificaciones_operario calificaciones_operario_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.calificaciones_operario
    ADD CONSTRAINT calificaciones_operario_pkey PRIMARY KEY (id);


--
-- Name: clientes clientes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clientes
    ADD CONSTRAINT clientes_pkey PRIMARY KEY (id);


--
-- Name: cola_despacho cola_despacho_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cola_despacho
    ADD CONSTRAINT cola_despacho_pkey PRIMARY KEY (id);


--
-- Name: contacto_representantes contacto_representantes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contacto_representantes
    ADD CONSTRAINT contacto_representantes_pkey PRIMARY KEY (id);


--
-- Name: cotizaciones_proveedores cotizaciones_proveedores_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cotizaciones_proveedores
    ADD CONSTRAINT cotizaciones_proveedores_pkey PRIMARY KEY (id);


--
-- Name: cuentas_bancarias_proveedores cuentas_bancarias_proveedores_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cuentas_bancarias_proveedores
    ADD CONSTRAINT cuentas_bancarias_proveedores_pkey PRIMARY KEY (id);


--
-- Name: cuentas_cobrar cuentas_cobrar_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cuentas_cobrar
    ADD CONSTRAINT cuentas_cobrar_pkey PRIMARY KEY (id);


--
-- Name: etiquetas_impresas etiquetas_impresas_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.etiquetas_impresas
    ADD CONSTRAINT etiquetas_impresas_pkey PRIMARY KEY (id);


--
-- Name: familias_insumo familias_insumo_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.familias_insumo
    ADD CONSTRAINT familias_insumo_pkey PRIMARY KEY (id);


--
-- Name: formula_detalles formula_detalles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.formula_detalles
    ADD CONSTRAINT formula_detalles_pkey PRIMARY KEY (id);


--
-- Name: formula_variants formula_variants_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.formula_variants
    ADD CONSTRAINT formula_variants_pkey PRIMARY KEY (id);


--
-- Name: formulas_master formulas_master_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.formulas_master
    ADD CONSTRAINT formulas_master_pkey PRIMARY KEY (id);


--
-- Name: incidencias_lote incidencias_lote_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.incidencias_lote
    ADD CONSTRAINT incidencias_lote_pkey PRIMARY KEY (id);


--
-- Name: insumos insumos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.insumos
    ADD CONSTRAINT insumos_pkey PRIMARY KEY (id);


--
-- Name: kardex_inmutable kardex_inmutable_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.kardex_inmutable
    ADD CONSTRAINT kardex_inmutable_pkey PRIMARY KEY (id);


--
-- Name: kardex_movimientos kardex_movimientos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.kardex_movimientos
    ADD CONSTRAINT kardex_movimientos_pkey PRIMARY KEY (id);


--
-- Name: marcaciones_biometrico marcaciones_biometrico_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.marcaciones_biometrico
    ADD CONSTRAINT marcaciones_biometrico_pkey PRIMARY KEY (id);


--
-- Name: marcaciones_pendientes marcaciones_pendientes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.marcaciones_pendientes
    ADD CONSTRAINT marcaciones_pendientes_pkey PRIMARY KEY (id);


--
-- Name: metricas_produccion_diaria metricas_produccion_diaria_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.metricas_produccion_diaria
    ADD CONSTRAINT metricas_produccion_diaria_pkey PRIMARY KEY (id);


--
-- Name: ordenes_produccion ordenes_produccion_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ordenes_produccion
    ADD CONSTRAINT ordenes_produccion_pkey PRIMARY KEY (id);


--
-- Name: pagos_abonos pagos_abonos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pagos_abonos
    ADD CONSTRAINT pagos_abonos_pkey PRIMARY KEY (id);


--
-- Name: pedido_aditivos pedido_aditivos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pedido_aditivos
    ADD CONSTRAINT pedido_aditivos_pkey PRIMARY KEY (id);


--
-- Name: pedidos_comerciales pedidos_comerciales_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pedidos_comerciales
    ADD CONSTRAINT pedidos_comerciales_pkey PRIMARY KEY (id);


--
-- Name: permisos permisos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permisos
    ADD CONSTRAINT permisos_pkey PRIMARY KEY (id);


--
-- Name: proveedores proveedores_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.proveedores
    ADD CONSTRAINT proveedores_pkey PRIMARY KEY (id);


--
-- Name: rol_permisos rol_permisos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rol_permisos
    ADD CONSTRAINT rol_permisos_pkey PRIMARY KEY ("rolId", "permisoId");


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: solicitudes_autorizacion solicitudes_autorizacion_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.solicitudes_autorizacion
    ADD CONSTRAINT solicitudes_autorizacion_pkey PRIMARY KEY (id);


--
-- Name: sub_almacen_sobrantes sub_almacen_sobrantes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sub_almacen_sobrantes
    ADD CONSTRAINT sub_almacen_sobrantes_pkey PRIMARY KEY (id);


--
-- Name: sucursales sucursales_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sucursales
    ADD CONSTRAINT sucursales_pkey PRIMARY KEY (id);


--
-- Name: tickets_despacho tickets_despacho_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tickets_despacho
    ADD CONSTRAINT tickets_despacho_pkey PRIMARY KEY (id);


--
-- Name: turnos turnos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.turnos
    ADD CONSTRAINT turnos_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- Name: valorizacion_inventario valorizacion_inventario_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.valorizacion_inventario
    ADD CONSTRAINT valorizacion_inventario_pkey PRIMARY KEY (id);


--
-- Name: ventanas_almuerzo_qa ventanas_almuerzo_qa_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ventanas_almuerzo_qa
    ADD CONSTRAINT ventanas_almuerzo_qa_pkey PRIMARY KEY (id);


--
-- Name: ajustes_finos_ordenProduccionId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "ajustes_finos_ordenProduccionId_idx" ON public.ajustes_finos USING btree ("ordenProduccionId");


--
-- Name: asistencias_fecha_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX asistencias_fecha_idx ON public.asistencias USING btree (fecha);


--
-- Name: asistencias_turno_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX asistencias_turno_id_idx ON public.asistencias USING btree (turno_id);


--
-- Name: asistencias_usuarioId_fecha_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "asistencias_usuarioId_fecha_key" ON public.asistencias USING btree ("usuarioId", fecha);


--
-- Name: audit_logs_tablaAfectada_registroId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "audit_logs_tablaAfectada_registroId_idx" ON public.audit_logs USING btree ("tablaAfectada", "registroId");


--
-- Name: audit_logs_usuarioId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "audit_logs_usuarioId_idx" ON public.audit_logs USING btree ("usuarioId");


--
-- Name: clientes_ruc_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX clientes_ruc_idx ON public.clientes USING btree (ruc);


--
-- Name: clientes_ruc_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX clientes_ruc_key ON public.clientes USING btree (ruc);


--
-- Name: cola_despacho_estado_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX cola_despacho_estado_idx ON public.cola_despacho USING btree (estado);


--
-- Name: cola_despacho_lote_codigo_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX cola_despacho_lote_codigo_idx ON public.cola_despacho USING btree (lote_codigo);


--
-- Name: contacto_representantes_cliente_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX contacto_representantes_cliente_id_idx ON public.contacto_representantes USING btree (cliente_id);


--
-- Name: cotizaciones_proveedores_fecha_cotizacion_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX cotizaciones_proveedores_fecha_cotizacion_idx ON public.cotizaciones_proveedores USING btree (fecha_cotizacion);


--
-- Name: cotizaciones_proveedores_insumo_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX cotizaciones_proveedores_insumo_id_idx ON public.cotizaciones_proveedores USING btree (insumo_id);


--
-- Name: cotizaciones_proveedores_proveedor_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX cotizaciones_proveedores_proveedor_id_idx ON public.cotizaciones_proveedores USING btree (proveedor_id);


--
-- Name: cuentas_bancarias_proveedores_proveedor_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX cuentas_bancarias_proveedores_proveedor_id_idx ON public.cuentas_bancarias_proveedores USING btree (proveedor_id);


--
-- Name: cuentas_cobrar_cliente_ruc_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX cuentas_cobrar_cliente_ruc_idx ON public.cuentas_cobrar USING btree (cliente_ruc);


--
-- Name: cuentas_cobrar_codigo_doc_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX cuentas_cobrar_codigo_doc_key ON public.cuentas_cobrar USING btree (codigo_doc);


--
-- Name: cuentas_cobrar_estado_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX cuentas_cobrar_estado_idx ON public.cuentas_cobrar USING btree (estado);


--
-- Name: cuentas_cobrar_fecha_vencimiento_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX cuentas_cobrar_fecha_vencimiento_idx ON public.cuentas_cobrar USING btree (fecha_vencimiento);


--
-- Name: etiquetas_impresas_codigoEtiqueta_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "etiquetas_impresas_codigoEtiqueta_key" ON public.etiquetas_impresas USING btree ("codigoEtiqueta");


--
-- Name: etiquetas_impresas_loteProduccionId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "etiquetas_impresas_loteProduccionId_idx" ON public.etiquetas_impresas USING btree ("loteProduccionId");


--
-- Name: familias_insumo_nombre_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX familias_insumo_nombre_key ON public.familias_insumo USING btree (nombre);


--
-- Name: formula_detalles_formulaId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "formula_detalles_formulaId_idx" ON public.formula_detalles USING btree ("formulaId");


--
-- Name: formula_detalles_insumoId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "formula_detalles_insumoId_idx" ON public.formula_detalles USING btree ("insumoId");


--
-- Name: formula_variants_cliente_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX formula_variants_cliente_id_idx ON public.formula_variants USING btree (cliente_id);


--
-- Name: formula_variants_formula_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX formula_variants_formula_id_idx ON public.formula_variants USING btree (formula_id);


--
-- Name: formulas_master_codigoFormula_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "formulas_master_codigoFormula_key" ON public.formulas_master USING btree ("codigoFormula");


--
-- Name: formulas_master_estado_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX formulas_master_estado_idx ON public.formulas_master USING btree (estado);


--
-- Name: insumos_codigo_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX insumos_codigo_key ON public.insumos USING btree (codigo);


--
-- Name: insumos_estado_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX insumos_estado_idx ON public.insumos USING btree (estado);


--
-- Name: insumos_familiaId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "insumos_familiaId_idx" ON public.insumos USING btree ("familiaId");


--
-- Name: insumos_tipo_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX insumos_tipo_idx ON public.insumos USING btree (tipo);


--
-- Name: kardex_inmutable_createdAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "kardex_inmutable_createdAt_idx" ON public.kardex_inmutable USING btree ("createdAt");


--
-- Name: kardex_inmutable_insumoId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "kardex_inmutable_insumoId_idx" ON public.kardex_inmutable USING btree ("insumoId");


--
-- Name: kardex_inmutable_tipoMovimiento_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "kardex_inmutable_tipoMovimiento_idx" ON public.kardex_inmutable USING btree ("tipoMovimiento");


--
-- Name: kardex_movimientos_categoria_kardex_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX kardex_movimientos_categoria_kardex_idx ON public.kardex_movimientos USING btree (categoria_kardex);


--
-- Name: kardex_movimientos_fecha_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX kardex_movimientos_fecha_idx ON public.kardex_movimientos USING btree (fecha);


--
-- Name: kardex_movimientos_producto_nombre_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX kardex_movimientos_producto_nombre_idx ON public.kardex_movimientos USING btree (producto_nombre);


--
-- Name: marcaciones_biometrico_usuarioId_timestamp_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "marcaciones_biometrico_usuarioId_timestamp_idx" ON public.marcaciones_biometrico USING btree ("usuarioId", "timestamp");


--
-- Name: marcaciones_pendientes_dispositivo_id_timestamp_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX marcaciones_pendientes_dispositivo_id_timestamp_idx ON public.marcaciones_pendientes USING btree (dispositivo_id, "timestamp");


--
-- Name: marcaciones_pendientes_procesada_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX marcaciones_pendientes_procesada_idx ON public.marcaciones_pendientes USING btree (procesada);


--
-- Name: metricas_produccion_diaria_fecha_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX metricas_produccion_diaria_fecha_key ON public.metricas_produccion_diaria USING btree (fecha);


--
-- Name: ordenes_produccion_codigoLote_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "ordenes_produccion_codigoLote_key" ON public.ordenes_produccion USING btree ("codigoLote");


--
-- Name: ordenes_produccion_estado_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ordenes_produccion_estado_idx ON public.ordenes_produccion USING btree (estado);


--
-- Name: ordenes_produccion_formulaId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "ordenes_produccion_formulaId_idx" ON public.ordenes_produccion USING btree ("formulaId");


--
-- Name: ordenes_produccion_pedido_comercial_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ordenes_produccion_pedido_comercial_id_idx ON public.ordenes_produccion USING btree (pedido_comercial_id);


--
-- Name: pagos_abonos_cuenta_cobrar_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pagos_abonos_cuenta_cobrar_id_idx ON public.pagos_abonos USING btree (cuenta_cobrar_id);


--
-- Name: pedido_aditivos_insumo_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pedido_aditivos_insumo_id_idx ON public.pedido_aditivos USING btree (insumo_id);


--
-- Name: pedido_aditivos_pedido_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pedido_aditivos_pedido_id_idx ON public.pedido_aditivos USING btree (pedido_id);


--
-- Name: pedido_aditivos_tipo_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pedido_aditivos_tipo_idx ON public.pedido_aditivos USING btree (tipo);


--
-- Name: pedidos_comerciales_cliente_ruc_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pedidos_comerciales_cliente_ruc_idx ON public.pedidos_comerciales USING btree (cliente_ruc);


--
-- Name: pedidos_comerciales_codigo_orden_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX pedidos_comerciales_codigo_orden_key ON public.pedidos_comerciales USING btree (codigo_orden);


--
-- Name: pedidos_comerciales_doc_type_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pedidos_comerciales_doc_type_idx ON public.pedidos_comerciales USING btree (doc_type);


--
-- Name: pedidos_comerciales_estado_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pedidos_comerciales_estado_idx ON public.pedidos_comerciales USING btree (estado);


--
-- Name: permisos_modulo_accion_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX permisos_modulo_accion_key ON public.permisos USING btree (modulo, accion);


--
-- Name: proveedores_ruc_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX proveedores_ruc_key ON public.proveedores USING btree (ruc);


--
-- Name: roles_nombre_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX roles_nombre_key ON public.roles USING btree (nombre);


--
-- Name: sub_almacen_sobrantes_estado_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sub_almacen_sobrantes_estado_idx ON public.sub_almacen_sobrantes USING btree (estado);


--
-- Name: sucursales_dispositivo_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX sucursales_dispositivo_id_key ON public.sucursales USING btree (dispositivo_id);


--
-- Name: sucursales_nombre_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX sucursales_nombre_key ON public.sucursales USING btree (nombre);


--
-- Name: tickets_despacho_codigoTicket_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "tickets_despacho_codigoTicket_key" ON public.tickets_despacho USING btree ("codigoTicket");


--
-- Name: turnos_nombre_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX turnos_nombre_key ON public.turnos USING btree (nombre);


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: usuarios_codigoBiometrico_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "usuarios_codigoBiometrico_key" ON public.usuarios USING btree ("codigoBiometrico");


--
-- Name: usuarios_dni_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX usuarios_dni_key ON public.usuarios USING btree (dni);


--
-- Name: usuarios_rolId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "usuarios_rolId_idx" ON public.usuarios USING btree ("rolId");


--
-- Name: usuarios_sucursal_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX usuarios_sucursal_id_idx ON public.usuarios USING btree (sucursal_id);


--
-- Name: usuarios_turno_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX usuarios_turno_id_idx ON public.usuarios USING btree (turno_id);


--
-- Name: valorizacion_inventario_fechaCierre_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "valorizacion_inventario_fechaCierre_key" ON public.valorizacion_inventario USING btree ("fechaCierre");


--
-- Name: ajustes_finos ajustes_finos_insumoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ajustes_finos
    ADD CONSTRAINT "ajustes_finos_insumoId_fkey" FOREIGN KEY ("insumoId") REFERENCES public.insumos(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ajustes_finos ajustes_finos_ordenProduccionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ajustes_finos
    ADD CONSTRAINT "ajustes_finos_ordenProduccionId_fkey" FOREIGN KEY ("ordenProduccionId") REFERENCES public.ordenes_produccion(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ajustes_finos ajustes_finos_registradoPorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ajustes_finos
    ADD CONSTRAINT "ajustes_finos_registradoPorId_fkey" FOREIGN KEY ("registradoPorId") REFERENCES public.usuarios(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: asistencias asistencias_turno_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.asistencias
    ADD CONSTRAINT asistencias_turno_id_fkey FOREIGN KEY (turno_id) REFERENCES public.turnos(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: asistencias asistencias_usuarioId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.asistencias
    ADD CONSTRAINT "asistencias_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES public.usuarios(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: audit_logs audit_logs_usuarioId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT "audit_logs_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES public.usuarios(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: calificaciones_operario calificaciones_operario_ordenProduccionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.calificaciones_operario
    ADD CONSTRAINT "calificaciones_operario_ordenProduccionId_fkey" FOREIGN KEY ("ordenProduccionId") REFERENCES public.ordenes_produccion(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: calificaciones_operario calificaciones_operario_usuarioId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.calificaciones_operario
    ADD CONSTRAINT "calificaciones_operario_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES public.usuarios(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: contacto_representantes contacto_representantes_cliente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contacto_representantes
    ADD CONSTRAINT contacto_representantes_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: cotizaciones_proveedores cotizaciones_proveedores_insumo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cotizaciones_proveedores
    ADD CONSTRAINT cotizaciones_proveedores_insumo_id_fkey FOREIGN KEY (insumo_id) REFERENCES public.insumos(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: cotizaciones_proveedores cotizaciones_proveedores_proveedor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cotizaciones_proveedores
    ADD CONSTRAINT cotizaciones_proveedores_proveedor_id_fkey FOREIGN KEY (proveedor_id) REFERENCES public.proveedores(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: cuentas_bancarias_proveedores cuentas_bancarias_proveedores_proveedor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cuentas_bancarias_proveedores
    ADD CONSTRAINT cuentas_bancarias_proveedores_proveedor_id_fkey FOREIGN KEY (proveedor_id) REFERENCES public.proveedores(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: cuentas_cobrar cuentas_cobrar_cliente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cuentas_cobrar
    ADD CONSTRAINT cuentas_cobrar_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: etiquetas_impresas etiquetas_impresas_impresoPorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.etiquetas_impresas
    ADD CONSTRAINT "etiquetas_impresas_impresoPorId_fkey" FOREIGN KEY ("impresoPorId") REFERENCES public.usuarios(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: etiquetas_impresas etiquetas_impresas_loteProduccionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.etiquetas_impresas
    ADD CONSTRAINT "etiquetas_impresas_loteProduccionId_fkey" FOREIGN KEY ("loteProduccionId") REFERENCES public.ordenes_produccion(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: formula_detalles formula_detalles_formulaId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.formula_detalles
    ADD CONSTRAINT "formula_detalles_formulaId_fkey" FOREIGN KEY ("formulaId") REFERENCES public.formulas_master(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: formula_detalles formula_detalles_insumoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.formula_detalles
    ADD CONSTRAINT "formula_detalles_insumoId_fkey" FOREIGN KEY ("insumoId") REFERENCES public.insumos(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: formula_variants formula_variants_cliente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.formula_variants
    ADD CONSTRAINT formula_variants_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: formula_variants formula_variants_formula_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.formula_variants
    ADD CONSTRAINT formula_variants_formula_id_fkey FOREIGN KEY (formula_id) REFERENCES public.formulas_master(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: incidencias_lote incidencias_lote_loteProduccionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.incidencias_lote
    ADD CONSTRAINT "incidencias_lote_loteProduccionId_fkey" FOREIGN KEY ("loteProduccionId") REFERENCES public.ordenes_produccion(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: incidencias_lote incidencias_lote_reportadoPorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.incidencias_lote
    ADD CONSTRAINT "incidencias_lote_reportadoPorId_fkey" FOREIGN KEY ("reportadoPorId") REFERENCES public.usuarios(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: insumos insumos_familiaId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.insumos
    ADD CONSTRAINT "insumos_familiaId_fkey" FOREIGN KEY ("familiaId") REFERENCES public.familias_insumo(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: kardex_inmutable kardex_inmutable_insumoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.kardex_inmutable
    ADD CONSTRAINT "kardex_inmutable_insumoId_fkey" FOREIGN KEY ("insumoId") REFERENCES public.insumos(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: kardex_inmutable kardex_inmutable_usuarioId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.kardex_inmutable
    ADD CONSTRAINT "kardex_inmutable_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES public.usuarios(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: kardex_movimientos kardex_movimientos_insumo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.kardex_movimientos
    ADD CONSTRAINT kardex_movimientos_insumo_id_fkey FOREIGN KEY (insumo_id) REFERENCES public.insumos(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: kardex_movimientos kardex_movimientos_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.kardex_movimientos
    ADD CONSTRAINT kardex_movimientos_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: marcaciones_biometrico marcaciones_biometrico_usuarioId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.marcaciones_biometrico
    ADD CONSTRAINT "marcaciones_biometrico_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES public.usuarios(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ordenes_produccion ordenes_produccion_formulaId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ordenes_produccion
    ADD CONSTRAINT "ordenes_produccion_formulaId_fkey" FOREIGN KEY ("formulaId") REFERENCES public.formulas_master(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ordenes_produccion ordenes_produccion_pedido_comercial_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ordenes_produccion
    ADD CONSTRAINT ordenes_produccion_pedido_comercial_id_fkey FOREIGN KEY (pedido_comercial_id) REFERENCES public.pedidos_comerciales(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ordenes_produccion ordenes_produccion_supervisorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ordenes_produccion
    ADD CONSTRAINT "ordenes_produccion_supervisorId_fkey" FOREIGN KEY ("supervisorId") REFERENCES public.usuarios(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: pagos_abonos pagos_abonos_cuenta_cobrar_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pagos_abonos
    ADD CONSTRAINT pagos_abonos_cuenta_cobrar_id_fkey FOREIGN KEY (cuenta_cobrar_id) REFERENCES public.cuentas_cobrar(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: pedido_aditivos pedido_aditivos_insumo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pedido_aditivos
    ADD CONSTRAINT pedido_aditivos_insumo_id_fkey FOREIGN KEY (insumo_id) REFERENCES public.insumos(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: pedido_aditivos pedido_aditivos_pedido_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pedido_aditivos
    ADD CONSTRAINT pedido_aditivos_pedido_id_fkey FOREIGN KEY (pedido_id) REFERENCES public.pedidos_comerciales(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: pedidos_comerciales pedidos_comerciales_cliente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pedidos_comerciales
    ADD CONSTRAINT pedidos_comerciales_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: pedidos_comerciales pedidos_comerciales_formula_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pedidos_comerciales
    ADD CONSTRAINT pedidos_comerciales_formula_id_fkey FOREIGN KEY (formula_id) REFERENCES public.formulas_master(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: pedidos_comerciales pedidos_comerciales_variante_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pedidos_comerciales
    ADD CONSTRAINT pedidos_comerciales_variante_id_fkey FOREIGN KEY (variante_id) REFERENCES public.formula_variants(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: rol_permisos rol_permisos_permisoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rol_permisos
    ADD CONSTRAINT "rol_permisos_permisoId_fkey" FOREIGN KEY ("permisoId") REFERENCES public.permisos(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: rol_permisos rol_permisos_rolId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rol_permisos
    ADD CONSTRAINT "rol_permisos_rolId_fkey" FOREIGN KEY ("rolId") REFERENCES public.roles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: sub_almacen_sobrantes sub_almacen_sobrantes_insumoSubproductoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sub_almacen_sobrantes
    ADD CONSTRAINT "sub_almacen_sobrantes_insumoSubproductoId_fkey" FOREIGN KEY ("insumoSubproductoId") REFERENCES public.insumos(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: sub_almacen_sobrantes sub_almacen_sobrantes_loteOrigenId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sub_almacen_sobrantes
    ADD CONSTRAINT "sub_almacen_sobrantes_loteOrigenId_fkey" FOREIGN KEY ("loteOrigenId") REFERENCES public.ordenes_produccion(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: tickets_despacho tickets_despacho_ordenProduccionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tickets_despacho
    ADD CONSTRAINT "tickets_despacho_ordenProduccionId_fkey" FOREIGN KEY ("ordenProduccionId") REFERENCES public.ordenes_produccion(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: users users_rolId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_rolId_fkey" FOREIGN KEY ("rolId") REFERENCES public.roles(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: usuarios usuarios_rolId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT "usuarios_rolId_fkey" FOREIGN KEY ("rolId") REFERENCES public.roles(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: usuarios usuarios_sucursal_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_sucursal_id_fkey FOREIGN KEY (sucursal_id) REFERENCES public.sucursales(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: usuarios usuarios_turno_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_turno_id_fkey FOREIGN KEY (turno_id) REFERENCES public.turnos(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ventanas_almuerzo_qa ventanas_almuerzo_qa_aprobadoPorQAId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ventanas_almuerzo_qa
    ADD CONSTRAINT "ventanas_almuerzo_qa_aprobadoPorQAId_fkey" FOREIGN KEY ("aprobadoPorQAId") REFERENCES public.usuarios(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

\unrestrict hVwbJwhIK8vLaVM1Z7ZEgdTEHQVgXIA22cFyxeazvifZ2wMJuuclbC39LGP9DhR

