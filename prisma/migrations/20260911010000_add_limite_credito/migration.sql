-- AlterTable: regla de crédito por cliente (null = sin límite, sin cambio de comportamiento)
ALTER TABLE "clientes" ADD COLUMN IF NOT EXISTS "limite_credito" DECIMAL(12,2);
ALTER TABLE "clientes" ADD COLUMN IF NOT EXISTS "dias_credito_max" INTEGER;