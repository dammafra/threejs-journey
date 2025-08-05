import { OrbitControls } from '@react-three/drei'
import { Physics, RigidBody } from '@react-three/rapier'
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
          <mesh castShadow position={[-2, 4, 0]}>
            <sphereGeometry />
            <meshStandardMaterial color="orange" />
          </mesh>
        </RigidBody>

        <RigidBody>
          <mesh castShadow position={[2, 2, 0]}>
            <boxGeometry args={[2, 2, 1]} />
            <meshStandardMaterial color="mediumpurple" />
          </mesh>
          <mesh castShadow position={[2, 2, 3]}>
            <boxGeometry />
            <meshStandardMaterial color="mediumpurple" />
          </mesh>
        </RigidBody>

        <RigidBody colliders="trimesh">
          <mesh castShadow position={[-2, 1, -0.25]} rotation-x={Math.PI * 0.1}>
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
