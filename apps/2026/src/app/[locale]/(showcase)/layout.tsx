import { Cursor } from '@/components/showcase/cursor'
import { Scrollbar } from '@/components/showcase/scrollbar'
import { Intro } from '@/components/showcase/intro'
import '@/components/showcase/theme.css'

// Layout full-bleed cho trang showcase: KHÔNG dùng chrome portfolio (nav/footer/max-w).
// Theme riêng qua .showcase-root[data-theme], nền qua .showcase-bg (sau canvas Earth).
// Fonts (Anton/Roboto/Panchang) đã nạp toàn site ở [locale]/layout.tsx.
export default function ShowcaseLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='showcase-root w-full' data-theme='dark'>
      <Intro />
      <div className='showcase-bg' aria-hidden />
      <Scrollbar />
      {children}
      <Cursor />
    </div>
  )
}
