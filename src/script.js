import CANNON from 'cannon'
import GUI from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// Debug
const gui = new GUI()
const debug = {
  createSphere: () => createSphere(Math.random() * 0.5, randomPosition()),
  createBox: () => createBox(Math.random(), Math.random(), Math.random(), randomPosition()), //prettier-ignore
}

gui.add(debug, 'createSphere')
gui.add(debug, 'createBox')

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Audio
const hitSound = new Audio('/sounds/hit.mp3')

const playHitSound = collision => {
  const impactStrength = collision.contact.getImpactVelocityAlongNormal()

  if (impactStrength > 1.5) {
    hitSound.volume = Math.random()
    hitSound.currentTime = 0
    hitSound.play()
  }
}

// Textures
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

const environmentMapTexture = cubeTextureLoader.load([
  '/textures/environmentMaps/0/px.png',
  '/textures/environmentMaps/0/nx.png',
  '/textures/environmentMaps/0/py.png',
  '/textures/environmentMaps/0/ny.png',
  '/textures/environmentMaps/0/pz.png',
  '/textures/environmentMaps/0/nz.png',
])

// Physics
const world = new CANNON.World()
world.gravity.set(0, -9.82, 0)
world.broadphase = new CANNON.SAPBroadphase(world)
world.allowSleep = true

// const concreteMaterial = new CANNON.Material('concrete')
// const plasticMaterial = new CANNON.Material('plastic')

// const concretePlasticContactMaterial = new CANNON.ContactMaterial(
//   concreteMaterial,
//   plasticMaterial,
//   {
//     friction: 0.1,
//     restitution: 0.7,
//   },
// )
// world.addContactMaterial(concretePlasticContactMaterial)

const defaultMaterial = new CANNON.Material('default')
const defaultContactMaterial = new CANNON.ContactMaterial(defaultMaterial, defaultMaterial, {
  friction: 0.1,
  restitution: 0.7,
})
// world.addContactMaterial(defaultContactMaterial)
world.defaultContactMaterial = defaultContactMaterial

const floorShape = new CANNON.Plane()
const floorBody = new CANNON.Body()
// floorBody.mass = 0 // default
// floorBody.position = new CANNON.Vec3(0, 0, 0) // default
floorBody.addShape(floorShape) // you can add multiple shapes in one body
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5)
// floorBody.material = concreteMaterial
// floorBody.material = defaultMaterial
world.addBody(floorBody)

// Floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({
    color: '#777777',
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
    envMapIntensity: 0.5,
  }),
)
floor.receiveShadow = true
floor.rotation.x = -Math.PI * 0.5
scene.add(floor)

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 2.1)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = -7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = -7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

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
camera.position.set(-3, 3, 3)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Utils
const objectsToUpdate = []

const sphereGeometry = new THREE.SphereGeometry(1, 20, 20)
const boxGeometry = new THREE.BoxGeometry(1, 1, 1)

const meshesMaterial = new THREE.MeshStandardMaterial({
  metalness: 0.3,
  roughness: 0.4,
  envMap: environmentMapTexture,
})

const createSphere = (radius, position) => {
  // Threee.js mesh
  const mesh = new THREE.Mesh(sphereGeometry, meshesMaterial)
  mesh.scale.setScalar(radius)
  mesh.position.copy(position)
  mesh.castShadow = true
  scene.add(mesh)

  // Cannon.js body
  const shape = new CANNON.Sphere(radius)
  const body = new CANNON.Body({
    mass: 1,
    shape,
  })
  body.position.copy(position)
  body.addEventListener('collide', playHitSound)
  world.addBody(body)

  // Save in objects to update
  objectsToUpdate.push({ mesh, body })
}

const createBox = (width, height, depth, position) => {
  // Threee.js mesh
  const mesh = new THREE.Mesh(boxGeometry, meshesMaterial)
  mesh.scale.set(width, height, depth)
  mesh.position.copy(position)
  mesh.castShadow = true
  scene.add(mesh)

  // Cannon.js body
  const shape = new CANNON.Box(new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5)) //prettier-ignore
  const body = new CANNON.Body({
    mass: 1,
    shape,
  })
  body.position.copy(position)
  body.addEventListener('collide', playHitSound)
  world.addBody(body)

  // Save in objects to update
  objectsToUpdate.push({ mesh, body })
}

const randomPosition = () => ({
  x: (Math.random() - 0.5) * 3,
  y: 3,
  z: (Math.random() - 0.5) * 3,
})

// Animate
const clock = new THREE.Clock()
let oldElapsedTime = 0

const tick = () => {
  const elapsedTime = clock.getElapsedTime()
  const deltaTime = elapsedTime - oldElapsedTime
  oldElapsedTime = elapsedTime

  // Update physics world
  world.step(1 / 60, deltaTime, 3)

  // Update objects
  objectsToUpdate.forEach(({ mesh, body }) => {
    mesh.position.copy(body.position)
    mesh.quaternion.copy(body.quaternion)
  })

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
