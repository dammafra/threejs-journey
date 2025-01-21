import GUI from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 1)
scene.add(ambientLight)

const folder1 = gui.addFolder('Ambient light')
folder1.add(ambientLight, 'intensity').min(0).max(3).step(0.001)

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5)
directionalLight.position.set(2, 2, -1)
scene.add(directionalLight)

const folder2 = gui.addFolder('Directional light')
folder2.add(directionalLight, 'intensity').min(0).max(3).step(0.001)
folder2.add(directionalLight.position, 'x').min(-5).max(5).step(0.001)
folder2.add(directionalLight.position, 'y').min(-5).max(5).step(0.001)
folder2.add(directionalLight.position, 'z').min(-5).max(5).step(0.001)

// Materials
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.7

const folder3 = gui.addFolder('Material')
folder3.add(material, 'metalness').min(0).max(1).step(0.001)
folder3.add(material, 'roughness').min(0).max(1).step(0.001)

// Objects
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material)

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material)
plane.rotation.x = -Math.PI * 0.5
plane.position.y = -0.5

scene.add(sphere, plane)

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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.near = 0.1
camera.far = 100
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Animate
// const clock = new THREE.Clock()

const tick = () => {
  // const elapsedTime = clock.getElapsedTime()

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
