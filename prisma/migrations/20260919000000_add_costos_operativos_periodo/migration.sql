CREATE TABLE "costos_operativos_periodo" (
    "id" TEXT NOT NULL,
    "periodo" TEXT NOT NULL,
    "cantidad_base" DECIMAL(14,4) NOT NULL,
    "mano_obra_lote" DECIMAL(14,4) NOT NULL,
    "supervision_lote" DECIMAL(14,4) NOT NULL,
    "depreciacion_lote" DECIMAL(14,4) NOT NULL,
    "energia_lote" DECIMAL(14,4) NOT NULL,
    "uso_local_lote" DECIMAL(14,4) NOT NULL,
    "alquiler_mensual" DECIMAL(14,4),
    "energia_mensual" DECIMAL(14,4),
    "horas_productivas" DECIMAL(14,4),
    "valor_maquinaria" DECIMAL(14,4),
    "depreciacion_anual" DECIMAL(8,4),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "costos_operativos_periodo_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "costos_operativos_periodo_periodo_key"
ON "costos_operativos_periodo"("periodo");

CREATE INDEX "costos_operativos_periodo_periodo_idx"
ON "costos_operativos_periodo"("periodo");

-- Base de costos del Excel de septiembre 2026. Finanzas puede actualizarla
-- sin alterar los periodos históricos ya calculados.
INSERT INTO "costos_operativos_periodo" (
    "id", "periodo", "cantidad_base", "mano_obra_lote", "supervision_lote",
    "depreciacion_lote", "energia_lote", "uso_local_lote", "alquiler_mensual",
    "energia_mensual", "horas_productivas", "valor_maquinaria", "depreciacion_anual",
    "updated_at"
) VALUES (
    gen_random_uuid(), '2026-09', 150, 12.50, 1.77,
    0.21, 1.63, 20.41, 2000, 320, 196, 5000, 0.10,
    CURRENT_TIMESTAMP
)
ON CONFLICT ("periodo") DO NOTHING;
