import { extend, useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'
import { OrbitControls } from 'three/examples/jsm/Addons.js'

extend({ OrbitControls })

export default function Experience() {
  const { camera, gl } = useThree()

  const cubeRef = useRef(null)
  const groupRef = useRef(null)

  useFrame((state, delta) => {
    cubeRef.current.rotation.y += delta
    // groupRef.current.rotation.y += delta
  })

  return (
    <>
      <orbitControls args={[camera, gl.domElement]} />

      <group ref={groupRef}>
        <mesh position-x={-2}>
          <sphereGeometry />
          <meshBasicMaterial color="orange" />
        </mesh>
        <mesh ref={cubeRef} position-x={2} rotation-y={Math.PI * 0.25} scale={1.5}>
          <boxGeometry />
          <meshBasicMaterial color="mediumpurple" />
        </mesh>
      </group>
      <mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={10}>
        <planeGeometry />
        <meshBasicMaterial color="greenyellow" />
      </mesh>
    </>
  )
}
