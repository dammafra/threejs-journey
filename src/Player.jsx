import { useKeyboardControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { RigidBody, useRapier } from '@react-three/rapier'
import { useEffect, useRef } from 'react'
import { Euler, Vector3 } from 'three'

export default function Player() {
  const body = useRef()
  const { rapier, world } = useRapier()
  const [subscribeKeys, getKeys] = useKeyboardControls()

  useFrame((state, delta) => {
    if (!body.current) return

    const { forward, backward, leftward, rightward } = getKeys()

    const impulse = new Vector3(0, 0, 0)
    const torque = new Euler(0, 0, 0)

    const impulseStrength = 0.6 * delta
    const torqueStrength = 0.2 * delta

    if (forward) {
      impulse.z -= impulseStrength
      torque.x -= torqueStrength
    }
    if (rightward) {
      impulse.x += impulseStrength
      torque.z -= torqueStrength
    }
    if (backward) {
      impulse.z += impulseStrength
      torque.x += torqueStrength
    }
    if (leftward) {
      impulse.x -= impulseStrength
      torque.z += torqueStrength
    }

    body.current.applyImpulse(impulse)
    body.current.applyTorqueImpulse(torque)
  })

  const jump = () => {
    const origin = body.current.translation()
    origin.y -= 0.31

    const direction = new Vector3(0, -1, 0)
    const ray = new rapier.Ray(origin, direction)
    const hit = world.castRay(ray, 10, true)

    hit.timeOfImpact < 0.15 && body.current.applyImpulse(new Vector3(0, 0.5, 0))
  }

  useEffect(() => {
    const unsubscribeJump = subscribeKeys(
      state => state.jump,
      value => value && jump(),
    )

    return unsubscribeJump
  }, [subscribeKeys])

  return (
    <RigidBody
      ref={body}
      colliders="ball"
      canSleep={false}
      position={[0, 1, 0]}
      restitution={0.2}
      friction={1}
      linearDamping={0.5}
      angularDamping={0.5}
    >
      <mesh castShadow>
        <icosahedronGeometry args={[0.3, 1]} />
        <meshStandardMaterial flatShading color="mediumpurple" />
      </mesh>
    </RigidBody>
  )
}
