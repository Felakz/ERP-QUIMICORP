'use client';

import React, { useState } from 'react';
import {
  Package,
  Search,
  Plus,
  Boxes,
  CheckCircle2,
  AlertTriangle,
  ArrowUpDown,
  Filter,
} from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';

interface ProductoComercial {
  id: string;
  sku: string;
  nombre: string;
  categoria: string;
  stockActual: number;
  stockMinimo: number;
  unidadMedida: string;
  precioUnitarioKg: number;
  estado: 'DISPONIBLE' | 'STOCK_BAJO' | 'AGOTADO';
}

const STOCK_DATA: ProductoComercial[] = [
  {
    id: 'PRD-001',
    sku: 'LAV-PREM-50',
    nombre: 'LAVAVAJILLAS CONCENTRADO PREMIUM',
    categoria: 'Cuidado del Hogar & Institucional',
    stockActual: 1250.0,
    stockMinimo: 500.0,
    unidadMedida: 'KG',
    precioUnitarioKg: 10.40,
    estado: 'DISPONIBLE',
  },
  {
    id: 'PRD-002',
    sku: 'DES-PINO-100',
    nombre: 'DESINFECTANTE INDUSTRIAL PINO SILVESTRE',
    categoria: 'Desinfección & Saneamiento',
    stockActual: 840.0,
    stockMinimo: 300.0,
    unidadMedida: 'KG',
    precioUnitarioKg: 8.50,
    estado: 'DISPONIBLE',
  },
  {
    id: 'PRD-003',
    sku: 'DES-CIT-200',
    nombre: 'DESGRASANTE INDUSTRIAL MULTIUSOS CÍTRICO',
    categoria: 'Lavandería & Desengrasantes',
    stockActual: 2100.0,
    stockMinimo: 800.0,
    unidadMedida: 'KG',
    precioUnitarioKg: 12.80,
    estado: 'DISPONIBLE',
  },
  {
    id: 'PRD-004',
    sku: 'JAB-LIQ-LAV',
    nombre: 'JABÓN LÍQUIDO ANTIBACTERIAL LAVANDA',
    categoria: 'Higiene Personal & Hospitalario',
    stockActual: 450.0,
    stockMinimo: 400.0,
    unidadMedida: 'KG',
    precioUnitarioKg: 9.60,
    estado: 'STOCK_BAJO',
  },
];

export default function StockComercialPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [search, setSearch] = useState('');
  const cardBg = isDark ? 'bg-[#0F141C] border-[#1A2232]' : 'bg-white border-slate-200 shadow-sm';
  const textTitle = isDark ? 'text-slate-400' : 'text-slate-600';
  const textValue = isDark ? 'text-white' : 'text-slate-900';
  const inputBg = isDark
    ? 'bg-[#151D2A] border-[#1A2232] text-slate-200 placeholder-slate-500'
    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400';

  const stockFiltrado = STOCK_DATA.filter((p) =>
    !search.trim() ||
    p.nombre.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase()) ||
    p.categoria.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className={`p-5 rounded-2xl border flex flex-wrap items-center justify-between gap-4 ${cardBg}`}>
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/30">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <h1 className={`text-lg font-black tracking-tight ${textValue}`}>
              Stock Comercial & Productos Terminados
            </h1>
            <p className={`text-xs ${textTitle}`}>
              Catálogo de productos elaborados disponibles para cotización y despacho inmediato.
            </p>
          </div>
        </div>

        <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-500/20">
          <Plus className="w-4 h-4" />
          <span>Solicitar Elaboración a Planta</span>
        </button>
      </div>

      {/* 4 KPIs */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className={`rounded-2xl p-4 border space-y-1 ${cardBg}`}>
          <span className={`text-[10px] font-bold tracking-widest uppercase ${textTitle}`}>VALORIZACIÓN DE STOCK</span>
          <p className="text-2xl font-black font-mono text-cyan-400">S/ 51,360.00</p>
          <span className="text-[10px] text-slate-500">Valor comercial</span>
        </div>

        <div className={`rounded-2xl p-4 border space-y-1 ${cardBg}`}>
          <span className={`text-[10px] font-bold tracking-widest uppercase ${textTitle}`}>TOTAL PRODUCTO TERMINADO</span>
          <p className="text-2xl font-black font-mono text-emerald-400">4,640 KG</p>
          <span className="text-[10px] text-slate-500">En almacén central</span>
        </div>

        <div className={`rounded-2xl p-4 border space-y-1 ${cardBg}`}>
          <span className={`text-[10px] font-bold tracking-widest uppercase ${textTitle}`}>LÍNEAS DE PRODUCTOS</span>
          <p className="text-2xl font-black font-mono text-blue-400">4 Fórmulas</p>
          <span className="text-[10px] text-slate-500">Disponibles</span>
        </div>

        <div className={`rounded-2xl p-4 border space-y-1 ${cardBg}`}>
          <span className={`text-[10px] font-bold tracking-widest uppercase ${textTitle}`}>DISPONIBILIDAD INMEDIATA</span>
          <p className="text-2xl font-black font-mono text-emerald-400">95% OK</p>
          <span className="text-[10px] text-slate-500">Abastecimiento</span>
        </div>
      </div>

      {/* Tabla de Stock */}
      <div className={`rounded-2xl p-5 border space-y-4 shadow-sm ${cardBg}`}>
        <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-3 border-slate-800/60">
          <h2 className={`text-xs font-bold uppercase tracking-wider ${textValue}`}>
            Catálogo de Stock ({stockFiltrado.length})
          </h2>

          <div className="relative max-w-sm flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar por SKU, Nombre o Categoría..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full pl-9 pr-3 py-1.5 rounded-lg border text-xs font-sans ${inputBg}`}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className={`border-b text-[10px] uppercase font-bold ${
                isDark ? 'border-slate-800/60 text-slate-400' : 'border-slate-200 text-slate-700 bg-slate-50'
              }`}>
                <th className="py-2.5 px-3">SKU</th>
                <th className="py-2.5 px-3">PRODUCTO</th>
                <th className="py-2.5 px-3">CATEGORÍA</th>
                <th className="py-2.5 px-3 text-right">PRECIO / KG</th>
                <th className="py-2.5 px-3 text-right">STOCK ACTUAL</th>
                <th className="py-2.5 px-3 text-center">ESTADO</th>
              </tr>
            </thead>
            <tbody className={`divide-y font-mono text-[11px] ${
              isDark ? 'divide-slate-800/60' : 'divide-slate-100'
            }`}>
              {stockFiltrado.map((p) => (
                <tr key={p.id} className={`transition-colors ${isDark ? 'hover:bg-slate-800/30' : 'hover:bg-slate-50'}`}>
                  <td className="py-3 px-3 font-bold text-cyan-400">{p.sku}</td>
                  <td className="py-3 px-3 font-sans font-bold text-slate-200">{p.nombre}</td>
                  <td className="py-3 px-3 font-sans text-slate-400">{p.categoria}</td>
                  <td className="py-3 px-3 text-right font-bold text-emerald-400">S/ {p.precioUnitarioKg.toFixed(2)}</td>
                  <td className="py-3 px-3 text-right font-black text-slate-200">{p.stockActual.toLocaleString()} {p.unidadMedida}</td>
                  <td className="py-3 px-3 text-center">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                      p.estado === 'DISPONIBLE'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    }`}>
                      {p.estado === 'DISPONIBLE' ? 'Disponible' : 'Stock Bajo'}
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
