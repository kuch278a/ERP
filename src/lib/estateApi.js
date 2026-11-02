import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from './apiClient';

/**
 * v1 API collection endpoints (docs/PLAN.md §L3/L4). Collections without a
 * server endpoint fall back to local seed data.
 */
export const ESTATE_ENDPOINTS = {
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
 * Fetches a collection and writes it into the provided state setter.
 * Seed data remains visible until the request resolves; failures are silent.
 * @param {string} path
 * @param {(value: any) => void} setter
 * @param {boolean} enabled
 */
export function useRemoteCollection(path, setter, enabled) {
  const { data } = useQuery({
    queryKey: ['estate', path],
    queryFn: () => api.get(path),
    enabled,
  });

  useEffect(() => {
    if (Array.isArray(data)) setter(data);
  }, [data, setter]);
}
