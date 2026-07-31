'use client'

import { useEffect } from 'react'
import { ReactLenis, useLenis } from 'lenis/react'
import 'lenis/dist/lenis.css'
import { useMediaQuery } from '@portfolio/ui/hooks'
import { usePathname } from '@/i18n/navigation'

// module scope = identity ổn định, ReactLenis không re-init mỗi render (kể cả React Compiler)
const lenisOptions = {
  lerp: 0.1, // nhẹ nhàng, tinh tế
  smoothWheel: true,
  syncTouch: true, // smooth cả trên touch/mobile (1.3.25 đã fix jitter/iOS)
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
      <ScrollReset />
      {children}
    </ReactLenis>
  )
}
