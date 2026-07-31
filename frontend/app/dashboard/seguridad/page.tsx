'use client';

import React, { useState } from 'react';
import { ShieldCheck, Lock, KeyRound, UserCheck, ShieldAlert, Check, X, Search } from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';

interface UsuarioRBAC {
  id: string;
  nombre: string;
  email: string;
  rol: 'GERENCIA' | 'SUPERVISOR_QA' | 'OPERARIO_PLANTA' | 'ALMACENERO';
  estado: 'ACTIVO' | 'INACTIVO';
  ultimoAcceso: string;
}

interface AuditLog {
  id: string;
  usuario: string;
  accion: string;
  modulo: string;
  ip: string;
  timestamp: string;
  riesgo: 'BAJO' | 'MEDIO' | 'ALTO';
}

export default function SeguridadRBACPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [usuarios] = useState<UsuarioRBAC[]>([
    {
      id: '1',
      nombre: 'Gerente Admin',
      email: 'gerencia@quimicorp.pe',
      rol: 'GERENCIA',
      estado: 'ACTIVO',
      ultimoAcceso: '2026-07-31 08:50',
    },
    {
      id: '2',
      nombre: 'Luis Mamani',
      email: 'luis.mamani@quimicorp.pe',
      rol: 'SUPERVISOR_QA',
      estado: 'ACTIVO',
      ultimoAcceso: '2026-07-31 08:42',
    },
    {
      id: '3',
      nombre: 'Carlos Quispe',
      email: 'carlos.quispe@quimicorp.pe',
      rol: 'OPERARIO_PLANTA',
      estado: 'ACTIVO',
      ultimoAcceso: '2026-07-31 08:15',
    },
    {
      id: '4',
      nombre: 'Ana Flores',
      email: 'ana.flores@quimicorp.pe',
      rol: 'ALMACENERO',
      estado: 'ACTIVO',
      ultimoAcceso: '2026-07-30 18:00',
    },
  ]);

  const auditLogs: AuditLog[] = [
    {
      id: 'LOG-881',
      usuario: 'Luis Mamani',
      accion: 'APROBACION_LOTE_QA',
      modulo: 'QA & Kardex',
      ip: '192.168.1.104',
      timestamp: '2026-07-31 08:42:15',
      riesgo: 'BAJO',
    },
    {
      id: 'LOG-880',
      usuario: 'Carlos Quispe',
      accion: 'AJUSTE_FINO_FORMULA',
      modulo: 'Fórmulas',
      ip: '192.168.1.112',
      timestamp: '2026-07-31 08:40:00',
      riesgo: 'MEDIO',
    },
    {
      id: 'LOG-879',
      usuario: 'Gerente Admin',
      accion: 'EXPORTAR_PDF_KPIS',
      modulo: 'Dashboard',
      ip: '192.168.1.100',
      timestamp: '2026-07-31 08:10:22',
      riesgo: 'BAJO',
    },
  ];

  const cardBg = isDark ? 'bg-[#0F141C] border-[#1A2232]' : 'bg-white border-slate-200 shadow-sm';
  const textTitle = isDark ? 'text-slate-400' : 'text-slate-500';
  const textValue = isDark ? 'text-white' : 'text-slate-900';

  return (
    <div className="space-y-6 font-mono min-h-screen">
      {/* Subtitle Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className={`text-sm font-bold tracking-widest uppercase ${textTitle}`}>
            SEGURIDAD & CONTROL DE ACCESO (RBAC)
          </h2>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Control de acceso basado en roles (RBAC), matriz de permisos e historial de auditoría ACID.
          </p>
        </div>
      </div>

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Card 1: USUARIOS ACTIVOS */}
        <div className={`rounded-xl p-5 border flex items-center justify-between ${cardBg}`}>
          <div className="space-y-1">
            <span className={`text-[10px] font-bold tracking-widest uppercase ${textTitle}`}>
              USUARIOS ACTIVOS
            </span>
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl font-black ${textValue}`}>18</span>
              <span className="text-xs text-slate-400 font-sans">Usuarios</span>
            </div>
            <p className="text-xs text-emerald-500 font-bold font-sans">
              100% Autenticación activa
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">
            <UserCheck className="h-6 w-6" />
          </div>
        </div>

        {/* Card 2: ROLES DEFINIDOS */}
        <div className={`rounded-xl p-5 border flex items-center justify-between ${cardBg}`}>
          <div className="space-y-1">
            <span className={`text-[10px] font-bold tracking-widest uppercase ${textTitle}`}>
              ROLES DEFINIDOS (RBAC)
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-cyan-500">4</span>
              <span className="text-xs text-slate-400 font-sans">Roles principales</span>
            </div>
            <p className="text-xs text-slate-400 font-sans">
              Gerencia, Planta, QA, Almacén
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <ShieldCheck className="h-6 w-6" />
          </div>
        </div>

        {/* Card 3: INTENTOS FALLIDOS */}
        <div className={`rounded-xl p-5 border flex items-center justify-between ${cardBg}`}>
          <div className="space-y-1">
            <span className={`text-[10px] font-bold tracking-widest uppercase ${textTitle}`}>
              INTENTOS FALLIDOS
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-emerald-500">0</span>
              <span className="text-xs text-slate-400 font-sans">Bloqueos</span>
            </div>
            <p className="text-xs text-slate-400 font-sans">
              Últimas 24 horas sin anomalías
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <ShieldAlert className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Main Grid: Users & Roles List + Audit Logs */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* User Roles Table */}
        <div className={`rounded-xl p-5 border space-y-4 ${cardBg}`}>
          <div className={`flex items-center justify-between border-b pb-3 ${isDark ? 'border-[#1A2232]' : 'border-slate-200'}`}>
            <h3 className={`text-xs font-bold tracking-widest uppercase ${textTitle}`}>
              MATRIZ DE USUARIOS Y ROLES (RBAC)
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className={`border-b text-[10px] font-bold tracking-widest uppercase ${isDark ? 'border-[#1A2232] text-slate-400' : 'border-slate-200 text-slate-500'}`}>
                  <th className="py-3 px-3">USUARIO</th>
                  <th className="py-3 px-3">ROL ASIGNADO</th>
                  <th className="py-3 px-3">ÚLTIMO ACCESO</th>
                  <th className="py-3 px-3">ESTADO</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-[#1A2232]/60 font-mono' : 'divide-slate-200 font-mono'}`}>
                {usuarios.map((u) => (
                  <tr key={u.id} className={`transition-colors ${isDark ? 'hover:bg-[#151D2A]/50' : 'hover:bg-slate-50'}`}>
                    <td className="py-3.5 px-3">
                      <p className={`font-sans font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{u.nombre}</p>
                      <p className="text-[10px] text-slate-400 font-sans">{u.email}</p>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="rounded bg-cyan-500/10 px-2 py-0.5 text-[10px] font-bold text-cyan-500 border border-cyan-500/20">
                        {u.rol}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-slate-400">{u.ultimoAcceso}</td>
                    <td className="py-3.5 px-3">
                      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-500 border border-emerald-500/20">
                        ACTIVO
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Audit Logs Table */}
        <div className={`rounded-xl p-5 border space-y-4 ${cardBg}`}>
          <div className={`flex items-center justify-between border-b pb-3 ${isDark ? 'border-[#1A2232]' : 'border-slate-200'}`}>
            <h3 className={`text-xs font-bold tracking-widest uppercase ${textTitle}`}>
              REGISTRO DE AUDITORÍA (AUDIT LOGS)
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className={`border-b text-[10px] font-bold tracking-widest uppercase ${isDark ? 'border-[#1A2232] text-slate-400' : 'border-slate-200 text-slate-500'}`}>
                  <th className="py-3 px-3">TIMESTAMP</th>
                  <th className="py-3 px-3">USUARIO</th>
                  <th className="py-3 px-3">ACCIÓN / MÓDULO</th>
                  <th className="py-3 px-3">RIESGO</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-[#1A2232]/60 font-mono' : 'divide-slate-200 font-mono'}`}>
                {auditLogs.map((log) => (
                  <tr key={log.id} className={`transition-colors ${isDark ? 'hover:bg-[#151D2A]/50' : 'hover:bg-slate-50'}`}>
                    <td className="py-3.5 px-3 text-slate-400">{log.timestamp}</td>
                    <td className={`py-3.5 px-3 font-sans font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{log.usuario}</td>
                    <td className="py-3.5 px-3">
                      <p className="font-bold text-cyan-500">{log.accion}</p>
                      <p className="text-[10px] text-slate-400 font-sans">{log.modulo} · IP {log.ip}</p>
                    </td>
                    <td className="py-3.5 px-3">
                      {log.riesgo === 'BAJO' && (
                        <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-500 border border-emerald-500/20">
                          BAJO
                        </span>
                      )}
                      {log.riesgo === 'MEDIO' && (
                        <span className="rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-500 border border-amber-500/20">
                          MEDIO
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
