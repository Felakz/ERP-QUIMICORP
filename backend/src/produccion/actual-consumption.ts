import { BadRequestException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { unidadStock } from '../common/stock-units';

// Persisted movements are already expressed in the inventory base unit.
// A legacy label mismatch requires reconciliation, never another conversion.
export function consumoRegistrado(rows: any[], ingredient: any): number {
  let total = new Prisma.Decimal(0);
  for (const row of rows.filter(r => r.insumoId === ingredient.id)) {
    if (row.unidadMedida !== unidadStock(ingredient)) {
      throw new BadRequestException(`Concilie los movimientos anteriores de ${ingredient.nombre}: su unidad no coincide con el stock.`);
    }
    total = total.plus(row.cantidadSalida).minus(row.cantidadEntrada);
  }
  return total.toDecimalPlaces(4).toNumber();
}

export function consumoPendiente(total: number, registrado: number): number {
  if (!Number.isFinite(total) || total < 0 || !Number.isFinite(registrado) || registrado < 0) {
    throw new BadRequestException('El consumo total y el consumo registrado deben ser no negativos.');
  }
  const pending = new Prisma.Decimal(total).minus(registrado).toDecimalPlaces(4);
  if (pending.isNegative()) throw new BadRequestException('El consumo declarado es menor que el ya descontado. Registre y documente la devolución antes de liberar.');
  return pending.toNumber();
}
