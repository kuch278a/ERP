/**
 * Thin REST client for the Laravel/AureusERP v1 API (see docs/PLAN.md §L3).
 * Unwraps the standard `{ success, data, meta, error }` envelope and manages Sanctum bearer tokens.
 */

const BASE_URL: string = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
const TOKEN_KEY = 'ashara_auth_token';

export function getAuthToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAuthToken(token: string | null): void {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch {
    // Ignore storage quota/security restrictions in test environments
  }
}

export class ApiError extends Error {
  status: number;
  details: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

export interface RequestOptions {
  method?: string;
  body?: unknown;
  token?: string;
  signal?: AbortSignal;
}

async function request(path: string, { method = 'GET', body, token, signal }: RequestOptions = {}): Promise<any> {
  const authToken = token || getAuthToken();

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    signal,
    headers: {
      Accept: 'application/json',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const payload = await res.json().catch(() => null);

  if (!res.ok) {
    const message = payload?.error || payload?.message || `HTTP ${res.status}`;
    throw new ApiError(message, res.status, payload?.details);
  }

  return payload?.data ?? payload;
}

export const api = {
  get: (path: string, opts?: RequestOptions) => request(path, { ...opts, method: 'GET' }),
  post: (path: string, body?: unknown, opts?: RequestOptions) => request(path, { ...opts, method: 'POST', body }),
  put: (path: string, body?: unknown, opts?: RequestOptions) => request(path, { ...opts, method: 'PUT', body }),
  patch: (path: string, body?: unknown, opts?: RequestOptions) => request(path, { ...opts, method: 'PATCH', body }),
  del: (path: string, opts?: RequestOptions) => request(path, { ...opts, method: 'DELETE' }),

  login: async (email: string, password = 'password') => {
    const res = await request('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    if (res?.token) {
      setAuthToken(res.token);
    }
    return res;
  },

  logout: async () => {
    try {
      await request('/auth/logout', { method: 'POST' });
    } finally {
      setAuthToken(null);
    }
  },

  getMe: () => request('/auth/me', { method: 'GET' }),
};
