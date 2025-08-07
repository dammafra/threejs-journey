import { KeyboardControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Leva } from 'leva'
import ReactDOM from 'react-dom/client'
import Experience from './Experience.jsx'
import './style.css'

const root = ReactDOM.createRoot(document.querySelector('#root'))

root.render(
  <KeyboardControls
    map={[
      { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
      { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
      { name: 'leftward', keys: ['ArrowLeft', 'KeyA'] },
      { name: 'rightward', keys: ['ArrowRight', 'KeyD'] },
      { name: 'jump', keys: ['Space'] },
    ]}
  >
    <Leva
      hidden={import.meta.env.MODE !== 'development'}
      theme={{ sizes: { rootWidth: '300px' } }}
    />

    <Canvas
      shadows
      camera={{
        fov: 45,
        near: 0.1,
        far: 200,
        position: [10, 10, 10],
      }}
    >
      <Experience />
    </Canvas>
  </KeyboardControls>,
)
