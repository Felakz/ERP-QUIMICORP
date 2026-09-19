// Utilidades de dosificación en gramos por kilo de lote.
//
// La fórmula se trabaja en gramos por cada kilo (1000 g).
// El backend/BD sigue operando en porcentaje: la conversión se hace
// solo al mostrar (x10) y al guardar (/10).
export const GRAMOS_POR_KILO = 1000;

// Margen aceptado por merma de proceso. Si el total está dentro de este
// rango, el registro se permite y los valores se normalizan
// proporcionalmente a 1000 g exactos al guardar.
export const TOLERANCIA_MERMA_GRAMOS = 10;

export function porcentajeAGramos(porcentaje: number): number {
  return parseFloat(((Number(porcentaje) || 0) * 10).toFixed(3));
}

export function gramosAPorcentaje(gramos: number): number {
  return parseFloat(((Number(gramos) || 0) / 10).toFixed(4));
}

// Escala un arreglo de porcentajes para que sume exactamente 100,
// corrigiendo el residuo de redondeo en el componente mayoritario.
export function normalizarPorcentajesExacto(porcentajes: number[]): number[] {
  const total = porcentajes.reduce((acc, p) => acc + (Number(p) || 0), 0);
  if (total <= 0) return porcentajes.map(() => 0);
  const factor = 100 / total;
  const redondeados = porcentajes.map((p) => parseFloat(((Number(p) || 0) * factor).toFixed(4)));
  const suma = redondeados.reduce((acc, p) => acc + p, 0);
  const residuo = parseFloat((100 - suma).toFixed(4));
  if (Math.abs(residuo) > 0.00001) {
    let idxMayor = 0;
    redondeados.forEach((v, i) => {
      if (v > redondeados[idxMayor]) idxMayor = i;
    });
    redondeados[idxMayor] = parseFloat((redondeados[idxMayor] + residuo).toFixed(4));
  }
  return redondeados;
}
