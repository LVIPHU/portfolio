'use client'

import { useRef, type ReactNode } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger, useGSAP)

type RevealProps = {
  children: ReactNode
  className?: string
  /** Trục trượt vào — dọc (y) hoặc ngang (x). */
  direction?: 'vertical' | 'horizontal'
  /** Đảo chiều: dọc→từ trên xuống, ngang→từ trái sang. */
  reverse?: boolean
  /** Quãng đường trượt (px). */
  distance?: number
  /** Trễ (giây). */
  delay?: number
  /** Chỉ chạy một lần khi vào viewport. */
  once?: boolean
}

// C9 (M-01/D-02): thay atoms/animated-content (framer + IntersectionObserver thủ công)
// bằng gsap.from + ScrollTrigger once. useGSAP{scope} tự revert tween + kill trigger
// khi unmount (an toàn StrictMode + đổi route). Giữ nguyên cảm giác direction/reverse.
export function Reveal({
  children,
  className,
  direction = 'vertical',
  reverse = false,
  distance = 50,
  delay = 0,
  once = true,
}: RevealProps) {
  const scope = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const axis = direction === 'horizontal' ? 'x' : 'y'
      const from = reverse ? -distance : distance
      gsap.from(scope.current, {
        [axis]: from,
        opacity: 0,
        duration: 0.6,
        delay,
        ease: 'power2.out',
        scrollTrigger: { trigger: scope.current, start: 'top 90%', once },
      })
    },
    { scope }
  )

  return (
    <div ref={scope} className={className}>
      {children}
    </div>
  )
}
