'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { Lock, Mail, ChevronRight } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('produccion@quimicorp.pe');
  const [password, setPassword] = useState('Quimicorp2026!');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('http://localhost:3001/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Error de autenticación');
      }

      const { token, user } = await res.json();
      login(token, user);
    } catch (err: any) {
      setErrorMsg(err.message || 'No se pudo conectar al servidor de autenticación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090C10] text-slate-100 flex flex-col justify-between p-6 font-mono relative overflow-hidden">
      {/* Glow Effects background */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#00F2C3]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header Logo */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-[#00F2C3] to-cyan-500 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-[#00F2C3]/20">
            Q
          </div>
          <div>
            <h1 className="text-lg font-black tracking-wider text-white font-sans">
              QUIMICORP PERÚ S.A.C.
            </h1>
            <p className="text-[10px] text-slate-400 font-sans tracking-widest uppercase">
              ERP INDUSTRIAL v2.4 · PLANTA DE PROCESOS
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-bold font-sans">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>SERVIDORES EN LÍNEA · POSTGRES 16</span>
        </div>
      </div>

      {/* Center Auth Box */}
      <div className="my-auto max-w-md w-full mx-auto z-10">
        <div className="rounded-2xl border border-[#1A2232] bg-[#0F141C]/90 backdrop-blur-xl p-8 shadow-2xl shadow-black/80 space-y-6">
          <div className="space-y-1 text-center">
            <div className="inline-flex p-3 rounded-2xl bg-[#151D2A] border border-[#1A2232] text-[#00F2C3] mb-2 shadow-inner">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold font-sans text-white">Inicio de Sesión Unificado</h2>
            <p className="text-xs font-sans text-slate-400">
              Ingresa tus credenciales institucionales de acceso
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-sans font-bold flex items-center gap-2 animate-in fade-in duration-200">
              <span>⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 uppercase text-[10px] font-bold mb-1.5 font-sans">
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
                  className="w-full bg-[#151D2A] border border-[#1A2232] rounded-xl py-2.5 pl-10 pr-4 text-slate-200 focus:border-[#00F2C3] focus:outline-none transition-all font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 uppercase text-[10px] font-bold mb-1.5 font-sans">
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
                  className="w-full bg-[#151D2A] border border-[#1A2232] rounded-xl py-2.5 pl-10 pr-4 text-slate-200 focus:border-[#00F2C3] focus:outline-none transition-all font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00F2C3] to-cyan-500 text-slate-950 font-black font-sans text-xs tracking-wider uppercase hover:opacity-90 transition-all shadow-lg shadow-[#00F2C3]/20 flex items-center justify-center gap-2"
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
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-[10px] text-slate-400 font-sans z-10">
        © 2026 QUIMICORP PERÚ S.A.C. · Todos los derechos reservados · Sistema Industrial Certificado ISO 9001
      </div>
    </div>
  );
}
