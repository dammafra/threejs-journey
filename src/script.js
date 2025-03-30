import gsap from 'gsap'
import GUI from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import particlesFragmentShader from './shaders/particles/fragment.glsl'
import particlesVertexShader from './shaders/particles/vertex.glsl'

// Debug
const gui = new GUI({ width: 340 })
const debugObject = {}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Loaders
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('./draco/')
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

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

  // Materials
  if (particles) {
    particles.material.uniforms.uResolution.value.set(
      sizes.width * sizes.pixelRatio,
      sizes.height * sizes.pixelRatio,
    )
  }

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(sizes.pixelRatio)
})

// Camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 0, 8 * 2)
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

debugObject.clearColor = '#160920'
gui.addColor(debugObject, 'clearColor').onChange(() => {
  renderer.setClearColor(debugObject.clearColor)
})
renderer.setClearColor(debugObject.clearColor)

// Models
let particles = null

gltfLoader.load('./models.glb', gltf => {
  // Particles
  particles = {}
  particles.index = 0

  // Positions
  const positions = gltf.scene.children.map(child => child.geometry.attributes.position)

  particles.maxCount = Math.max(...positions.map(position => position.count))

  particles.positions = positions.map(position => {
    const originalArray = position.array
    const newArray = new Float32Array(particles.maxCount * 3)
    newArray.set(originalArray)

    for (let i = position.count; i < particles.maxCount; i++) {
      const i3 = i * 3
      const randomIndex = Math.floor(position.count * Math.random()) * 3

      newArray[i3 + 0] = originalArray[randomIndex + 0]
      newArray[i3 + 1] = originalArray[randomIndex + 1]
      newArray[i3 + 2] = originalArray[randomIndex + 2]
    }

    return new THREE.Float32BufferAttribute(newArray, 3)
  })

  // Sizes
  const sizesArray = new Float32Array(particles.maxCount)
  for (let i = 0; i < particles.maxCount; i++) {
    sizesArray[i] = Math.random()
  }

  // Geometry
  particles.geometry = new THREE.BufferGeometry()
  particles.geometry.setAttribute('position', particles.positions.at(particles.index))
  particles.geometry.setAttribute('aSize', new THREE.Float32BufferAttribute(sizesArray, 1))

  // Material
  particles.colorA = '#ff7300'
  particles.colorB = '#0091ff'

  particles.material = new THREE.ShaderMaterial({
    vertexShader: particlesVertexShader,
    fragmentShader: particlesFragmentShader,
    uniforms: {
      uSize: new THREE.Uniform(0.4),
      uResolution: new THREE.Uniform(new THREE.Vector2(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio)), //prettier-ignore
      uProgress: new THREE.Uniform(0),
      uColorA: new THREE.Uniform(new THREE.Color(particles.colorA)),
      uColorB: new THREE.Uniform(new THREE.Color(particles.colorB)),
    },
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  })

  // Points
  particles.points = new THREE.Points(particles.geometry, particles.material)
  particles.points.frustumCulled = false
  scene.add(particles.points)

  // Tweaks
  gui.addColor(particles, 'colorA').onChange(() => particles.material.uniforms.uColorA.value.set(particles.colorA)) //prettier-ignore
  gui.addColor(particles, 'colorB').onChange(() => particles.material.uniforms.uColorB.value.set(particles.colorB)) //prettier-ignore
  gui.add(particles.material.uniforms.uProgress, 'value').min(0).max(1).step(0.001).name('uProgress').listen() //prettier-ignore

  particles.morph = index => {
    particles.geometry.setAttribute('position', particles.positions.at(particles.index))
    particles.geometry.setAttribute('aPositionTarget', particles.positions.at(index))
    gsap.fromTo(
      particles.material.uniforms.uProgress,
      { value: 0 },
      { value: 1, duration: 3, ease: 'linear' },
    )
    particles.index = index
  }

  particles.morph0 = () => particles.morph(0)
  particles.morph1 = () => particles.morph(1)
  particles.morph2 = () => particles.morph(2)
  particles.morph3 = () => particles.morph(3)

  gui.add(particles, 'morph0')
  gui.add(particles, 'morph1')
  gui.add(particles, 'morph2')
  gui.add(particles, 'morph3')
})

// Animate
const tick = () => {
  // Update controls
  controls.update()

  // Render normal scene
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
