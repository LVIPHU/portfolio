'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { clsx } from 'clsx'
import s from './cursor.module.css'

// Port components/cursor: vòng hồng follow con trỏ (gsap expo.out), scale 0.5 khi hover link/nút. Ẩn touch.
// Sandpack preview = iframe cross-origin → ẩn vòng + cursor native trong [data-sandpack].
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const [hasMoved, setHasMoved] = useState(false)
  const [pointer, setPointer] = useState(false)
  const [overSandpack, setOverSandpack] = useState(false)

  useEffect(() => {
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
        // Vẫn bám theo con trỏ nhưng nhảy TỨC THÌ (gsap.set, không tween): vòng chỉ bị ẩn bằng
        // opacity chứ không được đồng bộ lại lúc hiện, nên nếu đứng yên trong lúc ẩn thì rời khối
        // sandpack là nó hiện ra ở chỗ cũ rồi trượt ngang 0.6s mới bắt kịp (nặng nhất: chuyển động
        // chuột đầu tiên sau khi tải trang rơi vào sandpack → vòng bay từ góc 0,0).
        gsap.set(dot.current, { x: e.clientX, y: e.clientY })
        setPointer(false)
        return
      }
      gsap.to(dot.current, { x: e.clientX, y: e.clientY, duration: 0.6, ease: 'expo.out', overwrite: 'auto' })
      setPointer(!!target?.closest('button, a, input, label, [data-cursor="pointer"]'))
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
        <div className={clsx(s.cursor, pointer && s.pointer)} />
      </div>
    </div>
  )
}
