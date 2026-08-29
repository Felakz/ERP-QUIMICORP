-- AlterTable: agregar columna pasos_elaboracion (JSONB) a formulas_master
ALTER TABLE "formulas_master" ADD COLUMN "pasos_elaboracion" JSONB;
