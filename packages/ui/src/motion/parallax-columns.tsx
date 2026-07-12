'use client'

import { useRef, type ReactNode } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger, useGSAP)

type ParallaxColumnsProps = {
  children: ReactNode
  className?: string
  /** Biên độ dịch dọc (px) mỗi cột; cột lẻ/chẵn ngược dấu. */
  amount?: number
}

// C9 (M-01/M-02 #5): parallax N cột — mỗi cột (con mang [data-parallax-col])
// tween y ± xen kẽ, scrub theo container chung. Thay useScroll + useTransform (photos).
export function ParallaxColumns({ children, className, amount = 60 }: ParallaxColumnsProps) {
  const scope = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const cols = gsap.utils.toArray<HTMLElement>('[data-parallax-col]', scope.current)
      cols.forEach((col, i) => {
        gsap.to(col, {
          y: (i % 2 === 0 ? -1 : 1) * amount,
          ease: 'none',
          scrollTrigger: { trigger: scope.current, start: 'top bottom', end: 'bottom top', scrub: true },
        })
      })
    },
    { scope }
  )

  return (
    <div ref={scope} className={className}>
      {children}
    </div>
  )
}
