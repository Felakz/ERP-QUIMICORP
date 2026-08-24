import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const jwt = request.cookies.get('quimicorp_jwt')?.value;
  const role = request.cookies.get('quimicorp_role')?.value;

  // Si no está autenticado y trata de acceder a módulos protegidos
  if (!jwt) {
    if (
      pathname.startsWith('/administracion') ||
      pathname.startsWith('/produccion') ||
      pathname.startsWith('/ventas') ||
      pathname.startsWith('/gerencia') ||
      pathname.startsWith('/compras')
    ) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Si el usuario es de Producción e intenta entrar a Administración
  if (role === 'PRODUCCION_ALMACEN') {
    if (pathname.startsWith('/administracion') || pathname.startsWith('/ventas')) {
      return NextResponse.redirect(new URL('/produccion/kardex', request.url));
    }
  }

  // Si el usuario es de Ventas e intenta entrar a Administración o Producción no autorizada
  if (role === 'VENTAS_ATENCION_DIGITAL') {
    if (pathname.startsWith('/administracion') || pathname.startsWith('/produccion')) {
      return NextResponse.redirect(new URL('/ventas/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
