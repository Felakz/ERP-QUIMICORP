'use client';

import React from 'react';
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Boxes,
  Percent,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Flame,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  ReferenceLine,
} from 'recharts';
import { useTheme } from '@/lib/ThemeContext';

export default function DashboardEjecutivoPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Rendimiento Diario Area Chart Data
  const rendimientoData = [
    { fecha: '25 Jul', producido: 1650, meta: 2000 },
    { fecha: '26 Jul', producido: 1820, meta: 2000 },
    { fecha: '27 Jul', producido: 1980, meta: 2000 },
    { fecha: '28 Jul', producido: 2150, meta: 2000 },
    { fecha: '29 Jul', producido: 1910, meta: 2000 },
    { fecha: '30 Jul', producido: 2380, meta: 2000 },
    { fecha: '31 Jul', producido: 2100, meta: 2000 },
  ];

  // Distribución de Merma Donut Chart Data
  const mermaData = [
    { name: 'Merma proceso', value: 42, color: '#00F2C3' },
    { name: 'Ajuste fino', value: 28, color: '#3B82F6' },
    { name: 'Residuos almacén', value: 18, color: '#EAB308' },
    { name: 'Evaporación', value: 12, color: '#EF4444' },
  ];

  // Mix de Producción Dual Bar Chart Data
  const mixProduccionData = [
    { producto: 'Det. Industrial', lotesPlan: 45, lotesReal: 42 },
    { producto: 'Limpiador 1L', lotesPlan: 38, lotesReal: 35 },
    { producto: 'Gel Antibac.', lotesPlan: 30, lotesReal: 31 },
    { producto: 'Cera Líquida', lotesPlan: 25, lotesReal: 22 },
    { producto: 'Desg. Mecánico', lotesPlan: 20, lotesReal: 18 },
  ];

  // Tendencia OEE Semanal Line Chart Data
  const oeeData = [
    { semana: 'Sem 26', oee: 68.4, target: 75 },
    { semana: 'Sem 27', oee: 71.2, target: 75 },
    { semana: 'Sem 28', oee: 68.9, target: 75 },
    { semana: 'Sem 29', oee: 74.1, target: 75 },
    { semana: 'Sem 30', oee: 76.1, target: 75 },
  ];

  const cardBg = isDark ? 'bg-[#0F141C] border-[#1A2232]' : 'bg-white border-slate-200 shadow-sm';
  const textTitle = isDark ? 'text-slate-400' : 'text-slate-500';
  const textValue = isDark ? 'text-white' : 'text-slate-900';
  const tooltipBg = isDark ? '#0F141C' : '#FFFFFF';
  const tooltipText = isDark ? '#F8FAFC' : '#0F172A';

  return (
    <div className="space-y-5">
      {/* Top 4 Metric KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: PRODUCCIÓN TOTAL */}
        <div className={`rounded-xl p-4 border relative overflow-hidden ${cardBg}`}>
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#00F2C3]" />
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-bold tracking-widest uppercase ${textTitle}`}>
              PRODUCCIÓN TOTAL
            </span>
            <span className="flex items-center text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">
              <ArrowUpRight className="h-3 w-3 mr-0.5" />
              +8.3% vs anterior
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className={`text-2xl font-black font-mono ${textValue}`}>16,140</span>
            <span className="text-xs text-slate-400 font-sans">Litros</span>
          </div>
        </div>

        {/* Card 2: MERMA PROMEDIO */}
        <div className={`rounded-xl p-4 border relative overflow-hidden ${cardBg}`}>
          <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500" />
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-bold tracking-widest uppercase ${textTitle}`}>
              MERMA PROMEDIO
            </span>
            <span className="flex items-center text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">
              <ArrowDownRight className="h-3 w-3 mr-0.5" />
              -0.8% vs anterior
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className={`text-2xl font-black font-mono ${textValue}`}>3.42%</span>
            <span className="text-xs text-slate-400 font-sans">de producción</span>
          </div>
        </div>

        {/* Card 3: OEE EFICIENCIA */}
        <div className={`rounded-xl p-4 border relative overflow-hidden ${cardBg}`}>
          <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500" />
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-bold tracking-widest uppercase ${textTitle}`}>
              OEE EFICIENCIA
            </span>
            <span className="flex items-center text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">
              <ArrowUpRight className="h-3 w-3 mr-0.5" />
              +2.1% vs anterior
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className={`text-2xl font-black font-mono ${textValue}`}>73.5%</span>
            <span className="text-xs text-slate-400 font-sans">score global</span>
          </div>
        </div>

        {/* Card 4: VALORIZACIÓN STOCK */}
        <div className={`rounded-xl p-4 border relative overflow-hidden ${cardBg}`}>
          <div className="absolute top-0 left-0 right-0 h-1 bg-purple-500" />
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-bold tracking-widest uppercase ${textTitle}`}>
              VALORIZACIÓN STOCK
            </span>
            <span className="flex items-center text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">
              <ArrowUpRight className="h-3 w-3 mr-0.5" />
              +S/ 4,280 vs anterior
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className={`text-2xl font-black font-mono ${textValue}`}>S/ 184,620</span>
            <span className="text-xs text-slate-400 font-sans">materia prima</span>
          </div>
        </div>
      </div>

      {/* Middle Row Charts (2 Columns: Rendimiento Area Chart & Merma Donut Chart) */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Rendimiento Diario Area Chart (2/3 width) */}
        <div className={`rounded-xl p-5 border space-y-4 lg:col-span-2 ${cardBg}`}>
          <div className="flex items-center justify-between border-b pb-3 border-[#1A2232]">
            <div>
              <h3 className={`text-xs font-bold tracking-widest uppercase ${textTitle}`}>
                RENDIMIENTO DIARIO (LITROS)
              </h3>
              <p className="text-xs text-slate-400 font-sans">
                Producción real diaria vs Meta proyectada (2,000 L)
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 font-bold text-[#00F2C3]">
                <span className="h-2.5 w-2.5 rounded-full bg-[#00F2C3]" /> Producido
              </span>
              <span className="flex items-center gap-1.5 font-bold text-slate-400">
                <span className="h-0.5 w-4 bg-slate-500" /> Meta
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={rendimientoData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorProducido" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00F2C3" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#00F2C3" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="fecha" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: tooltipBg,
                    borderColor: '#1A2232',
                    borderRadius: '8px',
                    color: tooltipText,
                    fontSize: '12px',
                  }}
                />
                <ReferenceLine y={2000} stroke="#64748B" strokeDasharray="3 3" />
                <Area
                  type="monotone"
                  dataKey="producido"
                  stroke="#00F2C3"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorProducido)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribución de Merma Donut Chart (1/3 width) */}
        <div className={`rounded-xl p-5 border space-y-4 ${cardBg}`}>
          <div className="border-b pb-3 border-[#1A2232]">
            <h3 className={`text-xs font-bold tracking-widest uppercase ${textTitle}`}>
              DISTRIBUCIÓN DE MERMA
            </h3>
            <p className="text-xs text-slate-400 font-sans">
              Clasificación por origen de mermas
            </p>
          </div>

          <div className="h-44 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mermaData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {mermaData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke={isDark ? '#0F141C' : '#FFFFFF'} strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: tooltipBg,
                    borderColor: '#1A2232',
                    borderRadius: '8px',
                    color: tooltipText,
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className={`text-xl font-black font-mono ${textValue}`}>3.42%</span>
              <span className="text-[10px] text-slate-400 uppercase font-sans">Total Merma</span>
            </div>
          </div>

          {/* Legend Items */}
          <div className="grid grid-cols-2 gap-2 pt-2 text-xs font-sans">
            {mermaData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-slate-400 truncate">{item.name}</span>
                <span className={`font-bold ml-auto ${textValue}`}>{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row Charts (2 Columns: Mix de Producción Bar Chart & Tendencia OEE Line Chart) */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Mix de Producción Dual Bar Chart */}
        <div className={`rounded-xl p-5 border space-y-4 ${cardBg}`}>
          <div className="flex items-center justify-between border-b pb-3 border-[#1A2232]">
            <div>
              <h3 className={`text-xs font-bold tracking-widest uppercase ${textTitle}`}>
                MIX DE PRODUCCIÓN – LOTES
              </h3>
              <p className="text-xs text-slate-400 font-sans">
                Lotes planificados vs Lotes realmente ejecutados
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 font-bold text-[#00F2C3]">
                <span className="h-2.5 w-2.5 rounded bg-[#00F2C3]" /> Ejecutado
              </span>
              <span className="flex items-center gap-1.5 font-bold text-slate-400">
                <span className="h-2.5 w-2.5 rounded bg-slate-600" /> Planificado
              </span>
            </div>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mixProduccionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="producto" stroke="#64748B" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: tooltipBg,
                    borderColor: '#1A2232',
                    borderRadius: '8px',
                    color: tooltipText,
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="lotesPlan" fill="#334155" radius={[4, 4, 0, 0]} />
                <Bar dataKey="lotesReal" fill="#00F2C3" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tendencia OEE Semanal Line Chart */}
        <div className={`rounded-xl p-5 border space-y-4 ${cardBg}`}>
          <div className="flex items-center justify-between border-b pb-3 border-[#1A2232]">
            <div>
              <h3 className={`text-xs font-bold tracking-widest uppercase ${textTitle}`}>
                TENDENCIA OEE SEMANAL (%)
              </h3>
              <p className="text-xs text-slate-400 font-sans">
                Evolución global de eficiencia de planta vs Objetivo (75%)
              </p>
            </div>
            <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-500 border border-emerald-500/20">
              73.5% ↑ +2.1%
            </span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={oeeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="semana" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis domain={[60, 85]} stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: tooltipBg,
                    borderColor: '#1A2232',
                    borderRadius: '8px',
                    color: tooltipText,
                    fontSize: '12px',
                  }}
                />
                <ReferenceLine y={75} stroke="#EAB308" strokeDasharray="4 4" label={{ value: 'OBJETIVO ≥ 75%', fill: '#EAB308', fontSize: 10, position: 'top' }} />
                <Line
                  type="monotone"
                  dataKey="oee"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#3B82F6' }}
                  activeDot={{ r: 6, fill: '#00F2C3' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Live Alert Ticker Bar */}
      <div className={`rounded-xl p-3.5 border flex items-center gap-3 overflow-hidden ${cardBg}`}>
        <span className="flex items-center gap-1.5 rounded-md bg-rose-500/20 px-2.5 py-1 text-xs font-bold text-rose-400 shrink-0 border border-rose-500/30">
          <Flame className="h-3.5 w-3.5 animate-pulse" />
          ALERTAS EJECUTIVAS
        </span>
        <div className="flex-1 overflow-hidden text-xs text-slate-300 font-sans truncate">
          <span className="text-rose-400 font-bold mr-3">🔴 Lote LOT-0887 rechazado — merma 8.2% excede umbral</span>
          <span className="text-amber-400 font-bold mr-3">🟠 2 materiales en estado crítico (NaOH, Formol)</span>
          <span className="text-amber-400 font-bold mr-3">🟠 OEE semana 28 por debajo del objetivo (68.9%)</span>
          <span className="text-blue-400 font-bold">🔵 Reactor A2 en operación normal</span>
        </div>
      </div>
    </div>
  );
}
