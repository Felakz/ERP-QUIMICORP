'use client';

import React, { useState, useEffect } from 'react';
import { X, Lock, ShieldAlert, Send, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { useTheme } from '@/lib/ThemeContext';
import { apiFetch } from '@/lib/apiClient';

interface ModalSolicitarPermisoProps {
  isOpen: boolean;
  onClose: () => void;
  onPermissionGranted: () => void;
  accion: 'FORMULA_EDIT' | 'FORMULA_CLONE' | 'CLIENTE_EDIT' | 'CLIENTE_DELETE';
  recursoId?: string;
  recursoNombre?: string;
}

export function ModalSolicitarPermiso({
  isOpen,
  onClose,
  onPermissionGranted,
  accion,
  recursoId,
  recursoNombre,
}: ModalSolicitarPermisoProps) {
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [motivo, setMotivo] = useState('');
  const [loading, setLoading] = useState(false);
  const [solicitudId, setSolicitudId] = useState<string | null>(null);
  const [estadoSolicitud, setEstadoSolicitud] = useState<'IDLE' | 'PENDIENTE' | 'APROBADO' | 'RECHAZADO'>('IDLE');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (solicitudId && estadoSolicitud === 'PENDIENTE') {
      interval = setInterval(async () => {
        try {
          const { data, ok } = await apiFetch<any[]>(`/autorizaciones/mis-solicitudes?email=${user?.email || ''}`);
          if (ok && Array.isArray(data)) {
            const actual = data.find((s) => s.id === solicitudId);
            if (actual) {
              if (actual.estado === 'APROBADO') {
                setEstadoSolicitud('APROBADO');
                setTimeout(() => {
                  onPermissionGranted();
                  onClose();
                }, 1200);
              } else if (actual.estado === 'RECHAZADO') {
                setEstadoSolicitud('RECHAZADO');
              }
            }
          }
        } catch (e) {
          console.error('Error polling solicitud:', e);
        }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [solicitudId, estadoSolicitud, user, onPermissionGranted, onClose]);

  if (!isOpen) return null;

  const enviarSolicitud = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, ok } = await apiFetch<any>('/autorizaciones/solicitar', {
        method: 'POST',
        body: JSON.stringify({
          solicitanteId: user?.id || 'usr-asistente',
          solicitanteEmail: user?.email || 'asistentedeadministracion@grupoquimicorp.pe',
          solicitanteNombre: user?.nombre || 'Mishelle Barrera Quispe',
          modulo: 'FORMULAS',
          accion,
          recursoId,
          recursoNombre,
          motivo,
        }),
      });

      if (ok && data?.id) {
        setSolicitudId(data.id);
        setEstadoSolicitud('PENDIENTE');
      }
    } catch (e) {
      console.error('Error al enviar solicitud:', e);
    } finally {
      setLoading(false);
    }
  };

  const accionTexto = accion === 'FORMULA_EDIT' ? 'Modificación de Fórmula' : accion === 'FORMULA_CLONE' ? 'Clonación de Fórmula' : 'Acción Restringida';

  const cardBg = isDark ? 'bg-[#0F141C] border-[#1A2232]' : 'bg-white border-slate-200 shadow-2xl';
  const boxBg = isDark ? 'bg-[#151D2A] border-[#1A2232]' : 'bg-slate-50 border-slate-200';
  const textTitle = isDark ? 'text-white' : 'text-slate-900';
  const textMuted = isDark ? 'text-slate-400' : 'text-slate-600';

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200 font-sans">
      <div className={`border rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl relative ${cardBg}`}>
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-xl border transition-colors ${
            isDark ? 'bg-[#151D2A] text-slate-400 hover:text-white border-[#1A2232]' : 'bg-slate-100 text-slate-500 hover:text-slate-900 border-slate-300'
          }`}
        >
          <X className="w-4 h-4" />
        </button>

        <div className={`flex items-center gap-3.5 border-b pb-4 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/30">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h3 className={`text-base font-black ${textTitle}`}>Acceso Restringido</h3>
            <p className={`text-xs font-semibold ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>
              Requiere Autorización del Gerente Administrativo
            </p>
          </div>
        </div>

        {estadoSolicitud === 'IDLE' && (
          <form onSubmit={enviarSolicitud} className="space-y-4">
            <div className={`p-3.5 rounded-2xl border space-y-1 text-xs ${boxBg}`}>
              <span className={`text-[10px] uppercase font-mono tracking-wider ${textMuted}`}>Acción Solicitada</span>
              <p className={`font-bold text-sm ${textTitle}`}>{accionTexto}</p>
              {recursoNombre && (
                <p className={`font-mono text-[11px] ${isDark ? 'text-indigo-300' : 'text-indigo-700 font-bold'}`}>
                  Objetivo: {recursoNombre}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Motivo de la Solicitud (para el Gerente):
              </label>
              <textarea
                required
                rows={3}
                placeholder="Ej. El cliente solicita cambio en porcentaje de fragancia o aroma..."
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                className={`w-full p-3 rounded-xl border text-xs focus:border-amber-500 focus:outline-none ${
                  isDark
                    ? 'bg-[#151D2A] border-[#1A2232] text-white placeholder-slate-500'
                    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                }`}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? 'Enviando al Gerente...' : 'Solicitar Permiso a Elvis Yarleque'}</span>
            </button>
          </form>
        )}

        {estadoSolicitud === 'PENDIENTE' && (
          <div className="py-6 text-center space-y-3">
            <div className="inline-flex p-3 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/30 animate-spin">
              <Clock className="w-8 h-8" />
            </div>
            <h4 className={`text-sm font-bold ${textTitle}`}>Solicitud Enviada a Elvis Yarleque</h4>
            <p className={`text-xs max-w-xs mx-auto ${textMuted}`}>
              Esperando respuesta del Gerente Administrativo en tiempo real...
            </p>
          </div>
        )}

        {estadoSolicitud === 'APROBADO' && (
          <div className="py-6 text-center space-y-3">
            <div className="inline-flex p-3 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-sm font-black text-emerald-600 dark:text-emerald-400">¡SOLICITUD APROBADA!</h4>
            <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Desbloqueando editor de fórmula...</p>
          </div>
        )}

        {estadoSolicitud === 'RECHAZADO' && (
          <div className="py-6 text-center space-y-3">
            <div className="inline-flex p-3 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/30">
              <XCircle className="w-8 h-8" />
            </div>
            <h4 className="text-sm font-black text-rose-600 dark:text-rose-400">Solicitud Rechazada</h4>
            <p className={`text-xs ${textMuted}`}>El Gerente no ha concedido permiso para realizar esta acción.</p>
            <button
              onClick={() => setEstadoSolicitud('IDLE')}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors ${
                isDark ? 'bg-[#151D2A] text-white border-[#1A2232]' : 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200'
              }`}
            >
              Reintentar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
