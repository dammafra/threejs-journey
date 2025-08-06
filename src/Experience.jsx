import { OrbitControls, useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import {
  CuboidCollider,
  CylinderCollider,
  InstancedRigidBodies,
  Physics,
  RigidBody,
} from '@react-three/rapier'
import { useControls } from 'leva'
import { Perf } from 'r3f-perf'
import { useMemo, useRef, useState } from 'react'
import { Euler, Quaternion, Vector3 } from 'three'

export default function Experience() {
  const hamburger = useGLTF('./hamburger.glb')
  const [hitSound] = useState(() => new Audio('./hit.mp3'))

  const { debug } = useControls({
    debug: process.env.NODE_ENV === 'development' || window.location.hash.includes('#debug'),
  })

  const cube = useRef()
  const cubeJump = () => {
    const mass = cube.current.mass()
    cube.current.applyImpulse(new Vector3(0, 5 * mass, 0))
    cube.current.applyTorqueImpulse(
      new Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5),
    )
  }

  const twister = useRef()
  useFrame(({ clock }) => {
    if (!twister.current) return

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

  const cubesCount = 300
  // const cubes = useRef()
  // useEffect(() => {
  //   for (let i = 0; i < cubesCount; i++) {
  //     const matrix = new Matrix4()
  //     matrix.compose(
  //       new Vector3(i * 2, 0, 0), // position
  //       new Quaternion(), // rotation
  //       new Vector3(1, 1, 1), // scale
  //     )
  //     cubes.current.setMatrixAt(i, matrix)
  //   }
  // }, [])
  const instances = useMemo(() =>
    [...Array(cubesCount)].map((_, i) => ({
      key: `instance_${i}`,
      position: [
        (Math.random() - 0.5) * 8, // x
        6 + i * 0.2, // y
        (Math.random() - 0.5) * 8, //z
      ],
      rotation: [Math.random(), Math.random(), Math.random()],
    })),
  )

  return (
    <>
      {debug && <Perf position="top-left" />}

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
          gravityScale={1}
          restitution={0}
          friction={0.7}
          colliders={false}
          // onCollisionEnter={() => console.log('enter')}
          // onCollisionExit={() => console.log('exit')}
          // onSleep={() => console.log('sleep')}
          // onWake={() => console.log('wake')}
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

        <RigidBody colliders={false} position={[0, 4, 0]}>
          <CylinderCollider args={[0.5, 1.25]} />
          <primitive object={hamburger.scene} scale={0.25} />
        </RigidBody>

        <InstancedRigidBodies instances={instances}>
          <instancedMesh
            // ref={cubes}
            castShadow
            receiveShadow
            args={[null, null, cubesCount]}
          >
            <boxGeometry />
            <meshStandardMaterial color="tomato" />
          </instancedMesh>
        </InstancedRigidBodies>

        <RigidBody type="fixed">
          <CuboidCollider args={[5, 2, 0.5]} position={[0, 1, 5.5]} />
          <CuboidCollider args={[5, 2, 0.5]} position={[0, 1, -5.5]} />
          <CuboidCollider args={[0.5, 2, 5]} position={[5.5, 1, 0]} />
          <CuboidCollider args={[0.5, 2, 5]} position={[-5.5, 1, 0]} />
        </RigidBody>
      </Physics>
    </>
  )
}
