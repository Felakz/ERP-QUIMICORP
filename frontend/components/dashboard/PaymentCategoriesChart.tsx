'use client';

import React from 'react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
} from 'recharts';
import { useTheme } from '@/lib/ThemeContext';
import { CurrencyType, PaymentCategoryPoint } from '@/types/dashboard';
import { calculateMonetaryValue, formatCurrency } from '@/lib/dashboardFormatters';

interface PaymentCategoriesChartProps {
  categories: PaymentCategoryPoint[];
  includeIgv: boolean;
  currency: CurrencyType;
  exchangeRateUsd: number;
}

export const PaymentCategoriesChart: React.FC<PaymentCategoriesChartProps> = ({
  categories,
  includeIgv,
  currency,
  exchangeRateUsd,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const cardBg = isDark
    ? 'bg-[#0F141C] border-[#1A2232] shadow-[0_0_20px_rgba(0,242,195,0.03)]'
    : 'bg-white border-slate-200 shadow-sm';
  const gridColor = isDark ? '#1A2232' : '#CBD5E1';
  const textColor = isDark ? '#94A3B8' : '#475569';

  const chartData = categories.map((c) => ({
    category: c.category,
    amount: calculateMonetaryValue(c.amountPenNeto, includeIgv, currency, exchangeRateUsd),
    fullMark: c.fullMark,
  }));

  return (
    <div className={`p-6 rounded-2xl border ${cardBg} h-full flex flex-col justify-between space-y-4`}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-base font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Métodos de Pago & Cobranza
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            Distribución por entidad financiera y canal comercial
          </p>
        </div>
      </div>

      <div className="w-full flex-1 min-h-[220px]">
        {isMounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
              <PolarGrid stroke={gridColor} />
              <PolarAngleAxis dataKey="category" stroke={textColor} fontSize={11} />
              <PolarRadiusAxis angle={30} domain={[0, 'auto']} stroke={textColor} fontSize={10} />
              <Radar
                name="Monto Recaudado"
                dataKey="amount"
                stroke="#EC4899"
                fill="#EC4899"
                fillOpacity={0.4}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? '#0B0F17' : '#FFFFFF',
                  borderColor: isDark ? '#EC4899' : '#CBD5E1',
                  borderRadius: '12px',
                  boxShadow: isDark ? '0 0 15px rgba(236,72,153,0.25)' : '0 4px 6px -1px rgba(0,0,0,0.1)',
                  fontSize: '12px',
                  color: isDark ? '#FFF' : '#000',
                  fontWeight: 600,
                }}
                formatter={(val: any) => [
                  val !== undefined
                    ? `${currency === 'PEN' ? 'S/' : '$'} ${Number(val).toLocaleString('es-PE', {
                        minimumFractionDigits: 2,
                      })}`
                    : '',
                  'Monto Recaudado',
                ]}
              />
            </RadarChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-slate-500 font-mono">
            Cargando gráfico...
          </div>
        )}
      </div>

      {/* Desglose real por canal / entidad bancaria */}
      <div className="pt-3 border-t border-slate-800/40 space-y-2">
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          {categories.slice(0, 4).map((c, i) => (
            <div
              key={i}
              className={`p-2 rounded-xl border flex items-center justify-between transition-all card-hover-lift ${
                isDark ? 'bg-[#151D2A] border-[#1A2232] hover:border-pink-500/30' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <span className="text-slate-400 truncate max-w-[85px] font-bold">{c.category}</span>
              <span className={`font-mono font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {formatCurrency(c.amountPenNeto, includeIgv, currency, exchangeRateUsd)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
