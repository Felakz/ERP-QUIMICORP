'use client';

import React, { useState, useEffect } from 'react';
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
  Copy,
  Plus,
  Trash2,
  Users,
  Tag,
  Scale,
} from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';
import { useAuth } from '@/lib/AuthContext';
import {
  FORMULAS_MAESTRAS_REALES,
  CATEGORIAS_FORMULAS,
  FormulaProducto,
} from '@/lib/formulasData';
import { CommercialOrderForm } from '@/components/pedidos/CommercialOrderForm';

interface ClienteAPI {
  id: string;
  razonSocial: string;
  ruc: string;
}

interface InsumoDetalleAPI {
  id: string;
  insumoId: string;
  porcentaje: number;
  pesoMasaTeorico: number;
  insumo: {
    codigo: string;
    nombre: string;
    unidadMedida: string;
    unidadMedidaVisual?: string;
    stockReal: number;
    familia?: { nombre: string };
  };
}

interface VarianteClienteAPI {
  id: string;
  nombre: string;
  clienteId?: string;
  cliente?: ClienteAPI;
  notas?: string;
}

interface FormulaMasterAPI {
  id: string;
  codigoFormula: string;
  nombreProducto: string;
  version: number;
  densidadTeorica: number;
  estado: string;
  detalles: InsumoDetalleAPI[];
  variants: VarianteClienteAPI[];
}

export default function FormulasPage() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const isDark = theme === 'dark';
  const router = useRouter();

  const [formulasApi, setFormulasApi] = useState<FormulaMasterAPI[]>([]);
  const [clientesApi, setClientesApi] = useState<ClienteAPI[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFormulaId, setSelectedFormulaId] = useState<string>('');
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);

  // Estados para Modales
  const [isCreatingOrder, setIsCreatingOrder] = useState<boolean>(false);
  const [modalClonar, setModalClonar] = useState<boolean>(false);
  const [modalVariante, setModalVariante] = useState<boolean>(false);

  // Formulario Clonar
  const [clonNombre, setClonNombre] = useState<string>('');
  const [clonCodigo, setClonCodigo] = useState<string>('');
  const [clonClienteId, setClonClienteId] = useState<string>('');
  const [clonVarianteNombre, setClonVarianteNombre] = useState<string>('');
  const [clonGuardando, setClonGuardando] = useState<boolean>(false);

  // Formulario Agregar Variante
  const [varianteNombre, setVarianteNombre] = useState<string>('');
  const [varianteClienteId, setVarianteClienteId] = useState<string>('');
  const [varianteNotas, setVarianteNotas] = useState<string>('');
  const [varianteGuardando, setVarianteGuardando] = useState<boolean>(false);

  const fetchFormulas = async () => {
    try {
      setLoading(true);
      const savedToken = typeof window !== 'undefined' ? localStorage.getItem('quimicorp_jwt') : null;
      const authHeader: Record<string, string> = savedToken ? { Authorization: `Bearer ${savedToken}` } : {};

      const [resFormulas, resClientes] = await Promise.all([
        fetch(`http://localhost:3001/api/v1/formulas${searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : ''}`, {
          headers: authHeader,
        }),
        fetch(`http://localhost:3001/api/v1/clientes`, { headers: authHeader }).catch(() => null),
      ]);

      if (resFormulas.ok) {
        const data = await resFormulas.json();
        if (Array.isArray(data) && data.length > 0) {
          setFormulasApi(data);
          if (!selectedFormulaId) {
            setSelectedFormulaId(data[0].id);
          }
        }
      }

      if (resClientes && resClientes.ok) {
        const dataClientes = await resClientes.json();
        if (Array.isArray(dataClientes)) {
          setClientesApi(dataClientes);
        }
      }
    } catch (e) {
      console.log('Fallback a datos locales:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFormulas();
  }, [searchQuery]);

  // Manejo de Clonación
  const handleClonarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formulaSeleccionada || !clonNombre.trim()) return;

    try {
      setClonGuardando(true);
      const savedToken = typeof window !== 'undefined' ? localStorage.getItem('quimicorp_jwt') : null;
      const authHeader: Record<string, string> = savedToken
        ? { 'Content-Type': 'application/json', Authorization: `Bearer ${savedToken}` }
        : { 'Content-Type': 'application/json' };

      const res = await fetch(`http://localhost:3001/api/v1/formulas/${formulaSeleccionada.id}/clonar`, {
        method: 'POST',
        headers: authHeader,
        body: JSON.stringify({
          nuevoNombre: clonNombre.trim(),
          nuevoCodigo: clonCodigo.trim() || undefined,
          clienteId: clonClienteId || undefined,
          nombreVariante: clonVarianteNombre.trim() || undefined,
        }),
      });

      if (res.ok) {
        const clonada = await res.json();
        alert(`✅ Fórmula clonada exitosamente: [${clonada.codigoFormula}] ${clonada.nombreProducto}`);
        setModalClonar(false);
        setClonNombre('');
        setClonCodigo('');
        setClonClienteId('');
        setClonVarianteNombre('');
        await fetchFormulas();
        if (clonada.id) {
          setSelectedFormulaId(clonada.id);
        }
      } else {
        alert('❌ Error al clonar la fórmula.');
      }
    } catch (err) {
      alert('❌ Error de conexión al clonar fórmula.');
    } finally {
      setClonGuardando(false);
    }
  };

  // Manejo de Agregar Variante
  const handleVarianteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formulaSeleccionada || !varianteNombre.trim()) return;

    try {
      setVarianteGuardando(true);
      const savedToken = typeof window !== 'undefined' ? localStorage.getItem('quimicorp_jwt') : null;
      const authHeader: Record<string, string> = savedToken
        ? { 'Content-Type': 'application/json', Authorization: `Bearer ${savedToken}` }
        : { 'Content-Type': 'application/json' };

      const res = await fetch(`http://localhost:3001/api/v1/formulas/${formulaSeleccionada.id}/variantes`, {
        method: 'POST',
        headers: authHeader,
        body: JSON.stringify({
          nombre: varianteNombre.trim(),
          clienteId: varianteClienteId || undefined,
          notas: varianteNotas.trim() || undefined,
        }),
      });

      if (res.ok) {
        alert(`✅ Variante asignada exitosamente a la fórmula.`);
        setModalVariante(false);
        setVarianteNombre('');
        setVarianteClienteId('');
        setVarianteNotas('');
        await fetchFormulas();
      } else {
        alert('❌ Error al registrar variante.');
      }
    } catch (err) {
      alert('❌ Error de conexión al crear variante.');
    } finally {
      setVarianteGuardando(false);
    }
  };

  // Manejo de Eliminar Variante
  const handleEliminarVariante = async (variantId: string) => {
    if (!confirm('¿Deseas desvincular esta variante comercial?')) return;
    try {
      const savedToken = typeof window !== 'undefined' ? localStorage.getItem('quimicorp_jwt') : null;
      const authHeader: Record<string, string> = savedToken ? { Authorization: `Bearer ${savedToken}` } : {};

      const res = await fetch(`http://localhost:3001/api/v1/formulas/variantes/${variantId}`, {
        method: 'DELETE',
        headers: authHeader,
      });

      if (res.ok) {
        await fetchFormulas();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Mapeo unificado para visualización
  const formulasVisual = formulasApi.length > 0
    ? formulasApi.map((f) => ({
        id: f.id,
        codigoFM: f.codigoFormula,
        nombreProducto: f.nombreProducto,
        categoria: 'INDUSTRIAL',
        pesoObjetivo: 100,
        loteActual: 'LOT-MASTER-01',
        variants: f.variants?.map((v) => ({
          id: v.id,
          clienteNombre: v.cliente?.razonSocial || 'Cliente Exclusivo',
          nombreComercial: v.nombre,
          ingredientes: Array.isArray(v.ajustesJson) && v.ajustesJson.length > 0
            ? v.ajustesJson.map((aj: any) => ({
                sku: aj.sku || 'INS-VAR',
                componente: aj.componente || aj.nombre || 'Insumo de Variante',
                tipo: aj.tipo || 'CLIENTE',
                porcentaje: Number(aj.porcentaje) || 0,
                pesoTeorico: Number(aj.pesoTeorico) || 0,
                unidad: 'KG',
              }))
            : f.detalles.map((d: any) => ({
                sku: d.insumo?.codigo || d.skuComponente || 'INS-BOM',
                componente: d.insumo?.nombre || d.nombreComponente || 'Componente Químico',
                tipo: 'BASE',
                porcentaje: Number(d.porcentaje),
                pesoTeorico: Number(d.porcentaje),
                unidad: d.insumo?.unidadMedidaVisual || d.insumo?.unidadMedida || 'KG',
              })),
        })) || [],
        ingredientes: f.detalles.map((d: any) => ({
          sku: d.insumo?.codigo || d.skuComponente || 'INS-BOM',
          componente: d.insumo?.nombre || d.nombreComponente || 'Componente Químico',
          tipo: 'BASE',
          porcentaje: Number(d.porcentaje),
          pesoTeorico: Number(d.porcentaje),
          stockStatus: 'OK',
          unidad: d.insumo?.unidadMedidaVisual || d.insumo?.unidadMedida || 'KG',
        })),
      }))
    : FORMULAS_MAESTRAS_REALES.map((f) => ({
        id: f.id,
        codigoFM: f.codigoFM,
        nombreProducto: f.nombreProducto,
        categoria: f.categoria,
        pesoObjetivo: f.pesoObjetivo || 100,
        loteActual: f.loteActual,
        variants: [],
        ingredientes: f.ingredientes.map((i) => ({
          sku: i.sku,
          componente: i.componente,
          tipo: i.tipo,
          porcentaje: i.porcentaje,
          pesoTeorico: i.pesoTeorico,
          stockStatus: i.stockStatus,
          unidad: 'KG',
        })),
      }));

  const filteredFormulas = formulasVisual.filter((f) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    const matchFormula = f.nombreProducto.toLowerCase().includes(q) || f.codigoFM.toLowerCase().includes(q);
    const matchVariante = f.variants.some(
      (v) => v.nombre.toLowerCase().includes(q) || v.cliente?.razonSocial?.toLowerCase().includes(q)
    );
    return matchFormula || matchVariante;
  });

  const formulaSeleccionada =
    formulasVisual.find((f) => f.id === selectedFormulaId) ||
    filteredFormulas[0] ||
    formulasVisual[0];

  const cardBg = isDark ? 'bg-[#0F141C] border-[#1A2232]' : 'bg-white border-slate-200 shadow-sm';
  const textTitle = isDark ? 'text-slate-400' : 'text-slate-500';
  const textValue = isDark ? 'text-white' : 'text-slate-900';
  const inputBg = isDark
    ? 'bg-[#151D2A] border-[#1A2232] text-slate-200 placeholder-slate-500'
    : 'bg-slate-50 border-slate-300 text-slate-800 placeholder-slate-400';

  if (isCreatingOrder && formulaSeleccionada) {
    return (
      <div className="space-y-5 font-sans min-h-screen">
        <CommercialOrderForm
          context="FORMULA"
          mode="PEDIDO"
          initialData={{
            formulaId: formulaSeleccionada.id,
            producto: `${formulaSeleccionada.codigoFM} - ${formulaSeleccionada.nombreProducto}`,
            cantidadSolicitada: formulaSeleccionada.pesoObjetivo || 100,
            precioUnitario: 34.5,
          }}
          onCancel={() => setIsCreatingOrder(false)}
          onSuccess={() => {
            router.push('/administracion/pedidos');
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-5 font-mono min-h-screen">
      {/* Product Formula Selector & Actions */}
      <div className={`rounded-xl p-5 border space-y-4 ${cardBg}`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Beaker className="h-5 w-5 text-cyan-500" />
            <div>
              <h3 className={`text-xs font-bold tracking-widest uppercase ${textTitle}`}>
                GESTIÓN DE FÓRMULAS MAESTRAS & MARCA BLANCA (ADMINISTRACIÓN / I+D)
              </h3>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                {formulasVisual.length} Fórmulas Maestras registradas en planta con trazabilidad de clientes
              </p>
            </div>
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por fórmula, alias o cliente..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full rounded-lg border py-2 pl-9 pr-3 text-xs focus:border-[#00F2C3] focus:outline-none transition-all font-sans ${inputBg}`}
            />
          </div>
        </div>

        {/* Quick Selector Grid */}
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3 max-h-52 overflow-y-auto pr-1">
          {filteredFormulas.map((f) => {
            const isSelected = f.id === formulaSeleccionada?.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setSelectedFormulaId(f.id)}
                className={`rounded-lg p-3 text-left transition-all border space-y-1.5 ${
                  isSelected
                    ? isDark
                      ? 'bg-[#151D2A] border-[#00F2C3] ring-1 ring-[#00F2C3]/30 shadow-md'
                      : 'bg-cyan-50/70 border-cyan-500 ring-1 ring-cyan-500/20 shadow-sm'
                    : isDark
                    ? 'bg-[#0B0F17] border-[#1A2232] hover:bg-[#151D2A]/60'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-mono font-bold text-cyan-500">{f.codigoFM}</span>
                  <span className="px-1.5 py-0.5 rounded font-bold uppercase text-[9px] bg-slate-800 text-slate-300 border border-slate-700">
                    {f.ingredientes.length} Insumos
                  </span>
                </div>
                <h4 className={`text-xs font-bold font-sans truncate ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                  {f.nombreProducto}
                </h4>

                {f.variants.length > 0 && (
                  <div className="flex items-center gap-1 text-[10px] text-purple-400 font-sans truncate pt-1 border-t border-slate-800/40">
                    <Tag className="w-3 h-3 shrink-0" />
                    <span>{f.variants.length} Variante(s) de Marca Blanca</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {formulaSeleccionada && (
        <div className="space-y-4">
          {/* Formula Header Card with CLONAR, AGREGAR VARIANTE and COTIZAR buttons */}
          <div className={`rounded-xl p-5 border flex flex-wrap items-center justify-between gap-4 shadow-sm ${cardBg}`}>
            <div className="space-y-1 max-w-xl">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold tracking-widest uppercase ${textTitle}`}>
                  FÓRMULA QUÍMICA MAESTRA
                </span>
                <span className="rounded bg-cyan-500/20 px-2 py-0.5 text-[10px] font-bold text-cyan-400 border border-cyan-500/30 font-mono uppercase">
                  {formulaSeleccionada.categoria}
                </span>
              </div>
              <h2 className={`text-xl font-bold tracking-tight font-sans ${textValue}`}>
                {formulaSeleccionada.nombreProducto}
              </h2>
              <p className={`text-xs font-mono ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {formulaSeleccionada.codigoFM} · Base Standard 100% Química
              </p>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              {/* BOTÓN CLONAR FÓRMULA */}
              <button
                onClick={() => {
                  setClonNombre(`${formulaSeleccionada.nombreProducto} (Exclusiva)`);
                  setClonCodigo('');
                  setModalClonar(true);
                }}
                className={`px-3.5 py-2.5 rounded-xl font-bold font-sans text-xs transition-all flex items-center gap-2 border ${
                  isDark
                    ? 'bg-purple-950/40 border-purple-500/40 text-purple-300 hover:bg-purple-900/60'
                    : 'bg-purple-50 border-purple-300 text-purple-800 hover:bg-purple-100'
                }`}
              >
                <Copy className="w-4 h-4 text-purple-400" />
                <span>🧬 Clonar Fórmula</span>
              </button>

              {/* BOTÓN AGREGAR VARIANTE DE CLIENTE */}
              <button
                onClick={() => setModalVariante(true)}
                className={`px-3.5 py-2.5 rounded-xl font-bold font-sans text-xs transition-all flex items-center gap-2 border ${
                  isDark
                    ? 'bg-cyan-950/40 border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/60'
                    : 'bg-cyan-50 border-cyan-300 text-cyan-800 hover:bg-cyan-100'
                }`}
              >
                <Plus className="w-4 h-4 text-cyan-400" />
                <span>🏷️ Asignar Variante</span>
              </button>

              {/* BOTÓN COTIZAR / CREAR PEDIDO */}
              <button
                onClick={() => setIsCreatingOrder(true)}
                className={`px-4 py-2.5 rounded-xl font-black font-sans text-xs tracking-wider uppercase transition-all shadow-lg flex items-center gap-2 ${
                  isDark
                    ? 'bg-[#00F2C3] text-[#090C10] hover:opacity-90 shadow-[#00F2C3]/20'
                    : 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-600/20'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Cotizar Pedido</span>
              </button>
            </div>
          </div>

          {/* Variantes de Clientes Asociadas a esta Fórmula Maestra */}
          <div className={`rounded-xl p-5 border space-y-3 ${cardBg}`}>
            <div className="flex items-center justify-between border-b pb-3 border-slate-800/40 font-sans">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-purple-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300">
                  Variantes de Clientes & Nombres de Marca Blanca ({formulaSeleccionada.variants.length})
                </h4>
              </div>
              <span className="text-[11px] text-slate-400">
                Múltiples clientes pueden usar esta misma base química con nombres de etiqueta distintos
              </span>
            </div>

            {formulaSeleccionada.variants.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400 font-sans">
                No hay variantes de clientes asociadas aún. Usa el botón <strong>&quot;🏷️ Asignar Variante&quot;</strong> para colgar marcas de clientes a esta receta maestra.
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedVariantId(null)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-bold font-sans transition-all ${
                      selectedVariantId === null
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-black shadow-md'
                        : isDark
                        ? 'bg-[#151D2A] text-slate-300 border-slate-700 hover:border-slate-500'
                        : 'bg-slate-100 text-slate-700 border-slate-300'
                    }`}
                  >
                    🧪 Receta Base ({formulaSeleccionada.ingredientes.length} Insumos)
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {formulaSeleccionada.variants.map((v) => {
                    const isActive = selectedVariantId === v.id;
                    return (
                      <div
                        key={v.id}
                        onClick={() => setSelectedVariantId(v.id)}
                        className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                          isActive
                            ? 'bg-purple-950/80 border-purple-400 ring-2 ring-purple-400/40 shadow-lg scale-[1.01]'
                            : isDark
                            ? 'bg-[#151D2A]/70 border-[#1A2232] hover:border-purple-500/50 hover:bg-[#151D2A]'
                            : 'bg-slate-50 border-slate-200 hover:border-purple-300'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-purple-400" />
                            <span className="text-[11px] font-bold text-slate-300 font-sans">
                              {v.clienteNombre}
                            </span>
                          </div>
                          <h5 className="text-xs font-black text-cyan-400 font-sans truncate">
                            &quot;{v.nombreComercial}&quot;
                          </h5>
                          <span className="text-[10px] text-slate-400 font-mono block">
                            {v.ingredientes.length} insumos específicos
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEliminarVariante(v.id);
                          }}
                          title="Desvincular Variante"
                          className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/20 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Ingredients Table Card */}
          {(() => {
            const varActiva = formulaSeleccionada.variants.find((v) => v.id === selectedVariantId);
            const ingredientesVisualizar = varActiva ? varActiva.ingredientes : formulaSeleccionada.ingredientes;

            return (
              <div className={`rounded-xl p-5 border space-y-4 shadow-sm ${cardBg}`}>
                <div className={`flex flex-wrap items-center justify-between gap-2 border-b pb-3 ${isDark ? 'border-[#1A2232]' : 'border-slate-200'}`}>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold tracking-widest uppercase font-sans ${textTitle}`}>
                      {varActiva ? (
                        <span className="text-purple-300 font-black">
                          RECETA ESPECÍFICA PARA CLIENTE [{varActiva.clienteNombre}] ({ingredientesVisualizar.length} INGREDIENTES)
                        </span>
                      ) : (
                        <span>
                          COMPONENTES QUÍMICOS DE FÓRMULA BASE ({ingredientesVisualizar.length} INGREDIENTES)
                        </span>
                      )}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    Composición Total: {ingredientesVisualizar.reduce((acc: number, i: any) => acc + Number(i.porcentaje), 0).toFixed(2)}%
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead>
                      <tr className={`border-b text-[10px] font-bold tracking-widest uppercase ${isDark ? 'border-[#1A2232] text-slate-400' : 'border-slate-200 text-slate-700 bg-slate-50'}`}>
                        <th className="py-2.5 px-3">SKU</th>
                        <th className="py-2.5 px-3">COMPONENTE QUÍMICO</th>
                        <th className="py-2.5 px-3">TIPO</th>
                        <th className="py-2.5 px-3 text-right">PROPORCIÓN (%)</th>
                        <th className="py-2.5 px-3 text-right">PESO TEÓRICO (KG)</th>
                        <th className="py-2.5 px-3 text-center">ESTADO</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${isDark ? 'divide-[#1A2232]/60 font-mono' : 'divide-slate-200 font-mono'}`}>
                      {ingredientesVisualizar.map((item: any, idx: number) => (
                        <tr key={`${item.sku}-${idx}`} className={`transition-colors ${isDark ? 'hover:bg-[#151D2A]/50' : 'hover:bg-slate-50'}`}>
                          <td className={`py-3 px-3 font-bold ${isDark ? 'text-cyan-400' : 'text-teal-700'}`}>
                            {item.sku}
                          </td>
                          <td className={`py-3 px-3 font-sans font-bold uppercase text-xs ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                            {item.componente}
                          </td>
                          <td className="py-3 px-3">
                            <span className="rounded px-2 py-0.5 text-[10px] font-bold border uppercase bg-slate-800 text-slate-300 border-slate-700">
                              {item.tipo || 'BASE'}
                            </span>
                          </td>
                          <td className={`py-3 px-3 text-right font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                            {Number(item.porcentaje).toFixed(2)}%
                          </td>
                          <td className={`py-3 px-3 text-right font-black text-cyan-400`}>
                            {Number(item.pesoTeorico || (Number(item.porcentaje) * 10)).toFixed(3)} KG
                          </td>
                          <td className="py-3 px-3 text-center">
                            <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block shadow-sm shadow-emerald-500/50" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* MODAL CLONAR FÓRMULA */}
      {modalClonar && formulaSeleccionada && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200 font-sans">
          <div className={`w-full max-w-lg rounded-2xl border p-6 shadow-2xl space-y-4 ${cardBg}`}>
            <div className="flex items-center justify-between border-b pb-3 border-slate-800/60">
              <div className="flex items-center gap-2 text-purple-400">
                <Copy className="w-5 h-5" />
                <h3 className="text-base font-black uppercase tracking-wide">
                  Clonar Fórmula Maestra
                </h3>
              </div>
              <button
                onClick={() => setModalClonar(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Esta acción duplicará todos los componentes e ingredientes de <strong className="text-cyan-400">{formulaSeleccionada.codigoFM}</strong> en una nueva fórmula aislada para permitir ajustes exclusivos.
            </p>

            <form onSubmit={handleClonarSubmit} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                  Nombre de la Nueva Fórmula Maestra *
                </label>
                <input
                  type="text"
                  required
                  value={clonNombre}
                  onChange={(e) => setClonNombre(e.target.value)}
                  className={`w-full rounded-xl border p-2.5 text-xs focus:border-[#00F2C3] focus:outline-none ${inputBg}`}
                  placeholder="Ej: Crema Anticelulitis Fórmula Plus"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                  Código Sugerido (Opcional, auto-generado si se deja vacío)
                </label>
                <input
                  type="text"
                  value={clonCodigo}
                  onChange={(e) => setClonCodigo(e.target.value)}
                  className={`w-full rounded-xl border p-2.5 text-xs focus:border-[#00F2C3] focus:outline-none ${inputBg}`}
                  placeholder="Ej: FM-045"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                  Asignar a Cliente Exclusivo (Opcional)
                </label>
                <select
                  value={clonClienteId}
                  onChange={(e) => setClonClienteId(e.target.value)}
                  className={`w-full rounded-xl border p-2.5 text-xs focus:border-[#00F2C3] focus:outline-none ${inputBg}`}
                >
                  <option value="">-- Ninguno (Fórmula General) --</option>
                  {clientesApi.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.razonSocial} (RUC: {c.ruc})
                    </option>
                  ))}
                </select>
              </div>

              {clonClienteId && (
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                    Nombre Comercial de Etiqueta para este Cliente
                  </label>
                  <input
                    type="text"
                    value={clonVarianteNombre}
                    onChange={(e) => setClonVarianteNombre(e.target.value)}
                    className={`w-full rounded-xl border p-2.5 text-xs focus:border-[#00F2C3] focus:outline-none ${inputBg}`}
                    placeholder="Ej: Crema Piernas Gold Edition"
                  />
                </div>
              )}

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-800/60">
                <button
                  type="button"
                  onClick={() => setModalClonar(false)}
                  className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={clonGuardando}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  <span>{clonGuardando ? 'Clonando...' : 'Confirmar Clonación'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL AGREGAR VARIANTE DE CLIENTE */}
      {modalVariante && formulaSeleccionada && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200 font-sans">
          <div className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl space-y-4 ${cardBg}`}>
            <div className="flex items-center justify-between border-b pb-3 border-slate-800/60">
              <div className="flex items-center gap-2 text-cyan-400">
                <Tag className="w-5 h-5" />
                <h3 className="text-base font-black uppercase tracking-wide">
                  Asignar Variante de Cliente
                </h3>
              </div>
              <button
                onClick={() => setModalVariante(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Asocia un nombre de etiqueta comercial a la fórmula <strong className="text-cyan-400">{formulaSeleccionada.nombreProducto}</strong>.
            </p>

            <form onSubmit={handleVarianteSubmit} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                  Cliente Comercial *
                </label>
                <select
                  required
                  value={varianteClienteId}
                  onChange={(e) => setVarianteClienteId(e.target.value)}
                  className={`w-full rounded-xl border p-2.5 text-xs focus:border-[#00F2C3] focus:outline-none ${inputBg}`}
                >
                  <option value="">-- Seleccionar Cliente --</option>
                  {clientesApi.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.razonSocial} (RUC: {c.ruc})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                  Nombre Comercial / Etiqueta de Marca Blanca *
                </label>
                <input
                  type="text"
                  required
                  value={varianteNombre}
                  onChange={(e) => setVarianteNombre(e.target.value)}
                  className={`w-full rounded-xl border p-2.5 text-xs focus:border-[#00F2C3] focus:outline-none ${inputBg}`}
                  placeholder="Ej: Crema Anticelulitis Extra Fuerte"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                  Notas Adicionales
                </label>
                <textarea
                  rows={2}
                  value={varianteNotas}
                  onChange={(e) => setVarianteNotas(e.target.value)}
                  className={`w-full rounded-xl border p-2.5 text-xs focus:border-[#00F2C3] focus:outline-none ${inputBg}`}
                  placeholder="Ej: Etiqueta dorada con tapa rosca 100ml"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-800/60">
                <button
                  type="button"
                  onClick={() => setModalVariante(false)}
                  className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={varianteGuardando}
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 text-xs font-bold shadow-lg shadow-cyan-600/30 flex items-center gap-2"
                >
                  <Tag className="w-4 h-4" />
                  <span>{varianteGuardando ? 'Guardando...' : 'Guardar Variante'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
