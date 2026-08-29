'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  MapPin,
  Truck,
  CreditCard,
  UserCheck,
  ChevronDown,
  ChevronUp,
  Phone,
  Eye,
  Edit,
} from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';
import { ClientExtended } from '@/types/clientes';

interface ClientGridViewProps {
  clientes: ClientExtended[];
  onSelectClient: (id: string) => void;
  onEditClient?: (cliente: ClientExtended) => void;
}

export const ClientGridView: React.FC<ClientGridViewProps> = ({
  clientes,
  onSelectClient,
  onEditClient,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

  const cardBg = isDark ? 'bg-[#0F141C] border-[#1A2232]' : 'bg-white border-slate-200 shadow-sm';
  const textValue = isDark ? 'text-white' : 'text-slate-900';

  const toggleAccordion = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (clientes.length === 0) {
    return (
      <div className={`p-8 text-center rounded-2xl border ${cardBg}`}>
        <p className="text-xs text-slate-400">No se encontraron empresas ni representantes con el criterio ingresado.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {clientes.map((empresa) => {
        const isExpanded = expandedCards[empresa.id] ?? false;
        const listaContactos =
          empresa.contactos && empresa.contactos.length > 0
            ? empresa.contactos
            : empresa.contacto
            ? [
                {
                  id: 'c1',
                  nombre: empresa.contacto,
                  cargo: 'Contacto Principal',
                  telefono: empresa.telefono,
                  esPrincipal: true,
                },
              ]
            : [];

        return (
          <div
            key={empresa.id}
            onClick={() => onSelectClient(empresa.id)}
            className={`rounded-2xl p-5 border space-y-4 transition-all hover:border-blue-500/50 hover:shadow-lg cursor-pointer flex flex-col justify-between group ${cardBg}`}
          >
            <div className="space-y-3">
              {/* Encabezado de la Tarjeta */}
              <div className={`flex items-start justify-between gap-3 border-b pb-3 ${isDark ? 'border-slate-800/60' : 'border-slate-200'}`}>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30">
                      {empresa.ruc.startsWith('SIN-RUC') || empresa.ruc.startsWith('NO-RUC') || empresa.ruc === '-'
                        ? 'RUC -'
                        : `RUC ${empresa.ruc}`}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      <span>{empresa.estado || 'ACTIVO'}</span>
                    </span>
                  </div>
                  <h3 className={`text-sm font-black mt-1.5 line-clamp-1 group-hover:text-blue-500 transition-colors ${textValue}`}>
                    {empresa.razonSocial}
                  </h3>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectClient(empresa.id);
                  }}
                  className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30 transition-colors"
                  title="Ver Expediente 360°"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Datos Operativos & Logística */}
              <div className="space-y-2.5 text-xs">
                {/* Dirección Fiscal / Despacho */}
                <div className="space-y-0.5">
                  <span className={`text-[10px] block font-mono font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    DIRECCIÓN FISCAL / DESPACHO
                  </span>
                  <div className={`flex items-center gap-1.5 font-medium ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>
                    <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="truncate">{empresa.direccion || 'No registrada'}</span>
                  </div>
                </div>

                {/* Método de Envío / Agencia */}
                <div className="space-y-0.5">
                  <span className={`text-[10px] block font-mono font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    MODALIDAD DE ENVÍO / TRANSPORTE
                  </span>
                  <div className={`flex items-center gap-1.5 font-semibold ${isDark ? 'text-indigo-300' : 'text-indigo-700'}`}>
                    <Truck className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <span>{empresa.metodoEnvio || 'INDRIVER / REGULAR'}</span>
                  </div>
                </div>

                {/* Condición de Pago */}
                <div className={`flex items-center justify-between p-2 rounded-xl border text-xs font-mono ${
                  isDark ? 'bg-[#151D2A] border-[#1A2232]' : 'bg-slate-50 border-slate-200 shadow-sm'
                }`}>
                  <div className="flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-amber-500" />
                    <span className={`text-[10px] font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>CONDICIÓN:</span>
                  </div>
                  <span className={`font-bold ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>{empresa.condicionPago || 'Contado'}</span>
                </div>
              </div>

              {/* Acordeón Desplegable de Representantes */}
              <div className={`pt-2 border-t ${isDark ? 'border-slate-800/60' : 'border-slate-200'}`}>
                <button
                  onClick={(e) => toggleAccordion(empresa.id, e)}
                  className={`w-full flex items-center justify-between p-2 rounded-xl border text-xs transition-colors ${
                    isDark
                      ? 'bg-[#151D2A]/80 hover:bg-[#151D2A] border-[#1A2232]'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                  }`}
                >
                  <div className={`flex items-center gap-2 font-bold ${isDark ? 'text-cyan-400' : 'text-cyan-700'}`}>
                    <UserCheck className="w-4 h-4" />
                    <span>Representantes ({listaContactos.length})</span>
                  </div>
                  <div className={`flex items-center gap-1 text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    <span>{isExpanded ? 'Ocultar' : 'Ver todos'}</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {/* Contenido expandible */}
                {isExpanded && (
                  <div className="mt-2 space-y-2 animate-in fade-in duration-150">
                    {listaContactos.length === 0 ? (
                      <p className="text-[11px] text-slate-500 italic p-2">Sin representantes registrados.</p>
                    ) : (
                      listaContactos.map((cont, idx) => (
                        <div
                          key={cont.id || idx}
                          className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                            isDark ? 'bg-[#151D2A] border-[#1A2232]' : 'bg-white border-slate-200 shadow-sm'
                          }`}
                        >
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5">
                              <span className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>{cont.nombre}</span>
                              {cont.esPrincipal && (
                                <span className="px-1.5 py-0.2 rounded text-[8px] font-bold uppercase bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30">
                                  PRINCIPAL
                                </span>
                              )}
                            </div>
                            <span className={`text-[10px] block ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{cont.cargo || 'Representante'}</span>
                          </div>

                          {cont.telefono && (
                            <a
                              href={`https://wa.me/51${cont.telefono.replace(/\D/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center gap-1 font-mono text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20"
                              title="Chat directo en WhatsApp"
                            >
                              <Phone className="w-3 h-3" />
                              <span>{cont.telefono}</span>
                            </a>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
