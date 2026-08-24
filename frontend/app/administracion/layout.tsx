'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';
import { useAuth } from '@/lib/AuthContext';
import { apiFetch } from '@/lib/apiClient';
import { adminSidebarItems } from '@/components/sidebar';
import { CampanaAutorizaciones } from '@/components/notifications/CampanaAutorizaciones';

export default function AdministracionLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [timeString, setTimeString] = useState('');
  const [pedidoCount, setPedidoCount] = useState(0);

  const isDark = theme === 'dark';

  const userInitials = user?.nombre
    ? user.nombre.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
    : 'EY';
  const userName = user?.nombre || 'Elvis Edwin Yarleque Arrunategui';
  const userRoleDisplay =
    user?.role === 'GERENTE_ADMINISTRATIVO'
      ? 'GERENTE ADMINISTRATIVO'
      : user?.role === 'ASISTENTE_ADMINISTRATIVO'
      ? 'ASISTENTE ADMINISTRATIVO'
      : user?.role === 'ADMINISTRACION'
      ? 'ADMINISTRACIÓN & FINANZAS'
      : user?.role || 'ADMINISTRACIÓN';

  useEffect(() => {
    if (user?.role === 'PRODUCCION_ALMACEN') {
      window.location.href = '/produccion/kardex';
      return;
    }
  }, [user]);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const { data, ok } = await apiFetch<{ pedidosPendientes?: number; nuevos?: number }>('/pedidos-admin/kpis');
        if (ok && data) {
          setPedidoCount(data.pedidosPendientes || data.nuevos || 0);
        }
      } catch {}
    };
    fetchCount();
    const interval = setInterval(fetchCount, 10000);
    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleDateString('es-ES', {
          weekday: 'short',
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }) +
        ' ' +
        now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`flex h-screen w-screen overflow-hidden font-sans transition-colors duration-200 ${
        isDark ? 'bg-[#090C10] text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Sidebar de Administración & Finanzas */}
      <aside
        className={`w-64 shrink-0 flex flex-col justify-between border-r transition-colors duration-200 ${
          isDark ? 'bg-[#0B0F17] border-[#1A2232]' : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Logo Header */}
          <div
            className={`flex h-16 shrink-0 items-center gap-3 px-5 border-b ${
              isDark ? 'border-[#1A2232]' : 'border-slate-100'
            }`}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white font-black shadow-md shadow-blue-500/20">
              A
            </div>
            <div>
              <h2 className={`text-sm font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                QUIMICORP
              </h2>
              <p className={`text-[9px] font-mono tracking-widest font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                ADMINISTRACIÓN & FINANZAS
              </p>
            </div>
          </div>

          {/* Menú de Admin */}
          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5 font-sans">
            {adminSidebarItems.map((section) => (
              <div key={section.category} className="space-y-1">
                <p
                  className={`px-3 text-[10px] font-bold tracking-widest uppercase mb-1.5 ${
                    isDark ? 'text-slate-500' : 'text-slate-400'
                  }`}
                >
                  {section.category}
                </p>
                <div className="space-y-0.5">
                  {section.items.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    const isPedidosComerciales = item.href === '/administracion/pedidos';
                    const hasBadge = isPedidosComerciales ? pedidoCount > 0 : !!item.badge;
                    const badgeDisplay = isPedidosComerciales ? pedidoCount : item.badge;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-all duration-150 group ${
                          isActive
                            ? isDark
                              ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30 font-bold shadow-sm'
                              : 'bg-blue-50 text-blue-700 border border-blue-200 font-bold shadow-sm'
                            : isDark
                            ? 'text-slate-400 hover:bg-[#151D2A] hover:text-slate-200'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon
                            className={`h-4 w-4 shrink-0 transition-transform group-hover:scale-110 ${
                              isActive
                                ? isDark
                                  ? 'text-blue-400'
                                  : 'text-blue-600'
                                : 'text-slate-400'
                            }`}
                          />
                          <span className="truncate">{item.label}</span>
                        </div>
                        {hasBadge && (
                          <span className="flex h-5 min-w-[20px] px-1.5 items-center justify-center rounded-full bg-blue-500 text-[10px] font-black text-white shadow-sm">
                            {badgeDisplay}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Footer Perfil */}
        <div className={`border-t p-3 shrink-0 ${isDark ? 'border-[#1A2232]' : 'border-slate-100'}`}>
          <div
            className={`flex items-center justify-between gap-3 rounded-xl p-2.5 border ${
              isDark ? 'bg-[#0F141C] border-[#1A2232]' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center gap-2.5 overflow-hidden text-left">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400 font-bold text-xs border border-blue-500/30">
                {userInitials}
              </div>
              <div className="overflow-hidden text-left">
                <p className={`text-xs font-bold truncate ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                  {userName}
                </p>
                <p className="text-[9px] text-blue-400 font-mono font-bold truncate uppercase">
                  {userRoleDisplay}
                </p>
              </div>
            </div>

            <button
              onClick={logout}
              title="Cerrar Sesión"
              className={`p-2 rounded-lg border transition-all ${
                isDark
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20'
                  : 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'
              }`}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Contenedor Principal */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Cabecera Superior */}
        <header
          className={`flex h-14 shrink-0 items-center justify-between border-b px-6 transition-colors duration-200 ${
            isDark ? 'bg-[#0B0F17] border-[#1A2232]' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-medium">
            <span className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
              Administración & Finanzas
            </span>
            <span className="text-slate-400">/</span>
            <span className="text-slate-400 font-mono">
              {pathname.includes('pedidos')
                ? 'Pedidos Comerciales & Facturación'
                : pathname.includes('formulas')
                ? 'Catálogo & Cotizador'
                : pathname.includes('clientes')
                ? 'Cartera de Clientes'
                : pathname.includes('facturacion')
                ? 'Documentos & Facturas'
                : pathname.includes('cobranzas')
                ? 'Cuentas por Cobrar'
                : pathname.includes('inventario')
                ? 'Stock Comercial'
                : pathname.includes('alertas-stock')
                ? 'Alertas de Materia Prima'
                : 'Dashboard Comercial'}
            </span>
          </div>

          {/* Selector de Tema, Campaña de Autorizaciones & Hora */}
          <div className="flex items-center gap-3">
            <CampanaAutorizaciones />

            <span className="hidden lg:block text-xs font-mono text-slate-400 mr-2">
              {timeString}
            </span>

            <button
              onClick={toggleTheme}
              title={isDark ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold border transition-all ${
                isDark
                  ? 'bg-[#0F141C] text-amber-400 border-[#1A2232] hover:bg-slate-800'
                  : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
              }`}
            >
              {isDark ? (
                <>
                  <Sun className="h-3.5 w-3.5 text-amber-400" />
                  <span>Modo Claro</span>
                </>
              ) : (
                <>
                  <Moon className="h-3.5 w-3.5 text-slate-700" />
                  <span>Modo Oscuro</span>
                </>
              )}
            </button>
          </div>
        </header>

        {/* Contenido */}
        <main
          className={`flex-1 overflow-y-auto p-5 transition-colors duration-200 ${
            isDark ? 'bg-[#090C10]' : 'bg-[#F8FAFC]'
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
