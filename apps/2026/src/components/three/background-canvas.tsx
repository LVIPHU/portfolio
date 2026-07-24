'use client'

import { useEffect } from 'react'
import { Canvas } from '@react-three/fiber'

// Canvas nền dùng chung cho EarthCanvas và StarsCanvas — MỘT nơi giữ camera/gl/dpr
// và hack re-measure. Hai canvas phải cùng cấu hình để starfield trên trang (main)
// trông y hệt trên /about; tách riêng từng file từng làm chúng lệch nhau âm thầm.
export function BackgroundCanvas({ children }: { children: React.ReactNode }) {
  // r3f đo container fixed=0 lúc mount → ép re-measure sau layout (bẫy đã biết).
  useEffect(() => {
    const id = requestAnimationFrame(() => window.dispatchEvent(new Event('resize')))
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <div className='pointer-events-none fixed inset-0 -z-10'>
      <Canvas
        orthographic
        camera={{ near: 0.01, far: 10000, position: [0, 0, 1000] }}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      >
        {children}
      </Canvas>
    </div>
  )
}
