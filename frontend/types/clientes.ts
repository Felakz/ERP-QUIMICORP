export type ClientViewMode = 'grid' | 'table';

export type ClientDetailTab = 'general' | 'pedidos' | 'facturas' | 'pagos' | 'despachos';

export interface Representative {
  id?: string;
  nombre: string;
  cargo?: string | null;
  telefono?: string | null;
  email?: string | null;
  esPrincipal?: boolean;
}

export interface ClientMetrics {
  totalVolumenKgLt: number;
  totalFacturadoPen: number;
  totalPagadoPen: number;
  saldoPendientePen: number;
  totalPedidosCount: number;
  totalFacturasCount: number;
}

export interface ClientExtended {
  id: string;
  razonSocial: string;
  ruc: string;
  telefono?: string | null;
  direccion?: string | null;
  direccionDespacho?: string | null;
  contacto?: string | null;
  metodoEnvio?: string | null;
  condicionPago?: string | null;
  estado?: 'ACTIVO' | 'INACTIVO' | 'CON_SALDO';
  contactos?: Representative[];
  metrics?: ClientMetrics;
  pedidosHistory?: {
    code: string;
    fecha: string;
    volumen: number;
    unidadMedida?: string;
    variant: string;
    comprobante?: string;
    vencimiento?: string;
    monto: number;
    saldo?: number;
    pagado?: number;
    estadoPago?: 'PAGADO' | 'PENDIENTE' | 'VENCIDO';
    estadoEntrega?: 'ENTREGADO' | 'PENDIENTE' | 'EN_RUTA';
    estado: string;
    medioPago?: string;
    canalBanco?: string;
  }[];
  facturasHistory?: {
    doc: string;
    emision: string;
    venc: string;
    monto: number;
    saldo: number;
    estado: string;
    tipo?: string;
  }[];
  pagosHistory?: {
    fecha: string;
    banco: string;
    op: string;
    monto: number;
    metodo: string;
  }[];
  despachosHistory?: {
    guia: string;
    fecha: string;
    transporte: string;
    destino: string;
    estado: string;
  }[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ClientOrderHistory {
  id: string;
  code: string;
  createdAt: string;
  volumenKgLt: number;
  variantName: string;
  montoTotal: number;
  estado: 'PENDIENTE' | 'EN_PROCESO' | 'COMPLETADO' | 'RECHAZADO';
}

export interface ClientInvoiceHistory {
  id: string;
  docNumber: string;
  fechaEmision: string;
  fechaVencimiento: string;
  montoTotal: number;
  montoPendiente: number;
  estadoPago: 'PAGADO' | 'PENDIENTE' | 'PARCIAL';
}

export interface ClientPaymentHistory {
  id: string;
  fecha: string;
  banco: string;
  operacionNum: string;
  monto: number;
  metodoPago: string;
}

export interface ClientDispatchHistory {
  id: string;
  fecha: string;
  guiaRemision: string;
  transporte: string;
  destino: string;
  estadoEntrega: 'ENTREGADO' | 'EN_RUTA' | 'PENDIENTE';
}
