'use client';

import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Phone,
  Mail,
  Building2,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  MessageSquare,
} from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';

export default function VentasPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [searchTerm, setSearchTerm] = useState('');
  const cardBg = isDark ? 'bg-[#0F141C] border-[#1A2232]' : 'bg-white border-slate-200 shadow-sm';
  const textTitle = isDark ? 'text-slate-400' : 'text-slate-500';
  const textValue = isDark ? 'text-white' : 'text-slate-900';

  const cotizacionesActivas = [
    {
      id: 'COT-2026-091',
      cliente: 'Farmacias Peruanas S.A.C.',
      ruc: '20381396431',
      contacto: 'Ing. Rodrigo Salcedo',
      producto: 'Crema Muscular Mentolada 1KG',
      cantidad: '128 UN',
      monto: 'S/ 14,720.00',
      estado: 'CERRADA_GANADA',
      fecha: '05 Ago 2026',
    },
    {
      id: 'COT-2026-092',
      cliente: 'Laboratorios Farmaindustria',
      ruc: '20100084729',
      contacto: 'Dra. Patricia Noriega',
      producto: 'Alcohol Isopropílico USP 99.8%',
      cantidad: '1,500 L',
      monto: 'S/ 24,000.00',
      estado: 'EN_NEGOCIACION',
      fecha: '06 Ago 2026',
    },
    {
      id: 'COT-2026-093',
      cliente: 'Austin Cosmetics Perú',
      ruc: '20601234567',
      contacto: 'Ing. Carlos Austin',
      producto: 'Shampoo de Batana Orgánico 500ML',
      cantidad: '500 UN',
      monto: 'S/ 32,500.00',
      estado: 'ENVIADA',
      fecha: '06 Ago 2026',
    },
    {
      id: 'COT-2026-094',
      cliente: 'Clínica Ricardo Palma',
      ruc: '20100142869',
      contacto: 'Lic. Fernando Ruiz',
      producto: 'Detergente Enzimático Grado Quirúrgico',
      cantidad: '80 Galones',
      monto: 'S/ 18,900.00',
      estado: 'EN_SEGUIMIENTO',
      fecha: '07 Ago 2026',
    },
  ];

  return (
    <div className="space-y-6 font-mono min-h-screen">
      {/* Header Banner de Ventas & Atención */}
      <div className={`rounded-2xl p-6 border flex flex-wrap items-center justify-between gap-4 ${cardBg}`}>
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 text-slate-950 flex items-center justify-center font-black text-lg shadow-lg shadow-emerald-500/20">
              🤝
            </div>
            <div>
              <h2 className={`text-xl font-bold font-sans tracking-tight ${textValue}`}>
                PORTAL DE VENTAS & ATENCIÓN AL CLIENTE DIGITAL
              </h2>
              <p className="text-xs text-slate-400 font-sans">
                Gestión de cotizaciones, clientes corporativos, seguimiento de pedidos y canal WhatsApp Business
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 font-sans">
          <button className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00F2C3] to-cyan-500 text-slate-950 font-bold text-xs tracking-wider uppercase hover:opacity-90 transition-all shadow-lg shadow-[#00F2C3]/20 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span>Nueva Cotización Comercial</span>
          </button>
        </div>
      </div>

      {/* 4 KPIs de Ventas */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className={`rounded-xl p-5 border space-y-2 ${cardBg}`}>
          <span className={`text-[10px] font-bold tracking-widest uppercase block ${textTitle}`}>
            COTIZACIONES ACTIVAS
          </span>
          <div className="text-2xl font-black text-[#00F2C3] font-mono">18 <span className="text-xs font-normal text-slate-400">Propuestas</span></div>
          <p className="text-[11px] text-slate-400 font-sans">Valor total en pipeline: S/ 142,500</p>
        </div>

        <div className={`rounded-xl p-5 border space-y-2 ${cardBg}`}>
          <span className={`text-[10px] font-bold tracking-widest uppercase block ${textTitle}`}>
            TASA DE CIERRE
          </span>
          <div className="text-2xl font-black text-cyan-400 font-mono">68.4 %</div>
          <p className="text-[11px] text-slate-400 font-sans">+5.2% vs mes anterior</p>
        </div>

        <div className={`rounded-xl p-5 border space-y-2 ${cardBg}`}>
          <span className={`text-[10px] font-bold tracking-widest uppercase block ${textTitle}`}>
            TIEMPO DE RESPUESTA
          </span>
          <div className="text-2xl font-black text-amber-400 font-mono">14 min</div>
          <p className="text-[11px] text-slate-400 font-sans">Atención promedio en canal digital</p>
        </div>

        <div className={`rounded-xl p-5 border space-y-2 ${cardBg}`}>
          <span className={`text-[10px] font-bold tracking-widest uppercase block ${textTitle}`}>
            CLIENTES CORPORATIVOS B2B
          </span>
          <div className="text-2xl font-black text-purple-400 font-mono">142</div>
          <p className="text-[11px] text-slate-400 font-sans">Farmacias, clínicas y distribuidores</p>
        </div>
      </div>

      {/* Tabla de Cotizaciones y Pipeline */}
      <div className={`rounded-2xl border p-5 space-y-4 ${cardBg}`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar cliente, RUC o producto..."
              className={`rounded-xl px-3 py-1.5 text-xs font-mono outline-none border ${
                isDark
                  ? 'bg-[#151D2A] border-[#1A2232] text-slate-200'
                  : 'bg-slate-50 border-slate-300 text-slate-800'
              }`}
            />
          </div>
          <span className="text-xs text-slate-400 font-sans">Mostrando 4 cotizaciones recientes</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className={`border-b ${isDark ? 'border-[#1A2232] text-slate-400' : 'border-slate-200 text-slate-600'}`}>
                <th className="py-3 px-3">CÓDIGO</th>
                <th className="py-3 px-3">CLIENTE / EMPRESA</th>
                <th className="py-3 px-3">PRODUCTO SOLICITADO</th>
                <th className="py-3 px-3 text-right">MONTO</th>
                <th className="py-3 px-3 text-center">ESTADO</th>
                <th className="py-3 px-3 text-center">ACCIONES</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-[#1A2232]' : 'divide-slate-200'}`}>
              {cotizacionesActivas.map((c) => (
                <tr key={c.id} className={isDark ? 'hover:bg-slate-800/30' : 'hover:bg-slate-50'}>
                  <td className="py-3 px-3 font-bold text-[#00F2C3]">{c.id}</td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-200">{c.cliente}</div>
                    <div className="text-[10px] text-slate-400">RUC: {c.ruc} · {c.contacto}</div>
                  </td>
                  <td className="py-3 px-3 text-slate-300">{c.producto} ({c.cantidad})</td>
                  <td className="py-3 px-3 text-right font-bold text-emerald-400">{c.monto}</td>
                  <td className="py-3 px-3 text-center">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {c.estado}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <button className="px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 text-[11px] font-bold">
                      Ver Ficha
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
