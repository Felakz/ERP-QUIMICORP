import { BadRequestException } from '@nestjs/common';
import { cantidadLoteKg, unidadStock } from './stock-units';

export function unidadComercial(unit: string): string {
  const value = String(unit || '').trim().toUpperCase();
  const base = unidadStock(value);
  if (base === 'UN') throw new BadRequestException('La fabricación requiere una cantidad en KG, GR, LT o ML.');
  return base === 'GR' ? (['G', 'GR', 'GRAMO', 'GRAMOS'].includes(value) ? 'GR' : 'KG') : value === 'ML' ? 'ML' : 'LT';
}

export function cantidadPositiva(value: unknown, name = 'cantidad', decimals = 4): number {
  if (value === null || value === undefined || value === '' || typeof value === 'boolean' || Array.isArray(value)) throw new BadRequestException(`${name} es obligatoria.`);
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0) throw new BadRequestException(`${name} debe ser mayor a cero.`);
  const factor = 10 ** decimals;
  if (Math.abs(amount * factor - Math.round(amount * factor)) > 0.00001) throw new BadRequestException(`${name} admite como máximo ${decimals} decimales.`);
  return amount;
}

// Only a measured/documented mass conversion may be used for a volume order.
// FormulaMaster.densidadTeorica is deliberately not accepted as evidence.
export function masaLoteKg(order: any, override?: any): number {
  const quantity = cantidadPositiva(order.cantidadPlanificada ?? order.cantidad ?? order.cantidadSolicitada);
  if (!order.unidadMedida && !order.pedidoItem?.unidadMedida && order.pedidoComercial?.notasAdmin) {
    let items: any[] = [];
    try { items = JSON.parse(order.pedidoComercial.notasAdmin).items || []; } catch { /* plain historical notes */ }
    if (items.length > 1) throw new BadRequestException('Falta confirmar la unidad propia del lote; la cabecera tiene varios productos.');
  }
  const unit = unidadComercial(order.unidadMedida || order.pedidoItem?.unidadMedida || order.pedidoComercial?.unidadMedida || '');
  if (unidadStock(unit) === 'GR') return cantidadLoteKg(quantity, unit);
  const source = override || order;
  const evidence = source.fuenteConversion || order.pedidoItem?.metadata?.fuenteConversion;
  const weight = source.pesoNetoKg ?? order.pedidoItem?.metadata?.pesoNetoKg;
  const density = source.densidadKgL ?? order.pedidoItem?.metadata?.densidadKgL;
  if (!String(evidence || '').trim()) throw new BadRequestException('Falta peso neto o densidad documentada del producto para convertir LT a KG.');
  if (weight != null && Number(weight) > 0) return cantidadPositiva(weight, 'Peso neto KG');
  return cantidadLoteKg(quantity, unit, cantidadPositiva(density, 'Densidad KG/L', 6));
}

export function masaLoteOpcional(order: any): { kg: number | null; pendiente: string | null } {
  try { return { kg: masaLoteKg(order), pendiente: null }; }
  catch (error) { return { kg: null, pendiente: error.message }; }
}
