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
  setDevRole: (role: UserRole) => Promise<void>;
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

const ROLE_EMAIL_MAP: Record<UserRole, string> = {
  GERENCIA: 'gerencia@quimicorp.pe',
  ADMINISTRACION: 'administracion@quimicorp.pe',
  FINANZAS: 'finanzas@quimicorp.pe',
  VENTAS_ATENCION_DIGITAL: 'ventas@quimicorp.pe',
  ECOMMERCE_MARKETING: 'ecommerce@quimicorp.pe',
  PRODUCCION_ALMACEN: 'produccion@quimicorp.pe',
  COMPRAS_PROVEEDORES: 'compras@quimicorp.pe',
  RECURSOS_HUMANOS: 'rrhh@quimicorp.pe',
  SISTEMAS_TI: 'sistemas@quimicorp.pe',
  DISENO_MULTIMEDIA: 'diseno@quimicorp.pe',
  ARCHIVO_HISTORICO: 'historico@quimicorp.pe',
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: true,
  login: () => {},
  logout: () => {},
  setDevRole: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const savedToken = localStorage.getItem('quimicorp_jwt');
    const savedUser = localStorage.getItem('quimicorp_user');

    if (savedToken && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setToken(savedToken);
        setUser(parsedUser);
        document.cookie = `quimicorp_jwt=${savedToken}; path=/; max-age=86400; SameSite=Lax`;
        document.cookie = `quimicorp_role=${parsedUser.role}; path=/; max-age=86400; SameSite=Lax`;
      } catch (e) {
        console.error('Error parsing stored user session:', e);
        setUser(null);
        setToken(null);
      }
    } else {
      setUser(null);
      setToken(null);
      document.cookie = 'quimicorp_jwt=; path=/; max-age=0';
      document.cookie = 'quimicorp_role=; path=/; max-age=0';
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

  const setDevRole = async (newRole: UserRole) => {
    const targetEmail = ROLE_EMAIL_MAP[newRole];
    if (!targetEmail) return;

    try {
      const res = await fetch('http://localhost:3001/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: targetEmail, password: 'Quimicorp2026!' }),
      });

      if (!res.ok) {
        throw new Error('Error al autenticar en Dev Mode contra BD');
      }

      const { token: realToken, user: realUser } = await res.json();
      login(realToken, realUser);
    } catch (e) {
      console.error('Error switching dev role via DB auth:', e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, setDevRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
