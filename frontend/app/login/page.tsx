'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { Lock, Mail, ChevronRight, ShieldCheck } from 'lucide-react';
import { getApiBaseUrl } from '@/lib/apiClient';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    fetch(`${getApiBaseUrl()}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim(), password }),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => null);
        if (res.ok && data?.token && data?.user) {
          login(data.token, data.user);
        } else {
          setErrorMsg(data?.message || '❌ Credenciales incorrectas. Verifica tu correo o contraseña.');
        }
      })
      .catch((err) => {
        console.error('Error de autenticación:', err);
        setErrorMsg('❌ Error de conexión con el servidor.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-[#090C10] text-slate-100 flex flex-col justify-between p-6 font-sans relative overflow-hidden">
      {/* Efectos de fondo Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#00F2C3]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header Logo */}
      <div className="flex items-center justify-between z-10 max-w-6xl w-full mx-auto">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-[#00F2C3] to-cyan-500 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-[#00F2C3]/20">
            Q
          </div>
          <div>
            <h1 className="text-lg font-black tracking-wider text-white">
              QUIMICORP PERÚ S.A.C.
            </h1>
            <p className="text-[10px] text-slate-400 tracking-widest uppercase">
              ERP INDUSTRIAL • GESTIÓN EMPRESARIAL
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>SISTEMA SEGURO • SSL 256-BIT</span>
        </div>
      </div>

      {/* Tarjeta de Autenticación Centrada */}
      <div className="my-auto max-w-md w-full mx-auto z-10">
        <div className="rounded-2xl border border-[#1A2232] bg-[#0F141C]/95 backdrop-blur-xl p-8 shadow-2xl shadow-black/80 space-y-6">
          <div className="space-y-1 text-center">
            <div className="inline-flex p-3 rounded-2xl bg-[#151D2A] border border-[#1A2232] text-[#00F2C3] mb-2 shadow-inner">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-black text-white tracking-tight">Iniciar Sesión</h2>
            <p className="text-xs text-slate-400">
              Ingresa tus credenciales institucionales para acceder al sistema
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
              <span>⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 uppercase text-[10px] font-bold mb-1.5">
                Correo Institucional
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@quimicorp.pe"
                  className="w-full bg-[#151D2A] border border-[#1A2232] rounded-xl py-2.5 pl-10 pr-4 text-slate-200 focus:border-[#00F2C3] focus:outline-none transition-all font-mono placeholder:text-slate-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 uppercase text-[10px] font-bold mb-1.5">
                Contraseña de Acceso
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#151D2A] border border-[#1A2232] rounded-xl py-2.5 pl-10 pr-4 text-slate-200 focus:border-[#00F2C3] focus:outline-none transition-all font-mono placeholder:text-slate-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00F2C3] to-cyan-500 text-slate-950 font-black text-xs tracking-wider uppercase hover:opacity-90 transition-all shadow-lg shadow-[#00F2C3]/20 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Autenticando...</span>
              ) : (
                <>
                  <span>Ingresar al Sistema</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-2 text-center text-[11px] text-slate-500 border-t border-[#1A2232]/60 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Acceso restringido a personal autorizado Quimicorp</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-[10px] text-slate-500 z-10">
        © 2026 QUIMICORP PERÚ S.A.C. • Todos los derechos reservados • Sistema Industrial Certificado ISO 9001
      </div>
    </div>
  );
}
