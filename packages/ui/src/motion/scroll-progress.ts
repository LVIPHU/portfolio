'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import type { RefObject } from 'react'

gsap.registerPlugin(useGSAP)

type ScrollProgressOpts = {
  /** Fraction viewport (0–1): top của scope ở đây → progress 0 (mặc định 0.1 ~ 'top 10%'). */
  startViewport?: number
  /** Fraction viewport: bottom của scope ở đây → progress 1 (mặc định 0.5 ~ 'bottom 50%'). */
  endViewport?: number
}

// C9 (M-01/M-02 #4): beam scaleY 0→1 theo tiến trình cuộn qua scope (timeline).
//
// Dùng scroll listener đo getBoundingClientRect LIÊN TỤC mỗi frame (đúng như framer useScroll
// bản gốc) THAY VÌ ScrollTrigger scrub. Lý do (đã đo trên browser): trang hydrate kiểu
// collapse→expand (React 19 / Next 16) — ScrollTrigger tạo lúc document chưa cao (chưa scroll
// được) bị "ngủ", progress không đổi khi cuộn dù start/end đúng, và refresh (rAF/resize/RO)
// không đánh thức ổn định. Đo live mỗi lần cuộn thì miễn nhiễm với mọi layout shift, không
// cần cache bounds hay refresh → beam luôn bám scroll.
export function useScrollProgress(
  scope: RefObject<HTMLElement | null>,
  beam: RefObject<HTMLElement | null>,
  { startViewport = 0.1, endViewport = 0.5 }: ScrollProgressOpts = {}
) {
  useGSAP(
    () => {
      const scopeEl = scope.current
      const beamEl = beam.current
      if (!scopeEl || !beamEl) return

      const setScaleY = gsap.quickSetter(beamEl, 'scaleY') as (v: number) => void
      gsap.set(beamEl, { transformOrigin: 'top', scaleY: 0, opacity: 0 })

      let lastOpaque = false
      const update = () => {
        const rect = scopeEl.getBoundingClientRect()
        const vh = window.innerHeight || document.documentElement.clientHeight
        const startPx = startViewport * vh
        const endPx = endViewport * vh
        // Khoảng cuộn hữu ích: từ (top = startPx) tới (bottom = endPx). total ≤ 0 = section
        // ngắn hơn cửa sổ → chỉ 0/1 theo việc scope đã vượt mốc start chưa (chống chia 0).
        const total = rect.height + startPx - endPx
        const scrolled = startPx - rect.top
        const p = total > 0 ? Math.min(1, Math.max(0, scrolled / total)) : rect.top <= startPx ? 1 : 0
        setScaleY(p)
        const opaque = p > 0
        if (opaque !== lastOpaque) {
          gsap.set(beamEl, { opacity: opaque ? 1 : 0 })
          lastOpaque = opaque
        }
      }

      update()
      window.addEventListener('scroll', update, { passive: true })
      window.addEventListener('resize', update)

      return () => {
        window.removeEventListener('scroll', update)
        window.removeEventListener('resize', update)
      }
    },
    { scope }
  )
}
