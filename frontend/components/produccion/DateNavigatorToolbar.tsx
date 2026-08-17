'use client';

import React from 'react';
import { Calendar, ChevronLeft, ChevronRight, Sparkles, Clock } from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';

interface DateNavigatorToolbarProps {
  fecha: string; // YYYY-MM-DD
  onFechaChange: (nuevaFecha: string) => void;
  titulo?: string;
  subtitulo?: string;
  extraActions?: React.ReactNode;
  disabled?: boolean;
}

export function DateNavigatorToolbar({
  fecha,
  onFechaChange,
  titulo = 'TURNO DE PLANTA',
  subtitulo,
  extraActions,
  disabled = false,
}: DateNavigatorToolbarProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const hoyISO = new Date().toISOString().split('T')[0];
  const esHoy = fecha === hoyISO;

  // Formatear fecha a texto en español amigable
  const formatearFechaEspanol = (isoStr: string) => {
    try {
      const [year, month, day] = isoStr.split('-').map(Number);
      const dateObj = new Date(year, month - 1, day);
      if (isNaN(dateObj.getTime())) return isoStr;

      const weekday = dateObj.toLocaleDateString('es-PE', { weekday: 'long' });
      const dayNum = dateObj.getDate();
      const monthName = dateObj.toLocaleDateString('es-PE', { month: 'long' });
      const yearNum = dateObj.getFullYear();

      const capitalizedWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1);
      const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);

      return `${capitalizedWeekday}, ${dayNum} de ${capitalizedMonth} de ${yearNum}`;
    } catch {
      return isoStr;
    }
  };

  // Navegación rápida +- 1 día
  const handleCambiarDia = (deltaDias: number) => {
    try {
      const [year, month, day] = fecha.split('-').map(Number);
      const d = new Date(year, month - 1, day);
      d.setDate(d.getDate() + deltaDias);

      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      onFechaChange(`${yyyy}-${mm}-${dd}`);
    } catch {}
  };

  const handleIrAHoy = () => {
    onFechaChange(hoyISO);
  };

  const cardBg = isDark ? 'bg-[#0F141C] border-[#1A2232]' : 'bg-white border-slate-200 shadow-sm';
  const inputBg = isDark
    ? 'bg-[#151D2A] border-[#1A2232] text-slate-200 focus:border-[#00F2C3]'
    : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-teal-600';

  return (
    <div className={`p-3.5 rounded-2xl border transition-all ${cardBg}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Lado Izquierdo: Título y Fecha Legible */}
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl border ${
            isDark ? 'bg-cyan-500/10 border-cyan-500/30 text-[#00F2C3]' : 'bg-teal-50 border-teal-200 text-teal-700'
          }`}>
            <Calendar className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-slate-400">
                {titulo}
              </span>
              {esHoy ? (
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  HOY (TURNO EN CURSO)
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase font-mono bg-purple-500/15 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  HISTORIAL DEL DÍA
                </span>
              )}
            </div>
            <h3 className={`text-sm font-bold font-sans ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
              {formatearFechaEspanol(fecha)}
            </h3>
            {subtitulo && <p className="text-[11px] text-slate-400 font-sans">{subtitulo}</p>}
          </div>
        </div>

        {/* Lado Derecho: Controles de Navegación por Día */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Botón Día Anterior */}
          <button
            type="button"
            disabled={disabled}
            onClick={() => handleCambiarDia(-1)}
            className={`p-2 rounded-xl border font-sans text-xs font-bold transition-all flex items-center gap-1 ${
              isDark
                ? 'bg-[#151D2A] border-[#1A2232] text-slate-300 hover:bg-[#1A2536] hover:text-white'
                : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
            }`}
            title="Ver día anterior"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Día Anterior</span>
          </button>

          {/* DatePicker Nativo Estilizado */}
          <div className="relative">
            <input
              type="date"
              disabled={disabled}
              value={fecha}
              onChange={(e) => {
                if (e.target.value) onFechaChange(e.target.value);
              }}
              className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold cursor-pointer transition-all ${inputBg}`}
            />
          </div>

          {/* Botón de Salto Rápido a HOY */}
          {!esHoy && (
            <button
              type="button"
              disabled={disabled}
              onClick={handleIrAHoy}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold font-sans transition-all flex items-center gap-1.5 shadow-sm ${
                isDark
                  ? 'bg-gradient-to-r from-[#00F2C3] to-teal-500 text-slate-950 hover:opacity-90 shadow-cyan-500/20'
                  : 'bg-teal-600 text-white hover:bg-teal-700 shadow-teal-600/20'
              }`}
              title="Volver a la fecha actual"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ir a Hoy</span>
            </button>
          )}

          {/* Botón Día Siguiente */}
          <button
            type="button"
            disabled={disabled}
            onClick={() => handleCambiarDia(1)}
            className={`p-2 rounded-xl border font-sans text-xs font-bold transition-all flex items-center gap-1 ${
              isDark
                ? 'bg-[#151D2A] border-[#1A2232] text-slate-300 hover:bg-[#1A2536] hover:text-white'
                : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
            }`}
            title="Ver día siguiente"
          >
            <span className="hidden sm:inline">Día Siguiente</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          {extraActions}
        </div>
      </div>
    </div>
  );
}
