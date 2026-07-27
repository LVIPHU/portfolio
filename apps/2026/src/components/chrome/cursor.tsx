'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { clsx } from 'clsx'
import s from './cursor.module.css'

// Port components/cursor: vòng hồng follow con trỏ (gsap expo.out), scale 0.5 khi hover link/nút. Ẩn touch.
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const [hasMoved, setHasMoved] = useState(false)
  const [pointer, setPointer] = useState(false)

  useEffect(() => {
    let moved = false
    const onMove = (e: MouseEvent) => {
      if (!moved) {
        moved = true
        setHasMoved(true)
      }
      gsap.to(dot.current, { x: e.clientX, y: e.clientY, duration: 0.6, ease: 'expo.out', overwrite: 'auto' })
      const target = e.target as HTMLElement | null
      setPointer(!!target?.closest('button, a, input, label, [data-cursor="pointer"]'))
    }
    window.addEventListener('mousemove', onMove)
    document.documentElement.classList.add('has-custom-cursor')
    return () => {
      window.removeEventListener('mousemove', onMove)
      document.documentElement.classList.remove('has-custom-cursor')
    }
  }, [])

  return (
    <div className={s.container} style={{ opacity: hasMoved ? 1 : 0 }}>
      <div ref={dot}>
        <div className={clsx(s.cursor, pointer && s.pointer)} />
      </div>
    </div>
  )
}
