'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Download, Filter, CheckCircle2, Clock, AlertCircle, ExternalLink } from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';
import { CommercialDocType, CommercialDocument, CurrencyType } from '@/types/dashboard';
import { formatCurrency } from '@/lib/dashboardFormatters';
import { ROUTES } from '@/config/routes';

interface RecentDocumentsTableProps {
  documents: CommercialDocument[];
  includeIgv: boolean;
  currency: CurrencyType;
  exchangeRateUsd: number;
}

export const RecentDocumentsTable: React.FC<RecentDocumentsTableProps> = ({
  documents,
  includeIgv,
  currency,
  exchangeRateUsd,
}) => {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [activeTab, setActiveTab] = useState<CommercialDocType>('TODOS');

  const cardBg = isDark ? 'bg-[#0F141C] border-[#1A2232]' : 'bg-white border-slate-200 shadow-sm';

  const filteredDocs = documents.filter((doc) => {
    if (activeTab === 'TODOS') return true;
    return doc.type === activeTab;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PAGADO':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 inline-flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Pagado
          </span>
        );
      case 'PENDIENTE':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 inline-flex items-center gap-1">
            <Clock className="w-3 h-3" /> Pendiente
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 inline-flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> Vencido
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
            className={`text-base font-bold cursor-pointer hover:text-blue-400 transition-colors ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
            title="Ir a Análisis & Inteligencia de Ventas"
          >
            Documentos Comerciales Recientes
          </h2>
          <p className="text-xs text-slate-400">
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
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  isSel
                    ? 'bg-blue-600 text-white shadow-sm'
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
            <tr className={`border-b text-[10px] font-bold uppercase tracking-wider ${
              isDark ? 'border-[#1A2232] text-slate-400' : 'border-slate-200 text-slate-700 bg-slate-50'
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
                  className={`cursor-pointer transition-all ${isDark ? 'hover:bg-[#151D2A]' : 'hover:bg-slate-50'}`}
                  title="Ver pedido en módulo de Pedidos Comerciales"
                >
                  <td className="py-3 px-3 font-mono font-bold text-blue-500">{doc.docNumber}</td>
                  <td className="py-3 px-3">
                    <span className={`font-bold block ${isDark ? 'text-white' : 'text-slate-900'}`}>{doc.customerName}</span>
                    <span className="text-[10px] text-slate-500 font-mono">RUC: {doc.ruc}</span>
                  </td>
                  <td className={`py-3 px-3 font-mono font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                    {(doc.volumeKgLt ?? 0).toLocaleString('es-PE')} KG
                  </td>
                  <td className={`py-3 px-3 font-mono ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{doc.issueDate}</td>
                  <td className={`py-3 px-3 font-mono ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{doc.dueDate}</td>
                  <td className={`py-3 px-3 font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{formattedAmount}</td>
                  <td className="py-3 px-3">{getStatusBadge(doc.status)}</td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log(`[PDF Generator] Generando ficha técnica para ${doc.docNumber}`);
                      }}
                      className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 transition-all border border-blue-500/20"
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
