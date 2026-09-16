'use client';

import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plus,
  RefreshCw,
  X,
  FileText,
  Calendar,
  Building2,
  Banknote,
  Percent,
  Pencil,
} from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';
import { apiFetch } from '@/lib/apiClient';
import {
  CuentaCobrarItem,
  CobranzasKpis,
} from '@/lib/cobranzasRealData';

import * as XLSX from 'xlsx';

export default function CuentasCobrarPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [cuentas, setCuentas] = useState<CuentaCobrarItem[]>([]);
  const [kpis, setKpis] = useState<CobranzasKpis>({
    totalFacturado: 0,
    totalCobrado: 0,
    saldoPendiente: 0,
    totalVencido: 0,
    totalDocumentos: 0,
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const [filtroPlazo, setFiltroPlazo] = useState<string>('TODOS');
  const [filtroEstado, setFiltroEstado] = useState<string>('PENDIENTE');

  // Inicializa el filtro de estado desde el query param ?estado=... si existe
  useEffect(() => {
    const estadoParam = new URLSearchParams(window.location.search).get('estado');
    if (estadoParam && ['PENDIENTE', 'PAGADO', 'TODOS', 'VENCIDO'].includes(estadoParam)) {
      setFiltroEstado(estadoParam);
    }
  }, []);

  // Modal de Abono
  const [modalAbonoOpen, setModalAbonoOpen] = useState<boolean>(false);
  const [cuentaSeleccionada, setCuentaSeleccionada] = useState<CuentaCobrarItem | null>(null);
  const [montoAbono, setMontoAbono] = useState<string>('');
  const [medioPago, setMedioPago] = useState<string>('Deposito en cuenta');
  const [bancoAbono, setBancoAbono] = useState<string>('Interbank');
  const [numOperacion, setNumOperacion] = useState<string>('');
  const [observaciones, setObservaciones] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Modal de Edición de Cuenta
  const [modalEditarOpen, setModalEditarOpen] = useState<boolean>(false);
  const [cuentaEditar, setCuentaEditar] = useState<CuentaCobrarItem | null>(null);
  const [editCodigoDoc, setEditCodigoDoc] = useState<string>('');
  const [editClienteNombre, setEditClienteNombre] = useState<string>('');
  const [editClienteRuc, setEditClienteRuc] = useState<string>('');
  const [editProducto, setEditProducto] = useState<string>('');
  const [editOrdenProd, setEditOrdenProd] = useState<string>('');
  const [editCondicionPago, setEditCondicionPago] = useState<string>('Contado');
  const [editDiasPlazo, setEditDiasPlazo] = useState<string>('0');
  const [editMontoTotal, setEditMontoTotal] = useState<string>('0');
  const [editSaldoPendiente, setEditSaldoPendiente] = useState<string>('0');
  const [editFechaEmision, setEditFechaEmision] = useState<string>('');
  const [editFechaVencimiento, setEditFechaVencimiento] = useState<string>('');
  const [editEstado, setEditEstado] = useState<'PAGADO' | 'PENDIENTE'>('PAGADO');
  const [editMedioPago, setEditMedioPago] = useState<string>('Deposito en cuenta');
  const [editCanalBanco, setEditCanalBanco] = useState<string>('Interbank');
  const [isSubmittingEdit, setIsSubmittingEdit] = useState<boolean>(false);

  const cardBg = isDark ? 'bg-[#0F141C] border-[#1A2232]' : 'bg-white border-slate-200 shadow-sm';
  const textTitle = isDark ? 'text-slate-400' : 'text-slate-600';
  const textValue = isDark ? 'text-white' : 'text-slate-900';
  const inputBg = isDark
    ? 'bg-[#151D2A] border-[#1A2232] text-slate-200 placeholder-slate-500'
    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400';

  const formatFecha = (f?: string) => {
    if (!f) return '-';
    const clean = f.split('T')[0];
    const parts = clean.split('-');
    if (parts.length === 3) {
      const [y, m, d] = parts;
      return `${d}/${m}/${y}`;
    }
    return f;
  };

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [resCuentas, resKpis] = await Promise.all([
        apiFetch<CuentaCobrarItem[]>('/cobranzas').catch(() => ({ data: null })),
        apiFetch<CobranzasKpis>('/cobranzas/kpis').catch(() => ({ data: null })),
      ]);

      if (resCuentas.data && Array.isArray(resCuentas.data) && resCuentas.data.length > 0) {
        setCuentas(resCuentas.data);
      }
      if (resKpis.data) {
        setKpis(resKpis.data);
      } else {
        const facturado = cuentas.reduce((acc, c) => acc + (Number(c.montoTotal) || 0), 0);
        const pendiente = cuentas.reduce((acc, c) => acc + (Number(c.saldoPendiente) || 0), 0);
        setKpis({
          totalFacturado: facturado,
          totalCobrado: facturado - pendiente,
          saldoPendiente: pendiente,
          totalVencido: 0,
          totalDocumentos: cuentas.length,
        });
      }
    } catch (err) {
      console.warn('No se pudieron cargar las cuentas por cobrar desde el backend:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const abrirModalAbono = (cuenta?: CuentaCobrarItem) => {
    if (cuenta) {
      setCuentaSeleccionada(cuenta);
      setMontoAbono(String(cuenta.saldoPendiente > 0 ? cuenta.saldoPendiente : ''));
    } else {
      const primeraPendiente = cuentas.find((c) => c.estado === 'PENDIENTE') || cuentas[0];
      setCuentaSeleccionada(primeraPendiente);
      setMontoAbono(String(primeraPendiente?.saldoPendiente || ''));
    }
    setMedioPago('Deposito en cuenta');
    setBancoAbono('Interbank');
    setNumOperacion('');
    setObservaciones('');
    setModalAbonoOpen(true);
  };

  const handleRegistrarAbono = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cuentaSeleccionada) return;

    const monto = parseFloat(montoAbono);
    if (isNaN(monto) || monto <= 0) {
      alert('Por favor ingresa un monto válido para el abono.');
      return;
    }

    if (monto > Number(cuentaSeleccionada.saldoPendiente)) {
      alert(`El monto ingresado (S/ ${monto}) supera el saldo pendiente (S/ ${cuentaSeleccionada.saldoPendiente})`);
      return;
    }

    setIsSubmitting(true);
    try {
      await apiFetch(`/cobranzas/${cuentaSeleccionada.id}/abonos`, {
        method: 'POST',
        body: JSON.stringify({
          montoAbonado: monto,
          medio: medioPago,
          banco: bancoAbono,
          numOperacion: numOperacion || undefined,
          observaciones: observaciones || undefined,
        }),
      });

      const nuevoSaldo = Math.max(0, Number(cuentaSeleccionada.saldoPendiente) - monto);
      const nuevoEstado = nuevoSaldo === 0 ? 'PAGADO' : 'PENDIENTE';

      setCuentas((prev) =>
        prev.map((c) =>
          c.id === cuentaSeleccionada.id
            ? { ...c, saldoPendiente: nuevoSaldo, estado: nuevoEstado as any }
            : c
        )
      );

      setKpis((prev) => ({
        ...prev,
        totalCobrado: prev.totalCobrado + monto,
        saldoPendiente: Math.max(0, prev.saldoPendiente - monto),
      }));

      setModalAbonoOpen(false);
      alert(`✅ Abono de S/ ${monto.toFixed(2)} registrado exitosamente para ${cuentaSeleccionada.codigoDoc}`);
      // Refrescar en segundo plano para sincronizar PostgreSQL con máxima precisión
      cargarDatos();
    } catch (err: any) {
      console.error('Error al registrar abono:', err);
      alert(`❌ Error al conectar con el servidor: ${err?.message || 'No se pudo registrar el abono'}. No se aplicó ningún cambio.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const abrirModalEditar = (cuenta: CuentaCobrarItem) => {
    setCuentaEditar(cuenta);
    setEditCodigoDoc(cuenta.codigoDoc);
    setEditClienteNombre(cuenta.clienteNombre);
    setEditClienteRuc(cuenta.clienteRuc);
    setEditProducto(cuenta.producto || '');
    setEditOrdenProd(cuenta.ordenProd || '');
    setEditCondicionPago(cuenta.condicionPago);
    setEditDiasPlazo(String(cuenta.diasPlazo ?? 0));
    setEditMontoTotal(String(cuenta.montoTotal));
    setEditSaldoPendiente(String(cuenta.saldoPendiente > 0 ? cuenta.saldoPendiente : '0'));
    setEditFechaEmision(cuenta.fechaEmision.slice(0, 10));
    setEditFechaVencimiento(cuenta.fechaVencimiento.slice(0, 10));
    setEditEstado(cuenta.estado === 'PAGADO' ? 'PAGADO' : 'PENDIENTE');
    setEditMedioPago(cuenta.medioPago || 'Deposito en cuenta');
    setEditCanalBanco(cuenta.canalBanco || 'Interbank');
    setModalEditarOpen(true);
  };

  const handleGuardarEdicion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cuentaEditar) return;

    setIsSubmittingEdit(true);
    try {
      await apiFetch(`/cobranzas/${cuentaEditar.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          codigoDoc: editCodigoDoc,
          clienteNombre: editClienteNombre,
          clienteRuc: editClienteRuc,
          ordenProd: editOrdenProd || undefined,
          producto: editProducto || undefined,
          montoTotal: parseFloat(editMontoTotal),
          saldoPendiente: parseFloat(editSaldoPendiente),
          condicionPago: editCondicionPago,
          diasPlazo: parseInt(editDiasPlazo, 10) || 0,
          estado: editEstado,
          medioPago: editEstado === 'PAGADO' ? editMedioPago || undefined : undefined,
          canalBanco: editEstado === 'PAGADO' ? editCanalBanco || undefined : undefined,
          fechaEmision: editFechaEmision,
          fechaVencimiento: editFechaVencimiento,
        }),
      });

      const monto = parseFloat(editMontoTotal);
      const saldo = editEstado === 'PAGADO' ? 0 : parseFloat(editSaldoPendiente);

      const actualizado: CuentaCobrarItem = {
        ...cuentaEditar,
        codigoDoc: editCodigoDoc,
        clienteNombre: editClienteNombre,
        clienteRuc: editClienteRuc,
        ordenProd: editOrdenProd || undefined,
        producto: editProducto || undefined,
        montoTotal: monto,
        saldoPendiente: saldo,
        condicionPago: editCondicionPago,
        diasPlazo: parseInt(editDiasPlazo, 10) || 0,
        fechaEmision: editFechaEmision,
        fechaVencimiento: editFechaVencimiento,
        estado: editEstado,
        medioPago: editEstado === 'PAGADO' ? editMedioPago || undefined : undefined,
        canalBanco: editEstado === 'PAGADO' ? editCanalBanco || undefined : undefined,
      };

      const nuevasCuentas = cuentas.map((c) => (c.id === cuentaEditar.id ? actualizado : c));
      setCuentas(nuevasCuentas);
      setKpis({
        totalFacturado: nuevasCuentas.reduce((acc, c) => acc + (Number(c.montoTotal) || 0), 0),
        totalCobrado: nuevasCuentas.reduce((acc, c) => acc + ((Number(c.montoTotal) || 0) - (Number(c.saldoPendiente) || 0)), 0),
        saldoPendiente: nuevasCuentas.reduce((acc, c) => acc + (Number(c.saldoPendiente) || 0), 0),
        totalVencido: 0,
        totalDocumentos: nuevasCuentas.length,
      });

      setModalEditarOpen(false);
      alert(`Cuenta ${editCodigoDoc} actualizada correctamente`);
    } catch (err: any) {
      console.error('Error al actualizar cuenta:', err);
      alert('Ocurrió un error al guardar los cambios. Revisa la consola.');
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  // Exportar a Excel real (.xlsx)
  const exportarExcel = () => {
    if (cuentasFiltradas.length === 0) {
      alert('No hay registros filtrados para exportar.');
      return;
    }

    const dataExport = cuentasFiltradas.map((c) => ({
      Comprobante: c.codigoDoc,
      'Fecha Emisión': c.fechaEmision,
      'Fecha Vencimiento': c.fechaVencimiento,
      Cliente: c.clienteNombre,
      RUC: c.clienteRuc,
      Producto: c.producto || 'Varios',
      'Orden Producción': c.ordenProd || 'Sin OP',
      'Condición Pago': c.condicionPago,
      'Total Facturado (PEN)': Number(c.montoTotal),
      'Saldo Pendiente (PEN)': Number(c.saldoPendiente),
      Estado: c.estado,
    }));

    const ws = XLSX.utils.json_to_sheet(dataExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Cobranzas_Quimicorp');
    XLSX.writeFile(wb, `REPORTE_COBRANZAS_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  // Filtrado de Cuentas
  const cuentasFiltradas = cuentas.filter((c) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchDoc = c.codigoDoc.toLowerCase().includes(q);
      const matchCli = c.clienteNombre.toLowerCase().includes(q);
      const matchRuc = c.clienteRuc.includes(q);
      const matchOp = (c.ordenProd || '').toLowerCase().includes(q);
      const matchProd = (c.producto || '').toLowerCase().includes(q);
      if (!matchDoc && !matchCli && !matchRuc && !matchOp && !matchProd) return false;
    }

    if (filtroPlazo !== 'TODOS') {
      if (filtroPlazo === '07') {
        if (
          !c.condicionPago.includes('07') &&
          !c.condicionPago.toLowerCase().includes('7 día') &&
          !c.condicionPago.toLowerCase().includes('7 dia')
        )
          return false;
      } else if (!c.condicionPago.toLowerCase().includes(filtroPlazo.toLowerCase())) {
        return false;
      }
    }

    if (filtroEstado !== 'TODOS') {
      if (filtroEstado === 'PENDIENTE') {
        // En cartera pendiente se muestran los pendientes y los vencidos con saldo vivo
        if (c.estado !== 'PENDIENTE' && c.estado !== 'VENCIDO') return false;
      } else if (c.estado !== filtroEstado) {
        return false;
      }
    }

    return true;
  });

  // Configuración de las 6 Tarjetas Horizontales de Condición (Estilo Kardex Neón)
  const tabsCondicion = [
    {
      id: 'TODOS',
      label: 'Todas las Condiciones',
      description: 'Totalidad de ventas al contado y carteras a crédito',
      badge: 'TOTAL CARTERA',
      count: cuentas.length,
      badgeCls: 'border-cyan-500/40 text-cyan-400 bg-cyan-500/10',
    },
    {
      id: 'Contado',
      label: 'Contado Inmediato',
      description: 'Cobro contra entrega / transferencias liquidadas',
      badge: 'CONTADO',
      count: cuentas.filter((c) => c.condicionPago.toLowerCase().includes('contado')).length,
      badgeCls: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
    },
    {
      id: '07',
      label: 'Crédito 7 Días',
      description: 'Línea de crédito semanal para clientes frecuentes',
      badge: '7 DÍAS',
      count: cuentas.filter((c) => c.condicionPago.includes('07')).length,
      badgeCls: 'border-blue-500/40 text-blue-400 bg-blue-500/10',
    },
    {
      id: '15',
      label: 'Crédito 15 Días',
      description: 'Línea quincenal con control de documentos',
      badge: '15 DÍAS',
      count: cuentas.filter((c) => c.condicionPago.includes('15')).length,
      badgeCls: 'border-amber-500/40 text-amber-400 bg-amber-500/10',
    },
    {
      id: '20',
      label: 'Crédito 20 Días',
      description: 'Plazo especial institucional y distribuidoras',
      badge: '20 DÍAS',
      count: cuentas.filter((c) => c.condicionPago.includes('20')).length,
      badgeCls: 'border-purple-500/40 text-purple-400 bg-purple-500/10',
    },
    {
      id: '30',
      label: 'Crédito 30 Días',
      description: 'Plazo comercial estándar corporativo B2B Perú',
      badge: '30 DÍAS',
      count: cuentas.filter((c) => c.condicionPago.includes('30')).length,
      badgeCls: 'border-indigo-500/40 text-indigo-400 bg-indigo-500/10',
    },
    {
      id: '60',
      label: 'Crédito 60 Días',
      description: 'Plazo extendido corporativo con aval comercial',
      badge: '60 DÍAS',
      count: cuentas.filter((c) => c.condicionPago.includes('60')).length,
      badgeCls: 'border-rose-500/40 text-rose-400 bg-rose-500/10',
    },
  ];

  return (
    <div className="space-y-5 font-sans min-h-screen pb-12">
      {/* Banner Principal con Luces Neón */}
      <div className={`p-5 rounded-2xl border flex flex-wrap items-center justify-between gap-4 transition-all shadow-sm ${cardBg}`}>
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-[#00F2C3] shadow-lg shadow-emerald-500/10">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className={`text-lg font-black tracking-tight ${textValue}`}>
                Cuentas por Cobrar & Control de Liquidez
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold font-mono tracking-wider bg-emerald-500/10 border border-emerald-500/30 text-[#00F2C3] uppercase flex items-center gap-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00F2C3] led-pulse" />
                POSTGRESQL LIVE • {cuentas.length} OPERACIONES
              </span>
            </div>
            <p className={`text-xs mt-0.5 ${textTitle}`}>
              Monitoreo ejecutivo de plazos de crédito (7, 15, 20 y 60 días), comprobantes SUNAT y depósitos bancarios.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={cargarDatos}
            disabled={loading}
            className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
              isDark ? 'border-[#1A2232] bg-[#151D2A] text-slate-300 hover:text-white hover:border-cyan-500/50' : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
            }`}
            title="Recargar datos"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>

          <button
            onClick={exportarExcel}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs tracking-wider uppercase transition-all shadow-lg shadow-emerald-500/20 active:scale-95 flex items-center gap-2"
          >
            <Banknote className="w-4 h-4" />
            <span>Exportar a Excel (.xlsx)</span>
          </button>

          <button
            onClick={() => abrirModalAbono()}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs tracking-wider uppercase transition-all shadow-lg shadow-blue-500/20 active:scale-95 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Registrar Abono</span>
          </button>
        </div>
      </div>

      {/* 7 Tarjetas Horizontales Interactivas de Condición de Pago (Estilo Kardex Neón) */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7">
        {tabsCondicion.map((tab) => {
          const isSelected = filtroPlazo === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setFiltroPlazo(tab.id)}
              className={`rounded-2xl p-4 border text-left transition-all duration-200 flex flex-col justify-between gap-2.5 group relative overflow-hidden card-hover-lift ${
                isSelected
                  ? isDark
                    ? 'bg-[#151D2A] border-[#00F2C3] shadow-lg shadow-[#00F2C3]/15 ring-1 ring-[#00F2C3]'
                    : 'bg-cyan-50/80 border-cyan-400 shadow-md ring-1 ring-cyan-400'
                  : isDark
                  ? 'bg-[#0F141C] border-[#1A2232] hover:border-slate-700 hover:bg-[#151D2A]/60'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase border ${tab.badgeCls}`}>
                  {tab.badge}
                </span>
                <span className={`text-xs font-mono font-black ${isSelected ? 'text-[#00F2C3]' : 'text-slate-400'}`}>
                  {tab.count}
                </span>
              </div>

              <div>
                <h3 className={`text-xs font-black uppercase tracking-tight ${isSelected ? 'text-[#00F2C3]' : textValue}`}>
                  {tab.label}
                </h3>
                <p className="text-[10px] text-slate-400 leading-tight mt-1 line-clamp-2">
                  {tab.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* 4 KPIs Reales Dinámicos con Resplandor Neón */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className={`rounded-2xl p-4 border space-y-1 transition-all card-hover-lift ${cardBg} ${isDark ? 'hover:border-emerald-500/50' : ''}`}>
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-bold tracking-widest uppercase ${textTitle}`}>TOTAL FACTURADO</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Banknote className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl font-black font-mono text-emerald-400">
            S/ {kpis.totalFacturado.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <span className="text-[10px] text-slate-500 font-mono">{kpis.totalDocumentos} comprobantes emitidos</span>
        </div>

        <div className={`rounded-2xl p-4 border space-y-1 transition-all card-hover-lift ${cardBg} ${isDark ? 'hover:border-blue-500/50' : ''}`}>
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-bold tracking-widest uppercase ${textTitle}`}>RECAUDADO / PAGADO</span>
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl font-black font-mono text-blue-400">
            S/ {kpis.totalCobrado.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <span className="text-[10px] text-cyan-400/80 font-mono font-bold">
            {((kpis.totalCobrado / (kpis.totalFacturado || 1)) * 100).toFixed(1)}% liquidez efectiva
          </span>
        </div>

        <div className={`rounded-2xl p-4 border space-y-1 transition-all card-hover-lift ${cardBg} ${isDark ? 'hover:border-amber-500/50' : ''}`}>
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-bold tracking-widest uppercase ${textTitle}`}>SALDO POR COBRAR</span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl font-black font-mono text-amber-400">
            S/ {kpis.saldoPendiente.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <span className="text-[10px] text-amber-500/80 font-mono font-bold">
            {cuentas.filter((c) => c.estado === 'PENDIENTE').length} facturas pendientes
          </span>
        </div>

        <div className={`rounded-2xl p-4 border space-y-1 transition-all card-hover-lift ${cardBg} ${isDark ? 'hover:border-emerald-500/50' : ''}`}>
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-bold tracking-widest uppercase ${textTitle}`}>SALUD DE CARTERA</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-[#00F2C3] border border-emerald-500/20">
              <Percent className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl font-black font-mono text-[#00F2C3]">
            {kpis.totalFacturado > 0 ? (((kpis.totalCobrado / kpis.totalFacturado) * 100).toFixed(1) + '%') : '0%'}
          </p>
          <span className="text-[10px] text-slate-500">Cartera al día (liquidez efectiva)</span>
        </div>
      </div>

      {/* Barra de Filtros por Estado y Buscador con Segmented Pills */}
      <div className={`rounded-2xl p-4 border space-y-3 shadow-sm ${cardBg}`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Segmented Controls de Estado Iluminados */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`text-[11px] font-bold mr-1 uppercase ${textTitle}`}>Bandeja:</span>
            {[
              { id: 'PENDIENTE', label: 'Cartera Pendiente (Por Cobrar)', activeColor: 'bg-[#00F2C3] text-slate-950 shadow-md shadow-[#00F2C3]/30 font-black' },
              { id: 'PAGADO', label: 'Historial Pagados (Liquidados)', activeColor: 'bg-blue-500 text-white shadow-md shadow-blue-500/30' },
              { id: 'VENCIDO', label: 'Vencidos', activeColor: 'bg-rose-500 text-white shadow-md shadow-rose-500/30' },
              { id: 'TODOS', label: 'Auditoría Completa (Todos)', activeColor: 'bg-slate-700 text-white' },
            ].map((est) => {
              const isSel = filtroEstado === est.id;
              return (
                <button
                  key={est.id}
                  onClick={() => setFiltroEstado(est.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isSel
                      ? est.activeColor
                      : isDark
                      ? 'bg-[#151D2A] text-slate-300 border border-[#1A2232] hover:text-white hover:border-slate-600'
                      : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  {est.label}
                </button>
              );
            })}
          </div>

          <span className="text-xs font-mono text-slate-400">
            Filtrado: <strong className="text-cyan-400 font-bold">S/ {cuentasFiltradas.reduce((a, c) => a + Number(c.montoTotal), 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}</strong>
          </span>
        </div>

        {/* Buscador de Alto Impacto */}
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por Cliente, RUC, Comprobante (EB01-100, E001-180), Producto o Código OP..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs font-sans focus:border-[#00F2C3] focus:outline-none transition-all ${inputBg}`}
          />
        </div>
      </div>

      {/* Tabla de Cuentas por Cobrar con Iluminación Semántica */}
      <div className={`rounded-2xl p-5 border space-y-4 shadow-sm ${cardBg}`}>
        <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-3 border-slate-800/60">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyan-400" />
            <h2 className={`text-xs font-bold uppercase tracking-wider ${textValue}`}>
              Detalle de Comprobantes & Cuentas ({cuentasFiltradas.length} de {cuentas.length} Operaciones)
            </h2>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            Sincronizado con Libro Mayor SUNAT
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className={`border-b text-[10px] uppercase font-bold tracking-widest ${
                isDark ? 'border-[#1A2232] text-slate-400' : 'border-slate-200 text-slate-700 bg-slate-50'
              }`}>
                <th className="py-3 px-3">COMPROBANTE</th>
                <th className="py-3 px-3">CLIENTE & RUC</th>
                <th className="py-3 px-3">PRODUCTO & OP</th>
                <th className="py-3 px-3">CONDICIÓN / VENCE</th>
                <th className="py-3 px-3 text-right">TOTAL</th>
                <th className="py-3 px-3 text-right">SALDO POR COBRAR</th>
                <th className="py-3 px-3 text-center">ESTADO</th>
                <th className="py-3 px-3 text-center">ACCIONES</th>
              </tr>
            </thead>
            <tbody className={`divide-y font-mono text-[11px] ${
              isDark ? 'divide-[#1A2232]/60' : 'divide-slate-100'
            }`}>
              {cuentasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400 font-sans">
                    No se encontraron cuentas por cobrar con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                cuentasFiltradas.map((c) => (
                  <tr key={c.id} className={`transition-colors ${isDark ? 'hover:bg-[#151D2A]/60' : 'hover:bg-slate-50'}`}>
                    <td className="py-3.5 px-3">
                      <span className="font-bold text-cyan-400 block">{c.codigoDoc}</span>
                      <span className="text-[10px] text-slate-500 block">{formatFecha(c.fechaEmision)}</span>
                    </td>
                    <td className="py-3.5 px-3 font-sans">
                      <span className="font-bold text-slate-200 block">{c.clienteNombre}</span>
                      <span className="text-[10px] text-slate-400 font-mono">RUC: {c.clienteRuc}</span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="text-slate-300 font-sans text-xs block truncate max-w-[200px]" title={c.producto}>
                        {c.producto || '-'}
                      </span>
                      <span className="text-[10px] text-emerald-400/80 block">{c.ordenProd || 'Sin OP'}</span>
                    </td>
                    <td className="py-3.5 px-3 font-sans">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#151D2A] text-slate-300 border border-[#1A2232] block w-max">
                        {c.condicionPago}
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">Vence: {formatFecha(c.fechaVencimiento)}</span>
                    </td>
                    <td className="py-3.5 px-3 text-right text-slate-300 font-bold">
                      S/ {Number(c.montoTotal).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-3 text-right font-black">
                      {Number(c.saldoPendiente) > 0 ? (
                        <span className="text-amber-400 font-bold">
                          S/ {Number(c.saldoPendiente).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      ) : (
                        <span className="text-emerald-400">S/ 0.00</span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase border ${
                        c.estado === 'PAGADO'
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                          : c.estado === 'VENCIDO'
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          c.estado === 'PAGADO'
                            ? 'bg-blue-400'
                            : c.estado === 'VENCIDO'
                            ? 'bg-rose-400 led-pulse'
                            : 'bg-amber-400 led-pulse'
                        }`} />
                        {c.estado === 'PAGADO' ? 'Pagado' : c.estado === 'VENCIDO' ? 'Vencido' : 'Pendiente'}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {['PENDIENTE', 'VENCIDO'].includes(c.estado) && (
                          <button
                            onClick={() => abrirModalAbono(c)}
                            className="px-3 py-1 rounded-lg bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-[#00F2C3] border border-emerald-500/30 hover:border-[#00F2C3] text-[10px] font-bold font-sans transition-all active:scale-95 shadow-sm"
                          >
                            Abonar
                          </button>
                        )}
                        <button
                          onClick={() => abrirModalEditar(c)}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/30 hover:border-blue-400 text-[10px] font-bold font-sans transition-all active:scale-95 shadow-sm"
                        >
                          <Pencil className="w-3 h-3" />
                          Editar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Registrar Pago / Abono con Backdrop Blur y Glow */}
      {modalAbonoOpen && cuentaSeleccionada && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className={`w-full max-w-lg rounded-2xl border p-6 space-y-4 shadow-2xl ${cardBg} border-emerald-500/30`}>
            <div className={`flex items-center justify-between border-b pb-3 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  <CreditCard className="w-5 h-5" />
                </div>
                <h3 className={`text-sm font-black ${textValue}`}>Registrar Pago / Abono Bancario</h3>
              </div>
              <button
                onClick={() => setModalAbonoOpen(false)}
                className={`p-1.5 rounded-lg border transition-colors ${
                  isDark ? 'border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800' : 'border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Resumen de la Factura */}
            <div className={`p-3.5 rounded-xl border space-y-1.5 text-xs ${
              isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex justify-between">
                <span className={isDark ? 'text-slate-400' : 'text-slate-600 font-semibold'}>Comprobante:</span>
                <span className="font-mono font-bold text-cyan-400">{cuentaSeleccionada.codigoDoc}</span>
              </div>
              <div className="flex justify-between">
                <span className={isDark ? 'text-slate-400' : 'text-slate-600 font-semibold'}>Cliente:</span>
                <span className={`font-bold ${textValue}`}>{cuentaSeleccionada.clienteNombre}</span>
              </div>
              <div className="flex justify-between">
                <span className={isDark ? 'text-slate-400' : 'text-slate-600 font-semibold'}>Total Comprobante:</span>
                <span className={`font-mono font-semibold ${textValue}`}>S/ {Number(cuentaSeleccionada.montoTotal).toFixed(2)}</span>
              </div>
              <div className={`flex justify-between border-t pt-1.5 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                <span className="font-bold text-amber-400">Saldo Pendiente Actual:</span>
                <span className="font-mono font-black text-amber-400">S/ {Number(cuentaSeleccionada.saldoPendiente).toFixed(2)}</span>
              </div>
            </div>

            <form onSubmit={handleRegistrarAbono} className="space-y-3.5">
              <div>
                <label className={`block text-[11px] font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Monto a Abonar (S/) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  max={Number(cuentaSeleccionada.saldoPendiente)}
                  value={montoAbono}
                  onChange={(e) => setMontoAbono(e.target.value)}
                  required
                  placeholder="0.00"
                  className={`w-full px-3 py-2 rounded-xl border text-xs font-mono font-bold ${inputBg} focus:border-[#00F2C3] focus:outline-none`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-[11px] font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Medio de Pago</label>
                  <select
                    value={medioPago}
                    onChange={(e) => setMedioPago(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl border text-xs ${inputBg}`}
                  >
                    <option value="Deposito en cuenta">Depósito en cuenta</option>
                    <option value="Transferencia Interbancaria">Transferencia CCI</option>
                    <option value="Yape / Plin">Yape / Plin</option>
                    <option value="Efectivo en caja">Efectivo en caja</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-[11px] font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Banco Destino</label>
                  <select
                    value={bancoAbono}
                    onChange={(e) => setBancoAbono(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl border text-xs ${inputBg}`}
                  >
                    <option value="Interbank">Interbank Cta Cte</option>
                    <option value="BCP">BCP Cta Cte</option>
                    <option value="BBVA">BBVA</option>
                    <option value="Caja">Caja Chica</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={`block text-[11px] font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  N° Operación / Referencia Bancaria
                </label>
                <input
                  type="text"
                  value={numOperacion}
                  onChange={(e) => setNumOperacion(e.target.value)}
                  placeholder="Ej: OP-84920412"
                  className={`w-full px-3 py-2 rounded-xl border text-xs font-mono ${inputBg} focus:border-[#00F2C3] focus:outline-none`}
                />
              </div>

              <div>
                <label className={`block text-[11px] font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Observaciones</label>
                <input
                  type="text"
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  placeholder="Abono parcial de factura..."
                  className={`w-full px-3 py-2 rounded-xl border text-xs ${inputBg} focus:border-[#00F2C3] focus:outline-none`}
                />
              </div>

              <div className={`flex justify-end gap-2.5 pt-3 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                <button
                  type="button"
                  onClick={() => setModalAbonoOpen(false)}
                  className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all ${
                    isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
                >
                  {isSubmitting ? 'Registrando...' : 'Confirmar Abono'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Editar Cuenta por Cobrar */}
      {modalEditarOpen && cuentaEditar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className={`w-full max-w-2xl rounded-2xl border p-6 space-y-4 shadow-2xl ${cardBg} border-blue-500/30`}>
            <div className={`flex items-center justify-between border-b pb-3 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/30">
                  <Pencil className="w-5 h-5" />
                </div>
                <h3 className={`text-sm font-black ${textValue}`}>Editar Cuenta por Cobrar</h3>
              </div>
              <button
                onClick={() => setModalEditarOpen(false)}
                className={`p-1.5 rounded-lg border transition-colors ${
                  isDark ? 'border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800' : 'border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleGuardarEdicion} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-[11px] font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Comprobante *
                  </label>
                  <input
                    type="text"
                    value={editCodigoDoc}
                    onChange={(e) => setEditCodigoDoc(e.target.value)}
                    required
                    className={`w-full px-3 py-2 rounded-xl border text-xs font-mono font-bold ${inputBg} focus:border-blue-400 focus:outline-none`}
                  />
                </div>
                <div>
                  <label className={`block text-[11px] font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Estado</label>
                  <select
                    value={editEstado}
                    onChange={(e) => setEditEstado(e.target.value as 'PAGADO' | 'PENDIENTE')}
                    className={`w-full px-3 py-2 rounded-xl border text-xs ${inputBg}`}
                  >
                    <option value="PENDIENTE">PENDIENTE (Por cobrar)</option>
                    <option value="PAGADO">PAGADO (Liquidado)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-[11px] font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Cliente *
                  </label>
                  <input
                    type="text"
                    value={editClienteNombre}
                    onChange={(e) => setEditClienteNombre(e.target.value)}
                    required
                    className={`w-full px-3 py-2 rounded-xl border text-xs ${inputBg} focus:border-blue-400 focus:outline-none`}
                  />
                </div>
                <div>
                  <label className={`block text-[11px] font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>RUC / DNI</label>
                  <input
                    type="text"
                    value={editClienteRuc}
                    onChange={(e) => setEditClienteRuc(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl border text-xs font-mono ${inputBg} focus:border-blue-400 focus:outline-none`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-[11px] font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Producto</label>
                  <input
                    type="text"
                    value={editProducto}
                    onChange={(e) => setEditProducto(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl border text-xs ${inputBg} focus:border-blue-400 focus:outline-none`}
                  />
                </div>
                <div>
                  <label className={`block text-[11px] font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Orden Producción</label>
                  <input
                    type="text"
                    value={editOrdenProd}
                    onChange={(e) => setEditOrdenProd(e.target.value)}
                    placeholder="OP-2026..."
                    className={`w-full px-3 py-2 rounded-xl border text-xs font-mono ${inputBg} focus:border-blue-400 focus:outline-none`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-[11px] font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Condición de Pago</label>
                  <select
                    value={editCondicionPago}
                    onChange={(e) => setEditCondicionPago(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl border text-xs ${inputBg}`}
                  >
                    <option value="Contado">Contado</option>
                    <option value="Credito 07 dias">Crédito 07 días</option>
                    <option value="Credito 15 dias">Crédito 15 días</option>
                    <option value="Credito 20 dias">Crédito 20 días</option>
                    <option value="Credito 30 dias">Crédito 30 días</option>
                    <option value="Credito 60 dias">Crédito 60 días</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-[11px] font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Días de Plazo</label>
                  <input
                    type="number"
                    min={0}
                    value={editDiasPlazo}
                    onChange={(e) => setEditDiasPlazo(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl border text-xs font-mono ${inputBg} focus:border-blue-400 focus:outline-none`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-[11px] font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Total Comprobante (S/) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={editMontoTotal}
                    onChange={(e) => setEditMontoTotal(e.target.value)}
                    required
                    className={`w-full px-3 py-2 rounded-xl border text-xs font-mono font-bold ${inputBg} focus:border-blue-400 focus:outline-none`}
                  />
                </div>
                <div>
                  <label className={`block text-[11px] font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Saldo Pendiente (S/) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max={parseFloat(editMontoTotal) || 0}
                    value={editSaldoPendiente}
                    onChange={(e) => setEditSaldoPendiente(e.target.value)}
                    required
                    disabled={editEstado === 'PAGADO'}
                    className={`w-full px-3 py-2 rounded-xl border text-xs font-mono font-bold ${inputBg} focus:border-blue-400 focus:outline-none disabled:opacity-50`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-[11px] font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Fecha Emisión</label>
                  <input
                    type="date"
                    value={editFechaEmision}
                    onChange={(e) => setEditFechaEmision(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl border text-xs ${inputBg} focus:border-blue-400 focus:outline-none`}
                  />
                </div>
                <div>
                  <label className={`block text-[11px] font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Fecha Vencimiento</label>
                  <input
                    type="date"
                    value={editFechaVencimiento}
                    onChange={(e) => setEditFechaVencimiento(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl border text-xs ${inputBg} focus:border-blue-400 focus:outline-none`}
                  />
                </div>
              </div>

              {editEstado === 'PAGADO' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={`block text-[11px] font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Medio de Pago</label>
                    <select
                      value={editMedioPago}
                      onChange={(e) => setEditMedioPago(e.target.value)}
                      className={`w-full px-3 py-2 rounded-xl border text-xs ${inputBg}`}
                    >
                      <option value="Deposito en cuenta">Depósito en cuenta</option>
                      <option value="Transferencia Interbancaria">Transferencia CCI</option>
                      <option value="Yape / Plin">Yape / Plin</option>
                      <option value="Efectivo en caja">Efectivo en caja</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block text-[11px] font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Banco</label>
                    <select
                      value={editCanalBanco}
                      onChange={(e) => setEditCanalBanco(e.target.value)}
                      className={`w-full px-3 py-2 rounded-xl border text-xs ${inputBg}`}
                    >
                      <option value="Interbank">Interbank Cta Cte</option>
                      <option value="BCP">BCP Cta Cte</option>
                      <option value="BBVA">BBVA</option>
                      <option value="Caja">Caja Chica</option>
                    </select>
                  </div>
                </div>
              )}

              <div className={`flex justify-end gap-2.5 pt-3 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                <button
                  type="button"
                  onClick={() => setModalEditarOpen(false)}
                  className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all ${
                    isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingEdit}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-400 hover:to-indigo-400 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
                >
                  {isSubmittingEdit ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

