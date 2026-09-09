'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FileText, CheckCircle2, Clock, XCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';
import { CommercialOrder, CurrencyType } from '@/types/dashboard';
import { formatCurrency } from '@/lib/dashboardFormatters';
import { ROUTES } from '@/config/routes';

import { TableSkeleton } from '@/components/ui/TableSkeleton';

interface RecentOrdersTableProps {
  orders: CommercialOrder[];
  includeIgv: boolean;
  currency: CurrencyType;
  exchangeRateUsd: number;
  loading?: boolean;
}

export const RecentOrdersTable: React.FC<RecentOrdersTableProps> = ({
  orders,
  includeIgv,
  currency,
  exchangeRateUsd,
  loading = false,
}) => {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  if (loading && (!orders || orders.length === 0)) {
    return <TableSkeleton rows={5} cols={5} />;
  }

  const cardBg = isDark
    ? 'bg-[#0F141C] border-[#1A2232] shadow-[0_0_20px_rgba(0,242,195,0.03)]'
    : 'bg-white border-slate-200 shadow-sm';

  const getApprovalBadge = (status: string) => {
    switch (status) {
      case 'APROBADO':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 inline-flex items-center gap-1.5 shadow-[0_0_8px_rgba(16,185,129,0.2)]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 led-pulse" /> Aprobado
          </span>
        );
      case 'PENDIENTE':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-500/15 text-amber-400 border border-amber-500/30 inline-flex items-center gap-1.5 shadow-[0_0_8px_rgba(245,158,11,0.2)]">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" /> En Espera
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-rose-500/15 text-rose-400 border border-rose-500/30 inline-flex items-center gap-1.5 shadow-[0_0_8px_rgba(244,63,94,0.2)]">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" /> Rechazado
          </span>
        );
    }
  };

  return (
    <div className={`p-6 rounded-2xl border ${cardBg} space-y-4`}>
      <div className="flex items-center justify-between">
        <div>
          <h2
            onClick={() => router.push(ROUTES.CONTROL_PRODUCCION)}
            className={`text-base font-black cursor-pointer hover:text-[#00F2C3] transition-colors ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            Órdenes & Cotizaciones Emitidas
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            Seguimiento de pedidos comerciales enviados a Planta y estado de aprobación
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className={`border-b text-[10px] font-black uppercase tracking-wider ${
              isDark ? 'border-[#1A2232] text-slate-400 bg-[#151D2A]/50' : 'border-slate-200 text-slate-700 bg-slate-50'
            }`}>
              <th className="py-3 px-3">CÓDIGO OP/COT</th>
              <th className="py-3 px-3">CLIENTE</th>
              <th className="py-3 px-3">VARIANTE / MARCA BLANCA</th>
              <th className="py-3 px-3">PLAZO PAGO</th>
              <th className="py-3 px-3">MONTO TOTAL</th>
              <th className="py-3 px-3 text-right">ESTADO APROBACIÓN</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDark ? 'divide-slate-800/40' : 'divide-slate-100'}`}>
            {orders.map((ord) => {
              const formattedAmount = formatCurrency(
                ord.totalAmountPenNeto,
                includeIgv,
                currency,
                exchangeRateUsd
              );

              return (
                <tr
                  key={ord.id}
                  onClick={() => router.push(ROUTES.CONTROL_PRODUCCION)}
                  className={`cursor-pointer transition-all duration-150 ${isDark ? 'hover:bg-[#151D2A] hover:shadow-[inset_0_0_12px_rgba(245,158,11,0.05)]' : 'hover:bg-slate-50'}`}
                  title="Ver orden en Control de Producción & QA"
                >
                  <td className="py-3 px-3 font-mono font-black text-amber-400">{ord.code}</td>
                  <td className={`py-3 px-3 font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{ord.customerName}</td>
                  <td className={`py-3 px-3 font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{ord.variantName}</td>
                  <td className={`py-3 px-3 font-mono font-bold ${isDark ? 'text-cyan-400' : 'text-slate-700'}`}>{ord.paymentTerm}</td>
                  <td className={`py-3 px-3 font-mono font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{formattedAmount}</td>
                  <td className="py-3 px-3 text-right">{getApprovalBadge(ord.approvalStatus)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
