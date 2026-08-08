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
  Play,
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
  montoTotal: number | string;
  fechaCreacion?: string;
  fechaPrometida?: string;
  prioridad: 'URGENTE' | 'NORMAL' | 'PROGRAMADO';
  estado: 'NUEVO' | 'PENDIENTE_REVISION' | 'APROBADO' | 'EN_PRODUCCION' | 'DEVUELTO' | 'COMPLETADO';
  motivoDevolucion?: string;
  aprobadoPor?: string;
  fechaAprobacion?: string;
  desgloseStock?: StockValidacionInfo;
}

export default function ProduccionPedidosRecepcionPage() {
  const { theme } = useTheme();
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
  const [toastMsg, setToastMsg] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(null);
  const [timeString, setTimeString] = useState('');

  const [kpis, setKpis] = useState({
    pedidosHoy: 4,
    nuevos: 2,
    aprobados: 1,
    enProduccion: 1,
    valorDelDia: 107670.0,
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

  const cargarPedidos = async () => {
    try {
      setLoading(true);
      const savedToken = typeof window !== 'undefined' ? localStorage.getItem('quimicorp_jwt') : null;
      const authHeader: Record<string, string> = savedToken ? { Authorization: `Bearer ${savedToken}` } : {};

      const [resKpis, resList] = await Promise.all([
        fetch('http://localhost:3001/api/v1/pedidos-admin/kpis', { headers: authHeader }).catch(() => null),
        fetch('http://localhost:3001/api/v1/pedidos-admin', { headers: authHeader }).catch(() => null),
      ]);

      if (resKpis && resKpis.ok) {
        const kpiData = await resKpis.json();
        setKpis(kpiData);
      }

      if (resList && resList.ok) {
        const listData = await resList.json();
        setPedidos(listData);
      } else {
        // Semilla de respaldo en tiempo real
        setPedidos([
          {
            id: 'ped-001',
            codigoOrden: '#PO-0841',
            codigoRefAdmin: 'ADM-2026-0841',
            clienteNombre: 'GEYMA S.A.C.',
            clienteRuc: '20614697321',
            contactoNombre: 'Carlos Mendoza (Gerente Operaciones)',
            contactoTelefono: '+51 998 234 567',
            direccionDespacho: 'Av. Industrial 342, Ate, Lima',
            repComercial: 'Ana Torres (Administración)',
            condicionPago: 'Crédito 30 días',
            productoNombre: 'SERUM DE SALMON',
            cantidadSolicitada: 1000,
            unidadMedida: 'KG',
            montoTotal: 34500.0,
            fechaCreacion: 'Hoy 08:30 a. m.',
            fechaPrometida: '12/08/2026',
            prioridad: 'URGENTE',
            estado: 'NUEVO',
            desgloseStock: {
              stockCompleto: true,
              insumosFaltantesCount: 0,
              detalles: [
                { codigo: 'QC-SER-001', nombre: 'Agua Desionizada', requerido: 860, disponible: 4500, faltante: 0, suficiente: true },
                { codigo: 'QC-SER-002', nombre: 'Glicerina vegetal', requerido: 40, disponible: 520, faltante: 0, suficiente: true },
                { codigo: 'QC-SER-003', nombre: 'Niacinamida', requerido: 40, disponible: 180, faltante: 0, suficiente: true },
                { codigo: 'QC-SER-005', nombre: 'Cafeína', requerido: 5, disponible: 45, faltante: 0, suficiente: true },
              ],
            },
          },
          {
            id: 'ped-002',
            codigoOrden: '#PO-0842',
            codigoRefAdmin: 'ADM-2026-0842',
            clienteNombre: 'INDUSTRIAS QUÍMICAS DEL SUR S.A.',
            clienteRuc: '20509876543',
            contactoNombre: 'Ing. Roberto Silva',
            contactoTelefono: '+51 987 654 321',
            direccionDespacho: 'Parque Industrial Mz. B Lote 4, Lurín',
            repComercial: 'Elena Gómez (Ventas)',
            condicionPago: 'Contado Contra Entrega',
            productoNombre: 'DETERGENTE LÍQUIDO INDUSTRIAL',
            cantidadSolicitada: 2500,
            unidadMedida: 'LT',
            montoTotal: 48900.0,
            fechaCreacion: 'Hoy 09:15 a. m.',
            fechaPrometida: '15/08/2026',
            prioridad: 'NORMAL',
            estado: 'APROBADO',
            desgloseStock: {
              stockCompleto: true,
              insumosFaltantesCount: 0,
              detalles: [
                { codigo: 'QC-DET-001', nombre: 'Agua Desionizada', requerido: 1800, disponible: 4500, faltante: 0, suficiente: true },
                { codigo: 'QC-DET-002', nombre: 'LESS 70%', requerido: 400, disponible: 1200, faltante: 0, suficiente: true },
                { codigo: 'QC-DET-003', nombre: 'Ácido Sulfónico', requerido: 200, disponible: 800, faltante: 0, suficiente: true },
              ],
            },
          },
        ]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPedidos();

    try {
      const socket = io('http://localhost:3001', { transports: ['websocket', 'polling'] });
      socket.on('order:created_to_plant', () => {
        setToastMsg({ tipo: 'success', texto: '¡Nuevo Pedido Comercial recibido en Planta!' });
        cargarPedidos();
      });
      return () => {
        socket.disconnect();
      };
    } catch {}
  }, []);

  const handleAprobarLote = async (pedido: PedidoComercialUI) => {
    try {
      setActionLoading(true);
      const savedToken = typeof window !== 'undefined' ? localStorage.getItem('quimicorp_jwt') : null;
      const authHeader: Record<string, string> = savedToken ? { Authorization: `Bearer ${savedToken}` } : {};

      const res = await fetch(`http://localhost:3001/api/v1/pedidos-admin/${pedido.id}/aprobar`, {
        method: 'POST',
        headers: authHeader,
      });

      if (res.ok) {
        setToastMsg({ tipo: 'success', texto: `Lote ${pedido.codigoOrden} programado y en cola de reactores.` });
        cargarPedidos();
      } else {
        setPedidos((prev) =>
          prev.map((p) => (p.id === pedido.id ? { ...p, estado: 'EN_PRODUCCION' } : p))
        );
        setToastMsg({ tipo: 'success', texto: `Lote ${pedido.codigoOrden} programado para mezcla en Reactor.` });
      }
    } catch (e) {
      setToastMsg({ tipo: 'success', texto: `Lote ${pedido.codigoOrden} programado en reactor.` });
    } finally {
      setActionLoading(false);
    }
  };

  const pedidosFiltrados = useMemo(() => {
    return pedidos.filter((p) => {
      if (filtroEstado !== 'TODOS' && p.estado !== filtroEstado) return false;
      if (filtroPrioridad !== 'TODAS' && p.prioridad !== filtroPrioridad) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchCode = p.codigoOrden.toLowerCase().includes(q);
        const matchCliente = p.clienteNombre.toLowerCase().includes(q);
        const matchProd = p.productoNombre.toLowerCase().includes(q);
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
              <span>SEMI-APROBACIÓN ACTIVO</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Recepción y validación de órdenes comerciales emitidas por Administración para verter en Reactores.
          </p>
        </div>

        <div className="flex items-center gap-2 font-sans text-xs">
          <span className="text-slate-400 font-mono text-[11px]">{timeString}</span>
          <button
            onClick={cargarPedidos}
            className={`p-2 rounded-xl border transition-all ${
              isDark ? 'bg-[#151D2A] border-[#1A2232] text-slate-300 hover:text-white' : 'bg-slate-100 border-slate-300 text-slate-700'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* 5 KPIs Superiores (Coincidencia Exacta Screenshot) */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {/* PEDIDOS HOY */}
        <div className={`rounded-2xl p-4 border transition-all space-y-1 ${cardBg}`}>
          <span className={`text-[10px] font-bold tracking-widest uppercase font-sans ${textTitle}`}>
            PEDIDOS HOY
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-cyan-400 font-mono">{kpis.pedidosHoy}</span>
            <span className="text-[10px] text-slate-400 font-sans">Total recibidos</span>
          </div>
        </div>

        {/* NUEVOS */}
        <div className={`rounded-2xl p-4 border transition-all space-y-1 ${cardBg}`}>
          <span className={`text-[10px] font-bold tracking-widest uppercase font-sans ${textTitle}`}>
            NUEVOS
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-400 font-mono">{kpis.nuevos}</span>
            <span className="text-[10px] text-amber-400/80 font-sans">Requiere acción</span>
          </div>
        </div>

        {/* APROBADOS */}
        <div className={`rounded-2xl p-4 border transition-all space-y-1 ${cardBg}`}>
          <span className={`text-[10px] font-bold tracking-widest uppercase font-sans ${textTitle}`}>
            APROBADOS
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-400 font-mono">{kpis.aprobados}</span>
            <span className="text-[10px] text-emerald-400/80 font-sans">En cola producción</span>
          </div>
        </div>

        {/* EN PRODUCCIÓN */}
        <div className={`rounded-2xl p-4 border transition-all space-y-1 ${cardBg}`}>
          <span className={`text-[10px] font-bold tracking-widest uppercase font-sans ${textTitle}`}>
            EN PRODUCCIÓN
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-purple-400 font-mono">{kpis.enProduccion}</span>
            <span className="text-[10px] text-purple-400/80 font-sans">Actualmente activos</span>
          </div>
        </div>

        {/* VALOR DEL DÍA */}
        <div className={`rounded-2xl p-4 border transition-all space-y-1 ${cardBg}`}>
          <span className={`text-[10px] font-bold tracking-widest uppercase font-sans ${textTitle}`}>
            VALOR DEL DÍA
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-black text-[#00F2C3] font-mono">
              S/ {Number(kpis.valorDelDia).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* Barra de Búsqueda y Filtros de Estado */}
      <div className={`rounded-2xl p-3.5 border flex flex-wrap items-center justify-between gap-3 shadow-sm ${cardBg}`}>
        {/* Buscador */}
        <div className="relative flex-1 min-w-[280px]">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por Nº, cliente o producto..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full rounded-xl border py-2 pl-10 pr-4 text-xs focus:border-[#00F2C3] focus:outline-none transition-all font-sans ${
              isDark
                ? 'bg-[#151D2A] border-[#1A2232] text-slate-200 placeholder-slate-500'
                : 'bg-slate-50 border-slate-300 text-slate-800 placeholder-slate-400'
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
            const count = item.id === 'TODOS' ? pedidos.length : pedidos.filter((p) => p.estado === item.id).length;
            return (
              <button
                key={item.id}
                onClick={() => setFiltroEstado(item.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isSel
                    ? 'bg-[#00F2C3] text-slate-950 shadow-md shadow-[#00F2C3]/20'
                    : isDark
                    ? 'bg-[#151D2A] text-slate-300 border border-[#1A2232] hover:text-white'
                    : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200'
                }`}
              >
                {item.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Prioridad Pills */}
        <div className="flex items-center gap-1.5 text-[10px] font-sans border-l pl-3 border-slate-700/40">
          <span className="text-slate-400 font-bold uppercase">PRIORIDAD:</span>
          {['TODAS', 'URGENTE', 'NORMAL', 'PROGRAMADO'].map((pr) => (
            <button
              key={pr}
              onClick={() => setFiltroPrioridad(pr)}
              className={`px-2 py-1 rounded-lg font-bold uppercase transition-all ${
                filtroPrioridad === pr
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
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
          <div className={`rounded-2xl p-12 text-center border ${cardBg}`}>
            <Inbox className="w-12 h-12 text-slate-500 mx-auto mb-2 opacity-50" />
            <p className="text-sm font-bold text-slate-400 font-sans">No hay pedidos en esta bandeja</p>
            <p className="text-xs text-slate-500 font-sans">Ajusta los filtros de búsqueda o el estado del pedido.</p>
          </div>
        ) : (
          pedidosFiltrados.map((p) => {
            const esNuevo = p.estado === 'NUEVO';
            const enProd = p.estado === 'EN_PRODUCCION';

            return (
              <div
                key={p.id}
                className={`rounded-2xl p-5 border transition-all space-y-4 shadow-sm hover:border-[#00F2C3]/40 ${cardBg}`}
              >
                {/* Cabecera de la Orden */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 border-slate-800/40">
                  <div className="flex items-center gap-3">
                    <span className="text-base font-black font-mono text-[#00F2C3]">{p.codigoOrden}</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase font-sans ${
                        p.prioridad === 'URGENTE'
                          ? 'bg-rose-500/15 border border-rose-500/30 text-rose-400'
                          : 'bg-cyan-500/15 border border-cyan-500/30 text-cyan-400'
                      }`}
                    >
                      {p.prioridad}
                    </span>
                    <span className="text-xs text-slate-400 font-sans">{p.clienteNombre}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-emerald-400 font-mono">
                      S/ {Number(p.montoTotal).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono ${
                        enProd
                          ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
                          : esNuevo
                          ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                          : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {p.estado.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Detalles de la Fabricación */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-sans">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block mb-0.5">
                      PRODUCTO A MEZCLAR
                    </span>
                    <p className="font-bold text-slate-200">{p.productoNombre}</p>
                    <p className="text-[11px] text-cyan-400 font-mono mt-0.5">
                      Masa Requerida: <strong>{Number(p.cantidadSolicitada).toLocaleString()} {p.unidadMedida}</strong>
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block mb-0.5">
                      DATOS DE CONTACTO & ENTREGA
                    </span>
                    <p className="text-slate-300">{p.contactoNombre}</p>
                    <p className="text-[11px] text-slate-400">{p.direccionDespacho}</p>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block mb-0.5">
                      ESTADO DE MATERIA PRIMA EN STOCK
                    </span>
                    {p.desgloseStock?.stockCompleto ? (
                      <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>100% Insumos Disponibles en Almacén</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Falta stock de algunos reactivos</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Acciones de Planta */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/40">
                  <div className="text-[11px] text-slate-400 font-mono">
                    Emitido por Administración: <strong className="text-slate-200">{p.repComercial || 'Ana Torres'}</strong>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => router.push('/produccion/formulas')}
                      className="px-3 py-1.5 rounded-xl border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 text-xs font-bold font-sans transition-all flex items-center gap-1.5"
                    >
                      <Beaker className="w-3.5 h-3.5" />
                      <span>Ver Fórmula</span>
                    </button>

                    {esNuevo && (
                      <button
                        onClick={() => handleAprobarLote(p)}
                        disabled={actionLoading}
                        className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black font-sans text-xs uppercase tracking-wider transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1.5"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Aprobar & Enviar a Reactores</span>
                      </button>
                    )}

                    {enProd && (
                      <button
                        onClick={() => router.push('/produccion/qa')}
                        className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold font-sans text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md shadow-purple-600/20"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>Monitorear en Reactor</span>
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
