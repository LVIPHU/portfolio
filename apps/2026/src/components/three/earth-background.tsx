'use client'

import dynamic from 'next/dynamic'
import { useEffect } from 'react'
import { useMediaQuery } from '@portfolio/hooks'
import { useDebug } from './use-debug'
import { registerScene, unregisterScene, SCENE_EARTH } from './scene-ready'

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

  // Đăng ký "trang này có cảnh 3D phải chờ" cho cổng Intro. Đặt Ở ĐÂY chứ không trong EarthCanvas:
  // canvas nạp qua next/dynamic nên mount trễ (ở dev còn phải compile chunk) — trễ quá cửa sổ ân
  // hạn 600ms của page-ready là Intro mở ra trước khi model kịp tải. EarthBackground thì mount
  // ngay cùng nhịp với trang.
  //
  // Đăng ký theo ID (idempotent) nên StrictMode gọi hai lần cũng vô hại, và không cần setState
  // trong effect — react-hooks cảnh báo đúng chỗ đó.
  useEffect(() => {
    if (reduceMotion) return
    registerScene(SCENE_EARTH)
    return () => unregisterScene(SCENE_EARTH)
  }, [reduceMotion])

  if (reduceMotion) return null // reduced-motion: bỏ 3D
  return (
    <>
      {withLeva && <Leva hidden={!debug} collapsed />}
      <EarthCanvas debug={debug} variant={variant} withStars={withStars} />
    </>
  )
}
