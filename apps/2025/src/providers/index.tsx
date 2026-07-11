import { ReactNode } from 'react'
import { ThemeProvider } from '@/providers/theme'
import { AppProvider } from '@/providers/app'

export default function ProviderRegistry({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
      <AppProvider>{children}</AppProvider>
    </ThemeProvider>
  )
}
