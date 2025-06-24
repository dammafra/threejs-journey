import GUI from 'lil-gui'
import * as THREE from 'three'
import {
  DotScreenPass,
  EffectComposer,
  GammaCorrectionShader,
  GlitchPass,
  OrbitControls,
  RenderPass,
  RGBShiftShader,
  ShaderPass,
  SMAAPass,
  UnrealBloomPass,
} from 'three/examples/jsm/Addons.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Loaders
const gltfLoader = new GLTFLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()
const textureLoader = new THREE.TextureLoader()

// Update all materials
const updateAllMaterials = () => {
  scene.traverse(child => {
    if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
      child.material.envMapIntensity = 2.5
      child.material.needsUpdate = true
      child.castShadow = true
      child.receiveShadow = true
    }
  })
}

// Environment map
const environmentMap = cubeTextureLoader.load([
  '/textures/environmentMaps/0/px.jpg',
  '/textures/environmentMaps/0/nx.jpg',
  '/textures/environmentMaps/0/py.jpg',
  '/textures/environmentMaps/0/ny.jpg',
  '/textures/environmentMaps/0/pz.jpg',
  '/textures/environmentMaps/0/nz.jpg',
])

scene.background = environmentMap
scene.environment = environmentMap

// Models
gltfLoader.load('/models/DamagedHelmet/glTF/DamagedHelmet.gltf', gltf => {
  gltf.scene.scale.set(2, 2, 2)
  gltf.scene.rotation.y = Math.PI * 0.5
  scene.add(gltf.scene)

  updateAllMaterials()
})

// Lights
const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.normalBias = 0.05
directionalLight.position.set(0.25, 3, -2.25)
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

  // Update effect composer
  effectComposer.setSize(sizes.width, sizes.height)
  effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(4, 1, -4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap
renderer.toneMapping = THREE.ReinhardToneMapping
renderer.toneMappingExposure = 1.5
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Post-processing --------------------------------------------------------------------------------
const renderTarget = new THREE.WebGLRenderTarget(800, 600, {
  samples: renderer.getPixelRatio() === 1 ? 2 : 0,
})

const effectComposer = new EffectComposer(renderer, renderTarget)
effectComposer.setSize(sizes.width, sizes.height)
effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const renderPass = new RenderPass(scene, camera)
effectComposer.addPass(renderPass)

const dotScreenPass = new DotScreenPass()
dotScreenPass.enabled = false
effectComposer.addPass(dotScreenPass)

const glitchPass = new GlitchPass()
// glitchPass.goWild = true
glitchPass.enabled = false
effectComposer.addPass(glitchPass)

const rgbShiftPass = new ShaderPass(RGBShiftShader)
rgbShiftPass.enabled = false
effectComposer.addPass(rgbShiftPass)

const unrealBloomPass = new UnrealBloomPass()
rgbShiftPass.enabled = false
unrealBloomPass.strength = 0.3
unrealBloomPass.radius = 1
unrealBloomPass.threshold = 0.6
effectComposer.addPass(unrealBloomPass)

gui.add(unrealBloomPass, 'enabled').name('unreal bloom')
gui.add(unrealBloomPass, 'strength', 0, 2, 0.001).name('unreal bloom strength')
gui.add(unrealBloomPass, 'radius', 0, 2, 0.001).name('unreal bloom radius')
gui.add(unrealBloomPass, 'threshold', 0, 1, 0.001).name('unreal bloom threshold')

// Custom passes ---
const TintShader = {
  uniforms: {
    tDiffuse: new THREE.Uniform(null),
    uTint: new THREE.Uniform(new THREE.Vector3()),
  },
  vertexShader: `
    varying vec2 vUv;

    // this positions the plane in front of the camera
    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

      vUv = uv;
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform vec3 uTint;

    varying vec2 vUv;

    void main() {
      vec4 color = texture2D(tDiffuse, vUv);
      color.rgb += uTint;

      gl_FragColor = color;
    }
  `,
}
const tintPass = new ShaderPass(TintShader)
effectComposer.addPass(tintPass)

gui.add(tintPass.material.uniforms.uTint.value, 'x', -1, 1, 0.001).name('tint R')
gui.add(tintPass.material.uniforms.uTint.value, 'y', -1, 1, 0.001).name('tint G')
gui.add(tintPass.material.uniforms.uTint.value, 'z', -1, 1, 0.001).name('tint B')

const DisplacementShader = {
  uniforms: {
    tDiffuse: new THREE.Uniform(null),
    uTime: new THREE.Uniform(0),
  },
  vertexShader: `
    varying vec2 vUv;

    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

      vUv = uv;
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float uTime;

    varying vec2 vUv;

    void main() {
      vec2 newUv = vec2(
        vUv.x,
        vUv.y + sin(vUv.x * 10.0 + uTime) * 0.1
      );
      vec4 color = texture2D(tDiffuse, newUv);

      gl_FragColor = color;
    }
  `,
}
const displacementPass = new ShaderPass(DisplacementShader)
effectComposer.addPass(displacementPass)
// ---

const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader)
effectComposer.addPass(gammaCorrectionPass)

if (renderer.getPixelRatio() === 1 && !renderer.capabilities.isWebGL2) {
  console.log('Using SMAA')

  const smaaPass = new SMAAPass()
  effectComposer.addPass(smaaPass)
}
// ------------------------------------------------------------------------------------------------

// Animate
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update passes
  displacementPass.material.uniforms.uTime.value = elapsedTime

  // Update controls
  controls.update()

  // Render
  effectComposer.render()

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
