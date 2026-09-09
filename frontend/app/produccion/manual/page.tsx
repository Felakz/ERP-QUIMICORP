'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Search,
  CheckCircle2,
  Circle,
  Play,
  ArrowRight,
  Sparkles,
  Inbox,
  Beaker,
  Sliders,
  FileText,
  Tag,
  Clock,
  ShieldAlert,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  ExternalLink,
  Info,
  Check,
  Terminal,
  Layers,
  Copy
} from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';

interface ManualTopic {
  id: string;
  title: string;
  icon: any;
  category: 'OPERACION' | 'CALIDAD' | 'LOGISTICA' | 'PERSONAL';
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

const PRODUCCION_TOPICS: ManualTopic[] = [
  {
    id: 'pedidos-entrantes',
    title: '1. Recepción y Asignación de Pedidos',
    icon: Inbox,
    category: 'OPERACION',
    duration: '3 min',
    description: 'Aprende a recibir las órdenes de venta enviadas por Administración y convertirlas en lotes de producción planificados.',
    realRoute: '/produccion/pedidos',
    realRouteLabel: 'Ir a Pedidos Entrantes',
    steps: [
      {
        title: 'Verificar la bandeja de pedidos pendientes',
        description: 'Ingresa a la pestaña "Pedidos Entrantes". Los pedidos nuevos emitidos por ventas aparecerán en estado "PENDIENTE" con código identificador OP-2026-XXX.',
        tip: 'Si tienes el sonido activado en el sistema, sonará un timbre industrial automático cada vez que Administración apruebe un pedido nuevo.'
      },
      {
        title: 'Revisar especificaciones del cliente',
        description: 'Haz clic en el pedido para ver el producto requerido, presentación en litros/kilos, y notas especiales (color, fragancia o viscosidad personalizada).',
      },
      {
        title: 'Asignar supervisor y operarios de planta',
        description: 'Selecciona los operarios responsables que realizarán la mezcla física y pulsa "Iniciar Producción". Esto bloqueará la materia prima necesaria en el inventario.',
        warning: 'Verifica que el stock de insumos no esté en rojo antes de arrancar la preparación en tina.'
      }
    ],
    simulation: {
      actionName: 'Simular Recepción y Asignación de Pedido',
      endpoint: '/api/v1/produccion/ordenes/OP-2026-088/iniciar',
      method: 'POST',
      samplePayload: {
        codigoLote: 'LOT-2026-088',
        supervisor: 'Supervisor Planta Lima',
        operarios: ['Carlos Mendoza', 'Juan Pérez'],
        tinaAsignada: 'TINA-02 (500 Litros)'
      },
      sampleResponse: {
        status: 'EN_PROCESO',
        mensaje: 'Orden de producción iniciada con éxito. Stock de materias primas reservado en Kardex.',
        loteGenerado: 'LOT-2026-088',
        timestamp: new Date().toISOString()
      },
      explanation: 'Esta acción cambia el estado del pedido a EN PROCESO y notifica a Administración que la fabricación comenzó en planta.'
    }
  },
  {
    id: 'formulas-dosificacion',
    title: '2. Fórmulas Maestras y Dosificación',
    icon: Beaker,
    category: 'OPERACION',
    duration: '4 min',
    description: 'Consulta las recetas oficiales aprobadas por QA, con porcentajes exactos de componentes y orden de mezclado.',
    realRoute: '/produccion/formulas',
    realRouteLabel: 'Ir al Maestro de Fórmulas',
    steps: [
      {
        title: 'Seleccionar la Fórmula Oficial',
        description: 'Busca el código o nombre del producto (ej: Silicona Emulsionada, Cera Líquida, Shampoo para Autos). Verifica que la fórmula esté en estado "APROBADA".',
        tip: 'Las fórmulas cuentan con densidad teórica calculada (g/ml) para que la conversión de litros a kilos sea matemáticamente exacta.'
      },
      {
        title: 'Pesar en balanza según porcentaje exacto',
        description: 'La tabla calcula automáticamente los kilos exactos según el volumen total a preparar (ej. 200 L o 1000 L). Cada insumo debe pesarse con tara en cero.',
        warning: 'Nunca agregues un insumo en orden distinto al indicado en los pasos de elaboración (ej. agregar bases antes de emulsionantes).'
      },
      {
        title: 'Control de agitación y tiempos de reposo',
        description: 'Respeta las RPM del agitador industrial y los minutos de reposo indicados en la ficha técnica para evitar que la mezcla se corte o se opaque.'
      }
    ],
    simulation: {
      actionName: 'Simular Cálculo de Insumos según Volumen',
      endpoint: '/api/v1/formulas/SILICONA-AUTO/calcular-masa',
      method: 'POST',
      samplePayload: {
        codigoFormula: 'FORM-SIL-01',
        volumenDeseadoLitros: 500,
        densidadTeorica: 1.025
      },
      sampleResponse: {
        masaTotalKg: 512.5,
        componentes: [
          { sku: 'BAS-001', nombre: 'EMULSION DE SILICONA 60%', porcentaje: '35.00%', pesoRequeridoKg: 179.375 },
          { sku: 'ESP-004', nombre: 'CONSERVANTE FORMOL / METIL', porcentaje: '0.20%', pesoRequeridoKg: 1.025 },
          { sku: 'FRA-012', nombre: 'FRAGANCIA CHERRY PREMIUM', porcentaje: '0.80%', pesoRequeridoKg: 4.100 },
          { sku: 'AGU-001', nombre: 'AGUA TRATADA INDUSTRIAL', porcentaje: '64.00%', pesoRequeridoKg: 328.000 }
        ]
      },
      explanation: 'El sistema calcula automáticamente la masa neta requerida multiplicando el volumen deseado por la densidad química teórica.'
    }
  },
  {
    id: 'ajustes-finos',
    title: '3. Ajustes Finos en Planta (Sin romper receta)',
    icon: Sliders,
    category: 'OPERACION',
    duration: '3 min',
    description: 'Cómo registrar adiciones correctoras (color, espesante o fragancia) durante la mezcla física protegiendo la trazabilidad.',
    realRoute: '/produccion/formulas',
    realRouteLabel: 'Ir a Ajuste Fino en Planta',
    steps: [
      {
        title: 'Detectar desviación sensorial o físico-química',
        description: 'Si tras la primera mezcla la viscosidad está baja o el color no coincide exactamente con el patrón de muestra, se requiere un ajuste fino.',
      },
      {
        title: 'Registrar la adición en el módulo de Ajuste Fino',
        description: 'Ingresa al botón "Ajuste Fino", selecciona el insumo corrector (ej. Cloruro de Sodio, Colorante Azul, Fragancia) e ingresa los gramos exactos agregados.',
        tip: 'El ajuste fino descuenta el insumo inmediatamente del Kardex real pero NO altera la fórmula maestra original del sistema.'
      },
      {
        title: 'Verificar homogeneización',
        description: 'Agita durante 10 minutos y vuelve a tomar muestra antes de enviar a control de calidad.'
      }
    ],
    simulation: {
      actionName: 'Simular Registro de Ajuste Fino',
      endpoint: '/api/v1/produccion/ajustes-finos',
      method: 'POST',
      samplePayload: {
        ordenProduccionId: 'LOT-2026-088',
        insumoId: 'COL-003',
        insumoNombre: 'COLORANTE AZUL BRILLANTE',
        cantidadAgregadaGramos: 15.5,
        observacion: 'Corrección de tono azul para igualar estándar de cliente'
      },
      sampleResponse: {
        ok: true,
        movimientoKardexId: 'KDX-AJU-9921',
        tipo: 'AJUSTE_FINO_PLANTA',
        descuentoKardex: '15.5 g descontados de COLORANTE AZUL',
        loteActualizado: 'LOT-2026-088'
      },
      explanation: 'El ajuste fino queda registrado en el historial del lote para auditorías de calidad y descuenta el insumo en el Kardex.'
    }
  },
  {
    id: 'control-qa',
    title: '4. Control de Calidad (QA) y Liberación de Lote',
    icon: ShieldAlert,
    category: 'CALIDAD',
    duration: '3 min',
    description: 'Procedimiento para registrar pruebas de pH, densidad real, viscosidad y aprobación del supervisor.',
    realRoute: '/produccion/qa',
    realRouteLabel: 'Ir a Control de Calidad & QA',
    steps: [
      {
        title: 'Toma de muestra representativa',
        description: 'Toma 250 ml de la parte media de la tina luego de 15 minutos de reposo tras la agitación.',
      },
      {
        title: 'Ingreso de parámetros medidos',
        description: 'Mide con potenciómetro (pH) y densímetro o copa Ford. Registra los valores en la ficha de QA del lote.',
        warning: 'Si el pH o densidad difiere más del ±5% del valor teórico, el lote entra en "OBSERVADO" y no puede ser envasado.'
      },
      {
        title: 'Liberación y Aprobación de Lote',
        description: 'El supervisor pulsa "Aprobar Lote". Se autoriza el pase automático a la estación de envasado y etiquetado.'
      }
    ],
    simulation: {
      actionName: 'Simular Dictamen de Calidad (QA)',
      endpoint: '/api/v1/produccion/qa/LOT-2026-088/dictamen',
      method: 'POST',
      samplePayload: {
        phMedido: 7.2,
        densidadMedida: 1.026,
        colorConforme: true,
        aromaConforme: true,
        dictamen: 'APROBADO',
        observaciones: 'Lote homogéneo, brillo y fragancia cumplen al 100% estándar de calidad.'
      },
      sampleResponse: {
        estado: 'APROBADO_PARA_ENVASADO',
        supervisorQA: 'Ing. Calidad Quimicorp',
        fechaLiberacion: new Date().toISOString(),
        habilitadoParaEtiquetado: true
      },
      explanation: 'Al aprobarse el QA, el lote queda desbloqueado para emitir etiquetas térmicas y despachar a los clientes.'
    }
  },
  {
    id: 'kardex-inventario',
    title: '5. Kardex Inmutable y Trazabilidad en Tiempo Real',
    icon: FileText,
    category: 'LOGISTICA',
    duration: '4 min',
    description: 'Monitoreo de movimientos de almacén: entradas por compra, salidas por producción y ajustes autorizados.',
    realRoute: '/produccion/kardex',
    realRouteLabel: 'Ir a Kardex de Inventario',
    steps: [
      {
        title: 'Entender la inmutabilidad del Kardex',
        description: 'Todo movimiento de entrada, salida o merma genera un sello de tiempo inalterable con usuario responsable y tipo de movimiento.',
        tip: 'El Kardex de Quimicorp se actualiza en vivo mediante WebSockets sin necesidad de recargar la página del navegador.'
      },
      {
        title: 'Filtrar por insumo, categoría o fecha',
        description: 'Usa los filtros de Materia Prima Base, Fragancias, Envases y Embalaje para auditar existencias físicas vs saldos contables.',
      },
      {
        title: 'Detectar mermas o diferencias de inventario',
        description: 'Si al realizar conteo físico en estantería hay discrepancia, se reporta a Administración para que genere un ajuste formal con documento de referencia.'
      }
    ],
    simulation: {
      actionName: 'Simular Consulta de Saldo en Kardex',
      endpoint: '/api/v1/kardex/movimientos?insumoId=BAS-001',
      method: 'GET',
      samplePayload: { insumoSku: 'BAS-001', rango: 'MES_ACTUAL' },
      sampleResponse: {
        insumo: 'EMULSION DE SILICONA 60%',
        saldoInicial: 540.0,
        entradasTotal: 250.0,
        salidasProduccion: 179.375,
        saldoFinalActual: 610.625,
        unidadMedida: 'KG',
        ultimoMovimiento: 'CONSUMO_PRODUCCION - LOT-2026-088'
      },
      explanation: 'Muestra el historial completo de entradas y salidas de materia prima asociadas a cada orden de producción.'
    }
  },
  {
    id: 'etiquetas-despacho',
    title: '6. Impresión de Etiquetas Térmicas con QR',
    icon: Tag,
    category: 'LOGISTICA',
    duration: '2 min',
    description: 'Generación e impresión de etiquetas industriales para galoneras, bidones y baldes con código de lote y vencimiento.',
    realRoute: '/produccion/etiquetas',
    realRouteLabel: 'Ir al Módulo de Etiquetas',
    steps: [
      {
        title: 'Seleccionar lote liberado por QA',
        description: 'Solo los lotes en estado "APROBADO" están disponibles para generar etiquetas industriales.',
      },
      {
        title: 'Elegir formato de envase y cantidad de etiquetas',
        description: 'Selecciona si el envase es Galonera (4 L), Balde (20 L) o Bidón (120 L). Ingresa el número de unidades producidas.',
        tip: 'Las etiquetas incluyen código QR que permite a los clientes y transportistas verificar la autenticidad y lote del producto desde el celular.'
      },
      {
        title: 'Mandar a imprimir a impresora térmica',
        description: 'Pulsa "Imprimir Etiquetas". El sistema abrirá la vista de impresión configurada a 100 mm x 150 mm (o tamaño estándar industrial).'
      }
    ],
    simulation: {
      actionName: 'Simular Generación de Etiquetas con QR',
      endpoint: '/api/v1/produccion/etiquetas/generar',
      method: 'POST',
      samplePayload: {
        codigoLote: 'LOT-2026-088',
        productoNombre: 'SILICONA EMULSIONADA INDUSTRIAL',
        presentacion: 'GALONERA 4L',
        cantidadEtiquetas: 25,
        fechaVencimiento: '2028-09-09'
      },
      sampleResponse: {
        totalEtiquetasGeneradas: 25,
        formato: 'TERMAL_100x150MM',
        qrDataUrl: 'https://erp.quimicorp.com/validar-lote/LOT-2026-088',
        estado: 'LISTO_PARA_IMPRESION'
      },
      explanation: 'Genera las plantillas de impresión con lote, fecha de elaboración, vencimiento a 2 años y código QR oficial.'
    }
  },
  {
    id: 'biometria-turnos',
    title: '7. Biometría & Turnos del Personal',
    icon: Clock,
    category: 'PERSONAL',
    duration: '2 min',
    description: 'Registro de marcaciones de ingreso, salida, refrigerio y descansos del personal de planta.',
    realRoute: '/produccion/biometria',
    realRouteLabel: 'Ir a Biometría & Turnos',
    steps: [
      {
        title: 'Marcación de ingreso con DNI o código biométrico',
        description: 'Al iniciar la jornada, el operario digita su DNI o escanea su huella digital en el terminal de planta.',
      },
      {
        title: 'Pausa para almuerzo y refrigerio',
        description: 'El sistema valida automáticamente el rango de horario asignado para el turno (ej. 13:00 - 14:00) y registra el tiempo de descanso.',
      },
      {
        title: 'Marcación de salida al culminar turno',
        description: 'Al terminar la jornada se registra la salida, calculando las horas efectivas trabajadas para el cálculo de planilla en Administración.'
      }
    ],
    simulation: {
      actionName: 'Simular Marcación de Asistencia de Planta',
      endpoint: '/api/v1/asistencia/marcaciones',
      method: 'POST',
      samplePayload: {
        dni: '72345678',
        tipoMarcacion: 'ENTRADA',
        dispositivo: 'TERMINAL-PLANTA-01',
        timestamp: new Date().toISOString()
      },
      sampleResponse: {
        ok: true,
        colaborador: 'Carlos Mendoza Ramos',
        cargo: 'OPERARIO DE PRODUCCION',
        turno: 'TURNO MANANA (08:00 - 17:00)',
        estadoAsistencia: 'PUNTUAL',
        minutosTardanza: 0
      },
      explanation: 'Registra la hora exacta de ingreso del personal y valida el estado según las tolerancias configuradas.'
    }
  }
];

export default function ManualProduccionPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [selectedTopicId, setSelectedTopicId] = useState<string>(PRODUCCION_TOPICS[0].id);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('TODAS');
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [simulationResult, setSimulationResult] = useState<any>(null);
  const [copiedPayload, setCopiedPayload] = useState(false);

  // Filtrado de tópicos por búsqueda y categoría
  const filteredTopics = useMemo(() => {
    return PRODUCCION_TOPICS.filter(t => {
      const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase());
      const matchCategory = filterCategory === 'TODAS' || t.category === filterCategory;
      return matchSearch && matchCategory;
    });
  }, [search, filterCategory]);

  const activeTopic = useMemo(() => {
    return PRODUCCION_TOPICS.find(t => t.id === selectedTopicId) || PRODUCCION_TOPICS[0];
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
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 text-emerald-400 shadow-lg shadow-emerald-500/5">
              <BookOpen className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black tracking-tight">Manual Interactivo de Planta & Almacén</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Operación Industrial
                </span>
              </div>
              <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Guía interactiva paso a paso con simuladores en vivo tipo Swagger, recetas, trazabilidad y protocolos oficiales.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/produccion/kardex"
              className={`px-3.5 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
                isDark ? 'border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span>Ir al Kardex</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/produccion/pedidos"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
            >
              <span>Pedidos de Planta</span>
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
            placeholder="Buscar por procedimiento, fórmula, ajuste fino, lote o etiqueta..."
            className={`w-full pl-9 pr-3 py-2 rounded-xl border text-xs outline-none transition-all ${
              isDark ? 'bg-[#151D2A] border-[#1A2232] text-white focus:border-emerald-500/50' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-600'
            }`}
          />
        </div>

        <div className="flex items-center gap-2">
          {['TODAS', 'OPERACION', 'CALIDAD', 'LOGISTICA', 'PERSONAL'].map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-wider transition-all ${
                filterCategory === cat
                  ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 shadow-sm'
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

      {/* Grid Principal: Menú de Tópicos (Izquierda) + Contenido Interactivo y Simulador (Derecha) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Columna Izquierda: Lista de Módulos Operativos */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className={`text-[10px] font-black uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Módulos del Manual ({filteredTopics.length})
            </span>
            <span className="text-[10px] font-mono text-emerald-400">Paso a paso guiado</span>
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
                        ? 'bg-emerald-500/10 border-emerald-500/40 shadow-lg shadow-emerald-500/5'
                        : 'bg-emerald-50 border-emerald-300 shadow-sm'
                      : isDark
                      ? 'bg-[#0F141C] border-[#1A2232] hover:border-slate-700'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-emerald-500 text-slate-950 font-bold'
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
                          ? isDark ? 'text-emerald-300' : 'text-emerald-800'
                          : isDark ? 'text-slate-200' : 'text-slate-800'
                      }`}>
                        {topic.title}
                      </span>
                      {isAllDone && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      )}
                    </div>
                    <p className={`text-[11px] line-clamp-1 mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {topic.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-[10px] font-mono">
                      <span className={`px-1.5 py-0.5 rounded ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'}`}>
                        {topic.duration}
                      </span>
                      <span className={`${completedInTopic === topic.steps.length ? 'text-emerald-400 font-bold' : isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        {completedInTopic}/{topic.steps.length} pasos listos
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Columna Derecha: Detalle del Procedimiento + Simulador Tipo Swagger */}
        <div className="lg:col-span-8 space-y-6">
          {/* Card de Procedimiento Activo */}
          <div className={`p-6 rounded-2xl border space-y-6 ${isDark ? 'bg-[#0F141C] border-[#1A2232]' : 'bg-white border-slate-200 shadow-sm'}`}>
            {/* Header del Tema */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-dashed border-slate-700/50">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
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
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shrink-0 shadow-md shadow-emerald-600/20"
              >
                <span>{activeTopic.realRouteLabel}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Barra de Progreso del Tema */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-slate-400">Progreso del procedimiento</span>
                <span className="font-mono font-bold text-emerald-400">{topicProgressPct}% completado</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
                  style={{ width: `${topicProgressPct}%` }}
                />
              </div>
            </div>

            {/* Lista Interactiva de Pasos con Checkbox */}
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                Pasos a Seguir en Planta:
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
                            ? 'bg-emerald-500/5 border-emerald-500/30'
                            : 'bg-emerald-50/70 border-emerald-200'
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
                              ? 'bg-emerald-500 text-slate-950'
                              : isDark
                              ? 'border border-slate-600 text-transparent hover:border-emerald-400'
                              : 'border border-slate-400 text-transparent hover:border-emerald-600'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>

                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-black text-emerald-400">Paso {idx + 1}.</span>
                            <span className={`text-xs font-bold ${isDone ? 'line-through opacity-75' : ''}`}>
                              {step.title}
                            </span>
                          </div>

                          <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                            {step.description}
                          </p>

                          {step.tip && (
                            <div className="mt-2 p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[11px] flex items-start gap-2">
                              <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                              <span><strong>Consejo Operativo:</strong> {step.tip}</span>
                            </div>
                          )}

                          {step.warning && (
                            <div className="mt-2 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] flex items-start gap-2">
                              <ShieldAlert className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                              <span><strong>Atención Crítica:</strong> {step.warning}</span>
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

          {/* SIMULADOR INTERACTIVO TIPO SWAGGER ("Try It Out" Operativo) */}
          <div className={`p-6 rounded-2xl border space-y-4 ${isDark ? 'bg-[#0F141C] border-[#1A2232]' : 'bg-white border-slate-200 shadow-sm'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-400">
                  <Terminal className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider">Simulador de Acción en Vivo (Try it out)</h3>
                  <p className="text-[11px] text-slate-400">Prueba cómo responde el ERP ante esta acción sin alterar los datos reales.</p>
                </div>
              </div>

              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/40">
                Modo Simulación
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
                className="px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-purple-600/20 disabled:opacity-50 transition-all"
              >
                <Play className={`w-3.5 h-3.5 ${simulationRunning ? 'animate-spin' : ''}`} />
                <span>{simulationRunning ? 'Ejecutando...' : '▶️ Ejecutar Prueba'}</span>
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
                  <span className="text-slate-400">Datos Enviados (Request Payload):</span>
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(activeTopic.simulation.samplePayload, null, 2))}
                    className="text-slate-400 hover:text-white flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedPayload ? 'Copiado' : 'Copiar'}</span>
                  </button>
                </div>
                <pre className={`p-3 rounded-xl border text-[11px] font-mono overflow-x-auto max-h-48 leading-tight ${
                  isDark ? 'bg-[#090C10] border-slate-800 text-emerald-400' : 'bg-slate-900 text-emerald-400'
                }`}>
                  {JSON.stringify(activeTopic.simulation.samplePayload, null, 2)}
                </pre>
              </div>

              {/* Respuesta del Servidor */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-400">Respuesta del Sistema (Response 200 OK):</span>
                  {simulationResult && (
                    <span className="text-emerald-400 font-bold">✓ 200 OK (Simulado)</span>
                  )}
                </div>
                <pre className={`p-3 rounded-xl border text-[11px] font-mono overflow-x-auto max-h-48 leading-tight ${
                  simulationResult
                    ? isDark ? 'bg-[#090C10] border-emerald-500/40 text-cyan-300' : 'bg-slate-900 text-cyan-300'
                    : isDark ? 'bg-[#090C10] border-slate-800 text-slate-500' : 'bg-slate-900 text-slate-400'
                }`}>
                  {simulationResult
                    ? JSON.stringify(simulationResult, null, 2)
                    : '// Presiona "▶️ Ejecutar Prueba" para ver la respuesta simulada en tiempo real.'}
                </pre>
              </div>
            </div>
          </div>

          {/* Preguntas Frecuentes y Qué Hacer en Caso de Emergencia */}
          <div className={`p-6 rounded-2xl border space-y-3 ${isDark ? 'bg-[#0F141C] border-[#1A2232]' : 'bg-white border-slate-200'}`}>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              Preguntas Frecuentes & Qué hacer si...
            </h3>

            <div className="space-y-2 text-xs">
              <details className={`p-3 rounded-xl border ${isDark ? 'bg-[#151D2A] border-[#1A2232]' : 'bg-slate-50 border-slate-200'}`}>
                <summary className="font-bold cursor-pointer text-emerald-400">¿Qué hago si la mezcla se corta o no emulsiona?</summary>
                <p className="mt-2 text-slate-300 leading-relaxed">
                  Detén inmediatamente la agitación. No agregues más agua. Notifica al supervisor de QA para verificar la temperatura de la tina y dosificar una solución correctora de emulsión sin desechar el lote.
                </p>
              </details>

              <details className={`p-3 rounded-xl border ${isDark ? 'bg-[#151D2A] border-[#1A2232]' : 'bg-slate-50 border-slate-200'}`}>
                <summary className="font-bold cursor-pointer text-emerald-400">¿Cómo reporto un insumo derramado o merma física?</summary>
                <p className="mt-2 text-slate-300 leading-relaxed">
                  Ingresa a Kardex de Inventario y reporta la cantidad como MERMA OPERATIVA indicando el motivo para que el stock real en el sistema coincida siempre con el estante físico.
                </p>
              </details>

              <details className={`p-3 rounded-xl border ${isDark ? 'bg-[#151D2A] border-[#1A2232]' : 'bg-slate-50 border-slate-200'}`}>
                <summary className="font-bold cursor-pointer text-emerald-400">¿Qué pasa si una etiqueta sale borrosa en la impresora térmica?</summary>
                <p className="mt-2 text-slate-300 leading-relaxed">
                  Limpia el cabezal térmico con alcohol isopropílico al 99% y verifica que el rollo esté alineado al sensor central. Vuelve a imprimir desde el módulo de etiquetas sin alterar el lote original.
                </p>
              </details>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
