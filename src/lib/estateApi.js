import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api, getAuthToken, setAuthToken } from './apiClient';

/**
 * v1 API collection endpoints (docs/PLAN.md §L3/L4). Collections without a
 * server endpoint fall back to local seed data.
 */
export const ESTATE_ENDPOINTS = {
  projects: '/projects',
  ffeItems: '/ffe',
  snags: '/snags',
  invoices: '/invoices',
  clients: '/clients',
  purchaseOrders: '/buying/purchase-orders',
  suppliers: '/buying/suppliers',
  stockItems: '/stock/items',
  warehouses: '/stock/warehouses',
  stockLedgerEntries: '/stock/ledger',
  boms: '/manufacturing/boms',
  workOrders: '/manufacturing/work-orders',
  assets: '/assets',
  opportunities: '/crm/opportunities',
  issues: '/support/issues',
  chartOfAccounts: '/accounts/chart-of-accounts',
  glEntries: '/accounts/general-ledger',
  journalEntries: '/accounts/journal-entries',
};

/** Hydration is skipped in tests and when no API base URL is configured. */
export function isApiEnabled() {
  return import.meta.env.MODE !== 'test' && Boolean(import.meta.env.VITE_API_BASE_URL);
}

/**
 * Ensures a valid Sanctum bearer token exists for local dev requests.
 */
export async function ensureDevSession() {
  if (!isApiEnabled() || getAuthToken()) return;
  try {
    const res = await api.login('sarah@ashara-atelier.com', 'password');
    if (res?.token) {
      setAuthToken(res.token);
    }
  } catch {
    // Failures fallback cleanly to local state
  }
}

/**
 * Fetches a collection and writes it into the provided state setter. Seed data
 * remains visible until a non-empty response resolves; failures are silent.
 * @param {string} path
 * @param {(value: unknown) => void} setter
 * @param {boolean} enabled
 */
export function useRemoteCollection(path, setter, enabled) {
  useEffect(() => {
    if (enabled && !getAuthToken()) {
      ensureDevSession();
    }
  }, [enabled]);

  const { data } = useQuery({
    queryKey: ['estate', path],
    queryFn: async () => {
      if (!getAuthToken()) {
        await ensureDevSession();
      }
      return api.get(path);
    },
    enabled,
    retry: 1,
  });

  useEffect(() => {
    if (Array.isArray(data) && data.length > 0) setter(data);
  }, [data, setter]);
}
