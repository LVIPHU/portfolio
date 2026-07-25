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
//     texture vẫn mượn từ GLB nên không thêm file ảnh nào.
//   • Bỏ tầng khí quyển (nhìn từ không gian không thấy) và bỏ wireframe mode.
//
// themeMix tự đọc: ưu tiên .showcase-root[data-theme] (/about), nếu trang không có thì
// theo class của next-themes trên <html> (trang chủ) → không cần sửa earth-canvas cho theme.
// Đèn nằm ở earth-canvas.tsx (leva 'earth'): ambient 0.40 / key 0.90 / fill 0.38 — key 1.1
// làm cháy vùng sáng của vàng kim.

import { useEffect, useMemo, useRef, useState } from 'react'
import { useGLTF, useTexture } from '@react-three/drei'
import { useControls } from 'leva'
import { useFrame, useThree, type ThreeElements } from '@react-three/fiber'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import {
  CanvasTexture,
  Color,
  LinearFilter,
  MeshStandardMaterial,
  PMREMGenerator,
  RepeatWrapping,
  Vector3,
  type Texture,
} from 'three'

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const smoothstepJs = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a), 0, 1)
  return t * t * (3 - 2 * t)
}
const mulberry32 = (seed: number) => () => {
  seed |= 0
  seed = (seed + 0x6d2b79f5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

const UNIFORMS_GLSL = /* glsl */ `
uniform vec3 uOcean;
uniform vec3 uLand;
uniform vec3 uLandDeep;
uniform float uLow;
uniform float uHigh;
uniform float uWaterGain;
uniform float uOceanSink;
uniform float uCloudDim;
uniform float uGlow;
uniform float uRimStrength;
uniform float uRimPow;
uniform vec3 uRimColor;
uniform float uNight;
uniform vec3 uNightColor;
uniform sampler2D uNightMap;
uniform vec3 uLightDirWorld;
uniform sampler2D uGeoMap;
uniform float uGeoOnly;
uniform float uLandMetal;
uniform float uLandRough;
uniform float uOceanRough;
uniform float uOceanSpecular;
float vDuotone;
float vLandTone;
// Camera cua BackgroundCanvas la ORTHOGRAPHIC. Voi ortho, huong nhin la HANG (0,0,1) trong
// view space; normalize(vViewPosition) tro ve GOC view-space nen lech truc nhin toi 30-38do
// khi qua cau bi day lech tam (STEPS position toi 0.55*viewport, scale 3.2). Hau qua: ndv o
// ria phia huong vao giua man hinh ra ~0.30 thay vi 0, moi guard "tat dan o ria" deu hut ->
// vanh sang chi o MOT ben. three khai san uniform bool isOrthographic va tu dung dung the nay.
vec3 eyeDir() { return isOrthographic ? vec3(0.0, 0.0, 1.0) : normalize(vViewPosition); }
`

const MAP_GLSL = /* glsl */ `
#include <map_fragment>
{
  vec3 c = diffuseColor.rgb;
  float lum = dot(c, vec3(0.299, 0.587, 0.114));
  float mx = max(max(c.r, c.g), c.b);
  float mn = min(min(c.r, c.g), c.b);
  float sat = mx > 0.0 ? (mx - mn) / mx : 0.0;
  float water = clamp((c.b - max(c.r, c.g)) * uWaterGain, 0.0, 1.0);
  float v = smoothstep(uLow, uHigh, lum * (1.0 - water * uOceanSink));
  v *= 1.0 - uCloudDim * max(0.0, 1.0 - sat * 3.0);
  // threshold lại sau khi sample: mẫu mờ ở mip thấp (rìa nghiêng) không tạo dải nâu smear
  float geo = smoothstep(0.42, 0.58, texture2D(uGeoMap, vMapUv).r);
  float detail = max(v, smoothstep(0.10, 0.55, lum));
  // đất/biển do mask bờ biển quyết định; vân địa chất chỉ điều tiết TÔNG vàng đậm↔nhạt
  // → hai theme cho kết quả như nhau (nếu để vân là màu biển lọt qua thì light sẽ trắng nhoè)
  v = mix(detail * geo, geo, uGeoOnly);
  float tone = smoothstep(0.15, 0.75, lum) * mix(0.30, 1.0, detail);
  diffuseColor.rgb = mix(uOcean, mix(uLandDeep, uLand, tone), v);
  vDuotone = v;
  vLandTone = tone;
}
`

const EMISSIVE_GLSL = /* glsl */ `
#include <emissivemap_fragment>
{
  vec3 nrm = normalize(vNormal);
  vec3 vDir = eyeDir();
  float rim = min(pow(1.0 - clamp(dot(nrm, vDir), 0.0, 1.0), uRimPow) * uRimStrength, 1.0);
  // chống cháy rìa: đất dồn ở limb + glow + rim cộng dồn → tắt dần glow khi nghiêng
  float limb = pow(1.0 - clamp(dot(nrm, vDir), 0.0, 1.0), 3.0);
  vec3 lightDirView = normalize((viewMatrix * vec4(uLightDirWorld, 0.0)).xyz);
  float nightSide = smoothstep(0.12, -0.35, dot(nrm, lightDirView));
  float city = texture2D(uNightMap, vMapUv).r;
  vec3 landGlow = mix(uLandDeep, uLand, vLandTone) * vDuotone * uGlow * mix(1.0, 0.3, limb);
  totalEmissiveRadiance = landGlow + uRimColor * rim + uNightColor * city * uNight * nightSide;
}
`

// vàng kim trên đất / cẩm thạch trên biển — metalness & roughness tách theo mask đất
const ROUGH_GLSL = /* glsl */ `
#include <roughnessmap_fragment>
roughnessFactor = mix(uOceanRough, uLandRough + (1.0 - vLandTone) * 0.12, vDuotone);
`
const METAL_GLSL = /* glsl */ `
#include <metalnessmap_fragment>
metalnessFactor = uLandMetal * vDuotone;
`
// bump phẳng dần ở góc xiên: sát limb đạo hàm UV nổ lớn → pháp tuyến giả xoay loạn, hứng
// đèn key thành dải sáng lốm đốm bám rìa
const NORMAL_GLSL = /* glsl */ `
#include <normal_fragment_maps>
{
  vec3 baseN = normalize(vNormal);
  float ndv = clamp(dot(baseN, eyeDir()), 0.0, 1.0);
  normal = normalize(mix(baseN, normal, smoothstep(0.02, 0.30, ndv)));
}
`
// biển = sứ/cẩm thạch: sheen mềm ở thân cầu cho đổ khối, tắt dần ở rìa để không hào quang
const SPECULAR_GLSL = /* glsl */ `
  float ndvOut = clamp(dot(normalize(vNormal), eyeDir()), 0.0, 1.0);
  totalSpecular *= mix(uOceanSpecular * smoothstep(0.12, 0.45, ndvOut), 1.0, vDuotone);
  vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;`

// heightmap (bump) + đèn thành phố, sinh 1 lần từ texture + mask bờ biển
function buildMasks(img: HTMLImageElement, geoImg: HTMLImageElement) {
  const W = 1024
  const H = 512
  const c = document.createElement('canvas')
  c.width = W
  c.height = H
  const x = c.getContext('2d', { willReadFrequently: true })!
  x.drawImage(img, 0, 0, W, H)
  const d = x.getImageData(0, 0, W, H).data
  x.clearRect(0, 0, W, H)
  x.drawImage(geoImg, 0, 0, W, H)
  const gd = x.getImageData(0, 0, W, H).data

  const geo = new Float32Array(W * H)
  const lum = new Float32Array(W * H)
  for (let i = 0; i < W * H; i++) {
    geo[i] = gd[i * 4] / 255
    lum[i] = (0.299 * d[i * 4] + 0.587 * d[i * 4 + 1] + 0.114 * d[i * 4 + 2]) / 255
  }

  // CHỈ đất theo bản đồ thật mới nổi — thềm lục địa không nhô như đất
  const hc = document.createElement('canvas')
  hc.width = W
  hc.height = H
  const hx = hc.getContext('2d')!
  const hd = hx.createImageData(W, H)
  for (let i = 0; i < W * H; i++) {
    const h = geo[i] * (80 + 160 * lum[i])
    hd.data[i * 4] = hd.data[i * 4 + 1] = hd.data[i * 4 + 2] = h
    hd.data[i * 4 + 3] = 255
  }
  hx.putImageData(hd, 0, 0)
  const height = document.createElement('canvas')
  height.width = W
  height.height = H
  const bx = height.getContext('2d')!
  bx.filter = 'blur(1px)'
  bx.drawImage(hc, 0, 0)

  // đèn thành phố: chấm li ti trên đất, dày hơn dọc bờ biển, né hai cực
  const night = document.createElement('canvas')
  night.width = W
  night.height = H
  const nx = night.getContext('2d')!
  nx.fillStyle = '#000'
  nx.fillRect(0, 0, W, H)
  const rand = mulberry32(7)
  for (let y = 8; y < H - 8; y++) {
    if (Math.abs(y / H - 0.5) * 180 > 62) continue
    for (let k = 0; k < W; k++) {
      const i = y * W + k
      if (geo[i] < 0.5) continue
      const coast =
        Math.min(
          geo[y * W + ((k + 3) % W)],
          geo[y * W + ((k - 3 + W) % W)],
          geo[(y + 3) * W + k],
          geo[(y - 3) * W + k]
        ) < 0.3
      if (rand() < (coast ? 0.07 : 0.011)) {
        nx.fillStyle = `rgba(255,255,255,${0.5 + rand() * 0.5})`
        nx.fillRect(k, y, rand() < 0.22 ? 2 : 1, 1)
      }
    }
  }
  return { height, night }
}

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
  const { materials } = useGLTF('/earth-web.glb')
  const geoTex = useTexture('/land-mask.png')
  const { gl, scene } = useThree()
  const themeTarget = useThemeTarget()
  const mix = useRef(0)
  const [ready, setReady] = useState(false)

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

  // texture mượn từ material của GLTF — KHÔNG sửa/dispose material đó (useGLTF cache toàn cục)
  const map = (materials['Material.002'] as MeshStandardMaterial | undefined)?.map as Texture | null

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
    uNightMap: { value: null as Texture | null },
    // trùng position đèn key trong earth-canvas: [300, 200, 400] đã normalize
    uLightDirWorld: { value: new Vector3(300, 200, 400).normalize() },
    uGeoMap: { value: null as Texture | null },
    uGeoOnly: { value: 1.0 },
    uLandMetal: { value: 0.68 },
    uLandRough: { value: 0.32 },
    uOceanRough: { value: 0.52 },
    uOceanSpecular: { value: 0.7 },
  })

  const material = useMemo(() => {
    const mat = new MeshStandardMaterial({ transparent: true, metalness: 0, roughness: 0.93 })
    mat.envMapIntensity = 0.85
    // three lấy onBeforeCompile.toString() làm khoá cache program → khoá riêng theo nội dung
    mat.customProgramCacheKey = () =>
      `felix-earth-v9-${UNIFORMS_GLSL.length}-${MAP_GLSL.length}-${EMISSIVE_GLSL.length}` +
      `-${NORMAL_GLSL.length}-${ROUGH_GLSL.length}-${METAL_GLSL.length}-${SPECULAR_GLSL.length}`
    mat.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, uniformsRef.current)
      shader.fragmentShader = shader.fragmentShader
        .replace('#include <common>', `#include <common>\n${UNIFORMS_GLSL}`)
        .replace('#include <map_fragment>', MAP_GLSL)
        .replace('#include <normal_fragment_maps>', NORMAL_GLSL)
        .replace('#include <roughnessmap_fragment>', ROUGH_GLSL)
        .replace('#include <metalnessmap_fragment>', METAL_GLSL)
        .replace('vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;', SPECULAR_GLSL)
        .replace('#include <emissivemap_fragment>', EMISSIVE_GLSL)
    }
    return mat
  }, [])

  // bump + đèn thành phố: sinh 1 lần khi có đủ 2 ảnh
  useEffect(() => {
    if (!map?.image || !geoTex.image) return
    map.wrapS = RepeatWrapping
    map.anisotropy = Math.min(16, gl.capabilities.getMaxAnisotropy())
    geoTex.wrapS = RepeatWrapping
    geoTex.anisotropy = Math.min(16, gl.capabilities.getMaxAnisotropy())

    const masks = buildMasks(map.image as HTMLImageElement, geoTex.image as HTMLImageElement)
    const bump = new CanvasTexture(masks.height)
    bump.wrapS = RepeatWrapping
    const nightTex = new CanvasTexture(masks.night)
    nightTex.wrapS = RepeatWrapping
    nightTex.generateMipmaps = false
    nightTex.minFilter = LinearFilter // giữ chấm đèn sắc khi cầu thu nhỏ

    uniformsRef.current.uNightMap.value = nightTex
    uniformsRef.current.uGeoMap.value = geoTex
    material.map = map
    material.bumpMap = bump
    material.needsUpdate = true
    setReady(true)

    return () => {
      bump.dispose()
      nightTex.dispose()
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
      <mesh castShadow receiveShadow material={material} visible={ready}>
        <sphereGeometry args={[100, 160, 120]} />
      </mesh>
    </group>
  )
}

useGLTF.preload('/earth-web.glb')
