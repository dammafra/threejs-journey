import GUI from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import firefliesFragmentShader from './shaders/fireflies/fragment.glsl'
import firefliesVertexShader from './shaders/fireflies/vertex.glsl'
import portalFragmentShader from './shaders/portal/fragment.glsl'
import portalVertexShader from './shaders/portal/vertex.glsl'

// Debug
const debug = {}

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
const poleLightMaterial = new THREE.MeshBasicMaterial({ color: 0xffffe5 })

debug.portalColorStart = '#24acf0'
debug.portalColorEnd = '#ffffff'

gui.addColor(debug, 'portalColorStart').onChange(c => portalLightMaterial.uniforms.uColorStart.value.set(c)) // prettier-ignore
gui.addColor(debug, 'portalColorEnd').onChange(c => portalLightMaterial.uniforms.uColorEnd.value.set(c)) // prettier-ignore

const portalLightMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uTime: new THREE.Uniform(0),
    uColorStart: new THREE.Uniform(new THREE.Color(debug.portalColorStart)),
    uColorEnd: new THREE.Uniform(new THREE.Color(debug.portalColorEnd)),
  },
  vertexShader: portalVertexShader,
  fragmentShader: portalFragmentShader,
  side: THREE.DoubleSide,
})

// Model
gltfLoader.load('portal.glb', gltf => {
  const bakedMesh = gltf.scene.children.find(child => child.name === 'baked')
  const poleLightAMesh = gltf.scene.children.find(child => child.name === 'poleLightA')
  const poleLightBMesh = gltf.scene.children.find(child => child.name === 'poleLightB')
  const portalLightMesh = gltf.scene.children.find(child => child.name === 'portalLight')

  bakedMesh.material = bakedMaterial
  poleLightAMesh.material = poleLightMaterial
  poleLightBMesh.material = poleLightMaterial
  portalLightMesh.material = portalLightMaterial

  gltf.scene.position.y = -0.5
  scene.add(gltf.scene)
})

// Fireflies
const firefliesGeometry = new THREE.BufferGeometry()
const firefliesCount = 30
const positionArray = new Float32Array(firefliesCount * 3)
const scaleArray = new Float32Array(firefliesCount)

for (let i = 0; i < firefliesCount; i++) {
  positionArray[i * 3 + 0] = (Math.random() - 0.5) * 4
  positionArray[i * 3 + 1] = Math.random() * 1.5 - 0.5
  positionArray[i * 3 + 2] = (Math.random() - 0.5) * 4

  scaleArray[i] = Math.random()
}

firefliesGeometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3))
firefliesGeometry.setAttribute('aScale', new THREE.BufferAttribute(scaleArray, 1))

const firefliesMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uTime: new THREE.Uniform(0),
    uPixelRatio: new THREE.Uniform(Math.min(window.devicePixelRatio, 2)),
    uSize: new THREE.Uniform(100),
  },
  vertexShader: firefliesVertexShader,
  fragmentShader: firefliesFragmentShader,
  blending: THREE.AdditiveBlending,
  transparent: true,
  depthWrite: false,
})

gui.add(firefliesMaterial.uniforms.uSize, 'value').min(0).max(500).step(1).name('firefliesSize')

const fireflies = new THREE.Points(firefliesGeometry, firefliesMaterial)
scene.add(fireflies)

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

  // Update fireflies
  firefliesMaterial.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2)
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
controls.enablePan = false
controls.minDistance = 3
controls.maxDistance = 10
controls.maxPolarAngle = Math.PI * 0.45
controls.autoRotate = true
controls.autoRotateSpeed = 0.25

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

debug.clearColor = '#1a0f0f'
renderer.setClearColor(debug.clearColor)
gui.addColor(debug, 'clearColor').onChange(renderer.setClearColor)

// Animate
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update materials
  firefliesMaterial.uniforms.uTime.value = elapsedTime
  portalLightMaterial.uniforms.uTime.value = elapsedTime

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
