import gsap from 'gsap'
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

// Overlay
const overlayGeometry = new THREE.PlaneGeometry(2, 2, 1, 1)
const overlayMaterial = new THREE.ShaderMaterial({
  transparent: true,
  uniforms: { uAlpha: new THREE.Uniform(1) },
  vertexShader: 'void main() { gl_Position = vec4(position, 1.0); }',
  fragmentShader: 'uniform float uAlpha; void main() { gl_FragColor = vec4(0.102, 0.059,  0.059, uAlpha); }', // prettier-ignore
})
const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial)
scene.add(overlay)

// Loading Manager
const loadingBarElement = document.querySelector('.loading-bar')
const loadingManager = new THREE.LoadingManager(
  () => {
    window.setTimeout(() => {
      gsap.to(overlayMaterial.uniforms.uAlpha, {
        duration: 3,
        value: 0,
        delay: 1,
        onStart: () => {
          overlayMaterial.depthWrite = false
          controls.autoRotate = true
        },
        onComplete: () => {
          overlayGeometry.dispose()
          overlayMaterial.dispose()
          scene.remove(overlay)
        },
      })

      loadingBarElement.classList.add('ended')
      loadingBarElement.style.transform = ''
    }, 500)
  },

  (_, loaded, total) => {
    const progressRatio = loaded / total
    loadingBarElement.style.transform = `scaleX(${progressRatio})`
  },
)

// Texture loader
const textureLoader = new THREE.TextureLoader(loadingManager)

// GLTF loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('draco/')
const gltfLoader = new GLTFLoader(loadingManager)
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

// Realtime Light
const shadowPlane = new THREE.Mesh(
  new THREE.CircleGeometry(0.175, 10),
  new THREE.MeshStandardMaterial({
    transparent: true,
    opacity: 0.1,
    roughness: 1,
    metalness: 0,
    color: 'black',
  }),
)
shadowPlane.rotation.x = -Math.PI * 0.5
shadowPlane.rotation.z = Math.PI * 0.5
shadowPlane.position.set(1.315, -0.3195, 0.86)
shadowPlane.receiveShadow = true
scene.add(shadowPlane)

const directionalLight = new THREE.DirectionalLight('#ffffff', 100)
directionalLight.position.set(1, 0, 0)
directionalLight.target.position.copy(shadowPlane.position)
directionalLight.castShadow = true
directionalLight.shadow.camera.left = -0.25
directionalLight.shadow.camera.right = 0.25
directionalLight.shadow.camera.top = 0.25
directionalLight.shadow.camera.bottom = -0.25
directionalLight.shadow.camera.near = 0.8
directionalLight.shadow.camera.far = 1.25
scene.add(directionalLight, directionalLight.target)

// Model
gltfLoader.load('portal.glb', gltf => {
  gltf.scene.position.y = -0.5
  scene.add(gltf.scene)

  const bakedMesh = gltf.scene.children.find(child => child.name === 'baked')
  const axeMesh = gltf.scene.children.find(child => child.name === 'axe')
  const poleLightAMesh = gltf.scene.children.find(child => child.name === 'poleLightA')
  const poleLightBMesh = gltf.scene.children.find(child => child.name === 'poleLightB')
  const portalLightMesh = gltf.scene.children.find(child => child.name === 'portalLight')

  bakedMesh.material = bakedMaterial
  axeMesh.material = bakedMaterial
  poleLightAMesh.material = poleLightMaterial
  poleLightBMesh.material = poleLightMaterial
  portalLightMesh.material = portalLightMaterial

  axeMesh.castShadow = true
  bakedMesh.receiveShadow = true
  directionalLight.shadow.needsUpdate = true

  // prettier-ignore
  gsap
    .timeline({ repeat: -1, repeatDelay: 0.5 })
    .to(axeMesh.position, { y: '+=0.25', ease: 'back.out' })
    .to(axeMesh.rotation, { x: '+=0.5', y: '-=0.8', z: '+=0.5', ease: 'back.out' }, '<=')
    .to(axeMesh.position, { y: '-=0.25', duration: 0.25, delay: 0.25, ease: 'back.in' })
    .to(axeMesh.rotation, { x: '-=0.5', y: '+=0.8', z: '-=0.5', duration: 0.25, ease: 'back.in' }, '<=')
})

// Fireflies
const firefliesGeometry = new THREE.BufferGeometry()
const firefliesCount = 30
const positionArray = new Float32Array(firefliesCount * 3)
const scaleArray = new Float32Array(firefliesCount)

for (let i = 0; i < firefliesCount; i++) {
  positionArray[i * 3 + 0] = (Math.random() - 0.5) * 4
  positionArray[i * 3 + 1] = Math.random() * 1.5 - 0.6
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
controls.autoRotateSpeed = 0.25

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
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
