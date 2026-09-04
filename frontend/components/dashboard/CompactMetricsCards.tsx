'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Wallet,
  Users,
  FileText,
  FileSpreadsheet,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
} from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';
import { CompactMetric, CurrencyType } from '@/types/dashboard';
import { formatCurrency } from '@/lib/dashboardFormatters';
import { ROUTES } from '@/config/routes';

interface CompactMetricsCardsProps {
  metrics: CompactMetric[];
  includeIgv: boolean;
  currency: CurrencyType;
  exchangeRateUsd: number;
}

export const CompactMetricsCards: React.FC<CompactMetricsCardsProps> = ({
  metrics,
  includeIgv,
  currency,
  exchangeRateUsd,
}) => {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const getTargetRoute = (type: string) => {
    switch (type) {
      case 'AMOUNT_DUE':
        return `${ROUTES.COBRANZAS}?estado=PENDIENTE`;
      case 'CUSTOMERS':
        return ROUTES.CLIENTES;
      case 'INVOICES':
        return ROUTES.PEDIDOS;
      case 'ESTIMATES':
        return ROUTES.COTIZADOR;
      default:
        return ROUTES.DASHBOARD;
    }
  };

  const getActionLabel = (type: string) => {
    switch (type) {
      case 'AMOUNT_DUE':
        return 'Ver Cuentas';
      case 'CUSTOMERS':
        return 'Ver Directorio';
      case 'INVOICES':
        return 'Ver Invoices';
      case 'ESTIMATES':
        return 'Cotizar';
      default:
        return 'Ver Detalle';
    }
  };

  const getItemStyle = (type: string) => {
    switch (type) {
      case 'AMOUNT_DUE':
        return {
          icon: <Wallet className="w-5 h-5 text-purple-400" />,
          glowClass: 'hover:border-purple-500/50 hover:shadow-[0_0_15px_rgba(168,85,247,0.15)]',
          badgeBg: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
        };
      case 'CUSTOMERS':
        return {
          icon: <Users className="w-5 h-5 text-[#00F2C3]" />,
          glowClass: 'hover:border-cyan-500/50 hover:shadow-[0_0_15px_rgba(0,242,195,0.15)]',
          badgeBg: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
        };
      case 'INVOICES':
        return {
          icon: <FileText className="w-5 h-5 text-amber-400" />,
          glowClass: 'hover:border-amber-500/50 hover:shadow-[0_0_15px_rgba(245,158,11,0.15)]',
          badgeBg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
        };
      case 'ESTIMATES':
        return {
          icon: <FileSpreadsheet className="w-5 h-5 text-rose-400" />,
          glowClass: 'hover:border-rose-500/50 hover:shadow-[0_0_15px_rgba(244,63,94,0.15)]',
          badgeBg: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
        };
      default:
        return {
          icon: <Wallet className="w-5 h-5 text-blue-400" />,
          glowClass: 'hover:border-blue-500/50 hover:shadow-[0_0_15px_rgba(59,130,246,0.15)]',
          badgeBg: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
        };
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4 h-full">
      {metrics.map((item) => {
        const isMonetary = item.type === 'AMOUNT_DUE';
        const displayValue = isMonetary
          ? formatCurrency(item.valuePenNeto, includeIgv, currency, exchangeRateUsd)
          : (item.valuePenNeto ?? 0).toLocaleString('es-PE');
        const targetRoute = getTargetRoute(item.type);
        const actionLabel = getActionLabel(item.type);
        const itemStyle = getItemStyle(item.type);

        const cardBg = isDark
          ? `bg-[#0F141C] border-[#1A2232] ${itemStyle.glowClass} hover:bg-[#131A26]`
          : 'bg-white border-slate-200 shadow-sm hover:border-blue-500/50 hover:bg-blue-50/30 hover:shadow-md';

        return (
          <div
            key={item.id}
            onClick={() => router.push(targetRoute)}
            className={`p-4 rounded-2xl border flex flex-col justify-between cursor-pointer transition-all duration-200 group card-hover-lift ${cardBg}`}
            title={`Ir a ${item.title}`}
          >
            <div>
              <div className="flex items-center justify-between">
                <div
                  className={`p-2.5 rounded-xl border transition-transform duration-200 group-hover:scale-110 ${
                    isDark ? itemStyle.badgeBg : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  {itemStyle.icon}
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg bg-cyan-500/10 text-[#00F2C3]">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

              <div className="mt-3">
                <span className="text-[11px] font-bold text-slate-400 block tracking-wide">{item.title}</span>
                <h3 className={`text-lg font-black mt-1 font-mono tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {displayValue}
                </h3>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-800/40 flex items-center justify-between text-[10px] font-bold">
              <span
                className={`flex items-center gap-0.5 ${
                  item.isPositive ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {item.isPositive ? (
                  <ArrowUpRight className="w-3.5 h-3.5" />
                ) : (
                  <ArrowDownRight className="w-3.5 h-3.5" />
                )}
                {item.isPositive ? '+' : ''}
                {item.changePercent.toFixed(1)}%
              </span>

              <span className="text-[10px] text-cyan-400/80 group-hover:text-cyan-300 font-bold hidden xl:inline-block">
                {actionLabel} →
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
