'use client';

import React, { useState } from 'react';
import {
  X,
  Printer,
  FileText,
  Mail,
  Phone,
  Globe,
  Receipt,
  Building2,
  Beaker,
  Instagram,
} from 'lucide-react';

export interface CotizacionItem {
  id?: string;
  codigo?: string;
  descripcion: string;
  variante?: string | null;
  aroma?: string | null;
  color?: string | null;
  cantidad: number;
  unidad: string;
  precioUnitario: number;
  importeTotal: number;
}

export interface CotizacionData {
  codigoOrden: string;
  codigoRefAdmin?: string | null;
  fecha: string;
  fechaEntrega?: string | null;
  clienteNombre: string;
  clienteRuc: string;
  contactoNombre?: string | null;
  contactoTelefono?: string | null;
  direccionDespacho?: string | null;
  condicionPago?: string | null;
  productoNombre: string;
  formulaCodigo?: string | null;
  varianteNombre?: string | null;
  aroma?: string | null;
  color?: string | null;
  cantidad: number;
  unidad: string;
  precioUnitario: number;
  montoTotal: number;
  notasAdmin?: string | null;
  attachTDS?: boolean;
  docType?: 'COT' | 'OP';
  items?: CotizacionItem[];
}

interface CotizacionPDFProps {
  isOpen: boolean;
  onClose: () => void;
  data: CotizacionData;
}

export function CotizacionPDF({ isOpen, onClose, data }: CotizacionPDFProps) {
  const isOriginallyCot = data.docType === 'COT' || data.codigoOrden?.startsWith('COT');
  
  const [docFormat, setDocFormat] = useState<'COTIZACION' | 'BOLETA'>(
    isOriginallyCot ? 'COTIZACION' : 'BOLETA'
  );

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const totalNum = Number(data.montoTotal) || 0;
  const subtotal = totalNum / 1.18;
  const igv = totalNum - subtotal;

  // Build items array (supports multiple items or single item fallback)
  const itemList: CotizacionItem[] = data.items && data.items.length > 0
    ? data.items
    : [
        {
          id: '1',
          codigo: data.formulaCodigo || 'FM-0001',
          descripcion: data.productoNombre,
          variante: data.varianteNombre,
          aroma: data.aroma,
          color: data.color,
          cantidad: data.cantidad || 100,
          unidad: data.unidad || 'KG',
          precioUnitario: data.precioUnitario || 34.50,
          importeTotal: totalNum,
        },
      ];

  const esCotizacion = docFormat === 'COTIZACION';

  return (
    <>
      {/* ── CSS Global para Impresión Perfecta (Solo imprime la hoja del documento) ── */}
      <style jsx global>{`
        @media print {
          @page {
            margin: 10mm;
            size: auto;
          }
          html, body {
            background: #ffffff !important;
            color: #0f172a !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          body * {
            visibility: hidden !important;
          }
          #printable-document-sheet,
          #printable-document-sheet * {
            visibility: visible !important;
          }
          #printable-document-sheet {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            min-height: 100% !important;
            margin: 0 !important;
            padding: 24px !important;
            background: #ffffff !important;
            color: #0f172a !important;
            box-shadow: none !important;
            border: none !important;
            z-index: 999999 !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-2 sm:p-4 font-sans overflow-y-auto print:p-0 print:bg-white print:static">
        <div className="w-full max-w-4xl bg-[#0E131F] text-slate-100 rounded-2xl shadow-2xl border border-slate-800 overflow-hidden my-auto print:border-none print:shadow-none print:w-full print:max-w-none print:rounded-none print:bg-white print:text-black">
          
          {/* ── BARRA DE CONTROL SUPERIOR (Oculta al imprimir) ── */}
          <div className="no-print flex items-center justify-between px-6 py-3.5 bg-[#0A0D14] text-white border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setDocFormat('COTIZACION')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    docFormat === 'COTIZACION'
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Cotización Comercial (COT)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDocFormat('BOLETA')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    docFormat === 'BOLETA'
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Receipt className="w-3.5 h-3.5" />
                  <span>Boleta de Venta / OP</span>
                </button>
              </div>

              <span className="text-[11px] text-slate-400 hidden sm:inline-block font-mono">
                {esCotizacion ? 'Formato Presupuesto Oficial' : 'Formato Comprobante Comercial'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:opacity-90 text-slate-950 text-xs font-black tracking-wider uppercase flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
              >
                <Printer className="w-4 h-4 stroke-[2.5]" />
                <span>Imprimir / Guardar PDF</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════
              HOJA IMPRIMIBLE (DISEÑO EXACTO A LA IMAGEN 2)
             ═══════════════════════════════════════════════════════════ */}
          <div
            id="printable-document-sheet"
            className="p-8 sm:p-12 space-y-8 bg-white text-slate-900 font-sans shadow-sm print:p-0 print:shadow-none"
          >
            {/* 1. Header con Logo Box y Título */}
            <div className="flex flex-wrap items-center justify-between gap-6 pb-6 border-b border-slate-200">
              {/* Logo Box (Inspirado en Woodcraft Services) */}
              <div className="flex items-center">
                <div className="flex items-center bg-[#1E293B] text-white rounded-lg overflow-hidden shadow-md">
                  <div className="flex items-center gap-2.5 px-4 py-3 bg-[#0F172A]">
                    <div className="w-8 h-8 rounded bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center text-slate-950 font-black text-base">
                      QC
                    </div>
                    <div>
                      <div className="font-black text-sm tracking-wider uppercase">QUIMICORP</div>
                      <div className="text-[9px] font-mono text-slate-400 tracking-widest uppercase">SOLUCIONES S.A.C.</div>
                    </div>
                  </div>
                  <div className="w-3 self-stretch bg-[#F97316]" />
                </div>
              </div>

              {/* Document Title */}
              <div className="text-right">
                <h1 className="text-2xl sm:text-3xl font-black text-[#1E293B] tracking-tight uppercase">
                  {esCotizacion ? 'COTIZACIÓN COMERCIAL' : 'BOLETA DE VENTA / PEDIDO'}
                </h1>
                <div className="text-xs font-mono text-slate-500 uppercase tracking-wider mt-0.5">
                  DOCUMENTO OFICIAL DE GESTIÓN
                </div>
              </div>
            </div>

            {/* 2. Client Information (Izquierda) + Metadatos & Total Box (Derecha) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              
              {/* Información del Cliente */}
              <div className="md:col-span-6 space-y-2 text-xs">
                <h2 className="text-sm font-black text-[#EA580C] uppercase tracking-wide">
                  Información del Cliente
                </h2>
                <div className="space-y-1 text-slate-800">
                  <div>
                    <strong className="text-slate-900 font-bold">Razón Social:</strong> {data.clienteNombre}
                  </div>
                  <div>
                    <strong className="text-slate-900 font-bold">RUC / Documento:</strong> {data.clienteRuc}
                  </div>
                  {data.direccionDespacho && (
                    <div>
                      <strong className="text-slate-900 font-bold">Dirección:</strong> {data.direccionDespacho}
                    </div>
                  )}
                  {data.contactoTelefono && (
                    <div>
                      <strong className="text-slate-900 font-bold">Teléfono:</strong> {data.contactoTelefono}
                    </div>
                  )}
                  {data.contactoNombre && (
                    <div>
                      <strong className="text-slate-900 font-bold">Contacto / Atención:</strong> {data.contactoNombre}
                    </div>
                  )}
                </div>
              </div>

              {/* Box de Estimación & Total General */}
              <div className="md:col-span-6 flex justify-end">
                <div className="flex rounded-lg overflow-hidden border border-slate-200 shadow-sm w-full max-w-md">
                  {/* Left sub-box: N° y Fecha */}
                  <div className="flex-1 bg-[#F1F5F9] p-4 text-xs space-y-2">
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase block">
                        {esCotizacion ? 'N° Cotización:' : 'N° Comprobante / OP:'}
                      </span>
                      <span className="font-mono font-black text-slate-900 text-sm">
                        {data.codigoOrden}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase block">Fecha de Emisión:</span>
                      <span className="font-medium text-slate-800">{data.fecha}</span>
                    </div>
                  </div>

                  {/* Right sub-box: Total Cost destacado */}
                  <div className="flex items-center bg-[#1E293B] text-white px-5 py-4 min-w-[140px] relative">
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#EA580C]" />
                    <div className="pl-1">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Total General</span>
                      <span className="text-xl font-black font-mono text-white">
                        S/ {totalNum.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* 3. Tabla de Productos (Exacta a la Imagen 2) */}
            <div className="space-y-4">
              <table className="w-full text-left text-xs border-collapse border border-slate-200">
                <thead>
                  <tr className="bg-[#F1F5F9] text-slate-800 font-bold border-b border-slate-200">
                    <th className="py-2.5 px-3 text-center w-12 border-r border-slate-200">No.</th>
                    <th className="py-2.5 px-4 border-r border-slate-200">Descripción del Producto / Fórmula</th>
                    <th className="py-2.5 px-4 text-center border-r border-slate-200">Cantidad</th>
                    <th className="py-2.5 px-4 text-right border-r border-slate-200">Costo Unit.</th>
                    <th className="py-2.5 px-4 text-right">Importe Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {itemList.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3 text-center font-mono font-semibold text-slate-600 border-r border-slate-200">
                        {idx + 1}
                      </td>
                      <td className="py-3 px-4 border-r border-slate-200">
                        <div className="font-bold text-slate-900">{item.descripcion}</div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          Código: <strong>{item.codigo || 'FM-0001'}</strong>
                          {item.variante && ` • ${item.variante}`}
                          {item.aroma && ` • Aroma: ${item.aroma}`}
                          {item.color && ` • Color: ${item.color}`}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-medium text-slate-800 border-r border-slate-200">
                        {item.cantidad.toLocaleString()} {item.unidad}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-700 border-r border-slate-200">
                        S/ {item.precioUnitario.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                        S/ {item.importeTotal.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Resumen de Totales (Subtotal, IGV, Grand Total) */}
              <div className="flex justify-end pt-1">
                <div className="w-full max-w-xs space-y-1.5 text-xs">
                  <div className="flex justify-between py-1 px-3 bg-slate-50 border border-slate-200 rounded">
                    <span className="text-slate-600 font-medium">Subtotal:</span>
                    <span className="font-mono font-bold text-slate-900">
                      S/ {subtotal.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 px-3 bg-slate-50 border border-slate-200 rounded">
                    <span className="text-slate-600 font-medium">I.G.V. (18%):</span>
                    <span className="font-mono font-bold text-slate-900">
                      S/ {igv.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 px-3 bg-[#FEF2F2] border border-[#FECACA] rounded">
                    <span className="text-[#EA580C] font-black uppercase text-xs">Total General:</span>
                    <span className="font-mono font-black text-[#EA580C] text-sm">
                      S/ {totalNum.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Sección Inferior: Nota Breve (Sin el textote de términos) + Caja de Firma */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end pt-4 border-t border-slate-200">
              {/* Nota comercial limpia y directa */}
              <div className="md:col-span-7 space-y-1.5 text-xs text-slate-600">
                <h3 className="text-xs font-bold text-[#EA580C] uppercase tracking-wider">
                  Condiciones Comerciales
                </h3>
                <p className="text-[11px] leading-relaxed">
                  • <strong>Condición de Pago:</strong> {data.condicionPago || 'Contado / Crédito 30 Días'}
                </p>
                <p className="text-[11px] leading-relaxed">
                  • <strong>Validez de la Oferta:</strong> {esCotizacion ? '30 días calendario' : 'Entrega programada'}
                </p>
                {data.notasAdmin && (
                  <p className="text-[11px] text-slate-700 italic pt-1">
                    • <strong>Observaciones:</strong> {data.notasAdmin}
                  </p>
                )}
              </div>

              {/* Caja de Firma y Aprobación (Estilo exacto a la Imagen 2) */}
              <div className="md:col-span-5 flex justify-end">
                <div className="w-56 p-4 rounded-lg border border-slate-300 bg-[#F8FAFC] text-center space-y-3">
                  <span className="text-[11px] font-bold text-slate-700 uppercase block">
                    Cliente / Aprobación
                  </span>
                  <div className="font-serif italic text-2xl text-slate-800 py-1 border-b border-slate-300">
                    {data.contactoNombre ? data.contactoNombre.split(' ')[0] : 'Aprobado'}
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium">
                    {data.clienteNombre}
                  </div>
                </div>
              </div>
            </div>

            {/* 5. Footer con Iconos y Canales de Contacto */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-slate-200 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-700" />
                <span className="font-mono text-[11px]">ventas@quimicorp.pe</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-700" />
                <span className="font-mono text-[11px]">+51 (01) 748-9200</span>
              </div>
              <div className="flex items-center gap-2">
                <Instagram className="w-4 h-4 text-slate-700" />
                <span className="font-mono text-[11px]">@quimicorp_services</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </>
  );
}
