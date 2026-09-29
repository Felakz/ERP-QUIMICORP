# Monitoreo y rentabilidad

## Sentry

El cliente usa `NEXT_PUBLIC_SENTRY_DSN`; Railway usa `SENTRY_DSN`. Inicialización del backend antes de NestJS e inicialización de servidor/edge mediante `instrumentation.ts`. El SDK de backend se actualizó a 11 para registrar Logs estructurados, además de errores y trazas.

Se registran ruta, método, resultado, duración, usuario y rol de las solicitudes que alcanzan los controladores. Las acciones del frontend quedan como breadcrumbs y los cambios/error de API como Logs. No se envían cuerpos, tokens ni cookies explícitamente en esos registros. Las solicitudes rechazadas antes del interceptor pueden aparecer en trazas/errores, pero no se promete auditoría completa de todas las acciones. AuditLog de la base sigue siendo el registro de cambios de negocio.

Replay reproduce las interacciones dentro de la web, con textos y entradas enmascarados y medios bloqueados. No graba el escritorio ni otras aplicaciones. Muestreo temporal por defecto: 100% de sesiones y errores; se puede reducir/desactivar con `NEXT_PUBLIC_SENTRY_REPLAY_SAMPLE_RATE` y `NEXT_PUBLIC_SENTRY_REPLAY_ON_ERROR_SAMPLE_RATE` (0 a 1; ambos 0 desactivan Replay) y ajustar trazas con `NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE` / `SENTRY_TRACES_SAMPLE_RATE`. El consumo depende de las cuotas del proyecto Sentry.

En Sentry: **Issues** para errores, **Logs** para operaciones y **Replays** para sesiones. Filtrar por ambiente, release y usuario (ID). Para sourcemaps privados, configurar `SENTRY_AUTH_TOKEN`, `SENTRY_ORG` y `SENTRY_PROJECT` en Vercel; no publicar el token. Un DSN configurado no acredita por sí solo que el despliegue activo esté enviando eventos.

Validación de recepción realizada: evento sintético `420269fc16174b628c6deee2391579f4`, ambiente `diagnostic`, HTTP 200. Esto acredita la aceptación por Sentry del evento de diagnóstico, no la recepción de Replay desde producción. Tras desplegar backend y frontend, abrir una sesión de la web y verificar su Replay/Logs en el proyecto.

## Rentabilidad

Administración → Facturación / Rentabilidad muestra total, clientes y pedidos. Seleccionar el cliente filtra sus pedidos; **Ver cálculo** abre comprobantes, lotes, cantidades, unidades, costos por insumo, devoluciones y adicionales.

El período usa fechas de emisión de comprobantes. Los mismos comprobantes y pedidos vinculados alimentan total, cliente y pedido: no se mezcla facturación de un mes con pedidos creados en otro. El reporte considera el total de comprobantes como precio con IGV 18%, según el flujo actual del sistema, y muestra venta neta `total / 1,18`.

Costo validado parcial = salidas valorizadas de insumos de los lotes − devoluciones valorizadas + adicionales/envases del despacho. Los movimientos históricos sin evidencia de unidad del costo o con valorización pendiente quedan visibles en el detalle, pero se excluyen del costo validado; no se inventan sus importes. No se vuelve a sumar el costo de entrada del producto terminado. La fórmula maestra actual no modifica retrospectivamente ese costo. Compras y cobros se muestran aparte como flujos y no se restan nuevamente.

Margen bruto de materiales = `(facturado sin IGV − costos registrados) / facturado sin IGV × 100`. No representa utilidad neta empresarial. Si faltan valorizaciones, fabricación, vínculos, entregas o asignación de facturación parcial, el porcentaje definitivo figura **Por validar**; la diferencia y el porcentaje figuran Por validar. El costo mostrado solo incluye la parte con evidencia; no representa el costo completo cuando hay pendientes.

La configuración mensual de costos operativos se conserva como proyección: suma de mano de obra, supervisión, depreciación, energía y local, dividida por cantidad base, multiplicada por masa fabricada documentada. No se infiere masa a partir de litros. La proyección no reemplaza gastos reales ni asegura asignación contable. Comprobantes sin pedido y monedas extranjeras pendientes de conversión requieren conciliación. No se modificaron datos de producción.
