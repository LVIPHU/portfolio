import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { ThemeProvider } from '@/components/theme-provider'
import { SmoothScroll } from '@/components/smooth-scroll'
import { Intro } from '@/components/showcase/intro'
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
            <SmoothScroll>
              {/* Intro đặt ở layout GỐC (không phải layout từng nhóm route): mount đúng
                  1 lần mỗi lần tải trang thật, điều hướng SPA trong site không phát lại. */}
              <Intro />
              {children}
            </SmoothScroll>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
