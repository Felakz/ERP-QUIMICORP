export interface CotizacionProveedorItem {
  id: string;
  proveedorId: string;
  proveedorNombre: string;
  proveedorRuc: string;
  insumoId: string;
  insumoNombre: string;
  precioUnitario: number;
  precioAnterior?: number;
  moneda: 'SOLES' | 'USD';
  unidadMedida: string;
  numCotizacion: string;
  fechaCotizacion: string;
  variacionPorcentual?: number;
  observaciones?: string;
  contacto?: string;
  telefono?: string;
}

export interface InsumoQuimicoOpcion {
  id: string;
  codigo: string;
  nombre: string;
  categoria: string;
  unidad: string;
  stockActual: number;
  precioReferencia: number;
}

// Datos de muestra eliminados: el comparador ahora consume el backend real
// (GET /insumos, GET /cotizaciones-proveedores/comparativa/:insumoId,
//  POST /cotizaciones-proveedores). Ver page.tsx.
