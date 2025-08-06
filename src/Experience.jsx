import { OrbitControls } from '@react-three/drei'
import { Physics } from '@react-three/rapier'
import { useControls } from 'leva'
import { Perf } from 'r3f-perf'
import { Level } from './Level.jsx'
import Lights from './Lights.jsx'

export default function Experience() {
  const { debug } = useControls({
    debug: process.env.NODE_ENV === 'development' || window.location.hash.includes('#debug'),
  })

  return (
    <>
      {debug && <Perf position="top-left" />}

      <OrbitControls makeDefault />

      <Physics debug={debug}>
        <Lights />
        <Level />
      </Physics>
    </>
  )
}
