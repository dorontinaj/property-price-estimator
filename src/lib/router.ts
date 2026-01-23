import { createRouter } from '@tanstack/react-router'
import { routeTree } from '../routeTree.gen'

/**
 * Router Configuration
 * 
 * Creates the TanStack Router instance from the generated route tree.
 * Route tree is auto-generated from files in src/routes/
 * 
 * This replaces Next.js App Router's automatic file-based routing.
 */
export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
})

// Register router for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
