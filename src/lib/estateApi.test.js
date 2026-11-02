import { describe, it, expect } from 'vitest';
import { isApiEnabled, ESTATE_ENDPOINTS } from './estateApi';
import { queryClient } from './queryClient';

describe('estateApi', () => {
  it('disables hydration under test', () => {
    expect(isApiEnabled()).toBe(false);
  });

  it('exposes relative v1 endpoints', () => {
    expect(Object.keys(ESTATE_ENDPOINTS)).toContain('purchaseOrders');
    for (const path of Object.values(ESTATE_ENDPOINTS)) {
      expect(path.startsWith('/')).toBe(true);
    }
  });
});

describe('queryClient', () => {
  it('disables retries and window-focus refetch by default', () => {
    const queries = queryClient.getDefaultOptions().queries;
    expect(queries.retry).toBe(false);
    expect(queries.refetchOnWindowFocus).toBe(false);
  });
});
