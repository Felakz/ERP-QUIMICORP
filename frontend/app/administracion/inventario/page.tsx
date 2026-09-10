'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  RefreshCw,
  AlertTriangle,
  Package,
  Warehouse,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';
import { apiFetch } from '@/lib/apiClient';
import { useSocket } from '@/lib/socketContext';
import { InventoryCrud } from '@/components/inventario/InventoryCrud';
import { TableSkeleton } from '@/components/ui/TableSkeleton';
import { ActionableEmptyState } from '@/components/ui/ActionableEmptyState';

interface MaterialItem {
  id: string;
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
  esSoloFormula?: boolean;
  estado: 'OK' | 'LOW STOCK' | 'CRITICAL';
}

interface InventarioCacheData {
  materialsData: MaterialItem[];
  disponibilidadTotal: string;
  stockCriticoCount: number;
  stockBajoCount: number;
  timestamp: number;
}
let inventarioCache: InventarioCacheData | null = null;
const INVENTARIO_CACHE_TTL = 30_000;

export default function InventarioAdministracionPage() {
  const { theme } = useTheme();
  const { socket } = useSocket();
  const isDark = theme === 'dark';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedEstadoFilter, setSelectedEstadoFilter] = useState<'TODOS' | 'OK' | 'LOW_STOCK' | 'CRITICAL'>('TODOS');
  const [materialsData, setMaterialsData] = useState<MaterialItem[]>(() => inventarioCache?.materialsData || []);
  const [loading, setLoading] = useState(() => !inventarioCache?.materialsData?.length);
  const [disponibilidadTotal, setDisponibilidadTotal] = useState(() => inventarioCache?.disponibilidadTotal || '0');
  const [stockCriticoCount, setStockCriticoCount] = useState(() => inventarioCache?.stockCriticoCount ?? 0);
  const [stockBajoCount, setStockBajoCount] = useState(() => inventarioCache?.stockBajoCount ?? 0);
  const [currentPage, setCurrentPage] = useState(1);
  const [errorMsg, setErrorMsg] = useState('');
  const [tab, setTab] = useState<'stock' | 'crud'>('stock');
  const [soloFisicos, setSoloFisicos] = useState(true);
  const ITEMS_PER_PAGE = 50;

  const cargarInventarioReal = async (forceLoading = false) => {
    try {
      if (forceLoading || !inventarioCache) {
        setLoading(true);
      }
      setErrorMsg('');
      const { data, ok } = await apiFetch<any>('/inventario/dashboard/lista-completa');
      if (ok && data) {
        const parsedItems = (data.insumos || []).map((m: any) => ({
          ...m,
          cantidadFisica: m.cantidadFisica ?? (m.unidad === 'GR' ? m.stockReal : m.stockReal / 1000),
          stockReal: m.stockReal ?? m.stockActual ?? 0,
          stockMinimo: m.stockMinimo ?? 10,
        }));
        const dispTotal = data.disponibilidadTotalKg ? Number(data.disponibilidadTotalKg).toLocaleString('es-PE') : '0';
        const critCount = data.stockCriticoCount ?? 0;
        const bajoCount = data.stockBajoCount ?? 0;

        setMaterialsData(parsedItems);
        setDisponibilidadTotal(dispTotal);
        setStockCriticoCount(critCount);
        setStockBajoCount(bajoCount);

        inventarioCache = {
          materialsData: parsedItems,
          disponibilidadTotal: dispTotal,
          stockCriticoCount: critCount,
          stockBajoCount: bajoCount,
          timestamp: Date.now(),
        };
      } else {
        if (!inventarioCache) {
          setMaterialsData([]);
          setErrorMsg('No se pudieron cargar los datos del inventario.');
        }
      }
    } catch (e) {
      console.error('Error cargando inventario:', e);
      if (!inventarioCache) {
        setMaterialsData([]);
        setErrorMsg('Error de conexión al cargar el inventario.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarInventarioReal();
  }, []);

  useEffect(() => {
    if (!socket) return;
    const onRefresh = () => { cargarInventarioReal(); };
    socket.on('inventario:actualizado', onRefresh);
    socket.on('inventario:alerta_stock_critico', onRefresh);
    socket.on('lote:estado_actualizado', onRefresh);
    return () => {
      socket.off('inventario:actualizado', onRefresh);
      socket.off('inventario:alerta_stock_critico', onRefresh);
      socket.off('lote:estado_actualizado', onRefresh);
    };
  }, [socket]);

  const baseMaterials = soloFisicos ? materialsData.filter((m) => !m.esSoloFormula) : materialsData;

  const categories = ['Todos', ...Array.from(new Set(baseMaterials.map((m) => m.familia)))];

  const filteredMaterials = baseMaterials.filter((item) => {
    const matchesSearch =
      item.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'Todos' ||
      item.familia.toLowerCase() === selectedCategory.toLowerCase();

    let matchesEstado = true;
    if (selectedEstadoFilter === 'OK') matchesEstado = item.estado === 'OK';
    else if (selectedEstadoFilter === 'LOW_STOCK') matchesEstado = item.estado === 'LOW STOCK';
    else if (selectedEstadoFilter === 'CRITICAL') matchesEstado = item.estado === 'CRITICAL';
    return matchesSearch && matchesCategory && matchesEstado;
  });

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

  const renderEstadoFisicoBadge = (estadoFisico?: string | null, tipo?: string | null, nombre?: string | null) => {
    const raw = (estadoFisico || '').toUpperCase().trim();
    const tipClean = (tipo || '').toUpperCase().trim();
    const nomClean = (nombre || '').toUpperCase().trim();

    // 1. Envases específicos (Baldes, Galoneras, Bidones, etc.)
    if (raw.includes('BALDE') || nomClean.includes('BALDE')) {
      return (
        <span className="rounded-lg px-2 py-0.5 text-[10px] font-black border bg-amber-500/15 text-amber-400 border-amber-500/30 tracking-wider inline-flex items-center gap-1.5 shadow-sm">
          <span>🪣</span> BALDE
        </span>
      );
    }
    if (raw.includes('GALON') || raw.includes('BIDON') || nomClean.includes('GALON') || nomClean.includes('BIDON')) {
      return (
        <span className="rounded-lg px-2 py-0.5 text-[10px] font-black border bg-teal-500/15 text-teal-300 border-teal-500/30 tracking-wider inline-flex items-center gap-1.5 shadow-sm">
          <span>🛢️</span> GALONERA
        </span>
      );
    }
    if (tipClean.includes('ENVASE') || raw.includes('ENVASE') || raw.includes('EMBALA') || nomClean.includes('TAPA') || nomClean.includes('BOTELLA') || nomClean.includes('FRASCO')) {
      return (
        <span className="rounded-lg px-2 py-0.5 text-[10px] font-black border bg-orange-500/15 text-orange-400 border-orange-500/30 tracking-wider inline-flex items-center gap-1.5 shadow-sm">
          <span>📦</span> ENVASE
        </span>
      );
    }

    if (!estadoFisico) {
      return <span className="text-[10px] text-slate-500 font-bold">—</span>;
    }
    const clean = raw;
    if (clean.includes('LIQ')) {
      return (
        <span className="rounded-lg px-2 py-0.5 text-[10px] font-black border bg-cyan-500/10 text-cyan-400 border-cyan-500/30 tracking-wider inline-flex items-center gap-1">
          <span>💧</span> LÍQUIDO
        </span>
      );
    }
    if (clean.includes('POLV')) {
      return (
        <span className="rounded-lg px-2 py-0.5 text-[10px] font-black border bg-purple-500/10 text-purple-400 border-purple-500/30 tracking-wider inline-flex items-center gap-1">
          <span>🌫️</span> POLVO
        </span>
      );
    }
    if (clean.includes('GRAN') || clean.includes('CRIST') || clean.includes('ESCAM') || clean.includes('PERL') || clean.includes('HOJ') || clean.includes('BLOQ') || clean.includes('SOLI')) {
      return (
        <span className="rounded-lg px-2 py-0.5 text-[10px] font-black border bg-amber-500/10 text-amber-400 border-amber-500/30 tracking-wider inline-flex items-center gap-1">
          <span>🧱</span> SÓLIDO
        </span>
      );
    }
    if (clean.includes('FRAG') || clean.includes('ESEN') || clean.includes('AROM')) {
      return (
        <span className="rounded-lg px-2 py-0.5 text-[10px] font-black border bg-emerald-500/10 text-emerald-400 border-emerald-500/30 tracking-wider inline-flex items-center gap-1">
          <span>🧪</span> FRAGANCIA
        </span>
      );
    }
    if (clean.includes('PAST') || clean.includes('GEL') || clean.includes('EMUL') || clean.includes('CREM') || clean.includes('GRAS')) {
      return (
        <span className="rounded-lg px-2 py-0.5 text-[10px] font-black border bg-blue-500/10 text-blue-400 border-blue-500/30 tracking-wider inline-flex items-center gap-1">
          <span>🧴</span> PASTA/GEL
        </span>
      );
    }
    return (
      <span className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase border ${
        isDark ? 'bg-[#1A2434] text-slate-300 border-[#233146]' : 'bg-slate-100 text-slate-700 border-slate-300'
      }`}>
        {estadoFisico}
      </span>
    );
  };

  return (
    <div className="space-y-5 font-sans">
      {/* Header */}
      <div className={`p-6 rounded-2xl border flex flex-wrap items-center justify-between gap-4 relative overflow-hidden ${cardBg}`}>
        {/* Ambient Glow */}
        {isDark && (
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        )}

        <div className="flex items-center gap-3.5 relative z-10">
          <div className="p-3 rounded-2xl bg-cyan-500/10 text-[#00F2C3] border border-cyan-500/30 shadow-[0_0_12px_rgba(0,242,195,0.2)]">
            <Warehouse className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className={`text-xl font-black tracking-tight ${textValue}`}>
                Inventario de Insumos & Materia Prima
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black font-mono bg-cyan-500/10 text-[#00F2C3] border border-cyan-500/30 uppercase flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 led-pulse" />
                POSTGRES MAESTRO
              </span>
            </div>
            <p className={`text-xs mt-0.5 ${textTitle}`}>
              Catálogo sincronizado en tiempo real con Almacén & Producción — fuente única de datos.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 relative z-10">
          <button
            onClick={cargarInventarioReal}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all card-hover-lift"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Actualizar</span>
          </button>
        </div>
      </div>

      {/* Micro-pestañas: Stock & Vista | Gestión de Insumos */}
      <div className={`rounded-2xl p-1.5 border flex items-center gap-1.5 text-xs font-black ${cardBg}`}>
        <button
          onClick={() => setTab('stock')}
          className={`px-4 py-2 rounded-xl transition-all ${
            tab === 'stock'
              ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-[0_0_12px_rgba(0,242,195,0.3)]'
              : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Stock & Catálogo Oficial
        </button>
        <button
          onClick={() => setTab('crud')}
          className={`px-4 py-2 rounded-xl transition-all ${
            tab === 'crud'
              ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-[0_0_12px_rgba(0,242,195,0.3)]'
              : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Gestión & Creación de Insumos
        </button>
      </div>

      {tab === 'stock' ? (
        <>
      {/* Top 4 KPI Metrics Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div
          onClick={() => setSelectedEstadoFilter('TODOS')}
          className={`rounded-2xl p-5 border cursor-pointer transition-all card-hover-lift ${isDark ? 'bg-[#151D2A] border-cyan-500/30 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(0,242,195,0.15)]' : 'bg-cyan-50/70 border-cyan-200'}`}
        >
          <span className={`text-[10px] font-black tracking-widest uppercase ${textTitle}`}>TOTAL MATERIALES</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono text-[#00F2C3]">{materialsData.length}</span>
            <span className="text-xs text-slate-400 font-sans font-semibold">SKUs Activos</span>
          </div>
        </div>

        <div className={`rounded-2xl p-5 border transition-all card-hover-lift ${isDark ? 'bg-[#151D2A] border-emerald-500/30 hover:border-emerald-400 hover:shadow-[0_0_15px_rgba(16,185,129,0.15)]' : 'bg-emerald-50/70 border-emerald-200'}`}>
          <span className={`text-[10px] font-black tracking-widest uppercase ${textTitle}`}>DISPONIBILIDAD TOTAL</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-2xl font-black font-mono ${isDark ? 'text-emerald-400' : 'text-slate-900'}`}>{disponibilidadTotal}</span>
            <span className="text-xs text-slate-400 font-sans font-semibold">KG / LT Físicos</span>
          </div>
        </div>

        <div
          onClick={() => setSelectedEstadoFilter('CRITICAL')}
          className={`rounded-2xl p-5 border cursor-pointer transition-all card-hover-lift ${isDark ? 'bg-[#151D2A] border-rose-500/30 hover:border-rose-400 hover:shadow-[0_0_15px_rgba(244,63,94,0.15)]' : 'bg-rose-50/70 border-rose-200'}`}
        >
          <span className={`text-[10px] font-black tracking-widest uppercase ${textTitle}`}>STOCK CRÍTICO</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono text-rose-400">{stockCriticoCount}</span>
            <span className="text-xs text-slate-400 font-sans font-semibold">materiales</span>
          </div>
        </div>

        <div
          onClick={() => setSelectedEstadoFilter('LOW_STOCK')}
          className={`rounded-2xl p-5 border cursor-pointer transition-all card-hover-lift ${isDark ? 'bg-[#151D2A] border-amber-500/30 hover:border-amber-400 hover:shadow-[0_0_15px_rgba(245,158,11,0.15)]' : 'bg-amber-50/70 border-amber-200'}`}
        >
          <span className={`text-[10px] font-black tracking-widest uppercase ${textTitle}`}>STOCK BAJO</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono text-amber-400">{stockBajoCount}</span>
            <span className="text-xs text-slate-400 font-sans font-semibold">materiales</span>
          </div>
        </div>
      </div>

      {/* Main Control & Filter Bar (idéntico a Producción) */}
      <div className={`rounded-xl p-4 border space-y-4 ${cardBg}`}>
        <div className="flex flex-wrap items-center justify-between gap-3 font-sans">
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

          <div className="flex items-center gap-2">
            <span className={`text-xs font-black ${textTitle}`}>CATEGORÍA:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={`px-3 py-2 rounded-xl border text-xs font-black transition-all ${
                isDark
                  ? 'bg-[#151D2A] border-[#1A2232] text-slate-200 focus:border-cyan-500/50'
                  : 'bg-slate-100 border-slate-300 text-slate-800 shadow-sm'
              }`}
            >
              {categories.map((cat) => {
                const count =
                  cat === 'Todos'
                    ? baseMaterials.length
                    : baseMaterials.filter((m) => m.familia.toLowerCase() === cat.toLowerCase()).length;
                return (
                  <option key={cat} value={cat}>
                    {cat === 'Todos' ? `Todas las Categorías (${count})` : `${cat} (${count})`}
                  </option>
                );
              })}
            </select>
          </div>

          <div className={`flex rounded-2xl p-1 border text-xs font-black font-sans ${
            isDark ? 'bg-[#151D2A] border-[#1A2232]' : 'bg-slate-100 border-slate-300'
          }`}>
            <button
              onClick={() => setSelectedEstadoFilter('TODOS')}
              className={`rounded-xl px-3.5 py-1.5 font-black transition-all ${
                selectedEstadoFilter === 'TODOS'
                  ? 'bg-[#00F2C3] text-slate-950 shadow-[0_0_10px_rgba(0,242,195,0.3)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setSelectedEstadoFilter('OK')}
              className={`rounded-xl px-3.5 py-1.5 font-black transition-all ${
                selectedEstadoFilter === 'OK'
                  ? 'bg-emerald-400 text-slate-950 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              ✅ Stock OK
            </button>
            <button
              onClick={() => setSelectedEstadoFilter('LOW_STOCK')}
              className={`rounded-xl px-3.5 py-1.5 font-black transition-all ${
                selectedEstadoFilter === 'LOW_STOCK'
                  ? 'bg-amber-400 text-slate-950 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              ⚠️ Stock Bajo
            </button>
            <button
              onClick={() => setSelectedEstadoFilter('CRITICAL')}
              className={`rounded-xl px-3.5 py-1.5 font-black transition-all ${
                selectedEstadoFilter === 'CRITICAL'
                  ? 'bg-rose-500 text-white shadow-[0_0_10px_rgba(244,63,94,0.3)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              🚨 Stock Crítico
            </button>
          </div>

          <button
            onClick={() => setSoloFisicos((v) => !v)}
            className={`px-3 py-2 rounded-xl border text-xs font-black font-sans flex items-center gap-1.5 transition-all ${
              soloFisicos
                ? isDark
                  ? 'bg-[#00F2C3]/15 border-[#00F2C3]/40 text-[#00F2C3]'
                  : 'bg-emerald-50 border-emerald-300 text-emerald-700'
                : isDark
                ? 'border-[#1A2232] text-slate-400 hover:text-white'
                : 'border-slate-300 text-slate-600 hover:bg-slate-50'
            }`}
            title="Mostrar/ocultar insumos de solo fórmula (ESP)"
          >
            <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center text-[9px] ${soloFisicos ? 'bg-[#00F2C3] border-[#00F2C3] text-[#06241B]' : 'border-current'}`}>{soloFisicos ? '✓' : ''}</span>
            Ocultar ESP
          </button>
        </div>

        {/* Materials Table — mismas columnas que Producción */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className={`border-b text-[10px] font-black tracking-widest uppercase ${isDark ? 'border-[#1A2232] text-slate-400 bg-[#151D2A]/50' : 'border-slate-200 text-slate-500 bg-slate-50'}`}>
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">NOMBRE QUÍMICO</th>
                <th className="py-3 px-4">CATEGORÍA / FAMILIA</th>
                <th className="py-3 px-4">TIPO</th>
                <th className="py-3 px-4">ESTADO FÍSICO</th>
                <th className="py-3 px-4 text-right">CANTIDAD DISPONIBLE</th>
                <th className="py-3 px-4">NIVEL STOCK</th>
                <th className="py-3 px-4">PROVEEDOR ACTUAL</th>
                <th className="py-3 px-4">ESTADO</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-[#1A2232]/60' : 'divide-slate-200'}`}>
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-4 px-4"><div className="h-4 w-16 bg-slate-800/70 rounded" /></td>
                    <td className="py-4 px-4"><div className="h-4 w-44 bg-slate-800/80 rounded" /></td>
                    <td className="py-4 px-4"><div className="h-4 w-20 bg-slate-800/60 rounded" /></td>
                    <td className="py-4 px-4"><div className="h-4 w-16 bg-slate-800/50 rounded" /></td>
                    <td className="py-4 px-4"><div className="h-4 w-20 bg-slate-800/60 rounded" /></td>
                    <td className="py-4 px-4 text-right"><div className="h-4 w-20 bg-slate-800/70 rounded ml-auto" /></td>
                    <td className="py-4 px-4"><div className="h-2 w-full bg-slate-800/60 rounded" /></td>
                    <td className="py-4 px-4"><div className="h-4 w-24 bg-slate-800/50 rounded" /></td>
                    <td className="py-4 px-4"><div className="h-5 w-16 bg-slate-800/60 rounded-full" /></td>
                    <td className="py-4 px-4 text-right"><div className="h-6 w-20 bg-slate-800/40 rounded-lg ml-auto" /></td>
                  </tr>
                ))
              ) : errorMsg ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center font-sans">
                    <div className="max-w-md mx-auto space-y-3">
                      <div className="inline-flex p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
                        <AlertTriangle className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-bold text-rose-400">{errorMsg}</p>
                      <button
                        onClick={cargarInventarioReal}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all"
                      >
                        Reintentar Conexión
                      </button>
                    </div>
                  </td>
                </tr>
              ) : paginatedMaterials.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 font-sans">
                    <ActionableEmptyState
                      icon={Package}
                      title="No se encontraron insumos"
                      description={
                        searchQuery || selectedCategory !== 'Todos' || selectedEstadoFilter !== 'TODOS'
                          ? `No hay registros que coincidan con los filtros aplicados.`
                          : 'No se encontraron insumos en el catálogo maestro.'
                      }
                      actionLabel="Restablecer Filtros"
                      onAction={() => {
                        setSearchQuery('');
                        setSelectedCategory('Todos');
                        setSelectedEstadoFilter('TODOS');
                      }}
                      secondaryActionLabel="Actualizar"
                      onSecondaryAction={cargarInventarioReal}
                    />
                  </td>
                </tr>
              ) : (
                paginatedMaterials.map((item) => (
                  <tr key={item.sku} className={`transition-colors ${isDark ? 'hover:bg-[#151D2A]/50' : 'hover:bg-slate-50'}`}>
                    <td className="py-3.5 px-4 font-mono font-bold text-cyan-500">{item.sku}</td>
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
                      {renderEstadoFisicoBadge(item.estadoFisico, item.tipo, item.nombre)}
                    </td>
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
                    <td className="py-3.5 px-4 w-44">
                      <div className="flex items-center gap-2.5">
                        <div className={`h-2 flex-1 rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              item.estado === 'OK' ? 'bg-[#00F2C3]' : item.estado === 'LOW STOCK' ? 'bg-amber-500' : 'bg-rose-500'
                            }`}
                            style={{ width: `${item.stockPercentage}%` }}
                          />
                        </div>
                        <span className="font-mono text-[11px] font-bold text-slate-400 w-10 text-right">
                          {item.stockPercentage}%
                        </span>
                      </div>
                    </td>
                    <td className={`py-3.5 px-4 font-sans text-xs font-medium uppercase ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {item.proveedor || item.ubicacion || 'ALMACN PRINCIPAL'}
                    </td>
                    <td className="py-3.5 px-4">
                      {item.estado === 'OK' && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-500 border border-emerald-500/20">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> OK
                        </span>
                      )}
                      {item.estado === 'LOW STOCK' && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-500 border border-amber-500/20">
                          <AlertTriangle className="h-3 w-3" /> LOW STOCK
                        </span>
                      )}
                      {item.estado === 'CRITICAL' && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-2.5 py-0.5 text-[10px] font-bold text-rose-500 border border-rose-500/20">
                          <AlertTriangle className="h-3 w-3" /> CRITICAL
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación de 50 en 50 (idéntico a Producción) */}
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
        </>
      ) : (
        <InventoryCrud />
      )}
    </div>
  );
}
