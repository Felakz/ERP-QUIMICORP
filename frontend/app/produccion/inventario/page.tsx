'use client';

import React, { useState, useEffect } from 'react';
import { Search, RefreshCw, AlertTriangle, Package, Warehouse, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';
import { apiFetch } from '@/lib/apiClient';
import { useSocket } from '@/lib/socketContext';

interface MaterialItem {
  sku: string;
  nombre: string;
  familia: string;
  tipo?: string;
  estadoFisico?: string | null;
  stockPercentage: number;
  stockReal: number;
  cantidadFisica?: number;
  stockMinimo: number;
  unidad: string;
  unidadMedidaVisual?: string;
  proveedor?: string;
  ubicacion: string;
  estado: 'OK' | 'LOW STOCK' | 'CRITICAL';
}

interface SubAlmacenItem {
  id: string;
  codigo: string;
  nombre: string;
  peso: string;
  unidad: string;
  loteOrigen: string;
  fecha: string;
  reutilizable: boolean;
}

export default function InventariosPage() {
  const { theme } = useTheme();
  const { socket } = useSocket();
  const isDark = theme === 'dark';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedEstadoFilter, setSelectedEstadoFilter] = useState<'TODOS' | 'OK' | 'LOW_STOCK' | 'CRITICAL'>('TODOS');
  const [materialsData, setMaterialsData] = useState<MaterialItem[]>([]);
  const [subAlmacenData, setSubAlmacenData] = useState<SubAlmacenItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [disponibilidadTotal, setDisponibilidadTotal] = useState('0');
  const [stockCriticoCount, setStockCriticoCount] = useState(0);
  const [stockBajoCount, setStockBajoCount] = useState(0);
  const [insumosCriticosDetalle, setInsumosCriticosDetalle] = useState<any[]>([]);

  // Estado del Modal de Reaprovisionamiento en Masa (Mltiples productos)
  const [modalReaprovisionamiento, setModalReaprovisionamiento] = useState(false);
  const [listaReaprovisionamiento, setListaReaprovisionamiento] = useState<{
    sku: string;
    nombre: string;
    stockReal: number;
    unidad: string;
    cantidadSolicitada: number;
  }[]>([]);

  const cargarInventarioReal = async () => {
    try {
      setLoading(true);
      const { data, ok } = await apiFetch<any>('/inventario/dashboard/lista-completa');
      if (ok && data) {
        setMaterialsData(
          (data.insumos || []).map((m: any) => ({
            ...m,
            cantidadFisica: m.cantidadFisica ?? (m.unidad === 'GR' ? m.stockReal : (m.stockReal / 1000)),
            stockReal: m.stockReal ?? m.stockActual ?? 0,
            stockMinimo: m.stockMinimo ?? 10,
          }))
        );
        setSubAlmacenData(data.subAlmacen || []);
        setDisponibilidadTotal(
          data.disponibilidadTotalKg ? Number(data.disponibilidadTotalKg).toLocaleString('es-PE') : '0'
        );
        setStockCriticoCount(data.stockCriticoCount ?? 0);
        setStockBajoCount(data.stockBajoCount ?? 0);
        setInsumosCriticosDetalle(data.insumosCriticosDetalle || []);
      }
    } catch (e) {
      console.log('Error cargando inventario:', e);
    } finally {
      setLoading(false);
    }
  };

  const cargarSubAlmacen = async () => {
    try {
      const { data, ok } = await apiFetch<any[]>('/sub-almacen/disponibles');
      if (ok && Array.isArray(data) && data.length > 0) {
        // Mapear a formato de cards: producto sobrante (no insumo), con % sobre el lote origen
        const mapped: SubAlmacenItem[] = data.map((s: any) => {
          const loteCodigo = s.loteOrigen?.codigoLote || s.loteOrigenId?.slice(0, 8) || 'LOTE';
          const producto = s.loteOrigen?.codigoLote ? `Producto ${loteCodigo}` : s.insumoSubproducto?.nombre || 'Producto Sobrante';
          // Para demo, el producto es del lote (ACEITE DE BATANA) — usamos insumo como proxy
          const pesoNum = Number(s.pesoDisponible) || 0;
          // % se calcula contra 50 KG del lote demo (10% = 5 KG) — en real vendría de OrdenProduccion.cantidadPlanificada
          const porcentajeDemo = pesoNum ? `${((pesoNum / 50) * 100).toFixed(1)}%` : '—';
          return {
            id: s.id,
            codigo: loteCodigo,
            nombre: s.insumoSubproducto?.nombre ? `${s.insumoSubproducto.nombre} (Prod. ${loteCodigo})` : producto,
            peso: `${pesoNum} KG (${porcentajeDemo})`,
            unidad: 'KG',
            loteOrigen: loteCodigo,
            fecha: new Date(s.createdAt).toLocaleDateString('es-PE'),
            reutilizable: s.estado === 'DISPONIBLE',
          };
        });
        setSubAlmacenData(mapped);
      }
    } catch {}
  };

  React.useEffect(() => {
    cargarInventarioReal();
    cargarSubAlmacen();
  }, []);

  useEffect(() => {
    if (!socket) return;
    const onRefresh = () => { cargarInventarioReal(); cargarSubAlmacen(); };
    socket.on('inventario:actualizado', onRefresh);
    socket.on('inventario:alerta_stock_critico', onRefresh);
    socket.on('lote:estado_actualizado', onRefresh);
    return () => {
      socket.off('inventario:actualizado', onRefresh);
      socket.off('inventario:alerta_stock_critico', onRefresh);
      socket.off('lote:estado_actualizado', onRefresh);
    };
  }, [socket]);

  const categories = [
    'Todos',
    ...Array.from(new Set(materialsData.map((m) => m.familia))),
  ];

  const filteredMaterials = materialsData.filter((item) => {
    const matchesSearch =
      item.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'Todos' ||
      item.familia.toLowerCase() === selectedCategory.toLowerCase();
    
    let matchesEstado = true;
    if (selectedEstadoFilter === 'OK') {
      matchesEstado = item.estado === 'OK';
    } else if (selectedEstadoFilter === 'LOW_STOCK') {
      matchesEstado = item.estado === 'LOW STOCK';
    } else if (selectedEstadoFilter === 'CRITICAL') {
      matchesEstado = item.estado === 'CRITICAL';
    }
    return matchesSearch && matchesCategory && matchesEstado;
  });

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 50;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedEstadoFilter]);

  const totalPages = Math.ceil(filteredMaterials.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedMaterials = filteredMaterials.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const cardBg = isDark ? 'bg-[#0F141C] border-[#1A2232]' : 'bg-white border-slate-200 shadow-sm';
  const textTitle = isDark ? 'text-slate-400' : 'text-slate-500';
  const textValue = isDark ? 'text-white' : 'text-slate-900';
  const inputBg = isDark ? 'bg-[#151D2A] border-[#1A2232] text-slate-200 placeholder-slate-500' : 'bg-slate-50 border-slate-300 text-slate-800 placeholder-slate-400';

  // Abrir modal con insumos crticos o seleccionar uno especfico
  const handleAbrirModalReabastecer = (itemInicial?: any) => {
    const itemsCriticosDisponibles = materialsData.filter(m => m.estado !== 'OK' || m.stockReal <= m.stockMinimo);
    
    if (itemInicial) {
      setListaReaprovisionamiento([
        {
          sku: itemInicial.sku,
          nombre: itemInicial.nombre,
          stockReal: itemInicial.stockReal,
          unidad: itemInicial.unidad,
          cantidadSolicitada: 50,
        },
      ]);
    } else if (itemsCriticosDisponibles.length > 0) {
      setListaReaprovisionamiento(
        itemsCriticosDisponibles.slice(0, 3).map((m) => ({
          sku: m.sku,
          nombre: m.nombre,
          stockReal: m.stockReal,
          unidad: m.unidad,
          cantidadSolicitada: 50,
        }))
      );
    } else if (materialsData.length > 0) {
      setListaReaprovisionamiento([
        {
          sku: materialsData[0].sku,
          nombre: materialsData[0].nombre,
          stockReal: materialsData[0].stockReal,
          unidad: materialsData[0].unidad,
          cantidadSolicitada: 50,
        },
      ]);
    }
    setModalReaprovisionamiento(true);
  };

  const handleAgregarInsumoAModal = () => {
    const disponibles = materialsData.filter(m => !listaReaprovisionamiento.some(l => l.sku === m.sku));
    const candidato = disponibles.length > 0 ? disponibles[0] : materialsData[0];
    if (candidato) {
      setListaReaprovisionamiento((prev) => [
        ...prev,
        {
          sku: candidato.sku,
          nombre: candidato.nombre,
          stockReal: candidato.stockReal,
          unidad: candidato.unidad,
          cantidadSolicitada: 50,
        },
      ]);
    }
  };

  const handleCambiarInsumoEnModal = (index: number, nuevoSku: string) => {
    const insumoEncontrado = materialsData.find((m) => m.sku === nuevoSku);
    if (insumoEncontrado) {
      setListaReaprovisionamiento((prev) =>
        prev.map((item, idx) =>
          idx === index
            ? {
                sku: insumoEncontrado.sku,
                nombre: insumoEncontrado.nombre,
                stockReal: insumoEncontrado.stockReal,
                unidad: insumoEncontrado.unidad,
                cantidadSolicitada: item.cantidadSolicitada,
              }
            : item
        )
      );
    }
  };

  const handleCambiarCantidadEnModal = (index: number, cantidad: number) => {
    setListaReaprovisionamiento((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, cantidadSolicitada: cantidad } : item))
    );
  };

  const handleEliminarInsumoDeModal = (index: number) => {
    setListaReaprovisionamiento((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleEnviarSolicitudCompraEnMasa = () => {
    if (listaReaprovisionamiento.length === 0) {
      alert('⚠️ Por favor agrega al menos un insumo a la solicitud de compra.');
      return;
    }

    const detalleStr = listaReaprovisionamiento
      .map((item) => ` ${item.nombre} (${item.sku}): ${item.cantidadSolicitada} ${item.unidad} (Stock actual: ${item.stockReal} ${item.unidad})`)
      .join('\n');

    alert(
      `📦 SOLICITUD EN MASA DE REAPROVISIONAMIENTO EMITIDA:\n\n` +
      `Total de Productos Solicitados: ${listaReaprovisionamiento.length}\n\n` +
      `${detalleStr}\n\n` +
      `- Destino: Almacén Principal Quimicorp Perú S.A.C.\n` +
      `- Notificado a: Compras & Logística de Planta`
    );
    setModalReaprovisionamiento(false);
  };

  return (
    <div className="space-y-6 font-mono min-h-screen">
      {/* Banner Dinámico de Alerta de Stock Crítico */}
      {insumosCriticosDetalle.length > 0 && (
        <div className={`rounded-xl p-4 border flex items-center justify-between gap-4 ${
          isDark
            ? 'bg-rose-950/40 border-rose-500/40 text-slate-200'
            : 'bg-rose-100 border-rose-300 text-rose-950 shadow-sm'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${
              isDark
                ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                : 'bg-rose-200 text-rose-800 border-rose-400'
            }`}>
              <AlertTriangle className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h4 className={`text-xs font-black font-sans ${
                isDark ? 'text-rose-300' : 'text-rose-950'
              }`}>
                ⚠️ ALERTA EN TIEMPO REAL: {insumosCriticosDetalle.length} MATERIAL(ES) EN STOCK CRÍTICO (&lt; 20%)
              </h4>
              <p className={`text-[11px] font-sans mt-0.5 ${
                isDark ? 'text-slate-300' : 'text-rose-900 font-medium'
              }`}>
                {insumosCriticosDetalle.slice(0, 3).map(i => `${i.nombre} (${i.stockReal} ${i.unidad})`).join(', ')} requieren orden de compra inmediata.
              </p>
            </div>
          </div>

          <button
            onClick={() => handleAbrirModalReabastecer()}
            className={`rounded-lg px-4 py-2 text-xs font-black font-sans shrink-0 shadow transition-all hover:scale-105 ${
              isDark ? 'bg-rose-500 text-slate-950 hover:bg-rose-400' : 'bg-rose-700 text-white hover:bg-rose-800'
            }`}
          >
            REAPROVISIONAR EN MASA
          </button>
        </div>
      )}

      {/* Top 4 KPI Metrics Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* TOTAL MATERIALES */}
        <div
          onClick={() => setSelectedEstadoFilter('TODOS')}
          className={`rounded-xl p-4 border cursor-pointer hover:border-cyan-500/50 transition-all ${cardBg}`}
        >
          <span className={`text-[11px] font-bold tracking-widest uppercase ${textTitle}`}>
            TOTAL MATERIALES
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-cyan-500">{materialsData.length}</span>
            <span className="text-xs text-slate-400 font-sans">SKUs Activos</span>
          </div>
        </div>

        {/* DISPONIBILIDAD EN PLANTA */}
        <div className={`rounded-xl p-4 border ${cardBg}`}>
          <span className={`text-[11px] font-bold tracking-widest uppercase ${textTitle}`}>
            DISPONIBILIDAD TOTAL
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-2xl font-black ${textValue}`}>{disponibilidadTotal}</span>
            <span className="text-xs text-slate-400 font-sans">KG / LT Fsicos</span>
          </div>
        </div>

        {/* STOCK CRTICO */}
        <div
          onClick={() => setSelectedEstadoFilter('CRITICAL')}
          className={`rounded-xl p-4 border cursor-pointer hover:border-rose-500/50 transition-all ${cardBg}`}
        >
          <span className={`text-[11px] font-bold tracking-widest uppercase ${textTitle}`}>
            STOCK CRTICO
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-rose-500">{stockCriticoCount}</span>
            <span className="text-xs text-slate-400 font-sans">materiales</span>
          </div>
        </div>

        {/* STOCK BAJO */}
        <div
          onClick={() => setSelectedEstadoFilter('LOW_STOCK')}
          className={`rounded-xl p-4 border cursor-pointer hover:border-amber-500/50 transition-all ${cardBg}`}
        >
          <span className={`text-[11px] font-bold tracking-widest uppercase ${textTitle}`}>
            STOCK BAJO
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-500">{stockBajoCount}</span>
            <span className="text-xs text-slate-400 font-sans">materiales</span>
          </div>
        </div>
      </div>

      {/* Main Control & Filter Bar (Estilo Idntico a Imagen 2) */}
      <div className={`rounded-xl p-4 border space-y-4 ${cardBg}`}>
        <div className="flex flex-wrap items-center justify-between gap-3 font-sans">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[260px] max-w-md">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por Producto, Insumo, Familia o SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full rounded-xl border py-2 pl-10 pr-4 text-xs focus:border-[#00F2C3] focus:outline-none transition-all ${inputBg}`}
            />
          </div>

          {/* Dropdown SELECT de Categoras/Familias (Estilo Imagen 2) */}
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold ${textTitle}`}>CATEGORA:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={`px-3 py-2 rounded-xl border text-xs font-bold transition-all ${
                isDark ? 'bg-[#151D2A] border-[#1A2232] text-slate-200' : 'bg-slate-100 border-slate-300 text-slate-800'
              }`}
            >
              {categories.map((cat) => {
                const count = cat === 'Todos' ? materialsData.length : materialsData.filter(m => m.familia.toLowerCase() === cat.toLowerCase()).length;
                return (
                  <option key={cat} value={cat}>
                    {cat === 'Todos' ? `Todas las Categoras (${count})` : `${cat} (${count})`}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Filter Pills para Estados (Estilo Exacto Imagen 2) */}
          <div className={`flex rounded-xl p-1 border text-xs font-sans ${
            isDark ? 'bg-[#151D2A] border-[#1A2232]' : 'bg-slate-100 border-slate-300'
          }`}>
            <button
              onClick={() => setSelectedEstadoFilter('TODOS')}
              className={`rounded-lg px-3.5 py-1.5 font-bold transition-all ${
                selectedEstadoFilter === 'TODOS'
                  ? 'bg-[#00F2C3] text-slate-950 shadow'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setSelectedEstadoFilter('OK')}
              className={`rounded-lg px-3.5 py-1.5 font-bold transition-all ${
                selectedEstadoFilter === 'OK'
                  ? 'bg-[#00F2C3] text-slate-950 shadow'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              ✅ Stock OK
            </button>
            <button
              onClick={() => setSelectedEstadoFilter('LOW_STOCK')}
              className={`rounded-lg px-3.5 py-1.5 font-bold transition-all ${
                selectedEstadoFilter === 'LOW_STOCK'
                  ? 'bg-[#00F2C3] text-slate-950 shadow'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              ⚠️ Stock Bajo
            </button>
            <button
              onClick={() => setSelectedEstadoFilter('CRITICAL')}
              className={`rounded-lg px-3.5 py-1.5 font-bold transition-all ${
                selectedEstadoFilter === 'CRITICAL'
                  ? 'bg-[#00F2C3] text-slate-950 shadow'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              🚨 Stock Crítico
            </button>
          </div>
        </div>

        {/* Materials Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className={`border-b text-[10px] font-bold tracking-widest uppercase ${isDark ? 'border-[#1A2232] text-slate-400' : 'border-slate-200 text-slate-500'}`}>
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">NOMBRE QUMICO</th>
                <th className="py-3 px-4">CATEGORA / FAMILIA</th>
                <th className="py-3 px-4">TIPO</th>
                <th className="py-3 px-4">ESTADO FÍSICO</th>
                <th className="py-3 px-4 text-right">CANTIDAD DISPONIBLE</th>
                <th className="py-3 px-4">NIVEL STOCK</th>
                <th className="py-3 px-4">PROVEEDOR ACTUAL</th>
                <th className="py-3 px-4">ESTADO</th>
                <th className="py-3 px-4 text-right">ACCIN</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-[#1A2232]/60' : 'divide-slate-200'}`}>
              {paginatedMaterials.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-400 font-sans">
                    No se encontraron materiales registrados.
                  </td>
                </tr>
              ) : (
                paginatedMaterials.map((item) => (
                  <tr key={item.sku} className={`transition-colors ${isDark ? 'hover:bg-[#151D2A]/50' : 'hover:bg-slate-50'}`}>
                    <td className="py-3.5 px-4 font-mono font-bold text-cyan-500">
                      {item.sku}
                    </td>
                    <td className={`py-3.5 px-4 font-sans font-bold text-xs uppercase ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                      {item.nombre}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`rounded px-2 py-0.5 text-[10px] font-bold border tracking-wider uppercase ${isDark ? 'bg-[#1A2434] text-slate-300 border-[#233146]' : 'bg-slate-100 text-slate-700 border-slate-300'}`}>
                        {item.familia}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`text-[10px] font-bold uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {item.tipo || '—'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${item.estadoFisico ? (isDark ? 'bg-[#1A2434] text-slate-300 border border-[#233146]' : 'bg-slate-100 text-slate-700 border border-slate-300') : ''}`}>
                        {item.estadoFisico || '—'}
                      </span>
                    </td>

                    {/* CANTIDAD DISPONIBLE EN NMEROS */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-baseline justify-end gap-1.5 font-mono">
                        <span className={`text-sm font-black tracking-tight ${
                          item.estado === 'CRITICAL'
                            ? 'text-rose-400 font-extrabold'
                            : item.estado === 'LOW STOCK'
                            ? 'text-amber-400 font-bold'
                            : isDark
                            ? 'text-[#00F2C3]'
                            : 'text-cyan-700'
                        }`}>
                          {(item.cantidadFisica !== undefined ? item.cantidadFisica : item.stockReal).toLocaleString('es-PE', {
                            minimumFractionDigits: item.unidad === 'GR' ? 1 : 3,
                            maximumFractionDigits: 3,
                          })}
                        </span>
                        <span className={`text-[10px] font-bold uppercase font-sans ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          {item.unidad}
                        </span>
                      </div>
                    </td>

                    {/* NIVEL STOCK (Barra Visual + Porcentaje) */}
                    <td className="py-3.5 px-4 w-44">
                      <div className="flex items-center gap-2.5">
                        <div className={`h-2 flex-1 rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              item.estado === 'OK'
                                ? 'bg-[#00F2C3]'
                                : item.estado === 'LOW STOCK'
                                ? 'bg-amber-500'
                                : 'bg-rose-500'
                            }`}
                            style={{ width: `${item.stockPercentage}%` }}
                          />
                        </div>
                        <span className="font-mono text-[11px] font-bold text-slate-400 w-10 text-right">
                          {item.stockPercentage}%
                        </span>
                      </div>
                    </td>

                    {/* PROVEEDOR ACTUAL */}
                    <td className={`py-3.5 px-4 font-sans text-xs font-medium uppercase ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {item.proveedor || item.ubicacion || 'ALMACN PRINCIPAL'}
                    </td>
                    <td className="py-3.5 px-4">
                      {item.estado === 'OK' && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-500 border border-emerald-500/20">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          OK
                        </span>
                      )}
                      {item.estado === 'LOW STOCK' && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-500 border border-amber-500/20">
                          <span>?</span> LOW STOCK
                        </span>
                      )}
                      {item.estado === 'CRITICAL' && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-2.5 py-0.5 text-[10px] font-bold text-rose-500 border border-rose-500/20">
                          <AlertTriangle className="h-3 w-3" /> CRITICAL
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleAbrirModalReabastecer(item)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold font-sans transition-all border ${
                          item.estado === 'CRITICAL'
                            ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 hover:bg-rose-500/30'
                            : isDark
                            ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                            : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                        }`}
                      >
                        ? Reaprovisionar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Control de Paginacin de 50 en 50 */}
        <div className={`p-4 border-t flex flex-wrap items-center justify-between gap-3 text-xs font-mono ${isDark ? 'border-[#1A2232] bg-[#0D121B]' : 'border-slate-200 bg-slate-50'}`}>
          <div className="text-slate-400 font-sans">
            Mostrando materiales <strong className={isDark ? 'text-white' : 'text-slate-900'}>{filteredMaterials.length === 0 ? 0 : startIndex + 1}</strong> al{' '}
            <strong className={isDark ? 'text-white' : 'text-slate-900'}>
              {Math.min(startIndex + ITEMS_PER_PAGE, filteredMaterials.length)}
            </strong>{' '}
            de <strong className="text-[#00F2C3]">{filteredMaterials.length}</strong> materiales en total
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1.5 rounded-lg border font-bold font-sans transition-all flex items-center gap-1.5 ${
                currentPage === 1
                  ? 'opacity-30 cursor-not-allowed border-slate-700 text-slate-500'
                  : isDark
                  ? 'bg-[#151D2A] border-[#1A2232] text-slate-300 hover:text-white hover:border-[#00F2C3]'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>

            <span className="px-3.5 py-1.5 rounded-lg border border-slate-700 font-bold bg-[#151D2A] text-[#00F2C3]">
              Pgina {currentPage} de {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1.5 rounded-lg border font-bold font-sans transition-all flex items-center gap-1.5 ${
                currentPage === totalPages
                  ? 'opacity-30 cursor-not-allowed border-slate-700 text-slate-500'
                  : isDark
                  ? 'bg-[#151D2A] border-[#1A2232] text-slate-300 hover:text-white hover:border-[#00F2C3]'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span>Siguiente</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Sub-Almacén de Restantes / Sobrantes Section */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold tracking-widest text-slate-400 uppercase">
            SUB-ALMACN DE RESTANTES / SOBRANTES DE PRODUCCIN
          </h3>
          <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-0.5 text-[10px] font-bold text-cyan-500">
            3 REUTILIZABLES
          </span>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {subAlmacenData.map((item) => (
            <div
              key={item.id}
              className={`rounded-xl p-4 border flex flex-col justify-between space-y-4 ${
                item.reutilizable
                  ? cardBg
                  : isDark
                  ? 'bg-[#0B0F17] border-[#1A2232]/50 opacity-70'
                  : 'bg-slate-100 border-slate-200 opacity-70'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span
                    className={`font-mono text-xs font-bold ${
                      item.reutilizable ? 'text-cyan-500' : 'text-slate-400'
                    }`}
                  >
                    {item.codigo}
                  </span>
                  <span className={`font-mono text-sm font-black ${textValue}`}>
                    {item.peso} <span className="text-xs font-sans text-slate-400">{item.unidad}</span>
                  </span>
                </div>
                <h4 className={`text-xs font-bold font-sans truncate ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                  {item.nombre}
                </h4>
                <p className="text-[10px] text-slate-400 font-sans">
                  Lote origen: {item.loteOrigen} • {item.fecha}
                </p>
              </div>

              <div>
                {item.reutilizable ? (
                  <button
                    onClick={async () => {
                      const { ok } = await apiFetch(`/sub-almacen/${item.id}/reusar`, { method: 'PATCH' });
                      if (ok) cargarSubAlmacen();
                    }}
                    className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#00F2C3] py-2 text-xs font-bold text-[#090C10] hover:bg-[#00d8ad] transition-all shadow-md"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>Reaplicar a Lote</span>
                  </button>
                ) : (
                  <button
                    disabled
                    className={`w-full rounded-lg py-2 text-xs font-bold text-slate-400 border cursor-not-allowed text-center ${
                      isDark ? 'bg-[#151D2A] border-[#1A2232]' : 'bg-slate-200 border-slate-300'
                    }`}
                  >
                    No reutilizable
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de Reaprovisionamiento MLTIPLE EN MASA con Dropdown Dinmico en Tiempo Real (Estilo Imagen 3) */}
      {modalReaprovisionamiento && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200 font-sans">
          <div className={`w-full max-w-2xl rounded-2xl border p-6 shadow-2xl space-y-5 ${
            isDark ? 'bg-[#0F141C] border-[#1A2232] text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between border-b pb-3 border-slate-700/50">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-500 animate-pulse" />
                <h3 className="text-base font-bold">Solicitud de Reaprovisionamiento en Masa</h3>
              </div>
              <button
                onClick={() => setModalReaprovisionamiento(false)}
                className="text-slate-400 hover:text-slate-200 font-mono text-lg"
              >
                ?
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-400 uppercase tracking-wider">LISTA DE PRODUCTOS Y CANTIDADES SOLICITADAS</span>
                <button
                  onClick={handleAgregarInsumoAModal}
                  className="px-3 py-1 rounded-lg text-xs font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30 transition-all flex items-center gap-1"
                >
                  ? Agregar Producto
                </button>
              </div>

              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {listaReaprovisionamiento.map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border flex flex-wrap items-center justify-between gap-3 ${
                      isDark ? 'bg-[#151D2A] border-slate-800' : 'bg-slate-50 border-slate-300'
                    }`}
                  >
                    {/* Dropdown Dinmico SELECT de Productos (Estilo Imagen 3) */}
                    <div className="flex-1 min-w-[200px]">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Insumo Requerido</label>
                      <select
                        value={item.sku}
                        onChange={(e) => handleCambiarInsumoEnModal(idx, e.target.value)}
                        className={`w-full p-2 rounded-lg border font-mono font-bold text-xs ${
                          isDark ? 'bg-[#0F141C] border-slate-700 text-rose-400' : 'bg-white border-slate-300 text-rose-800'
                        }`}
                      >
                        {(() => {
                          const itemsRequeridos = materialsData.filter(m => m.estado !== 'OK' || m.stockReal <= m.stockMinimo);
                          const listaAmostrar = itemsRequeridos.length > 0 ? itemsRequeridos : materialsData;
                          return listaAmostrar.map((m) => (
                            <option key={m.sku} value={m.sku}>
                              {m.estado === 'CRITICAL' ? '🚨 CRÍTICO:' : m.estado === 'LOW STOCK' ? '⚠️ BAJO:' : '✅ OK:'} {m.nombre} ({m.sku})
                            </option>
                          ));
                        })()}
                      </select>
                    </div>

                    {/* Stock Actual en Planta */}
                    <div className="w-28">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Stock Actual</label>
                      <div className="p-2 rounded-lg border font-mono font-bold text-xs text-rose-400 border-slate-800 bg-[#0F141C]">
                        {item.stockReal} {item.unidad}
                      </div>
                    </div>

                    {/* Cantidad a Solicitar */}
                    <div className="w-32">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">A Solicitar</label>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={item.cantidadSolicitada}
                          onChange={(e) => handleCambiarCantidadEnModal(idx, parseFloat(e.target.value) || 0)}
                          className={`w-full p-2 rounded-lg border font-mono font-bold text-xs ${
                            isDark ? 'bg-[#0F141C] border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                          }`}
                        />
                        <span className="font-mono text-[10px] text-slate-400">{item.unidad}</span>
                      </div>
                    </div>

                    {/* Botón Eliminar */}
                    {listaReaprovisionamiento.length > 1 && (
                      <button
                        onClick={() => handleEliminarInsumoDeModal(idx)}
                        className="p-2 text-rose-400 hover:text-rose-300 font-mono text-sm self-end"
                        title="Eliminar insumo de la orden"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div>
                <label className="block font-bold text-slate-400 uppercase tracking-wider mb-1">Ubicación / Destino de Entrega</label>
                <input
                  type="text"
                  defaultValue="Almacén Principal Quimicorp Perú S.A.C. - Stock de Seguridad"
                  className={`w-full p-2.5 rounded-lg border text-xs ${
                    isDark ? 'bg-[#151D2A] border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-300 text-slate-800'
                  }`}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-700/50">
              <button
                onClick={() => setModalReaprovisionamiento(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-slate-200 border border-slate-800"
              >
                Cancelar
              </button>
              <button
                onClick={handleEnviarSolicitudCompraEnMasa}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-rose-500 text-white hover:bg-rose-600 transition-all shadow-lg flex items-center gap-1.5"
              >
                <span>🛒 Emitir Solicitud a Compras ({listaReaprovisionamiento.length})</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
