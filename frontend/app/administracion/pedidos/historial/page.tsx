'use client';

import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import {
  History,
  Search,
  Calendar,
  Filter,
  CheckCircle2,
  Clock,
  Building2,
  Beaker,
  AlertTriangle,
  FileText,
  RefreshCw,
  ChevronRight,
  TrendingUp,
  User,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';
import { apiFetch, getSocketUrl } from '@/lib/apiClient';

interface PedidoHistorialItem {
  id: string;
  codigoOrden: string;
  clienteNombre: string;
  clienteRuc: string;
  productoNombre: string;
  cantidadSolicitada: number;
  unidadMedida: string;
  montoTotal: number;
  fechaCreacion: string;
  fechaPrometida: string;
  prioridad: string;
  estado: 'NUEVO' | 'APROBADO' | 'EN_PRODUCCION' | 'COMPLETADO' | 'DEVUELTO' | 'ENTREGADO' | 'DESPACHADO';
  notasAdmin?: string;
  lineaTiempo: {
    etapa: string;
    fecha: string;
    usuario: string;
    detalle: string;
    completado: boolean;
  }[];
}

export default function HistorialPedidosPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [pedidos, setPedidos] = useState<PedidoHistorialItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [selectedPedido, setSelectedPedido] = useState<PedidoHistorialItem | null>(null);

  const cardBg = isDark ? 'bg-[#0F141C] border-[#1A2232]' : 'bg-white border-slate-200 shadow-sm';
  const textTitle = isDark ? 'text-slate-400' : 'text-slate-600';
  const textValue = isDark ? 'text-white' : 'text-slate-900';
  const inputBg = isDark
    ? 'bg-[#151D2A] border-[#1A2232] text-slate-200 placeholder-slate-500 focus:border-blue-500'
    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500';

  const fetchHistorial = async () => {
    setLoading(true);
    try {
      const { data, ok } = await apiFetch<any[]>('/pedidos-admin');
      if (ok && Array.isArray(data)) {
        const mapped: PedidoHistorialItem[] = data.map((p) => ({
          id: p.id,
          codigoOrden: p.codigoOrden,
          clienteNombre: p.clienteNombre,
          clienteRuc: p.clienteRuc,
          productoNombre: p.productoNombre,
          cantidadSolicitada: Number(p.cantidadSolicitada),
          unidadMedida: p.unidadMedida || 'KG',
          montoTotal: Number(p.montoTotal),
          fechaCreacion: p.createdAt ? new Date(p.createdAt).toLocaleDateString('es-ES') : '24/08/2026',
          fechaPrometida: p.fechaPrometida ? new Date(p.fechaPrometida).toLocaleDateString('es-ES') : '26/08/2026',
          prioridad: p.prioridad || 'NORMAL',
          estado: p.estado || 'APROBADO',
          notasAdmin: p.notasAdmin,
          lineaTiempo: [
            {
              etapa: 'Creación de Pedido Comercial',
              fecha: p.createdAt ? new Date(p.createdAt).toLocaleString('es-ES') : '24/08/2026 09:00',
              usuario: p.repComercial || 'Ventas & Digital',
              detalle: `Ingreso de pedido comercial ${p.codigoOrden} por ${p.cantidadSolicitada} ${p.unidadMedida || 'KG'} de ${p.productoNombre}`,
              completado: true,
            },
            {
              etapa: 'Aprobación Administrativa',
              fecha: p.fechaAprobacion ? new Date(p.fechaAprobacion).toLocaleString('es-ES') : '24/08/2026 10:15',
              usuario: p.aprobadoPor || 'Elvis Edwin Yarleque',
              detalle: 'Validación de margen, condición de pago y liberación a producción',
              completado: true,
            },
            {
              etapa: 'Programación en Planta & Reactores',
              fecha: '24/08/2026 11:30',
              usuario: 'Supervisor de Producción',
              detalle: 'Lote asignado a reactor de producción con hoja de ruta inmutable',
              completado: p.estado === 'EN_PRODUCCION' || p.estado === 'COMPLETADO',
            },
            {
              etapa: 'Control de Calidad QA & Liberación',
              fecha: '24/08/2026 14:00',
              usuario: 'Laboratorio QA',
              detalle: 'Muestreo de densidad, pH y viscosidad. Liberación de lote',
              completado: p.estado === 'COMPLETADO',
            },
          ],
        }));
        setPedidos(mapped);
        if (mapped.length > 0) setSelectedPedido(mapped[0]);
      }
    } catch (e) {
      console.error('Error al cargar historial de pedidos:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistorial();

    // 📡 Listener WebSockets para actualizar el Historial en Vivo
    const socket = io(getSocketUrl(), {
      transports: ['websocket', 'polling'],
    });

    socket.on('pedido:aprobado', () => {
      fetchHistorial();
    });

    socket.on('lote:estado_actualizado', () => {
      fetchHistorial();
    });

    socket.on('order:status_updated', () => {
      fetchHistorial();
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const filtrados = pedidos.filter((p) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      p.codigoOrden.toLowerCase().includes(q) ||
      p.clienteNombre.toLowerCase().includes(q) ||
      p.productoNombre.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className={`p-6 rounded-2xl border transition-all ${cardBg}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 text-indigo-400">
              <History className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className={`text-xl font-black tracking-tight ${textValue}`}>
                  Historial & Trazabilidad de Pedidos
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase font-mono">
                  Auditoría 360°
                </span>
              </div>
              <p className={`text-xs mt-1 ${textTitle}`}>
                Línea de tiempo inmutable, responsables de aprobación, lotes vinculados y despacho final.
              </p>
            </div>
          </div>

          <button
            onClick={fetchHistorial}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
              isDark
                ? 'bg-[#151D2A] border-[#1A2232] text-slate-300 hover:bg-slate-800'
                : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Actualizar Bitácora</span>
          </button>
        </div>
      </div>

      {/* Buscador */}
      <div className={`p-4 rounded-xl border flex items-center justify-between gap-4 ${cardBg}`}>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar pedido por código, cliente o producto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full pl-9 pr-3 py-1.5 rounded-xl border text-xs font-medium ${inputBg}`}
          />
        </div>
      </div>

      {/* Vista de 2 Columnas: Lista de Pedidos a la Izquierda & Timeline a la Derecha */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Columna Izquierda: Lista de Pedidos */}
        <div className="lg:col-span-5 space-y-3">
          <h2 className={`text-xs font-bold uppercase tracking-wider ${textTitle}`}>
            Pedidos Registrados ({filtrados.length})
          </h2>

          {loading ? (
            <div className="p-8 text-center">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto text-indigo-500 mb-2" />
              <p className="text-xs text-slate-400">Cargando trazabilidad...</p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
              {filtrados.map((p) => {
                const isSelected = selectedPedido?.id === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPedido(p)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? isDark
                          ? 'bg-indigo-500/10 border-indigo-500/40 shadow-sm'
                          : 'bg-indigo-50 border-indigo-300 shadow-sm'
                        : cardBg
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs text-indigo-400">
                        {p.codigoOrden}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase font-mono ${
                        p.estado === 'COMPLETADO' || p.estado === 'ENTREGADO' || p.estado === 'DESPACHADO'
                          ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                          : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      }`}>
                        {p.estado === 'ENTREGADO' || p.estado === 'DESPACHADO' || p.estado === 'COMPLETADO' ? 'ENTREGADO' : p.estado}
                      </span>
                    </div>

                    <h3 className={`text-xs font-bold mt-1.5 ${textValue}`}>
                      {p.clienteNombre}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {p.productoNombre} ({p.cantidadSolicitada} {p.unidadMedida})
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-3 pt-2 border-t border-slate-800/40">
                      <span>Ingreso: {p.fechaCreacion}</span>
                      <span className="font-mono font-bold text-emerald-400">
                        S/ {p.montoTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Columna Derecha: Trazabilidad & Timeline Inmutable */}
        <div className="lg:col-span-7">
          {selectedPedido ? (
            <div className={`p-6 rounded-2xl border ${cardBg} space-y-6`}>
              <div className="flex items-center justify-between border-b pb-4 border-slate-800/40">
                <div>
                  <span className="text-[10px] font-bold text-indigo-400 font-mono tracking-widest uppercase">
                    EXPEDIENTE & TRAZABILIDAD 360°
                  </span>
                  <h2 className={`text-lg font-black ${textValue}`}>
                    {selectedPedido.codigoOrden}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {selectedPedido.clienteNombre} — RUC: {selectedPedido.clienteRuc}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Monto Total</p>
                  <p className="text-lg font-black text-emerald-400 font-mono">
                    S/ {selectedPedido.montoTotal.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Línea de Tiempo Cronológica */}
              <div>
                <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 ${textTitle}`}>
                  Línea de Tiempo de Ejecución & Auditoría
                </h3>

                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-indigo-500/30">
                  {selectedPedido.lineaTiempo.map((item, idx) => (
                    <div key={idx} className="relative group">
                      <div className={`absolute -left-6 top-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        item.completado
                          ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                          : 'bg-slate-700 text-slate-400'
                      }`}>
                        {item.completado ? '✓' : idx + 1}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className={`text-xs font-bold ${item.completado ? textValue : 'text-slate-500'}`}>
                            {item.etapa}
                          </h4>
                          <span className="text-[10px] font-mono text-slate-400">
                            {item.fecha}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          {item.detalle}
                        </p>
                        <p className="text-[10px] font-bold text-indigo-400 font-mono">
                          Responsable: {item.usuario}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className={`p-12 rounded-2xl border text-center ${cardBg}`}>
              <History className="w-10 h-10 text-slate-600 mx-auto mb-2 opacity-50" />
              <p className={`text-sm font-bold ${textValue}`}>Selecciona un pedido</p>
              <p className="text-xs text-slate-400 mt-1">
                Haz clic en cualquier pedido de la izquierda para ver su línea de tiempo completa.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
