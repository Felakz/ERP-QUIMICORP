'use client';

import React from 'react';
import {
  Building2,
  UserCheck,
  CreditCard,
  Truck,
  MessageSquare,
  Phone,
} from 'lucide-react';
import { ClientExtended } from '@/types/clientes';

interface ClientGeneralTabProps {
  cliente: ClientExtended;
  isDark: boolean;
}

export const ClientGeneralTab: React.FC<ClientGeneralTabProps> = ({ cliente, isDark }) => {
  const textValue = isDark ? 'text-white' : 'text-slate-900';
  const labelColor = isDark ? 'text-slate-400' : 'text-slate-500 font-bold';
  const textBody = isDark ? 'text-slate-200' : 'text-slate-800';
  const inputBg = isDark
    ? 'bg-[#151D2A] border-[#1A2232]'
    : 'bg-slate-50 border-slate-200 text-slate-900';
  const repCardBg = isDark
    ? 'bg-[#151D2A] border-[#1A2232]'
    : 'bg-white border-slate-200 shadow-sm';

  const representants = cliente.contactos || [
    {
      id: 'r-default',
      nombre: cliente.contacto || 'Representante Principal',
      cargo: 'Gerente de Compras',
      telefono: cliente.telefono || '',
      esPrincipal: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Columna Izquierda: Datos Fiscales & Representantes */}
      <div className="lg:col-span-7 space-y-6">
        <div className="space-y-3">
          <h3 className={`text-sm font-bold flex items-center gap-2 ${textValue}`}>
            <Building2 className="w-4 h-4 text-blue-400" /> Datos Fiscales & Ubicación
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className={`p-3.5 rounded-xl border ${inputBg}`}>
              <span className={`text-[10px] block font-mono ${labelColor}`}>RAZÓN SOCIAL</span>
              <span className={`font-bold mt-1 block ${textValue}`}>{cliente.razonSocial}</span>
            </div>
            <div className={`p-3.5 rounded-xl border ${inputBg}`}>
              <span className={`text-[10px] block font-mono ${labelColor}`}>RUC JURÍDICO</span>
              <span className="font-mono font-bold text-blue-500 mt-1 block">{cliente.ruc}</span>
            </div>
            <div className={`p-3.5 rounded-xl border sm:col-span-2 ${inputBg}`}>
              <span className={`text-[10px] block font-mono ${labelColor}`}>DIRECCIÓN FISCAL DE FACTURACIÓN</span>
              <span className={`font-semibold mt-1 block ${textBody}`}>{cliente.direccion || 'Sin dirección fiscal'}</span>
            </div>
            <div className={`p-3.5 rounded-xl border sm:col-span-2 ${inputBg}`}>
              <span className={`text-[10px] block font-mono ${labelColor}`}>DIRECCIÓN DE DESPACHO / PLANTA CLIENTE</span>
              <span className={`font-semibold mt-1 block ${textBody}`}>{cliente.direccionDespacho || cliente.direccion || 'Igual a Dirección Fiscal'}</span>
            </div>
          </div>
        </div>

        <div className={`space-y-3 pt-4 border-t ${isDark ? 'border-slate-800/60' : 'border-slate-200'}`}>
          <h3 className={`text-sm font-bold flex items-center gap-2 ${textValue}`}>
            <UserCheck className="w-4 h-4 text-cyan-500" /> Directorio de Representantes (1:N)
          </h3>
          <div className="space-y-2.5">
            {representants.map((rep, idx) => (
              <div
                key={rep.id || idx}
                className={`p-4 rounded-xl border flex items-center justify-between text-xs ${repCardBg}`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`font-bold text-sm ${textValue}`}>{rep.nombre}</span>
                    {rep.esPrincipal && (
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30">
                        REPRESENTANTE PRINCIPAL
                      </span>
                    )}
                  </div>
                  <span className={`text-xs block ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{rep.cargo || 'Encargado Comercial'}</span>
                </div>

                {rep.telefono && (
                  <div className="flex items-center gap-2">
                    <a
                      href={`https://wa.me/51${rep.telefono.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                    <a
                      href={`tel:${rep.telefono}`}
                      className="px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{rep.telefono}</span>
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Columna Derecha: Configuración Comercial & Logística */}
      <div className="lg:col-span-5 space-y-6">
        <div className="space-y-3">
          <h3 className={`text-sm font-bold flex items-center gap-2 ${textValue}`}>
            <CreditCard className="w-4 h-4 text-amber-500" /> Configuración Comercial & Pago
          </h3>
          <div className="space-y-3 text-xs">
            <div className={`p-4 rounded-xl border space-y-2 ${inputBg}`}>
              <span className={`text-[10px] block font-mono ${labelColor}`}>CONDICIÓN DE PAGO PREDETERMINADA</span>
              <span className="text-base font-black text-amber-500 dark:text-amber-400 block font-mono">
                {cliente.condicionPago || 'Contado'}
              </span>
              <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Línea de crédito autorizada por la Gerencia Administrativa.</p>
            </div>

            <div className={`p-4 rounded-xl border space-y-2 ${inputBg}`}>
              <span className={`text-[10px] block font-mono ${labelColor}`}>MODALIDAD DE DESPACHO / TRANSPORTE</span>
              <span className={`text-sm font-bold flex items-center gap-2 ${isDark ? 'text-indigo-300' : 'text-indigo-700'}`}>
                <Truck className="w-4 h-4 text-indigo-500" />
                {cliente.metodoEnvio || 'INDRIVER / REGULAR'}
              </span>
            </div>

            <div className={`p-4 rounded-xl border space-y-2 ${inputBg}`}>
              <span className={`text-[10px] block font-mono ${labelColor}`}>MONEDA PREFERIDA</span>
              <span className={`text-sm font-bold ${textValue}`}>Soles Peruanos (PEN / S/)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
