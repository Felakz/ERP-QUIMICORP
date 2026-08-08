'use client';

import React, { useState } from 'react';
import {
  AlertTriangle,
  Search,
  Plus,
  Beaker,
  TrendingDown,
  Clock,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';

interface AlertaMateriaPrima {
  id: string;
  codigoMP: string;
  nombre: string;
  stockActual: number;
  stockMinimo: number;
  unidadMedida: string;
  nivelCriticidad: 'CRITICO' | 'ALERTA' | 'NORMAL';
  proveedorSugerido: string;
  diasParaAgotarse: number;
}

const ALERTAS_DATA: AlertaMateriaPrima[] = [
  {
    id: 'ALR-001',
    codigoMP: 'MP-LES-001',
    nombre: 'LAURIL ÉTER SULFATO DE SODIO (LESS 70%)',
    stockActual: 180.0,
    stockMinimo: 350.0,
    unidadMedida: 'KG',
    nivelCriticidad: 'CRITICO',
    proveedorSugerido: 'QUÍMICA SUIZA DEL PERÚ S.A.',
    diasParaAgotarse: 4,
  },
  {
    id: 'ALR-002',
    codigoMP: 'MP-FRA-004',
    nombre: 'FRAGANCIA CONCENTRADA LAVANDA FRANCESA',
    stockActual: 15.0,
    stockMinimo: 25.0,
    unidadMedida: 'KG',
    nivelCriticidad: 'ALERTA',
    proveedorSugerido: 'ESENCIAS & AROMAS ANDINOS S.A.C.',
    diasParaAgotarse: 8,
  },
  {
    id: 'ALR-003',
    codigoMP: 'MP-COL-002',
    nombre: 'COLORANTE AZUL BRILLANTE FCF (POLVO)',
    stockActual: 4.5,
    stockMinimo: 10.0,
    unidadMedida: 'KG',
    nivelCriticidad: 'ALERTA',
    proveedorSugerido: 'PIGMENTOS INDUSTRIALES S.A.',
    diasParaAgotarse: 12,
  },
];

export default function AlertasStockPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [search, setSearch] = useState('');
  const cardBg = isDark ? 'bg-[#0F141C] border-[#1A2232]' : 'bg-white border-slate-200 shadow-sm';
  const textTitle = isDark ? 'text-slate-400' : 'text-slate-600';
  const textValue = isDark ? 'text-white' : 'text-slate-900';
  const inputBg = isDark
    ? 'bg-[#151D2A] border-[#1A2232] text-slate-200 placeholder-slate-500'
    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400';

  const alertasFiltradas = ALERTAS_DATA.filter((a) =>
    !search.trim() ||
    a.nombre.toLowerCase().includes(search.toLowerCase()) ||
    a.codigoMP.toLowerCase().includes(search.toLowerCase()) ||
    a.proveedorSugerido.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className={`p-5 rounded-2xl border flex flex-wrap items-center justify-between gap-4 ${cardBg}`}>
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h1 className={`text-lg font-black tracking-tight ${textValue}`}>
              Alertas de Materia Prima & Reabastecimiento
            </h1>
            <p className={`text-xs ${textTitle}`}>
              Monitoreo predictivo de insumos químicos para evitar quiebres de stock en reactores de planta.
            </p>
          </div>
        </div>

        <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20">
          <Plus className="w-4 h-4" />
          <span>Generar Orden de Compra (O.C.)</span>
        </button>
      </div>

      {/* 4 KPIs */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className={`rounded-2xl p-4 border space-y-1 ${cardBg}`}>
          <span className={`text-[10px] font-bold tracking-widest uppercase ${textTitle}`}>INSUMOS EN ALERTA CRÍTICA</span>
          <p className="text-2xl font-black font-mono text-rose-400">1 Insumo</p>
          <span className="text-[10px] text-slate-500">&lt; 4 días de autonomía</span>
        </div>

        <div className={`rounded-2xl p-4 border space-y-1 ${cardBg}`}>
          <span className={`text-[10px] font-bold tracking-widest uppercase ${textTitle}`}>EN REABASTECIMIENTO</span>
          <p className="text-2xl font-black font-mono text-amber-400">2 Insumos</p>
          <span className="text-[10px] text-slate-500">Alerta preventiva</span>
        </div>

        <div className={`rounded-2xl p-4 border space-y-1 ${cardBg}`}>
          <span className={`text-[10px] font-bold tracking-widest uppercase ${textTitle}`}>CAPACIDAD DE PLANTA</span>
          <p className="text-2xl font-black font-mono text-cyan-400">92% ACTIVA</p>
          <span className="text-[10px] text-slate-500">Sin paradas</span>
        </div>

        <div className={`rounded-2xl p-4 border space-y-1 ${cardBg}`}>
          <span className={`text-[10px] font-bold tracking-widest uppercase ${textTitle}`}>CONVENIOS PROVEEDOR</span>
          <p className="text-2xl font-black font-mono text-emerald-400">3 Activos</p>
          <span className="text-[10px] text-slate-500">Entrega rápida 24h</span>
        </div>
      </div>

      {/* Tabla de Alertas */}
      <div className={`rounded-2xl p-5 border space-y-4 shadow-sm ${cardBg}`}>
        <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-3 border-slate-800/60">
          <h2 className={`text-xs font-bold uppercase tracking-wider ${textValue}`}>
            Insumos Requiriendo Compra ({alertasFiltradas.length})
          </h2>

          <div className="relative max-w-sm flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar por Insumo, Código o Proveedor..."
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
                <th className="py-2.5 px-3">CÓDIGO</th>
                <th className="py-2.5 px-3">MATERIA PRIMA</th>
                <th className="py-2.5 px-3">PROVEEDOR RECOMENDADO</th>
                <th className="py-2.5 px-3 text-right">STOCK ACTUAL</th>
                <th className="py-2.5 px-3 text-right">STOCK MÍNIMO</th>
                <th className="py-2.5 px-3 text-center">AUTONOMÍA</th>
                <th className="py-2.5 px-3 text-center">CRITICIDAD</th>
                <th className="py-2.5 px-3 text-center">ACCIONES</th>
              </tr>
            </thead>
            <tbody className={`divide-y font-mono text-[11px] ${
              isDark ? 'divide-slate-800/60' : 'divide-slate-100'
            }`}>
              {alertasFiltradas.map((a) => (
                <tr key={a.id} className={`transition-colors ${isDark ? 'hover:bg-slate-800/30' : 'hover:bg-slate-50'}`}>
                  <td className="py-3 px-3 font-bold text-amber-400">{a.codigoMP}</td>
                  <td className="py-3 px-3 font-sans font-bold text-slate-200">{a.nombre}</td>
                  <td className="py-3 px-3 font-sans text-slate-400">{a.proveedorSugerido}</td>
                  <td className="py-3 px-3 text-right font-black text-rose-400">{a.stockActual} {a.unidadMedida}</td>
                  <td className="py-3 px-3 text-right text-slate-400">{a.stockMinimo} {a.unidadMedida}</td>
                  <td className="py-3 px-3 text-center font-bold text-amber-300">{a.diasParaAgotarse} días</td>
                  <td className="py-3 px-3 text-center">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                      a.nivelCriticidad === 'CRITICO'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    }`}>
                      {a.nivelCriticidad}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <button className="px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 text-[10px] font-bold font-sans">
                      Comprar
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
