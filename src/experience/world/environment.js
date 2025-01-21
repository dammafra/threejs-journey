import { DirectionalLight, SRGBColorSpace } from 'three'
import Experience from '../experience'

export default class Environment {
  constructor() {
    // Setup
    this.experience = Experience.instance

    this.debug = this.experience.debug.ui.addFolder(Environment.name)
    this.scene = this.experience.scene
    this.resources = this.experience.resources

    this.setSunLight()
    this.setEnvironmentMap()
  }

  setSunLight() {
    this.sunLight = new DirectionalLight('#ffffff', 4)
    this.sunLight.castShadow = true
    this.sunLight.shadow.camera.far = 15
    this.sunLight.shadow.mapSize.set(1024, 1024)
    this.sunLight.shadow.normalBias = 0.05
    this.sunLight.position.set(3.5, 2, -1.25)
    this.scene.add(this.sunLight)

    this.debug.add(this.sunLight, 'intensity').min(0).max(10).step(0.001).name('lightIntensity') //prettier-ignore
    this.debug.add(this.sunLight.position, 'x').min(-5).max(5).step(0.001).name('lightX') //prettier-ignore
    this.debug.add(this.sunLight.position, 'y').min(-5).max(5).step(0.001).name('lightY') //prettier-ignore
    this.debug.add(this.sunLight.position, 'z').min(-5).max(5).step(0.001).name('lightZ') //prettier-ignore
  }

  setEnvironmentMap() {
    this.scene.environmentIntensity = 0.4
    this.scene.environment = this.resources.items.environmentMapTexture
    this.scene.environment.colorSpace = SRGBColorSpace

    this.debug.add(this.scene, 'environmentIntensity').min(0).max(4).step(0.001)
  }
}
