/**
 * Thin REST client for the Laravel/AureusERP v1 API (see docs/PLAN.md §L3).
 * Unwraps the standard `{ success, data, meta, error }` envelope.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

export class ApiError extends Error {
  /** @param {string} message @param {number} status @param {unknown} [details] */
  constructor(message, status, details) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

/**
 * @param {string} path
 * @param {{ method?: string, body?: unknown, token?: string, signal?: AbortSignal }} [options]
 * @returns {Promise<any>}
 */
async function request(path, { method = 'GET', body, token, signal } = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    signal,
    headers: {
      Accept: 'application/json',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
  get: (path, opts) => request(path, { ...opts, method: 'GET' }),
  post: (path, body, opts) => request(path, { ...opts, method: 'POST', body }),
  put: (path, body, opts) => request(path, { ...opts, method: 'PUT', body }),
  patch: (path, body, opts) => request(path, { ...opts, method: 'PATCH', body }),
  del: (path, opts) => request(path, { ...opts, method: 'DELETE' }),
};
