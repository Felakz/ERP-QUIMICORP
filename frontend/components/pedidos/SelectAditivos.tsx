'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Palette, Plus, X, AlertCircle, Check } from 'lucide-react';
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
  porcentaje: number;
  gramosCalculados?: number;
}

interface SelectAditivosProps {
  cantidadKg: number;
  value: AditivoSeleccionado[];
  onChange: (aditivos: AditivoSeleccionado[]) => void;
  disabled?: boolean;
}

export function SelectAditivos({
  cantidadKg,
  value = [],
  onChange,
  disabled = false,
}: SelectAditivosProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [fraganciasDisponibles, setFraganciasDisponibles] = useState<InsumoAditivo[]>([]);
  const [pigmentosDisponibles, setPigmentosDisponibles] = useState<InsumoAditivo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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

  // Agregar un aditivo seleccionado
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

  // Actualizar porcentaje de un aditivo
  const handleUpdatePorcentaje = (insumoId: string, nuevoPorcentaje: number) => {
    const safePct = Math.max(0.01, Math.min(10, nuevoPorcentaje || 0.1));
    const kg = Number(cantidadKg) || 100;
    const gramos = kg * 1000 * (safePct / 100);

    const updated = value.map((a) =>
      a.insumoId === insumoId
        ? {
            ...a,
            porcentaje: safePct,
            gramosCalculados: Math.round(gramos * 100) / 100,
          }
        : a
    );
    onChange(updated);
  };

  const fraganciasSeleccionadas = value.filter((a) => a.tipo === 'FRAGANCIA');
  const pigmentosSeleccionados = value.filter((a) => a.tipo === 'PIGMENTO');

  const cardBg = isDark ? 'bg-[#151D2A] border-[#1A2232]' : 'bg-slate-50 border-slate-200';
  const textMuted = isDark ? 'text-slate-400' : 'text-slate-500';

  return (
    <div className="space-y-3 font-sans text-xs">
      {/* ── FRAGANCIAS / AROMAS ── */}
      <div className={`p-3 rounded-xl border space-y-2.5 ${cardBg}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-bold text-purple-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-[11px] uppercase tracking-wider">Fragancia / Aroma Industrial</span>
          </div>
          <span className="text-[10px] font-mono text-purple-400/80 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
            Default: 1.00% ({((Number(cantidadKg) || 100) * 10).toFixed(1)} g)
          </span>
        </div>

        {/* Dropdown / Selector rápido de Fragancias */}
        {!disabled && (
          <div className="flex flex-wrap items-center gap-1.5">
            <select
              value=""
              onChange={(e) => {
                const insumo = fraganciasDisponibles.find((f) => f.id === e.target.value);
                if (insumo) handleAddAditivo(insumo);
              }}
              className={`rounded-lg border px-2.5 py-1.5 text-xs font-sans ${
                isDark
                  ? 'bg-[#0B0F17] border-[#1A2232] text-slate-200 focus:border-purple-500'
                  : 'bg-white border-slate-300 text-slate-800'
              }`}
            >
              <option value="">+ Seleccionar Fragancia...</option>
              {fraganciasDisponibles.map((f) => (
                <option key={f.id} value={f.id} disabled={value.some((a) => a.insumoId === f.id)}>
                  {f.nombre} ({f.codigo})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Lista de Fragancias Añadidas con Slider / Input de % */}
        {fraganciasSeleccionadas.length > 0 ? (
          <div className="space-y-2 pt-1">
            {fraganciasSeleccionadas.map((ad) => {
              const gramos = (Number(cantidadKg) || 100) * 1000 * (ad.porcentaje / 100);
              return (
                <div
                  key={ad.insumoId}
                  className={`p-2 rounded-lg border flex flex-wrap items-center justify-between gap-2 ${
                    isDark ? 'bg-[#0B0F17]/80 border-purple-500/30' : 'bg-white border-purple-200'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-100">{ad.nombre}</span>
                      <span className="text-[10px] font-mono text-purple-400">[{ad.codigo}]</span>
                    </div>
                    <div className="text-[10px] font-mono text-slate-400">
                      Masa calculada: <strong className="text-purple-400">{gramos.toFixed(1)} g</strong> en {cantidadKg} KG
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Dosificación:</label>
                      <input
                        type="number"
                        step="0.1"
                        min="0.1"
                        max="5.0"
                        disabled={disabled}
                        value={ad.porcentaje}
                        onChange={(e) => handleUpdatePorcentaje(ad.insumoId, parseFloat(e.target.value) || 0.1)}
                        className={`w-16 rounded border px-1.5 py-0.5 text-center font-mono font-bold text-xs ${
                          isDark ? 'bg-[#151D2A] border-purple-500/40 text-purple-300' : 'bg-slate-50 border-purple-300 text-purple-800'
                        }`}
                      />
                      <span className="font-mono text-purple-400 font-bold">%</span>
                    </div>

                    {!disabled && (
                      <button
                        type="button"
                        onClick={() => handleRemoveAditivo(ad.insumoId)}
                        className="p-1 rounded text-slate-400 hover:text-rose-400 transition-colors"
                        title="Quitar fragancia"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className={`text-[11px] italic ${textMuted}`}>Sin fragancia añadida (Base neutra / sin aroma).</p>
        )}
      </div>

      {/* ── PIGMENTOS / COLORANTES ── */}
      <div className={`p-3 rounded-xl border space-y-2.5 ${cardBg}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-bold text-amber-400">
            <Palette className="w-3.5 h-3.5" />
            <span className="text-[11px] uppercase tracking-wider">Pigmento / Colorante</span>
          </div>
          <span className="text-[10px] font-mono text-amber-400/80 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
            Default: 0.50% ({((Number(cantidadKg) || 100) * 5).toFixed(1)} g)
          </span>
        </div>

        {/* Dropdown / Selector rápido de Pigmentos */}
        {!disabled && (
          <div className="flex flex-wrap items-center gap-1.5">
            <select
              value=""
              onChange={(e) => {
                const insumo = pigmentosDisponibles.find((p) => p.id === e.target.value);
                if (insumo) handleAddAditivo(insumo);
              }}
              className={`rounded-lg border px-2.5 py-1.5 text-xs font-sans ${
                isDark
                  ? 'bg-[#0B0F17] border-[#1A2232] text-slate-200 focus:border-amber-500'
                  : 'bg-white border-slate-300 text-slate-800'
              }`}
            >
              <option value="">+ Seleccionar Pigmento...</option>
              {pigmentosDisponibles.map((p) => (
                <option key={p.id} value={p.id} disabled={value.some((a) => a.insumoId === p.id)}>
                  {p.nombre} ({p.codigo})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Lista de Pigmentos Añadidos con Slider / Input de % */}
        {pigmentosSeleccionados.length > 0 ? (
          <div className="space-y-2 pt-1">
            {pigmentosSeleccionados.map((ad) => {
              const gramos = (Number(cantidadKg) || 100) * 1000 * (ad.porcentaje / 100);
              return (
                <div
                  key={ad.insumoId}
                  className={`p-2 rounded-lg border flex flex-wrap items-center justify-between gap-2 ${
                    isDark ? 'bg-[#0B0F17]/80 border-amber-500/30' : 'bg-white border-amber-200'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-100">{ad.nombre}</span>
                      <span className="text-[10px] font-mono text-amber-400">[{ad.codigo}]</span>
                    </div>
                    <div className="text-[10px] font-mono text-slate-400">
                      Masa calculada: <strong className="text-amber-400">{gramos.toFixed(1)} g</strong> en {cantidadKg} KG
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Dosificación:</label>
                      <input
                        type="number"
                        step="0.05"
                        min="0.05"
                        max="3.0"
                        disabled={disabled}
                        value={ad.porcentaje}
                        onChange={(e) => handleUpdatePorcentaje(ad.insumoId, parseFloat(e.target.value) || 0.1)}
                        className={`w-16 rounded border px-1.5 py-0.5 text-center font-mono font-bold text-xs ${
                          isDark ? 'bg-[#151D2A] border-amber-500/40 text-amber-300' : 'bg-slate-50 border-amber-300 text-amber-800'
                        }`}
                      />
                      <span className="font-mono text-amber-400 font-bold">%</span>
                    </div>

                    {!disabled && (
                      <button
                        type="button"
                        onClick={() => handleRemoveAditivo(ad.insumoId)}
                        className="p-1 rounded text-slate-400 hover:text-rose-400 transition-colors"
                        title="Quitar pigmento"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className={`text-[11px] italic ${textMuted}`}>Sin pigmento añadido (Color natural / transparente).</p>
        )}
      </div>
    </div>
  );
}
