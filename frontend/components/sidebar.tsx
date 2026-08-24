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
  History,
  ShoppingCart,
  BookOpen,
} from 'lucide-react';

export const adminSidebarItems = [
  {
    category: '1. ADMINISTRACIÓN Y FINANZAS',
    items: [
      { label: 'Dashboard Gerencial', icon: LayoutDashboard, href: '/administracion/dashboard' },
      { label: 'Cartera de Clientes', icon: Building2, href: '/administracion/clientes' },
      { label: 'Cuentas por Cobrar y Pagar', icon: CreditCard, href: '/administracion/cobranzas' },
    ],
  },
  {
    category: '2. GESTIÓN COMERCIAL Y VENTAS',
    items: [
      { label: 'Catálogo y Cotizador', icon: ShoppingCart, href: '/administracion/cotizador' },
      { label: 'Pedidos Comerciales', icon: FileText, href: '/administracion/pedidos', badge: 3 },
    ],
  },
  {
    category: '3. PRODUCCIÓN Y PLANTA',
    items: [
      { label: 'Control de Producción & QA', icon: Factory, href: '/administracion/control-produccion' },
      { label: 'Sistema Maestro de Fórmulas', icon: Beaker, href: '/administracion/formulas' },
    ],
  },
  {
    category: '4. ALMACÉN Y LOGÍSTICA',
    items: [
      { label: 'Inventario y Kardex', icon: Package, href: '/administracion/inventario' },
      { label: 'Alertas de Materia Prima y Stock', icon: AlertTriangle, href: '/administracion/alertas-stock' },
    ],
  },
  {
    category: '5. ASISTENCIA Y RRHH',
    items: [
      { label: 'Asistencia y Biometría', icon: UserCheck, href: '/administracion/asistencia' },
    ],
  },
];
