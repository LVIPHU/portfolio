'use client'

import { useRef, type ReactNode } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const mapRange = (inMin: number, inMax: number, input: number, outMin: number, outMax: number) =>
  ((input - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin

// Port components/parallax: translate Y theo scroll, biên độ = windowWidth * speed * 0.1.
export function Parallax({
  children,
  className,
  speed = 1,
  position,
}: {
  children: ReactNode
  className?: string
  speed?: number
  position?: 'top'
}) {
  const trigger = useRef<HTMLDivElement>(null)
  const target = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const el = target.current
      const wrap = trigger.current
      if (!el || !wrap) return
      const y = window.innerWidth * speed * 0.1
      const setY = gsap.quickSetter(el, 'y', 'px') as (v: number) => void
      const st = ScrollTrigger.create({
        trigger: wrap,
        scrub: true,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (e) => {
          if (position === 'top') setY(e.progress * y)
          else setY(-mapRange(0, 1, e.progress, -y, y))
        },
      })
      return () => st.kill()
    },
    { scope: trigger }
  )

  return (
    <div ref={trigger}>
      <div ref={target} className={className}>
        {children}
      </div>
    </div>
  )
}
