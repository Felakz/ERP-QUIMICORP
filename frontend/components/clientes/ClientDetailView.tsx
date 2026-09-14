'use client';

import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Building2,
  Package,
  FileText,
  Wallet,
  Truck,
  CheckCircle2,
  CreditCard,
  DollarSign,
  MapPin,
  RefreshCw,
  Pencil,
} from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';
import { apiFetch } from '@/lib/apiClient';
import { ClientExtended, ClientDetailTab } from '@/types/clientes';
import { EditarClienteModal } from '../modals/EditarClienteModal';

// Tab Subcomponents
import { ClientGeneralTab } from './tabs/ClientGeneralTab';
import { ClientOrdersTab } from './tabs/ClientOrdersTab';
import { ClientInvoicesTab } from './tabs/ClientInvoicesTab';
import { ClientPaymentsTab } from './tabs/ClientPaymentsTab';
import { ClientDispatchesTab } from './tabs/ClientDispatchesTab';

interface ClientDetailViewProps {
  cliente: ClientExtended;
  onBack: () => void;
}

export const ClientDetailView: React.FC<ClientDetailViewProps> = ({
  cliente,
  onBack,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [currentClient, setCurrentClient] = useState<ClientExtended>(cliente);
  const [activeTab, setActiveTab] = useState<ClientDetailTab>('general');
  const [loadingDetail, setLoadingDetail] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  const fetchClientDetail = async () => {
    setLoadingDetail(true);
    try {
      const { data, ok } = await apiFetch<ClientExtended>(`/clientes/${cliente.id}`);
      if (ok && data) {
        setCurrentClient(data);
      }
    } catch (e) {
      console.error('Error fetching client detail:', e);
    } finally {
      setLoadingDetail(false);
    }
  };

  useEffect(() => {
    fetchClientDetail();
  }, [cliente.id]);

  const cardBg = isDark ? 'bg-[#0F141C] border-[#1A2232]' : 'bg-white border-slate-200 shadow-sm';
  const textValue = isDark ? 'text-white' : 'text-slate-900';

  const activeCliente = currentClient || cliente;
  const metrics = activeCliente.metrics || {
    totalVolumenKgLt: 0,
    totalFacturadoPen: 0,
    totalPagadoPen: 0,
    saldoPendientePen: 0,
    totalPedidosCount: 0,
    totalFacturasCount: 0,
  };

  return (
    <div className="space-y-6">
      {/* Header & Botón Regresar */}
      <div className={`p-6 rounded-2xl border ${cardBg} space-y-4`}>
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-xs font-bold transition-all border border-blue-500/20"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a Cartera 360°</span>
          </button>

          <span
            className={`px-3 py-1 rounded-full text-xs font-bold font-mono ${
              cliente.estado === 'CON_SALDO'
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                : cliente.estado === 'INACTIVO'
                ? 'bg-slate-500/10 text-slate-400 border border-slate-500/30'
                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
            }`}
          >
            {cliente.estado || 'ACTIVO'}
          </span>

          <button
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs font-bold transition-all border border-amber-500/30"
          >
            <Pencil className="w-4 h-4" />
            <span>Editar Cliente</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg">
              {cliente.razonSocial.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30">
                  {cliente.ruc.startsWith('SIN-RUC') ? 'SIN RUC' : `RUC ${cliente.ruc}`}
                </span>
                <span className="text-xs font-mono text-slate-400">ID: {cliente.id.substring(0, 8)}</span>
              </div>
              <h1 className={`text-xl font-black mt-1 ${textValue}`}>{cliente.razonSocial}</h1>
              <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>{cliente.direccion || 'Dirección fiscal no especificada'}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Tarjetas Métricas Superiores Kanakku 360° */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`p-5 rounded-2xl border space-y-2 ${cardBg}`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">VOLUMEN COMPRADO</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <h3 className={`text-2xl font-black font-mono ${textValue}`}>
            {metrics.totalVolumenKgLt.toLocaleString('es-PE')} <span className="text-sm font-normal text-slate-400">KG</span>
          </h3>
          <p className="text-[10px] text-slate-500">Histórico de lotes producidos</p>
        </div>

        <div className={`p-5 rounded-2xl border space-y-2 ${cardBg}`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">FACTURACIÓN TOTAL</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <h3 className={`text-2xl font-black font-mono ${textValue}`}>
            S/ {metrics.totalFacturadoPen.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
          </h3>
          <p className="text-[10px] text-slate-500">Total facturas y boletas emitidas</p>
        </div>

        <div className={`p-5 rounded-2xl border space-y-2 ${cardBg}`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">TOTAL PAGADO</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-black font-mono text-emerald-400">
            S/ {metrics.totalPagadoPen.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
          </h3>
          <p className="text-[10px] text-slate-500">Abonos conciliados en banco</p>
        </div>

        <div className={`p-5 rounded-2xl border space-y-2 ${cardBg}`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">EQUILIBRIO / SALDO</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-black font-mono text-rose-400">
            S/ {metrics.saldoPendientePen.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
          </h3>
          <p className="text-[10px] text-slate-500">Por cobrar a la fecha</p>
        </div>
      </div>

      {/* Sistema de 5 Pestañas Modulares */}
      <div className={`rounded-2xl border ${cardBg} p-6 space-y-6`}>
        {/* Tab Headers */}
        <div className={`flex items-center gap-2 border-b pb-3 overflow-x-auto ${
          isDark ? 'border-slate-800/60' : 'border-slate-200'
        }`}>
          {[
            { id: 'general', label: 'Descripción General', icon: Building2 },
            { id: 'pedidos', label: 'Pedidos & OPs', icon: Package },
            { id: 'facturas', label: 'Facturas & Comprobantes', icon: FileText },
            { id: 'pagos', label: 'Pagos & Libro Mayor', icon: Wallet },
            { id: 'despachos', label: 'Despachos & Logística', icon: Truck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ClientDetailTab)}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md'
                    : isDark
                    ? 'text-slate-400 hover:text-slate-200 hover:bg-[#151D2A]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Tab Subcomponents */}
        {activeTab === 'general' && <ClientGeneralTab cliente={activeCliente} isDark={isDark} />}
        {activeTab === 'pedidos' && <ClientOrdersTab cliente={activeCliente} isDark={isDark} />}
        {activeTab === 'facturas' && <ClientInvoicesTab cliente={activeCliente} isDark={isDark} />}
        {activeTab === 'pagos' && <ClientPaymentsTab cliente={activeCliente} isDark={isDark} />}
        {activeTab === 'despachos' && <ClientDispatchesTab cliente={activeCliente} isDark={isDark} />}
      </div>

      {/* Modal Editar Cliente */}
      <EditarClienteModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSaved={() => fetchClientDetail()}
        cliente={activeCliente}
      />
    </div>
  );
};
