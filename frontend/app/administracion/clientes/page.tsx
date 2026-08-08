'use client';

import React, { useState } from 'react';
import {
  Building2,
  Users,
  Search,
  Plus,
  Mail,
  Phone,
  MapPin,
  FileText,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';

interface Cliente {
  id: string;
  ruc: string;
  razonSocial: string;
  contacto: string;
  telefono: string;
  email: string;
  direccion: string;
  limiteCredito: number;
  saldoPendiente: number;
  estado: 'ACTIVO' | 'EN_REVISION' | 'BLOQUEADO';
  pedidosCount: number;
}

const CLIENTES_DATA: Cliente[] = [
  {
    id: 'CLI-001',
    ruc: '20614697321',
    razonSocial: 'GEYMA S.A.C.',
    contacto: 'Carlos Mendoza',
    telefono: '+51 998 234 567',
    email: 'compras@geymasa.pe',
    direccion: 'Av. Industrial 342, Ate, Lima',
    limiteCredito: 150000.0,
    saldoPendiente: 14717.5,
    estado: 'ACTIVO',
    pedidosCount: 12,
  },
  {
    id: 'CLI-002',
    ruc: '20381396431',
    razonSocial: 'FARMACIAS PERUANAS S.A.C.',
    contacto: 'Ing. Rodrigo Salcedo',
    telefono: '+51 999 234 781',
    email: 'rsalcedo@farmaciasperuanas.pe',
    direccion: 'Av. Angamos Este 2646, Surquillo, Lima',
    limiteCredito: 250000.0,
    saldoPendiente: 42500.0,
    estado: 'ACTIVO',
    pedidosCount: 28,
  },
  {
    id: 'CLI-003',
    ruc: '20504648087',
    razonSocial: 'ALFALION CORP. S.A.',
    contacto: 'Lic. Diana Vargas',
    telefono: '+51 987 654 321',
    email: 'dvargas@alfalion.com',
    direccion: 'Jr. Natalio Sánchez 220, Jesús María, Lima',
    limiteCredito: 80000.0,
    saldoPendiente: 0.0,
    estado: 'ACTIVO',
    pedidosCount: 8,
  },
  {
    id: 'CLI-004',
    ruc: '20601234567',
    razonSocial: 'AUSTIN COSMETICS PERÚ',
    contacto: 'Ing. Carlos Austin',
    telefono: '+51 912 345 678',
    email: 'caustin@austincosmetics.pe',
    direccion: 'Av. Industrial 450, Ate, Lima',
    limiteCredito: 120000.0,
    saldoPendiente: 32500.0,
    estado: 'ACTIVO',
    pedidosCount: 15,
  },
];

export default function CarteraClientesPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [search, setSearch] = useState('');
  const [selectedEstado, setSelectedEstado] = useState('TODOS');

  const cardBg = isDark ? 'bg-[#0F141C] border-[#1A2232]' : 'bg-white border-slate-200 shadow-sm';
  const textTitle = isDark ? 'text-slate-400' : 'text-slate-600';
  const textValue = isDark ? 'text-white' : 'text-slate-900';
  const inputBg = isDark
    ? 'bg-[#151D2A] border-[#1A2232] text-slate-200 placeholder-slate-500'
    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400';

  const clientesFiltrados = CLIENTES_DATA.filter((c) => {
    const matchSearch =
      !search.trim() ||
      c.razonSocial.toLowerCase().includes(search.toLowerCase()) ||
      c.ruc.includes(search) ||
      c.contacto.toLowerCase().includes(search.toLowerCase());
    const matchEstado = selectedEstado === 'TODOS' || c.estado === selectedEstado;
    return matchSearch && matchEstado;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`p-5 rounded-2xl border flex flex-wrap items-center justify-between gap-4 ${cardBg}`}>
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/30">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className={`text-lg font-black font-sans tracking-tight ${textValue}`}>
              Cartera de Clientes & Línea de Crédito
            </h1>
            <p className={`text-xs font-sans ${textTitle}`}>
              Directorio comercial corporativo, acuerdos de pago y límites de crédito aprobados.
            </p>
          </div>
        </div>

        <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-500/20 font-sans">
          <Plus className="w-4 h-4" />
          <span>Registrar Nuevo Cliente</span>
        </button>
      </div>

      {/* 4 KPIs Superiores */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className={`rounded-2xl p-4 border space-y-1 ${cardBg}`}>
          <span className={`text-[10px] font-bold tracking-widest uppercase font-sans ${textTitle}`}>TOTAL CLIENTES</span>
          <p className={`text-2xl font-black font-mono text-blue-400`}>{CLIENTES_DATA.length}</p>
          <span className="text-[10px] text-slate-500 font-sans">Cartera activa</span>
        </div>

        <div className={`rounded-2xl p-4 border space-y-1 ${cardBg}`}>
          <span className={`text-[10px] font-bold tracking-widest uppercase font-sans ${textTitle}`}>LÍNEA TOTAL AUTORIZADA</span>
          <p className={`text-2xl font-black font-mono text-emerald-400`}>S/ 600,000</p>
          <span className="text-[10px] text-slate-500 font-sans">Evaluación crediticia</span>
        </div>

        <div className={`rounded-2xl p-4 border space-y-1 ${cardBg}`}>
          <span className={`text-[10px] font-bold tracking-widest uppercase font-sans ${textTitle}`}>CRÉDITO VIGENTE</span>
          <p className={`text-2xl font-black font-mono text-amber-400`}>S/ 89,717.50</p>
          <span className="text-[10px] text-slate-500 font-sans">En órdenes y facturas</span>
        </div>

        <div className={`rounded-2xl p-4 border space-y-1 ${cardBg}`}>
          <span className={`text-[10px] font-bold tracking-widest uppercase font-sans ${textTitle}`}>ESTADO FINANCIERO</span>
          <p className={`text-2xl font-black font-mono text-cyan-400`}>100% OK</p>
          <span className="text-[10px] text-slate-500 font-sans">Sin moras críticas</span>
        </div>
      </div>

      {/* Barra de Filtros */}
      <div className={`p-4 rounded-xl border flex flex-wrap items-center justify-between gap-4 ${cardBg}`}>
        <div className="flex items-center gap-3 flex-1 min-w-[240px]">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar por Razón Social, RUC o Contacto..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full pl-9 pr-3 py-1.5 rounded-lg border text-xs font-sans ${inputBg}`}
            />
          </div>
        </div>
      </div>

      {/* Grid de Tarjetas de Clientes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {clientesFiltrados.map((cliente) => (
          <div key={cliente.id} className={`rounded-2xl p-5 border space-y-4 transition-all hover:shadow-md ${cardBg}`}>
            <div className="flex items-start justify-between gap-3 border-b pb-3 border-slate-800/60">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30">
                    RUC {cliente.ruc}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase font-sans bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    {cliente.estado}
                  </span>
                </div>
                <h3 className={`text-base font-black font-sans mt-1 ${textValue}`}>{cliente.razonSocial}</h3>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 block uppercase font-mono">Pedidos Registrados</span>
                <span className="text-sm font-black font-mono text-cyan-400">{cliente.pedidosCount} O.C.</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-sans">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 block">CONTACTO PRINCIPAL</span>
                <div className="flex items-center gap-1.5 font-medium text-slate-300">
                  <Users className="w-3.5 h-3.5 text-blue-400" />
                  <span>{cliente.contacto}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 block">TELÉFONO</span>
                <div className="flex items-center gap-1.5 font-mono text-slate-300">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{cliente.telefono}</span>
                </div>
              </div>

              <div className="space-y-1 col-span-2">
                <span className="text-[10px] text-slate-400 block">DIRECCIÓN FISCAL Y DESPACHO</span>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="truncate">{cliente.direccion}</span>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#151D2A] border border-[#1A2232] flex items-center justify-between text-xs font-mono">
              <div>
                <span className="text-[9px] text-slate-400 block">LÍNEA DE CRÉDITO</span>
                <span className="font-bold text-slate-200">S/ {cliente.limiteCredito.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="text-right">
                <span className="text-[9px] text-slate-400 block">SALDO POR COBRAR</span>
                <span className={`font-bold ${cliente.saldoPendiente > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  S/ {cliente.saldoPendiente.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
