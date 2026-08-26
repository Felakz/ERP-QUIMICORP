'use client';

import React from 'react';
import { FileSpreadsheet, Download, FileText } from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';

export default function AdministracionReportesPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const cardBg = isDark ? 'bg-[#0F141C] border-[#1A2232]' : 'bg-white border-slate-200 shadow-sm';

  return (
    <div className="space-y-6 font-sans">
      <div className={`p-6 rounded-2xl border flex items-center justify-between gap-4 ${cardBg}`}>
        <div>
          <h1 className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Centro de Reportes & Exportaciones (Gerencia)
          </h1>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Exportación consolidada a Excel y PDF para SUNAT, contabilidad y auditorías.
          </p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
          🔒 Exclusivo Gerencia
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`p-5 rounded-2xl border space-y-3 ${cardBg}`}>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <h3 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>Reporte Mensual de Ventas</h3>
          <p className="text-xs text-slate-400">Desglose de facturación, clientes y pedidos en formato Excel .xlsx</p>
          <button className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2">
            <Download className="w-4 h-4" />
            <span>Descargar Excel</span>
          </button>
        </div>

        <div className={`p-5 rounded-2xl border space-y-3 ${cardBg}`}>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>Kardex Valorizado Contable</h3>
          <p className="text-xs text-slate-400">Resumen de costos y valor de inventarios para la declaración anual.</p>
          <button className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2">
            <Download className="w-4 h-4" />
            <span>Descargar PDF</span>
          </button>
        </div>

        <div className={`p-5 rounded-2xl border space-y-3 ${cardBg}`}>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <h3 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>Auditoría de Compras</h3>
          <p className="text-xs text-slate-400">Detalle de materia prima adquirida y comparativo con ordenes.</p>
          <button className="w-full py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center justify-center gap-2">
            <Download className="w-4 h-4" />
            <span>Descargar Excel</span>
          </button>
        </div>
      </div>
    </div>
  );
}
