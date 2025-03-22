import hljs from 'highlight.js/lib/core'
import glsl from 'highlight.js/lib/languages/glsl'
import 'highlight.js/styles/github-dark.min.css'
import GUI from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import animateFragment from './shaders/includes/animate.glsl'
import perlinNoiseFragment from './shaders/includes/classic-perlin-noise-2D.glsl'
import mixUvColorsFragment from './shaders/includes/mix-uv-colors.glsl'
import utilsFragment from './shaders/includes/utils.glsl'
import vertexShader from './shaders/pattern/vertex.glsl'

hljs.registerLanguage('glsl', glsl)

// Fragment shaders
const modules = import.meta.glob('./shaders/pattern/fragment/*.glsl', { eager: true })
const fragmentShaders = Object.keys(modules)
  .sort((a, b) => parseInt(a.match(/(\d+)/)[0]) - parseInt(b.match(/(\d+)/)[0]))
  .map(path => modules[path].default)

// Debug
const patternCount = fragmentShaders.length

let patternHash = parseInt(window.location.hash.split('#').at(1)) || fragmentShaders.length
patternHash = patternHash < 1 || patternHash > patternCount ? 1 : patternHash

const gui = new GUI()
const debug = {
  pattern: patternHash,
  previous: () => previousPattern(),
  next: () => nextPattern(),
}

const patternTweak = gui
  .add(debug, 'pattern')
  .min(1)
  .max(patternCount)
  .step(1)
  .onChange(pattern => {
    material.fragmentShader = fragmentShaders[debug.pattern - 1]
    material.needsUpdate = true

    mixColorTweak.show(pattern > 2)
    animateTweak.show(pattern > 2)

    updateCodeSnippet()
  })

const previousPattern = () => {
  patternTweak.setValue(Math.max(debug.pattern - 1, 1))
}

const nextPattern = () => {
  patternTweak.setValue(Math.min(debug.pattern + 1, patternCount))
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
  vertexShader: vertexShader,
  fragmentShader: fragmentShaders[debug.pattern - 1],
  side: THREE.DoubleSide,
  uniforms: {
    uMixUVColor: new THREE.Uniform(false),
    uAnimate: new THREE.Uniform(false),
    uTime: new THREE.Uniform(0),
  },
})

const mixColorTweak = gui.add(material.uniforms.uMixUVColor, 'value').name('mixUVColor').show(debug.pattern > 2) //prettier-ignore
const animateTweak = gui.add(material.uniforms.uAnimate, 'value').name('animate').show(debug.pattern > 2) //prettier-ignore

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

// Keyboard navigation
window.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') debug.next()
  else if (e.key === 'ArrowLeft') debug.previous()
})

// Code snippet
const codeElement = document.querySelector('.glsl')
const updateCodeSnippet = () => {
  const code = fragmentShaders[debug.pattern - 1]
    .replace(animateFragment, '')
    .replace(mixUvColorsFragment, '')
    .replace(perlinNoiseFragment, '')
    .replace(utilsFragment, '')
    .replace(/#define.*/g, '')
    .replace(/uniform.*/g, '')
    .replace(/animate.*\((.*?)\)/g, '$1')
    .replace(/\n\n\n/g, '\n') // TODO: improve
    .trim()

  codeElement.removeAttribute('data-highlighted')
  codeElement.textContent = code
  hljs.highlightElement(codeElement)
}

updateCodeSnippet()
