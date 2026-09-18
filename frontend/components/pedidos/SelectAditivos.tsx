'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Palette, X, Search, Check } from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';
import { apiFetch } from '@/lib/apiClient';

export interface InsumoAditivo {
  id: string;
  codigo: string;
  nombre: string;
  tipo: 'FRAGANCIA' | 'PIGMENTO';
  costoUnitario?: number;
  stockReal?: number;
}

export interface AditivoSeleccionado {
  insumoId: string;
  nombre: string;
  codigo: string;
  tipo: 'FRAGANCIA' | 'PIGMENTO';
  porcentaje?: number;
  gramosCalculados?: number;
}

interface SelectAditivosProps {
  cantidadKg?: number;
  value: AditivoSeleccionado[];
  onChange: (aditivos: AditivoSeleccionado[]) => void;
  disabled?: boolean;
}

export function SelectAditivos({
  cantidadKg = 100,
  value = [],
  onChange,
  disabled = false,
}: SelectAditivosProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [fraganciasDisponibles, setFraganciasDisponibles] = useState<InsumoAditivo[]>([]);
  const [pigmentosDisponibles, setPigmentosDisponibles] = useState<InsumoAditivo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Estados para búsqueda de fragancias y pigmentos
  const [searchFragancia, setSearchFragancia] = useState('');
  const [showFraganciaDropdown, setShowFraganciaDropdown] = useState(false);

  const [searchPigmento, setSearchPigmento] = useState('');
  const [showPigmentoDropdown, setShowPigmentoDropdown] = useState(false);

  // Cargar catálogo de fragancias y pigmentos desde la API
  useEffect(() => {
    let isMounted = true;
    const fetchAditivos = async () => {
      setLoading(true);
      try {
        const [resFrag, resPigm] = await Promise.all([
          apiFetch<InsumoAditivo[]>('/insumos?tipo=FRAGANCIA'),
          apiFetch<InsumoAditivo[]>('/insumos?tipo=PIGMENTO'),
        ]);

        if (isMounted) {
          if (resFrag.ok && resFrag.data) {
            setFraganciasDisponibles(resFrag.data);
          }
          if (resPigm.ok && resPigm.data) {
            setPigmentosDisponibles(resPigm.data);
          }
        }
      } catch (err) {
        console.error('Error cargando aditivos:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAditivos();
    return () => {
      isMounted = false;
    };
  }, []);

  // Agregar un aditivo seleccionado (la dosificación se maneja internamente)
  const handleAddAditivo = (insumo: InsumoAditivo) => {
    if (value.some((a) => a.insumoId === insumo.id)) return;

    const defaultPct = insumo.tipo === 'FRAGANCIA' ? 1.0 : 0.5;
    const gramos = (Number(cantidadKg) || 100) * 1000 * (defaultPct / 100);

    const nuevo: AditivoSeleccionado = {
      insumoId: insumo.id,
      nombre: insumo.nombre,
      codigo: insumo.codigo,
      tipo: insumo.tipo,
      porcentaje: defaultPct,
      gramosCalculados: Math.round(gramos * 100) / 100,
    };

    onChange([...value, nuevo]);
  };

  // Remover aditivo
  const handleRemoveAditivo = (insumoId: string) => {
    onChange(value.filter((a) => a.insumoId !== insumoId));
  };

  const fraganciasSeleccionadas = value.filter((a) => a.tipo === 'FRAGANCIA');
  const pigmentosSeleccionados = value.filter((a) => a.tipo === 'PIGMENTO');

  const cardBg = isDark ? 'bg-[#151D2A] border-[#1A2232]' : 'bg-slate-50 border-slate-200';
  const textMuted = isDark ? 'text-slate-400' : 'text-slate-500';

  // Filtros de búsqueda
  const filteredFragancias = fraganciasDisponibles.filter((f) => {
    if (!searchFragancia.trim()) return true;
    const q = searchFragancia.toLowerCase().trim();
    return f.nombre.toLowerCase().includes(q) || f.codigo.toLowerCase().includes(q);
  });

  const filteredPigmentos = pigmentosDisponibles.filter((p) => {
    if (!searchPigmento.trim()) return true;
    const q = searchPigmento.toLowerCase().trim();
    return p.nombre.toLowerCase().includes(q) || p.codigo.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-3 font-sans text-xs">
      {/* ── FRAGANCIAS / AROMAS ── */}
      <div className={`p-3 rounded-xl border space-y-2.5 ${cardBg}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-bold text-purple-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-[11px] uppercase tracking-wider">Fragancia / Aroma Industrial</span>
          </div>
          {fraganciasSeleccionadas.length > 0 && (
            <span className="text-[10px] font-mono text-purple-400 font-bold bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
              {fraganciasSeleccionadas.length} seleccionada{fraganciasSeleccionadas.length > 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Buscador de Fragancias */}
        {!disabled && (
          <div className="relative">
            <div className="relative">
              <input
                type="text"
                value={searchFragancia}
                onFocus={() => setShowFraganciaDropdown(true)}
                onBlur={() => setTimeout(() => setShowFraganciaDropdown(false), 250)}
                onChange={(e) => {
                  setSearchFragancia(e.target.value);
                  setShowFraganciaDropdown(true);
                }}
                placeholder="🔍 Escriba para buscar fragancia por nombre o código..."
                className={`w-full rounded-xl border p-2 text-xs font-medium pl-8 transition-colors ${
                  isDark
                    ? 'bg-[#0B0F17] border-[#1A2232] text-slate-200 placeholder-slate-500 focus:border-purple-500'
                    : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-purple-600'
                }`}
              />
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-purple-400 pointer-events-none" />
              {searchFragancia && (
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setSearchFragancia('');
                    setShowFraganciaDropdown(true);
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs p-1"
                >
                  ✕
                </button>
              )}
            </div>

            {showFraganciaDropdown && (
              <div
                className={`absolute left-0 right-0 top-full mt-1 z-30 max-h-48 overflow-y-auto rounded-xl border shadow-xl ${
                  isDark ? 'bg-[#0F141C] border-purple-500/30' : 'bg-white border-purple-200'
                }`}
              >
                {filteredFragancias.length === 0 ? (
                  <div className="px-3 py-2 text-[11px] text-slate-400 italic text-center">
                    No se encontraron fragancias con "{searchFragancia}".
                  </div>
                ) : (
                  filteredFragancias.map((f) => {
                    const isSelected = value.some((a) => a.insumoId === f.id);
                    return (
                      <button
                        key={f.id}
                        type="button"
                        disabled={isSelected}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleAddAditivo(f);
                          setSearchFragancia('');
                          setShowFraganciaDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs transition-colors flex items-center justify-between border-b last:border-b-0 ${
                          isSelected
                            ? 'opacity-40 cursor-not-allowed bg-slate-900/40 text-slate-500'
                            : isDark
                            ? 'hover:bg-purple-950/40 border-slate-800 text-slate-200 cursor-pointer'
                            : 'hover:bg-purple-50 border-slate-100 text-slate-800 cursor-pointer'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{f.nombre}</span>
                          <span className="text-[10px] font-mono text-purple-400">[{f.codigo}]</span>
                        </div>
                        {isSelected ? (
                          <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                            <Check className="w-3 h-3" /> Añadida
                          </span>
                        ) : (
                          <span className="text-[10px] text-purple-400 font-bold hover:underline">
                            + Seleccionar
                          </span>
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            )}
          </div>
        )}

        {/* Lista de Fragancias Añadidas (Sin Dosificación ni Masa) */}
        {fraganciasSeleccionadas.length > 0 ? (
          <div className="space-y-1.5 pt-1">
            {fraganciasSeleccionadas.map((ad) => (
              <div
                key={ad.insumoId}
                className={`px-3 py-2 rounded-xl border flex items-center justify-between gap-2 ${
                  isDark ? 'bg-[#0B0F17]/90 border-purple-500/40 shadow-sm' : 'bg-white border-purple-200 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`font-bold text-xs ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                    {ad.nombre}
                  </span>
                  <span className={`text-[10px] font-mono font-bold ${isDark ? 'text-purple-400' : 'text-purple-700'}`}>
                    [{ad.codigo}]
                  </span>
                  <span className="text-[9px] font-semibold text-purple-400/90 bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/20">
                    Fragancia seleccionada
                  </span>
                </div>

                {!disabled && (
                  <button
                    type="button"
                    onClick={() => handleRemoveAditivo(ad.insumoId)}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Quitar fragancia"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className={`text-[11px] italic ${textMuted}`}>Sin fragancia añadida (Base neutra / sin aroma).</p>
        )}
      </div>

      {/* ── PIGMENTOS / COLORANTES ── */}
      <div className={`p-3 rounded-xl border space-y-2.5 ${cardBg}`}>
        <div className="flex items-center justify-between">
          <div className={`flex items-center gap-1.5 font-bold ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>
            <Palette className="w-3.5 h-3.5" />
            <span className="text-[11px] uppercase tracking-wider">Pigmento / Colorante</span>
          </div>
          {pigmentosSeleccionados.length > 0 && (
            <span className="text-[10px] font-mono text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              {pigmentosSeleccionados.length} seleccionado{pigmentosSeleccionados.length > 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Buscador de Pigmentos */}
        {!disabled && (
          <div className="relative">
            <div className="relative">
              <input
                type="text"
                value={searchPigmento}
                onFocus={() => setShowPigmentoDropdown(true)}
                onBlur={() => setTimeout(() => setShowPigmentoDropdown(false), 250)}
                onChange={(e) => {
                  setSearchPigmento(e.target.value);
                  setShowPigmentoDropdown(true);
                }}
                placeholder="🔍 Escriba para buscar pigmento por nombre o código..."
                className={`w-full rounded-xl border p-2 text-xs font-medium pl-8 transition-colors ${
                  isDark
                    ? 'bg-[#0B0F17] border-[#1A2232] text-slate-200 placeholder-slate-500 focus:border-amber-500'
                    : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-amber-600'
                }`}
              />
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-amber-400 pointer-events-none" />
              {searchPigmento && (
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setSearchPigmento('');
                    setShowPigmentoDropdown(true);
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs p-1"
                >
                  ✕
                </button>
              )}
            </div>

            {showPigmentoDropdown && (
              <div
                className={`absolute left-0 right-0 top-full mt-1 z-30 max-h-48 overflow-y-auto rounded-xl border shadow-xl ${
                  isDark ? 'bg-[#0F141C] border-amber-500/30' : 'bg-white border-amber-200'
                }`}
              >
                {filteredPigmentos.length === 0 ? (
                  <div className="px-3 py-2 text-[11px] text-slate-400 italic text-center">
                    No se encontraron pigmentos con "{searchPigmento}".
                  </div>
                ) : (
                  filteredPigmentos.map((p) => {
                    const isSelected = value.some((a) => a.insumoId === p.id);
                    return (
                      <button
                        key={p.id}
                        type="button"
                        disabled={isSelected}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleAddAditivo(p);
                          setSearchPigmento('');
                          setShowPigmentoDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs transition-colors flex items-center justify-between border-b last:border-b-0 ${
                          isSelected
                            ? 'opacity-40 cursor-not-allowed bg-slate-900/40 text-slate-500'
                            : isDark
                            ? 'hover:bg-amber-950/40 border-slate-800 text-slate-200 cursor-pointer'
                            : 'hover:bg-amber-50 border-slate-100 text-slate-800 cursor-pointer'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{p.nombre}</span>
                          <span className="text-[10px] font-mono text-amber-400">[{p.codigo}]</span>
                        </div>
                        {isSelected ? (
                          <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                            <Check className="w-3 h-3" /> Añadido
                          </span>
                        ) : (
                          <span className="text-[10px] text-amber-400 font-bold hover:underline">
                            + Seleccionar
                          </span>
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            )}
          </div>
        )}

        {/* Lista de Pigmentos Añadidos (Sin Dosificación ni Masa) */}
        {pigmentosSeleccionados.length > 0 ? (
          <div className="space-y-1.5 pt-1">
            {pigmentosSeleccionados.map((ad) => (
              <div
                key={ad.insumoId}
                className={`px-3 py-2 rounded-xl border flex items-center justify-between gap-2 ${
                  isDark ? 'bg-[#0B0F17]/90 border-amber-500/40 shadow-sm' : 'bg-white border-amber-200 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`font-bold text-xs ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{ad.nombre}</span>
                  <span className={`text-[10px] font-mono font-bold ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>[{ad.codigo}]</span>
                  <span className="text-[9px] font-semibold text-amber-400/90 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                    Pigmento seleccionado
                  </span>
                </div>

                {!disabled && (
                  <button
                    type="button"
                    onClick={() => handleRemoveAditivo(ad.insumoId)}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Quitar pigmento"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className={`text-[11px] italic ${textMuted}`}>Sin pigmento añadido (Color natural / transparente).</p>
        )}
      </div>
    </div>
  );
}
