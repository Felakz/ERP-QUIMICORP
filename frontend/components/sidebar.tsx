import {
  LayoutDashboard,
  FileText,
  Beaker,
  Building2,
  Receipt,
  CreditCard,
  Package,
  AlertTriangle,
} from 'lucide-react';

export const adminSidebarItems = [
  {
    category: 'GESTIÓN COMERCIAL',
    items: [
      { label: 'Dashboard Comercial', icon: LayoutDashboard, href: '/administracion/dashboard' },
      { label: 'Pedidos Comerciales', icon: FileText, href: '/administracion/pedidos', badge: 3 },
      { label: 'Catálogo & Cotizador', icon: Beaker, href: '/administracion/formulas' },
    ],
  },
  {
    category: 'CLIENTES & FACTURACIÓN',
    items: [
      { label: 'Cartera de Clientes', icon: Building2, href: '/administracion/clientes' },
      { label: 'Documentos & Facturas', icon: Receipt, href: '/administracion/facturacion' },
      { label: 'Cuentas por Cobrar', icon: CreditCard, href: '/administracion/cobranzas' },
    ],
  },
  {
    category: 'ALMACÉN & COMPRAS',
    items: [
      { label: 'Stock Comercial', icon: Package, href: '/administracion/inventario' },
      { label: 'Alertas de Materia Prima', icon: AlertTriangle, href: '/administracion/alertas-stock' },
    ],
  },
];
