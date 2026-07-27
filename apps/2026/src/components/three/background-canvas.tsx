'use client'

import { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'

// Tấm intro là fixed inset-0 z-index 1000 với nền gold ĐỤC HOÀN TOÀN, nên suốt 4.6s intro
// cảnh WebGL phía sau không hiện lên một pixel nào. Mặc định r3f là frameloop='always' →
// vẫn vẽ 60fps: quả cầu 160×120 segment (~38k tam giác) + shader riêng + trường sao, tranh
// GPU đúng lúc luồng raster đang bận nhất. Chữ intro là <path> trong SVG, mà path con KHÔNG
// được lên compositing layer riêng ở Chrome — mỗi bước animation phải raster lại toàn bộ SVG
// trên CPU. Hai thứ cộng lại là nguồn giật. lenis không dính vì Canvas của họ để
// frameloop="never" (components/webgl/index.js:551) và tự đẩy render bằng RAF riêng.
//
// Theo dõi qua class trên <html> thay vì truyền state: Intro và BackgroundCanvas là hai
// nhánh rời nhau, còn class 'intro-running' thì Intro đã đặt sẵn và tự gỡ (kèm timer dự
// phòng) nên không sợ kẹt frameloop vĩnh viễn.
function useIntroRunning() {
  const [running, setRunning] = useState(false)

  useEffect(() => {
    const el = document.documentElement
    const read = () => setRunning(el.classList.contains('intro-running'))
    read()
    const mo = new MutationObserver(read)
    mo.observe(el, { attributes: true, attributeFilter: ['class'] })
    return () => mo.disconnect()
  }, [])

  return running
}

// Canvas nền dùng chung cho EarthCanvas và StarsCanvas — MỘT nơi giữ camera/gl/dpr
// và hack re-measure. Hai canvas phải cùng cấu hình để starfield trên trang (main)
// trông y hệt trên /about; tách riêng từng file từng làm chúng lệch nhau âm thầm.
export function BackgroundCanvas({ children }: { children: React.ReactNode }) {
  const introRunning = useIntroRunning()

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
        frameloop={introRunning ? 'never' : 'always'}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      >
        {children}
      </Canvas>
    </div>
  )
}
