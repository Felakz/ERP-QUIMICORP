'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { TrendingUp, Wallet, Factory, PiggyBank, Download, RefreshCw, Calendar, Scale, DollarSign, X } from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';
import { apiFetch } from '@/lib/apiClient';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Bar } from 'recharts';

interface RentabilidadData {
  facturado: number;
  cobrado: number;
  invertido: number;
  egresos: number;
  utilidad: number;
  margen: number;
  serie: { month: string; year: number; facturado: number; cobrado: number; invertido: number; egresos: number; utilidad: number; margen: number }[];
  tabla: { ruc: string; cliente: string; facturado: number; invertido: number; utilidad: number; margen: number; docs: number }[];
  desglose: { formula: string; facturado: number; teorico: number; real: number; desvio: number; cantidad: number }[];
}

const fmt = (n: number, currency: string, igv: boolean, tc: number) => {
  let v = n;
  if (igv) v = v * 1.18;
  if (currency === 'USD') v = v / (tc || 3.75);
  const prefix = currency === 'USD' ? '$' : 'S/';
  return `${prefix} ${v.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export default function FacturacionPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const cardBg = isDark ? 'bg-[#0D1421] border-[#1A2232]' : 'bg-white border-slate-200';
  const textTitle = isDark ? 'text-slate-300' : 'text-slate-700';
  const textValue = isDark ? 'text-slate-100' : 'text-slate-900';
  const textMuted = isDark ? 'text-slate-400' : 'text-slate-500';

  const [data, setData] = useState<RentabilidadData | null>(null);
  const [loading, setLoading] = useState(true);
  const [rango, setRango] = useState('MES_ACTUAL');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [incluyeIgv, setIncluyeIgv] = useState(false);
  const [currency, setCurrency] = useState('PEN');
  const [tc, setTc] = useState(3.75);
  const [searchTabla, setSearchTabla] = useState('');
  const [sortMargen, setSortMargen] = useState<'desc' | 'asc'>('desc');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const cargar = useCallback(async () => {
    setLoading(true);
    try {
      let url = `/facturacion/rentabilidad?rango=${rango}`;
      if (fechaDesde) url += `&desde=${fechaDesde}`;
      if (fechaHasta) url += `&hasta=${fechaHasta}`;
      const res = await apiFetch<RentabilidadData>(url);
      if (res.data) setData(res.data);
    } catch { setData(null); } finally { setLoading(false); }
  }, [rango, fechaDesde, fechaHasta]);

  useEffect(() => { cargar(); }, [cargar]);

  const kpis = data ? [
    { label: 'Facturado Bruto', valor: data.facturado, icon: Wallet, accent: 'text-sky-400', bg: 'from-sky-500/15 to-cyan-500/10', sub: 'Devengado del período' },
    { label: 'Cobrado Efectivo', valor: data.cobrado, icon: PiggyBank, accent: 'text-emerald-400', bg: 'from-emerald-500/15 to-teal-500/10', sub: 'Flujo en bancos' },
    { label: 'Egresos (Compras)', valor: data.egresos, icon: DollarSign, accent: 'text-rose-400', bg: 'from-rose-500/15 to-red-500/10', sub: 'OCs del período *' },
    { label: 'Costo Directo Real', valor: data.invertido, icon: Factory, accent: 'text-amber-400', bg: 'from-amber-500/15 to-orange-500/10', sub: 'Materia prima e insumos' },
    { label: 'Margen Operativo Bruto', valor: data.utilidad, icon: TrendingUp, accent: 'text-violet-400', bg: 'from-violet-500/15 to-purple-500/10', sub: `${data.margen.toFixed(1)}% margen` },
  ] : [];

  const periodoVisual = fechaDesde && fechaHasta
    ? `${fechaDesde.split('-').reverse().join('/')} al ${fechaHasta.split('-').reverse().join('/')}`
    : rango === 'MES_ACTUAL'
    ? 'Mes Actual'
    : rango === 'MES_ANTERIOR'
    ? 'Mes Anterior'
    : 'Año Completo';

  const exportExcel = () => {
    if (!data) return;
    const header = `QUIMICORP PERU S.A.C.|RUC 20601234567|Periodo ${periodoVisual}\n`;
    const rows = data.tabla.map(r => `${r.ruc},${r.cliente},${r.facturado},${r.invertido},${r.utilidad},${r.margen}%`).join('\n');
    const csv = header + 'RUC,Cliente,Facturado,Invertido,Utilidad,Margen\n' + rows;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `rentabilidad_${fechaDesde && fechaHasta ? `${fechaDesde}_a_${fechaHasta}` : rango}.csv`; a.click();
  };
  const exportPdf = () => {
    if (!data) return;
    const win = window.open('', '_blank');
    if (!win) return;
    const rows = data.tabla.map(r => `<tr><td>${r.ruc}</td><td>${r.cliente}</td><td style="text-align:right">S/ ${r.facturado.toFixed(2)}</td><td style="text-align:right">S/ ${r.invertido.toFixed(2)}</td><td style="text-align:right">${r.margen.toFixed(1)}%</td></tr>`).join('');
    win.document.write(`<html><head><title>Rentabilidad ${periodoVisual}</title><style>body{font-family:Arial;font-size:12px}table{width:100%;border-collapse:collapse}th,td{border:1px solid #ccc;padding:6px}th{background:#0D1421;color:#fff}</style></head><body><h2>QUIMICORP PERU S.A.C. — RUC 20601234567</h2><p>Periodo: ${periodoVisual} — ${new Date().toLocaleDateString('es-PE')}</p><p>Facturado: S/ ${data.facturado.toFixed(2)} | Cobrado: S/ ${data.cobrado.toFixed(2)} | Invertido: S/ ${data.invertido.toFixed(2)} | Utilidad: S/ ${data.utilidad.toFixed(2)} (${data.margen.toFixed(1)}%)</p><table><tr><th>RUC</th><th>Cliente</th><th>Facturado</th><th>Costo Real</th><th>Margen</th></tr>${rows}</table></body></html>`);
    win.document.close(); win.print();
  };

  if (loading) return <div className="p-10 text-center text-xs font-bold text-slate-400">Cargando análisis...</div>;

  return (
    <div className="space-y-6 font-sans min-h-screen">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className={`flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-sm ${cardBg}`}>
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 text-violet-400"><Scale className="w-5 h-5" /></div>
          <div>
            <h1 className={`text-sm font-black uppercase tracking-wide ${textValue}`}>Análisis de Rentabilidad & Margen</h1>
            <p className={`text-[11px] ${textMuted}`}>Ingresos Facturados vs. Costo Real de Producción vs. Utilidad Neta — devengado × masa real</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Selector de Rango Rápido */}
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            <select
              value={rango}
              onChange={(e) => {
                const val = e.target.value;
                setRango(val);
                if (val !== 'CUSTOM') {
                  setFechaDesde('');
                  setFechaHasta('');
                }
              }}
              className={`px-3 py-2 rounded-xl border text-xs font-bold ${cardBg} ${textValue}`}
            >
              <option value="MES_ACTUAL">Mes Actual</option>
              <option value="MES_ANTERIOR">Mes Anterior</option>
              <option value="ESTE_ANO">Año Completo</option>
              <option value="CUSTOM">Rango por Fecha</option>
            </select>
          </div>

          {/* Inputs de Calendario Desde y Hasta */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-mono ${isDark ? 'bg-[#151D2A] border-[#1A2232]' : 'bg-slate-50 border-slate-200'}`}>
              <span className="text-[10px] text-slate-400 font-sans font-semibold">Desde:</span>
              <input
                type="date"
                value={fechaDesde}
                onChange={(e) => {
                  setFechaDesde(e.target.value);
                  setRango('CUSTOM');
                }}
                className={`bg-transparent text-xs font-mono focus:outline-none ${isDark ? 'text-slate-200 [color-scheme:dark]' : 'text-slate-800'}`}
              />
            </div>

            <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-mono ${isDark ? 'bg-[#151D2A] border-[#1A2232]' : 'bg-slate-50 border-slate-200'}`}>
              <span className="text-[10px] text-slate-400 font-sans font-semibold">Hasta:</span>
              <input
                type="date"
                value={fechaHasta}
                onChange={(e) => {
                  setFechaHasta(e.target.value);
                  setRango('CUSTOM');
                }}
                className={`bg-transparent text-xs font-mono focus:outline-none ${isDark ? 'text-slate-200 [color-scheme:dark]' : 'text-slate-800'}`}
              />
            </div>

            {(fechaDesde || fechaHasta || rango === 'CUSTOM') && (
              <button
                type="button"
                onClick={() => {
                  setFechaDesde('');
                  setFechaHasta('');
                  setRango('MES_ACTUAL');
                }}
                className="px-2.5 py-1.5 rounded-xl border border-rose-500/30 text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 text-[11px] font-bold transition-all flex items-center gap-1 active:scale-95"
                title="Limpiar fechas y volver a Mes Actual"
              >
                <X className="w-3.5 h-3.5" />
                <span>Limpiar</span>
              </button>
            )}
          </div>

          <button onClick={cargar} className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 ${cardBg} ${isDark ? 'text-slate-300' : 'text-slate-600'}`}><RefreshCw className="w-3.5 h-3.5" /> Actualizar</button>
          <button onClick={exportExcel} className="px-3 py-2 rounded-xl bg-[#00F2C3] text-slate-950 text-xs font-black flex items-center gap-1.5"><Download className="w-3.5 h-3.5" /> Excel</button>
          <button onClick={exportPdf} className={`px-3 py-2 rounded-xl border text-xs font-black flex items-center gap-1.5 ${cardBg}`}>PDF</button>
        </div>
      </div>

      <div className={`flex flex-wrap items-center gap-3 rounded-2xl border p-3 ${cardBg}`}>
        <div className="flex items-center gap-1">
          <button onClick={() => setIncluyeIgv(false)} className={`px-3 py-1.5 rounded-lg text-[11px] font-bold ${!incluyeIgv ? 'bg-[#00F2C3] text-slate-950' : 'text-slate-400'}`}>Neto</button>
          <button onClick={() => setIncluyeIgv(true)} className={`px-3 py-1.5 rounded-lg text-[11px] font-bold ${incluyeIgv ? 'bg-[#00F2C3] text-slate-950' : 'text-slate-400'}`}>Con IGV 18%</button>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setCurrency('PEN')} className={`px-3 py-1.5 rounded-lg text-[11px] font-bold ${currency === 'PEN' ? 'bg-[#00F2C3] text-slate-950' : 'text-slate-400'}`}>S/ PEN</button>
          <button onClick={() => setCurrency('USD')} className={`px-3 py-1.5 rounded-lg text-[11px] font-bold ${currency === 'USD' ? 'bg-[#00F2C3] text-slate-950' : 'text-slate-400'}`}>$ USD</button>
          {currency === 'USD' && <input type="number" step="0.01" value={tc} onChange={e => setTc(Number(e.target.value) || 3.75)} className="w-16 px-2 py-1 rounded-lg border text-xs font-bold bg-[#151D2A] border-[#1A2232] text-slate-200" />}
        </div>
        <span className="text-[10px] text-slate-500">Cabecera tributaria: QUIMICORP PERÚ S.A.C. · Período: {periodoVisual}</span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {kpis.map(k => (
          <div key={k.label} className={`rounded-2xl border p-4 shadow-sm bg-gradient-to-br ${cardBg} ${k.bg}`}>
            <div className="flex items-center justify-between"><p className={`text-[10px] font-black uppercase ${textMuted}`}>{k.label}</p><k.icon className={`w-4 h-4 ${k.accent}`} /></div>
            <p className={`text-lg font-black mt-1 ${textValue}`}>{fmt(k.valor, currency, incluyeIgv, tc)}</p>
            <p className={`text-[10px] mt-0.5 ${textMuted}`}>{k.sub}</p>
          </div>
        ))}
      </div>

      <div className={`rounded-2xl border p-4 shadow-sm ${cardBg}`}>
        <p className={`text-[11px] font-black uppercase ${textValue}`}>Evolución Mensual — Cobrado vs Invertido vs Utilidad</p>
        <p className={`text-[10px] ${textMuted}`}>Eje secundario: Margen %</p>
        <div className="h-[280px] mt-3">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data?.serie || []}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1A2232' : '#e2e8f0'} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: isDark ? '#94a3b8' : '#64748b' }} />
              <YAxis yAxisId="left" tick={{ fontSize: 11, fill: isDark ? '#94a3b8' : '#64748b' }} />
              <YAxis yAxisId="right" orientation="right" domain={[0, 100]} tick={{ fontSize: 11, fill: '#8b5cf6' }} />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="cobrado" name="Cobrado" stroke="#10b981" strokeWidth={2} dot={false} />
              <Line yAxisId="left" type="monotone" dataKey="egresos" name="Egresos" stroke="#ef4444" strokeWidth={2} dot={false} />
              <Line yAxisId="left" type="monotone" dataKey="invertido" name="Costo" stroke="#f59e0b" strokeWidth={2} dot={false} />
              <Line yAxisId="left" type="monotone" dataKey="utilidad" name="Utilidad" stroke="#00F2C3" strokeWidth={2} dot={false} />
              <Line yAxisId="right" type="monotone" dataKey="margen" name="Margen %" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="5 5" dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        {data?.serie && data.serie.length > 1 && (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-[11px]">
              <thead><tr className="text-[9px] uppercase text-slate-500"><th className="text-left px-2 py-1">Mes</th><th className="text-right px-2 py-1">Facturado</th><th className="text-right px-2 py-1">Egresos</th><th className="text-right px-2 py-1">Utilidad</th><th className="text-right px-2 py-1">Margen</th><th className="text-right px-2 py-1">MoM</th></tr></thead>
              <tbody>
                {data.serie.slice(-6).map((r, i, arr) => {
                  const prev = i > 0 ? arr[i - 1] : null;
                  const mom = prev && prev.facturado > 0 ? ((r.facturado - prev.facturado) / prev.facturado) * 100 : 0;
                  return (
                    <tr key={r.month + r.year} className="border-t border-slate-800/30">
                      <td className="px-2 py-1 font-bold">{r.month} {r.year}</td>
                      <td className="px-2 py-1 text-right">{fmt(r.facturado, currency, incluyeIgv, tc)}</td>
                      <td className="px-2 py-1 text-right text-rose-400">{fmt(r.egresos, currency, incluyeIgv, tc)}</td>
                      <td className="px-2 py-1 text-right text-emerald-400">{fmt(r.utilidad, currency, incluyeIgv, tc)}</td>
                      <td className="px-2 py-1 text-right">{r.margen.toFixed(1)}%</td>
                      <td className={`px-2 py-1 text-right font-bold ${mom >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{prev ? `${mom >= 0 ? '+' : ''}${mom.toFixed(1)}%` : '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className={`rounded-2xl border shadow-sm overflow-hidden ${cardBg}`}>
        <div className={`flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b ${isDark ? 'border-[#1A2232]' : 'border-slate-200'}`}>
          <p className={`text-[11px] font-black uppercase ${textValue}`}>Auditoría por Contrato / Producto — {data?.tabla.length || 0} clientes</p>
          <div className="flex items-center gap-2">
            <input value={searchTabla} onChange={e => { setSearchTabla(e.target.value); setPage(1); }} placeholder="Buscar RUC/cliente..." className={`px-3 py-1.5 rounded-xl border text-xs ${isDark ? 'bg-[#151D2A] border-[#1A2232] text-slate-200' : 'bg-white border-slate-200'}`} />
            <button onClick={() => setSortMargen(s => s === 'desc' ? 'asc' : 'desc')} className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold ${isDark ? 'border-[#1A2232] text-slate-300' : 'border-slate-200'}`}>Margen {sortMargen === 'desc' ? '↓' : '↑'}</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead><tr className={`text-[9px] uppercase ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
              <th className="text-left px-3 py-2.5 font-black">RUC / Cliente</th>
              <th className="text-right px-3 py-2.5 font-black">Facturado</th>
              <th className="text-right px-3 py-2.5 font-black">Costo Real</th>
              <th className="text-right px-3 py-2.5 font-black">Margen</th>
              <th className="text-center px-3 py-2.5 font-black">Docs</th>
            </tr></thead>
            <tbody>
              {(() => {
                const filtrada = (data?.tabla || []).filter(r => !searchTabla || r.ruc.includes(searchTabla) || r.cliente.toLowerCase().includes(searchTabla.toLowerCase())).sort((a, b) => sortMargen === 'desc' ? b.margen - a.margen : a.margen - b.margen);
                const totalPages = Math.max(1, Math.ceil(filtrada.length / pageSize));
                const pag = filtrada.slice((page - 1) * pageSize, page * pageSize);
                return pag.map(r => (
                <tr key={r.ruc} className={`border-t ${isDark ? 'border-[#131A29]' : 'border-slate-100'}`}>
                  <td className="px-3 py-2.5"><div className="font-bold text-[12px] text-slate-100">{r.cliente}</div><div className="text-[10px] font-mono text-slate-500">{r.ruc}</div></td>
                  <td className="px-3 py-2.5 text-right text-[12px] font-black text-slate-100">{fmt(r.facturado, currency, incluyeIgv, tc)}</td>
                  <td className="px-3 py-2.5 text-right text-[12px] font-bold text-amber-400">{fmt(r.invertido, currency, incluyeIgv, tc)}</td>
                  <td className="px-3 py-2.5 text-right"><span className={`px-2 py-1 rounded-full text-[11px] font-black ${r.margen >= 30 ? 'bg-emerald-500/20 text-emerald-400' : r.margen >= 15 ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400'}`}>{r.margen.toFixed(1)}%</span><div className="text-[10px] text-slate-500">{fmt(r.utilidad, currency, incluyeIgv, tc)}</div></td>
                  <td className="px-3 py-2.5 text-center text-[11px] font-bold text-slate-400">{r.docs}</td>
                </tr>
              )); })()}
            </tbody>
          </table>
        </div>
        {(() => {
          const filtrada = (data?.tabla || []).filter(r => !searchTabla || r.ruc.includes(searchTabla) || r.cliente.toLowerCase().includes(searchTabla.toLowerCase()));
          const totalPages = Math.max(1, Math.ceil(filtrada.length / pageSize));
          return filtrada.length > pageSize ? (
          <div className={`flex items-center justify-between px-4 py-2 border-t text-xs ${isDark ? 'border-[#1A2232] text-slate-400' : 'border-slate-200'}`}>
            <span>{filtrada.length} clientes</span>
            <div className="flex items-center gap-1">
              <button disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))} className="px-2 py-1 rounded border disabled:opacity-40">‹</button>
              <span>{page} / {totalPages}</span>
              <button disabled={page >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))} className="px-2 py-1 rounded border disabled:opacity-40">›</button>
            </div>
          </div>
          ) : null;
        })()}
      </div>

      <div className={`rounded-2xl border p-4 ${cardBg}`}>
        <div className="flex items-center justify-between">
          <div><p className={`text-[11px] font-black uppercase ${textValue}`}>Desglose de Desviación de Costos (Planta)</p><p className={`text-[10px] ${textMuted}`}>Teórico BOM vs Real (reactor + aditivos + 3% merma operativa)</p></div>
          <span className="text-[10px] font-bold text-amber-400">{(data?.desglose?.length || 0)} fórmulas</span>
        </div>
        <div className="overflow-x-auto mt-3">
          <table className="w-full min-w-[700px]">
            <thead><tr className="text-[9px] uppercase text-slate-500"><th className="text-left px-2 py-1.5">Fórmula</th><th className="text-right px-2 py-1.5">Facturado</th><th className="text-right px-2 py-1.5">Teórico</th><th className="text-right px-2 py-1.5">Real</th><th className="text-right px-2 py-1.5">Desvío</th></tr></thead>
            <tbody>
              {(data?.desglose || []).map(d => (
                <tr key={d.formula} className={`border-t text-xs ${isDark ? 'border-[#1A2232]' : 'border-slate-100'}`}>
                  <td className="px-2 py-2 font-bold text-slate-200">{d.formula}<span className="text-[10px] text-slate-500 ml-1">{d.cantidad.toFixed(1)} kg/L</span></td>
                  <td className="px-2 py-2 text-right font-black text-slate-100">{fmt(d.facturado, currency, incluyeIgv, tc)}</td>
                  <td className="px-2 py-2 text-right text-slate-400">{fmt(d.teorico, currency, incluyeIgv, tc)}</td>
                  <td className="px-2 py-2 text-right text-amber-400">{fmt(d.real, currency, incluyeIgv, tc)}</td>
                  <td className={`px-2 py-2 text-right font-black ${Math.abs(d.desvio) > 5 ? 'text-rose-400' : d.desvio > 2 ? 'text-amber-400' : 'text-emerald-400'}`}>{d.desvio.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
