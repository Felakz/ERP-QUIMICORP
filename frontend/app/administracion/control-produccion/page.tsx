'use client';

import React, { useState, useEffect } from 'react';
import { useSocket } from '@/lib/socketContext';
import * as XLSX from 'xlsx';
import {
  Factory,
  Search,
  Calendar,
  Filter,
  CheckCircle2,
  Clock,
  Building2,
  Beaker,
  AlertTriangle,
  FileText,
  Download,
  RefreshCw,
  User,
  Sparkles,
  FileSpreadsheet,
  Printer,
  ChevronDown,
} from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';
import { apiFetch } from '@/lib/apiClient';
import { DateNavigatorToolbar } from '@/components/produccion/DateNavigatorToolbar';

interface OrdenProgramacionItem {
  id: string;
  codigoLote: string;
  clienteNombre: string;
  productoNombre: string;
  colorEspecificado: string;
  fraganciaEspecificada: string;
  cantidad: number;
  unidadMedida: string;
  estado: string;
  operarios: string;
  prioridad: string;
  fechaCreacion?: string;
  hora?: string;
}

interface ProgramacionResumen {
  totalOrdenes: number;
  totalKgProgramados: string;
  totalTerminados: number;
  totalEnProceso: number;
  totalPendientes: number;
}

export default function AdministracionControlProduccionPage() {
  const { theme } = useTheme();
  const { socket } = useSocket();
  const isDark = theme === 'dark';

  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [ordenes, setOrdenes] = useState<OrdenProgramacionItem[]>([]);
  const [resumen, setResumen] = useState<ProgramacionResumen>({
    totalOrdenes: 0,
    totalKgProgramados: '0.00',
    totalTerminados: 0,
    totalEnProceso: 0,
    totalPendientes: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showExportMenu, setShowExportMenu] = useState<boolean>(false);

  const exportarExcel = () => {
    setShowExportMenu(false);
    if (ordenes.length === 0) {
      alert(`No hay órdenes registradas para la fecha seleccionada (${selectedDate}).`);
      return;
    }

    const rows: Record<string, any>[] = ordenes.map((o) => ({
      'HORA': o.fechaCreacion
        ? new Date(o.fechaCreacion).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })
        : o.hora || '12:00 PM',
      'ORD. PROD. / LOTE': o.codigoLote,
      'CLIENTE': o.clienteNombre,
      'PRODUCTO': o.productoNombre,
      'COLOR': o.colorEspecificado || 'TRANSPARENTE',
      'FRAGANCIA': o.fraganciaEspecificada || 'SIN FRAGANCIA',
      'CANTIDAD': o.cantidad,
      'UNIDAD': o.unidadMedida,
      'ESTADO': o.estado,
      'RESPONSABLE': o.operarios || 'Sin Asignar',
      'PRIORIDAD': o.prioridad || 'NORMAL',
    }));

    // Fila de resumen al pie
    rows.push({
      'HORA': '--- RESUMEN ---',
      'ORD. PROD. / LOTE': `Total: ${resumen.totalOrdenes} órdenes`,
      'CLIENTE': `Volumen: ${resumen.totalKgProgramados} KG/LT`,
      'PRODUCTO': `Terminados: ${resumen.totalTerminados}`,
      'COLOR': `En Proceso: ${resumen.totalEnProceso}`,
      'FRAGANCIA': `Pendientes: ${resumen.totalPendientes}`,
      'CANTIDAD': '',
      'UNIDAD': '',
      'ESTADO': '',
      'RESPONSABLE': '',
      'PRIORIDAD': '',
    });

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `Planilla_${selectedDate}`);
    XLSX.writeFile(wb, `Quimicorp_Planilla_Produccion_${selectedDate}.xlsx`);
  };

  const exportarPDF = () => {
    setShowExportMenu(false);
    if (ordenes.length === 0) {
      alert(`No hay órdenes registradas para la fecha seleccionada (${selectedDate}).`);
      return;
    }

    const windowPrint = window.open('', '', 'width=1050,height=800');
    if (!windowPrint) {
      alert('Por favor habilita las ventanas emergentes en tu navegador para imprimir.');
      return;
    }

    const html = `
      <!DOCTYPE html>
      <html lang="es">
        <head>
          <meta charset="utf-8" />
          <title>PLANILLA DIARIA DE PRODUCCIÓN - QUIMICORP PERU S.A.C.</title>
          <style>
            @page { size: landscape; margin: 12mm; }
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 20px; color: #0f172a; margin: 0; }
            .header-banner { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 16px; }
            .company-name { font-size: 20px; font-weight: 900; letter-spacing: 0.5px; color: #0f172a; }
            .sub-title { font-size: 13px; font-weight: 700; color: #475569; margin-top: 3px; }
            .ruc-badge { font-family: monospace; font-weight: bold; font-size: 13px; background: #f1f5f9; padding: 4px 8px; border-radius: 4px; border: 1px solid #cbd5e1; }
            .meta-bar { display: flex; justify-content: space-between; font-size: 11px; font-weight: bold; background: #f8fafc; padding: 8px 14px; border-radius: 6px; border: 1px solid #e2e8f0; margin-bottom: 16px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 11px; }
            th, td { border: 1px solid #cbd5e1; padding: 7px 10px; text-align: left; }
            th { background-color: #f1f5f9; text-transform: uppercase; font-size: 10px; letter-spacing: 0.5px; color: #334155; }
            .status-badge { padding: 3px 6px; border-radius: 4px; font-weight: bold; font-size: 9px; display: inline-block; text-transform: uppercase; }
            .badge-terminado { background: #dcfce7; color: #15803d; border: 1px solid #86efac; }
            .badge-proceso { background: #dbeafe; color: #1d4ed8; border: 1px solid #93c5fd; }
            .badge-pendiente { background: #f1f5f9; color: #64748b; border: 1px solid #cbd5e1; }
            .badge-etiquetado { background: #fef3c7; color: #b45309; border: 1px solid #fde68a; }
            .summary-card { margin-top: 20px; border: 1px solid #cbd5e1; padding: 12px 16px; background: #f8fafc; border-radius: 8px; page-break-inside: avoid; }
            .summary-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; text-align: center; margin-top: 8px; }
            .summary-item { background: white; padding: 8px; border-radius: 6px; border: 1px solid #e2e8f0; }
            .summary-title { font-size: 10px; color: #64748b; font-weight: bold; text-transform: uppercase; }
            .summary-val { font-size: 16px; font-weight: 900; margin-top: 2px; font-family: monospace; }
            .firmas-container { display: flex; justify-content: space-around; margin-top: 40px; page-break-inside: avoid; }
            .firma-box { width: 220px; text-align: center; border-top: 1px solid #94a3b8; padding-top: 6px; font-size: 10px; font-weight: bold; color: #475569; }
          </style>
        </head>
        <body>
          <div class="header-banner">
            <div>
              <div class="company-name">QUIMICORP PERU S.A.C.</div>
              <div class="sub-title">PLANILLA Y PROGRAMACIÓN DIARIA DE PRODUCCIÓN — TURNO OPERATIVO</div>
            </div>
            <div class="ruc-badge">RUC: 20612434124</div>
          </div>
          <div class="meta-bar">
            <span>📅 FECHA DEL TURNO: <strong>${selectedDate}</strong></span>
            <span>📦 TOTAL ÓRDENES: <strong>${resumen.totalOrdenes}</strong></span>
            <span>⚖️ VOLUMEN TOTAL: <strong>${resumen.totalKgProgramados} KG/LT</strong></span>
            <span>🕒 GENERADO: ${new Date().toLocaleString('es-PE')}</span>
          </div>
          <table>
            <thead>
              <tr>
                <th>HORA</th>
                <th>ORD. PROD. / LOTE</th>
                <th>CLIENTE</th>
                <th>PRODUCTO</th>
                <th>COLOR</th>
                <th>FRAGANCIA</th>
                <th>CANTIDAD</th>
                <th>ESTADO</th>
                <th>RESPONSABLE</th>
                <th>PRIORIDAD</th>
              </tr>
            </thead>
            <tbody>
              ${ordenes.map(o => `
                <tr>
                  <td style="font-family: monospace;">${o.fechaCreacion ? new Date(o.fechaCreacion).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }) : (o.hora || '-')}</td>
                  <td style="font-family: monospace; font-weight: bold;">${o.codigoLote}</td>
                  <td><strong>${o.clienteNombre}</strong></td>
                  <td>${o.productoNombre}</td>
                  <td>${o.colorEspecificado || 'TRANSPARENTE'}</td>
                  <td>${o.fraganciaEspecificada || 'SIN FRAGANCIA'}</td>
                  <td style="font-family: monospace; font-weight: bold;">${o.cantidad} ${o.unidadMedida}</td>
                  <td>
                    <span class="status-badge ${
                      o.estado === 'TERMINADO' || o.estado === 'ENTREGADO'
                        ? 'badge-terminado'
                        : o.estado === 'EN PROCESO'
                        ? 'badge-proceso'
                        : o.estado === 'ETIQUETADO' || o.estado === 'EN ETIQUETADO'
                        ? 'badge-etiquetado'
                        : 'badge-pendiente'
                    }">
                      ${o.estado}
                    </span>
                  </td>
                  <td>${o.operarios || 'Sin Asignar'}</td>
                  <td style="font-size: 10px;">${o.prioridad || 'NORMAL'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="summary-card">
            <div style="font-size: 11px; font-weight: bold; color: #334155; text-transform: uppercase;">Resumen Consolidado del Turno</div>
            <div class="summary-grid">
              <div class="summary-item">
                <div class="summary-title">Total Órdenes</div>
                <div class="summary-val" style="color: #0284c7;">${resumen.totalOrdenes}</div>
              </div>
              <div class="summary-item">
                <div class="summary-title">Total KG/LT</div>
                <div class="summary-val" style="color: #7c3aed;">${resumen.totalKgProgramados}</div>
              </div>
              <div class="summary-item">
                <div class="summary-title">Terminados</div>
                <div class="summary-val" style="color: #16a34a;">${resumen.totalTerminados}</div>
              </div>
              <div class="summary-item">
                <div class="summary-title">En Proceso</div>
                <div class="summary-val" style="color: #2563eb;">${resumen.totalEnProceso}</div>
              </div>
              <div class="summary-item">
                <div class="summary-title">Pendientes</div>
                <div class="summary-val" style="color: #64748b;">${resumen.totalPendientes}</div>
              </div>
            </div>
          </div>
          <div class="firmas-container">
            <div class="firma-box">Responsable de Planta / Producción</div>
            <div class="firma-box">Supervisión / Control de Calidad QA</div>
            <div class="firma-box">Administración & Operaciones</div>
          </div>
          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `;

    windowPrint.document.write(html);
    windowPrint.document.close();
  };

  const cardBg = isDark ? 'bg-[#0F141C] border-[#1A2232]' : 'bg-white border-slate-200 shadow-sm';
  const textTitle = isDark ? 'text-slate-400' : 'text-slate-600';
  const textValue = isDark ? 'text-white' : 'text-slate-900';
  const inputBg = isDark
    ? 'bg-[#151D2A] border-[#1A2232] text-slate-200 placeholder-slate-500 focus:border-blue-500'
    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500';

  const fetchProgramacion = async () => {
    setLoading(true);
    try {
      const { data, ok } = await apiFetch<any>(
        `/produccion/ordenes/programacion-diaria?fecha=${selectedDate}`
      );
      if (ok && data) {
        if (data.resumen) {
          setResumen({
            totalOrdenes: Number(data.resumen.totalOrdenes) || 0,
            totalKgProgramados: data.resumen.totalKgProgramados || '0.00',
            totalTerminados: Number(data.resumen.totalTerminados) || 0,
            totalEnProceso: Number(data.resumen.totalEnProceso) || 0,
            totalPendientes: Number(data.resumen.totalPendientes) || 0,
          });
        }

        let rawList: any[] = [];
        if (Array.isArray(data.ordenes)) {
          rawList = data.ordenes;
        } else if (Array.isArray(data)) {
          rawList = data;
        }

        const mapped: OrdenProgramacionItem[] = rawList.map((item: any) => ({
          id: item.id,
          codigoLote: item.codigoLote,
          clienteNombre: item.clienteNombre || 'Cliente Quimicorp',
          productoNombre: item.productoNombre || 'Producto Industrial',
          colorEspecificado: item.colorEspecificado || item.color || 'TRANSPARENTE',
          fraganciaEspecificada: item.fraganciaEspecificada || item.fragancia || 'SIN FRAGANCIA',
          cantidad: Number(item.cantidad || item.cantidadPlanificada || item.cantidadKgLt) || 0,
          unidadMedida: item.unidadMedida || 'KG',
          estado: item.estado === 'DESPACHADO' ? 'ENTREGADO' : item.estado === 'EN_ETIQUETADO' ? 'EN ETIQUETADO' : item.estado === 'ETIQUETADO' ? 'ETIQUETADO' : item.estado === 'APROBADO' ? 'TERMINADO' : item.estado === 'EN_PROCESO' ? 'EN PROCESO' : item.estado || 'PENDIENTE',
          operarios: item.operarios || item.responsable || 'Sin Asignar',
          prioridad: item.prioridad || 'NORMAL',
          fechaCreacion: item.fechaCreacion,
          hora: item.hora || '12:00 PM',
        }));

        setOrdenes(mapped);
      }
    } catch (e) {
      console.error('Error al cargar la programación diaria de producción:', e);
      setOrdenes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgramacion();
  }, [selectedDate]);

  useEffect(() => {
    if (!socket) return;
    const onRefresh = () => fetchProgramacion();
    socket.on('lote:estado_actualizado', onRefresh);
    socket.on('pedido:aprobado', onRefresh);
    socket.on('order:created_to_plant', onRefresh);
    return () => {
      socket.off('lote:estado_actualizado', onRefresh);
      socket.off('pedido:aprobado', onRefresh);
      socket.off('order:created_to_plant', onRefresh);
    };
  }, [socket, selectedDate]);

  const ordenesFiltradas = ordenes.filter((o) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      o.codigoLote?.toLowerCase().includes(q) ||
      o.clienteNombre?.toLowerCase().includes(q) ||
      o.productoNombre?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* 📅 Toolbar Superior de Fecha e Inmutabilidad del Turno */}
      <DateNavigatorToolbar
        fecha={selectedDate}
        onFechaChange={(nueva) => setSelectedDate(nueva)}
        titulo="PLANILLA Y PROGRAMACIÓN DIARIA"
        subtitulo="Registro inmutable y control operativo del turno seleccionado"
        extraActions={
          <div className="relative">
            <button
              onClick={() => setShowExportMenu((prev) => !prev)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm ${
                isDark
                  ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/20'
                  : 'bg-teal-50 text-teal-800 border border-teal-300 hover:bg-teal-100'
              }`}
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Exportar Planilla</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showExportMenu ? 'rotate-180' : ''}`} />
            </button>

            {showExportMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowExportMenu(false)}
                />
                <div
                  className={`absolute right-0 top-full mt-2 w-60 rounded-xl border p-1.5 shadow-2xl z-50 font-sans backdrop-blur-md animate-in fade-in slide-in-from-top-1 duration-150 ${
                    isDark ? 'bg-[#0F141C]/95 border-[#1A2232]' : 'bg-white/95 border-slate-200'
                  }`}
                >
                  <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b mb-1 border-slate-700/30">
                    Elegir Formato de Descarga
                  </div>
                  <button
                    type="button"
                    onClick={exportarExcel}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2.5 transition-colors ${
                      isDark
                        ? 'text-emerald-300 hover:bg-emerald-500/15'
                        : 'text-emerald-700 hover:bg-emerald-50'
                    }`}
                  >
                    <div className="p-1.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      <FileSpreadsheet className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold">Exportar a Excel (.xlsx)</div>
                      <div className="text-[10px] text-slate-400 font-normal">Planilla digital estructurada</div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={exportarPDF}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2.5 transition-colors ${
                      isDark
                        ? 'text-rose-300 hover:bg-rose-500/15'
                        : 'text-rose-700 hover:bg-rose-50'
                    }`}
                  >
                    <div className="p-1.5 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400">
                      <Printer className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold">Exportar a PDF / Imprimir</div>
                      <div className="text-[10px] text-slate-400 font-normal">Membrete oficial y firmas</div>
                    </div>
                  </button>
                </div>
              </>
            )}
          </div>
        }
      />

      {/* 🏢 Subcard Oficial Quimicorp & Buscador */}
      <div className={`p-4 rounded-xl border flex flex-wrap items-center justify-between gap-4 ${cardBg}`}>
        <div>
          <h3 className={`text-sm font-bold font-sans flex items-center gap-2 ${textValue}`}>
            <span>QUIMICORP PERU S.A.C.</span>
            <span className="text-xs text-slate-400 font-mono">• RUC 20612434124</span>
          </h3>
          <p className={`text-xs font-sans ${textTitle}`}>
            PROGRAMACIÓN DIARIA DE PRODUCCIÓN — Planilla Digital Inmutable del Turno ({selectedDate})
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="🔍 Buscar por Cliente, Producto o Lote..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-sans w-64 ${inputBg}`}
          />
        </div>
      </div>

      {/* 📊 KPI Bar Superior (Resumen de Métricas Diarias) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {/* KPI 1: TOTAL ÓRDENES */}
        <div className={`rounded-xl p-4 border relative overflow-hidden ${cardBg}`}>
          <div className="absolute top-0 left-0 right-0 h-1 bg-cyan-500" />
          <div className={`text-[10px] font-bold tracking-widest uppercase ${textTitle}`}>
            TOTAL ÓRDENES DE PROD.
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-2xl font-black font-mono ${textValue}`}>
              {resumen.totalOrdenes}
            </span>
            <span className="text-xs text-slate-400 font-sans">lotes</span>
          </div>
        </div>

        {/* KPI 2: TOTAL KG PROGRAMADOS */}
        <div className={`rounded-xl p-4 border relative overflow-hidden ${cardBg}`}>
          <div className="absolute top-0 left-0 right-0 h-1 bg-purple-500" />
          <div className={`text-[10px] font-bold tracking-widest uppercase ${textTitle}`}>
            TOTAL KG/LT PROGRAMADOS
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-2xl font-black font-mono ${textValue}`}>
              {resumen.totalKgProgramados}
            </span>
            <span className="text-xs text-slate-400 font-sans">KG/LT</span>
          </div>
        </div>

        {/* KPI 3: TERMINADOS */}
        <div className={`rounded-xl p-4 border relative overflow-hidden ${cardBg}`}>
          <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500" />
          <div className={`text-[10px] font-bold tracking-widest uppercase text-emerald-500`}>
            🟢 TERMINADOS
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-2xl font-black font-mono text-emerald-400`}>
              {resumen.totalTerminados}
            </span>
            <span className="text-xs text-slate-400 font-sans">lotes liberados</span>
          </div>
        </div>

        {/* KPI 4: EN PROCESO */}
        <div className={`rounded-xl p-4 border relative overflow-hidden ${cardBg}`}>
          <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500" />
          <div className={`text-[10px] font-bold tracking-widest uppercase text-blue-500`}>
            🔵 EN PROCESO
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-2xl font-black font-mono text-blue-400`}>
              {resumen.totalEnProceso}
            </span>
            <span className="text-xs text-slate-400 font-sans">en reactores</span>
          </div>
        </div>

        {/* KPI 5: PENDIENTES */}
        <div className={`rounded-xl p-4 border relative overflow-hidden ${cardBg}`}>
          <div className="absolute top-0 left-0 right-0 h-1 bg-slate-500" />
          <div className={`text-[10px] font-bold tracking-widest uppercase ${textTitle}`}>
            ⚪ PENDIENTES
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-2xl font-black font-mono ${textValue}`}>
              {resumen.totalPendientes}
            </span>
            <span className="text-xs text-slate-400 font-sans">en cola</span>
          </div>
        </div>
      </div>

      {/* 📋 DataGrid Industrial (Digitalización del Excel) */}
      <div className={`rounded-xl border overflow-hidden ${cardBg}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className={`border-b ${isDark ? 'bg-[#151D2A] border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-700'}`}>
                <th className="p-3 font-bold uppercase tracking-wider">HORA</th>
                <th className="p-3 font-bold uppercase tracking-wider">ORD. PROD.</th>
                <th className="p-3 font-bold uppercase tracking-wider">CLIENTE</th>
                <th className="p-3 font-bold uppercase tracking-wider">PRODUCTO</th>
                <th className="p-3 font-bold uppercase tracking-wider">COLOR</th>
                <th className="p-3 font-bold uppercase tracking-wider">FRAGANCIA</th>
                <th className="p-3 font-bold uppercase tracking-wider">CANTIDAD</th>
                <th className="p-3 font-bold uppercase tracking-wider">ESTADO</th>
                <th className="p-3 font-bold uppercase tracking-wider">RESPONSABLE</th>
                <th className="p-3 font-bold uppercase tracking-wider">PRIORIDAD</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-slate-800/60' : 'divide-slate-200'}`}>
              {loading ? (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-slate-500 font-sans">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-blue-500 mb-2" />
                    Cargando planilla digital de producción...
                  </td>
                </tr>
              ) : ordenesFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-slate-500 font-sans">
                    No hay registros de producción encontrados para la fecha seleccionada ({selectedDate}).
                  </td>
                </tr>
              ) : (
                ordenesFiltradas.map((o) => (
                  <tr key={o.id} className={`hover:bg-slate-800/20 transition-colors ${isDark ? '' : 'hover:bg-slate-50'}`}>
                    <td className="p-3 font-mono text-[11px] text-slate-400">
                      {o.fechaCreacion
                        ? new Date(o.fechaCreacion).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })
                        : o.hora || '12:22 p. m.'}
                    </td>
                    <td className="p-3 font-mono font-bold text-[#00F2C3]">{o.codigoLote}</td>
                    <td className="p-3 font-bold">{o.clienteNombre}</td>
                    <td className="p-3 font-sans font-medium">{o.productoNombre}</td>
                    <td className="p-3 font-sans whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border inline-flex items-center gap-1.5 shadow-sm whitespace-nowrap ${
                        o.colorEspecificado && o.colorEspecificado !== 'TRANSPARENTE' && o.colorEspecificado !== 'SIN COLOR'
                          ? isDark
                            ? 'bg-purple-500/20 text-purple-200 border-purple-500/40'
                            : 'bg-purple-100 text-purple-900 border-purple-300 font-extrabold'
                          : isDark
                          ? 'bg-slate-800/60 text-slate-400 border-slate-700'
                          : 'bg-slate-100 text-slate-600 border-slate-300'
                      }`}>
                        <span className="w-2 h-2 rounded-full bg-purple-400 inline-block" />
                        {o.colorEspecificado || 'TRANSPARENTE'}
                      </span>
                    </td>
                    <td className="p-3 font-sans whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border inline-flex items-center gap-1.5 shadow-sm whitespace-nowrap ${
                        o.fraganciaEspecificada && o.fraganciaEspecificada !== 'SIN FRAGANCIA' && o.fraganciaEspecificada !== 'SIN AROMA'
                          ? isDark
                            ? 'bg-amber-500/20 text-amber-200 border-amber-500/40'
                            : 'bg-amber-100 text-amber-900 border-amber-300 font-extrabold'
                          : isDark
                          ? 'bg-slate-800/60 text-slate-400 border-slate-700'
                          : 'bg-slate-100 text-slate-600 border-slate-300'
                      }`}>
                        <span className="text-xs">🌸</span>
                        {o.fraganciaEspecificada || 'SIN FRAGANCIA'}
                      </span>
                    </td>
                    <td className="p-3 font-mono font-bold">{o.cantidad} {o.unidadMedida}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-black tracking-wide border uppercase font-mono ${
                        o.estado === 'TERMINADO'
                          ? isDark ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold'
                          : o.estado === 'EN PROCESO'
                          ? isDark ? 'bg-blue-500/20 text-blue-300 border-blue-500/40' : 'bg-blue-100 text-blue-900 border-blue-300 font-bold'
                          : isDark ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-slate-100 text-slate-600 border-slate-300'
                      }`}>
                        {o.estado}
                      </span>
                    </td>
                    <td className="p-3 font-sans">
                      <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border inline-flex items-center gap-1.5 ${
                        isDark ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30' : 'bg-cyan-50 text-cyan-900 border-cyan-200'
                      }`}>
                        <User className="w-3.5 h-3.5 text-cyan-400" />
                        {o.operarios || 'Sin Asignar'}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-[11px] text-slate-400 font-bold">
                      {o.prioridad}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
