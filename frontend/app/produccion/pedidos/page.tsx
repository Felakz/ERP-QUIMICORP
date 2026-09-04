'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  Play,
  Sparkles,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/lib/ThemeContext';
import { useAuth } from '@/lib/AuthContext';
import { DateNavigatorToolbar } from '@/components/produccion/DateNavigatorToolbar';
import { apiFetch } from '@/lib/apiClient';
import { useSocket } from '@/lib/socketContext';

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
  formulaId?: string;
  contactoNombre?: string;
  contactoTelefono?: string;
  direccionDespacho?: string;
  repComercial?: string;
  condicionPago?: string;
  productoNombre: string;
  cantidadSolicitada: number | string;
  unidadMedida: string;
  montoTotal: number | string;
  fechaCreacion?: string;
  fechaPrometida?: string;
  prioridad: 'URGENTE' | 'NORMAL' | 'PROGRAMADO';
  estado: 'NUEVO' | 'PENDIENTE_REVISION' | 'APROBADO' | 'EN_PRODUCCION' | 'DEVUELTO' | 'COMPLETADO';
  motivoDevolucion?: string;
  aprobadoPor?: string;
  fechaAprobacion?: string;
  desgloseStock?: StockValidacionInfo;
  color?: string;
  aroma?: string;
  colorText?: string;
  aromaText?: string;
  itemsList?: any[];
}


export default function ProduccionPedidosRecepcionPage() {
  const { theme } = useTheme();
  const { socket } = useSocket();
  const isDark = theme === 'dark';
  const router = useRouter();

  const [pedidos, setPedidos] = useState<PedidoComercialUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState<string>('TODOS');
  const [filtroPrioridad, setFiltroPrioridad] = useState<string>('TODAS');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPedido, setSelectedPedido] = useState<PedidoComercialUI | null>(null);
  const [modalDevolucionOpen, setModalDevolucionOpen] = useState(false);
  const [pedidoParaDevolver, setPedidoParaDevolver] = useState<PedidoComercialUI | null>(null);
  const [motivoDevolucion, setMotivoDevolucion] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const approvingRef = useRef(false);
  const [toastMsg, setToastMsg] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(null);
  const [timeString, setTimeString] = useState('');

  const [fechaFiltro, setFechaFiltro] = useState<string>(new Date().toISOString().split('T')[0]);
  const [kpis, setKpis] = useState({
    pedidosHoy: 0,
    nuevos: 0,
    aprobados: 0,
    enProduccion: 0,
    valorDelDia: 0,
  });


  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleDateString('es-ES', {
          weekday: 'short',
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }) +
        ' ' +
        now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const cardBg = isDark ? 'bg-[#0F141C] border-[#1A2232]' : 'bg-white border-slate-200 shadow-sm';
  const textTitle = isDark ? 'text-slate-400' : 'text-slate-500';
  const textValue = isDark ? 'text-white' : 'text-slate-900';

  const cargarPedidos = async (fechaParam?: string) => {
    try {
      setLoading(true);
      const fechaQuery = fechaParam || fechaFiltro;
      const [kpisRes, listRes] = await Promise.all([
        apiFetch<any>(`/pedidos-admin/kpis?fecha=${fechaQuery}`),
        apiFetch<any[]>(`/pedidos-admin?docType=OP&fecha=${fechaQuery}`),
      ]);
      if (kpisRes.ok && kpisRes.data) setKpis(kpisRes.data);
      if (listRes.ok && Array.isArray(listRes.data)) {
        const soloOps = (listRes.data as any[]).filter(
          (p: any) => p.docType !== 'COT' && !p.codigoOrden?.startsWith('COT') && p.estado !== 'COTIZACION_EMITIDA'
        );
        setPedidos(soloOps);
      } else if (listRes.ok) {
        setPedidos([]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPedidos(fechaFiltro);
  }, [fechaFiltro]);

  // Sincronización en tiempo real vía SocketProvider centralizado
  useEffect(() => {
    if (!socket) return;
    const onCreated = (nuevoPedido: any) => {
      if (nuevoPedido && nuevoPedido.docType !== 'COT' && !nuevoPedido.codigoOrden?.startsWith('COT')) {
        setToastMsg({ tipo: 'success', texto: `Nuevo Pedido Comercial #${nuevoPedido.codigoOrden || ''} recibido en Planta!` });
      }
      cargarPedidos(fechaFiltro);
    };
    const onRefresh = () => cargarPedidos(fechaFiltro);
    socket.on('order:created_to_plant', onCreated);
    socket.on('order:status_updated', onRefresh);
    socket.on('order:accepted_by_plant', onRefresh);
    socket.on('order:devolucion', onRefresh);
    return () => {
      socket.off('order:created_to_plant', onCreated);
      socket.off('order:status_updated', onRefresh);
      socket.off('order:accepted_by_plant', onRefresh);
      socket.off('order:devolucion', onRefresh);
    };
  }, [socket, fechaFiltro]);

  const handleAprobarLote = async (pedido: PedidoComercialUI) => {
    if (approvingRef.current) return;
    approvingRef.current = true;
    try {
      setActionLoading(true);
      const aprobar = await apiFetch(`/pedidos-admin/${pedido.id}/aprobar`, { method: 'POST' });
      if (!aprobar.ok) throw new Error(aprobar.error || 'No se pudo aprobar el pedido');

      setToastMsg({
        tipo: 'success',
        texto: `✅ Lote ${pedido.codigoOrden} aprobado con éxito. Transfiriendo a Control de Producción & Reactores...`,
      });

      setPedidos((prev) =>
        prev.map((p) => (p.id === pedido.id ? { ...p, estado: 'APROBADO' } : p))
      );

      setTimeout(() => {
        router.push('/produccion/qa');
      }, 1200);
    } catch (e: any) {
      setToastMsg({ tipo: 'error', texto: e.message || `No se pudo aprobar ${pedido.codigoOrden}` });
    } finally {
      setActionLoading(false);
      approvingRef.current = false;
    }
  };

  const pedidosFiltrados = useMemo(() => {
    return pedidos.filter((p) => {
      // Excluir cualquier cotización
      if ((p as any).docType === 'COT' || (p.codigoOrden && p.codigoOrden.startsWith('COT')) || (p.estado as string) === 'COTIZACION_EMITIDA') {
        return false;
      }
      if (filtroEstado !== 'TODOS') {
        if (filtroEstado === 'NUEVO') {
          if (p.estado !== 'NUEVO' && p.estado !== 'PENDIENTE_REVISION') return false;
        } else if (p.estado !== filtroEstado) {
          return false;
        }
      }
      if (filtroPrioridad !== 'TODAS' && p.prioridad !== filtroPrioridad) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchCode = (p.codigoOrden || '').toLowerCase().includes(q);
        const matchCliente = (p.clienteNombre || '').toLowerCase().includes(q);
        const matchProd = (p.productoNombre || '').toLowerCase().includes(q);
        if (!matchCode && !matchCliente && !matchProd) return false;
      }
      return true;
    });
  }, [pedidos, filtroEstado, filtroPrioridad, searchQuery]);


  return (
    <div className="space-y-5 font-mono min-h-screen">
      {/* Toast Notification */}
      {toastMsg && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-2xl shadow-2xl border flex items-center gap-3 font-sans text-xs font-bold animate-in fade-in slide-in-from-top-2 duration-200 ${
            toastMsg.tipo === 'success'
              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
              : 'bg-rose-500/20 border-rose-500/40 text-rose-300'
          }`}
        >
          <span>{toastMsg.tipo === 'success' ? '✅' : '⚠️'}</span>
          <span>{toastMsg.texto}</span>
          <button onClick={() => setToastMsg(null)} className="ml-2 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Superior: Pedidos Entrantes / Recepción de Planta */}
      <div className={`rounded-2xl p-5 border flex flex-wrap items-center justify-between gap-4 transition-all shadow-sm ${cardBg}`}>
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className={`text-lg font-black font-sans tracking-tight ${textValue}`}>
              Pedidos Entrantes / Recepción de Planta
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wider font-mono bg-[#00F2C3]/10 border border-[#00F2C3]/30 text-[#00F2C3] uppercase flex items-center gap-1.5">
              <Zap className="w-3 h-3 animate-pulse" />
              <span>SEMI-APROBACIN ACTIVO</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Recepcin y validación de rdenes comerciales emitidas por Administracin para verter en Reactores.
          </p>
        </div>

        <div className="flex items-center gap-2 font-sans text-xs">
          <span className="text-slate-400 font-mono text-[11px]">{timeString}</span>
          <button
            onClick={() => cargarPedidos(fechaFiltro)}
            className={`p-2 rounded-xl border transition-all ${
              isDark ? 'bg-[#151D2A] border-[#1A2232] text-slate-300 hover:text-white' : 'bg-slate-100 border-slate-300 text-slate-700'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* ?? Barra de Navegacin por Día (DateNavigatorToolbar) */}
      <DateNavigatorToolbar
        fecha={fechaFiltro}
        onFechaChange={(nuevaFecha) => setFechaFiltro(nuevaFecha)}
        titulo="RECEPCIN DE PEDIDOS POR TURNO"
        subtitulo="Pedidos comerciales de planta filtrados por fecha de registro en base de datos"
      />

      {/* 5 KPIs Superiores */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {/* PEDIDOS HOY */}
        <div className={`rounded-2xl p-4 border transition-all space-y-1 shadow-sm ${cardBg}`}>
          <span className={`text-[10px] font-bold tracking-widest uppercase font-sans ${textTitle}`}>
            PEDIDOS HOY
          </span>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-black font-mono ${isDark ? 'text-cyan-400' : 'text-teal-700'}`}>
              {kpis.pedidosHoy}
            </span>
            <span className={`text-[10px] font-sans ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Total recibidos
            </span>
          </div>
        </div>

        {/* NUEVOS */}
        <div className={`rounded-2xl p-4 border transition-all space-y-1 shadow-sm ${cardBg}`}>
          <span className={`text-[10px] font-bold tracking-widest uppercase font-sans ${textTitle}`}>
            NUEVOS
          </span>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-black font-mono ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>
              {kpis.nuevos}
            </span>
            <span className={`text-[10px] font-sans font-medium ${isDark ? 'text-amber-400/80' : 'text-amber-800'}`}>
              Requiere accin
            </span>
          </div>
        </div>

        {/* APROBADOS */}
        <div className={`rounded-2xl p-4 border transition-all space-y-1 shadow-sm ${cardBg}`}>
          <span className={`text-[10px] font-bold tracking-widest uppercase font-sans ${textTitle}`}>
            APROBADOS
          </span>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-black font-mono ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
              {kpis.aprobados}
            </span>
            <span className={`text-[10px] font-sans font-medium ${isDark ? 'text-emerald-400/80' : 'text-emerald-800'}`}>
              En cola producción
            </span>
          </div>
        </div>

        {/* EN PRODUCCIN */}
        <div className={`rounded-2xl p-4 border transition-all space-y-1 shadow-sm ${cardBg}`}>
          <span className={`text-[10px] font-bold tracking-widest uppercase font-sans ${textTitle}`}>
            EN PRODUCCIN
          </span>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-black font-mono ${isDark ? 'text-purple-400' : 'text-purple-700'}`}>
              {kpis.enProduccion}
            </span>
            <span className={`text-[10px] font-sans font-medium ${isDark ? 'text-purple-400/80' : 'text-purple-800'}`}>
              Actualmente activos
            </span>
          </div>
        </div>

        {/* VALOR DEL DA */}
        <div className={`rounded-2xl p-4 border transition-all space-y-1 shadow-sm ${cardBg}`}>
          <span className={`text-[10px] font-bold tracking-widest uppercase font-sans ${textTitle}`}>
            VALOR DEL DA
          </span>
          <div className="flex items-baseline gap-2">
            <span className={`text-xl font-black font-mono ${isDark ? 'text-[#00F2C3]' : 'text-teal-800'}`}>
              S/ {Number(kpis.valorDelDia).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* Barra de Bsqueda y Filtros de Estado */}
      <div className={`rounded-2xl p-3.5 border flex flex-wrap items-center justify-between gap-3 shadow-sm ${cardBg}`}>
        {/* Buscador */}
        <div className="relative flex-1 min-w-[280px]">
          <Search className={`absolute left-3.5 top-2.5 h-4 w-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
          <input
            type="text"
            placeholder="Buscar por N, cliente o producto..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full rounded-xl border py-2 pl-10 pr-4 text-xs focus:border-[#00F2C3] focus:outline-none transition-all font-sans ${
              isDark
                ? 'bg-[#151D2A] border-[#1A2232] text-slate-200 placeholder-slate-500'
                : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 font-medium'
            }`}
          />
        </div>

        {/* Pills de Estado */}
        <div className="flex items-center gap-1.5 font-sans">
          {[
            { id: 'TODOS', label: 'Todos' },
            { id: 'NUEVO', label: 'Nuevos' },
            { id: 'APROBADO', label: 'Aprobados' },
            { id: 'EN_PRODUCCION', label: 'Producción' },
            { id: 'DEVUELTO', label: 'Devueltos' },
          ].map((item) => {
            const isSel = filtroEstado === item.id;
            const count =
              item.id === 'TODOS'
                ? pedidos.length
                : item.id === 'NUEVO'
                ? pedidos.filter((p) => p.estado === 'NUEVO' || p.estado === 'PENDIENTE_REVISION').length
                : pedidos.filter((p) => p.estado === item.id).length;
            return (
              <button
                key={item.id}
                onClick={() => setFiltroEstado(item.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isSel
                    ? isDark
                      ? 'bg-[#00F2C3] text-slate-950 shadow-md shadow-[#00F2C3]/20'
                      : 'bg-teal-700 text-white shadow-md'
                    : isDark
                    ? 'bg-[#151D2A] text-slate-300 border border-[#1A2232] hover:text-white'
                    : 'bg-slate-100 text-slate-700 border border-slate-300 hover:bg-slate-200'
                }`}
              >
                {item.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Prioridad Pills */}
        <div className={`flex items-center gap-1.5 text-[10px] font-sans border-l pl-3 ${isDark ? 'border-slate-700/40' : 'border-slate-300'}`}>
          <span className={`font-bold uppercase ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>PRIORIDAD:</span>
          {['TODAS', 'URGENTE', 'NORMAL', 'PROGRAMADO'].map((pr) => (
            <button
              key={pr}
              onClick={() => setFiltroPrioridad(pr)}
              className={`px-2 py-1 rounded-lg font-bold uppercase transition-all ${
                filtroPrioridad === pr
                  ? isDark
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-teal-100 text-teal-900 border border-teal-400 font-black'
                  : isDark
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              • {pr}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Tarjetas de Pedidos en Planta */}
      <div className="space-y-4">
        {pedidosFiltrados.length === 0 ? (
          <div className={`rounded-2xl p-12 text-center border space-y-3 ${cardBg}`}>
            <Inbox className="w-12 h-12 text-slate-500 mx-auto opacity-50" />
            <div className="space-y-1">
              <p className={`text-sm font-bold font-sans ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                No hay pedidos para la fecha ({fechaFiltro})
              </p>
              <p className={`text-xs font-sans ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                {fechaFiltro === new Date().toISOString().split('T')[0]
                  ? 'Ajusta los filtros de bsqueda o emite un nuevo pedido desde Administracin.'
                  : 'No se encontraron rdenes comerciales emitidas para el día seleccionado.'}
              </p>
            </div>
            {fechaFiltro !== new Date().toISOString().split('T')[0] && (
              <div className="pt-2">
                <button
                  onClick={() => setFechaFiltro(new Date().toISOString().split('T')[0])}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold font-sans border transition-all ${
                    isDark ? 'border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10' : 'border-teal-300 text-teal-800 hover:bg-teal-50'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Volver a Pedidos de Hoy</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          pedidosFiltrados.map((p) => {
            const esNuevo = p.estado === 'NUEVO' || p.estado === 'PENDIENTE_REVISION';
            const enProd = p.estado === 'EN_PRODUCCION';

            return (
              <div
                key={p.id}
                className={`rounded-2xl p-5 border transition-all space-y-4 shadow-sm hover:shadow-md ${
                  isDark ? 'hover:border-[#00F2C3]/40' : 'hover:border-teal-400'
                } ${cardBg}`}
              >
                {/* Cabecera de la Orden */}
                <div className={`flex flex-wrap items-center justify-between gap-3 border-b pb-3 ${
                  isDark ? 'border-slate-800/60' : 'border-slate-100'
                }`}>
                  <div className="flex items-center gap-3">
                    <span className={`text-base font-black font-mono ${isDark ? 'text-[#00F2C3]' : 'text-teal-700'}`}>
                      {p.codigoOrden}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase font-sans border ${
                        p.prioridad === 'URGENTE'
                          ? isDark
                            ? 'bg-rose-500/15 border-rose-500/30 text-rose-400'
                            : 'bg-rose-50 border-rose-300 text-rose-800'
                          : isDark
                          ? 'bg-cyan-500/15 border-cyan-500/30 text-cyan-400'
                          : 'bg-teal-50 border-teal-300 text-teal-800'
                      }`}
                    >
                      {p.prioridad}
                    </span>
                    <span className={`text-xs font-sans font-bold ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                      {p.clienteNombre}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold font-mono ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
                      S/ {Number(p.montoTotal).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono border ${
                        enProd
                          ? isDark
                            ? 'bg-purple-500/15 text-purple-400 border-purple-500/30'
                            : 'bg-purple-100 text-purple-900 border-purple-300'
                          : esNuevo
                          ? isDark
                            ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                            : 'bg-amber-100 text-amber-900 border-amber-300'
                          : isDark
                          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                          : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                      }`}
                    >
                      {p.estado.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Detalles de la Fabricacin */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-sans">
                  <div>
                    <span className={`text-[10px] uppercase font-bold block mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      PRODUCTOS A FABRICAR / MEZCLAR
                    </span>
                    {p.itemsList && p.itemsList.length > 0 ? (
                      <div className="space-y-2">
                        {p.itemsList.map((it: any, i: number) => {
                          const codeFM = it.codigoFM || it.codigo || 'FM-0001';
                          return (
                            <div
                              key={i}
                              onClick={() => router.push(`/produccion/formulas?codigo=${encodeURIComponent(codeFM)}`)}
                              className={`p-2 rounded-xl border space-y-1 cursor-pointer transition-all hover:border-cyan-500/60 hover:bg-cyan-500/5 ${
                                isDark ? 'bg-[#151D2A] border-[#1A2232]' : 'bg-slate-50 border-slate-200'
                              }`}
                              title={`Click para inspeccionar la fórmula maestra ${codeFM}`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-1.5 font-bold">
                                  <span className="text-[10px] font-mono text-cyan-400 font-black">#{i + 1}</span>
                                  <span className={textValue}>{it.productoNombre || it.descripcion}</span>
                                </div>
                                <span className="text-[11px] font-mono font-bold text-teal-400 shrink-0">
                                  {Number(it.cantidad).toLocaleString()} {it.unidadMedida || it.unidad || 'KG'}
                                </span>
                              </div>
                              <div className="flex items-center justify-between gap-2 text-[10px] font-mono text-slate-400">
                                <div className="flex items-center gap-2">
                                  <span className="text-cyan-400 font-bold">Código: {codeFM}</span>
                                  {it.aroma && (
                                    <span className="px-1.5 py-0.2 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                                      {it.aroma}
                                    </span>
                                  )}
                                  {it.color && (
                                    <span className="px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                      {it.color}
                                    </span>
                                  )}
                                </div>
                                <span className="text-[10px] text-cyan-400 flex items-center gap-0.5 font-sans font-semibold hover:underline">
                                  <Beaker className="w-3 h-3" /> Ver Fórmula ?
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div
                        onClick={() => {
                          const code = p.productoNombre?.match(/FM-\d+/)?.[0] || 'FM-0001';
                          router.push(`/produccion/formulas?codigo=${encodeURIComponent(code)}`);
                        }}
                        className={`p-2.5 rounded-xl border space-y-1.5 cursor-pointer transition-all hover:border-cyan-500/60 ${
                          isDark ? 'bg-[#151D2A] border-[#1A2232]' : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <p className={`font-bold text-sm ${textValue}`}>{p.productoNombre}</p>
                        <p className={`text-[11px] font-mono mt-0.5 ${isDark ? 'text-cyan-400' : 'text-teal-700 font-bold'}`}>
                          Masa Requerida: <strong>{Number(p.cantidadSolicitada).toLocaleString()} {p.unidadMedida}</strong>
                        </p>
                        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[10px] font-mono">
                          <span className={`px-2 py-0.5 rounded-md border font-bold inline-flex items-center gap-1 ${
                            isDark ? 'bg-purple-500/15 text-purple-300 border-purple-500/30' : 'bg-purple-50 text-purple-900 border-purple-300'
                          }`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                            {p.color || (p as any).colorText || 'TRANSPARENTE'}
                          </span>
                          <span className={`px-2 py-0.5 rounded-md border font-bold inline-flex items-center gap-1 ${
                            isDark ? 'bg-amber-500/15 text-amber-300 border-amber-500/30' : 'bg-amber-50 text-amber-900 border-amber-300'
                          }`}>
                            <span>🌸</span>
                            {p.aroma || (p as any).aromaText || 'SIN FRAGANCIA'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>


                  <div>
                    <span className={`text-[10px] uppercase font-bold block mb-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      DATOS DE CONTACTO & ENTREGA
                    </span>
                    <p className={`font-bold ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>{p.contactoNombre}</p>
                    <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{p.direccionDespacho}</p>
                  </div>

                  <div>
                    <span className={`text-[10px] uppercase font-bold block mb-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      ESTADO DE MATERIA PRIMA EN STOCK
                    </span>
                    {p.desgloseStock?.stockCompleto ? (
                      <div className={`flex items-center gap-1.5 font-bold text-xs ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>100% Insumos Disponibles en Almacén</span>
                      </div>
                    ) : (
                      <div className={`flex items-center gap-1.5 font-bold text-xs ${isDark ? 'text-amber-400' : 'text-amber-800'}`}>
                        <AlertTriangle className="w-4 h-4" />
                        <span>Falta stock de algunos reactivos</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Acciones de Planta */}
                <div className={`flex flex-wrap items-center justify-between gap-3 pt-2 border-t ${
                  isDark ? 'border-slate-800/60' : 'border-slate-100'
                }`}>
                  <div className={`text-[11px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Emitido por Administracin: <strong className={textValue}>{p.repComercial || 'Ana Torres (Administracin)'}</strong>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const targetCode =
                          (p.itemsList && p.itemsList[0]?.codigoFM) ||
                          (p.itemsList && p.itemsList[0]?.codigo) ||
                          (p.productoNombre?.match(/FM-\d+/)?.[0]) ||
                          'FM-0001';
                        router.push(`/produccion/formulas?codigo=${encodeURIComponent(targetCode)}`);
                      }}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold font-sans transition-all flex items-center gap-1.5 ${
                        isDark
                          ? 'border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10'
                          : 'border-teal-300 text-teal-800 bg-teal-50 hover:bg-teal-100'
                      }`}
                    >
                      <Beaker className="w-3.5 h-3.5" />
                      <span>Ver Fórmula</span>
                    </button>

                    {esNuevo && (
                      <button
                        onClick={() => handleAprobarLote(p)}
                        disabled={actionLoading}
                        className={`px-4 py-1.5 rounded-xl font-bold font-sans text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md ${
                          isDark
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-emerald-500/20'
                            : 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-600/20'
                        }`}
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Aprobar & Enviar a Reactores</span>
                      </button>
                    )}

                    {(p.estado === 'APROBADO' || enProd) && (
                      <button
                        onClick={() => router.push('/produccion/qa')}
                        className={`px-4 py-1.5 rounded-xl text-white font-bold font-sans text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md ${
                          isDark
                            ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20'
                            : 'bg-teal-600 hover:bg-teal-700 shadow-teal-600/20'
                        }`}
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>Control de Producción & QA</span>
                      </button>
                    )}

                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
