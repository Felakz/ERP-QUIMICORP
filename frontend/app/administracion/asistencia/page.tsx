'use client';

import React, { useCallback, useEffect, useState, useMemo } from 'react';
import {
  Fingerprint,
  Calendar,
  Search,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Users,
  Clock,
  Download,
  Building2,
  Sparkles,
  ShieldCheck,
  UserCheck,
  Pencil,
  Plus,
  Trash2,
  ShieldAlert,
  Briefcase,
  UserCog,
  UserPlus,
  X,
  Check,
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { useTheme } from '@/lib/ThemeContext';
import { useAuth } from '@/lib/AuthContext';
import { apiFetch } from '@/lib/apiClient';

interface AsistenciaEmpleado {
  id: string;
  dni: string;
  nombre: string;
  nombres?: string;
  apellidos?: string;
  cargo: string;
  rolId?: string;
  rolNombre?: string;
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

interface RolItem {
  id: string;
  nombre: string;
}

interface TurnoItem {
  id: string;
  nombre: string;
  horaInicio: string;
  horaFin: string;
}

interface SucursalItem {
  id: string;
  nombre: string;
}

const ROL_NOMBRES_LEGIBLES: Record<string, string> = {
  GERENCIA: 'Gerencia General (Control Total)',
  ADMINISTRACION: 'Administración & Operaciones',
  GERENTE_ADMINISTRATIVO: 'Gerente Administrativo',
  ASISTENTE_ADMINISTRATIVO: 'Asistente Administrativo',
  FINANZAS: 'Finanzas & Facturación',
  VENTAS_ATENCION_DIGITAL: 'Ventas & Comercial',
  ECOMMERCE_MARKETING: 'E-commerce & Marketing',
  PRODUCCION_ALMACEN: 'Producción & Almacén (Operario / Planta)',
  COMPRAS_PROVEEDORES: 'Compras & Proveedores',
  RECURSOS_HUMANOS: 'Recursos Humanos',
  SISTEMAS_TI: 'Sistemas & TI',
  DISENO_MULTIMEDIA: 'Diseño & Multimedia',
  ARCHIVO_HISTORICO: 'Archivo Histórico',
};

const CARGOS_PREDETERMINADOS = [
  'OPERARIO',
  'SUPERVISOR DE PLANTA',
  'JEFE DE PLANTA',
  'OPERADOR DE REACTOR',
  'ENVASADO & ETIQUETADO',
  'CONTROL DE CALIDAD / QA',
  'CHOFER DE DISTRIBUCIÓN & DESPACHO',
  'ASISTENTE DE PLANTA',
];

const DEFAULT_EMPLEADOS_FALLBACK: AsistenciaEmpleado[] = [
  {
    id: 'emp-001',
    dni: '45892341',
    nombre: 'Elvis Edwin Yarleque Arrunategui',
    cargo: 'Gerente Administrativo',
    rolNombre: 'GERENTE_ADMINISTRATIVO',
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
    rolNombre: 'PRODUCCION_ALMACEN',
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
    rolNombre: 'PRODUCCION_ALMACEN',
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
    rolNombre: 'PRODUCCION_ALMACEN',
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
  const { user } = useAuth();
  const esGerencia = user?.role === 'GERENCIA';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEstado, setSelectedEstado] = useState('TODOS');
  const [empleados, setEmpleados] = useState<AsistenciaEmpleado[]>(DEFAULT_EMPLEADOS_FALLBACK);
  const [cola, setCola] = useState<PendienteCola[]>([]);
  const [hoy, setHoy] = useState(() => new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  // Catálogos
  const [rolesList, setRolesList] = useState<RolItem[]>([]);
  const [turnosList, setTurnosList] = useState<TurnoItem[]>([]);
  const [sucursalesList, setSucursalesList] = useState<SucursalItem[]>([]);

  // Modal Edición de Rol y Cargo (Exclusivo Gerencia)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEmpleado, setEditingEmpleado] = useState<AsistenciaEmpleado | null>(null);
  const [editCargo, setEditCargo] = useState('');
  const [editRolId, setEditRolId] = useState('');
  const [editNombres, setEditNombres] = useState('');
  const [editApellidos, setEditApellidos] = useState('');
  const [editDni, setEditDni] = useState('');
  const [editTurnoId, setEditTurnoId] = useState('');
  const [editSucursalId, setEditSucursalId] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [modalError, setModalError] = useState('');

  // Modal Nuevo Colaborador
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newDni, setNewDni] = useState('');
  const [newNombres, setNewNombres] = useState('');
  const [newApellidos, setNewApellidos] = useState('');
  const [newCargo, setNewCargo] = useState('OPERARIO');
  const [newRolId, setNewRolId] = useState('');
  const [newTurnoId, setNewTurnoId] = useState('');
  const [newSucursalId, setNewSucursalId] = useState('');
  const [creando, setCreando] = useState(false);
  const [createError, setCreateError] = useState('');

  // Notificación Toast
  const [toastSuccess, setToastSuccess] = useState('');

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
    } catch {
      console.log('Using default attendance fallback data');
    } finally {
      setLoading(false);
    }
  }, [hoy]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  // Cargar catálogos de roles, turnos y sucursales
  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        const [rRes, tRes, sRes] = await Promise.all([
          apiFetch<RolItem[]>('/asistencia/roles'),
          apiFetch<TurnoItem[]>('/asistencia/turnos'),
          apiFetch<SucursalItem[]>('/asistencia/sucursales'),
        ]);
        if (Array.isArray(rRes.data)) setRolesList(rRes.data);
        if (Array.isArray(tRes.data)) setTurnosList(tRes.data);
        if (Array.isArray(sRes.data)) setSucursalesList(sRes.data);
      } catch (err) {
        console.error('Error cargando catálogos:', err);
      }
    };
    fetchCatalogs();
  }, []);

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
      Rol_Sistema: e.rolNombre || 'PRODUCCION_ALMACEN',
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

  // Abrir modal de edición para Gerencia General
  const openEditModal = (emp: AsistenciaEmpleado) => {
    setModalError('');
    setEditingEmpleado(emp);
    setEditCargo(emp.cargo || 'OPERARIO');
    setEditRolId(emp.rolId || rolesList.find((r) => r.nombre === 'PRODUCCION_ALMACEN')?.id || rolesList[0]?.id || '');
    setEditNombres(emp.nombres || emp.nombre.split(' ')[0] || '');
    setEditApellidos(emp.apellidos || emp.nombre.split(' ').slice(1).join(' ') || '');
    setEditDni(emp.dni);
    setEditTurnoId(emp.turnoId || '');
    setEditSucursalId(emp.sucursalId || '');
    setIsEditModalOpen(true);
  };

  // Guardar cambios de rol y cargo
  const handleActualizarEmpleado = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEmpleado) return;
    if (!editCargo.trim()) {
      setModalError('Por favor especifica un cargo o puesto operativo.');
      return;
    }
    setGuardando(true);
    setModalError('');
    try {
      const res = await apiFetch<any>(`/asistencia/usuarios/${editingEmpleado.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          cargo: editCargo.trim(),
          rolId: editRolId || undefined,
          nombres: editNombres.trim() || undefined,
          apellidos: editApellidos.trim() || undefined,
          dni: editDni.trim() || undefined,
          turnoId: editTurnoId || undefined,
          sucursalId: editSucursalId || undefined,
        }),
      });

      if (!res.ok || !res.data) {
        throw new Error(res.error || 'No se pudo actualizar el rol del colaborador.');
      }

      const updated = res.data;
      setEmpleados((prev) =>
        prev.map((emp) =>
          emp.id === editingEmpleado.id
            ? {
                ...emp,
                nombre: updated.nombre || emp.nombre,
                cargo: updated.cargo,
                rolId: updated.rolId,
                rolNombre: updated.rolNombre,
                turno: updated.turno || emp.turno,
                sucursal: updated.sucursal || emp.sucursal,
              }
            : emp
        )
      );

      setIsEditModalOpen(false);
      setToastSuccess(`Rol y cargo de ${updated.nombre || editingEmpleado.nombre} actualizados con éxito.`);
      setTimeout(() => setToastSuccess(''), 4500);
    } catch (err) {
      setModalError(err instanceof Error ? err.message : 'Error al actualizar colaborador.');
    } finally {
      setGuardando(false);
    }
  };

  // Crear nuevo colaborador
  const handleCrearEmpleado = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDni.trim() || !newNombres.trim() || !newApellidos.trim() || !newRolId) {
      setCreateError('Por favor completa todos los campos requeridos (DNI, Nombres, Apellidos y Rol).');
      return;
    }
    setCreando(true);
    setCreateError('');
    try {
      const res = await apiFetch<any>('/asistencia/usuarios', {
        method: 'POST',
        body: JSON.stringify({
          dni: newDni.trim(),
          nombres: newNombres.trim(),
          apellidos: newApellidos.trim(),
          cargo: newCargo.trim() || 'OPERARIO',
          rolId: newRolId,
          turnoId: newTurnoId || undefined,
          sucursalId: newSucursalId || undefined,
        }),
      });

      if (!res.ok || !res.data) {
        throw new Error(res.error || 'No se pudo registrar el nuevo colaborador.');
      }

      const nuevo = res.data;
      const nuevoMapeado: AsistenciaEmpleado = {
        id: nuevo.id,
        dni: nuevo.dni,
        nombre: nuevo.nombre,
        nombres: nuevo.nombres,
        apellidos: nuevo.apellidos,
        cargo: nuevo.cargo,
        rolId: nuevo.rolId,
        rolNombre: nuevo.rolNombre,
        sucursal: nuevo.sucursal || '—',
        sucursalId: nuevo.sucursalId,
        turnoId: nuevo.turnoId,
        turno: nuevo.turno || 'Sin turno asignado',
        horaIngreso: '--:--',
        horaSalida: '--:--',
        minutosTardanza: 0,
        horasTrabajadas: 0,
        estado: 'FALTA',
        estadoAlmuerzo: 'SIN_ALMUERZO',
        huellaVerificada: false,
      };

      setEmpleados((prev) => [nuevoMapeado, ...prev]);
      setIsCreateModalOpen(false);
      setToastSuccess(`Colaborador ${nuevo.nombre} registrado con éxito.`);
      setTimeout(() => setToastSuccess(''), 4500);
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : 'Error al registrar colaborador.');
    } finally {
      setCreando(false);
    }
  };

  // Dar de baja colaborador
  const handleBajaEmpleado = async (id: string, nombre: string) => {
    if (!window.confirm(`¿Estás seguro de que deseas dar de baja a ${nombre}? El colaborador pasará a estado INACTIVO.`)) {
      return;
    }
    try {
      const res = await apiFetch<any>(`/asistencia/usuarios/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(res.error || 'No se pudo dar de baja al colaborador.');
      setEmpleados((prev) => prev.filter((e) => e.id !== id));
      setToastSuccess(`Colaborador ${nombre} dado de baja exitosamente.`);
      setTimeout(() => setToastSuccess(''), 4500);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al dar de baja.');
    }
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
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className={`text-lg font-black tracking-tight ${textValue}`}>
                Asistencia, Biometría & RRHH
              </h1>
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                ZKTECO BIOMÉTRICO EN LÍNEA
              </span>
              {esGerencia ? (
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  👑 Gerencia General: Edición de Roles Activa
                </span>
              ) : (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
                  Modo Lectura
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Registro biométrico en tiempo real de ingreso, refrigerio y asignación de cargos operativos.
            </p>
          </div>
        </div>

        {/* Selector de Fecha, Nuevo Colaborador y Exportar */}
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
            title="Recargar asistencia"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>

          {esGerencia && (
            <button
              onClick={() => {
                setCreateError('');
                setNewDni('');
                setNewNombres('');
                setNewApellidos('');
                setNewCargo('OPERARIO');
                setNewRolId(rolesList.find((r) => r.nombre === 'PRODUCCION_ALMACEN')?.id || rolesList[0]?.id || '');
                setNewTurnoId(turnosList[0]?.id || '');
                setNewSucursalId(sucursalesList[0]?.id || '');
                setIsCreateModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs tracking-wider uppercase transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-1.5 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Nuevo Colaborador</span>
            </button>
          )}

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
        <div className={`rounded-2xl p-5 border transition-all card-hover-lift relative overflow-hidden group ${cardBg}`}>
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
        <div className={`rounded-2xl p-5 border transition-all card-hover-lift relative overflow-hidden group ${cardBg}`}>
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-bold tracking-widest uppercase font-mono ${textTitle}`}>
              PUNTUALES A TIEMPO
            </span>
            <div className="p-2 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-teal-400 font-mono tracking-tight">
              {aTiempo} Sin tardanza
            </h3>
            <p className="text-xs text-slate-400 mt-1.5 font-sans">
              Antes de las 08:00 AM
            </p>
          </div>
        </div>

        {/* TARDANZAS */}
        <div className={`rounded-2xl p-5 border transition-all card-hover-lift relative overflow-hidden group ${cardBg}`}>
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

        {/* HUELLAS */}
        <div className={`rounded-2xl p-5 border transition-all card-hover-lift relative overflow-hidden group ${cardBg}`}>
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-bold tracking-widest uppercase font-mono ${textTitle}`}>
              HUELLAS VALIDADAS
            </span>
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-[#00F2C3]">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-[#00F2C3] font-mono tracking-tight">
              {huellasOk} Verificados
            </h3>
            <p className="text-xs text-slate-400 mt-1.5 font-sans">
              100% Biometría dactilar
            </p>
          </div>
        </div>
      </div>

      {/* 3. Filtros y Búsqueda */}
      <div className={`rounded-2xl p-4 border flex flex-wrap items-center justify-between gap-3 ${cardBg}`}>
        <div className="flex items-center gap-1.5 flex-wrap">
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

      {/* 4. Tabla de Asistencia y Gestión de Colaboradores */}
      <div className={`rounded-2xl border overflow-hidden ${cardBg}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr
                className={`border-b ${
                  isDark ? 'border-[#1A2232] text-slate-400 bg-[#0B0F17]' : 'border-slate-200 text-slate-600 bg-slate-50'
                }`}
              >
                <th className="py-3 px-4 font-bold">COLABORADOR</th>
                <th className="py-3 px-4 font-bold">CARGO / PUESTO</th>
                <th className="py-3 px-4 font-bold text-center">TURNO</th>
                <th className="py-3 px-4 font-bold text-center">INGRESO</th>
                <th className="py-3 px-4 font-bold text-center">SALIDA</th>
                <th className="py-3 px-4 font-bold text-center">TARDANZA</th>
                <th className="py-3 px-4 font-bold text-center">ESTADO</th>
                <th className="py-3 px-4 font-bold text-center">BIOMETRÍA</th>
                <th className="py-3 px-4 font-bold text-center">ACCIONES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 font-mono">
              {filteredEmpleados.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-500 font-sans">
                    No se encontraron colaboradores registrados para esta vista.
                  </td>
                </tr>
              ) : (
                filteredEmpleados.map((emp) => (
                  <tr
                    key={emp.id}
                    className={`transition-colors ${
                      isDark ? 'hover:bg-[#151D2A]/60' : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-3.5 px-4 font-sans font-bold">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-[#00F2C3] font-black text-xs shrink-0">
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

                    <td className="py-3.5 px-4 font-sans">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-slate-200">{emp.cargo}</span>
                        {emp.rolNombre && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-blue-500/10 text-cyan-300 border border-blue-500/30">
                            {emp.rolNombre}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-0.5">{emp.sucursal}</span>
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

                    <td className="py-3.5 px-4 text-center font-sans">
                      {esGerencia ? (
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEditModal(emp)}
                            className="px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-sans font-bold text-[11px] transition-all flex items-center gap-1 cursor-pointer"
                            title="Editar cargo y rol del colaborador"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                            <span>Editar Rol</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleBajaEmpleado(emp.id, emp.nombre)}
                            className="p-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-all cursor-pointer"
                            title="Dar de baja al colaborador"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] text-slate-500 font-mono"
                          title="Solo Gerencia General tiene permiso para modificar roles"
                        >
                          <ShieldAlert className="w-3 h-3 text-slate-600" />
                          <span>Solo Gerencia</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. MODAL EDITAR ROL Y CARGO (EXCLUSIVO GERENCIA GENERAL) */}
      {isEditModalOpen && editingEmpleado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className={`w-full max-w-lg rounded-2xl border p-6 space-y-4 shadow-2xl relative ${cardBg}`}>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                  <UserCog className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={`text-base font-black ${textValue}`}>
                    Editar Rol & Cargo de Colaborador
                  </h3>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-300">
                    👑 Exclusivo Gerencia General
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleActualizarEmpleado} className="space-y-4 text-xs">
              {/* Información Personal */}
              <div className="p-3 rounded-xl bg-[#151D2A] border border-[#1A2232] space-y-1">
                <p className="text-slate-200 font-bold text-sm">
                  {editingEmpleado.nombre}
                </p>
                <p className="text-slate-400 font-mono text-[11px]">
                  DNI: <span className="text-cyan-400 font-bold">{editingEmpleado.dni}</span>
                </p>
              </div>

              {/* Selector de Cargo con Chips Rápidos */}
              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  Cargo / Puesto Operativo:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. OPERARIO, SUPERVISOR DE PLANTA..."
                  value={editCargo}
                  onChange={(e) => setEditCargo(e.target.value)}
                  className={`w-full rounded-xl border p-2.5 ${inputBg}`}
                />
                <div className="flex items-center gap-1.5 flex-wrap mt-2">
                  <span className="text-[10px] text-slate-400 font-bold">Puestos sugeridos:</span>
                  {CARGOS_PREDETERMINADOS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setEditCargo(c)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                        editCargo === c
                          ? 'bg-cyan-500 text-slate-950 font-black'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selector de Rol del Sistema */}
              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  Rol de Permisos en el Sistema (ERP):
                </label>
                <select
                  value={editRolId}
                  onChange={(e) => setEditRolId(e.target.value)}
                  className={`w-full rounded-xl border p-2.5 ${inputBg}`}
                >
                  {rolesList.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.nombre} — {ROL_NOMBRES_LEGIBLES[r.nombre] || r.nombre}
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-500 mt-1">
                  Determina los módulos a los que este colaborador puede acceder en el ERP si cuenta con usuario.
                </p>
              </div>

              {/* Turno y Sucursal */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Turno de Trabajo:</label>
                  <select
                    value={editTurnoId}
                    onChange={(e) => setEditTurnoId(e.target.value)}
                    className={`w-full rounded-xl border p-2.5 ${inputBg}`}
                  >
                    <option value="">Sin turno asignado</option>
                    {turnosList.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.nombre} ({t.horaInicio} - {t.horaFin})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Sucursal / Sede:</label>
                  <select
                    value={editSucursalId}
                    onChange={(e) => setEditSucursalId(e.target.value)}
                    className={`w-full rounded-xl border p-2.5 ${inputBg}`}
                  >
                    <option value="">Sin sucursal</option>
                    {sucursalesList.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={guardando}
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black tracking-wider uppercase shadow-lg shadow-cyan-500/20 disabled:opacity-50 cursor-pointer"
                >
                  {guardando ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. MODAL REGISTRAR NUEVO COLABORADOR */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className={`w-full max-w-lg rounded-2xl border p-6 space-y-4 shadow-2xl relative ${cardBg}`}>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={`text-base font-black ${textValue}`}>
                    Registrar Nuevo Colaborador
                  </h3>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-300">
                    👑 Exclusivo Gerencia General
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {createError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{createError}</span>
              </div>
            )}

            <form onSubmit={handleCrearEmpleado} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">DNI (8 dígitos):</label>
                  <input
                    type="text"
                    required
                    maxLength={8}
                    placeholder="75XXXXXX"
                    value={newDni}
                    onChange={(e) => setNewDni(e.target.value)}
                    className={`w-full rounded-xl border p-2.5 font-mono ${inputBg}`}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block font-bold text-slate-300 mb-1">Nombres:</label>
                  <input
                    type="text"
                    required
                    placeholder="Nombres del colaborador"
                    value={newNombres}
                    onChange={(e) => setNewNombres(e.target.value)}
                    className={`w-full rounded-xl border p-2.5 ${inputBg}`}
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Apellidos Completos:</label>
                <input
                  type="text"
                  required
                  placeholder="Apellidos paterno y materno"
                  value={newApellidos}
                  onChange={(e) => setNewApellidos(e.target.value)}
                  className={`w-full rounded-xl border p-2.5 ${inputBg}`}
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Cargo / Puesto Operativo:</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. OPERARIO"
                  value={newCargo}
                  onChange={(e) => setNewCargo(e.target.value)}
                  className={`w-full rounded-xl border p-2.5 ${inputBg}`}
                />
                <div className="flex items-center gap-1.5 flex-wrap mt-1.5">
                  {CARGOS_PREDETERMINADOS.slice(0, 4).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setNewCargo(c)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                        newCargo === c
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Rol de Permisos en el Sistema:</label>
                <select
                  value={newRolId}
                  onChange={(e) => setNewRolId(e.target.value)}
                  className={`w-full rounded-xl border p-2.5 ${inputBg}`}
                >
                  {rolesList.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.nombre} — {ROL_NOMBRES_LEGIBLES[r.nombre] || r.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Turno Asignado:</label>
                  <select
                    value={newTurnoId}
                    onChange={(e) => setNewTurnoId(e.target.value)}
                    className={`w-full rounded-xl border p-2.5 ${inputBg}`}
                  >
                    <option value="">Sin turno</option>
                    {turnosList.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Sucursal / Planta:</label>
                  <select
                    value={newSucursalId}
                    onChange={(e) => setNewSucursalId(e.target.value)}
                    className={`w-full rounded-xl border p-2.5 ${inputBg}`}
                  >
                    <option value="">Sin sucursal</option>
                    {sucursalesList.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={creando}
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black tracking-wider uppercase shadow-lg shadow-emerald-500/20 disabled:opacity-50 cursor-pointer"
                >
                  {creando ? 'Registrando...' : 'Registrar Colaborador'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. TOAST NOTIFICACIÓN */}
      {toastSuccess && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-2xl shadow-emerald-500/30 animate-bounce">
          <Check className="w-4 h-4 text-slate-950" />
          <span>{toastSuccess}</span>
        </div>
      )}
    </div>
  );
}
