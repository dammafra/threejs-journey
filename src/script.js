import GUI from 'lil-gui'
import * as THREE from 'three'
import { Timer } from 'three/addons/misc/Timer.js'
import { Sky } from 'three/addons/objects/Sky.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// Debug
const gui = new GUI({ width: 300 })
const debug = window.location.hash === '#debug'
gui.show(debug)
window.addEventListener('keydown', event => {
  if (event.key === 'h') {
    window.location.hash = debug ? '' : '#debug'
    window.location.reload()
  }
})

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Helpers
const gridHelper = new THREE.GridHelper(20, 20)
gridHelper.visible = debug
gridHelper.position.y = 0.05
scene.add(gridHelper)
gui.add(gridHelper, 'visible').name('gridHelper')

const axesHelper = new THREE.AxesHelper(10)
axesHelper.visible = debug
axesHelper.position.y = 0.051
scene.add(axesHelper)
gui.add(axesHelper, 'visible').name('axesHelper')

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

wallColorTexture.repeat.set(4, 4)
wallARMTexture.repeat.set(4, 4)
wallNormalTexture.repeat.set(4, 4)

wallColorTexture.wrapS = THREE.RepeatWrapping
wallARMTexture.wrapS = THREE.RepeatWrapping
wallNormalTexture.wrapS = THREE.RepeatWrapping

wallColorTexture.wrapT = THREE.RepeatWrapping
wallARMTexture.wrapT = THREE.RepeatWrapping
wallNormalTexture.wrapT = THREE.RepeatWrapping

// Top
const topAlphaTexture = textureLoader.load('./top/Glass_Window_004_SD/Glass_Window_004_opacity.jpg') //prettier-ignore
const topColorTexture = textureLoader.load('./top/Glass_Window_004_SD/Glass_Window_004_basecolor.jpg') //prettier-ignore
const topAmbientOcclusionTexture = textureLoader.load('./top/Glass_Window_004_SD/Glass_Window_004_ambientOcclusion.jpg') //prettier-ignore
const topRoughnessTexture = textureLoader.load('./top/Glass_Window_004_SD/Glass_Window_004_roughness.jpg') //prettier-ignore
const topMetalnessTexture = textureLoader.load('./top/Glass_Window_004_SD/Glass_Window_004_metallic.jpg') //prettier-ignore
const topNormalTexture = textureLoader.load('./top/Glass_Window_004_SD/Glass_Window_004_normal.jpg') //prettier-ignore
const topDisplacementTexture = textureLoader.load('./top/Glass_Window_004_SD/Glass_Window_004_height.png') //prettier-ignore

topColorTexture.colorSpace = THREE.SRGBColorSpace

topAlphaTexture.repeat.set(4, 4)
topColorTexture.repeat.set(4, 4)
topAmbientOcclusionTexture.repeat.set(4, 4)
topRoughnessTexture.repeat.set(4, 4)
topMetalnessTexture.repeat.set(4, 4)
topNormalTexture.repeat.set(4, 4)
topDisplacementTexture.repeat.set(4, 4)

topAlphaTexture.wrapS = THREE.RepeatWrapping
topColorTexture.wrapS = THREE.RepeatWrapping
topAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping
topRoughnessTexture.wrapS = THREE.RepeatWrapping
topRoughnessTexture.wrapS = THREE.RepeatWrapping
topNormalTexture.wrapS = THREE.RepeatWrapping
topDisplacementTexture.wrapS = THREE.RepeatWrapping

topAlphaTexture.wrapT = THREE.RepeatWrapping
topColorTexture.wrapT = THREE.RepeatWrapping
topAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping
topRoughnessTexture.wrapT = THREE.RepeatWrapping
topRoughnessTexture.wrapT = THREE.RepeatWrapping
topNormalTexture.wrapT = THREE.RepeatWrapping
topDisplacementTexture.wrapT = THREE.RepeatWrapping

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

// Path
const pathAlphaTexture = textureLoader.load('./path/alpha.webp')
const pathColorTexture = textureLoader.load('./path/Stone_Path_006_SD/Stone_Path_006_basecolor.webp') //prettier-ignore
const pathAmbientOcclusionTexture = textureLoader.load('./path/Stone_Path_006_SD/Stone_Path_006_ambientOcclusion.webp') //prettier-ignore
const pathRoughnessTexture = textureLoader.load('./path/Stone_Path_006_SD/Stone_Path_006_roughness.webp') //prettier-ignore
const pathNormalTexture = textureLoader.load('./path/Stone_Path_006_SD/Stone_Path_006_normal.webp') //prettier-ignore

pathColorTexture.colorSpace = THREE.SRGBColorSpace

pathColorTexture.repeat.set(12, 12)
pathAmbientOcclusionTexture.repeat.set(12, 12)
pathRoughnessTexture.repeat.set(12, 12)
pathNormalTexture.repeat.set(12, 12)

pathColorTexture.wrapS = THREE.RepeatWrapping
pathAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping
pathRoughnessTexture.wrapS = THREE.RepeatWrapping
pathNormalTexture.wrapS = THREE.RepeatWrapping

pathColorTexture.wrapT = THREE.RepeatWrapping
pathAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping
pathRoughnessTexture.wrapT = THREE.RepeatWrapping
pathNormalTexture.wrapT = THREE.RepeatWrapping

// Window
// const windowAlphaTexture = textureLoader.load('./window/Wood_Window_001_SD/Wood_Window_001_opacity.webp') //prettier-ignore
// const windowColorTexture = textureLoader.load('./window/Wood_Window_001_SD/Wood_Window_001_basecolor.webp') //prettier-ignore
// const windowAmbientOcclusionTexture = textureLoader.load('./window/Wood_Window_001_SD/Wood_Window_001_ambientOcclusion.webp') //prettier-ignore
// const windowRoughnessTexture = textureLoader.load('./window/Wood_Window_001_SD/Wood_Window_001_roughness.webp') //prettier-ignore
// const windowMetalnessTexture = textureLoader.load('./window/Wood_Window_001_SD/Wood_Window_001_metallic.webp') //prettier-ignore
// const windowNormalTexture = textureLoader.load('./window/Wood_Window_001_SD/Wood_Window_001_normal.webp') //prettier-ignore
// const windowDisplacementTexture = textureLoader.load('./window/Wood_Window_001_SD/Wood_Window_001_height.webp') //prettier-ignore

// windowColorTexture.colorSpace = THREE.SRGBColorSpace

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
    transparent: !debug,
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

// Lighthouse
const lightHouse = new THREE.Group()
scene.add(lightHouse)

// Walls
const walls = new THREE.Mesh(
  new THREE.CylinderGeometry(1, 2, 10, 32, 1),
  new THREE.MeshStandardMaterial({
    side: THREE.DoubleSide,
    map: wallColorTexture,
    aoMap: wallARMTexture,
    roughness: wallARMTexture,
    metalnessMap: wallARMTexture,
    normalMap: wallNormalTexture,
  }),
)
walls.position.y = 10 * 0.5
lightHouse.add(walls)

// Top
const top = new THREE.Mesh(
  new THREE.CapsuleGeometry(1.1, 0.5, 100, 100),
  new THREE.MeshPhysicalMaterial({
    transparent: true,
    alphaMap: topAlphaTexture,
    map: topColorTexture,
    aoMap: topAmbientOcclusionTexture,
    roughness: topRoughnessTexture,
    metalnessMap: topMetalnessTexture,
    normalMap: topNormalTexture,
    displacementMap: topDisplacementTexture,
    displacementScale: 0.03,
    transmission: 1,
    thickness: 10,
    ior: 1.52,
  }),
)
top.position.y = 10.7
lightHouse.add(top)

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

roof.scale.x = 1.5
roof.scale.z = 1.5
roof.position.y = 11.3
lightHouse.add(roof)

// Door
const door = new THREE.Mesh(
  new THREE.CylinderGeometry(1.8, 2, 2.2, 32, 100, true, -Math.PI * 0.15, Math.PI * 0.3),
  new THREE.MeshStandardMaterial({
    transparent: true,
    alphaMap: doorAlphaTexture,
    map: doorColorTexture,
    aoMap: doorAmbientOcclusionTexture,
    roughness: doorRoughnessTexture,
    metalnessMap: doorMetalnessTexture,
    normalMap: doorNormalTexture,
    displacementMap: doorDisplacementTexture,
    displacementScale: -0.003,
  }),
)
door.position.y = 1
door.position.z = 0.01
lightHouse.add(door)

gui.add(door.material, 'displacementScale').min(0).max(1).step(0.001).name('doorDisplacementScale') //prettier-ignore
gui.add(door.material, 'displacementBias').min(-1).max(1).step(0.001).name('doorDisplacementBias') //prettier-ignore

// Path
const path = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20, 100, 100),
  new THREE.MeshStandardMaterial({
    transparent: true,
    alphaMap: pathAlphaTexture,
    map: pathColorTexture,
    aoMap: pathAmbientOcclusionTexture,
    roughnessMap: pathRoughnessTexture,
    normalMap: pathNormalTexture,
    displacementMap: floorDisplacementTexture,
    displacementScale: 0.3,
    displacementBias: -0.2,
  }),
)
path.rotation.x = -Math.PI * 0.5
scene.add(path)

// Window
// const _window = new THREE.Mesh(
//   new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
//   new THREE.MeshStandardMaterial({
//     transparent: false,
//     alphaMap: windowAlphaTexture,
//     map: windowColorTexture,
//     aoMap: windowAmbientOcclusionTexture,
//     roughness: windowRoughnessTexture,
//     metalnessMap: windowMetalnessTexture,
//     normalMap: windowNormalTexture,
//     displacementMap: windowDisplacementTexture,
//     displacementScale: 0.05,
//   }),
// )
// _window.scale.setScalar(0.5)
// _window.rotation.y = Math.PI * 0.5
// _window.position.y = 1.5
// _window.position.x = 2 + 0.001
// lightHouse.add(_window)

// gui.add(_window.material, 'displacementScale').min(0).max(1).step(0.001).name('windowDisplacementScale') //prettier-ignore
// gui.add(_window.material, 'displacementBias').min(-1).max(1).step(0.001).name('windowDisplacementBias') //prettier-ignore

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
bush1.scale.set(0.5, 0.5, 0.5) // or bush1.scale.setScalar(0.5)
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

lightHouse.add(bush1, bush2, bush3, bush4)

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

for (let i = 0; i < 40; i++) {
  const angle = Math.PI * (0.2 + Math.random() * 1.6)
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
const ambientLight = new THREE.AmbientLight('#86cdff', debug ? 3 : 0.275)
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
lightHouse.add(doorLight)

gui.add(doorLight, 'intensity').min(0).max(5).step(0.001).name('doorLightIntensity') //prettier-ignore

// Beacon light
const beacon = new THREE.Mesh(
  new THREE.ConeGeometry(2, 20, 32, 1, true),
  new THREE.MeshToonMaterial({
    side: THREE.DoubleSide,
    color: '#ffffff',
  }),
)
beacon.position.y = 10.5
beacon.rotation.x = Math.PI * 0.5
lightHouse.add(beacon)

const beaconLight = new THREE.SpotLight('#ffffff', 1000, 30, 0.2)
beaconLight.position.y = 10.5
beaconLight.target = beacon
scene.add(beaconLight)

const beaconLightHelper = new THREE.SpotLightHelper(beaconLight)
beaconLightHelper.visible = debug
scene.add(beaconLightHelper)

gui.add(beaconLightHelper, 'visible').name('beaconLightHelper')
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
camera.position.y = 8
camera.position.z = 12
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.autoRotate = !debug
controls.autoRotateSpeed = 0.5
controls.enableDamping = true
controls.target.set(walls.position.x, walls.position.y, walls.position.z)

window.addEventListener('keydown', event => {
  if (event.key === 'Alt') {
    controls.screenSpacePanning = true
  }
})

window.addEventListener('keyup', event => {
  if (event.key === 'Alt') {
    controls.screenSpacePanning = false
  }
})

if (!debug) {
  controls.minDistance = 4
  controls.maxDistance = 60

  controls.maxPolarAngle = Math.PI / 2 - 0.05
}

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
beaconLight.castShadow = true
ghost1.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true

walls.castShadow = true
walls.receiveShadow = true
top.castShadow = true
roof.castShadow = true
floor.receiveShadow = true
path.receiveShadow = true

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

gui.add(renderer.shadowMap, 'enabled').name('shadows')
// --------------------------------------------------------------------------------------

// Sky ----------------------------------------------------------------------------------
const sky = new Sky()
sky.scale.set(100, 100, 100) // or sky.scale.setScalar(100)
sky.visible = !debug
sky.material.uniforms['turbidity'].value = 10
sky.material.uniforms['rayleigh'].value = 3
sky.material.uniforms['mieCoefficient'].value = 0.1
sky.material.uniforms['mieDirectionalG'].value = 0.95
sky.material.uniforms['sunPosition'].value.set(0.3, -0.038, -0.95)
scene.add(sky)

gui.add(sky, 'visible').name('sky')
// --------------------------------------------------------------------------------------

// Fog ----------------------------------------------------------------------------------
// scene.fog = new THREE.Fog('#02343F', 1, 13)
scene.fog = new THREE.FogExp2('#02343F', debug ? 0 : 0.05)
gui.add(scene.fog, 'density').min(0).max(1).step(0.001).name('fogDensity')
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

  // Door light flicker
  doorLight.intensity = Math.random() > 0.98 ? 5 : Math.sin(elapsedTime) > 0 ? 5 : 0

  // Beacon rotation
  beacon.position.x = Math.cos(elapsedTime * -0.25) * 10
  beacon.position.z = Math.sin(elapsedTime * -0.25) * 10
  beacon.rotation.z = elapsedTime * -0.25 + Math.PI * 0.5
  beaconLightHelper.update()

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
