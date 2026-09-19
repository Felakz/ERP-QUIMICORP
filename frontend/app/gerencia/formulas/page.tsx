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
  CheckCircle2,
  Sparkles,
  Scale,
  DollarSign,
  Check,
} from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';
import { apiFetch } from '@/lib/apiClient';

interface InsumoItem {
  id: string;
  codigo: string;
  nombre: string;
  unidadMedida?: string;
  stockReal?: number;
  costoUnitario?: number;
  familia?: { nombre: string };
}



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

  // Estados para Nueva Fórmula
  const [modalCrearOpen, setModalCrearOpen] = useState<boolean>(false);
  const [crearCodigo, setCrearCodigo] = useState<string>('');
  const [crearNombre, setCrearNombre] = useState<string>('');
  const [crearDensidad, setCrearDensidad] = useState<string>('1.0000');
  const [crearIngredientes, setCrearIngredientes] = useState<
    Array<{ insumoId?: string; componente: string; porcentaje: number }>
  >([]);
  const [crearPasos, setCrearPasos] = useState<PasoElaboracion[]>([]);
  const [crearGuardando, setCrearGuardando] = useState<boolean>(false);
  const [crearError, setCrearError] = useState<string>('');
  const [insumosList, setInsumosList] = useState<InsumoItem[]>([]);

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

  const fetchInsumos = async () => {
    try {
      const res = await apiFetch<InsumoItem[]>('/insumos');
      if (res.ok && Array.isArray(res.data)) {
        setInsumosList(res.data);
      }
    } catch {
      // noop
    }
  };

  useEffect(() => {
    fetchFormulas();
    fetchInsumos();
  }, []);

  const totalPorcentajeCrear = crearIngredientes.reduce(
    (sum, item) => sum + (Number(item.porcentaje) || 0),
    0
  );
  const diferencia100 = 100 - totalPorcentajeCrear;
  const es100Exacto = Math.abs(diferencia100) <= 0.01;

  const costoEstimadoPorKg = crearIngredientes.reduce((sum, ing) => {
    const ins = insumosList.find((i) => i.id === ing.insumoId);
    const costo = Number(ins?.costoUnitario) || 0;
    const porc = Number(ing.porcentaje) || 0;
    return sum + (costo * porc) / 100;
  }, 0);

  const insumosVinculadosCount = crearIngredientes.filter(
    (i) => i.insumoId && insumosList.some((ins) => ins.id === i.insumoId)
  ).length;


  const balancearConAgua = () => {
    if (diferencia100 <= 0) return;
    const idxAgua = crearIngredientes.findIndex(
      (i) =>
        i.componente.toUpperCase().includes('AGUA') ||
        insumosList.find((ins) => ins.id === i.insumoId)?.nombre.toUpperCase().includes('AGUA')
    );

    if (idxAgua >= 0) {
      const updated = [...crearIngredientes];
      const porcActual = Number(updated[idxAgua].porcentaje) || 0;
      updated[idxAgua].porcentaje = parseFloat((porcActual + diferencia100).toFixed(3));
      setCrearIngredientes(updated);
    } else {
      const insAgua = insumosList.find(
        (i) =>
          i.nombre.toUpperCase().includes('AGUA DESIONIZADA') ||
          i.nombre.toUpperCase().includes('AGUA TRATADA') ||
          i.nombre.toUpperCase().includes('AGUA')
      );
      setCrearIngredientes([
        ...crearIngredientes,
        {
          insumoId: insAgua?.id,
          componente: insAgua?.nombre || 'AGUA DESIONIZADA',
          porcentaje: parseFloat(diferencia100.toFixed(3)),
        },
      ]);
    }
  };

  const openCrearFormula = () => {
    setCrearError('');
    const maxNum = formulas.reduce((max, f) => {
      const match = f.codigoFormula?.match(/\d+/);
      const num = match ? parseInt(match[0], 10) : 0;
      return num > max ? num : max;
    }, 0);
    const sugerido = `FM-${String(maxNum + 1).padStart(3, '0')}`;

    setCrearCodigo(sugerido);
    setCrearNombre('');
    setCrearDensidad('1.0000');

    const insAgua = insumosList.find(
      (i) =>
        i.nombre.toUpperCase().includes('AGUA DESIONIZADA') ||
        i.nombre.toUpperCase().includes('AGUA TRATADA') ||
        i.nombre.toUpperCase().includes('AGUA')
    );

    setCrearIngredientes([
      {
        insumoId: insAgua?.id,
        componente: insAgua?.nombre || 'AGUA DESIONIZADA',
        porcentaje: 80.0,
      },
      {
        insumoId: undefined,
        componente: '',
        porcentaje: 20.0,
      },
    ]);

    setCrearPasos([
      {
        titulo: 'Fase 1: Dilución Base y Carga',
        descripcion: 'Cargar agua base en reactor limpio a temperatura ambiente y activar agitación moderada.',
        tiempo: '15 min',
        insumos: 'Agua Desionizada',
        cantidades: '80%',
      },
    ]);

    setModalCrearOpen(true);
    if (insumosList.length === 0) {
      fetchInsumos();
    }
  };

  const campoPasoCrear = (idx: number, campo: keyof PasoElaboracion, valor: string) => {
    const updated = [...crearPasos];
    updated[idx] = { ...updated[idx], [campo]: valor };
    setCrearPasos(updated);
  };

  const handleCrearSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCrearError('');

    if (!crearCodigo.trim()) {
      setCrearError('El código de fórmula es obligatorio (ej. FM-035).');
      return;
    }
    if (!crearNombre.trim()) {
      setCrearError('El nombre del producto es obligatorio.');
      return;
    }
    if (crearIngredientes.length === 0) {
      setCrearError('Debe ingresar al menos un insumo componente.');
      return;
    }
    if (!es100Exacto) {
      setCrearError(
        `La suma de porcentajes debe ser exactamente 100%. Actual: ${totalPorcentajeCrear.toFixed(2)}%.`
      );
      return;
    }
    const invalido = crearIngredientes.some(
      (i) => !i.componente.trim() || Number(i.porcentaje) <= 0
    );
    if (invalido) {
      setCrearError('Todos los insumos deben tener nombre y un porcentaje mayor a 0%.');
      return;
    }

    setCrearGuardando(true);
    try {
      const pasosValidos = crearPasos
        .map((p) => ({ ...p, titulo: (p.titulo || '').trim() }))
        .filter((p) => p.titulo);

      const payload = {
        codigoFormula: crearCodigo.trim().toUpperCase(),
        nombreProducto: crearNombre.trim().toUpperCase(),
        densidadTeorica: parseFloat(crearDensidad) || 1.0,
        detalles: crearIngredientes.map((i) => ({
          insumoId: i.insumoId || undefined,
          nombreComponente: i.componente.trim().toUpperCase(),
          porcentaje: Number(i.porcentaje),
        })),
        pasosElaboracion: pasosValidos.length > 0 ? pasosValidos : null,
      };

      const res = await apiFetch<FormulaAPI>('/formulas', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setModalCrearOpen(false);
        await fetchFormulas();
      } else {
        setCrearError(res.error || 'El servidor rechazó la creación de la fórmula.');
      }
    } catch {
      setCrearError('Error de conexión al registrar la fórmula.');
    } finally {
      setCrearGuardando(false);
    }
  };


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
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar fórmula..."
              className={`w-52 sm:w-64 pl-9 pr-3 py-2 rounded-xl border text-xs font-medium focus:outline-none focus:border-amber-500 ${inputBg}`}
            />
          </div>
          <button
            type="button"
            onClick={openCrearFormula}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/25 transition-all active:scale-95 cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Nueva Fórmula</span>
          </button>
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

      {/* MODAL CREAR NUEVA FÓRMULA */}
      {modalCrearOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className={`w-full max-w-3xl rounded-2xl border p-6 space-y-5 shadow-2xl ${cardBg} my-8`}>
            {/* Cabecera Modal */}
            <div className={`flex items-start justify-between border-b pb-4 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-500 border border-amber-500/30">
                  <FlaskConical className="w-6 h-6" />
                </div>
                <div>
                  <h3 className={`text-base font-black ${textValue}`}>
                    Nueva Fórmula Maestra
                  </h3>
                  <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Define la dosificación porcentual exacta (100%), densidad y pasos de reactor.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalCrearOpen(false)}
                className={`p-1.5 rounded-xl transition-colors ${
                  isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {crearError && (
              <div className={`flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-xs font-semibold ${
                isDark ? 'bg-rose-500/10 border-rose-500/30 text-rose-300' : 'bg-rose-50 border-rose-200 text-rose-700'
              }`}>
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{crearError}</span>
              </div>
            )}

            <form onSubmit={handleCrearSubmit} className="space-y-5">
              {/* Sección 1: Ficha Técnica */}
              <div className={`rounded-xl border p-4 space-y-3 ${isDark ? 'border-slate-800/80 bg-[#0B0F17]' : 'border-slate-200 bg-slate-50'}`}>
                <p className={`text-[10px] font-black uppercase tracking-wider ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                  1. Ficha Técnica & Identificación
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className={`block text-[11px] font-bold uppercase mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      Código Fórmula *
                    </label>
                    <input
                      type="text"
                      required
                      value={crearCodigo}
                      onChange={(e) => setCrearCodigo(e.target.value.toUpperCase())}
                      placeholder="Ej. FM-035"
                      className={`w-full rounded-xl border px-3 py-2 text-xs font-mono font-bold uppercase focus:border-amber-500 focus:outline-none ${inputBg}`}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={`block text-[11px] font-bold uppercase mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      Nombre del Producto Comercial *
                    </label>
                    <input
                      type="text"
                      required
                      value={crearNombre}
                      onChange={(e) => setCrearNombre(e.target.value)}
                      placeholder="Ej. DETERGENTE LÍQUIDO ULTRA PREMIUM"
                      className={`w-full rounded-xl border px-3 py-2 text-xs font-bold uppercase focus:border-amber-500 focus:outline-none ${inputBg}`}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div>
                    <label className={`block text-[11px] font-bold uppercase mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      Densidad Teórica (kg/L) *
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.0001"
                        min="0.5"
                        max="3.0"
                        required
                        value={crearDensidad}
                        onChange={(e) => setCrearDensidad(e.target.value)}
                        placeholder="1.0000"
                        className={`w-full rounded-xl border px-3 py-2 text-xs font-mono font-bold focus:border-amber-500 focus:outline-none ${inputBg}`}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-mono">kg/L</span>
                    </div>
                  </div>
                  <div className="sm:col-span-2 flex items-center pt-5">
                    <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      💡 Utilizado en producción para convertir automáticamente litros a kilos según capacidad de reactor.
                    </p>
                  </div>
                </div>
              </div>

              {/* Sección 2: Composición e Insumos */}
              <div className={`rounded-xl border p-4 space-y-3 ${isDark ? 'border-slate-800/80 bg-[#0B0F17]' : 'border-slate-200 bg-slate-50'}`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <p className={`text-[10px] font-black uppercase tracking-wider ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                      2. Composición de Materia Prima & Dosificación (%)
                    </p>
                    <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      La suma de porcentajes de masa debe totalizar exactamente 100.00%.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCrearIngredientes([...crearIngredientes, { componente: '', porcentaje: 1.0 }])}
                    className="self-start sm:self-auto px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/30 text-[11px] font-bold hover:bg-amber-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Agregar Insumo</span>
                  </button>
                </div>

                {/* Barra y Monitor de Balance 100% */}
                <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <Scale className="w-4 h-4 text-amber-500" />
                      <span>Balance Total de Fórmula:</span>
                      <span className={`font-mono font-black ${es100Exacto ? 'text-emerald-400' : totalPorcentajeCrear > 100 ? 'text-rose-400' : 'text-amber-400'}`}>
                        {totalPorcentajeCrear.toFixed(2)}%
                      </span>
                      <span className="text-slate-500 font-normal">/ 100.00%</span>
                    </div>

                    {es100Exacto ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-lg">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Exacto 100%
                      </span>
                    ) : diferencia100 > 0 ? (
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-lg">
                          Faltan {diferencia100.toFixed(2)}%
                        </span>
                        <button
                          type="button"
                          onClick={balancearConAgua}
                          className="inline-flex items-center gap-1 text-[10px] font-bold bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 px-2.5 py-0.5 rounded-lg transition-all cursor-pointer"
                          title="Añadir o ajustar la diferencia con Agua Desionizada"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>Balancear con Agua</span>
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-lg">
                        Excede por {Math.abs(diferencia100).toFixed(2)}%
                      </span>
                    )}
                  </div>

                  {/* Barra de progreso */}
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        es100Exacto
                          ? 'bg-emerald-400'
                          : totalPorcentajeCrear > 100
                          ? 'bg-rose-500'
                          : 'bg-amber-400'
                      }`}
                      style={{ width: `${Math.min(totalPorcentajeCrear, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Datalist para autocomplete rápido de insumos */}
                <datalist id="insumos-catalogo">
                  {insumosList.map((ins) => (
                    <option key={ins.id} value={ins.nombre}>
                      {ins.codigo} {ins.familia ? `· ${ins.familia.nombre}` : ''}
                    </option>
                  ))}
                </datalist>

                {/* Lista de Insumos */}
                <div className="max-h-72 overflow-y-auto space-y-2.5 pr-1">
                  {crearIngredientes.map((ing, idx) => {
                    const gramosPorKilo = ((Number(ing.porcentaje) || 0) * 10).toFixed(2);
                    const insMatched = insumosList.find(
                      (i) =>
                        i.id === ing.insumoId ||
                        i.nombre.toUpperCase() === ing.componente.trim().toUpperCase() ||
                        i.codigo.toUpperCase() === ing.componente.trim().toUpperCase()
                    );
                    const costoUnit = Number(insMatched?.costoUnitario || 0);
                    const costoContrib = (costoUnit * (Number(ing.porcentaje) || 0)) / 100;

                    return (
                      <div
                        key={idx}
                        className={`p-2.5 rounded-xl border space-y-1.5 ${
                          isDark ? 'border-slate-800 bg-[#0F141C]' : 'border-slate-200 bg-white'
                        }`}
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="flex-1 min-w-[200px]">
                            <input
                              type="text"
                              list="insumos-catalogo"
                              required
                              value={ing.componente}
                              onChange={(e) => {
                                const val = e.target.value;
                                const matched = insumosList.find(
                                  (i) =>
                                    i.nombre.toUpperCase() === val.trim().toUpperCase() ||
                                    i.codigo.toUpperCase() === val.trim().toUpperCase()
                                );
                                const updated = [...crearIngredientes];
                                updated[idx] = {
                                  ...updated[idx],
                                  componente: val,
                                  insumoId: matched?.id || (val.trim() === '' ? undefined : updated[idx].insumoId),
                                };
                                setCrearIngredientes(updated);
                              }}
                              placeholder="Buscar por código o nombre de insumo oficial..."
                              className={`w-full rounded-lg border px-3 py-1.5 text-xs focus:outline-none focus:border-amber-500 ${inputBg}`}
                            />
                          </div>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              step="0.001"
                              min="0.001"
                              max="100"
                              required
                              value={ing.porcentaje}
                              onChange={(e) => {
                                const updated = [...crearIngredientes];
                                updated[idx].porcentaje = parseFloat(e.target.value) || 0;
                                setCrearIngredientes(updated);
                              }}
                              className={`w-24 rounded-lg border px-2.5 py-1.5 text-xs text-right font-mono font-bold focus:outline-none ${
                                isDark ? 'border-slate-700 bg-slate-900 text-amber-300' : 'border-slate-300 bg-white text-amber-600'
                              }`}
                            />
                            <span className={`text-xs font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>%</span>
                          </div>
                          <div className="w-24 text-right">
                            <span className="text-[10px] font-mono text-slate-500">
                              ~{gramosPorKilo} g/kg
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setCrearIngredientes(crearIngredientes.filter((_, i) => i !== idx))}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors"
                            title="Eliminar insumo"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Metadatos en tiempo real del Insumo de BD */}
                        {insMatched ? (
                          <div className="flex flex-wrap items-center gap-2 text-[10px] pt-0.5 px-0.5 border-t border-slate-800/50">
                            <span className="inline-flex items-center gap-1 text-emerald-400 font-mono font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                              <Check className="w-2.5 h-2.5" />
                              BD ID: {insMatched.codigo}
                            </span>
                            <span className="text-slate-400 font-mono">
                              Costo Real: <strong className="text-emerald-300">S/ {costoUnit.toFixed(2)}</strong>/{insMatched.unidadMedida || 'KG'}
                            </span>
                            <span className="text-slate-500 font-mono">
                              Stock: {Number(insMatched.stockReal || 0).toLocaleString()} {insMatched.unidadMedida || 'KG'}
                            </span>
                            <span className="ml-auto text-emerald-400 font-mono font-bold">
                              Contribución: S/ {costoContrib.toFixed(4)}/kg
                            </span>
                          </div>
                        ) : ing.componente.trim() ? (
                          <div className="text-[10px] text-amber-400/80 italic px-0.5">
                            Componente manual (selecciona una sugerencia del catálogo para enlazar ID y costo)
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                  {crearIngredientes.length === 0 && (
                    <p className={`text-xs text-center py-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      No has agregado insumos. Haz clic en &quot;+ Agregar Insumo&quot;.
                    </p>
                  )}
                </div>

                {/* Resumen Económico de Materia Prima */}
                <div className={`flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl border ${
                  isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
                }`}>
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <DollarSign className="w-4 h-4" />
                    </div>
                    <div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Costo Teórico de Materia Prima (COGS Reactor):
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="font-mono font-black text-emerald-400 text-sm">
                          S/ {costoEstimadoPorKg.toFixed(4)}
                        </span>
                        <span className={`text-xs ${textValue}`}>por kilo</span>
                        <span className="text-[11px] font-mono text-slate-500">
                          (S/ {(costoEstimadoPorKg * 1000).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / Tonelada)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-mono">
                      Insumos con ID oficial: <strong className="text-emerald-400">{insumosVinculadosCount}</strong> de {crearIngredientes.length}
                    </span>
                    <span className="text-[9px] text-slate-500 block">
                      Valores sincronizados con PostgreSQL (`insumos.costoUnitario`)
                    </span>
                  </div>
                </div>
              </div>

              {/* Sección 3: Pasos de Elaboración en Reactor */}
              <div className={`rounded-xl border p-4 space-y-3 ${isDark ? 'border-slate-800/80 bg-[#0B0F17]' : 'border-slate-200 bg-slate-50'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-[10px] font-black uppercase tracking-wider ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                      3. Procedimiento de Mezcla en Reactor (Pasos)
                    </p>
                    <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Instrucciones operativas para el operador en planta.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCrearPasos([...crearPasos, pasoVacio()])}
                    className="px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/30 text-[11px] font-bold hover:bg-amber-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Agregar Paso</span>
                  </button>
                </div>

                <div className="max-h-52 overflow-y-auto space-y-3 pr-1">
                  {crearPasos.map((paso, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border space-y-2 ${
                        isDark ? 'border-slate-800 bg-[#0F141C]' : 'border-slate-200 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-1">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-black">
                            {idx + 1}
                          </span>
                          <input
                            type="text"
                            value={paso.titulo}
                            onChange={(e) => campoPasoCrear(idx, 'titulo', e.target.value)}
                            placeholder={`Fase ${idx + 1}: Título del paso`}
                            className={`flex-1 rounded-lg border px-2.5 py-1 text-xs font-bold focus:outline-none ${
                              isDark ? 'border-slate-700 bg-slate-900 text-slate-200' : 'border-slate-300 bg-white text-slate-900'
                            }`}
                          />
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className={`w-3.5 h-3.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                          <input
                            type="text"
                            value={paso.tiempo}
                            onChange={(e) => campoPasoCrear(idx, 'tiempo', e.target.value)}
                            placeholder="Ej. 15 min"
                            className={`w-20 rounded-lg border px-2 py-1 text-xs text-center focus:outline-none ${
                              isDark ? 'border-slate-700 bg-slate-900 text-slate-200' : 'border-slate-300 bg-white text-slate-900'
                            }`}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => setCrearPasos(crearPasos.filter((_, i) => i !== idx))}
                          className="p-1 rounded text-rose-500 hover:bg-rose-500/20 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <textarea
                        value={paso.descripcion}
                        onChange={(e) => campoPasoCrear(idx, 'descripcion', e.target.value)}
                        rows={2}
                        placeholder="Instrucciones operativas (RPM, temperatura, precauciones de agitación)..."
                        className={`w-full rounded-lg border px-2.5 py-1.5 text-xs focus:outline-none resize-y ${
                          isDark ? 'border-slate-700 bg-slate-900 text-slate-200' : 'border-slate-300 bg-white text-slate-900'
                        }`}
                      />
                    </div>
                  ))}
                  {crearPasos.length === 0 && (
                    <p className={`text-xs text-center py-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      No hay pasos definidos.
                    </p>
                  )}
                </div>
              </div>

              {/* Botones de acción */}
              <div className={`flex items-center justify-end gap-3 pt-3 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                <button
                  type="button"
                  onClick={() => setModalCrearOpen(false)}
                  className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                    isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={crearGuardando || !es100Exacto}
                  className={`px-6 py-2.5 rounded-xl font-black text-xs flex items-center gap-2 transition-all active:scale-95 shadow-lg ${
                    es100Exacto
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/25 cursor-pointer'
                      : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                  }`}
                >
                  <FlaskConical className="w-4 h-4" />
                  <span>{crearGuardando ? 'Registrando...' : 'Registrar Fórmula Maestra'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

