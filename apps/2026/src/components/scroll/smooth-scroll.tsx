'use client'

import { useEffect } from 'react'
import { ReactLenis, useLenis } from 'lenis/react'
import 'lenis/dist/lenis.css'
import { useMediaQuery } from '@portfolio/hooks'
import { usePathname } from '@portfolio/i18n/navigation'

// module scope = identity ổn định, ReactLenis không re-init mỗi render (kể cả React Compiler)
const lenisOptions = {
  lerp: 0.1, // nhẹ nhàng, tinh tế
  smoothWheel: true,
  syncTouch: true, // smooth cả trên touch/mobile (1.3.25 đã fix jitter/iOS)
}

// Đo bề ngang thanh cuộn gốc và ghi vào --scrollbar-w.
//
// VÌ SAO CẦN: lenis.stop() gắn class `lenis-stopped` với `overflow: clip` (lenis.css) → thanh cuộn
// biến mất → khung nội dung rộng thêm đúng bấy nhiêu px → CẢ TRANG nhích ngang mỗi lần mở/đóng
// menu hay mỗi lượt intro. `scrollbar-gutter: stable` KHÔNG cứu được: đã đo tận nơi, Chrome bỏ
// qua gutter của viewport khi overflow là clip/hidden (clientWidth vẫn nhảy 1914 → 1920).
// Cách còn lại là bù đúng số đó bằng padding-right lúc bị khoá — luật nằm ở native-scrollbar.css.
function ScrollbarWidthVar() {
  useEffect(() => {
    const measure = () => {
      // Đo lúc KHÔNG bị khoá mới ra số thật; đang khoá thì giữ nguyên giá trị cũ.
      if (document.documentElement.classList.contains('lenis-stopped')) return
      const w = window.innerWidth - document.documentElement.clientWidth
      document.documentElement.style.setProperty('--scrollbar-w', `${Math.max(0, w)}px`)
    }
    measure()
    // Zoom / đổi kích thước cửa sổ đều đổi bề ngang thanh cuộn (và thiết bị overlay-scrollbar cho 0).
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])
  return null
}

// Luôn về đầu trang khi đổi route (giống repo: scrollRestoration 'manual', không khôi phục Back/Forward)
function ScrollReset() {
  const pathname = usePathname()
  const lenis = useLenis()

  useEffect(() => {
    window.history.scrollRestoration = 'manual'
  }, [])

  useEffect(() => {
    lenis?.scrollTo(0, { immediate: true })
  }, [pathname, lenis])

  return null
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  if (reduceMotion) return <>{children}</> // tắt hẳn Lenis khi user yêu cầu giảm chuyển động
  return (
    <ReactLenis root options={lenisOptions}>
      <ScrollbarWidthVar />
      <ScrollReset />
      {children}
    </ReactLenis>
  )
}
