import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { routing } from '@portfolio/i18n'
import { profile, type Locale } from '@portfolio/content'
import { ThemeProvider } from '@/components/theme-provider'
import { SmoothScroll } from '@/components/scroll/smooth-scroll'
import { Scrollbar } from '@/components/scroll/scrollbar'
import { Cursor } from '@/components/chrome/cursor'
import { Intro } from '@/components/brand/intro'
import { SiteNav } from '@/components/chrome/site-nav'
import { SkipLink } from '@/components/chrome/skip-link'
import { UmamiAnalytics } from '@/components/chrome/umami-analytics'
import { JsonLd } from '@/components/json-ld'
import { anton, roboto, spaceGrotesk } from '@/utils/fonts'
import { gallery } from '@portfolio/content'
import { SITE_URL, pageMetadata, personJsonLd } from '@/utils/seo'
import '../globals.css'
// Nạp SAU globals.css và tách riêng — Lightning CSS của Tailwind cắt scrollbar-* khỏi file
// nào có @import 'tailwindcss'. Chi tiết trong chính file đó.
import '../native-scrollbar.css'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const loc = (hasLocale(routing.locales, locale) ? locale : routing.defaultLocale) as Locale
  const description = profile.tagline[loc]
  return {
    ...pageMetadata(loc, '/', profile.name, description),
    metadataBase: new URL(SITE_URL),
    title: {
      default: profile.name,
      template: `%s · ${profile.name}`,
    },
  }
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
  const t = await getTranslations('nav')

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${anton.variable} ${spaceGrotesk.variable} ${roboto.variable} flex min-h-screen flex-col antialiased`}
      >
        <JsonLd data={personJsonLd()} />
        <UmamiAnalytics />
        <SpeedInsights />
        <NextIntlClientProvider>
          <ThemeProvider>
            {/* Intro mount MỘT lần ở đây. Đổi route (kể cả F5) chạy lại choreography đầy đủ. */}
            <SmoothScroll>
              <SkipLink label={t('skipToContent')} />
              <Intro />
              {/* Thanh tiến độ đặt ở đây chứ không riêng (showcase): lenis mount Scrollbar
                  trong default layout nên nó chạy toàn site.
                  Phải nằm TRONG SmoothScroll vì component đọc tiến độ qua useLenis. */}
              <Scrollbar />
              {/* Hai nút nổi + tấm menu chạy TOÀN SITE (kể cả (showcase)/about) nên mount ở đây
                  chứ không ở (main)/layout. socials/photos truyền xuống vì SiteNav là
                  client component, mà entry gốc @portfolio/content chạm filesystem → server-only.
                  Bốn ảnh đầu của gallery đủ cho hai cột ảnh trong menu. */}
              <SiteNav socials={profile.socials} photos={gallery.slice(0, 4)} />
              {children}
              {/* Con trỏ tuỳ biến chạy toàn site. Luật ẩn con trỏ native nằm ở globals.css
                  (ngoài @layer). Tắt hẳn khi prefers-reduced-motion. */}
              <Cursor />
            </SmoothScroll>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
