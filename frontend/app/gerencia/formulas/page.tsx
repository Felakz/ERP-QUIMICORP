'use client';

import React, { useState, useEffect } from 'react';
import {
  FlaskConical,
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  ListOrdered,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Clock,
  Package,
} from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';
import { apiFetch } from '@/lib/apiClient';

interface PasoElaboracion {
  titulo: string;
  descripcion: string;
  tiempo: string;
  insumos: string;
  cantidades: string;
}

interface VarianteAPI {
  id: string;
  nombre: string;
  cliente?: { razonSocial?: string; nombre?: string } | null;
  pasosElaboracion?: PasoElaboracion[] | null;
}

interface FormulaAPI {
  id: string;
  codigoFormula: string;
  nombreProducto: string;
  version: number;
  densidadTeorica: number;
  estado: string;
  pasosElaboracion: PasoElaboracion[] | string[] | null;
  detalles: Array<{
    id: string;
    insumoId: string | null;
    nombreComponente: string | null;
    porcentaje: number;
    insumo?: { codigo: string; nombre: string } | null;
  }>;
  variants?: VarianteAPI[];
}

const pasoVacio = (): PasoElaboracion => ({
  titulo: '',
  descripcion: '',
  tiempo: '',
  insumos: '',
  cantidades: '',
});

function normalizarPasos(pasos: PasoElaboracion[] | string[] | null | undefined): PasoElaboracion[] {
  if (!Array.isArray(pasos)) return [];
  return pasos.map((p) => {
    if (typeof p === 'string') {
      return { titulo: p, descripcion: '', tiempo: '', insumos: '', cantidades: '' };
    }
    return {
      titulo: p.titulo || '',
      descripcion: p.descripcion || '',
      tiempo: p.tiempo || '',
      insumos: p.insumos || '',
      cantidades: p.cantidades || '',
    };
  });
}

export default function GerenciaFormulasPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [formulas, setFormulas] = useState<FormulaAPI[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [editandoVariante, setEditandoVariante] = useState<VarianteAPI | null>(null);

  const [editNombre, setEditNombre] = useState<string>('');
  const [editIngredientes, setEditIngredientes] = useState<Array<{ componente: string; porcentaje: number }>>([]);
  const [editPasos, setEditPasos] = useState<PasoElaboracion[]>([]);
  const [editGuardando, setEditGuardando] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const cardBg = isDark ? 'bg-[#0F141C] border-[#1A2232]' : 'bg-white border-slate-200';
  const textValue = isDark ? 'text-slate-100' : 'text-slate-900';
  const inputBg = isDark
    ? 'border-slate-700 bg-slate-900 text-slate-200'
    : 'border-slate-300 bg-white text-slate-900';

  const fetchFormulas = async () => {
    try {
      setLoading(true);
      const res = await apiFetch<FormulaAPI[]>('/formulas');
      if (res.ok && Array.isArray(res.data)) {
        setFormulas(res.data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFormulas();
  }, []);

  const openEdit = (f: FormulaAPI) => {
    setErrorMsg('');
    setEditNombre(f.nombreProducto);
    setEditIngredientes(
      (f.detalles || []).map((d) => ({
        componente: d.nombreComponente || d.insumo?.nombre || '',
        porcentaje: Number(d.porcentaje) || 0,
      }))
    );
    setEditPasos(normalizarPasos(f.pasosElaboracion));
    setSelectedId(f.id);
    setEditandoVariante(null);
    setModalOpen(true);
  };

  const openEditVariante = (v: VarianteAPI) => {
    setErrorMsg('');
    setEditNombre(v.nombre || 'Variante sin nombre');
    setEditIngredientes([]);
    setEditPasos(normalizarPasos(v.pasosElaboracion));
    setSelectedId(null);
    setEditandoVariante(v);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const pasos = editPasos
      .map((p) => ({ ...p, titulo: (p.titulo || '').trim() }))
      .filter((p) => p.titulo);

    // Si estamos editando una variante, guardamos solo sus pasos (estructura rica)
    if (editandoVariante) {
      setEditGuardando(true);
      try {
        const res = await apiFetch(`/formulas/variants/${editandoVariante?.id}`, {
          method: 'PUT',
          body: JSON.stringify({ pasosElaboracion: pasos }),
        });
        if (res.ok) {
          setModalOpen(false);
          await fetchFormulas();
        } else {
          setErrorMsg(res.error || 'El servidor rechazó el cambio.');
        }
      } catch {
        setErrorMsg('Error de conexión al guardar cambios.');
      } finally {
        setEditGuardando(false);
      }
      return;
    }

    // Si no hay variante, guardamos la fórmula maestra (nombre + ingredientes + pasos)
    if (!selectedId) return;
    const payload = {
      nombreProducto: editNombre,
      detalles: editIngredientes.map((i) => ({
        nombreComponente: i.componente,
        porcentaje: Number(i.porcentaje) || 0,
      })),
      pasosElaboracion: pasos,
    };

    setEditGuardando(true);
    try {
      const res = await apiFetch(`/formulas/${selectedId}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setModalOpen(false);
        await fetchFormulas();
      } else {
        setErrorMsg(res.error || 'El servidor rechazó el cambio.');
      }
    } catch {
      setErrorMsg('Error de conexión al guardar cambios.');
    } finally {
      setEditGuardando(false);
    }
  };

  const filtered = formulas.filter(
    (f) =>
      f.nombreProducto?.toLowerCase().includes(search.toLowerCase()) ||
      f.codigoFormula?.toLowerCase().includes(search.toLowerCase())
  );

  const toggleExpand = (id: string) => setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  const campoPaso = (
    idx: number,
    campo: keyof PasoElaboracion,
    valor: string
  ) => {
    const updated = [...editPasos];
    updated[idx] = { ...updated[idx], [campo]: valor };
    setEditPasos(updated);
  };

  return (
    <div className="space-y-5 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className={`text-lg font-black tracking-tight ${textValue}`}>
            Fórmulas y Pasos de Elaboración
          </h1>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Edición directa de fórmulas (solo Gerencia) y pasos de elaboración por variante de cliente.
          </p>
        </div>
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar fórmula..."
            className={`w-64 pl-9 pr-3 py-2 rounded-xl border text-xs font-medium focus:outline-none focus:border-amber-500 ${inputBg}`}
          />
        </div>
      </div>

      {loading ? (
        <div className={`rounded-2xl border p-8 text-center text-xs ${cardBg} ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Cargando fórmulas...
        </div>
      ) : filtered.length === 0 ? (
        <div className={`rounded-2xl border p-8 text-center text-xs ${cardBg} ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          No hay fórmulas disponibles.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((f) => {
            const variants = f.variants || [];
            const isExp = expanded[f.id];
            return (
              <div key={f.id} className={`rounded-2xl border p-5 shadow-sm ${cardBg}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className={`text-[10px] font-mono font-bold uppercase tracking-widest ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                      {f.codigoFormula}
                    </p>
                    <h3 className={`text-sm font-bold mt-1 truncate ${textValue}`}>{f.nombreProducto}</h3>
                  </div>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-500 border border-amber-500/30">
                    <FlaskConical className="h-5 w-5" />
                  </div>
                </div>

                <div className={`mt-4 grid grid-cols-3 gap-2 text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  <div className={`rounded-lg p-2 border ${isDark ? 'border-slate-800 bg-[#0B0F17]' : 'border-slate-100 bg-slate-50'}`}>
                    <p className="uppercase text-[9px] font-bold opacity-60">Componentes</p>
                    <p className="font-bold mt-0.5">{(f.detalles || []).length} insumos</p>
                  </div>
                  <div className={`rounded-lg p-2 border ${isDark ? 'border-slate-800 bg-[#0B0F17]' : 'border-slate-100 bg-slate-50'}`}>
                    <p className="uppercase text-[9px] font-bold opacity-60">Pasos</p>
                    <p className="font-bold mt-0.5">{normalizarPasos(f.pasosElaboracion).length} pasos</p>
                  </div>
                  <div className={`rounded-lg p-2 border ${isDark ? 'border-slate-800 bg-[#0B0F17]' : 'border-slate-100 bg-slate-50'}`}>
                    <p className="uppercase text-[9px] font-bold opacity-60">Variantes</p>
                    <p className="font-bold mt-0.5">{variants.length} clientes</p>
                  </div>
                </div>

                {variants.length > 0 && (
                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={() => toggleExpand(f.id)}
                      className="flex w-full items-center justify-between rounded-lg border px-3 py-1.5 text-[11px] font-bold transition-colors"
                    >
                      <span>Pasos de elaboración por variante</span>
                      {isExp ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>
                    {isExp && (
                      <div className="mt-2 space-y-1.5">
                        {variants.map((v) => (
                          <div key={v.id} className={`flex items-center justify-between gap-2 rounded-lg border px-3 py-2 ${isDark ? 'border-slate-800 bg-[#0B0F17]' : 'border-slate-100 bg-slate-50'}`}>
                            <div className="min-w-0">
                              <p className={`truncate text-[11px] font-bold ${textValue}`}>{v.nombre}</p>
                              <p className={`truncate text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                {v.cliente?.razonSocial || v.cliente?.nombre || 'Sin cliente'} • {normalizarPasos(v.pasosElaboracion).length} pasos
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => openEditVariante(v)}
                              className={`shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[10px] font-bold transition-colors ${
                                isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                              }`}
                            >
                              <Pencil className="w-3 h-3" />
                              Editar
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <button
                  onClick={() => openEdit(f)}
                  className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/20 transition-all active:scale-95"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Editar Fórmula Maestra y Pasos
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL EDICIÓN */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
          <div className={`w-full max-w-2xl rounded-2xl border p-6 space-y-4 shadow-2xl ${cardBg} my-8`}>
            <div className={`flex items-center justify-between border-b pb-3 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
              <div className="flex items-center gap-2">
                <Pencil className="w-5 h-5 text-amber-500" />
                <h3 className={`text-sm font-bold ${textValue}`}>
                  {editandoVariante
                    ? `Pasos de Elaboración — Variante: ${editandoVariante.nombre}`
                    : 'Editar Fórmula y Pasos de Elaboración'}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className={`p-1 rounded-lg transition-colors ${
                  isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold ${
                isDark ? 'bg-rose-500/10 border-rose-500/30 text-rose-300' : 'bg-rose-50 border-rose-200 text-rose-700'
              }`}>
                <AlertTriangle className="w-4 h-4 shrink-0" />
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
              {!editandoVariante && (
                <>
                  <div>
                    <label className={`block text-[11px] font-bold uppercase mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      Nombre del Producto / Fórmula *
                    </label>
                    <input
                      type="text"
                      required
                      value={editNombre}
                      onChange={(e) => setEditNombre(e.target.value)}
                      className={`w-full rounded-xl border p-2.5 text-xs focus:border-amber-500 focus:outline-none ${inputBg}`}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className={`block text-[11px] font-bold uppercase ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        Componentes Químicos e Insumos (%):
                      </label>
                      <button
                        type="button"
                        onClick={() => setEditIngredientes([...editIngredientes, { componente: 'NUEVO INSUMO', porcentaje: 1.0 }])}
                        className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-300 border border-amber-500/30 text-[10px] font-bold hover:bg-amber-500/20 flex items-center gap-1 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                        <span>+ Agregar Insumo</span>
                      </button>
                    </div>

                    <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
                      {editIngredientes.map((ing, idx) => (
                        <div key={idx} className={`flex items-center gap-2 p-2 rounded-xl border ${
                          isDark ? 'border-slate-800 bg-[#0F141C]' : 'border-slate-200 bg-slate-50'
                        }`}>
                          <input
                            type="text"
                            required
                            value={ing.componente}
                            onChange={(e) => {
                              const updated = [...editIngredientes];
                              updated[idx].componente = e.target.value;
                              setEditIngredientes(updated);
                            }}
                            className={`flex-1 rounded-lg border px-2.5 py-1 text-xs focus:outline-none ${
                              isDark ? 'border-slate-700 bg-slate-900 text-slate-200' : 'border-slate-300 bg-white text-slate-900'
                            }`}
                            placeholder="Nombre de insumo"
                          />
                          <div className="flex items-center gap-1 w-28">
                            <input
                              type="number"
                              step="0.001"
                              required
                              value={ing.porcentaje}
                              onChange={(e) => {
                                const updated = [...editIngredientes];
                                updated[idx].porcentaje = parseFloat(e.target.value) || 0;
                                setEditIngredientes(updated);
                              }}
                              className={`w-20 rounded-lg border px-2 py-1 text-xs text-right font-bold focus:outline-none ${
                                isDark ? 'border-slate-700 bg-slate-900 text-amber-300' : 'border-slate-300 bg-white text-amber-600'
                              }`}
                            />
                            <span className={`text-[11px] font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>%</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setEditIngredientes(editIngredientes.filter((_, i) => i !== idx))}
                            className="p-1 rounded text-rose-500 hover:bg-rose-500/20 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className={`flex items-center gap-1.5 text-[11px] font-bold uppercase ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    <ListOrdered className="w-4 h-4 text-amber-500" />
                    Pasos del Proceso de Elaboración:
                  </label>
                  <button
                    type="button"
                    onClick={() => setEditPasos([...editPasos, pasoVacio()])}
                    className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-300 border border-amber-500/30 text-[10px] font-bold hover:bg-amber-500/20 flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    <span>+ Agregar Paso</span>
                  </button>
                </div>
                {editandoVariante && (
                  <p className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    Estos pasos son específicos de la variante / cliente y tendrán prioridad sobre la fórmula maestra en producción.
                  </p>
                )}
                <div className="max-h-96 overflow-y-auto space-y-3 pr-1">
                  {editPasos.map((paso, idx) => (
                    <div key={idx} className={`space-y-2 p-3 rounded-xl border ${
                      isDark ? 'border-slate-800 bg-[#0F141C]' : 'border-slate-200 bg-slate-50'
                    }`}>
                      <div className="flex items-center gap-2">
                        <span className={`w-6 shrink-0 text-center text-[10px] font-black rounded-md py-0.5 border ${
                          isDark ? 'text-amber-300 border-amber-500/30 bg-amber-500/10' : 'text-amber-700 border-amber-200 bg-amber-50'
                        }`}>
                          {idx + 1}
                        </span>
                        <input
                          type="text"
                          value={paso.titulo}
                          onChange={(e) => campoPaso(idx, 'titulo', e.target.value)}
                          className={`flex-1 rounded-lg border px-2.5 py-1 text-xs font-bold focus:outline-none ${
                            isDark ? 'border-slate-700 bg-slate-900 text-slate-200' : 'border-slate-300 bg-white text-slate-900'
                          }`}
                          placeholder={`Título del paso ${idx + 1} (ej. Mezcla)`}
                        />
                        <div className="flex items-center gap-1 w-32">
                          <Clock className={`w-3.5 h-3.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                          <input
                            type="text"
                            value={paso.tiempo}
                            onChange={(e) => campoPaso(idx, 'tiempo', e.target.value)}
                            className={`w-full rounded-lg border px-2 py-1 text-xs focus:outline-none ${
                              isDark ? 'border-slate-700 bg-slate-900 text-slate-200' : 'border-slate-300 bg-white text-slate-900'
                            }`}
                            placeholder="Tiempo"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => setEditPasos(editPasos.filter((_, i) => i !== idx))}
                          className="p-1 rounded text-rose-500 hover:bg-rose-500/20 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <textarea
                        value={paso.descripcion}
                        onChange={(e) => campoPaso(idx, 'descripcion', e.target.value)}
                        rows={2}
                        className={`w-full rounded-lg border px-2.5 py-1 text-xs focus:outline-none resize-y ${
                          isDark ? 'border-slate-700 bg-slate-900 text-slate-200' : 'border-slate-300 bg-white text-slate-900'
                        }`}
                        placeholder={`Descripción del paso ${idx + 1}`}
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="flex items-center gap-1.5">
                          <Package className={`w-3.5 h-3.5 shrink-0 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                          <input
                            type="text"
                            value={paso.insumos}
                            onChange={(e) => campoPaso(idx, 'insumos', e.target.value)}
                            className={`flex-1 rounded-lg border px-2 py-1 text-xs focus:outline-none ${
                              isDark ? 'border-slate-700 bg-slate-900 text-slate-200' : 'border-slate-300 bg-white text-slate-900'
                            }`}
                            placeholder="Insumos (separados por coma)"
                          />
                        </div>
                        <input
                          type="text"
                          value={paso.cantidades}
                          onChange={(e) => campoPaso(idx, 'cantidades', e.target.value)}
                          className={`flex-1 rounded-lg border px-2 py-1 text-xs focus:outline-none ${
                            isDark ? 'border-slate-700 bg-slate-900 text-slate-200' : 'border-slate-300 bg-white text-slate-900'
                          }`}
                          placeholder="Cantidades"
                        />
                      </div>
                    </div>
                  ))}
                  {editPasos.length === 0 && (
                    <p className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      No hay pasos definidos. Agrega el primero con &quot;+ Agregar Paso&quot;.
                    </p>
                  )}
                </div>
              </div>

              <div className={`flex justify-end gap-2.5 pt-3 border-t ${isDark ? 'border-slate-800/60' : 'border-slate-200'}`}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all ${
                    isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={editGuardando}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/30 flex items-center gap-2 transition-all active:scale-95"
                >
                  <Pencil className="w-4 h-4" />
                  <span>{editGuardando ? 'Guardando...' : 'Guardar Pasos'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
