export type UnidadMedida = 'KG' | 'L' | 'GR' | 'UN';
export type EstadoGenerico = 'ACTIVO' | 'INACTIVO';
export type EstadoOrdenProduccion =
  | 'PENDIENTE'
  | 'EN_PROCESO'
  | 'QA_PENDIENTE'
  | 'APROBADO'
  | 'RECHAZADO';
export type TipoMovimientoKardex =
  | 'ENTRADA'
  | 'SALIDA'
  | 'AJUSTE_FINO'
  | 'MERMA'
  | 'REAPROVECHAMIENTO';
export type EstadoSubAlmacen = 'DISPONIBLE' | 'REUSADO' | 'DESCARTADO';

export interface FamiliaInsumo {
  id: string;
  nombre: string;
  descripcion?: string | null;
}

export interface Insumo {
  id: string;
  codigo: string;
  nombre: string;
  familiaId: string;
  familia: FamiliaInsumo;
  unidadMedida: UnidadMedida;
  stockTeorico: string;
  stockReal: string;
  stockMinimo: string;
  costoUnitario: string;
  estado: EstadoGenerico;
}

export interface FormulaDetalle {
  id: string;
  insumoId: string;
  insumo: Insumo;
  porcentaje: string;
}

export interface FormulaMaster {
  id: string;
  codigoFormula: string;
  nombreProducto: string;
  version: number;
  densidadTeorica: string;
  estado: 'ACTIVA' | 'INACTIVA' | 'EN_REVISION';
  detalles: FormulaDetalle[];
}

export interface OrdenProduccion {
  id: string;
  codigoLote: string;
  formulaId: string;
  formula: FormulaMaster;
  cantidadPlanificada: string;
  cantidadObtenida: string | null;
  mermaCalculada: string | null;
  estado: EstadoOrdenProduccion;
  supervisor: { nombres: string; apellidos: string };
  createdAt: string;
}

export interface KardexMovimiento {
  id: string;
  insumoId: string;
  insumo: { codigo: string; nombre: string; unidadMedida: UnidadMedida };
  tipoMovimiento: TipoMovimientoKardex;
  cantidad: string;
  stockAnterior: string;
  stockNuevo: string;
  documentoReferencia?: string | null;
  usuario: { nombres: string; apellidos: string };
  createdAt: string;
}

export interface SubAlmacenSobrante {
  id: string;
  loteOrigen: { codigoLote: string };
  insumoSubproducto: Insumo;
  pesoDisponible: string;
  ubicacion: string;
  estado: EstadoSubAlmacen;
}

export interface RequerimientoInsumo {
  insumoId: string;
  codigo: string;
  nombre: string;
  unidadMedida: string;
  cantidadRequerida: string;
  stockDisponible: string;
  suficiente: boolean;
  faltante: string;
}
