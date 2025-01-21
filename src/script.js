import GUI from 'lil-gui'
import * as THREE from 'three'
import { Timer } from 'three/addons/misc/Timer.js'
import { Sky } from 'three/addons/objects/Sky.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// Debug
const gui = new GUI({ width: 300 })
gui.hide()

window.addEventListener('keydown', event => {
  if (event.key === 'h') {
    gui.show(gui._hidden)
  }
})

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Textures -----------------------------------------------------------------------------
const textureLoader = new THREE.TextureLoader()

// Floor
const floorAlphaTexture = textureLoader.load('./floor/alpha.webp')
const floorColorTexture = textureLoader.load('./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_diff_1k.webp') //prettier-ignore
const floorARMTexture = textureLoader.load('./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_arm_1k.webp') //prettier-ignore
const floorNormalTexture = textureLoader.load('./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_nor_gl_1k.webp') //prettier-ignore
const floorDisplacementTexture = textureLoader.load('./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_disp_1k.webp') //prettier-ignore

floorColorTexture.colorSpace = THREE.SRGBColorSpace

floorColorTexture.repeat.set(8, 8)
floorARMTexture.repeat.set(8, 8)
floorNormalTexture.repeat.set(8, 8)
floorDisplacementTexture.repeat.set(8, 8)

floorColorTexture.wrapS = THREE.RepeatWrapping
floorARMTexture.wrapS = THREE.RepeatWrapping
floorNormalTexture.wrapS = THREE.RepeatWrapping
floorDisplacementTexture.wrapS = THREE.RepeatWrapping

floorColorTexture.wrapT = THREE.RepeatWrapping
floorARMTexture.wrapT = THREE.RepeatWrapping
floorNormalTexture.wrapT = THREE.RepeatWrapping
floorDisplacementTexture.wrapT = THREE.RepeatWrapping

// Wall
const wallColorTexture = textureLoader.load('./wall/castle_brick_broken_06_1k/castle_brick_broken_06_diff_1k.webp') //prettier-ignore
const wallARMTexture = textureLoader.load('./wall/castle_brick_broken_06_1k/castle_brick_broken_06_arm_1k.webp') //prettier-ignore
const wallNormalTexture = textureLoader.load('./wall/castle_brick_broken_06_1k/castle_brick_broken_06_nor_gl_1k.webp') //prettier-ignore

wallColorTexture.colorSpace = THREE.SRGBColorSpace

// Roof
const roofColorTexture = textureLoader.load('./roof/roof_slates_02_1k/roof_slates_02_diff_1k.webp') //prettier-ignore
const roofARMTexture = textureLoader.load('./roof/roof_slates_02_1k/roof_slates_02_arm_1k.webp') //prettier-ignore
const roofNormalTexture = textureLoader.load('./roof/roof_slates_02_1k/roof_slates_02_nor_gl_1k.webp') //prettier-ignore

roofColorTexture.colorSpace = THREE.SRGBColorSpace

// Door
const doorAlphaTexture = textureLoader.load('./door/alpha.webp')
const doorColorTexture = textureLoader.load('./door/color.webp')
const doorAmbientOcclusionTexture = textureLoader.load('./door/ambientOcclusion.webp') //prettier-ignore
const doorRoughnessTexture = textureLoader.load('./door/roughness.webp')
const doorMetalnessTexture = textureLoader.load('./door/metalness.webp')
const doorNormalTexture = textureLoader.load('./door/normal.webp')
const doorDisplacementTexture = textureLoader.load('./door/height.webp')

doorColorTexture.colorSpace = THREE.SRGBColorSpace

// Bush
const bushColorTexture = textureLoader.load('./bush/leaves_forest_ground_1k/leaves_forest_ground_diff_1k.webp') //prettier-ignore
const bushARMTexture = textureLoader.load('./bush/leaves_forest_ground_1k/leaves_forest_ground_arm_1k.webp') //prettier-ignore
const bushNormalTexture = textureLoader.load('./bush/leaves_forest_ground_1k/leaves_forest_ground_nor_gl_1k.webp') //prettier-ignore

bushColorTexture.colorSpace = THREE.SRGBColorSpace

bushColorTexture.repeat.set(2, 1)
bushARMTexture.repeat.set(2, 1)
bushNormalTexture.repeat.set(2, 1)

bushColorTexture.wrapS = THREE.RepeatWrapping
bushARMTexture.wrapS = THREE.RepeatWrapping
bushNormalTexture.wrapS = THREE.RepeatWrapping

// Grave
const graveColorTexture = textureLoader.load('./grave/plastered_stone_wall_1k/plastered_stone_wall_diff_1k.webp') //prettier-ignore
const graveARMTexture = textureLoader.load('./grave/plastered_stone_wall_1k/plastered_stone_wall_arm_1k.webp') //prettier-ignore
const graveNormalTexture = textureLoader.load('./grave/plastered_stone_wall_1k/plastered_stone_wall_nor_gl_1k.webp') //prettier-ignore

graveColorTexture.colorSpace = THREE.SRGBColorSpace

graveColorTexture.repeat.set(0.3, 0.4)
graveARMTexture.repeat.set(0.3, 0.4)
graveNormalTexture.repeat.set(0.3, 0.4)
// --------------------------------------------------------------------------------------

// Models --------------------------------------------------------------------------------
// Floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20, 100, 100),
  new THREE.MeshStandardMaterial({
    transparent: true,
    alphaMap: floorAlphaTexture,
    map: floorColorTexture,
    aoMap: floorARMTexture,
    roughnessMap: floorARMTexture,
    metalnessMap: floorARMTexture,
    normalMap: floorNormalTexture,
    displacementMap: floorDisplacementTexture,
    displacementScale: 0.3,
    displacementBias: -0.2,
  }),
)
floor.rotation.x = -Math.PI * 0.5
scene.add(floor)

gui.add(floor.material, 'displacementScale').min(0).max(1).step(0.001).name('floorDisplacementScale') //prettier-ignore
gui.add(floor.material, 'displacementBias').min(-1).max(1).step(0.001).name('floorDisplacementBias') //prettier-ignore

// House
const house = new THREE.Group()
scene.add(house)

// Walls
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(4, 2.5, 4),
  new THREE.MeshStandardMaterial({
    map: wallColorTexture,
    aoMap: wallARMTexture,
    roughness: wallARMTexture,
    metalnessMap: wallARMTexture,
    normalMap: wallNormalTexture,
  }),
)
// walls.position.y += 1.25
walls.position.y = 1.25
house.add(walls)

// Roof
// prettier-ignore
const positionArray = new Float32Array([
  // face 1
  -1, 0, -1,  // top left
  -1, 0, 1,   // bottom left
  0, 1, 0,    // apex

  // face 2
  -1, 0, -1,  // top left
  0, 1, 0,    // apex
  1, 0, -1,   // top right

  // face 3
  1, 0, -1,   // top right 
  0, 1, 0,    // apex
  1, 0, 1,    // bottom right
  
  // face 4
  -1, 0, 1,   // bottom left 
  1, 0, 1,    // bottom right
  0, 1, 0,    // apex
])
const positionAttribute = new THREE.BufferAttribute(positionArray, 3)

// prettier-ignore
const uvArray = new Float32Array([
  // face 1
  0, 0,     // top left
  1, 0,     // bottom left
  0.5, 1,   // apex

  // face 2
  1, 0,     // top left
  0.5, 1,   // apex
  0, 0,     // top right

  // face 3
  1, 0,     // top right 
  0.5, 1,   // apex
  0, 0,     // bottom right

  // face 4
  0, 0,     // bottom left 
  1, 0,     // bottom right
  0.5, 1,   // apex
]);
const uvAttribute = new THREE.BufferAttribute(uvArray, 2)

const roofGeometry = new THREE.BufferGeometry()
roofGeometry.setAttribute('position', positionAttribute)
roofGeometry.setAttribute('uv', uvAttribute)
roofGeometry.computeVertexNormals()

const roof = new THREE.Mesh(
  roofGeometry,
  new THREE.MeshStandardMaterial({
    side: THREE.DoubleSide,
    map: roofColorTexture,
    aoMap: roofARMTexture,
    roughness: roofARMTexture,
    metalnessMap: roofARMTexture,
    normalMap: roofNormalTexture,
  }),
)

roof.scale.x = 2.5
roof.scale.z = 2.5
roof.scale.y = 1.5
roof.position.y = 2.25

house.add(roof)

// Door
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
  new THREE.MeshStandardMaterial({
    transparent: true,
    alphaMap: doorAlphaTexture,
    map: doorColorTexture,
    aoMap: doorAmbientOcclusionTexture,
    roughness: doorRoughnessTexture,
    metalnessMap: doorMetalnessTexture,
    normalMap: doorNormalTexture,
    displacementMap: doorDisplacementTexture,
    displacementScale: 0.15,
    displacementBias: -0.04,
  }),
)
door.position.y = 1
door.position.z = 2 + 0.001
house.add(door)

gui.add(door.material, 'displacementScale').min(0).max(1).step(0.001).name('doorDisplacementScale') //prettier-ignore
gui.add(door.material, 'displacementBias').min(-1).max(1).step(0.001).name('doorDisplacementBias') //prettier-ignore

// Bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial({
  color: '#ccffcc',
  map: bushColorTexture,
  aoMap: bushARMTexture,
  roughness: bushARMTexture,
  metalnessMap: bushARMTexture,
  normalMap: bushNormalTexture,
})

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
// bush1.scale.setScalar(0.5)
bush1.scale.set(0.5, 0.5, 0.5)
bush1.position.set(0.8, 0.2, 2.2)
bush1.rotation.x = -0.75

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
bush2.scale.set(0.25, 0.25, 0.25)
bush2.position.set(1.4, 0.1, 2.1)
bush2.rotation.x = -0.75

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
bush3.scale.set(0.4, 0.4, 0.4)
bush3.position.set(-0.8, 0.1, 2.2)
bush3.rotation.x = -0.75

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)
bush4.scale.set(0.15, 0.15, 0.15)
bush4.position.set(-1, 0.05, 2.6)
bush4.rotation.x = -0.75

house.add(bush1, bush2, bush3, bush4)

// Graves
const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2)
const graveMaterial = new THREE.MeshStandardMaterial({
  map: graveColorTexture,
  aoMap: graveARMTexture,
  roughness: graveARMTexture,
  metalnessMap: graveARMTexture,
  normalMap: graveNormalTexture,
})

const graves = new THREE.Group()
scene.add(graves)

for (let i = 0; i < 30; i++) {
  const angle = Math.random() * Math.PI * 2
  const radius = 3 + Math.random() * 4
  const x = Math.sin(angle) * radius
  const z = Math.cos(angle) * radius

  const grave = new THREE.Mesh(graveGeometry, graveMaterial)

  grave.position.x = x
  grave.position.y = Math.random() * 0.4
  grave.position.z = z

  grave.rotation.x = (Math.random() - 0.5) * 0.4
  grave.rotation.y = (Math.random() - 0.5) * 0.4
  grave.rotation.z = (Math.random() - 0.5) * 0.4

  graves.add(grave)
}
// --------------------------------------------------------------------------------------

// Lights -------------------------------------------------------------------------------
// Ambient light
const ambientLight = new THREE.AmbientLight('#86cdff', 0.275)
scene.add(ambientLight)

gui.add(ambientLight, 'intensity').min(0).max(3).step(0.001).name('ambientLightIntensity') //prettier-ignore

// Directional light
const directionalLight = new THREE.DirectionalLight('#86cdff', 1)
directionalLight.position.set(3, 2, -8)
scene.add(directionalLight)

gui.add(directionalLight, 'intensity').min(0).max(3).step(0.001).name('directionalLightIntensity') //prettier-ignore

// Door light
const doorLight = new THREE.PointLight('#ff7d46', 5)
doorLight.position.set(0, 2.25, 2.3)
house.add(doorLight)

gui.add(doorLight, 'intensity').min(0).max(5).step(0.001).name('doorLightIntensity') //prettier-ignore
// --------------------------------------------------------------------------------------

// Ghosts -------------------------------------------------------------------------------
const ghost1 = new THREE.PointLight('#8800ff', 6)
const ghost2 = new THREE.PointLight('#ff0088', 6)
const ghost3 = new THREE.PointLight('#ff0000', 6)
scene.add(ghost1, ghost2, ghost3)
// --------------------------------------------------------------------------------------

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
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

controls.screenSpacePanning = false

controls.minDistance = 4
controls.maxDistance = 60

controls.maxPolarAngle = Math.PI / 2 - 0.05

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Shadows ------------------------------------------------------------------------------
renderer.shadowMap.enabled = true
renderer.shadowMap.shadowMap = THREE.PCFSoftShadowMap

directionalLight.castShadow = true
ghost1.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true

walls.castShadow = true
walls.receiveShadow = true
roof.castShadow = true
floor.receiveShadow = true

for (const grave of graves.children) {
  grave.castShadow = true
  grave.receiveShadow = true
}

directionalLight.shadow.mapSize.width = 256
directionalLight.shadow.mapSize.height = 256
directionalLight.shadow.camera.top = 8
directionalLight.shadow.camera.right = 8
directionalLight.shadow.camera.bottom = -8
directionalLight.shadow.camera.left = -8
directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 20

ghost1.shadow.mapSize.width = 256
ghost1.shadow.mapSize.height = 256
ghost1.shadow.camera.far = 10

ghost2.shadow.mapSize.width = 256
ghost2.shadow.mapSize.height = 256
ghost2.shadow.camera.far = 10

ghost3.shadow.mapSize.width = 256
ghost3.shadow.mapSize.height = 256
ghost3.shadow.camera.far = 10
// --------------------------------------------------------------------------------------

// Sky ----------------------------------------------------------------------------------
const sky = new Sky()
// sky.scale.setScalar(100)
sky.scale.set(100, 100, 100)
scene.add(sky)

sky.material.uniforms['turbidity'].value = 10
sky.material.uniforms['rayleigh'].value = 3
sky.material.uniforms['mieCoefficient'].value = 0.1
sky.material.uniforms['mieDirectionalG'].value = 0.95
sky.material.uniforms['sunPosition'].value.set(0.3, -0.038, -0.95)
// --------------------------------------------------------------------------------------

// Fog ----------------------------------------------------------------------------------
// scene.fog = new THREE.Fog('#02343F', 1, 13)
scene.fog = new THREE.FogExp2('#02343F', 0.1)
// --------------------------------------------------------------------------------------

// Animate
const timer = new Timer()

const tick = () => {
  // Timer
  timer.update()
  const elapsedTime = timer.getElapsed()

  // Ghosts -----------------------------------------------------------------------------
  const ghost1Angle = elapsedTime * 0.5
  ghost1.position.x = Math.cos(ghost1Angle) * 4
  ghost1.position.z = Math.sin(ghost1Angle) * 4
  ghost1.position.y =
    Math.sin(ghost1Angle) * Math.sin(ghost1Angle * 2.34) * Math.sin(ghost1Angle * 3.45)

  const ghost2Angle = -elapsedTime * 0.38
  ghost2.position.x = Math.cos(ghost2Angle) * 5
  ghost2.position.z = Math.sin(ghost2Angle) * 5
  ghost2.position.y =
    Math.sin(ghost2Angle) * Math.sin(ghost2Angle * 2.34) * Math.sin(ghost2Angle * 3.45)

  const ghost3Angle = elapsedTime * 0.23
  ghost3.position.x = Math.cos(ghost3Angle) * 6
  ghost3.position.z = Math.sin(ghost3Angle) * 6
  ghost3.position.y =
    Math.sin(ghost3Angle) * Math.sin(ghost3Angle * 2.34) * Math.sin(ghost3Angle * 3.45)
  // ------------------------------------------------------------------------------------

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
