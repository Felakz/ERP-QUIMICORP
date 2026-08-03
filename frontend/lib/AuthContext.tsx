'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export type UserRole =
  | 'GERENCIA'
  | 'ADMINISTRACION'
  | 'FINANZAS'
  | 'VENTAS_ATENCION_DIGITAL'
  | 'ECOMMERCE_MARKETING'
  | 'PRODUCCION_ALMACEN'
  | 'COMPRAS_PROVEEDORES'
  | 'RECURSOS_HUMANOS'
  | 'SISTEMAS_TI'
  | 'DISENO_MULTIMEDIA'
  | 'ARCHIVO_HISTORICO';

export interface UserSession {
  id: string;
  email: string;
  nombre: string;
  role: UserRole;
}

interface AuthContextType {
  user: UserSession | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: UserSession) => void;
  logout: () => void;
  setDevRole: (role: UserRole) => void;
}

const ROLE_HOME_MAP: Record<UserRole, string> = {
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

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: true,
  login: () => {},
  logout: () => {},
  setDevRole: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const savedToken = localStorage.getItem('quimicorp_jwt');
    const savedUser = localStorage.getItem('quimicorp_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
        document.cookie = `quimicorp_jwt=${savedToken}; path=/; max-age=86400; SameSite=Lax`;
        document.cookie = `quimicorp_role=${JSON.parse(savedUser).role}; path=/; max-age=86400; SameSite=Lax`;
      } catch (e) {
        console.error('Error parsing stored user:', e);
      }
    } else {
      // Default dev fallback (Producción & Almacén)
      const defaultUser: UserSession = {
        id: 'dev-user-01',
        email: 'produccion@quimicorp.pe',
        nombre: 'Ing. Mateo Rivas (Jefe Planta)',
        role: 'PRODUCCION_ALMACEN',
      };
      setUser(defaultUser);
      setToken('dev-token-produccion');
      document.cookie = `quimicorp_jwt=dev-token; path=/; max-age=86400; SameSite=Lax`;
      document.cookie = `quimicorp_role=PRODUCCION_ALMACEN; path=/; max-age=86400; SameSite=Lax`;
    }
    setLoading(false);
  }, []);

  const login = (newToken: string, newUser: UserSession) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('quimicorp_jwt', newToken);
    localStorage.setItem('quimicorp_user', JSON.stringify(newUser));
    document.cookie = `quimicorp_jwt=${newToken}; path=/; max-age=86400; SameSite=Lax`;
    document.cookie = `quimicorp_role=${newUser.role}; path=/; max-age=86400; SameSite=Lax`;

    const targetRoute = ROLE_HOME_MAP[newUser.role] || '/dashboard';
    router.push(targetRoute);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('quimicorp_jwt');
    localStorage.removeItem('quimicorp_user');
    document.cookie = 'quimicorp_jwt=; path=/; max-age=0';
    document.cookie = 'quimicorp_role=; path=/; max-age=0';
    router.push('/login');
  };

  const setDevRole = (newRole: UserRole) => {
    if (!user) return;
    const roleNames: Record<UserRole, string> = {
      GERENCIA: 'Carlos Mendoza (Gerente)',
      ADMINISTRACION: 'Ana Torres (Admin)',
      FINANZAS: 'Roberto Silva (Finanzas)',
      VENTAS_ATENCION_DIGITAL: 'Elena Gómez (Ventas)',
      ECOMMERCE_MARKETING: 'Diego Castro (Ecommerce)',
      PRODUCCION_ALMACEN: 'Ing. Mateo Rivas (Jefe Planta)',
      COMPRAS_PROVEEDORES: 'Laura Paredes (Compras)',
      RECURSOS_HUMANOS: 'Sofia Morales (RRHH)',
      SISTEMAS_TI: 'Alex Salazar (Sistemas TI)',
      DISENO_MULTIMEDIA: 'Valeria Rios (Diseño)',
      ARCHIVO_HISTORICO: 'Mario Vega (Archivo)',
    };

    const updatedUser: UserSession = {
      ...user,
      role: newRole,
      nombre: roleNames[newRole] || user.nombre,
      email: `${newRole.toLowerCase()}@quimicorp.pe`,
    };

    login('dev-token-' + newRole.toLowerCase(), updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, setDevRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
