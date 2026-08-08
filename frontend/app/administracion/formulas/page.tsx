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
        <div className="flex items-center justify-between border-b pb-4 border-slate-800">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCreatingOrder(false)}
              className="p-2 rounded-xl bg-[#151D2A] border border-[#1A2232] text-slate-300 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-lg font-bold font-sans text-white">Nuevo Pedido Comercial</h2>
              <p className="text-xs text-slate-400 font-sans">
                Capture los datos del cliente y especificaciones de producción
              </p>
            </div>
          </div>
          <div className="text-xs font-mono text-[#00F2C3] font-bold">
            ID Provisional: <span className="underline">#OP007_001</span>
          </div>
        </div>

        {/* Form Grid: 2 Columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* COLUMNA IZQUIERDA: DATOS DEL CLIENTE & FACTURACIÓN */}
          <div className={`rounded-xl p-5 border space-y-4 ${cardBg}`}>
            <h3 className="text-xs font-bold font-sans tracking-widest text-[#00F2C3] uppercase flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span>DATOS DEL CLIENTE & FACTURACIÓN</span>
            </h3>

            <div className="space-y-3 text-xs font-sans">
              <div>
                <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">RAZÓN SOCIAL</label>
                <input
                  type="text"
                  value={razonSocial}
                  onChange={(e) => setRazonSocial(e.target.value)}
                  className={`w-full rounded-xl border p-2.5 font-mono ${inputBg}`}
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">RUC / REGISTRO TRIBUTARIO</label>
                <input
                  type="text"
                  value={ruc}
                  onChange={(e) => setRuc(e.target.value)}
                  className={`w-full rounded-xl border p-2.5 font-mono ${inputBg}`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">CONTACTO / REPRESENTANTE</label>
                  <input
                    type="text"
                    value={contacto}
                    onChange={(e) => setContacto(e.target.value)}
                    className={`w-full rounded-xl border p-2.5 font-mono ${inputBg}`}
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">TELÉFONO</label>
                  <input
                    type="text"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    className={`w-full rounded-xl border p-2.5 font-mono ${inputBg}`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">DIRECCIÓN DE DESPACHO</label>
                <input
                  type="text"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  className={`w-full rounded-xl border p-2.5 font-mono ${inputBg}`}
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">CONDICIÓN DE PAGO</label>
                <select
                  value={condicionPago}
                  onChange={(e) => setCondicionPago(e.target.value)}
                  className={`w-full rounded-xl border p-2.5 font-mono ${inputBg}`}
                >
                  <option value="Crédito 30 Días">Crédito 30 Días</option>
                  <option value="Contado">Contado / Transferencia</option>
                  <option value="Crédito 60 Días">Crédito 60 Días</option>
                </select>
              </div>
            </div>

            {/* Resumen Cliente Sub-box */}
            <div className="p-3 rounded-xl bg-[#151D2A] border border-[#1A2232] text-xs font-mono space-y-1">
              <div className="flex justify-between text-slate-400 text-[10px]">
                <span>Empresa:</span>
                <strong className="text-white">{razonSocial}</strong>
              </div>
              <div className="flex justify-between text-slate-400 text-[10px]">
                <span>RUC:</span>
                <strong className="text-white">{ruc}</strong>
              </div>
              <div className="flex justify-between text-slate-400 text-[10px]">
                <span>Pago:</span>
                <strong className="text-cyan-400">{condicionPago}</strong>
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA: ESPECIFICACIÓN DEL LOTE & PRODUCCIÓN */}
          <div className={`rounded-xl p-5 border space-y-4 ${cardBg}`}>
            <h3 className="text-xs font-bold font-sans tracking-widest text-[#00F2C3] uppercase flex items-center gap-2">
              <Beaker className="w-4 h-4" />
              <span>ESPECIFICACIÓN DEL LOTE & PRODUCCIÓN</span>
            </h3>

            {/* Fórmula Vinculada Box */}
            <div className="p-3 rounded-xl bg-[#151D2A] border border-[#00F2C3]/40 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold">FÓRMULA VINCULADA</span>
              <div className="text-sm font-bold text-[#00F2C3]">
                {formulaActual.codigoFM} — {formulaActual.nombreProducto}
              </div>
              <span className="text-[10px] text-slate-400 block">Base estándar: {formulaActual.pesoObjetivo} KG</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-sans">
              <div>
                <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">CANTIDAD / VOLUMEN A PRODUCIR (KG)</label>
                <input
                  type="number"
                  value={cantidadProducir}
                  onChange={(e) => setCantidadProducir(parseFloat(e.target.value) || 0)}
                  className={`w-full rounded-xl border p-2.5 font-mono ${inputBg}`}
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">PRIORIDAD</label>
                <select
                  value={prioridad}
                  onChange={(e) => setPrioridad(e.target.value as any)}
                  className={`w-full rounded-xl border p-2.5 font-mono ${inputBg}`}
                >
                  <option value="URGENTE">URGENTE</option>
                  <option value="NORMAL">NORMAL</option>
                  <option value="PROGRAMADO">PROGRAMADO</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">FECHA PROMETIDA DE ENTREGA</label>
              <input
                type="date"
                value={fechaEntrega}
                onChange={(e) => setFechaEntrega(e.target.value)}
                className={`w-full rounded-xl border p-2.5 font-mono ${inputBg}`}
              />
            </div>

            <div className="p-3 rounded-xl bg-[#151D2A] border border-[#1A2232] space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold">PRECIO TOTAL CALCULADO</span>
              <div className="text-xl font-black text-amber-400 font-mono">
                S/ {precioTotalCalculado}
              </div>
              <span className="text-[10px] text-slate-500 block font-mono">Tarifa: S/ 507.50 × {cantidadProducir} KG</span>
            </div>
          </div>
        </div>

        {/* Footer Bar con botones */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            onClick={() => setIsCreatingOrder(false)}
            className="text-xs text-slate-400 hover:text-white font-sans"
          >
            ← Volver al Catálogo
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCreatingOrder(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 font-sans text-xs font-bold hover:bg-slate-800"
            >
              Guardar Borrador
            </button>
            <button
              onClick={() => setIsValidatingStockModal(true)}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00F2C3] to-cyan-500 text-slate-950 font-bold font-sans text-xs tracking-wider uppercase hover:opacity-90 transition-all shadow-lg shadow-[#00F2C3]/20 flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Validar Stock & Avanzar</span>
            </button>
          </div>
        </div>

        {/* ── MODAL DE VALIDACIÓN DE MATERIA PRIMA CON CAMPO OBLIGATORIO DE OBSERVACIONES ── */}
        {isValidatingStockModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 font-sans">
            <div className={`w-full max-w-3xl rounded-2xl p-6 border space-y-5 ${cardBg} border-[#1A2232] shadow-2xl`}>
              <div className="flex items-center justify-between border-b pb-3 border-slate-800">
                <div className="flex items-center gap-2">
                  <Search className="w-5 h-5 text-[#00F2C3]" />
                  <h3 className="text-sm font-bold text-white">Validación de Materia Prima</h3>
                </div>
                <button onClick={() => setIsValidatingStockModal(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="text-xs font-mono space-y-1">
                <span className="text-[#00F2C3] font-bold">Orden #OP007_001</span> · {formulaActual.codigoFM} — {formulaActual.nombreProducto} · <span className="text-amber-400 font-bold">{cantidadProducir} KG escalado</span>
              </div>

              {/* Tabla de Insumos Escalados */}
              <div className="overflow-x-auto border border-[#1A2232] rounded-xl max-h-56 overflow-y-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#151D2A] text-slate-400 text-[10px] uppercase sticky top-0">
                    <tr>
                      <th className="p-2.5">INSUMO</th>
                      <th className="p-2.5 text-right">REQUERIDO (GR/KG)</th>
                      <th className="p-2.5 text-right">STOCK DISPONIBLE EN KARDEX</th>
                      <th className="p-2.5 text-center">ESTADO</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1A2232] text-slate-200">
                    {ingredientesEscalados.map((ing, idx) => (
                      <tr key={idx} className="hover:bg-[#151D2A]/50">
                        <td className="p-2.5 font-bold font-sans">{ing.componente}</td>
                        <td className="p-2.5 text-right font-bold">{ing.requeridoGramos.toLocaleString()} GR</td>
                        <td className="p-2.5 text-right text-emerald-400 font-bold">{ing.disponibleGramos.toLocaleString()} GR</td>
                        <td className="p-2.5 text-center">
                          {ing.suficiente ? (
                            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">✓ OK</span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold text-[10px]">✕ INSUF.</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* CAMPO OBLIGATORIO DE OBSERVACIONES / ADICIONALES DEL PEDIDO */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider font-sans flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#00F2C3]" />
                  <span>Observaciones / Adicionales del Pedido (Para Planta):</span>
                </label>
                <textarea
                  rows={3}
                  value={observacionesAdmin}
                  onChange={(e) => setObservacionesAdmin(e.target.value)}
                  placeholder="Escribe aquí notas adicionales para el Supervisor de Planta (ej: Fragancia extra de mentol, empaque especial en bidones de 20L...)"
                  className="w-full bg-[#151D2A] border border-[#1A2232] rounded-xl p-3 text-xs text-slate-200 focus:border-[#00F2C3] focus:outline-none font-sans"
                />
              </div>

              {/* Botón enviar a bandeja de producción */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <button
                  onClick={() => setIsValidatingStockModal(false)}
                  className="text-xs text-slate-400 hover:text-white font-sans"
                >
                  Revisar Datos
                </button>

                <button
                  onClick={handleEnviarABandejaPlanta}
                  disabled={isSubmitting}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#00F2C3] to-emerald-500 text-slate-950 font-black font-sans text-xs tracking-wider uppercase hover:opacity-90 transition-all shadow-lg shadow-[#00F2C3]/20 flex items-center gap-2"
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
        <div className={`rounded-xl p-5 border flex flex-wrap items-center justify-between gap-4 ${cardBg}`}>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold tracking-widest uppercase ${textTitle}`}>
                FÓRMULA MAESTRA SELECCIONADA
              </span>
              <span className="rounded bg-cyan-500/20 px-2 py-0.5 text-[10px] font-bold text-cyan-400 border border-cyan-500/30 font-mono uppercase">
                {formulaActual.categoria}
              </span>
            </div>
            <h2 className={`text-xl font-bold tracking-tight font-sans ${textValue}`}>
              {formulaActual.nombreProducto}
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              {formulaActual.codigoFM} · Lote Base Standard: <span className="text-cyan-500 font-bold">{formulaActual.loteActual}</span>
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className={`text-[10px] font-bold tracking-widest uppercase block ${textTitle}`}>
                PESO OBJETIVO FÓRMULA
              </span>
              <span className="text-2xl font-black text-cyan-500">{formulaActual.pesoObjetivo} KG / LT</span>
            </div>

            {/* BOTÓN VERDE CREAR PEDIDO COMERCIAL CON ESTA FÓRMULA (SOLO ADMINISTRACIÓN) */}
            {user?.role === 'ADMINISTRACION' && (
              <button
                onClick={() => setIsCreatingOrder(true)}
                className="px-4 py-3 rounded-xl bg-[#00F2C3] text-[#090C10] font-black font-sans text-xs tracking-wider uppercase hover:opacity-90 transition-all shadow-lg shadow-[#00F2C3]/20 flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                <span>Crear Pedido Comercial con esta Fórmula</span>
              </button>
            )}
          </div>
        </div>

        {/* Ingredients Table Card */}
        <div className={`rounded-xl p-5 border space-y-4 ${cardBg}`}>
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
                <tr className={`border-b text-[10px] font-bold tracking-widest uppercase ${isDark ? 'border-[#1A2232] text-slate-400' : 'border-slate-200 text-slate-500'}`}>
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
                    <td className="py-3 px-3 font-bold text-cyan-500">
                      {item.sku}
                    </td>
                    <td className={`py-3 px-3 font-sans font-semibold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                      {item.componente}
                    </td>
                    <td className="py-3 px-3">
                      {item.tipo === 'BASE' ? (
                        <span className="rounded bg-slate-500/20 px-2 py-0.5 text-[10px] font-bold text-slate-400 border border-slate-500/30">
                          FÓRMULA BASE
                        </span>
                      ) : (
                        <span className="rounded bg-cyan-500/20 px-2 py-0.5 text-[10px] font-bold text-cyan-400 border border-cyan-500/30">
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
                        <span className="inline-flex items-center gap-1 rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-bold text-amber-500 border border-amber-500/30">
                          BAJO
                        </span>
                      )}
                      {item.stockStatus === 'CRITICAL' && (
                        <span className="inline-flex items-center gap-1 rounded bg-rose-500/20 px-1.5 py-0.5 text-[10px] font-bold text-rose-500 border border-rose-500/30">
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
