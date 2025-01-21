import GUI from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Textures
const textureLoader = new THREE.TextureLoader()
const particleTexture = textureLoader.load('./textures/particles/2.png')

// Particles
// const particlesGeometry = new THREE.SphereGeometry(1, 32, 32)
const particlesGeometry = new THREE.BufferGeometry()

const count = 20000
const position = new Float32Array(count * 3)
const color = new Float32Array(count * 3)

for (let i = 0; i < count * 3; i++) {
  position[i] = (Math.random() - 0.5) * 10
  color[i] = Math.random()
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(position, 3)) // prettier-ignore
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(color, 3))

const particlesMaterial = new THREE.PointsMaterial({
  // color: '#ff88cc',
  vertexColors: true,
  transparent: true,
  alphaMap: particleTexture,
  // alphaTest: 0.001,
  // depthTest: false,
  depthWrite: false,
  blending: THREE.AdditiveBlending, // this impacts performances
  size: 0.1,
  sizeAttenuation: true,
})
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)

gui.add(particlesMaterial, 'alphaTest').min(0).max(1).step(0.001)
gui.add(particlesMaterial, 'depthTest')
gui.add(particlesMaterial, 'depthWrite')

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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Animate
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update particles
  // particles.rotation.y  = elapsedTime * 0.2

  // Update particlesGeometry position attribute (bad for performances)
  for (let i = 0; i < count; i++) {
    const i3 = i * 3
    const x = particlesGeometry.attributes.position.array[i3]
    particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x) // prettier-ignore
  }

  particlesGeometry.attributes.position.needsUpdate = true

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
