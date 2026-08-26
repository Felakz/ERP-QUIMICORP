'use client';

import React from 'react';
import { Building2, Plus } from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';

export default function AdministracionProveedoresPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const cardBg = isDark ? 'bg-[#0F141C] border-[#1A2232]' : 'bg-white border-slate-200 shadow-sm';

  const proveedoresMock = [
    { ruc: '20100047218', razonSocial: 'QUÍMICA SUIZA S.A.C.', contacto: 'Ing. Carlos Mendoza', telefono: '+51 987 654 321', insumo: 'Glicerina USP 99.5%' },
    { ruc: '20501234567', razonSocial: 'INVERSIONES QUÍMICAS DEL PERÚ', contacto: 'Lic. María Torres', telefono: '+51 912 345 678', insumo: 'Texapon N70 / Lauril Éter' },
    { ruc: '20609876543', razonSocial: 'DISTRIBUIDORA INDUSTRIAL LIMA', contacto: 'Pedro Gomez', telefono: '+51 999 888 777', insumo: 'Esencia de Salmón / Colorantes' },
  ];

  return (
    <div className="space-y-6 font-sans">
      <div className={`p-6 rounded-2xl border flex items-center justify-between gap-4 ${cardBg}`}>
        <div>
          <h1 className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Directorio de Proveedores & Insumos Químicos
          </h1>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Gestión de homologación, libro mayor y órdenes de compra de materia prima.
          </p>
        </div>
        <button className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-md">
          <Plus className="w-4 h-4" />
          <span>+ Registrar Nuevo Proveedor</span>
        </button>
      </div>

      <div className={`p-4 rounded-2xl border ${cardBg}`}>
        <table className="w-full text-left text-xs">
          <thead>
            <tr className={`border-b text-[10px] font-bold uppercase tracking-wider ${isDark ? 'border-[#1A2232] text-slate-400' : 'border-slate-200 text-slate-500'}`}>
              <th className="py-3 px-3">RUC</th>
              <th className="py-3 px-3">RAZÓN SOCIAL</th>
              <th className="py-3 px-3">CONTACTO</th>
              <th className="py-3 px-3">TELÉFONO</th>
              <th className="py-3 px-3">INSUMO PRINCIPAL</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/20">
            {proveedoresMock.map((prov, i) => (
              <tr key={i} className={isDark ? 'hover:bg-[#151D2A]' : 'hover:bg-slate-50'}>
                <td className="py-3 px-3 font-mono font-bold text-blue-400">{prov.ruc}</td>
                <td className="py-3 px-3 font-bold">{prov.razonSocial}</td>
                <td className="py-3 px-3 text-slate-400">{prov.contacto}</td>
                <td className="py-3 px-3 font-mono">{prov.telefono}</td>
                <td className="py-3 px-3 font-semibold text-amber-400">{prov.insumo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
