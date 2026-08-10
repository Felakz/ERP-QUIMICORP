'use client';

import React, { useState, useEffect } from 'react';
import { X, Building2, CreditCard, MapPin, Phone, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';
import { apiFetch } from '@/lib/apiClient';

export interface Cliente {
  id: string;
  razonSocial: string;
  ruc: string;
  telefono?: string | null;
  direccion?: string | null;
  condicionPago?: string | null;
}

interface NuevoClienteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (cliente: Cliente) => void;
  initialRuc?: string;
}

export function NuevoClienteModal({
  isOpen,
  onClose,
  onCreated,
  initialRuc = '',
}: NuevoClienteModalProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [razonSocial, setRazonSocial] = useState('');
  const [ruc, setRuc] = useState(initialRuc);
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [condicionPago, setCondicionPago] = useState('Contado');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setRuc(initialRuc);
      setError(null);
      setSuccessMsg(null);
    }
  }, [isOpen, initialRuc]);

  if (!isOpen) return null;

  const cardBg = isDark ? 'bg-[#0F141C] border-[#1A2232]' : 'bg-white border-slate-200 shadow-2xl';
  const inputBg = isDark
    ? 'bg-[#151D2A] border-[#1A2232] text-slate-200 placeholder-slate-500 focus:border-blue-500'
    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!razonSocial.trim() || !ruc.trim()) {
      setError('Razón Social y RUC son campos obligatorios');
      return;
    }

    setLoading(true);
    setError(null);

    const { data: nuevoCliente, error: apiError, ok } = await apiFetch<Cliente>('/clientes', {
      method: 'POST',
      body: JSON.stringify({
        razonSocial: razonSocial.trim(),
        ruc: ruc.trim(),
        telefono: telefono.trim() || undefined,
        direccion: direccion.trim() || undefined,
        condicionPago: condicionPago || 'Contado',
      }),
    });

    setLoading(false);

    if (ok && nuevoCliente) {
      setSuccessMsg(`✓ Cliente "${nuevoCliente.razonSocial}" registrado con éxito.`);
      setTimeout(() => {
        onCreated(nuevoCliente);
        onClose();
        // Reset form
        setRazonSocial('');
        setRuc('');
        setTelefono('');
        setDireccion('');
        setSuccessMsg(null);
      }, 700);
    } else {
      setError(apiError || 'Error al registrar el cliente.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 font-sans animate-in fade-in duration-200">
      <div className={`w-full max-w-lg rounded-2xl p-6 border space-y-4 ${cardBg}`}>
        {/* Header */}
        <div className={`flex items-center justify-between border-b pb-3 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl border ${isDark ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-700'}`}>
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Registro Rápido de Cliente
              </h3>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Añadir nuevo cliente comercial a la cartera en PostgreSQL
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
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className={`block text-[10px] uppercase font-bold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
              Razón Social / Nombre Comercial *
            </label>
            <input
              type="text"
              required
              value={razonSocial}
              onChange={(e) => setRazonSocial(e.target.value)}
              placeholder="Ej: Laboratorios Farmacéuticos del Perú S.A.C."
              className={`w-full rounded-xl border p-2.5 font-medium focus:outline-none transition-all ${inputBg}`}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`block text-[10px] uppercase font-bold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                RUC / ID Tributario (11 dígitos) *
              </label>
              <input
                type="text"
                required
                maxLength={11}
                value={ruc}
                onChange={(e) => setRuc(e.target.value)}
                placeholder="20601234567"
                className={`w-full rounded-xl border p-2.5 font-mono focus:outline-none transition-all ${inputBg}`}
              />
            </div>

            <div>
              <label className={`block text-[10px] uppercase font-bold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                Teléfono / Contacto
              </label>
              <input
                type="text"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="+51 999 888 777"
                className={`w-full rounded-xl border p-2.5 font-mono focus:outline-none transition-all ${inputBg}`}
              />
            </div>
          </div>

          <div>
            <label className={`block text-[10px] uppercase font-bold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
              Dirección Fiscal / Despacho
            </label>
            <input
              type="text"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              placeholder="Av. Las Industrias 1234, Callao, Lima"
              className={`w-full rounded-xl border p-2.5 font-medium focus:outline-none transition-all ${inputBg}`}
            />
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
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold tracking-wider uppercase transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{loading ? 'Guardando...' : 'Guardar Cliente'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
