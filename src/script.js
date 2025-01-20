import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Object
// const geometry = new THREE.BoxGeometry(1, 1, 1)

// prettier-ignore
// const positionsArray = new Float32Array([
//   0, 0, 0, // First vertex
//   0, 1, 0, // Second vertex
//   1, 0, 0, // Third vertex
// ])

// const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3)

// const geometry = new THREE.BufferGeometry()
// geometry.setAttribute('position', positionsAttribute)

const geometry = new THREE.BufferGeometry()
const count = 50
const size = count * 3 * 3
const positionsArray = new Float32Array(size)
for (let i = 0; i < size; i++) {
  positionsArray[i] = (Math.random() - 0.5) * 4
}
const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3)
geometry.setAttribute('position', positionsAttribute)

const material = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  wireframe: true,
})
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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
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
const animate = () => {
  // Update controls
  controls.update()

  renderer.render(scene, camera)
}
renderer.setAnimationLoop(animate)
