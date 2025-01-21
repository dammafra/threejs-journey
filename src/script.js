import GUI from 'lil-gui'
import * as THREE from 'three'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { EXRLoader } from 'three/addons/loaders/EXRLoader.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// Loaders
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('./draco/')

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

const cubeTextureLoader = new THREE.CubeTextureLoader()
const rgbeLoader = new RGBELoader()
const exrLoader = new EXRLoader()

// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Environment Map
scene.environmentIntensity = 1
scene.backgroundBlurriness = 0
scene.backgroundIntensity = 1

scene.backgroundRotation.y = 0
scene.environmentRotation.y = 0

gui.add(scene, 'environmentIntensity').min(0).max(10).step(0.001)
gui.add(scene, 'backgroundBlurriness').min(0).max(1).step(0.0001)
gui.add(scene, 'backgroundIntensity').min(0).max(10).step(0.001)

gui.add(scene.backgroundRotation, 'y').min(0).max(Math.PI * 2).step(0.001).name('backgroundRotationY') //prettier-ignore
gui.add(scene.environmentRotation, 'y').min(0).max(Math.PI * 2).step(0.001).name('environmentRotationY') //prettier-ignore

// LDR cube texture (Low Dynamic Range)
// const environmentMap = cubeTextureLoader.load([
//   './environmentMaps/0/px.png',
//   './environmentMaps/0/nx.png',
//   './environmentMaps/0/py.png',
//   './environmentMaps/0/ny.png',
//   './environmentMaps/0/pz.png',
//   './environmentMaps/0/nz.png',
// ])

// scene.background = environmentMap
// scene.environment = environmentMap

// HDR (RGBE) equirectangular
// rgbeLoader.load('./environmentMaps/blender-studio-2k.hdr', environmentMap => {
//   environmentMap.mapping = THREE.EquirectangularReflectionMapping

//   scene.background = environmentMap
//   scene.environment = environmentMap
// })

// HDR (EXR) equirectangular
exrLoader.load('./environmentMaps/nvidiaCanvas-4k.exr', environmentMap => {
  environmentMap.mapping = THREE.EquirectangularReflectionMapping

  scene.background = environmentMap
  scene.environment = environmentMap
})

// Objects
const torusKnot = new THREE.Mesh(
  new THREE.TorusKnotGeometry(1, 0.4, 100, 16),
  new THREE.MeshStandardMaterial({
    roughness: 0.3,
    metalness: 1,
    color: 0xaaaaaa,
    // envMap: environmentMap,
  }),
)
torusKnot.position.y = 4
torusKnot.position.x = -4
scene.add(torusKnot)

// Models
gltfLoader.load('./models/FlightHelmet/glTF/FlightHelmet.gltf', gltf => {
  gltf.scene.scale.setScalar(10)
  scene.add(gltf.scene)
})

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
camera.position.set(4, 5, 4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.y = 3.5
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
  // Time
  const elapsedTime = clock.getElapsedTime()

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
