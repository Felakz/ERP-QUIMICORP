import { BadRequestException } from '@nestjs/common';

export async function recetaLote(tx: any, order: any) {
  const captured = order.recetaSnapshot;
  const components = captured?.componentes || order.formula?.detalles?.map((d: any) => ({ insumoId: d.insumoId, porcentaje: Number(d.porcentaje) }));
  if (!Array.isArray(components) || !components.length || components.some(d => !d.insumoId || !Number.isFinite(Number(d.porcentaje)) || Number(d.porcentaje) <= 0)) {
    throw new BadRequestException('La receta requiere ingredientes identificados y porcentajes positivos.');
  }
  const sum = components.reduce((s, d) => s + Number(d.porcentaje), 0);
  if (Math.abs(sum - 100) > 0.01) throw new BadRequestException(`La receta suma ${sum.toFixed(3)}%; debe sumar 100% antes de liberar.`);
  const grouped = new Map<string, number>();
  for (const d of components) grouped.set(d.insumoId, (grouped.get(d.insumoId) || 0) + Number(d.porcentaje));
  const details = [];
  for (const [insumoId, porcentaje] of grouped) {
    const insumo = await tx.insumo.findUnique({ where: { id: insumoId }, include: { familia: true } });
    if (!insumo) throw new BadRequestException('La receta contiene un insumo inexistente.');
    details.push({ insumoId, porcentaje, insumo });
  }
  return { details, snapshot: captured || { formulaId: order.formulaId, version: order.formula?.version,
    nombreProducto: order.formula?.nombreProducto, capturedAt: new Date().toISOString(), fuente: 'FORMULA_ACTUAL_AL_LIBERAR',
    componentes: [...grouped].map(([insumoId, porcentaje]) => ({ insumoId, porcentaje })), pasosElaboracion: order.formula?.pasosElaboracion || [] } };
}
