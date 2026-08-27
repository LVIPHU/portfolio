'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { clsx } from 'clsx'
import s from './cursor.module.css'

// Vòng follow con trỏ bằng gsap.quickTo (rAF), không setState mỗi mousemove.
// Tắt listener + class khi prefers-reduced-motion — cursor native giữ nguyên.
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const pointer = useRef(false)
  const [hasMoved, setHasMoved] = useState(false)
  const [overSandpack, setOverSandpack] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const el = dot.current
    if (!el) return

    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'expo.out' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'expo.out' })
    let moved = false

    const onMove = (e: MouseEvent) => {
      if (!moved) {
        moved = true
        setHasMoved(true)
      }
      const target = e.target as HTMLElement | null
      const inSandpack = !!target?.closest('[data-sandpack]')
      setOverSandpack(inSandpack)
      if (inSandpack) {
        gsap.set(el, { x: e.clientX, y: e.clientY })
        pointer.current = false
        const pointerClass = s.pointer
        if (pointerClass) el.querySelector(`.${s.cursor}`)?.classList.remove(pointerClass)
        return
      }
      xTo(e.clientX)
      yTo(e.clientY)
      const next = !!target?.closest('button, a, input, label, [data-cursor="pointer"]')
      if (next !== pointer.current) {
        pointer.current = next
        const pointerClass = s.pointer
        if (pointerClass) el.querySelector(`.${s.cursor}`)?.classList.toggle(pointerClass, next)
      }
    }

    window.addEventListener('mousemove', onMove)
    document.documentElement.classList.add('has-custom-cursor')
    return () => {
      window.removeEventListener('mousemove', onMove)
      document.documentElement.classList.remove('has-custom-cursor')
    }
  }, [])

  const visible = hasMoved && !overSandpack

  return (
    <div className={s.container} style={{ opacity: visible ? 1 : 0 }}>
      <div ref={dot}>
        <div className={clsx(s.cursor)} />
      </div>
    </div>
  )
}
