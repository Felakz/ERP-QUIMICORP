'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Receipt, Printer, ArrowLeft, Loader2 } from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';
import { apiFetch } from '@/lib/apiClient';

interface CompData {
  codigoDoc: string;
  clienteNombre: string;
  clienteRuc: string;
  direccion?: string | null;
  producto?: string | null;
  ordenProd?: string | null;
  codigoPedido?: string | null;
  montoTotal: number;
  saldoPendiente: number;
  condicionPago?: string | null;
  diasPlazo?: number;
  medioPago?: string | null;
  canalBanco?: string | null;
  emitidoPor?: string | null;
  fechaEmision: string;
  fechaVencimiento: string;
  fechaEntrega?: string | null;
  estadoEntrega?: string | null;
  estadoPago: string;
  pagos: { id: string; montoAbonado: number; fechaAbono: string; medio?: string | null; numOperacion?: string | null }[];
  ordenesProduccion: { codigoLote?: string; estado?: string; pasoProceso?: string }[];
}

const fmtS = (n: number) => `S/ ${n.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`;
const fmtD = (iso?: string | null) => (iso ? new Date(iso).toLocaleDateString('es-PE') : '—');

export default function ComprobantePage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [data, setData] = useState<CompData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<CompData>(`/facturacion/comprobante/${params.id}`)
      .then((res) => setData(res.data))
      .catch((e) => setError(e.message || 'No se pudo cargar el comprobante.'));
  }, [params.id]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 font-sans">
        <p className="text-sm font-bold text-rose-400">{error}</p>
        <Link
          href="/administracion/facturacion"
          className="px-4 py-2 rounded-xl border text-xs font-bold text-slate-300"
        >
          Volver a Facturación
        </Link>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center gap-2 font-sans">
        <Loader2 className="w-5 h-5 animate-spin text-orange-400" />
        <span className="text-xs font-bold text-slate-400">Cargando comprobante...</span>
      </div>
    );
  }

  const igv = data.montoTotal * 0.18;
  const neto = data.montoTotal;
  const pagadoTotal = data.pagos.reduce((a, p) => a + Number(p.montoAbonado) || 0, 0);

  return (
    <div className="min-h-screen p-4 print:p-0 font-sans">
      <style>{`@media print { .no-print { display: none !important; } body { background: white !important; } }`}</style>

      <div className="no-print mb-4 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold text-slate-300 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" /> Volver
        </button>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs font-black uppercase tracking-wider shadow-lg"
        >
          <Printer className="w-4 h-4" /> Imprimir / PDF
        </button>
      </div>

      <div className={`max-w-3xl mx-auto rounded-2xl border shadow-sm ${isDark ? 'bg-[#0D1421] border-[#1A2232]' : 'bg-white border-slate-200'}`} id="print-area">
        <div className="p-8">
          <div className="flex items-start justify-between border-b-2 border-slate-700 pb-4">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-orange-500">QUIMICORP PERÚ S.A.C.</h1>
              <p className="text-[11px] text-slate-400 mt-1">
                RUC 20548215762 · Plantas y Oficinas Lima - Perú
              </p>
              <p className="text-[11px] text-slate-400">Buenas Prácticas de Manufactura (BPM)</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Comprobante Interno</p>
              <p className="text-xl font-mono font-black text-slate-100 mt-1">{data.codigoDoc}</p>
              <p className="text-[11px] mt-1 text-slate-300">{data.estadoPago === 'PAGADO' ? '● PAGADO' : data.estadoPago === 'VENCIDO' ? '● VENCIDO' : '● PENDIENTE'}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 py-4">
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Razón Social</p>
              <p className="text-sm font-bold text-slate-100 mt-0.5">{data.clienteNombre}</p>
              <p className="text-[10px] font-bold text-slate-400">{data.direccion || '—'}</p>
              <p className="text-[10px] font-mono text-slate-400 mt-1">RUC {data.clienteRuc}</p>
            </div>
            <div className="text-right space-y-1">
              <p className="text-[11px] text-slate-400">
                <span className="font-bold text-slate-300">Emisión:</span> {fmtD(data.fechaEmision)}
              </p>
              <p className="text-[11px] text-slate-400">
                <span className="font-bold text-slate-300">Vencimiento:</span> {fmtD(data.fechaVencimiento)}
              </p>
              <p className="text-[11px] text-slate-400">
                <span className="font-bold text-slate-300">Entrega:</span> {fmtD(data.fechaEntrega)}
              </p>
              <p className="text-[11px] text-slate-400">
                <span className="font-bold text-slate-300">Condición:</span> {data.condicionPago || 'Contado'}
                {data.diasPlazo ? ` (${data.diasPlazo} días)` : ''}
              </p>
              <p className="text-[11px] text-slate-400">
                <span className="font-bold text-slate-300">Medio:</span> {data.medioPago || '—'}
                {data.canalBanco ? ` · ${data.canalBanco}` : ''}
              </p>
            </div>
          </div>

          <div className="border border-slate-700 rounded-xl overflow-hidden">
            <div className="grid grid-cols-12 bg-slate-800/60 px-3 py-2 text-[9px] font-black uppercase tracking-widest text-slate-400">
              <div className="col-span-2">Documento</div>
              <div className="col-span-6">Producto / Lote</div>
              <div className="col-span-4 text-right">Monto</div>
            </div>
            <div className="grid grid-cols-12 px-3 py-3 text-[11px]">
              <div className="col-span-2 font-mono font-bold text-slate-300">{data.codigoPedido || data.ordenProd || '—'}</div>
              <div className="col-span-6 text-slate-200">
                {data.producto || 'Fórmula Industrial'}
                <div className="text-[9px] text-slate-500 font-mono hidden print:block">
                  {(data.ordenesProduccion || [])
                    .map((o) => `Lote ${o.codigoLote || ''} ${o.estado || ''}`)
                    .join(' · ')}
                </div>
              </div>
              <div className="col-span-4 text-right font-black text-slate-100">{fmtS(neto)}</div>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <div className="w-56 space-y-1.5 text-[12px]">
              <div className="flex justify-between text-slate-300">
                <span>Subtotal Neto</span>
                <span className="font-bold">{fmtS(neto)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>IGV (18%)</span>
                <span className="font-bold">{fmtS(igv)}</span>
              </div>
              <div className="flex justify-between border-t-2 border-slate-600 pt-1.5 text-base font-black text-slate-100">
                <span>Total</span>
                <span>{fmtS(neto + igv)}</span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">
              Historial de Abonos
            </p>
            <div className="border border-slate-700 rounded-xl overflow-hidden">
              <div className="grid grid-cols-4 bg-slate-800/60 px-3 py-2 text-[9px] font-black uppercase tracking-widest text-slate-400">
                <div>Fecha</div>
                <div>Medio</div>
                <div>N° Operación</div>
                <div className="text-right">Monto</div>
              </div>
              {data.pagos.length === 0 && (
                <div className="px-3 py-2 text-[10px] text-slate-500">Sin abonos registrados.</div>
              )}
              {data.pagos.map((p) => (
                <div key={p.id} className="grid grid-cols-4 px-3 py-2 text-[10px] border-t border-slate-800">
                  <div className="text-slate-300">{fmtD(p.fechaAbono)}</div>
                  <div className="text-slate-300">{p.medio || '—'}</div>
                  <div className="font-mono text-slate-400">{p.numOperacion || '—'}</div>
                  <div className="text-right font-bold text-emerald-400">{fmtS(p.montoAbonado)}</div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-[11px] font-bold">
              <span className="text-slate-400">Total pagado: <span className="text-emerald-400">{fmtS(pagadoTotal)}</span></span>
              <span className={data.saldoPendiente > 0 ? 'text-rose-400' : 'text-emerald-400'}>
                Saldo pendiente: {fmtS(data.saldoPendiente)}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-700 text-[9px] text-slate-500">
            <span>Documento electrónico interno · No es CPE SUNAT</span>
            <span className="flex items-center gap-1">
              <Receipt className="w-3 h-3" /> QUIMICORP ERP · Estado entrega: {data.estadoEntrega || 'PENDIENTE'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}