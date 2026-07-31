'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Beaker,
  CheckCircle2,
  Users,
  Tag,
  ShieldCheck,
  Bell,
  Plus,
  Download,
  Check,
  Sun,
  Moon,
  Inbox,
} from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';

const NAV_GROUPS = [
  {
    title: 'PEDIDOS DE ADMINISTRACIÓN',
    items: [
      { href: '/dashboard/pedidos-admin', label: 'Pedidos Entrantes', icon: Inbox, badge: '3' },
    ],
  },
  {
    title: 'PRODUCCIÓN',
    items: [
      { href: '/dashboard/inventario', label: 'Inventarios', icon: Package },
      { href: '/dashboard/formulas', label: 'Fórmulas & Ajuste', icon: Beaker },
      { href: '/dashboard/qa', label: 'QA & Kardex', icon: CheckCircle2 },
    ],
  },
  {
    title: 'PERSONAL DE PLANTA',
    items: [
      { href: '/dashboard/biometria', label: 'Biometría & Turnos', icon: Users },
    ],
  },
  {
    title: 'TRAZABILIDAD & DESPACHO',
    items: [
      { href: '/dashboard/etiquetas', label: 'Etiquetas & Despacho', icon: Tag },
    ],
  },
  {
    title: 'KPIS & CONTROL',
    items: [
      { href: '/dashboard', label: 'Dashboard Ejecutivo', icon: LayoutDashboard },
    ],
  },
  {
    title: 'SEGURIDAD & PERMISOS',
    items: [
      { href: '/dashboard/seguridad', label: 'Seguridad & RBAC', icon: ShieldCheck },
    ],
  },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [period, setPeriod] = React.useState<'Semana' | 'Mes' | 'Trimestre'>('Semana');
  const [timeString, setTimeString] = React.useState('');

  const isDark = theme === 'dark';

  React.useEffect(() => {
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

  const getHeaderInfo = () => {
    switch (pathname) {
      case '/dashboard/pedidos-admin':
        return { title: 'Pedidos de Administración', moduleName: 'Gestión de Órdenes Entrantes' };
      case '/dashboard/inventario':
        return { title: 'Inventarios & Sub-Almacén', moduleName: 'Módulo de Producción' };
      case '/dashboard/formulas':
        return { title: 'Fórmulas & Ajuste Fino', moduleName: 'Módulo de Producción' };
      case '/dashboard/qa':
      case '/dashboard/kardex':
        return { title: 'QA Approval & Kardex Inmutable', moduleName: 'Módulo de Producción' };
      case '/dashboard/biometria':
        return { title: 'Biometría & Turnos', moduleName: 'Personal de Planta' };
      case '/dashboard/etiquetas':
        return { title: 'Etiquetas & Despacho', moduleName: 'Trazabilidad & Despacho' };
      case '/dashboard/seguridad':
        return { title: 'Seguridad & RBAC', moduleName: 'Control de Acceso' };
      default:
        return { title: 'Dashboard Ejecutivo', moduleName: 'KPIs & Control' };
    }
  };

  const headerInfo = getHeaderInfo();

  return (
    <div
      className={`flex min-h-screen font-mono transition-colors duration-200 ${
        isDark ? 'bg-[#090C10] text-slate-100' : 'bg-[#F1F5F9] text-slate-900'
      }`}
    >
      {/* Sidebar */}
      <aside
        className={`hidden w-64 shrink-0 sticky top-0 h-screen overflow-y-auto flex-col justify-between border-r lg:flex transition-colors duration-200 ${
          isDark
            ? 'bg-[#0B0F17] border-[#1A2232]'
            : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div>
          {/* Logo Header */}
          <div
            className={`border-b px-6 py-5 flex items-center gap-3 ${
              isDark ? 'border-[#1A2232]' : 'border-slate-100'
            }`}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#00F2C3]/15 text-[#00F2C3] border border-[#00F2C3]/30 font-black text-lg">
              Q
            </div>
            <div>
              <p
                className={`text-sm font-bold tracking-wider uppercase ${
                  isDark ? 'text-slate-100' : 'text-slate-900'
                }`}
              >
                QUIMICORP
              </p>
              <p
                className={`text-[10px] tracking-widest font-semibold uppercase ${
                  isDark ? 'text-slate-400' : 'text-slate-400'
                }`}
              >
                ERP INDUSTRIAL v2.4
              </p>
            </div>
          </div>

          {/* Navigation Groups */}
          <nav className="space-y-5 px-3 py-5">
            {NAV_GROUPS.map((group) => (
              <div key={group.title}>
                <p
                  className={`px-3 text-[10px] font-bold tracking-widest uppercase mb-2 ${
                    isDark ? 'text-slate-500' : 'text-slate-400'
                  }`}
                >
                  {group.title}
                </p>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const isActive =
                      pathname === item.href ||
                      (item.href === '/dashboard/qa' && pathname === '/dashboard/kardex');
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-all duration-150 ${
                          isActive
                            ? isDark
                              ? 'bg-[#00F2C3]/10 text-[#00F2C3] border border-[#00F2C3]/20 font-bold'
                              : 'bg-cyan-50 text-cyan-700 border border-cyan-200 font-bold'
                            : isDark
                            ? 'text-slate-400 hover:bg-[#151D2A] hover:text-slate-200'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon
                            className={`h-4 w-4 ${
                              isActive
                                ? isDark
                                  ? 'text-[#00F2C3]'
                                  : 'text-cyan-600'
                                : 'text-slate-400'
                            }`}
                          />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className="rounded-full bg-[#00F2C3] px-2 py-0.5 text-[10px] font-bold text-[#090C10]">
                            {item.badge}
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

        {/* User Footer Profile */}
        <div
          className={`border-t p-4 ${
            isDark ? 'border-[#1A2232]' : 'border-slate-100'
          }`}
        >
          <div
            className={`flex items-center gap-3 rounded-xl p-2.5 border ${
              isDark
                ? 'bg-[#0F141C] border-[#1A2232]'
                : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-600 font-bold text-xs border border-cyan-500/30">
              SP
            </div>
            <div className="overflow-hidden">
              <p
                className={`text-xs font-bold truncate ${
                  isDark ? 'text-slate-200' : 'text-slate-900'
                }`}
              >
                Supervisor Planta
              </p>
              <p className="text-[10px] text-slate-400 truncate">PRODUCCIÓN</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header
          className={`flex h-14 shrink-0 items-center justify-between border-b px-6 transition-colors duration-200 ${
            isDark
              ? 'bg-[#0B0F17] border-[#1A2232]'
              : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          {/* Title & Status */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <h1
                className={`font-bold tracking-wide ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                {headerInfo.title}
              </h1>
              <span className="text-slate-400">/</span>
              <span className="text-xs text-slate-400 font-mono">
                {headerInfo.moduleName}
              </span>
            </div>
            <div
              className={`hidden md:flex items-center gap-4 ml-6 border-l pl-6 text-[11px] ${
                isDark ? 'border-[#1A2232]' : 'border-slate-200'
              }`}
            >
              <span className="flex items-center gap-1.5 font-bold text-emerald-500">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                PLC ONLINE
              </span>
              <span className="flex items-center gap-1.5 font-bold text-amber-500">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                REACTOR A2
              </span>
            </div>
          </div>

          {/* Time, Theme Switcher & Actions */}
          <div className="flex items-center gap-3">
            <span className="hidden lg:block text-xs font-mono text-slate-400 mr-2">
              {timeString}
            </span>

            {/* Theme Toggle Button (Sol / Luna) */}
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

            {pathname === '/dashboard/inventario' && (
              <button className="flex items-center gap-1.5 rounded-lg bg-[#00F2C3] px-3.5 py-1.5 text-xs font-bold text-[#090C10] hover:bg-[#00d8ad] transition-all shadow-md">
                <Plus className="h-4 w-4 stroke-[3]" />
                <span>Registrar Ingreso</span>
              </button>
            )}

            {pathname === '/dashboard/formulas' && (
              <>
                <button
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold border transition-colors ${
                    isDark
                      ? 'bg-[#151D2A] text-slate-300 border-[#1A2232] hover:bg-slate-800'
                      : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                  }`}
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Exportar Ficha</span>
                </button>
                <button className="flex items-center gap-1.5 rounded-lg bg-[#00F2C3] px-3.5 py-1.5 text-xs font-bold text-[#090C10] hover:bg-[#00d8ad] transition-all shadow-md">
                  <Check className="h-4 w-4 stroke-[3]" />
                  <span>Enviar a QA</span>
                </button>
              </>
            )}

            {pathname === '/dashboard' && (
              <div
                className={`flex rounded-lg p-1 border text-xs ${
                  isDark
                    ? 'bg-[#0F141C] border-[#1A2232]'
                    : 'bg-slate-100 border-slate-300'
                }`}
              >
                {(['Semana', 'Mes', 'Trimestre'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={`rounded px-3 py-1 font-bold transition-all ${
                      period === p
                        ? 'bg-[#00F2C3] text-[#090C10]'
                        : isDark
                        ? 'text-slate-400 hover:text-slate-200'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}

            {/* Notification Bell */}
            <button
              className={`relative rounded-lg p-2 border transition-colors ${
                isDark
                  ? 'bg-[#0F141C] text-slate-400 hover:text-slate-200 border-[#1A2232]'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 border-slate-300'
              }`}
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-rose-500" />
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main
          className={`flex-1 overflow-y-auto p-5 transition-colors duration-200 ${
            isDark ? 'bg-[#090C10]' : 'bg-[#F1F5F9]'
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
