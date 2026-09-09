SELECT codigo, nombre, "unidadMedida", id, "stockReal"
FROM insumos
WHERE LOWER(nombre) LIKE '%agua%' OR LOWER(nombre) LIKE '%glicerina%' OR LOWER(nombre) LIKE '%propilenglicol%'
   OR LOWER(nombre) LIKE '%cellosize%' OR LOWER(nombre) LIKE '%trietanolamina%' OR LOWER(nombre) LIKE '%colageno%'
   OR LOWER(nombre) LIKE '%pantenol%' OR LOWER(nombre) LIKE '%niacinamida%' OR LOWER(nombre) LIKE '%benzoato%'
   OR LOWER(nombre) LIKE '%sorbato%' OR LOWER(nombre) LIKE '%polisorbato%' OR LOWER(nombre) LIKE '%acido citrico%'
   OR LOWER(nombre) LIKE '%fragancia%'
ORDER BY nombre;