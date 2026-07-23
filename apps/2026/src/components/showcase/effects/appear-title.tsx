'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { clsx } from 'clsx'
import s from './appear-title.module.css'

// Reveal khi element cuộn tới (IntersectionObserver), trồi từ mask.
export function AppearTitle({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          io.disconnect()
        }
      },
      { threshold: 0.9 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <span ref={ref} className={clsx(s.title, visible && s.visible, className)}>
      <span className={s.inner}>{children}</span>
    </span>
  )
}
