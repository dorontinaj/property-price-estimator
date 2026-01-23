import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ThemeProvider } from '@/providers/theme-provider'
import { queryClient } from '@/lib/queryClient'
import { router } from '@/lib/router'
import '@/styles/globals.css'

/**
 * Application Entry Point
 * 
 * Bootstrap the React SPA with:
 * - TanStack Router for client-side routing
 * - TanStack Query for data fetching and caching
 * - Theme Provider for dark/light mode
 * 
 * This replaces Next.js's app/layout.tsx
 */

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider attribute="class" defaultTheme="system" storageKey="property-estimator-theme">
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>
)
