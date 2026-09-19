CREATE TYPE "CategoriaAdicional" AS ENUM ('BALDES_HERRAMIENTAS', 'ENVASES');

CREATE TABLE "pedido_adicionales" (
    "id" TEXT NOT NULL,
    "pedido_id" TEXT NOT NULL,
    "item_index" INTEGER NOT NULL DEFAULT 0,
    "producto_nombre" TEXT NOT NULL,
    "categoria" "CategoriaAdicional" NOT NULL,
    "insumo_id" TEXT,
    "descripcion" TEXT NOT NULL,
    "unidad_medida" TEXT NOT NULL,
    "cantidad" DECIMAL(14,4) NOT NULL,
    "cantidad_despachada" DECIMAL(14,4) NOT NULL DEFAULT 0,
    "precio_unitario_venta" DECIMAL(14,4) NOT NULL,
    "costo_unitario" DECIMAL(14,4) NOT NULL DEFAULT 0,
    "subtotal" DECIMAL(14,2) NOT NULL,
    "kardex_descontado" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pedido_adicionales_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "pedido_adicionales_pedido_id_idx" ON "pedido_adicionales"("pedido_id");
CREATE INDEX "pedido_adicionales_insumo_id_idx" ON "pedido_adicionales"("insumo_id");
CREATE INDEX "pedido_adicionales_categoria_idx" ON "pedido_adicionales"("categoria");

ALTER TABLE "pedido_adicionales"
ADD CONSTRAINT "pedido_adicionales_pedido_id_fkey"
FOREIGN KEY ("pedido_id") REFERENCES "pedidos_comerciales"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "pedido_adicionales"
ADD CONSTRAINT "pedido_adicionales_insumo_id_fkey"
FOREIGN KEY ("insumo_id") REFERENCES "insumos"("id") ON DELETE SET NULL ON UPDATE CASCADE;
