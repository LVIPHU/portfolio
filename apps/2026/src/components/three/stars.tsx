'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useControls } from 'leva'
import { Color, MathUtils, Vector2, type ShaderMaterial } from 'three'

// Starfield nền (port cơ chế particles của lenis-website):
// - simplex noise theo uTime * speed → hạt trôi lơ lửng
// - parallax theo scroll: y += uScroll * depth (hạt gần trôi nhanh hơn)
// - wrap dọc mod(y, viewport.h) → cuộn vô hạn không hết sao
// - fragment: chấm glow mềm 0.05/dist - 0.1

const vertexShader = /* glsl */ `
// Simplex 2D noise (Ashima Arts / Ian McEwan — snippet public domain)
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
    dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

attribute float size;
attribute float speed;
attribute vec3 noise;
attribute float scale;

uniform float uTime;
uniform float uScroll;
uniform float uParallax;
uniform vec2 uResolution;

void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  modelPosition.x += snoise(vec2(noise.x, uTime * speed)) * scale;
  modelPosition.y += snoise(vec2(noise.y, uTime * speed)) * scale;
  modelPosition.z += snoise(vec2(noise.z, uTime * speed)) * scale;

  float depth = (1.0 / - (viewMatrix * modelPosition).z);

  // parallax theo scroll (lenis để cứng 100.; tách thành uniform để chỉnh được mức trôi)
  modelPosition.y += uScroll * depth * uParallax;
  modelPosition.y = mod(modelPosition.y, uResolution.y) - uResolution.y/2.;

  vec4 viewPosition = viewMatrix * modelPosition;
  gl_Position = projectionMatrix * viewPosition;

  gl_PointSize = size * 100.;
  gl_PointSize *= (1.0 / - viewPosition.z);
}
`

const fragmentShader = /* glsl */ `
uniform vec3 uColor;

void main() {
  float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
  float strength = 0.05 / distanceToCenter - 0.1;

  gl_FragColor = vec4(uColor, strength);
}
`

export function Stars({ depth = 500 }: { depth?: number }) {
  const { count, size, scale, drift, parallax, color } = useControls('stars', {
    count: { value: 100, min: 0, max: 500, step: 10 },
    size: { value: 150, min: 10, max: 400, step: 10 },
    scale: { value: 500, min: 0, max: 1000, step: 10 },
    // tốc độ trôi lơ lửng (lenis: 0.2). Để cao thì drift át hẳn chuyển động theo scroll.
    drift: { value: 0.05, min: 0, max: 0.4, step: 0.01 },
    // hệ số parallax (lenis để cứng 100 → sao chỉ dịch ~10% quãng cuộn, rất khó thấy)
    parallax: { value: 400, min: 0, max: 1200, step: 20 },
    color: '#FFE1BE', // amber nhạt theo brand
  })

  // Sinh vị trí trong khung CỐ ĐỊNH đủ lớn (không phụ thuộc viewport lúc mount —
  // canvas fixed đo trễ). Trục y được shader wrap theo uResolution nên luôn phủ màn.
  const positions = useMemo(() => {
    const array = new Array(count * 3)
    for (let i = 0; i < array.length; i += 3) {
      array[i] = MathUtils.randFloatSpread(2200)
      array[i + 1] = MathUtils.randFloatSpread(1400)
      array[i + 2] = MathUtils.randFloatSpread(depth)
    }
    return Float32Array.from(array)
  }, [count, depth])

  const noise = useMemo(() => Float32Array.from(Array.from({ length: count * 3 }, () => Math.random() * 100)), [count])

  const sizes = useMemo(
    () => Float32Array.from(Array.from({ length: count }, () => Math.random() * size)),
    [count, size]
  )

  const speeds = useMemo(
    () => Float32Array.from(Array.from({ length: count }, () => Math.random() * drift)),
    [count, drift]
  )

  const scales = useMemo(
    () => Float32Array.from(Array.from({ length: count }, () => Math.random() * scale)),
    [count, scale]
  )

  // Giá trị khởi tạo cho lúc dựng material — chỉ là khung; giá trị thật do useFrame
  // ghi mỗi frame (three CLONE object này khi tạo material nên đừng mutate nó).
  const initialUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uParallax: { value: 0 },
      uColor: { value: new Color('#000') },
      uResolution: { value: new Vector2(1, 1) },
    }),
    []
  )

  // BẮT BUỘC đi qua ref: three clone object uniforms khi dựng ShaderMaterial, nên
  // mutate object memo ở trên KHÔNG bao giờ tới GPU (đo được: material.uTime kẹt 0 →
  // sao đứng im hoàn toàn). Lenis gốc cũng giữ ref tới material vì lý do này.
  const material = useRef<ShaderMaterial>(null)
  const setUniform = (key: string, value: number) => {
    const u = material.current?.uniforms
    if (u?.[key]) u[key].value = value
  }

  const colorObj = useMemo(() => new Color(color), [color])

  // Nguồn scroll: listener 'scroll' thuần ghi vào ref (Lenis cuộn native nên scrollY
  // là giá trị đã mượt). KHÔNG dùng useLenis ở đây — r3f là reconciler riêng, context
  // của ReactLenis không xuyên qua <Canvas>.
  const scrollRef = useRef(0)
  useEffect(() => {
    const onScroll = () => {
      scrollRef.current = window.scrollY
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Debug (?debug): __starsDbg() xem uniform thật; __starsProbe(scroll) render 1 frame
  // với giá trị scroll cho trước rồi đo TÂM SÁNG của starfield — cách kiểm chứng parallax
  // không phụ thuộc việc trình duyệt có đang vẽ frame hay không (chính nó đã bắt được lỗi
  // uniforms bị three clone, khiến sao đứng im hoàn toàn).
  const { gl, scene, camera } = useThree()
  useEffect(() => {
    if (!new URLSearchParams(window.location.search).has('debug')) return
    const w = window as unknown as {
      __starsDbg?: () => unknown
      __starsProbe?: (s: number) => unknown
    }
    w.__starsDbg = () => {
      const u = material.current?.uniforms
      return {
        uScroll: u?.uScroll.value,
        scrollY: window.scrollY,
        uParallax: u?.uParallax.value,
        uResolution: u ? [u.uResolution.value.x, u.uResolution.value.y] : null,
        uTime: u?.uTime.value,
      }
    }
    w.__starsProbe = (scrollValue: number) => {
      // ghi cả ref lẫn uniform: useFrame sẽ ghi đè từ ref ở frame sau, còn render
      // thủ công ngay dưới đây dùng giá trị vừa set
      scrollRef.current = scrollValue
      setUniform('uScroll', scrollValue)
      gl.render(scene, camera)
      const ctx = gl.getContext()
      const W = gl.domElement.width
      const H = gl.domElement.height
      const buf = new Uint8Array(W * H * 4)
      ctx.readPixels(0, 0, W, H, ctx.RGBA, ctx.UNSIGNED_BYTE, buf)
      let sum = 0
      let weighted = 0
      let lit = 0
      for (let i = 0; i < W * H; i++) {
        const a = buf[i * 4 + 3]
        if (a > 12) {
          sum += a
          weighted += a * Math.floor(i / W)
          lit++
        }
      }
      return { scroll: scrollValue, litPixels: lit, centroidY: sum ? +(weighted / sum).toFixed(1) : null }
    }
    return () => {
      delete w.__starsDbg
      delete w.__starsProbe
    }
  }, [gl, scene, camera])

  // MỌI uniform đồng bộ tại đây, mỗi frame — một nguồn duy nhất. Lý do quan trọng:
  // đổi count/size/scale/drift (leva) làm <points> remount theo key → material MỚI
  // clone từ initialUniforms; nếu đồng bộ bằng effect theo dep [color]/[parallax] thì
  // effect không re-run (dep không đổi) → material mới kẹt giá trị khởi tạo.
  useFrame(({ clock, viewport }) => {
    const u = material.current?.uniforms
    if (!u) return
    u.uTime.value = clock.elapsedTime
    u.uScroll.value = scrollRef.current
    u.uParallax.value = parallax
    u.uColor.value.copy(colorObj)
    // cập nhật mỗi frame — chống kẹt giá trị khởi tạo khi canvas fixed đo trễ lúc mount
    u.uResolution.value.set(viewport.width, viewport.height)
  })

  return (
    // key: đổi tham số leva → dựng lại geometry (bufferAttribute không update args tại chỗ)
    <points key={`${count}-${size}-${scale}-${drift}`}>
      <bufferGeometry>
        <bufferAttribute attach='attributes-position' args={[positions, 3]} />
        <bufferAttribute attach='attributes-noise' args={[noise, 3]} />
        <bufferAttribute attach='attributes-size' args={[sizes, 1]} />
        <bufferAttribute attach='attributes-speed' args={[speeds, 1]} />
        <bufferAttribute attach='attributes-scale' args={[scales, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={material}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        uniforms={initialUniforms}
      />
    </points>
  )
}
