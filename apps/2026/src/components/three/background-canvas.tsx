'use client'

import { useEffect, useState } from 'react'
import { Canvas, useThree } from '@react-three/fiber'

// Tấm intro là fixed inset-0 z-index 1000 với nền gold ĐỤC HOÀN TOÀN, nên suốt 4.6s intro
// cảnh WebGL phía sau không hiện lên một pixel nào. Mặc định r3f là frameloop='always' →
// vẫn vẽ 60fps: quả cầu 160×120 segment (~38k tam giác) + shader riêng + trường sao, tranh
// GPU đúng lúc luồng raster đang bận nhất. Chữ intro là <path> trong SVG, mà path con KHÔNG
// được lên compositing layer riêng ở Chrome — mỗi bước animation phải raster lại toàn bộ SVG
// trên CPU. Hai thứ cộng lại là nguồn giật. lenis không dính vì Canvas của họ để
// frameloop="never" (components/webgl/index.js:551) và tự đẩy render bằng RAF riêng.
//
// Theo dõi qua class trên <html> thay vì truyền state: Intro và BackgroundCanvas là hai
// nhánh rời nhau. Class 'intro-running' được gỡ qua BA đường — transitionEnd, timer dự phòng
// 4600ms, và cleanup unmount của Intro (bắt buộc: hai đường đầu đều chết nếu người dùng nhấn
// Back giữa intro, mà class kẹt thì frameloop ghim 'never' cả session — ultrareview bug_003).
// Ngưng vẽ khi intro đang phủ NHƯNG CHƯA tới pha trượt đi (`intro-out`). Chạy lại đúng lúc tấm
// gold bắt đầu rời màn: canvas có trọn 0.9–1.5s đó để vẽ khung đầu tiên, nên lúc tấm đi hẳn thì
// quả cầu đã hiện — nếu ghim 'never' tới tận cuối thì trang lộ ra với canvas trắng một nhịp.
function useIntroCovering() {
  const [covering, setCovering] = useState(false)

  useEffect(() => {
    const el = document.documentElement
    const read = () => setCovering(el.classList.contains('intro-running') && !el.classList.contains('intro-out'))
    read()
    const mo = new MutationObserver(read)
    mo.observe(el, { attributes: true, attributeFilter: ['class'] })
    return () => mo.disconnect()
  }, [])

  return covering
}

// frameloop never→always của r3f không luôn tự invalidate — Intro xong mà không đá một
// frame thì group Earth đứng nguyên scale 1 / pos 0 (vòng tròn mờ giữa màn) hoặc không vẽ.
function KickFrame({ covering }: { covering: boolean }) {
  const invalidate = useThree((s) => s.invalidate)
  useEffect(() => {
    if (covering) return
    invalidate()
    const id = requestAnimationFrame(() => invalidate())
    return () => cancelAnimationFrame(id)
  }, [covering, invalidate])
  return null
}

// Canvas nền dùng chung cho EarthCanvas và StarsCanvas — MỘT nơi giữ camera/gl/dpr
// và hack re-measure. Hai canvas phải cùng cấu hình để starfield trên trang (main)
// trông y hệt trên /about; tách riêng từng file từng làm chúng lệch nhau âm thầm.
export function BackgroundCanvas({ children }: { children: React.ReactNode }) {
  const introCovering = useIntroCovering()

  // r3f đo container fixed=0 lúc mount → ép re-measure sau layout (bẫy đã biết).
  useEffect(() => {
    const id = requestAnimationFrame(() => window.dispatchEvent(new Event('resize')))
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <div className='pointer-events-none fixed inset-0 -z-10' aria-hidden='true'>
      <Canvas
        orthographic
        camera={{ near: 0.01, far: 10000, position: [0, 0, 1000] }}
        dpr={[1, 2]}
        frameloop={introCovering ? 'never' : 'always'}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        onCreated={({ invalidate }) => invalidate()}
      >
        <KickFrame covering={introCovering} />
        {children}
      </Canvas>
    </div>
  )
}
