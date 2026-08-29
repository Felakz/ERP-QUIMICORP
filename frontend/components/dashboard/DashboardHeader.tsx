'use client';

import React from 'react';
import {
  Calendar,
  DollarSign,
  FileSpreadsheet,
  RefreshCw,
  SlidersHorizontal,
  Check,
} from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';
import { CurrencyType, DateRangeType } from '@/types/dashboard';

interface DashboardHeaderProps {
  includeIgv: boolean;
  onToggleIgv: (value: boolean) => void;
  currency: CurrencyType;
  onChangeCurrency: (curr: CurrencyType) => void;
  dateRange: DateRangeType;
  onChangeDateRange: (range: DateRangeType) => void;
  onRefresh?: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  includeIgv,
  onToggleIgv,
  currency,
  onChangeCurrency,
  dateRange,
  onChangeDateRange,
  onRefresh,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const cardBg = isDark ? 'bg-[#0F141C] border-[#1A2232]' : 'bg-white border-slate-200 shadow-sm';
  const textTitle = isDark ? 'text-white' : 'text-slate-900';
  const textSub = isDark ? 'text-slate-400' : 'text-slate-500';

  return (
    <div className={`p-6 rounded-2xl border flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 ${cardBg}`}>
      {/* Title & Brand */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
            QUIMICORP PERÚ S.A.C.
          </span>
          <span className="text-xs font-bold text-slate-500">• Contabilidad & Finanzas</span>
        </div>
        <h1 className={`text-2xl font-black tracking-tight ${textTitle}`}>
          Dashboard Gerencial & Finanzas
        </h1>
        <p className={`text-xs ${textSub}`}>
          Consolidado contable de cobranzas, márgenes de formulación y auditoría financiera de operaciones.
        </p>
      </div>

      {/* Controls toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* IGV Switch Toggle */}
        <div className={`flex items-center gap-2 p-1.5 rounded-xl border ${isDark ? 'bg-[#151D2A] border-[#1A2232]' : 'bg-slate-100 border-slate-200'}`}>
          <button
            onClick={() => onToggleIgv(false)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              !includeIgv
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sin IGV (Neto)
          </button>
          <button
            onClick={() => onToggleIgv(true)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              includeIgv
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Con IGV (+18%)
          </button>
        </div>

        {/* Currency Switcher */}
        <div className={`flex items-center p-1 rounded-xl border ${isDark ? 'bg-[#151D2A] border-[#1A2232]' : 'bg-slate-100 border-slate-200'}`}>
          <button
            onClick={() => onChangeCurrency('PEN')}
            className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all ${
              currency === 'PEN'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            S/ PEN
          </button>
          <button
            onClick={() => onChangeCurrency('USD')}
            className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all ${
              currency === 'USD'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            $ USD
          </button>
        </div>

        {/* Date Range Selector */}
        <div className="relative">
          <select
            value={dateRange}
            onChange={(e) => onChangeDateRange(e.target.value as DateRangeType)}
            className={`px-3 py-2 rounded-xl text-xs font-bold border outline-none appearance-none pr-8 cursor-pointer ${
              isDark
                ? 'bg-[#151D2A] border-[#1A2232] text-slate-200 hover:border-blue-500/50'
                : 'bg-slate-50 border-slate-300 text-slate-900 hover:border-blue-500/50'
            }`}
          >
            <option value="HOY">📅 Hoy</option>
            <option value="AYER">📅 Ayer vs Hoy</option>
            <option value="ULTIMOS_7">📅 Últimos 7 días</option>
            <option value="MES_ACTUAL">📅 Mes Actual (Agosto 2026)</option>
          </select>
          <Calendar className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Refresh button */}
        {onRefresh && (
          <button
            onClick={onRefresh}
            title="Recargar datos"
            className={`p-2 rounded-xl border transition-all ${
              isDark
                ? 'bg-[#151D2A] border-[#1A2232] text-slate-400 hover:text-white hover:bg-[#1C2638]'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
