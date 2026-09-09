\echo === FASE 1: CREAR FM-0076 SERUM FACIAL DE COLAGENO ===
BEGIN;

DELETE FROM formula_detalles WHERE "formulaId" = (SELECT id FROM formulas_master WHERE "codigoFormula" = 'FM-0076');
DELETE FROM formulas_master WHERE "codigoFormula" = 'FM-0076';

INSERT INTO formulas_master (id, "codigoFormula", "nombreProducto", version, "densidadTeorica", estado, "createdAt", "updatedAt")
SELECT gen_random_uuid(), 'FM-0076', 'SERUM FACIAL DE COLAGENO', 1, 1.0000, 'ACTIVA', NOW(), NOW();

INSERT INTO formula_detalles (id, "formulaId", "insumoId", "nombreComponente", porcentaje, "pesoMasaTeorico", "createdAt", "updatedAt")
SELECT gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0076'), (SELECT id FROM insumos WHERE codigo='INS-030'), 'Agua desionizada', 85.800, 4290.0, NOW(), NOW()
WHERE EXISTS (SELECT 1 FROM formulas_master WHERE "codigoFormula"='FM-0076');
INSERT INTO formula_detalles (id, "formulaId", "insumoId", "nombreComponente", porcentaje, "pesoMasaTeorico", "createdAt", "updatedAt")
SELECT gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0076'), (SELECT id FROM insumos WHERE codigo='INS-095'), 'Glicerina', 4.000, 200.0, NOW(), NOW()
WHERE EXISTS (SELECT 1 FROM formulas_master WHERE "codigoFormula"='FM-0076');
INSERT INTO formula_detalles (id, "formulaId", "insumoId", "nombreComponente", porcentaje, "pesoMasaTeorico", "createdAt", "updatedAt")
SELECT gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0076'), (SELECT id FROM insumos WHERE codigo='INS-134'), 'Propilenglicol', 3.000, 150.0, NOW(), NOW()
WHERE EXISTS (SELECT 1 FROM formulas_master WHERE "codigoFormula"='FM-0076');
INSERT INTO formula_detalles (id, "formulaId", "insumoId", "nombreComponente", porcentaje, "pesoMasaTeorico", "createdAt", "updatedAt")
SELECT gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0076'), (SELECT id FROM insumos WHERE codigo='INS-054'), 'Cellosize', 0.800, 40.0, NOW(), NOW()
WHERE EXISTS (SELECT 1 FROM formulas_master WHERE "codigoFormula"='FM-0076');
INSERT INTO formula_detalles (id, "formulaId", "insumoId", "nombreComponente", porcentaje, "pesoMasaTeorico", "createdAt", "updatedAt")
SELECT gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0076'), (SELECT id FROM insumos WHERE codigo='INS-154'), 'Trietanolamina (TEA)', 0.800, 40.0, NOW(), NOW()
WHERE EXISTS (SELECT 1 FROM formulas_master WHERE "codigoFormula"='FM-0076');
INSERT INTO formula_detalles (id, "formulaId", "insumoId", "nombreComponente", porcentaje, "pesoMasaTeorico", "createdAt", "updatedAt")
SELECT gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0076'), (SELECT id FROM insumos WHERE codigo='INS-063'), 'Colageno hidrolizado', 2.000, 100.0, NOW(), NOW()
WHERE EXISTS (SELECT 1 FROM formulas_master WHERE "codigoFormula"='FM-0076');
INSERT INTO formula_detalles (id, "formulaId", "insumoId", "nombreComponente", porcentaje, "pesoMasaTeorico", "createdAt", "updatedAt")
SELECT gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0076'), (SELECT id FROM insumos WHERE codigo='INS-067'), 'Pantenol', 1.000, 50.0, NOW(), NOW()
WHERE EXISTS (SELECT 1 FROM formulas_master WHERE "codigoFormula"='FM-0076');
INSERT INTO formula_detalles (id, "formulaId", "insumoId", "nombreComponente", porcentaje, "pesoMasaTeorico", "createdAt", "updatedAt")
SELECT gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0076'), (SELECT id FROM insumos WHERE codigo='INS-122'), 'Niacinamida', 2.000, 100.0, NOW(), NOW()
WHERE EXISTS (SELECT 1 FROM formulas_master WHERE "codigoFormula"='FM-0076');
INSERT INTO formula_detalles (id, "formulaId", "insumoId", "nombreComponente", porcentaje, "pesoMasaTeorico", "createdAt", "updatedAt")
SELECT gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0076'), (SELECT id FROM insumos WHERE codigo='INS-043'), 'Benzoato de sodio', 0.200, 10.0, NOW(), NOW()
WHERE EXISTS (SELECT 1 FROM formulas_master WHERE "codigoFormula"='FM-0076');
INSERT INTO formula_detalles (id, "formulaId", "insumoId", "nombreComponente", porcentaje, "pesoMasaTeorico", "createdAt", "updatedAt")
SELECT gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0076'), (SELECT id FROM insumos WHERE codigo='INS-147'), 'Sorbato de potasio', 0.100, 5.0, NOW(), NOW()
WHERE EXISTS (SELECT 1 FROM formulas_master WHERE "codigoFormula"='FM-0076');
INSERT INTO formula_detalles (id, "formulaId", "insumoId", "nombreComponente", porcentaje, "pesoMasaTeorico", "createdAt", "updatedAt")
SELECT gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0076'), (SELECT id FROM insumos WHERE codigo='INS-128'), 'Polisorbato 20', 0.100, 5.0, NOW(), NOW()
WHERE EXISTS (SELECT 1 FROM formulas_master WHERE "codigoFormula"='FM-0076');
INSERT INTO formula_detalles (id, "formulaId", "insumoId", "nombreComponente", porcentaje, "pesoMasaTeorico", "createdAt", "updatedAt")
SELECT gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0076'), (SELECT id FROM insumos WHERE codigo='FRAG-066'), 'Fragancia vainilla', 0.050, 2.5, NOW(), NOW()
WHERE EXISTS (SELECT 1 FROM formulas_master WHERE "codigoFormula"='FM-0076');
INSERT INTO formula_detalles (id, "formulaId", "insumoId", "nombreComponente", porcentaje, "pesoMasaTeorico", "createdAt", "updatedAt")
SELECT gen_random_uuid(), (SELECT id FROM formulas_master WHERE "codigoFormula"='FM-0076'), (SELECT id FROM insumos WHERE codigo='INS-017'), 'Acido citrico', 0.100, 5.0, NOW(), NOW()
WHERE EXISTS (SELECT 1 FROM formulas_master WHERE "codigoFormula"='FM-0076');

COMMIT;

\echo === Verificar FM-0076 ===
SELECT f."codigoFormula", f."nombreProducto", f.estado,
       COUNT(d.id) AS n_detalles, ROUND(SUM(d.porcentaje)::numeric, 3) AS suma_pct, 9997.5 AS peso_lote_5kg
FROM formulas_master f LEFT JOIN formula_detalles d ON d."formulaId" = f.id
WHERE f."codigoFormula" = 'FM-0076' GROUP BY f.id;