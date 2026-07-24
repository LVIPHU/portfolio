'use client'

import { Suspense, useEffect, useRef, type MutableRefObject } from 'react'
import { useFrame, useThree, addEffect, addAfterEffect } from '@react-three/fiber'
import { BackgroundCanvas } from './background-canvas'
import { useControls } from 'leva'
import Stats from 'stats.js'
import type { Group, Mesh, MeshPhysicalMaterial } from 'three'
import { EarthModel } from './earth-model'
import { Stars } from './stars'

// Keyframe pose của Earth cho từng threshold (data-earth-step). position = tỉ lệ viewport
// (0 = giữa; y DƯƠNG = LÊN TRÊN), scale = hệ số, rotationY = số vòng quay (× 2π),
// opacity = độ hiện (mặc định 1).
type Step = { position: [number, number]; scale: number; rotationY: number; opacity?: number }
const STEPS: Step[] = [
  { position: [0.38, -0.35], scale: 2.4, rotationY: 0 }, // 0 hero — 1/3 cầu góc phải-dưới
  { position: [-0.5, 0.15], scale: 3.0, rotationY: 0.5 }, // 1 about — nửa cầu lớn bên trái
  { position: [0.0, 0.0], scale: 0.9, rotationY: 1.0 }, // 2 skills — nhỏ giữa (nghỉ nhịp)
  { position: [0.0, 0.25], scale: 0.5, rotationY: 1.6, opacity: 0 }, // 3 zoom-start — MỜ DẦN suốt đoạn scroll ngang, mất hẳn đúng lúc rail kết thúc
  { position: [0.55, 0.0], scale: 0.15, rotationY: 2.0, opacity: 0 }, // 4 marker cuối zoom — vô hình, đã đậu sẵn TẠI vị trí featuring
  { position: [0.55, 0.0], scale: 2.6, rotationY: 2.2 }, // 5 featuring — BLOOM: nở từ tâm + hiện dần đúng lúc wipe xong (xuất hiện kiểu mới)
  { position: [-0.55, -0.1], scale: 2.2, rotationY: 2.8 }, // 6 projects — cung trái
  { position: [0.0, -0.65], scale: 3.2, rotationY: 3.4 }, // 7 footer — cung nhô từ đáy
]

const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const TAU = Math.PI * 2

type Pose = { i: number; p: number }

// LƯU Ý (bẫy đã biết): GSAP ScrollTrigger dưới React 19/Next 16 hay "ngủ" — start/end
// đúng nhưng onUpdate không bắn. Vì vậy keyframe Earth dùng scroll listener thuần +
// getBoundingClientRect đo LIVE (giống HorizontalSlides/ZoomSection — đã kiểm chứng chạy).
// enabled=false (variant hero): pose cố định STEPS[0], KHÔNG gắn listener — trang chủ
// không có [data-earth-step] nên querySelectorAll mỗi lần cuộn chỉ tổ phí.
function useSectionPose(enabled: boolean): MutableRefObject<Pose> {
  const pose = useRef<Pose>({ i: 0, p: 0 })

  useEffect(() => {
    if (!enabled) return
    const update = () => {
      const sections = ([...document.querySelectorAll('[data-earth-step]')] as HTMLElement[]).sort(
        (a, b) => Number(a.dataset.earthStep) - Number(b.dataset.earthStep)
      )
      if (!sections.length) return
      const y = window.scrollY
      const tops = sections.map((s) => s.getBoundingClientRect().top + y)
      const docEnd = document.documentElement.scrollHeight - window.innerHeight

      // pair i: tops[i] → tops[i+1] (threshold = mép trên section chạm mép trên viewport)
      let i = tops.findIndex((t) => y < t) - 1
      if (i === -2) i = tops.length - 1 // qua threshold cuối
      if (i < 0) i = 0
      const start = tops[i]
      const end = i + 1 < tops.length ? tops[i + 1] : Math.max(docEnd, start + 1)
      const p = Math.min(1, Math.max(0, (y - start) / (end - start)))
      pose.current = { i, p }
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return pose
}

function StatsPanel() {
  useEffect(() => {
    const stats = new Stats()
    stats.showPanel(0)
    Object.assign(stats.dom.style, { left: 'auto', right: '0px', top: '0px', zIndex: '10000' })
    document.body.appendChild(stats.dom)
    const begin = addEffect(() => stats.begin())
    const end = addAfterEffect(() => stats.end())
    return () => {
      begin()
      end()
      stats.dom.remove()
    }
  }, [])
  return null
}

// 'sections' (mặc định): pose theo [data-earth-step] như /about.
// 'hero': pose cố định STEPS[0] (1/3 cầu góc phải-dưới) + mờ dần khi cuộn hết màn đầu.
export type EarthVariant = 'sections' | 'hero'

// Hệ số mờ cho variant hero — đọc scroll bằng listener thuần (pattern chống-"ngủ"
// dùng khắp file này), quả cầu tắt hẳn khi cuộn qua ~90% chiều cao màn hình.
function useHeroFade(enabled: boolean): MutableRefObject<number> {
  const fade = useRef(1)
  useEffect(() => {
    if (!enabled) return
    const update = () => {
      fade.current = Math.min(1, Math.max(0, 1 - window.scrollY / (window.innerHeight * 0.9)))
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [enabled])
  return fade
}

function Earth({ pose, fade }: { pose: MutableRefObject<Pose>; fade: MutableRefObject<number> }) {
  const group = useRef<Group>(null)
  const spin = useRef(0)
  const { viewport } = useThree()

  const { baseScale, autoRotate, rotateSpeed, ambient, keyIntensity, fillIntensity, lightColor } = useControls(
    'earth',
    {
      baseScale: { value: 1, min: 0.2, max: 6, step: 0.05 },
      autoRotate: true,
      rotateSpeed: { value: 0.1, min: 0, max: 1, step: 0.01 },
      // đèn TRẮNG ẤM chỉ để tạo khối — màu amber do lục địa/rim tự phát sáng lo;
      // đèn amber đậm + ambient cao là nguyên nhân quả cầu từng bị "cam đặc"
      ambient: { value: 0.35, min: 0, max: 3, step: 0.05 },
      keyIntensity: { value: 1.1, min: 0, max: 5, step: 0.1 },
      fillIntensity: { value: 0.35, min: 0, max: 3, step: 0.05 },
      lightColor: '#FFF3E2',
    }
  )

  // Áp keyframe MỖI FRAME từ pose ref (không phụ thuộc callback nào khác) → không thể "ngủ".
  useFrame((_, delta) => {
    const g = group.current
    if (!g) return
    const { i, p } = pose.current
    const from = STEPS[i] ?? STEPS[STEPS.length - 1]
    const to = STEPS[i + 1] ?? from
    g.scale.setScalar(baseScale * lerp(from.scale, to.scale, p))
    g.position.set(
      viewport.width * lerp(from.position[0], to.position[0], p),
      viewport.height * lerp(from.position[1], to.position[1], p),
      0
    )
    if (autoRotate) spin.current += delta * rotateSpeed
    g.rotation.y = lerp(from.rotationY, to.rotationY, p) * TAU + spin.current

    // fade theo keyframe × hệ số hero-fade (variant sections luôn = 1); nhân với
    // opacity gốc của material (userData.baseOpacity do EarthModel stamp)
    const k = lerp(from.opacity ?? 1, to.opacity ?? 1, p) * fade.current
    g.visible = k > 0.001
    if (g.visible) {
      g.traverse((obj) => {
        const mat = (obj as Mesh).material as MeshPhysicalMaterial | undefined
        if (mat && typeof mat.opacity === 'number') {
          mat.opacity = ((mat.userData.baseOpacity as number) ?? 1) * k
        }
      })
    }
  })

  return (
    <>
      <ambientLight intensity={ambient} color={lightColor} />
      <directionalLight position={[300, 200, 400]} intensity={keyIntensity} color={lightColor} />
      <directionalLight position={[-300, -100, 200]} intensity={fillIntensity} color={lightColor} />
      <group ref={group}>
        <EarthModel />
      </group>
    </>
  )
}

export default function EarthCanvas({
  debug = false,
  variant = 'sections',
  withStars = true,
}: {
  debug?: boolean
  variant?: EarthVariant
  withStars?: boolean
}) {
  // 'hero': pose cố định STEPS[0] (không gắn listener); 'sections': theo [data-earth-step]
  const pose = useSectionPose(variant === 'sections')
  const fade = useHeroFade(variant === 'hero')

  return (
    <BackgroundCanvas>
      {/* withStars=false khi trang đã có canvas sao riêng (tránh 2 lớp sao chồng nhau) */}
      {withStars && <Stars />}
      <Suspense fallback={null}>
        <Earth pose={pose} fade={fade} />
      </Suspense>
      {debug && <StatsPanel />}
    </BackgroundCanvas>
  )
}
