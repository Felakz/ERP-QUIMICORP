import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ASISTENTE_RESTRICTED_ROUTES = [
  '/administracion/dashboard',
  '/administracion/analisis',
  '/administracion/facturacion',
  '/administracion/asistencia',
  '/administracion/reportes',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const jwt = request.cookies.get('quimicorp_jwt')?.value;
  const role = request.cookies.get('quimicorp_role')?.value;

  // 1. Si no está autenticado y trata de acceder a módulos protegidos
  if (!jwt) {
    if (
      pathname.startsWith('/administracion') ||
      pathname.startsWith('/produccion') ||
      pathname.startsWith('/ventas') ||
      pathname.startsWith('/gerencia')
    ) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // 2. Restricciones para ASISTENTE_ADMINISTRATIVO
  if (role === 'ASISTENTE_ADMINISTRATIVO') {
    const isRestricted = ASISTENTE_RESTRICTED_ROUTES.some((route) =>
      pathname.startsWith(route)
    );
    if (isRestricted) {
      return NextResponse.redirect(new URL('/administracion/pedidos', request.url));
    }
  }

  // 3. Restricciones para PRODUCCION_ALMACEN
  if (role === 'PRODUCCION_ALMACEN') {
    if (pathname.startsWith('/administracion') && !pathname.startsWith('/administracion/control')) {
      return NextResponse.redirect(new URL('/administracion/control', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
