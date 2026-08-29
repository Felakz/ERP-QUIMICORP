export type CurrencyType = 'PEN' | 'USD';

export type DateRangeType = 'HOY' | 'AYER' | 'ULTIMOS_7' | 'MES_ACTUAL';

export type CommercialDocType = 'TODOS' | 'COTIZACION' | 'FACTURA' | 'NOTA_VENTA';

export type ApprovalStatusType = 'APROBADO' | 'PENDIENTE' | 'EN_REVISION' | 'RECHAZADO';

export interface KpiItem {
  id: string;
  title: string;
  valuePenNeto: number;
  valueUsdNeto: number;
  changePercent: number;
  isPositive: boolean;
  trendLabel: string;
  iconName: 'DollarSign' | 'TrendingUp' | 'PackageCheck' | 'AlertTriangle' | 'Wallet';
  unitType?: 'currency' | 'count';
}

export interface SalesAnalyticsPoint {
  month: string;
  ventasNetas: number;
  facturacionNetas: number;
  cotizacionesNetas: number;
}

export interface InvoiceAnalyticsTerm {
  term: string;
  amountPenNeto: number;
  count: number;
  percentage: number;
  color: string;
}

export interface TopCustomer {
  id: string;
  name: string;
  ruc: string;
  invoicesCount: number;
  totalAmountPenNeto: number;
  creditStatus: 'EXCELENTE' | 'REGULAR' | 'OBSERVADO';
  avatarBg: string;
}

export interface CompactMetric {
  id: string;
  title: string;
  valuePenNeto: number;
  changePercent: number;
  isPositive: boolean;
  type: 'AMOUNT_DUE' | 'CUSTOMERS' | 'INVOICES' | 'ESTIMATES';
}

export interface PaymentCategoryPoint {
  category: string;
  amountPenNeto: number;
  fullMark: number;
}

export interface CommercialDocument {
  id: string;
  docNumber: string;
  customerName: string;
  ruc: string;
  volumeKgLt: number;
  issueDate: string;
  dueDate: string;
  totalAmountPenNeto: number;
  type: 'COTIZACION' | 'FACTURA' | 'NOTA_VENTA';
  status: 'PAGADO' | 'PENDIENTE' | 'VENCIDO';
}

export interface CommercialOrder {
  id: string;
  code: string;
  customerName: string;
  variantName: string;
  paymentTerm: string;
  totalAmountPenNeto: number;
  approvalStatus: ApprovalStatusType;
}

export interface DashboardState {
  includeIgv: boolean; // false = Neto (Sin IGV), true = Bruto (Con IGV 18%)
  currency: CurrencyType; // 'PEN' (S/) vs 'USD' ($)
  exchangeRateUsd: number; // e.g. 3.75 PEN per USD
  dateRange: DateRangeType;
}
