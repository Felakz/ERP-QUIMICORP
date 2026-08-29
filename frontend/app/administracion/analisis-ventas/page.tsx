'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { TrendingUp, BarChart3, ArrowUpRight, Download, RefreshCw, Award, Users, Receipt } from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';
import { apiFetch } from '@/lib/apiClient';
import { CompactMetric, KpiItem, TopCustomer } from '@/types/dashboard';

interface AnalisisApiResponse {
  kpis?: KpiItem[];
  topCustomers?: TopCustomer[];
  compactMetrics?: CompactMetric[];
  timestamp?: string;
}

const stateBadge = (status?: string) => {
  if (status === 'EXCELENTE')
    return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
  if (status === 'REGULAR')
    return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
  return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
};

const BGS = [
  'bg-indigo-600', 'bg-emerald-600', 'bg-amber-600', 'bg-purple-600',
  'bg-rose-600', 'bg-blue-600', 'bg-teal-600',
];

export default function AdministracionAnalisisVentasPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const cardBg = isDark ? 'bg-[#0F141C] border-[#1A2232]' : 'bg-white border-slate-200 shadow-sm';

  const [topCustomers, setTopCustomers] = useState<TopCustomer[]>([]);
  const [compactMetrics, setCompactMetrics] = useState<CompactMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exported, setExported] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, ok } = await apiFetch<AnalisisApiResponse>(
        '/administracion/dashboard/stats?dateRange=MES_ACTUAL'
      );
      if (ok && data) {
        setTopCustomers(data.topCustomers || []);
        setCompactMetrics(data.compactMetrics || []);
      }
    } catch (e: any) {
      setError(e?.message || 'Error al conectar con la API de ventas');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const facturacionMes = useMemo(
    () => topCustomers.reduce((acc: number, c) => acc + (Number(c.totalAmountPenNeto) || 0), 0),
    [topCustomers]
  );
  const clientesActivos = useMemo(
    () => compactMetrics.find((m) => m.type === 'CUSTOMERS')?.valuePenNeto ?? 0,
    [compactMetrics]
  );
  const totalInvoices = useMemo(
    () => topCustomers.reduce((acc: number, c) => acc + (Number(c.invoicesCount) || 0), 0),
    [topCustomers]
  );
  const ticketPromedio = useMemo(
    () => (topCustomers.length ? facturacionMes / topCustomers.length : 0),
    [facturacionMes, topCustomers.length]
  );

  const fmt = (n: number) =>
    n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const handleExport = () => {
    const header = ['#', 'Cliente', 'RUC', 'Invoices', 'Facturación (S/)', 'Estado Crediticio'];
    const rows = topCustomers.map((c, i) => [
      i + 1,
      c.name,
      c.ruc,
      c.invoicesCount,
      Number(c.totalAmountPenNeto) || 0,
      c.creditStatus,
    ]);
    const csv = [header, ...rows]
      .map((r) =>
        r
          .map((cell) => {
            const s = String(cell ?? '');
            return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
          })
          .join(',')
      )
      .join('\n');

    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ranking-clientes.xlsx.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setExported(true);
    setTimeout(() => setExported(false), 2200);
  };

  return (
    <div className="space-y-6 font-sans">
      <div className={`p-6 rounded-2xl border flex items-center justify-between gap-4 ${cardBg}`}>
        <div>
          <div className="flex items-center gap-2 text-blue-500 font-bold text-xs uppercase tracking-widest mb-1">
            <TrendingUp className="w-4 h-4" />
            <span>Gestión Comercial</span>
          </div>
          <h1 className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Análisis & Inteligencia de Ventas (Gerencia)
          </h1>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Monitoreo ejecutivo de facturación real, ranking de clientes corporativos y proyección de ventas.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            disabled={!topCustomers.length}
            className="px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 bg-emerald-600 text-white hover:bg-emerald-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" /> {exported ? 'Exportado' : 'Exportar'}
          </button>
          <button
            onClick={load}
            className="px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border text-blue-400 border-blue-500/30 hover:bg-blue-500/10 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Actualizar
          </button>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            🔒 Exclusivo Gerencia
          </span>
        </div>
      </div>

      {error && (
        <div className={`p-4 rounded-2xl border text-sm font-semibold ${cardBg} text-rose-400 border-rose-500/30`}>
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`p-4 rounded-2xl border ${cardBg}`}>
          <p className="text-xs text-slate-400 font-medium">Facturación del Mes</p>
          <h3 className="text-lg font-black text-emerald-400 mt-1">S/ {fmt(facturacionMes)}</h3>
          <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1 mt-1">
            <ArrowUpRight className="w-3 h-3" /> Cuentas reales (Excel)
          </span>
        </div>

        <div className={`p-4 rounded-2xl border ${cardBg}`}>
          <p className="text-xs text-slate-400 font-medium">Clientes Activos</p>
          <h3 className="text-lg font-black text-blue-400 mt-1 flex items-center gap-2">
            <Users className="w-4 h-4" /> {clientesActivos}
          </h3>
          <span className="text-[10px] text-slate-400 font-bold mt-1">clientes corporativos</span>
        </div>

        <div className={`p-4 rounded-2xl border ${cardBg}`}>
          <p className="text-xs text-slate-400 font-medium">Ticket Promedio (Top {topCustomers.length})</p>
          <h3 className="text-lg font-black text-amber-400 mt-1">S/ {fmt(ticketPromedio)}</h3>
          <span className="text-[10px] text-slate-400 font-bold mt-1 flex items-center gap-1">
            <Receipt className="w-3 h-3" /> {totalInvoices} invoices en el ranking
          </span>
        </div>

        <div className={`p-4 rounded-2xl border ${cardBg}`}>
          <p className="text-xs text-slate-400 font-medium">Total Invoices del Mes</p>
          <h3 className="text-lg font-black text-purple-400 mt-1">{totalInvoices}</h3>
          <span className="text-[10px] text-purple-400 font-bold mt-1">documentos facturados</span>
        </div>
      </div>

      <div className={`p-6 rounded-2xl border ${cardBg}`}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className={`text-base font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <Award className="w-4 h-4 text-amber-400" /> Top 10 Clientes por Facturación Real
            </h2>
            <p className="text-xs text-slate-400">
              Ranking desde cuentas por cobrar (ventas reales del mes), no desde pedidos de prueba.
            </p>
          </div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            {loading ? 'Cargando…' : `${topCustomers.length} clientes`}
          </span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-sm text-slate-400">Cargando ranking real…</div>
        ) : topCustomers.length === 0 ? (
          <div className="py-12 text-center text-sm text-slate-400">No hay facturación registrada en el mes.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className={`text-[10px] uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  <th className="px-3 py-2">#</th>
                  <th className="px-3 py-2">Cliente</th>
                  <th className="px-3 py-2">RUC</th>
                  <th className="px-3 py-2 text-right">Invoices</th>
                  <th className="px-3 py-2 text-right">Facturación (S/)</th>
                  <th className="px-3 py-2 text-center">Estado Crediticio</th>
                </tr>
              </thead>
              <tbody>
                {topCustomers.map((c, idx) => (
                  <tr
                    key={c.id}
                    className={`border-t ${isDark ? 'border-[#1A2232]' : 'border-slate-200'} hover:bg-blue-500/5 transition-colors`}
                  >
                    <td className="px-3 py-3">
                      <div
                        className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center font-black text-xs text-white ${BGS[idx % BGS.length]}`}
                      >
                        {idx + 1}
                      </div>
                    </td>
                    <td className={`px-3 py-3 text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {c.name}
                    </td>
                    <td className="px-3 py-3 text-[11px] font-mono text-slate-400">{c.ruc}</td>
                    <td className="px-3 py-3 text-right text-xs text-slate-400">{c.invoicesCount}</td>
                    <td className={`px-3 py-3 text-right text-xs font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      S/ {fmt(Number(c.totalAmountPenNeto) || 0)}
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded ${stateBadge(c.creditStatus)}`}>
                        {c.creditStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className={`p-8 rounded-2xl border text-center space-y-3 ${cardBg}`}>
        <BarChart3 className="w-12 h-12 text-blue-400 mx-auto opacity-80" />
        <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Ranking en Conexión Directa
        </h3>
        <p className="text-xs text-slate-400 max-w-lg mx-auto">
          La facturación se calcula automáticamente desde cuentas por cobrar en PostgreSQL (datos reales del Excel).
        </p>
      </div>
    </div>
  );
}
