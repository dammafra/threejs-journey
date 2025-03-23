import hljs from 'highlight.js/lib/core'
import glsl from 'highlight.js/lib/languages/glsl'
import 'highlight.js/styles/github-dark.min.css'
import * as THREE from 'three'
import { Pane } from 'tweakpane'
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

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Debug
const patternCount = fragmentShaders.length

let patternHash = parseInt(window.location.hash.split('#').at(1)) || 1
patternHash = patternHash < 1 || patternHash > patternCount ? 1 : patternHash

const gui = new Pane({ container: canvas.parentElement })
gui.element.classList.add('gui')

const debug = {
  pattern: patternHash,
  previous: () => {
    debug.pattern = Math.max(debug.pattern - 1, 1)
    gui.refresh()
  },
  next: () => {
    debug.pattern = Math.min(debug.pattern + 1, patternCount)
    gui.refresh()
  },
}

gui.add
const patternTweak = gui
  .addBinding(debug, 'pattern', {
    min: 1,
    max: patternCount,
    step: 1,
  })
  .on('change', () => {
    material.fragmentShader = fragmentShaders[debug.pattern - 1]
    material.needsUpdate = true

    mixColorTweak.disabled = debug.pattern <= 2
    animateTweak.disabled = debug.pattern <= 2

    updateCodeSnippet()
  })

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

const mixColorTweak = gui.addBinding(material.uniforms.uMixUVColor, 'value', { label: 'mixUVColor', disabled: debug.pattern <= 2 }) //prettier-ignore
const animateTweak = gui.addBinding(material.uniforms.uAnimate, 'value', { label: 'animate', disabled: debug.pattern <= 2 }) //prettier-ignore

// Mesh
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Sizes
const { width, height } = canvas.parentElement.getBoundingClientRect()
const sizes = { width, height }

window.addEventListener('resize', () => {
  const { width, height } = canvas.parentElement.getBoundingClientRect()

  // Update sizes
  sizes.width = width
  sizes.height = height

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100) //prettier-ignore
camera.position.set(0, 0, 1)
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor('#222222')

const clock = new THREE.Clock()

// Animate
const tick = () => {
  const elapsedTime = clock.getElapsedTime()
  material.uniforms.uTime.value = elapsedTime

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()

// Keyboard navigation
window.addEventListener('keydown', e => {
  if (patternTweak.element.contains(e.target)) return

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
    .replace(/animate(?:Sin|Cos)\(((?:[^()]+|\((?:[^()]+|\([^()]*\))*\))*)\)/g, '$1')
    .replace(/...animateTime\(\)/g, '')
    .replace(/^\s*$/gm, '')
    .replace(/\n\n}/gm, '\n}')
    .trim()

  codeElement.removeAttribute('data-highlighted')
  codeElement.textContent = code
  hljs.highlightElement(codeElement)
}

updateCodeSnippet()
