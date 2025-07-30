import { BlendFunction, Effect } from 'postprocessing'
import { Uniform } from 'three'

const fragmentShader = /* glsl */ `
  uniform float uFrequency;
  uniform float uAmplitude;
  uniform float uOffset;

  void mainUv(inout vec2 uv) {
    uv.y += sin(uv.x * uFrequency + uOffset) * uAmplitude;
  }

  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    outputColor = vec4(0.8, 1.0, 0.5, inputColor.a);
  }
`

export default class DrunkEffect extends Effect {
  constructor({ blendFunction = BlendFunction.DARKEN, frequency = 2, amplitude = 0.1 }) {
    super('DrunkEffect', fragmentShader, {
      blendFunction,
      uniforms: new Map([
        ['uFrequency', new Uniform(frequency)],
        ['uAmplitude', new Uniform(amplitude)],
        ['uOffset', new Uniform(0)],
      ]),
    })
  }

  update(renderer, inputBuffer, deltaTime) {
    this.uniforms.get('uOffset').value += deltaTime
  }
}
