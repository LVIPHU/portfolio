'use client'

import { useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Stars } from './stars'

// Canvas nền chỉ chứa starfield (không Earth) — camera orthographic y hệt
// EarthCanvas để tham số Stars (size/scale/parallax) cho kết quả giống /about.
export default function StarsCanvas() {
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
        <Stars />
      </Canvas>
    </div>
  )
}
