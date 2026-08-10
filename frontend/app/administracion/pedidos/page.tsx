'use client';

import React, { useState, useEffect } from 'react';
import {
  Inbox,
  Plus,
  Send,
  CheckCircle2,
  AlertCircle,
  Building2,
  Calendar,
  DollarSign,
  Package,
  Clock,
  Search,
  User,
  Phone,
  MapPin,
  FileText,
  CreditCard,
  X,
  Zap,
  Filter,
  Eye,
  Printer,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Receipt,
  Check,
  Layers,
} from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';
import { useAuth } from '@/lib/AuthContext';
import { CommercialOrderForm } from '@/components/pedidos/CommercialOrderForm';
import { CotizacionPDF, CotizacionData } from '@/components/pdf/CotizacionPDF';
import { apiFetch } from '@/lib/apiClient';

interface PedidoEmitido {
  id: string;
  codigoOrden: string;
  codigoRefAdmin?: string | null;
  docType?: string;
  cliente: string;
  ruc: string;
  producto: string;
  cantidad: number;
  unidad: string;
  precioUnitario: number;
  montoTotal: number;
  prioridad: 'URGENTE' | 'NORMAL' | 'PROGRAMADO';
  condicionPago: string;
  fechaPrometida: string;
  estado: string;
  aroma?: string | null;
  color?: string | null;
  notasAdmin?: string | null;
  observacionesClean?: string | null;
  itemsList?: any[];
}

export default function AdministracionPedidosComercialesPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [pedidos, setPedidos] = useState<PedidoEmitido[]>([]);
  const [loadingPedidos, setLoadingPedidos] = useState<boolean>(true);
  const [isCreatingOrder, setIsCreatingOrder] = useState<boolean>(false);
  const [creationDefaultMode, setCreationDefaultMode] = useState<'COTIZACION' | 'PEDIDO'>('COTIZACION');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTab, setSelectedTab] = useState<string>('TODOS');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // PDF Preview State
  const [selectedPdfData, setSelectedPdfData] = useState<CotizacionData | null>(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState<boolean>(false);

  // Convert Quotation to Order Modal State
  const [convertModalItem, setConvertModalItem] = useState<PedidoEmitido | null>(null);
  const [isConverting, setIsConverting] = useState<boolean>(false);

  // Cargar pedidos desde la API real de PostgreSQL con apiFetch
  const cargarPedidos = async () => {
    try {
      const { data, ok } = await apiFetch<any[]>('/pedidos-admin');
      if (ok && Array.isArray(data)) {
        const mapped: PedidoEmitido[] = data.map((p: any) => ({
          id: p.id,
          codigoOrden: p.codigoOrden,
          codigoRefAdmin: p.codigoRefAdmin,
          docType: p.docType || (p.codigoOrden?.startsWith('COT') ? 'COT' : 'OP'),
          cliente: p.clienteNombre,
          ruc: p.clienteRuc,
          producto: p.productoNombre,
          cantidad: Number(p.cantidadSolicitada) || 100,
          unidad: p.unidadMedida || 'KG',
          precioUnitario: p.cantidadSolicitada && Number(p.cantidadSolicitada) > 0 ? Number(p.montoTotal) / Number(p.cantidadSolicitada) : 34.5,
          montoTotal: Number(p.montoTotal) || 0,
          prioridad: p.prioridad || 'NORMAL',
          condicionPago: p.condicionPago || 'Crédito 30 días',
          fechaPrometida: p.fechaPrometida ? new Date(p.fechaPrometida).toLocaleDateString('es-PE') : '12/08/2026',
          estado: p.estado || 'NUEVO',
          aroma: p.aroma,
          color: p.color,
          notasAdmin: p.notasAdmin,
          itemsList: p.itemsList,
          observacionesClean: p.observacionesClean,
        }));
        setPedidos(mapped);
      }
    } catch (e) {
      console.log('Error cargando pedidos en administración:', e);
    } finally {
      setLoadingPedidos(false);
    }
  };


  useEffect(() => {
    cargarPedidos();

    let socket: any = null;
    try {
      const { io } = require('socket.io-client');
      socket = io('http://localhost:3001', { transports: ['websocket', 'polling'] });

      socket.on('order:created_to_plant', () => {
        cargarPedidos();
      });

      socket.on('order:status_updated', (payload: any) => {
        if (payload && (payload.ordenId || payload.codigoOrden)) {
          setPedidos((prev) =>
            prev.map((p) =>
              p.id === payload.ordenId || p.codigoOrden === payload.codigoOrden
                ? { ...p, estado: payload.estado || 'APROBADO' }
                : p
            )
          );
        }
        cargarPedidos();
      });

      socket.on('order:accepted_by_plant', (payload: any) => {
        if (payload && (payload.ordenId || payload.codigoOrden)) {
          setPedidos((prev) =>
            prev.map((p) =>
              p.id === payload.ordenId || p.codigoOrden === payload.codigoOrden
                ? { ...p, estado: payload.estado || 'APROBADO' }
                : p
            )
          );
        }
        cargarPedidos();
      });

      socket.on('lote:estado_actualizado', (payload: any) => {
        if (payload && (payload.ordenId || payload.codigoLote)) {
          setPedidos((prev) =>
            prev.map((p) =>
              p.id === payload.ordenId || payload.codigoLote.includes(p.codigoOrden.replace(/\D/g, ''))
                ? { ...p, estado: (payload.nuevoEstado || 'APROBADO') as any }
                : p
            )
          );
        }
        cargarPedidos();
      });

      socket.on('order:devolucion', () => cargarPedidos());
    } catch {}

    const handleStorageSync = () => cargarPedidos();
    window.addEventListener('storage', handleStorageSync);

    const interval = setInterval(cargarPedidos, 3000);

    return () => {
      if (socket) socket.disconnect();
      window.removeEventListener('storage', handleStorageSync);
      clearInterval(interval);
    };
  }, []);

  const cardBg = isDark ? 'bg-[#0F141C] border-[#1A2232]' : 'bg-white border-slate-200 shadow-sm';
  const inputBg = isDark
    ? 'bg-[#151D2A] border-[#1A2232] text-slate-200 focus:border-blue-500'
    : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-500';

  // Counts for tabs
  const cotizacionesCount = pedidos.filter((p) => p.docType === 'COT' || p.codigoOrden.startsWith('COT')).length;
  const pedidosCount = pedidos.filter((p) => p.docType === 'OP' || !p.codigoOrden.startsWith('COT')).length;

  // Filtered Orders
  const filteredPedidos = pedidos.filter((p) => {
    const isCot = p.docType === 'COT' || p.codigoOrden.startsWith('COT');
    const isOp = !isCot;

    const matchesSearch =
      p.codigoOrden.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.cliente.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.producto.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.ruc.includes(searchQuery);

    if (!matchesSearch) return false;

    if (selectedTab === 'TODOS') return true;
    if (selectedTab === 'COTIZACIONES') return isCot;
    if (selectedTab === 'PEDIDOS') return isOp;
    if (selectedTab === 'APROBADOS') return p.estado === 'APROBADO';
    if (selectedTab === 'EN_PRODUCCION') return p.estado === 'EN_PRODUCCION';
    return true;
  });

  const handleOpenPdfForOrder = (p: PedidoEmitido) => {
    const isCot = p.docType === 'COT' || p.codigoOrden.startsWith('COT');
    
    let itemsParsed: any[] = [];
    if (p.itemsList && Array.isArray(p.itemsList) && p.itemsList.length > 0) {
      itemsParsed = p.itemsList.map((it: any, idx: number) => ({
        id: it.id || String(idx + 1),
        codigo: it.codigoFM || it.codigo || 'FM-0001',
        descripcion: it.productoNombre || it.descripcion,
        variante: it.varianteId || it.variante,
        aroma: it.aroma,
        color: it.color,
        cantidad: Number(it.cantidad) || 100,
        unidad: it.unidadMedida || it.unidad || 'KG',
        precioUnitario: Number(it.precioUnitario) || 34.5,
        importeTotal: (Number(it.cantidad) || 100) * (Number(it.precioUnitario) || 34.5),
      }));
    } else if (p.notasAdmin) {
      try {
        const parsed = JSON.parse(p.notasAdmin);
        if (parsed && Array.isArray(parsed.items) && parsed.items.length > 0) {
          itemsParsed = parsed.items.map((it: any, idx: number) => ({
            id: it.id || String(idx + 1),
            codigo: it.codigoFM || it.codigo || 'FM-0001',
            descripcion: it.productoNombre || it.descripcion,
            variante: it.varianteId || it.variante,
            aroma: it.aroma,
            color: it.color,
            cantidad: Number(it.cantidad) || 100,
            unidad: it.unidadMedida || it.unidad || 'KG',
            precioUnitario: Number(it.precioUnitario) || 34.5,
            importeTotal: (Number(it.cantidad) || 100) * (Number(it.precioUnitario) || 34.5),
          }));
        }
      } catch {}
    }

    const cotData: CotizacionData = {
      codigoOrden: p.codigoOrden,
      codigoRefAdmin: p.codigoRefAdmin,
      fecha: p.fechaPrometida,
      clienteNombre: p.cliente,
      clienteRuc: p.ruc,
      condicionPago: p.condicionPago,
      productoNombre: p.producto,
      aroma: p.aroma,
      color: p.color,
      cantidad: p.cantidad,
      unidad: p.unidad,
      precioUnitario: p.precioUnitario,
      montoTotal: p.montoTotal,
      notasAdmin: p.observacionesClean || p.notasAdmin,
      attachTDS: true,
      docType: isCot ? 'COT' : 'OP',
      items: itemsParsed.length > 0 ? itemsParsed : undefined,
    };
    setSelectedPdfData(cotData);
    setIsPdfModalOpen(true);
  };



  // Convert Cotización to Pedido Comercial
  const handleConfirmConvert = async () => {
    if (!convertModalItem) return;
    setIsConverting(true);

    try {
      const { data, ok, error } = await apiFetch(`/pedidos-admin/${convertModalItem.id}/convertir-a-pedido`, {
        method: 'POST',
        body: JSON.stringify({
          prioridad: convertModalItem.prioridad || 'URGENTE',
          observaciones: `Cotización ${convertModalItem.codigoOrden} aprobada por el cliente y transferida a Producción.`,
        }),
      });

      if (ok) {
        setToastMsg(`✓ Cotización ${convertModalItem.codigoOrden} aceptada y transmitida a Planta como Orden de Producción.`);
        setConvertModalItem(null);
        cargarPedidos();
      } else {
        setToastMsg(`Error al convertir: ${error || 'No se pudo procesar'}`);
      }
    } catch (e) {
      console.error('Error convirtiendo cotización a pedido:', e);
    } finally {
      setIsConverting(false);
    }
  };

  // ── SI ESTÁ EN MODO CREACIÓN DE PEDIDO ──
  if (isCreatingOrder) {
    return (
      <div className="space-y-6 font-sans min-h-screen">
        <CommercialOrderForm
          mode={creationDefaultMode}
          onCancel={() => setIsCreatingOrder(false)}
          onSuccess={() => {
            cargarPedidos();
            setIsCreatingOrder(false);
          }}
        />
      </div>
    );
  }

  // ── VISTA PRINCIPAL: TABLA DE PEDIDOS & COTIZACIONES A PANTALLA COMPLETA ──
  return (
    <div className="space-y-6 font-sans min-h-screen">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-4 right-4 z-50 px-4 py-3 rounded-2xl shadow-2xl border bg-emerald-500/20 border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-3 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
          <button onClick={() => setToastMsg(null)} className="ml-2 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Banner Principal & Botones de Emisión */}
      <div className={`rounded-2xl p-6 border flex flex-wrap items-center justify-between gap-4 transition-all shadow-sm ${cardBg}`}>
        <div className="flex items-center gap-3.5">
          <div className={`p-3.5 rounded-2xl border ${isDark ? 'bg-orange-500/10 border-orange-500/30 text-orange-400' : 'bg-orange-50 border-orange-200 text-orange-700'}`}>
            <Inbox className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className={`text-xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Gestión Comercial: Cotizaciones & Pedidos de Planta
              </h1>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase ${
                isDark ? 'bg-orange-500/10 border border-orange-500/30 text-orange-400' : 'bg-orange-100 border border-orange-300 text-orange-800'
              }`}>
                PORTAL ADMINISTRACIÓN
              </span>
            </div>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Emite cotizaciones preliminares para clientes, convértelas en pedidos con un clic al ser aceptadas y transmite las órdenes a los reactores de Planta.
            </p>
          </div>
        </div>

        {/* Botón Único de Emisión */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              setCreationDefaultMode('COTIZACION');
              setIsCreatingOrder(true);
            }}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/25 flex items-center gap-2"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ Nueva Cotización / Pedido</span>
          </button>
        </div>
      </div>


      {/* Tabla Completa con Barra de Búsqueda y Tabs */}
      <div className={`rounded-2xl p-6 border space-y-5 shadow-sm ${cardBg}`}>
        {/* Controls Bar: Search & Filter Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
          {/* Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
            <button
              onClick={() => setSelectedTab('TODOS')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold font-sans transition-all border ${
                selectedTab === 'TODOS'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : isDark
                  ? 'bg-[#151D2A] text-slate-400 border-[#1A2232] hover:text-slate-200'
                  : 'bg-slate-100 text-slate-600 border-slate-300 hover:text-slate-900'
              }`}
            >
              Todos ({pedidos.length})
            </button>

            <button
              onClick={() => setSelectedTab('COTIZACIONES')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold font-sans transition-all border flex items-center gap-1.5 ${
                selectedTab === 'COTIZACIONES'
                  ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                  : isDark
                  ? 'bg-[#151D2A] text-orange-400 border-[#1A2232] hover:text-orange-300'
                  : 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Cotizaciones ({cotizacionesCount})</span>
            </button>

            <button
              onClick={() => setSelectedTab('PEDIDOS')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold font-sans transition-all border flex items-center gap-1.5 ${
                selectedTab === 'PEDIDOS'
                  ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                  : isDark
                  ? 'bg-[#151D2A] text-teal-400 border-[#1A2232] hover:text-teal-300'
                  : 'bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Pedidos a Planta ({pedidosCount})</span>
            </button>

            <button
              onClick={() => setSelectedTab('APROBADOS')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold font-sans transition-all border ${
                selectedTab === 'APROBADOS'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                  : isDark
                  ? 'bg-[#151D2A] text-slate-400 border-[#1A2232] hover:text-slate-200'
                  : 'bg-slate-100 text-slate-600 border-slate-300 hover:text-slate-900'
              }`}
            >
              Aprobados
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por código, cliente o RUC..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full rounded-xl border py-2 pl-9 pr-3 text-xs focus:outline-none transition-all ${inputBg}`}
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className={`border-b text-[10px] uppercase font-bold tracking-wider ${
                isDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-700 bg-slate-50'
              }`}>
                <th className="py-3 px-3">TIPO / CÓDIGO</th>
                <th className="py-3 px-3">CLIENTE & RUC</th>
                <th className="py-3 px-3">PRODUCTO / FÓRMULA</th>
                <th className="py-3 px-3">PERSONALIZACIÓN</th>
                <th className="py-3 px-3 text-right">CANTIDAD</th>
                <th className="py-3 px-3 text-right">TOTAL (S/)</th>
                <th className="py-3 px-3 text-center">ESTADO</th>
                <th className="py-3 px-3 text-center">ACCIONES COMERCIALES</th>
              </tr>
            </thead>
            <tbody className={`divide-y text-xs ${
              isDark ? 'divide-slate-800/60' : 'divide-slate-100'
            }`}>
              {filteredPedidos.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center">
                    <Inbox className="w-10 h-10 mx-auto mb-2 text-slate-400 opacity-60" />
                    <p className={`text-sm font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      No se encontraron registros en esta pestaña
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Usa los botones superiores para emitir una nueva Cotización o Pedido.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredPedidos.map((p) => {
                  const isCot = p.docType === 'COT' || p.codigoOrden.startsWith('COT');
                  return (
                    <tr key={p.id} className={`transition-colors ${
                      isDark ? 'hover:bg-[#151D2A]/60' : 'hover:bg-slate-50'
                    }`}>
                      {/* Código y Tipo */}
                      <td className="py-3 px-3 font-mono font-bold">
                        <div className="flex items-center gap-1.5">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-black ${
                            isCot
                              ? 'bg-gradient-to-r from-orange-500/20 to-amber-500/20 text-orange-400 border border-orange-500/40'
                              : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          }`}>
                            {isCot ? 'COTIZACIÓN' : 'ORDEN OP'}
                          </span>
                          <span className={isDark ? 'text-slate-200' : 'text-slate-900'}>
                            {p.codigoOrden}
                          </span>
                        </div>
                        {p.codigoRefAdmin && (
                          <div className="text-[10px] text-slate-500 font-mono">
                            Origen: {p.codigoRefAdmin}
                          </div>
                        )}
                      </td>

                      {/* Cliente */}
                      <td className="py-3 px-3">
                        <div className={`font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                          {p.cliente}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          RUC: {p.ruc} · {p.condicionPago}
                        </div>
                      </td>

                      {/* Producto */}
                      <td className="py-3 px-3">
                        {p.itemsList && p.itemsList.length > 0 ? (
                          <div className="space-y-1">
                            {p.itemsList.map((it: any, i: number) => (
                              <div key={i} className="text-xs flex items-center gap-1.5 font-medium">
                                <span className="text-[10px] font-mono text-amber-500 font-bold">#{i + 1}</span>
                                <span className={`font-semibold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                                  {it.productoNombre || it.descripcion}
                                </span>
                                <span className="text-[10px] text-slate-500 font-mono">
                                  ({it.cantidad} {it.unidadMedida || it.unidad || 'KG'})
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className={`font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                            {p.producto?.replace(/\s*\(\+\d+\s*adicionales\)/i, '')}
                          </div>
                        )}

                      </td>


                      {/* Personalización */}
                      <td className="py-3 px-3">
                        {(p.aroma || p.color) ? (
                          <div className="flex flex-wrap gap-1">
                            {p.aroma && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                                {p.aroma}
                              </span>
                            )}
                            {p.color && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                {p.color}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-500">Estándar</span>
                        )}
                      </td>

                      {/* Cantidad */}
                      <td className="py-3 px-3 text-right font-mono font-bold text-teal-500">
                        {p.cantidad.toLocaleString()} {p.unidad}
                      </td>

                      {/* Monto Total */}
                      <td className="py-3 px-3 text-right font-mono font-black text-emerald-400">
                        S/ {p.montoTotal.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                      </td>

                      {/* Estado */}
                      <td className="py-3 px-3 text-center">
                        {isCot ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase font-mono bg-orange-500/10 border border-orange-500/30 text-orange-400">
                            COTIZACIÓN EMITIDA
                          </span>
                        ) : (
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase font-mono ${
                            p.estado === 'APROBADO' || p.estado === 'COMPLETADO'
                              ? isDark
                                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                                : 'bg-emerald-100 border border-emerald-300 text-emerald-800 font-black'
                              : p.estado === 'EN_PRODUCCION'
                              ? isDark
                                ? 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-400'
                                : 'bg-cyan-100 border border-cyan-300 text-cyan-800 font-black'
                              : p.estado === 'PENDIENTE_REVISION'
                              ? isDark
                                ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
                                : 'bg-amber-100 border border-amber-300 text-amber-800 font-black'
                              : isDark
                              ? 'bg-blue-500/10 border border-blue-500/30 text-blue-400'
                              : 'bg-blue-100 border border-blue-300 text-blue-800 font-black'
                          }`}>
                            {p.estado}
                          </span>
                        )}
                      </td>

                      {/* Acciones */}
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {isCot ? (
                            <>
                              {/* Botón Aceptar Cotización y Pasar a Pedido */}
                              <button
                                onClick={() => setConvertModalItem(p)}
                                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold tracking-wider flex items-center gap-1 shadow-sm transition-all"
                                title="Aceptar Cotización y Transmitir como Pedido a Planta"
                              >
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                                <span>Aceptar & Pedido</span>
                              </button>

                              {/* Botón Ver PDF Cotización */}
                              <button
                                onClick={() => handleOpenPdfForOrder(p)}
                                className={`p-1.5 rounded-lg border transition-colors ${
                                  isDark
                                    ? 'bg-[#151D2A] border-[#1A2232] text-orange-400 hover:text-white hover:border-orange-500'
                                    : 'bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100'
                                }`}
                                title="Ver / Imprimir Cotización Oficial"
                              >
                                <FileText className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <>
                              {/* Botón Ver Boleta / Pedido */}
                              <button
                                onClick={() => handleOpenPdfForOrder(p)}
                                className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold flex items-center gap-1 transition-colors ${
                                  isDark
                                    ? 'bg-[#151D2A] border-[#1A2232] text-teal-400 hover:text-white hover:border-teal-500'
                                    : 'bg-teal-50 border-teal-200 text-teal-700 hover:bg-teal-100'
                                }`}
                                title="Ver / Imprimir Boleta o Comprobante"
                              >
                                <Receipt className="w-3.5 h-3.5" />
                                <span>Ver Boleta</span>
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── MODAL PARA CONFIRMAR CONVERSIÓN DE COTIZACIÓN A PEDIDO (OP) ── */}
      {convertModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 font-sans animate-in fade-in duration-200">
          <div className={`w-full max-w-lg rounded-2xl p-6 border space-y-4 shadow-2xl ${cardBg}`}>
            <div className="flex items-center gap-3 border-b pb-3 text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
              <div>
                <h3 className="text-sm font-bold text-slate-100">Aprobar Cotización y Convertir a Pedido de Planta</h3>
                <p className="text-xs text-slate-400">El cliente ha aceptado la cotización. Se emitirá la Orden de Producción (OP).</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Cotización:</span>
                <strong className="text-orange-400 font-bold">{convertModalItem.codigoOrden}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Cliente:</span>
                <strong className="text-slate-200">{convertModalItem.cliente}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Producto:</span>
                <strong className="text-slate-200">{convertModalItem.producto}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Cantidad:</span>
                <strong className="text-teal-400 font-bold">{convertModalItem.cantidad} {convertModalItem.unidad}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Monto Total:</span>
                <strong className="text-emerald-400 font-black">S/ {convertModalItem.montoTotal.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</strong>
              </div>
            </div>

            <p className="text-xs text-slate-300">
              Al confirmar, se generará el código de Orden de Producción formal y la solicitud viajará de inmediato a la bandeja de Pedidos Entrantes en Planta.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setConvertModalItem(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-bold hover:bg-slate-800"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={isConverting}
                onClick={handleConfirmConvert}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black uppercase tracking-wider shadow-lg flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{isConverting ? 'Procesando...' : 'Confirmar & Enviar a Planta'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PDF Modal */}
      {selectedPdfData && (
        <CotizacionPDF
          isOpen={isPdfModalOpen}
          onClose={() => setIsPdfModalOpen(false)}
          data={selectedPdfData}
        />
      )}
    </div>
  );
}
