// Stock is stored in GR/ML/UN; commercial unit and price remain on the item.
export function stockUnit(unit?: string): string {
  const u = String(unit || '').trim().toUpperCase();
  if (['KG', 'KILO', 'KILOS', 'KILOGRAMO', 'KILOGRAMOS', 'GR', 'G'].includes(u)) return 'GR';
  if (['L', 'LT', 'LITRO', 'LITROS', 'ML'].includes(u)) return 'ML';
  if (['UN', 'UND', 'UNIDAD', 'UNIDADES'].includes(u)) return 'UN';
  return u;
}

export function unitFactor(unit?: string): number {
  return ['KG', 'KILO', 'KILOS', 'KILOGRAMO', 'KILOGRAMOS', 'L', 'LT', 'LITRO', 'LITROS'].includes(String(unit).toUpperCase()) ? 1000 : 1;
}

export function kardexTotal(rows: Array<{ unidadMedida: string; cantidadEntrada: number; cantidadSalida: number; requiereConciliacionUnidad?: boolean }>, field: 'cantidadEntrada' | 'cantidadSalida', weightUnit: 'GR' | 'KG'): string {
  const totals = new Map<string, number>();
  for (const row of rows) {
    if (row.requiereConciliacionUnidad) continue;
    const base = stockUnit(row.unidadMedida);
    const display = base === 'GR' ? weightUnit : base;
    const value = Number(row[field] || 0) * unitFactor(row.unidadMedida) / (display === 'KG' ? 1000 : 1);
    totals.set(display, (totals.get(display) || 0) + value);
  }
  return Array.from(totals, ([unit, amount]) => `${amount.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 4 })} ${unit}`).join(' · ') || '0';
}
