import { LayoutProps } from '@/types/app'
import { allMessages, initLingui } from '@/i18n'
import { ThemeProvider } from '@/providers/theme'
import { LocaleProvider } from '@/providers/locale'
import { AppProvider } from '@/providers/app'

export default async function ProviderRegistry({ children, params }: LayoutProps) {
  const lang = (await params).lang
  await initLingui(lang)
  return (
    <LocaleProvider initialLocale={lang} initialMessages={allMessages[lang]!}>
      <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
        <AppProvider>{children}</AppProvider>
      </ThemeProvider>
    </LocaleProvider>
  )
}
