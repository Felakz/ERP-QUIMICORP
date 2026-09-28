BEGIN;
-- AlterTable
ALTER TABLE "insumos" ADD COLUMN     "densidad_kg_l" DECIMAL(12,6),
ADD COLUMN     "fuente_densidad" TEXT,
ADD COLUMN     "unidad_stock" TEXT;

-- AlterTable
ALTER TABLE "ordenes_produccion" ADD COLUMN     "cliente_id" TEXT,
ADD COLUMN     "conciliacion_estado" TEXT,
ADD COLUMN     "densidad_kg_l" DECIMAL(12,6),
ADD COLUMN     "fuente_conversion" TEXT,
ADD COLUMN     "pedido_item_id" TEXT,
ADD COLUMN     "peso_neto_kg" DECIMAL(14,4),
ADD COLUMN     "receta_snapshot" JSONB,
ADD COLUMN     "unidad_medida" TEXT;

-- AlterTable
ALTER TABLE "kardex_movimientos" ADD COLUMN     "valoracion_pendiente" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "pedidos_comerciales" ADD COLUMN     "clave_operacion" TEXT,
ADD COLUMN     "huella_operacion" TEXT,
ADD COLUMN     "importe_validado" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "moneda" TEXT NOT NULL DEFAULT 'PEN',
ADD COLUMN     "origen_registro" TEXT;

-- CreateTable
CREATE TABLE "pedido_comercial_items" (
    "id" TEXT NOT NULL,
    "pedido_id" TEXT NOT NULL,
    "indice" INTEGER NOT NULL,
    "codigo_linea" TEXT NOT NULL,
    "producto_nombre" TEXT NOT NULL,
    "formula_id" TEXT NOT NULL,
    "variante_id" TEXT,
    "cantidad" DECIMAL(14,4) NOT NULL,
    "unidad_medida" TEXT NOT NULL,
    "precio_unitario" DECIMAL(14,4),
    "subtotal" DECIMAL(14,2),
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pedido_comercial_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pedido_comercial_items_pedido_id_indice_key" ON "pedido_comercial_items"("pedido_id", "indice");

-- CreateIndex
CREATE UNIQUE INDEX "pedido_comercial_items_pedido_id_codigo_linea_key" ON "pedido_comercial_items"("pedido_id", "codigo_linea");

-- CreateIndex
CREATE UNIQUE INDEX "pedidos_comerciales_clave_operacion_key" ON "pedidos_comerciales"("clave_operacion");

-- AddForeignKey
ALTER TABLE "ordenes_produccion" ADD CONSTRAINT "ordenes_produccion_pedido_item_id_fkey" FOREIGN KEY ("pedido_item_id") REFERENCES "pedido_comercial_items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ordenes_produccion" ADD CONSTRAINT "ordenes_produccion_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedido_comercial_items" ADD CONSTRAINT "pedido_comercial_items_pedido_id_fkey" FOREIGN KEY ("pedido_id") REFERENCES "pedidos_comerciales"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedido_comercial_items" ADD CONSTRAINT "pedido_comercial_items_formula_id_fkey" FOREIGN KEY ("formula_id") REFERENCES "formulas_master"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "insumos" ADD CONSTRAINT "insumos_unidad_stock_check" CHECK ("unidad_stock" IS NULL OR "unidad_stock" IN ('GR','ML','UN'));
ALTER TABLE "insumos" ADD CONSTRAINT "insumos_densidad_documentada_check" CHECK ("densidad_kg_l" IS NULL OR ("densidad_kg_l" > 0 AND length(trim(COALESCE("fuente_densidad", ''))) > 0));
ALTER TABLE "pedido_comercial_items" ADD CONSTRAINT "pedido_items_cantidad_unit_check" CHECK ("cantidad" > 0 AND "unidad_medida" IN ('KG','GR','LT','ML'));
ALTER TABLE "pedido_comercial_items" ADD CONSTRAINT "pedido_items_importe_check" CHECK (("precio_unitario" IS NULL OR "precio_unitario" >= 0) AND ("subtotal" IS NULL OR "subtotal" >= 0));
ALTER TABLE "ordenes_produccion" ADD CONSTRAINT "ordenes_conversion_documentada_check" CHECK (("peso_neto_kg" IS NULL OR "peso_neto_kg" > 0) AND ("densidad_kg_l" IS NULL OR "densidad_kg_l" > 0) AND (("peso_neto_kg" IS NULL AND "densidad_kg_l" IS NULL) OR length(trim(COALESCE("fuente_conversion", ''))) > 0));
COMMIT;
