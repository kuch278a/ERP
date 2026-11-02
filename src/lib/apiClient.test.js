import { describe, it, expect, vi, afterEach } from 'vitest';
import { api } from './apiClient';

afterEach(() => vi.restoreAllMocks());

describe('apiClient', () => {
  it('unwraps the { data } envelope on success', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, json: async () => ({ success: true, data: { id: 1 } }) })
    );

    await expect(api.get('/projects')).resolves.toEqual({ id: 1 });
  });

  it('throws ApiError with the server message on failure', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false, status: 422, json: async () => ({ error: 'Validation failed', details: { x: 1 } }) })
    );

    await expect(api.post('/projects', {})).rejects.toMatchObject({
      name: 'ApiError',
      status: 422,
      message: 'Validation failed',
    });
  });

  it('sends the bearer token when provided', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ data: [] }) });
    vi.stubGlobal('fetch', fetchMock);

    await api.get('/items', { token: 'abc' });

    const [, init] = fetchMock.mock.calls[0];
    expect(init.headers.Authorization).toBe('Bearer abc');
  });
});
