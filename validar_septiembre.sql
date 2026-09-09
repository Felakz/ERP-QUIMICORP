\echo === FORMULAS candidates por producto ===
SELECT f."codigoFormula", f."nombreProducto", f.estado FROM formulas_master f
WHERE LOWER(f."nombreProducto") LIKE '%cicatric%' OR LOWER(f."nombreProducto") LIKE '%verruga%'
   OR LOWER(f."nombreProducto") LIKE '%colageno%' OR LOWER(f."nombreProducto") LIKE '%elhoe%'
   OR LOWER(f."nombreProducto") LIKE '%pesta%' OR LOWER(f."nombreProducto") LIKE '%aloe%'
   OR LOWER(f."nombreProducto") LIKE '%magnaesio%' OR LOWER(f."nombreProducto") LIKE '%magnesio%'
   OR LOWER(f."nombreProducto") LIKE '%derma bee%' OR LOWER(f."nombreProducto") LIKE '%daruma%'
   OR LOWER(f."nombreProducto") LIKE '%clareador%' OR LOWER(f."nombreProducto") LIKE '%muscular%'
   OR LOWER(f."nombreProducto") LIKE '%antivello%' OR LOWER(f."nombreProducto") LIKE '%intimo%'
   OR LOWER(f."nombreProducto") LIKE '%lucky%' OR LOWER(f."nombreProducto") LIKE '%barra%'
   OR LOWER(f."nombreProducto") LIKE '%centella%' OR LOWER(f."nombreProducto") LIKE '%feromona%'
ORDER BY f."codigoFormula";

\echo === CLIENTES candidates (setiembre) ===
SELECT id, "razonSocial", "ruc", "condicionPago", telefono FROM clientes
WHERE "razonSocial" ILIKE '%DEUS%' OR "razonSocial" ILIKE '%FENIX%' OR "razonSocial" ILIKE '%RORY%'
   OR "razonSocial" ILIKE '%SERPA%' OR "razonSocial" ILIKE '%NEXARA%' OR "razonSocial" ILIKE '%ALFALION%'
   OR "razonSocial" ILIKE '%MARIN%' OR "razonSocial" ILIKE '%SAUCEDO%' OR "razonSocial" ILIKE '%SANTOS%'
ORDER BY "razonSocial";