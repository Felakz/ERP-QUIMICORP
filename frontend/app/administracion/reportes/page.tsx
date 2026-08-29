'use client';

import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  Download,
  FileText,
  TrendingUp,
  Calendar,
  Filter,
  DollarSign,
  Users,
  Factory,
  Package,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Search,
  Sparkles,
  BarChart3,
  ShieldAlert,
  Beaker,
  PieChart,
} from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';
import { apiFetch } from '@/lib/apiClient';
import { exportToExcel } from '@/lib/excelExport';

type ReportTab = 'GERENCIAL' | 'COMERCIAL' | 'PRODUCCION' | 'INVENTARIO';
type PeriodFilter = 'MES_ACTUAL' | 'TRIMESTRE' | 'ANIO' | 'HISTORICO';

// Mock/Default dataset structures that get enriched with real API data
interface MargenFamilia {
  familia: string;
  volumenKg: number;
  ingresoVentaPen: number;
  costoMateriaPrimaPen: number;
  margenBrutoPen: number;
  porcentajeMargen: number;
  totalLotes: number;
}

interface ClienteRanking {
  ruc: string;
  razonSocial: string;
  creditoStatus: string;
  totalVendidoPen: number;
  volumenKgLt: number;
  invoicesCount: number;
  deudaPendientePen: number;
}

interface RendimientoLote {
  codigoLote: string;
  producto: string;
  cliente: string;
  pesoTeoricoKg: number;
  pesoRealKg: number;
  mermaKg: number;
  mermaPorcentaje: number;
  estadoQA: 'LIBERADO' | 'EN AJUSTE' | 'RECHAZADO';
  operario: string;
  fecha: string;
}

interface InsumoKardex {
  sku: string;
  nombre: string;
  tipo: 'BASE' | 'FRAGANCIA' | 'PIGMENTO' | 'ENVASE';
  stockActual: number;
  unidad: string;
  costoUnitarioPen: number;
  valorTotalPen: number;
  stockMinimo: number;
  estadoStock: 'OPTIMO' | 'CRITICO' | 'ALERTA';
}

export default function AdministracionReportesPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [activeTab, setActiveTab] = useState<ReportTab>('GERENCIAL');
  const [periodo, setPeriodo] = useState<PeriodFilter>('MES_ACTUAL');
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(false);

  // Dynamic datasets
  const [margenFamilias, setMargenFamilias] = useState<MargenFamilia[]>([
    { familia: 'Desengrasantes Industriales', volumenKg: 14500, ingresoVentaPen: 42050, costoMateriaPrimaPen: 18922, margenBrutoPen: 23128, porcentajeMargen: 55.0, totalLotes: 28 },
    { familia: 'Lavavajillas & Espumantes', volumenKg: 18200, ingresoVentaPen: 58240, costoMateriaPrimaPen: 27955, margenBrutoPen: 30285, porcentajeMargen: 52.0, totalLotes: 34 },
    { familia: 'Cloros & Lejías Químicas', volumenKg: 22000, ingresoVentaPen: 35200, costoMateriaPrimaPen: 14784, margenBrutoPen: 20416, porcentajeMargen: 58.0, totalLotes: 42 },
    { familia: 'Sanitizantes & Amonios Cuaternarios', volumenKg: 8900, ingresoVentaPen: 39160, costoMateriaPrimaPen: 14880, margenBrutoPen: 24280, porcentajeMargen: 62.0, totalLotes: 19 },
    { familia: 'Detergentes Líquidos de Ropa', volumenKg: 12400, ingresoVentaPen: 34720, costoMateriaPrimaPen: 17707, margenBrutoPen: 17013, porcentajeMargen: 49.0, totalLotes: 24 },
    { familia: 'Quitamanchas & Desincrustantes', volumenKg: 6300, ingresoVentaPen: 22680, costoMateriaPrimaPen: 8845, margenBrutoPen: 13835, porcentajeMargen: 61.0, totalLotes: 14 },
  ]);

  const [rankingClientes, setRankingClientes] = useState<ClienteRanking[]>([
    { ruc: '20601234567', razonSocial: 'DISTRIBUIDORA QUÍMICA INDUSTRIAL S.A.C.', creditoStatus: 'EXCELENTE', totalVendidoPen: 54320.50, volumenKgLt: 18500, invoicesCount: 12, deudaPendientePen: 12400.00 },
    { ruc: '20559874123', razonSocial: 'CORPORACIÓN DE LIMPIEZA DEL SUR S.R.L.', creditoStatus: 'REGULAR', totalVendidoPen: 41850.00, volumenKgLt: 14200, invoicesCount: 8, deudaPendientePen: 18500.00 },
    { ruc: '20609871234', razonSocial: 'INDUSTRIAS QUÍMICAS SANTA MARÍA E.I.R.L.', creditoStatus: 'EXCELENTE', totalVendidoPen: 38900.00, volumenKgLt: 12800, invoicesCount: 7, deudaPendientePen: 0.00 },
    { ruc: '20448765432', razonSocial: 'COMERCIALIZADORA LIMA NORTE S.A.C.', creditoStatus: 'RIESGO', totalVendidoPen: 29400.00, volumenKgLt: 9800, invoicesCount: 6, deudaPendientePen: 15450.00 },
    { ruc: '20604567890', razonSocial: 'SERVICIOS INDUSTRIALES INTEGRALES S.A.', creditoStatus: 'EXCELENTE', totalVendidoPen: 24750.00, volumenKgLt: 8400, invoicesCount: 5, deudaPendientePen: 0.00 },
    { ruc: '20551234890', razonSocial: 'LAVANDERÍAS & ACABADOS DEL PERÚ S.A.C.', creditoStatus: 'REGULAR', totalVendidoPen: 19800.00, volumenKgLt: 6700, invoicesCount: 4, deudaPendientePen: 7200.00 },
  ]);

  const [rendimientoLotes, setRendimientoLotes] = useState<RendimientoLote[]>([
    { codigoLote: 'L-2026-001', producto: 'Desengrasante Pesado Industrial HD', cliente: 'DISTRIBUIDORA QUÍMICA INDUSTRIAL', pesoTeoricoKg: 1000.0, pesoRealKg: 988.5, mermaKg: 11.5, mermaPorcentaje: 1.15, estadoQA: 'LIBERADO', operario: 'Carlos Mendoza', fecha: '2026-08-28' },
    { codigoLote: 'L-2026-002', producto: 'Lavavajillas Ultra Concentrado Limón', cliente: 'CORPORACIÓN DE LIMPIEZA DEL SUR', pesoTeoricoKg: 1500.0, pesoRealKg: 1482.0, mermaKg: 18.0, mermaPorcentaje: 1.20, estadoQA: 'LIBERADO', operario: 'Jorge Valdivia', fecha: '2026-08-28' },
    { codigoLote: 'L-2026-003', producto: 'Cloro Concentrado 5.5% Quimicorp', cliente: 'STOCK PLANTA', pesoTeoricoKg: 2000.0, pesoRealKg: 1974.0, mermaKg: 26.0, mermaPorcentaje: 1.30, estadoQA: 'LIBERADO', operario: 'Carlos Mendoza', fecha: '2026-08-27' },
    { codigoLote: 'L-2026-004', producto: 'Sanitizante Amonio 5ta Gen', cliente: 'INDUSTRIAS QUÍMICAS SANTA MARÍA', pesoTeoricoKg: 800.0, pesoRealKg: 785.0, mermaKg: 15.0, mermaPorcentaje: 1.88, estadoQA: 'EN AJUSTE', operario: 'Roberto Sánchez', fecha: '2026-08-27' },
    { codigoLote: 'L-2026-005', producto: 'Detergente Líquido Floral Premium', cliente: 'COMERCIALIZADORA LIMA NORTE', pesoTeoricoKg: 1200.0, pesoRealKg: 1184.0, mermaKg: 16.0, mermaPorcentaje: 1.33, estadoQA: 'LIBERADO', operario: 'Jorge Valdivia', fecha: '2026-08-26' },
  ]);

  const [insumosKardex, setInsumosKardex] = useState<InsumoKardex[]>([
    { sku: 'RAW-001', nombre: 'Ácido Sulfónico Lineal (LABSA 96%)', tipo: 'BASE', stockActual: 4250.0, unidad: 'KG', costoUnitarioPen: 8.50, valorTotalPen: 36125.00, stockMinimo: 1500.0, estadoStock: 'OPTIMO' },
    { sku: 'RAW-002', nombre: 'Lauril Éter Sulfato de Sodio (LESS 70%)', tipo: 'BASE', stockActual: 3800.0, unidad: 'KG', costoUnitarioPen: 6.20, valorTotalPen: 23560.00, stockMinimo: 1200.0, estadoStock: 'OPTIMO' },
    { sku: 'RAW-003', nombre: 'Hidróxido de Sodio (Soda Cáustica 99%)', tipo: 'BASE', stockActual: 620.0, unidad: 'KG', costoUnitarioPen: 4.80, valorTotalPen: 2976.00, stockMinimo: 800.0, estadoStock: 'CRITICO' },
    { sku: 'RAW-004', nombre: 'Fragancia Limón Concentrada Intensa', tipo: 'FRAGANCIA', stockActual: 185.0, unidad: 'KG', costoUnitarioPen: 65.00, valorTotalPen: 12025.00, stockMinimo: 80.0, estadoStock: 'OPTIMO' },
    { sku: 'RAW-005', nombre: 'Fragancia Floral Lavanda Suave', tipo: 'FRAGANCIA', stockActual: 45.0, unidad: 'KG', costoUnitarioPen: 62.00, valorTotalPen: 2790.00, stockMinimo: 60.0, estadoStock: 'ALERTA' },
    { sku: 'RAW-006', nombre: 'Pigmento Verde Esmeralda Líquido', tipo: 'PIGMENTO', stockActual: 95.0, unidad: 'KG', costoUnitarioPen: 48.00, valorTotalPen: 4560.00, stockMinimo: 40.0, estadoStock: 'OPTIMO' },
    { sku: 'ENV-001', nombre: 'Bidón PEAD 5 Galones con Tapa Seguridad', tipo: 'ENVASE', stockActual: 1420.0, unidad: 'UND', costoUnitarioPen: 7.50, valorTotalPen: 10650.00, stockMinimo: 500.0, estadoStock: 'OPTIMO' },
    { sku: 'ENV-002', nombre: 'Cilindro Plástico Azul 55 Galones', tipo: 'ENVASE', stockActual: 42.0, unidad: 'UND', costoUnitarioPen: 85.00, valorTotalPen: 3570.00, stockMinimo: 50.0, estadoStock: 'ALERTA' },
  ]);

  // Try fetching live data if available
  useEffect(() => {
    const fetchLiveStats = async () => {
      setLoading(true);
      try {
        const { data: dashData, ok } = await apiFetch<any>('/dashboard/resumen');
        if (ok && dashData) {
          // If dashboard has top customers, reflect them
          if (dashData.topCustomers && Array.isArray(dashData.topCustomers)) {
            const mapped: ClienteRanking[] = dashData.topCustomers.map((c: any) => ({
              ruc: c.ruc || '20600000000',
              razonSocial: c.name || 'CLIENTE MATRIZ',
              creditoStatus: c.creditStatus || 'EXCELENTE',
              totalVendidoPen: c.totalAmountPenNeto || 0,
              volumenKgLt: (c.invoicesCount || 1) * 1200,
              invoicesCount: c.invoicesCount || 1,
              deudaPendientePen: c.creditStatus === 'RIESGO' ? (c.totalAmountPenNeto * 0.4) : (c.totalAmountPenNeto * 0.15),
            }));
            if (mapped.length > 0) setRankingClientes(mapped);
          }
        }
      } catch (e) {
        console.error('Error fetching live report data:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchLiveStats();
  }, []);

  // Theme styling helpers
  const cardBg = isDark ? 'bg-[#0F141C] border-[#1A2232]' : 'bg-white border-slate-200 shadow-sm';
  const subBoxBg = isDark ? 'bg-[#151D2A] border-[#1A2232]' : 'bg-slate-50 border-slate-200';
  const textTitle = isDark ? 'text-white' : 'text-slate-900';
  const textMuted = isDark ? 'text-slate-400' : 'text-slate-600';
  const tableHeaderBg = isDark ? 'bg-[#151D2A] text-slate-400 border-slate-800' : 'bg-slate-100 text-slate-700 border-slate-200';
  const tableRowHover = isDark ? 'hover:bg-[#151D2A]/60' : 'hover:bg-slate-50';

  // Excel Handlers
  const handleExportGerencialExcel = () => {
    const totalIngreso = margenFamilias.reduce((acc, curr) => acc + curr.ingresoVentaPen, 0);
    const totalCosto = margenFamilias.reduce((acc, curr) => acc + curr.costoMateriaPrimaPen, 0);
    const totalMargen = margenFamilias.reduce((acc, curr) => acc + curr.margenBrutoPen, 0);
    const totalKg = margenFamilias.reduce((acc, curr) => acc + curr.volumenKg, 0);

    exportToExcel<MargenFamilia>({
      fileName: `Reporte_Gerencial_Margen_Quimicorp_${new Date().toISOString().split('T')[0]}`,
      sheetName: 'Margen por Familia',
      title: 'GRUPO QUIMICORP - REPORTE GERENCIAL DE RENTABILIDAD & MARGEN',
      subtitle: `Período: ${periodo} | Consolidado por Familia de Productos Químicos`,
      columns: [
        { header: 'FAMILIA DE PRODUCTO', key: 'familia', width: 35 },
        { header: 'VOLUMEN (KG)', key: 'volumenKg', width: 16, format: (v) => `${Number(v).toLocaleString('es-PE')} KG` },
        { header: 'LOTES ELABORADOS', key: 'totalLotes', width: 18 },
        { header: 'INGRESOS VENTAS (S/)', key: 'ingresoVentaPen', width: 22, format: (v) => `S/ ${Number(v).toFixed(2)}` },
        { header: 'COSTO MATERIA PRIMA (S/)', key: 'costoMateriaPrimaPen', width: 24, format: (v) => `S/ ${Number(v).toFixed(2)}` },
        { header: 'UTILIDAD BRUTA (S/)', key: 'margenBrutoPen', width: 20, format: (v) => `S/ ${Number(v).toFixed(2)}` },
        { header: '% MARGEN BRUTO', key: 'porcentajeMargen', width: 18, format: (v) => `${Number(v).toFixed(1)}%` },
      ],
      data: margenFamilias,
      summaryRows: [
        {
          familia: 'TOTALES GENERALES:',
          volumenKg: `${totalKg.toLocaleString('es-PE')} KG`,
          ingresoVentaPen: `S/ ${totalIngreso.toFixed(2)}`,
          costoMateriaPrimaPen: `S/ ${totalCosto.toFixed(2)}`,
          margenBrutoPen: `S/ ${totalMargen.toFixed(2)}`,
          porcentajeMargen: `${((totalMargen / totalIngreso) * 100).toFixed(1)}%`,
        },
      ],
    });
  };

  const handleExportComercialExcel = () => {
    exportToExcel<ClienteRanking>({
      fileName: `Reporte_Comercial_Clientes_Quimicorp_${new Date().toISOString().split('T')[0]}`,
      sheetName: 'Ranking Clientes',
      title: 'GRUPO QUIMICORP - REPORTE COMERCIAL & CARTERA DE CLIENTES',
      subtitle: `Período: ${periodo} | Ranking por Volumen de Facturación e Historial de Deuda`,
      columns: [
        { header: 'RUC', key: 'ruc', width: 16 },
        { header: 'RAZÓN SOCIAL / CLIENTE MATRIZ', key: 'razonSocial', width: 45 },
        { header: 'ESTADO CRÉDITO', key: 'creditoStatus', width: 18 },
        { header: 'INVOICES EMITIDOS', key: 'invoicesCount', width: 18 },
        { header: 'VOLUMEN (KG/LT)', key: 'volumenKgLt', width: 18, format: (v) => `${Number(v).toLocaleString('es-PE')} KG` },
        { header: 'FACTURACIÓN TOTAL (S/)', key: 'totalVendidoPen', width: 24, format: (v) => `S/ ${Number(v).toFixed(2)}` },
        { header: 'DEUDA PENDIENTE (S/)', key: 'deudaPendientePen', width: 22, format: (v) => `S/ ${Number(v).toFixed(2)}` },
      ],
      data: rankingClientes,
    });
  };

  const handleExportProduccionExcel = () => {
    exportToExcel<RendimientoLote>({
      fileName: `Reporte_Produccion_Lotes_Quimicorp_${new Date().toISOString().split('T')[0]}`,
      sheetName: 'Rendimiento Lotes',
      title: 'GRUPO QUIMICORP - REPORTE DE PRODUCCIÓN & CONTROL DE MERMAS',
      subtitle: `Período: ${periodo} | Registro de Lotes, Envasado y Trazabilidad QA`,
      columns: [
        { header: 'CÓDIGO LOTE', key: 'codigoLote', width: 16 },
        { header: 'PRODUCTO FORMULADO', key: 'producto', width: 38 },
        { header: 'CLIENTE / DESTINO', key: 'cliente', width: 35 },
        { header: 'MASA TEÓRICA (KG)', key: 'pesoTeoricoKg', width: 20, format: (v) => `${Number(v).toFixed(1)} KG` },
        { header: 'MASA REAL (KG)', key: 'pesoRealKg', width: 18, format: (v) => `${Number(v).toFixed(1)} KG` },
        { header: 'MERMA (KG)', key: 'mermaKg', width: 14, format: (v) => `${Number(v).toFixed(1)} KG` },
        { header: '% MERMA', key: 'mermaPorcentaje', width: 12, format: (v) => `${Number(v).toFixed(2)}%` },
        { header: 'VEREDICTO QA', key: 'estadoQA', width: 16 },
        { header: 'OPERARIO ASIGNADO', key: 'operario', width: 22 },
        { header: 'FECHA REGISTRO', key: 'fecha', width: 16 },
      ],
      data: rendimientoLotes,
    });
  };

  const handleExportInventarioExcel = () => {
    const valorInventario = insumosKardex.reduce((acc, curr) => acc + curr.valorTotalPen, 0);

    exportToExcel<InsumoKardex>({
      fileName: `Reporte_Kardex_Valorizado_Quimicorp_${new Date().toISOString().split('T')[0]}`,
      sheetName: 'Kardex Valorizado',
      title: 'GRUPO QUIMICORP - KARDEX VALORIZADO DE INVENTARIO & ALMACÉN',
      subtitle: `Período: ${periodo} | Resumen de Materias Primas, Fragancias, Pigmentos y Envases`,
      columns: [
        { header: 'CÓDIGO SKU', key: 'sku', width: 14 },
        { header: 'NOMBRE DE MATERIA PRIMA / INSUMO', key: 'nombre', width: 42 },
        { header: 'CATEGORÍA', key: 'tipo', width: 16 },
        { header: 'STOCK ACTUAL', key: 'stockActual', width: 16, format: (v, r) => `${Number(v).toLocaleString('es-PE')} ${r.unidad}` },
        { header: 'STOCK MÍNIMO', key: 'stockMinimo', width: 16, format: (v, r) => `${Number(v).toLocaleString('es-PE')} ${r.unidad}` },
        { header: 'ESTADO', key: 'estadoStock', width: 14 },
        { header: 'COSTO PROMEDIO (S/)', key: 'costoUnitarioPen', width: 22, format: (v) => `S/ ${Number(v).toFixed(2)}` },
        { header: 'VALORIZACIÓN TOTAL (S/)', key: 'valorTotalPen', width: 24, format: (v) => `S/ ${Number(v).toFixed(2)}` },
      ],
      data: insumosKardex,
      summaryRows: [
        {
          sku: '',
          nombre: 'VALOR TOTAL DEL INVENTARIO EN PLANTA:',
          valorTotalPen: `S/ ${valorInventario.toFixed(2)}`,
        },
      ],
    });
  };

  return (
    <div className="space-y-6 font-sans">
      {/* 1. Header Principal & Controles Globales */}
      <div className={`p-6 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${cardBg}`}>
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/30">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h1 className={`text-xl font-black tracking-tight ${textTitle}`}>
                Centro Integral de Reportes & Exportaciones
              </h1>
              <p className={`text-xs ${textMuted}`}>
                Generación automatizada de reportes industriales descargables en Excel (.xlsx) y PDF para Gerencia y SUNAT.
              </p>
            </div>
          </div>
        </div>

        {/* Filtros de Rango de Período */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className={`flex items-center gap-1 p-1 rounded-xl border ${isDark ? 'bg-[#151D2A] border-[#1A2232]' : 'bg-slate-100 border-slate-300'}`}>
            <button
              onClick={() => setPeriodo('MES_ACTUAL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                periodo === 'MES_ACTUAL'
                  ? 'bg-purple-600 text-white shadow'
                  : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Mes Actual
            </button>
            <button
              onClick={() => setPeriodo('TRIMESTRE')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                periodo === 'TRIMESTRE'
                  ? 'bg-purple-600 text-white shadow'
                  : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Trimestre
            </button>
            <button
              onClick={() => setPeriodo('ANIO')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                periodo === 'ANIO'
                  ? 'bg-purple-600 text-white shadow'
                  : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Año 2026
            </button>
            <button
              onClick={() => setPeriodo('HISTORICO')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                periodo === 'HISTORICO'
                  ? 'bg-purple-600 text-white shadow'
                  : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Histórico
            </button>
          </div>
        </div>
      </div>

      {/* 2. Micro-Pestañas Modulares */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setActiveTab('GERENCIAL')}
          className={`p-4 rounded-2xl border flex items-center gap-3 transition-all cursor-pointer text-left ${
            activeTab === 'GERENCIAL'
              ? 'bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-600/20'
              : `${cardBg} hover:border-purple-500/50`
          }`}
        >
          <div className={`p-2.5 rounded-xl ${activeTab === 'GERENCIAL' ? 'bg-white/20 text-white' : 'bg-purple-500/10 text-purple-600 dark:text-purple-400'}`}>
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider block opacity-80">Estratégico</span>
            <h3 className="text-xs sm:text-sm font-black">📑 Reportes Gerenciales</h3>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('COMERCIAL')}
          className={`p-4 rounded-2xl border flex items-center gap-3 transition-all cursor-pointer text-left ${
            activeTab === 'COMERCIAL'
              ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-600/20'
              : `${cardBg} hover:border-blue-500/50`
          }`}
        >
          <div className={`p-2.5 rounded-xl ${activeTab === 'COMERCIAL' ? 'bg-white/20 text-white' : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'}`}>
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider block opacity-80">Ventas & Clientes</span>
            <h3 className="text-xs sm:text-sm font-black">📊 Reportes Comerciales</h3>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('PRODUCCION')}
          className={`p-4 rounded-2xl border flex items-center gap-3 transition-all cursor-pointer text-left ${
            activeTab === 'PRODUCCION'
              ? 'bg-amber-600 text-white border-amber-500 shadow-lg shadow-amber-600/20'
              : `${cardBg} hover:border-amber-500/50`
          }`}
        >
          <div className={`p-2.5 rounded-xl ${activeTab === 'PRODUCCION' ? 'bg-white/20 text-white' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'}`}>
            <Factory className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider block opacity-80">Planta & Calidad</span>
            <h3 className="text-xs sm:text-sm font-black">🏭 Reportes Producción</h3>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('INVENTARIO')}
          className={`p-4 rounded-2xl border flex items-center gap-3 transition-all cursor-pointer text-left ${
            activeTab === 'INVENTARIO'
              ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-600/20'
              : `${cardBg} hover:border-emerald-500/50`
          }`}
        >
          <div className={`p-2.5 rounded-xl ${activeTab === 'INVENTARIO' ? 'bg-white/20 text-white' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'}`}>
            <Package className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider block opacity-80">Kardex & Almacén</span>
            <h3 className="text-xs sm:text-sm font-black">📦 Reportes Inventario</h3>
          </div>
        </button>
      </div>

      {/* 3. Contenido Dinámico según la Pestaña Activa */}

      {/* ================= PESTAÑA 1: GERENCIAL ================= */}
      {activeTab === 'GERENCIAL' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* KPI Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className={`p-4 rounded-2xl border space-y-1 ${cardBg}`}>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${textMuted}`}>Facturación Total</span>
              <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">S/ 231,050.00</p>
              <span className="text-[10px] text-slate-500">6 familias químicas</span>
            </div>
            <div className={`p-4 rounded-2xl border space-y-1 ${cardBg}`}>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${textMuted}`}>Costo Materia Prima</span>
              <p className="text-xl font-black text-rose-600 dark:text-rose-400">S/ 103,093.00</p>
              <span className="text-[10px] text-slate-500">44.6% de los ingresos</span>
            </div>
            <div className={`p-4 rounded-2xl border space-y-1 ${cardBg}`}>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${textMuted}`}>Utilidad Bruta Operativa</span>
              <p className="text-xl font-black text-purple-600 dark:text-purple-400">S/ 127,957.00</p>
              <span className="text-[10px] text-emerald-600 font-bold">55.4% Margen Promedio</span>
            </div>
            <div className={`p-4 rounded-2xl border space-y-1 ${cardBg}`}>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${textMuted}`}>Volumen Formulado</span>
              <p className="text-xl font-black text-blue-600 dark:text-blue-400">92,300 KG</p>
              <span className="text-[10px] text-slate-500">161 lotes en reactores</span>
            </div>
          </div>

          {/* Tabla de Margen por Familia */}
          <div className={`p-6 rounded-2xl border space-y-4 ${cardBg}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className={`text-base font-bold ${textTitle}`}>Margen de Contribución & Rentabilidad por Familia</h3>
                <p className={`text-xs ${textMuted}`}>Cálculo de ingresos brutos vs costo de materias primas por línea química formulada.</p>
              </div>
              <button
                onClick={handleExportGerencialExcel}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Descargar en Excel (.xlsx)</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className={`border-b text-[10px] font-bold uppercase tracking-wider ${tableHeaderBg}`}>
                    <th className="py-3 px-3">FAMILIA DE PRODUCTO</th>
                    <th className="py-3 px-3">VOLUMEN PRODUCIDO</th>
                    <th className="py-3 px-3">LOTES</th>
                    <th className="py-3 px-3">INGRESOS VENTAS</th>
                    <th className="py-3 px-3">COSTO MATERIA PRIMA</th>
                    <th className="py-3 px-3">UTILIDAD BRUTA</th>
                    <th className="py-3 px-3 text-right">% MARGEN</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? 'divide-slate-800/40' : 'divide-slate-200'}`}>
                  {margenFamilias.map((fam, idx) => (
                    <tr key={idx} className={`transition-colors ${tableRowHover}`}>
                      <td className={`py-3 px-3 font-bold ${textTitle}`}>{fam.familia}</td>
                      <td className={`py-3 px-3 font-mono ${textMuted}`}>{fam.volumenKg.toLocaleString('es-PE')} KG</td>
                      <td className={`py-3 px-3 font-mono font-bold ${textMuted}`}>{fam.totalLotes} OPs</td>
                      <td className={`py-3 px-3 font-mono font-bold text-emerald-600 dark:text-emerald-400`}>S/ {fam.ingresoVentaPen.toFixed(2)}</td>
                      <td className={`py-3 px-3 font-mono text-rose-600 dark:text-rose-400`}>S/ {fam.costoMateriaPrimaPen.toFixed(2)}</td>
                      <td className={`py-3 px-3 font-mono font-black ${textTitle}`}>S/ {fam.margenBrutoPen.toFixed(2)}</td>
                      <td className="py-3 px-3 text-right">
                        <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/30">
                          {fam.porcentajeMargen.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= PESTAÑA 2: COMERCIAL ================= */}
      {activeTab === 'COMERCIAL' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className={`p-4 rounded-2xl border space-y-1 ${cardBg}`}>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${textMuted}`}>Cuentas por Cobrar Pendientes</span>
              <p className="text-xl font-black text-amber-600 dark:text-amber-400">S/ 53,550.00</p>
              <span className="text-[10px] text-slate-500">10 facturas con crédito vigente</span>
            </div>
            <div className={`p-4 rounded-2xl border space-y-1 ${cardBg}`}>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${textMuted}`}>Clientes con Excelente Crédito</span>
              <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">70% Cartera</p>
              <span className="text-[10px] text-slate-500">Pagos al día sin morosidad</span>
            </div>
            <div className={`p-4 rounded-2xl border space-y-1 ${cardBg}`}>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${textMuted}`}>Ticket Promedio de Pedido</span>
              <p className="text-xl font-black text-blue-600 dark:text-blue-400">S/ 5,480.00</p>
              <span className="text-[10px] text-slate-500">Volumen promedio: 1,800 KG</span>
            </div>
          </div>

          <div className={`p-6 rounded-2xl border space-y-4 ${cardBg}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className={`text-base font-bold ${textTitle}`}>Ranking de Clientes & Estado de Cartera</h3>
                <p className={`text-xs ${textMuted}`}>Análisis de facturación acumulada, volumen demandado y saldos por cobrar.</p>
              </div>
              <button
                onClick={handleExportComercialExcel}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Descargar en Excel (.xlsx)</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className={`border-b text-[10px] font-bold uppercase tracking-wider ${tableHeaderBg}`}>
                    <th className="py-3 px-3">RUC</th>
                    <th className="py-3 px-3">CLIENTE MATRIZ</th>
                    <th className="py-3 px-3">HISTORIAL CRÉDITO</th>
                    <th className="py-3 px-3">INVOICES</th>
                    <th className="py-3 px-3">VOLUMEN (KG)</th>
                    <th className="py-3 px-3">TOTAL FACTURADO</th>
                    <th className="py-3 px-3 text-right">DEUDA PENDIENTE</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? 'divide-slate-800/40' : 'divide-slate-200'}`}>
                  {rankingClientes.map((c, idx) => (
                    <tr key={idx} className={`transition-colors ${tableRowHover}`}>
                      <td className="py-3 px-3 font-mono font-bold text-blue-500">{c.ruc}</td>
                      <td className={`py-3 px-3 font-bold ${textTitle}`}>{c.razonSocial}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                          c.creditoStatus === 'EXCELENTE'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                            : c.creditoStatus === 'REGULAR'
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                            : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                        }`}>
                          {c.creditoStatus}
                        </span>
                      </td>
                      <td className={`py-3 px-3 font-mono ${textMuted}`}>{c.invoicesCount} Docs</td>
                      <td className={`py-3 px-3 font-mono font-bold ${textTitle}`}>{c.volumenKgLt.toLocaleString('es-PE')} KG</td>
                      <td className="py-3 px-3 font-mono font-black text-emerald-600 dark:text-emerald-400">S/ {c.totalVendidoPen.toFixed(2)}</td>
                      <td className={`py-3 px-3 font-mono font-bold text-right ${c.deudaPendientePen > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400'}`}>
                        {c.deudaPendientePen > 0 ? `S/ ${c.deudaPendientePen.toFixed(2)}` : 'S/ 0.00'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= PESTAÑA 3: PRODUCCIÓN ================= */}
      {activeTab === 'PRODUCCION' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className={`p-4 rounded-2xl border space-y-1 ${cardBg}`}>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${textMuted}`}>Tasa Promedio de Merma</span>
              <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">1.37%</p>
              <span className="text-[10px] text-slate-500">Por debajo del límite tolerado (2.0%)</span>
            </div>
            <div className={`p-4 rounded-2xl border space-y-1 ${cardBg}`}>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${textMuted}`}>Conformidad QA en Primera Prueba</span>
              <p className="text-xl font-black text-blue-600 dark:text-blue-400">96.8%</p>
              <span className="text-[10px] text-slate-500">Cumplimiento estricto de pH y viscosidad</span>
            </div>
            <div className={`p-4 rounded-2xl border space-y-1 ${cardBg}`}>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${textMuted}`}>Lotes Liberados este Mes</span>
              <p className="text-xl font-black text-purple-600 dark:text-purple-400">161 Lotes</p>
              <span className="text-[10px] text-slate-500">Producción continua en 3 reactores</span>
            </div>
          </div>

          <div className={`p-6 rounded-2xl border space-y-4 ${cardBg}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className={`text-base font-bold ${textTitle}`}>Trazabilidad de Lotes & Rendimiento en Envasado</h3>
                <p className={`text-xs ${textMuted}`}>Control de peso teórico vs real, mermas de proceso y dictamen de control de calidad.</p>
              </div>
              <button
                onClick={handleExportProduccionExcel}
                className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-amber-600/20 transition-all cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Descargar en Excel (.xlsx)</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className={`border-b text-[10px] font-bold uppercase tracking-wider ${tableHeaderBg}`}>
                    <th className="py-3 px-3">LOTE</th>
                    <th className="py-3 px-3">PRODUCTO QUÍMICO</th>
                    <th className="py-3 px-3">CLIENTE</th>
                    <th className="py-3 px-3">TEÓRICO</th>
                    <th className="py-3 px-3">REAL ENVASADO</th>
                    <th className="py-3 px-3">MERMA (KG / %)</th>
                    <th className="py-3 px-3">ESTADO QA</th>
                    <th className="py-3 px-3 text-right">OPERARIO</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? 'divide-slate-800/40' : 'divide-slate-200'}`}>
                  {rendimientoLotes.map((l, idx) => (
                    <tr key={idx} className={`transition-colors ${tableRowHover}`}>
                      <td className="py-3 px-3 font-mono font-bold text-amber-500">{l.codigoLote}</td>
                      <td className={`py-3 px-3 font-bold ${textTitle}`}>{l.producto}</td>
                      <td className={`py-3 px-3 ${textMuted}`}>{l.cliente}</td>
                      <td className={`py-3 px-3 font-mono ${textMuted}`}>{l.pesoTeoricoKg.toFixed(1)} KG</td>
                      <td className={`py-3 px-3 font-mono font-bold ${textTitle}`}>{l.pesoRealKg.toFixed(1)} KG</td>
                      <td className="py-3 px-3 font-mono text-rose-600 dark:text-rose-400 font-bold">
                        {l.mermaKg.toFixed(1)} KG ({l.mermaPorcentaje.toFixed(2)}%)
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                          l.estadoQA === 'LIBERADO'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                        }`}>
                          {l.estadoQA}
                        </span>
                      </td>
                      <td className={`py-3 px-3 text-right font-medium ${textMuted}`}>{l.operario}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= PESTAÑA 4: INVENTARIO ================= */}
      {activeTab === 'INVENTARIO' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className={`p-4 rounded-2xl border space-y-1 ${cardBg}`}>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${textMuted}`}>Valor Total del Inventario</span>
              <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">S/ 95,656.00</p>
              <span className="text-[10px] text-slate-500">Kardex valorizado contable SUNAT</span>
            </div>
            <div className={`p-4 rounded-2xl border space-y-1 ${cardBg}`}>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${textMuted}`}>Insumos en Estado Crítico</span>
              <p className="text-xl font-black text-rose-600 dark:text-rose-400">1 Insumo</p>
              <span className="text-[10px] text-rose-500 font-bold">Soda Cáustica (debajo de 800 KG)</span>
            </div>
            <div className={`p-4 rounded-2xl border space-y-1 ${cardBg}`}>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${textMuted}`}>Total SKUs en Almacén</span>
              <p className="text-xl font-black text-blue-600 dark:text-blue-400">8 Artículos</p>
              <span className="text-[10px] text-slate-500">Bases, Fragancias, Pigmentos y Envases</span>
            </div>
          </div>

          <div className={`p-6 rounded-2xl border space-y-4 ${cardBg}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className={`text-base font-bold ${textTitle}`}>Kardex Valorizado & Consumo de Materias Primas</h3>
                <p className={`text-xs ${textMuted}`}>Existencias físicas en planta, costo promedio ponderado y alertas de punto de reorden.</p>
              </div>
              <button
                onClick={handleExportInventarioExcel}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Descargar en Excel (.xlsx)</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className={`border-b text-[10px] font-bold uppercase tracking-wider ${tableHeaderBg}`}>
                    <th className="py-3 px-3">SKU</th>
                    <th className="py-3 px-3">MATERIA PRIMA / ARTÍCULO</th>
                    <th className="py-3 px-3">TIPO</th>
                    <th className="py-3 px-3">STOCK ACTUAL</th>
                    <th className="py-3 px-3">PUNTO REORDEN</th>
                    <th className="py-3 px-3">ESTADO</th>
                    <th className="py-3 px-3">COSTO UNITARIO</th>
                    <th className="py-3 px-3 text-right">VALOR TOTAL</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? 'divide-slate-800/40' : 'divide-slate-200'}`}>
                  {insumosKardex.map((item, idx) => (
                    <tr key={idx} className={`transition-colors ${tableRowHover}`}>
                      <td className="py-3 px-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">{item.sku}</td>
                      <td className={`py-3 px-3 font-bold ${textTitle}`}>{item.nombre}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.tipo === 'BASE'
                            ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                            : item.tipo === 'FRAGANCIA'
                            ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                            : item.tipo === 'PIGMENTO'
                            ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400'
                            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                        }`}>
                          {item.tipo}
                        </span>
                      </td>
                      <td className={`py-3 px-3 font-mono font-bold ${textTitle}`}>
                        {item.stockActual.toLocaleString('es-PE')} {item.unidad}
                      </td>
                      <td className={`py-3 px-3 font-mono ${textMuted}`}>
                        {item.stockMinimo.toLocaleString('es-PE')} {item.unidad}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                          item.estadoStock === 'OPTIMO'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                            : item.estadoStock === 'ALERTA'
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                            : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                        }`}>
                          {item.estadoStock}
                        </span>
                      </td>
                      <td className={`py-3 px-3 font-mono ${textMuted}`}>S/ {item.costoUnitarioPen.toFixed(2)}</td>
                      <td className="py-3 px-3 font-mono font-black text-right text-emerald-600 dark:text-emerald-400">
                        S/ {item.valorTotalPen.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
