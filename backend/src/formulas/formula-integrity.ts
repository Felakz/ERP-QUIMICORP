import { BadRequestException } from '@nestjs/common';

const nameKey = (value: unknown) => String(value || '').trim().toUpperCase().replace(/\s+/g, ' ');

// An old editor may omit insumoId. It may only retain an existing, unambiguous
// association; names never establish a new inventory association automatically.
export async function detallesVinculados(tx: any, input: any, previous: any[] = []) {
  if (!Array.isArray(input) || !input.length) throw new BadRequestException('Seleccione al menos un insumo del inventario.');
  const seenDetails = new Set<string>();
  const resolved = input.map((item: any, index: number) => {
    if (!item || item.porcentaje == null || item.porcentaje === '' || typeof item.porcentaje === 'boolean' || !Number.isFinite(Number(item.porcentaje)) || Number(item.porcentaje) <= 0) {
      throw new BadRequestException(`La cantidad del componente ${index + 1} debe ser positiva.`);
    }
    let old: any;
    if (item.id) {
      old = previous.find(d => d.id === item.id);
      if (!old || seenDetails.has(item.id)) throw new BadRequestException('El componente no pertenece a esta fórmula o está repetido.');
      seenDetails.add(item.id);
    } else if (item.insumoId === undefined) {
      const matches = previous.filter(d => nameKey(d.nombreComponente || d.insumo?.nombre) === nameKey(item.nombreComponente));
      if (matches.length === 1) old = matches[0];
    }
    const insumoId = item.insumoId === undefined ? old?.insumoId : item.insumoId;
    if (typeof insumoId !== 'string' || !insumoId.trim()) throw new BadRequestException(`Seleccione el insumo del inventario para ${item.nombreComponente || `el componente ${index + 1}`}. No se guardan componentes desconectados.`);
    return { ...item, id: old?.id, insumoId, porcentaje: Number(item.porcentaje) };
  });
  const ids = [...new Set<string>(resolved.map(d => d.insumoId))];
  const ingredients = await tx.insumo.findMany({ where: { id: { in: ids } }, select: { id: true, nombre: true, codigo: true } });
  return resolved.map(d => {
    const ingredient = ingredients.find((i: any) => i.id === d.insumoId);
    if (!ingredient) throw new BadRequestException('Uno de los insumos seleccionados ya no existe. Recargue el catálogo.');
    return { id: d.id, insumoId: ingredient.id, nombreComponente: ingredient.nombre, skuComponente: ingredient.codigo, porcentaje: d.porcentaje };
  });
}

export async function auditarFormula(tx: any, actorId: string, action: string, before: any, after: any) {
  if (!actorId) throw new BadRequestException('Se requiere un usuario autenticado para guardar la fórmula.');
  // JWT authenticates against `users`, while audit_logs.usuarioId references
  // the legacy `usuarios` table. Keep the authenticated ID in the audit payload
  // and use the existing ERP audit account only for the required foreign key.
  const actor = await tx.user.findUnique({ where: { id: actorId }, select: { id: true } });
  if (!actor) throw new BadRequestException('El usuario autenticado ya no existe.');
  const auditUser = await tx.usuario.findUnique({ where: { id: actorId }, select: { id: true } })
    || await tx.usuario.findFirst({ where: { dni: '70000000' }, select: { id: true } });
  if (!auditUser) throw new BadRequestException('No existe la cuenta ERP para registrar la auditoría de fórmulas.');
  const json = (value: any) => JSON.parse(JSON.stringify(value));
  await tx.auditLog.create({ data: { usuarioId: auditUser.id, accion: action, tablaAfectada: 'formulas_master', registroId: after?.id || before.id,
    datosAnteriores: json({ formula: before }), datosNuevos: json({ actorAutenticado: actor.id, formula: after }) } });
}
