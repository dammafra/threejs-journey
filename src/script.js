import * as THREE from 'three'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
// const geometry = new THREE.BoxGeometry(1, 1, 1)
// const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
// const mesh = new THREE.Mesh(geometry, material)
// scene.add(mesh)
const group = new THREE.Group()
scene.add(group)

const cube1 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0xff0000 }),
)
group.add(cube1)

const cube2 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
)
cube2.position.x = -2
group.add(cube2)

const cube3 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0x0000ff }),
)
cube3.position.x = 2
group.add(cube3)

// Position
// group.position.x = 0.7
// group.position.y = -0.6
// group.position.z = 1
group.position.set(0.7, -0.6, 1)
// make vector length 1
// group.position.normalize()
console.log('group position length: ', group.position.length())

// Scale
// group.scale.x = 2
// group.scale.y = 1
// group.scale.z = 0.5
group.scale.set(2, 1, 0.5)

// Rotation
group.rotation.reorder('YXZ')
group.rotation.x = Math.PI * 0.25
group.rotation.y = Math.PI * 0.25

//  Axes helper
const axesLength = 5

const axesHelper = new THREE.AxesHelper(axesLength)
// axesHelper.position.set(group.position.x, group.position.y, group.position.z)
scene.add(axesHelper)

// Sizes
const sizes = {
  width: 800,
  height: 600,
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.setZ(10)
scene.add(camera)

// Look at
camera.lookAt(group.position)

console.log('camera position length: ', camera.position.length())
console.log('group distance to camera:', group.position.distanceTo(camera.position))

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)
