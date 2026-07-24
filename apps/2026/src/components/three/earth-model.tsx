'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { useControls } from 'leva'
import type { ThreeElements } from '@react-three/fiber'
import { Color, MeshPhysicalMaterial, MeshStandardMaterial, type Mesh, type Texture } from 'three'

// gltfjsx (Earth by Akshat, CC-BY-4.0). Mesh Sphere_Material002_0, scale 100 baked.
//
// Mặc định render DUOTONE: giữ nguyên bản đồ châu lục/đại dương của texture gốc nhưng
// đổ toàn bộ về tông amber — đại dương chìm tối, lục địa nổi sáng.
//
// Cách tách nước/đất: KHÔNG dùng độ sáng đơn thuần, vì texture này mây phủ rất nhiều và
// mây cũng sáng như lục địa → cả mảng mây sẽ hoá amber, lấn át châu lục. Thay vào đó lấy
// "độ trội của kênh lam" (đại dương xanh: B >> R,G; mây trắng: R≈G≈B; đất: R,G > B) để
// dìm riêng mặt nước, còn mây vẫn giữ được vệt sáng tự nhiên.
const DUOTONE_UNIFORMS = /* glsl */ `
uniform vec3 uOcean;
uniform vec3 uLand;
uniform float uLow;
uniform float uHigh;
uniform float uWaterGain;
uniform float uOceanSink;
uniform float uCloudDim;
uniform float uGlow;
uniform float uRimStrength;
uniform float uRimPow;
float vDuotone;
`

const DUOTONE_MAP_CHUNK = /* glsl */ `
#include <map_fragment>
{
  vec3 c = diffuseColor.rgb;
  float lum = dot(c, vec3(0.299, 0.587, 0.114));
  float mx = max(max(c.r, c.g), c.b);
  float mn = min(min(c.r, c.g), c.b);
  float sat = mx > 0.0 ? (mx - mn) / mx : 0.0;
  // 1.0 = nước biển, 0.0 = đất/mây
  float water = clamp((c.b - max(c.r, c.g)) * uWaterGain, 0.0, 1.0);
  float v = smoothstep(uLow, uHigh, lum * (1.0 - water * uOceanSink));
  // mây và băng cực gần như không bão hoà: dìm bớt để không sáng ngang lục địa
  v *= 1.0 - uCloudDim * max(0.0, 1.0 - sat * 3.0);
  diffuseColor.rgb = mix(uOcean, uLand, v);
  vDuotone = v;
}
`

// Lục địa TỰ phát sáng (không phụ thuộc đèn — đèn giờ trắng ấm chỉ tạo khối) + viền
// cầu glow amber theo fresnel: tách quả cầu đen khỏi nền đen, kiểu GitHub globe.
// vNormal/vViewPosition luôn có sẵn trong fragment của MeshStandardMaterial.
const DUOTONE_EMISSIVE_CHUNK = /* glsl */ `
#include <emissivemap_fragment>
{
  vec3 nrm = normalize(vNormal);
  vec3 viewDir = normalize(vViewPosition);
  float rim = min(pow(1.0 - clamp(dot(nrm, viewDir), 0.0, 1.0), uRimPow) * uRimStrength, 1.0);
  totalEmissiveRadiance = mix(vec3(0.0), uLand, vDuotone) * uGlow + uLand * rim;
}
`

export function EarthModel(props: ThreeElements['group']) {
  const { nodes, materials } = useGLTF('/earth-web.glb')

  const {
    mode,
    ocean,
    land,
    low,
    high,
    waterGain,
    oceanSink,
    cloudDim,
    glow,
    rimStrength,
    rimPow,
    metalness,
    roughness,
    opacity,
  } = useControls('earth material', {
    mode: { value: 'duotone', options: ['duotone', 'wireframe'] },
    // đại dương ĐEN trung tính tan vào nền site — chỉ lục địa vẽ nét amber
    ocean: '#050505',
    land: '#FFC97A',
    // bộ số chốt bằng cách chạy đúng công thức này trên pixel texture (có trọng số
    // cos vĩ độ): cho ~66% diện tích cầu là tối, sát tỉ lệ nước 71% của Trái Đất
    low: { value: 0.12, min: 0, max: 1, step: 0.01 },
    high: { value: 0.55, min: 0, max: 1, step: 0.01 },
    waterGain: { value: 8, min: 1, max: 20, step: 0.5 },
    oceanSink: { value: 0.9, min: 0, max: 1, step: 0.05 },
    cloudDim: { value: 0.35, min: 0, max: 1, step: 0.05 },
    glow: { value: 0.55, min: 0, max: 1.5, step: 0.05 },
    rimStrength: { value: 0.5, min: 0, max: 4, step: 0.05 },
    rimPow: { value: 5.5, min: 1, max: 10, step: 0.5 },
    metalness: { value: 0.2, min: 0, max: 1, step: 0.05 },
    roughness: { value: 0.75, min: 0, max: 1, step: 0.05 },
    opacity: { value: 1, min: 0.1, max: 1, step: 0.05 },
  })

  // Texture bản đồ mượn từ material của GLTF — KHÔNG sửa/dispose material đó vì useGLTF
  // cache toàn cục (sửa vào sẽ rò sang mọi consumer và sống qua cả HMR).
  const map = (materials['Material.002'] as MeshStandardMaterial | undefined)?.map as Texture | null

  // uniforms giữ trong ref: onBeforeCompile chỉ chạy lúc biên dịch, đổi giá trị sau đó
  // phải mutate chính object shader.uniforms đang gắn với program.
  const uniformsRef = useRef({
    uOcean: { value: new Color('#050505') },
    uLand: { value: new Color('#FFC97A') },
    uLow: { value: 0.12 },
    uHigh: { value: 0.55 },
    uWaterGain: { value: 8 },
    uOceanSink: { value: 0.9 },
    uCloudDim: { value: 0.35 },
    uGlow: { value: 0.55 },
    uRimStrength: { value: 0.5 },
    uRimPow: { value: 5.5 },
  })

  const duotoneMaterial = useMemo(() => {
    const mat = new MeshStandardMaterial({ transparent: true })
    // Mặc định three lấy onBeforeCompile.toString() làm khoá cache program. Thân hàm chỉ
    // tham chiếu hằng module nên nội dung shader đổi mà khoá không đổi → có thể tái dùng
    // program cũ. Khoá riêng theo nội dung để không bao giờ dính bản biên dịch cũ.
    mat.customProgramCacheKey = () =>
      `felix-earth-duotone-${DUOTONE_UNIFORMS.length}-${DUOTONE_MAP_CHUNK.length}-${DUOTONE_EMISSIVE_CHUNK.length}`
    mat.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, uniformsRef.current)
      // Chỉ vá fragment shader: vDuotone là biến toàn cục trong chính fragment (map_fragment
      // ghi, emissivemap_fragment đọc — three chạy map trước emissive), không cần varying.
      shader.fragmentShader = shader.fragmentShader
        // chèn khai báo ngay sau <common> — mốc chuẩn, luôn ở phạm vi toàn cục
        .replace('#include <common>', `#include <common>\n${DUOTONE_UNIFORMS}`)
        .replace('#include <map_fragment>', DUOTONE_MAP_CHUNK)
        .replace('#include <emissivemap_fragment>', DUOTONE_EMISSIVE_CHUNK)
    }
    return mat
  }, [])

  const wireMaterial = useMemo(() => new MeshPhysicalMaterial({ wireframe: true, transparent: true }), [])

  // đồng bộ uniform + thuộc tính material theo leva
  useEffect(() => {
    const u = uniformsRef.current
    u.uOcean.value = new Color(ocean)
    u.uLand.value = new Color(land)
    u.uLow.value = low
    u.uHigh.value = high
    u.uWaterGain.value = waterGain
    u.uOceanSink.value = oceanSink
    u.uCloudDim.value = cloudDim
    u.uGlow.value = glow
    u.uRimStrength.value = rimStrength
    u.uRimPow.value = rimPow
  }, [ocean, land, low, high, waterGain, oceanSink, cloudDim, glow, rimStrength, rimPow])

  useEffect(() => {
    if (map) duotoneMaterial.map = map
    duotoneMaterial.metalness = metalness
    duotoneMaterial.roughness = roughness
    duotoneMaterial.opacity = opacity
    // opacity gốc cho keyframe fade (earth-canvas nhân hệ số per-step mỗi frame)
    duotoneMaterial.userData.baseOpacity = opacity
    duotoneMaterial.needsUpdate = true
  }, [duotoneMaterial, map, metalness, roughness, opacity])

  useEffect(() => {
    wireMaterial.color = new Color(land)
    wireMaterial.emissive = new Color(land)
    wireMaterial.emissiveIntensity = 0.55
    wireMaterial.metalness = metalness
    wireMaterial.roughness = roughness
    wireMaterial.opacity = opacity
    wireMaterial.userData.baseOpacity = opacity
  }, [wireMaterial, land, metalness, roughness, opacity])

  useEffect(
    () => () => {
      duotoneMaterial.dispose()
      wireMaterial.dispose()
    },
    [duotoneMaterial, wireMaterial]
  )

  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes.Sphere_Material002_0 as Mesh).geometry}
        material={mode === 'wireframe' ? wireMaterial : duotoneMaterial}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={100}
      />
    </group>
  )
}

useGLTF.preload('/earth-web.glb')
