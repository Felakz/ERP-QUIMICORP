'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  TrendingUp,
  DollarSign,
  PackageCheck,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  ExternalLink,
} from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';
import { CurrencyType, KpiItem } from '@/types/dashboard';
import { formatCurrency } from '@/lib/dashboardFormatters';
import { ROUTES } from '@/config/routes';

interface KpiCardsGridProps {
  kpis: KpiItem[];
  includeIgv: boolean;
  currency: CurrencyType;
  exchangeRateUsd: number;
}

export const KpiCardsGrid: React.FC<KpiCardsGridProps> = ({
  kpis,
  includeIgv,
  currency,
  exchangeRateUsd,
}) => {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const getKpiRoute = (id: string, iconName: string) => {
    switch (iconName) {
      case 'TrendingUp':
        return ROUTES.PEDIDOS;
      case 'DollarSign':
        return ROUTES.FORMULAS;
      case 'PackageCheck':
        return ROUTES.CONTROL_PRODUCCION;
      case 'AlertTriangle':
        return ROUTES.ALERTAS;
      case 'Wallet':
        return `${ROUTES.COBRANZAS}?estado=PENDIENTE`;
      default:
        return ROUTES.DASHBOARD;
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'DollarSign':
        return <DollarSign className="w-5 h-5 text-emerald-400" />;
      case 'TrendingUp':
        return <TrendingUp className="w-5 h-5 text-blue-400" />;
      case 'PackageCheck':
        return <PackageCheck className="w-5 h-5 text-purple-400" />;
      case 'AlertTriangle':
        return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      default:
        return <Wallet className="w-5 h-5 text-indigo-400" />;
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi) => {
        const isCount = kpi.unitType === 'count';
        const formattedValue = isCount
          ? `${Math.round(kpi.valuePenNeto)} ${Math.round(kpi.valuePenNeto) === 1 ? 'pedido' : 'pedidos'}`
          : formatCurrency(
              kpi.valuePenNeto,
              includeIgv,
              currency,
              exchangeRateUsd
            );
        const targetRoute = getKpiRoute(kpi.id, kpi.iconName);

        const cardBg = isDark
          ? 'bg-[#0F141C] border-[#1A2232] hover:border-blue-500/50 hover:bg-[#131A26]'
          : 'bg-white border-slate-200 shadow-sm hover:border-blue-500/50 hover:bg-blue-50/30';

        return (
          <div
            key={kpi.id}
            onClick={() => router.push(targetRoute)}
            className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 group ${cardBg}`}
            title={`Ir a módulo correspondiente`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-xs font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {kpi.title}
              </span>
              <div
                className={`p-2.5 rounded-xl border ${
                  isDark ? 'bg-[#151D2A] border-[#1A2232]' : 'bg-slate-50 border-slate-200'
                }`}
              >
                {getIcon(kpi.iconName)}
              </div>
            </div>

            <div>
              <h3 className={`text-xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {formattedValue}
              </h3>
              <p className="text-[10px] text-slate-500 font-medium">
                {isCount
                  ? 'Órdenes en cola de asignación'
                  : includeIgv
                  ? 'Total con IGV (18%)'
                  : 'Valor Neto (Sin IGV)'}
              </p>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-slate-800/10">
              <span
                className={`inline-flex items-center gap-1 text-xs font-bold ${
                  kpi.isPositive ? 'text-emerald-500' : 'text-rose-500'
                }`}
              >
                {kpi.isPositive ? (
                  <ArrowUpRight className="w-3.5 h-3.5" />
                ) : (
                  <ArrowDownRight className="w-3.5 h-3.5" />
                )}
                {kpi.isPositive ? '+' : ''}
                {kpi.changePercent.toFixed(1)}%
              </span>
              <span className={`text-[10px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {kpi.trendLabel}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
