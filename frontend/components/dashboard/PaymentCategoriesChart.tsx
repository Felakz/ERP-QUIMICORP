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

  const cardBg = isDark ? 'bg-[#0F141C] border-[#1A2232]' : 'bg-white border-slate-200 shadow-sm';
  const gridColor = isDark ? '#1A2232' : '#CBD5E1';
  const textColor = isDark ? '#94A3B8' : '#475569';

  const chartData = categories.map((c) => ({
    category: c.category,
    amount: calculateMonetaryValue(c.amountPenNeto, includeIgv, currency, exchangeRateUsd),
    fullMark: c.fullMark,
  }));

  const totalCollectedPen = categories.reduce((acc, curr) => acc + curr.amountPenNeto, 0);

  return (
    <div className={`p-6 rounded-2xl border ${cardBg} space-y-4`}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Métodos de Pago & Cobranza
          </h2>
          <p className="text-xs text-slate-400">
            Distribución por entidad financiera y modalidad comercial
          </p>
        </div>
      </div>

      <div className="h-64 w-full">
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
                borderColor: isDark ? '#1A2232' : '#CBD5E1',
                borderRadius: '12px',
                fontSize: '12px',
                color: isDark ? '#FFF' : '#000',
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
          <div className="w-full h-full flex items-center justify-center text-xs text-slate-500">
            Cargando gráfico...
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-800/10 text-xs">
        <span className="text-slate-400">Recaudación Total:</span>
        <span className={`font-black text-rose-400`}>
          {formatCurrency(totalCollectedPen, includeIgv, currency, exchangeRateUsd)}
        </span>
      </div>
    </div>
  );
};
