# Unidades de inventario y kardex

## Contrato de cantidades

El stock de masa se guarda en **GR**, el de volumen en **ML** y los envases en **UN**. Esto aplica a `stockReal`, `stockTeorico`, `stockMinimo` y a las cantidades y saldos de los nuevos movimientos de insumos en ambos kardex.

`Insumo.unidadMedida` conserva la unidad comercial; `costoUnitario` es el precio por esa unidad. Por ejemplo, una ficha KG con stock 1000 y costo 10 representa 1000 GR valorizados en S/ 10. No se vuelve a multiplicar el stock existente por 1000.

Las altas reciben stock inicial y mínimo en la unidad elegida en el formulario; las reposiciones reciben cantidad en la unidad comercial de la ficha; las compras usan la unidad de cada línea. Se convierten una sola vez a la unidad base. La edición del stock existente recibe el saldo absoluto en la unidad base, indicada en el formulario. El costo de cada movimiento se convierte inversamente para conservar su valor monetario.

Los movimientos manuales admiten `unidadMedida` explícita. Sin ella, la cantidad se interpreta en la unidad base del insumo. Los ajustes finos usan GR por defecto: una adición al lote consume almacén y una devolución al almacén lo repone, dentro de la misma transacción que el ajuste.

Los lotes vinculados a pedidos usan la unidad del pedido; los lotes creados directamente se expresan en KG. Los consumos porcentuales se calculan en masa. La densidad de la fórmula permite convertir el volumen del lote a masa, pero **no sustituye la densidad específica de un ingrediente** almacenado en volumen: ese consumo se rechaza en lugar de asumir que un litro pesa un kilo.

## Alcance del cambio

- Producción y validación de disponibilidad: consumo convertido a gramos, lectura del stock bajo bloqueo, rechazo de stock insuficiente y de una segunda liberación del lote.
- Compras, altas, reposiciones, edición de stock, movimientos manuales y adicionales de despacho: entradas/salidas en la unidad base y costo proporcional.
- Los ajustes del inventario actualizan stock y ambas trazas dentro de una transacción; los errores de escritura ya no se silencian.
- Administración y producción muestran la unidad del saldo separada de la unidad histórica del movimiento. Los totales separan masa, volumen y unidades. Las filas vinculadas cuyo rótulo difiere de la unidad base se marcan por conciliar y se excluyen de los totales; esto no identifica por sí solo todos los errores históricos.
- Las consultas agrupadas separan insumos y unidades; no infieren stock inicial cuando la unidad del movimiento y la del saldo difieren.

## Histórico y despliegue

Esta modificación de código **no reescribe el histórico, no ajusta saldos existentes y no se ha desplegado**. Publicar frontend y backend hace que los nuevos movimientos apliquen la regla; no corrige automáticamente cantidades previamente descontadas ni acredita la unidad real de cada saldo antiguo.

El diagnóstico se ejecuta con `node backend/scripts/audit-kardex-units.cjs`. Lee la base configurada en `backend/.env` dentro de una transacción PostgreSQL `READ ONLY` y guarda los resultados locales en `reports/kardex-units/`. No imprime credenciales. La coincidencia entre consumo histórico y fórmula actual es evidencia para revisar, no prueba de la receta vigente en la fecha del movimiento.

Antes de publicar en la web existente, contrastar en una copia de la base las fichas y precios comerciales, especialmente las fichas KG/L cuyo stock fue cargado por distintos importadores. Los scripts antiguos de carga no forman parte del flujo normal corregido y no deben reutilizarse sin adaptar sus unidades.

Para conciliar, conservar una copia de los registros, revisar documentos y receta de cada movimiento candidato y contrastar los ajustes posteriores con el inventario físico. Preparar ajustes trazables por insumo; no multiplicar todo el histórico ni restar la suma de diferencias estimadas al saldo actual. Los tres stocks negativos detectados también requieren conciliación física.

`node backend/scripts/reconcile-kardex-preview.cjs` produce una segunda simulación más estricta. Delimita cada liberación mediante la entrada de producto terminado escrita al final de `aprobarLote`, conserva la primera liberación completa y clasifica las posteriores como duplicadas. Para distinguir una cantidad histórica ya expresada en gramos de otra expresada realmente en kilos, compara su escala con el lote y los componentes de la fórmula; la diferencia de escala es 1,000, por lo que admite cambios ordinarios en una fórmula mutable. Cada salida propuesta debe coincidir además con una traza inmutable que demuestre el descuento aplicado.

La simulación separa conversiones KG→GR, rótulos KG que ya contienen gramos, salidas de liberaciones duplicadas, entradas duplicadas de producto terminado y casos ambiguos. El reporte se invalida si la base cambia antes de aplicar la conciliación y debe regenerarse inmediatamente antes de cualquier escritura.

## Verificación local

```text
npm --prefix backend run build
node --test backend/test/stock-units.test.cjs
npm --prefix frontend run build
```

Las pruebas usan servicios con repositorios simulados; no escriben en la base desplegada. Cubren conversiones, el caso 98,640.65 GR − 7.86 KG = 90,780.65 GR, valuación, stock insuficiente, liberación repetida, movimientos manuales, altas, reposiciones, despacho y totales por unidad. No sustituyen una prueba del despliegue conectado con datos conciliados.
