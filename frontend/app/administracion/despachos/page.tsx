'use client';

import React, { useState, useMemo } from 'react';
import {
  Truck,
  Package,
  Calendar,
  Search,
  Filter,
  Download,
  CheckCircle2,
  Clock,
  MapPin,
  FileText,
  User,
  Plus,
  X,
  Sparkles,
  Building2,
  Navigation,
  Eye,
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { useTheme } from '@/lib/ThemeContext';

export type EstadoDespacho = 'TODOS' | 'LISTO_DESPACHO' | 'EN_RUTA' | 'ENTREGADO' | 'PROGRAMADO';

interface DespachoItem {
  id: string;
  codigoLote: string;
  guiaRemision: string;
  cliente: string;
  direccionEntrega: string;
  producto: string;
  presentacion: string;
  cantidadUnidades: number;
  volumenTotalKgLt: number;
  conductor: string;
  placaVehiculo: string;
  fechaProgramada: string;
  horaSalida?: string;
  horaEntrega?: string;
  estado: 'LISTO_DESPACHO' | 'EN_RUTA' | 'ENTREGADO' | 'PROGRAMADO';
  conformidadFirma?: boolean;
}

const INITIAL_DESPACHOS: DespachoItem[] = [
  {
    id: 'desp-001',
    codigoLote: 'LOT-2026-0891',
    guiaRemision: 'T001-000489',
    cliente: 'DISTRIBUIDORA QUÍMICA INDUSTRIAL S.A.C.',
    direccionEntrega: 'Av. Industrial 450, Ate Vitarte, Lima',
    producto: 'Detergente Líquido Industrial Matic 20L',
    presentacion: 'Bidón Azul 20L',
    cantidadUnidades: 80,
    volumenTotalKgLt: 1600,
    conductor: 'Carlos Mendoza Ramos',
    placaVehiculo: 'BZF-892 (Furgón Hino 5T)',
    fechaProgramada: '2026-09-04',
    horaSalida: '09:30 AM',
    estado: 'EN_RUTA',
  },
  {
    id: 'desp-002',
    codigoLote: 'LOT-2026-0890',
    guiaRemision: 'T001-000488',
    cliente: 'CORPORACIÓN DE LIMPIEZA DEL SUR S.R.L.',
    direccionEntrega: 'Calle Los Cedros 120, Chorrillos, Lima',
    producto: 'Lavavajillas Concentrado Limón 4L',
    presentacion: 'Galonera 4L',
    cantidadUnidades: 250,
    volumenTotalKgLt: 1000,
    conductor: 'Manuel Quispe Flores',
    placaVehiculo: 'AZX-410 (Camión Hyundai 3.5T)',
    fechaProgramada: '2026-09-04',
    horaSalida: '08:00 AM',
    horaEntrega: '11:15 AM',
    estado: 'ENTREGADO',
    conformidadFirma: true,
  },
  {
    id: 'desp-003',
    codigoLote: 'LOT-2026-0889',
    guiaRemision: 'T001-000487',
    cliente: 'SERVICIOS INDUSTRIALES Y AMBIENTALES E.I.R.L.',
    direccionEntrega: 'Av. Argentina 2890, Callao',
    producto: 'Desengrasante Multiuso Heavy Duty 20L',
    presentacion: 'Bidón Azul 20L',
    cantidadUnidades: 60,
    volumenTotalKgLt: 1200,
    conductor: 'Carlos Mendoza Ramos',
    placaVehiculo: 'BZF-892 (Furgón Hino 5T)',
    fechaProgramada: '2026-09-04',
    estado: 'LISTO_DESPACHO',
  },
  {
    id: 'desp-004',
    codigoLote: 'LOT-2026-0888',
    guiaRemision: 'T001-000486',
    cliente: 'INVERSIONES SANTA ROSA CHEMICALS S.A.C.',
    direccionEntrega: 'Carretera Central Km 18.5, Santa Anita, Lima',
    producto: 'Cloro Gel Espumante Desinfectante 1L',
    presentacion: 'Botella 1L x Caja 12 Und',
    cantidadUnidades: 120,
    volumenTotalKgLt: 1440,
    conductor: 'Manuel Quispe Flores',
    placaVehiculo: 'AZX-410 (Camión Hyundai 3.5T)',
    fechaProgramada: '2026-09-05',
    estado: 'PROGRAMADO',
  },
  {
    id: 'desp-005',
    codigoLote: 'LOT-2026-0887',
    guiaRemision: 'T001-000485',
    cliente: 'LAVANDERÍAS INDUSTRIALES DEL PACÍFICO S.A.',
    direccionEntrega: 'Av. Trapiche 1100, Comas, Lima',
    producto: 'Suavizante Textil Flores Silvestres 20L',
    presentacion: 'Bidón Azul 20L',
    cantidadUnidades: 50,
    volumenTotalKgLt: 1000,
    conductor: 'Carlos Mendoza Ramos',
    placaVehiculo: 'BZF-892 (Furgón Hino 5T)',
    fechaProgramada: '2026-09-03',
    horaSalida: '10:00 AM',
    horaEntrega: '02:30 PM',
    estado: 'ENTREGADO',
    conformidadFirma: true,
  },
];

export default function AdministracionDespachosPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [despachos, setDespachos] = useState<DespachoItem[]>(INITIAL_DESPACHOS);
  const [selectedEstado, setSelectedEstado] = useState<EstadoDespacho>('TODOS');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form nuevo despacho
  const [nuevoCliente, setNuevoCliente] = useState('');
  const [nuevaDireccion, setNuevaDireccion] = useState('');
  const [nuevoProducto, setNuevoProducto] = useState('');
  const [nuevaPresentacion, setNuevaPresentacion] = useState('Bidón Azul 20L');
  const [nuevasUnidades, setNuevasUnidades] = useState<number>(50);
  const [nuevoConductor, setNuevoConductor] = useState('Carlos Mendoza Ramos');
  const [nuevaPlaca, setNuevaPlaca] = useState('BZF-892 (Furgón Hino 5T)');

  const cardBg = isDark ? 'bg-[#0F141C] border-[#1A2232]' : 'bg-white border-slate-200 shadow-sm';
  const textTitle = isDark ? 'text-slate-400' : 'text-slate-600';
  const textValue = isDark ? 'text-white' : 'text-slate-900';
  const inputBg = isDark
    ? 'bg-[#151D2A] border-[#1A2232] text-slate-200 placeholder-slate-500 focus:border-[#00F2C3]'
    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500';

  const filteredDespachos = useMemo(() => {
    return despachos.filter((d) => {
      if (selectedEstado !== 'TODOS' && d.estado !== selectedEstado) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchCode = d.codigoLote.toLowerCase().includes(q);
        const matchGuia = d.guiaRemision.toLowerCase().includes(q);
        const matchClient = d.cliente.toLowerCase().includes(q);
        const matchProd = d.producto.toLowerCase().includes(q);
        const matchCond = d.conductor.toLowerCase().includes(q);
        if (!matchCode && !matchGuia && !matchClient && !matchProd && !matchCond) return false;
      }
      return true;
    });
  }, [despachos, selectedEstado, searchQuery]);

  // KPIs
  const totalVolumen = useMemo(
    () => despachos.reduce((acc, d) => acc + d.volumenTotalKgLt, 0),
    [despachos]
  );
  const enRuta = useMemo(
    () => despachos.filter((d) => d.estado === 'EN_RUTA').length,
    [despachos]
  );
  const listos = useMemo(
    () => despachos.filter((d) => d.estado === 'LISTO_DESPACHO').length,
    [despachos]
  );
  const entregados = useMemo(
    () => despachos.filter((d) => d.estado === 'ENTREGADO').length,
    [despachos]
  );

  const handleCrearDespacho = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoCliente.trim() || !nuevoProducto.trim() || nuevasUnidades <= 0) {
      alert('Por favor completa todos los campos del despacho.');
      return;
    }

    const vol = nuevasUnidades * 20; // Aproximado
    const nuevo: DespachoItem = {
      id: `desp-${Date.now()}`,
      codigoLote: `LOT-2026-${String(despachos.length + 892).padStart(4, '0')}`,
      guiaRemision: `T001-${String(despachos.length + 490).padStart(6, '0')}`,
      cliente: nuevoCliente.trim(),
      direccionEntrega: nuevaDireccion.trim() || 'Lima Metropolitana',
      producto: nuevoProducto.trim(),
      presentacion: nuevaPresentacion,
      cantidadUnidades: Number(nuevasUnidades),
      volumenTotalKgLt: vol,
      conductor: nuevoConductor,
      placaVehiculo: nuevaPlaca,
      fechaProgramada: new Date().toISOString().split('T')[0],
      estado: 'LISTO_DESPACHO',
    };

    setDespachos([nuevo, ...despachos]);
    setIsModalOpen(false);
    setNuevoCliente('');
    setNuevaDireccion('');
    setNuevoProducto('');
    setNuevasUnidades(50);
    alert(`✅ Despacho [${nuevo.guiaRemision}] programado exitosamente.`);
  };

  const handleConfirmarEntrega = (id: string) => {
    setDespachos((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              estado: 'ENTREGADO',
              horaEntrega: new Date().toLocaleTimeString('es-PE', {
                hour: '2-digit',
                minute: '2-digit',
              }),
              conformidadFirma: true,
            }
          : d
      )
    );
    alert('✅ Despacho marcado como ENTREGADO CONFORME con firma digital.');
  };

  const handleExportExcel = () => {
    const rows = filteredDespachos.map((d) => ({
      Lote: d.codigoLote,
      Guia_Remision: d.guiaRemision,
      Cliente: d.cliente,
      Direccion: d.direccionEntrega,
      Producto: d.producto,
      Presentacion: d.presentacion,
      Unidades: d.cantidadUnidades,
      Volumen_Kg_Lt: d.volumenTotalKgLt,
      Conductor: d.conductor,
      Vehiculo: d.placaVehiculo,
      Fecha_Programada: d.fechaProgramada,
      Hora_Salida: d.horaSalida || '—',
      Hora_Entrega: d.horaEntrega || '—',
      Estado: d.estado,
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Despachos_Plantas');
    XLSX.writeFile(wb, `Quimicorp_Despachos_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="space-y-5 font-sans min-h-screen">
      {/* 1. Header Banner Neon */}
      <div
        className={`rounded-2xl p-5 border flex flex-wrap items-center justify-between gap-4 transition-all shadow-sm ${cardBg}`}
      >
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/20 border border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className={`text-lg font-black tracking-tight ${textValue}`}>
                Lotes, Envasado & Despachos de Planta
              </h1>
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                GUÍAS DE REMISIÓN SUNAT ELECTRÓNICAS
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Liberación de lotes químicos envasados, asignación de unidades de transporte y tracking de ruta.
            </p>
          </div>
        </div>

        {/* Botones */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-black text-xs tracking-wider uppercase transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>+ Programar Despacho</span>
          </button>

          <button
            onClick={handleExportExcel}
            className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 ${
              isDark
                ? 'bg-[#151D2A] border-[#1A2232] text-slate-200 hover:text-cyan-400 hover:border-cyan-500/40'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Exportar .XLSX</span>
          </button>
        </div>
      </div>

      {/* 2. Cuadrícula de 4 Tarjetas KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* VOLUMEN TOTAL */}
        <div
          className={`rounded-2xl p-5 border transition-all card-hover-lift relative overflow-hidden group ${cardBg}`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-bold tracking-widest uppercase font-mono ${textTitle}`}>
              VOLUMEN DESPACHO
            </span>
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-blue-400 font-mono tracking-tight">
              {totalVolumen.toLocaleString('es-PE')} KG/LT
            </h3>
            <p className="text-xs text-slate-400 mt-1.5 font-sans">
              Carga total procesada
            </p>
          </div>
        </div>

        {/* EN RUTA */}
        <div
          className={`rounded-2xl p-5 border transition-all card-hover-lift relative overflow-hidden group ${cardBg}`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-bold tracking-widest uppercase font-mono ${textTitle}`}>
              UNIDADES EN RUTA
            </span>
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-[#00F2C3]">
              <Navigation className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-[#00F2C3] font-mono tracking-tight">
              {enRuta} Camiones
            </h3>
            <p className="text-xs text-slate-400 mt-1.5 font-sans">
              En tránsito a destino cliente
            </p>
          </div>
        </div>

        {/* LISTOS PARA SALIDA */}
        <div
          className={`rounded-2xl p-5 border transition-all card-hover-lift relative overflow-hidden group ${cardBg}`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-bold tracking-widest uppercase font-mono ${textTitle}`}>
              LISTOS EN RAMPA
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-amber-400 font-mono tracking-tight">
              {listos} Lotes
            </h3>
            <p className="text-xs text-slate-400 mt-1.5 font-sans">
              Envasados y control QA OK
            </p>
          </div>
        </div>

        {/* ENTREGADOS CONFORME */}
        <div
          className={`rounded-2xl p-5 border transition-all card-hover-lift relative overflow-hidden group ${cardBg}`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-bold tracking-widest uppercase font-mono ${textTitle}`}>
              ENTREGAS CONFORMES
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-emerald-400 font-mono tracking-tight">
              {entregados} Entregas
            </h3>
            <p className="text-xs text-slate-400 mt-1.5 font-sans">
              Guías firmadas por cliente
            </p>
          </div>
        </div>
      </div>

      {/* 3. Filtros Segmentados y Buscador */}
      <div className={`rounded-2xl border p-4 flex flex-wrap items-center justify-between gap-3 ${cardBg}`}>
        <div className="flex items-center gap-1.5 bg-[#151D2A] p-1 rounded-xl border border-[#1A2232] overflow-x-auto">
          {[
            { id: 'TODOS', label: 'Todos los Despachos' },
            { id: 'LISTO_DESPACHO', label: 'Listos en Rampa' },
            { id: 'EN_RUTA', label: 'En Ruta' },
            { id: 'ENTREGADO', label: 'Entregados' },
            { id: 'PROGRAMADO', label: 'Programados' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedEstado(tab.id as EstadoDespacho)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                selectedEstado === tab.id
                  ? 'bg-[#00F2C3] text-slate-950 shadow-[0_0_10px_rgba(0,242,195,0.4)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por lote, guía, cliente o chofer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full rounded-xl border py-2 pl-9 pr-3 text-xs focus:outline-none transition-all ${inputBg}`}
          />
        </div>
      </div>

      {/* 4. Lista de Despachos */}
      <div className="space-y-3">
        {filteredDespachos.map((d) => (
          <div
            key={d.id}
            className={`rounded-2xl border p-5 transition-all card-hover-lift ${cardBg} ${
              d.estado === 'EN_RUTA'
                ? 'border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                : d.estado === 'LISTO_DESPACHO'
                ? 'border-amber-500/30'
                : 'border-[#1A2232]'
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono font-bold text-sm text-[#00F2C3]">
                    {d.guiaRemision}
                  </span>
                  <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
                    {d.codigoLote}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold font-mono border ${
                      d.estado === 'ENTREGADO'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : d.estado === 'EN_RUTA'
                        ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 animate-pulse'
                        : d.estado === 'LISTO_DESPACHO'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        : 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                    }`}
                  >
                    {d.estado.replace('_', ' ')}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-slate-400" />
                  <h3 className={`text-base font-black ${textValue}`}>{d.cliente}</h3>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span>{d.direccionEntrega}</span>
                </div>
              </div>

              <div className="text-right font-mono">
                <span className={`text-[10px] font-bold uppercase ${textTitle}`}>CARGA TOTAL</span>
                <p className="text-xl font-black text-cyan-400">
                  {d.volumenTotalKgLt.toLocaleString('es-PE')} KG/LT
                </p>
                <span className="text-xs text-slate-300 font-sans">
                  {d.cantidadUnidades} x {d.presentacion}
                </span>
              </div>
            </div>

            {/* Detalle Producto & Transporte */}
            <div className="mt-4 pt-3 border-t border-slate-800/60 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#151D2A]/60 border border-[#1A2232]">
                <p className="text-[10px] font-bold uppercase text-slate-400 mb-1">
                  Producto Químico Envasado:
                </p>
                <p className="font-black text-slate-200">{d.producto}</p>
              </div>

              <div className="p-3 rounded-xl bg-[#151D2A]/60 border border-[#1A2232] flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase text-slate-400 mb-1">
                    Conductor Asignado:
                  </p>
                  <p className="font-bold text-slate-200">{d.conductor}</p>
                </div>
                <span className="font-mono text-cyan-400 font-bold bg-cyan-500/10 px-2 py-1 rounded border border-cyan-500/30">
                  {d.placaVehiculo}
                </span>
              </div>
            </div>

            {/* Footer Acciones */}
            <div className="mt-4 pt-3 border-t border-slate-800/40 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-400 font-mono">
                <span>📅 Fecha: {d.fechaProgramada}</span>
                {d.horaSalida && <span>• 🛫 Salida: {d.horaSalida}</span>}
                {d.horaEntrega && <span className="text-emerald-400">• 🏁 Entrega: {d.horaEntrega}</span>}
              </div>

              <div className="flex items-center gap-2">
                {d.estado !== 'ENTREGADO' && (
                  <button
                    onClick={() => handleConfirmarEntrega(d.id)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-bold flex items-center gap-1.5 transition-all"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Confirmar Entrega Conforme</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    alert(`Visualizando Guía de Remisión Electrónica SUNAT: ${d.guiaRemision}`);
                  }}
                  className={`px-3 py-1.5 rounded-xl border font-bold transition-all flex items-center gap-1.5 ${
                    isDark
                      ? 'bg-[#151D2A] border-[#1A2232] text-slate-300 hover:text-white'
                      : 'bg-slate-100 border-slate-300 text-slate-700'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Ver Guía SUNAT</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL PROGRAMAR DESPACHO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className={`w-full max-w-lg rounded-2xl border p-6 space-y-4 shadow-2xl ${cardBg}`}>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-cyan-400" />
                <h3 className={`text-base font-black ${textValue}`}>Programar Nuevo Despacho</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCrearDespacho} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Cliente / Destinatario:</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. DISTRIBUIDORA QUÍMICA INDUSTRIAL S.A.C."
                  value={nuevoCliente}
                  onChange={(e) => setNuevoCliente(e.target.value)}
                  className={`w-full rounded-xl border p-2.5 ${inputBg}`}
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Dirección de Entrega:</label>
                <input
                  type="text"
                  placeholder="Av. Industrial 450, Ate Vitarte, Lima"
                  value={nuevaDireccion}
                  onChange={(e) => setNuevaDireccion(e.target.value)}
                  className={`w-full rounded-xl border p-2.5 ${inputBg}`}
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Producto Químico:</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Detergente Líquido Industrial 20L"
                  value={nuevoProducto}
                  onChange={(e) => setNuevoProducto(e.target.value)}
                  className={`w-full rounded-xl border p-2.5 ${inputBg}`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Presentación Envase:</label>
                  <select
                    value={nuevaPresentacion}
                    onChange={(e) => setNuevaPresentacion(e.target.value)}
                    className={`w-full rounded-xl border p-2.5 ${inputBg}`}
                  >
                    <option value="Bidón Azul 20L">Bidón Azul 20L</option>
                    <option value="Galonera 4L">Galonera 4L</option>
                    <option value="Botella 1L x Caja">Botella 1L x Caja</option>
                    <option value="Cilindro 200L">Cilindro 200L</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Cantidad Unidades:</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={nuevasUnidades}
                    onChange={(e) => setNuevasUnidades(Number(e.target.value))}
                    className={`w-full rounded-xl border p-2.5 font-mono ${inputBg}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Conductor:</label>
                  <select
                    value={nuevoConductor}
                    onChange={(e) => setNuevoConductor(e.target.value)}
                    className={`w-full rounded-xl border p-2.5 ${inputBg}`}
                  >
                    <option value="Carlos Mendoza Ramos">Carlos Mendoza Ramos</option>
                    <option value="Manuel Quispe Flores">Manuel Quispe Flores</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Vehículo / Placa:</label>
                  <select
                    value={nuevaPlaca}
                    onChange={(e) => setNuevaPlaca(e.target.value)}
                    className={`w-full rounded-xl border p-2.5 font-mono ${inputBg}`}
                  >
                    <option value="BZF-892 (Furgón Hino 5T)">BZF-892 (Furgón Hino 5T)</option>
                    <option value="AZX-410 (Camión Hyundai 3.5T)">AZX-410 (Camión Hyundai 3.5T)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black tracking-wider uppercase shadow-lg shadow-cyan-500/20"
                >
                  Confirmar Programación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
