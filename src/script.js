import GUI from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import particlesFragmentShader from './shaders/particles/fragment.glsl'
import particlesVertexShader from './shaders/particles/vertex.glsl'

// Debug
const gui = new GUI({ width: 340 })
const debugObject = {}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Loaders
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('./draco/')
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
  pixelRatio: Math.min(window.devicePixelRatio, 2),
}

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight
  sizes.pixelRatio = Math.min(window.devicePixelRatio, 2)

  // Materials
  if (particles) {
    particles.material.uniforms.uResolution.value.set(
      sizes.width * sizes.pixelRatio,
      sizes.height * sizes.pixelRatio,
    )
  }

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(sizes.pixelRatio)
})

// Camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 0, 8 * 2)
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

debugObject.clearColor = '#160920'
gui.addColor(debugObject, 'clearColor').onChange(() => {
  renderer.setClearColor(debugObject.clearColor)
})
renderer.setClearColor(debugObject.clearColor)

// Models
let particles = null

gltfLoader.load('./models.glb', gltf => {
  // Particles
  particles = {}

  // Positions
  const positions = gltf.scene.children.map(child => child.geometry.attributes.position)

  particles.maxCount = Math.max(...positions.map(position => position.count))

  particles.positions = positions.map(position => {
    const originalArray = position.array
    const newArray = new Float32Array(particles.maxCount * 3)
    newArray.set(originalArray)

    for (let i = position.count; i < particles.maxCount; i++) {
      const i3 = i * 3
      const randomIndex = Math.floor(position.count * Math.random()) * 3

      newArray[i3 + 0] = originalArray[randomIndex + 0]
      newArray[i3 + 1] = originalArray[randomIndex + 1]
      newArray[i3 + 2] = originalArray[randomIndex + 2]
    }

    return new THREE.Float32BufferAttribute(newArray, 3)
  })

  // Geometry
  particles.geometry = new THREE.BufferGeometry()
  particles.geometry.setAttribute('position', particles.positions.at(1))

  // Material
  particles.material = new THREE.ShaderMaterial({
    vertexShader: particlesVertexShader,
    fragmentShader: particlesFragmentShader,
    uniforms: {
      uSize: new THREE.Uniform(0.2),
      uResolution: new THREE.Uniform(
        new THREE.Vector2(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio),
      ),
    },
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  })

  // Points
  particles.points = new THREE.Points(particles.geometry, particles.material)
  scene.add(particles.points)
})

// Animate
const tick = () => {
  // Update controls
  controls.update()

  // Render normal scene
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
