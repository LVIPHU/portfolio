'use client'

import dynamic from 'next/dynamic'
import { useMediaQuery } from '@portfolio/ui/hooks'
import { useDebug } from './use-debug'

// Canvas + Leva panel không SSR được → dynamic ssr:false.
const EarthCanvas = dynamic(() => import('./earth-canvas'), { ssr: false })
const Leva = dynamic(() => import('leva').then((m) => m.Leva), { ssr: false })

export function EarthBackground() {
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const debug = useDebug()
  if (reduceMotion) return null // reduced-motion: bỏ 3D
  return (
    <>
      <Leva hidden={!debug} collapsed />
      <EarthCanvas debug={debug} />
    </>
  )
}
