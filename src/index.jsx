import { Bvh } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import ReactDOM from 'react-dom/client'
import Experience from './Experience.jsx'
import './style.css'

const root = ReactDOM.createRoot(document.querySelector('#root'))

root.render(
  <Canvas
    camera={{
      fov: 45,
      near: 0.1,
      far: 200,
      position: [-4, 3, 6],
    }}
    onPointerMissed={() => console.log('missed')}
  >
    <Bvh>
      <Experience />
    </Bvh>
  </Canvas>,
)
