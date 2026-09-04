-- AlterTable
ALTER TABLE "ordenes_produccion" ADD COLUMN "pedido_comercial_id" TEXT;

-- AddForeignKey
ALTER TABLE "ordenes_produccion" ADD CONSTRAINT "ordenes_produccion_pedido_comercial_id_fkey"
  FOREIGN KEY ("pedido_comercial_id") REFERENCES "pedidos_comerciales"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateIndex
CREATE INDEX "ordenes_produccion_pedido_comercial_id_idx" ON "ordenes_produccion"("pedido_comercial_id");
