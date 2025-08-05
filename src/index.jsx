import { Canvas } from '@react-three/fiber'
import { Perf } from 'r3f-perf'
import ReactDOM from 'react-dom/client'
import Experience from './Experience.jsx'
import './style.css'

const root = ReactDOM.createRoot(document.querySelector('#root'))
const debug = import.meta.env.MODE === 'development' || location.hash === '#debug'

root.render(
  <>
    <Canvas
      className="r3f"
      camera={{
        fov: 45,
        near: 0.1,
        far: 2000,
        position: [-3, 1.5, 4],
      }}
    >
      <Experience />
      {debug && <Perf position="top-left" />}
    </Canvas>

    {/* prettier-ignore */}
    <footer>
      <a href="https://skfb.ly/oqp6N" target="_blank"> "2021 Macbook Pro 14" (M1 Pro / M1 Max)"</a> by akshatmittal <br />
      is licensed under <a href="http://creativecommons.org/licenses/by/4.0/" target="_blank">Creative Commons Attribution</a>.
    </footer>
  </>,
)
