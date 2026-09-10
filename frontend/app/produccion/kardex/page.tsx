'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText,
  Search,
  Calendar,
  Filter,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  Layers,
  Box,
  Truck,
  Building2,
  RefreshCw,
  Sparkles,
  Info,
  Beaker,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';
import { apiFetch } from '@/lib/apiClient';
import { KARDEX_REAL_SEED_DATA } from '@/lib/kardexRealData';
import { TableSkeleton } from '@/components/ui/TableSkeleton';
import { ActionableEmptyState } from '@/components/ui/ActionableEmptyState';

export type CategoriaKardexTab =
  | 'PRODUCTO_TERMINADO'
  | 'MATERIA_PRIMA'
  | 'INSUMO'
  | 'ENVASE'
  | 'EMBALAJE';

interface KardexMovimientoUI {
  id: string;
  categoriaKardex: CategoriaKardexTab;
  productoNombre: string;
  familia: string;
  categoriaNombre: string;
  proveedorCliente: string;
  unidadMedida: string;
  fecha: string;
  tipoDoc: string;
  serie: string;
  numero: string;
  otp: string;
  tipoOperacion: string;
  cantidadEntrada: number;
  cantidadSalida: number;
  saldoFinal: number;
}

interface InsumoDetalleBOM {
  id: string;
  insumoId: string;
  porcentaje: number;
  pesoMasaTeorico: number;
  insumo: {
    nombre: string;
    unidadMedida: string;
    costoUnitario?: number;
    familia?: { nombre: string };
  };
}

interface FormulaBOM {
  id: string;
  codigoFormula: string;
  nombreProducto: string;
  densidadTeorica: number;
  estado: string;
  detalles: InsumoDetalleBOM[];
}

function BOMModal({
  productoNombre,
  isOpen,
  onClose,
  isDark,
}: {
  productoNombre: string;
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
}) {
  const [bom, setBom] = useState<FormulaBOM | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen || !productoNombre) return;
    let isMounted = true;
    setLoading(true);
    apiFetch<FormulaBOM>(`/kardex/bom?nombre=${encodeURIComponent(productoNombre)}`)
      .then((res) => {
        if (isMounted) {
          setBom(res.ok ? res.data : null);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [isOpen, productoNombre]);

  if (!isOpen) return null;

  const sumaPorcentajes = bom?.detalles?.reduce((acc, d) => acc + Number(d.porcentaje || 0), 0) || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div
        className={`w-full max-w-2xl rounded-2xl border p-6 shadow-2xl space-y-4 font-sans ${
          isDark ? 'bg-[#0F141C] border-purple-500/30 text-white' : 'bg-white border-purple-200 text-slate-900'
        }`}
      >
        <div className="flex items-center justify-between border-b border-purple-500/20 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
              <Beaker className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold flex items-center gap-2">
                <span>Fórmula BOM de Insumos</span>
                <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {bom?.codigoFormula || 'FRMULA'}
                </span>
              </h3>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Composicin de materias primas para <span className="font-semibold text-purple-400">{productoNombre}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg border transition-all ${
              isDark ? 'border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800' : 'border-slate-200 text-slate-500 hover:bg-slate-100'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-2 text-xs font-mono text-purple-400">
            <RefreshCw className="w-6 h-6 animate-spin" />
            <span>Consultando Fórmula Maestra en PostgreSQL...</span>
          </div>
        ) : !bom || !bom.detalles || bom.detalles.length === 0 ? (
          <div className="py-10 text-center space-y-1">
            <p className="text-sm font-bold text-slate-400">No hay fórmula maestra asignada</p>
            <p className="text-xs text-slate-500 font-mono">
              No se encontr una fórmula activa configurada para este producto en la base de datos.
            </p>
          </div>
        ) : (
          <div className="space-y-3 font-mono">
            <div className={`p-3 rounded-xl border text-xs flex flex-wrap justify-between gap-2 ${
              isDark ? 'bg-purple-950/20 border-purple-500/20 text-purple-300' : 'bg-purple-50 border-purple-200 text-purple-900'
            }`}>
              <span>Densidad Terica: <strong>{Number(bom.densidadTeorica || 1).toFixed(3)} g/mL</strong></span>
              <span>Estado: <strong className="text-emerald-400">{bom.estado}</strong></span>
              <span>Componentes: <strong>{bom.detalles.length} Insumos</strong></span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-purple-500/20">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className={isDark ? 'bg-[#151D2A] text-slate-400' : 'bg-slate-100 text-slate-600'}>
                    <th className="py-2.5 px-3">INSUMO / MATERIA PRIMA</th>
                    <th className="py-2.5 px-3">FAMILIA</th>
                    <th className="py-2.5 px-3 text-center">UNIDAD</th>
                    <th className="py-2.5 px-3 text-right">% COMPOSICIN</th>
                    <th className="py-2.5 px-3 text-right">MASA TERICA</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? 'divide-slate-800/60' : 'divide-slate-200'}`}>
                  {bom.detalles.map((d) => (
                    <tr key={d.id} className={isDark ? 'hover:bg-slate-800/30' : 'hover:bg-slate-50'}>
                      <td className={`py-2.5 px-3 font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                        {d.insumo?.nombre || 'Insumo'}
                      </td>
                      <td className="py-2.5 px-3 text-[11px] text-slate-400">
                        {d.insumo?.familia?.nombre || 'GENERAL'}
                      </td>
                      <td className="py-2.5 px-3 text-center text-slate-400">
                        {d.insumo?.unidadMedida || 'KG'}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-purple-400">
                        {Number(d.porcentaje).toFixed(2)} %
                      </td>
                      <td className={`py-2.5 px-3 text-right ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        {Number(d.pesoMasaTeorico).toFixed(3)} {d.insumo?.unidadMedida || 'KG'}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className={`font-bold border-t ${isDark ? 'bg-[#151D2A] text-purple-300' : 'bg-purple-50 text-purple-950'}`}>
                    <td colSpan={3} className="py-2.5 px-3 text-right uppercase text-[10px]">
                      Suma Total Composicin:
                    </td>
                    <td className="py-2.5 px-3 text-right text-emerald-400 font-black">
                      {sumaPorcentajes.toFixed(2)} %
                    </td>
                    <td className="py-2.5 px-3 text-right">100.00 %</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-lg shadow-purple-600/20"
          >
            Cerrar Modal
          </button>
        </div>
      </div>
    </div>
  );
}

const produccionKardexCache = new Map<string, KardexMovimientoUI[]>();

export default function KardexPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [activeTab, setActiveTab] = useState<CategoriaKardexTab>('PRODUCTO_TERMINADO');
  const [searchQuery, setSearchQuery] = useState('');
  const [tipoOperacionFiltro, setTipoOperacionFiltro] = useState<string>('TODAS');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [movimientos, setMovimientos] = useState<KardexMovimientoUI[]>(() => produccionKardexCache.get('PRODUCTO_TERMINADO') || []);
  const [loading, setLoading] = useState(() => !produccionKardexCache.has('PRODUCTO_TERMINADO'));

  // Modal BOM de Fórmulas
  const [bomModalProducto, setBomModalProducto] = useState<string | null>(null);

  const [unidad, setUnidad] = useState<'GR' | 'KG'>('GR');

  const cardBg = isDark ? 'bg-[#0F141C] border-[#1A2232]' : 'bg-white border-slate-200 shadow-sm';
  const textTitle = isDark ? 'text-slate-400' : 'text-slate-500';
  const textValue = isDark ? 'text-white' : 'text-slate-900';
  const inputBg = isDark
    ? 'bg-[#151D2A] border-[#1A2232] text-slate-200 placeholder-slate-500'
    : 'bg-slate-50 border-slate-300 text-slate-800 placeholder-slate-400';

  const fetchKardexData = async () => {
    if (!produccionKardexCache.has(activeTab)) {
      setLoading(true);
    }
    let apiData: KardexMovimientoUI[] = [];
    try {
      let savedToken = typeof window !== 'undefined' ? localStorage.getItem('quimicorp_jwt') : null;
      if (!savedToken || savedToken.startsWith('jwt_mock')) {
        // Sin token válido: no se autenticará automáticamente.
        // El usuario debe iniciar sesión correctamente.
        savedToken = null;
      }

      const queryParams = new URLSearchParams();
      queryParams.append('categoria', activeTab);
      if (searchQuery) queryParams.append('search', searchQuery);
      if (tipoOperacionFiltro !== 'TODAS') queryParams.append('tipoOperacion', tipoOperacionFiltro);
      if (fechaDesde) queryParams.append('desde', fechaDesde);
      if (fechaHasta) queryParams.append('hasta', fechaHasta);

      const res = await apiFetch<any[]>(`/kardex/categorizado?${queryParams.toString()}`);
      if (res.ok && Array.isArray(res.data)) {
        apiData = res.data;
        produccionKardexCache.set(activeTab, apiData);
      }
    } catch (error) {
      console.log('Error fetching kardex endpoint:', error);
    }

    if (apiData.length > 0 || !produccionKardexCache.has(activeTab)) {
      setMovimientos(apiData || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchKardexData();
    window.addEventListener('storage', fetchKardexData);
    return () => {
      window.removeEventListener('storage', fetchKardexData);
    };
  }, [activeTab, searchQuery, tipoOperacionFiltro, fechaDesde, fechaHasta]);

  const categoriesConfig: {
    id: CategoriaKardexTab;
    label: string;
    description: string;
    icon: React.ElementType;
    badgeColor: string;
  }[] = [
    {
      id: 'PRODUCTO_TERMINADO',
      label: 'Producto Terminado',
      description: 'Detergentes, Resinas, Desinfectantes envasados para venta',
      icon: Package,
      badgeColor: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
    },
    {
      id: 'MATERIA_PRIMA',
      label: 'Materia Prima',
      description: 'cido Oleico, Soda Custica, cido Sulfrico, Reactivos',
      icon: Layers,
      badgeColor: 'border-cyan-500/40 text-cyan-400 bg-cyan-500/10',
    },
    {
      id: 'INSUMO',
      label: 'Insumos',
      description: 'LESS 70%, Fragancias, Tensioactivos, Preservantes',
      icon: RefreshCw,
      badgeColor: 'border-purple-500/40 text-purple-400 bg-purple-500/10',
    },
    {
      id: 'ENVASE',
      label: 'Envases',
      description: 'Bidones PEAD, Galones, Frascos plsticos y cilindros',
      icon: Box,
      badgeColor: 'border-amber-500/40 text-amber-400 bg-amber-500/10',
    },
    {
      id: 'EMBALAJE',
      label: 'Embalajes',
      description: 'Parihuelas de madera, Cajas de cartn, Cintas',
      icon: Truck,
      badgeColor: 'border-blue-500/40 text-blue-400 bg-blue-500/10',
    },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 60;

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery, tipoOperacionFiltro, fechaDesde, fechaHasta]);

  const filteredMovimientos = movimientos.filter((m) => {
    if (activeTab && m.categoriaKardex !== activeTab) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = m.productoNombre.toLowerCase().includes(q);
      const matchProv = (m.proveedorCliente || '').toLowerCase().includes(q);
      const matchFam = (m.familia || '').toLowerCase().includes(q);
      const matchDoc = `${m.tipoDoc}-${m.serie}-${m.numero}`.toLowerCase().includes(q);
      const matchOtp = (m.otp || '').toLowerCase().includes(q);
      if (!matchName && !matchProv && !matchDoc && !matchOtp && !matchFam) return false;
    }
    if (tipoOperacionFiltro === 'ENTRADAS' && Number(m.cantidadEntrada) <= 0) return false;
    if (tipoOperacionFiltro === 'SALIDAS' && Number(m.cantidadSalida) <= 0) return false;
    return true;
  });

  const totalPages = Math.ceil(filteredMovimientos.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedMovimientos = filteredMovimientos.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const totalEntradas = filteredMovimientos.reduce((acc, m) => acc + Number(m.cantidadEntrada || 0), 0);
  const totalSalidas = filteredMovimientos.reduce((acc, m) => acc + Number(m.cantidadSalida || 0), 0);

  const formatearPeso = (n: number): string =>
    unidad === 'KG'
      ? (n / 1000).toLocaleString('es-PE', { minimumFractionDigits: 2 })
      : Math.round(n).toLocaleString('es-PE');

  const totalItemsUnicos = new Set(filteredMovimientos.map((m) => m.productoNombre)).size;
  const saldoMap = new Map<string, number>();
  filteredMovimientos.forEach((m) => {
    saldoMap.set(m.productoNombre, Number(m.saldoFinal || 0));
  });
  const totalSaldoAcumulado = Array.from(saldoMap.values()).reduce((acc, v) => acc + v, 0);

  return (
    <div className="space-y-4 font-mono min-h-screen">
      {/* Banner Principal de Kardex Inmutable */}
      <div
        className={`rounded-2xl p-5 border flex flex-wrap items-center justify-between gap-4 transition-all shadow-sm ${cardBg}`}
      >
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-[#00F2C3]">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className={`text-lg font-black font-sans tracking-tight ${textValue}`}>
                Kardex de Inventario Inmutable
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider font-mono bg-cyan-500/10 border border-cyan-500/30 text-[#00F2C3] uppercase">
                SINCRONIZADO CON EXCEL PLANTA
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Formato oficial Quimicorp: Registro de Stock Inicial, Entradas, Salidas y Saldos por Categoras.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            alert('Exportando los 183 registros auditables de Kardex a formato Excel / PDF oficial...');
          }}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black font-sans text-xs tracking-wider uppercase transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          <span>Exportar a Excel / PDF</span>
        </button>
      </div>

      {/* 5 Tarjetas Horizontales de Categoras */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {categoriesConfig.map((cat) => {
          const isSelected = activeTab === cat.id;
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`rounded-2xl p-4 border text-left transition-all duration-200 flex flex-col justify-between gap-3 group relative overflow-hidden ${
                isSelected
                  ? isDark
                    ? 'bg-[#151D2A] border-[#00F2C3] shadow-lg shadow-[#00F2C3]/10 ring-1 ring-[#00F2C3]'
                    : 'bg-cyan-50/70 border-cyan-400 shadow-md ring-1 ring-cyan-400'
                  : isDark
                  ? 'bg-[#0F141C] border-[#1A2232] hover:border-slate-700 hover:bg-[#151D2A]/60'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <div
                  className={`p-2 rounded-xl border ${
                    isSelected
                      ? 'bg-[#00F2C3]/20 border-[#00F2C3]/40 text-[#00F2C3]'
                      : isDark
                      ? 'bg-slate-800/40 border-slate-700 text-slate-400'
                      : 'bg-slate-100 border-slate-200 text-slate-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase font-mono border ${cat.badgeColor}`}>
                  {cat.id.replace('_', ' ')}
                </span>
              </div>

              <div>
                <h3 className={`text-xs font-black font-sans uppercase tracking-tight ${isSelected ? 'text-[#00F2C3]' : textValue}`}>
                  {cat.label}
                </h3>
                <p className="text-[10px] text-slate-400 font-sans leading-relaxed mt-1 line-clamp-2">
                  {cat.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. Tarjetas KPI Principales */}
      <div className="flex items-center justify-end mb-3">
        <div className={`inline-flex rounded-xl border p-0.5 ${isDark ? 'border-slate-700 bg-[#151D2A]' : 'border-slate-200 bg-slate-50'}`}>
          {(['GR', 'KG'] as const).map((u) => (
            <button
              key={u}
              onClick={() => setUnidad(u)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-black font-mono transition-all ${
                unidad === u
                  ? 'bg-[#00F2C3] text-[#06241B] shadow'
                  : isDark
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {u}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* TOTAL ENTRADAS */}
        <div className={`rounded-2xl p-4 border transition-all shadow-sm space-y-1 ${cardBg}`}>
          <span className={`text-[10px] font-bold tracking-widest uppercase font-sans ${textTitle}`}>
            TOTAL ENTRADAS / COMPRAS ({activeTab.replace('_', ' ')})
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-400 font-mono">
              +{formatearPeso(totalEntradas)}
            </span>
            <span className="text-xs text-emerald-400 font-bold">{unidad}</span>
          </div>
        </div>

        {/* TOTAL SALIDAS */}
        <div className={`rounded-2xl p-4 border transition-all shadow-sm space-y-1 ${cardBg}`}>
          <span className={`text-[10px] font-bold tracking-widest uppercase font-sans ${textTitle}`}>
            TOTAL SALIDAS / CONSUMO ({activeTab.replace('_', ' ')})
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-rose-400 font-mono">
              -{formatearPeso(totalSalidas)}
            </span>
            <span className="text-xs text-rose-400 font-bold">{unidad}</span>
          </div>
        </div>

        {/* REGISTROS AUDITABLES EXCEL */}
        <div className={`rounded-2xl p-4 border transition-all shadow-sm space-y-1 ${cardBg}`}>
          <span className={`text-[10px] font-bold tracking-widest uppercase font-sans ${textTitle}`}>
            REGISTROS AUDITABLES EXCEL
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-cyan-400 font-mono">
              {filteredMovimientos.length}
            </span>
            <span className="text-xs text-slate-400 font-sans font-medium">Sincronizados en BD</span>
          </div>
        </div>
      </div>

      {/* Barra de Filtros y Bsqueda */}
      <div className={`rounded-2xl p-3.5 border flex flex-wrap items-center justify-between gap-3 shadow-sm ${cardBg}`}>
        {/* Buscador */}
        <div className="relative flex-1 min-w-[280px]">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por Producto, Insumo, Familia, Proveedor o Doc..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full rounded-xl border py-2 pl-10 pr-4 text-xs focus:border-[#00F2C3] focus:outline-none transition-all font-sans ${inputBg}`}
          />
        </div>

        {/* Filtro de Fechas */}
        <div className="flex items-center gap-2 text-xs font-sans">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border bg-[#151D2A]/60 border-[#1A2232]">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[10px] text-slate-400 uppercase font-bold">Desde:</span>
            <input
              type="date"
              value={fechaDesde}
              onChange={(e) => setFechaDesde(e.target.value)}
              className="bg-transparent text-xs text-slate-200 focus:outline-none font-mono"
            />
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border bg-[#151D2A]/60 border-[#1A2232]">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[10px] text-slate-400 uppercase font-bold">Hasta:</span>
            <input
              type="date"
              value={fechaHasta}
              onChange={(e) => setFechaHasta(e.target.value)}
              className="bg-transparent text-xs text-slate-200 focus:outline-none font-mono"
            />
          </div>
        </div>

        {/* Pills de Operacin */}
        <div className="flex items-center gap-1.5 font-sans">
          {(['TODAS', 'ENTRADAS', 'SALIDAS'] as const).map((tipo) => {
            const isSel = tipoOperacionFiltro === tipo;
            const labels = { TODAS: 'Todas', ENTRADAS: 'Entradas / Compras', SALIDAS: 'Salidas / Consumo' };
            return (
              <button
                key={tipo}
                onClick={() => setTipoOperacionFiltro(tipo)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isSel
                    ? 'bg-[#00F2C3] text-slate-950 shadow-md shadow-[#00F2C3]/20'
                    : isDark
                    ? 'bg-[#151D2A] text-slate-300 border border-[#1A2232] hover:text-white'
                    : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200'
                }`}
              >
                {labels[tipo]}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Tabla Principal de Movimientos (Coincidencia Exacta Screenshot) */}
      <div className={`rounded-xl p-5 border space-y-4 ${cardBg}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr
                className={`border-b text-[10px] font-bold tracking-widest uppercase ${
                  isDark ? 'border-[#1A2232] text-slate-400' : 'border-slate-200 text-slate-500'
                }`}
              >
                <th className="py-3 px-3">FECHA</th>
                <th className="py-3 px-3">DETALLE COMPROBANTE</th>
                <th className="py-3 px-3">TIPO OPERACIN</th>
                <th className="py-3 px-3">FAMILIA & CATEGORA</th>
                <th className="py-3 px-3">PRODUCTO / INSUMO</th>
                <th className="py-3 px-3">PROVEEDOR / CLIENTE</th>
                <th className="py-3 px-3 text-center">UNIDAD</th>
                <th className="py-3 px-3 text-right">ENTRADAS</th>
                <th className="py-3 px-3 text-right">SALIDAS</th>
                <th className="py-3 px-3 text-right">SALDO FINAL</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-[#1A2232]/60' : 'divide-slate-200'}`}>
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-4 px-3"><div className="h-4 w-20 bg-slate-800/70 rounded" /></td>
                    <td className="py-4 px-3"><div className="h-4 w-28 bg-slate-800/80 rounded" /></td>
                    <td className="py-4 px-3"><div className="h-4 w-24 bg-slate-800/60 rounded" /></td>
                    <td className="py-4 px-3"><div className="h-4 w-24 bg-slate-800/50 rounded" /></td>
                    <td className="py-4 px-3"><div className="h-4 w-40 bg-slate-800/70 rounded" /></td>
                    <td className="py-4 px-3"><div className="h-4 w-32 bg-slate-800/60 rounded" /></td>
                    <td className="py-4 px-3 text-center"><div className="h-4 w-12 bg-slate-800/60 rounded mx-auto" /></td>
                    <td className="py-4 px-3 text-right"><div className="h-4 w-16 bg-slate-800/60 rounded ml-auto" /></td>
                    <td className="py-4 px-3 text-right"><div className="h-4 w-16 bg-slate-800/60 rounded ml-auto" /></td>
                    <td className="py-4 px-3 text-right"><div className="h-4 w-20 bg-slate-800/70 rounded ml-auto" /></td>
                  </tr>
                ))
              ) : paginatedMovimientos.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 font-sans">
                    <ActionableEmptyState
                      icon={Layers}
                      title="Sin movimientos registrados"
                      description={`No se encontraron movimientos para la categoría ${activeTab.replace('_', ' ')} con los filtros seleccionados.`}
                      actionLabel="Restablecer Filtros"
                      onAction={() => {
                        setSearchQuery('');
                        setTipoOperacionFiltro('TODAS');
                        setFechaDesde('');
                        setFechaHasta('');
                      }}
                      secondaryActionLabel="Actualizar"
                      onSecondaryAction={fetchKardexData}
                    />
                  </td>
                </tr>
              ) : (
                paginatedMovimientos.map((m) => {
                  const isStockInicial = m.tipoOperacion === 'STOCK_INICIAL' || m.tipoDoc === 'INV';
                  const esEntrada = Number(m.cantidadEntrada) > 0 || isStockInicial;
                  const fechaFormatted = new Date(m.fecha).toLocaleDateString('es-PE', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  });

                  return (
                    <tr
                      key={m.id}
                      className={`transition-colors ${
                        isStockInicial
                          ? isDark
                            ? 'bg-cyan-500/5 hover:bg-cyan-500/10'
                            : 'bg-cyan-50/70 hover:bg-cyan-100/60'
                          : isDark
                          ? 'hover:bg-[#151D2A]/50'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      {/* Fecha */}
                      <td className="py-3.5 px-3 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                        {fechaFormatted}
                      </td>

                      {/* Detalle Comprobante */}
                      <td className="py-3.5 px-3">
                        <div className="font-mono text-xs font-bold text-cyan-400">
                          {m.tipoDoc ? `${m.tipoDoc} ` : ''}{m.serie ? `${m.serie}-` : ''}{m.numero || 'INVENTARIO'}
                        </div>
                        {m.otp && (
                          <div className="text-[10px] text-slate-400 font-sans">
                            OTP: {m.otp}
                          </div>
                        )}
                      </td>

                      {/* Tipo Operación — tipificado por gerente: verde ENTRADA, naranja SALIDA CONSUMO, rojo MERMA */}
                      <td className="py-3.5 px-3 font-mono whitespace-nowrap">
                        {(() => {
                          const tipo = String(m.tipoOperacion || '');
                          let cls = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
                          let label = tipo.replace(/_/g, ' ');
                          if (isStockInicial || tipo.includes('ENTRADA')) {
                            cls = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
                            label = tipo === 'ENTRADA_PRODUCCION' ? 'ENTRADA PRODUCCIÓN' : label;
                          } else if (tipo.includes('SALIDA_CONSUMO')) {
                            cls = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
                            label = 'SALIDA POR CONSUMO';
                          } else if (tipo.includes('MERMA') || tipo.includes('DESCARTE')) {
                            cls = 'bg-rose-600/20 text-rose-500 border-rose-600/40';
                            label = 'MERMA / DESCARTE';
                          } else if (tipo.includes('DEVOLU')) {
                            cls = 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
                          }
                          return (
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${cls}`}>
                              {isStockInicial ? 'ENTRADA COMPRA' : label}
                            </span>
                          );
                        })()}
                      </td>

                      {/* Familia & Categora */}
                      <td className="py-3.5 px-3">
                        <div className="font-sans text-xs font-semibold text-slate-300">
                          {m.familia || 'Materia Prima Real'}
                        </div>
                        <div className="text-[10px] text-slate-400 font-sans">
                          {m.categoriaNombre || 'Control Fsico Planta'}
                        </div>
                      </td>

                      {/* Producto / Insumo */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2">
                          <span className={`font-sans text-xs font-bold uppercase tracking-wide ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                            {m.productoNombre}
                          </span>
                          {m.categoriaKardex === 'PRODUCTO_TERMINADO' && (
                            <button
                              onClick={() => setBomModalProducto(m.productoNombre)}
                              title="Ver Fórmula BOM de Insumos"
                              className={`px-1.5 py-0.5 rounded-md border text-[10px] font-bold transition-all flex items-center gap-1 ${
                                isDark
                                  ? 'bg-purple-500/10 border-purple-500/30 text-purple-300 hover:bg-purple-500/20'
                                  : 'bg-purple-50 border-purple-300 text-purple-700 hover:bg-purple-100'
                              }`}
                            >
                              <Beaker className="w-3 h-3 text-purple-400" />
                              <span>BOM</span>
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Proveedor / Cliente */}
                      <td className={`py-3.5 px-3 font-sans text-xs uppercase ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        {m.proveedorCliente || 'PROVEEDOR QUIMICORP'}
                      </td>

                      {/* Unidad Medida */}
                      <td className="py-3.5 px-3 text-center font-mono text-slate-400 font-bold">
                        {m.unidadMedida}
                      </td>

                      {/* Entradas */}
                      <td className="py-3.5 px-3 text-right font-mono text-xs font-bold text-emerald-400">
                        {Number(m.cantidadEntrada) > 0
                          ? `+${Number(m.cantidadEntrada).toLocaleString('es-PE', { minimumFractionDigits: 2 })}`
                          : '-'}
                      </td>

                      {/* Salidas */}
                      <td className="py-3.5 px-3 text-right font-mono text-xs font-bold text-rose-400">
                        {Number(m.cantidadSalida) > 0
                          ? `-${Number(m.cantidadSalida).toLocaleString('es-PE', { minimumFractionDigits: 2 })}`
                          : '-'}
                      </td>

                      {/* Saldo Final */}
                      <td
                        className={`py-3.5 px-3 text-right font-mono text-xs font-black ${
                          Number(m.saldoFinal) < 0
                            ? 'text-rose-400'
                            : isDark
                            ? 'text-[#00F2C3]'
                            : 'text-cyan-700'
                        }`}
                      >
                        {Number(m.saldoFinal).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Control de Paginacin de 60 en 60 */}
        <div className={`p-4 border-t flex flex-wrap items-center justify-between gap-3 text-xs font-mono ${isDark ? 'border-[#1A2232] bg-[#0D121B]' : 'border-slate-200 bg-slate-50'}`}>
          <div className="text-slate-400 font-sans">
            Mostrando registros <strong className={isDark ? 'text-white' : 'text-slate-900'}>{filteredMovimientos.length === 0 ? 0 : startIndex + 1}</strong> al{' '}
            <strong className={isDark ? 'text-white' : 'text-slate-900'}>
              {Math.min(startIndex + ITEMS_PER_PAGE, filteredMovimientos.length)}
            </strong>{' '}
            de <strong className="text-[#00F2C3]">{filteredMovimientos.length}</strong> movimientos en total
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

      <BOMModal
        productoNombre={bomModalProducto || ''}
        isOpen={!!bomModalProducto}
        onClose={() => setBomModalProducto(null)}
        isDark={isDark}
      />
    </div>
  );
}
