'use client';

import React, { useState, useMemo, useEffect } from 'react';
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
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { useTheme } from '@/lib/ThemeContext';
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
}

const INITIAL_ORDENES: OrdenCompraItem[] = [
  {
    id: 'oc-001',
    codigoOC: 'OC-2026-0042',
    proveedor: 'QUÍMICA SUIZA S.A.C.',
    ruc: '20100030045',
    fechaEmision: '2026-09-02',
    fechaEntregaEstimada: '2026-09-06',
    estado: 'EN_TRANSITO',
    totalPEN: 14500.00,
    moneda: 'PEN',
    condicionPago: 'Crédito 30 días',
    comprador: 'Elvis Yarleque',
    items: [
      { insumo: 'Texapon 70% (Lauril Éter Sulfato de Sodio)', cantidad: 2000, unidadMedida: 'KG', precioUnitario: 4.80, subtotal: 9600.00 },
      { insumo: 'Comperlan KD (Dietanolamida de Coco)', cantidad: 500, unidadMedida: 'KG', precioUnitario: 9.80, subtotal: 4900.00 },
    ],
    observaciones: 'Lote prioritario para producción de Detergente Líquido y Lavavajillas.',
  },
  {
    id: 'oc-002',
    codigoOC: 'OC-2026-0041',
    proveedor: 'DISAN PERÚ S.A.',
    ruc: '20345678901',
    fechaEmision: '2026-09-01',
    fechaEntregaEstimada: '2026-09-04',
    estado: 'RECIBIDO',
    totalPEN: 8900.00,
    moneda: 'PEN',
    condicionPago: 'Contado Contra Entrega',
    comprador: 'Elvis Yarleque',
    items: [
      { insumo: 'Ácido Sulfónico Lineal (LABSA 96%)', cantidad: 1500, unidadMedida: 'KG', precioUnitario: 5.20, subtotal: 7800.00 },
      { insumo: 'Colorante Azul Brillante Especial', cantidad: 20, unidadMedida: 'KG', precioUnitario: 55.00, subtotal: 1100.00 },
    ],
    observaciones: 'Ingresado al Kardex de Almacén e insumos pesados conformes.',
  },
  {
    id: 'oc-003',
    codigoOC: 'OC-2026-0040',
    proveedor: 'CRODA PERÚ S.A.',
    ruc: '20501234567',
    fechaEmision: '2026-08-28',
    fechaEntregaEstimada: '2026-09-05',
    estado: 'PENDIENTE',
    totalPEN: 6350.00,
    moneda: 'PEN',
    condicionPago: 'Crédito 15 días',
    comprador: 'Asistente Compras',
    items: [
      { insumo: 'Fragancia Lavanda Francesa Concentrada', cantidad: 50, unidadMedida: 'LT', precioUnitario: 85.00, subtotal: 4250.00 },
      { insumo: 'Fragancia Limón Citrus Industrial', cantidad: 30, unidadMedida: 'LT', precioUnitario: 70.00, subtotal: 2100.00 },
    ],
    observaciones: 'Pendiente de confirmación de guía de despacho por el proveedor.',
  },
  {
    id: 'oc-004',
    codigoOC: 'OC-2026-0039',
    proveedor: 'PLÁSTICOS INDUSTRIALES DEL PERÚ S.A.C.',
    ruc: '20498765432',
    fechaEmision: '2026-08-25',
    fechaEntregaEstimada: '2026-08-30',
    estado: 'RECIBIDO',
    totalPEN: 12400.00,
    moneda: 'PEN',
    condicionPago: 'Crédito 45 días',
    comprador: 'Elvis Yarleque',
    items: [
      { insumo: 'Galonera Blanca 4L con Tapa Precinto', cantidad: 3000, unidadMedida: 'UND', precioUnitario: 2.80, subtotal: 8400.00 },
      { insumo: 'Bidón 20L Azul Reforzado con Rosca', cantidad: 400, unidadMedida: 'UND', precioUnitario: 10.00, subtotal: 4000.00 },
    ],
    observaciones: 'Recepción completa en almacén de envases.',
  },
  {
    id: 'oc-005',
    codigoOC: 'OC-2026-0038',
    proveedor: 'MATHIESEN PERÚ S.A.C.',
    ruc: '20223344556',
    fechaEmision: '2026-08-20',
    fechaEntregaEstimada: '2026-08-26',
    estado: 'RECIBIDO',
    totalPEN: 18200.00,
    moneda: 'PEN',
    condicionPago: 'Crédito 30 días',
    comprador: 'Elvis Yarleque',
    items: [
      { insumo: 'Soda Cáustica en Escamas 99% (Hidróxido de Sodio)', cantidad: 4000, unidadMedida: 'KG', precioUnitario: 3.50, subtotal: 14000.00 },
      { insumo: 'Hipoclorito de Sodio 10% Industrial', cantidad: 3500, unidadMedida: 'LT', precioUnitario: 1.20, subtotal: 4200.00 },
    ],
    observaciones: 'Lote de químicos base para reactores de blanqueo.',
  },
];

export default function AdministracionOrdenesPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [ordenes, setOrdenes] = useState<OrdenCompraItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEstado, setSelectedEstado] = useState<EstadoOrdenCompra>('TODAS');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOC, setSelectedOC] = useState<OrdenCompraItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const cargar = async () => {
      try {
        const { apiFetch } = await import('@/lib/apiClient');
        const r2 = await apiFetch('/ordenes-compra').catch(() => ({ data: [] }));
        if (Array.isArray(r2.data)) {
          const mapped: OrdenCompraItem[] = r2.data.map((o: any) => ({
            id: o.id, codigoOC: o.codigoOC, proveedor: o.proveedorNombre, ruc: o.ruc,
            fechaEmision: new Date(o.fechaEmision).toISOString().split('T')[0],
            fechaEntregaEstimada: new Date(o.fechaEntregaEstimada).toISOString().split('T')[0],
            estado: o.estado, totalPEN: Number(o.totalPEN), moneda: o.moneda, condicionPago: o.condicionPago, comprador: o.comprador, observaciones: o.observaciones,
            items: (o.items || []).map((it: any) => ({ insumo: it.insumoNombre, cantidad: Number(it.cantidad), unidadMedida: it.unidadMedida, precioUnitario: Number(it.precioUnitario), subtotal: Number(it.subtotal) })),
          }));
          setOrdenes(mapped);
        } else {
          setOrdenes([]);
        }
      } catch { setOrdenes([]); } finally { setLoading(false); }
    };
    cargar();
  }, []);

  // Form nueva OC
  const [nuevoProveedor, setNuevoProveedor] = useState('');
  const [nuevoRuc, setNuevoRuc] = useState('');
  const [nuevoInsumo, setNuevoInsumo] = useState('');
  const [nuevaCantidad, setNuevaCantidad] = useState<number>(100);
  const [nuevaUnidad, setNuevaUnidad] = useState('KG');
  const [nuevoPrecio, setNuevoPrecio] = useState<number>(5.0);
  const [nuevaCondicion, setNuevaCondicion] = useState('Crédito 30 días');
  const [nuevasObs, setNuevasObs] = useState('');

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
    if (!nuevoProveedor.trim() || !nuevoInsumo.trim() || nuevaCantidad <= 0) {
      alert('Por favor completa todos los datos de la Orden de Compra.');
      return;
    }
    try {
      const { apiFetch } = require('@/lib/apiClient');
      const res: any = await apiFetch('/ordenes-compra', {
        method: 'POST',
        body: JSON.stringify({
          proveedorId: (await apiFetch('/proveedores').then((r: any) => r.data?.[0]?.id).catch(() => null)) || (await import('@/lib/apiClient').then(m => m.apiFetch('/proveedores').catch(()=>null))),
          ruc: nuevoRuc.trim() || '20999999999',
          proveedorNombre: nuevoProveedor.trim(),
          fechaEntregaEstimada: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          condicionPago: nuevaCondicion,
          comprador: 'Administración Quimicorp',
          observaciones: nuevasObs.trim() || 'Generado desde Administración.',
          items: [{ insumoNombre: nuevoInsumo.trim(), cantidad: Number(nuevaCantidad), unidadMedida: nuevaUnidad, precioUnitario: Number(nuevoPrecio) }],
        }),
      });
      // Fallback local si backend aún no responde
      if (res?.data?.id) {
        const o = res.data;
        const nuevaOC: OrdenCompraItem = {
          id: o.id, codigoOC: o.codigoOC, proveedor: o.proveedorNombre, ruc: o.ruc,
          fechaEmision: new Date(o.fechaEmision).toISOString().split('T')[0],
          fechaEntregaEstimada: new Date(o.fechaEntregaEstimada).toISOString().split('T')[0],
          estado: o.estado, totalPEN: Number(o.totalPEN), moneda: o.moneda, condicionPago: o.condicionPago, comprador: o.comprador, observaciones: o.observaciones,
          items: (o.items || []).map((it: any) => ({ insumo: it.insumoNombre, cantidad: Number(it.cantidad), unidadMedida: it.unidadMedida, precioUnitario: Number(it.precioUnitario), subtotal: Number(it.subtotal) })),
        };
        setOrdenes([nuevaOC, ...ordenes]);
      } else throw new Error('fallback');
    } catch {
      const sub = nuevaCantidad * nuevoPrecio;
      const nuevaOC: OrdenCompraItem = {
        id: `oc-${Date.now()}`, codigoOC: `OC-2026-${String(ordenes.length + 43).padStart(4, '0')}`,
        proveedor: nuevoProveedor.trim(), ruc: nuevoRuc.trim() || '20999999999',
        fechaEmision: new Date().toISOString().split('T')[0],
        fechaEntregaEstimada: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        estado: 'PENDIENTE', totalPEN: sub, moneda: 'PEN', condicionPago: nuevaCondicion, comprador: 'Administración Quimicorp',
        items: [{ insumo: nuevoInsumo.trim(), cantidad: Number(nuevaCantidad), unidadMedida: nuevaUnidad, precioUnitario: Number(nuevoPrecio), subtotal: sub }],
        observaciones: nuevasObs.trim() || 'Generado desde Administración.',
      };
      setOrdenes([nuevaOC, ...ordenes]);
    }
    setIsModalOpen(false);
    setNuevoProveedor(''); setNuevoRuc(''); setNuevoInsumo(''); setNuevaCantidad(100); setNuevoPrecio(5.0); setNuevasObs('');
  };

  const handleMarcarRecibido = async (id: string) => {
    try {
      const { apiFetch } = require('@/lib/apiClient');
      await apiFetch(`/ordenes-compra/${id}/recibir`, { method: 'PATCH' });
    } catch {}
    setOrdenes((prev) => prev.map((o) => (o.id === id ? { ...o, estado: 'RECIBIDO' } : o)));
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
                    <button
                      onClick={() => handleMarcarRecibido(oc.id)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-bold flex items-center gap-1.5 transition-all"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Ingresar a Kardex</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      alert(`Mostrando vista previa oficial de ${oc.codigoOC} para impresión.`);
                    }}
                    className={`px-3 py-1.5 rounded-xl border font-bold transition-all flex items-center gap-1.5 ${
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
              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  Proveedor / Empresa Distribuidora:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. QUÍMICA SUIZA S.A.C."
                  value={nuevoProveedor}
                  onChange={(e) => setNuevoProveedor(e.target.value)}
                  className={`w-full rounded-xl border p-2.5 ${inputBg}`}
                />
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

              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  Insumo / Materia Prima Principal:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Texapon 70% o Soda Cáustica Escamas"
                  value={nuevoInsumo}
                  onChange={(e) => setNuevoInsumo(e.target.value)}
                  className={`w-full rounded-xl border p-2.5 ${inputBg}`}
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Cantidad:</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={nuevaCantidad}
                    onChange={(e) => setNuevaCantidad(Number(e.target.value))}
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
                    <option value="KG">KG</option>
                    <option value="LT">LT</option>
                    <option value="UND">UND (Envase)</option>
                    <option value="GAL">GAL</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">P. Unitario (S/):</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    min="0.01"
                    value={nuevoPrecio}
                    onChange={(e) => setNuevoPrecio(Number(e.target.value))}
                    className={`w-full rounded-xl border p-2.5 font-mono ${inputBg}`}
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between font-mono">
                <span className="font-bold text-slate-300">TOTAL ESTIMADO OC:</span>
                <span className="text-base font-black text-emerald-400">
                  S/ {(nuevaCantidad * nuevoPrecio).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
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
    </div>
  );
}
