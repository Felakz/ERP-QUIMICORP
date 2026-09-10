'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Beaker,
  Search,
  Scale,
  Lock,
  Sparkles,
  Users,
  Layers,
  ArrowRight,
  Calculator,
  CheckCircle2,
  Tag,
} from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';
import { apiFetch } from '@/lib/apiClient';
import {
  FORMULAS_MAESTRAS_REALES,
  CATEGORIAS_FORMULAS,
  FormulaProducto,
} from '@/lib/formulasData';

interface InsumoDetalleAPI {
  id: string;
  insumoId?: string;
  nombreComponente?: string;
  skuComponente?: string;
  porcentaje: number;
  pesoMasaTeorico: number;
  insumo?: {
    codigo: string;
    nombre: string;
    unidadMedida: string;
    unidadMedidaVisual?: string;
    stockReal: number;
  };
}

interface VarianteClienteAPI {
  id: string;
  nombre: string;
  clienteId?: string;
  cliente?: {
    razonSocial: string;
    ruc: string;
  };
  notas?: string;
  ajustesJson?: any[];
}

interface FormulaMasterAPI {
  id: string;
  codigoFormula: string;
  nombreProducto: string;
  version: number;
  densidadTeorica: number;
  estado: string;
  detalles: InsumoDetalleAPI[];
  variants: VarianteClienteAPI[];
}

let produccionFormulasCache: FormulaMasterAPI[] | null = null;

function FormulasContent() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const searchParams = useSearchParams();

  const [formulasApi, setFormulasApi] = useState<FormulaMasterAPI[]>(() => produccionFormulasCache || []);
  const [loading, setLoading] = useState<boolean>(() => !produccionFormulasCache?.length);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFormulaId, setSelectedFormulaId] = useState<string>(() => produccionFormulasCache?.[0]?.id || '');

  // 🧪 Estado de Variante Activa: null = Receta Base Maestra; string = ID de la Variante de Cliente seleccionada
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);

  // ⚖️ Calculadora de Batch Dinámica para Operarios
  const [batchObjetivoKg, setBatchObjetivoKg] = useState<number>(100);

  // Cargar Fórmulas Maestras y Variantes desde la API
  const fetchFormulas = async (forceLoading = false) => {
    try {
      if (forceLoading || (!produccionFormulasCache && !searchQuery)) {
        setLoading(true);
      }
      const res = await apiFetch<any[]>(`/formulas${searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : ''}`);

      if (res.ok && Array.isArray(res.data) && res.data.length > 0) {
        setFormulasApi(res.data);
        if (!selectedFormulaId) {
          setSelectedFormulaId(res.data[0].id);
        }
        if (!searchQuery) {
          produccionFormulasCache = res.data;
        }
      }
    } catch (e) {
      console.log('Fallback a catalogo local:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFormulas();
  }, [searchQuery]);

  // Seleccin por URL params
  useEffect(() => {
    const codigoParam = searchParams.get('codigo') || searchParams.get('codigoFM');
    const idParam = searchParams.get('id');

    if (codigoParam || idParam) {
      const matchApi = formulasApi.find((f) => f.id === idParam || f.codigoFormula.toLowerCase() === codigoParam?.toLowerCase());
      if (matchApi) {
        setSelectedFormulaId(matchApi.id);
        setSelectedVariantId(null);
      }
    }
  }, [searchParams, formulasApi]);

  // Al cambiar de fórmula seleccionada, resetear la variante activa a null (Receta Base)
  const handleSelectFormula = (id: string) => {
    setSelectedFormulaId(id);
    setSelectedVariantId(null);
  };

  // Mapeo unificado para visualizacin
  const formulasVisual = formulasApi.length > 0
    ? formulasApi.map((f) => ({
        id: f.id,
        codigoFM: f.codigoFormula,
        nombreProducto: f.nombreProducto,
        categoria: 'INDUSTRIAL',
        pesoObjetivo: 100,
        variants: f.variants?.map((v) => ({
          id: v.id,
          clienteNombre: v.cliente?.razonSocial || 'Cliente Exclusivo',
          nombreComercial: v.nombre,
          ingredientes: Array.isArray(v.ajustesJson) && v.ajustesJson.length > 0
            ? v.ajustesJson.map((aj: any) => ({
                sku: aj.sku || 'INS-VAR',
                componente: aj.componente || aj.nombre || 'Insumo de Variante',
                tipo: aj.tipo || 'CLIENTE',
                porcentaje: Number(aj.porcentaje) || 0,
                unidad: 'KG',
              }))
            : f.detalles.map((d: any) => ({
                sku: d.insumo?.codigo || d.skuComponente || 'INS-BOM',
                componente: d.insumo?.nombre || d.nombreComponente || 'Componente Químico',
                tipo: 'BASE',
                porcentaje: Number(d.porcentaje),
                unidad: d.insumo?.unidadMedidaVisual || d.insumo?.unidadMedida || 'KG',
              })),
        })) || [],
        ingredientesBase: f.detalles.map((d: any) => ({
          sku: d.insumo?.codigo || d.skuComponente || 'INS-BOM',
          componente: d.insumo?.nombre || d.nombreComponente || 'Componente Químico',
          tipo: 'BASE',
          porcentaje: Number(d.porcentaje),
          unidad: d.insumo?.unidadMedidaVisual || d.insumo?.unidadMedida || 'KG',
        })),
      }))
    : FORMULAS_MAESTRAS_REALES.map((f) => ({
        id: f.id,
        codigoFM: f.codigoFM,
        nombreProducto: f.nombreProducto,
        categoria: f.categoria,
        pesoObjetivo: f.pesoObjetivo || 100,
        variants: [
          {
            id: `var-${f.id}-1`,
            clienteNombre: 'ALFALION SAC',
            nombreComercial: `${f.nombreProducto} (Lnea Alfalion)`,
            ingredientes: f.ingredientes.map((i) => ({
              sku: i.sku,
              componente: i.componente,
              tipo: i.tipo,
              porcentaje: i.porcentaje,
              unidad: 'KG',
            })),
          },
        ],
        ingredientesBase: f.ingredientes.map((i) => ({
          sku: i.sku,
          componente: i.componente,
          tipo: i.tipo,
          porcentaje: i.porcentaje,
          unidad: 'KG',
        })),
      }));

  const filteredFormulas = formulasVisual.filter((f) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    const matchFormula = f.nombreProducto.toLowerCase().includes(q) || f.codigoFM.toLowerCase().includes(q);
    const matchVariante = f.variants.some(
      (v) => v.nombreComercial.toLowerCase().includes(q) || v.clienteNombre.toLowerCase().includes(q)
    );
    return matchFormula || matchVariante;
  });

  const formulaActual =
    formulasVisual.find((f) => f.id === selectedFormulaId) ||
    filteredFormulas[0] ||
    formulasVisual[0];

  // Determinar si hay una variante de cliente activa seleccionada
  const varianteSeleccionada = formulaActual?.variants.find((v) => v.id === selectedVariantId);

  // Lista de ingredientes a dosificar en balanza: si se seleccion una variante, muestra sus ingredientes; de lo contrario, muestra los de la base
  const ingredientesParaDosificar = varianteSeleccionada
    ? varianteSeleccionada.ingredientes
    : formulaActual?.ingredientesBase || [];

  const cardBg = isDark ? 'bg-[#0F141C] border-[#1A2232]' : 'bg-white border-slate-200 shadow-sm';
  const textTitle = isDark ? 'text-slate-400' : 'text-slate-500';
  const textValue = isDark ? 'text-white' : 'text-slate-900';
  const inputBg = isDark
    ? 'bg-[#151D2A] border-[#1A2232] text-slate-200 placeholder-slate-500'
    : 'bg-slate-50 border-slate-300 text-slate-800 placeholder-slate-400';

  return (
    <div className="space-y-5 font-mono min-h-screen">
      {/* Banner de Modo Solo Lectura / Operarios */}
      <div className={`rounded-xl p-4 border flex flex-wrap items-center justify-between gap-3 ${
        isDark ? 'bg-cyan-950/30 border-cyan-500/30 text-cyan-200' : 'bg-cyan-50 border-cyan-300 text-cyan-950 shadow-sm'
      }`}>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-black font-sans tracking-wide">
              VISTA DE PLANTA & OPERARIOS (SOLO LECTURA)
            </h4>
            <p className="text-[11px] font-sans text-slate-400 mt-0.5">
              Haz clic en la <strong>Receta Base</strong> o en la <strong>Etiqueta de un Cliente</strong> para ver su dosificacin limpia y directa en balanza.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-sans font-bold">
          <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            {formulasVisual.length} Fórmulas Químicas Maestras
          </span>
        </div>
      </div>

      {/* Buscador Universal y Selector Rpido */}
      <div className={`rounded-xl p-5 border space-y-4 ${cardBg}`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Beaker className="h-5 w-5 text-cyan-500" />
            <div>
              <h3 className={`text-xs font-bold tracking-widest uppercase ${textTitle}`}>
                CATLOGO DE FRMULAS QUMICAS & VARIANTES DE MARCA BLANCA
              </h3>
              <p className="text-[11px] text-slate-400 font-sans">
                Busca por nombre químico o por cliente (ej. David Sarmiento, Daniel Espinoza, Jhon Canto, Alfalion)
              </p>
            </div>
          </div>

          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por Fórmula, Alias o Cliente..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full rounded-xl pl-9 pr-4 py-2 text-xs font-sans border focus:border-[#00F2C3] focus:outline-none transition-all ${inputBg}`}
            />
          </div>
        </div>

        {/* Formula Cards Quick Selector Grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 max-h-56 overflow-y-auto pr-1">
          {filteredFormulas.map((f) => {
            const isSelected = f.id === formulaActual?.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => handleSelectFormula(f.id)}
                className={`rounded-xl p-3.5 text-left transition-all border space-y-2 ${
                  isSelected
                    ? isDark
                      ? 'bg-[#151D2A] border-[#00F2C3] ring-1 ring-[#00F2C3]/30 shadow-lg'
                      : 'bg-cyan-50/70 border-cyan-500 ring-1 ring-cyan-500/20 shadow-md'
                    : isDark
                    ? 'bg-[#0B0F17] border-[#1A2232] hover:bg-[#151D2A]/60'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-mono font-bold text-cyan-400">{f.codigoFM}</span>
                  <span className="px-1.5 py-0.5 rounded font-bold uppercase text-[9px] bg-slate-800 text-slate-300 border border-slate-700">
                    {f.ingredientesBase.length} Insumos Base
                  </span>
                </div>
                <h4 className={`text-xs font-bold font-sans truncate ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                  {f.nombreProducto}
                </h4>

                {/* Variantes comerciales asociadas */}
                {f.variants.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-slate-800/60">
                    <Users className="w-3 h-3 text-purple-400 shrink-0" />
                    <span className="text-[10px] text-purple-300 font-sans truncate">
                      {f.variants.map((v) => `${v.clienteNombre}: "${v.nombreComercial}"`).join(' • ')}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {formulaActual && (
        <div className="space-y-4">
          {/* Header Card de la Fórmula Seleccionada y Calculadora de Batch */}
          <div className={`rounded-xl p-5 border flex flex-wrap items-center justify-between gap-6 ${cardBg}`}>
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  {formulaActual.codigoFM}
                </span>
                <span className="text-[11px] font-bold text-slate-400 font-sans">
                  RECETA QUMICA MAESTRA
                </span>
              </div>

              <h2 className={`text-xl font-bold font-sans tracking-tight ${textValue}`}>
                {formulaActual.nombreProducto}
              </h2>

              {/* SELECTOR INTERACTIVO DE VARIANTES DE CLIENTES */}
              <div className="space-y-1.5 pt-1 font-sans">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  ?? Selecciona la receta a preparar en balanza:
                </span>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Botn 1: Receta Base Estándar */}
                  <button
                    type="button"
                    onClick={() => setSelectedVariantId(null)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all shadow-sm ${
                      selectedVariantId === null
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-cyan-500/20 font-black'
                        : isDark
                        ? 'bg-[#151D2A] text-slate-300 border-slate-700 hover:border-slate-500'
                        : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    <Beaker className="w-3.5 h-3.5" />
                    <span>?? Receta Química Base ({formulaActual.ingredientesBase.length} Insumos)</span>
                  </button>

                  {/* Botones de Variantes de Clientes */}
                  {formulaActual.variants.map((v) => {
                    const isVariantActive = selectedVariantId === v.id;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedVariantId(v.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all shadow-sm ${
                          isVariantActive
                            ? 'bg-purple-600 text-white border-purple-400 shadow-purple-600/30 ring-2 ring-purple-400/40 font-black scale-[1.02]'
                            : isDark
                            ? 'bg-purple-950/40 border-purple-500/40 text-purple-300 hover:bg-purple-900/60 hover:border-purple-400'
                            : 'bg-purple-50 border-purple-300 text-purple-900 hover:bg-purple-100'
                        }`}
                      >
                        <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                        <span>
                          <strong>{v.clienteNombre}:</strong> &quot;{v.nombreComercial}&quot; ({v.ingredientes.length} insumos)
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Calculadora de Batch Escalar (Kilogramos y Gramos con soporte de decimales ej. 0.250 kg = 250 g) */}
            <div className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
              isDark ? 'bg-[#151D2A] border-[#1A2232]' : 'bg-slate-50 border-slate-300'
            }`}>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-[#00F2C3]/10 border border-[#00F2C3]/30 text-[#00F2C3] shrink-0">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold tracking-widest uppercase block text-slate-400 font-sans">
                    ⚖️ BATCH A FABRICAR (KG / GRAMOS)
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="number"
                      min="0.001"
                      step="0.001"
                      value={batchObjetivoKg}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setBatchObjetivoKg(isNaN(val) ? 0 : Math.max(0.001, val));
                      }}
                      className="w-32 px-3 py-1.5 rounded-lg bg-black/40 border border-cyan-500/40 text-lg font-black text-[#00F2C3] font-mono text-center focus:outline-none focus:border-[#00F2C3]"
                    />
                    <span className="text-xs font-bold text-slate-400 font-sans">KG</span>
                    <span className="text-xs font-bold text-purple-400 font-mono">
                      = {(batchObjetivoKg * 1000).toLocaleString('es-PE', { maximumFractionDigits: 2 })} Gramos
                    </span>
                  </div>
                </div>
              </div>

              {/* Botones de Selección Rápida de Balanza (Muestras de Lab & Lotes Industriales) */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block w-full md:w-auto font-sans mr-1">
                  Presets:
                </span>
                {[
                  { label: '250 g', kg: 0.25 },
                  { label: '500 g', kg: 0.5 },
                  { label: '1 kg', kg: 1 },
                  { label: '5 kg', kg: 5 },
                  { label: '20 kg', kg: 20 },
                  { label: '100 kg', kg: 100 },
                  { label: '500 kg', kg: 500 },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setBatchObjetivoKg(preset.kg)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border transition-all ${
                      batchObjetivoKg === preset.kg
                        ? 'bg-[#00F2C3] text-slate-950 border-[#00F2C3] font-black shadow-md shadow-[#00F2C3]/20'
                        : isDark
                        ? 'bg-slate-900/80 text-slate-300 border-slate-700 hover:border-cyan-500/50 hover:text-cyan-300'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tabla de Balanza de Componentes */}
          <div className={`rounded-xl p-5 border space-y-3 ${cardBg}`}>
            <div className={`flex flex-wrap items-center justify-between gap-2 border-b pb-3 ${isDark ? 'border-[#1A2232]' : 'border-slate-200'}`}>
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-cyan-400" />
                <span className={`text-xs font-bold tracking-widest uppercase font-sans ${textTitle}`}>
                  {varianteSeleccionada ? (
                    <span className="text-purple-300 font-bold">
                      DOSIFICACIÓN DE BALANZA PARA CLIENTE [{varianteSeleccionada.clienteNombre}] ({ingredientesParaDosificar.length} INSUMOS)
                    </span>
                  ) : (
                    <span>
                      DOSIFICACIÓN DE BALANZA PARA RECETA BASE ({ingredientesParaDosificar.length} INSUMOS)
                    </span>
                  )}
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400">
                Suma Porcentual: {ingredientesParaDosificar.reduce((acc, i) => acc + Number(i.porcentaje), 0).toFixed(2)}%
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className={`border-b text-[10px] font-bold tracking-widest uppercase ${isDark ? 'border-[#1A2232] text-slate-400' : 'border-slate-200 text-slate-500'}`}>
                    <th className="py-3 px-3">SKU</th>
                    <th className="py-3 px-3">COMPONENTE QUÍMICO</th>
                    <th className="py-3 px-3 text-right">PROPORCIÓN (%)</th>
                    <th className="py-3 px-3 text-right text-cyan-400">PESO A PESAR (KG)</th>
                    <th className="py-3 px-3 text-right text-purple-400">PESO EN GRAMOS (GR)</th>
                    <th className="py-3 px-3 text-center">ORIGEN</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? 'divide-[#1A2232]/60' : 'divide-slate-200'}`}>
                  {ingredientesParaDosificar.map((item, idx) => {
                    const pesoCalculadoKg = (Number(item.porcentaje) / 100) * batchObjetivoKg;
                    const pesoCalculadoGr = pesoCalculadoKg * 1000;

                    return (
                      <tr key={`${item.sku}-${idx}`} className={`transition-colors ${isDark ? 'hover:bg-[#151D2A]/50' : 'hover:bg-slate-50'}`}>
                        <td className="py-3.5 px-3 font-bold text-cyan-400">
                          {item.sku}
                        </td>
                        <td className={`py-3.5 px-3 font-sans font-bold uppercase text-xs ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                          {item.componente}
                        </td>
                        <td className="py-3.5 px-3 text-right font-bold text-slate-300">
                          {Number(item.porcentaje).toFixed(2)} %
                        </td>
                        <td className="py-3.5 px-3 text-right font-black text-sm text-[#00F2C3]">
                          {pesoCalculadoKg < 0.01 ? pesoCalculadoKg.toFixed(4) : pesoCalculadoKg.toFixed(3)} KG
                        </td>
                        <td className="py-3.5 px-3 text-right font-bold text-xs text-purple-300">
                          {pesoCalculadoGr.toLocaleString('es-PE', { minimumFractionDigits: 1, maximumFractionDigits: 2 })} GR
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          {varianteSeleccionada ? (
                            <span className="rounded px-2 py-0.5 text-[9px] font-bold uppercase bg-purple-950/60 text-purple-300 border border-purple-500/40">
                              {varianteSeleccionada.clienteNombre}
                            </span>
                          ) : (
                            <span className="rounded px-2 py-0.5 text-[9px] font-bold uppercase bg-slate-800 text-slate-300 border border-slate-700">
                              BASE
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className={`font-bold border-t ${isDark ? 'bg-[#151D2A] text-cyan-300' : 'bg-cyan-50 text-cyan-950'}`}>
                    <td colSpan={2} className="py-3 px-3 uppercase text-xs">
                      TOTAL BATCH A FABRICAR:
                    </td>
                    <td className="py-3 px-3 text-right text-emerald-400 font-black">
                      100.00 %
                    </td>
                    <td className="py-3 px-3 text-right text-sm font-black text-[#00F2C3]">
                      {batchObjetivoKg.toFixed(3)} KG
                    </td>
                    <td className="py-3 px-3 text-right font-black text-purple-300">
                      {(batchObjetivoKg * 1000).toLocaleString('es-PE', { maximumFractionDigits: 2 })} GR
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function FormulasPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400 font-mono text-xs">Cargando catálogo de fórmulas...</div>}>
      <FormulasContent />
    </Suspense>
  );
}
