import GUI from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'

// Loaders
const gltfLoader = new GLTFLoader()
const rgbeLoader = new RGBELoader()
const textureLoader = new THREE.TextureLoader()

// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Textures
const floorARMTexture = textureLoader.load('./textures/wood_cabinet_worn_long/wood_cabinet_worn_long_arm_1k.jpg') //prettier-ignore
const floorColorTexture = textureLoader.load('./textures/wood_cabinet_worn_long/wood_cabinet_worn_long_diff_1k.jpg') //prettier-ignore
const floorNormalTexture = textureLoader.load('./textures/wood_cabinet_worn_long/wood_cabinet_worn_long_nor_gl_1k.png') //prettier-ignore

floorColorTexture.colorSpace = THREE.SRGBColorSpace

const wallARMTexture = textureLoader.load('./textures/castle_brick_broken_06/castle_brick_broken_06_arm_1k.jpg') //prettier-ignore
const wallColorTexture = textureLoader.load('./textures/castle_brick_broken_06/castle_brick_broken_06_diff_1k.jpg') //prettier-ignore
const wallNormalTexture = textureLoader.load('./textures/castle_brick_broken_06/castle_brick_broken_06_nor_gl_1k.png') //prettier-ignore

wallColorTexture.colorSpace = THREE.SRGBColorSpace

// Environment map
scene.environmentIntensity = 1
gui.add(scene, 'environmentIntensity').min(0).max(10).step(0.001)

rgbeLoader.load('/environmentMaps/0/2k.hdr', environmentMap => {
  environmentMap.mapping = THREE.EquirectangularReflectionMapping

  scene.background = environmentMap
  scene.environment = environmentMap
})

// Directional light
const directionalLight = new THREE.DirectionalLight('#ffffff', 6)
directionalLight.position.set(-4, 6.5, 2.5)
scene.add(directionalLight)

gui.add(directionalLight, 'intensity').min(0).max(20).step(0.001).name('lightIntensity') //prettier-ignore
gui.add(directionalLight.position, 'x').min(-10).max(10).step(0.001).name('lightX') //prettier-ignore
gui.add(directionalLight.position, 'y').min(-10).max(10).step(0.001).name('lightY') //prettier-ignore
gui.add(directionalLight.position, 'z').min(-10).max(10).step(0.001).name('lightZ') //prettier-ignore

// Planes
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(8, 8),
  new THREE.MeshStandardMaterial({
    map: floorColorTexture,
    aoMap: floorARMTexture,
    roughnessMap: floorARMTexture,
    metalnessMap: floorARMTexture,
    normalMap: floorNormalTexture,
  }),
)
floor.rotation.x = -Math.PI * 0.5
scene.add(floor)

const wall = new THREE.Mesh(
  new THREE.PlaneGeometry(8, 8),
  new THREE.MeshStandardMaterial({
    map: wallColorTexture,
    aoMap: wallARMTexture,
    roughnessMap: wallARMTexture,
    metalnessMap: wallARMTexture,
    normalMap: wallNormalTexture,
  }),
)
wall.position.y = 4
wall.position.z = -4
scene.add(wall)

// Models
// gltfLoader.load('/models/FlightHelmet/glTF/FlightHelmet.gltf', gltf => {
//   gltf.scene.scale.set(10, 10, 10)
//   scene.add(gltf.scene)

//   updateAllMaterials()
// })

gltfLoader.load('/models/hamburger.glb', gltf => {
  gltf.scene.scale.setScalar(0.4)
  gltf.scene.position.set(0, 2.5, 0)
  scene.add(gltf.scene)

  updateAllMaterials()
})

const updateAllMaterials = () => {
  scene.traverse(child => {
    if (child.isMesh && child.material.isMeshStandardMaterial) {
      child.castShadow = true
      child.receiveShadow = true
    }
  })
}

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
  // MSAA
  // antialias: true,
  antialias: window.devicePixelRatio < 2, // MSAA
})

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Shadows
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

directionalLight.castShadow = true
directionalLight.shadow.camera.far = 15
directionalLight.shadow.mapSize.set(512, 512) // default, better for performance; blurry shadow isn't that bad on detailed meshes
// directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.normalBias = 0.027
directionalLight.shadow.bias = -0.004
gui.add(directionalLight, 'castShadow')
gui.add(directionalLight.shadow, 'normalBias').min(-0.05).max(0.05).step(0.001)
gui.add(directionalLight.shadow, 'bias').min(-0.05).max(0.05).step(0.001)

const directionalLightHelper = new THREE.CameraHelper(directionalLight.shadow.camera) //prettier-ignore
directionalLightHelper.visible = false
scene.add(directionalLightHelper)
gui.add(directionalLightHelper, 'visible').name('lightHelper')

directionalLight.target.position.set(0, 4, 0)
directionalLight.target.updateWorldMatrix()

// SSAA
// const ssaaSamples = 2
// renderer.setPixelRatio(window.devicePixelRatio * ssaaSamples)

renderer.toneMapping = THREE.ReinhardToneMapping

gui.add(renderer, 'toneMapping', {
  No: THREE.NoToneMapping,
  Linear: THREE.LinearToneMapping,
  Reinhard: THREE.ReinhardToneMapping,
  Cineon: THREE.CineonToneMapping,
  ACESFilmic: THREE.ACESFilmicToneMapping,
})

renderer.toneMappingExposure = 3

gui.add(renderer, 'toneMappingExposure').min(0).max(10).step(0.001)

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
