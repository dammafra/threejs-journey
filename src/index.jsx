import { Canvas } from '@react-three/fiber'
import ReactDOM from 'react-dom/client'
import Experience from './Experience.jsx'
import './style.css'

const root = ReactDOM.createRoot(document.querySelector('#root'))

// const created = ({ gl, scene }) => {
//   gl.setClearColor('#ff0000')
//   scene.background = new Color('#ff0000')
// }

root.render(
  <Canvas
    shadows={false}
    camera={{
      fov: 45,
      near: 0.1,
      far: 200,
      position: [-4, 3, 6],
    }}
    // onCreated={created}
  >
    {/* <color args={['#ff0000']} attach="background" /> */}
    <Experience />
  </Canvas>,
)
