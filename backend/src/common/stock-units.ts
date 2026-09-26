import { BadRequestException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

// Storage contract: stockReal/stockTeorico/stockMinimo are GR, ML or UN.
// Insumo.unidadMedida is the commercial unit; costoUnitario is per that unit.
// Never convert an existing stock again based on its commercial unit.
const units: Record<string, { base: string; factor: number }> = {
  GR: { base: 'GR', factor: 1 }, G: { base: 'GR', factor: 1 },
  KG: { base: 'GR', factor: 1000 }, KILO: { base: 'GR', factor: 1000 }, KILOS: { base: 'GR', factor: 1000 },
  KILOGRAMO: { base: 'GR', factor: 1000 }, KILOGRAMOS: { base: 'GR', factor: 1000 },
  ML: { base: 'ML', factor: 1 },
  L: { base: 'ML', factor: 1000 }, LT: { base: 'ML', factor: 1000 }, LITRO: { base: 'ML', factor: 1000 }, LITROS: { base: 'ML', factor: 1000 },
  UN: { base: 'UN', factor: 1 }, UND: { base: 'UN', factor: 1 }, UNIDAD: { base: 'UN', factor: 1 }, UNIDADES: { base: 'UN', factor: 1 },
};

function definition(unit: string) {
  const result = units[String(unit).trim().toUpperCase()];
  if (!result) throw new BadRequestException(`Unidad no soportada: ${unit}.`);
  return result;
}

export const unidadStock = (unit: string): string => definition(unit).base;
export const factorUnidad = (unit: string): number => definition(unit).factor;

export function cantidadEnStock(quantity: number, source: string, target: string): number {
  if (!Number.isFinite(quantity)) throw new BadRequestException('Cantidad inválida.');
  if (unidadStock(source) !== unidadStock(target)) {
    throw new BadRequestException(`No se puede convertir ${source} a ${target}. Para masa y volumen se requiere la densidad específica del insumo.`);
  }
  return new Prisma.Decimal(quantity).mul(factorUnidad(source)).toDecimalPlaces(4).toNumber();
}

export function costoPorUnidadStock(cost: number, commercialUnit: string): number {
  return new Prisma.Decimal(cost).div(factorUnidad(commercialUnit)).toNumber();
}

export function consumoFormulaGramos(batchKg: number, percentage: number, ingredientUnit: string): number {
  return cantidadEnStock(new Prisma.Decimal(batchKg).mul(percentage).div(100).toNumber(), 'KG', ingredientUnit);
}

export function cantidadLoteKg(quantity: number, unit: string, density?: number): number {
  const base = unidadStock(unit);
  const amount = cantidadEnStock(quantity, unit, unit);
  if (base === 'GR') return amount / 1000;
  if (base === 'ML' && Number.isFinite(density) && density > 0) return amount / 1000 * density;
  throw new BadRequestException('La fórmula requiere masa en KG; para un lote en litros debe tener densidad válida.');
}
