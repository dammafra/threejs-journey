import GUI from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import waterFragmentShader from './shaders/water/fragment.glsl'
import waterVertexShader from './shaders/water/vertex.glsl'

// Debug
const gui = new GUI({ width: 340 })
const debug = {
  depthColor: '#ff4000',
  surfaceColor: '#151c37',
}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Helper
const axesHelper = new THREE.AxesHelper()
axesHelper.position.y += 0.25
scene.add(axesHelper)

// Water
const waterGeometry = new THREE.PlaneGeometry(2, 2, 512, 512)
const waterMaterial = new THREE.ShaderMaterial({
  vertexShader: waterVertexShader,
  fragmentShader: waterFragmentShader,
  uniforms: {
    uTime: new THREE.Uniform(0),

    uWavesElevation: new THREE.Uniform(0.2),
    uWavesFrequency: new THREE.Uniform(new THREE.Vector2(4, 1.5)),
    uWavesSpeed: new THREE.Uniform(0.75),

    uNoiseElevation: new THREE.Uniform(0.15),
    uNoiseFrequency: new THREE.Uniform(3),
    uNoiseSpeed: new THREE.Uniform(0.2),
    uNoiseIterations: new THREE.Uniform(4),

    uDepthColor: new THREE.Uniform(new THREE.Color(debug.depthColor)),
    uSurfaceColor: new THREE.Uniform(new THREE.Color(debug.surfaceColor)),
    uColorOffset: new THREE.Uniform(0.925),
    uColorMultiplier: new THREE.Uniform(1),
  },
})

const bigWaves = gui.addFolder('big waves')
bigWaves.add(waterMaterial.uniforms.uWavesElevation, 'value').min(0).max(1).step(0.001).name('elevation') //prettier-ignore
bigWaves.add(waterMaterial.uniforms.uWavesFrequency.value, 'x').min(0).max(10).step(0.001).name('frequency X') //prettier-ignore
bigWaves.add(waterMaterial.uniforms.uWavesFrequency.value, 'y').min(0).max(10).step(0.001).name('frequency Z') //prettier-ignore
bigWaves.add(waterMaterial.uniforms.uWavesSpeed, 'value').min(0).max(4).step(0.001).name('speed') //prettier-ignore

const smallWaves = gui.addFolder('small waves')
smallWaves.add(waterMaterial.uniforms.uNoiseElevation, 'value').min(0).max(1).step(0.001).name('elevation') //prettier-ignore
smallWaves.add(waterMaterial.uniforms.uNoiseFrequency, 'value').min(0).max(30).step(0.001).name('frequency') //prettier-ignore
smallWaves.add(waterMaterial.uniforms.uNoiseSpeed, 'value').min(0).max(4).step(0.001).name('speed') //prettier-ignore
smallWaves.add(waterMaterial.uniforms.uNoiseIterations, 'value').min(0).max(5).step(1).name('iterations') //prettier-ignore

const colors = gui.addFolder('colors')
colors.addColor(debug, 'depthColor').onChange(value => {waterMaterial.uniforms.uDepthColor.value.set(value)}) // prettier-ignore
colors.addColor(debug, 'surfaceColor').onChange(value => {waterMaterial.uniforms.uSurfaceColor.value.set(value)}) // prettier-ignore
colors.add(waterMaterial.uniforms.uColorOffset, 'value').min(0).max(1).step(0.001).name('uColorOffset') //prettier-ignore
colors.add(waterMaterial.uniforms.uColorMultiplier, 'value').min(0).max(10).step(0.001).name('uColorMultiplier') //prettier-ignore

const water = new THREE.Mesh(waterGeometry, waterMaterial)
water.rotation.x = -Math.PI * 0.5
scene.add(water)

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
camera.position.set(1, 1, 1)
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
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update water
  waterMaterial.uniforms.uTime.value = elapsedTime

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
