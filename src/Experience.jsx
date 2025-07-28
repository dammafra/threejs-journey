import { OrbitControls, shaderMaterial } from '@react-three/drei'
import { extend } from '@react-three/fiber'
import { Suspense } from 'react'
import { Color } from 'three'
import Portal from './Portal'
import portalFragmentShader from './shaders/portal/fragment.glsl'
import portalVertexShader from './shaders/portal/vertex.glsl'

const PortalMaterial = shaderMaterial(
  {
    uTime: 0,
    uColorStart: new Color('#24acf0'),
    uColorEnd: new Color('#ffffff'),
  },
  portalVertexShader,
  portalFragmentShader,
)

extend({ PortalMaterial })

export default function Experience() {
  return (
    <>
      <color args={['#1a0f0f']} attach="background" />

      <OrbitControls
        makeDefault
        enablePan={false}
        minDistance={3}
        maxDistance={10}
        maxPolarAngle={Math.PI * 0.45}
        autoRotate
        autoRotateSpeed={0.25}
      />

      <Suspense>
        <Portal />
      </Suspense>
    </>
  )
}
