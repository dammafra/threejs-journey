import { Canvas } from '@react-three/fiber'
import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import Experience from './Experience.jsx'
import './style.css'

const root = ReactDOM.createRoot(document.querySelector('#root'))

root.render(
  <StrictMode>
    <Canvas
      camera={{
        fov: 45,
        near: 0.1,
        far: 200,
        position: [-4, 3, 6],
      }}
    >
      <Experience />
    </Canvas>
  </StrictMode>,
)
