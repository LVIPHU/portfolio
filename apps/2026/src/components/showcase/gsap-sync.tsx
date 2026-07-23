'use client'

import { useEffect } from 'react'
import { useLenis } from 'lenis/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// Nối smooth-scroll (thư viện lenis) → GSAP ScrollTrigger: mỗi scroll đẩy ScrollTrigger.update.
// Mount 1 lần ở root trang showcase. Refresh sau khi instance sẵn sàng để tính lại vị trí.
export function GsapSync() {
  const lenis = useLenis(() => {
    ScrollTrigger.update()
  })

  useEffect(() => {
    if (!lenis) return
    ScrollTrigger.refresh()
  }, [lenis])

  // Layout đổi chiều cao SAU khi trigger đã tính vị trí (HorizontalSlides set height rail,
  // fonts load...) → mọi trigger phía dưới lệch hàng nghìn px. ResizeObserver trên body
  // + debounce refresh để toạ độ luôn đúng.
  useEffect(() => {
    let timer: number
    const ro = new ResizeObserver(() => {
      window.clearTimeout(timer)
      timer = window.setTimeout(() => ScrollTrigger.refresh(), 150)
    })
    ro.observe(document.body)
    return () => {
      ro.disconnect()
      window.clearTimeout(timer)
    }
  }, [])

  return null
}
