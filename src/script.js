import GUI from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import atmosphereFragmentShader from './shaders/atmosphere/fragment.glsl'
import atmosphereVertexShader from './shaders/atmosphere/vertex.glsl'
import earthFragmentShader from './shaders/earth/fragment.glsl'
import earthVertexShader from './shaders/earth/vertex.glsl'

// Debug
const gui = new GUI({ width: 350 })
gui.close()

const debug = {
  atmosphereDayColor: '#00aaff',
  atmosphereTwilightColor: '#ff6600',
}

gui
  .addColor(debug, 'atmosphereDayColor')
  .name('atmosphere day color')
  .onChange(() => {
    earthMaterial.uniforms.uAtmosphereDayColor.value.set(debug.atmosphereDayColor)
    atmosphereMaterial.uniforms.uAtmosphereDayColor.value.set(debug.atmosphereDayColor)
  })
gui
  .addColor(debug, 'atmosphereTwilightColor')
  .name('atmosphere twilight color')
  .onChange(() => {
    earthMaterial.uniforms.uAtmosphereTwilightColor.value.set(debug.atmosphereTwilightColor)
    atmosphereMaterial.uniforms.uAtmosphereTwilightColor.value.set(debug.atmosphereTwilightColor)
  })

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Loaders
const textureLoader = new THREE.TextureLoader()

// Environment map
const isLowEndDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) || navigator.deviceMemory <= 4
const milkyWayTexture = textureLoader.load(`./milky-way-${isLowEndDevice ? 4 : 8}k.png`)
milkyWayTexture.mapping = THREE.EquirectangularReflectionMapping
milkyWayTexture.colorSpace = THREE.SRGBColorSpace
scene.background = milkyWayTexture

// Sun
const sunSpherical = new THREE.Spherical(1, Math.PI * 0.5, 0.5)
const sunDirection = new THREE.Vector3()

const debugSun = new THREE.Mesh(
  new THREE.IcosahedronGeometry(0.1, 2),
  new THREE.MeshBasicMaterial(),
)
scene.add(debugSun)

const updateSun = () => {
  sunDirection.setFromSpherical(sunSpherical)
  debugSun.position.copy(sunDirection).multiplyScalar(5)
}

updateSun()

gui.add(sunSpherical, 'phi').min(0).max(Math.PI).name('sun phi').onChange(updateSun)
gui.add(sunSpherical, 'theta').min(-Math.PI).max(Math.PI).name('sun theta').onChange(updateSun)

// Earth
const earthDayTexture = textureLoader.load('./earth/day.jpg')
earthDayTexture.colorSpace = THREE.SRGBColorSpace

const earthNightTexture = textureLoader.load('./earth/night.jpg')
earthNightTexture.colorSpace = THREE.SRGBColorSpace

const earthSpecularCloudsTexture = textureLoader.load('./earth/specularClouds.jpg')

const earthGeometry = new THREE.SphereGeometry(2, 64, 64)
const earthMaterial = new THREE.ShaderMaterial({
  vertexShader: earthVertexShader,
  fragmentShader: earthFragmentShader,
  uniforms: {
    uDayTexture: new THREE.Uniform(earthDayTexture),
    uNightTexture: new THREE.Uniform(earthNightTexture),
    uSpecularCloudsTexture: new THREE.Uniform(earthSpecularCloudsTexture),
    uSunDirection: new THREE.Uniform(sunDirection),
    uAtmosphereDayColor: new THREE.Uniform(new THREE.Color(debug.atmosphereDayColor)),
    uAtmosphereTwilightColor: new THREE.Uniform(new THREE.Color(debug.atmosphereTwilightColor)),
  },
})
const earth = new THREE.Mesh(earthGeometry, earthMaterial)
scene.add(earth)

// Atmosphere
const atmosphereMaterial = new THREE.ShaderMaterial({
  vertexShader: atmosphereVertexShader,
  fragmentShader: atmosphereFragmentShader,
  uniforms: {
    uSunDirection: new THREE.Uniform(sunDirection),
    uAtmosphereDayColor: new THREE.Uniform(new THREE.Color(debug.atmosphereDayColor)),
    uAtmosphereTwilightColor: new THREE.Uniform(new THREE.Color(debug.atmosphereTwilightColor)),
  },
  side: THREE.BackSide,
  transparent: true,
})
const atmosphere = new THREE.Mesh(earthGeometry, atmosphereMaterial)
atmosphere.scale.setScalar(1.04)
scene.add(atmosphere)

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

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(sizes.pixelRatio)
})

// Camera
const camera = new THREE.PerspectiveCamera(25, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 12
camera.position.y = 5
camera.position.z = 4

if (camera.aspect < 1) {
  camera.position.x *= 2
  camera.position.z *= 2
}

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
renderer.setClearColor('#000011')

const maxAnisotropy = renderer.capabilities.getMaxAnisotropy()
const anisotropy = Math.min(8, maxAnisotropy)
earthDayTexture.anisotropy = anisotropy
earthNightTexture.anisotropy = anisotropy
earthSpecularCloudsTexture.anisotropy = anisotropy

// Animate
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  earth.rotation.y = elapsedTime * 0.1

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
