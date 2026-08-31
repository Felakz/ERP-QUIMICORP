'use client';

import React, { useCallback, useEffect, useState } from 'react';
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
} from 'lucide-react';
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

export default function AdministracionAsistenciaPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTurno, setSelectedTurno] = useState('TODOS');
  const [selectedSucursal, setSelectedSucursal] = useState('TODAS');
  const [empleados, setEmpleados] = useState<AsistenciaEmpleado[]>([]);
  const [cola, setCola] = useState<PendienteCola[]>([]);
  const [sucursales, setSucursales] = useState<string[]>(['—']);
  const [hoy, setHoy] = useState(() => new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cardBg = isDark ? 'bg-[#0F141C] border-[#1A2232]' : 'bg-white border-slate-200 shadow-sm';
  const textTitle = isDark ? 'text-slate-400' : 'text-slate-600';
  const textValue = isDark ? 'text-white' : 'text-slate-900';
  const inputBg = isDark
    ? 'bg-[#151D2A] border-[#1A2232] text-slate-200 placeholder-slate-500 focus:border-blue-500'
    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500';

  const cargar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [hoyRes, colaRes, sucRes] = await Promise.all([
        apiFetch<AsistenciaEmpleado[]>(`/asistencia/hoy?fecha=${hoy}`),
        apiFetch<PendienteCola[]>('/asistencia/cola'),
        apiFetch<any[]>('/asistencia/sucursales').catch(() => ({ data: [] as any[] })),
      ]);
      const lista = Array.isArray(hoyRes.data) ? hoyRes.data : [];
      setEmpleados(lista);
      setCola(Array.isArray(colaRes.data) ? colaRes.data : []);

      const suc = (Array.isArray(sucRes.data) ? sucRes.data : []).map((s: any) => s.nombre);
      setSucursales(suc.length ? suc : ['—']);
      if (hoyRes.error || colaRes.error) setError(hoyRes.error || colaRes.error);
      else setError(null);
    } catch (e: any) {
      setError(e.message || 'Error al cargar la asistencia');
    } finally {
      setLoading(false);
    }
  }, [hoy]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const vincular = async (codigo: string, empleadoId: string) => {
    setCargando(true);
    try {
      const { ok, error: err } = await apiFetch(`/asistencia/usuarios/${empleadoId}/vincular`, {
        method: 'POST',
        body: JSON.stringify({ codigoBiometrico: codigo }),
      });
      if (!ok) throw new Error(err || 'No se pudo vincular');
      await cargar();
    } catch (e: any) {
      alert(`Error al vincular: ${e.message}`);
    } finally {
      setCargando(false);
    }
  };

  const filtrados = empleados.filter((m) => {
    const matchQuery =
      m.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.dni.includes(searchQuery) ||
      m.cargo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchTurno =
      selectedTurno === 'TODOS' ||
      m.turno.toLowerCase().includes(selectedTurno.toLowerCase());
    const matchSucursal = selectedSucursal === 'TODAS' || m.sucursal === selectedSucursal;
    return matchQuery && matchTurno && matchSucursal;
  });

  const puntualCount = empleados.filter((m) => m.estado === 'PUNTUAL').length;
  const tardanzaCount = empleados.filter((m) => m.estado === 'TARDANZA').length;
  const ausenteCount = empleados.filter((m) => m.estado === 'FALTA' || m.estado === 'SIN_MARCAR').length;

  const badgeEstado = (estado: string) => {
    if (estado === 'PUNTUAL') return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
    if (estado === 'TARDANZA') return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
    if (estado === 'FALTA') return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
    return 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
  };

  const badgeAlmuerzo = (estadoAlmuerzo: string) => {
    if (estadoAlmuerzo === 'COMPLETO') return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
    if (estadoAlmuerzo === 'OBLIGADO_ALMORZAR') return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
    if (estadoAlmuerzo === 'EXCEDIDO') return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
    if (estadoAlmuerzo === 'EN_ALMUERZO') return 'bg-sky-500/10 text-sky-400 border border-sky-500/20';
    return 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
  };

  const turnosDesdeDatos = Array.from(new Set(empleados.map((m) => m.turno).filter((t) => t && t !== 'Sin turno asignado')));

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
                Marcaciones por huella dactilar en tiempo real, puntualidad, turnos y control de almuerzo (tope 14:00).
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-mono ${cardBg}`}>
              {error ? (
                <>
                  <WifiOff className="w-4 h-4 text-rose-400" />
                  <span className="text-rose-400">Sin conexión al backend</span>
                </>
              ) : (
                <>
                  <Wifi className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Conectado</span>
                </>
              )}
            </div>
            <button
              onClick={cargar}
              disabled={loading || cargando}
              className="px-3 py-2 rounded-xl border text-xs font-bold flex items-center gap-2 cursor-pointer disabled:opacity-50 transition-colors hover:opacity-80"
            >
              <RefreshCw className={`w-4 h-4 ${loading || cargando ? 'animate-spin' : ''}`} />
              Actualizar
            </button>
          </div>
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className={`p-4 rounded-xl border ${cardBg}`}>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Empleados</p>
          <p className={`text-2xl font-black mt-2 ${textValue}`}>{empleados.length}</p>
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
          <p className="text-[11px] font-bold text-rose-400 uppercase tracking-wider">Ausencias / Sin marcar</p>
          <p className="text-2xl font-black text-rose-400 mt-2">{ausenteCount}</p>
        </div>
      </div>

      {/* Cola de huellas por asignar */}
      {cola.length > 0 && (
        <div className={`p-4 rounded-2xl border ${cardBg}`}>
          <div className="flex items-center gap-2 mb-3">
            <Link2 className="w-4 h-4 text-amber-400" />
            <h2 className={`text-sm font-black ${textValue}`}>Huellas sin asignar ({cola.length})</h2>
            <p className={`text-[10px] ${textTitle}`}>Márcan fuera de la cola del huellero con un código aún no vinculado a un empleado.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {cola.map((p) => (
              <div key={p.codigoBiometrico} className={`rounded-xl border p-3 flex flex-col gap-2 ${cardBg}`}>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Código huella</span>
                  <span className={`font-mono text-sm font-black ${textValue}`}>{p.codigoBiometrico}</span>
                  <span className={`text-[10px] ${textTitle}`}>{p.cantidad} marca(s) • disp. {p.dispositivoId.slice(0, 8)}</span>
                </div>
                <div className="relative">
                  <select
                    disabled={cargando}
                    className={`w-full rounded-lg border p-2 text-xs font-mono ${inputBg}`}
                    defaultValue=""
                    onChange={(e) => e.target.value && vincular(p.codigoBiometrico, e.target.value)}
                    title="Selecciona el empleado para vincular esta huella"
                  >
                    <option value="" disabled>Vincular a empleado...</option>
                    {empleados.map((emp) => (
                      <option key={emp.id} value={emp.id}>{emp.nombre} ({emp.dni})</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className={`p-4 rounded-xl border flex flex-col lg:flex-row items-center justify-between gap-4 ${cardBg}`}>
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
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <input
              type="date"
              value={hoy}
              onChange={(e) => setHoy(e.target.value)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold ${inputBg}`}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedTurno}
              onChange={(e) => setSelectedTurno(e.target.value)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold font-mono ${inputBg}`}
            >
              <option value="TODOS">Todos los Turnos</option>
              {turnosDesdeDatos.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-slate-400" />
            <select
              value={selectedSucursal}
              onChange={(e) => setSelectedSucursal(e.target.value)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold font-mono ${inputBg}`}
            >
              <option value="TODAS">Todas las Sucursales</option>
              {sucursales.filter((s) => s !== '—').map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className={`rounded-2xl border overflow-hidden ${cardBg}`}>
        {loading ? (
          <div className="p-10 text-center text-sm text-slate-400">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-3 text-emerald-400" />
            Cargando asistencia del {hoy}...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className={`border-b text-[10px] font-bold uppercase tracking-wider ${isDark ? 'bg-[#151D2A] text-slate-400 border-[#1A2232]' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                <tr>
                  <th className="p-3">TRABAJADOR</th>
                  <th className="p-3">DNI</th>
                  <th className="p-3">CARGO / PUESTO</th>
                  <th className="p-3">SUCURSAL</th>
                  <th className="p-3">TURNO</th>
                  <th className="p-3">ENTRADA</th>
                  <th className="p-3">SALIDA</th>
                  <th className="p-3 text-center">ESTADO</th>
                  <th className="p-3 text-center">ALMUERZO</th>
                  <th className="p-3 text-center">VIRTUD HUELLA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {filtrados.length === 0 && (
                  <tr>
                    <td colSpan={10} className="p-8 text-center text-sm text-slate-500">
                      No hay empleados registrados para esta fecha. Cuando el huellero envíe marcas, aparecerán aquí en tiempo real.
                    </td>
                  </tr>
                )}
                {filtrados.map((m) => (
                  <tr key={m.id} className={`hover:bg-emerald-500/5 transition-colors ${isDark ? 'border-[#1A2232]' : 'border-slate-100'}`}>
                    <td className={`p-3 font-bold ${textValue}`}>{m.nombre}</td>
                    <td className="p-3 font-mono text-slate-400">{m.dni}</td>
                    <td className="p-3 text-slate-300">{m.cargo}</td>
                    <td className="p-3 font-mono text-xs text-cyan-400">{m.sucursal}</td>
                    <td className="p-3 font-mono text-xs text-blue-400">{m.turno}</td>
                    <td className={`p-3 font-mono font-bold ${m.minutosTardanza > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {m.horaIngreso}
                      {m.minutosTardanza > 0 && (
                        <span className="block text-[9px] text-amber-400">+{m.minutosTardanza} min</span>
                      )}
                    </td>
                    <td className="p-3 font-mono text-slate-400">{m.horaSalida || '--:--'}</td>
                    <td className="p-3 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono ${badgeEstado(m.estado)}`}>
                        {m.estado}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      {m.estadoAlmuerzo !== 'SIN_ALMUERZO' ? (
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold font-mono ${badgeAlmuerzo(m.estadoAlmuerzo)}`}>
                          {m.estadoAlmuerzo === 'OBLIGADO_ALMORZAR' ? 'OBLIGADO (14:00)' : m.estadoAlmuerzo}
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-500">--</span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      {m.huellaVerificada ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Huella
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Sin marca
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
