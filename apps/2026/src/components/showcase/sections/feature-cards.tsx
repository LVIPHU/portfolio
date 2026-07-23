'use client'

import { useRef, useState, type CSSProperties } from 'react'
import { useLenis } from 'lenis/react'
import { clsx } from 'clsx'
import { Card } from '../effects/card'
import s from './feature-cards.module.css'

// Port components/feature-cards: section cao 1600vh, sticky 100vh, các card fan-in chéo theo scroll.
export function FeatureCards({ items }: { items: string[] }) {
  const section = useRef<HTMLDivElement>(null)
  const [current, setCurrent] = useState(0)

  useLenis(({ scroll }: { scroll: number }) => {
    const el = section.current
    if (!el) return
    const top = el.getBoundingClientRect().top + scroll
    const windowHeight = window.innerHeight
    const start = top - windowHeight * 2
    const end = top + el.offsetHeight - windowHeight
    const progress = Math.min(1, Math.max(0, (scroll - start) / (end - start)))
    setCurrent(Math.floor(progress * (items.length + 1)))
  })

  return (
    <div ref={section} className={s.features}>
      <div className={s.sticky}>
        {items.map((item, i) => (
          <div key={item} className={clsx(s.card, i <= current - 1 && s.current)} style={{ '--i': i } as CSSProperties}>
            <Card number={i + 1} text={item} background='rgba(239, 239, 239, 0.85)' />
          </div>
        ))}
      </div>
    </div>
  )
}
