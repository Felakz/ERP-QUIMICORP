'use client';

import React, { useState, useEffect, useMemo } from 'react';
import QRCode from 'qrcode';
import {
  Printer,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  Check,
  Building2,
  User,
  Package,
  AlertOctagon,
  FileCheck,
  Edit3,
  Barcode,
  RefreshCw,
  Sparkles,
  Scale,
  FileText,
  Eye,
  Info,
  Layers,
  Flame,
  ShieldAlert,
  Zap,
  Save,
  X,
  Plus,
  Sliders,
  Calendar,
  Download,
  Loader2,
} from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';
import { apiFetch } from '@/lib/apiClient';
import { ModalFichaTecnicaInsumos, FichaTecnicaData } from '@/components/produccion/ModalFichaTecnicaInsumos';

export interface EnvaseDisponible {
  id: string;
  codigo: string;
  nombre: string;
  stockReal: number;
  unidadMedida: string;
}

export interface PedidoEtiquetaItem {
  id: string;
  idPedido: string;
  numeroPedido: string;
  codigoLote: string;
  colaId?: string;
  numeroGuia?: string;
  nombreProducto: string;
  clienteNombre: string;
  clienteRuc: string;
  cantidadKilosDisplay: string;
  contenidoNetoKg: number;
  unidadesPedidas: number;
  sku: string;
  fechaFab: string;
  fechaVenc: string;
  codigoBarras: string;
  ruc: string;
  advertenciaGHS: string;
  codigoGHS: 'GHS07' | 'GHS05' | 'GHS02' | 'GHS09';
  tipoPeligro: string;
  aprobadoQA: boolean;
  estadoImpresion: string;
  // Metrología por pedido
  tipoEnvase: string;
  taraGramos: number;
  envaseSku?: string;
  // Parámetros QA
  phMedido: number;
  phRango: string;
  viscosidadMedida: string;
  densidadMedida: string;
  aspecto: string;
  color: string;
  olor: string;
  // Insumos de la Receta del Pedido
  insumos: Array<{
    nombre: string;
    funcion: string;
    porcentaje: number;
    pesoDosificadoKg: number;
    tipo: 'ACTIVO' | 'BASE' | 'ADITIVO' | 'FRAGANCIA' | 'CONSERVANTE';
  }>;
}

export default function EtiquetasDespachoPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Tabs superiores
  const [activeTab, setActiveTab] = useState<'ETIQUETA' | 'DESPACHO'>('ETIQUETA');

  // Pedidos Reales de Producción
  const [pedidosCola, setPedidosCola] = useState<PedidoEtiquetaItem[]>([]);
  const [envases, setEnvases] = useState<EnvaseDisponible[]>([]);

  const [selectedPedidoId, setSelectedPedidoId] = useState<string>('');
  const [showManualDrawer, setShowManualDrawer] = useState<boolean>(false);
  const [showFichaModal, setShowFichaModal] = useState<boolean>(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  // Estados de Despacho
  const [destino, setDestino] = useState<string>('Almacén Central Despachos');
  const [responsable, setResponsable] = useState<string>('');
  const [numeroGuia, setNumeroGuia] = useState<string>('');
  const [despachando, setDespachando] = useState<boolean>(false);
  const [backendConectado, setBackendConectado] = useState<boolean>(false);
  // Envases secundarios (hasta 5 tipos, despacho)
  const [envasesSecundarios, setEnvasesSecundarios] = useState<Array<{ sku: string; cantidad: number }>>([]);
  // Envase provisto por el cliente (no se descuenta del stock interno)
  const [envaseCliente, setEnvaseCliente] = useState<boolean>(false);
  const [tipoEnvaseCliente, setTipoEnvaseCliente] = useState<string>('STICK');
  const [otroEnvaseCliente, setOtroEnvaseCliente] = useState<string>('');
  // Bultos: edición local para no trabar el input controlado por pedidoActivo
  const [bultosInput, setBultosInput] = useState<string>('1');
  // Sticks: pedido en KG pero despacho/etiqueta en UN
  const [gramosPorStick, setGramosPorStick] = useState<number>(0);

  // Cargar la cola de despacho REAL desde el backend y fusionarla con la vista
  useEffect(() => {
    let activo = true;
    const cargarCola = async () => {
      try {
        const { data, ok } = await apiFetch<any>('/produccion/etiquetas/cola');
        if (activo && ok && Array.isArray(data) && data.length > 0) {
          setBackendConectado(true);
          const reales: PedidoEtiquetaItem[] = data
            .filter((c: any) => c && (c.loteCodigo || c.id) && (c.estado === 'LISTO_PARA_IMPRIMIR' || !c.estado))
            .map((c: any) => {
              const cantidadStr = c.cantidad ? String(c.cantidad) : '';
              const kilosMatch = cantidadStr.match(/([\d.,]+)/);
              const valor = kilosMatch ? parseFloat(kilosMatch[1].replace(',', '.')) : 20;
              // KG/L: el peso real viene de balanza (ajuste manual), no por densidad
              const contenido = valor;
              return {
                id: `cola-${c.id}`,
                colaId: c.id,
                idPedido: (c.loteCodigo || c.id || 'PED').replace(/[^A-Za-z0-9-]/g, '').slice(0, 14) || 'PED-REAL',
                numeroPedido: (c.loteCodigo || c.id || 'ORD').replace(/[^0-9]/g, '').slice(-6) || '000001',
                codigoLote: c.loteCodigo || c.id,
                numeroGuia: c.numeroGuia || '',
                nombreProducto: c.productoNombre || 'PRODUCTO QUIMICORP',
                clienteNombre: c.clienteNombre || 'CLIENTE',
                clienteRuc: '',
                cantidadKilosDisplay: cantidadStr || '— ',
                contenidoNetoKg: contenido,
                unidadesPedidas: kilosMatch ? Math.max(1, parseInt(kilosMatch[1], 10)) : 1,
                sku: 'QRM-REAL-001',
                fechaFab: new Date(c.fechaFabricacion || c.createdAt).toISOString().split('T')[0],
                fechaVenc: '',
                codigoBarras: c.codigoBarras || '',
                ruc: c.ruc || '20612434124',
                advertenciaGHS: c.advertenciaGHS || '',
                codigoGHS: (c.codigoGHS as PedidoEtiquetaItem['codigoGHS']) || 'GHS07',
                tipoPeligro: c.tipoPeligro || 'Clasificación pendiente',
                aprobadoQA: true,
                estadoImpresion: c.estado || 'LISTO_PARA_IMPRIMIR',
                tipoEnvase: c.tipoEnvase || 'Envase estándar',
                taraGramos: c.taraGramos || 0,
                envaseSku: c.envaseSku || 'ENV-001',
                phMedido: 6.5,
                phRango: '6.0 - 7.0',
                viscosidadMedida: '—',
                densidadMedida: '—',
                aspecto: 'Según especificación del lote',
                color: 'Según producto',
                olor: 'Característico',
                insumos: [],
              };
            });

          setPedidosCola(reales);
        }
      } catch {
        // Silencio: la cola cargará desde el backend; sin datos no hay cola que mostrar
      }
    };
    cargarCola();
    return () => {
      activo = false;
    };
  }, []);

  // Cargar los envases reales del maestro de insumos (tipo ENVASE) para asociar el despacho
  const cargarEnvases = React.useCallback(async () => {
    try {
      const { data, ok } = await apiFetch<any[]>('/inventario/insumos?tipo=ENVASE');
      if (ok && Array.isArray(data)) {
        const list = data
          .filter((e: any) => e && e.codigo)
          .map((e: any) => ({
            id: e.id,
            codigo: e.codigo,
            nombre: e.nombre,
            stockReal: Number(e.stockReal ?? 0),
            unidadMedida: e.unidadMedida || 'UN',
          }));
        setEnvases(list);
        if (list.length === 0) {
          setEnvases([
            { id: '', codigo: 'ENV-001', nombre: 'BALDE DE 20 LITROS CON TAPA', stockReal: 0, unidadMedida: 'UN' },
            { id: '', codigo: 'ENV-002', nombre: 'GALONERA / BIDON DE 120 LITROS', stockReal: 0, unidadMedida: 'UN' },
          ]);
        }
      }
    } catch {
      // Sin envases en backend: se usan los valores por defecto del maestro
    }
  }, []);

  useEffect(() => {
    cargarEnvases();
  }, [cargarEnvases]);

  // Pedido Actual
  const pedidoActivo = useMemo(() => {
    return pedidosCola.find((p) => p.id === selectedPedidoId) || pedidosCola[0];
  }, [pedidosCola, selectedPedidoId]);

  // Envase efectivo del pedido (seleccionado o primer envase del maestro)
  const envaseActivo = useMemo(() => {
    return envases.find((e) => e.codigo === pedidoActivo?.envaseSku) || envases[0];
  }, [envases, pedidoActivo]);

  // Envases secundarios resueltos (distintos al principal)
  const secundariosResueltos = useMemo(() => {
    return envasesSecundarios
      .map((s) => envases.find((e) => e.codigo === s.sku))
      .filter(Boolean) as EnvaseDisponible[];
  }, [envases, envasesSecundarios]);

  // Cálculos Metrológicos Dinámicos por Pedido — KG/L validado (peso real de balanza)
  const taraKg = (pedidoActivo?.taraGramos ?? 985) / 1000;
  const contenidoNeto = pedidoActivo?.contenidoNetoKg ?? 19.014;
  const pesoBrutoTotalKg = contenidoNeto + taraKg;
  const cantidadDisplay = pedidoActivo?.cantidadKilosDisplay || '';
  const esLitros = /LITRO/i.test(cantidadDisplay);
  const litrosMatch = cantidadDisplay.match(/([\d.,]+)/);
  const litrosValor = esLitros && litrosMatch ? parseFloat(litrosMatch[1].replace(',', '.')) : null;
  const netoMl = litrosValor !== null ? Math.round(litrosValor * 1000) : null;
  const sticksUnidades = gramosPorStick > 0 ? Math.round((contenidoNeto * 1000) / gramosPorStick) : null;

  // Generador de QR Real 100% Escaneable
  useEffect(() => {
    const generateRealQR = async () => {
      if (!pedidoActivo) return;
      try {
        const qrPayload = JSON.stringify({
          empresa: 'QUIMICORP PERU S.A.C.',
          ruc: pedidoActivo.ruc || '20612434124',
          pedido: pedidoActivo.idPedido,
          orden: pedidoActivo.numeroPedido,
          lote: pedidoActivo.codigoLote,
          producto: pedidoActivo.nombreProducto,
          cliente: pedidoActivo.clienteNombre,
          pesoNeto: `${contenidoNeto.toFixed(3)} KG`,
          pesoBruto: `${pesoBrutoTotalKg.toFixed(3)} KG`,
          tara: `${pedidoActivo.taraGramos} G`,
          fechaFab: pedidoActivo.fechaFab,
          fechaVenc: pedidoActivo.fechaVenc,
          estadoQA: 'LIBERADO_CONFORME',
          verificarURL: `${window.location.origin}/trazabilidad/pedido/${pedidoActivo.idPedido}`,
        }, null, 2);

        const url = await QRCode.toDataURL(qrPayload, {
          width: 280,
          margin: 1,
          color: {
            dark: '#000000',
            light: '#FFFFFF',
          },
          errorCorrectionLevel: 'M',
        });
        setQrDataUrl(url);
      } catch (err) {
        console.error('Error generando QR real:', err);
      }
    };

    generateRealQR();
  }, [pedidoActivo, contenidoNeto, pesoBrutoTotalKg]);

  // Actualizar campos del pedido activo (Ajuste Manual con persistencia)
  const handleUpdatePedidoField = (field: keyof PedidoEtiquetaItem, value: any) => {
    setPedidosCola((prev) =>
      prev.map((p) => (p.id === selectedPedidoId ? { ...p, [field]: value } : p))
    );
  };

  const handleImprimir = () => {
    const etiquetaElement = document.getElementById('etiqueta-hightech-industrial');
    if (!etiquetaElement) {
      window.print();
      return;
    }

    // Crear iframe invisible para impresión limpia y aislada de solo la etiqueta
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

    const etiquetaHtml = etiquetaElement.outerHTML;

    const compiledStyles = Array.from(document.querySelectorAll('style'))
      .map((s) => s.innerHTML)
      .join('\\n');
    const linkedCss = Array.from(document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]'))
      .map((l) => l.href)
      .map((href) => `<link rel="stylesheet" href="${href}" />`)
      .join('\\n');

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Etiqueta - ${pedidoActivo.codigoLote} - ${pedidoActivo.nombreProducto}</title>
          <meta charset="utf-8" />
          ${linkedCss}
          <style>${compiledStyles}</style>
          <style>
            @page {
              size: 100mm 150mm;
              margin: 0;
            }
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              box-sizing: border-box;
            }
            body {
              margin: 0;
              padding: 6mm;
              display: flex;
              align-items: center;
              justify-content: center;
              background: #ffffff;
              min-height: 100vh;
              font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
            }
            #etiqueta-hightech-industrial {
              width: 100% !important;
              max-width: 96mm !important;
              margin: 0 auto !important;
              box-shadow: none !important;
              border: 1.5px solid #1A2232 !important;
              background: #090C10 !important;
              color: #f8fafc !important;
              page-break-inside: avoid;
              border-radius: 12px;
            }
          </style>
        </head>
        <body>
          ${etiquetaHtml}
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.focus();
                window.print();
                setTimeout(function() {
                  window.frameElement.remove();
                }, 500);
              }, 300);
            };
          </script>
        </body>
      </html>
    `);
    doc.close();
  };

  // Sincronizar el número de guía con el pedido activo seleccionado
  useEffect(() => {
    const g = pedidoActivo?.numeroGuia || '';
    setNumeroGuia(g);
  }, [pedidoActivo?.id]);
  // Sincronizar bultosInput con el pedido activo seleccionado
  useEffect(() => {
    setBultosInput(String(pedidoActivo?.unidadesPedidas ?? 1));
  }, [pedidoActivo?.id]);
  useEffect(() => {
    // si cambia por otra vía, reflejar sin perder foco mientras se escribe
    if (document.activeElement?.getAttribute('data-bultos-input') !== '1') {
      setBultosInput(String(pedidoActivo?.unidadesPedidas ?? 1));
    }
  }, [pedidoActivo?.unidadesPedidas]);
  const commitBultos = (valor: string) => {
    const n = Math.max(1, parseInt(valor, 10) || 1);
    setBultosInput(String(n));
    handleUpdatePedidoField('unidadesPedidas', n);
  };
  const guardarGuiaLocal = (valor: string) => {
    setNumeroGuia(valor);
    handleUpdatePedidoField('numeroGuia', valor);
  };

  // Generador ZPL real para impresora Zebra ZT411 (4 x 6 pulgadas) — KG/L validado
  const generarZPL = () => {
    const p = pedidoActivo;
    const netoTotal = (contenidoNeto * p.unidadesPedidas).toFixed(3);
    const brutoTotal = (pesoBrutoTotalKg * p.unidadesPedidas).toFixed(3);
    const tara = (p.taraGramos / 1000).toFixed(3);
    const guia = numeroGuia || p.numeroGuia || 'S/N';
    const cantDisplay = p.cantidadKilosDisplay || `${netoTotal} KG`;
    const esLitrosZpl = /LITRO/i.test(cantDisplay);
    const src: string[] = [];
    src.push(`^XA`);
    src.push(`^CI28`);
    src.push(`^PW812^LL1218^LS0`);
    src.push(`^FO40,40^GB732,6^FS`);
    src.push(`^FO40,56^A0N,34,34^FDQUIMICORP PERU S.A.C.^FS`);
    src.push(`^FO40,96^A0N,24,24^FDRUC ${pedidoActivo.ruc || '20612434124'}  /  GUIA: ${guia}^FS`);
    src.push(`^FO40,136^A0N,28,28^FDPRODUCTO: ${p.nombreProducto}^FS`);
    src.push(`^FO40,176^A0N,24,24^FDCLIENTE: ${p.clienteNombre}^FS`);
    src.push(`^FO40,212^A0N,24,24^FDLOTE: ${p.codigoLote}  /  PEDIDO: ${p.idPedido}^FS`);
    src.push(`^FO40,248^A0N,24,24^FDF. FAB: ${p.fechaFab}  F. VENC: ${p.fechaVenc || '-'}^FS`);
    src.push(`^FO40,284^GB732,2^FS`);
    // KG/L: si es litros, ZPL muestra ambos (ej. 14.555 kg = 16.000ml)
    if (esLitrosZpl && netoMl !== null) {
      src.push(`^FO40,300^A0N,26,26^FDCONTENIDO NETO: ${netoTotal} KG = (${(netoMl * p.unidadesPedidas).toLocaleString()}ml)^FS`);
    } else {
      src.push(`^FO40,300^A0N,26,26^FDCONTENIDO NETO: ${netoTotal} KG^FS`);
    }
    src.push(`^FO40,336^A0N,26,26^FDPESO BRUTO TOTAL: ${brutoTotal} KG  (TARA ${tara} KG)^FS`);
    src.push(`^FO40,376^A0N,22,22^FDCANT.: ${cantDisplay}  /  BULTOS: ${p.unidadesPedidas}  /  RESPONSABLE: ${responsable}^FS`);
    src.push(`^FO40,420^A0N,20,20^FD${(p.advertenciaGHS || '').toUpperCase()}^FS`);
    src.push(`^FO40,490^BQN,2,5^FDQA,${p.idPedido} ${p.nombreProducto} ${p.codigoLote}^FS`);
    src.push(`^FO40,660^A0N,18,18^FD ${window.location.hostname}  |  ERP QUIMICORP - ETIQUETA INDUSTRIAL^FS`);
    src.push(`^XZ`);
    return src.join('\n');
  };

  const descargarZPL = () => {
    const zpl = generarZPL();
    const blob = new Blob([zpl], { type: 'application/zpl' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `etiqueta_${pedidoActivo.codigoLote.replace(/[^A-Za-z0-9]/g, '_')}.zpl`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleConfirmarDespacho = async () => {
    const p = pedidoActivo;
    if (!p || !p.colaId) {
      alert('Este lote no pertenece a la cola de despacho real del backend. Registre el lote en producción para poder despacharlo.');
      return;
    }
    // Asegurar que bultos editados se apliquen aunque no se haya hecho blur
    const bultosVal = Math.max(1, parseInt(bultosInput, 10) || Number(p.unidadesPedidas) || 1);
    if (String(bultosVal) !== String(p.unidadesPedidas)) {
      handleUpdatePedidoField('unidadesPedidas', bultosVal);
    }

    // Validar que secundarios no repitan el principal
    const secundariosInvalidos = envasesSecundarios.filter((s) => s.sku === envaseActivo?.codigo);
    if (secundariosInvalidos.length > 0) {
      alert('Los envases secundarios deben ser diferentes al principal.');
      return;
    }
    // Validar duplicados entre secundarios
    const skus = envasesSecundarios.map((s) => s.sku).filter(Boolean);
    if (new Set(skus).size !== skus.length) {
      alert('No repitas el mismo envase secundario.');
      return;
    }

    setDespachando(true);
    try {
      const payload: Record<string, any> = {
        colaId: p.colaId,
        numeroGuia: numeroGuia?.trim() || p.numeroGuia || null,
      };

      if (envaseCliente) {
        // Envase provisto por el cliente: NO se descuenta del stock interno.
        payload.envaseCliente = true;
        payload.tipoEnvaseCliente =
          (tipoEnvaseCliente === 'OTRO' && otroEnvaseCliente.trim())
            ? otroEnvaseCliente.trim()
            : (tipoEnvaseCliente === 'OTRO' ? 'ENVASE PROVISTO POR CLIENTE' : tipoEnvaseCliente.trim());
        payload.envaseClienteCantidad = bultosVal;
        // Cliente trae X + ofrecemos Y extra (secundarios con origen INVENTARIO)
        if (envasesSecundarios.length > 0) {
          payload.envasesSecundarios = envasesSecundarios.map((s) => ({ sku: s.sku, cantidad: Number(s.cantidad) || 1 }));
        }
      } else {
        payload.envaseSku = envaseActivo?.codigo || p.envaseSku || 'ENV-001';
        payload.envaseCantidad = bultosVal;
        if (envasesSecundarios.length > 0) {
          payload.envasesSecundarios = envasesSecundarios.map((s) => ({ sku: s.sku, cantidad: Number(s.cantidad) || 1 }));
          // Compatibilidad con campo legacy (primer secundario)
          payload.envaseSku2 = envasesSecundarios[0].sku;
          payload.envaseCantidad2 = Number(envasesSecundarios[0].cantidad) || 1;
        }
      }

      const { ok, error, data } = await apiFetch<any>('/produccion/etiquetas/despachar', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (!ok) {
        throw new Error(error || 'Error al registrar el despacho.');
      }

      let envaseInfo = '';
      if (data?.envaseCliente) {
        envaseInfo = `\n\nEnvase provisto por el cliente:\n• ${data.envaseCliente.tipo} x${data.envaseCliente.cantidad} — sin descuento de stock interno`;
      } else {
        const envaseLista: Array<{ sku: string; nombre: string; cantidad: number; saldo: number }> =
          Array.isArray(data?.envaseDescontado) ? data.envaseDescontado : data?.envaseDescontado ? [data.envaseDescontado] : [];
        envaseInfo = envaseLista.length
          ? '\n\nEnvases descontados:\n' + envaseLista.map((e) => `• ${e.sku} — ${e.nombre}: -${e.cantidad} (stock: ${e.saldo})`).join('\n')
          : '';
      }

      // Sacar de la cola de Etiquetas (solo quedan LISTO_PARA_IMPRIMIR) — queda en historial del cliente como ENTREGADO
      setPedidosCola((prev) => prev.filter((it) => it.id !== p.id));
      setSelectedPedidoId((curr) => {
        if (curr === p.id) {
          const restantes = pedidosCola.filter((it) => it.id !== p.id);
          return restantes[0]?.id || '';
        }
        return curr;
      });
      cargarEnvases();
      setEnvasesSecundarios([]);
      setEnvaseCliente(false);
      setTipoEnvaseCliente('STICK');

      alert(
        `DESPACHO REGISTRADO\n\n` +
          `• Pedido: ${p.idPedido} (${p.numeroPedido})\n` +
          `• Cliente: ${p.clienteNombre}\n` +
          `• Producto: ${p.nombreProducto}\n` +
          `• Lote: ${p.codigoLote}\n` +
          `• Guia: ${numeroGuia?.trim() || 'S/N'}\n` +
          `• Bultos: ${p.unidadesPedidas} (${p.cantidadKilosDisplay})\n` +
          `• Peso Neto Total: ${(contenidoNeto * p.unidadesPedidas).toFixed(3)} kg\n` +
          `• Peso Bruto Total: ${(pesoBrutoTotalKg * p.unidadesPedidas).toFixed(3)} kg\n` +
          `• Destino: ${destino}\n` +
          `• Responsable: ${responsable}` +
          envaseInfo +
          `\n\nEstado actualizado en todo el sistema.`
      );
    } catch (err: any) {
      alert(`No se pudo registrar el despacho: ${err.message || 'Error de conexion'}`);
    } finally {
      setDespachando(false);
    }
  };

  const cardBg = isDark ? 'bg-[#0F141C] border-[#1A2232]' : 'bg-white border-slate-200 shadow-sm';
  const textTitle = isDark ? 'text-slate-400' : 'text-slate-600';
  const textValue = isDark ? 'text-white' : 'text-slate-900';
  const inputBg = isDark ? 'bg-[#151D2A] border-[#1A2232] text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-800';

  if (!pedidoActivo) {
    return (
      <div className="space-y-5 font-mono min-h-screen">
        <div className={`flex flex-wrap items-center justify-between gap-4 border-b pb-3 ${isDark ? 'border-[#1A2232]' : 'border-slate-200'}`}>
          <div>
            <h2 className={`text-sm font-bold tracking-widest uppercase flex items-center gap-2 ${textTitle}`}>
              <span className="text-[#00F2C3]">⬡ ETIQUETADO METROLÓGICO DINÁMICO POR PEDIDO</span>
            </h2>
            <p className="text-xs text-slate-400 font-sans">
              Cada pedido genera su propia etiqueta industrial con QR real, metrología de balanza y trazabilidad de insumos.
            </p>
          </div>
        </div>
        <div className={`rounded-2xl p-8 border text-center ${cardBg}`}>
          <Package className="w-10 h-10 mx-auto mb-3 text-slate-400" />
          <p className={`text-sm font-bold ${textTitle}`}>No hay lotes listos para imprimir</p>
          <p className={`text-xs mt-1 ${textTitle}`}>
            Los lotes aprobados por QA aparecerán aquí desde la cola de despacho del backend.
          </p>
        </div>
      </div>
    );
  }

  // Datos para Modal Ficha Técnica
  const fichaTecnicaData: FichaTecnicaData = {
    codigoLote: pedidoActivo.codigoLote,
    nombreProducto: pedidoActivo.nombreProducto,
    clienteNombre: pedidoActivo.clienteNombre,
    clienteRuc: pedidoActivo.clienteRuc,
    fechaFabricacion: pedidoActivo.fechaFab,
    fechaVencimiento: pedidoActivo.fechaVenc,
    unidades: pedidoActivo.unidadesPedidas,
    unidadMedida: 'KG',
    tipoEnvase: pedidoActivo.tipoEnvase,
    taraEnvaseGramos: pedidoActivo.taraGramos,
    contenidoNetoKg: contenidoNeto,
    pesoBrutoTotalKg: pesoBrutoTotalKg,
    phMedido: pedidoActivo.phMedido,
    phRango: pedidoActivo.phRango,
    viscosidadMedida: pedidoActivo.viscosidadMedida,
    densidadMedida: pedidoActivo.densidadMedida,
    aspecto: pedidoActivo.aspecto,
    color: pedidoActivo.color,
    olor: pedidoActivo.olor,
    insumos: pedidoActivo.insumos,
    quimicoResponsable: 'Ing. Químico QA - Planta',
    operarioPlanta: responsable,
    estadoQA: 'LIBERADO',
  };

  return (
    <div className="space-y-5 font-mono min-h-screen">
      {/* Top Header Bar */}
      <div className={`flex flex-wrap items-center justify-between gap-4 border-b pb-3 ${isDark ? 'border-[#1A2232]' : 'border-slate-200'}`}>
        <div>
          <h2 className={`text-sm font-bold tracking-widest uppercase flex items-center gap-2 ${textTitle}`}>
            <span className="text-[#00F2C3]">⬡ ETIQUETADO METROLÓGICO DINÁMICO POR PEDIDO</span>
            <span className="px-2 py-0.5 rounded bg-[#00F2C3]/10 text-[#00F2C3] border border-[#00F2C3]/30 text-[10px] font-mono font-bold">
              SINCRONIZADO EN TIEMPO REAL
            </span>
          </h2>
          <p className="text-xs text-slate-400 font-sans">
            Cada pedido genera su propia etiqueta industrial de alta tecnología con QR real escaneable, metrología de balanza y trazabilidad de insumos.
          </p>
        </div>

        <div className="flex items-center gap-3 font-sans">
          <button
            onClick={() => setShowFichaModal(true)}
            className="px-4 py-2 rounded-xl bg-[#00F2C3]/10 hover:bg-[#00F2C3]/20 text-[#00F2C3] border border-[#00F2C3]/40 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm shadow-[#00F2C3]/10"
          >
            <FileText className="w-4 h-4" />
            <span>📄 Ficha Técnica del Pedido</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Lista de Pedidos (4 cols) vs Etiqueta High-Tech & Ajuste Manual (8 cols) */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* Left Column: COLA DE PEDIDOS REALES */}
        <div className="lg:col-span-4 space-y-4">
          <div className={`rounded-2xl p-5 border space-y-3 ${cardBg}`}>
            <div className="flex items-center justify-between">
              <h3 className={`text-xs font-bold tracking-widest uppercase flex items-center gap-2 ${textTitle}`}>
                <Package className="h-4 w-4 text-[#00F2C3]" />
                <span>PEDIDOS EN COLA ({pedidosCola.length})</span>
              </h3>
            </div>

            <div className="space-y-2.5 max-h-[620px] overflow-y-auto pr-1">
              {pedidosCola.map((ped) => {
                const isSel = ped.id === selectedPedidoId;
                return (
                  <div
                    key={ped.id}
                    onClick={() => { setSelectedPedidoId(ped.id); setEnvasesSecundarios([]); }}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                      isSel
                        ? 'bg-[#00F2C3]/10 border-[#00F2C3] shadow-lg shadow-[#00F2C3]/10 ring-1 ring-[#00F2C3]/50'
                        : isDark
                        ? 'bg-[#151D2A] border-[#1A2232] hover:border-slate-700'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {isSel && (
                      <div className="absolute top-0 right-0 h-10 w-10 bg-[#00F2C3]/20 blur-md pointer-events-none" />
                    )}

                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono font-bold text-xs text-[#00F2C3]">
                        {ped.idPedido} • {ped.codigoLote}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-black bg-[#00F2C3]/20 text-[#00F2C3] border border-[#00F2C3]/40 font-mono">
                        {ped.cantidadKilosDisplay}
                      </span>
                    </div>

                    <h4 className={`text-xs font-bold mt-1.5 font-sans ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {ped.nombreProducto}
                    </h4>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 border-t pt-1.5 border-slate-800/40">
                      <span className="truncate font-semibold">Cliente: <strong className={isDark ? 'text-slate-200' : 'text-slate-800'}>{ped.clienteNombre}</strong></span>
                      <span className="font-mono text-[10px] text-emerald-400 font-bold">QA OK</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: ETIQUETA HIGH-TECH INDUSTRIAL ORIGINAL + DRAWER DE AJUSTE MANUAL */}
        <div className="lg:col-span-8 space-y-4">
          <div className={`rounded-2xl p-5 border space-y-4 ${cardBg}`}>
            {/* Header de la tarjeta */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 font-sans">
                <span className="p-1.5 rounded-lg bg-[#00F2C3]/10 text-[#00F2C3]">
                  <Printer className="w-4 h-4" />
                </span>
                <span className={`text-xs font-bold ${textValue}`}>
                  Etiqueta High-Tech Industrial · Pedido {pedidoActivo.idPedido}
                </span>
              </div>

              {/* Botón de Ajuste Manual Funcional */}
              <button
                onClick={() => setShowManualDrawer(!showManualDrawer)}
                className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold border transition-all cursor-pointer ${
                  showManualDrawer
                    ? 'bg-[#00F2C3] text-slate-950 border-[#00F2C3] shadow-md shadow-[#00F2C3]/30 font-black'
                    : isDark
                    ? 'bg-[#151D2A] text-[#00F2C3] border-[#00F2C3]/40 hover:bg-[#00F2C3]/10'
                    : 'bg-slate-100 text-teal-700 border-teal-300 hover:bg-teal-50'
                }`}
              >
                <Sliders className="h-3.5 w-3.5" />
                <span>{showManualDrawer ? 'Cerrar Ajuste' : '✏️ Ajuste Manual'}</span>
              </button>
            </div>

            {/* ========================================================================= */}
            {/* PANEL DE AJUSTE MANUAL EN VIVO (CUANDO ESTÁ ACTIVO) */}
            {/* ========================================================================= */}
            {showManualDrawer && (
              <div className={`p-4 rounded-2xl border space-y-3 animate-in fade-in duration-200 text-xs ${
                isDark ? 'bg-[#0B0F17] border-[#00F2C3]/40' : 'bg-teal-50/50 border-teal-200'
              }`}>
                <div className="flex items-center justify-between border-b pb-2 border-slate-800/40 font-sans">
                  <div className="flex items-center gap-2 text-[#00F2C3] font-bold">
                    <Edit3 className="w-4 h-4" />
                    <span>Modificar Datos de Etiqueta para este Pedido ({pedidoActivo.idPedido})</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Los cambios actualizan el QR y los pesos al instante</span>
                </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-sans">
                  <div>
                    <label className={`block text-[10px] uppercase font-bold mb-1 ${textTitle}`}>Producto</label>
                    <input
                      type="text"
                      value={pedidoActivo.nombreProducto}
                      onChange={(e) => handleUpdatePedidoField('nombreProducto', e.target.value)}
                      className={`w-full rounded-lg border p-2 text-xs font-semibold ${inputBg}`}
                    />
                  </div>

                  <div>
                    <label className={`block text-[10px] uppercase font-bold mb-1 ${textTitle}`}>Cliente / Destinatario</label>
                    <input
                      type="text"
                      value={pedidoActivo.clienteNombre}
                      onChange={(e) => handleUpdatePedidoField('clienteNombre', e.target.value)}
                      className={`w-full rounded-lg border p-2 text-xs font-semibold ${inputBg}`}
                    />
                  </div>

                  <div>
                    <label className={`block text-[10px] uppercase font-bold mb-1 ${textTitle}`}>Código de Lote</label>
                    <input
                      type="text"
                      value={pedidoActivo.codigoLote}
                      onChange={(e) => handleUpdatePedidoField('codigoLote', e.target.value)}
                      className={`w-full rounded-lg border p-2 text-xs font-mono font-bold text-[#00F2C3] ${inputBg}`}
                    />
                  </div>

                  <div>
                    <label className={`block text-[10px] uppercase font-bold mb-1 ${textTitle}`}>Peso Real (Balanza) — Kg</label>
                    <input
                      type="number"
                      step="0.001"
                      value={pedidoActivo.contenidoNetoKg}
                      onChange={(e) => handleUpdatePedidoField('contenidoNetoKg', parseFloat(e.target.value) || 0)}
                      className={`w-full rounded-lg border p-2 text-xs font-mono font-bold ${inputBg}`}
                      title="Peso neto real pesado en balanza — queda registrado para este lote"
                    />
                  </div>

                  <div>
                    <label className={`block text-[10px] uppercase font-bold mb-1 ${textTitle}`}>Tara de Envase (Gramos)</label>
                    <input
                      type="number"
                      value={pedidoActivo.taraGramos}
                      onChange={(e) => handleUpdatePedidoField('taraGramos', parseInt(e.target.value) || 0)}
                      className={`w-full rounded-lg border p-2 text-xs font-mono font-bold ${inputBg}`}
                    />
                  </div>

                  <div>
                    <label className={`block text-[10px] uppercase font-bold mb-1 ${textTitle}`}>Gramos por STICK (KG→UN)</label>
                    <input
                      type="number"
                      min={0}
                      step="0.1"
                      value={gramosPorStick || ''}
                      onChange={(e) => setGramosPorStick(Math.max(0, parseFloat(e.target.value) || 0))}
                      placeholder="Ej. 20"
                      className={`w-full rounded-lg border p-2 text-xs font-mono font-bold ${inputBg}`}
                    />
                    <p className="text-[9px] text-slate-500 mt-0.5">Si &gt;0, la etiqueta muestra UN = KG×1000 / g. Ej. 10 KG / 20g = 500 UN</p>
                  </div>

                  <div>
                    <label className={`block text-[10px] uppercase font-bold mb-1 ${textTitle}`}>Display de Cantidad</label>
                    <input
                      type="text"
                      value={pedidoActivo.cantidadKilosDisplay}
                      onChange={(e) => handleUpdatePedidoField('cantidadKilosDisplay', e.target.value)}
                      className={`w-full rounded-lg border p-2 text-xs font-mono font-bold ${inputBg}`}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* ETIQUETA INDUSTRIAL HIGH-TECH CON EL ESTILO ORIGINAL (#00F2C3 + #090C10) */}
            {/* ========================================================================= */}
            <div className="p-3 sm:p-6 bg-slate-950 rounded-2xl flex justify-center border border-slate-900">
              <div
                id="etiqueta-hightech-industrial"
                className="w-full max-w-xl rounded-2xl border border-[#1A2232] bg-[#090C10] p-6 text-slate-100 shadow-2xl font-mono relative overflow-hidden select-none"
              >
                {/* Cyan Glow Top-Right Corner Highlight */}
                <div className="absolute top-0 right-0 h-24 w-24 bg-[#00F2C3]/15 blur-2xl pointer-events-none" />

                {/* Header Superior con Branding y Badge Neón #00F2C3 */}
                <div className="flex items-start justify-between border-b border-[#1A2232] pb-4">
                  <div>
                    <span className="text-[10px] text-[#00F2C3] font-black tracking-widest uppercase block">
                      QUIMICORP PERU · PLANTA CENTRAL
                    </span>
                    <h2 className="text-xl font-black tracking-tight text-white mt-1 uppercase">
                      {pedidoActivo.nombreProducto}
                    </h2>
                    <p className="text-xs text-slate-400 font-sans mt-0.5">
                      Para: <span className="font-bold text-slate-100">{pedidoActivo.clienteNombre}</span>
                      {pedidoActivo.clienteRuc && <span className="text-slate-500 text-[10px] ml-2">RUC: {pedidoActivo.clienteRuc}</span>}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="inline-block rounded-xl bg-[#00F2C3]/10 px-3.5 py-1.5 text-xs font-black text-[#00F2C3] border border-[#00F2C3]/40 shadow-sm shadow-[#00F2C3]/20">
                      Cant.: {pedidoActivo.cantidadKilosDisplay}
                      {sticksUnidades !== null && ` · ${sticksUnidades.toLocaleString()} UN`}
                    </span>
                    <span className="block text-[10px] text-slate-400 font-mono mt-1">
                      LOTE: <strong className="text-white text-xs">{pedidoActivo.codigoLote}</strong>
                    </span>
                  </div>
                </div>

                {/* Bloque Central: Metrología Exacta + Código QR Real */}
                <div className="my-4 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  {/* Left: Metrología de Balanza (7 cols) */}
                  <div className="sm:col-span-7 space-y-2 text-xs">
                    <div className="rounded-xl border border-[#1A2232] bg-[#151D2A]/70 p-3.5 space-y-1.5">
                      <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block">
                        CONTROL METROLÓGICO DE ENVASE
                      </span>
                      <div className="flex justify-between text-slate-300 text-[11px]">
                        <span>TARA (envase: {pedidoActivo.tipoEnvase}):</span>
                        <strong className="text-white font-mono">{pedidoActivo.taraGramos} g</strong>
                      </div>
                      <div className="flex justify-between text-slate-300 text-[11px]">
                        <span>CONTENIDO NETO:</span>
                        <strong className="text-blue-400 font-mono">
                          {contenidoNeto.toFixed(3)} kg{esLitros && netoMl !== null ? ` = (${netoMl.toLocaleString()}ml)` : ''}{sticksUnidades !== null ? ` · ${sticksUnidades.toLocaleString()} UN` : ''}
                        </strong>
                      </div>
                      <div className="flex justify-between text-xs pt-1.5 border-t border-[#1A2232] font-black">
                        <span className="text-slate-200">PESO TOTAL (BRUTO):</span>
                        <span className="text-[#00F2C3] text-sm font-mono">{pesoBrutoTotalKg.toFixed(3)} kg</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <div className="rounded-lg bg-[#151D2A]/50 p-2 border border-[#1A2232]">
                        <span className="text-slate-500 block">F. FABRICACIÓN:</span>
                        <span className="font-bold text-slate-200">{pedidoActivo.fechaFab}</span>
                      </div>
                      <div className="rounded-lg bg-[#151D2A]/50 p-2 border border-[#1A2232]">
                        <span className="text-slate-500 block">F. VENCIMIENTO:</span>
                        <span className="font-bold text-amber-400">{pedidoActivo.fechaVenc}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: QR Code Real Escaneable + Click Ficha Técnica (5 cols) */}
                  <div className="sm:col-span-5 flex flex-col items-center justify-center p-3 rounded-xl border border-[#1A2232] bg-[#151D2A]/50">
                    <div
                      onClick={() => setShowFichaModal(true)}
                      className="bg-white p-1.5 rounded-xl shadow-lg cursor-pointer hover:scale-105 transition-transform"
                      title="Escanee con su celular o haga clic para ver la Ficha Técnica"
                    >
                      {qrDataUrl ? (
                        <img src={qrDataUrl} alt="QR Real" className="w-24 h-24 object-contain" />
                      ) : (
                        <QrCode className="w-24 h-24 text-black" />
                      )}
                    </div>
                    <span className="text-[9px] font-bold text-[#00F2C3] mt-2 text-center tracking-wider block">
                      QR DE TRAZABILIDAD
                    </span>
                    <span className="text-[8px] text-slate-400 text-center block">
                      Escanee para ver fórmula y QA
                    </span>
                  </div>
                </div>

                {/* Footer Warning Badge GHS07 & Metadata */}
                <div className="flex items-center justify-between border-t border-[#1A2232] pt-3 text-[10px]">
                  <div className="rounded-lg bg-amber-500/10 px-2.5 py-1.5 border border-amber-500/30 text-amber-400 flex items-center gap-1.5 font-bold">
                    <span className="flex h-4 w-4 items-center justify-center rounded bg-amber-500 text-slate-950 font-black text-[10px]">
                      !
                    </span>
                    <span className="text-[9px]">{pedidoActivo.advertenciaGHS}</span>
                  </div>

                  <div className="text-right text-slate-400 text-[10px]">
                    <span className="text-slate-200 font-bold">QUIMICORP PERÚ S.A.C.</span>
                    <p className="text-[9px] text-slate-500">RUC: {pedidoActivo.ruc} · BPM PLANTA</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Controles de Configuración de Envase & Acciones de Despacho */}
            <div className={`p-4 rounded-xl border space-y-3 text-xs ${isDark ? 'bg-[#151D2A] border-[#1A2232]' : 'bg-slate-50 border-slate-200'}`}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-sans">
                {/* Toggle Envase del Cliente vs Inventario */}
                <div className="sm:col-span-3">
                  <div className={`p-3 rounded-xl border flex flex-wrap items-center justify-between gap-3 ${
                    isDark ? 'bg-[#0B0F17] border-[#1A2232]' : 'bg-slate-100 border-slate-200'
                  }`}>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] uppercase font-bold ${textTitle}`}>Origen del Envase:</span>
                      <div className="flex items-center gap-1 p-1 rounded-xl border bg-black/20">
                        <button
                          type="button"
                          onClick={() => setEnvaseCliente(false)}
                          className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase transition-all ${
                            !envaseCliente
                              ? 'bg-[#00F2C3] text-slate-950 shadow'
                              : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          📦 Inventario
                        </button>
                        <button
                          type="button"
                          onClick={() => setEnvaseCliente(true)}
                          className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase transition-all ${
                            envaseCliente
                              ? 'bg-purple-600 text-white shadow'
                              : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          🧰 Envase del Cliente
                        </button>
                      </div>
                    </div>
                    {envaseCliente && (
                      <span className="text-[10px] font-bold text-purple-400">
                        No se descuenta del stock interno — solo se registra como referencia
                      </span>
                    )}
                  </div>
                </div>

                {envaseCliente ? (
                  <>
                    <div>
                      <label className={`block text-[10px] uppercase font-bold mb-1 ${textTitle}`}>
                        Tipo de Envase (provee el cliente)
                      </label>
                      <select
                        value={tipoEnvaseCliente}
                        onChange={(e) => setTipoEnvaseCliente(e.target.value)}
                        className={`w-full rounded-lg border p-2 text-xs font-semibold ${inputBg}`}
                      >
                        <option value="STICK">STICK</option>
                        <option value="ENVASE 100 ML">ENVASE 100 ML</option>
                        <option value="ENVASE 50 GRS">ENVASE 50 GRS</option>
                        <option value="OTRO">OTRO (especificar)</option>
                      </select>
                      {tipoEnvaseCliente === 'OTRO' && (
                        <input
                          type="text"
                          value={otroEnvaseCliente}
                          onChange={(e) => setOtroEnvaseCliente(e.target.value)}
                          placeholder="Especificar tipo de envase..."
                          className={`w-full rounded-lg border p-2 text-xs font-semibold mt-1.5 ${inputBg}`}
                        />
                      )}
                    </div>

                    <div>
                      <label className={`block text-[10px] uppercase font-bold mb-1 ${textTitle}`}>Bultos a Despachar</label>
                      <input
                        data-bultos-input="1"
                        type="number"
                        min={1}
                        value={bultosInput}
                        onChange={(e) => setBultosInput(e.target.value)}
                        onBlur={(e) => commitBultos(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') commitBultos((e.target as HTMLInputElement).value); }}
                        className={`w-full rounded-lg border p-2 text-xs font-mono font-bold ${inputBg}`}
                      />
                    </div>

                    <div>
                      <label className={`block text-[10px] uppercase font-bold mb-1 ${textTitle}`}>Responsable Planta</label>
                      <input
                        type="text"
                        value={responsable}
                        onChange={(e) => setResponsable(e.target.value)}
                        className={`w-full rounded-lg border p-2 text-xs font-semibold ${inputBg}`}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className={`block text-[10px] uppercase font-bold mb-1 ${textTitle}`}>Envase Usado (se descuenta de stock)</label>
                      <select
                        value={envaseActivo?.codigo || pedidoActivo.envaseSku}
                        onChange={(e) => {
                          const codigo = e.target.value;
                          const env = envases.find((x) => x.codigo === codigo);
                          const nombre = env?.nombre || codigo;
                          let tara = 985;
                          if (codigo === 'ENV-002') tara = 120;
                          handleUpdatePedidoField('envaseSku', codigo);
                          handleUpdatePedidoField('tipoEnvase', `${nombre} (${codigo})`);
                          handleUpdatePedidoField('taraGramos', tara);
                        }}
                        className={`w-full rounded-lg border p-2 text-xs font-semibold ${inputBg}`}
                      >
                        {envases.length === 0 && <option value="ENV-001">ENV-001 · BALDE DE 20 LITROS CON TAPA</option>}
                        {envases.map((env) => (
                          <option key={env.codigo} value={env.codigo}>
                            {env.codigo} · {env.nombre} — {Number(env.stockReal).toLocaleString()} {env.unidadMedida}
                          </option>
                        ))}
                      </select>
                      <p className={`mt-1 text-[9px] font-sans ${envaseActivo && Number(envaseActivo.stockReal) < (parseInt(bultosInput, 10) || 1) ? 'text-rose-500 font-bold' : 'text-slate-500'}`}>
                        {envaseActivo
                          ? `Stock actual: ${Number(envaseActivo.stockReal).toLocaleString()} ${envaseActivo.unidadMedida}` +
                            (Number(envaseActivo.stockReal) >= (parseInt(bultosInput, 10) || 1)
                              ? ' ✔ suficiente para el despacho'
                              : ' ⚠ insuficiente para este despacho')
                          : 'Sin maestro de envases conectado'}
                      </p>
                    </div>

                    <div>
                      <label className={`block text-[10px] uppercase font-bold mb-1 ${textTitle}`}>Bultos a Despachar</label>
                      <input
                        data-bultos-input="1"
                        type="number"
                        min={1}
                        value={bultosInput}
                        onChange={(e) => setBultosInput(e.target.value)}
                        onBlur={(e) => commitBultos(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') commitBultos((e.target as HTMLInputElement).value); }}
                        className={`w-full rounded-lg border p-2 text-xs font-mono font-bold ${inputBg}`}
                      />
                    </div>

                    <div>
                      <label className={`block text-[10px] uppercase font-bold mb-1 ${textTitle}`}>Responsable Planta</label>
                      <input
                        type="text"
                        value={responsable}
                        onChange={(e) => setResponsable(e.target.value)}
                        className={`w-full rounded-lg border p-2 text-xs font-semibold ${inputBg}`}
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className={`block text-[10px] uppercase font-bold mb-1 ${textTitle}`}>N° Guía de Remisión</label>
                  <textarea
                    value={numeroGuia}
                    onChange={(e) => guardarGuiaLocal(e.target.value)}
                    placeholder="Ej. G001-000456"
                    className={`w-full rounded-lg border p-2 text-xs font-mono font-bold ${inputBg}`}
                    rows={1}
                  />
                </div>
              </div>

              {/* --- Envases Secundarios (hasta 5 tipos, adicionales al primero) --- */}
              <div className={`p-3 rounded-xl border font-sans space-y-2 ${isDark ? 'bg-[#0B0F17] border-[#1A2232]' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] uppercase font-bold ${textTitle}`}>Envases Secundarios ({envasesSecundarios.length}/5) — adicionales al primero</span>
                  {envasesSecundarios.length < 5 && (
                    <button
                      onClick={() => {
                        const disponibles = envases.filter((e) => e.codigo !== envaseActivo?.codigo && !envasesSecundarios.some((s) => s.sku === e.codigo));
                        const primero = disponibles[0]?.codigo || '';
                        setEnvasesSecundarios((prev) => [...prev, { sku: primero, cantidad: 1 }]);
                      }}
                      className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold flex items-center gap-1 ${isDark ? 'border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10' : 'border-teal-300 text-teal-600 hover:bg-teal-50'}`}
                    >
                      <Plus className="w-3 h-3" /> Agregar
                    </button>
                  )}
                </div>
                {envaseCliente && <p className="text-[9px] text-purple-400 font-bold">Envase del cliente activo: los secundarios de abajo sí descuentan de inventario (son lo que ofreces tú extra)</p>}
                {envasesSecundarios.length === 0 ? (
                  <p className="text-[11px] text-slate-500 text-center py-1">Sin envases secundarios. Usa “Agregar” para añadir hasta 5 tipos.</p>
                ) : (
                  <div className="space-y-2">
                    {envasesSecundarios.map((sec, idx) => {
                      const envSec = envases.find((e) => e.codigo === sec.sku) || null;
                      return (
                        <div key={idx} className="grid grid-cols-1 sm:grid-cols-[1fr_90px_32px] gap-2 items-end">
                          <select
                            value={sec.sku}
                            onChange={(e) => {
                              const nuevo = [...envasesSecundarios];
                              nuevo[idx] = { ...nuevo[idx], sku: e.target.value };
                              setEnvasesSecundarios(nuevo);
                            }}
                            className={`w-full rounded-lg border p-2 text-xs font-semibold ${inputBg}`}
                          >
                            <option value="">Seleccionar envase...</option>
                            {envases
                              .filter((e) => e.codigo !== envaseActivo?.codigo)
                              .map((env) => (
                                <option key={env.codigo} value={env.codigo} disabled={envasesSecundarios.some((s, i) => i !== idx && s.sku === env.codigo)}>
                                  {env.codigo} · {env.nombre} — {Number(env.stockReal).toLocaleString()} {env.unidadMedida}
                                </option>
                              ))}
                          </select>
                          <div>
                            <label className={`block text-[9px] uppercase font-bold mb-0.5 ${textTitle}`}>Unidades</label>
                            <input
                              type="number"
                              min={1}
                              value={sec.cantidad}
                              onChange={(e) => {
                                const nuevo = [...envasesSecundarios];
                                nuevo[idx] = { ...nuevo[idx], cantidad: Math.max(1, Number(e.target.value) || 1) };
                                setEnvasesSecundarios(nuevo);
                              }}
                              className={`w-full rounded-lg border p-2 text-xs font-mono font-bold ${inputBg}`}
                            />
                          </div>
                          <button onClick={() => setEnvasesSecundarios((prev) => prev.filter((_, i) => i !== idx))} className="p-2 rounded-lg text-rose-400 hover:bg-rose-500/10">
                            <X className="w-3.5 h-3.5" />
                          </button>
                          {envSec && (
                            <p className={`sm:col-span-3 text-[9px] font-sans ${Number(envSec.stockReal) < sec.cantidad ? 'text-rose-500 font-bold' : 'text-slate-500'}`}>
                              Stock {envSec.codigo}: {Number(envSec.stockReal).toLocaleString()} {envSec.unidadMedida} {Number(envSec.stockReal) >= sec.cantidad ? '✔' : '⚠ insuficiente'}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Botones de Impresión y Despacho */}
              <div className="flex flex-wrap items-center gap-3 pt-2 font-mono">
                <button
                  onClick={handleImprimir}
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-red-600/20 transition-all cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimir Etiqueta ({pedidoActivo.unidadesPedidas})</span>
                </button>

                <button
                  onClick={descargarZPL}
                  className="px-5 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-slate-700/20 transition-all cursor-pointer"
                  title="Genera el archivo ZPL para imprimir en la Zebra ZT411"
                >
                  <Download className="w-4 h-4" />
                  <span>Descargar ZPL (Zebra ZT411)</span>
                </button>

                <button
                  onClick={handleConfirmarDespacho}
                  disabled={despachando}
                  className="flex-1 px-5 py-2.5 rounded-xl bg-[#00F2C3] hover:bg-[#00d8ad] text-slate-950 text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-[#00F2C3]/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {despachando ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  <span>{despachando ? 'Registrando...' : `Confirmar Despacho para ${pedidoActivo.clienteNombre}`}</span>
                </button>
              </div>

              {backendConectado ? (
                <div className="flex items-center gap-2 pt-1 text-[9px] font-bold text-emerald-500 uppercase tracking-widest">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Cola de despacho conectada al backend ({pedidosCola.filter((p: any) => p.colaId).length || 0} lotes reales)
                </div>
              ) : (
                <div className="flex items-center gap-2 pt-1 text-[9px] font-bold text-amber-500 uppercase tracking-widest">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                  Sin cola de despacho en el backend — no hay lotes listos para imprimir
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Ficha Técnica Oficial de Insumos */}
      <ModalFichaTecnicaInsumos
        isOpen={showFichaModal}
        onClose={() => setShowFichaModal(false)}
        data={fichaTecnicaData}
      />
    </div>
  );
}
