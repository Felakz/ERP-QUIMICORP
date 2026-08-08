'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Building2,
  FileText,
  Package,
  Beaker,
  Send,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  Plus,
  RefreshCw,
} from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';
import { FORMULAS_MAESTRAS_REALES } from '@/lib/formulasData';

export default function AdministracionPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [pedidosRecientes, setPedidosRecientes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const cargarDatos = () => {
    const savedToken = localStorage.getItem('quimicorp_jwt');
    fetch('http://localhost:3001/api/v1/pedidos-admin', {
      headers: savedToken ? { Authorization: `Bearer ${savedToken}` } : {},
    })
      .then((r) => {
        if (!r.ok) return null;
        return r.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setPedidosRecientes(data);
        }
      })
      .catch((e) => console.log('Error fetching admin orders:', e))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const cardBg = isDark ? 'bg-[#0F141C] border-[#1A2232]' : 'bg-white border-slate-200 shadow-sm';
  const textTitle = isDark ? 'text-slate-400' : 'text-slate-500';
  const textValue = isDark ? 'text-white' : 'text-slate-900';

  return (
    <div className="space-y-6 font-mono min-h-screen">
      {/* Header Banner del Área de Administración */}
      <div className={`rounded-2xl p-6 border flex flex-wrap items-center justify-between gap-4 ${cardBg}`}>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm border border-blue-500/30">
              📝
            </div>
            <div>
              <h2 className={`text-lg font-bold font-sans tracking-tight ${textValue}`}>
                PANEL PRINCIPAL DE ADMINISTRACIÓN & VENTAS
              </h2>
              <p className="text-xs text-slate-400 font-sans">
                Gestión comercial, vinculación con Fórmulas Maestras y despacho a Planta de Producción
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 font-sans">
          <Link
            href="/administracion/formulas"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00F2C3] to-cyan-500 text-slate-950 font-bold text-xs tracking-wider uppercase hover:opacity-90 transition-all shadow-lg shadow-[#00F2C3]/20 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Crear Pedido Comercial</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards rápidas de Administración */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className={`rounded-xl p-5 border space-y-2 ${cardBg}`}>
          <span className={`text-[10px] font-bold tracking-widest uppercase block ${textTitle}`}>
            PEDIDOS COMERCIALES ACTIVOS
          </span>
          <div className={`text-2xl font-black font-mono ${isDark ? 'text-[#00F2C3]' : 'text-teal-700'}`}>
            {pedidosRecientes.length || 4} <span className={`text-xs font-normal ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Órdenes</span>
          </div>
          <p className={`text-[11px] font-sans ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>En proceso de revisión y despacho a planta</p>
        </div>

        <div className={`rounded-xl p-5 border space-y-2 ${cardBg}`}>
          <span className={`text-[10px] font-bold tracking-widest uppercase block ${textTitle}`}>
            FÓRMULAS MAESTRAS VINCULADAS
          </span>
          <div className={`text-2xl font-black font-mono ${isDark ? 'text-cyan-400' : 'text-teal-700'}`}>
            {FORMULAS_MAESTRAS_REALES.length} <span className={`text-xs font-normal ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Registradas</span>
          </div>
          <p className={`text-[11px] font-sans ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Listas para escalar pedidos por Lote / KG</p>
        </div>

        <div className={`rounded-xl p-5 border space-y-2 ${cardBg}`}>
          <span className={`text-[10px] font-bold tracking-widest uppercase block ${textTitle}`}>
            ESTADO DE INTERFAZ ADMIN
          </span>
          <div className="flex items-center gap-2 pt-1 font-sans">
            <span className="h-3 w-3 rounded-full bg-emerald-400 animate-ping" />
            <span className={`text-xs font-bold font-mono ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>CONEXIÓN DIRECTA A PLANTA</span>
          </div>
          <p className={`text-[11px] font-sans ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Sincronización mediante WebSockets activa</p>
        </div>
      </div>

      {/* Accesos Directos a las 3 Secciones de Administración */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/administracion/formulas"
          className={`p-5 rounded-2xl border transition-all hover:border-[#00F2C3] group ${cardBg}`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`p-3 rounded-xl border ${isDark ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' : 'bg-teal-50 text-teal-700 border-teal-200'}`}>
              <Beaker className="w-6 h-6" />
            </div>
            <ArrowRight className={`w-5 h-5 transition-colors ${isDark ? 'text-slate-500 group-hover:text-[#00F2C3]' : 'text-slate-400 group-hover:text-teal-700'}`} />
          </div>
          <h3 className={`text-sm font-bold font-sans ${textValue}`}>📋 Catálogo de Fórmulas</h3>
          <p className={`text-xs font-sans mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Explora las Fórmulas Maestras y genera nuevos Pedidos Comerciales calculados.
          </p>
        </Link>

        <Link
          href="/produccion/stock"
          className={`p-5 rounded-2xl border transition-all hover:border-[#00F2C3] group ${cardBg}`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`p-3 rounded-xl border ${isDark ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
              <Package className="w-6 h-6" />
            </div>
            <ArrowRight className={`w-5 h-5 transition-colors ${isDark ? 'text-slate-500 group-hover:text-[#00F2C3]' : 'text-slate-400 group-hover:text-teal-700'}`} />
          </div>
          <h3 className={`text-sm font-bold font-sans ${textValue}`}>📦 Inventario & Stock</h3>
          <p className={`text-xs font-sans mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Consulta el stock disponible de materias primas y productos terminados.
          </p>
        </Link>

        <Link
          href="/administracion/pedidos"
          className={`p-5 rounded-2xl border transition-all hover:border-[#00F2C3] group ${cardBg}`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`p-3 rounded-xl border ${isDark ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
              <FileText className="w-6 h-6" />
            </div>
            <ArrowRight className={`w-5 h-5 transition-colors ${isDark ? 'text-slate-500 group-hover:text-[#00F2C3]' : 'text-slate-400 group-hover:text-teal-700'}`} />
          </div>
          <h3 className={`text-sm font-bold font-sans ${textValue}`}>📑 Pedidos Comerciales</h3>
          <p className={`text-xs font-sans mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Visualiza el estado de las órdenes enviadas a la Bandeja de Entrada de Planta.
          </p>
        </Link>
      </div>

      {/* Lista de Pedidos Recientes Enviados a Planta */}
      <div className={`rounded-xl p-5 border space-y-4 ${cardBg}`}>
        <div className={`flex items-center justify-between border-b pb-3 ${isDark ? 'border-slate-800/80' : 'border-slate-100'}`}>
          <h3 className={`text-xs font-bold tracking-widest uppercase ${textTitle}`}>
            ÚLTIMOS PEDIDOS ENVIADOS A BANDEJA DE PRODUCCIÓN
          </h3>
          <Link href="/administracion/pedidos" className={`text-xs hover:underline font-sans font-bold ${isDark ? 'text-cyan-400' : 'text-teal-700'}`}>
            Ver Todos →
          </Link>
        </div>

        {loading ? (
          <div className="py-8 text-center text-xs text-slate-400">
            <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-cyan-400" />
            Cargando órdenes...
          </div>
        ) : (
          <div className="space-y-3">
            {pedidosRecientes.slice(0, 3).map((ped) => (
              <div
                key={ped.id}
                className={`p-4 rounded-xl border flex flex-wrap items-center justify-between gap-4 font-mono text-xs ${
                  isDark ? 'border-slate-800/80 bg-[#151D2A]' : 'border-slate-200 bg-slate-50'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`font-bold ${isDark ? 'text-cyan-400' : 'text-blue-700'}`}>{ped.codigoOrden}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                      isDark ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-amber-100 text-amber-900 border border-amber-300'
                    }`}>
                      {ped.estado || 'PENDIENTE_REVISION_PLANTA'}
                    </span>
                  </div>
                  <h4 className={`font-bold font-sans mt-1 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{ped.productoNombre}</h4>
                  <p className={`text-[11px] font-sans ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Cliente: {ped.clienteNombre}</p>
                </div>

                <div className="text-right font-sans">
                  <div className={`text-sm font-bold font-mono ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
                    S/ {Number(ped.montoTotal).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                  </div>
                  <span className={`text-[10px] block font-mono ${isDark ? 'text-slate-400' : 'text-slate-600 font-medium'}`}>{ped.cantidadSolicitada} {ped.unidadMedida}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
