'use client'

import dynamic from 'next/dynamic'
import { useMediaQuery } from '@portfolio/ui/hooks'
import { useDebug } from './use-debug'

// Canvas + Leva panel không SSR được → dynamic ssr:false.
const EarthCanvas = dynamic(() => import('./earth-canvas'), { ssr: false })
const Leva = dynamic(() => import('leva').then((m) => m.Leva), { ssr: false })

export function EarthBackground({
  variant = 'sections',
  withStars = true,
  // withLeva=false khi trang đã có <Leva> từ nền khác (vd trang chủ: StarsBackground
  // của layout đã render Leva) — tránh 2 panel Leva chồng nhau, leva là store singleton.
  withLeva = true,
}: {
  variant?: 'sections' | 'hero'
  withStars?: boolean
  withLeva?: boolean
}) {
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const debug = useDebug()
  if (reduceMotion) return null // reduced-motion: bỏ 3D
  return (
    <>
      {withLeva && <Leva hidden={!debug} collapsed />}
      <EarthCanvas debug={debug} variant={variant} withStars={withStars} />
    </>
  )
}
