'use client';

import React, { useState } from 'react';
import {
  Receipt,
  FileText,
  Search,
  Plus,
  Download,
  Printer,
  CheckCircle2,
  Clock,
  Building2,
  Calendar,
} from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';

interface FacturaComercial {
  id: string;
  numeroFactura: string;
  ordenRef: string;
  cliente: string;
  ruc: string;
  fechaEmision: string;
  fechaVencimiento: string;
  subtotal: number;
  igv: number;
  montoTotal: number;
  estado: 'PAGADA' | 'EMITIDA' | 'VENCIDA';
}

const FACTURAS_DATA: FacturaComercial[] = [
  {
    id: 'FAC-001',
    numeroFactura: 'F001-0004821',
    ordenRef: '#PO-0841',
    cliente: 'ALFALION INVESTMENT SAC',
    ruc: '20612434124',
    fechaEmision: '15/08/2026',
    fechaVencimiento: '14/09/2026',
    subtotal: 12474.58,
    igv: 2245.42,
    montoTotal: 14720.00,
    estado: 'EMITIDA',
  },
  {
    id: 'FAC-002',
    numeroFactura: 'F001-0004820',
    ordenRef: '#PO-0840',
    cliente: 'MULTIPLAZA PERU S.A.C.',
    ruc: '20611510315',
    fechaEmision: '10/08/2026',
    fechaVencimiento: '25/08/2026',
    subtotal: 27500.00,
    igv: 4950.00,
    montoTotal: 32450.00,
    estado: 'PAGADA',
  },
  {
    id: 'FAC-003',
    numeroFactura: 'F001-0004819',
    ordenRef: '#PO-0839',
    cliente: 'NEXARA CORP SAC',
    ruc: '20615778207',
    fechaEmision: '05/08/2026',
    fechaVencimiento: '20/08/2026',
    subtotal: 27542.37,
    igv: 4957.63,
    montoTotal: 32500.00,
    estado: 'PAGADA',
  },
];

export default function DocumentosFacturasPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [search, setSearch] = useState('');
  const cardBg = isDark ? 'bg-[#0F141C] border-[#1A2232]' : 'bg-white border-slate-200 shadow-sm';
  const textTitle = isDark ? 'text-slate-400' : 'text-slate-600';
  const textValue = isDark ? 'text-white' : 'text-slate-900';
  const inputBg = isDark
    ? 'bg-[#151D2A] border-[#1A2232] text-slate-200 placeholder-slate-500'
    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400';

  const facturasFiltradas = FACTURAS_DATA.filter((f) =>
    !search.trim() ||
    f.numeroFactura.toLowerCase().includes(search.toLowerCase()) ||
    f.cliente.toLowerCase().includes(search.toLowerCase()) ||
    f.ruc.includes(search) ||
    f.ordenRef.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className={`p-5 rounded-2xl border flex flex-wrap items-center justify-between gap-4 ${cardBg}`}>
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Receipt className="w-6 h-6" />
          </div>
          <div>
            <h1 className={`text-lg font-black tracking-tight ${textValue}`}>
              Documentos & Facturación Electrónica (SUNAT)
            </h1>
            <p className={`text-xs ${textTitle}`}>
              Emisión de comprobantes electrónicos, guías de remisión y control fiscal de ventas.
            </p>
          </div>
        </div>

        <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-500/20">
          <Plus className="w-4 h-4" />
          <span>Emitir Factura / Boleta</span>
        </button>
      </div>

      {/* 4 KPIs */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className={`rounded-2xl p-4 border space-y-1 ${cardBg}`}>
          <span className={`text-[10px] font-bold tracking-widest uppercase ${textTitle}`}>FACTURACIÓN DEL MES</span>
          <p className="text-2xl font-black font-mono text-cyan-400">S/ 79,670.00</p>
          <span className="text-[10px] text-slate-500">Total facturado</span>
        </div>

        <div className={`rounded-2xl p-4 border space-y-1 ${cardBg}`}>
          <span className={`text-[10px] font-bold tracking-widest uppercase ${textTitle}`}>IGV GENERADO (18%)</span>
          <p className="text-2xl font-black font-mono text-blue-400">S/ 12,153.05</p>
          <span className="text-[10px] text-slate-500">Crédito fiscal SUNAT</span>
        </div>

        <div className={`rounded-2xl p-4 border space-y-1 ${cardBg}`}>
          <span className={`text-[10px] font-bold tracking-widest uppercase ${textTitle}`}>COMPROBANTES EMITIDOS</span>
          <p className="text-2xl font-black font-mono text-emerald-400">3</p>
          <span className="text-[10px] text-slate-500">Facturas electrónicas</span>
        </div>

        <div className={`rounded-2xl p-4 border space-y-1 ${cardBg}`}>
          <span className={`text-[10px] font-bold tracking-widest uppercase ${textTitle}`}>ESTADO SINCRONIZACIÓN</span>
          <p className="text-2xl font-black font-mono text-emerald-400">100% SUNAT</p>
          <span className="text-[10px] text-slate-500">CPE Aceptados</span>
        </div>
      </div>

      {/* Tabla de Facturas */}
      <div className={`rounded-2xl p-5 border space-y-4 shadow-sm ${cardBg}`}>
        <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-3 border-slate-800/60">
          <h2 className={`text-xs font-bold uppercase tracking-wider ${textValue}`}>
            Registro de Comprobantes Emitidos ({facturasFiltradas.length})
          </h2>

          <div className="relative max-w-sm flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar por N° Factura, RUC o Cliente..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full pl-9 pr-3 py-1.5 rounded-lg border text-xs font-sans ${inputBg}`}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className={`border-b text-[10px] uppercase font-bold ${
                isDark ? 'border-slate-800/60 text-slate-400' : 'border-slate-200 text-slate-700 bg-slate-50'
              }`}>
                <th className="py-2.5 px-3">COMPROBANTE</th>
                <th className="py-2.5 px-3">O.C. REF</th>
                <th className="py-2.5 px-3">CLIENTE</th>
                <th className="py-2.5 px-3">EMISIÓN / VENCE</th>
                <th className="py-2.5 px-3 text-right">SUBTOTAL</th>
                <th className="py-2.5 px-3 text-right">IGV (18%)</th>
                <th className="py-2.5 px-3 text-right">TOTAL</th>
                <th className="py-2.5 px-3 text-center">ESTADO</th>
                <th className="py-2.5 px-3 text-center">ACCIONES</th>
              </tr>
            </thead>
            <tbody className={`divide-y font-mono text-[11px] ${
              isDark ? 'divide-slate-800/60' : 'divide-slate-100'
            }`}>
              {facturasFiltradas.map((f) => (
                <tr key={f.id} className={`transition-colors ${isDark ? 'hover:bg-slate-800/30' : 'hover:bg-slate-50'}`}>
                  <td className="py-3 px-3 font-bold text-cyan-400">{f.numeroFactura}</td>
                  <td className="py-3 px-3 text-slate-400 font-bold">{f.ordenRef}</td>
                  <td className="py-3 px-3 font-sans font-bold text-slate-200">{f.cliente}</td>
                  <td className="py-3 px-3 text-slate-400">{f.fechaEmision} / {f.fechaVencimiento}</td>
                  <td className="py-3 px-3 text-right text-slate-300">S/ {f.subtotal.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</td>
                  <td className="py-3 px-3 text-right text-blue-400">S/ {f.igv.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</td>
                  <td className="py-3 px-3 text-right font-black text-emerald-400">S/ {f.montoTotal.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</td>
                  <td className="py-3 px-3 text-center">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                      f.estado === 'PAGADA'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    }`}>
                      {f.estado}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button title="Descargar PDF" className="p-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300">
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button title="Imprimir" className="p-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300">
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
