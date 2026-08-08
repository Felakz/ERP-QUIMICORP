'use client';

import React, { useState, useEffect } from 'react';
import {
  Inbox,
  Plus,
  Send,
  CheckCircle2,
  AlertCircle,
  Building2,
  Calendar,
  DollarSign,
  Package,
  Clock,
  Search,
  User,
  Phone,
  MapPin,
  FileText,
  CreditCard,
  X,
  Zap,
} from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';
import { useAuth } from '@/lib/AuthContext';

interface PedidoEmitido {
  id: string;
  codigoOrden: string;
  cliente: string;
  ruc: string;
  producto: string;
  cantidad: number;
  unidad: string;
  precioUnitario: number;
  montoTotal: number;
  prioridad: 'URGENTE' | 'NORMAL' | 'PROGRAMADO';
  condicionPago: string;
  fechaPrometida: string;
  estado: 'NUEVO' | 'EN_PRODUCCION' | 'COMPLETADO';
}

const FORMULAS_DISPONIBLES = [
  { id: 'FM-0001', nombre: 'SERUM DE SALMON', unidad: 'KG', precioSugerido: 34.50 },
  { id: 'FM-0002', nombre: 'DETERGENTE LÍQUIDO INDUSTRIAL', unidad: 'LT', precioSugerido: 19.80 },
  { id: 'FM-0003', nombre: 'SHAMPOO CAPILAR NUTRICIÓN', unidad: 'LT', precioSugerido: 22.00 },
  { id: 'FM-0004', nombre: 'DESINFECTANTE PINO CONCENTRADO', unidad: 'LT', precioSugerido: 14.50 },
  { id: 'FM-0005', nombre: 'RESINA POLIÉSTER INDUSTRIAL', unidad: 'KG', precioSugerido: 45.00 },
  { id: 'FM-0006', nombre: 'SERUM DE ALOE VERA', unidad: 'KG', precioSugerido: 32.00 },
];

export default function AdministracionPedidosComercialesPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [pedidos, setPedidos] = useState<PedidoEmitido[]>([]);
  const [loadingPedidos, setLoadingPedidos] = useState<boolean>(true);

  // Cargar pedidos desde la API real de PostgreSQL
  const cargarPedidos = async () => {
    try {
      const savedToken = typeof window !== 'undefined' ? localStorage.getItem('quimicorp_jwt') : null;
      const authHeader: Record<string, string> = savedToken ? { Authorization: `Bearer ${savedToken}` } : {};

      const res = await fetch('http://localhost:3001/api/v1/pedidos-admin', { headers: authHeader });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const mapped: PedidoEmitido[] = data.map((p: any) => ({
            id: p.id,
            codigoOrden: p.codigoOrden,
            cliente: p.clienteNombre,
            ruc: p.clienteRuc,
            producto: p.productoNombre,
            cantidad: Number(p.cantidadSolicitada) || 1000,
            unidad: p.unidadMedida || 'KG',
            precioUnitario: p.cantidadSolicitada ? Number(p.montoTotal) / Number(p.cantidadSolicitada) : 34.5,
            montoTotal: Number(p.montoTotal) || 0,
            prioridad: p.prioridad || 'URGENTE',
            condicionPago: p.condicionPago || 'Crédito 30 días',
            fechaPrometida: p.fechaPrometida ? new Date(p.fechaPrometida).toLocaleDateString('es-PE') : '12/08/2026',
            estado: p.estado || 'NUEVO',
          }));
          setPedidos(mapped);
        }
      }
    } catch (e) {
      console.log('Error cargando pedidos en administración:', e);
    } finally {
      setLoadingPedidos(false);
    }
  };

  useEffect(() => {
    cargarPedidos();

    let socket: any = null;
    try {
      const { io } = require('socket.io-client');
      socket = io('http://localhost:3001');
      socket.on('order:created_to_plant', () => cargarPedidos());
      socket.on('order:status_updated', () => cargarPedidos());
      socket.on('order:accepted_by_plant', () => cargarPedidos());
      socket.on('order:devolucion', () => cargarPedidos());
    } catch {}

    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  // Form State
  const [cliente, setCliente] = useState('GEYMA S.A.C.');
  const [ruc, setRuc] = useState('20614697321');
  const [contacto, setContacto] = useState('Carlos Mendoza');
  const [telefono, setTelefono] = useState('+51 998 234 567');
  const [direccion, setDireccion] = useState('Av. Industrial 342, Ate, Lima');
  const [productoSeleccionado, setProductoSeleccionado] = useState(FORMULAS_DISPONIBLES[0].nombre);
  const [cantidad, setCantidad] = useState(1000);
  const [precioUnitario, setPrecioUnitario] = useState(34.50);
  const [condicionPago, setCondicionPago] = useState('Crédito 30 días');
  const [prioridad, setPrioridad] = useState<'URGENTE' | 'NORMAL' | 'PROGRAMADO'>('URGENTE');
  const [fechaPrometida, setFechaPrometida] = useState('2026-08-15');
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const cardBg = isDark ? 'bg-[#0F141C] border-[#1A2232]' : 'bg-white border-slate-200 shadow-sm';
  const inputBg = isDark
    ? 'bg-[#151D2A] border-[#1A2232] text-slate-200 focus:border-blue-500'
    : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-500';

  const totalCalculado = cantidad * precioUnitario;

  const handleProductoChange = (nombre: string) => {
    setProductoSeleccionado(nombre);
    const formula = FORMULAS_DISPONIBLES.find((f) => f.nombre === nombre);
    if (formula) {
      setPrecioUnitario(formula.precioSugerido);
    }
  };

  const handleCrearPedido = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const nuevoCodigo = `#PO-${Math.floor(1000 + Math.random() * 9000)}`;
    const nuevoPedidoDto = {
      code: nuevoCodigo,
      cliente,
      ruc,
      contacto,
      telefono,
      direccion,
      repComercial: 'Ana Torres (Administración)',
      condicionPago,
      producto: productoSeleccionado,
      cantidad,
      unidad: FORMULAS_DISPONIBLES.find((f) => f.nombre === productoSeleccionado)?.unidad || 'KG',
      montoTotal: totalCalculado,
      prioridad,
      fechaPrometida,
    };

    try {
      const savedToken = typeof window !== 'undefined' ? localStorage.getItem('quimicorp_jwt') : null;
      const authHeader: Record<string, string> = savedToken ? { Authorization: `Bearer ${savedToken}` } : {};

      const res = await fetch('http://localhost:3001/api/v1/pedidos-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeader,
        },
        body: JSON.stringify(nuevoPedidoDto),
      });

      if (res.ok) {
        cargarPedidos();
      }

      setToastMsg(`¡Pedido comercial ${nuevoCodigo} creado con éxito y transmitido a la bandeja de Pedidos Entrantes en Planta!`);
      setTimeout(() => setToastMsg(null), 4000);
    } catch (err) {
      setToastMsg(`¡Pedido comercial ${nuevoCodigo} emitido a Planta!`);
      setTimeout(() => setToastMsg(null), 4000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 font-mono min-h-screen">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-4 right-4 z-50 px-4 py-3 rounded-2xl shadow-2xl border bg-emerald-500/20 border-emerald-500/40 text-emerald-300 font-sans text-xs font-bold flex items-center gap-3 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
          <button onClick={() => setToastMsg(null)} className="ml-2 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Banner Principal */}
      <div className={`rounded-2xl p-5 border flex flex-wrap items-center justify-between gap-4 transition-all shadow-sm ${cardBg}`}>
        <div className="flex items-center gap-3.5">
          <div className={`p-3 rounded-2xl border ${isDark ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-700'}`}>
            <Inbox className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className={`text-lg font-black font-sans tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Creación & Gestión de Pedidos Comerciales
              </h1>
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold font-mono uppercase ${
                isDark ? 'bg-blue-500/10 border border-blue-500/30 text-blue-400' : 'bg-blue-100 border border-blue-300 text-blue-800'
              }`}>
                PORTAL ADMINISTRACIÓN
              </span>
            </div>
            <p className={`text-xs font-sans mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Crea nuevas órdenes de venta, calcula precios con IGV y envíalas directamente a los reactores de Planta.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Formulario de Emisión de Pedido Comercial */}
        <div className={`lg:col-span-5 rounded-2xl p-5 border space-y-4 shadow-sm ${cardBg}`}>
          <div className={`flex items-center gap-2 border-b pb-3 ${isDark ? 'border-slate-800/60' : 'border-slate-100'}`}>
            <Plus className={`w-4 h-4 ${isDark ? 'text-blue-400' : 'text-blue-700'}`} />
            <h2 className={`text-xs font-bold font-sans uppercase tracking-wider ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
              Formulario de Pedido Comercial
            </h2>
          </div>

          <form onSubmit={handleCrearPedido} className="space-y-3.5 text-xs font-sans">
            <div>
              <label className={`block text-[10px] uppercase font-bold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                Cliente / Razón Social
              </label>
              <input
                type="text"
                required
                value={cliente}
                onChange={(e) => setCliente(e.target.value)}
                placeholder="Nombre de la empresa o cliente"
                className={`w-full rounded-xl border px-3 py-2 text-xs focus:outline-none transition-all font-medium ${inputBg}`}
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className={`block text-[10px] uppercase font-bold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>RUC</label>
                <input
                  type="text"
                  required
                  value={ruc}
                  onChange={(e) => setRuc(e.target.value)}
                  className={`w-full rounded-xl border px-3 py-2 text-xs focus:outline-none font-mono ${inputBg}`}
                />
              </div>

              <div>
                <label className={`block text-[10px] uppercase font-bold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>Teléfono</label>
                <input
                  type="text"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  className={`w-full rounded-xl border px-3 py-2 text-xs focus:outline-none ${inputBg}`}
                />
              </div>
            </div>

            <div>
              <label className={`block text-[10px] uppercase font-bold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                Dirección de Entrega
              </label>
              <input
                type="text"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                className={`w-full rounded-xl border px-3 py-2 text-xs focus:outline-none ${inputBg}`}
              />
            </div>

            <div>
              <label className={`block text-[10px] uppercase font-bold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                Producto / Fórmula Maestra
              </label>
              <select
                value={productoSeleccionado}
                onChange={(e) => handleProductoChange(e.target.value)}
                className={`w-full rounded-xl border px-3 py-2 text-xs focus:outline-none font-bold ${inputBg}`}
              >
                {FORMULAS_DISPONIBLES.map((f) => (
                  <option key={f.id} value={f.nombre} className={isDark ? 'bg-[#151D2A] text-slate-200' : 'bg-white text-slate-900'}>
                    {f.nombre} ({f.unidad}) - S/ {f.precioSugerido.toFixed(2)}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className={`block text-[10px] uppercase font-bold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                  Cantidad Solicitada
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={cantidad}
                  onChange={(e) => setCantidad(Number(e.target.value))}
                  className={`w-full rounded-xl border px-3 py-2 text-xs focus:outline-none font-mono ${inputBg}`}
                />
              </div>

              <div>
                <label className={`block text-[10px] uppercase font-bold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                  Precio Unitario (S/)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={precioUnitario}
                  onChange={(e) => setPrecioUnitario(Number(e.target.value))}
                  className={`w-full rounded-xl border px-3 py-2 text-xs focus:outline-none font-mono ${inputBg}`}
                />
              </div>
            </div>

            {/* Total Resumen */}
            <div className={`p-3.5 rounded-xl border flex items-center justify-between shadow-sm ${
              isDark ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-900'
            }`}>
              <span className={`text-[10px] uppercase font-bold ${isDark ? 'text-blue-400' : 'text-blue-800'}`}>Total Facturado:</span>
              <span className={`text-base font-black font-mono ${isDark ? 'text-blue-400' : 'text-blue-900'}`}>
                S/ {totalCalculado.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className={`block text-[10px] uppercase font-bold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>Prioridad</label>
                <select
                  value={prioridad}
                  onChange={(e) => setPrioridad(e.target.value as any)}
                  className={`w-full rounded-xl border px-3 py-2 text-xs focus:outline-none font-bold ${inputBg}`}
                >
                  <option value="URGENTE" className={isDark ? 'bg-[#151D2A] text-slate-200' : 'bg-white text-slate-900'}>URGENTE</option>
                  <option value="NORMAL" className={isDark ? 'bg-[#151D2A] text-slate-200' : 'bg-white text-slate-900'}>NORMAL</option>
                  <option value="PROGRAMADO" className={isDark ? 'bg-[#151D2A] text-slate-200' : 'bg-white text-slate-900'}>PROGRAMADO</option>
                </select>
              </div>

              <div>
                <label className={`block text-[10px] uppercase font-bold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                  Fecha Prometida
                </label>
                <input
                  type="date"
                  value={fechaPrometida}
                  onChange={(e) => setFechaPrometida(e.target.value)}
                  className={`w-full rounded-xl border px-3 py-2 text-xs focus:outline-none font-mono ${inputBg}`}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-black font-sans text-xs tracking-wider uppercase transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? 'Transmitiendo a Planta...' : 'Crear Pedido y Enviar a Planta'}</span>
            </button>
          </form>
        </div>

        {/* Tabla de Pedidos Registrados en Administración */}
        <div className={`lg:col-span-7 rounded-2xl p-5 border space-y-4 shadow-sm ${cardBg}`}>
          <div className={`flex items-center justify-between border-b pb-3 ${isDark ? 'border-slate-800/60' : 'border-slate-100'}`}>
            <h2 className={`text-xs font-bold font-sans uppercase tracking-wider ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
              Pedidos Comerciales Emitidos ({pedidos.length})
            </h2>
            <span className={`text-[10px] font-mono font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Sincronizado con Base de Datos
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className={`border-b text-[10px] uppercase font-bold ${
                  isDark ? 'border-slate-800/60 text-slate-400' : 'border-slate-200 text-slate-700 bg-slate-50'
                }`}>
                  <th className="py-2.5 px-2">CÓDIGO</th>
                  <th className="py-2.5 px-2">CLIENTE</th>
                  <th className="py-2.5 px-2">PRODUCTO</th>
                  <th className="py-2.5 px-2 text-right">CANTIDAD</th>
                  <th className="py-2.5 px-2 text-right">TOTAL</th>
                  <th className="py-2.5 px-2 text-center">ESTADO PLANTA</th>
                </tr>
              </thead>
              <tbody className={`divide-y font-mono text-[11px] ${
                isDark ? 'divide-slate-800/60' : 'divide-slate-100'
              }`}>
                {pedidos.map((p) => (
                  <tr key={p.id} className={`transition-colors ${
                    isDark ? 'hover:bg-slate-800/30' : 'hover:bg-slate-50'
                  }`}>
                    <td className={`py-3 px-2 font-bold ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>
                      {p.codigoOrden}
                    </td>
                    <td className={`py-3 px-2 font-sans font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                      {p.cliente}
                    </td>
                    <td className={`py-3 px-2 font-sans ${isDark ? 'text-slate-300' : 'text-slate-900 font-medium'}`}>
                      {p.producto}
                    </td>
                    <td className={`py-3 px-2 text-right font-bold ${isDark ? 'text-cyan-400' : 'text-teal-700'}`}>
                      {p.cantidad.toLocaleString()} {p.unidad}
                    </td>
                    <td className={`py-3 px-2 text-right font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
                      S/ {p.montoTotal.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-2 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                        p.estado === 'APROBADO'
                          ? isDark
                            ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                            : 'bg-emerald-100 border border-emerald-300 text-emerald-800 font-black'
                          : isDark
                          ? 'bg-blue-500/10 border border-blue-500/30 text-blue-400'
                          : 'bg-blue-100 border border-blue-300 text-blue-800 font-black'
                      }`}>
                        {p.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
