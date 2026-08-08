'use client';

import React, { useState } from 'react';
import {
  Truck,
  Search,
  Plus,
  Building2,
  FileCheck,
  AlertTriangle,
  Clock,
  DollarSign,
  Package,
} from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';

export default function ComprasPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const cardBg = isDark ? 'bg-[#0F141C] border-[#1A2232]' : 'bg-white border-slate-200 shadow-sm';
  const textTitle = isDark ? 'text-slate-400' : 'text-slate-500';
  const textValue = isDark ? 'text-white' : 'text-slate-900';

  const ordenesCompra = [
    {
      oc: 'OC-2026-041',
      proveedor: 'Insuquímica del Perú S.A.',
      insumo: 'Lauril Éter Sulfato de Sodio 70% (LESS)',
      cantidad: '2,000 KG',
      monto: 'S/ 18,400.00',
      fechaEntrega: '11 Ago 2026',
      estado: 'EN_TRANSITO',
    },
    {
      oc: 'OC-2026-042',
      proveedor: 'Química Suiza S.A.C.',
      insumo: 'Soda Cáustica Escamas 99%',
      cantidad: '1,000 KG',
      monto: 'S/ 6,500.00',
      fechaEntrega: '12 Ago 2026',
      estado: 'CONFIRMADA',
    },
    {
      oc: 'OC-2026-043',
      proveedor: 'Aromas & Químicos Andinos',
      insumo: 'Mentol Cristalino USP',
      cantidad: '100 KG',
      monto: 'S/ 14,200.00',
      fechaEntrega: '14 Ago 2026',
      estado: 'SOLICITADA',
    },
    {
      oc: 'OC-2026-044',
      proveedor: 'Plásticos Industriales Lima S.A.C.',
      insumo: 'Bidón PEAD 20L Boca Ancha Blanco',
      cantidad: '800 UN',
      monto: 'S/ 7,200.00',
      fechaEntrega: '15 Ago 2026',
      estado: 'CONFIRMADA',
    },
  ];

  return (
    <div className="space-y-6 font-mono min-h-screen">
      {/* Header Banner de Compras & Proveedores */}
      <div className={`rounded-2xl p-6 border flex flex-wrap items-center justify-between gap-4 ${cardBg}`}>
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 text-slate-950 flex items-center justify-center font-black text-lg shadow-lg shadow-cyan-500/20">
              📦
            </div>
            <div>
              <h2 className={`text-xl font-bold font-sans tracking-tight ${textValue}`}>
                GESTIÓN DE COMPRAS, MATERIAS PRIMAS & PROVEEDORES
              </h2>
              <p className="text-xs text-slate-400 font-sans">
                Aprovisionamiento de insumos químicos, cotizaciones, órdenes de compra y evaluación de proveedores homologados
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 font-sans">
          <button className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00F2C3] to-cyan-500 text-slate-950 font-bold text-xs tracking-wider uppercase hover:opacity-90 transition-all shadow-lg shadow-[#00F2C3]/20 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span>Emitir Orden de Compra (OC)</span>
          </button>
        </div>
      </div>

      {/* 4 KPIs de Compras */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className={`rounded-xl p-5 border space-y-2 ${cardBg}`}>
          <span className={`text-[10px] font-bold tracking-widest uppercase block ${textTitle}`}>
            ÓRDENES DE COMPRA EN CURSO
          </span>
          <div className="text-2xl font-black text-[#00F2C3] font-mono">8 <span className="text-xs font-normal text-slate-400">OC Activas</span></div>
          <p className="text-[11px] text-slate-400 font-sans">Monto comprometido: S/ 68,400.00</p>
        </div>

        <div className={`rounded-xl p-5 border space-y-2 ${cardBg}`}>
          <span className={`text-[10px] font-bold tracking-widest uppercase block ${textTitle}`}>
            INSUMOS EN REAPROVISIONAMIENTO
          </span>
          <div className="text-2xl font-black text-amber-400 font-mono">3 Ítems</div>
          <p className="text-[11px] text-slate-400 font-sans">Mentol, Eucalipto y Amonio Cuaternario</p>
        </div>

        <div className={`rounded-xl p-5 border space-y-2 ${cardBg}`}>
          <span className={`text-[10px] font-bold tracking-widest uppercase block ${textTitle}`}>
            CUMPLIMIENTO OTIF PROVEEDORES
          </span>
          <div className="text-2xl font-black text-emerald-400 font-mono">94.8 %</div>
          <p className="text-[11px] text-slate-400 font-sans">Entregas a tiempo y completas</p>
        </div>

        <div className={`rounded-xl p-5 border space-y-2 ${cardBg}`}>
          <span className={`text-[10px] font-bold tracking-widest uppercase block ${textTitle}`}>
            PROVEEDORES HOMOLOGADOS
          </span>
          <div className="text-2xl font-black text-purple-400 font-mono">28</div>
          <p className="text-[11px] text-slate-400 font-sans">Certificados con ficha técnica y CoA</p>
        </div>
      </div>

      {/* Tabla de Órdenes de Compra */}
      <div className={`rounded-2xl border p-5 space-y-4 ${cardBg}`}>
        <div className="flex items-center justify-between">
          <h3 className={`text-sm font-bold font-sans ${textValue}`}>ÓRDENES DE COMPRA ACTIVAS</h3>
          <span className="text-xs text-slate-400 font-sans">Sincronizadas con Kardex e ingresos a planta</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className={`border-b ${isDark ? 'border-[#1A2232] text-slate-400' : 'border-slate-200 text-slate-600'}`}>
                <th className="py-3 px-3">CÓDIGO OC</th>
                <th className="py-3 px-3">PROVEEDOR</th>
                <th className="py-3 px-3">INSUMO QUÍMICO</th>
                <th className="py-3 px-3 text-right">CANTIDAD</th>
                <th className="py-3 px-3 text-right">TOTAL</th>
                <th className="py-3 px-3 text-center">LLEGADA ESTIMADA</th>
                <th className="py-3 px-3 text-center">ESTADO</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-[#1A2232]' : 'divide-slate-200'}`}>
              {ordenesCompra.map((oc) => (
                <tr key={oc.oc} className={isDark ? 'hover:bg-slate-800/30' : 'hover:bg-slate-50'}>
                  <td className="py-3 px-3 font-bold text-cyan-400">{oc.oc}</td>
                  <td className="py-3 px-3 font-bold text-slate-200">{oc.proveedor}</td>
                  <td className="py-3 px-3 text-slate-300">{oc.insumo}</td>
                  <td className="py-3 px-3 text-right font-bold text-purple-400">{oc.cantidad}</td>
                  <td className="py-3 px-3 text-right font-bold text-emerald-400">{oc.monto}</td>
                  <td className="py-3 px-3 text-center text-slate-400">{oc.fechaEntrega}</td>
                  <td className="py-3 px-3 text-center">
                    <span className="px-2.5 py-0.5 rounded font-bold text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      {oc.estado}
                    </span>
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
