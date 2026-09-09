'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Search,
  CheckCircle2,
  Play,
  ArrowRight,
  FileText,
  CreditCard,
  Building2,
  Package,
  TrendingUp,
  Receipt,
  Scale,
  Bell,
  HelpCircle,
  ExternalLink,
  Info,
  Check,
  Terminal,
  Layers,
  Copy,
  AlertTriangle,
  ShoppingCart,
  UserCheck,
  ShieldCheck
} from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';

interface AdminManualTopic {
  id: string;
  title: string;
  icon: any;
  category: 'COMERCIAL' | 'FINANZAS' | 'INVENTARIO' | 'GERENCIA';
  duration: string;
  description: string;
  realRoute: string;
  realRouteLabel: string;
  steps: {
    title: string;
    description: string;
    tip?: string;
    warning?: string;
  }[];
  simulation: {
    actionName: string;
    endpoint: string;
    method: 'GET' | 'POST' | 'PATCH';
    samplePayload: Record<string, any>;
    sampleResponse: Record<string, any>;
    explanation: string;
  };
}

const ADMINISTRACION_TOPICS: AdminManualTopic[] = [
  {
    id: 'pedidos-comerciales',
    title: '1. Creación de Pedidos y Cotizaciones',
    icon: ShoppingCart,
    category: 'COMERCIAL',
    duration: '4 min',
    description: 'Aprende a emitir pedidos comerciales para clientes con RUC o DNI, cálculo automático de IGV y despacho a Planta.',
    realRoute: '/administracion/pedidos',
    realRouteLabel: 'Ir a Pedidos Comerciales',
    steps: [
      {
        title: 'Buscar o seleccionar el cliente oficial',
        description: 'En el formulario de nuevo pedido, busca al cliente por RUC o Razón Social. El sistema completará automáticamente su condición comercial (contado o crédito a 15/30 días).',
        tip: 'Si el cliente es nuevo, puedes registrarlo al instante desde el botón "+ Nuevo Cliente" con validación de SUNAT.'
      },
      {
        title: 'Agregar productos y presentaciones',
        description: 'Selecciona los productos del catálogo (ej. Silicona Emulsionada, Cera Líquida, Limpiador Multiuso) y especifica la presentación (Galonera 4L, Balde 20L o Bidón 120L).',
        warning: 'Verifica que el precio unitario pactado coincida con la lista oficial de precios aprobada por Gerencia.'
      },
      {
        title: 'Calcular Subtotal e IGV (18%)',
        description: 'El sistema calcula en tiempo real el valor de venta, el impuesto general a las ventas (18%) y el total en Soles (PEN).',
      },
      {
        title: 'Emitir pedido y enviar a Planta de Producción',
        description: 'Al hacer clic en "Guardar y Enviar a Planta", el pedido viaja instantáneamente a la pantalla de los operarios en Producción con alerta sonora industrial.'
      }
    ],
    simulation: {
      actionName: 'Simular Creación de Pedido Comercial',
      endpoint: '/api/v1/pedidos-admin/crear',
      method: 'POST',
      samplePayload: {
        clienteId: 'CLI-001',
        clienteRuc: '20554896321',
        clienteNombre: 'LAVADEROS INDUSTRIALES DEL SUR S.A.C.',
        condicionPago: 'CREDITO_30_DIAS',
        items: [
          { productoSku: 'FORM-SIL-01', nombre: 'SILICONA EMULSIONADA PREMIUM', presentacion: 'GALONERA 4L', cantidad: 20, precioUnitarioPen: 45.00 }
        ],
        subtotalPen: 900.00,
        igvPen: 162.00,
        totalPen: 1062.00
      },
      sampleResponse: {
        codigoPedido: 'PED-2026-104',
        estado: 'PENDIENTE_PLANTA',
        mensaje: 'Pedido registrado con éxito y transmitido a Planta de Producción.',
        ordenProduccionGenerada: 'OP-2026-104',
        cuentaCobrarGenerada: 'CC-2026-104'
      },
      explanation: 'El pedido genera en paralelo la orden de producción para los operarios de planta y la cuenta por cobrar en el módulo financiero.'
    }
  },
  {
    id: 'autorizaciones-descuentos',
    title: '2. Campana en Vivo y Autorizaciones Gerenciales',
    icon: Bell,
    category: 'GERENCIA',
    duration: '3 min',
    description: 'Flujo de aprobación para descuentos especiales, ventas que superan límite de crédito o anulaciones.',
    realRoute: '/administracion/dashboard',
    realRouteLabel: 'Ver Panel Gerencial',
    steps: [
      {
        title: 'Solicitud automática por regla de negocio',
        description: 'Si un asistente comercial aplica un descuento superior al 5% o un cliente tiene facturas vencidas, el pedido no pasa a planta de inmediato; genera una "Solicitud de Autorización".',
      },
      {
        title: 'Campana de notificaciones en tiempo real',
        description: 'En la barra superior de Gerencia sonará una alerta visual y la campana mostrará un punto rojo con el número de aprobaciones pendientes.',
        tip: 'Puedes autorizar o denegar la solicitud con un solo clic adjuntando una breve observación que queda grabada en el log de auditoría.'
      },
      {
        title: 'Liberación inmediata a producción',
        description: 'Una vez aprobada por Gerencia, el pedido se desbloquea automáticamente y pasa a la cola de fabricación de planta.'
      }
    ],
    simulation: {
      actionName: 'Simular Dictamen de Autorización Gerencial',
      endpoint: '/api/v1/solicitudes-autorizacion/AUT-992/aprobar',
      method: 'POST',
      samplePayload: {
        solicitudId: 'AUT-992',
        tipo: 'DESCUENTO_ESPECIAL_CLIENTE',
        solicitante: 'Asistente Comercial',
        descuentoSolicitado: '8.5%',
        dictamen: 'APROBADO',
        observacionGerencia: 'Aprobado por volumen de compra superior a S/ 5,000 en el mes.'
      },
      sampleResponse: {
        status: 'APROBADO',
        aprobadoPor: 'Elvis Edwin Yarleque Arrunategui (Gerencia)',
        fechaDictamen: new Date().toISOString(),
        pedidoDesbloqueado: 'PED-2026-104'
      },
      explanation: 'Registra el visto bueno formal de Gerencia con firma digital de auditoría y notifica al área comercial.'
    }
  },
  {
    id: 'cobranzas-finanzas',
    title: '3. Cuentas por Cobrar y Registro de Abonos',
    icon: CreditCard,
    category: 'FINANZAS',
    duration: '4 min',
    description: 'Seguimiento de facturas de clientes, control de vencimientos a 15/30 días y registro de abonos bancarios.',
    realRoute: '/administracion/cobranzas',
    realRouteLabel: 'Ir a Cuentas por Cobrar',
    steps: [
      {
        title: 'Monitorear la cartera vencida vs por vencer',
        description: 'En el módulo de Cobranzas, revisa los indicadores superiores: Total por Cobrar, Cartera Vigente y Facturas Vencidas en color rojo.',
      },
      {
        title: 'Registrar abono o pago parcial',
        description: 'Ubica la factura del cliente y pulsa "+ Registrar Abono". Selecciona el banco receptor (BCP, BBVA, Interbank), número de operación y monto en Soles.',
        tip: 'Si el cliente paga solo una parte de la factura, el estado cambiará automáticamente a "PARCIAL" y actualizará el saldo deudor restante.'
      },
      {
        title: 'Cierre total de la cuenta',
        description: 'Cuando la suma de abonos iguala el total de la factura, pasa a estado "CANCELADO" y se libera el cupo de crédito del cliente para futuros pedidos.'
      }
    ],
    simulation: {
      actionName: 'Simular Registro de Abono Bancario',
      endpoint: '/api/v1/cobranzas/abonos',
      method: 'POST',
      samplePayload: {
        cuentaCobrarId: 'CC-2026-042',
        cliente: 'DISTRIBUIDORA NORTE S.A.C.',
        banco: 'BCP CUENTA CORRIENTE SOLES',
        numeroOperacion: '004928174',
        montoAbonadoPen: 500.00,
        montoTotalFacturaPen: 1200.00,
        saldoAnteriorPen: 1200.00
      },
      sampleResponse: {
        ok: true,
        nuevoSaldoDeudorPen: 700.00,
        nuevoEstado: 'PARCIAL',
        comprobanteAbonoId: 'ABO-2026-0881',
        mensaje: 'Abono de S/ 500.00 registrado con éxito en BCP.'
      },
      explanation: 'Actualiza el saldo pendiente en tiempo real y emite el recibo de caja correspondiente.'
    }
  },
  {
    id: 'gestion-inventario-kardex',
    title: '4. Gestión de Insumos, Reposición y Kardex (PEN)',
    icon: Package,
    category: 'INVENTARIO',
    duration: '4 min',
    description: 'Control maestro de insumos químicos, envases, edición rápida de stock, costos unitarios y reposiciones.',
    realRoute: '/administracion/inventario',
    realRouteLabel: 'Ir a Gestión de Insumos',
    steps: [
      {
        title: 'Crear nuevo insumo con SKU oficial',
        description: 'Pulsa "Nuevo Insumo". Ingresa el SKU (ej. BAS-010, FRA-005, ENV-003), nombre químico comercial, categoría, unidad de medida (KG, L, UN), costo unitario en PEN y stock inicial.',
        tip: 'Puedes marcar la casilla "Solo Fórmula (ESP)" para insumos teóricos de desarrollo de recetas que no requieren stock en estantería.'
      },
      {
        title: 'Editar datos o stock en línea',
        description: 'Haz clic en el lápiz azul ✏️ para editar directamente en la fila el nombre, SKU, categoría o stock físico actual. El sistema genera automáticamente el ajuste contable en Kardex.',
      },
      {
        title: 'Eliminación segura o desactivación',
        description: 'Al pulsar el botón de papelera 🗑️, si el producto es de prueba se borrará al 100% liberando su código SKU; si ya fue usado en fórmulas, se desactivará automáticamente para proteger la trazabilidad histórica.',
        warning: 'Nunca borres un insumo principal que esté siendo utilizado en órdenes de producción en proceso.'
      }
    ],
    simulation: {
      actionName: 'Simular Reposición de Stock con Factura de Proveedor',
      endpoint: '/api/v1/inventario/insumos/BAS-001/reponer',
      method: 'POST',
      samplePayload: {
        insumoId: 'BAS-001',
        cantidadKg: 500,
        costoUnitarioPen: 18.50,
        documentoReferencia: 'FACTURA PROVEEDOR F001-4491',
        proveedor: 'QUIMICA INDUSTRIAL ANDINA S.A.'
      },
      sampleResponse: {
        ok: true,
        stockAnteriorKg: 610.625,
        stockNuevoKg: 1110.625,
        costoPromedioPen: 18.25,
        kardexMovimientoId: 'KDX-ENT-10492',
        mensaje: 'Stock repuesto con éxito. 500 KG ingresados al Kardex valorizado.'
      },
      explanation: 'Suma el stock al inventario, recalcula el costo promedio ponderado y registra la entrada en el Kardex oficial.'
    }
  },
  {
    id: 'proveedores-comparador',
    title: '5. Proveedores y Comparador de Precios',
    icon: Scale,
    category: 'INVENTARIO',
    duration: '3 min',
    description: 'Directorio de proveedores químicos, registro de cotizaciones y comparador automático para comprar al menor costo.',
    realRoute: '/administracion/comparador-precios',
    realRouteLabel: 'Ir al Comparador de Precios',
    steps: [
      {
        title: 'Mantener actualizado el tarifario de cotizaciones',
        description: 'Registra las cotizaciones de los proveedores para cada insumo (precio por kilo/litro, plazo de entrega y crédito otorgado).',
      },
      {
        title: 'Consultar el Comparador de Precios',
        description: 'Ingresa al Comparador, selecciona el insumo a reabastecer y el sistema ordenará los proveedores de menor a mayor precio unitario en Soles.',
        tip: 'El comparador calcula el ahorro total proyectado para el volumen de compra que necesitas.'
      },
      {
        title: 'Generar Orden de Compra formal',
        description: 'Selecciona al proveedor ganador y genera la orden de compra en PDF con las condiciones comerciales pactadas.'
      }
    ],
    simulation: {
      actionName: 'Simular Comparativa de Precios de Insumo',
      endpoint: '/api/v1/cotizaciones-proveedores/comparativa/BAS-001',
      method: 'GET',
      samplePayload: { insumoSku: 'BAS-001', volumenRequeridoKg: 1000 },
      sampleResponse: {
        insumo: 'EMULSION DE SILICONA 60%',
        mejorPrecio: {
          proveedor: 'DISTRIBUIDORA QUIMICA LIMA SAC',
          precioKiloPen: 17.80,
          totalCompraPen: 17800.00,
          plazoEntrega: '24 horas'
        },
        segundaOpcion: {
          proveedor: 'IMPORTADORA QUIMICA ANDINA',
          precioKiloPen: 19.20,
          totalCompraPen: 19200.00,
          ahorroVsSegundaOpcionPen: 1400.00
        }
      },
      explanation: 'Permite tomar decisiones de abastecimiento basadas en el mejor margen comercial y ahorro real.'
    }
  },
  {
    id: 'dashboard-reportes',
    title: '6. Dashboard Gerencial, KPIs y Reportes Excel',
    icon: TrendingUp,
    category: 'GERENCIA',
    duration: '3 min',
    description: 'Análisis de facturación mensual, margen bruto, clientes top y exportación de reportes contables a Excel.',
    realRoute: '/administracion/dashboard',
    realRouteLabel: 'Ir al Dashboard Gerencial',
    steps: [
      {
        title: 'Lectura de KPIs Financieros Principales',
        description: 'En el encabezado del Dashboard verás Facturación del Mes, Cobranzas Efectivas, Margen Bruto y Cuentas por Cobrar Vencidas actualizadas en tiempo real.',
      },
      {
        title: 'Análisis de Ventas por Categoría y Cliente',
        description: 'Los gráficos interactivos muestran qué líneas de productos (Línea Automotriz, Ceras, Desinfectantes) generan el mayor volumen de facturación y qué clientes lideran la cartera.',
      },
      {
        title: 'Descarga de Reportes Oficiales a Excel',
        description: 'En el Centro de Reportes puedes descargar con un clic el balance de ventas, el Kardex contable para SUNAT o el consolidado de asistencia de personal.',
        tip: 'Los archivos Excel se descargan con fórmulas y formato corporativo listos para presentar a gerencia o contabilidad externa.'
      }
    ],
    simulation: {
      actionName: 'Simular Consulta de KPIs Gerenciales',
      endpoint: '/api/v1/administracion/dashboard/stats',
      method: 'GET',
      samplePayload: { periodo: 'MES_ACTUAL' },
      sampleResponse: {
        facturacionTotalPen: 48590.00,
        cobranzasEfectivasPen: 37200.00,
        cuentasPorCobrarVencidasPen: 4350.00,
        margenBrutoPromedio: '42.8%',
        topCliente: 'LAVADEROS INDUSTRIALES DEL SUR S.A.C.',
        ordenesProduccionCompletadas: 34
      },
      explanation: 'Consolida la información operativa, comercial y de almacén en una sola vista estratégica para la toma de decisiones.'
    }
  }
];

export default function ManualAdministracionPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [selectedTopicId, setSelectedTopicId] = useState<string>(ADMINISTRACION_TOPICS[0].id);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('TODAS');
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [simulationResult, setSimulationResult] = useState<any>(null);
  const [copiedPayload, setCopiedPayload] = useState(false);

  // Filtrado de tópicos por búsqueda y categoría
  const filteredTopics = useMemo(() => {
    return ADMINISTRACION_TOPICS.filter(t => {
      const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase());
      const matchCategory = filterCategory === 'TODAS' || t.category === filterCategory;
      return matchSearch && matchCategory;
    });
  }, [search, filterCategory]);

  const activeTopic = useMemo(() => {
    return ADMINISTRACION_TOPICS.find(t => t.id === selectedTopicId) || ADMINISTRACION_TOPICS[0];
  }, [selectedTopicId]);

  const toggleStep = (stepKey: string) => {
    setCompletedSteps(prev => ({
      ...prev,
      [stepKey]: !prev[stepKey]
    }));
  };

  const handleRunSimulation = () => {
    setSimulationRunning(true);
    setSimulationResult(null);
    setTimeout(() => {
      setSimulationResult(activeTopic.simulation.sampleResponse);
      setSimulationRunning(false);
    }, 600);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 1800);
  };

  const topicCompletedCount = useMemo(() => {
    let count = 0;
    activeTopic.steps.forEach((_, idx) => {
      if (completedSteps[`${activeTopic.id}_${idx}`]) count++;
    });
    return count;
  }, [activeTopic, completedSteps]);

  const topicProgressPct = Math.round((topicCompletedCount / activeTopic.steps.length) * 100);

  return (
    <div className={`min-h-screen p-6 space-y-6 ${isDark ? 'bg-[#090C10] text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {/* Encabezado Superior */}
      <div className={`p-6 rounded-2xl border transition-all ${isDark ? 'bg-[#0F141C] border-[#1A2232]' : 'bg-white border-slate-200 shadow-sm'}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/10 border border-blue-500/30 text-blue-400 shadow-lg shadow-blue-500/5">
              <BookOpen className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black tracking-tight">Manual Interactivo de Administración & Finanzas</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-500/15 text-blue-400 border border-blue-500/30">
                  Gestión Corporativa
                </span>
              </div>
              <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Procedimientos comerciales, cobranzas, reposición de inventario y simuladores operativos en vivo tipo Swagger.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/administracion/dashboard"
              className={`px-3.5 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
                isDark ? 'border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span>Dashboard Gerencial</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/administracion/pedidos"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all"
            >
              <span>Nuevo Pedido</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Barra de Búsqueda y Categorías */}
      <div className={`p-4 rounded-xl border flex flex-wrap items-center justify-between gap-3 ${isDark ? 'bg-[#0F141C] border-[#1A2232]' : 'bg-white border-slate-200'}`}>
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por pedido comercial, abono, factura, insumo o reporte..."
            className={`w-full pl-9 pr-3 py-2 rounded-xl border text-xs outline-none transition-all ${
              isDark ? 'bg-[#151D2A] border-[#1A2232] text-white focus:border-blue-500/50' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-600'
            }`}
          />
        </div>

        <div className="flex items-center gap-2">
          {['TODAS', 'COMERCIAL', 'FINANZAS', 'INVENTARIO', 'GERENCIA'].map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-wider transition-all ${
                filterCategory === cat
                  ? 'bg-blue-500/20 border border-blue-500/40 text-blue-400 shadow-sm'
                  : isDark
                  ? 'border border-slate-800 text-slate-400 hover:text-white'
                  : 'border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Principal: Menú de Tópicos (Izquierda) + Detalle y Simulador (Derecha) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Columna Izquierda: Lista de Módulos */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className={`text-[10px] font-black uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Módulos del Manual ({filteredTopics.length})
            </span>
            <span className="text-[10px] font-mono text-blue-400">Guía de Procedimientos</span>
          </div>

          <div className="space-y-2">
            {filteredTopics.map(topic => {
              const Icon = topic.icon;
              const isSelected = topic.id === activeTopic.id;
              const completedInTopic = topic.steps.filter((_, idx) => completedSteps[`${topic.id}_${idx}`]).length;
              const isAllDone = completedInTopic === topic.steps.length;

              return (
                <button
                  key={topic.id}
                  onClick={() => {
                    setSelectedTopicId(topic.id);
                    setSimulationResult(null);
                  }}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3.5 group ${
                    isSelected
                      ? isDark
                        ? 'bg-blue-500/10 border-blue-500/40 shadow-lg shadow-blue-500/5'
                        : 'bg-blue-50 border-blue-300 shadow-sm'
                      : isDark
                      ? 'bg-[#0F141C] border-[#1A2232] hover:border-slate-700'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-blue-600 text-white font-bold'
                      : isDark
                      ? 'bg-slate-800 text-slate-300 group-hover:text-white'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className={`text-xs font-bold truncate ${
                        isSelected
                          ? isDark ? 'text-blue-300' : 'text-blue-800'
                          : isDark ? 'text-slate-200' : 'text-slate-800'
                      }`}>
                        {topic.title}
                      </span>
                      {isAllDone && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      )}
                    </div>
                    <p className={`text-[11px] line-clamp-1 mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {topic.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-[10px] font-mono">
                      <span className={`px-1.5 py-0.5 rounded ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'}`}>
                        {topic.duration}
                      </span>
                      <span className={`${completedInTopic === topic.steps.length ? 'text-blue-400 font-bold' : isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        {completedInTopic}/{topic.steps.length} pasos listos
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Columna Derecha: Detalle + Simulador */}
        <div className="lg:col-span-8 space-y-6">
          {/* Card de Procedimiento Activo */}
          <div className={`p-6 rounded-2xl border space-y-6 ${isDark ? 'bg-[#0F141C] border-[#1A2232]' : 'bg-white border-slate-200 shadow-sm'}`}>
            {/* Header del Tema */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-dashed border-slate-700/50">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    {activeTopic.category}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">• Duración estimada: {activeTopic.duration}</span>
                </div>
                <h2 className="text-lg font-black">{activeTopic.title}</h2>
                <p className={`text-xs mt-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  {activeTopic.description}
                </p>
              </div>

              <Link
                href={activeTopic.realRoute}
                className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shrink-0 shadow-md shadow-blue-600/20"
              >
                <span>{activeTopic.realRouteLabel}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Progreso del Tema */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-slate-400">Progreso del procedimiento</span>
                <span className="font-mono font-bold text-blue-400">{topicProgressPct}% completado</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-300"
                  style={{ width: `${topicProgressPct}%` }}
                />
              </div>
            </div>

            {/* Pasos a seguir */}
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-400" />
                Flujo de Trabajo Operativo:
              </h3>

              <div className="space-y-3">
                {activeTopic.steps.map((step, idx) => {
                  const stepKey = `${activeTopic.id}_${idx}`;
                  const isDone = Boolean(completedSteps[stepKey]);

                  return (
                    <div
                      key={idx}
                      onClick={() => toggleStep(stepKey)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer select-none ${
                        isDone
                          ? isDark
                            ? 'bg-blue-500/5 border-blue-500/30'
                            : 'bg-blue-50/70 border-blue-200'
                          : isDark
                          ? 'bg-[#151D2A] border-[#1A2232] hover:border-slate-600'
                          : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          type="button"
                          className={`mt-0.5 p-1 rounded-lg transition-colors ${
                            isDone
                              ? 'bg-blue-600 text-white'
                              : isDark
                              ? 'border border-slate-600 text-transparent hover:border-blue-400'
                              : 'border border-slate-400 text-transparent hover:border-blue-600'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>

                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-black text-blue-400">Paso {idx + 1}.</span>
                            <span className={`text-xs font-bold ${isDone ? 'line-through opacity-75' : ''}`}>
                              {step.title}
                            </span>
                          </div>

                          <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                            {step.description}
                          </p>

                          {step.tip && (
                            <div className="mt-2 p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[11px] flex items-start gap-2">
                              <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                              <span><strong>Recomendación Administrativa:</strong> {step.tip}</span>
                            </div>
                          )}

                          {step.warning && (
                            <div className="mt-2 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[11px] flex items-start gap-2">
                              <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                              <span><strong>Norma de Control Interno:</strong> {step.warning}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* SIMULADOR INTERACTIVO TIPO SWAGGER ("Try It Out" Administrativo) */}
          <div className={`p-6 rounded-2xl border space-y-4 ${isDark ? 'bg-[#0F141C] border-[#1A2232]' : 'bg-white border-slate-200 shadow-sm'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
                  <Terminal className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider">Simulador de Transacción en Vivo (Try it out)</h3>
                  <p className="text-[11px] text-slate-400">Experimenta el comportamiento de las APIs de negocio en un entorno seguro de pruebas.</p>
                </div>
              </div>

              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                Sandbox Financiero
              </span>
            </div>

            {/* Barra de Endpoint */}
            <div className={`p-3 rounded-xl border font-mono text-xs flex flex-wrap items-center justify-between gap-3 ${isDark ? 'bg-[#151D2A] border-[#1A2232]' : 'bg-slate-100 border-slate-300'}`}>
              <div className="flex items-center gap-2.5">
                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                  activeTopic.simulation.method === 'POST'
                    ? 'bg-emerald-500 text-slate-950'
                    : activeTopic.simulation.method === 'PATCH'
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-blue-500 text-white'
                }`}>
                  {activeTopic.simulation.method}
                </span>
                <span className="text-slate-300 font-bold">{activeTopic.simulation.endpoint}</span>
              </div>

              <button
                onClick={handleRunSimulation}
                disabled={simulationRunning}
                className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/20 disabled:opacity-50 transition-all"
              >
                <Play className={`w-3.5 h-3.5 ${simulationRunning ? 'animate-spin' : ''}`} />
                <span>{simulationRunning ? 'Calculando...' : '▶️ Ejecutar Prueba'}</span>
              </button>
            </div>

            <p className="text-xs text-slate-400">
              {activeTopic.simulation.explanation}
            </p>

            {/* Parámetros de Entrada y Respuesta Simulada */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Payload Enviado */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-400">Parámetros de Entrada (JSON Body):</span>
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(activeTopic.simulation.samplePayload, null, 2))}
                    className="text-slate-400 hover:text-white flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedPayload ? 'Copiado' : 'Copiar'}</span>
                  </button>
                </div>
                <pre className={`p-3 rounded-xl border text-[11px] font-mono overflow-x-auto max-h-48 leading-tight ${
                  isDark ? 'bg-[#090C10] border-slate-800 text-blue-400' : 'bg-slate-900 text-blue-400'
                }`}>
                  {JSON.stringify(activeTopic.simulation.samplePayload, null, 2)}
                </pre>
              </div>

              {/* Respuesta del Servidor */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-400">Respuesta Servidor (HTTP 200 OK):</span>
                  {simulationResult && (
                    <span className="text-emerald-400 font-bold">✓ 200 OK (Calculado)</span>
                  )}
                </div>
                <pre className={`p-3 rounded-xl border text-[11px] font-mono overflow-x-auto max-h-48 leading-tight ${
                  simulationResult
                    ? isDark ? 'bg-[#090C10] border-blue-500/40 text-emerald-300' : 'bg-slate-900 text-emerald-300'
                    : isDark ? 'bg-[#090C10] border-slate-800 text-slate-500' : 'bg-slate-900 text-slate-400'
                }`}>
                  {simulationResult
                    ? JSON.stringify(simulationResult, null, 2)
                    : '// Presiona "▶️ Ejecutar Prueba" para ver el resultado financiero simulado.'}
                </pre>
              </div>
            </div>
          </div>

          {/* Preguntas Frecuentes y Políticas Administrativas */}
          <div className={`p-6 rounded-2xl border space-y-3 ${isDark ? 'bg-[#0F141C] border-[#1A2232]' : 'bg-white border-slate-200'}`}>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-blue-400" />
              Políticas Administrativas & Preguntas Frecuentes
            </h3>

            <div className="space-y-2 text-xs">
              <details className={`p-3 rounded-xl border ${isDark ? 'bg-[#151D2A] border-[#1A2232]' : 'bg-slate-50 border-slate-200'}`}>
                <summary className="font-bold cursor-pointer text-blue-400">¿Qué hacer si un cliente solicita factura electrónica antes de pagar?</summary>
                <p className="mt-2 text-slate-300 leading-relaxed">
                  Verifica el historial crediticio del cliente en su ficha. Si está clasificado como "CLIENTE VIP" o con línea de crédito aprobada, emite el pedido en modalidad CRÉDITO 15 o 30 días; de lo contrario, se despacha en modalidad CONTADO CONTRAENTREGA.
                </p>
              </details>

              <details className={`p-3 rounded-xl border ${isDark ? 'bg-[#151D2A] border-[#1A2232]' : 'bg-slate-50 border-slate-200'}`}>
                <summary className="font-bold cursor-pointer text-blue-400">¿Cómo se audita una diferencia en el stock de insumos?</summary>
                <p className="mt-2 text-slate-300 leading-relaxed">
                  Ingresa a Kardex de Inventario y filtra por el código SKU. Todo ajuste manual queda grabado con el usuario que lo realizó, el motivo y la fecha exacta.
                </p>
              </details>

              <details className={`p-3 rounded-xl border ${isDark ? 'bg-[#151D2A] border-[#1A2232]' : 'bg-slate-50 border-slate-200'}`}>
                <summary className="font-bold cursor-pointer text-blue-400">¿Quién tiene permiso para anular una factura o pedido aprobado?</summary>
                <p className="mt-2 text-slate-300 leading-relaxed">
                  Solo los roles con permisos de Gerencia General y Gerente Administrativo pueden autorizar anulaciones con sustento formal para no descuadrar la contabilidad.
                </p>
              </details>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
