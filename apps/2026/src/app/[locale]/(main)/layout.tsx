import { setRequestLocale } from 'next-intl/server'
import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { profile } from '@portfolio/content'

// Chrome portfolio (nav + khung + footer) cho tất cả trang thường.
// Trang /about nằm ở route group (showcase) nên KHÔNG dùng layout này.
//
// BẮT BUỘC setRequestLocale: SiteFooter là server component gọi getTranslations().
// Thiếu nó, next-intl phải đọc headers() để biết locale → toàn bộ subtree (main)
// rớt khỏi static render → page đọc MDX bằng fs lúc runtime, mà lambda không có
// packages/content → 500 trên production.
export default async function MainLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <>
      <SiteNav name={profile.name} />
      <main className='w-full flex-1 py-10' style={{ paddingInline: 'var(--safe)' }}>
        {children}
      </main>
      <SiteFooter />
    </>
  )
}
