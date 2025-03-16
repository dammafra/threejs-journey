import gsap from 'gsap'
import GUI from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import fireworkFragmentShader from './shaders/firework/fragment.glsl'
import fireworkVertexShader from './shaders/firework/vertex.glsl'

// Debug
const gui = new GUI({ width: 340 })

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Loaders
const textureLoader = new THREE.TextureLoader()

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
  resolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
  pixelRatio: Math.min(window.devicePixelRatio, 2),
}

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight
  sizes.resolution.set(window.innerWidth, window.innerHeight)
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
camera.position.set(1.5, 0, 6)
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

// Fireworks
const textures = [
  textureLoader.load('./particles/1.png'),
  textureLoader.load('./particles/2.png'),
  textureLoader.load('./particles/3.png'),
  textureLoader.load('./particles/4.png'),
  textureLoader.load('./particles/5.png'),
  textureLoader.load('./particles/6.png'),
  textureLoader.load('./particles/7.png'),
  textureLoader.load('./particles/8.png'),
]

const createFirework = ({ radius, count, position, size, texture, color }) => {
  texture.flipY = false

  // Geometry
  const positionsArray = new Float32Array(count * 3)
  const sizesArray = new Float32Array(count)
  const timeMultipliersArray = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    const i3 = i * 3

    const spherical = new THREE.Spherical(
      radius * (0.75 + Math.random() * 0.25),
      Math.random() * Math.PI,
      Math.random() * Math.PI * 2,
    )

    const position = new THREE.Vector3()
    position.setFromSpherical(spherical)

    positionsArray[i3 + 0] = position.x
    positionsArray[i3 + 1] = position.y
    positionsArray[i3 + 2] = position.z

    sizesArray[i] = Math.random()
    timeMultipliersArray[i] = 1 + Math.random()
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positionsArray, 3))
  geometry.setAttribute('aSize', new THREE.Float32BufferAttribute(sizesArray, 1))
  geometry.setAttribute('aTimeMultiplier', new THREE.Float32BufferAttribute(timeMultipliersArray, 1)) //prettier-ignore

  // Material
  const material = new THREE.ShaderMaterial({
    vertexShader: fireworkVertexShader,
    fragmentShader: fireworkFragmentShader,
    uniforms: {
      uSize: new THREE.Uniform(size),
      uResolution: new THREE.Uniform(sizes.resolution),
      uPixelRatio: new THREE.Uniform(sizes.pixelRatio),
      uTexture: new THREE.Uniform(texture),
      uColor: new THREE.Uniform(color),
      uProgress: new THREE.Uniform(0),
    },

    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })

  // Points
  const firework = new THREE.Points(geometry, material)
  firework.position.copy(position)
  scene.add(firework)

  // Destroy
  const destroy = () => {
    scene.remove(firework)
    geometry.dispose()
    material.dispose()
  }

  // Animate
  gsap.to(material.uniforms.uProgress, {
    value: 1,
    duration: 3,
    ease: 'linear',
    onComplete: destroy,
  })
}

createFirework({
  radius: 1,
  count: 100,
  position: new THREE.Vector3(),
  size: 0.5,
  texture: textures[7],
  color: new THREE.Color('#8affff'),
})

window.addEventListener('click', () => {
  createFirework({
    radius: 1,
    count: 100,
    position: new THREE.Vector3(),
    size: 0.5,
    texture: textures[7],
    color: new THREE.Color('#8affff'),
  })
})

// Animate
const tick = () => {
  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
