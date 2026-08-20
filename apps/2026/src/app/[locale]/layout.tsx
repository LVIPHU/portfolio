import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { routing } from '@portfolio/i18n'
import { ThemeProvider } from '@/components/theme-provider'
import { SmoothScroll } from '@/components/scroll/smooth-scroll'
import { Scrollbar } from '@/components/scroll/scrollbar'
import { Cursor } from '@/components/chrome/cursor'
import { Intro } from '@/components/brand/intro'
import { SiteNav } from '@/components/chrome/site-nav'
import { anton, roboto, spaceGrotesk } from '@/utils/fonts'
import { gallery, profile } from '@portfolio/content'
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
            {/* Intro mount MỘT lần ở đây và chạy lại theo mỗi lần đổi route: nó vừa là màn thương
                hiệu vừa là CỔNG CHỜ TẢI (chỉ mở khi font/ảnh/model 3D của trang đích đã xong).
                Đánh đổi đã biết: SVG wordmark (~18KB path) từ nay đi theo mọi route. */}
            <SmoothScroll>
              <Intro />
              {/* Thanh tiến độ đặt ở đây chứ không riêng (showcase): lenis mount Scrollbar
                  trong default layout (layouts/default/index.js:108) nên nó chạy toàn site.
                  Phải nằm TRONG SmoothScroll vì component đọc tiến độ qua useLenis. */}
              <Scrollbar />
              {/* Hai nút nổi + tấm menu chạy TOÀN SITE (kể cả (showcase)/about) nên mount ở đây
                  chứ không ở (main)/layout. socials/photos truyền xuống vì SiteNav là
                  client component, mà entry gốc @portfolio/content chạm filesystem → server-only.
                  Bốn ảnh đầu của gallery đủ cho hai cột ảnh trong menu. */}
              <SiteNav socials={profile.socials} photos={gallery.slice(0, 4)} />
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
