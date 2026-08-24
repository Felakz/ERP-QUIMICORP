'use client';

import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import {
  Factory,
  Search,
  Calendar,
  Filter,
  CheckCircle2,
  Clock,
  Building2,
  Beaker,
  AlertTriangle,
  FileText,
  Download,
  RefreshCw,
  User,
  Sparkles,
} from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';
import { apiFetch } from '@/lib/apiClient';
import { DateNavigatorToolbar } from '@/components/produccion/DateNavigatorToolbar';

interface OrdenProgramacionItem {
  id: string;
  codigoLote: string;
  clienteNombre: string;
  productoNombre: string;
  colorEspecificado: string;
  fraganciaEspecificada: string;
  cantidad: number;
  unidadMedida: string;
  estado: 'TERMINADO' | 'EN PROCESO' | 'PENDIENTE';
  operarios: string;
  prioridad: string;
  fechaCreacion?: string;
  hora?: string;
}

interface ProgramacionResumen {
  totalOrdenes: number;
  totalKgProgramados: string;
  totalTerminados: number;
  totalEnProceso: number;
  totalPendientes: number;
}

export default function AdministracionControlProduccionPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [ordenes, setOrdenes] = useState<OrdenProgramacionItem[]>([]);
  const [resumen, setResumen] = useState<ProgramacionResumen>({
    totalOrdenes: 0,
    totalKgProgramados: '0.00',
    totalTerminados: 0,
    totalEnProceso: 0,
    totalPendientes: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const cardBg = isDark ? 'bg-[#0F141C] border-[#1A2232]' : 'bg-white border-slate-200 shadow-sm';
  const textTitle = isDark ? 'text-slate-400' : 'text-slate-600';
  const textValue = isDark ? 'text-white' : 'text-slate-900';
  const inputBg = isDark
    ? 'bg-[#151D2A] border-[#1A2232] text-slate-200 placeholder-slate-500 focus:border-blue-500'
    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500';

  const fetchProgramacion = async () => {
    setLoading(true);
    try {
      const { data, ok } = await apiFetch<any>(
        `/produccion/ordenes/programacion-diaria?fecha=${selectedDate}`
      );
      if (ok && data) {
        if (data.resumen) {
          setResumen({
            totalOrdenes: Number(data.resumen.totalOrdenes) || 0,
            totalKgProgramados: data.resumen.totalKgProgramados || '0.00',
            totalTerminados: Number(data.resumen.totalTerminados) || 0,
            totalEnProceso: Number(data.resumen.totalEnProceso) || 0,
            totalPendientes: Number(data.resumen.totalPendientes) || 0,
          });
        }

        let rawList: any[] = [];
        if (Array.isArray(data.ordenes)) {
          rawList = data.ordenes;
        } else if (Array.isArray(data)) {
          rawList = data;
        }

        const mapped: OrdenProgramacionItem[] = rawList.map((item: any) => ({
          id: item.id,
          codigoLote: item.codigoLote,
          clienteNombre: item.clienteNombre || 'Cliente Quimicorp',
          productoNombre: item.productoNombre || 'Producto Industrial',
          colorEspecificado: item.colorEspecificado || item.color || 'TRANSPARENTE',
          fraganciaEspecificada: item.fraganciaEspecificada || item.fragancia || 'SIN FRAGANCIA',
          cantidad: Number(item.cantidad || item.cantidadPlanificada || item.cantidadKgLt) || 0,
          unidadMedida: item.unidadMedida || 'KG',
          estado: item.estado === 'APROBADO' ? 'TERMINADO' : item.estado === 'EN_PROCESO' ? 'EN PROCESO' : item.estado || 'PENDIENTE',
          operarios: item.operarios || item.responsable || 'Sin Asignar',
          prioridad: item.prioridad || 'NORMAL',
          fechaCreacion: item.fechaCreacion,
          hora: item.hora || '12:00 PM',
        }));

        setOrdenes(mapped);
      }
    } catch (e) {
      console.error('Error al cargar la programación diaria de producción:', e);
      setOrdenes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgramacion();

    // 📡 Conexión WebSockets en Tiempo Real
    const socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001', {
      transports: ['websocket', 'polling'],
    });

    socket.on('lote:estado_actualizado', () => {
      fetchProgramacion();
    });

    socket.on('pedido:aprobado', () => {
      fetchProgramacion();
    });

    socket.on('order:created_to_plant', () => {
      fetchProgramacion();
    });

    return () => {
      socket.disconnect();
    };
  }, [selectedDate]);

  const ordenesFiltradas = ordenes.filter((o) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      o.codigoLote?.toLowerCase().includes(q) ||
      o.clienteNombre?.toLowerCase().includes(q) ||
      o.productoNombre?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* 📅 Toolbar Superior de Fecha e Inmutabilidad del Turno */}
      <DateNavigatorToolbar
        fecha={selectedDate}
        onFechaChange={(nueva) => setSelectedDate(nueva)}
        titulo="PLANILLA Y PROGRAMACIÓN DIARIA"
        subtitulo="Registro inmutable y control operativo del turno seleccionado"
        extraActions={
          <button
            onClick={() => alert('Generando exportación de planilla en PDF/Excel...')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              isDark
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20'
                : 'bg-teal-50 text-teal-800 border border-teal-300 hover:bg-teal-100'
            }`}
          >
            <span>📊 Exportar Planilla (PDF / Excel)</span>
          </button>
        }
      />

      {/* 🏢 Subcard Oficial Quimicorp & Buscador */}
      <div className={`p-4 rounded-xl border flex flex-wrap items-center justify-between gap-4 ${cardBg}`}>
        <div>
          <h3 className={`text-sm font-bold font-sans flex items-center gap-2 ${textValue}`}>
            <span>QUIMICORP PERU S.A.C.</span>
            <span className="text-xs text-slate-400 font-mono">· RUC 20614697327</span>
          </h3>
          <p className={`text-xs font-sans ${textTitle}`}>
            PROGRAMACIÓN DIARIA DE PRODUCCIÓN — Planilla Digital Inmutable del Turno ({selectedDate})
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="🔍 Buscar por Cliente, Producto o Lote..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-sans w-64 ${inputBg}`}
          />
        </div>
      </div>

      {/* 📊 KPI Bar Superior (Resumen de Métricas Diarias) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {/* KPI 1: TOTAL ÓRDENES */}
        <div className={`rounded-xl p-4 border relative overflow-hidden ${cardBg}`}>
          <div className="absolute top-0 left-0 right-0 h-1 bg-cyan-500" />
          <div className={`text-[10px] font-bold tracking-widest uppercase ${textTitle}`}>
            TOTAL ÓRDENES DE PROD.
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-2xl font-black font-mono ${textValue}`}>
              {resumen.totalOrdenes}
            </span>
            <span className="text-xs text-slate-400 font-sans">lotes</span>
          </div>
        </div>

        {/* KPI 2: TOTAL KG PROGRAMADOS */}
        <div className={`rounded-xl p-4 border relative overflow-hidden ${cardBg}`}>
          <div className="absolute top-0 left-0 right-0 h-1 bg-purple-500" />
          <div className={`text-[10px] font-bold tracking-widest uppercase ${textTitle}`}>
            TOTAL KG/LT PROGRAMADOS
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-2xl font-black font-mono ${textValue}`}>
              {resumen.totalKgProgramados}
            </span>
            <span className="text-xs text-slate-400 font-sans">KG/LT</span>
          </div>
        </div>

        {/* KPI 3: TERMINADOS */}
        <div className={`rounded-xl p-4 border relative overflow-hidden ${cardBg}`}>
          <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500" />
          <div className={`text-[10px] font-bold tracking-widest uppercase text-emerald-500`}>
            🟢 TERMINADOS
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-2xl font-black font-mono text-emerald-400`}>
              {resumen.totalTerminados}
            </span>
            <span className="text-xs text-slate-400 font-sans">lotes liberados</span>
          </div>
        </div>

        {/* KPI 4: EN PROCESO */}
        <div className={`rounded-xl p-4 border relative overflow-hidden ${cardBg}`}>
          <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500" />
          <div className={`text-[10px] font-bold tracking-widest uppercase text-blue-500`}>
            🔵 EN PROCESO
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-2xl font-black font-mono text-blue-400`}>
              {resumen.totalEnProceso}
            </span>
            <span className="text-xs text-slate-400 font-sans">en reactores</span>
          </div>
        </div>

        {/* KPI 5: PENDIENTES */}
        <div className={`rounded-xl p-4 border relative overflow-hidden ${cardBg}`}>
          <div className="absolute top-0 left-0 right-0 h-1 bg-slate-500" />
          <div className={`text-[10px] font-bold tracking-widest uppercase ${textTitle}`}>
            ⚪ PENDIENTES
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-2xl font-black font-mono ${textValue}`}>
              {resumen.totalPendientes}
            </span>
            <span className="text-xs text-slate-400 font-sans">en cola</span>
          </div>
        </div>
      </div>

      {/* 📋 DataGrid Industrial (Digitalización del Excel) */}
      <div className={`rounded-xl border overflow-hidden ${cardBg}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className={`border-b ${isDark ? 'bg-[#151D2A] border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-700'}`}>
                <th className="p-3 font-bold uppercase tracking-wider">HORA</th>
                <th className="p-3 font-bold uppercase tracking-wider">ORD. PROD.</th>
                <th className="p-3 font-bold uppercase tracking-wider">CLIENTE</th>
                <th className="p-3 font-bold uppercase tracking-wider">PRODUCTO</th>
                <th className="p-3 font-bold uppercase tracking-wider">COLOR</th>
                <th className="p-3 font-bold uppercase tracking-wider">FRAGANCIA</th>
                <th className="p-3 font-bold uppercase tracking-wider">CANTIDAD</th>
                <th className="p-3 font-bold uppercase tracking-wider">ESTADO</th>
                <th className="p-3 font-bold uppercase tracking-wider">RESPONSABLE</th>
                <th className="p-3 font-bold uppercase tracking-wider">PRIORIDAD</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-slate-800/60' : 'divide-slate-200'}`}>
              {loading ? (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-slate-500 font-sans">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-blue-500 mb-2" />
                    Cargando planilla digital de producción...
                  </td>
                </tr>
              ) : ordenesFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-slate-500 font-sans">
                    No hay registros de producción encontrados para la fecha seleccionada ({selectedDate}).
                  </td>
                </tr>
              ) : (
                ordenesFiltradas.map((o) => (
                  <tr key={o.id} className={`hover:bg-slate-800/20 transition-colors ${isDark ? '' : 'hover:bg-slate-50'}`}>
                    <td className="p-3 font-mono text-[11px] text-slate-400">
                      {o.fechaCreacion
                        ? new Date(o.fechaCreacion).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })
                        : o.hora || '12:22 p. m.'}
                    </td>
                    <td className="p-3 font-mono font-bold text-[#00F2C3]">{o.codigoLote}</td>
                    <td className="p-3 font-bold">{o.clienteNombre}</td>
                    <td className="p-3 font-sans font-medium">{o.productoNombre}</td>
                    <td className="p-3 font-sans whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border inline-flex items-center gap-1.5 shadow-sm whitespace-nowrap ${
                        o.colorEspecificado && o.colorEspecificado !== 'TRANSPARENTE' && o.colorEspecificado !== 'SIN COLOR'
                          ? isDark
                            ? 'bg-purple-500/20 text-purple-200 border-purple-500/40'
                            : 'bg-purple-100 text-purple-900 border-purple-300 font-extrabold'
                          : isDark
                          ? 'bg-slate-800/60 text-slate-400 border-slate-700'
                          : 'bg-slate-100 text-slate-600 border-slate-300'
                      }`}>
                        <span className="w-2 h-2 rounded-full bg-purple-400 inline-block" />
                        {o.colorEspecificado || 'TRANSPARENTE'}
                      </span>
                    </td>
                    <td className="p-3 font-sans whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border inline-flex items-center gap-1.5 shadow-sm whitespace-nowrap ${
                        o.fraganciaEspecificada && o.fraganciaEspecificada !== 'SIN FRAGANCIA' && o.fraganciaEspecificada !== 'SIN AROMA'
                          ? isDark
                            ? 'bg-amber-500/20 text-amber-200 border-amber-500/40'
                            : 'bg-amber-100 text-amber-900 border-amber-300 font-extrabold'
                          : isDark
                          ? 'bg-slate-800/60 text-slate-400 border-slate-700'
                          : 'bg-slate-100 text-slate-600 border-slate-300'
                      }`}>
                        <span className="text-xs">🌸</span>
                        {o.fraganciaEspecificada || 'SIN FRAGANCIA'}
                      </span>
                    </td>
                    <td className="p-3 font-mono font-bold">{o.cantidad} {o.unidadMedida}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-black tracking-wide border uppercase font-mono ${
                        o.estado === 'TERMINADO'
                          ? isDark ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold'
                          : o.estado === 'EN PROCESO'
                          ? isDark ? 'bg-blue-500/20 text-blue-300 border-blue-500/40' : 'bg-blue-100 text-blue-900 border-blue-300 font-bold'
                          : isDark ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-slate-100 text-slate-600 border-slate-300'
                      }`}>
                        {o.estado}
                      </span>
                    </td>
                    <td className="p-3 font-sans">
                      <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border inline-flex items-center gap-1.5 ${
                        isDark ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30' : 'bg-cyan-50 text-cyan-900 border-cyan-200'
                      }`}>
                        <User className="w-3.5 h-3.5 text-cyan-400" />
                        {o.operarios || 'Sin Asignar'}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-[11px] text-slate-400 font-bold">
                      {o.prioridad}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
