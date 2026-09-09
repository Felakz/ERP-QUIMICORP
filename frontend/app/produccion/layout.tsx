'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Beaker,
  Tag,
  ShieldCheck,
  Bell,
  Sun,
  Moon,
  Inbox,
  FileText,
  Sliders,
  Clock,
  LogOut,
  BookOpen,
} from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';
import { useAuth } from '@/lib/AuthContext';
import { apiFetch } from '@/lib/apiClient';
import { useSocket } from '@/lib/socketContext';

interface NavSection {
  title: string;
  items: {
    href: string;
    label: string;
    icon: any;
    badge?: string;
  }[];
}

// Sidebar 100% Exclusivo y Operativo de Producción & Planta
const PRODUCCION_PLANTA_SECTIONS: NavSection[] = [
  {
    title: 'PEDIDOS DE ADMINISTRACIÓN',
    items: [
      { href: '/produccion/pedidos', label: 'Pedidos Entrantes', icon: Inbox },
    ],
  },
  {
    title: 'PRODUCCIÓN & PLANTA',
    items: [
      { href: '/produccion/inventario', label: 'Inventarios & Stock', icon: Package },
      { href: '/produccion/formulas', label: 'Fórmulas & Ajuste Fino', icon: Beaker },
      { href: '/produccion/qa', label: 'Control de Producción & QA', icon: Sliders },
    ],
  },
  {
    title: 'TRAZABILIDAD & LOGÍSTICA',
    items: [
      { href: '/produccion/kardex', label: 'Kardex de Inventario', icon: FileText },
      { href: '/produccion/etiquetas', label: 'Etiquetas & Despacho', icon: Tag },
    ],
  },
  {
    title: 'PERSONAL DE PLANTA',
    items: [
      { href: '/produccion/biometria', label: 'Biometría & Turnos', icon: Clock },
    ],
  },
  {
    title: 'CAPACITACIÓN & SOPORTE',
    items: [
      { href: '/produccion/manual', label: 'Manual del Operario', icon: BookOpen },
    ],
  },
];

// Generador de sonido industrial mediante Web Audio API (cero dependencias externas)
function playNotificationChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    // Tono armnico 1: D5 (587.33 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, ctx.currentTime);
    gain1.gain.setValueAtTime(0, ctx.currentTime);
    gain1.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.04);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.35);

    // Tono armnico 2: A5 (880.00 Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880.0, ctx.currentTime + 0.12);
    gain2.gain.setValueAtTime(0, ctx.currentTime + 0.12);
    gain2.gain.linearRampToValueAtTime(0.35, ctx.currentTime + 0.16);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.12);
    osc2.stop(ctx.currentTime + 0.7);
  } catch (e) {
    console.log('Audio notification chime not supported or muted:', e);
  }
}

export default function ProduccionLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const { socket } = useSocket();
  const [timeString, setTimeString] = useState('');
  const [pedidoCount, setPedidoCount] = useState<number>(0);
  const [isAlerting, setIsAlerting] = useState<boolean>(false);
  const [bannerAlert, setBannerAlert] = useState<{ id: string; codigo: string; cliente: string; producto: string } | null>(null);

  const isDark = theme === 'dark';

  const cargarBadgeCount = async () => {
    try {
      const { data, ok } = await apiFetch<any>('/pedidos-admin/kpis');
      if (ok && data) {
        const nuevos = Number((data as any).nuevos) || 0;
        setPedidoCount(nuevos);
        if (nuevos === 0) setIsAlerting(false);
      }
    } catch {}
  };

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

  // Badge en tiempo real vía SocketProvider centralizado (sin polling)
  useEffect(() => {
    cargarBadgeCount();
    if (!socket) return;
    const onCreated = (payload: any) => {
      playNotificationChime();
      setIsAlerting(true);
      setPedidoCount((prev) => prev + 1);
      if (payload) {
        setBannerAlert({
          id: payload.id || '',
          codigo: payload.codigoOrden || 'PO-NUEVO',
          cliente: payload.clienteNombre || 'Cliente Comercial',
          producto: payload.productoNombre || 'Fórmula Industrial',
        });
      }
      cargarBadgeCount();
    };
    const onRefresh = () => cargarBadgeCount();
    const onAccepted = () => {
      setIsAlerting(false);
      cargarBadgeCount();
    };
    socket.on('order:created_to_plant', onCreated);
    socket.on('order:status_updated', onRefresh);
    socket.on('order:accepted_by_plant', onAccepted);
    socket.on('lote:estado_actualizado', onRefresh);
    return () => {
      socket.off('order:created_to_plant', onCreated);
      socket.off('order:status_updated', onRefresh);
      socket.off('order:accepted_by_plant', onAccepted);
      socket.off('lote:estado_actualizado', onRefresh);
    };
  }, [socket]);

  return (
    <div
      className={`flex h-screen w-screen overflow-hidden font-sans transition-colors duration-200 ${
        isDark ? 'bg-[#090C10] text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Toast Flotante con Alerta Sonora */}
      {bannerAlert && (
        <div className="fixed top-4 right-4 z-50 p-4 rounded-2xl bg-gradient-to-r from-[#00F2C3] to-teal-400 text-slate-950 shadow-2xl border border-teal-300 animate-bounce flex items-center gap-3 font-sans">
          <div className="p-2 rounded-xl bg-slate-950 text-[#00F2C3]">
            <Inbox className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider">
              🔔 ¡Nuevo Pedido Comercial ({bannerAlert.codigo})!
            </h4>
            <p className="text-[11px] font-medium text-slate-900">
              {bannerAlert.cliente} • {bannerAlert.producto}
            </p>
          </div>
          <Link
            href="/produccion/pedidos"
            onClick={() => {
              setBannerAlert(null);
              setIsAlerting(false);
            }}
            className="px-3 py-1.5 rounded-lg bg-slate-950 text-white text-xs font-bold hover:bg-slate-800 transition-all ml-2 shadow-md"
          >
            Ver en Planta
          </Link>
          <button
            onClick={() => setBannerAlert(null)}
            className="text-slate-900 hover:text-black font-bold text-xs p-1"
          >
            ?
          </button>
        </div>
      )}

      {/* Sidebar Fijo de Producción & Planta */}
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
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#00F2C3] to-teal-500 text-slate-950 font-black shadow-md shadow-[#00F2C3]/20">
              Q
            </div>
            <div>
              <h2 className={`text-sm font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                QUIMICORP
              </h2>
              <p className={`text-[9px] font-mono tracking-widest font-bold ${isDark ? 'text-cyan-400' : 'text-cyan-700'}`}>
                ERP INDUSTRIAL v2.4
              </p>
            </div>
          </div>

          {/* Navegacin de Planta */}
          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5 font-sans">
            {PRODUCCION_PLANTA_SECTIONS.map((section) => (
              <div key={section.title} className="space-y-1">
                <p
                  className={`px-3 text-[10px] font-bold tracking-widest uppercase mb-1.5 ${
                    isDark ? 'text-slate-500' : 'text-slate-400'
                  }`}
                >
                  {section.title}
                </p>
                <div className="space-y-0.5">
                  {section.items.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    const isPedidosEntrantes = item.href === '/produccion/pedidos';
                    const hasBadge = isPedidosEntrantes ? pedidoCount > 0 : !!item.badge;
                    const badgeCountDisplay = isPedidosEntrantes ? pedidoCount : item.badge;
                    const shouldPulse = isPedidosEntrantes && (isAlerting || pedidoCount > 0);

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => {
                          if (isPedidosEntrantes) {
                            setIsAlerting(false);
                            setBannerAlert(null);
                          }
                        }}
                        className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-all duration-150 group ${
                          shouldPulse
                            ? 'bg-amber-400/20 text-amber-300 border border-amber-400/50 shadow-md animate-pulse ring-2 ring-amber-400/40'
                            : isActive
                            ? isDark
                              ? 'bg-[#00F2C3]/15 text-[#00F2C3] border border-[#00F2C3]/30 font-bold shadow-sm shadow-[#00F2C3]/10'
                              : 'bg-cyan-50 text-cyan-700 border border-cyan-200 font-bold shadow-sm'
                            : isDark
                            ? 'text-slate-400 hover:bg-[#151D2A] hover:text-slate-200'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon
                            className={`h-4 w-4 shrink-0 transition-transform group-hover:scale-110 ${
                              shouldPulse
                                ? 'text-amber-300 animate-bounce'
                                : isActive
                                ? isDark
                                  ? 'text-[#00F2C3]'
                                  : 'text-cyan-600'
                                : 'text-slate-400'
                            }`}
                          />
                          <span className="truncate">{item.label}</span>
                        </div>
                        {hasBadge && (
                          <span
                            className={`flex h-5 min-w-[20px] px-1.5 items-center justify-center rounded-full text-[10px] font-black shadow-sm ${
                              shouldPulse
                                ? 'bg-amber-400 text-slate-950 animate-ping ring-2 ring-amber-300'
                                : 'bg-[#00F2C3] text-[#090C10]'
                            }`}
                          >
                            {badgeCountDisplay}
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

        {/* Footer del Perfil: Supervisor Planta */}
        <div className={`border-t p-3 shrink-0 ${isDark ? 'border-[#1A2232]' : 'border-slate-100'}`}>
          <div
            className={`flex items-center justify-between gap-3 rounded-xl p-2.5 border ${
              isDark ? 'bg-[#0F141C] border-[#1A2232]' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center gap-2.5 overflow-hidden text-left">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#00F2C3]/20 text-[#00F2C3] font-bold text-xs border border-[#00F2C3]/30">
                SP
              </div>
              <div className="overflow-hidden text-left">
                <p className={`text-xs font-bold truncate ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                  Supervisor Planta
                </p>
                <p className="text-[9px] text-[#00F2C3] font-mono font-bold truncate uppercase">
                  PRODUCCIN & QA
                </p>
              </div>
            </div>

            <button
              onClick={logout}
              title="Cerrar Sesin"
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
          {/* Breadcrumb Limpio */}
          <div className="flex items-center gap-2 text-xs font-medium">
            <span className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
              Producción & Planta
            </span>
            <span className="text-slate-400">/</span>
            <span className="text-slate-400 font-mono">
              {pathname.includes('kardex')
                ? 'Kardex de Inventario'
                : pathname.includes('inventario')
                ? 'Inventarios & Stock Fsico'
                : pathname.includes('formulas')
                ? 'Fórmulas & Ajuste Fino'
                : pathname.includes('pedidos')
                ? 'Pedidos Entrantes'
                : pathname.includes('etiquetas')
                ? 'Etiquetas & Despacho'
                : pathname.includes('biometria')
                ? 'Biometra & Turnos'
                : pathname.includes('seguridad')
                ? 'Seguridad & RBAC'
                : 'Control Operativo'}
            </span>
          </div>

          {/* Selector de Tema & Hora */}
          <div className="flex items-center gap-3">
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
