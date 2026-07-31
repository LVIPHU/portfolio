import { setRequestLocale } from 'next-intl/server'
import { GsapSync } from '@/components/scroll/gsap-sync'
import { Intro } from '@/components/brand/intro'
import '@/components/showcase/theme.css'

// Layout full-bleed cho trang showcase: KHÔNG dùng chrome portfolio (nav/footer/max-w).
// Theme riêng qua .showcase-root[data-theme], nền qua .showcase-bg (sau canvas Earth).
// Fonts (Anton/Roboto/Panchang) và Cursor đã nạp toàn site ở [locale]/layout.tsx.
//
// setRequestLocale: hiện subtree này chưa gọi API server nào của next-intl nên CHƯA phải bug
// sống — nhưng thiếu nó thì ngày ai đó thêm một server component gọi getTranslations() vào đây,
// cả (showcase) rớt khỏi static render và ra 500 trên Vercel, mà local không có tín hiệu gì.
// Tiền lệ nằm trong lịch sử repo: 988da23 fix(2026) setRequestLocale in (main) layout.
export default async function ShowcaseLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className='showcase-root w-full' data-theme='dark'>
      {/* GsapSync mount ở LAYOUT chứ không trong page body: layout lo việc xuyên suốt, page lo
          nội dung. Cố ý chỉ ở route group này — lý do đầy đủ trong scroll/gsap-sync.tsx. */}
      <GsapSync />
      <Intro />
      <div className='showcase-bg' aria-hidden />
      {children}
    </div>
  )
}
