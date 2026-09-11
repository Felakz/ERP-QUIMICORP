'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Receipt,
  Search,
  RefreshCw,
  Calendar,
  Table2,
  TrendingDown,
  AlertTriangle,
  Wallet,
  CheckCircle2,
  Coins,
  PiggyBank,
  Landmark,
  Scale,
  ArrowRight,
} from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';
import { apiFetch } from '@/lib/apiClient';

interface PagoItem {
  id: string;
  montoAbonado: number;
  fechaAbono: string;
  medio?: string | null;
  banco?: string | null;
  numOperacion?: string | null;
  observaciones?: string | null;
}

interface FacturaRow {
  id: string;
  codigoDoc: string;
  clienteId?: string | null;
  clienteNombre: string;
  clienteRuc: string;
  ordenProd?: string | null;
  codigoPedido?: string | null;
  producto?: string | null;
  montoTotal: number;
  saldoPendiente: number;
  pagado: number;
  condicionPago?: string | null;
  diasPlazo?: number;
  medioPago?: string | null;
  canalBanco?: string | null;
  emitidoPor?: string | null;
  fechaEmision: string;
  fechaVencimiento: string;
  fechaEntrega?: string | null;
  estadoEntrega?: string | null;
  estadoPago: string;
  diasParaVencer?: number | null;
  semaforo: string;
  pagos: PagoItem[];
  limiteCredito?: number | null;
  diasCreditoMax?: number | null;
}

interface ResumenData {
  totalPorCobrar: number;
  totalVencido: number;
  totalPendiente: number;
  cobradoMes: number;
  cantidadVencidas: number;
  cantidadPendientes: number;
  cantidadPagadas: number;
  aging: { label: string; valor: number }[];
  mediosPago: { medio: string; total: number }[];
}

const fmt = (n: number, currency: string, igv: boolean, tc: number) => {
  let v = n;
  if (igv) v = v * 1.18;
  if (currency === 'USD') v = v / (tc || 1);
  const prefix = currency === 'USD' ? '$' : 'S/';
  return `${prefix} ${v.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const fmtDate = (iso?: string | null) => (iso ? new Date(iso).toISOString().split('T')[0] : '—');

export default function FacturacionPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const cardBg = isDark ? 'bg-[#0D1421] border-[#1A2232]' : 'bg-white border-slate-200';
  const textTitle = isDark ? 'text-slate-300' : 'text-slate-700';
  const textValue = isDark ? 'text-slate-100' : 'text-slate-900';
  const textMuted = isDark ? 'text-slate-400' : 'text-slate-500';
  const inputBg = isDark ? 'bg-[#151D2A] border-[#1A2232] text-slate-200' : 'bg-white border-slate-300 text-slate-800';

  const [filas, setFilas] = useState<FacturaRow[]>([]);
  const [resumen, setResumen] = useState<ResumenData | null>(null);
  const [loading, setLoading] = useState(true);
  const [vista, setVista] = useState<'tabla' | 'calendario'>('tabla');

  const [estado, setEstado] = useState('TODOS');
  const [proximo, setProximo] = useState('TODOS');
  const [condicion, setCondicion] = useState('TODOS');
  const [search, setSearch] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  const [incluyeIgv, setIncluyeIgv] = useState(false);
  const [currency, setCurrency] = useState('PEN');
  const [tipoCambio, setTipoCambio] = useState(3.75);

  const cargarResumen = useCallback(async () => {
    try {
      const res = await apiFetch(`/facturacion/resumen`);
      if (res.data) setResumen(res.data);
    } catch {
      setResumen(null);
    }
  }, []);

  useEffect(() => {
    cargarResumen();
  }, [cargarResumen]);

  useEffect(() => {
    let activo = true;
    setLoading(true);
    const qs = new URLSearchParams();
    if (estado && estado !== 'TODOS') qs.set('estado', estado);
    if (proximo && proximo !== 'TODOS') qs.set('proximo', proximo);
    if (condicion && condicion !== 'TODOS') qs.set('condicion', condicion);
    if (search.trim()) qs.set('search', search.trim());

    const url = `/facturacion?${qs.toString()}`;
    apiFetch<FacturaRow[]>(url)
      .then((res) => {
        if (activo) setFilas(res.data || []);
      })
      .catch(() => {
        if (activo) setFilas([]);
      })
      .finally(() => {
        if (activo) setLoading(false);
      });
    return () => {
      activo = false;
    };
  }, [estado, proximo, condicion, search, reloadKey]);

  const refetch = () => {
    cargarResumen();
    setReloadKey((k) => k + 1);
  };

  const kpis = resumen;
  const maxAging = resumen?.aging.reduce((a, b) => Math.max(a, b.valor), 0) || 1;
  const porVencer30 = filas
    .filter(
      (f) =>
        f.estadoPago !== 'VENCIDO' &&
        f.saldoPendiente > 0 &&
        f.diasParaVencer !== null &&
        f.diasParaVencer! >= 0 &&
        f.diasParaVencer! <= 30,
    )
    .reduce((a, f) => a + Number(f.saldoPendiente) || 0, 0);

  const calendario: { fecha: string; items: FacturaRow[] }[] = [];
  if (vista === 'calendario') {
    const hoy = new Date();
    const inicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    const fin = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);
    for (let d = new Date(inicio); d <= fin; d.setDate(d.getDate() + 1)) {
      const iso = d.toISOString().split('T')[0];
      const items = filas.filter(
        (f) => f.saldoPendiente > 0 && fmtDate(f.fechaVencimiento) === iso,
      );
      calendario.push({ fecha: iso, items });
    }
  }

  const chip = (sel: boolean) =>
    sel
      ? 'bg-[#00F2C3] text-slate-950 shadow-md shadow-[#00F2C3]/30 font-black'
      : isDark
        ? 'bg-[#151D2A] text-slate-300 border border-[#1A2232] hover:text-white hover:border-slate-600'
        : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200';

  const semaforoColor = (s: string) =>
    s === 'verde'
      ? 'bg-emerald-500'
      : s === 'ambar'
        ? 'bg-amber-400'
        : s === 'gris'
          ? 'bg-slate-400'
          : 'bg-rose-500';

  return (
    <div className="space-y-6 font-sans min-h-screen">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className={`flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-sm ${cardBg}`}>
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-orange-500/20 to-pink-500/20 text-orange-400">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <h1 className={`text-sm font-black uppercase tracking-wide ${textValue}`}>
              Facturación & Cobranzas
            </h1>
            <p className={`text-[11px] ${textMuted}`}>
              Panorama financiero unificado: comprobantes, vencimientos y cobranza.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className={`flex items-center rounded-xl border p-1 ${cardBg}`}>
            <button
              onClick={() => setVista('tabla')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                vista === 'tabla' ? chip(true) : ''
              } ${vista !== 'tabla' ? (isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800') : ''}`}
            >
              <Table2 className="w-3.5 h-3.5" /> Tabla
            </button>
            <button
              onClick={() => setVista('calendario')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                vista === 'calendario' ? chip(true) : ''
              } ${vista !== 'calendario' ? (isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800') : ''}`}
            >
              <Calendar className="w-3.5 h-3.5" /> Calendario
            </button>
          </div>
          <button
            onClick={refetch}
            className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${cardBg} ${
              isDark ? 'text-slate-300 hover:text-white hover:border-slate-500' : 'text-slate-600 hover:text-slate-900 hover:border-slate-400'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" /> Actualizar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          {
            label: 'Total por Cobrar',
            valor: kpis?.totalPorCobrar ?? 0,
            icon: Wallet,
            accent: 'text-amber-400',
            bg: 'from-amber-500/15 to-yellow-500/10',
            sub: `${kpis?.cantidadPendientes ?? 0} facturas por cobrar`,
          },
          {
            label: 'Vencido',
            valor: kpis?.totalVencido ?? 0,
            icon: AlertTriangle,
            accent: 'text-rose-400',
            bg: 'from-rose-500/15 to-red-500/10',
            sub: `${kpis?.cantidadVencidas ?? 0} facturas vencidas`,
          },
          {
            label: 'Por Vencer (30 días)',
            valor: porVencer30,
            icon: Calendar,
            accent: 'text-sky-400',
            bg: 'from-sky-500/15 to-cyan-500/10',
            sub: 'próximos 30 días de agenda',
          },
          {
            label: 'Cobrado del Mes',
            valor: kpis?.cobradoMes ?? 0,
            icon: PiggyBank,
            accent: 'text-emerald-400',
            bg: 'from-emerald-500/15 to-teal-500/10',
            sub: `${kpis?.cantidadPagadas ?? 0} facturas liquidadas`,
          },
        ].map((k) => (
          <div key={k.label} className={`rounded-2xl border p-4 shadow-sm bg-gradient-to-br ${cardBg} ${k.bg}`}>
            <div className="flex items-center justify-between">
              <p className={`text-[10px] font-black uppercase tracking-wide ${textMuted}`}>{k.label}</p>
              <k.icon className={`w-4 h-4 ${k.accent}`} />
            </div>
            <p className={`text-xl font-black mt-1 ${textValue}`}>
              {fmt(k.valor, currency, incluyeIgv, tipoCambio)}
            </p>
            <p className={`text-[10px] mt-0.5 ${textMuted}`}>{k.sub}</p>
          </div>
        ))}
      </div>

      <div className={`rounded-2xl border p-4 space-y-3 shadow-sm ${cardBg}`}>
        <div className="flex flex-wrap items-center gap-3">
          <div className={`flex items-center rounded-xl border p-0.5 ${cardBg}`}>
            <button
              onClick={() => setIncluyeIgv(false)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${!incluyeIgv ? chip(true) : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Neto
            </button>
            <button
              onClick={() => setIncluyeIgv(true)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${incluyeIgv ? chip(true) : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Con IGV (18%)
            </button>
          </div>

          <div className={`flex items-center rounded-xl border p-0.5 ${cardBg}`}>
            <button
              onClick={() => setCurrency('PEN')}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${currency === 'PEN' ? chip(true) : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'}`}
            >
              S/ PEN
            </button>
            <button
              onClick={() => setCurrency('USD')}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${currency === 'USD' ? chip(true) : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'}`}
            >
              $ USD
            </button>
            {currency === 'USD' && (
              <div className="flex items-center gap-1 pl-1">
                <span className={`text-[11px] font-bold ${textMuted}`}>TC</span>
                <input
                  type="number"
                  step="0.01"
                  value={tipoCambio}
                  onChange={(e) => setTipoCambio(Number(e.target.value) || 1)}
                  className={`w-16 px-2 py-1 rounded-lg border text-xs font-bold outline-none ${inputBg}`}
                />
              </div>
            )}
          </div>

          <div className="flex-1" />

          <label className={`flex items-center gap-1 ${textMuted}`}>
            <Landmark className="w-3.5 h-3.5" />
            <span className="text-[11px] font-bold uppercase">Condición:</span>
          </label>
          <div className="flex items-center gap-1">
            {[
              ['TODOS', 'Todas'],
              ['CONTADO', 'Contado'],
              ['CREDITO', 'Crédito'],
            ].map(([id, label]) => (
              <button
                key={id}
                onClick={() => setCondicion(id)}
                className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition-all ${condicion === id ? chip(true) : isDark ? 'text-slate-400 hover:text-white border border-[#1A2232]' : 'text-slate-500 hover:text-slate-800 border border-slate-200'}`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1">
            {[
              ['TODOS', 'Todos'],
              ['7', '7d'],
              ['15', '15d'],
              ['30', '30d'],
            ].map(([id, label]) => (
              <button
                key={id}
                onClick={() => setProximo(id)}
                className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition-all ${proximo === id ? chip(true) : isDark ? 'text-slate-400 hover:text-white border border-[#1A2232]' : 'text-slate-500 hover:text-slate-800 border border-slate-200'}`}
                title="Vence en los próximos N días"
              >
                {label === 'Todos' ? 'Todos' : `${label}`}
              </button>
            ))}
            <span className={`ml-1 text-[10px] font-bold uppercase ${textMuted}`}>por vencer</span>
          </div>

          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar cliente, OP, doc..."
              className={`w-56 pl-8 pr-3 py-2 rounded-xl border text-xs font-semibold outline-none ${inputBg}`}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {[
            ['TODOS', 'Todos'],
            ['PENDIENTE', 'Pendientes'],
            ['VENCIDO', 'Vencidos'],
            ['PAGADO', 'Pagados'],
          ].map(([id, label]) => (
            <button
              key={id}
              onClick={() => setEstado(id)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all ${
                estado === id
                  ? id === 'VENCIDO'
                    ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
                    : id === 'PAGADO'
                      ? 'bg-blue-500 text-white shadow-md shadow-blue-500/30'
                      : chip(true)
                  : isDark
                    ? 'text-slate-400 hover:text-white border border-[#1A2232]'
                    : 'text-slate-500 hover:text-slate-800 border border-slate-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-3">
        <div className={`rounded-2xl border p-4 shadow-sm ${cardBg}`}>
          <p className={`text-[10px] font-black uppercase tracking-wide ${textTitle}`}>
            Cartera por Antigüedad (vencido)
          </p>
          <div className="mt-3 space-y-2">
            {(resumen?.aging || []).map((a) => (
              <div key={a.label}>
                <div className="flex justify-between text-[11px] font-bold mb-0.5">
                  <span className={textMuted}>{a.label} días</span>
                  <span className={textValue}>{fmt(a.valor, currency, incluyeIgv, tipoCambio)}</span>
                </div>
                <div className="h-2 rounded-full bg-slate-800/40 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${a.label === '90+' ? 'bg-rose-500' : a.label === '61-90' ? 'bg-orange-500' : a.label === '31-60' ? 'bg-amber-400' : 'bg-emerald-500'}`}
                    style={{ width: `${Math.max(4, (a.valor / maxAging) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`rounded-2xl border p-4 shadow-sm ${cardBg}`}>
          <p className={`text-[10px] font-black uppercase tracking-wide ${textTitle}`}>
            Medios de Pago del Mes
          </p>
          <div className="mt-3 space-y-2">
            {(resumen?.mediosPago || []).length === 0 && (
              <p className={`text-[11px] ${textMuted}`}>Sin abonos registrados este mes.</p>
            )}
            {(resumen?.mediosPago || []).map((m) => (
              <div key={m.medio} className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-[11px] font-bold">
                  <Coins className="w-3.5 h-3.5 text-emerald-400" />
                  <span className={textValue}>{m.medio}</span>
                </span>
                <span className={`text-[11px] font-black ${textValue}`}>
                  {fmt(m.total, currency, incluyeIgv, tipoCambio)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className={`rounded-2xl border p-4 shadow-sm ${cardBg}`}>
          <p className={`text-[10px] font-black uppercase tracking-wide ${textTitle}`}>
            Resumen de Cartera
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <p className="text-[10px] font-bold uppercase text-amber-400">Por vencer</p>
              <p className="text-sm font-black text-slate-100">
                {fmt(kpis?.totalPendiente ?? 0, currency, incluyeIgv, tipoCambio)}
              </p>
              <p className="text-[9px] text-slate-400">{kpis?.cantidadPendientes ?? 0} facturas</p>
            </div>
            <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20">
              <p className="text-[10px] font-bold uppercase text-rose-400">Vencido</p>
              <p className="text-sm font-black text-slate-100">
                {fmt(kpis?.totalVencido ?? 0, currency, incluyeIgv, tipoCambio)}
              </p>
              <p className="text-[9px] text-slate-400">{kpis?.cantidadVencidas ?? 0} facturas</p>
            </div>
            <div className="col-span-2 flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <span className="text-[10px] font-bold uppercase text-emerald-400">Cobrado del mes</span>
              <span className="text-sm font-black text-slate-100">
                {fmt(kpis?.cobradoMes ?? 0, currency, incluyeIgv, tipoCambio)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {vista === 'tabla' ? (
        <div className={`rounded-2xl border shadow-sm overflow-hidden ${cardBg}`}>
          <div className={`flex items-center justify-between px-4 py-3 border-b ${isDark ? 'border-[#1A2232]' : 'border-slate-200'}`}>
            <p className={`text-[11px] font-black uppercase tracking-wide ${textValue}`}>
              Comprobantes ({filas.length})
            </p>
            <p className={`text-[10px] ${textMuted}`}>
              Moneda {currency} · {incluyeIgv ? 'Con IGV 18%' : 'Neto'}
            </p>
          </div>
          {loading ? (
            <div className="p-10 text-center text-xs font-bold text-slate-400">Cargando...</div>
          ) : filas.length === 0 ? (
            <div className="p-10 text-center text-xs font-bold text-slate-400">
              No hay comprobantes para estos filtros.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className={`text-[9px] uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                    <th className="text-left px-3 py-2.5 font-black">Documento</th>
                    <th className="text-left px-3 py-2.5 font-black">Cliente</th>
                    <th className="text-left px-3 py-2.5 font-black">Pedido / OP</th>
                    <th className="text-left px-3 py-2.5 font-black">Vencimiento</th>
                    <th className="text-center px-3 py-2.5 font-black">Semaforo</th>
                    <th className="text-right px-3 py-2.5 font-black">Monto</th>
                    <th className="text-right px-3 py-2.5 font-black">Saldo</th>
                    <th className="text-center px-3 py-2.5 font-black">Pago</th>
                    <th className="text-center px-3 py-2.5 font-black">Entrega</th>
                    <th className="text-center px-3 py-2.5 font-black"></th>
                  </tr>
                </thead>
                <tbody>
                  {filas.map((f) => {
                    const estadoPago =
                      f.estadoPago === 'PAGADO'
                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                        : f.estadoPago === 'VENCIDO'
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/30';
                    const entrega =
                      f.estadoEntrega === 'ENTREGADO' || f.estadoEntrega === 'DESPACHADO';
                    return (
                      <tr
                        key={f.id}
                        className={`border-t ${isDark ? 'border-[#131A29] hover:bg-slate-800/30' : 'border-slate-100 hover:bg-slate-50'} transition-colors`}
                      >
                        <td className="px-3 py-3">
                          <div className="flex flex-col gap-1">
                            <span className={`font-mono text-[11px] font-black ${f.estadoPago === 'VENCIDO' ? 'text-rose-400' : textValue}`}>
                              {f.codigoDoc}
                            </span>
                            <span className={`text-[9px] ${textMuted}`}>
                              {f.condicionPago || 'Contado'} · {fmtDate(f.fechaEmision)}
                            </span>
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          <div className="font-bold text-[12px] text-slate-100">{f.clienteNombre}</div>
                          <div className="text-[10px] text-slate-500 font-mono">RUC {f.clienteRuc}</div>
                        </td>
                        <td className="px-3 py-3">
                          <div className="text-[11px] font-semibold text-slate-200 font-mono">{f.codigoPedido || '—'}</div>
                          <div className="text-[10px] text-slate-500">{f.producto || ''}</div>
                        </td>
                        <td className="px-3 py-3">
                          <div className="text-[11px] font-bold text-slate-200">
                            {f.estadoPago === 'VENCIDO'
                              ? `hace ${Math.abs(f.diasParaVencer ?? 0)} días`
                              : f.diasParaVencer !== null && f.diasParaVencer! >= 0
                                ? `en ${f.diasParaVencer} días`
                                : 'vencido'}
                          </div>
                          <div className="text-[10px] text-slate-500">{fmtDate(f.fechaVencimiento)}</div>
                        </td>
                        <td className="px-3 py-3 text-center">
                          <span className={`inline-block w-3 h-3 rounded-full ${semaforoColor(f.semaforo)}`} />
                        </td>
                        <td className="px-3 py-3 text-right text-[12px] font-black text-slate-100">
                          {fmt(f.montoTotal, currency, incluyeIgv, tipoCambio)}
                        </td>
                        <td className="px-3 py-3 text-right">
                          <span className={`text-[12px] font-black ${f.saldoPendiente > 0 ? (f.estadoPago === 'VENCIDO' ? 'text-rose-400' : 'text-amber-400') : 'text-emerald-400'}`}>
                            {fmt(f.saldoPendiente, currency, incluyeIgv, tipoCambio)}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-center">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-black border ${estadoPago}`}>
                            {f.estadoPago === 'PAGADO' ? 'PAGADO' : f.estadoPago === 'VENCIDO' ? 'VENCIDO' : 'PENDIENTE'}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-center">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-black border ${entrega ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-slate-500/10 text-slate-400 border-slate-500/30'}`}>
                            {entrega ? 'ENTREGADO' : 'PENDIENTE'}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-center">
                          <Link
                            href={`/administracion/facturacion/comprobante/${f.id}`}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-orange-500/15 to-pink-500/15 text-orange-400 border border-orange-500/25 hover:border-orange-400 text-[10px] font-bold transition-all"
                          >
                            <Receipt className="w-3 h-3" /> Ver
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div className={`rounded-2xl border p-4 shadow-sm ${cardBg}`}>
          <div className="flex items-center justify-between mb-3">
            <p className={`text-[11px] font-black uppercase tracking-wide ${textValue}`}>
              Calendario de Vencimientos — {new Date().toLocaleDateString('es-PE', { month: 'long', year: 'numeric' })}
            </p>
            <p className={`text-[10px] ${textMuted}`}>Pagos pendientes por día</p>
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((d) => (
              <div key={d} className={`text-center text-[9px] font-black uppercase py-1 ${textMuted}`}>
                {d}
              </div>
            ))}
            {calendario.map((c) => {
              const index = calendario.findIndex((x) => x.fecha === c.fecha);
              const isoDate = new Date(c.fecha);
              const firstDow = (new Date(isoDate.getFullYear(), isoDate.getMonth(), 1).getDay() + 6) % 7;
              const hoy = c.fecha === new Date().toISOString().split('T')[0];
              const vencidos = c.items.filter((f) => f.estadoPago === 'VENCIDO');
              return (
                <div
                  key={c.fecha}
                  className={`min-h-[64px] rounded-xl border p-1.5 transition-colors ${
                    hoy
                      ? isDark
                        ? 'bg-[#00F2C3]/10 border-[#00F2C3]/40'
                        : 'bg-emerald-50 border-emerald-300'
                      : isDark
                        ? 'bg-[#0D1421] border-[#1A2232]'
                        : 'bg-white border-slate-200'
                  } ${index === 0 ? 'col-start-' + ((firstDow % 7) + 1) : ''}`}
                >
                  <p className={`text-[9px] font-black ${hoy ? 'text-[#00F2C3]' : textMuted}`}>
                    {new Date(c.fecha).getDate()}
                  </p>
                  <div className="mt-1 space-y-0.5">
                    {c.items.slice(0, 3).map((f) => (
                      <Link
                        key={f.id}
                        href={`/administracion/facturacion/comprobante/${f.id}`}
                        className={`block truncate rounded px-1 py-0.5 text-[8px] font-bold border ${
                          f.estadoPago === 'VENCIDO'
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                            : f.diasParaVencer !== null && f.diasParaVencer! <= 3
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                              : 'bg-sky-500/10 text-sky-300 border-sky-500/30'
                        }`}
                      >
                        {f.codigoDoc}
                      </Link>
                    ))}
                    {c.items.length > 3 && (
                      <p className={`text-[8px] font-bold ${textMuted}`}>+{c.items.length - 3} más</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-4 mt-3">
            <span className={`flex items-center gap-1.5 text-[10px] font-bold ${textMuted}`}>
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Vencido
            </span>
            <span className={`flex items-center gap-1.5 text-[10px] font-bold ${textMuted}`}>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Vence en ≤3 días
            </span>
            <span className={`flex items-center gap-1.5 text-[10px] font-bold ${textMuted}`}>
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400" /> Vence pronto
            </span>
          </div>
          <p className={`mt-2 text-[10px] flex items-center gap-1 ${textMuted}`}>
            <Scale className="w-3.5 h-3.5" />
            Los montos mostrados con {incluyeIgv ? 'IGV incluido (18%)' : 'monto neto'} · tipo de cambio {tipoCambio.toFixed(2)}
          </p>
        </div>
      )}
    </div>
  );
}