import { QueryClient } from '@tanstack/react-query';

/**
 * Shared React Query client (docs/PLAN.md §L4 data layer). The app seeds from
 * local data and hydrates from the v1 API in the background.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});
