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

import { EnterpriseKpiCard, KpiVariant } from '@/components/ui/EnterpriseKpiCard';

interface KpiCardsGridProps {
  kpis: KpiItem[];
  includeIgv: boolean;
  currency: CurrencyType;
  exchangeRateUsd: number;
  loading?: boolean;
}

export const KpiCardsGrid: React.FC<KpiCardsGridProps> = ({
  kpis,
  includeIgv,
  currency,
  exchangeRateUsd,
  loading = false,
}) => {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  if (loading && (!kpis || kpis.length === 0)) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <EnterpriseKpiCard title="Facturación Bruta" value="" icon={DollarSign} loading={true} />
        <EnterpriseKpiCard title="Pedidos en Proceso" value="" icon={TrendingUp} loading={true} />
        <EnterpriseKpiCard title="Cobranzas Pendientes" value="" icon={Wallet} loading={true} />
        <EnterpriseKpiCard title="Alertas de Stock" value="" icon={AlertTriangle} loading={true} />
      </div>
    );
  }

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

  const getIconData = (iconName: string) => {
    switch (iconName) {
      case 'DollarSign':
        return {
          icon: <DollarSign className="w-5 h-5 text-emerald-400" />,
          glowClass: 'hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]',
          badgeBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.15)]',
          accentColor: '#10B981',
        };
      case 'TrendingUp':
        return {
          icon: <TrendingUp className="w-5 h-5 text-cyan-400" />,
          glowClass: 'hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(0,242,195,0.15)]',
          badgeBg: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 shadow-[0_0_10px_rgba(0,242,195,0.15)]',
          accentColor: '#00F2C3',
        };
      case 'PackageCheck':
        return {
          icon: <PackageCheck className="w-5 h-5 text-purple-400" />,
          glowClass: 'hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]',
          badgeBg: 'bg-purple-500/10 border-purple-500/30 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.15)]',
          accentColor: '#A855F7',
        };
      case 'AlertTriangle':
        return {
          icon: <AlertTriangle className="w-5 h-5 text-amber-400" />,
          glowClass: 'hover:border-amber-500/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]',
          badgeBg: 'bg-amber-500/10 border-amber-500/30 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.15)]',
          accentColor: '#F59E0B',
        };
      default:
        return {
          icon: <Wallet className="w-5 h-5 text-blue-400" />,
          glowClass: 'hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]',
          badgeBg: 'bg-blue-500/10 border-blue-500/30 text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.15)]',
          accentColor: '#3B82F6',
        };
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
        const iconData = getIconData(kpi.iconName);

        const cardBg = isDark
          ? `bg-[#0F141C] border-[#1A2232] ${iconData.glowClass} hover:bg-[#131A26]`
          : 'bg-white border-slate-200 shadow-sm hover:border-blue-500/50 hover:bg-blue-50/30 hover:shadow-md';

        return (
          <div
            key={kpi.id}
            onClick={() => router.push(targetRoute)}
            className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer space-y-3 group card-hover-lift relative overflow-hidden ${cardBg}`}
            title={`Ir a módulo correspondiente`}
          >
            {/* Ambient corner light */}
            {isDark && (
              <div
                className="absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl opacity-15 pointer-events-none transition-opacity group-hover:opacity-35"
                style={{ backgroundColor: iconData.accentColor }}
              />
            )}

            <div className="flex items-center justify-between relative z-10">
              <span className={`text-xs font-bold tracking-wide ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {kpi.title}
              </span>
              <div
                className={`p-2.5 rounded-xl border transition-transform duration-200 group-hover:scale-110 ${
                  isDark ? iconData.badgeBg : 'bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                {iconData.icon}
              </div>
            </div>

            <div className="relative z-10">
              <h3 className={`text-2xl font-black font-mono tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {formattedValue}
              </h3>
              <p className="text-[10px] text-slate-500 font-semibold mt-0.5">
                {isCount
                  ? 'Órdenes en cola de asignación'
                  : includeIgv
                  ? 'Total con IGV (18%)'
                  : 'Valor Neto (Sin IGV)'}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2.5 border-t border-slate-800/40 relative z-10">
              <span
                className={`inline-flex items-center gap-1 text-xs font-black ${
                  kpi.isPositive ? 'text-emerald-400' : 'text-rose-400'
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
              <span className={`text-[10px] font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {kpi.trendLabel}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
