import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const ROLE_HOME_MAP: Record<string, string> = {
  PRODUCCION_ALMACEN: '/produccion/kardex',
  GERENCIA: '/gerencia/dashboard',
  ADMINISTRACION: '/administracion/dashboard',
  GERENTE_ADMINISTRATIVO: '/administracion/dashboard',
  ASISTENTE_ADMINISTRATIVO: '/administracion/dashboard',
  FINANZAS: '/administracion/dashboard',
  VENTAS_ATENCION_DIGITAL: '/ventas/dashboard',
  ECOMMERCE_MARKETING: '/ventas/dashboard',
  COMPRAS_PROVEEDORES: '/compras/dashboard',
};

export default function RootPage() {
  const cookieStore = cookies();
  const token = cookieStore.get('quimicorp_jwt')?.value;
  const role = cookieStore.get('quimicorp_role')?.value;

  if (token && role && ROLE_HOME_MAP[role]) {
    redirect(ROLE_HOME_MAP[role]);
  }

  redirect('/login');
}
