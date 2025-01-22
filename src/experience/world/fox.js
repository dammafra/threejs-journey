import { AnimationMixer, Mesh } from 'three'
import Experience from '../experience'

export default class Fox {
  constructor() {
    // Setup
    this.experience = Experience.instance

    this.debug = this.experience.debug.ui.addFolder("fox")
    this.scene = this.experience.scene
    this.time = this.experience.time
    this.resources = this.experience.resources

    this.resource = this.resources.items.foxModel

    this.setModel()
    this.setAnimation()
  }

  setModel() {
    this.model = this.resource.scene
    this.model.scale.set(0.02, 0.02, 0.02)
    this.scene.add(this.model)

    this.model.traverse(child => {
      if (child instanceof Mesh) {
        child.castShadow = true
      }
    })
  }

  setAnimation() {
    const mixer = new AnimationMixer(this.model)
    const actions = {
      idle: mixer.clipAction(this.resource.animations[0]),
      walking: mixer.clipAction(this.resource.animations[1]),
      running: mixer.clipAction(this.resource.animations[2]),
    }

    this.animation = {
      mixer,
      actions,
      last: 'idle',
      current: 'idle',
    }

    this.playAnimation('idle')

    this.debug
      .add(this.animation, 'current', Object.keys(this.animation.actions))
      .onChange(this.playAnimation)
      .name('animation')
  }

  playAnimation = name => {
    const currentAction = this.animation.actions[name]
    const lastAction = this.animation.actions[this.animation.last]

    currentAction.reset()
    currentAction.play()
    currentAction.crossFadeFrom(lastAction, 1)

    this.animation.last = name
  }

  update() {
    this.animation.mixer.update(this.time.delta * 0.001)
  }
}
