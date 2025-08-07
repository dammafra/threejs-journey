import { useKeyboardControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { RigidBody, useRapier } from '@react-three/rapier'
import { useEffect, useRef, useState } from 'react'
import { Euler, Vector3 } from 'three'

export default function Player({ cameraEnabled = true }) {
  const body = useRef()
  const { rapier, world } = useRapier()
  const [subscribeKeys, getKeys] = useKeyboardControls()
  const [smoothedCameraPosition] = useState(() => new Vector3(10, 10, 10))
  const [smoothedCameraTarget] = useState(() => new Vector3())

  useFrame((state, delta) => {
    const safeDelta = Math.min(delta, 0.1) // clamp to 100ms

    if (!body.current) return

    // Controls
    const { forward, backward, leftward, rightward } = getKeys()

    const impulse = new Vector3(0, 0, 0)
    const torque = new Euler(0, 0, 0)

    const impulseStrength = 0.6 * safeDelta
    const torqueStrength = 0.2 * safeDelta

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

    // Camera
    if (!cameraEnabled) return

    const bodyPosition = body.current.translation()

    const cameraPosition = new Vector3()
    cameraPosition.copy(bodyPosition)
    cameraPosition.z += 2.25
    cameraPosition.y += 0.65

    const cameraTarget = new Vector3()
    cameraTarget.copy(bodyPosition)
    cameraTarget.y += 0.25

    smoothedCameraPosition.lerp(cameraPosition, 5 * safeDelta)
    smoothedCameraTarget.lerp(cameraTarget, 5 * safeDelta)

    state.camera.position.copy(smoothedCameraPosition)
    state.camera.lookAt(smoothedCameraTarget)
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
