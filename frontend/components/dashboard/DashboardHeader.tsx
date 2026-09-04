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

  const cardBg = isDark
    ? 'bg-[#0F141C] border-[#1A2232] shadow-[0_0_25px_rgba(0,242,195,0.03)]'
    : 'bg-white border-slate-200 shadow-sm';
  const textTitle = isDark ? 'text-white' : 'text-slate-900';
  const textSub = isDark ? 'text-slate-400' : 'text-slate-500';

  return (
    <div className={`p-6 rounded-2xl border flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 relative overflow-hidden ${cardBg}`}>
      {/* Background ambient glow effect in dark mode */}
      {isDark && (
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      )}

      {/* Title & Brand */}
      <div className="relative z-10">
        <div className="flex items-center gap-2.5 mb-1.5">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-blue-500/15 to-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-[0_0_10px_rgba(0,242,195,0.1)]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 led-pulse" />
            <span>QUIMICORP PERÚ S.A.C.</span>
          </div>
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
            <span className="text-cyan-400">•</span> Contabilidad & Auditoría Ejecutiva
          </span>
        </div>
        <h1 className={`text-2xl font-black tracking-tight ${textTitle}`}>
          Dashboard Gerencial & Finanzas
        </h1>
        <p className={`text-xs ${textSub}`}>
          Consolidado contable de cobranzas, márgenes de formulación y auditoría financiera de operaciones en tiempo real.
        </p>
      </div>

      {/* Controls toolbar */}
      <div className="flex flex-wrap items-center gap-3 relative z-10">
        {/* IGV Switch Toggle */}
        <div className={`flex items-center gap-1 p-1 rounded-xl border ${isDark ? 'bg-[#151D2A] border-[#1A2232]' : 'bg-slate-100 border-slate-200'}`}>
          <button
            onClick={() => onToggleIgv(false)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              !includeIgv
                ? isDark
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-[0_0_12px_rgba(6,182,212,0.35)]'
                  : 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sin IGV (Neto)
          </button>
          <button
            onClick={() => onToggleIgv(true)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              includeIgv
                ? isDark
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-[0_0_12px_rgba(6,182,212,0.35)]'
                  : 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Con IGV (+18%)
          </button>
        </div>

        {/* Currency Switcher */}
        <div className={`flex items-center gap-1 p-1 rounded-xl border ${isDark ? 'bg-[#151D2A] border-[#1A2232]' : 'bg-slate-100 border-slate-200'}`}>
          <button
            onClick={() => onChangeCurrency('PEN')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-black transition-all ${
              currency === 'PEN'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            S/ PEN
          </button>
          <button
            onClick={() => onChangeCurrency('USD')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-black transition-all ${
              currency === 'USD'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-[0_0_12px_rgba(245,158,11,0.3)]'
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
            className={`px-3 py-2 rounded-xl text-xs font-bold border outline-none appearance-none pr-8 cursor-pointer transition-all ${
              isDark
                ? 'bg-[#151D2A] border-[#1A2232] text-slate-200 hover:border-cyan-500/50 hover:shadow-[0_0_10px_rgba(0,242,195,0.1)]'
                : 'bg-slate-50 border-slate-300 text-slate-900 hover:border-blue-500/50'
            }`}
          >
            <option value="HOY">📅 Hoy</option>
            <option value="AYER">📅 Ayer vs Hoy</option>
            <option value="ULTIMOS_7">📅 Últimos 7 días</option>
            <option value="MES_ACTUAL">📅 Mes Actual (Agosto 2026)</option>
          </select>
          <Calendar className="w-3.5 h-3.5 text-cyan-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Refresh button */}
        {onRefresh && (
          <button
            onClick={onRefresh}
            title="Recargar datos"
            className={`p-2.5 rounded-xl border transition-all ${
              isDark
                ? 'bg-[#151D2A] border-[#1A2232] text-cyan-400 hover:text-white hover:bg-cyan-500/20 hover:border-cyan-500/40 hover:shadow-[0_0_12px_rgba(0,242,195,0.2)]'
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
