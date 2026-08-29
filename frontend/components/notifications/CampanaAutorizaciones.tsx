'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Check, X, ShieldAlert, Clock, UserCheck } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { useTheme } from '@/lib/ThemeContext';
import { apiFetch } from '@/lib/apiClient';

export interface SolicitudAutorizacion {
  id: string;
  solicitanteEmail: string;
  solicitanteNombre: string;
  modulo: string;
  accion: string;
  recursoNombre?: string;
  motivo?: string;
  estado: 'PENDIENTE' | 'APROBADO' | 'RECHAZADO';
  createdAt: string;
}

export function CampanaAutorizaciones() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [solicitudes, setSolicitudes] = useState<SolicitudAutorizacion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const esGerente =
    user?.role === 'GERENTE_ADMINISTRATIVO' ||
    user?.role === 'GERENCIA' ||
    user?.role === 'ADMINISTRACION' ||
    user?.email?.toLowerCase().includes('administracion@grupoquimicorp.pe');

  const cargarSolicitudes = async () => {
    if (!esGerente) return;
    try {
      const { data, ok } = await apiFetch<SolicitudAutorizacion[]>('/autorizaciones/pendientes');
      if (ok && Array.isArray(data)) {
        setSolicitudes(data);
      }
    } catch (e) {
      console.error('Error al obtener solicitudes:', e);
    }
  };

  useEffect(() => {
    if (esGerente) {
      cargarSolicitudes();
      const interval = setInterval(cargarSolicitudes, 8000);
      return () => clearInterval(interval);
    }
  }, [esGerente]);

  const responderSolicitud = async (id: string, estado: 'APROBADO' | 'RECHAZADO') => {
    setLoadingId(id);
    try {
      const { ok } = await apiFetch(`/autorizaciones/${id}/responder`, {
        method: 'PATCH',
        body: JSON.stringify({
          estado,
          aprobadorEmail: user?.email || 'administracion@grupoquimicorp.pe',
        }),
      });

      if (ok) {
        setSolicitudes((prev) => prev.filter((s) => s.id !== id));
      }
    } catch (e) {
      console.error('Error al responder solicitud:', e);
    } finally {
      setLoadingId(null);
    }
  };

  if (!esGerente) return null;

  const pendientesCount = solicitudes.length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-xl border transition-colors ${
          isDark
            ? 'bg-[#151D2A] border-[#1A2232] text-slate-300 hover:text-white'
            : 'bg-white border-slate-200 text-slate-700 hover:text-slate-900 shadow-sm'
        }`}
        title="Solicitudes de Autorización Pendientes"
      >
        <Bell className="w-5 h-5 text-amber-500" />
        {pendientesCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-black bg-rose-500 text-white animate-pulse">
            {pendientesCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className={`absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl border shadow-2xl p-4 z-50 animate-in fade-in duration-150 space-y-3 font-sans ${
          isDark ? 'bg-[#0F141C] border-[#1A2232]' : 'bg-white border-slate-200 text-slate-900'
        }`}>
          <div className={`flex items-center justify-between border-b pb-2 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              <h4 className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Solicitudes de Permiso Pendientes</h4>
            </div>
            <span className={`text-[10px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{pendientesCount} pendientes</span>
          </div>

          {pendientesCount === 0 ? (
            <div className="py-6 text-center text-xs text-slate-500 flex flex-col items-center gap-1.5">
              <UserCheck className="w-6 h-6 text-emerald-500/70" />
              <span>Sin solicitudes pendientes por aprobar.</span>
            </div>
          ) : (
            <div className="max-h-72 overflow-y-auto space-y-2.5 pr-1">
              {solicitudes.map((sol) => (
                <div key={sol.id} className={`p-3 rounded-xl border space-y-2 text-xs ${
                  isDark ? 'bg-[#151D2A] border-[#1A2232]' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className={`font-bold block ${isDark ? 'text-white' : 'text-slate-900'}`}>{sol.solicitanteNombre}</span>
                      <span className={`text-[10px] block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{sol.solicitanteEmail}</span>
                    </div>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                      {sol.accion === 'FORMULA_EDIT' ? 'EDITAR FÓRMULA' : sol.accion === 'FORMULA_CLONE' ? 'CLONAR FÓRMULA' : sol.accion}
                    </span>
                  </div>

                  {sol.recursoNombre && (
                    <p className="text-[11px] text-indigo-600 dark:text-indigo-300 font-semibold truncate">
                      🎯 Recurso: {sol.recursoNombre}
                    </p>
                  )}

                  {sol.motivo && (
                    <p className={`text-[11px] italic p-2 rounded-lg border ${
                      isDark ? 'text-slate-300 bg-[#0F141C] border-slate-800' : 'text-slate-700 bg-white border-slate-200'
                    }`}>
                      &quot;{sol.motivo}&quot;
                    </p>
                  )}

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      disabled={loadingId === sol.id}
                      onClick={() => responderSolicitud(sol.id, 'RECHAZADO')}
                      className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-[11px] font-bold border border-rose-500/30 flex items-center gap-1 transition-colors"
                    >
                      <X className="w-3 h-3" />
                      <span>Rechazar</span>
                    </button>

                    <button
                      disabled={loadingId === sol.id}
                      onClick={() => responderSolicitud(sol.id, 'APROBADO')}
                      className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold shadow-md shadow-emerald-600/20 flex items-center gap-1 transition-all active:scale-95"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Aprobar</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

