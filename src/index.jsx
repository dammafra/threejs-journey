import { Canvas } from '@react-three/fiber'
import ReactDOM from 'react-dom/client'
import { ACESFilmicToneMapping, SRGBColorSpace } from 'three'
import Experience from './Experience'
import './style.css'

const root = ReactDOM.createRoot(document.querySelector('#root'))

const cameraSettings = root.render(
  <Canvas
    // dpr={[1, 2]} // default one
    // flat
    gl={{
      antialias: true,
      toneMapping: ACESFilmicToneMapping, // defualt one
      outputColorSpace: SRGBColorSpace, // default one
    }}
    // orthographic
    camera={{
      fov: 45,
      // zoom: 100,
      near: 0.1,
      far: 200,
      position: [3, 2, 6],
    }}
  >
    <Experience />
  </Canvas>,
)
