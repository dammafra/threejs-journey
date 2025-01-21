import GUI from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

// Debug
const gui = new GUI({ width: 300 })

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Textures
const textureLoader = new THREE.TextureLoader()
const bakedShadow = textureLoader.load('/textures/bakedShadow.jpg')
const simpleShadow = textureLoader.load('/textures/simpleShadow.jpg')
bakedShadow.colorSpace = THREE.SRGBColorSpace
simpleShadow.colorSpace = THREE.SRGBColorSpace

// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
scene.add(ambientLight)

const folder1 = gui.addFolder('Ambient light').close()
folder1.add(ambientLight, 'intensity').min(0).max(3).step(0.001)

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3)
directionalLight.position.set(2, 2, -1)

directionalLight.castShadow = true
// console.log(directionalLight.shadow)
directionalLight.shadow.mapSize.x = 1024
directionalLight.shadow.mapSize.y = 1024

directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 6

directionalLight.shadow.camera.top = 2
directionalLight.shadow.camera.right = 2
directionalLight.shadow.camera.bottom = -2
directionalLight.shadow.camera.left = -2

// doesn't work with PCFSoftShadowMap type
// directionalLight.shadow.radius = 10

scene.add(directionalLight)

const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera) //prettier-ignore
directionalLightCameraHelper.visible = false
scene.add(directionalLightCameraHelper)

const folder2 = gui.addFolder('Directional light').close()
folder2.add(directionalLight, 'intensity').min(0).max(3).step(0.001)
folder2.add(directionalLight.position, 'x').min(-5).max(5).step(0.001)
folder2.add(directionalLight.position, 'y').min(-5).max(5).step(0.001)
folder2.add(directionalLight.position, 'z').min(-5).max(5).step(0.001)
folder2.add(directionalLightCameraHelper, 'visible').name('shadow camera helper')

// Spot Light
const spotLight = new THREE.SpotLight(0xffffff, 2.6, 10, Math.PI * 0.3)
spotLight.castShadow = true
spotLight.position.set(0, 2, 2)

spotLight.shadow.mapSize.width = 1024
spotLight.shadow.mapSize.height = 1024

spotLight.shadow.camera.near = 1
spotLight.shadow.camera.far = 5

// spotLight.shadow.camera.fov = 30

scene.add(spotLight)
scene.add(spotLight.target)

const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera)
spotLightCameraHelper.visible = false
scene.add(spotLightCameraHelper)

const folder3 = gui.addFolder('Spot light').close()
folder3.add(spotLight, 'intensity').min(0).max(4).step(0.001)
folder3.add(spotLight.position, 'x').min(-5).max(5).step(0.001)
folder3.add(spotLight.position, 'y').min(-5).max(5).step(0.001)
folder3.add(spotLight.position, 'z').min(-5).max(5).step(0.001)
folder3.add(spotLightCameraHelper, 'visible').name('shadow camera helper')

// Point Light
const pointLight = new THREE.PointLight(0xffffff, 2.7)
pointLight.castShadow = true
pointLight.position.set(-1, 1, 0)
scene.add(pointLight)

pointLight.shadow.mapSize.width = 1024
pointLight.shadow.mapSize.height = 1024

pointLight.shadow.camera.near = 0.1
pointLight.shadow.camera.far = 6

const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera)
pointLightCameraHelper.visible = false
scene.add(pointLightCameraHelper)

const folder4 = gui.addFolder('Point light').close()
folder4.add(pointLight, 'intensity').min(0).max(4).step(0.001)
folder4.add(pointLight.position, 'x').min(-5).max(5).step(0.001)
folder4.add(pointLight.position, 'y').min(-5).max(5).step(0.001)
folder4.add(pointLight.position, 'z').min(-5).max(5).step(0.001)
folder4.add(pointLightCameraHelper, 'visible').name('helper')

// Materials
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.7

const folder5 = gui.addFolder('Material').close()
folder5.add(material, 'metalness').min(0).max(1).step(0.001)
folder5.add(material, 'roughness').min(0).max(1).step(0.001)

// Objects
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material)
sphere.castShadow = true

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material)
plane.rotation.x = -Math.PI * 0.5
plane.position.y = -0.5
plane.receiveShadow = true

const sphereShadow = new THREE.Mesh(
  new THREE.PlaneGeometry(1.5, 1.5),
  new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    alphaMap: simpleShadow,
  }),
)
sphereShadow.rotation.x = -Math.PI * 0.5
sphereShadow.position.y = plane.position.y + 0.01

scene.add(sphere, plane, sphereShadow)

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
renderer.shadowMap.enabled = false
renderer.shadowMap.type = THREE.PCFSoftShadowMap

// Animate
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update the sphere
  sphere.position.x = Math.cos(elapsedTime) * 1.5
  sphere.position.z = Math.sin(elapsedTime) * 1.5
  sphere.position.y = Math.abs(Math.sin(elapsedTime * 3))

  // Update the sphere shadow
  sphereShadow.position.x = sphere.position.x
  sphereShadow.position.z = sphere.position.z
  sphereShadow.material.opacity = 1 - sphere.position.y * 0.5
  sphereShadow.scale.x = 1 - sphere.position.y * 0.5
  sphereShadow.scale.y = 1 - sphere.position.y * 0.5

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
