import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { cantidadEnStock, costoPorUnidadStock, unidadStock } from '../common/stock-units';

export async function despacharLote(prisma: any, colaId: string, numeroGuia: string | undefined, options: any = {}) {
  if (!colaId) throw new BadRequestException('Se requiere el registro de despacho.');
  return prisma.$transaction(async (tx: any) => {
    await tx.$queryRaw`SELECT id FROM cola_despacho WHERE id = ${colaId} FOR UPDATE`;
    const queue = await tx.colaDespacho.findUnique({ where: { id: colaId } });
    if (!queue) throw new NotFoundException('No se encontró el registro de despacho.');
    if (queue.estado === 'DESPACHADO') return { ...queue, repetido: true, envaseDescontado: [] };
    const order = await tx.ordenProduccion.findFirst({ where: { codigoLote: queue.loteCodigo }, include: { pedidoItem: true } });
    if (!order || order.pasoProceso !== 'LIBERADO_QA') throw new BadRequestException('El lote debe estar liberado por QA antes del despacho.');
    await tx.$queryRaw`SELECT id FROM ordenes_produccion WHERE id = ${order.id} FOR UPDATE`;
    if (order.pedidoComercialId) await tx.$queryRaw`SELECT id FROM pedidos_comerciales WHERE id = ${order.pedidoComercialId} FOR UPDATE`;
    const extras = order.pedidoComercialId && order.pedidoItem ? await tx.pedidoAdicional.findMany({
      where: { pedidoId: order.pedidoComercialId, itemIndex: order.pedidoItem.indice, kardexDescontado: false },
      include: { insumo: { include: { familia: true } } },
    }) : [];
    if (order.pedidoComercialId && !order.pedidoItemId && await tx.pedidoAdicional.count({ where: { pedidoId: order.pedidoComercialId, kardexDescontado: false } })) {
      throw new BadRequestException('Concilie la línea del lote antes de descontar adicionales del pedido.');
    }
    const packaging = options.envaseCliente ? [] : [
      ...(options.envaseSku ? [{ sku: options.envaseSku, cantidad: options.envaseCantidad }] : []),
      ...(options.envasesSecundarios?.length ? options.envasesSecundarios : options.envaseSku2 ? [{ sku: options.envaseSku2, cantidad: options.envaseCantidad2 }] : []),
    ];
    if (packaging.length > 6) throw new BadRequestException('Máximo un envase principal y cinco secundarios.');
    const requirements = new Map<string, { amount: Prisma.Decimal; category: string }>();
    for (const extra of extras) {
      if (!extra.insumoId) continue; // Tools/services without inventory are not physical stock.
      const remaining = new Prisma.Decimal(extra.cantidad).minus(extra.cantidadDespachada);
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
    const document = numeroGuia?.trim() || `DESPACHO-${queue.loteCodigo}`;
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
        tipoOperacion: 'SALIDA_VENTA', cantidadEntrada: 0, cantidadSalida: required.amount, saldoFinal: next,
        costoUnitario: cost, montoSalidaPen: required.amount.mul(cost), montoSaldoPen: next.mul(cost), insumoId: id } });
      await tx.kardexInmutable.create({ data: { insumoId: id, tipoMovimiento: 'SALIDA', cantidad: required.amount,
        stockAnterior: stock, stockNuevo: next, documentoReferencia: document, usuarioId: order.supervisorId } });
      consumed.push({ sku: item.codigo, nombre: item.nombre, cantidad: required.amount.toNumber(), saldo: next.toNumber() });
    }
    for (const extra of extras) await tx.pedidoAdicional.update({ where: { id: extra.id }, data: { cantidadDespachada: extra.cantidad, kardexDescontado: true } });
    const outputs = await tx.kardexMovimiento.findMany({ where: { numero: queue.loteCodigo, categoriaKardex: 'PRODUCTO_TERMINADO', tipoOperacion: 'ENTRADA_PRODUCCION' } });
    if (outputs.length !== 1 || !['GR','ML'].includes(outputs[0].unidadMedida)) throw new BadRequestException('La entrada de producto terminado requiere conciliación antes del despacho.');
    const output = outputs[0];
    await tx.kardexMovimiento.create({ data: { categoriaKardex: 'PRODUCTO_TERMINADO', productoNombre: output.productoNombre,
      familia: output.familia, categoriaNombre: output.categoriaNombre, proveedorCliente: queue.clienteNombre,
      unidadMedida: output.unidadMedida, fecha: new Date(), tipoDoc: 'GUIA', numero: document, otp: `OTP-${queue.loteCodigo}`,
      tipoOperacion: 'SALIDA_VENTA', cantidadEntrada: 0, cantidadSalida: output.cantidadEntrada, saldoFinal: 0,
      costoUnitario: output.costoUnitario, montoSalidaPen: output.montoEntradaPen, montoSaldoPen: 0, valoracionPendiente: output.valoracionPendiente } });
    const updated = await tx.colaDespacho.update({ where: { id: colaId }, data: { estado: 'DESPACHADO', numeroGuia: numeroGuia?.trim() || null,
      ...(options.envaseCliente ? { tipoEnvase: `${options.tipoEnvaseCliente?.trim() || 'ENVASE'} (PROVISTO POR CLIENTE)` } : {}) } });
    await tx.ordenProduccion.update({ where: { id: order.id }, data: { estado: 'DESPACHADO', pasoProceso: 'DESPACHADO' } });
    if (order.pedidoComercialId) {
      const lines = await tx.pedidoComercialItem.findMany({ where: { pedidoId: order.pedidoComercialId }, include: { lotes: true } });
      const lots = await tx.ordenProduccion.findMany({ where: { pedidoComercialId: order.pedidoComercialId } });
      if (lines.length && lines.every((l: any) => l.lotes.length) && lots.length && lots.every((l: any) => l.estado === 'DESPACHADO')) {
        await tx.pedidoComercial.update({ where: { id: order.pedidoComercialId }, data: { estado: 'ENTREGADO', fechaEntrega: new Date() } });
      }
    }
    return { ...updated, envaseDescontado: consumed, ordenId: order.id };
  }, { isolationLevel: 'Serializable', maxWait: 10000, timeout: 30000 });
}
