import { setRequestLocale } from 'next-intl/server'
import '@/components/showcase/theme.css'

// Layout full-bleed cho trang showcase: KHÔNG dùng chrome portfolio (nav/footer/max-w).
// Theme riêng qua .showcase-root[data-theme], nền qua .showcase-bg (sau canvas Earth).
// Fonts (Anton/Space Grotesk/Roboto) và Cursor đã nạp toàn site ở [locale]/layout.tsx.
// GsapSync đã gỡ: ScrollTrigger không còn consumer nào trong app — giữ file + 30KB + RO
// cho registry rỗng là dead code.
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
    <div id='main' tabIndex={-1} className='showcase-root w-full' data-theme='dark'>
      <div className='showcase-bg' aria-hidden />
      {children}
    </div>
  )
}
