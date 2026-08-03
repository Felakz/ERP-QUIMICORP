import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ROLE_DEFAULT_ROUTE: Record<string, string> = {
  PRODUCCION_ALMACEN: '/dashboard/produccion-qa',
  GERENCIA: '/dashboard/gerencia',
  ADMINISTRACION: '/dashboard/administracion',
  FINANZAS: '/dashboard/finanzas',
  VENTAS_ATENCION_DIGITAL: '/dashboard/ventas',
  ECOMMERCE_MARKETING: '/dashboard/ecommerce',
  COMPRAS_PROVEEDORES: '/dashboard/compras',
  RECURSOS_HUMANOS: '/dashboard/biometria',
  SISTEMAS_TI: '/dashboard/seguridad',
  DISENO_MULTIMEDIA: '/dashboard/diseno',
  ARCHIVO_HISTORICO: '/dashboard/historico',
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('quimicorp_jwt')?.value;
  const userRole = request.cookies.get('quimicorp_role')?.value || 'PRODUCCION_ALMACEN';

  // Si intenta ingresar a /login teniendo ya sesión, redirigir a su dashboard correspondiente
  if (pathname === '/login') {
    if (token) {
      const defaultPath = ROLE_DEFAULT_ROUTE[userRole] || '/dashboard/produccion-qa';
      return NextResponse.redirect(new URL(defaultPath, request.url));
    }
    return NextResponse.next();
  }

  // Si intenta acceder al dashboard sin estar autenticado
  if (pathname.startsWith('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};
