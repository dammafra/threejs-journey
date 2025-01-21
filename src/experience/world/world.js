import Experience from '../experience'
import Environment from './environment'
import Floor from './floor'
import Fox from './fox'

export default class World {
  constructor() {
    // Setup
    this.experience = Experience.instance

    this.scene = this.experience.scene
    this.resources = this.experience.resources

    this.resources.addEventListener('ready', () => {
      this.floor = new Floor()
      this.fox = new Fox()
      this.environment = new Environment()
    })
  }

  update() {
    if (this.fox) {
      this.fox.update()
    }
  }
}
