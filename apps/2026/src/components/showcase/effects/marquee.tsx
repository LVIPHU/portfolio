'use client'

import { type CSSProperties, type ReactNode } from 'react'
import { clsx } from 'clsx'
import s from './marquee.module.css'

// Port components/marquee: dải chạy ngang vô tận bằng CSS keyframes (không phụ thuộc scroll).
export function Marquee({
  children,
  className,
  repeat = 2,
  duration = 5,
  offset = 0,
  inverted = false,
}: {
  children: ReactNode
  className?: string
  repeat?: number
  duration?: number
  offset?: number
  inverted?: boolean
}) {
  return (
    <div
      className={clsx(s.marquee, inverted && s.inverted, className)}
      style={{ '--duration': `${duration}s`, '--offset': `${offset % 100}%` } as CSSProperties}
    >
      {Array.from({ length: repeat }).map((_, i) => (
        <div key={i} className={s.inner}>
          {children}
        </div>
      ))}
    </div>
  )
}
