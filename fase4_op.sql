INSERT INTO ordenes_produccion (
  id,
  "codigoLote",
  "clienteNombre",
  "colorEspecificado",
  "fraganciaEspecificada",
  prioridad,
  "pasoProceso",
  "formulaId",
  "cantidadPlanificada",
  estado,
  "supervisorId",
  "pedido_comercial_id",
  "updatedAt"
)
SELECT
  gen_random_uuid()::text,
  'LOT-2026-' || regexp_replace(p.codigo_orden, '\D', '', 'g'),
  p.cliente_nombre,
  COALESCE(p.color_text, p.color, 'TRANSPARENTE'),
  COALESCE(p.aroma_text, p.aroma, 'SIN FRAGANCIA'),
  p.prioridad::text,
  'PENDIENTE_ASIGNACION',
  p.formula_id,
  CASE p.unidad_medida
    WHEN 'KG' THEN p.cantidad_solicitada * 1000
    WHEN 'LT' THEN p.cantidad_solicitada * 1000
    WHEN 'ML' THEN p.cantidad_solicitada
    WHEN 'G'  THEN p.cantidad_solicitada
    ELSE p.cantidad_solicitada * 1000
  END,
  'EN_PROCESO',
  'aaaaaaaa-0001-4000-8000-000000000001',
  p.id,
  now()
FROM pedidos_comerciales p
WHERE p.formula_id IS NOT NULL
ON CONFLICT ("codigoLote") DO NOTHING;