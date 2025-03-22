import GUI from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import halftoneFragmentShader from './shaders/halftone/fragment.glsl'
import halftoneVertexShader from './shaders/halftone/vertex.glsl'

// Debug
const gui = new GUI()

const debug = {
  clearColor: '#26132f',
  color: '#ff794d',
  shadowRepetitions: 100,
  shadowColor: '#8e19b8',
}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Loaders
const gltfLoader = new GLTFLoader()

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

  // Update material
  material.uniforms.uResolution.value.set(
    sizes.width * sizes.pixelRatio,
    sizes.height * sizes.pixelRatio,
  )

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(sizes.pixelRatio)
})

// Camera
const camera = new THREE.PerspectiveCamera(25, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 7
camera.position.y = 7
camera.position.z = 7
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
})
renderer.setClearColor(debug.clearColor)
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(sizes.pixelRatio)

gui.addColor(debug, 'clearColor').onChange(() => renderer.setClearColor(debug.clearColor))

// Material
const material = new THREE.ShaderMaterial({
  vertexShader: halftoneVertexShader,
  fragmentShader: halftoneFragmentShader,
  uniforms: {
    uColor: new THREE.Uniform(new THREE.Color(debug.color)),
    uResolution: new THREE.Uniform(new THREE.Vector2(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio)), //prettier-ignore
    uShadowRepetitions: new THREE.Uniform(debug.shadowRepetitions),
    uShadowColor: new THREE.Uniform(new THREE.Color(debug.shadowColor)),
  },
})

gui.addColor(debug, 'color').onChange(() => material.uniforms.uColor.value.set(debug.color))
gui
  .add(debug, 'shadowRepetitions')
  .min(1)
  .max(300)
  .step(1)
  .onChange(() => (material.uniforms.uShadowRepetitions.value = debug.shadowRepetitions))
gui
  .addColor(debug, 'shadowColor')
  .onChange(() => material.uniforms.uShadowColor.value.set(debug.shadowColor))

// Torus knot
const torusKnot = new THREE.Mesh(new THREE.TorusKnotGeometry(0.6, 0.25, 128, 32), material)
torusKnot.position.x = 3
scene.add(torusKnot)

// Sphere
const sphere = new THREE.Mesh(new THREE.SphereGeometry(), material)
sphere.position.x = -3
scene.add(sphere)

// Suzanne
let suzanne = null
gltfLoader.load('./suzanne.glb', gltf => {
  suzanne = gltf.scene
  suzanne.traverse(child => {
    if (child.isMesh) child.material = material
  })
  scene.add(suzanne)
})

// Animate
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Rotate objects
  if (suzanne) {
    suzanne.rotation.x = -elapsedTime * 0.1
    suzanne.rotation.y = elapsedTime * 0.2
  }

  sphere.rotation.x = -elapsedTime * 0.1
  sphere.rotation.y = elapsedTime * 0.2

  torusKnot.rotation.x = -elapsedTime * 0.1
  torusKnot.rotation.y = elapsedTime * 0.2

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
