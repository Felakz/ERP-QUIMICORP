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
  Truck,
  UserCheck,
  ChevronDown,
  ChevronUp,
  User,
  ShieldCheck,
} from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';
import { apiFetch } from '@/lib/apiClient';
import { NuevoClienteModal, Cliente, ContactoRepresentante } from '@/components/modals/NuevoClienteModal';

export default function CarteraClientesPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

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

  const toggleAccordion = (id: string) => {
    setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const clientesFiltrados = clientes.filter((c) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    const matchEmpresa =
      c.razonSocial.toLowerCase().includes(q) ||
      c.ruc.includes(q) ||
      (c.telefono && c.telefono.includes(q)) ||
      (c.metodoEnvio && c.metodoEnvio.toLowerCase().includes(q)) ||
      (c.direccion && c.direccion.toLowerCase().includes(q));

    const matchContactos = c.contactos?.some((cont) =>
      cont.nombre.toLowerCase().includes(q) ||
      (cont.cargo && cont.cargo.toLowerCase().includes(q)) ||
      (cont.telefono && cont.telefono.includes(q))
    );

    return matchEmpresa || matchContactos;
  });

  const totalRepresentantes = clientes.reduce(
    (acc, c) => acc + (c.contactos?.length || (c.contacto ? 1 : 0)),
    0
  );

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
              Cartera Jerárquica de Clientes & Empresas
            </h1>
            <p className={`text-xs ${textTitle}`}>
              Directorio 1:N agrupado por Empresa/RUC con acordeón de representantes y logística de despacho.
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
            <span>Registrar Empresa Matriz</span>
          </button>
        </div>
      </div>

      {/* 4 KPIs Superiores Jerárquicos */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className={`rounded-2xl p-4 border space-y-1 ${cardBg}`}>
          <span className={`text-[10px] font-bold tracking-widest uppercase ${textTitle}`}>EMPRESAS MATRIZ (RUCs)</span>
          <p className="text-2xl font-black font-mono text-blue-400">{clientes.length}</p>
          <span className="text-[10px] text-slate-500">Unidades jurídicas únicas</span>
        </div>

        <div className={`rounded-2xl p-4 border space-y-1 ${cardBg}`}>
          <span className={`text-[10px] font-bold tracking-widest uppercase ${textTitle}`}>REPRESENTANTES & CONTACTOS</span>
          <p className="text-2xl font-black font-mono text-cyan-400">{totalRepresentantes}</p>
          <span className="text-[10px] text-slate-500">Personas vinculadas (1:N)</span>
        </div>

        <div className={`rounded-2xl p-4 border space-y-1 ${cardBg}`}>
          <span className={`text-[10px] font-bold tracking-widest uppercase ${textTitle}`}>CON LÍNEA DE CRÉDITO</span>
          <p className="text-2xl font-black font-mono text-amber-400">
            {clientes.filter((c) => c.condicionPago && c.condicionPago.toLowerCase().includes('crédito')).length}
          </p>
          <span className="text-[10px] text-slate-500">Crédito 15, 30 o 60 días</span>
        </div>

        <div className={`rounded-2xl p-4 border space-y-1 ${cardBg}`}>
          <span className={`text-[10px] font-bold tracking-widest uppercase ${textTitle}`}>CANDADO DE AUDITORÍA</span>
          <p className="text-2xl font-black font-mono text-emerald-400">100% VERIFICADO</p>
          <span className="text-[10px] text-slate-500">Protección contra fuga comercial</span>
        </div>
      </div>

      {/* Barra de Búsqueda */}
      <div className={`p-4 rounded-xl border flex items-center justify-between gap-4 ${cardBg}`}>
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por Empresa, RUC, Representante (ej. Daniel, Geyma), Cargo o Transporte..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full pl-9 pr-3 py-1.5 rounded-lg border text-xs ${inputBg}`}
          />
        </div>
        <span className="text-xs font-mono text-slate-400">
          Mostrando {clientesFiltrados.length} de {clientes.length} Empresas
        </span>
      </div>

      {/* Grid Jerárquico de Tarjetas de Empresas */}
      {loading ? (
        <div className="py-12 text-center text-xs text-slate-400">Cargando directorio jerárquico...</div>
      ) : clientesFiltrados.length === 0 ? (
        <div className={`p-8 text-center rounded-2xl border ${cardBg}`}>
          <p className="text-xs text-slate-400">No se encontraron empresas ni representantes con el criterio ingresado.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {clientesFiltrados.map((empresa) => {
            const isExpanded = expandedCards[empresa.id] ?? false;
            const listaContactos = empresa.contactos && empresa.contactos.length > 0
              ? empresa.contactos
              : empresa.contacto
                ? [{ id: 'c1', nombre: empresa.contacto, cargo: 'Contacto Principal', telefono: empresa.telefono, esPrincipal: true }]
                : [];

            return (
              <div
                key={empresa.id}
                className={`rounded-2xl p-5 border space-y-4 transition-all hover:shadow-lg flex flex-col justify-between ${cardBg}`}
              >
                <div className="space-y-3">
                  {/* Encabezado de la Tarjeta (RUC + Razón Social + Estado) */}
                  <div className="flex items-start justify-between gap-3 border-b pb-3 border-slate-800/60">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30">
                          {empresa.ruc.startsWith('SIN-RUC') || empresa.ruc.startsWith('NO-RUC') || empresa.ruc === '-'
                            ? 'RUC -'
                            : `RUC ${empresa.ruc}`}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" />
                          <span>ACTIVO</span>
                        </span>
                      </div>
                      <h3 className={`text-sm font-black mt-1.5 line-clamp-1 ${textValue}`}>
                        {empresa.razonSocial}
                      </h3>
                    </div>
                  </div>

                  {/* Datos Operativos & Logística */}
                  <div className="space-y-2.5 text-xs">
                    {/* Dirección Fiscal / Despacho */}
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-slate-400 block font-mono">DIRECCIÓN FISCAL / DESPACHO</span>
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="truncate">{empresa.direccion || 'No registrada'}</span>
                      </div>
                    </div>

                    {/* Método de Envío / Agencia */}
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-slate-400 block font-mono">MODALIDAD DE ENVÍO / TRANSPORTE</span>
                      <div className="flex items-center gap-1.5 text-indigo-300 font-semibold">
                        <Truck className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span>{empresa.metodoEnvio || 'INDRIVER / REGULAR'}</span>
                      </div>
                    </div>

                    {/* Condición de Pago */}
                    <div className="flex items-center justify-between p-2 rounded-xl bg-[#151D2A] border border-[#1A2232] text-xs font-mono">
                      <div className="flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                        <span className="text-[10px] text-slate-400">CONDICIÓN:</span>
                      </div>
                      <span className="font-bold text-amber-400">{empresa.condicionPago || 'Contado'}</span>
                    </div>
                  </div>

                  {/* Acordeón Desplegable de Representantes & Contactos (1:N) */}
                  <div className="pt-2 border-t border-slate-800/60">
                    <button
                      onClick={() => toggleAccordion(empresa.id)}
                      className="w-full flex items-center justify-between p-2 rounded-xl bg-[#151D2A]/80 hover:bg-[#151D2A] border border-[#1A2232] text-xs transition-colors"
                    >
                      <div className="flex items-center gap-2 text-cyan-400 font-bold">
                        <UserCheck className="w-4 h-4 text-cyan-400" />
                        <span>Representantes ({listaContactos.length})</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-400 text-[10px]">
                        <span>{isExpanded ? 'Ocultar' : 'Ver todos'}</span>
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </button>

                    {/* Contenido expandible del acordeón */}
                    {isExpanded && (
                      <div className="mt-2 space-y-2 animate-in fade-in duration-150">
                        {listaContactos.length === 0 ? (
                          <p className="text-[11px] text-slate-500 italic p-2">Sin representantes registrados.</p>
                        ) : (
                          listaContactos.map((cont, idx) => (
                            <div
                              key={cont.id || idx}
                              className="p-2.5 rounded-xl bg-[#151D2A] border border-[#1A2232] flex items-center justify-between text-xs"
                            >
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-bold text-slate-200">{cont.nombre}</span>
                                  {cont.esPrincipal && (
                                    <span className="px-1.5 py-0.2 rounded text-[8px] font-bold uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                                      PRINCIPAL
                                    </span>
                                  )}
                                </div>
                                <span className="text-[10px] text-slate-400 block">{cont.cargo || 'Representante'}</span>
                              </div>

                              {cont.telefono && (
                                <a
                                  href={`tel:${cont.telefono}`}
                                  className="flex items-center gap-1 font-mono text-[11px] font-bold text-emerald-400 hover:underline bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20"
                                >
                                  <Phone className="w-3 h-3" />
                                  <span>{cont.telefono}</span>
                                </a>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Nuevo Cliente Matriz */}
      <NuevoClienteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={handleCreatedClient}
      />
    </div>
  );
}
