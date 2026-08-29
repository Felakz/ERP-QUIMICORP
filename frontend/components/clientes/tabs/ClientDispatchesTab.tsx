'use client';

import React from 'react';
import { ClientExtended } from '@/types/clientes';

interface ClientDispatchesTabProps {
  cliente: ClientExtended;
  isDark: boolean;
}

export const ClientDispatchesTab: React.FC<ClientDispatchesTabProps> = ({ cliente, isDark }) => {
  const textValue = isDark ? 'text-white' : 'text-slate-900';
  const tableHeaderBg = isDark ? 'bg-[#151D2A]/80 text-slate-400 border-slate-800' : 'bg-slate-100 text-slate-600 border-slate-200';
  const tableRowHover = isDark ? 'hover:bg-[#151D2A]' : 'hover:bg-slate-50';

  return (
    <div className="space-y-4">
      <h3 className={`text-sm font-bold ${textValue}`}>Historial de Guías & Despachos de Planta</h3>
      <div className={`overflow-x-auto rounded-xl border ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
        <table className="w-full text-left text-xs">
          <thead>
            <tr className={`border-b ${tableHeaderBg} text-[10px] font-bold uppercase`}>
              <th className="py-2.5 px-3">GUÍA DE REMISIÓN</th>
              <th className="py-2.5 px-3">FECHA ENVÍO</th>
              <th className="py-2.5 px-3">TRANSPORTE ASIGNADO</th>
              <th className="py-2.5 px-3">DESTINO DESPACHO</th>
              <th className="py-2.5 px-3 text-center">ESTADO ENTREGA</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDark ? 'divide-slate-800/40' : 'divide-slate-200'} font-mono`}>
            {(!cliente.despachosHistory || cliente.despachosHistory.length === 0) ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-500 font-sans italic text-xs">
                  No hay guías de despacho ni envíos registrados para este cliente.
                </td>
              </tr>
            ) : (
              cliente.despachosHistory.map((desp, i) => (
                <tr key={i} className={tableRowHover}>
                  <td className="py-3 px-3 font-bold text-indigo-600 dark:text-indigo-400">{desp.guia}</td>
                  <td className={`py-3 px-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{desp.fecha}</td>
                  <td className={`py-3 px-3 font-semibold ${textValue}`}>{desp.transporte}</td>
                  <td className={`py-3 px-3 font-sans ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{desp.destino}</td>
                  <td className="py-3 px-3 text-center">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                      {desp.estado}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
