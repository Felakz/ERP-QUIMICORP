import {
  LayoutDashboard,
  FileText,
  Beaker,
  Building2,
  Receipt,
  CreditCard,
  Package,
  AlertTriangle,
  Factory,
  UserCheck,
  ShoppingCart,
  TrendingUp,
  Truck,
  AlertOctagon,
  Scale,
  FileSpreadsheet,
} from 'lucide-react';

export interface SidebarSubItem {
  label: string;
  icon: any;
  href: string;
  badge?: number;
  restrictedForAsistente?: boolean;
}

export interface SidebarSection {
  category: string;
  items: SidebarSubItem[];
}

export const adminSidebarItems: SidebarSection[] = [
  {
    category: '1. ADMINISTRACIÓN & FINANZAS',
    items: [
      {
        label: 'Dashboard Gerencial',
        icon: LayoutDashboard,
        href: '/administracion/dashboard',
        restrictedForAsistente: true,
      },
      {
        label: 'Cartera de Clientes',
        icon: Building2,
        href: '/administracion/clientes',
      },
      {
        label: 'Cuentas por Cobrar y Pagar',
        icon: CreditCard,
        href: '/administracion/cobranzas',
        restrictedForAsistente: true,
      },
    ],
  },
  {
    category: '2. GESTIÓN COMERCIAL',
    items: [
      {
        label: 'Catálogo y Cotizador',
        icon: ShoppingCart,
        href: '/administracion/cotizador',
      },
      {
        label: 'Pedidos Comerciales',
        icon: FileText,
        href: '/administracion/pedidos',
      },
      {
        label: 'Análisis de Ventas',
        icon: TrendingUp,
        href: '/administracion/analisis',
        restrictedForAsistente: true,
      },
    ],
  },
  {
    category: '3. COMPRAS Y ABASTECIMIENTO',
    items: [
      {
        label: 'Proveedores',
        icon: Building2,
        href: '/administracion/proveedores',
        restrictedForAsistente: true,
      },
      {
        label: 'Órdenes de Compra',
        icon: Receipt,
        href: '/administracion/ordenes',
        restrictedForAsistente: true,
      },
      {
        label: 'Comparador de Precios',
        icon: Scale,
        href: '/administracion/comparador-precios',
        restrictedForAsistente: true,
      },
    ],
  },
  {
    category: '4. PRODUCCIÓN Y PLANTA',
    items: [
      {
        label: 'Control de Producción & QA',
        icon: Factory,
        href: '/administracion/control',
      },
      {
        label: 'Sistema Maestro de Fórmulas',
        icon: Beaker,
        href: '/administracion/formulas',
        restrictedForAsistente: true,
      },
      {
        label: 'Lotes y Despachos',
        icon: Truck,
        href: '/administracion/despachos',
      },
      {
        label: 'Incidencias de Producción',
        icon: AlertOctagon,
        href: '/administracion/incidencias',
      },
    ],
  },
  {
    category: '5. ALMACÉN Y LOGÍSTICA',
    items: [
      {
        label: 'Gestión de Inventario',
        icon: Package,
        href: '/administracion/gestion-inventario',
      },
      {
        label: 'Inventario y Kardex',
        icon: Package,
        href: '/administracion/inventario-kardex',
      },
      {
        label: 'Alertas de Materia Prima y Stock',
        icon: AlertTriangle,
        href: '/administracion/alertas',
      },
    ],
  },
  {
    category: '6. ASISTENCIA Y RRHH',
    items: [
      {
        label: 'Asistencia y Biometría',
        icon: UserCheck,
        href: '/administracion/asistencia',
        restrictedForAsistente: true,
      },
    ],
  },
  {
    category: '7. REPORTES',
    items: [
      {
        label: 'Centro de Reportes',
        icon: FileSpreadsheet,
        href: '/administracion/reportes',
        restrictedForAsistente: true,
      },
    ],
  },
];
