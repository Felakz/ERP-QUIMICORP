'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import {
  Lock,
  Mail,
  ShieldCheck,
  Eye,
  EyeOff,
  AlertCircle,
  FlaskConical,
  CheckCircle2,
  Building2,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { getApiBaseUrl } from '@/lib/apiClient';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Cargar correo recordado en este equipo
  useEffect(() => {
    try {
      const savedEmail = localStorage.getItem('quimicorp_remembered_email');
      if (savedEmail) {
        setEmail(savedEmail);
        setRememberMe(true);
      }
    } catch {
      // Ignorar si localStorage no está disponible
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    // Persistir o remover correo según opción elegida
    try {
      if (rememberMe && email.trim()) {
        localStorage.setItem('quimicorp_remembered_email', email.trim());
      } else {
        localStorage.removeItem('quimicorp_remembered_email');
      }
    } catch {
      // Ignorar
    }

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
        setErrorMsg('❌ Error de conexión con el servidor. Intenta de nuevo.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen w-full bg-[#080B11] text-slate-100 flex flex-col lg:grid lg:grid-cols-12 relative overflow-hidden font-sans">
      {/* Fondo sutil con cuadrícula técnica e iluminación volumétrica sobria */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#131b2618_1px,transparent_1px),linear-gradient(to_bottom,#131b2618_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Resplandores volumétricos de fondo muy suaves */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-teal-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-40 right-1/3 w-96 h-96 bg-cyan-700/10 rounded-full blur-[150px] pointer-events-none" />

      {/* ========================================================= */}
      {/* LADO IZQUIERDO: Branding Industrial & Showcase Tecnológico */}
      {/* ========================================================= */}
      <div className="relative z-10 lg:col-span-7 flex flex-col justify-between p-6 sm:p-10 lg:p-14 border-b lg:border-b-0 lg:border-r border-slate-800/60 bg-gradient-to-br from-[#0B111A]/90 via-[#090E16]/80 to-[#060A0F]/90 backdrop-blur-sm">
        {/* Header Izquierdo */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-teal-400 via-emerald-400 to-cyan-500 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-teal-500/20 ring-1 ring-white/20">
              Q
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black tracking-wider text-white flex items-center gap-2">
                QUIMICORP PERÚ S.A.C.
              </h1>
              <p className="text-[10px] sm:text-[11px] font-semibold tracking-widest text-teal-400 uppercase">
                ERP INDUSTRIAL • DIVISIÓN QUÍMICA
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[11px] font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>SISTEMA EN LÍNEA</span>
          </div>
        </div>

        {/* Contenido Central del Showcase */}
        <div className="my-8 lg:my-auto max-w-xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-teal-500/30 bg-teal-500/10 text-teal-300 text-xs font-semibold">
            <Building2 className="w-3.5 h-3.5" />
            <span>Plataforma de Control Operacional & Almacén</span>
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Gestión Integral Química, <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-teal-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
                Producción & Despacho
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-lg">
              Control de fórmulas maestras, trazabilidad de lotes, kardex de insumos y despacho industrial en tiempo real con los más altos estándares de precisión química.
            </p>
          </div>

          {/* Tarjetas de Beneficios / Calidad */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-xl border border-slate-800/80 bg-slate-900/50 backdrop-blur hover:border-slate-700/80 transition-all group">
              <div className="flex items-center gap-2.5 text-teal-400 font-bold text-xs mb-1">
                <div className="p-1.5 rounded-lg bg-teal-500/10 border border-teal-500/20 group-hover:scale-105 transition-transform">
                  <FlaskConical className="w-4 h-4 text-teal-400" />
                </div>
                <span>Formulación & Lotes</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Control de reactivos químicos y cálculo exacto de órdenes de producción.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-800/80 bg-slate-900/50 backdrop-blur hover:border-slate-700/80 transition-all group">
              <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-xs mb-1">
                <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                </div>
                <span>Calidad ISO 9001 & BPM</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Alineado a normativas de Buenas Prácticas de Manufactura química y fiscalización.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-800/80 bg-slate-900/50 backdrop-blur hover:border-slate-700/80 transition-all group">
              <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-xs mb-1">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 group-hover:scale-105 transition-transform">
                  <Layers className="w-4 h-4 text-emerald-400" />
                </div>
                <span>Kardex en Tiempo Real</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Sincronización instantánea de stock, transferencias y pedidos comerciales.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-800/80 bg-slate-900/50 backdrop-blur hover:border-slate-700/80 transition-all group">
              <div className="flex items-center gap-2.5 text-indigo-400 font-bold text-xs mb-1">
                <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 group-hover:scale-105 transition-transform">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                </div>
                <span>Seguridad Corporativa</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Encriptación de datos SSL 256-bit y control jerárquico de accesos.
              </p>
            </div>
          </div>

          {/* Frase de Compromiso */}
          <div className="p-3 rounded-xl border border-teal-500/20 bg-gradient-to-r from-teal-950/20 to-transparent flex items-center gap-3 text-xs text-slate-300">
            <span className="text-lg">💡</span>
            <span className="italic font-medium">
              "Precisión en cada fórmula, excelencia en cada despacho."
            </span>
          </div>
        </div>

        {/* Footer Izquierdo */}
        <div className="pt-4 border-t border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-500">
          <div>
            © 2026 QUIMICORP PERÚ S.A.C. • Sistema ERP Industrial
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Servidor Central • Latencia &lt;15ms</span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* LADO DERECHO: Formulario de Autenticación Moderno */}
      {/* ========================================================= */}
      <div className="relative z-10 lg:col-span-5 flex flex-col justify-between p-6 sm:p-10 lg:p-14 bg-[#080B11]/95 backdrop-blur-md">
        {/* Espacio superior decorativo */}
        <div className="hidden lg:block"></div>

        <div className="w-full max-w-md mx-auto my-auto py-6">
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl p-6 sm:p-8 shadow-2xl shadow-black/80 space-y-6">
            {/* Encabezado Formulario */}
            <div className="space-y-2 text-left">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md border border-slate-700/80 bg-slate-800/60 text-teal-400 text-[10px] font-bold tracking-wider uppercase">
                <Lock className="w-3 h-3" />
                <span>Acceso Autorizado</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Iniciar Sesión
              </h2>
              <p className="text-xs text-slate-400">
                Ingresa tus credenciales institucionales para acceder a tu estación de trabajo ERP.
              </p>
            </div>

            {/* Mensaje de Error */}
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-start gap-2.5 animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span className="leading-tight">{errorMsg}</span>
              </div>
            )}

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Correo */}
              <div>
                <label className="block text-slate-300 uppercase text-[10px] font-bold tracking-wider mb-1.5">
                  Correo Institucional
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="usuario@quimicorp.pe"
                    className="w-full bg-slate-950/70 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-slate-100 focus:border-teal-400 focus:ring-1 focus:ring-teal-400/30 focus:outline-none transition-all font-mono placeholder:text-slate-600"
                  />
                </div>
              </div>

              {/* Contraseña */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-slate-300 uppercase text-[10px] font-bold tracking-wider">
                    Contraseña
                  </label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-slate-950/70 border border-slate-800 rounded-xl py-2.5 pl-10 pr-10 text-slate-100 focus:border-teal-400 focus:ring-1 focus:ring-teal-400/30 focus:outline-none transition-all font-mono placeholder:text-slate-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 p-0.5 text-slate-400 hover:text-teal-400 focus:outline-none transition-colors"
                    title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Recordar en este equipo */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none text-slate-400 hover:text-slate-300">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-slate-700 bg-slate-800 text-teal-500 focus:ring-teal-400/20 focus:ring-offset-0"
                  />
                  <span className="text-[11px]">Recordar correo en este equipo</span>
                </label>
              </div>

              {/* Botón de Enviar */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-500 hover:from-teal-300 hover:via-emerald-300 hover:to-cyan-400 text-slate-950 font-black text-xs tracking-wider uppercase transition-all shadow-lg shadow-teal-500/20 active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                    <span>Verificando credenciales...</span>
                  </>
                ) : (
                  <>
                    <span>Ingresar al Sistema</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Cierre / Encriptación */}
            <div className="pt-2 text-center text-[11px] text-slate-500 border-t border-slate-800/60 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              <span>Sesión cifrada con protocolo TLS 1.3 de grado industrial</span>
            </div>
          </div>
        </div>

        {/* Footer Derecho */}
        <div className="text-center text-[10px] text-slate-600">
          Soporte TI: <span className="text-slate-400 font-mono">sistemas@grupoquimicorp.pe</span>
        </div>
      </div>
    </div>
  );
}
