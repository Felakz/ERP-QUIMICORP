'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '@/lib/ThemeContext';
import { apiFetch } from '@/lib/apiClient';
import { ClientExtended, ClientViewMode } from '@/types/clientes';
import { ClientHeader } from '@/components/clientes/ClientHeader';
import { ClientGridView } from '@/components/clientes/ClientGridView';
import { ClientTableView } from '@/components/clientes/ClientTableView';
import { ClientDetailView } from '@/components/clientes/ClientDetailView';
import { NuevoClienteModal } from '@/components/modals/NuevoClienteModal';

export default function CarteraClientesPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [clientes, setClientes] = useState<ClientExtended[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterEstado, setFilterEstado] = useState('TODOS');
  const [filterCredito, setFilterCredito] = useState('TODOS');
  const [viewMode, setViewMode] = useState<ClientViewMode>('grid');
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Cargar preferencia de vista desde localStorage
  useEffect(() => {
    const saved = localStorage.getItem('quimicorp_clientes_view_mode');
    if (saved === 'grid' || saved === 'table') {
      setViewMode(saved as ClientViewMode);
    }
  }, []);

  const handleViewModeChange = (mode: ClientViewMode) => {
    setViewMode(mode);
    localStorage.setItem('quimicorp_clientes_view_mode', mode);
  };

  const fetchClientes = async () => {
    setLoading(true);
    try {
      const { data, ok } = await apiFetch<ClientExtended[]>('/clientes');
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

  const handleCreatedClient = (newClient: any) => {
    setClientes((prev) => [newClient, ...prev.filter((c) => c.id !== newClient.id)]);
    fetchClientes();
  };

  // Filtrado reactivo de clientes
  const clientesFiltrados = clientes.filter((c) => {
    const q = search.toLowerCase().trim();

    // 1. Coincidencia de texto
    const matchEmpresa =
      !q ||
      c.razonSocial.toLowerCase().includes(q) ||
      c.ruc.includes(q) ||
      (c.telefono && c.telefono.includes(q)) ||
      (c.metodoEnvio && c.metodoEnvio.toLowerCase().includes(q)) ||
      (c.direccion && c.direccion.toLowerCase().includes(q));

    const matchContactos =
      q &&
      c.contactos?.some(
        (cont) =>
          cont.nombre.toLowerCase().includes(q) ||
          (cont.cargo && cont.cargo.toLowerCase().includes(q)) ||
          (cont.telefono && cont.telefono.includes(q))
      );

    const textMatch = matchEmpresa || matchContactos;

    // 2. Filtro de Estado
    let estadoMatch = true;
    if (filterEstado === 'ACTIVO') estadoMatch = c.estado === 'ACTIVO';
    if (filterEstado === 'INACTIVO') estadoMatch = c.estado === 'INACTIVO';
    if (filterEstado === 'SALDO_PENDIENTE') estadoMatch = (c.metrics?.saldoPendientePen || 0) > 0;

    // 3. Filtro de Crédito
    let creditoMatch = true;
    if (filterCredito === 'Contado') {
      creditoMatch = !c.condicionPago || c.condicionPago.toLowerCase().includes('contado');
    } else if (filterCredito === 'Crédito') {
      creditoMatch = !!c.condicionPago && c.condicionPago.toLowerCase().includes('crédito');
    } else if (filterCredito !== 'TODOS') {
      creditoMatch = !!c.condicionPago && c.condicionPago.includes(filterCredito);
    }

    return textMatch && estadoMatch && creditoMatch;
  });

  const selectedClient = clientes.find((c) => c.id === selectedClientId);

  // Si hay un cliente seleccionado, mostrar la Ficha 360°
  if (selectedClient) {
    return (
      <ClientDetailView
        cliente={selectedClient}
        onBack={() => setSelectedClientId(null)}
      />
    );
  }

  return (
    <div className="space-y-6 font-sans pb-12">
      {/* 1. Header y Filtros */}
      <ClientHeader
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        search={search}
        onSearchChange={setSearch}
        filterEstado={filterEstado}
        onFilterEstadoChange={setFilterEstado}
        filterCredito={filterCredito}
        onFilterCreditoChange={setFilterCredito}
        totalClientes={clientes.length}
        filteredCount={clientesFiltrados.length}
        loading={loading}
        onRefresh={fetchClientes}
        onOpenCreateModal={() => setIsModalOpen(true)}
      />

      {/* 2. Vista Dual (Grid vs. Tabla) */}
      {loading ? (
        <div className="py-12 text-center text-xs text-slate-400">
          Cargando directorio 360° de clientes...
        </div>
      ) : viewMode === 'grid' ? (
        <ClientGridView
          clientes={clientesFiltrados}
          onSelectClient={(id) => setSelectedClientId(id)}
        />
      ) : (
        <ClientTableView
          clientes={clientesFiltrados}
          onSelectClient={(id) => setSelectedClientId(id)}
        />
      )}

      {/* 3. Modal Registro de Empresa Matriz */}
      <NuevoClienteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={handleCreatedClient}
      />
    </div>
  );
}
