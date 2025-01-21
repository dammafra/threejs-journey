import GUI from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Textures
const textureLoader = new THREE.TextureLoader()
const ambientOcclusionTexture = textureLoader.load('./textures/Fabric_038_SD/Substance_Graph_AmbientOcclusion.jpg') //prettier-ignore
const colorTexture = textureLoader.load('./textures/Fabric_038_SD/Substance_Graph_BaseColor.jpg') //prettier-ignore
const heightTexture = textureLoader.load('./textures/Fabric_038_SD/Substance_Graph_height.jpg') //prettier-ignore
const normalTexture = textureLoader.load('./textures/Fabric_038_SD/Substance_Graph_Normal.jpg') //prettier-ignore
const roughnessTexture = textureLoader.load('./textures/Fabric_038_SD/Substance_Graph_Roughness.jpg') //prettier-ignore

colorTexture.colorSpace = THREE.SRGBColorSpace

const textures = [
  ambientOcclusionTexture,
  colorTexture,
  heightTexture,
  normalTexture,
  roughnessTexture,
]

textures.forEach(texture => {
  texture.repeat.x = 2
  texture.repeat.y = 2
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
})

// Models
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

let mixer = null

gltfLoader.load('/models/pizza.glb', gltf => {
  gltf.scene.children.forEach(mesh => {
    mesh.castShadow = true
    mesh.receiveShadow = true
  })
  scene.add(gltf.scene)
})

// Table
const table = new THREE.Mesh(
  new THREE.PlaneGeometry(40, 40),
  new THREE.MeshStandardMaterial({
    metalness: 0,
    roughness: 0.5,
    map: colorTexture,
    aoMap: ambientOcclusionTexture,
    displacementMap: heightTexture,
    normalMap: normalTexture,
    roughnessMap: roughnessTexture,
  }),
)
table.receiveShadow = true
table.rotation.x = -Math.PI * 0.5
scene.add(table)

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 3)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 25
directionalLight.shadow.camera.left = -12
directionalLight.shadow.camera.top = 10
directionalLight.shadow.camera.right = 12
directionalLight.shadow.camera.bottom = -10
directionalLight.position.set(8, 8, 8)
scene.add(directionalLight)

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
camera.position.set(-8, 4, 15)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 1, 0)
controls.enableDamping = true

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Animate
const clock = new THREE.Clock()
let previousTime = 0

const tick = () => {
  const elapsedTime = clock.getElapsedTime()
  const deltaTime = elapsedTime - previousTime
  previousTime = elapsedTime

  if (mixer) {
    mixer.update(deltaTime)
  }

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
