'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';

interface LoteEtiquetado {
  id: string;
  codigoLote: string;
  nombreProducto: string;
  unidades: number;
  contenido: string;
  sku: string;
  fechaFab: string;
  fechaVenc: string;
  codigoBarras: string;
  ruc: string;
  advertenciaGHS: string;
  aprobadoQA: boolean;
}

interface IncidenteDespacho {
  id: string;
  codigo: string;
  titulo: string;
  loteOImpresora: string;
  fecha: string;
  estado: 'PENDIENTE' | 'RESUELTO';
}

export default function EtiquetasDespachoPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [activeTab, setActiveTab] = useState<'ETIQUETAS' | 'INCIDENTES'>('ETIQUETAS');
  const [selectedLoteId, setSelectedLoteId] = useState<string>('1');

  // Manual Edit Mode State
  const [editMode, setEditMode] = useState<boolean>(false);

  // Label Format Type (Validation with Manager)
  const [formatoCodigo, setFormatoCodigo] = useState<'QR_COMPLETO' | 'EAN13_GS1'>('QR_COMPLETO');

  // Ticket Form States
  const [destino, setDestino] = useState<string>('Almacén Central');
  const [cantidadDespachar, setCantidadDespachar] = useState<number>(1);
  const [responsable, setResponsable] = useState<string>('Carlos Quispe');

  const [lotesAprobados, setLotesAprobados] = useState<LoteEtiquetado[]>([
    {
      id: '1',
      codigoLote: 'LOT-2024-0892',
      nombreProducto: 'Detergente Industrial Multiusos 5L',
      unidades: 98,
      contenido: '5.0 L',
      sku: 'DET-IND-05L',
      fechaFab: '2024-07-31',
      fechaVenc: '2025-07-31',
      codigoBarras: '758123488922824',
      ruc: '20512345678',
      advertenciaGHS: 'GHS07 (Irritante Cutáneo)',
      aprobadoQA: true,
    },
    {
      id: '2',
      codigoLote: 'LOT-2024-0891',
      nombreProducto: 'Limpiador Multiuso 1L',
      unidades: 248,
      contenido: '1.0 L',
      sku: 'LIM-MUL-01L',
      fechaFab: '2024-07-30',
      fechaVenc: '2025-07-30',
      codigoBarras: '758123488911002',
      ruc: '20512345678',
      advertenciaGHS: 'GHS07 (Irritante Ocular)',
      aprobadoQA: true,
    },
    {
      id: '3',
      codigoLote: 'LOT-2024-0889',
      nombreProducto: 'Gel Antibacterial 500ml',
      unidades: 360,
      contenido: '500 ml',
      sku: 'GEL-ANT-500',
      fechaFab: '2024-07-29',
      fechaVenc: '2025-07-29',
      codigoBarras: '758123488899500',
      ruc: '20512345678',
      advertenciaGHS: 'GHS02 (Inflamable)',
      aprobadoQA: true,
    },
  ]);

  const [incidentes] = useState<IncidenteDespacho[]>([
    {
      id: '1',
      codigo: 'INC-0041',
      titulo: 'Escáner QR no lectura bulto 12',
      loteOImpresora: 'Lote LOT-2024-0887',
      fecha: '2026-07-30 14:20',
      estado: 'RESUELTO',
    },
    {
      id: '2',
      codigo: 'INC-0042',
      titulo: 'Stock bajo de etiquetas Zebra ZT411',
      loteOImpresora: 'Impresora Almacén 1',
      fecha: '2026-07-30 18:05',
      estado: 'PENDIENTE',
    },
  ]);

  const selectedLote = lotesAprobados.find((l) => l.id === selectedLoteId) || lotesAprobados[0];

  const handleUpdateLoteField = (field: keyof LoteEtiquetado, value: string) => {
    setLotesAprobados((prev) =>
      prev.map((l) => (l.id === selectedLoteId ? { ...l, [field]: value } : l))
    );
  };

  const handleImprimir = () => {
    alert(
      `Imprimiendo ${cantidadDespachar} etiqueta(s) en formato [${
        formatoCodigo === 'QR_COMPLETO' ? 'Código QR Completo' : 'EAN-13 / GS1-128'
      }] para ${selectedLote.nombreProducto} (${selectedLote.codigoLote})...`
    );
  };

  const handleConfirmarDespacho = () => {
    alert(
      `¡Despacho Confirmado!\n- Lote: ${selectedLote.codigoLote}\n- Cantidad: ${cantidadDespachar} bulto(s)\n- Destino: ${destino}\n- Responsable: ${responsable}`
    );
  };

  const cardBg = isDark ? 'bg-[#0F141C] border-[#1A2232]' : 'bg-white border-slate-200 shadow-sm';
  const textTitle = isDark ? 'text-slate-400' : 'text-slate-500';
  const textValue = isDark ? 'text-white' : 'text-slate-900';
  const inputBg = isDark ? 'bg-[#151D2A] border-[#1A2232] text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-800';

  return (
    <div className="space-y-5 font-mono min-h-screen">
      {/* Top Right View Switcher Header Bar */}
      <div className={`flex flex-wrap items-center justify-between gap-4 border-b pb-3 ${isDark ? 'border-[#1A2232]' : 'border-slate-200'}`}>
        <div>
          <h2 className={`text-sm font-bold tracking-widest uppercase ${textTitle}`}>
            ETIQUETAS & DESPACHO INTERNO
          </h2>
          <p className="text-xs text-slate-400 font-sans">
            Impresión de etiquetas GS1-128 / QR con validación manual y generación de tickets de despacho.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className={`flex rounded-lg p-1 border text-xs font-sans ${isDark ? 'bg-[#0F141C] border-[#1A2232]' : 'bg-slate-100 border-slate-300'}`}>
          <button
            onClick={() => setActiveTab('ETIQUETAS')}
            className={`flex items-center gap-2 rounded-md px-3.5 py-1.5 font-bold transition-all ${
              activeTab === 'ETIQUETAS'
                ? 'bg-[#00F2C3] text-[#090C10] shadow-md'
                : isDark
                ? 'text-slate-400 hover:text-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileCheck className="h-3.5 w-3.5" />
            <span>Etiquetas & Despacho</span>
          </button>
          <button
            onClick={() => setActiveTab('INCIDENTES')}
            className={`flex items-center gap-2 rounded-md px-3.5 py-1.5 font-bold transition-all ${
              activeTab === 'INCIDENTES'
                ? 'bg-[#00F2C3] text-[#090C10] shadow-md'
                : isDark
                ? 'text-slate-400 hover:text-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <AlertOctagon className="h-3.5 w-3.5" />
            <span>Incidentes (2)</span>
          </button>
        </div>
      </div>

      {activeTab === 'ETIQUETAS' ? (
        /* MAIN ETIQUETAS VIEW MODE */
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-10">
          {/* Left Panel: LOTES APROBADOS (3 Cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className={`text-xs font-bold tracking-widest uppercase px-1 ${textTitle}`}>
              LOTES APROBADOS PARA ETIQUETADO
            </h3>

            <div className="space-y-3">
              {lotesAprobados.map((lote) => {
                const isSelected = lote.id === selectedLoteId;
                return (
                  <div
                    key={lote.id}
                    onClick={() => setSelectedLoteId(lote.id)}
                    className={`rounded-xl p-4 border transition-all cursor-pointer space-y-2 ${
                      isSelected
                        ? isDark
                          ? 'bg-[#0F141C] border-[#00F2C3]/70 shadow-lg shadow-[#00F2C3]/5'
                          : 'bg-white border-cyan-500 shadow-md ring-2 ring-cyan-500/20'
                        : isDark
                        ? 'bg-[#0B0F17] border-[#1A2232] hover:bg-[#0F141C]/60'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-[#00F2C3]">
                        {lote.codigoLote}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                        <Check className="h-3 w-3 stroke-[3]" /> QA
                      </span>
                    </div>

                    <h4 className={`text-xs font-bold font-sans ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                      {lote.nombreProducto}
                    </h4>

                    <p className="text-[11px] text-slate-400 font-mono">
                      {lote.unidades} unidades · {lote.contenido}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Panel: PREVIEW, MANUAL EDIT & TICKET (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Card 1: PREVIEW DE ETIQUETA + FORMAT VALIDATOR WITH MANAGER */}
            <div className={`rounded-xl p-5 border space-y-4 ${cardBg}`}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className={`text-xs font-bold tracking-widest uppercase ${textTitle}`}>
                  PREVIEW Y EDICIÓN DE ETIQUETA
                </h3>

                {/* Validation Selector (QR vs EAN-13) */}
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400 font-sans">Formato Validación:</span>
                  <div className={`flex rounded-lg p-1 border text-xs font-sans ${isDark ? 'bg-[#151D2A] border-[#1A2232]' : 'bg-slate-100 border-slate-300'}`}>
                    <button
                      onClick={() => setFormatoCodigo('QR_COMPLETO')}
                      className={`flex items-center gap-1.5 rounded px-2.5 py-1 font-bold ${
                        formatoCodigo === 'QR_COMPLETO'
                          ? 'bg-[#00F2C3] text-[#090C10]'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <QrCode className="h-3.5 w-3.5" /> QR Completo
                    </button>
                    <button
                      onClick={() => setFormatoCodigo('EAN13_GS1')}
                      className={`flex items-center gap-1.5 rounded px-2.5 py-1 font-bold ${
                        formatoCodigo === 'EAN13_GS1'
                          ? 'bg-[#00F2C3] text-[#090C10]'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Barcode className="h-3.5 w-3.5" /> Barcode EAN-13
                    </button>
                  </div>

                  {/* Manual Edit Mode Toggle Button */}
                  <button
                    onClick={() => setEditMode(!editMode)}
                    className={`flex items-center gap-1 rounded-lg px-3 py-1 text-xs font-bold border transition-all ${
                      editMode
                        ? 'bg-amber-500 text-slate-950 border-amber-500'
                        : isDark
                        ? 'bg-[#151D2A] text-slate-300 border-[#1A2232] hover:bg-slate-800'
                        : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    <span>{editMode ? 'Guardar Cambios' : 'Edición Manual'}</span>
                  </button>
                </div>
              </div>

              {/* Physical Label Graphic Box (Obsidian card with top cyan line) */}
              <div className="relative mx-auto max-w-xl rounded-xl bg-[#090C10] p-6 border border-[#1A2232] shadow-2xl space-y-4 text-slate-100 overflow-hidden font-mono">
                {/* Top Accent Line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#00F2C3]" />

                {/* Header Brand & QR Code Box */}
                <div className="flex items-start justify-between">
                  <div className="flex-1 mr-3">
                    <span className="text-[10px] tracking-widest text-slate-400 block font-semibold">
                      QUIMICORP S.A.C.
                    </span>
                    {editMode ? (
                      <input
                        type="text"
                        value={selectedLote.nombreProducto}
                        onChange={(e) => handleUpdateLoteField('nombreProducto', e.target.value)}
                        className="w-full rounded bg-[#151D2A] border border-[#00F2C3] px-2 py-1 text-sm font-bold text-white font-sans mt-1"
                      />
                    ) : (
                      <h3 className="text-base font-bold text-white font-sans mt-0.5">
                        {selectedLote.nombreProducto}
                      </h3>
                    )}
                  </div>

                  {/* QR Data Matrix / Barcode Box according to format selector */}
                  {formatoCodigo === 'QR_COMPLETO' ? (
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white p-1 text-slate-900 border border-slate-300 shrink-0">
                      <QrCode className="h-10 w-10 text-slate-900" />
                    </div>
                  ) : (
                    <div className="flex h-12 w-16 items-center justify-center rounded-lg bg-white p-1 text-slate-900 border border-slate-300 shrink-0">
                      <Barcode className="h-10 w-14 text-slate-900" />
                    </div>
                  )}
                </div>

                {/* 3 Columns Info Grid */}
                <div className="grid grid-cols-3 gap-3 border-y border-[#1A2232] py-3 text-xs">
                  <div>
                    <span className="text-[9px] text-slate-400 block">SKU</span>
                    {editMode ? (
                      <input
                        type="text"
                        value={selectedLote.sku}
                        onChange={(e) => handleUpdateLoteField('sku', e.target.value)}
                        className="w-full rounded bg-[#151D2A] border border-[#00F2C3] px-1 py-0.5 text-xs font-bold text-cyan-400"
                      />
                    ) : (
                      <span className="font-bold text-[#00F2C3]">{selectedLote.sku}</span>
                    )}
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block">LOTE</span>
                    {editMode ? (
                      <input
                        type="text"
                        value={selectedLote.codigoLote}
                        onChange={(e) => handleUpdateLoteField('codigoLote', e.target.value)}
                        className="w-full rounded bg-[#151D2A] border border-[#00F2C3] px-1 py-0.5 text-xs font-bold text-white"
                      />
                    ) : (
                      <span className="font-bold text-white">{selectedLote.codigoLote}</span>
                    )}
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block">CONTENIDO</span>
                    {editMode ? (
                      <input
                        type="text"
                        value={selectedLote.contenido}
                        onChange={(e) => handleUpdateLoteField('contenido', e.target.value)}
                        className="w-full rounded bg-[#151D2A] border border-[#00F2C3] px-1 py-0.5 text-xs font-bold text-white"
                      />
                    ) : (
                      <span className="font-bold text-white">{selectedLote.contenido}</span>
                    )}
                  </div>
                </div>

                {/* Barcode Graphic */}
                <div className="space-y-1 text-center py-1">
                  <div className="h-10 w-full flex justify-between items-center px-4">
                    {Array.from({ length: 48 }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-full bg-slate-200 ${
                          i % 5 === 0 ? 'w-1' : i % 3 === 0 ? 'w-0.5' : 'w-[1px]'
                        }`}
                      />
                    ))}
                  </div>
                  {editMode ? (
                    <input
                      type="text"
                      value={selectedLote.codigoBarras}
                      onChange={(e) => handleUpdateLoteField('codigoBarras', e.target.value)}
                      className="w-48 mx-auto rounded bg-[#151D2A] border border-[#00F2C3] px-2 py-0.5 text-center text-xs font-bold text-slate-200"
                    />
                  ) : (
                    <span className="text-[11px] tracking-widest text-slate-300 font-bold block">
                      {selectedLote.codigoBarras}
                    </span>
                  )}
                </div>

                {/* Footer Warning Badge & Production Metadata */}
                <div className="flex items-end justify-between border-t border-[#1A2232] pt-3 text-[10px]">
                  {/* Left Hazard GHS07 Badge */}
                  <div className="rounded-lg bg-amber-500/10 p-2 border border-amber-500/30 text-amber-400 flex items-center gap-1.5 font-bold">
                    <span className="flex h-5 w-5 items-center justify-center rounded bg-amber-500 text-slate-950 font-black text-xs">
                      !
                    </span>
                    <span>{selectedLote.advertenciaGHS}</span>
                  </div>

                  {/* Right Metadata */}
                  <div className="text-right text-slate-400 space-y-0.5">
                    <p>Fab: <span className="text-slate-200">{selectedLote.fechaFab}</span></p>
                    <p>Vence: <span className="text-slate-200">{selectedLote.fechaVenc}</span></p>
                    <p>Perú · RUC {selectedLote.ruc}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: TICKET DE DESPACHO INTERNO */}
            <div className={`rounded-xl p-5 border space-y-4 ${cardBg}`}>
              <h3 className={`text-xs font-bold tracking-widest uppercase ${textTitle}`}>
                TICKET DE DESPACHO INTERNO
              </h3>

              {/* Form Fields Row */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 font-sans text-xs">
                <div className="space-y-1">
                  <label className="text-slate-400 font-medium">Destino</label>
                  <select
                    value={destino}
                    onChange={(e) => setDestino(e.target.value)}
                    className={`w-full rounded-lg border p-2.5 font-mono focus:border-[#00F2C3] focus:outline-none ${inputBg}`}
                  >
                    <option value="Almacén Central">Almacén Central</option>
                    <option value="Almacén Lurin - Km 24">Almacén Lurin - Km 24</option>
                    <option value="Sucursal Arequipa">Sucursal Arequipa</option>
                    <option value="Sucursal Trujillo">Sucursal Trujillo</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-medium">Cantidad a despachar</label>
                  <input
                    type="number"
                    value={cantidadDespachar}
                    onChange={(e) => setCantidadDespachar(Number(e.target.value))}
                    className={`w-full rounded-lg border p-2.5 font-mono focus:border-[#00F2C3] focus:outline-none ${inputBg}`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-medium">Responsable</label>
                  <input
                    type="text"
                    value={responsable}
                    onChange={(e) => setResponsable(e.target.value)}
                    className={`w-full rounded-lg border p-2.5 font-mono focus:border-[#00F2C3] focus:outline-none ${inputBg}`}
                  />
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="flex flex-wrap items-center gap-3 pt-2 font-mono">
                <button
                  onClick={handleImprimir}
                  className={`flex items-center justify-center gap-2 rounded-lg border px-5 py-3 text-xs font-bold transition-colors ${
                    isDark
                      ? 'bg-[#151D2A] text-slate-200 border-[#1A2232] hover:bg-[#1E293B]'
                      : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                  }`}
                >
                  <Printer className="h-4 w-4" />
                  <span>Imprimir Etiquetas ({cantidadDespachar})</span>
                </button>

                <button
                  onClick={handleConfirmarDespacho}
                  className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-[#00F2C3] py-3 text-xs font-bold text-[#090C10] hover:bg-[#00d8ad] transition-all shadow-md"
                >
                  <span className="text-base font-black">⬡</span>
                  <span>Confirmar Despacho</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* INCIDENTES VIEW MODE TAB */
        <div className={`rounded-xl p-5 border space-y-4 ${cardBg}`}>
          <div className="flex items-center justify-between">
            <h3 className={`text-xs font-bold tracking-widest uppercase ${textTitle}`}>
              REGISTRO DE INCIDENTES EN ETIQUETADO Y DESPACHO
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className={`border-b text-[10px] font-bold tracking-widest uppercase ${isDark ? 'border-[#1A2232] text-slate-400' : 'border-slate-200 text-slate-500'}`}>
                  <th className="py-3 px-3">CÓDIGO</th>
                  <th className="py-3 px-3">DESCRIPCIÓN INCIDENTE</th>
                  <th className="py-3 px-3">ORIGEN / IMPRESORA</th>
                  <th className="py-3 px-3">FECHA</th>
                  <th className="py-3 px-3">ESTADO</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-[#1A2232]/60 font-mono' : 'divide-slate-200 font-mono'}`}>
                {incidentes.map((inc) => (
                  <tr key={inc.id} className={`transition-colors ${isDark ? 'hover:bg-[#151D2A]/50' : 'hover:bg-slate-50'}`}>
                    <td className="py-3.5 px-3 font-bold text-rose-400">{inc.codigo}</td>
                    <td className={`py-3.5 px-3 font-sans font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{inc.titulo}</td>
                    <td className="py-3.5 px-3 text-slate-400">{inc.loteOImpresora}</td>
                    <td className="py-3.5 px-3 text-slate-400">{inc.fecha}</td>
                    <td className="py-3.5 px-3">
                      {inc.estado === 'RESUELTO' && (
                        <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                          RESUELTO
                        </span>
                      )}
                      {inc.estado === 'PENDIENTE' && (
                        <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-400 border border-amber-500/30">
                          PENDIENTE
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
