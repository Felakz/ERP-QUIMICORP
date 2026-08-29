'use client';

import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { useTheme } from '@/lib/ThemeContext';
import { CurrencyType, SalesAnalyticsPoint } from '@/types/dashboard';
import { calculateMonetaryValue, formatCurrency } from '@/lib/dashboardFormatters';

interface SalesAnalyticsChartProps {
  data: SalesAnalyticsPoint[];
  includeIgv: boolean;
  currency: CurrencyType;
  exchangeRateUsd: number;
}

export const SalesAnalyticsChart: React.FC<SalesAnalyticsChartProps> = ({
  data,
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
  const gridColor = isDark ? '#1A2232' : '#E2E8F0';
  const textColor = isDark ? '#94A3B8' : '#64748B';

  // Transform chart data dynamically based on IGV and Currency
  const chartData = data.map((item) => ({
    month: item.month,
    Ventas: calculateMonetaryValue(item.ventasNetas, includeIgv, currency, exchangeRateUsd),
    Facturacion: calculateMonetaryValue(item.facturacionNetas, includeIgv, currency, exchangeRateUsd),
    Cotizaciones: calculateMonetaryValue(item.cotizacionesNetas, includeIgv, currency, exchangeRateUsd),
  }));

  // Totals for upper legend
  const totalEarningsPen = data.reduce((acc, curr) => acc + curr.ventasNetas, 0);
  const totalInvoicedPen = data.reduce((acc, curr) => acc + curr.facturacionNetas, 0);

  return (
    <div className={`p-6 rounded-2xl border ${cardBg} space-y-4`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Sales & Revenue Analytics
          </h2>
          <p className="text-xs text-slate-400">
            Evolución mensual comparativa: Ventas ejecutadas vs. Facturación vs. Cotizaciones
          </p>
        </div>

        {/* Legend metrics */}
        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
            <span className="text-slate-400">Ventas:</span>
            <span className={`font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {formatCurrency(totalEarningsPen, includeIgv, currency, exchangeRateUsd)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="text-slate-400">Facturado:</span>
            <span className={`font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {formatCurrency(totalInvoicedPen, includeIgv, currency, exchangeRateUsd)}
            </span>
          </div>
        </div>
      </div>

      <div className="h-72 w-full pt-2">
        {isMounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
              <linearGradient id="gradientVentas" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="gradientFacturacion" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis dataKey="month" stroke={textColor} fontSize={11} tickLine={false} />
            <YAxis
              stroke={textColor}
              fontSize={11}
              tickLine={false}
              tickFormatter={(val) =>
                `${currency === 'PEN' ? 'S/' : '$'}${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`
              }
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
              ]}
            />
            <Area
              type="monotone"
              dataKey="Ventas"
              stroke="#6366F1"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#gradientVentas)"
            />
            <Area
              type="monotone"
              dataKey="Facturacion"
              stroke="#10B981"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#gradientFacturacion)"
            />
          </AreaChart>
        </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-slate-500">
            Cargando gráfico...
          </div>
        )}
      </div>
    </div>
  );
};
