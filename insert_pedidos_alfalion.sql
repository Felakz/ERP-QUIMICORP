\echo === INSERT: Pedidos ALFALION 31-08-2026 + CC E001-227 ===
BEGIN;

-- Pedido 1: OP-20260831-06 (CREMA CORRECTORA PARA LABIOS, 11 KG, S/935)
INSERT INTO pedidos_comerciales
(id, codigo_orden, cliente_nombre, cliente_ruc, producto_nombre, cantidad_solicitada, unidad_medida, monto_total, fecha_prometida, prioridad, estado, formula_id, doc_type, tipo_comprobante, cliente_id, codigo_ref_admin, condicion_pago, created_at, updated_at)
VALUES
(gen_random_uuid(), 'OP-20260831-06', 'ALFALION INVESTMENT S.A.C.', '20612434124', 'CREMA CORRECTORA PARA LABIOS', 11, 'KG', 935.00, TIMESTAMP '2026-08-31 00:00:00', 'NORMAL', 'APROBADO', '62f75fd3-9938-4a48-9d13-5ccb7ff36358', 'OP', 'FACTURA', 'ae6b7139-1b14-4b8d-8752-1eb9812b7211', 'E001-227', 'Contado', NOW(), NOW())
ON CONFLICT (codigo_orden) DO NOTHING;

-- Pedido 2: OP-20260831-07 (BARRA REDUCCION DE ARRUGAS, 5 L, S/325)
INSERT INTO pedidos_comerciales
(id, codigo_orden, cliente_nombre, cliente_ruc, producto_nombre, cantidad_solicitada, unidad_medida, monto_total, fecha_prometida, prioridad, estado, formula_id, doc_type, tipo_comprobante, cliente_id, codigo_ref_admin, condicion_pago, created_at, updated_at)
VALUES
(gen_random_uuid(), 'OP-20260831-07', 'ALFALION INVESTMENT S.A.C.', '20612434124', 'BARRA REDUCCION DE ARRUGAS', 5, 'LT', 325.00, TIMESTAMP '2026-08-31 00:00:00', 'NORMAL', 'APROBADO', '3efa86f9-0038-4e71-8b81-06027b636880', 'OP', 'FACTURA', 'ae6b7139-1b14-4b8d-8752-1eb9812b7211', 'E001-227', 'Contado', NOW(), NOW())
ON CONFLICT (codigo_orden) DO NOTHING;

-- Cuenta por cobrar consolidada E001-227 = S/1,260 PAGADO
INSERT INTO cuentas_cobrar
(id, codigo_doc, cliente_id, cliente_nombre, cliente_ruc, orden_prod, producto, monto_total, saldo_pendiente, condicion_pago, dias_plazo, fecha_emision, fecha_vencimiento, fecha_pago, estado, created_at, updated_at)
VALUES
(gen_random_uuid(), 'E001-227', 'ae6b7139-1b14-4b8d-8752-1eb9812b7211', 'ALFALION INVESTMENT S.A.C.', '20612434124', 'OP-20260831-06, OP-20260831-07', 'CREAM LBS CUERO / BARRA RDX ARR AUTOMOTRIZ', 1260.00, 0.00, 'Contado', 0, TIMESTAMP '2026-08-31 00:00:00', TIMESTAMP '2026-08-31 00:00:00', TIMESTAMP '2026-08-31 00:00:00', 'PAGADO', NOW(), NOW())
ON CONFLICT (codigo_doc) DO NOTHING;

COMMIT;

\echo === Verificacion ===
SELECT codigo_orden, cliente_nombre, producto_nombre, cantidad_solicitada, unidad_medida, monto_total, estado, formula_id, cliente_id
FROM pedidos_comerciales WHERE codigo_orden IN ('OP-20260831-06','OP-20260831-07');
SELECT codigo_doc, cliente_nombre, orden_prod, monto_total, saldo_pendiente, estado, fecha_emision FROM cuentas_cobrar WHERE codigo_doc = 'E001-227';