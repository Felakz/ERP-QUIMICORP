\echo === MIGRACION FINAL: Restaurar FM-0043/FM-0048 + crear FM-0074/FM-0075 + actualizar FM-0073/FM-0072/FM-0034/FM-0018 ===

BEGIN;

-- ===============================================
-- 1. RESTAURAR FM-0043: CREMA PARA DOLOR MUSCULAR
-- ===============================================
DELETE FROM formula_detalles WHERE "formulaId" = (SELECT id FROM formulas_master WHERE "codigoFormula" = 'FM-0043');
INSERT INTO formulas_master (id, "codigoFormula", "nombreProducto", version, "densidadTeorica", estado, "createdAt", "updatedAt", "pasos_elaboracion")
SELECT gen_random_uuid(), 'FM-0043', 'CREMA PARA DOLOR MUSCULAR', 1, 1.0000, 'ACTIVA', NOW(), NOW(), NULL
WHERE NOT EXISTS (SELECT 1 FROM formulas_master WHERE "codigoFormula" = 'FM-0043');

INSERT INTO formula_detalles (id, "formulaId", "insumoId", "nombreComponente", porcentaje, "pesoMasaTeorico", "createdAt", "updatedAt")
SELECT gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0043'), (SELECT id FROM insumos WHERE codigo='INS-034'), 'Alcohol cetilico', 5.000, 50.0, NOW(), NOW()
WHERE EXISTS (SELECT 1 FROM formulas_master WHERE "codigoFormula"='FM-0043');
INSERT INTO formula_detalles (id, "formulaId", "insumoId", "nombreComponente", porcentaje, "pesoMasaTeorico", "createdAt", "updatedAt")
SELECT gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0043'), (SELECT id FROM insumos WHERE codigo='INS-069'), 'Dehyquart', 5.000, 50.0, NOW(), NOW()
WHERE EXISTS (SELECT 1 FROM formulas_master WHERE "codigoFormula"='FM-0043');
INSERT INTO formula_detalles (id, "formulaId", "insumoId", "nombreComponente", porcentaje, "pesoMasaTeorico", "createdAt", "updatedAt")
SELECT gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0043'), (SELECT id FROM insumos WHERE codigo='INS-033'), 'Alcanfor', 1.000, 10.0, NOW(), NOW()
WHERE EXISTS (SELECT 1 FROM formulas_master WHERE "codigoFormula"='FM-0043');
INSERT INTO formula_detalles (id, "formulaId", "insumoId", "nombreComponente", porcentaje, "pesoMasaTeorico", "createdAt", "updatedAt")
SELECT gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0043'), (SELECT id FROM insumos WHERE codigo='INS-110'), 'Mentol en cristales', 1.000, 10.0, NOW(), NOW()
WHERE EXISTS (SELECT 1 FROM formulas_master WHERE "codigoFormula"='FM-0043');
INSERT INTO formula_detalles (id, "formulaId", "insumoId", "nombreComponente", porcentaje, "pesoMasaTeorico", "createdAt", "updatedAt")
SELECT gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0043'), (SELECT id FROM insumos WHERE codigo='INS-006'), 'Aceite esencial de romero', 0.500, 5.0, NOW(), NOW()
WHERE EXISTS (SELECT 1 FROM formulas_master WHERE "codigoFormula"='FM-0043');
INSERT INTO formula_detalles (id, "formulaId", "insumoId", "nombreComponente", porcentaje, "pesoMasaTeorico", "createdAt", "updatedAt")
SELECT gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0043'), (SELECT id FROM insumos WHERE codigo='INS-030'), 'Agua desionizada', 87.040, 870.0, NOW(), NOW()
WHERE EXISTS (SELECT 1 FROM formulas_master WHERE "codigoFormula"='FM-0043');
INSERT INTO formula_detalles (id, "formulaId", "insumoId", "nombreComponente", porcentaje, "pesoMasaTeorico", "createdAt", "updatedAt")
SELECT gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0043'), (SELECT id FROM insumos WHERE codigo='INS-133'), 'Procide CG', 0.250, 2.5, NOW(), NOW()
WHERE EXISTS (SELECT 1 FROM formulas_master WHERE "codigoFormula"='FM-0043');
INSERT INTO formula_detalles (id, "formulaId", "insumoId", "nombreComponente", porcentaje, "pesoMasaTeorico", "createdAt", "updatedAt")
SELECT gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0043'), (SELECT id FROM insumos WHERE codigo='COL-034'), 'Colorante verde', 0.200, 2.0, NOW(), NOW()
WHERE EXISTS (SELECT 1 FROM formulas_master WHERE "codigoFormula"='FM-0043');

-- ============================================================
-- 2. RESTAURAR FM-0048: CREMA PARA DOLOR MUSCULAR CON MAGNESIO
-- ============================================================
DELETE FROM formula_detalles WHERE "formulaId" = (SELECT id FROM formulas_master WHERE "codigoFormula" = 'FM-0048');
INSERT INTO formulas_master (id, "codigoFormula", "nombreProducto", version, "densidadTeorica", estado, "createdAt", "updatedAt", "pasos_elaboracion")
SELECT gen_random_uuid(), 'FM-0048', 'CREMA PARA DOLOR MUSCULAR CON MAGNESIO', 1, 1.0000, 'ACTIVA', NOW(), NOW(), NULL
WHERE NOT EXISTS (SELECT 1 FROM formulas_master WHERE "codigoFormula" = 'FM-0048');

INSERT INTO formula_detalles (id, "formulaId", "insumoId", "nombreComponente", porcentaje, "pesoMasaTeorico", "createdAt", "updatedAt")
SELECT gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0048'), (SELECT id FROM insumos WHERE codigo='INS-034'), 'Alcohol cetilico', 8.000, 80.0, NOW(), NOW()
WHERE EXISTS (SELECT 1 FROM formulas_master WHERE "codigoFormula"='FM-0048');
INSERT INTO formula_detalles (id, "formulaId", "insumoId", "nombreComponente", porcentaje, "pesoMasaTeorico", "createdAt", "updatedAt")
SELECT gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0048'), (SELECT id FROM insumos WHERE codigo='INS-069'), 'Dehyquart', 8.000, 80.0, NOW(), NOW()
WHERE EXISTS (SELECT 1 FROM formulas_master WHERE "codigoFormula"='FM-0048');
INSERT INTO formula_detalles (id, "formulaId", "insumoId", "nombreComponente", porcentaje, "pesoMasaTeorico", "createdAt", "updatedAt")
SELECT gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0048'), (SELECT id FROM insumos WHERE codigo='INS-033'), 'Alcanfor', 1.000, 10.0, NOW(), NOW()
WHERE EXISTS (SELECT 1 FROM formulas_master WHERE "codigoFormula"='FM-0048');
INSERT INTO formula_detalles (id, "formulaId", "insumoId", "nombreComponente", porcentaje, "pesoMasaTeorico", "createdAt", "updatedAt")
SELECT gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0048'), (SELECT id FROM insumos WHERE codigo='INS-110'), 'Mentol en cristales', 1.000, 10.0, NOW(), NOW()
WHERE EXISTS (SELECT 1 FROM formulas_master WHERE "codigoFormula"='FM-0048');
INSERT INTO formula_detalles (id, "formulaId", "insumoId", "nombreComponente", porcentaje, "pesoMasaTeorico", "createdAt", "updatedAt")
SELECT gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0048'), (SELECT id FROM insumos WHERE codigo='INS-006'), 'Aceite esencial de romero', 0.500, 5.0, NOW(), NOW()
WHERE EXISTS (SELECT 1 FROM formulas_master WHERE "codigoFormula"='FM-0048');
INSERT INTO formula_detalles (id, "formulaId", "insumoId", "nombreComponente", porcentaje, "pesoMasaTeorico", "createdAt", "updatedAt")
SELECT gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0048'), (SELECT id FROM insumos WHERE codigo='INS-061'), 'Cloruro de magnesio', 2.000, 20.0, NOW(), NOW()
WHERE EXISTS (SELECT 1 FROM formulas_master WHERE "codigoFormula"='FM-0048');
INSERT INTO formula_detalles (id, "formulaId", "insumoId", "nombreComponente", porcentaje, "pesoMasaTeorico", "createdAt", "updatedAt")
SELECT gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0048'), (SELECT id FROM insumos WHERE codigo='INS-030'), 'Agua desionizada', 79.240, 792.0, NOW(), NOW()
WHERE EXISTS (SELECT 1 FROM formulas_master WHERE "codigoFormula"='FM-0048');
INSERT INTO formula_detalles (id, "formulaId", "insumoId", "nombreComponente", porcentaje, "pesoMasaTeorico", "createdAt", "updatedAt")
SELECT gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0048'), (SELECT id FROM insumos WHERE codigo='INS-133'), 'Procide CG', 0.250, 2.5, NOW(), NOW()
WHERE EXISTS (SELECT 1 FROM formulas_master WHERE "codigoFormula"='FM-0048');

-- ===============================================================
-- 3. CREAR FM-0074: PERFUME PACO RABANNE LUCKY ECONOMICO (Feromonas Lucky Economico)
-- ===============================================================
INSERT INTO formulas_master (id, "codigoFormula", "nombreProducto", version, "densidadTeorica", estado, "createdAt", "updatedAt", "pasos_elaboracion")
SELECT gen_random_uuid(), 'FM-0074', 'PERFUME PACO RABANNE LUCKY ECONOMICO', 1, 1.0000, 'ACTIVA', NOW(), NOW(), NULL
WHERE NOT EXISTS (SELECT 1 FROM formulas_master WHERE "codigoFormula" = 'FM-0074');

INSERT INTO formula_detalles (id, "formulaId", "insumoId", "nombreComponente", porcentaje, "pesoMasaTeorico", "createdAt", "updatedAt")
SELECT gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0074'), (SELECT id FROM insumos WHERE codigo='INS-030'), 'Agua desionizada', 84.500, 4225.0, NOW(), NOW()
WHERE EXISTS (SELECT 1 FROM formulas_master WHERE "codigoFormula"='FM-0074');
INSERT INTO formula_detalles (id, "formulaId", "insumoId", "nombreComponente", porcentaje, "pesoMasaTeorico", "createdAt", "updatedAt")
SELECT gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0074'), (SELECT id FROM insumos WHERE codigo='INS-037'), 'Alcohol laurico etoxilado', 5.000, 250.0, NOW(), NOW()
WHERE EXISTS (SELECT 1 FROM formulas_master WHERE "codigoFormula"='FM-0074');
INSERT INTO formula_detalles (id, "formulaId", "insumoId", "nombreComponente", porcentaje, "pesoMasaTeorico", "createdAt", "updatedAt")
SELECT gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0074'), (SELECT id FROM insumos WHERE codigo='FRAG-055'), 'Fragancia Paco Lucky', 2.500, 125.0, NOW(), NOW()
WHERE EXISTS (SELECT 1 FROM formulas_master WHERE "codigoFormula"='FM-0074');
INSERT INTO formula_detalles (id, "formulaId", "insumoId", "nombreComponente", porcentaje, "pesoMasaTeorico", "createdAt", "updatedAt")
SELECT gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0074'), (SELECT id FROM insumos WHERE codigo='INS-095'), 'Glicerina', 3.000, 150.0, NOW(), NOW()
WHERE EXISTS (SELECT 1 FROM formulas_master WHERE "codigoFormula"='FM-0074');
INSERT INTO formula_detalles (id, "formulaId", "insumoId", "nombreComponente", porcentaje, "pesoMasaTeorico", "createdAt", "updatedAt")
SELECT gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0074'), (SELECT id FROM insumos WHERE codigo='INS-035'), 'Alcohol extra neutro 96%', 5.000, 250.0, NOW(), NOW()
WHERE EXISTS (SELECT 1 FROM formulas_master WHERE "codigoFormula"='FM-0074');

-- =======================================================
-- 4. CREAR FM-0075: CREMA HIDRATANTE DE CENTELLA ASIATICA
-- =======================================================
INSERT INTO formulas_master (id, "codigoFormula", "nombreProducto", version, "densidadTeorica", estado, "createdAt", "updatedAt", "pasos_elaboracion")
SELECT gen_random_uuid(), 'FM-0075', 'CREMA HIDRATANTE DE CENTELLA ASIATICA', 1, 1.0000, 'ACTIVA', NOW(), NOW(), NULL
WHERE NOT EXISTS (SELECT 1 FROM formulas_master WHERE "codigoFormula" = 'FM-0075');

INSERT INTO formula_detalles (id, "formulaId", "insumoId", "nombreComponente", porcentaje, "pesoMasaTeorico", "createdAt", "updatedAt")
SELECT gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0075'), (SELECT id FROM insumos WHERE codigo='INS-030'), 'Agua desionizada', 83.050, 11627.0, NOW(), NOW()
WHERE EXISTS (SELECT 1 FROM formulas_master WHERE "codigoFormula"='FM-0075');
INSERT INTO formula_detalles (id, "formulaId", "insumoId", "nombreComponente", porcentaje, "pesoMasaTeorico", "createdAt", "updatedAt")
SELECT gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0075'), (SELECT id FROM insumos WHERE codigo='INS-034'), 'Alcohol cetilico', 5.500, 770.0, NOW(), NOW()
WHERE EXISTS (SELECT 1 FROM formulas_master WHERE "codigoFormula"='FM-0075');
INSERT INTO formula_detalles (id, "formulaId", "insumoId", "nombreComponente", porcentaje, "pesoMasaTeorico", "createdAt", "updatedAt")
SELECT gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0075'), (SELECT id FROM insumos WHERE codigo='INS-069'), 'Dehyquart', 5.500, 770.0, NOW(), NOW()
WHERE EXISTS (SELECT 1 FROM formulas_master WHERE "codigoFormula"='FM-0075');
INSERT INTO formula_detalles (id, "formulaId", "insumoId", "nombreComponente", porcentaje, "pesoMasaTeorico", "createdAt", "updatedAt")
SELECT gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0075'), (SELECT id FROM insumos WHERE codigo='INS-005'), 'Aceite de ricino', 2.000, 280.0, NOW(), NOW()
WHERE EXISTS (SELECT 1 FROM formulas_master WHERE "codigoFormula"='FM-0075');
INSERT INTO formula_detalles (id, "formulaId", "insumoId", "nombreComponente", porcentaje, "pesoMasaTeorico", "createdAt", "updatedAt")
SELECT gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0075'), (SELECT id FROM insumos WHERE codigo='INS-063'), 'Colageno hidrolizado', 1.000, 140.0, NOW(), NOW()
WHERE EXISTS (SELECT 1 FROM formulas_master WHERE "codigoFormula"='FM-0075');
INSERT INTO formula_detalles (id, "formulaId", "insumoId", "nombreComponente", porcentaje, "pesoMasaTeorico", "createdAt", "updatedAt")
SELECT gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0075'), (SELECT id FROM insumos WHERE codigo='INS-080'), 'Extracto de centella asiatica', 0.500, 70.0, NOW(), NOW()
WHERE EXISTS (SELECT 1 FROM formulas_master WHERE "codigoFormula"='FM-0075');
INSERT INTO formula_detalles (id, "formulaId", "insumoId", "nombreComponente", porcentaje, "pesoMasaTeorico", "createdAt", "updatedAt")
SELECT gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0075'), (SELECT id FROM insumos WHERE codigo='INS-020'), 'Acido hialuronico', 0.050, 7.0, NOW(), NOW()
WHERE EXISTS (SELECT 1 FROM formulas_master WHERE "codigoFormula"='FM-0075');
INSERT INTO formula_detalles (id, "formulaId", "insumoId", "nombreComponente", porcentaje, "pesoMasaTeorico", "createdAt", "updatedAt")
SELECT gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0075'), (SELECT id FROM insumos WHERE codigo='INS-095'), 'Glicerina', 2.000, 280.0, NOW(), NOW()
WHERE EXISTS (SELECT 1 FROM formulas_master WHERE "codigoFormula"='FM-0075');
INSERT INTO formula_detalles (id, "formulaId", "insumoId", "nombreComponente", porcentaje, "pesoMasaTeorico", "createdAt", "updatedAt")
SELECT gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0075'), (SELECT id FROM insumos WHERE codigo='INS-133'), 'Procide CG', 0.200, 28.0, NOW(), NOW()
WHERE EXISTS (SELECT 1 FROM formulas_master WHERE "codigoFormula"='FM-0075');
INSERT INTO formula_detalles (id, "formulaId", "insumoId", "nombreComponente", porcentaje, "pesoMasaTeorico", "createdAt", "updatedAt")
SELECT gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0075'), (SELECT id FROM insumos WHERE codigo='FRAG-066'), 'Fragancia vainilla', 0.200, 28.0, NOW(), NOW()
WHERE EXISTS (SELECT 1 FROM formulas_master WHERE "codigoFormula"='FM-0075');

-- ===============================================
-- 5. ACTUALIZAR FM-0073: CREMA CORRECTORA LABIOS
--    agua 65% (650g) -> 61.75% (617.5g)
-- ===============================================
UPDATE formula_detalles SET porcentaje = 61.750, "pesoMasaTeorico" = 617.5, "updatedAt" = NOW()
WHERE "formulaId" = (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0073')
  AND "insumoId" = (SELECT id FROM insumos WHERE codigo='INS-030');

-- ==============================================================
-- 6. ACTUALIZAR FM-0072: GEL INTIMO
--    quitar acido lactico (INS-022); benzoato 0.3% -> 0.25%
-- ==============================================================
DELETE FROM formula_detalles WHERE "formulaId" = (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0072')
  AND "insumoId" = (SELECT id FROM insumos WHERE codigo='INS-022');
UPDATE formula_detalles SET porcentaje = 0.250, "pesoMasaTeorico" = 2.5, "updatedAt" = NOW()
WHERE "formulaId" = (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0072')
  AND "insumoId" = (SELECT id FROM insumos WHERE codigo='INS-043');

-- =========================================================
-- 7. ACTUALIZAR FM-0034: BARRA REDUCCION DE ARRUGAS
--    receta real produccion: vaselina 78.5 / cera virgen 10 / carnauba 8 / cetilico 3 / vitE 0.1 / dioxido 0.2 / fragancia rosas 0.2
-- =========================================================
DELETE FROM formula_detalles WHERE "formulaId" = (SELECT id FROM formulas_master WHERE "codigoFormula" = 'FM-0034');
INSERT INTO formula_detalles (id, "formulaId", "insumoId", "nombreComponente", porcentaje, "pesoMasaTeorico", "createdAt", "updatedAt")
VALUES
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0034'), (SELECT id FROM insumos WHERE codigo='INS-159'), 'Vaselina liquida', 78.500, 3925.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0034'), (SELECT id FROM insumos WHERE codigo='INS-057'), 'Cera de abeja virgen', 10.000, 500.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0034'), (SELECT id FROM insumos WHERE codigo='INS-055'), 'Cera carnauba', 8.000, 400.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0034'), (SELECT id FROM insumos WHERE codigo='INS-034'), 'Alcohol cetilico', 3.000, 150.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0034'), (SELECT id FROM insumos WHERE codigo='INS-162'), 'Vitamina E', 0.100, 5.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0034'), (SELECT id FROM insumos WHERE codigo='INS-070'), 'Dioxido de titanio', 0.200, 10.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0034'), (SELECT id FROM insumos WHERE codigo='FRAG-062'), 'Fragancia rosas', 0.200, 10.0, NOW(), NOW());

-- ==========================================================
-- 8. ACTUALIZAR FM-0018: SERUM LIQUIDO DE ALOE VERA (7 KG)
--    receta real produccion, incl. fragancia mil flores
-- ==========================================================
DELETE FROM formula_detalles WHERE "formulaId" = (SELECT id FROM formulas_master WHERE "codigoFormula" = 'FM-0018');
INSERT INTO formula_detalles (id, "formulaId", "insumoId", "nombreComponente", porcentaje, "pesoMasaTeorico", "createdAt", "updatedAt")
VALUES
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0018'), (SELECT id FROM insumos WHERE codigo='INS-030'), 'Agua desionizada', 88.483, 6223.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0018'), (SELECT id FROM insumos WHERE codigo='INS-095'), 'Glicerina', 4.977, 350.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0018'), (SELECT id FROM insumos WHERE codigo='INS-134'), 'Propilenglicol', 2.986, 210.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0018'), (SELECT id FROM insumos WHERE codigo='INS-067'), 'D-Pantenol o Pantenol', 0.100, 7.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0018'), (SELECT id FROM insumos WHERE codigo='INS-077'), 'Extracto de aloe vera', 0.995, 70.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0018'), (SELECT id FROM insumos WHERE codigo='INS-122'), 'Niacinamida vitamina B3', 0.100, 7.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0018'), (SELECT id FROM insumos WHERE codigo='INS-054'), 'Cellosize', 1.095, 77.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0018'), (SELECT id FROM insumos WHERE codigo='INS-154'), 'Trietanolamina (TEA)', 1.095, 77.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0018'), (SELECT id FROM insumos WHERE codigo='FRAG-049'), 'Fragancia mil flores', 0.014, 1.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0018'), (SELECT id FROM insumos WHERE codigo='INS-043'), 'Benzoato', 0.100, 7.0, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0018'), (SELECT id FROM insumos WHERE codigo='INS-147'), 'Sorbato de potasio', 0.057, 4.0, NOW(), NOW());

-- =============================================
-- 9. DESACTIVAR FM-0063 (duplicado SERUM ALOE)
-- =============================================
UPDATE formulas_master SET estado = 'INACTIVA', "updatedAt" = NOW()
WHERE "codigoFormula" = 'FM-0063';

COMMIT;

\echo === Verificacion post-migracion ===
SELECT f."codigoFormula", f."nombreProducto", f.estado,
       COUNT(d.id) AS n_detalles,
       ROUND(SUM(d.porcentaje)::numeric, 3) AS suma_pct,
       ROUND(SUM(d."pesoMasaTeorico")::numeric, 3) AS suma_peso
FROM formulas_master f
LEFT JOIN formula_detalles d ON d."formulaId" = f.id
WHERE f."codigoFormula" IN ('FM-0043','FM-0048','FM-0074','FM-0075','FM-0073','FM-0072','FM-0034','FM-0018','FM-0063')
GROUP BY f."codigoFormula", f."nombreProducto", f.estado
ORDER BY f."codigoFormula";