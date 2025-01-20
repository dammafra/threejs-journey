import GUI from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// Debug
const gui = new GUI({ width: 300 })
const debug = {
  selectedTexture: 'door',
  rotationDegrees: 0,
  reset: () => {
    controllerValues = {}
    gui.folders.forEach(folder => folder.reset())
  },
}

let controllerValues = {}
gui.onFinishChange(({ controller, value }) => {
  controllerValues[controller._name] = value
})

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial()
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Textures
const loadingManager = new THREE.LoadingManager()
// loadingManager.onStart = () => console.log('loading started')
// loadingManager.onLoad = () => console.log('loading finished')
// loadingManager.onProgress = () => console.log('loading progressing')
// loadingManager.onError = () => console.log('loading error')

const textureLoader = new THREE.TextureLoader(loadingManager)
const colorTextureMap = {
  door: '/textures/door/color.jpg',
  checkerboard1024: '/textures/checkerboard-1024x1024.png',
  checkerboard8: '/textures/checkerboard-8x8.png',
  minecraft: '/textures/minecraft.png',
}
// const colorTexture = textureLoader.load('/textures/door/color.jpg')
// const alphaTexture = textureLoader.load('/textures/door/alpha.jpg')
// const heightTexture = textureLoader.load('/textures/door/height.jpg')
// const normalTexture = textureLoader.load('/textures/door/normal.jpg')
// const ambientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg') //prettier-ignore
// const metalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
// const roughnessTexture = textureLoader.load('/textures/door/roughness.jpg')

gui.add(debug, 'selectedTexture').options(Object.keys(colorTextureMap)).onChange(loadTexture)
gui.add(debug, 'reset').name('Reset GUI')

loadTexture(debug.selectedTexture)

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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.set(1, 1, 2)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Animate
const animate = () => {
  controls.update()
  renderer.render(scene, camera)
}
renderer.setAnimationLoop(animate)

// Helpers --------------------------------------------------------------------
function loadTexture(textureKey) {
  const texture = textureLoader.load(colorTextureMap[textureKey])
  texture.colorSpace = THREE.SRGBColorSpace

  mesh.material.dispose()
  mesh.material = new THREE.MeshBasicMaterial({ map: texture })

  destroyTextureGUI()
  setupTextureGUI(texture)
}

function destroyTextureGUI() {
  while (gui.folders.length) gui.folders[0].destroy()
}

function setupTextureGUI(texture) {
  // Transform
  const transformFolder = gui.addFolder('Transform')
  transformFolder
    .add(texture.repeat, 'x')
    .min(1)
    .max(5)
    .step(1)
    .name('repeat x')
    .setValue(controllerValues['repeat x'] || 1)
  transformFolder
    .add(texture.repeat, 'y')
    .min(1)
    .max(5)
    .step(1)
    .name('repeat y')
    .setValue(controllerValues['repeat y'] || 1)
  transformFolder
    .add(texture, 'wrapS')
    .options({
      RepeatWrapping: THREE.RepeatWrapping,
      ClampToEdgeWrapping: THREE.ClampToEdgeWrapping,
      MirroredRepeatWrapping: THREE.MirroredRepeatWrapping,
    })
    .setValue(controllerValues['wrapS'] || THREE.RepeatWrapping)
  transformFolder
    .add(texture, 'wrapT')
    .options({
      RepeatWrapping: THREE.RepeatWrapping,
      ClampToEdgeWrapping: THREE.ClampToEdgeWrapping,
      MirroredRepeatWrapping: THREE.MirroredRepeatWrapping,
    })
    .setValue(controllerValues['wrapT'] || THREE.RepeatWrapping)
  transformFolder
    .add(texture.offset, 'x')
    .min(-1)
    .max(1)
    .step(0.01)
    .name('offset x')
    .setValue(controllerValues['offset x'] || 0)
  transformFolder
    .add(texture.offset, 'y')
    .min(-1)
    .max(1)
    .step(0.01)
    .name('offset y')
    .setValue(controllerValues['offset y'] || 0)
  transformFolder
    .add(debug, 'rotationDegrees')
    .min(0)
    .max(360)
    .step(1)
    .onChange(value => (texture.rotation = THREE.MathUtils.degToRad(value)))
    .setValue(0)
    .setValue(controllerValues['rotationDegrees'] || 0)
  transformFolder
    .add(texture.center, 'x')
    .min(0)
    .max(1)
    .step(0.01)
    .name('center x')
    .setValue(controllerValues['center x'] || 0.5)
  transformFolder
    .add(texture.center, 'y')
    .min(0)
    .max(1)
    .step(0.01)
    .name('center y')
    .setValue(controllerValues['center y'] || 0.5)
  transformFolder.onChange(() => (texture.needsUpdate = true))

  // Filtering
  const filteringFolder = gui.addFolder('Filtering')
  filteringFolder
    .add(texture, 'generateMipmaps')
    .setValue(controllerValues['generateMipmaps'] || false)
  filteringFolder
    .add(texture, 'minFilter')
    .options({
      NearestFilter: THREE.NearestFilter,
      Default: THREE.LinearMipmapLinearFilter,
    })
    .setValue(controllerValues['minFilter'] || THREE.NearestFilter)
  filteringFolder
    .add(texture, 'magFilter')
    .options({
      NearestFilter: THREE.NearestFilter,
      Default: THREE.LinearFilter,
    })
    .setValue(controllerValues['magFilter'] || THREE.NearestFilter)
  filteringFolder.onChange(() => (texture.needsUpdate = true))
}
