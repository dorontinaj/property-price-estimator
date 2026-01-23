import { QueryClient } from '@tanstack/react-query'

/**
 * Query Client Configuration
 * 
 * Centralized TanStack Query client for data fetching and caching.
 * 
 * Default settings:
 * - Cache time: 5 minutes
 * - Stale time: 1 minute
 * - Retry failed requests 3 times
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      gcTime: 1000 * 60 * 5, // 5 minutes (formerly cacheTime)
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
})
