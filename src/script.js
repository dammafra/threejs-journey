import GUI from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// Debug
const gui = new GUI({ width: 300 })
const debug = {
  rotationDegrees: 0,
  reset: () => gui.reset(),
}
gui.add(debug, 'reset').name('Reset GUI')

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Textures
const loadingManager = new THREE.LoadingManager()
// loadingManager.onStart = () => console.log('loading started')
// loadingManager.onLoad = () => console.log('loading finished')
// loadingManager.onProgress = () => console.log('loading progressing')
// loadingManager.onError = () => console.log('loading error')

const textureLoader = new THREE.TextureLoader(loadingManager)
// const colorTexture = textureLoader.load('/textures/door/color.jpg')
// const colorTexture = textureLoader.load('/textures/checkerboard-1024x1024.png')
// const colorTexture = textureLoader.load('/textures/checkerboard-8x8.png')
const colorTexture = textureLoader.load('/textures/minecraft.png')
colorTexture.colorSpace = THREE.SRGBColorSpace

const transformFolder = gui.addFolder('Transform')
transformFolder.add(colorTexture.repeat, 'x').min(1).max(5).step(1).name('repeat x')
transformFolder.add(colorTexture.repeat, 'y').min(1).max(5).step(1).name('repeat y')
transformFolder.add(colorTexture, 'wrapS').options({
  RepeatWrapping: THREE.RepeatWrapping,
  ClampToEdgeWrapping: THREE.ClampToEdgeWrapping,
  MirroredRepeatWrapping: THREE.MirroredRepeatWrapping,
})
transformFolder.add(colorTexture, 'wrapT').options({
  RepeatWrapping: THREE.RepeatWrapping,
  ClampToEdgeWrapping: THREE.ClampToEdgeWrapping,
  MirroredRepeatWrapping: THREE.MirroredRepeatWrapping,
})
transformFolder.add(colorTexture.offset, 'x').min(-1).max(1).step(0.01).name('offset x')
transformFolder.add(colorTexture.offset, 'y').min(-1).max(1).step(0.01).name('offset y')
transformFolder
  .add(debug, 'rotationDegrees')
  .min(0)
  .max(360)
  .step(1)
  .onChange(value => {
    colorTexture.rotation = THREE.MathUtils.degToRad(value)
  })
transformFolder.add(colorTexture.center, 'x').min(0).max(1).step(0.01).name('center x')
transformFolder.add(colorTexture.center, 'y').min(0).max(1).step(0.01).name('center y')

const filteringFolder = gui.addFolder('Filtering')
filteringFolder.add(colorTexture, 'generateMipmaps')
filteringFolder.add(colorTexture, 'minFilter').options({
  NearestFilter: THREE.NearestFilter,
  Default: THREE.LinearMipmapLinearFilter,
})
filteringFolder.add(colorTexture, 'magFilter').options({
  NearestFilter: THREE.NearestFilter,
  Default: THREE.LinearFilter,
})

gui.onChange(() => (colorTexture.needsUpdate = true))

// const alphaTexture = textureLoader.load('/textures/door/alpha.jpg')
// const heightTexture = textureLoader.load('/textures/door/height.jpg')
// const normalTexture = textureLoader.load('/textures/door/normal.jpg')
// const ambientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg') //prettier-ignore
// const metalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
// const roughnessTexture = textureLoader.load('/textures/door/roughness.jpg')

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ map: colorTexture })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

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
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
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
const animate = () => {
  // Update controls
  controls.update()

  renderer.render(scene, camera)
}
renderer.setAnimationLoop(animate)
