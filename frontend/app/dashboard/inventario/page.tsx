'use client';

import React, { useState } from 'react';
import { Search, RefreshCw, AlertTriangle, Package, Warehouse, CheckCircle2 } from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';

interface MaterialItem {
  sku: string;
  nombre: string;
  familia: string;
  stockPercentage: number;
  unidad: string;
  ubicacion: string;
  estado: 'OK' | 'LOW STOCK' | 'CRITICAL';
}

interface SubAlmacenItem {
  id: string;
  codigo: string;
  nombre: string;
  peso: string;
  unidad: string;
  loteOrigen: string;
  fecha: string;
  reutilizable: boolean;
}

export default function InventariosPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Surfactantes');

  const categories = [
    'Todos',
    'Surfactantes',
    'Solventes',
    'Ácidos',
    'Bases',
    'Aditivos',
    'Fragancias',
  ];

  const materialsData: MaterialItem[] = [
    {
      sku: 'QC-001',
      nombre: 'Lauril Éter Sulfato Sódico (LESS)',
      familia: 'SURFACTANTES',
      stockPercentage: 87,
      unidad: 'KG',
      ubicacion: 'Almacén A - Rack 04',
      estado: 'OK',
    },
    {
      sku: 'QC-002',
      nombre: 'Cocamidopropil Betaína',
      familia: 'SURFACTANTES',
      stockPercentage: 34,
      unidad: 'KG',
      ubicacion: 'Almacén A - Rack 02',
      estado: 'LOW STOCK',
    },
    {
      sku: 'QC-009',
      nombre: 'Cloruro de Benzalconio 50%',
      familia: 'SURFACTANTES',
      stockPercentage: 44,
      unidad: 'LT',
      ubicacion: 'Tanque Inox B-01',
      estado: 'OK',
    },
    {
      sku: 'QC-004',
      nombre: 'Ácido Sulfúrico 98%',
      familia: 'ÁCIDOS',
      stockPercentage: 18,
      unidad: 'KG',
      ubicacion: 'Zona de Ácidos - Tanque A1',
      estado: 'CRITICAL',
    },
    {
      sku: 'QC-005',
      nombre: 'Alcohol Isopropílico 99.9%',
      familia: 'SOLVENTES',
      stockPercentage: 92,
      unidad: 'LT',
      ubicacion: 'Almacén Solventes - Tanque C2',
      estado: 'OK',
    },
    {
      sku: 'QC-008',
      nombre: 'Dióxido de Titanio Rutilo',
      familia: 'ADITIVOS',
      stockPercentage: 15,
      unidad: 'KG',
      ubicacion: 'Almacén B - Estante 08',
      estado: 'CRITICAL',
    },
    {
      sku: 'QC-012',
      nombre: 'Soda Cáustica 50% (NaOH)',
      familia: 'BASES',
      stockPercentage: 28,
      unidad: 'KG',
      ubicacion: 'Zona de Bases - Tanque B3',
      estado: 'LOW STOCK',
    },
    {
      sku: 'QC-015',
      nombre: 'Fragancia Lavanda 04-A',
      familia: 'FRAGANCIAS',
      stockPercentage: 65,
      unidad: 'KG',
      ubicacion: 'Bóveda Fragancias - Estante 01',
      estado: 'OK',
    },
  ];

  const subAlmacenData: SubAlmacenItem[] = [
    {
      id: '1',
      codigo: 'RES-0041',
      nombre: 'LESS 70%',
      peso: '12.4',
      unidad: 'KG',
      loteOrigen: 'LOT-2024-0891',
      fecha: '2024-07-28',
      reutilizable: true,
    },
    {
      id: '2',
      codigo: 'RES-0042',
      nombre: 'Cocamidopropil Betaína',
      peso: '3.7',
      unidad: 'KG',
      loteOrigen: 'LOT-2024-0891',
      fecha: '2024-07-28',
      reutilizable: true,
    },
    {
      id: '3',
      codigo: 'RES-0043',
      nombre: 'Glicol Propilénico',
      peso: '8.2',
      unidad: 'LT',
      loteOrigen: 'LOT-2024-0887',
      fecha: '2024-07-26',
      reutilizable: true,
    },
    {
      id: '4',
      codigo: 'RES-0044',
      nombre: 'Fragancia Lavanda 04-A',
      peso: '1.1',
      unidad: 'KG',
      loteOrigen: 'LOT-2024-0885',
      fecha: '2024-07-25',
      reutilizable: false,
    },
  ];

  const filteredMaterials = materialsData.filter((item) => {
    const matchesSearch =
      item.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'Todos' ||
      item.familia.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const cardBg = isDark ? 'bg-[#0F141C] border-[#1A2232]' : 'bg-white border-slate-200 shadow-sm';
  const textTitle = isDark ? 'text-slate-400' : 'text-slate-500';
  const textValue = isDark ? 'text-white' : 'text-slate-900';
  const inputBg = isDark ? 'bg-[#151D2A] border-[#1A2232] text-slate-200 placeholder-slate-500' : 'bg-slate-50 border-slate-300 text-slate-800 placeholder-slate-400';

  const criticalItems = materialsData.filter((m) => m.estado === 'CRITICAL');

  return (
    <div className="space-y-6 font-mono min-h-screen">
      {/* Banner de Alerta de Stock Crítico */}
      {criticalItems.length > 0 && (
        <div className="rounded-xl bg-rose-500/15 p-4 border border-rose-500/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-rose-500/20 text-rose-500 border border-rose-500/30">
              <AlertTriangle className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-rose-400 font-sans">
                ⚠️ ALERTA DE REAPROVISIONAMIENTO: 2 MATERIALES EN STOCK CRÍTICO (&lt; 20%)
              </h4>
              <p className="text-[11px] text-slate-300 font-sans mt-0.5">
                Ácido Sulfúrico 98% (18%) y Dióxido de Titanio Rutilo (15%) requieren orden de compra inmediata.
              </p>
            </div>
          </div>

          <span className="rounded-lg bg-rose-500 px-3 py-1 text-xs font-bold text-slate-950 font-mono">
            REAPROVISIONAR
          </span>
        </div>
      )}

      {/* Top 4 KPI Metrics Grid (Sin Precios de acuerdo a la directiva real de planta) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* TOTAL MATERIALES */}
        <div className={`rounded-xl p-4 border ${cardBg}`}>
          <span className={`text-[11px] font-bold tracking-widest uppercase ${textTitle}`}>
            TOTAL MATERIALES
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-cyan-500">12</span>
            <span className="text-xs text-slate-400 font-sans">SKUs Activos</span>
          </div>
        </div>

        {/* DISPONIBILIDAD EN PLANTA */}
        <div className={`rounded-xl p-4 border ${cardBg}`}>
          <span className={`text-[11px] font-bold tracking-widest uppercase ${textTitle}`}>
            DISPONIBILIDAD TOTAL
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-2xl font-black ${textValue}`}>14,250</span>
            <span className="text-xs text-slate-400 font-sans">KG / LT Físicos</span>
          </div>
        </div>

        {/* STOCK CRÍTICO */}
        <div className={`rounded-xl p-4 border ${cardBg}`}>
          <span className={`text-[11px] font-bold tracking-widest uppercase ${textTitle}`}>
            STOCK CRÍTICO
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-rose-500">2</span>
            <span className="text-xs text-slate-400 font-sans">materiales</span>
          </div>
        </div>

        {/* STOCK BAJO */}
        <div className={`rounded-xl p-4 border ${cardBg}`}>
          <span className={`text-[11px] font-bold tracking-widest uppercase ${textTitle}`}>
            STOCK BAJO
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-500">2</span>
            <span className="text-xs text-slate-400 font-sans">materiales</span>
          </div>
        </div>
      </div>

      {/* Main Table Container with Search & Tabs */}
      <div className={`rounded-xl p-5 border space-y-4 ${cardBg}`}>
        {/* Search Bar & Category Filter Tabs */}
        <div className={`flex flex-wrap items-center justify-between gap-4 border-b pb-4 ${isDark ? 'border-[#1A2232]' : 'border-slate-200'}`}>
          {/* Search Input */}
          <div className="relative flex-1 min-w-[260px] max-w-md">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por nombre o SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full rounded-lg border py-2 pl-10 pr-4 text-xs focus:border-[#00F2C3] focus:outline-none transition-all font-sans ${inputBg}`}
            />
          </div>

          {/* Family Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-sans">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-lg px-3 py-1.5 font-medium transition-all ${
                    isActive
                      ? 'bg-[#00F2C3] text-[#090C10] font-bold shadow-md'
                      : isDark
                      ? 'bg-[#151D2A] text-slate-400 hover:text-slate-200 border border-[#1A2232]'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-300'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Materials Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className={`border-b text-[10px] font-bold tracking-widest uppercase ${isDark ? 'border-[#1A2232] text-slate-400' : 'border-slate-200 text-slate-500'}`}>
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">NOMBRE QUÍMICO</th>
                <th className="py-3 px-4">FAMILIA</th>
                <th className="py-3 px-4">NIVEL STOCK</th>
                <th className="py-3 px-4">UNIDAD</th>
                <th className="py-3 px-4">UBICACIÓN EN PLANTA</th>
                <th className="py-3 px-4">ESTADO</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-[#1A2232]/60' : 'divide-slate-200'}`}>
              {filteredMaterials.map((item) => (
                <tr key={item.sku} className={`transition-colors ${isDark ? 'hover:bg-[#151D2A]/50' : 'hover:bg-slate-50'}`}>
                  <td className="py-3.5 px-4 font-mono font-bold text-cyan-500">
                    {item.sku}
                  </td>
                  <td className={`py-3.5 px-4 font-sans font-medium ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                    {item.nombre}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`rounded px-2 py-0.5 text-[10px] font-bold border ${isDark ? 'bg-[#1A2434] text-slate-300 border-[#233146]' : 'bg-slate-100 text-slate-700 border-slate-300'}`}>
                      {item.familia}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 w-48">
                    <div className="flex items-center gap-3">
                      <div className={`h-2 flex-1 rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
                        <div
                          className={`h-full rounded-full ${
                            item.stockPercentage > 50
                              ? 'bg-[#00F2C3]'
                              : item.stockPercentage > 25
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                          }`}
                          style={{ width: `${item.stockPercentage}%` }}
                        />
                      </div>
                      <span className="font-mono text-[11px] text-slate-400 w-8">
                        {item.stockPercentage}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-400">{item.unidad}</td>
                  <td className={`py-3.5 px-4 font-sans text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {item.ubicacion}
                  </td>
                  <td className="py-3.5 px-4">
                    {item.estado === 'OK' && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-500 border border-emerald-500/20">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        OK
                      </span>
                    )}
                    {item.estado === 'LOW STOCK' && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-500 border border-amber-500/20">
                        <span>▲</span> LOW STOCK
                      </span>
                    )}
                    {item.estado === 'CRITICAL' && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-2.5 py-0.5 text-[10px] font-bold text-rose-500 border border-rose-500/20">
                        <AlertTriangle className="h-3 w-3" /> CRITICAL
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sub-Almacén de Restantes / Sobrantes Section */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold tracking-widest text-slate-400 uppercase">
            SUB-ALMACÉN DE RESTANTES / SOBRANTES DE PRODUCCIÓN
          </h3>
          <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-0.5 text-[10px] font-bold text-cyan-500">
            3 REUTILIZABLES
          </span>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {subAlmacenData.map((item) => (
            <div
              key={item.id}
              className={`rounded-xl p-4 border flex flex-col justify-between space-y-4 ${
                item.reutilizable
                  ? cardBg
                  : isDark
                  ? 'bg-[#0B0F17] border-[#1A2232]/50 opacity-70'
                  : 'bg-slate-100 border-slate-200 opacity-70'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span
                    className={`font-mono text-xs font-bold ${
                      item.reutilizable ? 'text-cyan-500' : 'text-slate-400'
                    }`}
                  >
                    {item.codigo}
                  </span>
                  <span className={`font-mono text-sm font-black ${textValue}`}>
                    {item.peso} <span className="text-xs font-sans text-slate-400">{item.unidad}</span>
                  </span>
                </div>
                <h4 className={`text-xs font-bold font-sans truncate ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                  {item.nombre}
                </h4>
                <p className="text-[10px] text-slate-400 font-sans">
                  Lote origen: {item.loteOrigen} · {item.fecha}
                </p>
              </div>

              <div>
                {item.reutilizable ? (
                  <button className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#00F2C3] py-2 text-xs font-bold text-[#090C10] hover:bg-[#00d8ad] transition-all shadow-md">
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>Reaplicar a Lote</span>
                  </button>
                ) : (
                  <button
                    disabled
                    className={`w-full rounded-lg py-2 text-xs font-bold text-slate-400 border cursor-not-allowed text-center ${
                      isDark ? 'bg-[#151D2A] border-[#1A2232]' : 'bg-slate-200 border-slate-300'
                    }`}
                  >
                    No reutilizable
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
