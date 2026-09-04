-- AlterTable: cols regulatorias para etiquetas legales (FET-02)
ALTER TABLE "cola_despacho" ADD COLUMN "ruc"               TEXT;
ALTER TABLE "cola_despacho" ADD COLUMN "sku"               TEXT;
ALTER TABLE "cola_despacho" ADD COLUMN "advertencia_ghs"   TEXT;
ALTER TABLE "cola_despacho" ADD COLUMN "codigo_ghs"        TEXT;
ALTER TABLE "cola_despacho" ADD COLUMN "tipo_peligro"      TEXT;
ALTER TABLE "cola_despacho" ADD COLUMN "tipo_envase"       TEXT;
ALTER TABLE "cola_despacho" ADD COLUMN "tara_gramos"       INTEGER;
