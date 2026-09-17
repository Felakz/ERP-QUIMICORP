export type UserRole =
  | 'GERENCIA'
  | 'ADMINISTRACION'
  | 'GERENTE_ADMINISTRATIVO'
  | 'ASISTENTE_ADMINISTRATIVO'
  | 'FINANZAS'
  | 'VENTAS_ATENCION_DIGITAL'
  | 'ECOMMERCE_MARKETING'
  | 'PRODUCCION_ALMACEN'
  | 'COMPRAS_PROVEEDORES'
  | 'RECURSOS_HUMANOS'
  | 'SISTEMAS_TI'
  | 'DISENO_MULTIMEDIA'
  | 'ARCHIVO_HISTORICO'
  | string;

// Matriz de Rutas Accesibles por Rol
export const ROLE_PERMISSIONS: Record<string, string[]> = {
  GERENTE_ADMINISTRATIVO: ['*'], // Acceso total e irrestricto
  GERENCIA: ['*'],

  ASISTENTE_ADMINISTRATIVO: [
    '/administracion/clientes',
    '/administracion/cotizador',
    '/administracion/pedidos',
    // 3. COMPRAS Y ABASTECIMIENTO
    '/administracion/proveedores',
    '/administracion/ordenes',
    '/administracion/compras-ordenes',
    '/administracion/comparador-precios',
    '/administracion/comparador',
    // 4. PRODUCCIÓN Y PLANTA
    '/administracion/control',
    '/administracion/control-produccion',
    '/administracion/despachos',
    '/administracion/incidencias',
    // 5. ALMACÉN Y LOGÍSTICA
    '/administracion/inventario',
    '/administracion/inventario-kardex',
    '/administracion/gestion-inventario',
    '/administracion/alertas',
    '/administracion/alertas-stock',
    // 8. CAPACITACIÓN Y AYUDA
    '/administracion/manual',
  ],

  VENTAS_ATENCION_DIGITAL: [
    '/administracion/cotizador',
    '/administracion/pedidos',
    '/administracion/clientes',
  ],

  PRODUCCION_ALMACEN: [
    '/administracion/control',
    '/administracion/formulas',
    '/administracion/despachos',
    '/administracion/incidencias',
    '/administracion/inventario-kardex',
    '/administracion/alertas',
  ],
};

// Módulos y rutas restringidos explícitamente para Asistente
export const ASISTENTE_RESTRICTED_PATHS = [
  '/administracion/dashboard',
  '/administracion/cobranzas',
  '/administracion/analisis',
  '/administracion/facturacion',
  '/administracion/formulas',
  '/administracion/asistencia',
  '/administracion/reportes',
];

/**
 * Verifica si un rol tiene permiso para acceder a una ruta determinada.
 */
export function hasPermission(role: UserRole | undefined, path: string): boolean {
  if (!role) return false;

  const normalizedRole = String(role).toUpperCase();

  // Gerencia y Gerente Administrativo tienen acceso total
  if (
    normalizedRole === 'GERENCIA' ||
    normalizedRole === 'GERENTE_ADMINISTRATIVO' ||
    normalizedRole === 'ADMINISTRACION'
  ) {
    return true;
  }

  // Si es Asistente, verificar contra rutas restringidas explícitamente
  if (normalizedRole === 'ASISTENTE_ADMINISTRATIVO') {
    const isRestricted = ASISTENTE_RESTRICTED_PATHS.some((r) =>
      path.startsWith(r)
    );
    if (isRestricted) return false;
  }

  const allowedPaths = ROLE_PERMISSIONS[normalizedRole];
  if (!allowedPaths) return true;

  if (allowedPaths.includes('*')) return true;

  return allowedPaths.some((allowed) => path.startsWith(allowed));
}

/**
 * Verifica si el usuario es Gerente (Gerencia o Gerente Administrativo)
 */
export function isGerenteUser(role: UserRole | undefined): boolean {
  if (!role) return false;
  const normalizedRole = String(role).toUpperCase();
  return (
    normalizedRole === 'GERENCIA' ||
    normalizedRole === 'GERENTE_ADMINISTRATIVO' ||
    normalizedRole === 'ADMINISTRACION'
  );
}
