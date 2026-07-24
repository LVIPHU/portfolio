import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { ThemeProvider } from '@/components/theme-provider'
import { SmoothScroll } from '@/components/smooth-scroll'
import { anton, roboto } from '@/lib/fonts'
import { profile } from '@portfolio/content'
import '../globals.css'

export const metadata: Metadata = {
  title: {
    default: profile.name,
    template: `%s · ${profile.name}`,
  },
  description: 'Portfolio',
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }
  setRequestLocale(locale)

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${anton.variable} ${roboto.variable} flex min-h-screen flex-col antialiased`}>
        {/* Panchang (h3/h4) qua Fontshare — React tự hoist <link> lên head */}
        <link rel='stylesheet' href='https://api.fontshare.com/v2/css?f[]=panchang@700&display=swap' />
        <NextIntlClientProvider>
          <ThemeProvider>
            {/* Intro KHÔNG đặt ở đây: chỉ trang chủ (main) + (showcase)/about mount nó
                — trang nội dung sâu không mang markup/JS intro (18KB path SVG). Cờ
                module-scope trong intro.tsx chống phát lại khi điều hướng SPA. */}
            <SmoothScroll>{children}</SmoothScroll>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
