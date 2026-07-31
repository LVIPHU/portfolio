'use client'

import { useEffect } from 'react'
import { useLenis } from 'lenis/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// Nối smooth-scroll (thư viện lenis) → GSAP ScrollTrigger: mỗi scroll đẩy ScrollTrigger.update.
// Refresh sau khi instance sẵn sàng để tính lại vị trí.
//
// MOUNT THEO ROUTE GROUP, CÓ CHỦ ĐÍCH — chỉ ở (showcase)/layout.tsx, KHÔNG ở layout gốc.
// Lý do: grep toàn apps/2026/src cho thấy ScrollTrigger hiện KHÔNG có consumer nào (component
// duy nhất từng dùng là effects/parallax.tsx, đã xoá vì không ai import). Đưa lên layout gốc là
// ship ~30KB ScrollTrigger + một ResizeObserver + refresh có debounce tới MỌI route, để đồng bộ
// một registry rỗng. Mọi thứ cuộn được trong app này đều đi qua useLenis trực tiếp hoặc listener
// scroll thuần (xem ghi chú ở three/earth-canvas.tsx về việc ScrollTrigger hay "ngủ" dưới
// React 19/Next 16).
//
// BẪY CHO NGƯỜI SAU: nếu bạn thêm một component dùng ScrollTrigger vào trang (main), nó sẽ KHÔNG
// được đồng bộ — trigger bắn theo vị trí cuộn thô trong khi Lenis đang cuộn mượt, nên pin/scrub
// lệch thấy rõ. Lúc đó phải mount GsapSync ở route đó (hoặc nâng lên layout gốc và chấp nhận cái
// giá bundle ở trên).
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
