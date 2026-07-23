'use client'

import { type CSSProperties } from 'react'
import { clsx } from 'clsx'
import s from './list-item.module.css'

// Port components/list-item: hàng dự án (title + source + mũi tên), reveal theo `visible` (parent),
// hover fill hồng. Mũi tên = SVG chéo generic.
export function ListItem({
  title,
  source,
  href,
  index = 0,
  visible = false,
}: {
  title: string
  source?: string
  href: string
  index?: number
  visible?: boolean
}) {
  return (
    <a
      href={href}
      target='_blank'
      rel='noreferrer'
      className={clsx(s.item, visible && s.visible)}
      style={{ '--i': index } as CSSProperties}
    >
      <div className={s.inner}>
        <div className={s.title}>
          <span className={s.text}>{title}</span>
          <svg className={s.arrow} viewBox='0 0 24 24' fill='none' aria-hidden>
            <path
              d='M7 17L17 7M17 7H8M17 7V16'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        </div>
        {source && (
          <div className={s.source}>
            <span>{source}</span>
          </div>
        )}
      </div>
    </a>
  )
}
