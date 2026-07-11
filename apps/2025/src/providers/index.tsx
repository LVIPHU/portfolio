import { ReactNode } from 'react'
import { allMessages, initLingui } from '@/i18n'
import { ThemeProvider } from '@/providers/theme'
import { LocaleProvider } from '@/providers/locale'
import { AppProvider } from '@/providers/app'

/**
 * KHUNG CHUYỂN TIẾP C6 (M-09): nhận linguiLocale (vi-VN|en-US) từ layout
 * để các component CHƯA port vẫn dịch qua Lingui. Gỡ LocaleProvider + initLingui
 * ở plan C06-03 khi hết call site macro.
 */
export default async function ProviderRegistry({
  children,
  linguiLocale,
}: {
  children: ReactNode
  linguiLocale: string
}) {
  await initLingui(linguiLocale)
  return (
    <LocaleProvider initialLocale={linguiLocale} initialMessages={allMessages[linguiLocale]!}>
      <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
        <AppProvider>{children}</AppProvider>
      </ThemeProvider>
    </LocaleProvider>
  )
}
