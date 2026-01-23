'use client'

import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes'

/**
 * ThemeProvider
 * 
 * Centralized theme management provider using next-themes.
 * Applies CSS class-based themes to the application.
 * 
 * Part of the providers layer (src/providers) as per architecture.
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
