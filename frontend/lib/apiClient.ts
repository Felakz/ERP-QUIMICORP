/**
 * Centralized API client for QUIMICORP ERP frontend
 * Handles JWT authentication, automatic token refresh/fallback in dev, and error normalization.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export async function getAuthToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null;

  let token = localStorage.getItem('quimicorp_jwt');
  if (token && !token.startsWith('jwt_mock')) {
    return token;
  }

  // En entorno de desarrollo, auto-autenticar con credenciales de administración
  try {
    const authRes = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'administracion@quimicorp.pe', password: 'Quimicorp2026!' }),
    });

    if (authRes.ok) {
      const authData = await authRes.json();
      if (authData.token) {
        localStorage.setItem('quimicorp_jwt', authData.token);
        if (authData.user) {
          localStorage.setItem('quimicorp_user', JSON.stringify(authData.user));
        }
        return authData.token;
      }
    }
  } catch (err) {
    console.error('Error auto-autenticando en apiClient:', err);
  }

  return token;
}

export async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ data: T | null; error: string | null; ok: boolean; status: number }> {
  const token = await getAuthToken();

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((options.headers as Record<string, string>) || {}),
  };

  try {
    let res = await fetch(url, {
      ...options,
      headers,
    });

    // Si devuelve 401 Unauthorized, reintentar login una vez
    if (res.status === 401) {
      localStorage.removeItem('quimicorp_jwt');
      const newToken = await getAuthToken();
      if (newToken) {
        headers.Authorization = `Bearer ${newToken}`;
        res = await fetch(url, {
          ...options,
          headers,
        });
      }
    }

    if (!res.ok) {
      const errorJson = await res.json().catch(() => ({}));
      const errorMessage = errorJson.message || `Error ${res.status}: ${res.statusText}`;
      return {
        data: null,
        error: Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage,
        ok: false,
        status: res.status,
      };
    }

    const data = await res.json().catch(() => null);
    return { data, error: null, ok: true, status: res.status };
  } catch (err: any) {
    return {
      data: null,
      error: err.message || 'Error de conexión con el servidor',
      ok: false,
      status: 0,
    };
  }
}
