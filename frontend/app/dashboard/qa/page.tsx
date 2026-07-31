'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Activity,
  ScrollText,
  FileCheck,
  Check,
  X,
  Users,
  UserPlus,
  ChevronDown,
  ChevronUp,
  Beaker,
} from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';
import { FORMULAS_MAESTRAS_REALES } from '@/lib/formulasData';

interface IngredienteFormula {
  sku: string;
  componente: string;
  porcentaje: number;
  pesoTeorico: number;
  tipo: 'BASE' | 'ADICIONAL';
  stockStatus: 'OK' | 'BAJO' | 'CRITICAL';
}

interface LoteQA {
  id: string;
  codigoQA: string;
  nombreProducto: string;
  codigoLote: string;
  rendimiento: string;
  mermaPercentage: string;
  operarios: string[];
  fechaEnvio: string;
  estado: 'PENDIENTE' | 'APROBADO' | 'RECHAZADO';
  estadoProceso: string;
  formula: IngredienteFormula[];
}

interface MovimientoKardex {
  id: string;
  fecha: string;
  insumo: string;
  tipoMovimiento: 'ENTRADA' | 'SALIDA' | 'AJUSTE_FINO' | 'MERMA' | 'REAPROVECHAMIENTO';
  cantidad: string;
  stockAnterior: string;
  stockNuevo: string;
  docRef: string;
  usuario: string;
}

export default function QAKardexPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [activeTab, setActiveTab] = useState<'QA' | 'KARDEX'>('QA');
  const [selectedLoteId, setSelectedLoteId] = useState<string | null>(null);
  const [expandedLoteIds, setExpandedLoteIds] = useState<string[]>([]);
  const [observacion, setObservacion] = useState<string>('');

  const [lotes, setLotes] = useState<LoteQA[]>([
    {
      id: '1',
      codigoQA: 'QA-0101',
      nombreProducto: FORMULAS_MAESTRAS_REALES[0].nombreProducto, // SERUM DE SALMON
      codigoLote: 'LOT-2026-1001',
      rendimiento: '986.5 KG',
      mermaPercentage: '1.35%',
      operarios: ['Carlos Quispe', 'Ana Flores'],
      fechaEnvio: '2026-07-31 08:42',
      estado: 'PENDIENTE',
      estadoProceso: '⚙️ EN PROCESO (Mezcla de activos / Elaboración en curso)',
      formula: FORMULAS_MAESTRAS_REALES[0].ingredientes,
    },
    {
      id: '2',
      codigoQA: 'QA-0100',
      nombreProducto: FORMULAS_MAESTRAS_REALES[21].nombreProducto, // BREATIFY
      codigoLote: 'LOT-2026-1022',
      rendimiento: '994.8 KG',
      mermaPercentage: '0.52%',
      operarios: ['Ana Flores'],
      fechaEnvio: '2026-07-30 16:15',
      estado: 'PENDIENTE',
      estadoProceso: '🧪 EN MUESTREO DE CALIDAD (QA Control)',
      formula: FORMULAS_MAESTRAS_REALES[21].ingredientes,
    },
    {
      id: '3',
      codigoQA: 'QA-0099',
      nombreProducto: FORMULAS_MAESTRAS_REALES[32].nombreProducto, // CREMA MICROTGHT - ALFALION
      codigoLote: 'LOT-2026-1033',
      rendimiento: '962.0 KG',
      mermaPercentage: '3.80%',
      operarios: ['Luis Mamani'],
      fechaEnvio: '2026-07-29 14:30',
      estado: 'APROBADO',
      estadoProceso: '✨ LOTE TERMINADO & LIBERADO PARA DESPACHO',
      formula: FORMULAS_MAESTRAS_REALES[32].ingredientes,
    },
    {
      id: '4',
      codigoQA: 'QA-0098',
      nombreProducto: FORMULAS_MAESTRAS_REALES[91].nombreProducto, // CHAMPU DE JENGIBRE...
      codigoLote: 'LOT-2026-1092',
      rendimiento: '218.0 KG',
      mermaPercentage: '8.20%',
      operarios: ['Rosa Condori'],
      fechaEnvio: '2026-07-28 11:00',
      estado: 'RECHAZADO',
      estadoProceso: '🛑 RECHAZADO POR ALTA MERMA',
      formula: FORMULAS_MAESTRAS_REALES[91].ingredientes,
    },
  ]);

  const [kardexData, setKardexData] = useState<MovimientoKardex[]>([
    {
      id: 'K-001',
      fecha: '2026-07-31 08:42:15',
      insumo: 'Soda Cáustica 50% (NaOH)',
      tipoMovimiento: 'SALIDA',
      cantidad: '-110.00 KG',
      stockAnterior: '1310.00 KG',
      stockNuevo: '1200.00 KG',
      docRef: 'LOT-2024-0892',
      usuario: 'Carlos Quispe & Ana Flores',
    },
    {
      id: 'K-002',
      fecha: '2026-07-31 08:40:00',
      insumo: 'LESS 70%',
      tipoMovimiento: 'AJUSTE_FINO',
      cantidad: '+0.50 KG',
      stockAnterior: '8899.50 KG',
      stockNuevo: '8900.00 KG',
      docRef: 'LOT-2024-0892',
      usuario: 'Carlos Quispe',
    },
    {
      id: 'K-003',
      fecha: '2026-07-30 16:15:30',
      insumo: 'Alcohol Isopropílico 99.9%',
      tipoMovimiento: 'ENTRADA',
      cantidad: '+5000.00 LT',
      stockAnterior: '9500.00 LT',
      stockNuevo: '14500.00 LT',
      docRef: 'FAC-2024-9981',
      usuario: 'Almacén Central',
    },
    {
      id: 'K-004',
      fecha: '2026-07-28 11:00:10',
      insumo: 'Glicol Propilénico',
      tipoMovimiento: 'REAPROVECHAMIENTO',
      cantidad: '+8.20 LT',
      stockAnterior: '5191.80 KG',
      stockNuevo: '5200.00 KG',
      docRef: 'RES-0043',
      usuario: 'Rosa Condori',
    },
    {
      id: 'K-005',
      fecha: '2026-07-28 10:15:00',
      insumo: 'Formaldehído 37%',
      tipoMovimiento: 'MERMA',
      cantidad: '-15.00 LT',
      stockAnterior: '865.00 LT',
      stockNuevo: '850.00 LT',
      docRef: 'LOT-2024-0887',
      usuario: 'Rosa Condori',
    },
  ]);

  const operariosDisponibles = [
    'Carlos Quispe',
    'Ana Flores',
    'Luis Mamani',
    'Rosa Condori',
    'Jorge Mendoza',
  ];

  const selectedLote = lotes.find((l) => l.id === selectedLoteId) || null;

  const handleToggleOperario = (operario: string) => {
    setLotes((prev) =>
      prev.map((l) => {
        if (l.id !== selectedLoteId) return l;
        const exists = l.operarios.includes(operario);
        const updatedOperarios = exists
          ? l.operarios.filter((o) => o !== operario)
          : [...l.operarios, operario];
        return { ...l, operarios: updatedOperarios };
      })
    );
  };

  const toggleFormulaDropdown = (loteId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedLoteIds((prev) =>
      prev.includes(loteId) ? prev.filter((id) => id !== loteId) : [...prev, loteId]
    );
  };

  const handleCambiarEstadoProceso = (nuevoEstado: string) => {
    setLotes((prev) =>
      prev.map((l) =>
        l.id === selectedLoteId ? { ...l, estadoProceso: nuevoEstado } : l
      )
    );
  };

  const handleAprobar = () => {
    setLotes((prev) =>
      prev.map((l) =>
        l.id === selectedLoteId
          ? { ...l, estado: 'APROBADO', estadoProceso: '✨ LOTE TERMINADO & LIBERADO PARA DESPACHO' }
          : l
      )
    );

    // Auto-register Kardex transaction
    const nuevoKardex: MovimientoKardex = {
      id: `K-${Date.now().toString().slice(-4)}`,
      fecha: new Date().toISOString().replace('T', ' ').slice(0, 19),
      insumo: selectedLote.nombreProducto,
      tipoMovimiento: 'ENTRADA',
      cantidad: `+${selectedLote.rendimiento}`,
      stockAnterior: '0.00 KG',
      stockNuevo: selectedLote.rendimiento,
      docRef: selectedLote.codigoLote,
      usuario: selectedLote.operarios.join(' & '),
    };
    setKardexData((prev) => [nuevoKardex, ...prev]);

    alert(`¡Lote ${selectedLote.codigoLote} APROBADO por QA! Registro Kardex generado automáticamente.`);
  };

  const handleRechazar = () => {
    if (!observacion.trim()) {
      alert('Por favor ingrese la observación o motivo de rechazo.');
      return;
    }
    setLotes((prev) =>
      prev.map((l) =>
        l.id === selectedLoteId
          ? { ...l, estado: 'RECHAZADO', estadoProceso: '🛑 RECHAZADO POR QA SUPERVISOR' }
          : l
      )
    );
    alert(`Lote ${selectedLote.codigoLote} RECHAZADO.`);
  };

  const pendientesCount = lotes.filter((l) => l.estado === 'PENDIENTE').length;

  const cardBg = isDark ? 'bg-[#0F141C] border-[#1A2232]' : 'bg-white border-slate-200 shadow-sm';
  const textTitle = isDark ? 'text-slate-400' : 'text-slate-500';
  const textValue = isDark ? 'text-white' : 'text-slate-900';
  const subBoxBg = isDark ? 'bg-[#151D2A] border-[#1A2232]' : 'bg-slate-50 border-slate-200';
  const inputBg = isDark ? 'bg-[#151D2A] border-[#1A2232] text-slate-200 placeholder-slate-600' : 'bg-slate-50 border-slate-300 text-slate-800 placeholder-slate-400';

  return (
    <div className="space-y-5 font-mono min-h-screen">
      {/* Upper View Mode Switcher Header Bar */}
      <div className={`flex flex-wrap items-center justify-between gap-4 border-b pb-3 ${isDark ? 'border-[#1A2232]' : 'border-slate-200'}`}>
        <div>
          <h2 className={`text-sm font-bold tracking-widest uppercase ${textTitle}`}>
            CONTROL DE CALIDAD & KARDEX INMUTABLE
          </h2>
          <p className="text-xs text-slate-400 font-sans">
            Aprobación en tiempo real de lotes y registro inmutable de movimientos de producción.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className={`flex rounded-lg p-1 border text-xs font-sans ${isDark ? 'bg-[#0F141C] border-[#1A2232]' : 'bg-slate-100 border-slate-300'}`}>
          <button
            onClick={() => setActiveTab('QA')}
            className={`flex items-center gap-2 rounded-md px-3.5 py-1.5 font-bold transition-all ${
              activeTab === 'QA'
                ? 'bg-[#00F2C3] text-[#090C10] shadow-md'
                : isDark
                ? 'text-slate-400 hover:text-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileCheck className="h-3.5 w-3.5" />
            <span>Bandeja QA ({pendientesCount})</span>
          </button>
          <button
            onClick={() => setActiveTab('KARDEX')}
            className={`flex items-center gap-2 rounded-md px-3.5 py-1.5 font-bold transition-all ${
              activeTab === 'KARDEX'
                ? 'bg-[#00F2C3] text-[#090C10] shadow-md'
                : isDark
                ? 'text-slate-400 hover:text-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ScrollText className="h-3.5 w-3.5" />
            <span>Kardex Inmutable</span>
          </button>
        </div>
      </div>

      {activeTab === 'QA' ? (
        /* QA VIEW MODE */
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-9">
          {/* Left Column (4 Cols): LOTES PENDIENTES DE APROBACIÓN */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className={`text-xs font-bold tracking-widest uppercase px-1 ${textTitle}`}>
              LOTES PENDIENTES DE APROBACIÓN
            </h3>

            <div className="space-y-3">
              {lotes.map((lote) => {
                const isSelected = lote.id === selectedLoteId;
                const isExpanded = expandedLoteIds.includes(lote.id);

                return (
                  <div
                    key={lote.id}
                    onClick={() => setSelectedLoteId(lote.id)}
                    className={`rounded-xl p-4 border transition-all cursor-pointer space-y-2.5 ${
                      isSelected
                        ? isDark
                          ? 'bg-[#0F141C] border-[#00F2C3]/60 shadow-lg shadow-[#00F2C3]/5'
                          : 'bg-white border-cyan-500 shadow-md ring-2 ring-cyan-500/20'
                        : isDark
                        ? 'bg-[#0B0F17] border-[#1A2232] hover:bg-[#0F141C]/60'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-cyan-500">
                        {lote.codigoQA}
                      </span>
                      {lote.estado === 'PENDIENTE' && (
                        <span className="inline-flex items-center gap-1 rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-500 border border-amber-500/30">
                          <Clock className="h-3 w-3" /> PENDIENTE
                        </span>
                      )}
                      {lote.estado === 'APROBADO' && (
                        <span className="inline-flex items-center gap-1 rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-500 border border-emerald-500/30">
                          <CheckCircle2 className="h-3 w-3" /> APROBADO
                        </span>
                      )}
                      {lote.estado === 'RECHAZADO' && (
                        <span className="inline-flex items-center gap-1 rounded bg-rose-500/20 px-2 py-0.5 text-[10px] font-bold text-rose-500 border border-rose-500/30">
                          <XCircle className="h-3 w-3" /> RECHAZADO
                        </span>
                      )}
                    </div>

                    <h4 className={`text-sm font-bold font-sans ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                      {lote.nombreProducto}
                    </h4>

                    {/* Details Grid */}
                    <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                      <div>
                        <span className="text-[10px] text-slate-400 block">LOTE</span>
                        <span className={`font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{lote.codigoLote}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">RENDIMIENTO</span>
                        <span className={`font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{lote.rendimiento}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">MERMA %</span>
                        <span
                          className={`font-bold ${
                            Number(lote.mermaPercentage.replace('%', '')) > 5
                              ? 'text-rose-500'
                              : Number(lote.mermaPercentage.replace('%', '')) > 2
                              ? 'text-amber-500'
                              : 'text-emerald-500'
                          }`}
                        >
                          {lote.mermaPercentage}
                        </span>
                      </div>
                    </div>

                    {/* Assigned Operators & Date Bar */}
                    <div className={`border-t pt-2 text-[10px] font-sans flex justify-between ${isDark ? 'border-[#1A2232] text-slate-400' : 'border-slate-100 text-slate-500'}`}>
                      <span className="flex items-center gap-1 font-bold text-cyan-400">
                        <Users className="h-3 w-3" /> {lote.operarios.length > 0 ? lote.operarios.join(', ') : 'Sin operarios'}
                      </span>
                      <span>{lote.fechaEnvio}</span>
                    </div>

                    {/* Dropdown Toggle Button for Formula Completa */}
                    <button
                      type="button"
                      onClick={(e) => toggleFormulaDropdown(lote.id, e)}
                      className={`w-full flex items-center justify-between rounded-lg px-3 py-1.5 text-[11px] font-bold font-sans transition-all border ${
                        isExpanded
                          ? 'bg-cyan-500/15 text-cyan-400 border-cyan-500/40 shadow-sm'
                          : isDark
                          ? 'bg-[#151D2A] text-slate-300 border-[#1A2232] hover:bg-[#1A2434]'
                          : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <Beaker className="h-3.5 w-3.5 text-cyan-400" />
                        Ver Fórmula Completa ({lote.formula?.length || 0} insumos)
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-cyan-400" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-slate-400" />
                      )}
                    </button>

                    {/* Collapsible Dropdown Content: Complete Formula Table */}
                    {isExpanded && lote.formula && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className={`rounded-lg p-3 border space-y-2 text-xs font-mono transition-all ${
                          isDark ? 'bg-[#090C10] border-[#1A2232]' : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] font-bold tracking-wider text-slate-400 uppercase border-b pb-1.5 border-slate-700/40">
                          <span>COMPONENTE / SKU</span>
                          <span>CANT. (% TEÓRICO)</span>
                        </div>
                        <div className="divide-y divide-slate-800/40 space-y-1.5 pt-1">
                          {lote.formula.map((ing, idx) => (
                            <div key={idx} className="pt-1.5 flex items-center justify-between gap-2">
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-cyan-400 font-bold text-[10px] bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20">
                                    {ing.sku}
                                  </span>
                                  <span className={`font-sans font-medium text-[11px] truncate ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                                    {ing.componente}
                                  </span>
                                </div>
                              </div>
                              <div className="text-right whitespace-nowrap font-mono text-[11px]">
                                <span className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                                  {ing.pesoTeorico} KG
                                </span>
                                <span className="text-[10px] text-slate-400 ml-1">
                                  ({ing.porcentaje}%)
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column (5 Cols): DETAIL & SUPERVISOR DECISION) */}
          <div className="lg:col-span-5 space-y-4">
            {!selectedLote ? (
              <div className={`rounded-xl p-10 border text-center space-y-4 flex flex-col items-center justify-center min-h-[460px] ${cardBg}`}>
                <div className="p-4 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                  <FileCheck className="h-8 w-8" />
                </div>
                <div className="space-y-1.5 max-w-sm">
                  <h3 className={`text-base font-bold font-sans ${textValue}`}>
                    Selecciona un Lote de la lista
                  </h3>
                  <p className="text-xs text-slate-400 font-sans leading-relaxed">
                    Haz clic en cualquiera de los lotes de la izquierda para ver su información detallada, gestionar la asignación de operarios en tiempo real y emitir la aprobación o rechazo de QA.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Lote Header Card */}
                <div className={`rounded-xl p-5 border space-y-4 ${cardBg}`}>
                  <div>
                    <h2 className={`text-xl font-bold font-sans ${textValue}`}>
                      {selectedLote.nombreProducto}
                    </h2>
                    <p className="text-xs text-cyan-500 font-mono mt-0.5">
                      {selectedLote.codigoQA} · LOTE: {selectedLote.codigoLote}
                    </p>
                  </div>

                  {/* 4 Stat Grid Boxes */}
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 font-mono text-xs">
                    <div className={`rounded-lg p-3 border ${subBoxBg}`}>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">OPERARIO(S)</span>
                      <span className={`text-xs font-bold mt-1 block truncate ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                        {selectedLote.operarios.length > 0 ? selectedLote.operarios.join(', ') : 'Ninguno'}
                      </span>
                    </div>

                    <div className={`rounded-lg p-3 border ${subBoxBg}`}>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">ENVIADO</span>
                      <span className={`text-[11px] font-semibold mt-1 block ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{selectedLote.fechaEnvio}</span>
                    </div>

                    <div className={`rounded-lg p-3 border ${subBoxBg}`}>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">RENDIMIENTO</span>
                      <span className={`text-xs font-bold mt-1 block ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{selectedLote.rendimiento}</span>
                    </div>

                    <div className={`rounded-lg p-3 border ${subBoxBg}`}>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">MERMA</span>
                      <span className="text-xs font-bold text-emerald-500 mt-1 block">{selectedLote.mermaPercentage}</span>
                    </div>
                  </div>

                  {/* Assigned Operators Interactive Selector (Imagen 1) */}
                  <div className={`rounded-xl p-4 border space-y-3 ${subBoxBg}`}>
                    <div className="flex items-center justify-between">
                      <h3 className={`text-xs font-bold tracking-widest uppercase flex items-center gap-2 ${textTitle}`}>
                        <Users className="h-4 w-4 text-cyan-500" />
                        OPERARIOS ASIGNADOS AL LOTE ({selectedLote.operarios.length})
                      </h3>
                      <span className="text-[11px] text-slate-400 font-sans">
                        Haga clic para asignar / desasignar
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 font-sans text-xs">
                      {operariosDisponibles.map((operario) => {
                        const isAssigned = selectedLote.operarios.includes(operario);
                        return (
                          <button
                            key={operario}
                            type="button"
                            onClick={() => handleToggleOperario(operario)}
                            className={`rounded-lg px-3 py-1.5 font-bold transition-all flex items-center gap-1.5 border ${
                              isAssigned
                                ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40 shadow-sm'
                                : isDark
                                ? 'bg-[#090C10] text-slate-400 border-[#1A2232] hover:text-slate-200'
                                : 'bg-white text-slate-600 border-slate-300 hover:text-slate-900'
                            }`}
                          >
                            {isAssigned ? (
                              <Check className="h-3.5 w-3.5 text-cyan-400 stroke-[3]" />
                            ) : (
                              <UserPlus className="h-3.5 w-3.5 text-slate-400" />
                            )}
                            <span>{operario}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Real-time Manufacturing Status Card */}
                  <div className={`rounded-xl p-4 border space-y-3 ${subBoxBg}`}>
                    <div className="flex items-center justify-between">
                      <h3 className={`text-xs font-bold tracking-widest uppercase flex items-center gap-2 ${textTitle}`}>
                        <Activity className="h-4 w-4 text-cyan-500" />
                        ESTADO DE FABRICACIÓN EN TIEMPO REAL
                      </h3>
                      <span className="text-[10px] text-emerald-500 font-bold font-mono uppercase">
                        Actualizado en vivo
                      </span>
                    </div>

                    <div className={`rounded-lg p-3 border font-sans text-xs font-bold ${isDark ? 'bg-[#090C10] border-[#1A2232] text-cyan-400' : 'bg-white border-slate-200 text-slate-900'}`}>
                      {selectedLote.estadoProceso}
                    </div>

                    {/* Quick State Actions */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] text-slate-400 uppercase font-mono block">
                        Cambiar estado en tiempo real (Visible para Administración y Planta):
                      </span>
                      <div className="grid grid-cols-2 gap-2 text-xs font-sans">
                        <button
                          onClick={() => handleCambiarEstadoProceso('⚙️ EN PROCESO — Elaborando Producto')}
                          className={`rounded p-2 text-left border transition-colors ${isDark ? 'bg-[#0B0F17] hover:bg-[#1A2434] text-slate-200 border-slate-700' : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300'}`}
                        >
                          ⚙️ Elaborando Producto
                        </button>
                        <button
                          onClick={() => handleCambiarEstadoProceso('🧪 EN MUESTREO DE CALIDAD (QA Control)')}
                          className={`rounded p-2 text-left border transition-colors ${isDark ? 'bg-[#0B0F17] hover:bg-[#1A2434] text-cyan-400 border-cyan-500/30' : 'bg-white hover:bg-slate-100 text-cyan-700 border-cyan-300'}`}
                        >
                          🧪 En Muestreo QA
                        </button>
                        <button
                          onClick={() => handleCambiarEstadoProceso('✨ LOTE TERMINADO & LIBERADO PARA DESPACHO')}
                          className={`rounded p-2 text-left border transition-colors ${isDark ? 'bg-[#0B0F17] hover:bg-[#1A2434] text-emerald-400 border-emerald-500/30' : 'bg-white hover:bg-slate-100 text-emerald-600 border-emerald-300'}`}
                        >
                          ✨ Lote Terminado
                        </button>
                        <button
                          onClick={() => handleCambiarEstadoProceso('🛑 DETENIDO EN PLANTA')}
                          className={`rounded p-2 text-left border transition-colors ${isDark ? 'bg-[#0B0F17] hover:bg-[#1A2434] text-rose-400 border-rose-500/30' : 'bg-white hover:bg-slate-100 text-rose-600 border-rose-300'}`}
                        >
                          🛑 Detener Proceso
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* QA Decision Form Card */}
                <div className={`rounded-xl p-5 border space-y-4 ${cardBg}`}>
                  <h3 className={`text-xs font-bold tracking-widest uppercase ${textTitle}`}>
                    DECISIÓN QA SUPERVISOR
                  </h3>

                  <div className="space-y-1.5 font-sans">
                    <label className="text-xs text-slate-400">
                      Observación / Motivo de rechazo
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Descripción opcional..."
                      value={observacion}
                      onChange={(e) => setObservacion(e.target.value)}
                      className={`w-full rounded-lg border p-3 text-xs focus:border-[#00F2C3] focus:outline-none transition-all ${inputBg}`}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 pt-1 font-mono">
                    <button
                      onClick={handleRechazar}
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-rose-500/15 py-3 text-xs font-bold text-rose-500 hover:bg-rose-500/25 border border-rose-500/30 transition-colors"
                    >
                      <X className="h-4 w-4" />
                      <span>Rechazar Lote</span>
                    </button>
                    <button
                      onClick={handleAprobar}
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-[#00F2C3] py-3 text-xs font-bold text-[#090C10] hover:bg-[#00d8ad] transition-all shadow-md"
                    >
                      <Check className="h-4 w-4 stroke-[3]" />
                      <span>Aprobar Lote</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        /* KARDEX INMUTABLE VIEW MODE */
        <div className={`rounded-xl p-5 border space-y-4 ${cardBg}`}>
          <div className="flex items-center justify-between">
            <h3 className={`text-xs font-bold tracking-widest uppercase ${textTitle}`}>
              HISTORIAL DE MOVIMIENTOS KARDEX (REGISTRO ACID INMUTABLE)
            </h3>
            <span className="text-xs text-slate-400 font-sans">
              Transacciones append-only vinculadas a fórmulas y lotes
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className={`border-b text-[10px] font-bold tracking-widest uppercase ${isDark ? 'border-[#1A2232] text-slate-400' : 'border-slate-200 text-slate-500'}`}>
                  <th className="py-3 px-3">FECHA / HORA</th>
                  <th className="py-3 px-3">INSUMO QUÍMICO / PRODUCTO</th>
                  <th className="py-3 px-3">TIPO MOVIMIENTO</th>
                  <th className="py-3 px-3">CANTIDAD</th>
                  <th className="py-3 px-3">STOCK ANTERIOR</th>
                  <th className="py-3 px-3">STOCK NUEVO</th>
                  <th className="py-3 px-3">DOC. REF.</th>
                  <th className="py-3 px-3">USUARIO / OPERARIOS</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-[#1A2232]/60 font-mono' : 'divide-slate-200 font-mono'}`}>
                {kardexData.map((m) => (
                  <tr key={m.id} className={`transition-colors ${isDark ? 'hover:bg-[#151D2A]/50' : 'hover:bg-slate-50'}`}>
                    <td className="py-3 px-3 text-slate-400">{m.fecha}</td>
                    <td className={`py-3 px-3 font-sans font-bold ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>{m.insumo}</td>
                    <td className="py-3 px-3">
                      {m.tipoMovimiento === 'ENTRADA' && (
                        <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-500 border border-emerald-500/30">
                          ENTRADA
                        </span>
                      )}
                      {m.tipoMovimiento === 'SALIDA' && (
                        <span className="rounded bg-rose-500/20 px-2 py-0.5 text-[10px] font-bold text-rose-500 border border-rose-500/30">
                          SALIDA
                        </span>
                      )}
                      {m.tipoMovimiento === 'AJUSTE_FINO' && (
                        <span className="rounded bg-cyan-500/20 px-2 py-0.5 text-[10px] font-bold text-cyan-500 border border-cyan-500/30">
                          AJUSTE FINO
                        </span>
                      )}
                      {m.tipoMovimiento === 'MERMA' && (
                        <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-500 border border-amber-500/30">
                          MERMA
                        </span>
                      )}
                      {m.tipoMovimiento === 'REAPROVECHAMIENTO' && (
                        <span className="rounded bg-purple-500/20 px-2 py-0.5 text-[10px] font-bold text-purple-400 border border-purple-500/30">
                          REAPROVECHAMIENTO
                        </span>
                      )}
                    </td>
                    <td className={`py-3 px-3 font-bold ${textValue}`}>{m.cantidad}</td>
                    <td className="py-3 px-3 text-slate-400">{m.stockAnterior}</td>
                    <td className="py-3 px-3 font-bold text-cyan-500">{m.stockNuevo}</td>
                    <td className="py-3 px-3 text-cyan-500 font-bold">{m.docRef}</td>
                    <td className={`py-3 px-3 font-sans ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{m.usuario}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
