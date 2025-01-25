import GUI from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import testFragmentShader from './shaders/test/fragment.glsl'
import testVertexShader from './shaders/test/vertex.glsl'

// Debug
const gui = new GUI()
const debug = {
  patternCount: 50,
  pattern: 1,
  previous: () => previousPattern(),
  next: () => nextPattern(),
}

const patternTweak = gui
  .add(debug, 'pattern')
  .min(1)
  .max(debug.patternCount)
  .step(1)
  .onChange(pattern => {
    material.uniforms.uPattern.value = pattern

    mixColorTweak.show(pattern > 2)
    animateTweak.show(pattern > 2)
  })

const previousPattern = () => {
  patternTweak.setValue(Math.max(debug.pattern - 1, 1))
}

const nextPattern = () => {
  patternTweak.setValue(Math.min(debug.pattern + 1, debug.patternCount))
}

gui.add(debug, 'previous')
gui.add(debug, 'next')

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Geometry
const geometry = new THREE.PlaneGeometry(1, 1, 32, 32)

// Material
const material = new THREE.ShaderMaterial({
  vertexShader: testVertexShader,
  fragmentShader: testFragmentShader,
  side: THREE.DoubleSide,
  uniforms: {
    uPattern: new THREE.Uniform(debug.pattern),
    uMixUVColor: new THREE.Uniform(true),
    uAnimate: new THREE.Uniform(true),
    uTime: new THREE.Uniform(0),
  },
})

const mixColorTweak = gui.add(material.uniforms.uMixUVColor, 'value').name('mixUVColor').hide()
const animateTweak = gui.add(material.uniforms.uAnimate, 'value').name('animate').hide()

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

// Animate
const tick = () => {
  const elapsedTime = clock.getElapsedTime()
  material.uniforms.uTime.value = elapsedTime

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
