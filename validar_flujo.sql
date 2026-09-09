\echo === 1. CLIENTES ===
SELECT COUNT(*) AS total_clientes FROM clientes;

\echo === 2. PEDIDOS COMERCIALES (total + vínculos) ===
SELECT COUNT(*) AS total_pedidos, COUNT(*) FILTER (WHERE formula_id IS NOT NULL) AS con_formula, COUNT(*) FILTER (WHERE cliente_id IS NOT NULL) AS con_cliente FROM pedidos_comerciales;
SELECT codigo_orden, cliente_nombre, producto_nombre, cantidad_solicitada, unidad_medida, monto_total, doc_type, tipo_comprobante, estado
FROM pedidos_comerciales ORDER BY codigo_orden;

\echo === 3. CUENTAS POR COBRAR ===
SELECT COUNT(*) AS total_cc, COUNT(*) FILTER (WHERE estado='PAGADO') AS pagadas, COUNT(*) FILTER (WHERE estado='PENDIENTE') AS pendientes,
       ROUND(SUM(monto_total)::numeric,2) AS monto_total, ROUND(SUM(saldo_pendiente)::numeric,2) AS saldo_pendiente
FROM cuentas_cobrar;
SELECT codigo_doc, cliente_nombre, orden_prod, monto_total, saldo_pendiente, estado, fecha_emision FROM cuentas_cobrar ORDER BY fecha_emision DESC LIMIT 6;

\echo === 4. ORDENES DE PRODUCCION ===
SELECT COUNT(*) AS total_op, COUNT(*) FILTER (WHERE estado='APROBADO') AS aprobadas FROM ordenes_produccion;

\echo === 5. PEDIDOS SIN CC / CC SIN PEDIDO (consistencia) ===
SELECT 'Pedidos sin CC' AS tipo, COUNT(*) FROM pedidos_comerciales p
WHERE NOT EXISTS (SELECT 1 FROM cuentas_cobrar c WHERE c.orden_prod LIKE '%' || p.codigo_orden || '%');
SELECT 'CC sin pedido' AS tipo, COUNT(*) FROM cuentas_cobrar c
WHERE c.orden_prod IS NOT NULL AND c.orden_prod <> '' AND NOT EXISTS (SELECT 1 FROM pedidos_comerciales p WHERE c.orden_prod LIKE '%' || p.codigo_orden || '%');

\echo === 6. FORMULAS con vínculo a pedidos ===
SELECT f."codigoFormula", f."nombreProducto", COUNT(p.id) AS n_pedidos, ROUND(SUM(d.porcentaje)::numeric,3) AS suma_pct
FROM formulas_master f
LEFT JOIN pedidos_comerciales p ON p.formula_id = f.id
LEFT JOIN formula_detalles d ON d."formulaId" = f.id
WHERE f.estado = 'ACTIVA'
GROUP BY f."codigoFormula", f."nombreProducto"
ORDER BY f."codigoFormula";

\echo === 7. STOCK vs RECETA (suficiencia rápida para formulas con pedidos) ===
SELECT f."codigoFormula", f."nombreProducto", p.codigo_orden, p.cantidad_solicitada, p.unidad_medida,
  (SELECT COUNT(*) FROM formula_detalles d JOIN insumos i ON i.id=d."insumoId" WHERE d."formulaId"=f.id AND i."stockReal" < (p.cantidad_solicitada * d.porcentaje / 100)) AS insumos_con_faltante
FROM formulas_master f
JOIN pedidos_comerciales p ON p.formula_id = f.id
ORDER BY p.codigo_orden;