'use client';

import React, { useState } from 'react';
import {
  X,
  Printer,
  FileText,
  Receipt,
  Download,
  Loader2,
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
  vigenciaDias?: number | string;
  moneda?: string; // e.g. 'Soles (S/)' o 'Dólares ($ USD)'
  responsableVenta?: string;

  // Datos del Cliente
  clienteNombre: string;
  clienteRuc: string;
  contactoNombre?: string | null;
  contactoTelefono?: string | null;
  clienteCorreo?: string | null;
  direccionDespacho?: string | null;
  lugarEntrega?: string | null;
  referenciaEntrega?: string | null;

  // Condiciones Comerciales
  formaPago?: string | null;
  condicionPago?: string | null;
  plazoEntrega?: string | null;
  notasAdmin?: string | null;

  // Totales
  montoTotal: number;
  subtotal?: number;
  igv?: number;
  attachTDS?: boolean;
  docType?: 'COT' | 'OP';
  items?: CotizacionItem[];

  // Fallback para ítem único
  productoNombre?: string;
  formulaCodigo?: string | null;
  varianteNombre?: string | null;
  aroma?: string | null;
  color?: string | null;
  cantidad?: number;
  unidad?: string;
  precioUnitario?: number;
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
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  if (!isOpen) return null;

  const isCotizacion = docFormat === 'COTIZACION';
  const monedaLabel = data.moneda || 'Soles (S/)';
  const monedaSymbol = monedaLabel.includes('USD') || monedaLabel.includes('$') ? '$' : 'S/';

  // Formatear código correlativo
  const displayCode = data.codigoOrden?.replace(/^COT-|^OP-/, '') || '000862';

  // Construir lista de productos (multilínea o fallback a producto unitario)
  const itemList: CotizacionItem[] = data.items && data.items.length > 0
    ? data.items
    : [
        {
          id: '1',
          codigo: data.formulaCodigo || 'FM-0001',
          descripcion: data.productoNombre || 'PRODUCTO INDUSTRIAL',
          variante: data.varianteNombre,
          aroma: data.aroma,
          color: data.color,
          cantidad: data.cantidad || 1,
          unidad: data.unidad || 'KG',
          precioUnitario: data.precioUnitario || 0,
          importeTotal: (data.cantidad || 1) * (data.precioUnitario || 0),
        },
      ];

  // Cálculo de Subtotal e IGV
  const subtotalCalc = itemList.reduce((acc, it) => acc + (Number(it.importeTotal) || (it.cantidad * it.precioUnitario)), 0);
  const igvCalc = subtotalCalc * 0.18;
  const totalCalc = subtotalCalc + igvCalc;

  // ── FUNCIÓN DE IMPRESIÓN AISLADA (Evita hojas en blanco en Chromium / Chrome / Nitro) ──
  const handlePrint = () => {
    const element = document.getElementById('printable-document-sheet');
    if (!element) {
      window.print();
      return;
    }

    // Crear un iframe invisible dedicado únicamente al documento de la cotización
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) {
      window.print();
      return;
    }

    // Clonar las hojas de estilo y Tailwind para fidelidad 100%
    const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
      .map((el) => el.outerHTML)
      .join('\n');

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Cotización N.° ${displayCode} - ${data.clienteNombre}</title>
          ${styles}
          <style>
            @page {
              margin: 6mm 8mm;
              size: A4 portrait;
            }
            html, body {
              background: #ffffff !important;
              color: #0f172a !important;
              margin: 0 !important;
              padding: 0 !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            #print-root-container {
              width: 100% !important;
              max-width: 100% !important;
              padding: 0 !important;
              margin: 0 !important;
              box-shadow: none !important;
              border: none !important;
            }
          </style>
        </head>
        <body>
          <div id="print-root-container">
            ${element.outerHTML}
          </div>
        </body>
      </html>
    `);
    doc.close();

    setTimeout(() => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 3000);
    }, 350);
  };

  // ── FUNCIÓN DE DESCARGA DIRECTA DE ARCHIVO PDF (.PDF) ──
  const handleDownloadPDF = async () => {
    const element = document.getElementById('printable-document-sheet');
    if (!element) return;

    setIsDownloadingPdf(true);
    try {
      const html2pdfModule = await import('html2pdf.js');
      const html2pdf = html2pdfModule.default || html2pdfModule;

      const cleanClient = (data.clienteNombre || 'CLIENTE').replace(/[^a-zA-Z0-9]/g, '_');
      const filename = `Cotizacion_${displayCode}_${cleanClient}.pdf`;

      const opt = {
        margin: [6, 8, 6, 8] as [number, number, number, number],
        filename: filename,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const },
      };

      await html2pdf().from(element).set(opt).save();
    } catch (err) {
      console.error('Error generando archivo PDF:', err);
      // Fallback a impresión si ocurriera algún imprevisto
      handlePrint();
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  return (
    <>
      {/* ── CSS Global para Impresión Directa y Fallback ── */}
      <style jsx global>{`
        @media print {
          @page {
            margin: 6mm 8mm;
            size: A4 portrait;
          }
          html, body {
            background: #ffffff !important;
            color: #0f172a !important;
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          /* Ocultar elementos fuera del modal */
          body > *:not(.fixed) {
            display: none !important;
          }
          .fixed.inset-0 {
            position: static !important;
            display: block !important;
            padding: 0 !important;
            margin: 0 !important;
            background: #ffffff !important;
            overflow: visible !important;
          }
          .no-print {
            display: none !important;
          }
          #printable-document-sheet {
            display: block !important;
            width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            background: #ffffff !important;
            box-shadow: none !important;
            border: none !important;
          }
        }
      `}</style>

      {/* ── MODAL CONTAINER ── */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-2 sm:p-4 font-sans overflow-y-auto print:p-0 print:bg-white print:static">
        <div className="w-full max-w-4xl bg-[#0E131F] text-slate-100 rounded-2xl shadow-2xl border border-slate-800 overflow-hidden my-auto print:border-none print:shadow-none print:w-full print:max-w-none print:rounded-none print:bg-white print:text-black">
          
          {/* ── BARRA DE CONTROL SUPERIOR (Oculta al imprimir) ── */}
          <div className="no-print flex flex-wrap items-center justify-between px-6 py-3.5 bg-[#0A0D14] text-white border-b border-slate-800 gap-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setDocFormat('COTIZACION')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isCotizacion
                      ? 'bg-[#F36B21] text-white font-black shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Cotización Comercial Oficial</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDocFormat('BOLETA')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    !isCotizacion
                      ? 'bg-[#F36B21] text-white font-black shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Receipt className="w-3.5 h-3.5" />
                  <span>Orden de Producción / Pedido</span>
                </button>
              </div>

              <span className="text-[11px] text-slate-400 hidden lg:inline-block font-mono">
                Formato Oficial Quimicorp Perú S.A.C.
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* BOTÓN DESCARGAR PDF DIRECTO */}
              <button
                type="button"
                disabled={isDownloadingPdf}
                onClick={handleDownloadPDF}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black tracking-wider uppercase flex items-center gap-2 shadow-lg shadow-emerald-600/25 transition-all disabled:opacity-50"
                title="Descargar archivo .PDF directamente a tu equipo"
              >
                {isDownloadingPdf ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4 stroke-[2.5]" />
                )}
                <span>{isDownloadingPdf ? 'Generando PDF...' : 'Descargar PDF'}</span>
              </button>

              {/* BOTÓN IMPRIMIR */}
              <button
                type="button"
                onClick={handlePrint}
                className="px-4 py-2 rounded-xl bg-[#F36B21] hover:bg-[#E05A10] text-white text-xs font-black tracking-wider uppercase flex items-center gap-2 shadow-lg shadow-orange-500/25 transition-all"
                title="Abrir cuadro de diálogo de impresión"
              >
                <Printer className="w-4 h-4 stroke-[2.5]" />
                <span>Imprimir</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Cerrar ventana"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════
              HOJA IMPRIMIBLE (DISEÑO IDÉNTICO AL FORMATO OFICIAL)
             ═══════════════════════════════════════════════════════════ */}
          <div
            id="printable-document-sheet"
            className="p-6 sm:p-10 bg-white text-slate-900 font-sans text-xs shadow-sm print:p-0 print:shadow-none"
            style={{ minHeight: '297mm' }}
          >
            {/* 1. CABECERA: Logotipo Quimicorp + Banner Naranja de Cotización */}
            <div className="flex flex-wrap items-stretch justify-between gap-4 pb-2">
              {/* Bloque Izquierdo: Logotipo Corporativo y Eslogan */}
              <div className="flex items-center gap-3">
                <img
                  src="/logo-quimicorp-icono.png"
                  alt="Icono Quimicorp"
                  className="h-12 sm:h-14 w-auto object-contain"
                />
                <div>
                  <div className="text-xl sm:text-2xl font-black text-[#0B1E3F] tracking-tight uppercase leading-none font-sans">
                    QUIMICORP PERÚ S.A.C.
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-slate-800 tracking-normal mt-1">
                    Innovación a Través de la Ciencia
                  </div>
                </div>
                <img
                  src="/logo-quimicorp-icono.png"
                  alt="Icono Quimicorp"
                  className="h-12 sm:h-14 w-auto object-contain hidden sm:block"
                />
              </div>

              {/* Bloque Derecho: Banner Sólido Naranja */}
              <div className="bg-[#F36B21] text-white px-6 sm:px-8 py-3 flex items-center justify-center rounded-none shadow-sm min-w-[240px]">
                <span className="font-black text-base sm:text-lg tracking-wider uppercase font-sans">
                  {isCotizacion ? `COTIZACIÓN N.° ${displayCode}` : `ORDEN / PEDIDO N.° ${displayCode}`}
                </span>
              </div>
            </div>

            {/* Línea divisoria decorativa institucional */}
            <div className="flex w-full h-1 mb-3">
              <div className="w-1/3 bg-[#15803D]" />
              <div className="w-2/3 bg-[#F36B21]" />
            </div>

            {/* 2. BLOQUE: DATOS DEL EMISOR */}
            <div className="mb-3">
              <div className="bg-[#F36B21] text-white font-bold text-[11px] uppercase px-3 py-1 tracking-wider">
                DATOS DEL EMISOR
              </div>
              <div className="border border-slate-300 border-t-0 text-[11px] leading-tight divide-y divide-slate-200">
                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200">
                  <div className="p-1.5 px-3 flex justify-between">
                    <span className="font-bold text-slate-900 w-24">RUC:</span>
                    <span className="text-slate-800 font-mono flex-1 font-semibold">20614697327</span>
                  </div>
                  <div className="p-1.5 px-3 flex justify-between">
                    <span className="font-bold text-slate-900 w-28">Fecha de:</span>
                    <span className="text-slate-800 flex-1">{data.fecha || new Date().toLocaleDateString('es-PE')}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200">
                  <div className="p-1.5 px-3 flex justify-between">
                    <span className="font-bold text-slate-900 w-24">Dirección:</span>
                    <span className="text-slate-800 flex-1">Puente Piedra</span>
                  </div>
                  <div className="p-1.5 px-3 flex justify-between">
                    <span className="font-bold text-slate-900 w-28">Vigencia:</span>
                    <span className="text-slate-800 flex-1">{data.vigenciaDias || '10 días calendario'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200">
                  <div className="p-1.5 px-3 flex justify-between">
                    <span className="font-bold text-slate-900 w-24">Teléfono:</span>
                    <span className="text-slate-800 font-mono flex-1">930906176</span>
                  </div>
                  <div className="p-1.5 px-3 flex justify-between">
                    <span className="font-bold text-slate-900 w-28">Moneda:</span>
                    <span className="text-slate-800 font-medium flex-1">{monedaLabel}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200">
                  <div className="p-1.5 px-3 flex justify-between">
                    <span className="font-bold text-slate-900 w-24">Correo:</span>
                    <a
                      href="mailto:asistenteadministrativo@grupoquimicorp.pe"
                      className="text-blue-600 underline flex-1 hover:text-blue-800 font-medium"
                    >
                      asistenteadministrativo@grupoquimicorp.pe
                    </a>
                  </div>
                  <div className="p-1.5 px-3 flex justify-between">
                    <span className="font-bold text-slate-900 w-28">Responsable:</span>
                    <span className="text-slate-800 font-semibold flex-1">{data.responsableVenta || 'Vendedor 1'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. BLOQUE: DATOS DEL CLIENTE */}
            <div className="mb-3">
              <div className="bg-[#F36B21] text-white font-bold text-[11px] uppercase px-3 py-1 tracking-wider">
                DATOS DEL CLIENTE
              </div>
              <div className="border border-slate-300 border-t-0 text-[11px] leading-tight divide-y divide-slate-200">
                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200">
                  <div className="p-1.5 px-3 flex">
                    <span className="font-bold text-slate-900 w-36 shrink-0">Cliente / Razón Social:</span>
                    <span className="text-slate-900 font-bold flex-1 uppercase">{data.clienteNombre}</span>
                  </div>
                  <div className="p-1.5 px-3 flex">
                    <span className="font-bold text-slate-900 w-24 shrink-0">RUC:</span>
                    <span className="text-slate-800 font-mono font-bold flex-1">{data.clienteRuc}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200">
                  <div className="p-1.5 px-3 flex">
                    <span className="font-bold text-slate-900 w-36 shrink-0">Contacto:</span>
                    <span className="text-slate-800 uppercase flex-1">{data.contactoNombre || '—'}</span>
                  </div>
                  <div className="p-1.5 px-3 flex">
                    <span className="font-bold text-slate-900 w-24 shrink-0">Teléfono:</span>
                    <span className="text-slate-800 font-mono flex-1">{data.contactoTelefono || '—'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200">
                  <div className="p-1.5 px-3 flex">
                    <span className="font-bold text-slate-900 w-36 shrink-0">Correo:</span>
                    <span className="text-slate-800 flex-1">{data.clienteCorreo || '—'}</span>
                  </div>
                  <div className="p-1.5 px-3 flex">
                    <span className="font-bold text-slate-900 w-24 shrink-0">Dirección:</span>
                    <span className="text-slate-800 uppercase flex-1">{data.direccionDespacho || '—'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200">
                  <div className="p-1.5 px-3 flex">
                    <span className="font-bold text-slate-900 w-36 shrink-0">Lugar de entrega:</span>
                    <span className="text-slate-800 uppercase flex-1">
                      {data.lugarEntrega || data.direccionDespacho || '—'}
                    </span>
                  </div>
                  <div className="p-1.5 px-3 flex">
                    <span className="font-bold text-slate-900 w-24 shrink-0">Referencia:</span>
                    <span className="text-slate-800 flex-1">{data.referenciaEntrega || '—'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. BLOQUE: DETALLE DE LA COTIZACIÓN */}
            <div className="mb-3">
              <div className="bg-[#F36B21] text-white font-bold text-[11px] uppercase px-3 py-1 tracking-wider">
                DETALLE DE LA COTIZACIÓN
              </div>
              <div className="border border-slate-300 border-t-0">
                <table className="w-full text-left text-[11px] border-collapse">
                  <thead>
                    <tr className="bg-[#0B1E3F] text-white font-bold uppercase tracking-wider">
                      <th className="py-2 px-2 text-center w-12 border-r border-slate-700">ÍTEM</th>
                      <th className="py-2 px-3 border-r border-slate-700">PRODUCTO / ESPECIFICACIÓN</th>
                      <th className="py-2 px-3 text-center w-24 border-r border-slate-700">CANTIDAD</th>
                      <th className="py-2 px-3 text-center w-20 border-r border-slate-700">UNIDAD</th>
                      <th className="py-2 px-3 text-right w-32 border-r border-slate-700">PRECIO UNITARIO</th>
                      <th className="py-2 px-3 text-right w-32">IMPORTE</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-300">
                    {itemList.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-2 px-2 text-center font-bold text-slate-800 border-r border-slate-300 align-top">
                          {idx + 1}
                        </td>
                        <td className="py-2 px-3 border-r border-slate-300 align-top">
                          <div className="font-bold text-slate-900 uppercase">
                            {item.descripcion}
                          </div>
                          {item.color && (
                            <div className="text-[10px] text-slate-600 font-medium">
                              Color: {item.color}
                            </div>
                          )}
                          {item.aroma && (
                            <div className="text-[10px] text-slate-600 font-medium">
                              Aroma: {item.aroma}
                            </div>
                          )}
                          {item.variante && (
                            <div className="text-[10px] text-slate-600 font-medium">
                              Variante: {item.variante}
                            </div>
                          )}
                        </td>
                        <td className="py-2 px-3 text-center font-mono font-bold text-slate-800 border-r border-slate-300 align-top">
                          {item.cantidad.toLocaleString('es-PE')}
                        </td>
                        <td className="py-2 px-3 text-center font-bold text-slate-800 border-r border-slate-300 align-top">
                          {item.unidad}
                        </td>
                        <td className="py-2 px-3 text-right font-mono font-medium text-slate-800 border-r border-slate-300 align-top">
                          {monedaSymbol} {item.precioUnitario.toFixed(2)}
                        </td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-slate-900 align-top">
                          {monedaSymbol} {Number(item.importeTotal).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Resumen de Totales inferior derecho */}
                <div className="border-t border-slate-300 flex justify-end">
                  <div className="w-64 border-l border-slate-300 text-[11px] divide-y divide-slate-300 font-mono">
                    <div className="flex justify-between py-1.5 px-3">
                      <span className="font-bold text-slate-800 font-sans">SUBTOTAL</span>
                      <span className="font-bold text-slate-900">
                        {monedaSymbol} {subtotalCalc.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex justify-between py-1.5 px-3">
                      <span className="font-bold text-slate-800 font-sans">IGV (18%)</span>
                      <span className="font-bold text-slate-900">
                        {monedaSymbol} {igvCalc.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex justify-between py-1.5 px-3 bg-slate-50 font-bold text-slate-950">
                      <span className="font-black text-slate-950 font-sans text-xs">TOTAL</span>
                      <span className="font-black text-slate-950 text-xs">
                        {monedaSymbol} {totalCalc.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 5. BLOQUE: CONDICIONES COMERCIALES */}
            <div className="mb-3">
              <div className="bg-[#F36B21] text-white font-bold text-[11px] uppercase px-3 py-1 tracking-wider">
                CONDICIONES COMERCIALES
              </div>
              <div className="border border-slate-300 border-t-0 text-[11px] leading-tight divide-y divide-slate-200">
                <div className="p-1.5 px-3 flex">
                  <span className="font-bold text-slate-900 w-36 shrink-0">Forma de pago:</span>
                  <span className="text-slate-800 flex-1">{data.formaPago || 'Depósito en cuenta'}</span>
                </div>
                <div className="p-1.5 px-3 flex">
                  <span className="font-bold text-slate-900 w-36 shrink-0">Condición de pago:</span>
                  <span className="text-slate-800 flex-1 font-semibold">{data.condicionPago || 'Crédito 7 días'}</span>
                </div>
                <div className="p-1.5 px-3 flex">
                  <span className="font-bold text-slate-900 w-36 shrink-0">Plazo de entrega:</span>
                  <span className="text-slate-800 flex-1">{data.plazoEntrega || 'Inmediato / Según stock'}</span>
                </div>
                <div className="p-1.5 px-3 flex">
                  <span className="font-bold text-slate-900 w-36 shrink-0">Lugar de entrega:</span>
                  <span className="text-slate-800 uppercase flex-1">
                    {data.lugarEntrega || data.direccionDespacho || 'Según coordinación'}
                  </span>
                </div>
                <div className="p-1.5 px-3 flex">
                  <span className="font-bold text-slate-900 w-36 shrink-0">Vigencia:</span>
                  <span className="text-slate-800 flex-1">{data.vigenciaDias || '10 días calendario'}</span>
                </div>
                <div className="p-1.5 px-3 flex">
                  <span className="font-bold text-slate-900 w-36 shrink-0">Observaciones:</span>
                  <span className="text-slate-800 flex-1">{data.notasAdmin || '—'}</span>
                </div>
              </div>
            </div>

            {/* 6. BLOQUE: DATOS BANCARIOS */}
            <div className="mb-4">
              <div className="bg-[#F36B21] text-white font-bold text-[11px] uppercase px-3 py-1 tracking-wider">
                DATOS BANCARIOS
              </div>
              <div className="border border-slate-300 border-t-0 p-2.5 px-3 text-[11px] leading-relaxed space-y-0.5 bg-slate-50/40">
                <div className="font-black text-slate-900 tracking-wide">
                  INTERBANK SOLES: 2003007829017
                </div>
                <div className="font-black text-slate-900 tracking-wide">
                  CCI: 00320000300782901735
                </div>
                <div className="font-bold text-slate-800">
                  A nombre de: <span className="font-black text-slate-950">QUIMICORP PERÚ S.A.C.</span>
                </div>
              </div>
            </div>

            {/* 7. PIE LEGAL (Nota de Aceptación Comercial) */}
            <div className="pt-2 text-[10.5px] italic text-slate-700 leading-snug">
              La presente cotización constituye una propuesta comercial y está sujeta a las condiciones indicadas. La confirmación del pedido deberá realizarse por escrito.
            </div>

          </div>

        </div>
      </div>
    </>
  );
}
