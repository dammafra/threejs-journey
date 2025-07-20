import { Canvas } from '@react-three/fiber'
import ReactDOM from 'react-dom/client'
import Experience from './Experience'
import './style.css'

const root = ReactDOM.createRoot(document.querySelector('#root'))

root.render(
  <Canvas>
    <Experience />
  </Canvas>,
)
