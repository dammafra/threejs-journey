import { useGSAP } from '@gsap/react'
import { Canvas } from '@react-three/fiber'
import gsap from 'gsap'
import ReactDOM from 'react-dom/client'
import Experience from './Experience.jsx'
import './style.css'

gsap.registerPlugin(useGSAP)

const root = ReactDOM.createRoot(document.querySelector('#root'))

root.render(
  <Canvas
    flat
    camera={{
      fov: 45,
      near: 0.1,
      far: 200,
      position: [1, 2, 6],
    }}
  >
    <Experience />
  </Canvas>,
)
