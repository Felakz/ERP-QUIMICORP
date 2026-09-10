'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Truck,
  Package,
  Calendar,
  Search,
  Download,
  CheckCircle2,
  Clock,
  MapPin,
  User,
  Building2,
  Loader2,
  ArrowRight,
  Tag,
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { useTheme } from '@/lib/ThemeContext';
import { apiFetch } from '@/lib/apiClient';
import { useAuth } from '@/lib/AuthContext';

export type EstadoDespacho = 'TODOS' | 'LISTO_DESPACHO' | 'ENTREGADO';

interface DespachoItem {
  id: string;
  codigoLote: string;
  guiaRemision: string;
  cliente: string;
  direccionEntrega: string;
  producto: string;
  presentacion: string;
  cantidadUnidades: number;
  volumenTotalKgLt: number;
  conductor: string;
  placaVehiculo: string;
  fechaProgramada: string;
  horaSalida?: string;
  horaEntrega?: string;
  estado: 'LISTO_DESPACHO' | 'ENTREGADO';
}

function parseNumero(texto: string | number | null | undefined): number {
  const valor = typeof texto === 'string' ? parseFloat(texto.replace(',', '.')) : Number(texto ?? 0);
  return Number.isFinite(valor) ? valor : 0;
}

function inicioSemanaISO(): string {
  const hoy = new Date();
  const dia = hoy.getDay() === 0 ? 6 : hoy.getDay() - 1; // lunes = 0
  const lunes = new Date(hoy);
  lunes.setDate(hoy.getDate() - dia);
  return lunes.toISOString().split('T')[0];
}

export default function AdministracionDespachosPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const router = useRouter();
  const { user } = useAuth();

  const [despachos, setDespachos] = useState<DespachoItem[]>([]);
  const [selectedEstado, setSelectedEstado] = useState<EstadoDespacho>('TODOS');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const puedeDespachar =
    user?.role === 'GERENCIA' ||
    user?.role === 'ADMINISTRACION' ||
    user?.role === 'GERENTE_ADMINISTRATIVO' ||
    user?.role === 'PRODUCCION_ALMACEN';

  const cardBg = isDark ? 'bg-[#0F141C] border-[#1A2232]' : 'bg-white border-slate-200 shadow-sm';
  const textTitle = isDark ? 'text-slate-400' : 'text-slate-600';
  const textValue = isDark ? 'text-white' : 'text-slate-900';
  const inputBg = isDark
    ? 'bg-[#151D2A] border-[#1A2232] text-slate-200 placeholder-slate-500 focus:border-[#00F2C3]'
    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500';

  // Cargar datos REALES: cola de despacho + órdenes de producción (etiquetado / despachado)
  useEffect(() => {
    let activo = true;
    const cargar = async () => {
      setLoading(true);
      setError('');
      try {
        const [colaRes, ordenesRes] = await Promise.all([
          apiFetch<any[]>('/produccion/etiquetas/cola'),
          apiFetch<any[]>('/produccion/ordenes'),
        ]);

        if (!activo) return;

        if (!colaRes.ok && !ordenesRes.ok) {
          setError(colaRes.error || ordenesRes.error || 'Sin acceso a los datos de despacho.');
          setLoading(false);
          return;
        }

        const colas = Array.isArray(colaRes.data) ? colaRes.data : [];
        const ordenes = Array.isArray(ordenesRes.data) ? ordenesRes.data : [];

        const colaPorLote = new Map<string, any>();
        colas.forEach((c) => {
          if (c?.loteCodigo) colaPorLote.set(c.loteCodigo, c);
        });

        const reales: DespachoItem[] = ordenes
          .filter((o) => o && (o.estado === 'EN_ETIQUETADO' || o.estado === 'DESPACHADO'))
          .map((o): DespachoItem => {
            const cola = colaPorLote.get(o.codigoLote);
            const despachado = o.estado === 'DESPACHADO';
            const cant = parseNumero(o.cantidadObtenida ?? o.cantidadPlanificada);
            const fechaRaw = o.fechaCierre || o.createdAt;
            const fecha = fechaRaw ? new Date(fechaRaw) : new Date();
            const hora =
              !Number.isNaN(fecha.getTime()) && despachado
                ? fecha.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })
                : undefined;

            return {
              id: o.id,
              codigoLote: o.codigoLote || '—',
              guiaRemision: cola?.numeroGuia || '—',
              cliente: o.clienteNombre || cola?.clienteNombre || '—',
              direccionEntrega: '—',
              producto: o.formula?.nombreProducto || cola?.productoNombre || '—',
              presentacion: cola?.tipo_envase || '—',
              cantidadUnidades: cant,
              volumenTotalKgLt: cant,
              conductor: '—',
              placaVehiculo: '—',
              fechaProgramada:
                !Number.isNaN(fecha.getTime()) ? fecha.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
              horaSalida: hora,
              horaEntrega: hora,
              estado: despachado ? 'ENTREGADO' : 'LISTO_DESPACHO',
            };
          })
          .sort((a, b) => {
            if (a.estado !== b.estado) return a.estado === 'ENTREGADO' ? -1 : 1;
            return b.fechaProgramada.localeCompare(a.fechaProgramada);
          });

        if (activo) setDespachos(reales);
      } catch (e: any) {
        if (activo) setError(e?.message || 'Error de conexión al cargar los despachos.');
      } finally {
        if (activo) setLoading(false);
      }
    };
    cargar();
    return () => {
      activo = false;
    };
  }, []);

  const semanaISO = inicioSemanaISO();

  const filteredDespachos = useMemo(() => {
    return despachos.filter((d) => {
      if (selectedEstado !== 'TODOS' && d.estado !== selectedEstado) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchCode = d.codigoLote.toLowerCase().includes(q);
        const matchGuia = d.guiaRemision.toLowerCase().includes(q);
        const matchClient = d.cliente.toLowerCase().includes(q);
        const matchProd = d.producto.toLowerCase().includes(q);
        if (!matchCode && !matchGuia && !matchClient && !matchProd) return false;
      }
      return true;
    });
  }, [despachos, selectedEstado, searchQuery]);

  // KPIs
  const totalVolumen = useMemo(
    () => despachos.reduce((acc, d) => acc + d.volumenTotalKgLt, 0),
    [despachos]
  );
  const entregadosSemana = useMemo(
    () => despachos.filter((d) => d.estado === 'ENTREGADO' && d.fechaProgramada >= semanaISO).length,
    [despachos, semanaISO]
  );
  const listos = useMemo(
    () => despachos.filter((d) => d.estado === 'LISTO_DESPACHO').length,
    [despachos]
  );
  const entregados = useMemo(
    () => despachos.filter((d) => d.estado === 'ENTREGADO').length,
    [despachos]
  );

  const handleExportExcel = () => {
    const rows = filteredDespachos.map((d) => ({
      Lote: d.codigoLote,
      Guia_Remision: d.guiaRemision,
      Cliente: d.cliente,
      Direccion: d.direccionEntrega,
      Producto: d.producto,
      Presentacion: d.presentacion,
      Unidades: d.cantidadUnidades,
      Volumen_Kg_Lt: d.volumenTotalKgLt,
      Conductor: d.conductor,
      Vehiculo: d.placaVehiculo,
      Fecha_Despacho: d.fechaProgramada,
      Hora: d.horaSalida || '—',
      Estado: d.estado,
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Despachos_Planta');
    XLSX.writeFile(wb, `Quimicorp_Despachos_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="space-y-5 font-sans min-h-screen">
      {/* 1. Header Banner Neon */}
      <div
        className={`rounded-2xl p-5 border flex flex-wrap items-center justify-between gap-4 transition-all shadow-sm ${cardBg}`}
      >
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/20 border border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className={`text-lg font-black tracking-tight ${textValue}`}>
                Lotes & Despachos de Planta
              </h1>
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                COLA DE DESPACHO REAL
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Lotes liberados por QA (pendientes de despacho) y lotes despachados, tomados directamente de producción.
            </p>
          </div>
        </div>

        {/* Botones */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {puedeDespachar && (
            <button
              onClick={() => router.push('/produccion/etiquetas')}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-black text-xs tracking-wider uppercase transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-2"
            >
              <Tag className="w-4 h-4" />
              <span>Etiquetar & Despachar</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={handleExportExcel}
            className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 ${
              isDark
                ? 'bg-[#151D2A] border-[#1A2232] text-slate-200 hover:text-cyan-400 hover:border-cyan-500/40'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Exportar .XLSX</span>
          </button>
        </div>
      </div>

      {/* 2. Cuadrícula de 4 Tarjetas KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* VOLUMEN TOTAL */}
        <div className={`rounded-2xl p-5 border transition-all card-hover-lift relative overflow-hidden group ${cardBg}`}>
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-bold tracking-widest uppercase font-mono ${textTitle}`}>
              VOLUMEN DESPACHADO
            </span>
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-blue-400 font-mono tracking-tight">
              {loading ? '…' : totalVolumen.toLocaleString('es-PE')} KG/LT
            </h3>
            <p className="text-xs text-slate-400 mt-1.5 font-sans">Carga total de lotes en planta</p>
          </div>
        </div>

        {/* DESPACHADOS ESTA SEMANA */}
        <div className={`rounded-2xl p-5 border transition-all card-hover-lift relative overflow-hidden group ${cardBg}`}>
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-bold tracking-widest uppercase font-mono ${textTitle}`}>
              DESPACHADOS SEMANA
            </span>
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-[#00F2C3]">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-[#00F2C3] font-mono tracking-tight">
              {loading ? '…' : entregadosSemana} Lotes
            </h3>
            <p className="text-xs text-slate-400 mt-1.5 font-sans">Despachados desde el lunes</p>
          </div>
        </div>

        {/* LISTOS PARA SALIDA */}
        <div className={`rounded-2xl p-5 border transition-all card-hover-lift relative overflow-hidden group ${cardBg}`}>
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-bold tracking-widest uppercase font-mono ${textTitle}`}>
              LISTOS EN RAMPA
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-amber-400 font-mono tracking-tight">
              {loading ? '…' : listos} Lotes
            </h3>
            <p className="text-xs text-slate-400 mt-1.5 font-sans">Liberados por QA, pendientes de despacho</p>
          </div>
        </div>

        {/* ENTREGADOS */}
        <div className={`rounded-2xl p-5 border transition-all card-hover-lift relative overflow-hidden group ${cardBg}`}>
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-bold tracking-widest uppercase font-mono ${textTitle}`}>
              DESPACHADOS TOTALES
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-emerald-400 font-mono tracking-tight">
              {loading ? '…' : entregados} Despachos
            </h3>
            <p className="text-xs text-slate-400 mt-1.5 font-sans">Guías registradas en el kardex</p>
          </div>
        </div>
      </div>

      {/* 3. Filtros Segmentados y Buscador */}
      <div className={`rounded-2xl border p-4 flex flex-wrap items-center justify-between gap-3 ${cardBg}`}>
        <div className="flex items-center gap-1.5 bg-[#151D2A] p-1 rounded-xl border border-[#1A2232] overflow-x-auto">
          {[
            { id: 'TODOS', label: 'Todos los Despachos' },
            { id: 'LISTO_DESPACHO', label: 'Listos en Rampa' },
            { id: 'ENTREGADO', label: 'Despachados' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedEstado(tab.id as EstadoDespacho)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                selectedEstado === tab.id
                  ? 'bg-[#00F2C3] text-slate-950 shadow-[0_0_10px_rgba(0,242,195,0.4)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por lote, guía, cliente o producto..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full rounded-xl border py-2 pl-9 pr-3 text-xs focus:outline-none transition-all ${inputBg}`}
          />
        </div>
      </div>

      {/* 4. Estado de Carga / Error / Vacío */}
      {loading && (
        <div className="flex items-center justify-center py-10 gap-2 text-slate-400 text-xs font-bold">
          <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
          Cargando cola de despacho y órdenes desde el servidor...
        </div>
      )}

      {!loading && error && (
        <div className={`rounded-2xl border p-6 text-center text-xs font-bold text-rose-400 ${cardBg}`}>
          {error}
        </div>
      )}

      {!loading && !error && filteredDespachos.length === 0 && (
        <div className={`rounded-2xl border p-10 text-center ${cardBg}`}>
          <p className="text-sm font-black text-slate-300">Sin lotes en estado de despacho</p>
          <p className="text-xs text-slate-500 mt-1">
            Los lotes liberados por QA (etiquetado) y los despachados aparecerán aquí automáticamente desde producción.
          </p>
        </div>
      )}

      {/* 5. Lista de Despachos */}
      {!loading && !error && (
        <div className="space-y-3">
          {filteredDespachos.map((d) => (
            <div
              key={d.id}
              className={`rounded-2xl border p-5 transition-all card-hover-lift ${cardBg} ${
                d.estado === 'LISTO_DESPACHO' ? 'border-amber-500/30' : 'border-emerald-500/30'
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono font-bold text-sm text-[#00F2C3]">
                      {d.guiaRemision === '—' ? d.codigoLote : d.guiaRemision}
                    </span>
                    <span className="text-[11px] font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
                      {d.codigoLote}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold font-mono border ${
                        d.estado === 'ENTREGADO'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      }`}
                    >
                      {d.estado.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-slate-400" />
                    <h3 className={`text-base font-black ${textValue}`}>{d.cliente}</h3>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span>{d.direccionEntrega}</span>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <span className={`text-[10px] font-bold uppercase ${textTitle}`}>CARGA</span>
                  <p className="text-xl font-black text-cyan-400">
                    {d.volumenTotalKgLt.toLocaleString('es-PE')} KG/LT
                  </p>
                  <span className="text-xs text-slate-300 font-sans">
                    {d.cantidadUnidades} {d.presentacion === '—' ? 'UN' : d.presentacion}
                  </span>
                </div>
              </div>

              {/* Detalle Producto */}
              <div className="mt-4 pt-3 border-t border-slate-800/60 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[#151D2A]/60 border border-[#1A2232]">
                  <p className="text-[10px] font-bold uppercase text-slate-400 mb-1">Producto Químico:</p>
                  <p className="font-black text-slate-200">{d.producto}</p>
                </div>

                <div className="p-3 rounded-xl bg-[#151D2A]/60 border border-[#1A2232] flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase text-slate-400 mb-1">Conductor Asignado:</p>
                    <p className="font-bold text-slate-200">{d.conductor === '—' ? 'Por asignar en guía' : d.conductor}</p>
                  </div>
                  <span className="font-mono text-cyan-400 font-bold bg-cyan-500/10 px-2 py-1 rounded border border-cyan-500/30">
                    {d.placaVehiculo === '—' ? '—' : d.placaVehiculo}
                  </span>
                </div>
              </div>

              {/* Footer Fechas */}
              <div className="mt-4 pt-3 border-t border-slate-800/40 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-slate-400 font-mono">
                  <span>📅 Fecha: {d.fechaProgramada}</span>
                  {d.horaSalida && <span>• 🛫 Salida: {d.horaSalida}</span>}
                  {d.horaEntrega && <span className="text-emerald-400">• 🏁 Despacho: {d.horaEntrega}</span>}
                </div>

                <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                  <User className="w-3.5 h-3.5" />
                  <span>Entregas se confirman en el módulo de Etiquetado & Despacho</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}