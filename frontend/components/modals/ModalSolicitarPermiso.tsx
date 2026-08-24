'use client';

import React, { useState, useEffect } from 'react';
import { X, Lock, ShieldAlert, Send, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
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

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200 font-sans">
      <div className="bg-[#0F141C] border border-[#1A2232] rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-[#151D2A] text-slate-400 hover:text-white border border-[#1A2232]"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3.5 border-b pb-4 border-slate-800">
          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-black text-white">Acceso Restringido</h3>
            <p className="text-xs text-amber-400 font-medium">Requiere Autorización del Gerente Administrativo</p>
          </div>
        </div>

        {estadoSolicitud === 'IDLE' && (
          <form onSubmit={enviarSolicitud} className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-[#151D2A] border border-[#1A2232] space-y-1 text-xs">
              <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Acción Solicitada</span>
              <p className="font-bold text-white text-sm">{accionTexto}</p>
              {recursoNombre && <p className="text-indigo-300 font-mono text-[11px]">Objetivo: {recursoNombre}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Motivo de la Solicitud (para el Gerente):</label>
              <textarea
                required
                rows={3}
                placeholder="Ej. El cliente solicita cambio en porcentaje de fragancia o aroma..."
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                className="w-full p-3 rounded-xl bg-[#151D2A] border border-[#1A2232] text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? 'Enviando al Gerente...' : 'Solicitar Permiso a Elvis Yarleque'}</span>
            </button>
          </form>
        )}

        {estadoSolicitud === 'PENDIENTE' && (
          <div className="py-6 text-center space-y-3">
            <div className="inline-flex p-3 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 animate-spin">
              <Clock className="w-8 h-8" />
            </div>
            <h4 className="text-sm font-bold text-white">Solicitud Enviada a Elvis Yarleque</h4>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Esperando respuesta del Gerente Administrativo en tiempo real...
            </p>
          </div>
        )}

        {estadoSolicitud === 'APROBADO' && (
          <div className="py-6 text-center space-y-3">
            <div className="inline-flex p-3 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-sm font-black text-emerald-400">¡SOLICITUD APROBADA!</h4>
            <p className="text-xs text-slate-300">Desbloqueando editor de fórmula...</p>
          </div>
        )}

        {estadoSolicitud === 'RECHAZADO' && (
          <div className="py-6 text-center space-y-3">
            <div className="inline-flex p-3 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30">
              <XCircle className="w-8 h-8" />
            </div>
            <h4 className="text-sm font-black text-rose-400">Solicitud Rechazada</h4>
            <p className="text-xs text-slate-400">El Gerente no ha concedido permiso para realizar esta acción.</p>
            <button
              onClick={() => setEstadoSolicitud('IDLE')}
              className="px-4 py-2 rounded-xl bg-[#151D2A] text-xs text-white font-bold border border-[#1A2232]"
            >
              Reintentar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
