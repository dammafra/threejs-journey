import GUI from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import fireworkFragmentShader from './shaders/firework/fragment.glsl'
import fireworkVertexShader from './shaders/firework/vertex.glsl'

// Debug
const gui = new GUI({ width: 340 })

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Loaders
const textureLoader = new THREE.TextureLoader()

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Camera
const camera = new THREE.PerspectiveCamera(25, sizes.width / sizes.height, 0.1, 100)
camera.position.set(1.5, 0, 6)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Fireworks
const createFirework = (count, position) => {
  // Geometry
  const positionsArray = new Float32Array(count * 3)

  for (let i = 0; i < count; i++) {
    const i3 = i * 3

    positionsArray[i3 + 0] = Math.random() - 0.5
    positionsArray[i3 + 1] = Math.random() - 0.5
    positionsArray[i3 + 2] = Math.random() - 0.5
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positionsArray, 3))

  // Material
  const material = new THREE.ShaderMaterial({
    vertexShader: fireworkVertexShader,
    fragmentShader: fireworkFragmentShader,
  })

  // Points
  const firework = new THREE.Points(geometry, material)
  firework.position.copy(position)
  scene.add(firework)
}

createFirework(100, new THREE.Vector3())

// Animate
const tick = () => {
  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
