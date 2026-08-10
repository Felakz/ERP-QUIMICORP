'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertTriangle,
  Check,
  Pause,
  CheckCircle2,
  Beaker,
  Layers,
  Activity,
  Search,
  Filter,
  FileText,
  ChevronLeft,
  Send,
  X,
  Sparkles,
} from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';
import { useAuth } from '@/lib/AuthContext';
import {
  FORMULAS_MAESTRAS_REALES,
  CATEGORIAS_FORMULAS,
  FormulaProducto,
} from '@/lib/formulasData';
import { CommercialOrderForm } from '@/components/pedidos/CommercialOrderForm';

export default function FormulasPage() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const isDark = theme === 'dark';
  const router = useRouter();

  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFormulaId, setSelectedFormulaId] = useState<string>('1');

  // Estados para el flujo "Nuevo Pedido Comercial / Cotización"
  const [isCreatingOrder, setIsCreatingOrder] = useState<boolean>(false);

  const filteredFormulas = FORMULAS_MAESTRAS_REALES.filter((f) => {
    const matchesCategory =
      selectedCategory === 'Todas' || f.categoria === selectedCategory;
    const matchesSearch =
      f.nombreProducto.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.codigoFM.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formulaActual =
    FORMULAS_MAESTRAS_REALES.find((f) => f.id === selectedFormulaId) ||
    filteredFormulas[0] ||
    FORMULAS_MAESTRAS_REALES[0];

  const getCategoryCount = (cat: string) => {
    if (cat === 'Todas') return FORMULAS_MAESTRAS_REALES.length;
    return FORMULAS_MAESTRAS_REALES.filter((f) => f.categoria === cat).length;
  };

  const cardBg = isDark ? 'bg-[#0F141C] border-[#1A2232]' : 'bg-white border-slate-200 shadow-sm';
  const textTitle = isDark ? 'text-slate-400' : 'text-slate-500';
  const textValue = isDark ? 'text-white' : 'text-slate-900';
  const inputBg = isDark ? 'bg-[#151D2A] border-[#1A2232] text-slate-200 placeholder-slate-500' : 'bg-slate-50 border-slate-300 text-slate-800 placeholder-slate-400';

  // ── VISTA 2: FORMULARIO UNIFICADO DE COTIZACIÓN / PEDIDO COMERCIAL ──
  if (isCreatingOrder) {
    return (
      <div className="space-y-5 font-sans min-h-screen">
        <CommercialOrderForm
          context="FORMULA"
          mode="PEDIDO"
          initialData={{
            formulaId: formulaActual.id,
            producto: `${formulaActual.codigoFM} - ${formulaActual.nombreProducto}`,
            cantidadSolicitada: formulaActual.pesoObjetivo || 100,
            precioUnitario: 34.50,
          }}
          onCancel={() => setIsCreatingOrder(false)}
          onSuccess={() => {
            router.push('/administracion/pedidos');
          }}
        />
      </div>
    );
  }

  // ── VISTA 1: CATÁLOGO DE FÓRMULAS MAESTRAS ──
  return (
    <div className="space-y-5 font-mono min-h-screen">
      {/* Product Formula Selector & Category Filters */}
      <div className={`rounded-xl p-5 border space-y-4 ${cardBg}`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Beaker className="h-5 w-5 text-cyan-500" />
            <div>
              <h3 className={`text-xs font-bold tracking-widest uppercase ${textTitle}`}>
                CATÁLOGO DE FÓRMULAS MAESTRAS INDUSTRIALES
              </h3>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                {FORMULAS_MAESTRAS_REALES.length} Fórmulas Maestras registradas en planta (Datos Oficiales Excel)
              </p>
            </div>
          </div>

          {/* Search Input Bar */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por fórmula o código FM..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full rounded-lg border py-2 pl-9 pr-3 text-xs focus:border-[#00F2C3] focus:outline-none transition-all font-sans ${inputBg}`}
            />
          </div>
        </div>

        {/* Category Tabs Bar */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-800/40 font-sans text-xs">
          {CATEGORIAS_FORMULAS.map((cat) => {
            const isSelected = selectedCategory === cat;
            const count = getCategoryCount(cat);
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-lg px-3.5 py-1.5 font-bold transition-all flex items-center gap-1.5 border ${
                  isSelected
                    ? 'bg-[#00F2C3] text-[#090C10] border-[#00F2C3] shadow-md'
                    : isDark
                    ? 'bg-[#151D2A] text-slate-400 border-[#1A2232] hover:text-slate-200'
                    : 'bg-slate-100 text-slate-600 border-slate-300 hover:text-slate-900'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] font-mono ${
                    isSelected
                      ? 'bg-[#090C10]/20 text-[#090C10]'
                      : isDark
                      ? 'bg-slate-800 text-slate-400'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Formula Cards Quick Selector Grid */}
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4 max-h-48 overflow-y-auto pr-1">
          {filteredFormulas.map((f) => {
            const isSelected = f.id === selectedFormulaId;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setSelectedFormulaId(f.id)}
                className={`rounded-lg p-3 text-left transition-all border space-y-1 ${
                  isSelected
                    ? isDark
                      ? 'bg-[#151D2A] border-[#00F2C3] ring-1 ring-[#00F2C3]/30'
                      : 'bg-cyan-50/70 border-cyan-500 ring-1 ring-cyan-500/20'
                    : isDark
                    ? 'bg-[#0B0F17] border-[#1A2232] hover:bg-[#151D2A]/60'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-mono font-bold text-cyan-500">{f.codigoFM}</span>
                  <span className={`px-1.5 py-0.5 rounded font-bold uppercase text-[9px] border ${isDark ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-slate-200 text-slate-700 border-slate-300'}`}>
                    {f.categoria}
                  </span>
                </div>
                <h4 className={`text-xs font-bold font-sans truncate ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                  {f.nombreProducto}
                </h4>
                <p className="text-[10px] text-slate-400 font-mono">
                  {f.ingredientes.length} insumos · {f.pesoObjetivo} KG/LT
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Full Width Container: Selected Formula Details & Components Table */}
      <div className="space-y-4">
        {/* Formula Header Subcard */}
        <div className={`rounded-xl p-5 border flex flex-wrap items-center justify-between gap-4 shadow-sm ${cardBg}`}>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold tracking-widest uppercase ${textTitle}`}>
                FÓRMULA MAESTRA SELECCIONADA
              </span>
              <span className={`rounded px-2 py-0.5 text-[10px] font-bold font-mono uppercase border ${
                isDark ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' : 'bg-teal-50 text-teal-800 border-teal-300'
              }`}>
                {formulaActual.categoria}
              </span>
            </div>
            <h2 className={`text-xl font-bold tracking-tight font-sans ${textValue}`}>
              {formulaActual.nombreProducto}
            </h2>
            <p className={`text-xs font-mono ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {formulaActual.codigoFM} · Lote Base Standard: <span className={`font-bold ${isDark ? 'text-cyan-400' : 'text-teal-700'}`}>{formulaActual.loteActual}</span>
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className={`text-[10px] font-bold tracking-widest uppercase block ${textTitle}`}>
                PESO OBJETIVO FÓRMULA
              </span>
              <span className={`text-2xl font-black ${isDark ? 'text-cyan-400' : 'text-teal-700'}`}>{formulaActual.pesoObjetivo} KG / LT</span>
            </div>

            {/* BOTÓN CREAR PEDIDO COMERCIAL CON ESTA FÓRMULA */}
            <button
              onClick={() => setIsCreatingOrder(true)}
              className={`px-4 py-3 rounded-xl font-black font-sans text-xs tracking-wider uppercase transition-all shadow-lg flex items-center gap-2 ${
                isDark
                  ? 'bg-[#00F2C3] text-[#090C10] hover:opacity-90 shadow-[#00F2C3]/20'
                  : 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-600/20'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Cotizar / Crear Pedido con esta Fórmula</span>
            </button>
          </div>
        </div>

        {/* Ingredients Table Card */}
        <div className={`rounded-xl p-5 border space-y-4 shadow-sm ${cardBg}`}>
          {/* Table Header & Actions */}
          <div className={`flex flex-wrap items-center justify-between gap-2 border-b pb-3 ${isDark ? 'border-[#1A2232]' : 'border-slate-200'}`}>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold tracking-widest uppercase ${textTitle}`}>
                COMPONENTES DE LA FÓRMULA ({formulaActual.ingredientes.length} ITEMS)
              </span>
            </div>
          </div>

          {/* Components Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className={`border-b text-[10px] font-bold tracking-widest uppercase ${isDark ? 'border-[#1A2232] text-slate-400' : 'border-slate-200 text-slate-700 bg-slate-50'}`}>
                  <th className="py-2.5 px-3">SKU</th>
                  <th className="py-2.5 px-3">COMPONENTE QUÍMICO</th>
                  <th className="py-2.5 px-3">TIPO</th>
                  <th className="py-2.5 px-3">% BASE</th>
                  <th className="py-2.5 px-3">PESO TEÓRICO</th>
                  <th className="py-2.5 px-3">STOCK</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-[#1A2232]/60 font-mono' : 'divide-slate-200 font-mono'}`}>
                {formulaActual.ingredientes.map((item) => (
                  <tr key={item.sku} className={`transition-colors ${isDark ? 'hover:bg-[#151D2A]/50' : 'hover:bg-slate-50'}`}>
                    <td className={`py-3 px-3 font-bold ${isDark ? 'text-cyan-400' : 'text-teal-700'}`}>
                      {item.sku}
                    </td>
                    <td className={`py-3 px-3 font-sans font-semibold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                      {item.componente}
                    </td>
                    <td className="py-3 px-3">
                      {item.tipo === 'BASE' ? (
                        <span className={`rounded px-2 py-0.5 text-[10px] font-bold border ${
                          isDark ? 'bg-slate-500/20 text-slate-400 border-slate-500/30' : 'bg-slate-100 text-slate-700 border-slate-300'
                        }`}>
                          FÓRMULA BASE
                        </span>
                      ) : (
                        <span className={`rounded px-2 py-0.5 text-[10px] font-bold border ${
                          isDark ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' : 'bg-teal-50 text-teal-800 border-teal-300'
                        }`}>
                          + ADICIONAL LOTE
                        </span>
                      )}
                    </td>
                    <td className={`py-3 px-3 font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {item.porcentaje > 0 ? `${item.porcentaje.toFixed(1)}%` : 'Ajuste'}
                    </td>
                    <td className={`py-3 px-3 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                      {item.pesoTeorico.toFixed(2)} KG
                    </td>
                    <td className="py-3 px-3">
                      {item.stockStatus === 'OK' && (
                        <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />
                      )}
                      {item.stockStatus === 'BAJO' && (
                        <span className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-bold border ${
                          isDark ? 'bg-amber-500/20 text-amber-500 border-amber-500/30' : 'bg-amber-100 text-amber-900 border-amber-300'
                        }`}>
                          BAJO
                        </span>
                      )}
                      {item.stockStatus === 'CRITICAL' && (
                        <span className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-bold border ${
                          isDark ? 'bg-rose-500/20 text-rose-500 border-rose-500/30' : 'bg-rose-100 text-rose-900 border-rose-300'
                        }`}>
                          CRÍTICO
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
