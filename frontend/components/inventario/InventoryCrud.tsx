'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Package, Plus, Search, Edit3, Save, X, RefreshCw, Tag, CheckCircle2, Trash2 } from 'lucide-react';
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
}

export function InventoryCrud() {
  const { theme } = useTheme();
  const { socket } = useSocket();
  const isDark = theme === 'dark';

  const [insumos, setInsumos] = useState<Insumo[]>([]);
  const [familias, setFamilias] = useState<FamiliaInsumo[]>([]);
  const [search, setSearch] = useState('');
  const [familiaFiltro, setFamiliaFiltro] = useState('TODAS');
  const [loading, setLoading] = useState(true);
  const [showNuevo, setShowNuevo] = useState(false);
  const [showNuevaFamilia, setShowNuevaFamilia] = useState(false);
  const [nuevaFamiliaNombre, setNuevaFamiliaNombre] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Insumo>>({});

  const [form, setForm] = useState({ codigo: '', nombre: '', familiaId: '', unidadMedida: 'KG', tipo: 'BASE', estadoFisico: 'LIQUIDO', stockMinimo: 0, costoUnitario: 0 });

  const cardBg = isDark ? 'bg-[#0F141C] border-[#1A2232]' : 'bg-white border-slate-200 shadow-sm';
  const textTitle = isDark ? 'text-slate-400' : 'text-slate-600';
  const textValue = isDark ? 'text-white' : 'text-slate-900';
  const inputBg = isDark ? 'bg-[#151D2A] border-[#1A2232] text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-900';

  const cargar = useCallback(async () => {
    setLoading(true);
    const [insRes, famRes] = await Promise.all([
      apiFetch<Insumo[]>(`/inventario/insumos${search ? `?search=${encodeURIComponent(search)}` : ''}`),
      apiFetch<FamiliaInsumo[]>('/inventario/familias'),
    ]);
    if (insRes.ok && Array.isArray(insRes.data)) setInsumos(insRes.data as Insumo[]);
    if (famRes.ok && Array.isArray(famRes.data)) setFamilias(famRes.data as FamiliaInsumo[]);
    setLoading(false);
  }, [search]);

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
    if (ok) { setShowNuevo(false); setForm({ codigo: '', nombre: '', familiaId: '', unidadMedida: 'KG', tipo: 'BASE', estadoFisico: 'LIQUIDO', stockMinimo: 0, costoUnitario: 0 }); cargar(); }
    else alert(error || 'Error al crear');
  };

  const filtered = insumos.filter(i => familiaFiltro === 'TODAS' || i.familiaId === familiaFiltro);

  return (
    <div className="space-y-6">
      <div className={`p-6 rounded-2xl border ${cardBg}`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400"><Package className="w-6 h-6" /></div>
            <div>
              <h1 className={`text-xl font-black ${textValue}`}>Gestión de Insumos</h1>
              <p className={`text-xs ${textTitle}`}>Maestro de insumos con FK fija (DNI) — vinculado a Fórmulas y Kardex en tiempo real. Proveedor vacío por ahora.</p>
              <p className="text-[11px] font-mono text-slate-500 mt-1">FK front: <code>insumo.id</code> (uuid) • Código visible: <code>insumo.codigo</code> (SKU)</p>
            </div>
          </div>
          <button onClick={() => setShowNuevo(true)} className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold flex items-center gap-2 hover:bg-blue-500"><Plus className="w-4 h-4" /> Nuevo Insumo</button>
        </div>
      </div>

      <div className={`p-4 rounded-xl border flex flex-wrap items-center justify-between gap-3 ${cardBg}`}>
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por código o nombre (FK)..." className={`w-full pl-9 pr-3 py-2 rounded-xl border text-xs ${inputBg}`} />
        </div>
        <select value={familiaFiltro} onChange={e => setFamiliaFiltro(e.target.value)} className={`px-3 py-2 rounded-xl border text-xs font-bold ${inputBg}`}>
          <option value="TODAS">Todas las categorías</option>
          {familias.map(f => <option key={f.id} value={f.id}>{f.nombre}</option>)}
        </select>
        <button onClick={() => setShowNuevaFamilia(true)} className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 ${isDark ? 'border-blue-500/30 text-blue-400 hover:bg-blue-500/10' : 'border-blue-300 text-blue-700 hover:bg-blue-50'}`}><Tag className="w-3.5 h-3.5" /> Nueva Categoría</button>
        <button onClick={cargar} className={`p-2 rounded-xl border ${isDark ? 'border-slate-700 text-slate-400' : 'border-slate-300 text-slate-600'}`}><RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /></button>
      </div>

      <div className={`rounded-xl border overflow-hidden ${cardBg}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className={`border-b text-[10px] font-bold uppercase tracking-wider ${isDark ? 'bg-[#151D2A] text-slate-400 border-[#1A2232]' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
              <tr>
                <th className="p-3">FK (ID)</th>
                <th className="p-3">Código (SKU)</th>
                <th className="p-3">Nombre</th>
                <th className="p-3">Categoría</th>
                <th className="p-3">Unidad</th>
                <th className="p-3">Tipo</th>
                <th className="p-3">Estado Físico</th>
                <th className="p-3 text-right">Stock</th>
                <th className="p-3 text-center">Acción</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-slate-800/60' : 'divide-slate-200'}`}>
              {loading ? (
                <tr><td colSpan={9} className="p-8 text-center text-slate-500">Cargando maestro...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={9} className="p-8 text-center text-slate-500">Sin insumos — registra el primero con “Nuevo Insumo”.</td></tr>
              ) : filtered.map(ins => (
                <tr key={ins.id} className={isDark ? 'hover:bg-slate-800/30' : 'hover:bg-slate-50'}>
                  <td className="p-3 font-mono text-[10px] text-slate-500 truncate max-w-[120px]" title={ins.id}>{ins.id.slice(0,8)}…</td>
                  <td className="p-3 font-mono font-bold text-cyan-500">{ins.codigo}</td>
                  <td className="p-3 font-medium">{editId === ins.id ? <input value={editData.nombre || ''} onChange={e => setEditData({...editData, nombre: e.target.value})} className={`w-full px-2 py-1 rounded border text-xs ${inputBg}`} /> : ins.nombre}</td>
                  <td className="p-3">{ins.familia?.nombre || '—'}</td>
                  <td className="p-3 font-mono">{ins.unidadMedida}</td>
                  <td className="p-3">{ins.tipo || '—'}</td>
                  <td className="p-3">
                    <span className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${isDark ? 'bg-slate-700/50 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                      {ins.estadoFisico || '—'}
                    </span>
                  </td>
                  <td className="p-3 text-right font-mono">{Number(ins.stockReal ?? 0).toLocaleString()}</td>
                  <td className="p-3 text-center">
                    {editId === ins.id ? (
                      <span className="inline-flex gap-1">
                        <button onClick={async () => { await apiFetch(`/inventario/insumos/${ins.id}`, { method: 'PATCH', body: JSON.stringify(editData) }); setEditId(null); cargar(); }} className="p-1.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"><Save className="w-3.5 h-3.5" /></button>
                        <button onClick={() => setEditId(null)} className="p-1.5 rounded bg-slate-500/10 text-slate-400 border"><X className="w-3.5 h-3.5" /></button>
                      </span>
                    ) : (
                      <span className="inline-flex gap-1">
                        <button onClick={() => { setEditId(ins.id); setEditData({ nombre: ins.nombre }); }} className="p-1.5 rounded border text-slate-400 hover:text-white"><Edit3 className="w-3.5 h-3.5" /></button>
                        <button onClick={async () => { if (!confirm(`¿Eliminar ${ins.codigo} — ${ins.nombre}? Si está usado en fórmulas/Kardex se desactivará.`)) return; const { ok, error } = await apiFetch(`/inventario/insumos/${ins.id}/eliminar`, { method: 'POST' }); if (ok) cargar(); else alert(error || 'No se pudo eliminar'); }} className="p-1.5 rounded border text-rose-400 hover:text-white hover:bg-rose-500/10 border-rose-500/20" title="Eliminar"><Trash2 className="w-3.5 h-3.5" /></button>
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
            <h3 className={`text-sm font-bold ${textValue}`}>Registrar Insumo (FK fija)</h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div><label className={`block text-[10px] font-bold uppercase mb-1 ${textTitle}`}>Código (SKU) *</label><input value={form.codigo} onChange={e => setForm({...form, codigo: e.target.value})} placeholder="INS-XXX" className={`w-full px-3 py-2 rounded-xl border font-mono ${inputBg}`} /></div>
              <div><label className={`block text-[10px] font-bold uppercase mb-1 ${textTitle}`}>Unidad *</label><select value={form.unidadMedida} onChange={e => setForm({...form, unidadMedida: e.target.value})} className={`w-full px-3 py-2 rounded-xl border ${inputBg}`}><option>KG</option><option>L</option><option>GR</option><option>UN</option></select></div>
              <div className="col-span-2"><label className={`block text-[10px] font-bold uppercase mb-1 ${textTitle}`}>Nombre canónico *</label><input value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} className={`w-full px-3 py-2 rounded-xl border ${inputBg}`} /></div>
              <div><label className={`block text-[10px] font-bold uppercase mb-1 ${textTitle}`}>Categoría *</label><select value={form.familiaId} onChange={e => setForm({...form, familiaId: e.target.value})} className={`w-full px-3 py-2 rounded-xl border ${inputBg}`}><option value="">Seleccionar</option>{familias.map(f => <option key={f.id} value={f.id}>{f.nombre}</option>)}</select></div>
              <div><label className={`block text-[10px] font-bold uppercase mb-1 ${textTitle}`}>Tipo</label><select value={form.tipo} onChange={e => setForm({...form, tipo: e.target.value})} className={`w-full px-3 py-2 rounded-xl border ${inputBg}`}><option>BASE</option><option>FRAGANCIA</option><option>PIGMENTO</option><option>ENVASE</option><option>OTRO</option></select></div>
              <div><label className={`block text-[10px] font-bold uppercase mb-1 ${textTitle}`}>Estado Físico</label><select value={form.estadoFisico} onChange={e => setForm({...form, estadoFisico: e.target.value})} className={`w-full px-3 py-2 rounded-xl border ${inputBg}`}><option>LIQUIDO</option><option>POLVO</option><option>GRANO</option><option>BLOQUE</option><option>CRISTAL</option><option>PASTA</option><option>OTRO</option></select></div>
              <div><label className={`block text-[10px] font-bold uppercase mb-1 ${textTitle}`}>Stock Mínimo</label><input type="number" value={form.stockMinimo} onChange={e => setForm({...form, stockMinimo: Number(e.target.value)})} className={`w-full px-3 py-2 rounded-xl border ${inputBg}`} /></div>
              <div><label className={`block text-[10px] font-bold uppercase mb-1 ${textTitle}`}>Costo Unitario</label><input type="number" value={form.costoUnitario} onChange={e => setForm({...form, costoUnitario: Number(e.target.value)})} className={`w-full px-3 py-2 rounded-xl border ${inputBg}`} /></div>
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
    </div>
  );
}