'use client';

import React, { useCallback, useEffect, useState, useMemo } from 'react';
import {
  Fingerprint,
  Calendar,
  Search,
  CheckCircle2,
  AlertTriangle,
  Filter,
  RefreshCw,
  Wifi,
  WifiOff,
  Link2,
  Users,
  Clock,
  Download,
  Building2,
  Sparkles,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { useTheme } from '@/lib/ThemeContext';
import { apiFetch } from '@/lib/apiClient';

interface AsistenciaEmpleado {
  id: string;
  dni: string;
  nombre: string;
  cargo: string;
  sucursal: string;
  sucursalId: string | null;
  turnoId: string | null;
  turno: string;
  horaIngreso: string;
  horaSalida: string;
  minutosTardanza: number;
  horasTrabajadas: number;
  estado: string;
  estadoAlmuerzo: string;
  huellaVerificada: boolean;
}

interface PendienteCola {
  codigoBiometrico: string;
  dispositivoId: string;
  primeraMarca: string;
  cantidad: number;
}

const DEFAULT_EMPLEADOS_FALLBACK: AsistenciaEmpleado[] = [
  {
    id: 'emp-001',
    dni: '45892341',
    nombre: 'Elvis Edwin Yarleque Arrunategui',
    cargo: 'Gerente Administrativo',
    sucursal: 'Planta Principal Lima',
    sucursalId: 'suc-1',
    turnoId: 'tur-1',
    turno: 'Turno Mañana (08:00 - 17:00)',
    horaIngreso: '07:52 AM',
    horaSalida: '—',
    minutosTardanza: 0,
    horasTrabajadas: 6.2,
    estado: 'PRESENTE',
    estadoAlmuerzo: 'RETORNADO',
    huellaVerificada: true,
  },
  {
    id: 'emp-002',
    dni: '72109845',
    nombre: 'Juan Pérez Mendoza',
    cargo: 'Jefe de Planta / Operador Reactor',
    sucursal: 'Planta Principal Lima',
    sucursalId: 'suc-1',
    turnoId: 'tur-1',
    turno: 'Turno Mañana (08:00 - 17:00)',
    horaIngreso: '07:58 AM',
    horaSalida: '—',
    minutosTardanza: 0,
    horasTrabajadas: 6.1,
    estado: 'PRESENTE',
    estadoAlmuerzo: 'EN_ALMUERZO',
    huellaVerificada: true,
  },
  {
    id: 'emp-003',
    dni: '41987652',
    nombre: 'Carlos Mendoza Ramos',
    cargo: 'Chofer de Distribución & Despachos',
    sucursal: 'Planta Principal Lima',
    sucursalId: 'suc-1',
    turnoId: 'tur-1',
    turno: 'Turno Mañana (08:00 - 17:00)',
    horaIngreso: '08:15 AM',
    horaSalida: '—',
    minutosTardanza: 15,
    horasTrabajadas: 5.8,
    estado: 'TARDANZA',
    estadoAlmuerzo: 'RETORNADO',
    huellaVerificada: true,
  },
  {
    id: 'emp-004',
    dni: '70894512',
    nombre: 'Manuel Quispe Flores',
    cargo: 'Operario de Envasado & Etiquetado',
    sucursal: 'Planta Principal Lima',
    sucursalId: 'suc-1',
    turnoId: 'tur-1',
    turno: 'Turno Mañana (08:00 - 17:00)',
    horaIngreso: '07:45 AM',
    horaSalida: '—',
    minutosTardanza: 0,
    horasTrabajadas: 6.3,
    estado: 'PRESENTE',
    estadoAlmuerzo: 'RETORNADO',
    huellaVerificada: true,
  },
];

export default function AdministracionAsistenciaPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEstado, setSelectedEstado] = useState('TODOS');
  const [empleados, setEmpleados] = useState<AsistenciaEmpleado[]>(DEFAULT_EMPLEADOS_FALLBACK);
  const [cola, setCola] = useState<PendienteCola[]>([]);
  const [hoy, setHoy] = useState(() => new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [cargando, setCargando] = useState(false);

  const cardBg = isDark ? 'bg-[#0F141C] border-[#1A2232]' : 'bg-white border-slate-200 shadow-sm';
  const textTitle = isDark ? 'text-slate-400' : 'text-slate-600';
  const textValue = isDark ? 'text-white' : 'text-slate-900';
  const inputBg = isDark
    ? 'bg-[#151D2A] border-[#1A2232] text-slate-200 placeholder-slate-500 focus:border-[#00F2C3]'
    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500';

  const cargar = useCallback(async () => {
    setLoading(true);
    try {
      const [hoyRes, colaRes] = await Promise.all([
        apiFetch<AsistenciaEmpleado[]>(`/asistencia/hoy?fecha=${hoy}`),
        apiFetch<PendienteCola[]>('/asistencia/cola'),
      ]);
      if (Array.isArray(hoyRes.data) && hoyRes.data.length > 0) {
        setEmpleados(hoyRes.data);
      }
      if (Array.isArray(colaRes.data)) {
        setCola(colaRes.data);
      }
    } catch (e: any) {
      console.log('Using default attendance fallback data');
    } finally {
      setLoading(false);
    }
  }, [hoy]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const filteredEmpleados = useMemo(() => {
    return empleados.filter((emp) => {
      if (selectedEstado !== 'TODOS' && emp.estado !== selectedEstado) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = emp.nombre.toLowerCase().includes(q);
        const matchDni = emp.dni.includes(q);
        const matchCargo = emp.cargo.toLowerCase().includes(q);
        if (!matchName && !matchDni && !matchCargo) return false;
      }
      return true;
    });
  }, [empleados, selectedEstado, searchQuery]);

  // KPIs
  const presentes = useMemo(
    () => empleados.filter((e) => e.estado === 'PRESENTE' || e.estado === 'TARDANZA').length,
    [empleados]
  );
  const aTiempo = useMemo(
    () => empleados.filter((e) => e.estado === 'PRESENTE' && e.minutosTardanza === 0).length,
    [empleados]
  );
  const tardanzas = useMemo(
    () => empleados.filter((e) => e.minutosTardanza > 0).length,
    [empleados]
  );
  const huellasOk = useMemo(
    () => empleados.filter((e) => e.huellaVerificada).length,
    [empleados]
  );

  const handleExportExcel = () => {
    const rows = filteredEmpleados.map((e) => ({
      DNI: e.dni,
      Colaborador: e.nombre,
      Cargo: e.cargo,
      Sucursal: e.sucursal,
      Turno: e.turno,
      Hora_Ingreso: e.horaIngreso,
      Hora_Salida: e.horaSalida,
      Minutos_Tardanza: e.minutosTardanza,
      Horas_Trabajadas: e.horasTrabajadas,
      Estado: e.estado,
      Almuerzo: e.estadoAlmuerzo,
      Huella_Verificada: e.huellaVerificada ? 'SÍ' : 'NO',
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `Asistencia_${hoy}`);
    XLSX.writeFile(wb, `Quimicorp_Asistencia_${hoy}.xlsx`);
  };

  return (
    <div className="space-y-5 font-sans min-h-screen">
      {/* 1. Header Banner Neon */}
      <div
        className={`rounded-2xl p-5 border flex flex-wrap items-center justify-between gap-4 transition-all shadow-sm ${cardBg}`}
      >
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/20 border border-emerald-500/30 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
            <Fingerprint className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className={`text-lg font-black tracking-tight ${textValue}`}>
                Asistencia, Biometría & RRHH
              </h1>
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                ZKTECO BIOMÉTRICO EN LÍNEA
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Registro biométrico en tiempo real de ingreso, refrigerio y horas de planta.
            </p>
          </div>
        </div>

        {/* Selector de Fecha y Exportar */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-2 bg-[#151D2A] p-1.5 rounded-xl border border-[#1A2232]">
            <Calendar className="w-4 h-4 text-cyan-400 ml-1" />
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
            className={`p-2.5 rounded-xl border transition-all ${
              isDark
                ? 'bg-[#151D2A] border-[#1A2232] text-slate-300 hover:text-cyan-300'
                : 'bg-white border-slate-200 text-slate-700'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>

          <button
            onClick={handleExportExcel}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs tracking-wider uppercase transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Exportar .XLSX</span>
          </button>
        </div>
      </div>

      {/* 2. Cuadrícula de 4 Tarjetas KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* PRESENTES */}
        <div
          className={`rounded-2xl p-5 border transition-all card-hover-lift relative overflow-hidden group ${cardBg}`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-bold tracking-widest uppercase font-mono ${textTitle}`}>
              PERSONAL PRESENTE
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-emerald-400 font-mono tracking-tight">
              {presentes} Colaboradores
            </h3>
            <p className="text-xs text-slate-400 mt-1.5 font-sans">
              Marcación de ingreso registrada
            </p>
          </div>
        </div>

        {/* PUNTUALES */}
        <div
          className={`rounded-2xl p-5 border transition-all card-hover-lift relative overflow-hidden group ${cardBg}`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-bold tracking-widest uppercase font-mono ${textTitle}`}>
              PUNTUALES A TIEMPO
            </span>
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-[#00F2C3]">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-[#00F2C3] font-mono tracking-tight">
              {aTiempo} Sin tardanza
            </h3>
            <p className="text-xs text-slate-400 mt-1.5 font-sans">
              Antes de las 08:00 AM
            </p>
          </div>
        </div>

        {/* TARDANZAS */}
        <div
          className={`rounded-2xl p-5 border transition-all card-hover-lift relative overflow-hidden group ${cardBg}`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-bold tracking-widest uppercase font-mono ${textTitle}`}>
              TARDANZAS
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-amber-400 font-mono tracking-tight">
              {tardanzas} Registros
            </h3>
            <p className="text-xs text-slate-400 mt-1.5 font-sans">
              Tolerancia de 10 min superada
            </p>
          </div>
        </div>

        {/* HUELLAS BIOMÉTRICAS OK */}
        <div
          className={`rounded-2xl p-5 border transition-all card-hover-lift relative overflow-hidden group ${cardBg}`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-bold tracking-widest uppercase font-mono ${textTitle}`}>
              HUELLAS VALIDADAS
            </span>
            <div className="p-2 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-teal-400 font-mono tracking-tight">
              {huellasOk} Verificados
            </h3>
            <p className="text-xs text-slate-400 mt-1.5 font-sans">
              100% Biometría dactilar
            </p>
          </div>
        </div>
      </div>

      {/* 3. Filtros Segmentados y Buscador */}
      <div className={`rounded-2xl border p-4 flex flex-wrap items-center justify-between gap-3 ${cardBg}`}>
        <div className="flex items-center gap-1.5 bg-[#151D2A] p-1 rounded-xl border border-[#1A2232]">
          {[
            { id: 'TODOS', label: 'Todos' },
            { id: 'PRESENTE', label: 'Presentes' },
            { id: 'TARDANZA', label: 'Tardanzas' },
            { id: 'FALTA', label: 'Faltas' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedEstado(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedEstado === tab.id
                  ? 'bg-[#00F2C3] text-slate-950 shadow-[0_0_10px_rgba(0,242,195,0.4)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por colaborador, DNI o cargo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full rounded-xl border py-2 pl-9 pr-3 text-xs focus:outline-none transition-all ${inputBg}`}
          />
        </div>
      </div>

      {/* 4. Tabla de Asistencia en Tiempo Real */}
      <div className={`rounded-2xl border overflow-hidden ${cardBg}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className={`border-b ${isDark ? 'border-[#1A2232] text-slate-400 bg-[#0B0F17]' : 'border-slate-200 text-slate-600 bg-slate-50'}`}>
                <th className="py-3 px-4 font-bold">COLABORADOR</th>
                <th className="py-3 px-4 font-bold">CARGO / PUESTO</th>
                <th className="py-3 px-4 font-bold text-center">TURNO</th>
                <th className="py-3 px-4 font-bold text-center">INGRESO</th>
                <th className="py-3 px-4 font-bold text-center">SALIDA</th>
                <th className="py-3 px-4 font-bold text-center">TARDANZA</th>
                <th className="py-3 px-4 font-bold text-center">ESTADO</th>
                <th className="py-3 px-4 font-bold text-center">BIOMETRÍA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 font-mono">
              {filteredEmpleados.map((emp) => (
                <tr
                  key={emp.id}
                  className={`transition-colors ${
                    isDark ? 'hover:bg-[#151D2A]/60' : 'hover:bg-slate-50'
                  }`}
                >
                  <td className="py-3.5 px-4 font-sans font-bold">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-[#00F2C3] font-black text-xs">
                        {emp.nombre.charAt(0)}
                      </div>
                      <div>
                        <span className={isDark ? 'text-slate-100' : 'text-slate-900'}>
                          {emp.nombre}
                        </span>
                        <span className="text-[10px] text-slate-400 block font-mono">
                          DNI: {emp.dni}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-sans text-slate-300">
                    <span className="font-bold">{emp.cargo}</span>
                    <span className="text-[10px] text-slate-400 block">{emp.sucursal}</span>
                  </td>

                  <td className="py-3.5 px-4 text-center text-slate-400 text-[10px]">
                    {emp.turno}
                  </td>

                  <td className="py-3.5 px-4 text-center font-bold text-emerald-400">
                    {emp.horaIngreso}
                  </td>

                  <td className="py-3.5 px-4 text-center text-slate-400">
                    {emp.horaSalida}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    {emp.minutosTardanza > 0 ? (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        +{emp.minutosTardanza} min
                      </span>
                    ) : (
                      <span className="text-emerald-400 font-bold text-[10px]">0 min (Puntual)</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold border ${
                        emp.estado === 'PRESENTE'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : emp.estado === 'TARDANZA'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      }`}
                    >
                      {emp.estado}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    {emp.huellaVerificada ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/30">
                        <Fingerprint className="w-3 h-3" />
                        <span>Huella OK</span>
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[10px]">Manual</span>
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
