import { createHash } from 'crypto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { cantidadEnStock, costoPorUnidadStock, unidadStock } from '../common/stock-units';

export async function despacharLote(prisma: any, colaId: string, numeroGuia: string | undefined, options: any = {}) {
  if (!colaId) throw new BadRequestException('Se requiere el registro de despacho.');
  return prisma.$transaction(async (tx: any) => {
    await tx.$queryRaw`SELECT id FROM cola_despacho WHERE id = ${colaId} FOR UPDATE`;
    const queue = await tx.colaDespacho.findUnique({ where: { id: colaId } });
    if (!queue) throw new NotFoundException('No se encontró el registro de despacho.');
    const order = await tx.ordenProduccion.findFirst({ where: { codigoLote: queue.loteCodigo }, include: { pedidoItem: true } });
    if (!order || !['LIBERADO_QA', 'DESPACHADO'].includes(order.pasoProceso)) throw new BadRequestException('El lote debe estar liberado por QA antes del despacho.');
    await tx.$queryRaw`SELECT id FROM ordenes_produccion WHERE id = ${order.id} FOR UPDATE`;
    if (order.pedidoComercialId) await tx.$queryRaw`SELECT id FROM pedidos_comerciales WHERE id = ${order.pedidoComercialId} FOR UPDATE`;
    const extras = order.pedidoComercialId && order.pedidoItem ? await tx.pedidoAdicional.findMany({
      where: { pedidoId: order.pedidoComercialId, itemIndex: order.pedidoItem.indice, kardexDescontado: false },
      include: { insumo: { include: { familia: true } } },
    }) : [];
    if (order.pedidoComercialId && !order.pedidoItemId && await tx.pedidoAdicional.count({ where: { pedidoId: order.pedidoComercialId, kardexDescontado: false } })) {
      throw new BadRequestException('Concilie la línea del lote antes de descontar adicionales del pedido.');
    }
    const outputs = await tx.kardexMovimiento.findMany({ where: { numero: queue.loteCodigo, categoriaKardex: 'PRODUCTO_TERMINADO', tipoOperacion: 'ENTRADA_PRODUCCION' } });
    if (outputs.length !== 1 || !['GR','ML'].includes(outputs[0].unidadMedida)) throw new BadRequestException('La entrada de producto terminado requiere conciliación antes del despacho.');
    const output = outputs[0];
    const previous = await tx.kardexMovimiento.findMany({ where: { otp: `OTP-${queue.loteCodigo}`, categoriaKardex: 'PRODUCTO_TERMINADO', tipoOperacion: 'SALIDA_VENTA' } });
    const document = numeroGuia?.trim();
    if (!document) throw new BadRequestException('Indique una guía única para esta entrega.');
    const repeated = previous.find((m: any) => m.numero === document);
    const amount = Number(options.cantidadEntregada);
    if (!Number.isFinite(amount) || amount <= 0 || !options.unidadEntrega) throw new BadRequestException('Registre la cantidad realmente entregada y su unidad.');
    if (unidadStock(options.unidadEntrega) !== output.unidadMedida) throw new BadRequestException('La entrega debe conservar la dimensión comercial del lote: no se convierten litros a kilos sin medición.');
    const delivered = new Prisma.Decimal(cantidadEnStock(amount, options.unidadEntrega, output.unidadMedida));
    const fingerprint = createHash('sha256').update(JSON.stringify({
      delivered: delivered.toString(), unit: output.unidadMedida,
      extras: options.adicionales || [], envaseCliente: !!options.envaseCliente,
      envaseSku: options.envaseSku || null, envaseCantidad: options.envaseCantidad || null,
      secundarios: options.envasesSecundarios || [], envaseSku2: options.envaseSku2 || null, envaseCantidad2: options.envaseCantidad2 || null,
      tipoEnvaseCliente: options.tipoEnvaseCliente || null, envaseClienteCantidad: options.envaseClienteCantidad || null,
    })).digest('hex');
    const snapshot = order.recetaSnapshot && typeof order.recetaSnapshot === 'object' ? order.recetaSnapshot : {};
    const history = Array.isArray(snapshot.entregas) ? snapshot.entregas : [];
    if (repeated) {
      const recorded = history.find((h: any) => h.guia === document);
      if (recorded && recorded.fingerprint !== fingerprint) throw new BadRequestException('La guía ya está registrada con otros datos de entrega.');
      if (!delivered.equals(repeated.cantidadSalida)) throw new BadRequestException('La guía ya fue registrada con otra cantidad.');
      return { ...queue, repetido: true, saldoPendiente: new Prisma.Decimal(output.cantidadEntrada).minus(previous.reduce((sum: Prisma.Decimal, m: any) => sum.plus(m.cantidadSalida), new Prisma.Decimal(0))).toNumber(), unidadSaldo: output.unidadMedida, envaseDescontado: [] };
    }
    if (queue.estado === 'DESPACHADO') throw new BadRequestException('El lote ya se entregó por completo.');
    const remaining = new Prisma.Decimal(output.cantidadEntrada).minus(previous.reduce((sum: Prisma.Decimal, m: any) => sum.plus(m.cantidadSalida), new Prisma.Decimal(0)));
    if (delivered.gt(remaining)) throw new BadRequestException('La entrega supera el saldo de producto terminado.');
    const balance = remaining.minus(delivered);
    const completed = balance.isZero();
    // Additional commercial items need an explicit amount on partial shipments.
    const extraAmounts = new Map<string, number>();
    if (options.adicionales != null && !Array.isArray(options.adicionales)) throw new BadRequestException('Adicionales inválidos.');
    for (const a of options.adicionales || []) {
      if (!a || extraAmounts.has(a.id) || !extras.some((e: any) => e.id === a.id) || !Number.isFinite(a.cantidad) || a.cantidad < 0) throw new BadRequestException('Cantidad o adicional inválido.');
      extraAmounts.set(a.id, a.cantidad);
    }
    for (const e of extras) {
      const available = new Prisma.Decimal(e.cantidad).minus(e.cantidadDespachada).toNumber();
      if (!extraAmounts.has(e.id)) {
        if (!completed) throw new BadRequestException('Indique cuántos adicionales entrega en este despacho parcial.');
        extraAmounts.set(e.id, available);
      }
      if (e.unidadMedida === 'UN' && !Number.isInteger(extraAmounts.get(e.id))) throw new BadRequestException('Los adicionales en UN requieren cantidades enteras.');
      if (extraAmounts.get(e.id) > available || (completed && extraAmounts.get(e.id) !== available)) throw new BadRequestException('La entrega final debe completar los adicionales pendientes sin excederlos.');
    }
    const packaging = [

      ...(!options.envaseCliente && options.envaseSku ? [{ sku: options.envaseSku, cantidad: options.envaseCantidad }] : []),
      ...(options.envasesSecundarios?.length ? options.envasesSecundarios : options.envaseSku2 ? [{ sku: options.envaseSku2, cantidad: options.envaseCantidad2 }] : []),
    ];
    if (packaging.length > 6) throw new BadRequestException('Máximo un envase principal y cinco secundarios.');
    const requirements = new Map<string, { amount: Prisma.Decimal; category: string }>();
    for (const extra of extras) {
      if (!extra.insumoId) continue; // Tools/services without inventory are not physical stock.
      const remaining = new Prisma.Decimal(extraAmounts.get(extra.id) || 0);
      if (remaining.lte(0)) continue;
      const amount = cantidadEnStock(remaining.toNumber(), extra.unidadMedida, extra.insumo);
      const current = requirements.get(extra.insumoId);
      requirements.set(extra.insumoId, { amount: (current?.amount || new Prisma.Decimal(0)).plus(amount), category: extra.categoria === 'ENVASES' ? 'ENVASE' : 'INSUMO' });
    }
    const includedIds = new Set(requirements.keys());
    for (const p of packaging) {
      const amount = Number(p.cantidad);
      if (!Number.isInteger(amount) || amount <= 0) throw new BadRequestException('Los envases requieren una cantidad entera positiva.');
      const item = await tx.insumo.findUnique({ where: { codigo: String(p.sku) } });
      if (!item || unidadStock(item) !== 'UN') throw new BadRequestException('Seleccione un envase existente con stock en UN.');
      if (includedIds.has(item.id)) throw new BadRequestException(`El envase ${item.codigo} ya está incluido en los adicionales; no lo registre nuevamente.`);
      const current = requirements.get(item.id);
      requirements.set(item.id, { amount: (current?.amount || new Prisma.Decimal(0)).plus(amount), category: 'ENVASE' });
    }
    const consumed = [];
    for (const id of [...requirements.keys()].sort()) {
      await tx.$queryRaw`SELECT id FROM insumos WHERE id = ${id} FOR UPDATE`;
      const item = await tx.insumo.findUniqueOrThrow({ where: { id }, include: { familia: true } });
      const required = requirements.get(id);
      const stock = new Prisma.Decimal(item.stockReal);
      if (stock.lt(required.amount)) throw new BadRequestException(`Stock insuficiente de ${item.codigo}.`);
      const next = stock.minus(required.amount).toDecimalPlaces(4);
      const cost = costoPorUnidadStock(Number(item.costoUnitario), item);
      await tx.insumo.update({ where: { id }, data: { stockReal: next } });
      await tx.kardexMovimiento.create({ data: { categoriaKardex: required.category, productoNombre: item.nombre,
        familia: item.familia.nombre, categoriaNombre: item.familia.nombre, proveedorCliente: `Despacho ${queue.loteCodigo} (${queue.clienteNombre})`,
        unidadMedida: unidadStock(item), fecha: new Date(), tipoDoc: 'GUIA', numero: document, otp: `OTP-${queue.loteCodigo}`,
        usuarioId: options.actorId || order.supervisorId, tipoOperacion: 'SALIDA_VENTA', cantidadEntrada: 0, cantidadSalida: required.amount, saldoFinal: next,
        costoUnitario: cost, montoSalidaPen: required.amount.mul(cost), montoSaldoPen: next.mul(cost), insumoId: id } });
      await tx.kardexInmutable.create({ data: { insumoId: id, tipoMovimiento: 'SALIDA', cantidad: required.amount,
        stockAnterior: stock, stockNuevo: next, documentoReferencia: document, usuarioId: options.actorId || order.supervisorId } });
      consumed.push({ sku: item.codigo, nombre: item.nombre, cantidad: required.amount.toNumber(), saldo: next.toNumber() });
    }
    for (const extra of extras) {
      const sent = new Prisma.Decimal(extra.cantidadDespachada).plus(extraAmounts.get(extra.id) || 0);
      await tx.pedidoAdicional.update({ where: { id: extra.id }, data: { cantidadDespachada: sent, kardexDescontado: sent.equals(extra.cantidad) } });
    }
    await tx.kardexMovimiento.create({ data: { categoriaKardex: 'PRODUCTO_TERMINADO', productoNombre: output.productoNombre,
      familia: output.familia, categoriaNombre: output.categoriaNombre, proveedorCliente: queue.clienteNombre,
      unidadMedida: output.unidadMedida, fecha: new Date(), tipoDoc: 'GUIA', numero: document, otp: `OTP-${queue.loteCodigo}`,
      usuarioId: options.actorId || order.supervisorId, tipoOperacion: 'SALIDA_VENTA', cantidadEntrada: 0, cantidadSalida: delivered, saldoFinal: balance,
      costoUnitario: output.costoUnitario, montoSalidaPen: delivered.mul(output.costoUnitario), montoSaldoPen: balance.mul(output.costoUnitario), valoracionPendiente: output.valoracionPendiente } });
    const updated = await tx.colaDespacho.update({ where: { id: colaId }, data: { estado: completed ? 'DESPACHADO' : 'LISTO_PARA_IMPRIMIR', numeroGuia: numeroGuia?.trim() || null,
      ...(options.envaseCliente ? { tipoEnvase: `${options.tipoEnvaseCliente?.trim() || 'ENVASE'} (PROVISTO POR CLIENTE)` } : {}) } });
    await tx.ordenProduccion.update({ where: { id: order.id }, data: {
      ...(completed ? { estado: 'DESPACHADO', pasoProceso: 'DESPACHADO' } : {}),
      recetaSnapshot: { ...snapshot, entregas: [...history, { guia: document, cantidad: delivered.toNumber(), unidad: output.unidadMedida, fingerprint, registradoPorId: options.actorId || order.supervisorId, fecha: new Date().toISOString() }] },
    } });
    if (order.pedidoComercialId) {
      const lines = await tx.pedidoComercialItem.findMany({ where: { pedidoId: order.pedidoComercialId }, include: { lotes: true } });
      const lots = await tx.ordenProduccion.findMany({ where: { pedidoComercialId: order.pedidoComercialId } });
      if (lines.length && lines.every((l: any) => l.lotes.length) && lots.length && lots.every((l: any) => l.estado === 'DESPACHADO')) {
        await tx.pedidoComercial.update({ where: { id: order.pedidoComercialId }, data: { estado: 'ENTREGADO', fechaEntrega: new Date() } });
      }
    }
    return { ...updated, saldoPendiente: balance.toNumber(), unidadSaldo: output.unidadMedida, envaseDescontado: consumed, ordenId: order.id };
  }, { isolationLevel: 'Serializable', maxWait: 10000, timeout: 30000 });
}
