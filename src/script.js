import GUI from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import waterFragmentShader from './shaders/water/fragment.glsl'
import waterVertexShader from './shaders/water/vertex.glsl'

// Debug
const gui = new GUI({ width: 340 })

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Water
const waterGeometry = new THREE.PlaneGeometry(2, 2, 128, 128)
const waterMaterial = new THREE.ShaderMaterial({
  vertexShader: waterVertexShader,
  fragmentShader: waterFragmentShader,
  uniforms: {
    uTime: new THREE.Uniform(0),
    uWavesElevation: new THREE.Uniform(0.2),
    uWavesFrequency: new THREE.Uniform(new THREE.Vector2(4, 1.5)),
    uWavesSpeed: new THREE.Uniform(0.75),
  },
})

gui.add(waterMaterial.uniforms.uWavesElevation, 'value').min(0).max(1).step(0.001).name('uWavesElevation') //prettier-ignore
gui.add(waterMaterial.uniforms.uWavesFrequency.value, 'x').min(0).max(10).step(0.001).name('uWavesFrequencyX') //prettier-ignore
gui.add(waterMaterial.uniforms.uWavesFrequency.value, 'y').min(0).max(10).step(0.001).name('uWavesFrequencyZ') //prettier-ignore
gui.add(waterMaterial.uniforms.uWavesSpeed, 'value').min(0).max(4).step(0.001).name('uWavesSpeed') //prettier-ignore

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
