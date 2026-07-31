'use client'

import { useRef } from 'react'
import { useLenis } from 'lenis/react'
import s from './scrollbar.module.css'

// Port components/scrollbar: thanh hồng fixed trên đỉnh, scaleX theo tiến độ cuộn. Ẩn trên touch.
export function Scrollbar() {
  const bar = useRef<HTMLDivElement>(null)

  useLenis(({ scroll, limit }: { scroll: number; limit: number }) => {
    if (bar.current) bar.current.style.transform = `scaleX(${limit > 0 ? scroll / limit : 0})`
  })

  return (
    <div className={s.scrollbar}>
      <div ref={bar} className={s.inner} />
    </div>
  )
}
