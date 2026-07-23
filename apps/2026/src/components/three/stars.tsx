'use client'

import { useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useControls } from 'leva'
import { Color, MathUtils, Vector2 } from 'three'

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
uniform vec2 uResolution;

void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  modelPosition.x += snoise(vec2(noise.x, uTime * speed)) * scale;
  modelPosition.y += snoise(vec2(noise.y, uTime * speed)) * scale;
  modelPosition.z += snoise(vec2(noise.z, uTime * speed)) * scale;

  float depth = (1.0 / - (viewMatrix * modelPosition).z);

  modelPosition.y += uScroll * depth * 100.;
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
  const { count, size, scale, color } = useControls('stars', {
    count: { value: 100, min: 0, max: 500, step: 10 },
    size: { value: 150, min: 10, max: 400, step: 10 },
    scale: { value: 500, min: 0, max: 1000, step: 10 },
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

  const speeds = useMemo(() => Float32Array.from(Array.from({ length: count }, () => Math.random() * 0.2)), [count])

  const scales = useMemo(
    () => Float32Array.from(Array.from({ length: count }, () => Math.random() * scale)),
    [count, scale]
  )

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uColor: { value: new Color('#FFE1BE') },
      uResolution: { value: new Vector2(1, 1) },
    }),
    []
  )

  useEffect(() => {
    uniforms.uColor.value = new Color(color)
  }, [uniforms, color])

  useFrame(({ clock, viewport }) => {
    uniforms.uTime.value = clock.elapsedTime
    // scroll px của trang (Lenis cuộn native scroll nên scrollY chính là giá trị smooth)
    uniforms.uScroll.value = window.scrollY
    // cập nhật mỗi frame — chống kẹt giá trị khởi tạo khi canvas fixed đo trễ lúc mount
    uniforms.uResolution.value.set(viewport.width, viewport.height)
  })

  return (
    // key: đổi tham số leva → dựng lại geometry (bufferAttribute không update args tại chỗ)
    <points key={`${count}-${size}-${scale}`}>
      <bufferGeometry>
        <bufferAttribute attach='attributes-position' args={[positions, 3]} />
        <bufferAttribute attach='attributes-noise' args={[noise, 3]} />
        <bufferAttribute attach='attributes-size' args={[sizes, 1]} />
        <bufferAttribute attach='attributes-speed' args={[speeds, 1]} />
        <bufferAttribute attach='attributes-scale' args={[scales, 1]} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        uniforms={uniforms}
      />
    </points>
  )
}
