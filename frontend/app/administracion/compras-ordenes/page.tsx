'use client';

import React from 'react';
import { Receipt, Plus } from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';

export default function AdministracionComprasOrdenesPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const cardBg = isDark ? 'bg-[#0F141C] border-[#1A2232]' : 'bg-white border-slate-200 shadow-sm';

  return (
    <div className="space-y-6 font-sans">
      <div className={`p-6 rounded-2xl border flex items-center justify-between gap-4 ${cardBg}`}>
        <div>
          <h1 className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Órdenes de Compra de Materia Prima e Insumos
          </h1>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Gestión de abastecimiento para reactores de Planta.
          </p>
        </div>
        <button className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-md">
          <Plus className="w-4 h-4" />
          <span>+ Generar Nueva Orden de Compra</span>
        </button>
      </div>

      <div className={`p-8 rounded-2xl border text-center space-y-3 ${cardBg}`}>
        <Receipt className="w-12 h-12 text-emerald-400 mx-auto opacity-80" />
        <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Módulo de Órdenes de Compra Integrado con Kardex
        </h3>
        <p className="text-xs text-slate-400 max-w-lg mx-auto">
          Las órdenes de compra aprobadas ingresan automáticamente los lotes de insumos al Kardex de Almacén.
        </p>
      </div>
    </div>
  );
}
