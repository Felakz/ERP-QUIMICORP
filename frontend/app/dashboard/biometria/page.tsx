'use client';

import React, { useState } from 'react';
import {
  Fingerprint,
  Clock,
  Calendar,
  UserCheck,
  UserX,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';

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
  const [marcaciones, setMarcaciones] = useState<MarcacionBiometrica[]>([
    {
      id: '1',
      dni: '45892011',
      nombre: 'Carlos Quispe',
      cargo: 'Operario de Planta',
      horaIngreso: '06:54 AM',
      turno: 'Mañana (07:00 - 15:30)',
      estado: 'PUNTUAL',
      huellaVerificada: true,
    },
    {
      id: '2',
      dni: '71204938',
      nombre: 'Ana Flores',
      cargo: 'Técnico de Mezclas',
      horaIngreso: '06:58 AM',
      turno: 'Mañana (07:00 - 15:30)',
      estado: 'PUNTUAL',
      huellaVerificada: true,
    },
    {
      id: '3',
      dni: '10928374',
      nombre: 'Luis Mamani',
      cargo: 'Supervisor QA',
      horaIngreso: '07:12 AM',
      turno: 'Mañana (07:00 - 15:30)',
      estado: 'TARDANZA',
      huellaVerificada: true,
    },
    {
      id: '4',
      dni: '48201934',
      nombre: 'Rosa Condori',
      cargo: 'Operario Envasado',
      horaIngreso: '06:45 AM',
      turno: 'Mañana (07:00 - 15:30)',
      estado: 'PUNTUAL',
      huellaVerificada: true,
    },
    {
      id: '5',
      dni: '75019283',
      nombre: 'Jorge Mendoza',
      cargo: 'Asistente Almacén',
      horaIngreso: '—',
      turno: 'Tarde (15:30 - 23:00)',
      estado: 'AUSENTE',
      huellaVerificada: false,
    },
  ]);

  const cardBg = isDark ? 'bg-[#0F141C] border-[#1A2232]' : 'bg-white border-slate-200 shadow-sm';
  const textTitle = isDark ? 'text-slate-400' : 'text-slate-500';
  const textValue = isDark ? 'text-white' : 'text-slate-900';
  const inputBg = isDark ? 'bg-[#151D2A] border-[#1A2232] text-slate-200 placeholder-slate-500' : 'bg-slate-50 border-slate-300 text-slate-800 placeholder-slate-400';

  const handleSimularMarcacion = () => {
    const nombre = prompt('Ingrese Nombre del Operario para marcar huella:', 'Roberto Gómez');
    if (!nombre) return;
    const nueva: MarcacionBiometrica = {
      id: String(Date.now()),
      dni: String(Math.floor(10000000 + Math.random() * 90000000)),
      nombre,
      cargo: 'Operario Planta B',
      horaIngreso: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      turno: 'Mañana (07:00 - 15:30)',
      estado: 'PUNTUAL',
      huellaVerificada: true,
    };
    setMarcaciones((prev) => [nueva, ...prev]);
    alert(`Huella verificada correctamente para ${nombre}. Marcación registrada.`);
  };

  const filtered = marcaciones.filter(
    (m) =>
      m.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.dni.includes(searchQuery)
  );

  return (
    <div className="space-y-6 font-mono min-h-screen">
      {/* Subtitle Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className={`text-sm font-bold tracking-widest uppercase ${textTitle}`}>
            BIOMETRÍA & GESTIÓN DE TURNOS
          </h2>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Gestión de marcaciones por huella/DNI, cálculo de horas trabajadas y ventanas QA.
          </p>
        </div>

        <button
          onClick={handleSimularMarcacion}
          className="flex items-center gap-2 rounded-lg bg-[#00F2C3] px-4 py-2 text-xs font-bold text-[#090C10] hover:bg-[#00d8ad] transition-all shadow-md"
        >
          <Fingerprint className="h-4 w-4" />
          <span>Simular Marcación Huella</span>
        </button>
      </div>

      {/* Top 3 Metric Cards (Matching Screenshot) */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Card 1: OPERARIOS PRESENTES */}
        <div className={`rounded-xl p-5 border flex items-center justify-between ${cardBg}`}>
          <div className="space-y-1">
            <span className={`text-[10px] font-bold tracking-widest uppercase ${textTitle}`}>
              OPERARIOS PRESENTES
            </span>
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl font-black ${textValue}`}>28 / 30</span>
            </div>
            <p className="text-xs text-emerald-500 font-bold font-sans">
              93.3% Asistencia puntual
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
              Mañana (07:00 - 15:30)
            </h3>
            <p className="text-xs text-slate-400 font-sans">
              Planta de Mezclas A & B
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
              Habilitada por QA Supervisor
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
                      <span className="inline-flex items-center gap-1 text-slate-400 font-bold text-[11px]">
                        —
                      </span>
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
