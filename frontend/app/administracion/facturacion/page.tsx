'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { TrendingUp, Wallet, Factory, PiggyBank, Download, RefreshCw, Calendar, Scale, DollarSign } from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';
import { apiFetch } from '@/lib/apiClient';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Bar } from 'recharts';

interface RentabilidadData {
  facturado: number;
  cobrado: number;
  invertido: number;
  utilidad: number;
  margen: number;
  serie: { month: string; year: number; facturado: number; cobrado: number; invertido: number; utilidad: number; margen: number }[];
  tabla: { ruc: string; cliente: string; facturado: number; invertido: number; utilidad: number; margen: number; docs: number }[];
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
  const [incluyeIgv, setIncluyeIgv] = useState(false);
  const [currency, setCurrency] = useState('PEN');
  const [tc, setTc] = useState(3.75);

  const cargar = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiFetch<RentabilidadData>(`/facturacion/rentabilidad?rango=${rango}`);
      if (res.data) setData(res.data);
    } catch { setData(null); } finally { setLoading(false); }
  }, [rango]);

  useEffect(() => { cargar(); }, [cargar]);

  const kpis = data ? [
    { label: 'Facturado Bruto', valor: data.facturado, icon: Wallet, accent: 'text-sky-400', bg: 'from-sky-500/15 to-cyan-500/10', sub: 'Devengado del período' },
    { label: 'Cobrado Efectivo', valor: data.cobrado, icon: PiggyBank, accent: 'text-emerald-400', bg: 'from-emerald-500/15 to-teal-500/10', sub: 'Flujo en bancos' },
    { label: 'Inversión Operativa Real', valor: data.invertido, icon: Factory, accent: 'text-amber-400', bg: 'from-amber-500/15 to-orange-500/10', sub: 'COGS reactor + mermas' },
    { label: 'Margen Operativo Bruto', valor: data.utilidad, icon: TrendingUp, accent: 'text-violet-400', bg: 'from-violet-500/15 to-purple-500/10', sub: `${data.margen.toFixed(1)}% margen` },
  ] : [];

  const exportExcel = () => {
    if (!data) return;
    const header = `QUIMICORP PERU S.A.C.|RUC 20601234567|Periodo ${rango}\n`;
    const rows = data.tabla.map(r => `${r.ruc},${r.cliente},${r.facturado},${r.invertido},${r.utilidad},${r.margen}%`).join('\n');
    const csv = header + 'RUC,Cliente,Facturado,Invertido,Utilidad,Margen\n' + rows;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `rentabilidad_${rango}.csv`; a.click();
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
        <div className="flex items-center gap-2">
          <select value={rango} onChange={e => setRango(e.target.value)} className={`px-3 py-2 rounded-xl border text-xs font-bold ${cardBg} ${textValue}`}>
            <option value="MES_ACTUAL">Mes Actual</option>
            <option value="MES_ANTERIOR">Mes Anterior</option>
            <option value="ESTE_ANO">Año Completo</option>
          </select>
          <button onClick={cargar} className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 ${cardBg} ${isDark ? 'text-slate-300' : 'text-slate-600'}`}><RefreshCw className="w-3.5 h-3.5" /> Actualizar</button>
          <button onClick={exportExcel} className="px-3 py-2 rounded-xl bg-[#00F2C3] text-slate-950 text-xs font-black flex items-center gap-1.5"><Download className="w-3.5 h-3.5" /> Exportar</button>
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
        <span className="text-[10px] text-slate-500">Cabecera tributaria: QUIMICORP PERÚ S.A.C. · Período {rango}</span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map(k => (
          <div key={k.label} className={`rounded-2xl border p-4 shadow-sm bg-gradient-to-br ${cardBg} ${k.bg}`}>
            <div className="flex items-center justify-between"><p className={`text-[10px] font-black uppercase ${textMuted}`}>{k.label}</p><k.icon className={`w-4 h-4 ${k.accent}`} /></div>
            <p className={`text-xl font-black mt-1 ${textValue}`}>{fmt(k.valor, currency, incluyeIgv, tc)}</p>
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
              <Line yAxisId="left" type="monotone" dataKey="invertido" name="Invertido" stroke="#f59e0b" strokeWidth={2} dot={false} />
              <Line yAxisId="left" type="monotone" dataKey="utilidad" name="Utilidad" stroke="#00F2C3" strokeWidth={2} dot={false} />
              <Line yAxisId="right" type="monotone" dataKey="margen" name="Margen %" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="5 5" dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={`rounded-2xl border shadow-sm overflow-hidden ${cardBg}`}>
        <div className={`flex items-center justify-between px-4 py-3 border-b ${isDark ? 'border-[#1A2232]' : 'border-slate-200'}`}>
          <p className={`text-[11px] font-black uppercase ${textValue}`}>Auditoría por Contrato / Producto — {data?.tabla.length || 0} clientes</p>
          <span className={`text-[10px] ${textMuted}`}>Ordenado por utilidad</span>
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
              {(data?.tabla || []).map(r => (
                <tr key={r.ruc} className={`border-t ${isDark ? 'border-[#131A29]' : 'border-slate-100'}`}>
                  <td className="px-3 py-2.5"><div className="font-bold text-[12px] text-slate-100">{r.cliente}</div><div className="text-[10px] font-mono text-slate-500">{r.ruc}</div></td>
                  <td className="px-3 py-2.5 text-right text-[12px] font-black text-slate-100">{fmt(r.facturado, currency, incluyeIgv, tc)}</td>
                  <td className="px-3 py-2.5 text-right text-[12px] font-bold text-amber-400">{fmt(r.invertido, currency, incluyeIgv, tc)}</td>
                  <td className="px-3 py-2.5 text-right"><span className={`px-2 py-1 rounded-full text-[11px] font-black ${r.margen >= 30 ? 'bg-emerald-500/20 text-emerald-400' : r.margen >= 15 ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400'}`}>{r.margen.toFixed(1)}%</span><div className="text-[10px] text-slate-500">{fmt(r.utilidad, currency, incluyeIgv, tc)}</div></td>
                  <td className="px-3 py-2.5 text-center text-[11px] font-bold text-slate-400">{r.docs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className={`rounded-2xl border p-4 ${cardBg}`}>
        <p className={`text-[11px] font-black uppercase ${textValue}`}>Desglose de Desviación de Costos (Planta)</p>
        <p className={`text-[10px] ${textMuted}`}>Teórico BOM vs Real (reactor + aditivos + mermas) — diferencial por insumo crítico</p>
        <div className={`mt-3 p-6 rounded-xl border-2 border-dashed text-center ${isDark ? 'border-[#1A2232] text-slate-500' : 'border-slate-200 text-slate-500'}`}>
          <Factory className="w-6 h-6 mx-auto mb-2 opacity-50" />
          <p className="text-xs font-bold">Cálculo en base a FormulaDetalle + Kardex + OrdenProduccion.mermas</p>
          <p className="text-[11px]">Se alimenta del balance de masa real — próximo sprint: comparador teórico vs real por lote</p>
        </div>
      </div>
    </div>
  );
}
