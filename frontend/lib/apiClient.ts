/**
 * Centralized API client for QUIMICORP ERP frontend
 * Handles JWT authentication, dynamic host resolution, automatic token refresh/fallback, and error normalization.
 */

const DEFAULT_PRODUCTION_API_URL = 'https://erp-quimicorp-production.up.railway.app/api/v1';

export function getApiBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host !== 'localhost' && host !== '127.0.0.1') {
      return DEFAULT_PRODUCTION_API_URL;
    }
    return `http://${host}:3001/api/v1`;
  }
  return DEFAULT_PRODUCTION_API_URL;
}

export function getSocketUrl(): string {
  const baseUrl = getApiBaseUrl();
  return baseUrl.replace(/\/api\/v1\/?$/, '');
}

export async function getAuthToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null;

  let token = localStorage.getItem('quimicorp_jwt');
  if (token && !token.startsWith('jwt_mock')) {
    return token;
  }

  return token;
}

export async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ data: T | null; error: string | null; ok: boolean; status: number }> {
  const token = await getAuthToken();
  const baseUrl = getApiBaseUrl();

  const url = endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

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
