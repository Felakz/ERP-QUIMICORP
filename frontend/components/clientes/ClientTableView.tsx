'use client';

import React from 'react';
import {
  Building2,
  Phone,
  BookOpen,
  Eye,
  MoreVertical,
  ShieldCheck,
  CreditCard,
  MessageSquare,
} from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';
import { ClientExtended } from '@/types/clientes';

interface ClientTableViewProps {
  clientes: ClientExtended[];
  onSelectClient: (id: string) => void;
  onOpenLedger?: (cliente: ClientExtended) => void;
}

export const ClientTableView: React.FC<ClientTableViewProps> = ({
  clientes,
  onSelectClient,
  onOpenLedger,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const cardBg = isDark ? 'bg-[#0F141C] border-[#1A2232]' : 'bg-white border-slate-200 shadow-sm';
  const textValue = isDark ? 'text-white' : 'text-slate-900';

  if (clientes.length === 0) {
    return (
      <div className={`p-8 text-center rounded-2xl border ${cardBg}`}>
        <p className="text-xs text-slate-400">No se encontraron empresas con los filtros aplicados.</p>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border overflow-hidden ${cardBg}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr
              className={`border-b text-[10px] font-bold uppercase tracking-wider ${
                isDark ? 'border-[#1A2232] text-slate-400 bg-[#151D2A]/60' : 'border-slate-200 text-slate-500 bg-slate-50'
              }`}
            >
              <th className="py-3.5 px-4">CLIENTE / RAZÓN SOCIAL</th>
              <th className="py-3.5 px-4">RUC</th>
              <th className="py-3.5 px-4">CONTACTO PRINCIPAL</th>
              <th className="py-3.5 px-4">CONDICIÓN DE PAGO</th>
              <th className="py-3.5 px-4 text-right">TOTAL FACTURADO</th>
              <th className="py-3.5 px-4 text-right">EQUILIBRIO / SALDO</th>
              <th className="py-3.5 px-4 text-center">ESTADO</th>
              <th className="py-3.5 px-4 text-right">ACCIONES</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/20">
            {clientes.map((empresa) => {
              const repPrincipal =
                empresa.contactos?.find((c) => c.esPrincipal) ||
                empresa.contactos?.[0] ||
                (empresa.contacto
                  ? { nombre: empresa.contacto, telefono: empresa.telefono, cargo: 'Contacto' }
                  : null);

              const totalFacturado = empresa.metrics?.totalFacturadoPen || 0;
              const saldoPendiente = empresa.metrics?.saldoPendientePen || 0;

              const cleanPhone = repPrincipal?.telefono
                ? repPrincipal.telefono.replace(/\D/g, '')
                : '';

              return (
                <tr
                  key={empresa.id}
                  onClick={() => onSelectClient(empresa.id)}
                  className={`cursor-pointer transition-all ${
                    isDark ? 'hover:bg-[#151D2A]' : 'hover:bg-slate-50'
                  }`}
                >
                  {/* Cliente / Razón Social */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-md shrink-0">
                        {empresa.razonSocial.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <span className={`font-bold block truncate text-xs ${textValue}`}>
                          {empresa.razonSocial}
                        </span>
                        <span className="text-[10px] text-slate-500 truncate block">
                          {empresa.direccion || 'Sin dirección fiscal'}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* RUC */}
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-600 dark:text-blue-400 text-xs">
                    {empresa.ruc.startsWith('SIN-RUC') || empresa.ruc === '-' ? 'NO RUC' : empresa.ruc}
                  </td>

                  {/* Contacto Principal */}
                  <td className="py-3.5 px-4">
                    {repPrincipal ? (
                      <div className="space-y-0.5">
                        <span className={`font-semibold block ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>{repPrincipal.nombre}</span>
                        {repPrincipal.telefono && (
                          <a
                            href={`https://wa.me/51${cleanPhone}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                          >
                            <MessageSquare className="w-3 h-3" />
                            <span>{repPrincipal.telefono}</span>
                          </a>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-500 italic text-[11px]">Sin representante</span>
                    )}
                  </td>

                  {/* Condición de Pago */}
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 inline-flex items-center gap-1">
                      <CreditCard className="w-3 h-3" />
                      {empresa.condicionPago || 'Contado'}
                    </span>
                  </td>

                  {/* Total Facturado */}
                  <td className={`py-3.5 px-4 text-right font-mono font-black ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                    S/ {totalFacturado.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                  </td>

                  {/* Saldo Pendiente / Equilibrio */}
                  <td className="py-3.5 px-4 text-right font-mono font-black">
                    {saldoPendiente > 0 ? (
                      <span className="text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                        S/ {saldoPendiente.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                      </span>
                    ) : (
                      <span className="text-emerald-600 dark:text-emerald-400">S/ 0.00</span>
                    )}
                  </td>

                  {/* Estado */}
                  <td className="py-3.5 px-4 text-center">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 inline-flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      <span>{empresa.estado || 'ACTIVO'}</span>
                    </span>
                  </td>

                  {/* Acciones */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onSelectClient(empresa.id)}
                        className="px-2.5 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] font-bold flex items-center gap-1 transition-colors"
                        title="Ver Expediente 360°"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Detalle</span>
                      </button>

                      <button
                        onClick={() => onSelectClient(empresa.id)}
                        className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold flex items-center gap-1 transition-colors"
                        title="Libro Mayor"
                      >
                        <BookOpen className="w-3 h-3" />
                        <span>Libro Mayor</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
