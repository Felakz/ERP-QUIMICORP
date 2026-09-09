'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Fingerprint,
  Clock,
  Calendar,
  Search,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';
import { apiFetch } from '@/lib/apiClient';

interface MarcacionBiometrica {
  id: string;
  dni: string;
  nombre: string;
  cargo: string;
  horaIngreso: string;
  turno: string;
  estado: 'PUNTUAL' | 'TARDANZA' | 'AUSENTE';
  huellaVerificada: boolean;
}

export default function BiometriaPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [searchQuery, setSearchQuery] = useState('');
  const [hoy, setHoy] = useState(() => new Date().toISOString().split('T')[0]);
  const [marcaciones, setMarcaciones] = useState<MarcacionBiometrica[]>([]);
  const [loading, setLoading] = useState(false);

  const cardBg = isDark ? 'bg-[#0F141C] border-[#1A2232]' : 'bg-white border-slate-200 shadow-sm';
  const textTitle = isDark ? 'text-slate-400' : 'text-slate-500';
  const textValue = isDark ? 'text-white' : 'text-slate-900';
  const inputBg = isDark ? 'bg-[#151D2A] border-[#1A2232] text-slate-200 placeholder-slate-500' : 'bg-slate-50 border-slate-300 text-slate-800 placeholder-slate-400';

  const cargar = async () => {
    setLoading(true);
    try {
      const { data, ok } = await apiFetch<any[]>(`/asistencia/hoy?fecha=${hoy}&area=planta`);
      if (ok && Array.isArray(data)) {
        setMarcaciones(
          data.map((a) => ({
            id: a.id,
            dni: a.dni,
            nombre: a.nombre,
            cargo: a.cargo,
            horaIngreso: a.horaIngreso || '--:--',
            turno: a.turno,
            estado: (a.estado === 'PUNTUAL' || a.estado === 'TARDANZA' ? a.estado : 'AUSENTE') as any,
            huellaVerificada: !!a.huellaVerificada,
          }))
        );
      }
    } catch {
      setMarcaciones([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, [hoy]);

  const filtered = marcaciones.filter(
    (m) =>
      m.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.dni.includes(searchQuery)
  );

  const presentes = marcaciones.filter((m) => m.estado !== 'AUSENTE').length;
  const puntuales = marcaciones.filter((m) => m.estado === 'PUNTUAL').length;
  const total = marcaciones.length;
  const porcPuntual = total > 0 ? Math.round((puntuales / total) * 1000) / 10 : 0;

  return (
    <div className="space-y-6 font-mono min-h-screen">
      {/* Subtitle Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className={`text-sm font-bold tracking-widest uppercase ${textTitle}`}>
            BIOMETRÍA & GESTIÓN DE TURNOS
          </h2>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Marcaciones por huella del personal de planta (operarios y supervisor).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-[#151D2A] p-1.5 rounded-xl border border-[#1A2232]">
            <Calendar className="h-4 w-4 text-cyan-400 ml-1" />
            <input
              type="date"
              value={hoy}
              onChange={(e) => setHoy(e.target.value)}
              className="bg-transparent text-xs font-mono font-bold text-slate-200 focus:outline-none pr-2"
            />
          </div>
          <button
            onClick={cargar}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg bg-[#00F2C3] px-4 py-2 text-xs font-bold text-[#090C10] hover:bg-[#00d8ad] transition-all shadow-md"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Actualizar</span>
          </button>
        </div>
      </div>

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Card 1: OPERARIOS PRESENTES */}
        <div className={`rounded-xl p-5 border flex items-center justify-between ${cardBg}`}>
          <div className="space-y-1">
            <span className={`text-[10px] font-bold tracking-widest uppercase ${textTitle}`}>
              PERSONAL PRESENTE
            </span>
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl font-black ${textValue}`}>{presentes} / {total}</span>
            </div>
            <p className="text-xs text-emerald-500 font-bold font-sans">
              {porcPuntual}% Asistencia puntual
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">
            <Fingerprint className="h-6 w-6" />
          </div>
        </div>

        {/* Card 2: TURNO ACTUAL */}
        <div className={`rounded-xl p-5 border flex items-center justify-between ${cardBg}`}>
          <div className="space-y-1">
            <span className={`text-[10px] font-bold tracking-widest uppercase ${textTitle}`}>
              TURNO ACTUAL
            </span>
            <h3 className={`text-base font-black ${textValue}`}>
              {marcaciones[0]?.turno || 'LUNES A VIERNES (08:00 - 17:00)'}
            </h3>
            <p className="text-xs text-slate-400 font-sans">
              Sábado: 08:00 - 13:00 (automático)
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <Clock className="h-6 w-6" />
          </div>
        </div>

        {/* Card 3: VENTANA ALMUERZO QA */}
        <div className={`rounded-xl p-5 border flex items-center justify-between ${cardBg}`}>
          <div className="space-y-1">
            <span className={`text-[10px] font-bold tracking-widest uppercase ${textTitle}`}>
              VENTANA ALMUERZO QA
            </span>
            <h3 className="text-base font-black text-amber-500">
              13:00 - 14:00
            </h3>
            <p className="text-xs text-slate-400 font-sans">
              Tope 13:00 • No aplica sábados
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <Calendar className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Live Attendance Punch Table */}
      <div className={`rounded-xl p-5 border space-y-4 ${cardBg}`}>
        <div className={`flex flex-wrap items-center justify-between gap-4 border-b pb-4 ${isDark ? 'border-[#1A2232]' : 'border-slate-200'}`}>
          <h3 className={`text-xs font-bold tracking-widest uppercase ${textTitle}`}>
            REGISTRO DE MARCACIONES BIOMÉTRICAS EN TIEMPO REAL
          </h3>

          <div className="relative w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar operario o DNI..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full rounded-lg border py-1.5 pl-9 pr-3 text-xs focus:border-[#00F2C3] focus:outline-none font-sans ${inputBg}`}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className={`border-b text-[10px] font-bold tracking-widest uppercase ${isDark ? 'border-[#1A2232] text-slate-400' : 'border-slate-200 text-slate-500'}`}>
                <th className="py-3 px-4">DNI</th>
                <th className="py-3 px-4">OPERARIO</th>
                <th className="py-3 px-4">CARGO</th>
                <th className="py-3 px-4">HORA INGRESO</th>
                <th className="py-3 px-4">TURNO</th>
                <th className="py-3 px-4">HUELLA</th>
                <th className="py-3 px-4">ESTADO</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-[#1A2232]/60 font-mono' : 'divide-slate-200 font-mono'}`}>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-6 px-4 text-center text-slate-400 font-sans">
                    {loading ? 'Cargando...' : 'Sin registros para la fecha seleccionada.'}
                  </td>
                </tr>
              )}
              {filtered.map((item) => (
                <tr key={item.id} className={`transition-colors ${isDark ? 'hover:bg-[#151D2A]/50' : 'hover:bg-slate-50'}`}>
                  <td className="py-3.5 px-4 font-bold text-cyan-500">{item.dni}</td>
                  <td className={`py-3.5 px-4 font-sans font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                    {item.nombre}
                  </td>
                  <td className="py-3.5 px-4 font-sans text-slate-400">{item.cargo}</td>
                  <td className={`py-3.5 px-4 font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{item.horaIngreso}</td>
                  <td className="py-3.5 px-4 text-slate-400">{item.turno}</td>
                  <td className="py-3.5 px-4">
                    {item.huellaVerificada ? (
                      <span className="inline-flex items-center gap-1 text-emerald-500 font-bold text-[11px]">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Verificada
                      </span>
                    ) : (
                      <span className="text-slate-400 font-bold text-[11px]">Manual</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    {item.estado === 'PUNTUAL' && (
                      <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-500 border border-emerald-500/20">
                        PUNTUAL
                      </span>
                    )}
                    {item.estado === 'TARDANZA' && (
                      <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-500 border border-amber-500/20">
                        TARDANZA
                      </span>
                    )}
                    {item.estado === 'AUSENTE' && (
                      <span className="rounded-full bg-rose-500/10 px-2.5 py-0.5 text-[10px] font-bold text-rose-500 border border-rose-500/20">
                        AUSENTE
                      </span>
                    )}
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