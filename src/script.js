import GUI from 'lil-gui'
import * as THREE from 'three'
import { DragControls } from 'three/addons/controls/DragControls.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import shadingFragmentShader from './shaders/shading/fragment.glsl'
import shadingVertexShader from './shaders/shading/vertex.glsl'

// Debug
const gui = new GUI()
gui.close()

const debug = {
  ambientLight: {
    color: new THREE.Color('#ffffff'),
    intensity: 0.03,
  },
  directionalLight: {
    color: new THREE.Color('#5959ff'),
    intensity: 1,
    specularPower: 20,
  },
  pointLight1: {
    color: new THREE.Color('#ff5959'),
    intensity: 1,
    specularPower: 20,
    decay: 0.25,
  },
  pointLight2: {
    color: new THREE.Color('#59ffbc'),
    intensity: 1,
    specularPower: 20,
    decay: 0.25,
  },
}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Loaders
const gltfLoader = new GLTFLoader()

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

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(sizes.pixelRatio)
})

// Camera
const camera = new THREE.PerspectiveCamera(25, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 7
camera.position.y = 7
camera.position.z = 7
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
})
// renderer.toneMapping = THREE.ACESFilmicToneMapping
// renderer.toneMappingExposure = 3
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(sizes.pixelRatio)

// Material
const materialParameters = {}
materialParameters.color = '#ffffff'

const material = new THREE.ShaderMaterial({
  vertexShader: shadingVertexShader,
  fragmentShader: shadingFragmentShader,
  uniforms: {
    uColor: new THREE.Uniform(new THREE.Color(materialParameters.color)),

    uAmbientLightColor: new THREE.Uniform(debug.ambientLight.color),
    uAmbientLightIntensity: new THREE.Uniform(debug.ambientLight.intensity),

    uDirectionalLightPosition: new THREE.Uniform(new THREE.Vector3(0, 0, 3)),
    uDirectionalLightColor: new THREE.Uniform(debug.directionalLight.color),
    uDirectionalLightIntensity: new THREE.Uniform(debug.directionalLight.intensity),
    uDirectionalLightSpecularPower: new THREE.Uniform(debug.directionalLight.specularPower),

    uPointLight1Position: new THREE.Uniform(new THREE.Vector3(0, 2.5, 0)),
    uPointLight1Color: new THREE.Uniform(debug.pointLight1.color),
    uPointLight1Intensity: new THREE.Uniform(debug.pointLight1.intensity),
    uPointLight1SpecularPower: new THREE.Uniform(debug.pointLight1.specularPower),
    uPointLight1Decay: new THREE.Uniform(debug.pointLight1.decay),

    uPointLight2Position: new THREE.Uniform(new THREE.Vector3(2, 2, 2)),
    uPointLight2Color: new THREE.Uniform(debug.pointLight2.color),
    uPointLight2Intensity: new THREE.Uniform(debug.pointLight2.intensity),
    uPointLight2SpecularPower: new THREE.Uniform(debug.pointLight2.specularPower),
    uPointLight2Decay: new THREE.Uniform(debug.pointLight2.decay),
  },
})

gui
  .addColor(materialParameters, 'color')
  .name('base color')
  .onChange(() => material.uniforms.uColor.value.set(materialParameters.color))

// Objects
// Torus knot
const torusKnot = new THREE.Mesh(new THREE.TorusKnotGeometry(0.6, 0.25, 128, 32), material)
torusKnot.position.x = 3
scene.add(torusKnot)

// Sphere
const sphere = new THREE.Mesh(new THREE.SphereGeometry(), material)
sphere.position.x = -3
scene.add(sphere)

// Suzanne
let suzanne = null
gltfLoader.load('./suzanne.glb', gltf => {
  suzanne = gltf.scene
  suzanne.traverse(child => {
    if (child.isMesh) child.material = material
  })
  scene.add(suzanne)
})

// Light helpers
const ambientLightFolder = gui.addFolder('ambient light')
ambientLightFolder.addColor(debug.ambientLight, 'color')
ambientLightFolder.add(debug.ambientLight, 'intensity').min(0).max(10).step(0.01)
ambientLightFolder.onChange(() => {
  material.uniforms.uAmbientLightColor.value.set(debug.ambientLight.color)
  material.uniforms.uAmbientLightIntensity.value = debug.ambientLight.intensity
})

const directionalLightHelper = new THREE.Mesh(
  new THREE.PlaneGeometry(),
  new THREE.MeshBasicMaterial(),
)
directionalLightHelper.material.color.set(debug.directionalLight.color)
directionalLightHelper.material.side = THREE.DoubleSide
directionalLightHelper.position.copy(material.uniforms.uDirectionalLightPosition.value)
scene.add(directionalLightHelper)

const directionalLightFolder = gui.addFolder('directional light')
directionalLightFolder.addColor(debug.directionalLight, 'color')
directionalLightFolder.add(debug.directionalLight, 'intensity').min(0).max(10).step(0.01)
directionalLightFolder.add(debug.directionalLight, 'specularPower').min(0).max(50)
directionalLightFolder.onChange(() => {
  directionalLightHelper.material.color.set(debug.directionalLight.color)
  material.uniforms.uDirectionalLightColor.value.set(debug.directionalLight.color)
  material.uniforms.uDirectionalLightIntensity.value = debug.directionalLight.intensity
  material.uniforms.uDirectionalLightSpecularPower.value = debug.directionalLight.specularPower
})

const pointLight1Helper = new THREE.Mesh(
  new THREE.IcosahedronGeometry(0.1, 2),
  new THREE.MeshBasicMaterial(),
)
pointLight1Helper.material.color.set(debug.pointLight1.color)
pointLight1Helper.position.copy(material.uniforms.uPointLight1Position.value)
scene.add(pointLight1Helper)

const pointLight1Folder = gui.addFolder('point light 1')
pointLight1Folder.addColor(debug.pointLight1, 'color')
pointLight1Folder.add(debug.pointLight1, 'intensity').min(0).max(10).step(0.01)
pointLight1Folder.add(debug.pointLight1, 'specularPower').min(0).max(50)
pointLight1Folder.add(debug.pointLight1, 'decay').min(0).max(10).step(0.01)
pointLight1Folder.onChange(() => {
  pointLight1Helper.material.color.set(debug.pointLight1.color)
  material.uniforms.uPointLight1Color.value.set(debug.pointLight1.color)
  material.uniforms.uPointLight1Intensity.value = debug.pointLight1.intensity
  material.uniforms.uPointLight1SpecularPower.value = debug.pointLight1.specularPower
  material.uniforms.uPointLight1Decay.value = debug.pointLight1.decay
})

const pointLight2Helper = new THREE.Mesh(
  new THREE.IcosahedronGeometry(0.1, 2),
  new THREE.MeshBasicMaterial(),
)
pointLight2Helper.material.color.set(debug.pointLight2.color)
pointLight2Helper.position.copy(material.uniforms.uPointLight2Position.value)
scene.add(pointLight2Helper)

const pointLight2Folder = gui.addFolder('point light 2')
pointLight2Folder.addColor(debug.pointLight2, 'color')
pointLight2Folder.add(debug.pointLight2, 'intensity').min(0).max(10).step(0.01)
pointLight2Folder.add(debug.pointLight2, 'specularPower').min(0).max(50)
pointLight2Folder.add(debug.pointLight2, 'decay').min(0).max(10).step(0.01)
pointLight2Folder.onChange(() => {
  pointLight2Helper.material.color.set(debug.pointLight2.color)
  material.uniforms.uPointLight2Color.value.set(debug.pointLight2.color)
  material.uniforms.uPointLight2Intensity.value = debug.pointLight2.intensity
  material.uniforms.uPointLight2SpecularPower.value = debug.pointLight2.specularPower
  material.uniforms.uPointLight2Decay.value = debug.pointLight2.decay
})

// Drag
const drag = new DragControls(
  [directionalLightHelper, pointLight1Helper, pointLight2Helper],
  camera,
  canvas,
)
drag.addEventListener('hoveron', () => canvas.classList.add('grab'))
drag.addEventListener('hoveroff', () => canvas.classList.remove('grab'))
drag.addEventListener('dragstart', () => {
  controls.enabled = false
  canvas.classList.add('grabbing')
})
drag.addEventListener('dragend', () => {
  controls.enabled = true
  canvas.classList.remove('grabbing')
})
drag.addEventListener('drag', () => {
  directionalLightHelper.lookAt(new THREE.Vector3(0, 0, 0))
  material.uniforms.uDirectionalLightPosition.value.copy(directionalLightHelper.position)
  material.uniforms.uPointLight1Position.value.copy(pointLight1Helper.position)
  material.uniforms.uPointLight2Position.value.copy(pointLight2Helper.position)
})

// Animate
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Rotate objects
  if (suzanne) {
    suzanne.rotation.x = -elapsedTime * 0.1
    suzanne.rotation.y = elapsedTime * 0.2
  }

  sphere.rotation.x = -elapsedTime * 0.1
  sphere.rotation.y = elapsedTime * 0.2

  torusKnot.rotation.x = -elapsedTime * 0.1
  torusKnot.rotation.y = elapsedTime * 0.2

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
