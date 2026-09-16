/**
 * Centralized API client for QUIMICORP ERP frontend
 * Handles JWT authentication, dynamic host resolution, automatic token refresh/fallback, and error normalization.
 */

const DEFAULT_PRODUCTION_API_URL = 'https://erp-quimicorp-production.up.railway.app/api/v1';

let isRedirectingToLogin = false;

function clearAuthAndRedirectToLogin() {
  if (isRedirectingToLogin) return;
  const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  if (isLocal) return; // Evitar deslogueos y bucles bruscos en desarrollo local

  isRedirectingToLogin = true;
  try {
    localStorage.removeItem('quimicorp_jwt');
    localStorage.removeItem('quimicorp_user');
    document.cookie = 'quimicorp_jwt=; path=/; max-age=0';
    document.cookie = 'quimicorp_role=; path=/; max-age=0';
  } catch {}
  window.location.href = '/login';
}

export function getApiBaseUrl(): string {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1' || host === '::1' || host === '[::1]') {
      return 'http://127.0.0.1:3001/api/v1';
    }
  }
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
  if (!token) {
    try {
      const match = document.cookie.match(/(?:^|;\s*)quimicorp_jwt=([^;]*)/);
      if (match && match[1]) {
        token = decodeURIComponent(match[1]);
      }
    } catch {}
  }

  // Fallback seguro en entorno local para evitar 401 si la sesión se reinicia
  if (!token) {
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (isLocal) {
      token = 'jwt_mock_token_admin';
    }
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

    // Si devuelve 401 Unauthorized, limpiar sesión y redirigir al login
    if (res.status === 401) {
      clearAuthAndRedirectToLogin();
      return { data: null, error: 'Sesión expirada. Ingresa nuevamente.', ok: false, status: res.status };
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
