'use client';

import React from 'react';
import { Scale, BarChart2 } from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';

export default function AdministracionComparadorPreciosPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const cardBg = isDark ? 'bg-[#0F141C] border-[#1A2232]' : 'bg-white border-slate-200 shadow-sm';

  return (
    <div className="space-y-6 font-sans">
      <div className={`p-6 rounded-2xl border flex items-center justify-between gap-4 ${cardBg}`}>
        <div>
          <h1 className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Comparador & Auditoría de Precios de Insumos (Gerencia)
          </h1>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Análisis histórico de cotizaciones de proveedores para optimización de costos.
          </p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
          🔒 Exclusivo Gerencia
        </span>
      </div>

      <div className={`p-8 rounded-2xl border text-center space-y-3 ${cardBg}`}>
        <Scale className="w-12 h-12 text-amber-400 mx-auto opacity-80" />
        <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Auditoría de Cotizaciones de Materia Prima
        </h3>
        <p className="text-xs text-slate-400 max-w-lg mx-auto">
          Compara variaciones porcentuales de proveedores clave como Química Suiza e Inversiones Químicas del Perú.
        </p>
      </div>
    </div>
  );
}
