'use client';

import React from 'react';
import { ClientExtended } from '@/types/clientes';

interface ClientPaymentsTabProps {
  cliente: ClientExtended;
  isDark: boolean;
}

export const ClientPaymentsTab: React.FC<ClientPaymentsTabProps> = ({ cliente, isDark }) => {
  const textValue = isDark ? 'text-white' : 'text-slate-900';
  const tableHeaderBg = isDark ? 'bg-[#151D2A]/80 text-slate-400 border-slate-800' : 'bg-slate-100 text-slate-600 border-slate-200';
  const tableRowHover = isDark ? 'hover:bg-[#151D2A]' : 'hover:bg-slate-50';

  return (
    <div className="space-y-4">
      <h3 className={`text-sm font-bold ${textValue}`}>Historial de Abonos Bancarios & Conciliación</h3>
      <div className={`overflow-x-auto rounded-xl border ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
        <table className="w-full text-left text-xs">
          <thead>
            <tr className={`border-b ${tableHeaderBg} text-[10px] font-bold uppercase`}>
              <th className="py-2.5 px-3">FECHA ABONO</th>
              <th className="py-2.5 px-3">BANCO DESTINO</th>
              <th className="py-2.5 px-3">N° OPERACIÓN</th>
              <th className="py-2.5 px-3 text-right">MONTO ABONADO</th>
              <th className="py-2.5 px-3 text-center">MÉTODO PAGO</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDark ? 'divide-slate-800/40' : 'divide-slate-200'} font-mono`}>
            {(!cliente.pagosHistory || cliente.pagosHistory.length === 0) ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-500 font-sans italic text-xs">
                  No hay abonos ni pagos registrados para este cliente.
                </td>
              </tr>
            ) : (
              cliente.pagosHistory.map((pago, i) => (
                <tr key={i} className={tableRowHover}>
                  <td className={`py-3 px-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{pago.fecha}</td>
                  <td className="py-3 px-3 font-bold text-blue-600 dark:text-blue-400">{pago.banco}</td>
                  <td className={`py-3 px-3 font-semibold ${textValue}`}>{pago.op}</td>
                  <td className="py-3 px-3 text-right font-black text-emerald-600 dark:text-emerald-400">S/ {pago.monto.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</td>
                  <td className={`py-3 px-3 text-center ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{pago.metodo}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
