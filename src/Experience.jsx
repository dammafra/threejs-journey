import { OrbitControls } from '@react-three/drei'
import { Physics } from '@react-three/rapier'
import { useControls } from 'leva'
import { Perf } from 'r3f-perf'
import { Suspense } from 'react'
import { Level } from './Level.jsx'
import Lights from './Lights.jsx'
import Player from './Player.jsx'

export default function Experience() {
  const { monitor, orbitControls, physicsDebug } = useControls({
    monitor: false,
    orbitControls: false,
    physicsDebug: false,
  })

  return (
    <>
      {monitor && <Perf position="top-left" />}

      {orbitControls && <OrbitControls makeDefault />}

      <Suspense>
        <Physics debug={physicsDebug}>
          <Lights />
          <Level />
          <Player cameraEnabled={!orbitControls} />
        </Physics>
      </Suspense>
    </>
  )
}
