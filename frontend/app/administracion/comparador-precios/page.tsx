'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Scale,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  Plus,
  Search,
  Filter,
  Building2,
  Calendar,
  Layers,
  ArrowUpDown,
  History,
  FileText,
  Phone,
  Sparkles,
} from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';
import {
  InsumoQuimicoOpcion,
  CotizacionProveedorItem,
} from '@/lib/comparadorPreciosData';
import { apiFetch } from '@/lib/apiClient';

interface ProveedorReal {
  id: string;
  razonSocial: string;
  ruc: string;
  contacto?: string;
  telefono?: string;
}

export default function AdministracionComparadorPreciosPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [insumosList, setInsumosList] = useState<InsumoQuimicoOpcion[]>([]);
  const [selectedCategoria, setSelectedCategoria] = useState<string>('TODAS');
  const [selectedInsumoId, setSelectedInsumoId] = useState<string>('');
  const [cotizaciones, setCotizaciones] = useState<CotizacionProveedorItem[]>([]);
  const [loadingInsumo, setLoadingInsumo] = useState(false);
  const [loadingComparativa, setLoadingComparativa] = useState(false);

  const [proveedoresList, setProveedoresList] = useState<ProveedorReal[]>([]);

  // Modal Nueva Cotización
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProvId, setSelectedProvId] = useState('');
  const [nuevoInsumoId, setNuevoInsumoId] = useState('');
  const [nuevoPrecio, setNuevoPrecio] = useState('');
  const [nuevaMoneda, setNuevaMoneda] = useState<'SOLES' | 'USD'>('SOLES');
  const [nuevoNumCot, setNuevoNumCot] = useState('');
  const [nuevaFecha, setNuevaFecha] = useState(new Date().toISOString().split('T')[0]);
  const [nuevasObs, setNuevasObs] = useState('');
  const [guardando, setGuardando] = useState(false);

  const mapComparativaToItems = useCallback((resp: any): CotizacionProveedorItem[] => {
    const list: any[] = resp?.ranking ?? resp?.historialCompleto ?? [];
    return list.map((c) => {
      const precio = Number(c.precioUnitario) || 0;
      const varPct = c.variacionPorcentual != null ? Number(c.variacionPorcentual) : 0;
      let precioAnterior = precio;
      if (varPct !== 0 && !Number.isNaN(varPct)) {
        precioAnterior = Number((precio / (1 + varPct / 100)).toFixed(4));
      }
      return {
        id: c.id,
        proveedorId: c.proveedorId,
        proveedorNombre: c.proveedor?.razonSocial ?? '—',
        proveedorRuc: c.proveedor?.ruc ?? '',
        insumoId: c.insumoId,
        insumoNombre: c.insumo?.nombre ?? '',
        precioUnitario: precio,
        precioAnterior,
        moneda: (c.moneda || 'SOLES') as 'SOLES' | 'USD',
        unidadMedida: c.unidadMedida || 'KG',
        numCotizacion: c.numCotizacion || '—',
        fechaCotizacion: (c.fechaCotizacion || '').toString().split('T')[0],
        variacionPorcentual: varPct,
        observaciones: c.observaciones || '',
        contacto: c.proveedor?.contacto || '',
        telefono: c.proveedor?.telefono || '',
      };
    });
  }, []);

  const fetchComparativa = useCallback(
    async (insumoId: string) => {
      if (!insumoId) return;
      setLoadingComparativa(true);
      try {
        const { data, ok } = await apiFetch<any>(
          `/cotizaciones-proveedores/comparativa/${insumoId}`,
        );
        if (ok && data) {
          setCotizaciones(mapComparativaToItems(data));
        } else {
          setCotizaciones([]);
        }
      } catch {
        setCotizaciones([]);
      } finally {
        setLoadingComparativa(false);
      }
    },
    [mapComparativaToItems],
  );

  useEffect(() => {
    (async () => {
      setLoadingInsumo(true);
      try {
        const [insRes, provRes] = await Promise.all([
          apiFetch<any[]>('/insumos'),
          apiFetch<ProveedorReal[]>('/proveedores'),
        ]);
        const insumos: InsumoQuimicoOpcion[] = (insRes.data || []).map((i: any) => ({
          id: i.id,
          codigo: i.codigo,
          nombre: i.nombre,
          categoria: i.categoria || '',
          unidad: i.unidadMedida || 'KG',
          stockActual: Number(i.stockReal ?? i.stockTeorico ?? 0),
          precioReferencia: Number(i.costoUnitario ?? 0),
        }));
        setInsumosList(insumos);
        setProveedoresList(provRes.data || []);

        const primerInsumo = insumos[0]?.id || '';
        setSelectedInsumoId(primerInsumo);
        setNuevoInsumoId(primerInsumo);
        setSelectedProvId((provRes.data || [])[0]?.id || '');
        if (primerInsumo) await fetchComparativa(primerInsumo);
      } catch {
        /* silencioso */
      } finally {
        setLoadingInsumo(false);
      }
    })();
  }, [fetchComparativa]);

  const onSeleccionarInsumo = (id: string) => {
    setSelectedInsumoId(id);
    setNuevoInsumoId(id);
    fetchComparativa(id);
  };

  const selectedInsumo = insumosList.find((i) => i.id === selectedInsumoId) || insumosList[0];

  // Categorías disponibles (derivadas del catálogo real) + filtrado por categoría
  const categorias = Array.from(
    new Set(insumosList.map((i) => (i.categoria || 'SIN CATEGORÍA').trim().toUpperCase())),
  ).sort((a, b) => a.localeCompare(b));
  const insumosFiltrados =
    selectedCategoria === 'TODAS'
      ? insumosList
      : insumosList.filter((i) => (i.categoria || 'SIN CATEGORÍA').trim().toUpperCase() === selectedCategoria);

  const onSeleccionarCategoria = (cat: string) => {
    setSelectedCategoria(cat);
    const primero = cat === 'TODAS' ? insumosList[0] : insumosList.find((i) => (i.categoria || 'SIN CATEGORÍA').trim().toUpperCase() === cat);
    if (primero) {
      setSelectedInsumoId(primero.id);
      setNuevoInsumoId(primero.id);
      fetchComparativa(primero.id);
    }
  };

  // Cotizaciones para el insumo seleccionado
  const cotizacionesInsumo = cotizaciones.filter((c) => c.insumoId === selectedInsumoId);

  // Ranking ordenado de menor a mayor precio
  const ranking = [...cotizacionesInsumo].sort((a, b) => a.precioUnitario - b.precioUnitario);
  const mejorPrecioItem = ranking[0];

  // Métricas del insumo seleccionado
  const precioMinimo = ranking.length > 0 ? ranking[0].precioUnitario : 0;
  const precioMaximo = ranking.length > 0 ? ranking[ranking.length - 1].precioUnitario : 0;
  const precioPromedio =
    ranking.length > 0
      ? ranking.reduce((acc, curr) => acc + curr.precioUnitario, 0) / ranking.length
      : 0;
  const mayorAlza =
    ranking.length > 0
      ? [...ranking].sort((a, b) => (b.variacionPorcentual || 0) - (a.variacionPorcentual || 0))[0]
      : null;

  const handleCrearCotizacion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoPrecio || isNaN(Number(nuevoPrecio))) {
      alert('Ingresa un precio unitario válido');
      return;
    }
    if (!selectedProvId || !nuevoInsumoId) {
      alert('Selecciona proveedor e insumo');
      return;
    }

    const ins = insumosList.find((i) => i.id === nuevoInsumoId) || insumosList[0];
    const prov = proveedoresList.find((p) => p.id === selectedProvId);

    setGuardando(true);
    try {
      const { ok, error } = await apiFetch('/cotizaciones-proveedores', {
        method: 'POST',
        body: JSON.stringify({
          proveedorId: selectedProvId,
          insumoId: nuevoInsumoId,
          precioUnitario: Number(nuevoPrecio),
          moneda: nuevaMoneda,
          unidadMedida: ins?.unidad || 'KG',
          numCotizacion: nuevoNumCot,
          fechaCotizacion: nuevaFecha,
          observaciones: nuevasObs,
        }),
      });

      if (!ok) {
        alert('Error al registrar la cotización: ' + (error || 'intenta nuevamente'));
        return;
      }

      setModalOpen(false);
      setNuevoPrecio('');
      setNuevoNumCot('');
      setNuevasObs('');
      alert(
        `✅ Cotización registrada: ${prov?.razonSocial || ''} cotizó ${ins?.nombre || ''} a S/ ${Number(
          nuevoPrecio,
        ).toFixed(2)}. La variación se calcula en el servidor.`,
      );
      await fetchComparativa(nuevoInsumoId);
      setSelectedInsumoId(nuevoInsumoId);
    } finally {
      setGuardando(false);
    }
  };

  const cardBg = isDark ? 'bg-[#0F141C] border-[#1A2232]' : 'bg-white border-slate-200 shadow-sm';
  const tableHeaderBg = isDark
    ? 'bg-[#151D2A] text-slate-400 border-[#1A2232]'
    : 'bg-slate-100 text-slate-600 border-slate-200';

  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner */}
      <div className={`p-6 rounded-2xl border ${cardBg} space-y-4 relative overflow-hidden`}>
        {/* Ambient Glow */}
        {isDark && (
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.2)]">
                <Scale className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className={`text-xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Comparador & Auditoría de Precios de Insumos Químicos
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black font-mono bg-amber-500/10 text-amber-400 border border-amber-500/30 uppercase flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    AUDITORÍA COMPRAS
                  </span>
                </div>
                <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Análisis comparativo multi-proveedor, validación de variaciones porcentuales (%) y trazabilidad histórica mensual.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all shrink-0 card-hover-lift"
          >
            <Plus className="w-4 h-4" />
            <span>+ Registrar Cotización Mensual</span>
          </button>
        </div>

        {/* Selector de Materia Prima / Insumo por Categoría */}
        <div className="pt-3 border-t border-slate-800/40 flex flex-col gap-3 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <span className="text-xs font-black text-slate-400 flex items-center gap-1.5 shrink-0">
              <Layers className="w-4 h-4 text-cyan-400" />
              Categoría:
            </span>
            <select
              value={selectedCategoria}
              onChange={(e) => onSeleccionarCategoria(e.target.value)}
              className={`w-full sm:w-72 p-2.5 rounded-xl border font-black text-xs transition-all ${
                isDark
                  ? 'bg-[#151D2A] border-[#1A2232] text-white focus:border-cyan-500/50 focus:shadow-[0_0_10px_rgba(0,242,195,0.15)]'
                  : 'bg-slate-50 border-slate-200 text-slate-900 shadow-sm'
              }`}
            >
              <option value="TODAS">Todas las categorías ({insumosList.length})</option>
              {categorias.map((cat) => (
                <option key={cat} value={cat}>
                  {cat} ({insumosList.filter((i) => (i.categoria || 'SIN CATEGORÍA').trim().toUpperCase() === cat).length})
                </option>
              ))}
            </select>
            <span className="text-[11px] text-slate-500 font-semibold font-mono">
              {insumosFiltrados.length} insumo(s) disponibles
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 flex-1">
            {insumosFiltrados.length === 0 ? (
              <span className="text-xs text-slate-400 col-span-full py-2 font-mono">
                {loadingInsumo ? 'Cargando catálogo de insumos...' : 'No hay insumos disponibles.'}
              </span>
            ) : (
              insumosFiltrados.map((insumo) => {
                const isSelected = selectedInsumoId === insumo.id;
                return (
                  <button
                    key={insumo.id}
                    onClick={() => onSeleccionarInsumo(insumo.id)}
                    className={`px-3 py-2 rounded-xl text-left transition-all border card-hover-lift ${
                      isSelected
                        ? isDark
                          ? 'bg-[#151D2A] text-[#00F2C3] border-[#00F2C3] shadow-[0_0_12px_rgba(0,242,195,0.2)] ring-1 ring-[#00F2C3] font-black'
                          : 'bg-cyan-50 text-cyan-900 border-cyan-400 shadow-sm font-black'
                        : isDark
                        ? 'bg-[#151D2A] text-slate-300 border-[#1A2232] hover:border-slate-700 font-medium'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 font-medium'
                    }`}
                  >
                    <div className="text-[11px] truncate font-bold">{insumo.nombre}</div>
                    <div className={`text-[9px] font-mono mt-0.5 ${isSelected ? 'text-[#00F2C3] font-black' : 'opacity-70'}`}>
                      S/ {insumo.precioReferencia.toFixed(2)} /{insumo.unidad}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* 4 KPIs Métricos del Insumo Seleccionado */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`p-5 rounded-2xl border transition-all card-hover-lift ${isDark ? 'bg-[#151D2A] border-emerald-500/30 hover:border-emerald-400 hover:shadow-[0_0_15px_rgba(16,185,129,0.15)]' : 'bg-emerald-50/50 border-emerald-200 shadow-sm'}`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Mejor Precio Disponible</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black font-mono text-emerald-400 mt-1.5">
            S/ {precioMinimo.toFixed(2)} <span className="text-xs font-normal">/{selectedInsumo?.unidad ?? ''}</span>
          </p>
          <p className="text-[11px] text-slate-400 truncate mt-1">
            Proveedor: <strong className="text-slate-200">{mejorPrecioItem?.proveedorNombre || 'N/A'}</strong>
          </p>
        </div>

        <div className={`p-5 rounded-2xl border transition-all card-hover-lift ${isDark ? 'bg-[#151D2A] border-cyan-500/30 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(0,242,195,0.15)]' : 'bg-blue-50/50 border-blue-200 shadow-sm'}`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Precio Promedio Mercado</span>
            <div className="p-1.5 rounded-lg bg-cyan-500/10 text-[#00F2C3] border border-cyan-500/30">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black font-mono text-[#00F2C3] mt-1.5">
            S/ {precioPromedio.toFixed(2)} <span className="text-xs font-normal">/{selectedInsumo?.unidad ?? ''}</span>
          </p>
          <p className="text-[11px] text-slate-400 mt-1 font-mono">
            Rango: S/ {precioMinimo.toFixed(2)} - S/ {precioMaximo.toFixed(2)}
          </p>
        </div>

        <div className={`p-5 rounded-2xl border transition-all card-hover-lift ${isDark ? 'bg-[#151D2A] border-purple-500/30 hover:border-purple-400 hover:shadow-[0_0_15px_rgba(168,85,247,0.15)]' : 'bg-purple-50/50 border-purple-200 shadow-sm'}`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Proveedores Cotizantes</span>
            <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/30">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black font-mono text-purple-400 mt-1.5">
            {ranking.length} Proveedores
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Homologados en Quimicorp Perú SAC
          </p>
        </div>

        <div className={`p-5 rounded-2xl border transition-all card-hover-lift ${isDark ? 'bg-[#151D2A] border-amber-500/30 hover:border-amber-400 hover:shadow-[0_0_15px_rgba(245,158,11,0.15)]' : 'bg-amber-50/50 border-amber-200 shadow-sm'}`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Mayor Variación Registrada</span>
            <div className={`p-1.5 rounded-lg ${mayorAlza && (mayorAlza.variacionPorcentual || 0) > 0 ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'}`}>
              {mayorAlza && (mayorAlza.variacionPorcentual || 0) > 0 ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
            </div>
          </div>
          <p className={`text-2xl font-black font-mono mt-1.5 ${mayorAlza && (mayorAlza.variacionPorcentual || 0) > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
            {mayorAlza ? `${(mayorAlza.variacionPorcentual || 0) > 0 ? '+' : ''}${mayorAlza.variacionPorcentual}%` : '0.0%'}
          </p>
          <p className="text-[11px] text-slate-400 truncate mt-1">
            {mayorAlza ? mayorAlza.proveedorNombre : 'Sin variaciones'}
          </p>
        </div>
      </div>

      {/* MATRIZ COMPARATIVA DE PROVEEDORES */}
      <div className={`p-6 rounded-2xl border ${cardBg} space-y-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-cyan-400" />
            <h2 className={`text-base font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Matriz Comparativa de Proveedores para: {selectedInsumo?.nombre ?? 'Cargando...'}
            </h2>
          </div>
          <span className="text-xs font-bold text-slate-400">
            Ordenado de menor a mayor precio
          </span>
        </div>

        {ranking.length === 0 ? (
          <div className="p-8 text-center text-slate-400 italic text-xs">
            No se han registrado cotizaciones para este insumo aún. Haz clic en "+ Registrar Cotización Mensual" para comenzar.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {ranking.map((item, idx) => {
              const isWinner = idx === 0;
              const hasIncreased = (item.variacionPorcentual || 0) > 0;
              const hasDecreased = (item.variacionPorcentual || 0) < 0;

              return (
                <div
                  key={item.id}
                  className={`p-5 rounded-2xl border relative transition-all duration-200 card-hover-lift ${
                    isWinner
                      ? isDark
                        ? 'bg-[#151D2A] border-[#00F2C3] shadow-[0_0_20px_rgba(0,242,195,0.15)] ring-1 ring-[#00F2C3]'
                        : 'bg-cyan-50/60 border-cyan-400 shadow-md ring-1 ring-cyan-400'
                      : cardBg
                  }`}
                >
                  {isWinner && (
                    <span className="absolute -top-3 right-4 px-3 py-1 rounded-full text-[10px] font-black bg-[#00F2C3] text-slate-950 shadow-[0_0_12px_#00F2C3] flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      MEJOR PRECIO DE COMPRA
                    </span>
                  )}

                  <div className="space-y-3">
                    <div>
                      <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                        RUC: {item.proveedorRuc}
                      </span>
                      <h3 className={`text-sm font-black mt-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {item.proveedorNombre}
                      </h3>
                    </div>

                    {/* Precio Unitario */}
                    <div className="p-3 rounded-xl bg-slate-800/30 border border-slate-800/40 flex items-center justify-between">
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase">Precio Unitario Cotizado</span>
                        <p className={`text-xl font-black font-mono ${isWinner ? 'text-[#00F2C3]' : 'text-white'}`}>
                          S/ {item.precioUnitario.toFixed(2)}{' '}
                          <span className="text-xs text-slate-400 font-normal">/{item.unidadMedida}</span>
                        </p>
                      </div>

                      {/* Badge Variación Mes a Mes */}
                      <div className="text-right">
                        <span className="text-[9px] font-bold text-slate-400 uppercase block">Variación vs Mes Ant.</span>
                        {hasIncreased && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500/20 text-rose-400 border border-rose-500/30 inline-flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            +{item.variacionPorcentual}%
                          </span>
                        )}
                        {hasDecreased && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 inline-flex items-center gap-1">
                            <TrendingDown className="w-3 h-3" />
                            {item.variacionPorcentual}%
                          </span>
                        )}
                        {!hasIncreased && !hasDecreased && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-500/20 text-slate-400 border border-slate-500/30">
                            0.0% (Sin cambio)
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Datos de Cotización & Contacto */}
                    <div className="text-xs space-y-1 text-slate-400">
                      <div className="flex items-center justify-between">
                        <span>N° Cotización:</span>
                        <strong className="text-slate-200 font-mono">{item.numCotizacion}</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Fecha Registro:</span>
                        <span className="text-slate-300 font-mono">{item.fechaCotizacion}</span>
                      </div>
                      {item.contacto && (
                        <div className="flex items-center justify-between pt-1 border-t border-slate-800/40">
                          <span>Ejecutivo:</span>
                          <span className="text-slate-200 font-semibold">{item.contacto} ({item.telefono || '-'})</span>
                        </div>
                      )}
                    </div>

                    {item.observaciones && (
                      <p className="text-[11px] text-slate-400 italic bg-slate-800/20 p-2 rounded-lg border border-slate-800/30">
                        "{item.observaciones}"
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* HISTORIAL MENSUAL TRAZABLE */}
      <div className={`p-6 rounded-2xl border ${cardBg} space-y-4`}>
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-purple-400" />
          <h2 className={`text-base font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Historial de Cotizaciones Registradas Mes a Mes
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className={`border-b text-[10px] font-bold uppercase tracking-wider ${tableHeaderBg}`}>
                <th className="py-3 px-3">FECHA</th>
                <th className="py-3 px-3">PROVEEDOR</th>
                <th className="py-3 px-3">INSUMO QUÍMICO</th>
                <th className="py-3 px-3">N° COTIZACIÓN</th>
                <th className="py-3 px-3">PRECIO ANTERIOR</th>
                <th className="py-3 px-3">PRECIO COTIZADO</th>
                <th className="py-3 px-3">VARIACIÓN (%)</th>
                <th className="py-3 px-3 text-right">OBSERVACIONES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/20">
              {cotizaciones.map((c) => {
                const isAlza = (c.variacionPorcentual || 0) > 0;
                const isBaja = (c.variacionPorcentual || 0) < 0;

                return (
                  <tr key={c.id} className={isDark ? 'hover:bg-[#151D2A]' : 'hover:bg-slate-50'}>
                    <td className="py-3 px-3 font-mono text-slate-400">{c.fechaCotizacion}</td>
                    <td className="py-3 px-3 font-bold text-white">
                      <div>{c.proveedorNombre}</div>
                      <div className="text-[10px] font-mono text-blue-400 font-normal">RUC: {c.proveedorRuc}</div>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-200">{c.insumoNombre}</td>
                    <td className="py-3 px-3 font-mono text-amber-400">{c.numCotizacion}</td>
                    <td className="py-3 px-3 font-mono text-slate-400">
                      S/ {c.precioAnterior ? c.precioAnterior.toFixed(2) : c.precioUnitario.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 font-mono font-black text-white">
                      S/ {c.precioUnitario.toFixed(2)} /{c.unidadMedida}
                    </td>
                    <td className="py-3 px-3 font-bold">
                      {isAlza && (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-rose-500/20 text-rose-400 border border-rose-500/30">
                          +{c.variacionPorcentual}% 🔺
                        </span>
                      )}
                      {isBaja && (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          {c.variacionPorcentual}% 🔻
                        </span>
                      )}
                      {!isAlza && !isBaja && (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-slate-500/20 text-slate-400">
                          0.0% =
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right text-slate-400 italic text-[11px]">
                      {c.observaciones || '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL REGISTRAR NUEVA COTIZACIÓN */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className={`w-full max-w-lg p-6 rounded-2xl border ${cardBg} space-y-4 shadow-2xl animate-in fade-in`}>
            <div className="flex items-center justify-between border-b border-slate-800/10 pb-3">
              <h3 className={`text-base font-black flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <Plus className="w-5 h-5 text-amber-400" />
                Registrar Cotización Mensual de Proveedor
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleCrearCotizacion} className="space-y-4 text-xs">
              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                    Seleccionar Proveedor Homologado *
                  </label>
                  <select
                    value={selectedProvId}
                    onChange={(e) => setSelectedProvId(e.target.value)}
                    className={`w-full p-2.5 rounded-xl border font-bold ${
                      isDark ? 'bg-[#151D2A] border-[#1A2232] text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    {proveedoresList.length === 0 ? (
                      <option value="">Cargando proveedores...</option>
                    ) : (
                      proveedoresList.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.razonSocial} (RUC: {p.ruc})
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                    Materia Prima / Insumo Químico *
                  </label>
                  <select
                    value={nuevoInsumoId}
                    onChange={(e) => setNuevoInsumoId(e.target.value)}
                    className={`w-full p-2.5 rounded-xl border font-bold ${
                      isDark ? 'bg-[#151D2A] border-[#1A2232] text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    {(insumosFiltrados.length > 0 ? insumosFiltrados : insumosList).map((ins) => (
                      <option key={ins.id} value={ins.id}>
                        {ins.nombre} ({ins.codigo})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                      Precio Unitario (S/ o $) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      placeholder="Ej: 4.80"
                      value={nuevoPrecio}
                      onChange={(e) => setNuevoPrecio(e.target.value)}
                      className={`w-full p-2.5 rounded-xl border font-mono font-bold ${
                        isDark ? 'bg-[#151D2A] border-[#1A2232] text-white' : 'bg-slate-50 border-slate-200'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                      Moneda
                    </label>
                    <select
                      value={nuevaMoneda}
                      onChange={(e) => setNuevaMoneda(e.target.value as any)}
                      className={`w-full p-2.5 rounded-xl border font-bold ${
                        isDark ? 'bg-[#151D2A] border-[#1A2232] text-white' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <option value="SOLES">Soles (S/)</option>
                      <option value="USD">Dólares ($ USD)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                      N° Cotización / Doc
                    </label>
                    <input
                      type="text"
                      placeholder="COT-2026-001"
                      value={nuevoNumCot}
                      onChange={(e) => setNuevoNumCot(e.target.value)}
                      className={`w-full p-2.5 rounded-xl border ${
                        isDark ? 'bg-[#151D2A] border-[#1A2232] text-white' : 'bg-slate-50 border-slate-200'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                      Fecha de Cotización
                    </label>
                    <input
                      type="date"
                      value={nuevaFecha}
                      onChange={(e) => setNuevaFecha(e.target.value)}
                      className={`w-full p-2.5 rounded-xl border ${
                        isDark ? 'bg-[#151D2A] border-[#1A2232] text-white' : 'bg-slate-50 border-slate-200'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                    Observaciones / Motivo de Variación
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Incremento por flete marítimo, o descuento por compra sobre 1 tonelada"
                    value={nuevasObs}
                    onChange={(e) => setNuevasObs(e.target.value)}
                    className={`w-full p-2.5 rounded-xl border ${
                      isDark ? 'bg-[#151D2A] border-[#1A2232] text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-700 text-slate-400 hover:text-white font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={guardando}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-lg shadow-amber-500/20 disabled:opacity-50"
                >
                  {guardando ? 'Guardando...' : 'Guardar & Auditar Variación'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
