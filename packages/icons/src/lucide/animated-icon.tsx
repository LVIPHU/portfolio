'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  type MouseEvent,
  type ReactNode,
  type SVGProps,
} from 'react'

export type AnimatedIconHandle = {
  startAnimation: () => void
  stopAnimation: () => void
}

export type AnimatedIconProps = Omit<SVGProps<SVGSVGElement>, 'ref'> & {
  size?: number
  children?: ReactNode
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Draw SVG: `pathLength` của motion → `getTotalLength` + strokeDashoffset (không dùng DrawSVGPlugin Club). */
function drawTimeline(svg: SVGSVGElement): gsap.core.Timeline {
  const tl = gsap.timeline({ paused: true })
  const shapes = svg.querySelectorAll<SVGGeometryElement>('path, line, polyline, polygon, circle, ellipse, rect')
  let i = 0
  shapes.forEach((el) => {
    let len = 0
    try {
      len = el.getTotalLength()
    } catch {
      len = 0
    }
    if (len > 0 && Number.isFinite(len)) {
      gsap.set(el, { strokeDasharray: len, strokeDashoffset: 0, transformOrigin: '50% 50%' })
      // immediateRender: false — fromTo mặc định true, paused timeline vẫn
      // vẽ trạng thái "from" (opacity 0.35, dashoffset = length) lúc mount.
      tl.fromTo(
        el,
        { strokeDashoffset: len, opacity: 0.35 },
        { strokeDashoffset: 0, opacity: 1, duration: 0.4, ease: 'power2.inOut', immediateRender: false },
        i * 0.04
      )
    } else {
      tl.fromTo(
        el,
        { scale: 0.85, opacity: 0.5 },
        { scale: 1, opacity: 1, duration: 0.35, ease: 'back.out(1.4)', immediateRender: false },
        i * 0.04
      )
    }
    i += 1
  })
  return tl
}

export const AnimatedIcon = forwardRef<AnimatedIconHandle, AnimatedIconProps>(function AnimatedIcon(
  { size = 24, width, height, className, onMouseEnter, onMouseLeave, children, ...props },
  ref
) {
  const svgRef = useRef<SVGSVGElement>(null)
  const tlRef = useRef<gsap.core.Timeline | null>(null)
  const reducedRef = useRef(false)

  useImperativeHandle(ref, () => ({
    startAnimation: () => {
      if (reducedRef.current || prefersReducedMotion()) return
      tlRef.current?.play()
    },
    stopAnimation: () => {
      if (reducedRef.current || prefersReducedMotion()) return
      tlRef.current?.reverse()
    },
  }))

  useGSAP(
    () => {
      gsap.registerPlugin(useGSAP)
      const svg = svgRef.current
      if (!svg) return

      const attach = () => {
        reducedRef.current = false
        const tl = drawTimeline(svg)
        tlRef.current = tl
        return () => {
          tl.kill()
          if (tlRef.current === tl) tlRef.current = null
        }
      }

      if (typeof window.matchMedia !== 'function') {
        if (prefersReducedMotion()) {
          reducedRef.current = true
          return
        }
        return attach()
      }

      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: reduce)', () => {
        reducedRef.current = true
        tlRef.current = null
      })
      mm.add('(prefers-reduced-motion: no-preference)', attach)

      if (prefersReducedMotion()) {
        reducedRef.current = true
        tlRef.current?.kill()
        tlRef.current = null
      }

      return () => mm.revert()
    },
    { scope: svgRef }
  )

  const handleEnter = useCallback(
    (event: MouseEvent<SVGSVGElement>) => {
      onMouseEnter?.(event)
      if (reducedRef.current || prefersReducedMotion()) return
      tlRef.current?.play()
    },
    [onMouseEnter]
  )

  const handleLeave = useCallback(
    (event: MouseEvent<SVGSVGElement>) => {
      onMouseLeave?.(event)
      if (reducedRef.current || prefersReducedMotion()) return
      tlRef.current?.reverse()
    },
    [onMouseLeave]
  )

  return (
    <svg
      ref={svgRef}
      xmlns='http://www.w3.org/2000/svg'
      width={width ?? size}
      height={height ?? size}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth={2}
      strokeLinecap='round'
      strokeLinejoin='round'
      className={className}
      {...props}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {children}
    </svg>
  )
})
