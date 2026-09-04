'use client';

import React from 'react';
import { useTheme } from '@/lib/ThemeContext';
import { CurrencyType, InvoiceAnalyticsTerm } from '@/types/dashboard';
import { formatCurrency } from '@/lib/dashboardFormatters';

interface InvoiceAnalyticsChartProps {
  terms: InvoiceAnalyticsTerm[];
  includeIgv: boolean;
  currency: CurrencyType;
  exchangeRateUsd: number;
}

export const InvoiceAnalyticsChart: React.FC<InvoiceAnalyticsChartProps> = ({
  terms,
  includeIgv,
  currency,
  exchangeRateUsd,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const cardBg = isDark
    ? 'bg-[#0F141C] border-[#1A2232] shadow-[0_0_20px_rgba(0,242,195,0.03)]'
    : 'bg-white border-slate-200 shadow-sm';

  const totalAmountPen = terms.reduce((acc, curr) => acc + curr.amountPenNeto, 0);

  return (
    <div className={`p-6 rounded-2xl border ${cardBg} space-y-4`}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-base font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Invoice Analytics & Plazos
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            Distribución del volumen de cuentas por cobrar en plazos comerciales
          </p>
        </div>
        <span className="text-xs font-black font-mono text-[#00F2C3] bg-cyan-500/10 px-3 py-1.5 rounded-xl border border-cyan-500/30 shadow-[0_0_10px_rgba(0,242,195,0.15)]">
          Total: {formatCurrency(totalAmountPen, includeIgv, currency, exchangeRateUsd)}
        </span>
      </div>

      {/* Stacked Progress Bar Visual */}
      <div className="w-full bg-slate-900/60 p-1 rounded-xl border border-slate-800 flex gap-1">
        {terms.map((item, idx) => (
          <div
            key={idx}
            style={{ width: `${Math.max(item.percentage, 3)}%`, backgroundColor: item.color }}
            className="h-3 rounded-lg transition-all hover:opacity-90 relative group shadow-sm"
            title={`${item.term}: ${item.percentage.toFixed(1)}%`}
          />
        ))}
      </div>

      {/* Payment Terms breakdown list */}
      <div className="space-y-2 pt-1">
        {terms.map((item, idx) => {
          const formatted = formatCurrency(
            item.amountPenNeto,
            includeIgv,
            currency,
            exchangeRateUsd
          );

          return (
            <div
              key={idx}
              className={`p-3 rounded-xl border flex items-center justify-between transition-all card-hover-lift ${
                isDark ? 'bg-[#151D2A] border-[#1A2232] hover:border-cyan-500/30' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                  style={{ backgroundColor: item.color }}
                />
                <div>
                  <h4 className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Plazo: {item.term}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-mono">
                    {item.count} facturas ({item.percentage.toFixed(1)}%)
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className={`text-xs font-black font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {formatted}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
