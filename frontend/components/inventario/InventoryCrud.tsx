'use client';
import { stockUnit } from '@/lib/stockUnits';

import React, { useState, useEffect, useCallback } from 'react';
import { Package, Plus, Search, Edit3, Save, X, RefreshCw, Tag, CheckCircle2, Trash2, SlidersHorizontal, Check } from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';
import { apiFetch } from '@/lib/apiClient';
import { useSocket } from '@/lib/socketContext';

interface FamiliaInsumo {
  id: string;
  nombre: string;
}

interface Insumo {
  id: string;
  codigo: string;
  nombre: string;
  familiaId: string;
  familia?: FamiliaInsumo;
  unidadMedida: string;
  tipo?: string;
  estadoFisico?: string | null;
  stockReal?: number;
  stockMinimo?: number;
  costoUnitario?: number;
  esSoloFormula?: boolean;
}

export function InventoryCrud() {
  const { theme } = useTheme();
  const { socket } = useSocket();
  const isDark = theme === 'dark';

  const [insumos, setInsumos] = useState<Insumo[]>([]);
  const [familias, setFamilias] = useState<FamiliaInsumo[]>([]);
  const [search, setSearch] = useState('');
  const [familiaFiltro, setFamiliaFiltro] = useState('TODAS');
  const [soloFisicos, setSoloFisicos] = useState(true);
  const [loading, setLoading] = useState(true);
  const [showNuevo, setShowNuevo] = useState(false);
  const [showNuevaFamilia, setShowNuevaFamilia] = useState(false);
  const [nuevaFamiliaNombre, setNuevaFamiliaNombre] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Insumo>>({});
  const [guardandoEdit, setGuardandoEdit] = useState(false);
  const [modalEditarInsumo, setModalEditarInsumo] = useState<Insumo | null>(null);
  const [modalEditForm, setModalEditForm] = useState<Partial<Insumo>>({});
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const [form, setForm] = useState({ codigo: '', nombre: '', familiaId: '', unidadMedida: 'GR', tipo: 'OTRO', estadoFisico: 'LIQUIDO', stockMinimo: 0, costoUnitario: 0, stockInicial: 0, esSoloFormula: false });

  const cardBg = isDark ? 'bg-[#0F141C] border-[#1A2232]' : 'bg-white border-slate-200 shadow-sm';
  const textTitle = isDark ? 'text-slate-400' : 'text-slate-600';
  const textValue = isDark ? 'text-white' : 'text-slate-900';
  const inputBg = isDark ? 'bg-[#151D2A] border-[#1A2232] text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-900';

  const cargar = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (soloFisicos) params.set('excluirSoloFormula', 'true');
    const [insRes, famRes] = await Promise.all([
      apiFetch<Insumo[]>(`/inventario/insumos${params.toString() ? `?${params.toString()}` : ''}`),
      apiFetch<FamiliaInsumo[]>('/inventario/familias'),
    ]);
    if (insRes.ok && Array.isArray(insRes.data)) setInsumos(insRes.data as Insumo[]);
    if (famRes.ok && Array.isArray(famRes.data)) setFamilias(famRes.data as FamiliaInsumo[]);
    setLoading(false);
  }, [search, soloFisicos]);

  useEffect(() => { cargar(); }, [cargar]);

  useEffect(() => {
    if (!socket) return;
    const onRefresh = () => cargar();
    socket.on('inventario:actualizado', onRefresh);
    socket.on('lote:estado_actualizado', onRefresh);
    return () => {
      socket.off('inventario:actualizado', onRefresh);
      socket.off('lote:estado_actualizado', onRefresh);
    };
  }, [socket, cargar]);

  const handleCrearFamilia = async () => {
    if (!nuevaFamiliaNombre.trim()) return;
    const { ok } = await apiFetch('/inventario/familias', { method: 'POST', body: JSON.stringify({ nombre: nuevaFamiliaNombre.trim() }) });
    if (ok) { setNuevaFamiliaNombre(''); setShowNuevaFamilia(false); cargar(); }
  };

  const handleCrearInsumo = async () => {
    if (!form.codigo.trim() || !form.nombre.trim() || !form.familiaId) { alert('Completa código, nombre y categoría'); return; }
    const { ok, error } = await apiFetch('/inventario/insumos', { method: 'POST', body: JSON.stringify(form) });
    if (ok) { setShowNuevo(false); setForm({ codigo: '', nombre: '', familiaId: '', unidadMedida: 'GR', tipo: 'OTRO', estadoFisico: 'LIQUIDO', stockMinimo: 0, costoUnitario: 0, stockInicial: 0, esSoloFormula: false }); cargar(); }
    else alert(error || 'Error al crear');
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const iniciarEditInline = (ins: Insumo) => {
    setEditId(ins.id);
    setEditData({
      codigo: ins.codigo,
      nombre: ins.nombre,
      familiaId: ins.familiaId,
      unidadMedida: ins.unidadMedida,
      tipo: ins.tipo || 'OTRO',
      estadoFisico: ins.estadoFisico || 'LIQUIDO',
      stockReal: Number(ins.stockReal ?? 0),
      stockMinimo: Number(ins.stockMinimo ?? 0),
      costoUnitario: Number(ins.costoUnitario ?? 0),
      esSoloFormula: Boolean(ins.esSoloFormula),
    });
  };

  const handleGuardarInline = async (id: string) => {
    setGuardandoEdit(true);
    const { ok, error } = await apiFetch(`/inventario/insumos/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(editData),
    });
    setGuardandoEdit(false);
    if (ok) {
      setEditId(null);
      setEditData({});
      showToast('✓ Insumo y stock actualizados correctamente.');
      cargar();
    } else {
      alert(error || 'Error al guardar cambios');
    }
  };

  const handleAbrirModalEditar = (ins: Insumo) => {
    setModalEditarInsumo(ins);
    setModalEditForm({
      codigo: ins.codigo,
      nombre: ins.nombre,
      familiaId: ins.familiaId,
      unidadMedida: ins.unidadMedida,
      tipo: ins.tipo || 'OTRO',
      estadoFisico: ins.estadoFisico || 'LIQUIDO',
      stockReal: Number(ins.stockReal ?? 0),
      stockMinimo: Number(ins.stockMinimo ?? 0),
      costoUnitario: Number(ins.costoUnitario ?? 0),
      esSoloFormula: Boolean(ins.esSoloFormula),
    });
  };

  const handleGuardarModal = async () => {
    if (!modalEditarInsumo) return;
    setGuardandoEdit(true);
    const { ok, error } = await apiFetch(`/inventario/insumos/${modalEditarInsumo.id}`, {
      method: 'PATCH',
      body: JSON.stringify(modalEditForm),
    });
    setGuardandoEdit(false);
    if (ok) {
      setModalEditarInsumo(null);
      showToast('✓ Insumo maestro actualizado al 100% (código, nombres, números y Kardex).');
      cargar();
    } else {
      alert(error || 'Error al actualizar insumo');
    }
  };

  const filtered = insumos.filter(i => familiaFiltro === 'TODAS' || i.familiaId === familiaFiltro);

  return (
    <div className="space-y-6">
      {toastMsg && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs shadow-2xl animate-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-4 h-4 text-slate-950" />
          <span>{toastMsg}</span>
        </div>
      )}
      <div className={`p-6 rounded-2xl border ${cardBg}`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400"><Package className="w-6 h-6" /></div>
            <div>
              <h1 className={`text-xl font-black ${textValue}`}>Gestión de Insumos</h1>
              <p className={`text-xs ${textTitle}`}>Maestro oficial de insumos vinculado a Fórmulas y Kardex en tiempo real.</p>
            </div>
          </div>
          <button onClick={() => setShowNuevo(true)} className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold flex items-center gap-2 hover:bg-blue-500"><Plus className="w-4 h-4" /> Nuevo Insumo</button>
        </div>
      </div>

      <div className={`p-4 rounded-xl border flex flex-wrap items-center justify-between gap-3 ${cardBg}`}>
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por código o nombre..." className={`w-full pl-9 pr-3 py-2 rounded-xl border text-xs ${inputBg}`} />
        </div>
        <select value={familiaFiltro} onChange={e => setFamiliaFiltro(e.target.value)} className={`px-3 py-2 rounded-xl border text-xs font-bold ${inputBg}`}>
          <option value="TODAS">Todas las categorías</option>
          {familias.map(f => <option key={f.id} value={f.id}>{f.nombre}</option>)}
        </select>
        <button
          onClick={() => setSoloFisicos(v => !v)}
          title="Mostrar/ocultar insumos de solo fórmula (ESP)"
          className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
            soloFisicos
              ? isDark ? 'bg-[#00F2C3]/15 border-[#00F2C3]/40 text-[#00F2C3]' : 'bg-emerald-50 border-emerald-300 text-emerald-700'
              : isDark ? 'border-slate-700 text-slate-400 hover:text-white' : 'border-slate-300 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center text-[9px] ${soloFisicos ? 'bg-[#00F2C3] border-[#00F2C3] text-[#06241B]' : 'border-current'}`}>{soloFisicos ? '✓' : ''}</span>
          Ocultar ESP
        </button>
        <button onClick={() => setShowNuevaFamilia(true)} className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 ${isDark ? 'border-blue-500/30 text-blue-400 hover:bg-blue-500/10' : 'border-blue-300 text-blue-700 hover:bg-blue-50'}`}><Tag className="w-3.5 h-3.5" /> Nueva Categoría</button>
        <button onClick={cargar} className={`p-2 rounded-xl border ${isDark ? 'border-slate-700 text-slate-400' : 'border-slate-300 text-slate-600'}`}><RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /></button>
      </div>

      <div className={`rounded-xl border overflow-hidden ${cardBg}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className={`border-b text-[10px] font-bold uppercase tracking-wider ${isDark ? 'bg-[#151D2A] text-slate-400 border-[#1A2232]' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
              <tr>
                <th className="p-3">Código (SKU)</th>
                <th className="p-3">Nombre</th>
                <th className="p-3">Categoría</th>
                <th className="p-3">Unidad comercial</th>
                <th className="p-3">Tipo</th>
                <th className="p-3">Estado Físico</th>
                <th className="p-3 text-right">Stock</th>
                <th className="p-3 text-center">Acción</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-slate-800/60' : 'divide-slate-200'}`}>
              {loading ? (
                <tr><td colSpan={8} className="p-8 text-center text-slate-500">Cargando maestro...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8} className="p-8 text-center text-slate-500">Sin insumos — registra el primero con “Nuevo Insumo”.</td></tr>
              ) : filtered.map(ins => (
                <tr key={ins.id} className={isDark ? 'hover:bg-slate-800/30' : 'hover:bg-slate-50'}>
                  {/* CÓDIGO (SKU) */}
                  <td className="p-3 font-mono font-bold text-cyan-500">
                    {editId === ins.id ? (
                      <input
                        value={editData.codigo ?? ''}
                        onChange={e => setEditData({ ...editData, codigo: e.target.value.toUpperCase() })}
                        className={`w-24 px-2 py-1 rounded border font-mono font-bold text-xs uppercase text-cyan-400 ${inputBg}`}
                        title="Código SKU"
                      />
                    ) : (
                      ins.codigo
                    )}
                  </td>

                  {/* NOMBRE */}
                  <td className="p-3 font-medium">
                    {editId === ins.id ? (
                      <input
                        value={editData.nombre ?? ''}
                        onChange={e => setEditData({ ...editData, nombre: e.target.value })}
                        className={`w-full min-w-[160px] px-2 py-1 rounded border text-xs font-semibold ${inputBg}`}
                        title="Nombre del insumo"
                      />
                    ) : (
                      ins.nombre
                    )}
                  </td>

                  {/* CATEGORÍA */}
                  <td className="p-3">
                    {editId === ins.id ? (
                      <select
                        value={editData.familiaId ?? ''}
                        onChange={e => setEditData({ ...editData, familiaId: e.target.value })}
                        className={`px-2 py-1 rounded border text-xs max-w-[130px] ${inputBg}`}
                      >
                        {familias.map(f => (
                          <option key={f.id} value={f.id}>{f.nombre}</option>
                        ))}
                      </select>
                    ) : (
                      ins.familia?.nombre || '—'
                    )}
                  </td>

                  {/* UNIDAD */}
                  <td className="p-3 font-mono">
                    {editId === ins.id ? (
                      <select
                        value={editData.unidadMedida ?? 'GR'}
                        onChange={e => setEditData({ ...editData, unidadMedida: e.target.value })}
                        className={`px-1.5 py-1 rounded border font-mono text-xs ${inputBg}`}
                      >
                        <option value="GR">GR</option>
                        <option value="KG">KG</option>
                        <option value="L">L</option>
                        <option value="ML">ML</option>
                        <option value="UN">UN</option>
                      </select>
                    ) : (
                      ins.unidadMedida
                    )}
                  </td>

                  {/* TIPO */}
                  <td className="p-3">
                    {editId === ins.id ? (
                      <select
                        value={editData.tipo ?? 'OTRO'}
                        onChange={e => setEditData({ ...editData, tipo: e.target.value })}
                        className={`px-1.5 py-1 rounded border text-xs ${inputBg}`}
                      >
                        <option value="BASE">BASE</option>
                        <option value="FRAGANCIA">FRAGANCIA</option>
                        <option value="PIGMENTO">PIGMENTO</option>
                        <option value="ENVASE">ENVASE</option>
                        <option value="OTRO">OTRO</option>
                      </select>
                    ) : (
                      ins.tipo || '—'
                    )}
                  </td>

                  {/* ESTADO FÍSICO */}
                  <td className="p-3">
                    {editId === ins.id ? (
                      <select
                        value={editData.estadoFisico ?? 'LIQUIDO'}
                        onChange={e => setEditData({ ...editData, estadoFisico: e.target.value })}
                        className={`px-1.5 py-1 rounded border text-xs ${inputBg}`}
                      >
                        <option value="LIQUIDO">LIQUIDO</option>
                        <option value="POLVO">POLVO</option>
                        <option value="GRANO">GRANO</option>
                        <option value="BLOQUE">BLOQUE</option>
                        <option value="CRISTAL">CRISTAL</option>
                        <option value="PASTA">PASTA</option>
                        <option value="BALDE">BALDE</option>
                        <option value="GALONERA">GALONERA</option>
                        <option value="ENVASE">ENVASE</option>
                        <option value="ACEITE ESENCIAL">ACEITE ESENCIAL</option>
                        <option value="OTRO">OTRO</option>
                      </select>
                    ) : (
                      <>
                        <span className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase inline-flex items-center gap-1 ${
                          (ins.estadoFisico || '').includes('BALDE') || ins.nombre.includes('BALDE')
                            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                            : (ins.estadoFisico || '').includes('GALON') || ins.nombre.includes('GALON')
                            ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30'
                            : ins.tipo === 'ENVASE' || (ins.estadoFisico || '').includes('ENVASE')
                            ? 'bg-orange-500/15 text-orange-400 border border-orange-500/30'
                            : isDark ? 'bg-slate-700/50 text-slate-300' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {(ins.estadoFisico || '').includes('BALDE') || ins.nombre.includes('BALDE') ? '🪣 BALDE' :
                           (ins.estadoFisico || '').includes('GALON') || ins.nombre.includes('GALON') ? '🛢️ GALONERA' :
                           ins.tipo === 'ENVASE' ? '📦 ENVASE' :
                           ins.estadoFisico || '—'}
                        </span>
                        {ins.esSoloFormula && (
                          <span className="ml-1.5 rounded px-2 py-0.5 text-[10px] font-bold uppercase bg-purple-500/15 text-purple-400 border border-purple-500/30">ESP</span>
                        )}
                      </>
                    )}
                  </td>

                  {/* STOCK (LOS NÚMEROS) */}
                  <td className="p-3 text-right font-mono">
                    {editId === ins.id ? (
                      <input
                        type="number"
                        step="any"
                        value={editData.stockReal ?? 0}
                        onChange={e => setEditData({ ...editData, stockReal: Number(e.target.value) })}
                        className={`w-28 text-right px-2 py-1 rounded border font-mono font-black text-xs text-emerald-400 ${inputBg}`}
                        title="Modificar número de stock actual"
                      />
                    ) : (
                      <span className="font-black text-emerald-400">{Number(ins.stockReal ?? 0).toLocaleString()} {stockUnit(ins.unidadMedida)}</span>
                    )}
                  </td>

                  {/* ACCIÓN */}
                  <td className="p-3 text-center">
                    {editId === ins.id ? (
                      <span className="inline-flex items-center gap-1">
                        <button
                          onClick={() => handleGuardarInline(ins.id)}
                          disabled={guardandoEdit}
                          className="p-1.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30 transition-all disabled:opacity-50"
                          title="Guardar cambios rápidos"
                        >
                          <Save className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setEditId(null)}
                          className="p-1.5 rounded bg-slate-500/10 text-slate-400 border hover:text-white transition-all"
                          title="Cancelar edición"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleAbrirModalEditar(ins)}
                          className="p-1.5 rounded bg-purple-500/20 text-purple-400 border border-purple-500/40 hover:bg-purple-500/30 transition-all"
                          title="Editar TODO (costos, stock mínimo, ESP...)"
                        >
                          <SlidersHorizontal className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1">
                        <button
                          onClick={() => iniciarEditInline(ins)}
                          className="p-1.5 rounded border text-cyan-400 hover:text-white hover:bg-cyan-500/10 border-cyan-500/30 transition-colors"
                          title="Editar en fila (código, nombres, números de stock, categoría...)"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleAbrirModalEditar(ins)}
                          className="p-1.5 rounded border text-purple-400 hover:text-white hover:bg-purple-500/10 border-purple-500/30 transition-colors"
                          title="Editar TODO (modal completo con costo y stock mínimo)"
                        >
                          <SlidersHorizontal className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={async () => {
                            if (!confirm(`¿Eliminar ${ins.codigo} — ${ins.nombre}?`)) return;
                            const { ok, error } = await apiFetch(`/inventario/insumos/${ins.id}/eliminar`, { method: 'POST' });
                            if (ok) {
                              showToast(`✓ Insumo ${ins.codigo} eliminado con éxito.`);
                              cargar();
                            } else {
                              alert(error || 'No se pudo eliminar');
                            }
                          }}
                          className="p-1.5 rounded border text-rose-400 hover:text-white hover:bg-rose-500/10 border-rose-500/20 transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showNuevo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className={`w-full max-w-lg rounded-2xl p-6 border space-y-4 ${cardBg}`}>
            <h3 className={`text-sm font-bold ${textValue}`}>Registrar Insumo</h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div><label className={`block text-[10px] font-bold uppercase mb-1 ${textTitle}`}>Código (SKU) *</label><input value={form.codigo} onChange={e => setForm({...form, codigo: e.target.value})} placeholder={form.esSoloFormula ? "ESP-XXX" : "INS-XXX"} className={`w-full px-3 py-2 rounded-xl border font-mono ${inputBg}`} /></div>
              <div><label className={`block text-[10px] font-bold uppercase mb-1 ${textTitle}`}>Unidad comercial *</label><select value={form.unidadMedida} onChange={e => setForm({...form, unidadMedida: e.target.value})} className={`w-full px-3 py-2 rounded-xl border ${inputBg}`}><option>KG</option><option>L</option><option>GR</option><option>UN</option></select></div>
              <div className="col-span-2"><label className={`block text-[10px] font-bold uppercase mb-1 ${textTitle}`}>Nombre canónico *</label><input value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} className={`w-full px-3 py-2 rounded-xl border ${inputBg}`} /></div>
              <div><label className={`block text-[10px] font-bold uppercase mb-1 ${textTitle}`}>Categoría *</label><select value={form.familiaId} onChange={e => setForm({...form, familiaId: e.target.value})} className={`w-full px-3 py-2 rounded-xl border ${inputBg}`}><option value="">Seleccionar</option>{familias.map(f => <option key={f.id} value={f.id}>{f.nombre}</option>)}</select></div>
              <div><label className={`block text-[10px] font-bold uppercase mb-1 ${textTitle}`}>Tipo</label><select value={form.tipo} onChange={e => setForm({...form, tipo: e.target.value})} className={`w-full px-3 py-2 rounded-xl border ${inputBg}`}><option>BASE</option><option>FRAGANCIA</option><option>PIGMENTO</option><option>ENVASE</option><option>OTRO</option></select></div>
              <div><label className={`block text-[10px] font-bold uppercase mb-1 ${textTitle}`}>Estado Físico</label><select value={form.estadoFisico} onChange={e => setForm({...form, estadoFisico: e.target.value})} className={`w-full px-3 py-2 rounded-xl border ${inputBg}`}><option>LIQUIDO</option><option>POLVO</option><option>GRANO</option><option>BLOQUE</option><option>CRISTAL</option><option>PASTA</option><option>BALDE</option><option>GALONERA</option><option>ENVASE</option><option>OTRO</option></select></div>
              <div><label className={`block text-[10px] font-bold uppercase mb-1 ${textTitle}`}>Stock Mínimo ({form.unidadMedida})</label><input type="number" value={form.stockMinimo} onChange={e => setForm({...form, stockMinimo: Number(e.target.value)})} className={`w-full px-3 py-2 rounded-xl border ${inputBg}`} /></div>
              <div><label className={`block text-[10px] font-bold uppercase mb-1 ${textTitle}`}>Costo Unitario (S/ por {form.unidadMedida})</label><input type="number" value={form.costoUnitario} onChange={e => setForm({...form, costoUnitario: Number(e.target.value)})} className={`w-full px-3 py-2 rounded-xl border ${inputBg}`} /></div>
              <div><label className={`block text-[10px] font-bold uppercase mb-1 ${textTitle}`}>Stock Inicial ({form.unidadMedida})</label><input type="number" value={form.stockInicial} onChange={e => setForm({...form, stockInicial: Number(e.target.value)})} placeholder="0 (genera Kardex de entrada)" className={`w-full px-3 py-2 rounded-xl border ${inputBg}`} /></div>
              <div className="col-span-2 flex items-center gap-2 rounded-xl border px-3 py-2.5">
                <input type="checkbox" id="esp-check" checked={form.esSoloFormula} onChange={e => setForm({...form, esSoloFormula: e.target.checked})} className="w-4 h-4 accent-purple-500" />
                <label htmlFor="esp-check" className={`text-[11px] font-bold ${form.esSoloFormula ? 'text-purple-400' : textTitle}`}>Insumo de solo fórmula (ESP) — no aparece en el inventario físico ni en Kardex</label>
              </div>
              <div className="col-span-2 text-[11px] text-slate-500">Proveedor: vacío por ahora — se mapeará a Administración &gt; Proveedores.</div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowNuevo(false)} className="px-4 py-2 rounded-xl border text-xs font-bold">Cancelar</button>
              <button onClick={handleCrearInsumo} className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Guardar Insumo</button>
            </div>
          </div>
        </div>
      )}

      {showNuevaFamilia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className={`w-full max-w-sm rounded-2xl p-6 border space-y-4 ${cardBg}`}>
            <h3 className={`text-sm font-bold ${textValue}`}>Nueva Categoría</h3>
            <input value={nuevaFamiliaNombre} onChange={e => setNuevaFamiliaNombre(e.target.value)} placeholder="Ej. Embalajes, Envases PET" className={`w-full px-3 py-2 rounded-xl border ${inputBg}`} />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowNuevaFamilia(false)} className="px-4 py-2 rounded-xl border text-xs font-bold">Cancelar</button>
              <button onClick={handleCrearFamilia} className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold">Crear</button>
            </div>
          </div>
        </div>
      )}


      {modalEditarInsumo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className={`w-full max-w-xl rounded-2xl p-6 border space-y-4 shadow-2xl ${cardBg}`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
                  <SlidersHorizontal className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={`text-base font-black ${textValue}`}>Editar Insumo Maestro</h3>
                  <p className="text-[11px] text-slate-400 font-mono">Modificación integral: código, nombres, categorías y números</p>
                </div>
              </div>
              <button onClick={() => setModalEditarInsumo(null)} className="p-1.5 rounded-lg text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className={`block text-[10px] font-bold uppercase mb-1 ${textTitle}`}>Código (SKU) *</label>
                <input
                  value={modalEditForm.codigo || ''}
                  onChange={e => setModalEditForm({ ...modalEditForm, codigo: e.target.value.toUpperCase() })}
                  className={`w-full px-3 py-2 rounded-xl border font-mono font-bold text-cyan-400 ${inputBg}`}
                />
              </div>
              <div>
                <label className={`block text-[10px] font-bold uppercase mb-1 ${textTitle}`}>Unidad de Medida *</label>
                <select
                  value={modalEditForm.unidadMedida || 'GR'}
                  onChange={e => setModalEditForm({ ...modalEditForm, unidadMedida: e.target.value })}
                  className={`w-full px-3 py-2 rounded-xl border font-mono ${inputBg}`}
                >
                  <option value="GR">GR (Gramos)</option>
                  <option value="KG">KG (Kilogramos)</option>
                  <option value="L">L (Litros)</option>
                  <option value="ML">ML (Mililitros)</option>
                  <option value="UN">UN (Unidades)</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className={`block text-[10px] font-bold uppercase mb-1 ${textTitle}`}>Nombre Canónico Oficial *</label>
                <input
                  value={modalEditForm.nombre || ''}
                  onChange={e => setModalEditForm({ ...modalEditForm, nombre: e.target.value })}
                  className={`w-full px-3 py-2 rounded-xl border font-semibold ${inputBg}`}
                />
              </div>

              <div>
                <label className={`block text-[10px] font-bold uppercase mb-1 ${textTitle}`}>Categoría / Familia *</label>
                <select
                  value={modalEditForm.familiaId || ''}
                  onChange={e => setModalEditForm({ ...modalEditForm, familiaId: e.target.value })}
                  className={`w-full px-3 py-2 rounded-xl border ${inputBg}`}
                >
                  <option value="">Seleccionar categoría</option>
                  {familias.map(f => (
                    <option key={f.id} value={f.id}>{f.nombre}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-[10px] font-bold uppercase mb-1 ${textTitle}`}>Tipo Funcional</label>
                <select
                  value={modalEditForm.tipo || 'OTRO'}
                  onChange={e => setModalEditForm({ ...modalEditForm, tipo: e.target.value })}
                  className={`w-full px-3 py-2 rounded-xl border ${inputBg}`}
                >
                  <option value="BASE">BASE</option>
                  <option value="FRAGANCIA">FRAGANCIA</option>
                  <option value="PIGMENTO">PIGMENTO</option>
                  <option value="ENVASE">ENVASE</option>
                  <option value="OTRO">OTRO</option>
                </select>
              </div>

              <div>
                <label className={`block text-[10px] font-bold uppercase mb-1 ${textTitle}`}>Estado Físico / Presentación</label>
                <select
                  value={modalEditForm.estadoFisico || 'LIQUIDO'}
                  onChange={e => setModalEditForm({ ...modalEditForm, estadoFisico: e.target.value })}
                  className={`w-full px-3 py-2 rounded-xl border ${inputBg}`}
                >
                  <option value="LIQUIDO">LIQUIDO</option>
                  <option value="POLVO">POLVO</option>
                  <option value="GRANO">GRANO</option>
                  <option value="BLOQUE">BLOQUE</option>
                  <option value="CRISTAL">CRISTAL</option>
                  <option value="PASTA">PASTA</option>
                  <option value="BALDE">BALDE</option>
                  <option value="GALONERA">GALONERA</option>
                  <option value="ENVASE">ENVASE</option>
                  <option value="ACEITE ESENCIAL">ACEITE ESENCIAL</option>
                  <option value="OTRO">OTRO</option>
                </select>
              </div>

              <div className="rounded-xl border p-3 border-emerald-500/30 bg-emerald-500/5">
                <label className="block text-[10px] font-black uppercase text-emerald-400 mb-1">
                  🔢 Stock Físico Actual ({stockUnit(modalEditForm.unidadMedida)})
                </label>
                <input
                  type="number"
                  step="any"
                  value={modalEditForm.stockReal ?? 0}
                  onChange={e => setModalEditForm({ ...modalEditForm, stockReal: Number(e.target.value) })}
                  className={`w-full px-3 py-2 rounded-xl border font-mono font-black text-emerald-400 text-sm ${inputBg}`}
                />
                <span className="text-[10px] text-emerald-500/70">Registra ajuste automático en Kardex</span>
              </div>

              <div>
                <label className={`block text-[10px] font-bold uppercase mb-1 ${textTitle}`}>Stock Mínimo de Alerta ({stockUnit(modalEditForm.unidadMedida)})</label>
                <input
                  type="number"
                  step="any"
                  value={modalEditForm.stockMinimo ?? 0}
                  onChange={e => setModalEditForm({ ...modalEditForm, stockMinimo: Number(e.target.value) })}
                  className={`w-full px-3 py-2 rounded-xl border font-mono ${inputBg}`}
                />
              </div>

              <div>
                <label className={`block text-[10px] font-bold uppercase mb-1 ${textTitle}`}>Costo Unitario (S/ por {modalEditForm.unidadMedida})</label>
                <input
                  type="number"
                  step="any"
                  value={modalEditForm.costoUnitario ?? 0}
                  onChange={e => setModalEditForm({ ...modalEditForm, costoUnitario: Number(e.target.value) })}
                  className={`w-full px-3 py-2 rounded-xl border font-mono ${inputBg}`}
                />
              </div>

              <div className="col-span-2 flex items-center gap-2 rounded-xl border px-3 py-2.5">
                <input
                  type="checkbox"
                  id="modal-esp-check"
                  checked={modalEditForm.esSoloFormula ?? false}
                  onChange={e => setModalEditForm({ ...modalEditForm, esSoloFormula: e.target.checked })}
                  className="w-4 h-4 accent-purple-500"
                />
                <label htmlFor="modal-esp-check" className={`text-[11px] font-bold ${modalEditForm.esSoloFormula ? 'text-purple-400' : textTitle}`}>
                  Insumo de solo fórmula (ESP) — no aparece en el inventario físico ni en Kardex
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setModalEditarInsumo(null)}
                className="px-4 py-2 rounded-xl border text-xs font-bold hover:bg-slate-800/50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleGuardarModal}
                disabled={guardandoEdit}
                className="px-5 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold flex items-center gap-2 hover:bg-purple-500 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" /> Guardar Todos los Cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}