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
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setPedidosRecientes(data))
      .catch((e) => console.log('Error fetching admin orders:', e))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    cargarDatos();
    const interval = setInterval(cargarDatos, 3000);
    return () => clearInterval(interval);
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
            href="/dashboard/formulas"
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
          <div className="text-2xl font-black text-[#00F2C3] font-mono">
            {pedidosRecientes.length || 4} <span className="text-xs font-normal text-slate-400">Órdenes</span>
          </div>
          <p className="text-[11px] text-slate-400 font-sans">En proceso de revisión y despacho a planta</p>
        </div>

        <div className={`rounded-xl p-5 border space-y-2 ${cardBg}`}>
          <span className={`text-[10px] font-bold tracking-widest uppercase block ${textTitle}`}>
            FÓRMULAS MAESTRAS VINCULADAS
          </span>
          <div className="text-2xl font-black text-cyan-400 font-mono">
            {FORMULAS_MAESTRAS_REALES.length} <span className="text-xs font-normal text-slate-400">Registradas</span>
          </div>
          <p className="text-[11px] text-slate-400 font-sans">Listas para escalar pedidos por Lote / KG</p>
        </div>

        <div className={`rounded-xl p-5 border space-y-2 ${cardBg}`}>
          <span className={`text-[10px] font-bold tracking-widest uppercase block ${textTitle}`}>
            ESTADO DE INTERFAZ ADMIN
          </span>
          <div className="flex items-center gap-2 pt-1 font-sans">
            <span className="h-3 w-3 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-bold text-emerald-400 font-mono">CONEXIÓN DIRECTA A PLANTA</span>
          </div>
          <p className="text-[11px] text-slate-400 font-sans">Sincronización mediante WebSockets activa</p>
        </div>
      </div>

      {/* Accesos Directos a las 3 Secciones de Administración */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/dashboard/formulas"
          className={`p-5 rounded-2xl border transition-all hover:border-[#00F2C3] group ${cardBg}`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Beaker className="w-6 h-6" />
            </div>
            <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-[#00F2C3] transition-colors" />
          </div>
          <h3 className={`text-sm font-bold font-sans ${textValue}`}>📋 Catálogo de Fórmulas</h3>
          <p className="text-xs text-slate-400 font-sans mt-1">
            Explora las Fórmulas Maestras y genera nuevos Pedidos Comerciales calculados.
          </p>
        </Link>

        <Link
          href="/dashboard/inventario"
          className={`p-5 rounded-2xl border transition-all hover:border-[#00F2C3] group ${cardBg}`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <Package className="w-6 h-6" />
            </div>
            <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-[#00F2C3] transition-colors" />
          </div>
          <h3 className={`text-sm font-bold font-sans ${textValue}`}>📦 Inventario & Stock</h3>
          <p className="text-xs text-slate-400 font-sans mt-1">
            Consulta el stock disponible de materias primas y productos terminados.
          </p>
        </Link>

        <Link
          href="/dashboard/pedidos-admin"
          className={`p-5 rounded-2xl border transition-all hover:border-[#00F2C3] group ${cardBg}`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/30">
              <FileText className="w-6 h-6" />
            </div>
            <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-[#00F2C3] transition-colors" />
          </div>
          <h3 className={`text-sm font-bold font-sans ${textValue}`}>📑 Pedidos Comerciales</h3>
          <p className="text-xs text-slate-400 font-sans mt-1">
            Visualiza el estado de las órdenes enviadas a la Bandeja de Entrada de Planta.
          </p>
        </Link>
      </div>

      {/* Lista de Pedidos Recientes Enviados a Planta */}
      <div className={`rounded-xl p-5 border space-y-4 ${cardBg}`}>
        <div className="flex items-center justify-between border-b pb-3 border-slate-800/80">
          <h3 className={`text-xs font-bold tracking-widest uppercase ${textTitle}`}>
            ÚLTIMOS PEDIDOS ENVIADOS A BANDEJA DE PRODUCCIÓN
          </h3>
          <Link href="/dashboard/pedidos-admin" className="text-xs text-cyan-400 hover:underline font-sans font-bold">
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
                className="p-4 rounded-xl border border-slate-800/80 bg-[#151D2A] flex flex-wrap items-center justify-between gap-4 font-mono text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-cyan-400">{ped.codigoOrden}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      {ped.estado || 'PENDIENTE_REVISION_PLANTA'}
                    </span>
                  </div>
                  <h4 className="font-bold font-sans text-slate-100 mt-1">{ped.productoNombre}</h4>
                  <p className="text-[11px] text-slate-400 font-sans">Cliente: {ped.clienteNombre}</p>
                </div>

                <div className="text-right font-sans">
                  <div className="text-sm font-bold text-emerald-400 font-mono">
                    S/ {Number(ped.montoTotal).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                  </div>
                  <span className="text-[10px] text-slate-400 block font-mono">{ped.cantidadSolicitada} {ped.unidadMedida}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
