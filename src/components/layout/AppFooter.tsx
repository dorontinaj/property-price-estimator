import { Link } from "@tanstack/react-router"
import { Home, Brain, Cpu, BookOpen } from "lucide-react"

/**
 * AppFooter
 * 
 * Application-wide footer component.
 * Part of the layout layer - provides consistent footer across all pages.
 * 
 * Features:
 * - Navigation links
 * - Branding
 * - External links (GitHub, etc.)
 * - Copyright and disclaimer
 * 
 * Architecture note: Shared layout components reside in components/layout/
 * and maintain consistency across the application without feature coupling.
 */

const navigationLinks = [
  { name: "Estimator", href: "/", icon: Home },
  { name: "Neural Network", href: "/neural-network", icon: Brain },
  { name: "Algorithms", href: "/algorithms", icon: Cpu },
  { name: "Methodology", href: "/methodology", icon: BookOpen },
]

export function AppFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full bg-muted/50 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Home className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold text-foreground">
              PriceLens
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-wrap justify-end gap-4">
            {navigationLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-border">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <p className="text-sm text-muted-foreground">
              {currentYear} Belgian Property Estimator.
            </p>

          </div>
        </div>
      </div>
    </footer>
  )
}
