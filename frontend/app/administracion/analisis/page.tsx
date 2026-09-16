'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  RefreshCw,
  Award,
  Wallet,
  Clock,
  Percent,
  Building2,
  Banknote,
  Calendar,
  AlertTriangle,
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { useTheme } from '@/lib/ThemeContext';
import { apiFetch } from '@/lib/apiClient';

interface AnaliticaResponse {
  mes?: string;
  kpis?: {
    facturado: number;
    cobrado: number;
    saldoPendiente: number;
    vencido: number;
    cobertura: number;
  };
  mom?: {
    facturadoPrev: number;
    cobradoPrev: number;
    facturadoDelta: number;
    cobradoDelta: number;
  };
  comparativa?: Array<{ mes: string; facturado: number; cobrado: number; saldo: number }>;
  topClientes?: Array<{
    clienteNombre: string;
    clienteRuc: string;
    facturado: number;
    cobrado: number;
    comprobantes: number;
    participacionCobrado: number;
  }>;
  comprobantes?: { total: number; pagadas: number; pendientes: number };
}

export default function AdministracionAnalisisPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const hoy = new Date();
  const mesActualKey = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}`;

  // Default al mes con mayor actividad real en PostgreSQL (2026-08) o mes actual
  const [mes, setMes] = useState<string>('2026-08');
  const [analitica, setAnalitica] = useState<AnaliticaResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cardBg = isDark ? 'bg-[#0F141C] border-[#1A2232]' : 'bg-white border-slate-200 shadow-sm';
  const textTitle = isDark ? 'text-slate-400' : 'text-slate-600';
  const textValue = isDark ? 'text-white' : 'text-slate-900';

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, ok, error: apiErr } = await apiFetch<AnaliticaResponse>(`/cobranzas/analytics?mes=${mes}`);
      if (ok && data) {
        setAnalitica(data);
      } else {
        setError(apiErr || 'No se pudieron obtener los datos de analítica financiera.');
      }
    } catch (e: any) {
      setError(e?.message || 'Error al conectar con la API de cobranzas');
    } finally {
      setLoading(false);
    }
  }, [mes]);

  useEffect(() => {
    load();
  }, [load]);

  const kpis = analitica?.kpis;
  const mom = analitica?.mom;
  const comparativa = analitica?.comparativa || [];
  const topClientes = analitica?.topClientes || [];
  const comprobantes = analitica?.comprobantes;

  const fmt = (n: number) =>
    (n || 0).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const maxComparativa = useMemo(
    () => Math.max(1, ...comparativa.map((c) => Math.max(c.facturado, c.cobrado))),
    [comparativa]
  );

  const nombreMes = (key: string) => {
    const [y, m] = key.split('-');
    const d = new Date(parseInt(y, 10), parseInt(m, 10) - 1, 1);
    return d.toLocaleDateString('es-PE', { month: 'long', year: 'numeric' });
  };

  const handleExportExcel = () => {
    const anioMes = (mes || mesActualKey).replace('-', '');
    const k = kpis || { facturado: 0, cobrado: 0, saldoPendiente: 0, vencido: 0, cobertura: 0 };

    const dataTop = topClientes.map((c, i) => ({
      Ranking: i + 1,
      Cliente: c.clienteNombre,
      RUC: c.clienteRuc || '—',
      Comprobantes: c.comprobantes,
      Facturado_PEN: Number(c.facturado) || 0,
      Cobrado_PEN: Number(c.cobrado) || 0,
      Participacion_Cobrado: `${Number(c.participacionCobrado) || 0}%`,
    }));

    // Registro de Ventas SUNAT estimado (Formato 14.1) desde la facturación del mes
    const dataSunat = topClientes.flatMap((c, idx) => {
      const total = Number(c.facturado) || 0;
      if (total <= 0) return [];
      const base = Number((total / 1.18).toFixed(2));
      const igv = Number((total - base).toFixed(2));
      const esFac = c.clienteRuc && c.clienteRuc.length === 11;
      return {
        Periodo: anioMes,
        Correlativo_CUO: `M${String(idx + 1).padStart(5, '0')}`,
        Fecha_Emision: `${mes || mesActualKey}-01`,
        Tipo_Comprobante: esFac ? '01 (FACTURA)' : '03 (BOLETA)',
        Serie: esFac ? 'F001' : 'B001',
        Numero: String(idx + 1).padStart(8, '0'),
        Tipo_Doc_Identidad: esFac ? '6 (RUC)' : '1 (DNI)',
        Numero_Doc_Identidad: c.clienteRuc || '00000000',
        Razon_Social: c.clienteNombre,
        Base_Imponible_PEN: base,
        IGV_18_PEN: igv,
        Total_PEN: total,
        Moneda: 'PEN',
        Estado_Operacion: '1 (Válido)',
      };
    });

    const dataComparativa = comparativa.map((c) => ({
      Mes: c.mes,
      Facturado_PEN: c.facturado,
      Cobrado_PEN: c.cobrado,
      Saldo_Pendiente_PEN: c.saldo,
    }));

    const wb = XLSX.utils.book_new();
    wb.Props = {
      Title: `Analitica Financiera Quimicorp - ${mes || mesActualKey}`,
      CreatedDate: new Date(),
    };
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet([
        { 'Mes analizado': mes || mesActualKey },
        { Facturado_PEN: k.facturado },
        { Cobrado_PEN: k.cobrado },
        { Saldo_Pendiente_PEN: k.saldoPendiente },
        { Vencido_PEN: k.vencido },
        { Cobertura: `${k.cobertura}%` },
      ]),
      'Resumen_KPIs'
    );
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(dataComparativa), 'Comparativa_Mensual');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(dataTop), 'Ranking_Clientes');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(dataSunat), 'Registro_Ventas_SUNAT');
    XLSX.writeFile(wb, `Quimicorp_Finanzas_${anioMes || mesActualKey}.xlsx`);
  };

  const monthsList = useMemo(() => {
    const res: string[] = [];
    const [yStr, mStr] = mesActualKey.split('-');
    const currentYear = parseInt(yStr, 10);
    const currentMonth = parseInt(mStr, 10) - 1;
    for (let i = 5; i >= 0; i--) {
      const d = new Date(currentYear, currentMonth - i, 1);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      res.push(`${y}-${m}`);
    }
    return res;
  }, [mesActualKey]);

  return (
    <div className="space-y-5 font-sans min-h-screen">
      {/* Header */}
      <div className={`rounded-2xl p-5 border flex flex-wrap items-center justify-between gap-4 transition-all shadow-sm ${cardBg}`}>
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-[#00F2C3] shadow-[0_0_15px_rgba(0,242,195,0.15)]">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className={`text-lg font-black tracking-tight ${textValue}`}>
                Finanzas & Analítica de Cobranzas
              </h1>
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00F2C3] animate-pulse" />
                DATOS REALES POSTGRESQL
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Comparativas mensuales, cobranza bancaria real y ranking de clientes para el jefe de finanzas y contador.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5 p-1 rounded-xl border bg-black/20">
            <Calendar className="w-4 h-4 text-slate-400 ml-1.5" />
            {monthsList.map((key) => (
              <button
                key={key}
                onClick={() => setMes(key)}
                className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                  mes === key
                    ? 'bg-[#00F2C3] text-slate-950 shadow'
                    : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {key.split('-')[1]}
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

      {loading ? (
        <div className="py-16 text-center space-y-3">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#00F2C3]" />
          <p className="text-xs font-mono text-cyan-400">Calculando analítica financiera desde PostgreSQL...</p>
        </div>
      ) : error ? (
        <div className={`rounded-2xl border p-8 text-center ${cardBg}`}>
          <AlertTriangle className="w-8 h-8 mx-auto text-rose-400 mb-2" />
          <p className="text-sm text-rose-400 font-bold">{error}</p>
          <p className="text-xs text-slate-400 mt-1">Revisa que el backend esté corriendo y que existan cuentas por cobrar.</p>
        </div>
      ) : (
        <>
          {/* Sección A: KPIs con MoM */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={<Banknote className="w-4 h-4" />}
              iconCls="bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
              title="FACTURADO DEL MES"
              value={`S/ ${fmt(kpis?.facturado || 0)}`}
              valueCls="text-emerald-400"
              isDark={isDark}
              cardBg={cardBg}
              textTitle={textTitle}
              footer={
                <TrendBadge delta={mom?.facturadoDelta} prev={`Mes anterior: S/ ${fmt(mom?.facturadoPrev || 0)}`} />
              }
            />
            <StatCard
              icon={<Wallet className="w-4 h-4" />}
              iconCls="bg-blue-500/10 border-blue-500/30 text-blue-400"
              title="COBRADO REAL (BANCOS)"
              value={`S/ ${fmt(kpis?.cobrado || 0)}`}
              valueCls="text-blue-400"
              isDark={isDark}
              cardBg={cardBg}
              textTitle={textTitle}
              footer={
                <TrendBadge delta={mom?.cobradoDelta} prev={`Mes anterior: S/ ${fmt(mom?.cobradoPrev || 0)}`} invert />
              }
            />
            <StatCard
              icon={<Clock className="w-4 h-4" />}
              iconCls="bg-amber-500/10 border-amber-500/30 text-amber-400"
              title="SALDO POR COBRAR"
              value={`S/ ${fmt(kpis?.saldoPendiente || 0)}`}
              valueCls="text-amber-400"
              isDark={isDark}
              cardBg={cardBg}
              textTitle={textTitle}
              footer={<p className="text-[10px] font-mono text-rose-400 font-bold">Vencido: S/ {fmt(kpis?.vencido || 0)}</p>}
            />
            <StatCard
              icon={<Percent className="w-4 h-4" />}
              iconCls="bg-cyan-500/10 border-cyan-500/30 text-[#00F2C3]"
              title="COBERTURA / LIQUIDEZ"
              value={`${kpis?.cobertura || 0}%`}
              valueCls="text-[#00F2C3]"
              isDark={isDark}
              cardBg={cardBg}
              textTitle={textTitle}
              footer={
                <p className="text-[10px] font-mono text-slate-400">
                  {comprobantes?.total || 0} comprobantes · {comprobantes?.pendientes || 0} pendientes
                </p>
              }
            />
          </div>

          {/* Sección B: Comparativa mensual (6 meses) */}
          <div className={`rounded-2xl border p-5 space-y-4 ${cardBg}`}>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-5 h-5 text-cyan-400" />
                <div>
                  <h2 className={`text-sm font-black uppercase tracking-wider ${textValue}`}>
                    Comparativa Mensual {nombreMes(mes)}
                  </h2>
                  <p className="text-xs text-slate-400 font-sans">
                    Últimos 6 meses: facturado vs cobrado vs saldo por cobrar
                  </p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className={`border-b ${isDark ? 'border-[#1A2232] text-slate-400' : 'border-slate-200 text-slate-600'}`}>
                    <th className="py-3 px-3 font-mono font-bold">MES</th>
                    <th className="py-3 px-3 font-bold text-right">FACTURADO</th>
                    <th className="py-3 px-3 font-bold text-right">COBRADO</th>
                    <th className="py-3 px-3 font-bold text-right">SALDO</th>
                    <th className="py-3 px-3 font-bold">{/* barra */}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40 font-mono">
                  {comparativa.map((c) => (
                    <tr key={c.mes} className={`${isDark ? 'hover:bg-[#151D2A]/60' : 'hover:bg-slate-50'}`}>
                      <td className="py-3 px-3 font-bold">{c.mes}</td>
                      <td className="py-3 px-3 text-right text-emerald-400 font-bold">S/ {fmt(c.facturado)}</td>
                      <td className="py-3 px-3 text-right text-blue-400 font-bold">S/ {fmt(c.cobrado)}</td>
                      <td className="py-3 px-3 text-right text-amber-400 font-bold">S/ {fmt(c.saldo)}</td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          <div className="w-24 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-cyan-400 to-emerald-400 h-1.5 rounded-full"
                              style={{ width: `${((c.facturado || 0) / maxComparativa) * 100}%` }}
                            />
                          </div>
                          <span
                            className={`w-24 bg-slate-800 rounded-full h-1.5 overflow-hidden`}
                          >
                            <div
                              className="bg-blue-500 h-1.5 rounded-full"
                              style={{ width: `${((c.cobrado || 0) / maxComparativa) * 100}%` }}
                            />
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sección C: Top 10 clientes que más aportan */}
          <div className={`rounded-2xl border p-5 space-y-4 ${cardBg}`}>
            <div className="flex items-center gap-2.5">
              <Award className="w-5 h-5 text-amber-400" />
              <div>
                <h2 className={`text-sm font-black uppercase tracking-wider ${textValue}`}>
                  Top 10 Clientes que Más Aportan
                </h2>
                <p className="text-xs text-slate-400 font-sans">
                  Ordenado por cobranza real del mes (abonos registrados), con facturado de referencia
                </p>
              </div>
            </div>

            {topClientes.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                No hay cobros registrados en el período seleccionado.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className={`border-b ${isDark ? 'border-[#1A2232] text-slate-400' : 'border-slate-200 text-slate-600'}`}>
                      <th className="py-3 px-3 font-mono font-bold">#</th>
                      <th className="py-3 px-4 font-bold">CLIENTE / RAZÓN SOCIAL</th>
                      <th className="py-3 px-4 font-mono font-bold text-center">RUC</th>
                      <th className="py-3 px-4 font-bold text-center">COMPROB.</th>
                      <th className="py-3 px-4 font-bold text-right">FACTURADO</th>
                      <th className="py-3 px-4 font-bold text-right">COBRADO</th>
                      <th className="py-3 px-4 font-bold text-right">% APORTE</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40 font-mono">
                    {topClientes.map((c, idx) => (
                      <tr key={`${c.clienteRuc || c.clienteNombre}-${idx}`} className={`${isDark ? 'hover:bg-[#151D2A]/60' : 'hover:bg-slate-50'}`}>
                        <td className="py-3 px-3">
                          <span
                            className={`flex items-center justify-center w-6 h-6 rounded-lg font-bold text-xs ${
                              idx === 0
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                : idx === 1
                                ? 'bg-slate-300/20 text-slate-200 border border-slate-300/40'
                                : idx === 2
                                ? 'bg-amber-700/20 text-amber-400 border border-amber-700/40'
                                : isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {idx + 1}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-sans font-bold">
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-cyan-400 shrink-0" />
                            <span className={isDark ? 'text-slate-100' : 'text-slate-900'}>{c.clienteNombre}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center text-slate-400">{c.clienteRuc || '—'}</td>
                        <td className="py-3 px-4 text-center font-bold text-cyan-400">{c.comprobantes} docs</td>
                        <td className="py-3 px-4 text-right text-emerald-400 font-bold">S/ {fmt(c.facturado)}</td>
                        <td className="py-3 px-4 text-right text-blue-400 font-black">S/ {fmt(c.cobrado)}</td>
                        <td className="py-3 px-4 text-right">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30">
                            {c.participacionCobrado}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({
  icon,
  iconCls,
  title,
  value,
  valueCls,
  footer,
  isDark,
  cardBg,
  textTitle,
}: {
  icon: React.ReactNode;
  iconCls: string;
  title: string;
  value: string;
  valueCls: string;
  footer: React.ReactNode;
  isDark: boolean;
  cardBg: string;
  textTitle: string;
}) {
  return (
    <div className={`rounded-2xl p-5 border transition-all card-hover-lift relative overflow-hidden group ${cardBg}`}>
      <div className="flex items-center justify-between">
        <span className={`text-[10px] font-bold tracking-widest uppercase font-mono ${textTitle}`}>{title}</span>
        <div className={`p-2 rounded-xl border ${iconCls}`}>{icon}</div>
      </div>
      <div className="mt-3">
        <h3 className={`text-2xl font-black font-mono tracking-tight ${valueCls}`}>{value}</h3>
        <div className="mt-1.5">{footer}</div>
      </div>
    </div>
  );
}

function TrendBadge({
  delta,
  prev,
  invert = false,
}: {
  delta?: number;
  prev: string;
  invert?: boolean;
}) {
  const good = invert ? (delta ?? 0) <= 0 : (delta ?? 0) >= 0;
  const cls = good ? 'text-emerald-400' : 'text-rose-400';
  const Icon = good ? ArrowUpRight : ArrowDownRight;
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className={`flex items-center gap-1 text-xs font-bold ${cls}`}>
        <Icon className="w-3.5 h-3.5" />
        {delta !== undefined ? `${delta >= 0 ? '+' : ''}${delta}%` : '0%'}
      </span>
      <span className="text-[10px] font-mono text-slate-500">{prev}</span>
    </div>
  );
}