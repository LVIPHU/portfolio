'use client'

import { Suspense, useEffect, useRef, type MutableRefObject } from 'react'
import { useFrame, useThree, addEffect, addAfterEffect } from '@react-three/fiber'
import { BackgroundCanvas } from './background-canvas'
import { useControls } from 'leva'
import Stats from 'stats.js'
import type { Group, Mesh, MeshPhysicalMaterial } from 'three'
import { EarthModel } from './earth-model'
import { Stars } from './stars'
import { markSceneReady, SCENE_EARTH } from './scene-ready'

// Keyframe pose của Earth cho từng threshold (data-earth-step). position = tỉ lệ viewport
// (0 = giữa; y DƯƠNG = LÊN TRÊN), scale = hệ số, rotationY = số vòng quay (× 2π),
// opacity = độ hiện (mặc định 1).
type Step = { position: [number, number]; scale: number; rotationY: number; opacity?: number }
const STEPS: Step[] = [
  // 0 hero — ĐÚNG NỬA cầu nhô lên từ đáy. Camera orthographic zoom 1 nên scale = BÁN KÍNH
  // px thật (sphereGeometry r=100): 3.0 → bán kính 300px. Tâm nằm ở (0.5+x)*W theo chiều
  // ngang và (0.5+|y|)*H tính từ đỉnh màn.
  //   y = -0.50 là con số ĐẶC BIỆT: tâm rơi đúng vào mép dưới viewport nên phần lọt vào màn
  //     luôn là chính xác một nửa cầu, ở MỌI chiều cao màn — không phải canh lại theo từng
  //     viewport như các mốc -0.72 / -0.66 trước đó.
  //   x = -0.13 → trục của dòng mô tả (trung điểm giữa "CUỘN / KHÁM PHÁ" và nút "Thuê mình" đo
  //     được là -0.081 ở viewport 1274px) rồi dịch thêm sang trái một nhịp nữa cho thoáng nút.
  //     Dòng mô tả nằm đè vành cầu — chấp nhận được vì .heroDesc đã có quầng tối riêng để đọc
  //     trên gold.
  { position: [-0.13, -0.5], scale: 3.0, rotationY: 0 },
  { position: [-0.5, 0.15], scale: 3.0, rotationY: 0.5 }, // 1 about — nửa cầu lớn bên trái
  { position: [0.0, 0.0], scale: 0.9, rotationY: 1.0 }, // 2 skills — nhỏ giữa (nghỉ nhịp)
  { position: [0.0, 0.25], scale: 0.5, rotationY: 1.6, opacity: 0 }, // 3 zoom-start — MỜ DẦN suốt đoạn scroll ngang, mất hẳn đúng lúc rail kết thúc
  { position: [0.55, 0.0], scale: 0.15, rotationY: 2.0, opacity: 0 }, // 4 marker cuối zoom — vô hình, đã đậu sẵn TẠI vị trí featuring
  { position: [0.55, 0.0], scale: 2.6, rotationY: 2.2 }, // 5 featuring — BLOOM: nở từ tâm + hiện dần đúng lúc wipe xong (xuất hiện kiểu mới)
  { position: [-0.55, -0.1], scale: 2.2, rotationY: 2.8 }, // 6 projects — cung trái
  { position: [0.0, -0.65], scale: 3.2, rotationY: 3.4 }, // 7 footer — cung nhô từ đáy
]

// Pose RIÊNG của hero trang chủ: nửa cầu nhô từ đáy nhưng lệch sang PHẢI (x dương), vì khối
// chữ + hai nút của trang chủ dồn hết sang nửa trái. /about dùng STEPS[0] (giữa màn) — bố cục
// bên đó khác hẳn, đừng đồng bộ hai giá trị này.
//   y = -0.45: tâm hơi dưới mép nên phần lọt vào màn nhỉnh hơn nửa cầu một chút.
//   x = 0.21: vành PHẢI của cầu dừng cách nút mở menu đúng một --gap — bằng khe giữa hai nút CTA.
//     Cách tính (không đoán bằng mắt: nửa tối của cầu chìm vào nền đen nên nhìn ra nhỏ hơn thật):
//     bán kính cầu trên màn ≈ 0.39 × CHIỀU CAO viewport tính bằng px — hằng số này suy từ camera
//     (perspective, z=1000) nên chỉ phụ thuộc chiều cao, không phụ thuộc bề ngang.
//       1274×720: bán kính ≈ 279, nút mở menu bắt đầu ở x=1201, khe hai nút CTA 21px
//         → tâm cần ở 901px = 0.707 bề ngang → x = 0.207.
//       1920×1030: bán kính ≈ 400, nút bắt đầu ~1806, khe 32px → x ≈ 0.216.
//     Vì bán kính theo chiều cao còn nút bám mép phải, khe này giãn/co theo tỉ lệ màn — 0.21 là số
//     canh cho dải 16:9 thường gặp.
const HERO_POSE: Step[] = [{ position: [0.21, -0.45], scale: 3.0, rotationY: 0 }]

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

    // TÁCH đo DOM khỏi tính toán. Bản trước gọi querySelectorAll + getBoundingClientRect cho
    // MỌI sự kiện scroll — đo được bằng cách hook Element.prototype: 10 lần buộc layout đồng bộ
    // mỗi sự kiện. Lenis bắn scroll theo nhịp frame nên chi phí đó nằm thẳng trên đường tới hạn
    // và làm cuộn nặng tay. Mốc section chỉ đổi khi LAYOUT đổi, không đổi khi cuộn — nên cache.
    let tops: number[] = []
    let docEnd = 0

    const measure = () => {
      const sections = ([...document.querySelectorAll('[data-earth-step]')] as HTMLElement[]).sort(
        (a, b) => Number(a.dataset.earthStep) - Number(b.dataset.earthStep)
      )
      const y = window.scrollY
      tops = sections.map((s) => s.getBoundingClientRect().top + y)
      docEnd = document.documentElement.scrollHeight - window.innerHeight
    }

    // Chỉ toán học. Ngoài window.scrollY (đọc rẻ) thì KHÔNG chạm DOM.
    const update = () => {
      if (!tops.length) return
      const y = window.scrollY

      // pair i: tops[i] → tops[i+1] (threshold = mép trên section chạm mép trên viewport)
      let i = tops.findIndex((t) => y < t) - 1
      if (i === -2) i = tops.length - 1 // qua threshold cuối
      if (i < 0) i = 0
      const start = tops[i]
      const end = i + 1 < tops.length ? tops[i + 1] : Math.max(docEnd, start + 1)
      const p = Math.min(1, Math.max(0, (y - start) / (end - start)))
      pose.current = { i, p }
    }

    const remeasure = () => {
      measure()
      update()
    }

    remeasure()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', remeasure)
    // Ảnh/font tải xong hay section co giãn thì chiều cao tài liệu đổi mà KHÔNG có sự kiện
    // resize nào — đây là lý do bản cũ phải đo live. ResizeObserver giữ nguyên tính đúng đắn
    // đó mà không phải trả giá mỗi frame.
    const ro = new ResizeObserver(remeasure)
    ro.observe(document.documentElement)

    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', remeasure)
      ro.disconnect()
    }
  }, [enabled])

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

function Earth({ pose, fade, steps }: { pose: MutableRefObject<Pose>; fade: MutableRefObject<number>; steps: Step[] }) {
  const group = useRef<Group>(null)
  const spin = useRef(0)
  const { viewport } = useThree()

  const { baseScale, autoRotate, rotateSpeed, ambient, keyIntensity, fillIntensity, lightColor } = useControls(
    'earth',
    {
      baseScale: { value: 1, min: 0.2, max: 6, step: 0.05 },
      autoRotate: true,
      rotateSpeed: { value: 0.1, min: 0, max: 1, step: 0.01 },
      // đèn TRẮNG ẤM chỉ để tạo khối — màu gold do lục địa/rim tự phát sáng lo;
      // đèn vàng đậm + ambient cao là nguyên nhân quả cầu từng bị "cam đặc"
      ambient: { value: 0.4, min: 0, max: 3, step: 0.05 },
      keyIntensity: { value: 0.9, min: 0, max: 5, step: 0.1 },
      fillIntensity: { value: 0.38, min: 0, max: 3, step: 0.05 },
      lightColor: '#FFF3E2',
    }
  )

  // Áp keyframe MỖI FRAME từ pose ref (không phụ thuộc callback nào khác) → không thể "ngủ".
  useFrame((_, delta) => {
    const g = group.current
    if (!g) return
    const { i, p } = pose.current
    const from = steps[i] ?? steps[steps.length - 1]
    const to = steps[i + 1] ?? from
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

// Báo cho tấm Intro biết asset của cảnh đã xong. Đặt BÊN TRONG <Suspense>: component này chỉ
// render khi nhánh đó đã resolve, tức useGLTF/useTexture của EarthModel đã tải xong.
function AssetsReady() {
  useEffect(() => markSceneReady(SCENE_EARTH), [])
  return null
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
        <Earth pose={pose} fade={fade} steps={variant === 'hero' ? HERO_POSE : STEPS} />
        <AssetsReady />
      </Suspense>
      {debug && <StatsPanel />}
    </BackgroundCanvas>
  )
}
