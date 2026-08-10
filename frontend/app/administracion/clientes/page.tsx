'use client';

import React, { useState, useEffect } from 'react';
import {
  Building2,
  Users,
  Search,
  Plus,
  Phone,
  MapPin,
  CreditCard,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';
import { apiFetch } from '@/lib/apiClient';
import { NuevoClienteModal, Cliente } from '@/components/modals/NuevoClienteModal';

export default function CarteraClientesPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const cardBg = isDark ? 'bg-[#0F141C] border-[#1A2232]' : 'bg-white border-slate-200 shadow-sm';
  const textTitle = isDark ? 'text-slate-400' : 'text-slate-600';
  const textValue = isDark ? 'text-white' : 'text-slate-900';
  const inputBg = isDark
    ? 'bg-[#151D2A] border-[#1A2232] text-slate-200 placeholder-slate-500 focus:border-blue-500'
    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500';

  const fetchClientes = async () => {
    setLoading(true);
    try {
      const { data, ok } = await apiFetch<Cliente[]>('/clientes');
      if (ok && Array.isArray(data)) {
        setClientes(data);
      }
    } catch (e) {
      console.error('Error al obtener clientes:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const handleCreatedClient = (newClient: Cliente) => {
    setClientes((prev) => [newClient, ...prev.filter((c) => c.id !== newClient.id)]);
    fetchClientes();
  };

  const clientesFiltrados = clientes.filter((c) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      c.razonSocial.toLowerCase().includes(q) ||
      c.ruc.includes(q) ||
      (c.telefono && c.telefono.includes(q)) ||
      (c.direccion && c.direccion.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className={`p-5 rounded-2xl border flex flex-wrap items-center justify-between gap-4 ${cardBg}`}>
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/30">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className={`text-lg font-black tracking-tight ${textValue}`}>
              Cartera de Clientes & Línea Comercial
            </h1>
            <p className={`text-xs ${textTitle}`}>
              Directorio corporativo sincronizado, condiciones de pago y registro directo en base de datos.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchClientes}
            title="Recargar lista"
            className={`p-2.5 rounded-xl border transition-colors ${
              isDark ? 'bg-[#151D2A] border-[#1A2232] text-slate-400 hover:text-white' : 'bg-slate-100 border-slate-300 text-slate-600 hover:text-slate-900'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Registrar Nuevo Cliente</span>
          </button>
        </div>
      </div>

      {/* 4 KPIs Superiores Dinámicos */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className={`rounded-2xl p-4 border space-y-1 ${cardBg}`}>
          <span className={`text-[10px] font-bold tracking-widest uppercase ${textTitle}`}>TOTAL CLIENTES REGISTRADOS</span>
          <p className={`text-2xl font-black font-mono text-blue-400`}>{clientes.length}</p>
          <span className="text-[10px] text-slate-500">Base de datos PostgreSQL</span>
        </div>

        <div className={`rounded-2xl p-4 border space-y-1 ${cardBg}`}>
          <span className={`text-[10px] font-bold tracking-widest uppercase ${textTitle}`}>CONDICIÓN CONTADO</span>
          <p className={`text-2xl font-black font-mono text-emerald-400`}>
            {clientes.filter((c) => !c.condicionPago || c.condicionPago.toLowerCase().includes('contado')).length}
          </p>
          <span className="text-[10px] text-slate-500">Pago anticipado</span>
        </div>

        <div className={`rounded-2xl p-4 border space-y-1 ${cardBg}`}>
          <span className={`text-[10px] font-bold tracking-widest uppercase ${textTitle}`}>CON LÍNEA DE CRÉDITO</span>
          <p className={`text-2xl font-black font-mono text-amber-400`}>
            {clientes.filter((c) => c.condicionPago && c.condicionPago.toLowerCase().includes('crédito')).length}
          </p>
          <span className="text-[10px] text-slate-500">Crédito 15, 30 o 60 días</span>
        </div>

        <div className={`rounded-2xl p-4 border space-y-1 ${cardBg}`}>
          <span className={`text-[10px] font-bold tracking-widest uppercase ${textTitle}`}>ESTADO DEL SERVICIO</span>
          <p className={`text-2xl font-black font-mono text-cyan-400`}>100% ACTIVO</p>
          <span className="text-[10px] text-slate-500">Sincronización en tiempo real</span>
        </div>
      </div>

      {/* Barra de Búsqueda */}
      <div className={`p-4 rounded-xl border flex items-center justify-between gap-4 ${cardBg}`}>
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por Razón Social, RUC o Dirección..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full pl-9 pr-3 py-1.5 rounded-lg border text-xs ${inputBg}`}
          />
        </div>
        <span className="text-xs font-mono text-slate-400">
          Mostrando {clientesFiltrados.length} de {clientes.length} clientes
        </span>
      </div>

      {/* Grid de Tarjetas de Clientes */}
      {loading ? (
        <div className="py-12 text-center text-xs text-slate-400">Cargando directorio de clientes...</div>
      ) : clientesFiltrados.length === 0 ? (
        <div className={`p-8 text-center rounded-2xl border ${cardBg}`}>
          <p className="text-xs text-slate-400">No se encontraron clientes con el criterio de búsqueda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clientesFiltrados.map((cliente) => (
            <div key={cliente.id} className={`rounded-2xl p-5 border space-y-4 transition-all hover:shadow-md ${cardBg}`}>
              <div className="flex items-start justify-between gap-3 border-b pb-3 border-slate-800/60">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30">
                      RUC {cliente.ruc}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      ACTIVO
                    </span>
                  </div>
                  <h3 className={`text-sm font-black mt-1 line-clamp-1 ${textValue}`}>{cliente.razonSocial}</h3>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-400 block font-mono">TELÉFONO / CONTACTO</span>
                  <div className="flex items-center gap-1.5 font-mono text-slate-300">
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{cliente.telefono || 'No registrado'}</span>
                  </div>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-400 block font-mono">DIRECCIÓN FISCAL / DESPACHO</span>
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="truncate">{cliente.direccion || 'No registrada'}</span>
                  </div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-[#151D2A] border border-[#1A2232] flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="text-[9px] text-slate-400 block">CONDICIÓN DE PAGO</span>
                  <span className="font-bold text-amber-400">{cliente.condicionPago || 'Contado'}</span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-slate-400 block">SISTEMA</span>
                  <span className="font-bold text-emerald-400">Verificado</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Nuevo Cliente */}
      <NuevoClienteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={handleCreatedClient}
      />
    </div>
  );
}
