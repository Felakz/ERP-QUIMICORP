'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { useTheme } from '@/lib/ThemeContext';
import { KARDEX_REAL_SEED_DATA } from '@/lib/kardexRealData';

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
  costoUnitarioPen?: number;
  valorTotalPen?: number;
}

const categoriesConfig: {
  id: CategoriaKardexTab;
  label: string;
  description: string;
  icon: any;
  badgeColor: string;
}[] = [
  {
    id: 'PRODUCTO_TERMINADO',
    label: 'Productos Terminados',
    description: 'Detergentes, Cloros, Lavavajillas, Quitamanchas formulados en planta.',
    icon: Sparkles,
    badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
  },
  {
    id: 'MATERIA_PRIMA',
    label: 'Materia Prima Base',
    description: 'Bases químicas pesadas (Texapon, LABSA, Soda Cáustica, Hipoclorito).',
    icon: Layers,
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  },
  {
    id: 'INSUMO',
    label: 'Insumos & Fragancias',
    description: 'Fragancias finas, colorantes, conservantes y espesantes.',
    icon: Package,
    badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  },
  {
    id: 'ENVASE',
    label: 'Envases & Botellas',
    description: 'Galoneras 4L, Bidones 20L, Botellas 1L y tapas precinto.',
    icon: Box,
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  },
  {
    id: 'EMBALAJE',
    label: 'Embalaje & Empaque',
    description: 'Cajas de cartón corrugado, precintos termoencogibles y etiquetas.',
    icon: Truck,
    badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  },
];

const ITEMS_PER_PAGE = 25;

export default function AdministracionInventarioKardexPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [activeTab, setActiveTab] = useState<CategoriaKardexTab>('PRODUCTO_TERMINADO');
  const [searchQuery, setSearchQuery] = useState('');
  const [tipoOperacionFiltro, setTipoOperacionFiltro] = useState<'TODOS' | 'ENTRADAS' | 'SALIDAS'>('TODOS');
  const [currentPage, setCurrentPage] = useState(1);
  const [movimientos, setMovimientos] = useState<KardexMovimientoUI[]>([]);
  const [loading, setLoading] = useState(false);

  const cardBg = isDark ? 'bg-[#0F141C] border-[#1A2232]' : 'bg-white border-slate-200 shadow-sm';
  const textTitle = isDark ? 'text-slate-400' : 'text-slate-600';
  const textValue = isDark ? 'text-white' : 'text-slate-900';
  const inputBg = isDark
    ? 'bg-[#151D2A] border-[#1A2232] text-slate-200 placeholder-slate-500 focus:border-[#00F2C3]'
    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500';

  useEffect(() => {
    // Carga de los 183 registros auditables de Kardex Real
    const mapped: KardexMovimientoUI[] = KARDEX_REAL_SEED_DATA.map((k, idx) => ({
      id: `kardex-${idx}`,
      categoriaKardex: k.categoriaKardex as CategoriaKardexTab,
      productoNombre: k.productoNombre,
      familia: k.familia,
      categoriaNombre: k.categoriaNombre,
      proveedorCliente: k.proveedorCliente,
      unidadMedida: k.unidadMedida,
      fecha: k.fecha,
      tipoDoc: k.tipoDoc,
      serie: k.serie,
      numero: k.numero,
      otp: k.otp,
      tipoOperacion: k.tipoOperacion,
      cantidadEntrada: Number(k.cantidadEntrada) || 0,
      cantidadSalida: Number(k.cantidadSalida) || 0,
      saldoFinal: Number(k.saldoFinal) || 0,
      costoUnitarioPen: Number(k.cantidadEntrada) > 0 ? 5.5 : 4.8,
    }));
    setMovimientos(mapped);
  }, []);

  const filteredMovimientos = useMemo(() => {
    return movimientos.filter((m) => {
      if (activeTab && m.categoriaKardex !== activeTab) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = m.productoNombre.toLowerCase().includes(q);
        const matchProv = (m.proveedorCliente || '').toLowerCase().includes(q);
        const matchFam = (m.familia || '').toLowerCase().includes(q);
        const matchDoc = `${m.tipoDoc}-${m.serie}-${m.numero}`.toLowerCase().includes(q);
        if (!matchName && !matchProv && !matchFam && !matchDoc) return false;
      }
      if (tipoOperacionFiltro === 'ENTRADAS' && m.cantidadEntrada <= 0) return false;
      if (tipoOperacionFiltro === 'SALIDAS' && m.cantidadSalida <= 0) return false;
      return true;
    });
  }, [movimientos, activeTab, searchQuery, tipoOperacionFiltro]);

  const totalPages = Math.ceil(filteredMovimientos.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedMovimientos = filteredMovimientos.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // KPIs
  const totalEntradas = useMemo(
    () => filteredMovimientos.reduce((acc, m) => acc + m.cantidadEntrada, 0),
    [filteredMovimientos]
  );
  const totalSalidas = useMemo(
    () => filteredMovimientos.reduce((acc, m) => acc + m.cantidadSalida, 0),
    [filteredMovimientos]
  );
  const saldoMap = useMemo(() => {
    const map = new Map<string, number>();
    filteredMovimientos.forEach((m) => {
      map.set(m.productoNombre, m.saldoFinal);
    });
    return map;
  }, [filteredMovimientos]);
  const totalSaldoAcumulado = useMemo(
    () => Array.from(saldoMap.values()).reduce((acc, v) => acc + v, 0),
    [saldoMap]
  );

  const handleExportExcel = () => {
    const rows = filteredMovimientos.map((m) => ({
      Categoria: m.categoriaKardex,
      Fecha: m.fecha,
      Producto: m.productoNombre,
      Familia: m.familia,
      Operacion: m.tipoOperacion,
      Documento: `${m.tipoDoc} ${m.serie}-${m.numero}`.trim(),
      OTP_Lote: m.otp,
      Proveedor_Cliente: m.proveedorCliente,
      Entrada: m.cantidadEntrada,
      Salida: m.cantidadSalida,
      Saldo_Final: m.saldoFinal,
      Unidad: m.unidadMedida,
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `Kardex_${activeTab}`);
    XLSX.writeFile(wb, `Quimicorp_Kardex_${activeTab}_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="space-y-4 font-mono min-h-screen">
      {/* 1. Banner Principal de Kardex Inmutable */}
      <div
        className={`rounded-2xl p-5 border flex flex-wrap items-center justify-between gap-4 transition-all shadow-sm ${cardBg}`}
      >
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-[#00F2C3] shadow-[0_0_15px_rgba(0,242,195,0.15)]">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className={`text-lg font-black font-sans tracking-tight ${textValue}`}>
                Kardex de Inventario Inmutable & Valorizado
              </h2>
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider font-mono bg-cyan-500/10 border border-cyan-500/30 text-[#00F2C3] uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00F2C3] animate-pulse" />
                AUDITADO SUNAT & PLANTA
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Registro histórico oficial Quimicorp: Stock Inicial, Entradas, Salidas y Saldos por Categorías.
            </p>
          </div>
        </div>

        <button
          onClick={handleExportExcel}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black font-sans text-xs tracking-wider uppercase transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          <span>Exportar .XLSX</span>
        </button>
      </div>

      {/* 2. 5 Tarjetas Horizontales de Categorías */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {categoriesConfig.map((cat) => {
          const isSelected = activeTab === cat.id;
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setActiveTab(cat.id);
                setCurrentPage(1);
              }}
              className={`rounded-2xl p-4 border text-left transition-all duration-200 flex flex-col justify-between gap-3 group relative overflow-hidden card-hover-lift ${
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

      {/* 3. 3 Tarjetas KPI Principales */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* TOTAL ENTRADAS */}
        <div className={`rounded-2xl p-4 border transition-all card-hover-lift space-y-1 ${cardBg}`}>
          <span className={`text-[10px] font-bold tracking-widest uppercase font-sans ${textTitle}`}>
            TOTAL ENTRADAS / COMPRAS ({activeTab.replace('_', ' ')})
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-400 font-mono">
              +{totalEntradas.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-xs text-emerald-400 font-bold">UNIDADES</span>
          </div>
        </div>

        {/* TOTAL SALIDAS */}
        <div className={`rounded-2xl p-4 border transition-all card-hover-lift space-y-1 ${cardBg}`}>
          <span className={`text-[10px] font-bold tracking-widest uppercase font-sans ${textTitle}`}>
            TOTAL SALIDAS / PRODUCCIÓN ({activeTab.replace('_', ' ')})
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-rose-400 font-mono">
              -{totalSalidas.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-xs text-rose-400 font-bold">UNIDADES</span>
          </div>
        </div>

        {/* SALDO ACUMULADO */}
        <div className={`rounded-2xl p-4 border transition-all card-hover-lift space-y-1 ${cardBg}`}>
          <span className={`text-[10px] font-bold tracking-widest uppercase font-sans ${textTitle}`}>
            SALDO DISPONIBLE EN ALMACÉN ({activeTab.replace('_', ' ')})
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#00F2C3] font-mono">
              {totalSaldoAcumulado.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-xs text-[#00F2C3] font-bold">EN STOCK</span>
          </div>
        </div>
      </div>

      {/* 4. Barra de Búsqueda y Filtros */}
      <div className={`rounded-2xl border p-4 flex flex-wrap items-center justify-between gap-3 ${cardBg}`}>
        <div className="flex items-center gap-1.5 bg-[#151D2A] p-1 rounded-xl border border-[#1A2232]">
          {[
            { id: 'TODOS', label: 'Todos' },
            { id: 'ENTRADAS', label: 'Solo Entradas' },
            { id: 'SALIDAS', label: 'Solo Salidas' },
          ].map((op) => (
            <button
              key={op.id}
              onClick={() => {
                setTipoOperacionFiltro(op.id as any);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                tipoOperacionFiltro === op.id
                  ? 'bg-[#00F2C3] text-slate-950 shadow-[0_0_10px_rgba(0,242,195,0.4)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {op.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por producto, lote, doc o proveedor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full rounded-xl border py-2 pl-9 pr-3 text-xs focus:outline-none transition-all ${inputBg}`}
          />
        </div>
      </div>

      {/* 5. Tabla de Kardex Auditada */}
      <div className={`rounded-2xl border overflow-hidden ${cardBg}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className={`border-b ${isDark ? 'border-[#1A2232] text-slate-400 bg-[#0B0F17]' : 'border-slate-200 text-slate-600 bg-slate-50'}`}>
                <th className="py-3 px-4 font-bold">FECHA</th>
                <th className="py-3 px-4 font-bold">PRODUCTO / ITEM</th>
                <th className="py-3 px-4 font-bold">DOC / SERIE</th>
                <th className="py-3 px-4 font-bold">OPERACIÓN / PROVEEDOR</th>
                <th className="py-3 px-4 font-bold text-right text-emerald-400">ENTRADA</th>
                <th className="py-3 px-4 font-bold text-right text-rose-400">SALIDA</th>
                <th className="py-3 px-4 font-bold text-right text-[#00F2C3]">SALDO FINAL</th>
                <th className="py-3 px-3 font-bold text-center">UND</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {paginatedMovimientos.map((m) => (
                <tr
                  key={m.id}
                  className={`transition-colors ${
                    isDark ? 'hover:bg-[#151D2A]/60' : 'hover:bg-slate-50'
                  }`}
                >
                  <td className="py-3 px-4 text-slate-400 whitespace-nowrap">{m.fecha}</td>

                  <td className="py-3 px-4 font-sans font-bold">
                    <span className={isDark ? 'text-slate-100' : 'text-slate-900'}>
                      {m.productoNombre}
                    </span>
                    {m.familia && (
                      <span className="text-[10px] text-slate-400 font-mono block">
                        {m.familia}
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-slate-300 font-mono">
                    {m.tipoDoc ? `${m.tipoDoc} ${m.serie}-${m.numero}` : m.otp || '—'}
                  </td>

                  <td className="py-3 px-4 text-slate-300 font-sans">
                    <span className="font-bold text-slate-200 block">{m.tipoOperacion}</span>
                    <span className="text-[10px] text-slate-400">{m.proveedorCliente || '—'}</span>
                  </td>

                  <td className="py-3 px-4 text-right font-black text-emerald-400">
                    {m.cantidadEntrada > 0 ? `+${m.cantidadEntrada.toLocaleString('es-PE', { minimumFractionDigits: 2 })}` : '—'}
                  </td>

                  <td className="py-3 px-4 text-right font-black text-rose-400">
                    {m.cantidadSalida > 0 ? `-${m.cantidadSalida.toLocaleString('es-PE', { minimumFractionDigits: 2 })}` : '—'}
                  </td>

                  <td className="py-3 px-4 text-right font-black text-[#00F2C3]">
                    {m.saldoFinal.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                  </td>

                  <td className="py-3 px-3 text-center text-slate-400 font-bold">{m.unidadMedida}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className={`p-4 border-t flex items-center justify-between text-xs ${isDark ? 'border-[#1A2232] text-slate-400' : 'border-slate-200 text-slate-600'}`}>
          <span>
            Mostrando {startIndex + 1} - {Math.min(startIndex + ITEMS_PER_PAGE, filteredMovimientos.length)} de {filteredMovimientos.length} registros
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1.5 rounded-lg border font-bold disabled:opacity-30 ${
                isDark ? 'border-[#1A2232] bg-[#151D2A] text-slate-200' : 'border-slate-300 bg-white text-slate-800'
              }`}
            >
              Anterior
            </button>
            <span className="font-mono font-bold text-cyan-400">
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1.5 rounded-lg border font-bold disabled:opacity-30 ${
                isDark ? 'border-[#1A2232] bg-[#151D2A] text-slate-200' : 'border-slate-300 bg-white text-slate-800'
              }`}
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
