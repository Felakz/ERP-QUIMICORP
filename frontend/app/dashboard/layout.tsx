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
  FileText,
  Sliders,
  Clock,
  LogOut,
} from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';
import { useAuth } from '@/lib/AuthContext';

interface NavItem {
  href: string;
  label: string;
  icon: any;
  badge?: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: 'KPIS & CONTROL',
    items: [
      { href: '/dashboard', label: 'Dashboard Ejecutivo', icon: LayoutDashboard },
    ],
  },
  {
    title: 'PEDIDOS DE ADMINISTRACIÓN',
    items: [
      { href: '/dashboard/pedidos-admin', label: 'Pedidos Entrantes', icon: Inbox, badge: '3' },
    ],
  },
  {
    title: 'PRODUCCIÓN & PLANTA',
    items: [
      { href: '/dashboard/inventario', label: 'Inventarios & Stock', icon: Package },
      { href: '/dashboard/formulas', label: 'Fórmulas & Ajuste Fino', icon: Beaker },
      { href: '/dashboard/produccion-qa', label: 'Control de Producción & QA', icon: Sliders },
    ],
  },
  {
    title: 'TRAZABILIDAD & LOGÍSTICA',
    items: [
      { href: '/dashboard/kardex', label: 'Kardex de Inventario', icon: FileText },
      { href: '/dashboard/etiquetas', label: 'Etiquetas & Despacho', icon: Tag },
    ],
  },
  {
    title: 'PERSONAL DE PLANTA',
    items: [
      { href: '/dashboard/biometria', label: 'Biometría & Turnos', icon: Clock },
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
  const { user, logout } = useAuth();
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
    const isAdmin = user?.role === 'ADMINISTRACION';

    switch (pathname) {
      case '/dashboard/administracion':
        return { title: 'Dashboard Administración', moduleName: 'Área de Administración' };
      case '/dashboard/pedidos-admin':
        return {
          title: isAdmin ? 'Pedidos Comerciales' : 'Pedidos Entrantes en Planta',
          moduleName: isAdmin ? 'Área de Administración' : 'Producción & Planta',
        };
      case '/dashboard/inventario':
        return {
          title: 'Inventario & Stock',
          moduleName: isAdmin ? 'Área de Administración' : 'Producción & Planta',
        };
      case '/dashboard/formulas':
        return {
          title: 'Catálogo de Fórmulas Maestras',
          moduleName: isAdmin ? 'Área de Administración' : 'Producción & Planta',
        };
      case '/dashboard/qa':
      case '/dashboard/produccion-qa':
        return { title: 'Control de Producción & QA', moduleName: 'Producción & Planta' };
      case '/dashboard/kardex':
        return { title: 'Kardex de Inventario', moduleName: 'Trazabilidad & Logística' };
      case '/dashboard/biometria':
        return { title: 'Biometría & Turnos (ZKTeco)', moduleName: 'Personal de Planta' };
      case '/dashboard/etiquetas':
        return { title: 'Etiquetas & Despacho', moduleName: 'Trazabilidad & Logística' };
      case '/dashboard/seguridad':
        return { title: 'Seguridad & RBAC', moduleName: 'Seguridad & Permisos' };
      case '/dashboard':
      default:
        return { title: 'Dashboard Ejecutivo', moduleName: 'KPIs & Control' };
    }
  };

  const headerInfo = getHeaderInfo();

  return (
    <div
      className={`flex h-screen w-screen overflow-hidden font-sans transition-colors duration-200 ${isDark ? 'bg-[#090C10] text-slate-100' : 'bg-slate-50 text-slate-900'
        }`}
    >
      {/* Sidebar */}
      <aside
        className={`w-64 shrink-0 flex flex-col justify-between border-r transition-colors duration-200 ${isDark
          ? 'bg-[#0B0F17] border-[#1A2232]'
          : 'bg-white border-slate-200 shadow-sm'
          }`}
      >
        <div>
          {/* Logo Header */}
          <div
            className={`flex h-16 items-center gap-3 px-6 border-b ${isDark ? 'border-[#1A2232]' : 'border-slate-100'
              }`}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#00F2C3] to-teal-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20">
              <Beaker className="h-5 w-5 stroke-[2.5]" />
            </div>
            <div>
              <h2
                className={`text-sm font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'
                  }`}
              >
                QUIMICORP
              </h2>
              <p
                className={`text-[9px] font-mono tracking-widest font-bold ${isDark ? 'text-cyan-400' : 'text-cyan-700'
                  }`}
              >
                ERP INDUSTRIAL v2.4
              </p>
            </div>
          </div>

          {/* Navigation Groups */}
          <nav className="space-y-5 px-3 py-5 overflow-y-auto max-h-[calc(100vh-8rem)]">
            {(user?.role === 'ADMINISTRACION'
              ? [
                  {
                    title: 'ÁREA DE ADMINISTRACIÓN',
                    items: [
                      { href: '/dashboard/administracion', label: 'Dashboard Admin', icon: LayoutDashboard },
                      { href: '/dashboard/formulas', label: 'Catálogo de Fórmulas', icon: Beaker },
                      { href: '/dashboard/inventario', label: 'Inventario & Stock', icon: Package },
                      { href: '/dashboard/pedidos-admin', label: 'Pedidos Comerciales', icon: Inbox, badge: '3' },
                    ],
                  },
                ]
              : NAV_GROUPS
            ).map((group) => (
              <div key={group.title}>
                <p
                  className={`px-3 text-[10px] font-bold tracking-widest uppercase mb-2 ${isDark ? 'text-slate-500' : 'text-slate-400'
                    }`}
                >
                  {group.title}
                </p>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-all duration-150 ${isActive
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
                            className={`h-4 w-4 ${isActive
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
        <div className={`border-t p-4 ${isDark ? 'border-[#1A2232]' : 'border-slate-100'}`}>
          <div className={`flex items-center justify-between gap-3 rounded-xl p-2.5 border ${isDark ? 'bg-[#0F141C] border-[#1A2232]' : 'bg-slate-50 border-slate-200'}`}>
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#00F2C3]/20 text-[#00F2C3] font-bold text-xs border border-[#00F2C3]/30">
                {user?.nombre ? user.nombre.substring(0, 2).toUpperCase() : 'QP'}
              </div>
              <div className="overflow-hidden text-left">
                <p className={`text-xs font-bold truncate ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                  {user?.nombre || 'Ing. Mateo Rivas'}
                </p>
                <p className="text-[9px] text-[#00F2C3] font-mono font-bold truncate uppercase">
                  {user?.role ? user.role.replace(/_/g, ' ') : 'PRODUCCIÓN & ALMACÉN'}
                </p>
              </div>
            </div>

            <button
              onClick={logout}
              title="Cerrar Sesión"
              className={`p-2 rounded-lg border transition-all ${isDark
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20'
                : 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'
                }`}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header
          className={`flex h-14 shrink-0 items-center justify-between border-b px-6 transition-colors duration-200 ${isDark
            ? 'bg-[#0B0F17] border-[#1A2232]'
            : 'bg-white border-slate-200 shadow-sm'
            }`}
        >
          {/* Title & Status */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <h1
                className={`font-bold tracking-wide ${isDark ? 'text-white' : 'text-slate-900'
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
              className={`hidden md:flex items-center gap-4 ml-6 border-l pl-6 text-[11px] ${isDark ? 'border-[#1A2232]' : 'border-slate-200'
                }`}
            >
              <span className="flex items-center gap-1.5 font-bold text-emerald-400 font-sans">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                SINK ACTIVO (Admin-Planta)
              </span>
            </div>
          </div>

          {/* Time, Theme Switcher & Actions */}
          <div className="flex items-center gap-3">
            <span className="hidden lg:block text-xs font-mono text-slate-400 mr-2">
              {timeString}
            </span>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              title={isDark ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold border transition-all ${isDark
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
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold border transition-colors ${isDark
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

            {/* Notification Bell con WebSockets & Desplegable de Notificaciones */}
            <NotificationCenter isDark={isDark} />
          </div>
        </header>

        {/* Main Content Area */}
        <main
          className={`flex-1 overflow-y-auto p-5 transition-colors duration-200 ${isDark ? 'bg-[#090C10]' : 'bg-[#F1F5F9]'
            }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
}

interface NotificationItem {
  id: string;
  titulo: string;
  mensaje: string;
  hora: string;
  tipo: 'CRITICAL' | 'INFO';
  leida: boolean;
}

function NotificationCenter({ isDark }: { isDark: boolean }) {
  const [openDropdown, setOpenDropdown] = React.useState(false);
  const [toastAlert, setToastAlert] = React.useState<NotificationItem | null>(null);
  const [notifications, setNotifications] = React.useState<NotificationItem[]>([
    {
      id: '1',
      titulo: '⚠️ Stock Crítico Registrado',
      mensaje: 'Ácido Benzoico (0.7 GR) ha alcanzado el límite mínimo en almacén.',
      hora: 'Hace 5 min',
      tipo: 'CRITICAL',
      leida: false,
    },
    {
      id: '2',
      titulo: '🧪 Lote Aprobado por QA',
      mensaje: 'Lote #LOT-2026-0841 liberado y enviado a Etiquetas & Despacho.',
      hora: 'Hace 12 min',
      tipo: 'INFO',
      leida: true,
    },
  ]);

  React.useEffect(() => {
    let socket: any = null;
    try {
      const { io } = require('socket.io-client');
      socket = io('http://localhost:3001');

      socket.on('inventario:alerta_stock_critico', (data: any) => {
        const nuevaNotif: NotificationItem = {
          id: String(Date.now()),
          titulo: '🚨 Alerta de Stock Crítico',
          mensaje: data.mensaje || `${data.nombre} cayó a level crítico (${data.stockReal} ${data.unidad})`,
          hora: new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }),
          tipo: 'CRITICAL',
          leida: false,
        };

        setNotifications((prev) => [nuevaNotif, ...prev]);
        setToastAlert(nuevaNotif);
        setTimeout(() => setToastAlert(null), 6000);
      });

      socket.on('lote:estado_actualizado', (data: any) => {
        const nuevaNotif: NotificationItem = {
          id: String(Date.now()),
          titulo: `⚡ Lote ${data.codigoLote} Actualizado`,
          mensaje: `Estado: ${data.nuevoEstado} — Paso: ${data.pasoProceso}`,
          hora: new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }),
          tipo: 'INFO',
          leida: false,
        };
        setNotifications((prev) => [nuevaNotif, ...prev]);
      });
    } catch (e) {
      console.log('Error conectando socket en layout:', e);
    }

    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  const noLeidas = notifications.filter((n) => !n.leida).length;

  const handleMarcarTodasLeidas = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, leida: true })));
  };

  return (
    <div className="relative font-mono">
      {/* Botón Campanita */}
      <button
        onClick={() => setOpenDropdown(!openDropdown)}
        className={`relative rounded-lg p-2 border transition-all ${isDark
          ? 'bg-[#0F141C] text-slate-400 hover:text-slate-200 border-[#1A2232]'
          : 'bg-slate-100 text-slate-600 hover:text-slate-900 border-slate-300'
          }`}
        title="Centro de Notificaciones en Tiempo Real (WebSockets)"
      >
        <Bell className="h-4 w-4" />
        {noLeidas > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white shadow animate-bounce">
            {noLeidas}
          </span>
        )}
      </button>

      {/* Dropdown Flotante */}
      {openDropdown && (
        <div className={`absolute right-0 mt-2 w-80 rounded-2xl border p-4 shadow-2xl z-50 animate-in fade-in duration-150 ${isDark ? 'bg-[#0F141C] border-[#1A2232] text-slate-200' : 'bg-white border-slate-200 text-slate-800'
          }`}>
          <div className="flex items-center justify-between border-b pb-2 mb-3 border-slate-700/40">
            <h4 className="text-xs font-bold font-sans flex items-center gap-1.5">
              <span>🔔 Notificaciones en Vivo</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-mono">WEBSOCKETS</span>
            </h4>
            {noLeidas > 0 && (
              <button
                onClick={handleMarcarTodasLeidas}
                className="text-[10px] text-cyan-400 hover:underline font-sans font-bold"
              >
                Limpiar
              </button>
            )}
          </div>

          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {notifications.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-4 font-sans">Sin notificaciones pendientes.</p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-2.5 rounded-xl border text-xs transition-all ${n.tipo === 'CRITICAL'
                    ? isDark ? 'bg-rose-950/20 border-rose-500/30 text-rose-300' : 'bg-rose-50 border-rose-200 text-rose-900'
                    : isDark ? 'bg-[#151D2A] border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                >
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-[11px] font-sans">{n.titulo}</span>
                    <span className="text-[9px] text-slate-400 font-mono">{n.hora}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-sans mt-1">{n.mensaje}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Toast Notification Flotante al recibir evento crítico */}
      {toastAlert && (
        <div className="fixed bottom-5 right-5 z-50 max-w-sm rounded-xl p-4 bg-rose-600 text-white shadow-2xl border border-rose-400 flex items-start gap-3 animate-in slide-in-from-bottom-5 duration-300 font-sans">
          <Bell className="w-5 h-5 animate-bounce shrink-0 mt-0.5" />
          <div>
            <h5 className="font-bold text-xs">{toastAlert.titulo}</h5>
            <p className="text-[11px] text-rose-100 mt-0.5">{toastAlert.mensaje}</p>
          </div>
        </div>
      )}
    </div>
  );
}
