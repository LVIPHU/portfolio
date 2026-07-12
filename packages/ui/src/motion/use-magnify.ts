'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP)

type MagnifyOptions = {
  /** Bán kính ảnh hưởng quanh con trỏ (px). */
  radius?: number
  /** Kích thước icon lúc nghỉ / lúc phóng to (px). */
  minSize?: number
  maxSize?: number
  /** Kích thước phần icon con lúc nghỉ / phóng to (px). */
  minIcon?: number
  maxIcon?: number
}

type Entry = {
  el: HTMLElement
  centerX: number
  wTo: (v: number) => void
  hTo: (v: number) => void
  iwTo?: (v: number) => void
  ihTo?: (v: number) => void
}

// C9 (M-02 #8, D-05/D-07): dock magnify — mỗi icon một cặp quickTo width/height
// (tạo 1 lần trong useGSAP), pointermove chỉ GỌI. Khoảng cách tính theo TÂM NGHỈ
// của icon (đo 1 lần như boundsRef của framer) → không feedback khi icon phình.
// Số đo lấy đúng bản framer cũ: radius 150, size 40↔80, icon 20↔40.
export function useMagnify({
  radius = 150,
  minSize = 40,
  maxSize = 80,
  minIcon = 20,
  maxIcon = 40,
}: MagnifyOptions = {}) {
  const dockRef = useRef<HTMLDivElement>(null)
  const entries = useRef<Entry[]>([])

  useGSAP(
    () => {
      const q = { duration: 0.2, ease: 'power2.out' }
      entries.current = gsap.utils.toArray<HTMLElement>('[data-magnify-item]', dockRef.current).map((el) => {
        const rect = el.getBoundingClientRect()
        const icon = el.querySelector<HTMLElement>('[data-magnify-icon]')
        return {
          el,
          centerX: rect.left + rect.width / 2,
          wTo: gsap.quickTo(el, 'width', q),
          hTo: gsap.quickTo(el, 'height', q),
          iwTo: icon ? gsap.quickTo(icon, 'width', q) : undefined,
          ihTo: icon ? gsap.quickTo(icon, 'height', q) : undefined,
        }
      })
    },
    { scope: dockRef }
  )

  // Đo lại tâm nghỉ khi trỏ vào dock — chắc chắn dock đã hiện + layout ổn (dock
  // ẩn dưới md lúc mount cho rect = 0; robust hơn boundsRef-1-lần của framer).
  const onMouseEnter = () => {
    for (const entry of entries.current) {
      const rect = entry.el.getBoundingClientRect()
      entry.centerX = rect.left + rect.width / 2
    }
  }

  const sizeFor = (distance: number) => {
    const t = Math.min(Math.abs(distance), radius) / radius // 0 ở tâm → 1 ở rìa
    return { size: maxSize - t * (maxSize - minSize), icon: maxIcon - t * (maxIcon - minIcon) }
  }

  const onMouseMove = (e: React.MouseEvent) => {
    for (const entry of entries.current) {
      const { size, icon } = sizeFor(e.clientX - entry.centerX)
      entry.wTo(size)
      entry.hTo(size)
      entry.iwTo?.(icon)
      entry.ihTo?.(icon)
    }
  }

  const onMouseLeave = () => {
    for (const entry of entries.current) {
      entry.wTo(minSize)
      entry.hTo(minSize)
      entry.iwTo?.(minIcon)
      entry.ihTo?.(minIcon)
    }
  }

  return { dockRef, onMouseEnter, onMouseMove, onMouseLeave }
}
