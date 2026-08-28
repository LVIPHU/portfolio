'use client'

// Earth v2 — bản duyệt trong Omelette, port 1:1 về codebase.
// Thay thế nguyên file src/components/three/earth-model.tsx.
//
// Cần thêm 1 asset: public/land-mask.png (mask bờ biển Natural Earth 1024×512, equirect,
// đất trắng / biển đen — copy từ handoff/public/land-mask.png).
//
// Khác bản cũ:
//   • Bờ biển lấy từ bản đồ thật (Natural Earth) → thềm lục địa/biển nông không còn hiện
//     như đất; vân địa chất của texture chỉ điều tiết TÔNG vàng đậm↔nhạt trong lục địa.
//   • Địa hình nổi khối bằng bump map sinh từ texture; đèn thành phố li ti phía tối.
//   • Chất liệu "tượng kintsugi": biển = sứ/cẩm thạch, đất = vàng kim loại
//     (metalness/roughness tách theo mask đất, phản xạ RoomEnvironment).
//   • Hai theme dùng CÙNG thông số shading — chỉ khác màu, nên đổ khối giống nhau.
//   • Hết chói: glow tắt dần ở rìa, specular biển tắt dần ở limb (không hào quang,
//     không lóe vàng ở terminator/core shadow), bump phẳng dần ở góc xiên.
//   • Lưới cầu 160×120 thay geometry GLB (UV equirect chuẩn, silhouette tròn hơn);
//     albedo webp tách từ GLB (`public/earth-albedo.webp`) — không fetch GLB lúc runtime.
//   • Bỏ tầng khí quyển (nhìn từ không gian không thấy) và bỏ wireframe mode.
//
// themeMix tự đọc: ưu tiên .showcase-root[data-theme] (/about), nếu trang không có thì
// theo class của next-themes trên <html> (trang chủ) → không cần sửa earth-canvas cho theme.
// Đèn nằm ở earth-canvas.tsx (leva 'earth'): ambient 0.40 / key 0.90 / fill 0.38 — key 1.1
// làm cháy vùng sáng của vàng kim.

import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { useTexture } from '@react-three/drei'
import { useControls } from 'leva'
import { useFrame, useThree, type ThreeElements } from '@react-three/fiber'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import {
  CanvasTexture,
  Color,
  DataTexture,
  LinearFilter,
  MeshStandardMaterial,
  PMREMGenerator,
  RepeatWrapping,
  SRGBColorSpace,
  Vector3,
  type Texture,
} from 'three'
import {
  EARTH_EMISSIVE_GLSL,
  EARTH_MAP_GLSL,
  EARTH_METAL_GLSL,
  EARTH_NORMAL_GLSL,
  EARTH_ROUGH_GLSL,
  EARTH_SPECULAR_GLSL,
  EARTH_UNIFORMS_GLSL,
} from './earth-shaders'
import { buildEarthMasks } from './earth-textures'

const lerp = (a: number, b: number, t: number) => a + (b - a) * t

// Albedo tách từ GLB cũ thành webp tĩnh (xem comment trong EarthModel); mask bờ biển Natural Earth.
const EARTH_ALBEDO_SRC = '/earth-albedo.webp'
const EARTH_MASK_SRC = '/land-mask.png'

// 1×1 đen, dùng chung — không dispose theo instance. Gắn map/bump từ lúc tạo material để
// Three bật USE_MAP/USE_BUMPMAP trước invalidate đầu (thiếu vMapUv → shader không compile).
const EARTH_PLACEHOLDER = new DataTexture(new Uint8Array([0, 0, 0, 255]), 1, 1)
EARTH_PLACEHOLDER.needsUpdate = true

// Theme đích cho quả cầu (0 = dark, 1 = light). Hai nguồn, theo thứ tự ưu tiên:
//  1. .showcase-root[data-theme] — trang /about, zoom-section đổi attribute này khi cuộn.
//  2. class trên <html> của next-themes — MỌI trang khác (vd trang chủ KHÔNG có
//     .showcase-root). Thiếu nhánh này thì light mode ngoài showcase cho ra quả cầu ĐEN
//     nằm giữa nền #efefef.
function useThemeTarget(): { current: number } {
  const target = useRef(0)
  useEffect(() => {
    const root = document.querySelector('.showcase-root') as HTMLElement | null
    const read = () => {
      target.current = root
        ? root.dataset.theme === 'light'
          ? 1
          : 0
        : document.documentElement.classList.contains('dark')
          ? 0
          : 1
    }
    read()
    const obs = new MutationObserver(read)
    obs.observe(root ?? document.documentElement, {
      attributes: true,
      attributeFilter: root ? ['data-theme'] : ['class'],
    })
    return () => obs.disconnect()
  }, [])
  return target
}

export function EarthModel(props: ThreeElements['group']) {
  // Albedo tách ra file webp tĩnh — KHÔNG load GLB (earth-web.glb đã xoá khỏi public/).
  // GLB đó bắt Draco decoder từ gstatic.com + EXT_texture_webp; CSP (P2) chặn gstatic nên
  // useGLTF treo Suspense mãi, canvas Earth trong suốt (chỉ còn sao).
  const [map, geoTex] = useTexture([EARTH_ALBEDO_SRC, EARTH_MASK_SRC])
  const { gl, scene } = useThree()
  const themeTarget = useThemeTarget()
  const mix = useRef(0)

  const { land, glow, relief, night, metal, low, high, waterGain, oceanSink, cloudDim, rimStrength, rimPow, opacity } =
    useControls('earth material', {
      // Màu GỐC vật liệu, CỐ Ý khác --color-gold (#DFB454) của site: Earth giữ chất kim
      // loại/kintsugi, còn token UI đi theo công thức pastel của lenis. Ngoài ra đèn +
      // specular + glow còn nâng màu này lên ~#D6BF66 lúc render, nên đồng bộ token vào
      // đây sẽ làm quả cầu sáng thêm một nấc nữa. Đừng "sửa cho khớp".
      land: '#D4AF37',
      glow: { value: 0.42, min: 0, max: 1.5, step: 0.01 },
      relief: { value: 5, min: 0, max: 12, step: 0.5 },
      night: { value: 0.9, min: 0, max: 2, step: 0.05 },
      metal: { value: 0.85, min: 0, max: 1, step: 0.05 },
      low: { value: 0.12, min: 0, max: 1, step: 0.01 },
      high: { value: 0.55, min: 0, max: 1, step: 0.01 },
      waterGain: { value: 8, min: 1, max: 20, step: 0.5 },
      oceanSink: { value: 0.9, min: 0, max: 1, step: 0.05 },
      cloudDim: { value: 0.35, min: 0, max: 1, step: 0.05 },
      // viền fresnel quanh cầu — TẮT mặc định (0). Trước đây bị hardcode 0.28 trong
      // useFrame nên không chỉnh được; giờ là control thật, kéo lên nếu muốn tách
      // silhouette khỏi nền đen.
      rimStrength: { value: 0, min: 0, max: 1, step: 0.02 },
      rimPow: { value: 5.0, min: 1, max: 10, step: 0.5 },
      opacity: { value: 1, min: 0.1, max: 1, step: 0.05 },
    })

  // Môi trường studio: vàng kim cần thứ để phản xạ, cẩm thạch được sheen mềm.
  //
  // HOÃN tới lúc rảnh: dựng RoomEnvironment rồi render ra cubemap + chuỗi lọc trước của
  // PMREM là khối chặn main thread NẶNG NHẤT của component (đo được ~250ms; long task
  // lúc tải 613ms → 360ms khi bỏ khối này). Nó không cần cho khung hình đầu — quả cầu chỉ
  // matte thêm một nhịp rồi bóng lên, đổi lại first paint không bị nghẽn.
  useEffect(() => {
    if (scene.environment) return
    let env: { texture: Texture } | null = null
    let cancelled = false
    const build = () => {
      // scene.environment có thể đã bị component khác set trong lúc chờ
      if (cancelled || scene.environment) return
      const pmrem = new PMREMGenerator(gl)
      env = pmrem.fromScene(new RoomEnvironment(), 0.04)
      scene.environment = env.texture
      pmrem.dispose()
    }
    const ric = typeof window.requestIdleCallback === 'function' ? window.requestIdleCallback : null
    // timeout: idle có thể không bao giờ tới trên tab bận — vẫn phải dựng, chỉ là muộn hơn
    const id = ric ? ric(build, { timeout: 1200 }) : window.setTimeout(build, 300)
    return () => {
      cancelled = true
      if (ric) window.cancelIdleCallback?.(id as number)
      else clearTimeout(id as number)
      // chỉ dọn env do CHÍNH effect này tạo, không giật của người khác
      if (env) {
        env.texture.dispose()
        scene.environment = null
      }
    }
  }, [gl, scene])

  const palette = useMemo(() => {
    const L = new Color(land)
    const hsl = { h: 0, s: 0, l: 0 }
    L.getHSL(hsl)
    return {
      // dark = đá/sứ đen, light = cẩm thạch TRUNG TÔNG (nền quá sáng thì không còn
      // biên độ để đổ khối — quả cầu sẽ phẳng và tan vào nền #efefef)
      oceanDark: new Color('#101012'),
      oceanLight: new Color('#cfc9be'),
      landDark: L.clone(),
      landDeepDark: new Color().setHSL(hsl.h, Math.min(1, hsl.s * 0.95), hsl.l * 0.58),
      landLight: new Color().setHSL(hsl.h, 0.92, 0.38),
      landDeepLight: new Color().setHSL(hsl.h, 1.0, 0.22),
      rimDark: L.clone(),
      rimLight: new Color().setHSL(hsl.h, 0.85, 0.4),
      nightColor: new Color().setHSL(hsl.h - 0.015, 1, 0.74),
      lightWarm: new Color('#FFF3E2'),
    }
  }, [land])

  const uniformsRef = useRef({
    uOcean: { value: new Color('#101012') },
    uLand: { value: new Color('#D4AF37') },
    uLandDeep: { value: new Color('#8a5b22') },
    uLow: { value: 0.12 },
    uHigh: { value: 0.55 },
    uWaterGain: { value: 8 },
    uOceanSink: { value: 0.9 },
    uCloudDim: { value: 0.35 },
    uGlow: { value: 0.42 },
    uRimStrength: { value: 0.28 },
    uRimPow: { value: 5.0 },
    uRimColor: { value: new Color('#D4AF37') },
    uNight: { value: 0.9 },
    uNightColor: { value: new Color('#ffd489') },
    uNightMap: { value: EARTH_PLACEHOLDER as Texture },
    // trùng position đèn key trong earth-canvas: [300, 200, 400] đã normalize
    uLightDirWorld: { value: new Vector3(300, 200, 400).normalize() },
    uGeoMap: { value: EARTH_PLACEHOLDER as Texture },
    uGeoOnly: { value: 1.0 },
    uLandMetal: { value: 0.68 },
    uLandRough: { value: 0.32 },
    uOceanRough: { value: 0.52 },
    uOceanSpecular: { value: 0.7 },
  })

  const material = useMemo(() => {
    const mat = new MeshStandardMaterial({
      name: 'EarthStandard',
      transparent: true,
      metalness: 0,
      roughness: 0.93,
      map: EARTH_PLACEHOLDER,
      bumpMap: EARTH_PLACEHOLDER,
    })
    mat.envMapIntensity = 0.85
    // three lấy onBeforeCompile.toString() làm khoá cache program → khoá riêng theo nội dung
    mat.customProgramCacheKey = () =>
      `felix-earth-v10-${EARTH_UNIFORMS_GLSL.length}-${EARTH_MAP_GLSL.length}-${EARTH_EMISSIVE_GLSL.length}` +
      `-${EARTH_NORMAL_GLSL.length}-${EARTH_ROUGH_GLSL.length}-${EARTH_METAL_GLSL.length}-${EARTH_SPECULAR_GLSL.length}`
    mat.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, uniformsRef.current)
      shader.fragmentShader = shader.fragmentShader
        .replace('#include <common>', `#include <common>\n${EARTH_UNIFORMS_GLSL}`)
        .replace('#include <map_fragment>', EARTH_MAP_GLSL)
        .replace('#include <normal_fragment_maps>', EARTH_NORMAL_GLSL)
        .replace('#include <roughnessmap_fragment>', EARTH_ROUGH_GLSL)
        .replace('#include <metalnessmap_fragment>', EARTH_METAL_GLSL)
        .replace('vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;', EARTH_SPECULAR_GLSL)
        .replace('#include <emissivemap_fragment>', EARTH_EMISSIVE_GLSL)
    }
    return mat
  }, [])

  // bump + đèn thành phố: sinh khi đủ 2 ảnh. Layout — trước invalidate/render của Canvas.
  useLayoutEffect(() => {
    let cancelled = false
    let bump: CanvasTexture | undefined
    let nightTex: CanvasTexture | undefined

    const apply = () => {
      if (cancelled || !map?.image || !geoTex?.image) return
      // GLTFLoader (nguồn cũ của texture này) gán sRGB cho baseColor; TextureLoader để
      // NoColorSpace → shader nhận sRGB thô như linear, tông đất/biển lệch so với bản duyệt.
      // needsUpdate để re-upload: initTexture của drei có thể đã đẩy bản NoColorSpace lên GPU.
      // geoTex giữ linear — nó là DATA mask bờ biển, không phải màu.
      map.colorSpace = SRGBColorSpace
      map.needsUpdate = true
      map.wrapS = RepeatWrapping
      map.anisotropy = Math.min(16, gl.capabilities.getMaxAnisotropy())
      geoTex.wrapS = RepeatWrapping
      geoTex.anisotropy = Math.min(16, gl.capabilities.getMaxAnisotropy())

      const masks = buildEarthMasks(map.image as HTMLImageElement, geoTex.image as HTMLImageElement)
      bump?.dispose()
      nightTex?.dispose()
      bump = new CanvasTexture(masks.height)
      bump.wrapS = RepeatWrapping
      nightTex = new CanvasTexture(masks.night)
      nightTex.wrapS = RepeatWrapping
      nightTex.generateMipmaps = false
      nightTex.minFilter = LinearFilter

      uniformsRef.current.uNightMap.value = nightTex
      uniformsRef.current.uGeoMap.value = geoTex
      material.map = map
      material.bumpMap = bump
      material.needsUpdate = true
    }

    // useTexture suspend tới khi ảnh tải xong nên map.image luôn sẵn ở đây — không cần
    // nghe 'load' như thời texture mượn từ GLB.
    apply()

    return () => {
      cancelled = true
      bump?.dispose()
      nightTex?.dispose()
    }
  }, [map, geoTex, material, gl])

  useEffect(() => {
    const u = uniformsRef.current
    u.uLow.value = low
    u.uHigh.value = high
    u.uWaterGain.value = waterGain
    u.uOceanSink.value = oceanSink
    u.uCloudDim.value = cloudDim
    u.uRimPow.value = rimPow
    material.opacity = opacity
    // opacity gốc cho keyframe fade (earth-canvas nhân hệ số per-step mỗi frame)
    material.userData.baseOpacity = opacity
  }, [low, high, waterGain, oceanSink, cloudDim, rimPow, opacity, material])

  useFrame((_, delta) => {
    const u = uniformsRef.current
    const p = palette
    // lerp mượt sang theme đích (dark 0 → light 1)
    mix.current = lerp(mix.current, themeTarget.current, 1 - Math.exp(-Math.min(delta, 0.05) * 5))
    const m = mix.current

    u.uOcean.value.lerpColors(p.oceanDark, p.oceanLight, m)
    u.uLand.value.lerpColors(p.landDark, p.landLight, m)
    u.uLandDeep.value.lerpColors(p.landDeepDark, p.landDeepLight, m)
    u.uRimColor.value.lerpColors(p.rimDark, p.rimLight, m)
    u.uNightColor.value.copy(p.nightColor)
    u.uGlow.value = glow * lerp(1, 0.25, m)
    u.uRimStrength.value = rimStrength
    u.uNight.value = night * (1 - m) // đèn thành phố chỉ có nghĩa ở dark
    // hai theme dùng CÙNG thông số shading — chỉ khác màu, nên đổ khối giống nhau
    u.uGeoOnly.value = 1.0
    u.uLandMetal.value = metal * 0.8
    u.uLandRough.value = 0.32
    u.uOceanRough.value = 0.52
    u.uOceanSpecular.value = 0.7
    material.envMapIntensity = 0.85
    material.bumpScale = relief * lerp(1, 0.85, m)
  })

  useEffect(() => () => material.dispose(), [material])

  return (
    <group {...props} dispose={null}>
      {/* lưới 160×120: UV equirect chuẩn (khớp cả texture GLB và mask bờ biển), bán kính 100
          bằng scale baked của model cũ nên keyframe scale trong earth-canvas không đổi */}
      <mesh castShadow receiveShadow material={material}>
        <sphereGeometry args={[100, 160, 120]} />
      </mesh>
    </group>
  )
}

useTexture.preload(EARTH_ALBEDO_SRC)
useTexture.preload(EARTH_MASK_SRC)
