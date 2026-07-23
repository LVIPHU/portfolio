'use client'

import { useEffect, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { useControls } from 'leva'
import type { ThreeElements } from '@react-three/fiber'
import { Color, MeshPhysicalMaterial, type Mesh } from 'three'

// gltfjsx (Earth by Akshat, CC-BY-4.0). Mesh Sphere_Material002_0, scale 100 baked.
// Mặc định render WIREFRAME màu chủ đạo (amber) — đồng bộ brand; leva (?debug) đổi lại texture gốc.
export function EarthModel(props: ThreeElements['group']) {
  const { nodes, materials } = useGLTF('/earth-web.glb')

  const { wireframe, color, metalness, roughness, opacity } = useControls('earth material', {
    wireframe: true,
    color: '#FFC97A', // rgb(255, 201, 122)
    metalness: { value: 1, min: 0, max: 1, step: 0.05 },
    roughness: { value: 0.4, min: 0, max: 1, step: 0.05 },
    opacity: { value: 0.9, min: 0.1, max: 1, step: 0.05 },
  })

  const wireMaterial = useMemo(
    () =>
      new MeshPhysicalMaterial({
        wireframe: true,
        transparent: true,
      }),
    []
  )

  useEffect(() => {
    wireMaterial.color = new Color(color)
    // emissive amber để lưới giữ màu chủ đạo bất kể đèn
    wireMaterial.emissive = new Color(color)
    wireMaterial.emissiveIntensity = 0.55
    wireMaterial.metalness = metalness
    wireMaterial.roughness = roughness
    wireMaterial.opacity = opacity
    // opacity gốc cho keyframe fade (earth-canvas nhân với hệ số per-step mỗi frame)
    wireMaterial.userData.baseOpacity = opacity
  }, [wireMaterial, color, metalness, roughness, opacity])

  // material texture gốc (khi tắt wireframe qua leva) cũng phải fade được
  useEffect(() => {
    const texMat = materials['Material.002']
    if (texMat) {
      texMat.transparent = true
      texMat.userData.baseOpacity = 1
    }
  }, [materials])

  useEffect(() => () => wireMaterial.dispose(), [wireMaterial])

  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes.Sphere_Material002_0 as Mesh).geometry}
        material={wireframe ? wireMaterial : materials['Material.002']}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={100}
      />
    </group>
  )
}

useGLTF.preload('/earth-web.glb')
