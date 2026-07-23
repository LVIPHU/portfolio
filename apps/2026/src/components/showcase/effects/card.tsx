'use client'

import { type CSSProperties, type ReactNode } from 'react'
import { clsx } from 'clsx'
import s from './card.module.css'

// Port components/card: thẻ vuông (aspect 1/1), số + text, nền blur.
export function Card({
  number,
  text,
  className,
  inverted = false,
  background,
}: {
  number?: number | string
  text?: ReactNode
  className?: string
  inverted?: boolean
  background?: string
}) {
  return (
    <div
      className={clsx(s.wrapper, inverted && s.inverted, className)}
      style={background ? ({ '--card-background': background } as CSSProperties) : undefined}
    >
      {number != null && <p className={s.number}>{String(number).padStart(2, '0')}</p>}
      {text && <p className={s.text}>{text}</p>}
    </div>
  )
}
