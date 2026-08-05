'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
  AlertTriangle,
  Send,
  PackageCheck,
  TrendingUp,
  ArrowRight,
  User,
  Phone,
  MapPin,
  FileText,
  CreditCard,
  X,
  RefreshCw,
  Zap,
} from 'lucide-react';
import { io } from 'socket.io-client';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/lib/ThemeContext';
import { useAuth } from '@/lib/AuthContext';

export interface InsumoValidacion {
  codigo: string;
  nombre: string;
  requerido: number;
  disponible: number;
  faltante: number;
  suficiente: boolean;
}

export interface StockValidacionInfo {
  stockCompleto: boolean;
  insumosFaltantesCount: number;
  detalles: InsumoValidacion[];
}

export interface PedidoComercialUI {
  id: string;
  codigoOrden: string;
  codigoRefAdmin?: string;
  clienteNombre: string;
  clienteRuc: string;
  contactoNombre?: string;
  contactoTelefono?: string;
  direccionDespacho?: string;
  repComercial?: string;
  condicionPago?: string;
  productoNombre: string;
  cantidadSolicitada: number | string;
  unidadMedida: string;
  lotesRequeridos: number;
  montoTotal: number;
  fechaPrometida: string;
  prioridad: 'URGENTE' | 'NORMAL' | 'PROGRAMADO';
  estado: 'NUEVO' | 'VALIDANDO' | 'APROBADO' | 'EN_PRODUCCION' | 'DEVUELTO';
  notasAdmin?: string;
  motivoDevolucion?: string;
  stockValidacion?: StockValidacionInfo;
}

export interface KpiMetrics {
  pedidosHoy: number;
  nuevos: number;
  aprobados: number;
  enProduccion: number;
  valorDelDia: number;
}

export default function PedidosAdminPage() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const router = useRouter();
  const isAdmin = user?.role === 'ADMINISTRACION';
  const isDark = theme === 'dark';

  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState<string>('TODOS');
  const [filterPrioridad, setFilterPrioridad] = useState<string>('TODAS');
  const [pedidos, setPedidos] = useState<PedidoComercialUI[]>([]);
  const [kpis, setKpis] = useState<KpiMetrics>({
    pedidosHoy: 4,
    nuevos: 2,
    aprobados: 1,
    enProduccion: 1,
    valorDelDia: 107670,
  });
  const [loading, setLoading] = useState<boolean>(true);

  // Modales
  const [selectedPedidoDevolucionModal, setSelectedPedidoDevolucionModal] = useState<PedidoComercialUI | null>(null);
  const [motivoDevolucionInput, setMotivoDevolucionInput] = useState('');
  const [selectedPedidoStockModal, setSelectedPedidoStockModal] = useState<PedidoComercialUI | null>(null);

  // 1. Cargar Datos del Backend
  const cargarDatos = async () => {
    try {
      setLoading(true);
      const savedToken = localStorage.getItem('quimicorp_jwt');
      const authHeader = savedToken ? { Authorization: `Bearer ${savedToken}` } : {};

      // KPIs
      const resKpis = await fetch('http://localhost:3001/api/v1/pedidos-admin/kpis', {
        headers: authHeader,
      });
      if (resKpis.ok) {
        const dataKpis = await resKpis.json();
        setKpis(dataKpis);
      }

      // Lista de Pedidos
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (filterEstado !== 'TODOS') params.append('estado', filterEstado);
      if (filterPrioridad !== 'TODAS') params.append('prioridad', filterPrioridad);

      const resPedidos = await fetch(`http://localhost:3001/api/v1/pedidos-admin?${params.toString()}`, {
        headers: authHeader,
      });
      if (resPedidos.ok) {
        const dataPedidos = await resPedidos.json();
        setPedidos(dataPedidos);
      }
    } catch (e) {
      console.log('Error fetching backend pedidos:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [searchTerm, filterEstado, filterPrioridad]);

  useEffect(() => {
    cargarDatos();

    // Polling automático cada 3s para reflejar cambios de estado de Planta en tiempo real sin F5
    const pollInterval = setInterval(() => {
      cargarDatos();
    }, 3000);

    const socket = io('http://localhost:3001', {
      transports: ['websocket', 'polling'],
    });

    socket.on('order:created_to_plant', () => cargarDatos());
    socket.on('order:status_updated', () => cargarDatos());
    socket.on('order:accepted_by_plant', () => cargarDatos());
    socket.on('order:devolucion', () => cargarDatos());

    return () => {
      clearInterval(pollInterval);
      socket.disconnect();
    };
  }, []);

  // 2. Acciones del Supervisor de Planta
  const handleAprobarPedido = async (pedido: PedidoComercialUI) => {
    try {
      const savedToken = localStorage.getItem('quimicorp_jwt');
      const authHeader = savedToken ? { Authorization: `Bearer ${savedToken}` } : {};

      // Registrar el nuevo lote de producción en el flujo de Control de Producción & QA
      const rawCustom = localStorage.getItem('quimicorp_produccion_lotes_custom');
      const prevLotes = rawCustom ? JSON.parse(rawCustom) : [];

      const nuevoLotePlanta = {
        id: pedido.id,
        codigoQA: `QA-${pedido.codigoOrden.replace('#', '')}`,
        nombreProducto: pedido.productoNombre,
        codigoLote: `LOTE-${pedido.codigoOrden.replace('#', '')}`,
        clienteNombre: pedido.clienteNombre,
        rendimiento: '99.5%',
        mermaPercentage: '0.5%',
        operarios: [],
        fechaEnvio: new Date().toISOString().split('T')[0],
        pasoProceso: 'PENDIENTE_ASIGNACION',
        estado: 'PENDIENTE',
        observacionesQA: pedido.notasAdmin || 'Orden aprobada y transferida desde Pedidos Entrantes.',
        formula: [
          { sku: 'QC-001', componente: 'Agua Desionizada', porcentaje: 85.0, pesoTeorico: 850 },
          { sku: 'QC-011', componente: 'Insumo Activo Principal', porcentaje: 15.0, pesoTeorico: 150 },
        ],
      };

      const updatedLotes = [nuevoLotePlanta, ...prevLotes];
      localStorage.setItem('quimicorp_produccion_lotes_custom', JSON.stringify(updatedLotes));

      // Actualizar estado en DB
      await fetch(`http://localhost:3001/api/v1/pedidos-admin/${pedido.id}/aprobar`, {
        method: 'POST',
        headers: authHeader,
      });

      // Redirigir directamente al panel de Control de Producción & QA
      router.push('/dashboard/produccion-qa');
    } catch (e) {
      console.log('Error aprobando pedido:', e);
      // Fallback local y redirección
      setPedidos((prev) =>
        prev.map((p) => (p.id === pedido.id ? { ...p, estado: 'APROBADO' } : p))
      );
      router.push('/dashboard/produccion-qa');
    }
  };

  const handleConfirmarDevolucion = async () => {
    if (!selectedPedidoDevolucionModal) return;
    if (!motivoDevolucionInput.trim()) {
      alert('Debes ingresar el motivo técnico de devolución a Administración.');
      return;
    }

    try {
      const savedToken = localStorage.getItem('quimicorp_jwt');
      await fetch(`http://localhost:3001/api/v1/pedidos-admin/${selectedPedidoDevolucionModal.id}/devolver`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(savedToken ? { Authorization: `Bearer ${savedToken}` } : {}),
        },
        body: JSON.stringify({ motivoDevolucion: motivoDevolucionInput }),
      });
    } catch (e) {
      console.log('Error devolviendo pedido:', e);
    }

    setPedidos((prev) =>
      prev.map((p) =>
        p.id === selectedPedidoDevolucionModal.id
          ? { ...p, estado: 'DEVUELTO', motivoDevolucion: motivoDevolucionInput }
          : p
      )
    );

    setSelectedPedidoDevolucionModal(null);
    setMotivoDevolucionInput('');
    alert(`⚠️ Orden ${selectedPedidoDevolucionModal.codigoOrden} devuelta a Administración.`);
  };

  // Color Tokens Industriales Oscuros / Claros con Alto Contraste
  const bgScreen = isDark ? 'bg-[#090C10]' : 'bg-slate-50';
  const cardBg = isDark ? 'bg-[#0F141C] border-[#1A2232]' : 'bg-white border-slate-300 shadow-sm';
  const textTitle = isDark ? 'text-slate-400' : 'text-slate-700 font-bold';
  const textValue = isDark ? 'text-white' : 'text-slate-900 font-black';
  const inputBg = isDark
    ? 'bg-[#151D2A] border-[#1A2232] text-slate-200 placeholder-slate-500'
    : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 shadow-sm';
  const badgeBoxBg = isDark ? 'bg-[#151D2A] text-slate-300 border-[#1A2232]' : 'bg-slate-200 text-slate-900 border-slate-300 font-bold';

  return (
    <div className={`space-y-6 font-mono min-h-screen p-2 ${bgScreen}`}>
      {/* ── BARRA SUPERIOR DE ESTADO PLC & PLANTA ── */}
      <div className={`flex flex-wrap items-center justify-between gap-4 border-b pb-4 ${isDark ? 'border-[#1A2232]' : 'border-slate-300'}`}>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xl font-bold font-sans">
            <h1 className={textValue}>Pedidos Entrantes</h1>
            <span className={`text-sm font-normal ${isDark ? 'text-slate-500' : 'text-slate-600 font-semibold'}`}>/ Recepción de Planta</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded font-bold ${isDark ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-emerald-100 text-emerald-950 border border-emerald-300'
            }`}>
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />

          </span>

          <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded font-bold ${isDark ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-amber-100 text-amber-950 border border-amber-300'
            }`}>
            <span className="h-2 w-2 rounded-full bg-amber-500" />
          </span>

          <span className={`px-3 py-1 rounded text-[11px] font-bold ${badgeBoxBg}`}>
            Lun, 03 ago. 2026 &nbsp;09:45 a. m.
          </span>

          <span className={`flex items-center gap-1.5 px-3 py-1 rounded font-bold uppercase tracking-wider text-[11px] ${isDark ? 'bg-teal-500/10 text-[#00F2C3] border border-teal-500/30' : 'bg-teal-100 text-teal-950 border border-teal-300'
            }`}>
            <Zap className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            SEMI-APROBACIÓN ACTIVO
          </span>
        </div>
      </div>

      {/* ── 1. MÉTRICAS SUPERIORES DINÁMICAS (KPI HEADER DE 5 CARDS) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* KPI 1: PEDIDOS HOY */}
        <div className={`rounded-xl p-4 border space-y-1 ${cardBg}`}>
          <span className={`text-[10px] uppercase tracking-widest block ${textTitle}`}>
            PEDIDOS HOY
          </span>
          <div className="flex items-baseline justify-between">
            <span className={`text-2xl font-black font-mono ${textValue}`}>
              {kpis.pedidosHoy}
            </span>
          </div>
          <span className={`text-[10px] block ${isDark ? 'text-slate-400' : 'text-slate-600 font-semibold'}`}>Total recibidos</span>
        </div>

        {/* KPI 2: NUEVOS */}
        <div className={`rounded-xl p-4 border space-y-1 ${cardBg}`}>
          <span className={`text-[10px] uppercase tracking-widest block ${textTitle}`}>
            NUEVOS
          </span>
          <div className="flex items-baseline justify-between">
            <span className={`text-2xl font-black font-mono ${isDark ? 'text-cyan-400' : 'text-cyan-800'}`}>
              {kpis.nuevos}
            </span>
          </div>
          <span className={`text-[10px] block font-bold ${isDark ? 'text-cyan-500' : 'text-cyan-900'}`}>Requiren acción</span>
        </div>

        {/* KPI 3: APROBADOS */}
        <div className={`rounded-xl p-4 border space-y-1 ${cardBg}`}>
          <span className={`text-[10px] uppercase tracking-widest block ${textTitle}`}>
            APROBADOS
          </span>
          <div className="flex items-baseline justify-between">
            <span className={`text-2xl font-black font-mono ${isDark ? 'text-emerald-400' : 'text-emerald-800'}`}>
              {kpis.aprobados}
            </span>
          </div>
          <span className={`text-[10px] block ${isDark ? 'text-slate-400' : 'text-slate-700 font-bold'}`}>En cola producción</span>
        </div>

        {/* KPI 4: EN PRODUCCIÓN */}
        <div className={`rounded-xl p-4 border space-y-1 ${cardBg}`}>
          <span className={`text-[10px] uppercase tracking-widest block ${textTitle}`}>
            EN PRODUCCIÓN
          </span>
          <div className="flex items-baseline justify-between">
            <span className={`text-2xl font-black font-mono ${isDark ? 'text-amber-400' : 'text-amber-800'}`}>
              {kpis.enProduccion}
            </span>
          </div>
          <span className={`text-[10px] block font-bold ${isDark ? 'text-amber-500' : 'text-amber-900'}`}>Actualmente activos</span>
        </div>

        {/* KPI 5: VALOR DEL DÍA */}
        <div className={`rounded-xl p-4 border space-y-1 ${cardBg} ${isDark ? 'border-teal-500/30 bg-teal-500/5' : 'border-teal-300 bg-teal-50'
          }`}>
          <span className={`text-[10px] font-bold uppercase tracking-widest block ${isDark ? 'text-teal-400' : 'text-teal-900'}`}>
            VALOR DEL DÍA
          </span>
          <div className="flex items-baseline justify-between">
            <span className={`text-xl font-black font-mono ${isDark ? 'text-[#00F2C3]' : 'text-teal-900'}`}>
              S/ {kpis.valorDelDia.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <span className={`text-[10px] block ${isDark ? 'text-slate-400' : 'text-slate-700 font-bold'}`}>Órdenes comerciales</span>
        </div>
      </div>

      {/* ── 2. BUSCADOR Y FILTROS REACTIVOS ── */}
      <div className={`rounded-xl p-3 border flex flex-wrap items-center justify-between gap-3 ${cardBg}`}>
        {/* Buscador */}
        <div className="flex-1 min-w-[260px] relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Buscar por Nº, cliente o producto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full rounded-lg border pl-9 pr-3 py-1.5 text-xs focus:border-cyan-500 focus:outline-none transition-all font-sans ${inputBg}`}
          />
        </div>

        {/* Filtros por Estado */}
        <div className="flex flex-wrap items-center gap-1 font-sans text-xs">
          {['TODOS', 'NUEVO', 'APROBADO', 'EN_PRODUCCION', 'DEVUELTO'].map((st) => {
            const labelMap: Record<string, string> = {
              TODOS: `Todos (${pedidos.length})`,
              NUEVO: `Nuevos (${pedidos.filter((p) => p.estado === 'NUEVO').length})`,
              APROBADO: `Aprobados (${pedidos.filter((p) => p.estado === 'APROBADO').length})`,
              EN_PRODUCCION: `Producción (${pedidos.filter((p) => p.estado === 'EN_PRODUCCION').length})`,
              DEVUELTO: `Devueltos (${pedidos.filter((p) => p.estado === 'DEVUELTO').length})`,
            };

            const isSelected = filterEstado === st;
            return (
              <button
                key={st}
                onClick={() => setFilterEstado(st)}
                className={`px-3 py-1 rounded-lg border text-xs font-bold transition-all ${isSelected
                    ? isDark
                      ? 'bg-teal-500/20 text-[#00F2C3] border-teal-500/40'
                      : 'bg-teal-600 text-white border-teal-700 shadow-md font-extrabold'
                    : isDark
                      ? 'bg-[#151D2A] text-slate-400 border-[#1A2232] hover:text-slate-200'
                      : 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200 font-semibold'
                  }`}
              >
                {labelMap[st]}
              </button>
            );
          })}
        </div>

        {/* Filtros por Prioridad */}
        <div className={`flex items-center gap-1 font-sans text-xs border-l pl-3 ${isDark ? 'border-slate-800' : 'border-slate-300'}`}>
          <span className={`text-[10px] uppercase font-bold mr-1 ${isDark ? 'text-slate-500' : 'text-slate-800'}`}>PRIORIDAD:</span>
          {['TODAS', 'URGENTE', 'NORMAL', 'PROGRAMADO'].map((pr) => {
            const isSelected = filterPrioridad === pr;
            return (
              <button
                key={pr}
                onClick={() => setFilterPrioridad(pr)}
                className={`px-2.5 py-1 rounded border text-[11px] font-bold transition-all ${isSelected
                    ? isDark
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                      : 'bg-cyan-700 text-white border-cyan-800 shadow-md font-extrabold'
                    : isDark
                      ? 'bg-[#151D2A] text-slate-400 border-[#1A2232] hover:text-slate-200'
                      : 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200 font-semibold'
                  }`}
              >
                {pr === 'TODAS' ? 'Todas' : `• ${pr}`}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 3. LISTA DE CARDS DE PEDIDOS ENTRANTES (VISTA DE 3 COLUMNAS) ── */}
      <div className="space-y-4">
        {loading ? (
          <div className={`rounded-xl p-10 border text-center ${cardBg}`}>
            <RefreshCw className="w-6 h-6 text-cyan-400 animate-spin mx-auto mb-2" />
            <span className="text-xs text-slate-400 font-sans">Cargando pedidos comerciales...</span>
          </div>
        ) : pedidos.length === 0 ? (
          <div className={`rounded-xl p-10 border text-center space-y-2 ${cardBg}`}>
            <Inbox className="w-8 h-8 text-slate-500 mx-auto" />
            <h4 className="text-sm font-bold text-white font-sans">No hay pedidos entrantes que coincidan</h4>
            <p className="text-xs text-slate-400 font-sans">Ajusta los filtros de búsqueda o el estado del pedido.</p>
          </div>
        ) : (
          pedidos.map((ped) => {
            const isNuevo = ped.estado === 'NUEVO';
            const isAprobado = ped.estado === 'APROBADO' || ped.estado === 'EN_PRODUCCION';
            const isDevuelto = ped.estado === 'DEVUELTO';

            const stockInfo = ped.stockValidacion || {
              stockCompleto: true,
              insumosFaltantesCount: 0,
              detalles: [
                { codigo: 'QC-011', nombre: 'Soda Cáustica 50%', requerido: 15, disponible: 120, suficiente: true },
                { codigo: 'QC-003', nombre: 'LESS 70%', requerido: 45, disponible: 80, suficiente: true },
                { codigo: 'QC-088', nombre: 'Mentol Cristalino', requerido: 12, disponible: 50, suficiente: true },
                { codigo: 'QC-001', nombre: 'Agua Desionizada', requerido: 200, disponible: 1500, suficiente: true },
              ],
            };

            const tieneFaltantes = !stockInfo.stockCompleto;

            return (
              <div
                key={ped.id}
                className={`rounded-xl border transition-all p-5 space-y-4 ${cardBg} ${isNuevo
                    ? isDark ? 'border-amber-500/30' : 'border-amber-400 shadow-md'
                    : isAprobado
                      ? isDark ? 'border-emerald-500/30' : 'border-emerald-400 shadow-md'
                      : isDark ? 'border-rose-500/30' : 'border-rose-400 shadow-md'
                  }`}
              >
                {/* ── HEADER SUPERIOR DE LA CARD ── */}
                <div className={`flex flex-wrap items-center justify-between gap-3 border-b pb-3 ${isDark ? 'border-slate-800/80' : 'border-slate-300'}`}>
                  <div className="flex flex-wrap items-center gap-2">
                    {/* N° Orden */}
                    <span className={`text-xs font-black font-mono px-2.5 py-0.5 rounded border ${isDark ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' : 'bg-cyan-100 text-cyan-950 border-cyan-300 font-bold'
                      }`}>
                      {ped.codigoOrden}
                    </span>

                    {/* Codigo Ref Admin */}
                    {ped.codigoRefAdmin && (
                      <span className={`text-[10px] font-mono ${isDark ? 'text-slate-500' : 'text-slate-700 font-bold'}`}>
                        {ped.codigoRefAdmin}
                      </span>
                    )}

                    {/* Prioridad Badge */}
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase font-mono ${ped.prioridad === 'URGENTE'
                          ? isDark ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse' : 'bg-rose-100 text-rose-950 border-rose-300 font-extrabold animate-pulse'
                          : isDark ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-slate-200 text-slate-900 border-slate-300 font-bold'
                        }`}
                    >
                      • {ped.prioridad}
                    </span>

                    {/* Estado Badge */}
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase font-mono ${isNuevo
                          ? isDark ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-amber-100 text-amber-950 border-amber-300 font-bold'
                          : isAprobado
                            ? isDark ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-emerald-100 text-emerald-950 border-emerald-300 font-bold'
                            : isDark ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' : 'bg-rose-100 text-rose-950 border-rose-300 font-bold'
                        }`}
                    >
                      {ped.estado}
                    </span>
                  </div>

                  {/* Micro-Stepper Superior (Fase) */}
                  <div className="flex items-center gap-2 text-[11px] font-sans">
                    <div className={`flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-800 font-semibold'}`}>
                      <span className={`h-2 w-2 rounded-full ${isNuevo ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                      <span className={isNuevo ? isDark ? 'text-amber-300 font-bold' : 'text-amber-900 font-bold' : ''}>Nuevo</span>
                      <span className={isDark ? 'text-slate-600' : 'text-slate-400'}>➔</span>
                      <span>Validando</span>
                      <span className={isDark ? 'text-slate-600' : 'text-slate-400'}>➔</span>
                      <span className={isAprobado ? isDark ? 'text-emerald-400 font-bold' : 'text-emerald-900 font-bold' : ''}>Aprobado</span>
                      <span className={isDark ? 'text-slate-600' : 'text-slate-400'}>➔</span>
                      <span>Producción</span>
                    </div>

                    <button className="text-[10px] text-cyan-700 dark:text-cyan-400 font-bold hover:underline flex items-center gap-0.5 ml-2">
                      <span>Ver detalle</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* ── CUERPO DE 3 COLUMNAS ── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* COLUMNA 1: PRODUCTO & ENTREGA */}
                  <div className={`lg:col-span-4 space-y-2 border-r pr-4 ${isDark ? 'border-slate-800/80' : 'border-slate-300'}`}>
                    <span className={`text-[10px] font-bold uppercase tracking-widest block ${isDark ? 'text-slate-500' : 'text-slate-700'}`}>
                      PRODUCTO SOLICITADO
                    </span>

                    <h3 className={`text-base font-bold font-sans leading-snug ${textValue}`}>
                      {ped.productoNombre}
                    </h3>

                    <div className="text-xs font-mono font-bold text-cyan-800 dark:text-cyan-400">
                      {ped.cantidadSolicitada} {ped.unidadMedida}
                    </div>

                    <div className="text-lg font-black font-mono text-emerald-800 dark:text-[#00F2C3] pt-1">
                      S/ {Number(ped.montoTotal).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                    </div>

                    <div className={`flex items-center gap-4 text-[11px] pt-2 font-mono border-t ${isDark ? 'text-slate-400 border-slate-800/60' : 'text-slate-800 border-slate-200'}`}>
                      <div>
                        <span className={`text-[9px] block uppercase ${isDark ? 'text-slate-500' : 'text-slate-600 font-bold'}`}>LOTES REQUERIDOS</span>
                        <strong className={`text-xs ${textValue}`}>{ped.lotesRequeridos}</strong>
                      </div>
                      <div>
                        <span className={`text-[9px] block uppercase ${isDark ? 'text-slate-500' : 'text-slate-600 font-bold'}`}>ENTREGA EN</span>
                        <strong className="text-amber-800 dark:text-amber-400 text-xs font-bold">
                          7d &nbsp;·&nbsp; {new Date(ped.fechaPrometida).toISOString().split('T')[0]}
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* COLUMNA 2: DATOS COMERCIALES CLIENTE */}
                  <div className={`lg:col-span-4 space-y-2 border-r pr-4 font-sans text-xs ${isDark ? 'border-slate-800/80' : 'border-slate-300'}`}>
                    <span className={`text-[10px] font-bold uppercase tracking-widest block font-mono ${isDark ? 'text-slate-500' : 'text-slate-700'}`}>
                      CLIENTE
                    </span>

                    <h4 className={`text-sm font-bold ${textValue}`}>
                      {ped.clienteNombre}
                    </h4>

                    <div className={`text-[11px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-700 font-bold'}`}>
                      RUC {ped.clienteRuc}
                    </div>

                    <div className="space-y-1 text-[11px] pt-1">
                      <div className="flex items-center gap-1.5">
                        <User className={`w-3.5 h-3.5 shrink-0 ${isDark ? 'text-slate-500' : 'text-slate-700'}`} />
                        <span className={isDark ? 'text-slate-300' : 'text-slate-900 font-semibold'}>{ped.contactoNombre || 'Ing. Rodrigo Salcedo'}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Phone className={`w-3.5 h-3.5 shrink-0 ${isDark ? 'text-slate-500' : 'text-slate-700'}`} />
                        <span className={isDark ? 'text-slate-400' : 'text-slate-900 font-semibold'}>{ped.contactoTelefono || '+51 999 234 781'}</span>
                      </div>
                      <div className="flex items-start gap-1.5 leading-tight">
                        <MapPin className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-700'}`} />
                        <span className={isDark ? 'text-slate-400' : 'text-slate-900 font-semibold'}>{ped.direccionDespacho || 'Av. Angamos Este 2646, Surquillo, Lima'}</span>
                      </div>
                    </div>

                    <div className={`grid grid-cols-2 gap-2 text-[10px] font-mono pt-2 border-t ${isDark ? 'text-slate-400 border-slate-800/60' : 'text-slate-800 border-slate-200'}`}>
                      <div>
                        <span className={`block uppercase ${isDark ? 'text-slate-500' : 'text-slate-600 font-bold'}`}>REP. COMERCIAL</span>
                        <strong className={`text-xs ${textValue}`}>{ped.repComercial || 'Carla Medina'}</strong>
                      </div>
                      <div>
                        <span className={`block uppercase ${isDark ? 'text-slate-500' : 'text-slate-600 font-bold'}`}>PAGO</span>
                        <strong className="text-cyan-800 dark:text-cyan-300 text-xs font-bold">{ped.condicionPago || 'Crédito 30 días'}</strong>
                      </div>
                    </div>
                  </div>

                  {/* COLUMNA 3: FÓRMULA & CÁLCULO DINÁMICO DE STOCK EN KARDEX */}
                  <div className="lg:col-span-4 space-y-3 font-sans text-xs">
                    <div>
                      <span className={`text-[10px] font-bold uppercase tracking-widest block font-mono ${isDark ? 'text-slate-500' : 'text-slate-700'}`}>
                        FÓRMULA & ENTREGA
                      </span>
                      <h4 className={`text-xs font-bold font-mono mt-0.5 ${textValue}`}>
                        FÓRMULA CREMA MUSCULAR MENTOLADA v2
                      </h4>
                      <span className={`text-[10px] font-mono ${isDark ? 'text-slate-500' : 'text-slate-700 font-semibold'}`}>
                        FM-8128-v2 · Creado 2026-08-05 08:11
                      </span>
                    </div>

                    {/* RESULTADO DE CÁLCULO DE STOCK */}
                    <div className="space-y-1.5">
                      <span className={`text-[10px] font-bold uppercase tracking-widest block font-mono ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                        STOCK DISPONIBLE
                      </span>

                      {tieneFaltantes ? (
                        <div className={`flex items-center gap-1.5 text-xs font-bold ${isDark ? 'text-rose-400' : 'text-rose-950 font-black'}`}>
                          <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                          <span>🔴 {stockInfo.insumosFaltantesCount} insumo insuficiente</span>
                        </div>
                      ) : (
                        <div className={`flex items-center gap-1.5 text-xs font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-950 font-black'}`}>
                          <span className="h-2 w-2 rounded-full bg-emerald-500" />
                          <span>🟢 Stock completo para este pedido</span>
                        </div>
                      )}

                      {/* CHIPS DE INSUMOS DE LA RECETA */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {stockInfo.detalles.map((ins, idx) => (
                          <span
                            key={idx}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono border ${ins.suficiente
                                ? isDark
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                  : 'bg-emerald-100 text-emerald-950 border-emerald-400 font-bold'
                                : isDark
                                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                                  : 'bg-rose-100 text-rose-950 border-rose-400 font-bold'
                              }`}
                            title={`${ins.nombre}: Req. ${ins.requerido} / Disp. ${ins.disponible}`}
                          >
                            {ins.codigo}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* NOTAS DE ADMINISTRACIÓN (Limpio, sin mostrar JSON) */}
                    {ped.notasAdmin &&
                      !ped.notasAdmin.trim().startsWith('[') &&
                      !ped.notasAdmin.trim().startsWith('{') &&
                      ped.notasAdmin.trim() !== 'Sin observaciones adicionales.' && (
                        <div className={`p-2.5 rounded-xl border text-[11px] font-sans space-y-0.5 ${isDark ? 'bg-[#151D2A] border-[#1A2232] text-slate-300' : 'bg-slate-100 border-slate-300 text-slate-900 font-medium'
                          }`}>
                          <span className={`text-[9px] font-bold uppercase block font-mono ${isDark ? 'text-slate-500' : 'text-slate-700'}`}>
                            💬 OBSERVACIONES DEL PEDIDO
                          </span>
                          <p className="leading-relaxed font-semibold">{ped.notasAdmin}</p>
                        </div>
                      )}
                  </div>
                </div>

                {/* ── SEPARACIÓN DE VISTA DE TARJETA: ADMINISTRACIÓN VS PLANTA ── */}
                {isAdmin ? (
                  /* VISTA DE ADMINISTRACIÓN: SOLO ESTATUS DEL PEDIDO (SIN BOTONES OPERATIVOS DE PLANTA) */
                  <div className={`mt-3 p-3 rounded-xl border text-xs font-sans flex flex-wrap items-center justify-between gap-2 ${
                    isDark ? 'bg-[#151D2A] border-[#1A2232]' : 'bg-slate-100 border-slate-300'
                  }`}>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#00F2C3]" />
                      <span className="text-slate-300">
                        Estado Actual en Planta:{' '}
                        <strong className="text-cyan-400 font-mono">
                          {ped.estado === 'NUEVO'
                            ? '⏳ PENDIENTE DE REVISIÓN EN PLANTA'
                            : ped.estado === 'APROBADO' || ped.estado === 'EN_PRODUCCION'
                            ? '⚡ EN PRODUCCIÓN & QA'
                            : ped.estado}
                        </strong>
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {ped.estado === 'NUEVO'
                        ? 'Esperando que el Supervisor de Planta acepte la orden'
                        : 'Orden aceptada por el Supervisor de Planta'}
                    </span>
                  </div>
                ) : (
                  /* VISTA DE PLANTA: BOTONES DE APROBACIÓN PARA EL SUPERVISOR DE PLANTA */
                  <>
                    {isNuevo && (
                      <div className={`flex flex-wrap items-center justify-end gap-3 pt-3 mt-3 border-t ${isDark ? 'border-slate-800/80' : 'border-slate-300'}`}>
                        <button
                          onClick={() => {
                            setSelectedPedidoDevolucionModal(ped);
                            setMotivoDevolucionInput('');
                          }}
                          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all font-sans flex items-center gap-1.5 ${isDark
                              ? 'bg-rose-950/40 text-rose-400 border border-rose-500/30 hover:bg-rose-900/50'
                              : 'bg-rose-100 text-rose-950 border border-rose-300 hover:bg-rose-200 font-bold'
                            }`}
                        >
                          <span>❌ Rechazar / Solicitar Ajuste</span>
                        </button>

                        <button
                          onClick={() => handleAprobarPedido(ped)}
                          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all font-sans shadow-lg flex items-center gap-2 ${isDark
                              ? 'bg-gradient-to-r from-[#00F2C3] to-emerald-500 text-slate-950 hover:opacity-95 shadow-emerald-500/20'
                              : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md font-extrabold'
                            }`}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>✅ Aceptar & Programar Producción</span>
                        </button>
                      </div>
                    )}

                    {isAprobado && (
                      <div className={`mt-3 p-3 rounded-lg border text-xs font-sans flex items-center justify-between ${isDark ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-emerald-100 border-emerald-300 text-emerald-950 font-bold'
                        }`}>
                        <span className="flex items-center gap-2 font-bold">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          Orden Aprobada y En Programación de Reactores.
                        </span>
                        <a
                          href="/dashboard/produccion-qa"
                          className="px-3 py-1 rounded bg-teal-600 text-white font-bold hover:bg-teal-700 transition-all flex items-center gap-1 shadow-sm"
                        >
                          <span>Ver en Reactores & QA</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* ── MODAL 1: DESGLOSE DE STOCK INSUFICIENTE EN KARDEX ── */}
      {selectedPedidoStockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-sm p-4 font-sans">
          <div className={`w-full max-w-2xl rounded-2xl p-6 border space-y-4 ${cardBg} border-amber-500/40 shadow-2xl`}>
            <div className={`flex items-center justify-between border-b pb-3 ${isDark ? 'border-slate-800' : 'border-slate-300'}`}>
              <div className={`flex items-center gap-2 font-bold text-sm ${isDark ? 'text-amber-400' : 'text-amber-900'}`}>
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <span>Desglose de Stock en Kardex: {selectedPedidoStockModal.codigoOrden}</span>
              </div>
              <button
                onClick={() => setSelectedPedidoStockModal(null)}
                className={isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>
              Insumos requeridos según la fórmula maestra para producir{' '}
              <strong className={`font-mono ${textValue}`}>{selectedPedidoStockModal.cantidadSolicitada} {selectedPedidoStockModal.unidadMedida}</strong> de{' '}
              <strong className={textValue}>{selectedPedidoStockModal.productoNombre}</strong>:
            </p>

            {/* TABLA DE INSUMOS */}
            <div className={`overflow-x-auto border rounded-xl ${isDark ? 'border-slate-800' : 'border-slate-300'}`}>
              <table className="w-full text-left text-xs font-mono">
                <thead className={`uppercase text-[10px] ${isDark ? 'bg-[#151D2A] text-slate-400' : 'bg-slate-100 text-slate-900 font-bold border-b border-slate-300'}`}>
                  <tr>
                    <th className="p-2.5">Código</th>
                    <th className="p-2.5">Materia Prima / Insumo</th>
                    <th className="p-2.5 text-right">Requerido</th>
                    <th className="p-2.5 text-right">Stock Kardex</th>
                    <th className="p-2.5 text-right">Faltante</th>
                    <th className="p-2.5 text-center">Estado</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? 'divide-slate-800/60 text-slate-200' : 'divide-slate-200 text-slate-900'}`}>
                  {(selectedPedidoStockModal.stockValidacion?.detalles || []).map((ins, idx) => (
                    <tr key={idx} className={!ins.suficiente ? isDark ? 'bg-rose-950/20' : 'bg-rose-50' : ''}>
                      <td className="p-2.5 font-bold text-cyan-800 dark:text-cyan-400">{ins.codigo}</td>
                      <td className="p-2.5 font-semibold">{ins.nombre}</td>
                      <td className="p-2.5 text-right">{ins.requerido} KG</td>
                      <td className="p-2.5 text-right font-semibold">{ins.disponible} KG</td>
                      <td className="p-2.5 text-right font-bold text-rose-700 dark:text-rose-400">
                        {ins.faltante > 0 ? `-${ins.faltante} KG` : '0 KG'}
                      </td>
                      <td className="p-2.5 text-center">
                        {ins.suficiente ? (
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${isDark ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                            }`}>
                            OK
                          </span>
                        ) : (
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${isDark ? 'bg-rose-500/20 text-rose-300' : 'bg-rose-100 text-rose-950 border border-rose-300 font-extrabold'
                            }`}>
                            INSUFICIENTE
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => {
                  setSelectedPedidoDevolucionModal(selectedPedidoStockModal);
                  setSelectedPedidoStockModal(null);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${isDark
                    ? 'border border-rose-500/30 text-rose-400 hover:bg-rose-900/30'
                    : 'bg-rose-100 text-rose-950 border border-rose-300 hover:bg-rose-200 font-extrabold'
                  }`}
              >
                ↩️ Devolver a Ventas por Stock
              </button>

              <button
                onClick={() => setSelectedPedidoStockModal(null)}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${isDark ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-slate-200 text-slate-900 hover:bg-slate-300 border border-slate-300'
                  }`}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 2: DEVOLUCIÓN A ADMINISTRACIÓN ── */}
      {selectedPedidoDevolucionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-sm p-4 font-sans">
          <div className={`w-full max-w-md rounded-2xl p-6 border space-y-4 ${cardBg} border-rose-500/40 shadow-2xl`}>
            <div className={`flex items-center gap-2 font-bold text-sm ${isDark ? 'text-rose-400' : 'text-rose-950'}`}>
              <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-500" />
              <span>Devolver Orden: {selectedPedidoDevolucionModal.codigoOrden}</span>
            </div>

            <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-800 font-medium'}`}>
              Indica detalladamente el motivo técnico o falta de materias primas para notificar a Ventas/Administración:
            </p>

            <textarea
              rows={4}
              placeholder="Ejemplo: Insumo Soda Cáustica 50% insuficiente en Kardex (se requieren 45 KG adicionales)..."
              value={motivoDevolucionInput}
              onChange={(e) => setMotivoDevolucionInput(e.target.value)}
              className={`w-full rounded-xl border p-3 text-xs focus:border-rose-500 focus:outline-none ${inputBg}`}
            />

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setSelectedPedidoDevolucionModal(null)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${isDark ? 'border border-slate-700 text-slate-300 hover:bg-slate-800' : 'bg-slate-200 text-slate-900 border border-slate-300 hover:bg-slate-300'
                  }`}
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmarDevolucion}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 shadow-md"
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
