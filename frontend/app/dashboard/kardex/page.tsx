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
} from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';

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

export default function KardexPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [activeTab, setActiveTab] = useState<CategoriaKardexTab>('MATERIA_PRIMA');
  const [searchQuery, setSearchQuery] = useState('');
  const [tipoOperacionFiltro, setTipoOperacionFiltro] = useState<'TODAS' | 'ENTRADAS' | 'SALIDAS'>('TODAS');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [movimientos, setMovimientos] = useState<KardexMovimientoUI[]>([]);
  const [loading, setLoading] = useState(false);

  const cardBg = isDark ? 'bg-[#0F141C] border-[#1A2232]' : 'bg-white border-slate-200 shadow-sm';
  const textTitle = isDark ? 'text-slate-400' : 'text-slate-500';
  const textValue = isDark ? 'text-white' : 'text-slate-900';
  const inputBg = isDark
    ? 'bg-[#151D2A] border-[#1A2232] text-slate-200 placeholder-slate-500'
    : 'bg-slate-50 border-slate-300 text-slate-800 placeholder-slate-400';

  const fetchKardexData = async () => {
    setLoading(true);
    let apiData: KardexMovimientoUI[] = [];
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('categoria', activeTab);
      if (searchQuery) queryParams.append('search', searchQuery);
      if (tipoOperacionFiltro !== 'TODAS') queryParams.append('tipoOperacion', tipoOperacionFiltro);
      if (fechaDesde) queryParams.append('desde', fechaDesde);
      if (fechaHasta) queryParams.append('hasta', fechaHasta);

      const res = await fetch(`http://localhost:3001/api/v1/kardex/categorizado?${queryParams.toString()}`);
      if (res.ok) {
        apiData = await res.json();
      }
    } catch (error) {
      console.log('Error fetching kardex endpoint:', error);
    }

    // Unir con los movimientos locales agregados dinámicamente al finalizar lote
    try {
      const rawCustom = localStorage.getItem('quimicorp_kardex_custom');
      if (rawCustom) {
        const customMovs: KardexMovimientoUI[] = JSON.parse(rawCustom);
        if (Array.isArray(customMovs)) {
          const filtrados = customMovs.filter((m) => m.categoriaKardex === activeTab);
          apiData = [...filtrados, ...apiData];
        }
      }
    } catch (e) {
      console.log('Error merging local kardex:', e);
    }

    setMovimientos(apiData);
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
      description: 'Ácido Oleico, Soda Cáustica, Ácido Sulfúrico, Reactivos',
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
      description: 'Bidones PEAD, Galones, Frascos plásticos y cilindros',
      icon: Box,
      badgeColor: 'border-amber-500/40 text-amber-400 bg-amber-500/10',
    },
    {
      id: 'EMBALAJE',
      label: 'Embalajes',
      description: 'Parihuelas de madera, Cajas de cartón, Cintas',
      icon: Truck,
      badgeColor: 'border-blue-500/40 text-blue-400 bg-blue-500/10',
    },
  ];

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

  const totalEntradas = filteredMovimientos.reduce((acc, m) => acc + Number(m.cantidadEntrada || 0), 0);
  const totalSalidas = filteredMovimientos.reduce((acc, m) => acc + Number(m.cantidadSalida || 0), 0);

  return (
    <div className="space-y-6 font-mono min-h-screen">
      {/* Header Titular Módulo Kardex */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-[#00F2C3]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-sans flex items-center gap-2">
                <span>Kardex de Inventario Inmutable</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                  SINCRONIZADO CON EXCEL PLANTA
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-sans">
                Formato oficial Quimicorp: Registro de Stock Inicial, Entradas, Salidas y Saldos por Categorías.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => alert('Exportando reporte oficial Excel / PDF del Kardex Quimicorp...')}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#00F2C3] to-teal-500 px-4 py-2 text-xs font-bold text-slate-950 hover:opacity-90 transition-all font-sans shadow-lg shadow-cyan-500/10"
        >
          <Download className="w-4 h-4" />
          <span>Exportar a Excel / PDF</span>
        </button>
      </div>

      {/* 1. Pestañas por Categoría (Tabs) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {categoriesConfig.map((cat) => {
          const isActive = activeTab === cat.id;
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`p-3.5 rounded-xl border text-left transition-all duration-150 flex flex-col justify-between space-y-2 ${
                isActive
                  ? isDark
                    ? 'bg-[#151D2A] border-[#00F2C3] shadow-lg shadow-cyan-500/10'
                    : 'bg-cyan-50 border-cyan-400 shadow-md'
                  : isDark
                  ? 'bg-[#0F141C] border-[#1A2232] hover:bg-[#151D2A]/60'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-[#00F2C3]' : 'text-slate-400'
                  }`}
                />
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${cat.badgeColor}`}>
                  {cat.id.replace('_', ' ')}
                </span>
              </div>

              <div>
                <div
                  className={`text-xs font-bold font-sans ${
                    isActive
                      ? isDark
                        ? 'text-white'
                        : 'text-cyan-900'
                      : isDark
                      ? 'text-slate-300'
                      : 'text-slate-700'
                  }`}
                >
                  {cat.label}
                </div>
                <p className="text-[9px] text-slate-400 font-sans line-clamp-1 mt-0.5">
                  {cat.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className={`rounded-xl p-4 border ${cardBg}`}>
          <span className={`text-[11px] font-bold tracking-widest uppercase ${textTitle}`}>
            TOTAL ENTRADAS / COMPRAS ({activeTab.replace('_', ' ')})
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl font-black text-emerald-400">
              +{totalEntradas.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
            </span>
            <ArrowUpRight className="h-4 w-4 text-emerald-400" />
          </div>
        </div>

        <div className={`rounded-xl p-4 border ${cardBg}`}>
          <span className={`text-[11px] font-bold tracking-widest uppercase ${textTitle}`}>
            TOTAL SALIDAS / CONSUMO ({activeTab.replace('_', ' ')})
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl font-black text-rose-400">
              -{totalSalidas.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
            </span>
            <ArrowDownRight className="h-4 w-4 text-rose-400" />
          </div>
        </div>

        <div className={`rounded-xl p-4 border ${cardBg}`}>
          <span className={`text-[11px] font-bold tracking-widest uppercase ${textTitle}`}>
            REGISTROS AUDITABLES EXCEL
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl font-black text-cyan-400">
              {filteredMovimientos.length}
            </span>
            <span className="text-xs text-slate-400 font-sans">Sincronizados en BD</span>
          </div>
        </div>
      </div>

      {/* 2. Barra de Filtros Superior */}
      <div className={`rounded-xl p-4 border space-y-3 ${cardBg}`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Buscador General */}
          <div className="relative flex-1 min-w-[260px]">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por Producto, Insumo, Familia, Proveedor o Doc..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full rounded-lg border py-2 pl-10 pr-4 text-xs focus:border-[#00F2C3] focus:outline-none transition-all font-sans ${inputBg}`}
            />
          </div>

          {/* Rango de Fechas */}
          <div className="flex items-center gap-2 text-xs font-sans">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-slate-400" />
              <span className="text-slate-400">Desde:</span>
              <input
                type="date"
                value={fechaDesde}
                onChange={(e) => setFechaDesde(e.target.value)}
                className={`rounded-lg border px-2.5 py-1.5 text-xs font-mono focus:border-[#00F2C3] focus:outline-none ${inputBg}`}
              />
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Hasta:</span>
              <input
                type="date"
                value={fechaHasta}
                onChange={(e) => setFechaHasta(e.target.value)}
                className={`rounded-lg border px-2.5 py-1.5 text-xs font-mono focus:border-[#00F2C3] focus:outline-none ${inputBg}`}
              />
            </div>
          </div>

          {/* Selector Tipo de Operación */}
          <div className="flex items-center gap-1.5 text-xs font-mono">
            {(['TODAS', 'ENTRADAS', 'SALIDAS'] as const).map((op) => (
              <button
                key={op}
                onClick={() => setTipoOperacionFiltro(op)}
                className={`rounded-lg px-3 py-1.5 font-bold transition-all ${
                  tipoOperacionFiltro === op
                    ? 'bg-[#00F2C3] text-slate-950 font-bold shadow-md'
                    : isDark
                    ? 'bg-[#151D2A] text-slate-400 hover:text-slate-200 border border-[#1A2232]'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-300'
                }`}
              >
                {op === 'TODAS'
                  ? 'Todas'
                  : op === 'ENTRADAS'
                  ? 'Entradas / Compras'
                  : 'Salidas / Consumo'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Tabla Principal de Movimientos (Coincidencia Exacta Excel) */}
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
                <th className="py-3 px-3">TIPO OPERACIÓN</th>
                <th className="py-3 px-3">FAMILIA & CATEGORÍA</th>
                <th className="py-3 px-3">PRODUCTO / INSUMO</th>
                <th className="py-3 px-3">PROVEEDOR / CLIENTE</th>
                <th className="py-3 px-3 text-center">UNIDAD</th>
                <th className="py-3 px-3 text-right">ENTRADAS</th>
                <th className="py-3 px-3 text-right">SALIDAS</th>
                <th className="py-3 px-3 text-right">SALDO FINAL</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-[#1A2232]/60' : 'divide-slate-200'}`}>
              {filteredMovimientos.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-400 font-sans">
                    No se encontraron movimientos registrados para {activeTab.replace('_', ' ')}.
                  </td>
                </tr>
              ) : (
                filteredMovimientos.map((m) => {
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
                      <td className="py-3.5 px-3 font-mono text-[11px] text-slate-400">
                        {fechaFormatted}
                      </td>

                      {/* Detalle Comprobante */}
                      <td className="py-3.5 px-3">
                        <div className="font-mono text-xs font-bold text-cyan-400">
                          {m.tipoDoc} {m.serie ? `${m.serie}-` : ''}{m.numero}
                        </div>
                        {m.otp && (
                          <div className="text-[10px] text-slate-400 font-sans">
                            OTP: {m.otp}
                          </div>
                        )}
                      </td>

                      {/* Tipo Operación */}
                      <td className="py-3.5 px-3 font-mono">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border ${
                            isStockInicial
                              ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                              : esEntrada
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          }`}
                        >
                          {isStockInicial
                            ? 'STOCK INICIAL PLANTA'
                            : m.tipoOperacion.replace(/_/g, ' ')}
                        </span>
                      </td>

                      {/* Familia & Categoría */}
                      <td className="py-3.5 px-3">
                        <div className="font-sans text-xs font-semibold text-slate-300">
                          {m.familia || 'GENERAL'}
                        </div>
                        <div className="text-[10px] text-slate-400 font-sans">
                          {m.categoriaNombre || m.categoriaKardex}
                        </div>
                      </td>

                      {/* Producto / Insumo */}
                      <td className="py-3.5 px-3">
                        <div className={`font-sans text-xs font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                          {m.productoNombre}
                        </div>
                      </td>

                      {/* Proveedor / Cliente */}
                      <td className={`py-3.5 px-3 font-sans text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        {m.proveedorCliente || 'PROVEEDOR QUIMICORP'}
                      </td>

                      {/* Unidad Medida */}
                      <td className="py-3.5 px-3 text-center font-mono text-slate-400">
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
      </div>
    </div>
  );
}
