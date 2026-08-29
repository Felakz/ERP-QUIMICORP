'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  TrendingUp,
  Search,
  Filter,
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Boxes,
  FileSpreadsheet,
  Download,
  DollarSign,
  Package,
} from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';
import { apiFetch } from '@/lib/apiClient';
import { formatCurrency } from '@/lib/dashboardFormatters';

interface KardexValorizadoItem {
  id: string;
  fecha: string;
  categoriaKardex: string;
  productoNombre: string;
  familia: string;
  tipoDoc: string;
  serieNumero: string;
  tipoOperacion: 'ENTRADA' | 'SALIDA';
  cantidadEntrada: number;
  cantidadSalida: number;
  saldoCantidad: number;
  costoUnitarioPen: number;
  montoEntradaPen: number;
  montoSalidaPen: number;
  montoSaldoPen: number;
}

export default function KardexValorizadoPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [activeCategory, setActiveCategory] = useState<string>('TODOS');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [fechaDesde, setFechaDesde] = useState<string>('');
  const [fechaHasta, setFechaHasta] = useState<string>('');
  const [movimientos, setMovimientos] = useState<KardexValorizadoItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchKardexValorizado = async () => {
    setLoading(true);
    try {
      const data = await apiFetch<any[]>('/kardex/categorizado');
      if (Array.isArray(data)) {
        const mapped: KardexValorizadoItem[] = data.map((m: any, idx: number) => {
          const costoUnit = Number(m.costoUnitario) || 0;
          const cEntrada = Number(m.cantidadEntrada) || 0;
          const cSalida = Number(m.cantidadSalida) || 0;
          const saldo = Number(m.saldoFinal) || 0;
          const mEntrada = Number(m.montoEntradaPen) || cEntrada * costoUnit;
          const mSalida = Number(m.montoSalidaPen) || cSalida * costoUnit;
          const mSaldo = Number(m.montoSaldoPen) || saldo * costoUnit;

          return {
            id: m.id || `k-${idx}`,
            fecha: m.fecha ? new Date(m.fecha).toISOString().split('T')[0] : '',
            categoriaKardex: m.categoriaKardex || m.categoriaNombre || 'MATERIA_PRIMA',
            productoNombre: m.productoNombre || '',
            familia: m.familia || '',
            tipoDoc: m.tipoDoc || '',
            serieNumero: [m.serie, m.numero].filter(Boolean).join('-'),
            tipoOperacion: cSalida > 0 ? 'SALIDA' : 'ENTRADA',
            cantidadEntrada: cEntrada,
            cantidadSalida: cSalida,
            saldoCantidad: saldo,
            costoUnitarioPen: costoUnit,
            montoEntradaPen: mEntrada,
            montoSalidaPen: mSalida,
            montoSaldoPen: mSaldo,
          };
        });

        setMovimientos(mapped);
      }
    } catch (e) {
      console.log('Error fetching Kardex Valorizado:', e);
      setMovimientos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKardexValorizado();
  }, []);

  const filteredMovimientos = movimientos.filter((item) => {
    const matchesCategory =
      activeCategory === 'TODOS' || item.categoriaKardex.toUpperCase().includes(activeCategory);
    const matchesSearch =
      !searchQuery ||
      item.productoNombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.serieNumero.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalMontoIngresos = filteredMovimientos.reduce((acc, curr) => acc + curr.montoEntradaPen, 0);
  const totalMontoEgresos = filteredMovimientos.reduce((acc, curr) => acc + curr.montoSalidaPen, 0);
  const totalSaldoValorizado = filteredMovimientos.reduce((acc, curr) => acc + curr.montoSaldoPen, 0);

  const cardBg = isDark ? 'bg-[#0F141C] border-[#1A2232]' : 'bg-white border-slate-200 shadow-sm';
  const tableHeaderBg = isDark ? 'bg-[#151D2A] text-slate-400 border-[#1A2232]' : 'bg-slate-100 text-slate-600 border-slate-200';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`p-6 rounded-2xl border ${cardBg} space-y-4`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className={`text-xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <DollarSign className="w-6 h-6 text-emerald-400" />
              Kardex Valorizado Gerencial & Contable
            </h1>
            <p className="text-xs text-slate-400">
              Evaluación monetaria de inventario (S/): Ingresos, Egresos y Saldo Valorizado por categoría
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchKardexValorizado()}
              className="px-4 py-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-xs font-bold transition-all border border-blue-500/20 flex items-center gap-2"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Exportar Excel Valorizado</span>
            </button>
          </div>
        </div>

        {/* 3 Tarjetas Monetarias */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#151D2A] border-emerald-500/20' : 'bg-emerald-50 border-emerald-200'}`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">Total Ingresos (S/)</span>
              <ArrowUpRight className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-lg font-black text-emerald-400 mt-1">
              S/ {totalMontoIngresos.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>

          <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#151D2A] border-rose-500/20' : 'bg-rose-50 border-rose-200'}`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">Total Egresos (S/)</span>
              <ArrowDownRight className="w-4 h-4 text-rose-400" />
            </div>
            <p className="text-lg font-black text-rose-400 mt-1">
              S/ {totalMontoEgresos.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>

          <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#151D2A] border-blue-500/20' : 'bg-blue-50 border-blue-200'}`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">Saldo Valorizado Actual (S/)</span>
              <Boxes className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-lg font-black text-blue-400 mt-1">
              S/ {totalSaldoValorizado.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-2 overflow-x-auto">
            {['TODOS', 'MATERIA_PRIMA', 'PRODUCTO_TERMINADO', 'INSUMO', 'ENVASE'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeCategory === cat
                    ? 'bg-blue-600 text-white shadow-md'
                    : isDark
                    ? 'bg-[#151D2A] text-slate-400 hover:text-white border border-[#1A2232]'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                {cat.replace('_', ' ')}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar insumo o doc..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-9 pr-4 py-2 rounded-xl text-xs font-medium border focus:outline-none ${
                isDark ? 'bg-[#151D2A] border-[#1A2232] text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Tabla Valorizada */}
      <div className={`p-6 rounded-2xl border ${cardBg}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className={`border-b text-[10px] font-bold uppercase tracking-wider ${tableHeaderBg}`}>
                <th className="py-3 px-3">FECHA</th>
                <th className="py-3 px-3">CATEGORÍA</th>
                <th className="py-3 px-3">PRODUCTO / INSUMO</th>
                <th className="py-3 px-3">DOC / SERIE</th>
                <th className="py-3 px-3 text-right">COSTO UNIT.</th>
                <th className="py-3 px-3 text-right text-emerald-400">INGRESOS (S/)</th>
                <th className="py-3 px-3 text-right text-rose-400">EGRESOS (S/)</th>
                <th className="py-3 px-3 text-right text-blue-400">SALDO VALORIZADO (S/)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/20">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-xs text-slate-400">
                    Cargando Kardex Valorizado...
                  </td>
                </tr>
              ) : filteredMovimientos.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-xs text-slate-400">
                    No se encontraron movimientos valorizados.
                  </td>
                </tr>
              ) : (
                filteredMovimientos.map((item) => (
                  <tr key={item.id} className={isDark ? 'hover:bg-[#151D2A]' : 'hover:bg-slate-50'}>
                    <td className="py-3 px-3 font-mono text-slate-400">{item.fecha}</td>
                    <td className="py-3 px-3 font-bold text-slate-300">{item.categoriaKardex}</td>
                    <td className="py-3 px-3 font-bold text-white">{item.productoNombre}</td>
                    <td className="py-3 px-3 font-mono text-blue-400">{item.serieNumero}</td>
                    <td className="py-3 px-3 text-right font-mono text-slate-300">
                      S/ {item.costoUnitarioPen.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-emerald-400">
                      {item.montoEntradaPen > 0
                        ? `S/ ${item.montoEntradaPen.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`
                        : '-'}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-rose-400">
                      {item.montoSalidaPen > 0
                        ? `S/ ${item.montoSalidaPen.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`
                        : '-'}
                    </td>
                    <td className="py-3 px-3 text-right font-black text-blue-400">
                      S/ {item.montoSaldoPen.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
