-- CreateEnum
CREATE TYPE "UnidadMedida" AS ENUM ('KG', 'L', 'GR', 'UN');

-- CreateEnum
CREATE TYPE "TipoInsumo" AS ENUM ('BASE', 'FRAGANCIA', 'PIGMENTO', 'ENVASE', 'OTRO');

-- CreateEnum
CREATE TYPE "EstadoGenerico" AS ENUM ('ACTIVO', 'INACTIVO');

-- CreateEnum
CREATE TYPE "EstadoFormula" AS ENUM ('ACTIVA', 'INACTIVA', 'EN_REVISION');

-- CreateEnum
CREATE TYPE "EstadoOrdenProduccion" AS ENUM ('PENDIENTE', 'EN_PROCESO', 'QA_PENDIENTE', 'APROBADO', 'EN_ETIQUETADO', 'ETIQUETADO', 'RECHAZADO');

-- CreateEnum
CREATE TYPE "TipoMovimientoKardex" AS ENUM ('ENTRADA', 'SALIDA', 'AJUSTE_FINO', 'MERMA', 'REAPROVECHAMIENTO');

-- CreateEnum
CREATE TYPE "CategoriaKardex" AS ENUM ('PRODUCTO_TERMINADO', 'MATERIA_PRIMA', 'INSUMO', 'ENVASE', 'EMBALAJE');

-- CreateEnum
CREATE TYPE "TipoMovimiento" AS ENUM ('ENTRADA_COMPRA', 'ENTRADA_PRODUCCION', 'ENTRADA_AJUSTE', 'SALIDA_VENTA', 'SALIDA_CONSUMO_PRODUCCION', 'SALIDA_MERMA');

-- CreateEnum
CREATE TYPE "EstadoSubAlmacen" AS ENUM ('DISPONIBLE', 'REUSADO', 'DESCARTADO');

-- CreateEnum
CREATE TYPE "TipoMarcacion" AS ENUM ('ENTRADA', 'SALIDA_ALMUERZO', 'RETORNO_ALMUERZO', 'SALIDA');

-- CreateEnum
CREATE TYPE "EstadoAsistencia" AS ENUM ('PUNTUAL', 'TARDANZA', 'FALTA', 'JUSTIFICADO');

-- CreateEnum
CREATE TYPE "TipoEtiqueta" AS ENUM ('INSUMO', 'GALON', 'BARRIL', 'FRASCO');

-- CreateEnum
CREATE TYPE "EstadoDespacho" AS ENUM ('PENDIENTE', 'EN_RUTA', 'ENTREGADO', 'DEVUELTO');

-- CreateEnum
CREATE TYPE "AccionPermiso" AS ENUM ('CREATE', 'READ', 'UPDATE', 'DELETE');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('GERENCIA', 'ADMINISTRACION', 'GERENTE_ADMINISTRATIVO', 'ASISTENTE_ADMINISTRATIVO', 'FINANZAS', 'VENTAS_ATENCION_DIGITAL', 'ECOMMERCE_MARKETING', 'PRODUCCION_ALMACEN', 'COMPRAS_PROVEEDORES', 'RECURSOS_HUMANOS', 'SISTEMAS_TI', 'DISENO_MULTIMEDIA', 'ARCHIVO_HISTORICO');

-- CreateEnum
CREATE TYPE "EstadoPedidoComercial" AS ENUM ('NUEVO', 'PENDIENTE_REVISION', 'VALIDANDO', 'APROBADO', 'EN_PRODUCCION', 'DEVUELTO', 'RECHAZADO');

-- CreateEnum
CREATE TYPE "PrioridadPedidoComercial" AS ENUM ('URGENTE', 'NORMAL', 'PROGRAMADO');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'PRODUCCION_ALMACEN',
    "rolId" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "solicitudes_autorizacion" (
    "id" TEXT NOT NULL,
    "solicitante_id" TEXT NOT NULL,
    "solicitante_email" TEXT NOT NULL,
    "solicitante_nombre" TEXT NOT NULL,
    "modulo" TEXT NOT NULL,
    "accion" TEXT NOT NULL,
    "recurso_id" TEXT,
    "recurso_nombre" TEXT,
    "motivo" TEXT,
    "estado" TEXT NOT NULL DEFAULT 'PENDIENTE',
    "aprobador_email" TEXT,
    "respuesta_motivo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "solicitudes_autorizacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "familias_insumo" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "familias_insumo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "insumos" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "familiaId" TEXT NOT NULL,
    "unidadMedida" "UnidadMedida" NOT NULL,
    "unidadMedidaVisual" TEXT,
    "categoria" TEXT,
    "proveedorHistorico" TEXT,
    "stockTeorico" DECIMAL(14,4) NOT NULL DEFAULT 0,
    "stockReal" DECIMAL(14,4) NOT NULL DEFAULT 0,
    "stockMinimo" DECIMAL(14,4) NOT NULL DEFAULT 0,
    "costoUnitario" DECIMAL(14,4) NOT NULL DEFAULT 0,
    "estado" "EstadoGenerico" NOT NULL DEFAULT 'ACTIVO',
    "tipo" "TipoInsumo" DEFAULT 'OTRO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "insumos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "formulas_master" (
    "id" TEXT NOT NULL,
    "codigoFormula" TEXT NOT NULL,
    "nombreProducto" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "densidadTeorica" DECIMAL(10,4) NOT NULL,
    "estado" "EstadoFormula" NOT NULL DEFAULT 'EN_REVISION',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "formulas_master_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "formula_detalles" (
    "id" TEXT NOT NULL,
    "formulaId" TEXT NOT NULL,
    "insumoId" TEXT,
    "nombreComponente" TEXT,
    "skuComponente" TEXT,
    "porcentaje" DECIMAL(6,3) NOT NULL,
    "pesoMasaTeorico" DECIMAL(14,4) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "formula_detalles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ordenes_produccion" (
    "id" TEXT NOT NULL,
    "codigoLote" TEXT NOT NULL,
    "clienteNombre" TEXT DEFAULT 'Cliente Quimicorp SAC',
    "operariosAsignados" TEXT,
    "colorEspecificado" TEXT,
    "fraganciaEspecificada" TEXT,
    "prioridad" TEXT DEFAULT 'NORMAL',
    "observacionesQA" TEXT,
    "motivoRechazo" TEXT,
    "pasoProceso" TEXT DEFAULT 'PENDIENTE_ASIGNACION',
    "formulaId" TEXT NOT NULL,
    "cantidadPlanificada" DECIMAL(14,4) NOT NULL,
    "cantidadObtenida" DECIMAL(14,4),
    "mermaCalculada" DECIMAL(14,4),
    "estado" "EstadoOrdenProduccion" NOT NULL DEFAULT 'PENDIENTE',
    "supervisorId" TEXT NOT NULL,
    "fechaCierre" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ordenes_produccion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ajustes_finos" (
    "id" TEXT NOT NULL,
    "ordenProduccionId" TEXT NOT NULL,
    "insumoId" TEXT NOT NULL,
    "cantidadAgregada" DECIMAL(14,4) NOT NULL,
    "observacion" TEXT,
    "registradoPorId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ajustes_finos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sub_almacen_sobrantes" (
    "id" TEXT NOT NULL,
    "loteOrigenId" TEXT NOT NULL,
    "insumoSubproductoId" TEXT NOT NULL,
    "pesoDisponible" DECIMAL(14,4) NOT NULL,
    "ubicacion" TEXT NOT NULL,
    "estado" "EstadoSubAlmacen" NOT NULL DEFAULT 'DISPONIBLE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sub_almacen_sobrantes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kardex_inmutable" (
    "id" TEXT NOT NULL,
    "insumoId" TEXT NOT NULL,
    "tipoMovimiento" "TipoMovimientoKardex" NOT NULL,
    "cantidad" DECIMAL(14,4) NOT NULL,
    "stockAnterior" DECIMAL(14,4) NOT NULL,
    "stockNuevo" DECIMAL(14,4) NOT NULL,
    "documentoReferencia" TEXT,
    "usuarioId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "kardex_inmutable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kardex_movimientos" (
    "id" TEXT NOT NULL,
    "categoria_kardex" "CategoriaKardex" NOT NULL,
    "producto_nombre" TEXT NOT NULL,
    "familia" TEXT,
    "categoria_nombre" TEXT,
    "proveedor_cliente" TEXT,
    "unidad_medida" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tipo_doc" TEXT,
    "serie" TEXT,
    "numero" TEXT,
    "otp" TEXT,
    "tipo_operacion" "TipoMovimiento" NOT NULL,
    "cantidad_entrada" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "cantidad_salida" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "saldo_final" DOUBLE PRECISION NOT NULL,
    "costo_unitario" DOUBLE PRECISION DEFAULT 0,
    "monto_entrada_pen" DOUBLE PRECISION DEFAULT 0,
    "monto_salida_pen" DOUBLE PRECISION DEFAULT 0,
    "monto_saldo_pen" DOUBLE PRECISION DEFAULT 0,
    "insumo_id" TEXT,
    "usuario_id" TEXT,
    "sede_id" TEXT DEFAULT 'SEDE-LIMA',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "kardex_movimientos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "dni" TEXT NOT NULL,
    "nombres" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "rolId" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "codigoBiometrico" TEXT,
    "estado" "EstadoGenerico" NOT NULL DEFAULT 'ACTIVO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marcaciones_biometrico" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "tipoMarcacion" "TipoMarcacion" NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dispositivoId" TEXT NOT NULL,

    CONSTRAINT "marcaciones_biometrico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asistencias" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "fecha" DATE NOT NULL,
    "horasTrabajadas" DECIMAL(5,2) NOT NULL,
    "minutosTardanza" INTEGER NOT NULL DEFAULT 0,
    "estadoAsistencia" "EstadoAsistencia" NOT NULL DEFAULT 'PUNTUAL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "asistencias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ventanas_almuerzo_qa" (
    "id" TEXT NOT NULL,
    "fecha" DATE NOT NULL,
    "horaInicioAprobada" TIMESTAMP(3) NOT NULL,
    "horaFinMinima" TIMESTAMP(3) NOT NULL,
    "aprobadoPorQAId" TEXT NOT NULL,
    "operariosHabilitadosIds" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ventanas_almuerzo_qa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "calificaciones_operario" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "ordenProduccionId" TEXT NOT NULL,
    "puntajeEficiencia" DECIMAL(5,2) NOT NULL,
    "comentarios" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "calificaciones_operario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "etiquetas_impresas" (
    "id" TEXT NOT NULL,
    "codigoEtiqueta" TEXT NOT NULL,
    "loteProduccionId" TEXT NOT NULL,
    "tipoEtiqueta" "TipoEtiqueta" NOT NULL,
    "impresoPorId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "etiquetas_impresas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tickets_despacho" (
    "id" TEXT NOT NULL,
    "codigoTicket" TEXT NOT NULL,
    "ordenProduccionId" TEXT NOT NULL,
    "clienteDestino" TEXT NOT NULL,
    "cantidadCajas" INTEGER NOT NULL,
    "estadoDespacho" "EstadoDespacho" NOT NULL DEFAULT 'PENDIENTE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tickets_despacho_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cola_despacho" (
    "id" TEXT NOT NULL,
    "lote_codigo" TEXT NOT NULL,
    "producto_nombre" TEXT NOT NULL,
    "cliente_nombre" TEXT NOT NULL,
    "cantidad" TEXT NOT NULL,
    "fecha_fabricacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "codigo_qr" TEXT NOT NULL,
    "codigo_barras" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'LISTO_PARA_IMPRIMIR',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cola_despacho_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "incidencias_lote" (
    "id" TEXT NOT NULL,
    "loteProduccionId" TEXT NOT NULL,
    "reportadoPorId" TEXT NOT NULL,
    "tipoIncidencia" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "impactoMerma" DECIMAL(14,4),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "incidencias_lote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "metricas_produccion_diaria" (
    "id" TEXT NOT NULL,
    "fecha" DATE NOT NULL,
    "volumenTotalLitros" DECIMAL(14,4) NOT NULL,
    "mermaTotalKg" DECIMAL(14,4) NOT NULL,
    "eficienciaPromedio" DECIMAL(5,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "metricas_produccion_diaria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "valorizacion_inventario" (
    "id" TEXT NOT NULL,
    "fechaCierre" DATE NOT NULL,
    "materiaPrimaValorizada" DECIMAL(16,4) NOT NULL,
    "productoTerminadoValorizado" DECIMAL(16,4) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "valorizacion_inventario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permisos" (
    "id" TEXT NOT NULL,
    "modulo" TEXT NOT NULL,
    "accion" "AccionPermiso" NOT NULL,

    CONSTRAINT "permisos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rol_permisos" (
    "rolId" TEXT NOT NULL,
    "permisoId" TEXT NOT NULL,

    CONSTRAINT "rol_permisos_pkey" PRIMARY KEY ("rolId","permisoId")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "accion" TEXT NOT NULL,
    "tablaAfectada" TEXT NOT NULL,
    "registroId" TEXT NOT NULL,
    "datosAnteriores" JSONB,
    "datosNuevos" JSONB,
    "ipOrigen" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pedidos_comerciales" (
    "id" TEXT NOT NULL,
    "codigo_orden" TEXT NOT NULL,
    "codigo_ref_admin" TEXT,
    "cliente_nombre" TEXT NOT NULL,
    "cliente_ruc" TEXT NOT NULL,
    "contacto_nombre" TEXT,
    "contacto_telefono" TEXT,
    "direccion_despacho" TEXT,
    "rep_comercial" TEXT,
    "condicion_pago" TEXT,
    "producto_nombre" TEXT NOT NULL,
    "cantidad_solicitada" DECIMAL(14,4) NOT NULL,
    "unidad_medida" TEXT NOT NULL DEFAULT 'KG',
    "lotes_requeridos" INTEGER NOT NULL DEFAULT 1,
    "monto_total" DECIMAL(14,2) NOT NULL,
    "fecha_prometida" TIMESTAMP(3) NOT NULL,
    "prioridad" "PrioridadPedidoComercial" NOT NULL DEFAULT 'NORMAL',
    "estado" "EstadoPedidoComercial" NOT NULL DEFAULT 'NUEVO',
    "formula_id" TEXT,
    "notas_admin" TEXT,
    "motivo_devolucion" TEXT,
    "doc_type" TEXT DEFAULT 'OP',
    "aroma" TEXT,
    "color" TEXT,
    "aroma_text" TEXT,
    "color_text" TEXT,
    "variante_id" TEXT,
    "cliente_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pedidos_comerciales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pedido_aditivos" (
    "id" TEXT NOT NULL,
    "pedido_id" TEXT NOT NULL,
    "insumo_id" TEXT NOT NULL,
    "tipo" "TipoInsumo" NOT NULL,
    "porcentaje" DECIMAL(5,2) NOT NULL DEFAULT 1.00,
    "gramos_calculados" DECIMAL(14,4),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pedido_aditivos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clientes" (
    "id" TEXT NOT NULL,
    "razonSocial" TEXT NOT NULL,
    "ruc" TEXT NOT NULL,
    "telefono" TEXT,
    "direccion" TEXT,
    "contacto" TEXT,
    "metodoEnvio" TEXT,
    "condicionPago" TEXT DEFAULT 'Contado',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contacto_representantes" (
    "id" TEXT NOT NULL,
    "cliente_id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "cargo" TEXT,
    "telefono" TEXT,
    "email" TEXT,
    "es_principal" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contacto_representantes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "formula_variants" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "formula_id" TEXT NOT NULL,
    "cliente_id" TEXT,
    "nombre_marca" TEXT,
    "aroma" TEXT,
    "color" TEXT,
    "ph_objetivo" DOUBLE PRECISION,
    "viscosidad" TEXT,
    "instrucciones" TEXT,
    "notas" TEXT,
    "ajustes_json" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "formula_variants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proveedores" (
    "id" TEXT NOT NULL,
    "ruc" TEXT NOT NULL,
    "razon_social" TEXT NOT NULL,
    "contacto" TEXT,
    "telefono" TEXT,
    "correo" TEXT,
    "direccion" TEXT,
    "insumo_principal" TEXT,
    "calificacion" DOUBLE PRECISION NOT NULL DEFAULT 5.0,
    "estado" TEXT NOT NULL DEFAULT 'HOMOLOGADO',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "proveedores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cuentas_bancarias_proveedores" (
    "id" TEXT NOT NULL,
    "proveedor_id" TEXT NOT NULL,
    "banco" TEXT NOT NULL,
    "moneda" TEXT NOT NULL DEFAULT 'SOLES',
    "numero_cuenta" TEXT NOT NULL,
    "cci" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cuentas_bancarias_proveedores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cotizaciones_proveedores" (
    "id" TEXT NOT NULL,
    "proveedor_id" TEXT NOT NULL,
    "insumo_id" TEXT NOT NULL,
    "precio_unitario" DECIMAL(14,4) NOT NULL,
    "moneda" TEXT NOT NULL DEFAULT 'SOLES',
    "unidad_medida" TEXT NOT NULL DEFAULT 'KG',
    "num_cotizacion" TEXT,
    "fecha_cotizacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "variacion_porcentual" DECIMAL(8,2),
    "observaciones" TEXT,
    "estado" TEXT NOT NULL DEFAULT 'VIGENTE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cotizaciones_proveedores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cuentas_cobrar" (
    "id" TEXT NOT NULL,
    "codigo_doc" TEXT NOT NULL,
    "cliente_id" TEXT,
    "cliente_nombre" TEXT NOT NULL,
    "cliente_ruc" TEXT NOT NULL,
    "pedido_id" TEXT,
    "orden_prod" TEXT,
    "producto" TEXT,
    "monto_total" DECIMAL(14,2) NOT NULL,
    "saldo_pendiente" DECIMAL(14,2) NOT NULL,
    "condicion_pago" TEXT NOT NULL DEFAULT 'Contado',
    "dias_plazo" INTEGER NOT NULL DEFAULT 0,
    "fecha_emision" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_vencimiento" TIMESTAMP(3) NOT NULL,
    "fecha_pago" TIMESTAMP(3),
    "estado" TEXT NOT NULL DEFAULT 'PENDIENTE',
    "medio_pago" TEXT,
    "canal_banco" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cuentas_cobrar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pagos_abonos" (
    "id" TEXT NOT NULL,
    "cuenta_cobrar_id" TEXT NOT NULL,
    "monto_abonado" DECIMAL(14,2) NOT NULL,
    "fecha_abono" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "medio" TEXT,
    "banco" TEXT,
    "num_operacion" TEXT,
    "observaciones" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pagos_abonos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "familias_insumo_nombre_key" ON "familias_insumo"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "insumos_codigo_key" ON "insumos"("codigo");

-- CreateIndex
CREATE INDEX "insumos_familiaId_idx" ON "insumos"("familiaId");

-- CreateIndex
CREATE INDEX "insumos_estado_idx" ON "insumos"("estado");

-- CreateIndex
CREATE INDEX "insumos_tipo_idx" ON "insumos"("tipo");

-- CreateIndex
CREATE UNIQUE INDEX "formulas_master_codigoFormula_key" ON "formulas_master"("codigoFormula");

-- CreateIndex
CREATE INDEX "formulas_master_estado_idx" ON "formulas_master"("estado");

-- CreateIndex
CREATE INDEX "formula_detalles_formulaId_idx" ON "formula_detalles"("formulaId");

-- CreateIndex
CREATE INDEX "formula_detalles_insumoId_idx" ON "formula_detalles"("insumoId");

-- CreateIndex
CREATE UNIQUE INDEX "ordenes_produccion_codigoLote_key" ON "ordenes_produccion"("codigoLote");

-- CreateIndex
CREATE INDEX "ordenes_produccion_estado_idx" ON "ordenes_produccion"("estado");

-- CreateIndex
CREATE INDEX "ordenes_produccion_formulaId_idx" ON "ordenes_produccion"("formulaId");

-- CreateIndex
CREATE INDEX "ajustes_finos_ordenProduccionId_idx" ON "ajustes_finos"("ordenProduccionId");

-- CreateIndex
CREATE INDEX "sub_almacen_sobrantes_estado_idx" ON "sub_almacen_sobrantes"("estado");

-- CreateIndex
CREATE INDEX "kardex_inmutable_insumoId_idx" ON "kardex_inmutable"("insumoId");

-- CreateIndex
CREATE INDEX "kardex_inmutable_tipoMovimiento_idx" ON "kardex_inmutable"("tipoMovimiento");

-- CreateIndex
CREATE INDEX "kardex_inmutable_createdAt_idx" ON "kardex_inmutable"("createdAt");

-- CreateIndex
CREATE INDEX "kardex_movimientos_categoria_kardex_idx" ON "kardex_movimientos"("categoria_kardex");

-- CreateIndex
CREATE INDEX "kardex_movimientos_producto_nombre_idx" ON "kardex_movimientos"("producto_nombre");

-- CreateIndex
CREATE INDEX "kardex_movimientos_fecha_idx" ON "kardex_movimientos"("fecha");

-- CreateIndex
CREATE UNIQUE INDEX "roles_nombre_key" ON "roles"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_dni_key" ON "usuarios"("dni");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_codigoBiometrico_key" ON "usuarios"("codigoBiometrico");

-- CreateIndex
CREATE INDEX "usuarios_rolId_idx" ON "usuarios"("rolId");

-- CreateIndex
CREATE INDEX "marcaciones_biometrico_usuarioId_timestamp_idx" ON "marcaciones_biometrico"("usuarioId", "timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "asistencias_usuarioId_fecha_key" ON "asistencias"("usuarioId", "fecha");

-- CreateIndex
CREATE UNIQUE INDEX "etiquetas_impresas_codigoEtiqueta_key" ON "etiquetas_impresas"("codigoEtiqueta");

-- CreateIndex
CREATE INDEX "etiquetas_impresas_loteProduccionId_idx" ON "etiquetas_impresas"("loteProduccionId");

-- CreateIndex
CREATE UNIQUE INDEX "tickets_despacho_codigoTicket_key" ON "tickets_despacho"("codigoTicket");

-- CreateIndex
CREATE INDEX "cola_despacho_lote_codigo_idx" ON "cola_despacho"("lote_codigo");

-- CreateIndex
CREATE INDEX "cola_despacho_estado_idx" ON "cola_despacho"("estado");

-- CreateIndex
CREATE UNIQUE INDEX "metricas_produccion_diaria_fecha_key" ON "metricas_produccion_diaria"("fecha");

-- CreateIndex
CREATE UNIQUE INDEX "valorizacion_inventario_fechaCierre_key" ON "valorizacion_inventario"("fechaCierre");

-- CreateIndex
CREATE UNIQUE INDEX "permisos_modulo_accion_key" ON "permisos"("modulo", "accion");

-- CreateIndex
CREATE INDEX "audit_logs_tablaAfectada_registroId_idx" ON "audit_logs"("tablaAfectada", "registroId");

-- CreateIndex
CREATE INDEX "audit_logs_usuarioId_idx" ON "audit_logs"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "pedidos_comerciales_codigo_orden_key" ON "pedidos_comerciales"("codigo_orden");

-- CreateIndex
CREATE INDEX "pedidos_comerciales_estado_idx" ON "pedidos_comerciales"("estado");

-- CreateIndex
CREATE INDEX "pedidos_comerciales_cliente_ruc_idx" ON "pedidos_comerciales"("cliente_ruc");

-- CreateIndex
CREATE INDEX "pedidos_comerciales_doc_type_idx" ON "pedidos_comerciales"("doc_type");

-- CreateIndex
CREATE INDEX "pedido_aditivos_pedido_id_idx" ON "pedido_aditivos"("pedido_id");

-- CreateIndex
CREATE INDEX "pedido_aditivos_insumo_id_idx" ON "pedido_aditivos"("insumo_id");

-- CreateIndex
CREATE INDEX "pedido_aditivos_tipo_idx" ON "pedido_aditivos"("tipo");

-- CreateIndex
CREATE UNIQUE INDEX "clientes_ruc_key" ON "clientes"("ruc");

-- CreateIndex
CREATE INDEX "clientes_ruc_idx" ON "clientes"("ruc");

-- CreateIndex
CREATE INDEX "contacto_representantes_cliente_id_idx" ON "contacto_representantes"("cliente_id");

-- CreateIndex
CREATE INDEX "formula_variants_formula_id_idx" ON "formula_variants"("formula_id");

-- CreateIndex
CREATE INDEX "formula_variants_cliente_id_idx" ON "formula_variants"("cliente_id");

-- CreateIndex
CREATE UNIQUE INDEX "proveedores_ruc_key" ON "proveedores"("ruc");

-- CreateIndex
CREATE INDEX "cuentas_bancarias_proveedores_proveedor_id_idx" ON "cuentas_bancarias_proveedores"("proveedor_id");

-- CreateIndex
CREATE INDEX "cotizaciones_proveedores_proveedor_id_idx" ON "cotizaciones_proveedores"("proveedor_id");

-- CreateIndex
CREATE INDEX "cotizaciones_proveedores_insumo_id_idx" ON "cotizaciones_proveedores"("insumo_id");

-- CreateIndex
CREATE INDEX "cotizaciones_proveedores_fecha_cotizacion_idx" ON "cotizaciones_proveedores"("fecha_cotizacion");

-- CreateIndex
CREATE UNIQUE INDEX "cuentas_cobrar_codigo_doc_key" ON "cuentas_cobrar"("codigo_doc");

-- CreateIndex
CREATE INDEX "cuentas_cobrar_cliente_ruc_idx" ON "cuentas_cobrar"("cliente_ruc");

-- CreateIndex
CREATE INDEX "cuentas_cobrar_estado_idx" ON "cuentas_cobrar"("estado");

-- CreateIndex
CREATE INDEX "cuentas_cobrar_fecha_vencimiento_idx" ON "cuentas_cobrar"("fecha_vencimiento");

-- CreateIndex
CREATE INDEX "pagos_abonos_cuenta_cobrar_id_idx" ON "pagos_abonos"("cuenta_cobrar_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_rolId_fkey" FOREIGN KEY ("rolId") REFERENCES "roles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "insumos" ADD CONSTRAINT "insumos_familiaId_fkey" FOREIGN KEY ("familiaId") REFERENCES "familias_insumo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formula_detalles" ADD CONSTRAINT "formula_detalles_formulaId_fkey" FOREIGN KEY ("formulaId") REFERENCES "formulas_master"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formula_detalles" ADD CONSTRAINT "formula_detalles_insumoId_fkey" FOREIGN KEY ("insumoId") REFERENCES "insumos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ordenes_produccion" ADD CONSTRAINT "ordenes_produccion_formulaId_fkey" FOREIGN KEY ("formulaId") REFERENCES "formulas_master"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ordenes_produccion" ADD CONSTRAINT "ordenes_produccion_supervisorId_fkey" FOREIGN KEY ("supervisorId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ajustes_finos" ADD CONSTRAINT "ajustes_finos_ordenProduccionId_fkey" FOREIGN KEY ("ordenProduccionId") REFERENCES "ordenes_produccion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ajustes_finos" ADD CONSTRAINT "ajustes_finos_insumoId_fkey" FOREIGN KEY ("insumoId") REFERENCES "insumos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ajustes_finos" ADD CONSTRAINT "ajustes_finos_registradoPorId_fkey" FOREIGN KEY ("registradoPorId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sub_almacen_sobrantes" ADD CONSTRAINT "sub_almacen_sobrantes_loteOrigenId_fkey" FOREIGN KEY ("loteOrigenId") REFERENCES "ordenes_produccion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sub_almacen_sobrantes" ADD CONSTRAINT "sub_almacen_sobrantes_insumoSubproductoId_fkey" FOREIGN KEY ("insumoSubproductoId") REFERENCES "insumos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kardex_inmutable" ADD CONSTRAINT "kardex_inmutable_insumoId_fkey" FOREIGN KEY ("insumoId") REFERENCES "insumos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kardex_inmutable" ADD CONSTRAINT "kardex_inmutable_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kardex_movimientos" ADD CONSTRAINT "kardex_movimientos_insumo_id_fkey" FOREIGN KEY ("insumo_id") REFERENCES "insumos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kardex_movimientos" ADD CONSTRAINT "kardex_movimientos_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_rolId_fkey" FOREIGN KEY ("rolId") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marcaciones_biometrico" ADD CONSTRAINT "marcaciones_biometrico_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asistencias" ADD CONSTRAINT "asistencias_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ventanas_almuerzo_qa" ADD CONSTRAINT "ventanas_almuerzo_qa_aprobadoPorQAId_fkey" FOREIGN KEY ("aprobadoPorQAId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calificaciones_operario" ADD CONSTRAINT "calificaciones_operario_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calificaciones_operario" ADD CONSTRAINT "calificaciones_operario_ordenProduccionId_fkey" FOREIGN KEY ("ordenProduccionId") REFERENCES "ordenes_produccion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "etiquetas_impresas" ADD CONSTRAINT "etiquetas_impresas_loteProduccionId_fkey" FOREIGN KEY ("loteProduccionId") REFERENCES "ordenes_produccion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "etiquetas_impresas" ADD CONSTRAINT "etiquetas_impresas_impresoPorId_fkey" FOREIGN KEY ("impresoPorId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets_despacho" ADD CONSTRAINT "tickets_despacho_ordenProduccionId_fkey" FOREIGN KEY ("ordenProduccionId") REFERENCES "ordenes_produccion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incidencias_lote" ADD CONSTRAINT "incidencias_lote_loteProduccionId_fkey" FOREIGN KEY ("loteProduccionId") REFERENCES "ordenes_produccion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incidencias_lote" ADD CONSTRAINT "incidencias_lote_reportadoPorId_fkey" FOREIGN KEY ("reportadoPorId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rol_permisos" ADD CONSTRAINT "rol_permisos_rolId_fkey" FOREIGN KEY ("rolId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rol_permisos" ADD CONSTRAINT "rol_permisos_permisoId_fkey" FOREIGN KEY ("permisoId") REFERENCES "permisos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedidos_comerciales" ADD CONSTRAINT "pedidos_comerciales_formula_id_fkey" FOREIGN KEY ("formula_id") REFERENCES "formulas_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedidos_comerciales" ADD CONSTRAINT "pedidos_comerciales_variante_id_fkey" FOREIGN KEY ("variante_id") REFERENCES "formula_variants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedidos_comerciales" ADD CONSTRAINT "pedidos_comerciales_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedido_aditivos" ADD CONSTRAINT "pedido_aditivos_pedido_id_fkey" FOREIGN KEY ("pedido_id") REFERENCES "pedidos_comerciales"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedido_aditivos" ADD CONSTRAINT "pedido_aditivos_insumo_id_fkey" FOREIGN KEY ("insumo_id") REFERENCES "insumos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contacto_representantes" ADD CONSTRAINT "contacto_representantes_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formula_variants" ADD CONSTRAINT "formula_variants_formula_id_fkey" FOREIGN KEY ("formula_id") REFERENCES "formulas_master"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formula_variants" ADD CONSTRAINT "formula_variants_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cuentas_bancarias_proveedores" ADD CONSTRAINT "cuentas_bancarias_proveedores_proveedor_id_fkey" FOREIGN KEY ("proveedor_id") REFERENCES "proveedores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cotizaciones_proveedores" ADD CONSTRAINT "cotizaciones_proveedores_proveedor_id_fkey" FOREIGN KEY ("proveedor_id") REFERENCES "proveedores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cotizaciones_proveedores" ADD CONSTRAINT "cotizaciones_proveedores_insumo_id_fkey" FOREIGN KEY ("insumo_id") REFERENCES "insumos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cuentas_cobrar" ADD CONSTRAINT "cuentas_cobrar_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagos_abonos" ADD CONSTRAINT "pagos_abonos_cuenta_cobrar_id_fkey" FOREIGN KEY ("cuenta_cobrar_id") REFERENCES "cuentas_cobrar"("id") ON DELETE CASCADE ON UPDATE CASCADE;

