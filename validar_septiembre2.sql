\echo === ENUM tipo comprobante / estados pedido ===
SELECT enum_range(NULL::"TipoComprobantePedidoComercial");
SELECT enum_range(NULL::"EstadoCuentaCobrar");

\echo === Existencia COLAGENO / mostrador en formulas ===
SELECT "codigoFormula", "nombreProducto" FROM formulas_master WHERE LOWER("nombreProducto") LIKE '%colageno%';
SELECT "codigoFormula", "nombreProducto" FROM formulas_master WHERE LOWER("nombreProducto") LIKE '%mostrador%' OR LOWER("nombreProducto") LIKE '%ÑAUPARI%' OR LOWER("nombreProducto") LIKE '%ñaupari%';

\echo === Columnas con mostrador / contado en pedidos ===
SELECT column_name FROM information_schema.columns WHERE table_name='pedidos_comerciales' ORDER BY ordinal_position;

\echo === Ultimas CC por serie para continuar secuencia ===
SELECT codigo_doc, fecha_emision, estado FROM cuentas_cobrar ORDER BY codigo_doc DESC LIMIT 5;