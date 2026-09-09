SELECT f."codigoFormula", f."nombreProducto", f."densidadTeorica", f.version, f.estado
FROM formulas_master f WHERE f."codigoFormula"='FM-0075';
SELECT d."nombreComponente", d."skuComponente", d.porcentaje, d."pesoMasaTeorico"
FROM formula_detalles d JOIN formulas_master f ON f.id=d."formulaId"
WHERE f."codigoFormula"='FM-0075' ORDER BY d."pesoMasaTeorico" DESC;