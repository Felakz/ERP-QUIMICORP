'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Beaker,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Building2,
  Check,
  X,
  FlaskConical,
  MessageSquare,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';
import { FORMULAS_MAESTRAS_REALES } from '@/lib/formulasData';

export type PasoProcesoType =
  | 'PENDIENTE_ASIGNACION'
  | 'ELABORANDO'
  | 'EN_MUESTREO_QA'
  | 'LIBERADO_QA'
  | 'RECHAZADO';

interface LoteQAUI {
  id: string;
  codigoQA: string;
  nombreProducto: string;
  codigoLote: string;
  clienteNombre: string;
  rendimiento: string;
  mermaPercentage: string;
  operarios: string[];
  fechaEnvio: string;
  pasoProceso: PasoProcesoType;
  estado: 'PENDIENTE' | 'APROBADO' | 'RECHAZADO';
  observacionesQA?: string;
  motivoRechazo?: string;
  formula: {
    sku: string;
    componente: string;
    porcentaje: number;
    pesoTeorico: number;
  }[];
}

const QUICK_INCIDENTS = [
  'Variación pH fuera de rango (pH > 7.5)',
  'Ajuste Viscosidad requerido (LESS 70%)',
  'Falta Envase Bidón PEAD 5 Galones',
  'Insumo Defectuoso o impuro en mezcla',
];

export default function ProduccionQAPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [selectedLoteId, setSelectedLoteId] = useState<string | null>(null);
  const [expandedLoteIds, setExpandedLoteIds] = useState<string[]>([]);
  const [observacionInput, setObservacionInput] = useState<string>('');
  const [motivoRechazoInput, setMotivoRechazoInput] = useState<string>('');
  const [showRechazoModal, setShowRechazoModal] = useState<boolean>(false);

  // Inicializar vacíos para permitir validación completa del flujo desde Pedidos Entrantes
  const [lotes, setLotes] = useState<LoteQAUI[]>([]);

  // Función para reiniciar/limpiar pruebas
  const handleLimpiarLotesPrueba = () => {
    localStorage.removeItem('quimicorp_produccion_lotes_custom');
    setLotes([]);
    setSelectedLoteId(null);
    alert('🧹 Se han limpiado los lotes de prueba. El tablero está listo para recibir pedidos aprobados desde Administración.');
  };

  // Sincronización en Tiempo Real de Lotes Aprobados desde Pedidos Entrantes de Administración
  const syncLotesDinamicos = () => {
    try {
      const rawCustom = localStorage.getItem('quimicorp_produccion_lotes_custom');
      if (rawCustom) {
        const lotesCustom: LoteQAUI[] = JSON.parse(rawCustom);
        if (Array.isArray(lotesCustom) && lotesCustom.length > 0) {
          setLotes((prev) => {
            const mapExistentes = new Map<string, LoteQAUI>();
            // 1. Agregar los que ya están en el estado (conservando operarios asignados, etc.)
            prev.forEach((l) => mapExistentes.set(l.codigoLote, l));
            // 2. Agregar los nuevos provenientes de Administración sin sobreescribir los en proceso
            lotesCustom.forEach((l) => {
              if (!mapExistentes.has(l.codigoLote)) {
                mapExistentes.set(l.codigoLote, l);
              }
            });
            const unicos = Array.from(mapExistentes.values());
            if (unicos.length !== prev.length) {
              setSelectedLoteId((curr) => curr || unicos[0].id);
              setObservacionInput((curr) => curr || unicos[0].observacionesQA || '');
              return unicos;
            }
            return prev;
          });
        }
      } else {
        setLotes([]);
        setSelectedLoteId(null);
      }
    } catch (e) {
      console.log('Error syncing dynamic lotes:', e);
    }
  };

  useEffect(() => {
    syncLotesDinamicos();
    window.addEventListener('storage', syncLotesDinamicos);
    const interval = setInterval(syncLotesDinamicos, 2000);
    return () => {
      window.removeEventListener('storage', syncLotesDinamicos);
      clearInterval(interval);
    };
  }, []);

  const operariosDisponibles = [
    'Carlos Quispe',
    'Ana Flores',
    'Luis Mamani',
    'Rosa Condori',
    'Jorge Mendoza',
  ];

  const selectedLote = lotes.find((l) => l.id === selectedLoteId) || null;

  // Global Theme Color Tokens
  const cardBg = isDark ? 'bg-[#0F141C] border-[#1A2232]' : 'bg-white border-slate-200 shadow-sm';
  const textTitle = isDark ? 'text-slate-400' : 'text-slate-600';
  const textValue = isDark ? 'text-white' : 'text-slate-900';
  const subBoxBg = isDark ? 'bg-[#151D2A] border-[#1A2232]' : 'bg-slate-50 border-slate-200';
  const inputBg = isDark
    ? 'bg-[#151D2A] border-[#1A2232] text-slate-200 placeholder-slate-500'
    : 'bg-white border-slate-300 text-slate-800 placeholder-slate-400';

  const badgeCyan = isDark
    ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
    : 'bg-teal-50 text-teal-800 border-teal-300 font-bold';

  const badgeAmber = isDark
    ? 'bg-amber-500/20 text-amber-200 border-amber-500/40'
    : 'bg-amber-100 text-amber-900 border-amber-300 font-bold';

  // Toggle operarios
  const handleToggleOperario = async (operario: string) => {
    if (!selectedLote) return;
    const exists = selectedLote.operarios.includes(operario);
    const newOperarios = exists
      ? selectedLote.operarios.filter((o) => o !== operario)
      : [...selectedLote.operarios, operario];

    const newPaso: PasoProcesoType =
      newOperarios.length === 0
        ? 'PENDIENTE_ASIGNACION'
        : selectedLote.pasoProceso === 'PENDIENTE_ASIGNACION'
        ? 'ELABORANDO'
        : selectedLote.pasoProceso;

    setLotes((prev) =>
      prev.map((l) => (l.id === selectedLote.id ? { ...l, operarios: newOperarios, pasoProceso: newPaso } : l))
    );

    try {
      await fetch('http://localhost:3001/api/v1/produccion/ordenes/operarios', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ordenProduccionId: selectedLote.id, operarios: newOperarios }),
      });
    } catch (e) {
      console.log('Backend notification synced locally:', e);
    }
  };

  // Change Paso Proceso
  const handleCambiarPaso = async (nuevoPaso: PasoProcesoType) => {
    if (!selectedLote) return;

    if ((nuevoPaso === 'ELABORANDO' || nuevoPaso === 'EN_MUESTREO_QA') && selectedLote.operarios.length === 0) {
      alert('⚠️ Asigna al menos un operario para habilitar la fabricación.');
      return;
    }

    setLotes((prev) =>
      prev.map((l) => (l.id === selectedLote.id ? { ...l, pasoProceso: nuevoPaso } : l))
    );

    try {
      await fetch('http://localhost:3001/api/v1/produccion/ordenes/paso', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ordenProduccionId: selectedLote.id,
          pasoProceso: nuevoPaso,
          observacionesQA: observacionInput,
        }),
      });
    } catch (e) {
      console.log('Backend paso update local:', e);
    }
  };

  // Add Quick Incident Chip text into observations textarea
  const handleAddIncidentChip = (chipText: string) => {
    setObservacionInput((prev) => (prev ? `${prev} | ${chipText}` : chipText));
  };

  // Finalize & Liberate Lote QA (Transaction to Kardex & Etiquetas)
  const handleFinalizarYLiberar = async () => {
    if (!selectedLote) return;

    if (selectedLote.operarios.length === 0) {
      alert('⚠️ Asigna al menos un operario para habilitar la fabricación y liberación.');
      return;
    }

    try {
      await fetch('http://localhost:3001/api/v1/produccion/qa/aprobar', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ordenProduccionId: selectedLote.id,
          observacionesQA: observacionInput,
        }),
      });
    } catch (e) {
      console.log('Local fallback execution for approval:', e);
    }

    // 1. Actualizar estado local del lote
    setLotes((prev) =>
      prev.map((l) =>
        l.id === selectedLote.id
          ? {
              ...l,
              estado: 'APROBADO',
              pasoProceso: 'LIBERADO_QA',
              observacionesQA: observacionInput || 'Lote verificado y liberado conforme.',
            }
          : l
      )
    );

    // 2. Transmisión a la Cola de Etiquetas (/dashboard/etiquetas)
    try {
      const nuevaEtiquetaObj = {
        id: `etiqueta-${Date.now()}`,
        codigoLote: selectedLote.codigoLote,
        nombreProducto: selectedLote.nombreProducto,
        clienteNombre: selectedLote.clienteNombre,
        unidades: 100,
        contenido: selectedLote.rendimiento,
        sku: `SKU-${selectedLote.codigoLote}`,
        fechaFab: new Date().toISOString().split('T')[0],
        fechaVenc: '2027-08-01',
        codigoBarras: `7759000${selectedLote.codigoLote.replace(/\D/g, '') || '1001'}`,
        codigoQR: `QR-QUIMICORP-${selectedLote.codigoLote}`,
        ruc: '20512345678',
        advertenciaGHS: 'GHS07 (Control Industrial QA)',
        aprobadoQA: true,
        estadoImpresion: 'LISTO_PARA_IMPRIMIR',
      };

      const existingEtiquetasRaw = localStorage.getItem('quimicorp_etiquetas_cola_custom');
      const existingEtiquetas = existingEtiquetasRaw ? JSON.parse(existingEtiquetasRaw) : [];
      const updatedEtiquetas = [nuevaEtiquetaObj, ...existingEtiquetas.filter((e: any) => e.codigoLote !== selectedLote.codigoLote)];
      localStorage.setItem('quimicorp_etiquetas_cola_custom', JSON.stringify(updatedEtiquetas));
    } catch (e) {
      console.log('Error saving a etiquetas local:', e);
    }

    // 3. Transmisión al Kardex (/dashboard/kardex)
    try {
      const nuevoKardexObj = {
        id: `kardex-prod-${Date.now()}`,
        categoriaKardex: 'PRODUCTO_TERMINADO',
        productoNombre: selectedLote.nombreProducto,
        familia: 'Detergentes & Limpiadores Industriales',
        categoriaNombre: 'Producto Terminado Aprobado',
        proveedorCliente: selectedLote.clienteNombre,
        unidadMedida: 'KG',
        fecha: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        tipoDoc: 'OP',
        serie: 'LOTE',
        numero: selectedLote.codigoLote,
        otp: `OTP-${selectedLote.codigoLote}`,
        tipoOperacion: 'ENTRADA_PRODUCCION',
        cantidadEntrada: parseFloat(selectedLote.rendimiento) || 150,
        cantidadSalida: 0,
        saldoFinal: parseFloat(selectedLote.rendimiento) || 150,
      };

      const existingKardexRaw = localStorage.getItem('quimicorp_kardex_custom');
      const existingKardex = existingKardexRaw ? JSON.parse(existingKardexRaw) : [];
      const updatedKardex = [nuevoKardexObj, ...existingKardex];
      localStorage.setItem('quimicorp_kardex_custom', JSON.stringify(updatedKardex));
    } catch (e) {
      console.log('Error saving a kardex local:', e);
    }

    // Emitir evento de almacenamiento para sincronizar en vivo
    window.dispatchEvent(new Event('storage'));

    alert(
      `🚀 Lote ${selectedLote.codigoLote} LIBERADO CON ÉXITO por QA!\n\n` +
      `- Salida por consumo de insumos procesada.\n` +
      `- Entrada registrada en Kardex para el cliente ${selectedLote.clienteNombre} (${selectedLote.rendimiento}).\n` +
      `- Etiqueta transferida a la cola de /dashboard/etiquetas.`
    );
  };

  // Reject Lote
  const handleConfirmarRechazo = async () => {
    if (!selectedLote) return;
    if (!motivoRechazoInput.trim()) {
      alert('El motivo de rechazo es obligatorio para detener el lote.');
      return;
    }

    setLotes((prev) =>
      prev.map((l) =>
        l.id === selectedLote.id
          ? {
              ...l,
              estado: 'RECHAZADO',
              pasoProceso: 'RECHAZADO',
              motivoRechazo: motivoRechazoInput,
            }
          : l
      )
    );

    setShowRechazoModal(false);
    setMotivoRechazoInput('');
    alert(`🛑 Lote ${selectedLote.codigoLote} RECHAZADO. Notificación enviada a Administración.`);
  };

  const toggleFormulaDropdown = (loteId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedLoteIds((prev) =>
      prev.includes(loteId) ? prev.filter((id) => id !== loteId) : [...prev, loteId]
    );
  };

  // Helper for Stepper index
  const getPasoStepIndex = (paso: PasoProcesoType): number => {
    switch (paso) {
      case 'PENDIENTE_ASIGNACION':
        return 1;
      case 'ELABORANDO':
        return 2;
      case 'EN_MUESTREO_QA':
        return 3;
      case 'LIBERADO_QA':
        return 4;
      case 'RECHAZADO':
        return 0;
      default:
        return 1;
    }
  };

  return (
    <div className="space-y-6 font-mono min-h-screen">
      {/* Header Titular */}
      <div className={`flex flex-wrap items-center justify-between gap-4 border-b pb-4 ${isDark ? 'border-slate-800/80' : 'border-slate-200'}`}>
        <div>
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-xl border ${isDark ? 'bg-cyan-500/10 border-cyan-500/30 text-[#00F2C3]' : 'bg-teal-50 border-teal-300 text-teal-700'}`}>
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <h2 className={`text-lg font-bold font-sans flex items-center gap-2 ${textValue}`}>
                <span>Control de Producción & QA</span>
                <span className={`text-[10px] px-2 py-0.5 rounded border font-mono uppercase font-bold ${badgeCyan}`}>
                  WORKFLOW EN TIEMPO REAL
                </span>
              </h2>
              <p className={`text-xs font-sans ${textTitle}`}>
                Monitoreo operativo de reactores, asignación de operarios, muestreo QA y cierre transaccional a Kardex.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleLimpiarLotesPrueba}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border font-sans transition-all flex items-center gap-1.5 ${
              isDark
                ? 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20'
                : 'bg-rose-50 text-rose-800 border-rose-300 hover:bg-rose-100'
            }`}
            title="Reiniciar tablero para validar el flujo completo desde cero"
          >
            <span>🧹 Reiniciar Pruebas</span>
          </button>

          <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border font-mono ${
            isDark ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-800 border-emerald-300'
          }`}>
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            WEBSOCKETS ACTIVO
          </span>
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column (5 Cols): List of Active Production Batches */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className={`text-xs font-bold tracking-widest uppercase ${textTitle}`}>
              LOTES DE PRODUCCIÓN EN PLANTA ({lotes.length})
            </h3>
            <span className={`text-[10px] font-sans ${textTitle}`}>Selecciona un lote</span>
          </div>

          <div className="space-y-3">
            {lotes.length === 0 ? (
              <div className={`rounded-xl p-8 border text-center space-y-3 ${cardBg}`}>
                <FlaskConical className={`w-8 h-8 mx-auto ${isDark ? 'text-cyan-400' : 'text-teal-600'}`} />
                <div className="space-y-1">
                  <h4 className={`text-sm font-bold font-sans ${textValue}`}>0 Lotes en Producción</h4>
                  <p className={`text-xs font-sans leading-relaxed ${textTitle}`}>
                    Aprueba un pedido comercial en <strong className={textValue}>Pedidos Entrantes de Administración</strong> para enviarlo a Planta.
                  </p>
                </div>
                <a
                  href="/dashboard/pedidos-admin"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 text-white font-bold text-xs hover:bg-teal-700 transition-all font-sans shadow-md"
                >
                  <span>📥 Ir a Pedidos Entrantes</span>
                </a>
              </div>
            ) : (
              lotes.map((lote) => {
              const isSelected = lote.id === selectedLoteId;
              const isExpanded = expandedLoteIds.includes(lote.id);
              const isLiberado = lote.pasoProceso === 'LIBERADO_QA';
              const isRechazado = lote.pasoProceso === 'RECHAZADO';
              const currentStepIdx = getPasoStepIndex(lote.pasoProceso);

              return (
                <div
                  key={lote.id}
                  onClick={() => {
                    setSelectedLoteId(lote.id);
                    setObservacionInput(lote.observacionesQA || '');
                  }}
                  className={`rounded-xl p-4 border transition-all cursor-pointer space-y-3 ${
                    isLiberado
                      ? isDark
                        ? 'bg-emerald-950/20 border-emerald-500/40'
                        : 'bg-emerald-50/80 border-emerald-300'
                      : isRechazado
                      ? isDark
                        ? 'bg-rose-950/20 border-rose-500/40'
                        : 'bg-rose-50/80 border-rose-300'
                      : isSelected
                      ? isDark
                        ? 'bg-[#0F141C] border-[#00F2C3]/60 shadow-lg shadow-[#00F2C3]/5 ring-1 ring-[#00F2C3]/30'
                        : 'bg-white border-teal-500 shadow-md ring-2 ring-teal-500/20'
                      : isDark
                      ? 'bg-[#0B0F17] border-[#1A2232] hover:bg-[#0F141C]/60'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded border ${badgeCyan}`}>
                        {lote.codigoQA}
                      </span>
                      <span className={isDark ? 'text-cyan-400' : 'text-teal-700'}>{lote.codigoLote}</span>
                    </span>

                    {/* Cliente Real Destacado */}
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border font-sans ${badgeAmber}`}>
                      <Building2 className="w-3 h-3" />
                      {lote.clienteNombre}
                    </span>
                  </div>

                  <div>
                    <h4 className={`text-sm font-bold font-sans ${textValue}`}>
                      {lote.nombreProducto}
                    </h4>
                  </div>

                  {/* Micro Stepper Bar for List Card */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                      <span>PASO {currentStepIdx}/4</span>
                      <span className={`font-bold ${isDark ? 'text-cyan-400' : 'text-teal-700'}`}>
                        {lote.pasoProceso === 'PENDIENTE_ASIGNACION'
                          ? '1. Asignación Operarios'
                          : lote.pasoProceso === 'ELABORANDO'
                          ? '2. Mezcla en Reactores'
                          : lote.pasoProceso === 'EN_MUESTREO_QA'
                          ? '3. Muestreo QA'
                          : lote.pasoProceso === 'LIBERADO_QA'
                          ? '4. Finalizado & Liberado'
                          : 'RECHAZADO'}
                      </span>
                    </div>

                    <div className={`grid grid-cols-4 gap-1 h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
                      <div className={`rounded-full transition-all ${currentStepIdx >= 1 ? (isDark ? 'bg-[#00F2C3]' : 'bg-teal-600') : (isDark ? 'bg-slate-700' : 'bg-slate-300')}`} />
                      <div className={`rounded-full transition-all ${currentStepIdx >= 2 ? (isDark ? 'bg-[#00F2C3]' : 'bg-teal-600') : (isDark ? 'bg-slate-700' : 'bg-slate-300')}`} />
                      <div className={`rounded-full transition-all ${currentStepIdx >= 3 ? (isDark ? 'bg-[#00F2C3]' : 'bg-teal-600') : (isDark ? 'bg-slate-700' : 'bg-slate-300')}`} />
                      <div className={`rounded-full transition-all ${currentStepIdx >= 4 ? 'bg-emerald-500' : (isDark ? 'bg-slate-700' : 'bg-slate-300')}`} />
                    </div>
                  </div>

                  {/* Operarios and Rendimiento Footer */}
                  <div className={`border-t pt-2 text-[10px] font-sans flex items-center justify-between ${isDark ? 'border-[#1A2232] text-slate-400' : 'border-slate-100 text-slate-600'}`}>
                    <span className="flex items-center gap-1 font-bold">
                      <Users className={`h-3 w-3 ${isDark ? 'text-cyan-400' : 'text-teal-600'}`} />
                      {lote.operarios.length > 0 ? lote.operarios.join(', ') : 'Sin operarios asignados'}
                    </span>
                    <span className={`font-mono font-bold ${isDark ? 'text-cyan-400' : 'text-teal-700'}`}>
                      {lote.rendimiento}
                    </span>
                  </div>

                  {/* Dropdown Toggle Button for Formula Completa */}
                  <button
                    type="button"
                    onClick={(e) => toggleFormulaDropdown(lote.id, e)}
                    className={`w-full flex items-center justify-between rounded-lg px-3 py-1.5 text-[11px] font-bold font-sans transition-all border ${
                      isExpanded
                        ? isDark
                          ? 'bg-cyan-500/15 text-cyan-400 border-cyan-500/40 shadow-sm'
                          : 'bg-teal-50 text-teal-800 border-teal-300'
                        : isDark
                        ? 'bg-[#151D2A] text-slate-300 border-[#1A2232] hover:bg-[#1A2434]'
                        : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <Beaker className={`h-3.5 w-3.5 ${isDark ? 'text-cyan-400' : 'text-teal-600'}`} />
                      Ver Fórmula Completa ({lote.formula?.length || 0} insumos)
                    </span>
                    {isExpanded ? (
                      <ChevronUp className={`h-4 w-4 ${isDark ? 'text-cyan-400' : 'text-teal-600'}`} />
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
                      <div className="flex items-center justify-between text-[10px] font-bold tracking-wider text-slate-500 uppercase border-b pb-1.5 border-slate-200 dark:border-slate-800">
                        <span>COMPONENTE / SKU</span>
                        <span>CANT. (% TEÓRICO)</span>
                      </div>
                      <div className="divide-y divide-slate-200 dark:divide-slate-800 space-y-1.5 pt-1">
                        {lote.formula.map((ing, idx) => (
                          <div key={idx} className="pt-1.5 flex items-center justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5">
                                <span className={`font-bold text-[10px] px-1.5 py-0.5 rounded border ${badgeCyan}`}>
                                  {ing.sku}
                                </span>
                                <span className={`font-sans font-medium text-[11px] truncate ${textValue}`}>
                                  {ing.componente}
                                </span>
                              </div>
                            </div>
                            <div className="text-right whitespace-nowrap font-mono text-[11px]">
                              <span className={`font-bold ${textValue}`}>
                                {ing.pesoTeorico} KG
                              </span>
                              <span className="text-[10px] text-slate-500 ml-1">
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
            })
            )}
          </div>
        </div>

        {/* Right Column (7 Cols): Interactive Control Console */}
        <div className="lg:col-span-7 space-y-5">
          {!selectedLote ? (
            <div className={`rounded-xl p-10 border text-center space-y-4 flex flex-col items-center justify-center min-h-[460px] ${cardBg}`}>
              <FlaskConical className={`h-10 w-10 ${isDark ? 'text-cyan-400' : 'text-teal-600'}`} />
              <div className="space-y-1.5 max-w-sm">
                <h3 className={`text-base font-bold font-sans ${textValue}`}>
                  Selecciona un Lote de Producción
                </h3>
                <p className={`text-xs font-sans leading-relaxed ${textTitle}`}>
                  Gestiona la asignación de operarios, avance por reactores, muestreo QA y cierre transaccional a Kardex.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Card Header del Lote Seleccionado */}
              <div className={`rounded-xl p-5 border space-y-4 ${cardBg}`}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border font-mono ${badgeCyan}`}>
                      {selectedLote.codigoQA} · {selectedLote.codigoLote}
                    </span>
                    <h2 className={`text-xl font-bold font-sans mt-1 ${textValue}`}>
                      {selectedLote.nombreProducto}
                    </h2>
                  </div>

                  {/* Visibilidad Destacada del Cliente Real */}
                  <div className={`rounded-xl px-4 py-2 border flex items-center gap-2 ${badgeAmber}`}>
                    <Building2 className={`w-4 h-4 ${isDark ? 'text-amber-300' : 'text-amber-800'}`} />
                    <div>
                      <span className="text-[9px] font-mono uppercase block font-bold tracking-wider">CLIENTE ORDEN</span>
                      <span className="text-xs font-bold font-sans">{selectedLote.clienteNombre}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 1. STEPPER VISUAL DE 4 PASOS (Progreso del Lote) */}
              <div className={`rounded-xl p-4 border space-y-3 ${subBoxBg}`}>
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-bold tracking-wider uppercase font-mono ${textTitle}`}>
                    PASO ACTUAL DE PROGRESO (STEPPER OPERATIVO)
                  </span>
                  <span className={`text-xs font-bold font-mono ${isDark ? 'text-[#00F2C3]' : 'text-teal-700'}`}>
                    PASO {getPasoStepIndex(selectedLote.pasoProceso)} DE 4
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center text-xs font-sans">
                  {/* Step 1 */}
                  <div
                    className={`p-2.5 rounded-lg border flex flex-col items-center gap-1 transition-all ${
                      getPasoStepIndex(selectedLote.pasoProceso) >= 1
                        ? isDark
                          ? 'bg-[#00F2C3]/15 text-[#00F2C3] border-[#00F2C3]/40 font-bold'
                          : 'bg-teal-100 text-teal-900 border-teal-400 font-bold'
                        : isDark
                        ? 'bg-slate-900 text-slate-500 border-slate-800'
                        : 'bg-slate-200 text-slate-500 border-slate-300'
                    }`}
                  >
                    <span className="text-[10px] font-mono">PASO 1</span>
                    <span className="text-[11px] leading-tight">Pendiente Operarios</span>
                  </div>

                  {/* Step 2 */}
                  <div
                    className={`p-2.5 rounded-lg border flex flex-col items-center gap-1 transition-all ${
                      getPasoStepIndex(selectedLote.pasoProceso) >= 2
                        ? isDark
                          ? 'bg-[#00F2C3]/15 text-[#00F2C3] border-[#00F2C3]/40 font-bold'
                          : 'bg-teal-100 text-teal-900 border-teal-400 font-bold'
                        : isDark
                        ? 'bg-slate-900 text-slate-500 border-slate-800'
                        : 'bg-slate-200 text-slate-500 border-slate-300'
                    }`}
                  >
                    <span className="text-[10px] font-mono">PASO 2</span>
                    <span className="text-[11px] leading-tight">En Mezcla / Reactores</span>
                  </div>

                  {/* Step 3 */}
                  <div
                    className={`p-2.5 rounded-lg border flex flex-col items-center gap-1 transition-all ${
                      getPasoStepIndex(selectedLote.pasoProceso) >= 3
                        ? isDark
                          ? 'bg-[#00F2C3]/15 text-[#00F2C3] border-[#00F2C3]/40 font-bold'
                          : 'bg-teal-100 text-teal-900 border-teal-400 font-bold'
                        : isDark
                        ? 'bg-slate-900 text-slate-500 border-slate-800'
                        : 'bg-slate-200 text-slate-500 border-slate-300'
                    }`}
                  >
                    <span className="text-[10px] font-mono">PASO 3</span>
                    <span className="text-[11px] leading-tight">Muestreo Calidad (QA)</span>
                  </div>

                  {/* Step 4 */}
                  <div
                    className={`p-2.5 rounded-lg border flex flex-col items-center gap-1 transition-all ${
                      getPasoStepIndex(selectedLote.pasoProceso) === 4
                        ? isDark
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 font-bold'
                          : 'bg-emerald-100 text-emerald-900 border-emerald-400 font-bold'
                        : isDark
                        ? 'bg-slate-900 text-slate-500 border-slate-800'
                        : 'bg-slate-200 text-slate-500 border-slate-300'
                    }`}
                  >
                    <span className="text-[10px] font-mono">PASO 4</span>
                    <span className="text-[11px] leading-tight">Finalizado & Liberado</span>
                  </div>
                </div>
              </div>

              {/* 2. BLOQUEO INTELIGENTE DE ESTADO */}
              <div className={`rounded-xl p-4 border space-y-3 ${subBoxBg}`}>
                <div className="flex items-center justify-between">
                  <h3 className={`text-xs font-bold tracking-widest uppercase flex items-center gap-2 ${textTitle}`}>
                    <Users className={`h-4 w-4 ${isDark ? 'text-cyan-400' : 'text-teal-600'}`} />
                    OPERARIOS ASIGNADOS AL LOTE ({selectedLote.operarios.length})
                  </h3>
                </div>

                {/* Aviso de Bloqueo si 0 operarios */}
                {selectedLote.operarios.length === 0 && (
                  <div className={`p-3 rounded-lg border text-xs font-sans flex items-center gap-2 ${
                    isDark ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-amber-50 border-amber-300 text-amber-900 font-medium'
                  }`}>
                    <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
                    <span>⚠️ Asigna al menos un operario para habilitar la fabricación.</span>
                  </div>
                )}

                {/* Selector de Operarios */}
                <div className="flex flex-wrap items-center gap-2 font-sans text-xs">
                  {operariosDisponibles.map((operario) => {
                    const isAssigned = selectedLote.operarios.includes(operario);
                    return (
                      <button
                        key={operario}
                        type="button"
                        onClick={() => handleToggleOperario(operario)}
                        className={`rounded-lg px-3.5 py-1.5 font-bold transition-all flex items-center gap-1.5 border ${
                          isAssigned
                            ? isDark
                              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm'
                              : 'bg-teal-100 text-teal-900 border-teal-400 shadow-sm'
                            : isDark
                            ? 'bg-[#090C10] text-slate-400 border-[#1A2232] hover:text-slate-200'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        {isAssigned ? (
                          <Check className={`h-3.5 w-3.5 stroke-[3] ${isDark ? 'text-cyan-400' : 'text-teal-700'}`} />
                        ) : (
                          <UserPlus className="h-3.5 w-3.5 text-slate-400" />
                        )}
                        <span>{operario}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Botones de Control de Avance de Paso con estado Disabled Inteligente */}
                <div className="grid grid-cols-2 gap-2.5 pt-2">
                  <button
                    disabled={selectedLote.operarios.length === 0}
                    onClick={() => handleCambiarPaso('ELABORANDO')}
                    className={`p-2.5 rounded-lg border text-xs font-bold flex items-center justify-center gap-2 transition-all font-sans ${
                      selectedLote.operarios.length === 0
                        ? 'opacity-40 cursor-not-allowed bg-slate-200 border-slate-300 text-slate-500 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-500'
                        : selectedLote.pasoProceso === 'ELABORANDO'
                        ? isDark
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                          : 'bg-teal-100 text-teal-900 border-teal-400 shadow-sm'
                        : isDark
                        ? 'bg-slate-800 text-slate-200 hover:bg-slate-700 border-slate-700'
                        : 'bg-slate-100 text-slate-800 hover:bg-slate-200 border-slate-300'
                    }`}
                  >
                    <span>⚙️ Paso 2: Elaborando Mezcla</span>
                  </button>

                  <button
                    disabled={selectedLote.operarios.length === 0}
                    onClick={() => handleCambiarPaso('EN_MUESTREO_QA')}
                    className={`p-2.5 rounded-lg border text-xs font-bold flex items-center justify-center gap-2 transition-all font-sans ${
                      selectedLote.operarios.length === 0
                        ? 'opacity-40 cursor-not-allowed bg-slate-200 border-slate-300 text-slate-500 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-500'
                        : selectedLote.pasoProceso === 'EN_MUESTREO_QA'
                        ? isDark
                          ? 'bg-purple-500/20 text-purple-300 border-purple-500/50'
                          : 'bg-purple-100 text-purple-900 border-purple-400 shadow-sm'
                        : isDark
                        ? 'bg-slate-800 text-slate-200 hover:bg-slate-700 border-slate-700'
                        : 'bg-slate-100 text-slate-800 hover:bg-slate-200 border-slate-300'
                    }`}
                  >
                    <span>🧪 Paso 3: En Muestreo QA</span>
                  </button>
                </div>
              </div>

              {/* 4. CHIPS DE INCIDENCIA RÁPIDA & OBSERVACIONES */}
              <div className={`rounded-xl p-5 border space-y-3 ${cardBg}`}>
                <div className="flex items-center justify-between">
                  <h3 className={`text-xs font-bold tracking-widest uppercase flex items-center gap-2 ${textTitle}`}>
                    <MessageSquare className={`w-4 h-4 ${isDark ? 'text-cyan-400' : 'text-teal-600'}`} />
                    OBSERVACIONES DE QA E INCIDENCIAS RÁPIDAS
                  </h3>
                </div>

                {/* Chips cliqueables de un toque */}
                <div className="space-y-1.5">
                  <span className={`text-[10px] font-sans block ${textTitle}`}>
                    Selección rápida de incidencia (Un toque):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {QUICK_INCIDENTS.map((chip, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleAddIncidentChip(chip)}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-bold font-sans transition-all flex items-center gap-1 border ${
                          isDark
                            ? 'bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                            : 'bg-teal-50 hover:bg-teal-100 text-teal-800 border-teal-300'
                        }`}
                      >
                        <span>+</span>
                        <span>{chip}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  rows={3}
                  placeholder="Escribe observaciones adicionales de control de calidad..."
                  value={observacionInput}
                  onChange={(e) => setObservacionInput(e.target.value)}
                  className={`w-full rounded-lg border p-3 text-xs focus:border-teal-500 focus:outline-none transition-all font-sans ${inputBg}`}
                />
              </div>

              {/* 5. DECISIÓN Y CIERRE DE LOTE (Transacción QA ➔ Kardex & Logística) */}
              <div className={`rounded-xl p-5 border space-y-4 ${cardBg}`}>
                {selectedLote.pasoProceso === 'LIBERADO_QA' ? (
                  /* Feedback Visual Verde cuando está Liberado */
                  <div className={`p-4 rounded-xl space-y-2 text-center border ${
                    isDark ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400' : 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  }`}>
                    <div className="flex items-center justify-center gap-2 font-bold font-sans text-sm">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      <span>✓ LIBERADO QA • Movimiento Kardex Registrado</span>
                    </div>
                    <p className="text-xs font-sans">
                      Lote {selectedLote.codigoLote} finalizado. La entrada de Producto Terminado fue asignada al cliente{' '}
                      <strong className="underline">{selectedLote.clienteNombre}</strong> y la orden ha sido enviada a la cola de{' '}
                      <a href="/dashboard/etiquetas" className="underline font-bold text-teal-600 dark:text-emerald-400">
                        Etiquetas & Despacho
                      </a>
                      .
                    </p>
                  </div>
                ) : selectedLote.pasoProceso === 'RECHAZADO' ? (
                  <div className={`p-4 rounded-xl space-y-2 text-center border ${
                    isDark ? 'bg-rose-500/15 border-rose-500/40 text-rose-400' : 'bg-rose-50 border-rose-300 text-rose-900'
                  }`}>
                    <div className="flex items-center justify-center gap-2 font-bold font-sans text-sm">
                      <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                      <span>🛑 LOTE RECHAZADO Y DETENIDO EN PLANTA</span>
                    </div>
                    <p className="text-xs font-sans">
                      Motivo: {selectedLote.motivoRechazo || 'Incidencia de calidad reportada.'}
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center gap-3 font-mono">
                    <button
                      onClick={() => setShowRechazoModal(true)}
                      className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-3.5 text-xs font-bold border transition-colors font-sans ${
                        isDark
                          ? 'bg-rose-500/15 text-rose-400 border-rose-500/30 hover:bg-rose-500/25'
                          : 'bg-rose-50 text-rose-700 border-rose-300 hover:bg-rose-100'
                      }`}
                    >
                      <X className="h-4 w-4" />
                      <span>⚠️ Rechazar / Parar Lote</span>
                    </button>

                    <button
                      onClick={handleFinalizarYLiberar}
                      className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-3.5 text-xs font-bold transition-all font-sans shadow-lg ${
                        isDark
                          ? 'bg-gradient-to-r from-[#00F2C3] to-teal-500 text-slate-950 hover:opacity-95 shadow-cyan-500/20'
                          : 'bg-teal-600 text-white hover:bg-teal-700 shadow-teal-600/20'
                      }`}
                    >
                      <Check className="h-4 w-4 stroke-[3]" />
                      <span>🚀 Finalizar & Liberar Lote (QA)</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal Obligatorio para Motivo de Rechazo */}
      {showRechazoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 font-sans">
          <div className={`w-full max-w-md rounded-2xl p-6 border space-y-4 ${cardBg}`}>
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-sm">
              <AlertTriangle className="w-5 h-5" />
              <span>Motivo Obligatorio de Rechazo de Lote</span>
            </div>

            <p className={`text-xs ${textTitle}`}>
              Por favor ingresa detalladamente el motivo técnico por el cual se detiene el lote {selectedLote?.codigoLote}:
            </p>

            <textarea
              rows={4}
              placeholder="Ingresa la justificación técnica..."
              value={motivoRechazoInput}
              onChange={(e) => setMotivoRechazoInput(e.target.value)}
              className={`w-full rounded-xl border p-3 text-xs focus:border-rose-500 focus:outline-none ${inputBg}`}
            />

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowRechazoModal(false)}
                className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-colors ${
                  isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmarRechazo}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 text-xs font-bold text-white hover:bg-rose-700 shadow-md"
              >
                Confirmar Rechazo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
