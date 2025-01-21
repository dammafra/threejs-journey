import { CircleGeometry, Mesh, MeshStandardMaterial, RepeatWrapping, SRGBColorSpace } from 'three'
import Experience from '../experience'

export default class Floor {
  constructor() {
    // Setup
    this.experience = Experience.instance

    this.scene = this.experience.scene
    this.resources = this.experience.resources

    this.setGeometry()
    this.setTextures()
    this.setMaterial()
    this.setMesh()
  }

  setGeometry() {
    this.geometry = new CircleGeometry(5, 64)
  }

  setTextures() {
    const color = this.resources.items.floorColorTexture
    color.colorSpace = SRGBColorSpace
    color.repeat.set(1.5, 1.5)
    color.wrapS = RepeatWrapping
    color.wrapT = RepeatWrapping

    const normal = this.resources.items.floorNormalTexture
    normal.repeat.set(1.5, 1.5)
    normal.wrapS = RepeatWrapping
    normal.wrapT = RepeatWrapping

    this.textures = {
      color,
      normal,
    }
  }

  setMaterial() {
    this.material = new MeshStandardMaterial({
      map: this.textures.color,
      normalMap: this.textures.normal,
    })
  }

  setMesh() {
    this.mesh = new Mesh(this.geometry, this.material)
    this.mesh.rotation.x = -Math.PI * 0.5
    this.mesh.receiveShadow = true
    this.scene.add(this.mesh)
  }
}
