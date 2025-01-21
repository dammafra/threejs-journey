import GUI from 'lil-gui'

export default class Debug {
  constructor() {
    this.ui = new GUI()
    this.active = window.location.hash === '#debug'

    this.ui.show(this.active)
  }
}
