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
  Pencil,
} from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';
import { useAuth } from '@/lib/AuthContext';
import { useSocket } from '@/lib/socketContext';
import { CommercialOrderForm } from '@/components/pedidos/CommercialOrderForm';
import { CotizacionPDF, CotizacionData } from '@/components/pdf/CotizacionPDF';
import { apiFetch } from '@/lib/apiClient';
import { isGerenteUser } from '@/config/permissions';

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
  aromaText?: string | null;
  colorText?: string | null;
  aditivos?: any[];
  notasAdmin?: string | null;
  observacionesClean?: string | null;
  itemsList?: any[];
}

const pedidosAdminCache = new Map<string, { data: PedidoEmitido[]; timestamp: number }>();

export default function AdministracionPedidosComercialesPage() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { socket } = useSocket();
  const isDark = theme === 'dark';
  const canApprove = isGerenteUser(user?.role) || user?.role === 'ASISTENTE_ADMINISTRATIVO';

  const [pedidos, setPedidos] = useState<PedidoEmitido[]>([]);
  const [loadingPedidos, setLoadingPedidos] = useState<boolean>(true);
  const [isCreatingOrder, setIsCreatingOrder] = useState<boolean>(false);
  const [creationDefaultMode, setCreationDefaultMode] = useState<'COTIZACION' | 'PEDIDO'>('COTIZACION');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // R1 — Emisión de comprobante (Boleta / Factura / Nota de Venta)
  const [emitModalItem, setEmitModalItem] = useState<PedidoEmitido | null>(null);
  const [emitTipo, setEmitTipo] = useState<'BOLETA' | 'FACTURA' | 'NOTA_VENTA'>('FACTURA');
  const [emitLoading, setEmitLoading] = useState<boolean>(false);
  const [emitError, setEmitError] = useState<string>('');
  const [emitResult, setEmitResult] = useState<string>('');
  const getTodayISO = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [selectedDate, setSelectedDate] = useState<string>(getTodayISO());
  const [selectedTab, setSelectedTab] = useState<string>('TODOS');
  // R4 — Filtro por etiqueta (tipo de comprobante emitido)
  const [filtroTipo, setFiltroTipo] = useState<string>('TODOS');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // PDF Preview State
  const [selectedPdfData, setSelectedPdfData] = useState<CotizacionData | null>(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState<boolean>(false);

  // Convert Quotation to Order Modal State
  const [convertModalItem, setConvertModalItem] = useState<PedidoEmitido | null>(null);
  const [isConverting, setIsConverting] = useState<boolean>(false);

  // Modal de Edición de Pedido
  const [editModalItem, setEditModalItem] = useState<PedidoEmitido | null>(null);
  const [editCliente, setEditCliente] = useState<string>('');
  const [editRuc, setEditRuc] = useState<string>('');
  const [editProducto, setEditProducto] = useState<string>('');
  const [editCantidad, setEditCantidad] = useState<string>('0');
  const [editUnidad, setEditUnidad] = useState<string>('KG');
  const [editMonto, setEditMonto] = useState<string>('0');
  const [editCondicion, setEditCondicion] = useState<string>('Contado');
  const [editPrioridad, setEditPrioridad] = useState<'URGENTE' | 'NORMAL' | 'PROGRAMADO'>('NORMAL');
  const [editEstado, setEditEstado] = useState<string>('NUEVO');
  const [editFechaPrometida, setEditFechaPrometida] = useState<string>('');
  const [editTipoComprobante, setEditTipoComprobante] = useState<string>('FACTURA');
  const [editFormulaId, setEditFormulaId] = useState<string>('');
  const [editLoading, setEditLoading] = useState<boolean>(false);
  const [editError, setEditError] = useState<string>('');

  // Navegación de fecha por días
  const handlePrevDay = () => {
    if (selectedDate === 'TODOS') {
      setSelectedDate(getTodayISO());
      return;
    }
    const [y, m, d] = selectedDate.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    dateObj.setDate(dateObj.getDate() - 1);
    const ny = dateObj.getFullYear();
    const nm = String(dateObj.getMonth() + 1).padStart(2, '0');
    const nd = String(dateObj.getDate()).padStart(2, '0');
    setSelectedDate(`${ny}-${nm}-${nd}`);
  };

  const handleNextDay = () => {
    if (selectedDate === 'TODOS') {
      setSelectedDate(getTodayISO());
      return;
    }
    const [y, m, d] = selectedDate.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    dateObj.setDate(dateObj.getDate() + 1);
    const ny = dateObj.getFullYear();
    const nm = String(dateObj.getMonth() + 1).padStart(2, '0');
    const nd = String(dateObj.getDate()).padStart(2, '0');
    setSelectedDate(`${ny}-${nm}-${nd}`);
  };

  const formatFechaVisual = (fechaISO: string) => {
    if (fechaISO === 'TODOS') return 'Histórico Completo';
    const [y, m, d] = fechaISO.split('-');
    return `${d}/${m}/${y}`;
  };

  // Cache en memoria para navegación instantánea entre vistas
  // (se revalida en segundo plano y se limpia en mutaciones)
  // Cargar pedidos desde la API real de PostgreSQL con apiFetch
  const cargarPedidos = async (force = false) => {
    const url = `/pedidos-admin${selectedDate ? `?fecha=${selectedDate}` : ''}`;
    const cached = pedidosAdminCache.get(url);

    if (cached && !force) {
      setPedidos(cached.data);
      setLoadingPedidos(false);
      if (Date.now() - cached.timestamp < 30_000) {
        return;
      }
    } else if (!cached) {
      setLoadingPedidos(true);
    }

    try {
      const { data, ok } = await apiFetch<any[]>(url);
      if (ok && Array.isArray(data)) {
        const mapped: PedidoEmitido[] = data.map((p: any) => ({
          id: p.id,
          codigoOrden: p.codigoOrden,
          codigoRefAdmin: p.codigoRefAdmin,
          docType: p.docType || (p.codigoOrden?.startsWith('COT') ? 'COT' : 'OP'),
          cliente: p.clienteNombre,
          ruc: p.clienteRuc,
          producto: p.productoNombre,
          cantidad: Number(p.cantidadSolicitada) || 0,
          unidad: p.unidadMedida || 'KG',
          precioUnitario: p.cantidadSolicitada && Number(p.cantidadSolicitada) > 0 ? Number(p.montoTotal) / Number(p.cantidadSolicitada) : 0,
          montoTotal: Number(p.montoTotal) || 0,
          prioridad: p.prioridad || 'NORMAL',
          condicionPago: p.condicionPago || 'Crédito 30 días',
          fechaPrometida: p.fechaPrometida ? new Date(p.fechaPrometida).toLocaleDateString('es-PE') : '',
          estado: p.estado || 'NUEVO',
          aroma: p.aroma,
          color: p.color,
          aromaText: p.aromaText || p.aroma,
          colorText: p.colorText || p.color,
          aditivos: p.aditivos || [],
          notasAdmin: p.notasAdmin,
          itemsList: p.itemsList,
          observacionesClean: p.observacionesClean,
          tipoComprobante: p.tipoComprobante || null,
        }));
        pedidosAdminCache.set(url, { data: mapped, timestamp: Date.now() });
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
  }, [selectedDate]);

  useEffect(() => {
    if (!socket) return;
    const onCreated = () => cargarPedidos();
    const onStatus = (payload: any) => {
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
    };
    const onLote = (payload: any) => {
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
    };
    socket.on('order:created_to_plant', onCreated);
    socket.on('order:status_updated', onStatus);
    socket.on('order:accepted_by_plant', onStatus);
    socket.on('lote:estado_actualizado', onLote);
    socket.on('order:devolucion', onCreated);
    return () => {
      socket.off('order:created_to_plant', onCreated);
      socket.off('order:status_updated', onStatus);
      socket.off('order:accepted_by_plant', onStatus);
      socket.off('lote:estado_actualizado', onLote);
      socket.off('order:devolucion', onCreated);
    };
  }, [socket]);

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

  // R4 — Conteos y filtrado por etiqueta (tipo de comprobante)
  const countByTipo = (tipo: string) =>
    pedidos.filter((p) => (tipo === 'SIN_EMITIR' ? !p.tipoComprobante : p.tipoComprobante === tipo)).length;

  const filteredPedidosConEtiqueta = filteredPedidos.filter((p) => {
    if (filtroTipo === 'TODOS') return true;
    if (filtroTipo === 'SIN_EMITIR') return !p.tipoComprobante;
    return p.tipoComprobante === filtroTipo;
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

  const toISODate = (local: string) => {
    const m = local.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    return m ? `${m[3]}-${m[2]}-${m[1]}` : local || '';
  };

  const abrirModalEditar = (p: PedidoEmitido) => {
    setEditModalItem(p);
    setEditCliente(p.cliente);
    setEditRuc(p.ruc);
    setEditProducto(p.producto);
    setEditCantidad(String(p.cantidad));
    setEditUnidad(p.unidad);
    setEditMonto(String(p.montoTotal));
    setEditCondicion(p.condicionPago);
    setEditPrioridad((p.prioridad || 'NORMAL') as 'URGENTE' | 'NORMAL' | 'PROGRAMADO');
    setEditEstado(p.estado);
    setEditTipoComprobante(p.tipoComprobante || 'FACTURA');
    setEditFormulaId(
      Array.isArray(p.itemsList) && p.itemsList[0]?.codigoFM ? String(p.itemsList[0].codigoFM) : ''
    );
    setEditFechaPrometida(toISODate(p.fechaPrometida));
    setEditError('');
  };

  const handleGuardarEdicionPedido = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editModalItem) return;
    setEditLoading(true);
    setEditError('');

    const payload: any = {
      clienteNombre: editCliente,
      clienteRuc: editRuc,
      productoNombre: editProducto,
      cantidadSolicitada: Number(editCantidad),
      unidadMedida: editUnidad,
      montoTotal: Number(editMonto),
      condicionPago: editCondicion,
      prioridad: editPrioridad,
      estado: editEstado,
      fechaPrometida: editFechaPrometida,
      tipoComprobante: editTipoComprobante || undefined,
    };
    if (editFormulaId.trim()) payload.formulaId = editFormulaId.trim();

    try {
      const { ok, error } = await apiFetch(`/pedidos-admin/${editModalItem.id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      if (!ok) {
        setEditError(error || 'No se pudo actualizar el pedido.');
        return;
      }

      setPedidos((prev) =>
        prev.map((p) =>
          p.id === editModalItem.id
            ? {
                ...p,
                cliente: editCliente,
                ruc: editRuc,
                producto: editProducto,
                cantidad: Number(editCantidad) || 0,
                unidad: editUnidad,
                montoTotal: Number(editMonto) || 0,
                condicionPago: editCondicion,
                prioridad: editPrioridad,
                estado: editEstado,
                tipoComprobante: editTipoComprobante || null,
              }
            : p
        )
      );
      setToastMsg(`✓ Pedido ${editModalItem.codigoOrden} actualizado correctamente.`);
      setEditModalItem(null);
      cargarPedidos();
    } catch (err) {
      console.error('Error al actualizar pedido:', err);
      setEditError('Error de conexión al actualizar el pedido.');
    } finally {
      setEditLoading(false);
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

  // ── R1: Emitir comprobante (Boleta / Factura / Nota de Venta) ──
  const handleEmitirComprobante = async () => {
    if (!emitModalItem) return;
    setEmitLoading(true);
    setEmitError('');
    setEmitResult('');
    try {
      const res = await apiFetch(`/pedidos-admin/${emitModalItem.id}/emitir-comprobante`, {
        method: 'POST',
        body: JSON.stringify({ tipo: emitTipo }),
      });
      if (res.ok) {
        setEmitResult(`Comprobante emitido: ${res.data?.tipoComprobante} • ${res.data?.cuentaCobrar}`);
        setEmitModalItem(null);
        cargarPedidos();
      } else {
        setEmitError(res.error || 'No se pudo emitir el comprobante.');
      }
    } catch {
      setEmitError('Error de conexión al emitir el comprobante.');
    } finally {
      setEmitLoading(false);
    }
  };

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

      {/* Banner Principal & Botones de Emisión con Luces Neón */}
      <div className={`rounded-2xl p-6 border flex flex-wrap items-center justify-between gap-4 transition-all shadow-sm ${cardBg}`}>
        <div className="flex items-center gap-3.5">
          <div className={`p-3.5 rounded-2xl border ${isDark ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 shadow-lg shadow-amber-500/10' : 'bg-amber-50 border-orange-200 text-orange-700'}`}>
            <Inbox className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className={`text-xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Gestión Comercial: Cotizaciones & Pedidos de Planta
              </h1>
              <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold font-mono uppercase flex items-center gap-1.5 shadow-sm ${
                isDark ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400' : 'bg-orange-100 border border-orange-300 text-orange-800'
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 led-pulse" />
                PORTAL ADMINISTRACIÓN
              </span>
            </div>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Emite cotizaciones preliminares para clientes, convértelas en pedidos con un clic al ser aceptadas y transmite las órdenes a los reactores de Planta.
            </p>
          </div>
        </div>

        {/* Botón Único de Emisión con Glow */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              setCreationDefaultMode('COTIZACION');
              setIsCreatingOrder(true);
            }}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/25 active:scale-95 flex items-center gap-2"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Nueva Cotización / Pedido</span>
          </button>
        </div>
      </div>

      {/* Tabla Completa con Barra de Búsqueda, Filtro por Día y Tabs */}
      <div className={`rounded-2xl p-6 border space-y-5 shadow-sm ${cardBg}`}>
        {/* BARRA NAVEGADORA DE FECHA POR DÍA */}
        <div className={`p-3.5 rounded-xl border flex flex-wrap items-center justify-between gap-3 font-sans ${
          isDark ? 'bg-[#151D2A]/70 border-[#1A2232]' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center gap-2">
            <Calendar className={`w-4 h-4 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
            <span className={`text-xs font-bold uppercase tracking-wider ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>
              FILTRAR REGISTRO COMERCIAL POR DÍA:
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Botón Día Anterior */}
            <button
              type="button"
              onClick={handlePrevDay}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
                isDark
                  ? 'bg-[#0F141C] border-[#1A2232] text-slate-200 hover:border-amber-500/50 hover:bg-[#151D2A]'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100 shadow-sm'
              }`}
            >
              <span>&lt; Día Anterior</span>
            </button>

            {/* Selector interactivo con Picker de Fecha */}
            <div className={`relative flex items-center rounded-xl border px-3 py-1.5 text-xs font-bold font-mono ${
              selectedDate !== 'TODOS'
                ? isDark
                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 ring-1 ring-amber-500/20 shadow-sm shadow-amber-500/10'
                  : 'bg-amber-50 border-amber-300 text-amber-900 shadow-sm'
                : isDark
                ? 'bg-[#0F141C] border-[#1A2232] text-slate-400'
                : 'bg-white border-slate-300 text-slate-600'
            }`}>
              <span>{formatFechaVisual(selectedDate)}</span>
              <input
                type="date"
                value={selectedDate === 'TODOS' ? '' : selectedDate}
                onChange={(e) => {
                  if (e.target.value) setSelectedDate(e.target.value);
                }}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <Calendar className="w-3.5 h-3.5 ml-2 text-amber-400 pointer-events-none" />
            </div>

            {/* Botón Día Siguiente */}
            <button
              type="button"
              onClick={handleNextDay}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
                isDark
                  ? 'bg-[#0F141C] border-[#1A2232] text-slate-200 hover:border-amber-500/50 hover:bg-[#151D2A]'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100 shadow-sm'
              }`}
            >
              <span>Día Siguiente &gt;</span>
            </button>

            {/* Atajo Ver Histórico Completo */}
            <button
              type="button"
              onClick={() => setSelectedDate('TODOS')}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                selectedDate === 'TODOS'
                  ? 'bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-500/20'
                  : isDark
                  ? 'bg-[#0F141C] border-[#1A2232] text-slate-400 hover:text-white'
                  : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-100'
              }`}
            >
              Ver Todo el Histórico
            </button>
          </div>
        </div>

        {/* Controls Bar: Search & Filter Tabs con Segmented Neón */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
          {/* Tabs con Resplandor */}
          <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
            <button
              onClick={() => setSelectedTab('TODOS')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-sans transition-all border ${
                selectedTab === 'TODOS'
                  ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/30 font-black'
                  : isDark
                  ? 'bg-[#151D2A] text-slate-400 border-[#1A2232] hover:text-slate-200 hover:border-slate-700'
                  : 'bg-slate-100 text-slate-600 border-slate-300 hover:text-slate-900'
              }`}
            >
              Todos ({pedidos.length})
            </button>

            <button
              onClick={() => setSelectedTab('COTIZACIONES')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-sans transition-all border flex items-center gap-1.5 ${
                selectedTab === 'COTIZACIONES'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 border-amber-400 shadow-md shadow-orange-500/30 font-black'
                  : isDark
                  ? 'bg-[#151D2A] text-orange-400 border-[#1A2232] hover:text-orange-300 hover:border-orange-500/40'
                  : 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Cotizaciones ({cotizacionesCount})</span>
            </button>

            <button
              onClick={() => setSelectedTab('PEDIDOS')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-sans transition-all border flex items-center gap-1.5 ${
                selectedTab === 'PEDIDOS'
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 border-teal-400 shadow-md shadow-teal-500/30 font-black'
                  : isDark
                  ? 'bg-[#151D2A] text-teal-400 border-[#1A2232] hover:text-teal-300 hover:border-teal-500/40'
                  : 'bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Pedidos a Planta ({pedidosCount})</span>
            </button>

            <button
              onClick={() => setSelectedTab('APROBADOS')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-sans transition-all border ${
                selectedTab === 'APROBADOS'
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-500/30 font-black'
                  : isDark
                  ? 'bg-[#151D2A] text-slate-400 border-[#1A2232] hover:text-slate-200 hover:border-slate-700'
                  : 'bg-slate-100 text-slate-600 border-slate-300 hover:text-slate-900'
              }`}
            >
              Aprobados
            </button>
          </div>

          {/* R4 — Filtro por etiqueta (Tipo de Comprobante) */}
          <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
            {[
              { key: 'TODOS', label: 'Todas las etiquetas', count: pedidos.length },
              { key: 'SIN_EMITIR', label: 'Sin emitir', count: countByTipo('SIN_EMITIR') },
              { key: 'BOLETA', label: 'Boleta', count: countByTipo('BOLETA') },
              { key: 'FACTURA', label: 'Factura', count: countByTipo('FACTURA') },
              { key: 'NOTA_VENTA', label: 'Nota de Venta', count: countByTipo('NOTA_VENTA') },
            ].map((f) => {
              const active = filtroTipo === f.key;
              const color =
                f.key === 'FACTURA'
                  ? 'bg-blue-500/20 text-blue-400 border-blue-500/40 shadow-sm shadow-blue-500/10'
                  : f.key === 'BOLETA'
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-sm shadow-emerald-500/10'
                  : f.key === 'NOTA_VENTA'
                  ? 'bg-purple-500/20 text-purple-400 border-purple-500/40 shadow-sm shadow-purple-500/10'
                  : f.key === 'SIN_EMITIR'
                  ? 'bg-slate-500/20 text-slate-300 border-slate-500/40'
                  : 'bg-amber-500/20 text-amber-400 border-amber-500/40 shadow-sm shadow-amber-500/10';
              return (
                <button
                  key={f.key}
                  onClick={() => setFiltroTipo(f.key)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold font-sans transition-all border flex items-center gap-1.5 ${
                    active
                      ? `${color} shadow-sm font-bold`
                      : isDark
                      ? 'bg-[#151D2A] text-slate-400 border-[#1A2232] hover:text-slate-200'
                      : 'bg-slate-100 text-slate-600 border-slate-300 hover:text-slate-900'
                  }`}
                >
                  <Filter className="w-3.5 h-3.5" />
                  <span>{f.label}</span>
                  <span className="px-1.5 py-0.5 rounded bg-black/20 text-[10px] font-mono">{f.count}</span>
                </button>
              );
            })}
          </div>

          {/* Search Bar con Focus Glow */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por código, cliente o RUC..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full rounded-xl border py-2 pl-10 pr-4 text-xs focus:border-amber-400 focus:outline-none transition-all ${inputBg}`}
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
              {filteredPedidosConEtiqueta.length === 0 ? (
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
                filteredPedidosConEtiqueta.map((p) => {
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
                          <span className={isDark ? 'text-slate-200' : 'text-slate-900 font-bold'}>
                            {p.codigoOrden}
                          </span>
                        </div>
                        {p.codigoRefAdmin && (
                          <div className="text-[10px] text-slate-500 font-mono">
                            Origen: {p.codigoRefAdmin}
                          </div>
                        )}
                        {p.tipoComprobante && (
                          <span className={`mt-1 inline-block px-2 py-0.5 rounded text-[9px] font-black border ${
                            p.tipoComprobante === 'FACTURA'
                              ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                              : p.tipoComprobante === 'BOLETA'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                          }`}>
                            {p.tipoComprobante === 'FACTURA' ? 'FACTURA' : p.tipoComprobante === 'BOLETA' ? 'BOLETA' : 'NOTA VENTA'}
                          </span>
                        )}
                      </td>

                      {/* Cliente */}
                      <td className="py-3 px-3">
                        <div className={`font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                          {p.cliente}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          RUC: {p.ruc} • {p.condicionPago}
                        </div>
                      </td>

                      {/* Producto */}
                      <td className="py-3 px-3">
                        {p.itemsList && p.itemsList.length > 0 ? (
                          <div className="space-y-1">
                            {p.itemsList.map((it: any, i: number) => (
                              <div key={i} className="text-xs flex items-center gap-1.5 font-medium">
                                <span className={`text-[10px] font-mono font-bold ${isDark ? 'text-amber-500' : 'text-amber-700'}`}>#{i + 1}</span>
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
                          <div className={`font-medium ${isDark ? 'text-slate-200' : 'text-slate-900 font-semibold'}`}>
                            {p.producto?.replace(/\s*\(\+\d+\s*adicionales\)/i, '')}
                          </div>
                        )}

                      </td>


                      {/* Personalización */}
                      <td className="py-3 px-3">
                        {p.aditivos && p.aditivos.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {p.aditivos.map((ad: any, adIdx: number) => (
                              <span
                                key={adIdx}
                                className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${
                                  ad.tipo === 'FRAGANCIA'
                                    ? isDark ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-purple-50 text-purple-800 border-purple-200'
                                    : isDark ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-amber-50 text-amber-800 border-amber-200'
                                }`}
                                title={`${ad.insumo?.nombre || 'Aditivo'}: ${ad.porcentaje}% (${ad.gramosCalculados ? (ad.gramosCalculados / 1000).toFixed(2) + ' KG' : ''})`}
                              >
                                {ad.tipo === 'FRAGANCIA' ? '🌸 ' : '🎨 '}
                                {ad.insumo?.nombre || ad.tipo} ({ad.porcentaje}%)
                              </span>
                            ))}
                          </div>
                        ) : (p.aroma || p.color || p.aromaText || p.colorText) ? (
                          <div className="flex flex-wrap gap-1">
                            {(p.aromaText || p.aroma) && (
                              <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${
                                isDark ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-purple-50 text-purple-800 border-purple-200'
                              }`}>
                                🌸 {p.aromaText || p.aroma}
                              </span>
                            )}
                            {(p.colorText || p.color) && (
                              <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${
                                isDark ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-amber-50 text-amber-800 border-amber-200'
                              }`}>
                                🎨 {p.colorText || p.color}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-500">Estándar</span>
                        )}
                      </td>

                      {/* Cantidad */}
                      <td className={`py-3 px-3 text-right font-mono font-bold ${
                        isDark ? 'text-teal-400' : 'text-teal-700'
                      }`}>
                        {p.cantidad.toLocaleString()} {p.unidad}
                      </td>

                      {/* Monto Total */}
                      <td className={`py-3 px-3 text-right font-mono font-black ${
                        isDark ? 'text-emerald-400' : 'text-emerald-700'
                      }`}>
                        S/ {p.montoTotal.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                      </td>

                      {/* Estado */}
                      <td className="py-3 px-3 text-center">
                        {isCot ? (
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase font-mono border ${
                            isDark ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-orange-50 border-orange-200 text-orange-800 font-bold'
                          }`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 led-pulse" />
                            COTIZACIÓN
                          </span>
                        ) : (
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase font-mono border ${
                            p.estado === 'APROBADO' || p.estado === 'COMPLETADO' || p.estado === 'ENTREGADO' || p.estado === 'DESPACHADO'
                              ? isDark
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-[#00F2C3]'
                                : 'bg-emerald-100 border-emerald-300 text-emerald-800 font-black'
                              : p.estado === 'EN_PRODUCCION'
                              ? isDark
                                ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                                : 'bg-cyan-100 border-cyan-300 text-cyan-800 font-black'
                              : p.estado === 'PENDIENTE_REVISION'
                              ? isDark
                                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                                : 'bg-amber-100 border-amber-300 text-amber-800 font-black'
                              : isDark
                              ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                              : 'bg-blue-100 border-blue-300 text-blue-800 font-black'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              p.estado === 'EN_PRODUCCION'
                                ? 'bg-cyan-400 led-pulse'
                                : p.estado === 'APROBADO' || p.estado === 'COMPLETADO' || p.estado === 'ENTREGADO'
                                ? 'bg-[#00F2C3]'
                                : 'bg-blue-400'
                            }`} />
                            {p.estado === 'ENTREGADO' || p.estado === 'DESPACHADO' || p.estado === 'COMPLETADO' ? 'ENTREGADO' : p.estado}
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
                                onClick={() => canApprove && setConvertModalItem(p)}
                                disabled={!canApprove}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold tracking-wider flex items-center gap-1 shadow-sm transition-all active:scale-95 ${
                                  canApprove
                                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white cursor-pointer shadow-emerald-500/20'
                                    : 'bg-slate-700 text-slate-400 cursor-not-allowed opacity-60'
                                }`}
                                title={
                                  canApprove
                                    ? 'Aceptar Cotización y Transmitir como Pedido a Planta'
                                    : 'Requiere aprobación de Gerencia'
                                }
                              >
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                                <span>{canApprove ? 'Aceptar & Pedido' : 'Pendiente Aprobación'}</span>
                              </button>

                              {/* Botón Ver PDF Cotización */}
                              <button
                                onClick={() => handleOpenPdfForOrder(p)}
                                className={`p-1.5 rounded-lg border transition-all active:scale-90 ${
                                  isDark
                                    ? 'bg-[#151D2A] border-[#1A2232] text-amber-400 hover:text-white hover:border-amber-400 shadow-sm'
                                    : 'bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100'
                                }`}
                                title="Ver / Imprimir Cotización Oficial"
                              >
                                <FileText className="w-4 h-4" />
                              </button>

                              {/* Botón Emitir comprobante (R1) */}
                              <button
                                onClick={() => { setEmitTipo('FACTURA'); setEmitResult(''); setEmitError(''); setEmitModalItem(p); }}
                                className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold flex items-center gap-1 transition-all active:scale-95 ${
                                  isDark
                                    ? 'bg-[#151D2A] border-[#1A2232] text-rose-400 hover:text-white hover:border-rose-400'
                                    : 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'
                                }`}
                                title="Emitir Boleta / Factura / Nota de Venta"
                              >
                                <Receipt className="w-3.5 h-3.5" />
                                <span>Emitir Comp.</span>
                              </button>

                              {/* Botón Editar Cotización / Pedido */}
                              <button
                                onClick={() => abrirModalEditar(p)}
                                className={`p-1.5 rounded-lg border transition-all active:scale-90 ${
                                  isDark
                                    ? 'bg-[#151D2A] border-[#1A2232] text-blue-400 hover:text-white hover:border-blue-400 shadow-sm'
                                    : 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'
                                }`}
                                title="Editar datos del pedido o cotización"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <>
                              {/* Botón Ver Boleta / Pedido */}
                              <button
                                onClick={() => handleOpenPdfForOrder(p)}
                                className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold flex items-center gap-1 transition-all active:scale-95 ${
                                  isDark
                                    ? 'bg-teal-500/10 border-teal-500/30 text-[#00F2C3] hover:border-[#00F2C3] shadow-sm'
                                    : 'bg-teal-50 border-teal-200 text-teal-700 hover:bg-teal-100'
                                }`}
                                title="Ver / Imprimir Boleta o Comprobante"
                              >
                                <Receipt className="w-3.5 h-3.5" />
                                <span>Ver Boleta</span>
                              </button>

                              {/* Botón Emitir comprobante (R1) */}
                              <button
                                onClick={() => { setEmitTipo('FACTURA'); setEmitResult(''); setEmitError(''); setEmitModalItem(p); }}
                                className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold flex items-center gap-1 transition-all active:scale-95 ${
                                  isDark
                                    ? 'bg-[#151D2A] border-[#1A2232] text-rose-400 hover:text-white hover:border-rose-400'
                                    : 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'
                                }`}
                                title="Emitir Boleta / Factura / Nota de Venta"
                              >
                                <Receipt className="w-3.5 h-3.5" />
                                <span>Emitir Comp.</span>
                              </button>

                              {/* Botón Editar Cotización / Pedido */}
                              <button
                                onClick={() => abrirModalEditar(p)}
                                className={`p-1.5 rounded-lg border transition-all active:scale-90 ${
                                  isDark
                                    ? 'bg-[#151D2A] border-[#1A2232] text-blue-400 hover:text-white hover:border-blue-400 shadow-sm'
                                    : 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'
                                }`}
                                title="Editar datos del pedido o cotización"
                              >
                                <Pencil className="w-4 h-4" />
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
            <div className={`flex items-center gap-3 border-b pb-3 ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
              <CheckCircle2 className="w-6 h-6" />
              <div>
                <h3 className={`text-sm font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Aprobar Cotización y Convertir a Pedido de Planta</h3>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>El cliente ha aceptado la cotización. Se emitirá la Orden de Producción (OP).</p>
              </div>
            </div>

            <div className={`p-4 rounded-xl border space-y-2 text-xs font-mono ${
              isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex justify-between">
                <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Cotización:</span>
                <strong className={`font-bold ${isDark ? 'text-orange-400' : 'text-orange-700'}`}>{convertModalItem.codigoOrden}</strong>
              </div>
              <div className="flex justify-between">
                <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Cliente:</span>
                <strong className={isDark ? 'text-slate-200' : 'text-slate-900'}>{convertModalItem.cliente}</strong>
              </div>
              <div className="flex justify-between">
                <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Producto:</span>
                <strong className={isDark ? 'text-slate-200' : 'text-slate-900'}>{convertModalItem.producto}</strong>
              </div>
              <div className="flex justify-between">
                <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Cantidad:</span>
                <strong className={`font-bold ${isDark ? 'text-teal-400' : 'text-teal-700'}`}>{convertModalItem.cantidad} {convertModalItem.unidad}</strong>
              </div>
              <div className="flex justify-between">
                <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Monto Total:</span>
                <strong className={`font-black ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>S/ {convertModalItem.montoTotal.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</strong>
              </div>
            </div>

            <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Al confirmar, se generará el código de Orden de Producción formal y la solicitud viajará de inmediato a la bandeja de Pedidos Entrantes en Planta.
            </p>

            <div className={`flex items-center justify-end gap-3 pt-3 border-t ${
              isDark ? 'border-slate-800' : 'border-slate-200'
            }`}>
              <button
                type="button"
                onClick={() => setConvertModalItem(null)}
                className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-colors ${
                  isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={isConverting}
                onClick={handleConfirmConvert}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black uppercase tracking-wider shadow-lg flex items-center gap-2 cursor-pointer"
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

      {/* ── MODAL EMITIR COMPROBANTE (R1) ── */}
      {emitModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 font-sans animate-in fade-in duration-200">
          <div className={`w-full max-w-md rounded-2xl p-6 border space-y-4 shadow-2xl ${cardBg}`}>
            <div className={`flex items-center gap-3 border-b pb-3 ${isDark ? 'text-rose-400' : 'text-rose-700'}`}>
              <Receipt className="w-6 h-6" />
              <div>
                <h3 className={`text-sm font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Emitir Comprobante</h3>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Seleccione el tipo de comprobante a generar.</p>
              </div>
            </div>

            <div className={`p-4 rounded-xl border space-y-1 text-xs font-mono ${
              isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex justify-between">
                <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Documento:</span>
                <strong className={`font-bold ${isDark ? 'text-orange-400' : 'text-orange-700'}`}>{emitModalItem.codigoOrden}</strong>
              </div>
              <div className="flex justify-between">
                <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Cliente:</span>
                <strong className={isDark ? 'text-slate-200' : 'text-slate-900'}>{emitModalItem.cliente}</strong>
              </div>
              <div className="flex justify-between">
                <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Monto Total:</span>
                <strong className={`font-black ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>S/ {emitModalItem.montoTotal.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</strong>
              </div>
            </div>

            <div className="space-y-2">
              <p className={`text-[11px] font-bold uppercase ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Tipo de comprobante</p>
              <div className="grid grid-cols-3 gap-2">
                {(['BOLETA', 'FACTURA', 'NOTA_VENTA'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setEmitTipo(t)}
                    className={`py-2 rounded-xl border text-xs font-bold transition-all ${
                      emitTipo === t
                        ? 'bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-500/20'
                        : isDark
                        ? 'border-slate-700 text-slate-300 hover:bg-slate-800'
                        : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {t === 'BOLETA' ? 'Boleta' : t === 'FACTURA' ? 'Factura' : 'Nota de Venta'}
                  </button>
                ))}
              </div>
            </div>

            {emitError && (
              <div className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold ${
                isDark ? 'bg-rose-500/10 border-rose-500/30 text-rose-300' : 'bg-rose-50 border-rose-200 text-rose-700'
              }`}>
                <AlertCircle className="w-4 h-4 shrink-0" />
                {emitError}
              </div>
            )}
            {emitResult && (
              <div className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold ${
                isDark ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-700'
              }`}>
                <Check className="w-4 h-4 shrink-0" />
                {emitResult}
              </div>
            )}

            <div className={`flex items-center justify-end gap-3 pt-3 border-t ${
              isDark ? 'border-slate-800' : 'border-slate-200'
            }`}>
              <button
                type="button"
                onClick={() => setEmitModalItem(null)}
                className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-colors ${
                  isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={emitLoading}
                onClick={handleEmitirComprobante}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-black uppercase tracking-wider shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <Receipt className="w-4 h-4" />
                <span>{emitLoading ? 'Emitiendo...' : 'Emitir Comprobante'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL EDITAR PEDIDO / COTIZACIÓN ── */}
      {editModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 font-sans animate-in fade-in duration-200">
          <div className={`w-full max-w-2xl rounded-2xl p-6 border space-y-4 shadow-2xl ${cardBg}`}>
            <div className={`flex items-center gap-3 border-b pb-3 ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>
              <Pencil className="w-6 h-6" />
              <div>
                <h3 className={`text-sm font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Editar Pedido / Cotización</h3>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Actualiza los datos comerciales del documento {editModalItem.codigoOrden}
                </p>
              </div>
            </div>

            <form onSubmit={handleGuardarEdicionPedido} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-[11px] font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Cliente *</label>
                  <input
                    type="text"
                    value={editCliente}
                    onChange={(e) => setEditCliente(e.target.value)}
                    required
                    className={`w-full px-3 py-2 rounded-xl border text-xs ${inputBg}`}
                  />
                </div>
                <div>
                  <label className={`block text-[11px] font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>RUC / DNI</label>
                  <input
                    type="text"
                    value={editRuc}
                    onChange={(e) => setEditRuc(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl border text-xs font-mono ${inputBg}`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-[11px] font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Producto *</label>
                <input
                  type="text"
                  value={editProducto}
                  onChange={(e) => setEditProducto(e.target.value)}
                  required
                  className={`w-full px-3 py-2 rounded-xl border text-xs ${inputBg}`}
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className={`block text-[11px] font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Cantidad *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={editCantidad}
                    onChange={(e) => setEditCantidad(e.target.value)}
                    required
                    className={`w-full px-3 py-2 rounded-xl border text-xs font-mono font-bold ${inputBg}`}
                  />
                </div>
                <div>
                  <label className={`block text-[11px] font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Unidad</label>
                  <select
                    value={editUnidad}
                    onChange={(e) => setEditUnidad(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl border text-xs ${inputBg}`}
                  >
                    <option value="KG">KG</option>
                    <option value="G">G</option>
                    <option value="LT">LT</option>
                    <option value="ML">ML</option>
                    <option value="UN">UN</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-[11px] font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Monto Total (S/) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={editMonto}
                    onChange={(e) => setEditMonto(e.target.value)}
                    required
                    className={`w-full px-3 py-2 rounded-xl border text-xs font-mono font-bold ${inputBg}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-[11px] font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Condición de Pago</label>
                  <select
                    value={editCondicion}
                    onChange={(e) => setEditCondicion(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl border text-xs ${inputBg}`}
                  >
                    <option value="Contado">Contado</option>
                    <option value="Crédito 30 días">Crédito 30 días</option>
                    <option value="Crédito 07 días">Crédito 07 días</option>
                    <option value="Crédito 15 días">Crédito 15 días</option>
                    <option value="Crédito 20 días">Crédito 20 días</option>
                    <option value="Crédito 60 días">Crédito 60 días</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-[11px] font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Prioridad</label>
                  <select
                    value={editPrioridad}
                    onChange={(e) => setEditPrioridad(e.target.value as 'URGENTE' | 'NORMAL' | 'PROGRAMADO')}
                    className={`w-full px-3 py-2 rounded-xl border text-xs ${inputBg}`}
                  >
                    <option value="URGENTE">URGENTE</option>
                    <option value="NORMAL">NORMAL</option>
                    <option value="PROGRAMADO">PROGRAMADO</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-[11px] font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Fecha Prometida</label>
                  <input
                    type="date"
                    value={editFechaPrometida}
                    onChange={(e) => setEditFechaPrometida(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl border text-xs ${inputBg}`}
                  />
                </div>
                <div>
                  <label className={`block text-[11px] font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Estado</label>
                  <select
                    value={editEstado}
                    onChange={(e) => setEditEstado(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl border text-xs ${inputBg}`}
                  >
                    <option value="NUEVO">NUEVO</option>
                    <option value="PENDIENTE_REVISION">PENDIENTE_REVISION</option>
                    <option value="VALIDANDO">VALIDANDO</option>
                    <option value="APROBADO">APROBADO</option>
                    <option value="EN_PRODUCCION">EN_PRODUCCION</option>
                    <option value="DEVUELTO">DEVUELTO</option>
                    <option value="RECHAZADO">RECHAZADO</option>
                    <option value="ENTREGADO">ENTREGADO</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-[11px] font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Tipo Comprobante</label>
                  <select
                    value={editTipoComprobante}
                    onChange={(e) => setEditTipoComprobante(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl border text-xs ${inputBg}`}
                  >
                    <option value="FACTURA">FACTURA</option>
                    <option value="BOLETA">BOLETA</option>
                    <option value="NOTA_VENTA">NOTA VENTA</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-[11px] font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Fórmula (FM-xxx) <span className="font-normal text-slate-500">— opcional</span>
                  </label>
                  <input
                    type="text"
                    value={editFormulaId}
                    onChange={(e) => setEditFormulaId(e.target.value)}
                    placeholder="Ej: FM-0042"
                    className={`w-full px-3 py-2 rounded-xl border text-xs font-mono ${inputBg}`}
                  />
                </div>
              </div>

              {editError && (
                <div className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold ${
                  isDark ? 'bg-rose-500/10 border-rose-500/30 text-rose-300' : 'bg-rose-50 border-rose-200 text-rose-700'
                }`}>
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {editError}
                </div>
              )}

              <div className={`flex items-center justify-end gap-3 pt-3 border-t ${
                isDark ? 'border-slate-800' : 'border-slate-200'
              }`}>
                <button
                  type="button"
                  onClick={() => setEditModalItem(null)}
                  className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-colors ${
                    isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-black uppercase tracking-wider shadow-lg flex items-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{editLoading ? 'Guardando...' : 'Guardar Cambios'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
