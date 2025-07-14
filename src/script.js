import GUI from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

// Debug
const gui = new GUI({ width: 400 })
gui.show(window.location.hash === '#debug')

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Texture loader
const textureLoader = new THREE.TextureLoader()

// Draco loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('draco/')

// GLTF loader
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

// Textures
const bakedTexture = textureLoader.load('baked.jpg')
bakedTexture.flipY = false
bakedTexture.colorSpace = THREE.SRGBColorSpace

// Materials
const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture })
const portalLightMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide })
const poleLightMaterial = new THREE.MeshBasicMaterial({ color: 0xffffe5 })

// Model
gltfLoader.load('portal.glb', gltf => {
  const bakedMesh = gltf.scene.children.find(child => child.name === 'baked')
  const portalLightMesh = gltf.scene.children.find(child => child.name === 'portalLight')
  const poleLightAMesh = gltf.scene.children.find(child => child.name === 'poleLightA')
  const poleLightBMesh = gltf.scene.children.find(child => child.name === 'poleLightB')

  bakedMesh.material = bakedMaterial
  portalLightMesh.material = portalLightMaterial
  poleLightAMesh.material = poleLightMaterial
  poleLightBMesh.material = poleLightMaterial

  gltf.scene.position.y = -0.5
  scene.add(gltf.scene)
})

// Floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(4, 4),
  new THREE.MeshBasicMaterial({ color: 0x5a4e07 }),
)
floor.position.y = -0.001
floor.rotation.x = Math.PI * 0.5
scene.add(floor)

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
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 4
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.minDistance = 3
controls.maxDistance = 10
controls.maxPolarAngle = Math.PI * 0.45

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor(0x1a0f0f)

// Animate
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
