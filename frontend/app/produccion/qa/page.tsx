'use client';
import { stockUnit } from '@/lib/stockUnits';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users,
  UserPlus,
  Beaker,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Building2,
  Check,
  X,
  FlaskConical,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Calendar,
  Sparkles,
  Printer,
  ArrowRight,
  FileText,
  RefreshCw,
} from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';
import { apiFetch, getAuthToken } from '@/lib/apiClient';
import { useSocket } from '@/lib/socketContext';
import { DateNavigatorToolbar } from '@/components/produccion/DateNavigatorToolbar';

export type PasoProcesoType =
  | 'PENDIENTE_ASIGNACION'
  | 'ELABORANDO'
  | 'EN_MUESTREO_QA'
  | 'LIBERADO_QA'
  | 'DESPACHADO'
  | 'RECHAZADO';

export interface RecetaItemUI {
  insumoId?: string;
  sku: string;
  componente: string;
  tipo?: 'BASE' | 'FRAGANCIA' | 'PIGMENTO' | 'ENVASE' | 'OTRO';
  porcentaje: number;
  pesoTeorico: number;
  gramosCalculados: number;
  stockReal?: number;
  suficiente?: boolean;
  esAditivo?: boolean;
}

interface LoteQAUI {
  id: string;
  codigoQA: string;
  nombreProducto: string;
  codigoLote: string;
  clienteNombre: string;
  rendimiento: string;
  mermaPercentage: string;
  operarios: string[];
  fechaEnvio: string;
  pasoProceso: PasoProcesoType;
  estado: 'PENDIENTE' | 'APROBADO' | 'RECHAZADO';
  observacionesQA?: string;
  motivoRechazo?: string;
  formula: RecetaItemUI[];
}

const QUICK_INCIDENTS = [
  'Variación pH fuera de rango (pH > 7.5)',
  'Ajuste Viscosidad requerido (LESS 70%)',
  'Falta Envase Bidn PEAD 5 Galones',
  'Insumo Defectuoso o impuro en mezcla',
];

export default function ProduccionQAPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const { socket } = useSocket();
  const isDark = theme === 'dark';

  // 1. Todos los estados declarados al inicio del componente
  const [subTab, setSubTab] = useState<'EN_VIVO' | 'PROGRAMACION_DIARIA'>('EN_VIVO');
  const [fechaFiltro, setFechaFiltro] = useState<string>(new Date().toISOString().split('T')[0]);
  const [busquedaQuery, setBusquedaQuery] = useState<string>('');
  const [selectedLoteId, setSelectedLoteId] = useState<string | null>(null);
  const [expandedLoteIds, setExpandedLoteIds] = useState<string[]>([]);
  const [observacionInput, setObservacionInput] = useState<string>('');
  const [motivoRechazoInput, setMotivoRechazoInput] = useState<string>('');
  const [showRechazoModal, setShowRechazoModal] = useState<boolean>(false);
  const [showLiberacionModal, setShowLiberacionModal] = useState<boolean>(false);
  const [liberadoInfo, setLiberadoInfo] = useState<{
    codigoLote: string;
    nombreProducto: string;
    clienteNombre: string;
    rendimiento: string;
  } | null>(null);
  const [lotes, setLotes] = useState<LoteQAUI[]>([]);
  const [showRecetaModal, setShowRecetaModal] = useState<boolean>(false);
  const [recetaData, setRecetaData] = useState<any>(null);
  const [loadingReceta, setLoadingReceta] = useState<boolean>(false);

  const [programacionData, setProgramacionData] = useState<{
    fecha: string;
    resumen: {
      totalOrdenes: number;
      totalKgProgramados: string;
      totalTerminados: number;
      totalEnProceso: number;
      totalPendientes: number;
    };
    ordenes: Array<{
      id: string;
      codigoLote: string;
      clienteNombre: string;
      productoNombre: string;
      colorEspecificado: string;
      fraganciaEspecificada: string;
      cantidad: number;
      unidadMedida: string;
      estado: 'TERMINADO' | 'EN PROCESO' | 'PENDIENTE';
      operarios: string;
      prioridad: string;
      fechaCreacion: string;
      fechaCierre?: string;
    }>;
  }>({
    fecha: new Date().toISOString().split('T')[0],
    resumen: { totalOrdenes: 0, totalKgProgramados: '0.00', totalTerminados: 0, totalEnProceso: 0, totalPendientes: 0 },
    ordenes: [],
  });

  // 2. Funciones auxiliares — fuente de verdad es la BD (API), nunca localStorage
  const armarProgramacionFallback = (_listaLotes: LoteQAUI[]) => {
    // No-op: la programación diaria se carga exclusivamente desde /produccion/ordenes/programacion-diaria
  };

  const cargarProgramacionDiaria = async (fecha: string) => {
    try {
      const res = await apiFetch<any>(`/produccion/ordenes/programacion-diaria?fecha=${fecha}`);
      if (res && res.data && res.data.ordenes) {
        const data = res.data;
        const ordenesSincronizadas = data.ordenes.map((o: any) => ({
          ...o,
          estado: (o.estado || 'PENDIENTE') as 'TERMINADO' | 'EN PROCESO' | 'PENDIENTE',
          operarios: o.operarios && o.operarios !== 'Sin Asignar' ? o.operarios : 'Sin Asignar',
        }));

        const terminados = ordenesSincronizadas.filter((o: any) => o.estado === 'TERMINADO').length;
        const enProceso = ordenesSincronizadas.filter((o: any) => o.estado === 'EN PROCESO').length;
        const pendientes = ordenesSincronizadas.filter((o: any) => o.estado === 'PENDIENTE').length;

        setProgramacionData({
          fecha: data.fecha || fecha,
          resumen: {
            totalOrdenes: ordenesSincronizadas.length,
            totalKgProgramados: data.resumen?.totalKgProgramados || '0.00',
            totalTerminados: terminados,
            totalEnProceso: enProceso,
            totalPendientes: pendientes,
          },
          ordenes: ordenesSincronizadas,
        });
      } else {
        armarProgramacionFallback(lotes);
      }
    } catch (err) {
      console.log('Error fetching programacion diaria:', err);
      armarProgramacionFallback(lotes);
    }
  };

  useEffect(() => {
    cargarProgramacionDiaria(fechaFiltro);
    syncLotesDinamicos(fechaFiltro);
  }, [subTab, fechaFiltro]);


  // Limpia solo el estado en memoria (la BD es la fuente de verdad)
  const handleLimpiarLotesPrueba = () => {
    setLotes([]);
    setSelectedLoteId(null);
  };

  // Sincronizacin en Tiempo Real de Lotes Aprobados desde Pedidos Entrantes de Administracin
  const syncLotesDinamicos = async (fechaParam?: string) => {
    try {
      const fechaQuery = fechaParam || fechaFiltro;
      let lotesFromApi: LoteQAUI[] = [];
      const res = await apiFetch<any[]>(`/produccion/ordenes?fecha=${fechaQuery}`);
      if (res && res.data && Array.isArray(res.data)) {
        const data = res.data;
        if (data.length > 0) {
          lotesFromApi = data.map((o: any) => {
            const cantidadKg = Number(o.cantidadPlanificadaKg ?? o.cantidadPlanificada);
            let formulaItems: RecetaItemUI[] = [];

            if (o.formula?.detalles && Array.isArray(o.formula.detalles)) {
              formulaItems = o.formula.detalles.map((d: any) => {
                const pct = Number(d.porcentaje || 10);
                const gramos = cantidadKg * 1000 * (pct / 100);
                const stockGramos = Number(d.insumo?.stockReal || 0);
                return {
                  insumoId: d.insumoId,
                  sku: d.insumo?.codigo || 'INS',
                  componente: d.insumo?.nombre || 'Insumo Base',
                  tipo: (d.insumo?.tipo as any) || 'BASE',
                  porcentaje: pct,
                  pesoTeorico: Math.round((gramos / 1000) * 100) / 100,
                  gramosCalculados: Math.round(gramos * 100) / 100,
                  stockReal: stockGramos,
                  suficiente: stockUnit(d.insumo?.unidadMedida || 'GR') === 'GR' && stockGramos >= gramos,
                  esAditivo: false,
                };
              });
            }

            // Aadir Fragancia y Color si vienen especificados
            if (o.fraganciaEspecificada && o.fraganciaEspecificada !== 'SIN FRAGANCIA') {
              const pct = 1.0;
              const gramos = cantidadKg * 1000 * (pct / 100);
              formulaItems.push({
                sku: 'AD-FRAG',
                componente: o.fraganciaEspecificada,
                tipo: 'FRAGANCIA',
                porcentaje: pct,
                pesoTeorico: Math.round((gramos / 1000) * 100) / 100,
                gramosCalculados: Math.round(gramos * 100) / 100,
                stockReal: 0,
                suficiente: false,
                esAditivo: true,
              });
            }

            if (o.colorEspecificado && o.colorEspecificado !== 'TRANSPARENTE') {
              const pct = 0.5;
              const gramos = cantidadKg * 1000 * (pct / 100);
              formulaItems.push({
                sku: 'AD-PIGM',
                componente: o.colorEspecificado,
                tipo: 'PIGMENTO',
                porcentaje: pct,
                pesoTeorico: Math.round((gramos / 1000) * 100) / 100,
                gramosCalculados: Math.round(gramos * 100) / 100,
                stockReal: 0,
                suficiente: false,
                esAditivo: true,
              });
            }

            // Sin fallback dummy: si la fórmula no trae detalles, se muestra vacío y se alerta (consistencia para cualquier cantidad X)
            if (formulaItems.length === 0) {
              console.warn(`Lote ${o.codigoLote}: fórmula ${o.formula?.codigoFormula || o.formulaId} sin detalles en BD`);
            }
            return {
              id: o.id,
              codigoQA: `QA-${(o.codigoLote || '').replace(/\D/g, '') || '0841'}`,
              nombreProducto: o.formula?.nombreProducto || o.clienteNombre || 'Fórmula Industrial',
              codigoLote: o.codigoLote,
              clienteNombre: o.clienteNombre || 'Cliente Quimicorp SAC',
              rendimiento: `${cantidadKg.toLocaleString()} KG`,
              mermaPercentage: o.mermaCalculada
                ? `${(Number(o.mermaCalculada) / (cantidadKg || 1)) * 100}%`
                : '—',
              operarios: o.operariosAsignados ? o.operariosAsignados.split(', ').filter(Boolean) : [],
              fechaEnvio: 'Hoy, ' + new Date(o.createdAt || Date.now()).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
              pasoProceso: (o.pasoProceso as PasoProcesoType) || 'PENDIENTE_ASIGNACION',
              estado: o.estado === 'APROBADO' ? 'APROBADO' : o.estado === 'RECHAZADO' ? 'RECHAZADO' : 'PENDIENTE',
              observacionesQA: o.observacionesQA || 'Lote en monitoreo de reactores.',
              formula: formulaItems,
            };
          });
        }
      }

      const combinados = lotesFromApi;
      const mapa = new Map<string, LoteQAUI>();
      combinados.forEach((l) => {
        if (!mapa.has(l.codigoLote)) {
          mapa.set(l.codigoLote, l);
        }
      });
      const unicos = Array.from(mapa.values());
      const activos = unicos.filter(
        (l) => l.pasoProceso !== 'LIBERADO_QA' && l.pasoProceso !== 'DESPACHADO'
      );
      setLotes(activos);
      if (activos.length > 0) {
        setSelectedLoteId((curr) => (activos.some((a) => a.id === curr) ? curr : activos[0].id));
        setObservacionInput((curr) => curr || activos[0].observacionesQA || '');
      } else {
        setSelectedLoteId(null);
      }
    } catch (err) {
      console.log('Error syncing lotes:', err);
    }
  };

  // Sincronización en tiempo real vía SocketProvider centralizado (única conexión)
  useEffect(() => {
    if (!socket) return;
    const onAccepted = () => {
      syncLotesDinamicos(fechaFiltro);
      cargarProgramacionDiaria(fechaFiltro);
    };
    const onUpdated = () => {
      syncLotesDinamicos(fechaFiltro);
      cargarProgramacionDiaria(fechaFiltro);
    };
    socket.on('order:accepted_by_plant', onAccepted);
    socket.on('order:status_updated', onUpdated);
    socket.on('lote:estado_actualizado', onUpdated);
    return () => {
      socket.off('order:accepted_by_plant', onAccepted);
      socket.off('order:status_updated', onUpdated);
      socket.off('lote:estado_actualizado', onUpdated);
    };
  }, [socket, fechaFiltro]);

  const [operariosDisponibles, setOperariosDisponibles] = useState<string[]>([]);

  useEffect(() => {
    let activo = true;
    (async () => {
      try {
        const res = await apiFetch<{ id: string; nombre: string }[]>('/produccion/operarios');
        if (activo && res.data && Array.isArray(res.data)) {
          setOperariosDisponibles(res.data.map((o) => o.nombre).filter(Boolean));
        }
      } catch {
        // Sin catálogo de operarios en BD: se deja vacío hasta configurar el personal de planta.
      }
    })();
    return () => {
      activo = false;
    };
  }, []);

  const selectedLote = lotes.find((l) => l.id === selectedLoteId) || null;

  // Global Theme Color Tokens
  const cardBg = isDark ? 'bg-[#0F141C] border-[#1A2232]' : 'bg-white border-slate-200 shadow-sm';
  const textTitle = isDark ? 'text-slate-400' : 'text-slate-600';
  const textValue = isDark ? 'text-white' : 'text-slate-900';
  const subBoxBg = isDark ? 'bg-[#151D2A] border-[#1A2232]' : 'bg-slate-50 border-slate-200';
  const inputBg = isDark
    ? 'bg-[#151D2A] border-[#1A2232] text-slate-200 placeholder-slate-500'
    : 'bg-white border-slate-300 text-slate-800 placeholder-slate-400';

  const badgeCyan = isDark
    ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
    : 'bg-teal-50 text-teal-800 border-teal-300 font-bold';

  const badgeAmber = isDark
    ? 'bg-amber-500/20 text-amber-200 border-amber-500/40'
    : 'bg-amber-100 text-amber-900 border-amber-300 font-bold';

  // Toggle operarios
  const handleToggleOperario = async (operario: string) => {
    if (!selectedLote) return;
    const exists = selectedLote.operarios.includes(operario);
    const newOperarios = exists
      ? selectedLote.operarios.filter((o) => o !== operario)
      : [...selectedLote.operarios, operario];

    const newPaso: PasoProcesoType =
      newOperarios.length === 0
        ? 'PENDIENTE_ASIGNACION'
        : selectedLote.pasoProceso === 'PENDIENTE_ASIGNACION'
        ? 'ELABORANDO'
        : selectedLote.pasoProceso;

    const updated = lotes.map((l) =>
      l.id === selectedLote.id ? { ...l, operarios: newOperarios, pasoProceso: newPaso } : l
    );
    setLotes(updated);

    const operariosStr = newOperarios.length > 0 ? newOperarios.join(', ') : 'Sin Asignar';
    setProgramacionData((prev) => ({
      ...prev,
      ordenes: prev.ordenes.map((ord) =>
        ord.id === selectedLote.id || ord.codigoLote === selectedLote.codigoLote
          ? { ...ord, operarios: operariosStr }
          : ord
      ),
    }));

    try {
      await apiFetch('/produccion/ordenes/operarios', {
        method: 'PATCH',
        body: JSON.stringify({ ordenProduccionId: selectedLote.id, operarios: newOperarios }),
      });
    } catch (e) {
      alert('Error al guardar la asignación de operarios en el servidor. Los cambios se mantienen localmente.');
    }
  };

  // Change Paso Proceso
  const handleCambiarPaso = async (nuevoPaso: PasoProcesoType) => {
    if (!selectedLote) return;

    if ((nuevoPaso === 'ELABORANDO' || nuevoPaso === 'EN_MUESTREO_QA') && selectedLote.operarios.length === 0) {
      alert('⚠️ Asigna al menos un operario para habilitar la fabricación.');
      return;
    }

    const updated = lotes.map((l) =>
      l.id === selectedLote.id ? { ...l, pasoProceso: nuevoPaso } : l
    );
    setLotes(updated);

    try {
      await apiFetch('/produccion/ordenes/paso', {
        method: 'PATCH',
        body: JSON.stringify({
          ordenProduccionId: selectedLote.id,
          pasoProceso: nuevoPaso,
          observacionesQA: observacionInput,
        }),
      });
    } catch (e) {
      alert('Error al guardar el cambio de paso en el servidor. Los cambios se mantienen localmente.');
    }
  };

  // Abrir modal de Fórmula + Pasos en tiempo real (desde Gerencia) vía GET /produccion/ordenes/:id/receta
  const handleVerRecetaCompleta = async () => {
    if (!selectedLote) return;
    setLoadingReceta(true);
    setShowRecetaModal(true);
    try {
      const { data, ok } = await apiFetch<any>(`/produccion/ordenes/${selectedLote.id}/receta`);
      if (ok && data) setRecetaData(data);
      else setRecetaData(null);
    } catch {
      setRecetaData(null);
    } finally {
      setLoadingReceta(false);
    }
  };

  const handleVerRecetaCompletaForLote = async (loteId: string) => {
    const target = lotes.find((l) => l.id === loteId) || selectedLote;
    if (!target) return;
    setSelectedLoteId(target.id);
    setLoadingReceta(true);
    setShowRecetaModal(true);
    try {
      const { data, ok } = await apiFetch<any>(`/produccion/ordenes/${target.id}/receta`);
      if (ok && data) setRecetaData(data);
      else setRecetaData(null);
    } catch {
      setRecetaData(null);
    } finally {
      setLoadingReceta(false);
    }
  };

  // Add Quick Incident Chip text into observations textarea
  const handleAddIncidentChip = (chipText: string) => {
    setObservacionInput((prev) => (prev ? `${prev} | ${chipText}` : chipText));
  };

  // Finalize & Liberate Lote QA (Transaction to Kardex & Etiquetas)
  const handleFinalizarYLiberar = async () => {
    if (!selectedLote) return;

    if (selectedLote.operarios.length === 0) {
      alert('⚠️ Asigna al menos un operario para habilitar la fabricación y liberación.');
      return;
    }

    try {
      await apiFetch('/produccion/qa/aprobar', {
        method: 'PATCH',
        body: JSON.stringify({
          ordenProduccionId: selectedLote.id,
          observacionesQA: observacionInput,
        }),
      });
    } catch (e) {
      alert('Error al enviar la liberación QA al servidor. Verifique la conexión con Planta.');
    }


    // El backend ya persiste Kardex y Cola de Etiquetas transaccionalmente en aprobarLote;
    // la UI solo actualiza su estado local y deja que el socket sincronice el resto.

    const remainingLotes = lotes.filter((l) => l.id !== selectedLote.id);
    setLotes(remainingLotes);
    setSelectedLoteId(remainingLotes.length > 0 ? remainingLotes[0].id : null);

    // 4. Actualizar Programacin & Control Diario inmediatamente
    setProgramacionData((prev) => {
      const nuevasOrdenes = prev.ordenes.map((o) =>
        o.id === selectedLote.id || o.codigoLote === selectedLote.codigoLote
          ? { ...o, estado: 'TERMINADO' as const }
          : o
      );
      return {
        ...prev,
        resumen: {
          ...prev.resumen,
          totalTerminados: nuevasOrdenes.filter((o) => o.estado === 'TERMINADO').length,
          totalEnProceso: nuevasOrdenes.filter((o) => o.estado === 'EN PROCESO').length,
          totalPendientes: nuevasOrdenes.filter((o) => o.estado === 'PENDIENTE').length,
        },
        ordenes: nuevasOrdenes,
      };
    });

    // 5. Abrir Modal de Confirmación y Acceso Directo a Etiquetas
    setLiberadoInfo({
      codigoLote: selectedLote.codigoLote,
      nombreProducto: selectedLote.nombreProducto,
      clienteNombre: selectedLote.clienteNombre,
      rendimiento: selectedLote.rendimiento,
    });
    setShowLiberacionModal(true);
  };

  // Reject Lote
  const handleConfirmarRechazo = async () => {
    if (!selectedLote) return;
    if (!motivoRechazoInput.trim()) {
      alert('El motivo de rechazo es obligatorio para detener el lote.');
      return;
    }

    try {
      await apiFetch('/produccion/qa/rechazar', {
        method: 'PATCH',
        body: JSON.stringify({
          ordenProduccionId: selectedLote.id,
          observacionesQA: motivoRechazoInput,
        }),
      });
    } catch (e) {
      alert('Error al enviar el rechazo al servidor. Verifique la conexión.');
    }

    setLotes((prev) =>
      prev.map((l) =>
        l.id === selectedLote.id
          ? {
              ...l,
              estado: 'RECHAZADO',
              pasoProceso: 'RECHAZADO',
              motivoRechazo: motivoRechazoInput,
            }
          : l
      )
    );

    setShowRechazoModal(false);
    setMotivoRechazoInput('');
    alert(`⚠️ Lote ${selectedLote.codigoLote} RECHAZADO. Notificación enviada a Administración.`);

  };

  const toggleFormulaDropdown = (loteId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedLoteIds((prev) =>
      prev.includes(loteId) ? prev.filter((id) => id !== loteId) : [...prev, loteId]
    );
  };

  // Helper for Stepper index
  const getPasoStepIndex = (paso: PasoProcesoType): number => {
    switch (paso) {
      case 'PENDIENTE_ASIGNACION':
        return 1;
      case 'ELABORANDO':
        return 2;
      case 'EN_MUESTREO_QA':
        return 3;
      case 'LIBERADO_QA':
        return 4;
      case 'DESPACHADO':
        return 4;
      case 'RECHAZADO':
        return 0;
      default:
        return 1;
    }
  };

  const handleExportarReporte = () => {
    const windowPrint = window.open('', '', 'width=950,height=750');
    if (!windowPrint) return;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>PROGRAMACIN DIARIA DE PRODUCCIN - QUIMICORP PERU S.A.C.</title>
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 25px; color: #0f172a; }
            .header-banner { text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 20px; }
            .company-name { font-size: 22px; font-weight: 900; letter-spacing: 1px; }
            .sub-title { font-size: 14px; font-weight: 700; color: #475569; margin-top: 4px; }
            .meta-bar { display: flex; justify-content: space-between; font-size: 12px; font-weight: bold; background: #f8fafc; padding: 10px 15px; border-radius: 6px; border: 1px solid #e2e8f0; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 12px; }
            th, td { border: 1px solid #cbd5e1; padding: 9px 12px; text-align: left; }
            th { background-color: #f1f5f9; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px; }
            .status-badge { padding: 4px 8px; border-radius: 4px; font-weight: bold; font-size: 10px; display: inline-block; }
            .badge-terminado { background: #dcfce7; color: #15803d; border: 1px solid #86efac; }
            .badge-proceso { background: #dbeafe; color: #1d4ed8; border: 1px solid #93c5fd; }
            .badge-pendiente { background: #f1f5f9; color: #64748b; border: 1px solid #cbd5e1; }
            .summary-card { margin-top: 25px; border: 1px solid #cbd5e1; padding: 15px; background: #f8fafc; border-radius: 8px; font-size: 12px; }
            .summary-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; text-align: center; margin-top: 10px; }
            .summary-item { background: white; padding: 10px; border-radius: 6px; border: 1px solid #e2e8f0; }
            .summary-val { font-size: 16px; font-weight: 900; margin-top: 4px; }
          </style>
        </head>
        <body>
          <div class="header-banner">
            <div class="company-name">QUIMICORP PERU S.A.C.</div>
            <div class="sub-title">PROGRAMACIN DIARIA DE PRODUCCIN • HOJA OFICIAL DE PLANTA</div>
          </div>
          <div class="meta-bar">
            <span>RUC: 20612434124</span>
            <span>FECHA DEL TURNO: ${fechaFiltro}</span>
            <span>ORDENES EMITIDAS: ${programacionData.resumen.totalOrdenes}</span>
          </div>
          <table>
            <thead>
              <tr>
                <th>N ORD. PROD.</th>
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
              ${programacionData.ordenes.map(o => `
                <tr>
                  <td><strong>${o.codigoLote}</strong></td>
                  <td>${o.clienteNombre}</td>
                  <td>${o.productoNombre}</td>
                  <td>${o.colorEspecificado}</td>
                  <td>${o.fraganciaEspecificada}</td>
                  <td><strong>${o.cantidad} ${o.unidadMedida}</strong></td>
                  <td>
                    <span class="status-badge ${o.estado === 'TERMINADO' ? 'badge-terminado' : o.estado === 'EN PROCESO' ? 'badge-proceso' : 'badge-pendiente'}">
                      ${o.estado}
                    </span>
                  </td>
                  <td>${o.operarios}</td>
                  <td>${o.prioridad}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="summary-card">
            <strong>RESUMEN OPERATIVO DEL DA</strong>
            <div class="summary-grid">
              <div class="summary-item">
                <div style="font-size: 10px; color: #64748b;">TOTAL RDENES</div>
                <div class="summary-val">${programacionData.resumen.totalOrdenes}</div>
              </div>
              <div class="summary-item">
                <div style="font-size: 10px; color: #64748b;">TOTAL KG/LT</div>
                <div class="summary-val">${programacionData.resumen.totalKgProgramados}</div>
              </div>
              <div class="summary-item">
                <div style="font-size: 10px; color: #166534;">TERMINADOS</div>
                <div class="summary-val" style="color: #166534;">${programacionData.resumen.totalTerminados}</div>
              </div>
              <div class="summary-item">
                <div style="font-size: 10px; color: #1e40af;">EN PROCESO</div>
                <div class="summary-val" style="color: #1e40af;">${programacionData.resumen.totalEnProceso}</div>
              </div>
              <div class="summary-item">
                <div style="font-size: 10px; color: #475569;">PENDIENTES</div>
                <div class="summary-val">${programacionData.resumen.totalPendientes}</div>
              </div>
            </div>
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `;

    windowPrint.document.write(html);
    windowPrint.document.close();
  };

  return (
    <div className="space-y-6 font-mono min-h-screen">
      {/* Header Titular con Sub-Pestaas a la Derecha */}
      <div className={`flex flex-wrap items-center justify-between gap-4 border-b pb-4 ${isDark ? 'border-slate-800/80' : 'border-slate-200'}`}>
        <div>
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-xl border ${isDark ? 'bg-cyan-500/10 border-cyan-500/30 text-[#00F2C3]' : 'bg-teal-50 border-teal-300 text-teal-700'}`}>
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <h2 className={`text-lg font-bold font-sans flex items-center gap-2 ${textValue}`}>
                <span>Control de Producción & QA</span>
                <span className={`text-[10px] px-2 py-0.5 rounded border font-mono uppercase font-bold ${badgeCyan}`}>
                  WORKFLOW EN TIEMPO REAL
                </span>
              </h2>
              <p className={`text-xs font-sans ${textTitle}`}>
                Monitoreo operativo de reactores, asignación de operarios, muestreo QA y cierre transaccional a Kardex.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Sub-Pestaas Superiores Pills (En la Cabecera) */}
          <div className={`flex rounded-xl p-1 border text-xs font-sans ${
            isDark ? 'bg-[#0F141C] border-[#1A2232]' : 'bg-slate-100 border-slate-300'
          }`}>
            <button
              onClick={() => setSubTab('EN_VIVO')}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 font-bold transition-all ${
                subTab === 'EN_VIVO'
                  ? 'bg-[#00F2C3] text-slate-950 shadow'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <FlaskConical className="w-4 h-4" />
              <span>Control de Producción ({lotes.length})</span>
            </button>

            <button
              onClick={() => setSubTab('PROGRAMACION_DIARIA')}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 font-bold transition-all ${
                subTab === 'PROGRAMACION_DIARIA'
                  ? 'bg-[#00F2C3] text-slate-950 shadow'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Programacin & Control Diario</span>
            </button>
          </div>
        </div>
      </div>

      {/* 📅 Barra de Navegación por Día (DateNavigatorToolbar) */}
      <DateNavigatorToolbar
        fecha={fechaFiltro}
        onFechaChange={(nuevaFecha) => setFechaFiltro(nuevaFecha)}
        titulo={subTab === 'PROGRAMACION_DIARIA' ? 'PLANILLA Y PROGRAMACIÓN DIARIA' : 'TURNO DE PLANTA EN VIVO'}
        subtitulo={
          subTab === 'PROGRAMACION_DIARIA'
            ? 'Registro inmutable y control operativo del turno seleccionado'
            : 'Reactores, asignación de operarios y muestreo QA del turno'
        }
        extraActions={
          subTab === 'PROGRAMACION_DIARIA' ? (
            <button
              onClick={handleExportarReporte}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-sans transition-all flex items-center gap-2 ${
                isDark
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20'
                  : 'bg-teal-50 text-teal-800 border border-teal-300 hover:bg-teal-100'
              }`}
            >
              <span>📊 Exportar Planilla (PDF / Excel)</span>
            </button>
          ) : undefined
        }
      />

      {subTab === 'PROGRAMACION_DIARIA' ? (
        <div className="space-y-6">
          {/* Header Oficial Quimicorp */}
          <div className={`p-4 rounded-xl border flex flex-wrap items-center justify-between gap-4 ${cardBg}`}>
            <div>
              <h3 className={`text-sm font-bold font-sans flex items-center gap-2 ${textValue}`}>
                <span>QUIMICORP PERU S.A.C.</span>
                <span className="text-xs text-slate-400 font-mono"> RUC 20612434124</span>
              </h3>
              <p className={`text-xs font-sans ${textTitle}`}>
                PROGRAMACIÓN DIARIA DE PRODUCCIÓN • Planilla Digital Inmutable del Turno ({fechaFiltro})
              </p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="🔍 Buscar por Cliente, Producto o Lote..."
                value={busquedaQuery}
                onChange={(e) => setBusquedaQuery(e.target.value)}
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
                  {programacionData.resumen.totalOrdenes}
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
                  {programacionData.resumen.totalKgProgramados}
                </span>
                <span className="text-xs text-slate-400 font-sans">KG/LT</span>
              </div>
            </div>

            {/* KPI 3: TERMINADOS */}
            <div className={`rounded-xl p-4 border relative overflow-hidden ${cardBg}`}>
              <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500" />
              <div className={`text-[10px] font-bold tracking-widest uppercase text-emerald-500`}>
                ✅ TERMINADOS
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className={`text-2xl font-black font-mono text-emerald-400`}>
                  {programacionData.resumen.totalTerminados}
                </span>
                <span className="text-xs text-slate-400 font-sans">lotes liberados</span>
              </div>
            </div>

            {/* KPI 4: EN PROCESO */}
            <div className={`rounded-xl p-4 border relative overflow-hidden ${cardBg}`}>
              <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500" />
              <div className={`text-[10px] font-bold tracking-widest uppercase text-blue-500`}>
                ⏳ EN PROCESO
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className={`text-2xl font-black font-mono text-blue-400`}>
                  {programacionData.resumen.totalEnProceso}
                </span>
                <span className="text-xs text-slate-400 font-sans">en reactores</span>
              </div>
            </div>

            {/* KPI 5: PENDIENTES */}
            <div className={`rounded-xl p-4 border relative overflow-hidden ${cardBg}`}>
              <div className="absolute top-0 left-0 right-0 h-1 bg-slate-500" />
              <div className={`text-[10px] font-bold tracking-widest uppercase ${textTitle}`}>
                📋 PENDIENTES
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className={`text-2xl font-black font-mono ${textValue}`}>
                  {programacionData.resumen.totalPendientes}
                </span>
                <span className="text-xs text-slate-400 font-sans">en cola</span>
              </div>
            </div>
          </div>

          {/* ?? DataGrid Industrial (Digitalizacin del Excel) */}
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
                  {programacionData.ordenes.filter(o => 
                    !busquedaQuery.trim() || 
                    o.codigoLote.toLowerCase().includes(busquedaQuery.toLowerCase()) ||
                    o.clienteNombre.toLowerCase().includes(busquedaQuery.toLowerCase()) ||
                    o.productoNombre.toLowerCase().includes(busquedaQuery.toLowerCase())
                  ).length === 0 ? (
                    <tr>
                      <td colSpan={10} className="p-8 text-center text-slate-500 font-sans">
                        No hay registros de producción encontrados para la fecha seleccionada ({fechaFiltro}).
                      </td>
                    </tr>
                  ) : (
                    programacionData.ordenes.filter(o => 
                      !busquedaQuery.trim() || 
                      o.codigoLote.toLowerCase().includes(busquedaQuery.toLowerCase()) ||
                      o.clienteNombre.toLowerCase().includes(busquedaQuery.toLowerCase()) ||
                      o.productoNombre.toLowerCase().includes(busquedaQuery.toLowerCase())
                    ).map((o) => (
                      <tr key={o.id} className={`hover:bg-slate-800/20 transition-colors ${isDark ? '' : 'hover:bg-slate-50'}`}>
                        <td className="p-3 font-mono text-[11px] text-slate-400">
                          {new Date(o.fechaCreacion).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
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
                              : isDark ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-amber-100 text-amber-900 border-amber-300 font-bold'
                          }`}>
                            {o.estado}
                          </span>

                        </td>
                        <td className="p-3 font-sans">
                          <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border inline-flex items-center gap-1.5 shadow-sm ${
                            isDark
                              ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                              : 'bg-teal-50 text-teal-900 border-teal-300'
                          }`}>
                            <span className="text-xs">👷</span>
                            <span className="font-semibold">{o.operarios || 'Sin Asignar'}</span>
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            o.prioridad === 'ALTA' || o.prioridad === 'URGENTE'
                              ? 'text-rose-400 bg-rose-500/10'
                              : 'text-slate-400 bg-slate-500/10'
                          }`}>
                            {o.prioridad}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
      /* Main 2-Column Layout */
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column (5 Cols): List of Active Production Batches */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className={`text-xs font-bold tracking-widest uppercase ${textTitle}`}>
              LOTES DE PRODUCCIN EN PLANTA ({lotes.length})
            </h3>
            <span className={`text-[10px] font-sans ${textTitle}`}>Selecciona un lote</span>
          </div>

          <div className="space-y-3">
            {lotes.length === 0 ? (
              <div className={`rounded-xl p-8 border text-center space-y-3 ${cardBg}`}>
                <FlaskConical className={`w-8 h-8 mx-auto ${isDark ? 'text-cyan-400' : 'text-teal-600'}`} />
                <div className="space-y-1">
                  <h4 className={`text-sm font-bold font-sans ${textValue}`}>
                    0 Lotes en Producción ({fechaFiltro})
                  </h4>
                  <p className={`text-xs font-sans leading-relaxed ${textTitle}`}>
                    {fechaFiltro === new Date().toISOString().split('T')[0]
                      ? 'Aprueba un pedido comercial en Pedidos Entrantes de Administracin para enviarlo a Planta.'
                      : 'No se encontraron lotes registrados para la fecha seleccionada.'}
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  <a
                    href="/produccion/pedidos"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 text-white font-bold text-xs hover:bg-teal-700 transition-all font-sans shadow-md"
                  >
                    <span>📥 Ir a Pedidos Entrantes</span>
                  </a>
                  {fechaFiltro !== new Date().toISOString().split('T')[0] && (
                    <button
                      onClick={() => setFechaFiltro(new Date().toISOString().split('T')[0])}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold font-sans border transition-all ${
                        isDark ? 'border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10' : 'border-teal-300 text-teal-800 hover:bg-teal-50'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Volver al Turno de Hoy</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              lotes.map((lote) => {
              const isSelected = lote.id === selectedLoteId;
              const isExpanded = expandedLoteIds.includes(lote.id);
              const isLiberado = lote.pasoProceso === 'LIBERADO_QA' || lote.pasoProceso === 'DESPACHADO';
              const isRechazado = lote.pasoProceso === 'RECHAZADO';
              const currentStepIdx = getPasoStepIndex(lote.pasoProceso);

              return (
                <div
                  key={lote.id}
                  onClick={() => {
                    setSelectedLoteId(lote.id);
                    setObservacionInput(lote.observacionesQA || '');
                  }}
                  className={`rounded-xl p-4 border transition-all cursor-pointer space-y-3 ${
                    isLiberado
                      ? isDark
                        ? 'bg-emerald-950/20 border-emerald-500/40'
                        : 'bg-emerald-50/80 border-emerald-300'
                      : isRechazado
                      ? isDark
                        ? 'bg-rose-950/20 border-rose-500/40'
                        : 'bg-rose-50/80 border-rose-300'
                      : isSelected
                      ? isDark
                        ? 'bg-[#0F141C] border-[#00F2C3]/60 shadow-lg shadow-[#00F2C3]/5 ring-1 ring-[#00F2C3]/30'
                        : 'bg-white border-teal-500 shadow-md ring-2 ring-teal-500/20'
                      : isDark
                      ? 'bg-[#0B0F17] border-[#1A2232] hover:bg-[#0F141C]/60'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded border ${badgeCyan}`}>
                        {lote.codigoQA}
                      </span>
                      <span className={isDark ? 'text-cyan-400' : 'text-teal-700'}>{lote.codigoLote}</span>
                    </span>

                    {/* Cliente Real Destacado */}
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border font-sans ${badgeAmber}`}>
                      <Building2 className="w-3 h-3" />
                      {lote.clienteNombre?.replace(/\s*\([^)]*\)\s*$/, '') || lote.clienteNombre}
                    </span>
                  </div>


                  <div>
                    <h4 className={`text-sm font-bold font-sans ${textValue}`}>
                      {lote.nombreProducto}
                    </h4>
                  </div>

                  {/* Micro Stepper Bar for List Card */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                      <span>PASO {currentStepIdx}/4</span>
                      <span className={`font-bold ${isDark ? 'text-cyan-400' : 'text-teal-700'}`}>
                        {lote.pasoProceso === 'PENDIENTE_ASIGNACION'
                          ? '1. Asignación Operarios'
                          : lote.pasoProceso === 'ELABORANDO'
                          ? '2. Mezcla en Reactores'
                          : lote.pasoProceso === 'EN_MUESTREO_QA'
                          ? '3. Muestreo QA'
                          : lote.pasoProceso === 'LIBERADO_QA' || lote.pasoProceso === 'DESPACHADO'
                          ? '4. Finalizado & Despachado'
                          : 'RECHAZADO'}
                      </span>
                    </div>

                    <div className={`grid grid-cols-4 gap-1 h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
                      <div className={`rounded-full transition-all ${currentStepIdx >= 1 ? (isDark ? 'bg-[#00F2C3]' : 'bg-teal-600') : (isDark ? 'bg-slate-700' : 'bg-slate-300')}`} />
                      <div className={`rounded-full transition-all ${currentStepIdx >= 2 ? (isDark ? 'bg-[#00F2C3]' : 'bg-teal-600') : (isDark ? 'bg-slate-700' : 'bg-slate-300')}`} />
                      <div className={`rounded-full transition-all ${currentStepIdx >= 3 ? (isDark ? 'bg-[#00F2C3]' : 'bg-teal-600') : (isDark ? 'bg-slate-700' : 'bg-slate-300')}`} />
                      <div className={`rounded-full transition-all ${currentStepIdx >= 4 ? 'bg-emerald-500' : (isDark ? 'bg-slate-700' : 'bg-slate-300')}`} />
                    </div>
                  </div>

                  {/* Operarios and Rendimiento Footer */}
                  <div className={`border-t pt-2 text-[10px] font-sans flex items-center justify-between ${isDark ? 'border-[#1A2232] text-slate-400' : 'border-slate-100 text-slate-600'}`}>
                    <span className="flex items-center gap-1 font-bold">
                      <Users className={`h-3 w-3 ${isDark ? 'text-cyan-400' : 'text-teal-600'}`} />
                      {lote.operarios.length > 0 ? lote.operarios.join(', ') : 'Sin operarios asignados'}
                    </span>
                    <span className={`font-mono font-bold ${isDark ? 'text-cyan-400' : 'text-teal-700'}`}>
                      {lote.rendimiento}
                    </span>
                  </div>

                  {/* Botón Fórmula Completa — ahora abre modal (izq: fórmula / der: pasos) */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleVerRecetaCompletaForLote(lote.id);
                    }}
                    className={`w-full flex items-center justify-between rounded-lg px-3 py-1.5 text-[11px] font-bold font-sans transition-all border ${
                      isDark
                        ? 'bg-cyan-500/15 text-cyan-400 border-cyan-500/40 shadow-sm hover:bg-cyan-500/20'
                        : 'bg-teal-50 text-teal-800 border-teal-300 hover:bg-teal-100'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <Beaker className={`h-3.5 w-3.5 ${isDark ? 'text-cyan-400' : 'text-teal-600'}`} />
                      Ver Fórmula Completa ({lote.formula?.length || 0} insumos)
                    </span>
                    <FileText className="h-4 w-4 text-slate-400" />
                  </button>
                </div>
              );
            })
            )}
          </div>
        </div>

        {/* Right Column (7 Cols): Interactive Control Console */}
        <div className="lg:col-span-7 space-y-5">
          {!selectedLote ? (
            <div className={`rounded-xl p-10 border text-center space-y-4 flex flex-col items-center justify-center min-h-[460px] ${cardBg}`}>
              <FlaskConical className={`h-10 w-10 ${isDark ? 'text-cyan-400' : 'text-teal-600'}`} />
              <div className="space-y-1.5 max-w-sm">
                <h3 className={`text-base font-bold font-sans ${textValue}`}>
                  Selecciona un Lote de Producción
                </h3>
                <p className={`text-xs font-sans leading-relaxed ${textTitle}`}>
                  Gestiona la asignación de operarios, avance por reactores, muestreo QA y cierre transaccional a Kardex.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Card Header del Lote Seleccionado */}
              <div className={`rounded-xl p-5 border space-y-4 ${cardBg}`}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border font-mono ${badgeCyan}`}>
                      {selectedLote.codigoQA} • {selectedLote.codigoLote}
                    </span>
                    <h2 className={`text-xl font-bold font-sans mt-1 ${textValue}`}>
                      {selectedLote.nombreProducto}
                    </h2>
                  </div>

                  {/* Visibilidad Destacada del Cliente Real */}
                  <div className={`rounded-xl px-4 py-2 border flex items-center gap-2 ${badgeAmber}`}>
                    <Building2 className={`w-4 h-4 ${isDark ? 'text-amber-300' : 'text-amber-800'}`} />
                    <div>
                      <span className="text-[9px] font-mono uppercase block font-bold tracking-wider">CLIENTE ORDEN</span>
                      <span className="text-xs font-bold font-sans">{selectedLote.clienteNombre}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 1. STEPPER VISUAL DE 4 PASOS (Progreso del Lote) */}
              <div className={`rounded-xl p-4 border space-y-3 ${subBoxBg}`}>
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-bold tracking-wider uppercase font-mono ${textTitle}`}>
                    PASO ACTUAL DE PROGRESO (STEPPER OPERATIVO)
                  </span>
                  <span className={`text-xs font-bold font-mono ${isDark ? 'text-[#00F2C3]' : 'text-teal-700'}`}>
                    PASO {getPasoStepIndex(selectedLote.pasoProceso)} DE 4
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center text-xs font-sans">
                  {/* Step 1 */}
                  <div
                    className={`p-2.5 rounded-lg border flex flex-col items-center gap-1 transition-all ${
                      getPasoStepIndex(selectedLote.pasoProceso) >= 1
                        ? isDark
                          ? 'bg-[#00F2C3]/15 text-[#00F2C3] border-[#00F2C3]/40 font-bold'
                          : 'bg-teal-100 text-teal-900 border-teal-400 font-bold'
                        : isDark
                        ? 'bg-slate-900 text-slate-500 border-slate-800'
                        : 'bg-slate-200 text-slate-500 border-slate-300'
                    }`}
                  >
                    <span className="text-[10px] font-mono">PASO 1</span>
                    <span className="text-[11px] leading-tight">Pendiente Operarios</span>
                  </div>

                  {/* Step 2 */}
                  <div
                    className={`p-2.5 rounded-lg border flex flex-col items-center gap-1 transition-all ${
                      getPasoStepIndex(selectedLote.pasoProceso) >= 2
                        ? isDark
                          ? 'bg-[#00F2C3]/15 text-[#00F2C3] border-[#00F2C3]/40 font-bold'
                          : 'bg-teal-100 text-teal-900 border-teal-400 font-bold'
                        : isDark
                        ? 'bg-slate-900 text-slate-500 border-slate-800'
                        : 'bg-slate-200 text-slate-500 border-slate-300'
                    }`}
                  >
                    <span className="text-[10px] font-mono">PASO 2</span>
                    <span className="text-[11px] leading-tight">En Mezcla / Reactores</span>
                  </div>

                  {/* Step 3 */}
                  <div
                    className={`p-2.5 rounded-lg border flex flex-col items-center gap-1 transition-all ${
                      getPasoStepIndex(selectedLote.pasoProceso) >= 3
                        ? isDark
                          ? 'bg-[#00F2C3]/15 text-[#00F2C3] border-[#00F2C3]/40 font-bold'
                          : 'bg-teal-100 text-teal-900 border-teal-400 font-bold'
                        : isDark
                        ? 'bg-slate-900 text-slate-500 border-slate-800'
                        : 'bg-slate-200 text-slate-500 border-slate-300'
                    }`}
                  >
                    <span className="text-[10px] font-mono">PASO 3</span>
                    <span className="text-[11px] leading-tight">Muestreo Calidad (QA)</span>
                  </div>

                  {/* Step 4 */}
                  <div
                    className={`p-2.5 rounded-lg border flex flex-col items-center gap-1 transition-all ${
                      getPasoStepIndex(selectedLote.pasoProceso) === 4
                        ? isDark
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 font-bold'
                          : 'bg-emerald-100 text-emerald-900 border-emerald-400 font-bold'
                        : isDark
                        ? 'bg-slate-900 text-slate-500 border-slate-800'
                        : 'bg-slate-200 text-slate-500 border-slate-300'
                    }`}
                  >
                    <span className="text-[10px] font-mono">PASO 4</span>
                    <span className="text-[11px] leading-tight">Finalizado & Liberado</span>
                  </div>
                </div>
              </div>

              {/* 2. BLOQUEO INTELIGENTE DE ESTADO */}
              <div className={`rounded-xl p-4 border space-y-3 ${subBoxBg}`}>
                <div className="flex items-center justify-between">
                  <h3 className={`text-xs font-bold tracking-widest uppercase flex items-center gap-2 ${textTitle}`}>
                    <Users className={`h-4 w-4 ${isDark ? 'text-cyan-400' : 'text-teal-600'}`} />
                    OPERARIOS ASIGNADOS AL LOTE ({selectedLote.operarios.length})
                  </h3>
                </div>

                {/* Aviso de Bloqueo si 0 operarios */}
                {selectedLote.operarios.length === 0 && (
                  <div className={`p-3 rounded-lg border text-xs font-sans flex items-center gap-2 ${
                    isDark ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-amber-50 border-amber-300 text-amber-900 font-medium'
                  }`}>
                    <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
                    <span>⚠️ Asigna al menos un operario para habilitar la fabricación.</span>
                  </div>
                )}

                {/* Selector de Operarios */}
                <div className="flex flex-wrap items-center gap-2 font-sans text-xs">
                  {operariosDisponibles.map((operario) => {
                    const isAssigned = selectedLote.operarios.includes(operario);
                    return (
                      <button
                        key={operario}
                        type="button"
                        onClick={() => handleToggleOperario(operario)}
                        className={`rounded-lg px-3.5 py-1.5 font-bold transition-all flex items-center gap-1.5 border ${
                          isAssigned
                            ? isDark
                              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm'
                              : 'bg-teal-100 text-teal-900 border-teal-400 shadow-sm'
                            : isDark
                            ? 'bg-[#090C10] text-slate-400 border-[#1A2232] hover:text-slate-200'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        {isAssigned ? (
                          <Check className={`h-3.5 w-3.5 stroke-[3] ${isDark ? 'text-cyan-400' : 'text-teal-700'}`} />
                        ) : (
                          <UserPlus className="h-3.5 w-3.5 text-slate-400" />
                        )}
                        <span>{operario}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Botones de Control de Avance de Paso con estado Disabled Inteligente */}
                <div className="grid grid-cols-2 gap-2.5 pt-2">
                  <button
                    disabled={selectedLote.operarios.length === 0}
                    onClick={() => handleCambiarPaso('ELABORANDO')}
                    className={`p-2.5 rounded-lg border text-xs font-bold flex items-center justify-center gap-2 transition-all font-sans ${
                      selectedLote.operarios.length === 0
                        ? 'opacity-40 cursor-not-allowed bg-slate-200 border-slate-300 text-slate-500 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-500'
                        : selectedLote.pasoProceso === 'ELABORANDO'
                        ? isDark
                          ? 'bg-blue-500/20 text-blue-300 border-blue-500/50'
                          : 'bg-blue-100 text-blue-900 border-blue-400 shadow-sm'
                        : isDark
                        ? 'bg-slate-800 text-slate-200 hover:bg-slate-700 border-slate-700'
                        : 'bg-slate-100 text-slate-800 hover:bg-slate-200 border-slate-300'
                    }`}
                  >
                    <span>🧪 Paso 2: Elaborando Mezcla</span>
                  </button>

                  <button
                    disabled={selectedLote.operarios.length === 0}
                    onClick={() => handleCambiarPaso('EN_MUESTREO_QA')}
                    className={`p-2.5 rounded-lg border text-xs font-bold flex items-center justify-center gap-2 transition-all font-sans ${
                      selectedLote.operarios.length === 0
                        ? 'opacity-40 cursor-not-allowed bg-slate-200 border-slate-300 text-slate-500 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-500'
                        : selectedLote.pasoProceso === 'EN_MUESTREO_QA'
                        ? isDark
                          ? 'bg-purple-500/20 text-purple-300 border-purple-500/50'
                          : 'bg-purple-100 text-purple-900 border-purple-400 shadow-sm'
                        : isDark
                        ? 'bg-slate-800 text-slate-200 hover:bg-slate-700 border-slate-700'
                        : 'bg-slate-100 text-slate-800 hover:bg-slate-200 border-slate-300'
                    }`}
                  >
                    <span>🔬 Paso 3: En Muestreo QA</span>
                  </button>
                </div>
              </div>

              {/* 3. CHIPS DE INCIDENCIA RÁPIDA & OBSERVACIONES */}
              <div className={`rounded-xl p-5 border space-y-3 ${cardBg}`}>
                <div className="flex items-center justify-between">
                  <h3 className={`text-xs font-bold tracking-widest uppercase flex items-center gap-2 ${textTitle}`}>
                    <MessageSquare className={`w-4 h-4 ${isDark ? 'text-cyan-400' : 'text-teal-600'}`} />
                    OBSERVACIONES DE QA E INCIDENCIAS RPIDAS
                  </h3>
                </div>

                {/* Chips cliqueables de un toque */}
                <div className="space-y-1.5">
                  <span className={`text-[10px] font-sans block ${textTitle}`}>
                    Seleccin rpida de incidencia (Un toque):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {QUICK_INCIDENTS.map((chip, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleAddIncidentChip(chip)}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-bold font-sans transition-all flex items-center gap-1 border ${
                          isDark
                            ? 'bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                            : 'bg-teal-50 hover:bg-teal-100 text-teal-800 border-teal-300'
                        }`}
                      >
                        <span>+</span>
                        <span>{chip}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  rows={3}
                  placeholder="Escribe observaciones adicionales de control de calidad..."
                  value={observacionInput}
                  onChange={(e) => setObservacionInput(e.target.value)}
                  className={`w-full rounded-lg border p-3 text-xs focus:border-teal-500 focus:outline-none transition-all font-sans ${inputBg}`}
                />
              </div>

              {/* 5. DECISIN Y CIERRE DE LOTE (Transaccin QA ? Kardex & Logstica) */}
              <div className={`rounded-xl p-5 border space-y-4 ${cardBg}`}>
                {selectedLote.pasoProceso === 'LIBERADO_QA' ? (
                  /* Feedback Visual Verde cuando está Liberado */
                  <div className={`p-4 rounded-xl space-y-2 text-center border ${
                    isDark ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400' : 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  }`}>
                    <div className="flex items-center justify-center gap-2 font-bold font-sans text-sm">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      <span>? LIBERADO QA • Movimiento Kardex Registrado</span>
                    </div>
                    <p className="text-xs font-sans">
                      Lote {selectedLote.codigoLote} finalizado. La entrada de Producto Terminado fue asignada al cliente{' '}
                      <strong className="underline">{selectedLote.clienteNombre}</strong> y la orden ha sido enviada a la cola de{' '}
                      <a href="/produccion/etiquetas" className="underline font-bold text-teal-600 dark:text-emerald-400">
                        Etiquetas & Despacho
                      </a>
                      .
                    </p>
                  </div>
                ) : selectedLote.pasoProceso === 'RECHAZADO' ? (
                  <div className={`p-4 rounded-xl space-y-2 text-center border ${
                    isDark ? 'bg-rose-500/15 border-rose-500/40 text-rose-400' : 'bg-rose-50 border-rose-300 text-rose-900'
                  }`}>
                    <div className="flex items-center justify-center gap-2 font-bold font-sans text-sm">
                      <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                      <span>🛑 LOTE RECHAZADO Y DETENIDO EN PLANTA</span>
                    </div>
                    <p className="text-xs font-sans">
                      Motivo: {selectedLote.motivoRechazo || 'Incidencia de calidad reportada.'}
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center gap-3 font-mono">
                    <button
                      onClick={() => setShowRechazoModal(true)}
                      className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-3.5 text-xs font-bold border transition-colors font-sans ${
                        isDark
                          ? 'bg-rose-500/15 text-rose-400 border-rose-500/30 hover:bg-rose-500/25'
                          : 'bg-rose-50 text-rose-700 border-rose-300 hover:bg-rose-100'
                      }`}
                    >
                      <X className="h-4 w-4" />
                      <span>🚫 Rechazar / Parar Lote</span>
                    </button>

                    <button
                      onClick={handleFinalizarYLiberar}
                      className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-3.5 text-xs font-bold transition-all font-sans shadow-lg ${
                        isDark
                          ? 'bg-gradient-to-r from-[#00F2C3] to-teal-500 text-slate-950 hover:opacity-95 shadow-cyan-500/20'
                          : 'bg-teal-600 text-white hover:bg-teal-700 shadow-teal-600/20'
                      }`}
                    >
                      <Check className="h-4 w-4 stroke-[3]" />
                      <span>🚀 Finalizar & Liberar Lote (QA)</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      )}

      {/* Modal Obligatorio para Motivo de Rechazo */}
      {showRechazoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 font-sans">
          <div className={`w-full max-w-md rounded-2xl p-6 border space-y-4 ${cardBg}`}>
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-sm">
              <AlertTriangle className="w-5 h-5" />
              <span>Motivo Obligatorio de Rechazo de Lote</span>
            </div>

            <p className={`text-xs ${textTitle}`}>
              Por favor ingresa detalladamente el motivo tcnico por el cual se detiene el lote {selectedLote?.codigoLote}:
            </p>

            <textarea
              rows={4}
              placeholder="Ingresa la justificacin tcnica..."
              value={motivoRechazoInput}
              onChange={(e) => setMotivoRechazoInput(e.target.value)}
              className={`w-full rounded-xl border p-3 text-xs focus:border-rose-500 focus:outline-none ${inputBg}`}
            />

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowRechazoModal(false)}
                className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-colors ${
                  isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmarRechazo}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 text-xs font-bold text-white hover:bg-rose-700 shadow-md"
              >
                Confirmar Rechazo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Fórmula y Pasos en Tiempo Real (Gerencia) — izq: fórmula / der: pasos */}
      {showRecetaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 font-sans overflow-y-auto">
          <div className={`w-full max-w-5xl rounded-2xl p-6 border space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto ${cardBg}`}>
            <div className="flex items-center justify-between border-b pb-3 border-slate-700/50">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-xl border ${isDark ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' : 'bg-teal-50 border-teal-300 text-teal-700'}`}>
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={`text-sm font-bold ${textValue}`}>Fórmula y Pasos — {selectedLote?.codigoLote || recetaData?.codigoLote}</h3>
                  <p className={`text-xs ${textTitle}`}>{recetaData?.productoNombre || selectedLote?.nombreProducto} • {recetaData?.cantidadPlanificadaKg || ''} KG</p>
                </div>
              </div>
              <button onClick={() => setShowRecetaModal(false)} className={`p-2 rounded-lg border ${isDark ? 'border-slate-700 text-slate-400 hover:bg-slate-800' : 'border-slate-300 text-slate-600 hover:bg-slate-100'}`}>
                <X className="w-4 h-4" />
              </button>
            </div>

            {loadingReceta ? (
              <div className="p-8 text-center text-sm text-slate-500">
                <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-cyan-500" />
                Cargando receta unificada desde Gerencia...
              </div>
            ) : !recetaData ? (
              <div className="p-6 text-center text-sm text-slate-500 border rounded-xl border-dashed">No se pudo cargar la receta. Verifica que la fórmula exista en el sistema.</div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className={`rounded-xl border overflow-hidden flex flex-col ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                  <div className={`px-3 py-2 border-b text-xs font-bold uppercase tracking-wider ${isDark ? 'bg-[#151D2A] text-slate-400 border-slate-800' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                    Ingredientes — Total {Number(recetaData.totalGramos).toLocaleString()} g
                  </div>
                  <div className="overflow-x-auto max-h-72 overflow-y-auto">
                    <table className="w-full text-left text-xs">
                      <thead className={`border-b text-[10px] font-bold uppercase ${isDark ? 'bg-[#151D2A] text-slate-400 border-slate-800' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                        <tr>
                          <th className="p-2">SKU</th>
                          <th className="p-2">Insumo</th>
                          <th className="p-2 text-center">% Dosis</th>
                          <th className="p-2 text-right">Gramos</th>
                          <th className="p-2 text-right">Cant. KG</th>
                          <th className="p-2 text-center">Stock</th>
                        </tr>
                      </thead>
                      <tbody className={`divide-y ${isDark ? 'divide-slate-800/60' : 'divide-slate-200'}`}>
                        {recetaData.ingredientes.map((ing: any, idx: number) => (
                          <tr key={idx} className={isDark ? 'hover:bg-slate-800/30' : 'hover:bg-slate-50'}>
                            <td className="p-2 font-mono font-bold text-cyan-500">{ing.codigo}</td>
                            <td className="p-2 font-medium">{ing.nombre} {ing.esAditivo && <span className="ml-1 px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[9px]">{ing.tipo}</span>}</td>
                            <td className="p-2 text-center font-mono">{Number(ing.porcentaje).toFixed(3)}%</td>
                            <td className="p-2 text-right font-mono">{Number(ing.gramosCalculados).toLocaleString()} g</td>
                            <td className="p-2 text-right font-mono font-bold text-teal-600 dark:text-[#00F2C3]">{(Number(ing.gramosCalculados)/1000).toFixed(3)} KG</td>
                            <td className="p-2 text-center">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${ing.suficiente ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                                {ing.suficiente ? 'OK' : 'Falta'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className={`rounded-xl border p-4 space-y-2 flex flex-col ${isDark ? 'bg-[#151D2A] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <h4 className={`text-xs font-bold uppercase tracking-wider ${textTitle}`}>Pasos de Elaboración (Gerencia — tiempo real)</h4>
                  {Array.isArray(recetaData.pasosElaboracion) && recetaData.pasosElaboracion.length > 0 ? (
                    <ol className="list-decimal list-inside space-y-1.5 text-xs font-sans flex-1">
                      {recetaData.pasosElaboracion.map((paso: any, i: number) => (
                        <li key={i} className={`${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                          {typeof paso === 'string' ? paso : paso.descripcion || paso.texto || JSON.stringify(paso)}
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <p className="text-xs text-slate-500 italic">Sin pasos configurados en la fórmula maestra. Editar en Fórmulas & Ajuste Fino (Gerencia).</p>
                  )}
                  <p className="text-[10px] text-slate-400 italic pt-1 border-t border-slate-700/30">Solo lectura en Planta — edición habilitada únicamente para Gerencia en el módulo de Fórmulas.</p>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button onClick={() => setShowRecetaModal(false)} className={`px-4 py-2 rounded-xl border text-xs font-bold ${isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-100'}`}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de xito al Liberar Lote */}
      {showLiberacionModal && liberadoInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 font-sans animate-in fade-in duration-200">
          <div className={`w-full max-w-md rounded-2xl p-6 border space-y-5 shadow-2xl ${cardBg}`}>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-emerald-500 dark:text-emerald-400">
                  OPERACIN EXITOSA • QA & LOGSTICA
                </span>
                <h3 className={`text-base font-bold ${textValue}`}>
                  Lote Liberado & Enviado a Etiquetas
                </h3>
              </div>
            </div>

            <div className={`p-4 rounded-xl border space-y-2 text-xs font-sans ${subBoxBg}`}>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-mono text-[11px]">Código de Lote:</span>
                <span className="font-mono font-bold text-teal-600 dark:text-[#00F2C3]">{liberadoInfo.codigoLote}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Producto:</span>
                <span className={`font-bold ${textValue}`}>{liberadoInfo.nombreProducto}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Cliente Asignado:</span>
                <span className="font-bold text-amber-500">{liberadoInfo.clienteNombre}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Rendimiento QA:</span>
                <span className="font-mono font-bold text-emerald-500">{liberadoInfo.rendimiento}</span>
              </div>
            </div>

            <p className={`text-xs leading-relaxed ${textTitle}`}>
              El lote ha sido retirado de los reactores activos y transferido a la <strong>Cola de Etiquetas & Despacho</strong>. En la <strong>Programacin Diaria</strong> figura como <strong>TERMINADO</strong>.
            </p>

            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setShowLiberacionModal(false);
                  router.push('/produccion/etiquetas');
                }}
                className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md ${
                  isDark
                    ? 'bg-[#00F2C3] text-slate-950 hover:bg-[#00F2C3]/90 shadow-cyan-500/20'
                    : 'bg-teal-600 text-white hover:bg-teal-700 shadow-teal-600/20'
                }`}
              >
                <Printer className="w-4 h-4" />
                <span>🏷️ Ir a Imprimir Etiquetas & Despacho</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowLiberacionModal(false);
                    setSubTab('PROGRAMACION_DIARIA');
                  }}
                  className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                    isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  📋 Ver en Planilla Diaria
                </button>
                <button
                  type="button"
                  onClick={() => setShowLiberacionModal(false)}
                  className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                    isDark ? 'border-slate-700 text-slate-400 hover:bg-slate-800' : 'border-slate-300 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
