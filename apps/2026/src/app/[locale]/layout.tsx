import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { routing } from '@portfolio/i18n'
import { ThemeProvider } from '@/components/theme-provider'
import { SmoothScroll } from '@/components/scroll/smooth-scroll'
import { Scrollbar } from '@/components/scroll/scrollbar'
import { Cursor } from '@/components/chrome/cursor'
import { anton, roboto, spaceGrotesk } from '@/utils/fonts'
import { profile } from '@portfolio/content'
import '../globals.css'
// Nạp SAU globals.css và tách riêng — Lightning CSS của Tailwind cắt scrollbar-* khỏi file
// nào có @import 'tailwindcss'. Chi tiết trong chính file đó.
import '../native-scrollbar.css'

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
      <body
        className={`${anton.variable} ${spaceGrotesk.variable} ${roboto.variable} flex min-h-screen flex-col antialiased`}
      >
        <NextIntlClientProvider>
          <ThemeProvider>
            {/* Intro KHÔNG đặt ở đây: chỉ trang chủ (main) + (showcase)/about mount nó
                — trang nội dung sâu không mang markup/JS intro (18KB path SVG). Cờ
                module-scope trong intro.tsx chống phát lại khi điều hướng SPA. */}
            <SmoothScroll>
              {/* Thanh tiến độ đặt ở đây chứ không riêng (showcase): lenis mount Scrollbar
                  trong default layout (layouts/default/index.js:108) nên nó chạy toàn site.
                  Phải nằm TRONG SmoothScroll vì component đọc tiến độ qua useLenis. */}
              <Scrollbar />
              {children}
              {/* Con trỏ tuỳ biến chạy toàn site. Luật ẩn con trỏ native nằm ở globals.css
                  (ngoài @layer) chứ không còn trong showcase/theme.css — file đó chỉ nạp ở
                  route (showcase) nên luật cũ không với tới các trang khác. */}
              <Cursor />
            </SmoothScroll>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
