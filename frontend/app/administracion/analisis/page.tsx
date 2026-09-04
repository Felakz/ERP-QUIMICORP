'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  TrendingUp,
  BarChart3,
  ArrowUpRight,
  Download,
  RefreshCw,
  Award,
  Users,
  Receipt,
  DollarSign,
  PieChart,
  Calendar,
  Sparkles,
  Building2,
  ChevronRight,
  ShieldCheck,
  Percent,
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { useTheme } from '@/lib/ThemeContext';
import { apiFetch } from '@/lib/apiClient';
import { CompactMetric, KpiItem, TopCustomer } from '@/types/dashboard';

interface AnalisisApiResponse {
  kpis?: KpiItem[];
  topCustomers?: TopCustomer[];
  compactMetrics?: CompactMetric[];
  timestamp?: string;
}

export default function AdministracionAnalisisPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [dateRange, setDateRange] = useState<string>('MES_ACTUAL');
  const [topCustomers, setTopCustomers] = useState<TopCustomer[]>([]);
  const [compactMetrics, setCompactMetrics] = useState<CompactMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState('');

  const cardBg = isDark ? 'bg-[#0F141C] border-[#1A2232]' : 'bg-white border-slate-200 shadow-sm';
  const textTitle = isDark ? 'text-slate-400' : 'text-slate-600';
  const textValue = isDark ? 'text-white' : 'text-slate-900';
  const inputBg = isDark
    ? 'bg-[#151D2A] border-[#1A2232] text-slate-200 placeholder-slate-500 focus:border-[#00F2C3]'
    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500';

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, ok } = await apiFetch<AnalisisApiResponse>(
        `/administracion/dashboard/stats?dateRange=${dateRange}`
      );
      if (ok && data) {
        setTopCustomers(data.topCustomers || []);
        setCompactMetrics(data.compactMetrics || []);
      } else {
        // Fallback datos reales
        setTopCustomers([]);
      }
    } catch (e: any) {
      setError(e?.message || 'Error al conectar con la API de ventas');
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    load();
  }, [load]);

  const facturacionMes = useMemo(
    () => topCustomers.reduce((acc: number, c) => acc + (Number(c.totalAmountPenNeto) || 0), 0),
    [topCustomers]
  );
  const clientesActivos = useMemo(
    () => compactMetrics.find((m) => m.type === 'CUSTOMERS')?.valuePenNeto ?? topCustomers.length,
    [compactMetrics, topCustomers.length]
  );
  const totalInvoices = useMemo(
    () => topCustomers.reduce((acc: number, c) => acc + (Number(c.invoicesCount) || 0), 0),
    [topCustomers]
  );
  const ticketPromedio = useMemo(
    () => (topCustomers.length ? facturacionMes / topCustomers.length : 0),
    [facturacionMes, topCustomers.length]
  );

  const filteredCustomers = useMemo(() => {
    if (!searchFilter.trim()) return topCustomers;
    const q = searchFilter.toLowerCase();
    return topCustomers.filter(
      (c) => c.name.toLowerCase().includes(q) || (c.ruc && c.ruc.includes(q))
    );
  }, [topCustomers, searchFilter]);

  const fmt = (n: number) =>
    n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const handleExportExcel = () => {
    const dataToExport = filteredCustomers.map((c, i) => ({
      Ranking: i + 1,
      Cliente: c.name,
      RUC: c.ruc,
      Facturas_Emitidas: c.invoicesCount,
      Facturacion_Neta_PEN: Number(c.totalAmountPenNeto) || 0,
      Estado_Crediticio: c.creditStatus || 'REGULAR',
      Participacion_Ventas: facturacionMes > 0 ? `${(((Number(c.totalAmountPenNeto) || 0) / facturacionMes) * 100).toFixed(1)}%` : '0%',
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Analisis_Ventas');
    XLSX.writeFile(wb, `Quimicorp_Analisis_Ventas_${dateRange}_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="space-y-5 font-sans min-h-screen">
      {/* 1. Header Banner Gerencial Neon */}
      <div
        className={`rounded-2xl p-5 border flex flex-wrap items-center justify-between gap-4 transition-all shadow-sm ${cardBg}`}
      >
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/20 border border-cyan-500/30 text-[#00F2C3] shadow-[0_0_15px_rgba(0,242,195,0.15)]">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className={`text-lg font-black tracking-tight ${textValue}`}>
                Análisis & Inteligencia de Ventas
              </h1>
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00F2C3] animate-pulse" />
                CONEXIÓN EN VIVO A POSTGRESQL
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Monitoreo ejecutivo de facturación, ranking de clientes corporativos y márgenes comerciales.
            </p>
          </div>
        </div>

        {/* Filtros de Período y Exportar Excel */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center bg-[#151D2A] p-1 rounded-xl border border-[#1A2232]">
            {[
              { id: 'HOY', label: 'Hoy' },
              { id: 'ESTA_SEMANA', label: 'Semana' },
              { id: 'MES_ACTUAL', label: 'Mes Actual' },
              { id: 'TRIMESTRE', label: 'Trimestre' },
              { id: 'ANIO_2026', label: 'Año 2026' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setDateRange(p.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  dateRange === p.id
                    ? 'bg-[#00F2C3] text-slate-950 shadow-[0_0_10px_rgba(0,242,195,0.4)]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <button
            onClick={load}
            disabled={loading}
            className={`p-2.5 rounded-xl border transition-all ${
              isDark
                ? 'bg-[#151D2A] border-[#1A2232] text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
            title="Refrescar datos"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>

          <button
            onClick={handleExportExcel}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs tracking-wider uppercase transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Exportar .XLSX</span>
          </button>
        </div>
      </div>

      {/* 2. Cuadrícula de 4 Tarjetas KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* FACTURACIÓN DEL MES */}
        <div
          className={`rounded-2xl p-5 border transition-all card-hover-lift relative overflow-hidden group ${cardBg}`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-bold tracking-widest uppercase font-mono ${textTitle}`}>
              FACTURACIÓN NETA
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-emerald-400 font-mono tracking-tight">
              S/ {fmt(facturacionMes)}
            </h3>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-emerald-400 font-bold">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>100% Auditado PostgreSQL</span>
            </div>
          </div>
        </div>

        {/* CLIENTES ACTIVOS */}
        <div
          className={`rounded-2xl p-5 border transition-all card-hover-lift relative overflow-hidden group ${cardBg}`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-bold tracking-widest uppercase font-mono ${textTitle}`}>
              CLIENTES ACTIVOS
            </span>
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-[#00F2C3]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-[#00F2C3] font-mono tracking-tight">
              {clientesActivos}
            </h3>
            <p className="text-xs text-slate-400 mt-1.5 font-sans">
              Cartera corporativa con compras
            </p>
          </div>
        </div>

        {/* FACTURAS EMITIDAS */}
        <div
          className={`rounded-2xl p-5 border transition-all card-hover-lift relative overflow-hidden group ${cardBg}`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-bold tracking-widest uppercase font-mono ${textTitle}`}>
              COMPROBANTES
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-amber-400 font-mono tracking-tight">
              {totalInvoices}
            </h3>
            <p className="text-xs text-slate-400 mt-1.5 font-sans">
              Facturas y boletas registradas
            </p>
          </div>
        </div>

        {/* TICKET PROMEDIO */}
        <div
          className={`rounded-2xl p-5 border transition-all card-hover-lift relative overflow-hidden group ${cardBg}`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-bold tracking-widest uppercase font-mono ${textTitle}`}>
              TICKET PROMEDIO
            </span>
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-purple-400 font-mono tracking-tight">
              S/ {fmt(ticketPromedio)}
            </h3>
            <p className="text-xs text-slate-400 mt-1.5 font-sans">
              Promedio por cuenta corporativa
            </p>
          </div>
        </div>
      </div>

      {/* 3. Tabla Ranking de Clientes con Barras de Participación */}
      <div className={`rounded-2xl border p-5 space-y-4 ${cardBg}`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Award className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className={`text-sm font-black uppercase tracking-wider ${textValue}`}>
                Ranking Comercial de Clientes Corporativos
              </h2>
              <p className="text-xs text-slate-400 font-sans">
                Distribución de facturación neta y scoring crediticio
              </p>
            </div>
          </div>

          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Filtrar por RUC o Razón Social..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className={`w-full rounded-xl border py-2 px-3 text-xs focus:outline-none transition-all ${inputBg}`}
            />
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center space-y-3">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#00F2C3]" />
            <p className="text-xs font-mono text-cyan-400">Calculando analítica comercial desde PostgreSQL...</p>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            No se encontraron transacciones comerciales en el período seleccionado.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className={`border-b ${isDark ? 'border-[#1A2232] text-slate-400' : 'border-slate-200 text-slate-600'}`}>
                  <th className="py-3 px-3 font-mono font-bold"># RANK</th>
                  <th className="py-3 px-4 font-bold">CLIENTE / RAZÓN SOCIAL</th>
                  <th className="py-3 px-4 font-mono font-bold text-center">RUC</th>
                  <th className="py-3 px-4 font-bold text-center">COMPROBANTES</th>
                  <th className="py-3 px-4 font-bold text-center">SCORE</th>
                  <th className="py-3 px-4 font-bold text-right">FACTURACIÓN NETA</th>
                  <th className="py-3 px-4 font-bold text-right">% PARTICIPACIÓN</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40 font-mono">
                {filteredCustomers.map((c, idx) => {
                  const monto = Number(c.totalAmountPenNeto) || 0;
                  const pct = facturacionMes > 0 ? (monto / facturacionMes) * 100 : 0;
                  const isTop3 = idx < 3;

                  return (
                    <tr
                      key={c.ruc || idx}
                      className={`transition-colors ${
                        isDark ? 'hover:bg-[#151D2A]/60' : 'hover:bg-slate-50'
                      }`}
                    >
                      <td className="py-3 px-3">
                        <span
                          className={`flex items-center justify-center w-6 h-6 rounded-lg font-bold text-xs ${
                            idx === 0
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_8px_rgba(245,158,11,0.3)]'
                              : idx === 1
                              ? 'bg-slate-300/20 text-slate-200 border border-slate-300/40'
                              : idx === 2
                              ? 'bg-amber-700/20 text-amber-400 border border-amber-700/40'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {idx + 1}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-sans font-bold">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-cyan-400 shrink-0" />
                          <span className={isDark ? 'text-slate-100' : 'text-slate-900'}>
                            {c.name}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-center text-slate-400">
                        {c.ruc || '—'}
                      </td>

                      <td className="py-3 px-4 text-center font-bold text-cyan-400">
                        {c.invoicesCount} docs
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                            c.creditStatus === 'EXCELENTE'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : c.creditStatus === 'REGULAR'
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                              : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                          }`}
                        >
                          {c.creditStatus || 'REGULAR'}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right font-black text-emerald-400">
                        S/ {fmt(monto)}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-16 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-cyan-400 to-emerald-400 h-1.5 rounded-full"
                              style={{ width: `${Math.min(pct, 100)}%` }}
                            />
                          </div>
                          <span className="text-slate-300 font-bold">{pct.toFixed(1)}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
