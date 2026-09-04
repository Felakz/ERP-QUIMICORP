'use client';

import React, { useState, useMemo } from 'react';
import {
  AlertOctagon,
  ShieldAlert,
  Search,
  Filter,
  Download,
  CheckCircle2,
  Clock,
  Beaker,
  Factory,
  Plus,
  X,
  Sparkles,
  AlertTriangle,
  User,
  Wrench,
  DollarSign,
  Layers,
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { useTheme } from '@/lib/ThemeContext';

export type SeveridadIncidencia = 'TODAS' | 'CRITICA' | 'MODERADA' | 'LEVE';
export type EstadoIncidencia = 'TODOS' | 'ABIERTA' | 'EN_CORRECCION' | 'RESUELTA';

interface IncidenciaItem {
  id: string;
  codigoIncidencia: string;
  codigoLote: string;
  reactorEquipo: string;
  tipoDesviacion: string;
  severidad: 'CRITICA' | 'MODERADA' | 'LEVE';
  estado: 'ABIERTA' | 'EN_CORRECCION' | 'RESUELTA';
  fechaRegistro: string;
  operarioReportante: string;
  supervisorQA: string;
  descripcion: string;
  accionCorrectiva: string;
  mermaEstimadaPen: number;
  mermaVolumenKgLt: number;
}

const INITIAL_INCIDENCIAS: IncidenciaItem[] = [
  {
    id: 'inc-001',
    codigoIncidencia: 'INC-2026-0042',
    codigoLote: 'LOT-2026-0885',
    reactorEquipo: 'Reactor Principal #1 (5,000L)',
    tipoDesviacion: 'Desviación de Viscosidad (Baja)',
    severidad: 'MODERADA',
    estado: 'EN_CORRECCION',
    fechaRegistro: '2026-09-04',
    operarioReportante: 'Juan Pérez Mendoza',
    supervisorQA: 'Ing. Químico Supervisor',
    descripcion: 'Al finalizar la agitación del lote de Detergente Líquido, la viscosidad arrojó 350 cPs (Target: 800-1000 cPs).',
    accionCorrectiva: 'Dosificación adicional de 15 Kg de Sal Industrial y Comperlan KD para ajuste reológico.',
    mermaEstimadaPen: 180.00,
    mermaVolumenKgLt: 15,
  },
  {
    id: 'inc-002',
    codigoIncidencia: 'INC-2026-0041',
    codigoLote: 'LOT-2026-0882',
    reactorEquipo: 'Línea de Envasado #2 (Galoneras)',
    tipoDesviacion: 'Falla de Sellado en Tapa Precinto',
    severidad: 'LEVE',
    estado: 'RESUELTA',
    fechaRegistro: '2026-09-03',
    operarioReportante: 'Marcos Rivas',
    supervisorQA: 'Ing. Químico Supervisor',
    descripcion: '12 galoneras de 4L presentaron fuga leve por torque insuficiente en la enroscadora.',
    accionCorrectiva: 'Calibración del cabezal neumático de tapado y re-envasado de los 12 envases afectados.',
    mermaEstimadaPen: 45.00,
    mermaVolumenKgLt: 4,
  },
  {
    id: 'inc-003',
    codigoIncidencia: 'INC-2026-0040',
    codigoLote: 'LOT-2026-0879',
    reactorEquipo: 'Reactor de Blanqueo #3 (2,000L)',
    tipoDesviacion: 'Concentración Baja de Cloro Activo',
    severidad: 'CRITICA',
    estado: 'RESUELTA',
    fechaRegistro: '2026-09-01',
    operarioReportante: 'Juan Pérez Mendoza',
    supervisorQA: 'Ing. Químico Supervisor',
    descripcion: 'El análisis de titulación arrojó 4.2% de hipoclorito cuando el estándar comercial requiere 5.25%.',
    accionCorrectiva: 'Adición de 120 LT de Hipoclorito de Sodio 10% puro. Titulación posterior conforme en 5.3%. Lote liberado.',
    mermaEstimadaPen: 350.00,
    mermaVolumenKgLt: 120,
  },
  {
    id: 'inc-004',
    codigoIncidencia: 'INC-2026-0039',
    codigoLote: 'LOT-2026-0875',
    reactorEquipo: 'Tanque Mezclador #2 (1,000L)',
    tipoDesviacion: 'Turbidez Inesperada en Desengrasante',
    severidad: 'MODERADA',
    estado: 'ABIERTA',
    fechaRegistro: '2026-08-30',
    operarioReportante: 'Carlos Estrada',
    supervisorQA: 'Ing. Químico Supervisor',
    descripcion: 'Ligera opalescencia al enfriar el lote. Posible incompatibilidad de fragancia con el solvente.',
    accionCorrectiva: 'En evaluación de laboratorio con prueba de estabilidad a 40°C.',
    mermaEstimadaPen: 220.00,
    mermaVolumenKgLt: 25,
  },
];

export default function AdministracionIncidenciasPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [incidencias, setIncidencias] = useState<IncidenciaItem[]>(INITIAL_INCIDENCIAS);
  const [selectedSeveridad, setSelectedSeveridad] = useState<SeveridadIncidencia>('TODAS');
  const [selectedEstado, setSelectedEstado] = useState<EstadoIncidencia>('TODOS');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form nueva incidencia
  const [nuevoLote, setNuevoLote] = useState('');
  const [nuevoEquipo, setNuevoEquipo] = useState('Reactor Principal #1 (5,000L)');
  const [nuevoTipo, setNuevoTipo] = useState('');
  const [nuevaSeveridad, setNuevaSeveridad] = useState<'CRITICA' | 'MODERADA' | 'LEVE'>('MODERADA');
  const [nuevaDescripcion, setNuevaDescripcion] = useState('');
  const [nuevaAccion, setNuevaAccion] = useState('');
  const [nuevaMermaSoles, setNuevaMermaSoles] = useState<number>(100);

  const cardBg = isDark ? 'bg-[#0F141C] border-[#1A2232]' : 'bg-white border-slate-200 shadow-sm';
  const textTitle = isDark ? 'text-slate-400' : 'text-slate-600';
  const textValue = isDark ? 'text-white' : 'text-slate-900';
  const inputBg = isDark
    ? 'bg-[#151D2A] border-[#1A2232] text-slate-200 placeholder-slate-500 focus:border-[#00F2C3]'
    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500';

  const filteredIncidencias = useMemo(() => {
    return incidencias.filter((inc) => {
      if (selectedSeveridad !== 'TODAS' && inc.severidad !== selectedSeveridad) return false;
      if (selectedEstado !== 'TODOS' && inc.estado !== selectedEstado) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchCode = inc.codigoIncidencia.toLowerCase().includes(q);
        const matchLote = inc.codigoLote.toLowerCase().includes(q);
        const matchEquipo = inc.reactorEquipo.toLowerCase().includes(q);
        const matchTipo = inc.tipoDesviacion.toLowerCase().includes(q);
        const matchOp = inc.operarioReportante.toLowerCase().includes(q);
        if (!matchCode && !matchLote && !matchEquipo && !matchTipo && !matchOp) return false;
      }
      return true;
    });
  }, [incidencias, selectedSeveridad, selectedEstado, searchQuery]);

  // KPIs
  const totalMermaSoles = useMemo(
    () => incidencias.reduce((acc, inc) => acc + inc.mermaEstimadaPen, 0),
    [incidencias]
  );
  const abiertas = useMemo(
    () => incidencias.filter((i) => i.estado === 'ABIERTA').length,
    [incidencias]
  );
  const enCorreccion = useMemo(
    () => incidencias.filter((i) => i.estado === 'EN_CORRECCION').length,
    [incidencias]
  );
  const resueltas = useMemo(
    () => incidencias.filter((i) => i.estado === 'RESUELTA').length,
    [incidencias]
  );

  const handleCrearIncidencia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoLote.trim() || !nuevoTipo.trim() || !nuevaDescripcion.trim()) {
      alert('Por favor completa todos los campos requeridos de la incidencia.');
      return;
    }

    const nueva: IncidenciaItem = {
      id: `inc-${Date.now()}`,
      codigoIncidencia: `INC-2026-${String(incidencias.length + 43).padStart(4, '0')}`,
      codigoLote: nuevoLote.trim().toUpperCase(),
      reactorEquipo: nuevoEquipo,
      tipoDesviacion: nuevoTipo.trim(),
      severidad: nuevaSeveridad,
      estado: 'ABIERTA',
      fechaRegistro: new Date().toISOString().split('T')[0],
      operarioReportante: 'Operador Planta',
      supervisorQA: 'Ing. Químico Supervisor',
      descripcion: nuevaDescripcion.trim(),
      accionCorrectiva: nuevaAccion.trim() || 'En evaluación por QA.',
      mermaEstimadaPen: Number(nuevaMermaSoles),
      mermaVolumenKgLt: 10,
    };

    setIncidencias([nueva, ...incidencias]);
    setIsModalOpen(false);
    setNuevoLote('');
    setNuevoTipo('');
    setNuevaDescripcion('');
    setNuevaAccion('');
    alert(`✅ Incidencia [${nueva.codigoIncidencia}] registrada para control QA.`);
  };

  const handleResolver = (id: string) => {
    setIncidencias((prev) =>
      prev.map((i) => (i.id === id ? { ...i, estado: 'RESUELTA' } : i))
    );
    alert('✅ Incidencia de calidad marcada como RESUELTA y lote liberado.');
  };

  const handleExportExcel = () => {
    const rows = filteredIncidencias.map((i) => ({
      Codigo_Incidencia: i.codigoIncidencia,
      Lote: i.codigoLote,
      Equipo_Reactor: i.reactorEquipo,
      Desviacion: i.tipoDesviacion,
      Severidad: i.severidad,
      Estado: i.estado,
      Fecha_Registro: i.fechaRegistro,
      Operario: i.operarioReportante,
      Supervisor_QA: i.supervisorQA,
      Descripcion: i.descripcion,
      Accion_Correctiva: i.accionCorrectiva,
      Merma_Estimada_PEN: i.mermaEstimadaPen,
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Incidencias_QA');
    XLSX.writeFile(wb, `Quimicorp_Incidencias_Calidad_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="space-y-5 font-sans min-h-screen">
      {/* 1. Header Banner Neon */}
      <div
        className={`rounded-2xl p-5 border flex flex-wrap items-center justify-between gap-4 transition-all shadow-sm ${cardBg}`}
      >
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-rose-500/10 to-amber-500/20 border border-rose-500/30 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.15)]">
            <AlertOctagon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className={`text-lg font-black tracking-tight ${textValue}`}>
                Incidencias de Producción & Calidad (QA)
              </h1>
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-rose-500/10 text-rose-400 border border-rose-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                TRAZABILIDAD Y CONTROL DE MERMAS
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Monitoreo de desviaciones en reactores químicos, ajuste reológico y aprobación de calidad.
            </p>
          </div>
        </div>

        {/* Botones */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-slate-950 font-black text-xs tracking-wider uppercase transition-all shadow-lg shadow-rose-500/20 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>+ Reportar Incidencia QA</span>
          </button>

          <button
            onClick={handleExportExcel}
            className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 ${
              isDark
                ? 'bg-[#151D2A] border-[#1A2232] text-slate-200 hover:text-rose-400 hover:border-rose-500/40'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Exportar .XLSX</span>
          </button>
        </div>
      </div>

      {/* 2. Cuadrícula de 4 Tarjetas KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* MERMA ESTIMADA */}
        <div
          className={`rounded-2xl p-5 border transition-all card-hover-lift relative overflow-hidden group ${cardBg}`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-bold tracking-widest uppercase font-mono ${textTitle}`}>
              MERMA TOTAL ESTIMADA
            </span>
            <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-rose-400 font-mono tracking-tight">
              S/ {totalMermaSoles.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
            </h3>
            <p className="text-xs text-slate-400 mt-1.5 font-sans">
              Impacto financiero en insumos
            </p>
          </div>
        </div>

        {/* EN CORRECCIÓN */}
        <div
          className={`rounded-2xl p-5 border transition-all card-hover-lift relative overflow-hidden group ${cardBg}`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-bold tracking-widest uppercase font-mono ${textTitle}`}>
              EN AJUSTE REOLÓGICO
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Wrench className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-amber-400 font-mono tracking-tight">
              {enCorreccion} Lotes
            </h3>
            <p className="text-xs text-slate-400 mt-1.5 font-sans">
              En proceso de compensación
            </p>
          </div>
        </div>

        {/* ABIERTAS */}
        <div
          className={`rounded-2xl p-5 border transition-all card-hover-lift relative overflow-hidden group ${cardBg}`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-bold tracking-widest uppercase font-mono ${textTitle}`}>
              POR EVALUAR
            </span>
            <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-rose-400 font-mono tracking-tight">
              {abiertas} Lotes
            </h3>
            <p className="text-xs text-slate-400 mt-1.5 font-sans">
              Requieren visto bueno QA
            </p>
          </div>
        </div>

        {/* RESUELTAS */}
        <div
          className={`rounded-2xl p-5 border transition-all card-hover-lift relative overflow-hidden group ${cardBg}`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-bold tracking-widest uppercase font-mono ${textTitle}`}>
              LOTES LIBERADOS
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-emerald-400 font-mono tracking-tight">
              {resueltas} Casos
            </h3>
            <p className="text-xs text-slate-400 mt-1.5 font-sans">
              Corrección técnica exitosa
            </p>
          </div>
        </div>
      </div>

      {/* 3. Filtros Segmentados y Buscador */}
      <div className={`rounded-2xl border p-4 flex flex-wrap items-center justify-between gap-3 ${cardBg}`}>
        <div className="flex items-center gap-1.5 bg-[#151D2A] p-1 rounded-xl border border-[#1A2232] overflow-x-auto">
          {[
            { id: 'TODOS', label: 'Todas' },
            { id: 'ABIERTA', label: 'Abiertas' },
            { id: 'EN_CORRECCION', label: 'En Corrección' },
            { id: 'RESUELTA', label: 'Resueltas' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedEstado(tab.id as EstadoIncidencia)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                selectedEstado === tab.id
                  ? 'bg-rose-500 text-slate-950 font-black shadow-[0_0_10px_rgba(244,63,94,0.4)]'
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
            placeholder="Buscar por lote, reactor, desviación u operario..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full rounded-xl border py-2 pl-9 pr-3 text-xs focus:outline-none transition-all ${inputBg}`}
          />
        </div>
      </div>

      {/* 4. Lista de Incidencias */}
      <div className="space-y-3">
        {filteredIncidencias.map((inc) => (
          <div
            key={inc.id}
            className={`rounded-2xl border p-5 transition-all card-hover-lift ${cardBg} ${
              inc.estado === 'ABIERTA'
                ? 'border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.1)]'
                : inc.estado === 'EN_CORRECCION'
                ? 'border-amber-500/30'
                : 'border-[#1A2232]'
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono font-bold text-sm text-rose-400">
                    {inc.codigoIncidencia}
                  </span>
                  <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
                    {inc.codigoLote}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold font-mono border ${
                      inc.severidad === 'CRITICA'
                        ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse'
                        : inc.severidad === 'MODERADA'
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                        : 'bg-blue-500/20 text-blue-400 border-blue-500/40'
                    }`}
                  >
                    SEV: {inc.severidad}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold font-mono border ${
                      inc.estado === 'RESUELTA'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : inc.estado === 'EN_CORRECCION'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                    }`}
                  >
                    {inc.estado.replace('_', ' ')}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Factory className="w-4 h-4 text-slate-400" />
                  <h3 className={`text-base font-black ${textValue}`}>{inc.reactorEquipo}</h3>
                </div>

                <p className="text-xs font-bold text-slate-300">
                  ⚠️ Desviación: {inc.tipoDesviacion}
                </p>
              </div>

              <div className="text-right font-mono">
                <span className={`text-[10px] font-bold uppercase ${textTitle}`}>MERMA ESTIMADA</span>
                <p className="text-xl font-black text-rose-400">
                  S/ {inc.mermaEstimadaPen.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                </p>
                <span className="text-xs text-slate-400 font-sans">
                  Volumen: ~{inc.mermaVolumenKgLt} KG/LT
                </span>
              </div>
            </div>

            {/* Diagnóstico & Acción Correctiva */}
            <div className="mt-4 pt-3 border-t border-slate-800/60 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#151D2A]/60 border border-[#1A2232]">
                <p className="text-[10px] font-bold uppercase text-slate-400 mb-1">
                  Descripción del Hallazgo QA:
                </p>
                <p className="text-slate-300 font-sans">{inc.descripcion}</p>
              </div>

              <div className="p-3 rounded-xl bg-[#151D2A]/60 border border-[#1A2232]">
                <p className="text-[10px] font-bold uppercase text-emerald-400 mb-1">
                  Acción Correctiva / Ajuste Técnico:
                </p>
                <p className="text-slate-200 font-sans font-bold">{inc.accionCorrectiva}</p>
              </div>
            </div>

            {/* Footer Acciones */}
            <div className="mt-4 pt-3 border-t border-slate-800/40 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3 text-slate-400 font-mono">
                <span>📅 Fecha: {inc.fechaRegistro}</span>
                <span>• 👷 Operario: {inc.operarioReportante}</span>
                <span>• 🔬 QA: {inc.supervisorQA}</span>
              </div>

              <div className="flex items-center gap-2">
                {inc.estado !== 'RESUELTA' && (
                  <button
                    onClick={() => handleResolver(inc.id)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-bold flex items-center gap-1.5 transition-all"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Liberar Lote / Cerrar Incidencia</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL REPORTAR INCIDENCIA */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className={`w-full max-w-lg rounded-2xl border p-6 space-y-4 shadow-2xl ${cardBg}`}>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <AlertOctagon className="w-5 h-5 text-rose-400" />
                <h3 className={`text-base font-black ${textValue}`}>Reportar Incidencia QA</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCrearIncidencia} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Código de Lote:</label>
                  <input
                    type="text"
                    required
                    placeholder="LOT-2026-XXXX"
                    value={nuevoLote}
                    onChange={(e) => setNuevoLote(e.target.value)}
                    className={`w-full rounded-xl border p-2.5 font-mono ${inputBg}`}
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Severidad:</label>
                  <select
                    value={nuevaSeveridad}
                    onChange={(e) => setNuevaSeveridad(e.target.value as any)}
                    className={`w-full rounded-xl border p-2.5 ${inputBg}`}
                  >
                    <option value="MODERADA">MODERADA (Ajuste)</option>
                    <option value="CRITICA">CRÍTICA (Detención)</option>
                    <option value="LEVE">LEVE (Observación)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Reactor / Equipo:</label>
                <select
                  value={nuevoEquipo}
                  onChange={(e) => setNuevoEquipo(e.target.value)}
                  className={`w-full rounded-xl border p-2.5 ${inputBg}`}
                >
                  <option value="Reactor Principal #1 (5,000L)">Reactor Principal #1 (5,000L)</option>
                  <option value="Tanque Mezclador #2 (1,000L)">Tanque Mezclador #2 (1,000L)</option>
                  <option value="Reactor de Blanqueo #3 (2,000L)">Reactor de Blanqueo #3 (2,000L)</option>
                  <option value="Línea de Envasado #1 (Bidones)">Línea de Envasado #1 (Bidones)</option>
                  <option value="Línea de Envasado #2 (Galoneras)">Línea de Envasado #2 (Galoneras)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Tipo de Desviación:</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Desviación de pH, Viscosidad o Color"
                  value={nuevoTipo}
                  onChange={(e) => setNuevoTipo(e.target.value)}
                  className={`w-full rounded-xl border p-2.5 ${inputBg}`}
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Descripción del Hallazgo:</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Detalle los valores obtenidos y la anomalía..."
                  value={nuevaDescripcion}
                  onChange={(e) => setNuevaDescripcion(e.target.value)}
                  className={`w-full rounded-xl border p-2.5 ${inputBg}`}
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Acción Correctiva Sugerida:</label>
                <input
                  type="text"
                  placeholder="Ej. Dosificación correctiva de insumo o ajuste de temperatura"
                  value={nuevaAccion}
                  onChange={(e) => setNuevaAccion(e.target.value)}
                  className={`w-full rounded-xl border p-2.5 ${inputBg}`}
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Merma Estimada (S/):</label>
                <input
                  type="number"
                  min="0"
                  value={nuevaMermaSoles}
                  onChange={(e) => setNuevaMermaSoles(Number(e.target.value))}
                  className={`w-full rounded-xl border p-2.5 font-mono ${inputBg}`}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-slate-950 font-black tracking-wider uppercase shadow-lg shadow-rose-500/20"
                >
                  Registrar Incidencia
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
