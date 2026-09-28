import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { createHash } from 'crypto';
import { cantidadPositiva, masaLoteKg, masaLoteOpcional, unidadComercial } from '../common/order-quantity';

const json = (text: string) => { try { return JSON.parse(text || '{}'); } catch { return {}; } };
const money = (value: any, name: string): Prisma.Decimal => {
  if (value === '' || value == null || typeof value === 'boolean' || Array.isArray(value) || !Number.isFinite(Number(value)) || Number(value) < 0) throw new BadRequestException(`${name} debe ser un número mayor o igual a cero.`);
  return new Prisma.Decimal(value);
};
const lotStarted = (lot: any) => !['PENDIENTE', 'EN_PROCESO'].includes(lot.estado) || lot.pasoProceso !== 'PENDIENTE_ASIGNACION' || !!lot.operariosAsignados || !!lot.fechaCierre;

export class CommercialOrderWorkflow {
  constructor(private readonly prisma: any, private readonly gateway: any) {}

  private async transaction<T>(run: (tx: any) => Promise<T>): Promise<T> {
    for (let attempt = 0; ; attempt++) {
      try { return await this.prisma.$transaction(run, { isolationLevel: 'Serializable', maxWait: 10000, timeout: 30000 }); }
      catch (error) { if (error.code !== 'P2034' || attempt >= 2) throw error; }
    }
  }

  private async audit(tx: any, actorId: string | undefined, id: string, action: string, before: any, after: any) {
    if (!actorId) return;
    const actor = await tx.usuario.findUnique({ where: { id: actorId } }) || await tx.usuario.findFirst({ where: { dni: '70000000' } });
    if (!actor) throw new BadRequestException('No se encontró un usuario ERP para registrar la auditoría.');
    await tx.auditLog.create({ data: { usuarioId: actor.id, accion: action, tablaAfectada: 'pedidos_comerciales', registroId: id,
      datosAnteriores: before ? JSON.parse(JSON.stringify(before)) : Prisma.JsonNull,
      datosNuevos: JSON.parse(JSON.stringify({ actorAutenticado: actorId, ...after })) } });
  }

  private emit(event: string, data: any) { this.gateway?.server?.emit(event, data); }

  private async code(tx: any, type: string, custom?: string): Promise<string> {
    if (custom) {
      const value = String(custom).trim();
      if (!value || value.length > 80) throw new BadRequestException('Código de pedido inválido.');
      if (await tx.pedidoComercial.findUnique({ where: { codigoOrden: value } })) throw new ConflictException('El código de pedido ya existe.');
      return value;
    }
    const year = new Date().getFullYear();
    await tx.$queryRaw`SELECT pg_advisory_xact_lock(hashtext(${`commercial-code-${type}-${year}`}))::text AS locked`;
    let sequence = await tx.pedidoComercial.count({ where: { docType: type } }) + 1;
    let code: string;
    do { code = `${type}-${year}-${String(sequence++).padStart(3, '0')}`; }
    while (await tx.pedidoComercial.findUnique({ where: { codigoOrden: code } }));
    return code;
  }

  private async formula(tx: any, raw: any) {
    let found = raw.formulaId ? await tx.formulaMaster.findUnique({ where: { id: raw.formulaId }, include: { detalles: { include: { insumo: true } } } }) : null;
    if (!found) {
      const exactCode = String(raw.codigoFM || raw.productoNombre || raw.producto || raw.formulaId || '').match(/FM-\d+[\w-]*/i)?.[0];
      if (exactCode) found = await tx.formulaMaster.findUnique({ where: { codigoFormula: exactCode.toUpperCase() }, include: { detalles: { include: { insumo: true } } } });
    }
    if (!found || !found.detalles?.length) throw new BadRequestException('El producto debe tener una fórmula existente con composición configurada.');
    if (raw.varianteId) {
      const variant = await tx.formulaVariant.findUnique({ where: { id: raw.varianteId } });
      if (!variant || variant.formulaId !== found.id) throw new BadRequestException('La variante no pertenece a la fórmula del producto.');
      if (variant.ajustesJson && Object.keys(variant.ajustesJson).length) throw new BadRequestException('La variante tiene ajustes de composición que requieren una receta explícita validada.');
    }
    return found;
  }

  private quantity(dto: any): any {
    if (dto.cantidad !== undefined && dto.cantidadSolicitada !== undefined && Number(dto.cantidad) !== Number(dto.cantidadSolicitada)) throw new BadRequestException('Las cantidades de cabecera son contradictorias.');
    if (dto.unidad && dto.unidadMedida && unidadComercial(dto.unidad) !== unidadComercial(dto.unidadMedida)) throw new BadRequestException('Las unidades de cabecera son contradictorias.');
    return { cantidad: cantidadPositiva(dto.cantidad ?? dto.cantidadSolicitada), unidadMedida: unidadComercial(dto.unidad ?? dto.unidadMedida) };
  }

  private async normalize(tx: any, dto: any) {
    const header = this.quantity(dto);
    const rawItems = dto.itemsJson ?? [{ id: 'linea-0', formulaId: dto.formulaId, productoNombre: dto.producto || dto.productoNombre,
      cantidad: header.cantidad, unidadMedida: header.unidadMedida, varianteId: dto.varianteId, aroma: dto.aromaText || dto.aroma,
      color: dto.colorText || dto.color, aditivos: dto.aditivos || [], precioUnitario: dto.precioUnitario,
      pesoNetoKg: dto.pesoNetoKg, densidadKgL: dto.densidadKgL, fuenteConversion: dto.fuenteConversion }];
    if (!Array.isArray(rawItems) || !rawItems.length || rawItems.length > 100) throw new BadRequestException('El pedido debe tener entre 1 y 100 productos.');
    const lines: any[] = [];
    for (const [indice, raw] of rawItems.entries()) {
      const cantidad = cantidadPositiva(raw.cantidad);
      const unit = unidadComercial(raw.unidadMedida || raw.unidad);
      const formula = await this.formula(tx, raw);
      if (indice === 0 && (cantidad !== header.cantidad || unit !== header.unidadMedida || (dto.formulaId && dto.formulaId !== formula.id && dto.formulaId !== formula.codigoFormula))) throw new BadRequestException('La cabecera debe coincidir con el primer producto del pedido.');
      const metadata: any = { ...raw, cantidad, unidadMedida: unit, formulaId: formula.id, codigoFM: formula.codigoFormula, productoNombre: raw.productoNombre || formula.nombreProducto };
      if (raw.pesoNetoKg != null || raw.densidadKgL != null) {
        if (!String(raw.fuenteConversion || '').trim()) throw new BadRequestException('Indique la fuente del peso neto o densidad del producto.');
        if (raw.pesoNetoKg != null) metadata.pesoNetoKg = cantidadPositiva(raw.pesoNetoKg, 'Peso neto KG');
        if (raw.densidadKgL != null) metadata.densidadKgL = cantidadPositiva(raw.densidadKgL, 'Densidad KG/L', 6);
      }
      const aditivos: any[] = [];
      for (const aditivo of raw.aditivos || []) {
        const ingredient = await tx.insumo.findUnique({ where: { id: aditivo.insumoId } });
        if (!ingredient) throw new BadRequestException('El aditivo debe pertenecer al inventario.');
        const porcentaje = cantidadPositiva(aditivo.porcentaje, 'Porcentaje de aditivo');
        if (porcentaje > 100) throw new BadRequestException('El porcentaje no puede superar 100.');
        const { kg } = masaLoteOpcional(metadata);
        if (aditivo.nombreCliente != null && (typeof aditivo.nombreCliente !== 'string' || aditivo.nombreCliente.trim().length > 120)) throw new BadRequestException('El nombre del color para el cliente debe tener como máximo 120 caracteres.');
        aditivos.push({ insumoId: ingredient.id, nombre: ingredient.nombre, codigo: ingredient.codigo,
          nombreCliente: ingredient.tipo === 'PIGMENTO' ? aditivo.nombreCliente?.trim() || null : null,
          tipo: ingredient.tipo, porcentaje,
          gramosCalculados: kg == null ? null : new Prisma.Decimal(kg).mul(1000).mul(porcentaje).div(100).toDecimalPlaces(4).toNumber() });
      }
      metadata.aditivos = aditivos;
      let precio = raw.precioUnitario == null ? null : money(raw.precioUnitario, 'Precio unitario').toDecimalPlaces(4);
      // Legacy single-product callers provide only the agreed document total.
      if (precio == null && rawItems.length === 1 && (dto.precioTotal ?? dto.montoTotal) != null) {
        if ((dto.adicionales || []).length) throw new BadRequestException('Indique el precio del producto por separado de sus adicionales.');
        precio = money(dto.precioTotal ?? dto.montoTotal, 'Total').div(cantidad).toDecimalPlaces(4);
      }
      if (precio == null) throw new BadRequestException('Cada producto requiere un precio unitario explícito.');
      const subtotal = precio.mul(cantidad).toDecimalPlaces(2);
      lines.push({ indice, codigoLinea: String(raw.id || `linea-${indice}`), productoNombre: metadata.productoNombre, formulaId: formula.id,
        varianteId: raw.varianteId || null, cantidad, unidadMedida: unit, precioUnitario: precio, subtotal, metadata, formula });
    }
    if (new Set(lines.map(l => l.codigoLinea)).size !== lines.length) throw new BadRequestException('Hay identificadores de producto duplicados.');
    const extras: any[] = [];
    for (const extra of dto.adicionales || []) {
      if (!['ENVASES', 'BALDES_HERRAMIENTAS'].includes(extra.categoria)) throw new BadRequestException('Categoría de adicional inválida.');
      const quantity = cantidadPositiva(extra.cantidad, 'Cantidad de adicional');
      const index = Number(extra.itemIndex ?? 0);
      if (!Number.isInteger(index) || index < 0 || index >= lines.length) throw new BadRequestException('El adicional debe pertenecer a un producto.');
      const ingredient = extra.insumoId ? await tx.insumo.findUnique({ where: { id: extra.insumoId } }) : null;
      if ((extra.insumoId || extra.categoria === 'ENVASES') && !ingredient) throw new BadRequestException('El adicional debe enlazarse a un insumo existente.');
      const precio = money(extra.precioUnitarioVenta, 'Precio del adicional').toDecimalPlaces(4);
      const unidad = String(extra.unidadMedida || 'UN').toUpperCase();
      if (!['UN', 'UND', 'KG', 'GR', 'LT', 'L', 'ML'].includes(unidad)) throw new BadRequestException('Unidad de adicional inválida.');
      extras.push({ itemIndex: index, productoNombre: lines[index].productoNombre, categoria: extra.categoria, insumoId: ingredient?.id || null,
        descripcion: String(extra.descripcion || ingredient?.nombre || '').trim(), unidadMedida: unidad, cantidad: quantity,
        precioUnitarioVenta: precio, costoUnitario: ingredient?.costoUnitario || 0, subtotal: precio.mul(quantity).toDecimalPlaces(2) });
    }
    const total = [...lines, ...extras].reduce((sum, l) => sum.plus(l.subtotal), new Prisma.Decimal(0)).toDecimalPlaces(2);
    const stated = dto.precioTotal ?? dto.montoTotal;
    if (stated != null && !money(stated, 'Total').toDecimalPlaces(2).equals(total)) throw new BadRequestException(`El total no coincide con las líneas y adicionales: ${total.toFixed(2)}.`);
    if (dto.precioTotal != null && dto.montoTotal != null && !money(dto.precioTotal, 'Total').toDecimalPlaces(2).equals(money(dto.montoTotal, 'Total').toDecimalPlaces(2))) throw new BadRequestException('Los totales enviados son contradictorios.');
    const moneda = dto.moneda || 'PEN';
    if (!['PEN', 'USD'].includes(moneda)) throw new BadRequestException('Moneda inválida.');
    return { lines, extras, total, moneda };
  }

  private async client(tx: any, dto: any) {
    let client = dto.clienteId ? await tx.cliente.findUnique({ where: { id: dto.clienteId } }) : null;
    const document = dto.ruc || dto.clienteRuc || dto.clienteInline?.ruc;
    if (!client && document) client = await tx.cliente.findUnique({ where: { ruc: document } });
    if (!client) throw new BadRequestException('Seleccione un cliente existente de la cartera.');
    if (document && client.ruc !== document) throw new BadRequestException('El documento no corresponde al cliente seleccionado.');
    return client;
  }

  private async persistLines(tx: any, pedidoId: string, lines: any[]) {
    const previous = await tx.pedidoComercialItem.findMany({ where: { pedidoId } });
    const retained = new Set(lines.map(l => l.codigoLinea));
    for (const row of previous) {
      if (!retained.has(row.codigoLinea) && !retained.has(row.id)) await tx.pedidoComercialItem.delete({ where: { id: row.id } });
      else await tx.pedidoComercialItem.update({ where: { id: row.id }, data: { indice: -row.indice - 1 } });
    }
    const persisted: any[] = [];
    for (const line of lines) {
      const { formula, ...data } = line;
      const existing = previous.find(r => r.codigoLinea === line.codigoLinea || r.id === line.codigoLinea);
      const row = existing ? await tx.pedidoComercialItem.update({ where: { id: existing.id }, data: { ...data, codigoLinea: existing.codigoLinea } }) : await tx.pedidoComercialItem.create({ data: { pedidoId, ...data } });
      persisted.push({ ...row, formula });
    }
    return persisted;
  }

  private async saveExtras(tx: any, pedidoId: string, normalized: any) {
    await tx.pedidoAditivo.deleteMany({ where: { pedidoId } });
    await tx.pedidoAdicional.deleteMany({ where: { pedidoId } });
    for (const line of normalized.lines) for (const additive of line.metadata.aditivos) {
      await tx.pedidoAditivo.create({ data: { pedidoId, insumoId: additive.insumoId, tipo: additive.tipo, porcentaje: additive.porcentaje, gramosCalculados: additive.gramosCalculados } });
    }
    for (const extra of normalized.extras) await tx.pedidoAdicional.create({ data: { pedidoId, ...extra } });
  }

  async create(dto: any, actorId?: string) {
    const result: any = await this.transaction(async tx => {
      const client = await this.client(tx, dto);
      const normalized = await this.normalize(tx, dto);
      const { claveOperacion, ...request } = dto;
      const fingerprint = createHash('sha256').update(JSON.stringify(request)).digest('hex');
      if (dto.claveOperacion) {
        if (typeof dto.claveOperacion !== 'string' || dto.claveOperacion.length > 100) throw new BadRequestException('Clave de operación inválida.');
        await tx.$queryRaw`SELECT pg_advisory_xact_lock(hashtext(${dto.claveOperacion}))::text AS locked`;
        const existing = await tx.pedidoComercial.findUnique({ where: { claveOperacion: dto.claveOperacion } });
        if (existing) {
          if (existing.huellaOperacion !== fingerprint) throw new ConflictException('La operación ya fue usada para otros datos.');
          return { ...existing, repetido: true, isCotizacion: existing.docType === 'COT' };
        }
      }
      const type = dto.mode === 'COTIZACION' ? 'COT' : 'OP';
      const main = normalized.lines[0];
      const date = dto.fechaPrometida ? new Date(dto.fechaPrometida) : new Date(Date.now() + 7 * 86400000);
      if (!Number.isFinite(date.getTime())) throw new BadRequestException('Fecha prometida inválida.');
      const notes = { items: normalized.lines.map(l => l.metadata), observaciones: dto.observacionesAdmin || dto.notasAdmin || '' };
      const pedido = await tx.pedidoComercial.create({ data: {
        codigoOrden: await this.code(tx, type, dto.code), docType: type, clienteId: client.id, clienteNombre: client.razonSocial, clienteRuc: client.ruc,
        contactoNombre: dto.contacto || null, contactoTelefono: dto.telefono || null, direccionDespacho: dto.direccion || client.direccion || null,
        repComercial: dto.repComercial || null, condicionPago: dto.condicionPago || client.condicionPago || 'Contado', productoNombre: main.productoNombre,
        formulaId: main.formulaId, varianteId: main.varianteId, cantidadSolicitada: main.cantidad, unidadMedida: main.unidadMedida,
        montoTotal: normalized.total, moneda: normalized.moneda, importeValidado: normalized.total.gt(0) || !!dto.motivoImporteCero?.trim(), fechaPrometida: date, prioridad: dto.prioridad || 'NORMAL',
        estado: type === 'COT' ? 'NUEVO' : 'PENDIENTE_REVISION', aroma: main.metadata.aroma || null, color: main.metadata.color || null,
        aromaText: main.metadata.aroma || null, colorText: main.metadata.color || null, notasAdmin: JSON.stringify(notes),
        claveOperacion: dto.claveOperacion || null, huellaOperacion: dto.claveOperacion ? fingerprint : null,
      } });
      await this.persistLines(tx, pedido.id, normalized.lines);
      await this.saveExtras(tx, pedido.id, normalized);
      await this.audit(tx, actorId, pedido.id, 'CREAR_PEDIDO_COMERCIAL', null, pedido);
      return { ...pedido, isCotizacion: type === 'COT' };
    });
    if (!result.isCotizacion && !result.repetido) this.emit('order:created_to_plant', result);
    return result;
  }

  async convert(id: string, dto: any = {}, actorId?: string) {
    const result: any = await this.transaction(async tx => {
      await tx.$queryRaw`SELECT id FROM pedidos_comerciales WHERE id = ${id} FOR UPDATE`;
      const before = await tx.pedidoComercial.findUnique({ where: { id }, include: { items: true, adicionales: true, aditivos: true, ordenesProduccion: true } });
      if (!before) throw new NotFoundException('Cotización no encontrada.');
      if (before.docType !== 'COT' || before.ordenesProduccion?.length || !['NUEVO', 'PENDIENTE_REVISION'].includes(before.estado)) throw new BadRequestException('Solo se puede convertir una cotización pendiente sin producción.');
      const normalized = await this.normalize(tx, this.dtoFromPedido(before));
      const items = await this.persistLines(tx, id, normalized.lines);
      const code = await this.code(tx, 'OP', dto.code);
      const notes = json(before.notasAdmin);
      const after = await tx.pedidoComercial.update({ where: { id }, data: { codigoOrden: code, codigoRefAdmin: before.codigoOrden, docType: 'OP',
        estado: 'PENDIENTE_REVISION', prioridad: dto.prioridad || before.prioridad,
        notasAdmin: JSON.stringify({ items: items.map(l => l.metadata), observaciones: dto.observaciones ?? notes.observaciones ?? '' }) } });
      await this.audit(tx, actorId, id, 'CONVERTIR_COTIZACION', before, after);
      return after;
    });
    this.emit('order:created_to_plant', result);
    return { success: true, pedido: { ...result, itemsList: json(result.notasAdmin).items }, message: 'Cotización convertida a pedido.' };
  }

  private dtoFromPedido(pedido: any) {
    const parsed = json(pedido.notasAdmin);
    const rawItems = pedido.items?.length ? [...pedido.items].sort((a: any, b: any) => a.indice - b.indice).map((row: any) => ({ ...row.metadata, id: row.codigoLinea, formulaId: row.formulaId,
      productoNombre: row.productoNombre, cantidad: Number(row.cantidad), unidadMedida: row.unidadMedida, precioUnitario: row.precioUnitario == null ? undefined : Number(row.precioUnitario) })) : parsed.items;
    return { clienteId: pedido.clienteId, ruc: pedido.clienteRuc, cantidad: Number(pedido.cantidadSolicitada), unidad: pedido.unidadMedida,
      formulaId: pedido.formulaId, producto: pedido.productoNombre, varianteId: pedido.varianteId, precioTotal: Number(pedido.montoTotal), moneda: pedido.moneda || 'PEN',
      itemsJson: rawItems, aditivos: pedido.aditivos, adicionales: pedido.adicionales || [], observacionesAdmin: parsed.observaciones ?? (parsed.items ? '' : pedido.notasAdmin || '') };
  }

  recipe(line: any) {
    const additives = [...(line.metadata?.aditivos || [])];
    const components = line.formula.detalles.map((d: any) => {
      const replace = additives.find(a => a.insumoId === d.insumoId || (!d.insumoId && String(d.nombreComponente || '').toUpperCase().includes(a.tipo)));
      if (replace) { additives.splice(additives.indexOf(replace), 1); return { insumoId: replace.insumoId, porcentaje: Number(replace.porcentaje) }; }
      if (!d.insumoId && Number(d.porcentaje) > 0) throw new BadRequestException('La receta contiene un componente sin insumo o aditivo seleccionado.');
      return { insumoId: d.insumoId, porcentaje: Number(d.porcentaje) };
    }).filter((d: any) => d.porcentaje > 0);
    components.push(...additives.map(a => ({ insumoId: a.insumoId, porcentaje: Number(a.porcentaje) })));
    const sum = components.reduce((s: number, d: any) => s + d.porcentaje, 0);
    if (components.some((d: any) => !Number.isFinite(d.porcentaje) || d.porcentaje <= 0) || Math.abs(sum - 100) > 0.01) throw new BadRequestException(`La composición debe sumar 100%; actualmente suma ${sum.toFixed(3)}%. Revise fórmula y aditivos.`);
    const grouped = new Map<string, number>();
    for (const d of components) grouped.set(d.insumoId, (grouped.get(d.insumoId) || 0) + d.porcentaje);
    return { formulaId: line.formulaId, version: line.formula.version, nombreProducto: line.productoNombre,
      pasosElaboracion: line.formula.pasosElaboracion || [], capturedAt: new Date().toISOString(),
      componentes: [...grouped].map(([insumoId, porcentaje]) => ({ insumoId, porcentaje })) };
  }

  async approve(id: string, actorId?: string) {
    const result: any = await this.transaction(async tx => {
      await tx.$queryRaw`SELECT id FROM pedidos_comerciales WHERE id = ${id} FOR UPDATE`;
      const before = await tx.pedidoComercial.findUnique({ where: { id }, include: { items: true, adicionales: true, ordenesProduccion: true } });
      if (!before) throw new NotFoundException('Pedido no encontrado.');
      if (before.docType !== 'OP') throw new BadRequestException('Convierta la cotización a pedido antes de aprobar.');
      if (before.estado === 'APROBADO') {
        if (!before.ordenesProduccion?.length) throw new BadRequestException('El pedido aprobado no tiene lotes; requiere conciliación histórica.');
        return { ...before, repetido: true };
      }
      if (!['NUEVO', 'PENDIENTE_REVISION', 'VALIDANDO', 'DEVUELTO'].includes(before.estado)) throw new BadRequestException('El estado actual no permite aprobar el pedido.');
      if (before.ordenesProduccion?.length) throw new BadRequestException('El pedido ya tiene producción; concilie sus lotes antes de volver a aprobar.');
      const client = await this.client(tx, this.dtoFromPedido(before));
      const normalized = await this.normalize(tx, this.dtoFromPedido(before));
      const supervisor = await tx.usuario.findFirst({ where: { rol: { nombre: 'PRODUCCION_ALMACEN' } } });
      if (!supervisor) throw new BadRequestException('No hay usuario con rol PRODUCCION_ALMACEN para asignar como supervisor.');
      const lines = await this.persistLines(tx, id, normalized.lines);
      for (const line of lines) {
        const snapshot = this.recipe(line);
        const year = before.codigoOrden.match(/20\d{2}/)?.[0] || String(new Date().getFullYear());
        const code = `LOT-${year}-${before.codigoOrden.replace(/\D/g, '')}-${line.indice + 1}`;
        if (await tx.ordenProduccion.findFirst({ where: { codigoLote: code } })) throw new ConflictException('El código de lote ya existe y debe conciliarse.');
        await tx.ordenProduccion.create({ data: { codigoLote: code, formulaId: line.formulaId, cantidadPlanificada: line.cantidad,
          unidadMedida: line.unidadMedida, pedidoComercialId: id, pedidoItemId: line.id, clienteId: client.id, clienteNombre: client.razonSocial,
          supervisorId: supervisor.id, colorEspecificado: line.metadata.color || 'TRANSPARENTE', fraganciaEspecificada: line.metadata.aroma || 'SIN FRAGANCIA',
          pesoNetoKg: line.metadata.pesoNetoKg || null, densidadKgL: line.metadata.densidadKgL || null, fuenteConversion: line.metadata.fuenteConversion || null,
          recetaSnapshot: snapshot, conciliacionEstado: 'CAPTURA_VALIDADA', estado: 'EN_PROCESO', pasoProceso: 'PENDIENTE_ASIGNACION' } });
      }
      const after = await tx.pedidoComercial.update({ where: { id }, data: { estado: 'APROBADO' } });
      await this.audit(tx, actorId, id, 'APROBAR_PEDIDO_COMERCIAL', before, after);
      return after;
    });
    if (!result.repetido) { this.emit('order:status_updated', { ordenId: id, estado: 'APROBADO' }); this.emit('order:accepted_by_plant', result); }
    return result;
  }

  async update(id: string, dto: any, actorId?: string) {
    const result: any = await this.transaction(async tx => {
      await tx.$queryRaw`SELECT id FROM pedidos_comerciales WHERE id = ${id} FOR UPDATE`;
      const before = await tx.pedidoComercial.findUnique({ where: { id }, include: { items: true, adicionales: true, aditivos: true, ordenesProduccion: true } });
      if (!before) throw new NotFoundException('Pedido no encontrado.');
      if (dto.estado && dto.estado !== before.estado) throw new BadRequestException('Use las acciones de aprobación o devolución para cambiar el estado.');
      const structural = ['itemsJson', 'cantidad', 'cantidadSolicitada', 'unidad', 'unidadMedida', 'formulaId', 'clienteId', 'ruc', 'clienteRuc', 'montoTotal', 'precioTotal', 'aditivos', 'adicionales', 'varianteId', 'aroma', 'color', 'moneda'].some(k => dto[k] !== undefined);
      if (structural && (before.tipoComprobante || before.ordenesProduccion?.some(lotStarted))) throw new BadRequestException('El pedido ya fue fabricado o emitido; requiere una corrección trazable, no editar su composición o importe.');
      let data: any = {};
      if (structural) {
        const merged = { ...this.dtoFromPedido(before), ...dto };
        if (dto.cantidadSolicitada !== undefined) merged.cantidad = dto.cantidadSolicitada;
        if (dto.unidadMedida !== undefined) merged.unidad = dto.unidadMedida;
        if (dto.montoTotal !== undefined) merged.precioTotal = dto.montoTotal;
        if (dto.precioTotal === undefined && dto.montoTotal === undefined) { delete merged.precioTotal; delete merged.montoTotal; }
        if (!dto.itemsJson && Array.isArray(merged.itemsJson)) {
          const first = { ...merged.itemsJson[0] };
          if (dto.cantidad !== undefined || dto.cantidadSolicitada !== undefined) first.cantidad = merged.cantidad;
          if (dto.unidad !== undefined || dto.unidadMedida !== undefined) first.unidadMedida = merged.unidad;
          if (dto.formulaId !== undefined) first.formulaId = dto.formulaId;
          if (dto.varianteId !== undefined) first.varianteId = dto.varianteId;
          merged.itemsJson = [first, ...merged.itemsJson.slice(1)];
        }
        const normalized = await this.normalize(tx, merged);
        const client = await this.client(tx, merged);
        // Only untouched pending lots may be rebuilt; no stock exists from QA here.
        await tx.ordenProduccion.deleteMany({ where: { pedidoComercialId: id } });
        const lines = await this.persistLines(tx, id, normalized.lines);
        await this.saveExtras(tx, id, normalized);
        const main = lines[0];
        data = { clienteId: client.id, clienteNombre: client.razonSocial, clienteRuc: client.ruc, formulaId: main.formulaId,
          varianteId: main.varianteId, productoNombre: main.productoNombre, cantidadSolicitada: main.cantidad, unidadMedida: main.unidadMedida,
          montoTotal: normalized.total, moneda: normalized.moneda, estado: 'PENDIENTE_REVISION',
          importeValidado: normalized.total.gt(0) || !!dto.motivoImporteCero?.trim(),
          notasAdmin: JSON.stringify({ items: lines.map(l => l.metadata), observaciones: dto.observaciones ?? dto.observacionesAdmin ?? merged.observacionesAdmin }) };
      } else if (dto.observaciones !== undefined || dto.notasAdmin !== undefined) {
        const parsed = json(before.notasAdmin);
        data.notasAdmin = JSON.stringify({ ...parsed, observaciones: dto.observaciones ?? dto.notasAdmin });
      }
      for (const [input, output] of [['contacto', 'contactoNombre'], ['telefono', 'contactoTelefono'], ['direccion', 'direccionDespacho'], ['condicionPago', 'condicionPago'], ['prioridad', 'prioridad']]) if (dto[input] !== undefined) data[output] = dto[input];
      if (dto.fechaPrometida) { const date = new Date(dto.fechaPrometida); if (!Number.isFinite(date.getTime())) throw new BadRequestException('Fecha inválida.'); data.fechaPrometida = date; }
      const after = await tx.pedidoComercial.update({ where: { id }, data });
      await this.audit(tx, actorId, id, 'EDITAR_PEDIDO_COMERCIAL', before, after);
      return after;
    });
    this.emit('pedido:actualizado', result);
    return result;
  }
}
