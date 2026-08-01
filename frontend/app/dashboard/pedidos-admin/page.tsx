'use client';

import React, { useState, useMemo } from 'react';
import {
  Inbox,
  Search,
  Calendar,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Building2,
  Beaker,
  Check,
  X,
  AlertTriangle,
  ArrowRight,
  Send,
  PackageCheck,
  TrendingUp,
  FileSpreadsheet,
} from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';
import { FORMULAS_MAESTRAS_REALES } from '@/lib/formulasData';

export type EstadoPedidoType = 'NUEVO' | 'APROBADO_PLANTA' | 'RECHAZADO';

export interface PedidoAdminUI {
  id: string;
  codigoOrden: string; // ej. #PED-9044
  clienteNombre: string;
  productoNombre: string;
  cantidadSolicitada: string;
  formulaAsociada: string;
  fechaIngreso: string;
  fechaPrometida: string;
  estado: EstadoPedidoType;
  observacionesAdmin?: string;
  motivoDevolucion?: string;
}

export default function PedidosAdminPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState<string>('TODOS');
  const [filterFecha, setFilterFecha] = useState<'HOY' | 'SEMANA' | 'TODOS'>('TODOS');
  const [selectedPedido, setSelectedPedido] = useState<PedidoAdminUI | null>(null);
  const [motivoDevolucionInput, setMotivoDevolucionInput] = useState('');
  const [showDevolucionModal, setShowDevolucionModal] = useState(false);

  const [pedidos, setPedidos] = useState<PedidoAdminUI[]>([
    {
      id: 'ped-1',
      codigoOrden: '#PED-9044',
      clienteNombre: 'ÑAUPARI SAC',
      productoNombre: 'CREMA MUSCULAR MENTOLADA',
      cantidadSolicitada: '150.00 KG',
      formulaAsociada: 'FÓRMULA CREMA MUSCULAR MENTOLADA v2',
      fechaIngreso: '2026-08-01 08:15',
      fechaPrometida: '2026-08-03',
      estado: 'NUEVO',
      observacionesAdmin: 'Orden prioritaria para distribución en farmacias.',
    },
    {
      id: 'ped-2',
      codigoOrden: '#PED-9045',
      clienteNombre: 'ALFALION PERÚ',
      productoNombre: 'SERUM DE SALMON - ALFALION',
      cantidadSolicitada: '1,000.00 KG',
      formulaAsociada: 'FÓRMULA INDUSTRIAL SERUM SALMÓN',
      fechaIngreso: '2026-08-01 09:00',
      fechaPrometida: '2026-08-04',
      estado: 'NUEVO',
      observacionesAdmin: 'Requiere empaque en frascos cóncavos ámbar.',
    },
    {
      id: 'ped-3',
      codigoOrden: '#PED-9046',
      clienteNombre: 'AUSTIN COSMETICS',
      productoNombre: 'SHAMPOO DE BATANA',
      cantidadSolicitada: '500.00 L',
      formulaAsociada: 'RECETA SHAMPOO BATANA ORGÁNICO',
      fechaIngreso: '2026-08-01 09:30',
      fechaPrometida: '2026-08-05',
      estado: 'NUEVO',
      observacionesAdmin: 'Verificar nivel de viscosidad en muestras.',
    },
    {
      id: 'ped-4',
      codigoOrden: '#PED-9041',
      clienteNombre: 'GEYMA BIOTECH',
      productoNombre: 'CREMA CÚRCUMA Y MENTOL',
      cantidadSolicitada: '250.00 KG',
      formulaAsociada: 'FÓRMULA CÚRCUMA INDUSTRIAL',
      fechaIngreso: '2026-07-31 15:40',
      fechaPrometida: '2026-08-02',
      estado: 'APROBADO_PLANTA',
      observacionesAdmin: 'Aprobado y transferido a Planta.',
    },
    {
      id: 'ped-5',
      codigoOrden: '#PED-9040',
      clienteNombre: 'JHON CANTO INDUSTRIAL',
      productoNombre: 'DETERGENTE MULTIUSOS INDUSTRIAL',
      cantidadSolicitada: '2,500.00 L',
      formulaAsociada: 'FÓRMULA DETERGENTE MULTIUSOS PLANTA',
      fechaIngreso: '2026-07-30 11:20',
      fechaPrometida: '2026-08-01',
      estado: 'APROBADO_PLANTA',
      observacionesAdmin: 'Transferido a Producción en Lote LOTE-000039.',
    },
    {
      id: 'ped-6',
      codigoOrden: '#PED-9038',
      clienteNombre: 'LUIS MARIN PHARMA',
      productoNombre: 'GEL DESINFECTANTE DE MANOS',
      cantidadSolicitada: '800.00 L',
      formulaAsociada: 'FÓRMULA GEL 70% ALCOHOL',
      fechaIngreso: '2026-07-29 14:10',
      fechaPrometida: '2026-07-31',
      estado: 'RECHAZADO',
      motivoDevolucion: 'Falta de insumo Alcohol Isopropílico en Kardex central.',
    },
  ]);

  // Color Tokens adaptados para Tema Claro y Tema Oscuro
  const cardBg = isDark ? 'bg-[#0F141C] border-[#1A2232]' : 'bg-white border-slate-200 shadow-sm';
  const textTitle = isDark ? 'text-slate-400' : 'text-slate-600';
  const textValue = isDark ? 'text-white' : 'text-slate-900';
  const subBoxBg = isDark ? 'bg-[#151D2A] border-[#1A2232]' : 'bg-slate-50 border-slate-200';
  const inputBg = isDark
    ? 'bg-[#151D2A] border-[#1A2232] text-slate-200 placeholder-slate-500'
    : 'bg-white border-slate-300 text-slate-800 placeholder-slate-400';

  // 1. Métricas / KPIs calculados
  const metricas = useMemo(() => {
    const nuevosHoy = pedidos.filter((p) => p.fechaIngreso.startsWith('2026-08-01') && p.estado === 'NUEVO').length;
    const pendientes = pedidos.filter((p) => p.estado === 'NUEVO').length;
    const enviadosPlanta = pedidos.filter((p) => p.estado === 'APROBADO_PLANTA').length;
    return { nuevosHoy, pendientes, enviadosPlanta };
  }, [pedidos]);

  // Filtros aplicados
  const pedidosFiltrados = useMemo(() => {
    return pedidos.filter((ped) => {
      const matchSearch =
        ped.codigoOrden.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ped.clienteNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ped.productoNombre.toLowerCase().includes(searchTerm.toLowerCase());

      const matchEstado =
        filterEstado === 'TODOS' ? true : ped.estado === filterEstado;

      const matchFecha =
        filterFecha === 'TODOS'
          ? true
          : filterFecha === 'HOY'
          ? ped.fechaIngreso.startsWith('2026-08-01')
          : true;

      return matchSearch && matchEstado && matchFecha;
    });
  }, [pedidos, searchTerm, filterEstado, filterFecha]);

  // Acción 1: Aprobar & Mandar a Producción con Transmisión Real al Control de Producción & QA
  const handleAprobarYMandarAPlanta = async (ped: PedidoAdminUI) => {
    // 1. Actualizar estado local del pedido
    setPedidos((prev) =>
      prev.map((p) => (p.id === ped.id ? { ...p, estado: 'APROBADO_PLANTA' } : p))
    );

    // 2. Generar el Lote determinista en tiempo real para Control de Producción & QA
    const numClean = ped.codigoOrden.replace(/\D/g, '') || '9044';
    const codigoLote = `LOTE-00${numClean}`;
    const codigoQA = `QA-2026-${numClean}`;
    const loteId = `lote-ped-${numClean}`;

    const nuevoLoteObj = {
      id: loteId,
      codigoQA,
      nombreProducto: ped.productoNombre,
      codigoLote,
      clienteNombre: ped.clienteNombre,
      rendimiento: ped.cantidadSolicitada,
      mermaPercentage: '0.90%',
      operarios: [], // PENDIENTE DE ASIGNACIÓN
      fechaEnvio: new Date().toISOString().replace('T', ' ').substring(0, 16),
      pasoProceso: 'PENDIENTE_ASIGNACION',
      estado: 'PENDIENTE',
      observacionesQA: `Orden Aprobada desde Pedidos de Administración (${ped.codigoOrden}). Asignar operarios para iniciar fabricación.`,
      formula: FORMULAS_MAESTRAS_REALES[0].ingredientes,
    };

    // 3. Guardar en localStorage filtrando duplicados & emitir evento Broadcast real
    try {
      const existingLotesRaw = localStorage.getItem('quimicorp_produccion_lotes_custom');
      const existingLotes = existingLotesRaw ? JSON.parse(existingLotesRaw) : [];
      const filteredExisting = existingLotes.filter(
        (l: any) => l.codigoLote !== codigoLote && l.id !== loteId
      );
      const updatedLotes = [nuevoLoteObj, ...filteredExisting];
      localStorage.setItem('quimicorp_produccion_lotes_custom', JSON.stringify(updatedLotes));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.log('Error local storage broadcast:', e);
    }

    // 4. Intentar llamada al backend API
    try {
      await fetch('http://localhost:3001/api/v1/produccion/ordenes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formulaId: '1b8f4f30-80bc-4d89-[#00F2C3]',
          cantidadPlanificada: parseFloat(ped.cantidadSolicitada) || 150,
          supervisorId: 'sup-1',
          clienteNombre: ped.clienteNombre,
        }),
      });
    } catch (e) {
      console.log('Backend sync order:', e);
    }

    alert(
      `🚀 ¡ORDEN ${ped.codigoOrden} APROBADA Y TRANSFERIDA A PLANTA!\n\n` +
      `- Lote Generado: ${nuevoLoteObj.codigoLote} (${nuevoLoteObj.codigoQA})\n` +
      `- Cliente: ${ped.clienteNombre}\n` +
      `- Producto: ${ped.productoNombre} (${ped.cantidadSolicitada})\n` +
      `- Estado en Planta: 'PENDIENTE_ASIGNACION' (Paso 1/4)\n\n` +
      `El lote ya se encuentra visible en la pantalla de Control de Producción & QA (/dashboard/produccion-qa).`
    );
  };

  // Acción 2: Abrir Devolución a Admin
  const handleOpenDevolucion = (ped: PedidoAdminUI) => {
    setSelectedPedido(ped);
    setMotivoDevolucionInput('');
    setShowDevolucionModal(true);
  };

  // Confirmar Devolución por Falta de Stock
  const handleConfirmarDevolucion = () => {
    if (!selectedPedido) return;
    if (!motivoDevolucionInput.trim()) {
      alert('Debes ingresar el motivo técnico de la devolución (ej. insumos faltantes).');
      return;
    }

    setPedidos((prev) =>
      prev.map((p) =>
        p.id === selectedPedido.id
          ? {
              ...p,
              estado: 'RECHAZADO',
              motivoDevolucion: motivoDevolucionInput,
            }
          : p
      )
    );

    setShowDevolucionModal(false);
    alert(
      `⚠️ Orden ${selectedPedido.codigoOrden} Devuelta a Administración.\n` +
      `- Notificación enviada a Ventas/Administración con el motivo: "${motivoDevolucionInput}"`
    );
  };

  return (
    <div className="space-y-6 font-mono min-h-screen">
      {/* Header Titular */}
      <div className={`flex flex-wrap items-center justify-between gap-4 border-b pb-4 ${isDark ? 'border-slate-800/80' : 'border-slate-200'}`}>
        <div>
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-xl border ${isDark ? 'bg-cyan-500/10 border-cyan-500/30 text-[#00F2C3]' : 'bg-teal-50 border-teal-300 text-teal-700'}`}>
              <Inbox className="w-5 h-5" />
            </div>
            <div>
              <h2 className={`text-lg font-bold font-sans flex items-center gap-2 ${textValue}`}>
                <span>Pedidos Entrantes de Administración</span>
                <span className={`text-[10px] px-2 py-0.5 rounded border font-mono uppercase font-bold ${
                  isDark ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30' : 'bg-teal-50 text-teal-800 border-teal-300'
                }`}>
                  RECEPCIÓN DE PLANTA
                </span>
              </h2>
              <p className={`text-xs font-sans ${textTitle}`}>
                Revisión, validación de stock y autorización de órdenes comerciales enviadas desde las oficinas para su pase a producción.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border font-mono ${
            isDark ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-800 border-emerald-300'
          }`}>
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            SINK ADMIN-PLANTA ACTIVO
          </span>
        </div>
      </div>

      {/* 1. BARRA DE MÉTRICAS / KPIS SUPERIOR */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* KPI 1: Nuevos Pedidos Hoy */}
        <div className={`rounded-xl p-5 border space-y-2 relative overflow-hidden transition-all ${cardBg}`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold font-sans ${textTitle}`}>NUEVOS PEDIDOS HOY</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30 font-mono animate-pulse">
              + EN VIVO
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className={`text-3xl font-black font-mono ${textValue}`}>
              {metricas.nuevosHoy}
            </span>
            <span className="text-xs text-slate-500 font-sans">Órdenes recibidas</span>
          </div>
          <div className={`h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
            <div className="h-full bg-cyan-500 rounded-full w-3/4" />
          </div>
        </div>

        {/* KPI 2: Pendientes de Aprobación */}
        <div className={`rounded-xl p-5 border space-y-2 relative overflow-hidden transition-all ${cardBg}`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold font-sans ${textTitle}`}>PENDIENTES DE APROBACIÓN</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className={`text-3xl font-black font-mono ${isDark ? 'text-amber-400' : 'text-amber-800'}`}>
              {metricas.pendientes}
            </span>
            <span className="text-xs text-amber-600 font-sans font-bold">Requiere acción Planta</span>
          </div>
          <div className={`h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
            <div className="h-full bg-amber-500 rounded-full w-1/2" />
          </div>
        </div>

        {/* KPI 3: Enviados a Planta */}
        <div className={`rounded-xl p-5 border space-y-2 relative overflow-hidden transition-all ${cardBg}`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold font-sans ${textTitle}`}>ENVIADOS A PLANTA</span>
            <PackageCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className={`text-3xl font-black font-mono ${isDark ? 'text-emerald-400' : 'text-emerald-800'}`}>
              {metricas.enviadosPlanta}
            </span>
            <span className="text-xs text-emerald-600 font-sans font-bold">En cola de Producción</span>
          </div>
          <div className={`h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
            <div className="h-full bg-emerald-500 rounded-full w-full" />
          </div>
        </div>
      </div>

      {/* 4. FILTROS RÁPIDOS Y BUSCADOR */}
      <div className={`rounded-xl p-4 border flex flex-wrap items-center justify-between gap-4 ${cardBg}`}>
        {/* Buscador */}
        <div className="flex-1 min-w-[260px] relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por N° Orden (#PED-9044), Cliente o Producto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full rounded-xl border pl-9 pr-4 py-2 text-xs focus:border-teal-500 focus:outline-none transition-all font-sans ${inputBg}`}
          />
        </div>

        {/* Filtro Estado */}
        <div className="flex items-center gap-1 font-sans text-xs">
          <Filter className="w-4 h-4 text-slate-400 mr-1" />
          <button
            onClick={() => setFilterEstado('TODOS')}
            className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
              filterEstado === 'TODOS'
                ? isDark
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                  : 'bg-teal-100 text-teal-900 border-teal-400'
                : isDark
                ? 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilterEstado('NUEVO')}
            className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
              filterEstado === 'NUEVO'
                ? isDark
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-amber-100 text-amber-900 border-amber-400'
                : isDark
                ? 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100'
            }`}
          >
            Nuevos ({pedidos.filter((p) => p.estado === 'NUEVO').length})
          </button>
          <button
            onClick={() => setFilterEstado('APROBADO_PLANTA')}
            className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
              filterEstado === 'APROBADO_PLANTA'
                ? isDark
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-emerald-100 text-emerald-900 border-emerald-400'
                : isDark
                ? 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100'
            }`}
          >
            Enviados a Planta
          </button>
        </div>

        {/* Filtro Fecha */}
        <div className="flex items-center gap-1 font-sans text-xs">
          <Calendar className="w-4 h-4 text-slate-400 mr-1" />
          <button
            onClick={() => setFilterFecha('TODOS')}
            className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
              filterFecha === 'TODOS'
                ? isDark
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                  : 'bg-teal-100 text-teal-900 border-teal-400'
                : isDark
                ? 'bg-slate-900 text-slate-400 border-slate-800'
                : 'bg-white text-slate-600 border-slate-300'
            }`}
          >
            Todas Fechas
          </button>
          <button
            onClick={() => setFilterFecha('HOY')}
            className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
              filterFecha === 'HOY'
                ? isDark
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                  : 'bg-teal-100 text-teal-900 border-teal-400'
                : isDark
                ? 'bg-slate-900 text-slate-400 border-slate-800'
                : 'bg-white text-slate-600 border-slate-300'
            }`}
          >
            Hoy
          </button>
        </div>
      </div>

      {/* 2. LISTA DE PEDIDOS ENTRANTES (VISTA DE CARDS INTERACTIVAS) */}
      <div className="space-y-4">
        {pedidosFiltrados.length === 0 ? (
          <div className={`rounded-xl p-10 border text-center space-y-3 ${cardBg}`}>
            <Inbox className="w-10 h-10 text-slate-400 mx-auto" />
            <h4 className={`text-base font-bold font-sans ${textValue}`}>No hay pedidos entrantes que coincidan</h4>
            <p className={`text-xs font-sans ${textTitle}`}>Ajusta los filtros de búsqueda o el estado del pedido.</p>
          </div>
        ) : (
          pedidosFiltrados.map((ped) => {
            const isNuevo = ped.estado === 'NUEVO';
            const isAprobado = ped.estado === 'APROBADO_PLANTA';
            const isRechazado = ped.estado === 'RECHAZADO';

            return (
              <div
                key={ped.id}
                className={`rounded-xl p-5 border transition-all space-y-4 ${
                  isAprobado
                    ? isDark
                      ? 'bg-emerald-950/20 border-emerald-500/40'
                      : 'bg-emerald-50/70 border-emerald-300'
                    : isRechazado
                    ? isDark
                      ? 'bg-rose-950/20 border-rose-500/40'
                      : 'bg-rose-50/70 border-rose-300'
                    : cardBg
                }`}
              >
                {/* Line 1: Header N° Order + Client Badge + Status Badge */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold px-3 py-1 rounded-lg bg-teal-500/10 text-teal-700 dark:text-cyan-300 border border-teal-500/30 font-mono">
                      {ped.codigoOrden}
                    </span>

                    {/* Cliente */}
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/30 font-sans">
                      <Building2 className="w-3.5 h-3.5" />
                      {ped.clienteNombre}
                    </span>
                  </div>

                  {/* Estado del Pedido */}
                  <div>
                    {isNuevo && (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/40 font-sans flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-500" />
                        NUEVO · PENDIENTE PLANTA
                      </span>
                    )}
                    {isAprobado && (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/40 font-sans flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        APROBADO & ENVIADO A PLANTA
                      </span>
                    )}
                    {isRechazado && (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-800 dark:text-rose-300 border border-rose-500/40 font-sans flex items-center gap-1.5">
                        <XCircle className="w-3.5 h-3.5 text-rose-500" />
                        DEVUELTO A ADMIN
                      </span>
                    )}
                  </div>
                </div>

                {/* Line 2: Product Requested & Formula Info */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <div className="md:col-span-6 space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      PRODUCTO SOLICITADO & CANTIDAD
                    </span>
                    <h3 className={`text-base font-bold font-sans ${textValue}`}>
                      {ped.productoNombre}
                    </h3>
                    <p className="text-xs font-mono font-bold text-teal-700 dark:text-cyan-400">
                      CANTIDAD ORDEN: {ped.cantidadSolicitada}
                    </p>
                  </div>

                  <div className="md:col-span-6 space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      RECETA / FÓRMULA ASOCIADA Y ENTREGA
                    </span>
                    <div className="flex items-center gap-2 text-xs font-sans">
                      <Beaker className="w-4 h-4 text-teal-600 dark:text-cyan-400 shrink-0" />
                      <span className={`font-semibold ${textValue}`}>{ped.formulaAsociada}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-sans">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Prometido: <strong className={textValue}>{ped.fechaPrometida}</strong></span>
                      <span className="mx-1">·</span>
                      <span>Ingreso: {ped.fechaIngreso}</span>
                    </div>
                  </div>
                </div>

                {/* Observaciones de Administración */}
                {ped.observacionesAdmin && (
                  <div className={`p-3 rounded-lg border text-xs font-sans ${subBoxBg}`}>
                    <span className="font-bold text-slate-500 block text-[10px] uppercase">
                      Notas de Administración:
                    </span>
                    <span className={textValue}>{ped.observacionesAdmin}</span>
                  </div>
                )}

                {/* Motivo de Devolución si Aplica */}
                {ped.motivoDevolucion && (
                  <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs font-sans text-rose-800 dark:text-rose-300">
                    <span className="font-bold block text-[10px] uppercase text-rose-600">
                      Motivo de Devolución a Ventas:
                    </span>
                    <span>{ped.motivoDevolucion}</span>
                  </div>
                )}

                {/* 3. ACCIONES DEL SUPERVISOR EN LA PANTALLA */}
                {isNuevo && (
                  <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                    <button
                      onClick={() => handleOpenDevolucion(ped)}
                      className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-3 text-xs font-bold border transition-colors font-sans ${
                        isDark
                          ? 'bg-rose-500/15 text-rose-400 border-rose-500/30 hover:bg-rose-500/25'
                          : 'bg-rose-50 text-rose-700 border-rose-300 hover:bg-rose-100'
                      }`}
                    >
                      <AlertTriangle className="w-4 h-4" />
                      <span>⚠️ Devolver a Admin (Falta Stock/Insumos)</span>
                    </button>

                    <button
                      onClick={() => handleAprobarYMandarAPlanta(ped)}
                      className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-3 text-xs font-bold transition-all font-sans shadow-lg ${
                        isDark
                          ? 'bg-gradient-to-r from-[#00F2C3] to-teal-500 text-slate-950 hover:opacity-95 shadow-cyan-500/20'
                          : 'bg-teal-600 text-white hover:bg-teal-700 shadow-teal-600/20'
                      }`}
                    >
                      <Send className="w-4 h-4" />
                      <span>🚀 Aprobar & Mandar a Producción</span>
                    </button>
                  </div>
                )}

                {isAprobado && (
                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs font-sans text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
                    <span className="flex items-center gap-2 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Orden Aprobada. Lote activo en Control de Producción & QA.
                    </span>
                    <a
                      href="/dashboard/produccion-qa"
                      className="px-3 py-1 rounded bg-teal-600 text-white font-bold hover:bg-teal-700 transition-all flex items-center gap-1"
                    >
                      <span>Ir a Planta QA</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Modal Devolución por Falta de Stock / Insumos */}
      {showDevolucionModal && selectedPedido && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 font-sans">
          <div className={`w-full max-w-md rounded-2xl p-6 border space-y-4 ${cardBg}`}>
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-sm">
              <AlertTriangle className="w-5 h-5" />
              <span>Devolución a Administración: {selectedPedido.codigoOrden}</span>
            </div>

            <p className={`text-xs ${textTitle}`}>
              Indica detalladamente la causa técnica o insumo faltante en el Kardex para notificar a Ventas/Administración:
            </p>

            <textarea
              rows={4}
              placeholder="Ejemplo: Insumo LESS 70% insuficiente en Kardex (se requieren 120 KG para cumplir orden)..."
              value={motivoDevolucionInput}
              onChange={(e) => setMotivoDevolucionInput(e.target.value)}
              className={`w-full rounded-xl border p-3 text-xs focus:border-rose-500 focus:outline-none ${inputBg}`}
            />

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowDevolucionModal(false)}
                className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-colors ${
                  isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmarDevolucion}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 text-xs font-bold text-white hover:bg-rose-700 shadow-md"
              >
                Confirmar Devolución
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
