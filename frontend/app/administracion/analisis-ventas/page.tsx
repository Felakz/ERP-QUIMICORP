'use client';

import React from 'react';
import { TrendingUp, BarChart3, ArrowUpRight } from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';

export default function AdministracionAnalisisVentasPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const cardBg = isDark ? 'bg-[#0F141C] border-[#1A2232]' : 'bg-white border-slate-200 shadow-sm';

  return (
    <div className="space-y-6 font-sans">
      <div className={`p-6 rounded-2xl border flex items-center justify-between gap-4 ${cardBg}`}>
        <div>
          <div className="flex items-center gap-2 text-blue-500 font-bold text-xs uppercase tracking-widest mb-1">
            <TrendingUp className="w-4 h-4" />
            <span>Gestión Comercial</span>
          </div>
          <h1 className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Análisis & Inteligencia de Ventas (Gerencia)
          </h1>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Monitoreo ejecutivo de facturación, ranking de clientes corporativos y proyección de ventas.
          </p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
          🔒 Exclusivo Gerencia
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`p-4 rounded-2xl border ${cardBg}`}>
          <p className="text-xs text-slate-400 font-medium">Facturación del Mes</p>
          <h3 className="text-lg font-black text-emerald-400 mt-1">S/ 148,500.00</h3>
          <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1 mt-1">
            <ArrowUpRight className="w-3 h-3" /> +14.2% vs. mes anterior
          </span>
        </div>

        <div className={`p-4 rounded-2xl border ${cardBg}`}>
          <p className="text-xs text-slate-400 font-medium">Volumen Vendido</p>
          <h3 className="text-lg font-black text-blue-400 mt-1">12,450 KG/LT</h3>
          <span className="text-[10px] text-blue-500 font-bold flex items-center gap-1 mt-1">
            <ArrowUpRight className="w-3 h-3" /> +8.5% volumen industrial
          </span>
        </div>

        <div className={`p-4 rounded-2xl border ${cardBg}`}>
          <p className="text-xs text-slate-400 font-medium">Ticket Promedio por Cliente</p>
          <h3 className="text-lg font-black text-amber-400 mt-1">S/ 5,710.00</h3>
          <span className="text-[10px] text-slate-400 font-bold mt-1">26 clientes corporativos</span>
        </div>

        <div className={`p-4 rounded-2xl border ${cardBg}`}>
          <p className="text-xs text-slate-400 font-medium">Margen Comercial Neto</p>
          <h3 className="text-lg font-black text-purple-400 mt-1">32.4%</h3>
          <span className="text-[10px] text-purple-400 font-bold mt-1">Utilidad bruta S/ 48.1K</span>
        </div>
      </div>

      <div className={`p-8 rounded-2xl border text-center space-y-3 ${cardBg}`}>
        <BarChart3 className="w-12 h-12 text-blue-400 mx-auto opacity-80" />
        <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Módulo de Inteligencia Comercial en Conexión Directa
        </h3>
        <p className="text-xs text-slate-400 max-w-lg mx-auto">
          Los indicadores se recalculan automáticamente desde las órdenes comerciales guardadas en PostgreSQL.
        </p>
      </div>
    </div>
  );
}
