'use client';

import React, { useState } from 'react';
import {
  ShoppingCart,
  Search,
  FileSpreadsheet,
  Download,
  Plus,
  Building2,
  CheckCircle2,
  Package,
  ShieldCheck,
  DollarSign,
  Tag,
  FileText,
} from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';

interface ProductoComercialCat {
  id: string;
  sku: string;
  nombre: string;
  categoria: string;
  presentacion: string;
  precioUnitario: number;
  precioCaja: number;
  stockDisponible: number;
  estado: 'DISPONIBLE' | 'STOCK_BAJO';
}

const CATALOGO_COMERCIAL_MOCK: ProductoComercialCat[] = [
  {
    id: 'PRD-001',
    sku: 'QUIM-LAV-1L',
    nombre: 'LAVAVAJILLAS CONCENTRADO PREMIUM',
    categoria: 'Cuidado del Hogar & Institucional',
    presentacion: 'Frasco 1 Litro (Caja x 12 u.)',
    precioUnitario: 12.50,
    precioCaja: 135.00,
    stockDisponible: 1250,
    estado: 'DISPONIBLE',
  },
  {
    id: 'PRD-002',
    sku: 'QUIM-DES-GAL',
    nombre: 'DESINFECTANTE INDUSTRIAL PINO SILVESTRE',
    categoria: 'Desinfección & Saneamiento',
    presentacion: 'Galón 3.8 Litros',
    precioUnitario: 38.00,
    precioCaja: 38.00,
    stockDisponible: 840,
    estado: 'DISPONIBLE',
  },
  {
    id: 'PRD-003',
    sku: 'QUIM-DEG-20L',
    nombre: 'DESGRASANTE INDUSTRIAL MULTIUSOS CÍTRICO',
    categoria: 'Lavandería & Desengrasantes',
    presentacion: 'Bidón 20 Litros',
    precioUnitario: 175.00,
    precioCaja: 175.00,
    stockDisponible: 2100,
    estado: 'DISPONIBLE',
  },
  {
    id: 'PRD-004',
    sku: 'QUIM-JAB-500ML',
    nombre: 'JABÓN LÍQUIDO ANTIBACTERIAL LAVANDA',
    categoria: 'Higiene Personal & Hospitalario',
    presentacion: 'Envase 500 ml con Válvula',
    precioUnitario: 9.60,
    precioCaja: 105.00,
    stockDisponible: 450,
    estado: 'STOCK_BAJO',
  },
];

export default function CotizadorComercialPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [search, setSearch] = useState('');
  const [cotizacionItems, setCotizacionItems] = useState<{ producto: ProductoComercialCat; cantidad: number }[]>([]);
  const [clienteNombre, setClienteNombre] = useState('BRYAN FIESTAS');

  const cardBg = isDark ? 'bg-[#0F141C] border-[#1A2232]' : 'bg-white border-slate-200 shadow-sm';
  const textTitle = isDark ? 'text-slate-400' : 'text-slate-600';
  const textValue = isDark ? 'text-white' : 'text-slate-900';
  const inputBg = isDark
    ? 'bg-[#151D2A] border-[#1A2232] text-slate-200 placeholder-slate-500 focus:border-blue-500'
    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500';

  const agregarACotizacion = (prod: ProductoComercialCat) => {
    setCotizacionItems((prev) => {
      const existe = prev.find((item) => item.producto.id === prod.id);
      if (existe) {
        return prev.map((item) =>
          item.producto.id === prod.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }
      return [...prev, { producto: prod, cantidad: 1 }];
    });
  };

  const totalCotizacion = cotizacionItems.reduce(
    (sum, item) => sum + item.producto.precioUnitario * item.cantidad,
    0
  );

  const productosFiltrados = CATALOGO_COMERCIAL_MOCK.filter((p) =>
    !search.trim() ||
    p.nombre.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase()) ||
    p.categoria.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans">
      {/* Header Corporativo */}
      <div className={`p-5 rounded-2xl border flex flex-wrap items-center justify-between gap-4 ${cardBg}`}>
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/30">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <div>
            <h1 className={`text-xl font-bold font-sans flex items-center gap-2 ${textValue}`}>
              <span>Catálogo Comercial & Cotizador Express</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                🔒 Sin Fórmulas Químicas
              </span>
            </h1>
            <p className={`text-xs font-sans mt-0.5 ${textTitle}`}>
              Lista oficial de productos terminados, precios comerciales por volumen y generador de presupuestos en PDF.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => alert(`Generando PDF de Cotización para ${clienteNombre}...`)}
            disabled={cotizacionItems.length === 0}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-sans transition-all flex items-center gap-2 ${
              cotizacionItems.length > 0
                ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                : 'bg-slate-700/40 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Generar Cotización PDF ({cotizacionItems.length})</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Catálogo Comercial (2 columnas) */}
        <div className="lg:col-span-2 space-y-4">
          <div className={`p-4 rounded-xl border flex items-center justify-between gap-4 ${cardBg}`}>
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por Nombre, SKU o Categoría comercial..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`pl-9 pr-4 py-2 rounded-lg border text-xs w-full ${inputBg}`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {productosFiltrados.map((prod) => (
              <div key={prod.id} className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 ${cardBg}`}>
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                      {prod.sku}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">{prod.categoria}</span>
                  </div>
                  <h3 className={`text-sm font-bold mt-2 ${textValue}`}>{prod.nombre}</h3>
                  <p className="text-xs text-slate-400 font-sans mt-0.5">{prod.presentacion}</p>
                </div>

                <div className="pt-2 border-t border-slate-800/40 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Precio Unitario</span>
                    <span className={`text-base font-black font-mono text-emerald-400`}>
                      S/ {prod.precioUnitario.toFixed(2)}
                    </span>
                  </div>

                  <button
                    onClick={() => agregarACotizacion(prod)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 transition-all flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Agregar</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Panel Resumen de Cotización (1 columna) */}
        <div className={`p-5 rounded-2xl border space-y-4 h-fit ${cardBg}`}>
          <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
            <h2 className={`text-sm font-bold flex items-center gap-2 ${textValue}`}>
              <FileText className="w-4 h-4 text-blue-400" />
              <span>Borrador de Cotización</span>
            </h2>
            <span className="text-xs text-slate-400 font-mono">
              {cotizacionItems.length} ítems
            </span>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Cliente Objetivo
            </label>
            <input
              type="text"
              value={clienteNombre}
              onChange={(e) => setClienteNombre(e.target.value)}
              className={`w-full px-3 py-1.5 rounded-lg border text-xs font-bold ${inputBg}`}
            />
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {cotizacionItems.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">
                Selecciona productos del catálogo para armar la cotización.
              </p>
            ) : (
              cotizacionItems.map((item) => (
                <div
                  key={item.producto.id}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/30 border border-slate-800 text-xs"
                >
                  <div className="truncate pr-2">
                    <p className={`font-bold truncate ${textValue}`}>{item.producto.nombre}</p>
                    <p className="text-[10px] text-slate-400">
                      x{item.cantidad} — S/ {item.producto.precioUnitario.toFixed(2)} c/u
                    </p>
                  </div>
                  <span className="font-mono font-bold text-emerald-400 whitespace-nowrap">
                    S/ {(item.producto.precioUnitario * item.cantidad).toFixed(2)}
                  </span>
                </div>
              ))
            )}
          </div>

          <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between">
            <span className={`text-sm font-bold ${textTitle}`}>Total Estimado:</span>
            <span className="text-xl font-black font-mono text-emerald-400">
              S/ {totalCotizacion.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
