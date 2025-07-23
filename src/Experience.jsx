import { BakeShadows, OrbitControls, useHelper } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { Perf } from 'r3f-perf'
import { useRef } from 'react'
import { DirectionalLightHelper } from 'three'

export default function Experience() {
  const cubeRef = useRef()
  const directionalLightRef = useRef()
  useHelper(directionalLightRef, DirectionalLightHelper, 1)

  useFrame((state, delta) => {
    cubeRef.current.rotation.y += delta * 0.2
  })

  return (
    <>
      <BakeShadows />

      <color args={['ivory']} attach="background" />

      <Perf position="top-left" />

      <OrbitControls makeDefault />

      <directionalLight
        ref={directionalLightRef}
        position={[1, 2, 3]}
        intensity={4.5}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={1}
        shadow-camera-far={10}
        shadow-camera-top={5}
        shadow-camera-right={5}
        shadow-camera-bottom={-5}
        shadow-camera-left={-5}
      />
      <ambientLight intensity={1.5} />

      <mesh position-x={-2} castShadow>
        <sphereGeometry />
        <meshStandardMaterial color="orange" />
      </mesh>

      <mesh ref={cubeRef} position-x={2} scale={1.5} castShadow>
        <boxGeometry />
        <meshStandardMaterial color="mediumpurple" />
      </mesh>

      <mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={10} receiveShadow>
        <planeGeometry />
        <meshStandardMaterial color="greenyellow" />
      </mesh>
    </>
  )
}
