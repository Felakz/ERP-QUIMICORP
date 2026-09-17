'use client';

import React, { useEffect, useState, useMemo } from 'react';
import {
  AlertTriangle,
  Search,
  Plus,
  Loader2,
} from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';
import { apiFetch } from '@/lib/apiClient';
import { useRouter } from 'next/navigation';

interface AlertaMateriaPrima {
  id: string;
  codigoMP: string;
  nombre: string;
  stockActual: number;
  stockMinimo: number;
  unidadMedida: string;
  nivelCriticidad: 'CRITICO' | 'ALERTA';
  proveedorSugerido: string;
  diasParaAgotarse: number;
}

export default function AlertasStockPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const router = useRouter();

  const [search, setSearch] = useState('');
  const [insumos, setInsumos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const cardBg = isDark
    ? 'bg-[#0F141C] border-[#1A2232] shadow-[0_0_20px_rgba(0,242,195,0.03)]'
    : 'bg-white border-slate-200 shadow-sm';
  const textTitle = isDark ? 'text-slate-400' : 'text-slate-600';
  const textValue = isDark ? 'text-white' : 'text-slate-900';

  useEffect(() => {
    let activo = true;
    const cargar = async () => {
      setLoading(true);
      setError('');
      try {
        const { data, ok } = await apiFetch<any[]>('/inventario/insumos');
        if (activo && ok && Array.isArray(data)) {
          setInsumos(data);
        } else if (activo) {
          setError('No se pudieron cargar los insumos desde el servidor.');
        }
      } catch {
        if (activo) setError('Error de conexión al cargar los insumos.');
      } finally {
        if (activo) setLoading(false);
      }
    };
    cargar();
    return () => {
      activo = false;
    };
  }, []);

  // Insumos con stock real cero o por debajo del stock mínimo (incluye todo tipo: MP, aditivos y envases)
  const alertas = useMemo<AlertaMateriaPrima[]>(() => {
    return insumos
      .filter((i) => {
        const stock = Number(i.stockReal ?? 0);
        const min = Number(i.stockMinimo ?? 0);
        if (stock <= 0) return true;
        return min > 0 && stock < min;
      })
      .map((i) => {
        const stock = Number(i.stockReal ?? 0);
        const min = Number(i.stockMinimo ?? 0);
        const criticidad: 'CRITICO' | 'ALERTA' = stock <= 0 ? 'CRITICO' : 'ALERTA';
        const dias = min > 0 ? Math.max(0, Math.round((stock / min) * 7)) : 0;
        return {
          id: i.id,
          codigoMP: i.codigo || i.id.slice(0, 8).toUpperCase(),
          nombre: i.nombre || 'INSUMO',
          stockActual: stock,
          stockMinimo: min,
          unidadMedida: i.unidadMedida || 'UN',
          nivelCriticidad: criticidad,
          proveedorSugerido: i.familia?.nombre || '—',
          diasParaAgotarse: stock <= 0 ? 0 : dias,
        };
      })
      .sort((a, b) => {
        if (a.nivelCriticidad !== b.nivelCriticidad) return a.nivelCriticidad === 'CRITICO' ? -1 : 1;
        return a.stockActual - b.stockActual;
      });
  }, [insumos]);

  const criticos = alertas.filter((a) => a.nivelCriticidad === 'CRITICO').length;
  const enAlerta = alertas.filter((a) => a.nivelCriticidad === 'ALERTA').length;

  const alertasFiltradas = alertas.filter(
    (a) =>
      !search.trim() ||
      a.nombre.toLowerCase().includes(search.toLowerCase()) ||
      a.codigoMP.toLowerCase().includes(search.toLowerCase()) ||
      a.proveedorSugerido.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className={`p-6 rounded-2xl border flex flex-wrap items-center justify-between gap-4 relative overflow-hidden ${cardBg}`}>
        {isDark && (
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />
        )}

        <div className="flex items-center gap-3.5 relative z-10">
          <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/30 shadow-[0_0_12px_rgba(244,63,94,0.2)]">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className={`text-xl font-black tracking-tight ${textValue}`}>
                Alertas de Materia Prima & Reabastecimiento
              </h1>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black font-mono ${isDark ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30' : 'bg-rose-100 border border-rose-300 text-rose-800'} uppercase flex items-center gap-1.5`}>
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 led-pulse" />
                STOCK CRÍTICO
              </span>
            </div>
            <p className={`text-xs mt-0.5 ${textTitle}`}>
              Monitoreo en tiempo real del stock físico: insumos, aditivos y envases en cero o por debajo del mínimo.
            </p>
          </div>
        </div>

        <button
          onClick={() => router.push('/administracion/ordenes')}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-rose-500/20 transition-all card-hover-lift relative z-10"
        >
          <Plus className="w-4 h-4" />
          <span>Generar Orden de Compra (O.C.)</span>
        </button>
      </div>

      {/* 4 KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className={`rounded-2xl p-5 border space-y-1 transition-all card-hover-lift ${isDark ? 'bg-[#151D2A] border-rose-500/30 hover:border-rose-400' : 'bg-rose-50/70 border-rose-200'}`}>
          <span className={`text-[10px] font-black tracking-widest uppercase ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>STOCK CERO</span>
          <p className="text-2xl font-black font-mono text-rose-400">{loading ? '…' : criticos}</p>
          <span className="text-[10px] text-slate-500 font-semibold">Agotados, requieren compra urgente</span>
        </div>

        <div className={`rounded-2xl p-5 border space-y-1 transition-all card-hover-lift ${isDark ? 'bg-[#151D2A] border-amber-500/30 hover:border-amber-400' : 'bg-amber-50/70 border-amber-200'}`}>
          <span className={`text-[10px] font-black tracking-widest uppercase ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>BAJO MÍNIMO</span>
          <p className="text-2xl font-black font-mono text-amber-400">{loading ? '…' : enAlerta}</p>
          <span className="text-[10px] text-slate-500 font-semibold">Bajo punto de reorden</span>
        </div>

        <div className={`rounded-2xl p-5 border space-y-1 transition-all card-hover-lift ${isDark ? 'bg-[#151D2A] border-cyan-500/30 hover:border-cyan-400' : 'bg-cyan-50/70 border-cyan-200'}`}>
          <span className={`text-[10px] font-black tracking-widest uppercase ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>TOTAL EN ALERTA</span>
          <p className="text-2xl font-black font-mono text-[#00F2C3]">{loading ? '…' : alertas.length}</p>
          <span className="text-[10px] text-slate-500 font-semibold">Cero + bajo mínimo</span>
        </div>

        <div className={`rounded-2xl p-5 border space-y-1 transition-all card-hover-lift ${isDark ? 'bg-[#151D2A] border-emerald-500/30 hover:border-emerald-400' : 'bg-emerald-50/70 border-emerald-200'}`}>
          <span className={`text-[10px] font-black tracking-widest uppercase ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>INSUMOS REGISTRADOS</span>
          <p className="text-2xl font-black font-mono text-emerald-400">{loading ? '…' : insumos.length}</p>
          <span className="text-[10px] text-slate-500 font-semibold">Total en el maestro</span>
        </div>
      </div>

      {/* Tabla de Alertas */}
      <div className={`rounded-2xl p-6 border space-y-4 shadow-sm ${cardBg}`}>
        <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-3 border-slate-800/40">
          <div className="flex items-center gap-2">
            <h2 className={`text-sm font-black uppercase tracking-wider ${textValue}`}>
              Insumos Requiriendo Compra ({alertasFiltradas.length})
            </h2>
            <span className="w-2 h-2 rounded-full bg-rose-400 led-pulse" />
          </div>

          <div className="relative max-w-sm flex-1">
            <Search className="w-4 h-4 text-cyan-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Buscar por Insumo, Código o Familia..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full pl-9 pr-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                isDark
                  ? 'bg-[#151D2A] border-[#1A2232] text-white focus:border-cyan-500/50 focus:shadow-[0_0_10px_rgba(0,242,195,0.15)] placeholder-slate-500'
                  : 'bg-slate-50 border-slate-200 text-slate-900 shadow-sm placeholder-slate-400'
              }`}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-10 gap-2 text-slate-400 text-xs font-bold">
            <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
            Cargando stock real del maestro de inventario...
          </div>
        ) : error ? (
          <div className="py-10 text-center text-xs font-bold text-rose-400">{error}</div>
        ) : alertas.length === 0 ? (
          <div className="py-10 text-center text-xs font-bold text-emerald-400">
            ✓ Sin alertas: todo el stock está por encima del mínimo registrado.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className={`border-b text-[10px] uppercase font-black tracking-wider ${
                  isDark ? 'border-[#1A2232] text-slate-400 bg-[#151D2A]/50' : 'border-slate-200 text-slate-700 bg-slate-50'
                }`}>
                  <th className="py-3 px-3">CÓDIGO</th>
                  <th className="py-3 px-3">MATERIA PRIMA</th>
                  <th className="py-3 px-3">FAMILIA / PROVEEDOR</th>
                  <th className="py-3 px-3 text-right">STOCK ACTUAL</th>
                  <th className="py-3 px-3 text-right">STOCK MÍNIMO</th>
                  <th className="py-3 px-3 text-center">AUTONOMÍA</th>
                  <th className="py-3 px-3 text-center">CRITICIDAD</th>
                  <th className="py-3 px-3 text-center">ACCIONES</th>
                </tr>
              </thead>
              <tbody className={`divide-y font-mono text-[11px] ${
                isDark ? 'divide-slate-800/40' : 'divide-slate-100'
              }`}>
                {alertasFiltradas.map((a) => (
                  <tr key={a.id} className={`transition-colors ${isDark ? 'hover:bg-[#151D2A]' : 'hover:bg-slate-50'}`}>
                    <td className="py-3 px-3 font-black text-amber-400">{a.codigoMP}</td>
                    <td className="py-3 px-3 font-sans font-black text-slate-200">{a.nombre}</td>
                    <td className="py-3 px-3 font-sans text-slate-400 font-semibold">{a.proveedorSugerido}</td>
                    <td className="py-3 px-3 text-right font-black text-rose-400">{a.stockActual} {a.unidadMedida}</td>
                    <td className="py-3 px-3 text-right text-slate-400 font-bold">{a.stockMinimo} {a.unidadMedida}</td>
                    <td className="py-3 px-3 text-center font-black text-amber-400">{a.diasParaAgotarse} días</td>
                    <td className="py-3 px-3 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase inline-flex items-center gap-1 ${
                        a.nivelCriticidad === 'CRITICO'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-[0_0_8px_rgba(244,63,94,0.3)] animate-pulse'
                          : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${a.nivelCriticidad === 'CRITICO' ? 'bg-rose-400 led-pulse' : 'bg-amber-400'}`} />
                        {a.nivelCriticidad}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={async () => {
                          // Verificar si tiene cotizaciones/proveedor
                          try {
                            const { data } = await apiFetch(`/cotizaciones-proveedores?insumoId=${a.id}`);
                            if (!data || (Array.isArray(data) && data.length === 0)) {
                              alert(`⚠️ ${a.nombre} no tiene proveedor registrado. Agrégalo en Comparador de Precios antes de comprar.`);
                              router.push(`/administracion/comparador-precios?insumo=${encodeURIComponent(a.nombre)}`);
                              return;
                            }
                          } catch {}
                          router.push(`/administracion/comparador-precios?insumo=${encodeURIComponent(a.nombre)}`);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-cyan-500/10 text-[#00F2C3] border border-cyan-500/30 hover:bg-cyan-500/20 text-[10px] font-black font-sans transition-all card-hover-lift"
                      >
                        Comprar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}