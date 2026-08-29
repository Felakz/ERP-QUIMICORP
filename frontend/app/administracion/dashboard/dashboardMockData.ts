import { KpiItem } from '@/types/dashboard';

export const MOCK_KPIS: KpiItem[] = [
  {
    id: 'kpi-1',
    title: 'Ventas & Facturación (Ayer vs. Hoy)',
    valuePenNeto: 148500.0,
    valueUsdNeto: 39600.0,
    changePercent: 14.2,
    isPositive: true,
    trendLabel: 'S/ 18,400 hoy',
    iconName: 'TrendingUp',
  },
  {
    id: 'kpi-2',
    title: 'Utilidad Neta Real',
    valuePenNeto: 48114.0,
    valueUsdNeto: 12830.4,
    changePercent: 8.5,
    isPositive: true,
    trendLabel: '32.4% margen bruto',
    iconName: 'DollarSign',
  },
  {
    id: 'kpi-3',
    title: 'Pedidos Pendientes a Planta',
    valuePenNeto: 12,
    valueUsdNeto: 12,
    changePercent: -5.0,
    isPositive: true,
    trendLabel: '3 reactores asignados',
    iconName: 'PackageCheck',
  },
  {
    id: 'kpi-4',
    title: 'Valorización de Stock Crítico',
    valuePenNeto: 32450.0,
    valueUsdNeto: 8653.33,
    changePercent: -2.1,
    isPositive: false,
    trendLabel: 'Reabastecimiento urgente',
    iconName: 'AlertTriangle',
  },
];
