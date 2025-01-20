import gsap from 'gsap'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Textures
const textureLoader = new THREE.TextureLoader()
const matcapTexture1 = textureLoader.load('textures/matcaps/1.png')
const matcapTexture2 = textureLoader.load('textures/matcaps/2.png')
const matcapTexture3 = textureLoader.load('textures/matcaps/3.png')
const matcapTexture4 = textureLoader.load('textures/matcaps/4.png')
const matcapTexture5 = textureLoader.load('textures/matcaps/5.png')
const matcapTexture6 = textureLoader.load('textures/matcaps/6.png')
const matcapTexture7 = textureLoader.load('textures/matcaps/7.png')
const matcapTexture8 = textureLoader.load('textures/matcaps/8.png')

matcapTexture1.colorSpace = THREE.SRGBColorSpace
matcapTexture2.colorSpace = THREE.SRGBColorSpace
matcapTexture3.colorSpace = THREE.SRGBColorSpace
matcapTexture4.colorSpace = THREE.SRGBColorSpace
matcapTexture5.colorSpace = THREE.SRGBColorSpace
matcapTexture6.colorSpace = THREE.SRGBColorSpace
matcapTexture7.colorSpace = THREE.SRGBColorSpace
matcapTexture8.colorSpace = THREE.SRGBColorSpace

// Objects
const material1 = new THREE.MeshMatcapMaterial({ matcap: matcapTexture1 })
const material2 = new THREE.MeshMatcapMaterial({ matcap: matcapTexture2 })
const material3 = new THREE.MeshMatcapMaterial({ matcap: matcapTexture3 })
const material4 = new THREE.MeshMatcapMaterial({ matcap: matcapTexture4 })
const material5 = new THREE.MeshMatcapMaterial({ matcap: matcapTexture5 })
const material6 = new THREE.MeshMatcapMaterial({ matcap: matcapTexture6 })
const material7 = new THREE.MeshMatcapMaterial({ matcap: matcapTexture7 })
const material8 = new THREE.MeshMatcapMaterial({ matcap: matcapTexture8 })
const materials = [
  material1,
  material2,
  material3,
  material4,
  material5,
  material6,
  material7,
  material8,
]

const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 32, 64)
const donuts = Array(1000)
  .fill(true)
  .map((_, index) => {
    const donut = new THREE.Mesh(donutGeometry, materials[index % 8])

    donut.position.x = (Math.random() - 0.5) * 100
    donut.position.y = (Math.random() - 0.5) * 100
    donut.position.z = (Math.random() - 0.5) * 100

    donut.rotation.x = Math.random() * Math.PI
    donut.rotation.y = Math.random() * Math.PI

    const scale = Math.random()
    donut.scale.set(scale, scale, scale)

    return donut
  })
scene.add(...donuts)

// Fonts
const fontLoader = new FontLoader()

fontLoader.load('/fonts/helvetiker_regular.typeface.json', font => {
  // Text
  const textGeometry = new TextGeometry('Hello Three.js', {
    font: font,
    size: 0.5,
    depth: 0.2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5,
  })

  textGeometry.center()

  const text = new THREE.Mesh(textGeometry, materials[Math.floor((Math.random() + 1) * 4)])

  scene.add(text)
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
camera.position.x = -1
camera.position.y = -1
camera.position.z = 500
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
const clock = new THREE.Clock()

donuts.forEach(donut => {
  gsap.to(donut.position, {
    duration: 30,
    repeat: -1,
    yoyo: true,
    ease: 'power1.inOut',
    x: (Math.random() - 0.5) * 100,
    y: (Math.random() - 0.5) * 100,
    z: (Math.random() - 0.5) * 100,
  })

  gsap.to(donut.rotation, {
    duration: 30,
    repeat: -1,
    yoyo: true,
    ease: 'power1.inOut',
    x: Math.random() * Math.PI,
    y: Math.random() * Math.PI,
  })
})

gsap.to(camera.position, { z: 3, duration: 1, ease: 'circ.inOut' })

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
