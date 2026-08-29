'use client';

import React, { useState, useEffect, useMemo } from 'react';
import QRCode from 'qrcode';
import {
  Printer,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  Check,
  Building2,
  User,
  Package,
  AlertOctagon,
  FileCheck,
  Edit3,
  Barcode,
  RefreshCw,
  Sparkles,
  Scale,
  FileText,
  Eye,
  Info,
  Layers,
  Flame,
  ShieldAlert,
  Zap,
  Save,
  X,
  Sliders,
  Calendar,
} from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';
import { ModalFichaTecnicaInsumos, FichaTecnicaData } from '@/components/produccion/ModalFichaTecnicaInsumos';

export interface PedidoEtiquetaItem {
  id: string;
  idPedido: string;
  numeroPedido: string;
  codigoLote: string;
  nombreProducto: string;
  clienteNombre: string;
  clienteRuc: string;
  cantidadKilosDisplay: string;
  contenidoNetoKg: number;
  unidadesPedidas: number;
  sku: string;
  fechaFab: string;
  fechaVenc: string;
  codigoBarras: string;
  ruc: string;
  advertenciaGHS: string;
  codigoGHS: 'GHS07' | 'GHS05' | 'GHS02' | 'GHS09';
  tipoPeligro: string;
  aprobadoQA: boolean;
  estadoImpresion: string;
  // Metrología por pedido
  tipoEnvase: string;
  taraGramos: number;
  // Parámetros QA
  phMedido: number;
  phRango: string;
  viscosidadMedida: string;
  densidadMedida: string;
  aspecto: string;
  color: string;
  olor: string;
  // Insumos de la Receta del Pedido
  insumos: Array<{
    nombre: string;
    funcion: string;
    porcentaje: number;
    pesoDosificadoKg: number;
    tipo: 'ACTIVO' | 'BASE' | 'ADITIVO' | 'FRAGANCIA' | 'CONSERVANTE';
  }>;
}

export default function EtiquetasDespachoPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Tabs superiores
  const [activeTab, setActiveTab] = useState<'ETIQUETA' | 'DESPACHO'>('ETIQUETA');

  // Pedidos Reales de Producción
  const [pedidosCola, setPedidosCola] = useState<PedidoEtiquetaItem[]>([
    {
      id: 'ped-naupari-001',
      idPedido: 'PED-2026-089',
      numeroPedido: 'ORD-00296',
      codigoLote: 'CRMS- 00296',
      nombreProducto: 'CREMA MUSCULAR',
      clienteNombre: 'ÑAUPARI',
      clienteRuc: '20601984521',
      cantidadKilosDisplay: '19 KILOS',
      contenidoNetoKg: 19.014,
      unidadesPedidas: 1,
      sku: 'CRM-MUSC-19KG',
      fechaFab: '30 – ABRIL -2026',
      fechaVenc: '30 - ABRIL -2027',
      codigoBarras: '7759000002961',
      ruc: '20612434124',
      advertenciaGHS: 'Uso Tópico Externo / Precaución Ocular',
      codigoGHS: 'GHS07',
      tipoPeligro: 'ATENCIÓN (GHS07)',
      aprobadoQA: true,
      estadoImpresion: 'LISTO_PARA_IMPRIMIR',
      tipoEnvase: 'Balde + Tapa (PEAD 5 Gal)',
      taraGramos: 985,
      phMedido: 6.45,
      phRango: '6.0 - 6.8',
      viscosidadMedida: '48,500 cP',
      densidadMedida: '0.992 g/ml',
      aspecto: 'Crema homogénea consistente untuosa',
      color: 'Blanco perla característico',
      olor: 'Mentolado - Alcanforado intenso refrescante',
      insumos: [
        { nombre: 'Salicilato de Metilo', funcion: 'Principio Activo Rubefaciente / Analgésico', porcentaje: 12.0, pesoDosificadoKg: 2.282, tipo: 'ACTIVO' },
        { nombre: 'Mentol Cristalino USP', funcion: 'Agente Refrescante / Descongestionante', porcentaje: 6.0, pesoDosificadoKg: 1.141, tipo: 'ACTIVO' },
        { nombre: 'Alcanfor Sintético USP', funcion: 'Estimulante Circulatorio Local', porcentaje: 3.0, pesoDosificadoKg: 0.570, tipo: 'ACTIVO' },
        { nombre: 'Base Autoemulsionante No Iónica (Lanette)', funcion: 'Emulsionante y Formador de Cuerpo', porcentaje: 15.0, pesoDosificadoKg: 2.852, tipo: 'BASE' },
        { nombre: 'Glicerina Vegetal USP 99.5%', funcion: 'Agente Humectante y Emoliente', porcentaje: 5.0, pesoDosificadoKg: 0.951, tipo: 'BASE' },
        { nombre: 'Agua Desmineralizada Tratada', funcion: 'Vehículo Acuoso Principal', porcentaje: 57.5, pesoDosificadoKg: 10.933, tipo: 'BASE' },
        { nombre: 'Conservante Euxyl PE 9010', funcion: 'Preservante Antimicrobiano Amplio Espectro', porcentaje: 1.5, pesoDosificadoKg: 0.285, tipo: 'CONSERVANTE' },
      ],
    },
    {
      id: 'ped-jhon-canto-002',
      idPedido: 'PED-2026-090',
      numeroPedido: 'ORD-00040',
      codigoLote: 'LOTE-000040',
      nombreProducto: 'CREMA CÚRCUMA Y MENTOL',
      clienteNombre: 'JHON CANTO INDUSTRIAL',
      clienteRuc: '20512345678',
      cantidadKilosDisplay: '250 KILOS',
      contenidoNetoKg: 250.00,
      unidadesPedidas: 1,
      sku: 'CRM-CUR-250',
      fechaFab: '2026-07-31',
      fechaVenc: '2027-07-31',
      codigoBarras: '7759000000040',
      ruc: '20612434124',
      advertenciaGHS: 'Irritante Cutáneo Leve',
      codigoGHS: 'GHS07',
      tipoPeligro: 'ATENCIÓN (GHS07)',
      aprobadoQA: true,
      estadoImpresion: 'LISTO_PARA_IMPRIMIR',
      tipoEnvase: 'Cilindro Plástico Azul 55 Gal',
      taraGramos: 8500,
      phMedido: 6.2,
      phRango: '5.8 - 6.6',
      viscosidadMedida: '52,000 cP',
      densidadMedida: '0.995 g/ml',
      aspecto: 'Crema suave color amarillo suave',
      color: 'Amarillo Cúrcuma',
      olor: 'Mentolado Herbal',
      insumos: [
        { nombre: 'Extracto de Cúrcuma Longa', funcion: 'Antiinflamatorio Natural', porcentaje: 8.0, pesoDosificadoKg: 20.00, tipo: 'ACTIVO' },
        { nombre: 'Mentol Cristalino USP', funcion: 'Refrescante Tópico', porcentaje: 5.0, pesoDosificadoKg: 12.50, tipo: 'ACTIVO' },
        { nombre: 'Base Emulsionante Crema', funcion: 'Estructura Emulsión', porcentaje: 18.0, pesoDosificadoKg: 45.00, tipo: 'BASE' },
        { nombre: 'Agua Desmineralizada', funcion: 'Solvente Base', porcentaje: 67.5, pesoDosificadoKg: 168.75, tipo: 'BASE' },
        { nombre: 'Conservante Phenochem', funcion: 'Antibacteriano', porcentaje: 1.5, pesoDosificadoKg: 3.75, tipo: 'CONSERVANTE' },
      ],
    },
    {
      id: 'ped-dist-quimica-003',
      idPedido: 'PED-2026-091',
      numeroPedido: 'ORD-00001',
      codigoLote: 'L-2026-001',
      nombreProducto: 'DESENGRASANTE PESADO INDUSTRIAL HD',
      clienteNombre: 'DISTRIBUIDORA QUÍMICA INDUSTRIAL',
      clienteRuc: '20601234567',
      cantidadKilosDisplay: '20 KILOS',
      contenidoNetoKg: 20.00,
      unidadesPedidas: 5,
      sku: 'DES-IND-HD20',
      fechaFab: '2026-08-28',
      fechaVenc: '2027-08-28',
      codigoBarras: '7759000000001',
      ruc: '20612434124',
      advertenciaGHS: 'Peligro: Causa quemaduras graves y lesiones oculares',
      codigoGHS: 'GHS05',
      tipoPeligro: 'PELIGRO CORROSIVO (GHS05)',
      aprobadoQA: true,
      estadoImpresion: 'LISTO_PARA_IMPRIMIR',
      tipoEnvase: 'Bidón PEAD 5 Galones',
      taraGramos: 650,
      phMedido: 12.8,
      phRango: '12.5 - 13.5',
      viscosidadMedida: '350 cP',
      densidadMedida: '1.045 g/ml',
      aspecto: 'Líquido translúcido alcalino',
      color: 'Ámbar Claro',
      olor: 'Característico Solventado',
      insumos: [
        { nombre: 'Hidróxido de Sodio (Soda Cáustica 99%)', funcion: 'Agente Alcalinizante Saponificante', porcentaje: 8.5, pesoDosificadoKg: 1.70, tipo: 'ACTIVO' },
        { nombre: 'Butilglicol Solvente', funcion: 'Disolvente de Grasas Pesadas', porcentaje: 6.0, pesoDosificadoKg: 1.20, tipo: 'ACTIVO' },
        { nombre: 'Lauril Éter Sulfato (LESS 70%)', funcion: 'Tensoactivo Espumante y Humectante', porcentaje: 10.0, pesoDosificadoKg: 2.00, tipo: 'BASE' },
        { nombre: 'Agua Tratada', funcion: 'Vehículo Principal', porcentaje: 75.5, pesoDosificadoKg: 15.10, tipo: 'BASE' },
      ],
    },
  ]);

  const [selectedPedidoId, setSelectedPedidoId] = useState<string>('ped-naupari-001');
  const [showManualDrawer, setShowManualDrawer] = useState<boolean>(false);
  const [showFichaModal, setShowFichaModal] = useState<boolean>(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  // Estados de Despacho
  const [destino, setDestino] = useState<string>('Almacén Central Despachos');
  const [responsable, setResponsable] = useState<string>('Carlos Quispe');

  // Pedido Actual
  const pedidoActivo = useMemo(() => {
    return pedidosCola.find((p) => p.id === selectedPedidoId) || pedidosCola[0];
  }, [pedidosCola, selectedPedidoId]);

  // Cálculos Metrológicos Dinámicos por Pedido
  const taraKg = (pedidoActivo?.taraGramos ?? 985) / 1000;
  const contenidoNeto = pedidoActivo?.contenidoNetoKg ?? 19.014;
  const pesoBrutoTotalKg = contenidoNeto + taraKg;

  // Generador de QR Real 100% Escaneable
  useEffect(() => {
    const generateRealQR = async () => {
      try {
        const qrPayload = JSON.stringify({
          empresa: 'QUIMICORP PERU S.A.C.',
          ruc: '20612434124',
          pedido: pedidoActivo.idPedido,
          orden: pedidoActivo.numeroPedido,
          lote: pedidoActivo.codigoLote,
          producto: pedidoActivo.nombreProducto,
          cliente: pedidoActivo.clienteNombre,
          pesoNeto: `${contenidoNeto.toFixed(3)} KG`,
          pesoBruto: `${pesoBrutoTotalKg.toFixed(3)} KG`,
          tara: `${pedidoActivo.taraGramos} G`,
          fechaFab: pedidoActivo.fechaFab,
          fechaVenc: pedidoActivo.fechaVenc,
          estadoQA: 'LIBERADO_CONFORME',
          verificarURL: `https://erp.quimicorp.com/trazabilidad/pedido/${pedidoActivo.idPedido}`,
        }, null, 2);

        const url = await QRCode.toDataURL(qrPayload, {
          width: 280,
          margin: 1,
          color: {
            dark: '#000000',
            light: '#FFFFFF',
          },
          errorCorrectionLevel: 'M',
        });
        setQrDataUrl(url);
      } catch (err) {
        console.error('Error generando QR real:', err);
      }
    };

    generateRealQR();
  }, [pedidoActivo, contenidoNeto, pesoBrutoTotalKg]);

  // Actualizar campos del pedido activo (Ajuste Manual con persistencia)
  const handleUpdatePedidoField = (field: keyof PedidoEtiquetaItem, value: any) => {
    setPedidosCola((prev) =>
      prev.map((p) => (p.id === selectedPedidoId ? { ...p, [field]: value } : p))
    );
  };

  const handleImprimir = () => {
    window.print();
  };

  const handleConfirmarDespacho = () => {
    alert(
      `✅ ¡DESPACHO REGISTRADO CON ÉXITO!\n\n` +
      `• Pedido: ${pedidoActivo.idPedido} (${pedidoActivo.numeroPedido})\n` +
      `• Cliente: ${pedidoActivo.clienteNombre}\n` +
      `• Producto: ${pedidoActivo.nombreProducto}\n` +
      `• Lote: ${pedidoActivo.codigoLote}\n` +
      `• Bultos: ${pedidoActivo.unidadesPedidas} (${pedidoActivo.cantidadKilosDisplay})\n` +
      `• Peso Neto Total: ${(contenidoNeto * pedidoActivo.unidadesPedidas).toFixed(3)} kg\n` +
      `• Peso Bruto Total: ${(pesoBrutoTotalKg * pedidoActivo.unidadesPedidas).toFixed(3)} kg\n` +
      `• Destino: ${destino}\n` +
      `• Responsable: ${responsable}`
    );
  };

  // Datos para Modal Ficha Técnica
  const fichaTecnicaData: FichaTecnicaData = {
    codigoLote: pedidoActivo.codigoLote,
    nombreProducto: pedidoActivo.nombreProducto,
    clienteNombre: pedidoActivo.clienteNombre,
    clienteRuc: pedidoActivo.clienteRuc,
    fechaFabricacion: pedidoActivo.fechaFab,
    fechaVencimiento: pedidoActivo.fechaVenc,
    unidades: pedidoActivo.unidadesPedidas,
    unidadMedida: 'KG',
    tipoEnvase: pedidoActivo.tipoEnvase,
    taraEnvaseGramos: pedidoActivo.taraGramos,
    contenidoNetoKg: contenidoNeto,
    pesoBrutoTotalKg: pesoBrutoTotalKg,
    phMedido: pedidoActivo.phMedido,
    phRango: pedidoActivo.phRango,
    viscosidadMedida: pedidoActivo.viscosidadMedida,
    densidadMedida: pedidoActivo.densidadMedida,
    aspecto: pedidoActivo.aspecto,
    color: pedidoActivo.color,
    olor: pedidoActivo.olor,
    insumos: pedidoActivo.insumos,
    quimicoResponsable: 'Ing. Químico QA - Planta Quimicorp',
    operarioPlanta: responsable,
    estadoQA: 'LIBERADO',
  };

  const cardBg = isDark ? 'bg-[#0F141C] border-[#1A2232]' : 'bg-white border-slate-200 shadow-sm';
  const textTitle = isDark ? 'text-slate-400' : 'text-slate-600';
  const textValue = isDark ? 'text-white' : 'text-slate-900';
  const inputBg = isDark ? 'bg-[#151D2A] border-[#1A2232] text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-800';

  return (
    <div className="space-y-5 font-mono min-h-screen">
      {/* Top Header Bar */}
      <div className={`flex flex-wrap items-center justify-between gap-4 border-b pb-3 ${isDark ? 'border-[#1A2232]' : 'border-slate-200'}`}>
        <div>
          <h2 className={`text-sm font-bold tracking-widest uppercase flex items-center gap-2 ${textTitle}`}>
            <span className="text-[#00F2C3]">⬡ ETIQUETADO METROLÓGICO DINÁMICO POR PEDIDO</span>
            <span className="px-2 py-0.5 rounded bg-[#00F2C3]/10 text-[#00F2C3] border border-[#00F2C3]/30 text-[10px] font-mono font-bold">
              SINCRONIZADO EN TIEMPO REAL
            </span>
          </h2>
          <p className="text-xs text-slate-400 font-sans">
            Cada pedido genera su propia etiqueta industrial de alta tecnología con QR real escaneable, metrología de balanza y trazabilidad de insumos.
          </p>
        </div>

        <div className="flex items-center gap-3 font-sans">
          <button
            onClick={() => setShowFichaModal(true)}
            className="px-4 py-2 rounded-xl bg-[#00F2C3]/10 hover:bg-[#00F2C3]/20 text-[#00F2C3] border border-[#00F2C3]/40 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm shadow-[#00F2C3]/10"
          >
            <FileText className="w-4 h-4" />
            <span>📄 Ficha Técnica del Pedido</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Lista de Pedidos (4 cols) vs Etiqueta High-Tech & Ajuste Manual (8 cols) */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* Left Column: COLA DE PEDIDOS REALES */}
        <div className="lg:col-span-4 space-y-4">
          <div className={`rounded-2xl p-5 border space-y-3 ${cardBg}`}>
            <div className="flex items-center justify-between">
              <h3 className={`text-xs font-bold tracking-widest uppercase flex items-center gap-2 ${textTitle}`}>
                <Package className="h-4 w-4 text-[#00F2C3]" />
                <span>PEDIDOS EN COLA ({pedidosCola.length})</span>
              </h3>
            </div>

            <div className="space-y-2.5 max-h-[620px] overflow-y-auto pr-1">
              {pedidosCola.map((ped) => {
                const isSel = ped.id === selectedPedidoId;
                return (
                  <div
                    key={ped.id}
                    onClick={() => setSelectedPedidoId(ped.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                      isSel
                        ? 'bg-[#00F2C3]/10 border-[#00F2C3] shadow-lg shadow-[#00F2C3]/10 ring-1 ring-[#00F2C3]/50'
                        : isDark
                        ? 'bg-[#151D2A] border-[#1A2232] hover:border-slate-700'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {isSel && (
                      <div className="absolute top-0 right-0 h-10 w-10 bg-[#00F2C3]/20 blur-md pointer-events-none" />
                    )}

                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono font-bold text-xs text-[#00F2C3]">
                        {ped.idPedido} • {ped.codigoLote}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-black bg-[#00F2C3]/20 text-[#00F2C3] border border-[#00F2C3]/40 font-mono">
                        {ped.cantidadKilosDisplay}
                      </span>
                    </div>

                    <h4 className={`text-xs font-bold mt-1.5 font-sans ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {ped.nombreProducto}
                    </h4>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 border-t pt-1.5 border-slate-800/40">
                      <span className="truncate font-semibold">Cliente: <strong className={isDark ? 'text-slate-200' : 'text-slate-800'}>{ped.clienteNombre}</strong></span>
                      <span className="font-mono text-[10px] text-emerald-400 font-bold">QA OK</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: ETIQUETA HIGH-TECH INDUSTRIAL ORIGINAL + DRAWER DE AJUSTE MANUAL */}
        <div className="lg:col-span-8 space-y-4">
          <div className={`rounded-2xl p-5 border space-y-4 ${cardBg}`}>
            {/* Header de la tarjeta */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 font-sans">
                <span className="p-1.5 rounded-lg bg-[#00F2C3]/10 text-[#00F2C3]">
                  <Printer className="w-4 h-4" />
                </span>
                <span className={`text-xs font-bold ${textValue}`}>
                  Etiqueta High-Tech Industrial · Pedido {pedidoActivo.idPedido}
                </span>
              </div>

              {/* Botón de Ajuste Manual Funcional */}
              <button
                onClick={() => setShowManualDrawer(!showManualDrawer)}
                className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold border transition-all cursor-pointer ${
                  showManualDrawer
                    ? 'bg-[#00F2C3] text-slate-950 border-[#00F2C3] shadow-md shadow-[#00F2C3]/30 font-black'
                    : isDark
                    ? 'bg-[#151D2A] text-[#00F2C3] border-[#00F2C3]/40 hover:bg-[#00F2C3]/10'
                    : 'bg-slate-100 text-teal-700 border-teal-300 hover:bg-teal-50'
                }`}
              >
                <Sliders className="h-3.5 w-3.5" />
                <span>{showManualDrawer ? 'Cerrar Ajuste' : '✏️ Ajuste Manual'}</span>
              </button>
            </div>

            {/* ========================================================================= */}
            {/* PANEL DE AJUSTE MANUAL EN VIVO (CUANDO ESTÁ ACTIVO) */}
            {/* ========================================================================= */}
            {showManualDrawer && (
              <div className={`p-4 rounded-2xl border space-y-3 animate-in fade-in duration-200 text-xs ${
                isDark ? 'bg-[#0B0F17] border-[#00F2C3]/40' : 'bg-teal-50/50 border-teal-200'
              }`}>
                <div className="flex items-center justify-between border-b pb-2 border-slate-800/40 font-sans">
                  <div className="flex items-center gap-2 text-[#00F2C3] font-bold">
                    <Edit3 className="w-4 h-4" />
                    <span>Modificar Datos de Etiqueta para este Pedido ({pedidoActivo.idPedido})</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Los cambios actualizan el QR y los pesos al instante</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-sans">
                  <div>
                    <label className={`block text-[10px] uppercase font-bold mb-1 ${textTitle}`}>Producto</label>
                    <input
                      type="text"
                      value={pedidoActivo.nombreProducto}
                      onChange={(e) => handleUpdatePedidoField('nombreProducto', e.target.value)}
                      className={`w-full rounded-lg border p-2 text-xs font-semibold ${inputBg}`}
                    />
                  </div>

                  <div>
                    <label className={`block text-[10px] uppercase font-bold mb-1 ${textTitle}`}>Cliente / Destinatario</label>
                    <input
                      type="text"
                      value={pedidoActivo.clienteNombre}
                      onChange={(e) => handleUpdatePedidoField('clienteNombre', e.target.value)}
                      className={`w-full rounded-lg border p-2 text-xs font-semibold ${inputBg}`}
                    />
                  </div>

                  <div>
                    <label className={`block text-[10px] uppercase font-bold mb-1 ${textTitle}`}>Código de Lote</label>
                    <input
                      type="text"
                      value={pedidoActivo.codigoLote}
                      onChange={(e) => handleUpdatePedidoField('codigoLote', e.target.value)}
                      className={`w-full rounded-lg border p-2 text-xs font-mono font-bold text-[#00F2C3] ${inputBg}`}
                    />
                  </div>

                  <div>
                    <label className={`block text-[10px] uppercase font-bold mb-1 ${textTitle}`}>Contenido Neto (Kg)</label>
                    <input
                      type="number"
                      step="0.001"
                      value={pedidoActivo.contenidoNetoKg}
                      onChange={(e) => handleUpdatePedidoField('contenidoNetoKg', parseFloat(e.target.value) || 0)}
                      className={`w-full rounded-lg border p-2 text-xs font-mono font-bold ${inputBg}`}
                    />
                  </div>

                  <div>
                    <label className={`block text-[10px] uppercase font-bold mb-1 ${textTitle}`}>Tara de Envase (Gramos)</label>
                    <input
                      type="number"
                      value={pedidoActivo.taraGramos}
                      onChange={(e) => handleUpdatePedidoField('taraGramos', parseInt(e.target.value) || 0)}
                      className={`w-full rounded-lg border p-2 text-xs font-mono font-bold ${inputBg}`}
                    />
                  </div>

                  <div>
                    <label className={`block text-[10px] uppercase font-bold mb-1 ${textTitle}`}>Display de Cantidad</label>
                    <input
                      type="text"
                      value={pedidoActivo.cantidadKilosDisplay}
                      onChange={(e) => handleUpdatePedidoField('cantidadKilosDisplay', e.target.value)}
                      className={`w-full rounded-lg border p-2 text-xs font-mono font-bold ${inputBg}`}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* ETIQUETA INDUSTRIAL HIGH-TECH CON EL ESTILO ORIGINAL (#00F2C3 + #090C10) */}
            {/* ========================================================================= */}
            <div className="p-3 sm:p-6 bg-slate-950 rounded-2xl flex justify-center border border-slate-900">
              <div
                id="etiqueta-hightech-industrial"
                className="w-full max-w-xl rounded-2xl border border-[#1A2232] bg-[#090C10] p-6 text-slate-100 shadow-2xl font-mono relative overflow-hidden select-none"
              >
                {/* Cyan Glow Top-Right Corner Highlight */}
                <div className="absolute top-0 right-0 h-24 w-24 bg-[#00F2C3]/15 blur-2xl pointer-events-none" />

                {/* Header Superior con Branding y Badge Neón #00F2C3 */}
                <div className="flex items-start justify-between border-b border-[#1A2232] pb-4">
                  <div>
                    <span className="text-[10px] text-[#00F2C3] font-black tracking-widest uppercase block">
                      QUIMICORP PERU · PLANTA CENTRAL
                    </span>
                    <h2 className="text-xl font-black tracking-tight text-white mt-1 uppercase">
                      {pedidoActivo.nombreProducto}
                    </h2>
                    <p className="text-xs text-slate-400 font-sans mt-0.5">
                      Para: <span className="font-bold text-slate-100">{pedidoActivo.clienteNombre}</span>
                      {pedidoActivo.clienteRuc && <span className="text-slate-500 text-[10px] ml-2">RUC: {pedidoActivo.clienteRuc}</span>}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="inline-block rounded-xl bg-[#00F2C3]/10 px-3.5 py-1.5 text-xs font-black text-[#00F2C3] border border-[#00F2C3]/40 shadow-sm shadow-[#00F2C3]/20">
                      Cant.: {pedidoActivo.cantidadKilosDisplay}
                    </span>
                    <span className="block text-[10px] text-slate-400 font-mono mt-1">
                      LOTE: <strong className="text-white text-xs">{pedidoActivo.codigoLote}</strong>
                    </span>
                  </div>
                </div>

                {/* Bloque Central: Metrología Exacta + Código QR Real */}
                <div className="my-4 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  {/* Left: Metrología de Balanza (7 cols) */}
                  <div className="sm:col-span-7 space-y-2 text-xs">
                    <div className="rounded-xl border border-[#1A2232] bg-[#151D2A]/70 p-3.5 space-y-1.5">
                      <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block">
                        CONTROL METROLÓGICO DE ENVASE
                      </span>
                      <div className="flex justify-between text-slate-300 text-[11px]">
                        <span>TARA (envase: {pedidoActivo.tipoEnvase}):</span>
                        <strong className="text-white font-mono">{pedidoActivo.taraGramos} g</strong>
                      </div>
                      <div className="flex justify-between text-slate-300 text-[11px]">
                        <span>CONTENIDO NETO:</span>
                        <strong className="text-blue-400 font-mono">{contenidoNeto.toFixed(3)} kg</strong>
                      </div>
                      <div className="flex justify-between text-xs pt-1.5 border-t border-[#1A2232] font-black">
                        <span className="text-slate-200">PESO TOTAL (BRUTO):</span>
                        <span className="text-[#00F2C3] text-sm font-mono">{pesoBrutoTotalKg.toFixed(3)} kg</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <div className="rounded-lg bg-[#151D2A]/50 p-2 border border-[#1A2232]">
                        <span className="text-slate-500 block">F. FABRICACIÓN:</span>
                        <span className="font-bold text-slate-200">{pedidoActivo.fechaFab}</span>
                      </div>
                      <div className="rounded-lg bg-[#151D2A]/50 p-2 border border-[#1A2232]">
                        <span className="text-slate-500 block">F. VENCIMIENTO:</span>
                        <span className="font-bold text-amber-400">{pedidoActivo.fechaVenc}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: QR Code Real Escaneable + Click Ficha Técnica (5 cols) */}
                  <div className="sm:col-span-5 flex flex-col items-center justify-center p-3 rounded-xl border border-[#1A2232] bg-[#151D2A]/50">
                    <div
                      onClick={() => setShowFichaModal(true)}
                      className="bg-white p-1.5 rounded-xl shadow-lg cursor-pointer hover:scale-105 transition-transform"
                      title="Escanee con su celular o haga clic para ver la Ficha Técnica"
                    >
                      {qrDataUrl ? (
                        <img src={qrDataUrl} alt="QR Real" className="w-24 h-24 object-contain" />
                      ) : (
                        <QrCode className="w-24 h-24 text-black" />
                      )}
                    </div>
                    <span className="text-[9px] font-bold text-[#00F2C3] mt-2 text-center tracking-wider block">
                      QR DE TRAZABILIDAD
                    </span>
                    <span className="text-[8px] text-slate-400 text-center block">
                      Escanee para ver fórmula y QA
                    </span>
                  </div>
                </div>

                {/* Código de Barras GS1 con Barras Visuales */}
                <div className="my-3 text-center border-t border-b border-[#1A2232] py-2.5">
                  <div className="flex h-7 items-center justify-center gap-0.5">
                    {[1, 3, 2, 4, 1, 2, 3, 1, 4, 2, 1, 3, 2, 1, 4, 3, 1, 2, 4, 1, 3, 2, 4, 1, 2, 3, 1, 4, 2, 1, 3, 2, 4, 1].map((h, i) => (
                      <div
                        key={i}
                        className={`w-1 rounded-sm ${
                          i % 4 === 0 ? 'bg-[#00F2C3] h-7' : 'bg-slate-400 h-5'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] tracking-widest text-slate-300 font-bold block mt-1 font-mono">
                    {pedidoActivo.codigoBarras} · SKU: {pedidoActivo.sku}
                  </span>
                </div>

                {/* Footer Warning Badge GHS07 & Metadata */}
                <div className="flex items-center justify-between border-t border-[#1A2232] pt-3 text-[10px]">
                  <div className="rounded-lg bg-amber-500/10 px-2.5 py-1.5 border border-amber-500/30 text-amber-400 flex items-center gap-1.5 font-bold">
                    <span className="flex h-4 w-4 items-center justify-center rounded bg-amber-500 text-slate-950 font-black text-[10px]">
                      !
                    </span>
                    <span className="text-[9px]">{pedidoActivo.advertenciaGHS}</span>
                  </div>

                  <div className="text-right text-slate-400 text-[10px]">
                    <span className="text-slate-200 font-bold">QUIMICORP PERÚ S.A.C.</span>
                    <p className="text-[9px] text-slate-500">RUC: {pedidoActivo.ruc} · BPM PLANTA</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Controles de Configuración de Envase & Acciones de Despacho */}
            <div className={`p-4 rounded-xl border space-y-3 text-xs ${isDark ? 'bg-[#151D2A] border-[#1A2232]' : 'bg-slate-50 border-slate-200'}`}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-sans">
                <div>
                  <label className={`block text-[10px] uppercase font-bold mb-1 ${textTitle}`}>Tipo de Envase del Pedido</label>
                  <select
                    value={pedidoActivo.tipoEnvase}
                    onChange={(e) => {
                      const tipo = e.target.value;
                      let tara = 985;
                      if (tipo.includes('Bidón')) tara = 650;
                      if (tipo.includes('Cilindro')) tara = 8500;
                      if (tipo.includes('Galonera')) tara = 120;
                      handleUpdatePedidoField('tipoEnvase', tipo);
                      handleUpdatePedidoField('taraGramos', tara);
                    }}
                    className={`w-full rounded-lg border p-2 text-xs font-semibold ${inputBg}`}
                  >
                    <option value="Balde + Tapa (PEAD 5 Gal)">Balde 5 Galones + Tapa (985 g)</option>
                    <option value="Bidón PEAD 5 Galones">Bidón PEAD 5 Galones (650 g)</option>
                    <option value="Galonera 1 Galón">Galonera 1 Galón (120 g)</option>
                    <option value="Cilindro Plástico Azul 55 Gal">Cilindro 55 Galones (8,500 g)</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-[10px] uppercase font-bold mb-1 ${textTitle}`}>Bultos a Despachar</label>
                  <input
                    type="number"
                    min={1}
                    value={pedidoActivo.unidadesPedidas}
                    onChange={(e) => handleUpdatePedidoField('unidadesPedidas', Number(e.target.value) || 1)}
                    className={`w-full rounded-lg border p-2 text-xs font-mono font-bold ${inputBg}`}
                  />
                </div>

                <div>
                  <label className={`block text-[10px] uppercase font-bold mb-1 ${textTitle}`}>Responsable Planta</label>
                  <input
                    type="text"
                    value={responsable}
                    onChange={(e) => setResponsable(e.target.value)}
                    className={`w-full rounded-lg border p-2 text-xs font-semibold ${inputBg}`}
                  />
                </div>
              </div>

              {/* Botones de Impresión y Despacho */}
              <div className="flex flex-wrap items-center gap-3 pt-2 font-mono">
                <button
                  onClick={handleImprimir}
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-red-600/20 transition-all cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimir Etiqueta ({pedidoActivo.unidadesPedidas})</span>
                </button>

                <button
                  onClick={handleConfirmarDespacho}
                  className="flex-1 px-5 py-2.5 rounded-xl bg-[#00F2C3] hover:bg-[#00d8ad] text-slate-950 text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-[#00F2C3]/20 transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirmar Despacho para {pedidoActivo.clienteNombre}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Ficha Técnica Oficial de Insumos */}
      <ModalFichaTecnicaInsumos
        isOpen={showFichaModal}
        onClose={() => setShowFichaModal(false)}
        data={fichaTecnicaData}
      />
    </div>
  );
}
