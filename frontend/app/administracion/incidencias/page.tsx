'use client';

import React from 'react';
import { AlertOctagon, ShieldAlert } from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';

export default function AdministracionIncidenciasPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const cardBg = isDark ? 'bg-[#0F141C] border-[#1A2232]' : 'bg-white border-slate-200 shadow-sm';

  return (
    <div className="space-y-6 font-sans">
      <div className={`p-6 rounded-2xl border flex items-center justify-between gap-4 ${cardBg}`}>
        <div>
          <h1 className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Incidencias de Producción & Calidad (QA)
          </h1>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Registro de mermas, desvisaciones en reactores y ajustes de lote.
          </p>
        </div>
      </div>

      <div className={`p-8 rounded-2xl border text-center space-y-3 ${cardBg}`}>
        <AlertOctagon className="w-12 h-12 text-rose-400 mx-auto opacity-80" />
        <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Registro de Observaciones de Calidad
        </h3>
        <p className="text-xs text-slate-400 max-w-lg mx-auto">
          Permite reportar anomalías durante el proceso de producción o mermas excepcionales de insumos.
        </p>
      </div>
    </div>
  );
}
