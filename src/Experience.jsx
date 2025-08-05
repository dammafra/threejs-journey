import { OrbitControls } from '@react-three/drei'
import { Physics, RigidBody } from '@react-three/rapier'
import { useControls } from 'leva'
import { Perf } from 'r3f-perf'
import { useRef } from 'react'
import { Vector3 } from 'three'

export default function Experience() {
  const cube = useRef()

  const { debug } = useControls({
    debug: process.env.NODE_ENV === 'development' || window.location.hash.includes('#debug'),
  })

  const cubeJump = () => {
    cube.current.applyImpulse(new Vector3(0, 5, 0))
    cube.current.applyTorqueImpulse(
      new Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5),
    )
  }

  return (
    <>
      <Perf position="top-left" />

      <OrbitControls makeDefault />

      <directionalLight castShadow position={[1, 2, 3]} intensity={4.5} />
      <ambientLight intensity={1.5} />

      <Physics debug={debug}>
        <RigidBody colliders="ball">
          <mesh castShadow position={[-1.5, 2, 0]}>
            <sphereGeometry />
            <meshStandardMaterial color="orange" />
          </mesh>
        </RigidBody>

        <RigidBody ref={cube}>
          <mesh castShadow position={[1.5, 2, 0]} onClick={cubeJump}>
            <boxGeometry />
            <meshStandardMaterial color="mediumpurple" />
          </mesh>
        </RigidBody>

        <RigidBody type="fixed">
          <mesh receiveShadow position-y={-1.25}>
            <boxGeometry args={[10, 0.5, 10]} />
            <meshStandardMaterial color="greenyellow" />
          </mesh>
        </RigidBody>
      </Physics>
    </>
  )
}
