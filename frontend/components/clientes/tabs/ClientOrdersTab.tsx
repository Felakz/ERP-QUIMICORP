'use client';

import React, { useState } from 'react';
import {
  Package,
  FileText,
  CreditCard,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Search,
  Filter,
} from 'lucide-react';
import { ClientExtended } from '@/types/clientes';

interface ClientOrdersTabProps {
  cliente: ClientExtended;
  isDark: boolean;
}

export const ClientOrdersTab: React.FC<ClientOrdersTabProps> = ({ cliente, isDark }) => {
  const textValue = isDark ? 'text-white' : 'text-slate-900';
  const cardBg = isDark ? 'bg-[#0F141C] border-[#1A2232]' : 'bg-white border-slate-200 shadow-sm';
  const tableHeaderBg = isDark ? 'bg-[#151D2A]/80 text-slate-400' : 'bg-slate-100 text-slate-600';
  const tableRowHover = isDark ? 'hover:bg-[#151D2A]' : 'hover:bg-slate-50';

  const [filterType, setFilterType] = useState<'TODOS' | 'ENTREGADOS' | 'PENDIENTES' | 'CON_SALDO'>('TODOS');
  const [searchTerm, setSearchTerm] = useState('');

  const items = cliente.pedidosHistory || [];

  // Filtrado reactivo
  const itemsFiltrados = items.filter((item) => {
    const q = searchTerm.toLowerCase().trim();
    const matchSearch =
      !q ||
      item.code.toLowerCase().includes(q) ||
      (item.variant && item.variant.toLowerCase().includes(q)) ||
      (item.comprobante && item.comprobante.toLowerCase().includes(q));

    let matchFilter = true;
    if (filterType === 'ENTREGADOS') {
      matchFilter = item.estadoEntrega === 'ENTREGADO' || item.estado === 'DESPACHADO';
    } else if (filterType === 'PENDIENTES') {
      matchFilter = item.estadoEntrega !== 'ENTREGADO' && item.estado !== 'DESPACHADO';
    } else if (filterType === 'CON_SALDO') {
      matchFilter = (item.saldo || 0) > 0 || item.estadoPago === 'PENDIENTE' || item.estadoPago === 'VENCIDO';
    }

    return matchSearch && matchFilter;
  });

  const totalPedidos = items.length;
  const totalEntregados = items.filter((i) => i.estadoEntrega === 'ENTREGADO' || i.estado === 'DESPACHADO').length;
  const totalPendientesEntrega = totalPedidos - totalEntregados;
  const totalPagados = items.filter((i) => i.estadoPago === 'PAGADO' || (i.saldo || 0) === 0).length;

  return (
    <div className="space-y-5">
      {/* 1. KPIs Rápidos de Pedidos & Entregas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className={`p-3.5 rounded-xl border ${cardBg} flex items-center justify-between`}>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Pedidos</span>
            <span className={`text-lg font-black font-mono ${textValue}`}>{totalPedidos}</span>
          </div>
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
            <Package className="w-4 h-4" />
          </div>
        </div>

        <div className={`p-3.5 rounded-xl border ${cardBg} flex items-center justify-between`}>
          <div>
            <span className="text-[10px] uppercase font-bold text-emerald-400 block">Entregados</span>
            <span className="text-lg font-black font-mono text-emerald-400">{totalEntregados}</span>
          </div>
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        <div className={`p-3.5 rounded-xl border ${cardBg} flex items-center justify-between`}>
          <div>
            <span className="text-[10px] uppercase font-bold text-amber-400 block">Pend. Entrega</span>
            <span className="text-lg font-black font-mono text-amber-400">{totalPendientesEntrega}</span>
          </div>
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        <div className={`p-3.5 rounded-xl border ${cardBg} flex items-center justify-between`}>
          <div>
            <span className="text-[10px] uppercase font-bold text-cyan-400 block">100% Pagados</span>
            <span className="text-lg font-black font-mono text-cyan-400">{totalPagados}</span>
          </div>
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
            <CreditCard className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* 2. Filtros y Barra de Búsqueda */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: 'TODOS', label: `Todos (${totalPedidos})` },
            { id: 'ENTREGADOS', label: `Entregados (${totalEntregados})` },
            { id: 'PENDIENTES', label: `Pendientes (${totalPendientesEntrega})` },
            { id: 'CON_SALDO', label: `Con Saldo` },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                filterType === f.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : isDark
                  ? 'bg-[#151D2A] text-slate-400 hover:text-slate-200 border border-slate-800'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className={`w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
          <input
            type="text"
            placeholder="Buscar por OP, producto, factura..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-9 pr-3 py-1.5 rounded-lg text-xs font-sans focus:outline-none focus:border-blue-500 ${
              isDark
                ? 'bg-[#151D2A] border border-slate-800 text-slate-200 placeholder:text-slate-500'
                : 'bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400'
            }`}
          />
        </div>
      </div>

      {/* 3. Tabla Correlacionada 360° (Pedido + Comprobante + Pago + Entrega) */}
      <div className={`overflow-x-auto rounded-xl border ${isDark ? 'border-slate-800/80' : 'border-slate-200'}`}>
        <table className="w-full text-left text-xs">
          <thead>
            <tr className={`${tableHeaderBg} text-[10px] font-bold uppercase tracking-wider`}>
              <th className="py-3 px-3.5">PEDIDO / OP</th>
              <th className="py-3 px-3.5">PRODUCTO SOLICITADO</th>
              <th className="py-3 px-3.5">COMPROBANTE FISCAL</th>
              <th className="py-3 px-3.5 text-right">MONTO TOTAL</th>
              <th className="py-3 px-3.5 text-right">SALDO PEND.</th>
              <th className="py-3 px-3.5 text-center">ESTADO PAGO</th>
              <th className="py-3 px-3.5 text-center">DESPACHO / PLANTA</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDark ? 'divide-slate-800/50' : 'divide-slate-200'} font-mono`}>
            {itemsFiltrados.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-10 text-center text-slate-500 font-sans italic text-xs">
                  No hay pedidos registrados que coincidan con el filtro seleccionado.
                </td>
              </tr>
            ) : (
              itemsFiltrados.map((item, i) => {
                const esEntregado = item.estadoEntrega === 'ENTREGADO' || item.estado === 'DESPACHADO';
                const esPagado = item.estadoPago === 'PAGADO' || (item.saldo || 0) === 0;

                return (
                  <tr key={i} className={`${tableRowHover} transition-colors`}>
                    {/* 1. PEDIDO / OP */}
                    <td className="py-3.5 px-3.5">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-md bg-blue-500/10 text-blue-500">
                          <Package className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="font-bold text-blue-600 dark:text-blue-400 block">{item.code}</span>
                          <span className={`text-[10px] block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{item.fecha}</span>
                        </div>
                      </div>
                    </td>

                    {/* 2. PRODUCTO SOLICITADO */}
                    <td className="py-3.5 px-3.5 font-sans">
                      <span className={`font-semibold block ${textValue}`}>{item.variant}</span>
                      <span className={`text-[10px] font-mono font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        Volumen: {item.volumen ? `${item.volumen} ${item.unidadMedida || 'KG'}` : 'Lote Estándar'}
                      </span>
                    </td>

                    {/* 3. COMPROBANTE FISCAL */}
                    <td className="py-3.5 px-3.5">
                      <div className="flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                        <div>
                          <span className={`font-bold block ${textValue}`}>
                            {item.comprobante || `FAC-${item.code}`}
                          </span>
                          {item.vencimiento && (
                            <span className={`text-[10px] block font-mono ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                              Vence: {item.vencimiento}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* 4. MONTO TOTAL */}
                    <td className={`py-3.5 px-3.5 text-right font-black ${textValue}`}>
                      S/ {item.monto.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                    </td>

                    {/* 5. SALDO PENDIENTE */}
                    <td className="py-3.5 px-3.5 text-right font-black">
                      {(item.saldo || 0) > 0 ? (
                        <span className="text-rose-600 dark:text-rose-400 font-bold">
                          S/ {item.saldo?.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                        </span>
                      ) : (
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">S/ 0.00</span>
                      )}
                    </td>

                    {/* 6. ESTADO PAGO */}
                    <td className="py-3.5 px-3.5 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase ${
                          esPagado
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {esPagado ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            PAGADO
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3" />
                            PENDIENTE
                          </>
                        )}
                      </span>
                    </td>

                    {/* 7. DESPACHO / ESTADO PLANTA */}
                    <td className="py-3.5 px-3.5 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase ${
                          esEntregado
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                            : 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/30'
                        }`}
                      >
                        <Truck className="w-3 h-3" />
                        {esEntregado ? 'ENTREGADO' : 'PEND. PLANTA'}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
