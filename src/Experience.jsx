import { OrbitControls } from '@react-three/drei'
import { button, folder, useControls } from 'leva'

export default function Experience() {
  const { position, color, visible } = useControls('shpere', {
    position: {
      value: { x: -2, z: 0 },
      min: -4,
      max: 4,
      step: 0.01,
      joystick: 'invertY',
    },
    color: 'orange',
    visible: true,
  })

  const { scale } = useControls('cube', {
    scale: { value: 1.5, min: 0, max: 5, step: 0.01 },
  })

  const demo = useControls('demo', {
    interval: {
      min: 0,
      max: 10,
      value: [4, 5],
    },
    clickMe: button(() => {
      console.log('ok')
    }),
    choice: { options: ['a', 'b', 'c'] },
    folder: folder({ text: 'test' }, { collapsed: true }),
  })

  return (
    <>
      <OrbitControls makeDefault />

      <directionalLight position={[1, 2, 3]} intensity={4.5} />
      <ambientLight intensity={1.5} />

      <mesh position={[position.x, 0, position.z]} visible={visible}>
        <sphereGeometry />
        <meshStandardMaterial color={color} />
      </mesh>

      <mesh position-x={2} scale={scale}>
        <boxGeometry />
        <meshStandardMaterial color="mediumpurple" />
      </mesh>

      <mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={10}>
        <planeGeometry />
        <meshStandardMaterial color="greenyellow" />
      </mesh>
    </>
  )
}
