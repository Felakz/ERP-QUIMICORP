'use client';

import React from 'react';
import { Truck, CheckCircle2 } from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';

export default function AdministracionDespachosPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const cardBg = isDark ? 'bg-[#0F141C] border-[#1A2232]' : 'bg-white border-slate-200 shadow-sm';

  return (
    <div className="space-y-6 font-sans">
      <div className={`p-6 rounded-2xl border flex items-center justify-between gap-4 ${cardBg}`}>
        <div>
          <h1 className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Control de Lotes, Envasado & Despachos de Planta
          </h1>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Liberación de lotes terminados y programación de despachos a clientes.
          </p>
        </div>
      </div>

      <div className={`p-8 rounded-2xl border text-center space-y-3 ${cardBg}`}>
        <Truck className="w-12 h-12 text-blue-400 mx-auto opacity-80" />
        <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Guías de Remisión y Despacho Físico
        </h3>
        <p className="text-xs text-slate-400 max-w-lg mx-auto">
          Monitoreo de lotes envasados listos para envío con sus respectivas Guías de Remisión SUNAT.
        </p>
      </div>
    </div>
  );
}
