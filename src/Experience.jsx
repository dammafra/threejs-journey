import { OrbitControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { CuboidCollider, Physics, RigidBody } from '@react-three/rapier'
import { useControls } from 'leva'
import { Perf } from 'r3f-perf'
import { useRef } from 'react'
import { Euler, Quaternion, Vector3 } from 'three'

export default function Experience() {
  const cube = useRef()
  const twister = useRef()

  const { debug } = useControls({
    debug: process.env.NODE_ENV === 'development' || window.location.hash.includes('#debug'),
  })

  const cubeJump = () => {
    const mass = cube.current.mass()
    cube.current.applyImpulse(new Vector3(0, 5 * mass, 0))
    cube.current.applyTorqueImpulse(
      new Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5),
    )
  }

  useFrame(({ clock }, delta) => {
    const time = clock.getElapsedTime()
    const eulerRotation = new Euler(0, time * 3, 0)
    const quaternionRotation = new Quaternion()
    quaternionRotation.setFromEuler(eulerRotation)
    twister.current.setNextKinematicRotation(quaternionRotation)

    const angle = time * 0.5
    const x = Math.cos(angle) * 2
    const z = Math.sin(angle) * 2
    const position = new Vector3(x, -0.8, z)
    twister.current.setNextKinematicTranslation(position)
  })

  return (
    <>
      <Perf position="top-left" />

      <OrbitControls makeDefault />

      <directionalLight castShadow position={[1, 2, 3]} intensity={4.5} />
      <ambientLight intensity={1.5} />

      <Physics debug={debug} gravity={[0, -9.81, 0]}>
        <RigidBody colliders="ball" position={[-1.5, 2, 0]}>
          <mesh castShadow>
            <sphereGeometry />
            <meshStandardMaterial color="orange" />
          </mesh>
        </RigidBody>

        <RigidBody
          ref={cube}
          position={[1.5, 2, 0]}
          colliders={false}
          gravityScale={1}
          restitution={0}
          friction={0.7}
        >
          <CuboidCollider mass={3} args={[0.5, 0.5, 0.5]} />
          <mesh castShadow onClick={cubeJump}>
            <boxGeometry />
            <meshStandardMaterial color="mediumpurple" />
          </mesh>
        </RigidBody>

        <RigidBody type="fixed" position-y={-1.25}>
          <mesh receiveShadow>
            <boxGeometry args={[10, 0.5, 10]} />
            <meshStandardMaterial color="greenyellow" />
          </mesh>
        </RigidBody>

        <RigidBody ref={twister} position={[0, -0.8, 0]} friction={0} type="kinematicPosition">
          <mesh castShadow scale={[0.4, 0.4, 3]}>
            <boxGeometry />
            <meshStandardMaterial color="red" />
          </mesh>
        </RigidBody>
      </Physics>
    </>
  )
}
