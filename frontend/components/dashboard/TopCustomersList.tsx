'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Building2, ShieldCheck, ShieldAlert, Award, ArrowRight } from 'lucide-react';
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

  const cardBg = isDark
    ? 'bg-[#0F141C] border-[#1A2232] shadow-[0_0_20px_rgba(0,242,195,0.03)]'
    : 'bg-white border-slate-200 shadow-sm';

  return (
    <div className={`p-6 rounded-2xl border ${cardBg} h-full flex flex-col justify-between space-y-4`}>
      <div className="flex items-center justify-between">
        <div>
          <h2
            onClick={() => router.push(ROUTES.CLIENTES)}
            className={`text-base font-black flex items-center gap-2 cursor-pointer hover:text-[#00F2C3] transition-colors ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>Top Clientes Frecuentes</span>
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            Ranking de mayor volumen de compras y scoring crediticio
          </p>
        </div>
        <span className="text-[10px] font-black font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-[#00F2C3] border border-cyan-500/30 uppercase tracking-wider">
          LIVE POSTGRES
        </span>
      </div>

      <div className="space-y-2.5 overflow-y-auto max-h-[340px] flex-1 pr-1">
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
              className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-all duration-150 cursor-pointer group card-hover-lift ${
                isDark
                  ? 'bg-[#151D2A] border-[#1A2232] hover:border-cyan-500/40 hover:bg-[#1B2535] hover:shadow-[0_0_12px_rgba(0,242,195,0.1)]'
                  : 'bg-slate-50 border-slate-200 hover:border-blue-500/50 hover:bg-blue-50/30'
              }`}
              title={`Ver Expediente 360° de ${cust.name}`}
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Ranking Avatar */}
                <div
                  className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center font-black text-xs text-white shadow-sm ${cust.avatarBg}`}
                >
                  #{index + 1}
                </div>

                <div className="min-w-0">
                  <h4 className={`text-xs font-black truncate group-hover:text-[#00F2C3] transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {cust.name}
                  </h4>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                    <span>RUC: {cust.ruc}</span>
                    <span>•</span>
                    <span className="text-cyan-400 font-bold">{cust.invoicesCount} Docs</span>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className={`text-xs font-black font-mono block ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {formatted}
                </span>
                <span
                  className={`inline-flex items-center gap-1 text-[9px] font-black px-1.5 py-0.5 rounded mt-0.5 ${
                    cust.creditStatus === 'EXCELENTE'
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-[0_0_8px_rgba(16,185,129,0.2)]'
                      : cust.creditStatus === 'REGULAR'
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-[0_0_8px_rgba(245,158,11,0.2)]'
                      : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${cust.creditStatus === 'EXCELENTE' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                  {cust.creditStatus}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer con navegación a Cartera de Clientes */}
      <div className="pt-3 border-t border-slate-800/40 flex items-center justify-between text-xs">
        <span className="text-[11px] text-slate-400 font-medium">
          {customers.length} cuentas destacadas
        </span>
        <button
          onClick={() => router.push(ROUTES.CLIENTES)}
          className="font-black text-[#00F2C3] hover:text-cyan-200 flex items-center gap-1.5 transition-colors text-xs group"
        >
          <span>Ver Cartera Completa</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
};
