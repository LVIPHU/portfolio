'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    // storageKey mới: reset localStorage 'theme=light' còn sót từ thiết kế cũ
    // (light-default) — mọi khách về đúng dark/amber đồng bộ với /about; toggle vẫn hoạt động.
    <NextThemesProvider attribute='class' defaultTheme='dark' storageKey='portfolio-2026-theme'>
      {children}
    </NextThemesProvider>
  )
}
