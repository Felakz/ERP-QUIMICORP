/** Public quotation text must never fall back to an inventory chemical name. */
export function colorParaCliente(item: {
  color?: string | null;
  aditivos?: Array<{ tipo?: string; nombreCliente?: string | null }>;
}): string | null {
  const pigments = item.aditivos?.filter(a => a.tipo === 'PIGMENTO') || [];
  if (pigments.length) return pigments.map(a => a.nombreCliente?.trim() || 'Color personalizado').join(', ');
  return item.color?.trim() ? 'Color personalizado' : null;
}
