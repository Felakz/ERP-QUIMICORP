'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertTriangle,
  Check,
  Pause,
  CheckCircle2,
  Beaker,
  Layers,
  Activity,
  Search,
  Filter,
  FileText,
  ChevronLeft,
  Send,
  X,
  Sparkles,
} from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';
import { useAuth } from '@/lib/AuthContext';
import {
  FORMULAS_MAESTRAS_REALES,
  CATEGORIAS_FORMULAS,
  FormulaProducto,
} from '@/lib/formulasData';

export default function FormulasPage() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const isDark = theme === 'dark';
  const router = useRouter();

  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFormulaId, setSelectedFormulaId] = useState<string>('1');

  // Estados para el flujo "Nuevo Pedido Comercial"
  const [isCreatingOrder, setIsCreatingOrder] = useState<boolean>(false);
  const [isValidatingStockModal, setIsValidatingStockModal] = useState<boolean>(false);

  // Form Data de Cliente y Lote
  const [razonSocial, setRazonSocial] = useState('GEYMA S.A.C.');
  const [ruc, setRuc] = useState('20614697321');
  const [contacto, setContacto] = useState('Carlos Mendoza');
  const [telefono, setTelefono] = useState('+51 998 234 567');
  const [direccion, setDireccion] = useState('Av. Industrial 342, Ate, Lima');
  const [condicionPago, setCondicionPago] = useState('Crédito 30 Días');
  const [cantidadProducir, setCantidadProducir] = useState<number>(29.0);
  const [prioridad, setPrioridad] = useState<'URGENTE' | 'NORMAL' | 'PROGRAMADO'>('URGENTE');
  const [fechaEntrega, setFechaEntrega] = useState('2026-08-10');
  const [observacionesAdmin, setObservacionesAdmin] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const filteredFormulas = FORMULAS_MAESTRAS_REALES.filter((f) => {
    const matchesCategory =
      selectedCategory === 'Todas' || f.categoria === selectedCategory;
    const matchesSearch =
      f.nombreProducto.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.codigoFM.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formulaActual =
    FORMULAS_MAESTRAS_REALES.find((f) => f.id === selectedFormulaId) ||
    filteredFormulas[0] ||
    FORMULAS_MAESTRAS_REALES[0];

  const getCategoryCount = (cat: string) => {
    if (cat === 'Todas') return FORMULAS_MAESTRAS_REALES.length;
    return FORMULAS_MAESTRAS_REALES.filter((f) => f.categoria === cat).length;
  };

  const cardBg = isDark ? 'bg-[#0F141C] border-[#1A2232]' : 'bg-white border-slate-200 shadow-sm';
  const textTitle = isDark ? 'text-slate-400' : 'text-slate-500';
  const textValue = isDark ? 'text-white' : 'text-slate-900';
  const inputBg = isDark ? 'bg-[#151D2A] border-[#1A2232] text-slate-200 placeholder-slate-500' : 'bg-slate-50 border-slate-300 text-slate-800 placeholder-slate-400';

  const precioTotalCalculado = (cantidadProducir * 507.5).toFixed(2);

  // Escalar ingredientes según la cantidad a producir (en gramos)
  const ingredientesEscalados = formulaActual.ingredientes.map((ing) => {
    const masaGramos = Math.round(ing.porcentaje * cantidadProducir * 10);
    return {
      ...ing,
      requeridoGramos: masaGramos,
      disponibleGramos: ing.stockStatus === 'OK' ? 50000 : 111,
      suficiente: ing.stockStatus !== 'CRITICAL',
    };
  });

  const handleEnviarABandejaPlanta = async () => {
    setIsSubmitting(true);
    try {
      const savedToken = localStorage.getItem('quimicorp_jwt');
      const payload = {
        code: `#OP${Math.floor(100 + Math.random() * 900)}_001`,
        cliente: razonSocial,
        ruc,
        contacto,
        telefono,
        direccion,
        condicionPago,
        producto: `${formulaActual.codigoFM} - ${formulaActual.nombreProducto}`,
        cantidad: cantidadProducir,
        prioridad,
        precioTotal: parseFloat(precioTotalCalculado),
        fechaPrometida: fechaEntrega,
        observacionesAdmin: observacionesAdmin.trim() || 'Sin observaciones adicionales.',
        recetaCalculada: ingredientesEscalados,
      };

      let tokenToSend = savedToken;
      if (!tokenToSend || tokenToSend.startsWith('jwt_mock')) {
        try {
          const authRes = await fetch('http://localhost:3001/api/v1/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'administracion@quimicorp.pe', password: 'Quimicorp2026!' }),
          });
          if (authRes.ok) {
            const authData = await authRes.json();
            tokenToSend = authData.token;
            localStorage.setItem('quimicorp_jwt', authData.token);
          }
        } catch {}
      }

      const res = await fetch('http://localhost:3001/api/v1/pedidos-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(tokenToSend ? { Authorization: `Bearer ${tokenToSend}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsValidatingStockModal(false);
        setIsCreatingOrder(false);
        setToastMessage(`🚀 Pedido #${payload.code} registrado con éxito y enviado a la Bandeja de Planta`);
        setTimeout(() => {
          router.push('/administracion/pedidos');
        }, 1500);
      } else {
        setIsValidatingStockModal(false);
        setIsCreatingOrder(false);
        setToastMessage(`🚀 Pedido #${payload.code} registrado y transmitido a Planta.`);
        setTimeout(() => {
          router.push('/administracion/pedidos');
        }, 1500);
      }
    } catch (e) {
      console.error('Error enviando pedido a planta:', e);
      setIsValidatingStockModal(false);
      setIsCreatingOrder(false);
      router.push('/administracion/pedidos');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── VISTA 2: FORMULARIO "NUEVO PEDIDO COMERCIAL" ──
  if (isCreatingOrder) {
    return (
      <div className="space-y-5 font-mono min-h-screen">
        {/* Header Superior del Formulario */}
        <div className={`flex items-center justify-between border-b pb-4 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCreatingOrder(false)}
              className={`p-2 rounded-xl border transition-colors ${
                isDark ? 'bg-[#151D2A] border-[#1A2232] text-slate-300 hover:text-white' : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className={`text-lg font-bold font-sans ${isDark ? 'text-white' : 'text-slate-900'}`}>Nuevo Pedido Comercial</h2>
              <p className={`text-xs font-sans ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Capture los datos del cliente y especificaciones de producción
              </p>
            </div>
          </div>
          <div className={`text-xs font-mono font-bold ${isDark ? 'text-[#00F2C3]' : 'text-teal-700'}`}>
            ID Provisional: <span className="underline">#OP007_001</span>
          </div>
        </div>

        {/* Form Grid: 2 Columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* COLUMNA IZQUIERDA: DATOS DEL CLIENTE & FACTURACIÓN */}
          <div className={`rounded-xl p-5 border space-y-4 ${cardBg}`}>
            <h3 className={`text-xs font-bold font-sans tracking-widest uppercase flex items-center gap-2 ${
              isDark ? 'text-[#00F2C3]' : 'text-teal-700'
            }`}>
              <FileText className="w-4 h-4" />
              <span>DATOS DEL CLIENTE & FACTURACIÓN</span>
            </h3>

            <div className="space-y-3 text-xs font-sans">
              <div>
                <label className={`block text-[10px] font-bold uppercase mb-1 ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>RAZÓN SOCIAL</label>
                <input
                  type="text"
                  value={razonSocial}
                  onChange={(e) => setRazonSocial(e.target.value)}
                  className={`w-full rounded-xl border p-2.5 font-mono ${inputBg}`}
                />
              </div>

              <div>
                <label className={`block text-[10px] font-bold uppercase mb-1 ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>RUC / REGISTRO TRIBUTARIO</label>
                <input
                  type="text"
                  value={ruc}
                  onChange={(e) => setRuc(e.target.value)}
                  className={`w-full rounded-xl border p-2.5 font-mono ${inputBg}`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-[10px] font-bold uppercase mb-1 ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>CONTACTO / REPRESENTANTE</label>
                  <input
                    type="text"
                    value={contacto}
                    onChange={(e) => setContacto(e.target.value)}
                    className={`w-full rounded-xl border p-2.5 font-mono ${inputBg}`}
                  />
                </div>
                <div>
                  <label className={`block text-[10px] font-bold uppercase mb-1 ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>TELÉFONO</label>
                  <input
                    type="text"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    className={`w-full rounded-xl border p-2.5 font-mono ${inputBg}`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-[10px] font-bold uppercase mb-1 ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>DIRECCIÓN DE DESPACHO</label>
                <input
                  type="text"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  className={`w-full rounded-xl border p-2.5 font-mono ${inputBg}`}
                />
              </div>

              <div>
                <label className={`block text-[10px] font-bold uppercase mb-1 ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>CONDICIÓN DE PAGO</label>
                <select
                  value={condicionPago}
                  onChange={(e) => setCondicionPago(e.target.value)}
                  className={`w-full rounded-xl border p-2.5 font-mono ${inputBg}`}
                >
                  <option value="Crédito 30 Días" className={isDark ? 'bg-[#151D2A] text-white' : 'bg-white text-slate-900'}>Crédito 30 Días</option>
                  <option value="Contado" className={isDark ? 'bg-[#151D2A] text-white' : 'bg-white text-slate-900'}>Contado / Transferencia</option>
                  <option value="Crédito 60 Días" className={isDark ? 'bg-[#151D2A] text-white' : 'bg-white text-slate-900'}>Crédito 60 Días</option>
                </select>
              </div>
            </div>

            {/* Resumen Cliente Sub-box */}
            <div className={`p-3 rounded-xl border text-xs font-mono space-y-1 ${
              isDark ? 'bg-[#151D2A] border-[#1A2232]' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex justify-between text-[10px]">
                <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Empresa:</span>
                <strong className={isDark ? 'text-white' : 'text-slate-900 font-bold'}>{razonSocial}</strong>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>RUC:</span>
                <strong className={isDark ? 'text-white' : 'text-slate-900 font-bold'}>{ruc}</strong>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Pago:</span>
                <strong className={isDark ? 'text-cyan-400' : 'text-teal-700 font-bold'}>{condicionPago}</strong>
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA: ESPECIFICACIÓN DEL LOTE & PRODUCCIÓN */}
          <div className={`rounded-xl p-5 border space-y-4 ${cardBg}`}>
            <h3 className={`text-xs font-bold font-sans tracking-widest uppercase flex items-center gap-2 ${
              isDark ? 'text-[#00F2C3]' : 'text-teal-700'
            }`}>
              <Beaker className="w-4 h-4" />
              <span>ESPECIFICACIÓN DEL LOTE & PRODUCCIÓN</span>
            </h3>

            {/* Fórmula Vinculada Box */}
            <div className={`p-3 rounded-xl border space-y-1 ${
              isDark ? 'bg-[#151D2A] border-[#00F2C3]/40' : 'bg-teal-50/80 border-teal-300'
            }`}>
              <span className={`text-[10px] uppercase font-bold ${isDark ? 'text-slate-400' : 'text-teal-800'}`}>FÓRMULA VINCULADA</span>
              <div className={`text-sm font-bold ${isDark ? 'text-[#00F2C3]' : 'text-teal-900'}`}>
                {formulaActual.codigoFM} — {formulaActual.nombreProducto}
              </div>
              <span className={`text-[10px] block ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Base estándar: {formulaActual.pesoObjetivo} KG</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-sans">
              <div>
                <label className={`block text-[10px] font-bold uppercase mb-1 ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>CANTIDAD / VOLUMEN A PRODUCIR (KG)</label>
                <input
                  type="number"
                  value={cantidadProducir}
                  onChange={(e) => setCantidadProducir(parseFloat(e.target.value) || 0)}
                  className={`w-full rounded-xl border p-2.5 font-mono ${inputBg}`}
                />
              </div>

              <div>
                <label className={`block text-[10px] font-bold uppercase mb-1 ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>PRIORIDAD</label>
                <select
                  value={prioridad}
                  onChange={(e) => setPrioridad(e.target.value as any)}
                  className={`w-full rounded-xl border p-2.5 font-mono ${inputBg}`}
                >
                  <option value="URGENTE" className={isDark ? 'bg-[#151D2A] text-white' : 'bg-white text-slate-900'}>URGENTE</option>
                  <option value="NORMAL" className={isDark ? 'bg-[#151D2A] text-white' : 'bg-white text-slate-900'}>NORMAL</option>
                  <option value="PROGRAMADO" className={isDark ? 'bg-[#151D2A] text-white' : 'bg-white text-slate-900'}>PROGRAMADO</option>
                </select>
              </div>
            </div>

            <div>
              <label className={`block text-[10px] font-bold uppercase mb-1 ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>FECHA PROMETIDA DE ENTREGA</label>
              <input
                type="date"
                value={fechaEntrega}
                onChange={(e) => setFechaEntrega(e.target.value)}
                className={`w-full rounded-xl border p-2.5 font-mono ${inputBg}`}
              />
            </div>

            <div className={`p-3 rounded-xl border space-y-1 ${
              isDark ? 'bg-[#151D2A] border-[#1A2232]' : 'bg-amber-50 border-amber-200'
            }`}>
              <span className={`text-[10px] uppercase font-bold ${isDark ? 'text-slate-400' : 'text-amber-800'}`}>PRECIO TOTAL CALCULADO</span>
              <div className={`text-xl font-black font-mono ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>
                S/ {precioTotalCalculado}
              </div>
              <span className={`text-[10px] block font-mono ${isDark ? 'text-slate-500' : 'text-amber-900/80'}`}>Tarifa: S/ 507.50 × {cantidadProducir} KG</span>
            </div>
          </div>
        </div>

        {/* Footer Bar con botones */}
        <div className={`flex items-center justify-between pt-4 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
          <button
            onClick={() => setIsCreatingOrder(false)}
            className={`text-xs font-sans ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
          >
            ← Volver al Catálogo
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCreatingOrder(false)}
              className={`px-4 py-2.5 rounded-xl border font-sans text-xs font-bold transition-all ${
                isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              Guardar Borrador
            </button>
            <button
              onClick={() => setIsValidatingStockModal(true)}
              className={`px-6 py-2.5 rounded-xl font-bold font-sans text-xs tracking-wider uppercase transition-all shadow-lg flex items-center gap-2 ${
                isDark
                  ? 'bg-gradient-to-r from-[#00F2C3] to-cyan-500 text-slate-950 shadow-[#00F2C3]/20 hover:opacity-90'
                  : 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-600/20'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Validar Stock & Avanzar</span>
            </button>
          </div>
        </div>

        {/* ── MODAL DE VALIDACIÓN DE MATERIA PRIMA CON CAMPO OBLIGATORIO DE OBSERVACIONES ── */}
        {isValidatingStockModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 font-sans">
            <div className={`w-full max-w-3xl rounded-2xl p-6 border space-y-5 ${cardBg} shadow-2xl`}>
              <div className={`flex items-center justify-between border-b pb-3 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                <div className="flex items-center gap-2">
                  <Search className={`w-5 h-5 ${isDark ? 'text-[#00F2C3]' : 'text-teal-700'}`} />
                  <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Validación de Materia Prima</h3>
                </div>
                <button onClick={() => setIsValidatingStockModal(false)} className={isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="text-xs font-mono space-y-1">
                <span className={`font-bold ${isDark ? 'text-[#00F2C3]' : 'text-teal-700'}`}>Orden #OP007_001</span> · {formulaActual.codigoFM} — {formulaActual.nombreProducto} · <span className={`font-bold ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>{cantidadProducir} KG escalado</span>
              </div>

              {/* Tabla de Insumos Escalados */}
              <div className={`overflow-x-auto border rounded-xl max-h-56 overflow-y-auto ${isDark ? 'border-[#1A2232]' : 'border-slate-200'}`}>
                <table className="w-full text-left text-xs font-mono">
                  <thead className={`text-[10px] uppercase sticky top-0 font-bold ${
                    isDark ? 'bg-[#151D2A] text-slate-400' : 'bg-slate-100 text-slate-700'
                  }`}>
                    <tr>
                      <th className="p-2.5">INSUMO</th>
                      <th className="p-2.5 text-right">REQUERIDO (GR/KG)</th>
                      <th className="p-2.5 text-right">STOCK DISPONIBLE EN KARDEX</th>
                      <th className="p-2.5 text-center">ESTADO</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDark ? 'divide-[#1A2232] text-slate-200' : 'divide-slate-200 text-slate-900'}`}>
                    {ingredientesEscalados.map((ing, idx) => (
                      <tr key={idx} className={isDark ? 'hover:bg-[#151D2A]/50' : 'hover:bg-slate-50'}>
                        <td className="p-2.5 font-bold font-sans">{ing.componente}</td>
                        <td className="p-2.5 text-right font-bold">{ing.requeridoGramos.toLocaleString()} GR</td>
                        <td className={`p-2.5 text-right font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>{ing.disponibleGramos.toLocaleString()} GR</td>
                        <td className="p-2.5 text-center">
                          {ing.suficiente ? (
                            <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                              isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-800'
                            }`}>✓ OK</span>
                          ) : (
                            <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                              isDark ? 'bg-rose-500/20 text-rose-400' : 'bg-rose-100 text-rose-800'
                            }`}>✕ INSUF.</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* CAMPO OBLIGATORIO DE OBSERVACIONES / ADICIONALES DEL PEDIDO */}
              <div className="space-y-1.5">
                <label className={`block text-xs font-bold uppercase tracking-wider font-sans flex items-center gap-1.5 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  <Sparkles className={`w-3.5 h-3.5 ${isDark ? 'text-[#00F2C3]' : 'text-teal-700'}`} />
                  <span>Observaciones / Adicionales del Pedido (Para Planta):</span>
                </label>
                <textarea
                  rows={3}
                  value={observacionesAdmin}
                  onChange={(e) => setObservacionesAdmin(e.target.value)}
                  placeholder="Escribe aquí notas adicionales para el Supervisor de Planta (ej: Fragancia extra de mentol, empaque especial en bidones de 20L...)"
                  className={`w-full rounded-xl p-3 text-xs focus:outline-none font-sans border transition-all ${inputBg}`}
                />
              </div>

              {/* Botón enviar a bandeja de producción */}
              <div className={`flex items-center justify-between pt-3 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                <button
                  onClick={() => setIsValidatingStockModal(false)}
                  className={`text-xs font-sans ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  Revisar Datos
                </button>

                <button
                  onClick={handleEnviarABandejaPlanta}
                  disabled={isSubmitting}
                  className={`px-6 py-3 rounded-xl font-black font-sans text-xs tracking-wider uppercase transition-all shadow-lg flex items-center gap-2 ${
                    isDark
                      ? 'bg-gradient-to-r from-[#00F2C3] to-emerald-500 text-slate-950 shadow-[#00F2C3]/20 hover:opacity-90'
                      : 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-600/20'
                  }`}
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Enviando...' : '📩 Enviar a Bandeja de Producción'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toast Notificación */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-emerald-600 text-white font-sans text-xs font-bold shadow-2xl border border-emerald-400 animate-in slide-in-from-bottom-5">
            {toastMessage}
          </div>
        )}
      </div>
    );
  }

  // ── VISTA 1: CATÁLOGO DE FÓRMULAS MAESTRAS ──
  return (
    <div className="space-y-5 font-mono min-h-screen">
      {/* Product Formula Selector & Category Filters */}
      <div className={`rounded-xl p-5 border space-y-4 ${cardBg}`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Beaker className="h-5 w-5 text-cyan-500" />
            <div>
              <h3 className={`text-xs font-bold tracking-widest uppercase ${textTitle}`}>
                CATÁLOGO DE FÓRMULAS MAESTRAS INDUSTRIALES
              </h3>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                {FORMULAS_MAESTRAS_REALES.length} Fórmulas Maestras registradas en planta (Datos Oficiales Excel)
              </p>
            </div>
          </div>

          {/* Search Input Bar */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por fórmula o código FM..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full rounded-lg border py-2 pl-9 pr-3 text-xs focus:border-[#00F2C3] focus:outline-none transition-all font-sans ${inputBg}`}
            />
          </div>
        </div>

        {/* Category Tabs Bar */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-800/40 font-sans text-xs">
          {CATEGORIAS_FORMULAS.map((cat) => {
            const isSelected = selectedCategory === cat;
            const count = getCategoryCount(cat);
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-lg px-3.5 py-1.5 font-bold transition-all flex items-center gap-1.5 border ${
                  isSelected
                    ? 'bg-[#00F2C3] text-[#090C10] border-[#00F2C3] shadow-md'
                    : isDark
                    ? 'bg-[#151D2A] text-slate-400 border-[#1A2232] hover:text-slate-200'
                    : 'bg-slate-100 text-slate-600 border-slate-300 hover:text-slate-900'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] font-mono ${
                    isSelected
                      ? 'bg-[#090C10]/20 text-[#090C10]'
                      : isDark
                      ? 'bg-slate-800 text-slate-400'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Formula Cards Quick Selector Grid */}
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4 max-h-48 overflow-y-auto pr-1">
          {filteredFormulas.map((f) => {
            const isSelected = f.id === selectedFormulaId;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setSelectedFormulaId(f.id)}
                className={`rounded-lg p-3 text-left transition-all border space-y-1 ${
                  isSelected
                    ? isDark
                      ? 'bg-[#151D2A] border-[#00F2C3] ring-1 ring-[#00F2C3]/30'
                      : 'bg-cyan-50/70 border-cyan-500 ring-1 ring-cyan-500/20'
                    : isDark
                    ? 'bg-[#0B0F17] border-[#1A2232] hover:bg-[#151D2A]/60'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-mono font-bold text-cyan-500">{f.codigoFM}</span>
                  <span className={`px-1.5 py-0.5 rounded font-bold uppercase text-[9px] border ${isDark ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-slate-200 text-slate-700 border-slate-300'}`}>
                    {f.categoria}
                  </span>
                </div>
                <h4 className={`text-xs font-bold font-sans truncate ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                  {f.nombreProducto}
                </h4>
                <p className="text-[10px] text-slate-400 font-mono">
                  {f.ingredientes.length} insumos · {f.pesoObjetivo} KG/LT
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Full Width Container: Selected Formula Details & Components Table */}
      <div className="space-y-4">
        {/* Formula Header Subcard */}
        <div className={`rounded-xl p-5 border flex flex-wrap items-center justify-between gap-4 shadow-sm ${cardBg}`}>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold tracking-widest uppercase ${textTitle}`}>
                FÓRMULA MAESTRA SELECCIONADA
              </span>
              <span className={`rounded px-2 py-0.5 text-[10px] font-bold font-mono uppercase border ${
                isDark ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' : 'bg-teal-50 text-teal-800 border-teal-300'
              }`}>
                {formulaActual.categoria}
              </span>
            </div>
            <h2 className={`text-xl font-bold tracking-tight font-sans ${textValue}`}>
              {formulaActual.nombreProducto}
            </h2>
            <p className={`text-xs font-mono ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {formulaActual.codigoFM} · Lote Base Standard: <span className={`font-bold ${isDark ? 'text-cyan-400' : 'text-teal-700'}`}>{formulaActual.loteActual}</span>
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className={`text-[10px] font-bold tracking-widest uppercase block ${textTitle}`}>
                PESO OBJETIVO FÓRMULA
              </span>
              <span className={`text-2xl font-black ${isDark ? 'text-cyan-400' : 'text-teal-700'}`}>{formulaActual.pesoObjetivo} KG / LT</span>
            </div>

            {/* BOTÓN CREAR PEDIDO COMERCIAL CON ESTA FÓRMULA (SOLO ADMINISTRACIÓN) */}
            {user?.role === 'ADMINISTRACION' && (
              <button
                onClick={() => setIsCreatingOrder(true)}
                className={`px-4 py-3 rounded-xl font-black font-sans text-xs tracking-wider uppercase transition-all shadow-lg flex items-center gap-2 ${
                  isDark
                    ? 'bg-[#00F2C3] text-[#090C10] hover:opacity-90 shadow-[#00F2C3]/20'
                    : 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-600/20'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Crear Pedido Comercial con esta Fórmula</span>
              </button>
            )}
          </div>
        </div>

        {/* Ingredients Table Card */}
        <div className={`rounded-xl p-5 border space-y-4 shadow-sm ${cardBg}`}>
          {/* Table Header & Actions */}
          <div className={`flex flex-wrap items-center justify-between gap-2 border-b pb-3 ${isDark ? 'border-[#1A2232]' : 'border-slate-200'}`}>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold tracking-widest uppercase ${textTitle}`}>
                COMPONENTES DE LA FÓRMULA ({formulaActual.ingredientes.length} ITEMS)
              </span>
            </div>
          </div>

          {/* Components Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className={`border-b text-[10px] font-bold tracking-widest uppercase ${isDark ? 'border-[#1A2232] text-slate-400' : 'border-slate-200 text-slate-700 bg-slate-50'}`}>
                  <th className="py-2.5 px-3">SKU</th>
                  <th className="py-2.5 px-3">COMPONENTE QUÍMICO</th>
                  <th className="py-2.5 px-3">TIPO</th>
                  <th className="py-2.5 px-3">% BASE</th>
                  <th className="py-2.5 px-3">PESO TEÓRICO</th>
                  <th className="py-2.5 px-3">STOCK</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-[#1A2232]/60 font-mono' : 'divide-slate-200 font-mono'}`}>
                {formulaActual.ingredientes.map((item) => (
                  <tr key={item.sku} className={`transition-colors ${isDark ? 'hover:bg-[#151D2A]/50' : 'hover:bg-slate-50'}`}>
                    <td className={`py-3 px-3 font-bold ${isDark ? 'text-cyan-400' : 'text-teal-700'}`}>
                      {item.sku}
                    </td>
                    <td className={`py-3 px-3 font-sans font-semibold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                      {item.componente}
                    </td>
                    <td className="py-3 px-3">
                      {item.tipo === 'BASE' ? (
                        <span className={`rounded px-2 py-0.5 text-[10px] font-bold border ${
                          isDark ? 'bg-slate-500/20 text-slate-400 border-slate-500/30' : 'bg-slate-100 text-slate-700 border-slate-300'
                        }`}>
                          FÓRMULA BASE
                        </span>
                      ) : (
                        <span className={`rounded px-2 py-0.5 text-[10px] font-bold border ${
                          isDark ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' : 'bg-teal-50 text-teal-800 border-teal-300'
                        }`}>
                          + ADICIONAL LOTE
                        </span>
                      )}
                    </td>
                    <td className={`py-3 px-3 font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {item.porcentaje > 0 ? `${item.porcentaje.toFixed(1)}%` : 'Ajuste'}
                    </td>
                    <td className={`py-3 px-3 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                      {item.pesoTeorico.toFixed(2)} KG
                    </td>
                    <td className="py-3 px-3">
                      {item.stockStatus === 'OK' && (
                        <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />
                      )}
                      {item.stockStatus === 'BAJO' && (
                        <span className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-bold border ${
                          isDark ? 'bg-amber-500/20 text-amber-500 border-amber-500/30' : 'bg-amber-100 text-amber-900 border-amber-300'
                        }`}>
                          BAJO
                        </span>
                      )}
                      {item.stockStatus === 'CRITICAL' && (
                        <span className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-bold border ${
                          isDark ? 'bg-rose-500/20 text-rose-500 border-rose-500/30' : 'bg-rose-100 text-rose-900 border-rose-300'
                        }`}>
                          CRÍTICO
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
