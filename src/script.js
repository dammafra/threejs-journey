import GUI from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import testFragmentShader from './shaders/test/fragment.glsl'
import testVertexShader from './shaders/test/vertex.glsl'

// Debug
const gui = new GUI()

const debug = {
  cycle: true,
  speed: 0.5,
}

const cycleTweak = gui.add(debug, 'cycle')
gui.add(debug, 'speed').min(0.25).max(2).step(0.25)

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Geometry
const geometry = new THREE.PlaneGeometry(1, 1, 32, 32)

// Material
const patternsCount = 50
const material = new THREE.ShaderMaterial({
  vertexShader: testVertexShader,
  fragmentShader: testFragmentShader,
  side: THREE.DoubleSide,
  uniforms: {
    uPattern: new THREE.Uniform(1),
    uMixUVColor: new THREE.Uniform(true),
    uAnimate: new THREE.Uniform(true),
    uTime: new THREE.Uniform(0),
  },
})

const patternTweak = gui.add(material.uniforms.uPattern, 'value').min(1).max(patternsCount).step(1).name('pattern') //prettier-ignore
gui.add(material.uniforms.uMixUVColor, 'value').name('mixUVColor')
gui.add(material.uniforms.uAnimate, 'value').name('animate')

// Mesh
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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100) //prettier-ignore
camera.position.set(0.25, -0.25, 1)
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

const clock = new THREE.Clock()
let lastElapsed = 0

cycleTweak.onChange(value => {
  if (value) {
    clock.start()
    clock.elapsedTime = lastElapsed
  } else {
    clock.stop()
    lastElapsed = clock.elapsedTime
  }
})

// Animate
const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  material.uniforms.uTime.value = elapsedTime

  if (debug.cycle) {
    material.uniforms.uPattern.value = Math.floor((elapsedTime * debug.speed) % patternsCount) + 1
    patternTweak.updateDisplay()
  }

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
