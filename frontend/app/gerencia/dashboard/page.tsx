'use client';

import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  Boxes,
  Factory,
  ShieldCheck,
  Users,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  Building2,
  Calendar,
  Download,
  Flame,
  Activity,
  Layers,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { useTheme } from '@/lib/ThemeContext';

export default function GerenciaPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const cardBg = isDark ? 'bg-[#0F141C] border-[#1A2232]' : 'bg-white border-slate-200 shadow-sm';
  const textTitle = isDark ? 'text-slate-400' : 'text-slate-500';
  const textValue = isDark ? 'text-white' : 'text-slate-900';

  const ingresosMensuales = [
    { mes: 'Ene', ventas: 145000, margen: 52000, costo: 93000 },
    { mes: 'Feb', ventas: 168000, margen: 61000, costo: 107000 },
    { mes: 'Mar', ventas: 192000, margen: 74000, costo: 118000 },
    { mes: 'Abr', ventas: 185000, margen: 69000, costo: 116000 },
    { mes: 'May', ventas: 215000, margen: 83000, costo: 132000 },
    { mes: 'Jun', ventas: 248000, margen: 98000, costo: 150000 },
    { mes: 'Jul', ventas: 284000, margen: 115000, costo: 169000 },
    { mes: 'Ago (Proy)', ventas: 310000, margen: 128000, costo: 182000 },
  ];

  const distribucionVentasPorLinea = [
    { name: 'Línea Cosmética & Cuidado Personal', value: 42, color: '#00F2C3' },
    { name: 'Limpieza & Desinfección Industrial', value: 28, color: '#3B82F6' },
    { name: 'Materia Prima & Soluciones Químicas', value: 18, color: '#EAB308' },
    { name: 'Maquila & Fabricación a Terceros', value: 12, color: '#A855F7' },
  ];

  return (
    <div className="space-y-6 font-mono min-h-screen">
      {/* Header Banner Ejecutivo */}
      <div className={`rounded-2xl p-6 border flex flex-wrap items-center justify-between gap-4 ${cardBg}`}>
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 flex items-center justify-center font-black text-lg shadow-lg shadow-amber-500/20">
              👑
            </div>
            <div>
              <h2 className={`text-xl font-bold font-sans tracking-tight ${textValue}`}>
                PANEL DE CONTROL GERENCIAL & DIRECCIÓN EJECUTIVA
              </h2>
              <p className="text-xs text-slate-400 font-sans">
                Visión holística, rentabilidad neta, rendimiento de planta y auditoría global Quimicorp Perú S.A.C.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 font-sans">
          <button
            className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 ${
              isDark
                ? 'bg-[#151D2A] text-slate-200 border-[#1A2232] hover:bg-slate-800'
                : 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Exportar Balance Directorio</span>
          </button>
        </div>
      </div>

      {/* 4 KPIs Clave de Gerencia */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className={`rounded-xl p-5 border space-y-2 relative overflow-hidden ${cardBg}`}>
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#00F2C3]" />
          <span className={`text-[10px] font-bold tracking-widest uppercase block ${textTitle}`}>
            FACTURACIÓN MENSUAL (JUL-AGO)
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-[#00F2C3] font-mono">S/ 284,590.00</span>
            <span className="flex items-center text-xs font-bold text-emerald-400">
              <ArrowUpRight className="w-3.5 h-3.5" /> +14.5%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-sans">Meta del mes: S/ 300,000 alcanzada al 94.8%</p>
        </div>

        <div className={`rounded-xl p-5 border space-y-2 relative overflow-hidden ${cardBg}`}>
          <div className="absolute top-0 left-0 right-0 h-1 bg-cyan-500" />
          <span className={`text-[10px] font-bold tracking-widest uppercase block ${textTitle}`}>
            MARGEN BRUTO CONSOLIDADO
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-cyan-400 font-mono">40.41 %</span>
            <span className="flex items-center text-xs font-bold text-emerald-400">
              <ArrowUpRight className="w-3.5 h-3.5" /> +2.1%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-sans">Utilidad operativa bruta estimada: S/ 115,000</p>
        </div>

        <div className={`rounded-xl p-5 border space-y-2 relative overflow-hidden ${cardBg}`}>
          <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500" />
          <span className={`text-[10px] font-bold tracking-widest uppercase block ${textTitle}`}>
            VALORIZACIÓN DE STOCK EN PLANTA
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-amber-400 font-mono">S/ 495,930.00</span>
            <span className="text-xs text-slate-400 font-sans font-bold">183 Ítems</span>
          </div>
          <p className="text-[11px] text-slate-400 font-sans">Inventario físico valorizado en almacén central</p>
        </div>

        <div className={`rounded-xl p-5 border space-y-2 relative overflow-hidden ${cardBg}`}>
          <div className="absolute top-0 left-0 right-0 h-1 bg-purple-500" />
          <span className={`text-[10px] font-bold tracking-widest uppercase block ${textTitle}`}>
            EFICIENCIA GLOBAL OEE (PLANTA)
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-purple-400 font-mono">76.1 %</span>
            <span className="flex items-center text-xs font-bold text-emerald-400">
              <ArrowUpRight className="w-3.5 h-3.5" /> +4.2%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-sans">Reactores R-01, R-02 y línea de envasado</p>
        </div>
      </div>

      {/* Gráficos Estratégicos de Dirección */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Gráfico 1: Evolución de Ventas vs Costos (2 columnas) */}
        <div className={`rounded-2xl p-6 border lg:col-span-2 space-y-4 ${cardBg}`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-sm font-bold font-sans ${textValue}`}>EVOLUCIÓN FINANCIERA & FACTURACIÓN HISTÓRICA</h3>
              <p className="text-xs text-slate-400 font-sans">Comparativa de ingresos por ventas vs costo de materias primas</p>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ingresosMensuales}>
                <defs>
                  <linearGradient id="ventasGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00F2C3" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#00F2C3" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="mes" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} tickFormatter={(v) => `S/ ${v / 1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: isDark ? '#0F141C' : '#FFF', borderColor: '#1A2232', borderRadius: '12px' }}
                />
                <Area type="monotone" dataKey="ventas" stroke="#00F2C3" strokeWidth={3} fill="url(#ventasGrad)" name="Ventas Totales" />
                <Area type="monotone" dataKey="margen" stroke="#3B82F6" strokeWidth={2} fill="none" name="Margen Bruto" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico 2: Mix de Ventas por Línea */}
        <div className={`rounded-2xl p-6 border space-y-4 ${cardBg}`}>
          <div>
            <h3 className={`text-sm font-bold font-sans ${textValue}`}>MIX DE NEGOCIO POR LÍNEA</h3>
            <p className="text-xs text-slate-400 font-sans">Participación porcentual en ingresos</p>
          </div>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={distribucionVentasPorLinea} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} innerRadius={45} paddingAngle={4}>
                  {distribucionVentasPorLinea.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: isDark ? '#0F141C' : '#FFF', borderRadius: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 text-xs font-sans">
            {distribucionVentasPorLinea.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="truncate max-w-[180px]">{item.name}</span>
                </span>
                <span className="font-bold font-mono text-slate-200">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
