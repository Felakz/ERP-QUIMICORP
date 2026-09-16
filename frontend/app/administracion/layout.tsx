'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';
import { useAuth } from '@/lib/AuthContext';
import { apiFetch } from '@/lib/apiClient';
import { adminSidebarItems } from '@/components/sidebar';
import { hasPermission } from '@/config/permissions';
import { CampanaAutorizaciones } from '@/components/notifications/CampanaAutorizaciones';
import { LiveClock } from '@/components/ui/LiveClock';

export default function AdministracionLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
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
            className={`flex h-16 shrink-0 items-center gap-3 px-4 border-b ${
              isDark ? 'border-[#1A2232]' : 'border-slate-100'
            }`}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900/60 border border-slate-700/50 p-1.5 shadow-sm">
              <img
                src="/logo-quimicorp-icono.png"
                alt="Quimicorp"
                className="h-full w-full object-contain"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className={`text-sm font-black tracking-tight truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                QUIMICORP
              </h2>
              <p className={`text-[9px] font-mono tracking-widest font-bold truncate ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                ADMINISTRACIÓN & FINANZAS
              </p>
            </div>
          </div>

          {/* Menú de Admin */}
          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5 font-sans">
            {adminSidebarItems
              .map((section) => {
                const visibleItems = section.items.filter((item) =>
                  hasPermission(user?.role, item.href)
                );
                return { ...section, items: visibleItems };
              })
              .filter((section) => section.items.length > 0)
              .map((section) => (
                <div key={section.category} className="space-y-1">
                  <p
                    className={`px-3 text-[10px] font-black tracking-widest uppercase mb-1.5 ${
                      isDark ? 'text-slate-500' : 'text-slate-400'
                    }`}
                  >
                    {section.category}
                  </p>
                  <div className="space-y-1">
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
                          className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-all duration-150 group relative ${
                            isActive
                              ? isDark
                                ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/10 text-cyan-300 border border-cyan-500/40 font-bold shadow-[0_0_12px_rgba(0,242,195,0.15)] ring-1 ring-cyan-500/30'
                                : 'bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-800 border border-blue-300 font-bold shadow-sm'
                              : isDark
                              ? 'text-slate-400 hover:bg-[#151D2A] hover:text-slate-200 border border-transparent'
                              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon
                              className={`h-4 w-4 shrink-0 transition-transform group-hover:scale-110 ${
                                isActive
                                  ? isDark
                                    ? 'text-[#00F2C3]'
                                    : 'text-blue-600'
                                  : 'text-slate-400'
                              }`}
                            />
                            <span className="truncate">{item.label}</span>
                          </div>
                          {hasBadge && (
                            <span className="flex h-5 min-w-[20px] px-1.5 items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-[10px] font-black text-white shadow-sm animate-pulse">
                              {badgeDisplay}
                            </span>
                          )}
                          {isActive && (
                            <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-[#00F2C3] shadow-[0_0_8px_#00F2C3]" />
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
            className={`flex items-center justify-between gap-3 rounded-xl p-2.5 border transition-all ${
              isDark ? 'bg-[#0F141C] border-[#1A2232] hover:border-blue-500/30' : 'bg-slate-50 border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-2.5 overflow-hidden text-left">
              <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 text-cyan-300 font-bold text-xs border border-cyan-500/30">
                {userInitials}
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#10B981]" />
              </div>
              <div className="overflow-hidden text-left">
                <p className={`text-xs font-bold truncate ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                  {userName}
                </p>
                <p className="text-[9px] text-[#00F2C3] font-mono font-bold truncate uppercase">
                  {userRoleDisplay}
                </p>
              </div>
            </div>

            <button
              onClick={logout}
              title="Cerrar Sesión"
              className={`p-2 rounded-lg border transition-all ${
                isDark
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20 hover:shadow-[0_0_8px_rgba(244,63,94,0.3)]'
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

            <LiveClock className="hidden lg:block text-xs font-mono text-slate-400 mr-2" />

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
