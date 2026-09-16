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
  Building2,
  Package,
  Briefcase,
  TrendingUp,
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
    <div className="min-h-screen w-full bg-[#080B11] text-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-12 font-sans relative overflow-hidden">
      {/* Fondo sutil con cuadrícula técnica e iluminación volumétrica sobria */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#131b2618_1px,transparent_1px),linear-gradient(to_bottom,#131b2618_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Resplandores volumétricos sutiles con tono corporativo */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-orange-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-40 right-1/4 w-96 h-96 bg-teal-700/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Contenedor principal centrado para cualquier resolución (evita separación en pantallas ultra-anchas) */}
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center z-10 py-6">
        
        {/* ========================================================= */}
        {/* LADO IZQUIERDO: Branding Corporativo, Slogan & Showcase */}
        {/* ========================================================= */}
        <div className="lg:col-span-7 flex flex-col justify-center space-y-6 max-w-2xl mx-auto lg:mx-0 w-full">
          
          {/* Header Izquierdo con Logo Oficial */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src="/logo-quimicorp-blanco.png"
                alt="QUIMICORP PERU SAC - Innovación a Través de la Ciencia"
                className="h-20 sm:h-24 w-auto object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]"
              />
            </div>

            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[11px] font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>SISTEMA EN LÍNEA</span>
            </div>
          </div>

          {/* Titular Principal y Propósito Integral */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-300 text-xs font-semibold">
              <Building2 className="w-3.5 h-3.5" />
              <span>Plataforma ERP de Gestión Integral & Operativa</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Gestión Empresarial, <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-teal-400 bg-clip-text text-transparent">
                Administración & Operaciones
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-xl">
              Control unificado de finanzas, ventas, compras, almacén, formulación química y producción industrial en tiempo real.
            </p>
          </div>

          {/* 4 Tarjetas de Gestión Global (Administración, Comercial, Producción, Logística) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* 1. Administración & Finanzas */}
            <div className="p-3.5 rounded-xl border border-slate-800/80 bg-slate-900/50 backdrop-blur hover:border-slate-700/80 transition-all group">
              <div className="flex items-center gap-2.5 text-orange-400 font-bold text-xs mb-1">
                <div className="p-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20 group-hover:scale-105 transition-transform">
                  <Briefcase className="w-4 h-4 text-orange-400" />
                </div>
                <span>Administración & Finanzas</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Facturación electrónica, cuentas por cobrar/pagar, compras y control contable.
              </p>
            </div>

            {/* 2. Comercial & Ventas */}
            <div className="p-3.5 rounded-xl border border-slate-800/80 bg-slate-900/50 backdrop-blur hover:border-slate-700/80 transition-all group">
              <div className="flex items-center gap-2.5 text-amber-400 font-bold text-xs mb-1">
                <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 group-hover:scale-105 transition-transform">
                  <TrendingUp className="w-4 h-4 text-amber-400" />
                </div>
                <span>Comercial & Ventas</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Cotizaciones, pedidos comerciales en línea y seguimiento integral de clientes.
              </p>
            </div>

            {/* 3. Producción & Calidad */}
            <div className="p-3.5 rounded-xl border border-slate-800/80 bg-slate-900/50 backdrop-blur hover:border-slate-700/80 transition-all group">
              <div className="flex items-center gap-2.5 text-teal-400 font-bold text-xs mb-1">
                <div className="p-1.5 rounded-lg bg-teal-500/10 border border-teal-500/20 group-hover:scale-105 transition-transform">
                  <FlaskConical className="w-4 h-4 text-teal-400" />
                </div>
                <span>Producción & Calidad ISO</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Fórmulas maestras, control de lotes y normativas BPM / ISO 9001:2015.
              </p>
            </div>

            {/* 4. Almacén & Kardex Global */}
            <div className="p-3.5 rounded-xl border border-slate-800/80 bg-slate-900/50 backdrop-blur hover:border-slate-700/80 transition-all group">
              <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-xs mb-1">
                <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 group-hover:scale-105 transition-transform">
                  <Package className="w-4 h-4 text-cyan-400" />
                </div>
                <span>Almacén & Kardex Global</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Stock multialmacén en tiempo real, trazabilidad de insumos y despacho.
              </p>
            </div>
          </div>

          {/* Frase / Slogan Oficial */}
          <div className="p-3.5 rounded-xl border border-orange-500/25 bg-gradient-to-r from-orange-950/20 via-slate-900/40 to-transparent flex items-center gap-3 text-xs text-slate-200">
            <span className="text-xl">🔬</span>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <span className="font-bold text-orange-400">QUIMICORP:</span>
              <span className="italic font-medium">"Innovación a través de la ciencia"</span>
            </div>
          </div>

          {/* Footer Izquierdo */}
          <div className="pt-2 border-t border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-500">
            <div>
              © 2026 QUIMICORP PERÚ S.A.C. • Sistema ERP Integral
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Servidor Central Lima, Perú • SSL 256-Bit</span>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* LADO DERECHO: Formulario de Autenticación Centrado */}
        {/* ========================================================= */}
        <div className="lg:col-span-5 flex flex-col justify-center items-center w-full">
          <div className="w-full max-w-md">
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/70 backdrop-blur-xl p-6 sm:p-8 shadow-2xl shadow-black/80 space-y-6">
              
              {/* Encabezado Formulario */}
              <div className="space-y-3 text-left">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md border border-slate-700/80 bg-slate-800/60 text-orange-400 text-[10px] font-bold tracking-wider uppercase">
                    <Lock className="w-3 h-3" />
                    <span>Acceso Autorizado</span>
                  </div>
                  <img
                    src="/logo-quimicorp-icono.png"
                    alt="Quimicorp Emblema"
                    className="h-6 w-auto object-contain opacity-90"
                  />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    Iniciar Sesión
                  </h2>
                  <p className="text-xs text-slate-400">
                    Ingresa tus credenciales institucionales para acceder a tu estación de trabajo ERP.
                  </p>
                </div>
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
                      className="w-full bg-slate-950/70 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-slate-100 focus:border-orange-400 focus:ring-1 focus:ring-orange-400/30 focus:outline-none transition-all font-mono placeholder:text-slate-600"
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
                      className="w-full bg-slate-950/70 border border-slate-800 rounded-xl py-2.5 pl-10 pr-10 text-slate-100 focus:border-orange-400 focus:ring-1 focus:ring-orange-400/30 focus:outline-none transition-all font-mono placeholder:text-slate-600"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 p-0.5 text-slate-400 hover:text-orange-400 focus:outline-none transition-colors"
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
                      className="w-3.5 h-3.5 rounded border-slate-700 bg-slate-800 text-orange-500 focus:ring-orange-400/20 focus:ring-offset-0"
                    />
                    <span className="text-[11px]">Recordar correo en este equipo</span>
                  </label>
                </div>

                {/* Botón de Enviar */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-teal-500 hover:from-orange-400 hover:via-amber-400 hover:to-teal-400 text-slate-950 font-black text-xs tracking-wider uppercase transition-all shadow-lg shadow-orange-500/20 active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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

            {/* Footer Soporte */}
            <div className="text-center text-[10px] text-slate-500 mt-4">
              Soporte TI: <span className="text-slate-400 font-mono">sistemas@grupoquimicorp.pe</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
