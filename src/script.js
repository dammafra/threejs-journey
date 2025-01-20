import gsap from 'gsap'
import GUI from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// Debug
const gui = new GUI({
  width: 300,
  title: 'Debug UI',
  closeFolders: false,
})
// gui.close()
// gui.hide()

window.addEventListener('keydown', event => {
  if (event.key === 'h') {
    gui.show(gui._hidden)
  }
})

const debugObject = {}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Object
debugObject.color = '#ffff00'

const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2)
const material = new THREE.MeshBasicMaterial({
  color: debugObject.color,
  wireframe: true,
})
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

const cubeTweaks = gui.addFolder('Cube')
cubeTweaks.add(mesh.position, 'y').min(-3).max(3).step(0.01).name('elevation')
cubeTweaks.add(mesh, 'visible')
cubeTweaks.add(material, 'wireframe')
cubeTweaks.addColor(debugObject, 'color').onChange(value => material.color.set(value))

debugObject.spin = () => gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + Math.PI * 2 })

cubeTweaks.add(debugObject, 'spin')
// cubeTweaks.close()

debugObject.subdivion = 2
cubeTweaks
  .add(debugObject, 'subdivion')
  .min(1)
  .max(20)
  .step(1)
  .name('subdivisions')
  .onFinishChange(() => {
    mesh.geometry.dispose()
    mesh.geometry = new THREE.BoxGeometry(
      1,
      1,
      1,
      debugObject.subdivion,
      debugObject.subdivion,
      debugObject.subdivion,
    )
  })

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
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
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
