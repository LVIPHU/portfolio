'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { RefObject } from 'react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

type ScrollProgressOpts = {
  /** ScrollTrigger start (mặc định 'top 10%'). */
  start?: string
  /** ScrollTrigger end (mặc định 'bottom 50%'). */
  end?: string
}

// C9 (M-01/M-02 #4): vẽ một dải theo tiến trình cuộn — beam scaleY 0→1 (origin top),
// scrub theo container. Thay useScroll + useTransform + useSpring của framer (timeline beam).
export function useScrollProgress(
  scope: RefObject<HTMLElement | null>,
  beam: RefObject<HTMLElement | null>,
  { start = 'top 10%', end = 'bottom 50%' }: ScrollProgressOpts = {}
) {
  useGSAP(
    () => {
      if (!beam.current) return
      gsap.fromTo(
        beam.current,
        { scaleY: 0, opacity: 0 },
        {
          scaleY: 1,
          opacity: 1,
          ease: 'none',
          transformOrigin: 'top',
          scrollTrigger: { trigger: scope.current, start, end, scrub: true },
        }
      )
    },
    { scope }
  )
}
