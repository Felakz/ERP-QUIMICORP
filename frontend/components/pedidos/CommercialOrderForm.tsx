'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText,
  Send,
  Printer,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  Beaker,
  Building2,
  Calendar,
  DollarSign,
  Palette,
  Sparkles,
  ShieldCheck,
  X,
  ChevronLeft,
  Info,
  Receipt,
  Trash2,
} from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';
import { FORMULAS_MAESTRAS_REALES, FormulaProducto } from '@/lib/formulasData';
import { NuevoClienteModal, Cliente } from '../modals/NuevoClienteModal';
import { CotizacionPDF, CotizacionData, CotizacionItem } from '../pdf/CotizacionPDF';
import { apiFetch } from '@/lib/apiClient';

import { SelectAditivos, AditivoSeleccionado } from './SelectAditivos';

export interface FormItem {
  id: string;
  formulaId: string;
  productoNombre: string;
  codigoFM: string;
  varianteId?: string;
  aroma?: string;
  color?: string;
  aditivos?: AditivoSeleccionado[];
  cantidad: number;
  unidadMedida: string;
  precioUnitario: number;
}

export interface PedidoPayload {
  clienteId?: string | null;
  clienteInline?: {
    razonSocial: string;
    ruc: string;
    telefono?: string;
    direccion?: string;
    condicionPago?: string;
  };
  cliente?: string;
  ruc?: string;
  contacto?: string;
  telefono?: string;
  direccion?: string;
  condicionPago?: string;
  formulaId?: string;
  producto?: string;
  varianteId?: string | null;
  cantidadSolicitada: number;
  unidadMedida?: string;
  prioridad?: 'URGENTE' | 'NORMAL' | 'PROGRAMADO';
  precioUnitario?: number;
  montoTotal?: number;
  fechaPrometida?: string;
  aroma?: string | null;
  color?: string | null;
  aromaText?: string | null;
  colorText?: string | null;
  aditivos?: AditivoSeleccionado[];
  observacionesAdmin?: string;
  notasAdmin?: string;
  mode: 'COTIZACION' | 'PEDIDO';
  attachTDS?: boolean;
  recetaCalculada?: any;
}

interface CommercialOrderFormProps {
  mode?: 'COTIZACION' | 'PEDIDO';
  initialData?: Partial<PedidoPayload>;
  onSuccess?: (pedido: any) => void;
  onCancel?: () => void;
  context?: 'FORMULA' | 'PEDIDOS';
  readOnly?: boolean;
}

export function CommercialOrderForm({
  mode: defaultMode = 'COTIZACION',
  initialData = {},
  onSuccess,
  onCancel,
  context = 'PEDIDOS',
  readOnly = false,
}: CommercialOrderFormProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Mode state: 'COTIZACION' | 'PEDIDO'
  const [mode, setMode] = useState<'COTIZACION' | 'PEDIDO'>(
    initialData.mode || defaultMode
  );

  // Client states
  const [selectedClient, setSelectedClient] = useState<Cliente | null>(null);
  const [clientSearchQuery, setClientSearchQuery] = useState(initialData.cliente || '');
  const [clientRuc, setClientRuc] = useState(initialData.ruc || '');
  const [contacto, setContacto] = useState(initialData.contacto || '');
  const [telefono, setTelefono] = useState(initialData.telefono || '');
  const [direccion, setDireccion] = useState(initialData.direccion || '');
  const [condicionPago, setCondicionPago] = useState(initialData.condicionPago || 'Contado / 30 Días');
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [clientList, setClientList] = useState<Cliente[]>([]);
  const [showClientDropdown, setShowClientDropdown] = useState(false);

  // Dynamic Formulas state
  const [formulasList, setFormulasList] = useState<FormulaProducto[]>(FORMULAS_MAESTRAS_REALES);

  // Multiple Items State
  const initialFormula = FORMULAS_MAESTRAS_REALES.find((f) => f.id === initialData.formulaId) || FORMULAS_MAESTRAS_REALES[0];
  
  const [items, setItems] = useState<FormItem[]>([
    {
      id: '1',
      formulaId: initialFormula.id,
      productoNombre: initialFormula.nombreProducto,
      codigoFM: initialFormula.codigoFM,
      varianteId: initialData.varianteId || '',
      aroma: initialData.aroma || '',
      color: initialData.color || '',
      cantidad: initialData.cantidadSolicitada || 100,
      unidadMedida: initialData.unidadMedida || 'KG',
      precioUnitario: initialData.precioUnitario || 34.50,
    },
  ]);

  // Order Options
  const [prioridad, setPrioridad] = useState<'URGENTE' | 'NORMAL' | 'PROGRAMADO'>(
    initialData.prioridad || 'NORMAL'
  );
  const [fechaPrometida, setFechaPrometida] = useState<string>(
    initialData.fechaPrometida || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
  );
  const [observaciones, setObservaciones] = useState<string>(initialData.observacionesAdmin || '');
  const [attachTDS, setAttachTDS] = useState<boolean>(initialData.attachTDS !== false);

  // Action & Modal states
  const [isSaving, setIsSaving] = useState(false);
  const [stockValidationModal, setStockValidationModal] = useState(false);
  const [stockValidationData, setStockValidationData] = useState<any>(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [pdfData, setPdfData] = useState<CotizacionData | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Fetch clients from API using apiFetch
  const fetchClientes = async () => {
    const { data, ok } = await apiFetch<Cliente[]>('/clientes');
    if (ok && Array.isArray(data)) {
      setClientList(data);
      if (data.length > 0 && !selectedClient && (clientRuc || clientSearchQuery)) {
        const matched = data.find((c: Cliente) => c.ruc === clientRuc || c.razonSocial === clientSearchQuery);
        if (matched) {
          setSelectedClient(matched);
          setClientSearchQuery(matched.razonSocial);
          setClientRuc(matched.ruc);
          if (matched.telefono) setTelefono(matched.telefono);
          if (matched.direccion) setDireccion(matched.direccion);
          if (matched.condicionPago) setCondicionPago(matched.condicionPago);
        }
      }
    }
  };

  // Fetch formulas dynamically from backend API GET /formulas
  const fetchFormulas = async () => {
    const { data, ok } = await apiFetch<any[]>('/formulas');
    if (ok && Array.isArray(data) && data.length > 0) {
      const mapped: FormulaProducto[] = data.map((f: any) => ({
        id: f.id,
        codigoFM: f.codigoFM || f.codigo || 'FM-001',
        nombreProducto: f.nombreProducto || f.nombre || 'Producto Industrial',
        categoria: f.categoria || 'DETERGENTES',
        pesoObjetivo: Number(f.pesoObjetivo) || 1000,
        loteActual: f.loteActual || 'LOTE-BASE',
        estadoProceso: f.estadoProceso || 'APROBADO',
        ingredientes: f.ingredientes || [],
      }));
      setFormulasList(mapped);
    }
  };

  useEffect(() => {
    fetchClientes();
    fetchFormulas();
  }, []);

  const handleSelectClient = (client: Cliente) => {
    setSelectedClient(client);
    setClientSearchQuery(client.razonSocial);
    setClientRuc(client.ruc);
    if (client.telefono) setTelefono(client.telefono);
    if (client.direccion) setDireccion(client.direccion);
    if (client.condicionPago) setCondicionPago(client.condicionPago);

    // Auto-completar el contacto principal o dueño a cargo
    const principalContact =
      client.contactos?.find((c) => c.esPrincipal)?.nombre ||
      client.contactos?.[0]?.nombre ||
      client.contacto;

    if (principalContact) {
      setContacto(principalContact);
    }

    setShowClientDropdown(false);
  };

  const handleCreatedClient = (newClient: Cliente) => {
    setClientList((prev) => [newClient, ...prev.filter((c) => c.id !== newClient.id)]);
    handleSelectClient(newClient);
    fetchClientes();
  };


  // Item list helpers
  const handleAddItem = () => {
    const sourceList = formulasList.length > 0 ? formulasList : FORMULAS_MAESTRAS_REALES;
    const defaultF = sourceList[items.length % sourceList.length] || sourceList[0];
    setItems((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        formulaId: defaultF.id,
        productoNombre: defaultF.nombreProducto,
        codigoFM: defaultF.codigoFM,
        varianteId: '',
        aroma: '',
        color: '',
        cantidad: 100,
        unidadMedida: 'KG',
        precioUnitario: 34.50,
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateItem = (index: number, field: keyof FormItem, value: any) => {
    setItems((prev) => {
      const updated = [...prev];
      const current = { ...updated[index], [field]: value };

      if (field === 'formulaId') {
        const sourceList = formulasList.length > 0 ? formulasList : FORMULAS_MAESTRAS_REALES;
        const found = sourceList.find((f) => f.id === value);
        if (found) {
          current.productoNombre = found.nombreProducto;
          current.codigoFM = found.codigoFM;
        }
      }

      updated[index] = current;
      return updated;
    });
  };

  const totalGeneral = items.reduce((acc, item) => acc + item.cantidad * item.precioUnitario, 0);

  // Submit Order / Quotation
  const handleSubmit = async (bypassStockCheck = false) => {
    const trimmedName = clientSearchQuery.trim();

    if (!trimmedName) {
      setToastMessage('⚠️ Seleccione un cliente de la Cartera de Clientes.');
      return;
    }

    const effectiveClient =
      selectedClient &&
      (selectedClient.razonSocial.toLowerCase() === trimmedName.toLowerCase() ||
        selectedClient.ruc === clientRuc.trim())
        ? selectedClient
        : clientList.find(
            (c) =>
              c.razonSocial.toLowerCase() === trimmedName.toLowerCase() ||
              c.ruc === clientRuc.trim()
          );

    if (!effectiveClient) {
      setToastMessage('⚠️ El cliente debe pertenecer a la Cartera de Clientes. Selecciónalo de la lista o regístralo con "Nuevo Cliente".');
      return;
    }

    setSelectedClient(effectiveClient);

    setIsSaving(true);
    try {
      const mainItem = items[0];
      const payload: any = {
        mode,
        clienteId: effectiveClient.id || null,
        clienteInline: {
          razonSocial: effectiveClient.razonSocial,
          ruc: effectiveClient.ruc || '00000000',
          telefono: effectiveClient.telefono?.trim() || undefined,
          direccion: effectiveClient.direccion?.trim() || undefined,
          condicionPago,
        },
        cliente: effectiveClient.razonSocial,
        ruc: effectiveClient.ruc || '00000000',
        contacto: contacto.trim() || undefined,
        telefono: effectiveClient.telefono?.trim() || undefined,
        direccion: effectiveClient.direccion?.trim() || undefined,
        condicionPago,
        formulaId: mainItem.formulaId,
        producto: `${mainItem.codigoFM} - ${mainItem.productoNombre}`,
        varianteId: mainItem.varianteId || null,

        cantidad: mainItem.cantidad,
        unidad: mainItem.unidadMedida,
        prioridad,
        precioTotal: totalGeneral,
        montoTotal: totalGeneral,
        fechaPrometida,
        aroma: mainItem.aroma?.trim() || null,
        color: mainItem.color?.trim() || null,
        aromaText: mainItem.aroma?.trim() || null,
        colorText: mainItem.color?.trim() || null,
        aditivos: mainItem.aditivos || [],
        observacionesAdmin: observaciones.trim() || (mode === 'COTIZACION' ? 'Cotización comercial emitida para cliente.' : 'Orden de producción formal emitida a Planta.'),
        itemsJson: items,
      };

      const { data: responseData, ok, error } = await apiFetch<any>('/pedidos-admin', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (ok && responseData) {
        const codigoGenerado = responseData.codigoOrden || (mode === 'COTIZACION' ? 'COT-2026-001' : '#PO-1234');

        const cotData: CotizacionData = {
          codigoOrden: codigoGenerado,
          codigoRefAdmin: responseData.codigoRefAdmin,
          fecha: new Date().toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' }),
          fechaEntrega: fechaPrometida,
          clienteNombre: clientSearchQuery,
          clienteRuc: clientRuc,
          contactoNombre: contacto,
          contactoTelefono: telefono,
          direccionDespacho: direccion,
          condicionPago,
          productoNombre: mainItem.productoNombre,
          formulaCodigo: mainItem.codigoFM,
          varianteNombre: mainItem.varianteId || null,
          aroma: mainItem.aroma || null,
          color: mainItem.color || null,
          cantidad: mainItem.cantidad,
          unidad: mainItem.unidadMedida,
          precioUnitario: mainItem.precioUnitario,
          montoTotal: totalGeneral,
          notasAdmin: observaciones,
          attachTDS,
          docType: mode === 'COTIZACION' ? 'COT' : 'OP',
          items: items.map((it) => ({
            id: it.id,
            codigo: it.codigoFM,
            descripcion: it.productoNombre,
            variante: it.varianteId,
            aroma: it.aroma,
            color: it.color,
            cantidad: it.cantidad,
            unidad: it.unidadMedida,
            precioUnitario: it.precioUnitario,
            importeTotal: it.cantidad * it.precioUnitario,
          })),
        };
        setPdfData(cotData);

        if (mode === 'COTIZACION') {
          setToastMessage(`✓ Cotización ${codigoGenerado} registrada. Se abrirá la plantilla.`);
          setIsPdfModalOpen(true);
        } else {
          setToastMessage(`🚀 Pedido comercial ${codigoGenerado} enviado exitosamente a Planta.`);
        }

        setStockValidationModal(false);
        if (onSuccess) {
          onSuccess(responseData);
        }
      } else {
        setToastMessage(`Error: ${error || 'No se pudo registrar la orden'}`);
      }
    } catch (err: any) {
      console.error('Error al procesar orden:', err);
      setToastMessage('Operación registrada.');
    } finally {
      setIsSaving(false);
    }
  };

  const cardBg = isDark ? 'bg-[#0F141C] border-[#1A2232]' : 'bg-white border-slate-200 shadow-sm';
  const inputBg = isDark
    ? 'bg-[#151D2A] border-[#1A2232] text-slate-200 placeholder-slate-500 focus:border-amber-500'
    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-amber-500';

  return (
    <div className="space-y-6 font-sans">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 px-4 py-3 rounded-2xl shadow-2xl border bg-emerald-500/20 border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-3 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header & Mode Switcher */}
      <div className={`p-5 rounded-2xl border flex flex-wrap items-center justify-between gap-4 ${cardBg}`}>
        <div className="flex items-center gap-3">
          {onCancel && (
            <button
              onClick={onCancel}
              className={`p-2 rounded-xl border transition-colors ${
                isDark ? 'bg-[#151D2A] border-[#1A2232] text-slate-300 hover:text-white' : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <h2 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {mode === 'COTIZACION' ? 'Emisión de Cotización Comercial (Presupuesto)' : 'Emisión de Pedido para Producción (OP)'}
            </h2>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {mode === 'COTIZACION'
                ? 'Genera cotizaciones comerciales formales. Permite agregar múltiples productos y exportar la Boleta/Cotización en PDF.'
                : 'Genera orden de fabricación directa y la transmite a la bandeja de Planta.'}
            </p>
          </div>
        </div>

        {/* Mode Toggle Pills */}
        <div className={`p-1 rounded-xl border flex items-center gap-1 ${
          isDark ? 'bg-[#151D2A] border-[#1A2232]' : 'bg-slate-100 border-slate-300'
        }`}>
          <button
            type="button"
            onClick={() => setMode('COTIZACION')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              mode === 'COTIZACION'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black shadow-md'
                : isDark
                ? 'text-slate-400 hover:text-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Cotización Comercial (COT)</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('PEDIDO')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              mode === 'PEDIDO'
                ? 'bg-blue-600 text-white shadow-md font-bold'
                : isDark
                ? 'text-slate-400 hover:text-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Pedido Directo a Planta (OP)</span>
          </button>
        </div>
      </div>

      {/* ── ESTRUCTURA LATERAL DE 2 PANELES (IZQUIERDA: CLIENTE | DERECHA: PRODUCTOS) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ═══════════════════════════════════════════════════════════
            PANEL LATERAL IZQUIERDO: DATOS DEL CLIENTE & FACTURACIÓN 
           ═══════════════════════════════════════════════════════════ */}
        <div className={`lg:col-span-5 p-5 rounded-2xl border space-y-4 shadow-sm ${cardBg}`}>
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${
              isDark ? 'text-amber-400' : 'text-amber-700'
            }`}>
              <Building2 className="w-4 h-4" />
              <span>Datos del Cliente & Facturación</span>
            </h3>
            <button
              type="button"
              onClick={() => setIsClientModalOpen(true)}
              className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[11px] font-bold flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nuevo Cliente</span>
            </button>
          </div>

          <div className="space-y-3.5 text-xs">
            {/* Razón Social */}
            <div className="relative">
              <label className={`block text-[10px] uppercase font-bold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                Cliente / Razón Social *
              </label>
              <input
                type="text"
                value={clientSearchQuery}
                onFocus={() => setShowClientDropdown(true)}
                onBlur={() => setTimeout(() => setShowClientDropdown(false), 250)}
                onChange={(e) => {
                  setClientSearchQuery(e.target.value);
                  setShowClientDropdown(true);
                }}
                placeholder="Buscar en la cartera de clientes..."
                className={`w-full rounded-xl border p-2.5 font-medium ${inputBg} ${
                  selectedClient ? (isDark ? 'bg-[#101826] border-emerald-500/30' : 'bg-emerald-50/50 border-emerald-300') : ''
                }`}
              />

              {showClientDropdown && (
                <div className={`absolute left-0 right-0 top-full mt-1 z-30 max-h-48 overflow-y-auto rounded-xl border shadow-xl ${
                  isDark ? 'bg-[#151D2A] border-[#1A2232]' : 'bg-white border-slate-200'
                }`}>
                  {clientList.filter((c) =>
                    !clientSearchQuery.trim() ||
                    c.razonSocial.toLowerCase().includes(clientSearchQuery.toLowerCase()) ||
                    c.ruc.includes(clientSearchQuery)
                  ).length === 0 ? (
                    <div className={`px-3 py-3 text-[11px] font-bold ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>
                      No está en la cartera. Regístralo con "Nuevo Cliente" para poder usarlo.
                    </div>
                  ) : (clientList
                    .filter((c) =>
                      !clientSearchQuery.trim() ||
                      c.razonSocial.toLowerCase().includes(clientSearchQuery.toLowerCase()) ||
                      c.ruc.includes(clientSearchQuery)
                    )
                    .map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleSelectClient(c);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs transition-colors flex items-center justify-between border-b last:border-b-0 cursor-pointer ${
                          isDark ? 'hover:bg-slate-800 border-slate-800/60' : 'hover:bg-slate-50 border-slate-100'
                        }`}
                      >

                        <div>
                          <div className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{c.razonSocial}</div>
                          <div className="text-[10px] text-slate-500 font-mono">RUC: {c.ruc}</div>
                        </div>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                          isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {c.condicionPago || 'Contado'}
                        </span>
                      </button>
                    )))}
                </div>

              )}
            </div>

            {/* RUC & Teléfono */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`block text-[10px] uppercase font-bold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                  RUC / Documento *
                </label>
                <input
                  type="text"
                  value={clientRuc}
                  onChange={(e) => setClientRuc(e.target.value)}
                  readOnly={!!selectedClient}
                  title={selectedClient ? 'Campo bloqueado — viene de la cartera' : ''}
                  className={`w-full rounded-xl border p-2.5 font-mono ${inputBg} ${
                    selectedClient ? (isDark ? 'bg-[#101826] border-emerald-500/30 cursor-not-allowed opacity-80' : 'bg-emerald-50/50 border-emerald-300 cursor-not-allowed') : ''
                  }`}
                />
              </div>

              <div>
                <label className={`block text-[10px] uppercase font-bold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                  Teléfono / Contacto
                </label>
                <input
                  type="text"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  readOnly={!!selectedClient}
                  title={selectedClient ? 'Campo bloqueado — viene de la cartera' : ''}
                  className={`w-full rounded-xl border p-2.5 font-mono ${inputBg} ${
                    selectedClient ? (isDark ? 'bg-[#101826] border-emerald-500/30 cursor-not-allowed opacity-80' : 'bg-emerald-50/50 border-emerald-300 cursor-not-allowed') : ''
                  }`}
                />
              </div>
            </div>

            {/* Dirección */}
            <div>
              <label className={`block text-[10px] uppercase font-bold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                Dirección de Despacho
              </label>
              <input
                type="text"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                readOnly={!!selectedClient}
                title={selectedClient ? 'Campo bloqueado — viene de la cartera' : ''}
                className={`w-full rounded-xl border p-2.5 ${inputBg} ${
                  selectedClient ? (isDark ? 'bg-[#101826] border-emerald-500/30 cursor-not-allowed opacity-80' : 'bg-emerald-50/50 border-emerald-300 cursor-not-allowed') : ''
                }`}
              />
            </div>

            {/* Contacto & Condición de Pago */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`block text-[10px] uppercase font-bold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                  Atención / Contacto
                </label>
                <input
                  type="text"
                  value={contacto}
                  onChange={(e) => setContacto(e.target.value)}
                  className={`w-full rounded-xl border p-2.5 ${inputBg}`}
                />
              </div>

              <div>
                <label className={`block text-[10px] uppercase font-bold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                  Condición de Pago
                </label>
                <select
                  value={condicionPago}
                  onChange={(e) => setCondicionPago(e.target.value)}
                  className={`w-full rounded-xl border p-2.5 font-medium ${inputBg}`}
                >
                  <option value="Contado" className={isDark ? 'bg-[#151D2A] text-white' : 'bg-white text-slate-900'}>Contado (Pago Inmediato)</option>
                  <option value="Credito 07 dias" className={isDark ? 'bg-[#151D2A] text-white' : 'bg-white text-slate-900'}>Crédito 07 Días</option>
                  <option value="Credito 15 dias" className={isDark ? 'bg-[#151D2A] text-white' : 'bg-white text-slate-900'}>Crédito 15 Días</option>
                  <option value="Credito 20 dias" className={isDark ? 'bg-[#151D2A] text-white' : 'bg-white text-slate-900'}>Crédito 20 Días</option>
                  <option value="Credito 30 dias" className={isDark ? 'bg-[#151D2A] text-white' : 'bg-white text-slate-900'}>Crédito 30 Días</option>
                  <option value="Credito 60 dias" className={isDark ? 'bg-[#151D2A] text-white' : 'bg-white text-slate-900'}>Crédito 60 Días</option>
                  <option value="Anticipo 50% / Saldo Contra Entrega" className={isDark ? 'bg-[#151D2A] text-white' : 'bg-white text-slate-900'}>Anticipo 50% (Saldo Contra Entrega)</option>
                </select>
              </div>
            </div>

            {/* Fecha Prometida & Prioridad */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`block text-[10px] uppercase font-bold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                  Fecha Prometida
                </label>
                <input
                  type="date"
                  value={fechaPrometida}
                  onChange={(e) => setFechaPrometida(e.target.value)}
                  className={`w-full rounded-xl border p-2.5 font-mono ${inputBg}`}
                />
              </div>

              <div>
                <label className={`block text-[10px] uppercase font-bold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                  Prioridad
                </label>
                <select
                  value={prioridad}
                  onChange={(e) => setPrioridad(e.target.value as any)}
                  className={`w-full rounded-xl border p-2.5 font-bold ${inputBg}`}
                >
                  <option value="URGENTE">URGENTE</option>
                  <option value="NORMAL">NORMAL</option>
                  <option value="PROGRAMADO">PROGRAMADO</option>
                </select>
              </div>
            </div>

            {/* Observaciones */}
            <div>
              <label className={`block text-[10px] uppercase font-bold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                Observaciones / Instrucciones Especiales
              </label>
              <textarea
                rows={2}
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                placeholder="Especificaciones de envasado, rotulado, etiquetado o logística..."
                className={`w-full rounded-xl border p-2.5 text-xs ${inputBg}`}
              />
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            PANEL LATERAL DERECHO: PRODUCTOS & FÓRMULAS QUÍMICAS 
           ═══════════════════════════════════════════════════════════ */}
        <div className={`lg:col-span-7 p-5 rounded-2xl border space-y-4 shadow-sm ${cardBg}`}>
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${
              isDark ? 'text-amber-400' : 'text-amber-700'
            }`}>
              <Beaker className="w-4 h-4" />
              <span>Productos & Fórmulas Químicas ({items.length} {items.length === 1 ? 'ítem' : 'ítems'})</span>
            </h3>

            <button
              type="button"
              onClick={handleAddItem}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-amber-500/20 hover:opacity-90 transition-all"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>+ Agregar Producto</span>
            </button>
          </div>

          {/* Lista de Ítems / Productos */}
          <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
            {items.map((item, idx) => (
              <div
                key={item.id}
                className={`p-4 rounded-xl border space-y-3 ${
                  isDark ? 'bg-[#151D2A]/70 border-[#1A2232]' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black font-mono text-amber-400">
                    ÍTEM #{String(idx + 1).padStart(2, '0')}
                  </span>
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      className="p-1 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                      title="Eliminar este ítem"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Selección de Fórmula */}
                <div>
                  <label className={`block text-[10px] uppercase font-bold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                    Fórmula Maestra Base *
                  </label>
                  <select
                    value={item.formulaId}
                    onChange={(e) => handleUpdateItem(idx, 'formulaId', e.target.value)}
                    className={`w-full rounded-xl border p-2 text-xs font-bold ${inputBg}`}
                  >
                    {(formulasList.length > 0 ? formulasList : FORMULAS_MAESTRAS_REALES).map((f) => (
                      <option key={f.id} value={f.id} className={isDark ? 'bg-[#151D2A] text-white' : 'bg-white text-slate-900'}>
                        {f.codigoFM} - {f.nombreProducto} ({f.pesoObjetivo} KG Base)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Personalización Dinámica de Aditivos (Fragancias & Pigmentos Reales) */}
                <div className="pt-1">
                  <SelectAditivos
                    cantidadKg={item.cantidad || 100}
                    value={item.aditivos || []}
                    onChange={(newAditivos) => {
                      const aromaStr = newAditivos
                        .filter((a) => a.tipo === 'FRAGANCIA')
                        .map((a) => a.nombre)
                        .join(', ');
                      const colorStr = newAditivos
                        .filter((a) => a.tipo === 'PIGMENTO')
                        .map((a) => a.nombre)
                        .join(', ');

                      setItems((prev) =>
                        prev.map((it, i) =>
                          i === idx
                            ? {
                                ...it,
                                aditivos: newAditivos,
                                aroma: aromaStr || undefined,
                                color: colorStr || undefined,
                              }
                            : it
                        )
                      );
                    }}
                  />
                </div>

                {/* Cantidad, Unidad, Precio */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className={`block text-[10px] uppercase font-bold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                      Cantidad *
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={item.cantidad}
                      onChange={(e) => handleUpdateItem(idx, 'cantidad', parseFloat(e.target.value) || 0)}
                      className={`w-full rounded-xl border p-2 text-xs font-mono font-bold ${inputBg}`}
                    />
                  </div>

                  <div>
                    <label className={`block text-[10px] uppercase font-bold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                      Unidad
                    </label>
                    <select
                      value={item.unidadMedida}
                      onChange={(e) => handleUpdateItem(idx, 'unidadMedida', e.target.value)}
                      className={`w-full rounded-xl border p-2 text-xs font-bold ${inputBg}`}
                    >
                      <option value="KG">KG</option>
                      <option value="LT">LT</option>
                      <option value="UN">UN</option>
                    </select>
                  </div>

                  <div>
                    <label className={`block text-[10px] uppercase font-bold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                      P. Unit. (S/)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={item.precioUnitario}
                      onChange={(e) => handleUpdateItem(idx, 'precioUnitario', parseFloat(e.target.value) || 0)}
                      className={`w-full rounded-xl border p-2 text-xs font-mono ${inputBg}`}
                    />
                  </div>
                </div>

                {/* Importe de la Fila */}
                <div className="flex justify-between items-center text-xs font-mono pt-1 border-t border-slate-800/40">
                  <span className="text-slate-400">Importe Línea:</span>
                  <strong className="text-amber-400 text-sm font-black">
                    S/ {(item.cantidad * item.precioUnitario).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                  </strong>
                </div>
              </div>
            ))}
          </div>

          {/* Resumen Total y TDS */}
          <div className="space-y-3 pt-2">
            <div className={`p-4 rounded-xl border flex items-center justify-between ${
              isDark ? 'bg-[#151D2A] border-amber-500/30 text-amber-300' : 'bg-amber-50 border-amber-300 text-amber-950'
            }`}>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider block">TOTAL GENERAL A PAGAR (INC. IGV):</span>
                <span className="text-xs text-slate-400 font-mono">
                  {items.length} {items.length === 1 ? 'producto seleccionado' : 'productos acumulados'}
                </span>
              </div>
              <div className="text-2xl font-black font-mono text-amber-400">
                S/ {totalGeneral.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={attachTDS}
                onChange={(e) => setAttachTDS(e.target.checked)}
                className="rounded border-slate-700 text-amber-500 focus:ring-amber-500"
              />
              <span className={`text-xs font-bold flex items-center gap-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                <ShieldCheck className="w-4 h-4 text-amber-500" />
                <span>Adjuntar Ficha Técnica Oficial (TDS) en el documento</span>
              </span>
            </label>
          </div>
        </div>

      </div>

      {/* Action Footer */}
      <div className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${cardBg}`}>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-colors ${
              isDark ? 'border-slate-700 text-slate-400 hover:text-white' : 'border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
          >
            Volver a la Lista
          </button>
        )}

        <div className="flex items-center gap-3 ml-auto">
          {mode === 'COTIZACION' ? (
            <button
              type="button"
              disabled={isSaving}
              onClick={() => handleSubmit(false)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black text-xs tracking-wider uppercase transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2"
            >
              <FileText className="w-4 h-4 stroke-[2.5]" />
              <span>{isSaving ? 'Generando...' : 'Guardar Cotización & Ver Plantilla'}</span>
            </button>
          ) : (
            <button
              type="button"
              disabled={isSaving}
              onClick={() => handleSubmit(false)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-black text-xs tracking-wider uppercase transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{isSaving ? 'Transmitiendo...' : 'Validar Stock & Enviar a Planta'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Modal Nuevo Cliente */}
      <NuevoClienteModal
        isOpen={isClientModalOpen}
        onClose={() => setIsClientModalOpen(false)}
        onCreated={handleCreatedClient}
        initialRuc={clientRuc}
      />

      {/* Modal Cotizacion PDF */}
      {pdfData && (
        <CotizacionPDF
          isOpen={isPdfModalOpen}
          onClose={() => setIsPdfModalOpen(false)}
          data={pdfData}
        />
      )}
    </div>
  );
}
