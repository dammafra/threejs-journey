import { OrbitControls } from '@react-three/drei'
import { BallCollider, CuboidCollider, Physics, RigidBody } from '@react-three/rapier'
import { useControls } from 'leva'
import { Perf } from 'r3f-perf'

export default function Experience() {
  const { debug } = useControls({
    debug: process.env.NODE_ENV === 'development' || window.location.hash.includes('#debug'),
  })

  return (
    <>
      <Perf position="top-left" />

      <OrbitControls makeDefault />

      <directionalLight castShadow position={[1, 2, 3]} intensity={4.5} />
      <ambientLight intensity={1.5} />

      <Physics debug={debug}>
        <RigidBody colliders="ball">
          <mesh castShadow position={[0, 4, 0]}>
            <sphereGeometry />
            <meshStandardMaterial color="orange" />
          </mesh>
        </RigidBody>

        <RigidBody colliders={false} position={[0, 1, -0.25]} rotation-x={Math.PI * 0.1}>
          <CuboidCollider args={[1.5, 1.5, 0.5]} />
          <CuboidCollider
            args={[0.25, 1, 0.25]}
            position={[0, 0, 1]}
            rotation={[-Math.PI * 0.35, 0, 0]}
          />
          <BallCollider args={[1.5]} />
          <mesh castShadow>
            <torusGeometry args={[1, 0.5, 16, 32]} />
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
