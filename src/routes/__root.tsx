import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { AppNavbar } from '@/components/layout/AppNavbar'
import { AppFooter } from '@/components/layout/AppFooter'
import { Toaster } from '@/components/ui/toaster'

/**
 * Root Route
 * 
 * Provides the application shell with:
 * - Navigation bar
 * - Footer
 * - Toast notifications
 * - Router devtools (development only)
 * 
 * This replaces Next.js app/layout.tsx
 */
export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  return (
    <>
      <div className="min-h-screen flex flex-col bg-background">
        <AppNavbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <AppFooter />
      </div>
      <Toaster />
      {import.meta.env.DEV && <TanStackRouterDevtools position="bottom-right" />}
    </>
  )
}
