import { useGSAP } from '@gsap/react'
import { Center, shaderMaterial, Sparkles, useGLTF, useTexture } from '@react-three/drei'
import { extend, useFrame } from '@react-three/fiber'
import gsap from 'gsap'
import { useRef } from 'react'
import { Color, DoubleSide } from 'three'
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

export default function Portal() {
  const { nodes } = useGLTF('./model/portal.glb')
  const bakedTexture = useTexture('./model/baked.jpg')
  const portalMaterialRef = useRef()
  const axeRef = useRef()

  useFrame((state, delta) => {
    portalMaterialRef.current.uTime += delta
  })

  useGSAP(() => {
    // TODO @react-spring/three
    gsap
      .timeline({ repeat: -1, repeatDelay: 0.5 })
      .to(axeRef.current.position, { y: '+=0.25', ease: 'back.out' })
      .to(axeRef.current.rotation, { x: '+=0.5', y: '-=0.8', z: '+=0.5', ease: 'back.out' }, '<=')
      .to(axeRef.current.position, { y: '-=0.25', duration: 0.25, delay: 0.25, ease: 'back.in' })
      .to(axeRef.current.rotation, { x: '-=0.5', y: '+=0.8', z: '-=0.5', duration: 0.25, ease: 'back.in' }, '<=') //prettier-ignore
  })

  return (
    <Center>
      <mesh
        geometry={nodes.baked.geometry}
        position={nodes.baked.position}
        rotation={nodes.baked.rotation}
        scale={nodes.baked.scale}
      >
        <meshBasicMaterial map={bakedTexture} map-flipY={false} />
      </mesh>

      <mesh
        ref={axeRef}
        geometry={nodes.axe.geometry}
        position={nodes.axe.position}
        rotation={nodes.axe.rotation}
        scale={nodes.axe.scale}
      >
        <meshBasicMaterial map={bakedTexture} map-flipY={false} />
      </mesh>

      <mesh
        geometry={nodes.poleLightA.geometry}
        position={nodes.poleLightA.position}
        rotation={nodes.poleLightA.rotation}
        scale={nodes.poleLightA.scale}
      >
        <meshBasicMaterial color="#ffffe5" />
      </mesh>

      <mesh
        geometry={nodes.poleLightB.geometry}
        position={nodes.poleLightB.position}
        rotation={nodes.poleLightB.rotation}
        scale={nodes.poleLightB.scale}
      >
        <meshBasicMaterial color="#ffffe5" />
      </mesh>

      <mesh
        geometry={nodes.portalLight.geometry}
        position={nodes.portalLight.position}
        rotation={nodes.portalLight.rotation}
        scale={nodes.portalLight.scale}
      >
        <portalMaterial ref={portalMaterialRef} side={DoubleSide} />
      </mesh>

      <Sparkles size={6} scale={[4, 2, 4]} position-y={1} speed={0.2} count={40} />
    </Center>
  )
}

useGLTF.preload('./model/portal.glb')
