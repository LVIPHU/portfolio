'use client'

import { type CSSProperties } from 'react'
import { clsx } from 'clsx'
import { Link } from '@portfolio/i18n/navigation'
import s from './list-item.module.css'

const EXTERNAL = /^(https?:)?\/\//i

// Port components/list-item: hàng dự án (title + source + mũi tên), reveal theo `visible` (parent),
// hover fill gold. Link nội bộ (case study) không target=_blank; URL tuyệt đối thì noopener.
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
  const external = EXTERNAL.test(href)
  const className = clsx(s.item, visible && s.visible)
  const style = { '--i': index } as CSSProperties
  const body = (
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
  )

  if (external) {
    return (
      <a href={href} target='_blank' rel='noopener noreferrer' className={className} style={style}>
        {body}
      </a>
    )
  }

  return (
    <Link href={href} className={className} style={style}>
      {body}
    </Link>
  )
}
