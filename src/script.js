import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Sizes
const sizes = {
  width: 800,
  height: 600,
}

// Scene
const scene = new THREE.Scene()

// Object
const mesh = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1, 5, 5, 5),
  new THREE.MeshBasicMaterial({ color: 0xff0000 }),
)
scene.add(mesh)

// Camera
const camera = new THREE.PerspectiveCamera(
  75, // field of view
  sizes.width / sizes.height, // aspect ratio
  0.1, // near clipping plane
  100, // far clipping plane
)

// const aspectRatio = sizes.width / sizes.height
// const camera = new THREE.OrthographicCamera(
//   -1 * aspectRatio,
//   1 * aspectRatio,
//   1,
//   -1,
//   0.1,
//   100,
// )

// camera.position.x = 2
// camera.position.y = 2
camera.position.z = 3
camera.lookAt(mesh.position)
scene.add(camera)

// Cursor
// const cursor = {
//   x: 0,
//   y: 0,
// }

// document.addEventListener('mousemove', event => {
//   cursor.x = event.clientX / sizes.width - 0.5
//   cursor.y = -(event.clientY / sizes.height - 0.5)
// })

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
// controls.target.y = 2
// controls.update()

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
})
renderer.setSize(sizes.width, sizes.height)

// Animate
const animate = () => {
  // Update objects
  // mesh.rotation.y += 0.01

  // Update camera
  // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3
  // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3
  // camera.position.y = cursor.y * 10
  // camera.lookAt(mesh.position)

  controls.update()

  renderer.render(scene, camera)
}
renderer.setAnimationLoop(animate)
