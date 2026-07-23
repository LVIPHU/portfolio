'use client'

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { useLenis } from 'lenis/react'
import { gsap } from 'gsap'
import { clsx } from 'clsx'
import s from './horizontal-slides.module.css'

// Port components/horizontal-slides: cuộn dọc → row trượt ngang. Wrapper cao = chiều rộng track
// (nên quãng scroll dọc = quãng trượt ngang). useScroll(Zustand) → useLenis.
export function HorizontalSlides({ children }: { children: ReactNode }) {
  const wrapper = useRef<HTMLDivElement>(null)
  const row = useRef<HTMLDivElement>(null)
  const [trackWidth, setTrackWidth] = useState(0)
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const measure = () => {
      setIsDesktop(window.innerWidth >= 800)
      if (row.current) setTrackWidth(row.current.scrollWidth)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [children])

  useLenis(({ scroll }: { scroll: number }) => {
    const w = wrapper.current
    const r = row.current
    // đọc trực tiếp thay vì state isDesktop — callback subscribe 1 lần, state cũ sẽ làm rail đứng im
    if (!w || !r || window.innerWidth < 800) return
    const wrapperTop = w.getBoundingClientRect().top + scroll
    const windowHeight = window.innerHeight
    const start = wrapperTop - windowHeight
    const end = wrapperTop + w.offsetHeight - windowHeight
    const progress = Math.min(1, Math.max(0, (scroll - start) / (end - start)))
    const windowWidth = Math.min(window.innerWidth, document.documentElement.offsetWidth)
    const x = progress * (r.scrollWidth - windowWidth)
    gsap.to([...r.children], { x: -x, stagger: 0.033, ease: 'none', duration: 0, overwrite: 'auto' })
  })

  return (
    <div ref={wrapper} style={isDesktop && trackWidth ? ({ height: `${trackWidth}px` } as CSSProperties) : undefined}>
      <div className={s.inner}>
        <div ref={row} className={clsx(s.overflow, 'desktop-only')}>
          {children}
        </div>
        <div className={clsx(s.cards, 'mobile-only')}>{children}</div>
      </div>
    </div>
  )
}
