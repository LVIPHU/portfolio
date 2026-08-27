import { setRequestLocale } from 'next-intl/server'
import { SiteFooter } from '@/components/chrome/site-footer'
import { HomeEarth } from '@/components/three/home-earth'
import { StarsBackground } from '@/components/three/stars-background'

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
      <StarsBackground />
      <HomeEarth />
      {/* SiteNav mount ở [locale]/layout.tsx — hai nút nổi chạy trên MỌI route, kể cả (showcase).
          Ở đây chỉ cần chừa chỗ: nút là lớp fixed nên không đẩy nội dung, thiếu padding-top thì
          dòng đầu của trang chui xuống dưới nút. */}
      <main
        id='main'
        tabIndex={-1}
        className='w-full flex-1 pb-10'
        style={
          {
            paddingInline: 'var(--safe)',
            // Đặt qua biến để hero trang chủ huỷ lại ĐÚNG bằng số này (nó phải bắt đầu ngay
            // đỉnh viewport thì chữ FELIX mới chồng khít vị trí chữ trong tấm intro).
            '--main-top': 'calc(var(--header-height) + var(--safe))',
            paddingTop: 'var(--main-top)',
          } as React.CSSProperties
        }
      >
        {children}
      </main>
      <SiteFooter />
    </>
  )
}
