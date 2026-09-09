\echo === MIGRACION: Carga de recetas reales en formulas_master ===
\echo 3 ESP nuevos + DELETE FM-0043/FM-0048 + UPDATE 20 formulas

BEGIN;

-- =============================
-- 1. CREAR 3 INSUMOS ESP NUEVOS
-- =============================

INSERT INTO insumos (id, codigo, nombre, "familiaId", "unidadMedida", "stockTeorico", "stockReal", "stockMinimo", "costoUnitario", estado, tipo, "es_solo_formula", "createdAt", "updatedAt")
SELECT gen_random_uuid(), 'ESP-024', 'PROTEINA DE TRIGO HIDROLIZADA', '1883d81b-c0f6-4499-9a76-c0d7b3133987', 'GR', 0, 0, 0, 0, 'ACTIVO', 'OTRO', true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM insumos WHERE codigo = 'ESP-024');

INSERT INTO insumos (id, codigo, nombre, "familiaId", "unidadMedida", "stockTeorico", "stockReal", "stockMinimo", "costoUnitario", estado, tipo, "es_solo_formula", "createdAt", "updatedAt")
SELECT gen_random_uuid(), 'ESP-025', 'PALMITATO DE ISOPROPILO', 'e666504d-be2a-4cef-bb50-81d4f6c141f6', 'GR', 0, 0, 0, 0, 'ACTIVO', 'OTRO', true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM insumos WHERE codigo = 'ESP-025');

INSERT INTO insumos (id, codigo, nombre, "familiaId", "unidadMedida", "stockTeorico", "stockReal", "stockMinimo", "costoUnitario", estado, tipo, "es_solo_formula", "createdAt", "updatedAt")
SELECT gen_random_uuid(), 'ESP-026', 'ACEITE ESENCIAL DE CIPRES', 'f3d25455-ed0b-4167-93e1-b03b5200e551', 'GR', 0, 0, 0, 0, 'ACTIVO', 'OTRO', true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM insumos WHERE codigo = 'ESP-026');

-- =================================
-- 2. ELIMINAR FORMULAS INNECESARIAS
-- =================================

DELETE FROM formula_detalles WHERE "formulaId" IN (SELECT id FROM formulas_master WHERE "codigoFormula" IN ('FM-0043','FM-0048'));
DELETE FROM formulas_master WHERE "codigoFormula" IN ('FM-0043','FM-0048');

-- =====================================================
-- 3. CARGAR RECETAS REALES (20 formulas, total ~1000g)
-- =====================================================

-- FM-0002: SPRAY BUCAL LIMON Y CLAVO (999g)
DELETE FROM formula_detalles WHERE "formulaId" = (SELECT id FROM formulas_master WHERE "codigoFormula" = 'FM-0002');
INSERT INTO formula_detalles (id, "formulaId", "insumoId", "nombreComponente", porcentaje, "pesoMasaTeorico", "createdAt", "updatedAt")
VALUES
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0002'), (SELECT id FROM insumos WHERE codigo='INS-031'), 'Agua destilada', 18.250, 182.5, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0002'), (SELECT id FROM insumos WHERE codigo='INS-043'), 'Benzoato de sodio', 0.100, 1.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0002'), (SELECT id FROM insumos WHERE codigo='INS-147'), 'Sorbato de potasio', 0.050, 0.5, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0002'), (SELECT id FROM insumos WHERE codigo='INS-164'), 'Sacarina sodica', 0.300, 3.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0002'), (SELECT id FROM insumos WHERE codigo='INS-148'), 'Sorbitol', 10.000, 100.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0002'), (SELECT id FROM insumos WHERE codigo='INS-035'), 'Alcohol extra neutro 96%', 69.600, 696.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0002'), (SELECT id FROM insumos WHERE codigo='FRAG-040'), 'Saborizante limon', 0.500, 5.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0002'), (SELECT id FROM insumos WHERE codigo='VENC-004'), 'Saborizante clavo de olor', 1.000, 10.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0002'), (SELECT id FROM insumos WHERE codigo='INS-110'), 'Mentol en cristales', 0.100, 1.0, NOW(), NOW());

-- FM-0003: SPRAY BUCAL SANDIA (999.5g)
DELETE FROM formula_detalles WHERE "formulaId" = (SELECT id FROM formulas_master WHERE "codigoFormula" = 'FM-0003');
INSERT INTO formula_detalles (id, "formulaId", "insumoId", "nombreComponente", porcentaje, "pesoMasaTeorico", "createdAt", "updatedAt")
VALUES
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0003'), (SELECT id FROM insumos WHERE codigo='INS-031'), 'Agua destilada', 18.800, 188.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0003'), (SELECT id FROM insumos WHERE codigo='INS-043'), 'Benzoato de sodio', 0.100, 1.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0003'), (SELECT id FROM insumos WHERE codigo='INS-147'), 'Sorbato de potasio', 0.050, 0.5, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0003'), (SELECT id FROM insumos WHERE codigo='INS-164'), 'Sacarina sodica', 0.300, 3.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0003'), (SELECT id FROM insumos WHERE codigo='INS-148'), 'Sorbitol', 10.000, 100.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0003'), (SELECT id FROM insumos WHERE codigo='INS-035'), 'Alcohol extra neutro 96%', 69.600, 696.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0003'), (SELECT id FROM insumos WHERE codigo='ESP-020'), 'Saborizante sandia', 1.000, 10.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0003'), (SELECT id FROM insumos WHERE codigo='INS-110'), 'Mentol en cristales', 0.100, 1.0, NOW(), NOW());

-- FM-0007: SERUM OJERAS (1000g)
DELETE FROM formula_detalles WHERE "formulaId" = (SELECT id FROM formulas_master WHERE "codigoFormula" = 'FM-0007');
INSERT INTO formula_detalles (id, "formulaId", "insumoId", "nombreComponente", porcentaje, "pesoMasaTeorico", "createdAt", "updatedAt")
VALUES
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0007'), (SELECT id FROM insumos WHERE codigo='INS-030'), 'Agua desionizada', 88.700, 887.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0007'), (SELECT id FROM insumos WHERE codigo='INS-054'), 'Cellosize', 0.800, 8.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0007'), (SELECT id FROM insumos WHERE codigo='INS-134'), 'Propilenglicol', 5.000, 50.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0007'), (SELECT id FROM insumos WHERE codigo='INS-049'), 'Cafeina', 3.000, 30.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0007'), (SELECT id FROM insumos WHERE codigo='INS-063'), 'Colageno hidrolizado', 1.000, 10.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0007'), (SELECT id FROM insumos WHERE codigo='INS-014'), 'Acido ascorbico', 0.500, 5.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0007'), (SELECT id FROM insumos WHERE codigo='INS-110'), 'Mentol en cristales', 0.050, 0.5, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0007'), (SELECT id FROM insumos WHERE codigo='INS-154'), 'Trietanolamina (TEA)', 0.800, 8.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0007'), (SELECT id FROM insumos WHERE codigo='INS-043'), 'Benzoato de sodio', 0.100, 1.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0007'), (SELECT id FROM insumos WHERE codigo='INS-147'), 'Sorbato de potasio', 0.050, 0.5, NOW(), NOW());

-- FM-0008: BLANQUEADOR DENTAL (999.5g)
DELETE FROM formula_detalles WHERE "formulaId" = (SELECT id FROM formulas_master WHERE "codigoFormula" = 'FM-0008');
INSERT INTO formula_detalles (id, "formulaId", "insumoId", "nombreComponente", porcentaje, "pesoMasaTeorico", "createdAt", "updatedAt")
VALUES
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0008'), (SELECT id FROM insumos WHERE codigo='INS-095'), 'Glicerina', 2.000, 20.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0008'), (SELECT id FROM insumos WHERE codigo='INS-148'), 'Sorbitol', 2.000, 20.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0008'), (SELECT id FROM insumos WHERE codigo='INS-054'), 'Cellosize', 2.000, 20.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0008'), (SELECT id FROM insumos WHERE codigo='INS-154'), 'Trietanolamina (TEA)', 1.000, 10.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0008'), (SELECT id FROM insumos WHERE codigo='COL-041'), 'Colorante dispersante morado', 1.000, 10.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0008'), (SELECT id FROM insumos WHERE codigo='VENC-003'), 'Saborizante chicle', 0.500, 5.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0008'), (SELECT id FROM insumos WHERE codigo='INS-044'), 'Betaina', 0.500, 5.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0008'), (SELECT id FROM insumos WHERE codigo='INS-164'), 'Sacarina sodica', 0.100, 1.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0008'), (SELECT id FROM insumos WHERE codigo='INS-133'), 'Procide CG', 1.000, 10.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0008'), (SELECT id FROM insumos WHERE codigo='INS-110'), 'Mentol en cristales', 0.050, 0.5, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0008'), (SELECT id FROM insumos WHERE codigo='INS-030'), 'Agua desionizada', 89.800, 898.0, NOW(), NOW());

-- FM-0011: GEL MUSCULAR (997g)
DELETE FROM formula_detalles WHERE "formulaId" = (SELECT id FROM formulas_master WHERE "codigoFormula" = 'FM-0011');
INSERT INTO formula_detalles (id, "formulaId", "insumoId", "nombreComponente", porcentaje, "pesoMasaTeorico", "createdAt", "updatedAt")
VALUES
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0011'), (SELECT id FROM insumos WHERE codigo='INS-033'), 'Alcanfor', 1.000, 10.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0011'), (SELECT id FROM insumos WHERE codigo='INS-110'), 'Mentol en cristales', 1.000, 10.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0011'), (SELECT id FROM insumos WHERE codigo='INS-035'), 'Alcohol extra neutro 96%', 57.500, 575.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0011'), (SELECT id FROM insumos WHERE codigo='INS-030'), 'Agua desionizada', 37.600, 376.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0011'), (SELECT id FROM insumos WHERE codigo='INS-053'), 'Carbopol', 1.200, 12.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0011'), (SELECT id FROM insumos WHERE codigo='INS-043'), 'Benzoato de sodio', 0.100, 1.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0011'), (SELECT id FROM insumos WHERE codigo='INS-147'), 'Sorbato de potasio', 0.100, 1.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0011'), (SELECT id FROM insumos WHERE codigo='INS-154'), 'Trietanolamina (TEA)', 1.200, 12.0, NOW(), NOW());

-- FM-0023: SPRAY ANTIARRUGAS (1016g)
DELETE FROM formula_detalles WHERE "formulaId" = (SELECT id FROM formulas_master WHERE "codigoFormula" = 'FM-0023');
INSERT INTO formula_detalles (id, "formulaId", "insumoId", "nombreComponente", porcentaje, "pesoMasaTeorico", "createdAt", "updatedAt")
VALUES
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0023'), (SELECT id FROM insumos WHERE codigo='INS-030'), 'Agua desionizada', 86.000, 860.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0023'), (SELECT id FROM insumos WHERE codigo='INS-063'), 'Colageno', 5.000, 50.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0023'), (SELECT id FROM insumos WHERE codigo='INS-014'), 'Acido ascorbico (Vit C)', 0.500, 5.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0023'), (SELECT id FROM insumos WHERE codigo='INS-049'), 'Cafeina', 2.000, 20.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0023'), (SELECT id FROM insumos WHERE codigo='INS-095'), 'Glicerina', 5.000, 50.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0023'), (SELECT id FROM insumos WHERE codigo='INS-077'), 'Extracto de aloe vera', 0.500, 5.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0023'), (SELECT id FROM insumos WHERE codigo='INS-162'), 'Vitamina E', 0.500, 5.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0023'), (SELECT id FROM insumos WHERE codigo='INS-133'), 'Procide CG', 0.100, 1.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0023'), (SELECT id FROM insumos WHERE codigo='INS-128'), 'Polisorbato 20', 2.000, 20.0, NOW(), NOW());

-- FM-0025: SHAMPOO DE RICINO (999g)
DELETE FROM formula_detalles WHERE "formulaId" = (SELECT id FROM formulas_master WHERE "codigoFormula" = 'FM-0025');
INSERT INTO formula_detalles (id, "formulaId", "insumoId", "nombreComponente", porcentaje, "pesoMasaTeorico", "createdAt", "updatedAt")
VALUES
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0025'), (SELECT id FROM insumos WHERE codigo='INS-153'), 'Texapon 70%', 12.000, 120.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0025'), (SELECT id FROM insumos WHERE codigo='INS-044'), 'Betaina', 0.100, 1.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0025'), (SELECT id FROM insumos WHERE codigo='INS-095'), 'Glicerina', 2.000, 20.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0025'), (SELECT id FROM insumos WHERE codigo='INS-005'), 'Aceite de ricino', 1.000, 10.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0025'), (SELECT id FROM insumos WHERE codigo='INS-006'), 'Aceite esencial de romero', 0.200, 2.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0025'), (SELECT id FROM insumos WHERE codigo='INS-086'), 'Extracto de romero', 1.000, 10.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0025'), (SELECT id FROM insumos WHERE codigo='INS-067'), 'D-Pantenol / Pantenol', 0.500, 5.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0025'), (SELECT id FROM insumos WHERE codigo='ESP-024'), 'Proteina de trigo hidrolizada', 0.500, 5.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0025'), (SELECT id FROM insumos WHERE codigo='INS-017'), 'Acido citrico', 0.200, 2.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0025'), (SELECT id FROM insumos WHERE codigo='INS-138'), 'Cloruro de sodio (sal)', 0.400, 4.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0025'), (SELECT id FROM insumos WHERE codigo='INS-133'), 'Procide CG', 0.200, 2.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0025'), (SELECT id FROM insumos WHERE codigo='INS-030'), 'Agua desionizada', 81.800, 818.0, NOW(), NOW());

-- FM-0026: SOLUCION UNAS SANAS (954g - sin normalizar)
DELETE FROM formula_detalles WHERE "formulaId" = (SELECT id FROM formulas_master WHERE "codigoFormula" = 'FM-0026');
INSERT INTO formula_detalles (id, "formulaId", "insumoId", "nombreComponente", porcentaje, "pesoMasaTeorico", "createdAt", "updatedAt")
VALUES
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0026'), (SELECT id FROM insumos WHERE codigo='INS-030'), 'Agua desionizada', 84.500, 845.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0026'), (SELECT id FROM insumos WHERE codigo='INS-060'), 'Cloruro de benzalconio', 1.000, 10.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0026'), (SELECT id FROM insumos WHERE codigo='INS-097'), 'Clorhexidina', 2.000, 20.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0026'), (SELECT id FROM insumos WHERE codigo='INS-077'), 'Extracto de aloe vera', 3.000, 30.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0026'), (SELECT id FROM insumos WHERE codigo='INS-067'), 'D-Pantenol / Pantenol', 0.500, 5.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0026'), (SELECT id FROM insumos WHERE codigo='INS-095'), 'Glicerina', 2.000, 20.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0026'), (SELECT id FROM insumos WHERE codigo='INS-025'), 'Acido salicilico', 0.500, 5.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0026'), (SELECT id FROM insumos WHERE codigo='INS-134'), 'Propilenglicol', 1.000, 10.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0026'), (SELECT id FROM insumos WHERE codigo='INS-073'), 'EDTA tetrasodico', 0.200, 2.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0026'), (SELECT id FROM insumos WHERE codigo='INS-147'), 'Sorbato de potasio', 0.300, 3.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0026'), (SELECT id FROM insumos WHERE codigo='INS-043'), 'Benzoato de sodio', 0.300, 3.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0026'), (SELECT id FROM insumos WHERE codigo='INS-017'), 'Acido citrico', 0.100, 1.0, NOW(), NOW());

-- FM-0027: ACEITE LIMPIADOR FACIAL (996g)
DELETE FROM formula_detalles WHERE "formulaId" = (SELECT id FROM formulas_master WHERE "codigoFormula" = 'FM-0027');
INSERT INTO formula_detalles (id, "formulaId", "insumoId", "nombreComponente", porcentaje, "pesoMasaTeorico", "createdAt", "updatedAt")
VALUES
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0027'), (SELECT id FROM insumos WHERE codigo='INS-030'), 'Agua desionizada', 83.400, 834.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0027'), (SELECT id FROM insumos WHERE codigo='INS-095'), 'Glicerina', 5.000, 50.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0027'), (SELECT id FROM insumos WHERE codigo='INS-122'), 'Niacinamida', 2.000, 20.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0027'), (SELECT id FROM insumos WHERE codigo='INS-077'), 'Extracto de aloe vera', 1.000, 10.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0027'), (SELECT id FROM insumos WHERE codigo='INS-089'), 'Extracto de te verde', 1.000, 10.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0027'), (SELECT id FROM insumos WHERE codigo='INS-044'), 'Betaina', 3.000, 30.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0027'), (SELECT id FROM insumos WHERE codigo='INS-067'), 'D-Pantenol / Pantenol', 0.500, 5.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0027'), (SELECT id FROM insumos WHERE codigo='INS-153'), 'Texapon 70%', 1.000, 10.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0027'), (SELECT id FROM insumos WHERE codigo='INS-054'), 'Cellosize', 0.700, 7.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0027'), (SELECT id FROM insumos WHERE codigo='INS-154'), 'Trietanolamina (TEA)', 0.700, 7.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0027'), (SELECT id FROM insumos WHERE codigo='INS-022'), 'Acido lactico', 0.200, 2.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0027'), (SELECT id FROM insumos WHERE codigo='INS-017'), 'Acido citrico', 0.300, 3.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0027'), (SELECT id FROM insumos WHERE codigo='INS-043'), 'Benzoato de sodio', 0.500, 5.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0027'), (SELECT id FROM insumos WHERE codigo='INS-147'), 'Sorbato de potasio', 0.300, 3.0, NOW(), NOW());

-- FM-0028: ACEITE CAPILAR (995g)
DELETE FROM formula_detalles WHERE "formulaId" = (SELECT id FROM formulas_master WHERE "codigoFormula" = 'FM-0028');
INSERT INTO formula_detalles (id, "formulaId", "insumoId", "nombreComponente", porcentaje, "pesoMasaTeorico", "createdAt", "updatedAt")
VALUES
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0028'), (SELECT id FROM insumos WHERE codigo='INS-005'), 'Aceite de ricino', 83.800, 838.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0028'), (SELECT id FROM insumos WHERE codigo='ESP-022'), 'Aceite de coco extra virgen', 10.000, 100.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0028'), (SELECT id FROM insumos WHERE codigo='INS-003'), 'Aceite de jojoba', 5.000, 50.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0028'), (SELECT id FROM insumos WHERE codigo='INS-006'), 'Aceite esencial de romero', 0.500, 5.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0028'), (SELECT id FROM insumos WHERE codigo='INS-162'), 'Vitamina E', 0.200, 2.0, NOW(), NOW());

-- FM-0029: LIMPIADORA TOPICA MASCOTAS (1000g)
DELETE FROM formula_detalles WHERE "formulaId" = (SELECT id FROM formulas_master WHERE "codigoFormula" = 'FM-0029');
INSERT INTO formula_detalles (id, "formulaId", "insumoId", "nombreComponente", porcentaje, "pesoMasaTeorico", "createdAt", "updatedAt")
VALUES
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0029'), (SELECT id FROM insumos WHERE codigo='INS-030'), 'Agua desionizada', 88.200, 882.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0029'), (SELECT id FROM insumos WHERE codigo='INS-134'), 'Propilenglicol', 3.000, 30.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0029'), (SELECT id FROM insumos WHERE codigo='INS-095'), 'Glicerina', 3.000, 30.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0029'), (SELECT id FROM insumos WHERE codigo='ESP-014'), 'Lipocol 40 (PEG-40)', 2.000, 20.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0029'), (SELECT id FROM insumos WHERE codigo='INS-097'), 'Clorhexidina', 0.500, 5.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0029'), (SELECT id FROM insumos WHERE codigo='INS-043'), 'Benzoato de sodio', 0.200, 2.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0029'), (SELECT id FROM insumos WHERE codigo='INS-147'), 'Sorbato de potasio', 0.100, 1.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0029'), (SELECT id FROM insumos WHERE codigo='INS-078'), 'Extracto de calendula', 2.000, 20.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0029'), (SELECT id FROM insumos WHERE codigo='ESP-004'), 'Aceite de semillas de uva', 1.000, 10.0, NOW(), NOW());

-- FM-0030: SERUM POST AFEITADO (999g - agua de rosas 0 omitida)
DELETE FROM formula_detalles WHERE "formulaId" = (SELECT id FROM formulas_master WHERE "codigoFormula" = 'FM-0030');
INSERT INTO formula_detalles (id, "formulaId", "insumoId", "nombreComponente", porcentaje, "pesoMasaTeorico", "createdAt", "updatedAt")
VALUES
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0030'), (SELECT id FROM insumos WHERE codigo='INS-030'), 'Agua desionizada', 86.800, 868.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0030'), (SELECT id FROM insumos WHERE codigo='INS-095'), 'Glicerina', 5.000, 50.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0030'), (SELECT id FROM insumos WHERE codigo='ESP-025'), 'Palmitato de isopropilo', 3.000, 30.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0030'), (SELECT id FROM insumos WHERE codigo='INS-089'), 'Extracto de te verde', 1.000, 10.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0030'), (SELECT id FROM insumos WHERE codigo='ESP-013'), 'Extracto de algas marinas', 1.000, 10.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0030'), (SELECT id FROM insumos WHERE codigo='INS-014'), 'Acido ascorbico (Vit C)', 0.200, 2.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0030'), (SELECT id FROM insumos WHERE codigo='INS-063'), 'Colageno hidrolizado', 1.000, 10.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0030'), (SELECT id FROM insumos WHERE codigo='INS-054'), 'Cellosize', 0.700, 7.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0030'), (SELECT id FROM insumos WHERE codigo='INS-154'), 'Trietanolamina (TEA)', 0.700, 7.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0030'), (SELECT id FROM insumos WHERE codigo='INS-043'), 'Benzoato de sodio', 0.200, 2.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0030'), (SELECT id FROM insumos WHERE codigo='INS-147'), 'Sorbato de potasio', 0.100, 1.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0030'), (SELECT id FROM insumos WHERE codigo='INS-017'), 'Acido citrico', 0.200, 2.0, NOW(), NOW());

-- FM-0032: DESODORANTE ROLL-ON (994g)
DELETE FROM formula_detalles WHERE "formulaId" = (SELECT id FROM formulas_master WHERE "codigoFormula" = 'FM-0032');
INSERT INTO formula_detalles (id, "formulaId", "insumoId", "nombreComponente", porcentaje, "pesoMasaTeorico", "createdAt", "updatedAt")
VALUES
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0032'), (SELECT id FROM insumos WHERE codigo='INS-030'), 'Agua desionizada', 71.600, 716.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0032'), (SELECT id FROM insumos WHERE codigo='INS-059'), 'Clorhidrato de aluminio', 10.000, 100.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0032'), (SELECT id FROM insumos WHERE codigo='INS-095'), 'Glicerina', 4.000, 40.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0032'), (SELECT id FROM insumos WHERE codigo='INS-032'), 'Alantoina', 0.200, 2.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0032'), (SELECT id FROM insumos WHERE codigo='INS-074'), 'Emulgade 1000', 5.000, 50.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0032'), (SELECT id FROM insumos WHERE codigo='INS-034'), 'Alcohol cetilico', 1.500, 15.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0032'), (SELECT id FROM insumos WHERE codigo='INS-155'), 'Trietil citrato', 2.000, 20.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0032'), (SELECT id FROM insumos WHERE codigo='INS-122'), 'Niacinamida', 3.000, 30.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0032'), (SELECT id FROM insumos WHERE codigo='INS-077'), 'Extracto de aloe vera', 1.000, 10.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0032'), (SELECT id FROM insumos WHERE codigo='INS-084'), 'Extracto de manzanilla', 0.300, 3.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0032'), (SELECT id FROM insumos WHERE codigo='INS-162'), 'Vitamina E', 0.200, 2.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0032'), (SELECT id FROM insumos WHERE codigo='INS-043'), 'Benzoato de sodio', 0.400, 4.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0032'), (SELECT id FROM insumos WHERE codigo='INS-147'), 'Sorbato de potasio', 0.200, 2.0, NOW(), NOW());

-- FM-0033: ACEITE ANTIVELLO CORPORAL (1000g)
DELETE FROM formula_detalles WHERE "formulaId" = (SELECT id FROM formulas_master WHERE "codigoFormula" = 'FM-0033');
INSERT INTO formula_detalles (id, "formulaId", "insumoId", "nombreComponente", porcentaje, "pesoMasaTeorico", "createdAt", "updatedAt")
VALUES
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0033'), (SELECT id FROM insumos WHERE codigo='INS-159'), 'Vaselina liquida', 88.300, 883.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0033'), (SELECT id FROM insumos WHERE codigo='INS-001'), 'Aceite de almendras', 5.000, 50.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0033'), (SELECT id FROM insumos WHERE codigo='INS-003'), 'Aceite de jojoba', 3.500, 35.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0033'), (SELECT id FROM insumos WHERE codigo='INS-012'), 'Aceite de rosa mosqueta', 2.000, 20.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0033'), (SELECT id FROM insumos WHERE codigo='INS-162'), 'Vitamina E', 0.500, 5.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0033'), (SELECT id FROM insumos WHERE codigo='INS-011'), 'Aceite esencial de arbol del te', 0.700, 7.0, NOW(), NOW());

-- FM-0034: BARRA DE ARRUGA (1012g)
DELETE FROM formula_detalles WHERE "formulaId" = (SELECT id FROM formulas_master WHERE "codigoFormula" = 'FM-0034');
INSERT INTO formula_detalles (id, "formulaId", "insumoId", "nombreComponente", porcentaje, "pesoMasaTeorico", "createdAt", "updatedAt")
VALUES
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0034'), (SELECT id FROM insumos WHERE codigo='INS-159'), 'Vaselina liquida', 79.000, 790.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0034'), (SELECT id FROM insumos WHERE codigo='INS-056'), 'Cera de abeja refinada', 12.000, 120.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0034'), (SELECT id FROM insumos WHERE codigo='INS-055'), 'Cera carnauba', 1.000, 10.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0034'), (SELECT id FROM insumos WHERE codigo='INS-034'), 'Alcohol cetilico', 8.000, 80.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0034'), (SELECT id FROM insumos WHERE codigo='INS-162'), 'Vitamina E', 1.000, 10.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0034'), (SELECT id FROM insumos WHERE codigo='INS-070'), 'Dioxido de titanio', 0.200, 2.0, NOW(), NOW());

-- FM-0035: CREMA ANALGESICA TRIPLE (1040.5g)
DELETE FROM formula_detalles WHERE "formulaId" = (SELECT id FROM formulas_master WHERE "codigoFormula" = 'FM-0035');
INSERT INTO formula_detalles (id, "formulaId", "insumoId", "nombreComponente", porcentaje, "pesoMasaTeorico", "createdAt", "updatedAt")
VALUES
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0035'), (SELECT id FROM insumos WHERE codigo='INS-106'), 'Lidocaina', 2.000, 20.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0035'), (SELECT id FROM insumos WHERE codigo='INS-152'), 'Tetracaina', 1.000, 10.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0035'), (SELECT id FROM insumos WHERE codigo='INS-131'), 'Prilocaina', 2.000, 20.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0035'), (SELECT id FROM insumos WHERE codigo='INS-034'), 'Alcohol cetilico', 7.000, 70.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0035'), (SELECT id FROM insumos WHERE codigo='INS-069'), 'Dehyquart', 7.000, 70.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0035'), (SELECT id FROM insumos WHERE codigo='INS-160'), 'Vaselina solida', 6.700, 67.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0035'), (SELECT id FROM insumos WHERE codigo='INS-134'), 'Propilenglicol', 6.700, 67.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0035'), (SELECT id FROM insumos WHERE codigo='INS-095'), 'Glicerina', 3.000, 30.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0035'), (SELECT id FROM insumos WHERE codigo='INS-133'), 'Procide CG', 0.800, 8.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0035'), (SELECT id FROM insumos WHERE codigo='INS-073'), 'EDTA tetrasodico', 0.050, 0.5, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0035'), (SELECT id FROM insumos WHERE codigo='INS-030'), 'Agua desionizada', 67.800, 678.0, NOW(), NOW());

-- FM-0036: ACEITE DE VARICES (1000g)
DELETE FROM formula_detalles WHERE "formulaId" = (SELECT id FROM formulas_master WHERE "codigoFormula" = 'FM-0036');
INSERT INTO formula_detalles (id, "formulaId", "insumoId", "nombreComponente", porcentaje, "pesoMasaTeorico", "createdAt", "updatedAt")
VALUES
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0036'), (SELECT id FROM insumos WHERE codigo='INS-159'), 'Vaselina liquida', 55.000, 550.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0036'), (SELECT id FROM insumos WHERE codigo='INS-003'), 'Aceite de jojoba', 25.000, 250.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0036'), (SELECT id FROM insumos WHERE codigo='INS-001'), 'Aceite de almendras', 15.000, 150.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0036'), (SELECT id FROM insumos WHERE codigo='INS-006'), 'Aceite esencial de romero', 1.500, 15.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0036'), (SELECT id FROM insumos WHERE codigo='ESP-026'), 'Aceite esencial de cipres', 1.000, 10.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0036'), (SELECT id FROM insumos WHERE codigo='INS-009'), 'Aceite esencial de lavanda', 1.000, 10.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0036'), (SELECT id FROM insumos WHERE codigo='INS-010'), 'Aceite esencial de menta', 0.500, 5.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0036'), (SELECT id FROM insumos WHERE codigo='INS-162'), 'Vitamina E', 1.000, 10.0, NOW(), NOW());

-- FM-0046: TONICO DE UNAS (1000g)
DELETE FROM formula_detalles WHERE "formulaId" = (SELECT id FROM formulas_master WHERE "codigoFormula" = 'FM-0046');
INSERT INTO formula_detalles (id, "formulaId", "insumoId", "nombreComponente", porcentaje, "pesoMasaTeorico", "createdAt", "updatedAt")
VALUES
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0046'), (SELECT id FROM insumos WHERE codigo='INS-060'), 'Cloruro de benzalconio', 0.100, 1.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0046'), (SELECT id FROM insumos WHERE codigo='INS-015'), 'Acido benzoico', 0.300, 3.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0046'), (SELECT id FROM insumos WHERE codigo='INS-016'), 'Acido borico', 0.500, 5.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0046'), (SELECT id FROM insumos WHERE codigo='INS-106'), 'Lidocaina', 0.500, 5.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0046'), (SELECT id FROM insumos WHERE codigo='INS-135'), 'Propionato de sodio', 1.000, 10.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0046'), (SELECT id FROM insumos WHERE codigo='INS-028'), 'Acido undecilenico', 3.000, 30.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0046'), (SELECT id FROM insumos WHERE codigo='INS-031'), 'Agua destilada', 10.000, 100.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0046'), (SELECT id FROM insumos WHERE codigo='INS-035'), 'Alcohol extra neutro 96%', 44.800, 448.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0046'), (SELECT id FROM insumos WHERE codigo='INS-134'), 'Propilenglicol', 39.800, 398.0, NOW(), NOW());

-- FM-0047: TONICO MASCOTAS RENOVAPET (1010g)
DELETE FROM formula_detalles WHERE "formulaId" = (SELECT id FROM formulas_master WHERE "codigoFormula" = 'FM-0047');
INSERT INTO formula_detalles (id, "formulaId", "insumoId", "nombreComponente", porcentaje, "pesoMasaTeorico", "createdAt", "updatedAt")
VALUES
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0047'), (SELECT id FROM insumos WHERE codigo='INS-011'), 'Aceite esencial de arbol del te', 0.500, 5.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0047'), (SELECT id FROM insumos WHERE codigo='INS-009'), 'Aceite esencial de lavanda', 0.500, 5.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0047'), (SELECT id FROM insumos WHERE codigo='INS-128'), 'Polisorbato 20', 4.000, 40.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0047'), (SELECT id FROM insumos WHERE codigo='INS-078'), 'Extracto de calendula', 2.000, 20.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0047'), (SELECT id FROM insumos WHERE codigo='INS-097'), 'Clorhexidina (20% sol.)', 1.000, 10.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0047'), (SELECT id FROM insumos WHERE codigo='INS-095'), 'Glicerina vegetal', 3.000, 30.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0047'), (SELECT id FROM insumos WHERE codigo='INS-067'), 'D-Pantenol', 1.000, 10.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0047'), (SELECT id FROM insumos WHERE codigo='INS-134'), 'Propilenglicol', 1.000, 10.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0047'), (SELECT id FROM insumos WHERE codigo='INS-043'), 'Benzoato de sodio', 0.100, 1.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0047'), (SELECT id FROM insumos WHERE codigo='INS-147'), 'Sorbato de potasio', 0.050, 0.5, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0047'), (SELECT id FROM insumos WHERE codigo='INS-030'), 'Agua desionizada', 87.850, 878.5, NOW(), NOW());

-- FM-0061: SERUM PARA VERRUGAS (1004g)
DELETE FROM formula_detalles WHERE "formulaId" = (SELECT id FROM formulas_master WHERE "codigoFormula" = 'FM-0061');
INSERT INTO formula_detalles (id, "formulaId", "insumoId", "nombreComponente", porcentaje, "pesoMasaTeorico", "createdAt", "updatedAt")
VALUES
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0061'), (SELECT id FROM insumos WHERE codigo='INS-025'), 'Acido salicilico', 2.000, 20.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0061'), (SELECT id FROM insumos WHERE codigo='INS-022'), 'Acido lactico', 1.000, 10.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0061'), (SELECT id FROM insumos WHERE codigo='INS-035'), 'Alcohol extra neutro 96%', 5.000, 50.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0061'), (SELECT id FROM insumos WHERE codigo='INS-095'), 'Glicerina', 2.000, 20.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0061'), (SELECT id FROM insumos WHERE codigo='INS-134'), 'Propilenglicol', 5.000, 50.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0061'), (SELECT id FROM insumos WHERE codigo='INS-054'), 'Cellosize', 0.900, 9.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0061'), (SELECT id FROM insumos WHERE codigo='INS-043'), 'Benzoato de sodio', 0.100, 1.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0061'), (SELECT id FROM insumos WHERE codigo='INS-147'), 'Sorbato de potasio', 0.050, 0.5, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0061'), (SELECT id FROM insumos WHERE codigo='INS-030'), 'Agua desionizada', 84.350, 843.5, NOW(), NOW());

COMMIT;
\echo === MIGRACION COMPLETADA ===
