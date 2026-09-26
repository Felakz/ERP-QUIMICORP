'use client';
import { stockUnit } from '@/lib/stockUnits';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Receipt,
  Plus,
  Search,
  Filter,
  Download,
  CheckCircle2,
  Clock,
  Truck,
  Building2,
  Package,
  Calendar,
  DollarSign,
  AlertTriangle,
  X,
  Sparkles,
  ArrowUpRight,
  Eye,
  Send,
  FileSpreadsheet,
  ChevronDown,
  Check,
  Pencil,
  Trash2,
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { useTheme } from '@/lib/ThemeContext';
import { useAuth } from '@/lib/AuthContext';
import { apiFetch } from '@/lib/apiClient';

export type EstadoOrdenCompra = 'TODAS' | 'PENDIENTE' | 'EN_TRANSITO' | 'RECIBIDO' | 'ANULADA';

interface InsumoItemOC {
  insumo: string;
  cantidad: number;
  unidadMedida: string;
  precioUnitario: number;
  subtotal: number;
}

interface OrdenCompraItem {
  id: string;
  codigoOC: string;
  proveedor: string;
  proveedorId?: string;
  ruc: string;
  fechaEmision: string;
  fechaEntregaEstimada: string;
  estado: 'PENDIENTE' | 'EN_TRANSITO' | 'RECIBIDO' | 'ANULADA';
  totalPEN: number;
  moneda: 'PEN' | 'USD';
  items: InsumoItemOC[];
  condicionPago: string;
  comprador: string;
  observaciones?: string;
  edicionesCount?: number;
  maxEdicionesAsistente?: number;
}

interface BackendOrdenCompraItem {
  id: string;
  insumoId: string | null;
  insumoNombre: string;
  cantidad: number | string;
  unidadMedida: string;
  precioUnitario: number | string;
  subtotal: number | string;
}

interface BackendOrdenCompra {
  id: string;
  codigoOC: string;
  proveedorId?: string;
  proveedorNombre: string;
  ruc: string;
  fechaEmision: string;
  fechaEntregaEstimada: string;
  estado: OrdenCompraItem['estado'];
  totalPEN: number | string;
  moneda: 'PEN' | 'USD';
  condicionPago: string;
  comprador: string;
  observaciones?: string;
  edicionesCount?: number;
  maxEdicionesAsistente?: number;
  items: BackendOrdenCompraItem[];
}

interface ProveedorCatalogo {
  id: string;
  razonSocial: string;
  ruc: string;
  contacto?: string | null;
  telefono?: string | null;
}

interface InsumoCatalogo {
  id: string;
  nombre: string;
  codigo: string;
  familia: string;
  unidad: string;
  precioRef: number;
  stock: number;
}

const mapOrdenCompra = (orden: BackendOrdenCompra): OrdenCompraItem => ({
  id: orden.id,
  codigoOC: orden.codigoOC,
  proveedor: orden.proveedorNombre,
  proveedorId: orden.proveedorId,
  ruc: orden.ruc,
  fechaEmision: new Date(orden.fechaEmision).toISOString().split('T')[0],
  fechaEntregaEstimada: new Date(orden.fechaEntregaEstimada).toISOString().split('T')[0],
  estado: orden.estado,
  totalPEN: Number(orden.totalPEN),
  moneda: orden.moneda,
  condicionPago: orden.condicionPago,
  comprador: orden.comprador,
  observaciones: orden.observaciones,
  edicionesCount: Number(orden.edicionesCount || 0),
  maxEdicionesAsistente: Number(orden.maxEdicionesAsistente || 2),
  items: (orden.items || []).map((item) => ({
    insumo: item.insumoNombre,
    cantidad: Number(item.cantidad),
    unidadMedida: item.unidadMedida,
    precioUnitario: Number(item.precioUnitario),
    subtotal: Number(item.subtotal),
  })),
});

export default function AdministracionOrdenesPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { user } = useAuth();
  const esAdminOGerencia =
    user?.role === 'GERENCIA' ||
    user?.role === 'ADMINISTRACION' ||
    user?.role === 'GERENTE_ADMINISTRATIVO';

  const [ordenes, setOrdenes] = useState<OrdenCompraItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEstado, setSelectedEstado] = useState<EstadoOrdenCompra>('TODAS');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOC, setSelectedOC] = useState<OrdenCompraItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const cargar = async () => {
      try {
        const response = await apiFetch<BackendOrdenCompra[]>('/ordenes-compra');
        if (!response.ok || !response.data) throw new Error(response.error || 'No se pudieron cargar las órdenes.');
        setOrdenes(response.data.map(mapOrdenCompra));
      } catch (error) {
        setOrdenes([]);
        console.error('Error cargando órdenes de compra:', error);
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, []);

  // Catálogos para Comboboxes inteligentes de Proveedores e Insumos
  const [proveedoresList, setProveedoresList] = useState<ProveedorCatalogo[]>([]);
  const [insumosList, setInsumosList] = useState<InsumoCatalogo[]>([]);

  // Form nueva OC
  const [nuevoProveedor, setNuevoProveedor] = useState('');
  const [nuevoRuc, setNuevoRuc] = useState('');
  const [selectedProveedorId, setSelectedProveedorId] = useState<string>('');
  const [isProvOpen, setIsProvOpen] = useState(false);
  const provComboboxRef = useRef<HTMLDivElement>(null);

  const [nuevoInsumo, setNuevoInsumo] = useState('');
  const [isInsumoOpen, setIsInsumoOpen] = useState(false);
  const insumoComboboxRef = useRef<HTMLDivElement>(null);

  // Estados tipo String para evitar el problema de "025" al escribir "25"
  const [nuevaCantidadStr, setNuevaCantidadStr] = useState<string>('100');
  const [nuevaUnidad, setNuevaUnidad] = useState('KG');
  const [nuevoPrecioStr, setNuevoPrecioStr] = useState<string>('5.00');
  const [nuevaCondicion, setNuevaCondicion] = useState('Crédito 30 días');
  const [nuevasObs, setNuevasObs] = useState('');

  // Estados para Edición de OC
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingOC, setEditingOC] = useState<OrdenCompraItem | null>(null);
  const [editProveedor, setEditProveedor] = useState('');
  const [editRuc, setEditRuc] = useState('');
  const [editProveedorId, setEditProveedorId] = useState('');
  const [isEditProvOpen, setIsEditProvOpen] = useState(false);
  const editProvRef = useRef<HTMLDivElement>(null);

  const [editInsumo, setEditInsumo] = useState('');
  const [isEditInsumoOpen, setIsEditInsumoOpen] = useState(false);
  const editInsumoRef = useRef<HTMLDivElement>(null);

  const [editCantidadStr, setEditCantidadStr] = useState('1');
  const [editUnidad, setEditUnidad] = useState('KG');
  const [editPrecioStr, setEditPrecioStr] = useState('0.00');
  const [editCondicion, setEditCondicion] = useState('Contado');
  const [editFechaEntrega, setEditFechaEntrega] = useState('');
  const [editObs, setEditObs] = useState('');
  const [editGuardando, setEditGuardando] = useState(false);
  const [editError, setEditError] = useState('');

  // Modal confirmación eliminar / anular
  const [ocToDelete, setOcToDelete] = useState<OrdenCompraItem | null>(null);
  const [deletingOC, setDeletingOC] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [toastSuccess, setToastSuccess] = useState('');

  // Cargar Proveedores e Insumos al montar el componente
  useEffect(() => {
    const cargarCatalogos = async () => {
      try {
        const resProv = await apiFetch<ProveedorCatalogo[]>('/proveedores');
        if (!resProv.ok || !resProv.data) throw new Error(resProv.error || 'No se pudieron cargar proveedores.');
        setProveedoresList(resProv.data);

        const resIns = await apiFetch<Array<{
          id: string;
          nombre: string;
          codigo: string;
          categoria?: string | null;
          familia?: { nombre: string } | null;
          unidadMedida: string;
          costoUnitario: number | string;
          stockReal?: number | string | null;
          stockTeorico?: number | string | null;
        }>>('/insumos');
        if (!resIns.ok || !resIns.data) throw new Error(resIns.error || 'No se pudieron cargar insumos.');
        const mappedBackendIns: InsumoCatalogo[] = resIns.data.map((i) => ({
          id: i.id,
          nombre: i.nombre,
          codigo: i.codigo,
          familia: i.categoria || i.familia?.nombre || 'QUÍMICOS',
          unidad: i.unidadMedida || 'KG',
          precioRef: Number(i.costoUnitario || 0),
          stock: Number(i.stockReal ?? i.stockTeorico ?? 0),
        }));
        setInsumosList(mappedBackendIns);
      } catch (error) {
        setProveedoresList([]);
        setInsumosList([]);
        console.error('Error cargando catálogos para OC:', error);
      }
    };
    cargarCatalogos();
  }, []);

  // Cerrar desplegables de combobox al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (provComboboxRef.current && !provComboboxRef.current.contains(event.target as Node)) {
        setIsProvOpen(false);
      }
      if (insumoComboboxRef.current && !insumoComboboxRef.current.contains(event.target as Node)) {
        setIsInsumoOpen(false);
      }
      if (editProvRef.current && !editProvRef.current.contains(event.target as Node)) {
        setIsEditProvOpen(false);
      }
      if (editInsumoRef.current && !editInsumoRef.current.contains(event.target as Node)) {
        setIsEditInsumoOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtros de búsqueda en tiempo real para Proveedores e Insumos
  const filteredProveedores = useMemo(() => {
    if (!nuevoProveedor.trim()) return proveedoresList.slice(0, 30);
    const q = nuevoProveedor.toLowerCase().trim();
    return proveedoresList
      .filter((p) => (p.razonSocial && p.razonSocial.toLowerCase().includes(q)) || (p.ruc && p.ruc.includes(q)))
      .slice(0, 30);
  }, [proveedoresList, nuevoProveedor]);

  const filteredInsumos = useMemo(() => {
    if (!nuevoInsumo.trim()) return insumosList.slice(0, 30);
    const q = nuevoInsumo.toLowerCase().trim();
    return insumosList
      .filter((i) =>
        (i.nombre && i.nombre.toLowerCase().includes(q)) ||
        (i.codigo && i.codigo.toLowerCase().includes(q)) ||
        (i.familia && i.familia.toLowerCase().includes(q))
      )
      .slice(0, 30);
  }, [insumosList, nuevoInsumo]);

  const filteredEditProveedores = useMemo(() => {
    if (!editProveedor.trim()) return proveedoresList.slice(0, 30);
    const q = editProveedor.toLowerCase().trim();
    return proveedoresList
      .filter((p) => (p.razonSocial && p.razonSocial.toLowerCase().includes(q)) || (p.ruc && p.ruc.includes(q)))
      .slice(0, 30);
  }, [proveedoresList, editProveedor]);

  const filteredEditInsumos = useMemo(() => {
    if (!editInsumo.trim()) return insumosList.slice(0, 30);
    const q = editInsumo.toLowerCase().trim();
    return insumosList
      .filter((i) =>
        (i.nombre && i.nombre.toLowerCase().includes(q)) ||
        (i.codigo && i.codigo.toLowerCase().includes(q)) ||
        (i.familia && i.familia.toLowerCase().includes(q))
      )
      .slice(0, 30);
  }, [insumosList, editInsumo]);

  const cardBg = isDark ? 'bg-[#0F141C] border-[#1A2232]' : 'bg-white border-slate-200 shadow-sm';
  const textTitle = isDark ? 'text-slate-400' : 'text-slate-600';
  const textValue = isDark ? 'text-white' : 'text-slate-900';
  const inputBg = isDark
    ? 'bg-[#151D2A] border-[#1A2232] text-slate-200 placeholder-slate-500 focus:border-[#00F2C3]'
    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500';

  const filteredOrdenes = useMemo(() => {
    return ordenes.filter((o) => {
      if (selectedEstado !== 'TODAS' && o.estado !== selectedEstado) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchCode = o.codigoOC.toLowerCase().includes(q);
        const matchProv = o.proveedor.toLowerCase().includes(q);
        const matchRuc = o.ruc.includes(q);
        const matchInsumo = o.items.some((i) => i.insumo.toLowerCase().includes(q));
        if (!matchCode && !matchProv && !matchRuc && !matchInsumo) return false;
      }
      return true;
    });
  }, [ordenes, selectedEstado, searchQuery]);

  // KPIs
  const totalMontoPEN = useMemo(
    () => ordenes.filter((o) => o.estado !== 'ANULADA').reduce((acc, o) => acc + o.totalPEN, 0),
    [ordenes]
  );
  const totalTransito = useMemo(
    () => ordenes.filter((o) => o.estado === 'EN_TRANSITO').length,
    [ordenes]
  );
  const totalRecibidas = useMemo(
    () => ordenes.filter((o) => o.estado === 'RECIBIDO').length,
    [ordenes]
  );
  const totalPendientes = useMemo(
    () => ordenes.filter((o) => o.estado === 'PENDIENTE').length,
    [ordenes]
  );

  const handleCrearOC = async (e: React.FormEvent) => {
    e.preventDefault();
    const cant = parseFloat(nuevaCantidadStr) || 0;
    const prec = parseFloat(nuevoPrecioStr) || 0;
    if (!nuevoProveedor.trim() || !nuevoInsumo.trim() || cant <= 0 || prec <= 0) {
      alert('Por favor completa todos los datos de la Orden de Compra con cantidad y precio válidos.');
      return;
    }
    try {
      const res = await apiFetch<BackendOrdenCompra>('/ordenes-compra', {
        method: 'POST',
        body: JSON.stringify({
          proveedorId: selectedProveedorId || undefined,
          ruc: nuevoRuc.trim() || '20999999999',
          proveedorNombre: nuevoProveedor.trim(),
          fechaEntregaEstimada: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          condicionPago: nuevaCondicion,
          comprador: 'Administración Quimicorp',
          observaciones: nuevasObs.trim() || 'Generado desde Administración.',
          items: [{ insumoNombre: nuevoInsumo.trim(), cantidad: cant, unidadMedida: nuevaUnidad, precioUnitario: prec }],
        }),
      });
      if (!res.ok || !res.data) throw new Error(res.error || 'No se pudo crear la orden de compra.');
      setOrdenes((actuales) => [mapOrdenCompra(res.data as BackendOrdenCompra), ...actuales]);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'No se pudo crear la orden de compra.');
      return;
    }
    setIsModalOpen(false);
    setNuevoProveedor('');
    setNuevoRuc('');
    setSelectedProveedorId('');
    setNuevoInsumo('');
    setNuevaCantidadStr('100');
    setNuevoPrecioStr('5.00');
    setNuevasObs('');
  };

  const handleMarcarRecibido = async (id: string) => {
    try {
      const res = await apiFetch<BackendOrdenCompra>(`/ordenes-compra/${id}/recibir`, { method: 'PATCH' });
      if (!res.ok || !res.data) throw new Error(res.error || 'No se pudo recibir la orden de compra.');
      setOrdenes((prev) => prev.map((orden) => (orden.id === id ? mapOrdenCompra(res.data as BackendOrdenCompra) : orden)));
    } catch (error) {
      alert(error instanceof Error ? error.message : 'No se pudo recibir la orden de compra.');
    }
  };

  const openEditModal = (oc: OrdenCompraItem) => {
    setEditError('');
    setEditingOC(oc);
    setEditProveedor(oc.proveedor);
    setEditRuc(oc.ruc);
    setEditProveedorId(oc.proveedorId || '');
    setEditCondicion(oc.condicionPago || 'Contado');
    setEditFechaEntrega(oc.fechaEntregaEstimada ? oc.fechaEntregaEstimada.split('T')[0] : '');
    setEditObs(oc.observaciones?.replace(/\s*\[EDICIONES:\s*\d+\]/gi, '').trim() || '');
    if (oc.items && oc.items.length > 0) {
      const first = oc.items[0];
      setEditInsumo(first.insumo);
      setEditCantidadStr(String(first.cantidad));
      setEditUnidad(first.unidadMedida || 'KG');
      setEditPrecioStr(String(first.precioUnitario));
    } else {
      setEditInsumo('');
      setEditCantidadStr('1');
      setEditUnidad('KG');
      setEditPrecioStr('0.00');
    }
    setIsEditModalOpen(true);
  };

  const handleActualizarOC = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOC) return;
    const cant = parseFloat(editCantidadStr) || 0;
    const prec = parseFloat(editPrecioStr) || 0;
    if (!editProveedor.trim() || !editInsumo.trim() || cant <= 0 || prec <= 0) {
      setEditError('Por favor completa todos los datos requeridos con cantidad y precio mayores a 0.');
      return;
    }

    setEditGuardando(true);
    setEditError('');
    try {
      const res = await apiFetch<BackendOrdenCompra>(`/ordenes-compra/${editingOC.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          proveedorId: editProveedorId || undefined,
          proveedorNombre: editProveedor.trim(),
          ruc: editRuc.trim() || '20999999999',
          fechaEntregaEstimada: editFechaEntrega ? new Date(editFechaEntrega).toISOString() : undefined,
          condicionPago: editCondicion,
          observaciones: editObs.trim(),
          items: [{
            insumoNombre: editInsumo.trim(),
            cantidad: cant,
            unidadMedida: editUnidad,
            precioUnitario: prec,
          }],
        }),
      });

      if (!res.ok || !res.data) {
        throw new Error(res.error || 'No se pudo actualizar la orden de compra.');
      }

      const updated = mapOrdenCompra(res.data);
      setOrdenes((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
      setIsEditModalOpen(false);
      setToastSuccess(`Orden ${updated.codigoOC} actualizada exitosamente.`);
      setTimeout(() => setToastSuccess(''), 4500);
    } catch (err) {
      setEditError(err instanceof Error ? err.message : 'Error al actualizar la orden.');
    } finally {
      setEditGuardando(false);
    }
  };

  const handleEliminarOC = async () => {
    if (!ocToDelete) return;
    setDeletingOC(true);
    setDeleteError('');
    try {
      const res = await apiFetch<{ ok: boolean; mensaje: string }>(`/ordenes-compra/${ocToDelete.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error(res.error || 'No se pudo eliminar la orden de compra.');
      setOrdenes((prev) => prev.filter((o) => o.id !== ocToDelete.id));
      setToastSuccess(res.data?.mensaje || `Orden ${ocToDelete.codigoOC} eliminada correctamente.`);
      setOcToDelete(null);
      setTimeout(() => setToastSuccess(''), 4500);
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Error al eliminar la orden.');
    } finally {
      setDeletingOC(false);
    }
  };

  const handleAnularOC = async () => {
    if (!ocToDelete) return;
    setDeletingOC(true);
    setDeleteError('');
    try {
      const res = await apiFetch<BackendOrdenCompra>(`/ordenes-compra/${ocToDelete.id}/anular`, {
        method: 'PATCH',
      });
      if (!res.ok || !res.data) throw new Error(res.error || 'No se pudo anular la orden de compra.');
      const updated = mapOrdenCompra(res.data);
      setOrdenes((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
      setToastSuccess(`Orden ${ocToDelete.codigoOC} anulada correctamente.`);
      setOcToDelete(null);
      setTimeout(() => setToastSuccess(''), 4500);
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Error al anular la orden.');
    } finally {
      setDeletingOC(false);
    }
  };

  const handleExportExcel = () => {
    const rows = filteredOrdenes.flatMap((o) =>
      o.items.map((it) => ({
        Codigo_OC: o.codigoOC,
        Proveedor: o.proveedor,
        RUC: o.ruc,
        Fecha_Emision: o.fechaEmision,
        Fecha_Entrega: o.fechaEntregaEstimada,
        Estado: o.estado,
        Condicion_Pago: o.condicionPago,
        Insumo: it.insumo,
        Cantidad: it.cantidad,
        Unidad: it.unidadMedida,
        Precio_Unitario_PEN: it.precioUnitario,
        Subtotal_PEN: it.subtotal,
        Total_OC_PEN: o.totalPEN,
        Comprador: o.comprador,
      }))
    );

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Ordenes_Compra');
    XLSX.writeFile(wb, `Quimicorp_Ordenes_Compra_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="space-y-5 font-sans min-h-screen">
      {/* 1. Header Compact */}
      <div className={`rounded-xl p-3 border flex flex-wrap items-center justify-between gap-3 ${cardBg}`}>
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"><Receipt className="w-4 h-4" /></div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className={`text-sm font-black tracking-tight ${textValue}`}>Órdenes de Compra</h1>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">KARDEX</span>
            </div>
            <p className="text-[11px] text-slate-400">Materia prima y envases para planta</p>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs tracking-wider uppercase transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>+ Nueva Orden de Compra</span>
          </button>

          <button
            onClick={handleExportExcel}
            className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 ${
              isDark
                ? 'bg-[#151D2A] border-[#1A2232] text-slate-200 hover:text-emerald-400 hover:border-emerald-500/40'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Exportar .XLSX</span>
          </button>
        </div>
      </div>

      {/* 2. KPIs Compact */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        {[
          { label: 'Inversión', value: `S/ ${totalMontoPEN.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, sub: 'Total insumos', icon: DollarSign, color: 'text-emerald-400' },
          { label: 'En Tránsito', value: `${totalTransito}`, sub: 'Despachadas', icon: Truck, color: 'text-cyan-400' },
          { label: 'Por Aprobar', value: `${totalPendientes}`, sub: 'Pendientes', icon: Clock, color: 'text-amber-400' },
          { label: 'Ingresadas', value: `${totalRecibidas}`, sub: 'En Kardex', icon: CheckCircle2, color: 'text-teal-400' },
        ].map(k => (
          <div key={k.label} className={`rounded-xl p-3 border ${cardBg}`}>
            <div className="flex items-center justify-between"><span className={`text-[9px] font-bold uppercase ${textTitle}`}>{k.label}</span><k.icon className={`w-3.5 h-3.5 ${k.color}`} /></div>
            <p className={`text-base font-black mt-1 ${k.color} font-mono`}>{k.value}</p>
            <p className="text-[11px] text-slate-500">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* 3. Filtros Segmentados y Buscador */}
      <div className={`rounded-2xl border p-4 flex flex-wrap items-center justify-between gap-3 ${cardBg}`}>
        <div className="flex items-center gap-1.5 bg-[#151D2A] p-1 rounded-xl border border-[#1A2232] overflow-x-auto">
          {[
            { id: 'TODAS', label: 'Todas las Órdenes' },
            { id: 'PENDIENTE', label: 'Pendientes' },
            { id: 'EN_TRANSITO', label: 'En Tránsito' },
            { id: 'RECIBIDO', label: 'Recibidas / Kardex' },
            { id: 'ANULADA', label: 'Anuladas' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedEstado(tab.id as EstadoOrdenCompra)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
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
            placeholder="Buscar por código, proveedor o insumo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full rounded-xl border py-2 pl-9 pr-3 text-xs focus:outline-none transition-all ${inputBg}`}
          />
        </div>
      </div>

      {/* 4. Lista de Tarjetas de Órdenes de Compra */}
      <div className="space-y-3">
        {filteredOrdenes.map((oc) => {
          return (
            <div
              key={oc.id}
              className={`rounded-2xl border p-5 transition-all card-hover-lift ${cardBg} ${
                oc.estado === 'PENDIENTE'
                  ? 'border-amber-500/30'
                  : oc.estado === 'EN_TRANSITO'
                  ? 'border-cyan-500/30'
                  : 'border-[#1A2232]'
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono font-bold text-sm text-[#00F2C3] tracking-wide">
                      {oc.codigoOC}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold font-mono border ${
                        oc.estado === 'RECIBIDO'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : oc.estado === 'EN_TRANSITO'
                          ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 animate-pulse'
                          : oc.estado === 'PENDIENTE'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      }`}
                    >
                      {oc.estado.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      📅 Emisión: {oc.fechaEmision} • Entrega: {oc.fechaEntregaEstimada}
                    </span>
                    {oc.estado !== 'RECIBIDO' && oc.estado !== 'ANULADA' && (
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-black font-mono border ${
                          esAdminOGerencia
                            ? 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                            : (oc.edicionesCount || 0) === 0
                            ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                            : (oc.edicionesCount || 0) === 1
                            ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                            : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                        }`}
                        title={
                          esAdminOGerencia
                            ? 'Administrador / Gerencia: Ediciones ilimitadas'
                            : `Asistente: ${(oc.edicionesCount || 0)} de ${(oc.maxEdicionesAsistente || 2)} ediciones usadas`
                        }
                      >
                        {esAdminOGerencia
                          ? '👑 Admin: Ilimitado'
                          : (oc.edicionesCount || 0) >= (oc.maxEdicionesAsistente || 2)
                          ? '⚠️ Límite 2 edits alcanzado'
                          : `${(oc.maxEdicionesAsistente || 2) - (oc.edicionesCount || 0)} edit restante`}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-slate-400" />
                    <h3 className={`text-base font-black ${textValue}`}>{oc.proveedor}</h3>
                    <span className="text-xs text-slate-400 font-mono">RUC: {oc.ruc}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-[10px] font-bold uppercase font-mono ${textTitle}`}>
                    TOTAL ORDEN
                  </span>
                  <p className="text-xl font-black text-emerald-400 font-mono">
                    S/ {oc.totalPEN.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                  </p>
                  <span className="text-[10px] text-slate-400 font-sans">
                    Condición: {oc.condicionPago}
                  </span>
                </div>
              </div>

              {/* Insumos de la OC */}
              <div className="mt-4 pt-3 border-t border-slate-800/60">
                <p className="text-[10px] font-bold tracking-wider uppercase text-slate-400 mb-2 font-mono">
                  Detalle de Insumos & Materia Prima Solicitada:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {oc.items.map((it, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-[#151D2A]/60 border border-[#1A2232] flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Package className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span className="font-bold text-slate-200 truncate">{it.insumo}</span>
                      </div>
                      <div className="text-right font-mono shrink-0 pl-2">
                        <span className="font-black text-[#00F2C3]">
                          {it.cantidad.toLocaleString('es-PE')} {it.unidadMedida}
                        </span>
                        <span className="text-slate-400 text-[10px] block">
                          @ S/ {it.precioUnitario.toFixed(2)} = S/ {it.subtotal.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer Acciones */}
              <div className="mt-4 pt-3 border-t border-slate-800/40 flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="text-slate-400 italic">
                  💡 {oc.observaciones || 'Sin observaciones registradas.'}
                </span>

                <div className="flex items-center gap-2">
                  {oc.estado !== 'RECIBIDO' && (
                    <>
                      <button
                        type="button"
                        onClick={() => openEditModal(oc)}
                        disabled={!esAdminOGerencia && (oc.edicionesCount || 0) >= (oc.maxEdicionesAsistente || 2)}
                        title={
                          !esAdminOGerencia && (oc.edicionesCount || 0) >= (oc.maxEdicionesAsistente || 2)
                            ? 'Has alcanzado el límite máximo de 2 ediciones permitidas para tu rol. Solicita autorización a Gerencia.'
                            : 'Editar insumos, cantidad, unidad o proveedor'
                        }
                        className={`px-3 py-1.5 rounded-xl border font-bold flex items-center gap-1.5 transition-all text-xs ${
                          !esAdminOGerencia && (oc.edicionesCount || 0) >= (oc.maxEdicionesAsistente || 2)
                            ? 'opacity-40 cursor-not-allowed bg-slate-800 text-slate-500 border-slate-700'
                            : isDark
                            ? 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border-amber-500/30 cursor-pointer'
                            : 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200 cursor-pointer'
                        }`}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        <span>Editar OC</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setOcToDelete(oc);
                          setDeleteError('');
                        }}
                        title="Eliminar o anular orden de compra"
                        className={`p-1.5 rounded-xl border transition-all text-xs cursor-pointer ${
                          isDark
                            ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border-rose-500/30'
                            : 'bg-rose-50 hover:bg-rose-100 text-rose-600 border-rose-200'
                        }`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleMarcarRecibido(oc.id)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Ingresar a Kardex</span>
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      alert(`Mostrando vista previa oficial de ${oc.codigoOC} para impresión.`);
                    }}
                    className={`px-3 py-1.5 rounded-xl border font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      isDark
                        ? 'bg-[#151D2A] border-[#1A2232] text-slate-300 hover:text-white'
                        : 'bg-slate-100 border-slate-300 text-slate-700'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Ver Formato OC</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL NUEVA ORDEN DE COMPRA */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div
            className={`w-full max-w-lg rounded-2xl border p-6 space-y-4 shadow-2xl relative ${cardBg}`}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-emerald-400" />
                <h3 className={`text-base font-black ${textValue}`}>
                  Generar Nueva Orden de Compra
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCrearOC} className="space-y-3.5 text-xs">
              {/* Selector Inteligente con Buscador de Proveedor */}
              <div className="relative" ref={provComboboxRef}>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-slate-300">
                    Proveedor / Empresa Distribuidora:
                  </label>
                  <span className="text-[10px] text-emerald-400 font-bold">
                    {proveedoresList.length} proveedores disponibles
                  </span>
                </div>
                <div className="relative">
                  <Building2 className="w-4 h-4 absolute left-3 top-3 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    required
                    placeholder="Buscar por Razón Social o RUC (ej. Química Suiza, 2060...)"
                    value={nuevoProveedor}
                    onChange={(e) => {
                      setNuevoProveedor(e.target.value);
                      setIsProvOpen(true);
                    }}
                    onFocus={() => setIsProvOpen(true)}
                    className={`w-full rounded-xl border pl-9 pr-16 p-2.5 ${inputBg}`}
                  />
                  <div className="absolute right-2.5 top-2.5 flex items-center gap-1">
                    {nuevoProveedor && (
                      <button
                        type="button"
                        onClick={() => {
                          setNuevoProveedor('');
                          setNuevoRuc('');
                          setSelectedProveedorId('');
                        }}
                        className="p-1 rounded-md text-slate-400 hover:text-white"
                        title="Limpiar"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setIsProvOpen(!isProvOpen)}
                      className="p-1 rounded-md text-slate-400 hover:text-white"
                      title="Ver lista de proveedores"
                    >
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isProvOpen ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Dropdown lista flotante de proveedores */}
                {isProvOpen && (
                  <div className="absolute z-50 left-0 right-0 mt-1 max-h-56 overflow-y-auto rounded-xl border border-slate-700 bg-[#0F141C] shadow-2xl divide-y divide-slate-800/60">
                    {filteredProveedores.length === 0 ? (
                      <div className="p-3 text-xs text-slate-400 text-center">
                        No se encontró proveedor con &quot;{nuevoProveedor}&quot;. Se guardará como nuevo texto libre.
                      </div>
                    ) : (
                      filteredProveedores.map((p) => (
                        <button
                          key={p.id || p.ruc}
                          type="button"
                          onClick={() => {
                            setNuevoProveedor(p.razonSocial);
                            setNuevoRuc(p.ruc);
                            setSelectedProveedorId(p.id || '');
                            setIsProvOpen(false);
                          }}
                          className="w-full text-left p-2.5 hover:bg-emerald-500/10 transition-colors flex items-center justify-between group cursor-pointer"
                        >
                          <div className="min-w-0 pr-2">
                            <p className="font-bold text-slate-200 group-hover:text-emerald-300 truncate">
                              {p.razonSocial}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400">
                              <span className="font-mono text-emerald-400 font-bold">RUC: {p.ruc}</span>
                              {p.contacto && <span>• {p.contacto}</span>}
                              {p.telefono && <span>• Tel: {p.telefono}</span>}
                            </div>
                          </div>
                          {nuevoRuc === p.ruc && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">RUC Proveedor:</label>
                  <input
                    type="text"
                    placeholder="20XXXXXXXXX"
                    value={nuevoRuc}
                    onChange={(e) => setNuevoRuc(e.target.value)}
                    className={`w-full rounded-xl border p-2.5 font-mono ${inputBg}`}
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Condición de Pago:</label>
                  <select
                    value={nuevaCondicion}
                    onChange={(e) => setNuevaCondicion(e.target.value)}
                    className={`w-full rounded-xl border p-2.5 ${inputBg}`}
                  >
                    <option value="Contado Contra Entrega">Contado Contra Entrega</option>
                    <option value="Crédito 15 días">Crédito 15 días</option>
                    <option value="Crédito 30 días">Crédito 30 días</option>
                    <option value="Crédito 60 días">Crédito 60 días</option>
                  </select>
                </div>
              </div>

              {/* Selector Inteligente con Buscador de Insumo / Materia Prima */}
              <div className="relative" ref={insumoComboboxRef}>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-slate-300">
                    Insumo / Materia Prima Principal:
                  </label>
                  <span className="text-[10px] text-cyan-400 font-bold">
                    {insumosList.length} insumos en catálogo
                  </span>
                </div>
                <div className="relative">
                  <Package className="w-4 h-4 absolute left-3 top-3 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    required
                    placeholder="Buscar químico por nombre o código (ej. Soda Cáustica, Texapon, QC-001...)"
                    value={nuevoInsumo}
                    onChange={(e) => {
                      setNuevoInsumo(e.target.value);
                      setIsInsumoOpen(true);
                    }}
                    onFocus={() => setIsInsumoOpen(true)}
                    className={`w-full rounded-xl border pl-9 pr-16 p-2.5 ${inputBg}`}
                  />
                  <div className="absolute right-2.5 top-2.5 flex items-center gap-1">
                    {nuevoInsumo && (
                      <button
                        type="button"
                        onClick={() => {
                          setNuevoInsumo('');
                        }}
                        className="p-1 rounded-md text-slate-400 hover:text-white"
                        title="Limpiar"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setIsInsumoOpen(!isInsumoOpen)}
                      className="p-1 rounded-md text-slate-400 hover:text-white"
                      title="Ver lista de insumos"
                    >
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isInsumoOpen ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Dropdown lista flotante de insumos */}
                {isInsumoOpen && (
                  <div className="absolute z-50 left-0 right-0 mt-1 max-h-56 overflow-y-auto rounded-xl border border-slate-700 bg-[#0F141C] shadow-2xl divide-y divide-slate-800/60">
                    {filteredInsumos.length === 0 ? (
                      <div className="p-3 text-xs text-slate-400 text-center">
                        No se encontró insumo con &quot;{nuevoInsumo}&quot;. Se registrará como nuevo insumo.
                      </div>
                    ) : (
                      filteredInsumos.map((i) => (
                        <button
                          key={i.id || i.nombre}
                          type="button"
                          onClick={() => {
                            setNuevoInsumo(i.nombre);
                            if (i.unidad) setNuevaUnidad(i.unidad);
                            if (i.precioRef && i.precioRef > 0) {
                              setNuevoPrecioStr(i.precioRef.toFixed(2));
                            }
                            setIsInsumoOpen(false);
                          }}
                          className="w-full text-left p-2.5 hover:bg-cyan-500/10 transition-colors flex items-center justify-between group cursor-pointer"
                        >
                          <div className="min-w-0 pr-2">
                            <p className="font-bold text-slate-200 group-hover:text-cyan-300 truncate">
                              {i.nombre}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400">
                              {i.codigo && <span className="font-mono text-cyan-400 font-bold">{i.codigo}</span>}
                              {i.familia && <span>• {i.familia}</span>}
                              {i.stock !== undefined && (
                                <span className="text-amber-400 font-mono">Stock: {i.stock} {stockUnit(i.unidad)}</span>
                              )}
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="px-2 py-0.5 rounded bg-blue-500/20 text-cyan-300 text-[10px] font-bold">
                              {i.unidad || 'KG'}
                            </span>
                            {i.precioRef && i.precioRef > 0 ? (
                              <p className="text-[10px] text-emerald-400 font-mono mt-0.5 font-black">
                                Ref: S/ {i.precioRef.toFixed(2)}
                              </p>
                            ) : null}
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Cantidad, Unidad y P. Unitario */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Cantidad:</label>
                  <input
                    type="number"
                    required
                    step="any"
                    min="0.01"
                    placeholder="1"
                    value={nuevaCantidadStr}
                    onChange={(e) => setNuevaCantidadStr(e.target.value)}
                    onFocus={(e) => e.target.select()}
                    className={`w-full rounded-xl border p-2.5 font-mono ${inputBg}`}
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Unidad:</label>
                  <select
                    value={nuevaUnidad}
                    onChange={(e) => setNuevaUnidad(e.target.value)}
                    className={`w-full rounded-xl border p-2.5 ${inputBg}`}
                  >
                    <option value="KG">KG (Kilogramo)</option>
                    <option value="GR">GR (Gramo)</option>
                    <option value="LT">LT (Litro)</option>
                    <option value="ML">ML (Mililitro)</option>
                    <option value="UND">UND (Envase / Unidad)</option>
                    <option value="GAL">GAL (Galón)</option>
                    <option value="CIL">CIL (Cilindro)</option>
                    <option value="TN">TN (Tonelada)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">P. Unitario (S/):</label>
                  <input
                    type="number"
                    required
                    step="any"
                    min="0.01"
                    placeholder="0.00"
                    value={nuevoPrecioStr}
                    onChange={(e) => setNuevoPrecioStr(e.target.value)}
                    onFocus={(e) => e.target.select()}
                    className={`w-full rounded-xl border p-2.5 font-mono ${inputBg}`}
                  />
                </div>
              </div>

              {nuevaUnidad === 'GR' && (parseFloat(nuevaCantidadStr) || 0) <= 10 && (
                <div className="p-2.5 rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-300 text-[11px] flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold">⚠️ Atención: Has seleccionado Gramos (GR)</strong>
                    Estás comprando {nuevaCantidadStr} GR. Si el insumo se adquiere en <strong>1 Kilo</strong>, selecciona la unidad <strong>KG</strong> o escribe <strong>1000 GR</strong> para no distorsionar el costo unitario en Kardex.
                  </div>
                </div>
              )}

              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between font-mono">
                <span className="font-bold text-slate-300">TOTAL ESTIMADO OC:</span>
                <span className="text-base font-black text-emerald-400">
                  S/ {(((parseFloat(nuevaCantidadStr) || 0) * (parseFloat(nuevoPrecioStr) || 0))).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Observaciones / Notas:</label>
                <textarea
                  rows={2}
                  placeholder="Detalles para recepción en planta..."
                  value={nuevasObs}
                  onChange={(e) => setNuevasObs(e.target.value)}
                  className={`w-full rounded-xl border p-2.5 ${inputBg}`}
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
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black tracking-wider uppercase shadow-lg shadow-emerald-500/20"
                >
                  Emitir Orden de Compra
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDITAR ORDEN DE COMPRA (CRUD CONDICIONADO) */}
      {isEditModalOpen && editingOC && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className={`w-full max-w-lg rounded-2xl border p-6 space-y-4 shadow-2xl relative ${cardBg}`}>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Pencil className="w-5 h-5 text-cyan-400" />
                <div>
                  <h3 className={`text-base font-black ${textValue}`}>
                    Editar Orden de Compra: {editingOC.codigoOC}
                  </h3>
                  <div className="mt-0.5">
                    {esAdminOGerencia ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                        👑 Modo Directivo: Edición Ilimitada
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                        👤 Asistente: Edición {(editingOC.edicionesCount || 0) + 1} de 2 permitidas
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {editError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{editError}</span>
              </div>
            )}

            <form onSubmit={handleActualizarOC} className="space-y-3.5 text-xs">
              {/* Proveedor en Edición */}
              <div className="relative" ref={editProvRef}>
                <label className="block font-bold text-slate-300 mb-1">
                  Proveedor / Razón Social:
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 absolute left-3 top-3 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    required
                    placeholder="Buscar o escribir nombre del proveedor..."
                    value={editProveedor}
                    onChange={(e) => {
                      setEditProveedor(e.target.value);
                      setIsEditProvOpen(true);
                    }}
                    onFocus={() => setIsEditProvOpen(true)}
                    className={`w-full rounded-xl border pl-9 pr-10 p-2.5 ${inputBg}`}
                  />
                  <button
                    type="button"
                    onClick={() => setIsEditProvOpen(!isEditProvOpen)}
                    className="absolute right-2.5 top-2.5 p-1 rounded-md text-slate-400 hover:text-white"
                  >
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isEditProvOpen ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                {isEditProvOpen && (
                  <div className="absolute z-50 left-0 right-0 mt-1 max-h-48 overflow-y-auto rounded-xl border border-slate-700 bg-[#0F141C] shadow-2xl divide-y divide-slate-800/60">
                    {filteredEditProveedores.map((p) => (
                      <button
                        key={p.id || p.ruc}
                        type="button"
                        onClick={() => {
                          setEditProveedor(p.razonSocial);
                          setEditRuc(p.ruc);
                          setEditProveedorId(p.id || '');
                          setIsEditProvOpen(false);
                        }}
                        className="w-full text-left p-2.5 hover:bg-cyan-500/10 transition-colors flex items-center justify-between cursor-pointer"
                      >
                        <div className="truncate">
                          <p className="font-bold text-slate-200 truncate">{p.razonSocial}</p>
                          <span className="text-[10px] text-cyan-400 font-mono">RUC: {p.ruc}</span>
                        </div>
                        {editRuc === p.ruc && <Check className="w-4 h-4 text-cyan-400 shrink-0" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">RUC:</label>
                  <input
                    type="text"
                    value={editRuc}
                    onChange={(e) => setEditRuc(e.target.value)}
                    className={`w-full rounded-xl border p-2.5 font-mono ${inputBg}`}
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Condición de Pago:</label>
                  <select
                    value={editCondicion}
                    onChange={(e) => setEditCondicion(e.target.value)}
                    className={`w-full rounded-xl border p-2.5 ${inputBg}`}
                  >
                    <option value="Contado Contra Entrega">Contado Contra Entrega</option>
                    <option value="Crédito 15 días">Crédito 15 días</option>
                    <option value="Crédito 30 días">Crédito 30 días</option>
                    <option value="Crédito 60 días">Crédito 60 días</option>
                  </select>
                </div>
              </div>

              {/* Insumo en Edición */}
              <div className="relative" ref={editInsumoRef}>
                <label className="block font-bold text-slate-300 mb-1">
                  Insumo / Materia Prima:
                </label>
                <div className="relative">
                  <Package className="w-4 h-4 absolute left-3 top-3 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    required
                    placeholder="Buscar o escribir nombre del insumo..."
                    value={editInsumo}
                    onChange={(e) => {
                      setEditInsumo(e.target.value);
                      setIsEditInsumoOpen(true);
                    }}
                    onFocus={() => setIsEditInsumoOpen(true)}
                    className={`w-full rounded-xl border pl-9 pr-10 p-2.5 ${inputBg}`}
                  />
                  <button
                    type="button"
                    onClick={() => setIsEditInsumoOpen(!isEditInsumoOpen)}
                    className="absolute right-2.5 top-2.5 p-1 rounded-md text-slate-400 hover:text-white"
                  >
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isEditInsumoOpen ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                {isEditInsumoOpen && (
                  <div className="absolute z-50 left-0 right-0 mt-1 max-h-48 overflow-y-auto rounded-xl border border-slate-700 bg-[#0F141C] shadow-2xl divide-y divide-slate-800/60">
                    {filteredEditInsumos.map((i) => (
                      <button
                        key={i.id || i.nombre}
                        type="button"
                        onClick={() => {
                          setEditInsumo(i.nombre);
                          if (i.unidad) setEditUnidad(i.unidad);
                          if (i.precioRef && i.precioRef > 0) {
                            setEditPrecioStr(i.precioRef.toFixed(2));
                          }
                          setIsEditInsumoOpen(false);
                        }}
                        className="w-full text-left p-2.5 hover:bg-cyan-500/10 transition-colors flex items-center justify-between cursor-pointer"
                      >
                        <div className="truncate">
                          <p className="font-bold text-slate-200 truncate">{i.nombre}</p>
                          <span className="text-[10px] text-cyan-400 font-mono">{i.codigo || i.unidad}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-blue-500/20 text-cyan-300 text-[10px] font-bold">
                          {i.unidad || 'KG'}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Cantidad, Unidad y P. Unitario en Edición */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Cantidad:</label>
                  <input
                    type="number"
                    required
                    step="any"
                    min="0.01"
                    placeholder="1"
                    value={editCantidadStr}
                    onChange={(e) => setEditCantidadStr(e.target.value)}
                    onFocus={(e) => e.target.select()}
                    className={`w-full rounded-xl border p-2.5 font-mono ${inputBg}`}
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Unidad:</label>
                  <select
                    value={editUnidad}
                    onChange={(e) => setEditUnidad(e.target.value)}
                    className={`w-full rounded-xl border p-2.5 ${inputBg}`}
                  >
                    <option value="KG">KG (Kilogramo)</option>
                    <option value="GR">GR (Gramo)</option>
                    <option value="LT">LT (Litro)</option>
                    <option value="ML">ML (Mililitro)</option>
                    <option value="UND">UND (Envase / Unidad)</option>
                    <option value="GAL">GAL (Galón)</option>
                    <option value="CIL">CIL (Cilindro)</option>
                    <option value="TN">TN (Tonelada)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">P. Unitario (S/):</label>
                  <input
                    type="number"
                    required
                    step="any"
                    min="0.01"
                    placeholder="0.00"
                    value={editPrecioStr}
                    onChange={(e) => setEditPrecioStr(e.target.value)}
                    onFocus={(e) => e.target.select()}
                    className={`w-full rounded-xl border p-2.5 font-mono ${inputBg}`}
                  />
                </div>
              </div>

              {/* Alerta Antierror KG vs GR */}
              {editUnidad === 'GR' && (parseFloat(editCantidadStr) || 0) <= 10 && (
                <div className="p-2.5 rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-300 text-[11px] flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold">⚠️ Atención: Unidad en Gramos (GR)</strong>
                    Estás indicando {editCantidadStr} GR a S/ {editPrecioStr}. Si el precio corresponde a <strong>1 Kilogramo</strong>, cambia la unidad a <strong>KG</strong> o coloca <strong>1000 GR</strong> para corregir el kardex.
                  </div>
                </div>
              )}

              {/* Total Recalculado */}
              <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-between font-mono">
                <span className="font-bold text-slate-300">TOTAL ACTUALIZADO OC:</span>
                <span className="text-base font-black text-cyan-400">
                  S/ {(((parseFloat(editCantidadStr) || 0) * (parseFloat(editPrecioStr) || 0))).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Notas / Motivo de corrección:</label>
                <textarea
                  rows={2}
                  placeholder="Explica brevemente la corrección..."
                  value={editObs}
                  onChange={(e) => setEditObs(e.target.value)}
                  className={`w-full rounded-xl border p-2.5 ${inputBg}`}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={editGuardando}
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black tracking-wider uppercase shadow-lg shadow-cyan-500/20 disabled:opacity-50"
                >
                  {editGuardando ? 'Guardando...' : 'Guardar Corrección'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL ELIMINAR / ANULAR OC */}
      {ocToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className={`w-full max-w-md rounded-2xl border p-6 space-y-4 shadow-2xl relative ${cardBg}`}>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-rose-400" />
                <h3 className={`text-base font-black ${textValue}`}>
                  Gestionar Orden: {ocToDelete.codigoOC}
                </h3>
              </div>
              <button
                onClick={() => setOcToDelete(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {deleteError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{deleteError}</span>
              </div>
            )}

            <div className="space-y-2 text-xs text-slate-300">
              <p>
                <strong>Proveedor:</strong> {ocToDelete.proveedor}
              </p>
              <p>
                <strong>Total Orden:</strong> S/ {ocToDelete.totalPEN.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
              </p>
              <p>
                <strong>Estado Actual:</strong> <span className="font-bold text-amber-400">{ocToDelete.estado}</span>
              </p>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 space-y-1 mt-2">
                <p>• <strong>Eliminar Definitivamente:</strong> Borra la orden de compra por completo de la base de datos (solo si no fue ingresada a Kardex).</p>
                <p>• <strong>Anular Orden:</strong> Conserva el registro histórico pero cambia su estado a <span className="text-rose-400 font-bold">ANULADA</span>.</p>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  disabled={deletingOC}
                  onClick={handleAnularOC}
                  className="px-3 py-2 rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 font-bold transition-all text-center text-xs"
                >
                  Anular Orden
                </button>
                <button
                  type="button"
                  disabled={deletingOC}
                  onClick={handleEliminarOC}
                  className="px-3 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold transition-all text-center text-xs shadow-lg shadow-rose-500/20"
                >
                  {deletingOC ? 'Procesando...' : 'Eliminar Definitiva'}
                </button>
              </div>
              <button
                type="button"
                onClick={() => setOcToDelete(null)}
                className="w-full py-2 rounded-xl border border-slate-700 text-slate-400 hover:bg-slate-800 text-xs font-semibold"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST DE ÉXITO */}
      {toastSuccess && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-2xl shadow-emerald-500/30 animate-bounce">
          <Check className="w-4 h-4 text-slate-950" />
          <span>{toastSuccess}</span>
        </div>
      )}
    </div>
  );
}

