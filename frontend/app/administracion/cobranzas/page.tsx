'use client';

import React, { useState } from 'react';
import {
  CreditCard,
  DollarSign,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Building2,
  Calendar,
  Plus,
} from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';

interface CuentaCobrar {
  id: string;
  cliente: string;
  ruc: string;
  documentoRef: string;
  montoOriginal: number;
  saldoPendiente: number;
  fechaVencimiento: string;
  diasRestantes: number;
  estadoCobranza: 'AL_DIA' | 'POR_VENCER' | 'VENCIDO';
}

const COBRANZAS_DATA: CuentaCobrar[] = [
  {
    id: 'CC-001',
    cliente: 'GEYMA S.A.C.',
    ruc: '20614697321',
    documentoRef: 'F001-0004820',
    montoOriginal: 14717.50,
    saldoPendiente: 14717.50,
    fechaVencimiento: '21/08/2026',
    diasRestantes: 13,
    estadoCobranza: 'AL_DIA',
  },
  {
    id: 'CC-002',
    cliente: 'FARMACIAS PERUANAS S.A.C.',
    ruc: '20381396431',
    documentoRef: 'F001-0004821',
    montoOriginal: 42500.00,
    saldoPendiente: 42500.00,
    fechaVencimiento: '07/09/2026',
    diasRestantes: 30,
    estadoCobranza: 'AL_DIA',
  },
  {
    id: 'CC-003',
    cliente: 'AUSTIN COSMETICS PERÚ',
    ruc: '20601234567',
    documentoRef: 'F001-0004819',
    montoOriginal: 32500.00,
    saldoPendiente: 32500.00,
    fechaVencimiento: '16/08/2026',
    diasRestantes: 8,
    estadoCobranza: 'POR_VENCER',
  },
];

export default function CuentasCobrarPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [search, setSearch] = useState('');
  const cardBg = isDark ? 'bg-[#0F141C] border-[#1A2232]' : 'bg-white border-slate-200 shadow-sm';
  const textTitle = isDark ? 'text-slate-400' : 'text-slate-600';
  const textValue = isDark ? 'text-white' : 'text-slate-900';
  const inputBg = isDark
    ? 'bg-[#151D2A] border-[#1A2232] text-slate-200 placeholder-slate-500'
    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400';

  const cuentasFiltradas = COBRANZAS_DATA.filter((c) =>
    !search.trim() ||
    c.cliente.toLowerCase().includes(search.toLowerCase()) ||
    c.ruc.includes(search) ||
    c.documentoRef.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className={`p-5 rounded-2xl border flex flex-wrap items-center justify-between gap-4 ${cardBg}`}>
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <h1 className={`text-lg font-black tracking-tight ${textValue}`}>
              Cuentas por Cobrar & Control de Liquidez
            </h1>
            <p className={`text-xs ${textTitle}`}>
              Monitoreo de vencimientos, estados de cuenta comerciales y recaudación diaria.
            </p>
          </div>
        </div>

        <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20">
          <Plus className="w-4 h-4" />
          <span>Registrar Pago / Abono</span>
        </button>
      </div>

      {/* 4 KPIs */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className={`rounded-2xl p-4 border space-y-1 ${cardBg}`}>
          <span className={`text-[10px] font-bold tracking-widest uppercase ${textTitle}`}>TOTAL POR COBRAR</span>
          <p className="text-2xl font-black font-mono text-emerald-400">S/ 89,717.50</p>
          <span className="text-[10px] text-slate-500">Saldo pendiente</span>
        </div>

        <div className={`rounded-2xl p-4 border space-y-1 ${cardBg}`}>
          <span className={`text-[10px] font-bold tracking-widest uppercase ${textTitle}`}>COBRANZAS AL DÍA</span>
          <p className="text-2xl font-black font-mono text-blue-400">S/ 57,217.50</p>
          <span className="text-[10px] text-slate-500">Dentro del plazo</span>
        </div>

        <div className={`rounded-2xl p-4 border space-y-1 ${cardBg}`}>
          <span className={`text-[10px] font-bold tracking-widest uppercase ${textTitle}`}>PRÓXIMAS A VENCER</span>
          <p className="text-2xl font-black font-mono text-amber-400">S/ 32,500.00</p>
          <span className="text-[10px] text-slate-500">&lt; 10 días restantes</span>
        </div>

        <div className={`rounded-2xl p-4 border space-y-1 ${cardBg}`}>
          <span className={`text-[10px] font-bold tracking-widest uppercase ${textTitle}`}>ÍNDICE DE MOROSIDAD</span>
          <p className="text-2xl font-black font-mono text-emerald-400">0.0%</p>
          <span className="text-[10px] text-slate-500">Excelente salud</span>
        </div>
      </div>

      {/* Tabla de Cuentas por Cobrar */}
      <div className={`rounded-2xl p-5 border space-y-4 shadow-sm ${cardBg}`}>
        <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-3 border-slate-800/60">
          <h2 className={`text-xs font-bold uppercase tracking-wider ${textValue}`}>
            Documentos Pendientes de Cobro ({cuentasFiltradas.length})
          </h2>

          <div className="relative max-w-sm flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar por Cliente, RUC o Factura..."
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
                <th className="py-2.5 px-3">DOCUMENTO</th>
                <th className="py-2.5 px-3">CLIENTE</th>
                <th className="py-2.5 px-3">RUC</th>
                <th className="py-2.5 px-3">VENCE</th>
                <th className="py-2.5 px-3 text-right">MONTO ORIGINAL</th>
                <th className="py-2.5 px-3 text-right">SALDO POR COBRAR</th>
                <th className="py-2.5 px-3 text-center">ESTADO</th>
                <th className="py-2.5 px-3 text-center">ACCIONES</th>
              </tr>
            </thead>
            <tbody className={`divide-y font-mono text-[11px] ${
              isDark ? 'divide-slate-800/60' : 'divide-slate-100'
            }`}>
              {cuentasFiltradas.map((c) => (
                <tr key={c.id} className={`transition-colors ${isDark ? 'hover:bg-slate-800/30' : 'hover:bg-slate-50'}`}>
                  <td className="py-3 px-3 font-bold text-cyan-400">{c.documentoRef}</td>
                  <td className="py-3 px-3 font-sans font-bold text-slate-200">{c.cliente}</td>
                  <td className="py-3 px-3 text-slate-400">{c.ruc}</td>
                  <td className="py-3 px-3 text-slate-300">
                    <span className="block font-bold">{c.fechaVencimiento}</span>
                    <span className="text-[10px] text-slate-400">Quedan {c.diasRestantes} días</span>
                  </td>
                  <td className="py-3 px-3 text-right text-slate-300">S/ {c.montoOriginal.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</td>
                  <td className="py-3 px-3 text-right font-black text-emerald-400">S/ {c.saldoPendiente.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</td>
                  <td className="py-3 px-3 text-center">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                      c.estadoCobranza === 'AL_DIA'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    }`}>
                      {c.estadoCobranza === 'AL_DIA' ? 'Al Día' : 'Por Vencer'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <button className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/30 hover:bg-blue-500/20 text-[10px] font-bold font-sans">
                      Abonar
                    </button>
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
