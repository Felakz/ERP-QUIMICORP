'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Download, Filter, CheckCircle2, Clock, AlertCircle, ExternalLink } from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';
import { CommercialDocType, CommercialDocument, CurrencyType } from '@/types/dashboard';
import { formatCurrency } from '@/lib/dashboardFormatters';
import { ROUTES } from '@/config/routes';

import { TableSkeleton } from '@/components/ui/TableSkeleton';
import { ActionableEmptyState } from '@/components/ui/ActionableEmptyState';

interface RecentDocumentsTableProps {
  documents: CommercialDocument[];
  includeIgv: boolean;
  currency: CurrencyType;
  exchangeRateUsd: number;
  loading?: boolean;
}

export const RecentDocumentsTable: React.FC<RecentDocumentsTableProps> = ({
  documents,
  includeIgv,
  currency,
  exchangeRateUsd,
  loading = false,
}) => {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [activeTab, setActiveTab] = useState<CommercialDocType>('TODOS');

  if (loading && (!documents || documents.length === 0)) {
    return <TableSkeleton rows={5} cols={6} />;
  }

  const cardBg = isDark
    ? 'bg-[#0F141C] border-[#1A2232] shadow-[0_0_20px_rgba(0,242,195,0.03)]'
    : 'bg-white border-slate-200 shadow-sm';

  const filteredDocs = documents.filter((doc) => {
    if (activeTab === 'TODOS') return true;
    return doc.type === activeTab;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PAGADO':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 inline-flex items-center gap-1.5 shadow-[0_0_8px_rgba(16,185,129,0.2)]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 led-pulse" /> Pagado
          </span>
        );
      case 'PENDIENTE':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-500/15 text-amber-400 border border-amber-500/30 inline-flex items-center gap-1.5 shadow-[0_0_8px_rgba(245,158,11,0.2)]">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" /> Pendiente
          </span>
        );
      case 'APROBADO':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 inline-flex items-center gap-1.5 shadow-[0_0_8px_rgba(16,185,129,0.2)]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Aprobado
          </span>
        );
      case 'EN_PROCESO':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-blue-500/15 text-blue-400 border border-blue-500/30 inline-flex items-center gap-1.5 shadow-[0_0_8px_rgba(59,130,246,0.2)]">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" /> En Proceso
          </span>
        );
      case 'VENCIDO':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-rose-500/15 text-rose-400 border border-rose-500/30 inline-flex items-center gap-1.5 shadow-[0_0_8px_rgba(244,63,94,0.2)]">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" /> Vencido
          </span>
        );
      case 'RECHAZADO':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-rose-500/15 text-rose-400 border border-rose-500/30 inline-flex items-center gap-1.5 shadow-[0_0_8px_rgba(244,63,94,0.2)]">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" /> Rechazado
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-slate-500/15 text-slate-400 border border-slate-500/30 inline-flex items-center gap-1.5">
            {status || 'Sin Estado'}
          </span>
        );
    }
  };

  return (
    <div className={`p-6 rounded-2xl border ${cardBg} space-y-4`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2
            onClick={() => router.push(ROUTES.ANALISIS)}
            className={`text-base font-black cursor-pointer hover:text-[#00F2C3] transition-colors ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
            title="Ir a Análisis & Inteligencia de Ventas"
          >
            Documentos Comerciales Recientes
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            Facturas, cotizaciones y notas de venta emitidas con ficha técnica
          </p>
        </div>

        {/* Tab Filters */}
        <div className={`flex items-center gap-1 p-1 rounded-xl border ${isDark ? 'bg-[#151D2A] border-[#1A2232]' : 'bg-slate-100 border-slate-200'}`}>
          {(['TODOS', 'FACTURA', 'COTIZACION', 'NOTA_VENTA'] as CommercialDocType[]).map((tabKey) => {
            const labels: Record<string, string> = {
              TODOS: 'Todos',
              FACTURA: 'Factura',
              COTIZACION: 'Cotización',
              NOTA_VENTA: 'Nota Venta',
            };
            const isSel = activeTab === tabKey;
            return (
              <button
                key={tabKey}
                onClick={() => setActiveTab(tabKey)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  isSel
                    ? isDark
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-[0_0_12px_rgba(0,242,195,0.3)] font-black'
                      : 'bg-blue-600 text-white shadow-sm font-black'
                    : isDark
                    ? 'text-slate-400 hover:text-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {labels[tabKey] || tabKey}
              </button>
            );
          })}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className={`border-b text-[10px] font-black uppercase tracking-wider ${
              isDark ? 'border-[#1A2232] text-slate-400 bg-[#151D2A]/50' : 'border-slate-200 text-slate-700 bg-slate-50'
            }`}>
              <th className="py-3 px-3">DOCUMENTO N°</th>
              <th className="py-3 px-3">CLIENTE / RUC</th>
              <th className="py-3 px-3">VOLUMEN (KG/LT)</th>
              <th className="py-3 px-3">EMISIÓN</th>
              <th className="py-3 px-3">VENCIMIENTO</th>
              <th className="py-3 px-3">MONTO TOTAL</th>
              <th className="py-3 px-3">ESTADO</th>
              <th className="py-3 px-3 text-right">PDF</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDark ? 'divide-slate-800/40' : 'divide-slate-100'}`}>
            {filteredDocs.map((doc) => {
              const formattedAmount = formatCurrency(
                doc.totalAmountPenNeto,
                includeIgv,
                currency,
                exchangeRateUsd
              );

              return (
                <tr
                  key={doc.id}
                  onClick={() => router.push(ROUTES.PEDIDOS)}
                  className={`cursor-pointer transition-all duration-150 ${isDark ? 'hover:bg-[#151D2A] hover:shadow-[inset_0_0_12px_rgba(0,242,195,0.05)]' : 'hover:bg-slate-50'}`}
                  title="Ver pedido en módulo de Pedidos Comerciales"
                >
                  <td className="py-3 px-3 font-mono font-black text-[#00F2C3]">{doc.docNumber}</td>
                  <td className="py-3 px-3">
                    <span className={`font-bold block ${isDark ? 'text-white' : 'text-slate-900'}`}>{doc.customerName}</span>
                    <span className="text-[10px] text-slate-500 font-mono">RUC: {doc.ruc}</span>
                  </td>
                  <td className={`py-3 px-3 font-mono font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                    {(doc.volumeKgLt ?? 0).toLocaleString('es-PE')} KG
                  </td>
                  <td className={`py-3 px-3 font-mono ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{doc.issueDate}</td>
                  <td className={`py-3 px-3 font-mono ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{doc.dueDate}</td>
                  <td className={`py-3 px-3 font-mono font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{formattedAmount}</td>
                  <td className="py-3 px-3">{getStatusBadge(doc.status)}</td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log(`[PDF Generator] Generando ficha técnica para ${doc.docNumber}`);
                      }}
                      className="p-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-[#00F2C3] transition-all border border-cyan-500/30 shadow-sm"
                      title="Descargar PDF con Ficha Técnica"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
