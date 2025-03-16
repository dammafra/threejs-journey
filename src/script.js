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
  resolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
  pixelRatio: Math.min(window.devicePixelRatio, 2),
}

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight
  sizes.resolution.set(window.innerWidth, window.innerHeight)
  sizes.pixelRatio = Math.min(window.devicePixelRatio, 2)

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(sizes.pixelRatio)
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
renderer.setPixelRatio(sizes.pixelRatio)

// Fireworks
const textures = [
  textureLoader.load('./particles/1.png'),
  textureLoader.load('./particles/2.png'),
  textureLoader.load('./particles/3.png'),
  textureLoader.load('./particles/4.png'),
  textureLoader.load('./particles/5.png'),
  textureLoader.load('./particles/6.png'),
  textureLoader.load('./particles/7.png'),
  textureLoader.load('./particles/8.png'),
]

const createFirework = ({ count, position, size, texture }) => {
  texture.flipY = false

  // Geometry
  const positionsArray = new Float32Array(count * 3)
  const sizesArray = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    const i3 = i * 3

    positionsArray[i3 + 0] = Math.random() - 0.5
    positionsArray[i3 + 1] = Math.random() - 0.5
    positionsArray[i3 + 2] = Math.random() - 0.5

    sizesArray[i] = Math.random()
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positionsArray, 3))
  geometry.setAttribute('aSize', new THREE.Float32BufferAttribute(sizesArray, 1))

  // Material
  const material = new THREE.ShaderMaterial({
    vertexShader: fireworkVertexShader,
    fragmentShader: fireworkFragmentShader,
    uniforms: {
      uSize: new THREE.Uniform(size),
      uResolution: new THREE.Uniform(sizes.resolution),
      uPixelRatio: new THREE.Uniform(sizes.pixelRatio),
      uTexture: new THREE.Uniform(texture),
    },

    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })

  // Points
  const firework = new THREE.Points(geometry, material)
  firework.position.copy(position)
  scene.add(firework)
}

createFirework({ count: 100, position: new THREE.Vector3(), size: 0.5, texture: textures[7] })

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
