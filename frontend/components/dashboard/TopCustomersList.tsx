'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Building2, ShieldCheck, ShieldAlert, Award } from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';
import { CurrencyType, TopCustomer } from '@/types/dashboard';
import { formatCurrency } from '@/lib/dashboardFormatters';
import { ROUTES } from '@/config/routes';

interface TopCustomersListProps {
  customers: TopCustomer[];
  includeIgv: boolean;
  currency: CurrencyType;
  exchangeRateUsd: number;
}

export const TopCustomersList: React.FC<TopCustomersListProps> = ({
  customers,
  includeIgv,
  currency,
  exchangeRateUsd,
}) => {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const cardBg = isDark ? 'bg-[#0F141C] border-[#1A2232]' : 'bg-white border-slate-200 shadow-sm';

  return (
    <div className={`p-6 rounded-2xl border ${cardBg} space-y-4`}>
      <div className="flex items-center justify-between">
        <div>
          <h2
            onClick={() => router.push(ROUTES.CLIENTES)}
            className={`text-base font-bold flex items-center gap-2 cursor-pointer hover:text-blue-400 transition-colors ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            <Award className="w-4 h-4 text-amber-400" /> Top 10 Clientes Frecuentes
          </h2>
          <p className="text-xs text-slate-400">
            Ranking de mayor volumen de compras e historial crediticio
          </p>
        </div>
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          Filtrado por Facturación
        </span>
      </div>

      <div className="space-y-3 overflow-y-auto max-h-[380px] pr-1">
        {customers.map((cust, index) => {
          const formatted = formatCurrency(
            cust.totalAmountPenNeto,
            includeIgv,
            currency,
            exchangeRateUsd
          );

          return (
            <div
              key={cust.id}
              onClick={() => router.push(ROUTES.CLIENTE_DETAIL(cust.id))}
              className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-all cursor-pointer group ${
                isDark
                  ? 'bg-[#151D2A] border-[#1A2232] hover:border-blue-500/50 hover:bg-[#1B2535]'
                  : 'bg-slate-50 border-slate-200 hover:border-blue-500/50 hover:bg-blue-50/30'
              }`}
              title={`Ver Expediente 360° de ${cust.name}`}
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Ranking Avatar */}
                <div
                  className={`w-9 h-9 rounded-xl shrink-0 flex items-center justify-center font-black text-xs text-white ${cust.avatarBg}`}
                >
                  #{index + 1}
                </div>

                <div className="min-w-0">
                  <h4 className={`text-xs font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {cust.name}
                  </h4>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400">
                    <span className="font-mono">RUC: {cust.ruc}</span>
                    <span>•</span>
                    <span>{cust.invoicesCount} Invoices</span>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className={`text-xs font-black block ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {formatted}
                </span>
                <span
                  className={`inline-block text-[9px] font-bold px-1.5 py-0.5 rounded mt-0.5 ${
                    cust.creditStatus === 'EXCELENTE'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : cust.creditStatus === 'REGULAR'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}
                >
                  {cust.creditStatus}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
