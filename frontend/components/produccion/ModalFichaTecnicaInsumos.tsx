'use client';

import React from 'react';
import { X, Printer, Download, Beaker, ShieldCheck, CheckCircle2, AlertTriangle, FileText, Sparkles, Scale } from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';

export interface InsumoRecetaItem {
  nombre: string;
  funcion: string;
  porcentaje: number;
  pesoDosificadoKg: number;
  tipo: 'ACTIVO' | 'BASE' | 'ADITIVO' | 'FRAGANCIA' | 'CONSERVANTE';
}

export interface FichaTecnicaData {
  codigoLote: string;
  nombreProducto: string;
  clienteNombre: string;
  clienteRuc?: string;
  fechaFabricacion: string;
  fechaVencimiento: string;
  unidades: number;
  unidadMedida: string;
  tipoEnvase: string;
  taraEnvaseGramos: number;
  contenidoNetoKg: number;
  pesoBrutoTotalKg: number;
  // Fisicoquímicos
  phMedido: number;
  phRango: string;
  viscosidadMedida: string;
  densidadMedida: string;
  aspecto: string;
  color: string;
  olor: string;
  // Insumos
  insumos: InsumoRecetaItem[];
  // Auditoría
  quimicoResponsable: string;
  operarioPlanta: string;
  estadoQA: 'LIBERADO' | 'EN_OBSERVACION' | 'RECHAZADO';
}

interface ModalFichaTecnicaInsumosProps {
  isOpen: boolean;
  onClose: () => void;
  data: FichaTecnicaData | null;
}

export function ModalFichaTecnicaInsumos({ isOpen, onClose, data }: ModalFichaTecnicaInsumosProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  if (!isOpen || !data) return null;

  const handlePrint = () => {
    window.print();
  };

  const cardBg = isDark ? 'bg-[#0F141C] border-[#1A2232]' : 'bg-white border-slate-200 shadow-2xl';
  const subBoxBg = isDark ? 'bg-[#151D2A] border-[#1A2232]' : 'bg-slate-50 border-slate-200';
  const textTitle = isDark ? 'text-white' : 'text-slate-900';
  const textMuted = isDark ? 'text-slate-400' : 'text-slate-600';
  const tableHeaderBg = isDark ? 'bg-[#151D2A] text-slate-300 border-slate-800' : 'bg-slate-100 text-slate-800 border-slate-300 font-bold';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-3 sm:p-6 overflow-y-auto font-sans animate-in fade-in duration-200">
      <div className={`w-full max-w-4xl rounded-3xl border p-6 sm:p-8 space-y-6 my-auto shadow-2xl relative ${cardBg}`}>
        {/* Header Superior & Acciones */}
        <div className={`flex flex-wrap items-center justify-between gap-4 border-b pb-4 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-red-600 text-white shadow-md shadow-red-600/30">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest font-black text-red-600 dark:text-red-400">
                  DOCUMENTO TÉCNICO OFICIAL DE FÓRMULA
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  LOTE LIBERADO QA
                </span>
              </div>
              <h2 className={`text-lg sm:text-xl font-black tracking-tight ${textTitle}`}>
                Ficha Técnica & Composición de Insumos: {data.nombreProducto}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-red-600/20 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / PDF</span>
            </button>
            <button
              onClick={onClose}
              className={`p-2 rounded-xl border transition-colors ${
                isDark ? 'bg-[#151D2A] border-[#1A2232] text-slate-400 hover:text-white' : 'bg-slate-100 border-slate-300 text-slate-600 hover:text-slate-900'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bloque 1: Identificación Corporativa & Trazabilidad de Lote */}
        <div className={`p-4 rounded-2xl border grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs ${subBoxBg}`}>
          <div>
            <span className={`text-[10px] uppercase font-bold tracking-wider block ${textMuted}`}>CÓDIGO DE LOTE</span>
            <p className="font-mono font-black text-sm text-red-600 dark:text-red-400">{data.codigoLote}</p>
          </div>
          <div>
            <span className={`text-[10px] uppercase font-bold tracking-wider block ${textMuted}`}>CLIENTE / DESTINATARIO</span>
            <p className={`font-bold truncate ${textTitle}`}>{data.clienteNombre}</p>
            {data.clienteRuc && <p className="text-[10px] font-mono text-slate-500">RUC: {data.clienteRuc}</p>}
          </div>
          <div>
            <span className={`text-[10px] uppercase font-bold tracking-wider block ${textMuted}`}>FECHA ELABORACIÓN</span>
            <p className={`font-mono font-bold ${textTitle}`}>{data.fechaFabricacion}</p>
          </div>
          <div>
            <span className={`text-[10px] uppercase font-bold tracking-wider block ${textMuted}`}>FECHA VENCIMIENTO</span>
            <p className={`font-mono font-bold text-amber-600 dark:text-amber-400`}>{data.fechaVencimiento}</p>
          </div>
        </div>

        {/* Bloque 2: TABLA DE INSUMOS & COMPOSICIÓN QUÍMICA DE LA FÓRMULA */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className={`text-xs font-black uppercase tracking-wider flex items-center gap-2 ${textTitle}`}>
              <Beaker className="w-4 h-4 text-red-600 dark:text-red-400" />
              <span>Desglose de Insumos & Materias Primas Dosificadas ({data.insumos.length} componentes)</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-500">100.0% Fórmula Balanceada</span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className={`border-b text-[10px] font-bold uppercase tracking-wider ${tableHeaderBg}`}>
                  <th className="py-2.5 px-3">COMPONENTE / MATERIA PRIMA</th>
                  <th className="py-2.5 px-3">FUNCIÓN TÉCNICA EN FÓRMULA</th>
                  <th className="py-2.5 px-3">TIPO</th>
                  <th className="py-2.5 px-3 text-right">CONCENTRACIÓN (%)</th>
                  <th className="py-2.5 px-3 text-right">MASA DOSIFICADA (KG / GR)</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-slate-800/60' : 'divide-slate-200'}`}>
                {data.insumos.map((ins, idx) => (
                  <tr key={idx} className={isDark ? 'hover:bg-[#151D2A]/60' : 'hover:bg-slate-50'}>
                    <td className={`py-2.5 px-3 font-bold ${textTitle}`}>{ins.nombre}</td>
                    <td className={`py-2.5 px-3 italic ${textMuted}`}>{ins.funcion}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold ${
                        ins.tipo === 'ACTIVO'
                          ? 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/30'
                          : ins.tipo === 'FRAGANCIA'
                          ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/30'
                          : ins.tipo === 'ADITIVO'
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                          : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30'
                      }`}>
                        {ins.tipo}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-right text-emerald-600 dark:text-emerald-400">
                      {ins.porcentaje.toFixed(2)}%
                    </td>
                    <td className={`py-2.5 px-3 font-mono font-black text-right ${textTitle}`}>
                      <span className="text-cyan-400">{ins.pesoDosificadoKg.toFixed(3)} KG</span>
                      <span className="block text-[10px] text-purple-400 font-normal">
                        ({(ins.pesoDosificadoKg * 1000).toLocaleString('es-PE', { maximumFractionDigits: 1 })} g)
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bloque 3: Metrología de Envasado & Especificaciones Fisicoquímicas QA */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* Metrología de Balanza */}
          <div className={`p-4 rounded-2xl border space-y-2.5 ${subBoxBg}`}>
            <h4 className={`text-xs font-black uppercase tracking-wider flex items-center gap-2 ${textTitle}`}>
              <Scale className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Control Metrológico de Envasado</span>
            </h4>
            <div className="space-y-1.5 font-mono">
              <div className="flex items-center justify-between border-b pb-1 border-slate-200 dark:border-slate-800">
                <span className={textMuted}>Tipo de Envase:</span>
                <span className={`font-bold ${textTitle}`}>{data.tipoEnvase}</span>
              </div>
              <div className="flex items-center justify-between border-b pb-1 border-slate-200 dark:border-slate-800">
                <span className={textMuted}>Tara de Envase (Tapa + Bulto):</span>
                <span className="font-bold text-amber-600 dark:text-amber-400">{data.taraEnvaseGramos} g ({(data.taraEnvaseGramos / 1000).toFixed(3)} kg)</span>
              </div>
              <div className="flex items-center justify-between border-b pb-1 border-slate-200 dark:border-slate-800">
                <span className={textMuted}>Contenido Neto Certificado:</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">{data.contenidoNetoKg.toFixed(3)} kg</span>
              </div>
              <div className="flex items-center justify-between pt-1 font-bold text-sm">
                <span className={textTitle}>PESO TOTAL (BRUTO):</span>
                <span className="font-black text-emerald-600 dark:text-emerald-400">{data.pesoBrutoTotalKg.toFixed(3)} kg</span>
              </div>
            </div>
          </div>

          {/* Parámetros Fisicoquímicos */}
          <div className={`p-4 rounded-2xl border space-y-2.5 ${subBoxBg}`}>
            <h4 className={`text-xs font-black uppercase tracking-wider flex items-center gap-2 ${textTitle}`}>
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Ensayos Fisicoquímicos (Laboratorio QA)</span>
            </h4>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-[#0B0F17]">
                <span className={`text-[9px] uppercase block ${textMuted}`}>pH a 20°C</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{data.phMedido.toFixed(2)} (Rango: {data.phRango})</span>
              </div>
              <div className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-[#0B0F17]">
                <span className={`text-[9px] uppercase block ${textMuted}`}>Viscosidad</span>
                <span className={`font-mono font-bold ${textTitle}`}>{data.viscosidadMedida}</span>
              </div>
              <div className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-[#0B0F17]">
                <span className={`text-[9px] uppercase block ${textMuted}`}>Aspecto & Textura</span>
                <span className={`font-bold ${textTitle}`}>{data.aspecto}</span>
              </div>
              <div className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-[#0B0F17]">
                <span className={`text-[9px] uppercase block ${textMuted}`}>Color & Olor</span>
                <span className={`font-bold ${textTitle}`}>{data.color} / {data.olor}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer: Certificación & Sello Legal */}
        <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${isDark ? 'bg-[#090C10] border-slate-800' : 'bg-slate-100 border-slate-300'}`}>
          <div>
            <p className="font-black text-red-600 dark:text-red-400">GRUPO QUIMICORP S.A.C. | RUC: 20612434124</p>
            <p className={`text-[10px] ${textMuted}`}>Planta Industrial Lima - Perú | Certificación de Buenas Prácticas de Manufactura (BPM)</p>
          </div>
          <div className="text-right text-[11px]">
            <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-end gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> DICTAMEN: CONFORME / LIBERADO
            </span>
            <span className={`text-[10px] ${textMuted}`}>Responsable QA: {data.quimicoResponsable}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
