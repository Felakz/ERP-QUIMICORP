'use client';

import React from 'react';
import { ClientExtended } from '@/types/clientes';

interface ClientInvoicesTabProps {
  cliente: ClientExtended;
  isDark: boolean;
}

export const ClientInvoicesTab: React.FC<ClientInvoicesTabProps> = ({ cliente, isDark }) => {
  const textValue = isDark ? 'text-white' : 'text-slate-900';
  const tableHeaderBg = isDark ? 'bg-[#151D2A]/80 text-slate-400 border-slate-800' : 'bg-slate-100 text-slate-600 border-slate-200';
  const tableRowHover = isDark ? 'hover:bg-[#151D2A]' : 'hover:bg-slate-50';

  return (
    <div className="space-y-4">
      <h3 className={`text-sm font-bold ${textValue}`}>Historial de Facturas & Comprobantes Emitidos</h3>
      <div className={`overflow-x-auto rounded-xl border ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
        <table className="w-full text-left text-xs">
          <thead>
            <tr className={`border-b ${tableHeaderBg} text-[10px] font-bold uppercase`}>
              <th className="py-2.5 px-3">COMPROBANTE</th>
              <th className="py-2.5 px-3">TIPO</th>
              <th className="py-2.5 px-3">FECHA EMISIÓN</th>
              <th className="py-2.5 px-3">VENCIMIENTO</th>
              <th className="py-2.5 px-3 text-right">MONTO TOTAL</th>
              <th className="py-2.5 px-3 text-right">SALDO PENDIENTE</th>
              <th className="py-2.5 px-3 text-center">ESTADO COBRO</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDark ? 'divide-slate-800/40' : 'divide-slate-200'} font-mono`}>
            {(!cliente.facturasHistory || cliente.facturasHistory.length === 0) ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-500 font-sans italic text-xs">
                  No hay facturas ni comprobantes emitidos para este cliente.
                </td>
              </tr>
            ) : (
              cliente.facturasHistory.map((fac, i) => (
                <tr key={i} className={tableRowHover}>
                  <td className="py-3 px-3 font-bold text-blue-600 dark:text-blue-400">{fac.doc}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border ${
                      fac.tipo === 'FACTURA'
                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                        : fac.tipo === 'BOLETA'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : fac.tipo === 'NOTA_VENTA'
                        ? 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                        : 'bg-slate-500/10 text-slate-400 border-slate-500/30'
                    }`}>
                      {fac.tipo || 'N/A'}
                    </span>
                  </td>
                  <td className={`py-3 px-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{fac.emision}</td>
                  <td className={`py-3 px-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{fac.venc}</td>
                  <td className={`py-3 px-3 text-right font-bold ${textValue}`}>S/ {fac.monto.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</td>
                  <td className="py-3 px-3 text-right font-black text-rose-600 dark:text-rose-400">S/ {fac.saldo.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</td>
                  <td className="py-3 px-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                      fac.estado === 'PAGADO' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                    }`}>
                      {fac.estado}
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
