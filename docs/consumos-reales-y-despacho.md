# Consumos reales y entregas parciales

Cotizaciones y pedidos conservan la cantidad, unidad y precio comerciales. La masa documentada de planificación permite estimar la receta; no acredita el consumo físico.

En **Producción → QA**, activar **Cantidades realmente utilizadas** y registrar el total de cada ingrediente, incluyendo ajustes ya descontados, con referencia a la hoja de fabricación. Para stock en gramos se puede introducir GR o KG; 5 KG se convierten una sola vez a 5.000 GR. Para stock en mililitros se permite ML o LT. No se supone equivalencia entre litros y kilos.

La liberación requiere todos los ingredientes, admite cero justificado y descuenta únicamente el total declarado menos los movimientos previos del lote. Bloquea stock insuficiente, unidades históricas incongruentes y consumos inferiores a lo ya descontado (requieren devolución documentada). Los ingredientes adicionales fuera de la receta requieren conciliación antes de liberar. Los ajustes finos quedan bloqueados después de liberar.

El peso final bruto, tara y neto se conservan en el registro de QA, separados de la masa de planificación. No multiplican la fórmula ni sustituyen los pesajes de los insumos. La cantidad de producto realmente fabricado se registra en la unidad comercial del lote.

En **Producción → Etiquetas/Despacho**, registrar la cantidad efectivamente entregada en GR/KG o ML/LT según la unidad del lote, una guía distinta por entrega y las cantidades entregadas de los adicionales. El saldo pendiente permanece disponible. La entrega final exige completar los adicionales pendientes. El despacho descuenta producto terminado y envases/adicionales, sin repetir el consumo de materias primas. Una guía repetida con el mismo contenido no genera otro descuento; cambios sobre esa guía se rechazan.

## Despliegue y límites

Desplegar backend y frontend juntos. No hay cambio de esquema ni migración de datos históricos. El backend rechaza clientes antiguos que intenten liberar sin consumos reales o despachar sin cantidad y guía.

La exactitud depende de los pesajes y documentos introducidos. No se reconstruyen consumos históricos ni se presume qué agua se utilizó. Compras conserva sus validaciones existentes; esta entrega no incorpora una recepción en litros con peso medido independiente.

Validación: pruebas unitarias de unidades, consumos y fórmulas; pruebas HTTP con PostgreSQL local de ajustes previos, transacciones, entregas parciales, reintentos y unidades incompatibles. Las pruebas de integración rechazan cualquier base que no sea la copia local de validación.

## Nombre comercial del colorante

En Cotizaciones/Pedidos, cada pigmento seleccionado permite escribir **Nombre para el cliente** (hasta 120 caracteres). La vista previa, impresión y PDF muestran ese nombre; si falta, muestran **Color personalizado**. El nombre químico, código, ID del insumo y porcentaje se conservan para uso interno. El alias queda en los datos de la línea y se mantiene al convertir la cotización en pedido.
