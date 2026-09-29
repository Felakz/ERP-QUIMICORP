import { Prisma } from '@prisma/client';

const round = (n: number) => new Prisma.Decimal(n).toDecimalPlaces(2).toNumber();

/** Recorded costs are evidence. Missing valuation is never interpreted as free material. */
export function costoRegistradoPedido(order: any, movements: any[]) {
  const reasons: string[] = [];
  const lots = order.ordenesProduccion || [];
  const detail = lots.map((lot: any) => {
    const rows = movements.filter(m => m.numero === lot.codigoLote || m.otp === `OTP-${lot.codigoLote}`);
    const outputs = rows.filter(m => m.categoriaKardex === 'PRODUCTO_TERMINADO' && m.tipoOperacion === 'ENTRADA_PRODUCCION');
    const inputs = rows.filter(m => m.insumoId && m.tipoOperacion !== 'SALIDA_VENTA');
    const extras = rows.filter(m => m.insumoId && m.tipoOperacion === 'SALIDA_VENTA');
    const snapshot = lot.recetaSnapshot || {};
    const verified = (m: any) => {
      const evidence = (snapshot.consumos || []).find((c: any) => c.insumoId === m.insumoId && ['CONSUMO_REAL_DOCUMENTADO','TEORICO_SEGUN_RECETA'].includes(c.modo));
      const recordedShipment = m.tipoOperacion === 'SALIDA_VENTA' && (snapshot.entregas || []).some((e: any) => e.guia === m.numero && e.fingerprint);
      return !m.valoracionPendiente && ['GR','ML','UN'].includes(m.unidadMedida) && (evidence || recordedShipment) && Number(m.costoUnitario) > 0;
    };
    const knownInputs = inputs.filter(verified), knownExtras = extras.filter(verified);
    if ([...inputs,...extras].some(m=>!verified(m))) reasons.push(`${lot.codigoLote}: costos históricos sin evidencia de unidad/valorización; importes excluidos del costo confirmado`);
    const material = knownInputs.reduce((sum, m) => sum + Number(m.montoSalidaPen || 0) - Number(m.montoEntradaPen || 0), 0);
    const packaging = knownExtras.reduce((sum, m) => sum + Number(m.montoSalidaPen || 0) - Number(m.montoEntradaPen || 0), 0);
    if (outputs.length !== 1) reasons.push(`${lot.codigoLote}: fabricación pendiente o entrada de terminado por conciliar`);
    if (!inputs.length) reasons.push(`${lot.codigoLote}: no hay costos de consumos vinculados`);
    if ([...inputs, ...extras].some(m => m.valoracionPendiente || (Number(m.cantidadSalida) > 0 && Number(m.costoUnitario) <= 0))) reasons.push(`${lot.codigoLote}: valorización de insumos pendiente`);
    if (Number(lot.cantidadObtenida || 0) !== Number(lot.cantidadPlanificada || 0)) reasons.push(`${lot.codigoLote}: cantidad fabricada distinta de la planificada; asignación pendiente`);
    if (lot.estado !== 'DESPACHADO') reasons.push(`${lot.codigoLote}: entrega pendiente o parcial`);
    return { lote: lot.codigoLote, cantidad: Number(lot.cantidadObtenida || 0), unidad: lot.unidadMedida,
      materiales: round(material), adicionales: round(packaging), costo: round(material + packaging),
      movimientos: [...inputs, ...extras].map(m => ({ id: m.id, insumo: m.productoNombre, cantidadSalida: Number(m.cantidadSalida), cantidadEntrada: Number(m.cantidadEntrada), unidad: m.unidadMedida, costoUnitario: Number(m.costoUnitario), monto: round(Number(m.montoSalidaPen || 0) - Number(m.montoEntradaPen || 0)), pendiente: !verified(m) })) };
  });
  if (!lots.length) reasons.push('Pedido sin fabricación vinculada');
  if ((order.items || []).some((i: any) => !lots.some((l: any) => l.pedidoItemId === i.id))) reasons.push('Hay productos del pedido sin lote vinculado');
  const materials = round(detail.reduce((sum: number, d: any) => sum + d.materiales, 0));
  const extras = round(detail.reduce((sum: number, d: any) => sum + d.adicionales, 0));
  return { materiales: materials, adicionales: extras, costo: round(materials + extras), lotes: detail, pendientes: [...new Set(reasons)] };
}

export function resumirRentabilidad(ventas: any[]) {
  const sum = (key: string) => round(ventas.reduce((s, v) => s + Number(v[key] || 0), 0));
  const facturado = sum('facturado'), costo = sum('costo');
  const pending = ventas.filter(v => v.pendientes.length).length;
  const utilidad = round(facturado - costo);
  return { facturado, costo, invertido: costo, utilidad: pending ? null : utilidad, margen: !pending && facturado > 0 ? round(utilidad / facturado * 100) : null,
    margenIndicativo: !pending && facturado > 0 ? round(utilidad / facturado * 100) : null, pedidosPendientes: pending, ventas: ventas.length };
}
