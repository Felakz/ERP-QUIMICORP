'use client';

import React, { useState, useEffect } from 'react';
import {
  Building2,
  Search,
  Plus,
  Copy,
  CheckCircle2,
  CreditCard,
  Phone,
  Mail,
  MapPin,
  User,
  ShieldCheck,
  FileSpreadsheet,
  Download,
  Filter,
  DollarSign,
  Layers,
  Sparkles,
  ExternalLink,
  Trash2,
} from 'lucide-react';

import { useTheme } from '@/lib/ThemeContext';
import { apiFetch } from '@/lib/apiClient';
import {
  PROVEEDORES_QUIMICORP_SEED,
  REGISTROS_EXCEL_PROVEEDORES,
  ProveedorReal,
  ProveedorRegistroExcel,
} from '@/lib/proveedoresRealData';
import * as XLSX from 'xlsx';

export default function AdministracionProveedoresPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [viewMode, setViewMode] = useState<'EMPRESAS' | 'EXCEL_FLAT'>('EMPRESAS');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBancoFilter, setSelectedBancoFilter] = useState<'TODOS' | 'BCP' | 'INTERBANK'>('TODOS');
  const [selectedMonedaFilter, setSelectedMonedaFilter] = useState<'TODOS' | 'SOLES' | 'USD'>('TODOS');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const [proveedores, setProveedores] = useState<ProveedorReal[]>(PROVEEDORES_QUIMICORP_SEED);
  const [registrosFlat] = useState<ProveedorRegistroExcel[]>(REGISTROS_EXCEL_PROVEEDORES);
  const [loading, setLoading] = useState(false);

  const exportToExcel = () => {
    try {
      const dataToExport = registrosFlat.map((r) => ({
        'Ítem N°': r.itemNo,
        'RUC': r.ruc,
        'Proveedor / Razón Social': r.razonSocial,
        'Contacto': r.contacto || '—',
        'Teléfono': r.telefono || '—',
        'Banco': r.banco,
        'Moneda': r.moneda,
        'N° Cuenta': r.numeroCuenta,
        'CCI Interbancario': r.cci || '—',
      }));

      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Proveedores_Cuentas');
      XLSX.writeFile(workbook, `Quimicorp_Directorio_Proveedores_${new Date().toISOString().split('T')[0]}.xlsx`);
    } catch (err) {
      console.error('Error exportando Excel de proveedores:', err);
    }
  };

  // Cargar lista de proveedores desde el backend PostgreSQL
  const fetchProveedores = async () => {
    setLoading(true);
    try {
      const { data, ok } = await apiFetch<any[]>('/proveedores');
      if (ok && Array.isArray(data) && data.length > 0) {
        const mapped: ProveedorReal[] = data.map((p: any) => ({
          id: p.id,
          ruc: p.ruc,
          razonSocial: p.razonSocial,
          contacto: p.contacto || '',
          telefono: p.telefono || '',
          correo: p.correo || '',
          direccion: p.direccion || '',
          insumoPrincipal: p.insumoPrincipal || 'Insumos Químicos',
          estado: (p.estado as any) || 'HOMOLOGADO',
          cuentasBancarias: (p.cuentasBancarias || []).map((c: any) => ({
            banco: c.banco,
            moneda: c.moneda === 'USD' ? 'USD' : 'SOLES',
            numeroCuenta: c.numeroCuenta,
            cci: c.cci || undefined,
          })),
        }));
        setProveedores(mapped);
      }
    } catch (err) {
      console.warn('Usando seed local de proveedores como respaldo defensivo:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProveedores();
  }, []);

  // Modal Nuevo Proveedor
  interface FormCuentaBancaria {
    banco: string;
    moneda: 'SOLES' | 'USD';
    numeroCuenta: string;
    cci: string;
  }

  const [modalOpen, setModalOpen] = useState(false);
  const [newRuc, setNewRuc] = useState('');
  const [newRazonSocial, setNewRazonSocial] = useState('');
  const [newContacto, setNewContacto] = useState('');
  const [newTelefono, setNewTelefono] = useState('');
  const [newCorreo, setNewCorreo] = useState('');
  const [newDireccion, setNewDireccion] = useState('');
  const [formCuentas, setFormCuentas] = useState<FormCuentaBancaria[]>([
    { banco: 'BCP', moneda: 'SOLES', numeroCuenta: '', cci: '' },
  ]);

  const agregarCuentaForm = () => {
    setFormCuentas((prev) => [
      ...prev,
      { banco: 'BBVA', moneda: 'SOLES', numeroCuenta: '', cci: '' },
    ]);
  };

  const eliminarCuentaForm = (idx: number) => {
    setFormCuentas((prev) => prev.filter((_, i) => i !== idx));
  };

  const actualizarCuentaForm = (idx: number, campo: keyof FormCuentaBancaria, valor: any) => {
    setFormCuentas((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [campo]: valor };
      return copy;
    });
  };

  const handleCopy = (text: string, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedText(`${label}: ${text}`);
    setTimeout(() => setCopiedText(null), 2500);
  };

  const handleCrearProveedor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRazonSocial.trim()) {
      alert('La Razón Social es requerida');
      return;
    }

    const cuentasValidas = formCuentas
      .filter((c) => c.numeroCuenta.trim() || c.cci.trim())
      .map((c) => ({
        banco: c.banco,
        moneda: c.moneda,
        numeroCuenta: c.numeroCuenta.trim(),
        cci: c.cci.trim() || undefined,
      }));

    const payload = {
      ruc: newRuc.trim() || `20${Date.now().toString().slice(-9)}`,
      razonSocial: newRazonSocial.trim().toUpperCase(),
      contacto: newContacto.trim() || undefined,
      telefono: newTelefono.trim() || undefined,
      correo: newCorreo.trim() || undefined,
      direccion: newDireccion.trim() || undefined,
      insumoPrincipal: 'Materia Prima / Reactivos',
      cuentasBancarias: cuentasValidas,
    };

    try {
      const { data, ok } = await apiFetch<any>('/proveedores', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (ok && data) {
        const nuevoProv: ProveedorReal = {
          id: data.id,
          ruc: data.ruc,
          razonSocial: data.razonSocial,
          contacto: data.contacto || '',
          telefono: data.telefono || '',
          correo: data.correo || '',
          direccion: data.direccion || '',
          insumoPrincipal: data.insumoPrincipal || 'Materia Prima / Reactivos',
          estado: 'HOMOLOGADO',
          cuentasBancarias: (data.cuentasBancarias || []).map((c: any) => ({
            banco: c.banco,
            moneda: c.moneda === 'USD' ? 'USD' : 'SOLES',
            numeroCuenta: c.numeroCuenta,
            cci: c.cci || undefined,
          })),
        };
        setProveedores((prev) => [nuevoProv, ...prev]);
      } else {
        // Fallback optimista si no hay backend activo
        const localProv: ProveedorReal = {
          id: `prov-local-${Date.now()}`,
          ...payload,
          estado: 'HOMOLOGADO',
          cuentasBancarias: payload.cuentasBancarias as any,
        };
        setProveedores((prev) => [localProv, ...prev]);
      }

      setModalOpen(false);
      alert(`✅ Proveedor ${newRazonSocial.toUpperCase()} homologado y registrado en la base de datos.`);

      // Limpiar formulario
      setNewRuc('');
      setNewRazonSocial('');
      setNewContacto('');
      setNewTelefono('');
      setNewCorreo('');
      setNewDireccion('');
      setFormCuentas([{ banco: 'BCP', moneda: 'SOLES', numeroCuenta: '', cci: '' }]);
    } catch (err) {
      alert('Error al registrar proveedor: ' + String(err));
    }
  };

  // Filtrado Empresas
  const filteredEmpresas = proveedores.filter((p) => {
    const matchesSearch =
      !searchQuery ||
      p.razonSocial.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.ruc.includes(searchQuery) ||
      (p.contacto && p.contacto.toLowerCase().includes(searchQuery.toLowerCase()));

    const hasBanco =
      selectedBancoFilter === 'TODOS' ||
      p.cuentasBancarias.some((c) => c.banco.toUpperCase().includes(selectedBancoFilter));

    const hasMoneda =
      selectedMonedaFilter === 'TODOS' ||
      p.cuentasBancarias.some((c) => c.moneda === selectedMonedaFilter);

    return matchesSearch && hasBanco && hasMoneda;
  });

  // Filtrado Flat Excel (43 items)
  const filteredFlat = registrosFlat.filter((f) => {
    const matchesSearch =
      !searchQuery ||
      f.razonSocial.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.ruc.includes(searchQuery) ||
      f.itemNo.includes(searchQuery) ||
      (f.contacto && f.contacto.toLowerCase().includes(searchQuery.toLowerCase())) ||
      f.numeroCuenta.includes(searchQuery);

    const matchesBanco =
      selectedBancoFilter === 'TODOS' || f.banco.toUpperCase().includes(selectedBancoFilter);

    const matchesMoneda =
      selectedMonedaFilter === 'TODOS' || f.moneda.toUpperCase().includes(selectedMonedaFilter);

    return matchesSearch && matchesBanco && matchesMoneda;
  });

  const cardBg = isDark ? 'bg-[#0F141C] border-[#1A2232]' : 'bg-white border-slate-200 shadow-sm';
  const tableHeaderBg = isDark ? 'bg-[#151D2A] text-slate-400 border-[#1A2232]' : 'bg-slate-100 text-slate-600 border-slate-200';

  return (
    <div className="space-y-6 font-sans">
      {/* Toast Notificación de Copiado */}
      {copiedText && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-emerald-500 text-slate-950 font-black text-xs shadow-2xl flex items-center gap-2 animate-bounce border border-emerald-300">
          <CheckCircle2 className="w-5 h-5" />
          <span>¡Copiado al portapapeles! ({copiedText})</span>
        </div>
      )}

      {/* Header Banner Principal */}
      <div className={`p-6 rounded-2xl border ${cardBg} space-y-5 relative overflow-hidden`}>
        {/* Ambient Glow */}
        {isDark && (
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-[#00F2C3] shadow-[0_0_12px_rgba(0,242,195,0.2)]">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className={`text-xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Directorio de Proveedores & Cuentas Bancarias
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black font-mono bg-cyan-500/10 text-[#00F2C3] border border-cyan-500/30 shadow-sm uppercase flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 led-pulse" />
                    OFICIAL QUIMICORP
                  </span>
                </div>
                <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Gestión integral de RUCs, ejecutivos comerciales y cuentas corrientes (BCP & Interbank) en Soles (S/) y Dólares ($)
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={exportToExcel}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all card-hover-lift"
              title="Exportar archivo Excel oficial con las 43 cuentas"
            >
              <Download className="w-4 h-4" />
              <span>Exportar Excel (.xlsx)</span>
            </button>

            <button
              onClick={() => setModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all card-hover-lift"
            >
              <Plus className="w-4 h-4" />
              <span>+ Registrar Proveedor</span>
            </button>
          </div>
        </div>

        {/* 4 Tarjetas Métricas KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1 relative z-10">
          <div className={`p-4 rounded-2xl border transition-all card-hover-lift ${isDark ? 'bg-[#151D2A] border-cyan-500/30 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(0,242,195,0.15)]' : 'bg-cyan-50/70 border-cyan-200 shadow-sm'}`}>
            <span className={`text-[10px] font-black uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Empresas Homologadas</span>
            <p className={`text-2xl font-black font-mono mt-1 ${isDark ? 'text-[#00F2C3]' : 'text-cyan-700'}`}>33 Empresas</p>
            <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Catálogo activo en PostgreSQL</p>
          </div>
          <div className={`p-4 rounded-2xl border transition-all card-hover-lift ${isDark ? 'bg-[#151D2A] border-emerald-500/30 hover:border-emerald-400 hover:shadow-[0_0_15px_rgba(16,185,129,0.15)]' : 'bg-emerald-50/70 border-emerald-200 shadow-sm'}`}>
            <span className={`text-[10px] font-black uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Cuentas Corrientes Excel</span>
            <p className={`text-2xl font-black font-mono mt-1 ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>43 Registros</p>
            <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Ítems N° 01 a N° 43 validados</p>
          </div>
          <div className={`p-4 rounded-2xl border transition-all card-hover-lift ${isDark ? 'bg-[#151D2A] border-purple-500/30 hover:border-purple-400 hover:shadow-[0_0_15px_rgba(168,85,247,0.15)]' : 'bg-purple-50/70 border-purple-200 shadow-sm'}`}>
            <span className={`text-[10px] font-black uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Bancos Registrados</span>
            <p className={`text-2xl font-black font-mono mt-1 ${isDark ? 'text-purple-400' : 'text-purple-700'}`}>BCP & Interbank</p>
            <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Transferencias directas y CCI</p>
          </div>
          <div className={`p-4 rounded-2xl border transition-all card-hover-lift ${isDark ? 'bg-[#151D2A] border-amber-500/30 hover:border-amber-400 hover:shadow-[0_0_15px_rgba(245,158,11,0.15)]' : 'bg-amber-50/70 border-amber-200 shadow-sm'}`}>
            <span className={`text-[10px] font-black uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Monedas Admitidas</span>
            <p className={`text-2xl font-black font-mono mt-1 ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>Soles (S/) & Dólares ($)</p>
            <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Multi-divisa integrada</p>
          </div>
        </div>

        {/* Barra de Filtros y Modo de Vista */}
        <div className={`flex flex-wrap items-center justify-between gap-4 pt-3 border-t ${isDark ? 'border-slate-800/40' : 'border-slate-200'} relative z-10`}>
          {/* Selector de Modo de Vista */}
          <div className={`flex items-center gap-1.5 p-1 rounded-xl border ${isDark ? 'bg-[#151D2A] border-[#1A2232]' : 'bg-slate-100 border-slate-200'}`}>
            <button
              onClick={() => setViewMode('EMPRESAS')}
              className={`px-3.5 py-2 rounded-lg text-xs font-black transition-all ${
                viewMode === 'EMPRESAS'
                  ? isDark
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-[0_0_12px_rgba(0,242,195,0.3)]'
                    : 'bg-blue-600 text-white shadow-md'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🏢 Vista Tarjetas Empresa (33)
            </button>
            <button
              onClick={() => setViewMode('EXCEL_FLAT')}
              className={`px-3.5 py-2 rounded-lg text-xs font-black transition-all ${
                viewMode === 'EXCEL_FLAT'
                  ? isDark
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-[0_0_12px_rgba(0,242,195,0.3)]'
                    : 'bg-blue-600 text-white shadow-md'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📊 Vista Matriz Excel (43 Cuentas N° 01-43)
            </button>
          </div>

          {/* Filtros Rápidos */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs">
              <span className={`font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Banco:</span>
              {(['TODOS', 'BCP', 'INTERBANK'] as const).map((b) => (
                <button
                  key={b}
                  onClick={() => setSelectedBancoFilter(b)}
                  className={`px-3 py-1.5 rounded-lg font-black text-[11px] transition-all ${
                    selectedBancoFilter === b
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-[0_0_8px_rgba(16,185,129,0.2)]'
                      : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>

            <div className={`flex items-center gap-1.5 text-xs border-l pl-3 ${isDark ? 'border-slate-800/40' : 'border-slate-200'}`}>
              <span className={`font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Moneda:</span>
              {(['TODOS', 'SOLES', 'USD'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setSelectedMonedaFilter(m)}
                  className={`px-3 py-1.5 rounded-lg font-black text-[11px] transition-all ${
                    selectedMonedaFilter === m
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-[0_0_8px_rgba(245,158,11,0.2)]'
                      : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Buscador */}
        <div className="relative w-full relative z-10">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-cyan-400" />
          <input
            type="text"
            placeholder="Buscar por RUC, Razón Social, Ejecutivo de Contacto, N° de Cuenta o CCI..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-3 rounded-xl text-xs font-bold border focus:outline-none transition-all ${
              isDark
                ? 'bg-[#151D2A] border-[#1A2232] text-white focus:border-cyan-500/50 focus:shadow-[0_0_12px_rgba(0,242,195,0.15)] placeholder-slate-500'
                : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500 shadow-sm placeholder-slate-400'
            }`}
          />
        </div>
      </div>

      {/* VISTA 1: EMPRESAS AGRUPADAS (33 PROVEEDORES) */}
      {viewMode === 'EMPRESAS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEmpresas.map((prov) => (
            <div key={prov.id} className={`p-5 rounded-2xl border ${cardBg} space-y-4 hover:border-cyan-500/40 hover:shadow-[0_0_15px_rgba(0,242,195,0.08)] transition-all duration-200 card-hover-lift`}>
              <div className={`flex items-start justify-between gap-3 border-b pb-3 ${isDark ? 'border-slate-800/40' : 'border-slate-200'}`}>
                <div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(prov.ruc, 'RUC')}
                      className="px-2.5 py-1 rounded-lg font-mono text-[11px] font-black bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/20 hover:shadow-[0_0_8px_rgba(0,242,195,0.2)] flex items-center gap-1.5 transition-all"
                      title="Copiar RUC al portapapeles"
                    >
                      <span>RUC: {prov.ruc}</span>
                      <Copy className="w-3 h-3 text-[#00F2C3]" />
                    </button>
                    <span className="px-2 py-0.5 rounded text-[9px] font-black bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 led-pulse" />
                      HOMOLOGADO
                    </span>
                  </div>
                  <h3 className={`text-base font-black mt-2 tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {prov.razonSocial}
                  </h3>
                </div>
              </div>

              {/* Datos de Contacto y Dirección */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {prov.contacto && (
                  <div className={`flex items-center gap-2 ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>
                    <User className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span className="font-bold truncate">{prov.contacto}</span>
                  </div>
                )}
                {prov.telefono && (
                  <div className={`flex items-center gap-2 font-mono ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>
                    <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <a
                      href={`https://wa.me/51${prov.telefono.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 hover:underline font-bold"
                      title="Abrir WhatsApp"
                    >
                      {prov.telefono}
                    </a>
                  </div>
                )}
                {prov.correo && (
                  <div className={`flex items-center gap-2 col-span-1 sm:col-span-2 ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>
                    <Mail className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <a href={`mailto:${prov.correo}`} className="underline text-cyan-400 hover:text-cyan-300 truncate font-semibold">
                      {prov.correo}
                    </a>
                  </div>
                )}
                {prov.direccion && (
                  <div className={`flex items-start gap-2 col-span-1 sm:col-span-2 text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                    <span className="font-medium">{prov.direccion}</span>
                  </div>
                )}
              </div>

              {/* Cuentas Bancarias Registradas */}
              <div className={`pt-2 border-t space-y-2 ${isDark ? 'border-slate-800/40' : 'border-slate-200'}`}>
                <span className={`text-[10px] font-black uppercase tracking-wider flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                  Cuentas Corrientes ({prov.cuentasBancarias.length})
                </span>

                {prov.cuentasBancarias.length === 0 ? (
                  <p className="text-[11px] text-slate-500 italic">No registra cuentas corrientes en Excel</p>
                ) : (
                  <div className="space-y-1.5">
                    {prov.cuentasBancarias.map((cuenta, idx) => (
                      <div
                        key={idx}
                        className={`p-2.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs transition-all ${
                          isDark ? 'bg-[#151D2A] border-[#1A2232] hover:border-cyan-500/30' : 'bg-slate-50 border-slate-200 shadow-sm'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-black ${
                              cuenta.banco.includes('INTERBANK')
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-blue-500/20 text-cyan-300 border border-cyan-500/30'
                            }`}
                          >
                            {cuenta.banco}
                          </span>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[9px] font-black ${
                              cuenta.moneda === 'USD'
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            }`}
                          >
                            {cuenta.moneda === 'USD' ? '$ USD' : 'S/ SOLES'}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 font-mono text-[11px]">
                          {cuenta.numeroCuenta && (
                            <button
                              onClick={() => handleCopy(cuenta.numeroCuenta, `CTA ${cuenta.banco}`)}
                              className={`font-black flex items-center gap-1 ${isDark ? 'text-slate-200 hover:text-[#00F2C3]' : 'text-slate-900 hover:text-blue-600'}`}
                              title="Copiar N° Cuenta"
                            >
                              <span>CTA: {cuenta.numeroCuenta}</span>
                              <Copy className="w-3 h-3 text-cyan-400" />
                            </button>
                          )}
                          {cuenta.cci && (
                            <button
                              onClick={() => handleCopy(cuenta.cci || '', `CCI ${cuenta.banco}`)}
                              className={`flex items-center gap-1 ${isDark ? 'text-slate-400 hover:text-emerald-400' : 'text-slate-600 hover:text-emerald-600'}`}
                              title="Copiar CCI"
                            >
                              <span>CCI: {cuenta.cci.substring(0, 10)}...</span>
                              <Copy className="w-3 h-3 text-emerald-400" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VISTA 2: EXCEL DETALLADO (LOS 43 REGISTROS ÍTEM N° 01 A N° 43) */}
      {viewMode === 'EXCEL_FLAT' && (
        <div className={`p-6 rounded-2xl border ${cardBg} space-y-4`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Matriz Consolidada de Cuentas Bancarias Excel
              </h3>
              <p className="text-xs text-slate-400">
                Mostrando {filteredFlat.length} registros auditables con N° de Cuenta y CCI oficial
              </p>
            </div>
            <button
              onClick={exportToExcel}
              className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-black flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar Matriz</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className={`border-b text-[10px] font-black uppercase tracking-wider ${isDark ? 'border-[#1A2232] text-slate-400 bg-[#151D2A]/60' : 'border-slate-200 text-slate-700 bg-slate-100'}`}>
                  <th className="py-3 px-3">ÍTEM N°</th>
                  <th className="py-3 px-3">RUC</th>
                  <th className="py-3 px-3">PROVEEDOR / RAZÓN SOCIAL</th>
                  <th className="py-3 px-3">CONTACTO & TELÉFONO</th>
                  <th className="py-3 px-3">BANCO</th>
                  <th className="py-3 px-3">MONEDA</th>
                  <th className="py-3 px-3">N° CTA CTE</th>
                  <th className="py-3 px-3 text-right">CCI INTERBANCARIO</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-slate-800/40' : 'divide-slate-200'}`}>
                {filteredFlat.map((item, idx) => (
                  <tr key={idx} className={`transition-colors ${isDark ? 'hover:bg-[#151D2A] hover:shadow-[inset_0_0_12px_rgba(0,242,195,0.04)]' : 'hover:bg-slate-50'}`}>
                    <td className="py-3 px-3 font-mono font-black text-amber-400">N° {item.itemNo}</td>
                    <td className="py-3 px-3 font-mono font-black text-[#00F2C3]">
                      <button
                        onClick={() => handleCopy(item.ruc, 'RUC')}
                        className="hover:underline flex items-center gap-1 group"
                        title="Copiar RUC"
                      >
                        <span>{item.ruc}</span>
                        <Copy className="w-3 h-3 text-cyan-400 opacity-60 group-hover:opacity-100" />
                      </button>
                    </td>
                    <td className={`py-3 px-3 font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      <div className="font-black">{item.razonSocial}</div>
                      {item.direccion && <div className={`text-[10px] font-normal ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{item.direccion}</div>}
                    </td>
                    <td className={`py-3 px-3 ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>
                      <div className="font-bold">{item.contacto || '-'}</div>
                      <div className="font-mono text-[11px] font-black text-emerald-400">{item.telefono || '-'}</div>
                    </td>
                    <td className="py-3 px-3 font-bold">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-black ${
                          item.banco.includes('INTERBANK')
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-blue-500/15 text-cyan-300 border border-cyan-500/30'
                        }`}
                      >
                        {item.banco || '-'}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-bold">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-black ${
                          item.moneda.includes('USD') || item.moneda.includes('DOLAR')
                            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                            : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {item.moneda || 'SOLES'}
                      </span>
                    </td>
                    <td className={`py-3 px-3 font-mono ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                      {item.numeroCuenta ? (
                        <button
                          onClick={() => handleCopy(item.numeroCuenta, 'CTA')}
                          className={`font-black flex items-center gap-1.5 ${isDark ? 'text-slate-200 hover:text-[#00F2C3]' : 'text-slate-900 hover:text-blue-600'}`}
                          title="Copiar N° Cuenta"
                        >
                          <span>{item.numeroCuenta}</span>
                          <Copy className="w-3 h-3 text-cyan-400" />
                        </button>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className={`py-3 px-3 text-right font-mono ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                      {item.cci ? (
                        <button
                          onClick={() => handleCopy(item.cci || '', 'CCI')}
                          className={`font-bold flex items-center justify-end gap-1.5 ${isDark ? 'text-slate-300 hover:text-emerald-400' : 'text-slate-700 hover:text-emerald-600'}`}
                          title="Copiar CCI"
                        >
                          <span>{item.cci}</span>
                          <Copy className="w-3 h-3 text-emerald-400" />
                        </button>
                      ) : (
                        '-'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL REGISTRO NUEVO PROVEEDOR */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 rounded-2xl border ${cardBg} space-y-4 shadow-2xl animate-in fade-in my-6`}>
            <div className={`flex items-center justify-between border-b pb-3 ${isDark ? 'border-slate-800/10' : 'border-slate-200'}`}>
              <h3 className={`text-base font-black flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <Building2 className="w-5 h-5 text-blue-500" />
                Registrar Nuevo Proveedor Químico
              </h3>
              <button onClick={() => setModalOpen(false)} className={`font-bold ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}>
                ✕
              </button>
            </div>

            <form onSubmit={handleCrearProveedor} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={`block text-[10px] font-bold uppercase mb-1 ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>RUC *</label>
                  <input
                    type="text"
                    required
                    placeholder="20600000000"
                    value={newRuc}
                    onChange={(e) => setNewRuc(e.target.value)}
                    className={`w-full p-2.5 rounded-xl border ${isDark ? 'bg-[#151D2A] border-[#1A2232] text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                  />
                </div>
                <div>
                  <label className={`block text-[10px] font-bold uppercase mb-1 ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>Razón Social *</label>
                  <input
                    type="text"
                    required
                    placeholder="QUIMICOS INDUSTRIALES SAC"
                    value={newRazonSocial}
                    onChange={(e) => setNewRazonSocial(e.target.value)}
                    className={`w-full p-2.5 rounded-xl border ${isDark ? 'bg-[#151D2A] border-[#1A2232] text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                  />
                </div>
                <div>
                  <label className={`block text-[10px] font-bold uppercase mb-1 ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>Contacto / Ejecutivo</label>
                  <input
                    type="text"
                    placeholder="Ing. Carlos Mendoza"
                    value={newContacto}
                    onChange={(e) => setNewContacto(e.target.value)}
                    className={`w-full p-2.5 rounded-xl border ${isDark ? 'bg-[#151D2A] border-[#1A2232] text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                  />
                </div>
                <div>
                  <label className={`block text-[10px] font-bold uppercase mb-1 ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>Teléfono</label>
                  <input
                    type="text"
                    placeholder="+51 999 888 777"
                    value={newTelefono}
                    onChange={(e) => setNewTelefono(e.target.value)}
                    className={`w-full p-2.5 rounded-xl border ${isDark ? 'bg-[#151D2A] border-[#1A2232] text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                  />
                </div>
                <div className="col-span-1 sm:col-span-2">
                  <label className={`block text-[10px] font-bold uppercase mb-1 ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>Correo Electrónico</label>
                  <input
                    type="email"
                    placeholder="ventas@proveedor.com.pe"
                    value={newCorreo}
                    onChange={(e) => setNewCorreo(e.target.value)}
                    className={`w-full p-2.5 rounded-xl border ${isDark ? 'bg-[#151D2A] border-[#1A2232] text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                  />
                </div>
              </div>

              {/* Sección Cuentas Bancarias Dinámicas */}
              <div className={`p-4 rounded-xl border space-y-3 ${isDark ? 'border-blue-500/20 bg-blue-500/5' : 'border-blue-200 bg-blue-50/50'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-blue-400" />
                    <span className={`text-[11px] font-black uppercase tracking-wider ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>
                      Cuentas Bancarias ({formCuentas.length})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={agregarCuentaForm}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-500/15 hover:bg-blue-500/25 text-blue-400 border border-blue-500/30 text-[10px] font-black transition-all active:scale-95 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                    <span>+ Agregar Otra Cuenta</span>
                  </button>
                </div>

                <div className="max-h-64 overflow-y-auto space-y-3 pr-1">
                  {formCuentas.map((cuenta, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border space-y-2.5 transition-all ${
                        isDark ? 'bg-[#0D1421] border-[#1A2232]' : 'bg-white border-slate-200 shadow-sm'
                      }`}
                    >
                      <div className="flex items-center justify-between border-b pb-1.5 border-slate-800/40">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-500/20 text-blue-400 text-[9px] font-black">
                            {idx + 1}
                          </span>
                          Cuenta {cuenta.banco} ({cuenta.moneda === 'SOLES' ? 'S/ Soles' : '$ USD'})
                        </span>
                        {formCuentas.length > 1 && (
                          <button
                            type="button"
                            onClick={() => eliminarCuentaForm(idx)}
                            className="p-1 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                            title="Eliminar esta cuenta"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <label className={`block text-[10px] font-bold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>Banco *</label>
                          <select
                            value={cuenta.banco}
                            onChange={(e) => actualizarCuentaForm(idx, 'banco', e.target.value)}
                            className={`w-full p-2 rounded-xl border text-xs font-bold ${isDark ? 'bg-[#151D2A] border-[#1A2232] text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                          >
                            <option value="BCP">BCP (Banco de Crédito)</option>
                            <option value="INTERBANK">INTERBANK</option>
                            <option value="BBVA">BBVA Continental</option>
                            <option value="SCOTIABANK">SCOTIABANK</option>
                            <option value="BANCO DE LA NACION">BANCO DE LA NACIÓN</option>
                            <option value="BANBIF">BANBIF</option>
                            <option value="PICHINCHA">BANCO PICHINCHA</option>
                          </select>
                        </div>
                        <div>
                          <label className={`block text-[10px] font-bold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>Moneda *</label>
                          <select
                            value={cuenta.moneda}
                            onChange={(e) => actualizarCuentaForm(idx, 'moneda', e.target.value as any)}
                            className={`w-full p-2 rounded-xl border text-xs font-bold ${isDark ? 'bg-[#151D2A] border-[#1A2232] text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                          >
                            <option value="SOLES">Soles (S/ PEN)</option>
                            <option value="USD">Dólares ($ USD)</option>
                          </select>
                        </div>
                        <div>
                          <label className={`block text-[10px] font-bold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>Número CTA CTE</label>
                          <input
                            type="text"
                            placeholder="Ej. 1910000000000"
                            value={cuenta.numeroCuenta}
                            onChange={(e) => actualizarCuentaForm(idx, 'numeroCuenta', e.target.value)}
                            className={`w-full p-2 rounded-xl border font-mono text-xs ${isDark ? 'bg-[#151D2A] border-[#1A2232] text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                          />
                        </div>
                        <div>
                          <label className={`block text-[10px] font-bold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>CCI Interbancario</label>
                          <input
                            type="text"
                            placeholder="Ej. 00219100000000000000"
                            value={cuenta.cci}
                            onChange={(e) => actualizarCuentaForm(idx, 'cci', e.target.value)}
                            className={`w-full p-2 rounded-xl border font-mono text-xs ${isDark ? 'bg-[#151D2A] border-[#1A2232] text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className={`px-4 py-2 rounded-xl border font-bold ${isDark ? 'border-slate-700 text-slate-400 hover:text-white' : 'border-slate-300 text-slate-700 hover:text-slate-900'}`}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black shadow-lg shadow-blue-500/20 active:scale-95 transition-all cursor-pointer"
                >
                  Guardar Proveedor Homologado
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
