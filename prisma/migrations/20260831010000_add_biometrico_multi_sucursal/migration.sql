-- CreateTable
CREATE TABLE "sucursales" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "direccion" TEXT,
    "dispositivo_id" TEXT,
    "ip" TEXT,
    "port" INTEGER NOT NULL DEFAULT 4370,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sucursales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "turnos" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "hora_inicio" TEXT NOT NULL,
    "hora_fin" TEXT NOT NULL,
    "tolerancia_minutos" INTEGER NOT NULL DEFAULT 15,
    "almuerzo_tope" TEXT NOT NULL DEFAULT '14:00',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "turnos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marcaciones_pendientes" (
    "id" TEXT NOT NULL,
    "dispositivo_id" TEXT NOT NULL,
    "codigo_biometrico" TEXT NOT NULL,
    "tipo_marcacion" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "procesada" BOOLEAN NOT NULL DEFAULT false,
    "vinculado_a_id" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "marcaciones_pendientes_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "usuarios" ADD COLUMN "cargo" TEXT;
ALTER TABLE "usuarios" ADD COLUMN "sucursal_id" TEXT;
ALTER TABLE "usuarios" ADD COLUMN "turno_id" TEXT;

-- AlterTable
ALTER TABLE "asistencias" ADD COLUMN "turno_id" TEXT;
ALTER TABLE "asistencias" ADD COLUMN "hora_entrada" TEXT;
ALTER TABLE "asistencias" ADD COLUMN "hora_salida" TEXT;
ALTER TABLE "asistencias" ADD COLUMN "estado_almuerzo" TEXT NOT NULL DEFAULT 'PENDIENTE';

-- CreateIndex
CREATE UNIQUE INDEX "sucursales_nombre_key" ON "sucursales"("nombre");
CREATE UNIQUE INDEX "sucursales_dispositivo_id_key" ON "sucursales"("dispositivo_id");
CREATE UNIQUE INDEX "turnos_nombre_key" ON "turnos"("nombre");

CREATE INDEX "usuarios_sucursal_id_idx" ON "usuarios"("sucursal_id");
CREATE INDEX "usuarios_turno_id_idx" ON "usuarios"("turno_id");

CREATE INDEX "asistencias_fecha_idx" ON "asistencias"("fecha");
CREATE INDEX "asistencias_turno_id_idx" ON "asistencias"("turno_id");

CREATE INDEX "marcaciones_pendientes_procesada_idx" ON "marcaciones_pendientes"("procesada");
CREATE INDEX "marcaciones_pendientes_dispositivo_id_timestamp_idx" ON "marcaciones_pendientes"("dispositivo_id", "timestamp");

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_sucursal_id_fkey" FOREIGN KEY ("sucursal_id") REFERENCES "sucursales"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_turno_id_fkey" FOREIGN KEY ("turno_id") REFERENCES "turnos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "asistencias" ADD CONSTRAINT "asistencias_turno_id_fkey" FOREIGN KEY ("turno_id") REFERENCES "turnos"("id") ON DELETE SET NULL ON UPDATE CASCADE;
