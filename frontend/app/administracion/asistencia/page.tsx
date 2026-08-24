'use client';

import React, { useState } from 'react';
import {
  Fingerprint,
  Clock,
  Calendar,
  UserCheck,
  UserX,
  Search,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Filter,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';

interface MarcacionBiometrica {
  id: string;
  dni: string;
  nombre: string;
  cargo: string;
  horaIngreso: string;
  horaSalida?: string;
  turno: string;
  estado: 'PUNTUAL' | 'TARDANZA' | 'AUSENTE';
  huellaVerificada: boolean;
}

export default function AdministracionAsistenciaPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTurno, setSelectedTurno] = useState('TODOS');

  const cardBg = isDark ? 'bg-[#0F141C] border-[#1A2232]' : 'bg-white border-slate-200 shadow-sm';
  const textTitle = isDark ? 'text-slate-400' : 'text-slate-600';
  const textValue = isDark ? 'text-white' : 'text-slate-900';
  const inputBg = isDark
    ? 'bg-[#151D2A] border-[#1A2232] text-slate-200 placeholder-slate-500 focus:border-blue-500'
    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500';

  const [marcaciones] = useState<MarcacionBiometrica[]>([
    {
      id: '1',
      dni: '45892011',
      nombre: 'Carlos Quispe Arrunategui',
      cargo: 'Operario de Mezclas',
      horaIngreso: '06:54 AM',
      horaSalida: '03:30 PM',
      turno: 'Mañana (07:00 - 15:30)',
      estado: 'PUNTUAL',
      huellaVerificada: true,
    },
    {
      id: '2',
      dni: '71204938',
      nombre: 'Ana Flores Mendoza',
      cargo: 'Técnico de Calidad QA',
      horaIngreso: '06:58 AM',
      horaSalida: '03:30 PM',
      turno: 'Mañana (07:00 - 15:30)',
      estado: 'PUNTUAL',
      huellaVerificada: true,
    },
    {
      id: '3',
      dni: '10928374',
      nombre: 'Luis Mamani Salazar',
      cargo: 'Supervisor de Planta',
      horaIngreso: '07:12 AM',
      horaSalida: '03:35 PM',
      turno: 'Mañana (07:00 - 15:30)',
      estado: 'TARDANZA',
      huellaVerificada: true,
    },
    {
      id: '4',
      dni: '48291029',
      nombre: 'Jorge Benítez Silva',
      cargo: 'Operario de Envasado',
      horaIngreso: '14:50 PM',
      turno: 'Tarde (15:00 - 23:30)',
      estado: 'PUNTUAL',
      huellaVerificada: true,
    },
  ]);

  const filtrados = marcaciones.filter((m) => {
    const matchQuery =
      m.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.dni.includes(searchQuery) ||
      m.cargo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchTurno = selectedTurno === 'TODOS' || m.turno.toLowerCase().includes(selectedTurno.toLowerCase());
    return matchQuery && matchTurno;
  });

  const puntualCount = marcaciones.filter((m) => m.estado === 'PUNTUAL').length;
  const tardanzaCount = marcaciones.filter((m) => m.estado === 'TARDANZA').length;
  const ausenteCount = marcaciones.filter((m) => m.estado === 'AUSENTE').length;

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className={`p-6 rounded-2xl border transition-all ${cardBg}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-400">
              <Fingerprint className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className={`text-xl font-black tracking-tight ${textValue}`}>
                  Control de Asistencia & Biometría
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase font-mono">
                  Registro Inmutable
                </span>
              </div>
              <p className={`text-xs mt-1 ${textTitle}`}>
                Marcaciones por huella dactilar, puntualidad, turnos rotativos y control de tiempo de personal.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className={`p-4 rounded-xl border ${cardBg}`}>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Marcaciones Hoy</p>
          <p className={`text-2xl font-black mt-2 ${textValue}`}>{marcaciones.length}</p>
        </div>
        <div className={`p-4 rounded-xl border ${cardBg}`}>
          <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Puntuales</p>
          <p className="text-2xl font-black text-emerald-400 mt-2">{puntualCount}</p>
        </div>
        <div className={`p-4 rounded-xl border ${cardBg}`}>
          <p className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">Tardanzas</p>
          <p className="text-2xl font-black text-amber-400 mt-2">{tardanzaCount}</p>
        </div>
        <div className={`p-4 rounded-xl border ${cardBg}`}>
          <p className="text-[11px] font-bold text-rose-400 uppercase tracking-wider">Ausencias</p>
          <p className="text-2xl font-black text-rose-400 mt-2">{ausenteCount}</p>
        </div>
      </div>

      {/* Filtros */}
      <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${cardBg}`}>
        <div className="relative flex-1 w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por Nombre, DNI o Cargo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-9 pr-3 py-1.5 rounded-xl border text-xs font-medium ${inputBg}`}
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedTurno}
            onChange={(e) => setSelectedTurno(e.target.value)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold font-mono ${inputBg}`}
          >
            <option value="TODOS">Todos los Turnos</option>
            <option value="Mañana">Turno Mañana</option>
            <option value="Tarde">Turno Tarde</option>
          </select>
        </div>
      </div>

      {/* Tabla */}
      <div className={`rounded-2xl border overflow-hidden ${cardBg}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className={`border-b text-[10px] font-bold uppercase tracking-wider ${isDark ? 'bg-[#151D2A] text-slate-400 border-[#1A2232]' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
              <tr>
                <th className="p-3">TRABAJADOR</th>
                <th className="p-3">DNI</th>
                <th className="p-3">CARGO / PUESTO</th>
                <th className="p-3">TURNO</th>
                <th className="p-3">HORA INGRESO</th>
                <th className="p-3">HORA SALIDA</th>
                <th className="p-3 text-center">ESTADO PUNTUALIDAD</th>
                <th className="p-3 text-center">VALIDACIÓN HUELLA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {filtrados.map((m) => (
                <tr key={m.id} className={`hover:bg-emerald-500/5 transition-colors ${isDark ? 'border-[#1A2232]' : 'border-slate-100'}`}>
                  <td className={`p-3 font-bold ${textValue}`}>{m.nombre}</td>
                  <td className="p-3 font-mono text-slate-400">{m.dni}</td>
                  <td className="p-3 text-slate-300">{m.cargo}</td>
                  <td className="p-3 font-mono text-xs text-blue-400">{m.turno}</td>
                  <td className="p-3 font-mono font-bold text-emerald-400">{m.horaIngreso}</td>
                  <td className="p-3 font-mono text-slate-400">{m.horaSalida || '--:--'}</td>
                  <td className="p-3 text-center">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                      m.estado === 'PUNTUAL'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : m.estado === 'TARDANZA'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {m.estado}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    {m.huellaVerificada ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Verificado
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Manual
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
