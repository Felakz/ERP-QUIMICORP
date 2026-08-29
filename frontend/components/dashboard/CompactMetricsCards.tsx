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
  ExternalLink,
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

  const cardBg = isDark
    ? 'bg-[#0F141C] border-[#1A2232] hover:border-blue-500/50 hover:bg-[#131A26]'
    : 'bg-white border-slate-200 shadow-sm hover:border-blue-500/50 hover:bg-blue-50/30';

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

  const getIcon = (type: string) => {
    switch (type) {
      case 'AMOUNT_DUE':
        return <Wallet className="w-5 h-5 text-purple-400" />;
      case 'CUSTOMERS':
        return <Users className="w-5 h-5 text-emerald-400" />;
      case 'INVOICES':
        return <FileText className="w-5 h-5 text-amber-400" />;
      case 'ESTIMATES':
        return <FileSpreadsheet className="w-5 h-5 text-rose-400" />;
      default:
        return <Wallet className="w-5 h-5 text-blue-400" />;
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

        return (
          <div
            key={item.id}
            onClick={() => router.push(targetRoute)}
            className={`p-5 rounded-2xl border flex flex-col justify-between cursor-pointer transition-all group ${cardBg}`}
            title={`Ir a ${item.title}`}
          >
            <div className="flex items-center justify-between">
              <div
                className={`p-2.5 rounded-xl border ${
                  isDark ? 'bg-[#151D2A] border-[#1A2232]' : 'bg-slate-50 border-slate-200'
                }`}
              >
                {getIcon(item.type)}
              </div>
            </div>

            <div className="mt-3">
              <span className="text-xs font-bold text-slate-400 block">{item.title}</span>
              <h3 className={`text-lg font-black mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {displayValue}
              </h3>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-800/10 flex items-center gap-1 text-[11px] font-bold">
              <span
                className={`flex items-center gap-0.5 ${
                  item.isPositive ? 'text-emerald-500' : 'text-rose-500'
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
              <span className="text-slate-500 font-medium">vs mes anterior</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
