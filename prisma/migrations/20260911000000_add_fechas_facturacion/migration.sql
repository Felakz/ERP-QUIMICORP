-- AlterTable para trazabilidad de facturación
-- 1) Fecha de entrega real (se llena al despachar) en pedidos_comerciales
ALTER TABLE "pedidos_comerciales" ADD COLUMN "fecha_entrega" TIMESTAMP(3);

-- 2) Emisor del comprobante (auditoría) en cuentas_cobrar
ALTER TABLE "cuentas_cobrar" ADD COLUMN "emitido_por" TEXT;