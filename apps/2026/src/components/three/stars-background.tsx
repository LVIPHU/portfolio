'use client'

import dynamic from 'next/dynamic'
import { useMediaQuery } from '@portfolio/ui/hooks'
import { useDebug } from './use-debug'

// Canvas + Leva không SSR được → dynamic ssr:false (cùng pattern earth-background).
// Leva phải mount (hidden) vì Stars dùng useControls — thiếu nó leva tự bung panel.
const StarsCanvas = dynamic(() => import('./stars-canvas'), { ssr: false })
const Leva = dynamic(() => import('leva').then((m) => m.Leva), { ssr: false })

// Nền sao cho các trang (main) — KHÔNG dùng ở (showcase): /about đã có sao
// trong EarthCanvas, mount thêm sẽ thành 2 canvas chồng nhau.
export function StarsBackground() {
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const debug = useDebug()
  if (reduceMotion) return null // reduced-motion: bỏ hiệu ứng
  return (
    <>
      <Leva hidden={!debug} collapsed />
      <StarsCanvas />
    </>
  )
}
