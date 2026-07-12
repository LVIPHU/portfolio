'use client'

import { useRef, type ReactNode } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

import { cn } from '../lib/utils'

gsap.registerPlugin(useGSAP)

type HoverHighlightProps = {
  /** Các item con — mỗi item cần mang thuộc tính data-hover-item. */
  children: ReactNode
  className?: string
  /** Class cho ô highlight (bo góc, màu nền…). */
  highlightClassName?: string
}

// C9 (M-02 #6): highlight bám item đang hover bằng gsap.to đo getBoundingClientRect,
// thay framer layoutId shared-layout. Một div highlight duy nhất trượt giữa các item.
// contextSafe → tween tự dọn khi unmount (D-02).
export function HoverHighlight({ children, className, highlightClassName }: HoverHighlightProps) {
  const scope = useRef<HTMLDivElement>(null)
  const highlight = useRef<HTMLSpanElement>(null)

  const { contextSafe } = useGSAP({ scope })

  const onMouseOver = contextSafe((e: React.MouseEvent) => {
    const item = (e.target as HTMLElement).closest<HTMLElement>('[data-hover-item]')
    if (!item || !scope.current?.contains(item) || !highlight.current) return
    const box = scope.current.getBoundingClientRect()
    const r = item.getBoundingClientRect()
    gsap.to(highlight.current, {
      x: r.left - box.left,
      y: r.top - box.top,
      width: r.width,
      height: r.height,
      opacity: 1,
      duration: 0.25,
      ease: 'power2.out',
    })
  })

  const onMouseLeave = contextSafe(() => {
    gsap.to(highlight.current, { opacity: 0, duration: 0.25, ease: 'power2.out' })
  })

  return (
    <div ref={scope} className={cn('relative', className)} onMouseOver={onMouseOver} onMouseLeave={onMouseLeave}>
      <span
        ref={highlight}
        aria-hidden
        className={cn('pointer-events-none absolute left-0 top-0 z-0 h-0 w-0 opacity-0', highlightClassName)}
      />
      {children}
    </div>
  )
}
