'use client';

import React, { useState, useEffect } from 'react';
import { X, Building2, CreditCard, MapPin, Phone, User, CheckCircle2, AlertCircle, Plus, Trash2 } from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';
import { apiFetch } from '@/lib/apiClient';
import { ContactoRepresentante, Cliente } from './NuevoClienteModal';

interface EditarClienteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: (cliente: Cliente) => void;
  cliente: Cliente;
}

export function EditarClienteModal({
  isOpen,
  onClose,
  onSaved,
  cliente,
}: EditarClienteModalProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [razonSocial, setRazonSocial] = useState('');
  const [ruc, setRuc] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [metodoEnvio, setMetodoEnvio] = useState('');
  const [condicionPago, setCondicionPago] = useState('Contado');

  const [contactos, setContactos] = useState<ContactoRepresentante[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && cliente) {
      setRazonSocial(cliente.razonSocial || '');
      setRuc(cliente.ruc || '');
      setTelefono(cliente.telefono || '');
      setDireccion(cliente.direccion || '');
      setMetodoEnvio((cliente as any).metodoEnvio || '');
      setCondicionPago(cliente.condicionPago || 'Contado');
      setContactos(
        cliente.contactos?.length
          ? cliente.contactos.map((c) => ({
              id: c.id,
              nombre: c.nombre || '',
              cargo: c.cargo || '',
              telefono: c.telefono || '',
              email: c.email || '',
              esPrincipal: c.esPrincipal ?? false,
            }))
          : [{ nombre: cliente.contacto || '', cargo: 'Dueño / Compras', telefono: '', esPrincipal: true }]
      );
      setError(null);
      setSuccessMsg(null);
    }
  }, [isOpen, cliente]);

  if (!isOpen) return null;

  const cardBg = isDark ? 'bg-[#0F141C] border-[#1A2232]' : 'bg-white border-slate-200 shadow-2xl';
  const inputBg = isDark
    ? 'bg-[#151D2A] border-[#1A2232] text-slate-200 placeholder-slate-500 focus:border-blue-500'
    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500';

  const handleAddContacto = () => {
    setContactos((prev) => [...prev, { nombre: '', cargo: 'Asistente Compras', telefono: '', esPrincipal: false }]);
  };

  const handleRemoveContacto = (idx: number) => {
    setContactos((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleContactoChange = (idx: number, field: keyof ContactoRepresentante, value: any) => {
    setContactos((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!razonSocial.trim() || !ruc.trim()) {
      setError('Razón Social y RUC son campos obligatorios');
      return;
    }

    setLoading(true);
    setError(null);

    const contactosValidos = contactos.filter((c) => c.nombre.trim().length > 0);

    const { data: actualizado, error: apiError, ok } = await apiFetch<Cliente>(`/clientes/${cliente.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        razonSocial: razonSocial.trim(),
        ruc: ruc.trim(),
        telefono: telefono.trim() || undefined,
        direccion: direccion.trim() || undefined,
        metodoEnvio: metodoEnvio.trim() || undefined,
        condicionPago: condicionPago || 'Contado',
        contacto: contactosValidos[0]?.nombre || undefined,
        contactos: contactosValidos,
      }),
    });

    setLoading(false);

    if (ok && actualizado) {
      setSuccessMsg(`✓ Cliente "${actualizado.razonSocial}" actualizado correctamente.`);
      setTimeout(() => {
        onSaved(actualizado);
        onClose();
        setSuccessMsg(null);
      }, 700);
    } else {
      setError(apiError || 'Error al actualizar el cliente.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 font-sans animate-in fade-in duration-200 overflow-y-auto">
      <div className={`w-full max-w-xl rounded-2xl p-6 border space-y-4 my-8 ${cardBg}`}>
        {/* Header */}
        <div className={`flex items-center justify-between border-b pb-3 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl border ${isDark ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Editar Cliente
              </h3>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Actualizar datos de {cliente.razonSocial}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${
              isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className={`block text-[10px] uppercase font-bold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
              Razón Social / Empresa Matriz *
            </label>
            <input
              type="text"
              required
              value={razonSocial}
              onChange={(e) => setRazonSocial(e.target.value)}
              placeholder="Ej: ALFALION INVESTMENT SAC"
              className={`w-full rounded-xl border p-2.5 font-medium focus:outline-none transition-all ${inputBg}`}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`block text-[10px] uppercase font-bold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                RUC (11 dígitos) *
              </label>
              <input
                type="text"
                required
                maxLength={11}
                value={ruc}
                onChange={(e) => setRuc(e.target.value)}
                placeholder="20612434124"
                className={`w-full rounded-xl border p-2.5 font-mono focus:outline-none transition-all ${inputBg}`}
              />
            </div>

            <div>
              <label className={`block text-[10px] uppercase font-bold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                Teléfono Central
              </label>
              <input
                type="text"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="+51 944 245 458"
                className={`w-full rounded-xl border p-2.5 font-mono focus:outline-none transition-all ${inputBg}`}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`block text-[10px] uppercase font-bold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                Dirección Fiscal / Despacho
              </label>
              <input
                type="text"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                placeholder="Calle Mochicas 175, San Miguel"
                className={`w-full rounded-xl border p-2.5 font-medium focus:outline-none transition-all ${inputBg}`}
              />
            </div>

            <div>
              <label className={`block text-[10px] uppercase font-bold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                Modalidad de Envío / Agencia
              </label>
              <input
                type="text"
                value={metodoEnvio}
                onChange={(e) => setMetodoEnvio(e.target.value)}
                placeholder="INDRIVER Y SR CESAR / SHALOM"
                className={`w-full rounded-xl border p-2.5 font-medium focus:outline-none transition-all ${inputBg}`}
              />
            </div>
          </div>

          <div>
            <label className={`block text-[10px] uppercase font-bold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
              Condición de Pago Predeterminada
            </label>
            <select
              value={condicionPago}
              onChange={(e) => setCondicionPago(e.target.value)}
              className={`w-full rounded-xl border p-2.5 font-medium focus:outline-none transition-all ${inputBg}`}
            >
              <option value="Contado" className={isDark ? 'bg-[#151D2A] text-white' : 'bg-white text-slate-900'}>Contado / Anticipado</option>
              <option value="Crédito 15 Días" className={isDark ? 'bg-[#151D2A] text-white' : 'bg-white text-slate-900'}>Crédito 15 Días</option>
              <option value="Crédito 30 Días" className={isDark ? 'bg-[#151D2A] text-white' : 'bg-white text-slate-900'}>Crédito 30 Días</option>
              <option value="Crédito 60 Días" className={isDark ? 'bg-[#151D2A] text-white' : 'bg-white text-slate-900'}>Crédito 60 Días</option>
            </select>
          </div>

          {/* Sección de Representantes / Contactos (1:N) */}
          <div className={`pt-2 border-t space-y-2.5 ${isDark ? 'border-slate-800/80' : 'border-slate-200'}`}>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                <span>Representantes & Contactos ({contactos.length})</span>
              </span>
              <button
                type="button"
                onClick={handleAddContacto}
                className="px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 text-[10px] font-bold flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3 h-3" />
                <span>Añadir Contacto</span>
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {contactos.map((cont, idx) => (
                <div key={idx} className={`p-3 rounded-xl border grid grid-cols-12 gap-2 items-center ${
                  isDark ? 'bg-[#151D2A] border-[#1A2232]' : 'bg-slate-50 border-slate-200 shadow-sm'
                }`}>
                  <div className="col-span-5">
                    <input
                      type="text"
                      placeholder="Nombre Representante"
                      value={cont.nombre}
                      onChange={(e) => handleContactoChange(idx, 'nombre', e.target.value)}
                      className={`w-full border rounded-lg p-1.5 text-xs focus:outline-none ${
                        isDark ? 'bg-[#0F141C] border-slate-700/60 text-white placeholder-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                      }`}
                    />
                  </div>
                  <div className="col-span-4">
                    <input
                      type="text"
                      placeholder="Cargo (Ej: Dueño 1)"
                      value={cont.cargo || ''}
                      onChange={(e) => handleContactoChange(idx, 'cargo', e.target.value)}
                      className={`w-full border rounded-lg p-1.5 text-xs focus:outline-none ${
                        isDark ? 'bg-[#0F141C] border-slate-700/60 text-slate-300 placeholder-slate-500' : 'bg-white border-slate-300 text-slate-800 placeholder-slate-400'
                      }`}
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="text"
                      placeholder="Teléfono"
                      value={cont.telefono || ''}
                      onChange={(e) => handleContactoChange(idx, 'telefono', e.target.value)}
                      className={`w-full border rounded-lg p-1.5 text-xs font-mono focus:outline-none ${
                        isDark ? 'bg-[#0F141C] border-slate-700/60 text-emerald-400 placeholder-slate-500' : 'bg-white border-slate-300 text-emerald-600 placeholder-slate-400'
                      }`}
                    />
                  </div>
                  <div className="col-span-1 text-center">
                    {contactos.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveContacto(idx)}
                        className="p-1 rounded text-rose-500 hover:bg-rose-500/20 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`flex items-center justify-end gap-3 pt-3 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold tracking-wider uppercase transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{loading ? 'Guardando...' : 'Guardar Cambios'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
