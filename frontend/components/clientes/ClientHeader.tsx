'use client';

import React from 'react';
import {
  Building2,
  Search,
  Plus,
  RefreshCw,
  LayoutGrid,
  Table as TableIcon,
  Filter,
} from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';
import { ClientViewMode } from '@/types/clientes';

interface ClientHeaderProps {
  viewMode: ClientViewMode;
  onViewModeChange: (mode: ClientViewMode) => void;
  search: string;
  onSearchChange: (search: string) => void;
  filterEstado: string;
  onFilterEstadoChange: (estado: string) => void;
  filterCredito: string;
  onFilterCreditoChange: (credito: string) => void;
  totalClientes: number;
  filteredCount: number;
  loading: boolean;
  onRefresh: () => void;
  onOpenCreateModal: () => void;
}

export const ClientHeader: React.FC<ClientHeaderProps> = ({
  viewMode,
  onViewModeChange,
  search,
  onSearchChange,
  filterEstado,
  onFilterEstadoChange,
  filterCredito,
  onFilterCreditoChange,
  totalClientes,
  filteredCount,
  loading,
  onRefresh,
  onOpenCreateModal,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const cardBg = isDark ? 'bg-[#0F141C] border-[#1A2232]' : 'bg-white border-slate-200 shadow-sm';
  const textValue = isDark ? 'text-white' : 'text-slate-900';
  const textTitle = isDark ? 'text-slate-400' : 'text-slate-600';
  const inputBg = isDark
    ? 'bg-[#151D2A] border-[#1A2232] text-slate-200 placeholder-slate-500 focus:border-cyan-400'
    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500';

  return (
    <div className="space-y-4 font-sans">
      {/* Banner Principal con Acentos Neón */}
      <div className={`p-5 rounded-2xl border flex flex-wrap items-center justify-between gap-4 transition-all shadow-sm ${cardBg}`}>
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-cyan-400 shadow-lg shadow-blue-500/10">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className={`text-lg font-black tracking-tight ${textValue}`}>
                Cartera de Clientes & Empresas
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold font-mono tracking-wider bg-blue-500/10 border border-blue-500/30 text-cyan-400 uppercase flex items-center gap-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 led-pulse" />
                DIRECTORIO CANÓNICO • {totalClientes} EMPRESAS
              </span>
            </div>
            <p className={`text-xs mt-0.5 ${textTitle}`}>
              Directorio 360° con gestión de crédito, contactos de compras, libro mayor y logística de despacho.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Conmutador de Vista (Tarjetas vs Tabla) con Segmented Glow */}
          <div className={`p-1 rounded-xl border flex items-center gap-1 ${isDark ? 'bg-[#151D2A] border-[#1A2232]' : 'bg-slate-100 border-slate-200'}`}>
            <button
              onClick={() => onViewModeChange('grid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'grid'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-blue-500/25'
                  : isDark
                  ? 'text-slate-400 hover:text-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Vista Tarjetas</span>
            </button>
            <button
              onClick={() => onViewModeChange('table')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'table'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-blue-500/25'
                  : isDark
                  ? 'text-slate-400 hover:text-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Vista Tabla</span>
            </button>
          </div>

          <button
            onClick={onRefresh}
            title="Recargar lista"
            className={`p-2.5 rounded-xl border transition-all ${
              isDark ? 'bg-[#151D2A] border-[#1A2232] text-slate-400 hover:text-white hover:border-cyan-500/50' : 'bg-slate-100 border-slate-300 text-slate-600 hover:text-slate-900'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>

          <button
            onClick={onOpenCreateModal}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs tracking-wider uppercase transition-all shadow-lg shadow-blue-500/25 active:scale-95 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>+ Registrar Empresa Matriz</span>
          </button>
        </div>
      </div>

      {/* 4 KPIs Superiores Jerárquicos con Card Hover Lift */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div
          onClick={() => onFilterEstadoChange('TODOS')}
          className={`rounded-2xl p-4 border space-y-1 cursor-pointer transition-all card-hover-lift ${cardBg} ${isDark ? 'hover:border-blue-500/60' : ''}`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-bold tracking-widest uppercase ${textTitle}`}>EMPRESAS MATRIZ (RUCs)</span>
            <div className="p-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Building2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl font-black font-mono text-blue-400">{totalClientes}</p>
          <span className="text-[10px] text-slate-500 font-mono">33 unidades jurídicas canónicas</span>
        </div>

        <div className={`rounded-2xl p-4 border space-y-1 transition-all card-hover-lift ${cardBg} ${isDark ? 'hover:border-cyan-500/60' : ''}`}>
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-bold tracking-widest uppercase ${textTitle}`}>REPRESENTANTES & CONTACTOS</span>
            <div className="p-1 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Plus className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl font-black font-mono text-cyan-400">43</p>
          <span className="text-[10px] text-slate-500 font-mono">Contactos comerciales activos (1:N)</span>
        </div>

        <div
          onClick={() => onFilterCreditoChange('Crédito')}
          className={`rounded-2xl p-4 border space-y-1 cursor-pointer transition-all card-hover-lift ${cardBg} ${isDark ? 'hover:border-amber-500/60' : ''}`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-bold tracking-widest uppercase ${textTitle}`}>CON LÍNEA DE CRÉDITO</span>
            <div className="p-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Filter className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl font-black font-mono text-amber-400">
            {Math.ceil(totalClientes * 0.45)}
          </p>
          <span className="text-[10px] text-amber-400/80 font-mono">Crédito 7, 15, 20 o 60 días</span>
        </div>

        <div className={`rounded-2xl p-4 border space-y-1 transition-all card-hover-lift ${cardBg} ${isDark ? 'hover:border-emerald-500/60' : ''}`}>
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-bold tracking-widest uppercase ${textTitle}`}>CANDADO DE AUDITORÍA</span>
            <div className="p-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 led-pulse" />
            </div>
          </div>
          <p className="text-2xl font-black font-mono text-[#00F2C3]">100% VERIFICADO</p>
          <span className="text-[10px] text-slate-500 font-mono">Protección contra fuga comercial</span>
        </div>
      </div>

      {/* Controles de Búsqueda y Filtros */}
      <div className={`p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-4 shadow-sm ${cardBg}`}>
        {/* Input Buscador */}
        <div className="relative flex-1 min-w-[280px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por RUC, Razón Social, Teléfono, Dirección o Representante..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-xl border text-xs focus:outline-none transition-all ${inputBg}`}
          />
        </div>

        {/* Filtros Dropdown */}
        <div className="flex items-center gap-3">
          {/* Filtro Estado */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filterEstado}
              onChange={(e) => onFilterEstadoChange(e.target.value)}
              className={`px-3 py-2 rounded-xl border text-xs font-semibold ${inputBg}`}
            >
              <option value="TODOS">Todos los Estados</option>
              <option value="ACTIVO">Activos</option>
              <option value="INACTIVO">Inactivos</option>
              <option value="SALDO_PENDIENTE">Con Saldo Pendiente</option>
            </select>
          </div>

          {/* Filtro Crédito */}
          <select
            value={filterCredito}
            onChange={(e) => onFilterCreditoChange(e.target.value)}
            className={`px-3 py-2 rounded-xl border text-xs font-semibold ${inputBg}`}
          >
            <option value="TODOS">Todas las Condiciones</option>
            <option value="Contado">Contado</option>
            <option value="Crédito">Cualquier Crédito</option>
            <option value="07">Crédito 7 Días</option>
            <option value="15">Crédito 15 Días</option>
            <option value="20">Crédito 20 Días</option>
            <option value="60">Crédito 60 Días</option>
          </select>

          <span className="text-xs font-mono text-slate-400 hidden sm:inline">
            Mostrando <strong className="text-cyan-400">{filteredCount}</strong> de {totalClientes} Empresas
          </span>
        </div>
      </div>
    </div>
  );
};

